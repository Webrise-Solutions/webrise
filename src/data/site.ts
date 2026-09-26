import type {
  Faq,
  FooterTrust,
  GrowthStat,
  Industry,
  OrbitTool,
  ProcessStep,
  Service,
  ServiceCluster,
  Stat,
  TaggedItem,
  Tool,
  WhyCard,
} from "@/types/site";

export const services: Service[] = [
  {
    slug: "ai-powered-seo",
    name: "AI-Powered SEO",
    icon: "ai-seo",
    cluster: "seo",
    highlight: "Optimised for Google and for ChatGPT, Gemini, Perplexity and Claude",
    description:
      "Traditional search work plus what gets you cited in AI answers: clean entity signals, structured data and content shaped the way assistants quote their sources.",
    features: [
      "AI assistant visibility tracking",
      "Entity and structured data mapping",
      "Answer-ready content formatting",
      "Conventional ranking work alongside",
      "Monthly visibility reporting",
    ],
    included: [
      "AI Visibility Audit",
      "Schema & Entity Work",
      "Answer-Led Content",
      "Rank Tracking",
      "Monthly Reporting",
    ],
    result: "First signals in 4-8 weeks",
  },
  {
    slug: "white-hat-seo",
    name: "White-Hat SEO",
    icon: "white-hat",
    cluster: "seo",
    highlight: "Every tactic defensible under Google's own guidelines",
    description:
      "The core programme: technical fixes, on-page work and earned authority, built to survive algorithm updates rather than gamble against them.",
    features: [
      "Technical site audit and fixes",
      "On-page and internal linking",
      "Keyword and search intent mapping",
      "Core Web Vitals remediation",
      "No PBNs, no automated tooling",
    ],
    included: [
      "Technical Audit",
      "On-Page Optimisation",
      "Keyword Strategy",
      "Site Health Monitoring",
      "Progress Reporting",
    ],
    result: "Compounding from month 3",
  },
  {
    slug: "guest-posting",
    name: "Guest Posting",
    icon: "guest-posting",
    cluster: "seo",
    highlight: "Editorial placements chosen for relevance, not volume",
    description:
      "Genuine outreach to real publications in your niche, earning contextual links that pass authority and drive referral traffic.",
    features: [
      "Real, vetted publications",
      "Niche-relevant placements",
      "Editorially-approved content",
      "Do-follow contextual links",
      "Transparent live URLs",
    ],
    included: [
      "Publisher Vetting",
      "Content Creation",
      "Manual Outreach",
      "Do-Follow Links",
      "Placement Report",
    ],
    result: "Placements in 3-4 weeks",
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    icon: "local-seo",
    cluster: "seo",
    highlight: "Get found by nearby customers on Google Search and Maps",
    description:
      "We optimise your local signals and service-area pages so you show up when people nearby are ready to buy.",
    features: [
      "Map pack optimisation",
      "Local citation building & cleanup",
      "Review strategy & management",
      "Location and service-area pages",
      "Map-pack rank tracking",
    ],
    included: [
      "Local Audit",
      "Citation Building",
      "Review Management",
      "Local Content",
      "Rank Tracking",
    ],
    result: "Results in 1-2 months",
  },
  {
    slug: "google-business-profile",
    name: "Google Business Profile",
    icon: "local-business",
    cluster: "seo",
    highlight: "The highest-intent surface most businesses leave half-finished",
    description:
      "Full profile build and ongoing management: categories, services, photos, posts and Q&A, plus the review handling that keeps a listing competitive.",
    features: [
      "Category and attribute optimisation",
      "Photo and post scheduling",
      "Review response management",
      "Q&A seeding and moderation",
      "Profile insights reporting",
    ],
    included: [
      "Profile Build or Rescue",
      "Weekly Posting",
      "Review Management",
      "Photo Optimisation",
      "Insights Reporting",
    ],
    result: "Visible within 2-4 weeks",
  },
  {
    slug: "web-development",
    name: "Web Development",
    icon: "web-development",
    cluster: "development",
    highlight: "Fast, technically sound sites engineered to convert",
    description:
      "We build search-ready websites with clean code, strong Core Web Vitals and layouts designed to turn visitors into enquiries.",
    features: [
      "Core Web Vitals optimised",
      "Mobile-first responsive build",
      "SEO-ready structure & schema",
      "Conversion-focused layouts",
      "Ongoing maintenance option",
    ],
    included: [
      "Custom Design",
      "Technical SEO Build",
      "Performance Tuning",
      "Schema Markup",
      "Launch Support",
    ],
    result: "Live in 3-6 weeks",
  },
  {
    slug: "ai-development",
    name: "AI Development",
    icon: "ai-development",
    cluster: "development",
    highlight: "Working software, not demos",
    description:
      "Custom assistants, retrieval systems and automation built on current models, scoped around a job your team already repeats every week.",
    features: [
      "Assistant and chatbot builds",
      "Retrieval over your own content",
      "Workflow automation",
      "Evaluation before rollout",
      "Cost and latency budgeting",
    ],
    included: [
      "Discovery Workshop",
      "Prototype Build",
      "Evaluation Suite",
      "Production Deployment",
      "Handover Documentation",
    ],
    result: "Prototype in 2-4 weeks",
  },
  {
    slug: "app-development",
    name: "App Development",
    icon: "monitor",
    cluster: "development",
    highlight: "One codebase, both stores, no surprises at review time",
    description:
      "Cross-platform mobile builds from design through store submission, with the release, push and analytics plumbing set up properly from the start.",
    features: [
      "iOS and Android from one codebase",
      "Design system implementation",
      "Offline and push notification handling",
      "App store submission support",
      "Crash and usage analytics",
    ],
    included: [
      "Technical Scoping",
      "App Build",
      "QA on Real Devices",
      "Store Submission",
      "Post-Launch Support",
    ],
    result: "MVP in 6-12 weeks",
  },
  {
    slug: "saas-mvp-to-production",
    name: "SaaS MVP to Production",
    icon: "implementation",
    cluster: "development",
    highlight: "For founders who need the first version to survive the second",
    description:
      "Taking a validated idea to a product that can carry real users: auth, billing, data model and the deployment pipeline that holds them up.",
    features: [
      "Auth and billing integration",
      "Schema and data modelling",
      "CI/CD and environment setup",
      "Observability and error tracking",
      "Architecture ready to scale",
    ],
    included: [
      "Architecture Plan",
      "MVP Build",
      "Billing & Auth",
      "Deployment Pipeline",
      "Monitoring Setup",
    ],
    result: "First release in 8-12 weeks",
  },
  {
    slug: "tiktok-shop",
    name: "TikTok Shop",
    icon: "ecommerce",
    cluster: "growth",
    highlight: "Search, shop and discovery on the platform buyers open first",
    description:
      "Storefront setup, listing optimisation and the content cadence that TikTok's own search surfaces, treated as a search channel rather than a social one.",
    features: [
      "Shop setup and compliance",
      "Product listing optimisation",
      "TikTok search keyword work",
      "Creator and affiliate setup",
      "Sales performance reporting",
    ],
    included: [
      "Shop Setup",
      "Listing Optimisation",
      "Content Calendar",
      "Creator Outreach",
      "Sales Reporting",
    ],
    result: "Live shop in 2-4 weeks",
  },
];

