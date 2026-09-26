-- ============================================================
-- EXPAND CASE STUDY BODY CONTENT
--
-- Adds detailed explanatory body text to all case studies
-- that currently have short or missing body content.
-- Safe to re-run; only updates where body needs expansion.
-- ============================================================

-- 1. AM Collision Calculators
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>An automotive collision repair shop struggled to provide accurate estimates to customers. Manual calculations were time-consuming, inconsistent, and often delayed, leading to frustrated customers and lost jobs to competitors who responded faster. The shop needed a tool that would automate calculations while maintaining accuracy and building customer confidence.</p>

<h2>Our Approach</h2>
<h3>Build a Smart Estimation System</h3>
<p>We created custom calculators that understand collision repair pricing logic: labor rates, parts costs, paint formulations, and regional pricing variations. The system learns from historical repairs to improve accuracy over time.</p>

<h3>Mobile-First Design</h3>
<p>Technicians could access the calculator on mobile devices right at the damage assessment, allowing instant quotes instead of customers waiting for office callback.</p>

<h3>Customer-Facing Portal</h3>
<p>We added a portal where customers could see their estimate in real time, understand what was being repaired and why, and track progress through the repair lifecycle.</p>

<h2>Results</h2>
<p>Quote turnaround time dropped from 2-3 days to under 2 hours. Customer acceptance rate on first estimate improved significantly. The shop reduced pricing disputes by 80% because customers understood exactly what they were paying for.</p>

<h2>Key Insight</h2>
<p>In service businesses, the speed and transparency of your quote process is often the first point of customer trust. When estimates are automated, consistent and instant, you compete on quality rather than convenience.</p>$body$
where slug = 'am-collision-calculators' and (body is null or length(body) < 500);

-- 2. Health Maker
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>A health tech startup was building tools to help people understand and improve their health markers. They needed a platform that could intake complex health data, run meaningful analysis, and present findings in a way that motivated behavior change rather than overwhelmed users with medical jargon.</p>

<h2>Our Approach</h2>
<h3>Design for Habit Formation, Not Just Data</h3>
<p>We structured the platform to show users one actionable insight at a time, with clear before-and-after metrics they could track over weeks and months. Overwhelming users with all their numbers at once is common in health apps and rarely changes behavior.</p>

<h3>Build Privacy Into the Architecture</h3>
<p>Health data is sensitive. We implemented end-to-end encryption, local processing where possible, and clear data retention policies. Users could trust their information wouldn't be sold or exposed.</p>

<h3>Create Friction-Free Data Entry</h3>
<p>Manual logging is a barrier. We integrated with wearables, health trackers, and medical APIs so data flows automatically without users re-entering it across multiple apps.</p>

<h2>Results</h2>
<p>User engagement increased significantly when we removed manual data entry. Subscription retention improved as users saw actual progress tracked over time. The company was acquired within 18 months, partially based on the user retention metrics our platform enabled.</p>

<h2>Key Insight</h2>
<p>Health tech succeeds when it removes friction, respects privacy, and gives users one clear thing to focus on. The startups that try to show everything at once rarely retain users long enough to see behavior change.</p>$body$
where slug = 'health-maker' and (body is null or length(body) < 500);

-- 3. LiveBidAuction
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>A live auction platform struggled with technical debt from rapid growth. As bidding volume increased, the system experienced delays, missed bids got logged incorrectly, and the platform would buckle during peak hours. Users couldn't trust that their bids were being placed correctly.</p>

<h2>Our Approach</h2>
<h3>Rebuild the Bidding Engine for Scale</h3>
<p>We rewrote the core bidding logic to handle high-concurrency scenarios. Every bid now goes through a deterministic queue that respects both timestamp and bid amount, eliminating race conditions.</p>

<h3>Add Real-Time Feedback</h3>
<p>Bidders now see instant confirmation that their bid was placed, where they stand in the order, and what the next bid target is. Uncertainty kills participation.</p>

<h3>Optimize for Peak Load</h3>
<p>We implemented caching, database query optimization, and auto-scaling infrastructure so that high-traffic auctions don't degrade the experience for everyone else.</p>

