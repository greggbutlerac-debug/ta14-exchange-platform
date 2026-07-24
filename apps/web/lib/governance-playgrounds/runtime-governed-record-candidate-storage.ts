import type {
  GovernedRecordCandidate,
  GovernedRecordCandidateStatus,
} from "./runtime-governed-record-candidate";

/**
 * TA-14 Runtime Governance Playground
 * Browser-local governed-record candidate storage
 *
 * Stored candidates remain review artifacts. They are not immutable
 * PreservedRecord objects and do not establish admissibility, execution,
 * certification, or regulatory compliance.
 */

export const GOVERNED_RECORD_CANDIDATE_STORAGE_PREFIX =
  "ta14:runtime-execution:record-candidates";

export const GOVERNED_RECORD_CANDIDATE_STORAGE_VERSION = "1.0.0";

export interface GovernedRecordCandidateSummary {
  candidateId: string;
  title: string;
  status: GovernedRecordCandidateStatus;
  recordClass: GovernedRecordCandidate["recordClass"];
  visibility: GovernedRecordCandidate["visibility"];
  routeDraftId: string;
  testSessionId: string;
  storedRunId: string;
  determination:
    GovernedRecordCandidate["payload"]["observedDetermination"];
  issueCount: number;
  blockingIssueCount: number;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GovernedRecordCandidateImportResult {
  success: boolean;
  candidate?: GovernedRecordCandidate;
  issues: readonly string[];
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function storageKey(candidateId: string): string {
  return `${GOVERNED_RECORD_CANDIDATE_STORAGE_PREFIX}:${candidateId}`;
}

function isGovernedRecordCandidateStatus(
  value: unknown,
): value is GovernedRecordCandidateStatus {
  return (
    value === "INCOMPLETE" ||
    value === "READY_FOR_REVIEW" ||
    value === "REJECTED" ||
    value === "APPROVED_FOR_PRESERVATION"
  );
}

function isGovernedRecordCandidate(
  value: unknown,
): value is GovernedRecordCandidate {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate =
    value as Partial<GovernedRecordCandidate>;

  return (
    typeof candidate.schemaVersion === "string" &&
    typeof candidate.candidateId === "string" &&
    typeof candidate.title === "string" &&
    isGovernedRecordCandidateStatus(candidate.status) &&
    typeof candidate.recordClass === "string" &&
    typeof candidate.visibility === "string" &&
    typeof candidate.routeDraftId === "string" &&
    typeof candidate.testSessionId === "string" &&
    typeof candidate.storedRunId === "string" &&
    !!candidate.payload &&
    typeof candidate.payload === "object" &&
    Array.isArray(candidate.issues) &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

export function saveGovernedRecordCandidate(
  candidate: GovernedRecordCandidate,
): GovernedRecordCandidate {
  const updatedCandidate: GovernedRecordCandidate = {
    ...candidate,
    updatedAt: new Date().toISOString(),
  };

  if (isBrowser()) {
    window.localStorage.setItem(
      storageKey(updatedCandidate.candidateId),
      JSON.stringify(updatedCandidate),
    );
  }

  return updatedCandidate;
}

export function loadGovernedRecordCandidate(
  candidateId: string,
): GovernedRecordCandidate | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  const raw = window.localStorage.getItem(
    storageKey(candidateId),
  );

  if (!raw) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    return isGovernedRecordCandidate(parsed)
      ? parsed
      : undefined;
  } catch {
    return undefined;
  }
}

export function listGovernedRecordCandidates(
  filters: {
    status?: GovernedRecordCandidateStatus;
    routeDraftId?: string;
    storedRunId?: string;
  } = {},
): GovernedRecordCandidateSummary[] {
  if (!isBrowser()) {
    return [];
  }

  const prefix = `${GOVERNED_RECORD_CANDIDATE_STORAGE_PREFIX}:`;
  const summaries: GovernedRecordCandidateSummary[] = [];

  for (
    let index = 0;
    index < window.localStorage.length;
    index += 1
  ) {
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

      if (!isGovernedRecordCandidate(parsed)) {
        continue;
      }

      if (
        filters.status &&
        parsed.status !== filters.status
      ) {
        continue;
      }

      if (
        filters.routeDraftId &&
        parsed.routeDraftId !== filters.routeDraftId
      ) {
        continue;
      }

      if (
        filters.storedRunId &&
        parsed.storedRunId !== filters.storedRunId
      ) {
        continue;
      }

      summaries.push({
        candidateId: parsed.candidateId,
        title: parsed.title,
        status: parsed.status,
        recordClass: parsed.recordClass,
        visibility: parsed.visibility,
        routeDraftId: parsed.routeDraftId,
        testSessionId: parsed.testSessionId,
        storedRunId: parsed.storedRunId,
        determination:
          parsed.payload.observedDetermination,
        issueCount: parsed.issues.length,
        blockingIssueCount: parsed.issues.filter(
          (issue) => issue.blocking,
        ).length,
        evidenceCount:
          parsed.payload.evidenceIds.length,
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

export function deleteGovernedRecordCandidate(
  candidateId: string,
): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(storageKey(candidateId));
}

export function clearGovernedRecordCandidates(): number {
  if (!isBrowser()) {
    return 0;
  }

  const prefix = `${GOVERNED_RECORD_CANDIDATE_STORAGE_PREFIX}:`;
  const keys: string[] = [];

  for (
    let index = 0;
    index < window.localStorage.length;
    index += 1
  ) {
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

export function exportGovernedRecordCandidate(
  candidate: GovernedRecordCandidate,
): string {
  return JSON.stringify(candidate, null, 2);
}

export function importGovernedRecordCandidate(
  serializedCandidate: string,
): GovernedRecordCandidateImportResult {
  try {
    const parsed: unknown = JSON.parse(serializedCandidate);

    if (!isGovernedRecordCandidate(parsed)) {
      return {
        success: false,
        issues: [
          "The imported file is not a valid TA-14 governed-record candidate.",
        ],
      };
    }

    return {
      success: true,
      candidate: parsed,
      issues: [],
    };
  } catch {
    return {
      success: false,
      issues: [
        "The imported governed-record candidate is not valid JSON.",
      ],
    };
  }
}
