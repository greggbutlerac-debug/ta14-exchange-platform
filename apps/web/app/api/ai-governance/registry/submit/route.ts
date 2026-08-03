import { createHash } from 'node:crypto';
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

type RegistrySubmission = Record<string, unknown> & {
  id: string;
  owner_user_id: string;
  governance_name: string;
  current_version: string;
  status: string;
  registry_identifier: string | null;
  record_visibility: string | null;
  public_website: string | null;
  requested_review_pathway: string | null;
  authority_declaration_accepted: boolean;
  accuracy_declaration_accepted: boolean;
  registry_boundary_accepted: boolean;
  submitted_at: string | null;
  updated_at: string | null;
};

type RegistryEventRow = {
  event_hash: string;
};

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
          // Existing authenticated cookies remain readable in read-only contexts.
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

function eventHash(input: {
  submissionId: string;
  actorUserId: string;
  eventType: string;
  occurredAt: string;
  previousEventHash: string | null;
  payload: Record<string, unknown>;
}) {
  return createHash('sha256')
    .update(
      [
        input.submissionId,
        input.actorUserId,
        input.eventType,
        input.occurredAt,
        input.previousEventHash ?? '',
        JSON.stringify(input.payload),
      ].join('|'),
    )
    .digest('hex');
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

    const { data: submissionData, error: submissionError } = await supabase
      .from('ai_governance_registry_submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('owner_user_id', user.id)
      .single();

    const submission = submissionData as RegistrySubmission | null;

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
    ].filter((value): value is string => Boolean(value));

    const { count: evidenceCount, error: evidenceCountError } = await supabase
      .from('ai_governance_registry_evidence')
      .select('id', { count: 'exact', head: true })
      .eq('submission_id', submissionId)
      .eq('owner_user_id', user.id)
      .eq('evidence_state', 'current');

    if (evidenceCountError) {
      return errorResponse(evidenceCountError.message, 500);
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

    if (submission.record_visibility === 'public' && !hasValue(submission.public_website)) {
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
    const eventPayload = {
      requested_review_pathway: submission.requested_review_pathway,
      evidence_count: evidenceCount,
      declarations_accepted: true,
      intake_locked: true,
      registration_is_certification: false,
    };

    const { data: previousEventData, error: previousEventError } = await supabase
      .from('ai_governance_registry_events')
      .select('event_hash')
      .eq('submission_id', submissionId)
      .order('occurred_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (previousEventError) {
      return errorResponse(
        `Unable to resolve the Registry event chain: ${previousEventError.message}`,
        500,
      );
    }

    const previousEvent = previousEventData as RegistryEventRow | null;
    const previousEventHash = previousEvent?.event_hash ?? null;
    const submittedEventHash = eventHash({
      submissionId,
      actorUserId: user.id,
      eventType: 'submitted_for_review',
      occurredAt: submittedAt,
      previousEventHash,
      payload: eventPayload,
    });

    const { data: updatedSubmissionData, error: updateError } = await supabase
      .from('ai_governance_registry_submissions')
      .update({
        status: 'submitted',
        submitted_at: submittedAt,
        updated_at: submittedAt,
      })
      .eq('id', submissionId)
      .eq('owner_user_id', user.id)
      .eq('status', 'draft')
      .select(
        'id, governance_name, current_version, status, submitted_at, requested_review_pathway, registry_identifier, updated_at',
      )
      .single();

    if (updateError || !updatedSubmissionData) {
      return errorResponse(
        updateError?.message || 'Unable to submit the Registry intake.',
        500,
      );
    }

    const { error: eventError } = await supabase
      .from('ai_governance_registry_events')
      .insert({
        submission_id: submissionId,
        actor_user_id: user.id,
        actor_label: user.email ?? submission.claimant_name ?? 'Authenticated registrant',
        actor_role: 'registry_registrant',
        event_type: 'submitted_for_review',
        event_summary:
          'Registrant submitted the intake for TA-14 AI Governance Registry review.',
        event_payload: eventPayload,
        previous_event_hash: previousEventHash,
        event_hash: submittedEventHash,
        occurred_at: submittedAt,
      });

    if (eventError) {
      await supabase
        .from('ai_governance_registry_submissions')
        .update({
          status: 'draft',
          submitted_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionId)
        .eq('owner_user_id', user.id)
        .eq('status', 'submitted');

      return errorResponse(
        `The intake was not submitted because the immutable event could not be recorded: ${eventError.message}`,
        500,
      );
    }

    return NextResponse.json({
      ok: true,
      submission: updatedSubmissionData,
      event: {
        eventType: 'submitted_for_review',
        eventHash: submittedEventHash,
        previousEventHash,
        occurredAt: submittedAt,
      },
      notice:
        'The Registry intake has been submitted for review and is now locked by lifecycle status. Submission does not mean acceptance, certification, endorsement, or public registration.',
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

    const { data: submissionData, error } = await supabase
      .from('ai_governance_registry_submissions')
      .select(
        'id, governance_name, current_version, status, submitted_at, requested_review_pathway, registry_identifier, updated_at',
      )
      .eq('id', submissionId)
      .eq('owner_user_id', user.id)
      .single();

    if (error || !submissionData) {
      return errorResponse('Registry submission was not found.', 404);
    }

    const submission = submissionData as {
      id: string;
      governance_name: string;
      current_version: string;
      status: string;
      submitted_at: string | null;
      requested_review_pathway: string | null;
      registry_identifier: string | null;
      updated_at: string | null;
    };

    return NextResponse.json({
      submission,
      editable:
        submission.status === 'draft' && !submission.registry_identifier,
      locked:
        submission.status !== 'draft' ||
        Boolean(submission.registry_identifier),
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
