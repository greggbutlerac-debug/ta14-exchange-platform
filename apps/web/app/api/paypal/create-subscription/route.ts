import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PlanKey='passport-monthly'|'passport-annual'|'workspace-monthly'|'workspace-annual'|'pro-monthly'|'pro-annual'|'institution-monthly'|'institution-annual';
const ENV_KEYS:Record<PlanKey,string>={
 'passport-monthly':'PAYPAL_PLAN_PASSPORT_MONTHLY','passport-annual':'PAYPAL_PLAN_PASSPORT_ANNUAL',
 'workspace-monthly':'PAYPAL_PLAN_WORKSPACE_MONTHLY','workspace-annual':'PAYPAL_PLAN_WORKSPACE_ANNUAL',
 'pro-monthly':'PAYPAL_PLAN_PRO_MONTHLY','pro-annual':'PAYPAL_PLAN_PRO_ANNUAL',
 'institution-monthly':'PAYPAL_PLAN_INSTITUTION_MONTHLY','institution-annual':'PAYPAL_PLAN_INSTITUTION_ANNUAL'
};
const LIVE_PLAN_IDS:Record<PlanKey,string>={
 'passport-monthly':'P-27064640V37858307NJ66HPQ',
 'passport-annual':'P-7H005701JR262984GNJ66HPQ',
 'workspace-monthly':'P-79H84120C7502222KNJ66HPY',
 'workspace-annual':'P-50V814897V6426841NJ66HPY',
 'pro-monthly':'P-4JR402866N272811NNJ66HPY',
 'pro-annual':'P-8WE10125YP5373259NJ66HPY',
 'institution-monthly':'P-95E93366H2071870RNJ66HQA',
 'institution-annual':'P-3LK89794Y1493825LNJ66HQA'
};
function cfg(){const id=process.env.PAYPAL_CLIENT_ID?.trim(),secret=process.env.PAYPAL_CLIENT_SECRET?.trim(),sandbox=process.env.PAYPAL_ENVIRONMENT?.toLowerCase()==='sandbox';if(!id||!secret)return null;return{id,secret,base:sandbox?'https://api-m.sandbox.paypal.com':'https://api-m.paypal.com',environment:sandbox?'sandbox':'live'}}
async function token(c:NonNullable<ReturnType<typeof cfg>>){const r=await fetch(`${c.base}/v1/oauth2/token`,{method:'POST',headers:{Authorization:`Basic ${Buffer.from(`${c.id}:${c.secret}`).toString('base64')}`,'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials',cache:'no-store'});if(!r.ok)throw new Error('PayPal authentication failed');const j=await r.json();return j.access_token as string}
function isPlan(v:string):v is PlanKey{return Object.prototype.hasOwnProperty.call(ENV_KEYS,v)}
export async function POST(req:NextRequest){const c=cfg();if(!c)return NextResponse.json({error:'PAYPAL_CONFIGURATION_MISSING'},{status:503});let body:{planKey?:string;customerReference?:string};try{body=await req.json()}catch{return NextResponse.json({error:'INVALID_REQUEST_BODY'},{status:400})}const key=body.planKey?.trim()||'';if(!isPlan(key))return NextResponse.json({error:'INVALID_PLAN'},{status:400});const configuredPlanId=process.env[ENV_KEYS[key]]?.trim();const planId=configuredPlanId||(c.environment==='live'?LIVE_PLAN_IDS[key]:'');if(!planId)return NextResponse.json({error:'PAYPAL_PLAN_NOT_CONFIGURED',planKey:key},{status:503});const custom=(body.customerReference||'').replace(/[^a-zA-Z0-9._:@+-]/g,'-').slice(0,127)||undefined;const [plan,billing]=key.split('-');const returnBase='https://ta14exchange.com/eu-ai-act/join';const returnUrl=`${returnBase}?plan=${encodeURIComponent(plan)}&billing=${encodeURIComponent(billing)}&payment=approved`;const cancelUrl=`${returnBase}?plan=${encodeURIComponent(plan)}&billing=${encodeURIComponent(billing)}&payment=cancelled`;try{const access=await token(c);const r=await fetch(`${c.base}/v1/billing/subscriptions`,{method:'POST',headers:{Authorization:`Bearer ${access}`,'Content-Type':'application/json',Accept:'application/json',Prefer:'return=representation'},body:JSON.stringify({plan_id:planId,custom_id:custom,application_context:{brand_name:'TA-14 Authority',locale:'en-US',shipping_preference:'NO_SHIPPING',user_action:'SUBSCRIBE_NOW',return_url:returnUrl,cancel_url:cancelUrl}}),cache:'no-store'});const data=await r.json();if(!r.ok)return NextResponse.json({error:'PAYPAL_SUBSCRIPTION_CREATION_FAILED',detail:data},{status:502});return NextResponse.json({subscriptionId:data.id,status:data.status,approvalUrl:data.links?.find((x:{rel?:string})=>x.rel==='approve')?.href??null,planKey:key,environment:c.environment,boundary:'Subscription payment grants only the purchased access tier. It does not create certification, approval, admissibility, endorsement, or a favorable governance determination.'},{status:201})}catch(e){console.error('TA14_PAYPAL_SUBSCRIPTION_ERROR',e);return NextResponse.json({error:'PAYPAL_SUBSCRIPTION_SERVICE_UNAVAILABLE'},{status:503})}}
