"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { TestimonialCard, type Testimonial } from "@/components/sections/TestimonialCard";

/**
 * Testimonial carousel.
 *
 * Built on native scroll-snap rather than a transform-driven slider, which
 * buys three things for free: it scrolls and swipes with no JavaScript at all,
 * the browser handles momentum and touch, and arrow keys work because the
 * track is a real scroll container.
 *
 * There is no auto-advance. A carousel that moves on its own takes the quote
 * away mid-sentence, and is the single reason carousels have the reputation
 * they do. Everything here moves because somebody asked it to.
 */
export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [overflows, setOverflows] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  // The furthest card that can actually reach the left edge. With five cards
  // and three visible the track runs out of scroll at the third, so rendering
  // a dot per card would leave two that can never become active.
  const [maxIndex, setMaxIndex] = useState(0);

  /** One card plus one gap: the distance a single "next" should travel. */
  const step = useCallback(() => {
    const el = track.current;
    if (!el) return 0;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return el.clientWidth;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    return first.offsetWidth + gap;
  }, []);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;

    // A one-pixel tolerance: fractional widths mean scrollLeft rarely lands
    // exactly on the maximum, which would leave "next" enabled at the end.
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 1);
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);

    const width = step();
    const furthest = width > 0 ? Math.round(max / width) : 0;
    setMaxIndex(furthest);
    setActive(width > 0 ? Math.min(Math.round(el.scrollLeft / width), furthest) : 0);
  }, [step]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    sync();
    el.addEventListener("scroll", sync, { passive: true });

    // Card widths are percentage-based, so a resize changes both the step and
    // whether the track overflows at all.
    const observer = new ResizeObserver(sync);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  const scrollToIndex = (index: number) => {
    const el = track.current;
    if (!el) return;

    const target = Math.max(0, Math.min(index, maxIndex));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: target * step(), behavior: reduced ? "auto" : "smooth" });
  };

  const nudge = (direction: -1 | 1) => scrollToIndex(active + direction);

  return (
    <div className="relative mt-12">
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Client testimonials"
        className="flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto px-0.5 pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-soft [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((testimonial) => (
          <li
            key={testimonial.id}
            // Basis rather than width so the flex item cannot be squeezed:
            // three across on desktop, two on tablet, and a peek of the next
            // card on mobile so it reads as scrollable without instruction.
            className="w-[85%] flex-none snap-start sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)]"
          >
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>

      {/* Controls are pointless when everything already fits, so they only
          appear once the track actually overflows. */}
      {overflows ? (
        <div className="mt-7 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label="Previous testimonial"
            className="grid h-11 w-11 flex-none place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-teal-soft hover:bg-white hover:text-teal disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:bg-white/[0.06] disabled:hover:text-white"
          >
            <Icon name="arrow-right" size={18} className="rotate-180" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to testimonial ${index + 1} of ${testimonials.length}`}
                aria-current={index === active ? "true" : undefined}
                className={`h-2 rounded-full transition-[width,background-color] duration-200 ${
                  index === active ? "w-6 bg-orange" : "w-2 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label="Next testimonial"
            className="grid h-11 w-11 flex-none place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-teal-soft hover:bg-white hover:text-teal disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:bg-white/[0.06] disabled:hover:text-white"
          >
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
