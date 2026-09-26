// Declaring these explicitly (rather than relying on ProcessEnv's index signature)
// lets `process.env.NEXT_PUBLIC_*` use plain dot notation, which Next.js's compiler
// requires to statically inline NEXT_PUBLIC_* vars into the client bundle —
// bracket notation is not reliably replaced. `noPropertyAccessFromIndexSignature`
// in tsconfig.json only exempts explicitly declared properties, hence this file.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_SITE_URL: string;
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
    readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
    readonly NEXT_PUBLIC_SUPABASE_PROJECT_ID: string;
    readonly SUPABASE_URL: string;
    readonly SUPABASE_PUBLISHABLE_KEY: string;
    readonly SUPABASE_PROJECT_ID: string;
    readonly SUPABASE_SERVICE_ROLE_KEY: string;

    // Optional. The features they enable degrade gracefully when unset:
    // /book-a-call offers direct channels instead of a calendar, submissions
    // are saved but not emailed, and the rate limiter peppers with the
    // service role key.
    readonly NEXT_PUBLIC_BOOKING_URL?: string;

    // SMTP for lead notifications. All three of host, user and password are
    // needed before anything sends.
    readonly SMTP_HOST?: string;
    readonly SMTP_PORT?: string;
    readonly SMTP_USER?: string;
    readonly SMTP_PASSWORD?: string;
    readonly LEAD_NOTIFICATION_FROM?: string;
    readonly LEAD_NOTIFICATION_TO?: string;

    readonly FORM_HASH_SALT?: string;
  }
}
