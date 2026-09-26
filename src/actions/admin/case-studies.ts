"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { slugify } from "@/lib/slug";
import type { EditorState } from "./blog";

export type { EditorState };

const optionalText = z
  .string()
  .trim()
  .max(20000)
  .transform((v) => (v === "" ? null : v))
  .nullable();

const optionalUuid = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .refine((v) => v === null || z.string().uuid().safeParse(v).success, "Invalid selection");

/** One headline number on a case study, e.g. { metric: "Organic traffic", value: "+212%" }. */
const resultSchema = z.object({
  metric: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(40),
  label: z.string().trim().max(120).optional().default(""),
});

const resultsSchema = z
  .string()
  .trim()
  .transform((raw, ctx) => {
    if (!raw) return [];
    try {
      const parsed = resultSchema.array().max(12).safeParse(JSON.parse(raw));
      if (!parsed.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Each result needs a metric and a value.",
        });
        return z.NEVER;
      }
      return parsed.data;
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Results could not be read. Remove and re-add them.",
      });
      return z.NEVER;
    }
  });

/** Tags arrive as one JSON array field from TagsInput. */
const tagsSchema = z
  .string()
  .trim()
  .transform((raw, ctx) => {
    if (!raw) return [] as string[];
    try {
      const parsed = z.string().trim().min(1).max(40).array().max(12).safeParse(JSON.parse(raw));
      if (!parsed.success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Tags could not be read." });
        return z.NEVER;
      }
      return parsed.data;
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Tags could not be read." });
      return z.NEVER;
    }
  });

const caseStudySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2, "Give the case study a title").max(200),
  slug: z.string().trim().max(80),
  client_name: optionalText,
  service_id: optionalUuid,
  industry_id: optionalUuid,
  summary: optionalText,
  // The body is rich-text HTML. It is sanitised here, on the server, because
  // the client is free to send anything it likes to a Server Action.
  body: z
    .string()
    .trim()
    .max(200000)
    .transform((v) => {
      const clean = sanitizeHtml(v);
      return clean === "" ? null : clean;
    })
    .nullable(),
  cover_image_url: optionalText,
  cover_image_alt: optionalText,
  tags: tagsSchema,
  seo_title: optionalText,
  seo_description: optionalText,
  results: resultsSchema,
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
});

function readForm(formData: FormData) {
  const get = (key: string) => (formData.get(key) ?? "").toString();

  return {
    ...(get("id") ? { id: get("id") } : {}),
    title: get("title"),
    slug: get("slug"),
    client_name: get("client_name"),
    service_id: get("service_id"),
    industry_id: get("industry_id"),
    summary: get("summary"),
    body: get("body"),
    cover_image_url: get("cover_image_url"),
    cover_image_alt: get("cover_image_alt"),
    tags: get("tags"),
    seo_title: get("seo_title"),
    seo_description: get("seo_description"),
    results: get("results"),
    featured: formData.get("featured") === "on",
    status: get("status") || "draft",
  };
}

function isDuplicateSlug(code: string | undefined): boolean {
  return code === "23505";
}

/** PostgREST could not find a column that the payload referenced. */
function isMissingColumn(code: string | undefined): boolean {
  return code === "PGRST204";
}

/**
 * case_studies.seo_title / seo_description arrive with
 * supabase/migrations/20260825140000_align_live_schema.sql. Until that runs,
 * a payload containing them is rejected wholesale with PGRST204 and the editor
 * would lose the entire edit. Dropping just those two keys keeps saving working
 * on either schema.
 *
 * Delete this and the two call sites once the migration is applied everywhere.
 */
function withoutSeoColumns<T extends Record<string, unknown>>(row: T) {
  const {
    seo_title: _title,
    seo_description: _description,
    tags: _tags,
    cover_image_alt: _alt,
    ...rest
  } = row;
  return rest;
}

export async function saveCaseStudy(_prev: EditorState, formData: FormData): Promise<EditorState> {
  // Server Actions are public endpoints; the layout guard does not protect them.
  await requireAdmin();

  const parsed = caseStudySchema.safeParse(readForm(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const { id, ...values } = parsed.data;
  const slug = slugify(values.slug || values.title);

  if (!slug) {
    return { error: "Could not build a slug from that title. Enter one manually." };
  }

  const row = { ...values, slug };

  if (id) {
    const { error } = await supabaseAdmin.from("case_studies").update(row).eq("id", id);

    if (error) {
      console.error("[admin/case-studies] update failed", error);
      return {
        error: isDuplicateSlug(error.code)
          ? `Another case study already uses the slug "${slug}".`
          : "Could not save the case study. Please try again.",
      };
    }

    revalidatePath("/admin/case-studies");
    revalidatePath(`/admin/case-studies/${id}`);
    return { saved: true };
  }

  const { data, error } = await supabaseAdmin
    .from("case_studies")
    .insert(row)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[admin/case-studies] insert failed", error);
    return {
      error: isDuplicateSlug(error?.code)
        ? `Another case study already uses the slug "${slug}".`
        : "Could not create the case study. Please try again.",
    };
  }

  revalidatePath("/admin/case-studies");
  redirect(`/admin/case-studies/${data.id}?created=1`);
}

export async function deleteCaseStudy(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = z
    .string()
    .uuid()
    .safeParse((formData.get("id") ?? "").toString());
  if (!id.success) return;

  const { error } = await supabaseAdmin.from("case_studies").delete().eq("id", id.data);
  if (error) console.error("[admin/case-studies] delete failed", error);

  revalidatePath("/admin/case-studies");
  redirect("/admin/case-studies");
}
