"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { Field, FieldSet, FormError, FormSuccess, inputClass } from "@/components/admin/fields";
import { saveAuthor, deleteAuthor, type EditorState } from "@/actions/admin/authors";
import type { Tables } from "@/integrations/supabase/types";

type Author = Tables<"authors">;

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="sm" disabled={pending}>
      {pending ? "Saving..." : isNew ? "Create author" : "Save changes"}
      {pending ? null : <Icon name="check" size={16} className="shrink-0" />}
    </ActionButton>
  );
}

export function AuthorForm({ author, justCreated }: { author?: Author; justCreated?: boolean }) {
  const [state, formAction] = useActionState<EditorState, FormData>(
    saveAuthor,
    justCreated ? { saved: true } : {},
  );

  return (
    <form action={formAction} className="grid max-w-[640px] gap-5">
      {author ? <input type="hidden" name="id" value={author.id} /> : null}

      <FieldSet title="Author">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            required
            maxLength={120}
            defaultValue={author?.name ?? ""}
            placeholder="Jane Smith"
            className={inputClass}
          />
        </Field>

        <Field label="Bio" htmlFor="bio" hint="Shown under the byline on posts.">
          <textarea
            id="bio"
            name="bio"
            rows={4}
            maxLength={2000}
            defaultValue={author?.bio ?? ""}
            placeholder="Senior SEO specialist. Fifteen years across ecommerce and SaaS."
            className={inputClass}
          />
        </Field>

        <Field label="Avatar URL" htmlFor="avatar_url">
          <input
            id="avatar_url"
            name="avatar_url"
            type="url"
            defaultValue={author?.avatar_url ?? ""}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>

        {state.error ? <FormError message={state.error} /> : null}
        {state.saved && !state.error ? (
          <FormSuccess message={justCreated ? "Author created." : "Changes saved."} />
        ) : null}

        <div className="flex flex-wrap gap-2.5">
          <SaveButton isNew={!author} />
          <Link
            href="/admin/authors"
            className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-offwhite"
          >
            Back to list
          </Link>
        </div>
      </FieldSet>

      {author ? (
        <div className="rounded-2xl border border-rust/20 bg-white p-6 shadow-card">
          <h2 className="text-[15px] font-semibold text-ink">Delete</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Posts by this author are kept, but lose their byline.
          </p>
          <button
            type="submit"
            formAction={deleteAuthor}
            formNoValidate
            onClick={(event) => {
              if (!confirm(`Delete "${author.name}"? This cannot be undone.`)) {
                event.preventDefault();
              }
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-rust/40 px-4 py-2.5 text-sm font-semibold text-rust transition-colors hover:bg-rust hover:text-white"
          >
            <Icon name="plus" size={16} className="shrink-0 rotate-45" />
            Delete author
          </button>
        </div>
      ) : null}
    </form>
  );
}
