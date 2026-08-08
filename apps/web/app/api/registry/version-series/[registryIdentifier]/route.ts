import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type RouteContext = {
  params: Promise<{
    registryIdentifier: string;
  }>;
};

type VersionSeriesRow = {
  series_identifier: string;
  governance_name: string;
  short_name?: string | null;
  category?: string | null;
  steward?: string | null;
  status: string;
  series_summary?: string | null;
  boundary_statement?: string | null;
  member_count?: number | string | null;
  current_member_ordinal?: number | string | null;
};

type VersionSeriesMemberRow = {
  series_identifier: string;
  registry_identifier: string;
  governance_name: string;
  version?: string | null;
  registry_status: string;
  registered_at?: string | null;
  ordinal: number | string;
  relationship_type: string;
  previous_registry_identifier?: string | null;
  lineage_note?: string | null;
  findings_inherited?: boolean | null;
  evidence_inherited?: boolean | null;
};

function requiredEnvironment() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

function normalizeIdentifier(value: string) {
  return decodeURIComponent(value)
    .trim()
    .toUpperCase();
}

function isValidRegistryIdentifier(value: string) {
  return /^TA-14-AIGR-[0-9]{4,}$/.test(value);
}

function numericValue(
  value: number | string | null | undefined,
) {
  if (
    typeof value === 'number' &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed =
      Number.parseInt(value, 10);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

async function parseResponse(
  response: Response,
): Promise<unknown> {
  const rawBody =
    await response.text();

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

function rpcHeaders(anonKey: string) {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

function noStoreHeaders() {
  return {
    'Cache-Control':
      'no-store, max-age=0',
    'X-Content-Type-Options':
      'nosniff',
  };
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  const {
    registryIdentifier: routeValue,
  } = await context.params;

  const registryIdentifier =
    normalizeIdentifier(routeValue);

  if (
    !isValidRegistryIdentifier(
      registryIdentifier,
    )
  ) {
    return NextResponse.json(
      {
        error:
          'INVALID_REGISTRY_IDENTIFIER',
        message:
          'A valid permanent TA-14 AI Governance Registry identifier is required.',
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  const environment =
    requiredEnvironment();

  if (!environment) {
    return NextResponse.json(
      {
        error:
          'REGISTRY_CONFIGURATION_MISSING',
        message:
          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required to load Registry version lineage.',
      },
      {
        status: 503,
        headers: noStoreHeaders(),
      },
    );
  }

  try {
    const seriesResponse =
      await fetch(
        `${environment.supabaseUrl}/rest/v1/rpc/ta14_registry_public_version_series_for_record_v1`,
        {
          method: 'POST',
          cache: 'no-store',
          headers: rpcHeaders(
            environment.supabaseAnonKey,
          ),
          body: JSON.stringify({
            requested_registry_identifier:
              registryIdentifier,
          }),
        },
      );

    const seriesPayload =
      await parseResponse(
        seriesResponse,
      );

    if (!seriesResponse.ok) {
      const functionUnavailable =
        seriesResponse.status === 404 ||
        (
          typeof seriesPayload ===
            'object' &&
          seriesPayload !== null &&
          'code' in seriesPayload &&
          seriesPayload.code ===
            'PGRST202'
        );

      return NextResponse.json(
        {
          error:
            functionUnavailable
              ? 'VERSION_SERIES_FUNCTION_NOT_INSTALLED'
              : 'VERSION_SERIES_QUERY_FAILED',
          message:
            functionUnavailable
              ? 'The public Registry version-series function has not been installed yet.'
              : 'The Registry version series could not be queried.',
          detail: seriesPayload,
        },
        {
          status:
            functionUnavailable
              ? 503
              : 500,
          headers: noStoreHeaders(),
        },
      );
    }

    if (!Array.isArray(seriesPayload)) {
      return NextResponse.json(
        {
          error:
            'VERSION_SERIES_RESPONSE_INVALID',
          message:
            'The Registry version-series function returned an invalid response.',
          detail: seriesPayload,
        },
        {
          status: 500,
          headers: noStoreHeaders(),
        },
      );
    }

    /*
     * A Registry record does not have to belong to a
     * version series. That is a valid public state.
     */
    if (seriesPayload.length === 0) {
      return NextResponse.json(
        {
          registryIdentifier,
          versionSeries: null,
          members: [],
          memberCount: 0,
          generatedAt:
            new Date().toISOString(),

          boundary:
            'No public version-series relationship is recorded for this Registry record.',
        },
        {
          status: 200,
          headers: noStoreHeaders(),
        },
      );
    }

    const series =
      seriesPayload[0] as VersionSeriesRow;

    const seriesIdentifier =
      series.series_identifier;

    const membersResponse =
      await fetch(
        `${environment.supabaseUrl}/rest/v1/rpc/ta14_registry_public_version_series_members_v1`,
        {
          method: 'POST',
          cache: 'no-store',
          headers: rpcHeaders(
            environment.supabaseAnonKey,
          ),
          body: JSON.stringify({
            requested_series_identifier:
              seriesIdentifier,
          }),
        },
      );

    const membersPayload =
      await parseResponse(
        membersResponse,
      );

    if (!membersResponse.ok) {
      const functionUnavailable =
        membersResponse.status === 404 ||
        (
          typeof membersPayload ===
            'object' &&
          membersPayload !== null &&
          'code' in membersPayload &&
          membersPayload.code ===
            'PGRST202'
        );

      return NextResponse.json(
        {
          error:
            functionUnavailable
              ? 'VERSION_SERIES_MEMBERS_FUNCTION_NOT_INSTALLED'
              : 'VERSION_SERIES_MEMBERS_QUERY_FAILED',
          message:
            functionUnavailable
              ? 'The public Registry version-series membership function has not been installed yet.'
              : 'The Registry version-series members could not be queried.',
          detail: membersPayload,
        },
        {
          status:
            functionUnavailable
              ? 503
              : 500,
          headers: noStoreHeaders(),
        },
      );
    }

    if (!Array.isArray(membersPayload)) {
      return NextResponse.json(
        {
          error:
            'VERSION_SERIES_MEMBERS_RESPONSE_INVALID',
          message:
            'The Registry version-series membership function returned an invalid response.',
          detail: membersPayload,
        },
        {
          status: 500,
          headers: noStoreHeaders(),
        },
      );
    }

    const members =
      (
        membersPayload as VersionSeriesMemberRow[]
      )
        .map((member) => ({
          seriesIdentifier:
            member.series_identifier,

          registryIdentifier:
            member.registry_identifier,

          governanceName:
            member.governance_name,

          version:
            member.version ?? null,

          registryStatus:
            member.registry_status,

          registeredAt:
            member.registered_at ?? null,

          ordinal:
            numericValue(
              member.ordinal,
            ),

          relationshipType:
            member.relationship_type,

          previousRegistryIdentifier:
            member.previous_registry_identifier ??
            null,

          lineageNote:
            member.lineage_note ?? null,

          findingsInherited:
            member.findings_inherited ===
            true,

          evidenceInherited:
            member.evidence_inherited ===
            true,

          isCurrentRecord:
            member.registry_identifier ===
            registryIdentifier,
        }))
        .sort(
          (a, b) =>
            a.ordinal - b.ordinal,
        );

    return NextResponse.json(
      {
        registryIdentifier,

        versionSeries: {
          seriesIdentifier,

          governanceName:
            series.governance_name,

          shortName:
            series.short_name ?? null,

          category:
            series.category ?? null,

          steward:
            series.steward ?? null,

          status:
            series.status,

          summary:
            series.series_summary ??
            null,

          boundaryStatement:
            series.boundary_statement ??
            null,

          memberCount:
            numericValue(
              series.member_count,
            ),

          currentMemberOrdinal:
            numericValue(
              series.current_member_ordinal,
            ),
        },

        members,

        memberCount:
          members.length,

        generatedAt:
          new Date().toISOString(),

        boundary:
          'Version-series membership preserves lineage only. Each Registry version remains independently attributable. Findings, evidence, certification states, and review conclusions do not carry from one version to another unless separately and explicitly governed.',
      },
      {
        status: 200,
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'VERSION_SERIES_UNAVAILABLE',
        message:
          'The Registry version-series service is temporarily unavailable.',
        detail:
          error instanceof Error
            ? error.message
            : 'Unknown Registry version-series service error.',
      },
      {
        status: 503,
        headers: noStoreHeaders(),
      },
    );
  }
}
