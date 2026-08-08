import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const TERMS_INSTRUMENT_ID = "TA14-RET-001";
const TERMS_VERSION = "1.1";
const TERMS_EFFECTIVE_DATE = "2026-08-07";
const GOVERNANCE_REGISTRATION_PATHWAY =
  "GOVERNANCE_ENTITY_REGISTRATION";
const RELATED_RECORD_TYPE =
  "AI_GOVERNANCE_REGISTRY_SUBMISSION";

type RegistrySubmission = {
  id: string;
  owner_user_id: string;
  governance_name: string;
  current_version: string;
  status: string;
  registry_identifier: string | null;
};

type TermsAcceptance = {
  acceptance_id: string;
  participant_id: string;
  governance_id: string | null;
  terms_instrument_id: string;
  terms_version: string;
  terms_effective_date: string;
  accepted_at: string;
  pathway: string;
  related_record_type: string | null;
  related_record_key: string | null;
  acceptance_status: string;
  source: string;
};

function createSupabaseClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase environment variables are not configured.",
    );
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll(values) {
        try {
          values.forEach(
            ({ name, value, options }) => {
              cookieStore.set(
                name,
                value,
                options,
              );
            },
          );
        } catch {
          /*
           * Auth cookies may already be available from the
           * request even when the current server context cannot
           * write refreshed cookies.
           */
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
      ? {
          error: message,
        }
      : {
          error: message,
          details,
        },
    {
      status,
    },
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as {
        submissionId?: string;
        accepted?: boolean;
      };

    const submissionId =
      body.submissionId?.trim();

    if (!submissionId) {
      return errorResponse(
        "Registry submission ID is required.",
      );
    }

    if (body.accepted !== true) {
      return errorResponse(
        "Affirmative acceptance of the current Registration & Evidence Terms is required.",
      );
    }

    const cookieStore =
      await cookies();

    const supabase =
      createSupabaseClient(
        cookieStore,
      );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse(
        "Authentication required.",
        401,
      );
    }

    /*
     * The Terms acceptance must be attached only to a
     * Registry submission owned by the authenticated user.
     */
    const {
      data: submissionData,
      error: submissionError,
    } = await supabase
      .from(
        "ai_governance_registry_submissions",
      )
      .select(
        [
          "id",
          "owner_user_id",
          "governance_name",
          "current_version",
          "status",
          "registry_identifier",
        ].join(","),
      )
      .eq(
        "id",
        submissionId,
      )
      .eq(
        "owner_user_id",
        user.id,
      )
      .single();

    const submission =
      submissionData as unknown as
        | RegistrySubmission
        | null;

    if (
      submissionError ||
      !submission
    ) {
      return errorResponse(
        "Registry submission was not found.",
        404,
      );
    }

    /*
     * Idempotency:
     * refreshing, retrying, or double-clicking must not create
     * duplicate acceptance records for the same submission and
     * Terms version.
     */
    const {
      data: existingData,
      error: existingError,
    } = await supabase
      .from(
        "ta14_terms_acceptances",
      )
      .select(
        [
          "acceptance_id",
          "participant_id",
          "governance_id",
          "terms_instrument_id",
          "terms_version",
          "terms_effective_date",
          "accepted_at",
          "pathway",
          "related_record_type",
          "related_record_key",
          "acceptance_status",
          "source",
        ].join(","),
      )
      .eq(
        "participant_id",
        user.id,
      )
      .eq(
        "related_record_type",
        RELATED_RECORD_TYPE,
      )
      .eq(
        "related_record_key",
        submission.id,
      )
      .eq(
        "terms_instrument_id",
        TERMS_INSTRUMENT_ID,
      )
      .eq(
        "terms_version",
        TERMS_VERSION,
      )
      .eq(
        "acceptance_status",
        "ACCEPTED",
      )
      .maybeSingle();

    if (existingError) {
      return errorResponse(
        "Unable to inspect the existing Terms acceptance record.",
        500,
        existingError.message,
      );
    }

    if (existingData) {
      const existing =
        existingData as unknown as
          TermsAcceptance;

      return NextResponse.json({
        ok: true,
        alreadyAccepted: true,

        acceptance: existing,

        terms: {
          instrumentId:
            TERMS_INSTRUMENT_ID,

          version:
            TERMS_VERSION,

          effectiveDate:
            TERMS_EFFECTIVE_DATE,
        },

        submission: {
          id:
            submission.id,

          governanceName:
            submission.governance_name,

          governanceVersion:
            submission.current_version,

          registryIdentifier:
            submission.registry_identifier,
        },

        notice:
          `TA14 Registration & Evidence Terms ${TERMS_INSTRUMENT_ID} Version ${TERMS_VERSION} were already accepted for this Registry submission.`,
      });
    }

    /*
     * At the time of acceptance, the permanent Governance
     * Registration ID may not exist yet.
     *
     * The acceptance therefore binds first to the immutable
     * Registry submission ID. If registration has already been
     * completed, the permanent governance identifier is also
     * preserved.
     */
    const {
      data: insertedData,
      error: insertError,
    } = await supabase
      .from(
        "ta14_terms_acceptances",
      )
      .insert({
        participant_id:
          user.id,

        governance_id:
          submission.registry_identifier ??
          null,

        terms_instrument_id:
          TERMS_INSTRUMENT_ID,

        terms_version:
          TERMS_VERSION,

        terms_effective_date:
          TERMS_EFFECTIVE_DATE,

        pathway:
          GOVERNANCE_REGISTRATION_PATHWAY,

        related_record_type:
          RELATED_RECORD_TYPE,

        related_record_key:
          submission.id,

        acceptance_status:
          "ACCEPTED",

        source:
          "TA14_EXCHANGE_GOVERNANCE_REGISTRATION",
      })
      .select(
        [
          "acceptance_id",
          "participant_id",
          "governance_id",
          "terms_instrument_id",
          "terms_version",
          "terms_effective_date",
          "accepted_at",
          "pathway",
          "related_record_type",
          "related_record_key",
          "acceptance_status",
          "source",
        ].join(","),
      )
      .single();

    if (
      insertError ||
      !insertedData
    ) {
      return errorResponse(
        "Unable to preserve the Terms acceptance record.",
        500,
        insertError?.message,
      );
    }

    const acceptance =
      insertedData as unknown as
        TermsAcceptance;

    return NextResponse.json({
      ok: true,
      alreadyAccepted: false,

      acceptance,

      terms: {
        instrumentId:
          TERMS_INSTRUMENT_ID,

        version:
          TERMS_VERSION,

        effectiveDate:
          TERMS_EFFECTIVE_DATE,

        publicUrl:
          "/governance/registration-evidence-terms",
      },

      submission: {
        id:
          submission.id,

        governanceName:
          submission.governance_name,

        governanceVersion:
          submission.current_version,

        registryIdentifier:
          submission.registry_identifier,
      },

      boundary: {
        registrationEstablishes:
          "Attributable governance identity and chronology.",

        registrationDoesNotEstablish: [
          "certification",
          "endorsement",
          "regulatory compliance",
          "legal compliance",
          "technical correctness",
          "production readiness",
          "admissibility of a specific execution",
        ],
      },

      notice:
        `Terms acceptance preserved as ${acceptance.acceptance_id}. TA14-RET-001 Version ${TERMS_VERSION} is now attributable to this Registry submission.`,
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : "Unable to preserve Terms acceptance.",
      500,
    );
  }
}
