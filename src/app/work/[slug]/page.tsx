import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CtaStrip } from "@/components/shared/CtaStrip";
import { Icon } from "@/components/shared/Icon";
import { ScreenFrame } from "@/components/shared/ScreenFrame";
import { Prose } from "@/components/shared/Prose";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { siteUrl } from "@/data/site";
import { firstMetrics } from "../metrics";

export const revalidate = 300;

function publishedStudies() {
  return supabaseAdmin
    .from("case_studies")
    .select(
      "id, slug, title, client_name, summary, body, results, tags, cover_image_url, cover_image_alt, featured, seo_title, seo_description, service_id, services(name, slug), industries(name)",
    )
    .eq("status", "published");
}

async function loadStudy(slug: string) {
  const { data, error } = await publishedStudies().eq("slug", slug).maybeSingle();
  if (error) console.error("[case-studies] load failed", error);
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await loadStudy(slug);

  if (!study) return {};

  const title = study.seo_title ?? `${study.title} | Webrise`;
  const description = study.seo_description ?? study.summary ?? undefined;
  const path = `/work/${study.slug}`;

  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    openGraph: {
      title,
      ...(description ? { description } : {}),
      type: "article",
      url: `${siteUrl}${path}`,
      ...(study.cover_image_url ? { images: [study.cover_image_url] } : {}),
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await loadStudy(slug);

  if (!study) notFound();

  const metrics = firstMetrics(study.results, 4);

  const [{ data: related }, { data: testimonials }] = await Promise.all([
    publishedStudies().neq("slug", slug).limit(3),
    study.service_id
      ? supabaseAdmin
          .from("testimonials")
          .select("client_name, client_company, quote, rating")
          .eq("service_id", study.service_id)
          .limit(1)
      : Promise.resolve({ data: null }),
  ]);

  const testimonial = testimonials?.[0];

  const facts: { label: string; value: React.ReactNode }[] = [
    ...(study.client_name ? [{ label: "Client", value: study.client_name }] : []),
    ...(study.services
      ? [
          {
            label: "Service",
            value: (
              <Link
                href={`/services/${study.services.slug}`}
                className="text-teal hover:text-teal-dark"
              >
                {study.services.name}
              </Link>
            ),
          },
        ]
      : []),
    ...(study.industries ? [{ label: "Industry", value: study.industries.name }] : []),
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="mx-auto max-w-[1200px] px-6 pb-0 pt-8 sm:px-10">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
            All case studies
          </Link>
        </section>

        <article className="mx-auto max-w-[1200px] px-6 py-[clamp(32px,4vw,64px)] sm:px-10">
          {/* Hero: who it was for, what changed, and the numbers, before anything else. */}
          <header className="grid gap-[clamp(28px,4vw,56px)] lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {study.services ? (
                  <Link
                    href={`/services/${study.services.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-teal"
                  >
                    {study.services.name}
                  </Link>
                ) : null}
                {study.industries ? (
                  <span className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-muted-foreground">
                    {study.industries.name}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
                {study.title}
              </h1>

              <div className="mt-[22px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />

              {study.client_name ? (
                <p className="mt-5 text-[15px] font-semibold text-ink">{study.client_name}</p>
              ) : null}

              {study.summary ? (
                <p className="mt-2 max-w-[52ch] text-[clamp(1rem,0.95rem+0.3vw,1.125rem)] leading-relaxed text-muted-foreground">
                  {study.summary}
                </p>
              ) : null}
            </div>

            {metrics.length > 0 ? (
              <aside className="overflow-hidden rounded-3xl bg-[radial-gradient(120%_140%_at_15%_10%,color-mix(in_oklch,var(--teal-dark)_45%,var(--night)),var(--night)_55%)] p-[clamp(24px,3vw,36px)] shadow-dark">
                <h2 className="text-[13px] font-medium uppercase tracking-[0.08em] text-mint">
                  Results
                </h2>
                <dl className="mt-5 grid gap-x-6 gap-y-6 sm:grid-cols-2">
                  {metrics.map((metric) => (
                    <div key={metric.metric} className="min-w-0">
                      {/* text-balance keeps two-word values like "API + manual"
                          from breaking after the operator. */}
                      <dd className="text-balance text-[clamp(1.5rem,1.2rem+0.9vw,2.1rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-cream">
                        {metric.value}
                      </dd>
                      <dt className="mt-2 text-[13px] leading-snug text-mint">{metric.metric}</dt>
                      {metric.label ? (
                        <p className="mt-0.5 text-[12px] text-mint/70">{metric.label}</p>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </aside>
            ) : null}
          </header>

          {study.cover_image_url ? (
            <figure className="mt-[clamp(28px,4vw,56px)] rounded-3xl border border-line-soft bg-white p-3 shadow-card sm:p-4">
              <ScreenFrame
                src={study.cover_image_url}
                alt={study.cover_image_alt ?? ""}
                fit="natural"
              />
              {study.cover_image_alt ? (
                <figcaption className="px-1 pt-3 text-[13px] text-muted-foreground">
                  {study.cover_image_alt}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          <div className="mx-auto mt-[clamp(32px,4vw,56px)] max-w-[760px]">
            {/* Only the facts that exist. A cell reading "Not named" or an
                em dash is a row that costs the reader attention and returns
                nothing, so an absent field is dropped rather than filled. */}
            {facts.length > 0 ? (
              <dl
                className={`mb-[clamp(28px,3vw,44px)] grid gap-px overflow-hidden rounded-2xl border border-line-soft bg-line-soft ${
                  facts.length === 2 ? "sm:grid-cols-2" : facts.length >= 3 ? "sm:grid-cols-3" : ""
                }`}
              >
                {facts.map((fact) => (
                  <div key={fact.label} className="bg-white px-5 py-4">
                    <dt className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-[15px] font-semibold text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <Prose html={study.body} />

            {study.tags && study.tags.length > 0 ? (
              <ul className="mt-10 flex flex-wrap gap-2 border-t border-line-soft pt-6">
                {study.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {testimonial ? (
            <blockquote className="mx-auto mt-[clamp(32px,4vw,56px)] max-w-[860px] rounded-3xl border border-line-soft bg-white p-[clamp(24px,3vw,44px)] shadow-card">
              {testimonial.rating ? (
                <div
                  className="flex gap-0.5 text-[#F5B841]"
                  aria-label={`Rated ${testimonial.rating} out of 5`}
                >
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Icon key={index} name="star" size={16} />
                  ))}
                </div>
              ) : null}
              <p className="mt-4 text-[clamp(1.0625rem,1rem+0.4vw,1.35rem)] leading-relaxed text-ink">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-muted-foreground">
                <span className="font-semibold text-ink">{testimonial.client_name}</span>
                {testimonial.client_company ? `, ${testimonial.client_company}` : ""}
              </footer>
            </blockquote>
          ) : null}

          {related && related.length > 0 ? (
            <section className="mt-[clamp(40px,5vw,72px)]">
              <h2 className="text-[17px] font-semibold text-ink">More work</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/work/${item.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-line-soft bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
                    >
                      {item.services ? (
                        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-teal">
                          {item.services.name}
                        </span>
                      ) : null}
                      <span className="mt-2 text-[16px] font-semibold leading-snug text-ink">
                        {item.title}
                      </span>
                      {item.summary ? (
                        <span className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-muted-foreground">
                          {item.summary}
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
            title="Have a similar challenge?"
            description="Send us your site and we'll tell you what we would tackle first, and why."
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
