import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

type DecisionAction =
  | 'return_for_correction'
  | 'hold'
  | 'escalate'
  | 'accept_for_registration';

type DecisionRequest = {
  submissionId?: string;
  action?: DecisionAction;
  rationale?: string;
  reviewerNotes?: string;
};

type SubmissionRow = {
  id: string;
  owner_user_id: string;
  governance_name: string;
  status: string;
  registry_identifier: string | null;
  submitted_at: string | null;
  requested_review_pathway: string | null;
};

const ALLOWED_CURRENT_STATUSES = new Set([
  'submitted',
  'under_review',
  'hold',
  'escalated',
]);

function createSupabaseClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Existing authenticated cookies remain readable.
        }
      },
    },
  });
}

function parseReviewerEmails(): Set<string> {
  return new Set(
    (process.env.TA14_REGISTRY_REVIEWER_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function errorResponse(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    details === undefined ? { error: message } : { error: message, details },
    { status },
  );
}

function normalizeAction(value: unknown): DecisionAction | null {
  if (
    value === 'return_for_correction' ||
    value === 'hold' ||
    value === 'escalate' ||
    value === 'accept_for_registration'
  ) {
    return value;
  }

  return null;
}

function decisionConfiguration(action: DecisionAction) {
  switch (action) {
    case 'return_for_correction':
      return {
        toStatus: 'draft',
        eventType: 'returned_for_correction',
        summary:
          'Registry reviewer returned the intake to the registrant for correction.',
        notice:
          'The submission was returned for correction. The registrant may edit the intake and resubmit it.',
        unlock: true,
      };
    case 'hold':
      return {
        toStatus: 'hold',
        eventType: 'placed_on_hold',
        summary:
          'Registry reviewer placed the submission on hold pending resolution of a material issue.',
        notice:
          'The submission is on hold and remains locked pending further review.',
        unlock: false,
      };
    case 'escalate':
      return {
        toStatus: 'escalated',
        eventType: 'escalated_for_review',
        summary:
          'Registry reviewer escalated the submission for higher-level review.',
        notice:
          'The submission was escalated and remains locked pending higher-level review.',
        unlock: false,
      };
    case 'accept_for_registration':
      return {
        toStatus: 'accepted',
        eventType: 'accepted_for_registration',
        summary:
          'Registry reviewer accepted the submission for Registry identifier assignment and publication processing.',
        notice:
          'The submission was accepted for registration. Acceptance does not itself assign an identifier or publish the record.',
        unlock: false,
      };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DecisionRequest;
    const submissionId = body.submissionId?.trim();
    const action = normalizeAction(body.action);
    const rationale = body.rationale?.trim() ?? '';
    const reviewerNotes = body.reviewerNotes?.trim() || null;

    if (!submissionId) {
      return errorResponse('Submission ID is required.');
    }

    if (!action) {
      return errorResponse('A valid reviewer decision is required.');
    }

    if (rationale.length < 20) {
      return errorResponse(
        'A decision rationale of at least 20 characters is required.',
      );
    }

    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse('Authentication required.', 401);
    }

    const reviewerEmail = user.email?.toLowerCase() ?? '';
    const reviewerEmails = parseReviewerEmails();

    if (!reviewerEmails.has(reviewerEmail)) {
      return errorResponse(
        'This account is not authorized to issue Registry review decisions.',
        403,
      );
    }

    const { data: submissionData, error: submissionError } = await supabase
      .from('ai_governance_registry_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submissionData) {
      return errorResponse('Registry submission was not found.', 404);
    }

    const submission = submissionData as SubmissionRow;

    if (!ALLOWED_CURRENT_STATUSES.has(submission.status)) {
      return errorResponse(
        `A reviewer decision cannot be issued while the submission status is "${submission.status}".`,
        409,
      );
    }

    if (submission.registry_identifier) {
      return errorResponse(
        'This record already has a Registry identifier and must use the post-registration lifecycle process.',
        409,
      );
    }

    const configuration = decisionConfiguration(action);
    const decidedAt = new Date().toISOString();
    const previousStatus = submission.status;

    const updatePayload: Record<string, unknown> = {
      status: configuration.toStatus,
      reviewed_at: decidedAt,
      reviewed_by_user_id: user.id,
      review_decision: action,
      review_rationale: rationale,
      reviewer_notes: reviewerNotes,
      updated_at: decidedAt,
    };

    if (configuration.unlock) {
      updatePayload.intake_locked_at = null;
      updatePayload.submitted_at = null;
    } else {
      updatePayload.intake_locked_at =
        submission.submitted_at ?? decidedAt;
    }

    const { data: updatedData, error: updateError } = await supabase
      .from('ai_governance_registry_submissions')
      .update(updatePayload)
      .eq('id', submissionId)
      .eq('status', previousStatus)
      .is('registry_identifier', null)
      .select('*')
      .single();

    if (updateError || !updatedData) {
      return errorResponse(
        updateError?.message ||
          'The submission changed before the decision could be recorded. Reload and review the current state.',
        409,
      );
    }

    const { error: eventError } = await supabase
      .from('ai_governance_registry_events')
      .insert({
        submission_id: submissionId,
        actor_user_id: user.id,
        event_type: configuration.eventType,
        from_status: previousStatus,
        to_status: configuration.toStatus,
        event_summary: configuration.summary,
        event_payload: {
          decision: action,
          rationale,
          reviewer_notes: reviewerNotes,
          reviewer_email: reviewerEmail,
          reviewed_at: decidedAt,
          requested_review_pathway:
            submission.requested_review_pathway,
          intake_unlocked: configuration.unlock,
        },
      });

    if (eventError) {
      const rollbackPayload: Record<string, unknown> = {
        status: previousStatus,
        reviewed_at: null,
        reviewed_by_user_id: null,
        review_decision: null,
        review_rationale: null,
        reviewer_notes: null,
        updated_at: new Date().toISOString(),
      };

      if (configuration.unlock) {
        rollbackPayload.submitted_at = submission.submitted_at;
        rollbackPayload.intake_locked_at = submission.submitted_at;
      }

      await supabase
        .from('ai_governance_registry_submissions')
        .update(rollbackPayload)
        .eq('id', submissionId)
        .eq('status', configuration.toStatus)
        .is('registry_identifier', null);

      return errorResponse(
        `The decision was not preserved because the immutable Registry event could not be written: ${eventError.message}`,
      );
    }

    return NextResponse.json({
      ok: true,
      submission: {
        id: updatedData.id,
        governance_name: updatedData.governance_name,
        status: updatedData.status,
        review_decision: updatedData.review_decision,
        review_rationale: updatedData.review_rationale,
        reviewed_at: updatedData.reviewed_at,
        reviewed_by_user_id: updatedData.reviewed_by_user_id,
        registry_identifier: updatedData.registry_identifier,
      },
      notice: configuration.notice,
      boundary:
        'This reviewer decision addresses Registry admissibility only. It does not certify performance, legality, safety, suitability, or execution fitness.',
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Unable to preserve the Registry reviewer decision.',
      500,
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const submissionId = request.nextUrl.searchParams.get('submissionId');

    if (!submissionId) {
      return errorResponse('Submission ID is required.');
    }

    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse('Authentication required.', 401);
    }

    const reviewerEmail = user.email?.toLowerCase() ?? '';

    if (!parseReviewerEmails().has(reviewerEmail)) {
      return errorResponse(
        'This account is not authorized to access Registry review decisions.',
        403,
      );
    }

    const { data, error } = await supabase
      .from('ai_governance_registry_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (error || !data) {
      return errorResponse('Registry submission was not found.', 404);
    }

    return NextResponse.json({
      decision: {
        submission_id: data.id,
        status: data.status,
        review_decision: data.review_decision ?? null,
        review_rationale: data.review_rationale ?? null,
        reviewer_notes: data.reviewer_notes ?? null,
        reviewed_at: data.reviewed_at ?? null,
        reviewed_by_user_id: data.reviewed_by_user_id ?? null,
        registry_identifier: data.registry_identifier ?? null,
      },
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Unable to load the Registry reviewer decision.',
      500,
    );
  }
}
