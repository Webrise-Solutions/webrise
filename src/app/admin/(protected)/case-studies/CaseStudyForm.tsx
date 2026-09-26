"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { Field, FieldSet, FormError, FormSuccess, inputClass } from "@/components/admin/fields";
import { saveCaseStudy, deleteCaseStudy, type EditorState } from "@/actions/admin/case-studies";
import { ImageField } from "@/components/admin/ImageField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TagsInput } from "@/components/admin/TagsInput";
import { slugify } from "@/lib/slug";
import type { Tables } from "@/integrations/supabase/types";
import { ResultsEditor, type ResultRow } from "./ResultsEditor";

type CaseStudy = Tables<"case_studies">;
type Option = { id: string; name: string };

/** The `results` column is free-form jsonb; coerce whatever is there into rows. */
function toResultRows(value: CaseStudy["results"]): ResultRow[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) return [];
    const row = entry as Record<string, unknown>;
    return [
      {
        metric: typeof row["metric"] === "string" ? row["metric"] : "",
        value: typeof row["value"] === "string" ? row["value"] : "",
        label: typeof row["label"] === "string" ? row["label"] : "",
      },
    ];
  });
}

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="sm" disabled={pending}>
      {pending ? "Saving..." : isNew ? "Create case study" : "Save changes"}
      {pending ? null : <Icon name="check" size={16} className="shrink-0" />}
    </ActionButton>
  );
}

export function CaseStudyForm({
  caseStudy,
  services,
  industries,
  justCreated,
  editorFields = true,
}: {
  caseStudy?: CaseStudy;
  services: Option[];
  industries: Option[];
  justCreated?: boolean;
  /** False when the tags / cover_image_alt migration has not been applied. */
  editorFields?: boolean;
}) {
  const [state, formAction] = useActionState<EditorState, FormData>(
    saveCaseStudy,
    justCreated ? { saved: true } : {},
  );
  const [title, setTitle] = useState(caseStudy?.title ?? "");
  const isNew = !caseStudy;
  const slugPlaceholder = slugify(title) || "case-study-slug";

  return (
    <form action={formAction} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      {caseStudy ? <input type="hidden" name="id" value={caseStudy.id} /> : null}

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
              placeholder="Tripling qualified enquiries for a Mildenhall dental group"
              className={inputClass}
            />
          </Field>

          <Field label="Slug" htmlFor="slug" hint={`Leave blank to use "${slugPlaceholder}".`}>
            <input
              id="slug"
              name="slug"
              maxLength={80}
              defaultValue={caseStudy?.slug ?? ""}
              placeholder={slugPlaceholder}
              className={inputClass}
            />
          </Field>

          <Field
            label="Client name"
            htmlFor="client_name"
            hint="Anonymise it if the client has not agreed to be named."
          >
            <input
              id="client_name"
              name="client_name"
              maxLength={160}
              defaultValue={caseStudy?.client_name ?? ""}
              placeholder="UK hospitality client"
              className={inputClass}
            />
          </Field>

          <Field label="Summary" htmlFor="summary" hint="Shown on the work index card.">
            <textarea
              id="summary"
              name="summary"
              rows={3}
              maxLength={500}
              defaultValue={caseStudy?.summary ?? ""}
              className={inputClass}
            />
          </Field>

          <RichTextEditor
            name="body"
            label="Body"
            bucket="case-study-media"
            defaultValue={caseStudy?.body ?? ""}
            rows={16}
          />
        </FieldSet>

        <FieldSet title="Search appearance" description="Falls back to the title and summary.">
          <Field label="SEO title" htmlFor="seo_title">
            <input
              id="seo_title"
              name="seo_title"
              maxLength={200}
              defaultValue={caseStudy?.seo_title ?? ""}
              className={inputClass}
            />
          </Field>

          <Field label="SEO description" htmlFor="seo_description">
            <textarea
              id="seo_description"
              name="seo_description"
              rows={3}
              maxLength={320}
              defaultValue={caseStudy?.seo_description ?? ""}
              className={inputClass}
            />
          </Field>
        </FieldSet>

        <FieldSet
          title="Results"
          description="Headline numbers rendered as stat cards. Only claim what you can evidence."
        >
          <ResultsEditor initial={toResultRows(caseStudy?.results ?? null)} />
        </FieldSet>
      </div>

      <div className="grid content-start gap-5">
        <FieldSet title="Publishing">
          <Field label="Status" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue={caseStudy?.status ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>

          <label className="flex items-start gap-3 rounded-xl border border-line-soft bg-offwhite px-4 py-3">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={caseStudy?.featured ?? false}
              className="mt-0.5 h-4 w-4 accent-[var(--teal)]"
            />
            <span>
              <span className="block text-sm font-medium text-ink">Feature on the homepage</span>
              <span className="mt-0.5 block text-[13px] text-muted-foreground">
                Featured and published case studies appear in the homepage strip.
              </span>
            </span>
          </label>

          {state.error ? <FormError message={state.error} /> : null}
          {state.saved && !state.error ? (
            <FormSuccess message={justCreated ? "Case study created." : "Changes saved."} />
          ) : null}

          <div className="flex flex-wrap gap-2.5">
            <SaveButton isNew={isNew} />
            <Link
              href="/admin/case-studies"
              className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-offwhite"
            >
              Back to list
            </Link>
          </div>
        </FieldSet>

        <FieldSet title="Organisation">
          <Field label="Service" htmlFor="service_id">
            <select
              id="service_id"
              name="service_id"
              defaultValue={caseStudy?.service_id ?? ""}
              className={inputClass}
            >
              <option value="">No service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Industry"
            htmlFor="industry_id"
            {...(industries.length === 0
              ? { hint: "No industries exist in the database yet." }
              : {})}
          >
            <select
              id="industry_id"
              name="industry_id"
              defaultValue={caseStudy?.industry_id ?? ""}
              className={inputClass}
            >
              <option value="">No industry</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
            </select>
          </Field>

          <ImageField
            name="cover_image_url"
            label="Cover image"
            bucket="case-study-media"
            defaultValue={caseStudy?.cover_image_url ?? ""}
            altName="cover_image_alt"
            altDefaultValue={editorFields ? (caseStudy?.cover_image_alt ?? "") : ""}
            altAvailable={editorFields}
          />

          <TagsInput
            name="tags"
            label="Tags"
            defaultValue={editorFields ? (caseStudy?.tags ?? []) : []}
            available={editorFields}
          />
        </FieldSet>

        {caseStudy ? (
          <div className="rounded-2xl border border-rust/20 bg-white p-6 shadow-card">
            <h2 className="text-[15px] font-semibold text-ink">Delete</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Removes this case study permanently. There is no undo.
            </p>
            <button
              type="submit"
              formAction={deleteCaseStudy}
              formNoValidate
              onClick={(event) => {
                if (!confirm(`Delete "${caseStudy.title}"? This cannot be undone.`)) {
                  event.preventDefault();
                }
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-rust/40 px-4 py-2.5 text-sm font-semibold text-rust transition-colors hover:bg-rust hover:text-white"
            >
              <Icon name="plus" size={16} className="shrink-0 rotate-45" />
              Delete case study
            </button>
          </div>
        ) : null}
      </div>
    </form>
  );
}
