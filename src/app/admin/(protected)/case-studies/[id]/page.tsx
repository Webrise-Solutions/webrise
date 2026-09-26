import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { StatusBadge } from "@/components/admin/fields";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { CaseStudyForm } from "../CaseStudyForm";
import { loadCaseStudyOptions } from "../options";

export const metadata: Metadata = {
  title: "Edit case study | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function EditCaseStudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;

  const [{ data: caseStudy, error }, { services, industries, editorFields }] = await Promise.all([
    supabaseAdmin.from("case_studies").select("*").eq("id", id).maybeSingle(),
    loadCaseStudyOptions(),
  ]);

  if (error) console.error("[admin/case-studies] load failed", error);
  if (!caseStudy) notFound();

  return (
    <div>
      <Link
        href="/admin/case-studies"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
        Case studies
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
          {caseStudy.title}
        </h1>
        <StatusBadge status={caseStudy.status} />
      </div>

      <div className="mt-8">
        <CaseStudyForm
          caseStudy={caseStudy}
          services={services}
          industries={industries}
          editorFields={editorFields}
          {...(created ? { justCreated: true } : {})}
        />
      </div>
    </div>
  );
}
