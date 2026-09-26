import "server-only";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Does this table actually have these columns?
 *
 * Editors ask before rendering fields whose migration may not have run, so a
 * field is disabled with an explanation instead of accepting input that the
 * database would reject. One cheap query, no schema introspection.
 */
export async function hasColumns(
  table: "blog_posts" | "case_studies",
  columns: string[],
): Promise<boolean> {
  const { error } = await supabaseAdmin.from(table).select(columns.join(",")).limit(1);

  if (error) {
    console.error(`[admin] ${table} missing ${columns.join(", ")}: ${error.message}`);
    return false;
  }

  return true;
}
