"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { Field, FieldSet, FormError, FormSuccess, inputClass } from "@/components/admin/fields";
import { ListEditor, StepsEditor, type Step } from "@/components/admin/ListEditor";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { saveService, deleteService, type EditorState } from "@/actions/admin/services";
import { CLUSTERS, CLUSTER_LABELS } from "@/lib/service-clusters";
import { slugify } from "@/lib/slug";
import type { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services">;

/** `deliverables` is free-form jsonb; accept only the strings in it. */
function toStrings(value: Service["deliverables"]): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

/** `process_steps` is free-form jsonb; coerce whatever is there into steps. */
function toSteps(value: Service["process_steps"]): Step[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) return [];
    const row = entry as Record<string, unknown>;
    const title = typeof row["title"] === "string" ? row["title"] : "";
    if (!title) return [];
    return [
      { title, description: typeof row["description"] === "string" ? row["description"] : "" },
    ];
  });
}

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="sm" disabled={pending}>
      {pending ? "Saving..." : isNew ? "Create service" : "Save changes"}
      {pending ? null : <Icon name="check" size={16} className="shrink-0" />}
    </ActionButton>
  );
}

export function ServiceForm({
  service,
  justCreated,
}: {
  service?: Service;
  justCreated?: boolean;
}) {
  const [state, formAction] = useActionState<EditorState, FormData>(
    saveService,
    justCreated ? { saved: true } : {},
  );
  const [name, setName] = useState(service?.name ?? "");
  const isNew = !service;
  const slugPlaceholder = slugify(name) || "service-slug";

  return (
    <form action={formAction} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      {service ? <input type="hidden" name="id" value={service.id} /> : null}

      <div className="grid gap-5">
        <FieldSet title="Service">
          <Field label="Name" htmlFor="name">
            <input
              id="name"
              name="name"
              required
              maxLength={120}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Local SEO"
              className={inputClass}
            />
          </Field>

          <Field
            label="Slug"
            htmlFor="slug"
            hint={
              service
                ? `Live at /services/${service.slug}. Changing this breaks existing links.`
                : `Leave blank to use "${slugPlaceholder}".`
            }
          >
            <input
              id="slug"
              name="slug"
              maxLength={80}
              defaultValue={service?.slug ?? ""}
              placeholder={slugPlaceholder}
              className={inputClass}
            />
          </Field>

          <Field
            label="Short description"
            htmlFor="short_description"
            hint="One or two lines, used on cards and the services hub."
          >
            <textarea
              id="short_description"
              name="short_description"
              rows={3}
              maxLength={500}
              defaultValue={service?.short_description ?? ""}
              className={inputClass}
            />
          </Field>

          <RichTextEditor
            name="hero_copy"
            label="Hero copy"
            bucket="brand-assets"
            defaultValue={service?.hero_copy ?? ""}
            rows={10}
          />
        </FieldSet>

        <FieldSet title="Deliverables" description="What the client actually receives.">
          <ListEditor
            name="deliverables"
            label="Deliverables"
            placeholder="Monthly rank tracking report"
            initial={toStrings(service?.deliverables ?? null)}
          />
        </FieldSet>

        <FieldSet title="Process" description="The steps shown on the service page, in order.">
          <StepsEditor
            name="process_steps"
            label="Steps"
            initial={toSteps(service?.process_steps ?? null)}
          />
        </FieldSet>

        <FieldSet
          title="Search appearance"
          description="Falls back to the name and short description."
        >
          <Field label="SEO title" htmlFor="seo_title">
            <input
              id="seo_title"
              name="seo_title"
              maxLength={200}
              defaultValue={service?.seo_title ?? ""}
              className={inputClass}
            />
          </Field>

          <Field label="SEO description" htmlFor="seo_description">
            <textarea
              id="seo_description"
              name="seo_description"
              rows={3}
              maxLength={320}
              defaultValue={service?.seo_description ?? ""}
              className={inputClass}
            />
          </Field>
        </FieldSet>
      </div>

      <div className="grid content-start gap-5">
        <FieldSet title="Placement">
          <Field label="Cluster" htmlFor="cluster" hint="Groups the service on the hub page.">
            <select
              id="cluster"
              name="cluster"
              defaultValue={service?.cluster ?? "seo"}
              className={inputClass}
            >
              {CLUSTERS.map((cluster) => (
                <option key={cluster} value={cluster}>
                  {CLUSTER_LABELS[cluster]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sort order" htmlFor="sort_order" hint="Lower numbers appear first.">
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              min={0}
              max={999}
              defaultValue={service?.sort_order ?? 0}
              className={inputClass}
            />
          </Field>

          {state.error ? <FormError message={state.error} /> : null}
          {state.saved && !state.error ? (
            <FormSuccess message={justCreated ? "Service created." : "Changes saved."} />
          ) : null}

          <div className="flex flex-wrap gap-2.5">
            <SaveButton isNew={isNew} />
            <Link
              href="/admin/services"
              className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-offwhite"
            >
              Back to list
            </Link>
          </div>
        </FieldSet>

        {service ? (
          <div className="rounded-2xl border border-rust/20 bg-white p-6 shadow-card">
            <h2 className="text-[15px] font-semibold text-ink">Delete</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Case studies and leads linked to this service are kept, but lose the link. The public
              page at /services/{service.slug} stops working.
            </p>
            <button
              type="submit"
              formAction={deleteService}
              formNoValidate
              onClick={(event) => {
                if (!confirm(`Delete "${service.name}"? This cannot be undone.`)) {
                  event.preventDefault();
                }
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-rust/40 px-4 py-2.5 text-sm font-semibold text-rust transition-colors hover:bg-rust hover:text-white"
            >
              <Icon name="plus" size={16} className="shrink-0 rotate-45" />
              Delete service
            </button>
          </div>
        ) : null}
      </div>
    </form>
  );
}
