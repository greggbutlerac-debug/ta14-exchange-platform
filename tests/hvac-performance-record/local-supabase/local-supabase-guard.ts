/** Loopback-only guard shared by the local Supabase suites (same rule as #704's suite). */
export function isLocalSupabaseUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' && (u.hostname === '127.0.0.1' || u.hostname === 'localhost');
  } catch {
    return false;
  }
}
