-- ============================================================
-- WEBRISE — CONTENT, LEADS & BLOG SCHEMA
--
-- Apply with:  supabase db push
--        or:   paste into the Supabase SQL editor and run top to bottom.
--
-- Written to be re-runnable: tables use `if not exists`, policies and
-- triggers are dropped first, seeds use `on conflict do nothing`.
--
-- NOTE: public.audit_requests (created in 20260811155937_*.sql) is left
-- untouched. It is live and the audit form writes to it via the service
-- role. If you later fold audits into public.leads, that is a separate
-- migration plus a change to src/actions/audit-requests.ts.
--
-- Extensions: gen_random_uuid() is core Postgres 13+, so pgcrypto is not
-- needed. pg_trgm is omitted because nothing here uses a trigram index —
-- blog search runs on the tsvector GIN index below. If you add either
-- later, install into the `extensions` schema, not `public`.
-- ============================================================

-- ------------------------------------------------------------
-- 1. ADMIN ROLE HELPER
-- Admins are Supabase Auth users listed in this table. Rows are added
-- by hand (SQL editor / service role) — there is deliberately no policy
-- that lets anyone grant themselves admin.
-- ------------------------------------------------------------
create table if not exists public.admin_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  created_at  timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Security-definer, so it bypasses RLS and cannot recurse into the policy
-- below. `set search_path` is required: without it a caller-controlled
-- search_path could point `admin_users` at a table they own.
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

-- Must NOT be `auth.uid() in (select id from public.admin_users)` — that
-- queries the table the policy protects and errors with 42P17 infinite
-- recursion. is_admin() skips RLS, so it is safe here.
drop policy if exists "admins can read admin_users" on public.admin_users;
create policy "admins can read admin_users"
  on public.admin_users for select
  using (public.is_admin());

-- ------------------------------------------------------------
-- 2. SHARED updated_at TRIGGER
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

