import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { TestimonialForm } from "../TestimonialForm";

export const metadata: Metadata = {
  title: "Edit testimonial | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function EditTestimonialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;

  const [{ data: testimonial, error }, { data: services }] = await Promise.all([
    supabaseAdmin.from("testimonials").select("*").eq("id", id).maybeSingle(),
    supabaseAdmin.from("services").select("id, name").order("sort_order"),
  ]);

  if (error) console.error("[admin/testimonials] load failed", error);
  if (!testimonial) notFound();

  return (
    <div>
      <Link
        href="/admin/testimonials"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
        Testimonials
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
          {testimonial.client_name}
        </h1>
        {testimonial.featured ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklch,var(--orange)_14%,white)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-rust">
            <Icon name="star" size={11} />
            Featured
          </span>
        ) : null}
      </div>

      <div className="mt-8">
        <TestimonialForm
          testimonial={testimonial}
          services={services ?? []}
          {...(created ? { justCreated: true } : {})}
        />
      </div>
    </div>
  );
}
