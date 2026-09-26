import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

async function listCaseStudies() {
  const { data, error } = await supabase
    .from("case_studies")
    .select("id, slug, title, body, status")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(`\nTotal case studies: ${data?.length}\n`);

  data?.forEach((study, index) => {
    const hasBody = study.body && study.body.trim() !== "";
    console.log(`${index + 1}. ${study.title}`);
    console.log(`   Slug: ${study.slug}`);
    console.log(`   Status: ${study.status}`);
    console.log(`   Has body: ${hasBody ? "✓ YES" : "✗ NO"}`);
    if (hasBody) {
      console.log(`   Body length: ${study.body.length} chars`);
    }
    console.log();
  });
}

listCaseStudies();
