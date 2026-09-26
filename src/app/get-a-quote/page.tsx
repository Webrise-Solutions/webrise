import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Icon } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { contact, siteUrl } from "@/data/site";
import { QuoteForm } from "./QuoteForm";

const title = "Get a Quote | Webrise";
const description =
  "Tell us what you need and we will come back with a scoped, written quote within one working day.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/get-a-quote" },
  openGraph: { title, description, type: "website", url: `${siteUrl}/get-a-quote` },
};

export const revalidate = 300;

const reassurance: { icon: Parameters<typeof Icon>[0]["name"]; title: string; body: string }[] = [
  {
    icon: "clock",
    title: "One working day",
    body: "A senior specialist reads every request. No sales sequence, no chasing.",
  },
  {
    icon: "check-circle",
    title: "Scoped before priced",
    body: "We ask what we need to ask first. A number without scope is a guess.",
  },
  {
    icon: "shield-lock",
    title: "No lock-in",
    body: "Quotes are for defined work. You are not signing up to a rolling contract.",
  },
];

export default async function GetAQuotePage() {
  const { data: services, error } = await supabaseAdmin
    .from("services")
    .select("id, name, cluster")
    .order("sort_order");

  if (error) console.error("[get-a-quote] services failed", error);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="mx-auto max-w-[1200px] px-6 pb-0 pt-8 sm:px-10">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
            How pricing works
          </Link>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-[clamp(40px,5vw,80px)] sm:px-10">
          <div className="grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
                <Icon name="briefcase" size={15} className="shrink-0" />
                Get a quote
              </span>

              <h1 className="mt-5 max-w-[16ch] text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.08] tracking-[-0.02em]">
                Tell us what you need
              </h1>

              <div className="mt-[22px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />

              <p className="mt-[22px] max-w-[46ch] text-[clamp(1rem,0.95rem+0.3vw,1.125rem)] text-muted-foreground">
                The more you tell us here, the closer the first number will be. If you would rather
                talk it through, that works too.
              </p>

              <ul className="mt-8 grid gap-5">
                {reassurance.map((item) => (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-teal-soft text-teal">
                      <Icon name={item.icon} size={21} />
                    </span>
                    <div>
                      <h2 className="text-[15px] font-semibold text-ink">{item.title}</h2>
                      <p className="mt-1 max-w-[40ch] text-[14px] leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-line bg-sand px-5 py-4">
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Prefer to speak first?{" "}
                  <Link
                    href="/book-a-call"
                    className="font-semibold text-teal hover:text-teal-dark"
                  >
                    Book a call
                  </Link>{" "}
                  or message us on{" "}
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-teal hover:text-teal-dark"
                  >
                    WhatsApp
                  </a>
                  .
                </p>
              </div>
            </div>

            <QuoteForm services={services ?? []} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