export const orbitTools: OrbitTool[] = [
  {
    name: "ChatGPT",
    role: "AI Conversations",
    angle: 324,
    badge: "Featured",
    badgeTone: "featured",
  },
  { name: "Gemini", role: "AI Overview", angle: 36, badge: "Visible", badgeTone: "soft" },
  { name: "Perplexity", role: "AI Search", angle: 108, badge: "Featured", badgeTone: "featured" },
  { name: "Claude", role: "AI Responses", angle: 180, badge: "Recommended", badgeTone: "soft" },
  { name: "Google", role: "Search & Maps", angle: 252, badge: "#1 Rankings", badgeTone: "dark" },
];

export const trustTags: TaggedItem[] = [
  { name: "eCommerce", icon: "ecommerce" },
  { name: "SaaS", icon: "technology" },
  { name: "Local trade", icon: "local-business" },
  { name: "Legal", icon: "law" },
  { name: "Finance", icon: "finance" },
];

export const whyCards: WhyCard[] = [
  {
    n: "01",
    icon: "shield-lock",
    tone: "teal",
    title: "White-Hat SEO",
    description:
      "We follow 100% white-hat techniques that are safe, sustainable and built for long-term success.",
  },
  {
    n: "02",
    icon: "users",
    tone: "rust",
    title: "Senior Team",
    description:
      "Certified specialists with years of hands-on experience. Never handed to juniors.",
  },
  {
    n: "03",
    icon: "reporting",
    tone: "teal",
    title: "Clear Reporting",
    description: "Easy-to-understand reports with real-time performance tracking, every month.",
  },
  {
    n: "04",
    icon: "ai-seo",
    tone: "rust",
    title: "Custom Strategy",
    description: "Data-driven strategies tailored specifically to your business goals.",
  },
  {
    n: "05",
    icon: "trending-up",
    tone: "teal",
    title: "Proven Results",
    description: "We focus on measurable growth that drives more traffic, leads and revenue.",
  },
  {
    n: "06",
    icon: "phone",
    tone: "rust",
    title: "Responsive Support",
    description:
      "A senior specialist replies within one working day, at every step of the journey.",
  },
];

