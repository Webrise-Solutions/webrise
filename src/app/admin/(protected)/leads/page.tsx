import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { EmptyState } from "@/components/admin/fields";
import { StatusPill, SubmissionFilters, submissionDate } from "@/components/admin/submissions";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { escapeSearch, readSearch, statusCounts } from "./query";

export const metadata: Metadata = {
  title: "Leads | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string; q?: string }>;
}) {
  const { status, sort, q } = readSearch(await searchParams);

  let query = supabaseAdmin
    .from("leads")
    .select("id, name, email, company, source_page, status, created_at, services(name)")
    .order("created_at", { ascending: sort === "oldest" })
    .limit(200);

  if (status !== "all") query = query.eq("status", status);
  if (q) {
    const term = escapeSearch(q);
    query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%`);
  }

  const [{ data, error }, counts] = await Promise.all([query, statusCounts("leads")]);
  const leads = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
            Leads
          </h1>
          <p className="mt-2 text-muted-foreground">
            {counts === null
              ? "Counts unavailable"
              : `${counts["all"] ?? 0} total, ${counts["new"] ?? 0} new`}
          </p>
        </div>
        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-offwhite"
        >
          <Icon name="briefcase" size={16} className="shrink-0" />
          Quote requests
        </Link>
      </div>

      <SubmissionFilters
        basePath="/admin/leads"
        status={status}
        sort={sort}
        q={q}
        counts={counts}
      />

      <div className="mt-6">
        {error ? (
          <EmptyState
            title="Could not load leads"
            description={`The leads table returned an error: ${error.message}`}
          />
        ) : leads.length === 0 ? (
          <EmptyState
            title={q || status !== "all" ? "Nothing matches that filter" : "No leads yet"}
            description={
              q || status !== "all"
                ? "Try a different status, or clear the search."
                : "Contact form submissions land here as soon as the form starts writing to this table."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line-soft bg-white shadow-card">
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr className="border-b border-line-soft bg-offwhite text-left">
                  {[
                    "Name",
                    "Email",
                    "Service interest",
                    "Source page",
                    "Status",
                    "Submitted",
                    "",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-line-soft last:border-b-0">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-semibold text-ink hover:text-teal"
                      >
                        {lead.name}
                      </Link>
                      {lead.company ? (
                        <div className="mt-0.5 text-[13px] text-muted-foreground">
                          {lead.company}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      <a href={`mailto:${lead.email}`} className="hover:text-teal">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {lead.services?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 font-mono text-[12px] text-muted-foreground">
                      {lead.source_page ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={lead.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                      {submissionDate.format(new Date(lead.created_at))}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-dark"
                      >
                        Open
                        <Icon name="arrow-right" size={15} className="shrink-0" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
