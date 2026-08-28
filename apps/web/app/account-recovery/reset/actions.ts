"use server";

import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";

function safeNext(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/workspace/ai-governance/registry/register";
  return value;
}

export async function updateRecoveredPassword(formData: FormData): Promise<never> {
  const next = safeNext(formData.get("next"));
  const password = formData.get("password");
  const confirm = formData.get("confirmPassword");
  if (typeof password !== "string" || password.length < 8) {
    redirect(`/account-recovery/reset?error=${encodeURIComponent("Use a password containing at least eight characters.")}&next=${encodeURIComponent(next)}`);
  }
  if (password !== confirm) {
    redirect(`/account-recovery/reset?error=${encodeURIComponent("The passwords do not match.")}&next=${encodeURIComponent(next)}`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/account-recovery?error=${encodeURIComponent("The recovery session is missing or expired. Request a new recovery link.")}&next=${encodeURIComponent(next)}`);
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("[TA-14 recovered password update failure]", { code: error.code, message: error.message, status: error.status });
    redirect(`/account-recovery/reset?error=${encodeURIComponent("The Exchange could not update the password. Request a new recovery link if this link has expired.")}&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}
