"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";
import { createSupabaseFetch, readPublicSupabaseEnv } from "./api-key-fetch";

/**
 * Browser client for authentication.
 *
 * Unlike `./client`, which keeps the session in localStorage, this one stores
 * it in cookies — the only place middleware and Server Components can read it.
 * Use this for anything auth-related; use `./client` for anonymous data reads
 * that never need a server-visible session.
 */
export function createClient() {
  const { url, key } = readPublicSupabaseEnv();

  return createBrowserClient<Database>(url, key, {
    global: { fetch: createSupabaseFetch(key) },
  });
}
