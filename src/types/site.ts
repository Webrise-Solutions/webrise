import type { IconName } from "@/components/shared/Icon";

export type ServiceCluster = "seo" | "development" | "growth";

export interface Service {
  slug: string;
  name: string;
  icon: IconName;
  /** Matches public.services.cluster; drives related-service cross-sell. */
  cluster: ServiceCluster;
  highlight: string;
  description: string;
  features: string[];
  included: string[];
  result: string;
}

export interface OrbitTool {
  name: string;
  role: string;
  angle: number;
  badge: string;
  badgeTone: "featured" | "soft" | "dark";
}

export interface TaggedItem {
  name: string;
  icon: IconName;
}

export interface Industry extends TaggedItem {
  /** Matches public.industries.slug, so the card can link to /industries/[slug]. */
  slug: string;
  /** One line on how buyers in this sector search, shown on the industries page. */
  focus: string;
  /**
   * What is actually different about winning search here. Three points, shown
   * on the vertical page — the part that makes it worth having a page per
   * sector rather than one generic list.
   */
  challenges: string[];
  /**
   * Service slugs we usually lead with in this sector, most relevant first.
   * Previously the vertical pages showed the same four services regardless of
   * industry, which read as a template the moment anyone compared two.
   */
  services: string[];
}

export interface WhyCard {
  n: string;
  icon: IconName;
  tone: "teal" | "rust";
  title: string;
  description: string;
}

export interface Stat {
  icon: IconName;
  value: string;
  label: string;
  tone: "mint" | "coral";
}

export interface ProcessStep {
  n: string;
  icon: IconName;
  title: string;
  description: string;
  time: string;
}

export interface Tool {
  name: string;
  description: string;
  tone: "teal" | "rust";
}

export interface Faq {
  question: string;
  answer: string;
  icon: IconName;
  tone: "teal" | "rust";
}

export interface FooterTrust {
  icon: IconName;
  tone: "teal" | "rust";
  title: string;
  description: string;
}

export interface GrowthStat {
  icon: IconName;
  value: string;
  label: string;
}

export interface AuditRequestInput {
  websiteUrl: string;
  name: string;
  email: string;
  businessType: string;
  consent: boolean;
}
