import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { AuthorForm } from "../AuthorForm";

export const metadata: Metadata = {
  title: "Edit author | Webrise Admin",
  robots: { index: false, follow: false },
};

export default async function EditAuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;

  const { data: author, error } = await supabaseAdmin
    .from("authors")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) console.error("[admin/authors] load failed", error);
  if (!author) notFound();

  return (
    <div>
      <Link
        href="/admin/authors"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
      >
        <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
        Authors
      </Link>

      <h1 className="mt-5 text-[clamp(1.75rem,1.3rem+1.6vw,2.25rem)] leading-[1.2] tracking-[-0.015em]">
        {author.name}
      </h1>

      <div className="mt-8">
        <AuthorForm author={author} {...(created ? { justCreated: true } : {})} />
      </div>
    </div>
  );
}
