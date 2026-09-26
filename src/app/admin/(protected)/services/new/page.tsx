import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { ServiceForm } from "../ServiceForm";

export const metadata: Metadata = {
  title: "New service | Webrise Admin",
  robots: { index: false, follow: false },
};

export default function NewServicePage() {
  return (
    <div>
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
        Services
      </Link>

      <h1 className="mt-5 text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
        New service
      </h1>

      <div className="mt-8">
        <ServiceForm />
      </div>
    </div>
  );
}
