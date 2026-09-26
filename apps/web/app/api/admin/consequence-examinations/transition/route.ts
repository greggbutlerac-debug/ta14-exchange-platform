import {createServerClient} from '@supabase/ssr';
import {createClient} from '@supabase/supabase-js';
import {cookies} from 'next/headers';
import {NextRequest,NextResponse} from 'next/server';
function reviewers(){return new Set((process.env.TA14_REGISTRY_REVIEWER_EMAILS??'').split(',').map(v=>v.trim().toLowerCase()).filter(Boolean))}
async function operator(){
 const store=await cookies(),url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
 if(!url||!key)return {error:NextResponse.json({error:'Administration authentication is not configured.'},{status:503})};
 const auth=createServerClient(url,key,{cookies:{getAll(){return store.getAll()},setAll(v){try{for(const x of v)store.set(x.name,x.value,x.options)}catch{}}}});
 const {data:{user}}=await auth.auth.getUser(),email=user?.email?.trim().toLowerCase()??'';
 if(!user)return {error:NextResponse.json({error:'Authentication required.'},{status:401})};
 if(!email||!reviewers().has(email))return {error:NextResponse.json({error:'TA-14 examination administrator authorization required.'},{status:403})};
 return {user,email};
}
function admin(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),key=process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();if(!url||!key)throw new Error('Examination administration server configuration unavailable.');return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
export async function POST(request:NextRequest){
 try{
  const op=await operator();if('error'in op)return op.error;
  const body=await request.json() as {queueId?:string;action?:string};const queueId=body.queueId?.trim()??'',action=body.action?.trim()??'';
  if(!/^TA14-CEX-Q-[A-Z0-9]{12}$/.test(queueId)||!['ASSIGN_TO_ME','START_EXAMINATION'].includes(action))return NextResponse.json({error:'Valid queueId and action are required.'},{status:400});
  const db=admin();const {data:q,error}=await db.from('ta14_consequence_examination_queue').select('*').eq('queue_id',queueId).single();
  if(error||!q)return NextResponse.json({error:'Examination queue item not found.'},{status:404});
  const now=new Date().toISOString();
  if(action==='ASSIGN_TO_ME'){
   if(q.state!=='QUEUED')return NextResponse.json({error:'Only a QUEUED examination can be assigned.'},{status:409});
   const {data:updated,error:uerr}=await db.from('ta14_consequence_examination_queue').update({state:'ASSIGNED',assigned_operator_user_id:op.user.id,assigned_operator_name:op.email,assigned_at:now,updated_at:now}).eq('queue_id',queueId).eq('state','QUEUED').select('queue_id,intake_id,state,assigned_operator_user_id,assigned_operator_name,assigned_at').single();
   if(uerr||!updated)return NextResponse.json({error:'Assignment transition failed.'},{status:409});
   await db.from('ta14_consequence_examination_queue_events').insert({queue_id:queueId,intake_id:q.intake_id,event_type:'EXAMINER_ASSIGNED',from_state:'QUEUED',to_state:'ASSIGNED',event_payload:{operatorUserId:op.user.id,operatorEmail:op.email}});
   return NextResponse.json({ok:true,queue:updated,boundary:'Assignment identifies the accountable examiner. It is not a finding or determination.'});
  }
  if(q.state!=='ASSIGNED')return NextResponse.json({error:'Only an ASSIGNED examination can be started.'},{status:409});
  if(q.assigned_operator_user_id!==op.user.id)return NextResponse.json({error:'Only the assigned examiner may start this examination.'},{status:403});
  const {data:updated,error:uerr}=await db.from('ta14_consequence_examination_queue').update({state:'IN_EXAMINATION',examination_started_at:now,updated_at:now}).eq('queue_id',queueId).eq('state','ASSIGNED').eq('assigned_operator_user_id',op.user.id).select('queue_id,intake_id,state,assigned_operator_user_id,assigned_operator_name,examination_started_at').single();
  if(uerr||!updated)return NextResponse.json({error:'Examination start transition failed.'},{status:409});
  await db.from('ta14_consequence_examination_queue_events').insert({queue_id:queueId,intake_id:q.intake_id,event_type:'EXAMINATION_STARTED',from_state:'ASSIGNED',to_state:'IN_EXAMINATION',event_payload:{operatorUserId:op.user.id,operatorEmail:op.email}});
  return NextResponse.json({ok:true,queue:updated,boundary:'The governed examination has started. No ALLOW, HOLD, DENY, or ESCALATE determination has yet been issued.'});
 }catch(e){console.error('Consequence examination administration failed',e);return NextResponse.json({error:'Unable to perform examination administration transition.'},{status:500})}
}