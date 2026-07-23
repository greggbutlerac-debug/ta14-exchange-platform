import {
  GOVERNANCE_PLAYGROUND_BY_LANE,
  SHARED_GATE_BY_ID,
  type GovernanceLaneId,
  type LaneDefinition,
  type ScenarioDefinition,
} from ".";

/**
 * TA-14 Governance-Specific Playgrounds
 * Configuration validation
 *
 * This validator is intentionally dependency-free so it can run during
 * typecheck, tests, build tooling, server startup, or future CI verification.
 */

export type ValidationSeverity = "ERROR" | "WARNING";

export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  message: string;
  path?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

function issue(
  severity: ValidationSeverity,
  code: string,
  message: string,
  path?: string,
): ValidationIssue {
  return { severity, code, message, path };
}

function duplicateValues(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    } else {
      seen.add(value);
    }
  }

  return [...duplicates];
}

function validateScenario(
  lane: LaneDefinition,
  scenario: ScenarioDefinition,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const basePath = `scenarios.${scenario.scenarioId}`;

  if (scenario.laneId !== lane.laneId) {
    issues.push(
      issue(
        "ERROR",
        "SCENARIO_LANE_MISMATCH",
        `Scenario "${scenario.scenarioId}" belongs to "${scenario.laneId}" but is registered under "${lane.laneId}".`,
        `${basePath}.laneId`,
      ),
    );
  }

  if (!scenario.title.trim()) {
    issues.push(
      issue(
        "ERROR",
        "SCENARIO_TITLE_REQUIRED",
        `Scenario "${scenario.scenarioId}" must have a title.`,
        `${basePath}.title`,
      ),
    );
  }

  if (!scenario.description.trim()) {
    issues.push(
      issue(
        "ERROR",
        "SCENARIO_DESCRIPTION_REQUIRED",
        `Scenario "${scenario.scenarioId}" must have a description.`,
        `${basePath}.description`,
      ),
    );
  }

  for (const gateId of Object.keys(scenario.expectedGateStatuses)) {
    if (!(gateId in SHARED_GATE_BY_ID)) {
      issues.push(
        issue(
          "ERROR",
          "SCENARIO_UNKNOWN_GATE",
          `Scenario "${scenario.scenarioId}" references unknown gate "${gateId}".`,
          `${basePath}.expectedGateStatuses.${gateId}`,
        ),
      );
      continue;
    }

    if (!lane.gateIds.includes(gateId)) {
      issues.push(
        issue(
          "ERROR",
          "SCENARIO_GATE_NOT_IN_LANE",
          `Scenario "${scenario.scenarioId}" references gate "${gateId}", but the lane does not include that gate.`,
          `${basePath}.expectedGateStatuses.${gateId}`,
        ),
      );
    }
  }

  const duplicateInjectionIds = duplicateValues(
    scenario.injections.map((injection) => injection.injectionId),
  );

  for (const injectionId of duplicateInjectionIds) {
    issues.push(
      issue(
        "ERROR",
        "DUPLICATE_INJECTION_ID",
        `Scenario "${scenario.scenarioId}" contains duplicate injection ID "${injectionId}".`,
        `${basePath}.injections`,
      ),
    );
  }

  if (
    scenario.scenarioClass === "BASELINE" &&
    scenario.injections.length > 0
  ) {
    issues.push(
      issue(
        "WARNING",
        "BASELINE_HAS_INJECTIONS",
        `Baseline scenario "${scenario.scenarioId}" contains failure injections.`,
        `${basePath}.injections`,
      ),
    );
  }

  if (
    scenario.scenarioClass !== "BASELINE" &&
    scenario.scenarioClass !== "RECOVERY" &&
    scenario.injections.length === 0
  ) {
    issues.push(
      issue(
        "WARNING",
        "FAILURE_SCENARIO_WITHOUT_INJECTION",
        `Scenario "${scenario.scenarioId}" is classified as "${scenario.scenarioClass}" but has no injections.`,
        `${basePath}.injections`,
      ),
    );
  }

  if (
    scenario.expectedDetermination === "ALLOW" &&
    Object.values(scenario.expectedGateStatuses).some((status) =>
      ["FAIL", "UNRESOLVED", "ESCALATED", "NOT_TESTED"].includes(status),
    )
  ) {
    issues.push(
      issue(
        "ERROR",
        "ALLOW_SCENARIO_HAS_BLOCKING_GATE",
        `Scenario "${scenario.scenarioId}" expects ALLOW while one or more expected gate statuses are blocking.`,
        `${basePath}.expectedDetermination`,
      ),
    );
  }

  return issues;
}

