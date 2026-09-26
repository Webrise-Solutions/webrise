/**
 * Environment check: `bun run check:env`
 *
 * Answers two questions without starting the app — which required variables
 * are missing, and which optional features are currently switched on. Reads
 * .env directly rather than relying on the shell, so it reports what the app
 * will actually see.
 *
 * Values are never printed. Secrets belong in the file, not in a terminal
 * scrollback or a CI log.
 */
import fs from "node:fs";
import path from "node:path";

const REQUIRED = [
  ["NEXT_PUBLIC_SITE_URL", "canonical URLs, sitemap.xml and JSON-LD"],
  ["NEXT_PUBLIC_SUPABASE_URL", "browser Supabase client"],
  ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "browser Supabase client (respects RLS)"],
  ["SUPABASE_URL", "server Supabase client"],
  ["SUPABASE_SERVICE_ROLE_KEY", "every Server Action write (bypasses RLS)"],
];

/** [name, feature, what happens without it] */
const OPTIONAL = [
  ["SMTP_HOST", "Lead notification email", "submissions still save, they are just not emailed"],
  ["SMTP_PORT", "SMTP port", "defaults to 587 (STARTTLS)"],
  ["SMTP_USER", "SMTP account", "required to send"],
  [
    "SMTP_PASSWORD",
    "SMTP password",
    "required to send; use an app password, not the account password",
  ],
  ["LEAD_NOTIFICATION_FROM", "Notification sender", "falls back to SMTP_USER"],
  ["LEAD_NOTIFICATION_TO", "Notification recipient", "falls back to SMTP_USER"],
  ["FORM_HASH_SALT", "Rate-limit address pepper", "falls back to SUPABASE_SERVICE_ROLE_KEY"],
  [
    "NEXT_PUBLIC_BOOKING_URL",
    "Calendar embed on /book-a-call",
    "the page shows the call request form instead",
  ],
];

/** All three are needed before a single email goes out. */
const SMTP_REQUIRED = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"];

function readEnvFile(file) {
  if (!fs.existsSync(file)) return {};
  const out = {};

  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const value = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (value) out[trimmed.slice(0, eq).trim()] = value;
  }

  return out;
}

const root = path.resolve(import.meta.dirname, "..");
// Anything already exported in the shell wins, the same way Next resolves it.
const env = { ...readEnvFile(path.join(root, ".env")), ...process.env };
const set = (name) => Boolean(env[name] && env[name].trim());

console.log("Required\n");
const missing = [];
for (const [name, why] of REQUIRED) {
  const present = set(name);
  if (!present) missing.push(name);
  console.log(`  ${present ? "set    " : "MISSING"}  ${name.padEnd(38)} ${why}`);
}

console.log("\nOptional\n");
for (const [name, feature, fallback] of OPTIONAL) {
  console.log(`  ${set(name) ? "on " : "off"}  ${name.padEnd(30)} ${feature}`);
  if (!set(name)) console.log(`       ${" ".repeat(30)} ${fallback}`);
}

// Partial SMTP config is the failure that looks like it should work.
const smtpSet = SMTP_REQUIRED.filter((name) => set(name));
if (smtpSet.length > 0 && smtpSet.length < SMTP_REQUIRED.length) {
  const absent = SMTP_REQUIRED.filter((name) => !set(name));
  console.log(
    `\nWarning: SMTP is half configured. Missing ${absent.join(", ")}, so no email will send.`,
  );
} else if (smtpSet.length === SMTP_REQUIRED.length) {
  console.log("\nSMTP is configured. Run `bun run check:smtp` to authenticate against the server.");
}

if (missing.length) {
  console.log(`\nMissing ${missing.length} required variable(s): ${missing.join(", ")}`);
  console.log("Copy the names from .env.example and fill them in from your Supabase project.");
  process.exit(1);
}

console.log("\nAll required variables are set.");
