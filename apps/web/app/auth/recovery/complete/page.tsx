"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../lib/supabase/client";

function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") && !/[\\\r\n]/.test(value)
    ? value : "/account-recovery/reset";
}

export default function RecoverySessionPage() {
  const [message, setMessage] = useState("Completing secure account recovery…");
  useEffect(() => {
    let active = true;
    async function complete() {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const query = new URLSearchParams(window.location.search);
      const next = safeNext(query.get("next"));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const error = params.get("error_description") || params.get("error");
      // Clear tokens from browser history before any asynchronous work.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      if (error || !access_token || !refresh_token) {
        if (active) setMessage("The recovery link could not establish a session. Please request a new link.");
        return;
      }
      const supabase = createClient();
      const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
      if (sessionError) {
        if (active) setMessage("The recovery session could not be established. Please request a new link.");
        return;
      }
      window.location.replace(next);
    }
    void complete();
    return () => { active = false; };
  }, []);
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#080b12", color: "#f7f8fb", fontFamily: "system-ui,sans-serif" }}><section role="status" style={{ maxWidth: 540, padding: 32, background: "#111725", borderRadius: 20 }}><h1>TA-14 Exchange account recovery</h1><p>{message}</p><a href="/account-recovery" style={{ color: "#9bb0ff" }}>Request a new recovery link</a></section></main>;
}
