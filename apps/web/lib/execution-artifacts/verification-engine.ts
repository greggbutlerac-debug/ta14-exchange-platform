/**
 * TA-14 Authority | Execution Artifact Verification & Reliance Engine
 * Version 1.0.0
 *
 * Governing rule: Verification is not certification.
 * This engine records what was checked, what passed, what remains unverified,
 * and the bounded level of reliance supported by the available evidence.
 *
 * No admissible evidence. No admissible execution.
 */

import {
  type CanonicalExecutionArtifact,
  type Determination,
  type ValidationIssue,
  type ValidationSummary,
  stableValidationJson,
  validateCanonicalExecutionArtifact,
} from "./canonical-record-validator";

import {
  type ArtifactRegistryRecord,
  type RegistryIssue,
  stableRegistryRecordJson,
  verifyRegistryRecord,
} from "./artifact-registry-engine";

import {
  type DisclosurePackage,
  type DisclosureIssue,
  type DisclosureView,
  stableDisclosureManifestJson,
  stableDisclosureProjectionJson,
  verifyDisclosurePackage,
} from "./disclosure-policy-engine";

export const TA14_VERIFICATION_ENGINE_VERSION = "1.0.0" as const;
export const TA14_VERIFICATION_POLICY_VERSION = "1.0" as const;
export const TA14_VERIFICATION_RULE = "VERIFY THE RECORD; BOUND THE RELIANCE" as const;

export type VerificationLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type VerificationDisposition = "VERIFIED" | "PARTIALLY_VERIFIED" | "HOLD" | "ESCALATE" | "REJECTED";
export type VerificationCheckResult = "PASS" | "HOLD" | "FAIL" | "ESCALATE" | "NOT_APPLICABLE" | "NOT_TESTED";
export type VerificationReasonDisposition = "PASS" | "HOLD" | "DENY" | "ESCALATE";
export type RelianceBand = "NONE" | "DECLARED_ONLY" | "LIMITED" | "MODERATE" | "SUBSTANTIAL" | "INDEPENDENTLY_REVIEWED";
export type RelianceUse = "DISCOVERY" | "INTERNAL_REVIEW" | "PROCUREMENT" | "CONTRACTING" | "AUDIT" | "REGULATORY" | "RESEARCH" | "LITIGATION_SUPPORT";
export type VerificationDomain = "Request" | "Identity" | "Governance" | "Canonical" | "Registry" | "Integrity" | "Disclosure" | "Claims" | "Signature" | "Parity" | "Replay" | "Execution" | "Outcome" | "Review" | "Challenge" | "Verification" | "Reliance";

export interface VerificationHashInput {
  algorithm: "SHA-256" | "SHA-384" | "SHA-512" | "OTHER";
  value: string;
  computedValue?: string;
  source: string;
  verifiedAt?: string;
}

export interface SignatureEnvelope {
  signatureId: string;
  algorithm: string;
  signerId: string;
  signerRole: string;
  keyId: string;
  signedAt: string;
  expiresAt?: string;
  payloadHash: string;
  signature: string;
  trustPolicyId: string;
  trusted: boolean;
  valid: boolean;
  verificationMessage?: string;
}

export interface ParityComponent {
  componentId: string;
  kind: "CANONICAL_JSON" | "PDF" | "MANIFEST" | "ROUTE_SNAPSHOT" | "EXECUTION_RECEIPT" | "OUTCOME_RECORD" | "DISCLOSURE_PROJECTION" | "OTHER";
  expectedHash?: string;
  observedHash?: string;
  artifactId: string;
  registryId: string;
  version: string;
  available: boolean;
  parity: boolean;
  notes?: string;
}

export interface ReplayEvidence {
  replayId: string;
  performedAt: string;
  performedBy: string;
  environmentId: string;
  environmentHash: string;
  routeId: string;
  routeVersion: string;
  expectedDetermination: Determination;
  observedDetermination: Determination;
  consistent: boolean;
  permitted: boolean;
  notes?: string;
}

export interface ExecutionReceiptEvidence {
  receiptId: string;
  artifactId: string;
  registryId: string;
  adapterId: string;
  command: string;
  statusCode: number;
  attemptedAction: string;
  target: string;
  scope: string;
  result: string;
  determination: Determination;
  tokenState: string;
  bypassAttempts: readonly string[];
  rollbackState: string;
  issuedAt: string;
  hash: string;
  signatureId?: string;
  authentic: boolean;
}

export interface OutcomeClosureEvidence {
  outcomeEvidenceId: string;
  artifactId: string;
  registryId: string;
  actualResult: string;
  consequenceState: string;
  verifierId: string;
  verifiedAt: string;
  evidenceHashes: readonly string[];
  residualRisk: string;
  followUp: string;
  receiptConsistent: boolean;
  independentlyCorroborated: boolean;
  valid: boolean;
}

export interface IndependentReviewEvidence {
  reviewId: string;
  reviewerId: string;
  reviewerOrganization: string;
  reviewerQualifications: readonly string[];
  scope: readonly string[];
  performedAt: string;
  opinion: "SUPPORTED" | "SUPPORTED_WITH_LIMITATIONS" | "NOT_SUPPORTED" | "INCONCLUSIVE";
  limitations: readonly string[];
  reportHash: string;
  signatureId?: string;
  valid: boolean;
}

export interface RelianceContext {
  intendedUse: RelianceUse;
  relyingPartyId: string;
  relyingPartyRole: string;
  requestedScope: readonly string[];
  requestedLevel: VerificationLevel;
  jurisdiction?: string;
  decisionDeadline?: string;
  humanReviewAvailable: boolean;
  acknowledgesClaimsBoundary: boolean;
  acknowledgesVerificationLimits: boolean;
}

export interface VerificationRequest {
  requestId: string;
  requestedAt: string;
  verifierId: string;
  verifierVersion: string;
  artifact: CanonicalExecutionArtifact;
  registryRecord: ArtifactRegistryRecord;
  disclosurePackage?: DisclosurePackage;
  requestedLevel: VerificationLevel;
  relianceContext: RelianceContext;
  canonicalHash?: VerificationHashInput;
  packageHash?: VerificationHashInput;
  manifestHash?: VerificationHashInput;
  pdfHash?: VerificationHashInput;
  signatures?: readonly SignatureEnvelope[];
  parityComponents?: readonly ParityComponent[];
  replayEvidence?: ReplayEvidence;
  executionReceipt?: ExecutionReceiptEvidence;
  outcomeEvidence?: OutcomeClosureEvidence;
  independentReview?: IndependentReviewEvidence;
  now?: string;
  requirePublishedRegistryRecord?: boolean;
  requireDisclosurePackage?: boolean;
}

export interface VerificationReasonDefinition {
  code: VerificationReasonCode;
  domain: VerificationDomain;
  disposition: VerificationReasonDisposition;
  title: string;
  description: string;
  publicMessage: string;
  repairable: boolean;
  minimumAffectedLevel: VerificationLevel;
}

export interface VerificationIssue {
  code: VerificationReasonCode;
  domain: VerificationDomain;
  disposition: VerificationReasonDisposition;
  path: string;
  message: string;
  repair?: string;
  minimumAffectedLevel: VerificationLevel;
  details?: Record<string, unknown>;
}

export interface VerificationControlDefinition {
  controlId: string;
  domain: string;
  title: string;
  requirement: string;
  minimumLevel: VerificationLevel;
}

export interface VerificationControlEvaluation {
  controlId: string;
  result: VerificationCheckResult;
  message: string;
  issueCodes: readonly VerificationReasonCode[];
  evidenceReferences: readonly string[];
}

export interface VerificationLevelResult {
  level: VerificationLevel;
  name: string;
  achieved: boolean;
  status: VerificationCheckResult;
  checkedAt: string;
  controls: readonly string[];
  issueCodes: readonly VerificationReasonCode[];
  evidenceReferences: readonly string[];
  statement: string;
}

export interface RelianceAssessment {
  band: RelianceBand;
  score: number;
  permittedUses: readonly RelianceUse[];
  prohibitedUses: readonly RelianceUse[];
  conditions: readonly string[];
  relianceStatement: string;
  claimsBoundary: readonly string[];
  verificationLimits: readonly string[];
  expiresAt?: string;
}

export interface VerificationCertificate {
  certificateId: string;
  artifactId: string;
  registryId: string;
  governanceRegistrationId: string;
  verificationId: string;
  achievedLevel: VerificationLevel;
  requestedLevel: VerificationLevel;
  disposition: VerificationDisposition;
  issuedAt: string;
  verifierId: string;
  verifierVersion: string;
  canonicalHash: string;
  packageHash: string;
  manifestHash: string;
  pdfHash?: string;
  registryRecordHash: string;
  disclosureProjectionHash?: string;
  relianceBand: RelianceBand;
  certificateHash: string;
  statement: string;
}

export interface VerificationTimelineEvent {
  eventId: string;
  occurredAt: string;
  actorId: string;
  eventType: string;
  summary: string;
  artifactId: string;
  registryId: string;
  previousHash?: string;
  eventHash: string;
}

export interface VerificationManifest {
  verificationId: string;
  artifactId: string;
  registryId: string;
  governanceRegistrationId: string;
  requestedLevel: VerificationLevel;
  achievedLevel: VerificationLevel;
  componentHashes: Readonly<Record<string, string>>;
  levelResults: readonly VerificationLevelResult[];
  issueCodes: readonly VerificationReasonCode[];
  generatedAt: string;
  engineVersion: string;
  policyVersion: string;
  manifestHash: string;
}

export interface VerificationReport {
  verificationId: string;
  requestId: string;
  artifactId: string;
  registryId: string;
  governanceRegistrationId: string;
  disposition: VerificationDisposition;
  requestedLevel: VerificationLevel;
  achievedLevel: VerificationLevel;
  evaluatedAt: string;
  canonicalValidation: ValidationSummary;
  registryIssues: readonly RegistryIssue[];
  disclosureIssues: readonly DisclosureIssue[];
  issues: readonly VerificationIssue[];
  controls: readonly VerificationControlEvaluation[];
  levels: readonly VerificationLevelResult[];
  reliance: RelianceAssessment;
  certificate: VerificationCertificate;
  manifest: VerificationManifest;
  timeline: readonly VerificationTimelineEvent[];
  stableJson: string;
}

export interface VerificationPackage {
  report: VerificationReport;
  certificate: VerificationCertificate;
  manifest: VerificationManifest;
  reportJson: string;
  certificateJson: string;
  manifestJson: string;
  packageHash: string;
}
export type VerificationReasonCode =
  | "REQUEST_MISSING"
  | "ARTIFACT_ID_MISMATCH"
  | "REGISTRY_ID_MISMATCH"
  | "GOVERNANCE_REGISTRATION_MISMATCH"
  | "GOVERNANCE_NOT_REGISTERED"
  | "REGISTRY_RECORD_INVALID"
  | "REGISTRY_NOT_PUBLISHED"
  | "REGISTRY_WITHDRAWN"
  | "REGISTRY_SUPERSEDED"
  | "CANONICAL_RECORD_INVALID"
  | "CANONICAL_HASH_MISSING"
  | "CANONICAL_HASH_MISMATCH"
  | "PACKAGE_HASH_MISSING"
  | "PACKAGE_HASH_MISMATCH"
  | "MANIFEST_HASH_MISSING"
  | "MANIFEST_HASH_MISMATCH"
  | "PDF_HASH_MISSING"
  | "PDF_HASH_MISMATCH"
  | "DISCLOSURE_PACKAGE_MISSING"
  | "DISCLOSURE_PACKAGE_INVALID"
  | "DISCLOSURE_VIEW_MISMATCH"
  | "PROJECTION_HASH_MISMATCH"
  | "REDACTION_MANIFEST_MISMATCH"
  | "CLAIMS_BOUNDARY_MISSING"
  | "CLAIMS_BOUNDARY_OVERSTATED"
  | "SIGNATURE_REQUIRED"
  | "SIGNATURE_MISSING"
  | "SIGNATURE_INVALID"
  | "SIGNING_KEY_UNTRUSTED"
  | "SIGNATURE_EXPIRED"
  | "RECORD_PARITY_MISSING"
  | "JSON_PARITY_FAILURE"
  | "PDF_PARITY_FAILURE"
  | "ROUTE_PARITY_FAILURE"
  | "MANIFEST_PARITY_FAILURE"
  | "RECEIPT_PARITY_FAILURE"
  | "REPLAY_REQUIRED"
  | "REPLAY_MISSING"
  | "REPLAY_INCONSISTENT"
  | "REPLAY_ENVIRONMENT_MISMATCH"
  | "EXECUTION_RECEIPT_REQUIRED"
  | "EXECUTION_RECEIPT_MISSING"
  | "EXECUTION_RECEIPT_INVALID"
  | "EXECUTION_EFFECT_MISMATCH"
  | "BYPASS_ATTEMPT_UNRESOLVED"
  | "TOKEN_STATE_UNVERIFIED"
  | "OUTCOME_REQUIRED"
  | "OUTCOME_EVIDENCE_MISSING"
  | "OUTCOME_EVIDENCE_INVALID"
  | "OUTCOME_CONTRADICTS_RECEIPT"
  | "RESIDUAL_RISK_UNSTATED"
  | "INDEPENDENT_REVIEW_REQUIRED"
  | "INDEPENDENT_REVIEW_MISSING"
  | "INDEPENDENT_REVIEW_INVALID"
  | "REVIEWER_UNQUALIFIED"
  | "REVIEW_SCOPE_MISMATCH"
  | "OPEN_CHALLENGE"
  | "UPHELD_CHALLENGE"
  | "CORRECTION_UNVERIFIED"
  | "AMENDMENT_CHAIN_BROKEN"
  | "WITHDRAWAL_UNDISCLOSED"
  | "VERIFICATION_LEVEL_UNSUPPORTED"
  | "VERIFICATION_LEVEL_NOT_ACHIEVED"
  | "VERIFICATION_INPUT_STALE"
  | "VERIFIER_IDENTITY_MISSING"
  | "VERIFIER_VERSION_MISSING"
  | "VERIFICATION_TIME_INVALID"
  | "RELIANCE_CONTEXT_MISSING"
  | "RELIANCE_SCOPE_EXCEEDED"
  | "RELIANCE_PROHIBITED"
  | "RELIANCE_REQUIRES_HUMAN_REVIEW"
  | "VERIFICATION_COMPLETE";

