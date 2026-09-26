"use server";

import { z } from "zod";
import { ATTRIBUTION_FIELD, parseAttribution } from "@/lib/attribution";
import { SOURCE_PAGE_FIELD } from "@/lib/form-fields";
import { guardSubmission, recordSubmission } from "@/lib/form-guard";
import { notifySubmission } from "@/lib/notify";
import { insertSubmission } from "@/lib/submission-insert";

export type LeadState = { error?: string; sent?: boolean };

/**
 * Public contact form.
 *
 * A Server Action rather than a Supabase Edge Function: it is the same
 * validate-then-insert-then-notify shape, but it runs in the deployment that
 * already holds the service role key, gets Next's same-origin CSRF protection
 * for free, and needs no second runtime to keep in step with the Zod schema
 * and the generated database types.
 *
 * Written with the service role, so nothing the browser sends is trusted:
 * status is set here, service_id is checked against the services table, and
 * the abuse guard runs before any of it.
 */
const leadSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(120),
  email: z.string().trim().email("Please enter an email we can reply to").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .transform((value) => (value === "" ? null : value))
    .nullable(),
  company: z
    .string()
    .trim()
    .max(160)
    .transform((value) => (value === "" ? null : value))
    .nullable(),
  message: z.string().trim().min(10, "A sentence or two about what you need").max(4000),
  service_id: z
    .union([z.string().uuid(), z.literal("")])
    .transform((value) => (value === "" ? null : value))
    .nullable(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm we can reply to you about this" }),
  }),
});

export async function submitContactLead(
  _previous: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const guard = await guardSubmission({ form: "contact", formData });

  if (!guard.ok) {
    // The honeypot path reports success on purpose: a bot told why it failed
    // is a bot that comes back having fixed it.
    return guard.silent ? { sent: true } : { error: guard.message };
  }

  const value = (key: string) => (formData.get(key) ?? "").toString();

  const parsed = leadSchema.safeParse({
    name: value("name"),
    email: value("email"),
    phone: value("phone"),
    company: value("company"),
    message: value("message"),
    service_id: value("service_id"),
    consent: formData.get("consent") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const { consent, ...fields } = parsed.data;

  const attribution = {
    ...parseAttribution(formData.get(ATTRIBUTION_FIELD)),
    source_page: value(SOURCE_PAGE_FIELD) || "/contact",
  };

  // source_page is an original column on leads; only the campaign fields and
  // consent arrive with the pending migration, so only those can be dropped.
  const { source_page, ...campaign } = attribution;

  const { id, error } = await insertSubmission(
    "leads",
    {
      ...fields,
      source_page,
      // Never taken from the client: a submitter must not be able to file
      // themselves as already won.
      status: "new",
    },
    { ...campaign, consent },
  );

  if (error) {
    console.error("[leads] insert failed", error);
    return {
      error: "Something went wrong sending that. Please try again, or email us directly.",
    };
  }

  await recordSubmission("contact", guard.ipHash);

  await notifySubmission({
    kind: "contact enquiry",
    name: fields.name,
    email: fields.email,
    details: [
      ["Email", fields.email],
      ["Phone", fields.phone],
      ["Company", fields.company],
      ["Message", fields.message],
      ["Page", attribution.source_page],
      ["Campaign", attribution.utm_campaign ?? attribution.utm_source],
    ],
    ...(id ? { adminPath: `/admin/leads/${id}` } : {}),
  });

  return { sent: true };
}

/**
 * Call request from /book-a-call.
 *
 * Deliberately not a `bookings` table. Native booking means owning slots,
 * availability, timezones, double-booking and reschedules — a calendar
 * product, not a marketing site. The plan is to embed Cal.com or Calendly
 * (drop the URL in NEXT_PUBLIC_BOOKING_URL and the embed replaces this form).
 *
 * Until that is connected the page would otherwise capture nothing, so a
 * request lands in `leads` like any other enquiry, tagged with source_page
 * "/book-a-call" so call requests stay filterable in the admin.
 */
const callRequestSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(120),
  email: z.string().trim().email("Please enter an email we can reply to").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .transform((value) => (value === "" ? null : value))
    .nullable(),
  company: z
    .string()
    .trim()
    .max(160)
    .transform((value) => (value === "" ? null : value))
    .nullable(),
  preferred_time: z.string().trim().min(1, "Pick a time that usually suits you").max(80),
  notes: z.string().trim().max(2000),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm we can contact you to arrange the call" }),
  }),
});

export async function submitCallRequest(
  _previous: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const guard = await guardSubmission({ form: "call", formData });

  if (!guard.ok) {
    return guard.silent ? { sent: true } : { error: guard.message };
  }

  const value = (key: string) => (formData.get(key) ?? "").toString();

  const parsed = callRequestSchema.safeParse({
    name: value("name"),
    email: value("email"),
    phone: value("phone"),
    company: value("company"),
    preferred_time: value("preferred_time"),
    notes: value("notes"),
    consent: formData.get("consent") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const { consent, preferred_time, notes, ...fields } = parsed.data;

  // Composed here rather than in the browser so the message column reads the
  // same way for every call request, whatever the form sent.
  const message = [`Call request. Best time: ${preferred_time}.`, notes]
    .filter(Boolean)
    .join("\n\n");

  const attribution = {
    ...parseAttribution(formData.get(ATTRIBUTION_FIELD)),
    source_page: value(SOURCE_PAGE_FIELD) || "/book-a-call",
  };

  const { source_page, ...campaign } = attribution;

  const { id, error } = await insertSubmission(
    "leads",
    { ...fields, message, service_id: null, source_page, status: "new" },
    { ...campaign, consent },
  );

  if (error) {
    console.error("[leads] call request insert failed", error);
    return {
      error: "Something went wrong sending that. Please try again, or message us on WhatsApp.",
    };
  }

  await recordSubmission("call", guard.ipHash);

  await notifySubmission({
    kind: "call request",
    name: fields.name,
    email: fields.email,
    details: [
      ["Email", fields.email],
      ["Phone", fields.phone],
      ["Company", fields.company],
      ["Best time", preferred_time],
      ["Notes", notes || null],
      ["Campaign", attribution.utm_campaign ?? attribution.utm_source],
    ],
    ...(id ? { adminPath: `/admin/leads/${id}` } : {}),
  });

  return { sent: true };
}
