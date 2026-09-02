import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "./lib/supabase/middleware";

const SHOWCASE_PREFIX = "/workspace/ai-governance/registry/showcase";
const PUBLIC_SHOWCASE_PREFIX = "/public/ai-governance/registry/showcase";
const OPERATIONAL_MISSION_PREFIX =
  "/workspace/ai-governance/operational-mission-records/onuma-re1";
const PUBLIC_OPERATIONAL_MISSION_PREFIX =
  "/public/ai-governance/operational-mission-records/onuma-re1";

export async function middleware(request: NextRequest) {
  const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  request.headers.set("x-ta14-requested-path", requestedPath);

  // Published governance identities, showcase records, provenance series, and
  // governed showcase artifacts are public institutional evidence. They must
  // remain anonymously inspectable. Registration, review, mission-control,
  // drafts, account functions, and other workspace routes remain protected.
  if (
    request.nextUrl.pathname === SHOWCASE_PREFIX ||
    request.nextUrl.pathname.startsWith(`${SHOWCASE_PREFIX}/`)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `${PUBLIC_SHOWCASE_PREFIX}${request.nextUrl.pathname.slice(SHOWCASE_PREFIX.length)}`;
    return NextResponse.rewrite(url, { request: { headers: request.headers } });
  }

  // OMR-000001 is a published institutional evidence artifact. Rewrite only
  // this canonical workspace URL to its anonymous rendering boundary so the
  // parent authenticated AI-governance layout is never entered. The public
  // page reuses the canonical OMR page and bridge components; authoring and
  // every other workspace route remain protected.
  if (
    request.nextUrl.pathname === OPERATIONAL_MISSION_PREFIX ||
    request.nextUrl.pathname.startsWith(`${OPERATIONAL_MISSION_PREFIX}/`)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `${PUBLIC_OPERATIONAL_MISSION_PREFIX}${request.nextUrl.pathname.slice(OPERATIONAL_MISSION_PREFIX.length)}`;
    return NextResponse.rewrite(url, { request: { headers: request.headers } });
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
