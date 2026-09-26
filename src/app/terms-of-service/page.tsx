import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Icon } from "@/components/shared/Icon";
import { contact } from "@/data/site";

const title = "Terms & Conditions | Webrise";
const description =
  "The terms that govern your use of the Webrise website and the SEO services we provide.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

const lastUpdated = "12 August 2026";

export default function TermsAndConditionsPage() {
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
              Terms &amp; Conditions
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

            <div className="mt-8 grid gap-8 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                These terms govern your use of webrise.co.uk and any services provided by Webrise
                Ltd ("Webrise", "we", "us"). By browsing this website or requesting a free SEO
                audit, you agree to them. If you don't agree, please don't use the site.
              </p>

              <div>
                <h2 className="text-lg font-semibold text-ink">Using this website</h2>
                <p className="mt-2.5">
                  You may use this site for lawful purposes only. You agree not to attempt to
                  disrupt it, access it by automated means at a scale that degrades it for others,
                  or use it to send misleading or unsolicited submissions through our forms.
                </p>
                <p className="mt-2.5">
                  We aim to keep the site available and its content accurate, but we don't guarantee
                  uninterrupted access and may change or remove content at any time.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Free SEO audits</h2>
                <p className="mt-2.5">
                  The free audit is offered as a good-faith review of your website's search
                  performance. It is informational, is provided without warranty, and does not
                  create a client relationship on its own. We may decline or withdraw an audit
                  request at our discretion, for example where the details supplied are incomplete
                  or the request is clearly not genuine.
                </p>
                <p className="mt-2.5">
                  Information you submit through the audit form is handled as described in our{" "}
                  <Link href="/privacy-policy" className="text-teal hover:text-teal-dark">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Engagements and quotes</h2>
                <p className="mt-2.5">
                  Nothing on this website is a binding offer. Paid work begins only once we've
                  agreed scope, deliverables, timelines and fees in writing: by proposal, contract
                  or email confirmation. Where those written terms conflict with this page, the
                  written terms for that engagement take precedence.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Fees and payment</h2>
                <p className="mt-2.5">
                  Fees, billing frequency and payment terms are set out in your proposal or
                  contract. Unless stated otherwise, invoices are payable within the period shown on
                  the invoice, and quoted amounts exclude VAT and any third-party costs (such as
                  paid tool subscriptions or media spend) unless we've listed them explicitly.
                </p>
                <p className="mt-2.5">
                  We may pause work on overdue accounts after giving you notice.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Your responsibilities</h2>
                <p className="mt-2.5">
                  Effective SEO depends on access and input from your side. You agree to provide the
                  site, analytics and search console access we reasonably need, to respond to
                  approval requests in good time, and to ensure that any content, images or data you
                  supply are accurate and that you hold the rights to use them.
                </p>
                <p className="mt-2.5">
                  Delays in access, approvals or content may shift agreed timelines.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Results and rankings</h2>
                <p className="mt-2.5">
                  We practise white-hat SEO that follows search engine guidelines, and we report
                  transparently on what we do. We cannot, however, guarantee specific rankings,
                  traffic volumes, conversions, revenue, or inclusion in AI assistant answers.
                  Search engines and AI systems control their own algorithms and change them without
                  notice, and competitor activity is outside our control. Any figures, case studies
                  or projections shown on this site illustrate past work and are not a promise of
                  comparable results.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Intellectual property</h2>
                <p className="mt-2.5">
                  The content, branding and design of this website belong to Webrise or our
                  licensors and may not be copied or reused without permission. Deliverables created
                  specifically for you (content, reports and recommendations) become yours once the
                  related invoices are paid in full. We keep ownership of our underlying methods,
                  templates, frameworks and know-how, and may reuse them on other engagements.
                </p>
                <p className="mt-2.5">
                  Third-party names and logos shown on our{" "}
                  <Link href="/tools" className="text-teal hover:text-teal-dark">
                    Tools page
                  </Link>{" "}
                  remain the property of their respective owners and are shown for identification
                  only; their presence doesn't imply partnership or endorsement.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Confidentiality</h2>
                <p className="mt-2.5">
                  Each of us agrees to keep the other's non-public business information confidential
                  and to use it only for the purposes of the engagement. This doesn't apply to
                  information that is already public, that we receive lawfully from someone else, or
                  that we're required to disclose by law.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Third-party services</h2>
                <p className="mt-2.5">
                  Our work may involve third-party platforms and tools (analytics, SEO software,
                  hosting, and similar). Those services are governed by their own terms, and we
                  aren't responsible for their availability, pricing changes, or the accuracy of the
                  data they report. Links from this site to other websites are provided for
                  convenience and are not an endorsement.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Limitation of liability</h2>
                <p className="mt-2.5">
                  Nothing in these terms limits liability that cannot lawfully be limited, including
                  for death or personal injury caused by negligence, or for fraud. Subject to that,
                  we are not liable for indirect or consequential loss, or for loss of profits,
                  revenue, goodwill, data or anticipated savings, and our total liability in
                  connection with an engagement is limited to the fees you paid us for that
                  engagement in the twelve months before the claim arose.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Termination</h2>
                <p className="mt-2.5">
                  Either party may end an ongoing engagement by giving the notice period set out in
                  the relevant proposal or contract. On termination, you remain liable for fees for
                  work completed and for costs we've committed on your behalf, and we'll hand over
                  the deliverables covered by paid invoices.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Changes to these terms</h2>
                <p className="mt-2.5">
                  We may update these terms from time to time. The version published here at the
                  time you use the site is the one that applies, and material changes will be
                  reflected by updating the "Last updated" date above.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Governing law</h2>
                <p className="mt-2.5">
                  These terms are governed by the laws of England and Wales, and the courts of
                  England and Wales have exclusive jurisdiction over any dispute arising from them.
                  Webrise Ltd is registered in England &amp; Wales at {contact.address}.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink">Contact</h2>
                <p className="mt-2.5">
                  Questions about these terms? Email{" "}
                  <a href={`mailto:${contact.email}`} className="text-teal hover:text-teal-dark">
                    {contact.email}
                  </a>{" "}
                  or use our{" "}
                  <Link href="/contact" className="text-teal hover:text-teal-dark">
                    Contact page
                  </Link>
                  .
                </p>
              </div>

              <div className="rounded-[14px] border border-line-soft bg-white px-5 py-4 text-sm">
                This page is provided as general information and isn't legal advice. If you need
                these terms to meet specific regulatory or contractual requirements, please have
                them reviewed by a qualified professional.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
