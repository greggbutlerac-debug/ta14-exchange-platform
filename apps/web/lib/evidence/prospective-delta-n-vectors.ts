import { evaluatePresentStanding, FROZEN_PROPOSITION, StandingInput } from "./prospective-delta-n-core";

/**
 * Added AFTER the generic evaluator was frozen at commit
 * 3b2a1990be32c5ddbe42b8da4387bdac088a86c7.
 *
 * The evaluator is not edited to recognize these scenario names or failure
 * modes. Each Delta-N is expressed only through its effect on governed facts.
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

const deltaN = [
  {
    id: "DN-01",
    label: "Unmodeled dependency withdrawal",
    input: {
      ...t0,
      facts: t0.facts.map((f) =>
        f.id === "dependency.availability" ? { ...f, supported: false } : f,
      ),
    },
    expected: "HOLD",
  },
  {
    id: "DN-02",
    label: "Unmodeled target-identity contradiction",
    input: {
      ...t0,
      facts: t0.facts.map((f) =>
        f.id === "target.identity" ? { ...f, contradicted: true } : f,
      ),
    },
    expected: "HOLD",
  },
  {
    id: "DN-03",
    label: "Unmodeled environmental evidence staleness",
    input: {
      ...t0,
      facts: t0.facts.map((f) =>
        f.id === "environment.constraint" ? { ...f, current: false } : f,
      ),
    },
    expected: "HOLD",
  },
  {
    id: "DN-04",
    label: "Unmodeled authority withdrawal",
    input: { ...t0, authorityCurrent: false },
    expected: "DENY",
  },
] as const;

export const prospectiveDeltaNRecord = {
  id: "TA14-PDN-R1",
  title: "Prospective Delta-N Structural Falsification Record",
  frozenEvaluatorCommit: "3b2a1990be32c5ddbe42b8da4387bdac088a86c7",
  proposition: FROZEN_PROPOSITION,
  baseline: {
    time: "T0",
    input: t0,
    result: evaluatePresentStanding(t0),
  },
  trials: deltaN.map((trial) => ({
    id: trial.id,
    label: trial.label,
    expected: trial.expected,
    result: evaluatePresentStanding(trial.input),
    pass: evaluatePresentStanding(trial.input).determination === trial.expected,
  })),
};

export function verifyProspectiveDeltaNRecord() {
  const baselinePass = prospectiveDeltaNRecord.baseline.result.determination === "ALLOW";
  const trialsPass = prospectiveDeltaNRecord.trials.every((trial) => trial.pass);
  return {
    baselinePass,
    trialsPass,
    determination: baselinePass && trialsPass ? "SUPPORTED" : "FALSIFIED",
  } as const;
}
