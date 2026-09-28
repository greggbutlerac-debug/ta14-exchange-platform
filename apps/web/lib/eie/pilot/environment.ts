/**
 * Tier 1 pilot environment guard (P4 = 4a). The pilot surface is inert unless ALL hold:
 *   1. TA14_EIE_PILOT_ENABLED === "true" (explicit feature flag);
 *   2. the Supabase project reference (from NEXT_PUBLIC_SUPABASE_URL) is in TA14_EIE_PILOT_PROJECT_REFS;
 *   3. the request is addressed to the local host (Phase 3 is local-only);
 *   4. the process is not running in a Vercel deployment.
 * Anything else answers 404. Reasons are returned for diagnostics only and never reveal configuration values.
 */
export type PilotGuard = { enabled: true; projectRef: string } | { enabled: false; reasons: string[] };

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export function supabaseProjectRef(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    const match = /^([a-z0-9]+)\.supabase\.co$/.exec(host);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function pilotGuard(env: Record<string, string | undefined>, requestHost: string | null): PilotGuard {
  const reasons: string[] = [];
  if (env.TA14_EIE_PILOT_ENABLED !== "true") reasons.push("PILOT_FLAG_ABSENT");
  const allowlist = (env.TA14_EIE_PILOT_PROJECT_REFS ?? "").split(",").map((r) => r.trim()).filter(Boolean);
  if (allowlist.length === 0) reasons.push("PILOT_ALLOWLIST_ABSENT");
  const ref = supabaseProjectRef(env.NEXT_PUBLIC_SUPABASE_URL);
  if (!ref) reasons.push("PILOT_PROJECT_UNIDENTIFIED");
  else if (!allowlist.includes(ref)) reasons.push("PILOT_PROJECT_NOT_ALLOWLISTED");
  const hostname = requestHost ? requestHost.replace(/:\d+$/, "").toLowerCase() : "";
  if (!LOCAL_HOSTS.has(hostname)) reasons.push("PILOT_NOT_LOCAL");
  if (env.VERCEL || env.VERCEL_ENV) reasons.push("PILOT_DEPLOYED_ENVIRONMENT");
  return reasons.length === 0 && ref ? { enabled: true, projectRef: ref } : { enabled: false, reasons };
}
