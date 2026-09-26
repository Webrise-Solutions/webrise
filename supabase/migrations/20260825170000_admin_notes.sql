-- ============================================================
-- INTERNAL ADMIN NOTES ON SUBMISSIONS
--
-- Deliberately named admin_notes, not notes: quote_requests.notes
-- already exists and holds what the *submitter* typed. leads.message
-- is the equivalent field on the other table. These new columns are
-- private staff annotations and must not be confused with either.
--
-- Safe to re-run.
-- ============================================================

alter table public.leads
  add column if not exists admin_notes text;

alter table public.quote_requests
  add column if not exists admin_notes text;

comment on column public.leads.admin_notes is
  'Private staff notes. Never rendered on the public site.';
comment on column public.quote_requests.admin_notes is
  'Private staff notes. Distinct from notes, which the submitter wrote.';

-- The admin lists filter on status and sort on created_at.
create index if not exists leads_status_created_idx
  on public.leads (status, created_at desc);
create index if not exists quote_requests_status_created_idx
  on public.quote_requests (status, created_at desc);
