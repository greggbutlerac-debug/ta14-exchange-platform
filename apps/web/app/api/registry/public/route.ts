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
  const supabasePublicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublicKey) return null;
  return { supabaseUrl, supabasePublicKey };
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

function unavailable(message: string, error: string, status = 503) {
  return NextResponse.json(
    {
      available: false,
      error,
      message,
      records: null,
      count: null,
      generatedAt: new Date().toISOString(),
    },
    { status, headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}

export async function GET() {
  const environment = requiredEnvironment();
  if (!environment) {
    return unavailable(
      'The public Registry is temporarily unavailable because its publication service is not configured.',
      'REGISTRY_CONFIGURATION_MISSING',
    );
  }

  try {
    const response = await fetch(
      `${environment.supabaseUrl}/rest/v1/rpc/ta14_registry_public_directory_v1`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          apikey: environment.supabasePublicKey,
          Authorization: `Bearer ${environment.supabasePublicKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    );

    const rawBody = await response.text();
    let payload: unknown = null;
    if (rawBody) {
      try { payload = JSON.parse(rawBody); } catch { payload = rawBody; }
    }

    if (!response.ok) {
      const missingFunction =
        response.status === 404 ||
        (typeof payload === 'object' && payload !== null && 'code' in payload && payload.code === 'PGRST202');
      return unavailable(
        missingFunction
          ? 'The public Registry publication function is temporarily unavailable.'
          : 'The public Registry directory could not be queried.',
        missingFunction ? 'PUBLIC_REGISTRY_FUNCTION_UNAVAILABLE' : 'PUBLIC_REGISTRY_QUERY_FAILED',
        missingFunction ? 503 : 502,
      );
    }

    if (!Array.isArray(payload)) {
      return unavailable(
        'The public Registry returned an invalid response. No zero-value metrics have been inferred.',
        'PUBLIC_REGISTRY_RESPONSE_INVALID',
        502,
      );
    }

    const records = (payload as PublicRegistryRow[])
      .filter((row) => row && typeof row.id === 'string' && typeof row.registry_identifier === 'string' && typeof row.governance_name === 'string' && typeof row.status === 'string')
      .map(normalizeRow);

    return NextResponse.json(
      {
        available: true,
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
  } catch {
    return unavailable(
      'The public Registry service is temporarily unavailable. No zero-value metrics have been inferred.',
      'PUBLIC_REGISTRY_UNAVAILABLE',
    );
  }
}
