import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

const VISIT_COOKIE = "ta14_visit_id";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();

    const cookieStore = await cookies();

    let visitId = cookieStore.get(VISIT_COOKIE)?.value;

    if (!visitId) {
      visitId = randomUUID();
    }

    const { data, error } = await supabase.rpc(
      "record_site_activity",
      {
        p_visit_id: visitId,
        p_path: path,
      }
    );

    if (error) {
      throw error;
    }

    const result = data?.[0];

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
      },
      { status: 500 }
    );
  }
}
