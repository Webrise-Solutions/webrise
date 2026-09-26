import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Services } from "@/components/sections/Services";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Testimonials } from "@/components/sections/Testimonials";
import { Process } from "@/components/sections/Process";
import { Industries } from "@/components/sections/Industries";
import { Tools } from "@/components/sections/Tools";
import { AuditForm } from "@/components/sections/AuditForm";
import { Faq } from "@/components/sections/Faq";
import { ReadyToGrow } from "@/components/sections/ReadyToGrow";
import { faqs } from "@/data/site";

const title = "Webrise | AI-Powered SEO, Human-Led Growth";
const description =
  "Senior-led, white-hat SEO for ambitious UK businesses. Rank on Google and get recommended by ChatGPT, Gemini and Perplexity. Free SEO audit.";

export const revalidate = 300;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Services />
        <WhyChoose />
        {/* Claims, then the work that backs them. */}
        <FeaturedWork />
        <Testimonials />
        <Process />
        <Industries />
        <Tools />
        <AuditForm />
        <Faq layout="grid" />
        <ReadyToGrow />
      </main>
      <Footer />
    </div>
  );
}