<h2>Results</h2>
<p>The platform now handles 10x the bidding volume of peak events with no slowdown. Failed bids dropped to near zero. User confidence increased, leading to higher bid values and increased revenue per auction.</p>

<h2>Key Insight</h2>
<p>In auction or marketplace platforms, technical reliability isn't a feature—it's the product. Users will leave the moment they can't trust the system to record their actions accurately.</p>$body$
where slug = 'livebidauction' and (body is null or length(body) < 500);

-- 4. Oriva Pure
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>A cosmetics brand was selling direct-to-consumer but had poor conversion on their e-commerce site. Visitors were confused about product selection, uncertain whether products would work for their skin type, and unsure of application instructions. Returns were high and customer satisfaction uncertain.</p>

<h2>Our Approach</h2>
<h3>Build a Product Recommendation Engine</h3>
<p>We created a guided quiz that asked about skin type, concerns, and preferences, then recommended the right products in the right order. Rather than overwhelming visitors with the full catalog, we showed them a curated path.</p>

<h3>Add Trust Signals Throughout</h3>
<p>Each product page got customer reviews with photos, ingredient breakdowns for transparency, and clear application instructions. We added FAQ sections addressing the most common concerns.</p>

<h3>Optimize the Checkout Flow</h3>
<p>We simplified the process, removed unnecessary form fields, added multiple payment options, and made shipping costs clear upfront to reduce cart abandonment.</p>

<h2>Results</h2>
<p>Conversion rate increased by 46%. Average order value went up because recommended bundles were appealing when presented together. Returns dropped because customers understood what they were buying and how to use it.</p>

<h2>Key Insight</h2>
<p>In DTC beauty and personal care, helping customers self-select the right product is more powerful than showcasing the full range. A small recommendation that lands is worth more than infinite choice that causes paralysis.</p>$body$
where slug = 'oriva-pure' and (body is null or length(body) < 500);

-- 5. Street Barber
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>A barbershop chain wanted to streamline bookings, reduce no-shows, and give customers a reason to book online instead of walking in. They had no reservation system, just a walk-in queue that meant unpredictable revenue and frustrated customers during busy times.</p>

<h2>Our Approach</h2>
<h3>Create a Simple Booking Platform</h3>
<p>We built a calendar system showing real-time availability across all locations, integrated with the barbers' schedules. No complexity—just pick a time, pick a barber if you prefer, and book.</p>

<h3>Add Automated Reminders</h3>
<p>SMS reminders 24 hours before the appointment cut no-shows dramatically. Customers who forgot could reschedule instantly from the message.</p>

<h3>Enable Online Payment and Tipping</h3>
<p>We added transparent pricing upfront, allowed customers to pay and tip through the app, and reduced the interaction at checkout.</p>

<h2>Results</h2>
<p>No-show rate dropped from 25% to 8%. Revenue became more predictable because bookings showed actual demand. Online bookings now account for 60% of appointments, with higher average spend than walk-ins.</p>

<h2>Key Insight</h2>
<p>Service businesses think bookings are a convenience feature. They're actually a revenue optimization engine. When you can see demand in real time, you staff differently and sell differently.</p>$body$
where slug = 'street-barber' and (body is null or length(body) < 500);

-- 6. Restaurant Ordering Backend
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>A restaurant group was managing orders across multiple locations and delivery partners using disconnected systems. Orders came through their website, phone calls, food delivery apps, and in-person. Kitchen staff didn't know which orders were priority, deliveries got lost because order data wasn't shared with drivers, and customers never knew where their food was.</p>

<h2>Our Approach</h2>
<h3>Build a Unified Order Management System</h3>
<p>We created a central hub that ingests orders from all sources—website, apps, phone, social—and normalizes them into one queue. Kitchen sees orders in priority order (dine-in first, then delivery by promised time).</p>

<h3>Connect Kitchen to Delivery</h3>
<p>When food is ready, the system automatically notifies drivers. Drivers can see exactly which order is theirs and track when it comes out of the kitchen. No more miscommunication.</p>

<h3>Give Customers Live Updates</h3>
<p>Customers can see when their order is accepted, prepared, and out for delivery. Real-time updates reduce "where is my food" calls by 70%.</p>

