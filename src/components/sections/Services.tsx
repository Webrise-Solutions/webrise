"use client";

import { useState } from "react";
import { ActionLink } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { services } from "@/data/site";
import { cn } from "@/lib/utils";

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = services[activeIndex]!;

  return (
    <section
      id="services"
      className="mx-auto max-w-[1200px] px-4 py-[clamp(48px,6vw,96px)] sm:px-6 md:px-10"
    >
      <div className="mx-auto max-w-[620px] text-center">
        <h2 className="text-[clamp(2rem,1.4rem+2vw,2.75rem)] leading-[1.15] tracking-[-0.02em]">
          Explore Our <span className="text-teal">Services</span>
        </h2>
        <div className="mx-auto mt-[18px] h-1 w-[120px] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
        <p className="mt-[22px] text-muted-foreground">
          Select a service below to see exactly what's included, how it works, and what results to
          expect.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Services"
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        {services.map((service, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={service.slug}
              type="button"
              role="tab"
              id={`tab-${service.slug}`}
              aria-selected={isActive}
              aria-controls={`panel-${service.slug}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "inline-flex items-center gap-2.5 rounded-full border px-[22px] py-3.5 text-[15px] font-semibold transition-colors duration-200",
                isActive
                  ? "border-teal bg-teal text-white shadow-tab"
                  : "border-line-soft bg-white text-ink shadow-card hover:border-teal",
              )}
            >
              <Icon name={service.icon} size={18} className="shrink-0" />
              {service.name}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active.slug}`}
        aria-labelledby={`tab-${active.slug}`}
        className="mt-8 grid overflow-hidden rounded-3xl border border-line-soft bg-white shadow-panel lg:grid-cols-2"
      >
        <div className="p-[clamp(28px,3vw,44px)]">
          <h3 className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] tracking-[-0.015em]">
            {active.name}
          </h3>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-teal-soft px-[18px] py-3.5">
            <Icon name="star" size={20} className="shrink-0 text-teal" />
            <span className="text-[15px] font-semibold text-teal-dark">{active.highlight}</span>
          </div>

          <p className="mt-5 max-w-[46ch] text-[15px] text-muted-foreground">
            {active.description}
          </p>

          <ul className="mt-[22px] grid gap-3.5">
            {active.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-[15px] text-ink">
                <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-teal-soft text-teal">
                  <Icon name="check" size={15} />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-[30px] flex flex-wrap gap-3">
            <ActionLink href="/audit">
              Get started
              <Icon name="arrow-right" size={17} />
            </ActionLink>
            <ActionLink href={`/services/${active.slug}`} variant="outline">
              Full {active.name} details
              <Icon name="arrow-right" size={17} />
            </ActionLink>
          </div>
        </div>

        <div className="border-t border-line-soft bg-offwhite p-[clamp(28px,3vw,44px)] lg:border-l lg:border-t-0">
          <h4 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            What's included
          </h4>
          <div className="mt-[18px]">
            {active.included.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between gap-4 border-b border-line-soft py-4"
              >
                <span className="text-[15px] text-ink">{item}</span>
                <span className="inline-flex flex-none items-center gap-1.5 rounded-full bg-[color-mix(in_oklch,var(--success)_12%,white)] px-3 py-[5px] text-xs font-semibold text-[var(--success)]">
                  <Icon name="check" size={13} />
                  Included
                </span>
              </div>
            ))}
          </div>
          <div className="mt-[22px] inline-flex items-center gap-2 rounded-full bg-teal-soft px-3.5 py-2 text-[13px] font-semibold text-teal">
            <Icon name="clock" size={15} />
            {active.result}
          </div>
        </div>
      </div>
    </section>
  );
}
