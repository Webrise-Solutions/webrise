import type { Json } from "@/integrations/supabase/types";

export type Metric = { metric: string; value: string; label: string };

/**
 * `results` is free-form jsonb, so nothing about its shape is guaranteed.
 * Anything that is not a usable {metric, value} pair is dropped rather than
 * rendered as a blank stat.
 */
export function firstMetrics(results: Json | null, limit = 4): Metric[] {
  if (!Array.isArray(results)) return [];

  return results
    .flatMap((entry) => {
      if (typeof entry !== "object" || entry === null || Array.isArray(entry)) return [];
      const row = entry as Record<string, unknown>;
      const metric = typeof row["metric"] === "string" ? row["metric"] : "";
      const value = typeof row["value"] === "string" ? row["value"] : "";
      if (!metric || !value) return [];
      return [{ metric, value, label: typeof row["label"] === "string" ? row["label"] : "" }];
    })
    .slice(0, limit);
}

/**
 * Result types, used by the /work filters.
 *
 * The metric names are written by hand in the admin, so they are matched on
 * keywords rather than an enum: "Organic traffic", "Organic sessions" and
 * "Non-brand traffic" should all land under Traffic without anyone having to
 * pick from a dropdown while writing the case study.
 */
export const RESULT_TYPES = [
  { slug: "traffic", label: "More traffic", keywords: ["traffic", "session", "visit", "click"] },
  { slug: "rankings", label: "Better rankings", keywords: ["rank", "position", "keyword", "serp"] },
  {
    slug: "revenue",
    label: "More revenue",
    keywords: ["revenue", "sales", "order", "aov", "roas"],
  },
  { slug: "leads", label: "More leads", keywords: ["lead", "enquir", "inquir", "booking", "call"] },
  {
    slug: "conversion",
    label: "Higher conversion",
    keywords: ["conversion", "convert", "signup", "sign-up", "trial"],
  },
  {
    slug: "visibility",
    label: "AI & visibility",
    keywords: ["visibility", "impression", "citation", "ai ", "share of"],
  },
] as const;

export type ResultType = (typeof RESULT_TYPES)[number]["slug"];

/** Every result type a case study's metrics touch on, deduplicated. */
export function resultTypes(results: Json | null): ResultType[] {
  const metrics = firstMetrics(results, 20);
  if (metrics.length === 0) return [];

  const haystack = metrics.map((metric) => `${metric.metric} ${metric.label}`.toLowerCase());

  return RESULT_TYPES.filter((type) =>
    haystack.some((text) => type.keywords.some((keyword) => text.includes(keyword))),
  ).map((type) => type.slug);
}
