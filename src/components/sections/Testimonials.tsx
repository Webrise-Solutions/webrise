import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { TestimonialCard } from "@/components/sections/TestimonialCard";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";

const FIELDS = "id, client_name, client_company, quote, rating, avatar_url";

/**
 * Homepage social proof band.
 *
 * Featured first, then whatever else is there, so the flag decides the running
 * order without an unticked box emptying the section. Renders nothing when
 * there are no testimonials at all — an empty "what clients say" is worse than
 * no section.
 *
 * The limit is generous because the carousel is what handles overflow now:
 * capping at three would defeat the point of having one.
 */
export async function Testimonials({ limit = 12 }: { limit?: number }) {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select(FIELDS)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[testimonials] load failed", error);
    return null;
  }

  const testimonials = data ?? [];
  if (testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-night">
      <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-teal/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-28 h-80 w-80 rounded-full bg-orange/10 blur-3xl" />
      <div className="mx-auto max-w-[1200px] px-4 py-[clamp(48px,6vw,96px)] sm:px-6 md:px-10">
        <div className="relative grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              Client stories
            </span>
            <h2 className="mt-5 max-w-[18ch] text-[clamp(2rem,1.35rem+2vw,3rem)] leading-[1.08] tracking-[-0.03em] text-cream">
              Trusted partnerships, told in their words
            </h2>
            <div className="mt-5 h-1 w-[160px] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
          </div>
          <p className="max-w-[50ch] text-[15px] leading-relaxed text-white/60 lg:justify-self-end lg:pb-1">
            The clearest measure of our work is what clients say after the strategy, build, and
            launch are complete.
          </p>
        </div>

        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}

/**
 * Testimonials on a service page.
 *
 * Scoped strictly to this service — never topped up from elsewhere. A quote
 * about local SEO sitting under "what clients say about this service" on the
 * TikTok Shop page would be a claim we cannot support, so a service with no
 * testimonial yet simply shows none.
 *
 * Stays a plain grid: at most two quotes, which is not enough to be worth
 * putting behind controls.
 */
export async function ServiceTestimonials({ serviceId }: { serviceId: string }) {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select(FIELDS)
    .eq("service_id", serviceId)
    .order("featured", { ascending: false })
    .limit(2);

  if (error) {
    console.error("[testimonials] service load failed", error);
    return null;
  }

  const testimonials = data ?? [];
  if (testimonials.length === 0) return null;

  return (
    <section className="mt-[clamp(40px,5vw,72px)]">
      <h2 className="text-[17px] font-semibold text-ink">What clients say about this service</h2>
      <ul
        className={`mt-4 grid gap-5 ${testimonials.length > 1 ? "md:grid-cols-2" : "max-w-[640px]"}`}
      >
        {testimonials.map((testimonial) => (
          <li key={testimonial.id}>
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>
    </section>
  );
}
