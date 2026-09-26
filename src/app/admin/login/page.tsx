import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { Logo } from "@/components/shared/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in | Webrise",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-6 py-12">
      <main className="w-full max-w-[420px]">
        <Link href="/" className="inline-flex" aria-label="Webrise home">
          <Logo className="block h-auto w-[150px]" />
        </Link>

        <div className="mt-7 rounded-3xl border border-line-soft bg-white p-7 shadow-card sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
            <Icon name="shield-lock" size={15} className="shrink-0" />
            Admin
          </span>

          <h1 className="mt-4 text-[26px] leading-[1.15] tracking-[-0.015em]">Sign in</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            For the Webrise team. Accounts are created by an administrator, so there is no sign-up
            here.
          </p>

          <LoginForm {...(params.next ? { next: params.next } : {})} />
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
        >
          <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
          Back to site
        </Link>
      </main>
    </div>
  );
}
