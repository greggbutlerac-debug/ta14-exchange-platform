import {NextResponse} from 'next/server';
import {createClient as createServiceClient} from '@supabase/supabase-js';
import {createClient as createServerClient} from '@/lib/supabase/server';

export const dynamic='force-dynamic';
export const runtime='nodejs';

type Row={paypal_subscription_id:string;plan_key:string|null;subscriber_email:string|null;status:string;created_at:string;updated_at:string;status_changed_at:string|null;next_billing_time:string|null};
const prices:Record<string,{tier:string;cadence:'monthly'|'annual';charged:number;mrr:number}>={
 'passport-monthly':{tier:'Evidence Passport',cadence:'monthly',charged:19,mrr:19},
 'passport-annual':{tier:'Evidence Passport',cadence:'annual',charged:182.4,mrr:15.2},
 'workspace-monthly':{tier:'Compliance Workspace',cadence:'monthly',charged:49,mrr:49},
 'workspace-annual':{tier:'Compliance Workspace',cadence:'annual',charged:470.4,mrr:39.2},
 'pro-monthly':{tier:'Governance Pro',cadence:'monthly',charged:99,mrr:99},
 'pro-annual':{tier:'Governance Pro',cadence:'annual',charged:950.4,mrr:79.2},
 'institution-monthly':{tier:'Institution',cadence:'monthly',charged:499,mrr:499},
 'institution-annual':{tier:'Institution',cadence:'annual',charged:4790.4,mrr:399.2},
};
function allowed(user:{id:string;email?:string|null;app_metadata?:Record<string,unknown>}){const role=String(user.app_metadata?.role??'').toLowerCase();if(role==='admin'||role==='owner')return true;const ids=(process.env.TA14_ADMIN_USER_IDS??'').split(',').map(x=>x.trim()).filter(Boolean);if(ids.includes(user.id))return true;const emails=(process.env.TA14_ADMIN_EMAILS??'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);return !!user.email&&emails.includes(user.email.toLowerCase())}
function service(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return null;return createServiceClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
export async function GET(){const auth=await createServerClient();const{data:{user}}=await auth.auth.getUser();if(!user)return NextResponse.json({error:'AUTH_REQUIRED'},{status:401});if(!allowed(user))return NextResponse.json({error:'OWNER_ACCESS_REQUIRED'},{status:403});const db=service();if(!db)return NextResponse.json({error:'REVENUE_TRACKER_NOT_CONFIGURED'},{status:503});const{data,error}=await db.from('ta14_billing_subscriptions').select('paypal_subscription_id,plan_key,subscriber_email,status,created_at,updated_at,status_changed_at,next_billing_time').order('created_at',{ascending:false});if(error){console.error('TA14_REVENUE_TRACKER_QUERY_FAILED',error);return NextResponse.json({error:'REVENUE_QUERY_FAILED'},{status:500})}const rows=(data??[]) as Row[];const active=rows.filter(r=>r.status==='ACTIVE');const now=Date.now(),d7=now-7*86400000,d30=now-30*86400000;const mix=Object.values(prices).reduce<Record<string,{tier:string;active:number;monthly:number;annual:number;mrr:number}>>((acc,p)=>{acc[p.tier]??={tier:p.tier,active:0,monthly:0,annual:0,mrr:0};return acc},{});let mrr=0;for(const r of active){const p=r.plan_key?prices[r.plan_key]:undefined;if(!p)continue;mrr+=p.mrr;const m=mix[p.tier];m.active++;m[p.cadence]++;m.mrr+=p.mrr}const statusCounts=rows.reduce<Record<string,number>>((a,r)=>(a[r.status]=(a[r.status]??0)+1,a),{});return NextResponse.json({generatedAt:new Date().toISOString(),summary:{subscriptions:rows.length,active:active.length,mrr:Number(mrr.toFixed(2)),arrRunRate:Number((mrr*12).toFixed(2)),new7d:rows.filter(r=>new Date(r.created_at).getTime()>=d7).length,new30d:rows.filter(r=>new Date(r.created_at).getTime()>=d30).length,monthlyActive:active.filter(r=>r.plan_key?.endsWith('-monthly')).length,annualActive:active.filter(r=>r.plan_key?.endsWith('-annual')).length},planMix:Object.values(mix),statusCounts,recent:rows.slice(0,50).map(r=>{const p=r.plan_key?prices[r.plan_key]:undefined;return{subscriptionId:r.paypal_subscription_id,tier:p?.tier??r.plan_key??'Unmapped',cadence:p?.cadence??'unknown',amount:p?.charged??0,email:r.subscriber_email,status:r.status,createdAt:r.created_at,statusChangedAt:r.status_changed_at,nextBillingTime:r.next_billing_time}})});}
