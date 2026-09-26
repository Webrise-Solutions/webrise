import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import { contact, siteUrl } from "@/data/site";

/**
 * New-submission email notifications, over SMTP.
 *
 * Sent from the Server Action that performed the insert rather than from a
 * database trigger. A trigger would need pg_net enabled and the credentials
 * stored inside the database, and its failures surface in Postgres logs nobody
 * reads. Sending here keeps the password in the server environment and puts
 * failures in the same place as every other application error.
 *
 * Never throws and never blocks. The lead is already saved by the time this
 * runs; an email provider having a bad afternoon must not turn a captured
 * lead into an error message for the person who submitted it.
 *
 * Needs the Node runtime: raw TCP is unavailable on edge, so any route that
 * ends up sending must not opt into it.
 */

type NotifyResult = { sent: boolean; reason?: string };

export type SubmissionNotice = {
  /** Human label for the subject line, e.g. "quote request". */
  kind: string;
  name: string;
  email: string;
  /** Field label / value pairs, rendered in order. */
  details: [string, string | null | undefined][];
  /** Admin path for the row, e.g. /admin/leads/<id>. */
  adminPath?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHtml(notice: SubmissionNotice) {
  const rows = notice.details
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${escapeHtml(
          label,
        )}</td><td style="padding:6px 0;color:#111827">${escapeHtml(String(value))}</td></tr>`,
    )
    .join("");

  const link = notice.adminPath
    ? `<p style="margin:24px 0 0"><a href="${siteUrl}${notice.adminPath}" style="color:#0f766e;font-weight:600">Open in the admin</a></p>`
    : "";

  return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6">
<p style="margin:0 0 16px">New ${escapeHtml(notice.kind)} from <strong>${escapeHtml(
    notice.name,
  )}</strong>.</p>
<table style="border-collapse:collapse">${rows}</table>
${link}
</div>`;
}

/** Plain-text alternative. Spam filters treat HTML-only mail with suspicion. */
function renderText(notice: SubmissionNotice) {
  const lines = notice.details
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);

  if (notice.adminPath) lines.push("", `Open in the admin: ${siteUrl}${notice.adminPath}`);
  return [`New ${notice.kind} from ${notice.name}.`, "", ...lines].join("\n");
}

/**
 * One transporter per server instance, built on first use.
 *
 * `undefined` means "not built yet"; `null` means "checked and not configured",
 * so an unconfigured deployment does not re-read the environment on every
 * submission.
 */
let transporter: Transporter | null | undefined;

function getTransporter(): Transporter | null {
  if (transporter !== undefined) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !user || !password) {
    transporter = null;
    return null;
  }

  const port = Number(process.env.SMTP_PORT ?? 587) || 587;

  transporter = nodemailer.createTransport({
    host,
    port,
    // 465 is implicit TLS; 587 opens in the clear and upgrades via STARTTLS.
    secure: port === 465,
    auth: { user, pass: password },
    // A stalled handshake must not hold the submitter's request open. The row
    // is already inserted, so giving up here costs only the email.
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });

  return transporter;
}

export async function notifySubmission(notice: SubmissionNotice): Promise<NotifyResult> {
  const mailer = getTransporter();

  if (!mailer) {
    // Expected until SMTP is configured, so this is a notice rather than an
    // error. The submission itself is safely in the database.
    console.info(
      `[notify] ${notice.kind} from ${notice.email} not emailed: set SMTP_HOST, SMTP_USER and SMTP_PASSWORD to enable`,
    );
    return { sent: false, reason: "not-configured" };
  }

  // Gmail rewrites From to the authenticated account regardless, so defaulting
  // to SMTP_USER is both accurate and one less thing to configure.
  const from = process.env.LEAD_NOTIFICATION_FROM ?? process.env.SMTP_USER ?? contact.email;
  const to = process.env.LEAD_NOTIFICATION_TO ?? process.env.SMTP_USER ?? contact.email;

  try {
    await mailer.sendMail({
      from,
      to: to.split(",").map((address) => address.trim()),
      // Replying from the inbox goes straight back to whoever submitted.
      replyTo: notice.email,
      subject: `New ${notice.kind}: ${notice.name}`,
      text: renderText(notice),
      html: renderHtml(notice),
    });

    return { sent: true };
  } catch (error) {
    console.error("[notify] send failed", error);
    return { sent: false, reason: "exception" };
  }
}
