import { NextRequest,NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
function t(v:unknown,max=500){return typeof v==='string'?v.trim().slice(0,max):''}
function sameOrigin(r:NextRequest){const o=r.headers.get('origin');if(!o)return true;try{return new URL(o).host===r.nextUrl.host}catch{return false}}
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
  const {data,error}=await client().from('ta14_consequence_examination_intakes').update({status:'PAID',paypal_order_id:orderId,paypal_capture_id:captureId,paid_amount:149.00,paid_currency:'USD',paid_at:paidAt,updated_at:new Date().toISOString()}).eq('intake_id',intakeId).eq('status','READY_FOR_PAYMENT').select('intake_id,status,paid_at,payload_sha256').single();
  if(error||!data)return NextResponse.json({error:'Payment was captured but the intake could not be marked paid. Retain the PayPal capture ID for reconciliation.'},{status:500});
  return NextResponse.json({ok:true,intakeId:data.intake_id,status:data.status,paidAt:data.paid_at,payloadSha256:data.payload_sha256,boundary:'Payment purchases the governed examination only. It does not establish admissibility, authority, standing, certification, endorsement, compliance, execution permission, or a favorable determination.'});
 }catch(e){console.error('Consequence payment record failed',e);return NextResponse.json({error:'Unable to record the consequence examination payment.'},{status:500})}
}