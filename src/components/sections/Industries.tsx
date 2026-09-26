import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { industries } from "@/data/site";

export function Industries() {
  return (
    <section id="industries" className="bg-cream">
      <div className="mx-auto max-w-[1200px] px-4 py-[clamp(48px,6vw,96px)] sm:px-6 md:px-10">
        <div className="mx-auto max-w-[640px] text-center">
          <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
            Who we help
          </span>
          <h2 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
            Growth strategies tuned to your industry
          </h2>
          <div className="mx-auto mt-[18px] h-1 w-[120px] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
          <p className="mt-[22px] text-muted-foreground">
            Every industry searches, compares and buys differently. Our strategies are built around
            how your customers actually find you.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, index) => {
            const isTeal = index % 2 === 0;
            return (
              <li key={industry.name}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-line-soft bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
                >
                  <span
                    className={`grid h-12 w-12 flex-none place-items-center rounded-2xl ${
                      isTeal
                        ? "bg-teal-soft text-teal"
                        : "bg-[color-mix(in_oklch,var(--orange)_14%,white)] text-rust"
                    }`}
                  >
                    <Icon name={industry.icon} size={24} />
                  </span>
                  <span className="flex-1 font-semibold text-ink">{industry.name}</span>
                  <Icon
                    name="arrow-right"
                    size={16}
                    className="flex-none text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-teal group-hover:opacity-100"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
