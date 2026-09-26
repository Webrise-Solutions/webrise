# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Webrise marketing site: built on **Next.js 16 (App Router)**, React 19, TypeScript, Tailwind CSS 4, and Supabase. It was migrated from TanStack Start + Vite; the project is no longer synced through Lovable.dev — deploys/builds are self-managed (e.g. Vercel).

> Note: `AGENTS.md` previously described this migration as a legacy, not-yet-followed plan, and warned to ignore it. That plan **has now been carried out** — this repo is on Next.js. If you see any lingering references elsewhere to TanStack Start/Router, Vite, Nitro, or Lovable sync, they're stale and should be corrected, not treated as current architecture.

## Commands

- `bun run dev` — start the Next.js dev server
- `bun run build` — production build
- `bun run start` — run a production build
- `bun run lint` — ESLint (flat config, `eslint.config.js`)
- `bun run format` — Prettier write
- `bun run check:env` — report missing required env vars and which optional features are on (names only, never values)

There is no configured test runner/suite in this repo currently.

Package manager: Bun (`bun.lockb`). The installed Bun here is 1.1.x, which predates Bun's JSON text-lockfile support (`bun.lock`) — the lockfile is the binary `bun.lockb` format. Upgrading to Bun 1.2+ would let `bun.lock` (text) work again if that's ever wanted, but isn't required.

## Architecture

### Routing & rendering
- **Next.js App Router**, source under `src/app/`. `src/app/layout.tsx` is the root layout (`<html>/<body>` shell + site-wide `metadata`); each route segment is `src/app/<segment>/page.tsx` with its own `metadata` export.
- Routes: `/` (`app/page.tsx`), `/services`, `/process`, `/industries`, `/faq`, `/tools`, `/contact` — each of the sub-pages renders `Header` + a "back to home" link + the matching section component (also rendered inline on the homepage) + `Footer`. `/tools` is the exception: it renders a combined `[...tools, ...additionalTools]` grid via `ToolCard`, not the homepage's `<Tools/>` section.
- `src/app/not-found.tsx`, `src/app/error.tsx` (Client Component, scoped to the route tree) and `src/app/global-error.tsx` (Client Component with its own `<html>/<body>`, must stay framework/CSS-independent since it replaces the whole root layout on catastrophic failure — inline styles only, no Tailwind classes) handle 404s and errors.
- No data loaders/route context of any kind are in use — every page is either a plain Server Component or has an inner Client Component for interactivity (forms, the mobile nav). Path alias `@/*` → `src/*` (`tsconfig.json`).

