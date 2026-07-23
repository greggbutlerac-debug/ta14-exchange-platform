import type {
  JsonValue,
  RouteDetermination,
  ScenarioId,
  ScenarioRun,
} from "./types";
import type {
  ScenarioVerificationIssue,
  ScenarioVerificationResult,
} from "./scenario-verification";

export const SCENARIO_RUN_STORAGE_PREFIX =
  "ta14:governance-scenario-runs";

export const SCENARIO_RUN_SCHEMA_VERSION = "1.0.0";

export interface StoredScenarioRun {
  schemaVersion: string;
  storedRunId: string;
  laneId: string;
  laneVersion: string;
  routeDraftId?: string;
  routeTitle?: string;
  scenarioId: ScenarioId;
  scenarioTitle: string;
  expectedDetermination: RouteDetermination;
  observedDetermination: RouteDetermination;
  scenarioRun: ScenarioRun;
  verification: ScenarioVerificationResult;
  metadata: Readonly<Record<string, JsonValue>>;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioRunSummary {
  storedRunId: string;
  laneId: string;
  routeDraftId?: string;
  routeTitle?: string;
  scenarioId: ScenarioId;
  scenarioTitle: string;
  expectedDetermination: RouteDetermination;
  observedDetermination: RouteDetermination;
  valid: boolean;
  issueCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoredScenarioRunInput {
  laneId: string;
  laneVersion: string;
  routeDraftId?: string;
  routeTitle?: string;
  scenarioTitle: string;
  expectedDetermination: RouteDetermination;
  scenarioRun: ScenarioRun;
  verification: ScenarioVerificationResult;
  metadata?: Readonly<Record<string, JsonValue>>;
}

export interface ScenarioRunImportResult {
  success: boolean;
  run?: StoredScenarioRun;
  issues: readonly string[];
}

function storageKey(laneId: string, storedRunId: string): string {
  return `${SCENARIO_RUN_STORAGE_PREFIX}:${laneId}:${storedRunId}`;
}

function lanePrefix(laneId: string): string {
  return `${SCENARIO_RUN_STORAGE_PREFIX}:${laneId}:`;
}

function createId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    "randomUUID" in globalThis.crypto
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `scenario-run-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isVerificationIssue(
  value: unknown,
): value is ScenarioVerificationIssue {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ScenarioVerificationIssue>;

  return (
    typeof candidate.code === "string" &&
    typeof candidate.message === "string" &&
    typeof candidate.severity === "string"
  );
}

function isVerificationResult(
  value: unknown,
): value is ScenarioVerificationResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate =
    value as Partial<ScenarioVerificationResult>;

  return (
    typeof candidate.valid === "boolean" &&
    Array.isArray(candidate.issues) &&
    candidate.issues.every(isVerificationIssue) &&
    Array.isArray(candidate.matchedGateIds) &&
    Array.isArray(candidate.mismatchedGateIds) &&
    Array.isArray(candidate.missingGateIds) &&
    Array.isArray(candidate.unexpectedGateIds)
  );
}

function isStoredScenarioRun(
  value: unknown,
): value is StoredScenarioRun {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<StoredScenarioRun>;

  return (
    typeof candidate.schemaVersion === "string" &&
    typeof candidate.storedRunId === "string" &&
    typeof candidate.laneId === "string" &&
    typeof candidate.laneVersion === "string" &&
    typeof candidate.scenarioId === "string" &&
    typeof candidate.scenarioTitle === "string" &&
    typeof candidate.expectedDetermination === "string" &&
    typeof candidate.observedDetermination === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    !!candidate.scenarioRun &&
    isVerificationResult(candidate.verification)
  );
}

export function createStoredScenarioRun(
  input: CreateStoredScenarioRunInput,
): StoredScenarioRun {
  const timestamp = new Date().toISOString();
  const observedDetermination =
    input.scenarioRun.determination;

  if (!observedDetermination) {
    throw new Error(
      "A stored scenario run requires an observed determination.",
    );
  }

  return {
    schemaVersion: SCENARIO_RUN_SCHEMA_VERSION,
    storedRunId: createId(),
    laneId: input.laneId,
    laneVersion: input.laneVersion,
    routeDraftId: input.routeDraftId,
    routeTitle: input.routeTitle,
    scenarioId: input.scenarioRun.scenarioId,
    scenarioTitle: input.scenarioTitle,
    expectedDetermination: input.expectedDetermination,
    observedDetermination,
    scenarioRun: input.scenarioRun,
    verification: input.verification,
    metadata: input.metadata ?? {},
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function saveStoredScenarioRun(
  run: StoredScenarioRun,
): StoredScenarioRun {
  const updatedRun: StoredScenarioRun = {
    ...run,
    schemaVersion: SCENARIO_RUN_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  };

  if (isBrowser()) {
    window.localStorage.setItem(
      storageKey(updatedRun.laneId, updatedRun.storedRunId),
      JSON.stringify(updatedRun),
    );
  }

  return updatedRun;
}

export function loadStoredScenarioRun(
  laneId: string,
  storedRunId: string,
): StoredScenarioRun | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  const raw = window.localStorage.getItem(
    storageKey(laneId, storedRunId),
  );

  if (!raw) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    return isStoredScenarioRun(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function listStoredScenarioRuns(
  laneId: string,
): ScenarioRunSummary[] {
  if (!isBrowser()) {
    return [];
  }

  const prefix = lanePrefix(laneId);
  const summaries: ScenarioRunSummary[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (!key || !key.startsWith(prefix)) {
      continue;
    }

    const raw = window.localStorage.getItem(key);

    if (!raw) {
      continue;
    }

    try {
      const parsed: unknown = JSON.parse(raw);

      if (!isStoredScenarioRun(parsed)) {
        continue;
      }

      summaries.push({
        storedRunId: parsed.storedRunId,
        laneId: parsed.laneId,
        routeDraftId: parsed.routeDraftId,
        routeTitle: parsed.routeTitle,
        scenarioId: parsed.scenarioId,
        scenarioTitle: parsed.scenarioTitle,
        expectedDetermination:
          parsed.expectedDetermination,
        observedDetermination:
          parsed.observedDetermination,
        valid: parsed.verification.valid,
        issueCount: parsed.verification.issues.length,
        createdAt: parsed.createdAt,
        updatedAt: parsed.updatedAt,
      });
    } catch {
      continue;
    }
  }

  return summaries.sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

export function deleteStoredScenarioRun(
  laneId: string,
  storedRunId: string,
): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(
    storageKey(laneId, storedRunId),
  );
}

export function clearStoredScenarioRuns(
  laneId: string,
): number {
  if (!isBrowser()) {
    return 0;
  }

  const prefix = lanePrefix(laneId);
  const keys: string[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (key?.startsWith(prefix)) {
      keys.push(key);
    }
  }

  for (const key of keys) {
    window.localStorage.removeItem(key);
  }

  return keys.length;
}

export function exportStoredScenarioRun(
  run: StoredScenarioRun,
): string {
  return JSON.stringify(run, null, 2);
}

export function importStoredScenarioRun(
  serializedRun: string,
): ScenarioRunImportResult {
  try {
    const parsed: unknown = JSON.parse(serializedRun);

    if (!isStoredScenarioRun(parsed)) {
      return {
        success: false,
        issues: [
          "The imported file is not a valid TA-14 scenario run.",
        ],
      };
    }

    if (
      parsed.schemaVersion !== SCENARIO_RUN_SCHEMA_VERSION
    ) {
      return {
        success: false,
        issues: [
          `Unsupported scenario-run schema version "${parsed.schemaVersion}".`,
        ],
      };
    }

    return {
      success: true,
      run: parsed,
      issues: [],
    };
  } catch {
    return {
      success: false,
      issues: ["The imported scenario run is not valid JSON."],
    };
  }
}
