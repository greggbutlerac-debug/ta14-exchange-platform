import type {
  EvidenceId,
  JsonValue,
  RecordClass,
  RecordVisibility,
  RouteDetermination,
} from "./types";
import type { RuntimeTestSession } from "./runtime-test-session";
import type { RuntimeEvidenceSummary } from "./runtime-evidence-storage";
import type { StoredScenarioRun } from "./scenario-run-storage";

/**
 * TA-14 Runtime Governance Playground
 * Governed-record candidate assembly
 *
 * This module assembles a reviewable record candidate from a selected route,
 * evidence references, and a stored scenario run. A candidate is not yet an
 * immutable PreservedRecord and does not establish admissibility, execution,
 * certification, or regulatory compliance.
 */

export const GOVERNED_RECORD_CANDIDATE_SCHEMA_VERSION = "1.0.0";

export type GovernedRecordCandidateStatus =
  | "INCOMPLETE"
  | "READY_FOR_REVIEW"
  | "REJECTED"
  | "APPROVED_FOR_PRESERVATION";

export interface GovernedRecordCandidateIssue {
  code:
    | "ROUTE_SESSION_MISSING"
    | "ROUTE_MISMATCH"
    | "SCENARIO_RUN_INVALID"
    | "SCENARIO_RUN_INCOMPLETE"
    | "DETERMINATION_MISSING"
    | "CONFLICTING_EVIDENCE_PRESENT"
    | "UNBOUND_EVIDENCE_PRESENT";
  message: string;
  blocking: boolean;
}

export interface RuntimeGovernedRecordPayload {
  laneId: string;
  laneVersion: string;
  routeDraftId: string;
  routeTitle: string;
  routeValues: Readonly<Record<string, JsonValue>>;
  testSessionId: string;
  scenarioRunId: string;
  scenarioId: string;
  scenarioTitle: string;
  expectedDetermination: RouteDetermination;
  observedDetermination: RouteDetermination;
  verificationValid: boolean;
  verificationIssues: readonly JsonValue[];
  gateResults: readonly JsonValue[];
  evidenceIds: readonly EvidenceId[];
  supportingEvidenceIds: readonly EvidenceId[];
  conflictingEvidenceIds: readonly EvidenceId[];
  unboundEvidenceIds: readonly EvidenceId[];
  sourceRunCreatedAt: string;
  assembledAt: string;
  limitations: readonly string[];
}

export interface GovernedRecordCandidate {
  schemaVersion: string;
  candidateId: string;
  recordClass: RecordClass;
  title: string;
  status: GovernedRecordCandidateStatus;
  visibility: RecordVisibility;
  routeDraftId: string;
  testSessionId: string;
  storedRunId: string;
  payload: RuntimeGovernedRecordPayload;
  issues: readonly GovernedRecordCandidateIssue[];
  createdAt: string;
  updatedAt: string;
}

export interface AssembleGovernedRecordCandidateInput {
  testSession?: RuntimeTestSession;
  storedRun: StoredScenarioRun;
  evidence: readonly RuntimeEvidenceSummary[];
  visibility?: RecordVisibility;
}

