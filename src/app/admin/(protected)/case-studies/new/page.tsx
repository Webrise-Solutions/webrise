import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { CaseStudyForm } from "../CaseStudyForm";
import { loadCaseStudyOptions } from "../options";

export const metadata: Metadata = {
  title: "New case study | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function NewCaseStudyPage() {
  const { services, industries, editorFields } = await loadCaseStudyOptions();

  return (
    <div>
      <Link
        href="/admin/case-studies"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
        Case studies
      </Link>

      <h1 className="mt-5 text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
        New case study
      </h1>

      <div className="mt-8">
        <CaseStudyForm services={services} industries={industries} editorFields={editorFields} />
      </div>
    </div>
  );
}
