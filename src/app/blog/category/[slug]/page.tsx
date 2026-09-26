import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CtaStrip } from "@/components/shared/CtaStrip";
import { Icon } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { siteUrl } from "@/data/site";

export const revalidate = 300;

const postDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

async function loadCategory(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("blog_categories")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) console.error("[blog/category] load failed", error);
  return data;
}

export async function generateStaticParams() {
  const { data } = await supabaseAdmin.from("blog_categories").select("slug");
  return (data ?? []).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await loadCategory(slug);

  if (!category) return {};

  const title = `${category.name} | Webrise Blog`;
  const description = `Articles from Webrise on ${category.name.toLowerCase()}.`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/category/${category.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteUrl}/blog/category/${category.slug}`,
    },
  };
}

/**
 * A real page per category, rather than the index's `?category=` filter.
 *
 * The filter is fine for browsing; a crawlable URL per category is what makes
 * the internal linking between categories and the service pillars worth
 * anything.
 */
export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await loadCategory(slug);

  if (!category) notFound();

  const [{ data: posts }, { data: categories }] = await Promise.all([
    supabaseAdmin
      .from("blog_posts")
      .select("id, slug, title, excerpt, cover_image_url, published_at")
      .eq("status", "published")
      .eq("category_id", category.id)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false }),
    supabaseAdmin.from("blog_categories").select("id, name, slug").order("sort_order"),
  ]);

  const articles = posts ?? [];

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="mx-auto max-w-[1200px] px-6 pb-0 pt-8 sm:px-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
            All articles
          </Link>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-[clamp(40px,5vw,80px)] sm:px-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
            <Icon name="guest-posting" size={15} className="shrink-0" />
            Category
          </span>

          <h1 className="mt-5 text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.08] tracking-[-0.02em]">
            {category.name}
          </h1>

          <div className="mt-[22px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />

          <p className="mt-[22px] text-muted-foreground">
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </p>

          <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-muted-foreground transition-colors hover:border-teal hover:text-teal"
            >
              All
            </Link>
            {(categories ?? []).map((item) => (
              <Link
                key={item.id}
                href={`/blog/category/${item.slug}`}
                className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  item.slug === category.slug
                    ? "border-teal bg-teal-soft text-teal"
                    : "border-line bg-white text-muted-foreground hover:border-teal hover:text-teal"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {articles.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-line px-6 py-16 text-center">
              <h2 className="text-[17px] font-semibold text-ink">Nothing here yet</h2>
              <p className="mx-auto mt-2 max-w-[46ch] text-sm text-muted-foreground">
                No published articles in {category.name} so far.
              </p>
            </div>
          ) : (
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
                  >
                    <div className="h-[160px] bg-sand">
                      {post.cover_image_url ? (
                        <img
                          src={post.cover_image_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-muted-foreground">
                          <Icon name="guest-posting" size={28} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="text-[17px] font-semibold leading-snug text-ink">
                        {post.title}
                      </h2>
                      {post.excerpt ? (
                        <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                      ) : null}
                      {post.published_at ? (
                        <p className="mt-auto pt-4 text-[13px] text-muted-foreground">
                          {postDate.format(new Date(post.published_at))}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <CtaStrip
            className="mt-[clamp(32px,4vw,56px)]"
            title="Want this applied to your site?"
            description="Send us your website and we'll come back with the specific gaps worth fixing first."
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
