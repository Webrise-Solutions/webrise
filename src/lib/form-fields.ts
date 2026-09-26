/**
 * Hidden field names shared by the public forms.
 *
 * Their own module, not FormShield's, deliberately. Every export of a
 * "use client" module becomes a client reference when a Server Component
 * imports it, so a constant declared there reaches the server as a proxy
 * rather than as a string — the same trap that a "use server" module sets in
 * the opposite direction. A plain module is safe from both sides.
 */

/** Unreachable input. Filled means the submission was not typed by a person. */
export const HONEYPOT_FIELD = "company_url";

/** Millisecond timestamp written when the form hydrated. */
export const RENDERED_AT_FIELD = "rendered_at";

/** Path the form itself lives on. */
export const SOURCE_PAGE_FIELD = "source_page";