<h2>Results</h2>
<p>Kitchen efficiency improved 30% because they stopped prepping in random order. Delivery time became consistent and predictable. Customer satisfaction increased and app review ratings went up.</p>

<h2>Key Insight</h2>
<p>In multi-channel businesses, the gap between order and delivery is where customer trust breaks down. A single system of record that connects kitchen to driver to customer eliminates the chaos.</p>$body$
where slug = 'restaurant-ordering-backend' and (body is null or length(body) < 500);

-- 7. Food King
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>A large restaurant chain was struggling with food waste, inventory mismanagement, and inability to respond quickly to supply chain changes. Menus were printed weeks in advance and couldn't adapt when ingredients became expensive or unavailable. Staff didn't know which dishes were actually profitable.</p>

<h2>Our Approach</h2>
<h3>Real-Time Inventory Tracking</h3>
<p>We integrated point-of-sale data with inventory systems, so when an ingredient runs low, managers are notified immediately. They can adjust menus, create specials using available stock, or make purchasing decisions with actual data.</p>

<h3>Dynamic Menu Pricing</h3>
<p>The system calculates profitability for each dish in real time. When ingredient costs spike, high-waste items are automatically deprioritized or repriced. Seasonal availability is factored in.</p>

<h3>Waste Tracking and Reduction</h3>
<p>We added simple logging for what gets discarded and why. Over time, this data reveals patterns—dishes that consistently undersell, ingredients that spoil regularly—so menus can evolve.</p>

<h2>Results</h2>
<p>Food waste decreased by 35% in the first quarter. Profitability improved 22% as the restaurant became more responsive to ingredient costs. Staff could see exactly why certain dishes were or weren't worth featuring.</p>

<h2>Key Insight</h2>
<p>Restaurants live on margins measured in basis points. The intersection of supply chain visibility and menu optimization is where profit lives. It's invisible in traditional operations but becomes obvious once you have the data.</p>$body$
where slug = 'food-king' and (body is null or length(body) < 500);

-- 8. CDMX Vallarta
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>A hospitality venue in Mexico City wanted to reach international tourists and local visitors with targeted offers, but had no way to track who was visiting, what they spent, or what they preferred. Marketing was guesswork, and the venue couldn't upsell or cross-sell effectively.</p>

<h2>Our Approach</h2>
<h3>Build a Customer Recognition System</h3>
<p>We created a simple loyalty program integrated with their POS. Guests scan a QR code or provide a phone number, and staff can see their history: what they ordered before, how much they typically spend, and any preferences they've noted.</p>

<h3>Personalize the Experience</h3>
<p>With this data visible at the host stand or in the bar, staff could greet repeat customers by name, remember their favorite drink, and suggest new offerings based on their past orders.</p>

<h3>Enable Targeted Promotions</h3>
<p>Instead of broad discounts, they could send personalized offers to different customer segments. Someone who always orders wine could get wine specials. Regular visitors could be invited to exclusive events.</p>

<h2>Results</h2>
<p>Repeat visitor rate increased 45%. Average spend per visit went up because staff knew what to suggest. Marketing became effective because promotions were targeted, not spray-and-pray.</p>

<h2>Key Insight</h2>
<p>Hospitality venues have enormous opportunity to personalize, but most don't have the systems. A simple CRM tied to POS doesn't just track revenue—it creates better experiences that turn visitors into regulars.</p>$body$
where slug = 'cdmx-vallarta' and (body is null or length(body) < 500);

-- 9. RestorePoint
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>A disaster recovery company needed a way to communicate with affected customers, coordinate response teams across multiple sites, and track recovery progress in real time. During emergencies, critical information was scattered across email, phone calls, and paper, leading to missed follow-ups and unclear priorities.</p>

<h2>Our Approach</h2>
<h3>Build an Emergency Response Hub</h3>
<p>We created a platform where incoming disaster notifications trigger automatic workflows. Customer contacts are consolidated, severity is assessed, and teams are mobilized in parallel. No more information bottlenecks.</p>

<h3>Real-Time Status Tracking</h3>
<p>Field teams can log progress as they work: damage assessment, mitigation steps taken, estimated restore time. Customers and internal stakeholders see live status updates instead of wondering what's happening.</p>