export const VERIFICATION_REASON_DICTIONARY: Readonly<Record<VerificationReasonCode, VerificationReasonDefinition>> = Object.freeze({
  REQUEST_MISSING: Object.freeze({ code: "REQUEST_MISSING", domain: "Request", disposition: "DENY", title: "Request Missing", description: "Verification request is missing or incomplete.", publicMessage: "Verification request is missing or incomplete.", repairable: false, minimumAffectedLevel: 0 }),
  ARTIFACT_ID_MISMATCH: Object.freeze({ code: "ARTIFACT_ID_MISMATCH", domain: "Identity", disposition: "DENY", title: "Artifact Id Mismatch", description: "Artifact identifiers do not agree across supplied records.", publicMessage: "Artifact identifiers do not agree across supplied records.", repairable: false, minimumAffectedLevel: 0 }),
  REGISTRY_ID_MISMATCH: Object.freeze({ code: "REGISTRY_ID_MISMATCH", domain: "Identity", disposition: "DENY", title: "Registry Id Mismatch", description: "Registry identifiers do not agree across supplied records.", publicMessage: "Registry identifiers do not agree across supplied records.", repairable: false, minimumAffectedLevel: 0 }),
  GOVERNANCE_REGISTRATION_MISMATCH: Object.freeze({ code: "GOVERNANCE_REGISTRATION_MISMATCH", domain: "Governance", disposition: "DENY", title: "Governance Registration Mismatch", description: "Governance registration identifiers do not agree.", publicMessage: "Governance registration identifiers do not agree.", repairable: false, minimumAffectedLevel: 0 }),
  GOVERNANCE_NOT_REGISTERED: Object.freeze({ code: "GOVERNANCE_NOT_REGISTERED", domain: "Governance", disposition: "DENY", title: "Governance Not Registered", description: "The artifact is not linked to an active registered governance.", publicMessage: "The artifact is not linked to an active registered governance.", repairable: false, minimumAffectedLevel: 0 }),
  REGISTRY_RECORD_INVALID: Object.freeze({ code: "REGISTRY_RECORD_INVALID", domain: "Registry", disposition: "DENY", title: "Registry Record Invalid", description: "The registry record failed integrity verification.", publicMessage: "The registry record failed integrity verification.", repairable: false, minimumAffectedLevel: 0 }),
  REGISTRY_NOT_PUBLISHED: Object.freeze({ code: "REGISTRY_NOT_PUBLISHED", domain: "Registry", disposition: "HOLD", title: "Registry Not Published", description: "The registry record is not in a publicly relied-upon state.", publicMessage: "The registry record is not in a publicly relied-upon state.", repairable: true, minimumAffectedLevel: 0 }),
  REGISTRY_WITHDRAWN: Object.freeze({ code: "REGISTRY_WITHDRAWN", domain: "Registry", disposition: "DENY", title: "Registry Withdrawn", description: "The registry record has been withdrawn.", publicMessage: "The registry record has been withdrawn.", repairable: false, minimumAffectedLevel: 0 }),
  REGISTRY_SUPERSEDED: Object.freeze({ code: "REGISTRY_SUPERSEDED", domain: "Registry", disposition: "HOLD", title: "Registry Superseded", description: "The registry record has been superseded for prospective reliance.", publicMessage: "The registry record has been superseded for prospective reliance.", repairable: true, minimumAffectedLevel: 0 }),
  CANONICAL_RECORD_INVALID: Object.freeze({ code: "CANONICAL_RECORD_INVALID", domain: "Canonical", disposition: "DENY", title: "Canonical Record Invalid", description: "The canonical record failed deterministic validation.", publicMessage: "The canonical record failed deterministic validation.", repairable: false, minimumAffectedLevel: 0 }),
  CANONICAL_HASH_MISSING: Object.freeze({ code: "CANONICAL_HASH_MISSING", domain: "Integrity", disposition: "HOLD", title: "Canonical Hash Missing", description: "The canonical record hash is missing.", publicMessage: "The canonical record hash is missing.", repairable: true, minimumAffectedLevel: 1 }),
  CANONICAL_HASH_MISMATCH: Object.freeze({ code: "CANONICAL_HASH_MISMATCH", domain: "Integrity", disposition: "DENY", title: "Canonical Hash Mismatch", description: "The canonical record hash does not match the registered commitment.", publicMessage: "The canonical record hash does not match the registered commitment.", repairable: false, minimumAffectedLevel: 1 }),
  PACKAGE_HASH_MISSING: Object.freeze({ code: "PACKAGE_HASH_MISSING", domain: "Integrity", disposition: "HOLD", title: "Package Hash Missing", description: "The package root hash is missing.", publicMessage: "The package root hash is missing.", repairable: true, minimumAffectedLevel: 1 }),
  PACKAGE_HASH_MISMATCH: Object.freeze({ code: "PACKAGE_HASH_MISMATCH", domain: "Integrity", disposition: "DENY", title: "Package Hash Mismatch", description: "The package root hash does not match the registry record.", publicMessage: "The package root hash does not match the registry record.", repairable: false, minimumAffectedLevel: 1 }),
  MANIFEST_HASH_MISSING: Object.freeze({ code: "MANIFEST_HASH_MISSING", domain: "Integrity", disposition: "HOLD", title: "Manifest Hash Missing", description: "The manifest hash is missing.", publicMessage: "The manifest hash is missing.", repairable: true, minimumAffectedLevel: 1 }),
  MANIFEST_HASH_MISMATCH: Object.freeze({ code: "MANIFEST_HASH_MISMATCH", domain: "Integrity", disposition: "DENY", title: "Manifest Hash Mismatch", description: "The manifest hash does not match the registry record.", publicMessage: "The manifest hash does not match the registry record.", repairable: false, minimumAffectedLevel: 1 }),
  PDF_HASH_MISSING: Object.freeze({ code: "PDF_HASH_MISSING", domain: "Integrity", disposition: "HOLD", title: "Pdf Hash Missing", description: "The PDF hash is missing for the requested verification level.", publicMessage: "The PDF hash is missing for the requested verification level.", repairable: true, minimumAffectedLevel: 1 }),
  PDF_HASH_MISMATCH: Object.freeze({ code: "PDF_HASH_MISMATCH", domain: "Integrity", disposition: "DENY", title: "Pdf Hash Mismatch", description: "The PDF hash does not match the published commitment.", publicMessage: "The PDF hash does not match the published commitment.", repairable: false, minimumAffectedLevel: 1 }),
  DISCLOSURE_PACKAGE_MISSING: Object.freeze({ code: "DISCLOSURE_PACKAGE_MISSING", domain: "Disclosure", disposition: "HOLD", title: "Disclosure Package Missing", description: "A disclosure package is required for this verification lane.", publicMessage: "A disclosure package is required for this verification lane.", repairable: true, minimumAffectedLevel: 3 }),
  DISCLOSURE_PACKAGE_INVALID: Object.freeze({ code: "DISCLOSURE_PACKAGE_INVALID", domain: "Disclosure", disposition: "DENY", title: "Disclosure Package Invalid", description: "The disclosure package failed deterministic verification.", publicMessage: "The disclosure package failed deterministic verification.", repairable: false, minimumAffectedLevel: 3 }),
  DISCLOSURE_VIEW_MISMATCH: Object.freeze({ code: "DISCLOSURE_VIEW_MISMATCH", domain: "Disclosure", disposition: "DENY", title: "Disclosure View Mismatch", description: "The disclosed view does not match the requested verification lane.", publicMessage: "The disclosed view does not match the requested verification lane.", repairable: false, minimumAffectedLevel: 3 }),
  PROJECTION_HASH_MISMATCH: Object.freeze({ code: "PROJECTION_HASH_MISMATCH", domain: "Disclosure", disposition: "DENY", title: "Projection Hash Mismatch", description: "The disclosure projection hash does not match its manifest.", publicMessage: "The disclosure projection hash does not match its manifest.", repairable: false, minimumAffectedLevel: 3 }),
  REDACTION_MANIFEST_MISMATCH: Object.freeze({ code: "REDACTION_MANIFEST_MISMATCH", domain: "Disclosure", disposition: "DENY", title: "Redaction Manifest Mismatch", description: "The redaction manifest does not match the supplied projection.", publicMessage: "The redaction manifest does not match the supplied projection.", repairable: false, minimumAffectedLevel: 3 }),
  CLAIMS_BOUNDARY_MISSING: Object.freeze({ code: "CLAIMS_BOUNDARY_MISSING", domain: "Claims", disposition: "HOLD", title: "Claims Boundary Missing", description: "The artifact does not state a bounded claims boundary.", publicMessage: "The artifact does not state a bounded claims boundary.", repairable: true, minimumAffectedLevel: 3 }),
  CLAIMS_BOUNDARY_OVERSTATED: Object.freeze({ code: "CLAIMS_BOUNDARY_OVERSTATED", domain: "Claims", disposition: "DENY", title: "Claims Boundary Overstated", description: "The public claim exceeds the verified evidence.", publicMessage: "The public claim exceeds the verified evidence.", repairable: false, minimumAffectedLevel: 3 }),
  SIGNATURE_REQUIRED: Object.freeze({ code: "SIGNATURE_REQUIRED", domain: "Signature", disposition: "HOLD", title: "Signature Required", description: "A digital signature is required for the requested level.", publicMessage: "A digital signature is required for the requested level.", repairable: true, minimumAffectedLevel: 2 }),
  SIGNATURE_MISSING: Object.freeze({ code: "SIGNATURE_MISSING", domain: "Signature", disposition: "HOLD", title: "Signature Missing", description: "No signature envelope was supplied.", publicMessage: "No signature envelope was supplied.", repairable: true, minimumAffectedLevel: 2 }),
  SIGNATURE_INVALID: Object.freeze({ code: "SIGNATURE_INVALID", domain: "Signature", disposition: "DENY", title: "Signature Invalid", description: "The supplied signature did not validate.", publicMessage: "The supplied signature did not validate.", repairable: false, minimumAffectedLevel: 2 }),
  SIGNING_KEY_UNTRUSTED: Object.freeze({ code: "SIGNING_KEY_UNTRUSTED", domain: "Signature", disposition: "DENY", title: "Signing Key Untrusted", description: "The signing key is not trusted under the stated policy.", publicMessage: "The signing key is not trusted under the stated policy.", repairable: false, minimumAffectedLevel: 2 }),
  SIGNATURE_EXPIRED: Object.freeze({ code: "SIGNATURE_EXPIRED", domain: "Signature", disposition: "HOLD", title: "Signature Expired", description: "The signature or signing credential has expired.", publicMessage: "The signature or signing credential has expired.", repairable: true, minimumAffectedLevel: 2 }),
  RECORD_PARITY_MISSING: Object.freeze({ code: "RECORD_PARITY_MISSING", domain: "Parity", disposition: "HOLD", title: "Record Parity Missing", description: "Required parity components are missing.", publicMessage: "Required parity components are missing.", repairable: true, minimumAffectedLevel: 3 }),
  JSON_PARITY_FAILURE: Object.freeze({ code: "JSON_PARITY_FAILURE", domain: "Parity", disposition: "DENY", title: "Json Parity Failure", description: "Canonical JSON does not resolve to the same frozen record.", publicMessage: "Canonical JSON does not resolve to the same frozen record.", repairable: false, minimumAffectedLevel: 3 }),
  PDF_PARITY_FAILURE: Object.freeze({ code: "PDF_PARITY_FAILURE", domain: "Parity", disposition: "DENY", title: "Pdf Parity Failure", description: "The PDF does not resolve to the same frozen record.", publicMessage: "The PDF does not resolve to the same frozen record.", repairable: false, minimumAffectedLevel: 3 }),
  ROUTE_PARITY_FAILURE: Object.freeze({ code: "ROUTE_PARITY_FAILURE", domain: "Parity", disposition: "DENY", title: "Route Parity Failure", description: "The route snapshot differs from the committed route.", publicMessage: "The route snapshot differs from the committed route.", repairable: false, minimumAffectedLevel: 3 }),
  MANIFEST_PARITY_FAILURE: Object.freeze({ code: "MANIFEST_PARITY_FAILURE", domain: "Parity", disposition: "DENY", title: "Manifest Parity Failure", description: "The package manifest differs from the frozen record.", publicMessage: "The package manifest differs from the frozen record.", repairable: false, minimumAffectedLevel: 3 }),
  RECEIPT_PARITY_FAILURE: Object.freeze({ code: "RECEIPT_PARITY_FAILURE", domain: "Parity", disposition: "DENY", title: "Receipt Parity Failure", description: "The execution receipt differs from the committed determination.", publicMessage: "The execution receipt differs from the committed determination.", repairable: false, minimumAffectedLevel: 3 }),
  REPLAY_REQUIRED: Object.freeze({ code: "REPLAY_REQUIRED", domain: "Replay", disposition: "HOLD", title: "Replay Required", description: "Replay evidence is required for the requested level.", publicMessage: "Replay evidence is required for the requested level.", repairable: true, minimumAffectedLevel: 4 }),
  REPLAY_MISSING: Object.freeze({ code: "REPLAY_MISSING", domain: "Replay", disposition: "HOLD", title: "Replay Missing", description: "No replay result was supplied.", publicMessage: "No replay result was supplied.", repairable: true, minimumAffectedLevel: 4 }),
  REPLAY_INCONSISTENT: Object.freeze({ code: "REPLAY_INCONSISTENT", domain: "Replay", disposition: "DENY", title: "Replay Inconsistent", description: "Permitted replay did not reproduce the committed determination.", publicMessage: "Permitted replay did not reproduce the committed determination.", repairable: false, minimumAffectedLevel: 4 }),
  REPLAY_ENVIRONMENT_MISMATCH: Object.freeze({ code: "REPLAY_ENVIRONMENT_MISMATCH", domain: "Replay", disposition: "HOLD", title: "Replay Environment Mismatch", description: "Replay occurred under a materially different environment.", publicMessage: "Replay occurred under a materially different environment.", repairable: true, minimumAffectedLevel: 4 }),
  EXECUTION_RECEIPT_REQUIRED: Object.freeze({ code: "EXECUTION_RECEIPT_REQUIRED", domain: "Execution", disposition: "HOLD", title: "Execution Receipt Required", description: "An execution receipt is required for the requested level.", publicMessage: "An execution receipt is required for the requested level.", repairable: true, minimumAffectedLevel: 5 }),
  EXECUTION_RECEIPT_MISSING: Object.freeze({ code: "EXECUTION_RECEIPT_MISSING", domain: "Execution", disposition: "HOLD", title: "Execution Receipt Missing", description: "No execution receipt was supplied.", publicMessage: "No execution receipt was supplied.", repairable: true, minimumAffectedLevel: 5 }),
  EXECUTION_RECEIPT_INVALID: Object.freeze({ code: "EXECUTION_RECEIPT_INVALID", domain: "Execution", disposition: "DENY", title: "Execution Receipt Invalid", description: "The execution receipt failed verification.", publicMessage: "The execution receipt failed verification.", repairable: false, minimumAffectedLevel: 5 }),
  EXECUTION_EFFECT_MISMATCH: Object.freeze({ code: "EXECUTION_EFFECT_MISMATCH", domain: "Execution", disposition: "DENY", title: "Execution Effect Mismatch", description: "The technical effect does not match the determination.", publicMessage: "The technical effect does not match the determination.", repairable: false, minimumAffectedLevel: 5 }),
  BYPASS_ATTEMPT_UNRESOLVED: Object.freeze({ code: "BYPASS_ATTEMPT_UNRESOLVED", domain: "Execution", disposition: "DENY", title: "Bypass Attempt Unresolved", description: "A bypass attempt remains unresolved.", publicMessage: "A bypass attempt remains unresolved.", repairable: false, minimumAffectedLevel: 5 }),
  TOKEN_STATE_UNVERIFIED: Object.freeze({ code: "TOKEN_STATE_UNVERIFIED", domain: "Execution", disposition: "HOLD", title: "Token State Unverified", description: "The execution token state could not be verified.", publicMessage: "The execution token state could not be verified.", repairable: true, minimumAffectedLevel: 5 }),
  OUTCOME_REQUIRED: Object.freeze({ code: "OUTCOME_REQUIRED", domain: "Outcome", disposition: "HOLD", title: "Outcome Required", description: "Outcome closure is required for the requested level.", publicMessage: "Outcome closure is required for the requested level.", repairable: true, minimumAffectedLevel: 6 }),
  OUTCOME_EVIDENCE_MISSING: Object.freeze({ code: "OUTCOME_EVIDENCE_MISSING", domain: "Outcome", disposition: "HOLD", title: "Outcome Evidence Missing", description: "Outcome closure evidence is missing.", publicMessage: "Outcome closure evidence is missing.", repairable: true, minimumAffectedLevel: 6 }),
  OUTCOME_EVIDENCE_INVALID: Object.freeze({ code: "OUTCOME_EVIDENCE_INVALID", domain: "Outcome", disposition: "DENY", title: "Outcome Evidence Invalid", description: "Outcome closure evidence failed verification.", publicMessage: "Outcome closure evidence failed verification.", repairable: false, minimumAffectedLevel: 6 }),
  OUTCOME_CONTRADICTS_RECEIPT: Object.freeze({ code: "OUTCOME_CONTRADICTS_RECEIPT", domain: "Outcome", disposition: "DENY", title: "Outcome Contradicts Receipt", description: "The reported outcome contradicts the execution receipt.", publicMessage: "The reported outcome contradicts the execution receipt.", repairable: false, minimumAffectedLevel: 6 }),
  RESIDUAL_RISK_UNSTATED: Object.freeze({ code: "RESIDUAL_RISK_UNSTATED", domain: "Outcome", disposition: "HOLD", title: "Residual Risk Unstated", description: "Residual risk is not stated.", publicMessage: "Residual risk is not stated.", repairable: true, minimumAffectedLevel: 6 }),
  INDEPENDENT_REVIEW_REQUIRED: Object.freeze({ code: "INDEPENDENT_REVIEW_REQUIRED", domain: "Review", disposition: "HOLD", title: "Independent Review Required", description: "Independent review is required for the requested level.", publicMessage: "Independent review is required for the requested level.", repairable: true, minimumAffectedLevel: 7 }),
  INDEPENDENT_REVIEW_MISSING: Object.freeze({ code: "INDEPENDENT_REVIEW_MISSING", domain: "Review", disposition: "HOLD", title: "Independent Review Missing", description: "No independent review was supplied.", publicMessage: "No independent review was supplied.", repairable: true, minimumAffectedLevel: 7 }),
  INDEPENDENT_REVIEW_INVALID: Object.freeze({ code: "INDEPENDENT_REVIEW_INVALID", domain: "Review", disposition: "DENY", title: "Independent Review Invalid", description: "The independent review failed validation.", publicMessage: "The independent review failed validation.", repairable: false, minimumAffectedLevel: 7 }),
  REVIEWER_UNQUALIFIED: Object.freeze({ code: "REVIEWER_UNQUALIFIED", domain: "Review", disposition: "DENY", title: "Reviewer Unqualified", description: "The independent reviewer is not qualified for the claimed scope.", publicMessage: "The independent reviewer is not qualified for the claimed scope.", repairable: false, minimumAffectedLevel: 7 }),
  REVIEW_SCOPE_MISMATCH: Object.freeze({ code: "REVIEW_SCOPE_MISMATCH", domain: "Review", disposition: "DENY", title: "Review Scope Mismatch", description: "The review scope does not cover the claim being relied upon.", publicMessage: "The review scope does not cover the claim being relied upon.", repairable: false, minimumAffectedLevel: 7 }),
  OPEN_CHALLENGE: Object.freeze({ code: "OPEN_CHALLENGE", domain: "Challenge", disposition: "ESCALATE", title: "Open Challenge", description: "A material challenge is open.", publicMessage: "A material challenge is open.", repairable: true, minimumAffectedLevel: 0 }),
  UPHELD_CHALLENGE: Object.freeze({ code: "UPHELD_CHALLENGE", domain: "Challenge", disposition: "HOLD", title: "Upheld Challenge", description: "A challenge was upheld and prospective reliance must be reconsidered.", publicMessage: "A challenge was upheld and prospective reliance must be reconsidered.", repairable: true, minimumAffectedLevel: 0 }),
  CORRECTION_UNVERIFIED: Object.freeze({ code: "CORRECTION_UNVERIFIED", domain: "Challenge", disposition: "HOLD", title: "Correction Unverified", description: "A correction exists but has not been verified.", publicMessage: "A correction exists but has not been verified.", repairable: true, minimumAffectedLevel: 0 }),
  AMENDMENT_CHAIN_BROKEN: Object.freeze({ code: "AMENDMENT_CHAIN_BROKEN", domain: "Challenge", disposition: "DENY", title: "Amendment Chain Broken", description: "The amendment chain is incomplete or inconsistent.", publicMessage: "The amendment chain is incomplete or inconsistent.", repairable: false, minimumAffectedLevel: 0 }),
  WITHDRAWAL_UNDISCLOSED: Object.freeze({ code: "WITHDRAWAL_UNDISCLOSED", domain: "Challenge", disposition: "DENY", title: "Withdrawal Undisclosed", description: "A withdrawal state is not disclosed in the public package.", publicMessage: "A withdrawal state is not disclosed in the public package.", repairable: false, minimumAffectedLevel: 0 }),
  VERIFICATION_LEVEL_UNSUPPORTED: Object.freeze({ code: "VERIFICATION_LEVEL_UNSUPPORTED", domain: "Verification", disposition: "DENY", title: "Verification Level Unsupported", description: "The requested verification level is unsupported.", publicMessage: "The requested verification level is unsupported.", repairable: false, minimumAffectedLevel: 0 }),
  VERIFICATION_LEVEL_NOT_ACHIEVED: Object.freeze({ code: "VERIFICATION_LEVEL_NOT_ACHIEVED", domain: "Verification", disposition: "HOLD", title: "Verification Level Not Achieved", description: "The requested verification level was not achieved.", publicMessage: "The requested verification level was not achieved.", repairable: true, minimumAffectedLevel: 0 }),
  VERIFICATION_INPUT_STALE: Object.freeze({ code: "VERIFICATION_INPUT_STALE", domain: "Verification", disposition: "HOLD", title: "Verification Input Stale", description: "One or more verification inputs are stale.", publicMessage: "One or more verification inputs are stale.", repairable: true, minimumAffectedLevel: 0 }),
  VERIFIER_IDENTITY_MISSING: Object.freeze({ code: "VERIFIER_IDENTITY_MISSING", domain: "Verification", disposition: "HOLD", title: "Verifier Identity Missing", description: "Verifier identity is missing.", publicMessage: "Verifier identity is missing.", repairable: true, minimumAffectedLevel: 0 }),
  VERIFIER_VERSION_MISSING: Object.freeze({ code: "VERIFIER_VERSION_MISSING", domain: "Verification", disposition: "HOLD", title: "Verifier Version Missing", description: "Verifier version is missing.", publicMessage: "Verifier version is missing.", repairable: true, minimumAffectedLevel: 0 }),
  VERIFICATION_TIME_INVALID: Object.freeze({ code: "VERIFICATION_TIME_INVALID", domain: "Verification", disposition: "DENY", title: "Verification Time Invalid", description: "Verification time is invalid.", publicMessage: "Verification time is invalid.", repairable: false, minimumAffectedLevel: 0 }),
  RELIANCE_CONTEXT_MISSING: Object.freeze({ code: "RELIANCE_CONTEXT_MISSING", domain: "Reliance", disposition: "HOLD", title: "Reliance Context Missing", description: "The intended reliance context is missing.", publicMessage: "The intended reliance context is missing.", repairable: true, minimumAffectedLevel: 0 }),
  RELIANCE_SCOPE_EXCEEDED: Object.freeze({ code: "RELIANCE_SCOPE_EXCEEDED", domain: "Reliance", disposition: "DENY", title: "Reliance Scope Exceeded", description: "Requested reliance exceeds the verified scope.", publicMessage: "Requested reliance exceeds the verified scope.", repairable: false, minimumAffectedLevel: 0 }),
  RELIANCE_PROHIBITED: Object.freeze({ code: "RELIANCE_PROHIBITED", domain: "Reliance", disposition: "DENY", title: "Reliance Prohibited", description: "Reliance is prohibited under the current registry state.", publicMessage: "Reliance is prohibited under the current registry state.", repairable: false, minimumAffectedLevel: 0 }),
  RELIANCE_REQUIRES_HUMAN_REVIEW: Object.freeze({ code: "RELIANCE_REQUIRES_HUMAN_REVIEW", domain: "Reliance", disposition: "ESCALATE", title: "Reliance Requires Human Review", description: "Named human review is required before reliance.", publicMessage: "Named human review is required before reliance.", repairable: true, minimumAffectedLevel: 0 }),
  VERIFICATION_COMPLETE: Object.freeze({ code: "VERIFICATION_COMPLETE", domain: "Verification", disposition: "PASS", title: "Verification Complete", description: "Verification completed within the bounded scope.", publicMessage: "Verification completed within the bounded scope.", repairable: true, minimumAffectedLevel: 0 }),
});

