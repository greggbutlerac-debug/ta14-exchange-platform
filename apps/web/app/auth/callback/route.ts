import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "../../../lib/supabase/server";
import { CANONICAL_EXCHANGE_ORIGIN, isVercelDeploymentHost } from "../../../lib/site/canonical-origin";

function safePath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\r\n\\]/.test(value)) {
    return "/workspace";
  }
  return value;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const next = safePath(url.searchParams.get("next"));
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const isRecovery = next.startsWith("/account-recovery/reset");
  // Supabase default recovery emails return fragment session tokens, invisible to server routes.
  // Serve a same-origin client bridge to establish the browser session before opening the reset form.
  if (isRecovery && !code && !tokenHash && !url.searchParams.has("error")) {
    const bridge = new URL("/auth/recovery/complete", url.origin);
    bridge.searchParams.set("next", next);
    return NextResponse.redirect(bridge);
  }
  const type = url.searchParams.get("type");

  // Keep preview callbacks on their preview host for cookie-based testing.
  // Production callbacks use the canonical Exchange origin.
  const origin = isVercelDeploymentHost(url.host)
    ? url.origin // Preview cookies must remain on the same host for isolated testing.
    : CANONICAL_EXCHANGE_ORIGIN;
  const supabase = await createClient();

  let error: { message: string } | null = null;
  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type === "recovery") {
    ({ error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    }));
  } else {
    error = { message: "Missing or unsupported authentication token" };
  }

  if (error) {
    const failure = new URL(type === "recovery" || next.startsWith("/account-recovery/") ? "/account-recovery" : "/login", origin);
    failure.searchParams.set("error", "The authentication link is invalid or expired. Request a new link.");
    failure.searchParams.set("next", next);
    return NextResponse.redirect(failure);
  }

  return NextResponse.redirect(new URL(next, origin));
}
