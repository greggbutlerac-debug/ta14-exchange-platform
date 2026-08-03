import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
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

function isReviewDecision(value: unknown): value is ReviewDecision {
  return (
    value === 'return_for_correction' ||
    value === 'hold' ||
    value === 'escalate' ||
    value === 'accept_for_registration'
  );
}

function isSupabaseErrorPayload(value: unknown): value is SupabaseErrorPayload {
  return typeof value === 'object' && value !== null;
}

function supabaseCode(payload: unknown) {
  if (!isSupabaseErrorPayload(payload)) return null;
  return typeof payload.code === 'string' ? payload.code : null;
}

function errorStatusFromSupabase(status: number, payload: unknown) {
  const code = supabaseCode(payload);

  if (code === '42501') return 403;
  if (code === 'P0002') return 404;
  if (code === '23514') return 409;
  if (code === '22023') return 400;
  if (code === 'PGRST202') return 503;

  if (status === 400) return 400;
  if (status === 401) return 401;
  if (status === 403) return 403;
  if (status === 404) return 404;

  return 500;
}

function publicError(status: number) {
  if (status === 400) {
    return {
      error: 'INVALID_REVIEW_DECISION',
      message: 'The requested Registry review decision is invalid.',
    };
  }

  if (status === 401) {
    return {
      error: 'AUTHENTICATION_REQUIRED',
      message: 'The reviewer session is missing or expired.',
    };
  }

  if (status === 403) {
    return {
      error: 'REVIEWER_AUTHORITY_REQUIRED',
      message: 'Only an authorized TA-14 Registry reviewer may issue this decision.',
    };
  }

  if (status === 404) {
    return {
      error: 'REGISTRY_SUBMISSION_NOT_FOUND',
      message: 'The requested Registry submission was not found.',
    };
  }

  if (status === 409) {
    return {
      error: 'REGISTRY_REVIEW_DECISION_BLOCKED',
      message: 'The Registry submission is not eligible for this review decision.',
    };
  }

  if (status === 503) {
    return {
      error: 'REGISTRY_REVIEW_FUNCTION_NOT_INSTALLED',
      message: 'The controlled Registry review decision function is unavailable.',
    };
  }

  return {
    error: 'REGISTRY_REVIEW_DECISION_FAILED',
    message: 'The Registry review decision could not be recorded.',
  };
}

function isReviewDecisionResult(value: unknown): value is ReviewDecisionResult {
  if (typeof value !== 'object' || value === null) return false;

  const row = value as Partial<ReviewDecisionResult>;

  return (
    typeof row.submission_id === 'string' &&
    typeof row.status === 'string' &&
    typeof row.review_decision === 'string' &&
    typeof row.reviewed_at === 'string' &&
    (row.accepted_at === null || typeof row.accepted_at === 'string')
  );
}

export async function POST(request: NextRequest) {
  const environment = requiredEnvironment();

  if (!environment) {
    return NextResponse.json(
      {
        error: 'REGISTRY_CONFIGURATION_MISSING',
        message:
          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for Registry review decisions.',
      },
      {
        status: 503,
        headers: NO_STORE_HEADERS,
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
        headers: NO_STORE_HEADERS,
      },
    );
  }

  let body: ReviewDecisionRequestBody;

  try {
    body = (await request.json()) as ReviewDecisionRequestBody;
  } catch {
    return NextResponse.json(
      {
        error: 'INVALID_REQUEST_BODY',
        message: 'The request body must be valid JSON.',
      },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  const submissionId = body.submissionId?.trim() ?? '';
  const rationale = body.rationale?.trim() ?? '';
  const notes = body.notes?.trim() ?? '';

  if (!isUuid(submissionId)) {
    return NextResponse.json(
      {
        error: 'INVALID_SUBMISSION_ID',
        message: 'A valid Registry submission UUID is required.',
      },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  if (!isReviewDecision(body.decision)) {
    return NextResponse.json(
      {
        error: 'INVALID_REVIEW_DECISION',
        message: 'Select a supported Registry review decision.',
      },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  if (rationale.length < 20) {
    return NextResponse.json(
      {
        error: 'RATIONALE_REQUIRED',
        message: 'Reviewer rationale must contain at least 20 characters.',
      },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  try {
    const response = await fetch(
      `${environment.supabaseUrl}/rest/v1/rpc/ta14_registry_record_review_decision_v2`,
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
          request: {
            submission_id: submissionId,
            decision: body.decision,
            rationale,
            notes: notes || null,
          },
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
      const mapped = publicError(status);

      console.error('TA14_REGISTRY_REVIEW_RPC_ERROR', {
        upstreamStatus: response.status,
        mappedStatus: status,
        rpc: 'ta14_registry_record_review_decision_v2',
        submissionId,
        decision: body.decision,
        payload,
      });

      return NextResponse.json(
        {
          ...mapped,
          detail: payload,
          diagnostic: {
            upstreamStatus: response.status,
            mappedStatus: status,
            rpc: 'ta14_registry_record_review_decision_v2',
          },
        },
        {
          status,
          headers: NO_STORE_HEADERS,
        },
      );
    }

    if (!isReviewDecisionResult(payload)) {
      console.error('TA14_REGISTRY_REVIEW_RPC_INVALID_RESPONSE', {
        rpc: 'ta14_registry_record_review_decision_v2',
        submissionId,
        decision: body.decision,
        payload,
      });

      return NextResponse.json(
        {
          error: 'REGISTRY_REVIEW_RESPONSE_INVALID',
          message: 'The Registry review function returned an invalid response.',
          detail: payload,
        },
        {
          status: 500,
          headers: NO_STORE_HEADERS,
        },
      );
    }

    return NextResponse.json(
      {
        submissionId: payload.submission_id,
        status: payload.status,
        decision: payload.review_decision,
        reviewedAt: payload.reviewed_at,
        acceptedAt: payload.accepted_at,
        message:
          payload.review_decision === 'accept_for_registration'
            ? 'The submission has been accepted for Registry finalization.'
            : 'The bounded Registry review decision has been preserved.',
        boundary: 'Review is not certification.',
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      },
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
            message: 'Unknown Registry review service error.',
          };

    console.error('TA14_REGISTRY_REVIEW_ROUTE_EXCEPTION', {
      rpc: 'ta14_registry_record_review_decision_v2',
      submissionId,
      decision: body.decision,
      detail,
    });

    return NextResponse.json(
      {
        error: 'REGISTRY_REVIEW_DECISION_UNAVAILABLE',
        message: 'The Registry review decision service is temporarily unavailable.',
        detail,
      },
      {
        status: 503,
        headers: NO_STORE_HEADERS,
      },
    );
  }
}
