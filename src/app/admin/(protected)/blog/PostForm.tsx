"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import {
  Field,
  FieldSet,
  FormError,
  FormSuccess,
  hintClass,
  inputClass,
  labelClass,
} from "@/components/admin/fields";
import { savePost, deletePost, type EditorState } from "@/actions/admin/blog";
import { ImageField } from "@/components/admin/ImageField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TagsInput } from "@/components/admin/TagsInput";
import { slugify } from "@/lib/slug";
import type { Tables } from "@/integrations/supabase/types";

type Post = Tables<"blog_posts">;
type Option = { id: string; name: string };

/** `2026-08-25T14:30:00Z` -> `2026-08-25T14:30`, which is what datetime-local wants. */
function toLocalInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="sm" disabled={pending}>
      {pending ? "Saving..." : isNew ? "Create post" : "Save changes"}
      {pending ? null : <Icon name="check" size={16} className="shrink-0" />}
    </ActionButton>
  );
}

export function PostForm({
  post,
  categories,
  authors,
  justCreated,
  editorFields = true,
}: {
  post?: Post;
  categories: Option[];
  authors: Option[];
  justCreated?: boolean;
  /** False when the tags / cover_image_alt migration has not been applied. */
  editorFields?: boolean;
}) {
  const [state, formAction] = useActionState<EditorState, FormData>(
    savePost,
    justCreated ? { saved: true } : {},
  );
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const isNew = !post;

  // Only mirror the title into the slug until someone types their own, so
  // editing a published post never silently changes its URL.
  const slugPlaceholder = slugify(title) || "post-slug";

  return (
    <form action={formAction} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="grid gap-5">
        <FieldSet title="Content">
          <Field label="Title" htmlFor="title">
            <input
              id="title"
              name="title"
              required
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="How AI assistants pick which sources to cite"
              className={inputClass}
            />
          </Field>

          <Field label="Slug" htmlFor="slug" hint={`Leave blank to use "${slugPlaceholder}".`}>
            <input
              id="slug"
              name="slug"
              maxLength={80}
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder={slugPlaceholder}
              className={inputClass}
            />
          </Field>

          <Field label="Excerpt" htmlFor="excerpt" hint="Shown on the blog index and in previews.">
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              maxLength={500}
              defaultValue={post?.excerpt ?? ""}
              className={inputClass}
            />
          </Field>

          <RichTextEditor
            name="body"
            label="Body"
            bucket="blog-media"
            defaultValue={post?.body ?? ""}
          />
        </FieldSet>

        <FieldSet title="Search appearance" description="Falls back to the title and excerpt.">
          <Field label="SEO title" htmlFor="seo_title">
            <input
              id="seo_title"
              name="seo_title"
              maxLength={200}
              defaultValue={post?.seo_title ?? ""}
              className={inputClass}
            />
          </Field>

          <Field label="SEO description" htmlFor="seo_description">
            <textarea
              id="seo_description"
              name="seo_description"
              rows={3}
              maxLength={320}
              defaultValue={post?.seo_description ?? ""}
              className={inputClass}
            />
          </Field>
        </FieldSet>
      </div>

      <div className="grid content-start gap-5">
        <FieldSet title="Publishing">
          <Field label="Status" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue={post?.status ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>

          <Field
            label="Publish date"
            htmlFor="published_at"
            hint="Leave blank to stamp now on publish. A future date keeps it hidden until then."
          >
            <input
              id="published_at"
              name="published_at"
              type="datetime-local"
              defaultValue={toLocalInput(post?.published_at ?? null)}
              className={inputClass}
            />
          </Field>

          {state.error ? <FormError message={state.error} /> : null}
          {state.saved && !state.error ? (
            <FormSuccess message={justCreated ? "Post created." : "Changes saved."} />
          ) : null}

          <div className="flex flex-wrap gap-2.5">
            <SaveButton isNew={isNew} />
            {post ? (
              <Link
                href={`/admin/blog/${post.id}/preview`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] border border-teal px-4 py-3 text-sm font-semibold text-teal hover:bg-teal-soft"
              >
                <Icon name="monitor" size={16} className="shrink-0" />
                Preview
              </Link>
            ) : null}
            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-offwhite"
            >
              Back to list
            </Link>
          </div>
          {post ? (
            <p className={hintClass}>
              Preview opens in a new tab and shows unsaved changes only after you save.
            </p>
          ) : null}
        </FieldSet>

        <FieldSet title="Organisation">
          <Field label="Category" htmlFor="category_id">
            <select
              id="category_id"
              name="category_id"
              defaultValue={post?.category_id ?? ""}
              className={inputClass}
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Author"
            htmlFor="author_id"
            {...(authors.length === 0 ? { hint: "No authors exist yet." } : {})}
          >
            <select
              id="author_id"
              name="author_id"
              defaultValue={post?.author_id ?? ""}
              className={inputClass}
            >
              <option value="">No author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </Field>

          <ImageField
            name="cover_image_url"
            label="Cover image"
            bucket="blog-media"
            defaultValue={post?.cover_image_url ?? ""}
            altName="cover_image_alt"
            altDefaultValue={editorFields ? (post?.cover_image_alt ?? "") : ""}
            altAvailable={editorFields}
          />

          <TagsInput
            name="tags"
            label="Tags"
            defaultValue={editorFields ? (post?.tags ?? []) : []}
            available={editorFields}
          />
        </FieldSet>

        {post ? (
          <div className="rounded-2xl border border-rust/20 bg-white p-6 shadow-card">
            <h2 className="text-[15px] font-semibold text-ink">Delete</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Removes this post permanently. There is no undo.
            </p>
            <DeletePostButton id={post.id} title={post.title} />
          </div>
        ) : null}
      </div>

      <p className={`${labelClass} sr-only`}>End of form</p>
    </form>
  );
}

/**
 * Kept outside the main <form> element's submit path by using formAction, so
 * deleting never posts the editor's own values.
 */
function DeletePostButton({ id, title }: { id: string; title: string }) {
  return (
    <button
      type="submit"
      formAction={deletePost}
      formNoValidate
      onClick={(event) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) event.preventDefault();
      }}
      className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-rust/40 px-4 py-2.5 text-sm font-semibold text-rust transition-colors hover:bg-rust hover:text-white"
    >
      <Icon name="plus" size={16} className="shrink-0 rotate-45" />
      Delete post
    </button>
  );
}
