-- ============================================================
-- LEAD CAPTURE: ATTRIBUTION, CONSENT AND ABUSE THROTTLING
--
-- Three things, all serving the public forms on /contact,
-- /get-a-quote and /audit:
--
--   1. Attribution columns, so a lead can be traced back to the
--      campaign, referrer and landing page that produced it.
--   2. A consent flag on every lead-capture table. /audit already
--      had one; leads and quote_requests were collecting the tick
--      without recording it, which is the half that matters if
--      anyone ever asks what the submitter agreed to.
--   3. form_submission_log, the counter behind the per-IP rate
--      limit. Rows hold a salted hash, never an address.
--
-- Safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- 1. ATTRIBUTION + CONSENT
--
-- source_page is where the form was submitted from; landing_page is
-- where the visit started. They differ whenever someone arrives on a
-- blog post and converts on /contact, which is the common case and the
-- whole reason both are stored.
-- ------------------------------------------------------------
alter table public.leads
  add column if not exists utm_term     text,
  add column if not exists utm_content  text,
  add column if not exists referrer     text,
  add column if not exists landing_page text,
  add column if not exists consent      boolean not null default false;

alter table public.quote_requests
  add column if not exists source_page  text,
  add column if not exists landing_page text,
  add column if not exists referrer     text,
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term     text,
  add column if not exists utm_content  text,
  add column if not exists consent      boolean not null default false;

-- audit_requests.notes closes a long-standing hole: the audit form has always
-- asked "anything we should know?" and then dropped the answer on the floor,
-- because there was nowhere to put it.
alter table public.audit_requests
  add column if not exists notes        text,
  add column if not exists source_page  text,
  add column if not exists landing_page text,
  add column if not exists referrer     text,
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term     text,
  add column if not exists utm_content  text;

comment on column public.leads.source_page is
  'Path the form was submitted from, e.g. /contact or /services/local-seo.';
comment on column public.leads.landing_page is
  'Path the visit started on. Differs from source_page whenever someone reads first and converts later.';
comment on column public.leads.referrer is
  'External referring origin only. Same-site referrers are dropped before insert.';
comment on column public.leads.consent is
  'What the submitter actually ticked. Never defaulted to true on insert.';

-- Attribution reporting groups by campaign over a date range.
create index if not exists leads_utm_source_idx
  on public.leads (utm_source, created_at desc)
  where utm_source is not null;

create index if not exists quote_requests_utm_source_idx
  on public.quote_requests (utm_source, created_at desc)
  where utm_source is not null;

-- ------------------------------------------------------------
-- 2. RATE LIMIT COUNTER
--
-- One row per accepted submission. The application counts rows in a
-- rolling window before inserting the next one.
--
-- ip_hash is sha256(pepper + address). The pepper lives in the server
-- environment, never in this table, so the column cannot be reversed
-- into an address by anyone reading the database — which keeps a
-- throttling mechanism from quietly becoming a log of who visited.
--
-- RLS on with no policies at all: anon and authenticated get nothing,
-- and the service role bypasses RLS. Nothing in the browser has any
-- business reading or writing this.
-- ------------------------------------------------------------
create table if not exists public.form_submission_log (
  id         bigint generated always as identity primary key,
  form       text        not null,
  ip_hash    text        not null,
  created_at timestamptz not null default now()
);

alter table public.form_submission_log enable row level security;

comment on table public.form_submission_log is
  'Per-IP submission counter for form rate limiting. Pseudonymous: stores a salted hash, never an address. Pruned to 7 days.';
comment on column public.form_submission_log.ip_hash is
  'sha256(pepper + client address). The pepper is server-side only, so this is not reversible from the database alone.';

-- The throttle check is: how many rows for this hash and form since T.
create index if not exists form_submission_log_lookup_idx
  on public.form_submission_log (ip_hash, form, created_at desc);

-- Pruning scans by age alone.
create index if not exists form_submission_log_created_idx
  on public.form_submission_log (created_at);

-- Nothing here is worth keeping once the window has passed. The app
-- calls this occasionally after a submission; schedule it with pg_cron
-- instead if you would rather it not ride along with a request.
create or replace function public.prune_form_submission_log()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.form_submission_log
  where created_at < now() - interval '7 days';
$$;

-- Revoking from PUBLIC takes EXECUTE away from every role, service_role
-- included, so grant it straight back to the one caller that needs it: the
-- app prunes via supabaseAdmin.rpc(), which authenticates as service_role.
revoke all on function public.prune_form_submission_log() from public, anon, authenticated;
grant execute on function public.prune_form_submission_log() to service_role;

-- Supabase reloads the PostgREST schema cache on DDL by itself, but an
-- explicit nudge costs nothing and saves a confusing PGRST204/PGRST205 in the
-- minute after this runs.
notify pgrst, 'reload schema';
