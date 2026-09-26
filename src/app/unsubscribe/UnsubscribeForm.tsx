"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { unsubscribeAction } from "@/actions/newsletter";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="lg" disabled={pending} className="w-full rounded-xl">
      {pending ? "Removing..." : "Yes, unsubscribe me"}
    </ActionButton>
  );
}

/**
 * A button, not an automatic unsubscribe on page load.
 *
 * Mail clients, security scanners and link previewers fetch every URL in an
 * email. If a GET request did the work, half these links would fire before
 * the recipient ever saw them, and people would be unsubscribed from mail they
 * still wanted. The state change only happens on a deliberate POST.
 */
export function UnsubscribeForm({ token }: { token: string }) {
  const [state, formAction] = useActionState<{ done?: boolean; error?: string }, FormData>(
    unsubscribeAction,
    {},
  );

  if (state.done) {
    return (
      <div role="status" className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
          <Icon name="check-circle" size={28} />
        </span>
        <h2 className="mt-5 text-[19px] font-semibold text-ink">You are unsubscribed</h2>
        <p className="mx-auto mt-2 max-w-[44ch] text-[15px] leading-relaxed text-muted-foreground">
          No more newsletters will be sent to this address. Replies to anyone on the team still
          reach us as normal.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-teal hover:text-teal-dark"
        >
          Back to the site
          <Icon name="arrow-right" size={15} className="shrink-0" />
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />

      <h1 className="text-[clamp(1.35rem,1.2rem+0.6vw,1.75rem)] tracking-[-0.015em]">
        Unsubscribe from the newsletter?
      </h1>
      <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
        You will stop receiving the monthly email. Nothing else changes, and you can sign up again
        at any time.
      </p>

      {state.error ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-rust/25 bg-[color-mix(in_oklch,var(--orange)_10%,white)] px-4 py-3 text-sm text-rust"
        >
          <Icon name="shield-lock" size={17} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-3">
        <SubmitButton />
        <Link
          href="/"
          className="text-center text-[14px] font-medium text-muted-foreground hover:text-teal"
        >
          No, keep me subscribed
        </Link>
      </div>
    </form>
  );
}
