import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const VISITOR_COOKIE_NAME = "ta14_exchange_visitor";
const VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type SiteActivityRecord = {
  id: number;
  total_visitors: number;
  total_page_views: number;
  first_recorded_at: string;
  updated_at: string;
};

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function isLikelyAutomatedRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() ?? "";

  if (!userAgent) {
    return true;
  }

  return [
    "bot",
    "crawler",
    "spider",
    "slurp",
    "headless",
    "lighthouse",
    "pagespeed",
    "preview",
    "vercel-screenshot",
  ].some((token) => userAgent.includes(token));
}

function buildSupabaseHeaders(serviceKey: string): HeadersInit {
  const headers: Record<string, string> = {
    apikey: serviceKey,
    "Content-Type": "application/json",
  };

  // Legacy service_role keys are JWTs and may be used as bearer tokens.
  // Modern sb_secret_ keys are opaque API keys and must not be treated as JWTs.
  if (!serviceKey.startsWith("sb_secret_")) {
    headers.Authorization = `Bearer ${serviceKey}`;
  }

  return headers;
}

async function incrementSiteActivity(
  isNewVisitor: boolean,
): Promise<SiteActivityRecord> {
  const supabaseUrl = getRequiredEnvironmentVariable(
    "NEXT_PUBLIC_SUPABASE_URL",
  );
  const serviceRoleKey = getRequiredEnvironmentVariable(
    "SUPABASE_SERVICE_ROLE_KEY",
  );

  const response = await fetch(
    `${supabaseUrl}/rest/v1/rpc/increment_ta14_site_activity`,
    {
      method: "POST",
      headers: buildSupabaseHeaders(serviceRoleKey),
      body: JSON.stringify({
        p_new_visitor: isNewVisitor,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `Unable to increment TA-14 site activity (${response.status}): ${details}`,
    );
  }

  const payload = (await response.json()) as
    | SiteActivityRecord
    | SiteActivityRecord[];

  const record = Array.isArray(payload) ? payload[0] : payload;

  if (!record) {
    throw new Error("TA-14 site activity RPC returned no record.");
  }

  return record;
}

export async function POST(request: NextRequest) {
  try {
    if (isLikelyAutomatedRequest(request)) {
      return NextResponse.json(
        {
          counted: false,
          reason: "automated_request",
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const existingVisitorCookie = request.cookies.get(
      VISITOR_COOKIE_NAME,
    )?.value;

    const isNewVisitor = !existingVisitorCookie;
    const activity = await incrementSiteActivity(isNewVisitor);

    const response = NextResponse.json(
      {
        counted: true,
        newVisitor: isNewVisitor,
        visitors: activity.total_visitors,
        pageViews: activity.total_page_views,
        updatedAt: activity.updated_at,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );

    if (isNewVisitor) {
      response.cookies.set({
        name: VISITOR_COOKIE_NAME,
        value: crypto.randomUUID(),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: VISITOR_COOKIE_MAX_AGE_SECONDS,
      });
    }

    return response;
  } catch (error) {
    console.error("TA-14 site activity error:", error);

    return NextResponse.json(
      {
        counted: false,
        error: "site_activity_unavailable",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
