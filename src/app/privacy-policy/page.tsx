import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Icon } from "@/components/shared/Icon";
import { contact } from "@/data/site";

const title = "Privacy Policy | Webrise";
const description = "How Webrise collects, uses and protects your personal information.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

const lastUpdated = "12 August 2026";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

            <div className="mt-8 grid gap-8 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                This policy explains what personal information Webrise ("we", "us") collects through
                webrise.co.uk, how we use it, and the choices you have. It applies only to this
                website, not to any third-party sites we link to.
              </p>

              <div>
                <h2 className="text-lg font-semibold text-ink">Information we collect</h2>
                <p className="mt-2.5">
                  The only personal data we collect directly is what you choose to give us through
                  our free SEO audit request form: your name, email address, website URL, business
                  type, and any optional notes you add. We also ask for your explicit consent to be
                  contacted before the form can be submitted.
                </p>
                <p className="mt-2.5">
                  If you email or WhatsApp us directly using the contact details on our{" "}
                  <Link href="/contact" className="text-teal hover:text-teal-dark">
                    Contact page
                  </Link>
                  , we'll have whatever information you choose to share in that conversation.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">How we use it</h2>
                <p className="mt-2.5">
                  We use the information you submit solely to prepare and deliver the SEO audit
                  you've requested, and to follow up about our services if you've consented to be
                  contacted. We do not sell, rent, or share your personal data with third parties
                  for their own marketing purposes.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Where it's stored</h2>
                <p className="mt-2.5">
                  Form submissions are stored securely using Supabase, our database provider, who
                  process this data on our behalf under their own security and privacy commitments.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Cookies</h2>
                <p className="mt-2.5">
                  This website does not currently use tracking, advertising, or analytics cookies.
                  See our{" "}
                  <Link href="/cookie-policy" className="text-teal hover:text-teal-dark">
                    Cookie Policy
                  </Link>{" "}
                  for details.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Your rights</h2>
                <p className="mt-2.5">
                  You can ask us to access, correct, or delete the personal data we hold about you
                  at any time by emailing{" "}
                  <a href={`mailto:${contact.email}`} className="text-teal hover:text-teal-dark">
                    {contact.email}
                  </a>
                  . We'll respond within a reasonable timeframe.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Changes to this policy</h2>
                <p className="mt-2.5">
                  We may update this policy from time to time. Material changes will be reflected by
                  updating the "Last updated" date above.
                </p>
              </div>

              <div className="rounded-[14px] border border-line-soft bg-white px-5 py-4 text-sm">
                This page is provided as general information and isn't legal advice. If you need
                this policy to meet specific regulatory requirements (GDPR, CCPA, or otherwise),
                please have it reviewed by a qualified professional.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
