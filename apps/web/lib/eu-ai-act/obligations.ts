import { createClient } from '@/lib/supabase/client';

export type ObligationState='APPLICABLE'|'CONDITIONAL'|'NOT APPLICABLE'|'UNRESOLVED'|'REVALIDATE';
export type EuAiObligation={id:string;key:string;systemId:string;source:string;title:string;actor:string;state:ObligationState;reason:string;evidence:string[];dependencies:string[];trigger:string;owner:string;updated:string};
type Row={id:string;obligation_key:string;system_id:string;source_ref:string;title:string;actor_role:string;state:string;applicability_reason:string;accountable_owner:string;revalidation_trigger:string;evidence_expectations:string[]|null;dependencies:string[]|null;updated_at:string};

function fromRow(r:Row):EuAiObligation{return{id:r.id,key:r.obligation_key,systemId:r.system_id,source:r.source_ref,title:r.title,actor:r.actor_role,state:r.state as ObligationState,reason:r.applicability_reason,evidence:r.evidence_expectations??[],dependencies:r.dependencies??[],trigger:r.revalidation_trigger,owner:r.accountable_owner,updated:r.updated_at?.slice(0,10)??''}}
const fields='id,obligation_key,system_id,source_ref,title,actor_role,state,applicability_reason,accountable_owner,revalidation_trigger,evidence_expectations,dependencies,updated_at';

export async function listObligations(systemId:string):Promise<EuAiObligation[]>{const s=createClient();const{data,error}=await s.from('eu_ai_obligations').select(fields).eq('system_id',systemId).order('recorded_at',{ascending:true});if(error)throw error;return((data??[])as Row[]).map(fromRow)}

export async function createObligation(systemId:string,o:Omit<EuAiObligation,'id'|'systemId'|'updated'>):Promise<EuAiObligation>{const s=createClient();const{data,error}=await s.from('eu_ai_obligations').insert({obligation_key:o.key,system_id:systemId,source_ref:o.source,title:o.title,actor_role:o.actor,state:o.state,applicability_reason:o.reason,accountable_owner:o.owner,revalidation_trigger:o.trigger,evidence_expectations:o.evidence,dependencies:o.dependencies}).select(fields).single();if(error)throw error;return fromRow(data as Row)}

export async function updateObligationState(id:string,state:ObligationState):Promise<EuAiObligation>{const s=createClient();const{data,error}=await s.from('eu_ai_obligations').update({state,updated_at:new Date().toISOString()}).eq('id',id).select(fields).single();if(error)throw error;return fromRow(data as Row)}

export async function reconcileObligation(id:string,input:{state:ObligationState;reason:string;actor?:string;dependencies?:string[]}):Promise<EuAiObligation>{const s=createClient();const payload:{state:ObligationState;applicability_reason:string;actor_role?:string;dependencies?:string[];updated_at:string}={state:input.state,applicability_reason:input.reason,updated_at:new Date().toISOString()};if(input.actor)payload.actor_role=input.actor;if(input.dependencies)payload.dependencies=input.dependencies;const{data,error}=await s.from('eu_ai_obligations').update(payload).eq('id',id).select(fields).single();if(error)throw error;return fromRow(data as Row)}
