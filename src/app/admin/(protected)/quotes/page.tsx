import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { EmptyState } from "@/components/admin/fields";
import { StatusPill, SubmissionFilters, submissionDate } from "@/components/admin/submissions";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { escapeSearch, readSearch, statusCounts } from "../leads/query";

export const metadata: Metadata = {
  title: "Quote requests | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string; q?: string }>;
}) {
  const { status, sort, q } = readSearch(await searchParams);

  let query = supabaseAdmin
    .from("quote_requests")
    .select(
      "id, name, email, company, budget_range, project_timeline, service_ids, status, created_at",
    )
    .order("created_at", { ascending: sort === "oldest" })
    .limit(200);

  if (status !== "all") query = query.eq("status", status);
  if (q) {
    const term = escapeSearch(q);
    query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%`);
  }

  const [{ data, error }, counts, { data: services }] = await Promise.all([
    query,
    statusCounts("quote_requests"),
    supabaseAdmin.from("services").select("id, name"),
  ]);

  const quotes = data ?? [];
  // service_ids is a uuid[] with no foreign key, so the names are resolved here.
  const serviceNames = new Map((services ?? []).map((s) => [s.id, s.name]));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
            Quote requests
          </h1>
          <p className="mt-2 text-muted-foreground">
            {counts === null
              ? "Counts unavailable"
              : `${counts["all"] ?? 0} total, ${counts["new"] ?? 0} new`}
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-offwhite"
        >
          <Icon name="users" size={16} className="shrink-0" />
          Leads
        </Link>
      </div>

      <SubmissionFilters
        basePath="/admin/quotes"
        status={status}
        sort={sort}
        q={q}
        counts={counts}
      />

      <div className="mt-6">
        {error ? (
          <EmptyState
            title="Could not load quote requests"
            description={`The quote_requests table returned an error: ${error.message}`}
          />
        ) : quotes.length === 0 ? (
          <EmptyState
            title={q || status !== "all" ? "Nothing matches that filter" : "No quote requests yet"}
            description={
              q || status !== "all"
                ? "Try a different status, or clear the search."
                : "Quote form submissions land here once the public form is built."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line-soft bg-white shadow-card">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-line-soft bg-offwhite text-left">
                  {["Name", "Email", "Services", "Budget", "Status", "Submitted", ""].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => {
                  const names = (quote.service_ids ?? [])
                    .map((sid) => serviceNames.get(sid))
                    .filter(Boolean);

                  return (
                    <tr key={quote.id} className="border-b border-line-soft last:border-b-0">
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/quotes/${quote.id}`}
                          className="font-semibold text-ink hover:text-teal"
                        >
                          {quote.name}
                        </Link>
                        {quote.company ? (
                          <div className="mt-0.5 text-[13px] text-muted-foreground">
                            {quote.company}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        <a href={`mailto:${quote.email}`} className="hover:text-teal">
                          {quote.email}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {names.length ? names.join(", ") : "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {quote.budget_range ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill status={quote.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                        {submissionDate.format(new Date(quote.created_at))}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/quotes/${quote.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-dark"
                        >
                          Open
                          <Icon name="arrow-right" size={15} className="shrink-0" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