export const VERIFICATION_CONTROLS: readonly VerificationControlDefinition[] = Object.freeze([
  Object.freeze({ controlId: "VER-001", domain: "Identity", title: "Identity control 1", requirement: "Verify identity requirement 1 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-002", domain: "Identity", title: "Identity control 2", requirement: "Verify identity requirement 2 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-003", domain: "Identity", title: "Identity control 3", requirement: "Verify identity requirement 3 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-004", domain: "Identity", title: "Identity control 4", requirement: "Verify identity requirement 4 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-005", domain: "Identity", title: "Identity control 5", requirement: "Verify identity requirement 5 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-006", domain: "Identity", title: "Identity control 6", requirement: "Verify identity requirement 6 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-007", domain: "Governance", title: "Governance control 1", requirement: "Verify governance requirement 1 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-008", domain: "Governance", title: "Governance control 2", requirement: "Verify governance requirement 2 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-009", domain: "Governance", title: "Governance control 3", requirement: "Verify governance requirement 3 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-010", domain: "Governance", title: "Governance control 4", requirement: "Verify governance requirement 4 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-011", domain: "Governance", title: "Governance control 5", requirement: "Verify governance requirement 5 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-012", domain: "Governance", title: "Governance control 6", requirement: "Verify governance requirement 6 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-013", domain: "Canonical", title: "Canonical control 1", requirement: "Verify canonical requirement 1 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-014", domain: "Canonical", title: "Canonical control 2", requirement: "Verify canonical requirement 2 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-015", domain: "Canonical", title: "Canonical control 3", requirement: "Verify canonical requirement 3 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-016", domain: "Canonical", title: "Canonical control 4", requirement: "Verify canonical requirement 4 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-017", domain: "Canonical", title: "Canonical control 5", requirement: "Verify canonical requirement 5 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-018", domain: "Canonical", title: "Canonical control 6", requirement: "Verify canonical requirement 6 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-019", domain: "Registry", title: "Registry control 1", requirement: "Verify registry requirement 1 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-020", domain: "Registry", title: "Registry control 2", requirement: "Verify registry requirement 2 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-021", domain: "Registry", title: "Registry control 3", requirement: "Verify registry requirement 3 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-022", domain: "Registry", title: "Registry control 4", requirement: "Verify registry requirement 4 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-023", domain: "Registry", title: "Registry control 5", requirement: "Verify registry requirement 5 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-024", domain: "Registry", title: "Registry control 6", requirement: "Verify registry requirement 6 against the frozen artifact package.", minimumLevel: 0 }),
  Object.freeze({ controlId: "VER-025", domain: "Integrity", title: "Integrity control 1", requirement: "Verify integrity requirement 1 against the frozen artifact package.", minimumLevel: 1 }),
  Object.freeze({ controlId: "VER-026", domain: "Integrity", title: "Integrity control 2", requirement: "Verify integrity requirement 2 against the frozen artifact package.", minimumLevel: 1 }),
  Object.freeze({ controlId: "VER-027", domain: "Integrity", title: "Integrity control 3", requirement: "Verify integrity requirement 3 against the frozen artifact package.", minimumLevel: 1 }),
  Object.freeze({ controlId: "VER-028", domain: "Integrity", title: "Integrity control 4", requirement: "Verify integrity requirement 4 against the frozen artifact package.", minimumLevel: 1 }),
  Object.freeze({ controlId: "VER-029", domain: "Integrity", title: "Integrity control 5", requirement: "Verify integrity requirement 5 against the frozen artifact package.", minimumLevel: 1 }),
  Object.freeze({ controlId: "VER-030", domain: "Integrity", title: "Integrity control 6", requirement: "Verify integrity requirement 6 against the frozen artifact package.", minimumLevel: 1 }),
  Object.freeze({ controlId: "VER-031", domain: "Integrity", title: "Integrity control 7", requirement: "Verify integrity requirement 7 against the frozen artifact package.", minimumLevel: 1 }),
  Object.freeze({ controlId: "VER-032", domain: "Integrity", title: "Integrity control 8", requirement: "Verify integrity requirement 8 against the frozen artifact package.", minimumLevel: 1 }),
  Object.freeze({ controlId: "VER-033", domain: "Disclosure", title: "Disclosure control 1", requirement: "Verify disclosure requirement 1 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-034", domain: "Disclosure", title: "Disclosure control 2", requirement: "Verify disclosure requirement 2 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-035", domain: "Disclosure", title: "Disclosure control 3", requirement: "Verify disclosure requirement 3 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-036", domain: "Disclosure", title: "Disclosure control 4", requirement: "Verify disclosure requirement 4 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-037", domain: "Disclosure", title: "Disclosure control 5", requirement: "Verify disclosure requirement 5 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-038", domain: "Disclosure", title: "Disclosure control 6", requirement: "Verify disclosure requirement 6 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-039", domain: "Signature", title: "Signature control 1", requirement: "Verify signature requirement 1 against the frozen artifact package.", minimumLevel: 2 }),
  Object.freeze({ controlId: "VER-040", domain: "Signature", title: "Signature control 2", requirement: "Verify signature requirement 2 against the frozen artifact package.", minimumLevel: 2 }),
  Object.freeze({ controlId: "VER-041", domain: "Signature", title: "Signature control 3", requirement: "Verify signature requirement 3 against the frozen artifact package.", minimumLevel: 2 }),
  Object.freeze({ controlId: "VER-042", domain: "Signature", title: "Signature control 4", requirement: "Verify signature requirement 4 against the frozen artifact package.", minimumLevel: 2 }),
  Object.freeze({ controlId: "VER-043", domain: "Signature", title: "Signature control 5", requirement: "Verify signature requirement 5 against the frozen artifact package.", minimumLevel: 2 }),
  Object.freeze({ controlId: "VER-044", domain: "Parity", title: "Parity control 1", requirement: "Verify parity requirement 1 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-045", domain: "Parity", title: "Parity control 2", requirement: "Verify parity requirement 2 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-046", domain: "Parity", title: "Parity control 3", requirement: "Verify parity requirement 3 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-047", domain: "Parity", title: "Parity control 4", requirement: "Verify parity requirement 4 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-048", domain: "Parity", title: "Parity control 5", requirement: "Verify parity requirement 5 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-049", domain: "Parity", title: "Parity control 6", requirement: "Verify parity requirement 6 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-050", domain: "Parity", title: "Parity control 7", requirement: "Verify parity requirement 7 against the frozen artifact package.", minimumLevel: 3 }),
  Object.freeze({ controlId: "VER-051", domain: "Replay", title: "Replay control 1", requirement: "Verify replay requirement 1 against the frozen artifact package.", minimumLevel: 4 }),
  Object.freeze({ controlId: "VER-052", domain: "Replay", title: "Replay control 2", requirement: "Verify replay requirement 2 against the frozen artifact package.", minimumLevel: 4 }),
  Object.freeze({ controlId: "VER-053", domain: "Replay", title: "Replay control 3", requirement: "Verify replay requirement 3 against the frozen artifact package.", minimumLevel: 4 }),
  Object.freeze({ controlId: "VER-054", domain: "Replay", title: "Replay control 4", requirement: "Verify replay requirement 4 against the frozen artifact package.", minimumLevel: 4 }),
  Object.freeze({ controlId: "VER-055", domain: "Replay", title: "Replay control 5", requirement: "Verify replay requirement 5 against the frozen artifact package.", minimumLevel: 4 }),
  Object.freeze({ controlId: "VER-056", domain: "Execution", title: "Execution control 1", requirement: "Verify execution requirement 1 against the frozen artifact package.", minimumLevel: 5 }),
  Object.freeze({ controlId: "VER-057", domain: "Execution", title: "Execution control 2", requirement: "Verify execution requirement 2 against the frozen artifact package.", minimumLevel: 5 }),
  Object.freeze({ controlId: "VER-058", domain: "Execution", title: "Execution control 3", requirement: "Verify execution requirement 3 against the frozen artifact package.", minimumLevel: 5 }),
  Object.freeze({ controlId: "VER-059", domain: "Execution", title: "Execution control 4", requirement: "Verify execution requirement 4 against the frozen artifact package.", minimumLevel: 5 }),
  Object.freeze({ controlId: "VER-060", domain: "Execution", title: "Execution control 5", requirement: "Verify execution requirement 5 against the frozen artifact package.", minimumLevel: 5 }),
  Object.freeze({ controlId: "VER-061", domain: "Execution", title: "Execution control 6", requirement: "Verify execution requirement 6 against the frozen artifact package.", minimumLevel: 5 }),
  Object.freeze({ controlId: "VER-062", domain: "Outcome", title: "Outcome control 1", requirement: "Verify outcome requirement 1 against the frozen artifact package.", minimumLevel: 6 }),
  Object.freeze({ controlId: "VER-063", domain: "Outcome", title: "Outcome control 2", requirement: "Verify outcome requirement 2 against the frozen artifact package.", minimumLevel: 6 }),
  Object.freeze({ controlId: "VER-064", domain: "Outcome", title: "Outcome control 3", requirement: "Verify outcome requirement 3 against the frozen artifact package.", minimumLevel: 6 }),
  Object.freeze({ controlId: "VER-065", domain: "Outcome", title: "Outcome control 4", requirement: "Verify outcome requirement 4 against the frozen artifact package.", minimumLevel: 6 }),
  Object.freeze({ controlId: "VER-066", domain: "Outcome", title: "Outcome control 5", requirement: "Verify outcome requirement 5 against the frozen artifact package.", minimumLevel: 6 }),
  Object.freeze({ controlId: "VER-067", domain: "Review", title: "Review control 1", requirement: "Verify review requirement 1 against the frozen artifact package.", minimumLevel: 7 }),
  Object.freeze({ controlId: "VER-068", domain: "Review", title: "Review control 2", requirement: "Verify review requirement 2 against the frozen artifact package.", minimumLevel: 7 }),
  Object.freeze({ controlId: "VER-069", domain: "Review", title: "Review control 3", requirement: "Verify review requirement 3 against the frozen artifact package.", minimumLevel: 7 }),
  Object.freeze({ controlId: "VER-070", domain: "Review", title: "Review control 4", requirement: "Verify review requirement 4 against the frozen artifact package.", minimumLevel: 7 }),
  Object.freeze({ controlId: "VER-071", domain: "Review", title: "Review control 5", requirement: "Verify review requirement 5 against the frozen artifact package.", minimumLevel: 7 }),
  Object.freeze({ controlId: "VER-072", domain: "Review", title: "Review control 6", requirement: "Verify review requirement 6 against the frozen artifact package.", minimumLevel: 7 }),
]);


const LEVEL_NAMES: Readonly<Record<VerificationLevel, string>> = Object.freeze({
  0: "Declared",
  1: "Package integrity",
  2: "Signature validity",
  3: "Record parity",
  4: "Replay consistency",
  5: "Execution effect",
  6: "Outcome closure",
  7: "Independent review",
});

const LEVEL_STATEMENTS: Readonly<Record<VerificationLevel, string>> = Object.freeze({
  0: "The publisher has made an attributable declaration that the artifact exists.",
  1: "The supplied package components match the published integrity commitments.",
  2: "The supplied digital signature validates under the stated signing policy.",
  3: "The canonical record, PDF, manifest, route snapshot, receipts, and disclosed view resolve to one frozen record.",
  4: "A permitted replay reproduced the committed determination under a materially equivalent environment.",
  5: "The technical receipt demonstrates that the committed determination changed what the system could do.",
  6: "Independent closure evidence supports the reported real-world outcome or preserved zero-action state.",
  7: "A qualified independent reviewer published a bounded opinion covering the stated reliance scope.",
});

function iso(value?: string): string {
  const raw = value ?? new Date().toISOString();
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
}

function stable(value: unknown): string {
  const seen = new WeakSet<object>();
  const normalize = (input: unknown): unknown => {
    if (input === null || typeof input !== "object") return input;
    if (seen.has(input as object)) return "[Circular]";
    seen.add(input as object);
    if (Array.isArray(input)) return input.map(normalize);
    const source = input as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) result[key] = normalize(source[key]);
    return result;
  };
  return JSON.stringify(normalize(value));
}

