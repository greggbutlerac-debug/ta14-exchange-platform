import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type RegistrySubmissionRow = {
  id: string;
  owner_user_id: string;
  governance_name: string;
  short_name: string | null;
  current_version: string;
  governance_category: string;
  status: string;
  registry_identifier: string | null;
  record_visibility: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  accepted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type RegistryExceptionRow = {
  id: string;
  submission_id: string;
  exception_status: string;
  exception_type: string;
  exception_code: string | null;
  exception_summary: string;
  exception_details: string[] | null;
  readiness_failures: string[] | null;
  resolution_summary: string | null;
  opened_at: string | null;
  resolved_at: string | null;
  updated_at: string | null;
};

type NormalizedRegistryException = {
  id: string;
  exceptionStatus: string;
  exceptionType: string;
  exceptionCode: string | null;
  exceptionSummary: string;
  exceptionDetails: string[];
  readinessFailures: string[];
  resolutionSummary: string | null;
  openedAt: string | null;
  resolvedAt: string | null;
  updatedAt: string | null;
};

const ACTIVE_EXCEPTION_STATUSES = ['open', 'correction_required', 'under_review'] as const;
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' };

function requiredEnvironment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return supabaseUrl && supabaseAnonKey ? { supabaseUrl, supabaseAnonKey } : null;
}

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.toLowerCase().startsWith('bearer ')) return null;
  return authorization.slice(7).trim() || null;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const rawBody = await response.text();
  if (!rawBody) return null;
  try { return JSON.parse(rawBody) as unknown; } catch { return rawBody; }
}

function serviceHeaders(anonKey: string, accessToken: string) {
  return { apikey: anonKey, Authorization: `Bearer ${accessToken}`, Accept: 'application/json' };
}

function normalizeException(row: RegistryExceptionRow): NormalizedRegistryException {
  return {
    id: row.id,
    exceptionStatus: row.exception_status,
    exceptionType: row.exception_type,
    exceptionCode: row.exception_code,
    exceptionSummary: row.exception_summary,
    exceptionDetails: Array.isArray(row.exception_details) ? row.exception_details : [],
    readinessFailures: Array.isArray(row.readiness_failures) ? row.readiness_failures : [],
    resolutionSummary: row.resolution_summary,
    openedAt: row.opened_at,
    resolvedAt: row.resolved_at,
    updatedAt: row.updated_at,
  };
}

function normalizeRow(row: RegistrySubmissionRow, latestException: NormalizedRegistryException | null) {
  const needsAttention = Boolean(latestException);
  const registrationState =
    row.status === 'registered' && Boolean(row.registry_identifier)
      ? 'registered'
      : needsAttention
        ? 'needs_attention'
        : row.status;

  return {
    id: row.id,
    governanceName: row.governance_name,
    shortName: row.short_name,
    currentVersion: row.current_version,
    category: row.governance_category,
    status: row.status,
    registryIdentifier: row.registry_identifier,
    visibility: row.record_visibility,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
    acceptedAt: row.accepted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    needsAttention,
    registrationState,
    latestException,
  };
}