export const stats: Stat[] = [
  { icon: "white-hat", value: "7+", label: "Years of Experience", tone: "mint" },
  { icon: "web-development", value: "500+", label: "Projects Completed", tone: "coral" },
  { icon: "users", value: "100+", label: "Happy Clients", tone: "mint" },
  { icon: "trending-up", value: "10M+", label: "Organic Traffic", tone: "coral" },
  { icon: "guest-posting", value: "50K+", label: "Quality Backlinks", tone: "mint" },
];

export const processSteps: ProcessStep[] = [
  {
    n: "1",
    icon: "discovery",
    title: "Discovery & goals",
    description: "We learn your market, targets and what success looks like.",
    time: "Week 1",
  },
  {
    n: "2",
    icon: "audit",
    title: "Audit & analysis",
    description: "Full technical, content and competitor review.",
    time: "Week 1–2",
  },
  {
    n: "3",
    icon: "strategy",
    title: "Strategy",
    description: "A prioritised roadmap mapped to your goals.",
    time: "Week 2–3",
  },
  {
    n: "4",
    icon: "implementation",
    title: "Implementation",
    description: "On-page, technical fixes and content go live.",
    time: "Ongoing",
  },
  {
    n: "5",
    icon: "monitoring",
    title: "Monitoring",
    description: "We track, test and refine against the data.",
    time: "Ongoing",
  },
  {
    n: "6",
    icon: "reporting",
    title: "Reporting & growth",
    description: "Transparent monthly reporting and next moves.",
    time: "Monthly",
  },
];

