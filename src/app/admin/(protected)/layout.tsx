import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { Logo } from "@/components/shared/Logo";
import { requireAdmin } from "@/lib/admin-auth";
import { signOut } from "@/actions/auth";

export const metadata: Metadata = {
  title: "Admin | Webrise",
  robots: { index: false, follow: false },
};

// Session state must never be cached across requests.
export const dynamic = "force-dynamic";

/**
 * The authorisation gate. Middleware has already established that *someone* is
 * signed in; requireAdmin() is what decides they are allowed in here, and it
 * runs before any child page renders.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-[200] border-b border-line bg-cream/85 backdrop-blur-[10px]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-6 py-3.5 sm:px-10">
          <Link href="/admin" className="flex items-center" aria-label="Admin dashboard">
            <Logo className="block h-auto w-[130px]" />
          </Link>
          <span className="rounded-full bg-teal-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-teal">
            Admin
          </span>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
            <Link
              href="/admin/settings"
              title="Settings"
              aria-label="Settings"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-muted-foreground transition-colors hover:border-teal hover:text-teal"
            >
              <Icon name="settings" size={17} />
            </Link>
            <form action={signOut}>
              <ActionButton type="submit" variant="outline" size="sm">
                <Icon name="arrow-right" size={16} className="shrink-0" />
                Sign out
              </ActionButton>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-[clamp(32px,4vw,64px)] sm:px-10">
        {children}
      </main>
    </div>
  );
}
