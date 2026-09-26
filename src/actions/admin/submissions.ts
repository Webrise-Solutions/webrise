"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth";
import { SUBMISSION_STATUSES } from "@/components/admin/submissions";

export type SubmissionState = { error?: string; saved?: boolean };

const TABLES = { leads: "leads", quotes: "quote_requests" } as const;
export type SubmissionKind = keyof typeof TABLES;

const schema = z.object({
  kind: z.enum(["leads", "quotes"]),
  id: z.string().uuid(),
  status: z.enum(SUBMISSION_STATUSES),
  admin_notes: z
    .string()
    .trim()
    .max(5000)
    .transform((v) => (v === "" ? null : v))
    .nullable(),
});

/** Saves the pipeline status and the private staff note for one submission. */
export async function saveSubmission(
  _prev: SubmissionState,
  formData: FormData,
): Promise<SubmissionState> {
  // Server Actions are public endpoints; the layout guard does not cover them.
  await requireAdmin();

  const parsed = schema.safeParse({
    kind: (formData.get("kind") ?? "").toString(),
    id: (formData.get("id") ?? "").toString(),
    status: (formData.get("status") ?? "").toString(),
    admin_notes: (formData.get("admin_notes") ?? "").toString(),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const { kind, id, status, admin_notes } = parsed.data;
  const table = TABLES[kind];
  const basePath = kind === "leads" ? "/admin/leads" : "/admin/quotes";

  const { error } = await supabaseAdmin.from(table).update({ status, admin_notes }).eq("id", id);

  if (error) {
    console.error(`[admin/${kind}] update failed`, error);
    return { error: "Could not save. Please try again." };
  }

  revalidatePath(basePath);
  revalidatePath(`${basePath}/${id}`);
  return { saved: true };
}
