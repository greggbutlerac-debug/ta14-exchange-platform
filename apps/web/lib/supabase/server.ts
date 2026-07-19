import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getSupabasePublicEnvironment } from "./env";

export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  const environment = getSupabasePublicEnvironment();

  return createServerClient(
    environment.url,
    environment.publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            for (const cookie of cookiesToSet) {
              cookieStore.set(cookie.name, cookie.value, cookie.options);
            }
          } catch {
            /*
             * Server Components may read cookies but cannot always write them.
             * Session refresh and cookie persistence will be handled by the
             * account-system proxy that we install in a later step.
             */
          }
        },
      },
    },
  );
}
