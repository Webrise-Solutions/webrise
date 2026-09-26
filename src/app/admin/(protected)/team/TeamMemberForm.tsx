"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { deleteTeamMember, saveTeamMember, type TeamEditorState } from "@/actions/admin/team";
import { Field, FieldSet, FormError, FormSuccess, inputClass } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";
import { Icon } from "@/components/shared/Icon";
import { ActionButton } from "@/components/ui/action";
import type { Tables } from "@/integrations/supabase/types";

type TeamMember = Tables<"team_members">;

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <ActionButton type="submit" size="sm" disabled={pending}>
      {pending ? "Saving..." : isNew ? "Create team member" : "Save changes"}
      {pending ? null : <Icon name="check" size={16} className="shrink-0" />}
    </ActionButton>
  );
}

export function TeamMemberForm({
  member,
  justCreated,
}: {
  member?: TeamMember;
  justCreated?: boolean;
}) {
  const [state, formAction] = useActionState<TeamEditorState, FormData>(
    saveTeamMember,
    justCreated ? { saved: true } : {},
  );

  return (
    <form action={formAction} className="grid max-w-[680px] gap-5">
      {member ? <input type="hidden" name="id" value={member.id} /> : null}
      <FieldSet
        title="Team member"
        description="Controls the card displayed in the About page team grid."
      >
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            required
            maxLength={120}
            defaultValue={member?.name ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Role" htmlFor="role">
          <input
            id="role"
            name="role"
            required
            maxLength={160}
            defaultValue={member?.role ?? ""}
            placeholder="SEO Specialist"
            className={inputClass}
          />
        </Field>
        <ImageField
          name="image_url"
          label="Portrait"
          bucket="team-media"
          defaultValue={member?.image_url ?? null}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Card tone" htmlFor="tone">
            <select
              id="tone"
              name="tone"
              defaultValue={member?.tone ?? "night"}
              className={inputClass}
            >
              <option value="night">Night</option>
              <option value="teal">Teal</option>
              <option value="rust">Rust</option>
            </select>
          </Field>
          <Field label="Display order" htmlFor="sort_order" hint="Lower numbers appear first.">
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              min={0}
              max={9999}
              defaultValue={member?.sort_order ?? 0}
              className={inputClass}
            />
          </Field>
        </div>
        <label className="flex items-center gap-3 rounded-xl border border-line-soft bg-offwhite px-4 py-3 text-sm font-medium text-ink">
          <input
            name="published"
            type="checkbox"
            defaultChecked={member?.published ?? true}
            className="h-4 w-4 accent-teal"
          />
          Show this person on the About page
        </label>
        {state.error ? <FormError message={state.error} /> : null}
        {state.saved && !state.error ? (
          <FormSuccess message={justCreated ? "Team member created." : "Changes saved."} />
        ) : null}
        <div className="flex flex-wrap gap-2.5">
          <SaveButton isNew={!member} />
          <Link
            href="/admin/team"
            className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-offwhite"
          >
            Back to list
          </Link>
        </div>
      </FieldSet>
      {member ? (
        <div className="rounded-2xl border border-rust/20 bg-white p-6 shadow-card">
          <h2 className="text-[15px] font-semibold text-ink">Delete</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Permanently removes this person from the team module.
          </p>
          <button
            type="submit"
            formAction={deleteTeamMember}
            formNoValidate
            onClick={(event) => {
              if (!confirm(`Delete "${member.name}"? This cannot be undone.`))
                event.preventDefault();
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-rust/40 px-4 py-2.5 text-sm font-semibold text-rust hover:bg-rust hover:text-white"
          >
            <Icon name="plus" size={16} className="rotate-45" /> Delete team member
          </button>
        </div>
      ) : null}
    </form>
  );
}
