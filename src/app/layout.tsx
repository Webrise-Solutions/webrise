import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AttributionTracker } from "@/components/shared/AttributionTracker";
import { company, contact, siteUrl } from "@/data/site";
import "../styles.css";

const title = "Webrise | AI-Powered SEO, Human-Led Growth";
const description =
  "Senior-led, white-hat SEO for ambitious UK businesses. Rank on Google and get recommended by ChatGPT, Gemini and Perplexity. Free SEO audit.";

export const metadata: Metadata = {
  // Required for relative OG/Twitter image paths and canonical URLs to resolve.
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: { icon: "/favicon.ico" },
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    siteName: "Webrise",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// Site-wide Organization graph. Page-specific schema (FAQPage on the homepage,
// Article on blog posts) is declared by those pages instead.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#organization`,
  name: "Webrise",
  legalName: company.legalName,
  url: siteUrl,
  logo: `${siteUrl}/brand/webrise-logo.svg`,
  image: `${siteUrl}/brand/webrise-logo.svg`,
  description,
  email: contact.email,
  telephone: contact.phone,
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    streetAddress: company.streetAddress,
    addressLocality: company.locality,
    postalCode: company.postalCode,
    addressCountry: company.country,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AttributionTracker />
        {children}
      </body>
    </html>
  );
}
