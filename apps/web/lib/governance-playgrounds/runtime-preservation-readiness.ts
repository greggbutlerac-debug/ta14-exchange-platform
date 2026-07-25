import type {
  GovernedRecordCandidate,
  GovernedRecordCandidateIssue,
} from "./runtime-governed-record-candidate";

export interface RuntimePreservationReadiness {
  ready: boolean;
  candidateId: string;
  candidateStatus: GovernedRecordCandidate["status"];
  blockingIssues: readonly GovernedRecordCandidateIssue[];
  warnings: readonly GovernedRecordCandidateIssue[];
  reasons: readonly string[];
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

export function evaluateRuntimePreservationReadiness(
  candidate: GovernedRecordCandidate,
): RuntimePreservationReadiness {
  const blockingIssues = candidate.issues.filter(
    (issue) => issue.blocking,
  );
  const warnings = candidate.issues.filter(
    (issue) => !issue.blocking,
  );
  const reasons: string[] = [];

  if (candidate.status !== "APPROVED_FOR_PRESERVATION") {
    reasons.push(
      "The governed-record candidate has not been explicitly approved for preservation.",
    );
  }

  if (blockingIssues.length > 0) {
    reasons.push(
      `${blockingIssues.length} blocking candidate issue${
        blockingIssues.length === 1 ? "" : "s"
      } remain unresolved.`,
    );
  }

  if (!candidate.payload.verificationValid) {
    reasons.push(
      "The preserved scenario verification is invalid.",
    );
  }

  if (!candidate.payload.routeDraftId) {
    reasons.push(
      "The candidate is missing its source route-draft identifier.",
    );
  }

  if (!candidate.payload.testSessionId) {
    reasons.push(
      "The candidate is missing its runtime test-session identifier.",
    );
  }

  if (!candidate.payload.storedRunId) {
    reasons.push(
      "The candidate is missing its stored scenario-run identifier.",
    );
  }

  if (!candidate.payload.observedDetermination) {
    reasons.push(
      "The candidate has no observed determination to preserve.",
    );
  }

  if (candidate.payload.boundEvidence.length === 0) {
    reasons.push(
      "The candidate contains no bound evidence references.",
    );
  }

  const normalizedReasons = unique(reasons);

  return {
    ready: normalizedReasons.length === 0,
    candidateId: candidate.candidateId,
    candidateStatus: candidate.status,
    blockingIssues,
    warnings,
    reasons: normalizedReasons,
  };
}

export function assertRuntimePreservationReady(
  candidate: GovernedRecordCandidate,
): void {
  const readiness =
    evaluateRuntimePreservationReadiness(candidate);

  if (!readiness.ready) {
    throw new Error(
      [
        "The governed-record candidate is not ready for preservation.",
        ...readiness.reasons,
      ].join(" "),
    );
  }
}
