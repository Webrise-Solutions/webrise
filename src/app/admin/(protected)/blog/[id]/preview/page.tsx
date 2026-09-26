import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { Prose } from "@/components/shared/Prose";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const metadata: Metadata = {
  title: "Preview | Webrise Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const postDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * Draft preview.
 *
 * Lives under the admin guard rather than the public /blog route on purpose:
 * an unpublished post must not be reachable by anyone who guesses the URL, and
 * a "preview token" on a public page would be one more thing to leak.
 */
export default async function BlogPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: post, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*, blog_categories(name), authors(name, bio)")
    .eq("id", id)
    .maybeSingle();

  if (error) console.error("[admin/blog] preview load failed", error);
  if (!post) notFound();

  const scheduled = post.published_at ? new Date(post.published_at) > new Date() : false;
  const liveNow = post.status === "published" && !scheduled;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-sand px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink">
            <Icon name="monitor" size={16} className="shrink-0" />
            Preview
          </span>
          <span className="text-[13px] text-muted-foreground">
            {liveNow
              ? "This is live on the site."
              : scheduled
                ? `Scheduled for ${postDate.format(new Date(post.published_at!))}. Not visible yet.`
                : "Draft. Not visible on the site."}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href={`/admin/blog/${post.id}`}
            className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-offwhite"
          >
            <Icon name="arrow-right" size={15} className="shrink-0 rotate-180" />
            Back to editor
          </Link>
          {liveNow ? (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[10px] border border-teal px-4 py-2.5 text-sm font-semibold text-teal hover:bg-teal-soft"
            >
              View live page
              <Icon name="arrow-right" size={15} className="shrink-0 -rotate-45" />
            </a>
          ) : null}
        </div>
      </div>

      {/* Same shell the public article uses, so what is shown here is what ships. */}
      <article className="mx-auto mt-8 max-w-[760px]">
        {post.blog_categories ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
            {post.blog_categories.name}
          </span>
        ) : null}

        <h1 className="mt-5 text-[clamp(1.875rem,1.3rem+2.2vw,2.75rem)] leading-[1.1] tracking-[-0.02em] text-balance">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mt-4 text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line-soft pt-5 text-sm text-muted-foreground">
          {post.authors ? (
            <span className="inline-flex items-center gap-2 font-semibold text-ink">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-soft text-teal">
                <Icon name="users" size={16} />
              </span>
              {post.authors.name}
            </span>
          ) : null}
          {post.published_at ? <span>{postDate.format(new Date(post.published_at))}</span> : null}
        </div>

        {post.cover_image_url ? (
          <figure className="mt-8">
            <img
              src={post.cover_image_url}
              alt={post.cover_image_alt ?? ""}
              className="w-full rounded-3xl border border-line-soft object-cover"
            />
          </figure>
        ) : null}

        <div className="mt-8">
          {post.body ? (
            <Prose html={post.body} />
          ) : (
            <p className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-muted-foreground">
              No body written yet.
            </p>
          )}
        </div>

        {post.tags && post.tags.length > 0 ? (
          <ul className="mt-10 flex flex-wrap gap-2 border-t border-line-soft pt-6">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    </div>
  );
}
