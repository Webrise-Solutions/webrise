import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { services, siteUrl } from "@/data/site";

/**
 * Static routes, highest intent first. Anything driven by a database row
 * (services, work, blog, industries, blog categories) is appended below rather
 * than listed here.
 */
const routes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/audit", changeFrequency: "monthly", priority: 0.9 },
  { path: "/work", changeFrequency: "weekly", priority: 0.85 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.85 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.85 },
  { path: "/get-a-quote", changeFrequency: "monthly", priority: 0.85 },
  { path: "/book-a-call", changeFrequency: "monthly", priority: 0.85 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/industries", changeFrequency: "monthly", priority: 0.8 },
  { path: "/process", changeFrequency: "monthly", priority: 0.7 },
  { path: "/tools", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.2 },
];

/**
 * Published rows, read at request time. Wrapped so a database hiccup degrades
 * to a sitemap of static routes rather than failing the whole response.
 */
async function publishedContent() {
  try {
    const now = new Date().toISOString();
    const [posts, studies, industries, categories] = await Promise.all([
      supabaseAdmin
        .from("blog_posts")
        .select("slug, updated_at")
        .eq("status", "published")
        .lte("published_at", now),
      supabaseAdmin.from("case_studies").select("slug, updated_at").eq("status", "published"),
      supabaseAdmin.from("industries").select("slug, updated_at"),
      supabaseAdmin.from("blog_categories").select("slug"),
    ]);

    return {
      posts: posts.data ?? [],
      studies: studies.data ?? [],
      industries: industries.data ?? [],
      categories: categories.data ?? [],
    };
  } catch (error) {
    console.error("[sitemap] content lookup failed", error);
    return { posts: [], studies: [], industries: [], categories: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // One entry per service pillar. These are the commercial landing pages, so
  // they rank just under the homepage.
  const serviceRoutes = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const { posts, studies, industries, categories } = await publishedContent();

  const industryRoutes = industries.map((industry) => ({
    url: `${siteUrl}/industries/${industry.slug}`,
    lastModified: new Date(industry.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/blog/category/${category.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const caseStudyRoutes = studies.map((study) => ({
    url: `${siteUrl}/work/${study.slug}`,
    lastModified: new Date(study.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...caseStudyRoutes,
    ...blogRoutes,
    ...categoryRoutes,
  ];
}
