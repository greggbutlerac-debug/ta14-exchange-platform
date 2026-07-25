import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const VISIT_COOKIE = "ta14_visit_id";

type SiteActivityRpcRow = {
  new_visitor: boolean | null;
  visitors: number | null;
  page_views: number | null;
  updated_at: string | null;
};

export async function POST(req: NextRequest) {
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

    const body = (await req.json().catch(() => ({}))) as {
      path?: unknown;
    };

    const path =
      typeof body.path === "string" && body.path.trim().length > 0
        ? body.path.trim().slice(0, 2048)
        : "/";

    const cookieStore = await cookies();
    let visitId = cookieStore.get(VISIT_COOKIE)?.value;

    if (!visitId) {
      visitId = randomUUID();
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase.rpc("record_site_activity", {
      p_visit_id: visitId,
      p_path: path,
    });

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
      newVisitor: result?.new_visitor ?? false,
      visitors: result?.visitors ?? 0,
      pageViews: result?.page_views ?? 0,
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
