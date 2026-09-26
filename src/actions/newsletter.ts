"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SOURCE_PAGE_FIELD } from "@/lib/form-fields";
import { guardSubmission, recordSubmission } from "@/lib/form-guard";

export type NewsletterState = { error?: string; sent?: boolean };

const subscribeSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(200).toLowerCase(),
  source_page: z.string().trim().max(200),
});

/**
 * Newsletter signup.
 *
 * Written with the service role rather than letting the browser insert
 * directly. `newsletter_subscribers.email` is unique, so a direct anon insert
 * answers a duplicate with a unique-violation — which turns the form into an
 * oracle for "is this address on the list?". Going through here means the
 * response is identical either way.
 *
 * For the same reason a resubscribe is silently upserted rather than reported:
 * someone who unsubscribed and signed up again gets reactivated, and nobody
 * learns anything about anybody else's address.
 */
export async function subscribeToNewsletter(
  _previous: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const guard = await guardSubmission({ form: "newsletter", formData, max: 8 });

  if (!guard.ok) {
    return guard.silent ? { sent: true } : { error: guard.message };
  }

  const parsed = subscribeSchema.safeParse({
    email: (formData.get("email") ?? "").toString(),
    source_page: (formData.get(SOURCE_PAGE_FIELD) ?? "").toString(),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  }

  const { email, source_page } = parsed.data;

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    console.error("[newsletter] lookup failed", lookupError);
    return { error: "Something went wrong. Please try again in a moment." };
  }

  if (existing) {
    // Already active: nothing to do, and we say the same thing either way.
    if (existing.status !== "active") {
      const { error } = await supabaseAdmin
        .from("newsletter_subscribers")
        .update({ status: "active", unsubscribed_at: null })
        .eq("id", existing.id);

      if (error) {
        console.error("[newsletter] resubscribe failed", error);
        return { error: "Something went wrong. Please try again in a moment." };
      }
    }
  } else {
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email, status: "active", source_page: source_page || null });

    // 23505 means someone subscribed between the lookup and the insert. That
    // is the outcome they wanted, so it is not an error to report.
    if (error && error.code !== "23505") {
      console.error("[newsletter] insert failed", error);
      return { error: "Something went wrong. Please try again in a moment." };
    }
  }

  await recordSubmission("newsletter", guard.ipHash);
  return { sent: true };
}

/**
 * Token-based unsubscribe.
 *
 * The token is the row's own `unsubscribe_token` uuid, so the link works
 * without a login and without exposing the address in the URL. Unknown tokens
 * report success: a wrong token is either a mangled link or someone guessing,
 * and neither should be told which.
 */
export async function unsubscribeByToken(token: string): Promise<{ ok: boolean }> {
  const parsed = z.string().uuid().safeParse(token);
  if (!parsed.success) return { ok: false };

  const { error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", parsed.data);

  if (error) {
    console.error("[newsletter] unsubscribe failed", error);
    return { ok: false };
  }

  return { ok: true };
}

export async function unsubscribeAction(
  _previous: { done?: boolean; error?: string },
  formData: FormData,
): Promise<{ done?: boolean; error?: string }> {
  const result = await unsubscribeByToken((formData.get("token") ?? "").toString());
  return result.ok ? { done: true } : { error: "That link is not valid. Please email us instead." };
}
