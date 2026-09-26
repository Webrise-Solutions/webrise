"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth";

export type EditorState = { error?: string; saved?: boolean };

const optionalText = z
  .string()
  .trim()
  .max(200)
  .transform((v) => (v === "" ? null : v))
  .nullable();

const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  client_name: z.string().trim().min(2, "Give the client a name").max(120),
  client_company: optionalText,
  quote: z.string().trim().min(10, "The quote is too short to be useful").max(1200),
  // The column allows null, which is how "no rating given" is stored.
  rating: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v)))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 1 && v <= 5), "Rating must be 1 to 5")
    .nullable(),
  service_id: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine((v) => v === null || z.string().uuid().safeParse(v).success, "Invalid service"),
  avatar_url: z
    .string()
    .trim()
    .max(1000)
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  featured: z.boolean(),
});

/**
 * Saves one testimonial.
 *
 * There is deliberately no draft state: public.testimonials is readable by
 * anyone under RLS, so a row is live the moment it exists. `featured` only
 * chooses where it appears, never whether it is visible.
 */
export async function saveTestimonial(
  _prev: EditorState,
  formData: FormData,
): Promise<EditorState> {
  // Server Actions are public endpoints; the layout guard does not cover them.
  await requireAdmin();

  const get = (key: string) => (formData.get(key) ?? "").toString();
  const parsed = testimonialSchema.safeParse({
    ...(get("id") ? { id: get("id") } : {}),
    client_name: get("client_name"),
    client_company: get("client_company"),
    quote: get("quote"),
    rating: get("rating"),
    service_id: get("service_id"),
    avatar_url: get("avatar_url"),
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const { id, ...values } = parsed.data;

  if (id) {
    const { error } = await supabaseAdmin.from("testimonials").update(values).eq("id", id);

    if (error) {
      console.error("[admin/testimonials] update failed", error);
      return { error: "Could not save the testimonial. Please try again." };
    }

    revalidatePath("/admin/testimonials");
    revalidatePath(`/admin/testimonials/${id}`);
    return { saved: true };
  }

  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .insert(values)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[admin/testimonials] insert failed", error);
    return { error: "Could not create the testimonial. Please try again." };
  }

  revalidatePath("/admin/testimonials");
  redirect(`/admin/testimonials/${data.id}?created=1`);
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = z
    .string()
    .uuid()
    .safeParse((formData.get("id") ?? "").toString());
  if (!id.success) return;

  const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id.data);
  if (error) console.error("[admin/testimonials] delete failed", error);

  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}
