import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type FinalizeRequestBody = {
  submissionId?: string;
};

type FinalizationRow = {
  submission_id: string;
  registry_identifier: string;
  registered_at: string;
  public_record_id: string;
  is_publicly_published: boolean;
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

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function errorStatusFromSupabase(status: number, payload: unknown) {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'code' in payload &&
    typeof payload.code === 'string'
  ) {
    if (payload.code === '42501') return 403;
    if (payload.code === 'P0002') return 404;
    if (payload.code === '23514') return 409;
    if (payload.code === 'PGRST202') return 503;
  }

  if (status === 401) return 401;
  if (status === 403) return 403;
  if (status === 404) return 503;

  return 500;
}

export async function POST(request: NextRequest) {
  const environment = requiredEnvironment();

  if (!environment) {
    return NextResponse.json(
      {
        error: 'REGISTRY_CONFIGURATION_MISSING',
        message:
          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for Registry finalization.',
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
        message: 'A signed-in Registry reviewer session is required.',
      },
      {
        status: 401,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  let body: FinalizeRequestBody;

  try {
    body = (await request.json()) as FinalizeRequestBody;
  } catch {
    return NextResponse.json(
      {
        error: 'INVALID_REQUEST_BODY',
        message: 'The request body must be valid JSON.',
      },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  const submissionId = body.submissionId?.trim();

  if (!submissionId || !isUuid(submissionId)) {
    return NextResponse.json(
      {
        error: 'INVALID_SUBMISSION_ID',
        message: 'A valid Registry submission UUID is required.',
      },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  try {
    const response = await fetch(
      `${environment.supabaseUrl}/rest/v1/rpc/ta14_registry_finalize_submission_v1`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          apikey: environment.supabaseAnonKey,
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requested_submission_id: submissionId,
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
      const status = errorStatusFromSupabase(response.status, payload);

      return NextResponse.json(
        {
          error:
            status === 401
              ? 'AUTHENTICATION_REQUIRED'
              : status === 403
                ? 'REVIEWER_AUTHORITY_REQUIRED'
                : status === 404
                  ? 'REGISTRY_SUBMISSION_NOT_FOUND'
                  : status === 409
                    ? 'REGISTRY_FINALIZATION_BLOCKED'
                    : status === 503
                      ? 'REGISTRY_FINALIZATION_FUNCTION_NOT_INSTALLED'
                      : 'REGISTRY_FINALIZATION_FAILED',
          message:
            status === 401
              ? 'The reviewer session is missing or expired.'
              : status === 403
                ? 'Only an authorized TA-14 Registry reviewer may finalize this submission.'
                : status === 404
                  ? 'The requested Registry submission was not found.'
                  : status === 409
                    ? 'The Registry submission has not satisfied every finalization condition.'
                    : status === 503
                      ? 'The controlled Registry finalization function has not been installed.'
                      : 'The Registry submission could not be finalized.',
          detail: payload,
        },
        {
          status,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        },
      );
    }

    if (!Array.isArray(payload) || payload.length !== 1) {
      return NextResponse.json(
        {
          error: 'REGISTRY_FINALIZATION_RESPONSE_INVALID',
          message: 'The Registry finalization function returned an invalid response.',
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

    const row = payload[0] as Partial<FinalizationRow>;

    if (
      typeof row.submission_id !== 'string' ||
      typeof row.registry_identifier !== 'string' ||
      typeof row.registered_at !== 'string' ||
      typeof row.public_record_id !== 'string' ||
      typeof row.is_publicly_published !== 'boolean'
    ) {
      return NextResponse.json(
        {
          error: 'REGISTRY_FINALIZATION_RESPONSE_INVALID',
          message: 'The Registry finalization response is missing required fields.',
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

    return NextResponse.json(
      {
        submissionId: row.submission_id,
        registryIdentifier: row.registry_identifier,
        registeredAt: row.registered_at,
        publicRecordId: row.public_record_id,
        publiclyPublished: row.is_publicly_published,
        message: row.is_publicly_published
          ? 'The governance architecture has been registered and published in the public Registry directory.'
          : 'The governance architecture has been registered. Its visibility setting prevents public directory publication.',
        boundary: 'Registration is not certification.',
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
        error: 'REGISTRY_FINALIZATION_UNAVAILABLE',
        message: 'The Registry finalization service is temporarily unavailable.',
        detail: error instanceof Error ? error.message : 'Unknown Registry service error.',
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
