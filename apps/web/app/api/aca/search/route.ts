import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {createHash,randomUUID} from 'node:crypto';

export const runtime='nodejs';
type Decision='ALLOW'|'HOLD'|'DENY'|'ESCALATE';

function service(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return null;return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
function clean(v:unknown,max=500){return typeof v==='string'?v.trim().slice(0,max):''}
function evaluate(raw:string){
 const words=raw.split(/\s+/).filter(Boolean),lower=raw.toLowerCase();let determination:Decision='ALLOW',reason='The public-search proposal is sufficiently bounded for external commitment.';
 if(!raw){determination='HOLD';reason='No search request was supplied.'}
 else if(raw.length<3){determination='HOLD';reason='The request is too underspecified to bind to a useful public search.'}
 else if(words.length>45){determination='HOLD';reason='The request is too broad for this bounded demonstrator. Narrow it before commitment.'}
 else if(/\b(password|private key|api key|credit card|social security|ssn)\b/.test(lower)){determination='ESCALATE';reason='The request appears to seek sensitive credential or identity information and is not automatically committed to public search.'}
 const filler=new Set(['please','could','would','you','can','search','google','find','me','some','information','about','the','a','an','for','on','and','of','show']);
 const bounded=words.filter(w=>!filler.has(w.toLowerCase())).slice(0,20).join(' ')||raw;
 return {determination,reason,bounded,requestWordCount:words.length,boundedWordCount:bounded.split(/\s+/).filter(Boolean).length};
}
function fingerprint(req:NextRequest){const seed=`${req.headers.get('user-agent')||''}|${req.headers.get('accept-language')||''}`;return createHash('sha256').update(seed).digest('hex').slice(0,24)}

export async function POST(req:NextRequest){
 let body:any={};try{body=await req.json()}catch{return NextResponse.json({ok:false,error:'invalid_json'},{status:400})}
 const requestText=clean(body?.request,500),g=evaluate(requestText),recordId=`ACA-SR-${new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14)}-${randomUUID().slice(0,8).toUpperCase()}`;
 const googleUrl=`https://www.google.com/search?q=${encodeURIComponent(g.bounded)}`;
 const commitState=g.determination==='ALLOW'?'NOT_COMMITTED':'BLOCKED';
 const row={record_id:recordId,request_text:requestText,bounded_query:g.bounded,determination:g.determination,determination_reason:g.reason,commit_state:commitState,provider:'GOOGLE_WEB_SEARCH',provider_request_url:g.determination==='ALLOW'?googleUrl:null,request_word_count:g.requestWordCount,bounded_word_count:g.boundedWordCount,evidence:{source:'participant_request',preserved:true},continuity:{new_chain:true,prior_authority_inherited:false},binding:{provider:'Google Search',query:g.bounded,purpose:'bounded public web search'},outcome:{state:g.determination==='ALLOW'?'AWAITING_COMMIT':'NOT_EXECUTED'},session_fingerprint:fingerprint(req)};
 const db=service();let persisted=false;if(db){const {error}=await db.from('aca_search_records').insert(row);persisted=!error;if(error)console.error('ACA search record insert failed',error.message)}
 return NextResponse.json({ok:true,persisted,recordId,request:requestText,boundedQuery:g.bounded,determination:g.determination,reason:g.reason,commitState,googleUrl:g.determination==='ALLOW'?googleUrl:null});
}

export async function PATCH(req:NextRequest){
 let body:any={};try{body=await req.json()}catch{return NextResponse.json({ok:false,error:'invalid_json'},{status:400})}
 const recordId=clean(body?.recordId,100);if(!recordId)return NextResponse.json({ok:false,error:'record_id_required'},{status:400});
 const db=service();if(!db)return NextResponse.json({ok:false,error:'record_store_not_configured'},{status:503});
 const {data,error}=await db.from('aca_search_records').update({commit_state:'COMMITTED',committed_at:new Date().toISOString(),outcome:{state:'GOOGLE_SEARCH_COMMITTED',provider:'GOOGLE_WEB_SEARCH'}}).eq('record_id',recordId).eq('determination','ALLOW').eq('commit_state','NOT_COMMITTED').select('record_id,provider_request_url').maybeSingle();
 if(error)return NextResponse.json({ok:false,error:'record_update_failed'},{status:500});if(!data)return NextResponse.json({ok:false,error:'standing_not_current'},{status:409});
 return NextResponse.json({ok:true,recordId:data.record_id,googleUrl:data.provider_request_url});
}
