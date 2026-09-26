import {createHash,randomUUID} from "crypto";
import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
export const runtime="nodejs";
const BUCKET="ta14-protected-examination-evidence",MAX=50*1024*1024;
function sameOrigin(r:NextRequest){const o=r.headers.get("origin");if(!o)return true;try{return new URL(o).host===r.nextUrl.host}catch{return false}}
function db(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()??"";const key=process.env.SUPABASE_SECRET_KEY?.trim()||process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()||"";if(!url||!key)throw new Error("Evidence storage configuration unavailable.");return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})}
function safeName(name:string){return name.normalize("NFKC").replace(/[^a-zA-Z0-9._-]+/g,"_").replace(/^\.+/,"").slice(0,180)||"evidence.bin"}
export async function POST(request:NextRequest){
 try{
  if(!sameOrigin(request))return NextResponse.json({error:"Cross-origin upload is not allowed."},{status:403});
  const form=await request.formData(),intakeId=String(form.get("intakeId")??"").trim(),file=form.get("file");
  if(!/^TA14-CEX-\d{8}-[A-Z0-9]{10}$/.test(intakeId)||!(file instanceof File))return NextResponse.json({error:"A valid examination intake and evidence file are required."},{status:400});
  if(file.size<1||file.size>MAX)return NextResponse.json({error:"Evidence files must be between 1 byte and 50 MB."},{status:413});
  const client=db();const {data:intake,error:intakeError}=await client.from("ta14_consequence_examination_intakes").select("intake_id,status").eq("intake_id",intakeId).single();
  if(intakeError||!intake)return NextResponse.json({error:"Examination intake was not found."},{status:404});
  if(!["READY_FOR_PAYMENT","PAID"].includes(intake.status))return NextResponse.json({error:"Evidence cannot be added in the current intake state."},{status:409});
  const bytes=Buffer.from(await file.arrayBuffer()),sha256=createHash("sha256").update(bytes).digest("hex"),name=safeName(file.name),objectId=randomUUID(),path=`consequence-intakes/${intakeId}/${objectId}-${name}`;
  const {error:uploadError}=await client.storage.from(BUCKET).upload(path,bytes,{contentType:file.type||"application/octet-stream",upsert:false,cacheControl:"0"});
  if(uploadError){console.error("Evidence storage upload failed",uploadError);return NextResponse.json({error:"Unable to preserve the evidence bytes."},{status:500})}
  const row={intake_id:intakeId,storage_bucket:BUCKET,storage_path:path,original_filename:file.name.slice(0,500),media_type:(file.type||"application/octet-stream").slice(0,255),size_bytes:file.size,sha256,evidence_state:"SUBMITTED_NOT_ADMITTED"};
  const {data,error}=await client.from("ta14_consequence_intake_evidence").insert(row).select("id,original_filename,media_type,size_bytes,sha256,evidence_state,created_at").single();
  if(error){await client.storage.from(BUCKET).remove([path]);console.error("Evidence manifest insert failed",error);return NextResponse.json({error:"Unable to bind the preserved evidence to the intake."},{status:500})}
  return NextResponse.json({ok:true,evidence:data,boundary:"The file bytes are privately preserved and hash-bound to this intake. SUBMITTED_NOT_ADMITTED is not a finding of admissibility."},{status:201});
 }catch(e){console.error("Consequence evidence upload failed",e);return NextResponse.json({error:"Unable to process the evidence upload."},{status:500})}
}