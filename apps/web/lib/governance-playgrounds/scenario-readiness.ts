import { evaluateRouteOutcome, type DeterminationEvaluationDetail, type DeterminationEvaluationOptions } from "./determine";
import { verifyRequiredScenarioRuns, type ScenarioVerificationResult } from "./scenario-verification";
import type { DeterminationInput, ScenarioDefinition, ScenarioRun } from "./types";

export interface VerifiedRouteOutcome {
  evaluation: DeterminationEvaluationDetail;
  scenarioVerification: readonly ScenarioVerificationResult[];
}

/**
 * Canonical readiness adapter for determination paths that depend on required
 * scenarios. Scenario completion alone is never sufficient: every required
 * run is recomputed against its frozen definition before route evaluation.
 * Invalid or ambiguous required runs are converted to FAILED_TO_RUN so the
 * determination engine fails closed to HOLD.
 */
export function evaluateVerifiedRouteOutcome(
  input: DeterminationInput,
  scenarioDefinitions: readonly ScenarioDefinition[],
  options: DeterminationEvaluationOptions = {},
): VerifiedRouteOutcome {
  const scenarioVerification = verifyRequiredScenarioRuns(
    scenarioDefinitions,
    input.requiredScenarioRuns,
  );

  const verificationByScenarioId = new Map(
    scenarioVerification.map((result) => [result.scenarioId, result]),
  );

  const hardenedRuns: ScenarioRun[] = input.requiredScenarioRuns.map((run) => {
    const verification = verificationByScenarioId.get(run.scenarioId);

    if (!verification || !verification.valid) {
      return {
        ...run,
        status: "FAILED_TO_RUN",
        determination: undefined,
        error: verification
          ? verification.issues.map((issue) => issue.code).join(",")
          : "REQUIRED_SCENARIO_NOT_VERIFIED",
      };
    }

    return run;
  });

  // Required definitions with no corresponding run are represented explicitly
  // so the base determination engine cannot overlook their absence.
  for (const verification of scenarioVerification) {
    if (
      !verification.valid &&
      !hardenedRuns.some((run) => run.scenarioId === verification.scenarioId)
    ) {
      hardenedRuns.push({
        scenarioRunId: `missing:${verification.scenarioId}`,
        scenarioId: verification.scenarioId,
        routeId: "UNRESOLVED_ROUTE",
        status: "FAILED_TO_RUN",
        injectionsApplied: [],
        gateResults: [],
        error: verification.issues.map((issue) => issue.code).join(","),
      });
    }
  }

  return {
    evaluation: evaluateRouteOutcome(
      { ...input, requiredScenarioRuns: hardenedRuns },
      options,
    ),
    scenarioVerification,
  };
}
