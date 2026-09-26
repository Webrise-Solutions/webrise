import type { Metadata } from "next";
import Link from "next/link";
import { ActionLink } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { EmptyState } from "@/components/admin/fields";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { CLUSTERS, CLUSTER_LABELS, type Cluster } from "@/lib/service-clusters";

export const metadata: Metadata = {
  title: "Services | Webrise Admin",
  robots: { index: false, follow: false },
};

const clusterOrder = CLUSTERS;

export default async function AdminServicesPage() {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("id, name, slug, cluster, short_description, sort_order, deliverables")
    .order("sort_order");

  const services = data ?? [];
  const grouped = clusterOrder.map((cluster: Cluster) => ({
    cluster,
    items: services.filter((service) => service.cluster === cluster),
  }));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
            Services
          </h1>
          <p className="mt-2 text-muted-foreground">
            {services.length} {services.length === 1 ? "service" : "services"} across three clusters
          </p>
        </div>
        <ActionLink href="/admin/services/new" size="sm">
          <Icon name="plus" size={16} className="shrink-0" />
          New service
        </ActionLink>
      </div>

      <div className="mt-8">
        {error ? (
          <EmptyState
            title="Could not load services"
            description={`The services table returned an error: ${error.message}`}
          />
        ) : services.length === 0 ? (
          <EmptyState
            title="No services yet"
            description="The ten pillars are normally seeded with the schema."
          />
        ) : (
          <div className="grid gap-8">
            {grouped.map(({ cluster, items }) =>
              items.length === 0 ? null : (
                <section key={cluster}>
                  <h2 className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {CLUSTER_LABELS[cluster]}
                    <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] tabular-nums">
                      {items.length}
                    </span>
                  </h2>

                  <ul className="mt-3 grid gap-3 md:grid-cols-2">
                    {items.map((service) => {
                      const deliverables = Array.isArray(service.deliverables)
                        ? service.deliverables.length
                        : 0;

                      return (
                        <li key={service.id}>
                          <Link
                            href={`/admin/services/${service.id}`}
                            className="group flex h-full flex-col rounded-2xl border border-line-soft bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
                          >
                            <span className="flex items-center gap-2 text-[16px] font-semibold text-ink">
                              <span className="font-mono text-[12px] text-muted-foreground">
                                {String(service.sort_order).padStart(2, "0")}
                              </span>
                              {service.name}
                              <Icon
                                name="arrow-right"
                                size={15}
                                className="text-teal opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                              />
                            </span>
                            <span className="mt-1 font-mono text-[12px] text-muted-foreground">
                              /services/{service.slug}
                            </span>
                            <span className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-muted-foreground">
                              {service.short_description ?? "No short description yet."}
                            </span>
                            <span className="mt-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                              {deliverables} {deliverables === 1 ? "deliverable" : "deliverables"}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
