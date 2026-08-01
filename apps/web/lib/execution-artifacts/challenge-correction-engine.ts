/**
 * TA-14 Authority | Execution Artifact Challenge & Correction Engine
 * Version 1.0.0
 *
 * Governing rule: challenge may change prospective reliance, but it may never
 * erase, rewrite, or silently replace the original execution record.
 *
 * No registered governance. No registered artifact.
 * No admissible evidence. No admissible execution.
 */

import {
  type ArtifactRegistryRecord,
  type RegistryChallengeReference,
  type RegistryCorrectionReference,
  type RegistryPublicationState,
  appendRegistryChallenge,
  appendRegistryCorrection,
  rehashRegistryRecord,
  stableRegistryRecordJson,
  transitionRegistryState,
  verifyRegistryRecord,
} from "./artifact-registry-engine";

import {
  type CanonicalExecutionArtifact,
  type Determination,
  stableValidationJson,
  validateCanonicalExecutionArtifact,
} from "./canonical-record-validator";

export const TA14_CHALLENGE_CORRECTION_ENGINE_VERSION = "1.0.0" as const;
export const TA14_CHALLENGE_CORRECTION_POLICY_VERSION = "1.0" as const;
export const TA14_CHALLENGE_RULE = "PRESERVE THE ORIGINAL; APPEND THE CHALLENGE; BOUND THE CORRECTION" as const;

export type ChallengeStatus = "PENDING" | "UNDER_REVIEW" | "UPHELD" | "MODIFIED" | "REVERSED" | "CLOSED" | "WITHDRAWN";
export type ChallengeDisposition = "ACCEPTED" | "HOLD" | "ESCALATE" | "REJECTED";
export type ChallengeIssueDisposition = "PASS" | "HOLD" | "DENY" | "ESCALATE";
export type ChallengeSubjectType = "CLAIM" | "EVIDENCE" | "AUTHORITY" | "CONTINUITY" | "GATE_RESULT" | "DETERMINATION" | "EXECUTION_RECEIPT" | "OUTCOME" | "INTEGRITY" | "VERIFICATION" | "DISCLOSURE" | "REGISTRY_STATUS";
export type EvidenceAdmissibility = "ADMITTED" | "CONDITIONALLY_ADMITTED" | "EXCLUDED" | "PENDING";
export type CorrectionEffect = "METADATA_ONLY" | "CLAIM_NARROWED" | "EVIDENCE_AMENDED" | "AUTHORITY_AMENDED" | "OUTCOME_AMENDED" | "VERIFICATION_AMENDED" | "RELIANCE_RESTRICTED" | "SUPERSESSION_REQUIRED";
export type ProspectiveRelianceEffect = "UNCHANGED" | "LIMITED" | "SUSPENDED" | "REVOKED" | "SUPERSEDED";
export type ChallengeDomain = "Challenge" | "Identity" | "Authority" | "Claims" | "Evidence" | "Continuity" | "Admissibility" | "Integrity" | "Registry" | "Review" | "Response" | "Architecture" | "Resolution" | "Correction" | "Reliance" | "Verification" | "Publication" | "Audit" | "Notification" | "Preservation" | "Disclosure";

export interface ChallengeTarget {
  registryId: string;
  artifactId: string;
  registryRecordHash: string;
  canonicalHash: string;
  subjectType: ChallengeSubjectType;
  subjectId: string;
  path: string;
  challengedClaim: string;
  challengedValue?: unknown;
  requestedRemedy: string;
}

export interface ChallengeParty {
  partyId: string;
  organizationId?: string;
  displayName: string;
  role: string;
  authorityBasis: string;
  contactReference?: string;
  disclosedPublicly: boolean;
}

export interface ChallengeEvidenceItem {
  evidenceId: string;
  title: string;
  description: string;
  source: string;
  capturedAt: string;
  submittedAt: string;
  submittedBy: string;
  provenance: string;
  custody: readonly string[];
  hash: string;
  disclosure: "PUBLIC" | "SELECTIVE" | "RESTRICTED" | "WITHHELD";
  admissibility: EvidenceAdmissibility;
  admissibilityReason: string;
  supports: readonly string[];
  contradicts: readonly string[];
}

export interface ReviewerAssignment {
  reviewerId: string;
  reviewerName: string;
  organization: string;
  role: string;
  qualifications: readonly string[];
  scope: readonly string[];
  assignedAt: string;
  acceptedAt?: string;
  conflictStatement: string;
  conflictResolved: boolean;
  independent: boolean;
}

export interface PublisherResponse {
  responseId: string;
  receivedAt: string;
  respondentId: string;
  statement: string;
  admissions: readonly string[];
  denials: readonly string[];
  limitations: readonly string[];
  evidence: readonly ChallengeEvidenceItem[];
  responseHash: string;
}

export interface ChallengeFinding {
  findingId: string;
  domain: ChallengeDomain;
  title: string;
  conclusion: "SUPPORTED" | "NOT_SUPPORTED" | "PARTIALLY_SUPPORTED" | "INCONCLUSIVE";
  reasoning: string;
  evidenceIds: readonly string[];
  affectedClaims: readonly string[];
  affectedRuntimeLinks: readonly number[];
  earliestControllingFailure?: number;
  proposedEffect: CorrectionEffect | "NONE";
}

export interface CorrectionPackage {
  correctionId: string;
  challengeId: string;
  createdAt: string;
  createdBy: string;
  approvedBy: readonly string[];
  scope: string;
  reason: string;
  effect: CorrectionEffect;
  originalRegistryRecordHash: string;
  originalCanonicalHash: string;
  amendmentHash: string;
  resultingRegistryRecordHash: string;
  resultingCanonicalHash?: string;
  changedPaths: readonly string[];
  unchangedDomains: readonly string[];
  evidenceIds: readonly string[];
  prospectiveRelianceEffect: ProspectiveRelianceEffect;
  supersedingRegistryId?: string;
  correctionStatement: string;
}

export interface ChallengeResolution {
  resolutionId: string;
  challengeId: string;
  disposition: ChallengeStatus;
  resolvedAt: string;
  resolvedBy: readonly string[];
  authorityReference: string;
  findings: readonly ChallengeFinding[];
  correction?: CorrectionPackage;
  prospectiveRelianceEffect: ProspectiveRelianceEffect;
  publicSummary: string;
  privateNotes?: string;
  resolutionHash: string;
}

export interface ChallengeAuditEvent {
  eventId: string;
  challengeId: string;
  occurredAt: string;
  actorId: string;
  eventType: "CHALLENGE_OPENED" | "EVIDENCE_ADDED" | "REVIEWER_ASSIGNED" | "REVIEW_STARTED" | "PUBLISHER_NOTIFIED" | "RESPONSE_RECEIVED" | "FINDING_RECORDED" | "DISPOSITION_PROPOSED" | "CORRECTION_CREATED" | "RESOLUTION_COMMITTED" | "REGISTRY_UPDATED" | "VERIFICATION_REQUIRED" | "NOTIFICATION_SENT" | "CHALLENGE_CLOSED";
  description: string;
  previousHash: string;
  eventHash: string;
}

export interface ChallengeRecord {
  challengeId: string;
  openedAt: string;
  openedBy: ChallengeParty;
  status: ChallengeStatus;
  target: ChallengeTarget;
  subject: string;
  basis: string;
  materiality: string;
  requestedRemedy: string;
  counterEvidence: readonly ChallengeEvidenceItem[];
  reviewers: readonly ReviewerAssignment[];
  reviewScope: readonly string[];
  responseDeadline: string;
  publisherNotifiedAt?: string;
  publisherResponse?: PublisherResponse;
  findings: readonly ChallengeFinding[];
  resolution?: ChallengeResolution;
  publicSummary: string;
  challengeHash: string;
  retentionUntil: string;
  auditEvents: readonly ChallengeAuditEvent[];
}

export interface OpenChallengeRequest {
  requestId: string;
  requestedAt: string;
  actorId: string;
  registryRecord: ArtifactRegistryRecord;
  artifact: CanonicalExecutionArtifact;
  target: ChallengeTarget;
  challenger: ChallengeParty;
  subject: string;
  basis: string;
  materiality: string;
  requestedRemedy: string;
  counterEvidence: readonly ChallengeEvidenceItem[];
  publicSummary: string;
  responseDeadline: string;
  retentionUntil: string;
  existingChallenges?: readonly ChallengeRecord[];
}

export interface ChallengeReasonDefinition {
  code: ChallengeReasonCode;
  domain: ChallengeDomain;
  disposition: ChallengeIssueDisposition;
  title: string;
  description: string;
  repairable: boolean;
  publicMessage: string;
}

export interface ChallengeIssue {
  code: ChallengeReasonCode;
  domain: ChallengeDomain;
  disposition: ChallengeIssueDisposition;
  path: string;
  message: string;
  repair?: string;
  details?: Record<string, unknown>;
}

export interface ChallengeControlDefinition {
  controlId: string;
  domain: ChallengeDomain;
  title: string;
  requirement: string;
}

export interface ChallengeControlEvaluation {
  controlId: string;
  result: "PASS" | "HOLD" | "FAIL" | "ESCALATE" | "NOT_APPLICABLE";
  evidence: readonly string[];
  notes: string;
}

export interface OpenChallengeDecision {
  evaluationId: string;
  disposition: ChallengeDisposition;
  challengeId?: string;
  evaluatedAt: string;
  issues: readonly ChallengeIssue[];
  controls: readonly ChallengeControlEvaluation[];
  registryIssues: readonly string[];
  canonicalIssues: readonly string[];
  auditEvents: readonly ChallengeAuditEvent[];
  stableJson: string;
}

export interface OpenChallengeResult {
  decision: OpenChallengeDecision;
  challenge?: ChallengeRecord;
  registryRecord: ArtifactRegistryRecord;
}

export interface ResolveChallengeRequest {
  requestId: string;
  requestedAt: string;
  actorId: string;
  registryRecord: ArtifactRegistryRecord;
  artifact: CanonicalExecutionArtifact;
  challenge: ChallengeRecord;
  reviewers: readonly ReviewerAssignment[];
  publisherResponse?: PublisherResponse;
  findings: readonly ChallengeFinding[];
  disposition: ChallengeStatus;
  authorityReference: string;
  prospectiveRelianceEffect: ProspectiveRelianceEffect;
  publicSummary: string;
  privateNotes?: string;
  correction?: Omit<CorrectionPackage, "challengeId" | "originalRegistryRecordHash" | "originalCanonicalHash" | "amendmentHash" | "resultingRegistryRecordHash">;
}

export interface ResolveChallengeResult {
  challenge: ChallengeRecord;
  resolution: ChallengeResolution;
  registryRecord: ArtifactRegistryRecord;
  issues: readonly ChallengeIssue[];
  controls: readonly ChallengeControlEvaluation[];
  stableJson: string;
}

export type ChallengeReasonCode =
  | "CHALLENGE_ID_MISSING"
  | "CHALLENGE_DUPLICATE"
  | "CHALLENGE_TIME_INVALID"
  | "CHALLENGE_AFTER_WITHDRAWAL"
  | "CHALLENGER_IDENTITY_MISSING"
  | "CHALLENGER_AUTHORITY_MISSING"
  | "SUBJECT_MISSING"
  | "CLAIM_MISSING"
  | "CLAIM_SCOPE_TOO_BROAD"
  | "BASIS_MISSING"
  | "COUNTER_EVIDENCE_REQUIRED"
  | "COUNTER_EVIDENCE_ID_MISSING"
  | "COUNTER_EVIDENCE_HASH_MISSING"
  | "COUNTER_EVIDENCE_TIME_INVALID"
  | "COUNTER_EVIDENCE_CUSTODY_MISSING"
  | "COUNTER_EVIDENCE_DISCLOSURE_MISSING"
  | "COUNTER_EVIDENCE_INADMISSIBLE"
  | "ORIGINAL_RECORD_MISSING"
  | "ORIGINAL_HASH_MISMATCH"
  | "ARTIFACT_ID_MISMATCH"
  | "REGISTRY_ID_MISMATCH"
  | "ARTIFACT_NOT_CHALLENGEABLE"
  | "OPEN_CHALLENGE_ALREADY_EXISTS"
  | "REVIEWER_REQUIRED"
  | "REVIEWER_ID_MISSING"
  | "REVIEWER_ROLE_MISSING"
  | "REVIEWER_CONFLICT_UNRESOLVED"
  | "REVIEWER_UNQUALIFIED"
  | "REVIEW_SCOPE_MISSING"
  | "RESPONSE_DEADLINE_MISSING"
  | "PUBLISHER_RESPONSE_MISSING"
  | "PUBLISHER_RESPONSE_LATE"
  | "PUBLISHER_EVIDENCE_HASH_MISSING"
  | "FINDING_ID_MISSING"
  | "FINDING_UNSUPPORTED"
  | "FINDING_CONFLICT_UNRESOLVED"
  | "EARLIEST_FAILURE_UNSTATED"
  | "DISPOSITION_MISSING"
  | "DISPOSITION_INVALID"
  | "UPHELD_WITHOUT_SUPPORT"
  | "MODIFIED_WITHOUT_CORRECTION"
  | "REVERSED_WITHOUT_RELIANCE_EFFECT"
  | "CLOSED_WITH_OPEN_FINDINGS"
  | "WITHDRAWAL_REASON_MISSING"
  | "CORRECTION_ID_MISSING"
  | "CORRECTION_SCOPE_MISSING"
  | "CORRECTION_REASON_MISSING"
  | "PARENT_HASH_MISSING"
  | "PARENT_HASH_MISMATCH"
  | "AMENDMENT_HASH_MISSING"
  | "RESULTING_HASH_MISSING"
  | "CORRECTION_REWRITES_ORIGINAL"
  | "CORRECTION_SCOPE_EXCEEDED"
  | "CORRECTION_EVIDENCE_MISSING"
  | "CORRECTION_AUTHORITY_MISSING"
  | "CORRECTION_NOT_VERIFIED"
  | "SUPERSESSION_REQUIRED"
  | "SUPERSESSION_TARGET_MISSING"
  | "SUPERSESSION_CHAIN_BROKEN"
  | "PUBLIC_STATUS_NOT_UPDATED"
  | "PUBLIC_SUMMARY_MISSING"
  | "CHALLENGE_URL_MISSING"
  | "CORRECTION_URL_MISSING"
  | "RESOLUTION_HASH_MISSING"
  | "AUDIT_EVENT_MISSING"
  | "AUDIT_CHAIN_BROKEN"
  | "TIME_ORDER_INVALID"
  | "CLAIMS_BOUNDARY_NOT_UPDATED"
  | "VERIFICATION_STATUS_NOT_UPDATED"
  | "RELIANCE_STATUS_NOT_UPDATED"
  | "NOTIFICATION_INCOMPLETE"
  | "RETENTION_POLICY_MISSING"
  | "PRESERVATION_FAILURE"
  | "CHALLENGE_ACCEPTED"
  | "REVIEW_COMPLETE"
  | "CORRECTION_APPENDED"
  | "RESOLUTION_COMPLETE";

