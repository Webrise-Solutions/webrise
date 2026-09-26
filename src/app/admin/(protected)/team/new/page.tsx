import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { TeamMemberForm } from "../TeamMemberForm";
export const metadata: Metadata = {
  title: "New team member | Webrise Admin",
  robots: { index: false, follow: false },
};
export default function NewTeamMemberPage() {
  return (
    <div>
      <Link
        href="/admin/team"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="rotate-180" /> Team
      </Link>
      <h1 className="mt-5 text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)]">New team member</h1>
      <div className="mt-8">
        <TeamMemberForm />
      </div>
    </div>
  );
}
