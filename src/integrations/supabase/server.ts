import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types";
import { createSupabaseFetch, readPublicSupabaseEnv } from "./api-key-fetch";

/**
 * Session-aware server client, scoped to the signed-in user and bound by RLS.
 *
 * Reads and writes the auth cookies through `next/headers`, so Server
 * Components, Server Actions and Route Handlers all see the same session the
 * browser has. Not the same thing as `./client.server` — that one uses the
 * service role and ignores RLS entirely.
 */
export async function createClient() {
  const { url, key } = readPublicSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    global: { fetch: createSupabaseFetch(key) },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. Safe to ignore: the
          // middleware refreshes the session on every matched request.
        }
      },
    },
  });
}
