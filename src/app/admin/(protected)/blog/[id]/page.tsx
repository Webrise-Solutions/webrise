import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { StatusBadge } from "@/components/admin/fields";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { PostForm } from "../PostForm";
import { loadPostOptions } from "../options";

export const metadata: Metadata = {
  title: "Edit post | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;

  const [{ data: post, error }, { categories, authors, editorFields }] = await Promise.all([
    supabaseAdmin.from("blog_posts").select("*").eq("id", id).maybeSingle(),
    loadPostOptions(),
  ]);

  if (error) console.error("[admin/blog] load failed", error);
  if (!post) notFound();

  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
        Blog
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
          {post.title}
        </h1>
        <StatusBadge status={post.status} />
      </div>

      <div className="mt-8">
        <PostForm
          post={post}
          categories={categories}
          authors={authors}
          editorFields={editorFields}
          {...(created ? { justCreated: true } : {})}
        />
      </div>
    </div>
  );
}
