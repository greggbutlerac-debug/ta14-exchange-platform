'use server';

import { createHash } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const DETERMINATIONS = ['SUPPORTED','PARTIALLY_SUPPORTED','UNSUPPORTED','INDETERMINATE'] as const;
type Determination = typeof DETERMINATIONS[number];

function canonicalize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${JSON.stringify(k)}:${canonicalize(v)}`).join(',')}}`;
  return JSON.stringify(value);
}

export async function sealExaminationRun(runId:string, formData:FormData) {
  const supabase=await createClient(); const {data:auth}=await supabase.auth.getUser(); const user=auth.user;
  if(!user) throw new Error('Authenticated operator required.');
  const determination=String(formData.get('determination')??'') as Determination;
  const rationale=String(formData.get('rationale')??'').trim();
  if(!DETERMINATIONS.includes(determination)||!rationale||rationale.length>5000) throw new Error('Bounded determination and rationale required.');
  const {data:run}=await supabase.from('consequence_examination_runs').select('run_id,freeze_record_id,freeze_sha256,status,operator_user_id,started_at').eq('run_id',runId).eq('operator_user_id',user.id).maybeSingle();
  if(!run||run.status!=='OPEN') throw new Error('Run is not open or attributable to this operator.');
  const {data:events}=await supabase.from('consequence_examination_events').select('event_type,stage_id,payload,payload_sha256,recorded_at').eq('run_id',runId).order('recorded_at',{ascending:true});
  const ledger=events??[]; const stages=new Set(ledger.filter(e=>e.event_type==='SCENARIO_STAGE'&&e.stage_id).map(e=>e.stage_id));
  const missing=['S0','S1','S2','S3','S4','S5','S6','S7'].filter(s=>!stages.has(s));
  if(missing.length) throw new Error(`Seal refused: missing stage evidence ${missing.join(', ')}.`);
  if(!ledger.some(e=>e.event_type==='EVIDENCE_RECEIPT')) throw new Error('Seal refused: no evidence receipt preserved.');
  if(!ledger.some(e=>e.event_type==='NATIVE_DETERMINATION')) throw new Error('Seal refused: no native determination preserved.');
  if(!ledger.some(e=>e.event_type==='OUTCOME')) throw new Error('Seal refused: no outcome event preserved.');
  const sealedAt=new Date().toISOString();
  const outcome={ determination, rationale, semantics:'TA-14 bounded examination finding; does not replace participant native determination.', event_count:ledger.length };
  const digestObject={run_id:run.run_id,freeze_record_id:run.freeze_record_id,freeze_sha256:run.freeze_sha256,started_at:run.started_at,sealed_at:sealedAt,events:ledger,outcome};
  const runSha256=createHash('sha256').update(canonicalize(digestObject),'utf8').digest('hex');
  const {data:sealed,error}=await supabase.from('consequence_examination_runs').update({outcome_record:outcome,final_determination:determination,run_sha256:runSha256,status:'SEALED',sealed_at:sealedAt,updated_at:sealedAt}).eq('run_id',runId).eq('operator_user_id',user.id).eq('status','OPEN').select('run_id').maybeSingle();
  if(error||!sealed) throw new Error('Run was not sealed.');
  revalidatePath(`/workspace/ai-governance/examination-engine/baselayeros-r1/run/${encodeURIComponent(runId)}`);
}
