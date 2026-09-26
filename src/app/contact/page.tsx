import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActionLink } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import type { IconName } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { contact } from "@/data/site";
import { ContactForm } from "./ContactForm";

const title = "Contact Us | Webrise";
const description = "Get in touch with Webrise for inquiries about our SEO services.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title, description, type: "website" },
};

export const revalidate = 300;

const channels: {
  icon: IconName;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  tone: "teal" | "rust";
}[] = [
  {
    icon: "mail",
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
    tone: "teal",
  },
  {
    icon: "whatsapp",
    label: "WhatsApp",
    value: "Message us and get a same-day reply",
    href: contact.whatsappHref,
    external: true,
    tone: "rust",
  },
  {
    icon: "phone",
    label: "Phone",
    value: contact.phone,
    href: contact.phoneHref,
    tone: "teal",
  },
];

const panelFacts: { icon: IconName; label: string; value: string }[] = [
  { icon: "clock", label: "Reply time", value: "Within one working day" },
  { icon: "globe", label: "Coverage", value: contact.reach },
  { icon: "users", label: "Who answers", value: "A senior specialist, not a bot" },
];

export default async function ContactPage() {
  // Tagging an enquiry with the service it is about is what makes the leads
  // list sortable by what people actually want.
  const { data: services, error } = await supabaseAdmin
    .from("services")
    .select("id, name")
    .order("sort_order");

  if (error) console.error("[contact] services lookup failed", error);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="mx-auto max-w-[1200px] px-6 pb-0 pt-8 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
            Back to home
          </Link>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-[clamp(48px,6vw,96px)] sm:px-10">
          <div className="grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
                <Icon name="mail" size={15} className="shrink-0" />
                Contact
              </span>

              <h1 className="mt-5 text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.08] tracking-[-0.02em]">
                Get in touch
              </h1>

              <div className="my-[26px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />

              <p className="max-w-[46ch] text-[clamp(1rem,0.95rem+0.3vw,1.125rem)] text-muted-foreground">
                Questions about our SEO services, or ready to talk through a project? Write to us
                here, or pick whichever channel suits you. Every message reaches the team that would
                actually do the work.
              </p>

              <div className="mt-9">
                <ContactForm services={services ?? []} />
              </div>
            </div>

            <div className="grid gap-[clamp(24px,3vw,32px)]">
              <div className="overflow-hidden rounded-3xl border border-line-soft bg-white shadow-card">
                {channels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 border-b border-line-soft px-5 py-[18px] transition-colors last:border-b-0 hover:bg-offwhite sm:gap-5 sm:px-6 sm:py-5"
                  >
                    <span
                      className={`grid h-12 w-12 flex-none place-items-center rounded-2xl transition-transform duration-200 group-hover:scale-105 sm:h-14 sm:w-14 ${
                        channel.tone === "teal"
                          ? "bg-teal-soft text-teal"
                          : "bg-[color-mix(in_oklch,var(--orange)_14%,white)] text-rust"
                      }`}
                    >
                      <Icon name={channel.icon} size={24} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        {channel.label}
                      </span>
                      <span className="mt-1 block truncate text-[15px] font-semibold text-ink sm:text-base">
                        {channel.value}
                      </span>
                    </span>

                    <Icon
                      name="arrow-right"
                      size={18}
                      className="shrink-0 text-input-line transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-teal"
                    />
                  </a>
                ))}
              </div>

              <aside className="overflow-hidden rounded-3xl bg-[radial-gradient(120%_140%_at_15%_10%,color-mix(in_oklch,var(--teal-dark)_45%,var(--night)),var(--night)_55%)] p-[clamp(28px,4vw,44px)] shadow-dark">
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-mint">
                  Where to find us
                </span>
                <p className="mt-4 text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-[1.5] text-cream">
                  {contact.address}
                </p>

                <dl className="mt-8 rounded-[18px] border border-teal-soft/15 bg-white/[0.03] px-6 py-2">
                  {panelFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-center gap-4 border-b border-teal-soft/10 py-[18px] last:border-b-0"
                    >
                      <span className="grid h-11 w-11 flex-none place-items-center rounded-[14px] bg-[color-mix(in_oklch,var(--mint)_16%,transparent)] text-mint">
                        <Icon name={fact.icon} size={22} />
                      </span>
                      <div>
                        <dt className="text-[13px] text-mint">{fact.label}</dt>
                        <dd className="mt-0.5 text-[15px] font-semibold text-cream">
                          {fact.value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <ActionLink href="/audit" size="lg" className="mt-8 w-full rounded-xl">
                  Get your free audit
                  <Icon name="arrow-right" size={18} className="shrink-0" />
                </ActionLink>
                <p className="mt-3.5 text-center text-[13px] text-mint">
                  No lock-in contracts. No obligation.
                </p>
              </aside>
            </div>
          </div>

          <div className="mt-[clamp(32px,4vw,56px)] flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-sand px-6 py-5">
            <p className="max-w-[60ch] text-sm text-muted-foreground">
              <strong className="font-semibold text-ink">Already have a question in mind?</strong>{" "}
              Our FAQ covers pricing, timelines and what the first month looks like.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-dark"
            >
              Read the FAQ
              <Icon name="arrow-right" size={16} className="shrink-0" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
