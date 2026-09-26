"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { Field, FieldSet, FormError, FormSuccess, inputClass } from "@/components/admin/fields";
import { SUBMISSION_STATUSES } from "@/components/admin/submissions";
import {
  saveSubmission,
  type SubmissionKind,
  type SubmissionState,
} from "@/actions/admin/submissions";

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="sm" disabled={pending}>
      {pending ? "Saving..." : "Save"}
      {pending ? null : <Icon name="check" size={16} className="shrink-0" />}
    </ActionButton>
  );
}

/**
 * Status + private note for one lead or quote.
 *
 * `notesAvailable` is false when the database predates the admin_notes column;
 * the field is then disabled with an explanation rather than accepting text
 * that could not be stored.
 */
export function SubmissionEditor({
  kind,
  id,
  status,
  adminNotes,
  notesAvailable,
}: {
  kind: SubmissionKind;
  id: string;
  status: string;
  adminNotes: string | null;
  notesAvailable: boolean;
}) {
  const [state, formAction] = useActionState<SubmissionState, FormData>(saveSubmission, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />

      <FieldSet title="Pipeline">
        <Field label="Status" htmlFor="status">
          <select id="status" name="status" defaultValue={status} className={inputClass}>
            {SUBMISSION_STATUSES.map((option) => (
              <option key={option} value={option} className="capitalize">
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Internal notes"
          htmlFor="admin_notes"
          hint={
            notesAvailable
              ? "Private to the team. Never shown on the public site."
              : "Unavailable: this database has no admin_notes column yet. Run migration 20260825170000_admin_notes.sql."
          }
        >
          <textarea
            id="admin_notes"
            name="admin_notes"
            rows={6}
            maxLength={5000}
            defaultValue={adminNotes ?? ""}
            disabled={!notesAvailable}
            placeholder="Called 26 Aug, asked for pricing on local SEO. Follow up Monday."
            className={`${inputClass} disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted-foreground`}
          />
        </Field>

        {state.error ? <FormError message={state.error} /> : null}
        {state.saved && !state.error ? <FormSuccess message="Saved." /> : null}

        <div>
          <SaveButton />
        </div>
      </FieldSet>
    </form>
  );
}
