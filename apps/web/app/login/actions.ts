"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

const DEFAULT_POST_AUTH_PATH = "/workspace/ai-governance/registry";

type NoticeType = "error" | "message";

type SupabaseAuthFailure = {
  code?: string;
  message?: string;
  status?: number;
};

function getRequiredField(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

function redirectToLogin(messageType: NoticeType, message: string): never {
  const searchParameters = new URLSearchParams({
    [messageType]: message,
  });

  redirect(`/login?${searchParameters.toString()}`);
}

async function getRequestOrigin(): Promise<string> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = forwardedHost ?? requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");

  if (host) {
    const protocol =
      forwardedProtocol ??
      (host.startsWith("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https");

    return `${protocol}://${host}`;
  }

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/$/, "");
  }

  return "https://www.ta14authority.org";
}

function normalizeAuthFailure(error: unknown): SupabaseAuthFailure {
  if (!error || typeof error !== "object") {
    return {};
  }

  const candidate = error as Record<string, unknown>;

  return {
    code: typeof candidate.code === "string" ? candidate.code : undefined,
    message:
      typeof candidate.message === "string" ? candidate.message : undefined,
    status: typeof candidate.status === "number" ? candidate.status : undefined,
  };
}

function getSignupErrorMessage(error: unknown): string {
  const failure = normalizeAuthFailure(error);
  const code = failure.code?.toLowerCase() ?? "";
  const message = failure.message?.toLowerCase() ?? "";

  if (
    code.includes("email_rate_limit") ||
    message.includes("email rate limit") ||
    message.includes("rate limit")
  ) {
    return "Account creation is temporarily waiting on the confirmation-email service. Please wait a few minutes and try again. TA-14 has recorded the service condition for review.";
  }

  if (
    code.includes("signup_disabled") ||
    message.includes("signups not allowed") ||
    message.includes("signup is disabled")
  ) {
    return "New account creation is temporarily disabled in the Exchange authentication service. TA-14 must enable email signups before registration can continue.";
  }

  if (
    code.includes("email_address_invalid") ||
    message.includes("invalid email") ||
    message.includes("email address") && message.includes("invalid")
  ) {
    return "Enter a valid email address and try again.";
  }

  if (
    code.includes("weak_password") ||
    message.includes("password") &&
      (message.includes("weak") || message.includes("characters"))
  ) {
    return "Use a stronger password containing at least eight characters.";
  }

  if (
    code.includes("user_already_exists") ||
    message.includes("already registered") ||
    message.includes("already exists")
  ) {
    return "An Exchange account already exists for this email address. Use Sign in, or use the password-recovery process if needed.";
  }

  return "The Exchange authentication service did not accept the account request. TA-14 has recorded the technical error. Please verify the email and password, then try again.";
}

function recordAuthFailure(operation: "login" | "signup", error: unknown): void {
  const failure = normalizeAuthFailure(error);

  console.error(`[TA-14 account ${operation} failure]`, {
    code: failure.code ?? "unknown",
    message: failure.message ?? "No Supabase error message returned.",
    status: failure.status ?? "unknown",
  });
}

export async function login(formData: FormData): Promise<never> {
  let email: string;
  let password: string;

  try {
    email = getRequiredField(formData, "email").toLowerCase();
    password = getRequiredField(formData, "password");
  } catch {
    redirectToLogin("error", "Enter both your email address and password.");
  }

  let loginFailure: unknown = null;

  try {
    const supabase = await createClient();
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    loginFailure = result.error;
  } catch (error) {
    loginFailure = error;
  }

  if (loginFailure) {
    recordAuthFailure("login", loginFailure);
    redirectToLogin(
      "error",
      "The email address or password was not accepted. If you just created the account, confirm your email before signing in.",
    );
  }

  redirect(DEFAULT_POST_AUTH_PATH);
}

export async function signup(formData: FormData): Promise<never> {
  let email: string;
  let password: string;
  let confirmPassword: string;

  try {
    email = getRequiredField(formData, "email").toLowerCase();
    password = getRequiredField(formData, "password");
    confirmPassword = getRequiredField(formData, "confirmPassword");
  } catch {
    redirectToLogin("error", "Complete every account-creation field.");
  }

  if (password.length < 8) {
    redirectToLogin(
      "error",
      "Your password must contain at least eight characters.",
    );
  }

  if (password !== confirmPassword) {
    redirectToLogin("error", "The passwords do not match.");
  }

  const requestOrigin = await getRequestOrigin();
  const confirmationRedirect = new URL("/auth/callback", requestOrigin);
  confirmationRedirect.searchParams.set("next", DEFAULT_POST_AUTH_PATH);

  let signupData: { user: unknown; session: unknown } | null = null;
  let signupFailure: unknown = null;

  try {
    const supabase = await createClient();
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: confirmationRedirect.toString(),
      },
    });

    signupData = {
      user: result.data.user,
      session: result.data.session,
    };
    signupFailure = result.error;
  } catch (error) {
    signupFailure = error;
  }

  if (signupFailure) {
    recordAuthFailure("signup", signupFailure);
    redirectToLogin("error", getSignupErrorMessage(signupFailure));
  }

  if (!signupData?.user) {
    const missingUserFailure = {
      code: "missing_user",
      message: "Supabase returned no user and no explicit error.",
    };
    recordAuthFailure("signup", missingUserFailure);
    redirectToLogin(
      "error",
      "The Exchange did not receive a completed account record. Please try again.",
    );
  }

  if (!signupData.session) {
    redirectToLogin(
      "message",
      "Your Exchange account was created. Open the confirmation email, then return and sign in. Check spam or quarantine folders if the message is delayed.",
    );
  }

  redirect(DEFAULT_POST_AUTH_PATH);
}

export async function logout(): Promise<never> {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}
