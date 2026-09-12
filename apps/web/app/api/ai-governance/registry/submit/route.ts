import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { evaluateRegistryApiReadiness } from '@/lib/gap-ixc/registry-api-readiness';
import { getSupabasePublicEnvironment } from '@/lib/supabase/env';

type RegistrySubmission = Record<string, unknown> & {
  id: string;
  owner_user_id: string;
  governance_name: string;
  current_version: string;
  claimant_name: string | null;
  submitter_authority_role: string | null;
  current_steward: string | null;
  contact_email: string | null;
  plain_language_description: string | null;
  formal_claims: string | null;
  status: string;
  registry_identifier: string | null;
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

type RegistrationException = {
  id: string;
  submission_id: string;
  exception_status: string;
  exception_type: string;
  exception_code: string | null;
  exception_summary: string;
  exception_details: string[];
  readiness_failures: string[];
  resolution_summary: string | null;
  opened_at: string;
  resolved_at: string | null;
  updated_at: string;
};

function createSupabaseClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  const { url, publishableKey } = getSupabasePublicEnvironment();

  return createServerClient(url, publishableKey, {
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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { submissionId?: string };
    const submissionId = body.submissionId?.trim();

    if (!submissionId) return errorResponse('Submission ID is required.');

    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) return errorResponse('Authentication required.', 401);

    const { data: submissionData, error: submissionError } = await supabase
      .from('ai_governance_registry_submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('owner_user_id', user.id)
      .single();

    const submission = submissionData as RegistrySubmission | null;
    if (submissionError || !submission) return errorResponse('Registry draft was not found.', 404);

    if (submission.status === 'registered' && submission.registry_identifier) {
      return NextResponse.json({
        ok: true,
        alreadyRegistered: true,
        registration: {
          submissionId: submission.id,
          governanceName: submission.governance_name,
          currentVersion: submission.current_version,
          registryIdentifier: submission.registry_identifier,
        },
        notice: 'This governance entity is already registered. Registration is an administrative governance record and is not certification, endorsement, legal validation, regulatory approval, ownership adjudication, or proof of technical performance.',
      });
    }

    const isDraft = submission.status === 'draft';
    const isSubmitted = submission.status === 'submitted';

    if (!isDraft && !isSubmitted) {
      return errorResponse(`Only a private draft or an already-submitted eligible registration may continue through this pathway. Current status: ${submission.status}.`, 409);
    }

    if (submission.registry_identifier) {
      return errorResponse('This Registry record already has a formal identifier and cannot be submitted as a draft.', 409);
    }

    const readiness = evaluateRegistryApiReadiness({
      governance_name: submission.governance_name,
      current_version: submission.current_version,
      claimant_name: submission.claimant_name,
      submitter_authority_role: submission.submitter_authority_role,
      current_steward: submission.current_steward,
      contact_email: submission.contact_email,
      plain_language_description: submission.plain_language_description,
      formal_claims: submission.formal_claims,
      authority_declaration_accepted: submission.authority_declaration_accepted,
      accuracy_declaration_accepted: submission.accuracy_declaration_accepted,
      registry_boundary_accepted: submission.registry_boundary_accepted,
      terms_accepted: true,
      requested_review_pathway: submission.requested_review_pathway,
    });

    if (!readiness.ready) {
      return errorResponse('The Governance Entity Registration is not ready.', 422, readiness.errors);
    }

    let submittedData: Record<string, unknown> | null = null;
    const stagedFromDraft = isDraft;

    if (isDraft) {
      const submittedAt = new Date().toISOString();
      const { data, error: submitError } = await supabase
        .from('ai_governance_registry_submissions')
        .update({ status: 'submitted', submitted_at: submittedAt, requested_review_pathway: readiness.reviewPathway, updated_at: submittedAt })
        .eq('id', submissionId)
        .eq('owner_user_id', user.id)
        .eq('status', 'draft')
        .select('id, governance_name, current_version, status, submitted_at, requested_review_pathway, registry_identifier, updated_at')
        .single();

      if (submitError || !data) return errorResponse(submitError?.message || 'Unable to begin Governance Entity Registration.', 500);
      submittedData = data as unknown as Record<string, unknown>;
    } else {
      submittedData = {
        id: submission.id,
        governance_name: submission.governance_name,
        current_version: submission.current_version,
        status: submission.status,
        submitted_at: submission.submitted_at,
        requested_review_pathway: readiness.reviewPathway,
        registry_identifier: submission.registry_identifier,
        updated_at: submission.updated_at,
      };
    }

    const reviewPathway = readiness.reviewPathway;
    const automaticPathways = new Set(['Record-only registration', 'Administrative completeness review']);

    if (!automaticPathways.has(reviewPathway)) {
      return NextResponse.json({
        ok: true,
        pendingReview: true,
        submission: submittedData,
        review: { pathway: reviewPathway, status: 'submitted', reviewed: false },
        notice: 'The Registry submission has been preserved and is awaiting the requested review pathway. No Registry Identifier has been issued and the record has not been registered.',
        boundary: 'Submission for review is not registration, certification, endorsement, technical validation, legal approval, regulatory approval, ownership adjudication, or proof of performance.',
      });
    }

    const { data: finalizeData, error: finalizeError } = await supabase.rpc('ta14_registry_auto_finalize_submission_v1', { requested_submission_id: submissionId });

    if (finalizeError) {
      const missingAutoFinalizer = finalizeError.code === 'PGRST202' || finalizeError.code === '42883' || finalizeError.message?.toLowerCase().includes('ta14_registry_auto_finalize_submission_v1');

      if (missingAutoFinalizer) {
        return NextResponse.json({
          ok: true,
          pendingReview: true,
          submission: submittedData,
          review: { pathway: reviewPathway, status: 'submitted', reviewed: false },
          infrastructureWarning: 'The automatic finalization RPC is not available in the deployed database. The Registry submission remains safely preserved as submitted and requires administrative finalization.',
          notice: 'The Registry submission has been preserved successfully. Automatic identifier issuance is temporarily unavailable, so no Registry Identifier has been issued yet.',
          boundary: 'A preserved submission is not registration, certification, endorsement, technical validation, legal approval, regulatory approval, ownership adjudication, or proof of performance.',
        });
      }

      if (finalizeError.code === '23514') {
        const failureDetail = finalizeError.details ?? finalizeError.hint ?? null;
        const readinessFailures = failureDetail ? failureDetail.split('|').map((value) => value.trim()).filter(Boolean) : [];
        const { data: exceptionId, error: exceptionError } = await supabase.rpc('ta14_registry_record_registration_exception_v1', {
          requested_submission_id: submissionId,
          requested_exception_code: finalizeError.code ?? '23514',
          requested_summary: 'Automatic Governance Entity Registration requires attention.',
          requested_details: [finalizeError.message],
          requested_readiness_failures: readinessFailures,
        });

        return NextResponse.json({
          ok: false,
          requiresExceptionReview: true,
          submission: submittedData,
          exception: { id: exceptionError ? null : exceptionId, recorded: !exceptionError, recordingError: exceptionError?.message ?? null },
          error: 'The registration was preserved but could not be automatically registered.',
          reason: finalizeError.message,
          details: failureDetail,
          readinessFailures,
          boundary: 'Exception review concerns registration readiness only. It does not constitute certification, endorsement, technical validation, legal approval, or a finding concerning the merits of the governance architecture.',
        }, { status: 409 });
      }

      if (stagedFromDraft) {
        await supabase.from('ai_governance_registry_submissions').update({ status: 'draft', submitted_at: null, updated_at: new Date().toISOString() }).eq('id', submissionId).eq('owner_user_id', user.id).eq('status', 'submitted').is('registry_identifier', null);
      }

      return errorResponse(`Automatic registration could not be completed: ${finalizeError.message}`, 500, { code: finalizeError.code ?? null, details: finalizeError.details ?? null, hint: finalizeError.hint ?? null });
    }

    const result = Array.isArray(finalizeData) ? (finalizeData[0] as AutoFinalizeResult | undefined) : undefined;

    if (!result?.registry_identifier) {
      const { data: refreshedSubmission } = await supabase.from('ai_governance_registry_submissions').select('id, governance_name, current_version, status, registry_identifier, accepted_at, updated_at').eq('id', submissionId).eq('owner_user_id', user.id).single();
      if (refreshedSubmission?.status === 'registered' && refreshedSubmission?.registry_identifier) {
        return NextResponse.json({ ok: true, registration: { submissionId: refreshedSubmission.id, governanceName: refreshedSubmission.governance_name, currentVersion: refreshedSubmission.current_version, registryIdentifier: refreshedSubmission.registry_identifier, registeredAt: refreshedSubmission.accepted_at }, notice: 'Governance Entity Registration completed successfully. Registration records an attributable governance identity and declared information. It is not certification, endorsement, legal validation, regulatory approval, ownership adjudication, or proof of technical performance.' });
      }
      return errorResponse('Automatic registration completed without returning a Registry Identifier.', 500);
    }

    return NextResponse.json({
      ok: true,
      alreadyRegistered: false,
      registration: { submissionId: result.submission_id, governanceName: submission.governance_name, currentVersion: submission.current_version, registryIdentifier: result.registry_identifier, registeredAt: result.registered_at, publicRecordId: result.public_record_id, publiclyPublished: result.is_publicly_published },
      notice: 'Governance Entity Registration completed successfully. The permanent Registry Identifier has been issued. Registration records an attributable governance identity and declared information. It is not certification, endorsement, legal validation, regulatory approval, ownership adjudication, or proof of technical performance.',
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to complete Governance Entity Registration.', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const submissionId = request.nextUrl.searchParams.get('submissionId');
    if (!submissionId) return errorResponse('Submission ID is required.');

    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return errorResponse('Authentication required.', 401);

    const { data: submissionData, error } = await supabase.from('ai_governance_registry_submissions').select('id, governance_name, current_version, status, submitted_at, accepted_at, requested_review_pathway, registry_identifier, updated_at').eq('id', submissionId).eq('owner_user_id', user.id).single();
    if (error || !submissionData) return errorResponse('Registry submission was not found.', 404);

    const submission = submissionData as unknown as { id: string; governance_name: string; current_version: string; status: string; submitted_at: string | null; accepted_at: string | null; requested_review_pathway: string | null; registry_identifier: string | null; updated_at: string | null };
    const { data: exceptionData, error: exceptionError } = await supabase.from('ta14_registry_registration_exceptions').select('id, submission_id, exception_status, exception_type, exception_code, exception_summary, exception_details, readiness_failures, resolution_summary, opened_at, resolved_at, updated_at').eq('submission_id', submissionId).eq('owner_user_id', user.id).in('exception_status', ['open', 'correction_required', 'under_review']).order('opened_at', { ascending: false }).limit(1).maybeSingle();
    if (exceptionError) return errorResponse(`Unable to load Registry exception status: ${exceptionError.message}`, 500);

    const latestException = exceptionData as unknown as RegistrationException | null;
    const registered = submission.status === 'registered' && Boolean(submission.registry_identifier);
    const editable = submission.status === 'draft' && !submission.registry_identifier;
    const needsAttention = !registered && Boolean(latestException);

    return NextResponse.json({
      submission,
      registered,
      editable,
      locked: submission.status !== 'draft' || Boolean(submission.registry_identifier),
      needsAttention,
      latestException,
      registrationState: registered ? 'registered' : needsAttention ? 'needs_attention' : submission.status,
      registryBoundary: 'Registration establishes an attributable governance record. It is not certification, endorsement, legal validation, regulatory approval, ownership adjudication, or proof of technical performance.',
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to load Registry submission status.', 500);
  }
}
