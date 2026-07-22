import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type RegistrySubmissionRow = {
  id: string;
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

function requiredEnvironment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
}

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get('authorization');

  if (!authorization?.toLowerCase().startsWith('bearer ')) {
    return null;
  }

  const token = authorization.slice(7).trim();
  return token || null;
}

function normalizeRow(row: RegistrySubmissionRow) {
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
  };
}

export async function GET(request: NextRequest) {
  const environment = requiredEnvironment();

  if (!environment) {
    return NextResponse.json(
      {
        error: 'REGISTRY_CONFIGURATION_MISSING',
        message:
          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required to load Registry records.',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  const accessToken = bearerToken(request);

  if (!accessToken) {
    return NextResponse.json(
      {
        error: 'AUTHENTICATION_REQUIRED',
        message: 'A signed-in Registry account is required.',
      },
      {
        status: 401,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  const query = new URLSearchParams({
    select:
      'id,governance_name,short_name,current_version,governance_category,status,registry_identifier,record_visibility,submitted_at,reviewed_at,accepted_at,created_at,updated_at',
    order: 'updated_at.desc',
  });

  try {
    const response = await fetch(
      `${environment.supabaseUrl}/rest/v1/ai_governance_registry_submissions?${query.toString()}`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          apikey: environment.supabaseAnonKey,
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
    );

    const rawBody = await response.text();
    let payload: unknown = null;

    if (rawBody) {
      try {
        payload = JSON.parse(rawBody);
      } catch {
        payload = rawBody;
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            response.status === 401
              ? 'AUTHENTICATION_REQUIRED'
              : response.status === 403
                ? 'REGISTRY_ACCESS_DENIED'
                : 'REGISTRY_RECORDS_QUERY_FAILED',
          message:
            response.status === 401
              ? 'The Registry session is missing or expired.'
              : response.status === 403
                ? 'The signed-in account cannot access these Registry records.'
                : 'Your Registry records could not be queried.',
          detail: payload,
        },
        {
          status:
            response.status === 401
              ? 401
              : response.status === 403
                ? 403
                : 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        },
      );
    }

    if (!Array.isArray(payload)) {
      return NextResponse.json(
        {
          error: 'REGISTRY_RECORDS_RESPONSE_INVALID',
          message: 'The Registry records query returned an invalid response.',
          detail: payload,
        },
        {
          status: 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        },
      );
    }

    const records = (payload as RegistrySubmissionRow[]).map(normalizeRow);

    return NextResponse.json(
      {
        records,
        count: records.length,
        generatedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'REGISTRY_RECORDS_UNAVAILABLE',
        message: 'Your Registry records are temporarily unavailable.',
        detail:
          error instanceof Error
            ? error.message
            : 'Unknown Registry service error.',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }
}
