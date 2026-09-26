import "server-only";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { hasColumns } from "@/lib/columns";

/** Dropdown options shared by the new and edit case-study screens. */
export async function loadCaseStudyOptions() {
  const [services, industries, editorFields] = await Promise.all([
    supabaseAdmin.from("services").select("id, name").order("sort_order"),
    supabaseAdmin.from("industries").select("id, name").order("sort_order"),
    hasColumns("case_studies", ["tags", "cover_image_alt"]),
  ]);

  if (services.error) console.error("[admin/case-studies] services failed", services.error);
  if (industries.error) console.error("[admin/case-studies] industries failed", industries.error);

  return {
    services: services.data ?? [],
    industries: industries.data ?? [],
    editorFields,
  };
}
