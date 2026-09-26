-- Separate, orderable team module for the public About page and admin area.
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 120),
  role        text not null check (char_length(role) between 2 and 160),
  image_url   text,
  tone        text not null default 'night' check (tone in ('night', 'teal', 'rust')),
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.team_members enable row level security;

drop policy if exists "public can read published team members" on public.team_members;
create policy "public can read published team members"
  on public.team_members for select
  to anon, authenticated
  using (published = true);

drop policy if exists "admins can manage team members" on public.team_members;
create policy "admins can manage team members"
  on public.team_members for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create index if not exists team_members_public_order_idx
  on public.team_members (sort_order, name) where published = true;

drop trigger if exists set_team_members_updated_at on public.team_members;
create trigger set_team_members_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

insert into public.team_members (name, role, image_url, tone, sort_order)
select seed.name, seed.role, seed.image_url, seed.tone, seed.sort_order
from (values
  ('Danyal Zafar', 'Owner & SEO Specialist', '/team/danyal-zafar.jpg', 'night', 1),
  ('Dawood Zafar', 'Backend & DevOps Engineer', '/team/dawood-zafar.png', 'teal', 2),
  ('Ghulam Saqlain', 'Full-Stack Developer', '/team/ghulam-saqlain.png', 'rust', 3)
) as seed(name, role, image_url, tone, sort_order)
where not exists (
  select 1 from public.team_members existing where existing.name = seed.name
);

-- Dedicated public bucket. Uploads still go through the authenticated admin action.
insert into storage.buckets (id, name, public)
values ('team-media', 'team-media', true)
on conflict (id) do update set public = true;

drop policy if exists "public can read team media" on storage.objects;
create policy "public can read team media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'team-media');

drop policy if exists "admins can manage team media" on storage.objects;
create policy "admins can manage team media"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'team-media' and public.is_admin())
  with check (bucket_id = 'team-media' and public.is_admin());
