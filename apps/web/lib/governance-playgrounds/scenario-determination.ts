import {
  evaluateRouteOutcome,
  type DeterminationEvaluationDetail,
  type DeterminationEvaluationOptions,
} from "./determine";
import type {
  GateResult,
  GateResultStatus,
} from "./types";

/**
 * TA-14 Governance-Specific Playgrounds
 * Gate-result to route-determination adapter
 *
 * This module converts observed gate results into the canonical
 * deterministic route outcome. It does not compare a run against a
 * scenario's expected result; scenario-verification remains responsible
 * for that separate question.
 */

export interface GateDeterminationContext {
  prohibitedConditionProven?: boolean;
  authorityBoundaryExceeded?: boolean;
  designatedEscalationPresent?: boolean;
  materialDriftDetected?: boolean;
}

export interface GateDeterminationOptions
  extends DeterminationEvaluationOptions {
  /**
   * When true, a failed gate named in denyGateIds produces DENY.
   * Other mandatory or conditional failures produce HOLD.
   */
  denyGateIds?: readonly string[];
}

export interface GateStatusCount {
  status: GateResultStatus;
  count: number;
}

export interface GateDeterminationResult
  extends DeterminationEvaluationDetail {
  gateStatusCounts: readonly GateStatusCount[];
}

const GATE_RESULT_STATUS_ORDER: readonly GateResultStatus[] = [
  "PASS",
  "FAIL",
  "UNRESOLVED",
  "ESCALATED",
  "NOT_APPLICABLE",
  "NOT_TESTED",
];

export function countGateResultStatuses(
  gateResults: readonly GateResult[],
): GateStatusCount[] {
  return GATE_RESULT_STATUS_ORDER.map((status) => ({
    status,
    count: gateResults.filter(
      (result) => result.status === status,
    ).length,
  }));
}

export function determineFromGateResults(
  gateResults: readonly GateResult[],
  context: GateDeterminationContext = {},
  options: GateDeterminationOptions = {},
): GateDeterminationResult {
  const {
    prohibitedConditionProven = false,
    authorityBoundaryExceeded = false,
    designatedEscalationPresent = false,
    materialDriftDetected = false,
  } = context;

  const evaluation = evaluateRouteOutcome(
    {
      gateResults,
      requiredScenarioRuns: [],
      prohibitedConditionProven,
      authorityBoundaryExceeded,
      designatedEscalationPresent,
      materialDriftDetected,
    },
    options,
  );

  return {
    ...evaluation,
    gateStatusCounts: countGateResultStatuses(gateResults),
  };
}

export function determineFromGateStatusMap(
  gateResults: readonly GateResult[],
  context: GateDeterminationContext = {},
  options: GateDeterminationOptions = {},
): GateDeterminationResult {
  return determineFromGateResults(
    gateResults,
    context,
    options,
  );
}