export const industries: Industry[] = [
  {
    name: "eCommerce",
    slug: "ecommerce",
    icon: "ecommerce",
    focus: "Category and product pages tuned to buyer-intent search.",
    challenges: [
      "Category pages carry the commercial intent, product pages carry the long tail, and most stores optimise the wrong one of the two.",
      "Filters and variants generate thousands of near-identical URLs that compete with each other unless crawling is controlled deliberately.",
      "Stock changes daily, so pages rank and then disappear — availability has to be part of the SEO plan, not an afterthought.",
    ],
    services: ["white-hat-seo", "ai-powered-seo", "web-development", "tiktok-shop"],
  },
  {
    name: "SaaS & Tech",
    slug: "saas-tech",
    icon: "technology",
    focus: "Comparison and alternative pages that catch research early.",
    challenges: [
      "Buyers research for weeks before a demo, so the winning pages are comparisons and alternatives, not the homepage.",
      "Assistants now answer product questions directly, which means being citable matters as much as ranking.",
      "Documentation and marketing compete for the same queries unless the two are separated on purpose.",
    ],
    services: ["ai-powered-seo", "saas-mvp-to-production", "white-hat-seo", "guest-posting"],
  },
  {
    name: "Law Firms",
    slug: "law-firms",
    icon: "law",
    focus: "Practice-area and location pages for high-value enquiries.",
    challenges: [
      "One enquiry can be worth thousands, so a handful of practice-area terms decide the whole return.",
      "Every competitor publishes the same guidance, and near-identical content is the norm rather than the exception.",
      "Regulated claims limit what can be promised, which rules out most of the copy other sectors lean on.",
    ],
    services: ["local-seo", "white-hat-seo", "google-business-profile", "guest-posting"],
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    icon: "real-estate",
    focus: "Area guides and map visibility for the postcodes you sell in.",
    challenges: [
      "Listings expire, so a site built only on stock loses its pages every few months.",
      "The durable rankings come from area and postcode content that stays valuable between instructions.",
      "Portals outrank agencies on the obvious searches, so the winnable ground is hyper-local.",
    ],
    services: ["local-seo", "google-business-profile", "web-development", "white-hat-seo"],
  },
  {
    name: "Finance & FinTech",
    slug: "finance-fintech",
    icon: "finance",
    focus: "Trust signals and technical rigour for a scrutinised space.",
    challenges: [
      "Money and livelihood topics are held to a higher bar, so authorship, sourcing and accuracy carry real ranking weight.",
      "Compliance constrains the wording, which means the gains come from structure and technical quality rather than persuasion.",
      "Established institutions hold the head terms, leaving specific, well-answered questions as the way in.",
    ],
    services: ["white-hat-seo", "ai-powered-seo", "guest-posting", "web-development"],
  },
  {
    name: "Dental Clinics",
    slug: "dental-clinics",
    icon: "dental",
    focus: "Treatment pages, local search and Google Business Profile.",
    challenges: [
      "Patients choose by proximity first, so the map pack matters more than the blue links.",
      "Each treatment is its own search with its own intent, and one combined services page serves none of them.",
      "Reviews and profile completeness move local rankings as much as anything on the website itself.",
    ],
    services: ["local-seo", "google-business-profile", "white-hat-seo", "web-development"],
  },
  {
    name: "Home Services",
    slug: "home-services",
    icon: "home-services",
    focus: "Service-and-area pages plus the review signals that convert.",
    challenges: [
      "Demand is urgent and local: people call the first credible result rather than comparing five.",
      "Coverage means a page for every service and every area, without those pages becoming duplicates.",
      "Most enquiries are phone calls, so tracking has to follow the call or the reporting is fiction.",
    ],
    services: ["local-seo", "google-business-profile", "web-development", "white-hat-seo"],
  },
  {
    name: "Hospitality",
    slug: "hospitality",
    icon: "restaurant",
    focus: "Menus, bookings and local discovery, AI assistants included.",
    challenges: [
      "Discovery increasingly happens in maps and assistants, where a stale profile costs bookings the site never sees.",
      "Aggregators sit between you and the booking, so direct visibility is worth more per visit than volume.",
      "Menus, opening hours and availability change constantly, and structured data is what keeps them accurate.",
    ],
    services: ["local-seo", "google-business-profile", "ai-powered-seo", "web-development"],
  },
];

export const tools: Tool[] = [
  {
    name: "Ahrefs",
    description: "Advanced SEO research, backlink analysis & competitor insights.",
    tone: "teal",
  },
  {
    name: "Semrush",
    description: "All-in-one suite for keyword research, tracking & competitive analysis.",
    tone: "rust",
  },
  {
    name: "Google Analytics 4",
    description: "Track website performance, user behaviour & conversions.",
    tone: "teal",
  },
  {
    name: "Search Console",
    description: "Monitor search performance, indexing & site health.",
    tone: "rust",
  },
  {
    name: "Screaming Frog",
    description: "Powerful crawler for technical SEO audits & on-page analysis.",
    tone: "teal",
  },
  {
    name: "ChatGPT",
    description: "AI assistant for content creation, ideation & strategy support.",
    tone: "rust",
  },
  {
    name: "Claude",
    description: "AI assistant for smart writing, analysis & business automation.",
    tone: "teal",
  },
  {
    name: "Gemini",
    description: "AI model for content, research & data-driven insights.",
    tone: "rust",
  },
  {
    name: "WordPress",
    description: "Powerful CMS for fast, scalable & SEO-friendly websites.",
    tone: "teal",
  },
  {
    name: "Cloudflare",
    description: "Enhance website speed, security & overall performance.",
    tone: "rust",
  },
  {
    name: "Microsoft Clarity",
    description: "Understand user behaviour with heatmaps & session recordings.",
    tone: "teal",
  },
  {
    name: "Google Business Profile",
    description: "Manage your business presence & attract more local customers.",
    tone: "rust",
  },
];