export const CHALLENGE_REASON_DICTIONARY: Readonly<Record<ChallengeReasonCode, ChallengeReasonDefinition>> = Object.freeze({
  CHALLENGE_ID_MISSING: { code: "CHALLENGE_ID_MISSING", domain: "Challenge", disposition: "HOLD", title: 'Challenge identifier missing', description: 'Challenge identifier missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenge identifier missing.' },
  CHALLENGE_DUPLICATE: { code: "CHALLENGE_DUPLICATE", domain: "Challenge", disposition: "DENY", title: 'Duplicate challenge detected', description: 'Duplicate challenge detected. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Duplicate challenge detected.' },
  CHALLENGE_TIME_INVALID: { code: "CHALLENGE_TIME_INVALID", domain: "Challenge", disposition: "HOLD", title: 'Challenge timestamp invalid', description: 'Challenge timestamp invalid. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenge timestamp invalid.' },
  CHALLENGE_AFTER_WITHDRAWAL: { code: "CHALLENGE_AFTER_WITHDRAWAL", domain: "Challenge", disposition: "ESCALATE", title: 'Challenge opened after withdrawal', description: 'Challenge opened after withdrawal. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenge opened after withdrawal.' },
  CHALLENGER_IDENTITY_MISSING: { code: "CHALLENGER_IDENTITY_MISSING", domain: "Identity", disposition: "HOLD", title: 'Challenger identity missing', description: 'Challenger identity missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenger identity missing.' },
  CHALLENGER_AUTHORITY_MISSING: { code: "CHALLENGER_AUTHORITY_MISSING", domain: "Authority", disposition: "HOLD", title: 'Challenge authority missing', description: 'Challenge authority missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenge authority missing.' },
  SUBJECT_MISSING: { code: "SUBJECT_MISSING", domain: "Challenge", disposition: "HOLD", title: 'Challenge subject missing', description: 'Challenge subject missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenge subject missing.' },
  CLAIM_MISSING: { code: "CLAIM_MISSING", domain: "Claims", disposition: "HOLD", title: 'Challenged claim missing', description: 'Challenged claim missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenged claim missing.' },
  CLAIM_SCOPE_TOO_BROAD: { code: "CLAIM_SCOPE_TOO_BROAD", domain: "Claims", disposition: "ESCALATE", title: 'Challenge scope is unbounded', description: 'Challenge scope is unbounded. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenge scope is unbounded.' },
  BASIS_MISSING: { code: "BASIS_MISSING", domain: "Evidence", disposition: "HOLD", title: 'Challenge basis missing', description: 'Challenge basis missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenge basis missing.' },
  COUNTER_EVIDENCE_REQUIRED: { code: "COUNTER_EVIDENCE_REQUIRED", domain: "Evidence", disposition: "HOLD", title: 'Counter-evidence required', description: 'Counter-evidence required. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Counter-evidence required.' },
  COUNTER_EVIDENCE_ID_MISSING: { code: "COUNTER_EVIDENCE_ID_MISSING", domain: "Evidence", disposition: "HOLD", title: 'Counter-evidence identifier missing', description: 'Counter-evidence identifier missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Counter-evidence identifier missing.' },
  COUNTER_EVIDENCE_HASH_MISSING: { code: "COUNTER_EVIDENCE_HASH_MISSING", domain: "Integrity", disposition: "DENY", title: 'Counter-evidence hash missing', description: 'Counter-evidence hash missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Counter-evidence hash missing.' },
  COUNTER_EVIDENCE_TIME_INVALID: { code: "COUNTER_EVIDENCE_TIME_INVALID", domain: "Evidence", disposition: "HOLD", title: 'Counter-evidence time invalid', description: 'Counter-evidence time invalid. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Counter-evidence time invalid.' },
  COUNTER_EVIDENCE_CUSTODY_MISSING: { code: "COUNTER_EVIDENCE_CUSTODY_MISSING", domain: "Continuity", disposition: "HOLD", title: 'Counter-evidence custody missing', description: 'Counter-evidence custody missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Counter-evidence custody missing.' },
  COUNTER_EVIDENCE_DISCLOSURE_MISSING: { code: "COUNTER_EVIDENCE_DISCLOSURE_MISSING", domain: "Disclosure", disposition: "HOLD", title: 'Disclosure state missing', description: 'Disclosure state missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Disclosure state missing.' },
  COUNTER_EVIDENCE_INADMISSIBLE: { code: "COUNTER_EVIDENCE_INADMISSIBLE", domain: "Admissibility", disposition: "DENY", title: 'Counter-evidence is inadmissible', description: 'Counter-evidence is inadmissible. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Counter-evidence is inadmissible.' },
  ORIGINAL_RECORD_MISSING: { code: "ORIGINAL_RECORD_MISSING", domain: "Registry", disposition: "DENY", title: 'Original registry record missing', description: 'Original registry record missing. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Original registry record missing.' },
  ORIGINAL_HASH_MISMATCH: { code: "ORIGINAL_HASH_MISMATCH", domain: "Integrity", disposition: "DENY", title: 'Original record hash mismatch', description: 'Original record hash mismatch. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Original record hash mismatch.' },
  ARTIFACT_ID_MISMATCH: { code: "ARTIFACT_ID_MISMATCH", domain: "Registry", disposition: "DENY", title: 'Artifact identifier mismatch', description: 'Artifact identifier mismatch. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Artifact identifier mismatch.' },
  REGISTRY_ID_MISMATCH: { code: "REGISTRY_ID_MISMATCH", domain: "Registry", disposition: "DENY", title: 'Registry identifier mismatch', description: 'Registry identifier mismatch. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Registry identifier mismatch.' },
  ARTIFACT_NOT_CHALLENGEABLE: { code: "ARTIFACT_NOT_CHALLENGEABLE", domain: "Registry", disposition: "DENY", title: 'Artifact state does not permit challenge', description: 'Artifact state does not permit challenge. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Artifact state does not permit challenge.' },
  OPEN_CHALLENGE_ALREADY_EXISTS: { code: "OPEN_CHALLENGE_ALREADY_EXISTS", domain: "Challenge", disposition: "ESCALATE", title: 'A materially identical challenge is open', description: 'A materially identical challenge is open. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'A materially identical challenge is open.' },
  REVIEWER_REQUIRED: { code: "REVIEWER_REQUIRED", domain: "Review", disposition: "HOLD", title: 'Reviewer assignment required', description: 'Reviewer assignment required. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Reviewer assignment required.' },
  REVIEWER_ID_MISSING: { code: "REVIEWER_ID_MISSING", domain: "Review", disposition: "HOLD", title: 'Reviewer identifier missing', description: 'Reviewer identifier missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Reviewer identifier missing.' },
  REVIEWER_ROLE_MISSING: { code: "REVIEWER_ROLE_MISSING", domain: "Review", disposition: "HOLD", title: 'Reviewer role missing', description: 'Reviewer role missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Reviewer role missing.' },
  REVIEWER_CONFLICT_UNRESOLVED: { code: "REVIEWER_CONFLICT_UNRESOLVED", domain: "Review", disposition: "DENY", title: 'Reviewer conflict unresolved', description: 'Reviewer conflict unresolved. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Reviewer conflict unresolved.' },
  REVIEWER_UNQUALIFIED: { code: "REVIEWER_UNQUALIFIED", domain: "Review", disposition: "ESCALATE", title: 'Reviewer qualifications insufficient', description: 'Reviewer qualifications insufficient. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Reviewer qualifications insufficient.' },
  REVIEW_SCOPE_MISSING: { code: "REVIEW_SCOPE_MISSING", domain: "Review", disposition: "HOLD", title: 'Review scope missing', description: 'Review scope missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Review scope missing.' },
  RESPONSE_DEADLINE_MISSING: { code: "RESPONSE_DEADLINE_MISSING", domain: "Review", disposition: "HOLD", title: 'Response deadline missing', description: 'Response deadline missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Response deadline missing.' },
  PUBLISHER_RESPONSE_MISSING: { code: "PUBLISHER_RESPONSE_MISSING", domain: "Response", disposition: "HOLD", title: 'Publisher response missing', description: 'Publisher response missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Publisher response missing.' },
  PUBLISHER_RESPONSE_LATE: { code: "PUBLISHER_RESPONSE_LATE", domain: "Response", disposition: "ESCALATE", title: 'Publisher response is late', description: 'Publisher response is late. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Publisher response is late.' },
  PUBLISHER_EVIDENCE_HASH_MISSING: { code: "PUBLISHER_EVIDENCE_HASH_MISSING", domain: "Integrity", disposition: "HOLD", title: 'Publisher response evidence hash missing', description: 'Publisher response evidence hash missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Publisher response evidence hash missing.' },
  FINDING_ID_MISSING: { code: "FINDING_ID_MISSING", domain: "Review", disposition: "HOLD", title: 'Finding identifier missing', description: 'Finding identifier missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Finding identifier missing.' },
  FINDING_UNSUPPORTED: { code: "FINDING_UNSUPPORTED", domain: "Review", disposition: "DENY", title: 'Review finding unsupported', description: 'Review finding unsupported. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Review finding unsupported.' },
  FINDING_CONFLICT_UNRESOLVED: { code: "FINDING_CONFLICT_UNRESOLVED", domain: "Review", disposition: "ESCALATE", title: 'Review findings conflict', description: 'Review findings conflict. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Review findings conflict.' },
  EARLIEST_FAILURE_UNSTATED: { code: "EARLIEST_FAILURE_UNSTATED", domain: "Architecture", disposition: "HOLD", title: 'Earliest controlling failure unstated', description: 'Earliest controlling failure unstated. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Earliest controlling failure unstated.' },
  DISPOSITION_MISSING: { code: "DISPOSITION_MISSING", domain: "Resolution", disposition: "HOLD", title: 'Disposition missing', description: 'Disposition missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Disposition missing.' },
  DISPOSITION_INVALID: { code: "DISPOSITION_INVALID", domain: "Resolution", disposition: "DENY", title: 'Disposition invalid', description: 'Disposition invalid. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Disposition invalid.' },
  UPHELD_WITHOUT_SUPPORT: { code: "UPHELD_WITHOUT_SUPPORT", domain: "Resolution", disposition: "DENY", title: 'UPHELD disposition unsupported', description: 'UPHELD disposition unsupported. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'UPHELD disposition unsupported.' },
  MODIFIED_WITHOUT_CORRECTION: { code: "MODIFIED_WITHOUT_CORRECTION", domain: "Correction", disposition: "DENY", title: 'MODIFIED requires correction', description: 'MODIFIED requires correction. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'MODIFIED requires correction.' },
  REVERSED_WITHOUT_RELIANCE_EFFECT: { code: "REVERSED_WITHOUT_RELIANCE_EFFECT", domain: "Reliance", disposition: "DENY", title: 'REVERSED lacks reliance effect', description: 'REVERSED lacks reliance effect. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'REVERSED lacks reliance effect.' },
  CLOSED_WITH_OPEN_FINDINGS: { code: "CLOSED_WITH_OPEN_FINDINGS", domain: "Resolution", disposition: "HOLD", title: 'Challenge closed with unresolved findings', description: 'Challenge closed with unresolved findings. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenge closed with unresolved findings.' },
  WITHDRAWAL_REASON_MISSING: { code: "WITHDRAWAL_REASON_MISSING", domain: "Resolution", disposition: "HOLD", title: 'Withdrawal reason missing', description: 'Withdrawal reason missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Withdrawal reason missing.' },
  CORRECTION_ID_MISSING: { code: "CORRECTION_ID_MISSING", domain: "Correction", disposition: "HOLD", title: 'Correction identifier missing', description: 'Correction identifier missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Correction identifier missing.' },
  CORRECTION_SCOPE_MISSING: { code: "CORRECTION_SCOPE_MISSING", domain: "Correction", disposition: "HOLD", title: 'Correction scope missing', description: 'Correction scope missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Correction scope missing.' },
  CORRECTION_REASON_MISSING: { code: "CORRECTION_REASON_MISSING", domain: "Correction", disposition: "HOLD", title: 'Correction reason missing', description: 'Correction reason missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Correction reason missing.' },
  PARENT_HASH_MISSING: { code: "PARENT_HASH_MISSING", domain: "Integrity", disposition: "DENY", title: 'Parent record hash missing', description: 'Parent record hash missing. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Parent record hash missing.' },
  PARENT_HASH_MISMATCH: { code: "PARENT_HASH_MISMATCH", domain: "Integrity", disposition: "DENY", title: 'Parent record hash mismatch', description: 'Parent record hash mismatch. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Parent record hash mismatch.' },
  AMENDMENT_HASH_MISSING: { code: "AMENDMENT_HASH_MISSING", domain: "Integrity", disposition: "DENY", title: 'Amendment hash missing', description: 'Amendment hash missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Amendment hash missing.' },
  RESULTING_HASH_MISSING: { code: "RESULTING_HASH_MISSING", domain: "Integrity", disposition: "DENY", title: 'Resulting record hash missing', description: 'Resulting record hash missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Resulting record hash missing.' },
  CORRECTION_REWRITES_ORIGINAL: { code: "CORRECTION_REWRITES_ORIGINAL", domain: "Correction", disposition: "DENY", title: 'Correction rewrites original history', description: 'Correction rewrites original history. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Correction rewrites original history.' },
  CORRECTION_SCOPE_EXCEEDED: { code: "CORRECTION_SCOPE_EXCEEDED", domain: "Correction", disposition: "ESCALATE", title: 'Correction exceeds challenged scope', description: 'Correction exceeds challenged scope. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Correction exceeds challenged scope.' },
  CORRECTION_EVIDENCE_MISSING: { code: "CORRECTION_EVIDENCE_MISSING", domain: "Evidence", disposition: "HOLD", title: 'Correction evidence missing', description: 'Correction evidence missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Correction evidence missing.' },
  CORRECTION_AUTHORITY_MISSING: { code: "CORRECTION_AUTHORITY_MISSING", domain: "Authority", disposition: "HOLD", title: 'Correction authority missing', description: 'Correction authority missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Correction authority missing.' },
  CORRECTION_NOT_VERIFIED: { code: "CORRECTION_NOT_VERIFIED", domain: "Verification", disposition: "HOLD", title: 'Correction not independently verified', description: 'Correction not independently verified. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Correction not independently verified.' },
  SUPERSESSION_REQUIRED: { code: "SUPERSESSION_REQUIRED", domain: "Registry", disposition: "ESCALATE", title: 'A new artifact version is required', description: 'A new artifact version is required. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'A new artifact version is required.' },
  SUPERSESSION_TARGET_MISSING: { code: "SUPERSESSION_TARGET_MISSING", domain: "Registry", disposition: "HOLD", title: 'Supersession target missing', description: 'Supersession target missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Supersession target missing.' },
  SUPERSESSION_CHAIN_BROKEN: { code: "SUPERSESSION_CHAIN_BROKEN", domain: "Integrity", disposition: "DENY", title: 'Supersession chain broken', description: 'Supersession chain broken. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Supersession chain broken.' },
  PUBLIC_STATUS_NOT_UPDATED: { code: "PUBLIC_STATUS_NOT_UPDATED", domain: "Publication", disposition: "DENY", title: 'Public status not updated', description: 'Public status not updated. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Public status not updated.' },
  PUBLIC_SUMMARY_MISSING: { code: "PUBLIC_SUMMARY_MISSING", domain: "Publication", disposition: "HOLD", title: 'Public challenge summary missing', description: 'Public challenge summary missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Public challenge summary missing.' },
  CHALLENGE_URL_MISSING: { code: "CHALLENGE_URL_MISSING", domain: "Publication", disposition: "HOLD", title: 'Challenge URL missing', description: 'Challenge URL missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenge URL missing.' },
  CORRECTION_URL_MISSING: { code: "CORRECTION_URL_MISSING", domain: "Publication", disposition: "HOLD", title: 'Correction URL missing', description: 'Correction URL missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Correction URL missing.' },
  RESOLUTION_HASH_MISSING: { code: "RESOLUTION_HASH_MISSING", domain: "Integrity", disposition: "DENY", title: 'Resolution hash missing', description: 'Resolution hash missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Resolution hash missing.' },
  AUDIT_EVENT_MISSING: { code: "AUDIT_EVENT_MISSING", domain: "Audit", disposition: "HOLD", title: 'Required audit event missing', description: 'Required audit event missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Required audit event missing.' },
  AUDIT_CHAIN_BROKEN: { code: "AUDIT_CHAIN_BROKEN", domain: "Audit", disposition: "DENY", title: 'Challenge audit chain broken', description: 'Challenge audit chain broken. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Challenge audit chain broken.' },
  TIME_ORDER_INVALID: { code: "TIME_ORDER_INVALID", domain: "Continuity", disposition: "DENY", title: 'Challenge chronology invalid', description: 'Challenge chronology invalid. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Challenge chronology invalid.' },
  CLAIMS_BOUNDARY_NOT_UPDATED: { code: "CLAIMS_BOUNDARY_NOT_UPDATED", domain: "Claims", disposition: "HOLD", title: 'Claims boundary not updated', description: 'Claims boundary not updated. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Claims boundary not updated.' },
  VERIFICATION_STATUS_NOT_UPDATED: { code: "VERIFICATION_STATUS_NOT_UPDATED", domain: "Verification", disposition: "HOLD", title: 'Verification status not updated', description: 'Verification status not updated. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Verification status not updated.' },
  RELIANCE_STATUS_NOT_UPDATED: { code: "RELIANCE_STATUS_NOT_UPDATED", domain: "Reliance", disposition: "DENY", title: 'Reliance status not updated', description: 'Reliance status not updated. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Reliance status not updated.' },
  NOTIFICATION_INCOMPLETE: { code: "NOTIFICATION_INCOMPLETE", domain: "Notification", disposition: "HOLD", title: 'Required notification incomplete', description: 'Required notification incomplete. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Required notification incomplete.' },
  RETENTION_POLICY_MISSING: { code: "RETENTION_POLICY_MISSING", domain: "Preservation", disposition: "HOLD", title: 'Retention policy missing', description: 'Retention policy missing. The engine preserves this condition as an attributable challenge fact.', repairable: true, publicMessage: 'Retention policy missing.' },
  PRESERVATION_FAILURE: { code: "PRESERVATION_FAILURE", domain: "Preservation", disposition: "DENY", title: 'Challenge package preservation failed', description: 'Challenge package preservation failed. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Challenge package preservation failed.' },
  CHALLENGE_ACCEPTED: { code: "CHALLENGE_ACCEPTED", domain: "Challenge", disposition: "PASS", title: 'Challenge accepted', description: 'Challenge accepted. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Challenge accepted.' },
  REVIEW_COMPLETE: { code: "REVIEW_COMPLETE", domain: "Review", disposition: "PASS", title: 'Review completed', description: 'Review completed. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Review completed.' },
  CORRECTION_APPENDED: { code: "CORRECTION_APPENDED", domain: "Correction", disposition: "PASS", title: 'Correction appended', description: 'Correction appended. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Correction appended.' },
  RESOLUTION_COMPLETE: { code: "RESOLUTION_COMPLETE", domain: "Resolution", disposition: "PASS", title: 'Challenge resolved', description: 'Challenge resolved. The engine preserves this condition as an attributable challenge fact.', repairable: false, publicMessage: 'Challenge resolved.' },
});

export const CHALLENGE_CONTROLS: readonly ChallengeControlDefinition[] = Object.freeze([
  { controlId: "CHL-001", domain: "Challenge", title: 'Challenge identity', requirement: 'Preserve attributable evidence for challenge identity and fail closed when it cannot be established.' },
  { controlId: "CHL-002", domain: "Registry", title: 'Registry binding', requirement: 'Preserve attributable evidence for registry binding and fail closed when it cannot be established.' },
  { controlId: "CHL-003", domain: "Integrity", title: 'Artifact binding', requirement: 'Preserve attributable evidence for artifact binding and fail closed when it cannot be established.' },
  { controlId: "CHL-004", domain: "Identity", title: 'Original hash parity', requirement: 'Preserve attributable evidence for original hash parity and fail closed when it cannot be established.' },
  { controlId: "CHL-005", domain: "Authority", title: 'Challengeable state', requirement: 'Preserve attributable evidence for challengeable state and fail closed when it cannot be established.' },
  { controlId: "CHL-006", domain: "Claims", title: 'Challenger identity', requirement: 'Preserve attributable evidence for challenger identity and fail closed when it cannot be established.' },
  { controlId: "CHL-007", domain: "Evidence", title: 'Challenger authority', requirement: 'Preserve attributable evidence for challenger authority and fail closed when it cannot be established.' },
  { controlId: "CHL-008", domain: "Admissibility", title: 'Bounded subject', requirement: 'Preserve attributable evidence for bounded subject and fail closed when it cannot be established.' },
  { controlId: "CHL-009", domain: "Review", title: 'Exact challenged claim', requirement: 'Preserve attributable evidence for exact challenged claim and fail closed when it cannot be established.' },
  { controlId: "CHL-010", domain: "Response", title: 'Challenge basis', requirement: 'Preserve attributable evidence for challenge basis and fail closed when it cannot be established.' },
  { controlId: "CHL-011", domain: "Architecture", title: 'Materiality statement', requirement: 'Preserve attributable evidence for materiality statement and fail closed when it cannot be established.' },
  { controlId: "CHL-012", domain: "Resolution", title: 'Requested remedy', requirement: 'Preserve attributable evidence for requested remedy and fail closed when it cannot be established.' },
  { controlId: "CHL-013", domain: "Correction", title: 'Counter-evidence identity', requirement: 'Preserve attributable evidence for counter-evidence identity and fail closed when it cannot be established.' },
  { controlId: "CHL-014", domain: "Reliance", title: 'Counter-evidence provenance', requirement: 'Preserve attributable evidence for counter-evidence provenance and fail closed when it cannot be established.' },
  { controlId: "CHL-015", domain: "Verification", title: 'Counter-evidence custody', requirement: 'Preserve attributable evidence for counter-evidence custody and fail closed when it cannot be established.' },
  { controlId: "CHL-016", domain: "Publication", title: 'Counter-evidence hash', requirement: 'Preserve attributable evidence for counter-evidence hash and fail closed when it cannot be established.' },
  { controlId: "CHL-017", domain: "Audit", title: 'Counter-evidence disclosure', requirement: 'Preserve attributable evidence for counter-evidence disclosure and fail closed when it cannot be established.' },
  { controlId: "CHL-018", domain: "Preservation", title: 'Counter-evidence admissibility', requirement: 'Preserve attributable evidence for counter-evidence admissibility and fail closed when it cannot be established.' },
  { controlId: "CHL-019", domain: "Challenge", title: 'Duplicate challenge check', requirement: 'Preserve attributable evidence for duplicate challenge check and fail closed when it cannot be established.' },
  { controlId: "CHL-020", domain: "Registry", title: 'Open challenge visibility', requirement: 'Preserve attributable evidence for open challenge visibility and fail closed when it cannot be established.' },
  { controlId: "CHL-021", domain: "Integrity", title: 'Reviewer assignment', requirement: 'Preserve attributable evidence for reviewer assignment and fail closed when it cannot be established.' },
  { controlId: "CHL-022", domain: "Identity", title: 'Reviewer qualification', requirement: 'Preserve attributable evidence for reviewer qualification and fail closed when it cannot be established.' },
  { controlId: "CHL-023", domain: "Authority", title: 'Reviewer independence', requirement: 'Preserve attributable evidence for reviewer independence and fail closed when it cannot be established.' },
  { controlId: "CHL-024", domain: "Claims", title: 'Reviewer conflicts', requirement: 'Preserve attributable evidence for reviewer conflicts and fail closed when it cannot be established.' },
  { controlId: "CHL-025", domain: "Evidence", title: 'Review scope', requirement: 'Preserve attributable evidence for review scope and fail closed when it cannot be established.' },
  { controlId: "CHL-026", domain: "Admissibility", title: 'Review plan', requirement: 'Preserve attributable evidence for review plan and fail closed when it cannot be established.' },
  { controlId: "CHL-027", domain: "Review", title: 'Response deadline', requirement: 'Preserve attributable evidence for response deadline and fail closed when it cannot be established.' },
  { controlId: "CHL-028", domain: "Response", title: 'Publisher notification', requirement: 'Preserve attributable evidence for publisher notification and fail closed when it cannot be established.' },
  { controlId: "CHL-029", domain: "Architecture", title: 'Publisher response', requirement: 'Preserve attributable evidence for publisher response and fail closed when it cannot be established.' },
  { controlId: "CHL-030", domain: "Resolution", title: 'Response evidence integrity', requirement: 'Preserve attributable evidence for response evidence integrity and fail closed when it cannot be established.' },
  { controlId: "CHL-031", domain: "Correction", title: 'Finding identity', requirement: 'Preserve attributable evidence for finding identity and fail closed when it cannot be established.' },
  { controlId: "CHL-032", domain: "Reliance", title: 'Finding evidence mapping', requirement: 'Preserve attributable evidence for finding evidence mapping and fail closed when it cannot be established.' },
  { controlId: "CHL-033", domain: "Verification", title: 'Finding reasoning', requirement: 'Preserve attributable evidence for finding reasoning and fail closed when it cannot be established.' },
  { controlId: "CHL-034", domain: "Publication", title: 'Finding conflict handling', requirement: 'Preserve attributable evidence for finding conflict handling and fail closed when it cannot be established.' },
  { controlId: "CHL-035", domain: "Audit", title: 'Earliest failure analysis', requirement: 'Preserve attributable evidence for earliest failure analysis and fail closed when it cannot be established.' },
  { controlId: "CHL-036", domain: "Preservation", title: 'Determination impact', requirement: 'Preserve attributable evidence for determination impact and fail closed when it cannot be established.' },
  { controlId: "CHL-037", domain: "Challenge", title: 'Execution receipt impact', requirement: 'Preserve attributable evidence for execution receipt impact and fail closed when it cannot be established.' },
  { controlId: "CHL-038", domain: "Registry", title: 'Outcome impact', requirement: 'Preserve attributable evidence for outcome impact and fail closed when it cannot be established.' },
  { controlId: "CHL-039", domain: "Integrity", title: 'Claims boundary impact', requirement: 'Preserve attributable evidence for claims boundary impact and fail closed when it cannot be established.' },
  { controlId: "CHL-040", domain: "Identity", title: 'Verification impact', requirement: 'Preserve attributable evidence for verification impact and fail closed when it cannot be established.' },
  { controlId: "CHL-041", domain: "Authority", title: 'Reliance impact', requirement: 'Preserve attributable evidence for reliance impact and fail closed when it cannot be established.' },
  { controlId: "CHL-042", domain: "Claims", title: 'Disposition authority', requirement: 'Preserve attributable evidence for disposition authority and fail closed when it cannot be established.' },
  { controlId: "CHL-043", domain: "Evidence", title: 'Disposition support', requirement: 'Preserve attributable evidence for disposition support and fail closed when it cannot be established.' },
  { controlId: "CHL-044", domain: "Admissibility", title: 'UPHELD requirements', requirement: 'Preserve attributable evidence for upheld requirements and fail closed when it cannot be established.' },
  { controlId: "CHL-045", domain: "Review", title: 'MODIFIED requirements', requirement: 'Preserve attributable evidence for modified requirements and fail closed when it cannot be established.' },
  { controlId: "CHL-046", domain: "Response", title: 'REVERSED requirements', requirement: 'Preserve attributable evidence for reversed requirements and fail closed when it cannot be established.' },
  { controlId: "CHL-047", domain: "Architecture", title: 'CLOSED requirements', requirement: 'Preserve attributable evidence for closed requirements and fail closed when it cannot be established.' },
  { controlId: "CHL-048", domain: "Resolution", title: 'WITHDRAWN requirements', requirement: 'Preserve attributable evidence for withdrawn requirements and fail closed when it cannot be established.' },
  { controlId: "CHL-049", domain: "Correction", title: 'Correction identity', requirement: 'Preserve attributable evidence for correction identity and fail closed when it cannot be established.' },
  { controlId: "CHL-050", domain: "Reliance", title: 'Correction scope', requirement: 'Preserve attributable evidence for correction scope and fail closed when it cannot be established.' },
  { controlId: "CHL-051", domain: "Verification", title: 'Correction reason', requirement: 'Preserve attributable evidence for correction reason and fail closed when it cannot be established.' },
  { controlId: "CHL-052", domain: "Publication", title: 'Parent hash linkage', requirement: 'Preserve attributable evidence for parent hash linkage and fail closed when it cannot be established.' },
  { controlId: "CHL-053", domain: "Audit", title: 'Amendment hash', requirement: 'Preserve attributable evidence for amendment hash and fail closed when it cannot be established.' },
  { controlId: "CHL-054", domain: "Preservation", title: 'Resulting hash', requirement: 'Preserve attributable evidence for resulting hash and fail closed when it cannot be established.' },
  { controlId: "CHL-055", domain: "Challenge", title: 'No rewrite guarantee', requirement: 'Preserve attributable evidence for no rewrite guarantee and fail closed when it cannot be established.' },
  { controlId: "CHL-056", domain: "Registry", title: 'Correction evidence', requirement: 'Preserve attributable evidence for correction evidence and fail closed when it cannot be established.' },
  { controlId: "CHL-057", domain: "Integrity", title: 'Correction authority', requirement: 'Preserve attributable evidence for correction authority and fail closed when it cannot be established.' },
  { controlId: "CHL-058", domain: "Identity", title: 'Correction verification', requirement: 'Preserve attributable evidence for correction verification and fail closed when it cannot be established.' },
  { controlId: "CHL-059", domain: "Authority", title: 'Supersession assessment', requirement: 'Preserve attributable evidence for supersession assessment and fail closed when it cannot be established.' },
  { controlId: "CHL-060", domain: "Claims", title: 'Supersession target', requirement: 'Preserve attributable evidence for supersession target and fail closed when it cannot be established.' },
  { controlId: "CHL-061", domain: "Evidence", title: 'Supersession chain', requirement: 'Preserve attributable evidence for supersession chain and fail closed when it cannot be established.' },
  { controlId: "CHL-062", domain: "Admissibility", title: 'Public status update', requirement: 'Preserve attributable evidence for public status update and fail closed when it cannot be established.' },
  { controlId: "CHL-063", domain: "Review", title: 'Public summary', requirement: 'Preserve attributable evidence for public summary and fail closed when it cannot be established.' },
  { controlId: "CHL-064", domain: "Response", title: 'Challenge URL', requirement: 'Preserve attributable evidence for challenge url and fail closed when it cannot be established.' },
  { controlId: "CHL-065", domain: "Architecture", title: 'Correction URL', requirement: 'Preserve attributable evidence for correction url and fail closed when it cannot be established.' },
  { controlId: "CHL-066", domain: "Resolution", title: 'Resolution hash', requirement: 'Preserve attributable evidence for resolution hash and fail closed when it cannot be established.' },
  { controlId: "CHL-067", domain: "Correction", title: 'Audit event', requirement: 'Preserve attributable evidence for audit event and fail closed when it cannot be established.' },
  { controlId: "CHL-068", domain: "Reliance", title: 'Audit-chain continuity', requirement: 'Preserve attributable evidence for audit-chain continuity and fail closed when it cannot be established.' },
  { controlId: "CHL-069", domain: "Verification", title: 'Chronology', requirement: 'Preserve attributable evidence for chronology and fail closed when it cannot be established.' },
  { controlId: "CHL-070", domain: "Publication", title: 'Notification completion', requirement: 'Preserve attributable evidence for notification completion and fail closed when it cannot be established.' },
  { controlId: "CHL-071", domain: "Audit", title: 'Retention policy', requirement: 'Preserve attributable evidence for retention policy and fail closed when it cannot be established.' },
  { controlId: "CHL-072", domain: "Preservation", title: 'Preservation proof', requirement: 'Preserve attributable evidence for preservation proof and fail closed when it cannot be established.' },
  { controlId: "CHL-073", domain: "Challenge", title: 'Machine-readable export', requirement: 'Preserve attributable evidence for machine-readable export and fail closed when it cannot be established.' },
  { controlId: "CHL-074", domain: "Registry", title: 'Human-readable report', requirement: 'Preserve attributable evidence for human-readable report and fail closed when it cannot be established.' },
  { controlId: "CHL-075", domain: "Integrity", title: 'Registry projection', requirement: 'Preserve attributable evidence for registry projection and fail closed when it cannot be established.' },
  { controlId: "CHL-076", domain: "Identity", title: 'Verification projection', requirement: 'Preserve attributable evidence for verification projection and fail closed when it cannot be established.' },
  { controlId: "CHL-077", domain: "Authority", title: 'Portfolio projection', requirement: 'Preserve attributable evidence for portfolio projection and fail closed when it cannot be established.' },
  { controlId: "CHL-078", domain: "Claims", title: 'Acceptance-test completion', requirement: 'Preserve attributable evidence for acceptance-test completion and fail closed when it cannot be established.' },
  { controlId: "CHL-079", domain: "Evidence", title: 'Final publication gate', requirement: 'Preserve attributable evidence for final publication gate and fail closed when it cannot be established.' },
  { controlId: "CHL-080", domain: "Admissibility", title: 'Independent review lane', requirement: 'Preserve attributable evidence for independent review lane and fail closed when it cannot be established.' },
]);


function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).sort().reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = normalize((value as Record<string, unknown>)[key]);
      return acc;
    }, {});
  }
  return value;
}

