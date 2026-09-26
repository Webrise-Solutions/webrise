"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { FormShield } from "@/components/shared/FormShield";
import { submitContactLead, type LeadState } from "@/actions/leads";

type Service = { id: string; name: string };

const fieldClass =
  "w-full rounded-xl border border-input-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/20";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="lg" disabled={pending} className="w-full rounded-xl">
      {pending ? "Sending..." : "Send message"}
      {pending ? null : <Icon name="arrow-right" size={18} className="shrink-0" />}
    </ActionButton>
  );
}

export function ContactForm({ services }: { services: Service[] }) {
  const [state, formAction] = useActionState<LeadState, FormData>(submitContactLead, {});

  if (state.sent) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-line-soft bg-white p-[clamp(28px,4vw,48px)] text-center shadow-card"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
          <Icon name="check-circle" size={28} />
        </span>
        <h2 className="mt-5 text-[clamp(1.25rem,1.15rem+0.5vw,1.5rem)] tracking-[-0.015em]">
          Message sent
        </h2>
        <p className="mx-auto mt-3 max-w-[42ch] text-[15px] leading-relaxed text-muted-foreground">
          It has gone straight to the team that would do the work. Expect a reply within one working
          day.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="relative rounded-3xl border border-line-soft bg-white p-[clamp(24px,3vw,36px)] shadow-card"
    >
      <FormShield sourcePage="/contact" />

      <h2 className="text-[19px] font-semibold text-ink">Send us a message</h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
        Everything here is optional except your name, email and what you need.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Your name
          </label>
          <input id="contact-name" name="name" required maxLength={120} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder="you@company.co.uk"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="contact-company" className={labelClass}>
            Company <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="contact-company" name="company" maxLength={160} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="contact-phone" name="phone" type="tel" maxLength={40} className={fieldClass} />
        </div>
      </div>

      {services.length > 0 ? (
        <div className="mt-5">
          <label htmlFor="contact-service" className={labelClass}>
            What is this about?{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <select id="contact-service" name="service_id" defaultValue="" className={fieldClass}>
            <option value="">Not sure yet</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="mt-5">
        <label htmlFor="contact-message" className={labelClass}>
          How can we help?
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={4000}
          placeholder="Your site, your market, and what is not working..."
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
        I am happy for Webrise to reply to me about this message.
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
