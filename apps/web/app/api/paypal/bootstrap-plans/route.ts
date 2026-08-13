import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Tier = { key:string; name:string; monthly:string; annual:string };
const TIERS:Tier[] = [
  {key:'PASSPORT',name:'TA-14 Evidence Passport',monthly:'19.00',annual:'182.40'},
  {key:'WORKSPACE',name:'TA-14 Compliance Workspace',monthly:'49.00',annual:'470.40'},
  {key:'PRO',name:'TA-14 Governance Pro',monthly:'99.00',annual:'950.40'},
  {key:'INSTITUTION',name:'TA-14 Institution',monthly:'499.00',annual:'4790.40'},
];

function cfg(){
  const id=process.env.PAYPAL_CLIENT_ID?.trim();
  const secret=process.env.PAYPAL_CLIENT_SECRET?.trim();
  const live=process.env.PAYPAL_ENVIRONMENT?.toLowerCase()==='live';
  const bootstrap=process.env.PAYPAL_BOOTSTRAP_KEY?.trim();
  if(!id||!secret||!bootstrap)return null;
  return {id,secret,bootstrap,base:live?'https://api-m.paypal.com':'https://api-m.sandbox.paypal.com',environment:live?'live':'sandbox'};
}
async function token(c:NonNullable<ReturnType<typeof cfg>>){
  const r=await fetch(`${c.base}/v1/oauth2/token`,{method:'POST',headers:{Authorization:`Basic ${Buffer.from(`${c.id}:${c.secret}`).toString('base64')}`,'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials',cache:'no-store'});
  if(!r.ok)throw new Error(`PayPal authentication failed ${r.status}`);
  return (await r.json()).access_token as string;
}
async function paypal(base:string,path:string,access:string,body:unknown){
  const r=await fetch(`${base}${path}`,{method:'POST',headers:{Authorization:`Bearer ${access}`,'Content-Type':'application/json',Accept:'application/json',Prefer:'return=representation'},body:JSON.stringify(body),cache:'no-store'});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(`${path} ${r.status} ${JSON.stringify(data)}`);
  return data;
}
export async function POST(req:NextRequest){
  const c=cfg();
  if(!c)return NextResponse.json({error:'PAYPAL_BOOTSTRAP_CONFIGURATION_MISSING'},{status:503});
  if(req.headers.get('x-ta14-bootstrap-key')!==c.bootstrap)return NextResponse.json({error:'UNAUTHORIZED'},{status:401});
  try{
    const access=await token(c);
    const plans:Record<string,string>={};
    for(const tier of TIERS){
      const product=await paypal(c.base,'/v1/catalogs/products',access,{name:tier.name,description:`TA-14 Exchange ${tier.name} access tier`,type:'SERVICE',category:'SOFTWARE'});
      const monthly=await paypal(c.base,'/v1/billing/plans',access,{product_id:product.id,name:`${tier.name} Monthly`,description:`Monthly access to ${tier.name}`,status:'ACTIVE',billing_cycles:[{frequency:{interval_unit:'MONTH',interval_count:1},tenure_type:'REGULAR',sequence:1,total_cycles:0,pricing_scheme:{fixed_price:{value:tier.monthly,currency_code:'USD'}}}],payment_preferences:{auto_bill_outstanding:true,setup_fee:{value:'0',currency_code:'USD'},setup_fee_failure_action:'CONTINUE',payment_failure_threshold:3}});
      const annual=await paypal(c.base,'/v1/billing/plans',access,{product_id:product.id,name:`${tier.name} Annual`,description:`Annual access to ${tier.name} at 20% savings`,status:'ACTIVE',billing_cycles:[{frequency:{interval_unit:'YEAR',interval_count:1},tenure_type:'REGULAR',sequence:1,total_cycles:0,pricing_scheme:{fixed_price:{value:tier.annual,currency_code:'USD'}}}],payment_preferences:{auto_bill_outstanding:true,setup_fee:{value:'0',currency_code:'USD'},setup_fee_failure_action:'CONTINUE',payment_failure_threshold:3}});
      plans[`PAYPAL_PLAN_${tier.key}_MONTHLY`]=monthly.id;
      plans[`PAYPAL_PLAN_${tier.key}_ANNUAL`]=annual.id;
    }
    return NextResponse.json({environment:c.environment,plans,note:'Store these plan IDs as Vercel environment variables. Remove PAYPAL_BOOTSTRAP_KEY and this endpoint after bootstrap.'},{status:201});
  }catch(e){console.error('TA14_PAYPAL_BOOTSTRAP_ERROR',e);return NextResponse.json({error:'PAYPAL_BOOTSTRAP_FAILED',detail:e instanceof Error?e.message:'unknown'},{status:502});}
}
