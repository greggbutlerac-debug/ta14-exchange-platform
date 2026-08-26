import type { User } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "../supabase/server";

function safeRequestedPath(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/login")) {
    return null;
  }
  return value;
}

export async function requireUser(): Promise<User> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const requestHeaders = await headers();
    const requestedPath = safeRequestedPath(
      requestHeaders.get("x-ta14-requested-path"),
    );
    const searchParameters = new URLSearchParams({
      error: "Sign in to enter your governed workspace.",
    });

    if (requestedPath) {
      searchParameters.set("next", requestedPath);
    }

    redirect(`/login?${searchParameters.toString()}`);
  }

  return user;
}
