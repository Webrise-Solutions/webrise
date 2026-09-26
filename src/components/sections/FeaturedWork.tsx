import { ActionLink } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { FeaturedWorkCarousel } from "./FeaturedWorkCarousel";

/**
 * Homepage "featured work" band.
 *
 * `case_studies.featured` existed and nothing read it, so ticking the box in
 * the admin did nothing. This is what the flag is for.
 *
 * Falls back to the most recent published studies when nothing is flagged: an
 * editor forgetting to tick a box should not silently empty a homepage
 * section. When there is genuinely nothing published, it renders nothing at
 * all rather than an empty state — a marketing homepage should not advertise
 * that it has no work to show.
 */
export async function FeaturedWork() {
  const { data, error } = await supabaseAdmin
    .from("case_studies")
    .select("id, slug, title, cover_image_url, services(name)")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(9);

  if (error) {
    console.error("[featured-work] load failed", error);
    return null;
  }

  const studies = data ?? [];
  if (studies.length === 0) return null;

  return (
    <section className="border-y border-line bg-sand">
      <div className="mx-auto max-w-[1200px] px-4 py-[clamp(48px,6vw,96px)] sm:px-6 md:px-10">
        <div className="grid gap-x-[clamp(24px,4vw,64px)] gap-y-5 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
              Selected work
            </span>
            <h2 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
              What the work actually looks like
            </h2>
            <div className="mt-[18px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
          </div>
          <p className="max-w-[52ch] text-muted-foreground lg:pb-1">
            The problem the business had, what we changed, and what moved. Written up in full, not
            trimmed to the flattering numbers.
          </p>
        </div>

        <FeaturedWorkCarousel
          studies={studies.map((study) => ({
            id: study.id,
            slug: study.slug,
            title: study.title,
            cover_image_url: study.cover_image_url,
            service_name: study.services?.name ?? null,
          }))}
        />

        <div className="mt-10 flex justify-center">
          <ActionLink href="/work" variant="outline" size="lg">
            See all our work
            <Icon name="arrow-right" size={18} className="shrink-0" />
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
