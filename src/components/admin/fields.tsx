import type { ReactNode } from "react";
import { Icon } from "@/components/shared/Icon";

export const inputClass =
  "w-full rounded-xl border border-input-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/20";

export const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export const hintClass = "mt-1.5 text-[13px] text-muted-foreground";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint ? <p className={hintClass}>{hint}</p> : null}
    </div>
  );
}

/** Group of fields under a heading, used to break long editor forms up. */
export function FieldSet({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line-soft bg-white p-6 shadow-card">
      <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
      {description ? <p className="mt-1 text-[13px] text-muted-foreground">{description}</p> : null}
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const published = status === "published";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${
        published ? "bg-success-soft text-success" : "bg-sand text-muted-foreground"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${published ? "bg-success" : "bg-muted-foreground"}`}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-rust/25 bg-[color-mix(in_oklch,var(--orange)_10%,white)] px-4 py-3 text-sm text-rust"
    >
      <Icon name="shield-lock" size={17} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}

export function FormSuccess({ message }: { message: string }) {
  return (
    <p
      role="status"
      className="flex items-start gap-2.5 rounded-xl border border-success/25 bg-success-soft px-4 py-3 text-sm text-success"
    >
      <Icon name="check-circle" size={17} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-transparent px-6 py-14 text-center">
      <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-[46ch] text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
