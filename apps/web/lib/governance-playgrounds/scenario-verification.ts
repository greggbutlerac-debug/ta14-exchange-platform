import type {
  GateResultStatus,
  RouteDetermination,
  ScenarioDefinition,
  ScenarioRun,
} from "./types";

/**
 * TA-14 Governance-Specific Playgrounds
 * Scenario result verification
 *
 * This module compares an observed scenario run against the scenario
 * definition that governed the test. It does not determine the route outcome;
 * it verifies whether the scenario behaved as expected.
 */

export type ScenarioVerificationSeverity = "ERROR" | "WARNING";

export interface ScenarioVerificationIssue {
  severity: ScenarioVerificationSeverity;
  code: string;
  message: string;
  gateId?: string;
}

export interface ScenarioVerificationResult {
  valid: boolean;
  scenarioId: string;
  scenarioRunId: string;
  expectedDetermination: RouteDetermination;
  observedDetermination?: RouteDetermination;
  matchedGateIds: string[];
  mismatchedGateIds: string[];
  missingGateIds: string[];
  unexpectedGateIds: string[];
  issues: ScenarioVerificationIssue[];
}

function verificationIssue(
  severity: ScenarioVerificationSeverity,
  code: string,
  message: string,
  gateId?: string,
): ScenarioVerificationIssue {
  return {
    severity,
    code,
    message,
    gateId,
  };
}

function observedGateStatusById(
  run: ScenarioRun,
): ReadonlyMap<string, GateResultStatus> {
  return new Map(
    run.gateResults.map((gateResult) => [
      gateResult.gateId,
      gateResult.status,
    ]),
  );
}

export function verifyScenarioRun(
  definition: ScenarioDefinition,
  run: ScenarioRun,
): ScenarioVerificationResult {
  const issues: ScenarioVerificationIssue[] = [];
  const matchedGateIds: string[] = [];
  const mismatchedGateIds: string[] = [];
  const missingGateIds: string[] = [];
  const unexpectedGateIds: string[] = [];

  if (run.scenarioId !== definition.scenarioId) {
    issues.push(
      verificationIssue(
        "ERROR",
        "SCENARIO_ID_MISMATCH",
        `Scenario run "${run.scenarioRunId}" references "${run.scenarioId}" but was verified against "${definition.scenarioId}".`,
      ),
    );
  }

  if (run.status !== "COMPLETED") {
    issues.push(
      verificationIssue(
        "ERROR",
        "SCENARIO_RUN_INCOMPLETE",
        `Scenario run "${run.scenarioRunId}" has status "${run.status}" and cannot be treated as complete.`,
      ),
    );
  }

  if (!run.determination) {
    issues.push(
      verificationIssue(
        "ERROR",
        "SCENARIO_DETERMINATION_MISSING",
        `Scenario run "${run.scenarioRunId}" does not contain a determination.`,
      ),
    );
  } else if (run.determination !== definition.expectedDetermination) {
    issues.push(
      verificationIssue(
        "ERROR",
        "SCENARIO_DETERMINATION_MISMATCH",
        `Scenario "${definition.scenarioId}" expected "${definition.expectedDetermination}" but observed "${run.determination}".`,
      ),
    );
  }

  const observedStatuses = observedGateStatusById(run);
  const expectedEntries = Object.entries(
    definition.expectedGateStatuses,
  ) as Array<[string, GateResultStatus | undefined]>;

  for (const [gateId, expectedStatus] of expectedEntries) {
    if (!expectedStatus) {
      continue;
    }

    const observedStatus = observedStatuses.get(gateId);

    if (!observedStatus) {
      missingGateIds.push(gateId);
      issues.push(
        verificationIssue(
          "ERROR",
          "EXPECTED_GATE_RESULT_MISSING",
          `Scenario "${definition.scenarioId}" expected gate "${gateId}" to return "${expectedStatus}", but no result was observed.`,
          gateId,
        ),
      );
      continue;
    }

    if (observedStatus !== expectedStatus) {
      mismatchedGateIds.push(gateId);
      issues.push(
        verificationIssue(
          "ERROR",
          "EXPECTED_GATE_STATUS_MISMATCH",
          `Scenario "${definition.scenarioId}" expected gate "${gateId}" to return "${expectedStatus}", but observed "${observedStatus}".`,
          gateId,
        ),
      );
      continue;
    }

    matchedGateIds.push(gateId);
  }

  const expectedGateIds = new Set(
    expectedEntries
      .filter(([, expectedStatus]) => Boolean(expectedStatus))
      .map(([gateId]) => gateId),
  );

  for (const gateResult of run.gateResults) {
    if (!expectedGateIds.has(gateResult.gateId)) {
      unexpectedGateIds.push(gateResult.gateId);
      issues.push(
        verificationIssue(
          "WARNING",
          "UNDECLARED_GATE_RESULT",
          `Scenario run "${run.scenarioRunId}" returned gate "${gateResult.gateId}", but the scenario definition did not declare an expected status for that gate.`,
          gateResult.gateId,
        ),
      );
    }
  }

  const duplicateObservedGateIds = run.gateResults
    .map((gateResult) => gateResult.gateId)
    .filter(
      (gateId, index, allGateIds) =>
        allGateIds.indexOf(gateId) !== index,
    );

  for (const gateId of [...new Set(duplicateObservedGateIds)]) {
    issues.push(
      verificationIssue(
        "ERROR",
        "DUPLICATE_OBSERVED_GATE_RESULT",
        `Scenario run "${run.scenarioRunId}" contains more than one result for gate "${gateId}".`,
        gateId,
      ),
    );
  }

  return {
    valid: !issues.some((item) => item.severity === "ERROR"),
    scenarioId: definition.scenarioId,
    scenarioRunId: run.scenarioRunId,
    expectedDetermination: definition.expectedDetermination,
    observedDetermination: run.determination,
    matchedGateIds,
    mismatchedGateIds,
    missingGateIds,
    unexpectedGateIds,
    issues,
  };
}

export function verifyRequiredScenarioRuns(
  definitions: readonly ScenarioDefinition[],
  runs: readonly ScenarioRun[],
): ScenarioVerificationResult[] {
  const runByScenarioId = new Map(
    runs.map((run) => [run.scenarioId, run]),
  );

  return definitions
    .filter((definition) => definition.required)
    .map((definition) => {
      const run = runByScenarioId.get(definition.scenarioId);

      if (run) {
        return verifyScenarioRun(definition, run);
      }

      return {
        valid: false,
        scenarioId: definition.scenarioId,
        scenarioRunId: "",
        expectedDetermination: definition.expectedDetermination,
        observedDetermination: undefined,
        matchedGateIds: [],
        mismatchedGateIds: [],
        missingGateIds: Object.keys(
          definition.expectedGateStatuses,
        ),
        unexpectedGateIds: [],
        issues: [
          verificationIssue(
            "ERROR",
            "REQUIRED_SCENARIO_RUN_MISSING",
            `Required scenario "${definition.scenarioId}" has not been run.`,
          ),
        ],
      };
    });
}

export function allRequiredScenarioRunsValid(
  definitions: readonly ScenarioDefinition[],
  runs: readonly ScenarioRun[],
): boolean {
  return verifyRequiredScenarioRuns(definitions, runs).every(
    (result) => result.valid,
  );
}
