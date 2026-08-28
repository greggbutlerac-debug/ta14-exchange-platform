"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

const DEFAULT_NEXT = "/workspace/ai-governance/registry/register";

function safeNext(value: FormDataEntryValue | string | null | undefined): string {
  if (typeof value !== "string") return DEFAULT_NEXT;
  const next = value.trim();
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\n") || next.includes("\r")) return DEFAULT_NEXT;
  return next;
}

async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ta14exchange.com").replace(/\/$/, "");
}

export async function requestAccountRecovery(formData: FormData): Promise<never> {
  const rawEmail = formData.get("email");
  const next = safeNext(formData.get("next"));
  if (typeof rawEmail !== "string" || !rawEmail.trim()) {
    redirect(`/account-recovery?error=${encodeURIComponent("Enter the email address associated with your Exchange account.")}&next=${encodeURIComponent(next)}`);
  }

  const origin = await requestOrigin();

  // Password recovery already returns an authenticated recovery session to the
  // supplied redirect URL. Send it directly to the password-reset surface.
  // Routing it through /auth/callback incorrectly required a second `code`
  // parameter and could send a valid recovery visit back to /login.
  const recoveryDestination = new URL("/account-recovery/reset", origin);
  recoveryDestination.searchParams.set("next", next);

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(rawEmail.trim().toLowerCase(), {
    redirectTo: recoveryDestination.toString(),
  });

  if (error) {
    console.error("[TA-14 account recovery request failure]", { code: error.code, message: error.message, status: error.status });
    redirect(`/account-recovery?error=${encodeURIComponent("The Exchange could not send the recovery email. Please try again.")}&next=${encodeURIComponent(next)}`);
  }

  redirect(`/account-recovery?message=${encodeURIComponent("If an Exchange account exists for that email, a recovery link has been sent. Open it to set a new password.")}&next=${encodeURIComponent(next)}`);
}
