import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

async function showCaseStudy() {
  const { data, error } = await supabase
    .from("case_studies")
    .select("title, slug, body")
    .eq("slug", "point-of-sale-platform")
    .single();

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(`Title: ${data.title}`);
  console.log(`Slug: ${data.slug}`);
  console.log("\n=== BODY CONTENT ===\n");
  console.log(data.body);
}

showCaseStudy();
