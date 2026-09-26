"use client";

import { useState } from "react";
import Link from "next/link";
import { ActionLink } from "@/components/ui/action";
import { HomeLink } from "@/components/shared/HomeLink";
import { Icon } from "@/components/shared/Icon";
import { Logo } from "@/components/shared/Logo";
import { ServicesMenu } from "@/components/layout/ServicesMenu";
import { navLinks, contact, serviceClusters, services } from "@/data/site";
import { cn } from "@/lib/utils";

// Services gets its own dropdown, so it is dropped from the flat link list.
const secondaryLinks = navLinks.filter((link) => link.href !== "/services");

const mobileServiceGroups = serviceClusters.map((group) => ({
  ...group,
  items: services.filter((service) => service.cluster === group.cluster),
}));

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const close = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="sticky top-0 z-[200] border-b border-line bg-cream/85 backdrop-blur-[10px] backdrop-saturate-150">
      {/* `relative` makes this the positioning context for the Services panel,
          so the dropdown lines up with the content column instead of being
          centred on its own trigger over near the logo. */}
      <div className="relative mx-auto flex max-w-[1200px] items-center gap-4 px-6 py-3.5 sm:px-10 lg:gap-6">
        <HomeLink className="flex items-center" aria-label="Webrise home">
          <Logo className="block h-auto w-[130px] sm:w-[150px]" />
        </HomeLink>

        <nav aria-label="Primary" className="ml-2 hidden items-center gap-1 lg:flex">
          <ServicesMenu />
          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-[15px] font-medium text-ink hover:bg-teal-soft hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={contact.phoneHref}
            className="hidden items-center gap-2 text-[15px] font-medium text-ink hover:text-teal xl:inline-flex"
          >
            <Icon name="phone" size={18} className="shrink-0" />
            Talk to us
          </a>
          <ActionLink href="/book-a-call" size="sm" className="hidden sm:inline-flex">
            Book a Call
          </ActionLink>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-white text-ink lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current transition-opacity duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-cream px-6 pb-6 pt-2 lg:hidden"
        >
          <nav aria-label="Mobile" className="grid gap-1">
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-controls="mobile-services"
              onClick={() => setServicesOpen((value) => !value)}
              className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-ink hover:bg-teal-soft"
            >
              Services
              <Icon
                name="chevron-down"
                size={17}
                className={cn(
                  "shrink-0 transition-transform duration-200",
                  servicesOpen && "rotate-180",
                )}
              />
            </button>

            {servicesOpen ? (
              <div id="mobile-services" className="mb-1 grid gap-4 px-3 pb-2">
                {mobileServiceGroups.map((group) => (
                  <div key={group.cluster}>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-teal">
                      {group.label}
                    </p>
                    <ul className="mt-1.5 grid gap-0.5 border-l border-line pl-3">
                      {group.items.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`/services/${service.slug}`}
                            onClick={close}
                            className="block rounded-lg px-2 py-2 text-[14px] text-ink hover:bg-teal-soft"
                          >
                            {service.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link
                  href="/services"
                  onClick={close}
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-teal"
                >
                  View all services
                  <Icon name="arrow-right" size={15} className="shrink-0" />
                </Link>
              </div>
            ) : null}

            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="rounded-lg px-3 py-3 text-[15px] font-medium text-ink hover:bg-teal-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 grid gap-3 sm:hidden">
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-2 px-3 text-[15px] font-medium text-ink"
            >
              <Icon name="phone" size={18} className="shrink-0" />
              Talk to us
            </a>
            <ActionLink href="/book-a-call" size="sm" onClick={close}>
              Book a Call
            </ActionLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
