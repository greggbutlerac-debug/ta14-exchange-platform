import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });

  const ownerId = (process.env.TA14_SEO_OWNER_USER_ID || process.env.TA14_REVENUE_OWNER_USER_ID || "").trim();
  const adminEmails = new Set((process.env.TA14_SEO_ADMIN_EMAILS || process.env.NEXT_PUBLIC_TA14_MISSION_CONTROL_ADMIN_EMAILS || "ta14admissibleexecution@gmail.com,greggbutlerac@gmail.com").split(",").map(v => v.trim().toLowerCase()).filter(Boolean));
  const email = (user.email || "").trim().toLowerCase();
  if (!((ownerId && user.id === ownerId) || (email && adminEmails.has(email)))) return NextResponse.json({ error: "OWNER_ACCESS_REQUIRED" }, { status: 403 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "NOT_CONFIGURED" }, { status: 503 });
  const db = createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: trials, error } = await db.from("ta14_commercial_trials").select("user_id,plan_tier,status,started_at,ends_at,converted_at,source_visit_id,source_page,utm_source,utm_campaign").order("started_at", { ascending: false }).limit(5000);
  if (error) return NextResponse.json({ error: "TRIAL_QUERY_FAILED" }, { status: 500 });

  const external = (trials || []).filter((t: any) => String(t.user_id) !== String(user.id) && !t.converted_at);
  const ids = [...new Set(external.map((t: any) => String(t.user_id)).filter(Boolean))];
  const authEmail = new Map<string, string>();
  if (ids.length) {
    const { data: users } = await db.schema("auth").from("users").select("id,email").in("id", ids);
    for (const u of users || []) authEmail.set(String(u.id), String(u.email || "").trim().toLowerCase());
  }

  const { data: journeys } = ids.length ? await db.from("ta14_registry_registration_journeys_v1").select("user_id,account_email,governance_submission_count,latest_submission_status,latest_submission_created_at,latest_governance_name,latest_organization_name,latest_claimant_name,latest_contact_email").in("user_id", ids) : { data: [] as any[] };
  const { data: lifecycle } = ids.length ? await db.from("ta14_registry_registration_lifecycle_events").select("user_id,event_type,governance_name,organization_name,contact_email,created_at").in("user_id", ids).order("created_at", { ascending: false }).limit(5000) : { data: [] as any[] };
  const visitIds = [...new Set(external.map((t: any) => String(t.source_visit_id || "")).filter(Boolean))];
  const { data: events } = visitIds.length ? await db.from("ta14_seo_intelligence_events").select("occurred_at,event_type,visit_id,page_path,target_text,referrer_host,search_engine,country,region,city,device_class,intent_type,intent_score").in("visit_id", visitIds).order("occurred_at", { ascending: false }).limit(10000) : { data: [] as any[] };

  const journeyByUser = new Map((journeys || []).map((j: any) => [String(j.user_id), j]));
  const now = Date.now();
  const records = external.map((t: any) => {
    const uid = String(t.user_id);
    const j: any = journeyByUser.get(uid) || {};
    const le = (lifecycle || []).filter((x: any) => String(x.user_id) === uid);
    const ev = (events || []).filter((x: any) => String(x.visit_id) === String(t.source_visit_id || ""));
    const registrationOpens = le.filter((x: any) => x.event_type === "registration_page_opened").length;
    const intents = ev.filter((x: any) => x.intent_type);
    const highestIntent = intents.reduce((best: any, x: any) => Number(x.intent_score || 0) > Number(best?.intent_score || 0) ? x : best, null);
    const latestEvent = [...ev.map((x: any) => x.occurred_at), ...le.map((x: any) => x.created_at)].filter(Boolean).sort().reverse()[0] || t.started_at;
    const geo = ev.find((x: any) => x.city || x.region || x.country);
    const daysRemaining = Math.ceil((new Date(t.ends_at).getTime() - now) / 86400000);
    const submissionCount = Number(j.governance_submission_count || 0);
    const friction = registrationOpens > 1 && submissionCount === 0 ? "REGISTRATION_NOT_COMPLETED" : submissionCount > 0 ? "SUBMISSION_PRESENT" : "ACTIVATION_UNKNOWN";
    return {
      userId: uid,
      email: authEmail.get(uid) || j.account_email || t.source_email || null,
      tier: t.plan_tier,
      status: t.status,
      startedAt: t.started_at,
      endsAt: t.ends_at,
      daysRemaining,
      sourcePage: t.source_page || null,
      source: t.utm_source || ev.find((x: any) => x.search_engine)?.search_engine || ev.find((x: any) => x.referrer_host)?.referrer_host || "Direct / unknown",
      campaign: t.utm_campaign || null,
      location: geo ? [geo.city, geo.region, geo.country].filter(Boolean).join(", ") : null,
      device: geo?.device_class || null,
      registrationOpens,
      governanceSubmissionCount: submissionCount,
      latestSubmissionStatus: j.latest_submission_status || null,
      governanceName: j.latest_governance_name || le.find((x: any) => x.governance_name)?.governance_name || null,
      organizationName: j.latest_organization_name || le.find((x: any) => x.organization_name)?.organization_name || null,
      claimantName: j.latest_claimant_name || null,
      highestIntent: highestIntent ? { type: highestIntent.intent_type, score: Number(highestIntent.intent_score || 0), page: highestIntent.page_path || null } : null,
      lastActivityAt: latestEvent,
      friction,
      priority: daysRemaining <= 10 ? "CONVERSION_DUE" : friction === "REGISTRATION_NOT_COMPLETED" ? "ACTIVATION_ASSISTANCE" : daysRemaining <= 30 ? "VALUE_PROOF" : "ACTIVATION",
    };
  }).sort((a: any, b: any) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime());

  return NextResponse.json({ generatedAt: new Date().toISOString(), records });
}
