"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type HomeLinkProps = Omit<ComponentProps<typeof Link>, "href">;

/**
 * Links to the home page and always lands at the very top of it.
 * When you're already on `/` — scrolled down to Services, FAQ, etc. — a plain
 * `<Link href="/">` is a no-op, so scroll back up (and drop any `#section`
 * hash) ourselves instead.
 */
export function HomeLink({ onClick, ...props }: HomeLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || pathname !== "/") return;

        event.preventDefault();
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    />
  );
}
