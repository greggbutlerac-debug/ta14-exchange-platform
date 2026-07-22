import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type RouteContext = {
  params: Promise<{
    registryIdentifier: string;
  }>;
};

type PublicRegistryRecordRow = {
  id: string;
  registry_identifier: string;
  governance_name: string;
  short_name?: string | null;
  version?: string | null;
  category?: string | null;
  steward?: string | null;
  claimed_establishment_date?: string | null;
  registered_at: string;
  status: string;
  summary?: string | null;
  domains?: string[] | null;
  evidence_count?: number | string | null;
  dispute_count?: number | string | null;
  supersedes_registry_identifier?: string | null;
  record_digest_sha256?: string | null;
  published_at?: string | null;
};

function requiredEnvironment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
}

function numericCount(value: number | string | null | undefined) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function normalizeIdentifier(value: string) {
  return decodeURIComponent(value).trim().toUpperCase();
}

function isValidRegistryIdentifier(value: string) {
  return /^TA-14-AIGR-[0-9]{4,}$/.test(value);
}

function normalizeRow(row: PublicRegistryRecordRow) {
  return {
    id: row.id,
    registryIdentifier: row.registry_identifier,
    governanceName: row.governance_name,
    shortName: row.short_name ?? null,
    version: row.version ?? null,
    category: row.category ?? null,
    steward: row.steward ?? null,
    claimedEstablishmentDate: row.claimed_establishment_date ?? null,
    registeredAt: row.registered_at,
    status: row.status,
    summary: row.summary ?? null,
    domains: Array.isArray(row.domains) ? row.domains : [],
    evidenceCount: numericCount(row.evidence_count),
    disputeCount: numericCount(row.dispute_count),
    supersedesRegistryIdentifier:
      row.supersedes_registry_identifier ?? null,
    recordDigestSha256: row.record_digest_sha256 ?? null,
    publishedAt: row.published_at ?? null,
    boundary: 'Registration is not certification.',
  };
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  const { registryIdentifier: routeValue } = await context.params;
  const registryIdentifier = normalizeIdentifier(routeValue);

  if (!isValidRegistryIdentifier(registryIdentifier)) {
    return NextResponse.json(
      {
        error: 'INVALID_REGISTRY_IDENTIFIER',
        message:
          'A valid permanent TA-14 AI Governance Registry identifier is required.',
      },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );
  }

  const environment = requiredEnvironment();

  if (!environment) {
    return NextResponse.json(
      {
        error: 'REGISTRY_CONFIGURATION_MISSING',
        message:
          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required to open public Registry records.',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );
  }

  try {
    const response = await fetch(
      `${environment.supabaseUrl}/rest/v1/rpc/ta14_registry_public_record_v1`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          apikey: environment.supabaseAnonKey,
          Authorization: `Bearer ${environment.supabaseAnonKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requested_registry_identifier: registryIdentifier,
        }),
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
      const functionUnavailable =
        response.status === 404 ||
        (typeof payload === 'object' &&
          payload !== null &&
          'code' in payload &&
          payload.code === 'PGRST202');

      return NextResponse.json(
        {
          error: functionUnavailable
            ? 'PUBLIC_REGISTRY_FUNCTION_NOT_INSTALLED'
            : 'PUBLIC_REGISTRY_RECORD_QUERY_FAILED',
          message: functionUnavailable
            ? 'The permanent public Registry record function has not been installed yet.'
            : 'The permanent public Registry record could not be queried.',
          detail: payload,
        },
        {
          status: functionUnavailable ? 503 : 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'X-Content-Type-Options': 'nosniff',
          },
        },
      );
    }

    if (!Array.isArray(payload)) {
      return NextResponse.json(
        {
          error: 'PUBLIC_REGISTRY_RECORD_RESPONSE_INVALID',
          message:
            'The permanent public Registry record function returned an invalid response.',
          detail: payload,
        },
        {
          status: 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'X-Content-Type-Options': 'nosniff',
          },
        },
      );
    }

    if (payload.length === 0) {
      return NextResponse.json(
        {
          error: 'PUBLIC_REGISTRY_RECORD_NOT_FOUND',
          message:
            'No published public Registry record was found for this permanent identifier.',
        },
        {
          status: 404,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'X-Content-Type-Options': 'nosniff',
          },
        },
      );
    }

    const row = payload[0] as Partial<PublicRegistryRecordRow>;

    if (
      typeof row.id !== 'string' ||
      typeof row.registry_identifier !== 'string' ||
      typeof row.governance_name !== 'string' ||
      typeof row.registered_at !== 'string' ||
      typeof row.status !== 'string'
    ) {
      return NextResponse.json(
        {
          error: 'PUBLIC_REGISTRY_RECORD_RESPONSE_INVALID',
          message:
            'The permanent public Registry record is missing required fields.',
          detail: payload,
        },
        {
          status: 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'X-Content-Type-Options': 'nosniff',
          },
        },
      );
    }

    return NextResponse.json(
      {
        record: normalizeRow(row as PublicRegistryRecordRow),
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
        error: 'PUBLIC_REGISTRY_RECORD_UNAVAILABLE',
        message:
          'The permanent public Registry record service is temporarily unavailable.',
        detail:
          error instanceof Error
            ? error.message
            : 'Unknown Registry service error.',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );
  }
}
