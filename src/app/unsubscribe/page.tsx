import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Icon } from "@/components/shared/Icon";
import { contact } from "@/data/site";
import { UnsubscribeForm } from "./UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe | Webrise",
  // A one-off link out of an email has no business in search results.
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="mx-auto grid max-w-[560px] px-6 py-[clamp(48px,7vw,110px)] sm:px-10">
          <div className="rounded-3xl border border-line-soft bg-white p-[clamp(24px,3vw,40px)] shadow-card">
            {token ? (
              <UnsubscribeForm token={token} />
            ) : (
              /* No token means the link was truncated somewhere between our
                 sending it and their clicking it, which is common enough in
                 mail clients to deserve a real answer rather than a 404. */
              <div>
                <h1 className="text-[clamp(1.35rem,1.2rem+0.6vw,1.75rem)] tracking-[-0.015em]">
                  This link is incomplete
                </h1>
                <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
                  The unsubscribe link needs the token from your email, and this one arrived without
                  it. Some mail apps shorten long links.
                </p>
                <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
                  Email{" "}
                  <a
                    href={`mailto:${contact.email}?subject=${encodeURIComponent("Unsubscribe")}`}
                    className="font-semibold text-teal hover:text-teal-dark"
                  >
                    {contact.email}
                  </a>{" "}
                  and we will take you off the list by hand.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-teal hover:text-teal-dark"
                >
                  Back to the site
                  <Icon name="arrow-right" size={15} className="shrink-0" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
