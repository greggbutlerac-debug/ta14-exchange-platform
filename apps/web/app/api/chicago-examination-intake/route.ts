import { createHash, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const runtime = "nodejs";
const VERSION="CHICAGO-POP-v0.2-CANDIDATE";
const sets={evidenceState:new Set(["CURRENT + ATTRIBUTABLE","INSUFFICIENT"]),authorityState:new Set(["CURRENT","EXPIRED"]),standingState:new Set(["ESTABLISHED","UNRESOLVED"]),executionScope:new Set(["IN BOUNDS","OUTSIDE"]),determination:new Set(["ALLOW","HOLD","DENY","ESCALATE"])};
const tv=(v:unknown,max=4000)=>typeof v==="string"?v.trim().slice(0,max):"";
export async function POST(req:NextRequest){
 try{
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return NextResponse.json({recorded:false,error:"Examination intake is not configured."},{status:503});
  const b=await req.json(),proof=tv(b.proof),proposedConsequence=tv(b.proposedConsequence),evidenceState=tv(b.evidenceState,40),authorityState=tv(b.authorityState,20),standingState=tv(b.standingState,20),executionScope=tv(b.executionScope,20),determination=tv(b.determination,20);
  if(!proof||!proposedConsequence||!sets.evidenceState.has(evidenceState)||!sets.authorityState.has(authorityState)||!sets.standingState.has(standingState)||!sets.executionScope.has(executionScope)||!sets.determination.has(determination))return NextResponse.json({recorded:false,error:"Invalid examination state."},{status:400});
  const expected=executionScope==="OUTSIDE"?"DENY":evidenceState==="INSUFFICIENT"?"HOLD":authorityState==="EXPIRED"?"HOLD":standingState==="UNRESOLVED"?"ESCALATE":"ALLOW";
  if(determination!==expected)return NextResponse.json({recorded:false,error:"Determination does not match the frozen gate state."},{status:400});
  const intakeId="CHI-"+new Date().toISOString().slice(0,10).replaceAll("-","")+"-"+randomUUID().slice(0,8).toUpperCase();
  const canonicalPayload={showroomVersion:VERSION,proof,proposedConsequence,evidenceState,authorityState,standingState,executionScope,determination};
  const payloadSha256=createHash("sha256").update(JSON.stringify(canonicalPayload),"utf8").digest("hex");
  const supabase=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
  const {data,error}=await supabase.from("ta14_chicago_public_examination_intakes").insert({intake_id:intakeId,showroom_version:VERSION,proof,proposed_consequence:proposedConsequence,evidence_state:evidenceState,authority_state:authorityState,standing_state:standingState,execution_scope:executionScope,determination,canonical_payload:canonicalPayload,payload_sha256:payloadSha256}).select("intake_id,recorded_at,payload_sha256").single();
  if(error){console.error("Chicago intake insert error:",error);return NextResponse.json({recorded:false,error:"Unable to record examination intake."},{status:500});}
  return NextResponse.json({recorded:true,intakeId:data.intake_id,recordedAt:data.recorded_at,payloadSha256:data.payload_sha256,status:"RECORDED_INTAKE",durableExaminationReceipt:false});
 }catch(error){console.error("Chicago intake error:",error);return NextResponse.json({recorded:false,error:"Unable to record examination intake."},{status:500});}
}