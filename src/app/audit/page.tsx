import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuditForm } from "@/components/sections/AuditForm";
import { Icon } from "@/components/shared/Icon";

const title = "Free SEO Audit | Webrise";
const description =
  "Request your free SEO audit: a plain-English review of what's holding your rankings back, checked by a senior specialist.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-sand">
      <Header />
      {/* The page takes the audit form's own `bg-sand` — otherwise the band above
          the form and the Footer's top margin below it fall back to cream and read
          as extensions of the header. The form's border-y goes with it. */}
      <main className="[&>section]:border-y-0">
        <div className="mx-auto max-w-[1200px] px-6 pb-0 pt-8 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
            Back to home
          </Link>
        </div>
        <AuditForm />
      </main>
      <Footer />
    </div>
  );
}