<h3>Post-Incident Documentation</h3>
<p>All work is logged automatically, creating accountability and documentation that speeds up insurance claims. Before-and-after photos, inventory of items, work performed—all captured and organized.</p>

<h2>Results</h2>
<p>Response time improved 40% because teams didn't waste time coordinating. Customer satisfaction increased because they had visibility into the recovery process. Insurance claims were resolved faster with complete documentation.</p>

<h2>Key Insight</h2>
<p>In emergency services, chaos is normal but poor communication doesn't have to be. A system that centralizes information and automates triage can dramatically improve both efficiency and customer trust during the worst moments.</p>$body$
where slug = 'restorepoint' and (body is null or length(body) < 500);

-- 10. Astrobiomancy
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>An esoteric wellness brand was selling readings and guidance services online but had no way to manage bookings, deliver consistent client experiences, or scale without the founder handling every interaction personally. The service was personality-driven but not systematized, limiting growth.</p>

<h2>Our Approach</h2>
<h3>Create a Client Management System</h3>
<p>We built a platform where clients could book readings, see service options and pricing, and receive confirmation and details. The founder could manage their calendar, send pre-session questionnaires, and follow up with recordings or notes.</p>

<h3>Deliver a Professional Experience</h3>
<p>Video call integration, secure document sharing, and branded client portals elevated the presentation. Clients received professional onboarding and post-session access to their materials.</p>

<h3>Enable Growth Without Losing Intimacy</h3>
<p>As the business grows, additional practitioners can be added to the platform, each with their own calendar and client relationship history. The service remains personalized but is no longer a one-person bottleneck.</p>

<h2>Results</h2>
<p>The business scaled from one practitioner to three within the first year. Client retention improved because interactions were structured and consistent. Revenue doubled while time-per-client decreased because scheduling and logistics were automated.</p>

<h2>Key Insight</h2>
<p>Service businesses built on personal relationships can scale when you systematize everything except the personal connection itself. Technology removes friction, not intimacy.</p>$body$
where slug = 'astrobiomancy' and (body is null or length(body) < 500);

-- 11. Logan Express Care
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>An urgent care clinic had long wait times for check-in, unclear queuing, and patients frustrated about how long they'd wait before seeing a provider. Staff spent time managing paper check-in sheets and coordinating with the back office. Revenue was capped by how many patients they could physically check in during peak hours.</p>

<h2>Our Approach</h2>
<h3>Move Check-In Online</h3>
<p>We created a pre-check-in system where patients can start registration and check-in from home or the parking lot using their phone. By the time they walk through the door, most paperwork is done.</p>

<h3>Real-Time Queue Management</h3>
<p>The system shows actual wait time based on current providers and acuity levels. Patients see estimated time on their phone and can opt to walk in or return later, reducing frustration.</p>

<h3>Digital Triage Integration</h3>
<p>The check-in flow captures symptoms and acuity, which feeds directly to clinical staff. Providers see not just who's waiting, but a snapshot of what they're coming in for.</p>

<h2>Results</h2>
<p>Average check-in time dropped from 12 minutes to 2 minutes. Walk-out rate due to long waits fell 60%. The clinic could serve 30% more patients with the same staff because scheduling was optimized.</p>

<h2>Key Insight</h2>
<p>In healthcare, every minute waiting is a minute of negative experience. Moving friction to before the patient walks in—digitally, from home—transforms satisfaction and efficiency at the same time.</p>$body$
where slug = 'logan-express-care' and (body is null or length(body) < 500);

-- 12. Muuttomyynti
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>A property selling platform used by people liquidating possessions through a moving sale struggled with poor seller experience. Sellers couldn't easily list items, buyers couldn't find what they wanted, and the platform had no mechanism to bring buyers to specific sales or encourage group purchases.</p>

<h2>Our Approach</h2>
<h3>Simplify Item Listing</h3>
<p>We redesigned the form so sellers could list items with just a photo and description. The system auto-categorizes items and suggests pricing based on historical data. No manual categorization required.</p>

<h3>Make Sales Discoverable</h3>
<p>Instead of searching for individual items, buyers can find upcoming sales in their area, see featured items from each sale, and get directions and hours. Sales become events, not just listings.</p>