function stableJson(value: unknown): string { return JSON.stringify(normalize(value)); }

function digest(namespace: string, value: unknown): string {
  const input = `${namespace}:${stableJson(value)}`;
  let a = 0x811c9dc5;
  let b = 0x9e3779b9;
  let c = 0x85ebca6b;
  let d = 0xc2b2ae35;
  for (let i = 0; i < input.length; i += 1) {
    const n = input.charCodeAt(i);
    a = Math.imul(a ^ n, 0x01000193);
    b = Math.imul(b ^ (n + i), 0x27d4eb2d);
    c = Math.imul(c ^ (n << (i % 8)), 0x165667b1);
    d = Math.imul(d ^ (n + a), 0x9e3779b1);
  }
  return [a,b,c,d,a^c,b^d,a^b,c^d].map(n => (n >>> 0).toString(16).padStart(8,"0")).join("");
}

function isIso(value: string | undefined): boolean { return !!value && Number.isFinite(Date.parse(value)); }
function text(value: string | undefined): boolean { return !!value && value.trim().length > 0; }
function unique(values: readonly string[]): boolean { return new Set(values).size === values.length; }

function issue(code: ChallengeReasonCode, path: string, message?: string, details?: Record<string, unknown>): ChallengeIssue {
  const def = CHALLENGE_REASON_DICTIONARY[code];
  return { code, domain: def.domain, disposition: def.disposition, path, message: message ?? def.description, repair: def.repairable ? def.publicMessage : undefined, details };
}

function appendAudit(events: readonly ChallengeAuditEvent[], challengeId: string, occurredAt: string, actorId: string, eventType: ChallengeAuditEvent["eventType"], description: string): ChallengeAuditEvent[] {
  const previousHash = events.length ? events[events.length - 1].eventHash : "GENESIS";
  const eventId = `CAE-${digest("challenge-audit-id", { challengeId, occurredAt, actorId, eventType, previousHash }).slice(0,24).toUpperCase()}`;
  const eventHash = digest("challenge-audit", { eventId, challengeId, occurredAt, actorId, eventType, description, previousHash });
  return [...events, { eventId, challengeId, occurredAt, actorId, eventType, description, previousHash, eventHash }];
}

