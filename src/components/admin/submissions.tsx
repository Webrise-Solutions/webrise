import Link from "next/link";
import { Icon } from "@/components/shared/Icon";

export const SUBMISSION_STATUSES = ["new", "contacted", "won", "lost"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export function isSubmissionStatus(value: string): value is SubmissionStatus {
  return (SUBMISSION_STATUSES as readonly string[]).includes(value);
}

const statusStyles: Record<SubmissionStatus, string> = {
  new: "bg-teal-soft text-teal",
  contacted: "bg-[color-mix(in_oklch,var(--orange)_14%,white)] text-rust",
  won: "bg-success-soft text-success",
  lost: "bg-sand text-muted-foreground",
};

export function StatusPill({ status }: { status: string }) {
  const key = isSubmissionStatus(status) ? status : "new";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${statusStyles[key]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {key}
    </span>
  );
}

export const submissionDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Status filter, sort toggle and search, all driven by query params so a
 * filtered view is a shareable URL and the whole list stays a Server Component.
 */
export function SubmissionFilters({
  basePath,
  status,
  sort,
  q,
  counts,
}: {
  basePath: string;
  status: string;
  sort: string;
  q: string;
  counts: Record<string, number> | null;
}) {
  const buildHref = (next: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { status, sort, q, ...next };
    if (merged.status && merged.status !== "all") params.set("status", merged.status);
    if (merged.sort && merged.sort !== "newest") params.set("sort", merged.sort);
    if (merged.q) params.set("q", merged.q);
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const tabs = [
    { key: "all", label: "All" },
    ...SUBMISSION_STATUSES.map((s) => ({ key: s, label: s })),
  ];

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-line-soft bg-white p-1.5 shadow-card">
        {tabs.map((tab) => {
          const active = (status || "all") === tab.key;
          // A dash when the counts could not be read at all.
          const count = counts === null ? "—" : (counts[tab.key] ?? 0);

          return (
            <Link
              key={tab.key}
              href={buildHref({ status: tab.key })}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold capitalize transition-colors ${
                active ? "bg-teal-soft text-teal" : "text-muted-foreground hover:bg-offwhite"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                  active ? "bg-white text-teal" : "bg-sand text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      <Link
        href={buildHref({ sort: sort === "oldest" ? "newest" : "oldest" })}
        className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-semibold text-ink hover:bg-offwhite"
      >
        <Icon name="clock" size={15} className="shrink-0" />
        {sort === "oldest" ? "Oldest first" : "Newest first"}
      </Link>

      {/* GET form: submitting just changes the URL, no client JS involved. */}
      <form action={basePath} method="get" className="flex items-center gap-2">
        {status && status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
        {sort && sort !== "newest" ? <input type="hidden" name="sort" value={sort} /> : null}
        <div className="relative">
          <Icon
            name="search"
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search name or email"
            aria-label="Search submissions by name or email"
            className="w-[220px] rounded-xl border border-input-line bg-white py-2.5 pl-9 pr-3 text-[14px] text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-semibold text-ink hover:bg-offwhite"
        >
          Search
        </button>
        {q ? (
          <Link
            href={buildHref({ q: "" })}
            className="text-[13px] font-semibold text-muted-foreground hover:text-teal"
          >
            Clear
          </Link>
        ) : null}
      </form>
    </div>
  );
}

/** Labelled row used throughout the submission detail panels. */
export function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line-soft py-3.5 last:border-b-0">
      <dt className="w-[140px] flex-none text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 break-words text-[15px] text-ink">{children}</dd>
    </div>
  );
}

/**
 * Where a submission came from.
 *
 * Rendered from `select("*")` results, so every field is read defensively:
 * the attribution columns arrive in a migration, and this panel has to stay
 * readable on a row written before it was applied. Missing everything shows
 * the note rather than an empty box, which is the difference between "we do
 * not know" and "they arrived directly".
 */
export function AttributionPanel({ row }: { row: Record<string, unknown> }) {
  const text = (key: string) => {
    const value = row[key];
    return typeof value === "string" && value.trim() !== "" ? value : null;
  };

  const campaign = [text("utm_source"), text("utm_medium"), text("utm_campaign")].filter(Boolean);
  const extra = [text("utm_term"), text("utm_content")].filter(Boolean);
  const landing = text("landing_page");
  const source = text("source_page");
  const referrer = text("referrer");
  const consent = typeof row["consent"] === "boolean" ? row["consent"] : null;

  const hasAny = campaign.length > 0 || extra.length > 0 || landing || source || referrer;

  return (
    <section className="rounded-2xl border border-line-soft bg-white p-6 shadow-card">
      <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
        <Icon name="trending-up" size={17} className="shrink-0 text-teal" />
        Where they came from
      </h2>

      {hasAny ? (
        <dl className="mt-4">
          <DetailRow label="Campaign">
            {campaign.length > 0 ? (
              <span className="font-mono text-[13px]">{campaign.join(" · ")}</span>
            ) : (
              "Direct or unattributed"
            )}
          </DetailRow>
          {extra.length > 0 ? (
            <DetailRow label="Term / content">
              <span className="font-mono text-[13px]">{extra.join(" · ")}</span>
            </DetailRow>
          ) : null}
          <DetailRow label="Landing page">
            <span className="font-mono text-[13px]">{landing ?? "—"}</span>
          </DetailRow>
          <DetailRow label="Submitted from">
            <span className="font-mono text-[13px]">{source ?? "—"}</span>
          </DetailRow>
          <DetailRow label="Referrer">
            {referrer ? (
              <span className="break-all font-mono text-[13px]">{referrer}</span>
            ) : (
              "None (direct or same-site)"
            )}
          </DetailRow>
        </dl>
      ) : (
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          No attribution recorded. Either this submission predates campaign tracking, or the visitor
          arrived directly with scripting unavailable.
        </p>
      )}

      {consent !== null ? (
        <p className="mt-4 flex items-center gap-2 border-t border-line-soft pt-4 text-[13px] text-muted-foreground">
          <Icon
            name={consent ? "check-circle" : "shield-lock"}
            size={15}
            className={`shrink-0 ${consent ? "text-success" : "text-rust"}`}
          />
          {consent
            ? "Consented to being contacted about this."
            : "No consent recorded on this submission."}
        </p>
      ) : null}
    </section>
  );
}
