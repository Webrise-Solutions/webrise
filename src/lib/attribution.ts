/**
 * Lead source attribution.
 *
 * Captured in the browser on the first page of a visit and carried in a
 * hidden field on every public form, because the campaign that produced a
 * lead is almost never visible at the moment the lead is submitted: someone
 * clicks an ad onto a blog post, reads, then converts on /contact two
 * navigations later. By then the URL has no UTM parameters and
 * document.referrer points at our own site.
 *
 * Shared by client and server, so no "use server" and no server-only imports.
 */

/** Hidden field name carrying the packed attribution payload. */
export const ATTRIBUTION_FIELD = "attribution";

/** sessionStorage key. Per-tab and per-visit, which is the right lifetime. */
export const ATTRIBUTION_STORAGE_KEY = "webrise:attribution";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

export type Attribution = Partial<Record<UtmKey, string>> & {
  landing_page?: string;
  referrer?: string;
};

/** Columns written to leads / quote_requests / audit_requests. */
export type AttributionColumns = Attribution & { source_page?: string };

/**
 * Anything the browser sends is attacker-controlled, so every value is
 * length-capped and non-strings are dropped. These end up in an admin table,
 * not in HTML, but an unbounded string is still an unbounded string.
 */
const MAX_VALUE_LENGTH = 300;

function clean(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, MAX_VALUE_LENGTH);
  return trimmed === "" ? undefined : trimmed;
}

/** Parse the hidden field. Never throws: bad attribution must not cost a lead. */
export function parseAttribution(raw: unknown): Attribution {
  if (typeof raw !== "string" || raw === "") return {};

  let decoded: unknown;
  try {
    decoded = JSON.parse(raw);
  } catch {
    return {};
  }

  if (typeof decoded !== "object" || decoded === null || Array.isArray(decoded)) return {};
  const source = decoded as Record<string, unknown>;
  const result: Attribution = {};

  for (const key of UTM_KEYS) {
    const value = clean(source[key]);
    if (value) result[key] = value;
  }

  const landing = clean(source["landing_page"]);
  if (landing) result.landing_page = landing;

  const referrer = clean(source["referrer"]);
  if (referrer) result.referrer = referrer;

  return result;
}

/**
 * Read the current page's attribution. Returns nothing outside the browser.
 *
 * Only external referrers are kept — recording that /contact was reached from
 * /blog tells us nothing we do not already have from landing_page, and it
 * would bury the genuinely external referrers in our own noise.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const result: Attribution = { landing_page: window.location.pathname };

  for (const key of UTM_KEYS) {
    const value = clean(params.get(key));
    if (value) result[key] = value;
  }

  const referrer = document.referrer;
  if (referrer) {
    try {
      const url = new URL(referrer);
      if (url.hostname !== window.location.hostname) result.referrer = url.origin + url.pathname;
    } catch {
      // A referrer we cannot parse is not worth recording.
    }
  }

  return result;
}
