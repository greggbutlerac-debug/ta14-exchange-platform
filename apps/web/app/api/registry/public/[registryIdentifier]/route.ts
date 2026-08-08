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
  formal_claims?: string | null;
  explicit_non_claims?: string | null;
  known_limitations?: string | null;
  domains?: string[] | null;
  regulatory_scope?: string | null;
  evidence_count?: number | string | null;
  dispute_count?: number | string | null;
  supersedes_registry_identifier?: string | null;
  record_digest_sha256?: string | null;
  public_projection_digest_sha256?: string | null;
  public_projection_digest_version?: string | null;
  published_at?: string | null;
};

type PublicVersionSeriesRow = {
  series_identifier: string;
  governance_name: string;
  short_name?: string | null;
  category?: string | null;
  steward?: string | null;
  status: string;
  series_summary?: string | null;
  boundary_statement: string;
  member_count?: number | string | null;
  current_member_ordinal?: number | string | null;
};

type PublicVersionSeriesMemberRow = {
  series_identifier: string;
  registry_identifier: string;
  governance_name: string;
  version?: string | null;
  registry_status: string;
  registered_at: string;
  ordinal: number;
  relationship_type: string;
  previous_registry_identifier?: string | null;
  lineage_note?: string | null;
  findings_inherited: boolean;
  evidence_inherited: boolean;
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
    formalClaims: row.formal_claims ?? null,
    explicitNonClaims: row.explicit_non_claims ?? null,
    knownLimitations: row.known_limitations ?? null,
    domains: Array.isArray(row.domains) ? row.domains : [],
    regulatoryScope: row.regulatory_scope ?? null,
    evidenceCount: numericCount(row.evidence_count),
    disputeCount: numericCount(row.dispute_count),
    supersedesRegistryIdentifier:
      row.supersedes_registry_identifier ?? null,
    recordDigestSha256: row.record_digest_sha256 ?? null,
    publicProjectionDigestSha256:
      row.public_projection_digest_sha256 ?? null,
    publicProjectionDigestVersion:
      row.public_projection_digest_version ?? null,
    publishedAt: row.published_at ?? null,
    boundary: 'Registration is not certification.',
  };
}

function normalizeVersionSeries(row: PublicVersionSeriesRow) {
  return {
    seriesIdentifier: row.series_identifier,
    governanceName: row.governance_name,
    shortName: row.short_name ?? null,
    category: row.category ?? null,
    steward: row.steward ?? null,
    status: row.status,
    seriesSummary: row.series_summary ?? null,
    boundaryStatement: row.boundary_statement,
    memberCount: numericCount(row.member_count),
    currentMemberOrdinal: numericCount(row.current_member_ordinal),
  };
}

function normalizeVersionSeriesMember(row: PublicVersionSeriesMemberRow) {
  return {
    seriesIdentifier: row.series_identifier,
    registryIdentifier: row.registry_identifier,
    governanceName: row.governance_name,
    version: row.version ?? null,
    registryStatus: row.registry_status,
    registeredAt: row.registered_at,
    ordinal: row.ordinal,
    relationshipType: row.relationship_type,
    previousRegistryIdentifier: row.previous_registry_identifier ?? null,
    lineageNote: row.lineage_note ?? null,
    findingsInherited: row.findings_inherited,
    evidenceInherited: row.evidence_inherited,
  };
}

async function callRpc(
  supabaseUrl: string,
  supabaseAnonKey: string,
  functionName: string,
  body: Record<string, string>,
) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const rawBody = await response.text();
  let payload: unknown = null;

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = rawBody;
    }
  }

  return { response, payload };
}

function functionUnavailable(status: number, payload: unknown) {
  return (
    status === 404 ||
    (typeof payload === 'object' &&
      payload !== null &&
      'code' in payload &&
      payload.code === 'PGRST202')
  );
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
    const recordResult = await callRpc(
      environment.supabaseUrl,
      environment.supabaseAnonKey,
      'ta14_registry_public_record_v1',
      { requested_registry_identifier: registryIdentifier },
    );

    if (!recordResult.response.ok) {
      const unavailable = functionUnavailable(
        recordResult.response.status,
        recordResult.payload,
      );

      return NextResponse.json(
        {
          error: unavailable
            ? 'PUBLIC_REGISTRY_FUNCTION_NOT_INSTALLED'
            : 'PUBLIC_REGISTRY_RECORD_QUERY_FAILED',
          message: unavailable
            ? 'The permanent public Registry record function has not been installed yet.'
            : 'The permanent public Registry record could not be queried.',
          detail: recordResult.payload,
        },
        {
          status: unavailable ? 503 : 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'X-Content-Type-Options': 'nosniff',
          },
        },
      );
    }

    if (!Array.isArray(recordResult.payload)) {
      return NextResponse.json(
        {
          error: 'PUBLIC_REGISTRY_RECORD_RESPONSE_INVALID',
          message:
            'The permanent public Registry record function returned an invalid response.',
          detail: recordResult.payload,
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

    if (recordResult.payload.length === 0) {
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

    const row = recordResult.payload[0] as Partial<PublicRegistryRecordRow>;

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
          detail: recordResult.payload,
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

    let versionSeries = null;
    let versionSeriesMembers: ReturnType<typeof normalizeVersionSeriesMember>[] = [];

    const seriesResult = await callRpc(
      environment.supabaseUrl,
      environment.supabaseAnonKey,
      'ta14_registry_public_version_series_for_record_v1',
      { requested_registry_identifier: registryIdentifier },
    );

    if (seriesResult.response.ok && Array.isArray(seriesResult.payload)) {
      const seriesRow = seriesResult.payload[0] as PublicVersionSeriesRow | undefined;

      if (seriesRow?.series_identifier) {
        versionSeries = normalizeVersionSeries(seriesRow);

        const membersResult = await callRpc(
          environment.supabaseUrl,
          environment.supabaseAnonKey,
          'ta14_registry_public_version_series_members_v1',
          { requested_series_identifier: seriesRow.series_identifier },
        );

        if (membersResult.response.ok && Array.isArray(membersResult.payload)) {
          versionSeriesMembers = (
            membersResult.payload as PublicVersionSeriesMemberRow[]
          )
            .filter(
              (member) =>
                typeof member.registry_identifier === 'string' &&
                typeof member.ordinal === 'number',
            )
            .map(normalizeVersionSeriesMember);
        }
      }
    }

    return NextResponse.json(
      {
        record: normalizeRow(row as PublicRegistryRecordRow),
        versionSeries,
        versionSeriesMembers,
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
