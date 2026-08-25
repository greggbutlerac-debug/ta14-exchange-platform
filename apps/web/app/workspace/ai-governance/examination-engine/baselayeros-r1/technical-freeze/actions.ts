'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { compileTechnicalFreeze, type FreezeCandidate } from '@/lib/governance/freeze-compiler';
import { baseLayerTechnicalFreezeRecord as freeze } from '@/lib/governance/technical-freeze-record';

const FREEZE_PATH = '/workspace/ai-governance/examination-engine/baselayeros-r1/technical-freeze';

type PersistedDraft = {
  record_id: string;
  instrument_id: string;
  intake_id: string;
  participant_user_id: string;
  participant_name: string;
  participant_organization: string | null;
  participant_review_state: 'COMPLETE' | 'INCOMPLETE';
  issuer_user_id: string;
  issuer_name: string;
  issuer_authority_record_id: string;
  gate_state: FreezeCandidate['gates'];
  frozen_objects: FreezeCandidate['frozenObjects'];
  status: 'DRAFT' | 'TECHNICAL_FREEZE_ISSUED' | 'SUPERSEDED' | 'WITHDRAWN';
};

export type FreezeIssueResult = { ok: boolean; message: string; sha256?: string };

export async function issueBaseLayerTechnicalFreeze(): Promise<FreezeIssueResult> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData.user;
  if (authError || !user) return { ok: false, message: 'Authenticated issuer required.' };

  const { data, error } = await supabase
    .from('consequence_technical_freezes')
    .select('record_id,instrument_id,intake_id,participant_user_id,participant_name,participant_organization,participant_review_state,issuer_user_id,issuer_name,issuer_authority_record_id,gate_state,frozen_objects,status')
    .eq('record_id', freeze.recordId)
    .maybeSingle();

  if (error || !data) return { ok: false, message: 'Persisted draft not found or not readable. Freeze remains closed.' };
  const draft = data as PersistedDraft;
  if (draft.status !== 'DRAFT') return { ok: false, message: `Issuance refused: record state is ${draft.status}.` };
  if (draft.issuer_user_id !== user.id) return { ok: false, message: 'Issuance refused: authenticated user is not the attributable issuer.' };

  const issuedAt = new Date().toISOString();
  const candidate: FreezeCandidate = {
    recordId: draft.record_id,
    instrumentId: draft.instrument_id,
    intakeId: draft.intake_id,
    issuer: { name: draft.issuer_name, authorityRecordId: draft.issuer_authority_record_id },
    participant: { name: draft.participant_name, organization: draft.participant_organization ?? undefined, reviewState: draft.participant_review_state },
    gates: draft.gate_state ?? [],
    frozenObjects: draft.frozen_objects ?? [],
    issuedAt,
  };

  const compiled = compileTechnicalFreeze(candidate);
  if (!compiled.executable || !compiled.canonicalJson || !compiled.sha256) {
    return { ok: false, message: `Freeze refused: ${compiled.errors.join(' ') || 'compiler did not establish executability.'}` };
  }

  const { data: updated, error: updateError } = await supabase
    .from('consequence_technical_freezes')
    .update({ canonical_json: compiled.canonicalJson, freeze_sha256: compiled.sha256, status: 'TECHNICAL_FREEZE_ISSUED', issued_at: issuedAt, updated_at: issuedAt })
    .eq('id', (data as { id?: string }).id ?? '')
    .eq('record_id', draft.record_id)
    .eq('issuer_user_id', user.id)
    .eq('status', 'DRAFT')
    .select('record_id,status,freeze_sha256')
    .maybeSingle();

  if (updateError || !updated) return { ok: false, message: 'Freeze issuance was not persisted. Execution remains locked.' };
  revalidatePath(FREEZE_PATH);
  return { ok: true, message: 'Technical Freeze issued and persisted as an immutable record.', sha256: compiled.sha256 };
}
