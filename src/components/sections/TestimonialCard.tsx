import { Icon } from "@/components/shared/Icon";

export type Testimonial = {
  id: string;
  client_name: string;
  client_company: string | null;
  quote: string;
  rating: number | null;
  avatar_url: string | null;
};

/** Initials stand in for a missing avatar — better than a grey silhouette. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return null;
  const value = Math.max(1, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: value }).map((_, index) => (
        <Icon
          key={index}
          name="star"
          size={15}
          className="text-orange"
          style={{ fill: "currentColor" }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/**
 * Deliberately not a Client Component: it is pure presentation, so it can be
 * rendered straight from a Server Component on the service pages and pulled
 * into the client bundle by the homepage carousel, without two copies drifting
 * apart.
 */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/70 bg-white p-6 shadow-[0_18px_55px_rgba(5,24,25,0.16)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(5,24,25,0.24)] sm:p-7">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--orange),var(--teal),transparent)]" />

      <div className="flex items-center justify-between gap-4">
        <Stars rating={testimonial.rating} />
        <span
          aria-hidden="true"
          className="font-serif text-[52px] leading-[0.65] text-teal/15 transition-colors duration-300 group-hover:text-teal/25"
        >
          “
        </span>
      </div>

      <blockquote className="mt-5 flex-1 text-[16px] font-medium leading-[1.7] tracking-[-0.01em] text-ink">
        {testimonial.quote}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3.5 rounded-2xl bg-offwhite p-3">
        {testimonial.avatar_url ? (
          <img
            src={testimonial.avatar_url}
            alt=""
            className="h-12 w-12 flex-none rounded-full border-2 border-white object-cover shadow-sm"
          />
        ) : (
          <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-teal text-[14px] font-semibold text-white shadow-sm">
            {initials(testimonial.client_name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold tracking-[-0.01em] text-ink">
            {testimonial.client_name}
          </p>
          {testimonial.client_company ? (
            <p className="truncate text-[13px] text-muted-foreground">
              {testimonial.client_company}
            </p>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
