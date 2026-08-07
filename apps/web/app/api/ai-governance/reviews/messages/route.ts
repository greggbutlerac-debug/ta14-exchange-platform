import { createHash } from 'node:crypto';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type MessageCategory =
  | 'GENERAL_INQUIRY'
  | 'PARTICIPANT_CONTACT'
  | 'REVIEW_REQUEST'
  | 'EVIDENCE_QUESTION'
  | 'EVIDENCE_CHALLENGE'
  | 'FACTUAL_CORRECTION'
  | 'TECHNICAL_COMMENT'
  | 'REPLICATION_REQUEST'
  | 'DEMONSTRATION_REQUEST'
  | 'COLLABORATION_INQUIRY'
  | 'PUBLICATION_REFERENCE'
  | 'RIGHTS_OR_ATTRIBUTION'
  | 'DISPUTE_NOTICE'
  | 'REGISTRY_QUESTION'
  | 'FINDING_QUESTION'
  | 'ARTIFACT_QUESTION'
  | 'VERSION_LINEAGE_QUESTION'
  | 'OTHER';

type RecordVisibility =
  | 'PUBLIC'
  | 'CONTROLLED'
  | 'PRIVATE'
  | 'PUBLIC_METADATA_ONLY';

type PublicationPermission =
  | 'PUBLICATION_ALLOWED'
  | 'PUBLICATION_ALLOWED_WITH_ATTRIBUTION'
  | 'PUBLICATION_METADATA_ONLY'
  | 'CONTROLLED_USE_ONLY'
  | 'PRIVATE'
  | 'REQUIRES_FURTHER_APPROVAL';

type SupportingLink = {
  label?: string;
  url: string;
};

type MessagePayload = {
  submitterName?: string;
  submitterEmail?: string;
  submitterOrganization?: string;
  submitterRole?: string;

  category?: MessageCategory;
  subject?: string;
  messageBody?: string;

  registryIdentifier?: string;
  governanceEntityName?: string;
  governanceVersion?: string;

  demonstrationIdentifier?: string;
  caseIdentifier?: string;
  findingIdentifier?: string;
  artifactIdentifier?: string;
  relatedReviewRecordId?: string;

  visibility?: RecordVisibility;
  publicationPermission?: PublicationPermission;

  supportingLinks?: Array<string | SupportingLink>;
  conflictDisclosure?: string;
  affiliationDisclosure?: string;
  responseRequested?: boolean;

  metadata?: Record<string, unknown>;
};

const MESSAGE_CATEGORIES = new Set<MessageCategory>([
  'GENERAL_INQUIRY',
  'PARTICIPANT_CONTACT',
  'REVIEW_REQUEST',
  'EVIDENCE_QUESTION',
  'EVIDENCE_CHALLENGE',
  'FACTUAL_CORRECTION',
  'TECHNICAL_COMMENT',
  'REPLICATION_REQUEST',
  'DEMONSTRATION_REQUEST',
  'COLLABORATION_INQUIRY',
  'PUBLICATION_REFERENCE',
  'RIGHTS_OR_ATTRIBUTION',
  'DISPUTE_NOTICE',
  'REGISTRY_QUESTION',
  'FINDING_QUESTION',
  'ARTIFACT_QUESTION',
  'VERSION_LINEAGE_QUESTION',
  'OTHER',
]);

const VISIBILITIES = new Set<RecordVisibility>([
  'PUBLIC',
  'CONTROLLED',
  'PRIVATE',
  'PUBLIC_METADATA_ONLY',
]);

const PUBLICATION_PERMISSIONS = new Set<PublicationPermission>([
  'PUBLICATION_ALLOWED',
  'PUBLICATION_ALLOWED_WITH_ATTRIBUTION',
  'PUBLICATION_METADATA_ONLY',
  'CONTROLLED_USE_ONLY',
  'PRIVATE',
  'REQUIRES_FURTHER_APPROVAL',
]);

const RECORD_BOUND_CATEGORIES = new Set<MessageCategory>([
  'PARTICIPANT_CONTACT',
  'REVIEW_REQUEST',
  'EVIDENCE_QUESTION',
  'EVIDENCE_CHALLENGE',
  'FACTUAL_CORRECTION',
  'TECHNICAL_COMMENT',
  'REPLICATION_REQUEST',
  'PUBLICATION_REFERENCE',
  'RIGHTS_OR_ATTRIBUTION',
  'DISPUTE_NOTICE',
  'REGISTRY_QUESTION',
  'FINDING_QUESTION',
  'ARTIFACT_QUESTION',
  'VERSION_LINEAGE_QUESTION',
]);

const MAX_SUBJECT_LENGTH = 240;
const MAX_MESSAGE_LENGTH = 30_000;
const MAX_DISCLOSURE_LENGTH = 8_000;
const MAX_LINKS = 12;

function createSupabaseClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase environment variables are not configured.',
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
            ({
              name,
              value,
              options,
            }) => {
              cookieStore.set(
                name,
                value,
                options,
              );
            },
          );
        } catch {
          // Existing authenticated cookies remain readable in
          // read-only server contexts.
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

function text(
  value: unknown,
): string {
  return typeof value === 'string'
    ? value.trim()
    : '';
}

function nullable(
  value: unknown,
): string | null {
  const normalized = text(value);

  return normalized.length > 0
    ? normalized
    : null;
}

function isRecordVisibility(
  value: unknown,
): value is RecordVisibility {
  return (
    typeof value === 'string' &&
    VISIBILITIES.has(
      value as RecordVisibility,
    )
  );
}

function isPublicationPermission(
  value: unknown,
): value is PublicationPermission {
  return (
    typeof value === 'string' &&
    PUBLICATION_PERMISSIONS.has(
      value as PublicationPermission,
    )
  );
}

function isMessageCategory(
  value: unknown,
): value is MessageCategory {
  return (
    typeof value === 'string' &&
    MESSAGE_CATEGORIES.has(
      value as MessageCategory,
    )
  );
}

function isHttpUrl(
  value: string,
): boolean {
  try {
    const parsed = new URL(value);

    return (
      parsed.protocol === 'http:' ||
      parsed.protocol === 'https:'
    );
  } catch {
    return false;
  }
}

function normalizeSupportingLinks(
  value: unknown,
): SupportingLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized: SupportingLink[] = [];

  for (
    const item of value.slice(
      0,
      MAX_LINKS,
    )
  ) {
    if (
      typeof item === 'string'
    ) {
      const url =
        item.trim();

      if (
        url &&
        isHttpUrl(url)
      ) {
        normalized.push({
          url,
        });
      }

      continue;
    }

    if (
      !item ||
      typeof item !== 'object'
    ) {
      continue;
    }

    const candidate =
      item as Record<string, unknown>;

    const url =
      text(candidate.url);

    if (
      !url ||
      !isHttpUrl(url)
    ) {
      continue;
    }

    normalized.push({
      url,
      label:
        nullable(
          candidate.label,
        ) ??
        undefined,
    });
  }

  return normalized;
}

function hasGovernedRecordContext(
  payload: MessagePayload,
): boolean {
  return Boolean(
    text(
      payload.registryIdentifier,
    ) ||
      text(
        payload.demonstrationIdentifier,
      ) ||
      text(
        payload.caseIdentifier,
      ) ||
      text(
        payload.findingIdentifier,
      ) ||
      text(
        payload.artifactIdentifier,
      ) ||
      text(
        payload.relatedReviewRecordId,
      ),
  );
}

