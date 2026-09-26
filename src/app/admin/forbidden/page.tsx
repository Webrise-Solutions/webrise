import type { Metadata } from "next";
import Link from "next/link";
import { ActionButton } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { Logo } from "@/components/shared/Logo";
import { createClient } from "@/integrations/supabase/server";
import { signOut } from "@/actions/auth";

export const metadata: Metadata = {
  title: "No access | Webrise Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Shown to someone who signed in successfully but is not in admin_users.
 *
 * Deliberately not a redirect back to the login form: they are authenticated,
 * so bouncing them there implies the password was wrong and invites them to
 * try again. This says what actually happened, and leaves signing out to them.
 */
export default async function AdminForbiddenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-6 py-12">
      <main className="w-full max-w-[460px]">
        <Link href="/" className="inline-flex" aria-label="Webrise home">
          <Logo className="block h-auto w-[150px]" />
        </Link>

        <div className="mt-7 rounded-3xl border border-line-soft bg-white p-7 shadow-card sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_oklch,var(--orange)_14%,white)] px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-rust">
            <Icon name="shield-lock" size={15} className="shrink-0" />
            403
          </span>

          <h1 className="mt-4 text-[26px] leading-[1.15] tracking-[-0.015em]">No admin access</h1>

          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            {user?.email ? (
              <>
                You are signed in as <span className="font-semibold text-ink">{user.email}</span>,
                but that account is not an administrator.
              </>
            ) : (
              "That account is not an administrator."
            )}
          </p>

          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Admin access is granted manually. Ask an existing administrator to add you, then reload
            this page.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <form action={signOut}>
              <ActionButton type="submit" size="sm">
                Sign out
                <Icon name="arrow-right" size={16} className="shrink-0" />
              </ActionButton>
            </form>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-offwhite"
            >
              Back to site
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
