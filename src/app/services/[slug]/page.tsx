import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActionLink } from "@/components/ui/action";
import { CtaStrip } from "@/components/shared/CtaStrip";
import { ServiceTestimonials } from "@/components/sections/Testimonials";
import { ServiceWork } from "@/components/sections/ServiceWork";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { Icon } from "@/components/shared/Icon";
import { services, siteUrl } from "@/data/site";
import type { Service, ServiceCluster } from "@/types/site";

const clusterLabels: Record<ServiceCluster, string> = {
  seo: "Search visibility",
  development: "Build",
  growth: "Commerce",
};

function findService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

/**
 * Up to three others to cross-sell: same cluster first, then topped up from the
 * rest so a single-service cluster like `growth` is never left with an empty row.
 */
function relatedServices(current: Service): Service[] {
  const sameCluster = services.filter(
    (service) => service.slug !== current.slug && service.cluster === current.cluster,
  );
  const others = services.filter(
    (service) => service.slug !== current.slug && service.cluster !== current.cluster,
  );
  return [...sameCluster, ...others].slice(0, 3);
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);

  if (!service) return {};

  const title = `${service.name} | Webrise`;
  const path = `/services/${service.slug}`;

  return {
    title,
    description: service.description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: service.description,
      type: "website",
      url: `${siteUrl}${path}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);

  if (!service) notFound();

  const related = relatedServices(service);

  // Page copy is static; the proof around it is not. The row id is what links
  // this page to its testimonials and case studies, so look it up by the slug
  // the two sides already share.
  const { data: row, error } = await supabaseAdmin
    .from("services")
    .select("id")
    .eq("slug", service.slug)
    .maybeSingle();

  if (error) console.error("[services] id lookup failed", error);
  const serviceId = row?.id ?? null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    serviceType: service.name,
    url: `${siteUrl}/services/${service.slug}`,
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.name} deliverables`,
      itemListElement: service.included.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item },
      })),
    },
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
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
            All services
          </Link>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-[clamp(40px,5vw,80px)] sm:px-10">
          <div className="grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
                <Icon name={service.icon} size={15} className="shrink-0" />
                {clusterLabels[service.cluster]}
              </span>

              <h1 className="mt-5 max-w-[16ch] text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.08] tracking-[-0.02em]">
                {service.name}
              </h1>

              <div className="mt-[22px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />

              <p className="mt-[22px] max-w-[52ch] text-[clamp(1rem,0.95rem+0.3vw,1.125rem)] text-muted-foreground">
                {service.description}
              </p>

              <div className="mt-7 flex items-center gap-3 rounded-xl bg-teal-soft px-[18px] py-3.5">
                <Icon name="star" size={20} className="shrink-0 text-teal" />
                <span className="text-[15px] font-semibold text-teal-dark">
                  {service.highlight}
                </span>
              </div>

              <h2 className="mt-9 text-[17px] font-semibold text-ink">What the work involves</h2>
              <ul className="mt-4 grid gap-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[15px] text-ink">
                    <span className="mt-0.5 grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-teal-soft text-teal">
                      <Icon name="check" size={15} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap gap-3">
                <ActionLink href="/audit" size="lg" className="rounded-xl">
                  Get your free audit
                  <Icon name="arrow-right" size={18} className="shrink-0" />
                </ActionLink>
                <ActionLink href="/contact" variant="outline" size="lg" className="rounded-xl">
                  Talk it through
                </ActionLink>
              </div>
            </div>

            <aside className="overflow-hidden rounded-3xl border border-line-soft bg-white shadow-panel">
              <div className="border-b border-line-soft bg-offwhite px-6 py-5">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  What&apos;s included
                </h2>
              </div>

              <div className="px-6">
                {service.included.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-4 border-b border-line-soft py-4 last:border-b-0"
                  >
                    <span className="text-[15px] text-ink">{item}</span>
                    <span className="inline-flex flex-none items-center gap-1.5 rounded-full bg-[color-mix(in_oklch,var(--success)_12%,white)] px-3 py-[5px] text-xs font-semibold text-[var(--success)]">
                      <Icon name="check" size={13} />
                      Included
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-line-soft px-6 py-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3.5 py-2 text-[13px] font-semibold text-teal">
                  <Icon name="clock" size={15} />
                  {service.result}
                </span>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  Typical timeframe, not a guarantee. Search engines control their own algorithms.
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-[clamp(40px,5vw,72px)]">
            <h2 className="text-[17px] font-semibold text-ink">Often paired with</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line-soft bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-soft text-teal transition-transform duration-200 group-hover:scale-105">
                      <Icon name={item.icon} size={24} />
                    </span>
                    <span className="mt-4 flex items-center gap-1.5 text-[16px] font-semibold text-ink">
                      {item.name}
                      <Icon
                        name="arrow-right"
                        size={15}
                        className="flex-none text-teal opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </span>
                    <span className="mt-2 block text-[14px] leading-relaxed text-muted-foreground">
                      {item.highlight}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {serviceId ? (
            <>
              <ServiceWork serviceId={serviceId} serviceName={service.name} />
              <ServiceTestimonials serviceId={serviceId} />
            </>
          ) : null}

          <CtaStrip
            className="mt-[clamp(32px,4vw,56px)]"
            title={`Thinking about ${service.name}?`}
            description="Send us your site and we'll tell you whether this is the work that moves your numbers, or whether something else should come first."
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
