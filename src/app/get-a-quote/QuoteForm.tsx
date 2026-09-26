"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { FormShield } from "@/components/shared/FormShield";
import { submitQuoteRequest, type QuoteState } from "@/actions/quote-requests";

type Service = { id: string; name: string; cluster: string };

const fieldClass =
  "w-full rounded-xl border border-input-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/20";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

const BUDGETS = [
  "Not sure yet",
  "Under £2,000 / month",
  "£2,000 – £5,000 / month",
  "£5,000 – £10,000 / month",
  "£10,000+ / month",
  "One-off project",
];

const TIMELINES = ["As soon as possible", "Within a month", "Next quarter", "Just exploring"];

const CLUSTER_LABELS: Record<string, string> = {
  seo: "SEO & Visibility",
  development: "Development",
  growth: "Growth & Commerce",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="lg" disabled={pending} className="w-full rounded-xl">
      {pending ? "Sending..." : "Request a quote"}
      {pending ? null : <Icon name="arrow-right" size={18} className="shrink-0" />}
    </ActionButton>
  );
}

export function QuoteForm({ services }: { services: Service[] }) {
  const [state, formAction] = useActionState<QuoteState, FormData>(submitQuoteRequest, {});

  const grouped = ["seo", "development", "growth"].map((cluster) => ({
    cluster,
    items: services.filter((service) => service.cluster === cluster),
  }));

  if (state.sent) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-line-soft bg-white p-[clamp(28px,4vw,48px)] text-center shadow-card"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
          <Icon name="check-circle" size={28} />
        </span>
        <h2 className="mt-5 text-[clamp(1.35rem,1.2rem+0.6vw,1.75rem)] tracking-[-0.015em]">
          Request received
        </h2>
        <p className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
          A senior specialist will read it and come back within one working day, usually with a
          couple of questions before we put numbers to anything.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="relative rounded-3xl border border-line-soft bg-white p-[clamp(24px,3vw,40px)] shadow-panel"
    >
      <FormShield sourcePage="/get-a-quote" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name
          </label>
          <input id="name" name="name" required maxLength={120} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder="you@company.co.uk"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Company <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="company" name="company" maxLength={160} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" maxLength={40} className={fieldClass} />
        </div>
      </div>

      <fieldset className="mt-7">
        <legend className={labelClass}>What are you interested in?</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          {grouped.map(({ cluster, items }) => (
            <div key={cluster}>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {CLUSTER_LABELS[cluster]}
              </p>
              <div className="grid gap-1.5">
                {items.map((service) => (
                  <label
                    key={service.id}
                    className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-[14px] text-ink transition-colors hover:bg-offwhite"
                  >
                    <input
                      type="checkbox"
                      name="service_ids"
                      value={service.id}
                      className="mt-0.5 h-4 w-4 flex-none accent-[var(--teal)]"
                    />
                    {service.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="budget_range" className={labelClass}>
            Budget
          </label>
          <select id="budget_range" name="budget_range" defaultValue="" className={fieldClass}>
            <option value="">Select one...</option>
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="project_timeline" className={labelClass}>
            Timeline
          </label>
          <select
            id="project_timeline"
            name="project_timeline"
            defaultValue=""
            className={fieldClass}
          >
            <option value="">Select one...</option>
            {TIMELINES.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="notes" className={labelClass}>
          Anything we should know?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={4000}
          placeholder="Your site, your market, what you have tried, what is not working..."
          className={fieldClass}
        />
      </div>

      <label className="mt-5 flex items-start gap-3 text-[14px] leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-4 w-4 flex-none accent-[var(--teal)]"
        />
        I am happy for Webrise to contact me about this request.
      </label>

      {state.error ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-rust/25 bg-[color-mix(in_oklch,var(--orange)_10%,white)] px-4 py-3 text-sm text-rust"
        >
          <Icon name="shield-lock" size={17} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <div className="mt-6">
        <SubmitButton />
      </div>
    </form>
  );
}
