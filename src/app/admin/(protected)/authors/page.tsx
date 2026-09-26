import type { Metadata } from "next";
import Link from "next/link";
import { ActionLink } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { EmptyState } from "@/components/admin/fields";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const metadata: Metadata = {
  title: "Authors | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function AdminAuthorsPage() {
  const [{ data, error }, { data: posts }] = await Promise.all([
    supabaseAdmin.from("authors").select("id, name, bio").order("name"),
    supabaseAdmin.from("blog_posts").select("author_id"),
  ]);

  const authors = data ?? [];
  const postCounts = new Map<string, number>();
  for (const post of posts ?? []) {
    if (post.author_id) postCounts.set(post.author_id, (postCounts.get(post.author_id) ?? 0) + 1);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
            Blog
          </Link>
          <h1 className="mt-3 text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
            Authors
          </h1>
          <p className="mt-2 text-muted-foreground">
            {authors.length} {authors.length === 1 ? "author" : "authors"}
          </p>
        </div>
        <ActionLink href="/admin/authors/new" size="sm">
          <Icon name="plus" size={16} className="shrink-0" />
          New author
        </ActionLink>
      </div>

      <div className="mt-8">
        {error ? (
          <EmptyState
            title="Could not load authors"
            description={`The authors table returned an error: ${error.message}`}
          />
        ) : authors.length === 0 ? (
          <EmptyState
            title="No authors yet"
            description="Add one and it becomes selectable on every post. Posts can also stay unattributed."
            action={
              <ActionLink href="/admin/authors/new" size="sm">
                <Icon name="plus" size={16} className="shrink-0" />
                New author
              </ActionLink>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => {
              const count = postCounts.get(author.id) ?? 0;

              return (
                <Link
                  key={author.id}
                  href={`/admin/authors/${author.id}`}
                  className="group rounded-2xl border border-line-soft bg-white p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lift"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-soft text-teal">
                    <Icon name="users" size={22} />
                  </span>
                  <h2 className="mt-4 flex items-center gap-1.5 text-[15px] font-semibold text-ink">
                    {author.name}
                    <Icon
                      name="arrow-right"
                      size={15}
                      className="text-teal opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                    {author.bio ?? "No bio yet."}
                  </p>
                  <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {count} {count === 1 ? "post" : "posts"}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
