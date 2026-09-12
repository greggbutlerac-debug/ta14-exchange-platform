import type { RegistrySubmissionContractInput } from './registry-submission-contract';
import { evaluateRecordOnlySubmission } from './registry-submission-contract';

export type RegistryApiReadiness = {
  ready: boolean;
  missing: string[];
  reviewPathway: string;
  errors: string[];
};

const FIELD_LABELS: Record<string, string> = {
  governanceName: 'governance name',
  currentVersion: 'current version',
  claimantName: 'claimant / submitting organization',
  authorityRole: 'submitter authority role',
  stewardName: 'steward',
  contactEmail: 'contact email',
  plainDescription: 'plain-language description',
  claims: 'core claims',
  authorityConfirmed: 'authority / attribution declaration',
  accuracyConfirmed: 'accuracy declaration',
  boundaryConfirmed: 'Registry boundary declaration',
  termsAccepted: 'Registration & Evidence Terms',
};

export function evaluateRegistryApiReadiness(
  submission: RegistrySubmissionContractInput,
): RegistryApiReadiness {
  const result = evaluateRecordOnlySubmission(submission);

  return {
    ready: result.ready,
    missing: result.missing,
    reviewPathway: result.reviewPathway,
    errors: result.missing.length
      ? [
          `Complete required registration information: ${result.missing
            .map((field) => FIELD_LABELS[field] ?? field)
            .join(', ')}.`,
        ]
      : [],
  };
}

/**
 * Optional evidence is validated when supplied, not demanded merely because a
 * Governance Entity Registration exists. This helper intentionally answers only
 * whether the record-only pathway has evidence at all; it does not turn absence
 * into a readiness failure.
 */
export function describeOptionalEvidence(count: number | null | undefined) {
  const normalized = Math.max(0, count ?? 0);
  return {
    count: normalized,
    supplied: normalized > 0,
    registrationRequired: false as const,
  };
}
