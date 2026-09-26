-- ============================================================
-- WEBRISE — PENDING SCHEMA CHANGES
--
-- Paste the whole file into the Supabase SQL editor and run it once.
-- Every statement is guarded (if not exists / create or replace), so
-- running it twice is harmless.
--
-- This is a convenience copy of the migrations that have not been
-- applied yet. supabase/migrations/ remains the source of truth;
-- regenerate this file rather than editing it.
--
-- CURRENTLY PENDING
--   20260828120000_lead_capture.sql
--     1. Attribution columns on leads, quote_requests and audit_requests
--        (utm_*, referrer, landing_page, source_page)
--     2. consent recorded on leads and quote_requests, and notes on
--        audit_requests — the audit form has always asked for notes and
--        then had nowhere to put the answer
--     3. form_submission_log + prune_form_submission_log(), the counter
--        behind the per-IP rate limit on the public forms
--   20260831000000_case_study_body_content.sql
--     Detailed body content for all demo case studies
--
-- Until this runs, the forms still work: the insert helper retries
-- without the new columns and logs a warning, and the rate limiter
-- fails open. Attribution and consent are simply not recorded.
-- Case studies will display without body content.
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

create index if not exists leads_utm_source_idx
  on public.leads (utm_source, created_at desc)
  where utm_source is not null;

create index if not exists quote_requests_utm_source_idx
  on public.quote_requests (utm_source, created_at desc)
  where utm_source is not null;

-- ------------------------------------------------------------
-- 2. RATE LIMIT COUNTER
--
-- ip_hash is sha256(pepper + address). The pepper lives in the server
-- environment, never in this table, so the column cannot be reversed
-- into an address by anyone reading the database.
--
-- RLS on with no policies at all: anon and authenticated get nothing,
-- and the service role bypasses RLS.
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

create index if not exists form_submission_log_lookup_idx
  on public.form_submission_log (ip_hash, form, created_at desc);

create index if not exists form_submission_log_created_idx
  on public.form_submission_log (created_at);

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

-- ------------------------------------------------------------
-- 3. VERIFY
--
-- Returns one row per thing this file was supposed to do. Every `ok`
-- column should read true. Safe to re-run on its own at any time.
-- ------------------------------------------------------------
select 'leads attribution'        as item,
       count(*) = 5  as ok, count(*) as found, 5 as expected
from information_schema.columns
where table_schema = 'public' and table_name = 'leads'
  and column_name in ('utm_term','utm_content','referrer','landing_page','consent')
union all
select 'quote_requests attribution',
       count(*) = 9, count(*), 9
from information_schema.columns
where table_schema = 'public' and table_name = 'quote_requests'
  and column_name in ('source_page','landing_page','referrer','utm_source',
                      'utm_medium','utm_campaign','utm_term','utm_content','consent')
union all
select 'audit_requests attribution + notes',
       count(*) = 9, count(*), 9
from information_schema.columns
where table_schema = 'public' and table_name = 'audit_requests'
  and column_name in ('notes','source_page','landing_page','referrer','utm_source',
                      'utm_medium','utm_campaign','utm_term','utm_content')
union all
select 'form_submission_log table',
       count(*) = 1, count(*), 1
from information_schema.tables
where table_schema = 'public' and table_name = 'form_submission_log'
union all
select 'form_submission_log RLS on',
       coalesce(bool_and(rowsecurity), false), count(*)::int, 1
from pg_tables
where schemaname = 'public' and tablename = 'form_submission_log'
union all
select 'form_submission_log has no policies',
       count(*) = 0, count(*), 0
from pg_policies
where schemaname = 'public' and tablename = 'form_submission_log'
union all
select 'prune function executable by service_role',
       count(*) = 1, count(*), 1
from information_schema.routine_privileges
where routine_schema = 'public'
  and routine_name = 'prune_form_submission_log'
  and grantee = 'service_role'
  and privilege_type = 'EXECUTE'
order by 1;

-- ============================================================
-- 4. CASE STUDY BODY CONTENT
--
-- Adds detailed explanatory body text to all demo case studies.
-- Safe to re-run; updates only if body is NULL or empty.
--
-- ============================================================

-- 1. Dental Group - Local Visibility
-- Filling the diary for a three-clinic dental group

update public.case_studies
set body = $dental$<h2>The Challenge</h2>
<p>A three-clinic dental group spanning three suburbs was invisible in local search. Despite offering specialist services—cosmetic dentistry, orthodontics, and implants—they struggled to fill appointment slots. Patients were finding competitors first. The group had an outdated website with no local business profiles, inconsistent clinic information across the web, and minimal online presence in any of their markets.</p>

<h2>Our Approach</h2>
<p>We started with a comprehensive local SEO audit covering all three clinic locations. We identified that their Google Business Profiles were incomplete and inconsistent, with missing photos, outdated hours, and no service categories. We also found they were missing citations in high-authority local directories relevant to dentistry.</p>

<p>Our strategy was three-pronged:</p>
<ul>
<li><strong>Google Business Profile Optimization</strong> — We completed and verified all three clinic profiles, added high-quality photos of the team and facilities, optimized service descriptions, and ensured consistent information across all locations.</li>
<li><strong>Citation Building</strong> — We secured listings on dental-specific directories, health platforms, and local business registries to build trust and provide multiple pathways for patients to find them.</li>
<li><strong>Local Content & Schema</strong> — We restructured the website to serve location-specific pages, added schema markup for each clinic, and created content targeting local search queries like "[suburb] cosmetic dentist" and "[suburb] dental implants".</li>
</ul>

