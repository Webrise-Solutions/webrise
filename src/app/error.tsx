"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // In an effect rather than during render: a render-phase log fires twice in
  // development and again on every re-render, which buries the real entry.
  useEffect(() => {
    console.error("[error boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>

        {/*
          The digest is the only thread back to the server log entry for this
          failure — production strips the message and stack from the client on
          purpose. Without it on screen, a report of "it broke" cannot be
          matched to anything, which is exactly the position this page left us
          in the first time it appeared.
        */}
        {error.digest ? (
          <p className="mt-6 text-xs text-muted-foreground">
            Reference{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono">{error.digest}</code>
          </p>
        ) : null}
      </div>
    </div>
  );
}
