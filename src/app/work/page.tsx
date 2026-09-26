import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CtaStrip } from "@/components/shared/CtaStrip";
import { Icon } from "@/components/shared/Icon";
import { ScreenFrame } from "@/components/shared/ScreenFrame";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { resultTypes, type ResultType } from "./metrics";

const title = "Case Studies | Webrise";
const description =
  "How we approached real search problems, what we changed, and what happened next.";

export const metadata: Metadata = {
  title,
  description,
  // Every filtered view is the same set of case studies, narrowed. They all
  // canonicalise back to the unfiltered page rather than competing with it.
  alternates: { canonical: "/work" },
  openGraph: { title, description, type: "website" },
};

type SearchParams = { service?: string; industry?: string; result?: string };

/**
 * Query params still honoured after the filter chips were removed: the
 * industry and service pages deep-link into a narrowed view, and dropping
 * support would quietly turn "see all work in this sector" into "see
 * everything".
 */
const FACETS = ["service", "industry", "result"] as const;

export default async function CaseStudiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const active = await searchParams;

  const { data, error } = await supabaseAdmin
    .from("case_studies")
    .select(
      "id, slug, title, client_name, summary, results, cover_image_url, featured, services(name, slug), industries(name, slug)",
    )
    .eq("status", "published")
    // Featured still pins to the top — that is what the flag is for, and
    // letting a reversal quietly bury a study someone deliberately promoted
    // would make the checkbox do the opposite of what it says. Everything
    // below it runs oldest-updated first.
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: true });

  if (error) console.error("[case-studies] index failed", error);
  const studies = data ?? [];

  const typesById = new Map(studies.map((study) => [study.id, resultTypes(study.results)]));

  const visible = studies.filter((study) => {
    if (active.service && study.services?.slug !== active.service) return false;
    if (active.industry && study.industries?.slug !== active.industry) return false;
    if (active.result) {
      const types: ResultType[] = typesById.get(study.id) ?? [];
      if (!types.some((type) => type === active.result)) return false;
    }
    return true;
  });

  const isFiltered = FACETS.some((facet) => Boolean(active[facet]));

  // Distinct services and industries across the published work. Real counts,
  // derived from the same rows the grid renders, so they cannot drift.
  const serviceCount = new Set(studies.flatMap((s) => (s.services ? [s.services.slug] : []))).size;
  const industryCount = new Set(studies.flatMap((s) => (s.industries ? [s.industries.slug] : [])))
    .size;

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
                <Icon name="award" size={15} className="shrink-0" />
                Our work
              </span>
              <h1 className="mt-5 max-w-[16ch] text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.08] tracking-[-0.02em]">
                The problem, the approach, the outcome
              </h1>
              <div className="mt-[22px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
            </div>
            <p className="max-w-[52ch] text-[clamp(1rem,0.95rem+0.3vw,1.125rem)] text-muted-foreground lg:pb-1">
              Written as stories rather than screenshots: what the business needed, what we changed,
              and what moved as a result.
            </p>
          </div>

          {/* What the filter panel used to occupy, doing something useful:
              the shape of the portfolio at a glance. Counts come from the
              rendered rows rather than being written down anywhere. */}
          <dl className="mt-[clamp(28px,3.5vw,48px)] grid gap-px overflow-hidden rounded-2xl border border-line-soft bg-line-soft sm:grid-cols-3">
            <div className="bg-white px-5 py-4">
              <dt className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Case studies
              </dt>
              <dd className="mt-1.5 text-[19px] font-semibold tracking-[-0.02em] text-ink">
                {studies.length}
              </dd>
            </div>
            <div className="bg-white px-5 py-4">
              <dt className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Services
              </dt>
              <dd className="mt-1.5 text-[19px] font-semibold tracking-[-0.02em] text-ink">
                {serviceCount}
              </dd>
            </div>
            <div className="bg-white px-5 py-4">
              <dt className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Industries
              </dt>
              <dd className="mt-1.5 text-[19px] font-semibold tracking-[-0.02em] text-ink">
                {industryCount}
              </dd>
            </div>
          </dl>

          {/* Only when someone arrived from an industry or service page. There
              is no filter UI any more, so this is also the only way back out. */}
          {isFiltered ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-sand px-5 py-4">
              <p className="text-[14px] text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-ink">
                  {visible.length} of {studies.length}
                </span>{" "}
                case studies.
              </p>
              <Link
                href="/work"
                scroll={false}
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-teal hover:text-teal-dark"
              >
                Show all work
                <Icon name="arrow-right" size={15} className="shrink-0" />
              </Link>
            </div>
          ) : null}

          {visible.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-line px-6 py-16 text-center">
              <h2 className="text-[17px] font-semibold text-ink">
                {studies.length === 0 ? "Nothing published yet" : "No case studies match that"}
              </h2>
              <p className="mx-auto mt-2 max-w-[46ch] text-sm text-muted-foreground">
                {studies.length === 0
                  ? "The first write-ups are being prepared."
                  : "Try a different combination, or clear the filters to see everything."}
              </p>
              {studies.length > 0 ? (
                <Link
                  href="/work"
                  scroll={false}
                  className="mt-5 inline-block text-[14px] font-semibold text-teal hover:text-teal-dark"
                >
                  Clear filters
                </Link>
              ) : null}
            </div>
          ) : (
            <ul className="mt-10 grid gap-5 md:grid-cols-2">
              {visible.map((study) => {
                return (
                  <li key={study.id} className="h-full">
                    <Link
                      href={`/work/${study.slug}`}
                      className="group flex h-full flex-col rounded-[22px] border border-line-soft bg-white p-2.5 shadow-[0_8px_30px_rgba(16,44,45,0.06)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-teal/50 hover:shadow-[0_18px_45px_rgba(16,44,45,0.12)]"
                    >
                      {/* Inset rather than edge to edge: the card becomes a
                          surface the screen sits on, which stops the crop
                          fighting the card's own rounded corner. */}
                      <ScreenFrame
                        src={study.cover_image_url}
                        alt=""
                        fallbackIcon="award"
                        fit="cover"
                      />

                      <div className="flex min-h-[104px] items-end justify-between gap-4 px-3 pb-3 pt-4">
                        <div className="min-w-0">
                          <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-teal">
                            {study.services?.name ?? "Case study"}
                          </span>
                          <h2 className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-[17px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                            {study.title}
                          </h2>
                        </div>
                        <span className="mb-0.5 grid h-9 w-9 flex-none place-items-center rounded-full border border-line bg-cream text-teal transition-[background-color,color,border-color,transform] duration-200 group-hover:translate-x-0.5 group-hover:border-teal group-hover:bg-teal group-hover:text-white">
                          <Icon name="arrow-right" size={16} />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <CtaStrip
            className="mt-[clamp(32px,4vw,56px)]"
            title="Have a similar challenge?"
            description="Send us your site and we'll tell you what we would tackle first, and why."
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
