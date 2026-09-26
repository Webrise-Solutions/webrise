import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActionLink } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { CallRequestForm } from "./CallRequestForm";
import { contact, siteUrl, whatsappLink } from "@/data/site";

const title = "Book a Call | Webrise";
const description =
  "Book a 30-minute call with a senior SEO specialist. No pitch deck, no junior account manager.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/book-a-call" },
  openGraph: { title, description, type: "website", url: `${siteUrl}/book-a-call` },
};

/**
 * Booking URL from Cal.com, Calendly or similar.
 *
 * Read from the environment rather than hardcoded so the page ships before the
 * scheduling tool is chosen: with it set the calendar embeds, without it the
 * page still works and offers the direct channels instead of showing an empty
 * frame or a dead button.
 */
const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

const expectations = [
  "Thirty minutes, and we keep to it",
  "You talk, we ask questions, nobody presents slides",
  "A senior specialist, not an account manager reading a script",
  "You leave with two or three things worth doing, whether or not you hire us",
];

export default function BookACallPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="mx-auto max-w-[1200px] px-6 pb-0 pt-8 sm:px-10">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
            All the ways to reach us
          </Link>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-[clamp(40px,5vw,80px)] sm:px-10">
          <div className="grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
                <Icon name="clock" size={15} className="shrink-0" />
                Book a call
              </span>

              <h1 className="mt-5 max-w-[16ch] text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.08] tracking-[-0.02em]">
                Half an hour, straight answers
              </h1>

              <div className="mt-[22px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />

              <ul className="mt-8 grid gap-3.5">
                {expectations.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-ink">
                    <span className="mt-0.5 grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-teal-soft text-teal">
                      <Icon name="check" size={15} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-line bg-sand px-5 py-4">
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Know what you need already?{" "}
                  <Link
                    href="/get-a-quote"
                    className="font-semibold text-teal hover:text-teal-dark"
                  >
                    Request a quote
                  </Link>{" "}
                  and skip the call.
                </p>
              </div>
            </div>

            {bookingUrl ? (
              <div className="overflow-hidden rounded-3xl border border-line-soft bg-white shadow-panel">
                <iframe
                  src={bookingUrl}
                  title="Book a call with Webrise"
                  className="h-[720px] w-full border-0"
                  loading="lazy"
                />
              </div>
            ) : (
              /* No scheduling tool connected yet, so WhatsApp is the booking
                 path: it is the fastest way to agree a time with a real
                 person, and it opens the desktop app or WhatsApp Web when
                 there is no phone involved. The form stays underneath for
                 anyone who does not use WhatsApp, which on a B2B site is a
                 real share of visitors, not an edge case. */
              <div className="rounded-3xl border border-line-soft bg-white p-[clamp(24px,3vw,40px)] shadow-panel">
                <h2 className="text-[19px] font-semibold text-ink">Message us and pick a time</h2>
                <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
                  The quickest way in. Send us a message and we will agree a slot with you there and
                  then, usually within the hour on a working day.
                </p>

                <ActionLink
                  href={whatsappLink(
                    "Hi Webrise, I would like to book a 30-minute call. When are you free?",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  className="mt-6 w-full rounded-xl"
                >
                  <Icon name="whatsapp" size={20} className="shrink-0" />
                  Chat on WhatsApp
                </ActionLink>

                <p className="mt-3 text-center text-[13px] text-muted-foreground">
                  Opens WhatsApp with your first message ready. Edit it before you send.
                </p>

                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  <a
                    href={`mailto:${contact.email}?subject=${encodeURIComponent("Booking a call")}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-teal hover:text-teal"
                  >
                    <Icon name="mail" size={17} className="shrink-0" />
                    Email us
                  </a>
                  <a
                    href={contact.phoneHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-teal hover:text-teal"
                  >
                    <Icon name="phone" size={17} className="shrink-0" />
                    {contact.phone}
                  </a>
                </div>

                <details className="group mt-6 border-t border-line-soft pt-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 text-[14px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    Not on WhatsApp? Send your details instead
                    <Icon
                      name="chevron-down"
                      size={17}
                      className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <div className="mt-5">
                    <CallRequestForm />
                  </div>
                </details>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
