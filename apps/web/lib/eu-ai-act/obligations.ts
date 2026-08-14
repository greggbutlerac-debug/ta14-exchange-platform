import { createClient } from '@/lib/supabase/client';
import { getClassificationDetermination, type ClassificationDetermination } from '@/lib/eu-ai-act/classification-determinations';
import { listSystemPassports, type SystemPassport } from '@/lib/eu-ai-act/system-passports';

export type ObligationState='APPLICABLE'|'CONDITIONAL'|'NOT APPLICABLE'|'UNRESOLVED'|'REVALIDATE';
export type EuAiObligation={id:string;key:string;systemId:string;source:string;title:string;actor:string;state:ObligationState;reason:string;evidence:string[];dependencies:string[];trigger:string;owner:string;updated:string};
type Row={id:string;obligation_key:string;system_id:string;source_ref:string;title:string;actor_role:string;state:string;applicability_reason:string;accountable_owner:string;revalidation_trigger:string;evidence_expectations:string[]|null;dependencies:string[]|null;updated_at:string};
type ClassificationContext={determination:ClassificationDetermination|null;passport:SystemPassport|null};

function fromRow(r:Row):EuAiObligation{return{id:r.id,key:r.obligation_key,systemId:r.system_id,source:r.source_ref,title:r.title,actor:r.actor_role,state:r.state as ObligationState,reason:r.applicability_reason,evidence:r.evidence_expectations??[],dependencies:r.dependencies??[],trigger:r.revalidation_trigger,owner:r.accountable_owner,updated:r.updated_at?.slice(0,10)??''}}
const fields='id,obligation_key,system_id,source_ref,title,actor_role,state,applicability_reason,accountable_owner,revalidation_trigger,evidence_expectations,dependencies,updated_at';

async function classificationContext(systemId:string):Promise<ClassificationContext>{const[determination,passports]=await Promise.all([getClassificationDetermination(systemId),listSystemPassports()]);return{determination,passport:passports.find(p=>p.id===systemId)??null}}
function reasoningValue(d:ClassificationDetermination|null,key:string){const value=d?.reasoning?.[key];return typeof value==='string'?value:''}
function reasoningNumber(d:ClassificationDetermination|null,key:string){const value=d?.reasoning?.[key];return typeof value==='number'?value:0}
function roles(d:ClassificationDetermination|null){const value=d?.reasoning?.roles;return Array.isArray(value)?value.filter((x):x is string=>typeof x==='string'):[]}
function effective(o:EuAiObligation,ctx:ClassificationContext):EuAiObligation{
 const d=ctx.determination,p=ctx.passport;if(!d)return classificationSensitive(o)?{...o,state:'UNRESOLVED',reason:`${o.reason} Upstream classification is not yet established for this System Passport.`}:o;
 const stale=Boolean(p&&d.boundVersion&&d.boundVersion!==p.version);if(stale&&classificationSensitive(o))return{...o,state:'REVALIDATE',reason:`Upstream classification was established for version ${d.boundVersion}; the active System Passport is version ${p?.version}. Re-establish classification before relying on this obligation route.`};
 if(d.state==='UNRESOLVED'&&classificationSensitive(o))return{...o,state:'UNRESOLVED',reason:`Upstream classification remains UNRESOLVED. ${d.proposition}`};
 const rs=roles(d);const actor=rs.length?rs.join(' + '):o.actor;const risk=reasoningValue(d,'riskRoute');const article50=reasoningNumber(d,'article50Indicators');
 if(o.key==='OB-HR'){
  if(risk==='HIGH-RISK INDICATOR'||risk==='PROHIBITED-PRACTICE REVIEW')return{...o,actor,state:'CONDITIONAL',reason:`Classification determination ${d.id.slice(0,8)} establishes ${risk}. High-risk downstream duties remain conditional on the bounded legal/factual route and supporting evidence.`};
  if(risk==='NO CURRENT HIGH-RISK INDICATOR')return{...o,actor,state:'NOT APPLICABLE',reason:`The current classification determination records no high-risk indicator within its stated system, version, role, purpose and jurisdiction boundary.`};
  return{...o,actor,state:'UNRESOLVED',reason:`The current classification determination does not establish the high-risk route. ${d.proposition}`};
 }
 if(o.key==='OB-050-1'){
  if(article50>0)return{...o,actor,state:'CONDITIONAL',reason:`The persisted classification determination records ${article50} Article 50 indicator${article50===1?'':'s'}. Applicability remains bounded to the declared facts, exceptions and evidence route.`};
  if(d.state==='ESTABLISHED'||d.state==='CONDITIONAL')return{...o,actor,state:'NOT APPLICABLE',reason:'The current persisted classification reasoning records no Article 50 interaction/transparency indicator for this bounded system state.'};
 }
 return rs.length&&o.key==='OB-004'?{...o,actor}:o;
}
function classificationSensitive(o:EuAiObligation){return o.key==='OB-HR'||o.key==='OB-050-1'}

export async function listObligations(systemId:string):Promise<EuAiObligation[]>{const s=createClient();const[{data,error},ctx]=await Promise.all([s.from('eu_ai_obligations').select(fields).eq('system_id',systemId).order('recorded_at',{ascending:true}),classificationContext(systemId)]);if(error)throw error;return((data??[])as Row[]).map(fromRow).map(o=>effective(o,ctx))}

export async function createObligation(systemId:string,o:Omit<EuAiObligation,'id'|'systemId'|'updated'>):Promise<EuAiObligation>{const s=createClient();const ctx=await classificationContext(systemId);const projected=effective({...o,id:'',systemId,updated:''},ctx);const{data,error}=await s.from('eu_ai_obligations').insert({obligation_key:projected.key,system_id:systemId,source_ref:projected.source,title:projected.title,actor_role:projected.actor,state:projected.state,applicability_reason:projected.reason,accountable_owner:projected.owner,revalidation_trigger:projected.trigger,evidence_expectations:projected.evidence,dependencies:projected.dependencies}).select(fields).single();if(error)throw error;return fromRow(data as Row)}

export async function updateObligationState(id:string,state:ObligationState):Promise<EuAiObligation>{const s=createClient();const{data,error}=await s.from('eu_ai_obligations').update({state,updated_at:new Date().toISOString()}).eq('id',id).select(fields).single();if(error)throw error;return fromRow(data as Row)}

export async function reconcileObligation(id:string,input:{state:ObligationState;reason:string;actor?:string;dependencies?:string[]}):Promise<EuAiObligation>{const s=createClient();const payload:{state:ObligationState;applicability_reason:string;actor_role?:string;dependencies?:string[];updated_at:string}={state:input.state,applicability_reason:input.reason,updated_at:new Date().toISOString()};if(input.actor)payload.actor_role=input.actor;if(input.dependencies)payload.dependencies=input.dependencies;const{data,error}=await s.from('eu_ai_obligations').update(payload).eq('id',id).select(fields).single();if(error)throw error;return fromRow(data as Row)}
