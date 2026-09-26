import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Faq } from "@/components/sections/Faq";
import { Icon } from "@/components/shared/Icon";

const title = "SEO FAQ | Webrise";
const description =
  "Get straight answers about our SEO process, service scope, industries we work with, and what to expect from growth campaigns.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export default function FaqPage() {
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
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