function digest(value: unknown): string {
  const text = typeof value === "string" ? value : stable(value);
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  let h3 = 0x85ebca6b;
  let h4 = 0xc2b2ae35;
  for (let i = 0; i < text.length; i += 1) {
    const c = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ (c + i), 0x27d4eb2d);
    h3 = Math.imul(h3 ^ (c << (i % 8)), 0x165667b1);
    h4 = Math.imul(h4 ^ (c + h1), 0x85ebca77);
  }
  const part = (v: number) => (v >>> 0).toString(16).padStart(8, "0");
  return `${part(h1)}${part(h2)}${part(h3)}${part(h4)}${part(h1 ^ h3)}${part(h2 ^ h4)}${part(h1 ^ h2)}${part(h3 ^ h4)}`;
}

function eqHash(input?: VerificationHashInput): boolean {
  if (!input?.value || !input.computedValue) return false;
  return input.value.trim().toLowerCase() === input.computedValue.trim().toLowerCase();
}

function issue(code: VerificationReasonCode, path: string, message?: string, details?: Record<string, unknown>): VerificationIssue {
  const def = VERIFICATION_REASON_DICTIONARY[code];
  return {
    code,
    domain: def.domain,
    disposition: def.disposition,
    path,
    message: message ?? def.description,
    repair: def.repairable ? `Repair ${path} and rerun verification.` : undefined,
    minimumAffectedLevel: def.minimumAffectedLevel,
    details,
  };
}

function isCurrent(value: string | undefined, now: string): boolean {
  if (!value) return true;
  const t = new Date(value).getTime();
  const n = new Date(now).getTime();
  return Number.isFinite(t) && Number.isFinite(n) && t >= n;
}

function expectedReceiptEffect(determination: Determination): string[] {
  switch (determination) {
    case "ALLOW": return ["release", "released", "allow", "execute", "executed", "restored", "issued"];
    case "HOLD": return ["hold", "held", "locked", "not transmitted", "awaiting"];
    case "DENY": return ["deny", "denied", "reject", "rejected", "revoked", "blocked"];
    case "ESCALATE": return ["escalate", "escalated", "routed", "awaiting review", "held and routed"];
  }
}

function receiptMatches(receipt: ExecutionReceiptEvidence, determination: Determination): boolean {
  const haystack = `${receipt.command} ${receipt.result} ${receipt.tokenState}`.toLowerCase();
  return receipt.determination === determination && expectedReceiptEffect(determination).some((word) => haystack.includes(word));
}

function highestDisposition(issues: readonly VerificationIssue[]): VerificationDisposition {
  if (issues.some((x) => x.disposition === "DENY")) return "REJECTED";
  if (issues.some((x) => x.disposition === "ESCALATE")) return "ESCALATE";
  if (issues.some((x) => x.disposition === "HOLD")) return "HOLD";
  return issues.length ? "PARTIALLY_VERIFIED" : "VERIFIED";
}

function achievedLevelFromIssues(requested: VerificationLevel, issues: readonly VerificationIssue[]): VerificationLevel {
  let achieved: VerificationLevel = requested;
  for (const item of issues) {
    if (item.disposition === "PASS") continue;
    if (item.minimumAffectedLevel <= achieved) achieved = Math.max(0, item.minimumAffectedLevel - 1) as VerificationLevel;
  }
  return achieved;
}

function buildLevelResults(requested: VerificationLevel, achieved: VerificationLevel, issues: readonly VerificationIssue[], now: string): VerificationLevelResult[] {
  const result: VerificationLevelResult[] = [];
  for (let n = 0; n <= 7; n += 1) {
    const level = n as VerificationLevel;
    const relevant = issues.filter((x) => x.minimumAffectedLevel === level);
    const applicable = level <= requested;
    const passed = applicable && level <= achieved && !relevant.some((x) => x.disposition !== "PASS");
    result.push({
      level,
      name: LEVEL_NAMES[level],
      achieved: passed,
      status: !applicable ? "NOT_TESTED" : passed ? "PASS" : relevant.some((x) => x.disposition === "DENY") ? "FAIL" : relevant.some((x) => x.disposition === "ESCALATE") ? "ESCALATE" : "HOLD",
      checkedAt: now,
      controls: VERIFICATION_CONTROLS.filter((x) => x.minimumLevel === level).map((x) => x.controlId),
      issueCodes: relevant.map((x) => x.code),
      evidenceReferences: [],
      statement: passed ? LEVEL_STATEMENTS[level] : `Level ${level} was not fully achieved under the supplied evidence.`,
    });
  }
  return result;
}

function buildControls(requested: VerificationLevel, issues: readonly VerificationIssue[]): VerificationControlEvaluation[] {
  return VERIFICATION_CONTROLS.map((control) => {
    if (control.minimumLevel > requested) return { controlId: control.controlId, result: "NOT_TESTED", message: "Control is above the requested verification level.", issueCodes: [], evidenceReferences: [] };
    const domainIssues = issues.filter((x) => x.domain === control.domain || (control.domain === "Canonical" && x.domain === "Canonical"));
    const result: VerificationCheckResult = domainIssues.some((x) => x.disposition === "DENY") ? "FAIL" : domainIssues.some((x) => x.disposition === "ESCALATE") ? "ESCALATE" : domainIssues.some((x) => x.disposition === "HOLD") ? "HOLD" : "PASS";
    return { controlId: control.controlId, result, message: result === "PASS" ? control.requirement : `Control affected by ${domainIssues.length} issue(s).`, issueCodes: domainIssues.map((x) => x.code), evidenceReferences: [] };
  });
}

function buildReliance(request: VerificationRequest, achieved: VerificationLevel, disposition: VerificationDisposition, issues: readonly VerificationIssue[]): RelianceAssessment {
  const claims = request.disclosurePackage?.projection.claimsBoundary ?? [request.registryRecord.claimsBoundary];
  const limits = request.disclosurePackage?.projection.verificationLimits ?? ["Reliance is limited to the supplied frozen record and verification inputs."];
  let band: RelianceBand = "NONE";
  if (disposition !== "REJECTED") {
    if (achieved === 0) band = "DECLARED_ONLY";
    else if (achieved <= 2) band = "LIMITED";
    else if (achieved <= 4) band = "MODERATE";
    else if (achieved <= 6) band = "SUBSTANTIAL";
    else band = "INDEPENDENTLY_REVIEWED";
  }
  const score = Math.max(0, Math.min(100, Math.round((achieved / 7) * 90 + (disposition === "VERIFIED" ? 10 : 0) - issues.filter((x) => x.disposition !== "PASS").length * 2)));
  const allUses: RelianceUse[] = ["DISCOVERY", "INTERNAL_REVIEW", "PROCUREMENT", "CONTRACTING", "AUDIT", "REGULATORY", "RESEARCH", "LITIGATION_SUPPORT"];
  const permitted = allUses.filter((use) => {
    if (band === "NONE") return false;
    if (use === "DISCOVERY" || use === "INTERNAL_REVIEW" || use === "RESEARCH") return achieved >= 0;
    if (use === "PROCUREMENT" || use === "CONTRACTING") return achieved >= 3;
    if (use === "AUDIT" || use === "REGULATORY") return achieved >= 5;
    if (use === "LITIGATION_SUPPORT") return achieved >= 6;
    return false;
  });
  const prohibited = allUses.filter((x) => !permitted.includes(x));
  const conditions = [
    "Reliance applies only to the artifact version and hashes identified in the certificate.",
    "Registration is not certification.",
    "Verification does not enlarge the artifact's declared claims boundary.",
    ...issues.filter((x) => x.disposition !== "PASS").map((x) => `${x.code}: ${x.message}`),
  ];
  const statement = band === "NONE"
    ? "No affirmative reliance is supported by the supplied verification record."
    : `The supplied evidence supports ${band.toLowerCase().replaceAll("_", " ")} reliance through verification level ${achieved}, subject to the stated claims boundary and limitations.`;
  return { band, score, permittedUses: permitted, prohibitedUses: prohibited, conditions, relianceStatement: statement, claimsBoundary: claims, verificationLimits: limits };
}

function verifyRequest(request: VerificationRequest): { issues: VerificationIssue[]; canonical: ValidationSummary; registryIssues: RegistryIssue[]; disclosureIssues: DisclosureIssue[] } {
  const issues: VerificationIssue[] = [];
  const now = iso(request.now ?? request.requestedAt);
  if (!request.requestId || !request.verifierId || !request.verifierVersion) issues.push(issue("REQUEST_MISSING", "request"));
  if (!Number.isInteger(request.requestedLevel) || request.requestedLevel < 0 || request.requestedLevel > 7) issues.push(issue("VERIFICATION_LEVEL_UNSUPPORTED", "requestedLevel"));
  if (request.artifact.identity.artifactId !== request.registryRecord.artifactId) issues.push(issue("ARTIFACT_ID_MISMATCH", "artifact.identity.artifactId"));
  if (request.registryRecord.governanceRegistrationId !== request.disclosurePackage?.projection.governanceRegistrationId && request.disclosurePackage) issues.push(issue("GOVERNANCE_REGISTRATION_MISMATCH", "disclosurePackage.projection.governanceRegistrationId"));
  const canonical = validateCanonicalExecutionArtifact(request.artifact, { intendedUse: "VERIFICATION", strict: true, now });
  if (!canonical.valid) issues.push(issue("CANONICAL_RECORD_INVALID", "artifact", `Canonical validator reported ${canonical.issueCount} issue(s).`));
  const registryIssues = verifyRegistryRecord(request.registryRecord);
  if (registryIssues.length) issues.push(issue("REGISTRY_RECORD_INVALID", "registryRecord", `Registry verification reported ${registryIssues.length} issue(s).`));
  if (request.requirePublishedRegistryRecord !== false && request.registryRecord.publicationState !== "PUBLISHED") issues.push(issue("REGISTRY_NOT_PUBLISHED", "registryRecord.publicationState"));
  if (request.registryRecord.publicationState === "WITHDRAWN") issues.push(issue("REGISTRY_WITHDRAWN", "registryRecord.publicationState"));
  if (request.registryRecord.publicationState === "SUPERSEDED") issues.push(issue("REGISTRY_SUPERSEDED", "registryRecord.publicationState"));

  if (!request.canonicalHash?.value) issues.push(issue("CANONICAL_HASH_MISSING", "canonicalHash"));
  else if (!eqHash(request.canonicalHash) || request.canonicalHash.value.toLowerCase() !== request.registryRecord.canonicalHash.toLowerCase()) issues.push(issue("CANONICAL_HASH_MISMATCH", "canonicalHash"));
  if (!request.packageHash?.value) issues.push(issue("PACKAGE_HASH_MISSING", "packageHash"));
  else if (!eqHash(request.packageHash) || request.packageHash.value.toLowerCase() !== request.registryRecord.packageHash.toLowerCase()) issues.push(issue("PACKAGE_HASH_MISMATCH", "packageHash"));
  if (!request.manifestHash?.value) issues.push(issue("MANIFEST_HASH_MISSING", "manifestHash"));
  else if (!eqHash(request.manifestHash) || request.manifestHash.value.toLowerCase() !== request.registryRecord.manifestHash.toLowerCase()) issues.push(issue("MANIFEST_HASH_MISMATCH", "manifestHash"));
  if (request.requestedLevel >= 1 && request.registryRecord.pdfHash) {
    if (!request.pdfHash?.value) issues.push(issue("PDF_HASH_MISSING", "pdfHash"));
    else if (!eqHash(request.pdfHash) || request.pdfHash.value.toLowerCase() !== request.registryRecord.pdfHash.toLowerCase()) issues.push(issue("PDF_HASH_MISMATCH", "pdfHash"));
  }

  let disclosureIssues: DisclosureIssue[] = [];
  if (request.requireDisclosurePackage || request.disclosurePackage) {
    if (!request.disclosurePackage) issues.push(issue("DISCLOSURE_PACKAGE_MISSING", "disclosurePackage"));
    else {
      disclosureIssues = verifyDisclosurePackage(request.disclosurePackage);
      if (disclosureIssues.length) issues.push(issue("DISCLOSURE_PACKAGE_INVALID", "disclosurePackage", `Disclosure verification reported ${disclosureIssues.length} issue(s).`));
      if (request.disclosurePackage.projection.artifactId !== request.artifact.identity.artifactId) issues.push(issue("ARTIFACT_ID_MISMATCH", "disclosurePackage.projection.artifactId"));
      if (request.disclosurePackage.projection.registryId !== request.registryRecord.registryId) issues.push(issue("REGISTRY_ID_MISMATCH", "disclosurePackage.projection.registryId"));
      if (!request.disclosurePackage.projection.claimsBoundary.length) issues.push(issue("CLAIMS_BOUNDARY_MISSING", "disclosurePackage.projection.claimsBoundary"));
    }
  }

  if (!request.relianceContext?.intendedUse || !request.relianceContext.relyingPartyId) issues.push(issue("RELIANCE_CONTEXT_MISSING", "relianceContext"));
  if (!request.relianceContext.acknowledgesClaimsBoundary || !request.relianceContext.acknowledgesVerificationLimits) issues.push(issue("RELIANCE_SCOPE_EXCEEDED", "relianceContext"));
  if (request.registryRecord.relianceStatus === "NO_PUBLIC_RELIANCE" || request.registryRecord.relianceStatus === "PROSPECTIVE_RELIANCE_ENDED") issues.push(issue("RELIANCE_PROHIBITED", "registryRecord.relianceStatus"));

  if (request.requestedLevel >= 2) {
    const signatures = request.signatures ?? [];
    if (!signatures.length) issues.push(issue("SIGNATURE_MISSING", "signatures"));
    else {
      for (const [index, sig] of signatures.entries()) {
        if (!sig.valid) issues.push(issue("SIGNATURE_INVALID", `signatures.${index}`));
        if (!sig.trusted) issues.push(issue("SIGNING_KEY_UNTRUSTED", `signatures.${index}.trusted`));
        if (!isCurrent(sig.expiresAt, now)) issues.push(issue("SIGNATURE_EXPIRED", `signatures.${index}.expiresAt`));
      }
    }
  }

  if (request.requestedLevel >= 3) {
    const components = request.parityComponents ?? [];
    const requiredKinds: ParityComponent["kind"][] = ["CANONICAL_JSON", "PDF", "MANIFEST", "ROUTE_SNAPSHOT", "EXECUTION_RECEIPT"];
    for (const kind of requiredKinds) {
      const found = components.find((x) => x.kind === kind);
      if (!found?.available) issues.push(issue("RECORD_PARITY_MISSING", `parityComponents.${kind}`));
      else if (!found.parity) {
        const code: VerificationReasonCode = kind === "PDF" ? "PDF_PARITY_FAILURE" : kind === "ROUTE_SNAPSHOT" ? "ROUTE_PARITY_FAILURE" : kind === "MANIFEST" ? "MANIFEST_PARITY_FAILURE" : kind === "EXECUTION_RECEIPT" ? "RECEIPT_PARITY_FAILURE" : "JSON_PARITY_FAILURE";
        issues.push(issue(code, `parityComponents.${kind}`));
      }
    }
  }

  if (request.requestedLevel >= 4) {
    if (!request.replayEvidence) issues.push(issue("REPLAY_MISSING", "replayEvidence"));
    else {
      if (!request.replayEvidence.permitted) issues.push(issue("REPLAY_ENVIRONMENT_MISMATCH", "replayEvidence.permitted"));
      if (!request.replayEvidence.consistent || request.replayEvidence.expectedDetermination !== request.replayEvidence.observedDetermination) issues.push(issue("REPLAY_INCONSISTENT", "replayEvidence"));
      if (request.replayEvidence.routeId !== request.artifact.route.routeId || request.replayEvidence.routeVersion !== request.artifact.route.version) issues.push(issue("REPLAY_ENVIRONMENT_MISMATCH", "replayEvidence.route"));
    }
  }

  if (request.requestedLevel >= 5) {
    if (!request.executionReceipt) issues.push(issue("EXECUTION_RECEIPT_MISSING", "executionReceipt"));
    else {
      if (!request.executionReceipt.authentic) issues.push(issue("EXECUTION_RECEIPT_INVALID", "executionReceipt.authentic"));
      if (!receiptMatches(request.executionReceipt, request.artifact.commit.determination)) issues.push(issue("EXECUTION_EFFECT_MISMATCH", "executionReceipt"));
      if (request.executionReceipt.bypassAttempts.length && !request.executionReceipt.result.toLowerCase().includes("blocked")) issues.push(issue("BYPASS_ATTEMPT_UNRESOLVED", "executionReceipt.bypassAttempts"));
    }
  }

  if (request.requestedLevel >= 6) {
    if (!request.outcomeEvidence) issues.push(issue("OUTCOME_EVIDENCE_MISSING", "outcomeEvidence"));
    else {
      if (!request.outcomeEvidence.valid) issues.push(issue("OUTCOME_EVIDENCE_INVALID", "outcomeEvidence.valid"));
      if (!request.outcomeEvidence.receiptConsistent) issues.push(issue("OUTCOME_CONTRADICTS_RECEIPT", "outcomeEvidence.receiptConsistent"));
      if (!request.outcomeEvidence.residualRisk.trim()) issues.push(issue("RESIDUAL_RISK_UNSTATED", "outcomeEvidence.residualRisk"));
    }
  }

  if (request.requestedLevel >= 7) {
    if (!request.independentReview) issues.push(issue("INDEPENDENT_REVIEW_MISSING", "independentReview"));
    else {
      if (!request.independentReview.valid || request.independentReview.opinion === "NOT_SUPPORTED") issues.push(issue("INDEPENDENT_REVIEW_INVALID", "independentReview"));
      if (!request.independentReview.reviewerQualifications.length) issues.push(issue("REVIEWER_UNQUALIFIED", "independentReview.reviewerQualifications"));
      if (!request.independentReview.scope.length) issues.push(issue("REVIEW_SCOPE_MISMATCH", "independentReview.scope"));
    }
  }

  if (request.registryRecord.challenges.some((x) => x.status === "PENDING" || x.status === "UNDER_REVIEW")) issues.push(issue("OPEN_CHALLENGE", "registryRecord.challenges"));
  if (request.registryRecord.corrections.some((x) => !x.amendmentHash)) issues.push(issue("CORRECTION_UNVERIFIED", "registryRecord.corrections"));
  return { issues, canonical, registryIssues, disclosureIssues };
}

