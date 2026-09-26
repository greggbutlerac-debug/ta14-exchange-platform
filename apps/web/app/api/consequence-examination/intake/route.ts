import { createHash, randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type Payload=Record<string,unknown>;
const MAX=8000;
function t(v:unknown,max=MAX){return typeof v==='string'?v.trim().slice(0,max):''}
function sameOrigin(r:NextRequest){const o=r.headers.get('origin');if(!o)return true;try{return new URL(o).host===r.nextUrl.host}catch{return false}}
function client(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()??'';const key=process.env.SUPABASE_SECRET_KEY?.trim()||process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()||'';if(!url||!key)throw new Error('Intake server configuration unavailable.');return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})}
function canonicalize(value:unknown):string{if(Array.isArray(value))return '['+value.map(canonicalize).join(',')+']';if(value&&typeof value==='object'){const o=value as Record<string,unknown>;return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonicalize(o[k])).join(',')+'}'}return JSON.stringify(value)}
export async function POST(request:NextRequest){
 try{
  if(!sameOrigin(request))return NextResponse.json({error:'Cross-origin submission is not allowed.'},{status:403});
  if(!(request.headers.get('content-type')??'').toLowerCase().includes('application/json'))return NextResponse.json({error:'Expected application/json.'},{status:415});
  const p=await request.json() as Payload;
  const proposedConsequence=t(p.proposedConsequence),actor=t(p.actor,1000),domain=t(p.domain,500),jurisdictionScope=t(p.jurisdictionScope,2000),evidenceBasis=t(p.evidenceBasis),authorityBasis=t(p.authorityBasis),standingBasis=t(p.standingBasis);
  const required={proposedConsequence,actor,domain,jurisdictionScope,evidenceBasis,authorityBasis,standingBasis};const missing=Object.entries(required).filter(([,v])=>!v).map(([k])=>k);
  if(missing.length)return NextResponse.json({error:'Required fields are missing.',missing},{status:400});
  const files=Array.isArray(p.candidateFilenames)?p.candidateFilenames.filter(x=>typeof x==='string').slice(0,50).map(x=>t(x,500)):[];
  const materialChangeDeclared=p.materialChangeDeclared===true,escalationDeclared=p.escalationDeclared===true;
  const readinessResult=escalationDeclared?'ESCALATION_FLAGGED':materialChangeDeclared?'REVALIDATION_REQUIRED':'READY_FOR_EXAMINATION';
  const canonicalPayload={schema:'TA14_CONSEQUENCE_EXAMINATION_INTAKE_V1',proposedConsequence,actor,domain,jurisdictionScope,evidenceBasis,authorityBasis,standingBasis,candidateFilenames:files,materialChangeDeclared,escalationDeclared,readinessResult};
  const payloadSha256=createHash('sha256').update(canonicalize(canonicalPayload)).digest('hex');
  const stamp=new Date().toISOString().slice(0,10).replaceAll('-','');const intakeId='TA14-CEX-'+stamp+'-'+randomUUID().replaceAll('-','').slice(0,10).toUpperCase();
  const row={intake_id:intakeId,status:'READY_FOR_PAYMENT',proposed_consequence:proposedConsequence,actor,domain,jurisdiction_scope:jurisdictionScope,evidence_basis:evidenceBasis,authority_basis:authorityBasis,standing_basis:standingBasis,candidate_filenames:files,material_change_declared:materialChangeDeclared,escalation_declared:escalationDeclared,readiness_result:readinessResult,canonical_payload:canonicalPayload,payload_sha256:payloadSha256,source_page:t(p.sourcePage,2000)||null};
  const {data,error}=await client().from('ta14_consequence_examination_intakes').insert(row).select('intake_id,status,readiness_result,payload_sha256,created_at').single();
  if(error){console.error('Consequence intake insert failed',{code:error.code,message:error.message});return NextResponse.json({error:'Unable to preserve the consequence examination intake.'},{status:500})}
  return NextResponse.json({ok:true,intakeId:data.intake_id,status:data.status,readinessResult:data.readiness_result,payloadSha256:data.payload_sha256,createdAt:data.created_at,boundary:'This preserves an examination intake only. It is not an ALLOW, HOLD, DENY, or ESCALATE determination and creates no execution authority.'},{status:201});
 }catch(e){console.error('Consequence intake route failed',e);return NextResponse.json({error:'Unable to process the consequence examination intake.'},{status:500})}
}