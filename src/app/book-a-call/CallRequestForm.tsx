"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { FormShield } from "@/components/shared/FormShield";
import { submitCallRequest, type LeadState } from "@/actions/leads";

const fieldClass =
  "w-full rounded-xl border border-input-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/20";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

/**
 * Coarse windows rather than a slot picker. Without a connected calendar we
 * cannot know what is actually free, and offering a specific time we might not
 * have is worse than agreeing one by email.
 */
const TIMES = [
  "Weekday mornings (UK)",
  "Weekday afternoons (UK)",
  "Early evening (UK)",
  "Any time, we will work around you",
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="lg" disabled={pending} className="w-full rounded-xl">
      {pending ? "Sending..." : "Request a call"}
      {pending ? null : <Icon name="arrow-right" size={18} className="shrink-0" />}
    </ActionButton>
  );
}

export function CallRequestForm() {
  const [state, formAction] = useActionState<LeadState, FormData>(submitCallRequest, {});

  if (state.sent) {
    return (
      <div role="status" className="rounded-2xl border border-line bg-sand px-5 py-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success-soft text-success">
          <Icon name="check-circle" size={24} />
        </span>
        <h3 className="mt-4 text-[17px] font-semibold text-ink">Request received</h3>
        <p className="mx-auto mt-2 max-w-[42ch] text-[14px] leading-relaxed text-muted-foreground">
          We will come back with two or three slots that fit the time you picked, usually the same
          working day.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative">
      <FormShield sourcePage="/book-a-call" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="call-name" className={labelClass}>
            Your name
          </label>
          <input id="call-name" name="name" required maxLength={120} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="call-email" className={labelClass}>
            Email
          </label>
          <input
            id="call-email"
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder="you@company.co.uk"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="call-phone" className={labelClass}>
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="call-phone" name="phone" type="tel" maxLength={40} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="call-company" className={labelClass}>
            Company <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="call-company" name="company" maxLength={160} className={fieldClass} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="call-time" className={labelClass}>
          When usually suits you?
        </label>
        <select
          id="call-time"
          name="preferred_time"
          required
          defaultValue=""
          className={fieldClass}
        >
          <option value="" disabled>
            Pick a window...
          </option>
          {TIMES.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="call-notes" className={labelClass}>
          What would you like to cover?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="call-notes"
          name="notes"
          rows={3}
          maxLength={2000}
          placeholder="Your site, your market, what is not working..."
          className={fieldClass}
        />
      </div>

      <label className="mt-4 flex items-start gap-3 text-[14px] leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-4 w-4 flex-none accent-[var(--teal)]"
        />
        I am happy for Webrise to contact me to arrange this call.
      </label>

      {state.error ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-rust/25 bg-[color-mix(in_oklch,var(--orange)_10%,white)] px-4 py-3 text-sm text-rust"
        >
          <Icon name="shield-lock" size={17} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <div className="mt-5">
        <SubmitButton />
      </div>
    </form>
  );
}
