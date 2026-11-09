/**
 * HVAC Performance Record baseline gate.
 * The 14 numbered slots are intentionally generic until the approved
 * field-step specification is incorporated. This is not a diagnostic engine.
 */
export const REQUIRED_BASELINE_STEPS = 14 as const;
export type BaselineStep = {
  number: number;
  evidenceRefs: string[];
  technicianAttested: boolean;
};
export type BaselineDraft = {
  intakeId: string;
  steps: BaselineStep[];
  frozenAt: string | null;
  dddStatus: 'LOCKED';
  interventionAuthorization: 'NONE';
};

export function newBaselineDraft(intakeId: string): BaselineDraft {
  if (!intakeId.trim()) throw new Error('Intake identifier required');
  return {
    intakeId,
    steps: Array.from({length: REQUIRED_BASELINE_STEPS}, (_, i) => ({
      number: i + 1, evidenceRefs: [], technicianAttested: false,
    })),
    frozenAt: null,
    dddStatus: 'LOCKED',
    interventionAuthorization: 'NONE',
  };
}

export function recordStepEvidence(
  draft: BaselineDraft, stepNumber: number, evidenceRefs: string[],
  technicianAttested: boolean,
): BaselineDraft {
  if (draft.frozenAt) throw new Error('Frozen baseline cannot be changed');
  if (!Number.isInteger(stepNumber) || stepNumber < 1 || stepNumber > REQUIRED_BASELINE_STEPS)
    throw new Error('Invalid baseline step');
  const refs = [...new Set(evidenceRefs.map(x => x.trim()).filter(Boolean))];
  return {
    ...draft,
    steps: draft.steps.map(step => step.number === stepNumber
      ? {...step, evidenceRefs: refs, technicianAttested}
      : step),
  };
}

export function baselineReadyToFreeze(draft: BaselineDraft): boolean {
  return draft.steps.length === REQUIRED_BASELINE_STEPS &&
    draft.steps.every((step, i) =>
      step.number === i + 1 && step.technicianAttested && step.evidenceRefs.length > 0);
}

export function freezeBaseline(draft: BaselineDraft, timestamp: string): BaselineDraft {
  if (draft.frozenAt) throw new Error('Baseline already frozen');
  if (!baselineReadyToFreeze(draft)) throw new Error('All 14 evidence steps must be complete');
  if (!Number.isFinite(Date.parse(timestamp))) throw new Error('Invalid freeze timestamp');
  return {...draft, frozenAt: timestamp};
}
