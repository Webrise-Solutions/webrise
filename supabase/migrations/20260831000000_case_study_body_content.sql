-- ============================================================
-- CASE STUDY BODY CONTENT
--
-- Adds detailed explanatory body text to all demo case studies.
-- Run after all other migrations have been applied.
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
where slug = 'demo-dental-group-local-visibility' and (body is null or body = ''),
  updated_at = now();

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
where slug = 'demo-ecommerce-category-overhaul' and (body is null or body = ''),
  updated_at = now();

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
where slug = 'demo-saas-migration-recovery' and (body is null or body = ''),
  updated_at = now();

-- ============================================================
-- VERIFY
-- ============================================================
select slug, title, 
       case when body is not null and body != '' then 'HAS BODY' else 'EMPTY' end as body_status,
       length(body) as body_length
from public.case_studies
where slug like 'demo-%'
order by slug;
