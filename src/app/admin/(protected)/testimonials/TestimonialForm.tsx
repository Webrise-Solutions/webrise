"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { Field, FieldSet, FormError, FormSuccess, inputClass } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";
import { StarRating } from "@/components/admin/StarRating";
import { saveTestimonial, deleteTestimonial, type EditorState } from "@/actions/admin/testimonials";
import type { Tables } from "@/integrations/supabase/types";

type Testimonial = Tables<"testimonials">;
type Option = { id: string; name: string };

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" size="sm" disabled={pending}>
      {pending ? "Saving..." : isNew ? "Add testimonial" : "Save changes"}
      {pending ? null : <Icon name="check" size={16} className="shrink-0" />}
    </ActionButton>
  );
}

export function TestimonialForm({
  testimonial,
  services,
  justCreated,
}: {
  testimonial?: Testimonial;
  services: Option[];
  justCreated?: boolean;
}) {
  const [state, formAction] = useActionState<EditorState, FormData>(
    saveTestimonial,
    justCreated ? { saved: true } : {},
  );
  const isNew = !testimonial;

  return (
    <form action={formAction} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      {testimonial ? <input type="hidden" name="id" value={testimonial.id} /> : null}

      <div className="grid gap-5">
        <FieldSet title="The quote">
          <Field
            label="Quote"
            htmlFor="quote"
            hint="Use the client's own words. Do not tidy them into marketing copy."
          >
            <textarea
              id="quote"
              name="quote"
              required
              rows={6}
              maxLength={1200}
              defaultValue={testimonial?.quote ?? ""}
              placeholder="They rebuilt our category pages and enquiries went up within a quarter."
              className={inputClass}
            />
          </Field>

          <StarRating name="rating" label="Rating" defaultValue={testimonial?.rating ?? null} />
        </FieldSet>

        <FieldSet title="Who said it">
          <Field label="Client name" htmlFor="client_name">
            <input
              id="client_name"
              name="client_name"
              required
              maxLength={120}
              defaultValue={testimonial?.client_name ?? ""}
              placeholder="Amara Osei"
              className={inputClass}
            />
          </Field>

          <Field label="Company" htmlFor="client_company">
            <input
              id="client_company"
              name="client_company"
              maxLength={200}
              defaultValue={testimonial?.client_company ?? ""}
              placeholder="Osei Dental Care"
              className={inputClass}
            />
          </Field>

          <ImageField
            name="avatar_url"
            label="Avatar"
            bucket="testimonial-media"
            defaultValue={testimonial?.avatar_url ?? ""}
          />
        </FieldSet>
      </div>

      <div className="grid content-start gap-5">
        <FieldSet title="Placement">
          <Field
            label="Service"
            htmlFor="service_id"
            hint="Shown alongside case studies for this service."
          >
            <select
              id="service_id"
              name="service_id"
              defaultValue={testimonial?.service_id ?? ""}
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

          <label className="flex items-start gap-3 rounded-xl border border-line-soft bg-offwhite px-4 py-3">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={testimonial?.featured ?? false}
              className="mt-0.5 h-4 w-4 accent-[var(--teal)]"
            />
            <span>
              <span className="block text-sm font-medium text-ink">Feature this one</span>
              <span className="mt-0.5 block text-[13px] text-muted-foreground">
                Featured testimonials lead the homepage strip.
              </span>
            </span>
          </label>

          {/* Stated plainly, because there is no draft state to fall back on. */}
          <p className="rounded-xl border border-line bg-sand px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
            Testimonials are public as soon as they are saved. There is no draft state, so only add
            a quote you have permission to publish.
          </p>

          {state.error ? <FormError message={state.error} /> : null}
          {state.saved && !state.error ? (
            <FormSuccess message={justCreated ? "Testimonial added." : "Changes saved."} />
          ) : null}

          <div className="flex flex-wrap gap-2.5">
            <SaveButton isNew={isNew} />
            <Link
              href="/admin/testimonials"
              className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-offwhite"
            >
              Back to list
            </Link>
          </div>
        </FieldSet>

        {testimonial ? (
          <div className="rounded-2xl border border-rust/20 bg-white p-6 shadow-card">
            <h2 className="text-[15px] font-semibold text-ink">Delete</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Removes this testimonial from the site immediately.
            </p>
            <button
              type="submit"
              formAction={deleteTestimonial}
              formNoValidate
              onClick={(event) => {
                if (!confirm(`Delete the testimonial from ${testimonial.client_name}?`)) {
                  event.preventDefault();
                }
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-rust/40 px-4 py-2.5 text-sm font-semibold text-rust transition-colors hover:bg-rust hover:text-white"
            >
              <Icon name="plus" size={16} className="shrink-0 rotate-45" />
              Delete testimonial
            </button>
          </div>
        ) : null}
      </div>
    </form>
  );
}