export function evaluateVerification(request: VerificationRequest): VerificationReport {
  const now = iso(request.now ?? request.requestedAt);
  const verificationId = `VER-${request.registryRecord.registryId}-${digest(`${request.requestId}:${now}`).slice(0, 16)}`;
  const checked = verifyRequest(request);
  const disposition = highestDisposition(checked.issues);
  const achievedLevel = achievedLevelFromIssues(request.requestedLevel, checked.issues);
  if (achievedLevel < request.requestedLevel && !checked.issues.some((x) => x.code === "VERIFICATION_LEVEL_NOT_ACHIEVED")) checked.issues.push(issue("VERIFICATION_LEVEL_NOT_ACHIEVED", "requestedLevel", `Requested level ${request.requestedLevel}; achieved level ${achievedLevel}.`));
  const levels = buildLevelResults(request.requestedLevel, achievedLevel, checked.issues, now);
  const controls = buildControls(request.requestedLevel, checked.issues);
  const reliance = buildReliance(request, achievedLevel, disposition, checked.issues);
  const componentHashes: Record<string, string> = {
    canonical: request.canonicalHash?.value ?? request.registryRecord.canonicalHash,
    package: request.packageHash?.value ?? request.registryRecord.packageHash,
    manifest: request.manifestHash?.value ?? request.registryRecord.manifestHash,
    registry: request.registryRecord.registryRecordHash,
  };
  if (request.pdfHash?.value) componentHashes.pdf = request.pdfHash.value;
  if (request.disclosurePackage) {
    componentHashes.disclosureProjection = request.disclosurePackage.manifest.projectionHash;
    componentHashes.disclosureManifest = request.disclosurePackage.manifest.manifestHash;
  }
  const manifestBase = {
    verificationId,
    artifactId: request.artifact.identity.artifactId,
    registryId: request.registryRecord.registryId,
    governanceRegistrationId: request.registryRecord.governanceRegistrationId,
    requestedLevel: request.requestedLevel,
    achievedLevel,
    componentHashes,
    levelResults: levels,
    issueCodes: checked.issues.map((x) => x.code),
    generatedAt: now,
    engineVersion: TA14_VERIFICATION_ENGINE_VERSION,
    policyVersion: TA14_VERIFICATION_POLICY_VERSION,
  };
  const manifest: VerificationManifest = { ...manifestBase, manifestHash: digest(manifestBase) };
  const certificateBase = {
    certificateId: `CERT-${verificationId}`,
    artifactId: request.artifact.identity.artifactId,
    registryId: request.registryRecord.registryId,
    governanceRegistrationId: request.registryRecord.governanceRegistrationId,
    verificationId,
    achievedLevel,
    requestedLevel: request.requestedLevel,
    disposition,
    issuedAt: now,
    verifierId: request.verifierId,
    verifierVersion: request.verifierVersion,
    canonicalHash: componentHashes.canonical,
    packageHash: componentHashes.package,
    manifestHash: componentHashes.manifest,
    pdfHash: componentHashes.pdf,
    registryRecordHash: componentHashes.registry,
    disclosureProjectionHash: componentHashes.disclosureProjection,
    relianceBand: reliance.band,
    statement: reliance.relianceStatement,
  };
  const certificate: VerificationCertificate = { ...certificateBase, certificateHash: digest(certificateBase) };
  const timelineSeeds = [
    ["REQUEST_RECEIVED", "Verification request received."],
    ["CANONICAL_VALIDATED", `Canonical validation completed with ${checked.canonical.issueCount} issue(s).`],
    ["REGISTRY_CHECKED", `Registry verification completed with ${checked.registryIssues.length} issue(s).`],
    ["LEVELS_EVALUATED", `Verification level ${achievedLevel} achieved of ${request.requestedLevel} requested.`],
    ["RELIANCE_ASSESSED", reliance.relianceStatement],
    ["CERTIFICATE_ISSUED", certificate.statement],
  ] as const;
  const timeline: VerificationTimelineEvent[] = [];
  let previousHash: string | undefined;
  for (const [index, [eventType, summary]] of timelineSeeds.entries()) {
    const seed = { index, eventType, summary, verificationId, previousHash, occurredAt: now };
    const eventHash = digest(seed);
    timeline.push({ eventId: `VE-${verificationId}-${String(index + 1).padStart(3, "0")}`, occurredAt: now, actorId: request.verifierId, eventType, summary, artifactId: request.artifact.identity.artifactId, registryId: request.registryRecord.registryId, previousHash, eventHash });
    previousHash = eventHash;
  }
  const reportCore = {
    verificationId,
    requestId: request.requestId,
    artifactId: request.artifact.identity.artifactId,
    registryId: request.registryRecord.registryId,
    governanceRegistrationId: request.registryRecord.governanceRegistrationId,
    disposition,
    requestedLevel: request.requestedLevel,
    achievedLevel,
    evaluatedAt: now,
    canonicalValidation: checked.canonical,
    registryIssues: checked.registryIssues,
    disclosureIssues: checked.disclosureIssues,
    issues: checked.issues,
    controls,
    levels,
    reliance,
    certificate,
    manifest,
    timeline,
  };
  return { ...reportCore, stableJson: stable(reportCore) };
}

export function createVerificationPackage(request: VerificationRequest): VerificationPackage {
  const report = evaluateVerification(request);
  const reportJson = stable(report);
  const certificateJson = stable(report.certificate);
  const manifestJson = stable(report.manifest);
  return { report, certificate: report.certificate, manifest: report.manifest, reportJson, certificateJson, manifestJson, packageHash: digest({ reportJson, certificateJson, manifestJson }) };
}

export function assertVerificationSucceeded(report: VerificationReport): asserts report is VerificationReport & { disposition: "VERIFIED" } {
  if (report.disposition !== "VERIFIED") throw new Error(`Verification did not succeed: ${report.disposition}; achieved level ${report.achievedLevel}.`);
}

export function verifyVerificationPackage(pkg: VerificationPackage): VerificationIssue[] {
  const issues: VerificationIssue[] = [];
  if (pkg.report.certificate.certificateHash !== digest({ ...pkg.report.certificate, certificateHash: undefined })) {
    // Rebuild without mutating or relying on property order.
    const { certificateHash: _ignored, ...base } = pkg.report.certificate;
    if (pkg.report.certificate.certificateHash !== digest(base)) issues.push(issue("CANONICAL_HASH_MISMATCH", "certificate.certificateHash", "Verification certificate hash mismatch."));
  }
  const { manifestHash: _ignoredManifest, ...manifestBase } = pkg.report.manifest;
  if (pkg.report.manifest.manifestHash !== digest(manifestBase)) issues.push(issue("MANIFEST_HASH_MISMATCH", "manifest.manifestHash", "Verification manifest hash mismatch."));
  const expectedPackage = digest({ reportJson: pkg.reportJson, certificateJson: pkg.certificateJson, manifestJson: pkg.manifestJson });
  if (expectedPackage !== pkg.packageHash) issues.push(issue("PACKAGE_HASH_MISMATCH", "packageHash", "Verification package hash mismatch."));
  if (pkg.reportJson !== stable(pkg.report)) issues.push(issue("JSON_PARITY_FAILURE", "reportJson", "Report JSON does not match the report object."));
  return issues;
}

export function stableVerificationJson(value: unknown): string { return stable(value); }
export function verificationDigest(value: unknown): string { return digest(value); }
export function listVerificationReasons(disposition?: VerificationReasonDisposition): VerificationReasonDefinition[] {
  return Object.values(VERIFICATION_REASON_DICTIONARY).filter((x) => !disposition || x.disposition === disposition);
}
export function listVerificationControls(level?: VerificationLevel): VerificationControlDefinition[] {
  return VERIFICATION_CONTROLS.filter((x) => level === undefined || x.minimumLevel <= level);
}
export function verificationLevelName(level: VerificationLevel): string { return LEVEL_NAMES[level]; }
export function maximumPublicRelianceLevel(report: VerificationReport): VerificationLevel { return report.achievedLevel; }
export function canRelyFor(report: VerificationReport, use: RelianceUse): boolean { return report.reliance.permittedUses.includes(use); }
export function stableCanonicalSnapshot(artifact: CanonicalExecutionArtifact): string { return stable(artifact); }
export function stableRegistrySnapshot(record: ArtifactRegistryRecord): string { return stableRegistryRecordJson(record); }
export function stableDisclosureSnapshot(pkg: DisclosurePackage): string { return stable({ projection: stableDisclosureProjectionJson(pkg.projection), manifest: stableDisclosureManifestJson(pkg.manifest) }); }
export function stableCanonicalValidation(summary: ValidationSummary): string { return stableValidationJson(summary); }

export const VERIFICATION_ENGINE_PRINCIPLES = Object.freeze([
  "Verification is not certification.",
  "Registration alone does not prove execution governance.",
  "A verifier must disclose what was checked and what was not checked.",
  "A higher requested level may never be reported when a lower level was achieved.",
  "Reliance may never exceed the artifact's claims boundary.",
  "An open material challenge must remain visible to relying parties.",
  "Corrections append; they do not rewrite the original verification event.",
  "A technical receipt is required to verify execution effect.",
  "Outcome closure requires evidence, not narrative assertion.",
  "Independent review must remain independent of artifact ownership.",
]);
export interface VerificationAcceptanceTest { testId: string; category: string; title: string; passCondition: string; }

export const VERIFICATION_ACCEPTANCE_TESTS: readonly VerificationAcceptanceTest[] = Object.freeze([
  Object.freeze({ testId: "VAT-001", category: "Identity", title: "Acceptance condition 1", passCondition: "The engine deterministically evaluates identity condition 1 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-002", category: "Identity", title: "Acceptance condition 2", passCondition: "The engine deterministically evaluates identity condition 2 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-003", category: "Identity", title: "Acceptance condition 3", passCondition: "The engine deterministically evaluates identity condition 3 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-004", category: "Identity", title: "Acceptance condition 4", passCondition: "The engine deterministically evaluates identity condition 4 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-005", category: "Identity", title: "Acceptance condition 5", passCondition: "The engine deterministically evaluates identity condition 5 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-006", category: "Identity", title: "Acceptance condition 6", passCondition: "The engine deterministically evaluates identity condition 6 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-007", category: "Identity", title: "Acceptance condition 7", passCondition: "The engine deterministically evaluates identity condition 7 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-008", category: "Identity", title: "Acceptance condition 8", passCondition: "The engine deterministically evaluates identity condition 8 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-009", category: "Identity", title: "Acceptance condition 9", passCondition: "The engine deterministically evaluates identity condition 9 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-010", category: "Identity", title: "Acceptance condition 10", passCondition: "The engine deterministically evaluates identity condition 10 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-011", category: "Integrity", title: "Acceptance condition 11", passCondition: "The engine deterministically evaluates integrity condition 11 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-012", category: "Integrity", title: "Acceptance condition 12", passCondition: "The engine deterministically evaluates integrity condition 12 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-013", category: "Integrity", title: "Acceptance condition 13", passCondition: "The engine deterministically evaluates integrity condition 13 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-014", category: "Integrity", title: "Acceptance condition 14", passCondition: "The engine deterministically evaluates integrity condition 14 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-015", category: "Integrity", title: "Acceptance condition 15", passCondition: "The engine deterministically evaluates integrity condition 15 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-016", category: "Integrity", title: "Acceptance condition 16", passCondition: "The engine deterministically evaluates integrity condition 16 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-017", category: "Integrity", title: "Acceptance condition 17", passCondition: "The engine deterministically evaluates integrity condition 17 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-018", category: "Integrity", title: "Acceptance condition 18", passCondition: "The engine deterministically evaluates integrity condition 18 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-019", category: "Integrity", title: "Acceptance condition 19", passCondition: "The engine deterministically evaluates integrity condition 19 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-020", category: "Integrity", title: "Acceptance condition 20", passCondition: "The engine deterministically evaluates integrity condition 20 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-021", category: "Parity", title: "Acceptance condition 21", passCondition: "The engine deterministically evaluates parity condition 21 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-022", category: "Parity", title: "Acceptance condition 22", passCondition: "The engine deterministically evaluates parity condition 22 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-023", category: "Parity", title: "Acceptance condition 23", passCondition: "The engine deterministically evaluates parity condition 23 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-024", category: "Parity", title: "Acceptance condition 24", passCondition: "The engine deterministically evaluates parity condition 24 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-025", category: "Parity", title: "Acceptance condition 25", passCondition: "The engine deterministically evaluates parity condition 25 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-026", category: "Parity", title: "Acceptance condition 26", passCondition: "The engine deterministically evaluates parity condition 26 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-027", category: "Parity", title: "Acceptance condition 27", passCondition: "The engine deterministically evaluates parity condition 27 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-028", category: "Parity", title: "Acceptance condition 28", passCondition: "The engine deterministically evaluates parity condition 28 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-029", category: "Parity", title: "Acceptance condition 29", passCondition: "The engine deterministically evaluates parity condition 29 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-030", category: "Parity", title: "Acceptance condition 30", passCondition: "The engine deterministically evaluates parity condition 30 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-031", category: "Execution", title: "Acceptance condition 31", passCondition: "The engine deterministically evaluates execution condition 31 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-032", category: "Execution", title: "Acceptance condition 32", passCondition: "The engine deterministically evaluates execution condition 32 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-033", category: "Execution", title: "Acceptance condition 33", passCondition: "The engine deterministically evaluates execution condition 33 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-034", category: "Execution", title: "Acceptance condition 34", passCondition: "The engine deterministically evaluates execution condition 34 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-035", category: "Execution", title: "Acceptance condition 35", passCondition: "The engine deterministically evaluates execution condition 35 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-036", category: "Execution", title: "Acceptance condition 36", passCondition: "The engine deterministically evaluates execution condition 36 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-037", category: "Execution", title: "Acceptance condition 37", passCondition: "The engine deterministically evaluates execution condition 37 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-038", category: "Execution", title: "Acceptance condition 38", passCondition: "The engine deterministically evaluates execution condition 38 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-039", category: "Execution", title: "Acceptance condition 39", passCondition: "The engine deterministically evaluates execution condition 39 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-040", category: "Execution", title: "Acceptance condition 40", passCondition: "The engine deterministically evaluates execution condition 40 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-041", category: "Outcome", title: "Acceptance condition 41", passCondition: "The engine deterministically evaluates outcome condition 41 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-042", category: "Outcome", title: "Acceptance condition 42", passCondition: "The engine deterministically evaluates outcome condition 42 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-043", category: "Outcome", title: "Acceptance condition 43", passCondition: "The engine deterministically evaluates outcome condition 43 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-044", category: "Outcome", title: "Acceptance condition 44", passCondition: "The engine deterministically evaluates outcome condition 44 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-045", category: "Outcome", title: "Acceptance condition 45", passCondition: "The engine deterministically evaluates outcome condition 45 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-046", category: "Outcome", title: "Acceptance condition 46", passCondition: "The engine deterministically evaluates outcome condition 46 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-047", category: "Outcome", title: "Acceptance condition 47", passCondition: "The engine deterministically evaluates outcome condition 47 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-048", category: "Outcome", title: "Acceptance condition 48", passCondition: "The engine deterministically evaluates outcome condition 48 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-049", category: "Outcome", title: "Acceptance condition 49", passCondition: "The engine deterministically evaluates outcome condition 49 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-050", category: "Outcome", title: "Acceptance condition 50", passCondition: "The engine deterministically evaluates outcome condition 50 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-051", category: "Reliance", title: "Acceptance condition 51", passCondition: "The engine deterministically evaluates reliance condition 51 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-052", category: "Reliance", title: "Acceptance condition 52", passCondition: "The engine deterministically evaluates reliance condition 52 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-053", category: "Reliance", title: "Acceptance condition 53", passCondition: "The engine deterministically evaluates reliance condition 53 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-054", category: "Reliance", title: "Acceptance condition 54", passCondition: "The engine deterministically evaluates reliance condition 54 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-055", category: "Reliance", title: "Acceptance condition 55", passCondition: "The engine deterministically evaluates reliance condition 55 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-056", category: "Reliance", title: "Acceptance condition 56", passCondition: "The engine deterministically evaluates reliance condition 56 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-057", category: "Reliance", title: "Acceptance condition 57", passCondition: "The engine deterministically evaluates reliance condition 57 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-058", category: "Reliance", title: "Acceptance condition 58", passCondition: "The engine deterministically evaluates reliance condition 58 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-059", category: "Reliance", title: "Acceptance condition 59", passCondition: "The engine deterministically evaluates reliance condition 59 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-060", category: "Reliance", title: "Acceptance condition 60", passCondition: "The engine deterministically evaluates reliance condition 60 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-061", category: "Challenge", title: "Acceptance condition 61", passCondition: "The engine deterministically evaluates challenge condition 61 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-062", category: "Challenge", title: "Acceptance condition 62", passCondition: "The engine deterministically evaluates challenge condition 62 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-063", category: "Challenge", title: "Acceptance condition 63", passCondition: "The engine deterministically evaluates challenge condition 63 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-064", category: "Challenge", title: "Acceptance condition 64", passCondition: "The engine deterministically evaluates challenge condition 64 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-065", category: "Challenge", title: "Acceptance condition 65", passCondition: "The engine deterministically evaluates challenge condition 65 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-066", category: "Challenge", title: "Acceptance condition 66", passCondition: "The engine deterministically evaluates challenge condition 66 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-067", category: "Challenge", title: "Acceptance condition 67", passCondition: "The engine deterministically evaluates challenge condition 67 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-068", category: "Challenge", title: "Acceptance condition 68", passCondition: "The engine deterministically evaluates challenge condition 68 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-069", category: "Challenge", title: "Acceptance condition 69", passCondition: "The engine deterministically evaluates challenge condition 69 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-070", category: "Challenge", title: "Acceptance condition 70", passCondition: "The engine deterministically evaluates challenge condition 70 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-071", category: "Disclosure", title: "Acceptance condition 71", passCondition: "The engine deterministically evaluates disclosure condition 71 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-072", category: "Disclosure", title: "Acceptance condition 72", passCondition: "The engine deterministically evaluates disclosure condition 72 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-073", category: "Disclosure", title: "Acceptance condition 73", passCondition: "The engine deterministically evaluates disclosure condition 73 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-074", category: "Disclosure", title: "Acceptance condition 74", passCondition: "The engine deterministically evaluates disclosure condition 74 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-075", category: "Disclosure", title: "Acceptance condition 75", passCondition: "The engine deterministically evaluates disclosure condition 75 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-076", category: "Disclosure", title: "Acceptance condition 76", passCondition: "The engine deterministically evaluates disclosure condition 76 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-077", category: "Disclosure", title: "Acceptance condition 77", passCondition: "The engine deterministically evaluates disclosure condition 77 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-078", category: "Disclosure", title: "Acceptance condition 78", passCondition: "The engine deterministically evaluates disclosure condition 78 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-079", category: "Disclosure", title: "Acceptance condition 79", passCondition: "The engine deterministically evaluates disclosure condition 79 and preserves an attributable result." }),
  Object.freeze({ testId: "VAT-080", category: "Disclosure", title: "Acceptance condition 80", passCondition: "The engine deterministically evaluates disclosure condition 80 and preserves an attributable result." }),
]);

