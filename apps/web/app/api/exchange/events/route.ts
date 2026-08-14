import {NextRequest,NextResponse} from 'next/server';
import {createClient as createServiceClient} from '@supabase/supabase-js';
import {createClient as createServerClient} from '@/lib/supabase/server';

export const dynamic='force-dynamic';
export const runtime='nodejs';

const allowed=new Set(['TESTED','FORKED','CHALLENGED','REVALIDATED','DEGRADED','REVISED','REVIEWED']);
function service(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return null;return createServiceClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}

export async function POST(req:NextRequest){
  const auth=await createServerClient();
  const{data:{user}}=await auth.auth.getUser();
  if(!user)return NextResponse.json({error:'AUTH_REQUIRED'},{status:401});
  let body:{routeId?:string;eventType?:string;eventState?:string;summary?:string;sourceRouteId?:string;visibility?:string;eventData?:Record<string,unknown>};
  try{body=await req.json()}catch{return NextResponse.json({error:'INVALID_JSON'},{status:400})}
  const routeId=body.routeId?.trim(),eventType=body.eventType?.trim().toUpperCase(),eventState=body.eventState?.trim(),summary=body.summary?.trim();
  if(!routeId||!eventType||!eventState||!summary)return NextResponse.json({error:'MISSING_EVENT_FIELDS'},{status:400});
  if(!allowed.has(eventType))return NextResponse.json({error:'INVALID_EVENT_TYPE'},{status:400});
  if(summary.length>500||routeId.length>180)return NextResponse.json({error:'EVENT_TOO_LARGE'},{status:400});
  const visibility=body.visibility==='PRIVATE'?'PRIVATE':'PUBLIC';
  const db=service();if(!db)return NextResponse.json({error:'EVENT_LEDGER_NOT_CONFIGURED'},{status:503});
  const{data,error}=await db.from('exchange_route_events').insert({route_id:routeId,event_type:eventType,event_state:eventState,summary,source_route_id:body.sourceRouteId?.trim()||null,actor_user_id:user.id,actor_label:user.email??'Authenticated participant',visibility,event_data:body.eventData??{}}).select('id,route_id,event_type,event_state,summary,visibility,occurred_at').single();
  if(error){console.error('EXCHANGE_EVENT_WRITE_FAILED',error);return NextResponse.json({error:'EVENT_WRITE_FAILED'},{status:500})}
  return NextResponse.json({event:data},{status:201});
}