export function validateLaneDefinition(
  lane: LaneDefinition,
  scenarios: readonly ScenarioDefinition[] = [],
): ValidationResult {
  const issues: ValidationIssue[] = [];

  const registryEntry =
    GOVERNANCE_PLAYGROUND_BY_LANE[lane.laneId as GovernanceLaneId];

  if (!registryEntry) {
    issues.push(
      issue(
        "ERROR",
        "LANE_NOT_REGISTERED",
        `Lane "${lane.laneId}" does not exist in the governance playground registry.`,
        "laneId",
      ),
    );
  } else if (registryEntry.enabled !== lane.enabled) {
    issues.push(
      issue(
        "WARNING",
        "LANE_ENABLED_STATE_MISMATCH",
        `Lane "${lane.laneId}" has enabled=${lane.enabled}, but the navigation registry has enabled=${registryEntry.enabled}.`,
        "enabled",
      ),
    );
  }

  if (!lane.name.trim()) {
    issues.push(
      issue(
        "ERROR",
        "LANE_NAME_REQUIRED",
        "Lane name is required.",
        "name",
      ),
    );
  }

  if (!lane.description.trim()) {
    issues.push(
      issue(
        "ERROR",
        "LANE_DESCRIPTION_REQUIRED",
        "Lane description is required.",
        "description",
      ),
    );
  }

  if (!lane.version.trim()) {
    issues.push(
      issue(
        "ERROR",
        "LANE_VERSION_REQUIRED",
        "Lane version is required.",
        "version",
      ),
    );
  }

  if (lane.claimsGoverned.length === 0) {
    issues.push(
      issue(
        "ERROR",
        "LANE_CLAIMS_REQUIRED",
        `Lane "${lane.laneId}" must declare at least one governed claim.`,
        "claimsGoverned",
      ),
    );
  }

  if (lane.nonClaims.length === 0) {
    issues.push(
      issue(
        "ERROR",
        "LANE_NON_CLAIMS_REQUIRED",
        `Lane "${lane.laneId}" must declare at least one explicit non-claim.`,
        "nonClaims",
      ),
    );
  }

  const duplicateGateIds = duplicateValues(lane.gateIds);

  for (const gateId of duplicateGateIds) {
    issues.push(
      issue(
        "ERROR",
        "DUPLICATE_GATE_ID",
        `Lane "${lane.laneId}" contains duplicate gate "${gateId}".`,
        "gateIds",
      ),
    );
  }

  for (const gateId of lane.gateIds) {
    const gate = SHARED_GATE_BY_ID[gateId as keyof typeof SHARED_GATE_BY_ID];

    if (!gate) {
      issues.push(
        issue(
          "ERROR",
          "UNKNOWN_GATE_ID",
          `Lane "${lane.laneId}" references unknown gate "${gateId}".`,
          "gateIds",
        ),
      );
      continue;
    }

    if (!gate.applicableLanes.includes(lane.laneId)) {
      issues.push(
        issue(
          "ERROR",
          "GATE_NOT_APPLICABLE_TO_LANE",
          `Gate "${gateId}" does not declare lane "${lane.laneId}" as applicable.`,
          "gateIds",
        ),
      );
    }
  }

  const duplicateSectionIds = duplicateValues(
    lane.sections.map((section) => section.sectionId),
  );

  for (const sectionId of duplicateSectionIds) {
    issues.push(
      issue(
        "ERROR",
        "DUPLICATE_SECTION_ID",
        `Lane "${lane.laneId}" contains duplicate section ID "${sectionId}".`,
        "sections",
      ),
    );
  }

  const sectionOrders = lane.sections.map((section) =>
    String(section.order),
  );

  for (const order of duplicateValues(sectionOrders)) {
    issues.push(
      issue(
        "WARNING",
        "DUPLICATE_SECTION_ORDER",
        `Lane "${lane.laneId}" contains multiple sections with order ${order}.`,
        "sections",
      ),
    );
  }

  const allFieldKeys = lane.sections.flatMap((section) =>
    section.fields.map((field) => field.key),
  );

  for (const fieldKey of duplicateValues(allFieldKeys)) {
    issues.push(
      issue(
        "ERROR",
        "DUPLICATE_FIELD_KEY",
        `Lane "${lane.laneId}" contains duplicate field key "${fieldKey}".`,
        "sections",
      ),
    );
  }

  for (const section of lane.sections) {
    if (!section.title.trim()) {
      issues.push(
        issue(
          "ERROR",
          "SECTION_TITLE_REQUIRED",
          `Section "${section.sectionId}" must have a title.`,
          `sections.${section.sectionId}.title`,
        ),
      );
    }

    if (section.fields.length === 0) {
      issues.push(
        issue(
          "WARNING",
          "SECTION_WITHOUT_FIELDS",
          `Section "${section.sectionId}" has no fields.`,
          `sections.${section.sectionId}.fields`,
        ),
      );
    }

    for (const field of section.fields) {
      if (!field.label.trim()) {
        issues.push(
          issue(
            "ERROR",
            "FIELD_LABEL_REQUIRED",
            `Field "${field.key}" must have a label.`,
            `sections.${section.sectionId}.fields.${field.key}.label`,
          ),
        );
      }

      if (
        (field.type === "select" ||
          field.type === "multiselect") &&
        (!field.options || field.options.length === 0)
      ) {
        issues.push(
          issue(
            "ERROR",
            "SELECT_OPTIONS_REQUIRED",
            `Field "${field.key}" requires at least one option.`,
            `sections.${section.sectionId}.fields.${field.key}.options`,
          ),
        );
      }
    }
  }

  const duplicateEvidenceTypes = duplicateValues(lane.evidenceTypes);

  for (const evidenceType of duplicateEvidenceTypes) {
    issues.push(
      issue(
        "ERROR",
        "DUPLICATE_EVIDENCE_TYPE",
        `Lane "${lane.laneId}" contains duplicate evidence type "${evidenceType}".`,
        "evidenceTypes",
      ),
    );
  }

  const duplicateScenarioIds = duplicateValues(lane.scenarioIds);

  for (const scenarioId of duplicateScenarioIds) {
    issues.push(
      issue(
        "ERROR",
        "DUPLICATE_SCENARIO_ID",
        `Lane "${lane.laneId}" contains duplicate scenario ID "${scenarioId}".`,
        "scenarioIds",
      ),
    );
  }

  const scenarioById = new Map(
    scenarios.map((scenario) => [scenario.scenarioId, scenario]),
  );

  for (const scenarioId of lane.scenarioIds) {
    if (!scenarioById.has(scenarioId)) {
      issues.push(
        issue(
          "ERROR",
          "SCENARIO_DEFINITION_MISSING",
          `Lane "${lane.laneId}" references missing scenario "${scenarioId}".`,
          "scenarioIds",
        ),
      );
    }
  }

  for (const scenario of scenarios) {
    if (!lane.scenarioIds.includes(scenario.scenarioId)) {
      issues.push(
        issue(
          "WARNING",
          "SCENARIO_NOT_REGISTERED_IN_LANE",
          `Scenario "${scenario.scenarioId}" exists but is not listed in lane.scenarioIds.`,
          `scenarios.${scenario.scenarioId}`,
        ),
      );
    }

    issues.push(...validateScenario(lane, scenario));
  }

  const requiredScenarioCount = scenarios.filter(
    (scenario) => scenario.required,
  ).length;

  if (lane.enabled && requiredScenarioCount === 0) {
    issues.push(
      issue(
        "ERROR",
        "ENABLED_LANE_REQUIRES_SCENARIOS",
        `Enabled lane "${lane.laneId}" must include at least one required scenario.`,
        "scenarioIds",
      ),
    );
  }

  return {
    valid: !issues.some((validationIssue) =>
      validationIssue.severity === "ERROR",
    ),
    issues,
  };
}

export function assertValidLaneDefinition(
  lane: LaneDefinition,
  scenarios: readonly ScenarioDefinition[] = [],
): void {
  const result = validateLaneDefinition(lane, scenarios);

  if (result.valid) {
    return;
  }

  const formattedIssues = result.issues
    .filter((validationIssue) =>
      validationIssue.severity === "ERROR",
    )
    .map(
      (validationIssue) =>
        `${validationIssue.code}: ${validationIssue.message}`,
    )
    .join("\n");

  throw new Error(
    `Invalid governance playground lane "${lane.laneId}":\n${formattedIssues}`,
  );
}