-- ------------------------------------------------------------
-- 3. SERVICES (10 pillars: 5 SEO, 4 development, 1 growth)
-- ------------------------------------------------------------
create table if not exists public.services (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name              text not null,
  cluster           text not null check (cluster in ('seo', 'development', 'growth')),
  short_description text,
  hero_copy         text,
  deliverables      jsonb not null default '[]'::jsonb,   -- array of strings
  process_steps     jsonb not null default '[]'::jsonb,   -- array of {title, description}
  seo_title         text,
  seo_description   text,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.services enable row level security;

drop policy if exists "public can read services" on public.services;
create policy "public can read services"
  on public.services for select
  using (true);

drop policy if exists "admins can manage services" on public.services;
create policy "admins can manage services"
  on public.services for all
  using (public.is_admin())
  with check (public.is_admin());

create index if not exists services_cluster_idx on public.services (cluster);
create index if not exists services_sort_order_idx on public.services (sort_order);

insert into public.services (slug, name, cluster, sort_order) values
  ('ai-powered-seo',          'AI-Powered SEO',          'seo',          1),
  ('white-hat-seo',           'White-Hat SEO',           'seo',          2),
  ('guest-posting',           'Guest Posting',           'seo',          3),
  ('local-seo',               'Local SEO',               'seo',          4),
  ('google-business-profile', 'Google Business Profile', 'seo',          5),
  ('web-development',         'Web Development',         'development',  6),
  ('ai-development',          'AI Development',          'development',  7),
  ('app-development',         'App Development',         'development',  8),
  ('saas-mvp-to-production',  'SaaS MVP to Production',  'development',  9),
  ('tiktok-shop',             'TikTok Shop',             'growth',      10)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- 4. INDUSTRIES (vertical pages)
-- ------------------------------------------------------------
create table if not exists public.industries (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  description     text,
  seo_title       text,
  seo_description text,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.industries enable row level security;

drop policy if exists "public can read industries" on public.industries;
create policy "public can read industries"
  on public.industries for select
  using (true);

drop policy if exists "admins can manage industries" on public.industries;
create policy "admins can manage industries"
  on public.industries for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- 5. LEADS (contact form submissions)
--
-- The anon insert policies here and in sections 6 and 11 exist so forms
-- can post with the publishable key. If every submission instead goes
-- through a Server Action or edge function using the service role (which
-- bypasses RLS), drop them — that removes the public spam surface
-- entirely. Either way, put a captcha or rate limit in front.
-- ------------------------------------------------------------
create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text,
  company      text,
  message      text,
  service_id   uuid references public.services(id) on delete set null,
  source_page  text,                 -- e.g. '/contact', '/services/local-seo'
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  status       text not null default 'new'
                 check (status in ('new', 'contacted', 'won', 'lost')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.leads enable row level security;

-- `status = 'new'` stops a submitter marking their own lead as won/lost.
drop policy if exists "anyone can submit a lead" on public.leads;
create policy "anyone can submit a lead"
  on public.leads for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists "admins can read leads" on public.leads;
create policy "admins can read leads"
  on public.leads for select
  using (public.is_admin());

drop policy if exists "admins can update leads" on public.leads;
create policy "admins can update leads"
  on public.leads for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete leads" on public.leads;
create policy "admins can delete leads"
  on public.leads for delete
  using (public.is_admin());

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_service_idx on public.leads (service_id);

-- ------------------------------------------------------------
-- 6. QUOTE REQUESTS
-- ------------------------------------------------------------
create table if not exists public.quote_requests (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text not null,
  phone            text,
  company          text,
  budget_range     text,
  project_timeline text,
  notes            text,
  status           text not null default 'new'
                     check (status in ('new', 'contacted', 'won', 'lost')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.quote_requests enable row level security;

drop policy if exists "anyone can submit a quote request" on public.quote_requests;
create policy "anyone can submit a quote request"
  on public.quote_requests for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists "admins can read quote_requests" on public.quote_requests;
create policy "admins can read quote_requests"
  on public.quote_requests for select
  using (public.is_admin());

drop policy if exists "admins can update quote_requests" on public.quote_requests;
create policy "admins can update quote_requests"
  on public.quote_requests for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete quote_requests" on public.quote_requests;
create policy "admins can delete quote_requests"
  on public.quote_requests for delete
  using (public.is_admin());

create index if not exists quote_requests_status_idx on public.quote_requests (status);
create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);

-- Join table instead of a uuid[] column: a plain array cannot enforce a
-- foreign key, so deleting a service would leave dangling ids behind.
create table if not exists public.quote_request_services (
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  service_id       uuid not null references public.services(id) on delete cascade,
  primary key (quote_request_id, service_id)
);

alter table public.quote_request_services enable row level security;

drop policy if exists "anyone can attach services to a quote" on public.quote_request_services;
create policy "anyone can attach services to a quote"
  on public.quote_request_services for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins can read quote_request_services" on public.quote_request_services;
create policy "admins can read quote_request_services"
  on public.quote_request_services for select
  using (public.is_admin());

drop policy if exists "admins can manage quote_request_services" on public.quote_request_services;
create policy "admins can manage quote_request_services"
  on public.quote_request_services for delete
  using (public.is_admin());

create index if not exists quote_request_services_service_idx
  on public.quote_request_services (service_id);

-- ------------------------------------------------------------
-- 7. BLOG: CATEGORIES, AUTHORS, POSTS
-- ------------------------------------------------------------
create table if not exists public.blog_categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name       text not null,
  sort_order int not null default 0
);

alter table public.blog_categories enable row level security;

drop policy if exists "public can read blog_categories" on public.blog_categories;
create policy "public can read blog_categories"
  on public.blog_categories for select
  using (true);

drop policy if exists "admins can manage blog_categories" on public.blog_categories;
create policy "admins can manage blog_categories"
  on public.blog_categories for all
  using (public.is_admin())
  with check (public.is_admin());

insert into public.blog_categories (slug, name, sort_order) values
  ('seo',             'SEO',             1),
  ('local-seo',       'Local SEO',       2),
  ('web-development', 'Web Development', 3),
  ('ai-development',  'AI Development',  4),
  ('app-development', 'App Development', 5),
  ('saas',            'SaaS',            6),
  ('tiktok-shop',     'TikTok Shop',     7)
on conflict (slug) do nothing;

create table if not exists public.authors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  bio        text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.authors enable row level security;

drop policy if exists "public can read authors" on public.authors;
create policy "public can read authors"
  on public.authors for select
  using (true);

drop policy if exists "admins can manage authors" on public.authors;
create policy "admins can manage authors"
  on public.authors for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  excerpt         text,
  body            text,                 -- markdown or rich text
  category_id     uuid references public.blog_categories(id) on delete set null,
  author_id       uuid references public.authors(id) on delete set null,
  cover_image_url text,
  status          text not null default 'draft'
                    check (status in ('draft', 'published')),
  seo_title       text,
  seo_description text,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- Immutable because the text search config is passed as a literal;
  -- the one-argument to_tsvector(body) form would be rejected here.
  search_vector   tsvector generated always as (
                    to_tsvector(
                      'english',
                      coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body, '')
                    )
                  ) stored
);

alter table public.blog_posts enable row level security;

-- published_at is checked too, so a post scheduled for next week stays
-- hidden until its date passes.
drop policy if exists "public can read published posts" on public.blog_posts;
create policy "public can read published posts"
  on public.blog_posts for select
  using (status = 'published' and (published_at is null or published_at <= now()));

drop policy if exists "admins can read all posts" on public.blog_posts;
create policy "admins can read all posts"
  on public.blog_posts for select
  using (public.is_admin());

drop policy if exists "admins can manage posts" on public.blog_posts;
drop policy if exists "admins can insert posts" on public.blog_posts;
create policy "admins can insert posts"
  on public.blog_posts for insert
  with check (public.is_admin());

drop policy if exists "admins can update posts" on public.blog_posts;
create policy "admins can update posts"
  on public.blog_posts for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete posts" on public.blog_posts;
create policy "admins can delete posts"
  on public.blog_posts for delete
  using (public.is_admin());

create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_category_idx on public.blog_posts (category_id);
create index if not exists blog_posts_author_idx on public.blog_posts (author_id);
create index if not exists blog_posts_search_idx on public.blog_posts using gin (search_vector);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);

