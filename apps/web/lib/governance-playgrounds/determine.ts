import type {
  DeterminationInput,
  DeterminationOutput,
  GateResult,
  RouteDetermination,
  ScenarioRun,
} from "./types";

/**
 * TA-14 Governance-Specific Playgrounds
 * Deterministic route determination engine
 *
 * Governing principle:
 * No admissible evidence. No admissible execution.
 *
 * Precedence:
 * 1. DENY
 * 2. ESCALATE
 * 3. HOLD
 * 4. ALLOW
 *
 * This function does not replace a preserved bounded determination record.
 * It produces the canonical route outcome used to create that record.
 */

export const DETERMINATION_REASON_CODES = {
  PROHIBITED_CONDITION_PROVEN: "PROHIBITED_CONDITION_PROVEN",
  AUTHORITY_BOUNDARY_EXCEEDED: "AUTHORITY_BOUNDARY_EXCEEDED",
  MANDATORY_GATE_DENY_CONDITION: "MANDATORY_GATE_DENY_CONDITION",
  DESIGNATED_ESCALATION_PRESENT: "DESIGNATED_ESCALATION_PRESENT",
  GATE_ESCALATED: "GATE_ESCALATED",
  CONFLICTING_MATERIAL_EVIDENCE: "CONFLICTING_MATERIAL_EVIDENCE",
  MANDATORY_GATE_FAILED: "MANDATORY_GATE_FAILED",
  MANDATORY_GATE_UNRESOLVED: "MANDATORY_GATE_UNRESOLVED",
  MANDATORY_GATE_NOT_TESTED: "MANDATORY_GATE_NOT_TESTED",
  REQUIRED_SCENARIO_INCOMPLETE: "REQUIRED_SCENARIO_INCOMPLETE",
  REQUIRED_SCENARIO_FAILED_TO_RUN: "REQUIRED_SCENARIO_FAILED_TO_RUN",
  REQUIRED_SCENARIO_OUTCOME_MISMATCH:
    "REQUIRED_SCENARIO_OUTCOME_MISMATCH",
  MATERIAL_DRIFT_DETECTED: "MATERIAL_DRIFT_DETECTED",
  ALL_APPLICABLE_REQUIREMENTS_PASSED:
    "ALL_APPLICABLE_REQUIREMENTS_PASSED",
} as const;

export type DeterminationReasonCode =
  (typeof DETERMINATION_REASON_CODES)[keyof typeof DETERMINATION_REASON_CODES];

export interface DeterminationEvaluationOptions {
  /**
   * Gate IDs that contain a proven condition requiring immediate DENY.
   * This is separate from an ordinary FAIL because not every gate failure
   * establishes a prohibited execution condition.
   */
  denyGateIds?: readonly string[];

  /**
   * When true, advisory gate failures can contribute to HOLD.
   * Default behavior leaves advisory findings non-blocking.
   */
  advisoryFailuresBlock?: boolean;

  /**
   * When true, a conditional gate marked NOT_APPLICABLE is accepted.
   * Defaults to true.
   */
  acceptConditionalNotApplicable?: boolean;
}

