import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabasePublicEnvironment } from "./env";

export async function updateSession(
  request: NextRequest,
): Promise<NextResponse> {
  const environment = getSupabasePublicEnvironment();

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    environment.url,
    environment.publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          for (const cookie of cookiesToSet) {
            request.cookies.set(cookie.name, cookie.value);
          }

          response = NextResponse.next({
            request,
          });

          for (const cookie of cookiesToSet) {
            response.cookies.set(
              cookie.name,
              cookie.value,
              cookie.options,
            );
          }
        },
      },
    },
  );

  /*
   * This server-confirmed request validates the current authentication
   * state and refreshes expired credentials when necessary.
   *
   * Do not remove this call or place unrelated logic between client
   * creation and this authentication check.
   */
  await supabase.auth.getUser();

  return response;
}