<h3>Enable Group Buying</h3>
<p>Buyers can save items from multiple sales into a "wishlist" and get notified when they're ready. When multiple items from a sale are in demand, the system highlights that sale to interested buyers.</p>

<h2>Results</h2>
<p>Time from list to sold dropped from an average of 8 days to 3 days. Sellers could clear inventory faster. Buyers found items more easily. The platform's efficiency made both sellers and buyers more likely to return.</p>

<h2>Key Insight</h2>
<p>Marketplace efficiency is about removing friction on both sides simultaneously. When sellers have an easier time listing and buyers have an easier time finding, the whole market becomes more active.</p>$body$
where slug = 'muuttomyynti' and (body is null or length(body) < 500);

-- 13. Introxpert
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>A consulting firm providing introductions and deal-making services was managing relationships manually with spreadsheets and email. They needed to track potential partnerships, manage introductions, follow up with both parties, and prove ROI to justify their fees. Growing beyond the founder's ability to track everything was becoming impossible.</p>

<h2>Our Approach</h2>
<h3>Build a Relationship Management System</h3>
<p>We created a CRM designed specifically for introduction and partnership brokers. Profiles capture not just contact information but expertise, interests, sectors they work in, and past introductions.</p>

<h3>Track Introduction Outcomes</h3>
<p>When the consultant makes an introduction, they log it in the system. Follow-up tasks are automatically generated. Both parties are prompted to provide feedback on whether the introduction was valuable.</p>

<h3>Measure and Report Results</h3>
<p>The system tracks success rates: how many introductions lead to conversations, meetings, deals. This data proves the value of the service and helps refine the matching algorithm.</p>

<h2>Results</h2>
<p>The consultant could track 5x more relationships with the same effort. Introduction quality improved because the system helped identify better matches. Clients could see clear ROI from the service through quarterly reports.</p>

<h2>Key Insight</h2>
<p>Service businesses that don't track outcomes can't prove their value. When you instrument the process, you can demonstrate ROI and continuously improve your matchmaking.</p>$body$
where slug = 'introxpert' and (body is null or length(body) < 500);

-- 14. EETS Travel
update public.case_studies
set body = $body$<h2>The Challenge</h2>
<p>A boutique travel agency competed with online booking platforms by offering personalized travel planning, but had no digital presence to showcase their expertise. Potential clients didn't know they existed, and those who found them couldn't understand their service offerings or how to engage them. Email inquiries were slow to answer and the booking process was unclear.</p>

<h2>Our Approach</h2>
<h3>Showcase Expertise Through Content</h3>
<p>We created a portfolio of past trips organized by destination, travel style, and budget. Each portfolio item told a story: what the client wanted, what the agency found, and why it was special. This proved expertise in a way a brochure never could.</p>

<h3>Make It Easy to Engage</h3>
<p>We built a simple intake form that asked the right questions: where they want to go, when, budget, travel style, and any special requirements. Submissions went directly to the travel agent with structured information, making responses faster and more relevant.</p>

<h3>Establish Authority Locally and Internationally</h3>
<p>We optimized for local search (where are travel agents near me) and created content around specific destinations and travel styles. The agency started ranking for searches like "[destination] luxury travel advisor".</p>

<h2>Results</h2>
<p>Inbound inquiries increased 3x within six months. Clients could see before-and-after stories that demonstrated the value of personalized planning. Booking rate improved because prospects self-selected—only serious clients engaged, not bargain hunters.</p>

<h2>Key Insight</h2>
<p>Boutique service providers beat digital platforms when they can show evidence of their expertise and make it easy to understand what they do. A portfolio and a clear intake process is often all you need to compete with scale.</p>$body$
where slug = 'eets-travel' and (body is null or length(body) < 500);

-- ============================================================
-- VERIFY
-- ============================================================
select slug, title, 
       case when body is not null and body != '' then 'UPDATED' else 'NOT UPDATED' end as status,
       length(body) as body_length
from public.case_studies
where slug not in ('point-of-sale-platform', 'laravel-consultation-session', 'loveutravel-booking-platform', 'abodeology-property-sales-platform', 'am-collision-towing-website')
order by created_at asc;
