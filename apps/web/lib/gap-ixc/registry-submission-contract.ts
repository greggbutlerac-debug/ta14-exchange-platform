import { evaluateMinimalRegistryReadiness } from './registry-minimal-readiness';

export const TA14_RECORD_ONLY_REVIEW_PATHWAY = 'Record-only registration' as const;

export type RegistrySubmissionContractInput = {
  governance_name?: string | null;
  current_version?: string | null;
  claimant_name?: string | null;
  submitter_authority_role?: string | null;
  current_steward?: string | null;
  contact_email?: string | null;
  plain_language_description?: string | null;
  formal_claims?: string | null;
  authority_declaration_accepted?: boolean | null;
  accuracy_declaration_accepted?: boolean | null;
  registry_boundary_accepted?: boolean | null;
  terms_accepted?: boolean | null;
  requested_review_pathway?: string | null;
};

export function evaluateRecordOnlySubmission(
  submission: RegistrySubmissionContractInput,
) {
  const readiness = evaluateMinimalRegistryReadiness({
    governanceName: submission.governance_name,
    currentVersion: submission.current_version,
    claimantName: submission.claimant_name,
    authorityRole: submission.submitter_authority_role,
    stewardName: submission.current_steward,
    contactEmail: submission.contact_email,
    plainDescription: submission.plain_language_description,
    claims: submission.formal_claims,
    authorityConfirmed: submission.authority_declaration_accepted,
    accuracyConfirmed: submission.accuracy_declaration_accepted,
    boundaryConfirmed: submission.registry_boundary_accepted,
    termsAccepted: submission.terms_accepted,
  });

  return {
    ...readiness,
    reviewPathway:
      submission.requested_review_pathway?.trim() ||
      TA14_RECORD_ONLY_REVIEW_PATHWAY,
  };
}

export const TA14_OPTIONAL_REGISTRY_ENRICHMENT_FIELDS = [
  'short_name',
  'effective_version_date',
  'claimed_establishment_date',
  'governance_category',
  'claimant_type',
  'authority_basis',
  'authority_evidence',
  'organization_name',
  'public_website',
  'public_evidence_route',
  'explicit_non_claims',
  'known_limitations',
  'geographic_scope',
  'regulatory_scope',
  'evidence',
  'publications',
  'repositories',
  'zenodo_records',
  'patent_records',
  'ownership_declaration',
  'license_statement',
  'known_disputes',
] as const;
