import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PublicRegistryRow = {
  id: string;
  registry_identifier: string;
  governance_name: string;
  short_name?: string | null;
  version?: string | null;
  category?: string | null;
  steward?: string | null;
  claimed_establishment_date?: string | null;
  registered_at?: string | null;
  status: string;
  summary?: string | null;
  domains?: string[] | null;
  evidence_count?: number | string | null;
  dispute_count?: number | string | null;
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
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }

  return 0;
}

function normalizeRow(row: PublicRegistryRow) {
  return {
    id: row.id,
    registryIdentifier: row.registry_identifier,
    governanceName: row.governance_name,
    shortName: row.short_name ?? null,
    version: row.version ?? null,
    category: row.category ?? null,
    steward: row.steward ?? null,
    claimedEstablishmentDate: row.claimed_establishment_date ?? null,
    registeredAt: row.registered_at ?? null,
    status: row.status,
    summary: row.summary ?? null,
    domains: Array.isArray(row.domains) ? row.domains : [],
    evidenceCount: numericCount(row.evidence_count),
    disputeCount: numericCount(row.dispute_count),
  };
}

export async function GET() {
  const environment = requiredEnvironment();

  if (!environment) {
    return NextResponse.json(
      {
        error: 'REGISTRY_CONFIGURATION_MISSING',
        message:
          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required to publish the public Registry directory.',
        records: [],
        count: 0,
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  try {
    const response = await fetch(
      `${environment.supabaseUrl}/rest/v1/rpc/ta14_registry_public_directory_v1`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          apikey: environment.supabaseAnonKey,
          Authorization: `Bearer ${environment.supabaseAnonKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
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
      const unavailable =
        response.status === 404 ||
        (typeof payload === 'object' &&
          payload !== null &&
          'code' in payload &&
          payload.code === 'PGRST202');

      return NextResponse.json(
        {
          error: unavailable
            ? 'PUBLIC_REGISTRY_FUNCTION_NOT_INSTALLED'
            : 'PUBLIC_REGISTRY_QUERY_FAILED',
          message: unavailable
            ? 'The public Registry database function has not been installed yet.'
            : 'The public Registry directory could not be queried.',
          detail: payload,
          records: [],
          count: 0,
        },
        {
          status: unavailable ? 503 : 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        },
      );
    }

    if (!Array.isArray(payload)) {
      return NextResponse.json(
        {
          error: 'PUBLIC_REGISTRY_RESPONSE_INVALID',
          message: 'The public Registry database function returned an invalid response.',
          records: [],
          count: 0,
        },
        {
          status: 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        },
      );
    }

    const records = (payload as PublicRegistryRow[])
      .filter(
        (row) =>
          row &&
          typeof row.id === 'string' &&
          typeof row.registry_identifier === 'string' &&
          typeof row.governance_name === 'string' &&
          typeof row.status === 'string',
      )
      .map(normalizeRow);

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
        error: 'PUBLIC_REGISTRY_UNAVAILABLE',
        message: 'The public Registry service is temporarily unavailable.',
        detail: error instanceof Error ? error.message : 'Unknown Registry service error.',
        records: [],
        count: 0,
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
