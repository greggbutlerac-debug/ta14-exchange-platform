import { createBrowserClient } from '@supabase/ssr';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Shared browser client for every TA-14 Academy Arcade.
 *
 * Configure these in Vercel for the TA14Exchange.com production project:
 * NEXT_PUBLIC_SUPABASE_URL
 * NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 *
 * Never place a service-role key in a NEXT_PUBLIC variable or client bundle.
 */
export function getArcadeSupabase() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;

  browserClient = createBrowserClient(url, publishableKey);
  return browserClient;
}

export const ARCADE_AUTH_CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
