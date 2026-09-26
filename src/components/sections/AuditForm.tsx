"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { FormShield } from "@/components/shared/FormShield";
import { auditPoints, businessTypes, contact } from "@/data/site";
import { submitAuditRequest, type AuditState } from "@/actions/audit-requests";

const fieldClass =
  "w-full rounded-[10px] border border-line bg-white px-[15px] py-[13px] text-[15px] text-ink outline-none transition-[border-color,box-shadow] focus:border-teal focus:ring-4 focus:ring-teal/12";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="lg" disabled={pending} className="w-full disabled:opacity-70">
      {pending ? "Sending..." : "Request my free audit"}
      {pending ? null : <Icon name="arrow-right" size={18} />}
    </ActionButton>
  );
}

export function AuditForm() {
  // useActionState with a plain `action` rather than an onSubmit handler: the
  // form then works from the markup alone and the pending state comes from
  // React instead of being tracked by hand.
  const [state, formAction] = useActionState<AuditState, FormData>(submitAuditRequest, {});

  return (
    <section id="audit" className="border-y border-line bg-sand">
      <div className="mx-auto grid max-w-[1200px] items-start gap-[clamp(32px,5vw,64px)] px-6 py-[clamp(56px,6vw,104px)] sm:px-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
            Free SEO audit
          </span>
          <h2 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
            See exactly what's holding your rankings back
          </h2>
          <div className="mt-[18px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
          <p className="mt-[22px] max-w-[44ch]">
            Send us your website and we'll return a plain-English audit, reviewed by a senior
            specialist, not just a tool.
          </p>

          <ul className="mt-7 grid gap-3.5">
            {auditPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] text-ink">
                <Icon name="check-circle" size={20} className="mt-0.5 flex-none text-teal" />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-2.5 text-[15px]">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2.5 text-ink hover:text-teal"
            >
              <Icon name="mail" size={18} className="flex-none text-teal" />
              {contact.email}
            </a>
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-2.5 text-ink hover:text-teal"
            >
              <Icon name="phone" size={18} className="flex-none text-teal" />
              {contact.phone}
            </a>
          </div>
        </div>

        <form
          action={formAction}
          className="relative rounded-2xl border border-line-soft bg-white p-[clamp(24px,3vw,36px)] shadow-panel"
        >
          <FormShield sourcePage="/audit" />
          <div className="grid gap-[18px]">
            <div>
              <label className={labelClass} htmlFor="websiteUrl">
                Website URL
              </label>
              <input
                id="websiteUrl"
                name="websiteUrl"
                type="text"
                required
                placeholder="yourbusiness.co.uk"
                className={fieldClass}
              />
            </div>

            <div className="grid gap-[18px] sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="name">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="email">
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@company.co.uk"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="businessType">
                Business type
              </label>
              <select id="businessType" name="businessType" required className={fieldClass}>
                <option value="">Select one…</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="notes">
                Anything we should know? <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Target locations, main competitors, current challenges…"
                className={`${fieldClass} resize-y`}
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-0.5 h-[18px] w-[18px] flex-none accent-[var(--teal)]"
              />
              I agree to be contacted about my audit. No spam, ever.
            </label>

            <SubmitButton />

            {state.sent ? (
              <p role="status" className="text-sm text-teal-dark">
                Thanks, your audit request is in. We reply within one working day.
              </p>
            ) : null}

            {state.error ? (
              <p role="alert" className="text-sm text-rust">
                {state.error}
              </p>
            ) : null}

            <p className="text-center text-[13px] text-muted-foreground">
              Typical reply time: within one working day.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
