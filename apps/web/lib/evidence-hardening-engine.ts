import type {
  AuthorityObject,
  CommitObject,
  EvidenceBundle,
  EvidenceObject,
  EvidenceRung,
  ExecutionReceipt,
  ProtectedAction,
  ProofStanding,
} from "./evidence-hardening-types";

const RUNG_ORDER: EvidenceRung[] = ["E0", "E1", "E2", "E3", "E4", "E5"];

export function isEvidenceCurrent(evidence: EvidenceObject, at = new Date()): boolean {
  if (evidence.status !== "ADMITTED") return false;
  const now = at.getTime();
  if (evidence.validFrom && new Date(evidence.validFrom).getTime() > now) return false;
  if (evidence.validUntil && new Date(evidence.validUntil).getTime() < now) return false;
  return true;
}

export function isAuthorityCurrent(authority: AuthorityObject, at = new Date()): boolean {
  const now = at.getTime();
  return (
    authority.revocationStatus === "ACTIVE" &&
    new Date(authority.validFrom).getTime() <= now &&
    new Date(authority.validUntil).getTime() >= now
  );
}

export function validateCommitForAction(
  commit: CommitObject | undefined,
  action: ProtectedAction,
  at = new Date(),
): { valid: boolean; reasonCode?: string } {
  if (!commit) return { valid: false, reasonCode: "NO_COMMIT" };
  if (commit.determination !== "ALLOW") return { valid: false, reasonCode: `COMMIT_${commit.determination}` };
  if (new Date(commit.expiresAt).getTime() < at.getTime()) return { valid: false, reasonCode: "COMMIT_EXPIRED" };
  if (commit.routeId !== action.routeId || commit.routeVersion !== action.routeVersion) {
    return { valid: false, reasonCode: "ROUTE_PARITY_FAILED" };
  }
  if (commit.targetId !== action.targetId) return { valid: false, reasonCode: "TARGET_PARITY_FAILED" };
  if (commit.actionCanonical !== action.actionCanonical) {
    return { valid: false, reasonCode: "ACTION_PARITY_FAILED" };
  }
  return { valid: true };
}

export function enforceProtectedAction(params: {
  adapterId: string;
  bundle: EvidenceBundle;
  action: ProtectedAction;
  at?: Date;
}): { allowed: boolean; receipt: ExecutionReceipt } {
  const at = params.at ?? new Date();
  const commitCheck = validateCommitForAction(params.bundle.commit, params.action, at);
  const authorityValid = params.bundle.authority.some((authority) =>
    isAuthorityCurrent(authority, at) &&
    authority.targetScope.includes(params.action.targetId) &&
    authority.actionScope.includes(params.action.actionCanonical),
  );
  const mandatoryEvidenceInvalid = params.bundle.evidence.some(
    (evidence) => evidence.requirementBindings.length > 0 && !isEvidenceCurrent(evidence, at),
  );

  let refusalReasonCode = commitCheck.reasonCode;
  if (commitCheck.valid && !authorityValid) refusalReasonCode = "AUTHORITY_NOT_CURRENT_OR_OUT_OF_SCOPE";
  if (commitCheck.valid && authorityValid && mandatoryEvidenceInvalid) refusalReasonCode = "MANDATORY_EVIDENCE_NOT_CURRENT";

  const allowed = commitCheck.valid && authorityValid && !mandatoryEvidenceInvalid;

  return {
    allowed,
    receipt: {
      executionId: `guard-${params.action.routeId}-${at.toISOString()}`,
      commitId: params.bundle.commit?.commitId,
      adapterId: params.adapterId,
      outboundAttempted: false,
      outboundSent: false,
      targetAcknowledged: false,
      executedAt: at.toISOString(),
      correspondenceResult: allowed ? "NOT_OBSERVED" : "UNRESOLVED",
      refusalReasonCode: allowed ? undefined : refusalReasonCode ?? "UNRESOLVED_GOVERNANCE_CONDITION",
      earliestGoverningReasonCode: allowed ? undefined : refusalReasonCode ?? "UNRESOLVED_GOVERNANCE_CONDITION",
      evidenceMode: "SYNTHETIC_EXECUTION",
      evidenceRung: "E1",
      effectObserved: false,
    },
  };
}

export function capEvidenceRung(requested: EvidenceRung, supporting: EvidenceRung[]): EvidenceRung {
  if (supporting.length === 0) return "E0";
  const maxSupported = Math.min(...supporting.map((rung) => RUNG_ORDER.indexOf(rung)));
  return RUNG_ORDER[Math.min(RUNG_ORDER.indexOf(requested), maxSupported)] ?? "E0";
}

export function deriveProofStanding(bundle: EvidenceBundle): ProofStanding {
  const hasExternalEvidence = bundle.evidence.some(
    (evidence) => evidence.sourceClass === "EXTERNAL_SYSTEM" || evidence.sourceClass === "TARGET_SYSTEM",
  );
  const execution = bundle.executionReceipts?.[0];
  const outcome = bundle.outcomeObservations?.[0];
  const replay = bundle.replayManifest;

  if (replay?.independentReplayStatus === "REPRODUCED") {
    return {
      determination: "PASS",
      causalControl: execution ? "PASS" : "UNRESOLVED",
      outcomeCorrespondence: outcome?.correspondenceResult === "MATCH" ? "PASS" : "UNRESOLVED",
      evidenceMode: "INDEPENDENT_CHALLENGE",
      evidenceRung: "E5",
      claimBoundary: "Independent replay standing is bounded to the frozen package and challenged conditions.",
      limitations: [],
    };
  }

  if (execution && hasExternalEvidence) {
    return {
      determination: "PASS",
      causalControl: "PASS",
      outcomeCorrespondence: outcome?.correspondenceResult === "MATCH" ? "PASS" : outcome ? "FAIL" : "UNRESOLVED",
      evidenceMode: "LIVE_CONTROLLED",
      evidenceRung: "E4",
      claimBoundary: "Causal standing is bounded to the protected adapter, target, action, and evidence set represented by these receipts.",
      limitations: outcome ? [] : ["No authoritative post-state observation is attached."],
    };
  }

  if (hasExternalEvidence) {
    return {
      determination: "PASS",
      causalControl: "UNRESOLVED",
      outcomeCorrespondence: "UNRESOLVED",
      evidenceMode: "EXTERNAL_OBSERVATION",
      evidenceRung: "E3",
      claimBoundary: "External evidence standing does not by itself establish causal execution control.",
      limitations: ["No causal enforcement receipt establishes action formation or non-formation."],
    };
  }

  if (replay) {
    return {
      determination: "PASS",
      causalControl: "UNRESOLVED",
      outcomeCorrespondence: "UNRESOLVED",
      evidenceMode: "REPLAYABLE_PACKAGE",
      evidenceRung: "E2",
      claimBoundary: "Replay proves behavior over frozen inputs, not independent truth of those inputs.",
      limitations: [],
    };
  }

  return {
    determination: "PASS",
    causalControl: "UNRESOLVED",
    outcomeCorrespondence: "UNRESOLVED",
    evidenceMode: "SYNTHETIC_EXECUTION",
    evidenceRung: "E1",
    claimBoundary: "Deterministic governance behavior over supplied facts only; no external-event claim.",
    limitations: ["Supplied facts are not independently established by this result."],
  };
}
