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

function toSafeNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) && value >= 0 ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }
  return null;
}

export async function POST(_req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Site activity configuration error: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
      return NextResponse.json({ counted: false, error: "Site activity is not configured." }, { status: 503 });
    }

    const cookieStore = await cookies();
    const existingVisitId = cookieStore.get(VISIT_COOKIE)?.value;
    const isNewVisitor = !existingVisitId;
    const visitId = existingVisitId ?? randomUUID();

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabase.rpc("increment_ta14_site_activity", { p_new_visitor: isNewVisitor });
    if (error) {
      console.error("Site activity RPC error:", error);
      return NextResponse.json({ counted: false, error: "Unable to record site activity." }, { status: 500 });
    }

    const result = (Array.isArray(data) ? data[0] : data) as SiteActivityRpcRow | null | undefined;
    const visitors = toSafeNumber(result?.total_visitors);
    const pageViews = toSafeNumber(result?.total_page_views);
    if (!result || visitors === null || pageViews === null) {
      console.error("Site activity RPC returned an incomplete or invalid aggregate row.", result);
      return NextResponse.json({ counted: false, error: "Site activity totals are unavailable." }, { status: 503 });
    }

    // Public institutional metrics are deliberately bounded to counts that can be
    // established from the Exchange's own ledgers. They are activity/state metrics,
    // not certification, efficacy, or universal execution claims.
    const [registry, profiles, geography, academy, showrooms, receipts, reports] = await Promise.all([
      supabase.from("ai_governance_registry_submissions").select("id", { count: "exact", head: true }).eq("status", "registered"),
      supabase.from("ta14_governance_profiles").select("id", { count: "exact", head: true }).eq("profile_status", "published"),
      supabase.from("ta14_seo_intelligence_events").select("country").not("country", "is", null),
      supabase.from("ta14_seo_intelligence_events").select("visit_id").ilike("page_path", "%academy%"),
      supabase.from("ta14_seo_intelligence_events").select("visit_id").ilike("page_path", "%governance-showcase%"),
      supabase.from("ta14_afa_eaba_challenge_receipts").select("receipt_id", { count: "exact", head: true }),
      supabase.from("ta14_afa_eaba_challenge_reports").select("report_id", { count: "exact", head: true }),
    ]);

    const countries = new Set((geography.data ?? []).map((row) => row.country).filter(Boolean)).size;
    const academyVisits = new Set((academy.data ?? []).map((row) => row.visit_id).filter(Boolean)).size;
    const showroomVisits = new Set((showrooms.data ?? []).map((row) => row.visit_id).filter(Boolean)).size;

    const response = NextResponse.json({
      counted: true,
      newVisitor: isNewVisitor,
      visitors,
      pageViews,
      firstRecordedAt: result.first_recorded_at ?? null,
      updatedAt: result.updated_at ?? null,
      institutional: {
        registeredGovernances: registry.count ?? null,
        publishedShowrooms: profiles.count ?? null,
        countriesObserved: geography.error ? null : countries,
        academyVisits: academy.error ? null : academyVisits,
        showroomVisits: showrooms.error ? null : showroomVisits,
        afaEabaReceipts: receipts.count ?? null,
        afaEabaReports: reports.count ?? null,
      },
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
    return NextResponse.json({ counted: false, error: "Unable to record site activity." }, { status: 500 });
  }
}
