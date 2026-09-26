import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { ServiceForm } from "../ServiceForm";

export const metadata: Metadata = {
  title: "Edit service | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;

  const { data: service, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) console.error("[admin/services] load failed", error);
  if (!service) notFound();

  return (
    <div>
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
        Services
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
          {service.name}
        </h1>
        {/* Plain anchor: this leaves the admin for the public site. */}
        <a
          href={`/services/${service.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[13px] font-semibold text-teal hover:bg-teal-soft"
        >
          View page
          <Icon name="arrow-right" size={14} className="shrink-0 -rotate-45" />
        </a>
      </div>

      <div className="mt-8">
        <ServiceForm service={service} {...(created ? { justCreated: true } : {})} />
      </div>
    </div>
  );
}
