import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Decision =
  | 'return_for_correction'
  | 'hold'
  | 'escalate'
  | 'accept_for_registration';

type RequestBody = {
  submissionId?: string;
  decision?: Decision;
  rationale?: string;
  notes?: string;
};

function environment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return supabaseUrl && supabaseAnonKey ? { supabaseUrl, supabaseAnonKey } : null;
}

function bearer(request: NextRequest) {
  const value = request.headers.get('authorization');
  return value?.toLowerCase().startsWith('bearer ') ? value.slice(7).trim() : null;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(request: NextRequest) {
  const config = environment();
  if (!config) {
    return NextResponse.json({ error: 'REGISTRY_CONFIGURATION_MISSING', message: 'Registry database configuration is missing.' }, { status: 503 });
  }

  const accessToken = bearer(request);
  if (!accessToken) {
    return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED', message: 'A signed-in reviewer session is required.' }, { status: 401 });
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: 'INVALID_REQUEST_BODY', message: 'The request body must be valid JSON.' }, { status: 400 });
  }

  const submissionId = body.submissionId?.trim() ?? '';
  const rationale = body.rationale?.trim() ?? '';
  const notes = body.notes?.trim() ?? '';
  const allowed: Decision[] = ['return_for_correction', 'hold', 'escalate', 'accept_for_registration'];

  if (!isUuid(submissionId)) {
    return NextResponse.json({ error: 'INVALID_SUBMISSION_ID', message: 'A valid submission UUID is required.' }, { status: 400 });
  }
  if (!body.decision || !allowed.includes(body.decision)) {
    return NextResponse.json({ error: 'INVALID_REVIEW_DECISION', message: 'Select a supported Registry review decision.' }, { status: 400 });
  }
  if (rationale.length < 20) {
    return NextResponse.json({ error: 'RATIONALE_REQUIRED', message: 'Reviewer rationale must contain at least 20 characters.' }, { status: 400 });
  }

  const response = await fetch(`${config.supabaseUrl}/rest/v1/rpc/ta14_registry_record_review_decision_v1`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      apikey: config.supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requested_submission_id: submissionId,
      requested_decision: body.decision,
      requested_rationale: rationale,
      requested_notes: notes || null,
    }),
  });

  const raw = await response.text();
  let payload: unknown = null;
  try { payload = raw ? JSON.parse(raw) : null; } catch { payload = raw; }

  if (!response.ok) {
    const code = typeof payload === 'object' && payload && 'code' in payload ? String(payload.code) : '';
    const status = code === '42501' ? 403 : code === 'P0002' ? 404 : code === '23514' ? 409 : 500;
    return NextResponse.json({
      error: status === 403 ? 'REVIEWER_AUTHORITY_REQUIRED' : status === 404 ? 'SUBMISSION_NOT_FOUND' : status === 409 ? 'REVIEW_DECISION_BLOCKED' : 'REVIEW_DECISION_FAILED',
      message: status === 403 ? 'Only an authorized Registry reviewer may issue this decision.' : status === 404 ? 'The Registry submission was not found.' : status === 409 ? 'The current lifecycle state blocks this review decision.' : 'The review decision could not be recorded.',
      detail: payload,
    }, { status });
  }

  if (!Array.isArray(payload) || payload.length !== 1) {
    return NextResponse.json({ error: 'INVALID_REVIEW_RESPONSE', message: 'The review function returned an invalid response.', detail: payload }, { status: 500 });
  }

  const row = payload[0] as Record<string, unknown>;
  return NextResponse.json({
    submissionId: row.submission_id,
    status: row.status,
    decision: row.review_decision,
    reviewedAt: row.reviewed_at,
    acceptedAt: row.accepted_at,
    message: body.decision === 'accept_for_registration'
      ? 'The submission has been accepted for Registry finalization.'
      : 'The bounded Registry review decision has been preserved.',
    boundary: 'Review is not certification.',
  }, { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
