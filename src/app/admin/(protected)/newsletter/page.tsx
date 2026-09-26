import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { EmptyState } from "@/components/admin/fields";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const metadata: Metadata = {
  title: "Newsletter | Webrise Admin",
  robots: { index: false, follow: false },
};

const STATUSES = ["active", "unsubscribed"] as const;

const listDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** ISO-8601 for the export, which is what a spreadsheet and an ESP both want. */
function isoDate(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status =
    params.status && (STATUSES as readonly string[]).includes(params.status)
      ? params.status
      : "all";

  let query = supabaseAdmin
    .from("newsletter_subscribers")
    .select("id, email, status, source_page, created_at, unsubscribed_at")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (status !== "all") query = query.eq("status", status);

  const [{ data, error }, { data: allRows }] = await Promise.all([
    query,
    supabaseAdmin.from("newsletter_subscribers").select("status"),
  ]);

  const subscribers = data ?? [];
  const counts = {
    all: allRows?.length ?? 0,
    active: (allRows ?? []).filter((row) => row.status === "active").length,
    unsubscribed: (allRows ?? []).filter((row) => row.status === "unsubscribed").length,
  };

  // Flattened for the export so the CSV matches the table on screen.
  const exportRows = subscribers.map((row) => ({
    email: row.email,
    status: row.status,
    subscribed: isoDate(row.created_at),
    unsubscribed: row.unsubscribed_at ? isoDate(row.unsubscribed_at) : "",
    source_page: row.source_page ?? "",
  }));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
            Newsletter
          </h1>
          <p className="mt-2 text-muted-foreground">
            {counts.active} active, {counts.unsubscribed} unsubscribed
          </p>
        </div>
        <ExportCsvButton
          rows={exportRows}
          columns={[
            { key: "email", header: "Email" },
            { key: "status", header: "Status" },
            { key: "subscribed", header: "Subscribed" },
            { key: "unsubscribed", header: "Unsubscribed" },
            { key: "source_page", header: "Source page" },
          ]}
          filename={`webrise-subscribers-${status}-${new Date().toISOString().slice(0, 10)}.csv`}
        />
      </div>

      {/* Filter as links, so a filtered view is a shareable URL and the export
          below always matches what is on screen. */}
      <nav aria-label="Filter by status" className="mt-6 flex flex-wrap gap-1.5">
        {[
          { key: "all", label: "All", count: counts.all },
          { key: "active", label: "Active", count: counts.active },
          { key: "unsubscribed", label: "Unsubscribed", count: counts.unsubscribed },
        ].map((tab) => {
          const active = status === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key === "all" ? "/admin/newsletter" : `/admin/newsletter?status=${tab.key}`}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                active
                  ? "border-teal bg-teal-soft text-teal"
                  : "border-line bg-white text-muted-foreground hover:bg-offwhite"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                  active ? "bg-white text-teal" : "bg-sand text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </nav>

      <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-line bg-sand px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
        <Icon name="mail" size={16} className="mt-0.5 shrink-0" />
        This is a record of who signed up, not a sending tool. Export the list into your email
        platform to send anything.
      </p>

      <div className="mt-6">
        {error ? (
          <EmptyState
            title="Could not load subscribers"
            description={`The newsletter_subscribers table returned an error: ${error.message}`}
          />
        ) : subscribers.length === 0 ? (
          <EmptyState
            title={status === "all" ? "No subscribers yet" : "Nothing with that status"}
            description={
              status === "all"
                ? "Sign-ups land here as soon as the newsletter form is live."
                : "Try a different status."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line-soft bg-white shadow-card">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-line-soft bg-offwhite text-left">
                  {["Email", "Status", "Subscribed", "Source page"].map((heading) => (
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
                {subscribers.map((row) => (
                  <tr key={row.id} className="border-b border-line-soft last:border-b-0">
                    <td className="px-5 py-4">
                      <a
                        href={`mailto:${row.email}`}
                        className="text-[15px] font-medium text-ink hover:text-teal"
                      >
                        {row.email}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${
                          row.status === "active"
                            ? "bg-success-soft text-success"
                            : "bg-sand text-muted-foreground"
                        }`}
                      >
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                        {row.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                      {listDate.format(new Date(row.created_at))}
                      {row.unsubscribed_at ? (
                        <span className="block text-[12px]">
                          left {listDate.format(new Date(row.unsubscribed_at))}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 font-mono text-[12px] text-muted-foreground">
                      {row.source_page ?? "—"}
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
