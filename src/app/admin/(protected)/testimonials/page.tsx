import type { Metadata } from "next";
import Link from "next/link";
import { ActionLink } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { EmptyState } from "@/components/admin/fields";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const metadata: Metadata = {
  title: "Testimonials | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function AdminTestimonialsPage() {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("id, client_name, client_company, quote, rating, featured, avatar_url, services(name)")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  const testimonials = data ?? [];
  const featured = testimonials.filter((item) => item.featured).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
            Testimonials
          </h1>
          <p className="mt-2 text-muted-foreground">
            {testimonials.length} total, {featured} featured
          </p>
        </div>
        <ActionLink href="/admin/testimonials/new" size="sm">
          <Icon name="plus" size={16} className="shrink-0" />
          New testimonial
        </ActionLink>
      </div>

      {/* No draft state exists for this table, so say so where it matters. */}
      <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-line bg-sand px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
        <Icon name="shield-lock" size={16} className="mt-0.5 shrink-0" />
        Everything here is publicly readable the moment it is saved. Delete rather than unpublish.
      </p>

      <div className="mt-6">
        {error ? (
          <EmptyState
            title="Could not load testimonials"
            description={`The testimonials table returned an error: ${error.message}`}
          />
        ) : testimonials.length === 0 ? (
          <EmptyState
            title="No testimonials yet"
            description="Add the first one. Only use quotes you have permission to publish."
            action={
              <ActionLink href="/admin/testimonials/new" size="sm">
                <Icon name="plus" size={16} className="shrink-0" />
                New testimonial
              </ActionLink>
            }
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {testimonials.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/testimonials/${item.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-line-soft bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
                >
                  <div className="flex items-center justify-between gap-3">
                    {item.rating ? (
                      <span
                        className="flex gap-0.5 text-[#F5B841]"
                        aria-label={`Rated ${item.rating} out of 5`}
                      >
                        {Array.from({ length: item.rating }).map((_, index) => (
                          <Icon key={index} name="star" size={14} />
                        ))}
                      </span>
                    ) : (
                      <span className="text-[12px] text-muted-foreground">No rating</span>
                    )}

                    {item.featured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklch,var(--orange)_14%,white)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-rust">
                        <Icon name="star" size={11} />
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-ink">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <div className="mt-auto flex items-center gap-3 pt-4">
                    {item.avatar_url ? (
                      <img
                        src={item.avatar_url}
                        alt=""
                        className="h-10 w-10 flex-none rounded-full border border-line-soft object-cover"
                      />
                    ) : (
                      <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-teal-soft text-teal">
                        <Icon name="users" size={18} />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                        {item.client_name}
                        <Icon
                          name="arrow-right"
                          size={14}
                          className="text-teal opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      </p>
                      <p className="truncate text-[13px] text-muted-foreground">
                        {[item.client_company, item.services?.name].filter(Boolean).join(" · ") ||
                          "No company"}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
