import { createHash, randomUUID } from 'crypto';
import { NextRequest,NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
function t(v:unknown,max=500){return typeof v==='string'?v.trim().slice(0,max):''}
function sameOrigin(r:NextRequest){const o=r.headers.get('origin');if(!o)return true;try{return new URL(o).host===r.nextUrl.host}catch{return false}}
function canonicalize(value:unknown):string{if(Array.isArray(value))return '['+value.map(canonicalize).join(',')+']';if(value&&typeof value==='object'){const o=value as Record<string,unknown>;return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonicalize(o[k])).join(',')+'}'}return JSON.stringify(value)}
function client(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()??'';const key=process.env.SUPABASE_SECRET_KEY?.trim()||process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()||'';if(!url||!key)throw new Error('Payment record server configuration unavailable.');return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})}
type PayPalOrder = {id?:string;status?:string;purchase_units?:Array<{reference_id?:string;custom_id?:string;amount?:{value?:string;currency_code?:string};payments?:{captures?:Array<{id?:string;status?:string;amount?:{value?:string;currency_code?:string};update_time?:string;create_time?:string}>}>}>};
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
  const {data,error}=existing.status==='PAID'?await supabase.from('ta14_consequence_examination_intakes').select('intake_id,status,paid_at,payload_sha256,evidence_manifest_sha256,evidence_item_count,evidence_frozen_at').eq('intake_id',intakeId).single():await supabase.from('ta14_consequence_examination_intakes').update({status:'PAID',paypal_order_id:orderId,paypal_capture_id:captureId,paid_amount:149.00,paid_currency:'USD',paid_at:paidAt,evidence_manifest:evidenceManifest,evidence_manifest_sha256:evidenceManifestSha256,evidence_frozen_at:paidAt,evidence_item_count:evidence?.length??0,updated_at:new Date().toISOString()}).eq('intake_id',intakeId).eq('status','READY_FOR_PAYMENT').select('intake_id,status,paid_at,payload_sha256,evidence_manifest_sha256,evidence_item_count,evidence_frozen_at').single();
  if(error||!data)return NextResponse.json({error:'Payment was captured but the intake could not be marked paid. Retain the PayPal capture ID for reconciliation.'},{status:500});
  const {data:existingQueue,error:queueReadError}=await supabase.from('ta14_consequence_examination_queue').select('queue_id,state,queued_at').eq('intake_id',intakeId).maybeSingle();
  if(queueReadError)return NextResponse.json({error:'Unable to verify examination queue state. Please contact support with your intake ID.'},{status:500});
  if(existingQueue)return NextResponse.json({ok:true,intakeId,status:'PAID',queueId:existingQueue.queue_id,queueState:existingQueue.state,idempotent:true});
  const queueId='TA14-CEX-Q-'+randomUUID().replaceAll('-','').slice(0,12).toUpperCase();
  const {data:queue,error:queueError}=await supabase.from('ta14_consequence_examination_queue').insert({queue_id:queueId,intake_id:intakeId,state:'QUEUED',paid_at:data.paid_at,evidence_manifest_sha256:data.evidence_manifest_sha256,evidence_item_count:data.evidence_item_count??0}).select('queue_id,state,queued_at').single();
  if(queueError||!queue){
   const {data:recoveredQueue,error:recoveryError}=await supabase.from('ta14_consequence_examination_queue').select('queue_id,state,queued_at').eq('intake_id',intakeId).maybeSingle();
   if(!recoveryError&&recoveredQueue)return NextResponse.json({ok:true,intakeId,status:'PAID',queueId:recoveredQueue.queue_id,queueState:recoveredQueue.state,queuedAt:recoveredQueue.queued_at,idempotent:true});
   console.error('Paid examination queue insert or recovery failed',queueError,recoveryError);
   return NextResponse.json({error:'Payment was recorded but examination queue creation requires reconciliation. Contact support with your intake ID; do not pay again.',intakeId,status:'PAID'},{status:500});
  }
  const {error:eventError}=await supabase.from('ta14_consequence_examination_queue_events').insert({queue_id:queue.queue_id,intake_id:intakeId,event_type:'PAID_INTAKE_QUEUED',from_state:null,to_state:'QUEUED',event_payload:{evidenceManifestSha256:data.evidence_manifest_sha256,evidenceItemCount:data.evidence_item_count??0}});
  if(eventError)console.error('Consequence queue chronology insert failed',eventError);
  return NextResponse.json({ok:true,intakeId:data.intake_id,status:data.status,queueId:queue.queue_id,queueState:queue.state,queuedAt:queue.queued_at,paidAt:data.paid_at,payloadSha256:data.payload_sha256,evidenceManifestSha256:data.evidence_manifest_sha256,evidenceItemCount:data.evidence_item_count,evidenceFrozenAt:data.evidence_frozen_at,boundary:'Payment purchases and queues the governed examination only. It does not establish admissibility, authority, standing, certification, endorsement, compliance, execution permission, or a favorable determination.'});
 }catch(e){console.error('Consequence payment record failed',e);return NextResponse.json({error:'Unable to record the consequence examination payment.'},{status:500})}
}