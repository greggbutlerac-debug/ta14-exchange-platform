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

export function registryWizardStepComplete(stepIndex: number, form: RegistryWizardGateInput) {
  switch (stepIndex) {
    case 0:
      return present(form.governanceName) && present(form.currentVersion);
    case 1:
      return present(form.claimantName) && present(form.authorityRole) && form.authorityConfirmed === true;
    case 2:
      return present(form.stewardName) && present(form.contactEmail);
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
      return form.accuracyConfirmed === true && form.boundaryConfirmed === true;
    case 13:
      return (
        present(form.governanceName) &&
        present(form.currentVersion) &&
        present(form.claimantName) &&
        present(form.authorityRole) &&
        form.authorityConfirmed === true &&
        present(form.stewardName) &&
        present(form.contactEmail) &&
        present(form.plainDescription) &&
        present(form.claims) &&
        form.accuracyConfirmed === true &&
        form.boundaryConfirmed === true &&
        form.termsAccepted === true
      );
    default:
      return true;
  }
}

export function effectiveReviewPathway(requested?: string | null) {
  return requested?.trim() || TA14_RECORD_ONLY_REVIEW_PATHWAY;
}

export function evidenceCanBeSkipped() {
  return true;
}

export function evidenceEntryIsComplete(entry: { description?: string | null; provenanceStatus?: string | null }) {
  // Evidence itself is optional. Once a registrant elects to submit an evidence
  // object, its descriptive and provenance metadata become required so TA-14
  // does not preserve an unattributable or uninterpretable evidence object.
  return present(entry.description) && present(entry.provenanceStatus);
}
