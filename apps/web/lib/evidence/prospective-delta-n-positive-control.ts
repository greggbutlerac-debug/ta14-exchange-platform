import { evaluatePresentStanding, StandingInput } from "./prospective-delta-n-core";
import { STANDING_PRESERVING_CONTROL_SPEC } from "./prospective-delta-n-positive-control-spec";

/**
 * Concrete control vector added only AFTER the control proposition, scope,
 * materiality rule, expected determination and falsifier were frozen at commit
 * e5b0121d80a2bae0f8eca424a63ec3c26eca31f9.
 *
 * The original evaluator remains untouched.
 */
const t0: StandingInput = {
  consequenceId: "SAME-CONSEQUENCE-001",
  authorityCurrent: true,
  facts: [
    { id: "target.identity", required: true, current: true, supported: true },
    { id: "environment.constraint", required: true, current: true, supported: true },
    { id: "dependency.availability", required: true, current: true, supported: true },
  ],
};

/**
 * PC-01 material Delta-N:
 * A governed environmental context update occurs before commit and therefore
 * forces re-evaluation. The updated evidence establishes that the changed
 * condition remains inside the already-declared admissible environmental
 * constraint. The required fact is therefore still current, supported and
 * non-contradicted. Authority, target identity and dependency availability
 * also remain current.
 *
 * The frozen evaluator receives the Tn standing state only. It has no code for
 * this scenario and no special-case path that preserves ALLOW.
 */
const tn: StandingInput = {
  consequenceId: "SAME-CONSEQUENCE-001",
  authorityCurrent: true,
  facts: [
    { id: "target.identity", required: true, current: true, supported: true },
    { id: "environment.constraint", required: true, current: true, supported: true },
    { id: "dependency.availability", required: true, current: true, supported: true },
    { id: "deltaN.environment-context-updated-within-bound", required: false, current: true, supported: true },
  ],
};

const baselineResult = evaluatePresentStanding(t0);
const result = evaluatePresentStanding(tn);

export const standingPreservingDeltaNControl = {
  id: "PC-01",
  title: "Material environmental context change remains inside admissible bound",
  controlSpecification: STANDING_PRESERVING_CONTROL_SPEC,
  controlSpecificationFreezeCommit: "e5b0121d80a2bae0f8eca424a63ec3c26eca31f9",
  frozenEvaluatorCommit: STANDING_PRESERVING_CONTROL_SPEC.frozenEvaluatorCommit,
  baseline: { time: "T0", input: t0, result: baselineResult },
  deltaN: {
    time: "TN",
    material: true,
    representation: "deltaN.environment-context-updated-within-bound",
    explanation: "The governed environmental context changed and required re-evaluation, but refreshed evidence established that the changed condition remained inside the declared admissible constraint; no required present-standing condition was defeated.",
    input: tn,
  },
  expected: STANDING_PRESERVING_CONTROL_SPEC.expectedDetermination,
  result,
  pass:
    baselineResult.determination === "ALLOW" &&
    result.determination === "ALLOW" &&
    result.presentStandingEstablished === true &&
    result.failedFacts.length === 0,
} as const;