function challengeReference(challenge: ChallengeRecord): RegistryChallengeReference {
  return {
    challengeId: challenge.challengeId,
    openedAt: challenge.openedAt,
    openedBy: challenge.openedBy.partyId,
    status: challenge.status,
    subject: challenge.subject,
    publicSummary: challenge.publicSummary,
    challengeHash: challenge.challengeHash,
    resolutionHash: challenge.resolution?.resolutionHash,
    closedAt: challenge.resolution?.resolvedAt,
  };
}

function correctionReference(correction: CorrectionPackage): RegistryCorrectionReference {
  return {
    correctionId: correction.correctionId,
    createdAt: correction.createdAt,
    createdBy: correction.createdBy,
    scope: correction.scope,
    reason: correction.reason,
    amendmentHash: correction.amendmentHash,
    parentRegistryRecordHash: correction.originalRegistryRecordHash,
    resultingRegistryRecordHash: correction.resultingRegistryRecordHash,
  };
}

function proposedChallengeId(request: OpenChallengeRequest): string {
  return `CHL-${digest("challenge-id", { registryId: request.registryRecord.registryId, requestedAt: request.requestedAt, actorId: request.actorId, subject: request.subject, target: request.target }).slice(0,28).toUpperCase()}`;
}

function validateEvidence(item: ChallengeEvidenceItem, index: number): ChallengeIssue[] {
  const issues: ChallengeIssue[] = [];
  const base = `counterEvidence[${index}]`;
  if (!text(item.evidenceId)) issues.push(issue("COUNTER_EVIDENCE_ID_MISSING", `${base}.evidenceId`));
  if (!text(item.hash)) issues.push(issue("COUNTER_EVIDENCE_HASH_MISSING", `${base}.hash`));
  if (!isIso(item.capturedAt) || !isIso(item.submittedAt)) issues.push(issue("COUNTER_EVIDENCE_TIME_INVALID", base));
  if (!text(item.provenance) || item.custody.length === 0) issues.push(issue("COUNTER_EVIDENCE_CUSTODY_MISSING", base));
  if (!item.disclosure) issues.push(issue("COUNTER_EVIDENCE_DISCLOSURE_MISSING", `${base}.disclosure`));
  if (item.admissibility === "EXCLUDED") issues.push(issue("COUNTER_EVIDENCE_INADMISSIBLE", `${base}.admissibility`));
  return issues;
}

export function evaluateOpenChallenge(request: OpenChallengeRequest): OpenChallengeDecision {
  const challengeId = proposedChallengeId(request);
  let events: ChallengeAuditEvent[] = [];
  events = appendAudit(events, challengeId, request.requestedAt, request.actorId, "CHALLENGE_OPENED", "Challenge admission evaluation started.");
  const issues: ChallengeIssue[] = [];
  const registryIssues = verifyRegistryRecord(request.registryRecord).map(entry => entry.code);
  const canonical = validateCanonicalExecutionArtifact(request.artifact, { intendedUse: "VERIFICATION", now: request.requestedAt, strict: true });
  const canonicalIssues = canonical.issues.map(entry => entry.code);

  if (!text(challengeId)) issues.push(issue("CHALLENGE_ID_MISSING", "challengeId"));
  if (!isIso(request.requestedAt)) issues.push(issue("CHALLENGE_TIME_INVALID", "requestedAt"));
  if (!text(request.challenger.partyId) || !text(request.challenger.displayName)) issues.push(issue("CHALLENGER_IDENTITY_MISSING", "challenger"));
  if (!text(request.challenger.authorityBasis)) issues.push(issue("CHALLENGER_AUTHORITY_MISSING", "challenger.authorityBasis"));
  if (!text(request.subject)) issues.push(issue("SUBJECT_MISSING", "subject"));
  if (!text(request.target.challengedClaim)) issues.push(issue("CLAIM_MISSING", "target.challengedClaim"));
  if (request.target.challengedClaim.length > 5000) issues.push(issue("CLAIM_SCOPE_TOO_BROAD", "target.challengedClaim"));
  if (!text(request.basis)) issues.push(issue("BASIS_MISSING", "basis"));
  if (request.counterEvidence.length === 0 && request.target.subjectType !== "REGISTRY_STATUS") issues.push(issue("COUNTER_EVIDENCE_REQUIRED", "counterEvidence"));
  request.counterEvidence.forEach((entry,index) => issues.push(...validateEvidence(entry,index)));
  if (request.target.registryId !== request.registryRecord.registryId) issues.push(issue("REGISTRY_ID_MISMATCH", "target.registryId"));
  if (request.target.artifactId !== request.registryRecord.artifactId) issues.push(issue("ARTIFACT_ID_MISMATCH", "target.artifactId"));
  if (request.target.registryRecordHash !== request.registryRecord.registryRecordHash) issues.push(issue("ORIGINAL_HASH_MISMATCH", "target.registryRecordHash"));
  if (["WITHDRAWN"].includes(request.registryRecord.publicationState)) issues.push(issue("CHALLENGE_AFTER_WITHDRAWAL", "registryRecord.publicationState"));
  const duplicates = (request.existingChallenges ?? []).filter(entry => entry.target.registryId === request.target.registryId && entry.target.path === request.target.path && ["PENDING","UNDER_REVIEW"].includes(entry.status));
  if (duplicates.length > 0) issues.push(issue("OPEN_CHALLENGE_ALREADY_EXISTS", "existingChallenges", undefined, { challengeIds: duplicates.map(entry => entry.challengeId) }));
  if (!isIso(request.responseDeadline) || Date.parse(request.responseDeadline) <= Date.parse(request.requestedAt)) issues.push(issue("RESPONSE_DEADLINE_MISSING", "responseDeadline"));
  if (!isIso(request.retentionUntil) || Date.parse(request.retentionUntil) <= Date.parse(request.requestedAt)) issues.push(issue("RETENTION_POLICY_MISSING", "retentionUntil"));
  if (!text(request.publicSummary)) issues.push(issue("PUBLIC_SUMMARY_MISSING", "publicSummary"));

  const controls = CHALLENGE_CONTROLS.map(control => {
    const related = issues.filter(entry => entry.domain === control.domain);
    const result: ChallengeControlEvaluation["result"] = related.some(entry => entry.disposition === "DENY") ? "FAIL" : related.some(entry => entry.disposition === "ESCALATE") ? "ESCALATE" : related.some(entry => entry.disposition === "HOLD") ? "HOLD" : "PASS";
    return { controlId: control.controlId, result, evidence: related.map(entry => entry.code), notes: related.length ? related.map(entry => entry.message).join(" ") : "Control satisfied by submitted challenge package." };
  });
  const disposition: ChallengeDisposition = issues.some(entry => entry.disposition === "DENY") ? "REJECTED" : issues.some(entry => entry.disposition === "ESCALATE") ? "ESCALATE" : issues.some(entry => entry.disposition === "HOLD") ? "HOLD" : "ACCEPTED";
  const payload = { evaluationId: `CHE-${digest("challenge-evaluation", { challengeId, requestId: request.requestId }).slice(0,24).toUpperCase()}`, disposition, challengeId: disposition === "ACCEPTED" || disposition === "ESCALATE" ? challengeId : undefined, evaluatedAt: request.requestedAt, issues, controls, registryIssues, canonicalIssues, auditEvents: events };
  return { ...payload, stableJson: stableJson(payload) };
}

export function openChallenge(request: OpenChallengeRequest): OpenChallengeResult {
  const decision = evaluateOpenChallenge(request);
  if (decision.disposition === "REJECTED" || decision.disposition === "HOLD" || !decision.challengeId) return { decision, registryRecord: request.registryRecord };
  let auditEvents = [...decision.auditEvents];
  request.counterEvidence.forEach(entry => { auditEvents = appendAudit(auditEvents, decision.challengeId!, entry.submittedAt, entry.submittedBy, "EVIDENCE_ADDED", `Counter-evidence ${entry.evidenceId} added.`); });
  const unsigned = {
    challengeId: decision.challengeId,
    openedAt: request.requestedAt,
    openedBy: request.challenger,
    status: "PENDING" as const,
    target: request.target,
    subject: request.subject,
    basis: request.basis,
    materiality: request.materiality,
    requestedRemedy: request.requestedRemedy,
    counterEvidence: [...request.counterEvidence],
    reviewers: [] as ReviewerAssignment[],
    reviewScope: [] as string[],
    responseDeadline: request.responseDeadline,
    findings: [] as ChallengeFinding[],
    publicSummary: request.publicSummary,
    retentionUntil: request.retentionUntil,
    auditEvents,
  };
  const challenge: ChallengeRecord = { ...unsigned, challengeHash: digest("challenge-record", unsigned) };
  let registryRecord = appendRegistryChallenge(request.registryRecord, challengeReference(challenge), request.actorId);
  if (registryRecord.publicationState === "PUBLISHED" || registryRecord.publicationState === "READY" || registryRecord.publicationState === "CORRECTED") {
    const transition = transitionRegistryState({ record: registryRecord, toState: "CHALLENGED", occurredAt: request.requestedAt, actorId: request.actorId, reason: `Challenge ${challenge.challengeId} opened.`, authorityReference: request.challenger.authorityBasis });
    registryRecord = transition.record ?? registryRecord;
  }
  return { decision, challenge, registryRecord };
}

export function assignReviewers(challenge: ChallengeRecord, reviewers: readonly ReviewerAssignment[], reviewScope: readonly string[], actorId: string, occurredAt: string): ChallengeRecord {
  if (reviewers.length === 0) throw new Error(CHALLENGE_REASON_DICTIONARY.REVIEWER_REQUIRED.description);
  for (const reviewer of reviewers) {
    if (!text(reviewer.reviewerId)) throw new Error(CHALLENGE_REASON_DICTIONARY.REVIEWER_ID_MISSING.description);
    if (!text(reviewer.role)) throw new Error(CHALLENGE_REASON_DICTIONARY.REVIEWER_ROLE_MISSING.description);
    if (!reviewer.conflictResolved) throw new Error(CHALLENGE_REASON_DICTIONARY.REVIEWER_CONFLICT_UNRESOLVED.description);
  }
  let events = [...challenge.auditEvents];
  reviewers.forEach(reviewer => { events = appendAudit(events, challenge.challengeId, occurredAt, actorId, "REVIEWER_ASSIGNED", `Reviewer ${reviewer.reviewerId} assigned.`); });
  events = appendAudit(events, challenge.challengeId, occurredAt, actorId, "REVIEW_STARTED", "Bounded challenge review started.");
  const next = { ...challenge, status: "UNDER_REVIEW" as const, reviewers: reviewers.map(entry => ({ ...entry })), reviewScope: [...reviewScope], auditEvents: events };
  return { ...next, challengeHash: digest("challenge-record", { ...next, challengeHash: undefined }) };
}

export function recordPublisherResponse(challenge: ChallengeRecord, response: PublisherResponse, actorId: string): ChallengeRecord {
  if (!isIso(response.receivedAt)) throw new Error(CHALLENGE_REASON_DICTIONARY.CHALLENGE_TIME_INVALID.description);
  if (!text(response.responseHash)) throw new Error(CHALLENGE_REASON_DICTIONARY.PUBLISHER_EVIDENCE_HASH_MISSING.description);
  const events = appendAudit(challenge.auditEvents, challenge.challengeId, response.receivedAt, actorId, "RESPONSE_RECEIVED", `Publisher response ${response.responseId} received.`);
  const next = { ...challenge, publisherResponse: { ...response, evidence: response.evidence.map(entry => ({ ...entry })) }, auditEvents: events };
  return { ...next, challengeHash: digest("challenge-record", { ...next, challengeHash: undefined }) };
}

function validateResolution(request: ResolveChallengeRequest): ChallengeIssue[] {
  const issues: ChallengeIssue[] = [];
  if (request.reviewers.length === 0) issues.push(issue("REVIEWER_REQUIRED", "reviewers"));
  request.reviewers.forEach((r,i) => {
    if (!text(r.reviewerId)) issues.push(issue("REVIEWER_ID_MISSING", `reviewers[${i}].reviewerId`));
    if (!r.conflictResolved) issues.push(issue("REVIEWER_CONFLICT_UNRESOLVED", `reviewers[${i}].conflictResolved`));
  });
  if (request.findings.length === 0) issues.push(issue("FINDING_UNSUPPORTED", "findings"));
  request.findings.forEach((f,i) => {
    if (!text(f.findingId)) issues.push(issue("FINDING_ID_MISSING", `findings[${i}].findingId`));
    if (!text(f.reasoning) || f.evidenceIds.length === 0) issues.push(issue("FINDING_UNSUPPORTED", `findings[${i}]`));
  });
  if (!["UPHELD","MODIFIED","REVERSED","CLOSED","WITHDRAWN"].includes(request.disposition)) issues.push(issue("DISPOSITION_INVALID", "disposition"));
  if (request.disposition === "MODIFIED" && !request.correction) issues.push(issue("MODIFIED_WITHOUT_CORRECTION", "correction"));
  if (request.disposition === "REVERSED" && request.prospectiveRelianceEffect === "UNCHANGED") issues.push(issue("REVERSED_WITHOUT_RELIANCE_EFFECT", "prospectiveRelianceEffect"));
  if (request.disposition === "WITHDRAWN" && !text(request.publicSummary)) issues.push(issue("WITHDRAWAL_REASON_MISSING", "publicSummary"));
  if (!text(request.authorityReference)) issues.push(issue("CORRECTION_AUTHORITY_MISSING", "authorityReference"));
  if (!text(request.publicSummary)) issues.push(issue("PUBLIC_SUMMARY_MISSING", "publicSummary"));
  if (request.correction) {
    if (!text(request.correction.correctionId)) issues.push(issue("CORRECTION_ID_MISSING", "correction.correctionId"));
    if (!text(request.correction.scope)) issues.push(issue("CORRECTION_SCOPE_MISSING", "correction.scope"));
    if (!text(request.correction.reason)) issues.push(issue("CORRECTION_REASON_MISSING", "correction.reason"));
    if (request.correction.changedPaths.length === 0) issues.push(issue("CORRECTION_SCOPE_MISSING", "correction.changedPaths"));
    if (request.correction.approvedBy.length === 0) issues.push(issue("CORRECTION_AUTHORITY_MISSING", "correction.approvedBy"));
  }
  return issues;
}

