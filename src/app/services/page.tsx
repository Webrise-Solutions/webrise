import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Services } from "@/components/sections/Services";
import { CtaStrip } from "@/components/shared/CtaStrip";
import { Icon } from "@/components/shared/Icon";

const title = "SEO Services | Webrise";
const description =
  "Explore our SEO services, from technical audits and content strategy to link building and growth reporting.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export default function ServicesPage() {
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
        <Services />
        <section className="mx-auto max-w-[1200px] px-4 pb-[clamp(48px,6vw,96px)] sm:px-6 md:px-10">
          <CtaStrip
            title="Not sure which service you need?"
            description="Send us your site and we'll come back with the gaps worth fixing first, and which of these services actually moves the needle for you."
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
