import type { Metadata } from "next";
import Link from "next/link";
import { ActionLink } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { EmptyState, StatusBadge } from "@/components/admin/fields";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const metadata: Metadata = {
  title: "Blog | Webrise Admin",
  robots: { index: false, follow: false },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminBlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>;
}) {
  const params = await searchParams;
  const status = params.status === "draft" || params.status === "published" ? params.status : "all";
  const category = params.category ?? "all";

  let query = supabaseAdmin
    .from("blog_posts")
    .select("id, title, slug, status, published_at, updated_at, category_id, blog_categories(name)")
    .order("published_at", { ascending: false, nullsFirst: true })
    .order("updated_at", { ascending: false });

  if (status !== "all") query = query.eq("status", status);
  if (category !== "all") query = query.eq("category_id", category);

  const [{ data, error }, { data: categories }, { data: allPosts }] = await Promise.all([
    query,
    supabaseAdmin.from("blog_categories").select("id, name").order("sort_order"),
    supabaseAdmin.from("blog_posts").select("status"),
  ]);

  const posts = data ?? [];
  const counts = {
    all: allPosts?.length ?? 0,
    draft: (allPosts ?? []).filter((post) => post.status === "draft").length,
    published: (allPosts ?? []).filter((post) => post.status === "published").length,
  };

  /** Keeps the other filter intact when one of them changes. */
  const filterHref = (next: { status?: string; category?: string }) => {
    const merged = { status, category, ...next };
    const search = new URLSearchParams();
    if (merged.status !== "all") search.set("status", merged.status);
    if (merged.category !== "all") search.set("category", merged.category);
    const query = search.toString();
    return query ? `/admin/blog?${query}` : "/admin/blog";
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
            Blog
          </h1>
          <p className="mt-2 text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/authors"
            className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-offwhite"
          >
            <Icon name="users" size={16} className="shrink-0" />
            Authors
          </Link>
          <ActionLink href="/admin/blog/new" size="sm">
            <Icon name="plus" size={16} className="shrink-0" />
            New post
          </ActionLink>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-line-soft bg-white p-1.5 shadow-card">
          {[
            { key: "all", label: "All", count: counts.all },
            { key: "draft", label: "Draft", count: counts.draft },
            { key: "published", label: "Published", count: counts.published },
          ].map((tab) => {
            const active = status === tab.key;
            return (
              <Link
                key={tab.key}
                href={filterHref({ status: tab.key })}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
                  active ? "bg-teal-soft text-teal" : "text-muted-foreground hover:bg-offwhite"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                    active ? "bg-white text-teal" : "bg-sand text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Category filter as links rather than a select, so the view stays a
            Server Component and the URL carries the state. */}
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={filterHref({ category: "all" })}
            className={`rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors ${
              category === "all"
                ? "border-teal bg-teal-soft text-teal"
                : "border-line bg-white text-muted-foreground hover:bg-offwhite"
            }`}
          >
            Every category
          </Link>
          {(categories ?? []).map((item) => (
            <Link
              key={item.id}
              href={filterHref({ category: item.id })}
              className={`rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors ${
                category === item.id
                  ? "border-teal bg-teal-soft text-teal"
                  : "border-line bg-white text-muted-foreground hover:bg-offwhite"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {error ? (
          <EmptyState
            title="Could not load posts"
            description={`The blog_posts table returned an error: ${error.message}`}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            title={
              status === "all" && category === "all"
                ? "No posts yet"
                : "Nothing matches that filter"
            }
            description={
              status === "all" && category === "all"
                ? "Write the first one. Drafts stay invisible on the public site until you publish them."
                : "Try a different status or category."
            }
            action={
              <ActionLink href="/admin/blog/new" size="sm">
                <Icon name="plus" size={16} className="shrink-0" />
                New post
              </ActionLink>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line-soft bg-white shadow-card">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-line-soft bg-offwhite text-left">
                  <th className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Title
                  </th>
                  <th className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Category
                  </th>
                  <th className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Status
                  </th>
                  <th className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Published
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-line-soft last:border-b-0">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="font-semibold text-ink hover:text-teal"
                      >
                        {post.title}
                      </Link>
                      <div className="mt-0.5 font-mono text-[12px] text-muted-foreground">
                        /{post.slug}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {post.blog_categories?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                      {post.published_at ? (
                        <>
                          {dateFormat.format(new Date(post.published_at))}
                          {new Date(post.published_at) > new Date() ? (
                            <span className="block text-[12px] text-rust">scheduled</span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-[13px]">Not published</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-dark"
                      >
                        Edit
                        <Icon name="arrow-right" size={15} className="shrink-0" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