function createId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    "randomUUID" in globalThis.crypto
  ) {
    return `record-candidate-${globalThis.crypto.randomUUID()}`;
  }

  return `record-candidate-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

export function evaluateGovernedRecordCandidate(
  input: AssembleGovernedRecordCandidateInput,
): readonly GovernedRecordCandidateIssue[] {
  const issues: GovernedRecordCandidateIssue[] = [];
  const { testSession, storedRun, evidence } = input;

  if (!testSession) {
    issues.push({
      code: "ROUTE_SESSION_MISSING",
      message:
        "No active Runtime test session is available for this scenario run.",
      blocking: true,
    });
  }

  if (
    testSession &&
    storedRun.routeDraftId &&
    storedRun.routeDraftId !== testSession.routeDraftId
  ) {
    issues.push({
      code: "ROUTE_MISMATCH",
      message:
        "The stored scenario run does not reference the active Runtime route draft.",
      blocking: true,
    });
  }

  if (!storedRun.scenarioRun.determination) {
    issues.push({
      code: "DETERMINATION_MISSING",
      message:
        "The scenario run does not contain an observed route determination.",
      blocking: true,
    });
  }

  if (storedRun.scenarioRun.status !== "COMPLETED") {
    issues.push({
      code: "SCENARIO_RUN_INCOMPLETE",
      message:
        "The scenario run was not completed and cannot enter record review.",
      blocking: true,
    });
  }

  if (!storedRun.verification.valid) {
    issues.push({
      code: "SCENARIO_RUN_INVALID",
      message:
        "The observed scenario behavior did not match the declared scenario definition.",
      blocking: true,
    });
  }

  const conflictingEvidence = evidence.filter(
    (item) => item.relationship === "CONFLICTING",
  );

  if (conflictingEvidence.length > 0) {
    issues.push({
      code: "CONFLICTING_EVIDENCE_PRESENT",
      message: `${conflictingEvidence.length} conflicting evidence candidate${
        conflictingEvidence.length === 1 ? " is" : "s are"
      } attached to this testing context.`,
      blocking: true,
    });
  }

  const unboundEvidence = evidence.filter(
    (item) => !item.gateId,
  );

  if (unboundEvidence.length > 0) {
    issues.push({
      code: "UNBOUND_EVIDENCE_PRESENT",
      message: `${unboundEvidence.length} evidence candidate${
        unboundEvidence.length === 1 ? " remains" : "s remain"
      } route-level and unbound to a tested gate.`,
      blocking: false,
    });
  }

  return issues;
}

export function assembleGovernedRecordCandidate(
  input: AssembleGovernedRecordCandidateInput,
): GovernedRecordCandidate {
  const { testSession, storedRun, evidence } = input;
  const timestamp = new Date().toISOString();
  const issues = evaluateGovernedRecordCandidate(input);
  const blockingIssues = issues.filter((issue) => issue.blocking);

  const supportingEvidenceIds = evidence
    .filter((item) => item.relationship === "SUPPORTING")
    .map((item) => item.evidenceId);

  const conflictingEvidenceIds = evidence
    .filter((item) => item.relationship === "CONFLICTING")
    .map((item) => item.evidenceId);

  const unboundEvidenceIds = evidence
    .filter((item) => !item.gateId)
    .map((item) => item.evidenceId);

  const routeDraftId =
    testSession?.routeDraftId ??
    storedRun.routeDraftId ??
    "UNBOUND_RUNTIME_ROUTE";

  const testSessionId =
    testSession?.sessionId ??
    String(
      storedRun.metadata.activeTestSessionId ??
        "UNBOUND_RUNTIME_TEST_SESSION",
    );

  const observedDetermination =
    storedRun.scenarioRun.determination ?? "HOLD";

  return {
    schemaVersion: GOVERNED_RECORD_CANDIDATE_SCHEMA_VERSION,
    candidateId: createId(),
    recordClass: "OBSERVED_TEST_RESULT",
    title: `${storedRun.scenarioTitle} — ${observedDetermination}`,
    status:
      blockingIssues.length === 0
        ? "READY_FOR_REVIEW"
        : "INCOMPLETE",
    visibility: input.visibility ?? "OWNER_ONLY",
    routeDraftId,
    testSessionId,
    storedRunId: storedRun.storedRunId,
    payload: {
      laneId: storedRun.laneId,
      laneVersion: storedRun.laneVersion,
      routeDraftId,
      routeTitle:
        testSession?.routeTitle ??
        storedRun.routeTitle ??
        "Untitled Runtime route",
      routeValues:
        testSession?.routeValues ??
        ((storedRun.metadata.routeValuesSnapshot ??
          {}) as Readonly<Record<string, JsonValue>>),
      testSessionId,
      scenarioRunId:
        storedRun.scenarioRun.scenarioRunId,
      scenarioId: storedRun.scenarioId,
      scenarioTitle: storedRun.scenarioTitle,
      expectedDetermination:
        storedRun.expectedDetermination,
      observedDetermination,
      verificationValid:
        storedRun.verification.valid,
      verificationIssues:
        storedRun.verification.issues as unknown as readonly JsonValue[],
      gateResults:
        storedRun.scenarioRun
          .gateResults as unknown as readonly JsonValue[],
      evidenceIds: unique(
        evidence.map((item) => item.evidenceId),
      ),
      supportingEvidenceIds: unique(
        supportingEvidenceIds,
      ),
      conflictingEvidenceIds: unique(
        conflictingEvidenceIds,
      ),
      unboundEvidenceIds: unique(unboundEvidenceIds),
      sourceRunCreatedAt: storedRun.createdAt,
      assembledAt: timestamp,
      limitations: [
        "This candidate records a playground test run, not verified real-world execution.",
        "Evidence attachments remain candidates unless independently validated and preserved.",
        "READY_FOR_REVIEW does not mean admissible, compliant, certified, or approved for execution.",
      ],
    },
    issues,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function approveGovernedRecordCandidateForPreservation(
  candidate: GovernedRecordCandidate,
): GovernedRecordCandidate {
  const blockingIssues = candidate.issues.filter(
    (issue) => issue.blocking,
  );

  if (blockingIssues.length > 0) {
    throw new Error(
      "A governed-record candidate with blocking issues cannot be approved for preservation.",
    );
  }

  return {
    ...candidate,
    status: "APPROVED_FOR_PRESERVATION",
    updatedAt: new Date().toISOString(),
  };
}

export function rejectGovernedRecordCandidate(
  candidate: GovernedRecordCandidate,
): GovernedRecordCandidate {
  return {
    ...candidate,
    status: "REJECTED",
    updatedAt: new Date().toISOString(),
  };
}
