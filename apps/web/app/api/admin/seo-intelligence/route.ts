import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  const ownerId = (process.env.TA14_SEO_OWNER_USER_ID || process.env.TA14_REVENUE_OWNER_USER_ID || "").trim();
  if (!ownerId || user.id !== ownerId) return NextResponse.json({ error: "OWNER_ACCESS_REQUIRED" }, { status: 403 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "NOT_CONFIGURED" }, { status: 503 });
  const db = createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data, error } = await db.from("ta14_seo_intelligence_events").select("occurred_at,event_type,visit_id,page_path,target_text,referrer_host,search_engine,search_query,utm_source,utm_campaign,utm_term,country,region,city,device_class").gte("occurred_at", since).order("occurred_at", { ascending: false }).limit(10000);
  if (error) return NextResponse.json({ error: "QUERY_FAILED" }, { status: 500 });
  const rows = data || [];
  const views = rows.filter((r:any) => r.event_type === "page_view");
  const clicks = rows.filter((r:any) => r.event_type === "click");
  function rank(key:string, source:any[]=views) { const counts:Record<string,number>={}; for(const r of source){const v=String(r[key]||"").trim();if(v)counts[v]=(counts[v]||0)+1;} return Object.entries(counts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,50); }
  const loc:Record<string,number>={}; for(const r of views){const v=[r.city,r.region,r.country].filter(Boolean).join(", ");if(v)loc[v]=(loc[v]||0)+1;}
  return NextResponse.json({ generatedAt:new Date().toISOString(), windowDays:30, summary:{pageViews:views.length,uniqueVisitors:new Set(views.map((r:any)=>r.visit_id).filter(Boolean)).size,clicks:clicks.length,searchArrivals:views.filter((r:any)=>r.search_engine).length}, pages:rank("page_path"), searchEngines:rank("search_engine"), searchQueries:rank("search_query"), referrers:rank("referrer_host"), campaigns:rank("utm_campaign"), sources:rank("utm_source"), terms:rank("utm_term"), devices:rank("device_class"), locations:Object.entries(loc).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,50), clickTargets:rank("target_text",clicks), recent:rows.slice(0,100) });
}
