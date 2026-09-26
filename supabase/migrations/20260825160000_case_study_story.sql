-- ============================================================
-- CASE STUDY STORY MODEL
--
-- Gives public.case_studies somewhere to keep a full narrative:
-- problem, approach, solution blocks, before/after, gallery,
-- testimonial and headline metrics.
--
-- Run AFTER 20260825140000_align_live_schema.sql. Safe to re-run.
--
-- Why one jsonb column rather than a column per block: the block list
-- will keep changing as the format is refined, and the shape is
-- validated by Zod in src/actions/admin/case-studies.ts before it is
-- written. One migration now instead of one migration per new idea.
-- ============================================================

alter table public.case_studies
  -- Outcome-led headline, e.g. "Turning an outdated store into a
  -- conversion-focused shopping experience." Distinct from `title`,
  -- which is the short label used in lists and cards.
  add column if not exists headline text,

  -- Free-text industry shown in the hero. Separate from industry_id:
  -- that is a foreign key used for filtering, this is what the client
  -- is actually called in their market.
  add column if not exists industry_label text,

  -- Services delivered, rendered as tags. Plain text rather than
  -- service_id references so a case study can name work that predates
  -- the current service list.
  add column if not exists services text[] not null default '{}',

  -- The narrative. Shape (all keys optional, validated in the action):
  --   {
  --     problem:     { intro, cards: [{ title, note }] },
  --     approach:    [{ title, description }],
  --     solution:    [{ title, description, image }],
  --     beforeAfter: { before, after, caption },
  --     gallery:     [{ image, caption, wide }],
  --     testimonial: { quote, name, role, company, placeholder },
  --     metrics:     [{ value, label, placeholder }]
  --   }
  -- `placeholder: true` marks figures and quotes that are not yet real,
  -- so the page can render them visibly as placeholders instead of
  -- passing invented numbers off as results.
  add column if not exists story jsonb not null default '{}'::jsonb,

  -- Per-page search appearance, same as blog_posts. Included here in
  -- case 20260825140000 has not been applied yet; `if not exists`
  -- makes running both harmless.
  add column if not exists seo_title text,
  add column if not exists seo_description text;

comment on column public.case_studies.headline is
  'Outcome-led hero headline, distinct from the short list title.';
comment on column public.case_studies.story is
  'Narrative blocks. Validated by Zod in src/actions/admin/case-studies.ts.';

-- The homepage strip asks for featured + published on every render.
create index if not exists case_studies_featured_published_idx
  on public.case_studies (featured)
  where status = 'published';

-- ============================================================
-- AFTER RUNNING
--   1. Regenerate src/integrations/supabase/types.ts.
--   2. The temporary withoutSeoColumns() fallback in
--      src/actions/admin/case-studies.ts becomes dead code and
--      should be deleted along with its two call sites.
-- ============================================================
