"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth";

export type AdminState = { error?: string; message?: string };

const emailSchema = z.string().trim().email("Enter a valid email address").max(200);

/**
 * Grants admin access to an existing Supabase Auth user.
 *
 * There is deliberately no invite or signup path: the account must already
 * exist, created by hand in the Supabase dashboard. That keeps account
 * creation and privilege granting as two separate, deliberate acts.
 */
export async function addAdmin(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireAdmin();

  const parsed = emailSchema.safeParse((formData.get("email") ?? "").toString());
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  }
  const email = parsed.data.toLowerCase();

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (error) {
    console.error("[admin/settings] listUsers failed", error);
    return { error: "Could not read the user list. Please try again." };
  }

  const match = data.users.find((user) => user.email?.toLowerCase() === email);

  if (!match) {
    return {
      error: `No Supabase Auth account exists for ${email}. Create the account first, then add it here.`,
    };
  }

  const { error: insertError } = await supabaseAdmin
    .from("admin_users")
    .upsert({ id: match.id, full_name: null }, { onConflict: "id" });

  if (insertError) {
    console.error("[admin/settings] grant failed", insertError);
    return { error: "Could not grant admin access. Please try again." };
  }

  revalidatePath("/admin/settings");
  return { message: `${email} is now an administrator.` };
}

/**
 * Revokes admin access.
 *
 * Refuses two things outright: removing yourself, and removing the last
 * administrator. Either would leave the admin area unreachable, and the only
 * way back would be a manual insert in the SQL editor.
 */
export async function removeAdmin(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const current = await requireAdmin();

  const id = z
    .string()
    .uuid()
    .safeParse((formData.get("id") ?? "").toString());
  if (!id.success) return { error: "Unknown administrator." };

  if (id.data === current.id) {
    return { error: "You cannot remove your own admin access." };
  }

  const { count, error: countError } = await supabaseAdmin
    .from("admin_users")
    .select("*", { count: "exact", head: true });

  if (countError || typeof count !== "number") {
    console.error("[admin/settings] count failed", countError);
    return { error: "Could not verify how many administrators remain." };
  }

  if (count <= 1) {
    return { error: "This is the only administrator. Add another before removing this one." };
  }

  const { error } = await supabaseAdmin.from("admin_users").delete().eq("id", id.data);

  if (error) {
    console.error("[admin/settings] revoke failed", error);
    return { error: "Could not remove admin access. Please try again." };
  }

  revalidatePath("/admin/settings");
  return { message: "Admin access removed." };
}
