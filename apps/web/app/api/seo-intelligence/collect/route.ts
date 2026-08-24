import { randomUUID } from "crypto";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const VISIT_COOKIE = "ta14_seo_visit_id";
const MAX = 500;
const INTENT_DEDUPE_SECONDS = 60;
function clean(value: unknown, max = MAX) { return typeof value === "string" ? value.slice(0, max) : null; }
function engine(host: string | null) { if (!host) return null; const h=host.toLowerCase(); if(h.includes("google."))return"Google";if(h.includes("bing.com"))return"Bing";if(h.includes("duckduckgo.com"))return"DuckDuckGo";if(h.includes("yahoo."))return"Yahoo";if(h.includes("ecosia.org"))return"Ecosia";if(h.includes("perplexity.ai"))return"Perplexity";if(h.includes("chatgpt.com")||h.includes("openai.com"))return"ChatGPT";return null; }
function device(ua:string){if(/bot|crawler|spider/i.test(ua))return"bot";if(/ipad|tablet/i.test(ua))return"tablet";if(/mobile|iphone|android/i.test(ua))return"mobile";return"desktop";}
async function readBody(req:NextRequest){const text=await req.text();if(!text)return{};try{return JSON.parse(text)}catch{return{}}}
function classifyIntent(pagePath:string,targetHref:string|null,targetText:string|null,eventType:string){const s=`${pagePath} ${targetHref||""} ${targetText||""}`.toLowerCase();const rules:[RegExp,string,number][]=[[/pricing|commercial|checkout|purchase|subscribe|upgrade|buy|payment/,"pricing_or_purchase",95],[/register governance|\/registry(\/|$)|registration/,"governance_registration",90],[/system passport|command center|classif(y|ier)|eu-ai-act/,"world_05",80],[/academy|credential|assessment|course|epa-608/,"academy",70],[/partner review|entity-review|founding demonstration|interoperability|review/,"governance_service",65],[/contact|book|schedule|consult|request|start/,"contact_or_start",60]];for(const[rx,type,score]of rules)if(rx.test(s))return{type,score:eventType==="click"?score:Math.max(40,score-15)};return null;}

export async function POST(req:NextRequest){try{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return NextResponse.json({ok:false,stage:"config"},{status:503});
 const body=await readBody(req),eventType=body?.eventType==="click"?"click":"page_view",pagePath=clean(body?.pagePath,1000);if(!pagePath)return NextResponse.json({ok:false,stage:"payload"},{status:400});
 const cookieStore=await cookies(),existing=cookieStore.get(VISIT_COOKIE)?.value,visitId=existing??randomUUID(),h=await headers(),ua=h.get("user-agent")??"";
 const referrer=clean(body?.referrer,2000);let referrerHost:string|null=null,searchQuery:string|null=null;try{if(referrer){const r=new URL(referrer);referrerHost=r.hostname;searchQuery=clean(r.searchParams.get("q")??r.searchParams.get("p")??r.searchParams.get("query"),500)}}catch{}
 const targetHref=clean(body?.targetHref,2000),targetText=clean(body?.targetText,500),intent=classifyIntent(pagePath,targetHref,targetText,eventType),db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const base={visit_id:visitId,page_path:pagePath,page_title:clean(body?.pageTitle,500),target_href:targetHref,target_text:targetText,referrer,referrer_host:referrerHost,search_engine:engine(referrerHost),search_query:searchQuery,utm_source:clean(body?.utmSource),utm_medium:clean(body?.utmMedium),utm_campaign:clean(body?.utmCampaign),utm_term:clean(body?.utmTerm),utm_content:clean(body?.utmContent),country:clean(h.get("x-vercel-ip-country"),100),region:clean(h.get("x-vercel-ip-country-region"),150),city:clean(h.get("x-vercel-ip-city"),200),latitude:Number(h.get("x-vercel-ip-latitude"))||null,longitude:Number(h.get("x-vercel-ip-longitude"))||null,user_agent:clean(ua,1000),device_class:device(ua)};
 const rows:any[]=[{...base,event_type:eventType,metadata:{source:"ta14-exchange",schema:3}}];let intentRecorded=false;
 if(intent){const cutoff=new Date(Date.now()-INTENT_DEDUPE_SECONDS*1000).toISOString();const{data:recent}=await db.from("ta14_seo_intelligence_events").select("id").eq("event_type","commercial_intent").eq("visit_id",visitId).eq("intent_type",intent.type).eq("page_path",pagePath).gte("occurred_at",cutoff).limit(1);if(!recent?.length){rows.push({...base,event_type:"commercial_intent",intent_type:intent.type,intent_score:intent.score,metadata:{source:"ta14-exchange",schema:3,derived_from:eventType,dedupe_window_seconds:INTENT_DEDUPE_SECONDS}});intentRecorded=true;}}
 const{error}=await db.from("ta14_seo_intelligence_events").insert(rows);if(error){console.error("SEO_INTELLIGENCE_INSERT_FAILED",{code:error.code,message:error.message});return NextResponse.json({ok:false,stage:"insert",code:error.code??null},{status:500});}
 const response=NextResponse.json({ok:true,intent:intent?.type??null,intentRecorded});if(!existing)response.cookies.set({name:VISIT_COOKIE,value:visitId,httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:31536000});return response;
}catch(error){console.error("SEO_INTELLIGENCE_COLLECT_FAILED",error);return NextResponse.json({ok:false,stage:"exception"},{status:500});}}
