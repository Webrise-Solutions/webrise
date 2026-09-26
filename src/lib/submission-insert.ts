import "server-only";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** Tables that public forms write into. */
export type SubmissionTable = "leads" | "quote_requests" | "audit_requests";

/**
 * Insert a form submission.
 *
 * `pending` holds the columns that arrive in
 * supabase/migrations/20260828120000_lead_capture.sql — attribution, consent,
 * and the audit form's notes. A deploy can land before that SQL is applied, so
 * those are separated from the columns that have always existed.
 *
 * PostgREST answers an unknown column with PGRST204. When that happens the row
 * goes in without the pending columns rather than the submission being lost:
 * losing where a lead came from is a reporting gap, losing the lead is a
 * business problem.
 *
 * Once the migration is applied the fallback never fires, and the warning it
 * logs is the signal that it is still outstanding.
 */
export async function insertSubmission(
  table: SubmissionTable,
  row: Record<string, unknown>,
  pending: Record<string, unknown>,
): Promise<{ id: string | null; error: { message: string } | null }> {
  // The generated Insert types are per-table unions; this helper is
  // deliberately table-agnostic, so payloads are checked by the callers' Zod
  // schemas rather than by a row type here.
  const attempt = await supabaseAdmin
    .from(table)
    .insert({ ...row, ...pending } as never)
    .select("id")
    .single();

  if (!attempt.error) return { id: attempt.data?.id ?? null, error: null };

  if (attempt.error.code === "PGRST204") {
    console.warn(
      `[submissions] ${table} is missing columns from 20260828120000_lead_capture.sql. Saving the submission without them.`,
    );

    const retry = await supabaseAdmin
      .from(table)
      .insert(row as never)
      .select("id")
      .single();

    if (retry.error) return { id: null, error: retry.error };
    return { id: retry.data?.id ?? null, error: null };
  }

  return { id: null, error: attempt.error };
}
