import { Icon } from "@/components/shared/Icon";
import { stats, whyCards } from "@/data/site";

export function WhyChoose() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-[clamp(48px,6vw,96px)] sm:px-6 md:px-10">
      <div className="mx-auto max-w-[640px] text-center">
        <h2 className="text-[clamp(2rem,1.4rem+2vw,2.75rem)] leading-[1.15] tracking-[-0.02em]">
          Why Choose <span className="text-teal">Webrise</span>
          <span className="text-rust">?</span>
        </h2>
        <div className="mx-auto mt-[18px] h-1 w-[120px] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
        <p className="mt-[22px] text-muted-foreground">
          We go beyond rankings. Our goal is to deliver measurable results, long-term growth and
          real business impact.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {whyCards.map((card) => (
          <article
            key={card.n}
            className="relative overflow-hidden rounded-[18px] border border-line-soft bg-white p-[30px] shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="absolute right-[26px] top-5 text-[44px] font-semibold leading-none text-sand">
              {card.n}
            </span>
            <div
              className={`grid h-14 w-14 place-items-center rounded-[14px] text-white ${
                card.tone === "teal" ? "bg-teal" : "bg-rust"
              }`}
            >
              <Icon name={card.icon} size={28} />
            </div>
            <h3 className="mt-[22px] text-xl">{card.title}</h3>
            <p className="mt-2.5 max-w-[34ch] text-[15px] text-muted-foreground">
              {card.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-5 rounded-[20px] bg-night p-[clamp(24px,3vw,36px)] shadow-dark sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 px-1 py-2">
            <span
              className={`grid h-[52px] w-[52px] flex-none place-items-center rounded-xl ${
                stat.tone === "mint"
                  ? "bg-[color-mix(in_oklch,var(--mint)_18%,transparent)] text-mint"
                  : "bg-[color-mix(in_oklch,var(--orange)_18%,transparent)] text-orange"
              }`}
            >
              <Icon name={stat.icon} size={26} />
            </span>
            <div>
              <div
                className={`text-[26px] font-semibold leading-none ${
                  stat.tone === "mint" ? "text-mint" : "text-orange"
                }`}
              >
                {stat.value}
              </div>
              <div className="mt-1.5 text-[13px] text-mint">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