export async function GET(request: NextRequest) {
  const environment = requiredEnvironment();
  if (!environment) {
    return NextResponse.json({
      error: 'REGISTRY_CONFIGURATION_MISSING',
      message: 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required to load Registry records.',
    }, { status: 503, headers: NO_STORE_HEADERS });
  }

  const accessToken = bearerToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED', message: 'A signed-in Registry account is required.' }, { status: 401, headers: NO_STORE_HEADERS });
  }

  try {
    // Resolve the JWT to a concrete authenticated user before any Registry query.
    // This endpoint is an owner workspace, not a reviewer-wide queue, so every
    // submission query is explicitly constrained by owner_user_id even if RLS
    // grants the same account broader reviewer visibility elsewhere.
    const userResponse = await fetch(`${environment.supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      cache: 'no-store',
      headers: serviceHeaders(environment.supabaseAnonKey, accessToken),
    });
    const userPayload = await parseResponseBody(userResponse);
    const userId =
      userResponse.ok && typeof userPayload === 'object' && userPayload !== null && 'id' in userPayload && typeof userPayload.id === 'string'
        ? userPayload.id
        : null;

    if (!userId) {
      return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED', message: 'The Registry session is missing or expired.' }, { status: 401, headers: NO_STORE_HEADERS });
    }

    const submissionQuery = new URLSearchParams({
      select: 'id,owner_user_id,governance_name,short_name,current_version,governance_category,status,registry_identifier,record_visibility,submitted_at,reviewed_at,accepted_at,created_at,updated_at',
      owner_user_id: `eq.${userId}`,
      order: 'updated_at.desc',
    });

    const submissionsResponse = await fetch(
      `${environment.supabaseUrl}/rest/v1/ai_governance_registry_submissions?${submissionQuery.toString()}`,
      { method: 'GET', cache: 'no-store', headers: serviceHeaders(environment.supabaseAnonKey, accessToken) },
    );
    const submissionsPayload = await parseResponseBody(submissionsResponse);

    if (!submissionsResponse.ok) {
      return NextResponse.json({
        error: submissionsResponse.status === 403 ? 'REGISTRY_ACCESS_DENIED' : 'REGISTRY_RECORDS_QUERY_FAILED',
        message: submissionsResponse.status === 403 ? 'The signed-in account cannot access its Registry records.' : 'Your Registry records could not be queried.',
        detail: submissionsPayload,
      }, { status: submissionsResponse.status === 403 ? 403 : 500, headers: NO_STORE_HEADERS });
    }

    if (!Array.isArray(submissionsPayload)) {
      return NextResponse.json({ error: 'REGISTRY_RECORDS_RESPONSE_INVALID', message: 'The Registry records query returned an invalid response.', detail: submissionsPayload }, { status: 500, headers: NO_STORE_HEADERS });
    }

    const submissionRows = (submissionsPayload as RegistrySubmissionRow[]).filter((row) => row.owner_user_id === userId);
    const submissionIds = submissionRows.map((row) => row.id);
    let exceptionRows: RegistryExceptionRow[] = [];

    if (submissionIds.length > 0) {
      const exceptionQuery = new URLSearchParams({
        select: 'id,submission_id,exception_status,exception_type,exception_code,exception_summary,exception_details,readiness_failures,resolution_summary,opened_at,resolved_at,updated_at',
        submission_id: `in.(${submissionIds.join(',')})`,
        exception_status: `in.(${ACTIVE_EXCEPTION_STATUSES.join(',')})`,
        order: 'opened_at.desc',
      });

      const exceptionsResponse = await fetch(
        `${environment.supabaseUrl}/rest/v1/ta14_registry_registration_exceptions?${exceptionQuery.toString()}`,
        { method: 'GET', cache: 'no-store', headers: serviceHeaders(environment.supabaseAnonKey, accessToken) },
      );
      const exceptionsPayload = await parseResponseBody(exceptionsResponse);

      if (!exceptionsResponse.ok) {
        return NextResponse.json({
          error: exceptionsResponse.status === 403 ? 'REGISTRY_EXCEPTION_ACCESS_DENIED' : 'REGISTRY_EXCEPTIONS_QUERY_FAILED',
          message: exceptionsResponse.status === 403 ? 'The signed-in account cannot access Registry exception records.' : 'Registry action-required information could not be loaded.',
          detail: exceptionsPayload,
        }, { status: exceptionsResponse.status === 403 ? 403 : 500, headers: NO_STORE_HEADERS });
      }

      if (!Array.isArray(exceptionsPayload)) {
        return NextResponse.json({ error: 'REGISTRY_EXCEPTIONS_RESPONSE_INVALID', message: 'The Registry exception query returned an invalid response.', detail: exceptionsPayload }, { status: 500, headers: NO_STORE_HEADERS });
      }

      const allowedIds = new Set(submissionIds);
      exceptionRows = (exceptionsPayload as RegistryExceptionRow[]).filter((row) => allowedIds.has(row.submission_id));
    }

    const latestExceptionBySubmission = new Map<string, NormalizedRegistryException>();
    for (const exceptionRow of exceptionRows) {
      if (!latestExceptionBySubmission.has(exceptionRow.submission_id)) {
        latestExceptionBySubmission.set(exceptionRow.submission_id, normalizeException(exceptionRow));
      }
    }

    const records = submissionRows.map((row) => normalizeRow(row, latestExceptionBySubmission.get(row.id) ?? null));
    const attentionCount = records.filter((record) => record.needsAttention).length;

    return NextResponse.json({ records, attentionCount, generatedAt: new Date().toISOString() }, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    return NextResponse.json({
      error: 'REGISTRY_RECORDS_UNAVAILABLE',
      message: 'Your Registry records are temporarily unavailable.',
      detail: error instanceof Error ? error.message : 'Unknown Registry records error.',
    }, { status: 503, headers: NO_STORE_HEADERS });
  }
}
