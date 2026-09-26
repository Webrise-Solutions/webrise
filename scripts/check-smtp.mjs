/**
 * SMTP check: `bun run check:smtp`
 *
 * Connects, upgrades to TLS and authenticates — without sending anything — so
 * a wrong port or a revoked app password is caught here rather than silently
 * in a log the next time somebody fills in a form.
 *
 * Prints the host and account, never the password.
 */
import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

const root = path.resolve(import.meta.dirname, "..");
const file = path.join(root, ".env");
const fromFile = {};

if (fs.existsSync(file)) {
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const value = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (value) fromFile[trimmed.slice(0, eq).trim()] = value;
  }
}

const env = { ...fromFile, ...process.env };
const missing = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"].filter((name) => !env[name]);

if (missing.length) {
  console.log(`SMTP is not configured. Missing: ${missing.join(", ")}`);
  process.exit(1);
}

const port = Number(env.SMTP_PORT ?? 587) || 587;
console.log(`Connecting to ${env.SMTP_HOST}:${port} as ${env.SMTP_USER}...`);

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 12000,
});

try {
  await transporter.verify();
  console.log("Authenticated. Notifications will send.");
  console.log(`  from: ${env.LEAD_NOTIFICATION_FROM ?? env.SMTP_USER}`);
  console.log(`  to:   ${env.LEAD_NOTIFICATION_TO ?? env.SMTP_USER}`);
} catch (error) {
  console.log(`Failed: ${error.code ?? ""} ${String(error.message).split("\n")[0]}`);
  if (String(error.message).includes("Username and Password not accepted")) {
    console.log(
      "Gmail rejects the account password here. Use an app password from https://myaccount.google.com/apppasswords (needs 2-Step Verification on).",
    );
  }
  process.exit(1);
}
