"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth";
import type { EditorState } from "./blog";

export type { EditorState };

const optionalText = z
  .string()
  .trim()
  .max(2000)
  .transform((v) => (v === "" ? null : v))
  .nullable();

const authorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Give the author a name").max(120),
  bio: optionalText,
  avatar_url: optionalText,
});

export async function saveAuthor(_prev: EditorState, formData: FormData): Promise<EditorState> {
  // Server Actions are public endpoints; the layout guard does not protect them.
  await requireAdmin();

  const get = (key: string) => (formData.get(key) ?? "").toString();
  const parsed = authorSchema.safeParse({
    ...(get("id") ? { id: get("id") } : {}),
    name: get("name"),
    bio: get("bio"),
    avatar_url: get("avatar_url"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const { id, ...values } = parsed.data;

  if (id) {
    const { error } = await supabaseAdmin.from("authors").update(values).eq("id", id);

    if (error) {
      console.error("[admin/authors] update failed", error);
      return { error: "Could not save the author. Please try again." };
    }

    revalidatePath("/admin/authors");
    revalidatePath(`/admin/authors/${id}`);
    return { saved: true };
  }

  const { data, error } = await supabaseAdmin.from("authors").insert(values).select("id").single();

  if (error || !data) {
    console.error("[admin/authors] insert failed", error);
    return { error: "Could not create the author. Please try again." };
  }

  revalidatePath("/admin/authors");
  revalidatePath("/admin/blog");
  redirect(`/admin/authors/${data.id}?created=1`);
}

export async function deleteAuthor(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = z
    .string()
    .uuid()
    .safeParse((formData.get("id") ?? "").toString());
  if (!id.success) return;

  // blog_posts.author_id is ON DELETE SET NULL, so posts survive as unattributed.
  const { error } = await supabaseAdmin.from("authors").delete().eq("id", id.data);
  if (error) console.error("[admin/authors] delete failed", error);

  revalidatePath("/admin/authors");
  revalidatePath("/admin/blog");
  redirect("/admin/authors");
}
