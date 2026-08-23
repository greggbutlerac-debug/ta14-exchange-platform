export type EvidenceRung = "E0" | "E1" | "E2" | "E3" | "E4" | "E5";

export type EvidenceMode =
  | "NARRATIVE_UI"
  | "SYNTHETIC_EXECUTION"
  | "REPLAYABLE_PACKAGE"
  | "EXTERNAL_OBSERVATION"
  | "LIVE_CONTROLLED"
  | "INDEPENDENT_CHALLENGE";

export type GovernanceDecision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

export type VerificationStanding =
  | "IDLE"
  | "CHECKING"
  | "SELF_CHECK_COMPLETE"
  | "REPLAY_CONFIRMED"
  | "EXTERNALLY_VERIFIED"
  | "VERIFICATION_FAILED"
  | "VERIFICATION_UNRESOLVED";

export type ProofStatus = "PASS" | "FAIL" | "UNRESOLVED" | "NOT_APPLICABLE";

export type SourceClass =
  | "AUTHORED"
  | "INTERNAL_SYSTEM"
  | "EXTERNAL_SYSTEM"
  | "TARGET_SYSTEM"
  | "INDEPENDENT_REVIEWER";

export type EvidenceStatus =
  | "ADMITTED"
  | "REJECTED"
  | "STALE"
  | "CONFLICTING"
  | "UNAVAILABLE"
  | "UNRESOLVED";

export type CorrespondenceResult =
  | "MATCH"
  | "MISMATCH"
  | "DIVERGENT"
  | "FAILED"
  | "UNRESOLVED"
  | "NOT_OBSERVED";

export interface EvidenceObject {
  evidenceId: string;
  propositionId: string;
  sourceClass: SourceClass;
  sourceId: string;
  sourceRef?: string;
  capturedAt: string;
  validFrom?: string;
  validUntil?: string;
  contentDigest: string;
  custodyDigest?: string;
  verificationMethod: string;
  verifierId?: string;
  requirementBindings: string[];
  status: EvidenceStatus;
  limitations: string[];
}

export interface AuthorityObject {
  authorityId: string;
  actorId: string;
  authoritySource: string;
  scope: string[];
  targetScope: string[];
  actionScope: string[];
  delegatedBy?: string;
  lineageDigest: string;
  validFrom: string;
  validUntil: string;
  revocationStatus: "ACTIVE" | "REVOKED" | "UNKNOWN";
  resolvedAt: string;
  resolverId: string;
  sourceDigest: string;
}

export interface CommitObject {
  commitId: string;
  routeId: string;
  routeVersion: string;
  propositionId: string;
  determination: GovernanceDecision;
  targetId: string;
  actionCanonical: string;
  actionDigest: string;
  evidenceSetDigest: string;
  authoritySnapshotDigest: string;
  policyDigest: string;
  issuedAt: string;
  expiresAt: string;
  nonce: string;
  commitDigest: string;
}

export interface VerificationResult {
  verificationId: string;
  propositionId: string;
  method: string;
  sourceRefs: string[];
  startedAt: string;
  completedAt: string;
  result: VerificationStanding;
  evidenceMode: EvidenceMode;
  evidenceRung: EvidenceRung;
  verifierId: string;
  resultDigest: string;
  limitations: string[];
}

export interface ExecutionReceipt {
  executionId: string;
  commitId?: string;
  adapterId: string;
  outboundAttempted: boolean;
  outboundSent: boolean;
  targetAcknowledged: boolean;
  requestDigest?: string;
  responseDigest?: string;
  executedAt: string;
  correspondenceResult: CorrespondenceResult;
  refusalReasonCode?: string;
  evidenceMode: EvidenceMode;
  evidenceRung: EvidenceRung;
  earliestGoverningReasonCode?: string;
  effectObserved?: boolean;
}

export interface OutcomeObservation {
  outcomeId: string;
  executionId: string;
  targetId: string;
  observationSource: string;
  observedAt: string;
  expectedStateDigest?: string;
  observedStateDigest?: string;
  correspondenceResult: CorrespondenceResult;
  standing: EvidenceRung;
  limitations: string[];
}

export interface ReplayManifest {
  replayId: string;
  packageVersion: string;
  routeVersion: string;
  objectDigests: string[];
  policyDigest: string;
  expectedDetermination: GovernanceDecision;
  expectedExecutionState: string;
  createdAt: string;
  packageDigest: string;
  independentReplayStatus:
    | "NOT_ATTEMPTED"
    | "REPRODUCED"
    | "DIVERGENT"
    | "INVALID_TAMPERED"
    | "UNRESOLVED";
}

export interface ProofStanding {
  determination: ProofStatus;
  causalControl: ProofStatus;
  outcomeCorrespondence: ProofStatus;
  evidenceMode: EvidenceMode;
  evidenceRung: EvidenceRung;
  claimBoundary: string;
  limitations: string[];
}

export interface ProtectedAction {
  targetId: string;
  actionCanonical: string;
  routeId: string;
  routeVersion: string;
}

export interface EvidenceBundle {
  propositionId: string;
  evidence: EvidenceObject[];
  authority: AuthorityObject[];
  commit?: CommitObject;
  executionReceipts?: ExecutionReceipt[];
  outcomeObservations?: OutcomeObservation[];
  replayManifest?: ReplayManifest;
}
