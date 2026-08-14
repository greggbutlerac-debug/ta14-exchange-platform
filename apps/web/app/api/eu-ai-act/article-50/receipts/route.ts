import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {NextRequest,NextResponse} from 'next/server';

function client(cookieStore:Awaited<ReturnType<typeof cookies>>){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
 if(!url||!key) throw new Error('Supabase public environment is not configured.');
 return createServerClient(url,key,{cookies:{getAll:()=>cookieStore.getAll(),setAll(values){try{values.forEach(({name,value,options})=>cookieStore.set(name,value,options));}catch{}}}});
}
async function auth(){const cookieStore=await cookies();const supabase=client(cookieStore);const {data:{user}}=await supabase.auth.getUser();return user?{user,supabase}:null;}
function strings(v:unknown){return Array.isArray(v)?v.filter((x):x is string=>typeof x==='string').map(x=>x.trim()).filter(Boolean):[];}
function text(v:unknown,max=4000){return typeof v==='string'?v.trim().slice(0,max):'';}

export async function GET(){
 try{
  const a=await auth();if(!a)return NextResponse.json({error:'Authentication required.'},{status:401});
  const {data:systems,error}=await a.supabase.from('eu_ai_systems').select('id,system_key,name,version,operator_role,jurisdiction,article_50_state').eq('user_id',a.user.id).order('updated_at',{ascending:false});
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({systems:systems??[]},{headers:{'Cache-Control':'no-store'}});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Unable to load System Passports.'},{status:500});}
}

export async function POST(request:NextRequest){
 try{
  const a=await auth();if(!a)return NextResponse.json({error:'Authentication required.'},{status:401});
  const body=await request.json();
  const systemId=text(body.systemId,64),actorRole=text(body.actorRole,100),sourceState=text(body.sourceState,120),determination=text(body.derivedDetermination,120),reviewerBasis=text(body.reviewerBasis,8000),limitations=text(body.limitations,8000);
  const contentTypes=strings(body.contentTypes),pathwaySet=strings(body.pathwaySet),declaredEvidence=strings(body.declaredEvidence),admittedEvidence=strings(body.admittedEvidence);
  if(!systemId||!actorRole||!sourceState||!determination||!reviewerBasis)return NextResponse.json({error:'System Passport, actor role, source state, determination, and reviewer basis are required.'},{status:400});
  if(pathwaySet.length===0)return NextResponse.json({error:'Select at least one Article 50 pathway before recording.'},{status:400});
  if(admittedEvidence.some(x=>!declaredEvidence.includes(x)))return NextResponse.json({error:'Admitted evidence must be a subset of declared evidence.'},{status:400});
  const {data:system,error:systemError}=await a.supabase.from('eu_ai_systems').select('id,system_key,name,version').eq('id',systemId).eq('user_id',a.user.id).maybeSingle();
  if(systemError||!system)return NextResponse.json({error:'The selected System Passport is unavailable or not owned by this account.'},{status:403});
  const receiptKey=`TA-14-A50-${system.system_key}-${Date.now()}`;
  const {data,error}=await a.supabase.from('eu_ai_article50_receipts').insert({user_id:a.user.id,system_id:system.id,receipt_key:receiptKey,actor_role:actorRole,content_types:contentTypes,pathway_set:pathwaySet,declared_evidence:declaredEvidence,admitted_evidence:admittedEvidence,source_state:sourceState,derived_determination:determination,reviewer_basis:reviewerBasis,limitations:limitations||null}).select('id,receipt_key,recorded_at').single();
  if(error)return NextResponse.json({error:error.message},{status:400});
  await a.supabase.from('eu_ai_systems').update({article_50_state:determination,updated_at:new Date().toISOString()}).eq('id',system.id).eq('user_id',a.user.id);
  return NextResponse.json({ok:true,receipt:data});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Unable to record Article 50 receipt.'},{status:500});}
}
