import { createHash, randomUUID } from 'crypto';
import { NextRequest,NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getPayPalConfig, getPayPalOrder, isValidPayPalOrderId, verifyCompletedOrder } from '@/lib/billing/paypal-server';
import { isOperatorIdentity, raiseOwnerAlert } from '@/lib/owner-alerts/server';
function t(v:unknown,max=500){return typeof v==='string'?v.trim().slice(0,max):''}
function sameOrigin(r:NextRequest){const o=r.headers.get('origin');if(!o)return true;try{return new URL(o).host===r.nextUrl.host}catch{return false}}
function canonicalize(value:unknown):string{if(Array.isArray(value))return '['+value.map(canonicalize).join(',')+']';if(value&&typeof value==='object'){const o=value as Record<string,unknown>;return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonicalize(o[k])).join(',')+'}'}return JSON.stringify(value)}
function client(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()??'';const key=process.env.SUPABASE_SECRET_KEY?.trim()||process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()||'';if(!url||!key)throw new Error('Payment record server configuration unavailable.');return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})}
export async function POST(request:NextRequest){
 try{
  if(!sameOrigin(request))return NextResponse.json({error:'Cross-origin submission is not allowed.'},{status:403});
  const p=await request.json() as Record<string,unknown>;const intakeId=t(p.intakeId,100),orderId=t(p.orderId,100),claimedCaptureId=t(p.captureId,100)||null;
  // The browser supplies only lookup keys. Amount, currency, capture and binding are read from PayPal itself.
  if(!intakeId||!orderId||!isValidPayPalOrderId(orderId))return NextResponse.json({error:'Payment confirmation does not identify this $149 examination intake.'},{status:400});
  const {data:existing,error:readError}=await client().from('ta14_consequence_examination_intakes').select('intake_id,status,paypal_order_id,paypal_capture_id').eq('intake_id',intakeId).single();
  if(readError||!existing)return NextResponse.json({error:'Examination intake was not found.'},{status:404});
  if(existing.status==='PAID'&&existing.paypal_order_id===orderId)return NextResponse.json({ok:true,intakeId,status:'PAID',idempotent:true});
  if(existing.status!=='READY_FOR_PAYMENT')return NextResponse.json({error:'This intake is not awaiting payment.'},{status:409});
  const paypal=getPayPalConfig();if(!paypal)return NextResponse.json({error:'Payment verification is not configured.'},{status:503});
  let order;try{order=await getPayPalOrder(paypal,orderId)}catch(e){console.error('Consequence payment verification lookup failed',e);return NextResponse.json({error:'Payment could not be verified with PayPal yet. Retain the PayPal order ID; verification can be retried.'},{status:502})}
  const verified=verifyCompletedOrder(order,{orderId,referenceId:'governed-consequence-examination',customId:`governed-consequence-examination:${intakeId}`,amount:'149.00',currency:'USD',claimedCaptureId});
  if(!verified.ok){console.error('Consequence payment verification rejected',{intakeId,orderId,reason:verified.reason});return NextResponse.json({error:'PayPal does not confirm a completed $149 payment for this intake.',reason:verified.reason},{status:402})}
  const captureId=verified.captureId;
  const paidAt=verified.capturedAt&&Number.isFinite(Date.parse(verified.capturedAt))?verified.capturedAt:new Date().toISOString();
  const supabase=client();
  const {data:evidence,error:evidenceError}=await supabase.from('ta14_consequence_intake_evidence').select('id,original_filename,media_type,size_bytes,sha256,evidence_state,created_at').eq('intake_id',intakeId).order('created_at',{ascending:true}).order('id',{ascending:true});
  if(evidenceError)return NextResponse.json({error:'Payment was captured but the evidence manifest could not be frozen. Retain the PayPal capture ID for reconciliation.'},{status:500});
  const evidenceManifest={schema:'TA14_CONSEQUENCE_INTAKE_EVIDENCE_MANIFEST_V1',intakeId,items:(evidence??[]).map(x=>({evidenceId:x.id,filename:x.original_filename,mediaType:x.media_type,sizeBytes:x.size_bytes,sha256:x.sha256,state:x.evidence_state}))};
  const evidenceManifestSha256=createHash('sha256').update(canonicalize(evidenceManifest)).digest('hex');
  const {data,error}=await supabase.from('ta14_consequence_examination_intakes').update({status:'PAID',paypal_order_id:orderId,paypal_capture_id:captureId,paid_amount:149.00,paid_currency:'USD',paid_at:paidAt,evidence_manifest:evidenceManifest,evidence_manifest_sha256:evidenceManifestSha256,evidence_frozen_at:paidAt,evidence_item_count:evidence?.length??0,updated_at:new Date().toISOString()}).eq('intake_id',intakeId).eq('status','READY_FOR_PAYMENT').select('intake_id,status,paid_at,payload_sha256,evidence_manifest_sha256,evidence_item_count,evidence_frozen_at').single();
  if(error||!data)return NextResponse.json({error:'Payment was captured but the intake could not be marked paid. Retain the PayPal capture ID for reconciliation.'},{status:500});
  const queueId='TA14-CEX-Q-'+randomUUID().replaceAll('-','').slice(0,12).toUpperCase();
  const {data:queue,error:queueError}=await supabase.from('ta14_consequence_examination_queue').insert({queue_id:queueId,intake_id:intakeId,state:'QUEUED',paid_at:data.paid_at,evidence_manifest_sha256:data.evidence_manifest_sha256,evidence_item_count:data.evidence_item_count??0}).select('queue_id,state,queued_at').single();
  if(queueError||!queue)return NextResponse.json({error:'Payment and evidence freeze were recorded, but the examination queue entry could not be created. Retain the intake and PayPal capture IDs for reconciliation.',intakeId,status:'PAID'},{status:500});
  const {error:eventError}=await supabase.from('ta14_consequence_examination_queue_events').insert({queue_id:queue.queue_id,intake_id:intakeId,event_type:'PAID_INTAKE_QUEUED',from_state:null,to_state:'QUEUED',event_payload:{evidenceManifestSha256:data.evidence_manifest_sha256,evidenceItemCount:data.evidence_item_count??0}});
  if(eventError)console.error('Consequence queue chronology insert failed',eventError);
  // Owner alerts follow the persisted PAID + QUEUED state. They never affect this response.
  const isTest=paypal.environment==='sandbox'||isOperatorIdentity({email:verified.payerEmail});
  const who={name:verified.payerName,email:verified.payerEmail};
  const references=[{label:'Intake ID',value:intakeId},{label:'Queue ID',value:queue.queue_id},{label:'PayPal order ID',value:orderId}];
  const provider=paypal.environment==='sandbox'?'PayPal (sandbox)':'PayPal';
  await raiseOwnerAlert({alertKey:`payment_verified:paypal-capture:${captureId}`,alertType:'PAYMENT_VERIFIED',isTest,facts:{who,product:'Governed Consequence Examination ($149)',route:'/consequence-machine',status:'PAID — verified with PayPal by the server',references,amount:verified.amount,currency:verified.currency,amountBasis:'PAID',provider,providerReference:captureId,occurredAt:paidAt,verifiedAt:new Date().toISOString(),action:'Payment is verified and the intake is queued. Perform the examination (see the READY FOR FULFILLMENT alert).'}});
  await raiseOwnerAlert({alertKey:`ready_for_fulfillment:consequence-intake:${intakeId}`,alertType:'READY_FOR_FULFILLMENT',isTest,facts:{who,product:'Governed Consequence Examination ($149)',route:'/consequence-machine',status:`QUEUED — ${data.evidence_item_count??0} evidence item(s) frozen`,references:[...references,{label:'Evidence manifest SHA-256',value:String(data.evidence_manifest_sha256??'')}],amount:verified.amount,currency:verified.currency,amountBasis:'PAID',provider,providerReference:captureId,occurredAt:String(queue.queued_at??paidAt),action:`1) Assign an examiner to queue entry ${queue.queue_id} (POST /api/admin/consequence-examinations/transition). 2) Examine intake ${intakeId} against its frozen evidence manifest. 3) Issue and deliver the ALLOW / HOLD / DENY / ESCALATE examination record. No admin page exists for this queue yet; the queue is in ta14_consequence_examination_queue.`}});
  return NextResponse.json({ok:true,intakeId:data.intake_id,status:data.status,queueId:queue.queue_id,queueState:queue.state,queuedAt:queue.queued_at,paidAt:data.paid_at,payloadSha256:data.payload_sha256,evidenceManifestSha256:data.evidence_manifest_sha256,evidenceItemCount:data.evidence_item_count,evidenceFrozenAt:data.evidence_frozen_at,boundary:'Payment purchases and queues the governed examination only. It does not establish admissibility, authority, standing, certification, endorsement, compliance, execution permission, or a favorable determination.'});
 }catch(e){console.error('Consequence payment record failed',e);return NextResponse.json({error:'Unable to record the consequence examination payment.'},{status:500})}
}