"use server";

import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

function getRequiredField(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

function redirectToLogin(messageType: "error" | "message", message: string): never {
  const searchParameters = new URLSearchParams({
    [messageType]: message,
  });

  redirect(`/login?${searchParameters.toString()}`);
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

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectToLogin(
      "error",
      "The email address or password was not accepted.",
    );
  }

  redirect("/workspace");
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

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirectToLogin(
      "error",
      "The account could not be created. Please verify the information and try again.",
    );
  }

  if (!data.session) {
    redirectToLogin(
      "message",
      "Your account was created. Check your email to confirm the account before signing in.",
    );
  }

  redirect("/workspace");
}

export async function logout(): Promise<never> {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}
