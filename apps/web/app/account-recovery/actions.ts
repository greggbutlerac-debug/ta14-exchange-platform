"use server";

import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

const DEFAULT_NEXT = "/workspace/ai-governance/registry/register";
const CANONICAL_EXCHANGE_ORIGIN = "https://www.ta14exchange.com";

function safeNext(value: FormDataEntryValue | string | null | undefined): string {
  if (typeof value !== "string") return DEFAULT_NEXT;
  const next = value.trim();
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\n") || next.includes("\r")) return DEFAULT_NEXT;
  return next;
}

function recoveryOrigin(): string {
  // Recovery is an identity-continuity boundary. Do not derive its return
  // origin from deployment aliases or forwarded host headers: the recovered
  // session must return on the canonical Exchange host.
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured === CANONICAL_EXCHANGE_ORIGIN) return configured;
  return CANONICAL_EXCHANGE_ORIGIN;
}

export async function requestAccountRecovery(formData: FormData): Promise<never> {
  const rawEmail = formData.get("email");
  const next = safeNext(formData.get("next"));
  if (typeof rawEmail !== "string" || !rawEmail.trim()) {
    redirect(`/account-recovery?error=${encodeURIComponent("Enter the email address associated with your Exchange account.")}&next=${encodeURIComponent(next)}`);
  }

  const origin = recoveryOrigin();
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
