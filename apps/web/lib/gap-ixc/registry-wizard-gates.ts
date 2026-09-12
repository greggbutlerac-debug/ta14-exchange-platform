import { TA14_RECORD_ONLY_REVIEW_PATHWAY } from './registry-submission-contract';

export type RegistryWizardGateInput = {
  governanceName?: string | null;
  currentVersion?: string | null;
  claimantName?: string | null;
  authorityRole?: string | null;
  authorityConfirmed?: boolean | null;
  stewardName?: string | null;
  contactEmail?: string | null;
  plainDescription?: string | null;
  claims?: string | null;
  accuracyConfirmed?: boolean | null;
  boundaryConfirmed?: boolean | null;
  termsAccepted?: boolean | null;
};

const present = (value?: string | null) => Boolean(value?.trim());

export function normalizedStewardName(input: RegistryWizardGateInput) {
  return input.stewardName?.trim() || input.claimantName?.trim() || '';
}

export function registryWizardStepComplete(stepIndex: number, form: RegistryWizardGateInput) {
  switch (stepIndex) {
    case 0:
      return present(form.governanceName) && present(form.currentVersion);
    case 1:
      return present(form.claimantName) && present(form.authorityRole);
    case 2:
      return present(normalizedStewardName(form)) && present(form.contactEmail);
    case 3:
      return present(form.plainDescription);
    case 4:
      return present(form.claims);
    case 5: // Non-Claims — optional
    case 6: // Scope & Jurisdiction — optional
    case 7: // Evidence Package — optional
    case 8: // Publications — optional
    case 9: // Repositories & Deposits — optional
    case 10: // Patents & Rights — optional
    case 11: // Additional Review — optional
      return true;
    case 12:
      return (
        form.authorityConfirmed === true &&
        form.accuracyConfirmed === true &&
        form.boundaryConfirmed === true &&
        form.termsAccepted === true
      );
    case 13:
      return registryWizardValidationErrors(form).length === 0;
    default:
      return true;
  }
}

export function registryWizardValidationErrors(form: RegistryWizardGateInput) {
  const errors: string[] = [];

  if (!present(form.governanceName)) errors.push('Governance name is required.');
  if (!present(form.currentVersion)) errors.push('Current version is required.');
  if (!present(form.claimantName)) errors.push('Claimant name is required.');
  if (!present(form.authorityRole)) errors.push('Submission authority role is required.');
  if (!present(normalizedStewardName(form))) errors.push('Current steward is required.');
  if (!present(form.contactEmail)) errors.push('Contact email is required.');
  if (!present(form.plainDescription)) errors.push('Plain-language description is required.');
  if (!present(form.claims)) errors.push('At least one affirmative claim is required.');
  if (!form.authorityConfirmed) errors.push('Submission authority must be confirmed.');
  if (!form.accuracyConfirmed) errors.push('Accuracy declaration must be confirmed.');
  if (!form.boundaryConfirmed) errors.push('Registry boundary must be acknowledged.');
  if (!form.termsAccepted) errors.push('TA14-RET-001 v1.1 Registry Terms must be accepted before submission.');

  return errors;
}

export function registryRequiredCompletion(form: RegistryWizardGateInput) {
  const checks = [
    present(form.governanceName),
    present(form.currentVersion),
    present(form.claimantName),
    present(form.authorityRole),
    present(normalizedStewardName(form)),
    present(form.contactEmail),
    present(form.plainDescription),
    present(form.claims),
    form.authorityConfirmed === true,
    form.accuracyConfirmed === true,
    form.boundaryConfirmed === true,
    form.termsAccepted === true,
  ];

  const complete = checks.filter(Boolean).length;
  return {
    complete,
    total: checks.length,
    percent: Math.round((complete / checks.length) * 100),
    missing: checks.length - complete,
  };
}

export function effectiveReviewPathway(requested?: string | null) {
  return requested?.trim() || TA14_RECORD_ONLY_REVIEW_PATHWAY;
}

export function evidenceCanBeSkipped() {
  return true;
}

export function evidenceEntryIsComplete(entry: {
  description?: string | null;
  provenanceStatus?: string | null;
}) {
  // Evidence itself is optional. Once a registrant elects to submit an evidence
  // object, its descriptive and provenance metadata become required so TA-14
  // does not preserve an unattributable or uninterpretable evidence object.
  return present(entry.description) && present(entry.provenanceStatus);
}
