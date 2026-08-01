/**
 * TA-14 Canonical Record Validator and Reason-Code Dictionary
 * -----------------------------------------------------------------------------
 * Phase 1 of the TA-14 Execution Artifact Registry PDF Engine.
 *
 * Governing rule:
 *   No admissible evidence. No admissible execution.
 *
 * This module is intentionally dependency-free. It provides:
 *   - canonical execution artifact types;
 *   - deterministic validation contracts;
 *   - a complete reason-code dictionary;
 *   - cross-domain parity checks;
 *   - publication-readiness decisions;
 *   - claims-boundary enforcement;
 *   - stable machine-readable validation output.
 *
 * It does not generate PDFs, publish registry entries, grant authority, repair
 * evidence, or rewrite committed events. It validates the frozen record that
 * downstream engine phases are permitted to render.
 */

export const TA14_VALIDATOR_VERSION = "1.0.0" as const;
export const TA14_ENGINE_SPEC_VERSION = "1.2" as const;

export type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
export type ValidationDisposition = "PASS" | "HOLD" | "BLOCK" | "DENY" | "ESCALATE";
export type ArtifactClassification = "DEMONSTRATION" | "PRODUCTION";
export type PublicationStatus =
  | "DRAFT"
  | "INTERNAL_REVIEW"
  | "READY"
  | "PUBLISHED"
  | "CHALLENGED"
  | "CORRECTED"
  | "SUPERSEDED"
  | "WITHDRAWN";
export type DisclosureState = "PUBLIC" | "SELECTIVE" | "RESTRICTED" | "WITHHELD";
export type GateResult = "PASS" | "HOLD" | "FAIL" | "ESCALATE" | "NOT_RUN";
export type ChallengeDisposition =
  | "NONE"
  | "PENDING"
  | "UNDER_REVIEW"
  | "UPHELD"
  | "MODIFIED"
  | "REVERSED"
  | "CLOSED"
  | "WITHDRAWN";

export interface ArtifactIdentity {
  artifactId: string;
  seriesId: string;
  title: string;
  classification: ArtifactClassification;
  owner: string;
  steward: string;
  createdAt: string;
  publishedAt?: string;
  status: PublicationStatus;
}

export interface ScenarioRecord {
  proposedAction: string;
  consequence: string;
  affectedSubjects: string[];
  environment: string;
  assumptions: string[];
  declaredLimits: string[];
  classification: ArtifactClassification;
  frozenSnapshot: string;
}

export interface RouteGateDefinition {
  gateId: string;
  sequence: number;
  mandatory: boolean;
  requirement: string;
}

export interface RouteRecord {
  routeId: string;
  version: string;
  gateOrder: RouteGateDefinition[];
  thresholds: Record<string, string | number | boolean>;
  jurisdiction: string[];
  modelVersions: string[];
  toolVersions: string[];
  revalidationTriggers: string[];
  frozenSnapshot: string;
  routeHash: string;
}

export interface EvidenceRecord {
  evidenceId: string;
  source: string;
  evidenceType: string;
  capturedAt: string;
  validFrom?: string;
  validUntil?: string;
  hash: string;
  custody: string[];
  freshness: "CURRENT" | "STALE" | "EXPIRED" | "UNKNOWN";
  admissibility: "ADMITTED" | "REJECTED" | "PENDING";
  relevance: "PASS" | "FAIL" | "PENDING";
  sufficiency: "PASS" | "FAIL" | "PENDING";
  conflict: "NONE" | "RESOLVED" | "UNRESOLVED";
  disclosure: DisclosureState;
}

export interface AuthorityRecord {
  actorId: string;
  role: string;
  source: string;
  scope: string[];
  delegationChain: string[];
  validFrom: string;
  validUntil?: string;
  revokedAt?: string;
  conflict: "NONE" | "RESOLVED" | "UNRESOLVED";
  requiredConcurrence: string[];
  concurrenceReceived: string[];
  frozenSnapshot: string;
}

export interface ContinuityEvent {
  eventId: string;
  occurredAt: string;
  category:
    | "IDENTITY"
    | "EVIDENCE"
    | "ROUTE"
    | "AUTHORITY"
    | "MODEL"
    | "TOOL"
    | "DESTINATION"
    | "ENVIRONMENT"
    | "CUSTODY"
    | "REVALIDATION";
  description: string;
  material: boolean;
  revalidationRequired: boolean;
  revalidationCompleted: boolean;
}

export interface ContinuityRecord {
  identityContinuous: boolean;
  evidenceContinuous: boolean;
  routeContinuous: boolean;
  custodyContinuous: boolean;
  timeWindowContinuous: boolean;
  modelParity: boolean;
  toolParity: boolean;
  events: ContinuityEvent[];
}

export interface GateLedgerEntry {
  gateId: string;
  sequence: number;
  mandatory: boolean;
  requirement: string;
  inputRefs: string[];
  result: GateResult;
  reasonCodes: string[];
  evaluatedAt: string;
}

export interface GateLedgerRecord {
  entries: GateLedgerEntry[];
  earliestFailureGateId?: string;
  bypassAttempted: boolean;
}

export interface CommitRecord {
  determination: Determination;
  reasons: string[];
  committedAt: string;
  approvingAuthority: string[];
  permittedNextAction: string;
  frozenSnapshot: string;
  commitHash: string;
  postEventApprovalDetected: boolean;
}

export interface ExecutionEffectRecord {
  adapterId: string;
  attemptedAction: string;
  command: string;
  executedAt?: string;
  result: "RELEASED" | "HELD" | "BLOCKED" | "ROUTED" | "ROLLED_BACK" | "TERMINATED" | "NOT_ATTEMPTED";
  statusCode: string | number;
  target: string;
  scope: string[];
  retries: number;
  bypassAttempts: string[];
  tokenState: "ACTIVE" | "SUSPENDED" | "REVOKED" | "NOT_APPLICABLE";
  rollbackState: "NOT_REQUIRED" | "AVAILABLE" | "COMPLETED" | "FAILED" | "NOT_APPLICABLE";
  technicalReceipt: string;
}

export interface OutcomeRecord {
  actualResult: string;
  consequenceState: "BOUND" | "NOT_BOUND" | "PARTIALLY_BOUND" | "UNKNOWN";
  closureEvidence: string[];
  verifierId: string;
  verifiedAt: string;
  residualRisk: string;
  followUp: string[];
  zeroActionEvidence?: string[];
}

export interface IntegrityRecord {
  canonicalHash: string;
  packageHash: string;
  componentHashes: Record<string, string>;
  signatureMethod?: string;
  verifierVersion?: string;
  parity: {
    pdf?: boolean;
    json?: boolean;
    manifest?: boolean;
    routeSnapshot?: boolean;
    publicPage?: boolean;
  };
}

export interface ReviewStatusRecord {
  reviewLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  challengeDisposition: ChallengeDisposition;
  correctionOf?: string;
  supersedes?: string;
  withdrawalReason?: string;
  publicNotes: string[];
  claimsBoundary: {
    proves: string[];
    doesNotProve: string[];
  };
}

export interface CanonicalExecutionArtifact {
  identity: ArtifactIdentity;
  scenario: ScenarioRecord;
  route: RouteRecord;
  evidence: EvidenceRecord[];
  authority: AuthorityRecord[];
  continuity: ContinuityRecord;
  gateLedger: GateLedgerRecord;
  commit: CommitRecord;
  execution: ExecutionEffectRecord;
  outcome: OutcomeRecord;
  integrity: IntegrityRecord;
  review: ReviewStatusRecord;
}

export interface ValidationContext {
  now?: string;
  intendedUse: "DRAFT" | "INTERNAL_REVIEW" | "PUBLICATION" | "VERIFICATION";
  strict?: boolean;
  requireSignature?: boolean;
  requireOfflineVerification?: boolean;
}

export interface ReasonCodeDefinition {
  code: string;
  domain: ReasonDomain;
  message: string;
  disposition: ValidationDisposition;
  publicRelianceBlocked: boolean;
  repairHint: string;
}

export interface ValidationIssue {
  code: ReasonCode;
  path: string;
  message: string;
  disposition: ValidationDisposition;
  publicRelianceBlocked: boolean;
  repairHint: string;
  details?: Record<string, unknown>;
}

export interface ValidationSummary {
  valid: boolean;
  publicationReady: boolean;
  highestDisposition: ValidationDisposition;
  determinationConsistent: boolean;
  issueCount: number;
  counts: Record<ValidationDisposition, number>;
  issues: ValidationIssue[];
  checkedAt: string;
  validatorVersion: string;
  engineSpecVersion: string;
}

export type ReasonDomain =
  | "RecordIdentity"
  | "Scenario"
  | "Route"
  | "Evidence"
  | "Authority"
  | "Continuity"
  | "GateLedger"
  | "Commit"
  | "Execution"
  | "Outcome"
  | "Integrity"
  | "ReviewStatus"
;

export type ReasonCode =
  | "ARTIFACT_ID_MISSING"
  | "ARTIFACT_ID_INVALID"
  | "SERIES_ID_MISSING"
  | "TITLE_MISSING"
  | "OWNER_MISSING"
  | "STEWARD_MISSING"
  | "CREATED_AT_INVALID"
  | "PUBLISHED_AT_INVALID"
  | "STATUS_INVALID"
  | "CLASSIFICATION_INVALID"
  | "PROPOSED_ACTION_MISSING"
  | "CONSEQUENCE_MISSING"
  | "AFFECTED_SUBJECTS_MISSING"
  | "ENVIRONMENT_MISSING"
  | "ASSUMPTIONS_MISSING"
  | "DECLARED_LIMITS_MISSING"
  | "SCENARIO_CLASSIFICATION_MISSING"
  | "PRODUCTION_WITHOUT_AUTHORITY"
  | "CONSEQUENCE_SCOPE_UNBOUNDED"
  | "SCENARIO_SNAPSHOT_MISSING"
  | "ROUTE_ID_MISSING"
  | "ROUTE_VERSION_MISSING"
  | "GATE_ORDER_MISSING"
  | "GATE_ORDER_DUPLICATE"
  | "THRESHOLDS_MISSING"
  | "JURISDICTION_MISSING"
  | "MODEL_VERSION_MISSING"
  | "TOOL_VERSION_MISSING"
  | "REVALIDATION_TRIGGERS_MISSING"
  | "ROUTE_SNAPSHOT_MISSING"
  | "ROUTE_HASH_MISSING"
  | "ROUTE_HASH_MISMATCH"
  | "EVIDENCE_SET_EMPTY"
  | "EVIDENCE_ID_MISSING"
  | "EVIDENCE_SOURCE_MISSING"
  | "EVIDENCE_CAPTURE_TIME_INVALID"
  | "EVIDENCE_HASH_MISSING"
  | "EVIDENCE_CUSTODY_MISSING"
  | "EVIDENCE_FRESHNESS_UNKNOWN"
  | "EVIDENCE_EXPIRED"
  | "EVIDENCE_INADMISSIBLE"
  | "EVIDENCE_DISCLOSURE_MISSING"
  | "EVIDENCE_CONFLICT_UNRESOLVED"
  | "EVIDENCE_RELEVANCE_FAILED"
  | "EVIDENCE_SUFFICIENCY_FAILED"
  | "ACTOR_IDENTITY_MISSING"
  | "AUTHORITY_ROLE_MISSING"
  | "AUTHORITY_SOURCE_MISSING"
  | "AUTHORITY_SCOPE_MISSING"
  | "DELEGATION_CHAIN_MISSING"
  | "AUTHORITY_EXPIRY_INVALID"
  | "AUTHORITY_EXPIRED"
  | "AUTHORITY_REVOKED"
  | "AUTHORITY_CONFLICT"
  | "REQUIRED_CONCURRENCE_MISSING"
  | "AUTHORITY_SCOPE_EXCEEDED"
  | "AUTHORITY_SNAPSHOT_MISSING"
  | "CONTINUITY_RECORD_MISSING"
  | "IDENTITY_CONTINUITY_BROKEN"
  | "EVIDENCE_CONTINUITY_BROKEN"
  | "ROUTE_CONTINUITY_BROKEN"
  | "STATE_CHANGE_UNRECORDED"
  | "REVALIDATION_EVENT_MISSING"
  | "CUSTODY_CHAIN_BROKEN"
  | "TIME_WINDOW_BROKEN"
  | "MODEL_PARITY_BROKEN"
  | "TOOL_PARITY_BROKEN"
  | "GATE_LEDGER_EMPTY"
  | "GATE_ID_MISSING"
  | "GATE_SEQUENCE_INVALID"
  | "GATE_REQUIREMENT_MISSING"
  | "GATE_INPUT_MISSING"
  | "GATE_RESULT_MISSING"
  | "GATE_REASON_MISSING"
  | "EARLIEST_FAILURE_MISSING"
  | "MANDATORY_GATE_FAILED"
  | "GATE_BYPASS_ATTEMPTED"
  | "GATE_ORDER_MISMATCH"
  | "DETERMINATION_MISSING"
  | "DETERMINATION_INVALID"
  | "DETERMINATION_REASON_MISSING"
  | "COMMITTED_AT_INVALID"
  | "APPROVING_AUTHORITY_MISSING"
  | "PERMITTED_NEXT_ACTION_MISSING"
  | "LATE_APPROVAL_DETECTED"
  | "COMMIT_SNAPSHOT_MISSING"
  | "COMMIT_HASH_MISSING"
  | "EXECUTION_EFFECT_MISSING"
  | "ADAPTER_ID_MISSING"
  | "ATTEMPTED_ACTION_MISSING"
  | "COMMAND_MISSING"
  | "EXECUTION_RESULT_MISSING"
  | "STATUS_CODE_MISSING"
  | "TARGET_MISSING"
  | "EXECUTION_SCOPE_MISSING"
  | "BYPASS_STATE_MISSING"
  | "TOKEN_STATE_MISSING"
  | "ROLLBACK_STATE_MISSING"
  | "TECHNICAL_RECEIPT_MISSING"
  | "EXECUTION_SCOPE_EXCEEDED"
  | "DETERMINATION_EFFECT_MISMATCH"
  | "OUTCOME_MISSING"
  | "ACTUAL_RESULT_MISSING"
  | "CONSEQUENCE_STATE_MISSING"
  | "CLOSURE_EVIDENCE_MISSING"
  | "OUTCOME_VERIFIER_MISSING"
  | "OUTCOME_TIMESTAMP_INVALID"
  | "RESIDUAL_RISK_MISSING"
  | "FOLLOW_UP_MISSING"
  | "ZERO_ACTION_EVIDENCE_MISSING"
  | "OUTCOME_ASSERTED_ONLY"
  | "CANONICAL_HASH_MISSING"
  | "PACKAGE_HASH_MISSING"
  | "COMPONENT_HASHES_MISSING"
  | "SIGNATURE_METHOD_MISSING"
  | "VERIFIER_VERSION_MISSING"
  | "CANONICAL_HASH_MISMATCH"
  | "PACKAGE_HASH_MISMATCH"
  | "COMPONENT_HASH_MISMATCH"
  | "PDF_PARITY_FAILED"
  | "MANIFEST_PARITY_FAILED"
  | "REVIEW_LEVEL_MISSING"
  | "PUBLICATION_STATUS_INVALID"
  | "CHALLENGE_STATE_INVALID"
  | "CORRECTION_LINK_MISSING"
  | "SUPERSESSION_LINK_MISSING"
  | "WITHDRAWAL_REASON_MISSING"
  | "CLAIMS_BOUNDARY_MISSING"
  | "DEMO_PRODUCTION_LABEL_MISSING"
  | "PUBLIC_RELIANCE_NOT_ALLOWED"