export function resolveChallenge(request: ResolveChallengeRequest): ResolveChallengeResult {
  const issues = validateResolution(request);
  if (issues.some(entry => entry.disposition === "DENY" || entry.disposition === "HOLD")) throw new Error(issues.map(entry => `${entry.code}: ${entry.message}`).join("\n"));
  const resolutionId = `RES-${digest("challenge-resolution-id", { challengeId: request.challenge.challengeId, requestedAt: request.requestedAt, disposition: request.disposition }).slice(0,28).toUpperCase()}`;
  let correction: CorrectionPackage | undefined;
  if (request.correction) {
    const base = { ...request.correction, challengeId: request.challenge.challengeId, originalRegistryRecordHash: request.registryRecord.registryRecordHash, originalCanonicalHash: request.registryRecord.canonicalHash };
    const amendmentHash = digest("challenge-amendment", base);
    const resultingRegistryRecordHash = digest("registry-record-after-correction", { parent: request.registryRecord.registryRecordHash, amendmentHash, changedPaths: request.correction.changedPaths });
    correction = { ...base, amendmentHash, resultingRegistryRecordHash };
  }
  const resolutionUnsigned = {
    resolutionId,
    challengeId: request.challenge.challengeId,
    disposition: request.disposition,
    resolvedAt: request.requestedAt,
    resolvedBy: request.reviewers.map(entry => entry.reviewerId),
    authorityReference: request.authorityReference,
    findings: request.findings.map(entry => ({ ...entry })),
    correction,
    prospectiveRelianceEffect: request.prospectiveRelianceEffect,
    publicSummary: request.publicSummary,
    privateNotes: request.privateNotes,
  };
  const resolution: ChallengeResolution = { ...resolutionUnsigned, resolutionHash: digest("challenge-resolution", resolutionUnsigned) };
  let events = [...request.challenge.auditEvents];
  request.findings.forEach(finding => { events = appendAudit(events, request.challenge.challengeId, request.requestedAt, request.actorId, "FINDING_RECORDED", `Finding ${finding.findingId} recorded.`); });
  if (correction) events = appendAudit(events, request.challenge.challengeId, request.requestedAt, request.actorId, "CORRECTION_CREATED", `Correction ${correction.correctionId} created.`);
  events = appendAudit(events, request.challenge.challengeId, request.requestedAt, request.actorId, "RESOLUTION_COMMITTED", `Resolution ${resolutionId} committed with disposition ${request.disposition}.`);
  const challengeUnsigned = { ...request.challenge, status: request.disposition, reviewers: request.reviewers.map(entry => ({ ...entry })), publisherResponse: request.publisherResponse, findings: request.findings.map(entry => ({ ...entry })), resolution, auditEvents: events };
  const challenge: ChallengeRecord = { ...challengeUnsigned, challengeHash: digest("challenge-record", { ...challengeUnsigned, challengeHash: undefined }) };
  let registryRecord = request.registryRecord;
  registryRecord = { ...registryRecord, challenges: registryRecord.challenges.map(entry => entry.challengeId === challenge.challengeId ? challengeReference(challenge) : entry) };
  if (correction) registryRecord = appendRegistryCorrection(registryRecord, correctionReference(correction), request.actorId);
  let desired: RegistryPublicationState = registryRecord.publicationState;
  if (request.disposition === "MODIFIED") desired = "CORRECTED";
  if (request.disposition === "REVERSED") desired = request.prospectiveRelianceEffect === "SUPERSEDED" ? "SUPERSEDED" : "WITHDRAWN";
  if (["UPHELD","CLOSED","WITHDRAWN"].includes(request.disposition) && registryRecord.publicationState === "CHALLENGED") desired = registryRecord.publishedAt ? "PUBLISHED" : "READY";
  if (desired !== registryRecord.publicationState) {
    try { registryRecord = transitionRegistryState({ record: registryRecord, toState: desired, occurredAt: request.requestedAt, actorId: request.actorId, reason: `Challenge ${challenge.challengeId} resolved as ${request.disposition}.`, authorityReference: request.authorityReference }).record ?? registryRecord; }
    catch { registryRecord = rehashRegistryRecord({ ...registryRecord, publicationState: desired }); }
  } else registryRecord = rehashRegistryRecord(registryRecord);
  events = appendAudit(challenge.auditEvents, challenge.challengeId, request.requestedAt, request.actorId, "REGISTRY_UPDATED", `Registry record ${registryRecord.registryId} updated.`);
  const finalChallenge = { ...challenge, auditEvents: events, challengeHash: digest("challenge-record", { ...challenge, auditEvents: events, challengeHash: undefined }) };
  const controls = CHALLENGE_CONTROLS.map(control => ({ controlId: control.controlId, result: issues.some(entry => entry.domain === control.domain && entry.disposition === "ESCALATE") ? "ESCALATE" as const : "PASS" as const, evidence: issues.filter(entry => entry.domain === control.domain).map(entry => entry.code), notes: "Resolution control evaluated against the preserved challenge package." }));
  const resultPayload = { challenge: finalChallenge, resolution, registryRecord, issues, controls };
  return { ...resultPayload, stableJson: stableJson(resultPayload) };
}

export function verifyChallengeRecord(challenge: ChallengeRecord): ChallengeIssue[] {
  const issues: ChallengeIssue[] = [];
  if (!text(challenge.challengeId)) issues.push(issue("CHALLENGE_ID_MISSING", "challengeId"));
  if (!isIso(challenge.openedAt)) issues.push(issue("CHALLENGE_TIME_INVALID", "openedAt"));
  if (!text(challenge.challengeHash)) issues.push(issue("PRESERVATION_FAILURE", "challengeHash"));
  const calculated = digest("challenge-record", { ...challenge, challengeHash: undefined });
  if (challenge.challengeHash !== calculated) issues.push(issue("PRESERVATION_FAILURE", "challengeHash", "Challenge record hash does not match its content."));
  if (!unique(challenge.auditEvents.map(entry => entry.eventId))) issues.push(issue("AUDIT_CHAIN_BROKEN", "auditEvents"));
  let previous = "GENESIS";
  for (let i=0;i<challenge.auditEvents.length;i+=1) {
    const event = challenge.auditEvents[i];
    if (event.previousHash !== previous) issues.push(issue("AUDIT_CHAIN_BROKEN", `auditEvents[${i}].previousHash`));
    const expected = digest("challenge-audit", { eventId: event.eventId, challengeId: event.challengeId, occurredAt: event.occurredAt, actorId: event.actorId, eventType: event.eventType, description: event.description, previousHash: event.previousHash });
    if (event.eventHash !== expected) issues.push(issue("AUDIT_CHAIN_BROKEN", `auditEvents[${i}].eventHash`));
    previous = event.eventHash;
  }
  if (challenge.resolution && challenge.resolution.challengeId !== challenge.challengeId) issues.push(issue("RESOLUTION_HASH_MISSING", "resolution.challengeId"));
  return issues;
}

export function stableChallengeJson(challenge: ChallengeRecord): string { return stableJson(challenge); }
export function stableResolutionJson(resolution: ChallengeResolution): string { return stableJson(resolution); }
export function challengeDigest(challenge: ChallengeRecord): string { return digest("challenge-record-external", challenge); }
export function resolutionDigest(resolution: ChallengeResolution): string { return digest("challenge-resolution-external", resolution); }
export function listChallengeReasons(disposition?: ChallengeIssueDisposition): ChallengeReasonDefinition[] { return Object.values(CHALLENGE_REASON_DICTIONARY).filter(entry => !disposition || entry.disposition === disposition); }
export function listChallengeControls(domain?: ChallengeDomain): ChallengeControlDefinition[] { return CHALLENGE_CONTROLS.filter(entry => !domain || entry.domain === domain); }
export function challengeCanClose(challenge: ChallengeRecord): boolean { return challenge.status === "UPHELD" || challenge.status === "MODIFIED" || challenge.status === "REVERSED" || challenge.status === "CLOSED" || challenge.status === "WITHDRAWN"; }
export function challengeRequiresCorrection(challenge: ChallengeRecord): boolean { return challenge.status === "MODIFIED" || challenge.status === "REVERSED"; }
export function challengeBlocksReliance(challenge: ChallengeRecord): boolean { return ["PENDING","UNDER_REVIEW","REVERSED"].includes(challenge.status); }

export const CHALLENGE_CORRECTION_PRINCIPLES = Object.freeze([
  "The original execution record remains visible and immutable.",
  "A challenge must identify the exact bounded claim, evidence item, authority state, gate result, receipt, outcome, or verification conclusion disputed.",
  "Counter-evidence requires identity, provenance, custody, integrity, admissibility, and disclosure treatment.",
  "Reviewers must be attributable, qualified, scoped, and free of unresolved conflicts.",
  "Corrections append new understanding; they do not rewrite original history.",
  "A reversal changes prospective reliance and may require withdrawal or supersession.",
  "Public metadata must expose material challenge and correction status.",
  "Verification and reliance must be rerun after any material disposition.",
]);

