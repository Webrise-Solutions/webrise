import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { Logo } from "@/components/shared/Logo";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import {
  contact,
  footerCompany,
  footerLegal,
  footerResources,
  footerServices,
  footerTrust,
  socials,
} from "@/data/site";

// Only profiles with a real URL. See the `socials` comment in src/data/site.ts.
const liveSocials = socials.filter((social) => social.href);

const columns = [
  { heading: "Services", links: footerServices },
  { heading: "Company", links: footerCompany },
  { heading: "Resources", links: footerResources },
  { heading: "Legal", links: footerLegal },
];

export function Footer() {
  return (
    <footer className="mt-[clamp(48px,6vw,88px)] bg-night text-mint">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="grid gap-8 border-b border-white/8 py-[clamp(32px,4vw,52px)] sm:grid-cols-2 lg:grid-cols-4">
          {footerTrust.map((item) => (
            <div key={item.title} className="flex items-start gap-3.5">
              <span
                className={`grid h-11 w-11 flex-none place-items-center rounded-xl ${
                  item.tone === "teal"
                    ? "bg-[color-mix(in_oklch,var(--mint)_16%,transparent)] text-mint"
                    : "bg-[color-mix(in_oklch,var(--orange)_18%,transparent)] text-orange"
                }`}
              >
                <Icon name={item.icon} size={22} />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-cream">{item.title}</h3>
                <p className="mt-1 text-[13px] text-mint">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-10 py-[clamp(36px,4vw,60px)] md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_0.85fr] lg:gap-8">
          <div className="md:col-span-2 lg:col-span-1">
            <Logo className="block h-auto w-[160px] text-cream" title="Webrise" />
            <p className="mt-4 max-w-[38ch] text-sm text-mint">
              Senior-led, white-hat SEO for ambitious businesses. We build visibility that lasts, in
              search engines and AI assistants alike.
            </p>

            <ul className="mt-5 grid gap-3 text-sm">
              <li className="flex items-start gap-3">
                <Icon name="mail" size={17} className="mt-0.5 flex-none text-orange" />
                <a href={`mailto:${contact.email}`} className="text-mint hover:text-orange">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="phone" size={17} className="mt-0.5 flex-none text-orange" />
                <a href={contact.phoneHref} className="text-mint hover:text-orange">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="globe" size={17} className="mt-0.5 flex-none text-orange" />
                <span className="max-w-[34ch] text-mint">{contact.address}</span>
              </li>
            </ul>

            {liveSocials.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {liveSocials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={social.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/5 text-[13px] font-semibold text-cream transition-colors hover:border-orange hover:bg-orange hover:text-white"
                  >
                    {social.tag}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-cream">
                {column.heading}
              </h3>
              <ul className="mt-4 grid gap-2.5">
                {column.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-mint hover:text-orange">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="grid gap-6 border-t border-white/8 py-[clamp(28px,3vw,40px)] lg:grid-cols-[1fr_minmax(0,460px)] lg:items-center lg:gap-10">
          <div>
            <h3 className="text-[15px] font-semibold text-cream">
              What we are seeing in search, once a month
            </h3>
            <p className="mt-1.5 max-w-[52ch] text-[13px] leading-relaxed text-mint">
              Short notes on what is actually moving rankings and AI citations. Written by the
              people doing the work.
            </p>
          </div>
          <NewsletterForm tone="dark" sourcePage="/footer" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 py-6 text-[13px] text-mint">
          <span>© {new Date().getFullYear()} Webrise Ltd. All rights reserved.</span>
          <span>{contact.reach}. Registered in England &amp; Wales.</span>
        </div>
      </div>
    </footer>
  );
}