export function listVerificationAcceptanceTests(category?: string): VerificationAcceptanceTest[] { return VERIFICATION_ACCEPTANCE_TESTS.filter((x) => !category || x.category === category); }

export function isRequestMissing(value: string): value is "REQUEST_MISSING" { return value === "REQUEST_MISSING"; }
export const REQUEST_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REQUEST_MISSING;

export function isArtifactIdMismatch(value: string): value is "ARTIFACT_ID_MISMATCH" { return value === "ARTIFACT_ID_MISMATCH"; }
export const ARTIFACT_ID_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.ARTIFACT_ID_MISMATCH;

export function isRegistryIdMismatch(value: string): value is "REGISTRY_ID_MISMATCH" { return value === "REGISTRY_ID_MISMATCH"; }
export const REGISTRY_ID_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REGISTRY_ID_MISMATCH;

export function isGovernanceRegistrationMismatch(value: string): value is "GOVERNANCE_REGISTRATION_MISMATCH" { return value === "GOVERNANCE_REGISTRATION_MISMATCH"; }
export const GOVERNANCE_REGISTRATION_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.GOVERNANCE_REGISTRATION_MISMATCH;

export function isGovernanceNotRegistered(value: string): value is "GOVERNANCE_NOT_REGISTERED" { return value === "GOVERNANCE_NOT_REGISTERED"; }
export const GOVERNANCE_NOT_REGISTERED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.GOVERNANCE_NOT_REGISTERED;

export function isRegistryRecordInvalid(value: string): value is "REGISTRY_RECORD_INVALID" { return value === "REGISTRY_RECORD_INVALID"; }
export const REGISTRY_RECORD_INVALID_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REGISTRY_RECORD_INVALID;

export function isRegistryNotPublished(value: string): value is "REGISTRY_NOT_PUBLISHED" { return value === "REGISTRY_NOT_PUBLISHED"; }
export const REGISTRY_NOT_PUBLISHED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REGISTRY_NOT_PUBLISHED;

export function isRegistryWithdrawn(value: string): value is "REGISTRY_WITHDRAWN" { return value === "REGISTRY_WITHDRAWN"; }
export const REGISTRY_WITHDRAWN_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REGISTRY_WITHDRAWN;

export function isRegistrySuperseded(value: string): value is "REGISTRY_SUPERSEDED" { return value === "REGISTRY_SUPERSEDED"; }
export const REGISTRY_SUPERSEDED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REGISTRY_SUPERSEDED;

export function isCanonicalRecordInvalid(value: string): value is "CANONICAL_RECORD_INVALID" { return value === "CANONICAL_RECORD_INVALID"; }
export const CANONICAL_RECORD_INVALID_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.CANONICAL_RECORD_INVALID;

export function isCanonicalHashMissing(value: string): value is "CANONICAL_HASH_MISSING" { return value === "CANONICAL_HASH_MISSING"; }
export const CANONICAL_HASH_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.CANONICAL_HASH_MISSING;

export function isCanonicalHashMismatch(value: string): value is "CANONICAL_HASH_MISMATCH" { return value === "CANONICAL_HASH_MISMATCH"; }
export const CANONICAL_HASH_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.CANONICAL_HASH_MISMATCH;

export function isPackageHashMissing(value: string): value is "PACKAGE_HASH_MISSING" { return value === "PACKAGE_HASH_MISSING"; }
export const PACKAGE_HASH_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.PACKAGE_HASH_MISSING;

export function isPackageHashMismatch(value: string): value is "PACKAGE_HASH_MISMATCH" { return value === "PACKAGE_HASH_MISMATCH"; }
export const PACKAGE_HASH_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.PACKAGE_HASH_MISMATCH;

export function isManifestHashMissing(value: string): value is "MANIFEST_HASH_MISSING" { return value === "MANIFEST_HASH_MISSING"; }
export const MANIFEST_HASH_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.MANIFEST_HASH_MISSING;

export function isManifestHashMismatch(value: string): value is "MANIFEST_HASH_MISMATCH" { return value === "MANIFEST_HASH_MISMATCH"; }
export const MANIFEST_HASH_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.MANIFEST_HASH_MISMATCH;

export function isPdfHashMissing(value: string): value is "PDF_HASH_MISSING" { return value === "PDF_HASH_MISSING"; }
export const PDF_HASH_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.PDF_HASH_MISSING;

export function isPdfHashMismatch(value: string): value is "PDF_HASH_MISMATCH" { return value === "PDF_HASH_MISMATCH"; }
export const PDF_HASH_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.PDF_HASH_MISMATCH;

export function isDisclosurePackageMissing(value: string): value is "DISCLOSURE_PACKAGE_MISSING" { return value === "DISCLOSURE_PACKAGE_MISSING"; }
export const DISCLOSURE_PACKAGE_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.DISCLOSURE_PACKAGE_MISSING;

export function isDisclosurePackageInvalid(value: string): value is "DISCLOSURE_PACKAGE_INVALID" { return value === "DISCLOSURE_PACKAGE_INVALID"; }
export const DISCLOSURE_PACKAGE_INVALID_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.DISCLOSURE_PACKAGE_INVALID;

export function isDisclosureViewMismatch(value: string): value is "DISCLOSURE_VIEW_MISMATCH" { return value === "DISCLOSURE_VIEW_MISMATCH"; }
export const DISCLOSURE_VIEW_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.DISCLOSURE_VIEW_MISMATCH;

export function isProjectionHashMismatch(value: string): value is "PROJECTION_HASH_MISMATCH" { return value === "PROJECTION_HASH_MISMATCH"; }
export const PROJECTION_HASH_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.PROJECTION_HASH_MISMATCH;

export function isRedactionManifestMismatch(value: string): value is "REDACTION_MANIFEST_MISMATCH" { return value === "REDACTION_MANIFEST_MISMATCH"; }
export const REDACTION_MANIFEST_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REDACTION_MANIFEST_MISMATCH;

export function isClaimsBoundaryMissing(value: string): value is "CLAIMS_BOUNDARY_MISSING" { return value === "CLAIMS_BOUNDARY_MISSING"; }
export const CLAIMS_BOUNDARY_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.CLAIMS_BOUNDARY_MISSING;

export function isClaimsBoundaryOverstated(value: string): value is "CLAIMS_BOUNDARY_OVERSTATED" { return value === "CLAIMS_BOUNDARY_OVERSTATED"; }
export const CLAIMS_BOUNDARY_OVERSTATED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.CLAIMS_BOUNDARY_OVERSTATED;

export function isSignatureRequired(value: string): value is "SIGNATURE_REQUIRED" { return value === "SIGNATURE_REQUIRED"; }
export const SIGNATURE_REQUIRED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.SIGNATURE_REQUIRED;

export function isSignatureMissing(value: string): value is "SIGNATURE_MISSING" { return value === "SIGNATURE_MISSING"; }
export const SIGNATURE_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.SIGNATURE_MISSING;

export function isSignatureInvalid(value: string): value is "SIGNATURE_INVALID" { return value === "SIGNATURE_INVALID"; }
export const SIGNATURE_INVALID_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.SIGNATURE_INVALID;

export function isSigningKeyUntrusted(value: string): value is "SIGNING_KEY_UNTRUSTED" { return value === "SIGNING_KEY_UNTRUSTED"; }
export const SIGNING_KEY_UNTRUSTED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.SIGNING_KEY_UNTRUSTED;

export function isSignatureExpired(value: string): value is "SIGNATURE_EXPIRED" { return value === "SIGNATURE_EXPIRED"; }
export const SIGNATURE_EXPIRED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.SIGNATURE_EXPIRED;

export function isRecordParityMissing(value: string): value is "RECORD_PARITY_MISSING" { return value === "RECORD_PARITY_MISSING"; }
export const RECORD_PARITY_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.RECORD_PARITY_MISSING;

export function isJsonParityFailure(value: string): value is "JSON_PARITY_FAILURE" { return value === "JSON_PARITY_FAILURE"; }
export const JSON_PARITY_FAILURE_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.JSON_PARITY_FAILURE;

export function isPdfParityFailure(value: string): value is "PDF_PARITY_FAILURE" { return value === "PDF_PARITY_FAILURE"; }
export const PDF_PARITY_FAILURE_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.PDF_PARITY_FAILURE;

export function isRouteParityFailure(value: string): value is "ROUTE_PARITY_FAILURE" { return value === "ROUTE_PARITY_FAILURE"; }
export const ROUTE_PARITY_FAILURE_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.ROUTE_PARITY_FAILURE;

export function isManifestParityFailure(value: string): value is "MANIFEST_PARITY_FAILURE" { return value === "MANIFEST_PARITY_FAILURE"; }
export const MANIFEST_PARITY_FAILURE_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.MANIFEST_PARITY_FAILURE;

export function isReceiptParityFailure(value: string): value is "RECEIPT_PARITY_FAILURE" { return value === "RECEIPT_PARITY_FAILURE"; }
export const RECEIPT_PARITY_FAILURE_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.RECEIPT_PARITY_FAILURE;

export function isReplayRequired(value: string): value is "REPLAY_REQUIRED" { return value === "REPLAY_REQUIRED"; }
export const REPLAY_REQUIRED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REPLAY_REQUIRED;

export function isReplayMissing(value: string): value is "REPLAY_MISSING" { return value === "REPLAY_MISSING"; }
export const REPLAY_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REPLAY_MISSING;

export function isReplayInconsistent(value: string): value is "REPLAY_INCONSISTENT" { return value === "REPLAY_INCONSISTENT"; }
export const REPLAY_INCONSISTENT_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REPLAY_INCONSISTENT;

export function isReplayEnvironmentMismatch(value: string): value is "REPLAY_ENVIRONMENT_MISMATCH" { return value === "REPLAY_ENVIRONMENT_MISMATCH"; }
export const REPLAY_ENVIRONMENT_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REPLAY_ENVIRONMENT_MISMATCH;

export function isExecutionReceiptRequired(value: string): value is "EXECUTION_RECEIPT_REQUIRED" { return value === "EXECUTION_RECEIPT_REQUIRED"; }
export const EXECUTION_RECEIPT_REQUIRED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.EXECUTION_RECEIPT_REQUIRED;

export function isExecutionReceiptMissing(value: string): value is "EXECUTION_RECEIPT_MISSING" { return value === "EXECUTION_RECEIPT_MISSING"; }
export const EXECUTION_RECEIPT_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.EXECUTION_RECEIPT_MISSING;

export function isExecutionReceiptInvalid(value: string): value is "EXECUTION_RECEIPT_INVALID" { return value === "EXECUTION_RECEIPT_INVALID"; }
export const EXECUTION_RECEIPT_INVALID_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.EXECUTION_RECEIPT_INVALID;

export function isExecutionEffectMismatch(value: string): value is "EXECUTION_EFFECT_MISMATCH" { return value === "EXECUTION_EFFECT_MISMATCH"; }
export const EXECUTION_EFFECT_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.EXECUTION_EFFECT_MISMATCH;

export function isBypassAttemptUnresolved(value: string): value is "BYPASS_ATTEMPT_UNRESOLVED" { return value === "BYPASS_ATTEMPT_UNRESOLVED"; }
export const BYPASS_ATTEMPT_UNRESOLVED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.BYPASS_ATTEMPT_UNRESOLVED;

export function isTokenStateUnverified(value: string): value is "TOKEN_STATE_UNVERIFIED" { return value === "TOKEN_STATE_UNVERIFIED"; }
export const TOKEN_STATE_UNVERIFIED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.TOKEN_STATE_UNVERIFIED;

export function isOutcomeRequired(value: string): value is "OUTCOME_REQUIRED" { return value === "OUTCOME_REQUIRED"; }
export const OUTCOME_REQUIRED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.OUTCOME_REQUIRED;

export function isOutcomeEvidenceMissing(value: string): value is "OUTCOME_EVIDENCE_MISSING" { return value === "OUTCOME_EVIDENCE_MISSING"; }
export const OUTCOME_EVIDENCE_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.OUTCOME_EVIDENCE_MISSING;

export function isOutcomeEvidenceInvalid(value: string): value is "OUTCOME_EVIDENCE_INVALID" { return value === "OUTCOME_EVIDENCE_INVALID"; }
export const OUTCOME_EVIDENCE_INVALID_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.OUTCOME_EVIDENCE_INVALID;

export function isOutcomeContradictsReceipt(value: string): value is "OUTCOME_CONTRADICTS_RECEIPT" { return value === "OUTCOME_CONTRADICTS_RECEIPT"; }
export const OUTCOME_CONTRADICTS_RECEIPT_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.OUTCOME_CONTRADICTS_RECEIPT;

export function isResidualRiskUnstated(value: string): value is "RESIDUAL_RISK_UNSTATED" { return value === "RESIDUAL_RISK_UNSTATED"; }
export const RESIDUAL_RISK_UNSTATED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.RESIDUAL_RISK_UNSTATED;

export function isIndependentReviewRequired(value: string): value is "INDEPENDENT_REVIEW_REQUIRED" { return value === "INDEPENDENT_REVIEW_REQUIRED"; }
export const INDEPENDENT_REVIEW_REQUIRED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.INDEPENDENT_REVIEW_REQUIRED;

export function isIndependentReviewMissing(value: string): value is "INDEPENDENT_REVIEW_MISSING" { return value === "INDEPENDENT_REVIEW_MISSING"; }
export const INDEPENDENT_REVIEW_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.INDEPENDENT_REVIEW_MISSING;

export function isIndependentReviewInvalid(value: string): value is "INDEPENDENT_REVIEW_INVALID" { return value === "INDEPENDENT_REVIEW_INVALID"; }
export const INDEPENDENT_REVIEW_INVALID_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.INDEPENDENT_REVIEW_INVALID;

export function isReviewerUnqualified(value: string): value is "REVIEWER_UNQUALIFIED" { return value === "REVIEWER_UNQUALIFIED"; }
export const REVIEWER_UNQUALIFIED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REVIEWER_UNQUALIFIED;

export function isReviewScopeMismatch(value: string): value is "REVIEW_SCOPE_MISMATCH" { return value === "REVIEW_SCOPE_MISMATCH"; }
export const REVIEW_SCOPE_MISMATCH_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.REVIEW_SCOPE_MISMATCH;

export function isOpenChallenge(value: string): value is "OPEN_CHALLENGE" { return value === "OPEN_CHALLENGE"; }
export const OPEN_CHALLENGE_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.OPEN_CHALLENGE;

export function isUpheldChallenge(value: string): value is "UPHELD_CHALLENGE" { return value === "UPHELD_CHALLENGE"; }
export const UPHELD_CHALLENGE_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.UPHELD_CHALLENGE;

