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
import { SubmissionEditor } from "../../leads/SubmissionEditor";

export const metadata: Metadata = {
  title: "Quote request | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [{ data: quote, error }, { data: services }] = await Promise.all([
    supabaseAdmin.from("quote_requests").select("*").eq("id", id).maybeSingle(),
    supabaseAdmin.from("services").select("id, name"),
  ]);

  if (error) console.error("[admin/quotes] load failed", error);
  if (!quote) notFound();

  const serviceNames = new Map((services ?? []).map((s) => [s.id, s.name]));
  const requested = (quote.service_ids ?? []).map((sid) => serviceNames.get(sid) ?? sid);

  // The key's presence is the feature check for the admin_notes migration.
  const notesAvailable = "admin_notes" in quote;
  const adminNotes = notesAvailable
    ? ((quote as { admin_notes: string | null }).admin_notes ?? null)
    : null;

  const replySubject = encodeURIComponent("Re: your quote request with Webrise");
  const replyBody = encodeURIComponent(`Hi ${quote.name.split(" ")[0] ?? quote.name},\n\n`);

  return (
    <div>
      <Link
        href="/admin/quotes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
        Quote requests
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
          {quote.name}
        </h1>
        <StatusPill status={quote.status} />
      </div>
      <p className="mt-2 text-muted-foreground">
        Submitted {submissionDate.format(new Date(quote.created_at))}
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="grid gap-5">
          <section className="rounded-2xl border border-line-soft bg-white p-6 shadow-card">
            <h2 className="text-[15px] font-semibold text-ink">Request</h2>

            <dl className="mt-4">
              <DetailRow label="Email">
                <a href={`mailto:${quote.email}`} className="text-teal hover:text-teal-dark">
                  {quote.email}
                </a>
              </DetailRow>
              <DetailRow label="Phone">
                {quote.phone ? (
                  <a href={`tel:${quote.phone}`} className="text-teal hover:text-teal-dark">
                    {quote.phone}
                  </a>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label="Company">{quote.company ?? "—"}</DetailRow>
              <DetailRow label="Services">
                {requested.length ? (
                  <span className="flex flex-wrap gap-1.5">
                    {requested.map((name) => (
                      <span
                        key={name}
                        className="rounded-full bg-teal-soft px-2.5 py-1 text-[12px] font-semibold text-teal"
                      >
                        {name}
                      </span>
                    ))}
                  </span>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label="Budget">{quote.budget_range ?? "—"}</DetailRow>
              <DetailRow label="Timeline">{quote.project_timeline ?? "—"}</DetailRow>
              <DetailRow label="Their notes">
                {quote.notes ? (
                  <span className="whitespace-pre-wrap leading-relaxed">{quote.notes}</span>
                ) : (
                  "—"
                )}
              </DetailRow>
            </dl>

            <a
              href={`mailto:${quote.email}?subject=${replySubject}&body=${replyBody}`}
              className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-rust px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-rust-dark"
            >
              <Icon name="mail" size={17} className="shrink-0" />
              Reply by email
            </a>
          </section>

          <AttributionPanel row={quote} />
        </div>

        <SubmissionEditor
          kind="quotes"
          id={quote.id}
          status={quote.status}
          adminNotes={adminNotes}
          notesAvailable={notesAvailable}
        />
      </div>
    </div>
  );
}
