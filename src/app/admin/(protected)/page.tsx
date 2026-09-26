import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import type { IconName } from "@/components/shared/Icon";
import { submissionDate } from "@/components/admin/submissions";
import { countAll, countSince, daysAgo, draftPosts, newsletterTrend } from "./metrics";

export const metadata: Metadata = {
  title: "Dashboard | Webrise Admin",
  robots: { index: false, follow: false },
};

const sections: { icon: IconName; title: string; description: string; href?: string }[] = [
  {
    icon: "users",
    title: "Team",
    description: "Manage the people, portraits and display order on the About page.",
    href: "/admin/team",
  },
  {
    icon: "briefcase",
    title: "Services",
    description: "Edit the 10 pillars, their copy and per-page SEO fields.",
    href: "/admin/services",
  },
  {
    icon: "guest-posting",
    title: "Blog",
    description: "Draft, schedule and publish posts across the seeded categories.",
    href: "/admin/blog",
  },
  {
    icon: "award",
    title: "Case studies",
    description: "Publish results-led write-ups and pick which are featured.",
    href: "/admin/case-studies",
  },
  {
    icon: "star",
    title: "Testimonials",
    description: "Client quotes with ratings. Public the moment they are saved.",
    href: "/admin/testimonials",
  },
  {
    icon: "mail",
    title: "Newsletter",
    description: "Who signed up, and a CSV export for your email platform.",
    href: "/admin/newsletter",
  },
  {
    icon: "users",
    title: "Leads and quotes",
    description: "Work submissions through new, contacted, won and lost.",
    href: "/admin/leads",
  },
];

/** A dash, not a zero: unknown and none are different facts. */
function Figure({ value }: { value: number | null }) {
  return (
    <span className="text-[32px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-ink">
      {value ?? "—"}
    </span>
  );
}

