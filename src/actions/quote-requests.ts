"use server";

import { z } from "zod";
import { ATTRIBUTION_FIELD, parseAttribution } from "@/lib/attribution";
import { SOURCE_PAGE_FIELD } from "@/lib/form-fields";
import { guardSubmission, recordSubmission } from "@/lib/form-guard";
import { notifySubmission } from "@/lib/notify";
import { insertSubmission } from "@/lib/submission-insert";

export type QuoteState = { error?: string; sent?: boolean };

/**
 * Public quote request.
 *
 * Written with the service role rather than the anon key, the same way the
 * contact and audit forms work: nothing about the submission is trusted, the
 * status is set here rather than taken from the form, and no read path is
 * opened up.
 */
const quoteSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(120),
  email: z.string().trim().email("Enter an email we can reply to").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  company: z
    .string()
    .trim()
    .max(160)
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  service_ids: z.string().uuid().array().max(10),
  budget_range: z
    .string()
    .trim()
    .max(80)
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  project_timeline: z
    .string()
    .trim()
    .max(80)
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  notes: z
    .string()
    .trim()
    .max(4000)
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm we can contact you about this request." }),
  }),
});

export async function submitQuoteRequest(
  _prev: QuoteState,
  formData: FormData,
): Promise<QuoteState> {
  const guard = await guardSubmission({ form: "quote", formData });

  if (!guard.ok) {
    // Honeypot hits are shown the success state on purpose.
    return guard.silent ? { sent: true } : { error: guard.message };
  }

  const get = (key: string) => (formData.get(key) ?? "").toString();

  const parsed = quoteSchema.safeParse({
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    company: get("company"),
    // Checkboxes post once per checked box.
    service_ids: formData.getAll("service_ids").map(String).filter(Boolean),
    budget_range: get("budget_range"),
    project_timeline: get("project_timeline"),
    notes: get("notes"),
    consent: formData.get("consent") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const { consent, ...values } = parsed.data;

  const attribution = {
    ...parseAttribution(formData.get(ATTRIBUTION_FIELD)),
    source_page: get(SOURCE_PAGE_FIELD) || "/get-a-quote",
  };

  const { id, error } = await insertSubmission(
    "quote_requests",
    {
      ...values,
      // Never taken from the client: a submitter must not be able to file
      // themselves as already won.
      status: "new",
    },
    { ...attribution, consent },
  );

  if (error) {
    console.error("[quote-requests] insert failed", error);
    return { error: "Something went wrong sending that. Please try again, or email us directly." };
  }

  await recordSubmission("quote", guard.ipHash);

  await notifySubmission({
    kind: "quote request",
    name: values.name,
    email: values.email,
    details: [
      ["Email", values.email],
      ["Phone", values.phone],
      ["Company", values.company],
      ["Budget", values.budget_range],
      ["Timeline", values.project_timeline],
      ["Services", values.service_ids.length ? `${values.service_ids.length} selected` : null],
      ["Notes", values.notes],
      ["Campaign", attribution.utm_campaign ?? attribution.utm_source],
    ],
    ...(id ? { adminPath: `/admin/quotes/${id}` } : {}),
  });

  return { sent: true };
}
