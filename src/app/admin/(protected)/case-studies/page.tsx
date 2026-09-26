import type { Metadata } from "next";
import Link from "next/link";
import { ActionLink } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { EmptyState, StatusBadge } from "@/components/admin/fields";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const metadata: Metadata = {
  title: "Case studies | Webrise Admin",
  robots: { index: false, follow: false },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminCaseStudyListPage() {
  const { data, error } = await supabaseAdmin
    .from("case_studies")
    .select("id, title, slug, status, featured, client_name, updated_at, services(name)")
    .order("updated_at", { ascending: false });

  const studies = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
            Case studies
          </h1>
          <p className="mt-2 text-muted-foreground">
            {studies.length} {studies.length === 1 ? "case study" : "case studies"}
          </p>
        </div>
        <ActionLink href="/admin/case-studies/new" size="sm">
          <Icon name="plus" size={16} className="shrink-0" />
          New case study
        </ActionLink>
      </div>

      <div className="mt-8">
        {error ? (
          <EmptyState
            title="Could not load case studies"
            description={`The case_studies table returned an error: ${error.message}`}
          />
        ) : studies.length === 0 ? (
          <EmptyState
            title="No case studies yet"
            description="Publishing a couple unblocks the featured strip on the homepage, which currently has nothing to show."
            action={
              <ActionLink href="/admin/case-studies/new" size="sm">
                <Icon name="plus" size={16} className="shrink-0" />
                New case study
              </ActionLink>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line-soft bg-white shadow-card">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-line-soft bg-offwhite text-left">
                  <th className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Title
                  </th>
                  <th className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Client
                  </th>
                  <th className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Service
                  </th>
                  <th className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Status
                  </th>
                  <th className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Updated
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {studies.map((study) => (
                  <tr key={study.id} className="border-b border-line-soft last:border-b-0">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/case-studies/${study.id}`}
                        className="font-semibold text-ink hover:text-teal"
                      >
                        {study.title}
                      </Link>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-[12px] text-muted-foreground">
                          /{study.slug}
                        </span>
                        {study.featured ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-rust">
                            <Icon name="star" size={12} />
                            Featured
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {study.client_name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {study.services?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={study.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {dateFormat.format(new Date(study.updated_at))}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/case-studies/${study.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-dark"
                      >
                        Edit
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
