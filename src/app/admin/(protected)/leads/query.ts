import "server-only";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SUBMISSION_STATUSES } from "@/components/admin/submissions";

export type SubmissionSearch = { status: string; sort: string; q: string };

/** Normalises the query string once so pages and the filter bar agree. */
export function readSearch(params: {
  status?: string;
  sort?: string;
  q?: string;
}): SubmissionSearch {
  const status =
    params.status && (SUBMISSION_STATUSES as readonly string[]).includes(params.status)
      ? params.status
      : "all";

  return {
    status,
    sort: params.sort === "oldest" ? "oldest" : "newest",
    q: (params.q ?? "").trim().slice(0, 120),
  };
}

/**
 * Counts per status for the filter tabs. Runs as one grouped read rather than
 * five `head: true` count queries.
 */
export async function statusCounts(
  table: "leads" | "quote_requests",
): Promise<Record<string, number> | null> {
  const { data, error } = await supabaseAdmin.from(table).select("status");

  // null, not zeroes: a failed read is unknown, and rendering 0 next to every
  // filter would state as fact that there is nothing there.
  if (error) {
    console.error(`[admin/${table}] status counts failed`, error.message);
    return null;
  }

  const counts: Record<string, number> = { all: data.length };
  for (const status of SUBMISSION_STATUSES) counts[status] = 0;
  for (const row of data) counts[row.status] = (counts[row.status] ?? 0) + 1;

  return counts;
}

/**
 * Escapes a search term for PostgREST's `or` filter: commas separate the
 * conditions and parentheses close the group, so an unescaped term could
 * change the query's shape. `%` and `_` are ilike wildcards.
 */
export function escapeSearch(term: string): string {
  return term.replace(/[,()%_\\]/g, (match) => `\\${match}`);
}