;

export const REASON_CODE_DICTIONARY: Readonly<Record<ReasonCode, ReasonCodeDefinition>> = Object.freeze({
  ARTIFACT_ID_MISSING: {
    code: "ARTIFACT_ID_MISSING",
    domain: "RecordIdentity",
    message: "Artifact identifier is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  ARTIFACT_ID_INVALID: {
    code: "ARTIFACT_ID_INVALID",
    domain: "RecordIdentity",
    message: "Artifact identifier does not match the TA-14 artifact identifier grammar",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  SERIES_ID_MISSING: {
    code: "SERIES_ID_MISSING",
    domain: "RecordIdentity",
    message: "Series identifier is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  TITLE_MISSING: {
    code: "TITLE_MISSING",
    domain: "RecordIdentity",
    message: "Artifact title is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  OWNER_MISSING: {
    code: "OWNER_MISSING",
    domain: "RecordIdentity",
    message: "Accountable artifact owner is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  STEWARD_MISSING: {
    code: "STEWARD_MISSING",
    domain: "RecordIdentity",
    message: "Artifact steward is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  CREATED_AT_INVALID: {
    code: "CREATED_AT_INVALID",
    domain: "RecordIdentity",
    message: "Artifact creation timestamp is missing or invalid",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  PUBLISHED_AT_INVALID: {
    code: "PUBLISHED_AT_INVALID",
    domain: "RecordIdentity",
    message: "Artifact publication timestamp is invalid",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  STATUS_INVALID: {
    code: "STATUS_INVALID",
    domain: "RecordIdentity",
    message: "Artifact publication status is unsupported",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  CLASSIFICATION_INVALID: {
    code: "CLASSIFICATION_INVALID",
    domain: "RecordIdentity",
    message: "Artifact classification is unsupported",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  PROPOSED_ACTION_MISSING: {
    code: "PROPOSED_ACTION_MISSING",
    domain: "Scenario",
    message: "Proposed action is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  CONSEQUENCE_MISSING: {
    code: "CONSEQUENCE_MISSING",
    domain: "Scenario",
    message: "Proposed consequence is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  AFFECTED_SUBJECTS_MISSING: {
    code: "AFFECTED_SUBJECTS_MISSING",
    domain: "Scenario",
    message: "Affected subjects are not identified",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  ENVIRONMENT_MISSING: {
    code: "ENVIRONMENT_MISSING",
    domain: "Scenario",
    message: "Execution environment is not identified",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  ASSUMPTIONS_MISSING: {
    code: "ASSUMPTIONS_MISSING",
    domain: "Scenario",
    message: "Scenario assumptions are not declared",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  DECLARED_LIMITS_MISSING: {
    code: "DECLARED_LIMITS_MISSING",
    domain: "Scenario",
    message: "Scenario limits are not declared",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  SCENARIO_CLASSIFICATION_MISSING: {
    code: "SCENARIO_CLASSIFICATION_MISSING",
    domain: "Scenario",
    message: "Demonstration or production classification is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  PRODUCTION_WITHOUT_AUTHORITY: {
    code: "PRODUCTION_WITHOUT_AUTHORITY",
    domain: "Scenario",
    message: "Production scenario lacks production authority evidence",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  CONSEQUENCE_SCOPE_UNBOUNDED: {
    code: "CONSEQUENCE_SCOPE_UNBOUNDED",
    domain: "Scenario",
    message: "Consequence scope is not bounded",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  SCENARIO_SNAPSHOT_MISSING: {
    code: "SCENARIO_SNAPSHOT_MISSING",
    domain: "Scenario",
    message: "Frozen scenario snapshot is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  ROUTE_ID_MISSING: {
    code: "ROUTE_ID_MISSING",
    domain: "Route",
    message: "Route identifier is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  ROUTE_VERSION_MISSING: {
    code: "ROUTE_VERSION_MISSING",
    domain: "Route",
    message: "Route version is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  GATE_ORDER_MISSING: {
    code: "GATE_ORDER_MISSING",
    domain: "Route",
    message: "Route gate order is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  GATE_ORDER_DUPLICATE: {
    code: "GATE_ORDER_DUPLICATE",
    domain: "Route",
    message: "Route gate order contains duplicate sequence values",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  THRESHOLDS_MISSING: {
    code: "THRESHOLDS_MISSING",
    domain: "Route",
    message: "Route thresholds are missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  JURISDICTION_MISSING: {
    code: "JURISDICTION_MISSING",
    domain: "Route",
    message: "Applicable jurisdiction is missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  MODEL_VERSION_MISSING: {
    code: "MODEL_VERSION_MISSING",
    domain: "Route",
    message: "Model version is missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  TOOL_VERSION_MISSING: {
    code: "TOOL_VERSION_MISSING",
    domain: "Route",
    message: "Tool version is missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  REVALIDATION_TRIGGERS_MISSING: {
    code: "REVALIDATION_TRIGGERS_MISSING",
    domain: "Route",
    message: "Route revalidation triggers are missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  ROUTE_SNAPSHOT_MISSING: {
    code: "ROUTE_SNAPSHOT_MISSING",
    domain: "Route",
    message: "Frozen route snapshot is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  ROUTE_HASH_MISSING: {
    code: "ROUTE_HASH_MISSING",
    domain: "Route",
    message: "Route integrity hash is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  ROUTE_HASH_MISMATCH: {
    code: "ROUTE_HASH_MISMATCH",
    domain: "Route",
    message: "Route integrity hash does not match the frozen snapshot",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EVIDENCE_SET_EMPTY: {
    code: "EVIDENCE_SET_EMPTY",
    domain: "Evidence",
    message: "No evidence records were admitted",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EVIDENCE_ID_MISSING: {
    code: "EVIDENCE_ID_MISSING",
    domain: "Evidence",
    message: "Evidence identifier is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EVIDENCE_SOURCE_MISSING: {
    code: "EVIDENCE_SOURCE_MISSING",
    domain: "Evidence",
    message: "Evidence source is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EVIDENCE_CAPTURE_TIME_INVALID: {
    code: "EVIDENCE_CAPTURE_TIME_INVALID",
    domain: "Evidence",
    message: "Evidence capture timestamp is invalid",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EVIDENCE_HASH_MISSING: {
    code: "EVIDENCE_HASH_MISSING",
    domain: "Evidence",
    message: "Evidence integrity hash is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EVIDENCE_CUSTODY_MISSING: {
    code: "EVIDENCE_CUSTODY_MISSING",
    domain: "Evidence",
    message: "Evidence custody state is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EVIDENCE_FRESHNESS_UNKNOWN: {
    code: "EVIDENCE_FRESHNESS_UNKNOWN",
    domain: "Evidence",
    message: "Evidence freshness state is unknown",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  EVIDENCE_EXPIRED: {
    code: "EVIDENCE_EXPIRED",
    domain: "Evidence",
    message: "Evidence expired before commit",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  EVIDENCE_INADMISSIBLE: {
    code: "EVIDENCE_INADMISSIBLE",
    domain: "Evidence",
    message: "Evidence is inadmissible for the governing question",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  EVIDENCE_DISCLOSURE_MISSING: {
    code: "EVIDENCE_DISCLOSURE_MISSING",
    domain: "Evidence",
    message: "Evidence disclosure state is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EVIDENCE_CONFLICT_UNRESOLVED: {
    code: "EVIDENCE_CONFLICT_UNRESOLVED",
    domain: "Evidence",
    message: "Conflicting evidence remains unresolved",
    disposition: "ESCALATE",
    publicRelianceBlocked: true,
    repairHint: "Route the bounded issue to the designated human or institutional authority.",
  },
  EVIDENCE_RELEVANCE_FAILED: {
    code: "EVIDENCE_RELEVANCE_FAILED",
    domain: "Evidence",
    message: "Evidence is not relevant to the exact governing question",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  EVIDENCE_SUFFICIENCY_FAILED: {
    code: "EVIDENCE_SUFFICIENCY_FAILED",
    domain: "Evidence",
    message: "Evidence is insufficient for the consequence at stake",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  ACTOR_IDENTITY_MISSING: {
    code: "ACTOR_IDENTITY_MISSING",
    domain: "Authority",
    message: "Actor identity is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  AUTHORITY_ROLE_MISSING: {
    code: "AUTHORITY_ROLE_MISSING",
    domain: "Authority",
    message: "Authority role is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  AUTHORITY_SOURCE_MISSING: {
    code: "AUTHORITY_SOURCE_MISSING",
    domain: "Authority",
    message: "Authority source is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  AUTHORITY_SCOPE_MISSING: {
    code: "AUTHORITY_SCOPE_MISSING",
    domain: "Authority",
    message: "Authority scope is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  DELEGATION_CHAIN_MISSING: {
    code: "DELEGATION_CHAIN_MISSING",
    domain: "Authority",
    message: "Delegation chain is missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  AUTHORITY_EXPIRY_INVALID: {
    code: "AUTHORITY_EXPIRY_INVALID",
    domain: "Authority",
    message: "Authority validity window is invalid",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  AUTHORITY_EXPIRED: {
    code: "AUTHORITY_EXPIRED",
    domain: "Authority",
    message: "Authority expired before execution",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  AUTHORITY_REVOKED: {
    code: "AUTHORITY_REVOKED",
    domain: "Authority",
    message: "Authority was revoked before execution",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  AUTHORITY_CONFLICT: {
    code: "AUTHORITY_CONFLICT",
    domain: "Authority",
    message: "Authority conflict requires adjudication",
    disposition: "ESCALATE",
    publicRelianceBlocked: true,
    repairHint: "Route the bounded issue to the designated human or institutional authority.",
  },
  REQUIRED_CONCURRENCE_MISSING: {
    code: "REQUIRED_CONCURRENCE_MISSING",
    domain: "Authority",
    message: "Required concurrence is missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  AUTHORITY_SCOPE_EXCEEDED: {
    code: "AUTHORITY_SCOPE_EXCEEDED",
    domain: "Authority",
    message: "Requested action exceeds granted authority",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  AUTHORITY_SNAPSHOT_MISSING: {
    code: "AUTHORITY_SNAPSHOT_MISSING",
    domain: "Authority",
    message: "Frozen authority snapshot is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  CONTINUITY_RECORD_MISSING: {
    code: "CONTINUITY_RECORD_MISSING",
    domain: "Continuity",
    message: "Continuity record is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  IDENTITY_CONTINUITY_BROKEN: {
    code: "IDENTITY_CONTINUITY_BROKEN",
    domain: "Continuity",
    message: "Identity continuity is broken",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  EVIDENCE_CONTINUITY_BROKEN: {
    code: "EVIDENCE_CONTINUITY_BROKEN",
    domain: "Continuity",
    message: "Evidence continuity is broken",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  ROUTE_CONTINUITY_BROKEN: {
    code: "ROUTE_CONTINUITY_BROKEN",
    domain: "Continuity",
    message: "Route continuity is broken",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  STATE_CHANGE_UNRECORDED: {
    code: "STATE_CHANGE_UNRECORDED",
    domain: "Continuity",
    message: "Material state change was not recorded",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  REVALIDATION_EVENT_MISSING: {
    code: "REVALIDATION_EVENT_MISSING",
    domain: "Continuity",
    message: "Required revalidation event is missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  CUSTODY_CHAIN_BROKEN: {
    code: "CUSTODY_CHAIN_BROKEN",
    domain: "Continuity",
    message: "Chain of custody is broken",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  TIME_WINDOW_BROKEN: {
    code: "TIME_WINDOW_BROKEN",
    domain: "Continuity",
    message: "Applicable time window is broken",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  MODEL_PARITY_BROKEN: {
    code: "MODEL_PARITY_BROKEN",
    domain: "Continuity",
    message: "Runtime model does not match committed model",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  TOOL_PARITY_BROKEN: {
    code: "TOOL_PARITY_BROKEN",
    domain: "Continuity",
    message: "Runtime tool does not match committed tool",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  GATE_LEDGER_EMPTY: {
    code: "GATE_LEDGER_EMPTY",
    domain: "GateLedger",
    message: "Gate ledger is empty",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  GATE_ID_MISSING: {
    code: "GATE_ID_MISSING",
    domain: "GateLedger",
    message: "Gate identifier is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  GATE_SEQUENCE_INVALID: {
    code: "GATE_SEQUENCE_INVALID",
    domain: "GateLedger",
    message: "Gate sequence is invalid",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  GATE_REQUIREMENT_MISSING: {
    code: "GATE_REQUIREMENT_MISSING",
    domain: "GateLedger",
    message: "Gate requirement is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  GATE_INPUT_MISSING: {
    code: "GATE_INPUT_MISSING",
    domain: "GateLedger",
    message: "Gate input reference is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  GATE_RESULT_MISSING: {
    code: "GATE_RESULT_MISSING",
    domain: "GateLedger",
    message: "Gate result is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  GATE_REASON_MISSING: {
    code: "GATE_REASON_MISSING",
    domain: "GateLedger",
    message: "Gate reason is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EARLIEST_FAILURE_MISSING: {
    code: "EARLIEST_FAILURE_MISSING",
    domain: "GateLedger",
    message: "Earliest controlling failure is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  MANDATORY_GATE_FAILED: {
    code: "MANDATORY_GATE_FAILED",
    domain: "GateLedger",
    message: "A mandatory gate failed",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  GATE_BYPASS_ATTEMPTED: {
    code: "GATE_BYPASS_ATTEMPTED",
    domain: "GateLedger",
    message: "A mandatory gate bypass was attempted",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  GATE_ORDER_MISMATCH: {
    code: "GATE_ORDER_MISMATCH",
    domain: "GateLedger",
    message: "Gate ledger order does not match route order",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  DETERMINATION_MISSING: {
    code: "DETERMINATION_MISSING",
    domain: "Commit",
    message: "Committed determination is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  DETERMINATION_INVALID: {
    code: "DETERMINATION_INVALID",
    domain: "Commit",
    message: "Committed determination is unsupported",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  DETERMINATION_REASON_MISSING: {
    code: "DETERMINATION_REASON_MISSING",
    domain: "Commit",
    message: "Determination reason is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  COMMITTED_AT_INVALID: {
    code: "COMMITTED_AT_INVALID",
    domain: "Commit",
    message: "Commit timestamp is missing or invalid",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  APPROVING_AUTHORITY_MISSING: {
    code: "APPROVING_AUTHORITY_MISSING",
    domain: "Commit",
    message: "Approving authority is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  PERMITTED_NEXT_ACTION_MISSING: {
    code: "PERMITTED_NEXT_ACTION_MISSING",
    domain: "Commit",
    message: "Permitted next action is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  LATE_APPROVAL_DETECTED: {
    code: "LATE_APPROVAL_DETECTED",
    domain: "Commit",
    message: "Post-event approval cannot be inserted into the original commit",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  COMMIT_SNAPSHOT_MISSING: {
    code: "COMMIT_SNAPSHOT_MISSING",
    domain: "Commit",
    message: "Frozen commit snapshot is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  COMMIT_HASH_MISSING: {
    code: "COMMIT_HASH_MISSING",
    domain: "Commit",
    message: "Commit integrity hash is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EXECUTION_EFFECT_MISSING: {
    code: "EXECUTION_EFFECT_MISSING",
    domain: "Execution",
    message: "Execution effect is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  ADAPTER_ID_MISSING: {
    code: "ADAPTER_ID_MISSING",
    domain: "Execution",
    message: "Execution adapter identifier is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  ATTEMPTED_ACTION_MISSING: {
    code: "ATTEMPTED_ACTION_MISSING",
    domain: "Execution",
    message: "Attempted action is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  COMMAND_MISSING: {
    code: "COMMAND_MISSING",
    domain: "Execution",
    message: "Execution command is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EXECUTION_RESULT_MISSING: {
    code: "EXECUTION_RESULT_MISSING",
    domain: "Execution",
    message: "Execution result is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  STATUS_CODE_MISSING: {
    code: "STATUS_CODE_MISSING",
    domain: "Execution",
    message: "Execution status code is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  TARGET_MISSING: {
    code: "TARGET_MISSING",
    domain: "Execution",
    message: "Execution target is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EXECUTION_SCOPE_MISSING: {
    code: "EXECUTION_SCOPE_MISSING",
    domain: "Execution",
    message: "Execution scope is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  BYPASS_STATE_MISSING: {
    code: "BYPASS_STATE_MISSING",
    domain: "Execution",
    message: "Bypass state is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  TOKEN_STATE_MISSING: {
    code: "TOKEN_STATE_MISSING",
    domain: "Execution",
    message: "Token state is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  ROLLBACK_STATE_MISSING: {
    code: "ROLLBACK_STATE_MISSING",
    domain: "Execution",
    message: "Rollback state is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  TECHNICAL_RECEIPT_MISSING: {
    code: "TECHNICAL_RECEIPT_MISSING",
    domain: "Execution",
    message: "Technical execution receipt is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  EXECUTION_SCOPE_EXCEEDED: {
    code: "EXECUTION_SCOPE_EXCEEDED",
    domain: "Execution",
    message: "Execution exceeded the committed scope",
    disposition: "DENY",
    publicRelianceBlocked: true,
    repairHint: "Do not execute under the current state; establish new lawful and admissible conditions.",
  },
  DETERMINATION_EFFECT_MISMATCH: {
    code: "DETERMINATION_EFFECT_MISMATCH",
    domain: "Execution",
    message: "Technical effect does not match the committed determination",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  OUTCOME_MISSING: {
    code: "OUTCOME_MISSING",
    domain: "Outcome",
    message: "Outcome record is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  ACTUAL_RESULT_MISSING: {
    code: "ACTUAL_RESULT_MISSING",
    domain: "Outcome",
    message: "Actual result is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  CONSEQUENCE_STATE_MISSING: {
    code: "CONSEQUENCE_STATE_MISSING",
    domain: "Outcome",
    message: "Consequence state is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  CLOSURE_EVIDENCE_MISSING: {
    code: "CLOSURE_EVIDENCE_MISSING",
    domain: "Outcome",
    message: "Outcome closure evidence is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  OUTCOME_VERIFIER_MISSING: {
    code: "OUTCOME_VERIFIER_MISSING",
    domain: "Outcome",
    message: "Outcome verifier identity is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  OUTCOME_TIMESTAMP_INVALID: {
    code: "OUTCOME_TIMESTAMP_INVALID",
    domain: "Outcome",
    message: "Outcome timestamp is missing or invalid",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  RESIDUAL_RISK_MISSING: {
    code: "RESIDUAL_RISK_MISSING",
    domain: "Outcome",
    message: "Residual risk statement is missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  FOLLOW_UP_MISSING: {
    code: "FOLLOW_UP_MISSING",
    domain: "Outcome",
    message: "Required follow-up is missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  ZERO_ACTION_EVIDENCE_MISSING: {
    code: "ZERO_ACTION_EVIDENCE_MISSING",
    domain: "Outcome",
    message: "Blocked or held action lacks zero-action evidence",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  OUTCOME_ASSERTED_ONLY: {
    code: "OUTCOME_ASSERTED_ONLY",
    domain: "Outcome",
    message: "Outcome is asserted without supporting evidence",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  CANONICAL_HASH_MISSING: {
    code: "CANONICAL_HASH_MISSING",
    domain: "Integrity",
    message: "Canonical record hash is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  PACKAGE_HASH_MISSING: {
    code: "PACKAGE_HASH_MISSING",
    domain: "Integrity",
    message: "Package-root hash is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  COMPONENT_HASHES_MISSING: {
    code: "COMPONENT_HASHES_MISSING",
    domain: "Integrity",
    message: "Component hashes are missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  SIGNATURE_METHOD_MISSING: {
    code: "SIGNATURE_METHOD_MISSING",
    domain: "Integrity",
    message: "Signature method is missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  VERIFIER_VERSION_MISSING: {
    code: "VERIFIER_VERSION_MISSING",
    domain: "Integrity",
    message: "Verifier version is missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  CANONICAL_HASH_MISMATCH: {
    code: "CANONICAL_HASH_MISMATCH",
    domain: "Integrity",
    message: "Canonical record hash mismatch detected",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  PACKAGE_HASH_MISMATCH: {
    code: "PACKAGE_HASH_MISMATCH",
    domain: "Integrity",
    message: "Package-root hash mismatch detected",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  COMPONENT_HASH_MISMATCH: {
    code: "COMPONENT_HASH_MISMATCH",
    domain: "Integrity",
    message: "Component hash mismatch detected",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  PDF_PARITY_FAILED: {
    code: "PDF_PARITY_FAILED",
    domain: "Integrity",
    message: "PDF does not resolve to the canonical record",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  MANIFEST_PARITY_FAILED: {
    code: "MANIFEST_PARITY_FAILED",
    domain: "Integrity",
    message: "Manifest does not resolve to the canonical record",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  REVIEW_LEVEL_MISSING: {
    code: "REVIEW_LEVEL_MISSING",
    domain: "ReviewStatus",
    message: "Review level is missing",
    disposition: "HOLD",
    publicRelianceBlocked: true,
    repairHint: "Repair the condition and revalidate before execution or publication.",
  },
  PUBLICATION_STATUS_INVALID: {
    code: "PUBLICATION_STATUS_INVALID",
    domain: "ReviewStatus",
    message: "Publication status is invalid",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  CHALLENGE_STATE_INVALID: {
    code: "CHALLENGE_STATE_INVALID",
    domain: "ReviewStatus",
    message: "Challenge state is invalid",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  CORRECTION_LINK_MISSING: {
    code: "CORRECTION_LINK_MISSING",
    domain: "ReviewStatus",
    message: "Correction lacks a link to the original artifact",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  SUPERSESSION_LINK_MISSING: {
    code: "SUPERSESSION_LINK_MISSING",
    domain: "ReviewStatus",
    message: "Supersession lacks a link to the prior artifact",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  WITHDRAWAL_REASON_MISSING: {
    code: "WITHDRAWAL_REASON_MISSING",
    domain: "ReviewStatus",
    message: "Withdrawal reason is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  CLAIMS_BOUNDARY_MISSING: {
    code: "CLAIMS_BOUNDARY_MISSING",
    domain: "ReviewStatus",
    message: "Claims boundary is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  DEMO_PRODUCTION_LABEL_MISSING: {
    code: "DEMO_PRODUCTION_LABEL_MISSING",
    domain: "ReviewStatus",
    message: "Demonstration or production label is missing",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
  PUBLIC_RELIANCE_NOT_ALLOWED: {
    code: "PUBLIC_RELIANCE_NOT_ALLOWED",
    domain: "ReviewStatus",
    message: "Record is unsuitable for public reliance",
    disposition: "BLOCK",
    publicRelianceBlocked: true,
    repairHint: "Complete or correct the required record before publication.",
  },
});


const DISPOSITION_WEIGHT: Readonly<Record<ValidationDisposition, number>> = Object.freeze({
  PASS: 0,
  HOLD: 1,
  ESCALATE: 2,
  BLOCK: 3,
  DENY: 4,
});

const ARTIFACT_ID_PATTERN = /^TA14-EA-\d{6}$/;
const HASH_PATTERN = /^(?:sha256:)?[a-f0-9]{64}$/i;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function isIsoDate(value: unknown): value is string {
  if (!isNonEmptyString(value)) return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp);
}

function isHash(value: unknown): value is string {
  return isNonEmptyString(value) && HASH_PATTERN.test(value.trim());
}

function toMillis(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function issue(code: ReasonCode, path: string, details?: Record<string, unknown>): ValidationIssue {
  const definition = REASON_CODE_DICTIONARY[code];
  return {
    code,
    path,
    message: definition.message,
    disposition: definition.disposition,
    publicRelianceBlocked: definition.publicRelianceBlocked,
    repairHint: definition.repairHint,
    details,
  };
}

function highestDisposition(issues: readonly ValidationIssue[]): ValidationDisposition {
  let highest: ValidationDisposition = "PASS";
  for (const current of issues) {
    if (DISPOSITION_WEIGHT[current.disposition] > DISPOSITION_WEIGHT[highest]) {
      highest = current.disposition;
    }
  }
  return highest;
}

function emptyCounts(): Record<ValidationDisposition, number> {
  return { PASS: 0, HOLD: 0, BLOCK: 0, DENY: 0, ESCALATE: 0 };
}

function validateIdentity(record: CanonicalExecutionArtifact, issues: ValidationIssue[]): void {
  const id = record.identity;
  if (!isNonEmptyString(id.artifactId)) issues.push(issue("ARTIFACT_ID_MISSING", "identity.artifactId"));
  else if (!ARTIFACT_ID_PATTERN.test(id.artifactId)) issues.push(issue("ARTIFACT_ID_INVALID", "identity.artifactId", { value: id.artifactId }));
  if (!isNonEmptyString(id.seriesId)) issues.push(issue("SERIES_ID_MISSING", "identity.seriesId"));
  if (!isNonEmptyString(id.title)) issues.push(issue("TITLE_MISSING", "identity.title"));
  if (!isNonEmptyString(id.owner)) issues.push(issue("OWNER_MISSING", "identity.owner"));
  if (!isNonEmptyString(id.steward)) issues.push(issue("STEWARD_MISSING", "identity.steward"));
  if (!isIsoDate(id.createdAt)) issues.push(issue("CREATED_AT_INVALID", "identity.createdAt"));
  if (id.publishedAt && !isIsoDate(id.publishedAt)) issues.push(issue("PUBLISHED_AT_INVALID", "identity.publishedAt"));
  if (!["DRAFT","INTERNAL_REVIEW","READY","PUBLISHED","CHALLENGED","CORRECTED","SUPERSEDED","WITHDRAWN"].includes(id.status)) {
    issues.push(issue("STATUS_INVALID", "identity.status", { value: id.status }));
  }
  if (!["DEMONSTRATION","PRODUCTION"].includes(id.classification)) {
    issues.push(issue("CLASSIFICATION_INVALID", "identity.classification", { value: id.classification }));
  }
}

function validateScenario(record: CanonicalExecutionArtifact, issues: ValidationIssue[]): void {
  const s = record.scenario;
  if (!isNonEmptyString(s.proposedAction)) issues.push(issue("PROPOSED_ACTION_MISSING", "scenario.proposedAction"));
  if (!isNonEmptyString(s.consequence)) issues.push(issue("CONSEQUENCE_MISSING", "scenario.consequence"));
  if (!isStringArray(s.affectedSubjects)) issues.push(issue("AFFECTED_SUBJECTS_MISSING", "scenario.affectedSubjects"));
  if (!isNonEmptyString(s.environment)) issues.push(issue("ENVIRONMENT_MISSING", "scenario.environment"));
  if (!isStringArray(s.assumptions)) issues.push(issue("ASSUMPTIONS_MISSING", "scenario.assumptions"));
  if (!isStringArray(s.declaredLimits)) issues.push(issue("DECLARED_LIMITS_MISSING", "scenario.declaredLimits"));
  if (!["DEMONSTRATION","PRODUCTION"].includes(s.classification)) issues.push(issue("SCENARIO_CLASSIFICATION_MISSING", "scenario.classification"));
  if (!isNonEmptyString(s.frozenSnapshot)) issues.push(issue("SCENARIO_SNAPSHOT_MISSING", "scenario.frozenSnapshot"));
  if (s.classification !== record.identity.classification) {
    issues.push(issue("SCENARIO_CLASSIFICATION_MISSING", "scenario.classification", { identityClassification: record.identity.classification, scenarioClassification: s.classification }));
  }
}

function validateRoute(record: CanonicalExecutionArtifact, issues: ValidationIssue[]): void {
  const r = record.route;
  if (!isNonEmptyString(r.routeId)) issues.push(issue("ROUTE_ID_MISSING", "route.routeId"));
  if (!isNonEmptyString(r.version)) issues.push(issue("ROUTE_VERSION_MISSING", "route.version"));
  if (!Array.isArray(r.gateOrder) || r.gateOrder.length === 0) issues.push(issue("GATE_ORDER_MISSING", "route.gateOrder"));
  else {
    const sequences = r.gateOrder.map(g => g.sequence);
    if (new Set(sequences).size !== sequences.length) issues.push(issue("GATE_ORDER_DUPLICATE", "route.gateOrder"));
  }
  if (!isObject(r.thresholds) || Object.keys(r.thresholds).length === 0) issues.push(issue("THRESHOLDS_MISSING", "route.thresholds"));
  if (!isStringArray(r.jurisdiction)) issues.push(issue("JURISDICTION_MISSING", "route.jurisdiction"));
  if (!isStringArray(r.modelVersions)) issues.push(issue("MODEL_VERSION_MISSING", "route.modelVersions"));
  if (!isStringArray(r.toolVersions)) issues.push(issue("TOOL_VERSION_MISSING", "route.toolVersions"));
  if (!isStringArray(r.revalidationTriggers)) issues.push(issue("REVALIDATION_TRIGGERS_MISSING", "route.revalidationTriggers"));
  if (!isNonEmptyString(r.frozenSnapshot)) issues.push(issue("ROUTE_SNAPSHOT_MISSING", "route.frozenSnapshot"));
  if (!isHash(r.routeHash)) issues.push(issue("ROUTE_HASH_MISSING", "route.routeHash"));
}

function validateEvidence(record: CanonicalExecutionArtifact, issues: ValidationIssue[], now: number): void {
  if (!Array.isArray(record.evidence) || record.evidence.length === 0) {
    issues.push(issue("EVIDENCE_SET_EMPTY", "evidence"));
    return;
  }
  record.evidence.forEach((e, index) => {
    const p = `evidence[${index}]`;
    if (!isNonEmptyString(e.evidenceId)) issues.push(issue("EVIDENCE_ID_MISSING", `${p}.evidenceId`));
    if (!isNonEmptyString(e.source)) issues.push(issue("EVIDENCE_SOURCE_MISSING", `${p}.source`));
    if (!isIsoDate(e.capturedAt)) issues.push(issue("EVIDENCE_CAPTURE_TIME_INVALID", `${p}.capturedAt`));
    if (!isHash(e.hash)) issues.push(issue("EVIDENCE_HASH_MISSING", `${p}.hash`));
    if (!isStringArray(e.custody)) issues.push(issue("EVIDENCE_CUSTODY_MISSING", `${p}.custody`));
    if (e.freshness === "UNKNOWN") issues.push(issue("EVIDENCE_FRESHNESS_UNKNOWN", `${p}.freshness`));
    const validUntil = toMillis(e.validUntil);
    if (e.freshness === "EXPIRED" || (validUntil !== undefined && validUntil < now)) issues.push(issue("EVIDENCE_EXPIRED", `${p}.validUntil`, { validUntil: e.validUntil }));
    if (e.admissibility === "REJECTED") issues.push(issue("EVIDENCE_INADMISSIBLE", `${p}.admissibility`));
    if (!e.disclosure) issues.push(issue("EVIDENCE_DISCLOSURE_MISSING", `${p}.disclosure`));
    if (e.conflict === "UNRESOLVED") issues.push(issue("EVIDENCE_CONFLICT_UNRESOLVED", `${p}.conflict`));
    if (e.relevance === "FAIL") issues.push(issue("EVIDENCE_RELEVANCE_FAILED", `${p}.relevance`));
    if (e.sufficiency === "FAIL" || e.sufficiency === "PENDING") issues.push(issue("EVIDENCE_SUFFICIENCY_FAILED", `${p}.sufficiency`));
  });
}

function validateAuthority(record: CanonicalExecutionArtifact, issues: ValidationIssue[], now: number): void {
  if (!Array.isArray(record.authority) || record.authority.length === 0) {
    issues.push(issue("ACTOR_IDENTITY_MISSING", "authority"));
    return;
  }
  record.authority.forEach((a, index) => {
    const p = `authority[${index}]`;
    if (!isNonEmptyString(a.actorId)) issues.push(issue("ACTOR_IDENTITY_MISSING", `${p}.actorId`));
    if (!isNonEmptyString(a.role)) issues.push(issue("AUTHORITY_ROLE_MISSING", `${p}.role`));
    if (!isNonEmptyString(a.source)) issues.push(issue("AUTHORITY_SOURCE_MISSING", `${p}.source`));
    if (!isStringArray(a.scope)) issues.push(issue("AUTHORITY_SCOPE_MISSING", `${p}.scope`));
    if (!Array.isArray(a.delegationChain)) issues.push(issue("DELEGATION_CHAIN_MISSING", `${p}.delegationChain`));
    if (!isIsoDate(a.validFrom) || (a.validUntil && !isIsoDate(a.validUntil))) issues.push(issue("AUTHORITY_EXPIRY_INVALID", p));
    const validUntil = toMillis(a.validUntil);
    if (validUntil !== undefined && validUntil < now) issues.push(issue("AUTHORITY_EXPIRED", `${p}.validUntil`));
    const revokedAt = toMillis(a.revokedAt);
    if (revokedAt !== undefined && revokedAt <= now) issues.push(issue("AUTHORITY_REVOKED", `${p}.revokedAt`));
    if (a.conflict === "UNRESOLVED") issues.push(issue("AUTHORITY_CONFLICT", `${p}.conflict`));
    const missingConcurrence = a.requiredConcurrence.filter(x => !a.concurrenceReceived.includes(x));
    if (missingConcurrence.length) issues.push(issue("REQUIRED_CONCURRENCE_MISSING", `${p}.concurrenceReceived`, { missingConcurrence }));
    if (!isNonEmptyString(a.frozenSnapshot)) issues.push(issue("AUTHORITY_SNAPSHOT_MISSING", `${p}.frozenSnapshot`));
  });
}

function validateContinuity(record: CanonicalExecutionArtifact, issues: ValidationIssue[]): void {
  const c = record.continuity;
  if (!c) { issues.push(issue("CONTINUITY_RECORD_MISSING", "continuity")); return; }
  if (!c.identityContinuous) issues.push(issue("IDENTITY_CONTINUITY_BROKEN", "continuity.identityContinuous"));
  if (!c.evidenceContinuous) issues.push(issue("EVIDENCE_CONTINUITY_BROKEN", "continuity.evidenceContinuous"));
  if (!c.routeContinuous) issues.push(issue("ROUTE_CONTINUITY_BROKEN", "continuity.routeContinuous"));
  if (!c.custodyContinuous) issues.push(issue("CUSTODY_CHAIN_BROKEN", "continuity.custodyContinuous"));
  if (!c.timeWindowContinuous) issues.push(issue("TIME_WINDOW_BROKEN", "continuity.timeWindowContinuous"));
  if (!c.modelParity) issues.push(issue("MODEL_PARITY_BROKEN", "continuity.modelParity"));
  if (!c.toolParity) issues.push(issue("TOOL_PARITY_BROKEN", "continuity.toolParity"));
  for (const [index, event] of c.events.entries()) {
    if (event.material && event.revalidationRequired && !event.revalidationCompleted) {
      issues.push(issue("REVALIDATION_EVENT_MISSING", `continuity.events[${index}]`, { eventId: event.eventId }));
    }
  }
}

function validateGateLedger(record: CanonicalExecutionArtifact, issues: ValidationIssue[]): void {
  const ledger = record.gateLedger;
  if (!ledger || !Array.isArray(ledger.entries) || ledger.entries.length === 0) {
    issues.push(issue("GATE_LEDGER_EMPTY", "gateLedger.entries"));
    return;
  }
  const routeById = new Map(record.route.gateOrder.map(g => [g.gateId, g]));
  let firstFailure: GateLedgerEntry | undefined;
  ledger.entries.forEach((g, index) => {
    const p = `gateLedger.entries[${index}]`;
    if (!isNonEmptyString(g.gateId)) issues.push(issue("GATE_ID_MISSING", `${p}.gateId`));
    if (!Number.isInteger(g.sequence) || g.sequence < 1) issues.push(issue("GATE_SEQUENCE_INVALID", `${p}.sequence`));
    if (!isNonEmptyString(g.requirement)) issues.push(issue("GATE_REQUIREMENT_MISSING", `${p}.requirement`));
    if (!isStringArray(g.inputRefs)) issues.push(issue("GATE_INPUT_MISSING", `${p}.inputRefs`));
    if (!g.result) issues.push(issue("GATE_RESULT_MISSING", `${p}.result`));
    if (!isStringArray(g.reasonCodes)) issues.push(issue("GATE_REASON_MISSING", `${p}.reasonCodes`));
    const routeGate = routeById.get(g.gateId);
    if (!routeGate || routeGate.sequence !== g.sequence) issues.push(issue("GATE_ORDER_MISMATCH", p, { gateId: g.gateId }));
    if (!firstFailure && g.mandatory && ["FAIL","HOLD","ESCALATE"].includes(g.result)) firstFailure = g;
    if (g.mandatory && g.result === "FAIL") issues.push(issue("MANDATORY_GATE_FAILED", p, { gateId: g.gateId }));
  });
  if (firstFailure && ledger.earliestFailureGateId !== firstFailure.gateId) {
    issues.push(issue("EARLIEST_FAILURE_MISSING", "gateLedger.earliestFailureGateId", { expected: firstFailure.gateId, actual: ledger.earliestFailureGateId }));
  }
  if (ledger.bypassAttempted) issues.push(issue("GATE_BYPASS_ATTEMPTED", "gateLedger.bypassAttempted"));
}

function validateCommit(record: CanonicalExecutionArtifact, issues: ValidationIssue[]): void {
  const c = record.commit;
  if (!c.determination) issues.push(issue("DETERMINATION_MISSING", "commit.determination"));
  if (!["ALLOW","HOLD","DENY","ESCALATE"].includes(c.determination)) issues.push(issue("DETERMINATION_INVALID", "commit.determination"));
  if (!isStringArray(c.reasons)) issues.push(issue("DETERMINATION_REASON_MISSING", "commit.reasons"));
  if (!isIsoDate(c.committedAt)) issues.push(issue("COMMITTED_AT_INVALID", "commit.committedAt"));
  if (!isStringArray(c.approvingAuthority)) issues.push(issue("APPROVING_AUTHORITY_MISSING", "commit.approvingAuthority"));
  if (!isNonEmptyString(c.permittedNextAction)) issues.push(issue("PERMITTED_NEXT_ACTION_MISSING", "commit.permittedNextAction"));
  if (c.postEventApprovalDetected) issues.push(issue("LATE_APPROVAL_DETECTED", "commit.postEventApprovalDetected"));
  if (!isNonEmptyString(c.frozenSnapshot)) issues.push(issue("COMMIT_SNAPSHOT_MISSING", "commit.frozenSnapshot"));
  if (!isHash(c.commitHash)) issues.push(issue("COMMIT_HASH_MISSING", "commit.commitHash"));
}

function expectedExecutionResults(determination: Determination): readonly ExecutionEffectRecord["result"][] {
  switch (determination) {
    case "ALLOW": return ["RELEASED"];
    case "HOLD": return ["HELD", "NOT_ATTEMPTED"];
    case "DENY": return ["BLOCKED", "TERMINATED", "NOT_ATTEMPTED"];
    case "ESCALATE": return ["ROUTED", "HELD", "NOT_ATTEMPTED"];
  }
}

function validateExecution(record: CanonicalExecutionArtifact, issues: ValidationIssue[]): void {
  const e = record.execution;
  if (!e) { issues.push(issue("EXECUTION_EFFECT_MISSING", "execution")); return; }
  if (!isNonEmptyString(e.adapterId)) issues.push(issue("ADAPTER_ID_MISSING", "execution.adapterId"));
  if (!isNonEmptyString(e.attemptedAction)) issues.push(issue("ATTEMPTED_ACTION_MISSING", "execution.attemptedAction"));
  if (!isNonEmptyString(e.command)) issues.push(issue("COMMAND_MISSING", "execution.command"));
  if (!e.result) issues.push(issue("EXECUTION_RESULT_MISSING", "execution.result"));
  if (e.statusCode === "" || e.statusCode === undefined || e.statusCode === null) issues.push(issue("STATUS_CODE_MISSING", "execution.statusCode"));
  if (!isNonEmptyString(e.target)) issues.push(issue("TARGET_MISSING", "execution.target"));
  if (!isStringArray(e.scope)) issues.push(issue("EXECUTION_SCOPE_MISSING", "execution.scope"));
  if (!Array.isArray(e.bypassAttempts)) issues.push(issue("BYPASS_STATE_MISSING", "execution.bypassAttempts"));
  if (!e.tokenState) issues.push(issue("TOKEN_STATE_MISSING", "execution.tokenState"));
  if (!e.rollbackState) issues.push(issue("ROLLBACK_STATE_MISSING", "execution.rollbackState"));
  if (!isNonEmptyString(e.technicalReceipt)) issues.push(issue("TECHNICAL_RECEIPT_MISSING", "execution.technicalReceipt"));
  const expected = expectedExecutionResults(record.commit.determination);
  if (!expected.includes(e.result)) issues.push(issue("DETERMINATION_EFFECT_MISMATCH", "execution.result", { determination: record.commit.determination, expected, actual: e.result }));
  if (e.bypassAttempts.length > 0 && record.commit.determination !== "ALLOW") {
    const blockedState = e.tokenState === "REVOKED" || e.tokenState === "SUSPENDED";
    if (!blockedState) issues.push(issue("EXECUTION_SCOPE_EXCEEDED", "execution.tokenState", { bypassAttempts: e.bypassAttempts }));
  }
}

function validateOutcome(record: CanonicalExecutionArtifact, issues: ValidationIssue[]): void {
  const o = record.outcome;
  if (!o) { issues.push(issue("OUTCOME_MISSING", "outcome")); return; }
  if (!isNonEmptyString(o.actualResult)) issues.push(issue("ACTUAL_RESULT_MISSING", "outcome.actualResult"));
  if (!o.consequenceState) issues.push(issue("CONSEQUENCE_STATE_MISSING", "outcome.consequenceState"));
  if (!isStringArray(o.closureEvidence)) issues.push(issue("CLOSURE_EVIDENCE_MISSING", "outcome.closureEvidence"));
  if (!isNonEmptyString(o.verifierId)) issues.push(issue("OUTCOME_VERIFIER_MISSING", "outcome.verifierId"));
  if (!isIsoDate(o.verifiedAt)) issues.push(issue("OUTCOME_TIMESTAMP_INVALID", "outcome.verifiedAt"));
  if (!isNonEmptyString(o.residualRisk)) issues.push(issue("RESIDUAL_RISK_MISSING", "outcome.residualRisk"));
  if (!Array.isArray(o.followUp)) issues.push(issue("FOLLOW_UP_MISSING", "outcome.followUp"));
  if (["HOLD","DENY","ESCALATE"].includes(record.commit.determination) && !isStringArray(o.zeroActionEvidence)) {
    issues.push(issue("ZERO_ACTION_EVIDENCE_MISSING", "outcome.zeroActionEvidence"));
  }
}

function validateIntegrity(record: CanonicalExecutionArtifact, issues: ValidationIssue[], context: ValidationContext): void {
  const i = record.integrity;
  if (!isHash(i.canonicalHash)) issues.push(issue("CANONICAL_HASH_MISSING", "integrity.canonicalHash"));
  if (!isHash(i.packageHash)) issues.push(issue("PACKAGE_HASH_MISSING", "integrity.packageHash"));
  if (!isObject(i.componentHashes) || Object.keys(i.componentHashes).length === 0) issues.push(issue("COMPONENT_HASHES_MISSING", "integrity.componentHashes"));
  if ((context.requireSignature || context.intendedUse === "PUBLICATION") && !isNonEmptyString(i.signatureMethod)) issues.push(issue("SIGNATURE_METHOD_MISSING", "integrity.signatureMethod"));
  if (!isNonEmptyString(i.verifierVersion)) issues.push(issue("VERIFIER_VERSION_MISSING", "integrity.verifierVersion"));
  if (context.intendedUse === "PUBLICATION") {
    if (i.parity.pdf === false) issues.push(issue("PDF_PARITY_FAILED", "integrity.parity.pdf"));
    if (i.parity.manifest === false) issues.push(issue("MANIFEST_PARITY_FAILED", "integrity.parity.manifest"));
  }
}

function validateReview(record: CanonicalExecutionArtifact, issues: ValidationIssue[], context: ValidationContext): void {
  const r = record.review;
  if (r.reviewLevel === undefined || r.reviewLevel === null) issues.push(issue("REVIEW_LEVEL_MISSING", "review.reviewLevel"));
  if (!r.claimsBoundary || !isStringArray(r.claimsBoundary.proves) || !isStringArray(r.claimsBoundary.doesNotProve)) {
    issues.push(issue("CLAIMS_BOUNDARY_MISSING", "review.claimsBoundary"));
  }
  if (record.identity.status === "CORRECTED" && !isNonEmptyString(r.correctionOf)) issues.push(issue("CORRECTION_LINK_MISSING", "review.correctionOf"));
  if (record.identity.status === "SUPERSEDED" && !isNonEmptyString(r.supersedes)) issues.push(issue("SUPERSESSION_LINK_MISSING", "review.supersedes"));
  if (record.identity.status === "WITHDRAWN" && !isNonEmptyString(r.withdrawalReason)) issues.push(issue("WITHDRAWAL_REASON_MISSING", "review.withdrawalReason"));
  if (context.intendedUse === "PUBLICATION" && ["DRAFT","INTERNAL_REVIEW"].includes(record.identity.status)) {
    issues.push(issue("PUBLIC_RELIANCE_NOT_ALLOWED", "identity.status", { status: record.identity.status }));
  }
}

function validateCrossDomainParity(record: CanonicalExecutionArtifact, issues: ValidationIssue[]): void {
  if (record.identity.classification !== record.scenario.classification) {
    issues.push(issue("DEMO_PRODUCTION_LABEL_MISSING", "identity.classification", {
      identity: record.identity.classification,
      scenario: record.scenario.classification,
    }));
  }
  const authorityIds = new Set(record.authority.map(a => a.actorId));
  const missingApprovers = record.commit.approvingAuthority.filter(id => !authorityIds.has(id));
  if (missingApprovers.length) {
    issues.push(issue("APPROVING_AUTHORITY_MISSING", "commit.approvingAuthority", { missingApprovers }));
  }
  const routeGateIds = record.route.gateOrder.map(g => g.gateId);
  const ledgerGateIds = record.gateLedger.entries.map(g => g.gateId);
  if (routeGateIds.join("|") !== ledgerGateIds.join("|")) {
    issues.push(issue("GATE_ORDER_MISMATCH", "gateLedger.entries", { routeGateIds, ledgerGateIds }));
  }
  if (record.commit.determination === "ALLOW") {
    const unresolvedEvidence = record.evidence.some(e => e.admissibility !== "ADMITTED" || e.conflict === "UNRESOLVED" || e.freshness === "EXPIRED");
    const invalidAuthority = record.authority.some(a => Boolean(a.revokedAt) || a.conflict === "UNRESOLVED");
    const failedGate = record.gateLedger.entries.some(g => g.mandatory && g.result !== "PASS");
    if (unresolvedEvidence || invalidAuthority || failedGate) {
      issues.push(issue("DETERMINATION_EFFECT_MISMATCH", "commit.determination", { unresolvedEvidence, invalidAuthority, failedGate }));
    }
  }
}

export function validateCanonicalExecutionArtifact(
  record: CanonicalExecutionArtifact,
  context: ValidationContext,
): ValidationSummary {
  const issues: ValidationIssue[] = [];
  const checkedAt = context.now && isIsoDate(context.now) ? context.now : new Date().toISOString();
  const now = Date.parse(checkedAt);

  validateIdentity(record, issues);
  validateScenario(record, issues);
  validateRoute(record, issues);
  validateEvidence(record, issues, now);
  validateAuthority(record, issues, now);
  validateContinuity(record, issues);
  validateGateLedger(record, issues);
  validateCommit(record, issues);
  validateExecution(record, issues);
  validateOutcome(record, issues);
  validateIntegrity(record, issues, context);
  validateReview(record, issues, context);
  validateCrossDomainParity(record, issues);

  const counts = emptyCounts();
  for (const current of issues) counts[current.disposition] += 1;
  const highest = highestDisposition(issues);
  const publicationReady = context.intendedUse !== "PUBLICATION"
    ? !issues.some(x => x.disposition === "DENY" || x.disposition === "BLOCK")
    : !issues.some(x => x.publicRelianceBlocked);

  return {
    valid: issues.length === 0,
    publicationReady,
    highestDisposition: highest,
    determinationConsistent: !issues.some(x => x.code === "DETERMINATION_EFFECT_MISMATCH"),
    issueCount: issues.length,
    counts,
    issues,
    checkedAt,
    validatorVersion: TA14_VALIDATOR_VERSION,
    engineSpecVersion: TA14_ENGINE_SPEC_VERSION,
  };
}

export function getReasonCode(code: ReasonCode): ReasonCodeDefinition {
  return REASON_CODE_DICTIONARY[code];
}

export function listReasonCodes(domain?: ReasonDomain): ReasonCodeDefinition[] {
  const values = Object.values(REASON_CODE_DICTIONARY);
  return domain ? values.filter(item => item.domain === domain) : values;
}

export function isReasonCode(value: string): value is ReasonCode {
  return Object.prototype.hasOwnProperty.call(REASON_CODE_DICTIONARY, value);
}

export function summarizeIssuesByDomain(issues: readonly ValidationIssue[]): Record<ReasonDomain, ValidationIssue[]> {
  const result = {} as Record<ReasonDomain, ValidationIssue[]>;
  for (const domain of Object.keys(REASON_CODE_DOMAINS) as ReasonDomain[]) result[domain] = [];
  for (const current of issues) result[REASON_CODE_DICTIONARY[current.code].domain].push(current);
  return result;
}

export const REASON_CODE_DOMAINS: Readonly<Record<ReasonDomain, readonly ReasonCode[]>> = Object.freeze({
  RecordIdentity: Object.freeze([
    "ARTIFACT_ID_MISSING",
    "ARTIFACT_ID_INVALID",
    "SERIES_ID_MISSING",
    "TITLE_MISSING",
    "OWNER_MISSING",
    "STEWARD_MISSING",
    "CREATED_AT_INVALID",
    "PUBLISHED_AT_INVALID",
    "STATUS_INVALID",
    "CLASSIFICATION_INVALID",
  ] as const),
  Scenario: Object.freeze([
    "PROPOSED_ACTION_MISSING",
    "CONSEQUENCE_MISSING",
    "AFFECTED_SUBJECTS_MISSING",
    "ENVIRONMENT_MISSING",
    "ASSUMPTIONS_MISSING",
    "DECLARED_LIMITS_MISSING",
    "SCENARIO_CLASSIFICATION_MISSING",
    "PRODUCTION_WITHOUT_AUTHORITY",
    "CONSEQUENCE_SCOPE_UNBOUNDED",
    "SCENARIO_SNAPSHOT_MISSING",
  ] as const),
  Route: Object.freeze([
    "ROUTE_ID_MISSING",
    "ROUTE_VERSION_MISSING",
    "GATE_ORDER_MISSING",
    "GATE_ORDER_DUPLICATE",
    "THRESHOLDS_MISSING",
    "JURISDICTION_MISSING",
    "MODEL_VERSION_MISSING",
    "TOOL_VERSION_MISSING",
    "REVALIDATION_TRIGGERS_MISSING",
    "ROUTE_SNAPSHOT_MISSING",
    "ROUTE_HASH_MISSING",
    "ROUTE_HASH_MISMATCH",
  ] as const),
  Evidence: Object.freeze([
    "EVIDENCE_SET_EMPTY",
    "EVIDENCE_ID_MISSING",
    "EVIDENCE_SOURCE_MISSING",
    "EVIDENCE_CAPTURE_TIME_INVALID",
    "EVIDENCE_HASH_MISSING",
    "EVIDENCE_CUSTODY_MISSING",
    "EVIDENCE_FRESHNESS_UNKNOWN",
    "EVIDENCE_EXPIRED",
    "EVIDENCE_INADMISSIBLE",
    "EVIDENCE_DISCLOSURE_MISSING",
    "EVIDENCE_CONFLICT_UNRESOLVED",
    "EVIDENCE_RELEVANCE_FAILED",
    "EVIDENCE_SUFFICIENCY_FAILED",
  ] as const),
  Authority: Object.freeze([
    "ACTOR_IDENTITY_MISSING",
    "AUTHORITY_ROLE_MISSING",
    "AUTHORITY_SOURCE_MISSING",
    "AUTHORITY_SCOPE_MISSING",
    "DELEGATION_CHAIN_MISSING",
    "AUTHORITY_EXPIRY_INVALID",
    "AUTHORITY_EXPIRED",
    "AUTHORITY_REVOKED",
    "AUTHORITY_CONFLICT",
    "REQUIRED_CONCURRENCE_MISSING",
    "AUTHORITY_SCOPE_EXCEEDED",
    "AUTHORITY_SNAPSHOT_MISSING",
  ] as const),
  Continuity: Object.freeze([
    "CONTINUITY_RECORD_MISSING",
    "IDENTITY_CONTINUITY_BROKEN",
    "EVIDENCE_CONTINUITY_BROKEN",
    "ROUTE_CONTINUITY_BROKEN",
    "STATE_CHANGE_UNRECORDED",
    "REVALIDATION_EVENT_MISSING",
    "CUSTODY_CHAIN_BROKEN",
    "TIME_WINDOW_BROKEN",
    "MODEL_PARITY_BROKEN",
    "TOOL_PARITY_BROKEN",
  ] as const),
  GateLedger: Object.freeze([
    "GATE_LEDGER_EMPTY",
    "GATE_ID_MISSING",
    "GATE_SEQUENCE_INVALID",
    "GATE_REQUIREMENT_MISSING",
    "GATE_INPUT_MISSING",
    "GATE_RESULT_MISSING",
    "GATE_REASON_MISSING",
    "EARLIEST_FAILURE_MISSING",
    "MANDATORY_GATE_FAILED",
    "GATE_BYPASS_ATTEMPTED",
    "GATE_ORDER_MISMATCH",
  ] as const),
  Commit: Object.freeze([
    "DETERMINATION_MISSING",
    "DETERMINATION_INVALID",
    "DETERMINATION_REASON_MISSING",
    "COMMITTED_AT_INVALID",
    "APPROVING_AUTHORITY_MISSING",
    "PERMITTED_NEXT_ACTION_MISSING",
    "LATE_APPROVAL_DETECTED",
    "COMMIT_SNAPSHOT_MISSING",
    "COMMIT_HASH_MISSING",
  ] as const),
  Execution: Object.freeze([
    "EXECUTION_EFFECT_MISSING",
    "ADAPTER_ID_MISSING",
    "ATTEMPTED_ACTION_MISSING",
    "COMMAND_MISSING",
    "EXECUTION_RESULT_MISSING",
    "STATUS_CODE_MISSING",
    "TARGET_MISSING",
    "EXECUTION_SCOPE_MISSING",
    "BYPASS_STATE_MISSING",
    "TOKEN_STATE_MISSING",
    "ROLLBACK_STATE_MISSING",
    "TECHNICAL_RECEIPT_MISSING",
    "EXECUTION_SCOPE_EXCEEDED",
    "DETERMINATION_EFFECT_MISMATCH",
  ] as const),
  Outcome: Object.freeze([
    "OUTCOME_MISSING",
    "ACTUAL_RESULT_MISSING",
    "CONSEQUENCE_STATE_MISSING",
    "CLOSURE_EVIDENCE_MISSING",
    "OUTCOME_VERIFIER_MISSING",
    "OUTCOME_TIMESTAMP_INVALID",
    "RESIDUAL_RISK_MISSING",
    "FOLLOW_UP_MISSING",
    "ZERO_ACTION_EVIDENCE_MISSING",
    "OUTCOME_ASSERTED_ONLY",
  ] as const),
  Integrity: Object.freeze([
    "CANONICAL_HASH_MISSING",
    "PACKAGE_HASH_MISSING",
    "COMPONENT_HASHES_MISSING",
    "SIGNATURE_METHOD_MISSING",
    "VERIFIER_VERSION_MISSING",
    "CANONICAL_HASH_MISMATCH",
    "PACKAGE_HASH_MISMATCH",
    "COMPONENT_HASH_MISMATCH",
    "PDF_PARITY_FAILED",
    "MANIFEST_PARITY_FAILED",
  ] as const),
  ReviewStatus: Object.freeze([
    "REVIEW_LEVEL_MISSING",
    "PUBLICATION_STATUS_INVALID",
    "CHALLENGE_STATE_INVALID",
    "CORRECTION_LINK_MISSING",
    "SUPERSESSION_LINK_MISSING",
    "WITHDRAWAL_REASON_MISSING",
    "CLAIMS_BOUNDARY_MISSING",
    "DEMO_PRODUCTION_LABEL_MISSING",
    "PUBLIC_RELIANCE_NOT_ALLOWED",
  ] as const),
});


export interface PublicationChecklistResult {
  domain: string;
  ready: boolean;
  blockingIssues: ValidationIssue[];
}

export function buildPublicationChecklist(summary: ValidationSummary): PublicationChecklistResult[] {
  const byDomain = summarizeIssuesByDomain(summary.issues);
  const mapping: Array<{ name: string; domains: ReasonDomain[] }> = [
    { name: "Identity", domains: ["RecordIdentity"] },
    { name: "Scenario", domains: ["Scenario"] },
    { name: "Route", domains: ["Route"] },
    { name: "Evidence", domains: ["Evidence"] },
    { name: "Authority", domains: ["Authority"] },
    { name: "Continuity", domains: ["Continuity"] },
    { name: "Decision", domains: ["GateLedger", "Commit"] },
    { name: "Control", domains: ["Execution"] },
    { name: "Outcome", domains: ["Outcome"] },
    { name: "Integrity", domains: ["Integrity"] },
    { name: "Review", domains: ["ReviewStatus"] },
  ];
  return mapping.map(item => {
    const blockingIssues = item.domains.flatMap(domain => byDomain[domain]).filter(x => x.publicRelianceBlocked);
    return { domain: item.name, ready: blockingIssues.length === 0, blockingIssues };
  });
}

export function recommendedDetermination(summary: ValidationSummary): Determination {
  if (summary.issues.some(x => x.disposition === "DENY")) return "DENY";
  if (summary.issues.some(x => x.disposition === "BLOCK" || x.disposition === "HOLD")) return "HOLD";
  if (summary.issues.some(x => x.disposition === "ESCALATE")) return "ESCALATE";
  return "ALLOW";
}

export function assertPublicationReady(summary: ValidationSummary): void {
  if (summary.publicationReady) return;
  const blocking = summary.issues.filter(x => x.publicRelianceBlocked);
  const error = new Error(`TA-14 publication blocked by ${blocking.length} issue(s).`);
  Object.assign(error, { name: "TA14PublicationBlockedError", issues: blocking });
  throw error;
}

export function stableValidationJson(summary: ValidationSummary): string {
  const normalized = {
    ...summary,
    issues: [...summary.issues].sort((a, b) => `${a.path}:${a.code}`.localeCompare(`${b.path}:${b.code}`)),
  };
  return JSON.stringify(normalized, null, 2);
}

export const PUBLICATION_REQUIRED_DOMAINS = Object.freeze([
  "Identity",
  "Scenario",
  "Route",
  "Evidence",
  "Authority",
  "Continuity",
  "Decision",
  "Control",
  "Outcome",
  "Integrity",
  "Parity",
  "Review",
  "Boundary",
  "Publication",
] as const);

export type PublicationRequiredDomain = typeof PUBLICATION_REQUIRED_DOMAINS[number];

export const EXECUTION_CHAIN_LINKS = Object.freeze([
  { sequence: 1, name: "Reality", requiredProof: "External condition and proposed consequence" },
  { sequence: 2, name: "Record", requiredProof: "Attributable representation of reality" },
  { sequence: 3, name: "Identity", requiredProof: "Actor, source, model, tool, and reviewer identity" },
  { sequence: 4, name: "Provenance", requiredProof: "Origin, method, lineage, and transformation" },
  { sequence: 5, name: "Time", requiredProof: "Applicability, capture, validity, and expiry" },
  { sequence: 6, name: "Custody", requiredProof: "Possession, transfer, and control history" },
  { sequence: 7, name: "Integrity", requiredProof: "Completeness, alteration state, and hash commitments" },
  { sequence: 8, name: "Continuity", requiredProof: "Unbroken connection across state and transition" },
  { sequence: 9, name: "Relevance", requiredProof: "Fitness for the exact governing question" },
  { sequence: 10, name: "Freshness", requiredProof: "Currency at the point of consequence" },
  { sequence: 11, name: "Sufficiency", requiredProof: "Enough support for the consequence at stake" },
  { sequence: 12, name: "Conflict", requiredProof: "Contradiction surfaced before selection" },
  { sequence: 13, name: "Admissibility", requiredProof: "Right of evidence to support this determination" },
  { sequence: 14, name: "Authority", requiredProof: "Valid power for this exact action and scope" },
  { sequence: 15, name: "Boundary", requiredProof: "Permitted destination, amount, tool, model, time, and privilege" },
  { sequence: 16, name: "Obligation", requiredProof: "Rule, duty, prohibition, or permission governing consequence" },
  { sequence: 17, name: "Binding", requiredProof: "Valid connection between determination and consequence" },
  { sequence: 18, name: "Determination", requiredProof: "ALLOW, HOLD, DENY, or ESCALATE" },
  { sequence: 19, name: "Commit", requiredProof: "Fixed approved state before action" },
  { sequence: 20, name: "Revalidation", requiredProof: "Material conditions checked immediately before runtime" },
  { sequence: 21, name: "Execution", requiredProof: "Controlled transition into action" },
  { sequence: 22, name: "Correspondence", requiredProof: "Performed act matches the authorized act" },
  { sequence: 23, name: "Outcome", requiredProof: "Real-world result and residual condition" },
  { sequence: 24, name: "Preservation", requiredProof: "Reconstructable, attributable, versioned, challengeable history" },
] as const);

export type ExecutionChainLinkName = typeof EXECUTION_CHAIN_LINKS[number]["name"];

export const VALIDATOR_GOVERNING_RULES = Object.freeze([
  "No silent default to ALLOW.",
  "No late approval may be backdated into the original commit.",
  "No execution adapter may release a broader action than the committed scope.",
  "Material state changes trigger revalidation when required by the route.",
  "A failed mandatory gate ends the path unless repair or escalation is explicitly authorized.",
  "Monitoring-only records are not execution-control artifacts.",
  "Every public claim must resolve to a specific field, receipt, or review statement.",
  "Every export must resolve to the published artifact version and integrity manifest.",
  "Demonstration and production must remain visibly distinguishable.",
  "Every amendment preserves the original record and explains prospective reliance.",
] as const);

/** Reason-code helpers for the RecordIdentity domain. */
export function isArtifactIdMissing(value: string): value is "ARTIFACT_ID_MISSING" {
  return value === "ARTIFACT_ID_MISSING";
}

export const ARTIFACT_ID_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ARTIFACT_ID_MISSING;

export function isArtifactIdInvalid(value: string): value is "ARTIFACT_ID_INVALID" {
  return value === "ARTIFACT_ID_INVALID";
}

export const ARTIFACT_ID_INVALID_DEFINITION = REASON_CODE_DICTIONARY.ARTIFACT_ID_INVALID;

export function isSeriesIdMissing(value: string): value is "SERIES_ID_MISSING" {
  return value === "SERIES_ID_MISSING";
}

export const SERIES_ID_MISSING_DEFINITION = REASON_CODE_DICTIONARY.SERIES_ID_MISSING;

export function isTitleMissing(value: string): value is "TITLE_MISSING" {
  return value === "TITLE_MISSING";
}

export const TITLE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.TITLE_MISSING;

export function isOwnerMissing(value: string): value is "OWNER_MISSING" {
  return value === "OWNER_MISSING";
}

export const OWNER_MISSING_DEFINITION = REASON_CODE_DICTIONARY.OWNER_MISSING;

export function isStewardMissing(value: string): value is "STEWARD_MISSING" {
  return value === "STEWARD_MISSING";
}

export const STEWARD_MISSING_DEFINITION = REASON_CODE_DICTIONARY.STEWARD_MISSING;

export function isCreatedAtInvalid(value: string): value is "CREATED_AT_INVALID" {
  return value === "CREATED_AT_INVALID";
}

export const CREATED_AT_INVALID_DEFINITION = REASON_CODE_DICTIONARY.CREATED_AT_INVALID;

export function isPublishedAtInvalid(value: string): value is "PUBLISHED_AT_INVALID" {
  return value === "PUBLISHED_AT_INVALID";
}

export const PUBLISHED_AT_INVALID_DEFINITION = REASON_CODE_DICTIONARY.PUBLISHED_AT_INVALID;

export function isStatusInvalid(value: string): value is "STATUS_INVALID" {
  return value === "STATUS_INVALID";
}

export const STATUS_INVALID_DEFINITION = REASON_CODE_DICTIONARY.STATUS_INVALID;

export function isClassificationInvalid(value: string): value is "CLASSIFICATION_INVALID" {
  return value === "CLASSIFICATION_INVALID";
}

export const CLASSIFICATION_INVALID_DEFINITION = REASON_CODE_DICTIONARY.CLASSIFICATION_INVALID;


/** Reason-code helpers for the Scenario domain. */
export function isProposedActionMissing(value: string): value is "PROPOSED_ACTION_MISSING" {
  return value === "PROPOSED_ACTION_MISSING";
}

export const PROPOSED_ACTION_MISSING_DEFINITION = REASON_CODE_DICTIONARY.PROPOSED_ACTION_MISSING;

export function isConsequenceMissing(value: string): value is "CONSEQUENCE_MISSING" {
  return value === "CONSEQUENCE_MISSING";
}

export const CONSEQUENCE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.CONSEQUENCE_MISSING;

export function isAffectedSubjectsMissing(value: string): value is "AFFECTED_SUBJECTS_MISSING" {
  return value === "AFFECTED_SUBJECTS_MISSING";
}

export const AFFECTED_SUBJECTS_MISSING_DEFINITION = REASON_CODE_DICTIONARY.AFFECTED_SUBJECTS_MISSING;

export function isEnvironmentMissing(value: string): value is "ENVIRONMENT_MISSING" {
  return value === "ENVIRONMENT_MISSING";
}

export const ENVIRONMENT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ENVIRONMENT_MISSING;

export function isAssumptionsMissing(value: string): value is "ASSUMPTIONS_MISSING" {
  return value === "ASSUMPTIONS_MISSING";
}

export const ASSUMPTIONS_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ASSUMPTIONS_MISSING;

export function isDeclaredLimitsMissing(value: string): value is "DECLARED_LIMITS_MISSING" {
  return value === "DECLARED_LIMITS_MISSING";
}

export const DECLARED_LIMITS_MISSING_DEFINITION = REASON_CODE_DICTIONARY.DECLARED_LIMITS_MISSING;

export function isScenarioClassificationMissing(value: string): value is "SCENARIO_CLASSIFICATION_MISSING" {
  return value === "SCENARIO_CLASSIFICATION_MISSING";
}

export const SCENARIO_CLASSIFICATION_MISSING_DEFINITION = REASON_CODE_DICTIONARY.SCENARIO_CLASSIFICATION_MISSING;

export function isProductionWithoutAuthority(value: string): value is "PRODUCTION_WITHOUT_AUTHORITY" {
  return value === "PRODUCTION_WITHOUT_AUTHORITY";
}

export const PRODUCTION_WITHOUT_AUTHORITY_DEFINITION = REASON_CODE_DICTIONARY.PRODUCTION_WITHOUT_AUTHORITY;

export function isConsequenceScopeUnbounded(value: string): value is "CONSEQUENCE_SCOPE_UNBOUNDED" {
  return value === "CONSEQUENCE_SCOPE_UNBOUNDED";
}

export const CONSEQUENCE_SCOPE_UNBOUNDED_DEFINITION = REASON_CODE_DICTIONARY.CONSEQUENCE_SCOPE_UNBOUNDED;

export function isScenarioSnapshotMissing(value: string): value is "SCENARIO_SNAPSHOT_MISSING" {
  return value === "SCENARIO_SNAPSHOT_MISSING";
}

export const SCENARIO_SNAPSHOT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.SCENARIO_SNAPSHOT_MISSING;


/** Reason-code helpers for the Route domain. */
export function isRouteIdMissing(value: string): value is "ROUTE_ID_MISSING" {
  return value === "ROUTE_ID_MISSING";
}

export const ROUTE_ID_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ROUTE_ID_MISSING;

export function isRouteVersionMissing(value: string): value is "ROUTE_VERSION_MISSING" {
  return value === "ROUTE_VERSION_MISSING";
}

export const ROUTE_VERSION_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ROUTE_VERSION_MISSING;

export function isGateOrderMissing(value: string): value is "GATE_ORDER_MISSING" {
  return value === "GATE_ORDER_MISSING";
}

export const GATE_ORDER_MISSING_DEFINITION = REASON_CODE_DICTIONARY.GATE_ORDER_MISSING;

export function isGateOrderDuplicate(value: string): value is "GATE_ORDER_DUPLICATE" {
  return value === "GATE_ORDER_DUPLICATE";
}

export const GATE_ORDER_DUPLICATE_DEFINITION = REASON_CODE_DICTIONARY.GATE_ORDER_DUPLICATE;

export function isThresholdsMissing(value: string): value is "THRESHOLDS_MISSING" {
  return value === "THRESHOLDS_MISSING";
}

export const THRESHOLDS_MISSING_DEFINITION = REASON_CODE_DICTIONARY.THRESHOLDS_MISSING;

export function isJurisdictionMissing(value: string): value is "JURISDICTION_MISSING" {
  return value === "JURISDICTION_MISSING";
}

export const JURISDICTION_MISSING_DEFINITION = REASON_CODE_DICTIONARY.JURISDICTION_MISSING;

export function isModelVersionMissing(value: string): value is "MODEL_VERSION_MISSING" {
  return value === "MODEL_VERSION_MISSING";
}

export const MODEL_VERSION_MISSING_DEFINITION = REASON_CODE_DICTIONARY.MODEL_VERSION_MISSING;

export function isToolVersionMissing(value: string): value is "TOOL_VERSION_MISSING" {
  return value === "TOOL_VERSION_MISSING";
}

export const TOOL_VERSION_MISSING_DEFINITION = REASON_CODE_DICTIONARY.TOOL_VERSION_MISSING;

export function isRevalidationTriggersMissing(value: string): value is "REVALIDATION_TRIGGERS_MISSING" {
  return value === "REVALIDATION_TRIGGERS_MISSING";
}

export const REVALIDATION_TRIGGERS_MISSING_DEFINITION = REASON_CODE_DICTIONARY.REVALIDATION_TRIGGERS_MISSING;

export function isRouteSnapshotMissing(value: string): value is "ROUTE_SNAPSHOT_MISSING" {
  return value === "ROUTE_SNAPSHOT_MISSING";
}

export const ROUTE_SNAPSHOT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ROUTE_SNAPSHOT_MISSING;

export function isRouteHashMissing(value: string): value is "ROUTE_HASH_MISSING" {
  return value === "ROUTE_HASH_MISSING";
}

export const ROUTE_HASH_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ROUTE_HASH_MISSING;

export function isRouteHashMismatch(value: string): value is "ROUTE_HASH_MISMATCH" {
  return value === "ROUTE_HASH_MISMATCH";
}

export const ROUTE_HASH_MISMATCH_DEFINITION = REASON_CODE_DICTIONARY.ROUTE_HASH_MISMATCH;


/** Reason-code helpers for the Evidence domain. */
export function isEvidenceSetEmpty(value: string): value is "EVIDENCE_SET_EMPTY" {
  return value === "EVIDENCE_SET_EMPTY";
}

export const EVIDENCE_SET_EMPTY_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_SET_EMPTY;

export function isEvidenceIdMissing(value: string): value is "EVIDENCE_ID_MISSING" {
  return value === "EVIDENCE_ID_MISSING";
}

export const EVIDENCE_ID_MISSING_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_ID_MISSING;

export function isEvidenceSourceMissing(value: string): value is "EVIDENCE_SOURCE_MISSING" {
  return value === "EVIDENCE_SOURCE_MISSING";
}

export const EVIDENCE_SOURCE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_SOURCE_MISSING;

export function isEvidenceCaptureTimeInvalid(value: string): value is "EVIDENCE_CAPTURE_TIME_INVALID" {
  return value === "EVIDENCE_CAPTURE_TIME_INVALID";
}

export const EVIDENCE_CAPTURE_TIME_INVALID_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_CAPTURE_TIME_INVALID;

export function isEvidenceHashMissing(value: string): value is "EVIDENCE_HASH_MISSING" {
  return value === "EVIDENCE_HASH_MISSING";
}

export const EVIDENCE_HASH_MISSING_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_HASH_MISSING;

export function isEvidenceCustodyMissing(value: string): value is "EVIDENCE_CUSTODY_MISSING" {
  return value === "EVIDENCE_CUSTODY_MISSING";
}

export const EVIDENCE_CUSTODY_MISSING_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_CUSTODY_MISSING;

export function isEvidenceFreshnessUnknown(value: string): value is "EVIDENCE_FRESHNESS_UNKNOWN" {
  return value === "EVIDENCE_FRESHNESS_UNKNOWN";
}

export const EVIDENCE_FRESHNESS_UNKNOWN_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_FRESHNESS_UNKNOWN;

export function isEvidenceExpired(value: string): value is "EVIDENCE_EXPIRED" {
  return value === "EVIDENCE_EXPIRED";
}

export const EVIDENCE_EXPIRED_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_EXPIRED;

export function isEvidenceInadmissible(value: string): value is "EVIDENCE_INADMISSIBLE" {
  return value === "EVIDENCE_INADMISSIBLE";
}

export const EVIDENCE_INADMISSIBLE_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_INADMISSIBLE;

export function isEvidenceDisclosureMissing(value: string): value is "EVIDENCE_DISCLOSURE_MISSING" {
  return value === "EVIDENCE_DISCLOSURE_MISSING";
}

export const EVIDENCE_DISCLOSURE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_DISCLOSURE_MISSING;

export function isEvidenceConflictUnresolved(value: string): value is "EVIDENCE_CONFLICT_UNRESOLVED" {
  return value === "EVIDENCE_CONFLICT_UNRESOLVED";
}

export const EVIDENCE_CONFLICT_UNRESOLVED_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_CONFLICT_UNRESOLVED;

export function isEvidenceRelevanceFailed(value: string): value is "EVIDENCE_RELEVANCE_FAILED" {
  return value === "EVIDENCE_RELEVANCE_FAILED";
}

export const EVIDENCE_RELEVANCE_FAILED_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_RELEVANCE_FAILED;

export function isEvidenceSufficiencyFailed(value: string): value is "EVIDENCE_SUFFICIENCY_FAILED" {
  return value === "EVIDENCE_SUFFICIENCY_FAILED";
}

export const EVIDENCE_SUFFICIENCY_FAILED_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_SUFFICIENCY_FAILED;


/** Reason-code helpers for the Authority domain. */
export function isActorIdentityMissing(value: string): value is "ACTOR_IDENTITY_MISSING" {
  return value === "ACTOR_IDENTITY_MISSING";
}

export const ACTOR_IDENTITY_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ACTOR_IDENTITY_MISSING;

export function isAuthorityRoleMissing(value: string): value is "AUTHORITY_ROLE_MISSING" {
  return value === "AUTHORITY_ROLE_MISSING";
}

export const AUTHORITY_ROLE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.AUTHORITY_ROLE_MISSING;

export function isAuthoritySourceMissing(value: string): value is "AUTHORITY_SOURCE_MISSING" {
  return value === "AUTHORITY_SOURCE_MISSING";
}

export const AUTHORITY_SOURCE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.AUTHORITY_SOURCE_MISSING;

export function isAuthorityScopeMissing(value: string): value is "AUTHORITY_SCOPE_MISSING" {
  return value === "AUTHORITY_SCOPE_MISSING";
}

export const AUTHORITY_SCOPE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.AUTHORITY_SCOPE_MISSING;

export function isDelegationChainMissing(value: string): value is "DELEGATION_CHAIN_MISSING" {
  return value === "DELEGATION_CHAIN_MISSING";
}

export const DELEGATION_CHAIN_MISSING_DEFINITION = REASON_CODE_DICTIONARY.DELEGATION_CHAIN_MISSING;

export function isAuthorityExpiryInvalid(value: string): value is "AUTHORITY_EXPIRY_INVALID" {
  return value === "AUTHORITY_EXPIRY_INVALID";
}

export const AUTHORITY_EXPIRY_INVALID_DEFINITION = REASON_CODE_DICTIONARY.AUTHORITY_EXPIRY_INVALID;

export function isAuthorityExpired(value: string): value is "AUTHORITY_EXPIRED" {
  return value === "AUTHORITY_EXPIRED";
}

export const AUTHORITY_EXPIRED_DEFINITION = REASON_CODE_DICTIONARY.AUTHORITY_EXPIRED;

export function isAuthorityRevoked(value: string): value is "AUTHORITY_REVOKED" {
  return value === "AUTHORITY_REVOKED";
}

export const AUTHORITY_REVOKED_DEFINITION = REASON_CODE_DICTIONARY.AUTHORITY_REVOKED;

export function isAuthorityConflict(value: string): value is "AUTHORITY_CONFLICT" {
  return value === "AUTHORITY_CONFLICT";
}

export const AUTHORITY_CONFLICT_DEFINITION = REASON_CODE_DICTIONARY.AUTHORITY_CONFLICT;

export function isRequiredConcurrenceMissing(value: string): value is "REQUIRED_CONCURRENCE_MISSING" {
  return value === "REQUIRED_CONCURRENCE_MISSING";
}

export const REQUIRED_CONCURRENCE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.REQUIRED_CONCURRENCE_MISSING;

export function isAuthorityScopeExceeded(value: string): value is "AUTHORITY_SCOPE_EXCEEDED" {
  return value === "AUTHORITY_SCOPE_EXCEEDED";
}

export const AUTHORITY_SCOPE_EXCEEDED_DEFINITION = REASON_CODE_DICTIONARY.AUTHORITY_SCOPE_EXCEEDED;

export function isAuthoritySnapshotMissing(value: string): value is "AUTHORITY_SNAPSHOT_MISSING" {
  return value === "AUTHORITY_SNAPSHOT_MISSING";
}

export const AUTHORITY_SNAPSHOT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.AUTHORITY_SNAPSHOT_MISSING;


/** Reason-code helpers for the Continuity domain. */
export function isContinuityRecordMissing(value: string): value is "CONTINUITY_RECORD_MISSING" {
  return value === "CONTINUITY_RECORD_MISSING";
}

export const CONTINUITY_RECORD_MISSING_DEFINITION = REASON_CODE_DICTIONARY.CONTINUITY_RECORD_MISSING;

export function isIdentityContinuityBroken(value: string): value is "IDENTITY_CONTINUITY_BROKEN" {
  return value === "IDENTITY_CONTINUITY_BROKEN";
}

export const IDENTITY_CONTINUITY_BROKEN_DEFINITION = REASON_CODE_DICTIONARY.IDENTITY_CONTINUITY_BROKEN;

export function isEvidenceContinuityBroken(value: string): value is "EVIDENCE_CONTINUITY_BROKEN" {
  return value === "EVIDENCE_CONTINUITY_BROKEN";
}

export const EVIDENCE_CONTINUITY_BROKEN_DEFINITION = REASON_CODE_DICTIONARY.EVIDENCE_CONTINUITY_BROKEN;

export function isRouteContinuityBroken(value: string): value is "ROUTE_CONTINUITY_BROKEN" {
  return value === "ROUTE_CONTINUITY_BROKEN";
}

export const ROUTE_CONTINUITY_BROKEN_DEFINITION = REASON_CODE_DICTIONARY.ROUTE_CONTINUITY_BROKEN;

export function isStateChangeUnrecorded(value: string): value is "STATE_CHANGE_UNRECORDED" {
  return value === "STATE_CHANGE_UNRECORDED";
}

export const STATE_CHANGE_UNRECORDED_DEFINITION = REASON_CODE_DICTIONARY.STATE_CHANGE_UNRECORDED;

export function isRevalidationEventMissing(value: string): value is "REVALIDATION_EVENT_MISSING" {
  return value === "REVALIDATION_EVENT_MISSING";
}

export const REVALIDATION_EVENT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.REVALIDATION_EVENT_MISSING;

export function isCustodyChainBroken(value: string): value is "CUSTODY_CHAIN_BROKEN" {
  return value === "CUSTODY_CHAIN_BROKEN";
}

export const CUSTODY_CHAIN_BROKEN_DEFINITION = REASON_CODE_DICTIONARY.CUSTODY_CHAIN_BROKEN;

export function isTimeWindowBroken(value: string): value is "TIME_WINDOW_BROKEN" {
  return value === "TIME_WINDOW_BROKEN";
}

export const TIME_WINDOW_BROKEN_DEFINITION = REASON_CODE_DICTIONARY.TIME_WINDOW_BROKEN;

export function isModelParityBroken(value: string): value is "MODEL_PARITY_BROKEN" {
  return value === "MODEL_PARITY_BROKEN";
}

export const MODEL_PARITY_BROKEN_DEFINITION = REASON_CODE_DICTIONARY.MODEL_PARITY_BROKEN;

export function isToolParityBroken(value: string): value is "TOOL_PARITY_BROKEN" {
  return value === "TOOL_PARITY_BROKEN";
}

export const TOOL_PARITY_BROKEN_DEFINITION = REASON_CODE_DICTIONARY.TOOL_PARITY_BROKEN;


/** Reason-code helpers for the GateLedger domain. */
export function isGateLedgerEmpty(value: string): value is "GATE_LEDGER_EMPTY" {
  return value === "GATE_LEDGER_EMPTY";
}

export const GATE_LEDGER_EMPTY_DEFINITION = REASON_CODE_DICTIONARY.GATE_LEDGER_EMPTY;

export function isGateIdMissing(value: string): value is "GATE_ID_MISSING" {
  return value === "GATE_ID_MISSING";
}

export const GATE_ID_MISSING_DEFINITION = REASON_CODE_DICTIONARY.GATE_ID_MISSING;

export function isGateSequenceInvalid(value: string): value is "GATE_SEQUENCE_INVALID" {
  return value === "GATE_SEQUENCE_INVALID";
}

export const GATE_SEQUENCE_INVALID_DEFINITION = REASON_CODE_DICTIONARY.GATE_SEQUENCE_INVALID;

export function isGateRequirementMissing(value: string): value is "GATE_REQUIREMENT_MISSING" {
  return value === "GATE_REQUIREMENT_MISSING";
}

export const GATE_REQUIREMENT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.GATE_REQUIREMENT_MISSING;

export function isGateInputMissing(value: string): value is "GATE_INPUT_MISSING" {
  return value === "GATE_INPUT_MISSING";
}

export const GATE_INPUT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.GATE_INPUT_MISSING;

export function isGateResultMissing(value: string): value is "GATE_RESULT_MISSING" {
  return value === "GATE_RESULT_MISSING";
}

export const GATE_RESULT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.GATE_RESULT_MISSING;

export function isGateReasonMissing(value: string): value is "GATE_REASON_MISSING" {
  return value === "GATE_REASON_MISSING";
}

export const GATE_REASON_MISSING_DEFINITION = REASON_CODE_DICTIONARY.GATE_REASON_MISSING;

export function isEarliestFailureMissing(value: string): value is "EARLIEST_FAILURE_MISSING" {
  return value === "EARLIEST_FAILURE_MISSING";
}

export const EARLIEST_FAILURE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.EARLIEST_FAILURE_MISSING;

export function isMandatoryGateFailed(value: string): value is "MANDATORY_GATE_FAILED" {
  return value === "MANDATORY_GATE_FAILED";
}

export const MANDATORY_GATE_FAILED_DEFINITION = REASON_CODE_DICTIONARY.MANDATORY_GATE_FAILED;

export function isGateBypassAttempted(value: string): value is "GATE_BYPASS_ATTEMPTED" {
  return value === "GATE_BYPASS_ATTEMPTED";
}

export const GATE_BYPASS_ATTEMPTED_DEFINITION = REASON_CODE_DICTIONARY.GATE_BYPASS_ATTEMPTED;

export function isGateOrderMismatch(value: string): value is "GATE_ORDER_MISMATCH" {
  return value === "GATE_ORDER_MISMATCH";
}

export const GATE_ORDER_MISMATCH_DEFINITION = REASON_CODE_DICTIONARY.GATE_ORDER_MISMATCH;


/** Reason-code helpers for the Commit domain. */
export function isDeterminationMissing(value: string): value is "DETERMINATION_MISSING" {
  return value === "DETERMINATION_MISSING";
}

export const DETERMINATION_MISSING_DEFINITION = REASON_CODE_DICTIONARY.DETERMINATION_MISSING;

export function isDeterminationInvalid(value: string): value is "DETERMINATION_INVALID" {
  return value === "DETERMINATION_INVALID";
}

export const DETERMINATION_INVALID_DEFINITION = REASON_CODE_DICTIONARY.DETERMINATION_INVALID;

export function isDeterminationReasonMissing(value: string): value is "DETERMINATION_REASON_MISSING" {
  return value === "DETERMINATION_REASON_MISSING";
}

export const DETERMINATION_REASON_MISSING_DEFINITION = REASON_CODE_DICTIONARY.DETERMINATION_REASON_MISSING;

export function isCommittedAtInvalid(value: string): value is "COMMITTED_AT_INVALID" {
  return value === "COMMITTED_AT_INVALID";
}

export const COMMITTED_AT_INVALID_DEFINITION = REASON_CODE_DICTIONARY.COMMITTED_AT_INVALID;

export function isApprovingAuthorityMissing(value: string): value is "APPROVING_AUTHORITY_MISSING" {
  return value === "APPROVING_AUTHORITY_MISSING";
}

export const APPROVING_AUTHORITY_MISSING_DEFINITION = REASON_CODE_DICTIONARY.APPROVING_AUTHORITY_MISSING;

export function isPermittedNextActionMissing(value: string): value is "PERMITTED_NEXT_ACTION_MISSING" {
  return value === "PERMITTED_NEXT_ACTION_MISSING";
}

export const PERMITTED_NEXT_ACTION_MISSING_DEFINITION = REASON_CODE_DICTIONARY.PERMITTED_NEXT_ACTION_MISSING;

export function isLateApprovalDetected(value: string): value is "LATE_APPROVAL_DETECTED" {
  return value === "LATE_APPROVAL_DETECTED";
}

export const LATE_APPROVAL_DETECTED_DEFINITION = REASON_CODE_DICTIONARY.LATE_APPROVAL_DETECTED;

export function isCommitSnapshotMissing(value: string): value is "COMMIT_SNAPSHOT_MISSING" {
  return value === "COMMIT_SNAPSHOT_MISSING";
}

export const COMMIT_SNAPSHOT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.COMMIT_SNAPSHOT_MISSING;

export function isCommitHashMissing(value: string): value is "COMMIT_HASH_MISSING" {
  return value === "COMMIT_HASH_MISSING";
}

export const COMMIT_HASH_MISSING_DEFINITION = REASON_CODE_DICTIONARY.COMMIT_HASH_MISSING;


/** Reason-code helpers for the Execution domain. */
export function isExecutionEffectMissing(value: string): value is "EXECUTION_EFFECT_MISSING" {
  return value === "EXECUTION_EFFECT_MISSING";
}

export const EXECUTION_EFFECT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.EXECUTION_EFFECT_MISSING;

export function isAdapterIdMissing(value: string): value is "ADAPTER_ID_MISSING" {
  return value === "ADAPTER_ID_MISSING";
}

export const ADAPTER_ID_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ADAPTER_ID_MISSING;

export function isAttemptedActionMissing(value: string): value is "ATTEMPTED_ACTION_MISSING" {
  return value === "ATTEMPTED_ACTION_MISSING";
}

export const ATTEMPTED_ACTION_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ATTEMPTED_ACTION_MISSING;

export function isCommandMissing(value: string): value is "COMMAND_MISSING" {
  return value === "COMMAND_MISSING";
}

export const COMMAND_MISSING_DEFINITION = REASON_CODE_DICTIONARY.COMMAND_MISSING;

export function isExecutionResultMissing(value: string): value is "EXECUTION_RESULT_MISSING" {
  return value === "EXECUTION_RESULT_MISSING";
}

export const EXECUTION_RESULT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.EXECUTION_RESULT_MISSING;

export function isStatusCodeMissing(value: string): value is "STATUS_CODE_MISSING" {
  return value === "STATUS_CODE_MISSING";
}

export const STATUS_CODE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.STATUS_CODE_MISSING;

export function isTargetMissing(value: string): value is "TARGET_MISSING" {
  return value === "TARGET_MISSING";
}

export const TARGET_MISSING_DEFINITION = REASON_CODE_DICTIONARY.TARGET_MISSING;

export function isExecutionScopeMissing(value: string): value is "EXECUTION_SCOPE_MISSING" {
  return value === "EXECUTION_SCOPE_MISSING";
}

export const EXECUTION_SCOPE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.EXECUTION_SCOPE_MISSING;

export function isBypassStateMissing(value: string): value is "BYPASS_STATE_MISSING" {
  return value === "BYPASS_STATE_MISSING";
}

export const BYPASS_STATE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.BYPASS_STATE_MISSING;

export function isTokenStateMissing(value: string): value is "TOKEN_STATE_MISSING" {
  return value === "TOKEN_STATE_MISSING";
}

export const TOKEN_STATE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.TOKEN_STATE_MISSING;

export function isRollbackStateMissing(value: string): value is "ROLLBACK_STATE_MISSING" {
  return value === "ROLLBACK_STATE_MISSING";
}

export const ROLLBACK_STATE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ROLLBACK_STATE_MISSING;

export function isTechnicalReceiptMissing(value: string): value is "TECHNICAL_RECEIPT_MISSING" {
  return value === "TECHNICAL_RECEIPT_MISSING";
}

export const TECHNICAL_RECEIPT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.TECHNICAL_RECEIPT_MISSING;

export function isExecutionScopeExceeded(value: string): value is "EXECUTION_SCOPE_EXCEEDED" {
  return value === "EXECUTION_SCOPE_EXCEEDED";
}

export const EXECUTION_SCOPE_EXCEEDED_DEFINITION = REASON_CODE_DICTIONARY.EXECUTION_SCOPE_EXCEEDED;

export function isDeterminationEffectMismatch(value: string): value is "DETERMINATION_EFFECT_MISMATCH" {
  return value === "DETERMINATION_EFFECT_MISMATCH";
}

export const DETERMINATION_EFFECT_MISMATCH_DEFINITION = REASON_CODE_DICTIONARY.DETERMINATION_EFFECT_MISMATCH;


/** Reason-code helpers for the Outcome domain. */
export function isOutcomeMissing(value: string): value is "OUTCOME_MISSING" {
  return value === "OUTCOME_MISSING";
}

export const OUTCOME_MISSING_DEFINITION = REASON_CODE_DICTIONARY.OUTCOME_MISSING;

export function isActualResultMissing(value: string): value is "ACTUAL_RESULT_MISSING" {
  return value === "ACTUAL_RESULT_MISSING";
}

export const ACTUAL_RESULT_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ACTUAL_RESULT_MISSING;

export function isConsequenceStateMissing(value: string): value is "CONSEQUENCE_STATE_MISSING" {
  return value === "CONSEQUENCE_STATE_MISSING";
}

export const CONSEQUENCE_STATE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.CONSEQUENCE_STATE_MISSING;

export function isClosureEvidenceMissing(value: string): value is "CLOSURE_EVIDENCE_MISSING" {
  return value === "CLOSURE_EVIDENCE_MISSING";
}

export const CLOSURE_EVIDENCE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.CLOSURE_EVIDENCE_MISSING;

export function isOutcomeVerifierMissing(value: string): value is "OUTCOME_VERIFIER_MISSING" {
  return value === "OUTCOME_VERIFIER_MISSING";
}

export const OUTCOME_VERIFIER_MISSING_DEFINITION = REASON_CODE_DICTIONARY.OUTCOME_VERIFIER_MISSING;

export function isOutcomeTimestampInvalid(value: string): value is "OUTCOME_TIMESTAMP_INVALID" {
  return value === "OUTCOME_TIMESTAMP_INVALID";
}

export const OUTCOME_TIMESTAMP_INVALID_DEFINITION = REASON_CODE_DICTIONARY.OUTCOME_TIMESTAMP_INVALID;

export function isResidualRiskMissing(value: string): value is "RESIDUAL_RISK_MISSING" {
  return value === "RESIDUAL_RISK_MISSING";
}

export const RESIDUAL_RISK_MISSING_DEFINITION = REASON_CODE_DICTIONARY.RESIDUAL_RISK_MISSING;

export function isFollowUpMissing(value: string): value is "FOLLOW_UP_MISSING" {
  return value === "FOLLOW_UP_MISSING";
}

export const FOLLOW_UP_MISSING_DEFINITION = REASON_CODE_DICTIONARY.FOLLOW_UP_MISSING;

export function isZeroActionEvidenceMissing(value: string): value is "ZERO_ACTION_EVIDENCE_MISSING" {
  return value === "ZERO_ACTION_EVIDENCE_MISSING";
}

export const ZERO_ACTION_EVIDENCE_MISSING_DEFINITION = REASON_CODE_DICTIONARY.ZERO_ACTION_EVIDENCE_MISSING;

export function isOutcomeAssertedOnly(value: string): value is "OUTCOME_ASSERTED_ONLY" {
  return value === "OUTCOME_ASSERTED_ONLY";
}

export const OUTCOME_ASSERTED_ONLY_DEFINITION = REASON_CODE_DICTIONARY.OUTCOME_ASSERTED_ONLY;


/** Reason-code helpers for the Integrity domain. */
export function isCanonicalHashMissing(value: string): value is "CANONICAL_HASH_MISSING" {
  return value === "CANONICAL_HASH_MISSING";
}

export const CANONICAL_HASH_MISSING_DEFINITION = REASON_CODE_DICTIONARY.CANONICAL_HASH_MISSING;

export function isPackageHashMissing(value: string): value is "PACKAGE_HASH_MISSING" {
  return value === "PACKAGE_HASH_MISSING";
}

export const PACKAGE_HASH_MISSING_DEFINITION = REASON_CODE_DICTIONARY.PACKAGE_HASH_MISSING;

export function isComponentHashesMissing(value: string): value is "COMPONENT_HASHES_MISSING" {
  return value === "COMPONENT_HASHES_MISSING";
}

export const COMPONENT_HASHES_MISSING_DEFINITION = REASON_CODE_DICTIONARY.COMPONENT_HASHES_MISSING;

export function isSignatureMethodMissing(value: string): value is "SIGNATURE_METHOD_MISSING" {
  return value === "SIGNATURE_METHOD_MISSING";
}

export const SIGNATURE_METHOD_MISSING_DEFINITION = REASON_CODE_DICTIONARY.SIGNATURE_METHOD_MISSING;

export function isVerifierVersionMissing(value: string): value is "VERIFIER_VERSION_MISSING" {
  return value === "VERIFIER_VERSION_MISSING";
}

export const VERIFIER_VERSION_MISSING_DEFINITION = REASON_CODE_DICTIONARY.VERIFIER_VERSION_MISSING;

export function isCanonicalHashMismatch(value: string): value is "CANONICAL_HASH_MISMATCH" {
  return value === "CANONICAL_HASH_MISMATCH";
}

export const CANONICAL_HASH_MISMATCH_DEFINITION = REASON_CODE_DICTIONARY.CANONICAL_HASH_MISMATCH;

export function isPackageHashMismatch(value: string): value is "PACKAGE_HASH_MISMATCH" {
  return value === "PACKAGE_HASH_MISMATCH";
}

export const PACKAGE_HASH_MISMATCH_DEFINITION = REASON_CODE_DICTIONARY.PACKAGE_HASH_MISMATCH;

export function isComponentHashMismatch(value: string): value is "COMPONENT_HASH_MISMATCH" {
  return value === "COMPONENT_HASH_MISMATCH";
}

export const COMPONENT_HASH_MISMATCH_DEFINITION = REASON_CODE_DICTIONARY.COMPONENT_HASH_MISMATCH;

export function isPdfParityFailed(value: string): value is "PDF_PARITY_FAILED" {
  return value === "PDF_PARITY_FAILED";
}

export const PDF_PARITY_FAILED_DEFINITION = REASON_CODE_DICTIONARY.PDF_PARITY_FAILED;

export function isManifestParityFailed(value: string): value is "MANIFEST_PARITY_FAILED" {
  return value === "MANIFEST_PARITY_FAILED";
}

export const MANIFEST_PARITY_FAILED_DEFINITION = REASON_CODE_DICTIONARY.MANIFEST_PARITY_FAILED;


/** Reason-code helpers for the ReviewStatus domain. */
export function isReviewLevelMissing(value: string): value is "REVIEW_LEVEL_MISSING" {
  return value === "REVIEW_LEVEL_MISSING";
}

export const REVIEW_LEVEL_MISSING_DEFINITION = REASON_CODE_DICTIONARY.REVIEW_LEVEL_MISSING;

export function isPublicationStatusInvalid(value: string): value is "PUBLICATION_STATUS_INVALID" {
  return value === "PUBLICATION_STATUS_INVALID";
}

export const PUBLICATION_STATUS_INVALID_DEFINITION = REASON_CODE_DICTIONARY.PUBLICATION_STATUS_INVALID;

export function isChallengeStateInvalid(value: string): value is "CHALLENGE_STATE_INVALID" {
  return value === "CHALLENGE_STATE_INVALID";
}

export const CHALLENGE_STATE_INVALID_DEFINITION = REASON_CODE_DICTIONARY.CHALLENGE_STATE_INVALID;

export function isCorrectionLinkMissing(value: string): value is "CORRECTION_LINK_MISSING" {
  return value === "CORRECTION_LINK_MISSING";
}

export const CORRECTION_LINK_MISSING_DEFINITION = REASON_CODE_DICTIONARY.CORRECTION_LINK_MISSING;

export function isSupersessionLinkMissing(value: string): value is "SUPERSESSION_LINK_MISSING" {
  return value === "SUPERSESSION_LINK_MISSING";
}

export const SUPERSESSION_LINK_MISSING_DEFINITION = REASON_CODE_DICTIONARY.SUPERSESSION_LINK_MISSING;

export function isWithdrawalReasonMissing(value: string): value is "WITHDRAWAL_REASON_MISSING" {
  return value === "WITHDRAWAL_REASON_MISSING";
}

export const WITHDRAWAL_REASON_MISSING_DEFINITION = REASON_CODE_DICTIONARY.WITHDRAWAL_REASON_MISSING;

export function isClaimsBoundaryMissing(value: string): value is "CLAIMS_BOUNDARY_MISSING" {
  return value === "CLAIMS_BOUNDARY_MISSING";
}

export const CLAIMS_BOUNDARY_MISSING_DEFINITION = REASON_CODE_DICTIONARY.CLAIMS_BOUNDARY_MISSING;

export function isDemoProductionLabelMissing(value: string): value is "DEMO_PRODUCTION_LABEL_MISSING" {
  return value === "DEMO_PRODUCTION_LABEL_MISSING";
}

export const DEMO_PRODUCTION_LABEL_MISSING_DEFINITION = REASON_CODE_DICTIONARY.DEMO_PRODUCTION_LABEL_MISSING;

export function isPublicRelianceNotAllowed(value: string): value is "PUBLIC_RELIANCE_NOT_ALLOWED" {
  return value === "PUBLIC_RELIANCE_NOT_ALLOWED";
}

export const PUBLIC_RELIANCE_NOT_ALLOWED_DEFINITION = REASON_CODE_DICTIONARY.PUBLIC_RELIANCE_NOT_ALLOWED;

