import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const PROVENANCE_BOUNDARY = {
  originalSubstantivePayloadRecovered: false,
  reconstructedPayloadIsOriginalServerRecord: false,
  originalAttemptTimestampPreserved: true,
  reconstructionTimestampPreserved: true,
} as const;

function createSessionClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) throw new Error('Supabase public environment is not configured.');
  return createServerClient(url, key, { cookies: { getAll: () => cookieStore.getAll(), setAll(values) { try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {} } } });
}

async function requireUser() {
  const cookieStore = await cookies();
  const session = createSessionClient(cookieStore);
  const { data: { user }, error } = await session.auth.getUser();
  return error || !user ? null : { user, session };
}

function record(value: unknown): Record<string, unknown> { return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function text(value: unknown): string { return typeof value === 'string' ? value.trim() : ''; }
function nullable(value: unknown): string | null { const valueText = text(value); return valueText || null; }

function buildPromotedDraft(payload: Record<string, unknown>, operatorUserId: string, reconstructionId: string, recoveryRecordId: string) {
  return {
    owner_user_id: operatorUserId,
    governance_name: text(payload.governanceName), short_name: nullable(payload.shortName), governance_category: text(payload.governanceCategory) || 'other', current_version: text(payload.currentVersion) || 'UNSPECIFIED',
    claimed_establishment_date: nullable(payload.establishmentDate), effective_version_date: nullable(payload.effectiveVersionDate), claimant_name: text(payload.claimantName), claimant_type: text(payload.claimantType) || 'other',
    submitter_authority_role: text(payload.authorityRole) || 'authorized legacy reconstruction operator',
    authority_basis: text(payload.authorityEvidence) || 'Participant-confirmed legacy reconstruction by a scoped authorized operator; authority evidence requires review before submission.',
    current_steward: nullable(payload.stewardName), organization_name: nullable(payload.organization), contact_email: text(payload.contactEmail), public_contact_mode: 'private', public_website: nullable(payload.website), public_evidence_route: nullable(payload.publicEvidenceRoute), geographic_scope: nullable(payload.jurisdiction), regulatory_scope: nullable(payload.regulatoryScope),
    plain_language_description: text(payload.plainDescription), formal_claims: text(payload.claims), explicit_non_claims: text(payload.nonClaims), known_limitations: nullable(payload.limitations), known_disputes: nullable(payload.disputes), ownership_declaration: text(payload.ownershipDeclaration) || 'REQUIRES PARTICIPANT REVIEW BEFORE SUBMISSION', license_statement: nullable(payload.license), requested_review_pathway: text(payload.reviewPathway) || 'registry_only',
    record_visibility: 'private', allow_review_requests: false, allow_collaboration_inquiries: false, allow_dispute_notices: true, authority_declaration_accepted: false, accuracy_declaration_accepted: false, registry_boundary_accepted: false,
    intake_manifest: { draft_format: 'TA-14-AIGR-DRAFT-1.0', saved_from: 'participant_confirmed_legacy_reconstruction', legacy_reconstruction_id: reconstructionId, recovery_record_id: recoveryRecordId, reconstruction_operator_user_id: operatorUserId, provenance_boundary: PROVENANCE_BOUNDARY, promotion_creates_registration_standing: false, participant_must_review_before_submission: true, evidence_files_are_separate: true }, status: 'draft',
  };
}

export async function GET() {
  const auth = await requireUser(); if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { user, session } = auth;
  const { data, error } = await session.from('ta14_registry_legacy_registration_reconstructions').select('*').or(`owner_user_id.eq.${user.id},operator_user_id.eq.${user.id}`).order('reconstructed_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ reconstructions: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(); if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { user, session } = auth; const body = record(await request.json());
  const recoveryRecordId = text(body.recoveryRecordId); const reconstructedPayload = record(body.reconstructedPayload);
  if (!recoveryRecordId) return NextResponse.json({ error: 'Recovery record ID is required.' }, { status: 400 });

  // RLS exposes this row only to its historical owner or a scoped authorized operator.
  const { data: recovery, error: recoveryError } = await session.from('ta14_registry_pre_submission_recovery_records').select('id,owner_user_id,first_known_attempt_at,failure_type,recovery_status').eq('id', recoveryRecordId).maybeSingle();
  if (recoveryError || !recovery) return NextResponse.json({ error: 'Eligible recovery record was not found or this account is not authorized to operate it.' }, { status: 404 });
  if (!recovery.first_known_attempt_at) return NextResponse.json({ error: 'Original attempt timestamp is required before reconstruction.' }, { status: 409 });

  const row = { recovery_record_id: recovery.id, owner_user_id: recovery.owner_user_id, operator_user_id: user.id, status: 'RECONSTRUCTION_IN_PROGRESS', original_attempt_at: recovery.first_known_attempt_at, original_failure_type: recovery.failure_type, reconstructed_payload: reconstructedPayload, provenance_boundary: PROVENANCE_BOUNDARY };
  const { data, error } = await session.from('ta14_registry_legacy_registration_reconstructions').upsert(row, { onConflict: 'recovery_record_id' }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, reconstruction: data, notice: 'Reconstructed information is preserved as participant-supplied replacement evidence. Historical ownership is unchanged; the authenticated operator is separately recorded.' });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireUser(); if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { user, session } = auth; const body = record(await request.json()); const id = text(body.id);
  if (!id) return NextResponse.json({ error: 'Reconstruction ID is required.' }, { status: 400 });

  if (body.action === 'confirm') {
    const now = new Date().toISOString();
    const { data, error } = await session.from('ta14_registry_legacy_registration_reconstructions').update({ status: 'PARTICIPANT_CONFIRMED', participant_confirmed_at: now, participant_confirmed_by: user.id, provenance_boundary: PROVENANCE_BOUNDARY }).eq('id', id).eq('operator_user_id', user.id).eq('status', 'RECONSTRUCTION_IN_PROGRESS').select('*').maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: 'Only the scoped authorized operator may confirm this in-progress reconstruction.' }, { status: 409 });
    return NextResponse.json({ ok: true, reconstruction: data });
  }

  if (body.action === 'promote') {
    const { data: reconstruction, error } = await session.from('ta14_registry_legacy_registration_reconstructions').select('*').eq('id', id).eq('operator_user_id', user.id).eq('status', 'PARTICIPANT_CONFIRMED').maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!reconstruction || !reconstruction.participant_confirmed_at) return NextResponse.json({ error: 'Promotion requires a participant-confirmed reconstruction operated by this account.' }, { status: 409 });
    if (reconstruction.promoted_submission_id) return NextResponse.json({ error: 'This reconstruction has already been promoted.' }, { status: 409 });
    const draftRow = buildPromotedDraft(record(reconstruction.reconstructed_payload), user.id, reconstruction.id, reconstruction.recovery_record_id);
    const { data: draft, error: draftError } = await session.from('ai_governance_registry_submissions').insert(draftRow).select('id,status,created_at').single();
    if (draftError) return NextResponse.json({ error: draftError.message }, { status: 400 });
    const promotedAt = new Date().toISOString();
    const { data: promoted, error: promotionError } = await session.from('ta14_registry_legacy_registration_reconstructions').update({ status: 'PROMOTED_TO_DRAFT', promoted_submission_id: draft.id, promoted_at: promotedAt, provenance_boundary: PROVENANCE_BOUNDARY }).eq('id', reconstruction.id).eq('operator_user_id', user.id).eq('status', 'PARTICIPANT_CONFIRMED').select('*').maybeSingle();
    if (promotionError || !promoted) { await session.from('ai_governance_registry_submissions').delete().eq('id', draft.id).eq('owner_user_id', user.id).eq('status', 'draft'); return NextResponse.json({ error: promotionError?.message ?? 'Promotion state changed before completion; draft was rolled back.' }, { status: 409 }); }
    return NextResponse.json({ ok: true, reconstruction: promoted, draft, notice: 'Participant-confirmed reconstruction was copied into the authorized operator’s private Registry draft. Historical ownership and reconstruction provenance remain separate. This promotion does not create Registry standing.' });
  }
  return NextResponse.json({ error: 'Unsupported reconstruction action.' }, { status: 400 });
}
