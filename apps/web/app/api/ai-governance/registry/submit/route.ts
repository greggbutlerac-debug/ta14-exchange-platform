import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const REQUIRED_TEXT_FIELDS = [
  'governance_name',
  'governance_category',
  'current_version',
  'claimant_name',
  'claimant_type',
  'submitter_authority_role',
  'authority_basis',
  'contact_email',
  'plain_language_description',
  'formal_claims',
  'explicit_non_claims',
  'ownership_declaration',
  'requested_review_pathway',
] as const;

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

function errorResponse(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    details === undefined ? { error: message } : { error: message, details },
    { status },
  );
}

function hasValue(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { submissionId?: string };
    const submissionId = body.submissionId?.trim();

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

    const { data: submission, error: submissionError } = await supabase
      .from('ai_governance_registry_submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('owner_user_id', user.id)
      .single();

    if (submissionError || !submission) {
      return errorResponse('Registry draft was not found.', 404);
    }

    if (submission.status !== 'draft') {
      return errorResponse(
        'Only a private draft can be submitted for Registry review.',
        409,
      );
    }

    if (submission.registry_identifier) {
      return errorResponse(
        'This Registry record already has a formal identifier and cannot be resubmitted as a draft.',
        409,
      );
    }

    const missingFields = REQUIRED_TEXT_FIELDS.filter(
      (field) => !hasValue(submission[field]),
    );

    const missingDeclarations = [
      !submission.authority_declaration_accepted
        ? 'authority declaration'
        : null,
      !submission.accuracy_declaration_accepted
        ? 'accuracy declaration'
        : null,
      !submission.registry_boundary_accepted
        ? 'Registry boundary declaration'
        : null,
    ].filter(Boolean);

    const { count: evidenceCount, error: evidenceCountError } = await supabase
      .from('ai_governance_registry_evidence')
      .select('id', { count: 'exact', head: true })
      .eq('submission_id', submissionId)
      .eq('owner_user_id', user.id)
      .eq('evidence_state', 'current');

    if (evidenceCountError) {
      return errorResponse(evidenceCountError.message);
    }

    const validationErrors: string[] = [];

    if (missingFields.length > 0) {
      validationErrors.push(
        `Complete required fields: ${missingFields.join(', ')}.`,
      );
    }

    if (missingDeclarations.length > 0) {
      validationErrors.push(
        `Accept required declarations: ${missingDeclarations.join(', ')}.`,
      );
    }

    if (!evidenceCount || evidenceCount < 1) {
      validationErrors.push(
        'Preserve at least one current evidence item before submission.',
      );
    }

    if (submission.record_visibility === 'public' && !submission.public_website) {
      validationErrors.push(
        'A public Registry record must include a public website or public evidence route.',
      );
    }

    if (validationErrors.length > 0) {
      return errorResponse(
        'The Registry draft is not ready for review.',
        422,
        validationErrors,
      );
    }

    const submittedAt = new Date().toISOString();

    const { data: updatedSubmission, error: updateError } = await supabase
      .from('ai_governance_registry_submissions')
      .update({
        status: 'submitted',
        submitted_at: submittedAt,
        intake_locked_at: submittedAt,
        updated_at: submittedAt,
      })
      .eq('id', submissionId)
      .eq('owner_user_id', user.id)
      .eq('status', 'draft')
      .select(
        'id, status, submitted_at, intake_locked_at, requested_review_pathway',
      )
      .single();

    if (updateError || !updatedSubmission) {
      return errorResponse(
        updateError?.message || 'Unable to submit the Registry intake.',
      );
    }

    const { error: eventError } = await supabase
      .from('ai_governance_registry_events')
      .insert({
        submission_id: submissionId,
        actor_user_id: user.id,
        event_type: 'submitted_for_review',
        from_status: 'draft',
        to_status: 'submitted',
        event_summary:
          'Registrant submitted the intake for TA-14 AI Governance Registry review.',
        event_payload: {
          requested_review_pathway:
            updatedSubmission.requested_review_pathway,
          evidence_count: evidenceCount,
          declarations_accepted: true,
          intake_locked: true,
        },
      });

    if (eventError) {
      await supabase
        .from('ai_governance_registry_submissions')
        .update({
          status: 'draft',
          submitted_at: null,
          intake_locked_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionId)
        .eq('owner_user_id', user.id)
        .eq('status', 'submitted');

      return errorResponse(
        `The intake was not submitted because the immutable event could not be recorded: ${eventError.message}`,
      );
    }

    return NextResponse.json({
      ok: true,
      submission: updatedSubmission,
      notice:
        'The Registry intake has been submitted for review and is now locked. Submission does not mean acceptance, certification, endorsement, or public registration.',
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Unable to submit the Registry intake for review.',
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

    const { data: submission, error } = await supabase
      .from('ai_governance_registry_submissions')
      .select(
        [
          'id',
          'status',
          'submitted_at',
          'intake_locked_at',
          'requested_review_pathway',
          'registry_identifier',
          'updated_at',
        ].join(','),
      )
      .eq('id', submissionId)
      .eq('owner_user_id', user.id)
      .single();

    if (error || !submission) {
      return errorResponse('Registry submission was not found.', 404);
    }

    return NextResponse.json({
      submission,
      editable:
        submission.status === 'draft' && !submission.registry_identifier,
      locked: submission.status !== 'draft' || Boolean(submission.registry_identifier),
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Unable to load Registry submission status.',
      500,
    );
  }
}
