import { Icon } from "@/components/shared/Icon";
import { processSteps } from "@/data/site";

export function Process() {
  return (
    <section
      id="process"
      className="mx-auto max-w-[1200px] px-4 py-[clamp(48px,6vw,96px)] sm:px-6 md:px-10"
    >
      <div className="mx-auto max-w-[640px] text-center">
        <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
          How we work
        </span>
        <h2 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
          A clear path from audit to growth
        </h2>
        <div className="mx-auto mt-[18px] h-1 w-[120px] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
        <p className="mt-[22px] text-muted-foreground">
          Six stages, each with an honest time expectation. You always know what is happening and
          why.
        </p>
      </div>

      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {processSteps.map((step, index) => {
          const isTeal = index % 2 === 0;
          return (
            <li
              key={step.n}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-line-soft bg-white p-6 pt-7 shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <span
                className={`absolute inset-x-0 top-0 h-1 ${isTeal ? "bg-teal" : "bg-orange"}`}
              />

              <div className="flex items-start justify-between">
                <span
                  className={`grid h-12 w-12 flex-none place-items-center rounded-full ${
                    isTeal
                      ? "bg-teal-soft text-teal"
                      : "bg-[color-mix(in_oklch,var(--orange)_14%,white)] text-rust"
                  }`}
                >
                  <Icon name={step.icon} size={22} />
                </span>
                <span
                  className={`text-4xl font-extrabold leading-none ${
                    isTeal
                      ? "text-[color-mix(in_oklch,var(--teal)_16%,white)]"
                      : "text-[color-mix(in_oklch,var(--orange)_16%,white)]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-[15px] text-muted-foreground">{step.description}</p>

              <div className="mt-6 flex flex-1 items-end justify-between gap-3">
                <span className={`h-[3px] w-16 rounded-full ${isTeal ? "bg-teal" : "bg-orange"}`} />
                <span
                  className={`grid h-10 w-10 flex-none place-items-center rounded-full text-white ${
                    isTeal ? "bg-teal-dark" : "bg-rust"
                  }`}
                >
                  <Icon name="arrow-right" size={16} />
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
