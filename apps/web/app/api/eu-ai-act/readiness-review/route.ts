import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type IntakePayload = {
  organizationName?: unknown;
  contactName?: unknown;
  contactEmail?: unknown;
  systemName?: unknown;
  systemPublicUrl?: unknown;
  declaredRole?: unknown;
  intendedPurpose?: unknown;
  euExposure?: unknown;
  currentClassification?: unknown;
  possibleRiskPath?: unknown;
  requestedOutcome?: unknown;
  evidenceSummary?: unknown;
  evidenceLinks?: unknown;
  knownGaps?: unknown;
  materialChanges?: unknown;
  additionalContext?: unknown;
  urgency?: unknown;
  sourcePage?: unknown;
  referrer?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  limitationAcknowledged?: unknown;
  accuracyAcknowledged?: unknown;
  website?: unknown;
};

const MAX_BODY_BYTES = 64 * 1024;
const MAX_SHORT = 500;
const MAX_LONG = 8000;

function text(value: unknown, max = MAX_SHORT): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function nullable(value: unknown, max = MAX_SHORT): string | null {
  const normalized = text(value, max);
  return normalized || null;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320;
}

function normalizeUrgency(value: unknown): 'STANDARD' | 'PRIORITY' | 'CRITICAL' {
  const normalized = text(value, 20).toUpperCase();
  if (normalized === 'PRIORITY' || normalized === 'CRITICAL') return normalized;
  return 'STANDARD';
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const key =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    '';

  if (!url || !key) {
    throw new Error('EU AI Act readiness intake server configuration is unavailable.');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

function makeIntakeId(): string {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const token = randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase();
  return `TA14-EUAI-${stamp}-${token}`;
}

export async function POST(request: NextRequest) {
  try {
    if (!sameOrigin(request)) {
      return NextResponse.json({ error: 'Cross-origin submission is not allowed.' }, { status: 403 });
    }

    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return NextResponse.json({ error: 'Expected application/json.' }, { status: 415 });
    }

    const contentLength = Number(request.headers.get('content-length') ?? '0');
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request body is too large.' }, { status: 413 });
    }

    const payload = (await request.json()) as IntakePayload;

    // Honeypot: real clients leave this hidden field empty.
    if (text(payload.website, 200)) {
      return NextResponse.json({ ok: true, accepted: true });
    }

    const organizationName = text(payload.organizationName, 300);
    const contactName = text(payload.contactName, 300);
    const contactEmail = text(payload.contactEmail, 320).toLowerCase();
    const systemName = text(payload.systemName, 500);
    const intendedPurpose = text(payload.intendedPurpose, MAX_LONG);
    const euExposure = text(payload.euExposure, MAX_LONG);
    const requestedOutcome = text(payload.requestedOutcome, MAX_LONG);
    const evidenceSummary = text(payload.evidenceSummary, MAX_LONG);
    const limitationAcknowledged = payload.limitationAcknowledged === true;
    const accuracyAcknowledged = payload.accuracyAcknowledged === true;

    const missing = [
      ['organizationName', organizationName],
      ['contactName', contactName],
      ['contactEmail', contactEmail],
      ['systemName', systemName],
      ['intendedPurpose', intendedPurpose],
      ['euExposure', euExposure],
      ['requestedOutcome', requestedOutcome],
      ['evidenceSummary', evidenceSummary],
    ].filter(([, value]) => !value);

    if (missing.length) {
      return NextResponse.json(
        {
          error: 'Required fields are missing.',
          missing: missing.map(([key]) => key),
        },
        { status: 400 },
      );
    }

    if (!isEmail(contactEmail)) {
      return NextResponse.json({ error: 'Contact email is invalid.' }, { status: 400 });
    }

    if (!limitationAcknowledged || !accuracyAcknowledged) {
      return NextResponse.json(
        { error: 'Required intake acknowledgements must be accepted.' },
        { status: 400 },
      );
    }

    const intakeId = makeIntakeId();
    const supabase = getServiceClient();

    const row = {
      intake_id: intakeId,
      service_type: 'EU_AI_ACT_READINESS',
      status: 'submitted',
      urgency: normalizeUrgency(payload.urgency),
      organization_name: organizationName,
      contact_name: contactName,
      contact_email: contactEmail,
      system_name: systemName,
      system_public_url: nullable(payload.systemPublicUrl, 2000),
      declared_role: nullable(payload.declaredRole, 500),
      intended_purpose: intendedPurpose,
      eu_exposure: euExposure,
      current_classification: nullable(payload.currentClassification, 1000),
      possible_risk_path: nullable(payload.possibleRiskPath, 2000),
      requested_outcome: requestedOutcome,
      evidence_summary: evidenceSummary,
      evidence_links: nullable(payload.evidenceLinks, MAX_LONG),
      known_gaps: nullable(payload.knownGaps, MAX_LONG),
      material_changes: nullable(payload.materialChanges, MAX_LONG),
      additional_context: nullable(payload.additionalContext, MAX_LONG),
      source_page: nullable(payload.sourcePage, 2000),
      referrer: nullable(payload.referrer, 2000),
      utm_source: nullable(payload.utmSource, 500),
      utm_medium: nullable(payload.utmMedium, 500),
      utm_campaign: nullable(payload.utmCampaign, 500),
      limitation_acknowledged: limitationAcknowledged,
      accuracy_acknowledged: accuracyAcknowledged,
      metadata: {
        schema: 'TA14_EU_AI_ACT_READINESS_INTAKE_V1',
        userAgent: text(request.headers.get('user-agent'), 1000) || null,
        submittedHost: request.nextUrl.host,
      },
    };

    const { data, error } = await supabase
      .from('ta14_eu_ai_act_readiness_review_intakes')
      .insert(row)
      .select('intake_id, status, submitted_at')
      .single();

    if (error) {
      console.error('EU AI Act readiness intake insert failed', {
        code: error.code,
        message: error.message,
      });
      return NextResponse.json(
        { error: 'Unable to preserve the review request.' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        intakeId: data.intake_id,
        status: data.status,
        submittedAt: data.submitted_at,
        boundary:
          'Submission creates a review intake record only. It is not legal advice, certification, conformity assessment, regulatory approval, or a favorable finding.',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('EU AI Act readiness intake route failed', error);
    return NextResponse.json(
      { error: 'Unable to process the review request.' },
      { status: 500 },
    );
  }
}
