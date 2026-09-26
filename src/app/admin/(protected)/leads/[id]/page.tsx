import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import {
  AttributionPanel,
  DetailRow,
  StatusPill,
  submissionDate,
} from "@/components/admin/submissions";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SubmissionEditor } from "../SubmissionEditor";

export const metadata: Metadata = {
  title: "Lead | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: lead, error } = await supabaseAdmin
    .from("leads")
    .select("*, services(name)")
    .eq("id", id)
    .maybeSingle();

  if (error) console.error("[admin/leads] load failed", error);
  if (!lead) notFound();

  // `select("*")` returns whatever columns exist, so the presence of the key is
  // itself the feature check — no extra round trip to the schema.
  const notesAvailable = "admin_notes" in lead;
  const adminNotes = notesAvailable
    ? ((lead as { admin_notes: string | null }).admin_notes ?? null)
    : null;

  const replySubject = encodeURIComponent(`Re: your enquiry with Webrise`);
  const replyBody = encodeURIComponent(`Hi ${lead.name.split(" ")[0] ?? lead.name},\n\n`);

  return (
    <div>
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
        Leads
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
          {lead.name}
        </h1>
        <StatusPill status={lead.status} />
      </div>
      <p className="mt-2 text-muted-foreground">
        Submitted {submissionDate.format(new Date(lead.created_at))}
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="grid gap-5">
          <section className="rounded-2xl border border-line-soft bg-white p-6 shadow-card">
            <h2 className="text-[15px] font-semibold text-ink">Submission</h2>

            <dl className="mt-4">
              <DetailRow label="Email">
                <a href={`mailto:${lead.email}`} className="text-teal hover:text-teal-dark">
                  {lead.email}
                </a>
              </DetailRow>
              <DetailRow label="Phone">
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="text-teal hover:text-teal-dark">
                    {lead.phone}
                  </a>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label="Company">{lead.company ?? "—"}</DetailRow>
              <DetailRow label="Service interest">{lead.services?.name ?? "—"}</DetailRow>
              <DetailRow label="Message">
                {lead.message ? (
                  <span className="whitespace-pre-wrap leading-relaxed">{lead.message}</span>
                ) : (
                  "—"
                )}
              </DetailRow>
            </dl>

            <a
              href={`mailto:${lead.email}?subject=${replySubject}&body=${replyBody}`}
              className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-rust px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-rust-dark"
            >
              <Icon name="mail" size={17} className="shrink-0" />
              Reply by email
            </a>
          </section>

          <AttributionPanel row={lead} />
        </div>

        <SubmissionEditor
          kind="leads"
          id={lead.id}
          status={lead.status}
          adminNotes={adminNotes}
          notesAvailable={notesAvailable}
        />
      </div>
    </div>
  );
}
