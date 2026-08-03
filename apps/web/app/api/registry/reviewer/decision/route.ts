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

type ReviewDecisionRow = {
  submission_id: string;
  status: string;
  review_decision: string;
  reviewed_at: string;
  accepted_at: string | null;
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
    if (payload.code === '22023') return 400;
    if (payload.code === 'PGRST202') return 503;
  }

  if (status === 400) return 400;
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
          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for Registry review decisions.',
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
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
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
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
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
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
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
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  try {
    const response = await fetch(
      `${environment.supabaseUrl}/rest/v1/rpc/ta14_registry_record_review_decision_v1`,
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
          requested_decision: body.decision,
          requested_rationale: rationale,
          requested_notes: notes || null,
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
            status === 400
              ? 'INVALID_REVIEW_DECISION'
              : status === 401
                ? 'AUTHENTICATION_REQUIRED'
                : status === 403
                  ? 'REVIEWER_AUTHORITY_REQUIRED'
                  : status === 404
                    ? 'REGISTRY_SUBMISSION_NOT_FOUND'
                    : status === 409
                      ? 'REGISTRY_REVIEW_DECISION_BLOCKED'
                      : status === 503
                        ? 'REGISTRY_REVIEW_FUNCTION_NOT_INSTALLED'
                        : 'REGISTRY_REVIEW_DECISION_FAILED',
          message:
            status === 400
              ? 'The requested Registry review decision is invalid.'
              : status === 401
                ? 'The reviewer session is missing or expired.'
                : status === 403
                  ? 'Only an authorized TA-14 Registry reviewer may issue this decision.'
                  : status === 404
                    ? 'The requested Registry submission was not found.'
                    : status === 409
                      ? 'The Registry submission is not eligible for this review decision.'
                      : status === 503
                        ? 'The controlled Registry review decision function has not been installed.'
                        : 'The Registry review decision could not be recorded.',
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
          error: 'REGISTRY_REVIEW_RESPONSE_INVALID',
          message: 'The Registry review function returned an invalid response.',
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

    const row = payload[0] as Partial<ReviewDecisionRow>;

    if (
      typeof row.submission_id !== 'string' ||
      typeof row.status !== 'string' ||
      typeof row.review_decision !== 'string' ||
      typeof row.reviewed_at !== 'string' ||
      !(
        row.accepted_at === null ||
        typeof row.accepted_at === 'string'
      )
    ) {
      return NextResponse.json(
        {
          error: 'REGISTRY_REVIEW_RESPONSE_INVALID',
          message: 'The Registry review response is missing required fields.',
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
        status: row.status,
        decision: row.review_decision,
        reviewedAt: row.reviewed_at,
        acceptedAt: row.accepted_at,
        message:
          body.decision === 'accept_for_registration'
            ? 'The submission has been accepted for Registry finalization.'
            : 'The bounded Registry review decision has been preserved.',
        boundary: 'Review is not certification.',
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
        error: 'REGISTRY_REVIEW_DECISION_UNAVAILABLE',
        message: 'The Registry review decision service is temporarily unavailable.',
        detail:
          error instanceof Error
            ? error.message
            : 'Unknown Registry review service error.',
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
