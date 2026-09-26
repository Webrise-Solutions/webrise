"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Icon } from "@/components/shared/Icon";
import { FormShield } from "@/components/shared/FormShield";
import { subscribeToNewsletter, type NewsletterState } from "@/actions/newsletter";

/**
 * Two skins, one form. `dark` sits on the night-coloured footer, `light` in a
 * card on the blog. Keeping them in one component is what stops the two
 * copies drifting apart the next time the action changes.
 */
type Tone = "dark" | "light";

function SubmitButton({ tone }: { tone: Tone }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex flex-none items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-colors disabled:opacity-70 ${
        tone === "dark"
          ? "bg-orange text-white hover:bg-rust-dark"
          : "bg-teal text-white hover:bg-teal-dark"
      }`}
    >
      {pending ? "Joining..." : "Subscribe"}
      {pending ? null : <Icon name="arrow-right" size={16} className="shrink-0" />}
    </button>
  );
}

export function NewsletterForm({
  tone = "light",
  sourcePage,
}: {
  tone?: Tone;
  sourcePage: string;
}) {
  const [state, formAction] = useActionState<NewsletterState, FormData>(subscribeToNewsletter, {});

  const muted = tone === "dark" ? "text-mint" : "text-muted-foreground";

  if (state.sent) {
    return (
      <p
        role="status"
        className={`flex items-start gap-2.5 text-[14px] leading-relaxed ${
          tone === "dark" ? "text-cream" : "text-ink"
        }`}
      >
        <Icon
          name="check-circle"
          size={18}
          className={`mt-0.5 shrink-0 ${tone === "dark" ? "text-orange" : "text-success"}`}
        />
        You are on the list. We send one email a month, and every one has an unsubscribe link.
      </p>
    );
  }

  return (
    <form action={formAction} className="relative">
      <FormShield sourcePage={sourcePage} />

      <div className="flex flex-wrap gap-2 sm:flex-nowrap">
        <label htmlFor={`newsletter-email-${tone}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${tone}`}
          name="email"
          type="email"
          required
          maxLength={200}
          placeholder="you@company.co.uk"
          className={`min-w-0 flex-1 rounded-xl border px-4 py-2.5 text-[14px] outline-none transition-colors ${
            tone === "dark"
              ? "border-white/15 bg-white/5 text-cream placeholder:text-mint/70 focus:border-orange"
              : "border-input-line bg-white text-ink placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/20"
          }`}
        />
        <SubmitButton tone={tone} />
      </div>

      {state.error ? (
        <p
          role="alert"
          className={`mt-2.5 text-[13px] ${tone === "dark" ? "text-orange" : "text-rust"}`}
        >
          {state.error}
        </p>
      ) : (
        <p className={`mt-2.5 text-[12.5px] leading-relaxed ${muted}`}>
          One email a month. No selling, unsubscribe in a click.
        </p>
      )}
    </form>
  );
}
