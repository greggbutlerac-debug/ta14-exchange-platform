import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
export const dynamic="force-dynamic";
export async function GET(){
 const auth=await createServerClient();const{data:{user}}=await auth.auth.getUser();if(!user)return NextResponse.json({error:"AUTH_REQUIRED"},{status:401});
 const ownerId=(process.env.TA14_SEO_OWNER_USER_ID||process.env.TA14_REVENUE_OWNER_USER_ID||"").trim();if(!ownerId||user.id!==ownerId)return NextResponse.json({error:"OWNER_ACCESS_REQUIRED"},{status:403});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return NextResponse.json({error:"NOT_CONFIGURED"},{status:503});
 const db=createServiceClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});const since=new Date(Date.now()-30*86400000).toISOString();
 const{data,error}=await db.from("ta14_seo_intelligence_events").select("occurred_at,event_type,visit_id,page_path,target_text,referrer_host,search_engine,search_query,utm_source,utm_campaign,utm_term,country,region,city,device_class,intent_type,intent_score").gte("occurred_at",since).order("occurred_at",{ascending:false}).limit(15000);if(error)return NextResponse.json({error:"QUERY_FAILED"},{status:500});
 const rows=data||[],views=rows.filter((r:any)=>r.event_type==="page_view"),clicks=rows.filter((r:any)=>r.event_type==="click"),intents=rows.filter((r:any)=>r.event_type==="commercial_intent");
 function rank(key:string,source:any[]=views){const counts:Record<string,number>={};for(const r of source){const v=String(r[key]||"").trim();if(v)counts[v]=(counts[v]||0)+1;}return Object.entries(counts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,50)}
 const loc:Record<string,number>={};for(const r of views){const v=[r.city,r.region,r.country].filter(Boolean).join(", ");if(v)loc[v]=(loc[v]||0)+1;}
 const intentVisitors=new Set(intents.map((r:any)=>r.visit_id).filter(Boolean)).size;const avgIntent=intents.length?Math.round(intents.reduce((s:number,r:any)=>s+Number(r.intent_score||0),0)/intents.length):0;
 return NextResponse.json({generatedAt:new Date().toISOString(),windowDays:30,summary:{pageViews:views.length,uniqueVisitors:new Set(views.map((r:any)=>r.visit_id).filter(Boolean)).size,clicks:clicks.length,searchArrivals:views.filter((r:any)=>r.search_engine).length,commercialIntentEvents:intents.length,commercialIntentVisitors:intentVisitors,averageIntentScore:avgIntent},pages:rank("page_path"),searchEngines:rank("search_engine"),searchQueries:rank("search_query"),referrers:rank("referrer_host"),campaigns:rank("utm_campaign"),sources:rank("utm_source"),terms:rank("utm_term"),devices:rank("device_class"),locations:Object.entries(loc).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,50),clickTargets:rank("target_text",clicks),intentTypes:rank("intent_type",intents),intentPages:rank("page_path",intents),recent:rows.slice(0,100)});
}