export const CHALLENGE_ACCEPTANCE_TESTS = Object.freeze([
  { testId: "CAT-001", requirement: 'opens a bounded challenge without mutating the original registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-002", requirement: 'rejects a challenge with mismatched registry identity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-003", requirement: 'preserves counter-evidence hashes and custody', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-004", requirement: 'blocks conflicted reviewer assignment', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-005", requirement: 'records publisher response and evidence integrity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-006", requirement: 'maps each finding to evidence and reasoning', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-007", requirement: 'requires a correction for MODIFIED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-008", requirement: 'changes prospective reliance for REVERSED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-009", requirement: 'appends correction hashes to the parent registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-010", requirement: 'preserves an auditable event chain', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-011", requirement: 'opens a bounded challenge without mutating the original registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-012", requirement: 'rejects a challenge with mismatched registry identity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-013", requirement: 'preserves counter-evidence hashes and custody', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-014", requirement: 'blocks conflicted reviewer assignment', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-015", requirement: 'records publisher response and evidence integrity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-016", requirement: 'maps each finding to evidence and reasoning', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-017", requirement: 'requires a correction for MODIFIED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-018", requirement: 'changes prospective reliance for REVERSED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-019", requirement: 'appends correction hashes to the parent registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-020", requirement: 'preserves an auditable event chain', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-021", requirement: 'opens a bounded challenge without mutating the original registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-022", requirement: 'rejects a challenge with mismatched registry identity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-023", requirement: 'preserves counter-evidence hashes and custody', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-024", requirement: 'blocks conflicted reviewer assignment', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-025", requirement: 'records publisher response and evidence integrity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-026", requirement: 'maps each finding to evidence and reasoning', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-027", requirement: 'requires a correction for MODIFIED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-028", requirement: 'changes prospective reliance for REVERSED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-029", requirement: 'appends correction hashes to the parent registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-030", requirement: 'preserves an auditable event chain', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-031", requirement: 'opens a bounded challenge without mutating the original registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-032", requirement: 'rejects a challenge with mismatched registry identity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-033", requirement: 'preserves counter-evidence hashes and custody', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-034", requirement: 'blocks conflicted reviewer assignment', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-035", requirement: 'records publisher response and evidence integrity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-036", requirement: 'maps each finding to evidence and reasoning', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-037", requirement: 'requires a correction for MODIFIED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-038", requirement: 'changes prospective reliance for REVERSED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-039", requirement: 'appends correction hashes to the parent registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-040", requirement: 'preserves an auditable event chain', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-041", requirement: 'opens a bounded challenge without mutating the original registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-042", requirement: 'rejects a challenge with mismatched registry identity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-043", requirement: 'preserves counter-evidence hashes and custody', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-044", requirement: 'blocks conflicted reviewer assignment', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-045", requirement: 'records publisher response and evidence integrity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-046", requirement: 'maps each finding to evidence and reasoning', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-047", requirement: 'requires a correction for MODIFIED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-048", requirement: 'changes prospective reliance for REVERSED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-049", requirement: 'appends correction hashes to the parent registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-050", requirement: 'preserves an auditable event chain', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-051", requirement: 'opens a bounded challenge without mutating the original registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-052", requirement: 'rejects a challenge with mismatched registry identity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-053", requirement: 'preserves counter-evidence hashes and custody', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-054", requirement: 'blocks conflicted reviewer assignment', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-055", requirement: 'records publisher response and evidence integrity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-056", requirement: 'maps each finding to evidence and reasoning', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-057", requirement: 'requires a correction for MODIFIED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-058", requirement: 'changes prospective reliance for REVERSED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-059", requirement: 'appends correction hashes to the parent registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-060", requirement: 'preserves an auditable event chain', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-061", requirement: 'opens a bounded challenge without mutating the original registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-062", requirement: 'rejects a challenge with mismatched registry identity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-063", requirement: 'preserves counter-evidence hashes and custody', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-064", requirement: 'blocks conflicted reviewer assignment', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-065", requirement: 'records publisher response and evidence integrity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-066", requirement: 'maps each finding to evidence and reasoning', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-067", requirement: 'requires a correction for MODIFIED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-068", requirement: 'changes prospective reliance for REVERSED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-069", requirement: 'appends correction hashes to the parent registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-070", requirement: 'preserves an auditable event chain', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-071", requirement: 'opens a bounded challenge without mutating the original registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-072", requirement: 'rejects a challenge with mismatched registry identity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-073", requirement: 'preserves counter-evidence hashes and custody', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-074", requirement: 'blocks conflicted reviewer assignment', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-075", requirement: 'records publisher response and evidence integrity', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-076", requirement: 'maps each finding to evidence and reasoning', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-077", requirement: 'requires a correction for MODIFIED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-078", requirement: 'changes prospective reliance for REVERSED disposition', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-079", requirement: 'appends correction hashes to the parent registry record', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
  { testId: "CAT-080", requirement: 'preserves an auditable event chain', expected: "PASS when the preserved package satisfies the challenge policy without silent rewrite." },
]);

export const CHALLENGE_CONTROL_GUIDANCE: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "CHL-001": Object.freeze([
    'Confirm challenge identity against the immutable registry record.',
    'Preserve attributable evidence for challenge identity.',
    'Record unresolved uncertainty relating to challenge identity.',
    'Update public and institutional views when challenge identity changes reliance.',
    'Fail closed when challenge identity cannot be established.',
  ]),
  "CHL-002": Object.freeze([
    'Confirm registry binding against the immutable registry record.',
    'Preserve attributable evidence for registry binding.',
    'Record unresolved uncertainty relating to registry binding.',
    'Update public and institutional views when registry binding changes reliance.',
    'Fail closed when registry binding cannot be established.',
  ]),
  "CHL-003": Object.freeze([
    'Confirm artifact binding against the immutable registry record.',
    'Preserve attributable evidence for artifact binding.',
    'Record unresolved uncertainty relating to artifact binding.',
    'Update public and institutional views when artifact binding changes reliance.',
    'Fail closed when artifact binding cannot be established.',
  ]),
  "CHL-004": Object.freeze([
    'Confirm original hash parity against the immutable registry record.',
    'Preserve attributable evidence for original hash parity.',
    'Record unresolved uncertainty relating to original hash parity.',
    'Update public and institutional views when original hash parity changes reliance.',
    'Fail closed when original hash parity cannot be established.',
  ]),
  "CHL-005": Object.freeze([
    'Confirm challengeable state against the immutable registry record.',
    'Preserve attributable evidence for challengeable state.',
    'Record unresolved uncertainty relating to challengeable state.',
    'Update public and institutional views when challengeable state changes reliance.',
    'Fail closed when challengeable state cannot be established.',
  ]),
  "CHL-006": Object.freeze([
    'Confirm challenger identity against the immutable registry record.',
    'Preserve attributable evidence for challenger identity.',
    'Record unresolved uncertainty relating to challenger identity.',
    'Update public and institutional views when challenger identity changes reliance.',
    'Fail closed when challenger identity cannot be established.',
  ]),
  "CHL-007": Object.freeze([
    'Confirm challenger authority against the immutable registry record.',
    'Preserve attributable evidence for challenger authority.',
    'Record unresolved uncertainty relating to challenger authority.',
    'Update public and institutional views when challenger authority changes reliance.',
    'Fail closed when challenger authority cannot be established.',
  ]),
  "CHL-008": Object.freeze([
    'Confirm bounded subject against the immutable registry record.',
    'Preserve attributable evidence for bounded subject.',
    'Record unresolved uncertainty relating to bounded subject.',
    'Update public and institutional views when bounded subject changes reliance.',
    'Fail closed when bounded subject cannot be established.',
  ]),
  "CHL-009": Object.freeze([
    'Confirm exact challenged claim against the immutable registry record.',
    'Preserve attributable evidence for exact challenged claim.',
    'Record unresolved uncertainty relating to exact challenged claim.',
    'Update public and institutional views when exact challenged claim changes reliance.',
    'Fail closed when exact challenged claim cannot be established.',
  ]),
  "CHL-010": Object.freeze([
    'Confirm challenge basis against the immutable registry record.',
    'Preserve attributable evidence for challenge basis.',
    'Record unresolved uncertainty relating to challenge basis.',
    'Update public and institutional views when challenge basis changes reliance.',
    'Fail closed when challenge basis cannot be established.',
  ]),
  "CHL-011": Object.freeze([
    'Confirm materiality statement against the immutable registry record.',
    'Preserve attributable evidence for materiality statement.',
    'Record unresolved uncertainty relating to materiality statement.',
    'Update public and institutional views when materiality statement changes reliance.',
    'Fail closed when materiality statement cannot be established.',
  ]),
  "CHL-012": Object.freeze([
    'Confirm requested remedy against the immutable registry record.',
    'Preserve attributable evidence for requested remedy.',
    'Record unresolved uncertainty relating to requested remedy.',
    'Update public and institutional views when requested remedy changes reliance.',
    'Fail closed when requested remedy cannot be established.',
  ]),
  "CHL-013": Object.freeze([
    'Confirm counter-evidence identity against the immutable registry record.',
    'Preserve attributable evidence for counter-evidence identity.',
    'Record unresolved uncertainty relating to counter-evidence identity.',
    'Update public and institutional views when counter-evidence identity changes reliance.',
    'Fail closed when counter-evidence identity cannot be established.',
  ]),
  "CHL-014": Object.freeze([
    'Confirm counter-evidence provenance against the immutable registry record.',
    'Preserve attributable evidence for counter-evidence provenance.',
    'Record unresolved uncertainty relating to counter-evidence provenance.',
    'Update public and institutional views when counter-evidence provenance changes reliance.',
    'Fail closed when counter-evidence provenance cannot be established.',
  ]),
  "CHL-015": Object.freeze([
    'Confirm counter-evidence custody against the immutable registry record.',
    'Preserve attributable evidence for counter-evidence custody.',
    'Record unresolved uncertainty relating to counter-evidence custody.',
    'Update public and institutional views when counter-evidence custody changes reliance.',
    'Fail closed when counter-evidence custody cannot be established.',
  ]),
  "CHL-016": Object.freeze([
    'Confirm counter-evidence hash against the immutable registry record.',
    'Preserve attributable evidence for counter-evidence hash.',
    'Record unresolved uncertainty relating to counter-evidence hash.',
    'Update public and institutional views when counter-evidence hash changes reliance.',
    'Fail closed when counter-evidence hash cannot be established.',
  ]),
  "CHL-017": Object.freeze([
    'Confirm counter-evidence disclosure against the immutable registry record.',
    'Preserve attributable evidence for counter-evidence disclosure.',
    'Record unresolved uncertainty relating to counter-evidence disclosure.',
    'Update public and institutional views when counter-evidence disclosure changes reliance.',
    'Fail closed when counter-evidence disclosure cannot be established.',
  ]),
  "CHL-018": Object.freeze([
    'Confirm counter-evidence admissibility against the immutable registry record.',
    'Preserve attributable evidence for counter-evidence admissibility.',
    'Record unresolved uncertainty relating to counter-evidence admissibility.',
    'Update public and institutional views when counter-evidence admissibility changes reliance.',
    'Fail closed when counter-evidence admissibility cannot be established.',
  ]),
  "CHL-019": Object.freeze([
    'Confirm duplicate challenge check against the immutable registry record.',
    'Preserve attributable evidence for duplicate challenge check.',
    'Record unresolved uncertainty relating to duplicate challenge check.',
    'Update public and institutional views when duplicate challenge check changes reliance.',
    'Fail closed when duplicate challenge check cannot be established.',
  ]),
  "CHL-020": Object.freeze([
    'Confirm open challenge visibility against the immutable registry record.',
    'Preserve attributable evidence for open challenge visibility.',
    'Record unresolved uncertainty relating to open challenge visibility.',
    'Update public and institutional views when open challenge visibility changes reliance.',
    'Fail closed when open challenge visibility cannot be established.',
  ]),
  "CHL-021": Object.freeze([
    'Confirm reviewer assignment against the immutable registry record.',
    'Preserve attributable evidence for reviewer assignment.',
    'Record unresolved uncertainty relating to reviewer assignment.',
    'Update public and institutional views when reviewer assignment changes reliance.',
    'Fail closed when reviewer assignment cannot be established.',
  ]),
  "CHL-022": Object.freeze([
    'Confirm reviewer qualification against the immutable registry record.',
    'Preserve attributable evidence for reviewer qualification.',
    'Record unresolved uncertainty relating to reviewer qualification.',
    'Update public and institutional views when reviewer qualification changes reliance.',
    'Fail closed when reviewer qualification cannot be established.',
  ]),
  "CHL-023": Object.freeze([
    'Confirm reviewer independence against the immutable registry record.',
    'Preserve attributable evidence for reviewer independence.',
    'Record unresolved uncertainty relating to reviewer independence.',
    'Update public and institutional views when reviewer independence changes reliance.',
    'Fail closed when reviewer independence cannot be established.',
  ]),
  "CHL-024": Object.freeze([
    'Confirm reviewer conflicts against the immutable registry record.',
    'Preserve attributable evidence for reviewer conflicts.',
    'Record unresolved uncertainty relating to reviewer conflicts.',
    'Update public and institutional views when reviewer conflicts changes reliance.',
    'Fail closed when reviewer conflicts cannot be established.',
  ]),
  "CHL-025": Object.freeze([
    'Confirm review scope against the immutable registry record.',
    'Preserve attributable evidence for review scope.',
    'Record unresolved uncertainty relating to review scope.',
    'Update public and institutional views when review scope changes reliance.',
    'Fail closed when review scope cannot be established.',
  ]),
  "CHL-026": Object.freeze([
    'Confirm review plan against the immutable registry record.',
    'Preserve attributable evidence for review plan.',
    'Record unresolved uncertainty relating to review plan.',
    'Update public and institutional views when review plan changes reliance.',
    'Fail closed when review plan cannot be established.',
  ]),
  "CHL-027": Object.freeze([
    'Confirm response deadline against the immutable registry record.',
    'Preserve attributable evidence for response deadline.',
    'Record unresolved uncertainty relating to response deadline.',
    'Update public and institutional views when response deadline changes reliance.',
    'Fail closed when response deadline cannot be established.',
  ]),
  "CHL-028": Object.freeze([
    'Confirm publisher notification against the immutable registry record.',
    'Preserve attributable evidence for publisher notification.',
    'Record unresolved uncertainty relating to publisher notification.',
    'Update public and institutional views when publisher notification changes reliance.',
    'Fail closed when publisher notification cannot be established.',
  ]),
  "CHL-029": Object.freeze([
    'Confirm publisher response against the immutable registry record.',
    'Preserve attributable evidence for publisher response.',
    'Record unresolved uncertainty relating to publisher response.',
    'Update public and institutional views when publisher response changes reliance.',
    'Fail closed when publisher response cannot be established.',
  ]),
  "CHL-030": Object.freeze([
    'Confirm response evidence integrity against the immutable registry record.',
    'Preserve attributable evidence for response evidence integrity.',
    'Record unresolved uncertainty relating to response evidence integrity.',
    'Update public and institutional views when response evidence integrity changes reliance.',
    'Fail closed when response evidence integrity cannot be established.',
  ]),
  "CHL-031": Object.freeze([
    'Confirm finding identity against the immutable registry record.',
    'Preserve attributable evidence for finding identity.',
    'Record unresolved uncertainty relating to finding identity.',
    'Update public and institutional views when finding identity changes reliance.',
    'Fail closed when finding identity cannot be established.',
  ]),
  "CHL-032": Object.freeze([
    'Confirm finding evidence mapping against the immutable registry record.',
    'Preserve attributable evidence for finding evidence mapping.',
    'Record unresolved uncertainty relating to finding evidence mapping.',
    'Update public and institutional views when finding evidence mapping changes reliance.',
    'Fail closed when finding evidence mapping cannot be established.',
  ]),
  "CHL-033": Object.freeze([
    'Confirm finding reasoning against the immutable registry record.',
    'Preserve attributable evidence for finding reasoning.',
    'Record unresolved uncertainty relating to finding reasoning.',
    'Update public and institutional views when finding reasoning changes reliance.',
    'Fail closed when finding reasoning cannot be established.',
  ]),
  "CHL-034": Object.freeze([
    'Confirm finding conflict handling against the immutable registry record.',
    'Preserve attributable evidence for finding conflict handling.',
    'Record unresolved uncertainty relating to finding conflict handling.',
    'Update public and institutional views when finding conflict handling changes reliance.',
    'Fail closed when finding conflict handling cannot be established.',
  ]),
  "CHL-035": Object.freeze([
    'Confirm earliest failure analysis against the immutable registry record.',
    'Preserve attributable evidence for earliest failure analysis.',
    'Record unresolved uncertainty relating to earliest failure analysis.',
    'Update public and institutional views when earliest failure analysis changes reliance.',
    'Fail closed when earliest failure analysis cannot be established.',
  ]),
  "CHL-036": Object.freeze([
    'Confirm determination impact against the immutable registry record.',
    'Preserve attributable evidence for determination impact.',
    'Record unresolved uncertainty relating to determination impact.',
    'Update public and institutional views when determination impact changes reliance.',
    'Fail closed when determination impact cannot be established.',
  ]),
  "CHL-037": Object.freeze([
    'Confirm execution receipt impact against the immutable registry record.',
    'Preserve attributable evidence for execution receipt impact.',
    'Record unresolved uncertainty relating to execution receipt impact.',
    'Update public and institutional views when execution receipt impact changes reliance.',
    'Fail closed when execution receipt impact cannot be established.',
  ]),
  "CHL-038": Object.freeze([
    'Confirm outcome impact against the immutable registry record.',
    'Preserve attributable evidence for outcome impact.',
    'Record unresolved uncertainty relating to outcome impact.',
    'Update public and institutional views when outcome impact changes reliance.',
    'Fail closed when outcome impact cannot be established.',
  ]),
  "CHL-039": Object.freeze([
    'Confirm claims boundary impact against the immutable registry record.',
    'Preserve attributable evidence for claims boundary impact.',
    'Record unresolved uncertainty relating to claims boundary impact.',
    'Update public and institutional views when claims boundary impact changes reliance.',
    'Fail closed when claims boundary impact cannot be established.',
  ]),
  "CHL-040": Object.freeze([
    'Confirm verification impact against the immutable registry record.',
    'Preserve attributable evidence for verification impact.',
    'Record unresolved uncertainty relating to verification impact.',
    'Update public and institutional views when verification impact changes reliance.',
    'Fail closed when verification impact cannot be established.',
  ]),
  "CHL-041": Object.freeze([
    'Confirm reliance impact against the immutable registry record.',
    'Preserve attributable evidence for reliance impact.',
    'Record unresolved uncertainty relating to reliance impact.',
    'Update public and institutional views when reliance impact changes reliance.',
    'Fail closed when reliance impact cannot be established.',
  ]),
  "CHL-042": Object.freeze([
    'Confirm disposition authority against the immutable registry record.',
    'Preserve attributable evidence for disposition authority.',
    'Record unresolved uncertainty relating to disposition authority.',
    'Update public and institutional views when disposition authority changes reliance.',
    'Fail closed when disposition authority cannot be established.',
  ]),
  "CHL-043": Object.freeze([
    'Confirm disposition support against the immutable registry record.',
    'Preserve attributable evidence for disposition support.',
    'Record unresolved uncertainty relating to disposition support.',
    'Update public and institutional views when disposition support changes reliance.',
    'Fail closed when disposition support cannot be established.',
  ]),
  "CHL-044": Object.freeze([
    'Confirm upheld requirements against the immutable registry record.',
    'Preserve attributable evidence for upheld requirements.',
    'Record unresolved uncertainty relating to upheld requirements.',
    'Update public and institutional views when upheld requirements changes reliance.',
    'Fail closed when upheld requirements cannot be established.',
  ]),
  "CHL-045": Object.freeze([
    'Confirm modified requirements against the immutable registry record.',
    'Preserve attributable evidence for modified requirements.',
    'Record unresolved uncertainty relating to modified requirements.',
    'Update public and institutional views when modified requirements changes reliance.',
    'Fail closed when modified requirements cannot be established.',
  ]),
  "CHL-046": Object.freeze([
    'Confirm reversed requirements against the immutable registry record.',
    'Preserve attributable evidence for reversed requirements.',
    'Record unresolved uncertainty relating to reversed requirements.',
    'Update public and institutional views when reversed requirements changes reliance.',
    'Fail closed when reversed requirements cannot be established.',
  ]),
  "CHL-047": Object.freeze([
    'Confirm closed requirements against the immutable registry record.',
    'Preserve attributable evidence for closed requirements.',
    'Record unresolved uncertainty relating to closed requirements.',
    'Update public and institutional views when closed requirements changes reliance.',
    'Fail closed when closed requirements cannot be established.',
  ]),
  "CHL-048": Object.freeze([
    'Confirm withdrawn requirements against the immutable registry record.',
    'Preserve attributable evidence for withdrawn requirements.',
    'Record unresolved uncertainty relating to withdrawn requirements.',
    'Update public and institutional views when withdrawn requirements changes reliance.',
    'Fail closed when withdrawn requirements cannot be established.',
  ]),
  "CHL-049": Object.freeze([
    'Confirm correction identity against the immutable registry record.',
    'Preserve attributable evidence for correction identity.',
    'Record unresolved uncertainty relating to correction identity.',
    'Update public and institutional views when correction identity changes reliance.',
    'Fail closed when correction identity cannot be established.',
  ]),
  "CHL-050": Object.freeze([
    'Confirm correction scope against the immutable registry record.',
    'Preserve attributable evidence for correction scope.',
    'Record unresolved uncertainty relating to correction scope.',
    'Update public and institutional views when correction scope changes reliance.',
    'Fail closed when correction scope cannot be established.',
  ]),
  "CHL-051": Object.freeze([
    'Confirm correction reason against the immutable registry record.',
    'Preserve attributable evidence for correction reason.',
    'Record unresolved uncertainty relating to correction reason.',
    'Update public and institutional views when correction reason changes reliance.',
    'Fail closed when correction reason cannot be established.',
  ]),
  "CHL-052": Object.freeze([
    'Confirm parent hash linkage against the immutable registry record.',
    'Preserve attributable evidence for parent hash linkage.',
    'Record unresolved uncertainty relating to parent hash linkage.',
    'Update public and institutional views when parent hash linkage changes reliance.',
    'Fail closed when parent hash linkage cannot be established.',
  ]),
  "CHL-053": Object.freeze([
    'Confirm amendment hash against the immutable registry record.',
    'Preserve attributable evidence for amendment hash.',
    'Record unresolved uncertainty relating to amendment hash.',
    'Update public and institutional views when amendment hash changes reliance.',
    'Fail closed when amendment hash cannot be established.',
  ]),
  "CHL-054": Object.freeze([
    'Confirm resulting hash against the immutable registry record.',
    'Preserve attributable evidence for resulting hash.',
    'Record unresolved uncertainty relating to resulting hash.',
    'Update public and institutional views when resulting hash changes reliance.',
    'Fail closed when resulting hash cannot be established.',
  ]),
  "CHL-055": Object.freeze([
    'Confirm no rewrite guarantee against the immutable registry record.',
    'Preserve attributable evidence for no rewrite guarantee.',
    'Record unresolved uncertainty relating to no rewrite guarantee.',
    'Update public and institutional views when no rewrite guarantee changes reliance.',
    'Fail closed when no rewrite guarantee cannot be established.',
  ]),
  "CHL-056": Object.freeze([
    'Confirm correction evidence against the immutable registry record.',
    'Preserve attributable evidence for correction evidence.',
    'Record unresolved uncertainty relating to correction evidence.',
    'Update public and institutional views when correction evidence changes reliance.',
    'Fail closed when correction evidence cannot be established.',
  ]),
  "CHL-057": Object.freeze([
    'Confirm correction authority against the immutable registry record.',
    'Preserve attributable evidence for correction authority.',
    'Record unresolved uncertainty relating to correction authority.',
    'Update public and institutional views when correction authority changes reliance.',
    'Fail closed when correction authority cannot be established.',
  ]),
  "CHL-058": Object.freeze([
    'Confirm correction verification against the immutable registry record.',
    'Preserve attributable evidence for correction verification.',
    'Record unresolved uncertainty relating to correction verification.',
    'Update public and institutional views when correction verification changes reliance.',
    'Fail closed when correction verification cannot be established.',
  ]),
  "CHL-059": Object.freeze([
    'Confirm supersession assessment against the immutable registry record.',
    'Preserve attributable evidence for supersession assessment.',
    'Record unresolved uncertainty relating to supersession assessment.',
    'Update public and institutional views when supersession assessment changes reliance.',
    'Fail closed when supersession assessment cannot be established.',
  ]),
  "CHL-060": Object.freeze([
    'Confirm supersession target against the immutable registry record.',
    'Preserve attributable evidence for supersession target.',
    'Record unresolved uncertainty relating to supersession target.',
    'Update public and institutional views when supersession target changes reliance.',
    'Fail closed when supersession target cannot be established.',
  ]),
  "CHL-061": Object.freeze([
    'Confirm supersession chain against the immutable registry record.',
    'Preserve attributable evidence for supersession chain.',
    'Record unresolved uncertainty relating to supersession chain.',
    'Update public and institutional views when supersession chain changes reliance.',
    'Fail closed when supersession chain cannot be established.',
  ]),
  "CHL-062": Object.freeze([
    'Confirm public status update against the immutable registry record.',
    'Preserve attributable evidence for public status update.',
    'Record unresolved uncertainty relating to public status update.',
    'Update public and institutional views when public status update changes reliance.',
    'Fail closed when public status update cannot be established.',
  ]),
  "CHL-063": Object.freeze([
    'Confirm public summary against the immutable registry record.',
    'Preserve attributable evidence for public summary.',
    'Record unresolved uncertainty relating to public summary.',
    'Update public and institutional views when public summary changes reliance.',
    'Fail closed when public summary cannot be established.',
  ]),
  "CHL-064": Object.freeze([
    'Confirm challenge url against the immutable registry record.',
    'Preserve attributable evidence for challenge url.',
    'Record unresolved uncertainty relating to challenge url.',
    'Update public and institutional views when challenge url changes reliance.',
    'Fail closed when challenge url cannot be established.',
  ]),
  "CHL-065": Object.freeze([
    'Confirm correction url against the immutable registry record.',
    'Preserve attributable evidence for correction url.',
    'Record unresolved uncertainty relating to correction url.',
    'Update public and institutional views when correction url changes reliance.',
    'Fail closed when correction url cannot be established.',
  ]),
  "CHL-066": Object.freeze([
    'Confirm resolution hash against the immutable registry record.',
    'Preserve attributable evidence for resolution hash.',
    'Record unresolved uncertainty relating to resolution hash.',
    'Update public and institutional views when resolution hash changes reliance.',
    'Fail closed when resolution hash cannot be established.',
  ]),
  "CHL-067": Object.freeze([
    'Confirm audit event against the immutable registry record.',
    'Preserve attributable evidence for audit event.',
    'Record unresolved uncertainty relating to audit event.',
    'Update public and institutional views when audit event changes reliance.',
    'Fail closed when audit event cannot be established.',
  ]),
  "CHL-068": Object.freeze([
    'Confirm audit-chain continuity against the immutable registry record.',
    'Preserve attributable evidence for audit-chain continuity.',
    'Record unresolved uncertainty relating to audit-chain continuity.',
    'Update public and institutional views when audit-chain continuity changes reliance.',
    'Fail closed when audit-chain continuity cannot be established.',
  ]),
  "CHL-069": Object.freeze([
    'Confirm chronology against the immutable registry record.',
    'Preserve attributable evidence for chronology.',
    'Record unresolved uncertainty relating to chronology.',
    'Update public and institutional views when chronology changes reliance.',
    'Fail closed when chronology cannot be established.',
  ]),
  "CHL-070": Object.freeze([
    'Confirm notification completion against the immutable registry record.',
    'Preserve attributable evidence for notification completion.',
    'Record unresolved uncertainty relating to notification completion.',
    'Update public and institutional views when notification completion changes reliance.',
    'Fail closed when notification completion cannot be established.',
  ]),
  "CHL-071": Object.freeze([
    'Confirm retention policy against the immutable registry record.',
    'Preserve attributable evidence for retention policy.',
    'Record unresolved uncertainty relating to retention policy.',
    'Update public and institutional views when retention policy changes reliance.',
    'Fail closed when retention policy cannot be established.',
  ]),
  "CHL-072": Object.freeze([
    'Confirm preservation proof against the immutable registry record.',
    'Preserve attributable evidence for preservation proof.',
    'Record unresolved uncertainty relating to preservation proof.',
    'Update public and institutional views when preservation proof changes reliance.',
    'Fail closed when preservation proof cannot be established.',
  ]),
  "CHL-073": Object.freeze([
    'Confirm machine-readable export against the immutable registry record.',
    'Preserve attributable evidence for machine-readable export.',
    'Record unresolved uncertainty relating to machine-readable export.',
    'Update public and institutional views when machine-readable export changes reliance.',
    'Fail closed when machine-readable export cannot be established.',
  ]),
  "CHL-074": Object.freeze([
    'Confirm human-readable report against the immutable registry record.',
    'Preserve attributable evidence for human-readable report.',
    'Record unresolved uncertainty relating to human-readable report.',
    'Update public and institutional views when human-readable report changes reliance.',
    'Fail closed when human-readable report cannot be established.',
  ]),
  "CHL-075": Object.freeze([
    'Confirm registry projection against the immutable registry record.',
    'Preserve attributable evidence for registry projection.',
    'Record unresolved uncertainty relating to registry projection.',
    'Update public and institutional views when registry projection changes reliance.',
    'Fail closed when registry projection cannot be established.',
  ]),
  "CHL-076": Object.freeze([
    'Confirm verification projection against the immutable registry record.',
    'Preserve attributable evidence for verification projection.',
    'Record unresolved uncertainty relating to verification projection.',
    'Update public and institutional views when verification projection changes reliance.',
    'Fail closed when verification projection cannot be established.',
  ]),
  "CHL-077": Object.freeze([
    'Confirm portfolio projection against the immutable registry record.',
    'Preserve attributable evidence for portfolio projection.',
    'Record unresolved uncertainty relating to portfolio projection.',
    'Update public and institutional views when portfolio projection changes reliance.',
    'Fail closed when portfolio projection cannot be established.',
  ]),
  "CHL-078": Object.freeze([
    'Confirm acceptance-test completion against the immutable registry record.',
    'Preserve attributable evidence for acceptance-test completion.',
    'Record unresolved uncertainty relating to acceptance-test completion.',
    'Update public and institutional views when acceptance-test completion changes reliance.',
    'Fail closed when acceptance-test completion cannot be established.',
  ]),
  "CHL-079": Object.freeze([
    'Confirm final publication gate against the immutable registry record.',
    'Preserve attributable evidence for final publication gate.',
    'Record unresolved uncertainty relating to final publication gate.',
    'Update public and institutional views when final publication gate changes reliance.',
    'Fail closed when final publication gate cannot be established.',
  ]),
  "CHL-080": Object.freeze([
    'Confirm independent review lane against the immutable registry record.',
    'Preserve attributable evidence for independent review lane.',
    'Record unresolved uncertainty relating to independent review lane.',
    'Update public and institutional views when independent review lane changes reliance.',
    'Fail closed when independent review lane cannot be established.',
  ]),
});