export interface DeterminationEvaluationDetail {
  output: DeterminationOutput;
  blockingGateIds: string[];
  escalatedGateIds: string[];
  incompleteScenarioRunIds: string[];
  mismatchedScenarioRunIds: string[];
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function requiredGateResults(gateResults: GateResult[]): GateResult[] {
  return gateResults.filter(
    (result) =>
      result.requirementLevel === "MANDATORY" ||
      result.requirementLevel === "CONDITIONAL",
  );
}

function isScenarioComplete(run: ScenarioRun): boolean {
  return run.status === "COMPLETED" && Boolean(run.determination);
}

function expectedScenarioDeterminationMatches(run: ScenarioRun): boolean {
  /**
   * ScenarioRun intentionally does not duplicate the expected result from its
   * ScenarioDefinition. Until the caller provides that comparison upstream,
   * a completed run with a determination is treated as internally complete.
   *
   * A mismatch can be passed to this engine by setting the run status to
   * FAILED_TO_RUN or by omitting its determination. A later scenario registry
   * helper will perform definition-to-run comparison before this function.
   */
  return isScenarioComplete(run);
}

export function determineRouteOutcome(
  input: DeterminationInput,
  options: DeterminationEvaluationOptions = {},
): DeterminationOutput {
  return evaluateRouteOutcome(input, options).output;
}

export function evaluateRouteOutcome(
  input: DeterminationInput,
  options: DeterminationEvaluationOptions = {},
): DeterminationEvaluationDetail {
  const {
    gateResults,
    requiredScenarioRuns,
    prohibitedConditionProven,
    authorityBoundaryExceeded,
    designatedEscalationPresent,
    materialDriftDetected,
  } = input;

  const {
    denyGateIds = [],
    advisoryFailuresBlock = false,
    acceptConditionalNotApplicable = true,
  } = options;

  const reasonCodes: string[] = [];
  const blockingGateIds: string[] = [];
  const escalatedGateIds: string[] = [];
  const incompleteScenarioRunIds: string[] = [];
  const mismatchedScenarioRunIds: string[] = [];

  const requiredResults = requiredGateResults(gateResults);

  // 1. DENY precedence
  if (prohibitedConditionProven) {
    reasonCodes.push(
      DETERMINATION_REASON_CODES.PROHIBITED_CONDITION_PROVEN,
    );
  }

  if (authorityBoundaryExceeded) {
    reasonCodes.push(
      DETERMINATION_REASON_CODES.AUTHORITY_BOUNDARY_EXCEEDED,
    );
  }

  for (const gateResult of gateResults) {
    if (
      denyGateIds.includes(gateResult.gateId) &&
      gateResult.status === "FAIL"
    ) {
      blockingGateIds.push(gateResult.gateId);
      reasonCodes.push(
        DETERMINATION_REASON_CODES.MANDATORY_GATE_DENY_CONDITION,
      );
    }
  }

  if (
    prohibitedConditionProven ||
    authorityBoundaryExceeded ||
    blockingGateIds.some((gateId) => denyGateIds.includes(gateId))
  ) {
    return {
      output: {
        determination: "DENY",
        reasonCodes: unique(reasonCodes),
      },
      blockingGateIds: unique(blockingGateIds),
      escalatedGateIds,
      incompleteScenarioRunIds,
      mismatchedScenarioRunIds,
    };
  }

  // 2. ESCALATE precedence
  if (designatedEscalationPresent) {
    reasonCodes.push(
      DETERMINATION_REASON_CODES.DESIGNATED_ESCALATION_PRESENT,
    );
  }

  for (const gateResult of gateResults) {
    if (gateResult.status === "ESCALATED") {
      escalatedGateIds.push(gateResult.gateId);
      reasonCodes.push(DETERMINATION_REASON_CODES.GATE_ESCALATED);
    }

    if (
      gateResult.conflictingEvidenceIds.length > 0 &&
      gateResult.requirementLevel !== "ADVISORY"
    ) {
      escalatedGateIds.push(gateResult.gateId);
      reasonCodes.push(
        DETERMINATION_REASON_CODES.CONFLICTING_MATERIAL_EVIDENCE,
      );
    }
  }

  if (designatedEscalationPresent || escalatedGateIds.length > 0) {
    return {
      output: {
        determination: "ESCALATE",
        reasonCodes: unique(reasonCodes),
      },
      blockingGateIds,
      escalatedGateIds: unique(escalatedGateIds),
      incompleteScenarioRunIds,
      mismatchedScenarioRunIds,
    };
  }

  // 3. HOLD precedence
  for (const gateResult of gateResults) {
    const isBlockingRequirement =
      gateResult.requirementLevel === "MANDATORY" ||
      gateResult.requirementLevel === "CONDITIONAL" ||
      (advisoryFailuresBlock &&
        gateResult.requirementLevel === "ADVISORY");

    if (!isBlockingRequirement) {
      continue;
    }

    if (
      gateResult.requirementLevel === "CONDITIONAL" &&
      gateResult.status === "NOT_APPLICABLE" &&
      acceptConditionalNotApplicable
    ) {
      continue;
    }

    switch (gateResult.status) {
      case "FAIL":
        blockingGateIds.push(gateResult.gateId);
        reasonCodes.push(
          DETERMINATION_REASON_CODES.MANDATORY_GATE_FAILED,
        );
        break;
      case "UNRESOLVED":
        blockingGateIds.push(gateResult.gateId);
        reasonCodes.push(
          DETERMINATION_REASON_CODES.MANDATORY_GATE_UNRESOLVED,
        );
        break;
      case "NOT_TESTED":
        blockingGateIds.push(gateResult.gateId);
        reasonCodes.push(
          DETERMINATION_REASON_CODES.MANDATORY_GATE_NOT_TESTED,
        );
        break;
      case "NOT_APPLICABLE":
        if (gateResult.requirementLevel === "MANDATORY") {
          blockingGateIds.push(gateResult.gateId);
          reasonCodes.push(
            DETERMINATION_REASON_CODES.MANDATORY_GATE_UNRESOLVED,
          );
        }
        break;
      default:
        break;
    }
  }

  for (const run of requiredScenarioRuns) {
    if (!isScenarioComplete(run)) {
      incompleteScenarioRunIds.push(run.scenarioRunId);

      if (run.status === "FAILED_TO_RUN") {
        reasonCodes.push(
          DETERMINATION_REASON_CODES.REQUIRED_SCENARIO_FAILED_TO_RUN,
        );
      } else {
        reasonCodes.push(
          DETERMINATION_REASON_CODES.REQUIRED_SCENARIO_INCOMPLETE,
        );
      }

      continue;
    }

    if (!expectedScenarioDeterminationMatches(run)) {
      mismatchedScenarioRunIds.push(run.scenarioRunId);
      reasonCodes.push(
        DETERMINATION_REASON_CODES.REQUIRED_SCENARIO_OUTCOME_MISMATCH,
      );
    }
  }

  if (materialDriftDetected) {
    reasonCodes.push(
      DETERMINATION_REASON_CODES.MATERIAL_DRIFT_DETECTED,
    );
  }

  if (
    blockingGateIds.length > 0 ||
    incompleteScenarioRunIds.length > 0 ||
    mismatchedScenarioRunIds.length > 0 ||
    materialDriftDetected
  ) {
    return {
      output: {
        determination: "HOLD",
        reasonCodes: unique(reasonCodes),
      },
      blockingGateIds: unique(blockingGateIds),
      escalatedGateIds,
      incompleteScenarioRunIds: unique(incompleteScenarioRunIds),
      mismatchedScenarioRunIds: unique(mismatchedScenarioRunIds),
    };
  }

  // 4. ALLOW only when every applicable mandatory/conditional gate passes
  // and every required scenario is complete.
  const allRequiredGatesPassed = requiredResults.every((result) => {
    if (
      result.requirementLevel === "CONDITIONAL" &&
      result.status === "NOT_APPLICABLE" &&
      acceptConditionalNotApplicable
    ) {
      return true;
    }

    return result.status === "PASS";
  });

  if (!allRequiredGatesPassed) {
    return {
      output: {
        determination: "HOLD",
        reasonCodes: [
          DETERMINATION_REASON_CODES.MANDATORY_GATE_UNRESOLVED,
        ],
      },
      blockingGateIds: unique(
        requiredResults
          .filter((result) => result.status !== "PASS")
          .map((result) => result.gateId),
      ),
      escalatedGateIds,
      incompleteScenarioRunIds,
      mismatchedScenarioRunIds,
    };
  }

  return {
    output: {
      determination: "ALLOW",
      reasonCodes: [
        DETERMINATION_REASON_CODES.ALL_APPLICABLE_REQUIREMENTS_PASSED,
      ],
    },
    blockingGateIds: [],
    escalatedGateIds: [],
    incompleteScenarioRunIds: [],
    mismatchedScenarioRunIds: [],
  };
}

export function determinationRank(
  determination: RouteDetermination,
): number {
  switch (determination) {
    case "DENY":
      return 4;
    case "ESCALATE":
      return 3;
    case "HOLD":
      return 2;
    case "ALLOW":
      return 1;
  }
}

export function mostRestrictiveDetermination(
  determinations: readonly RouteDetermination[],
): RouteDetermination {
  if (determinations.length === 0) {
    return "HOLD";
  }

  return determinations.reduce<RouteDetermination>((mostRestrictive, next) =>
    determinationRank(next) > determinationRank(mostRestrictive)
      ? next
      : mostRestrictive,
  );
}
