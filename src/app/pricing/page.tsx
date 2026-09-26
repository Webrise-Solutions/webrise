import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActionLink } from "@/components/ui/action";
import { CtaStrip } from "@/components/shared/CtaStrip";
import { Icon } from "@/components/shared/Icon";
import type { IconName } from "@/components/shared/Icon";
import { contact, services, siteUrl } from "@/data/site";
import type { ServiceCluster } from "@/types/site";

const title = "Pricing | Webrise";
const description =
  "How Webrise scopes and prices work: quoted per engagement, no lock-in contracts, and a free audit before you commit to anything.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pricing" },
  openGraph: { title, description, type: "website", url: `${siteUrl}/pricing` },
};

/**
 * Packages overview.
 *
 * Deliberately carries no price points. Engagements here are scoped and quoted
 * per client, and publishing invented figures would be a commercial claim the
 * business has not made. The page explains what shapes a quote instead, which
 * is the question someone on a pricing page is actually asking.
 */
/**
 * Deliverables for a group, taken one at a time from each service in turn.
 *
 * Round-robin rather than concatenated: a straight flatMap would fill all five
 * slots from the first service and never mention the other four.
 */
function groupDeliverables(members: { included: string[] }[], limit = 5) {
  const out: string[] = [];
  for (let round = 0; out.length < limit; round += 1) {
    if (members.every((m) => round >= m.included.length)) break;
    for (const member of members) {
      const item = member.included[round];
      if (item && !out.includes(item) && out.length < limit) out.push(item);
    }
  }
  return out;
}

const clusters: {
  key: ServiceCluster;
  label: string;
  icon: IconName;
  summary: string;
  /** How the work is billed, short enough to read as a badge. */
  model: string;
  suits: string;
}[] = [
  {
    key: "seo",
    label: "Search visibility",
    icon: "ai-seo",
    model: "Monthly retainer",
    summary:
      "Ongoing work to get found: technical health, content built around real search intent, and earned authority.",
    suits:
      "Best as a monthly retainer, because search compounds and stops compounding when you stop.",
  },
  {
    key: "development",
    label: "Build",
    icon: "web-development",
    model: "Fixed-scope project",
    summary:
      "Sites, apps and products built to be fast, accessible and findable from the first commit rather than patched later.",
    suits: "Usually a fixed-scope project, with an optional retainer for maintenance afterwards.",
  },
  {
    key: "growth",
    label: "Commerce",
    icon: "ecommerce",
    model: "Project, then retainer",
    summary:
      "Channels where discovery and buying happen in the same place, treated as search rather than as social.",
    suits: "Setup as a project, then a lighter monthly cadence once the shop is live.",
  },
];

const factors: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "search",
    title: "How competitive your market is",
    description:
      "Ranking a local clinic and ranking a national finance brand are different amounts of work, not different rates.",
  },
  {
    icon: "monitor",
    title: "The state of the site today",
    description:
      "A clean, fast site needs less remedial work than one carrying years of technical debt. The audit tells us which you have.",
  },
  {
    icon: "briefcase",
    title: "How much we write and build",
    description: "Content volume and development scope are the two levers that move a quote most.",
  },
  {
    icon: "clock",
    title: "Pace",
    description:
      "The same scope delivered faster costs more, because it takes more of the team at once.",
  },
];

const included = [
  "A named senior specialist, never a junior hand-off",
  "Monthly reporting written in plain English",
  "Full access to every tool and dashboard we use on your account",
  "You own everything we produce once invoices are paid",
  "No lock-in contracts",
];

