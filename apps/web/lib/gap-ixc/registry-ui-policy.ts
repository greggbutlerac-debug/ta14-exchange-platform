import { TA14_REGISTRY_14_STEP_POLICY } from './registry-14-step-policy';

export type RegistryUiFieldState = 'REQUIRED' | 'OPTIONAL' | 'CONDITIONAL';

export type RegistryUiStep = {
  number: string;
  title: string;
  short: string;
  required: string[];
  optional: string[];
  message: string;
};

export const TA14_REGISTRY_UI_STEPS: RegistryUiStep[] =
  TA14_REGISTRY_14_STEP_POLICY.map((step) => ({
    number: step.number,
    title: step.title,
    short: step.short,
    required: step.blockingRequiredFields,
    optional: step.optionalFields,
    message:
      step.blockingRequiredFields.length > 0
        ? 'Complete the required items. Every other field on this step may be left blank unless you choose to provide it.'
        : 'This step is optional enrichment. You may complete any, all, or none of these fields and continue.'
  }));

export const REGISTRY_OPTIONALITY_NOTICE =
  'TA-14 keeps all 14 Registry steps for structural consistency. Optional fields may be left blank without reducing registration eligibility. Additional evidence or detail becomes mandatory only when a later governed pathway specifically relies on it.';

export const REGISTRY_EVIDENCE_NOTICE =
  'Evidence is optional for record-only registration. If evidence is supplied, TA-14 requires enough description and provenance to preserve and rely on that evidence responsibly.';

export const REGISTRY_REVIEW_NOTICE =
  'Selecting a deeper review pathway is optional. Leaving review unselected defaults to Record-only registration.';

export const REGISTRY_NONCLAIMS_NOTICE =
  'Non-claims and limitations are optional at ordinary registration unless omission would materially misrepresent the architecture. TA-14 may request clarification in that limited circumstance.';

export function fieldState(fieldId: string): RegistryUiFieldState {
  for (const step of TA14_REGISTRY_14_STEP_POLICY) {
    if (step.blockingRequiredFields.includes(fieldId)) return 'REQUIRED';
    if (step.optionalFields.includes(fieldId)) {
      return step.note?.toLowerCase().includes('required only')
        ? 'CONDITIONAL'
        : 'OPTIONAL';
    }
  }
  return 'OPTIONAL';
}

export function stepCanAdvance(stepNumber: string, completeRequiredFieldIds: string[]) {
  const step = TA14_REGISTRY_14_STEP_POLICY.find((item) => item.number === stepNumber);
  if (!step) return true;
  return step.blockingRequiredFields.every((field) =>
    completeRequiredFieldIds.includes(field),
  );
}
