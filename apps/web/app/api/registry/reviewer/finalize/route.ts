import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FINALIZATION_RPC = 'ta14_registry_finalize_submission_v1';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
};

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

type SupabaseErrorPayload = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

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

function isSupabaseErrorPayload(
  value: unknown,
): value is SupabaseErrorPayload {
  return typeof value === 'object' && value !== null;
}

function mapSupabaseStatus(
  upstreamStatus: number,
  payload: unknown,
) {
  const code = isSupabaseErrorPayload(payload)
    ? payload.code
    : undefined;

  if (code === '42501') return 403;
  if (code === 'P0002') return 404;
  if (code === '23514') return 409;
  if (code === '22023') return 400;
  if (code === 'PGRST202') return 503;
  if (code === '42883') return 500;

  if (upstreamStatus === 400) return 400;
  if (upstreamStatus === 401) return 401;
  if (upstreamStatus === 403) return 403;
  if (upstreamStatus === 404) return 503;

  return 500;
}

function mappedError(status: number) {
  switch (status) {
    case 400:
      return {
        error: 'REGISTRY_FINALIZATION_REQUEST_INVALID',
        message:
          'The Registry finalization request was rejected by the database.',
      };

    case 401:
      return {
        error: 'AUTHENTICATION_REQUIRED',
        message:
          'The reviewer session is missing or expired.',
      };

    case 403:
      return {
        error: 'REVIEWER_AUTHORITY_REQUIRED',
        message:
          'Only an authorized TA-14 Registry reviewer may finalize this submission.',
      };

    case 404:
      return {
        error: 'REGISTRY_SUBMISSION_NOT_FOUND',
        message:
          'The requested Registry submission was not found.',
      };

    case 409:
      return {
        error: 'REGISTRY_FINALIZATION_BLOCKED',
        message:
          'The Registry submission has not satisfied every finalization condition.',
      };

    case 503:
      return {
        error: 'REGISTRY_FINALIZATION_FUNCTION_NOT_INSTALLED',
        message:
          'The controlled Registry finalization function is unavailable.',
      };

    default:
      return {
        error: 'REGISTRY_FINALIZATION_FAILED',
        message:
          'The Registry submission could not be finalized.',
      };
  }
}

async function parseResponseBody(response: Response) {
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    return rawBody;
  }
}

function isFinalizationRow(
  value: unknown,
): value is FinalizationRow {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const row = value as Partial<FinalizationRow>;

  return (
    typeof row.submission_id === 'string' &&
    typeof row.registry_identifier === 'string' &&
    typeof row.registered_at === 'string' &&
    typeof row.public_record_id === 'string' &&
    typeof row.is_publicly_published === 'boolean'
  );
}

export async function POST(request: NextRequest) {
  const environment = requiredEnvironment();

  if (!environment) {
    return jsonResponse(
      {
        error: 'REGISTRY_CONFIGURATION_MISSING',
        message:
          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for Registry finalization.',
      },
      503,
    );
  }

  const accessToken = bearerToken(request);

  if (!accessToken) {
    return jsonResponse(
      {
        error: 'AUTHENTICATION_REQUIRED',
        message:
          'A signed-in Registry reviewer session is required.',
      },
      401,
    );
  }

  let body: FinalizeRequestBody;

  try {
    body = (await request.json()) as FinalizeRequestBody;
  } catch {
    return jsonResponse(
      {
        error: 'INVALID_REQUEST_BODY',
        message:
          'The request body must be valid JSON.',
      },
      400,
    );
  }

  const submissionId =
    body.submissionId?.trim() ?? '';

  if (!isUuid(submissionId)) {
    return jsonResponse(
      {
        error: 'INVALID_SUBMISSION_ID',
        message:
          'A valid Registry submission UUID is required.',
      },
      400,
    );
  }

  const rpcUrl =
    `${environment.supabaseUrl}/rest/v1/rpc/${FINALIZATION_RPC}`;

  try {
    const response = await fetch(rpcUrl, {
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
    });

    const payload =
      await parseResponseBody(response);

    if (!response.ok) {
      const status = mapSupabaseStatus(
        response.status,
        payload,
      );

      const publicError = mappedError(status);

      console.error(
        'TA14_REGISTRY_FINALIZATION_RPC_ERROR',
        {
          rpc: FINALIZATION_RPC,
          rpcUrl,
          submissionId,
          upstreamStatus: response.status,
          mappedStatus: status,
          payload,
        },
      );

      return jsonResponse(
        {
          ...publicError,
          detail: payload,
          diagnostic: {
            rpc: FINALIZATION_RPC,
            upstreamStatus: response.status,
            mappedStatus: status,
          },
        },
        status,
      );
    }

    if (
      !Array.isArray(payload) ||
      payload.length !== 1 ||
      !isFinalizationRow(payload[0])
    ) {
      console.error(
        'TA14_REGISTRY_FINALIZATION_INVALID_RESPONSE',
        {
          rpc: FINALIZATION_RPC,
          submissionId,
          payload,
        },
      );

      return jsonResponse(
        {
          error: 'REGISTRY_FINALIZATION_RESPONSE_INVALID',
          message:
            'The Registry finalization function returned an invalid response.',
          detail: payload,
        },
        500,
      );
    }

    const row = payload[0];

    return jsonResponse(
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
      200,
    );
  } catch (error) {
    const detail =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack ?? null,
          }
        : {
            message:
              'Unknown Registry finalization service error.',
          };

    console.error(
      'TA14_REGISTRY_FINALIZATION_ROUTE_EXCEPTION',
      {
        rpc: FINALIZATION_RPC,
        rpcUrl,
        submissionId,
        detail,
      },
    );

    return jsonResponse(
      {
        error: 'REGISTRY_FINALIZATION_UNAVAILABLE',
        message:
          'The Registry finalization service is temporarily unavailable.',
        detail,
      },
      503,
    );
  }
}
