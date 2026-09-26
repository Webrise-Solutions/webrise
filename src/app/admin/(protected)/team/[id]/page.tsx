import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { TeamMemberForm } from "../TeamMemberForm";
export const metadata: Metadata = {
  title: "Edit team member | Webrise Admin",
  robots: { index: false, follow: false },
};
export default async function EditTeamMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const { data: member, error } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) console.error("[admin/team] load failed", error);
  if (!member) notFound();
  return (
    <div>
      <Link
        href="/admin/team"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="rotate-180" /> Team
      </Link>
      <h1 className="mt-5 text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)]">{member.name}</h1>
      <div className="mt-8">
        <TeamMemberForm member={member} {...(created ? { justCreated: true } : {})} />
      </div>
    </div>
  );
}
