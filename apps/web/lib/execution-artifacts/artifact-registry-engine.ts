/**
 * TA-14 Execution Artifact Registry Engine
 *
 * Institutional purpose:
 *   Accept only artifacts approved by the Governance Registration Gate,
 *   assign permanent registry identities, preserve immutable publication
 *   records, maintain append-only status and amendment history, and expose
 *   bounded public, verification, challenge, correction, and portfolio views.
 *
 * Governing rule:
 *   No registered governance. No registered artifact.
 *
 * This module is deterministic and dependency-free. It does not implement
 * persistence. Callers must persist returned records atomically and preserve
 * the append-only audit and version chains exactly as produced.
 */

import type {
  ArtifactClassification,
  CanonicalExecutionArtifact,
  Determination,
  DisclosureState,
  ValidationSummary,
} from "./canonical-record-validator";
import {
  stableValidationJson,
  validateCanonicalExecutionArtifact,
} from "./canonical-record-validator";
import type {
  ArtifactEligibilityDecision,
  GovernanceRegistration,
  RegistryEligibilityAuditEvent,
} from "./governance-registration-gate";
import {
  TA14_REGISTRY_RULE,
  assertArtifactRegistrationEligible,
  stableEligibilityJson,
} from "./governance-registration-gate";

export const TA14_ARTIFACT_REGISTRY_ENGINE_VERSION = "1.0.0" as const;
export const TA14_ARTIFACT_REGISTRY_POLICY_VERSION = "1.0" as const;
export const TA14_ARTIFACT_REGISTRY_RULE = TA14_REGISTRY_RULE;

export type RegistryPublicationState =
  | "DRAFT"
  | "INTERNAL_REVIEW"
  | "READY"
  | "PUBLISHED"
  | "CHALLENGED"
  | "CORRECTED"
  | "SUPERSEDED"
  | "WITHDRAWN";

export type RegistryRelianceStatus =
  | "NO_PUBLIC_RELIANCE"
  | "LIMITED_RELIANCE"
  | "PUBLIC_RELIANCE"
  | "RELIANCE_SUSPENDED"
  | "PROSPECTIVE_RELIANCE_ENDED";

export type RegistryDecisionDisposition = "REGISTERED" | "HOLD" | "ESCALATE" | "REJECTED";
export type RegistryControlResult = "PASS" | "HOLD" | "FAIL" | "ESCALATE" | "NOT_APPLICABLE";
export type RegistryIssueDisposition = "HOLD" | "DENY" | "ESCALATE";
export type RegistryChangeKind = "ORIGINAL" | "AMENDMENT" | "CORRECTION" | "SUPERSESSION" | "WITHDRAWAL";
export type RegistryReviewLane = "STANDARD" | "INDEPENDENT" | "PRODUCTION" | "HIGH_CONSEQUENCE";

export interface RegistrySubmissionAttestation {
  code: string;
  accepted: boolean;
  acceptedBy: string;
  acceptedAt: string;
  statement: string;
}

export interface RegistryPublicationComponent {
  componentId: string;
  label: string;
  mediaType: string;
  hash: string;
  sizeBytes?: number;
  disclosure: DisclosureState;
  required: boolean;
  stableUrl?: string;
}

export interface RegistryPublicationManifest {
  manifestId: string;
  manifestVersion: string;
  generatedAt: string;
  generatedBy: string;
  canonicalHash: string;
  packageHash: string;
  pdfHash?: string;
  manifestHash: string;
  components: RegistryPublicationComponent[];
}

export interface RegistryCertificate {
  certificateId: string;
  registryId: string;
  artifactId: string;
  governanceRegistrationId: string;
  organizationName: string;
  determination: Determination;
  classification: ArtifactClassification;
  issuedAt: string;
  issuedBy: string;
  registryPolicyVersion: string;
  registryEngineVersion: string;
  canonicalHash: string;
  registryRecordHash: string;
  certificateHash: string;
  publicUrl: string;
  verifierUrl: string;
  challengeUrl: string;
  claimsBoundary: string;
  relianceStatus: RegistryRelianceStatus;
}

export interface RegistryPublicSummary {
  registryId: string;
  artifactId: string;
  title: string;
  organizationName: string;
  governanceRegistrationId: string;
  architectureId: string;
  architectureVersion: string;
  determination: Determination;
  classification: ArtifactClassification;
  sector: string;
  jurisdiction: string;
  routeId: string;
  routeVersion: string;
  publicationState: RegistryPublicationState;
  relianceStatus: RegistryRelianceStatus;
  verificationLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  publishedAt?: string;
  publicUrl: string;
  verifierUrl: string;
  challengeUrl: string;
  canonicalHash: string;
  packageHash: string;
  receiptId?: string;
  earliestControllingCondition?: string;
  executionEffect: string;
  outcomeSummary: string;
  claimsBoundary: string;
  openChallengeCount: number;
  correctionCount: number;
  supersededBy?: string;
  withdrawnAt?: string;
}

export interface RegistryVersionEntry {
  versionId: string;
  sequence: number;
  changeKind: RegistryChangeKind;
  createdAt: string;
  createdBy: string;
  parentVersionId?: string;
  artifactCanonicalHash: string;
  registryRecordHash: string;
  amendmentHash?: string;
  scope: string;
  reason: string;
  prospectiveRelianceEffect: string;
}

export interface RegistryChallengeReference {
  challengeId: string;
  openedAt: string;
  openedBy: string;
  status: "PENDING" | "UNDER_REVIEW" | "UPHELD" | "MODIFIED" | "REVERSED" | "CLOSED" | "WITHDRAWN";
  subject: string;
  publicSummary: string;
  challengeHash: string;
  resolutionHash?: string;
  closedAt?: string;
}

export interface RegistryCorrectionReference {
  correctionId: string;
  createdAt: string;
  createdBy: string;
  scope: string;
  reason: string;
  amendmentHash: string;
  parentRegistryRecordHash: string;
  resultingRegistryRecordHash: string;
}

export interface RegistryStatusEvent {
  eventId: string;
  occurredAt: string;
  actorId: string;
  fromState: RegistryPublicationState | null;
  toState: RegistryPublicationState;
  reason: string;
  authorityReference: string;
  previousHash: string;
  eventHash: string;
}

export interface RegistryAuditEvent {
  eventId: string;
  occurredAt: string;
  actorId: string;
  eventType:
    | "REGISTRY_EVALUATION_STARTED"
    | "ELIGIBILITY_DECISION_ACCEPTED"
    | "DUPLICATE_INDEX_CHECKED"
    | "REGISTRY_ID_ASSIGNED"
    | "MANIFEST_VALIDATED"
    | "CERTIFICATE_ISSUED"
    | "PORTFOLIO_ENTRY_CREATED"
    | "REGISTRY_RECORD_COMMITTED"
    | "STATUS_TRANSITION_COMMITTED"
    | "CHALLENGE_APPENDED"
    | "CORRECTION_APPENDED"
    | "SUPERSESSION_APPENDED"
    | "WITHDRAWAL_APPENDED";
  subjectId: string;
  detail: string;
  previousHash: string;
  eventHash: string;
}

export interface ArtifactRegistryRecord {
  registryId: string;
  artifactId: string;
  seriesId: string;
  governanceRegistrationId: string;
  organizationId: string;
  organizationName: string;
  architectureId: string;
  architectureVersion: string;
  title: string;
  classification: ArtifactClassification;
  determination: Determination;
  sector: string;
  jurisdiction: string;
  routeId: string;
  routeVersion: string;
  publicationState: RegistryPublicationState;
  relianceStatus: RegistryRelianceStatus;
  disclosure: DisclosureState;
  reviewLane: RegistryReviewLane;
  verificationLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  submittedAt: string;
  submittedBy: string;
  registeredAt: string;
  registeredBy: string;
  publishedAt?: string;
  publicUrl: string;
  verifierUrl: string;
  challengeUrl: string;
  packageUrl?: string;
  receiptId?: string;
  canonicalHash: string;
  packageHash: string;
  pdfHash?: string;
  manifestHash: string;
  registryRecordHash: string;
  claimsBoundary: string;
  publicSummary: RegistryPublicSummary;
  publicationManifest: RegistryPublicationManifest;
  registryCertificate: RegistryCertificate;
  sourceEligibilityEvaluationId: string;
  sourceEligibilityAudit: RegistryEligibilityAuditEvent[];
  canonicalValidation: ValidationSummary;
  versions: RegistryVersionEntry[];
  statusHistory: RegistryStatusEvent[];
  challenges: RegistryChallengeReference[];
  corrections: RegistryCorrectionReference[];
  supersedes?: string;
  supersededBy?: string;
  withdrawalReason?: string;
  withdrawnAt?: string;
  registryPolicyVersion: string;
  registryEngineVersion: string;
  auditEvents: RegistryAuditEvent[];
}

export interface RegistryDuplicateIndex {
  registryIds: ReadonlySet<string>;
  artifactIds: ReadonlySet<string>;
  canonicalHashes: ReadonlySet<string>;
}

export interface RegisterArtifactRequest {
  artifact: CanonicalExecutionArtifact;
  governance: GovernanceRegistration;
  eligibilityDecision: ArtifactEligibilityDecision;
  sector: string;
  jurisdiction: string;
  submittedAt: string;
  submittedBy: string;
  registeredAt?: string;
  registeredBy: string;
  initialState?: "DRAFT" | "INTERNAL_REVIEW" | "READY";
  disclosure: DisclosureState;
  reviewLane?: RegistryReviewLane;
  requestedVerificationLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  publicBaseUrl: string;
  packageHash: string;
  pdfHash?: string;
  manifestHash: string;
  receiptId?: string;
  claimsBoundary: string;
  executionEffect: string;
  outcomeSummary: string;
  earliestControllingCondition?: string;
  manifestComponents: RegistryPublicationComponent[];
  attestations: RegistrySubmissionAttestation[];
  registryTermsVersion: string;
  duplicateIndex?: RegistryDuplicateIndex;
}

export interface RegistryReasonDefinition {
  code: RegistryReasonCode;
  message: string;
  disposition: RegistryIssueDisposition;
  publicRelianceBlocked: boolean;
  repairHint: string;
}

export interface RegistryIssue {
  code: RegistryReasonCode;
  path: string;
  message: string;
  disposition: RegistryIssueDisposition;
  publicRelianceBlocked: boolean;
  repairHint: string;
  details?: Record<string, unknown>;
}

export interface RegistryControlDefinition {
  controlId: string;
  title: string;
  requirement: string;
}

export interface RegistryControlEvaluation {
  controlId: string;
  result: RegistryControlResult;
  evaluatedAt: string;
  detail: string;
  relatedReasonCodes: RegistryReasonCode[];
}

export interface RegistryAdmissionDecision {
  admitted: boolean;
  disposition: RegistryDecisionDisposition;
  evaluationId: string;
  evaluatedAt: string;
  artifactId: string;
  governanceRegistrationId: string;
  proposedRegistryId?: string;
  issues: RegistryIssue[];
  controls: RegistryControlEvaluation[];
  requiredRepairs: string[];
  permittedNextAction: "COMMIT_REGISTRATION" | "REPAIR_AND_RESUBMIT" | "ESCALATE_FOR_REVIEW" | "REJECT_SUBMISSION";
  canonicalValidation: ValidationSummary;
}

export interface RegistryCommitResult {
  committed: boolean;
  decision: RegistryAdmissionDecision;
  record?: ArtifactRegistryRecord;
}

export interface RegistryTransitionRequest {
  record: ArtifactRegistryRecord;
  toState: RegistryPublicationState;
  actorId: string;
  occurredAt: string;
  reason: string;
  authorityReference: string;
  publishedAt?: string;
}

export interface RegistryTransitionResult {
  allowed: boolean;
  issues: RegistryIssue[];
  record?: ArtifactRegistryRecord;
}

export interface GovernancePortfolioEntry {
  governanceRegistrationId: string;
  organizationId: string;
  organizationName: string;
  registryId: string;
  artifactId: string;
  title: string;
  determination: Determination;
  classification: ArtifactClassification;
  sector: string;
  jurisdiction: string;
  routeId: string;
  routeVersion: string;
  publicationState: RegistryPublicationState;
  relianceStatus: RegistryRelianceStatus;
  verificationLevel: number;
  registeredAt: string;
  publishedAt?: string;
  canonicalHash: string;
  publicUrl: string;
  verifierUrl: string;
  challengeUrl: string;
  openChallengeCount: number;
  correctionCount: number;
}

export interface GovernancePortfolioIndex {
  governanceRegistrationId: string;
  organizationId: string;
  organizationName: string;
  generatedAt: string;
  artifactCount: number;
  publishedCount: number;
  challengedCount: number;
  correctedCount: number;
  withdrawnCount: number;
  byDetermination: Record<Determination, number>;
  byClassification: Record<ArtifactClassification, number>;
  bySector: Record<string, number>;
  entries: GovernancePortfolioEntry[];
  portfolioHash: string;
}
export type RegistryReasonCode =
  | "ELIGIBILITY_DECISION_MISSING"
  | "ELIGIBILITY_DECISION_NOT_APPROVED"
  | "GOVERNANCE_REGISTRATION_ID_MISSING"
  | "GOVERNANCE_REGISTRATION_MISMATCH"
  | "ARTIFACT_ID_MISSING"
  | "ARTIFACT_ID_MISMATCH"
  | "CANONICAL_HASH_MISSING"
  | "CANONICAL_HASH_MISMATCH"
  | "DUPLICATE_ARTIFACT_ID"
  | "DUPLICATE_CANONICAL_HASH"
  | "REGISTRY_ID_COLLISION"
  | "PUBLICATION_STATE_INVALID"
  | "PUBLICATION_READY_REQUIRED"
  | "GOVERNANCE_NOT_ACTIVE"
  | "GOVERNANCE_PROFILE_MISSING"
  | "OWNER_MISMATCH"
  | "STEWARD_MISSING"
  | "SUBMITTER_MISSING"
  | "SUBMISSION_TIMESTAMP_INVALID"
  | "REGISTRY_TERMS_NOT_ACCEPTED"
  | "CLASSIFICATION_MISMATCH"
  | "DETERMINATION_MISMATCH"
  | "ROUTE_ID_MISMATCH"
  | "ROUTE_VERSION_MISMATCH"
  | "RECEIPT_ID_MISSING"
  | "PACKAGE_HASH_MISSING"
  | "PDF_HASH_MISSING"
  | "MANIFEST_HASH_MISSING"
  | "STABLE_URL_MISSING"
  | "VERIFIER_URL_MISSING"
  | "CHALLENGE_URL_MISSING"
  | "VERSION_SEQUENCE_INVALID"
  | "STATUS_TRANSITION_INVALID"
  | "ORIGINAL_RECORD_MUTATION_ATTEMPT"
  | "AUDIT_CHAIN_BROKEN"
  | "AMENDMENT_PARENT_MISSING"
  | "SUPERSESSION_TARGET_MISSING"
  | "WITHDRAWAL_REASON_MISSING"
  | "CHALLENGE_ID_MISSING"
  | "CHALLENGE_STATE_INVALID"
  | "CORRECTION_HASH_MISSING"
  | "CORRECTION_SCOPE_MISSING"
  | "CERTIFICATE_ID_MISSING"
  | "CERTIFICATE_HASH_MISSING"
  | "PUBLIC_SUMMARY_MISSING"
  | "CLAIMS_BOUNDARY_MISSING"
  | "DISCLOSURE_STATE_INVALID"
  | "VERIFICATION_LEVEL_INVALID"
  | "VERIFICATION_LEVEL_UNSUPPORTED"
  | "INDEPENDENT_REVIEW_REQUIRED"
  | "PRODUCTION_REVIEW_REQUIRED"
  | "DEMONSTRATION_LABEL_MISSING"
  | "PORTFOLIO_LINK_MISSING"
  | "REGISTRY_RECORD_INCOMPLETE"
  | "REGISTRY_RECORD_HASH_MISSING"
  | "REGISTRY_RECORD_HASH_MISMATCH"
  | "PUBLICATION_MANIFEST_INCOMPLETE"
  | "COMPONENT_HASH_DUPLICATE"
  | "COMPONENT_HASH_MISSING"
  | "SOURCE_ELIGIBILITY_AUDIT_MISSING"
  | "REGISTRY_STEWARD_AUTHORITY_MISSING"
  | "PUBLISHER_AUTHORITY_MISSING"
  | "TIME_ORDER_INVALID"
  | "EXTERNAL_REFERENCE_INVALID"
  | "REGISTRY_POLICY_VERSION_MISSING"
  | "REGISTRY_ENGINE_VERSION_MISSING"
  | "RELIANCE_STATUS_UNDECLARED"
  | "WITHDRAWN_RECORD_PUBLIC_RELIANCE"
  | "SUPERSEDED_RECORD_PUBLIC_RELIANCE"
  | "CHALLENGED_STATUS_NOT_VISIBLE"
  | "CORRECTED_STATUS_NOT_VISIBLE"
  | "REGISTRATION_COMMIT_FAILED";

