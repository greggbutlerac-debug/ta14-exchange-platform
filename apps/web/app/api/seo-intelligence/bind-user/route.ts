import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VISIT_COOKIE = "ta14_seo_visit_id";

export async function POST() {
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ ok: true, bound: false, reason: "anonymous" });

  const cookieStore = await cookies();
  const visitId = cookieStore.get(VISIT_COOKIE)?.value?.trim();
  if (!visitId) return NextResponse.json({ ok: true, bound: false, reason: "no_visit" });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });

  const db = createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db.rpc("ta14_bind_seo_visit_to_user_v1", {
    p_user_id: user.id,
    p_visit_id: visitId,
  });

  if (error) {
    console.error("TA14_SEO_USER_BIND_FAILED", { code: error.code, message: error.message });
    return NextResponse.json({ ok: false, reason: "bind_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, bound: data === true });
}