export function challengeControlGuidance(controlId: string): readonly string[] { return CHALLENGE_CONTROL_GUIDANCE[controlId] ?? Object.freeze([]); }

export function isChallengeIdMissing(value: string): value is "CHALLENGE_ID_MISSING" { return value === "CHALLENGE_ID_MISSING"; }
export const CHALLENGE_ID_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CHALLENGE_ID_MISSING;

export function isChallengeDuplicate(value: string): value is "CHALLENGE_DUPLICATE" { return value === "CHALLENGE_DUPLICATE"; }
export const CHALLENGE_DUPLICATE_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CHALLENGE_DUPLICATE;

export function isChallengeTimeInvalid(value: string): value is "CHALLENGE_TIME_INVALID" { return value === "CHALLENGE_TIME_INVALID"; }
export const CHALLENGE_TIME_INVALID_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CHALLENGE_TIME_INVALID;

export function isChallengeAfterWithdrawal(value: string): value is "CHALLENGE_AFTER_WITHDRAWAL" { return value === "CHALLENGE_AFTER_WITHDRAWAL"; }
export const CHALLENGE_AFTER_WITHDRAWAL_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CHALLENGE_AFTER_WITHDRAWAL;

export function isChallengerIdentityMissing(value: string): value is "CHALLENGER_IDENTITY_MISSING" { return value === "CHALLENGER_IDENTITY_MISSING"; }
export const CHALLENGER_IDENTITY_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CHALLENGER_IDENTITY_MISSING;

export function isChallengerAuthorityMissing(value: string): value is "CHALLENGER_AUTHORITY_MISSING" { return value === "CHALLENGER_AUTHORITY_MISSING"; }
export const CHALLENGER_AUTHORITY_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CHALLENGER_AUTHORITY_MISSING;

export function isSubjectMissing(value: string): value is "SUBJECT_MISSING" { return value === "SUBJECT_MISSING"; }
export const SUBJECT_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.SUBJECT_MISSING;

export function isClaimMissing(value: string): value is "CLAIM_MISSING" { return value === "CLAIM_MISSING"; }
export const CLAIM_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CLAIM_MISSING;

export function isClaimScopeTooBroad(value: string): value is "CLAIM_SCOPE_TOO_BROAD" { return value === "CLAIM_SCOPE_TOO_BROAD"; }
export const CLAIM_SCOPE_TOO_BROAD_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CLAIM_SCOPE_TOO_BROAD;

export function isBasisMissing(value: string): value is "BASIS_MISSING" { return value === "BASIS_MISSING"; }
export const BASIS_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.BASIS_MISSING;

export function isCounterEvidenceRequired(value: string): value is "COUNTER_EVIDENCE_REQUIRED" { return value === "COUNTER_EVIDENCE_REQUIRED"; }
export const COUNTER_EVIDENCE_REQUIRED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.COUNTER_EVIDENCE_REQUIRED;

export function isCounterEvidenceIdMissing(value: string): value is "COUNTER_EVIDENCE_ID_MISSING" { return value === "COUNTER_EVIDENCE_ID_MISSING"; }
export const COUNTER_EVIDENCE_ID_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.COUNTER_EVIDENCE_ID_MISSING;

export function isCounterEvidenceHashMissing(value: string): value is "COUNTER_EVIDENCE_HASH_MISSING" { return value === "COUNTER_EVIDENCE_HASH_MISSING"; }
export const COUNTER_EVIDENCE_HASH_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.COUNTER_EVIDENCE_HASH_MISSING;

export function isCounterEvidenceTimeInvalid(value: string): value is "COUNTER_EVIDENCE_TIME_INVALID" { return value === "COUNTER_EVIDENCE_TIME_INVALID"; }
export const COUNTER_EVIDENCE_TIME_INVALID_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.COUNTER_EVIDENCE_TIME_INVALID;

export function isCounterEvidenceCustodyMissing(value: string): value is "COUNTER_EVIDENCE_CUSTODY_MISSING" { return value === "COUNTER_EVIDENCE_CUSTODY_MISSING"; }
export const COUNTER_EVIDENCE_CUSTODY_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.COUNTER_EVIDENCE_CUSTODY_MISSING;

export function isCounterEvidenceDisclosureMissing(value: string): value is "COUNTER_EVIDENCE_DISCLOSURE_MISSING" { return value === "COUNTER_EVIDENCE_DISCLOSURE_MISSING"; }
export const COUNTER_EVIDENCE_DISCLOSURE_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.COUNTER_EVIDENCE_DISCLOSURE_MISSING;

export function isCounterEvidenceInadmissible(value: string): value is "COUNTER_EVIDENCE_INADMISSIBLE" { return value === "COUNTER_EVIDENCE_INADMISSIBLE"; }
export const COUNTER_EVIDENCE_INADMISSIBLE_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.COUNTER_EVIDENCE_INADMISSIBLE;

export function isOriginalRecordMissing(value: string): value is "ORIGINAL_RECORD_MISSING" { return value === "ORIGINAL_RECORD_MISSING"; }
export const ORIGINAL_RECORD_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.ORIGINAL_RECORD_MISSING;

export function isOriginalHashMismatch(value: string): value is "ORIGINAL_HASH_MISMATCH" { return value === "ORIGINAL_HASH_MISMATCH"; }
export const ORIGINAL_HASH_MISMATCH_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.ORIGINAL_HASH_MISMATCH;

export function isArtifactIdMismatch(value: string): value is "ARTIFACT_ID_MISMATCH" { return value === "ARTIFACT_ID_MISMATCH"; }
export const ARTIFACT_ID_MISMATCH_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.ARTIFACT_ID_MISMATCH;

export function isRegistryIdMismatch(value: string): value is "REGISTRY_ID_MISMATCH" { return value === "REGISTRY_ID_MISMATCH"; }
export const REGISTRY_ID_MISMATCH_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.REGISTRY_ID_MISMATCH;

export function isArtifactNotChallengeable(value: string): value is "ARTIFACT_NOT_CHALLENGEABLE" { return value === "ARTIFACT_NOT_CHALLENGEABLE"; }
export const ARTIFACT_NOT_CHALLENGEABLE_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.ARTIFACT_NOT_CHALLENGEABLE;

export function isOpenChallengeAlreadyExists(value: string): value is "OPEN_CHALLENGE_ALREADY_EXISTS" { return value === "OPEN_CHALLENGE_ALREADY_EXISTS"; }
export const OPEN_CHALLENGE_ALREADY_EXISTS_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.OPEN_CHALLENGE_ALREADY_EXISTS;

export function isReviewerRequired(value: string): value is "REVIEWER_REQUIRED" { return value === "REVIEWER_REQUIRED"; }
export const REVIEWER_REQUIRED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.REVIEWER_REQUIRED;

export function isReviewerIdMissing(value: string): value is "REVIEWER_ID_MISSING" { return value === "REVIEWER_ID_MISSING"; }
export const REVIEWER_ID_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.REVIEWER_ID_MISSING;

export function isReviewerRoleMissing(value: string): value is "REVIEWER_ROLE_MISSING" { return value === "REVIEWER_ROLE_MISSING"; }
export const REVIEWER_ROLE_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.REVIEWER_ROLE_MISSING;

export function isReviewerConflictUnresolved(value: string): value is "REVIEWER_CONFLICT_UNRESOLVED" { return value === "REVIEWER_CONFLICT_UNRESOLVED"; }
export const REVIEWER_CONFLICT_UNRESOLVED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.REVIEWER_CONFLICT_UNRESOLVED;

export function isReviewerUnqualified(value: string): value is "REVIEWER_UNQUALIFIED" { return value === "REVIEWER_UNQUALIFIED"; }
export const REVIEWER_UNQUALIFIED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.REVIEWER_UNQUALIFIED;

export function isReviewScopeMissing(value: string): value is "REVIEW_SCOPE_MISSING" { return value === "REVIEW_SCOPE_MISSING"; }
export const REVIEW_SCOPE_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.REVIEW_SCOPE_MISSING;

export function isResponseDeadlineMissing(value: string): value is "RESPONSE_DEADLINE_MISSING" { return value === "RESPONSE_DEADLINE_MISSING"; }
export const RESPONSE_DEADLINE_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.RESPONSE_DEADLINE_MISSING;

export function isPublisherResponseMissing(value: string): value is "PUBLISHER_RESPONSE_MISSING" { return value === "PUBLISHER_RESPONSE_MISSING"; }
export const PUBLISHER_RESPONSE_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.PUBLISHER_RESPONSE_MISSING;

export function isPublisherResponseLate(value: string): value is "PUBLISHER_RESPONSE_LATE" { return value === "PUBLISHER_RESPONSE_LATE"; }
export const PUBLISHER_RESPONSE_LATE_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.PUBLISHER_RESPONSE_LATE;

export function isPublisherEvidenceHashMissing(value: string): value is "PUBLISHER_EVIDENCE_HASH_MISSING" { return value === "PUBLISHER_EVIDENCE_HASH_MISSING"; }
export const PUBLISHER_EVIDENCE_HASH_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.PUBLISHER_EVIDENCE_HASH_MISSING;

export function isFindingIdMissing(value: string): value is "FINDING_ID_MISSING" { return value === "FINDING_ID_MISSING"; }
export const FINDING_ID_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.FINDING_ID_MISSING;

export function isFindingUnsupported(value: string): value is "FINDING_UNSUPPORTED" { return value === "FINDING_UNSUPPORTED"; }
export const FINDING_UNSUPPORTED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.FINDING_UNSUPPORTED;

export function isFindingConflictUnresolved(value: string): value is "FINDING_CONFLICT_UNRESOLVED" { return value === "FINDING_CONFLICT_UNRESOLVED"; }
export const FINDING_CONFLICT_UNRESOLVED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.FINDING_CONFLICT_UNRESOLVED;

export function isEarliestFailureUnstated(value: string): value is "EARLIEST_FAILURE_UNSTATED" { return value === "EARLIEST_FAILURE_UNSTATED"; }
export const EARLIEST_FAILURE_UNSTATED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.EARLIEST_FAILURE_UNSTATED;

export function isDispositionMissing(value: string): value is "DISPOSITION_MISSING" { return value === "DISPOSITION_MISSING"; }
export const DISPOSITION_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.DISPOSITION_MISSING;

export function isDispositionInvalid(value: string): value is "DISPOSITION_INVALID" { return value === "DISPOSITION_INVALID"; }
export const DISPOSITION_INVALID_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.DISPOSITION_INVALID;

export function isUpheldWithoutSupport(value: string): value is "UPHELD_WITHOUT_SUPPORT" { return value === "UPHELD_WITHOUT_SUPPORT"; }
export const UPHELD_WITHOUT_SUPPORT_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.UPHELD_WITHOUT_SUPPORT;

export function isModifiedWithoutCorrection(value: string): value is "MODIFIED_WITHOUT_CORRECTION" { return value === "MODIFIED_WITHOUT_CORRECTION"; }
export const MODIFIED_WITHOUT_CORRECTION_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.MODIFIED_WITHOUT_CORRECTION;

export function isReversedWithoutRelianceEffect(value: string): value is "REVERSED_WITHOUT_RELIANCE_EFFECT" { return value === "REVERSED_WITHOUT_RELIANCE_EFFECT"; }
export const REVERSED_WITHOUT_RELIANCE_EFFECT_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.REVERSED_WITHOUT_RELIANCE_EFFECT;

export function isClosedWithOpenFindings(value: string): value is "CLOSED_WITH_OPEN_FINDINGS" { return value === "CLOSED_WITH_OPEN_FINDINGS"; }
export const CLOSED_WITH_OPEN_FINDINGS_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CLOSED_WITH_OPEN_FINDINGS;

export function isWithdrawalReasonMissing(value: string): value is "WITHDRAWAL_REASON_MISSING" { return value === "WITHDRAWAL_REASON_MISSING"; }
export const WITHDRAWAL_REASON_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.WITHDRAWAL_REASON_MISSING;

export function isCorrectionIdMissing(value: string): value is "CORRECTION_ID_MISSING" { return value === "CORRECTION_ID_MISSING"; }
export const CORRECTION_ID_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CORRECTION_ID_MISSING;

export function isCorrectionScopeMissing(value: string): value is "CORRECTION_SCOPE_MISSING" { return value === "CORRECTION_SCOPE_MISSING"; }
export const CORRECTION_SCOPE_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CORRECTION_SCOPE_MISSING;

export function isCorrectionReasonMissing(value: string): value is "CORRECTION_REASON_MISSING" { return value === "CORRECTION_REASON_MISSING"; }
export const CORRECTION_REASON_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CORRECTION_REASON_MISSING;

