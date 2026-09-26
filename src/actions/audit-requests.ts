"use server";

import { z } from "zod";
import { ATTRIBUTION_FIELD, parseAttribution } from "@/lib/attribution";
import { SOURCE_PAGE_FIELD } from "@/lib/form-fields";
import { guardSubmission, recordSubmission } from "@/lib/form-guard";
import { notifySubmission } from "@/lib/notify";
import { insertSubmission } from "@/lib/submission-insert";

export type AuditState = { error?: string; sent?: boolean };

const auditRequestSchema = z.object({
  websiteUrl: z
    .string()
    .trim()
    .min(3, "Please enter your website address")
    .max(300)
    .transform((value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`))
    .refine((value) => {
      try {
        return Boolean(new URL(value).hostname.includes("."));
      } catch {
        return false;
      }
    }, "Please enter a valid website address"),
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  businessType: z.string().trim().min(1, "Please pick a business type").max(80),
  notes: z
    .string()
    .trim()
    .max(4000)
    .transform((value) => (value === "" ? null : value))
    .nullable(),
  consent: z.literal(true, { message: "Please agree to be contacted about your audit" }),
});

export async function submitAuditRequest(
  _previous: AuditState,
  formData: FormData,
): Promise<AuditState> {
  const guard = await guardSubmission({ form: "audit", formData });

  if (!guard.ok) {
    // Honeypot hits are shown the success state on purpose.
    return guard.silent ? { sent: true } : { error: guard.message };
  }

  const value = (key: string) => (formData.get(key) ?? "").toString();

  const parsed = auditRequestSchema.safeParse({
    websiteUrl: value("websiteUrl"),
    name: value("name"),
    email: value("email"),
    businessType: value("businessType"),
    notes: value("notes"),
    consent: formData.get("consent") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const attribution = {
    ...parseAttribution(formData.get(ATTRIBUTION_FIELD)),
    source_page: value(SOURCE_PAGE_FIELD) || "/audit",
  };

  const { error } = await insertSubmission(
    "audit_requests",
    {
      website_url: parsed.data.websiteUrl,
      name: parsed.data.name,
      email: parsed.data.email,
      business_type: parsed.data.businessType,
      consent: parsed.data.consent,
    },
    { ...attribution, notes: parsed.data.notes },
  );

  if (error) {
    console.error("[audit-requests] insert failed", error);
    return { error: "We could not save your request. Please try again, or email us directly." };
  }

  await recordSubmission("audit", guard.ipHash);

  await notifySubmission({
    kind: "audit request",
    name: parsed.data.name,
    email: parsed.data.email,
    details: [
      ["Website", parsed.data.websiteUrl],
      ["Email", parsed.data.email],
      ["Business type", parsed.data.businessType],
      ["Notes", parsed.data.notes],
      ["Campaign", attribution.utm_campaign ?? attribution.utm_source],
    ],
  });

  return { sent: true };
}
