import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const VISIT_COOKIE = "ta14_visit_id";

type SiteActivityRpcRow = {
  id: number | null;
  total_visitors: number | string | null;
  total_page_views: number | string | null;
  first_recorded_at: string | null;
  updated_at: string | null;
};

function toSafeNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export async function POST(_req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "Site activity configuration error: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
      );

      return NextResponse.json(
        {
          counted: false,
          error: "Site activity is not configured.",
        },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const existingVisitId = cookieStore.get(VISIT_COOKIE)?.value;
    const isNewVisitor = !existingVisitId;
    const visitId = existingVisitId ?? randomUUID();

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase.rpc(
      "increment_ta14_site_activity",
      {
        p_new_visitor: isNewVisitor,
      }
    );

    if (error) {
      console.error("Site activity RPC error:", error);

      return NextResponse.json(
        {
          counted: false,
          error: "Unable to record site activity.",
        },
        { status: 500 }
      );
    }

    const result = (Array.isArray(data) ? data[0] : data) as
      | SiteActivityRpcRow
      | null
      | undefined;

    const response = NextResponse.json({
      counted: true,
      newVisitor: isNewVisitor,
      visitors: toSafeNumber(result?.total_visitors),
      pageViews: toSafeNumber(result?.total_page_views),
      firstRecordedAt: result?.first_recorded_at ?? null,
      updatedAt: result?.updated_at ?? null,
    });

    response.cookies.set({
      name: VISIT_COOKIE,
      value: visitId,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (error) {
    console.error("Site activity error:", error);

    return NextResponse.json(
      {
        counted: false,
        error: "Unable to record site activity.",
      },
      { status: 500 }
    );
  }
}