export const additionalTools: Tool[] = [
  {
    name: "Google Ads",
    description: "Run and optimise paid search campaigns that convert.",
    tone: "teal",
  },
  {
    name: "Google Tag Manager",
    description: "Deploy and manage tracking tags without touching code.",
    tone: "rust",
  },
  {
    name: "Yoast SEO",
    description: "On-page SEO optimisation and content readability for WordPress.",
    tone: "teal",
  },
  {
    name: "HubSpot",
    description: "CRM and inbound marketing hub for lead tracking and nurture.",
    tone: "rust",
  },
  {
    name: "Mailchimp",
    description: "Email marketing automation and campaign performance tracking.",
    tone: "teal",
  },
  {
    name: "Meta Ads",
    description: "Paid social campaigns across Facebook and Instagram.",
    tone: "rust",
  },
  {
    name: "Zapier",
    description: "Automate handoffs between tools so nothing falls through the cracks.",
    tone: "teal",
  },
  {
    name: "Notion",
    description: "Shared workspace for strategy docs, SOPs and reporting.",
    tone: "rust",
  },
  {
    name: "Figma",
    description: "Design and prototype landing pages and creative assets.",
    tone: "teal",
  },
  {
    name: "Grammarly",
    description: "Editorial quality checks for clarity, tone and grammar.",
    tone: "rust",
  },
  {
    name: "Asana",
    description: "Project and task management to keep campaigns on schedule.",
    tone: "teal",
  },
  {
    name: "Buffer",
    description: "Schedule and analyse organic social media content.",
    tone: "rust",
  },
];

export const auditPoints: string[] = [
  "Technical SEO issues holding you back",
  "Keyword and content gaps versus competitors",
  "Google Business Profile and local visibility",
  "A prioritised list of quick wins",
];

export const businessTypes: string[] = [
  "eCommerce",
  "SaaS & Technology",
  "Local / service business",
  "Professional services",
  "Other",
];

export const faqs: Faq[] = [
  {
    question: "How long does SEO take to show results?",
    icon: "clock",
    tone: "teal",
    answer:
      "SEO is a long-term strategy. Typically, you can expect to see noticeable improvements in 3–6 months, with significant results in 6–12 months depending on your niche, competition, and the current state of your website.",
  },
  {
    question: "Do you guarantee #1 rankings on Google?",
    icon: "award",
    tone: "rust",
    answer:
      "No. Anyone guaranteeing a #1 ranking is not being straight with you. Search results depend on factors no agency controls. We guarantee ethical, white-hat work, full transparency and steady, measurable progress.",
  },
  {
    question: "What SEO services do you offer?",
    icon: "settings",
    tone: "teal",
    answer:
      "Off-page SEO and manual link building, local SEO, technical web development, human-written content and guest posting, combined into one strategy built around your goals.",
  },
  {
    question: "Do you build manual, white-hat backlinks?",
    icon: "guest-posting",
    tone: "rust",
    answer:
      "Yes. 100% manual outreach to real, relevant, high-authority publications. No PBNs, link farms or automated tools that put your rankings at risk.",
  },
  {
    question: "Which industries do you work with?",
    icon: "briefcase",
    tone: "teal",
    answer:
      "We work across eCommerce, SaaS & tech, law firms, real estate, finance, dental clinics, home services and hospitality, with strategies tailored to each niche.",
  },
  {
    question: "Do you provide website design and development?",
    icon: "monitor",
    tone: "rust",
    answer:
      "Yes. Our in-house team builds fast, SEO-ready websites, from Core Web Vitals optimisation to full custom builds, so your site supports the rankings we earn.",
  },
];

export const avatars = [
  { initials: "AK", tone: "teal" },
  { initials: "SR", tone: "rust" },
  { initials: "MT", tone: "muted" },
  { initials: "LB", tone: "teal-dark" },
] as const;

export const growthStats: GrowthStat[] = [
  { icon: "users", value: "100+", label: "Happy Clients" },
  { icon: "trending-up", value: "10M+", label: "Organic Traffic Generated" },
  { icon: "white-hat", value: "7+", label: "Years of Experience" },
];

/**
 * Social profiles. Add the real URL to `href` and the icon appears in the
 * footer; leave it out and that icon is not rendered at all.
 *
 * Deliberately no placeholder hrefs: an icon linking to "/" is a dead link
 * that looks live, and five of them on the footer of an SEO agency is a bad
 * advert for the service.
 */
export const socials: { label: string; tag: string; href?: string }[] = [
  { label: "Facebook", tag: "f" },
  { label: "LinkedIn", tag: "in" },
  { label: "Instagram", tag: "ig" },
  { label: "X", tag: "X" },
  { label: "YouTube", tag: "yt" },
];

