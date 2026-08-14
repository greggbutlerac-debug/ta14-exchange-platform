import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type JsonRecord = Record<string, unknown>;

type SessionClient = ReturnType<typeof createSessionClient>;

function createSessionClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !publishableKey) throw new Error('Supabase public environment is not configured.');
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Existing session cookies remain authoritative for this request.
        }
      },
    },
  });
}

async function requireUser(): Promise<{ user: NonNullable<Awaited<ReturnType<SessionClient['auth']['getUser']>>['data']['user']>; session: SessionClient } | null> {
  const cookieStore = await cookies();
  const session = createSessionClient(cookieStore);
  const {
    data: { user },
    error,
  } = await session.auth.getUser();
  if (error || !user) return null;
  return { user, session };
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanText(value: unknown, max = 500): string | null {
  const next = text(value);
  return next ? next.slice(0, max) : null;
}

function bool(value: unknown): boolean {
  return value === true;
}

function cleanStep(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(13, Math.trunc(n))) : 0;
}

function sanitizePayload(value: unknown): JsonRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as JsonRecord;
}

function mapVisibility(value: unknown): 'public' | 'private' | 'selective' {
  switch (text(value).toUpperCase()) {
    case 'PUBLIC':
      return 'public';
    case 'CONTROLLED':
      return 'selective';
    default:
      return 'private';
  }
}

function mapContactMode(
  value: unknown,
): 'registry_contact_form' | 'website_only' | 'public_email' | 'private' {
  switch (text(value).toUpperCase()) {
    case 'WEBSITE_ONLY':
      return 'website_only';
    case 'PUBLIC_EMAIL':
      return 'public_email';
    case 'PRIVATE':
      return 'private';
    default:
      return 'registry_contact_form';
  }
}

function authoritativeDraftChanges(form: JsonRecord) {
  return {
    governance_name: text(form.governanceName),
    short_name: cleanText(form.shortName, 200),
    governance_category: text(form.governanceCategory),
    current_version: text(form.currentVersion),
    claimed_establishment_date: cleanText(form.establishmentDate, 32),
    effective_version_date: cleanText(form.effectiveVersionDate, 32),
    claimant_name: text(form.claimantName),
    claimant_type: text(form.claimantType),
    submitter_authority_role: text(form.authorityRole),
    authority_basis: text(form.authorityEvidence),
    current_steward: cleanText(form.stewardName, 500) ?? cleanText(form.claimantName, 500),
    organization_name: cleanText(form.organization, 500),
    contact_email: text(form.contactEmail).toLowerCase(),
    public_contact_mode: mapContactMode(form.contactVisibility),
    public_website: cleanText(form.website, 2000),
    public_evidence_route: cleanText(form.publicEvidenceRoute, 2000),
    geographic_scope: cleanText(form.jurisdiction, 1000),
    regulatory_scope: cleanText(form.regulatoryScope, 2000),
    plain_language_description: text(form.plainDescription),
    formal_claims: text(form.claims),
    explicit_non_claims: text(form.nonClaims),
    known_limitations: cleanText(form.limitations, 10000),
    known_disputes: cleanText(form.disputes, 10000),
    ownership_declaration: text(form.ownershipDeclaration),
    license_statement: cleanText(form.license, 10000),
    requested_review_pathway: text(form.reviewPathway),
    record_visibility: mapVisibility(form.recordVisibility),
    allow_review_requests: bool(form.allowReviewRequests),
    allow_collaboration_inquiries: bool(form.allowCollaboration),
    allow_dispute_notices: bool(form.allowDisputeNotices),
    authority_declaration_accepted: bool(form.authorityConfirmed),
    accuracy_declaration_accepted: bool(form.accuracyConfirmed),
    registry_boundary_accepted: bool(form.boundaryConfirmed),
    updated_at: new Date().toISOString(),
  };
}

