import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/admin/fields";
import { Icon } from "@/components/shared/Icon";
import { ActionLink } from "@/components/ui/action";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const metadata: Metadata = {
  title: "Team | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function AdminTeamPage() {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("id, name, role, published, sort_order")
    .order("sort_order")
    .order("name");
  const members = data ?? [];
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
            Team
          </h1>
          <p className="mt-2 text-muted-foreground">Manage people shown on the About page.</p>
        </div>
        <ActionLink href="/admin/team/new" size="sm">
          <Icon name="plus" size={16} /> New team member
        </ActionLink>
      </div>
      <div className="mt-8">
        {error ? (
          <EmptyState
            title="Could not load the team"
            description="Apply the team module SQL migration, then refresh this page."
          />
        ) : members.length === 0 ? (
          <EmptyState
            title="No team members yet"
            description="Add the first person to populate the About page."
            action={
              <ActionLink href="/admin/team/new" size="sm">
                New team member
              </ActionLink>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <Link
                key={member.id}
                href={`/admin/team/${member.id}`}
                className="group rounded-2xl border border-line-soft bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-teal hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-soft text-teal">
                    <Icon name="users" size={22} />
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${member.published ? "bg-success-soft text-success" : "bg-sand text-muted-foreground"}`}
                  >
                    {member.published ? "Published" : "Hidden"}
                  </span>
                </div>
                <h2 className="mt-4 text-[15px] font-semibold text-ink">{member.name}</h2>
                <p className="mt-1.5 text-[13px] text-muted-foreground">{member.role}</p>
                <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Order {member.sort_order}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
