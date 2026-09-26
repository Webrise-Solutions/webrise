# Demo content — invented, not real

Everything listed here was generated to fill the admin and the public
templates while the site is being built. **None of it describes a real client,
and none of the numbers are measured results.**

The testimonials read naturally on purpose, so the layout can be judged. That
is exactly why this file exists: once they look real, the only thing keeping
them from being mistaken for real is a record of which rows they are.

## Before the site goes public

Replace these with genuine content, or delete them:

```sql
delete from public.testimonials where id in (
  '53535db4-8cce-457b-b33f-36b554a67270',  -- Amara Osei, Osei Dental Care
  'bf9c2550-eb0c-42dc-9f61-091bc3d434fd',  -- Daniel Whitmore, Whitmore & Clarke
  '57647aa9-36ae-4e7e-97b0-8e93ddbc4e31',  -- Hannah Lindqvist, Nordwell Studio
  '714486ea-68a8-4d49-b5ae-5b5329a87ddd',  -- Marcus Bell, Bell Roofing
  'd549c228-4f54-4e65-9fdd-96a267276c21',  -- Oliver Nakamura, Loopcast
);

delete from public.case_studies where slug like 'demo-%';
delete from public.blog_posts   where slug like 'demo-%';
delete from public.leads          where email like '%@example.com';
delete from public.quote_requests where email like '%@example.com';
delete from public.newsletter_subscribers where email like '%@example.com';
delete from public.audit_requests where email like '%@example.com';
delete from public.authors where name like '%(sample)';
```

Storage objects to remove alongside them:

- `case-study-media/covers/` — three generated cover images

## What is here

| Table | Rows | Identifiable by |
| --- | --- | --- |
| testimonials | 5 | the ids listed above — **no marker in the content itself** |
| case_studies | 3 | `slug` starts `demo-` |
| blog_posts | 6 | `slug` starts `demo-` |
| leads, quote_requests, newsletter_subscribers, audit_requests | seeded | `email` ends `@example.com` |
| authors | 2 | name ends `(sample)` |
| industries, services | real | seeded from `src/data/site.ts`, keep these |

## Case studies

- `demo-dental-group-local-visibility` — Filling the diary for a three-clinic dental group
- `demo-ecommerce-category-overhaul` — Rebuilding category pages around buyer intent
- `demo-saas-migration-recovery` — Holding rankings through a platform migration

Metrics on these are invented. The `label` field now reads as a timeframe
("in 6 months") rather than the word "illustrative", so nothing on the page
flags them as placeholders any more.

## Testimonials

- Amara Osei, Osei Dental Care — `53535db4-8cce-457b-b33f-36b554a67270`
- Daniel Whitmore, Whitmore & Clarke — `bf9c2550-eb0c-42dc-9f61-091bc3d434fd`
- Hannah Lindqvist, Nordwell Studio — `57647aa9-36ae-4e7e-97b0-8e93ddbc4e31`
- Marcus Bell, Bell Roofing — `714486ea-68a8-4d49-b5ae-5b5329a87ddd`
- Oliver Nakamura, Loopcast — `d549c228-4f54-4e65-9fdd-96a267276c21`

Two of the case studies are **published**, so they are publicly reachable now.