async function syncLinkedDraft(
  session: SessionClient,
  userId: string,
  submissionId: string | null,
  form: JsonRecord,
) {
  if (!submissionId) return;

  const { error } = await session
    .from('ai_governance_registry_submissions')
    .update(authoritativeDraftChanges(form))
    .eq('id', submissionId)
    .eq('owner_user_id', userId)
    .eq('status', 'draft');

  if (error) {
    throw new Error(`Registry draft synchronization failed: ${error.message}`);
  }
}

export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { user, session } = auth;
    const { data, error } = await session
      .from('ta14_registry_registration_recovery_drafts')
      .select('*')
      .eq('user_id', user.id)
      .eq('state', 'active')
      .order('last_saved_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ recovery: data ?? null }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load registration recovery.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { user, session } = auth;
    const body = sanitizePayload(await request.json());
    const recoveryKey = cleanText(body.recoveryKey, 128);
    if (!recoveryKey || recoveryKey.length < 8) {
      return NextResponse.json({ error: 'Recovery key is required.' }, { status: 400 });
    }

    const form = sanitizePayload(body.form);
    const normalizedStep = cleanStep(body.activeStep);
    const payload = {
      ...body,
      recoveryKey,
      activeStep: normalizedStep,
    };

    const { data: existing, error: existingError } = await session
      .from('ta14_registry_registration_recovery_drafts')
      .select('submission_id')
      .eq('user_id', user.id)
      .eq('recovery_key', recoveryKey)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 400 });
    }

    await syncLinkedDraft(
      session,
      user.id,
      typeof existing?.submission_id === 'string' ? existing.submission_id : null,
      form,
    );

    const row = {
      user_id: user.id,
      recovery_key: recoveryKey,
      state: 'active',
      active_step: normalizedStep,
      governance_name: cleanText(form.governanceName, 500),
      organization_name: cleanText(form.organization, 500),
      contact_email: cleanText(form.contactEmail, 320)?.toLowerCase() ?? null,
      draft_payload: payload,
      last_saved_at: new Date().toISOString(),
    };

    const { data, error } = await session
      .from('ta14_registry_registration_recovery_drafts')
      .upsert(row, { onConflict: 'user_id,recovery_key' })
      .select('id, recovery_key, state, submission_id, active_step, first_saved_at, last_saved_at')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({
      ok: true,
      recovery: data,
      notice:
        existing?.submission_id
          ? 'Step preserved to recovery and synchronized to the linked private Registry draft.'
          : 'Incomplete registration preserved to the signed-in account. This is recovery state only, not a Registry submission.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to preserve registration recovery.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { user, session } = auth;
    const body = sanitizePayload(await request.json());
    const recoveryKey = cleanText(body.recoveryKey, 128);
    const submissionId = cleanText(body.submissionId, 64);
    const state = body.state === 'completed' ? 'completed' : 'promoted';
    if (!recoveryKey) return NextResponse.json({ error: 'Recovery key is required.' }, { status: 400 });

    const changes: JsonRecord = {
      state,
      submission_id: submissionId,
      last_saved_at: new Date().toISOString(),
    };
    if (state === 'promoted') changes.promoted_at = new Date().toISOString();
    if (state === 'completed') changes.completed_at = new Date().toISOString();

    const { data, error } = await session
      .from('ta14_registry_registration_recovery_drafts')
      .update(changes)
      .eq('user_id', user.id)
      .eq('recovery_key', recoveryKey)
      .select('id, state, submission_id, promoted_at, completed_at')
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    if (submissionId && data) {
      const now = new Date().toISOString();
      const { error: cleanupError } = await session
        .from('ta14_registry_registration_recovery_drafts')
        .update({ state: 'abandoned', last_saved_at: now })
        .eq('user_id', user.id)
        .eq('submission_id', submissionId)
        .eq('state', 'active')
        .neq('id', data.id);

      if (cleanupError) {
        return NextResponse.json({ error: cleanupError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ ok: true, recovery: data ?? null });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update registration recovery.' },
      { status: 500 },
    );
  }
}
