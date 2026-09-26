"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { serviceClusters, services } from "@/data/site";

/**
 * How long to let the panel fade before navigating away.
 *
 * Slightly under the 200ms transition on purpose: the last frames of the fade
 * overlap the new page's first paint, so the menu reads as closing rather than
 * as a delay before anything happens.
 */
const CLOSE_MS = 180;

const grouped = serviceClusters.map((group) => ({
  ...group,
  items: services.filter((service) => service.cluster === group.cluster),
}));

/**
 * The clusters are not evenly sized — five services sit under SEO and one under
 * Growth — so an equal three-column grid leaves the short column looking
 * broken. The call to action goes under whichever column has the fewest items,
 * found rather than hardcoded so it stays right as services are added.
 */
const ctaCluster = grouped.reduce((shortest, group) =>
  group.items.length < shortest.items.length ? group : shortest,
).cluster;

/**
 * Desktop-only Services dropdown.
 *
 * Opens on hover for pointer users and on click/Enter for everyone else, so it
 * is reachable by keyboard without a hover trap. The close-on-blur check uses
 * relatedTarget rather than a document listener: the panel and its trigger sit
 * in one wrapper, so anything leaving that wrapper should close it.
 *
 * The panel is positioned against the header's own max-width container, not
 * against this trigger — the trigger sits near the left edge, so centring a
 * wide panel on it pushed most of the panel off the side of the screen.
 */
export function ServicesMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // A short delay on leave keeps the menu usable while the pointer crosses the
  // gap between the trigger and the panel.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(
    () => () => {
      cancelClose();
      if (navTimer.current) clearTimeout(navTimer.current);
    },
    [],
  );

  /**
   * Close, then navigate.
   *
   * Every page renders its own `<Header />`, so a route change unmounts this
   * component entirely — the panel's DOM node is gone before a CSS transition
   * on it could run, which is why clicking an item used to snap shut while
   * hovering away faded. Holding the navigation for the length of the fade is
   * what makes the two behave the same.
   */
  const closeThenNavigate = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    // Modifier and middle clicks open new tabs. Hijacking those would be a
    // worse bug than the one this fixes, so let the browser have them.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    setOpen(false);

    // Nothing to wait for if the fade is not going to happen.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    if (navTimer.current) clearTimeout(navTimer.current);
    navTimer.current = setTimeout(() => router.push(href), CLOSE_MS);
  };

  return (
    <div
      ref={wrapper}
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onBlur={(event) => {
        if (!wrapper.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="services-menu"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[15px] font-medium text-ink hover:bg-teal-soft"
      >
        Services
        <Icon
          name="chevron-down"
          size={15}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Kept mounted and toggled with classes rather than conditionally
          rendered, so closing can fade instead of blinking out — an unmount
          has nothing left to animate. `invisible` (not just opacity-0) is what
          takes the closed panel out of the tab order and stops it swallowing
          clicks; because `visible` is special-cased in transitions, it holds
          until the fade finishes rather than cutting it short.

          Left-aligned to the header's content column and capped, so it lines
          up with the logo and can never run off either edge. */}
      <div
        id="services-menu"
        aria-hidden={!open}
        className={`absolute left-6 top-[calc(100%+10px)] w-[calc(100%-48px)] max-w-[940px] rounded-3xl border border-line-soft bg-white p-7 shadow-panel transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none sm:left-10 sm:w-[calc(100%-80px)] ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="grid grid-cols-3 gap-x-7">
          {grouped.map((group, index) => (
            <div
              key={group.cluster}
              className={index === 0 ? "" : "border-l border-line-soft pl-7"}
            >
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-teal">
                {group.label}
              </h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                {group.blurb}
              </p>

              <ul className="mt-3.5 grid gap-0.5">
                {group.items.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      onClick={closeThenNavigate(`/services/${service.slug}`)}
                      className="group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-offwhite"
                    >
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-teal-soft text-teal">
                        <Icon name={service.icon} size={17} />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink">
                        {service.name}
                      </span>
                      <Icon
                        name="arrow-right"
                        size={14}
                        className="flex-none text-teal opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              {group.cluster === ctaCluster ? (
                <Link
                  href="/audit"
                  onClick={closeThenNavigate("/audit")}
                  className="mt-4 block rounded-2xl border border-line bg-sand p-4 transition-colors hover:border-teal hover:bg-teal-soft"
                >
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                    <Icon name="audit" size={16} className="shrink-0 text-teal" />
                    Not sure where to start?
                  </span>
                  <span className="mt-1.5 block text-[12.5px] leading-relaxed text-muted-foreground">
                    Send us your site and we will tell you which of these would move the needle
                    first.
                  </span>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-teal">
                    Get a free audit
                    <Icon name="arrow-right" size={14} className="shrink-0" />
                  </span>
                </Link>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4">
          <Link
            href="/services"
            onClick={closeThenNavigate("/services")}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-teal hover:text-teal-dark"
          >
            View all services
            <Icon name="arrow-right" size={15} className="shrink-0" />
          </Link>
          <Link
            href="/pricing"
            onClick={closeThenNavigate("/pricing")}
            className="text-[14px] font-medium text-muted-foreground hover:text-teal"
          >
            How pricing works
          </Link>
        </div>
      </div>
    </div>
  );
}
