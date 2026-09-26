import { createHash, randomUUID } from 'crypto';
import { NextRequest,NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
function t(v:unknown,max=500){return typeof v==='string'?v.trim().slice(0,max):''}
function sameOrigin(r:NextRequest){const o=r.headers.get('origin');if(!o)return true;try{return new URL(o).host===r.nextUrl.host}catch{return false}}
function canonicalize(value:unknown):string{if(Array.isArray(value))return '['+value.map(canonicalize).join(',')+']';if(value&&typeof value==='object'){const o=value as Record<string,unknown>;return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonicalize(o[k])).join(',')+'}'}return JSON.stringify(value)}
function client(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()??'';const key=process.env.SUPABASE_SECRET_KEY?.trim()||process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()||'';if(!url||!key)throw new Error('Payment record server configuration unavailable.');return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})}
export async function POST(request:NextRequest){
 try{
  if(!sameOrigin(request))return NextResponse.json({error:'Cross-origin submission is not allowed.'},{status:403});
  const p=await request.json() as Record<string,unknown>;const intakeId=t(p.intakeId,100),orderId=t(p.orderId,100),captureId=t(p.captureId,100),amount=t(p.amount,30),currency=t(p.currency,10).toUpperCase(),customId=t(p.customId,300),capturedAt=t(p.capturedAt,100);
  if(!intakeId||!orderId||!captureId||amount!=='149.00'||currency!=='USD'||customId!==`governed-consequence-examination:${intakeId}`)return NextResponse.json({error:'Payment confirmation does not match this $149 examination intake.'},{status:400});
  const {data:existing,error:readError}=await client().from('ta14_consequence_examination_intakes').select('intake_id,status,paypal_order_id,paypal_capture_id').eq('intake_id',intakeId).single();
  if(readError||!existing)return NextResponse.json({error:'Examination intake was not found.'},{status:404});
  if(existing.status==='PAID'&&existing.paypal_capture_id===captureId)return NextResponse.json({ok:true,intakeId,status:'PAID',idempotent:true});
  if(existing.status!=='READY_FOR_PAYMENT')return NextResponse.json({error:'This intake is not awaiting payment.'},{status:409});
  const paidAt=capturedAt&&Number.isFinite(Date.parse(capturedAt))?capturedAt:new Date().toISOString();
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
  return NextResponse.json({ok:true,intakeId:data.intake_id,status:data.status,queueId:queue.queue_id,queueState:queue.state,queuedAt:queue.queued_at,paidAt:data.paid_at,payloadSha256:data.payload_sha256,evidenceManifestSha256:data.evidence_manifest_sha256,evidenceItemCount:data.evidence_item_count,evidenceFrozenAt:data.evidence_frozen_at,boundary:'Payment purchases and queues the governed examination only. It does not establish admissibility, authority, standing, certification, endorsement, compliance, execution permission, or a favorable determination.'});
 }catch(e){console.error('Consequence payment record failed',e);return NextResponse.json({error:'Unable to record the consequence examination payment.'},{status:500})}
}