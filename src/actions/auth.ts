"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/integrations/supabase/server";
import { isAdmin } from "@/lib/admin-auth";
import { ADMIN_HOME_PATH, LOGIN_PATH } from "@/lib/routes";

const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(200),
  password: z.string().min(1, "Enter your password").max(200),
  next: z.string().trim().max(500).optional(),
});

export type SignInState = { error?: string };

/**
 * Only allow redirects back into this site, so `?next=` cannot be used to
 * bounce a freshly signed-in admin to an attacker's domain.
 */
function safeNextPath(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return ADMIN_HOME_PATH;
  return next;
}

/**
 * Signature is (prevState, formData) so it can be passed straight to
 * useActionState and to <form action>. That matters: when a Server Action is
 * awaited by hand inside startTransition, the NEXT_REDIRECT thrown by
 * redirect() lands in that callback and the navigation never happens.
 */
export async function signIn(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const nextValue = formData.get("next");

  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    ...(typeof nextValue === "string" && nextValue ? { next: nextValue } : {}),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details and try again." };
  }

  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !authData.user) {
    // Deliberately vague: a precise message would confirm which addresses
    // have accounts.
    return { error: "Those details do not match an account." };
  }

  if (!(await isAdmin(authData.user.id))) {
    await supabase.auth.signOut();
    return { error: "That account does not have admin access." };
  }

  revalidatePath(ADMIN_HOME_PATH, "layout");

  // Must stay outside any try/catch — redirect() works by throwing.
  redirect(safeNextPath(parsed.data.next));
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath(ADMIN_HOME_PATH, "layout");
  redirect(LOGIN_PATH);
}
