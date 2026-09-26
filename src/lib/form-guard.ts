import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { HONEYPOT_FIELD, RENDERED_AT_FIELD } from "@/lib/form-fields";

/**
 * Abuse controls for the public forms.
 *
 * Server Actions are public HTTP endpoints. Anything reachable without a
 * session and backed by an insert needs a throttle, or the first scraper to
 * find it fills the leads table overnight.
 *
 * Three layers, weakest first:
 *   1. Honeypot — a field no person can reach. Filled means a bot.
 *   2. Timing — humans do not complete a form in under a second.
 *   3. Per-IP rate limit — the only one that holds against a determined
 *      script, since the first two are client-side signals it can learn to
 *      defeat.
 */

/** Nothing legitimate fills a form this fast. Client-supplied, so a hint only. */
const MIN_FILL_MS = 1200;

/**
 * A clock skew or a stale tab can make the elapsed time meaningless. Beyond
 * this we simply stop trusting the number rather than blocking the person.
 */
const MAX_FILL_MS = 12 * 60 * 60 * 1000;

export type GuardVerdict =
  /** Carry on and insert. */
  | { ok: true; ipHash: string | null }
  /**
   * Discard, but show the submitter the normal success state. Used only for
   * the honeypot: telling a bot why it failed teaches it how to pass.
   */
  | { ok: false; silent: true }
  /** Show this message. The submitter is real and can act on it. */
  | { ok: false; silent: false; message: string };

/**
 * Pepper for the address hash.
 *
 * Falls back to the service role key so the throttle works with no extra
 * configuration. Set FORM_HASH_SALT explicitly if you ever rotate that key
 * and want existing hashes to keep matching.
 */
function pepper(): string {
  return process.env.FORM_HASH_SALT ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "webrise";
}

/**
 * Pseudonymous client identifier.
 *
 * The raw address is never stored or logged. x-forwarded-for is a chain of
 * proxies; the leftmost entry is the client as seen by the first proxy, which
 * is the best available answer behind Vercel's edge.
 */
export async function clientIpHash(): Promise<string | null> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  const address = forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip")?.trim();

  if (!address) return null;
  return createHash("sha256").update(`${pepper()}:${address}`).digest("hex");
}

/** Honeypot and timing. Pure client signals, no database involved. */
function checkClientSignals(formData: FormData): GuardVerdict | null {
  const honeypot = (formData.get(HONEYPOT_FIELD) ?? "").toString().trim();
  if (honeypot !== "") {
    console.warn("[form-guard] honeypot filled, discarding submission");
    return { ok: false, silent: true };
  }

  const renderedAt = Number((formData.get(RENDERED_AT_FIELD) ?? "").toString());
  // Absent or unparsable means the field never hydrated. Not a bot signal.
  if (!Number.isFinite(renderedAt) || renderedAt <= 0) return null;

  const elapsed = Date.now() - renderedAt;
  if (elapsed >= 0 && elapsed < MIN_FILL_MS) {
    return {
      ok: false,
      silent: false,
      message: "That went through a little too quickly. Please try again.",
    };
  }

  if (elapsed > MAX_FILL_MS) return null;
  return null;
}

/**
 * Rolling-window count for one address and one form.
 *
 * Fails open. A rate limiter that rejects when its own storage is unavailable
 * turns a database hiccup into lost business, which is a worse outcome than
 * the spam it exists to prevent. Failures are logged loudly instead.
 */
async function withinRateLimit(
  form: string,
  ipHash: string,
  max: number,
  windowMinutes: number,
): Promise<boolean> {
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();

  const { count, error } = await supabaseAdmin
    .from("form_submission_log")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("form", form)
    .gte("created_at", since);

  if (error) {
    console.error("[form-guard] rate limit lookup failed, allowing through", error);
    return true;
  }

  return (count ?? 0) < max;
}

/** Records an accepted submission, and now and then clears out old rows. */
export async function recordSubmission(form: string, ipHash: string | null) {
  if (!ipHash) return;

  const { error } = await supabaseAdmin
    .from("form_submission_log")
    .insert({ form, ip_hash: ipHash });
  if (error) {
    console.error("[form-guard] could not record submission", error);
    return;
  }

  // Opportunistic pruning keeps the table from growing without needing pg_cron
  // enabled. Roughly one submission in fifty pays for it.
  if (Math.random() < 0.02) {
    const { error: pruneError } = await supabaseAdmin.rpc("prune_form_submission_log");
    if (pruneError) console.error("[form-guard] prune failed", pruneError);
  }
}

/**
 * Run every check for one submission.
 *
 * `max` submissions per `windowMinutes` from one address. Defaults are
 * deliberately generous: a real enquiry sent twice because the first reply
 * never arrived is normal behaviour, and a legitimate office behind one NAT
 * address should not lock itself out.
 */
export async function guardSubmission({
  form,
  formData,
  max = 5,
  windowMinutes = 60,
}: {
  form: string;
  formData: FormData;
  max?: number;
  windowMinutes?: number;
}): Promise<GuardVerdict> {
  const clientSignal = checkClientSignals(formData);
  if (clientSignal) return clientSignal;

  const ipHash = await clientIpHash();

  // No usable address means no throttle. Everything else still applied.
  if (!ipHash) {
    console.warn("[form-guard] no client address available, skipping rate limit");
    return { ok: true, ipHash: null };
  }

  if (!(await withinRateLimit(form, ipHash, max, windowMinutes))) {
    console.warn(`[form-guard] rate limit hit on ${form}`);
    return {
      ok: false,
      silent: false,
      message:
        "You have sent this a few times already. Please email us directly and we will pick it up from there.",
    };
  }

  return { ok: true, ipHash };
}