export const REGISTRY_REASON_DICTIONARY: Readonly<Record<RegistryReasonCode, RegistryReasonDefinition>> = Object.freeze({
  ELIGIBILITY_DECISION_MISSING: { code: "ELIGIBILITY_DECISION_MISSING", message: 'Eligibility approval is required before registry admission.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Run the Governance Registration Gate and preserve the committed eligibility decision.' },
  ELIGIBILITY_DECISION_NOT_APPROVED: { code: "ELIGIBILITY_DECISION_NOT_APPROVED", message: 'The eligibility decision does not authorize artifact registration.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Repair or resolve eligibility findings before registry admission.' },
  GOVERNANCE_REGISTRATION_ID_MISSING: { code: "GOVERNANCE_REGISTRATION_ID_MISSING", message: 'A registered governance identifier is required.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Complete governance registration before registering an artifact.' },
  GOVERNANCE_REGISTRATION_MISMATCH: { code: "GOVERNANCE_REGISTRATION_MISMATCH", message: 'The governance registration does not match the eligibility decision.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Use the governance registration evaluated by the eligibility gate.' },
  ARTIFACT_ID_MISSING: { code: "ARTIFACT_ID_MISSING", message: 'The artifact identifier is missing.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Assign a stable artifact identifier.' },
  ARTIFACT_ID_MISMATCH: { code: "ARTIFACT_ID_MISMATCH", message: 'The artifact identifier does not match the eligibility decision.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Register only the artifact evaluated by the eligibility gate.' },
  CANONICAL_HASH_MISSING: { code: "CANONICAL_HASH_MISSING", message: 'The canonical artifact hash is missing.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Generate and preserve the canonical record hash.' },
  CANONICAL_HASH_MISMATCH: { code: "CANONICAL_HASH_MISMATCH", message: 'The canonical artifact hash differs from the eligible snapshot.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Re-run eligibility against the exact frozen record.' },
  DUPLICATE_ARTIFACT_ID: { code: "DUPLICATE_ARTIFACT_ID", message: 'The artifact identifier is already registered.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Use the existing record or create an attributable new version.' },
  DUPLICATE_CANONICAL_HASH: { code: "DUPLICATE_CANONICAL_HASH", message: 'The canonical record hash is already registered.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Link to the existing registry record rather than duplicating it.' },
  REGISTRY_ID_COLLISION: { code: "REGISTRY_ID_COLLISION", message: 'The generated registry identifier collides with an existing record.', disposition: "ESCALATE", publicRelianceBlocked: false, repairHint: 'Resolve the collision through registry stewardship.' },
  PUBLICATION_STATE_INVALID: { code: "PUBLICATION_STATE_INVALID", message: 'The requested publication state is invalid for initial admission.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Begin in DRAFT, INTERNAL_REVIEW, or READY according to policy.' },
  PUBLICATION_READY_REQUIRED: { code: "PUBLICATION_READY_REQUIRED", message: 'Public publication requires a publication-ready canonical record.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Resolve all publication-blocking validation findings.' },
  GOVERNANCE_NOT_ACTIVE: { code: "GOVERNANCE_NOT_ACTIVE", message: 'The sponsoring governance is not active.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Restore an eligible governance registration before admission.' },
  GOVERNANCE_PROFILE_MISSING: { code: "GOVERNANCE_PROFILE_MISSING", message: 'The registered governance profile is unavailable.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Resolve the registered governance profile.' },
  OWNER_MISMATCH: { code: "OWNER_MISMATCH", message: 'Artifact ownership does not match the registered governance.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Correct ownership attribution or submit under the proper governance.' },
  STEWARD_MISSING: { code: "STEWARD_MISSING", message: 'A registry steward is required.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Assign an accountable registry steward.' },
  SUBMITTER_MISSING: { code: "SUBMITTER_MISSING", message: 'A submitter identity is required.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Preserve the authorized submitter identity.' },
  SUBMISSION_TIMESTAMP_INVALID: { code: "SUBMISSION_TIMESTAMP_INVALID", message: 'The submission timestamp is missing or invalid.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Provide an ISO-8601 submission timestamp.' },
  REGISTRY_TERMS_NOT_ACCEPTED: { code: "REGISTRY_TERMS_NOT_ACCEPTED", message: 'Current registry terms were not accepted.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Accept the current registry terms version.' },
  CLASSIFICATION_MISMATCH: { code: "CLASSIFICATION_MISMATCH", message: 'Registry classification differs from the artifact classification.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Preserve classification parity.' },
  DETERMINATION_MISMATCH: { code: "DETERMINATION_MISMATCH", message: 'Registry determination differs from the committed determination.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Preserve determination parity.' },
  ROUTE_ID_MISMATCH: { code: "ROUTE_ID_MISMATCH", message: 'Registry route differs from the frozen route.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Use the route ID from the canonical record.' },
  ROUTE_VERSION_MISMATCH: { code: "ROUTE_VERSION_MISMATCH", message: 'Registry route version differs from the frozen route.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Use the route version from the canonical record.' },
  RECEIPT_ID_MISSING: { code: "RECEIPT_ID_MISSING", message: 'An execution-control artifact requires a technical receipt identifier.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Preserve a stable receipt identifier.' },
  PACKAGE_HASH_MISSING: { code: "PACKAGE_HASH_MISSING", message: 'The package root hash is missing.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Generate the complete package-root commitment.' },
  PDF_HASH_MISSING: { code: "PDF_HASH_MISSING", message: 'The public PDF hash is missing for a published record.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Generate and commit the PDF digest before publication.' },
  MANIFEST_HASH_MISSING: { code: "MANIFEST_HASH_MISSING", message: 'The publication manifest hash is missing.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Generate and commit the manifest digest.' },
  STABLE_URL_MISSING: { code: "STABLE_URL_MISSING", message: 'A published record requires a stable registry URL.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Assign the permanent public registry URL.' },
  VERIFIER_URL_MISSING: { code: "VERIFIER_URL_MISSING", message: 'A published record requires a verification pathway.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Assign the verification URL.' },
  CHALLENGE_URL_MISSING: { code: "CHALLENGE_URL_MISSING", message: 'A published record requires a challenge pathway.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Assign the challenge URL.' },
  VERSION_SEQUENCE_INVALID: { code: "VERSION_SEQUENCE_INVALID", message: 'Registry version sequence is not monotonic.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Append versions in strict sequence.' },
  STATUS_TRANSITION_INVALID: { code: "STATUS_TRANSITION_INVALID", message: 'The requested registry status transition is not permitted.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Use an allowed append-only status transition.' },
  ORIGINAL_RECORD_MUTATION_ATTEMPT: { code: "ORIGINAL_RECORD_MUTATION_ATTEMPT", message: 'Published immutable fields were changed.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Append an amendment instead of rewriting the original record.' },
  AUDIT_CHAIN_BROKEN: { code: "AUDIT_CHAIN_BROKEN", message: 'The registry audit-event hash chain is broken.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Restore the complete append-only audit chain.' },
  AMENDMENT_PARENT_MISSING: { code: "AMENDMENT_PARENT_MISSING", message: 'An amendment does not identify its parent record or version.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Link the amendment to the preserved parent.' },
  SUPERSESSION_TARGET_MISSING: { code: "SUPERSESSION_TARGET_MISSING", message: 'A supersession event lacks the replacement registry record.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Identify the valid replacement record.' },
  WITHDRAWAL_REASON_MISSING: { code: "WITHDRAWAL_REASON_MISSING", message: 'Withdrawal requires an attributable reason.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Preserve a bounded withdrawal reason.' },
  CHALLENGE_ID_MISSING: { code: "CHALLENGE_ID_MISSING", message: 'A challenge event requires a stable challenge identifier.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Assign and preserve the challenge ID.' },
  CHALLENGE_STATE_INVALID: { code: "CHALLENGE_STATE_INVALID", message: 'Challenge state is inconsistent with registry state.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Align the challenge and registry states.' },
  CORRECTION_HASH_MISSING: { code: "CORRECTION_HASH_MISSING", message: 'A correction requires an amendment hash.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Generate and preserve the correction hash.' },
  CORRECTION_SCOPE_MISSING: { code: "CORRECTION_SCOPE_MISSING", message: 'A correction requires a bounded scope statement.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Describe exactly what changed and what remains unchanged.' },
  CERTIFICATE_ID_MISSING: { code: "CERTIFICATE_ID_MISSING", message: 'A published registry record requires a certificate identifier.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Issue a stable registry certificate ID.' },
  CERTIFICATE_HASH_MISSING: { code: "CERTIFICATE_HASH_MISSING", message: 'The registry certificate hash is missing.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Generate the certificate integrity commitment.' },
  PUBLIC_SUMMARY_MISSING: { code: "PUBLIC_SUMMARY_MISSING", message: 'A public registry summary is required.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Generate the bounded public summary.' },
  CLAIMS_BOUNDARY_MISSING: { code: "CLAIMS_BOUNDARY_MISSING", message: 'The registry record lacks a claims boundary.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'State what the artifact proves and does not prove.' },
  DISCLOSURE_STATE_INVALID: { code: "DISCLOSURE_STATE_INVALID", message: 'The publication disclosure state is invalid.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Apply an allowed disclosure state.' },
  VERIFICATION_LEVEL_INVALID: { code: "VERIFICATION_LEVEL_INVALID", message: 'The requested verification level is outside 0 through 7.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Use a supported verification level.' },
  VERIFICATION_LEVEL_UNSUPPORTED: { code: "VERIFICATION_LEVEL_UNSUPPORTED", message: 'The claimed verification level exceeds preserved evidence.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Reduce the claim or add the required verification evidence.' },
  INDEPENDENT_REVIEW_REQUIRED: { code: "INDEPENDENT_REVIEW_REQUIRED", message: 'The registry policy requires independent review.', disposition: "ESCALATE", publicRelianceBlocked: false, repairHint: 'Route to the independent review lane.' },
  PRODUCTION_REVIEW_REQUIRED: { code: "PRODUCTION_REVIEW_REQUIRED", message: 'Production artifacts require the production review lane.', disposition: "ESCALATE", publicRelianceBlocked: false, repairHint: 'Complete production-specific institutional review.' },
  DEMONSTRATION_LABEL_MISSING: { code: "DEMONSTRATION_LABEL_MISSING", message: 'A demonstration artifact must remain visibly labeled.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Add the demonstration classification to public metadata.' },
  PORTFOLIO_LINK_MISSING: { code: "PORTFOLIO_LINK_MISSING", message: 'The governance portfolio entry was not created.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Create the governance-to-artifact portfolio link.' },
  REGISTRY_RECORD_INCOMPLETE: { code: "REGISTRY_RECORD_INCOMPLETE", message: 'The registry record is incomplete.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Complete all mandatory registry domains.' },
  REGISTRY_RECORD_HASH_MISSING: { code: "REGISTRY_RECORD_HASH_MISSING", message: 'The registry record hash is missing.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Generate the deterministic registry-record commitment.' },
  REGISTRY_RECORD_HASH_MISMATCH: { code: "REGISTRY_RECORD_HASH_MISMATCH", message: 'The registry record hash does not match the stored record.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Recompute and compare the immutable registry payload.' },
  PUBLICATION_MANIFEST_INCOMPLETE: { code: "PUBLICATION_MANIFEST_INCOMPLETE", message: 'The publication manifest is incomplete.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Include all required components and hashes.' },
  COMPONENT_HASH_DUPLICATE: { code: "COMPONENT_HASH_DUPLICATE", message: 'Two publication components share an unexpected identifier.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Assign unique component identifiers.' },
  COMPONENT_HASH_MISSING: { code: "COMPONENT_HASH_MISSING", message: 'A required publication component lacks a hash.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Hash every required component.' },
  SOURCE_ELIGIBILITY_AUDIT_MISSING: { code: "SOURCE_ELIGIBILITY_AUDIT_MISSING", message: 'The source eligibility audit trail is missing.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Preserve the Governance Registration Gate audit events.' },
  REGISTRY_STEWARD_AUTHORITY_MISSING: { code: "REGISTRY_STEWARD_AUTHORITY_MISSING", message: 'Registry steward authority is not preserved.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Resolve steward identity and authority before commit.' },
  PUBLISHER_AUTHORITY_MISSING: { code: "PUBLISHER_AUTHORITY_MISSING", message: 'Publisher authority is not preserved.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Resolve publisher identity and authority before publication.' },
  TIME_ORDER_INVALID: { code: "TIME_ORDER_INVALID", message: 'Registry timestamps are not chronologically coherent.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Correct the event chronology without rewriting preserved history.' },
  EXTERNAL_REFERENCE_INVALID: { code: "EXTERNAL_REFERENCE_INVALID", message: 'A registry external reference is malformed.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Provide a stable absolute or platform-relative reference.' },
  REGISTRY_POLICY_VERSION_MISSING: { code: "REGISTRY_POLICY_VERSION_MISSING", message: 'The applied registry policy version is missing.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Preserve the exact registry policy version.' },
  REGISTRY_ENGINE_VERSION_MISSING: { code: "REGISTRY_ENGINE_VERSION_MISSING", message: 'The registry engine version is missing.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Preserve the exact engine version.' },
  RELIANCE_STATUS_UNDECLARED: { code: "RELIANCE_STATUS_UNDECLARED", message: 'The prospective reliance status is undeclared.', disposition: "HOLD", publicRelianceBlocked: false, repairHint: 'Declare whether the record may be relied upon.' },
  WITHDRAWN_RECORD_PUBLIC_RELIANCE: { code: "WITHDRAWN_RECORD_PUBLIC_RELIANCE", message: 'A withdrawn record is still presented for prospective reliance.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Disable prospective reliance while preserving history.' },
  SUPERSEDED_RECORD_PUBLIC_RELIANCE: { code: "SUPERSEDED_RECORD_PUBLIC_RELIANCE", message: 'A superseded record is still presented as current.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Point prospective reliance to the successor record.' },
  CHALLENGED_STATUS_NOT_VISIBLE: { code: "CHALLENGED_STATUS_NOT_VISIBLE", message: 'An open material challenge is not visible in public metadata.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Expose the challenged state and challenge pathway.' },
  CORRECTED_STATUS_NOT_VISIBLE: { code: "CORRECTED_STATUS_NOT_VISIBLE", message: 'A correction is not visible in public metadata.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Expose the correction and amendment chain.' },
  REGISTRATION_COMMIT_FAILED: { code: "REGISTRATION_COMMIT_FAILED", message: 'The registry commit could not be completed deterministically.', disposition: "DENY", publicRelianceBlocked: true, repairHint: 'Retry only after preserving the failed commit event.' },
});

export const REGISTRY_CONTROLS: readonly RegistryControlDefinition[] = Object.freeze([
  { controlId: "REG-001", title: 'Governance sponsorship', requirement: 'Confirm the artifact is sponsored by an active registered governance.' },
  { controlId: "REG-002", title: 'Eligibility approval', requirement: 'Confirm the Governance Registration Gate committed REGISTER_ARTIFACT.' },
  { controlId: "REG-003", title: 'Artifact identity parity', requirement: 'Match artifact ID to the eligibility snapshot.' },
  { controlId: "REG-004", title: 'Canonical hash parity', requirement: 'Match the frozen canonical hash to the eligibility snapshot.' },
  { controlId: "REG-005", title: 'Governance registration parity', requirement: 'Match the governance registration identifier.' },
  { controlId: "REG-006", title: 'Architecture parity', requirement: 'Preserve registered architecture identity and version.' },
  { controlId: "REG-007", title: 'Route parity', requirement: 'Preserve route ID and version.' },
  { controlId: "REG-008", title: 'Determination parity', requirement: 'Preserve ALLOW, HOLD, DENY, or ESCALATE exactly.' },
  { controlId: "REG-009", title: 'Classification parity', requirement: 'Preserve demonstration or production classification.' },
  { controlId: "REG-010", title: 'Ownership attribution', requirement: 'Bind the record to the registered governance owner.' },
  { controlId: "REG-011", title: 'Steward attribution', requirement: 'Preserve the accountable registry steward.' },
  { controlId: "REG-012", title: 'Submitter authority', requirement: 'Preserve the authorized submitter identity.' },
  { controlId: "REG-013", title: 'Submission time', requirement: 'Preserve a valid submission timestamp.' },
  { controlId: "REG-014", title: 'Terms acceptance', requirement: 'Preserve the accepted registry terms version.' },
  { controlId: "REG-015", title: 'Policy version', requirement: 'Preserve the applied registry policy version.' },
  { controlId: "REG-016", title: 'Engine version', requirement: 'Preserve the registry engine version.' },
  { controlId: "REG-017", title: 'Duplicate artifact check', requirement: 'Reject duplicate artifact identifiers.' },
  { controlId: "REG-018", title: 'Duplicate hash check', requirement: 'Reject duplicate canonical hashes.' },
  { controlId: "REG-019", title: 'Registry ID assignment', requirement: 'Assign one permanent collision-resistant registry ID.' },
  { controlId: "REG-020", title: 'Initial state control', requirement: 'Limit initial state to DRAFT, INTERNAL_REVIEW, or READY.' },
  { controlId: "REG-021", title: 'Publication readiness', requirement: 'Require publication-ready canonical validation before PUBLISHED.' },
  { controlId: "REG-022", title: 'Stable URL assignment', requirement: 'Assign the permanent registry URL.' },
  { controlId: "REG-023", title: 'Verifier pathway', requirement: 'Assign the verification center URL.' },
  { controlId: "REG-024", title: 'Challenge pathway', requirement: 'Assign the challenge center URL.' },
  { controlId: "REG-025", title: 'PDF commitment', requirement: 'Preserve the PDF hash when a PDF is published.' },
  { controlId: "REG-026", title: 'Manifest commitment', requirement: 'Preserve the publication manifest hash.' },
  { controlId: "REG-027", title: 'Package commitment', requirement: 'Preserve the package-root hash.' },
  { controlId: "REG-028", title: 'Receipt linkage', requirement: 'Link the execution receipt.' },
  { controlId: "REG-029", title: 'Public summary', requirement: 'Create a bounded public registry summary.' },
  { controlId: "REG-030", title: 'Claims boundary', requirement: 'State what the artifact proves and does not prove.' },
  { controlId: "REG-031", title: 'Disclosure state', requirement: 'Apply one declared disclosure state.' },
  { controlId: "REG-032", title: 'Verification level', requirement: 'Constrain verification claims to levels 0 through 7.' },
  { controlId: "REG-033", title: 'Review requirement', requirement: 'Apply independent review policy where required.' },
  { controlId: "REG-034", title: 'Production review', requirement: 'Apply production-specific review requirements.' },
  { controlId: "REG-035", title: 'Demonstration labeling', requirement: 'Keep demonstration records visibly distinguished.' },
  { controlId: "REG-036", title: 'Portfolio link', requirement: 'Create the governance portfolio entry.' },
  { controlId: "REG-037", title: 'Certificate issuance', requirement: 'Issue a stable registry certificate.' },
  { controlId: "REG-038", title: 'Certificate hash', requirement: 'Commit the registry certificate hash.' },
  { controlId: "REG-039", title: 'Audit event start', requirement: 'Preserve registry evaluation start.' },
  { controlId: "REG-040", title: 'Audit eligibility source', requirement: 'Preserve source eligibility audit events.' },
  { controlId: "REG-041", title: 'Audit ID assignment', requirement: 'Preserve registry ID assignment.' },
  { controlId: "REG-042", title: 'Audit commit', requirement: 'Preserve registry commit.' },
  { controlId: "REG-043", title: 'Audit hash chain', requirement: 'Maintain append-only audit hash continuity.' },
  { controlId: "REG-044", title: 'Immutable payload', requirement: 'Freeze publication identity and canonical commitments.' },
  { controlId: "REG-045", title: 'Version sequence', requirement: 'Maintain monotonic version numbering.' },
  { controlId: "REG-046", title: 'Status transition', requirement: 'Enforce allowed status transitions.' },
  { controlId: "REG-047", title: 'Challenge visibility', requirement: 'Expose material challenges.' },
  { controlId: "REG-048", title: 'Correction append', requirement: 'Append corrections without rewriting the original.' },
  { controlId: "REG-049", title: 'Supersession link', requirement: 'Link superseded records to successors.' },
  { controlId: "REG-050", title: 'Withdrawal reason', requirement: 'Preserve attributable withdrawal reasons.' },
  { controlId: "REG-051", title: 'Reliance status', requirement: 'Declare current prospective reliance status.' },
  { controlId: "REG-052", title: 'External references', requirement: 'Validate public, verifier, challenge, and package references.' },
  { controlId: "REG-053", title: 'Component uniqueness', requirement: 'Require unique manifest component IDs.' },
  { controlId: "REG-054", title: 'Component integrity', requirement: 'Require hashes for mandatory components.' },
  { controlId: "REG-055", title: 'Publication manifest completeness', requirement: 'Require the complete publication manifest.' },
  { controlId: "REG-056", title: 'Registry record completeness', requirement: 'Require all mandatory registry domains.' },
  { controlId: "REG-057", title: 'Registry record hash', requirement: 'Commit the deterministic registry record hash.' },
  { controlId: "REG-058", title: 'Record hash parity', requirement: 'Verify the stored registry record hash.' },
  { controlId: "REG-059", title: 'Chronology', requirement: 'Require coherent event timestamps.' },
  { controlId: "REG-060", title: 'Governance portfolio index', requirement: 'Maintain attributable governance portfolio order.' },
  { controlId: "REG-061", title: 'Search metadata', requirement: 'Create normalized searchable metadata.' },
  { controlId: "REG-062", title: 'Public status projection', requirement: 'Generate public status without exposing restricted content.' },
  { controlId: "REG-063", title: 'Verification projection', requirement: 'Generate verifier-facing metadata.' },
  { controlId: "REG-064", title: 'Challenge projection', requirement: 'Generate challenge-facing metadata.' },
  { controlId: "REG-065", title: 'Certificate projection', requirement: 'Generate registry certificate metadata.' },
  { controlId: "REG-066", title: 'Download projection', requirement: 'Generate bounded package-download metadata.' },
  { controlId: "REG-067", title: 'Amendment parent', requirement: 'Require parent links for amendments.' },
  { controlId: "REG-068", title: 'Correction scope', requirement: 'Require bounded correction scope.' },
  { controlId: "REG-069", title: 'Challenge identity', requirement: 'Require stable challenge identity.' },
  { controlId: "REG-070", title: 'Supersession target', requirement: 'Require a valid successor record.' },
  { controlId: "REG-071", title: 'Withdrawn reliance block', requirement: 'Block prospective reliance on withdrawn records.' },
  { controlId: "REG-072", title: 'Superseded reliance block', requirement: 'Block prospective reliance on superseded records.' },
]);


export const REGISTRY_STATUS_TRANSITIONS: Readonly<Record<RegistryPublicationState, readonly RegistryPublicationState[]>> = Object.freeze({
  DRAFT: Object.freeze<RegistryPublicationState[]>(["INTERNAL_REVIEW", "WITHDRAWN"]),
  INTERNAL_REVIEW: Object.freeze<RegistryPublicationState[]>(["DRAFT", "READY", "WITHDRAWN"]),
  READY: Object.freeze<RegistryPublicationState[]>(["INTERNAL_REVIEW", "PUBLISHED", "WITHDRAWN"]),
  PUBLISHED: Object.freeze<RegistryPublicationState[]>(["CHALLENGED", "CORRECTED", "SUPERSEDED", "WITHDRAWN"]),
  CHALLENGED: Object.freeze<RegistryPublicationState[]>(["PUBLISHED", "CORRECTED", "SUPERSEDED", "WITHDRAWN"]),
  CORRECTED: Object.freeze<RegistryPublicationState[]>(["CHALLENGED", "SUPERSEDED", "WITHDRAWN"]),
  SUPERSEDED: Object.freeze<RegistryPublicationState[]>(["CHALLENGED", "WITHDRAWN"]),
  WITHDRAWN: Object.freeze<RegistryPublicationState[]>([]),
});

export const REQUIRED_REGISTRY_ATTESTATIONS = Object.freeze([
  "CANONICAL_RECORD_FROZEN",
  "GOVERNANCE_REGISTRATION_CURRENT",
  "ARTIFACT_OWNERSHIP_AUTHORIZED",
  "DISCLOSURE_POLICY_APPLIED",
  "CLAIMS_BOUNDARY_ACCURATE",
  "EXECUTION_RECEIPT_AUTHENTIC",
  "OUTCOME_EVIDENCE_PRESERVED",
  "CHALLENGE_PATH_ACCEPTED",
  "REGISTRY_TERMS_ACCEPTED",
] as const);

export type RequiredRegistryAttestation = typeof REQUIRED_REGISTRY_ATTESTATIONS[number];

function isIso(value: string | undefined): boolean {
  return Boolean(value && !Number.isNaN(Date.parse(value)));
}

function unique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([key, child]) => `${JSON.stringify(key)}:${stableStringify(child)}`).join(",")}}`;
}

function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function digest(label: string, value: unknown): string {
  const canonical = `${label}:${stableStringify(value)}`;
  const parts = [
    fnv1a(canonical),
    fnv1a(`1:${canonical}`),
    fnv1a(`2:${canonical}`),
    fnv1a(`3:${canonical}`),
    fnv1a(`4:${canonical}`),
    fnv1a(`5:${canonical}`),
    fnv1a(`6:${canonical}`),
    fnv1a(`7:${canonical}`),
  ];
  return parts.join("");
}

function issue(code: RegistryReasonCode, path: string, details?: Record<string, unknown>): RegistryIssue {
  const definition = REGISTRY_REASON_DICTIONARY[code];
  return { ...definition, path, details };
}

function dispositionRank(disposition: RegistryIssueDisposition): number {
  return disposition === "DENY" ? 3 : disposition === "ESCALATE" ? 2 : 1;
}

function highestDecisionDisposition(issues: readonly RegistryIssue[]): RegistryDecisionDisposition {
  if (issues.length === 0) return "REGISTERED";
  const highest = issues.reduce<RegistryIssueDisposition>((current, candidate) =>
    dispositionRank(candidate.disposition) > dispositionRank(current) ? candidate.disposition : current,
  "HOLD");
  return highest === "DENY" ? "REJECTED" : highest === "ESCALATE" ? "ESCALATE" : "HOLD";
}

function baseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

function normalizedRegistrySeed(request: RegisterArtifactRequest): Record<string, unknown> {
  return {
    governanceRegistrationId: request.governance.governanceRegistrationId,
    artifactId: request.artifact.identity.artifactId,
    canonicalHash: request.artifact.integrity.canonicalHash,
    routeId: request.artifact.route.routeId,
    routeVersion: request.artifact.route.version,
    submittedAt: request.submittedAt,
  };
}

export function proposeRegistryId(request: RegisterArtifactRequest): string {
  const year = new Date(request.submittedAt).getUTCFullYear();
  const governanceToken = request.governance.governanceRegistrationId.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase();
  const artifactToken = request.artifact.identity.artifactId.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase();
  const suffix = digest("registry-id", normalizedRegistrySeed(request)).slice(0, 12).toUpperCase();
  return `TA14-REG-${year}-${governanceToken}-${artifactToken}-${suffix}`;
}

function validateAttestations(request: RegisterArtifactRequest, issues: RegistryIssue[]): void {
  for (const required of REQUIRED_REGISTRY_ATTESTATIONS) {
    const attestation = request.attestations.find((candidate) => candidate.code === required);
    if (!attestation?.accepted) {
      issues.push(issue("REGISTRY_TERMS_NOT_ACCEPTED", `attestations.${required}`, { required }));
      continue;
    }
    if (!attestation.acceptedBy || !isIso(attestation.acceptedAt) || !attestation.statement.trim()) {
      issues.push(issue("REGISTRY_TERMS_NOT_ACCEPTED", `attestations.${required}`, { malformed: true }));
    }
  }
}

function validateManifest(request: RegisterArtifactRequest, issues: RegistryIssue[]): void {
  if (!request.packageHash.trim()) issues.push(issue("PACKAGE_HASH_MISSING", "packageHash"));
  if (!request.manifestHash.trim()) issues.push(issue("MANIFEST_HASH_MISSING", "manifestHash"));
  if (request.initialState === "READY" && !request.pdfHash?.trim()) issues.push(issue("PDF_HASH_MISSING", "pdfHash"));
  const ids = request.manifestComponents.map((component) => component.componentId);
  if (new Set(ids).size !== ids.length) issues.push(issue("COMPONENT_HASH_DUPLICATE", "manifestComponents"));
  for (const [index, component] of request.manifestComponents.entries()) {
    if (!component.componentId.trim() || !component.label.trim() || !component.mediaType.trim()) {
      issues.push(issue("PUBLICATION_MANIFEST_INCOMPLETE", `manifestComponents.${index}`));
    }
    if (component.required && !component.hash.trim()) {
      issues.push(issue("COMPONENT_HASH_MISSING", `manifestComponents.${index}.hash`));
    }
  }
  if (request.manifestComponents.length === 0) issues.push(issue("PUBLICATION_MANIFEST_INCOMPLETE", "manifestComponents"));
}

function validateRequest(request: RegisterArtifactRequest): RegistryAdmissionDecision {
  const evaluatedAt = request.registeredAt ?? new Date().toISOString();
  const issues: RegistryIssue[] = [];
  const validation = validateCanonicalExecutionArtifact(request.artifact, {
    now: evaluatedAt,
    intendedUse: request.initialState === "READY" ? "PUBLICATION" : "INTERNAL_REVIEW",
    strict: true,
    requireSignature: false,
    requireOfflineVerification: request.requestedVerificationLevel >= 1,
  });

  if (!request.eligibilityDecision) issues.push(issue("ELIGIBILITY_DECISION_MISSING", "eligibilityDecision"));
  else {
    if (!request.eligibilityDecision.eligible || request.eligibilityDecision.permittedNextAction !== "REGISTER_ARTIFACT") {
      issues.push(issue("ELIGIBILITY_DECISION_NOT_APPROVED", "eligibilityDecision", {
        disposition: request.eligibilityDecision.disposition,
        permittedNextAction: request.eligibilityDecision.permittedNextAction,
      }));
    }
    if (request.eligibilityDecision.governanceRegistrationId !== request.governance.governanceRegistrationId) {
      issues.push(issue("GOVERNANCE_REGISTRATION_MISMATCH", "eligibilityDecision.governanceRegistrationId"));
    }
    if (request.eligibilityDecision.artifactId !== request.artifact.identity.artifactId) {
      issues.push(issue("ARTIFACT_ID_MISMATCH", "eligibilityDecision.artifactId"));
    }
    if (request.eligibilityDecision.snapshot.artifactHash !== request.artifact.integrity.canonicalHash) {
      issues.push(issue("CANONICAL_HASH_MISMATCH", "eligibilityDecision.snapshot.artifactHash"));
    }
    if (request.eligibilityDecision.auditEvents.length === 0) {
      issues.push(issue("SOURCE_ELIGIBILITY_AUDIT_MISSING", "eligibilityDecision.auditEvents"));
    }
  }

  if (!request.governance.governanceRegistrationId.trim()) issues.push(issue("GOVERNANCE_REGISTRATION_ID_MISSING", "governance.governanceRegistrationId"));
  if (!request.artifact.identity.artifactId.trim()) issues.push(issue("ARTIFACT_ID_MISSING", "artifact.identity.artifactId"));
  if (!request.artifact.integrity.canonicalHash.trim()) issues.push(issue("CANONICAL_HASH_MISSING", "artifact.integrity.canonicalHash"));
  if (!request.submittedBy.trim()) issues.push(issue("SUBMITTER_MISSING", "submittedBy"));
  if (!request.registeredBy.trim()) issues.push(issue("REGISTRY_STEWARD_AUTHORITY_MISSING", "registeredBy"));
  if (!isIso(request.submittedAt)) issues.push(issue("SUBMISSION_TIMESTAMP_INVALID", "submittedAt"));
  if (!request.claimsBoundary.trim()) issues.push(issue("CLAIMS_BOUNDARY_MISSING", "claimsBoundary"));
  if (request.requestedVerificationLevel < 0 || request.requestedVerificationLevel > 7) issues.push(issue("VERIFICATION_LEVEL_INVALID", "requestedVerificationLevel"));
  if (!request.registryTermsVersion.trim()) issues.push(issue("REGISTRY_TERMS_NOT_ACCEPTED", "registryTermsVersion"));
  if (!request.receiptId?.trim()) issues.push(issue("RECEIPT_ID_MISSING", "receiptId"));
  if (!validation.valid) issues.push(issue("REGISTRY_RECORD_INCOMPLETE", "artifact", { validation: stableValidationJson(validation) }));
  if (request.initialState === "READY" && !validation.publicationReady) issues.push(issue("PUBLICATION_READY_REQUIRED", "artifact"));

  if (request.duplicateIndex?.artifactIds.has(request.artifact.identity.artifactId)) issues.push(issue("DUPLICATE_ARTIFACT_ID", "artifact.identity.artifactId"));
  if (request.duplicateIndex?.canonicalHashes.has(request.artifact.integrity.canonicalHash)) issues.push(issue("DUPLICATE_CANONICAL_HASH", "artifact.integrity.canonicalHash"));

  const proposedRegistryId = proposeRegistryId(request);
  if (request.duplicateIndex?.registryIds.has(proposedRegistryId)) issues.push(issue("REGISTRY_ID_COLLISION", "registryId", { proposedRegistryId }));

  validateManifest(request, issues);
  validateAttestations(request, issues);

  const disposition = highestDecisionDisposition(issues);
  const controls = evaluateRegistryControls(issues, evaluatedAt);
  const admitted = disposition === "REGISTERED" && validation.valid;
  return {
    admitted,
    disposition,
    evaluationId: `REG-EVAL-${digest("evaluation", { evaluatedAt, proposedRegistryId }).slice(0, 24).toUpperCase()}`,
    evaluatedAt,
    artifactId: request.artifact.identity.artifactId,
    governanceRegistrationId: request.governance.governanceRegistrationId,
    proposedRegistryId,
    issues,
    controls,
    requiredRepairs: unique(issues.map((candidate) => candidate.repairHint)),
    permittedNextAction: admitted
      ? "COMMIT_REGISTRATION"
      : disposition === "ESCALATE"
        ? "ESCALATE_FOR_REVIEW"
        : disposition === "HOLD"
          ? "REPAIR_AND_RESUBMIT"
          : "REJECT_SUBMISSION",
    canonicalValidation: validation,
  };
}

export function evaluateRegistryAdmission(request: RegisterArtifactRequest): RegistryAdmissionDecision {
  return validateRequest(request);
}

export function assertRegistryAdmissionApproved(decision: RegistryAdmissionDecision): void {
  if (!decision.admitted || decision.permittedNextAction !== "COMMIT_REGISTRATION") {
    throw new Error(`Artifact ${decision.artifactId} is not approved for registry commit: ${decision.issues.map((candidate) => candidate.code).join(", ")}`);
  }
}

function evaluateRegistryControls(issues: readonly RegistryIssue[], evaluatedAt: string): RegistryControlEvaluation[] {
  return REGISTRY_CONTROLS.map((control) => {
    const related = issues.filter((candidate) => controlMatchesIssue(control.controlId, candidate.code));
    const result: RegistryControlResult = related.some((candidate) => candidate.disposition === "DENY")
      ? "FAIL"
      : related.some((candidate) => candidate.disposition === "ESCALATE")
        ? "ESCALATE"
        : related.length > 0
          ? "HOLD"
          : "PASS";
    return {
      controlId: control.controlId,
      result,
      evaluatedAt,
      detail: related.length > 0 ? related.map((candidate) => candidate.message).join(" ") : control.requirement,
      relatedReasonCodes: related.map((candidate) => candidate.code),
    };
  });
}

function controlMatchesIssue(controlId: string, code: RegistryReasonCode): boolean {
  const map: Readonly<Record<string, readonly RegistryReasonCode[]>> = {
    "REG-001": ["GOVERNANCE_REGISTRATION_ID_MISSING", "GOVERNANCE_NOT_ACTIVE", "GOVERNANCE_PROFILE_MISSING"],
    "REG-002": ["ELIGIBILITY_DECISION_MISSING", "ELIGIBILITY_DECISION_NOT_APPROVED"],
    "REG-003": ["ARTIFACT_ID_MISSING", "ARTIFACT_ID_MISMATCH"],
    "REG-004": ["CANONICAL_HASH_MISSING", "CANONICAL_HASH_MISMATCH"],
    "REG-005": ["GOVERNANCE_REGISTRATION_MISMATCH"],
    "REG-017": ["DUPLICATE_ARTIFACT_ID"],
    "REG-018": ["DUPLICATE_CANONICAL_HASH"],
    "REG-019": ["REGISTRY_ID_COLLISION"],
    "REG-021": ["PUBLICATION_READY_REQUIRED"],
    "REG-025": ["PDF_HASH_MISSING"],
    "REG-026": ["MANIFEST_HASH_MISSING"],
    "REG-027": ["PACKAGE_HASH_MISSING"],
    "REG-028": ["RECEIPT_ID_MISSING"],
    "REG-030": ["CLAIMS_BOUNDARY_MISSING"],
    "REG-032": ["VERIFICATION_LEVEL_INVALID", "VERIFICATION_LEVEL_UNSUPPORTED"],
    "REG-037": ["CERTIFICATE_ID_MISSING"],
    "REG-038": ["CERTIFICATE_HASH_MISSING"],
    "REG-043": ["AUDIT_CHAIN_BROKEN"],
    "REG-045": ["VERSION_SEQUENCE_INVALID"],
    "REG-046": ["STATUS_TRANSITION_INVALID"],
    "REG-053": ["COMPONENT_HASH_DUPLICATE"],
    "REG-054": ["COMPONENT_HASH_MISSING"],
    "REG-055": ["PUBLICATION_MANIFEST_INCOMPLETE"],
    "REG-056": ["REGISTRY_RECORD_INCOMPLETE"],
    "REG-057": ["REGISTRY_RECORD_HASH_MISSING"],
    "REG-058": ["REGISTRY_RECORD_HASH_MISMATCH"],
    "REG-059": ["TIME_ORDER_INVALID"],
    "REG-067": ["AMENDMENT_PARENT_MISSING"],
    "REG-068": ["CORRECTION_SCOPE_MISSING"],
    "REG-069": ["CHALLENGE_ID_MISSING", "CHALLENGE_STATE_INVALID"],
    "REG-070": ["SUPERSESSION_TARGET_MISSING"],
    "REG-071": ["WITHDRAWN_RECORD_PUBLIC_RELIANCE"],
    "REG-072": ["SUPERSEDED_RECORD_PUBLIC_RELIANCE"],
  };
  return map[controlId]?.includes(code) ?? false;
}

function initialRelianceStatus(state: RegistryPublicationState): RegistryRelianceStatus {
  return state === "PUBLISHED" ? "PUBLIC_RELIANCE" : state === "READY" ? "LIMITED_RELIANCE" : "NO_PUBLIC_RELIANCE";
}

function buildManifest(request: RegisterArtifactRequest, generatedAt: string): RegistryPublicationManifest {
  return {
    manifestId: `MANIFEST-${digest("manifest-id", { artifactId: request.artifact.identity.artifactId, generatedAt }).slice(0, 24).toUpperCase()}`,
    manifestVersion: "1.0",
    generatedAt,
    generatedBy: request.registeredBy,
    canonicalHash: request.artifact.integrity.canonicalHash,
    packageHash: request.packageHash,
    pdfHash: request.pdfHash,
    manifestHash: request.manifestHash,
    components: request.manifestComponents.map((component) => ({ ...component })),
  };
}

function buildStatusEvent(
  registryId: string,
  actorId: string,
  occurredAt: string,
  fromState: RegistryPublicationState | null,
  toState: RegistryPublicationState,
  reason: string,
  authorityReference: string,
  previousHash: string,
): RegistryStatusEvent {
  const payload = { registryId, actorId, occurredAt, fromState, toState, reason, authorityReference, previousHash };
  return {
    eventId: `STATUS-${digest("status-event", payload).slice(0, 24).toUpperCase()}`,
    occurredAt,
    actorId,
    fromState,
    toState,
    reason,
    authorityReference,
    previousHash,
    eventHash: digest("status-event-hash", payload),
  };
}

function appendAuditEvent(
  events: readonly RegistryAuditEvent[],
  registryId: string,
  actorId: string,
  occurredAt: string,
  eventType: RegistryAuditEvent["eventType"],
  detail: string,
): RegistryAuditEvent[] {
  const previousHash = events.at(-1)?.eventHash ?? "GENESIS";
  const payload = { registryId, actorId, occurredAt, eventType, detail, previousHash };
  return [...events, {
    eventId: `AUDIT-${digest("registry-audit", payload).slice(0, 24).toUpperCase()}`,
    occurredAt,
    actorId,
    eventType,
    subjectId: registryId,
    detail,
    previousHash,
    eventHash: digest("registry-audit-hash", payload),
  }];
}

function immutableRegistryPayload(record: Omit<ArtifactRegistryRecord, "registryRecordHash" | "auditEvents">): Record<string, unknown> {
  return {
    registryId: record.registryId,
    artifactId: record.artifactId,
    seriesId: record.seriesId,
    governanceRegistrationId: record.governanceRegistrationId,
    organizationId: record.organizationId,
    architectureId: record.architectureId,
    architectureVersion: record.architectureVersion,
    classification: record.classification,
    determination: record.determination,
    routeId: record.routeId,
    routeVersion: record.routeVersion,
    canonicalHash: record.canonicalHash,
    packageHash: record.packageHash,
    pdfHash: record.pdfHash,
    manifestHash: record.manifestHash,
    sourceEligibilityEvaluationId: record.sourceEligibilityEvaluationId,
    registeredAt: record.registeredAt,
    versions: record.versions,
    statusHistory: record.statusHistory,
    challenges: record.challenges,
    corrections: record.corrections,
    supersedes: record.supersedes,
    supersededBy: record.supersededBy,
    withdrawalReason: record.withdrawalReason,
    withdrawnAt: record.withdrawnAt,
  };
}

function buildCertificate(
  record: Omit<ArtifactRegistryRecord, "registryRecordHash" | "registryCertificate" | "auditEvents">,
  registryRecordHash: string,
): RegistryCertificate {
  const certificateId = `TA14-CERT-${digest("certificate-id", { registryId: record.registryId, registryRecordHash }).slice(0, 24).toUpperCase()}`;
  const withoutHash = {
    certificateId,
    registryId: record.registryId,
    artifactId: record.artifactId,
    governanceRegistrationId: record.governanceRegistrationId,
    organizationName: record.organizationName,
    determination: record.determination,
    classification: record.classification,
    issuedAt: record.registeredAt,
    issuedBy: record.registeredBy,
    registryPolicyVersion: record.registryPolicyVersion,
    registryEngineVersion: record.registryEngineVersion,
    canonicalHash: record.canonicalHash,
    registryRecordHash,
    publicUrl: record.publicUrl,
    verifierUrl: record.verifierUrl,
    challengeUrl: record.challengeUrl,
    claimsBoundary: record.claimsBoundary,
    relianceStatus: record.relianceStatus,
  };
  return { ...withoutHash, certificateHash: digest("registry-certificate", withoutHash) };
}

function artifactReceiptId(artifact: CanonicalExecutionArtifact): string | undefined {
  const execution = artifact.execution as unknown as Record<string, unknown>;
  for (const key of ["receiptId", "technicalReceiptId", "executionReceiptId"]) {
    const value = execution[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function earliestCondition(artifact: CanonicalExecutionArtifact): string | undefined {
  const entries = artifact.gateLedger.entries;
  const failure = artifact.gateLedger.earliestFailureGateId
    ? entries.find((entry) => entry.gateId === artifact.gateLedger.earliestFailureGateId)
    : entries.find((entry) => entry.result !== "PASS");
  return failure
    ? `${failure.sequence}. ${failure.gateId}: ${failure.reasonCodes.join(", ") || failure.requirement}`
    : undefined;
}

export function registerEligibleArtifact(request: RegisterArtifactRequest): RegistryCommitResult {
  const decision = evaluateRegistryAdmission(request);
  if (!decision.admitted || !decision.proposedRegistryId) return { committed: false, decision };
  assertArtifactRegistrationEligible(request.eligibilityDecision);
  assertRegistryAdmissionApproved(decision);

  const registeredAt = request.registeredAt ?? decision.evaluatedAt;
  const registryId = decision.proposedRegistryId;
  const initialState = request.initialState ?? "DRAFT";
  const root = baseUrl(request.publicBaseUrl);
  const publicUrl = `${root}/artifacts/registry/${encodeURIComponent(registryId)}`;
  const verifierUrl = `${root}/artifacts/verify?registryId=${encodeURIComponent(registryId)}`;
  const challengeUrl = `${root}/artifacts/challenge?registryId=${encodeURIComponent(registryId)}`;
  const packageUrl = `${publicUrl}/download`;
  const receiptId = request.receiptId ?? artifactReceiptId(request.artifact);
  const relianceStatus = initialRelianceStatus(initialState);
  const manifest = buildManifest(request, registeredAt);
  const statusEvent = buildStatusEvent(
    registryId,
    request.registeredBy,
    registeredAt,
    null,
    initialState,
    "Initial artifact registry admission",
    request.eligibilityDecision.evaluationId,
    "GENESIS",
  );
  const versionEntry: RegistryVersionEntry = {
    versionId: `VERSION-${digest("registry-version", { registryId, sequence: 1 }).slice(0, 24).toUpperCase()}`,
    sequence: 1,
    changeKind: "ORIGINAL",
    createdAt: registeredAt,
    createdBy: request.registeredBy,
    artifactCanonicalHash: request.artifact.integrity.canonicalHash,
    registryRecordHash: "PENDING",
    scope: "Original immutable registry admission",
    reason: "Artifact approved by Governance Registration Gate and admitted by Registry Engine",
    prospectiveRelianceEffect: relianceStatus,
  };
  const publicSummary: RegistryPublicSummary = {
    registryId,
    artifactId: request.artifact.identity.artifactId,
    title: request.artifact.identity.title,
    organizationName: request.governance.organization.displayName,
    governanceRegistrationId: request.governance.governanceRegistrationId,
    architectureId: request.governance.architecture.architectureId,
    architectureVersion: request.governance.architecture.version,
    determination: request.artifact.commit.determination,
    classification: request.artifact.identity.classification,
    sector: request.sector,
    jurisdiction: request.jurisdiction,
    routeId: request.artifact.route.routeId,
    routeVersion: request.artifact.route.version,
    publicationState: initialState,
    relianceStatus,
    verificationLevel: request.requestedVerificationLevel,
    publicUrl,
    verifierUrl,
    challengeUrl,
    canonicalHash: request.artifact.integrity.canonicalHash,
    packageHash: request.packageHash,
    receiptId,
    earliestControllingCondition: request.earliestControllingCondition ?? earliestCondition(request.artifact),
    executionEffect: request.executionEffect,
    outcomeSummary: request.outcomeSummary,
    claimsBoundary: request.claimsBoundary,
    openChallengeCount: 0,
    correctionCount: 0,
  };

  const withoutHashesAndAudit: Omit<ArtifactRegistryRecord, "registryRecordHash" | "registryCertificate" | "auditEvents"> = {
    registryId,
    artifactId: request.artifact.identity.artifactId,
    seriesId: request.artifact.identity.seriesId,
    governanceRegistrationId: request.governance.governanceRegistrationId,
    organizationId: request.governance.organization.legalEntityId,
    organizationName: request.governance.organization.displayName,
    architectureId: request.governance.architecture.architectureId,
    architectureVersion: request.governance.architecture.version,
    title: request.artifact.identity.title,
    classification: request.artifact.identity.classification,
    determination: request.artifact.commit.determination,
    sector: request.sector,
    jurisdiction: request.jurisdiction,
    routeId: request.artifact.route.routeId,
    routeVersion: request.artifact.route.version,
    publicationState: initialState,
    relianceStatus,
    disclosure: request.disclosure,
    reviewLane: request.reviewLane ?? "STANDARD",
    verificationLevel: request.requestedVerificationLevel,
    submittedAt: request.submittedAt,
    submittedBy: request.submittedBy,
    registeredAt,
    registeredBy: request.registeredBy,
    publicUrl,
    verifierUrl,
    challengeUrl,
    packageUrl,
    receiptId,
    canonicalHash: request.artifact.integrity.canonicalHash,
    packageHash: request.packageHash,
    pdfHash: request.pdfHash,
    manifestHash: request.manifestHash,
    claimsBoundary: request.claimsBoundary,
    publicSummary,
    publicationManifest: manifest,
    sourceEligibilityEvaluationId: request.eligibilityDecision.evaluationId,
    sourceEligibilityAudit: request.eligibilityDecision.auditEvents.map((event) => ({ ...event })),
    canonicalValidation: decision.canonicalValidation,
    versions: [versionEntry],
    statusHistory: [statusEvent],
    challenges: [],
    corrections: [],
    registryPolicyVersion: TA14_ARTIFACT_REGISTRY_POLICY_VERSION,
    registryEngineVersion: TA14_ARTIFACT_REGISTRY_ENGINE_VERSION,
  };

  const preliminaryHash = digest("registry-record", immutableRegistryPayload({
    ...withoutHashesAndAudit,
    registryRecordHash: "PENDING",
    registryCertificate: {} as RegistryCertificate,
    auditEvents: [],
  } as ArtifactRegistryRecord));
  const versions = [{ ...versionEntry, registryRecordHash: preliminaryHash }];
  const payloadWithVersion = { ...withoutHashesAndAudit, versions };
  const registryRecordHash = digest("registry-record", immutableRegistryPayload({
    ...payloadWithVersion,
    registryRecordHash: "PENDING",
    registryCertificate: {} as RegistryCertificate,
    auditEvents: [],
  } as ArtifactRegistryRecord));
  const certificate = buildCertificate(payloadWithVersion, registryRecordHash);

  let auditEvents: RegistryAuditEvent[] = [];
  auditEvents = appendAuditEvent(auditEvents, registryId, request.registeredBy, registeredAt, "REGISTRY_EVALUATION_STARTED", decision.evaluationId);
  auditEvents = appendAuditEvent(auditEvents, registryId, request.registeredBy, registeredAt, "ELIGIBILITY_DECISION_ACCEPTED", stableEligibilityJson(request.eligibilityDecision));
  auditEvents = appendAuditEvent(auditEvents, registryId, request.registeredBy, registeredAt, "DUPLICATE_INDEX_CHECKED", "Artifact ID, canonical hash, and registry ID checked.");
  auditEvents = appendAuditEvent(auditEvents, registryId, request.registeredBy, registeredAt, "REGISTRY_ID_ASSIGNED", registryId);
  auditEvents = appendAuditEvent(auditEvents, registryId, request.registeredBy, registeredAt, "MANIFEST_VALIDATED", manifest.manifestId);
  auditEvents = appendAuditEvent(auditEvents, registryId, request.registeredBy, registeredAt, "CERTIFICATE_ISSUED", certificate.certificateId);
  auditEvents = appendAuditEvent(auditEvents, registryId, request.registeredBy, registeredAt, "PORTFOLIO_ENTRY_CREATED", request.governance.governanceRegistrationId);
  auditEvents = appendAuditEvent(auditEvents, registryId, request.registeredBy, registeredAt, "REGISTRY_RECORD_COMMITTED", registryRecordHash);

  const record: ArtifactRegistryRecord = {
    ...payloadWithVersion,
    registryRecordHash,
    registryCertificate: certificate,
    auditEvents,
  };
  return { committed: true, decision, record };
}

export function isRegistryTransitionAllowed(from: RegistryPublicationState, to: RegistryPublicationState): boolean {
  return REGISTRY_STATUS_TRANSITIONS[from].includes(to);
}

function relianceForState(state: RegistryPublicationState): RegistryRelianceStatus {
  switch (state) {
    case "PUBLISHED": return "PUBLIC_RELIANCE";
    case "CHALLENGED": return "RELIANCE_SUSPENDED";
    case "CORRECTED": return "LIMITED_RELIANCE";
    case "SUPERSEDED":
    case "WITHDRAWN": return "PROSPECTIVE_RELIANCE_ENDED";
    default: return "NO_PUBLIC_RELIANCE";
  }
}

export function transitionRegistryState(request: RegistryTransitionRequest): RegistryTransitionResult {
  const issues: RegistryIssue[] = [];
  if (!isIso(request.occurredAt)) issues.push(issue("TIME_ORDER_INVALID", "occurredAt"));
  if (!isRegistryTransitionAllowed(request.record.publicationState, request.toState)) {
    issues.push(issue("STATUS_TRANSITION_INVALID", "toState", { from: request.record.publicationState, to: request.toState }));
  }
  if (!request.actorId.trim()) issues.push(issue("REGISTRY_STEWARD_AUTHORITY_MISSING", "actorId"));
  if (!request.reason.trim()) issues.push(issue("REGISTRY_RECORD_INCOMPLETE", "reason"));
  if (!request.authorityReference.trim()) issues.push(issue("REGISTRY_STEWARD_AUTHORITY_MISSING", "authorityReference"));
  if (request.toState === "PUBLISHED") {
    if (!request.record.canonicalValidation.publicationReady) issues.push(issue("PUBLICATION_READY_REQUIRED", "canonicalValidation"));
    if (!request.record.pdfHash) issues.push(issue("PDF_HASH_MISSING", "pdfHash"));
    if (!request.record.publicUrl) issues.push(issue("STABLE_URL_MISSING", "publicUrl"));
    if (!request.record.verifierUrl) issues.push(issue("VERIFIER_URL_MISSING", "verifierUrl"));
    if (!request.record.challengeUrl) issues.push(issue("CHALLENGE_URL_MISSING", "challengeUrl"));
  }
  if (issues.length > 0) return { allowed: false, issues };

  const previousHash = request.record.statusHistory.at(-1)?.eventHash ?? "GENESIS";
  const statusEvent = buildStatusEvent(
    request.record.registryId,
    request.actorId,
    request.occurredAt,
    request.record.publicationState,
    request.toState,
    request.reason,
    request.authorityReference,
    previousHash,
  );
  const relianceStatus = relianceForState(request.toState);
  const publicSummary: RegistryPublicSummary = {
    ...request.record.publicSummary,
    publicationState: request.toState,
    relianceStatus,
    publishedAt: request.toState === "PUBLISHED" ? (request.publishedAt ?? request.occurredAt) : request.record.publicSummary.publishedAt,
  };
  const changed: ArtifactRegistryRecord = {
    ...request.record,
    publicationState: request.toState,
    relianceStatus,
    publishedAt: request.toState === "PUBLISHED" ? (request.publishedAt ?? request.occurredAt) : request.record.publishedAt,
    publicSummary,
    statusHistory: [...request.record.statusHistory, statusEvent],
    auditEvents: appendAuditEvent(
      request.record.auditEvents,
      request.record.registryId,
      request.actorId,
      request.occurredAt,
      "STATUS_TRANSITION_COMMITTED",
      `${request.record.publicationState} -> ${request.toState}: ${request.reason}`,
    ),
  };
  return { allowed: true, issues: [], record: rehashRegistryRecord(changed) };
}

export function appendRegistryChallenge(
  record: ArtifactRegistryRecord,
  challenge: RegistryChallengeReference,
  actorId: string,
): ArtifactRegistryRecord {
  if (!challenge.challengeId.trim()) throw new Error(REGISTRY_REASON_DICTIONARY.CHALLENGE_ID_MISSING.message);
  if (!isIso(challenge.openedAt)) throw new Error(REGISTRY_REASON_DICTIONARY.TIME_ORDER_INVALID.message);
  const challenges = [...record.challenges, { ...challenge }];
  const publicSummary = { ...record.publicSummary, openChallengeCount: challenges.filter((entry) => entry.status === "PENDING" || entry.status === "UNDER_REVIEW").length };
  const next: ArtifactRegistryRecord = {
    ...record,
    publicationState: "CHALLENGED",
    relianceStatus: "RELIANCE_SUSPENDED",
    publicSummary: { ...publicSummary, publicationState: "CHALLENGED", relianceStatus: "RELIANCE_SUSPENDED" },
    challenges,
    auditEvents: appendAuditEvent(record.auditEvents, record.registryId, actorId, challenge.openedAt, "CHALLENGE_APPENDED", challenge.challengeId),
  };
  return rehashRegistryRecord(next);
}

export function appendRegistryCorrection(
  record: ArtifactRegistryRecord,
  correction: RegistryCorrectionReference,
  actorId: string,
): ArtifactRegistryRecord {
  if (!correction.scope.trim()) throw new Error(REGISTRY_REASON_DICTIONARY.CORRECTION_SCOPE_MISSING.message);
  if (!correction.amendmentHash.trim()) throw new Error(REGISTRY_REASON_DICTIONARY.CORRECTION_HASH_MISSING.message);
  if (correction.parentRegistryRecordHash !== record.registryRecordHash) throw new Error(REGISTRY_REASON_DICTIONARY.AMENDMENT_PARENT_MISSING.message);
  const sequence = record.versions.length + 1;
  const version: RegistryVersionEntry = {
    versionId: `VERSION-${digest("registry-version", { registryId: record.registryId, sequence, correctionId: correction.correctionId }).slice(0, 24).toUpperCase()}`,
    sequence,
    changeKind: "CORRECTION",
    createdAt: correction.createdAt,
    createdBy: correction.createdBy,
    parentVersionId: record.versions.at(-1)?.versionId,
    artifactCanonicalHash: record.canonicalHash,
    registryRecordHash: correction.resultingRegistryRecordHash,
    amendmentHash: correction.amendmentHash,
    scope: correction.scope,
    reason: correction.reason,
    prospectiveRelianceEffect: "LIMITED_RELIANCE",
  };
  const corrections = [...record.corrections, { ...correction }];
  const next: ArtifactRegistryRecord = {
    ...record,
    publicationState: "CORRECTED",
    relianceStatus: "LIMITED_RELIANCE",
    publicSummary: {
      ...record.publicSummary,
      publicationState: "CORRECTED",
      relianceStatus: "LIMITED_RELIANCE",
      correctionCount: corrections.length,
    },
    corrections,
    versions: [...record.versions, version],
    auditEvents: appendAuditEvent(record.auditEvents, record.registryId, actorId, correction.createdAt, "CORRECTION_APPENDED", correction.correctionId),
  };
  return rehashRegistryRecord(next);
}

export function supersedeRegistryRecord(
  record: ArtifactRegistryRecord,
  successorRegistryId: string,
  actorId: string,
  occurredAt: string,
  reason: string,
): ArtifactRegistryRecord {
  if (!successorRegistryId.trim()) throw new Error(REGISTRY_REASON_DICTIONARY.SUPERSESSION_TARGET_MISSING.message);
  const next: ArtifactRegistryRecord = {
    ...record,
    publicationState: "SUPERSEDED",
    relianceStatus: "PROSPECTIVE_RELIANCE_ENDED",
    supersededBy: successorRegistryId,
    publicSummary: {
      ...record.publicSummary,
      publicationState: "SUPERSEDED",
      relianceStatus: "PROSPECTIVE_RELIANCE_ENDED",
      supersededBy: successorRegistryId,
    },
    auditEvents: appendAuditEvent(record.auditEvents, record.registryId, actorId, occurredAt, "SUPERSESSION_APPENDED", `${successorRegistryId}: ${reason}`),
  };
  return rehashRegistryRecord(next);
}

export function withdrawRegistryRecord(
  record: ArtifactRegistryRecord,
  actorId: string,
  occurredAt: string,
  reason: string,
): ArtifactRegistryRecord {
  if (!reason.trim()) throw new Error(REGISTRY_REASON_DICTIONARY.WITHDRAWAL_REASON_MISSING.message);
  const next: ArtifactRegistryRecord = {
    ...record,
    publicationState: "WITHDRAWN",
    relianceStatus: "PROSPECTIVE_RELIANCE_ENDED",
    withdrawalReason: reason,
    withdrawnAt: occurredAt,
    publicSummary: {
      ...record.publicSummary,
      publicationState: "WITHDRAWN",
      relianceStatus: "PROSPECTIVE_RELIANCE_ENDED",
      withdrawnAt: occurredAt,
    },
    auditEvents: appendAuditEvent(record.auditEvents, record.registryId, actorId, occurredAt, "WITHDRAWAL_APPENDED", reason),
  };
  return rehashRegistryRecord(next);
}

export function rehashRegistryRecord(record: ArtifactRegistryRecord): ArtifactRegistryRecord {
  const registryRecordHash = digest("registry-record", immutableRegistryPayload(record));
  const certificateWithoutHash = { ...record.registryCertificate, registryRecordHash };
  const { certificateHash: _ignored, ...certificatePayload } = certificateWithoutHash;
  return {
    ...record,
    registryRecordHash,
    registryCertificate: {
      ...certificatePayload,
      certificateHash: digest("registry-certificate", certificatePayload),
    },
  };
}

export function verifyRegistryRecord(record: ArtifactRegistryRecord): RegistryIssue[] {
  const issues: RegistryIssue[] = [];
  if (!record.registryId.trim()) issues.push(issue("REGISTRY_RECORD_INCOMPLETE", "registryId"));
  if (!record.registryRecordHash.trim()) issues.push(issue("REGISTRY_RECORD_HASH_MISSING", "registryRecordHash"));
  const expectedHash = digest("registry-record", immutableRegistryPayload(record));
  if (record.registryRecordHash !== expectedHash) issues.push(issue("REGISTRY_RECORD_HASH_MISMATCH", "registryRecordHash", { expectedHash, actualHash: record.registryRecordHash }));
  for (let index = 0; index < record.auditEvents.length; index += 1) {
    const event = record.auditEvents[index];
    const expectedPrevious = index === 0 ? "GENESIS" : record.auditEvents[index - 1].eventHash;
    if (event.previousHash !== expectedPrevious) issues.push(issue("AUDIT_CHAIN_BROKEN", `auditEvents.${index}.previousHash`));
  }
  for (let index = 0; index < record.versions.length; index += 1) {
    if (record.versions[index].sequence !== index + 1) issues.push(issue("VERSION_SEQUENCE_INVALID", `versions.${index}.sequence`));
  }
  if (record.publicationState === "WITHDRAWN" && record.relianceStatus !== "PROSPECTIVE_RELIANCE_ENDED") issues.push(issue("WITHDRAWN_RECORD_PUBLIC_RELIANCE", "relianceStatus"));
  if (record.publicationState === "SUPERSEDED" && record.relianceStatus !== "PROSPECTIVE_RELIANCE_ENDED") issues.push(issue("SUPERSEDED_RECORD_PUBLIC_RELIANCE", "relianceStatus"));
  if (record.publicationState === "CHALLENGED" && record.publicSummary.publicationState !== "CHALLENGED") issues.push(issue("CHALLENGED_STATUS_NOT_VISIBLE", "publicSummary.publicationState"));
  if (record.corrections.length > 0 && record.publicSummary.correctionCount !== record.corrections.length) issues.push(issue("CORRECTED_STATUS_NOT_VISIBLE", "publicSummary.correctionCount"));
  return issues;
}

export function buildGovernancePortfolioIndex(
  governance: GovernanceRegistration,
  records: readonly ArtifactRegistryRecord[],
  generatedAt = new Date().toISOString(),
): GovernancePortfolioIndex {
  const matching = records
    .filter((record) => record.governanceRegistrationId === governance.governanceRegistrationId)
    .slice()
    .sort((a, b) => a.registeredAt.localeCompare(b.registeredAt) || a.registryId.localeCompare(b.registryId));
  const entries: GovernancePortfolioEntry[] = matching.map((record) => ({
    governanceRegistrationId: record.governanceRegistrationId,
    organizationId: record.organizationId,
    organizationName: record.organizationName,
    registryId: record.registryId,
    artifactId: record.artifactId,
    title: record.title,
    determination: record.determination,
    classification: record.classification,
    sector: record.sector,
    jurisdiction: record.jurisdiction,
    routeId: record.routeId,
    routeVersion: record.routeVersion,
    publicationState: record.publicationState,
    relianceStatus: record.relianceStatus,
    verificationLevel: record.verificationLevel,
    registeredAt: record.registeredAt,
    publishedAt: record.publishedAt,
    canonicalHash: record.canonicalHash,
    publicUrl: record.publicUrl,
    verifierUrl: record.verifierUrl,
    challengeUrl: record.challengeUrl,
    openChallengeCount: record.publicSummary.openChallengeCount,
    correctionCount: record.corrections.length,
  }));
  const byDetermination: Record<Determination, number> = { ALLOW: 0, HOLD: 0, DENY: 0, ESCALATE: 0 };
  const byClassification: Record<ArtifactClassification, number> = { DEMONSTRATION: 0, PRODUCTION: 0 };
  const bySector: Record<string, number> = {};
  for (const entry of entries) {
    byDetermination[entry.determination] += 1;
    byClassification[entry.classification] += 1;
    bySector[entry.sector] = (bySector[entry.sector] ?? 0) + 1;
  }
  const withoutHash = {
    governanceRegistrationId: governance.governanceRegistrationId,
    organizationId: governance.organization.legalEntityId,
    organizationName: governance.organization.displayName,
    generatedAt,
    artifactCount: entries.length,
    publishedCount: entries.filter((entry) => entry.publicationState === "PUBLISHED").length,
    challengedCount: entries.filter((entry) => entry.publicationState === "CHALLENGED").length,
    correctedCount: entries.filter((entry) => entry.correctionCount > 0).length,
    withdrawnCount: entries.filter((entry) => entry.publicationState === "WITHDRAWN").length,
    byDetermination,
    byClassification,
    bySector,
    entries,
  };
  return { ...withoutHash, portfolioHash: digest("governance-portfolio", withoutHash) };
}

export function stableRegistryRecordJson(record: ArtifactRegistryRecord): string {
  return stableStringify(record);
}

export function stableRegistryAdmissionJson(decision: RegistryAdmissionDecision): string {
  return stableStringify(decision);
}

export function stableGovernancePortfolioJson(index: GovernancePortfolioIndex): string {
  return stableStringify(index);
}

export function registryRecordDigest(record: ArtifactRegistryRecord): string {
  return digest("registry-record-export", record);
}

export function registryCertificateDigest(certificate: RegistryCertificate): string {
  return digest("registry-certificate-export", certificate);
}

export function listRegistryReasons(disposition?: RegistryIssueDisposition): RegistryReasonDefinition[] {
  return Object.values(REGISTRY_REASON_DICTIONARY).filter((definition) => !disposition || definition.disposition === disposition);
}

export function listRegistryControls(): RegistryControlDefinition[] {
  return REGISTRY_CONTROLS.map((control) => ({ ...control }));
}

export function buildRegistryDuplicateIndex(records: readonly ArtifactRegistryRecord[]): RegistryDuplicateIndex {
  return {
    registryIds: new Set(records.map((record) => record.registryId)),
    artifactIds: new Set(records.map((record) => record.artifactId)),
    canonicalHashes: new Set(records.map((record) => record.canonicalHash)),
  };
}

export function buildPublicRegistrySummary(record: ArtifactRegistryRecord): RegistryPublicSummary {
  return { ...record.publicSummary };
}

export function buildRegistryCertificate(record: ArtifactRegistryRecord): RegistryCertificate {
  return { ...record.registryCertificate };
}

export function artifactCanBeReliedUpon(record: ArtifactRegistryRecord): boolean {
  return record.publicationState === "PUBLISHED"
    && record.relianceStatus === "PUBLIC_RELIANCE"
    && record.publicSummary.openChallengeCount === 0
    && verifyRegistryRecord(record).length === 0;
}

export const ARTIFACT_REGISTRY_ENGINE_PRINCIPLES = Object.freeze([
  "No registered governance. No registered artifact.",
  "Eligibility must be committed before registry admission.",
  "The registry preserves evidence; it does not invent evidence.",
  "Publication identity and canonical commitments become immutable after admission.",
  "Corrections append; they do not rewrite the original record.",
  "Registration is not certification.",
  "A public claim may not exceed the preserved artifact and verification record.",
  "Challenges and corrections remain visible to prospective reviewers.",
  "Withdrawn and superseded records remain preserved but cannot be presented as current.",
  "Every published artifact must expose verification and challenge pathways.",
] as const);

export const ARTIFACT_REGISTRY_ENGINE_SELF_TESTS = Object.freeze([
  "Reject an artifact without a committed eligibility approval.",
  "Reject an artifact sponsored by a different governance registration.",
  "Reject a canonical hash that differs from the eligibility snapshot.",
  "Reject duplicate artifact IDs and canonical hashes.",
  "Assign a deterministic permanent registry ID.",
  "Create one immutable original version entry.",
  "Create one append-only status genesis event.",
  "Create a registry certificate and certificate hash.",
  "Create a governance portfolio entry.",
  "Block PUBLISHED when canonical validation is not publication-ready.",
  "Block PUBLISHED when PDF, verifier, or challenge pathways are missing.",
  "Permit only declared state transitions.",
  "Append a challenge without rewriting the original record.",
  "Append a correction with parent and amendment hashes.",
  "Terminate prospective reliance when superseded or withdrawn.",
  "Detect audit-chain breaks.",
  "Detect registry-record hash mismatch.",
  "Preserve determination, classification, route, and canonical-hash parity.",
  "Expose a bounded public summary without exposing restricted components.",
  "Generate deterministic stable JSON for registry, certificate, and portfolio records.",
] as const);
export const REGISTRY_CONTROL_GUIDANCE: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "REG-001": Object.freeze([
    'Confirm the artifact is sponsored by an active registered governance.',
    'Preserve attributable evidence showing governance sponsorship.',
    'Fail closed when governance sponsorship cannot be established.',
  ]),
  "REG-002": Object.freeze([
    'Confirm the Governance Registration Gate committed REGISTER_ARTIFACT.',
    'Preserve attributable evidence showing eligibility approval.',
    'Fail closed when eligibility approval cannot be established.',
  ]),
  "REG-003": Object.freeze([
    'Match artifact ID to the eligibility snapshot.',
    'Preserve attributable evidence showing artifact identity parity.',
    'Fail closed when artifact identity parity cannot be established.',
  ]),
  "REG-004": Object.freeze([
    'Match the frozen canonical hash to the eligibility snapshot.',
    'Preserve attributable evidence showing canonical hash parity.',
    'Fail closed when canonical hash parity cannot be established.',
  ]),
  "REG-005": Object.freeze([
    'Match the governance registration identifier.',
    'Preserve attributable evidence showing governance registration parity.',
    'Fail closed when governance registration parity cannot be established.',
  ]),
  "REG-006": Object.freeze([
    'Preserve registered architecture identity and version.',
    'Preserve attributable evidence showing architecture parity.',
    'Fail closed when architecture parity cannot be established.',
  ]),
  "REG-007": Object.freeze([
    'Preserve route ID and version.',
    'Preserve attributable evidence showing route parity.',
    'Fail closed when route parity cannot be established.',
  ]),
  "REG-008": Object.freeze([
    'Preserve ALLOW, HOLD, DENY, or ESCALATE exactly.',
    'Preserve attributable evidence showing determination parity.',
    'Fail closed when determination parity cannot be established.',
  ]),
  "REG-009": Object.freeze([
    'Preserve demonstration or production classification.',
    'Preserve attributable evidence showing classification parity.',
    'Fail closed when classification parity cannot be established.',
  ]),
  "REG-010": Object.freeze([
    'Bind the record to the registered governance owner.',
    'Preserve attributable evidence showing ownership attribution.',
    'Fail closed when ownership attribution cannot be established.',
  ]),
  "REG-011": Object.freeze([
    'Preserve the accountable registry steward.',
    'Preserve attributable evidence showing steward attribution.',
    'Fail closed when steward attribution cannot be established.',
  ]),
  "REG-012": Object.freeze([
    'Preserve the authorized submitter identity.',
    'Preserve attributable evidence showing submitter authority.',
    'Fail closed when submitter authority cannot be established.',
  ]),
  "REG-013": Object.freeze([
    'Preserve a valid submission timestamp.',
    'Preserve attributable evidence showing submission time.',
    'Fail closed when submission time cannot be established.',
  ]),
  "REG-014": Object.freeze([
    'Preserve the accepted registry terms version.',
    'Preserve attributable evidence showing terms acceptance.',
    'Fail closed when terms acceptance cannot be established.',
  ]),
  "REG-015": Object.freeze([
    'Preserve the applied registry policy version.',
    'Preserve attributable evidence showing policy version.',
    'Fail closed when policy version cannot be established.',
  ]),
  "REG-016": Object.freeze([
    'Preserve the registry engine version.',
    'Preserve attributable evidence showing engine version.',
    'Fail closed when engine version cannot be established.',
  ]),
  "REG-017": Object.freeze([
    'Reject duplicate artifact identifiers.',
    'Preserve attributable evidence showing duplicate artifact check.',
    'Fail closed when duplicate artifact check cannot be established.',
  ]),
  "REG-018": Object.freeze([
    'Reject duplicate canonical hashes.',
    'Preserve attributable evidence showing duplicate hash check.',
    'Fail closed when duplicate hash check cannot be established.',
  ]),
  "REG-019": Object.freeze([
    'Assign one permanent collision-resistant registry ID.',
    'Preserve attributable evidence showing registry id assignment.',
    'Fail closed when registry id assignment cannot be established.',
  ]),
  "REG-020": Object.freeze([
    'Limit initial state to DRAFT, INTERNAL_REVIEW, or READY.',
    'Preserve attributable evidence showing initial state control.',
    'Fail closed when initial state control cannot be established.',
  ]),
  "REG-021": Object.freeze([
    'Require publication-ready canonical validation before PUBLISHED.',
    'Preserve attributable evidence showing publication readiness.',
    'Fail closed when publication readiness cannot be established.',
  ]),
  "REG-022": Object.freeze([
    'Assign the permanent registry URL.',
    'Preserve attributable evidence showing stable url assignment.',
    'Fail closed when stable url assignment cannot be established.',
  ]),
  "REG-023": Object.freeze([
    'Assign the verification center URL.',
    'Preserve attributable evidence showing verifier pathway.',
    'Fail closed when verifier pathway cannot be established.',
  ]),
  "REG-024": Object.freeze([
    'Assign the challenge center URL.',
    'Preserve attributable evidence showing challenge pathway.',
    'Fail closed when challenge pathway cannot be established.',
  ]),
  "REG-025": Object.freeze([
    'Preserve the PDF hash when a PDF is published.',
    'Preserve attributable evidence showing pdf commitment.',
    'Fail closed when pdf commitment cannot be established.',
  ]),
  "REG-026": Object.freeze([
    'Preserve the publication manifest hash.',
    'Preserve attributable evidence showing manifest commitment.',
    'Fail closed when manifest commitment cannot be established.',
  ]),
  "REG-027": Object.freeze([
    'Preserve the package-root hash.',
    'Preserve attributable evidence showing package commitment.',
    'Fail closed when package commitment cannot be established.',
  ]),
  "REG-028": Object.freeze([
    'Link the execution receipt.',
    'Preserve attributable evidence showing receipt linkage.',
    'Fail closed when receipt linkage cannot be established.',
  ]),
  "REG-029": Object.freeze([
    'Create a bounded public registry summary.',
    'Preserve attributable evidence showing public summary.',
    'Fail closed when public summary cannot be established.',
  ]),
  "REG-030": Object.freeze([
    'State what the artifact proves and does not prove.',
    'Preserve attributable evidence showing claims boundary.',
    'Fail closed when claims boundary cannot be established.',
  ]),
  "REG-031": Object.freeze([
    'Apply one declared disclosure state.',
    'Preserve attributable evidence showing disclosure state.',
    'Fail closed when disclosure state cannot be established.',
  ]),
  "REG-032": Object.freeze([
    'Constrain verification claims to levels 0 through 7.',
    'Preserve attributable evidence showing verification level.',
    'Fail closed when verification level cannot be established.',
  ]),
  "REG-033": Object.freeze([
    'Apply independent review policy where required.',
    'Preserve attributable evidence showing review requirement.',
    'Fail closed when review requirement cannot be established.',
  ]),
  "REG-034": Object.freeze([
    'Apply production-specific review requirements.',
    'Preserve attributable evidence showing production review.',
    'Fail closed when production review cannot be established.',
  ]),
  "REG-035": Object.freeze([
    'Keep demonstration records visibly distinguished.',
    'Preserve attributable evidence showing demonstration labeling.',
    'Fail closed when demonstration labeling cannot be established.',
  ]),
  "REG-036": Object.freeze([
    'Create the governance portfolio entry.',
    'Preserve attributable evidence showing portfolio link.',
    'Fail closed when portfolio link cannot be established.',
  ]),
  "REG-037": Object.freeze([
    'Issue a stable registry certificate.',
    'Preserve attributable evidence showing certificate issuance.',
    'Fail closed when certificate issuance cannot be established.',
  ]),
  "REG-038": Object.freeze([
    'Commit the registry certificate hash.',
    'Preserve attributable evidence showing certificate hash.',
    'Fail closed when certificate hash cannot be established.',
  ]),
  "REG-039": Object.freeze([
    'Preserve registry evaluation start.',
    'Preserve attributable evidence showing audit event start.',
    'Fail closed when audit event start cannot be established.',
  ]),
  "REG-040": Object.freeze([
    'Preserve source eligibility audit events.',
    'Preserve attributable evidence showing audit eligibility source.',
    'Fail closed when audit eligibility source cannot be established.',
  ]),
  "REG-041": Object.freeze([
    'Preserve registry ID assignment.',
    'Preserve attributable evidence showing audit id assignment.',
    'Fail closed when audit id assignment cannot be established.',
  ]),
  "REG-042": Object.freeze([
    'Preserve registry commit.',
    'Preserve attributable evidence showing audit commit.',
    'Fail closed when audit commit cannot be established.',
  ]),
  "REG-043": Object.freeze([
    'Maintain append-only audit hash continuity.',
    'Preserve attributable evidence showing audit hash chain.',
    'Fail closed when audit hash chain cannot be established.',
  ]),
  "REG-044": Object.freeze([
    'Freeze publication identity and canonical commitments.',
    'Preserve attributable evidence showing immutable payload.',
    'Fail closed when immutable payload cannot be established.',
  ]),
  "REG-045": Object.freeze([
    'Maintain monotonic version numbering.',
    'Preserve attributable evidence showing version sequence.',
    'Fail closed when version sequence cannot be established.',
  ]),
  "REG-046": Object.freeze([
    'Enforce allowed status transitions.',
    'Preserve attributable evidence showing status transition.',
    'Fail closed when status transition cannot be established.',
  ]),
  "REG-047": Object.freeze([
    'Expose material challenges.',
    'Preserve attributable evidence showing challenge visibility.',
    'Fail closed when challenge visibility cannot be established.',
  ]),
  "REG-048": Object.freeze([
    'Append corrections without rewriting the original.',
    'Preserve attributable evidence showing correction append.',
    'Fail closed when correction append cannot be established.',
  ]),
  "REG-049": Object.freeze([
    'Link superseded records to successors.',
    'Preserve attributable evidence showing supersession link.',
    'Fail closed when supersession link cannot be established.',
  ]),
  "REG-050": Object.freeze([
    'Preserve attributable withdrawal reasons.',
    'Preserve attributable evidence showing withdrawal reason.',
    'Fail closed when withdrawal reason cannot be established.',
  ]),
  "REG-051": Object.freeze([
    'Declare current prospective reliance status.',
    'Preserve attributable evidence showing reliance status.',
    'Fail closed when reliance status cannot be established.',
  ]),
  "REG-052": Object.freeze([
    'Validate public, verifier, challenge, and package references.',
    'Preserve attributable evidence showing external references.',
    'Fail closed when external references cannot be established.',
  ]),
  "REG-053": Object.freeze([
    'Require unique manifest component IDs.',
    'Preserve attributable evidence showing component uniqueness.',
    'Fail closed when component uniqueness cannot be established.',
  ]),
  "REG-054": Object.freeze([
    'Require hashes for mandatory components.',
    'Preserve attributable evidence showing component integrity.',
    'Fail closed when component integrity cannot be established.',
  ]),
  "REG-055": Object.freeze([
    'Require the complete publication manifest.',
    'Preserve attributable evidence showing publication manifest completeness.',
    'Fail closed when publication manifest completeness cannot be established.',
  ]),
  "REG-056": Object.freeze([
    'Require all mandatory registry domains.',
    'Preserve attributable evidence showing registry record completeness.',
    'Fail closed when registry record completeness cannot be established.',
  ]),
  "REG-057": Object.freeze([
    'Commit the deterministic registry record hash.',
    'Preserve attributable evidence showing registry record hash.',
    'Fail closed when registry record hash cannot be established.',
  ]),
  "REG-058": Object.freeze([
    'Verify the stored registry record hash.',
    'Preserve attributable evidence showing record hash parity.',
    'Fail closed when record hash parity cannot be established.',
  ]),
  "REG-059": Object.freeze([
    'Require coherent event timestamps.',
    'Preserve attributable evidence showing chronology.',
    'Fail closed when chronology cannot be established.',
  ]),
  "REG-060": Object.freeze([
    'Maintain attributable governance portfolio order.',
    'Preserve attributable evidence showing governance portfolio index.',
    'Fail closed when governance portfolio index cannot be established.',
  ]),
  "REG-061": Object.freeze([
    'Create normalized searchable metadata.',
    'Preserve attributable evidence showing search metadata.',
    'Fail closed when search metadata cannot be established.',
  ]),
  "REG-062": Object.freeze([
    'Generate public status without exposing restricted content.',
    'Preserve attributable evidence showing public status projection.',
    'Fail closed when public status projection cannot be established.',
  ]),
  "REG-063": Object.freeze([
    'Generate verifier-facing metadata.',
    'Preserve attributable evidence showing verification projection.',
    'Fail closed when verification projection cannot be established.',
  ]),
  "REG-064": Object.freeze([
    'Generate challenge-facing metadata.',
    'Preserve attributable evidence showing challenge projection.',
    'Fail closed when challenge projection cannot be established.',
  ]),
  "REG-065": Object.freeze([
    'Generate registry certificate metadata.',
    'Preserve attributable evidence showing certificate projection.',
    'Fail closed when certificate projection cannot be established.',
  ]),
  "REG-066": Object.freeze([
    'Generate bounded package-download metadata.',
    'Preserve attributable evidence showing download projection.',
    'Fail closed when download projection cannot be established.',
  ]),
  "REG-067": Object.freeze([
    'Require parent links for amendments.',
    'Preserve attributable evidence showing amendment parent.',
    'Fail closed when amendment parent cannot be established.',
  ]),
  "REG-068": Object.freeze([
    'Require bounded correction scope.',
    'Preserve attributable evidence showing correction scope.',
    'Fail closed when correction scope cannot be established.',
  ]),
  "REG-069": Object.freeze([
    'Require stable challenge identity.',
    'Preserve attributable evidence showing challenge identity.',
    'Fail closed when challenge identity cannot be established.',
  ]),
  "REG-070": Object.freeze([
    'Require a valid successor record.',
    'Preserve attributable evidence showing supersession target.',
    'Fail closed when supersession target cannot be established.',
  ]),
  "REG-071": Object.freeze([
    'Block prospective reliance on withdrawn records.',
    'Preserve attributable evidence showing withdrawn reliance block.',
    'Fail closed when withdrawn reliance block cannot be established.',
  ]),
  "REG-072": Object.freeze([
    'Block prospective reliance on superseded records.',
    'Preserve attributable evidence showing superseded reliance block.',
    'Fail closed when superseded reliance block cannot be established.',
  ]),
});

export function registryControlGuidance(controlId: string): readonly string[] {
  return REGISTRY_CONTROL_GUIDANCE[controlId] ?? Object.freeze([]);
}

// Typed reason-code helpers
export function isEligibilityDecisionMissing(value: string): value is "ELIGIBILITY_DECISION_MISSING" {
  return value === "ELIGIBILITY_DECISION_MISSING";
}

export const ELIGIBILITY_DECISION_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.ELIGIBILITY_DECISION_MISSING;

export function isEligibilityDecisionNotApproved(value: string): value is "ELIGIBILITY_DECISION_NOT_APPROVED" {
  return value === "ELIGIBILITY_DECISION_NOT_APPROVED";
}

export const ELIGIBILITY_DECISION_NOT_APPROVED_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.ELIGIBILITY_DECISION_NOT_APPROVED;

export function isGovernanceRegistrationIdMissing(value: string): value is "GOVERNANCE_REGISTRATION_ID_MISSING" {
  return value === "GOVERNANCE_REGISTRATION_ID_MISSING";
}

export const GOVERNANCE_REGISTRATION_ID_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.GOVERNANCE_REGISTRATION_ID_MISSING;

export function isGovernanceRegistrationMismatch(value: string): value is "GOVERNANCE_REGISTRATION_MISMATCH" {
  return value === "GOVERNANCE_REGISTRATION_MISMATCH";
}

export const GOVERNANCE_REGISTRATION_MISMATCH_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.GOVERNANCE_REGISTRATION_MISMATCH;

export function isArtifactIdMissing(value: string): value is "ARTIFACT_ID_MISSING" {
  return value === "ARTIFACT_ID_MISSING";
}

export const ARTIFACT_ID_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.ARTIFACT_ID_MISSING;

export function isArtifactIdMismatch(value: string): value is "ARTIFACT_ID_MISMATCH" {
  return value === "ARTIFACT_ID_MISMATCH";
}

export const ARTIFACT_ID_MISMATCH_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.ARTIFACT_ID_MISMATCH;

export function isCanonicalHashMissing(value: string): value is "CANONICAL_HASH_MISSING" {
  return value === "CANONICAL_HASH_MISSING";
}

export const CANONICAL_HASH_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CANONICAL_HASH_MISSING;

export function isCanonicalHashMismatch(value: string): value is "CANONICAL_HASH_MISMATCH" {
  return value === "CANONICAL_HASH_MISMATCH";
}

export const CANONICAL_HASH_MISMATCH_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CANONICAL_HASH_MISMATCH;

export function isDuplicateArtifactId(value: string): value is "DUPLICATE_ARTIFACT_ID" {
  return value === "DUPLICATE_ARTIFACT_ID";
}

export const DUPLICATE_ARTIFACT_ID_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.DUPLICATE_ARTIFACT_ID;

export function isDuplicateCanonicalHash(value: string): value is "DUPLICATE_CANONICAL_HASH" {
  return value === "DUPLICATE_CANONICAL_HASH";
}

export const DUPLICATE_CANONICAL_HASH_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.DUPLICATE_CANONICAL_HASH;

export function isRegistryIdCollision(value: string): value is "REGISTRY_ID_COLLISION" {
  return value === "REGISTRY_ID_COLLISION";
}

export const REGISTRY_ID_COLLISION_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.REGISTRY_ID_COLLISION;

export function isPublicationStateInvalid(value: string): value is "PUBLICATION_STATE_INVALID" {
  return value === "PUBLICATION_STATE_INVALID";
}

export const PUBLICATION_STATE_INVALID_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.PUBLICATION_STATE_INVALID;

export function isPublicationReadyRequired(value: string): value is "PUBLICATION_READY_REQUIRED" {
  return value === "PUBLICATION_READY_REQUIRED";
}

export const PUBLICATION_READY_REQUIRED_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.PUBLICATION_READY_REQUIRED;

export function isGovernanceNotActive(value: string): value is "GOVERNANCE_NOT_ACTIVE" {
  return value === "GOVERNANCE_NOT_ACTIVE";
}

export const GOVERNANCE_NOT_ACTIVE_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.GOVERNANCE_NOT_ACTIVE;

export function isGovernanceProfileMissing(value: string): value is "GOVERNANCE_PROFILE_MISSING" {
  return value === "GOVERNANCE_PROFILE_MISSING";
}

export const GOVERNANCE_PROFILE_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.GOVERNANCE_PROFILE_MISSING;

export function isOwnerMismatch(value: string): value is "OWNER_MISMATCH" {
  return value === "OWNER_MISMATCH";
}

export const OWNER_MISMATCH_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.OWNER_MISMATCH;

export function isStewardMissing(value: string): value is "STEWARD_MISSING" {
  return value === "STEWARD_MISSING";
}

export const STEWARD_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.STEWARD_MISSING;

export function isSubmitterMissing(value: string): value is "SUBMITTER_MISSING" {
  return value === "SUBMITTER_MISSING";
}

export const SUBMITTER_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.SUBMITTER_MISSING;

export function isSubmissionTimestampInvalid(value: string): value is "SUBMISSION_TIMESTAMP_INVALID" {
  return value === "SUBMISSION_TIMESTAMP_INVALID";
}

export const SUBMISSION_TIMESTAMP_INVALID_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.SUBMISSION_TIMESTAMP_INVALID;

export function isRegistryTermsNotAccepted(value: string): value is "REGISTRY_TERMS_NOT_ACCEPTED" {
  return value === "REGISTRY_TERMS_NOT_ACCEPTED";
}

export const REGISTRY_TERMS_NOT_ACCEPTED_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.REGISTRY_TERMS_NOT_ACCEPTED;

export function isClassificationMismatch(value: string): value is "CLASSIFICATION_MISMATCH" {
  return value === "CLASSIFICATION_MISMATCH";
}

export const CLASSIFICATION_MISMATCH_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CLASSIFICATION_MISMATCH;

export function isDeterminationMismatch(value: string): value is "DETERMINATION_MISMATCH" {
  return value === "DETERMINATION_MISMATCH";
}

export const DETERMINATION_MISMATCH_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.DETERMINATION_MISMATCH;

export function isRouteIdMismatch(value: string): value is "ROUTE_ID_MISMATCH" {
  return value === "ROUTE_ID_MISMATCH";
}

export const ROUTE_ID_MISMATCH_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.ROUTE_ID_MISMATCH;

export function isRouteVersionMismatch(value: string): value is "ROUTE_VERSION_MISMATCH" {
  return value === "ROUTE_VERSION_MISMATCH";
}

export const ROUTE_VERSION_MISMATCH_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.ROUTE_VERSION_MISMATCH;

export function isReceiptIdMissing(value: string): value is "RECEIPT_ID_MISSING" {
  return value === "RECEIPT_ID_MISSING";
}

export const RECEIPT_ID_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.RECEIPT_ID_MISSING;

export function isPackageHashMissing(value: string): value is "PACKAGE_HASH_MISSING" {
  return value === "PACKAGE_HASH_MISSING";
}

export const PACKAGE_HASH_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.PACKAGE_HASH_MISSING;

export function isPdfHashMissing(value: string): value is "PDF_HASH_MISSING" {
  return value === "PDF_HASH_MISSING";
}

export const PDF_HASH_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.PDF_HASH_MISSING;

export function isManifestHashMissing(value: string): value is "MANIFEST_HASH_MISSING" {
  return value === "MANIFEST_HASH_MISSING";
}

export const MANIFEST_HASH_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.MANIFEST_HASH_MISSING;

export function isStableUrlMissing(value: string): value is "STABLE_URL_MISSING" {
  return value === "STABLE_URL_MISSING";
}

export const STABLE_URL_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.STABLE_URL_MISSING;

export function isVerifierUrlMissing(value: string): value is "VERIFIER_URL_MISSING" {
  return value === "VERIFIER_URL_MISSING";
}

export const VERIFIER_URL_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.VERIFIER_URL_MISSING;

export function isChallengeUrlMissing(value: string): value is "CHALLENGE_URL_MISSING" {
  return value === "CHALLENGE_URL_MISSING";
}

export const CHALLENGE_URL_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CHALLENGE_URL_MISSING;

export function isVersionSequenceInvalid(value: string): value is "VERSION_SEQUENCE_INVALID" {
  return value === "VERSION_SEQUENCE_INVALID";
}

export const VERSION_SEQUENCE_INVALID_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.VERSION_SEQUENCE_INVALID;

export function isStatusTransitionInvalid(value: string): value is "STATUS_TRANSITION_INVALID" {
  return value === "STATUS_TRANSITION_INVALID";
}

export const STATUS_TRANSITION_INVALID_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.STATUS_TRANSITION_INVALID;

export function isOriginalRecordMutationAttempt(value: string): value is "ORIGINAL_RECORD_MUTATION_ATTEMPT" {
  return value === "ORIGINAL_RECORD_MUTATION_ATTEMPT";
}

export const ORIGINAL_RECORD_MUTATION_ATTEMPT_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.ORIGINAL_RECORD_MUTATION_ATTEMPT;

export function isAuditChainBroken(value: string): value is "AUDIT_CHAIN_BROKEN" {
  return value === "AUDIT_CHAIN_BROKEN";
}

export const AUDIT_CHAIN_BROKEN_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.AUDIT_CHAIN_BROKEN;

export function isAmendmentParentMissing(value: string): value is "AMENDMENT_PARENT_MISSING" {
  return value === "AMENDMENT_PARENT_MISSING";
}

export const AMENDMENT_PARENT_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.AMENDMENT_PARENT_MISSING;

export function isSupersessionTargetMissing(value: string): value is "SUPERSESSION_TARGET_MISSING" {
  return value === "SUPERSESSION_TARGET_MISSING";
}

export const SUPERSESSION_TARGET_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.SUPERSESSION_TARGET_MISSING;

export function isWithdrawalReasonMissing(value: string): value is "WITHDRAWAL_REASON_MISSING" {
  return value === "WITHDRAWAL_REASON_MISSING";
}

export const WITHDRAWAL_REASON_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.WITHDRAWAL_REASON_MISSING;

export function isChallengeIdMissing(value: string): value is "CHALLENGE_ID_MISSING" {
  return value === "CHALLENGE_ID_MISSING";
}

export const CHALLENGE_ID_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CHALLENGE_ID_MISSING;

export function isChallengeStateInvalid(value: string): value is "CHALLENGE_STATE_INVALID" {
  return value === "CHALLENGE_STATE_INVALID";
}

export const CHALLENGE_STATE_INVALID_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CHALLENGE_STATE_INVALID;

export function isCorrectionHashMissing(value: string): value is "CORRECTION_HASH_MISSING" {
  return value === "CORRECTION_HASH_MISSING";
}

export const CORRECTION_HASH_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CORRECTION_HASH_MISSING;

export function isCorrectionScopeMissing(value: string): value is "CORRECTION_SCOPE_MISSING" {
  return value === "CORRECTION_SCOPE_MISSING";
}

export const CORRECTION_SCOPE_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CORRECTION_SCOPE_MISSING;

export function isCertificateIdMissing(value: string): value is "CERTIFICATE_ID_MISSING" {
  return value === "CERTIFICATE_ID_MISSING";
}

export const CERTIFICATE_ID_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CERTIFICATE_ID_MISSING;

export function isCertificateHashMissing(value: string): value is "CERTIFICATE_HASH_MISSING" {
  return value === "CERTIFICATE_HASH_MISSING";
}

export const CERTIFICATE_HASH_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CERTIFICATE_HASH_MISSING;

export function isPublicSummaryMissing(value: string): value is "PUBLIC_SUMMARY_MISSING" {
  return value === "PUBLIC_SUMMARY_MISSING";
}

export const PUBLIC_SUMMARY_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.PUBLIC_SUMMARY_MISSING;

export function isClaimsBoundaryMissing(value: string): value is "CLAIMS_BOUNDARY_MISSING" {
  return value === "CLAIMS_BOUNDARY_MISSING";
}

export const CLAIMS_BOUNDARY_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CLAIMS_BOUNDARY_MISSING;

export function isDisclosureStateInvalid(value: string): value is "DISCLOSURE_STATE_INVALID" {
  return value === "DISCLOSURE_STATE_INVALID";
}

export const DISCLOSURE_STATE_INVALID_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.DISCLOSURE_STATE_INVALID;

export function isVerificationLevelInvalid(value: string): value is "VERIFICATION_LEVEL_INVALID" {
  return value === "VERIFICATION_LEVEL_INVALID";
}

export const VERIFICATION_LEVEL_INVALID_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.VERIFICATION_LEVEL_INVALID;

export function isVerificationLevelUnsupported(value: string): value is "VERIFICATION_LEVEL_UNSUPPORTED" {
  return value === "VERIFICATION_LEVEL_UNSUPPORTED";
}

export const VERIFICATION_LEVEL_UNSUPPORTED_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.VERIFICATION_LEVEL_UNSUPPORTED;

export function isIndependentReviewRequired(value: string): value is "INDEPENDENT_REVIEW_REQUIRED" {
  return value === "INDEPENDENT_REVIEW_REQUIRED";
}

export const INDEPENDENT_REVIEW_REQUIRED_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.INDEPENDENT_REVIEW_REQUIRED;

export function isProductionReviewRequired(value: string): value is "PRODUCTION_REVIEW_REQUIRED" {
  return value === "PRODUCTION_REVIEW_REQUIRED";
}

export const PRODUCTION_REVIEW_REQUIRED_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.PRODUCTION_REVIEW_REQUIRED;

export function isDemonstrationLabelMissing(value: string): value is "DEMONSTRATION_LABEL_MISSING" {
  return value === "DEMONSTRATION_LABEL_MISSING";
}

export const DEMONSTRATION_LABEL_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.DEMONSTRATION_LABEL_MISSING;

export function isPortfolioLinkMissing(value: string): value is "PORTFOLIO_LINK_MISSING" {
  return value === "PORTFOLIO_LINK_MISSING";
}

export const PORTFOLIO_LINK_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.PORTFOLIO_LINK_MISSING;

export function isRegistryRecordIncomplete(value: string): value is "REGISTRY_RECORD_INCOMPLETE" {
  return value === "REGISTRY_RECORD_INCOMPLETE";
}

export const REGISTRY_RECORD_INCOMPLETE_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.REGISTRY_RECORD_INCOMPLETE;

export function isRegistryRecordHashMissing(value: string): value is "REGISTRY_RECORD_HASH_MISSING" {
  return value === "REGISTRY_RECORD_HASH_MISSING";
}

export const REGISTRY_RECORD_HASH_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.REGISTRY_RECORD_HASH_MISSING;

export function isRegistryRecordHashMismatch(value: string): value is "REGISTRY_RECORD_HASH_MISMATCH" {
  return value === "REGISTRY_RECORD_HASH_MISMATCH";
}

export const REGISTRY_RECORD_HASH_MISMATCH_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.REGISTRY_RECORD_HASH_MISMATCH;

export function isPublicationManifestIncomplete(value: string): value is "PUBLICATION_MANIFEST_INCOMPLETE" {
  return value === "PUBLICATION_MANIFEST_INCOMPLETE";
}

export const PUBLICATION_MANIFEST_INCOMPLETE_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.PUBLICATION_MANIFEST_INCOMPLETE;

export function isComponentHashDuplicate(value: string): value is "COMPONENT_HASH_DUPLICATE" {
  return value === "COMPONENT_HASH_DUPLICATE";
}

export const COMPONENT_HASH_DUPLICATE_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.COMPONENT_HASH_DUPLICATE;

export function isComponentHashMissing(value: string): value is "COMPONENT_HASH_MISSING" {
  return value === "COMPONENT_HASH_MISSING";
}

export const COMPONENT_HASH_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.COMPONENT_HASH_MISSING;

export function isSourceEligibilityAuditMissing(value: string): value is "SOURCE_ELIGIBILITY_AUDIT_MISSING" {
  return value === "SOURCE_ELIGIBILITY_AUDIT_MISSING";
}

export const SOURCE_ELIGIBILITY_AUDIT_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.SOURCE_ELIGIBILITY_AUDIT_MISSING;

export function isRegistryStewardAuthorityMissing(value: string): value is "REGISTRY_STEWARD_AUTHORITY_MISSING" {
  return value === "REGISTRY_STEWARD_AUTHORITY_MISSING";
}

export const REGISTRY_STEWARD_AUTHORITY_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.REGISTRY_STEWARD_AUTHORITY_MISSING;

export function isPublisherAuthorityMissing(value: string): value is "PUBLISHER_AUTHORITY_MISSING" {
  return value === "PUBLISHER_AUTHORITY_MISSING";
}

export const PUBLISHER_AUTHORITY_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.PUBLISHER_AUTHORITY_MISSING;

export function isTimeOrderInvalid(value: string): value is "TIME_ORDER_INVALID" {
  return value === "TIME_ORDER_INVALID";
}

export const TIME_ORDER_INVALID_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.TIME_ORDER_INVALID;

export function isExternalReferenceInvalid(value: string): value is "EXTERNAL_REFERENCE_INVALID" {
  return value === "EXTERNAL_REFERENCE_INVALID";
}

export const EXTERNAL_REFERENCE_INVALID_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.EXTERNAL_REFERENCE_INVALID;

export function isRegistryPolicyVersionMissing(value: string): value is "REGISTRY_POLICY_VERSION_MISSING" {
  return value === "REGISTRY_POLICY_VERSION_MISSING";
}

export const REGISTRY_POLICY_VERSION_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.REGISTRY_POLICY_VERSION_MISSING;

export function isRegistryEngineVersionMissing(value: string): value is "REGISTRY_ENGINE_VERSION_MISSING" {
  return value === "REGISTRY_ENGINE_VERSION_MISSING";
}

export const REGISTRY_ENGINE_VERSION_MISSING_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.REGISTRY_ENGINE_VERSION_MISSING;

export function isRelianceStatusUndeclared(value: string): value is "RELIANCE_STATUS_UNDECLARED" {
  return value === "RELIANCE_STATUS_UNDECLARED";
}

export const RELIANCE_STATUS_UNDECLARED_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.RELIANCE_STATUS_UNDECLARED;

export function isWithdrawnRecordPublicReliance(value: string): value is "WITHDRAWN_RECORD_PUBLIC_RELIANCE" {
  return value === "WITHDRAWN_RECORD_PUBLIC_RELIANCE";
}

export const WITHDRAWN_RECORD_PUBLIC_RELIANCE_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.WITHDRAWN_RECORD_PUBLIC_RELIANCE;

export function isSupersededRecordPublicReliance(value: string): value is "SUPERSEDED_RECORD_PUBLIC_RELIANCE" {
  return value === "SUPERSEDED_RECORD_PUBLIC_RELIANCE";
}

export const SUPERSEDED_RECORD_PUBLIC_RELIANCE_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.SUPERSEDED_RECORD_PUBLIC_RELIANCE;

export function isChallengedStatusNotVisible(value: string): value is "CHALLENGED_STATUS_NOT_VISIBLE" {
  return value === "CHALLENGED_STATUS_NOT_VISIBLE";
}

export const CHALLENGED_STATUS_NOT_VISIBLE_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CHALLENGED_STATUS_NOT_VISIBLE;

export function isCorrectedStatusNotVisible(value: string): value is "CORRECTED_STATUS_NOT_VISIBLE" {
  return value === "CORRECTED_STATUS_NOT_VISIBLE";
}

export const CORRECTED_STATUS_NOT_VISIBLE_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.CORRECTED_STATUS_NOT_VISIBLE;

export function isRegistrationCommitFailed(value: string): value is "REGISTRATION_COMMIT_FAILED" {
  return value === "REGISTRATION_COMMIT_FAILED";
}

export const REGISTRATION_COMMIT_FAILED_REGISTRY_DEFINITION = REGISTRY_REASON_DICTIONARY.REGISTRATION_COMMIT_FAILED;

