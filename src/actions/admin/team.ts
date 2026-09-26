"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth";

export type TeamEditorState = { error?: string; saved?: boolean };

const optionalUrl = z
  .string()
  .trim()
  .max(2000)
  .transform((value) => (value === "" ? null : value))
  .refine(
    (value) => value === null || value.startsWith("/") || z.string().url().safeParse(value).success,
    {
      message: "Use a valid image URL or site-relative path.",
    },
  );

const schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Give the team member a name.").max(120),
  role: z.string().trim().min(2, "Give the team member a role.").max(160),
  image_url: optionalUrl,
  tone: z.enum(["night", "teal", "rust"]),
  sort_order: z.coerce.number().int().min(0).max(9999),
  published: z.boolean(),
});

export async function saveTeamMember(
  _previous: TeamEditorState,
  formData: FormData,
): Promise<TeamEditorState> {
  await requireAdmin();
  const get = (key: string) => (formData.get(key) ?? "").toString();
  const parsed = schema.safeParse({
    ...(get("id") ? { id: get("id") } : {}),
    name: get("name"),
    role: get("role"),
    image_url: get("image_url"),
    tone: get("tone"),
    sort_order: get("sort_order"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  const { id, ...values } = parsed.data;

  if (id) {
    const { error } = await supabaseAdmin.from("team_members").update(values).eq("id", id);
    if (error) {
      console.error("[admin/team] update failed", error);
      return { error: "Could not save the team member. Apply the team SQL migration first." };
    }
    revalidatePath("/about");
    revalidatePath("/admin/team");
    return { saved: true };
  }

  const { data, error } = await supabaseAdmin
    .from("team_members")
    .insert(values)
    .select("id")
    .single();
  if (error || !data) {
    console.error("[admin/team] insert failed", error);
    return { error: "Could not create the team member. Apply the team SQL migration first." };
  }
  revalidatePath("/about");
  revalidatePath("/admin/team");
  redirect(`/admin/team/${data.id}?created=1`);
}

export async function deleteTeamMember(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z
    .string()
    .uuid()
    .safeParse((formData.get("id") ?? "").toString());
  if (!id.success) return;
  const { error } = await supabaseAdmin.from("team_members").delete().eq("id", id.data);
  if (error) console.error("[admin/team] delete failed", error);
  revalidatePath("/about");
  revalidatePath("/admin/team");
  redirect("/admin/team");
}