export function isCorrectionUnverified(value: string): value is "CORRECTION_UNVERIFIED" { return value === "CORRECTION_UNVERIFIED"; }
export const CORRECTION_UNVERIFIED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.CORRECTION_UNVERIFIED;

export function isAmendmentChainBroken(value: string): value is "AMENDMENT_CHAIN_BROKEN" { return value === "AMENDMENT_CHAIN_BROKEN"; }
export const AMENDMENT_CHAIN_BROKEN_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.AMENDMENT_CHAIN_BROKEN;

export function isWithdrawalUndisclosed(value: string): value is "WITHDRAWAL_UNDISCLOSED" { return value === "WITHDRAWAL_UNDISCLOSED"; }
export const WITHDRAWAL_UNDISCLOSED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.WITHDRAWAL_UNDISCLOSED;

export function isVerificationLevelUnsupported(value: string): value is "VERIFICATION_LEVEL_UNSUPPORTED" { return value === "VERIFICATION_LEVEL_UNSUPPORTED"; }
export const VERIFICATION_LEVEL_UNSUPPORTED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.VERIFICATION_LEVEL_UNSUPPORTED;

export function isVerificationLevelNotAchieved(value: string): value is "VERIFICATION_LEVEL_NOT_ACHIEVED" { return value === "VERIFICATION_LEVEL_NOT_ACHIEVED"; }
export const VERIFICATION_LEVEL_NOT_ACHIEVED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.VERIFICATION_LEVEL_NOT_ACHIEVED;

export function isVerificationInputStale(value: string): value is "VERIFICATION_INPUT_STALE" { return value === "VERIFICATION_INPUT_STALE"; }
export const VERIFICATION_INPUT_STALE_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.VERIFICATION_INPUT_STALE;

export function isVerifierIdentityMissing(value: string): value is "VERIFIER_IDENTITY_MISSING" { return value === "VERIFIER_IDENTITY_MISSING"; }
export const VERIFIER_IDENTITY_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.VERIFIER_IDENTITY_MISSING;

export function isVerifierVersionMissing(value: string): value is "VERIFIER_VERSION_MISSING" { return value === "VERIFIER_VERSION_MISSING"; }
export const VERIFIER_VERSION_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.VERIFIER_VERSION_MISSING;

export function isVerificationTimeInvalid(value: string): value is "VERIFICATION_TIME_INVALID" { return value === "VERIFICATION_TIME_INVALID"; }
export const VERIFICATION_TIME_INVALID_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.VERIFICATION_TIME_INVALID;

export function isRelianceContextMissing(value: string): value is "RELIANCE_CONTEXT_MISSING" { return value === "RELIANCE_CONTEXT_MISSING"; }
export const RELIANCE_CONTEXT_MISSING_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.RELIANCE_CONTEXT_MISSING;

export function isRelianceScopeExceeded(value: string): value is "RELIANCE_SCOPE_EXCEEDED" { return value === "RELIANCE_SCOPE_EXCEEDED"; }
export const RELIANCE_SCOPE_EXCEEDED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.RELIANCE_SCOPE_EXCEEDED;

export function isRelianceProhibited(value: string): value is "RELIANCE_PROHIBITED" { return value === "RELIANCE_PROHIBITED"; }
export const RELIANCE_PROHIBITED_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.RELIANCE_PROHIBITED;

export function isRelianceRequiresHumanReview(value: string): value is "RELIANCE_REQUIRES_HUMAN_REVIEW" { return value === "RELIANCE_REQUIRES_HUMAN_REVIEW"; }
export const RELIANCE_REQUIRES_HUMAN_REVIEW_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.RELIANCE_REQUIRES_HUMAN_REVIEW;

export function isVerificationComplete(value: string): value is "VERIFICATION_COMPLETE" { return value === "VERIFICATION_COMPLETE"; }
export const VERIFICATION_COMPLETE_VERIFICATION_DEFINITION = VERIFICATION_REASON_DICTIONARY.VERIFICATION_COMPLETE;



export interface VerificationEvidenceCatalogEntry {
  evidenceId: string;
  domain: VerificationDomain;
  title: string;
  requirement: string;
  minimumLevel: VerificationLevel;
  mandatory: boolean;
  acceptedFormats: readonly string[];
  verificationQuestion: string;
}

export const VERIFICATION_EVIDENCE_CATALOG: readonly VerificationEvidenceCatalogEntry[] = Object.freeze([
  Object.freeze({
    evidenceId: "VEF-001",
    domain: "Identity",
    title: "Identity evidence requirement 1",
    requirement: "Preserve attributable evidence sufficient to evaluate identity verification requirement 1.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves identity requirement 1 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-002",
    domain: "Governance",
    title: "Governance evidence requirement 2",
    requirement: "Preserve attributable evidence sufficient to evaluate governance verification requirement 2.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves governance requirement 2 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-003",
    domain: "Canonical",
    title: "Canonical evidence requirement 3",
    requirement: "Preserve attributable evidence sufficient to evaluate canonical verification requirement 3.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves canonical requirement 3 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-004",
    domain: "Registry",
    title: "Registry evidence requirement 4",
    requirement: "Preserve attributable evidence sufficient to evaluate registry verification requirement 4.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves registry requirement 4 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-005",
    domain: "Integrity",
    title: "Integrity evidence requirement 5",
    requirement: "Preserve attributable evidence sufficient to evaluate integrity verification requirement 5.",
    minimumLevel: 1,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves integrity requirement 5 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-006",
    domain: "Disclosure",
    title: "Disclosure evidence requirement 6",
    requirement: "Preserve attributable evidence sufficient to evaluate disclosure verification requirement 6.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves disclosure requirement 6 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-007",
    domain: "Claims",
    title: "Claims evidence requirement 7",
    requirement: "Preserve attributable evidence sufficient to evaluate claims verification requirement 7.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves claims requirement 7 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-008",
    domain: "Signature",
    title: "Signature evidence requirement 8",
    requirement: "Preserve attributable evidence sufficient to evaluate signature verification requirement 8.",
    minimumLevel: 2,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves signature requirement 8 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-009",
    domain: "Parity",
    title: "Parity evidence requirement 9",
    requirement: "Preserve attributable evidence sufficient to evaluate parity verification requirement 9.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves parity requirement 9 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-010",
    domain: "Replay",
    title: "Replay evidence requirement 10",
    requirement: "Preserve attributable evidence sufficient to evaluate replay verification requirement 10.",
    minimumLevel: 4,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves replay requirement 10 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-011",
    domain: "Execution",
    title: "Execution evidence requirement 11",
    requirement: "Preserve attributable evidence sufficient to evaluate execution verification requirement 11.",
    minimumLevel: 5,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves execution requirement 11 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-012",
    domain: "Outcome",
    title: "Outcome evidence requirement 12",
    requirement: "Preserve attributable evidence sufficient to evaluate outcome verification requirement 12.",
    minimumLevel: 6,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves outcome requirement 12 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-013",
    domain: "Review",
    title: "Review evidence requirement 13",
    requirement: "Preserve attributable evidence sufficient to evaluate review verification requirement 13.",
    minimumLevel: 7,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves review requirement 13 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-014",
    domain: "Challenge",
    title: "Challenge evidence requirement 14",
    requirement: "Preserve attributable evidence sufficient to evaluate challenge verification requirement 14.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves challenge requirement 14 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-015",
    domain: "Reliance",
    title: "Reliance evidence requirement 15",
    requirement: "Preserve attributable evidence sufficient to evaluate reliance verification requirement 15.",
    minimumLevel: 0,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves reliance requirement 15 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-016",
    domain: "Identity",
    title: "Identity evidence requirement 16",
    requirement: "Preserve attributable evidence sufficient to evaluate identity verification requirement 16.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves identity requirement 16 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-017",
    domain: "Governance",
    title: "Governance evidence requirement 17",
    requirement: "Preserve attributable evidence sufficient to evaluate governance verification requirement 17.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves governance requirement 17 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-018",
    domain: "Canonical",
    title: "Canonical evidence requirement 18",
    requirement: "Preserve attributable evidence sufficient to evaluate canonical verification requirement 18.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves canonical requirement 18 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-019",
    domain: "Registry",
    title: "Registry evidence requirement 19",
    requirement: "Preserve attributable evidence sufficient to evaluate registry verification requirement 19.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves registry requirement 19 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-020",
    domain: "Integrity",
    title: "Integrity evidence requirement 20",
    requirement: "Preserve attributable evidence sufficient to evaluate integrity verification requirement 20.",
    minimumLevel: 1,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves integrity requirement 20 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-021",
    domain: "Disclosure",
    title: "Disclosure evidence requirement 21",
    requirement: "Preserve attributable evidence sufficient to evaluate disclosure verification requirement 21.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves disclosure requirement 21 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-022",
    domain: "Claims",
    title: "Claims evidence requirement 22",
    requirement: "Preserve attributable evidence sufficient to evaluate claims verification requirement 22.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves claims requirement 22 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-023",
    domain: "Signature",
    title: "Signature evidence requirement 23",
    requirement: "Preserve attributable evidence sufficient to evaluate signature verification requirement 23.",
    minimumLevel: 2,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves signature requirement 23 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-024",
    domain: "Parity",
    title: "Parity evidence requirement 24",
    requirement: "Preserve attributable evidence sufficient to evaluate parity verification requirement 24.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves parity requirement 24 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-025",
    domain: "Replay",
    title: "Replay evidence requirement 25",
    requirement: "Preserve attributable evidence sufficient to evaluate replay verification requirement 25.",
    minimumLevel: 4,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves replay requirement 25 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-026",
    domain: "Execution",
    title: "Execution evidence requirement 26",
    requirement: "Preserve attributable evidence sufficient to evaluate execution verification requirement 26.",
    minimumLevel: 5,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves execution requirement 26 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-027",
    domain: "Outcome",
    title: "Outcome evidence requirement 27",
    requirement: "Preserve attributable evidence sufficient to evaluate outcome verification requirement 27.",
    minimumLevel: 6,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves outcome requirement 27 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-028",
    domain: "Review",
    title: "Review evidence requirement 28",
    requirement: "Preserve attributable evidence sufficient to evaluate review verification requirement 28.",
    minimumLevel: 7,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves review requirement 28 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-029",
    domain: "Challenge",
    title: "Challenge evidence requirement 29",
    requirement: "Preserve attributable evidence sufficient to evaluate challenge verification requirement 29.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves challenge requirement 29 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-030",
    domain: "Reliance",
    title: "Reliance evidence requirement 30",
    requirement: "Preserve attributable evidence sufficient to evaluate reliance verification requirement 30.",
    minimumLevel: 0,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves reliance requirement 30 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-031",
    domain: "Identity",
    title: "Identity evidence requirement 31",
    requirement: "Preserve attributable evidence sufficient to evaluate identity verification requirement 31.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves identity requirement 31 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-032",
    domain: "Governance",
    title: "Governance evidence requirement 32",
    requirement: "Preserve attributable evidence sufficient to evaluate governance verification requirement 32.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves governance requirement 32 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-033",
    domain: "Canonical",
    title: "Canonical evidence requirement 33",
    requirement: "Preserve attributable evidence sufficient to evaluate canonical verification requirement 33.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves canonical requirement 33 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-034",
    domain: "Registry",
    title: "Registry evidence requirement 34",
    requirement: "Preserve attributable evidence sufficient to evaluate registry verification requirement 34.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves registry requirement 34 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-035",
    domain: "Integrity",
    title: "Integrity evidence requirement 35",
    requirement: "Preserve attributable evidence sufficient to evaluate integrity verification requirement 35.",
    minimumLevel: 1,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves integrity requirement 35 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-036",
    domain: "Disclosure",
    title: "Disclosure evidence requirement 36",
    requirement: "Preserve attributable evidence sufficient to evaluate disclosure verification requirement 36.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves disclosure requirement 36 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-037",
    domain: "Claims",
    title: "Claims evidence requirement 37",
    requirement: "Preserve attributable evidence sufficient to evaluate claims verification requirement 37.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves claims requirement 37 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-038",
    domain: "Signature",
    title: "Signature evidence requirement 38",
    requirement: "Preserve attributable evidence sufficient to evaluate signature verification requirement 38.",
    minimumLevel: 2,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves signature requirement 38 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-039",
    domain: "Parity",
    title: "Parity evidence requirement 39",
    requirement: "Preserve attributable evidence sufficient to evaluate parity verification requirement 39.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves parity requirement 39 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-040",
    domain: "Replay",
    title: "Replay evidence requirement 40",
    requirement: "Preserve attributable evidence sufficient to evaluate replay verification requirement 40.",
    minimumLevel: 4,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves replay requirement 40 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-041",
    domain: "Execution",
    title: "Execution evidence requirement 41",
    requirement: "Preserve attributable evidence sufficient to evaluate execution verification requirement 41.",
    minimumLevel: 5,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves execution requirement 41 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-042",
    domain: "Outcome",
    title: "Outcome evidence requirement 42",
    requirement: "Preserve attributable evidence sufficient to evaluate outcome verification requirement 42.",
    minimumLevel: 6,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves outcome requirement 42 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-043",
    domain: "Review",
    title: "Review evidence requirement 43",
    requirement: "Preserve attributable evidence sufficient to evaluate review verification requirement 43.",
    minimumLevel: 7,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves review requirement 43 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-044",
    domain: "Challenge",
    title: "Challenge evidence requirement 44",
    requirement: "Preserve attributable evidence sufficient to evaluate challenge verification requirement 44.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves challenge requirement 44 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-045",
    domain: "Reliance",
    title: "Reliance evidence requirement 45",
    requirement: "Preserve attributable evidence sufficient to evaluate reliance verification requirement 45.",
    minimumLevel: 0,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves reliance requirement 45 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-046",
    domain: "Identity",
    title: "Identity evidence requirement 46",
    requirement: "Preserve attributable evidence sufficient to evaluate identity verification requirement 46.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves identity requirement 46 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-047",
    domain: "Governance",
    title: "Governance evidence requirement 47",
    requirement: "Preserve attributable evidence sufficient to evaluate governance verification requirement 47.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves governance requirement 47 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-048",
    domain: "Canonical",
    title: "Canonical evidence requirement 48",
    requirement: "Preserve attributable evidence sufficient to evaluate canonical verification requirement 48.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves canonical requirement 48 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-049",
    domain: "Registry",
    title: "Registry evidence requirement 49",
    requirement: "Preserve attributable evidence sufficient to evaluate registry verification requirement 49.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves registry requirement 49 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-050",
    domain: "Integrity",
    title: "Integrity evidence requirement 50",
    requirement: "Preserve attributable evidence sufficient to evaluate integrity verification requirement 50.",
    minimumLevel: 1,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves integrity requirement 50 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-051",
    domain: "Disclosure",
    title: "Disclosure evidence requirement 51",
    requirement: "Preserve attributable evidence sufficient to evaluate disclosure verification requirement 51.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves disclosure requirement 51 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-052",
    domain: "Claims",
    title: "Claims evidence requirement 52",
    requirement: "Preserve attributable evidence sufficient to evaluate claims verification requirement 52.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves claims requirement 52 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-053",
    domain: "Signature",
    title: "Signature evidence requirement 53",
    requirement: "Preserve attributable evidence sufficient to evaluate signature verification requirement 53.",
    minimumLevel: 2,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves signature requirement 53 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-054",
    domain: "Parity",
    title: "Parity evidence requirement 54",
    requirement: "Preserve attributable evidence sufficient to evaluate parity verification requirement 54.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves parity requirement 54 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-055",
    domain: "Replay",
    title: "Replay evidence requirement 55",
    requirement: "Preserve attributable evidence sufficient to evaluate replay verification requirement 55.",
    minimumLevel: 4,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves replay requirement 55 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-056",
    domain: "Execution",
    title: "Execution evidence requirement 56",
    requirement: "Preserve attributable evidence sufficient to evaluate execution verification requirement 56.",
    minimumLevel: 5,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves execution requirement 56 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-057",
    domain: "Outcome",
    title: "Outcome evidence requirement 57",
    requirement: "Preserve attributable evidence sufficient to evaluate outcome verification requirement 57.",
    minimumLevel: 6,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves outcome requirement 57 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-058",
    domain: "Review",
    title: "Review evidence requirement 58",
    requirement: "Preserve attributable evidence sufficient to evaluate review verification requirement 58.",
    minimumLevel: 7,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves review requirement 58 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-059",
    domain: "Challenge",
    title: "Challenge evidence requirement 59",
    requirement: "Preserve attributable evidence sufficient to evaluate challenge verification requirement 59.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves challenge requirement 59 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-060",
    domain: "Reliance",
    title: "Reliance evidence requirement 60",
    requirement: "Preserve attributable evidence sufficient to evaluate reliance verification requirement 60.",
    minimumLevel: 0,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves reliance requirement 60 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-061",
    domain: "Identity",
    title: "Identity evidence requirement 61",
    requirement: "Preserve attributable evidence sufficient to evaluate identity verification requirement 61.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves identity requirement 61 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-062",
    domain: "Governance",
    title: "Governance evidence requirement 62",
    requirement: "Preserve attributable evidence sufficient to evaluate governance verification requirement 62.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves governance requirement 62 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-063",
    domain: "Canonical",
    title: "Canonical evidence requirement 63",
    requirement: "Preserve attributable evidence sufficient to evaluate canonical verification requirement 63.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves canonical requirement 63 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-064",
    domain: "Registry",
    title: "Registry evidence requirement 64",
    requirement: "Preserve attributable evidence sufficient to evaluate registry verification requirement 64.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves registry requirement 64 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-065",
    domain: "Integrity",
    title: "Integrity evidence requirement 65",
    requirement: "Preserve attributable evidence sufficient to evaluate integrity verification requirement 65.",
    minimumLevel: 1,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves integrity requirement 65 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-066",
    domain: "Disclosure",
    title: "Disclosure evidence requirement 66",
    requirement: "Preserve attributable evidence sufficient to evaluate disclosure verification requirement 66.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves disclosure requirement 66 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-067",
    domain: "Claims",
    title: "Claims evidence requirement 67",
    requirement: "Preserve attributable evidence sufficient to evaluate claims verification requirement 67.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves claims requirement 67 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-068",
    domain: "Signature",
    title: "Signature evidence requirement 68",
    requirement: "Preserve attributable evidence sufficient to evaluate signature verification requirement 68.",
    minimumLevel: 2,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves signature requirement 68 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-069",
    domain: "Parity",
    title: "Parity evidence requirement 69",
    requirement: "Preserve attributable evidence sufficient to evaluate parity verification requirement 69.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves parity requirement 69 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-070",
    domain: "Replay",
    title: "Replay evidence requirement 70",
    requirement: "Preserve attributable evidence sufficient to evaluate replay verification requirement 70.",
    minimumLevel: 4,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves replay requirement 70 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-071",
    domain: "Execution",
    title: "Execution evidence requirement 71",
    requirement: "Preserve attributable evidence sufficient to evaluate execution verification requirement 71.",
    minimumLevel: 5,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves execution requirement 71 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-072",
    domain: "Outcome",
    title: "Outcome evidence requirement 72",
    requirement: "Preserve attributable evidence sufficient to evaluate outcome verification requirement 72.",
    minimumLevel: 6,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves outcome requirement 72 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-073",
    domain: "Review",
    title: "Review evidence requirement 73",
    requirement: "Preserve attributable evidence sufficient to evaluate review verification requirement 73.",
    minimumLevel: 7,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves review requirement 73 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-074",
    domain: "Challenge",
    title: "Challenge evidence requirement 74",
    requirement: "Preserve attributable evidence sufficient to evaluate challenge verification requirement 74.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves challenge requirement 74 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-075",
    domain: "Reliance",
    title: "Reliance evidence requirement 75",
    requirement: "Preserve attributable evidence sufficient to evaluate reliance verification requirement 75.",
    minimumLevel: 0,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves reliance requirement 75 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-076",
    domain: "Identity",
    title: "Identity evidence requirement 76",
    requirement: "Preserve attributable evidence sufficient to evaluate identity verification requirement 76.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves identity requirement 76 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-077",
    domain: "Governance",
    title: "Governance evidence requirement 77",
    requirement: "Preserve attributable evidence sufficient to evaluate governance verification requirement 77.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves governance requirement 77 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-078",
    domain: "Canonical",
    title: "Canonical evidence requirement 78",
    requirement: "Preserve attributable evidence sufficient to evaluate canonical verification requirement 78.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves canonical requirement 78 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-079",
    domain: "Registry",
    title: "Registry evidence requirement 79",
    requirement: "Preserve attributable evidence sufficient to evaluate registry verification requirement 79.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves registry requirement 79 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-080",
    domain: "Integrity",
    title: "Integrity evidence requirement 80",
    requirement: "Preserve attributable evidence sufficient to evaluate integrity verification requirement 80.",
    minimumLevel: 1,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves integrity requirement 80 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-081",
    domain: "Disclosure",
    title: "Disclosure evidence requirement 81",
    requirement: "Preserve attributable evidence sufficient to evaluate disclosure verification requirement 81.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves disclosure requirement 81 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-082",
    domain: "Claims",
    title: "Claims evidence requirement 82",
    requirement: "Preserve attributable evidence sufficient to evaluate claims verification requirement 82.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves claims requirement 82 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-083",
    domain: "Signature",
    title: "Signature evidence requirement 83",
    requirement: "Preserve attributable evidence sufficient to evaluate signature verification requirement 83.",
    minimumLevel: 2,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves signature requirement 83 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-084",
    domain: "Parity",
    title: "Parity evidence requirement 84",
    requirement: "Preserve attributable evidence sufficient to evaluate parity verification requirement 84.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves parity requirement 84 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-085",
    domain: "Replay",
    title: "Replay evidence requirement 85",
    requirement: "Preserve attributable evidence sufficient to evaluate replay verification requirement 85.",
    minimumLevel: 4,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves replay requirement 85 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-086",
    domain: "Execution",
    title: "Execution evidence requirement 86",
    requirement: "Preserve attributable evidence sufficient to evaluate execution verification requirement 86.",
    minimumLevel: 5,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves execution requirement 86 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-087",
    domain: "Outcome",
    title: "Outcome evidence requirement 87",
    requirement: "Preserve attributable evidence sufficient to evaluate outcome verification requirement 87.",
    minimumLevel: 6,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves outcome requirement 87 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-088",
    domain: "Review",
    title: "Review evidence requirement 88",
    requirement: "Preserve attributable evidence sufficient to evaluate review verification requirement 88.",
    minimumLevel: 7,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves review requirement 88 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-089",
    domain: "Challenge",
    title: "Challenge evidence requirement 89",
    requirement: "Preserve attributable evidence sufficient to evaluate challenge verification requirement 89.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves challenge requirement 89 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-090",
    domain: "Reliance",
    title: "Reliance evidence requirement 90",
    requirement: "Preserve attributable evidence sufficient to evaluate reliance verification requirement 90.",
    minimumLevel: 0,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves reliance requirement 90 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-091",
    domain: "Identity",
    title: "Identity evidence requirement 91",
    requirement: "Preserve attributable evidence sufficient to evaluate identity verification requirement 91.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves identity requirement 91 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-092",
    domain: "Governance",
    title: "Governance evidence requirement 92",
    requirement: "Preserve attributable evidence sufficient to evaluate governance verification requirement 92.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves governance requirement 92 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-093",
    domain: "Canonical",
    title: "Canonical evidence requirement 93",
    requirement: "Preserve attributable evidence sufficient to evaluate canonical verification requirement 93.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves canonical requirement 93 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-094",
    domain: "Registry",
    title: "Registry evidence requirement 94",
    requirement: "Preserve attributable evidence sufficient to evaluate registry verification requirement 94.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves registry requirement 94 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-095",
    domain: "Integrity",
    title: "Integrity evidence requirement 95",
    requirement: "Preserve attributable evidence sufficient to evaluate integrity verification requirement 95.",
    minimumLevel: 1,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves integrity requirement 95 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-096",
    domain: "Disclosure",
    title: "Disclosure evidence requirement 96",
    requirement: "Preserve attributable evidence sufficient to evaluate disclosure verification requirement 96.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves disclosure requirement 96 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-097",
    domain: "Claims",
    title: "Claims evidence requirement 97",
    requirement: "Preserve attributable evidence sufficient to evaluate claims verification requirement 97.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves claims requirement 97 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-098",
    domain: "Signature",
    title: "Signature evidence requirement 98",
    requirement: "Preserve attributable evidence sufficient to evaluate signature verification requirement 98.",
    minimumLevel: 2,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves signature requirement 98 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-099",
    domain: "Parity",
    title: "Parity evidence requirement 99",
    requirement: "Preserve attributable evidence sufficient to evaluate parity verification requirement 99.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves parity requirement 99 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-100",
    domain: "Replay",
    title: "Replay evidence requirement 100",
    requirement: "Preserve attributable evidence sufficient to evaluate replay verification requirement 100.",
    minimumLevel: 4,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves replay requirement 100 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-101",
    domain: "Execution",
    title: "Execution evidence requirement 101",
    requirement: "Preserve attributable evidence sufficient to evaluate execution verification requirement 101.",
    minimumLevel: 5,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves execution requirement 101 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-102",
    domain: "Outcome",
    title: "Outcome evidence requirement 102",
    requirement: "Preserve attributable evidence sufficient to evaluate outcome verification requirement 102.",
    minimumLevel: 6,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves outcome requirement 102 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-103",
    domain: "Review",
    title: "Review evidence requirement 103",
    requirement: "Preserve attributable evidence sufficient to evaluate review verification requirement 103.",
    minimumLevel: 7,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves review requirement 103 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-104",
    domain: "Challenge",
    title: "Challenge evidence requirement 104",
    requirement: "Preserve attributable evidence sufficient to evaluate challenge verification requirement 104.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves challenge requirement 104 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-105",
    domain: "Reliance",
    title: "Reliance evidence requirement 105",
    requirement: "Preserve attributable evidence sufficient to evaluate reliance verification requirement 105.",
    minimumLevel: 0,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves reliance requirement 105 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-106",
    domain: "Identity",
    title: "Identity evidence requirement 106",
    requirement: "Preserve attributable evidence sufficient to evaluate identity verification requirement 106.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves identity requirement 106 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-107",
    domain: "Governance",
    title: "Governance evidence requirement 107",
    requirement: "Preserve attributable evidence sufficient to evaluate governance verification requirement 107.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves governance requirement 107 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-108",
    domain: "Canonical",
    title: "Canonical evidence requirement 108",
    requirement: "Preserve attributable evidence sufficient to evaluate canonical verification requirement 108.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves canonical requirement 108 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-109",
    domain: "Registry",
    title: "Registry evidence requirement 109",
    requirement: "Preserve attributable evidence sufficient to evaluate registry verification requirement 109.",
    minimumLevel: 0,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves registry requirement 109 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-110",
    domain: "Integrity",
    title: "Integrity evidence requirement 110",
    requirement: "Preserve attributable evidence sufficient to evaluate integrity verification requirement 110.",
    minimumLevel: 1,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves integrity requirement 110 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-111",
    domain: "Disclosure",
    title: "Disclosure evidence requirement 111",
    requirement: "Preserve attributable evidence sufficient to evaluate disclosure verification requirement 111.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves disclosure requirement 111 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-112",
    domain: "Claims",
    title: "Claims evidence requirement 112",
    requirement: "Preserve attributable evidence sufficient to evaluate claims verification requirement 112.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves claims requirement 112 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-113",
    domain: "Signature",
    title: "Signature evidence requirement 113",
    requirement: "Preserve attributable evidence sufficient to evaluate signature verification requirement 113.",
    minimumLevel: 2,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves signature requirement 113 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-114",
    domain: "Parity",
    title: "Parity evidence requirement 114",
    requirement: "Preserve attributable evidence sufficient to evaluate parity verification requirement 114.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves parity requirement 114 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-115",
    domain: "Replay",
    title: "Replay evidence requirement 115",
    requirement: "Preserve attributable evidence sufficient to evaluate replay verification requirement 115.",
    minimumLevel: 4,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves replay requirement 115 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-116",
    domain: "Execution",
    title: "Execution evidence requirement 116",
    requirement: "Preserve attributable evidence sufficient to evaluate execution verification requirement 116.",
    minimumLevel: 5,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves execution requirement 116 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-117",
    domain: "Outcome",
    title: "Outcome evidence requirement 117",
    requirement: "Preserve attributable evidence sufficient to evaluate outcome verification requirement 117.",
    minimumLevel: 6,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves outcome requirement 117 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-118",
    domain: "Review",
    title: "Review evidence requirement 118",
    requirement: "Preserve attributable evidence sufficient to evaluate review verification requirement 118.",
    minimumLevel: 7,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves review requirement 118 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-119",
    domain: "Challenge",
    title: "Challenge evidence requirement 119",
    requirement: "Preserve attributable evidence sufficient to evaluate challenge verification requirement 119.",
    minimumLevel: 3,
    mandatory: true,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves challenge requirement 119 for this exact artifact version?",
  }),
  Object.freeze({
    evidenceId: "VEF-120",
    domain: "Reliance",
    title: "Reliance evidence requirement 120",
    requirement: "Preserve attributable evidence sufficient to evaluate reliance verification requirement 120.",
    minimumLevel: 0,
    mandatory: false,
    acceptedFormats: Object.freeze(["JSON", "PDF", "MANIFEST", "SIGNED_RECEIPT"]),
    verificationQuestion: "What evidence proves reliance requirement 120 for this exact artifact version?",
  }),
]);

