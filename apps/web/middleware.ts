import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "./lib/supabase/middleware";

const SHOWCASE_PREFIX = "/workspace/ai-governance/registry/showcase";
const PUBLIC_SHOWCASE_PREFIX = "/public/ai-governance/registry/showcase";
const OPERATIONAL_MISSION_INDEX = "/workspace/ai-governance/operational-mission-records";
const PUBLIC_OPERATIONAL_MISSION_INDEX = "/public/ai-governance/operational-mission-records";
const OPERATIONAL_MISSION_PREFIX = "/workspace/ai-governance/operational-mission-records/onuma-re1";
const PUBLIC_OPERATIONAL_MISSION_PREFIX = "/public/ai-governance/operational-mission-records/onuma-re1";
const FRONT_DOOR_PREVIEW = "/front-door-preview";
const ARCHITECTURE_SHOWROOM = "/ai-governance/ta14-architecture-showroom";
const PUBLIC_ROUTE_PREFIXES = [
  "/academy",
  "/commercial",
  "/environmental-integrity-governance",
];

export async function middleware(request: NextRequest) {
  const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  request.headers.set("x-ta14-requested-path", requestedPath);

  // Public institutional, learning, and commercial surfaces do not require
  // account/session middleware. This keeps public acquisition routes usable
  // even when Supabase authentication is unavailable or intentionally absent.
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === FRONT_DOOR_PREVIEW ||
    request.nextUrl.pathname === ARCHITECTURE_SHOWROOM ||
    request.nextUrl.pathname.startsWith(`${ARCHITECTURE_SHOWROOM}/`) ||
    PUBLIC_ROUTE_PREFIXES.some(
      (prefix) =>
        request.nextUrl.pathname === prefix ||
        request.nextUrl.pathname.startsWith(`${prefix}/`),
    )
  ) {
    return NextResponse.next({ request });
  }

  if (
    request.nextUrl.pathname === SHOWCASE_PREFIX ||
    request.nextUrl.pathname.startsWith(`${SHOWCASE_PREFIX}/`)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `${PUBLIC_SHOWCASE_PREFIX}${request.nextUrl.pathname.slice(SHOWCASE_PREFIX.length)}`;
    return NextResponse.rewrite(url, { request: { headers: request.headers } });
  }

  if (request.nextUrl.pathname === OPERATIONAL_MISSION_INDEX) {
    const url = request.nextUrl.clone();
    url.pathname = PUBLIC_OPERATIONAL_MISSION_INDEX;
    return NextResponse.redirect(url, 308);
  }

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
