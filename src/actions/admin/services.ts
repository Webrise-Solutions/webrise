"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { CLUSTERS } from "@/lib/service-clusters";
import { slugify } from "@/lib/slug";

export type EditorState = { error?: string; saved?: boolean };

const optionalText = z
  .string()
  .trim()
  .max(4000)
  .transform((v) => (v === "" ? null : v))
  .nullable();

/** Deliverables arrive as one JSON array of strings from ListEditor. */
const deliverablesSchema = z
  .string()
  .trim()
  .transform((raw, ctx) => {
    if (!raw) return [] as string[];
    try {
      const parsed = z.string().trim().min(1).max(160).array().max(20).safeParse(JSON.parse(raw));
      if (!parsed.success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deliverables could not be read." });
        return z.NEVER;
      }
      return parsed.data;
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deliverables could not be read." });
      return z.NEVER;
    }
  });

/** Process steps arrive as JSON [{ title, description }]. */
const processStepsSchema = z
  .string()
  .trim()
  .transform((raw, ctx) => {
    if (!raw) return [] as { title: string; description: string }[];
    try {
      const shape = z
        .object({
          title: z.string().trim().min(1).max(120),
          description: z.string().trim().max(600).default(""),
        })
        .array()
        .max(12);
      const parsed = shape.safeParse(JSON.parse(raw));
      if (!parsed.success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Each process step needs a title." });
        return z.NEVER;
      }
      return parsed.data;
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Process steps could not be read." });
      return z.NEVER;
    }
  });

const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Give the service a name").max(120),
  slug: z.string().trim().max(80),
  cluster: z.enum(CLUSTERS),
  short_description: optionalText,
  // Rich text, so it is sanitised before it can reach the database.
  hero_copy: z
    .string()
    .trim()
    .max(60000)
    .transform((v) => {
      const clean = sanitizeHtml(v);
      return clean === "" ? null : clean;
    })
    .nullable(),
  deliverables: deliverablesSchema,
  process_steps: processStepsSchema,
  seo_title: optionalText,
  seo_description: optionalText,
  sort_order: z.coerce.number().int().min(0).max(999),
});

function readForm(formData: FormData) {
  const get = (key: string) => (formData.get(key) ?? "").toString();

  return {
    ...(get("id") ? { id: get("id") } : {}),
    name: get("name"),
    slug: get("slug"),
    cluster: get("cluster") || "seo",
    short_description: get("short_description"),
    hero_copy: get("hero_copy"),
    deliverables: get("deliverables"),
    process_steps: get("process_steps"),
    seo_title: get("seo_title"),
    seo_description: get("seo_description"),
    sort_order: get("sort_order") || "0",
  };
}

function isDuplicateSlug(code: string | undefined): boolean {
  return code === "23505";
}

export async function saveService(_prev: EditorState, formData: FormData): Promise<EditorState> {
  // Server Actions are public endpoints; the layout guard does not cover them.
  await requireAdmin();

  const parsed = serviceSchema.safeParse(readForm(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const { id, ...values } = parsed.data;
  const slug = slugify(values.slug || values.name);

  if (!slug) {
    return { error: "Could not build a slug from that name. Enter one manually." };
  }

  const row = { ...values, slug };

  if (id) {
    const { error } = await supabaseAdmin.from("services").update(row).eq("id", id);

    if (error) {
      console.error("[admin/services] update failed", error);
      return {
        error: isDuplicateSlug(error.code)
          ? `Another service already uses the slug "${slug}".`
          : "Could not save the service. Please try again.",
      };
    }

    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${id}`);
    return { saved: true };
  }

  const { data, error } = await supabaseAdmin.from("services").insert(row).select("id").single();

  if (error || !data) {
    console.error("[admin/services] insert failed", error);
    return {
      error: isDuplicateSlug(error?.code)
        ? `Another service already uses the slug "${slug}".`
        : "Could not create the service. Please try again.",
    };
  }

  revalidatePath("/admin/services");
  redirect(`/admin/services/${data.id}?created=1`);
}

export async function deleteService(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = z
    .string()
    .uuid()
    .safeParse((formData.get("id") ?? "").toString());
  if (!id.success) return;

  // case_studies.service_id and leads.service_id are ON DELETE SET NULL, so
  // those records survive without their service link.
  const { error } = await supabaseAdmin.from("services").delete().eq("id", id.data);
  if (error) console.error("[admin/services] delete failed", error);

  revalidatePath("/admin/services");
  redirect("/admin/services");
}
