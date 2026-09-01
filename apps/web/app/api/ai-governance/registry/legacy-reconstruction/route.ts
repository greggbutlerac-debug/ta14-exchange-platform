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

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function text(value: unknown): string { return typeof value === 'string' ? value.trim() : ''; }
function nullable(value: unknown): string | null { const valueText = text(value); return valueText || null; }

function buildPromotedDraft(payload: Record<string, unknown>, ownerUserId: string, reconstructionId: string, recoveryRecordId: string) {
  return {
    owner_user_id: ownerUserId,
    governance_name: text(payload.governanceName),
    short_name: nullable(payload.shortName),
    governance_category: text(payload.governanceCategory) || 'other',
    current_version: text(payload.currentVersion) || 'UNSPECIFIED',
    claimed_establishment_date: nullable(payload.establishmentDate),
    effective_version_date: nullable(payload.effectiveVersionDate),
    claimant_name: text(payload.claimantName),
    claimant_type: text(payload.claimantType) || 'other',
    submitter_authority_role: text(payload.authorityRole) || 'reconstructed participant record',
    authority_basis: text(payload.authorityEvidence) || 'Participant-confirmed legacy reconstruction; authority evidence requires participant review before submission.',
    current_steward: nullable(payload.stewardName),
    organization_name: nullable(payload.organization),
    contact_email: text(payload.contactEmail),
    public_contact_mode: 'private',
    public_website: nullable(payload.website),
    public_evidence_route: nullable(payload.publicEvidenceRoute),
    geographic_scope: nullable(payload.jurisdiction),
    regulatory_scope: nullable(payload.regulatoryScope),
    plain_language_description: text(payload.plainDescription),
    formal_claims: text(payload.claims),
    explicit_non_claims: text(payload.nonClaims),
    known_limitations: nullable(payload.limitations),
    known_disputes: nullable(payload.disputes),
    ownership_declaration: text(payload.ownershipDeclaration) || 'REQUIRES PARTICIPANT REVIEW BEFORE SUBMISSION',
    license_statement: nullable(payload.license),
    requested_review_pathway: text(payload.reviewPathway) || 'registry_only',
    record_visibility: 'private',
    allow_review_requests: false,
    allow_collaboration_inquiries: false,
    allow_dispute_notices: true,
    authority_declaration_accepted: false,
    accuracy_declaration_accepted: false,
    registry_boundary_accepted: false,
    intake_manifest: {
      draft_format: 'TA-14-AIGR-DRAFT-1.0',
      saved_from: 'participant_confirmed_legacy_reconstruction',
      legacy_reconstruction_id: reconstructionId,
      recovery_record_id: recoveryRecordId,
      provenance_boundary: PROVENANCE_BOUNDARY,
      promotion_creates_registration_standing: false,
      participant_must_review_before_submission: true,
      evidence_files_are_separate: true,
    },
    status: 'draft',
  };
}

export async function GET() {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { user, session } = auth;
  const { data, error } = await session.from('ta14_registry_legacy_registration_reconstructions').select('*').eq('owner_user_id', user.id).order('reconstructed_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ reconstructions: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { user, session } = auth;
  const body = record(await request.json());
  const recoveryRecordId = typeof body.recoveryRecordId === 'string' ? body.recoveryRecordId.trim() : '';
  const reconstructedPayload = record(body.reconstructedPayload);
  if (!recoveryRecordId) return NextResponse.json({ error: 'Recovery record ID is required.' }, { status: 400 });

  const { data: recovery, error: recoveryError } = await session.from('ta14_registry_pre_submission_recovery_records').select('id,owner_user_id,first_known_attempt_at,failure_type,recovery_status').eq('id', recoveryRecordId).eq('owner_user_id', user.id).maybeSingle();
  if (recoveryError || !recovery) return NextResponse.json({ error: 'Eligible recovery record was not found for this account.' }, { status: 404 });
  if (!recovery.first_known_attempt_at) return NextResponse.json({ error: 'Original attempt timestamp is required before reconstruction.' }, { status: 409 });

  const row = { recovery_record_id: recovery.id, owner_user_id: user.id, status: 'RECONSTRUCTION_IN_PROGRESS', original_attempt_at: recovery.first_known_attempt_at, original_failure_type: recovery.failure_type, reconstructed_payload: reconstructedPayload, provenance_boundary: PROVENANCE_BOUNDARY };
  const { data, error } = await session.from('ta14_registry_legacy_registration_reconstructions').upsert(row, { onConflict: 'recovery_record_id' }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, reconstruction: data, notice: 'Reconstructed information is preserved as participant-supplied replacement evidence. It is not represented as the original lost server record.' });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { user, session } = auth;
  const body = record(await request.json());
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id) return NextResponse.json({ error: 'Reconstruction ID is required.' }, { status: 400 });

  if (body.action === 'confirm') {
    const now = new Date().toISOString();
    const { data, error } = await session.from('ta14_registry_legacy_registration_reconstructions').update({ status: 'PARTICIPANT_CONFIRMED', participant_confirmed_at: now, provenance_boundary: PROVENANCE_BOUNDARY }).eq('id', id).eq('owner_user_id', user.id).eq('status', 'RECONSTRUCTION_IN_PROGRESS').select('*').maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: 'Only an in-progress reconstruction owned by this account can be confirmed.' }, { status: 409 });
    return NextResponse.json({ ok: true, reconstruction: data });
  }

  if (body.action === 'promote') {
    const { data: reconstruction, error: reconstructionError } = await session.from('ta14_registry_legacy_registration_reconstructions').select('*').eq('id', id).eq('owner_user_id', user.id).eq('status', 'PARTICIPANT_CONFIRMED').maybeSingle();
    if (reconstructionError) return NextResponse.json({ error: reconstructionError.message }, { status: 400 });
    if (!reconstruction || !reconstruction.participant_confirmed_at) return NextResponse.json({ error: 'Promotion requires a participant-confirmed reconstruction owned by this account.' }, { status: 409 });
    if (reconstruction.promoted_submission_id) return NextResponse.json({ error: 'This reconstruction has already been promoted.' }, { status: 409 });

    const draftRow = buildPromotedDraft(record(reconstruction.reconstructed_payload), user.id, reconstruction.id, reconstruction.recovery_record_id);
    const { data: draft, error: draftError } = await session.from('ai_governance_registry_submissions').insert(draftRow).select('id,status,created_at').single();
    if (draftError) return NextResponse.json({ error: draftError.message }, { status: 400 });

    const promotedAt = new Date().toISOString();
    const { data: promoted, error: promotionError } = await session.from('ta14_registry_legacy_registration_reconstructions').update({ status: 'PROMOTED_TO_DRAFT', promoted_submission_id: draft.id, promoted_at: promotedAt, provenance_boundary: PROVENANCE_BOUNDARY }).eq('id', reconstruction.id).eq('owner_user_id', user.id).eq('status', 'PARTICIPANT_CONFIRMED').select('*').maybeSingle();
    if (promotionError || !promoted) {
      await session.from('ai_governance_registry_submissions').delete().eq('id', draft.id).eq('owner_user_id', user.id).eq('status', 'draft');
      return NextResponse.json({ error: promotionError?.message ?? 'Promotion state changed before completion; draft was rolled back.' }, { status: 409 });
    }

    return NextResponse.json({ ok: true, reconstruction: promoted, draft, notice: 'Participant-confirmed reconstruction was copied into a private Registry draft. Historical failure and reconstruction records remain separate. This promotion does not create Registry standing.' });
  }

  return NextResponse.json({ error: 'Unsupported reconstruction action.' }, { status: 400 });
}
