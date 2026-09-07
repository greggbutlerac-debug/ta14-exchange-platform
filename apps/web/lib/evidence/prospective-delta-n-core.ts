export type StandingFact = {
  id: string;
  required: boolean;
  current: boolean;
  supported: boolean;
  contradicted?: boolean;
};

export type StandingInput = {
  consequenceId: string;
  authorityCurrent: boolean;
  facts: StandingFact[];
};

export type StandingResult = {
  consequenceId: string;
  determination: "ALLOW" | "HOLD" | "DENY";
  presentStandingEstablished: boolean;
  failedFacts: string[];
  rule: string;
};

/**
 * TA-14 prospective Delta-N core.
 *
 * FROZEN PROPERTY:
 * Historical standing is never inherited into a later execution boundary.
 * The engine does not classify or enumerate failure modes. It evaluates only
 * whether the requirements for the proposed consequence have current support
 * at the moment standing is requested.
 *
 * This file is intentionally failure-mode agnostic. Later adversarial vectors
 * must not require a code change here to affect the determination.
 */
export function evaluatePresentStanding(input: StandingInput): StandingResult {
  if (!input.authorityCurrent) {
    return {
      consequenceId: input.consequenceId,
      determination: "DENY",
      presentStandingEstablished: false,
      failedFacts: ["authority.current"],
      rule: "Present authority is required at the execution boundary.",
    };
  }

  const failedFacts = input.facts
    .filter((fact) => fact.required)
    .filter((fact) => !fact.current || !fact.supported || fact.contradicted === true)
    .map((fact) => fact.id);

  if (failedFacts.length > 0) {
    return {
      consequenceId: input.consequenceId,
      determination: "HOLD",
      presentStandingEstablished: false,
      failedFacts,
      rule: "Historical admissibility does not establish present standing; every required fact must remain current, supported, and non-contradicted.",
    };
  }

  return {
    consequenceId: input.consequenceId,
    determination: "ALLOW",
    presentStandingEstablished: true,
    failedFacts: [],
    rule: "All required present-standing conditions remain established.",
  };
}

export const FROZEN_PROPOSITION = {
  id: "TA14-PDN-R1-P01",
  statement:
    "For the same proposed consequence, a later material change need not be pre-enumerated as a failure mode. If that change causes any required present-standing fact to become stale, unsupported, contradicted, or causes authority to cease, the unchanged evaluator will not inherit T0 standing into Tn.",
  falsifier:
    "After the evaluator is frozen, introduce a material Delta-N not named in this implementation. The proposition is falsified if the unchanged evaluator returns ALLOW at Tn while any required present-standing fact is stale, unsupported, contradicted, or authority is no longer current.",
  boundary:
    "This proves structural present-standing re-evaluation over governed observable inputs. It does not claim clairvoyant detection of a change that leaves no representation in any governed evidence surface.",
} as const;
