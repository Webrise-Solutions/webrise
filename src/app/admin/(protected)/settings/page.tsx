import type { Metadata } from "next";
import { Icon } from "@/components/shared/Icon";
import { EmptyState } from "@/components/admin/fields";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminManager, type AdminRow } from "./AdminManager";

export const metadata: Metadata = {
  title: "Settings | Webrise Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const current = await requireAdmin();

  const [{ data: rows, error }, { data: authData, error: authError }] = await Promise.all([
    supabaseAdmin.from("admin_users").select("id, full_name, created_at").order("created_at"),
    // Emails live in auth.users, which is only reachable through the admin API.
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  if (error) console.error("[admin/settings] admin_users failed", error);
  if (authError) console.error("[admin/settings] listUsers failed", authError);

  const usersById = new Map((authData?.users ?? []).map((user) => [user.id, user]));

  const admins: AdminRow[] = (rows ?? []).map((row) => {
    const user = usersById.get(row.id);
    return {
      id: row.id,
      // A row whose auth user was deleted still holds a grant; showing the id
      // makes that visible rather than rendering a blank line.
      email: user?.email ?? `Unknown account (${row.id.slice(0, 8)})`,
      fullName: row.full_name,
      addedAt: row.created_at,
      lastSignInAt: user?.last_sign_in_at ?? null,
      isSelf: row.id === current.id,
    };
  });

  return (
    <div>
      <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
        Settings
      </h1>
      <div className="mt-[18px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
      <p className="mt-[22px] max-w-[60ch] text-muted-foreground">
        Who can reach this admin area. Everyone listed here has full access to every screen,
        including leads, submissions and published content.
      </p>

      <div className="mt-8">
        {error || admins.length === 0 ? (
          <EmptyState
            title="Could not load administrators"
            description={
              error
                ? `The admin_users table returned an error: ${error.message}`
                : "No rows in admin_users, which should not be possible while you are signed in."
            }
          />
        ) : (
          <AdminManager admins={admins} />
        )}
      </div>

      <p className="mt-6 flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
        <Icon name="shield-lock" size={16} className="mt-0.5 shrink-0" />
        Removing the last administrator, or your own access, is blocked: either would lock everyone
        out, and the only way back would be a manual insert in the SQL editor.
      </p>
    </div>
  );
}
