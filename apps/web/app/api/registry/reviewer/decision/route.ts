import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const REVIEW_RPC = 'ta14_registry_record_review_decision_v3';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
};

type ReviewDecision =
  | 'return_for_correction'
  | 'hold'
  | 'escalate'
  | 'accept_for_registration';

type ReviewDecisionRequestBody = {
  submissionId?: string;
  decision?: ReviewDecision;
  rationale?: string;
  notes?: string;
};

type ReviewDecisionResult = {
  submission_id: string;
  status: string;
  review_decision: string;
  reviewed_at: string;
  accepted_at: string | null;
};

type SupabaseErrorPayload = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
};

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
) {
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

function isReviewDecision(
  value: unknown,
): value is ReviewDecision {
  return (
    value === 'return_for_correction' ||
    value === 'hold' ||
    value === 'escalate' ||
    value === 'accept_for_registration'
  );
}

function isSupabaseErrorPayload(
  value: unknown,
): value is SupabaseErrorPayload {
  return typeof value === 'object' && value !== null;
}

function isReviewDecisionResult(
  value: unknown,
): value is ReviewDecisionResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const row = value as Partial<ReviewDecisionResult>;

  return (
    typeof row.submission_id === 'string' &&
    typeof row.status === 'string' &&
    typeof row.review_decision === 'string' &&
    typeof row.reviewed_at === 'string' &&
    (row.accepted_at === null ||
      typeof row.accepted_at === 'string')
  );
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
        error: 'INVALID_REVIEW_DECISION',
        message:
          'The requested Registry review decision is invalid.',
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
          'Only an authorized TA-14 Registry reviewer may issue this decision.',
      };

    case 404:
      return {
        error: 'REGISTRY_SUBMISSION_NOT_FOUND',
        message:
          'The requested Registry submission was not found.',
      };

    case 409:
      return {
        error: 'REGISTRY_REVIEW_DECISION_BLOCKED',
        message:
          'The Registry submission is not eligible for this review decision.',
      };

    case 503:
      return {
        error: 'REGISTRY_REVIEW_FUNCTION_UNAVAILABLE',
        message:
          'The controlled Registry review decision function is unavailable.',
      };

    default:
      return {
        error: 'REGISTRY_REVIEW_DECISION_FAILED',
        message:
          'The Registry review decision could not be recorded.',
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

export async function POST(request: NextRequest) {
  const environment = requiredEnvironment();

  if (!environment) {
    return jsonResponse(
      {
        error: 'REGISTRY_CONFIGURATION_MISSING',
        message:
          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for Registry review decisions.',
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

  let body: ReviewDecisionRequestBody;

  try {
    body =
      (await request.json()) as ReviewDecisionRequestBody;
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

  const rationale =
    body.rationale?.trim() ?? '';

  const notes =
    body.notes?.trim() ?? '';

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

  if (!isReviewDecision(body.decision)) {
    return jsonResponse(
      {
        error: 'INVALID_REVIEW_DECISION',
        message:
          'Select a supported Registry review decision.',
      },
      400,
    );
  }

  if (rationale.length < 20) {
    return jsonResponse(
      {
        error: 'RATIONALE_REQUIRED',
        message:
          'Reviewer rationale must contain at least 20 characters.',
      },
      400,
    );
  }

  try {
    const rpcUrl =
      `${environment.supabaseUrl}/rest/v1/rpc/${REVIEW_RPC}`;

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
        request: {
          submission_id: submissionId,
          decision: body.decision,
          rationale,
          notes: notes || null,
        },
      }),
    });

    const payload =
      await parseResponseBody(response);

    if (!response.ok) {
      const status = mapSupabaseStatus(
        response.status,
        payload,
      );

      const publicError =
        mappedError(status);

      console.error(
        'TA14_REGISTRY_REVIEW_RPC_ERROR',
        {
          rpc: REVIEW_RPC,
          rpcUrl,
          submissionId,
          decision: body.decision,
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
            rpc: REVIEW_RPC,
            upstreamStatus: response.status,
            mappedStatus: status,
          },
        },
        status,
      );
    }

    if (!isReviewDecisionResult(payload)) {
      console.error(
        'TA14_REGISTRY_REVIEW_RPC_INVALID_RESPONSE',
        {
          rpc: REVIEW_RPC,
          submissionId,
          decision: body.decision,
          payload,
        },
      );

      return jsonResponse(
        {
          error:
            'REGISTRY_REVIEW_RESPONSE_INVALID',
          message:
            'The Registry review function returned an invalid response.',
          detail: payload,
        },
        500,
      );
    }

    return jsonResponse(
      {
        submissionId:
          payload.submission_id,
        status:
          payload.status,
        decision:
          payload.review_decision,
        reviewedAt:
          payload.reviewed_at,
        acceptedAt:
          payload.accepted_at,
        message:
          payload.review_decision ===
          'accept_for_registration'
            ? 'The submission has been accepted for Registry finalization.'
            : 'The bounded Registry review decision has been preserved.',
        boundary:
          'Review is not certification.',
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
              'Unknown Registry review service error.',
          };

    console.error(
      'TA14_REGISTRY_REVIEW_ROUTE_EXCEPTION',
      {
        rpc: REVIEW_RPC,
        submissionId,
        decision: body.decision,
        detail,
      },
    );

    return jsonResponse(
      {
        error:
          'REGISTRY_REVIEW_DECISION_UNAVAILABLE',
        message:
          'The Registry review decision service is temporarily unavailable.',
        detail,
      },
      503,
    );
  }
}