export default function PricingPage() {
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
                Pricing
              </span>
              <h1 className="mt-5 max-w-[16ch] text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.08] tracking-[-0.02em]">
                Quoted for the work, not from a menu
              </h1>
              <div className="mt-[22px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
            </div>
            <p className="max-w-[52ch] text-[clamp(1rem,0.95rem+0.3vw,1.125rem)] text-muted-foreground lg:pb-1">
              We do not publish package prices, because the same three-word service can mean a
              fortnight or six months depending on your market and your site. Every engagement is
              scoped and quoted after a free audit.
            </p>
          </div>

          {/* Engagement shapes, drawn from the real service clusters. */}
          <ul className="mt-[clamp(32px,4vw,56px)] grid gap-5 lg:grid-cols-3">
            {clusters.map((cluster) => {
              const members = services.filter((service) => service.cluster === cluster.key);
              const deliverables = groupDeliverables(members);

              return (
                <li key={cluster.key}>
                  <div className="flex h-full flex-col rounded-3xl border border-line-soft bg-white p-6 shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-teal-soft text-teal">
                        <Icon name={cluster.icon} size={24} />
                      </span>
                      {/* The billing shape, where a priced page would put a
                          figure. It is the question a buyer is actually asking
                          at this point, and the one thing we can answer
                          without inventing a number. */}
                      <span className="rounded-full border border-line bg-offwhite px-3 py-1.5 text-[12px] font-semibold text-muted-foreground">
                        {cluster.model}
                      </span>
                    </div>

                    <h2 className="mt-4 text-[19px] font-semibold text-ink">{cluster.label}</h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                      {cluster.summary}
                    </p>

                    <p className="mt-4 flex min-h-[86px] items-center rounded-xl bg-offwhite px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
                      {cluster.suits}
                    </p>

                    {/* Chips, not a stacked list. Five services stacked
                        against Commerce's one made the cards differ by four
                        rows; wrapped chips differ by a single line, which is
                        what lets them share a height without a void. */}
                    <h3 className="mt-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Services in this group
                      <span className="ml-1.5 font-semibold text-teal">{members.length}</span>
                    </h3>
                    <ul className="mt-3 flex min-h-[112px] flex-wrap content-start gap-1.5">
                      {members.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`/services/${service.slug}`}
                            className="inline-flex rounded-full border border-line bg-white px-2.5 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-teal hover:text-teal"
                          >
                            {service.name}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <h3 className="mt-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      What that includes
                    </h3>
                    <ul className="mt-3 grid gap-2">
                      {deliverables.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-[14.5px] text-ink">
                          <Icon name="check" size={15} className="flex-none text-teal" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-6">
                      <ActionLink href="/audit" size="sm" className="w-full rounded-xl">
                        Get a quote
                        <Icon name="arrow-right" size={16} className="shrink-0" />
                      </ActionLink>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-[clamp(40px,5vw,72px)] grid gap-[clamp(28px,4vw,56px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <h2 className="text-[clamp(1.5rem,1.3rem+0.8vw,1.9rem)] leading-[1.2] tracking-[-0.015em]">
                What moves a quote
              </h2>
              <ul className="mt-6 grid gap-5">
                {factors.map((factor) => (
                  <li key={factor.title} className="flex items-start gap-4">
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-teal-soft text-teal">
                      <Icon name={factor.icon} size={22} />
                    </span>
                    <div>
                      <h3 className="text-[16px] font-semibold text-ink">{factor.title}</h3>
                      <p className="mt-1 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
                        {factor.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="overflow-hidden rounded-3xl bg-[radial-gradient(120%_140%_at_15%_10%,color-mix(in_oklch,var(--teal-dark)_45%,var(--night)),var(--night)_55%)] p-[clamp(28px,4vw,44px)] shadow-dark">
              <h2 className="text-[13px] font-medium uppercase tracking-[0.08em] text-mint">
                In every engagement
              </h2>
              <ul className="mt-5 grid gap-3.5">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-cream">
                    <span className="mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-[color-mix(in_oklch,var(--mint)_16%,transparent)] text-mint">
                      <Icon name="check" size={13} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-7 border-t border-teal-soft/15 pt-6">
                <p className="text-[15px] leading-relaxed text-mint">
                  Prefer to talk it through before anything is written down?
                </p>
                <ActionLink
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghostLight"
                  size="sm"
                  className="mt-4 rounded-xl"
                >
                  <Icon name="whatsapp" size={16} className="shrink-0" />
                  Message us on WhatsApp
                </ActionLink>
              </div>
            </aside>
          </div>

          <div className="mt-[clamp(32px,4vw,56px)] rounded-2xl border border-line bg-sand px-6 py-6 sm:px-8">
            <h2 className="text-[17px] font-semibold text-ink">How a quote happens</h2>
            <ol className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                [
                  "01",
                  "Free audit",
                  "Send us your site. We come back with what is actually holding it back.",
                ],
                ["02", "Scope", "We agree what to tackle first, in what order, and at what pace."],
                [
                  "03",
                  "Written quote",
                  "Fixed scope, fixed fee, in writing. Nothing starts before you agree it.",
                ],
              ].map(([step, heading, body]) => (
                <li key={step} className="flex gap-3.5">
                  <span className="font-mono text-[13px] font-semibold text-teal">{step}</span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink">{heading}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <CtaStrip
            className="mt-[clamp(32px,4vw,56px)]"
            title="Start with the audit"
            description="It costs nothing and it is the only honest way for us to quote. You will get a plain-English read on your site either way."
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
