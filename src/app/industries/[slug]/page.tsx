import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActionLink } from "@/components/ui/action";
import { CtaStrip } from "@/components/shared/CtaStrip";
import { Icon } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { industries as siteIndustries, processSteps, services, siteUrl } from "@/data/site";

export const revalidate = 300;

async function loadIndustry(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("industries")
    .select("id, slug, name, description, seo_title, seo_description")
    .eq("slug", slug)
    .maybeSingle();

  if (error) console.error("[industries] load failed", error);
  return data;
}

export async function generateStaticParams() {
  const { data } = await supabaseAdmin.from("industries").select("slug");
  return (data ?? []).map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = await loadIndustry(slug);

  if (!industry) return {};

  const title = industry.seo_title ?? `${industry.name} SEO | Webrise`;
  const description = industry.seo_description ?? industry.description ?? undefined;

  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: {
      title,
      ...(description ? { description } : {}),
      type: "website",
      url: `${siteUrl}/industries/${industry.slug}`,
    },
  };
}

/**
 * A vertical page carries its own copy plus the work and services attached to
 * it. If a sector only ever has the one description line and nothing linked, it
 * is a thin page and is better folded into the /work filters — worth checking
 * as real case studies land.
 */
export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = await loadIndustry(slug);

  if (!industry) notFound();

  const { data: studies } = await supabaseAdmin
    .from("case_studies")
    .select("id, slug, title, summary, cover_image_url, services(name)")
    .eq("status", "published")
    .eq("industry_id", industry.id)
    .limit(3);

  // The icon for this sector already exists in the site content, keyed by the
  // same slug the industries table uses.
  const fromSite = siteIndustries.find((item) => item.slug === slug);

  // Ordered by the sector's own list rather than a fixed four. Filtered
  // through the real service catalogue so a typo in the data drops the card
  // instead of rendering a dead link.
  const suggested = (fromSite?.services ?? [])
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is (typeof services)[number] => Boolean(service));

  /*
   * No testimonial section here, deliberately.
   *
   * Testimonials are tagged by service, not by industry. Pulling one for the
   * sector's lead service put a dental clinic's quote about competing clinics
   * under "what clients say" on the real-estate page — technically a Local SEO
   * testimonial, and read by anyone on that page as proof in their sector.
   *
   * It needs an industry link on `testimonials` before it can go back.
   */

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="mx-auto max-w-[1200px] px-6 pb-0 pt-8 sm:px-10">
          <Link
            href="/industries"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
            All industries
          </Link>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 pb-[clamp(36px,4.5vw,64px)] pt-[clamp(28px,3.5vw,48px)] sm:px-10">
          <div className="grid items-center gap-[clamp(32px,5vw,64px)] lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="inline-flex items-center gap-3">
                <span
                  className={`grid h-12 w-12 flex-none place-items-center rounded-2xl ${
                    fromSite ? "bg-teal-soft text-teal" : "bg-sand text-muted-foreground"
                  }`}
                >
                  <Icon name={fromSite?.icon ?? "briefcase"} size={24} />
                </span>
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
                  Industry
                </span>
              </span>

              <h1 className="mt-6 max-w-[18ch] text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
                SEO for {industry.name.toLowerCase()}
              </h1>

              <div className="mt-[22px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />

              {industry.description ? (
                <p className="mt-[22px] max-w-[46ch] text-[clamp(1.0625rem,1rem+0.35vw,1.25rem)] leading-relaxed text-muted-foreground">
                  {industry.description}
                </p>
              ) : null}
            </div>

            {/*
              A stats-style panel rather than an illustration — but every mark
              in it is true. The bars encode the order we work through this
              sector's services, which is real editorial data that differs per
              page. Deliberately not performance figures: no per-industry
              benchmark has been measured, and inventing "73% of searches are
              local" would be presenting made-up research as fact.
            */}
            <div className="rounded-3xl border border-line-soft bg-white p-[clamp(22px,2.5vw,32px)] shadow-card">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-teal-soft text-teal">
                  <Icon name="trending-up" size={17} />
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Where we focus
                </span>
              </div>

              <ul className="mt-6 grid gap-4">
                {suggested.map((service, index) => (
                  <li key={service.slug}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[14px] font-semibold text-ink">{service.name}</span>
                      {index === 0 ? (
                        <span className="flex-none text-[11px] font-semibold uppercase tracking-[0.06em] text-teal">
                          Start here
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--teal),color-mix(in_oklch,var(--teal)_45%,white))]"
                        style={{ width: `${100 - index * 19}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-t border-line-soft pt-4 text-[12.5px] leading-relaxed text-muted-foreground">
                The order we usually work through {industry.name.toLowerCase()}, not a performance
                benchmark.
              </p>
            </div>
          </div>
        </section>

        {fromSite && fromSite.challenges.length > 0 ? (
          /* Full-bleed and dark. Eight cream pages of body copy is the thing
             that makes a reader leave; one hard contrast break is what stops
             the scroll long enough for the sector-specific part to be read. */
          <section className="border-y border-white/8 bg-[radial-gradient(120%_140%_at_15%_10%,color-mix(in_oklch,var(--teal-dark)_45%,var(--night)),var(--night)_55%)]">
            <div className="mx-auto max-w-[1200px] px-6 py-[clamp(48px,6vw,88px)] sm:px-10">
              <div className="grid gap-x-[clamp(24px,4vw,64px)] gap-y-4 lg:grid-cols-[1fr_1fr] lg:items-end">
                <div>
                  <h2 className="max-w-[20ch] text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] leading-[1.2] tracking-[-0.015em] text-cream text-balance">
                    What makes search different in {industry.name.toLowerCase()}
                  </h2>
                  <div className="mt-[18px] h-1 w-[120px] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
                </div>
                <p className="max-w-[46ch] text-[15px] leading-relaxed text-mint lg:pb-1">
                  Three things that decide the outcome in this sector, and that a generic search
                  plan will miss.
                </p>
              </div>

              <ul className="mt-10 grid gap-8 md:grid-cols-3">
                {fromSite.challenges.map((point) => (
                  <li key={point}>
                    <span
                      aria-hidden="true"
                      className="block h-1 w-8 rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]"
                    />
                    <p className="mt-4 text-[15px] leading-relaxed text-mint">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-[1200px] px-6 py-[clamp(40px,5vw,80px)] sm:px-10">
          <section>
            <h2 className="text-[17px] font-semibold text-ink">
              Where we usually start in {industry.name.toLowerCase()}
            </h2>
            <ul
              className={`mt-4 grid gap-4 sm:grid-cols-2 ${
                suggested.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
              }`}
            >
              {suggested.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line-soft bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-soft text-teal">
                      <Icon name={service.icon} size={21} />
                    </span>
                    <span className="mt-4 flex items-center gap-1.5 text-[16px] font-semibold text-ink">
                      {service.name}
                      <Icon
                        name="arrow-right"
                        size={15}
                        className="flex-none text-teal opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </span>
                    <span className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                      {service.highlight}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-[clamp(40px,5vw,72px)]">
            <h2 className="text-[17px] font-semibold text-ink">How we would approach it</h2>
            <ol className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.slice(0, 4).map((step, index) => (
                <li key={step.title} className="relative">
                  {/* The connector only exists between steps, so the last one
                      does not trail a line into empty space. */}
                  {index < 3 ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[52px] top-[22px] hidden h-px w-[calc(100%-28px)] bg-line lg:block"
                    />
                  ) : null}
                  <span className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-[14px] font-semibold tabular-nums text-teal">
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    {step.time}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {studies && studies.length > 0 ? (
            <section className="mt-[clamp(40px,5vw,72px)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[17px] font-semibold text-ink">Work in this sector</h2>
                <Link
                  href={`/work?industry=${industry.slug}`}
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-teal hover:text-teal-dark"
                >
                  See all
                  <Icon name="arrow-right" size={15} className="shrink-0" />
                </Link>
              </div>
              <ul
                className={`mt-4 grid gap-4 ${
                  studies.length === 1
                    ? "max-w-[560px]"
                    : studies.length === 2
                      ? "sm:grid-cols-2"
                      : "sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {studies.map((study) => (
                  <li key={study.id}>
                    <Link
                      href={`/work/${study.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-line-soft bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
                    >
                      {study.services ? (
                        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-teal">
                          {study.services.name}
                        </span>
                      ) : null}
                      <span className="mt-2 text-[16px] font-semibold leading-snug text-ink">
                        {study.title}
                      </span>
                      {study.summary ? (
                        <span className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted-foreground">
                          {study.summary}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <div className="mt-[clamp(40px,5vw,72px)] rounded-2xl border border-dashed border-line px-6 py-10 text-center">
              <h2 className="text-[16px] font-semibold text-ink">
                No published work in this sector yet
              </h2>
              <p className="mx-auto mt-2 max-w-[52ch] text-sm text-muted-foreground">
                Case studies tagged {industry.name.toLowerCase()} will appear here as they are
                published.
              </p>
              <ActionLink href="/work" variant="outline" size="sm" className="mt-5">
                See all our work
                <Icon name="arrow-right" size={16} className="shrink-0" />
              </ActionLink>
            </div>
          )}

          <CtaStrip
            className="mt-[clamp(32px,4vw,56px)]"
            title={`Working in ${industry.name.toLowerCase()}?`}
            description="Send us your site and we'll tell you what is holding it back in your market specifically."
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
