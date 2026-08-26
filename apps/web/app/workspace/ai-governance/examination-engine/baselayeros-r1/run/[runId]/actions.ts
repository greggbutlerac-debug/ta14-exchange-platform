'use server';

import { createHash } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const EVENT_TYPES = ['SCENARIO_STAGE','CHALLENGE','EVIDENCE_RECEIPT','NATIVE_DETERMINATION','OUTCOME'] as const;
const STAGES = ['S0','S1','S2','S3','S4','S5','S6','S7'] as const;
type EventType = typeof EVENT_TYPES[number];

function canonicalize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${canonicalize(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export async function appendExaminationEvent(runId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) throw new Error('Authenticated operator required.');

  const eventType = String(formData.get('event_type') ?? '') as EventType;
  const stageRaw = String(formData.get('stage_id') ?? '');
  const summary = String(formData.get('summary') ?? '').trim();
  const evidenceRef = String(formData.get('evidence_ref') ?? '').trim();
  if (!EVENT_TYPES.includes(eventType)) throw new Error('Invalid event type.');
  if (!summary || summary.length > 5000) throw new Error('A bounded event summary is required.');
  const stageId = stageRaw ? (STAGES.includes(stageRaw as typeof STAGES[number]) ? stageRaw : null) : null;
  if (stageRaw && !stageId) throw new Error('Invalid scenario stage.');

  const { data: run, error: runError } = await supabase.from('consequence_examination_runs')
    .select('run_id,status,operator_user_id,freeze_record_id,freeze_sha256')
    .eq('run_id', runId).eq('operator_user_id', user.id).maybeSingle();
  if (runError || !run || run.status !== 'OPEN') throw new Error('Event refused: examination run is not open or attributable to this operator.');

  const payload = { run_id: run.run_id, freeze_record_id: run.freeze_record_id, freeze_sha256: run.freeze_sha256, event_type: eventType, stage_id: stageId, summary, evidence_ref: evidenceRef || null };
  const payloadSha256 = createHash('sha256').update(canonicalize(payload), 'utf8').digest('hex');
  const { error } = await supabase.from('consequence_examination_events').insert({ run_id: runId, operator_user_id: user.id, event_type: eventType, stage_id: stageId, payload, payload_sha256: payloadSha256 });
  if (error) throw new Error('Event was not preserved in the examination ledger.');
  revalidatePath(`/workspace/ai-governance/examination-engine/baselayeros-r1/run/${encodeURIComponent(runId)}`);
}
