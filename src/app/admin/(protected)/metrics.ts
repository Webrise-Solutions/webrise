import "server-only";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Dashboard reads. Every count tolerates a missing table and returns null so a
 * schema that is only partly migrated shows an honest dash rather than a crash
 * — public.audit_requests, for one, does not exist on the live project yet.
 */

type CountableTable = "leads" | "quote_requests" | "newsletter_subscribers" | "audit_requests";

/**
 * PostgREST errors do not always carry a message. A transient network failure
 * or an aborted render surfaces as an error whose `message` is an empty
 * string, and logging that alone produces `count failed for X ""` — which says
 * something broke while withholding every detail that would identify it.
 *
 * Falls back through the other fields, and names the shape when they are all
 * empty so the log at least distinguishes "no detail available" from "".
 */
function describe(error: { message?: string; code?: string; details?: string; hint?: string }) {
  const parts = [error.code, error.message, error.details, error.hint].filter(
    (part) => typeof part === "string" && part.trim() !== "",
  );

  return parts.length > 0 ? parts.join(" | ") : "no detail (likely an aborted or failed request)";
}

export function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

async function countWhere(
  table: CountableTable,
  build: (q: ReturnType<typeof baseQuery>) => ReturnType<typeof baseQuery>,
): Promise<number | null> {
  const { count, error } = await build(baseQuery(table));

  if (error) {
    console.error(`[admin/dashboard] count failed for ${table}:`, describe(error));
    return null;
  }

  // A successful count is always a number. A `head: true` request against a
  // table that does not exist comes back with neither an error nor a count, and
  // defaulting that to 0 would report "none" for something we simply could not
  // read — the one thing these tiles must not do.
  if (typeof count !== "number") {
    console.error(`[admin/dashboard] no count returned for ${table}; treating as unknown`);
    return null;
  }

  return count;
}

function baseQuery(table: CountableTable) {
  return supabaseAdmin.from(table).select("*", { count: "exact", head: true });
}

export async function countSince(table: CountableTable, since: string) {
  return countWhere(table, (q) => q.gte("created_at", since));
}

export async function countAll(table: CountableTable) {
  return countWhere(table, (q) => q);
}

export type Trend = {
  total: number | null;
  thisWeek: number | null;
  lastWeek: number | null;
};

/**
 * Active subscribers plus the two most recent seven-day windows, so the tile can
 * say how this week compares with the one before it rather than showing a bare
 * total that never appears to move.
 */
export async function newsletterTrend(): Promise<Trend> {
  // Written out rather than routed through countWhere: that helper's table
  // union narrows .eq() to the columns every table shares, and `status` is not
  // one of them.
  const activeCount = supabaseAdmin
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .then(({ count, error }) => {
      if (error) {
        console.error("[admin/dashboard] subscriber count failed:", describe(error));
        return null;
      }
      return typeof count === "number" ? count : null;
    });

  const [total, thisWeek, previousFortnight] = await Promise.all([
    activeCount,
    countSince("newsletter_subscribers", daysAgo(7)),
    countSince("newsletter_subscribers", daysAgo(14)),
  ]);

  const lastWeek =
    previousFortnight === null || thisWeek === null ? null : previousFortnight - thisWeek;

  return { total, thisWeek, lastWeek };
}

export async function draftPosts() {
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    supabaseAdmin
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
    supabaseAdmin
      .from("blog_posts")
      .select("id, title, updated_at")
      .eq("status", "draft")
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  if (countError) console.error("[admin/dashboard] draft count failed:", describe(countError));
  if (error) console.error("[admin/dashboard] draft list failed:", describe(error));

  // `unavailable` is what lets the panel say "could not be read" instead of
  // "nothing waiting" — the same unknown-vs-none distinction as the tiles.
  return {
    count: countError || typeof count !== "number" ? null : count,
    posts: data ?? [],
    unavailable: Boolean(countError || error),
  };
}
