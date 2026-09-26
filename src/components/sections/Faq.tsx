import { Icon } from "@/components/shared/Icon";
import { faqs } from "@/data/site";
import { cn } from "@/lib/utils";

interface FaqProps {
  /**
   * `grid` puts two questions per row (homepage); `list` is one full-width
   * column (the /faq page). The grid starts fully collapsed so every card is
   * the same height — an item open by default would stretch its row-mate.
   */
  layout?: "grid" | "list";
}

export function Faq({ layout = "list" }: FaqProps) {
  const isGrid = layout === "grid";

  return (
    <section
      id="faq"
      className="mx-auto max-w-[1200px] px-4 py-[clamp(48px,6vw,96px)] sm:px-6 md:px-10"
    >
      <div className="mx-auto max-w-[620px] text-center">
        <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
          Questions
        </span>
        <h2 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
          Straight answers, before you ask
        </h2>
        <div className="mx-auto mt-[18px] h-1 w-[120px] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
      </div>

      {/* `name` makes the details elements an exclusive accordion where supported,
          so at most one card is ever expanded. */}
      <div
        className={cn(
          "mt-10 grid",
          isGrid ? "items-start gap-5 md:grid-cols-2" : "mx-auto max-w-[860px] gap-4",
        )}
      >
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            name="faq"
            open={!isGrid && index === 0}
            className="group rounded-2xl border border-line-soft bg-white px-6 py-5 shadow-card transition-shadow open:py-6 open:shadow-lift"
          >
            <summary className="flex cursor-pointer list-none items-start gap-4">
              <span
                className={`grid h-12 w-12 flex-none place-items-center rounded-full ${
                  faq.tone === "teal"
                    ? "bg-teal-soft text-teal"
                    : "bg-[color-mix(in_oklch,var(--orange)_14%,white)] text-rust"
                }`}
              >
                <Icon name={faq.icon} size={22} />
              </span>

              <span className="flex-1 pt-1">
                <span className="block text-xs font-semibold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block text-[17px] font-semibold text-ink">
                  {faq.question}
                </span>
              </span>

              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-slate-100 text-ink transition-transform duration-200 group-open:rotate-180">
                <Icon name="chevron-down" size={16} className="shrink-0" />
              </span>
            </summary>

            <p className="mt-4 pl-16 text-[15px] text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
