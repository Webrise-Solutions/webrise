"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { slugify } from "@/lib/slug";

export type EditorState = { error?: string; saved?: boolean };

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

const postSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2, "Give the post a title").max(200),
  slug: z.string().trim().max(80),
  excerpt: optionalText,
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
  category_id: optionalUuid,
  author_id: optionalUuid,
  cover_image_url: optionalText,
  cover_image_alt: optionalText,
  tags: tagsSchema,
  seo_title: optionalText,
  seo_description: optionalText,
  status: z.enum(["draft", "published"]),
  published_at: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : new Date(v).toISOString()))
    .nullable(),
});

function readForm(formData: FormData) {
  const get = (key: string) => (formData.get(key) ?? "").toString();

  return {
    ...(get("id") ? { id: get("id") } : {}),
    title: get("title"),
    slug: get("slug"),
    excerpt: get("excerpt"),
    body: get("body"),
    category_id: get("category_id"),
    author_id: get("author_id"),
    cover_image_url: get("cover_image_url"),
    cover_image_alt: get("cover_image_alt"),
    tags: get("tags"),
    seo_title: get("seo_title"),
    seo_description: get("seo_description"),
    status: get("status") || "draft",
    published_at: get("published_at"),
  };
}

/** Postgres unique-violation, i.e. the slug is taken. */
function isDuplicateSlug(code: string | undefined): boolean {
  return code === "23505";
}

export async function savePost(_prev: EditorState, formData: FormData): Promise<EditorState> {
  // A Server Action is a public HTTP endpoint. The layout guard does not cover
  // it, so authorisation is re-checked here on every call.
  await requireAdmin();

  const parsed = postSchema.safeParse(readForm(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const { id, ...values } = parsed.data;
  const slug = slugify(values.slug || values.title);

  if (!slug) {
    return { error: "Could not build a slug from that title. Enter one manually." };
  }

  // Publishing without a date set stamps it now; nothing is auto-cleared on
  // unpublish, so the original date survives a draft/publish round trip.
  const published_at =
    values.status === "published"
      ? (values.published_at ?? new Date().toISOString())
      : values.published_at;

  const row = { ...values, slug, published_at };

  if (id) {
    const { error } = await supabaseAdmin.from("blog_posts").update(row).eq("id", id);

    if (error) {
      console.error("[admin/blog] update failed", error);
      return {
        error: isDuplicateSlug(error.code)
          ? `Another post already uses the slug "${slug}".`
          : "Could not save the post. Please try again.",
      };
    }

    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${id}`);
    return { saved: true };
  }

  const { data, error } = await supabaseAdmin.from("blog_posts").insert(row).select("id").single();

  if (error || !data) {
    console.error("[admin/blog] insert failed", error);
    return {
      error: isDuplicateSlug(error?.code)
        ? `Another post already uses the slug "${slug}".`
        : "Could not create the post. Please try again.",
    };
  }

  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${data.id}?created=1`);
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = z
    .string()
    .uuid()
    .safeParse((formData.get("id") ?? "").toString());
  if (!id.success) return;

  const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id.data);
  if (error) console.error("[admin/blog] delete failed", error);

  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}
