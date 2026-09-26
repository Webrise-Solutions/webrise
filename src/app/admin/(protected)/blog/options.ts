import "server-only";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { hasColumns } from "@/lib/columns";

/** Dropdown options shared by the new-post and edit-post screens. */
export async function loadPostOptions() {
  const [categories, authors, editorFields] = await Promise.all([
    supabaseAdmin.from("blog_categories").select("id, name").order("sort_order"),
    supabaseAdmin.from("authors").select("id, name").order("name"),
    hasColumns("blog_posts", ["tags", "cover_image_alt"]),
  ]);

  if (categories.error) console.error("[admin/blog] categories failed", categories.error);
  if (authors.error) console.error("[admin/blog] authors failed", authors.error);

  return {
    categories: categories.data ?? [],
    authors: authors.data ?? [],
    editorFields,
  };
}
