import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/integrations/supabase/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { FORBIDDEN_PATH, LOGIN_PATH } from "@/lib/routes";

/**
 * Is this user listed in public.admin_users?
 *
 * Deliberately asked through the service-role client rather than the user's
 * own session. Two reasons: the answer must not depend on a policy the user
 * could be denied by, and the live `admin_users` select policy is currently
 * recursive (Postgres 42P17) — the service role bypasses RLS, so this keeps
 * working either side of the fix in 20260825140000_align_live_schema.sql.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[admin-auth] admin_users lookup failed", error);
    return false;
  }

  return data !== null;
}

/**
 * Gate for admin Server Components. Returns the signed-in admin, or redirects:
 * to the login page when nobody is signed in, and to /admin/forbidden when the
 * account exists but is not an admin.
 */
export async function requireAdmin(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    // Logged because a silent bounce back to the login page is otherwise
    // indistinguishable from "not signed in".
    console.error("[admin-auth] getUser returned no user", error?.message ?? "(no error)");
    redirect(LOGIN_PATH);
  }

  if (!(await isAdmin(user.id))) {
    // Kept signed in on purpose: the 403 page can then say who they are and
    // what to do next, instead of silently dumping them at a login form.
    redirect(FORBIDDEN_PATH);
  }

  return user;
}