### Supabase integration (`src/integrations/supabase/`)
- `client.ts` — browser/isomorphic client using the **publishable** key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` client-side / `SUPABASE_PUBLISHABLE_KEY` server-side), respects RLS. Safe to import anywhere, including Client Components.
- `client.server.ts` — `supabaseAdmin`, uses the **service role** key (`SUPABASE_SERVICE_ROLE_KEY`), **bypasses RLS**. Marked with `import "server-only"`, so importing it from a Client Component is a build-time error — safe to import as a plain top-level import from Server Actions/Route Handlers.
- `types.ts` — generated Supabase `Database` types.

### Server Actions (`src/actions/`)
Business logic that talks to Supabase (or elsewhere) lives in `src/actions/*.ts` Server Actions (`"use server"` at the top of the file). Called straight from Client Components — no wrapper needed, and Server Actions have Next's built-in same-origin CSRF protection.

Two kinds:
- **Public** (`audit-requests.ts`, `leads.ts`, `quote-requests.ts`) — reachable without a session, so each one runs `guardSubmission()` first, parses with Zod, writes through `supabaseAdmin`, and sets `status` itself rather than taking it from the form.
- **Admin** (`src/actions/admin/*.ts`) — every one calls `requireAdmin()`, because a Server Action is a public HTTP endpoint regardless of which page imports it.

A `"use server"` module **may only export async functions**. A constant exported from one arrives on the client as something that is not the constant, and the first `.map()` over it throws during hydration. Shared constants go in `src/lib/` (see `service-clusters.ts`, `form-fields.ts`).

#### Public form pipeline
Every public form composes the same four pieces:
- `src/components/shared/FormShield.tsx` — honeypot, hydration timestamp, packed attribution, source page. Drop it inside any `<form>`; the parent needs `relative` so the off-screen honeypot does not widen the page. Its honeypot `id` comes from `useId()` — most pages carry two shielded forms now (the footer newsletter plus whatever is on the page), and a fixed id would be duplicated.
- `src/lib/form-guard.ts` — honeypot check, minimum fill time, and a per-IP rolling rate limit counted in `form_submission_log` (default 5 per hour per form). The address is stored only as a salted hash. **Fails open**: if the counter is unreadable the submission goes through, because a broken limiter must not eat real leads.
- `src/lib/submission-insert.ts` — inserts the row, and retries without the columns from `20260828120000_lead_capture.sql` if PostgREST answers `PGRST204`. That migration is applied, so the fallback is now dormant; it stays as the safety net for a deploy that outruns a future migration.
- `src/lib/notify.ts` — emails the team over SMTP (nodemailer; Gmail on port 587). No-ops with a log line when unconfigured; never throws, never blocks the submitter. Needs the Node runtime, since raw TCP is unavailable on edge.

Attribution is captured once per visit by `AttributionTracker` in the root layout (sessionStorage), not read from the URL at submit time — by then the campaign parameters are long gone.

Public forms and where they write:
| Form | Route | Action | Table |
| --- | --- | --- | --- |
| Contact | `/contact` | `submitContactLead` | `leads` |
| Call request | `/book-a-call` | `submitCallRequest` | `leads` (`source_page` `/book-a-call`) |
| Audit | `/audit`, homepage | `submitAuditRequest` | `audit_requests` |
| Quote | `/get-a-quote` | `submitQuoteRequest` | `quote_requests` |
| Newsletter | footer, `/blog` | `subscribeToNewsletter` | `newsletter_subscribers` |

`/unsubscribe?token=<uuid>` uses `newsletter_subscribers.unsubscribe_token`. The page **asks for confirmation**; the row only changes on a POST, because mail clients and security scanners fetch every URL in an email and a GET-driven unsubscribe would fire before the recipient saw it. Put that URL in the footer of any newsletter you send.

### Database
Schema lives in `supabase/migrations/`. `supabase/apply-pending.sql` is a consolidated copy of whatever has not been applied yet — paste it into the Supabase SQL editor and run it once. Migrations are the source of truth; regenerate that file rather than editing it. **Everything through `20260828120000_lead_capture.sql` is applied.**

Lead capture writes to three tables: `leads` (contact + call requests), `quote_requests` and `audit_requests`. All three carry attribution columns (`utm_*`, `referrer`, `landing_page`, `source_page`) plus `consent`.

RLS is on everywhere and **anon has no write access at all** — deliberately stricter than a plain "anon can INSERT" policy. Every public write goes through a Server Action using `supabaseAdmin`, which is what makes the honeypot, the rate limit, the forced `status: "new"` and the notification unavoidable; a direct PostgREST insert would skip all four. Anon reads are scoped: `blog_posts` and `case_studies` published-only, `services`/`industries`/`authors`/`blog_categories`/`testimonials` fully readable, `leads`/`quote_requests`/`audit_requests`/`newsletter_subscribers`/`admin_users`/`form_submission_log` invisible.

Storage buckets — `blog-media`, `case-study-media`, `testimonial-media`, `brand-assets` — are all public read with anon writes blocked; uploads go through `src/actions/admin/upload.ts`.

### UI structure
- `src/components/ui/` — shadcn/ui primitives (`components.json`: style "new-york", `rsc: true`, Tailwind base color "slate", Lucide icons). Import via the `@/components/ui/*` alias.
- `src/components/layout/` — `Header` (Client Component — mobile menu state), `Footer`.
- `src/components/sections/` — page sections composed in `src/app/page.tsx` (`Hero`, `TrustStrip`, `Services`, `WhyChoose`, `Process`, `Industries`, `Tools`, `AuditForm`, `Faq`, `ReadyToGrow`) and reused individually on their dedicated `/services`, `/process`, etc. pages. `AuditForm` and `ContactForm` are Client Components (form state + Server Action calls).
- `src/data/site.ts` / `src/types/site.ts` — static content and its types for the sections above (services, FAQs, process steps, tools, etc.) — the site is largely data-driven from here rather than hardcoded JSX.

## Environment variables

Client-exposed (Next.js `NEXT_PUBLIC_` prefix, safe to expose to the browser):
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_PROJECT_ID`
- `NEXT_PUBLIC_BOOKING_URL` (optional) — Cal.com/Calendly embed for `/book-a-call`. Unset, the page offers WhatsApp, email and phone instead.

Server-only (never expose to the client bundle):
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_ID`, and `SUPABASE_SERVICE_ROLE_KEY` (service role — required by `client.server.ts`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` (host, user and password all required to send), plus optional `LEAD_NOTIFICATION_FROM` / `LEAD_NOTIFICATION_TO` which both default to `SMTP_USER` — new-submission emails. Without them every submission is still saved; it just is not emailed, and each one logs a line saying so. Gmail needs an app password, not the account password.
- `FORM_HASH_SALT` (optional) — pepper for the hashed client address behind the rate limit. Falls back to the service role key.

All optional vars are declared in `src/types/env.d.ts`. `NEXT_PUBLIC_*` must be read with dot notation — Next only reliably inlines that form into the client bundle.

## Git

This repo is no longer connected to Lovable — no special git-history constraints beyond normal good practice (avoid force-pushing/rewriting published history on shared branches).
