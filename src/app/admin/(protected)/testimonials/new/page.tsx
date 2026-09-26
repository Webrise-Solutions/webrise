import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { TestimonialForm } from "../TestimonialForm";

export const metadata: Metadata = {
  title: "New testimonial | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function NewTestimonialPage() {
  const { data: services } = await supabaseAdmin
    .from("services")
    .select("id, name")
    .order("sort_order");

  return (
    <div>
      <Link
        href="/admin/testimonials"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
        Testimonials
      </Link>

      <h1 className="mt-5 text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
        New testimonial
      </h1>

      <div className="mt-8">
        <TestimonialForm services={services ?? []} />
      </div>
    </div>
  );
}