function StatTile({
  icon,
  label,
  value,
  href,
  children,
}: {
  icon: IconName;
  label: string;
  value: number | null;
  href?: string;
  children?: React.ReactNode;
}) {
  const body = (
    <>
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-soft text-teal">
        <Icon name={icon} size={22} />
      </span>
      <div className="mt-4">
        <Figure value={value} />
      </div>
      <div className="mt-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      {children}
    </>
  );

  const className =
    "rounded-2xl border border-line-soft bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200";

  return href ? (
    <Link
      href={href}
      className={`group ${className} hover:-translate-y-1 hover:border-teal hover:shadow-lift`}
    >
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export default async function AdminDashboardPage() {
  const weekAgo = daysAgo(7);

  const [leadsThisWeek, quotesThisWeek, newsletter, drafts, auditTotal] = await Promise.all([
    countSince("leads", weekAgo),
    countSince("quote_requests", weekAgo),
    newsletterTrend(),
    draftPosts(),
    countAll("audit_requests"),
  ]);

  // Only describe movement when both windows are known.
  const delta =
    newsletter.thisWeek !== null && newsletter.lastWeek !== null
      ? newsletter.thisWeek - newsletter.lastWeek
      : null;

  return (
    <div>
      <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
        Dashboard
      </h1>
      <div className="mt-[18px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
      <p className="mt-[22px] max-w-[60ch] text-muted-foreground">
        The last seven days at a glance. A dash means the figure could not be read, which is not the
        same as none.
      </p>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon="users"
          label="New leads this week"
          value={leadsThisWeek}
          href="/admin/leads"
        >
          <p className="mt-2 text-[13px] text-muted-foreground">
            {leadsThisWeek === null
              ? "Table unavailable."
              : "Since " + submissionDate.format(new Date(weekAgo))}
          </p>
        </StatTile>

        <StatTile
          icon="briefcase"
          label="New quote requests"
          value={quotesThisWeek}
          href="/admin/quotes"
        >
          <p className="mt-2 text-[13px] text-muted-foreground">
            {quotesThisWeek === null ? "Table unavailable." : "In the last 7 days"}
          </p>
        </StatTile>

        <StatTile
          icon="mail"
          label="Newsletter subscribers"
          value={newsletter.total}
          href="/admin/newsletter"
        >
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground">
            {newsletter.total === null ? (
              "Table unavailable."
            ) : delta === null ? (
              <>
                {newsletter.thisWeek === null
                  ? "Weekly trend unavailable"
                  : `${newsletter.thisWeek} joined this week`}
              </>
            ) : (
              <>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold ${
                    delta > 0
                      ? "bg-success-soft text-success"
                      : delta < 0
                        ? "bg-[color-mix(in_oklch,var(--orange)_14%,white)] text-rust"
                        : "bg-sand text-muted-foreground"
                  }`}
                >
                  {delta > 0 ? "+" : ""}
                  {delta}
                </span>
                {newsletter.thisWeek} this week vs {newsletter.lastWeek} last
              </>
            )}
          </p>
        </StatTile>

        <StatTile icon="audit" label="Audit requests" value={auditTotal}>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {auditTotal === null ? (
              <span className="text-rust">Table missing. Apply the alignment migration.</span>
            ) : (
              "All time"
            )}
          </p>
        </StatTile>
      </div>

      {/* Quick actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-[10px] bg-rust px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-rust-dark"
        >
          <Icon name="plus" size={17} className="shrink-0" />
          New blog post
        </Link>
        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center gap-2 rounded-[10px] border border-teal bg-transparent px-5 py-3 text-[15px] font-semibold text-teal transition-colors hover:bg-teal-soft"
        >
          <Icon name="plus" size={17} className="shrink-0" />
          New case study
        </Link>
        <Link
          href="/admin/authors/new"
          className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-white px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-offwhite"
        >
          <Icon name="users" size={17} className="shrink-0" />
          New author
        </Link>
      </div>

      {/* Drafts awaiting publish */}
      <section className="mt-9 rounded-2xl border border-line-soft bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
            Drafts awaiting publish
            <span className="rounded-full bg-sand px-2.5 py-1 text-[12px] font-semibold tabular-nums text-muted-foreground">
              {drafts.count ?? "—"}
            </span>
          </h2>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-dark"
          >
            All posts
            <Icon name="arrow-right" size={15} className="shrink-0" />
          </Link>
        </div>

        {drafts.unavailable ? (
          <p className="mt-4 text-[15px] text-rust">
            Draft posts could not be read. This is not the same as there being none.
          </p>
        ) : drafts.posts.length === 0 ? (
          <p className="mt-4 text-[15px] text-muted-foreground">
            Nothing waiting. Every post is published.
          </p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {drafts.posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line-soft bg-offwhite px-4 py-3 transition-colors hover:border-teal hover:bg-white"
                >
                  <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                    {post.title}
                    <Icon
                      name="arrow-right"
                      size={15}
                      className="text-teal opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    Edited {submissionDate.format(new Date(post.updated_at))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {drafts.count !== null && drafts.count > drafts.posts.length ? (
          <p className="mt-3 text-[13px] text-muted-foreground">
            Showing the {drafts.posts.length} most recently edited of {drafts.count}.
          </p>
        ) : null}
      </section>

      {/* Section navigation */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((item) => {
          // Built sections are solid and clickable; the rest stay dashed
          // placeholders so it is obvious what does not exist yet.
          const body = (
            <>
              <span
                className={`grid h-11 w-11 place-items-center rounded-2xl ${
                  item.href ? "bg-teal-soft text-teal" : "bg-sand text-muted-foreground"
                }`}
              >
                <Icon name={item.icon} size={22} />
              </span>
              <h2 className="mt-4 flex items-center gap-1.5 text-[15px] font-semibold text-ink">
                {item.title}
                {item.href ? (
                  <Icon
                    name="arrow-right"
                    size={15}
                    className="text-teal opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                ) : null}
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </>
          );

          return item.href ? (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-line-soft bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
            >
              {body}
            </Link>
          ) : (
            <div
              key={item.title}
              className="rounded-2xl border border-dashed border-line bg-transparent p-5"
            >
              {body}
            </div>
          );
        })}
      </div>
    </div>
  );
}
