-- ============================================================
-- ALIGN LIVE SCHEMA (project jkgrdfoeyphxrriuzvlk)
--
-- The project already has the content/lead tables, but from an earlier
-- revision of the schema. Verified against the live REST schema on
-- 2026-08-25:
--   * services.seo_title / seo_description     -> missing
--   * industries.seo_title / seo_description   -> missing
--   * case_studies.seo_title / seo_description -> missing
--   * blog_posts.seo_title / seo_description   -> present
--   * public.audit_requests                    -> MISSING (the live audit
--     form inserts into it, so every submission currently fails)
--   * admin_users select policy                -> recursive, returns
--     42P17 on every anon read
--
-- Safe to run more than once.
-- ============================================================

-- ------------------------------------------------------------
-- 1. FIX: infinite recursion on admin_users
-- The old policy queried the table it protects. is_admin() is
-- security definer, so it bypasses RLS and cannot recurse.
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users where id = auth.uid()
  );
$$;

drop policy if exists "admins can read admin_users" on public.admin_users;
create policy "admins can read admin_users"
  on public.admin_users for select
  using (public.is_admin());

-- ------------------------------------------------------------
-- 2. SEO FIELDS
-- ------------------------------------------------------------
alter table public.services
  add column if not exists seo_title       text,
  add column if not exists seo_description text;

alter table public.industries
  add column if not exists seo_title       text,
  add column if not exists seo_description text;

alter table public.case_studies
  add column if not exists seo_title       text,
  add column if not exists seo_description text;

-- Leads are form submissions and have no page to describe.
alter table public.leads
  drop column if exists seo_title,
  drop column if exists seo_description;

-- ------------------------------------------------------------
-- 3. RESTORE public.audit_requests
-- Matches 20260811155937_*.sql, which was never applied to this
-- project. Writes go through the service role (src/actions/
-- audit-requests.ts), so RLS stays on with no policies.
-- ------------------------------------------------------------
create table if not exists public.audit_requests (
  id            uuid primary key default gen_random_uuid(),
  website_url   text not null,
  name          text not null,
  email         text not null,
  business_type text not null,
  consent       boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists audit_requests_created_at_idx
  on public.audit_requests (created_at desc);

grant all on public.audit_requests to service_role;

alter table public.audit_requests enable row level security;

-- ------------------------------------------------------------
-- 4. updated_at ON MUTABLE-STATUS TABLES
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.leads
  add column if not exists updated_at timestamptz not null default now();

alter table public.quote_requests
  add column if not exists updated_at timestamptz not null default now();

alter table public.industries
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists set_updated_at on public.leads;
create trigger set_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.quote_requests;
create trigger set_updated_at before update on public.quote_requests
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.industries;
create trigger set_updated_at before update on public.industries
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 5. HARDEN PUBLIC INSERT POLICIES
-- Scoped to anon/authenticated, and a submitter can no longer set
-- their own record to 'won'.
-- ------------------------------------------------------------
drop policy if exists "anyone can submit a lead" on public.leads;
create policy "anyone can submit a lead"
  on public.leads for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists "anyone can submit a quote request" on public.quote_requests;
create policy "anyone can submit a quote request"
  on public.quote_requests for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists "anyone can subscribe" on public.newsletter_subscribers;
create policy "anyone can subscribe"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (status = 'active' and unsubscribed_at is null);

-- ------------------------------------------------------------
-- 6. MISSING INDEXES AND CONSTRAINTS
-- ------------------------------------------------------------
create index if not exists leads_email_idx        on public.leads (email);
create index if not exists leads_service_idx      on public.leads (service_id);
create index if not exists blog_posts_author_idx  on public.blog_posts (author_id);
create index if not exists testimonials_service_idx on public.testimonials (service_id);
create index if not exists case_studies_status_idx  on public.case_studies (status);

create unique index if not exists newsletter_subscribers_token_key
  on public.newsletter_subscribers (unsubscribe_token);

-- Scheduled posts stay hidden until their publish date passes.
drop policy if exists "public can read published posts" on public.blog_posts;
create policy "public can read published posts"
  on public.blog_posts for select
  using (status = 'published' and (published_at is null or published_at <= now()));

-- ============================================================
-- NOT INCLUDED — needs a decision first
--
-- quote_requests.service_ids is still a uuid[] with no referential
-- integrity. Moving it to a quote_request_services join table means
-- migrating existing rows; the table is empty today, so now is the
-- cheapest time to do it. See section 6 of
-- 20260825120000_webrise_content_and_leads.sql for the table.
-- ============================================================