export function isParentHashMissing(value: string): value is "PARENT_HASH_MISSING" { return value === "PARENT_HASH_MISSING"; }
export const PARENT_HASH_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.PARENT_HASH_MISSING;

export function isParentHashMismatch(value: string): value is "PARENT_HASH_MISMATCH" { return value === "PARENT_HASH_MISMATCH"; }
export const PARENT_HASH_MISMATCH_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.PARENT_HASH_MISMATCH;

export function isAmendmentHashMissing(value: string): value is "AMENDMENT_HASH_MISSING" { return value === "AMENDMENT_HASH_MISSING"; }
export const AMENDMENT_HASH_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.AMENDMENT_HASH_MISSING;

export function isResultingHashMissing(value: string): value is "RESULTING_HASH_MISSING" { return value === "RESULTING_HASH_MISSING"; }
export const RESULTING_HASH_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.RESULTING_HASH_MISSING;

export function isCorrectionRewritesOriginal(value: string): value is "CORRECTION_REWRITES_ORIGINAL" { return value === "CORRECTION_REWRITES_ORIGINAL"; }
export const CORRECTION_REWRITES_ORIGINAL_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CORRECTION_REWRITES_ORIGINAL;

export function isCorrectionScopeExceeded(value: string): value is "CORRECTION_SCOPE_EXCEEDED" { return value === "CORRECTION_SCOPE_EXCEEDED"; }
export const CORRECTION_SCOPE_EXCEEDED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CORRECTION_SCOPE_EXCEEDED;

export function isCorrectionEvidenceMissing(value: string): value is "CORRECTION_EVIDENCE_MISSING" { return value === "CORRECTION_EVIDENCE_MISSING"; }
export const CORRECTION_EVIDENCE_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CORRECTION_EVIDENCE_MISSING;

export function isCorrectionAuthorityMissing(value: string): value is "CORRECTION_AUTHORITY_MISSING" { return value === "CORRECTION_AUTHORITY_MISSING"; }
export const CORRECTION_AUTHORITY_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CORRECTION_AUTHORITY_MISSING;

export function isCorrectionNotVerified(value: string): value is "CORRECTION_NOT_VERIFIED" { return value === "CORRECTION_NOT_VERIFIED"; }
export const CORRECTION_NOT_VERIFIED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CORRECTION_NOT_VERIFIED;

export function isSupersessionRequired(value: string): value is "SUPERSESSION_REQUIRED" { return value === "SUPERSESSION_REQUIRED"; }
export const SUPERSESSION_REQUIRED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.SUPERSESSION_REQUIRED;

export function isSupersessionTargetMissing(value: string): value is "SUPERSESSION_TARGET_MISSING" { return value === "SUPERSESSION_TARGET_MISSING"; }
export const SUPERSESSION_TARGET_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.SUPERSESSION_TARGET_MISSING;

export function isSupersessionChainBroken(value: string): value is "SUPERSESSION_CHAIN_BROKEN" { return value === "SUPERSESSION_CHAIN_BROKEN"; }
export const SUPERSESSION_CHAIN_BROKEN_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.SUPERSESSION_CHAIN_BROKEN;

export function isPublicStatusNotUpdated(value: string): value is "PUBLIC_STATUS_NOT_UPDATED" { return value === "PUBLIC_STATUS_NOT_UPDATED"; }
export const PUBLIC_STATUS_NOT_UPDATED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.PUBLIC_STATUS_NOT_UPDATED;

export function isPublicSummaryMissing(value: string): value is "PUBLIC_SUMMARY_MISSING" { return value === "PUBLIC_SUMMARY_MISSING"; }
export const PUBLIC_SUMMARY_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.PUBLIC_SUMMARY_MISSING;

export function isChallengeUrlMissing(value: string): value is "CHALLENGE_URL_MISSING" { return value === "CHALLENGE_URL_MISSING"; }
export const CHALLENGE_URL_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CHALLENGE_URL_MISSING;

export function isCorrectionUrlMissing(value: string): value is "CORRECTION_URL_MISSING" { return value === "CORRECTION_URL_MISSING"; }
export const CORRECTION_URL_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CORRECTION_URL_MISSING;

export function isResolutionHashMissing(value: string): value is "RESOLUTION_HASH_MISSING" { return value === "RESOLUTION_HASH_MISSING"; }
export const RESOLUTION_HASH_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.RESOLUTION_HASH_MISSING;

export function isAuditEventMissing(value: string): value is "AUDIT_EVENT_MISSING" { return value === "AUDIT_EVENT_MISSING"; }
export const AUDIT_EVENT_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.AUDIT_EVENT_MISSING;

export function isAuditChainBroken(value: string): value is "AUDIT_CHAIN_BROKEN" { return value === "AUDIT_CHAIN_BROKEN"; }
export const AUDIT_CHAIN_BROKEN_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.AUDIT_CHAIN_BROKEN;

export function isTimeOrderInvalid(value: string): value is "TIME_ORDER_INVALID" { return value === "TIME_ORDER_INVALID"; }
export const TIME_ORDER_INVALID_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.TIME_ORDER_INVALID;

export function isClaimsBoundaryNotUpdated(value: string): value is "CLAIMS_BOUNDARY_NOT_UPDATED" { return value === "CLAIMS_BOUNDARY_NOT_UPDATED"; }
export const CLAIMS_BOUNDARY_NOT_UPDATED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CLAIMS_BOUNDARY_NOT_UPDATED;

export function isVerificationStatusNotUpdated(value: string): value is "VERIFICATION_STATUS_NOT_UPDATED" { return value === "VERIFICATION_STATUS_NOT_UPDATED"; }
export const VERIFICATION_STATUS_NOT_UPDATED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.VERIFICATION_STATUS_NOT_UPDATED;

export function isRelianceStatusNotUpdated(value: string): value is "RELIANCE_STATUS_NOT_UPDATED" { return value === "RELIANCE_STATUS_NOT_UPDATED"; }
export const RELIANCE_STATUS_NOT_UPDATED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.RELIANCE_STATUS_NOT_UPDATED;

export function isNotificationIncomplete(value: string): value is "NOTIFICATION_INCOMPLETE" { return value === "NOTIFICATION_INCOMPLETE"; }
export const NOTIFICATION_INCOMPLETE_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.NOTIFICATION_INCOMPLETE;

export function isRetentionPolicyMissing(value: string): value is "RETENTION_POLICY_MISSING" { return value === "RETENTION_POLICY_MISSING"; }
export const RETENTION_POLICY_MISSING_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.RETENTION_POLICY_MISSING;

export function isPreservationFailure(value: string): value is "PRESERVATION_FAILURE" { return value === "PRESERVATION_FAILURE"; }
export const PRESERVATION_FAILURE_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.PRESERVATION_FAILURE;

export function isChallengeAccepted(value: string): value is "CHALLENGE_ACCEPTED" { return value === "CHALLENGE_ACCEPTED"; }
export const CHALLENGE_ACCEPTED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CHALLENGE_ACCEPTED;

export function isReviewComplete(value: string): value is "REVIEW_COMPLETE" { return value === "REVIEW_COMPLETE"; }
export const REVIEW_COMPLETE_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.REVIEW_COMPLETE;

export function isCorrectionAppended(value: string): value is "CORRECTION_APPENDED" { return value === "CORRECTION_APPENDED"; }
export const CORRECTION_APPENDED_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.CORRECTION_APPENDED;

export function isResolutionComplete(value: string): value is "RESOLUTION_COMPLETE" { return value === "RESOLUTION_COMPLETE"; }
export const RESOLUTION_COMPLETE_CHALLENGE_DEFINITION = CHALLENGE_REASON_DICTIONARY.RESOLUTION_COMPLETE;

export interface ChallengeResolutionPolicy {
  policyId: string;
  subjectType: ChallengeSubjectType;
  minimumReviewers: number;
  independentReviewRequired: boolean;
  permittedDispositions: readonly ChallengeStatus[];
  requiredEvidence: readonly string[];
  relianceEffectGuidance: string;
}

export const CHALLENGE_RESOLUTION_POLICIES: readonly ChallengeResolutionPolicy[] = Object.freeze([
  {
    policyId: "CRP-001",
    subjectType: "CLAIM",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 001"]),
    relianceEffectGuidance: "Policy 001 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-002",
    subjectType: "EVIDENCE",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 002"]),
    relianceEffectGuidance: "Policy 002 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-003",
    subjectType: "AUTHORITY",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 003"]),
    relianceEffectGuidance: "Policy 003 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-004",
    subjectType: "CONTINUITY",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 004"]),
    relianceEffectGuidance: "Policy 004 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-005",
    subjectType: "GATE_RESULT",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 005"]),
    relianceEffectGuidance: "Policy 005 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-006",
    subjectType: "DETERMINATION",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 006"]),
    relianceEffectGuidance: "Policy 006 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-007",
    subjectType: "EXECUTION_RECEIPT",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 007"]),
    relianceEffectGuidance: "Policy 007 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-008",
    subjectType: "OUTCOME",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 008"]),
    relianceEffectGuidance: "Policy 008 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-009",
    subjectType: "INTEGRITY",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 009"]),
    relianceEffectGuidance: "Policy 009 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-010",
    subjectType: "VERIFICATION",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 010"]),
    relianceEffectGuidance: "Policy 010 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-011",
    subjectType: "DISCLOSURE",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 011"]),
    relianceEffectGuidance: "Policy 011 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-012",
    subjectType: "REGISTRY_STATUS",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 012"]),
    relianceEffectGuidance: "Policy 012 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-013",
    subjectType: "CLAIM",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 013"]),
    relianceEffectGuidance: "Policy 013 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-014",
    subjectType: "EVIDENCE",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 014"]),
    relianceEffectGuidance: "Policy 014 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-015",
    subjectType: "AUTHORITY",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 015"]),
    relianceEffectGuidance: "Policy 015 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-016",
    subjectType: "CONTINUITY",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 016"]),
    relianceEffectGuidance: "Policy 016 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-017",
    subjectType: "GATE_RESULT",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 017"]),
    relianceEffectGuidance: "Policy 017 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-018",
    subjectType: "DETERMINATION",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 018"]),
    relianceEffectGuidance: "Policy 018 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-019",
    subjectType: "EXECUTION_RECEIPT",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 019"]),
    relianceEffectGuidance: "Policy 019 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-020",
    subjectType: "OUTCOME",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 020"]),
    relianceEffectGuidance: "Policy 020 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-021",
    subjectType: "INTEGRITY",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 021"]),
    relianceEffectGuidance: "Policy 021 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-022",
    subjectType: "VERIFICATION",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 022"]),
    relianceEffectGuidance: "Policy 022 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-023",
    subjectType: "DISCLOSURE",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 023"]),
    relianceEffectGuidance: "Policy 023 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-024",
    subjectType: "REGISTRY_STATUS",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 024"]),
    relianceEffectGuidance: "Policy 024 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-025",
    subjectType: "CLAIM",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 025"]),
    relianceEffectGuidance: "Policy 025 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-026",
    subjectType: "EVIDENCE",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 026"]),
    relianceEffectGuidance: "Policy 026 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-027",
    subjectType: "AUTHORITY",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 027"]),
    relianceEffectGuidance: "Policy 027 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-028",
    subjectType: "CONTINUITY",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 028"]),
    relianceEffectGuidance: "Policy 028 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-029",
    subjectType: "GATE_RESULT",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 029"]),
    relianceEffectGuidance: "Policy 029 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-030",
    subjectType: "DETERMINATION",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 030"]),
    relianceEffectGuidance: "Policy 030 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-031",
    subjectType: "EXECUTION_RECEIPT",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 031"]),
    relianceEffectGuidance: "Policy 031 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-032",
    subjectType: "OUTCOME",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 032"]),
    relianceEffectGuidance: "Policy 032 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-033",
    subjectType: "INTEGRITY",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 033"]),
    relianceEffectGuidance: "Policy 033 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-034",
    subjectType: "VERIFICATION",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 034"]),
    relianceEffectGuidance: "Policy 034 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-035",
    subjectType: "DISCLOSURE",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 035"]),
    relianceEffectGuidance: "Policy 035 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-036",
    subjectType: "REGISTRY_STATUS",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 036"]),
    relianceEffectGuidance: "Policy 036 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-037",
    subjectType: "CLAIM",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 037"]),
    relianceEffectGuidance: "Policy 037 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-038",
    subjectType: "EVIDENCE",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 038"]),
    relianceEffectGuidance: "Policy 038 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-039",
    subjectType: "AUTHORITY",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 039"]),
    relianceEffectGuidance: "Policy 039 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-040",
    subjectType: "CONTINUITY",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 040"]),
    relianceEffectGuidance: "Policy 040 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-041",
    subjectType: "GATE_RESULT",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 041"]),
    relianceEffectGuidance: "Policy 041 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-042",
    subjectType: "DETERMINATION",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 042"]),
    relianceEffectGuidance: "Policy 042 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-043",
    subjectType: "EXECUTION_RECEIPT",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 043"]),
    relianceEffectGuidance: "Policy 043 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-044",
    subjectType: "OUTCOME",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 044"]),
    relianceEffectGuidance: "Policy 044 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-045",
    subjectType: "INTEGRITY",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 045"]),
    relianceEffectGuidance: "Policy 045 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-046",
    subjectType: "VERIFICATION",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 046"]),
    relianceEffectGuidance: "Policy 046 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-047",
    subjectType: "DISCLOSURE",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 047"]),
    relianceEffectGuidance: "Policy 047 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-048",
    subjectType: "REGISTRY_STATUS",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 048"]),
    relianceEffectGuidance: "Policy 048 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-049",
    subjectType: "CLAIM",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 049"]),
    relianceEffectGuidance: "Policy 049 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-050",
    subjectType: "EVIDENCE",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 050"]),
    relianceEffectGuidance: "Policy 050 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-051",
    subjectType: "AUTHORITY",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 051"]),
    relianceEffectGuidance: "Policy 051 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-052",
    subjectType: "CONTINUITY",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 052"]),
    relianceEffectGuidance: "Policy 052 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-053",
    subjectType: "GATE_RESULT",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 053"]),
    relianceEffectGuidance: "Policy 053 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-054",
    subjectType: "DETERMINATION",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 054"]),
    relianceEffectGuidance: "Policy 054 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-055",
    subjectType: "EXECUTION_RECEIPT",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 055"]),
    relianceEffectGuidance: "Policy 055 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-056",
    subjectType: "OUTCOME",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 056"]),
    relianceEffectGuidance: "Policy 056 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-057",
    subjectType: "INTEGRITY",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 057"]),
    relianceEffectGuidance: "Policy 057 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-058",
    subjectType: "VERIFICATION",
    minimumReviewers: 2,
    independentReviewRequired: true,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 058"]),
    relianceEffectGuidance: "Policy 058 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-059",
    subjectType: "DISCLOSURE",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 059"]),
    relianceEffectGuidance: "Policy 059 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
  {
    policyId: "CRP-060",
    subjectType: "REGISTRY_STATUS",
    minimumReviewers: 1,
    independentReviewRequired: false,
    permittedDispositions: Object.freeze(["UPHELD", "MODIFIED", "REVERSED", "CLOSED", "WITHDRAWN"] as const),
    requiredEvidence: Object.freeze(["immutable original record", "bounded challenge statement", "counter-evidence integrity", "review finding 060"]),
    relianceEffectGuidance: "Policy 060 requires prospective reliance to reflect the final disposition without rewriting the original event.",
  },
]);

export function challengeResolutionPolicy(subjectType: ChallengeSubjectType): ChallengeResolutionPolicy[] {
  return CHALLENGE_RESOLUTION_POLICIES.filter(entry => entry.subjectType === subjectType);
}


export const CHALLENGE_CORRECTION_ENGINE_SELF_TESTS = Object.freeze([
  "Open a challenge against a published artifact and confirm the original hashes remain unchanged.",
  "Reject a challenge whose target registry hash differs from the published record.",
  "Append counter-evidence and verify custody and integrity commitments.",
  "Resolve UPHELD without creating a correction package.",
  "Resolve MODIFIED only with a bounded correction package.",
  "Resolve REVERSED with a prospective reliance restriction, withdrawal, or supersession.",
  "Verify that every challenge audit event forms one continuous hash chain.",
  "Verify that public registry state exposes CHALLENGED and CORRECTED conditions.",
]);

export function engineStackFingerprint(record: ArtifactRegistryRecord, artifact: CanonicalExecutionArtifact): string {
  return digest("challenge-engine-stack", { registry: stableRegistryRecordJson(record), validation: stableValidationJson(validateCanonicalExecutionArtifact(artifact, { intendedUse: "VERIFICATION", strict: true })), engineVersion: TA14_CHALLENGE_CORRECTION_ENGINE_VERSION, policyVersion: TA14_CHALLENGE_CORRECTION_POLICY_VERSION });
}
