import { createHash } from 'crypto';
import { NextRequest,NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
function t(v:unknown,max=500){return typeof v==='string'?v.trim().slice(0,max):''}
function sameOrigin(r:NextRequest){const o=r.headers.get('origin');if(!o)return true;try{return new URL(o).host===r.nextUrl.host}catch{return false}}
function canonicalize(value:unknown):string{if(Array.isArray(value))return '['+value.map(canonicalize).join(',')+']';if(value&&typeof value==='object'){const o=value as Record<string,unknown>;return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonicalize(o[k])).join(',')+'}'}return JSON.stringify(value)}
function client(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()??'';const key=process.env.SUPABASE_SECRET_KEY?.trim()||process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()||'';if(!url||!key)throw new Error('Payment record server configuration unavailable.');return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})}
type PayPalCapture = {
  id?: string;
  status?: string;
  amount?: { value?: string; currency_code?: string };
  update_time?: string;
  create_time?: string;
};
type PayPalPurchaseUnit = {
  reference_id?: string;
  custom_id?: string;
  amount?: { value?: string; currency_code?: string };
  payments?: { captures?: PayPalCapture[] };
};
type PayPalOrder = {
  id?: string;
  status?: string;
  purchase_units?: PayPalPurchaseUnit[];
};
async function verifyPayment(orderId:string,intakeId:string){
 const id=process.env.PAYPAL_CLIENT_ID?.trim(),secret=process.env.PAYPAL_CLIENT_SECRET?.trim(),mode=process.env.PAYPAL_ENVIRONMENT?.trim().toLowerCase();
 if(!id||!secret||(mode!=='live'&&mode!=='sandbox'))throw new Error('PayPal verification configuration unavailable');
 const base=mode==='sandbox'?'https://api-m.sandbox.paypal.com':'https://api-m.paypal.com';
 const tokenResponse=await fetch(base+'/v1/oauth2/token',{method:'POST',headers:{Authorization:'Basic '+Buffer.from(id+':'+secret).toString('base64'),'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials',cache:'no-store'});
 if(!tokenResponse.ok)throw new Error('PayPal authentication failed');
 const token=await tokenResponse.json() as {access_token?:string};
 if(!token.access_token)throw new Error('PayPal token missing');
 const response=await fetch(base+'/v2/checkout/orders/'+encodeURIComponent(orderId),{headers:{Authorization:'Bearer '+token.access_token,Accept:'application/json'},cache:'no-store'});
 if(!response.ok)throw new Error('Unable to retrieve PayPal order');
 const order=await response.json() as PayPalOrder;
 if(order.id!==orderId||order.status!=='COMPLETED'||order.purchase_units?.length!==1)throw new Error('PayPal order is not a single completed purchase');
 const unit=order.purchase_units[0];
 if(unit.reference_id!=='governed-consequence-examination'||unit.custom_id!=='governed-consequence-examination:'+intakeId||unit.amount?.value!=='149.00'||unit.amount?.currency_code!=='USD')throw new Error('PayPal purchase does not match examination intake');
 const captures=unit.payments?.captures?.filter(x=>x.status==='COMPLETED'&&x.amount?.value==='149.00'&&x.amount?.currency_code==='USD'&&!!x.id)??[];
 if(captures.length!==1)throw new Error('PayPal completed capture is missing or ambiguous');
 return {captureId:captures[0].id!,capturedAt:captures[0].update_time||captures[0].create_time||new Date().toISOString()};
}
export async function POST(request:NextRequest){
 try{
  if(!sameOrigin(request))return NextResponse.json({error:'Cross-origin submission is not allowed.'},{status:403});
  const p=await request.json() as Record<string,unknown>;const intakeId=t(p.intakeId,100),orderId=t(p.orderId,100);
  if(!/^TA14-CEX-\d{8}-[A-Z0-9]{10}$/.test(intakeId)||! /^[A-Z0-9]{1,36}$/.test(orderId))return NextResponse.json({error:'Invalid intake or order ID.'},{status:400});
  let verified:{captureId:string;capturedAt:string};try{verified=await verifyPayment(orderId,intakeId)}catch(err){console.error('Independent PayPal verification failed',err);return NextResponse.json({error:'Unable to independently verify a completed $149 PayPal payment.'},{status:409})}
  const {captureId,capturedAt}=verified;
  const {data:existing,error:readError}=await client().from('ta14_consequence_examination_intakes').select('intake_id,status,paypal_order_id,paypal_capture_id').eq('intake_id',intakeId).single();
  if(readError||!existing)return NextResponse.json({error:'Examination intake was not found.'},{status:404});
  if(existing.status==='PAID'&&(existing.paypal_capture_id!==captureId||existing.paypal_order_id!==orderId))return NextResponse.json({error:'This intake is bound to a different payment.'},{status:409});
  if(existing.status!=='READY_FOR_PAYMENT'&&existing.status!=='PAID')return NextResponse.json({error:'This intake is not awaiting payment.'},{status:409});
  const paidAt=capturedAt&&Number.isFinite(Date.parse(capturedAt))?capturedAt:new Date().toISOString();
  const supabase=client();
  const {data:evidence,error:evidenceError}=await supabase.from('ta14_consequence_intake_evidence').select('id,original_filename,media_type,size_bytes,sha256,evidence_state,created_at').eq('intake_id',intakeId).order('created_at',{ascending:true}).order('id',{ascending:true});
  if(evidenceError)return NextResponse.json({error:'Payment was captured but the evidence manifest could not be frozen. Retain the PayPal capture ID for reconciliation.'},{status:500});
  const evidenceManifest={schema:'TA14_CONSEQUENCE_INTAKE_EVIDENCE_MANIFEST_V1',intakeId,items:(evidence??[]).map(x=>({evidenceId:x.id,filename:x.original_filename,mediaType:x.media_type,sizeBytes:x.size_bytes,sha256:x.sha256,state:x.evidence_state}))};
  const evidenceManifestSha256=createHash('sha256').update(canonicalize(evidenceManifest)).digest('hex');
  // One privileged database transaction binds payment, freezes evidence,
  // establishes the queue and writes its initial chronology event.
  const {data:finalized,error:finalizeError}=await supabase.rpc('ta14_finalize_verified_examination_payment',{
    p_intake_id:intakeId,
    p_order_id:orderId,
    p_capture_id:captureId,
    p_paid_at:paidAt,
    p_manifest:evidenceManifest,
    p_manifest_sha256:evidenceManifestSha256,
    p_evidence_item_count:evidence?.length??0
  });
  const result=Array.isArray(finalized)?finalized[0]:null;
  if(finalizeError||!result){
    console.error('Atomic examination payment finalization failed',finalizeError);
    return NextResponse.json({error:'Payment was captured but examination intake finalization requires reconciliation. Do not pay again; contact support with your intake ID.',intakeId},{status:500});
  }
  return NextResponse.json({
    ok:true,intakeId:result.result_intake_id,status:'PAID',
    queueId:result.result_queue_id,queueState:result.result_queue_state,
    paidAt:result.result_paid_at,
    evidenceManifestSha256:result.result_manifest_sha256,
    evidenceItemCount:result.result_evidence_item_count,
    idempotent:result.result_idempotent,
    boundary:'Payment purchases and queues the governed examination only. It does not establish admissibility, authority, standing, certification, endorsement, compliance, execution permission, or a favorable determination.'
  });
 }catch(e){console.error('Consequence payment record failed',e);return NextResponse.json({error:'Unable to record the consequence examination payment.'},{status:500})}
}