<h2>The Results</h2>
<p>Within six months, the group appeared in the map pack for all three suburbs. Clinic inquiries increased, and they expanded their hours to accommodate the demand. The specialist service pages began ranking for high-intent local queries, bringing qualified leads from patients actively searching for those specific treatments.</p>

<h2>Key Takeaway</h2>
<p>For multi-location service businesses, consistency and completeness across all local signals—profiles, citations, and website structure—are the foundation of visibility. When patients search for services near them, being everywhere they look matters.</p>$dental$
where slug = 'demo-dental-group-local-visibility' and (body is null or body = '');

-- 2. E-commerce - Category Overhaul
-- Rebuilding category pages around buyer intent

update public.case_studies
set body = $ecommerce$<h2>The Challenge</h2>
<p>An e-commerce store selling sustainable home goods ranked for hundreds of keywords but wasn't converting. Traffic was steady, but cart abandonment was high and average order value stagnant. Analysis revealed the problem: category pages were built for search engines, not buyers. They listed products alphabetically, lacked clear guidance on choosing between options, and didn't address the customer journey from problem recognition to purchase.</p>

<h2>Our Approach</h2>
<p>We began by mapping buyer intent across categories. For each section—kitchen, bedding, cleaning—we researched what questions buyers asked before buying. We then rebuilt the category pages to answer those questions first, positioning the right products for each stage of the decision.</p>

<p>The new structure included:</p>
<ul>
<li><strong>Intent-Based Sorting</strong> — Instead of alphabetical, products were arranged by use case: "Best for durability," "Best for budget," "Best for storage," etc. This let shoppers self-select based on their priorities.</li>
<li><strong>Decision Guides</strong> — Each category opened with a short guide covering the most common questions: "How to choose the right coffee filter," "Microfiber vs. cotton—what's the difference?" These built trust and reduced comparison-shopping friction.</li>
<li><strong>Scarcity & Social Proof</strong> — We added review summaries, "bestseller" tags, and quantity indicators to reduce decision paralysis and encourage commitment.</li>
<li><strong>Contextual CTA Placement</strong> — Calls to action were positioned after the guide and product comparison, where intent was highest.</li>
</ul>

<h2>The Results</h2>
<p>Average order value increased by 34% within three months. Cart abandonment fell from 68% to 52%. Traffic to category pages remained stable, but conversion rate nearly doubled. The data showed buyers were spending more time reading guides and making confident choices rather than bouncing between options.</p>

<h2>Key Takeaway</h2>
<p>E-commerce ranking means nothing without conversion. Pages optimized only for search algorithms ignore the buyer's actual journey. When you structure categories around intent and remove friction from comparison, sales follow.</p>$ecommerce$
where slug = 'demo-ecommerce-category-overhaul' and (body is null or body = '');

-- 3. SaaS - Migration Recovery
-- Holding rankings through a platform migration

update public.case_studies
set body = $saas$<h2>The Challenge</h2>
<p>A SaaS company migrated from Drupal to a custom Node.js platform. The migration was necessary for performance and scalability, but it introduced significant SEO risk: 280 pages needed to be redirected, URLs changed substantially, and the robots.txt was briefly misconfigured during deployment. Within weeks, organic traffic plummeted by 41%. Backlinks were broken, internal link structure was disrupted, and pages that ranked weren't crawlable.</p>

<h2>Our Approach</h2>
<p>We moved fast but carefully. First, we conducted a content audit to map old URLs to new ones with surgical precision, then implemented 301 redirects for every migrated page. We audited the new site's crawlability, fixed robots.txt and sitemap.xml, and worked with the dev team to ensure pagination, breadcrumbs, and schema markup carried forward correctly.</p>

<p>Our recovery strategy included:</p>
<ul>
<li><strong>Redirect Audit & Implementation</strong> — We built a comprehensive redirect map, tested each one, and identified orphaned pages that should have been redirected but weren't.</li>
<li><strong>Technical Fix Prioritization</strong> — We identified crawl errors, fixed canonical tag issues on paginated content, and resolved redirect chains that were bleeding PageRank.</li>
<li><strong>Backlink Recovery</strong> — We reached out to high-authority linking domains to update links from the old site to the new one, preventing link equity loss.</li>
<li><strong>Recrawl & Re-indexing</strong> — We submitted the new sitemap to Google Search Console, requested recrawls for critical pages, and monitored index status daily.</li>
</ul>

<h2>The Results</h2>
<p>Within six months, organic traffic fully recovered and surpassed pre-migration levels by 12%. Most previously ranking pages reestablished positions within 90 days. The new platform's performance improvements compounded SEO gains: Core Web Vitals passed, page speed became a ranking advantage, and bounce rate improved. By month eight, the site ranked for 18% more keywords than before the migration.</p>

<h2>Key Takeaway</h2>
<p>Technical migrations are SEO events, not afterthoughts. The difference between a successful migration and a traffic crater lies in planning, testing, and careful hand-offs between old and new infrastructure. With the right preparation, migration can be a ranking recovery opportunity.</p>$saas$
where slug = 'demo-saas-migration-recovery' and (body is null or body = '');

-- ============================================================
-- VERIFY BODY CONTENT
-- ============================================================
select slug, title, 
       case when body is not null and body != '' then 'HAS BODY' else 'EMPTY' end as body_status,
       length(body) as body_length
from public.case_studies
where slug like 'demo-%'
order by slug;
