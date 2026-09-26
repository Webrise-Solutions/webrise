import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CtaStrip } from "@/components/shared/CtaStrip";
import { Icon } from "@/components/shared/Icon";
import { industries } from "@/data/site";
import { cn } from "@/lib/utils";

const title = "Industries We Serve | Webrise";
const description =
  "Discover the sectors we help grow, from SaaS and ecommerce to law, finance, dental, home services, and hospitality.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/industries" },
  openGraph: { title, description, type: "website" },
};

export default function IndustriesPage() {
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

        <section className="mx-auto max-w-[1200px] px-6 py-[clamp(32px,5vw,72px)] sm:px-10">
          <div className="relative overflow-hidden rounded-[32px] bg-night px-6 py-[clamp(44px,6vw,80px)] text-cream sm:px-10 lg:px-14">
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border-[56px] border-white/[0.035]" />
            <div className="pointer-events-none absolute -bottom-32 right-[24%] h-64 w-64 rounded-full bg-teal/20 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-mint">
                  <Icon name="briefcase" size={15} />
                  Who we help
                </span>
                <h1 className="mt-5 max-w-[13ch] text-[clamp(2.15rem,1.35rem+2.7vw,3.6rem)] leading-[1.04] tracking-[-0.04em] text-cream">
                  Your market has its own rules.{" "}
                  <span className="text-orange">We know how to read them.</span>
                </h1>
              </div>

              <div className="lg:pb-1">
                <p className="max-w-[50ch] text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] leading-relaxed text-mint">
                  Search behaviour, buying cycles, and competitive pressure change by sector. Our
                  strategies start with how your customers actually make decisions.
                </p>
                <div className="mt-7 flex items-center gap-4 border-t border-white/10 pt-5">
                  <span className="text-3xl font-semibold tracking-[-0.04em] text-cream">
                    {industries.length}
                  </span>
                  <span className="max-w-[18ch] text-[12px] font-medium uppercase leading-snug tracking-[0.08em] text-mint">
                    Industries with focused strategies
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-7 mt-[clamp(44px,6vw,72px)] flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-teal">
                Sector expertise
              </span>
              <h2 className="mt-2 text-[clamp(1.65rem,1.3rem+1.2vw,2.25rem)] tracking-[-0.025em] text-ink">
                Choose your industry
              </h2>
            </div>
            <p className="max-w-[45ch] text-sm leading-relaxed text-muted-foreground">
              Explore the challenges we solve and the services that create the biggest advantage.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, index) => {
              const isTeal = index % 2 === 0;
              return (
                <li key={industry.name} className="self-start">
                  <Link
                    href={"/industries/" + industry.slug}
                    className="group relative flex min-h-[245px] flex-col overflow-hidden rounded-[24px] border border-line-soft bg-white p-5 shadow-[0_8px_28px_rgba(16,44,45,0.055)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-teal/50 hover:shadow-[0_20px_44px_rgba(16,44,45,0.11)]"
                  >
                    <span
                      className={cn(
                        "absolute inset-x-0 top-0 h-1",
                        isTeal ? "bg-teal" : "bg-orange",
                      )}
                    />
                    <Icon
                      name={industry.icon}
                      size={116}
                      className={cn(
                        "pointer-events-none absolute -bottom-7 -right-6 transition-[opacity,transform] duration-300 group-hover:-translate-y-1 group-hover:opacity-[0.08]",
                        isTeal ? "text-teal opacity-[0.035]" : "text-rust opacity-[0.04]",
                      )}
                    />

                    <div className="relative flex items-start justify-between gap-4">
                      <span
                        className={cn(
                          "grid h-12 w-12 flex-none place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
                          isTeal
                            ? "bg-teal-soft text-teal"
                            : "bg-[color-mix(in_oklch,var(--orange)_14%,white)] text-rust",
                        )}
                      >
                        <Icon name={industry.icon} size={24} />
                      </span>
                      <span className="text-[11px] font-semibold tabular-nums tracking-[0.08em] text-muted-foreground/60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <span className="relative mt-5 text-[17px] font-semibold tracking-[-0.015em] text-ink">
                      {industry.name}
                    </span>
                    <span className="relative mt-2 block text-[13px] leading-relaxed text-muted-foreground">
                      {industry.focus}
                    </span>
                    <span className="relative mt-auto inline-flex items-center gap-1.5 pt-4 text-[12px] font-semibold text-teal">
                      Explore industry
                      <Icon
                        name="arrow-right"
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <CtaStrip
            className="mt-[clamp(36px,5vw,64px)]"
            title="Not on the list?"
            description="The fundamentals travel. Send us your site and we'll tell you straight whether your market is one we can move."
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
