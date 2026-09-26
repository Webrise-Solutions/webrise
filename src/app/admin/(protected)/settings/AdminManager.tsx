"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { Field, FieldSet, FormError, FormSuccess, inputClass } from "@/components/admin/fields";
import { addAdmin, removeAdmin, type AdminState } from "@/actions/admin/admins";

export type AdminRow = {
  id: string;
  email: string;
  fullName: string | null;
  addedAt: string;
  lastSignInAt: string | null;
  isSelf: boolean;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="sm" disabled={pending}>
      {pending ? pendingLabel : label}
      {pending ? null : <Icon name="check" size={16} className="shrink-0" />}
    </ActionButton>
  );
}

function RemoveButton({ row }: { row: AdminRow }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name="id"
      value={row.id}
      disabled={pending || row.isSelf}
      title={row.isSelf ? "You cannot remove your own access" : "Remove admin access"}
      onClick={(event) => {
        if (!confirm(`Remove admin access for ${row.email}?`)) event.preventDefault();
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[13px] font-semibold text-muted-foreground transition-colors hover:border-rust hover:text-rust disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon name="plus" size={14} className="rotate-45" />
      {pending ? "Removing..." : "Remove"}
    </button>
  );
}

export function AdminManager({ admins }: { admins: AdminRow[] }) {
  const [addState, addAction] = useActionState<AdminState, FormData>(addAdmin, {});
  const [removeState, removeAction] = useActionState<AdminState, FormData>(removeAdmin, {});

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <section className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
        <div className="border-b border-line-soft bg-offwhite px-5 py-4">
          <h2 className="text-[15px] font-semibold text-ink">
            Administrators
            <span className="ml-2 rounded-full bg-sand px-2 py-0.5 text-[12px] font-semibold tabular-nums text-muted-foreground">
              {admins.length}
            </span>
          </h2>
        </div>

        {removeState.error ? (
          <div className="px-5 pt-4">
            <FormError message={removeState.error} />
          </div>
        ) : null}
        {removeState.message ? (
          <div className="px-5 pt-4">
            <FormSuccess message={removeState.message} />
          </div>
        ) : null}

        <form action={removeAction}>
          <ul>
            {admins.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center gap-3 border-b border-line-soft px-5 py-4 last:border-b-0"
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-teal-soft text-teal">
                  <Icon name="shield-lock" size={18} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-ink">
                    {row.email}
                    {row.isSelf ? (
                      <span className="rounded-full bg-teal-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-teal">
                        You
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    Added {dateFormat.format(new Date(row.addedAt))}
                    {row.lastSignInAt
                      ? ` · last signed in ${dateFormat.format(new Date(row.lastSignInAt))}`
                      : " · never signed in"}
                  </p>
                </div>

                <RemoveButton row={row} />
              </li>
            ))}
          </ul>
        </form>
      </section>

      <FieldSet
        title="Grant admin access"
        description="The Supabase Auth account must already exist."
      >
        <form action={addAction} className="grid gap-4">
          <Field
            label="Email"
            htmlFor="email"
            hint="Create the account in Supabase → Authentication → Users first."
          >
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={200}
              placeholder="name@webrise.co.uk"
              className={inputClass}
            />
          </Field>

          {addState.error ? <FormError message={addState.error} /> : null}
          {addState.message ? <FormSuccess message={addState.message} /> : null}

          <div>
            <SubmitButton label="Grant access" pendingLabel="Granting..." />
          </div>
        </form>

        <p className="rounded-xl border border-line bg-sand px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
          There is no signup path by design. Creating an account and granting it admin rights stay
          two separate, deliberate steps.
        </p>
      </FieldSet>
    </div>
  );
}