/**
 * The six service pages worth a permanent footer link, each pointing at its own
 * page rather than the /services index — a footer link that lands somewhere
 * generic is a wasted internal link.
 */
export const footerServices: { label: string; href: string }[] = [
  { label: "AI-Powered SEO", href: "/services/ai-powered-seo" },
  { label: "White-Hat SEO", href: "/services/white-hat-seo" },
  { label: "Local SEO", href: "/services/local-seo" },
  { label: "Guest Posting", href: "/services/guest-posting" },
  { label: "Web Development", href: "/services/web-development" },
  { label: "TikTok Shop", href: "/services/tiktok-shop" },
];

/**
 * Footer sitemap columns.
 *
 * Split by intent rather than one long "quick links" list: someone scanning the
 * footer is either buying (Services), checking who we are (Company), reading
 * (Resources) or looking for the small print (Legal).
 */
export const footerCompany = [
  { label: "About Us", href: "/about" },
  { label: "Our Process", href: "/process" },
  { label: "Industries", href: "/industries" },
  { label: "Our Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact Us", href: "/contact" },
];

export const footerResources = [
  { label: "Blog", href: "/blog" },
  { label: "Free SEO Audit", href: "/audit" },
  { label: "SEO Tools", href: "/tools" },
  { label: "FAQ", href: "/faq" },
  { label: "Get a Quote", href: "/get-a-quote" },
  { label: "Book a Call", href: "/book-a-call" },
];

export const footerLegal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

export const footerTrust: FooterTrust[] = [
  {
    icon: "shield-lock",
    tone: "teal",
    title: "White-Hat SEO",
    description: "100% ethical strategies that follow Google guidelines.",
  },
  {
    icon: "trending-up",
    tone: "rust",
    title: "Transparent Reporting",
    description: "Detailed reports with clear insights and real results.",
  },
  {
    icon: "users",
    tone: "teal",
    title: "Dedicated Experts",
    description: "A skilled, senior team focused on your success.",
  },
  {
    icon: "white-hat",
    tone: "rust",
    title: "Data Security",
    description: "Your data is safe and always protected.",
  },
];

/**
 * The three pillars the Services menu is grouped by.
 *
 * Order matters: SEO is what most visitors arrive for, so it sits first in the
 * dropdown and reads left to right into the work that follows it.
 */
export const serviceClusters: { cluster: ServiceCluster; label: string; blurb: string }[] = [
  {
    cluster: "seo",
    label: "SEO & Visibility",
    blurb: "Get found in search engines and AI assistants.",
  },
  {
    cluster: "development",
    label: "Development",
    blurb: "Sites and products built to rank and convert.",
  },
  {
    cluster: "growth",
    label: "Growth & Commerce",
    blurb: "Turn the traffic into revenue.",
  },
];

/**
 * Header navigation only. Blog is deliberately absent here and kept in the
 * footer's Resources column instead — dropping it from both would orphan
 * /blog, which is still published, linked from case studies and in the
 * sitemap.
 */
export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

/** Canonical origin, used for metadataBase, sitemap URLs and JSON-LD. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://webrise.co.uk").replace(
  /\/$/,
  "",
);

/** Registered entity details, kept apart from the trading name in `contact`. */
export const company = {
  legalName: "Webrise Ltd",
  streetAddress: "Suite A, 82 James Carter Road",
  locality: "Mildenhall",
  postalCode: "IP28 7DE",
  country: "GB",
};

export const contact = {
  email: "contact@webrise.co.uk",
  phone: "+44 7460 013063",
  phoneHref: "tel:+447460013063",
  whatsappHref: "https://wa.me/447460013063",
  address: "Webrise Ltd, Suite A, 82 James Carter Road, Mildenhall, IP28 7DE, United Kingdom",
  reach: "Serving clients worldwide",
};

/**
 * WhatsApp deep link with the first message already written.
 *
 * wa.me works from any device — it opens the desktop app or WhatsApp Web when
 * there is no phone involved — so this is safe to use as a primary action
 * rather than a mobile-only convenience.
 *
 * The prefill is only a starting point: the person can edit or delete it
 * before sending, so it must read as something they would plausibly say, not
 * as a tracking string.
 */
export function whatsappLink(message?: string) {
  if (!message) return contact.whatsappHref;
  return `${contact.whatsappHref}?text=${encodeURIComponent(message)}`;
}
