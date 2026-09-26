import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CtaStrip } from "@/components/shared/CtaStrip";
import { Icon } from "@/components/shared/Icon";
import { Prose } from "@/components/shared/Prose";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { siteUrl } from "@/data/site";

export const revalidate = 300;

const postDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Published, and not scheduled for later. Drafts must never be reachable. */
function livePosts() {
  return supabaseAdmin
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, body, tags, cover_image_url, cover_image_alt, published_at, seo_title, seo_description, category_id, blog_categories(name, slug), authors(name, bio, avatar_url)",
    )
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());
}

async function loadPost(slug: string) {
  const { data, error } = await livePosts().eq("slug", slug).maybeSingle();
  if (error) console.error("[blog] post load failed", error);
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) return {};

  const title = post.seo_title ?? `${post.title} | Webrise`;
  const description = post.seo_description ?? post.excerpt ?? undefined;
  const path = `/blog/${post.slug}`;

  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    openGraph: {
      title,
      ...(description ? { description } : {}),
      type: "article",
      url: `${siteUrl}${path}`,
      ...(post.published_at ? { publishedTime: post.published_at } : {}),
      ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) notFound();

  // Same category first; the point is to keep someone reading.
  const { data: related } = await livePosts()
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(6);

  const suggestions = [
    ...(related ?? []).filter((item) => item.category_id && item.category_id === post.category_id),
    ...(related ?? []).filter((item) => !item.category_id || item.category_id !== post.category_id),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    ...(post.authors ? { author: { "@type": "Person", name: post.authors.name } } : {}),
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

        <article className="mx-auto max-w-[1200px] px-6 py-[clamp(32px,4vw,64px)] sm:px-10">
          <header className="mx-auto max-w-[760px]">
            {post.blog_categories ? (
              <Link
                href={`/blog?category=${post.blog_categories.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-teal hover:bg-teal-soft/70"
              >
                {post.blog_categories.name}
              </Link>
            ) : null}

            <h1 className="mt-5 text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.1] tracking-[-0.02em] text-balance">
              {post.title}
            </h1>

            {post.excerpt ? (
              <p className="mt-4 text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line-soft pt-5 text-sm text-muted-foreground">
              {post.authors ? (
                <span className="inline-flex items-center gap-2 font-semibold text-ink">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-soft text-teal">
                    <Icon name="users" size={16} />
                  </span>
                  {post.authors.name}
                </span>
              ) : null}
              {post.published_at ? (
                <time dateTime={post.published_at}>
                  {postDate.format(new Date(post.published_at))}
                </time>
              ) : null}
            </div>
          </header>

          {post.cover_image_url ? (
            <figure className="mx-auto mt-9 max-w-[900px]">
              <img
                src={post.cover_image_url}
                alt={post.cover_image_alt ?? ""}
                className="w-full rounded-3xl border border-line-soft object-cover"
              />
            </figure>
          ) : null}

          <div className="mx-auto mt-9 max-w-[760px]">
            <Prose html={post.body} />

            {post.tags && post.tags.length > 0 ? (
              <ul className="mt-10 flex flex-wrap gap-2 border-t border-line-soft pt-6">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            {post.authors?.bio ? (
              <aside className="mt-8 flex items-start gap-4 rounded-2xl border border-line-soft bg-white p-5 shadow-card">
                <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-teal-soft text-teal">
                  <Icon name="users" size={22} />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{post.authors.name}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                    {post.authors.bio}
                  </p>
                </div>
              </aside>
            ) : null}
          </div>

          {suggestions.length > 0 ? (
            <section className="mt-[clamp(40px,5vw,72px)]">
              <h2 className="text-[17px] font-semibold text-ink">Keep reading</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {suggestions.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-line-soft bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
                    >
                      {item.blog_categories ? (
                        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-teal">
                          {item.blog_categories.name}
                        </span>
                      ) : null}
                      <span className="mt-2 flex items-center gap-1.5 text-[16px] font-semibold leading-snug text-ink">
                        {item.title}
                      </span>
                      {item.excerpt ? (
                        <span className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-muted-foreground">
                          {item.excerpt}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <CtaStrip
            className="mt-[clamp(32px,4vw,56px)]"
            title="Want this applied to your site?"
            description="Send us your website and we'll come back with the specific gaps worth fixing first."
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
