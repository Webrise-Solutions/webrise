-- ============================================================
-- EDITOR FIELDS: TAGS AND COVER IMAGE ALT TEXT
--
-- tags            free-form labels, separate from blog_categories
--                 (a post has one category but many tags)
-- cover_image_alt what a screen reader announces for the cover image.
--                 Inline images inside `body` carry their own alt text in
--                 the markdown itself, so only the cover needs a column.
--
-- Safe to re-run.
-- ============================================================

alter table public.blog_posts
  add column if not exists tags text[] not null default '{}',
  add column if not exists cover_image_alt text;

alter table public.case_studies
  add column if not exists tags text[] not null default '{}',
  add column if not exists cover_image_alt text;

comment on column public.blog_posts.tags is
  'Free-form labels. Distinct from category_id, which is a single taxonomy.';
comment on column public.blog_posts.cover_image_alt is
  'Alt text for cover_image_url. Empty means decorative.';

-- Tag filtering is a containment query, which needs GIN to stay quick.
create index if not exists blog_posts_tags_idx on public.blog_posts using gin (tags);
create index if not exists case_studies_tags_idx on public.case_studies using gin (tags);
