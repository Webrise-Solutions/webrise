import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CtaStrip } from "@/components/shared/CtaStrip";
import { Icon } from "@/components/shared/Icon";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const title = "Blog | Webrise";
const description =
  "Practical writing on search visibility, local SEO, technical performance and getting cited by AI assistants.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title, description, type: "website" },
};

// Published posts change without a deploy, so the list is revalidated rather
// than baked in at build time.
export const revalidate = 300;

const postDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Keeps the category chips and the search box from clearing one another. */
function blogHref({ category, q }: { category?: string | undefined; q?: string | undefined }) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  // Cap the length: this reaches Postgres, and nothing useful is that long.
  const query = (q ?? "").trim().slice(0, 100);

  const postFields =
    "id, slug, title, excerpt, cover_image_url, published_at, blog_categories(name, slug)";

  let postsQuery = supabaseAdmin
    .from("blog_posts")
    .select(postFields)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());

  if (query) {
    /* Matches the generated `search_vector` column (title, excerpt and body),
       backed by the GIN index from the first content migration. `websearch`
       is the parser that takes what a person actually types — quoted phrases,
       stray operators, unbalanced quotes — without erroring, so no escaping
       of our own is needed. */
    postsQuery = postsQuery.textSearch("search_vector", query, {
      config: "english",
      type: "websearch",
    });
  }

  const [{ data: categories }, { data, error }] = await Promise.all([
    supabaseAdmin.from("blog_categories").select("id, name, slug").order("sort_order"),
    postsQuery.order("published_at", { ascending: false }),
  ]);

  if (error) console.error("[blog] index failed", error);

  const all = data ?? [];
  const posts = category ? all.filter((post) => post.blog_categories?.slug === category) : all;
  // A result set is a list, not a lead story: the hero treatment only makes
  // sense when we are the ones choosing what comes first.
  const lead = query ? undefined : posts[0];
  const rest = query ? posts : posts.slice(1);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="mx-auto max-w-[1200px] px-6 pb-0 pt-8 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
            Back to home
          </Link>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-[clamp(40px,5vw,80px)] sm:px-10">
          <div className="grid gap-x-[clamp(24px,4vw,64px)] gap-y-5 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
                <Icon name="guest-posting" size={15} className="shrink-0" />
                Writing
              </span>
              <h1 className="mt-5 max-w-[16ch] text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.08] tracking-[-0.02em]">
                Notes from the work
              </h1>
              <div className="mt-[22px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
            </div>
            <p className="max-w-[52ch] text-[clamp(1rem,0.95rem+0.3vw,1.125rem)] text-muted-foreground lg:pb-1">
              What we are seeing in search, written by the people doing the work. No listicles, no
              recycled advice.
            </p>
          </div>

          {/* A GET form: submitting only changes the URL, so search needs no
              client JS and a result page stays shareable and crawlable. */}
          <form action="/blog" method="get" className="mt-8 flex flex-wrap items-center gap-2">
            {category ? <input type="hidden" name="category" value={category} /> : null}
            <div className="relative flex-1 sm:max-w-[360px]">
              <Icon
                name="search"
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search articles"
                aria-label="Search articles"
                maxLength={100}
                className="w-full rounded-xl border border-input-line bg-white py-2.5 pl-10 pr-3 text-[14px] text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-teal hover:text-teal"
            >
              Search
            </button>
            {query ? (
              <Link
                href={blogHref({ category })}
                className="text-[13px] font-semibold text-muted-foreground hover:text-teal"
              >
                Clear
              </Link>
            ) : null}
          </form>

          {/* Category filter, as links so a filtered view is a shareable URL. */}
          {categories && categories.length > 0 ? (
            <nav aria-label="Categories" className="mt-4 flex flex-wrap gap-2">
              <Link
                href={blogHref({ q: query })}
                className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  !category
                    ? "border-teal bg-teal-soft text-teal"
                    : "border-line bg-white text-muted-foreground hover:border-teal hover:text-teal"
                }`}
              >
                All
              </Link>
              {categories.map((item) => (
                <Link
                  key={item.id}
                  href={blogHref({ category: item.slug, q: query })}
                  className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                    category === item.slug
                      ? "border-teal bg-teal-soft text-teal"
                      : "border-line bg-white text-muted-foreground hover:border-teal hover:text-teal"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          ) : null}

          {query ? (
            <p role="status" className="mt-6 text-[14px] text-muted-foreground">
              {posts.length} {posts.length === 1 ? "result" : "results"} for{" "}
              <span className="font-semibold text-ink">{query}</span>
              {category ? " in this category" : ""}
            </p>
          ) : null}

          {posts.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-line px-6 py-16 text-center">
              <h2 className="text-[17px] font-semibold text-ink">
                {query ? "No matching articles" : "Nothing published here yet"}
              </h2>
              <p className="mx-auto mt-2 max-w-[46ch] text-sm text-muted-foreground">
                {query
                  ? "Nothing matched that search. Try fewer words, or a different phrase."
                  : category
                    ? "No posts in this category yet."
                    : "The first articles are on the way."}
              </p>
              {query ? (
                <Link
                  href={blogHref({ category })}
                  className="mt-5 inline-block text-[14px] font-semibold text-teal hover:text-teal-dark"
                >
                  Clear the search
                </Link>
              ) : null}
            </div>
          ) : (
            <>
              {/* Lead story, given the space a first article deserves. */}
              {lead ? (
                <Link
                  href={`/blog/${lead.slug}`}
                  className="group mt-10 grid overflow-hidden rounded-3xl border border-line-soft bg-white shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift lg:grid-cols-[1.1fr_1fr]"
                >
                  <div className="order-2 p-[clamp(24px,3vw,44px)] lg:order-1">
                    {lead.blog_categories ? (
                      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-teal">
                        {lead.blog_categories.name}
                      </span>
                    ) : null}
                    <h2 className="mt-3 text-[clamp(1.4rem,1.2rem+0.8vw,1.9rem)] leading-[1.2] tracking-[-0.015em] text-ink">
                      {lead.title}
                    </h2>
                    {lead.excerpt ? (
                      <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
                        {lead.excerpt}
                      </p>
                    ) : null}
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal">
                      Read the article
                      <Icon
                        name="arrow-right"
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                    {lead.published_at ? (
                      <p className="mt-4 text-[13px] text-muted-foreground">
                        {postDate.format(new Date(lead.published_at))}
                      </p>
                    ) : null}
                  </div>
                  <div className="order-1 min-h-[200px] bg-sand lg:order-2">
                    {lead.cover_image_url ? (
                      <img
                        src={lead.cover_image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full min-h-[200px] place-items-center text-muted-foreground">
                        <Icon name="guest-posting" size={40} />
                      </div>
                    )}
                  </div>
                </Link>
              ) : null}

              {rest.length > 0 ? (
                <ul className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
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
                          {post.blog_categories ? (
                            <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-teal">
                              {post.blog_categories.name}
                            </span>
                          ) : null}
                          <h3 className="mt-2 text-[17px] font-semibold leading-snug text-ink">
                            {post.title}
                          </h3>
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
              ) : null}
            </>
          )}

          <div className="mt-[clamp(32px,4vw,56px)] grid gap-5 rounded-3xl border border-line-soft bg-white p-[clamp(24px,3vw,40px)] shadow-card lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center lg:gap-10">
            <div>
              <h2 className="text-[19px] font-semibold text-ink">Get these in your inbox</h2>
              <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-muted-foreground">
                One email a month with what we are seeing in search, before it turns up in everyone
                else's newsletter.
              </p>
            </div>
            <NewsletterForm sourcePage="/blog" />
          </div>

          <CtaStrip
            className="mt-[clamp(24px,3vw,40px)]"
            title="Want this applied to your site?"
            description="Send us your website and we'll come back with the specific gaps worth fixing first."
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
