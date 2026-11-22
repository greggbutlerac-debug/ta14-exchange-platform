/**
 * Resolves the HPR caller from the Supabase cookie session. SERVER ONLY.
 *
 * auth.getUser() sends the access token to Supabase Auth, which verifies it;
 * a decoded-but-unverified JWT is never accepted. Only cookies are read: an
 * Authorization header, a technicianId field or any other client-supplied
 * identity is ignored.
 */
import {createServerClient} from '@supabase/ssr';

import {getSupabasePublicEnvironment} from '../../supabase/env';
import {userDatabasePort} from './supabase-ports';
import type {Authenticated} from './upload-handler';

export type CookieSource = {getAll(): Array<{name: string; value: string}>};

export async function authenticateFromCookies(cookies: CookieSource): Promise<Authenticated | null> {
  const env = getSupabasePublicEnvironment();
  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll: () => cookies.getAll(),
      // Session refresh is not persisted from this route; an expired access
      // token fails authentication instead of being silently refreshed.
      setAll: () => undefined,
    },
  });
  const {data, error} = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return {userId: data.user.id, db: userDatabasePort(supabase)};
}
