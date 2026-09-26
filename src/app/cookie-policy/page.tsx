import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Icon } from "@/components/shared/Icon";
import { contact } from "@/data/site";

const title = "Cookie Policy | Webrise";
const description = "How Webrise uses cookies on webrise.co.uk.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

const lastUpdated = "12 August 2026";

export default function CookiePolicyPage() {
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
          <div className="mx-auto max-w-[760px]">
            <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
              Cookie Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

            <div className="mt-8 grid gap-8 text-[15px] leading-relaxed text-muted-foreground">
              <div>
                <h2 className="text-lg font-semibold text-ink">What cookies are</h2>
                <p className="mt-2.5">
                  Cookies are small text files a website can store in your browser to remember
                  information between visits, for example keeping you signed in or remembering your
                  preferences.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Cookies we use</h2>
                <p className="mt-2.5">
                  webrise.co.uk does not currently set any tracking, advertising, or analytics
                  cookies. We don't run cookie-based analytics or ad-retargeting on this site. Our
                  hosting infrastructure may use strictly necessary technical cookies required to
                  serve the site securely. These don't track you across other websites and can't be
                  disabled without affecting how the site works.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Third-party cookies</h2>
                <p className="mt-2.5">
                  We don't currently embed third-party trackers, ad networks, or analytics scripts
                  that would set cookies on your device. If that changes, for example if we add
                  analytics in the future, we'll update this page first.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Managing cookies</h2>
                <p className="mt-2.5">
                  Most browsers let you view, block, or delete cookies through their settings. Since
                  this site doesn't rely on non-essential cookies, changing these settings shouldn't
                  affect your experience here.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Changes to this policy</h2>
                <p className="mt-2.5">
                  We may update this policy as the site changes. Material changes will be reflected
                  by updating the "Last updated" date above.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Questions</h2>
                <p className="mt-2.5">
                  Email us at{" "}
                  <a href={`mailto:${contact.email}`} className="text-teal hover:text-teal-dark">
                    {contact.email}
                  </a>{" "}
                  if you have any questions about this policy.
                </p>
              </div>

              <div className="rounded-[14px] border border-line-soft bg-white px-5 py-4 text-sm">
                This page is provided as general information and isn't legal advice. If you need
                this policy to meet specific regulatory requirements, please have it reviewed by a
                qualified professional.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
