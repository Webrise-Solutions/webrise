"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { signIn, type SignInState } from "@/actions/auth";

const fieldClass =
  "w-full rounded-xl border border-input-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/20";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="lg" disabled={pending} className="mt-1 w-full rounded-xl">
      {pending ? "Signing in..." : "Sign in"}
      {pending ? null : <Icon name="arrow-right" size={18} className="shrink-0" />}
    </ActionButton>
  );
}

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  // The action is handed to <form action> directly rather than awaited inside a
  // transition, so Next applies the redirect it returns on success.
  const [state, formAction] = useActionState<SignInState, FormData>(
    signIn,
    initialError ? { error: initialError } : {},
  );

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <input type="hidden" name="next" value={next ?? ""} />

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="you@webrise.co.uk"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={fieldClass}
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-rust/25 bg-[color-mix(in_oklch,var(--orange)_10%,white)] px-4 py-3 text-sm text-rust"
        >
          <Icon name="shield-lock" size={17} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
