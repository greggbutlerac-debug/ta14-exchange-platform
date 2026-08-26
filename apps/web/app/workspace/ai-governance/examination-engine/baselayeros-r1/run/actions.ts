'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { baseLayerTechnicalFreezeRecord as freeze } from '@/lib/governance/technical-freeze-record';

export async function startBaseLayerExaminationRun() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) throw new Error('Authenticated operator required.');

  const { data: frozen, error: freezeError } = await supabase
    .from('consequence_technical_freezes')
    .select('record_id,freeze_sha256,status')
    .eq('record_id', freeze.recordId)
    .maybeSingle();

  if (freezeError || !frozen || frozen.status !== 'TECHNICAL_FREEZE_ISSUED' || !frozen.freeze_sha256) {
    throw new Error('Execution refused: no valid persisted Technical Freeze.');
  }

  const runId = `TA14-CE-RUN-${Date.now()}-${user.id.slice(0, 8)}`;
  const operatorName = (user.email ?? user.id).slice(0, 200);
  const { error } = await supabase.from('consequence_examination_runs').insert({
    run_id: runId,
    freeze_record_id: frozen.record_id,
    freeze_sha256: frozen.freeze_sha256,
    operator_user_id: user.id,
    operator_name: operatorName,
    environment_identity: {},
    scenario_state: { S0: 'NOT_STARTED', S1: 'NOT_STARTED', S2: 'NOT_STARTED', S3: 'NOT_STARTED', S4: 'NOT_STARTED', S5: 'NOT_STARTED', S6: 'NOT_STARTED', S7: 'NOT_STARTED' },
    challenge_records: [], evidence_receipts: [], native_determinations: [], status: 'OPEN'
  });
  if (error) throw new Error('Execution run was not persisted.');
  redirect(`/workspace/ai-governance/examination-engine/baselayeros-r1/run/${encodeURIComponent(runId)}`);
}
