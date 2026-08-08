/**
 * Resolve the public Supabase API key used by server-side route handlers.
 *
 * Newer Supabase projects expose NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 * Older TA-14 deployments may still expose NEXT_PUBLIC_SUPABASE_ANON_KEY.
 *
 * Registration routes must use the same public-key contract as the
 * authentication layer so a user cannot authenticate successfully while
 * Registry persistence fails because a different environment variable is
 * expected.
 */
export function getSupabasePublicKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!key) {
    throw new Error(
      "Supabase public key is not configured. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return key;
}

/**
 * Resolve the configured Supabase project URL.
 */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!url) {
    throw new Error(
      "Supabase URL is not configured. Set NEXT_PUBLIC_SUPABASE_URL."
    );
  }

  return url;
}
