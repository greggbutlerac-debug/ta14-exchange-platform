import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const FUNNEL = ["pricing_viewed","bounded_exam_clicked","intake_started","intake_completed","payment_started","payment_completed","examination_delivered","expanded_engagement_started"] as const;

function sourceOf(row:any) {
  return String(row.utm_source || row.search_engine || row.referrer_host || "Direct / unknown");
}

export async function GET() {
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  const ownerId = (process.env.TA14_SEO_OWNER_USER_ID || process.env.TA14_REVENUE_OWNER_USER_ID || "").trim();
  const adminEmails = new Set((process.env.TA14_SEO_ADMIN_EMAILS || process.env.NEXT_PUBLIC_TA14_MISSION_CONTROL_ADMIN_EMAILS || "ta14admissibleexecution@gmail.com,greggbutlerac@gmail.com").split(",").map(v=>v.trim().toLowerCase()).filter(Boolean));
  const email=(user.email||"").trim().toLowerCase();
  if (!((ownerId && user.id===ownerId) || (email && adminEmails.has(email)))) return NextResponse.json({error:"OWNER_ACCESS_REQUIRED"},{status:403});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return NextResponse.json({error:"NOT_CONFIGURED"},{status:503});
  const db=createServiceClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const since=new Date(Date.now()-30*86400000).toISOString();
  const [er,sr]=await Promise.all([
    db.from("ta14_seo_intelligence_events").select("occurred_at,event_type,visit_id,page_path,target_href,target_text,referrer_host,search_engine,utm_source,utm_medium,utm_campaign,metadata").gte("occurred_at",since).order("occurred_at",{ascending:true}).limit(20000),
    db.from("ta14_seo_subscription_attribution_v1").select("owner_user_id,plan_key,status,first_visit_id,latest_visit_id,first_touch,latest_touch").limit(5000)
  ]);
  if(er.error)return NextResponse.json({error:"COMMERCIAL_JOURNEY_QUERY_FAILED"},{status:500});
  const events=(er.data||[]).filter((e:any)=>!(e.metadata&&typeof e.metadata==="object"&&e.metadata.operator===true));
  const byVisit=new Map<string,any[]>();
  for(const e of events as any[]){const id=String(e.visit_id||"");if(!id)continue;const a=byVisit.get(id)||[];a.push(e);byVisit.set(id,a);}
  const subscriptions=sr.error?[]:(sr.data||[]);
  const paidByVisit=new Map<string,any[]>();
  for(const s of subscriptions as any[]){if(!["ACTIVE","APPROVAL_PENDING","APPROVED"].includes(String(s.status||"").toUpperCase()))continue;for(const id of [s.first_visit_id,s.latest_visit_id].filter(Boolean).map(String)){const a=paidByVisit.get(id)||[];a.push(s);paidByVisit.set(id,a);}}
  const journeys=[...byVisit].map(([visitId,rows])=>{
    rows.sort((a,b)=>new Date(a.occurred_at).getTime()-new Date(b.occurred_at).getTime());
    const first=rows[0], firstCommercial=rows.find(r=>FUNNEL.includes(r.event_type as any));
    const stages=FUNNEL.map(stage=>{const e=rows.find(r=>r.event_type===stage);return e?{stage,at:e.occurred_at,page:e.page_path}:null}).filter(Boolean);
    const lastStage=stages.length?stages[stages.length-1]:null;
    const nextAfterCommercial=firstCommercial?rows.find(r=>new Date(r.occurred_at).getTime()>new Date(firstCommercial.occurred_at).getTime()):null;
    const paid=paidByVisit.get(visitId)||[];
    return {visitId,firstSeen:first.occurred_at,entryPage:first.page_path,source:sourceOf(first),campaign:first.utm_campaign||null,commercialEntryPage:firstCommercial?.page_path||null,commercialEntryAt:firstCommercial?.occurred_at||null,stages,lastStage:lastStage?.stage||null,nextDestination:nextAfterCommercial?.page_path||nextAfterCommercial?.target_href||null,timeToNextActionSeconds:firstCommercial&&nextAfterCommercial?Math.round((new Date(nextAfterCommercial.occurred_at).getTime()-new Date(firstCommercial.occurred_at).getTime())/1000):null,paidSubscriptions:paid.map(s=>({planKey:s.plan_key,status:s.status})),revenueEvidence:paid.length?"ATTRIBUTED_SUBSCRIPTION":"UNASSERTED"};
  }).filter(j=>j.stages.length||j.paidSubscriptions.length);
  const stageCounts=FUNNEL.map(stage=>({stage,visitors:journeys.filter(j=>j.stages.some((s:any)=>s.stage===stage)).length}));
  const entryPages:Record<string,number>={},sources:Record<string,number>={},dropoffs:Record<string,number>={};
  for(const j of journeys){entryPages[j.entryPage||"Unknown"]=(entryPages[j.entryPage||"Unknown"]||0)+1;sources[j.source]=(sources[j.source]||0)+1;if(j.lastStage)dropoffs[j.lastStage]=(dropoffs[j.lastStage]||0)+1;}
  const rank=(o:Record<string,number>)=>Object.entries(o).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);
  return NextResponse.json({generatedAt:new Date().toISOString(),windowDays:30,boundary:"Journey attribution preserves observed first touch and same-visit funnel progression. Revenue is not asserted from behavior; it requires authoritative subscription attribution.",degraded:{subscriptionAttribution:Boolean(sr.error)},summary:{commercialJourneys:journeys.length,attributedPaidJourneys:journeys.filter(j=>j.paidSubscriptions.length).length},stageCounts,entryPages:rank(entryPages),sources:rank(sources),dropoffs:rank(dropoffs),journeys:journeys.slice(-250).reverse()},{headers:{"Cache-Control":"no-store, max-age=0"}});
}