-- ------------------------------------------------------------
-- 8. CASE STUDIES
-- ------------------------------------------------------------
create table if not exists public.case_studies (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  client_name     text,               -- may be anonymised, e.g. 'UK hospitality client'
  service_id      uuid references public.services(id) on delete set null,
  industry_id     uuid references public.industries(id) on delete set null,
  summary         text,
  body            text,
  results         jsonb not null default '[]'::jsonb,   -- array of {metric, value, label}
  cover_image_url text,
  seo_title       text,
  seo_description text,
  featured        boolean not null default false,
  status          text not null default 'draft'
                    check (status in ('draft', 'published')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.case_studies enable row level security;

drop policy if exists "public can read published case studies" on public.case_studies;
create policy "public can read published case studies"
  on public.case_studies for select
  using (status = 'published');

drop policy if exists "admins can read all case studies" on public.case_studies;
create policy "admins can read all case studies"
  on public.case_studies for select
  using (public.is_admin());

drop policy if exists "admins can manage case studies" on public.case_studies;
drop policy if exists "admins can insert case studies" on public.case_studies;
create policy "admins can insert case studies"
  on public.case_studies for insert
  with check (public.is_admin());

drop policy if exists "admins can update case studies" on public.case_studies;
create policy "admins can update case studies"
  on public.case_studies for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete case studies" on public.case_studies;
create policy "admins can delete case studies"
  on public.case_studies for delete
  using (public.is_admin());

create index if not exists case_studies_service_idx on public.case_studies (service_id);
create index if not exists case_studies_industry_idx on public.case_studies (industry_id);
create index if not exists case_studies_featured_idx on public.case_studies (featured);
create index if not exists case_studies_status_idx on public.case_studies (status);

-- ------------------------------------------------------------
-- 9. TESTIMONIALS
-- ------------------------------------------------------------
create table if not exists public.testimonials (
  id             uuid primary key default gen_random_uuid(),
  client_name    text not null,
  client_company text,
  quote          text not null,
  rating         int check (rating between 1 and 5),
  service_id     uuid references public.services(id) on delete set null,
  avatar_url     text,
  featured       boolean not null default false,
  created_at     timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "public can read testimonials" on public.testimonials;
create policy "public can read testimonials"
  on public.testimonials for select
  using (true);

drop policy if exists "admins can manage testimonials" on public.testimonials;
create policy "admins can manage testimonials"
  on public.testimonials for all
  using (public.is_admin())
  with check (public.is_admin());

create index if not exists testimonials_service_idx on public.testimonials (service_id);
create index if not exists testimonials_featured_idx on public.testimonials (featured);

-- ------------------------------------------------------------
-- 10. NEWSLETTER SUBSCRIBERS
--
-- The unsubscribe edge function matches on unsubscribe_token and must run
-- with the service role — there is no public update policy here.
--
-- Note: because `email` is unique and anon can insert, a duplicate insert
-- returns a unique-violation, which reveals whether an address is already
-- subscribed. Route signups through a server function if that matters.
-- ------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id                uuid primary key default gen_random_uuid(),
  email             text unique not null,
  status            text not null default 'active'
                      check (status in ('active', 'unsubscribed')),
  source_page       text,
  unsubscribe_token uuid unique not null default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  unsubscribed_at   timestamptz
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "anyone can subscribe" on public.newsletter_subscribers;
create policy "anyone can subscribe"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (status = 'active' and unsubscribed_at is null);

drop policy if exists "admins can read subscribers" on public.newsletter_subscribers;
create policy "admins can read subscribers"
  on public.newsletter_subscribers for select
  using (public.is_admin());

drop policy if exists "admins can update subscribers" on public.newsletter_subscribers;
create policy "admins can update subscribers"
  on public.newsletter_subscribers for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete subscribers" on public.newsletter_subscribers;
create policy "admins can delete subscribers"
  on public.newsletter_subscribers for delete
  using (public.is_admin());

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);

-- ------------------------------------------------------------
-- 11. updated_at TRIGGERS
-- ------------------------------------------------------------
drop trigger if exists set_updated_at on public.services;
create trigger set_updated_at before update on public.services
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.industries;
create trigger set_updated_at before update on public.industries
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.leads;
create trigger set_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.quote_requests;
create trigger set_updated_at before update on public.quote_requests
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.blog_posts;
create trigger set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.case_studies;
create trigger set_updated_at before update on public.case_studies
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 12. GRANTS (matches the convention in the audit_requests migration)
-- ------------------------------------------------------------
grant all on public.admin_users             to service_role;
grant all on public.services                to service_role;
grant all on public.industries              to service_role;
grant all on public.leads                   to service_role;
grant all on public.quote_requests          to service_role;
grant all on public.quote_request_services  to service_role;
grant all on public.blog_categories         to service_role;
grant all on public.authors                 to service_role;
grant all on public.blog_posts              to service_role;
grant all on public.case_studies            to service_role;
grant all on public.testimonials            to service_role;
grant all on public.newsletter_subscribers  to service_role;

-- ------------------------------------------------------------
-- 13. STORAGE BUCKETS
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('blog-media',        'blog-media',        true),
  ('case-study-media',  'case-study-media',  true),
  ('testimonial-media', 'testimonial-media', true),
  ('brand-assets',      'brand-assets',      true)
on conflict (id) do nothing;

drop policy if exists "public read media buckets" on storage.objects;
create policy "public read media buckets"
  on storage.objects for select
  using (bucket_id in ('blog-media', 'case-study-media', 'testimonial-media', 'brand-assets'));

drop policy if exists "admins write media buckets" on storage.objects;
create policy "admins write media buckets"
  on storage.objects for insert
  with check (
    bucket_id in ('blog-media', 'case-study-media', 'testimonial-media', 'brand-assets')
    and public.is_admin()
  );

drop policy if exists "admins update media buckets" on storage.objects;
create policy "admins update media buckets"
  on storage.objects for update
  using (
    bucket_id in ('blog-media', 'case-study-media', 'testimonial-media', 'brand-assets')
    and public.is_admin()
  )
  with check (
    bucket_id in ('blog-media', 'case-study-media', 'testimonial-media', 'brand-assets')
    and public.is_admin()
  );

drop policy if exists "admins delete media buckets" on storage.objects;
create policy "admins delete media buckets"
  on storage.objects for delete
  using (
    bucket_id in ('blog-media', 'case-study-media', 'testimonial-media', 'brand-assets')
    and public.is_admin()
  );

-- ============================================================
-- AFTER RUNNING
--
-- 1. Create your admin account through Supabase Auth, then:
--      insert into public.admin_users (id, full_name)
--      values ('<your-auth-user-uuid>', 'Your Name');
--
-- 2. Regenerate the TypeScript types the app compiles against:
--      bunx supabase gen types typescript --project-id <ref> \
--        --schema public > src/integrations/supabase/types.ts
--
-- 3. Build the edge functions: handle-contact-form, handle-quote-request,
--    handle-newsletter-signup, handle-newsletter-unsubscribe.
-- ============================================================
