import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createSupabaseFetch, readPublicSupabaseEnv } from "@/integrations/supabase/api-key-fetch";
import { ADMIN_HOME_PATH, FORBIDDEN_PATH, LOGIN_PATH } from "@/lib/routes";

/**
 * First line of the admin guard: refreshes the auth cookie on every /admin
 * request and bounces anonymous visitors to the login page before any admin
 * page renders.
 *
 * This is a redirect, not the authorisation decision — middleware only knows
 * that *someone* is signed in. Whether that someone is an admin is settled in
 * src/app/admin/(protected)/layout.tsx, which is where the real gate lives.
 */
export async function middleware(request: NextRequest) {
  const { url, key } = readPublicSupabaseEnv();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    global: { fetch: createSupabaseFetch(key) },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // getUser() revalidates the token with Supabase. Never trust getSession()
  // here — it only decodes the cookie, which the client could have forged.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const isLoginPage = pathname === LOGIN_PATH;
  const isForbiddenPage = pathname === FORBIDDEN_PATH;

  if (!user && !isLoginPage && !isForbiddenPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_PATH;
    redirectUrl.search = "";
    redirectUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isLoginPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ADMIN_HOME_PATH;
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