function buildIntegrityDigest(
  value: Record<string, unknown>,
): string {
  return createHash(
    'sha256',
  )
    .update(
      JSON.stringify(value),
      'utf8',
    )
    .digest(
      'hex',
    );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const cookieStore =
      await cookies();

    const supabase =
      createSupabaseClient(
        cookieStore,
      );

    const {
      data: {
        user,
      },
      error:
        userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      return errorResponse(
        'Authentication required.',
        401,
      );
    }

    const payload =
      (await request.json()) as MessagePayload;

    const submitterName =
      text(
        payload.submitterName,
      );

    const submitterEmail =
      nullable(
        payload.submitterEmail,
      ) ??
      nullable(
        user.email,
      );

    const submitterOrganization =
      nullable(
        payload.submitterOrganization,
      );

    const submitterRole =
      nullable(
        payload.submitterRole,
      );

    const category =
      payload.category;

    const subject =
      text(
        payload.subject,
      );

    const messageBody =
      text(
        payload.messageBody,
      );

    const visibility =
      isRecordVisibility(
        payload.visibility,
      )
        ? payload.visibility
        : 'PRIVATE';

    const publicationPermission =
      isPublicationPermission(
        payload.publicationPermission,
      )
        ? payload.publicationPermission
        : 'PRIVATE';

    const supportingLinks =
      normalizeSupportingLinks(
        payload.supportingLinks,
      );

    const conflictDisclosure =
      nullable(
        payload.conflictDisclosure,
      );

    const affiliationDisclosure =
      nullable(
        payload.affiliationDisclosure,
      );

    const responseRequested =
      payload.responseRequested ===
      true;

    const errors: string[] =
      [];

    if (
      !submitterName
    ) {
      errors.push(
        'Submitter name is required.',
      );
    }

    if (
      !category ||
      !isMessageCategory(
        category,
      )
    ) {
      errors.push(
        'A valid governed message category is required.',
      );
    }

    if (
      !subject
    ) {
      errors.push(
        'Subject is required.',
      );
    } else if (
      subject.length >
      MAX_SUBJECT_LENGTH
    ) {
      errors.push(
        `Subject must be ${MAX_SUBJECT_LENGTH} characters or fewer.`,
      );
    }

    if (
      !messageBody
    ) {
      errors.push(
        'Message body is required.',
      );
    } else if (
      messageBody.length >
      MAX_MESSAGE_LENGTH
    ) {
      errors.push(
        `Message body must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      );
    }

    if (
      conflictDisclosure &&
      conflictDisclosure.length >
        MAX_DISCLOSURE_LENGTH
    ) {
      errors.push(
        `Conflict disclosure must be ${MAX_DISCLOSURE_LENGTH} characters or fewer.`,
      );
    }

    if (
      affiliationDisclosure &&
      affiliationDisclosure.length >
        MAX_DISCLOSURE_LENGTH
    ) {
      errors.push(
        `Affiliation disclosure must be ${MAX_DISCLOSURE_LENGTH} characters or fewer.`,
      );
    }

    if (
      category &&
      RECORD_BOUND_CATEGORIES.has(
        category,
      ) &&
      !hasGovernedRecordContext(
        payload,
      )
    ) {
      errors.push(
        'This submission category must identify the Registry record, demonstration, case, finding, artifact, or review record being addressed.',
      );
    }

    if (
      errors.length >
      0
    ) {
      return errorResponse(
        'The governed submission is not ready.',
        422,
        errors,
      );
    }

    const submittedAt =
      new Date().toISOString();

    const recordContext = {
      registry_identifier:
        nullable(
          payload.registryIdentifier,
        ),

      governance_entity_name:
        nullable(
          payload.governanceEntityName,
        ),

      governance_version:
        nullable(
          payload.governanceVersion,
        ),

      demonstration_identifier:
        nullable(
          payload.demonstrationIdentifier,
        ),

      case_identifier:
        nullable(
          payload.caseIdentifier,
        ),

      finding_identifier:
        nullable(
          payload.findingIdentifier,
        ),

      artifact_identifier:
        nullable(
          payload.artifactIdentifier,
        ),

      related_review_record_id:
        nullable(
          payload.relatedReviewRecordId,
        ),
    };

    const metadata =
      payload.metadata &&
      typeof payload.metadata ===
        'object' &&
      !Array.isArray(
        payload.metadata,
      )
        ? payload.metadata
        : {};

    const integrityDigest =
      buildIntegrityDigest({
        schema:
          'TA-14-GOVERNED-MESSAGE-1.0',

        submitter_user_id:
          user.id,

        submitter_name:
          submitterName,

        submitter_email:
          submitterEmail,

        submitter_organization:
          submitterOrganization,

        submitter_role:
          submitterRole,

        category,
        subject,
        message_body:
          messageBody,

        ...recordContext,

        visibility,

        publication_permission:
          publicationPermission,

        supporting_links:
          supportingLinks,

        conflict_disclosure:
          conflictDisclosure,

        affiliation_disclosure:
          affiliationDisclosure,

        response_requested:
          responseRequested,

        submitted_at:
          submittedAt,
      });

    const {
      data,
      error,
    } =
      await supabase
        .from(
          'ta14_governed_messages',
        )
        .insert({
          submitter_user_id:
            user.id,

          submitter_name:
            submitterName,

          submitter_email:
            submitterEmail,

          submitter_organization:
            submitterOrganization,

          submitter_role:
            submitterRole,

          category,
          subject,

          message_body:
            messageBody,

          ...recordContext,

          visibility,

          publication_permission:
            publicationPermission,

          supporting_links:
            supportingLinks,

          conflict_disclosure:
            conflictDisclosure,

          affiliation_disclosure:
            affiliationDisclosure,

          response_requested:
            responseRequested,

          submitted_at:
            submittedAt,

          integrity_digest:
            integrityDigest,

          metadata: {
            ...metadata,

            submission_channel:
              'TA-14 AI Governance Exchange',

            submission_route:
              '/workspace/ai-governance/reviews/submit',

            schema:
              'TA-14-GOVERNED-MESSAGE-1.0',

            evidentiary_boundary:
              'Receipt of a governed message does not make the message a TA-14 finding, admitted evidence, certification, endorsement, or institutional adoption.',
          },
        })
        .select(
          [
            'id',
            'message_identifier',
            'category',
            'subject',
            'registry_identifier',
            'demonstration_identifier',
            'case_identifier',
            'finding_identifier',
            'artifact_identifier',
            'related_review_record_id',
            'visibility',
            'publication_permission',
            'status',
            'disposition',
            'response_requested',
            'submitted_at',
            'integrity_digest',
          ].join(', '),
        )
        .single();

    if (
      error ||
      !data
    ) {
      return errorResponse(
        error?.message ??
          'Unable to preserve the governed submission.',
        400,
      );
    }

    return NextResponse.json(
      {
        ok: true,

        message:
          data,

        notice:
          'Your governed submission has been preserved in the TA-14 institutional record. Receipt does not make the submission a TA-14 finding, admitted evidence, certification, endorsement, or institutional adoption.',

        boundary:
          'Separate voices remain separate. Any later publication, evidentiary admission, disposition, correction, review, or TA-14 response is a distinct institutional act.',
      },
      {
        status: 201,
      },
    );
  } catch (
    error
  ) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Unable to preserve the governed submission.',
      500,
    );
  }
}
