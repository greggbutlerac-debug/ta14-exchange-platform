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

type AutoFinalizeResult = {
  submission_id: string;
  registry_identifier: string;
  registered_at: string;
  public_record_id: string | null;
  is_publicly_published: boolean;
};

function createSupabaseClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
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

function errorResponse(
  message: string,
  status = 400,
  details?: unknown,
) {
  return NextResponse.json(
    details === undefined
      ? { error: message }
      : { error: message, details },
    { status },
  );
}

function hasValue(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      submissionId?: string;
    };

    const submissionId = body.submissionId?.trim();

    if (!submissionId) {
      return errorResponse('Submission ID is required.');
    }

    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);

    /*
     * Registration must occur in the context of a real authenticated
     * Exchange user. The database automatic-finalization function
     * independently verifies ownership using auth.uid().
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse('Authentication required.', 401);
    }

    /*
     * Load only the authenticated registrant's own Registry draft.
     */
    const {
      data: submissionData,
      error: submissionError,
    } = await supabase
      .from('ai_governance_registry_submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('owner_user_id', user.id)
      .single();

    const submission =
      submissionData as RegistrySubmission | null;

    if (submissionError || !submission) {
      return errorResponse(
        'Registry draft was not found.',
        404,
      );
    }

    /*
     * Already registered records are idempotent from the user's
     * perspective. Return the permanent identifier rather than
     * attempting another registration.
     */
    if (
      submission.status === 'registered' &&
      submission.registry_identifier
    ) {
      return NextResponse.json({
        ok: true,
        alreadyRegistered: true,
        registration: {
          submissionId: submission.id,
          governanceName: submission.governance_name,
          currentVersion: submission.current_version,
          registryIdentifier:
            submission.registry_identifier,
        },
        notice:
          'This governance entity is already registered. Registration is an administrative governance record and is not certification, endorsement, legal validation, regulatory approval, ownership adjudication, or proof of technical performance.',
      });
    }

    if (submission.status !== 'draft') {
      return errorResponse(
        `Only a private draft may begin automatic registration. Current status: ${submission.status}.`,
        409,
      );
    }

    if (submission.registry_identifier) {
      return errorResponse(
        'This Registry record already has a formal identifier and cannot be submitted as a draft.',
        409,
      );
    }

    /*
     * Client-facing validation.
     *
     * These checks provide useful immediate messages to the registrant.
     * The database automatic-readiness function independently performs
     * the governed final readiness determination before registration.
     */
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
    ].filter(
      (value): value is string => Boolean(value),
    );

    const {
      count: evidenceCount,
      error: evidenceCountError,
    } = await supabase
      .from('ai_governance_registry_evidence')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq('submission_id', submissionId)
      .eq('owner_user_id', user.id)
      .eq('evidence_state', 'current');

    if (evidenceCountError) {
      return errorResponse(
        evidenceCountError.message,
        500,
      );
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
        'Preserve at least one current evidence item before registration.',
      );
    }

    if (
      submission.record_visibility === 'public' &&
      !hasValue(submission.public_website)
    ) {
      validationErrors.push(
        'A public Registry record must include a public website or public evidence route.',
      );
    }

    if (validationErrors.length > 0) {
      return errorResponse(
        'The Governance Entity Registration is not ready.',
        422,
        validationErrors,
      );
    }

    /*
     * Stage the validated draft as submitted.
     *
     * "submitted" is the transactional handoff point between the
     * registrant's editable draft and the governed automatic-readiness
     * / registration process.
     */
    const submittedAt = new Date().toISOString();

    const {
      data: submittedData,
      error: submitError,
    } = await supabase
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
        [
          'id',
          'governance_name',
          'current_version',
          'status',
          'submitted_at',
          'requested_review_pathway',
          'registry_identifier',
          'updated_at',
        ].join(', '),
      )
      .single();

    if (submitError || !submittedData) {
      return errorResponse(
        submitError?.message ||
          'Unable to begin Governance Entity Registration.',
        500,
      );
    }

    /*
     * Governed automatic registration.
     *
     * This SECURITY DEFINER database function:
     *
     * - verifies auth.uid()
     * - verifies submission ownership
     * - performs automatic readiness checks
     * - refuses automatic registration when an exception exists
     * - issues the permanent TA-14-AIGR identifier
     * - creates the Registry projection
     * - creates the canonical record digest
     * - appends the immutable registration event
     *
     * No human reviewer acceptance is represented or implied.
     */
    const {
      data: finalizeData,
      error: finalizeError,
    } = await supabase.rpc(
      'ta14_registry_auto_finalize_submission_v1',
      {
        requested_submission_id: submissionId,
      },
    );

    if (finalizeError) {
      /*
       * A governed readiness failure is not the same thing as a
       * server failure.
       *
       * PostgreSQL 23514 is used by the automatic finalizer when the
       * registration cannot be automatically completed because a
       * readiness or exception condition exists.
       *
       * Leave the record in submitted status so it remains preserved
       * and can be routed to an exception/review pathway without
       * requiring the registrant to rebuild the intake.
       */
      if (finalizeError.code === '23514') {
        return NextResponse.json(
          {
            ok: false,
            requiresExceptionReview: true,
            submission: submittedData,
            error:
              'The registration was preserved but could not be automatically registered.',
            reason: finalizeError.message,
            details:
              finalizeError.details ??
              finalizeError.hint ??
              null,
            boundary:
              'Exception review concerns registration readiness only. It does not constitute certification, endorsement, technical validation, legal approval, or a finding concerning the merits of the governance architecture.',
          },
          { status: 409 },
        );
      }

      /*
       * Unexpected infrastructure failure:
       *
       * Restore the submission to draft so the registrant is not
       * permanently locked by a failed transaction outside the governed
       * readiness rules.
       */
      await supabase
        .from('ai_governance_registry_submissions')
        .update({
          status: 'draft',
          submitted_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionId)
        .eq('owner_user_id', user.id)
        .eq('status', 'submitted')
        .is('registry_identifier', null);

      return errorResponse(
        `Automatic registration could not be completed: ${finalizeError.message}`,
        500,
        {
          code: finalizeError.code ?? null,
          details: finalizeError.details ?? null,
          hint: finalizeError.hint ?? null,
        },
      );
    }

    const result = Array.isArray(finalizeData)
      ? (finalizeData[0] as AutoFinalizeResult | undefined)
      : undefined;

    if (!result?.registry_identifier) {
      /*
       * Defensive recovery. The RPC reported no database error but
       * failed to return the permanent identifier expected from a
       * successful finalization.
       */
      const {
        data: refreshedSubmission,
      } = await supabase
        .from('ai_governance_registry_submissions')
        .select(
          'id, governance_name, current_version, status, registry_identifier, accepted_at, updated_at',
        )
        .eq('id', submissionId)
        .eq('owner_user_id', user.id)
        .single();

      if (
        refreshedSubmission?.status === 'registered' &&
        refreshedSubmission?.registry_identifier
      ) {
        return NextResponse.json({
          ok: true,
          registration: {
            submissionId:
              refreshedSubmission.id,
            governanceName:
              refreshedSubmission.governance_name,
            currentVersion:
              refreshedSubmission.current_version,
            registryIdentifier:
              refreshedSubmission.registry_identifier,
            registeredAt:
              refreshedSubmission.accepted_at,
          },
          notice:
            'Governance Entity Registration completed successfully. Registration records an attributable governance identity and declared information. It is not certification, endorsement, legal validation, regulatory approval, ownership adjudication, or proof of technical performance.',
        });
      }

      return errorResponse(
        'Automatic registration completed without returning a Registry Identifier.',
        500,
      );
    }

    /*
     * Successful automatic registration.
     */
    return NextResponse.json({
      ok: true,
      alreadyRegistered: false,
      registration: {
        submissionId: result.submission_id,
        governanceName: submission.governance_name,
        currentVersion: submission.current_version,
        registryIdentifier:
          result.registry_identifier,
        registeredAt: result.registered_at,
        publicRecordId:
          result.public_record_id,
        publiclyPublished:
          result.is_publicly_published,
      },
      notice:
        'Governance Entity Registration completed successfully. The permanent Registry Identifier has been issued. Registration records an attributable governance identity and declared information. It is not certification, endorsement, legal validation, regulatory approval, ownership adjudication, or proof of technical performance.',
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Unable to complete Governance Entity Registration.',
      500,
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const submissionId =
      request.nextUrl.searchParams.get(
        'submissionId',
      );

    if (!submissionId) {
      return errorResponse(
        'Submission ID is required.',
      );
    }

    const cookieStore = await cookies();
    const supabase =
      createSupabaseClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse(
        'Authentication required.',
        401,
      );
    }

    const {
      data: submissionData,
      error,
    } = await supabase
      .from('ai_governance_registry_submissions')
      .select(
        [
          'id',
          'governance_name',
          'current_version',
          'status',
          'submitted_at',
          'accepted_at',
          'requested_review_pathway',
          'registry_identifier',
          'updated_at',
        ].join(', '),
      )
      .eq('id', submissionId)
      .eq('owner_user_id', user.id)
      .single();

    if (error || !submissionData) {
      return errorResponse(
        'Registry submission was not found.',
        404,
      );
    }

    const submission =
      submissionData as {
        id: string;
        governance_name: string;
        current_version: string;
        status: string;
        submitted_at: string | null;
        accepted_at: string | null;
        requested_review_pathway:
          | string
          | null;
        registry_identifier:
          | string
          | null;
        updated_at: string | null;
      };

    return NextResponse.json({
      submission,
      registered:
        submission.status === 'registered' &&
        Boolean(
          submission.registry_identifier,
        ),
      editable:
        submission.status === 'draft' &&
        !submission.registry_identifier,
      locked:
        submission.status !== 'draft' ||
        Boolean(
          submission.registry_identifier,
        ),
      registryBoundary:
        'Registration establishes an attributable governance record. It is not certification, endorsement, legal validation, regulatory approval, ownership adjudication, or proof of technical performance.',
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
