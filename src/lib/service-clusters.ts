/**
 * Service clusters.
 *
 * Deliberately not exported from src/actions/admin/services.ts: a "use server"
 * module may only export async functions, so a constant exported from there
 * does not survive to the client — it arrives as something that is not an
 * array, and the first .map() over it throws during hydration.
 */
export const CLUSTERS = ["seo", "development", "growth"] as const;

export type Cluster = (typeof CLUSTERS)[number];

export const CLUSTER_LABELS: Record<Cluster, string> = {
  seo: "SEO",
  development: "Development",
  growth: "Growth",
};
