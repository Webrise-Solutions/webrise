import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Published case studies for one service.
 *
 * This is what the TikTok Shop page needs for a results block, and it works
 * the same way for every other service: a case study already carries its
 * metrics as structured JSON in `results`, so there is nothing for a separate
 * stats table to hold that this does not.
 *
 * Renders nothing when a service has no published work. An invented stat block
 * would be worse than an absent one.
 */
export async function ServiceWork({
  serviceId,
  serviceName,
}: {
  serviceId: string;
  serviceName: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("case_studies")
    .select("id, slug, title, client_name, summary, results, cover_image_url")
    .eq("service_id", serviceId)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .limit(2);

  if (error) {
    console.error("[service-work] load failed", error);
    return null;
  }

  const studies = data ?? [];
  if (studies.length === 0) return null;

  return (
    <section className="mt-[clamp(40px,5vw,72px)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[17px] font-semibold text-ink">
          {serviceName} work, written up in full
        </h2>
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-teal hover:text-teal-dark"
        >
          All case studies
          <Icon name="arrow-right" size={15} className="shrink-0" />
        </Link>
      </div>

      <ul className={`mt-4 grid gap-5 ${studies.length > 1 ? "md:grid-cols-2" : "max-w-[640px]"}`}>
        {studies.map((study) => {
          return (
            <li key={study.id}>
              <Link
                href={`/work/${study.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
              >
                {study.cover_image_url ? (
                  <div className="h-[170px] bg-sand">
                    <img
                      src={study.cover_image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="flex items-center gap-1.5 text-[17px] font-semibold leading-snug text-ink">
                    {study.title}
                    <Icon
                      name="arrow-right"
                      size={15}
                      className="flex-none text-teal opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </h3>

                  {study.client_name ? (
                    <p className="mt-1 text-[13px] text-muted-foreground">{study.client_name}</p>
                  ) : null}

                  {study.summary ? (
                    <p className="mt-2.5 line-clamp-3 text-[14px] leading-relaxed text-muted-foreground">
                      {study.summary}
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
