-- Keep the later portfolio-card descriptions at the same level of detail as
-- the first five published case studies. Safe to run more than once.

update public.case_studies
set summary = 'New staff can create an account, follow a guided document and compliance journey, and always see what remains. Reviewers get one dashboard for checking applications, requesting changes, and moving each person forward.',
    updated_at = now()
where slug = 'logan-express-care';

update public.case_studies
set summary = 'Ordering drinking water is simple until delivery dates, bottle returns, customer feedback, and staff handovers become a manual operation. We brought the catalogue, delivery schedule, and team dashboard into one connected platform.',
    updated_at = now()
where slug = 'oriva-pure';

update public.case_studies
set summary = 'A Finnish marketplace for pre-owned furniture that connects listing, discovery, secure payment, and delivery. Sellers can move items without juggling separate tools, while buyers get a clear journey from search to arrival.',
    updated_at = now()
where slug = 'muuttomyynti';

update public.case_studies
set summary = 'A travel website for a Vienna operator running curated tours across Europe. Routes, dates, inclusions, and booking choices are organised into a clear journey that helps travellers compare trips and enquire with confidence.',
    updated_at = now()
where slug = 'eets-travel';

update public.case_studies
set summary = 'A GMP-certified supplements brand needed a Shopify storefront that simplified product choice, made quality and compliance signals easy to verify, and supported the journey from first-time browsing to confident repeat orders.',
    updated_at = now()
where slug = 'health-maker';

update public.case_studies
set summary = 'A focused digital home for an astrobiomantic practice, bringing services, educational content, and booking into one coherent experience. Visitors can understand the approach, choose the right reading, and take the next step easily.',
    updated_at = now()
where slug = 'astrobiomancy';