export function listVerificationEvidenceCatalog(domain?: VerificationDomain, level?: VerificationLevel): VerificationEvidenceCatalogEntry[] {
  return VERIFICATION_EVIDENCE_CATALOG.filter((entry) =>
    (!domain || entry.domain === domain) &&
    (level === undefined || entry.minimumLevel <= level),
  );
}

export interface RelianceUsePolicy {
  policyId: string;
  use: RelianceUse;
  minimumLevel: VerificationLevel;
  minimumBand: RelianceBand;
  humanReviewRequired: boolean;
  publicRegistryRequired: boolean;
  openChallengeAllowed: boolean;
  statement: string;
}

export const RELIANCE_USE_POLICIES: readonly RelianceUsePolicy[] = Object.freeze([
  Object.freeze({ policyId: "RUP-001", use: "DISCOVERY", minimumLevel: 0, minimumBand: "DECLARED_ONLY", humanReviewRequired: false, publicRegistryRequired: true, openChallengeAllowed: true, statement: "Discovery use supports orientation only and does not support consequential reliance." }),
  Object.freeze({ policyId: "RUP-002", use: "INTERNAL_REVIEW", minimumLevel: 1, minimumBand: "LIMITED", humanReviewRequired: true, publicRegistryRequired: false, openChallengeAllowed: true, statement: "Internal review may consider package integrity while preserving unresolved limitations." }),
  Object.freeze({ policyId: "RUP-003", use: "PROCUREMENT", minimumLevel: 3, minimumBand: "MODERATE", humanReviewRequired: true, publicRegistryRequired: true, openChallengeAllowed: false, statement: "Procurement reliance requires record parity and explicit claims-boundary review." }),
  Object.freeze({ policyId: "RUP-004", use: "CONTRACTING", minimumLevel: 3, minimumBand: "MODERATE", humanReviewRequired: true, publicRegistryRequired: true, openChallengeAllowed: false, statement: "Contracting reliance requires stable identity, parity, and preserved limitations." }),
  Object.freeze({ policyId: "RUP-005", use: "AUDIT", minimumLevel: 5, minimumBand: "SUBSTANTIAL", humanReviewRequired: true, publicRegistryRequired: true, openChallengeAllowed: false, statement: "Audit reliance requires verified execution effect and attributable technical receipts." }),
  Object.freeze({ policyId: "RUP-006", use: "REGULATORY", minimumLevel: 6, minimumBand: "SUBSTANTIAL", humanReviewRequired: true, publicRegistryRequired: true, openChallengeAllowed: false, statement: "Regulatory reliance requires verified outcome closure and current registry status." }),
  Object.freeze({ policyId: "RUP-007", use: "RESEARCH", minimumLevel: 1, minimumBand: "LIMITED", humanReviewRequired: false, publicRegistryRequired: true, openChallengeAllowed: true, statement: "Research use must preserve artifact boundaries and challenge status." }),
  Object.freeze({ policyId: "RUP-008", use: "LITIGATION_SUPPORT", minimumLevel: 6, minimumBand: "SUBSTANTIAL", humanReviewRequired: true, publicRegistryRequired: true, openChallengeAllowed: false, statement: "Litigation support requires verified outcome closure and explicit evidentiary limitations." }),
]);

export function relianceUsePolicy(use: RelianceUse): RelianceUsePolicy {
  const policy = RELIANCE_USE_POLICIES.find((entry) => entry.use === use);
  if (!policy) throw new Error(`No reliance policy is defined for ${use}.`);
  return policy;
}

export const VERIFICATION_LEVEL_REQUIREMENTS: Readonly<Record<VerificationLevel, readonly string[]>> = Object.freeze({
  0: Object.freeze(["Attributable publisher declaration", "Stable artifact identity", "Registered governance linkage"]),
  1: Object.freeze(["Canonical hash", "Package root hash", "Manifest hash", "Component integrity checks"]),
  2: Object.freeze(["Signature envelope", "Trusted signing key", "Unexpired signing credential", "Payload hash parity"]),
  3: Object.freeze(["Canonical JSON parity", "PDF parity", "Manifest parity", "Route snapshot parity", "Receipt parity"]),
  4: Object.freeze(["Permitted replay", "Equivalent environment", "Route-version parity", "Determination reproduction"]),
  5: Object.freeze(["Authentic technical receipt", "Determination-effect parity", "Token-state verification", "Bypass handling"]),
  6: Object.freeze(["Outcome evidence", "Verifier identity", "Receipt-outcome parity", "Residual risk", "Follow-up obligations"]),
  7: Object.freeze(["Qualified independent reviewer", "Bounded review scope", "Signed opinion", "Published limitations"]),
});
