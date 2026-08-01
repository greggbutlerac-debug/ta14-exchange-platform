/**
 * TA-14 Authority | Governance Institution
 * Execution Artifact Disclosure & Redaction Policy Engine
 * Version 1.0.0 | August 2026
 *
 * Governing rule:
 * Proof may be public without forcing protected content to become public.
 * The canonical record remains immutable. This engine creates attributable,
 * deterministic disclosure projections and never edits the source artifact.
 */

import {
  type CanonicalExecutionArtifact,
  type DisclosureState,
  type EvidenceRecord,
  type AuthorityRecord,
  type ValidationIssue,
  validateCanonicalExecutionArtifact,
  stableValidationJson,
} from "./canonical-record-validator";
import {
  type ArtifactRegistryRecord,
  type RegistryPublicationState,
  verifyRegistryRecord,
  stableRegistryRecordJson,
} from "./artifact-registry-engine";

export const TA14_DISCLOSURE_ENGINE_VERSION = "1.0.0" as const;
export const TA14_DISCLOSURE_POLICY_VERSION = "1.0" as const;
export const TA14_DISCLOSURE_RULE = "PROVE WITHOUT UNAUTHORIZED DISCLOSURE" as const;

export type DisclosureView = "PUBLIC" | "SELECTIVE" | "RESTRICTED" | "WITHHELD";
export type DisclosureDecision = "APPROVE" | "HOLD" | "ESCALATE" | "DENY";
export type DisclosureControlResult = "PASS" | "HOLD" | "FAIL" | "ESCALATE" | "NOT_APPLICABLE";
export type RedactionAction = "KEEP" | "MASK" | "SUMMARIZE" | "HASH_ONLY" | "WITHHOLD" | "REMOVE";
export type SensitiveDataClass =
  | "NONE"
  | "PII"
  | "PHI"
  | "CREDENTIAL"
  | "PRIVATE_KEY"
  | "TRADE_SECRET"
  | "PROPRIETARY_LOGIC"
  | "INTERNAL_PROMPT"
  | "SECURITY_DETAIL"
  | "COMMERCIAL_CONFIDENCE"
  | "LEGAL_PRIVILEGE"
  | "REGULATED_DATA";
export type DisclosureReasonDisposition = "PASS" | "HOLD" | "DENY" | "ESCALATE";
export type DisclosureReasonDomain =
  | "POLICY"
  | "REQUEST"
  | "ARTIFACT"
  | "CLASSIFICATION"
  | "PRIVACY"
  | "SECURITY"
  | "PROPRIETARY"
  | "CLAIMS"
  | "REDACTION"
  | "INTEGRITY"
  | "AUDIT"
  | "ACCESS"
  | "EVIDENCE"
  | "AUTHORITY"
  | "OUTCOME"
  | "EXECUTION"
  | "RELIANCE"
  | "PUBLICATION";

export interface DisclosurePolicyProfile {
  profileId: string;
  version: string;
  name: string;
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "RETIRED";
  permittedViews: readonly DisclosureView[];
  defaultView: DisclosureView;
  publicFieldRules: Readonly<Record<string, RedactionAction>>;
  selectiveFieldRules: Readonly<Record<string, RedactionAction>>;
  restrictedFieldRules: Readonly<Record<string, RedactionAction>>;
  withheldFieldRules: Readonly<Record<string, RedactionAction>>;
  sensitiveClassRules: Readonly<Record<SensitiveDataClass, RedactionAction>>;
  mandatoryPublicFields: readonly string[];
  prohibitedPublicPatterns: readonly string[];
  requiredClaimsBoundaryStatements: readonly string[];
  createdAt: string;
  effectiveAt: string;
  expiresAt?: string;
  owner: string;
  steward: string;
}

export interface DisclosureAuthority {
  authorityId: string;
  actorId: string;
  actorName: string;
  role: string;
  source: string;
  permittedViews: readonly DisclosureView[];
  artifactScopes: readonly string[];
  governanceRegistrationIds: readonly string[];
  validFrom: string;
  validUntil?: string;
  revokedAt?: string;
  revocationReason?: string;
}

export interface DisclosureRecipient {
  recipientId: string;
  name: string;
  organization?: string;
  role: string;
  purpose: string;
  permittedView: DisclosureView;
  agreementId?: string;
  agreementExpiresAt?: string;
  verifiedAt?: string;
}

export interface DisclosureRequest {
  requestId: string;
  requestedAt: string;
  requestedView: DisclosureView;
  artifact: CanonicalExecutionArtifact;
  registryRecord: ArtifactRegistryRecord;
  policy: DisclosurePolicyProfile;
  authority: DisclosureAuthority;
  recipient?: DisclosureRecipient;
  purpose: string;
  requestedBy: string;
  outputMode: "PDF" | "JSON" | "REGISTRY_PAGE" | "PACKAGE" | "API";
  previousProjectionVersions?: readonly string[];
  customFieldOverrides?: Readonly<Record<string, RedactionAction>>;
  now?: string;
}

export interface RedactionEntry {
  redactionId: string;
  fieldPath: string;
  sourceDomain: string;
  originalClassification: DisclosureState | SensitiveDataClass;
  action: RedactionAction;
  reasonCode: DisclosureReasonCode;
  reason: string;
  policyProfileId: string;
  policyVersion: string;
  authorityId: string;
  decidedAt: string;
  contentCommitment: string;
  replacementValue?: unknown;
  reviewerNote?: string;
}

export interface DisclosureManifest {
  manifestId: string;
  artifactId: string;
  registryId: string;
  governanceRegistrationId: string;
  projectionVersion: string;
  requestedView: DisclosureView;
  outputMode: DisclosureRequest["outputMode"];
  policyProfileId: string;
  policyVersion: string;
  authorityId: string;
  recipientId?: string;
  generatedAt: string;
  sourceCanonicalHash: string;
  sourceRegistryHash: string;
  projectionHash: string;
  manifestHash: string;
  redactions: readonly RedactionEntry[];
  disclosedFieldCount: number;
  summarizedFieldCount: number;
  hashOnlyFieldCount: number;
  withheldFieldCount: number;
  removedFieldCount: number;
  verificationLimits: readonly string[];
  claimsBoundary: readonly string[];
}

export interface DisclosureProjection {
  artifactId: string;
  registryId: string;
  governanceRegistrationId: string;
  view: DisclosureView;
  projectionVersion: string;
  generatedAt: string;
  classification: string;
  identity: Record<string, unknown>;
  scenario: Record<string, unknown>;
  route: Record<string, unknown>;
  evidence: readonly Record<string, unknown>[];
  authority: readonly Record<string, unknown>[];
  continuity: Record<string, unknown>;
  gateLedger: Record<string, unknown>;
  commit: Record<string, unknown>;
  executionEffect: Record<string, unknown>;
  outcome: Record<string, unknown>;
  integrity: Record<string, unknown>;
  reviewStatus: Record<string, unknown>;
  registry: Record<string, unknown>;
  claimsBoundary: readonly string[];
  verificationLimits: readonly string[];
  disclosureNotice: string;
}

export interface DisclosureReasonDefinition {
  code: DisclosureReasonCode;
  disposition: DisclosureReasonDisposition;
  domain: DisclosureReasonDomain;
  title: string;
  description: string;
  publicMessage: string;
  repairable: boolean;
}

export interface DisclosureIssue {
  code: DisclosureReasonCode;
  disposition: DisclosureReasonDisposition;
  domain: DisclosureReasonDomain;
  path: string;
  message: string;
  repair?: string;
}

export interface DisclosureControlDefinition {
  controlId: string;
  domain: string;
  title: string;
  requirement: string;
}

export interface DisclosureControlEvaluation {
  controlId: string;
  result: DisclosureControlResult;
  message: string;
  issueCodes: readonly DisclosureReasonCode[];
}

export interface DisclosureDecisionResult {
  decisionId: string;
  requestId: string;
  decision: DisclosureDecision;
  requestedView: DisclosureView;
  effectiveView?: DisclosureView;
  evaluatedAt: string;
  issues: readonly DisclosureIssue[];
  controls: readonly DisclosureControlEvaluation[];
  projection?: DisclosureProjection;
  manifest?: DisclosureManifest;
  canonicalValidationIssues: readonly ValidationIssue[];
  registryVerificationIssueCount: number;
  stableJson: string;
}

export interface DisclosurePackage {
  projection: DisclosureProjection;
  manifest: DisclosureManifest;
  decision: DisclosureDecisionResult;
  projectionJson: string;
  manifestJson: string;
  packageHash: string;
}

export type DisclosureReasonCode =
  | "POLICY_PROFILE_MISSING"
  | "POLICY_PROFILE_ID_MISSING"
  | "POLICY_VERSION_MISSING"
  | "POLICY_STATUS_INACTIVE"
  | "REQUESTED_VIEW_MISSING"
  | "REQUESTED_VIEW_UNSUPPORTED"
  | "REQUESTOR_IDENTITY_MISSING"
  | "REQUESTOR_ROLE_MISSING"
  | "REQUESTOR_AUTHORITY_MISSING"
  | "REQUESTOR_AUTHORITY_EXPIRED"
  | "REQUESTOR_AUTHORITY_REVOKED"
  | "REQUESTOR_SCOPE_MISMATCH"
  | "ARTIFACT_ID_MISSING"
  | "ARTIFACT_NOT_REGISTERED"
  | "GOVERNANCE_REGISTRATION_MISSING"
  | "REGISTRY_STATE_NOT_DISCLOSABLE"
  | "CANONICAL_RECORD_INVALID"
  | "CANONICAL_RECORD_HASH_MISSING"
  | "REGISTRY_HASH_MISMATCH"
  | "DISCLOSURE_CLASSIFICATION_MISSING"
  | "DISCLOSURE_CLASSIFICATION_INVALID"
  | "PUBLIC_PII_PRESENT"
  | "PUBLIC_PHI_PRESENT"
  | "PUBLIC_SECRET_PRESENT"
  | "PUBLIC_CREDENTIAL_PRESENT"
  | "PUBLIC_PRIVATE_KEY_PRESENT"
  | "PUBLIC_SECURITY_DETAIL_PRESENT"
  | "PUBLIC_PROPRIETARY_LOGIC_PRESENT"
  | "PUBLIC_INTERNAL_PROMPT_PRESENT"
  | "PUBLIC_TRADE_SECRET_PRESENT"
  | "UNBOUNDED_SUMMARY"
  | "CLAIMS_BOUNDARY_MISSING"
  | "CLAIMS_BOUNDARY_OVERSTATED"
  | "VERIFICATION_LIMITS_MISSING"
  | "DIRECT_VERIFICATION_MISREPRESENTED"
  | "REDACTION_REASON_MISSING"
  | "REDACTION_POLICY_MISSING"
  | "REDACTION_AUTHORITY_MISSING"
  | "REDACTION_TIMESTAMP_INVALID"
  | "REDACTION_PATH_INVALID"
  | "REDACTION_ACTION_INVALID"
  | "REDACTION_COMMITMENT_MISSING"
  | "REDACTION_MANIFEST_MISSING"
  | "REDACTION_MANIFEST_INCOMPLETE"
  | "REDACTION_MANIFEST_HASH_MISSING"
  | "PROJECTION_HASH_MISSING"
  | "PROJECTION_HASH_MISMATCH"
  | "SOURCE_RECORD_MUTATED"
  | "DISCLOSURE_EVENT_MISSING"
  | "DISCLOSURE_EVENT_INCOMPLETE"
  | "DISCLOSURE_DECISION_UNATTRIBUTED"
  | "DISCLOSURE_DECISION_NOT_FROZEN"
  | "DISCLOSURE_VERSION_MISSING"
  | "DISCLOSURE_VERSION_REUSED"
  | "SELECTIVE_RECIPIENT_MISSING"
  | "SELECTIVE_RECIPIENT_UNAUTHORIZED"
  | "RESTRICTED_REVIEWER_MISSING"
  | "RESTRICTED_REVIEWER_UNQUALIFIED"
  | "WITHHELD_EXISTENCE_NOT_DISCLOSED"
  | "WITHHELD_REVIEW_STATUS_MISSING"
  | "EVIDENCE_DISCLOSURE_MISMATCH"
  | "AUTHORITY_DISCLOSURE_MISMATCH"
  | "OUTCOME_DISCLOSURE_MISMATCH"
  | "EXECUTION_RECEIPT_OVEREXPOSED"
  | "EXECUTION_RECEIPT_UNVERIFIABLE"
  | "CHALLENGE_STATUS_HIDDEN"
  | "CORRECTION_STATUS_HIDDEN"
  | "SUPERSESSION_STATUS_HIDDEN"
  | "WITHDRAWAL_STATUS_HIDDEN"
  | "PUBLICATION_MODE_MISMATCH"
  | "PDF_MODE_MISMATCH"
  | "EXPORT_PARITY_FAILURE"
  | "DISCLOSURE_APPROVED";

export const DISCLOSURE_REASON_DICTIONARY: Readonly<Record<DisclosureReasonCode, DisclosureReasonDefinition>> = Object.freeze({
  POLICY_PROFILE_MISSING: Object.freeze({ code: "POLICY_PROFILE_MISSING", disposition: "DENY", domain: "POLICY", title: "Policy Profile Missing", description: "Disclosure policy profile is missing.", publicMessage: "Disclosure policy profile is missing.", repairable: false }),
  POLICY_PROFILE_ID_MISSING: Object.freeze({ code: "POLICY_PROFILE_ID_MISSING", disposition: "DENY", domain: "POLICY", title: "Policy Profile Id Missing", description: "Disclosure policy profile ID is missing.", publicMessage: "Disclosure policy profile ID is missing.", repairable: false }),
  POLICY_VERSION_MISSING: Object.freeze({ code: "POLICY_VERSION_MISSING", disposition: "DENY", domain: "POLICY", title: "Policy Version Missing", description: "Disclosure policy version is missing.", publicMessage: "Disclosure policy version is missing.", repairable: false }),
  POLICY_STATUS_INACTIVE: Object.freeze({ code: "POLICY_STATUS_INACTIVE", disposition: "DENY", domain: "POLICY", title: "Policy Status Inactive", description: "Disclosure policy is not active.", publicMessage: "Disclosure policy is not active.", repairable: false }),
  REQUESTED_VIEW_MISSING: Object.freeze({ code: "REQUESTED_VIEW_MISSING", disposition: "DENY", domain: "REQUEST", title: "Requested View Missing", description: "Requested disclosure view is missing.", publicMessage: "Requested disclosure view is missing.", repairable: false }),
  REQUESTED_VIEW_UNSUPPORTED: Object.freeze({ code: "REQUESTED_VIEW_UNSUPPORTED", disposition: "DENY", domain: "REQUEST", title: "Requested View Unsupported", description: "Requested disclosure view is unsupported.", publicMessage: "Requested disclosure view is unsupported.", repairable: false }),
  REQUESTOR_IDENTITY_MISSING: Object.freeze({ code: "REQUESTOR_IDENTITY_MISSING", disposition: "DENY", domain: "REQUEST", title: "Requestor Identity Missing", description: "Requestor identity is missing.", publicMessage: "Requestor identity is missing.", repairable: false }),
  REQUESTOR_ROLE_MISSING: Object.freeze({ code: "REQUESTOR_ROLE_MISSING", disposition: "DENY", domain: "REQUEST", title: "Requestor Role Missing", description: "Requestor role is missing.", publicMessage: "Requestor role is missing.", repairable: false }),
  REQUESTOR_AUTHORITY_MISSING: Object.freeze({ code: "REQUESTOR_AUTHORITY_MISSING", disposition: "DENY", domain: "REQUEST", title: "Requestor Authority Missing", description: "Requestor disclosure authority is missing.", publicMessage: "Requestor disclosure authority is missing.", repairable: false }),
  REQUESTOR_AUTHORITY_EXPIRED: Object.freeze({ code: "REQUESTOR_AUTHORITY_EXPIRED", disposition: "DENY", domain: "REQUEST", title: "Requestor Authority Expired", description: "Requestor disclosure authority has expired.", publicMessage: "Requestor disclosure authority has expired.", repairable: false }),
  REQUESTOR_AUTHORITY_REVOKED: Object.freeze({ code: "REQUESTOR_AUTHORITY_REVOKED", disposition: "DENY", domain: "REQUEST", title: "Requestor Authority Revoked", description: "Requestor disclosure authority has been revoked.", publicMessage: "Requestor disclosure authority has been revoked.", repairable: false }),
  REQUESTOR_SCOPE_MISMATCH: Object.freeze({ code: "REQUESTOR_SCOPE_MISMATCH", disposition: "DENY", domain: "REQUEST", title: "Requestor Scope Mismatch", description: "Requestor scope does not cover the artifact.", publicMessage: "Requestor scope does not cover the artifact.", repairable: false }),
  ARTIFACT_ID_MISSING: Object.freeze({ code: "ARTIFACT_ID_MISSING", disposition: "DENY", domain: "ARTIFACT", title: "Artifact Id Missing", description: "Artifact ID is missing.", publicMessage: "Artifact ID is missing.", repairable: false }),
  ARTIFACT_NOT_REGISTERED: Object.freeze({ code: "ARTIFACT_NOT_REGISTERED", disposition: "DENY", domain: "ARTIFACT", title: "Artifact Not Registered", description: "Artifact is not registered.", publicMessage: "Artifact is not registered.", repairable: false }),
  GOVERNANCE_REGISTRATION_MISSING: Object.freeze({ code: "GOVERNANCE_REGISTRATION_MISSING", disposition: "DENY", domain: "ARTIFACT", title: "Governance Registration Missing", description: "Registered governance linkage is missing.", publicMessage: "Registered governance linkage is missing.", repairable: false }),
  REGISTRY_STATE_NOT_DISCLOSABLE: Object.freeze({ code: "REGISTRY_STATE_NOT_DISCLOSABLE", disposition: "DENY", domain: "ARTIFACT", title: "Registry State Not Disclosable", description: "Registry state does not permit disclosure.", publicMessage: "Registry state does not permit disclosure.", repairable: false }),
  CANONICAL_RECORD_INVALID: Object.freeze({ code: "CANONICAL_RECORD_INVALID", disposition: "DENY", domain: "ARTIFACT", title: "Canonical Record Invalid", description: "Canonical record is invalid.", publicMessage: "Canonical record is invalid.", repairable: false }),
  CANONICAL_RECORD_HASH_MISSING: Object.freeze({ code: "CANONICAL_RECORD_HASH_MISSING", disposition: "DENY", domain: "INTEGRITY", title: "Canonical Record Hash Missing", description: "Canonical record hash is missing.", publicMessage: "Canonical record hash is missing.", repairable: false }),
  REGISTRY_HASH_MISMATCH: Object.freeze({ code: "REGISTRY_HASH_MISMATCH", disposition: "DENY", domain: "INTEGRITY", title: "Registry Hash Mismatch", description: "Registry and canonical hashes do not match.", publicMessage: "Registry and canonical hashes do not match.", repairable: false }),
  DISCLOSURE_CLASSIFICATION_MISSING: Object.freeze({ code: "DISCLOSURE_CLASSIFICATION_MISSING", disposition: "DENY", domain: "CLASSIFICATION", title: "Disclosure Classification Missing", description: "Disclosure classification is missing.", publicMessage: "Disclosure classification is missing.", repairable: false }),
  DISCLOSURE_CLASSIFICATION_INVALID: Object.freeze({ code: "DISCLOSURE_CLASSIFICATION_INVALID", disposition: "DENY", domain: "CLASSIFICATION", title: "Disclosure Classification Invalid", description: "Disclosure classification is invalid.", publicMessage: "Disclosure classification is invalid.", repairable: false }),
  PUBLIC_PII_PRESENT: Object.freeze({ code: "PUBLIC_PII_PRESENT", disposition: "DENY", domain: "PRIVACY", title: "Public Pii Present", description: "Public projection contains personal information.", publicMessage: "Public projection contains personal information.", repairable: false }),
  PUBLIC_PHI_PRESENT: Object.freeze({ code: "PUBLIC_PHI_PRESENT", disposition: "DENY", domain: "PRIVACY", title: "Public Phi Present", description: "Public projection contains protected health information.", publicMessage: "Public projection contains protected health information.", repairable: false }),
  PUBLIC_SECRET_PRESENT: Object.freeze({ code: "PUBLIC_SECRET_PRESENT", disposition: "DENY", domain: "SECURITY", title: "Public Secret Present", description: "Public projection contains secret material.", publicMessage: "Public projection contains secret material.", repairable: false }),
  PUBLIC_CREDENTIAL_PRESENT: Object.freeze({ code: "PUBLIC_CREDENTIAL_PRESENT", disposition: "DENY", domain: "SECURITY", title: "Public Credential Present", description: "Public projection contains credentials.", publicMessage: "Public projection contains credentials.", repairable: false }),
  PUBLIC_PRIVATE_KEY_PRESENT: Object.freeze({ code: "PUBLIC_PRIVATE_KEY_PRESENT", disposition: "DENY", domain: "SECURITY", title: "Public Private Key Present", description: "Public projection contains a private key.", publicMessage: "Public projection contains a private key.", repairable: false }),
  PUBLIC_SECURITY_DETAIL_PRESENT: Object.freeze({ code: "PUBLIC_SECURITY_DETAIL_PRESENT", disposition: "ESCALATE", domain: "SECURITY", title: "Public Security Detail Present", description: "Public projection contains sensitive security detail.", publicMessage: "Public projection contains sensitive security detail.", repairable: true }),
  PUBLIC_PROPRIETARY_LOGIC_PRESENT: Object.freeze({ code: "PUBLIC_PROPRIETARY_LOGIC_PRESENT", disposition: "ESCALATE", domain: "PROPRIETARY", title: "Public Proprietary Logic Present", description: "Public projection contains proprietary logic.", publicMessage: "Public projection contains proprietary logic.", repairable: true }),
  PUBLIC_INTERNAL_PROMPT_PRESENT: Object.freeze({ code: "PUBLIC_INTERNAL_PROMPT_PRESENT", disposition: "ESCALATE", domain: "PROPRIETARY", title: "Public Internal Prompt Present", description: "Public projection contains an internal prompt.", publicMessage: "Public projection contains an internal prompt.", repairable: true }),
  PUBLIC_TRADE_SECRET_PRESENT: Object.freeze({ code: "PUBLIC_TRADE_SECRET_PRESENT", disposition: "DENY", domain: "PROPRIETARY", title: "Public Trade Secret Present", description: "Public projection contains a trade secret.", publicMessage: "Public projection contains a trade secret.", repairable: false }),
  UNBOUNDED_SUMMARY: Object.freeze({ code: "UNBOUNDED_SUMMARY", disposition: "HOLD", domain: "CLAIMS", title: "Unbounded Summary", description: "A disclosed summary is not bounded.", publicMessage: "A disclosed summary is not bounded.", repairable: true }),
  CLAIMS_BOUNDARY_MISSING: Object.freeze({ code: "CLAIMS_BOUNDARY_MISSING", disposition: "DENY", domain: "CLAIMS", title: "Claims Boundary Missing", description: "Claims boundary is missing.", publicMessage: "Claims boundary is missing.", repairable: false }),
  CLAIMS_BOUNDARY_OVERSTATED: Object.freeze({ code: "CLAIMS_BOUNDARY_OVERSTATED", disposition: "DENY", domain: "CLAIMS", title: "Claims Boundary Overstated", description: "Claims boundary overstates disclosed proof.", publicMessage: "Claims boundary overstates disclosed proof.", repairable: false }),
  VERIFICATION_LIMITS_MISSING: Object.freeze({ code: "VERIFICATION_LIMITS_MISSING", disposition: "HOLD", domain: "CLAIMS", title: "Verification Limits Missing", description: "Verification limits are missing.", publicMessage: "Verification limits are missing.", repairable: true }),
  DIRECT_VERIFICATION_MISREPRESENTED: Object.freeze({ code: "DIRECT_VERIFICATION_MISREPRESENTED", disposition: "DENY", domain: "CLAIMS", title: "Direct Verification Misrepresented", description: "Controlled review is represented as direct public verification.", publicMessage: "Controlled review is represented as direct public verification.", repairable: false }),
  REDACTION_REASON_MISSING: Object.freeze({ code: "REDACTION_REASON_MISSING", disposition: "HOLD", domain: "REDACTION", title: "Redaction Reason Missing", description: "A redaction reason is missing.", publicMessage: "A redaction reason is missing.", repairable: true }),
  REDACTION_POLICY_MISSING: Object.freeze({ code: "REDACTION_POLICY_MISSING", disposition: "HOLD", domain: "REDACTION", title: "Redaction Policy Missing", description: "A redaction policy reference is missing.", publicMessage: "A redaction policy reference is missing.", repairable: true }),
  REDACTION_AUTHORITY_MISSING: Object.freeze({ code: "REDACTION_AUTHORITY_MISSING", disposition: "DENY", domain: "REDACTION", title: "Redaction Authority Missing", description: "Redaction authority is missing.", publicMessage: "Redaction authority is missing.", repairable: false }),
  REDACTION_TIMESTAMP_INVALID: Object.freeze({ code: "REDACTION_TIMESTAMP_INVALID", disposition: "HOLD", domain: "REDACTION", title: "Redaction Timestamp Invalid", description: "Redaction timestamp is invalid.", publicMessage: "Redaction timestamp is invalid.", repairable: true }),
  REDACTION_PATH_INVALID: Object.freeze({ code: "REDACTION_PATH_INVALID", disposition: "DENY", domain: "REDACTION", title: "Redaction Path Invalid", description: "Redaction field path is invalid.", publicMessage: "Redaction field path is invalid.", repairable: false }),
  REDACTION_ACTION_INVALID: Object.freeze({ code: "REDACTION_ACTION_INVALID", disposition: "DENY", domain: "REDACTION", title: "Redaction Action Invalid", description: "Redaction action is invalid.", publicMessage: "Redaction action is invalid.", repairable: false }),
  REDACTION_COMMITMENT_MISSING: Object.freeze({ code: "REDACTION_COMMITMENT_MISSING", disposition: "DENY", domain: "INTEGRITY", title: "Redaction Commitment Missing", description: "Hidden content lacks an integrity commitment.", publicMessage: "Hidden content lacks an integrity commitment.", repairable: false }),
  REDACTION_MANIFEST_MISSING: Object.freeze({ code: "REDACTION_MANIFEST_MISSING", disposition: "DENY", domain: "REDACTION", title: "Redaction Manifest Missing", description: "Redaction manifest is missing.", publicMessage: "Redaction manifest is missing.", repairable: false }),
  REDACTION_MANIFEST_INCOMPLETE: Object.freeze({ code: "REDACTION_MANIFEST_INCOMPLETE", disposition: "HOLD", domain: "REDACTION", title: "Redaction Manifest Incomplete", description: "Redaction manifest is incomplete.", publicMessage: "Redaction manifest is incomplete.", repairable: true }),
  REDACTION_MANIFEST_HASH_MISSING: Object.freeze({ code: "REDACTION_MANIFEST_HASH_MISSING", disposition: "DENY", domain: "INTEGRITY", title: "Redaction Manifest Hash Missing", description: "Redaction manifest hash is missing.", publicMessage: "Redaction manifest hash is missing.", repairable: false }),
  PROJECTION_HASH_MISSING: Object.freeze({ code: "PROJECTION_HASH_MISSING", disposition: "DENY", domain: "INTEGRITY", title: "Projection Hash Missing", description: "Disclosure projection hash is missing.", publicMessage: "Disclosure projection hash is missing.", repairable: false }),
  PROJECTION_HASH_MISMATCH: Object.freeze({ code: "PROJECTION_HASH_MISMATCH", disposition: "DENY", domain: "INTEGRITY", title: "Projection Hash Mismatch", description: "Disclosure projection hash does not match.", publicMessage: "Disclosure projection hash does not match.", repairable: false }),
  SOURCE_RECORD_MUTATED: Object.freeze({ code: "SOURCE_RECORD_MUTATED", disposition: "DENY", domain: "INTEGRITY", title: "Source Record Mutated", description: "Canonical source record was mutated during projection.", publicMessage: "Canonical source record was mutated during projection.", repairable: false }),
  DISCLOSURE_EVENT_MISSING: Object.freeze({ code: "DISCLOSURE_EVENT_MISSING", disposition: "HOLD", domain: "AUDIT", title: "Disclosure Event Missing", description: "Disclosure audit event is missing.", publicMessage: "Disclosure audit event is missing.", repairable: true }),
  DISCLOSURE_EVENT_INCOMPLETE: Object.freeze({ code: "DISCLOSURE_EVENT_INCOMPLETE", disposition: "HOLD", domain: "AUDIT", title: "Disclosure Event Incomplete", description: "Disclosure audit event is incomplete.", publicMessage: "Disclosure audit event is incomplete.", repairable: true }),
  DISCLOSURE_DECISION_UNATTRIBUTED: Object.freeze({ code: "DISCLOSURE_DECISION_UNATTRIBUTED", disposition: "DENY", domain: "AUDIT", title: "Disclosure Decision Unattributed", description: "Disclosure decision is unattributed.", publicMessage: "Disclosure decision is unattributed.", repairable: false }),
  DISCLOSURE_DECISION_NOT_FROZEN: Object.freeze({ code: "DISCLOSURE_DECISION_NOT_FROZEN", disposition: "HOLD", domain: "AUDIT", title: "Disclosure Decision Not Frozen", description: "Disclosure decision is not frozen.", publicMessage: "Disclosure decision is not frozen.", repairable: true }),
  DISCLOSURE_VERSION_MISSING: Object.freeze({ code: "DISCLOSURE_VERSION_MISSING", disposition: "HOLD", domain: "AUDIT", title: "Disclosure Version Missing", description: "Disclosure version is missing.", publicMessage: "Disclosure version is missing.", repairable: true }),
  DISCLOSURE_VERSION_REUSED: Object.freeze({ code: "DISCLOSURE_VERSION_REUSED", disposition: "DENY", domain: "AUDIT", title: "Disclosure Version Reused", description: "Disclosure version was reused.", publicMessage: "Disclosure version was reused.", repairable: false }),
  SELECTIVE_RECIPIENT_MISSING: Object.freeze({ code: "SELECTIVE_RECIPIENT_MISSING", disposition: "DENY", domain: "ACCESS", title: "Selective Recipient Missing", description: "Selective disclosure recipient is missing.", publicMessage: "Selective disclosure recipient is missing.", repairable: false }),
  SELECTIVE_RECIPIENT_UNAUTHORIZED: Object.freeze({ code: "SELECTIVE_RECIPIENT_UNAUTHORIZED", disposition: "DENY", domain: "ACCESS", title: "Selective Recipient Unauthorized", description: "Selective disclosure recipient is unauthorized.", publicMessage: "Selective disclosure recipient is unauthorized.", repairable: false }),
  RESTRICTED_REVIEWER_MISSING: Object.freeze({ code: "RESTRICTED_REVIEWER_MISSING", disposition: "DENY", domain: "ACCESS", title: "Restricted Reviewer Missing", description: "Restricted reviewer is missing.", publicMessage: "Restricted reviewer is missing.", repairable: false }),
  RESTRICTED_REVIEWER_UNQUALIFIED: Object.freeze({ code: "RESTRICTED_REVIEWER_UNQUALIFIED", disposition: "DENY", domain: "ACCESS", title: "Restricted Reviewer Unqualified", description: "Restricted reviewer is not qualified.", publicMessage: "Restricted reviewer is not qualified.", repairable: false }),
  WITHHELD_EXISTENCE_NOT_DISCLOSED: Object.freeze({ code: "WITHHELD_EXISTENCE_NOT_DISCLOSED", disposition: "HOLD", domain: "CLAIMS", title: "Withheld Existence Not Disclosed", description: "Withheld evidence existence is not represented.", publicMessage: "Withheld evidence existence is not represented.", repairable: true }),
  WITHHELD_REVIEW_STATUS_MISSING: Object.freeze({ code: "WITHHELD_REVIEW_STATUS_MISSING", disposition: "HOLD", domain: "CLAIMS", title: "Withheld Review Status Missing", description: "Withheld evidence review status is missing.", publicMessage: "Withheld evidence review status is missing.", repairable: true }),
  EVIDENCE_DISCLOSURE_MISMATCH: Object.freeze({ code: "EVIDENCE_DISCLOSURE_MISMATCH", disposition: "DENY", domain: "EVIDENCE", title: "Evidence Disclosure Mismatch", description: "Evidence disclosure state conflicts with policy.", publicMessage: "Evidence disclosure state conflicts with policy.", repairable: false }),
  AUTHORITY_DISCLOSURE_MISMATCH: Object.freeze({ code: "AUTHORITY_DISCLOSURE_MISMATCH", disposition: "DENY", domain: "AUTHORITY", title: "Authority Disclosure Mismatch", description: "Authority disclosure state conflicts with policy.", publicMessage: "Authority disclosure state conflicts with policy.", repairable: false }),
  OUTCOME_DISCLOSURE_MISMATCH: Object.freeze({ code: "OUTCOME_DISCLOSURE_MISMATCH", disposition: "DENY", domain: "OUTCOME", title: "Outcome Disclosure Mismatch", description: "Outcome disclosure state conflicts with policy.", publicMessage: "Outcome disclosure state conflicts with policy.", repairable: false }),
  EXECUTION_RECEIPT_OVEREXPOSED: Object.freeze({ code: "EXECUTION_RECEIPT_OVEREXPOSED", disposition: "DENY", domain: "EXECUTION", title: "Execution Receipt Overexposed", description: "Execution receipt exposes restricted data.", publicMessage: "Execution receipt exposes restricted data.", repairable: false }),
  EXECUTION_RECEIPT_UNVERIFIABLE: Object.freeze({ code: "EXECUTION_RECEIPT_UNVERIFIABLE", disposition: "HOLD", domain: "EXECUTION", title: "Execution Receipt Unverifiable", description: "Redacted execution receipt is not verifiable.", publicMessage: "Redacted execution receipt is not verifiable.", repairable: true }),
  CHALLENGE_STATUS_HIDDEN: Object.freeze({ code: "CHALLENGE_STATUS_HIDDEN", disposition: "DENY", domain: "RELIANCE", title: "Challenge Status Hidden", description: "Open challenge status was hidden.", publicMessage: "Open challenge status was hidden.", repairable: false }),
  CORRECTION_STATUS_HIDDEN: Object.freeze({ code: "CORRECTION_STATUS_HIDDEN", disposition: "DENY", domain: "RELIANCE", title: "Correction Status Hidden", description: "Correction status was hidden.", publicMessage: "Correction status was hidden.", repairable: false }),
  SUPERSESSION_STATUS_HIDDEN: Object.freeze({ code: "SUPERSESSION_STATUS_HIDDEN", disposition: "DENY", domain: "RELIANCE", title: "Supersession Status Hidden", description: "Supersession status was hidden.", publicMessage: "Supersession status was hidden.", repairable: false }),
  WITHDRAWAL_STATUS_HIDDEN: Object.freeze({ code: "WITHDRAWAL_STATUS_HIDDEN", disposition: "DENY", domain: "RELIANCE", title: "Withdrawal Status Hidden", description: "Withdrawal status was hidden.", publicMessage: "Withdrawal status was hidden.", repairable: false }),
  PUBLICATION_MODE_MISMATCH: Object.freeze({ code: "PUBLICATION_MODE_MISMATCH", disposition: "DENY", domain: "PUBLICATION", title: "Publication Mode Mismatch", description: "Publication mode conflicts with registry state.", publicMessage: "Publication mode conflicts with registry state.", repairable: false }),
  PDF_MODE_MISMATCH: Object.freeze({ code: "PDF_MODE_MISMATCH", disposition: "DENY", domain: "PUBLICATION", title: "Pdf Mode Mismatch", description: "PDF mode conflicts with disclosure projection.", publicMessage: "PDF mode conflicts with disclosure projection.", repairable: false }),
  EXPORT_PARITY_FAILURE: Object.freeze({ code: "EXPORT_PARITY_FAILURE", disposition: "DENY", domain: "PUBLICATION", title: "Export Parity Failure", description: "Export does not match approved projection.", publicMessage: "Export does not match approved projection.", repairable: false }),
  DISCLOSURE_APPROVED: Object.freeze({ code: "DISCLOSURE_APPROVED", disposition: "PASS", domain: "POLICY", title: "Disclosure Approved", description: "Disclosure projection satisfies the active policy.", publicMessage: "Disclosure projection satisfies the active policy.", repairable: true }),
});

export const DISCLOSURE_CONTROLS: readonly DisclosureControlDefinition[] = Object.freeze([
  Object.freeze({ controlId: "DC-01", domain: "REQUEST", title: "Disclosure control 01", requirement: "Validate deterministic request requirement 01 before projection publication." }),
  Object.freeze({ controlId: "DC-02", domain: "ARTIFACT", title: "Disclosure control 02", requirement: "Validate deterministic artifact requirement 02 before projection publication." }),
  Object.freeze({ controlId: "DC-03", domain: "CLASSIFICATION", title: "Disclosure control 03", requirement: "Validate deterministic classification requirement 03 before projection publication." }),
  Object.freeze({ controlId: "DC-04", domain: "PRIVACY", title: "Disclosure control 04", requirement: "Validate deterministic privacy requirement 04 before projection publication." }),
  Object.freeze({ controlId: "DC-05", domain: "SECURITY", title: "Disclosure control 05", requirement: "Validate deterministic security requirement 05 before projection publication." }),
  Object.freeze({ controlId: "DC-06", domain: "PROPRIETARY", title: "Disclosure control 06", requirement: "Validate deterministic proprietary requirement 06 before projection publication." }),
  Object.freeze({ controlId: "DC-07", domain: "CLAIMS", title: "Disclosure control 07", requirement: "Validate deterministic claims requirement 07 before projection publication." }),
  Object.freeze({ controlId: "DC-08", domain: "REDACTION", title: "Disclosure control 08", requirement: "Validate deterministic redaction requirement 08 before projection publication." }),
  Object.freeze({ controlId: "DC-09", domain: "INTEGRITY", title: "Disclosure control 09", requirement: "Validate deterministic integrity requirement 09 before projection publication." }),
  Object.freeze({ controlId: "DC-10", domain: "AUDIT", title: "Disclosure control 10", requirement: "Validate deterministic audit requirement 10 before projection publication." }),
  Object.freeze({ controlId: "DC-11", domain: "ACCESS", title: "Disclosure control 11", requirement: "Validate deterministic access requirement 11 before projection publication." }),
  Object.freeze({ controlId: "DC-12", domain: "POLICY", title: "Disclosure control 12", requirement: "Validate deterministic policy requirement 12 before projection publication." }),
  Object.freeze({ controlId: "DC-13", domain: "REQUEST", title: "Disclosure control 13", requirement: "Validate deterministic request requirement 13 before projection publication." }),
  Object.freeze({ controlId: "DC-14", domain: "ARTIFACT", title: "Disclosure control 14", requirement: "Validate deterministic artifact requirement 14 before projection publication." }),
  Object.freeze({ controlId: "DC-15", domain: "CLASSIFICATION", title: "Disclosure control 15", requirement: "Validate deterministic classification requirement 15 before projection publication." }),
  Object.freeze({ controlId: "DC-16", domain: "PRIVACY", title: "Disclosure control 16", requirement: "Validate deterministic privacy requirement 16 before projection publication." }),
  Object.freeze({ controlId: "DC-17", domain: "SECURITY", title: "Disclosure control 17", requirement: "Validate deterministic security requirement 17 before projection publication." }),
  Object.freeze({ controlId: "DC-18", domain: "PROPRIETARY", title: "Disclosure control 18", requirement: "Validate deterministic proprietary requirement 18 before projection publication." }),
  Object.freeze({ controlId: "DC-19", domain: "CLAIMS", title: "Disclosure control 19", requirement: "Validate deterministic claims requirement 19 before projection publication." }),
  Object.freeze({ controlId: "DC-20", domain: "REDACTION", title: "Disclosure control 20", requirement: "Validate deterministic redaction requirement 20 before projection publication." }),
  Object.freeze({ controlId: "DC-21", domain: "INTEGRITY", title: "Disclosure control 21", requirement: "Validate deterministic integrity requirement 21 before projection publication." }),
  Object.freeze({ controlId: "DC-22", domain: "AUDIT", title: "Disclosure control 22", requirement: "Validate deterministic audit requirement 22 before projection publication." }),
  Object.freeze({ controlId: "DC-23", domain: "ACCESS", title: "Disclosure control 23", requirement: "Validate deterministic access requirement 23 before projection publication." }),
  Object.freeze({ controlId: "DC-24", domain: "POLICY", title: "Disclosure control 24", requirement: "Validate deterministic policy requirement 24 before projection publication." }),
  Object.freeze({ controlId: "DC-25", domain: "REQUEST", title: "Disclosure control 25", requirement: "Validate deterministic request requirement 25 before projection publication." }),
  Object.freeze({ controlId: "DC-26", domain: "ARTIFACT", title: "Disclosure control 26", requirement: "Validate deterministic artifact requirement 26 before projection publication." }),
  Object.freeze({ controlId: "DC-27", domain: "CLASSIFICATION", title: "Disclosure control 27", requirement: "Validate deterministic classification requirement 27 before projection publication." }),
  Object.freeze({ controlId: "DC-28", domain: "PRIVACY", title: "Disclosure control 28", requirement: "Validate deterministic privacy requirement 28 before projection publication." }),
  Object.freeze({ controlId: "DC-29", domain: "SECURITY", title: "Disclosure control 29", requirement: "Validate deterministic security requirement 29 before projection publication." }),
  Object.freeze({ controlId: "DC-30", domain: "PROPRIETARY", title: "Disclosure control 30", requirement: "Validate deterministic proprietary requirement 30 before projection publication." }),
  Object.freeze({ controlId: "DC-31", domain: "CLAIMS", title: "Disclosure control 31", requirement: "Validate deterministic claims requirement 31 before projection publication." }),
  Object.freeze({ controlId: "DC-32", domain: "REDACTION", title: "Disclosure control 32", requirement: "Validate deterministic redaction requirement 32 before projection publication." }),
  Object.freeze({ controlId: "DC-33", domain: "INTEGRITY", title: "Disclosure control 33", requirement: "Validate deterministic integrity requirement 33 before projection publication." }),
  Object.freeze({ controlId: "DC-34", domain: "AUDIT", title: "Disclosure control 34", requirement: "Validate deterministic audit requirement 34 before projection publication." }),
  Object.freeze({ controlId: "DC-35", domain: "ACCESS", title: "Disclosure control 35", requirement: "Validate deterministic access requirement 35 before projection publication." }),
  Object.freeze({ controlId: "DC-36", domain: "POLICY", title: "Disclosure control 36", requirement: "Validate deterministic policy requirement 36 before projection publication." }),
  Object.freeze({ controlId: "DC-37", domain: "REQUEST", title: "Disclosure control 37", requirement: "Validate deterministic request requirement 37 before projection publication." }),
  Object.freeze({ controlId: "DC-38", domain: "ARTIFACT", title: "Disclosure control 38", requirement: "Validate deterministic artifact requirement 38 before projection publication." }),
  Object.freeze({ controlId: "DC-39", domain: "CLASSIFICATION", title: "Disclosure control 39", requirement: "Validate deterministic classification requirement 39 before projection publication." }),
  Object.freeze({ controlId: "DC-40", domain: "PRIVACY", title: "Disclosure control 40", requirement: "Validate deterministic privacy requirement 40 before projection publication." }),
  Object.freeze({ controlId: "DC-41", domain: "SECURITY", title: "Disclosure control 41", requirement: "Validate deterministic security requirement 41 before projection publication." }),
  Object.freeze({ controlId: "DC-42", domain: "PROPRIETARY", title: "Disclosure control 42", requirement: "Validate deterministic proprietary requirement 42 before projection publication." }),
  Object.freeze({ controlId: "DC-43", domain: "CLAIMS", title: "Disclosure control 43", requirement: "Validate deterministic claims requirement 43 before projection publication." }),
  Object.freeze({ controlId: "DC-44", domain: "REDACTION", title: "Disclosure control 44", requirement: "Validate deterministic redaction requirement 44 before projection publication." }),
  Object.freeze({ controlId: "DC-45", domain: "INTEGRITY", title: "Disclosure control 45", requirement: "Validate deterministic integrity requirement 45 before projection publication." }),
  Object.freeze({ controlId: "DC-46", domain: "AUDIT", title: "Disclosure control 46", requirement: "Validate deterministic audit requirement 46 before projection publication." }),
  Object.freeze({ controlId: "DC-47", domain: "ACCESS", title: "Disclosure control 47", requirement: "Validate deterministic access requirement 47 before projection publication." }),
  Object.freeze({ controlId: "DC-48", domain: "POLICY", title: "Disclosure control 48", requirement: "Validate deterministic policy requirement 48 before projection publication." }),
  Object.freeze({ controlId: "DC-49", domain: "REQUEST", title: "Disclosure control 49", requirement: "Validate deterministic request requirement 49 before projection publication." }),
  Object.freeze({ controlId: "DC-50", domain: "ARTIFACT", title: "Disclosure control 50", requirement: "Validate deterministic artifact requirement 50 before projection publication." }),
  Object.freeze({ controlId: "DC-51", domain: "CLASSIFICATION", title: "Disclosure control 51", requirement: "Validate deterministic classification requirement 51 before projection publication." }),
  Object.freeze({ controlId: "DC-52", domain: "PRIVACY", title: "Disclosure control 52", requirement: "Validate deterministic privacy requirement 52 before projection publication." }),
  Object.freeze({ controlId: "DC-53", domain: "SECURITY", title: "Disclosure control 53", requirement: "Validate deterministic security requirement 53 before projection publication." }),
  Object.freeze({ controlId: "DC-54", domain: "PROPRIETARY", title: "Disclosure control 54", requirement: "Validate deterministic proprietary requirement 54 before projection publication." }),
  Object.freeze({ controlId: "DC-55", domain: "CLAIMS", title: "Disclosure control 55", requirement: "Validate deterministic claims requirement 55 before projection publication." }),
  Object.freeze({ controlId: "DC-56", domain: "REDACTION", title: "Disclosure control 56", requirement: "Validate deterministic redaction requirement 56 before projection publication." }),
  Object.freeze({ controlId: "DC-57", domain: "INTEGRITY", title: "Disclosure control 57", requirement: "Validate deterministic integrity requirement 57 before projection publication." }),
  Object.freeze({ controlId: "DC-58", domain: "AUDIT", title: "Disclosure control 58", requirement: "Validate deterministic audit requirement 58 before projection publication." }),
  Object.freeze({ controlId: "DC-59", domain: "ACCESS", title: "Disclosure control 59", requirement: "Validate deterministic access requirement 59 before projection publication." }),
  Object.freeze({ controlId: "DC-60", domain: "POLICY", title: "Disclosure control 60", requirement: "Validate deterministic policy requirement 60 before projection publication." }),
  Object.freeze({ controlId: "DC-61", domain: "REQUEST", title: "Disclosure control 61", requirement: "Validate deterministic request requirement 61 before projection publication." }),
  Object.freeze({ controlId: "DC-62", domain: "ARTIFACT", title: "Disclosure control 62", requirement: "Validate deterministic artifact requirement 62 before projection publication." }),
  Object.freeze({ controlId: "DC-63", domain: "CLASSIFICATION", title: "Disclosure control 63", requirement: "Validate deterministic classification requirement 63 before projection publication." }),
  Object.freeze({ controlId: "DC-64", domain: "PRIVACY", title: "Disclosure control 64", requirement: "Validate deterministic privacy requirement 64 before projection publication." }),
  Object.freeze({ controlId: "DC-65", domain: "SECURITY", title: "Disclosure control 65", requirement: "Validate deterministic security requirement 65 before projection publication." }),
  Object.freeze({ controlId: "DC-66", domain: "PROPRIETARY", title: "Disclosure control 66", requirement: "Validate deterministic proprietary requirement 66 before projection publication." }),
  Object.freeze({ controlId: "DC-67", domain: "CLAIMS", title: "Disclosure control 67", requirement: "Validate deterministic claims requirement 67 before projection publication." }),
  Object.freeze({ controlId: "DC-68", domain: "REDACTION", title: "Disclosure control 68", requirement: "Validate deterministic redaction requirement 68 before projection publication." }),
  Object.freeze({ controlId: "DC-69", domain: "INTEGRITY", title: "Disclosure control 69", requirement: "Validate deterministic integrity requirement 69 before projection publication." }),
  Object.freeze({ controlId: "DC-70", domain: "AUDIT", title: "Disclosure control 70", requirement: "Validate deterministic audit requirement 70 before projection publication." }),
  Object.freeze({ controlId: "DC-71", domain: "ACCESS", title: "Disclosure control 71", requirement: "Validate deterministic access requirement 71 before projection publication." }),
  Object.freeze({ controlId: "DC-72", domain: "POLICY", title: "Disclosure control 72", requirement: "Validate deterministic policy requirement 72 before projection publication." }),
]);


const PUBLIC_MANDATORY_PATHS = Object.freeze([
  "identity.artifactId",
  "identity.title",
  "identity.classification",
  "identity.status",
  "route.routeId",
  "route.version",
  "commit.determination",
  "executionEffect.result",
  "outcome.actualResult",
  "integrity.recordHash",
  "registry.registryId",
  "registry.governanceRegistrationId",
]);

const ALWAYS_HIDDEN_KEYS = new Set([
  "rawContent",
  "secret",
  "password",
  "credential",
  "privateKey",
  "accessToken",
  "refreshToken",
  "apiKey",
  "encryptionKey",
  "internalPrompt",
  "systemPrompt",
]);

const PUBLIC_PATTERN_RULES = Object.freeze([
  { name: "email", pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, replacement: "[EMAIL REDACTED]" },
  { name: "phone", pattern: /\+?\d[\d\s().-]{7,}\d/g, replacement: "[PHONE REDACTED]" },
  { name: "ssn", pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: "[SSN REDACTED]" },
  { name: "bearer-token", pattern: /Bearer\s+[A-Za-z0-9._~+\/-]+=*/g, replacement: "Bearer [TOKEN REDACTED]" },
  { name: "private-key", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, replacement: "[PRIVATE KEY REDACTED]" },
]);

function isoNow(value?: string): string {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date(0).toISOString();
  return date.toISOString();
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function stableSortObject(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableSortObject);
  if (value && typeof value === "object") {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const key of Object.keys(input).sort()) output[key] = stableSortObject(input[key]);
    return output;
  }
  return value;
}

export function stableDisclosureJson(value: unknown): string {
  return JSON.stringify(stableSortObject(value));
}

function fnv1a64(input: string): string {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= BigInt(input.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * prime);
  }
  return hash.toString(16).padStart(16, "0");
}

export function disclosureDigest(value: unknown): string {
  const canonical = stableDisclosureJson(value);
  const parts = [canonical, canonical.split("").reverse().join(""), `${canonical.length}:${canonical}`];
  return parts.map(fnv1a64).join("");
}

function issue(code: DisclosureReasonCode, path: string, message?: string, repair?: string): DisclosureIssue {
  const definition = DISCLOSURE_REASON_DICTIONARY[code];
  return {
    code,
    disposition: definition.disposition,
    domain: definition.domain,
    path,
    message: message ?? definition.description,
    repair,
  };
}

function policyRulesForView(policy: DisclosurePolicyProfile, view: DisclosureView): Readonly<Record<string, RedactionAction>> {
  if (view === "PUBLIC") return policy.publicFieldRules;
  if (view === "SELECTIVE") return policy.selectiveFieldRules;
  if (view === "RESTRICTED") return policy.restrictedFieldRules;
  return policy.withheldFieldRules;
}

function registryStateAllowsDisclosure(state: RegistryPublicationState, view: DisclosureView): boolean {
  if (view === "PUBLIC") return state === "PUBLISHED" || state === "CHALLENGED" || state === "CORRECTED" || state === "SUPERSEDED";
  if (view === "SELECTIVE") return state !== "DRAFT" && state !== "WITHDRAWN";
  return state !== "WITHDRAWN";
}

function authorityValid(request: DisclosureRequest, now: string): boolean {
  const authority = request.authority;
  if (!nonEmpty(authority.authorityId) || !nonEmpty(authority.actorId) || !nonEmpty(authority.role)) return false;
  if (authority.revokedAt && new Date(authority.revokedAt).getTime() <= new Date(now).getTime()) return false;
  if (authority.validUntil && new Date(authority.validUntil).getTime() < new Date(now).getTime()) return false;
  if (!authority.permittedViews.includes(request.requestedView)) return false;
  const artifactId = request.artifact.identity.artifactId;
  if (authority.artifactScopes.length > 0 && !authority.artifactScopes.includes("*") && !authority.artifactScopes.includes(artifactId)) return false;
  const governanceId = request.registryRecord.governanceRegistrationId;
  if (authority.governanceRegistrationIds.length > 0 && !authority.governanceRegistrationIds.includes(governanceId)) return false;
  return true;
}

function classifyValue(path: string, key: string, value: unknown): SensitiveDataClass {
  const normalized = `${path}.${key}`.toLowerCase();
  if (ALWAYS_HIDDEN_KEYS.has(key) || normalized.includes("privatekey")) return "PRIVATE_KEY";
  if (normalized.includes("password") || normalized.includes("credential") || normalized.includes("token") || normalized.includes("apikey")) return "CREDENTIAL";
  if (normalized.includes("phi") || normalized.includes("health") || normalized.includes("diagnosis") || normalized.includes("patient")) return "PHI";
  if (normalized.includes("pii") || normalized.includes("email") || normalized.includes("phone") || normalized.includes("address") || normalized.includes("birth")) return "PII";
  if (normalized.includes("secret") || normalized.includes("confidentialmethod")) return "TRADE_SECRET";
  if (normalized.includes("internalprompt") || normalized.includes("systemprompt")) return "INTERNAL_PROMPT";
  if (normalized.includes("proprietary") || normalized.includes("algorithm") || normalized.includes("logic")) return "PROPRIETARY_LOGIC";
  if (normalized.includes("security") || normalized.includes("vulnerability") || normalized.includes("exploit")) return "SECURITY_DETAIL";
  if (normalized.includes("privileged") || normalized.includes("attorney")) return "LEGAL_PRIVILEGE";
  if (normalized.includes("regulated")) return "REGULATED_DATA";
  if (typeof value === "string") {
    if (PUBLIC_PATTERN_RULES[0].pattern.test(value)) return "PII";
    PUBLIC_PATTERN_RULES[0].pattern.lastIndex = 0;
  }
  return "NONE";
}

function actionFor(path: string, key: string, value: unknown, request: DisclosureRequest): RedactionAction {
  const override = request.customFieldOverrides?.[`${path}.${key}`];
  if (override) return override;
  const rules = policyRulesForView(request.policy, request.requestedView);
  const explicit = rules[`${path}.${key}`] ?? rules[key] ?? rules[path];
  if (explicit) return explicit;
  const sensitiveClass = classifyValue(path, key, value);
  const sensitiveAction = request.policy.sensitiveClassRules[sensitiveClass];
  if (sensitiveAction) return sensitiveAction;
  const sourceDisclosure = value && typeof value === "object" && "disclosure" in (value as object)
    ? String((value as Record<string, unknown>).disclosure)
    : undefined;
  if (request.requestedView === "PUBLIC") {
    if (sourceDisclosure === "WITHHELD" || sourceDisclosure === "RESTRICTED") return "HASH_ONLY";
    if (sourceDisclosure === "SELECTIVE") return "SUMMARIZE";
    return sensitiveClass === "NONE" ? "KEEP" : "WITHHOLD";
  }
  if (request.requestedView === "SELECTIVE") {
    if (sourceDisclosure === "WITHHELD") return "HASH_ONLY";
    return sensitiveClass === "PRIVATE_KEY" || sensitiveClass === "CREDENTIAL" ? "WITHHOLD" : "KEEP";
  }
  if (request.requestedView === "RESTRICTED") {
    return sensitiveClass === "PRIVATE_KEY" || sensitiveClass === "CREDENTIAL" ? "HASH_ONLY" : "KEEP";
  }
  return "HASH_ONLY";
}

function maskString(value: string): string {
  if (value.length <= 4) return "[REDACTED]";
  return `${value.slice(0, 2)}${"*".repeat(Math.min(12, value.length - 4))}${value.slice(-2)}`;
}

function boundedSummary(value: unknown): string {
  if (typeof value === "string") {
    const compact = value.replace(/\s+/g, " ").trim();
    return compact.length <= 180 ? compact : `${compact.slice(0, 177)}...`;
  }
  if (Array.isArray(value)) return `[${value.length} protected item${value.length === 1 ? "" : "s"}]`;
  if (value && typeof value === "object") return `[protected ${Object.keys(value as object).length}-field object]`;
  return `[protected ${typeof value}]`;
}

function sanitizePublicText(input: string): string {
  let output = input;
  for (const rule of PUBLIC_PATTERN_RULES) {
    rule.pattern.lastIndex = 0;
    output = output.replace(rule.pattern, rule.replacement);
  }
  return output;
}

interface ProjectionBuildState {
  redactions: RedactionEntry[];
  now: string;
  request: DisclosureRequest;
  sequence: number;
}

function redactValue(value: unknown, path: string, state: ProjectionBuildState): unknown {
  if (Array.isArray(value)) {
    return value.map((entry, index) => redactValue(entry, `${path}[${index}]`, state));
  }
  if (!value || typeof value !== "object") {
    if (typeof value === "string" && state.request.requestedView === "PUBLIC") return sanitizePublicText(value);
    return value;
  }
  const output: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const fieldPath = path ? `${path}.${key}` : key;
    const action = actionFor(path, key, child, state.request);
    if (action === "KEEP") {
      output[key] = redactValue(child, fieldPath, state);
      continue;
    }
    const sensitiveClass = classifyValue(path, key, child);
    const commitment = disclosureDigest({ fieldPath, child });
    state.sequence += 1;
    const reasonCode: DisclosureReasonCode = sensitiveClass === "PII"
      ? "PUBLIC_PII_PRESENT"
      : sensitiveClass === "PHI"
        ? "PUBLIC_PHI_PRESENT"
        : sensitiveClass === "CREDENTIAL"
          ? "PUBLIC_CREDENTIAL_PRESENT"
          : sensitiveClass === "PRIVATE_KEY"
            ? "PUBLIC_PRIVATE_KEY_PRESENT"
            : sensitiveClass === "TRADE_SECRET"
              ? "PUBLIC_TRADE_SECRET_PRESENT"
              : sensitiveClass === "INTERNAL_PROMPT"
                ? "PUBLIC_INTERNAL_PROMPT_PRESENT"
                : sensitiveClass === "PROPRIETARY_LOGIC"
                  ? "PUBLIC_PROPRIETARY_LOGIC_PRESENT"
                  : "DISCLOSURE_CLASSIFICATION_MISSING";
    const entry: RedactionEntry = {
      redactionId: `RED-${state.sequence.toString().padStart(5, "0")}`,
      fieldPath,
      sourceDomain: path.split(".")[0] || "root",
      originalClassification: sensitiveClass,
      action,
      reasonCode,
      reason: DISCLOSURE_REASON_DICTIONARY[reasonCode].description,
      policyProfileId: state.request.policy.profileId,
      policyVersion: state.request.policy.version,
      authorityId: state.request.authority.authorityId,
      decidedAt: state.now,
      contentCommitment: commitment,
    };
    if (action === "MASK") {
      output[key] = typeof child === "string" ? maskString(child) : "[MASKED]";
      entry.replacementValue = output[key];
    } else if (action === "SUMMARIZE") {
      output[key] = boundedSummary(child);
      entry.replacementValue = output[key];
    } else if (action === "HASH_ONLY") {
      output[key] = { disclosure: "HASH_ONLY", commitment };
      entry.replacementValue = output[key];
    } else if (action === "WITHHOLD") {
      output[key] = { disclosure: "WITHHELD", commitment, reviewed: true };
      entry.replacementValue = output[key];
    } else if (action === "REMOVE") {
      entry.replacementValue = undefined;
    }
    state.redactions.push(entry);
  }
  return output;
}

function projectArray<T extends object>(items: readonly T[], path: string, state: ProjectionBuildState): readonly Record<string, unknown>[] {
  return items.map((item, index) => redactValue(item, `${path}[${index}]`, state) as Record<string, unknown>);
}

function buildClaimsBoundary(request: DisclosureRequest, redactions: readonly RedactionEntry[]): string[] {
  const boundaries = [
    `This ${request.requestedView.toLowerCase()} projection represents artifact ${request.artifact.identity.artifactId} and does not replace the canonical record.`,
    "The projection proves only the fields, commitments, receipts, and reviewer statements that remain visible under the active disclosure policy.",
    "Registration is not certification, and publication does not expand the registered governance scope.",
    "Hidden content may be relied upon only to the extent supported by the stated review lane and integrity commitments.",
  ];
  if (redactions.some((entry) => entry.action === "WITHHOLD" || entry.action === "HASH_ONLY")) {
    boundaries.push("Some supporting content remains protected; public verification is limited to disclosed metadata, hashes, and bounded reviewer attestations.");
  }
  if (request.registryRecord.publicSummary.openChallengeCount > 0) boundaries.push("A material challenge is open and prospective reliance must account for that challenge.");
  return [...boundaries, ...request.policy.requiredClaimsBoundaryStatements];
}

function buildVerificationLimits(request: DisclosureRequest, redactions: readonly RedactionEntry[]): string[] {
  const limits = [
    "Verify the registry ID, governance registration ID, artifact ID, canonical hash, projection hash, and manifest hash.",
    "Confirm that the projection version and policy version match the published registry record.",
  ];
  if (redactions.length > 0) limits.push("Redacted fields cannot be directly verified from this projection; verify their commitments or use an authorized review lane.");
  if (request.requestedView === "PUBLIC") limits.push("Public verification does not reveal protected evidence content or proprietary implementation details.");
  if (request.requestedView === "WITHHELD") limits.push("This view proves existence, integrity commitment, and review status only.");
  return limits;
}

function makeProjection(request: DisclosureRequest, now: string): { projection: DisclosureProjection; redactions: RedactionEntry[] } {
  const state: ProjectionBuildState = { redactions: [], now, request, sequence: 0 };
  const artifact = request.artifact;
  const registry = request.registryRecord;
  const projectionVersion = `${request.policy.version}-${request.requestedView}-${now.replace(/[-:.TZ]/g, "").slice(0, 14)}`;
  const base = {
    artifactId: artifact.identity.artifactId,
    registryId: registry.registryId,
    governanceRegistrationId: registry.governanceRegistrationId,
    view: request.requestedView,
    projectionVersion,
    generatedAt: now,
    classification: artifact.identity.classification,
    identity: redactValue(artifact.identity, "identity", state) as Record<string, unknown>,
    scenario: redactValue(artifact.scenario, "scenario", state) as Record<string, unknown>,
    route: redactValue(artifact.route, "route", state) as Record<string, unknown>,
    evidence: projectArray(artifact.evidence, "evidence", state),
    authority: projectArray(artifact.authority, "authority", state),
    continuity: redactValue(artifact.continuity, "continuity", state) as Record<string, unknown>,
    gateLedger: redactValue(artifact.gateLedger, "gateLedger", state) as Record<string, unknown>,
    commit: redactValue(artifact.commit, "commit", state) as Record<string, unknown>,
    executionEffect: redactValue(artifact.execution, "executionEffect", state) as Record<string, unknown>,
    outcome: redactValue(artifact.outcome, "outcome", state) as Record<string, unknown>,
    integrity: redactValue(artifact.integrity, "integrity", state) as Record<string, unknown>,
    reviewStatus: redactValue(artifact.review, "reviewStatus", state) as Record<string, unknown>,
    registry: redactValue(registry.publicSummary, "registry", state) as Record<string, unknown>,
    claimsBoundary: [] as string[],
    verificationLimits: [] as string[],
    disclosureNotice: `Generated under TA-14 disclosure policy ${request.policy.profileId} version ${request.policy.version}.`,
  };
  base.claimsBoundary = buildClaimsBoundary(request, state.redactions);
  base.verificationLimits = buildVerificationLimits(request, state.redactions);
  return { projection: base, redactions: state.redactions };
}

function makeManifest(request: DisclosureRequest, projection: DisclosureProjection, redactions: readonly RedactionEntry[], now: string): DisclosureManifest {
  const projectionHash = disclosureDigest(projection);
  const counts = (action: RedactionAction) => redactions.filter((entry) => entry.action === action).length;
  const manifestWithoutHash = {
    manifestId: `DM-${request.registryRecord.registryId}-${projection.projectionVersion}`,
    artifactId: projection.artifactId,
    registryId: projection.registryId,
    governanceRegistrationId: projection.governanceRegistrationId,
    projectionVersion: projection.projectionVersion,
    requestedView: request.requestedView,
    outputMode: request.outputMode,
    policyProfileId: request.policy.profileId,
    policyVersion: request.policy.version,
    authorityId: request.authority.authorityId,
    recipientId: request.recipient?.recipientId,
    generatedAt: now,
    sourceCanonicalHash: request.artifact.integrity.canonicalHash,
    sourceRegistryHash: request.registryRecord.registryRecordHash,
    projectionHash,
    redactions,
    disclosedFieldCount: countLeafFields(projection),
    summarizedFieldCount: counts("SUMMARIZE"),
    hashOnlyFieldCount: counts("HASH_ONLY"),
    withheldFieldCount: counts("WITHHOLD"),
    removedFieldCount: counts("REMOVE"),
    verificationLimits: projection.verificationLimits,
    claimsBoundary: projection.claimsBoundary,
  };
  return { ...manifestWithoutHash, manifestHash: disclosureDigest(manifestWithoutHash) };
}

function countLeafFields(value: unknown): number {
  if (Array.isArray(value)) return value.reduce((sum, entry) => sum + countLeafFields(entry), 0);
  if (value && typeof value === "object") return Object.values(value as Record<string, unknown>).reduce<number>((sum, entry) => sum + countLeafFields(entry), 0);
  return 1;
}

function evaluateRequest(request: DisclosureRequest, now: string): DisclosureIssue[] {
  const issues: DisclosureIssue[] = [];
  if (!request.policy) return [issue("POLICY_PROFILE_MISSING", "policy")];
  if (!nonEmpty(request.policy.profileId)) issues.push(issue("POLICY_PROFILE_ID_MISSING", "policy.profileId"));
  if (!nonEmpty(request.policy.version)) issues.push(issue("POLICY_VERSION_MISSING", "policy.version"));
  if (request.policy.status !== "ACTIVE") issues.push(issue("POLICY_STATUS_INACTIVE", "policy.status"));
  if (!request.policy.permittedViews.includes(request.requestedView)) issues.push(issue("REQUESTED_VIEW_UNSUPPORTED", "requestedView"));
  if (!nonEmpty(request.requestedBy)) issues.push(issue("REQUESTOR_IDENTITY_MISSING", "requestedBy"));
  if (!nonEmpty(request.authority.role)) issues.push(issue("REQUESTOR_ROLE_MISSING", "authority.role"));
  if (!authorityValid(request, now)) issues.push(issue("REQUESTOR_AUTHORITY_MISSING", "authority"));
  if (!nonEmpty(request.artifact.identity.artifactId)) issues.push(issue("ARTIFACT_ID_MISSING", "artifact.identity.artifactId"));
  if (!nonEmpty(request.registryRecord.registryId)) issues.push(issue("ARTIFACT_NOT_REGISTERED", "registryRecord.registryId"));
  if (!nonEmpty(request.registryRecord.governanceRegistrationId)) issues.push(issue("GOVERNANCE_REGISTRATION_MISSING", "registryRecord.governanceRegistrationId"));
  if (!registryStateAllowsDisclosure(request.registryRecord.publicationState, request.requestedView)) issues.push(issue("REGISTRY_STATE_NOT_DISCLOSABLE", "registryRecord.publicationState"));
  if (!nonEmpty(request.artifact.integrity.canonicalHash)) issues.push(issue("CANONICAL_RECORD_HASH_MISSING", "artifact.integrity.recordHash"));
  if (request.previousProjectionVersions?.some((version, index, versions) => versions.indexOf(version) !== index)) issues.push(issue("DISCLOSURE_VERSION_REUSED", "previousProjectionVersions"));
  if ((request.requestedView === "SELECTIVE" || request.requestedView === "RESTRICTED") && !request.recipient) issues.push(issue("SELECTIVE_RECIPIENT_MISSING", "recipient"));
  if (request.requestedView === "SELECTIVE" && request.recipient?.permittedView !== "SELECTIVE" && request.recipient?.permittedView !== "RESTRICTED") issues.push(issue("SELECTIVE_RECIPIENT_UNAUTHORIZED", "recipient.permittedView"));
  if (request.requestedView === "RESTRICTED" && request.recipient?.permittedView !== "RESTRICTED") issues.push(issue("RESTRICTED_REVIEWER_UNQUALIFIED", "recipient.permittedView"));
  if (request.registryRecord.publicSummary.openChallengeCount > 0 && request.requestedView === "PUBLIC") {
    // The challenge is allowed to remain public, but it must not be hidden.
  }
  return issues;
}

function controlEvaluations(issues: readonly DisclosureIssue[]): DisclosureControlEvaluation[] {
  return DISCLOSURE_CONTROLS.map((control) => {
    const related = issues.filter((entry) => entry.domain === control.domain || control.domain === "POLICY");
    const result: DisclosureControlResult = related.some((entry) => entry.disposition === "DENY")
      ? "FAIL"
      : related.some((entry) => entry.disposition === "ESCALATE")
        ? "ESCALATE"
        : related.some((entry) => entry.disposition === "HOLD")
          ? "HOLD"
          : "PASS";
    return {
      controlId: control.controlId,
      result,
      message: result === "PASS" ? control.requirement : `Control affected by ${related.map((entry) => entry.code).join(", ")}.`,
      issueCodes: related.map((entry) => entry.code),
    };
  });
}

function decisionFromIssues(issues: readonly DisclosureIssue[]): DisclosureDecision {
  if (issues.some((entry) => entry.disposition === "DENY")) return "DENY";
  if (issues.some((entry) => entry.disposition === "ESCALATE")) return "ESCALATE";
  if (issues.some((entry) => entry.disposition === "HOLD")) return "HOLD";
  return "APPROVE";
}

export function evaluateDisclosureRequest(request: DisclosureRequest): DisclosureDecisionResult {
  const now = isoNow(request.now);
  const canonicalValidation = validateCanonicalExecutionArtifact(request.artifact, {
    now,
    intendedUse: request.requestedView === "PUBLIC" ? "PUBLICATION" : "INTERNAL_REVIEW",
    strict: true,
  });
  const registryIssues = verifyRegistryRecord(request.registryRecord);
  const issues = evaluateRequest(request, now);
  if (canonicalValidation.issues.some((entry) => entry.disposition === "DENY" || entry.disposition === "BLOCK")) {
    issues.push(issue("CANONICAL_RECORD_INVALID", "artifact", "Canonical validation contains blocking issues."));
  }
  if (registryIssues.length > 0) issues.push(issue("REGISTRY_HASH_MISMATCH", "registryRecord", "Registry verification returned integrity issues."));
  const decision = decisionFromIssues(issues);
  let projection: DisclosureProjection | undefined;
  let manifest: DisclosureManifest | undefined;
  if (decision === "APPROVE") {
    const built = makeProjection(request, now);
    projection = built.projection;
    manifest = makeManifest(request, projection, built.redactions, now);
  }
  const controls = controlEvaluations(issues);
  const decisionBase = {
    decisionId: `DD-${request.requestId}-${now.replace(/[-:.TZ]/g, "").slice(0, 14)}`,
    requestId: request.requestId,
    decision,
    requestedView: request.requestedView,
    effectiveView: decision === "APPROVE" ? request.requestedView : undefined,
    evaluatedAt: now,
    issues,
    controls,
    projection,
    manifest,
    canonicalValidationIssues: canonicalValidation.issues,
    registryVerificationIssueCount: registryIssues.length,
  };
  return { ...decisionBase, stableJson: stableDisclosureJson(decisionBase) };
}

export function createDisclosurePackage(request: DisclosureRequest): DisclosurePackage {
  const decision = evaluateDisclosureRequest(request);
  if (decision.decision !== "APPROVE" || !decision.projection || !decision.manifest) {
    throw new Error(`Disclosure request ${request.requestId} is not approved: ${decision.decision}.`);
  }
  const projectionJson = stableDisclosureJson(decision.projection);
  const manifestJson = stableDisclosureJson(decision.manifest);
  const packageHash = disclosureDigest({ projectionJson, manifestJson, decision: decision.stableJson });
  return { projection: decision.projection, manifest: decision.manifest, decision, projectionJson, manifestJson, packageHash };
}

export function assertDisclosureApproved(decision: DisclosureDecisionResult): asserts decision is DisclosureDecisionResult & { projection: DisclosureProjection; manifest: DisclosureManifest } {
  if (decision.decision !== "APPROVE" || !decision.projection || !decision.manifest) {
    throw new Error(`Disclosure decision is ${decision.decision}; projection publication is prohibited.`);
  }
}

export function verifyDisclosurePackage(disclosurePackage: DisclosurePackage): DisclosureIssue[] {
  const issues: DisclosureIssue[] = [];
  const projectionHash = disclosureDigest(disclosurePackage.projection);
  if (projectionHash !== disclosurePackage.manifest.projectionHash) issues.push(issue("PROJECTION_HASH_MISMATCH", "manifest.projectionHash"));
  const { manifestHash: _ignored, ...manifestBase } = disclosurePackage.manifest;
  const manifestHash = disclosureDigest(manifestBase);
  if (manifestHash !== disclosurePackage.manifest.manifestHash) issues.push(issue("REDACTION_MANIFEST_HASH_MISSING", "manifest.manifestHash"));
  const expectedPackageHash = disclosureDigest({
    projectionJson: stableDisclosureJson(disclosurePackage.projection),
    manifestJson: stableDisclosureJson(disclosurePackage.manifest),
    decision: disclosurePackage.decision.stableJson,
  });
  if (expectedPackageHash !== disclosurePackage.packageHash) issues.push(issue("EXPORT_PARITY_FAILURE", "packageHash"));
  for (const redaction of disclosurePackage.manifest.redactions) {
    if (!nonEmpty(redaction.reason)) issues.push(issue("REDACTION_REASON_MISSING", redaction.fieldPath));
    if (!nonEmpty(redaction.policyProfileId)) issues.push(issue("REDACTION_POLICY_MISSING", redaction.fieldPath));
    if (!nonEmpty(redaction.authorityId)) issues.push(issue("REDACTION_AUTHORITY_MISSING", redaction.fieldPath));
    if (!nonEmpty(redaction.contentCommitment)) issues.push(issue("REDACTION_COMMITMENT_MISSING", redaction.fieldPath));
  }
  return issues;
}

export function buildDefaultDisclosurePolicy(): DisclosurePolicyProfile {
  return {
    profileId: "TA14-DISCLOSURE-BASELINE",
    version: TA14_DISCLOSURE_POLICY_VERSION,
    name: "TA-14 Execution Artifact Baseline Disclosure Policy",
    status: "ACTIVE",
    permittedViews: ["PUBLIC", "SELECTIVE", "RESTRICTED", "WITHHELD"],
    defaultView: "PUBLIC",
    publicFieldRules: Object.freeze({
      "evidence.rawContent": "WITHHOLD",
      "evidence.content": "SUMMARIZE",
      "authority.contact": "MASK",
      "executionEffect.rawReceipt": "HASH_ONLY",
    }),
    selectiveFieldRules: Object.freeze({
      "evidence.rawContent": "SUMMARIZE",
      "executionEffect.rawReceipt": "SUMMARIZE",
    }),
    restrictedFieldRules: Object.freeze({
      privateKey: "HASH_ONLY",
      credential: "WITHHOLD",
      password: "WITHHOLD",
    }),
    withheldFieldRules: Object.freeze({ "*": "HASH_ONLY" }),
    sensitiveClassRules: Object.freeze({
      NONE: "KEEP",
      PII: "MASK",
      PHI: "WITHHOLD",
      CREDENTIAL: "WITHHOLD",
      PRIVATE_KEY: "WITHHOLD",
      TRADE_SECRET: "HASH_ONLY",
      PROPRIETARY_LOGIC: "HASH_ONLY",
      INTERNAL_PROMPT: "WITHHOLD",
      SECURITY_DETAIL: "SUMMARIZE",
      COMMERCIAL_CONFIDENCE: "SUMMARIZE",
      LEGAL_PRIVILEGE: "WITHHOLD",
      REGULATED_DATA: "WITHHOLD",
    }),
    mandatoryPublicFields: PUBLIC_MANDATORY_PATHS,
    prohibitedPublicPatterns: PUBLIC_PATTERN_RULES.map((entry) => entry.name),
    requiredClaimsBoundaryStatements: [
      "The public artifact is a disclosure projection of a frozen canonical record.",
      "Protected content remains governed by the registered policy and review authority.",
    ],
    createdAt: "2026-08-01T00:00:00.000Z",
    effectiveAt: "2026-08-01T00:00:00.000Z",
    owner: "TA-14 Authority",
    steward: "Execution Artifact Registry Steward",
  };
}

export function disclosureViewRank(view: DisclosureView): number {
  return view === "PUBLIC" ? 0 : view === "SELECTIVE" ? 1 : view === "RESTRICTED" ? 2 : 3;
}

export function canRecipientReceiveView(recipient: DisclosureRecipient, view: DisclosureView): boolean {
  return disclosureViewRank(recipient.permittedView) >= disclosureViewRank(view);
}

export function listDisclosureReasons(disposition?: DisclosureReasonDisposition): DisclosureReasonDefinition[] {
  const values = Object.values(DISCLOSURE_REASON_DICTIONARY);
  return disposition ? values.filter((entry) => entry.disposition === disposition) : values;
}

export function listDisclosureControls(domain?: string): DisclosureControlDefinition[] {
  return domain ? DISCLOSURE_CONTROLS.filter((entry) => entry.domain === domain) : [...DISCLOSURE_CONTROLS];
}

export function disclosureProjectionDigest(projection: DisclosureProjection): string {
  return disclosureDigest(projection);
}

export function disclosureManifestDigest(manifest: DisclosureManifest): string {
  return disclosureDigest(manifest);
}

export function stableDisclosureDecisionJson(decision: DisclosureDecisionResult): string {
  return stableDisclosureJson(decision);
}

export function stableDisclosureManifestJson(manifest: DisclosureManifest): string {
  return stableDisclosureJson(manifest);
}

export function stableDisclosureProjectionJson(projection: DisclosureProjection): string {
  return stableDisclosureJson(projection);
}

export const DISCLOSURE_ENGINE_PRINCIPLES = Object.freeze([
  "The canonical record is never mutated by disclosure processing.",
  "No registered governance means no registered artifact, and no registered artifact means no public artifact projection.",
  "Protected content may remain private while its existence, custody, integrity commitment, and bounded review remain attributable.",
  "A redaction without a reason, policy, authority, timestamp, and commitment is not an admissible redaction.",
  "Public verification and controlled private review must never be represented as the same thing.",
  "Challenge, correction, supersession, and withdrawal states may not be hidden from prospective reliance.",
  "Every disclosure projection is versioned, attributable, reproducible, and linked to one canonical record.",
  "If an export disagrees with the approved projection, publication is blocked.",
]);

export const DISCLOSURE_ENGINE_SELF_TESTS = Object.freeze([
  "PUBLIC projection masks PII and withholds PHI.",
  "PUBLIC projection never emits credentials or private keys.",
  "SELECTIVE projection requires an authorized recipient.",
  "RESTRICTED projection requires a qualified reviewer.",
  "WITHHELD projection preserves commitments and review status.",
  "Canonical input remains byte-for-byte stable after projection.",
  "Manifest hash changes when any redaction entry changes.",
  "Projection hash changes when any disclosed value changes.",
  "Open challenge state remains visible in every reliance-capable view.",
  "Inactive policy blocks projection generation.",
  "Revoked disclosure authority blocks projection generation.",
  "Registry states outside the permitted lane block public projection.",
]);

export function isPolicyProfileMissing(value: string): value is "POLICY_PROFILE_MISSING" { return value === "POLICY_PROFILE_MISSING"; }
export const POLICY_PROFILE_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.POLICY_PROFILE_MISSING;

export function isPolicyProfileIdMissing(value: string): value is "POLICY_PROFILE_ID_MISSING" { return value === "POLICY_PROFILE_ID_MISSING"; }
export const POLICY_PROFILE_ID_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.POLICY_PROFILE_ID_MISSING;

export function isPolicyVersionMissing(value: string): value is "POLICY_VERSION_MISSING" { return value === "POLICY_VERSION_MISSING"; }
export const POLICY_VERSION_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.POLICY_VERSION_MISSING;

export function isPolicyStatusInactive(value: string): value is "POLICY_STATUS_INACTIVE" { return value === "POLICY_STATUS_INACTIVE"; }
export const POLICY_STATUS_INACTIVE_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.POLICY_STATUS_INACTIVE;

export function isRequestedViewMissing(value: string): value is "REQUESTED_VIEW_MISSING" { return value === "REQUESTED_VIEW_MISSING"; }
export const REQUESTED_VIEW_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REQUESTED_VIEW_MISSING;

export function isRequestedViewUnsupported(value: string): value is "REQUESTED_VIEW_UNSUPPORTED" { return value === "REQUESTED_VIEW_UNSUPPORTED"; }
export const REQUESTED_VIEW_UNSUPPORTED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REQUESTED_VIEW_UNSUPPORTED;

export function isRequestorIdentityMissing(value: string): value is "REQUESTOR_IDENTITY_MISSING" { return value === "REQUESTOR_IDENTITY_MISSING"; }
export const REQUESTOR_IDENTITY_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REQUESTOR_IDENTITY_MISSING;

export function isRequestorRoleMissing(value: string): value is "REQUESTOR_ROLE_MISSING" { return value === "REQUESTOR_ROLE_MISSING"; }
export const REQUESTOR_ROLE_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REQUESTOR_ROLE_MISSING;

export function isRequestorAuthorityMissing(value: string): value is "REQUESTOR_AUTHORITY_MISSING" { return value === "REQUESTOR_AUTHORITY_MISSING"; }
export const REQUESTOR_AUTHORITY_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REQUESTOR_AUTHORITY_MISSING;

export function isRequestorAuthorityExpired(value: string): value is "REQUESTOR_AUTHORITY_EXPIRED" { return value === "REQUESTOR_AUTHORITY_EXPIRED"; }
export const REQUESTOR_AUTHORITY_EXPIRED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REQUESTOR_AUTHORITY_EXPIRED;

export function isRequestorAuthorityRevoked(value: string): value is "REQUESTOR_AUTHORITY_REVOKED" { return value === "REQUESTOR_AUTHORITY_REVOKED"; }
export const REQUESTOR_AUTHORITY_REVOKED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REQUESTOR_AUTHORITY_REVOKED;

export function isRequestorScopeMismatch(value: string): value is "REQUESTOR_SCOPE_MISMATCH" { return value === "REQUESTOR_SCOPE_MISMATCH"; }
export const REQUESTOR_SCOPE_MISMATCH_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REQUESTOR_SCOPE_MISMATCH;

export function isArtifactIdMissing(value: string): value is "ARTIFACT_ID_MISSING" { return value === "ARTIFACT_ID_MISSING"; }
export const ARTIFACT_ID_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.ARTIFACT_ID_MISSING;

export function isArtifactNotRegistered(value: string): value is "ARTIFACT_NOT_REGISTERED" { return value === "ARTIFACT_NOT_REGISTERED"; }
export const ARTIFACT_NOT_REGISTERED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.ARTIFACT_NOT_REGISTERED;

export function isGovernanceRegistrationMissing(value: string): value is "GOVERNANCE_REGISTRATION_MISSING" { return value === "GOVERNANCE_REGISTRATION_MISSING"; }
export const GOVERNANCE_REGISTRATION_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.GOVERNANCE_REGISTRATION_MISSING;

export function isRegistryStateNotDisclosable(value: string): value is "REGISTRY_STATE_NOT_DISCLOSABLE" { return value === "REGISTRY_STATE_NOT_DISCLOSABLE"; }
export const REGISTRY_STATE_NOT_DISCLOSABLE_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REGISTRY_STATE_NOT_DISCLOSABLE;

export function isCanonicalRecordInvalid(value: string): value is "CANONICAL_RECORD_INVALID" { return value === "CANONICAL_RECORD_INVALID"; }
export const CANONICAL_RECORD_INVALID_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.CANONICAL_RECORD_INVALID;

export function isCanonicalRecordHashMissing(value: string): value is "CANONICAL_RECORD_HASH_MISSING" { return value === "CANONICAL_RECORD_HASH_MISSING"; }
export const CANONICAL_RECORD_HASH_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.CANONICAL_RECORD_HASH_MISSING;

export function isRegistryHashMismatch(value: string): value is "REGISTRY_HASH_MISMATCH" { return value === "REGISTRY_HASH_MISMATCH"; }
export const REGISTRY_HASH_MISMATCH_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REGISTRY_HASH_MISMATCH;

export function isDisclosureClassificationMissing(value: string): value is "DISCLOSURE_CLASSIFICATION_MISSING" { return value === "DISCLOSURE_CLASSIFICATION_MISSING"; }
export const DISCLOSURE_CLASSIFICATION_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.DISCLOSURE_CLASSIFICATION_MISSING;

export function isDisclosureClassificationInvalid(value: string): value is "DISCLOSURE_CLASSIFICATION_INVALID" { return value === "DISCLOSURE_CLASSIFICATION_INVALID"; }
export const DISCLOSURE_CLASSIFICATION_INVALID_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.DISCLOSURE_CLASSIFICATION_INVALID;

export function isPublicPiiPresent(value: string): value is "PUBLIC_PII_PRESENT" { return value === "PUBLIC_PII_PRESENT"; }
export const PUBLIC_PII_PRESENT_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PUBLIC_PII_PRESENT;

export function isPublicPhiPresent(value: string): value is "PUBLIC_PHI_PRESENT" { return value === "PUBLIC_PHI_PRESENT"; }
export const PUBLIC_PHI_PRESENT_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PUBLIC_PHI_PRESENT;

export function isPublicSecretPresent(value: string): value is "PUBLIC_SECRET_PRESENT" { return value === "PUBLIC_SECRET_PRESENT"; }
export const PUBLIC_SECRET_PRESENT_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PUBLIC_SECRET_PRESENT;

export function isPublicCredentialPresent(value: string): value is "PUBLIC_CREDENTIAL_PRESENT" { return value === "PUBLIC_CREDENTIAL_PRESENT"; }
export const PUBLIC_CREDENTIAL_PRESENT_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PUBLIC_CREDENTIAL_PRESENT;

export function isPublicPrivateKeyPresent(value: string): value is "PUBLIC_PRIVATE_KEY_PRESENT" { return value === "PUBLIC_PRIVATE_KEY_PRESENT"; }
export const PUBLIC_PRIVATE_KEY_PRESENT_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PUBLIC_PRIVATE_KEY_PRESENT;

export function isPublicSecurityDetailPresent(value: string): value is "PUBLIC_SECURITY_DETAIL_PRESENT" { return value === "PUBLIC_SECURITY_DETAIL_PRESENT"; }
export const PUBLIC_SECURITY_DETAIL_PRESENT_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PUBLIC_SECURITY_DETAIL_PRESENT;

export function isPublicProprietaryLogicPresent(value: string): value is "PUBLIC_PROPRIETARY_LOGIC_PRESENT" { return value === "PUBLIC_PROPRIETARY_LOGIC_PRESENT"; }
export const PUBLIC_PROPRIETARY_LOGIC_PRESENT_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PUBLIC_PROPRIETARY_LOGIC_PRESENT;

export function isPublicInternalPromptPresent(value: string): value is "PUBLIC_INTERNAL_PROMPT_PRESENT" { return value === "PUBLIC_INTERNAL_PROMPT_PRESENT"; }
export const PUBLIC_INTERNAL_PROMPT_PRESENT_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PUBLIC_INTERNAL_PROMPT_PRESENT;

export function isPublicTradeSecretPresent(value: string): value is "PUBLIC_TRADE_SECRET_PRESENT" { return value === "PUBLIC_TRADE_SECRET_PRESENT"; }
export const PUBLIC_TRADE_SECRET_PRESENT_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PUBLIC_TRADE_SECRET_PRESENT;

export function isUnboundedSummary(value: string): value is "UNBOUNDED_SUMMARY" { return value === "UNBOUNDED_SUMMARY"; }
export const UNBOUNDED_SUMMARY_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.UNBOUNDED_SUMMARY;

export function isClaimsBoundaryMissing(value: string): value is "CLAIMS_BOUNDARY_MISSING" { return value === "CLAIMS_BOUNDARY_MISSING"; }
export const CLAIMS_BOUNDARY_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.CLAIMS_BOUNDARY_MISSING;

export function isClaimsBoundaryOverstated(value: string): value is "CLAIMS_BOUNDARY_OVERSTATED" { return value === "CLAIMS_BOUNDARY_OVERSTATED"; }
export const CLAIMS_BOUNDARY_OVERSTATED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.CLAIMS_BOUNDARY_OVERSTATED;

export function isVerificationLimitsMissing(value: string): value is "VERIFICATION_LIMITS_MISSING" { return value === "VERIFICATION_LIMITS_MISSING"; }
export const VERIFICATION_LIMITS_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.VERIFICATION_LIMITS_MISSING;

export function isDirectVerificationMisrepresented(value: string): value is "DIRECT_VERIFICATION_MISREPRESENTED" { return value === "DIRECT_VERIFICATION_MISREPRESENTED"; }
export const DIRECT_VERIFICATION_MISREPRESENTED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.DIRECT_VERIFICATION_MISREPRESENTED;

export function isRedactionReasonMissing(value: string): value is "REDACTION_REASON_MISSING" { return value === "REDACTION_REASON_MISSING"; }
export const REDACTION_REASON_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REDACTION_REASON_MISSING;

export function isRedactionPolicyMissing(value: string): value is "REDACTION_POLICY_MISSING" { return value === "REDACTION_POLICY_MISSING"; }
export const REDACTION_POLICY_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REDACTION_POLICY_MISSING;

export function isRedactionAuthorityMissing(value: string): value is "REDACTION_AUTHORITY_MISSING" { return value === "REDACTION_AUTHORITY_MISSING"; }
export const REDACTION_AUTHORITY_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REDACTION_AUTHORITY_MISSING;

export function isRedactionTimestampInvalid(value: string): value is "REDACTION_TIMESTAMP_INVALID" { return value === "REDACTION_TIMESTAMP_INVALID"; }
export const REDACTION_TIMESTAMP_INVALID_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REDACTION_TIMESTAMP_INVALID;

export function isRedactionPathInvalid(value: string): value is "REDACTION_PATH_INVALID" { return value === "REDACTION_PATH_INVALID"; }
export const REDACTION_PATH_INVALID_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REDACTION_PATH_INVALID;

export function isRedactionActionInvalid(value: string): value is "REDACTION_ACTION_INVALID" { return value === "REDACTION_ACTION_INVALID"; }
export const REDACTION_ACTION_INVALID_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REDACTION_ACTION_INVALID;

export function isRedactionCommitmentMissing(value: string): value is "REDACTION_COMMITMENT_MISSING" { return value === "REDACTION_COMMITMENT_MISSING"; }
export const REDACTION_COMMITMENT_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REDACTION_COMMITMENT_MISSING;

export function isRedactionManifestMissing(value: string): value is "REDACTION_MANIFEST_MISSING" { return value === "REDACTION_MANIFEST_MISSING"; }
export const REDACTION_MANIFEST_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REDACTION_MANIFEST_MISSING;

export function isRedactionManifestIncomplete(value: string): value is "REDACTION_MANIFEST_INCOMPLETE" { return value === "REDACTION_MANIFEST_INCOMPLETE"; }
export const REDACTION_MANIFEST_INCOMPLETE_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REDACTION_MANIFEST_INCOMPLETE;

export function isRedactionManifestHashMissing(value: string): value is "REDACTION_MANIFEST_HASH_MISSING" { return value === "REDACTION_MANIFEST_HASH_MISSING"; }
export const REDACTION_MANIFEST_HASH_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.REDACTION_MANIFEST_HASH_MISSING;

export function isProjectionHashMissing(value: string): value is "PROJECTION_HASH_MISSING" { return value === "PROJECTION_HASH_MISSING"; }
export const PROJECTION_HASH_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PROJECTION_HASH_MISSING;

export function isProjectionHashMismatch(value: string): value is "PROJECTION_HASH_MISMATCH" { return value === "PROJECTION_HASH_MISMATCH"; }
export const PROJECTION_HASH_MISMATCH_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PROJECTION_HASH_MISMATCH;

export function isSourceRecordMutated(value: string): value is "SOURCE_RECORD_MUTATED" { return value === "SOURCE_RECORD_MUTATED"; }
export const SOURCE_RECORD_MUTATED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.SOURCE_RECORD_MUTATED;

export function isDisclosureEventMissing(value: string): value is "DISCLOSURE_EVENT_MISSING" { return value === "DISCLOSURE_EVENT_MISSING"; }
export const DISCLOSURE_EVENT_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.DISCLOSURE_EVENT_MISSING;

export function isDisclosureEventIncomplete(value: string): value is "DISCLOSURE_EVENT_INCOMPLETE" { return value === "DISCLOSURE_EVENT_INCOMPLETE"; }
export const DISCLOSURE_EVENT_INCOMPLETE_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.DISCLOSURE_EVENT_INCOMPLETE;

export function isDisclosureDecisionUnattributed(value: string): value is "DISCLOSURE_DECISION_UNATTRIBUTED" { return value === "DISCLOSURE_DECISION_UNATTRIBUTED"; }
export const DISCLOSURE_DECISION_UNATTRIBUTED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.DISCLOSURE_DECISION_UNATTRIBUTED;

export function isDisclosureDecisionNotFrozen(value: string): value is "DISCLOSURE_DECISION_NOT_FROZEN" { return value === "DISCLOSURE_DECISION_NOT_FROZEN"; }
export const DISCLOSURE_DECISION_NOT_FROZEN_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.DISCLOSURE_DECISION_NOT_FROZEN;

export function isDisclosureVersionMissing(value: string): value is "DISCLOSURE_VERSION_MISSING" { return value === "DISCLOSURE_VERSION_MISSING"; }
export const DISCLOSURE_VERSION_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.DISCLOSURE_VERSION_MISSING;

export function isDisclosureVersionReused(value: string): value is "DISCLOSURE_VERSION_REUSED" { return value === "DISCLOSURE_VERSION_REUSED"; }
export const DISCLOSURE_VERSION_REUSED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.DISCLOSURE_VERSION_REUSED;

export function isSelectiveRecipientMissing(value: string): value is "SELECTIVE_RECIPIENT_MISSING" { return value === "SELECTIVE_RECIPIENT_MISSING"; }
export const SELECTIVE_RECIPIENT_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.SELECTIVE_RECIPIENT_MISSING;

export function isSelectiveRecipientUnauthorized(value: string): value is "SELECTIVE_RECIPIENT_UNAUTHORIZED" { return value === "SELECTIVE_RECIPIENT_UNAUTHORIZED"; }
export const SELECTIVE_RECIPIENT_UNAUTHORIZED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.SELECTIVE_RECIPIENT_UNAUTHORIZED;

export function isRestrictedReviewerMissing(value: string): value is "RESTRICTED_REVIEWER_MISSING" { return value === "RESTRICTED_REVIEWER_MISSING"; }
export const RESTRICTED_REVIEWER_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.RESTRICTED_REVIEWER_MISSING;

export function isRestrictedReviewerUnqualified(value: string): value is "RESTRICTED_REVIEWER_UNQUALIFIED" { return value === "RESTRICTED_REVIEWER_UNQUALIFIED"; }
export const RESTRICTED_REVIEWER_UNQUALIFIED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.RESTRICTED_REVIEWER_UNQUALIFIED;

export function isWithheldExistenceNotDisclosed(value: string): value is "WITHHELD_EXISTENCE_NOT_DISCLOSED" { return value === "WITHHELD_EXISTENCE_NOT_DISCLOSED"; }
export const WITHHELD_EXISTENCE_NOT_DISCLOSED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.WITHHELD_EXISTENCE_NOT_DISCLOSED;

export function isWithheldReviewStatusMissing(value: string): value is "WITHHELD_REVIEW_STATUS_MISSING" { return value === "WITHHELD_REVIEW_STATUS_MISSING"; }
export const WITHHELD_REVIEW_STATUS_MISSING_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.WITHHELD_REVIEW_STATUS_MISSING;

export function isEvidenceDisclosureMismatch(value: string): value is "EVIDENCE_DISCLOSURE_MISMATCH" { return value === "EVIDENCE_DISCLOSURE_MISMATCH"; }
export const EVIDENCE_DISCLOSURE_MISMATCH_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.EVIDENCE_DISCLOSURE_MISMATCH;

export function isAuthorityDisclosureMismatch(value: string): value is "AUTHORITY_DISCLOSURE_MISMATCH" { return value === "AUTHORITY_DISCLOSURE_MISMATCH"; }
export const AUTHORITY_DISCLOSURE_MISMATCH_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.AUTHORITY_DISCLOSURE_MISMATCH;

export function isOutcomeDisclosureMismatch(value: string): value is "OUTCOME_DISCLOSURE_MISMATCH" { return value === "OUTCOME_DISCLOSURE_MISMATCH"; }
export const OUTCOME_DISCLOSURE_MISMATCH_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.OUTCOME_DISCLOSURE_MISMATCH;

export function isExecutionReceiptOverexposed(value: string): value is "EXECUTION_RECEIPT_OVEREXPOSED" { return value === "EXECUTION_RECEIPT_OVEREXPOSED"; }
export const EXECUTION_RECEIPT_OVEREXPOSED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.EXECUTION_RECEIPT_OVEREXPOSED;

export function isExecutionReceiptUnverifiable(value: string): value is "EXECUTION_RECEIPT_UNVERIFIABLE" { return value === "EXECUTION_RECEIPT_UNVERIFIABLE"; }
export const EXECUTION_RECEIPT_UNVERIFIABLE_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.EXECUTION_RECEIPT_UNVERIFIABLE;

export function isChallengeStatusHidden(value: string): value is "CHALLENGE_STATUS_HIDDEN" { return value === "CHALLENGE_STATUS_HIDDEN"; }
export const CHALLENGE_STATUS_HIDDEN_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.CHALLENGE_STATUS_HIDDEN;

export function isCorrectionStatusHidden(value: string): value is "CORRECTION_STATUS_HIDDEN" { return value === "CORRECTION_STATUS_HIDDEN"; }
export const CORRECTION_STATUS_HIDDEN_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.CORRECTION_STATUS_HIDDEN;

export function isSupersessionStatusHidden(value: string): value is "SUPERSESSION_STATUS_HIDDEN" { return value === "SUPERSESSION_STATUS_HIDDEN"; }
export const SUPERSESSION_STATUS_HIDDEN_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.SUPERSESSION_STATUS_HIDDEN;

export function isWithdrawalStatusHidden(value: string): value is "WITHDRAWAL_STATUS_HIDDEN" { return value === "WITHDRAWAL_STATUS_HIDDEN"; }
export const WITHDRAWAL_STATUS_HIDDEN_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.WITHDRAWAL_STATUS_HIDDEN;

export function isPublicationModeMismatch(value: string): value is "PUBLICATION_MODE_MISMATCH" { return value === "PUBLICATION_MODE_MISMATCH"; }
export const PUBLICATION_MODE_MISMATCH_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PUBLICATION_MODE_MISMATCH;

export function isPdfModeMismatch(value: string): value is "PDF_MODE_MISMATCH" { return value === "PDF_MODE_MISMATCH"; }
export const PDF_MODE_MISMATCH_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.PDF_MODE_MISMATCH;

export function isExportParityFailure(value: string): value is "EXPORT_PARITY_FAILURE" { return value === "EXPORT_PARITY_FAILURE"; }
export const EXPORT_PARITY_FAILURE_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.EXPORT_PARITY_FAILURE;

export function isDisclosureApproved(value: string): value is "DISCLOSURE_APPROVED" { return value === "DISCLOSURE_APPROVED"; }
export const DISCLOSURE_APPROVED_DISCLOSURE_DEFINITION = DISCLOSURE_REASON_DICTIONARY.DISCLOSURE_APPROVED;

export const DISCLOSURE_CONTROL_GUIDANCE: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "DC-01": Object.freeze(["Validate deterministic request requirement 01 before projection publication.", "Preserve the governing evidence for disclosure control 01.", "Block publication if this control cannot be demonstrated."]),
  "DC-02": Object.freeze(["Validate deterministic artifact requirement 02 before projection publication.", "Preserve the governing evidence for disclosure control 02.", "Block publication if this control cannot be demonstrated."]),
  "DC-03": Object.freeze(["Validate deterministic classification requirement 03 before projection publication.", "Preserve the governing evidence for disclosure control 03.", "Block publication if this control cannot be demonstrated."]),
  "DC-04": Object.freeze(["Validate deterministic privacy requirement 04 before projection publication.", "Preserve the governing evidence for disclosure control 04.", "Block publication if this control cannot be demonstrated."]),
  "DC-05": Object.freeze(["Validate deterministic security requirement 05 before projection publication.", "Preserve the governing evidence for disclosure control 05.", "Block publication if this control cannot be demonstrated."]),
  "DC-06": Object.freeze(["Validate deterministic proprietary requirement 06 before projection publication.", "Preserve the governing evidence for disclosure control 06.", "Block publication if this control cannot be demonstrated."]),
  "DC-07": Object.freeze(["Validate deterministic claims requirement 07 before projection publication.", "Preserve the governing evidence for disclosure control 07.", "Block publication if this control cannot be demonstrated."]),
  "DC-08": Object.freeze(["Validate deterministic redaction requirement 08 before projection publication.", "Preserve the governing evidence for disclosure control 08.", "Block publication if this control cannot be demonstrated."]),
  "DC-09": Object.freeze(["Validate deterministic integrity requirement 09 before projection publication.", "Preserve the governing evidence for disclosure control 09.", "Block publication if this control cannot be demonstrated."]),
  "DC-10": Object.freeze(["Validate deterministic audit requirement 10 before projection publication.", "Preserve the governing evidence for disclosure control 10.", "Block publication if this control cannot be demonstrated."]),
  "DC-11": Object.freeze(["Validate deterministic access requirement 11 before projection publication.", "Preserve the governing evidence for disclosure control 11.", "Block publication if this control cannot be demonstrated."]),
  "DC-12": Object.freeze(["Validate deterministic policy requirement 12 before projection publication.", "Preserve the governing evidence for disclosure control 12.", "Block publication if this control cannot be demonstrated."]),
  "DC-13": Object.freeze(["Validate deterministic request requirement 13 before projection publication.", "Preserve the governing evidence for disclosure control 13.", "Block publication if this control cannot be demonstrated."]),
  "DC-14": Object.freeze(["Validate deterministic artifact requirement 14 before projection publication.", "Preserve the governing evidence for disclosure control 14.", "Block publication if this control cannot be demonstrated."]),
  "DC-15": Object.freeze(["Validate deterministic classification requirement 15 before projection publication.", "Preserve the governing evidence for disclosure control 15.", "Block publication if this control cannot be demonstrated."]),
  "DC-16": Object.freeze(["Validate deterministic privacy requirement 16 before projection publication.", "Preserve the governing evidence for disclosure control 16.", "Block publication if this control cannot be demonstrated."]),
  "DC-17": Object.freeze(["Validate deterministic security requirement 17 before projection publication.", "Preserve the governing evidence for disclosure control 17.", "Block publication if this control cannot be demonstrated."]),
  "DC-18": Object.freeze(["Validate deterministic proprietary requirement 18 before projection publication.", "Preserve the governing evidence for disclosure control 18.", "Block publication if this control cannot be demonstrated."]),
  "DC-19": Object.freeze(["Validate deterministic claims requirement 19 before projection publication.", "Preserve the governing evidence for disclosure control 19.", "Block publication if this control cannot be demonstrated."]),
  "DC-20": Object.freeze(["Validate deterministic redaction requirement 20 before projection publication.", "Preserve the governing evidence for disclosure control 20.", "Block publication if this control cannot be demonstrated."]),
  "DC-21": Object.freeze(["Validate deterministic integrity requirement 21 before projection publication.", "Preserve the governing evidence for disclosure control 21.", "Block publication if this control cannot be demonstrated."]),
  "DC-22": Object.freeze(["Validate deterministic audit requirement 22 before projection publication.", "Preserve the governing evidence for disclosure control 22.", "Block publication if this control cannot be demonstrated."]),
  "DC-23": Object.freeze(["Validate deterministic access requirement 23 before projection publication.", "Preserve the governing evidence for disclosure control 23.", "Block publication if this control cannot be demonstrated."]),
  "DC-24": Object.freeze(["Validate deterministic policy requirement 24 before projection publication.", "Preserve the governing evidence for disclosure control 24.", "Block publication if this control cannot be demonstrated."]),
  "DC-25": Object.freeze(["Validate deterministic request requirement 25 before projection publication.", "Preserve the governing evidence for disclosure control 25.", "Block publication if this control cannot be demonstrated."]),
  "DC-26": Object.freeze(["Validate deterministic artifact requirement 26 before projection publication.", "Preserve the governing evidence for disclosure control 26.", "Block publication if this control cannot be demonstrated."]),
  "DC-27": Object.freeze(["Validate deterministic classification requirement 27 before projection publication.", "Preserve the governing evidence for disclosure control 27.", "Block publication if this control cannot be demonstrated."]),
  "DC-28": Object.freeze(["Validate deterministic privacy requirement 28 before projection publication.", "Preserve the governing evidence for disclosure control 28.", "Block publication if this control cannot be demonstrated."]),
  "DC-29": Object.freeze(["Validate deterministic security requirement 29 before projection publication.", "Preserve the governing evidence for disclosure control 29.", "Block publication if this control cannot be demonstrated."]),
  "DC-30": Object.freeze(["Validate deterministic proprietary requirement 30 before projection publication.", "Preserve the governing evidence for disclosure control 30.", "Block publication if this control cannot be demonstrated."]),
  "DC-31": Object.freeze(["Validate deterministic claims requirement 31 before projection publication.", "Preserve the governing evidence for disclosure control 31.", "Block publication if this control cannot be demonstrated."]),
  "DC-32": Object.freeze(["Validate deterministic redaction requirement 32 before projection publication.", "Preserve the governing evidence for disclosure control 32.", "Block publication if this control cannot be demonstrated."]),
  "DC-33": Object.freeze(["Validate deterministic integrity requirement 33 before projection publication.", "Preserve the governing evidence for disclosure control 33.", "Block publication if this control cannot be demonstrated."]),
  "DC-34": Object.freeze(["Validate deterministic audit requirement 34 before projection publication.", "Preserve the governing evidence for disclosure control 34.", "Block publication if this control cannot be demonstrated."]),
  "DC-35": Object.freeze(["Validate deterministic access requirement 35 before projection publication.", "Preserve the governing evidence for disclosure control 35.", "Block publication if this control cannot be demonstrated."]),
  "DC-36": Object.freeze(["Validate deterministic policy requirement 36 before projection publication.", "Preserve the governing evidence for disclosure control 36.", "Block publication if this control cannot be demonstrated."]),
  "DC-37": Object.freeze(["Validate deterministic request requirement 37 before projection publication.", "Preserve the governing evidence for disclosure control 37.", "Block publication if this control cannot be demonstrated."]),
  "DC-38": Object.freeze(["Validate deterministic artifact requirement 38 before projection publication.", "Preserve the governing evidence for disclosure control 38.", "Block publication if this control cannot be demonstrated."]),
  "DC-39": Object.freeze(["Validate deterministic classification requirement 39 before projection publication.", "Preserve the governing evidence for disclosure control 39.", "Block publication if this control cannot be demonstrated."]),
  "DC-40": Object.freeze(["Validate deterministic privacy requirement 40 before projection publication.", "Preserve the governing evidence for disclosure control 40.", "Block publication if this control cannot be demonstrated."]),
  "DC-41": Object.freeze(["Validate deterministic security requirement 41 before projection publication.", "Preserve the governing evidence for disclosure control 41.", "Block publication if this control cannot be demonstrated."]),
  "DC-42": Object.freeze(["Validate deterministic proprietary requirement 42 before projection publication.", "Preserve the governing evidence for disclosure control 42.", "Block publication if this control cannot be demonstrated."]),
  "DC-43": Object.freeze(["Validate deterministic claims requirement 43 before projection publication.", "Preserve the governing evidence for disclosure control 43.", "Block publication if this control cannot be demonstrated."]),
  "DC-44": Object.freeze(["Validate deterministic redaction requirement 44 before projection publication.", "Preserve the governing evidence for disclosure control 44.", "Block publication if this control cannot be demonstrated."]),
  "DC-45": Object.freeze(["Validate deterministic integrity requirement 45 before projection publication.", "Preserve the governing evidence for disclosure control 45.", "Block publication if this control cannot be demonstrated."]),
  "DC-46": Object.freeze(["Validate deterministic audit requirement 46 before projection publication.", "Preserve the governing evidence for disclosure control 46.", "Block publication if this control cannot be demonstrated."]),
  "DC-47": Object.freeze(["Validate deterministic access requirement 47 before projection publication.", "Preserve the governing evidence for disclosure control 47.", "Block publication if this control cannot be demonstrated."]),
  "DC-48": Object.freeze(["Validate deterministic policy requirement 48 before projection publication.", "Preserve the governing evidence for disclosure control 48.", "Block publication if this control cannot be demonstrated."]),
  "DC-49": Object.freeze(["Validate deterministic request requirement 49 before projection publication.", "Preserve the governing evidence for disclosure control 49.", "Block publication if this control cannot be demonstrated."]),
  "DC-50": Object.freeze(["Validate deterministic artifact requirement 50 before projection publication.", "Preserve the governing evidence for disclosure control 50.", "Block publication if this control cannot be demonstrated."]),
  "DC-51": Object.freeze(["Validate deterministic classification requirement 51 before projection publication.", "Preserve the governing evidence for disclosure control 51.", "Block publication if this control cannot be demonstrated."]),
  "DC-52": Object.freeze(["Validate deterministic privacy requirement 52 before projection publication.", "Preserve the governing evidence for disclosure control 52.", "Block publication if this control cannot be demonstrated."]),
  "DC-53": Object.freeze(["Validate deterministic security requirement 53 before projection publication.", "Preserve the governing evidence for disclosure control 53.", "Block publication if this control cannot be demonstrated."]),
  "DC-54": Object.freeze(["Validate deterministic proprietary requirement 54 before projection publication.", "Preserve the governing evidence for disclosure control 54.", "Block publication if this control cannot be demonstrated."]),
  "DC-55": Object.freeze(["Validate deterministic claims requirement 55 before projection publication.", "Preserve the governing evidence for disclosure control 55.", "Block publication if this control cannot be demonstrated."]),
  "DC-56": Object.freeze(["Validate deterministic redaction requirement 56 before projection publication.", "Preserve the governing evidence for disclosure control 56.", "Block publication if this control cannot be demonstrated."]),
  "DC-57": Object.freeze(["Validate deterministic integrity requirement 57 before projection publication.", "Preserve the governing evidence for disclosure control 57.", "Block publication if this control cannot be demonstrated."]),
  "DC-58": Object.freeze(["Validate deterministic audit requirement 58 before projection publication.", "Preserve the governing evidence for disclosure control 58.", "Block publication if this control cannot be demonstrated."]),
  "DC-59": Object.freeze(["Validate deterministic access requirement 59 before projection publication.", "Preserve the governing evidence for disclosure control 59.", "Block publication if this control cannot be demonstrated."]),
  "DC-60": Object.freeze(["Validate deterministic policy requirement 60 before projection publication.", "Preserve the governing evidence for disclosure control 60.", "Block publication if this control cannot be demonstrated."]),
  "DC-61": Object.freeze(["Validate deterministic request requirement 61 before projection publication.", "Preserve the governing evidence for disclosure control 61.", "Block publication if this control cannot be demonstrated."]),
  "DC-62": Object.freeze(["Validate deterministic artifact requirement 62 before projection publication.", "Preserve the governing evidence for disclosure control 62.", "Block publication if this control cannot be demonstrated."]),
  "DC-63": Object.freeze(["Validate deterministic classification requirement 63 before projection publication.", "Preserve the governing evidence for disclosure control 63.", "Block publication if this control cannot be demonstrated."]),
  "DC-64": Object.freeze(["Validate deterministic privacy requirement 64 before projection publication.", "Preserve the governing evidence for disclosure control 64.", "Block publication if this control cannot be demonstrated."]),
  "DC-65": Object.freeze(["Validate deterministic security requirement 65 before projection publication.", "Preserve the governing evidence for disclosure control 65.", "Block publication if this control cannot be demonstrated."]),
  "DC-66": Object.freeze(["Validate deterministic proprietary requirement 66 before projection publication.", "Preserve the governing evidence for disclosure control 66.", "Block publication if this control cannot be demonstrated."]),
  "DC-67": Object.freeze(["Validate deterministic claims requirement 67 before projection publication.", "Preserve the governing evidence for disclosure control 67.", "Block publication if this control cannot be demonstrated."]),
  "DC-68": Object.freeze(["Validate deterministic redaction requirement 68 before projection publication.", "Preserve the governing evidence for disclosure control 68.", "Block publication if this control cannot be demonstrated."]),
  "DC-69": Object.freeze(["Validate deterministic integrity requirement 69 before projection publication.", "Preserve the governing evidence for disclosure control 69.", "Block publication if this control cannot be demonstrated."]),
  "DC-70": Object.freeze(["Validate deterministic audit requirement 70 before projection publication.", "Preserve the governing evidence for disclosure control 70.", "Block publication if this control cannot be demonstrated."]),
  "DC-71": Object.freeze(["Validate deterministic access requirement 71 before projection publication.", "Preserve the governing evidence for disclosure control 71.", "Block publication if this control cannot be demonstrated."]),
  "DC-72": Object.freeze(["Validate deterministic policy requirement 72 before projection publication.", "Preserve the governing evidence for disclosure control 72.", "Block publication if this control cannot be demonstrated."]),
});

export function disclosureControlGuidance(controlId: string): readonly string[] { return DISCLOSURE_CONTROL_GUIDANCE[controlId] ?? Object.freeze([]); }


export interface DisclosureFieldCatalogEntry {
  path: string;
  domain: string;
  field: string;
  publicAction: RedactionAction;
  selectiveAction: RedactionAction;
  restrictedAction: RedactionAction;
  withheldAction: RedactionAction;
  rationale: string;
}

export const DISCLOSURE_FIELD_CATALOG: readonly DisclosureFieldCatalogEntry[] = Object.freeze([
  Object.freeze({
    path: "identity.id",
    domain: "identity",
    field: "id",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 001 preserves bounded proof for identity.id while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.title",
    domain: "identity",
    field: "title",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 002 preserves bounded proof for identity.title while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.description",
    domain: "identity",
    field: "description",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 003 preserves bounded proof for identity.description while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.source",
    domain: "identity",
    field: "source",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 004 preserves bounded proof for identity.source while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.content",
    domain: "identity",
    field: "content",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 005 preserves bounded proof for identity.content while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.rawContent",
    domain: "identity",
    field: "rawContent",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 006 preserves bounded proof for identity.rawContent while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.hash",
    domain: "identity",
    field: "hash",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 007 preserves bounded proof for identity.hash while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.capturedAt",
    domain: "identity",
    field: "capturedAt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 008 preserves bounded proof for identity.capturedAt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.validUntil",
    domain: "identity",
    field: "validUntil",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 009 preserves bounded proof for identity.validUntil while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.owner",
    domain: "identity",
    field: "owner",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 010 preserves bounded proof for identity.owner while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.steward",
    domain: "identity",
    field: "steward",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 011 preserves bounded proof for identity.steward while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.actorId",
    domain: "identity",
    field: "actorId",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 012 preserves bounded proof for identity.actorId while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.actorName",
    domain: "identity",
    field: "actorName",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 013 preserves bounded proof for identity.actorName while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.role",
    domain: "identity",
    field: "role",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 014 preserves bounded proof for identity.role while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.scope",
    domain: "identity",
    field: "scope",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 015 preserves bounded proof for identity.scope while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.reason",
    domain: "identity",
    field: "reason",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 016 preserves bounded proof for identity.reason while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.notes",
    domain: "identity",
    field: "notes",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 017 preserves bounded proof for identity.notes while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.receipt",
    domain: "identity",
    field: "receipt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 018 preserves bounded proof for identity.receipt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.result",
    domain: "identity",
    field: "result",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 019 preserves bounded proof for identity.result while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.status",
    domain: "identity",
    field: "status",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 020 preserves bounded proof for identity.status while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.version",
    domain: "identity",
    field: "version",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 021 preserves bounded proof for identity.version while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.classification",
    domain: "identity",
    field: "classification",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 022 preserves bounded proof for identity.classification while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.disclosure",
    domain: "identity",
    field: "disclosure",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 023 preserves bounded proof for identity.disclosure while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "identity.challengeStatus",
    domain: "identity",
    field: "challengeStatus",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 024 preserves bounded proof for identity.challengeStatus while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.id",
    domain: "scenario",
    field: "id",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 025 preserves bounded proof for scenario.id while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.title",
    domain: "scenario",
    field: "title",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 026 preserves bounded proof for scenario.title while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.description",
    domain: "scenario",
    field: "description",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 027 preserves bounded proof for scenario.description while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.source",
    domain: "scenario",
    field: "source",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 028 preserves bounded proof for scenario.source while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.content",
    domain: "scenario",
    field: "content",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 029 preserves bounded proof for scenario.content while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.rawContent",
    domain: "scenario",
    field: "rawContent",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 030 preserves bounded proof for scenario.rawContent while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.hash",
    domain: "scenario",
    field: "hash",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 031 preserves bounded proof for scenario.hash while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.capturedAt",
    domain: "scenario",
    field: "capturedAt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 032 preserves bounded proof for scenario.capturedAt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.validUntil",
    domain: "scenario",
    field: "validUntil",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 033 preserves bounded proof for scenario.validUntil while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.owner",
    domain: "scenario",
    field: "owner",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 034 preserves bounded proof for scenario.owner while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.steward",
    domain: "scenario",
    field: "steward",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 035 preserves bounded proof for scenario.steward while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.actorId",
    domain: "scenario",
    field: "actorId",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 036 preserves bounded proof for scenario.actorId while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.actorName",
    domain: "scenario",
    field: "actorName",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 037 preserves bounded proof for scenario.actorName while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.role",
    domain: "scenario",
    field: "role",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 038 preserves bounded proof for scenario.role while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.scope",
    domain: "scenario",
    field: "scope",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 039 preserves bounded proof for scenario.scope while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.reason",
    domain: "scenario",
    field: "reason",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 040 preserves bounded proof for scenario.reason while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.notes",
    domain: "scenario",
    field: "notes",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 041 preserves bounded proof for scenario.notes while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.receipt",
    domain: "scenario",
    field: "receipt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 042 preserves bounded proof for scenario.receipt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.result",
    domain: "scenario",
    field: "result",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 043 preserves bounded proof for scenario.result while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.status",
    domain: "scenario",
    field: "status",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 044 preserves bounded proof for scenario.status while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.version",
    domain: "scenario",
    field: "version",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 045 preserves bounded proof for scenario.version while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.classification",
    domain: "scenario",
    field: "classification",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 046 preserves bounded proof for scenario.classification while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.disclosure",
    domain: "scenario",
    field: "disclosure",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 047 preserves bounded proof for scenario.disclosure while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "scenario.challengeStatus",
    domain: "scenario",
    field: "challengeStatus",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 048 preserves bounded proof for scenario.challengeStatus while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.id",
    domain: "route",
    field: "id",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 049 preserves bounded proof for route.id while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.title",
    domain: "route",
    field: "title",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 050 preserves bounded proof for route.title while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.description",
    domain: "route",
    field: "description",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 051 preserves bounded proof for route.description while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.source",
    domain: "route",
    field: "source",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 052 preserves bounded proof for route.source while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.content",
    domain: "route",
    field: "content",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 053 preserves bounded proof for route.content while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.rawContent",
    domain: "route",
    field: "rawContent",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 054 preserves bounded proof for route.rawContent while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.hash",
    domain: "route",
    field: "hash",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 055 preserves bounded proof for route.hash while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.capturedAt",
    domain: "route",
    field: "capturedAt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 056 preserves bounded proof for route.capturedAt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.validUntil",
    domain: "route",
    field: "validUntil",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 057 preserves bounded proof for route.validUntil while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.owner",
    domain: "route",
    field: "owner",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 058 preserves bounded proof for route.owner while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.steward",
    domain: "route",
    field: "steward",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 059 preserves bounded proof for route.steward while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.actorId",
    domain: "route",
    field: "actorId",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 060 preserves bounded proof for route.actorId while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.actorName",
    domain: "route",
    field: "actorName",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 061 preserves bounded proof for route.actorName while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.role",
    domain: "route",
    field: "role",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 062 preserves bounded proof for route.role while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.scope",
    domain: "route",
    field: "scope",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 063 preserves bounded proof for route.scope while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.reason",
    domain: "route",
    field: "reason",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 064 preserves bounded proof for route.reason while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.notes",
    domain: "route",
    field: "notes",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 065 preserves bounded proof for route.notes while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.receipt",
    domain: "route",
    field: "receipt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 066 preserves bounded proof for route.receipt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.result",
    domain: "route",
    field: "result",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 067 preserves bounded proof for route.result while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.status",
    domain: "route",
    field: "status",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 068 preserves bounded proof for route.status while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.version",
    domain: "route",
    field: "version",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 069 preserves bounded proof for route.version while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.classification",
    domain: "route",
    field: "classification",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 070 preserves bounded proof for route.classification while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.disclosure",
    domain: "route",
    field: "disclosure",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 071 preserves bounded proof for route.disclosure while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "route.challengeStatus",
    domain: "route",
    field: "challengeStatus",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 072 preserves bounded proof for route.challengeStatus while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.id",
    domain: "evidence",
    field: "id",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 073 preserves bounded proof for evidence.id while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.title",
    domain: "evidence",
    field: "title",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 074 preserves bounded proof for evidence.title while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.description",
    domain: "evidence",
    field: "description",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 075 preserves bounded proof for evidence.description while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.source",
    domain: "evidence",
    field: "source",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 076 preserves bounded proof for evidence.source while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.content",
    domain: "evidence",
    field: "content",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 077 preserves bounded proof for evidence.content while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.rawContent",
    domain: "evidence",
    field: "rawContent",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 078 preserves bounded proof for evidence.rawContent while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.hash",
    domain: "evidence",
    field: "hash",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 079 preserves bounded proof for evidence.hash while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.capturedAt",
    domain: "evidence",
    field: "capturedAt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 080 preserves bounded proof for evidence.capturedAt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.validUntil",
    domain: "evidence",
    field: "validUntil",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 081 preserves bounded proof for evidence.validUntil while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.owner",
    domain: "evidence",
    field: "owner",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 082 preserves bounded proof for evidence.owner while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.steward",
    domain: "evidence",
    field: "steward",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 083 preserves bounded proof for evidence.steward while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.actorId",
    domain: "evidence",
    field: "actorId",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 084 preserves bounded proof for evidence.actorId while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.actorName",
    domain: "evidence",
    field: "actorName",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 085 preserves bounded proof for evidence.actorName while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.role",
    domain: "evidence",
    field: "role",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 086 preserves bounded proof for evidence.role while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.scope",
    domain: "evidence",
    field: "scope",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 087 preserves bounded proof for evidence.scope while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.reason",
    domain: "evidence",
    field: "reason",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 088 preserves bounded proof for evidence.reason while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.notes",
    domain: "evidence",
    field: "notes",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 089 preserves bounded proof for evidence.notes while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.receipt",
    domain: "evidence",
    field: "receipt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 090 preserves bounded proof for evidence.receipt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.result",
    domain: "evidence",
    field: "result",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 091 preserves bounded proof for evidence.result while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.status",
    domain: "evidence",
    field: "status",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 092 preserves bounded proof for evidence.status while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.version",
    domain: "evidence",
    field: "version",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 093 preserves bounded proof for evidence.version while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.classification",
    domain: "evidence",
    field: "classification",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 094 preserves bounded proof for evidence.classification while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.disclosure",
    domain: "evidence",
    field: "disclosure",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 095 preserves bounded proof for evidence.disclosure while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "evidence.challengeStatus",
    domain: "evidence",
    field: "challengeStatus",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 096 preserves bounded proof for evidence.challengeStatus while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.id",
    domain: "authority",
    field: "id",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 097 preserves bounded proof for authority.id while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.title",
    domain: "authority",
    field: "title",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 098 preserves bounded proof for authority.title while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.description",
    domain: "authority",
    field: "description",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 099 preserves bounded proof for authority.description while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.source",
    domain: "authority",
    field: "source",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 100 preserves bounded proof for authority.source while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.content",
    domain: "authority",
    field: "content",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 101 preserves bounded proof for authority.content while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.rawContent",
    domain: "authority",
    field: "rawContent",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 102 preserves bounded proof for authority.rawContent while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.hash",
    domain: "authority",
    field: "hash",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 103 preserves bounded proof for authority.hash while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.capturedAt",
    domain: "authority",
    field: "capturedAt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 104 preserves bounded proof for authority.capturedAt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.validUntil",
    domain: "authority",
    field: "validUntil",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 105 preserves bounded proof for authority.validUntil while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.owner",
    domain: "authority",
    field: "owner",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 106 preserves bounded proof for authority.owner while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.steward",
    domain: "authority",
    field: "steward",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 107 preserves bounded proof for authority.steward while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.actorId",
    domain: "authority",
    field: "actorId",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 108 preserves bounded proof for authority.actorId while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.actorName",
    domain: "authority",
    field: "actorName",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 109 preserves bounded proof for authority.actorName while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.role",
    domain: "authority",
    field: "role",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 110 preserves bounded proof for authority.role while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.scope",
    domain: "authority",
    field: "scope",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 111 preserves bounded proof for authority.scope while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.reason",
    domain: "authority",
    field: "reason",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 112 preserves bounded proof for authority.reason while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.notes",
    domain: "authority",
    field: "notes",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 113 preserves bounded proof for authority.notes while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.receipt",
    domain: "authority",
    field: "receipt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 114 preserves bounded proof for authority.receipt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.result",
    domain: "authority",
    field: "result",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 115 preserves bounded proof for authority.result while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.status",
    domain: "authority",
    field: "status",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 116 preserves bounded proof for authority.status while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.version",
    domain: "authority",
    field: "version",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 117 preserves bounded proof for authority.version while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.classification",
    domain: "authority",
    field: "classification",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 118 preserves bounded proof for authority.classification while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.disclosure",
    domain: "authority",
    field: "disclosure",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 119 preserves bounded proof for authority.disclosure while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "authority.challengeStatus",
    domain: "authority",
    field: "challengeStatus",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 120 preserves bounded proof for authority.challengeStatus while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.id",
    domain: "continuity",
    field: "id",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 121 preserves bounded proof for continuity.id while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.title",
    domain: "continuity",
    field: "title",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 122 preserves bounded proof for continuity.title while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.description",
    domain: "continuity",
    field: "description",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 123 preserves bounded proof for continuity.description while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.source",
    domain: "continuity",
    field: "source",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 124 preserves bounded proof for continuity.source while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.content",
    domain: "continuity",
    field: "content",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 125 preserves bounded proof for continuity.content while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.rawContent",
    domain: "continuity",
    field: "rawContent",
    publicAction: "SUMMARIZE",
    selectiveAction: "SUMMARIZE",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 126 preserves bounded proof for continuity.rawContent while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.hash",
    domain: "continuity",
    field: "hash",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 127 preserves bounded proof for continuity.hash while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.capturedAt",
    domain: "continuity",
    field: "capturedAt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 128 preserves bounded proof for continuity.capturedAt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.validUntil",
    domain: "continuity",
    field: "validUntil",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 129 preserves bounded proof for continuity.validUntil while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.owner",
    domain: "continuity",
    field: "owner",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 130 preserves bounded proof for continuity.owner while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.steward",
    domain: "continuity",
    field: "steward",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 131 preserves bounded proof for continuity.steward while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.actorId",
    domain: "continuity",
    field: "actorId",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 132 preserves bounded proof for continuity.actorId while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.actorName",
    domain: "continuity",
    field: "actorName",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 133 preserves bounded proof for continuity.actorName while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.role",
    domain: "continuity",
    field: "role",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 134 preserves bounded proof for continuity.role while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.scope",
    domain: "continuity",
    field: "scope",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 135 preserves bounded proof for continuity.scope while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.reason",
    domain: "continuity",
    field: "reason",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 136 preserves bounded proof for continuity.reason while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.notes",
    domain: "continuity",
    field: "notes",
    publicAction: "MASK",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 137 preserves bounded proof for continuity.notes while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.receipt",
    domain: "continuity",
    field: "receipt",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 138 preserves bounded proof for continuity.receipt while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.result",
    domain: "continuity",
    field: "result",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 139 preserves bounded proof for continuity.result while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.status",
    domain: "continuity",
    field: "status",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 140 preserves bounded proof for continuity.status while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.version",
    domain: "continuity",
    field: "version",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 141 preserves bounded proof for continuity.version while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.classification",
    domain: "continuity",
    field: "classification",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 142 preserves bounded proof for continuity.classification while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.disclosure",
    domain: "continuity",
    field: "disclosure",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 143 preserves bounded proof for continuity.disclosure while enforcing the active disclosure lane.",
  }),
  Object.freeze({
    path: "continuity.challengeStatus",
    domain: "continuity",
    field: "challengeStatus",
    publicAction: "KEEP",
    selectiveAction: "KEEP",
    restrictedAction: "KEEP",
    withheldAction: "HASH_ONLY",
    rationale: "Catalog rule 144 preserves bounded proof for continuity.challengeStatus while enforcing the active disclosure lane.",
  }),
]);

export function findDisclosureFieldRule(path: string): DisclosureFieldCatalogEntry | undefined {
  return DISCLOSURE_FIELD_CATALOG.find((entry) => entry.path === path);
}

export function disclosureActionForCatalogPath(path: string, view: DisclosureView): RedactionAction | undefined {
  const entry = findDisclosureFieldRule(path);
  if (!entry) return undefined;
  if (view === "PUBLIC") return entry.publicAction;
  if (view === "SELECTIVE") return entry.selectiveAction;
  if (view === "RESTRICTED") return entry.restrictedAction;
  return entry.withheldAction;
}

export interface DisclosureAcceptanceTest {
  testId: string;
  category: string;
  statement: string;
  passCondition: string;
}

export const DISCLOSURE_ACCEPTANCE_TESTS: readonly DisclosureAcceptanceTest[] = Object.freeze([
  Object.freeze({
    testId: "DAT-001",
    category: "Policy",
    statement: "Validate policy disclosure behavior 001 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 01.",
  }),
  Object.freeze({
    testId: "DAT-002",
    category: "Authority",
    statement: "Validate authority disclosure behavior 002 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 02.",
  }),
  Object.freeze({
    testId: "DAT-003",
    category: "Privacy",
    statement: "Validate privacy disclosure behavior 003 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 03.",
  }),
  Object.freeze({
    testId: "DAT-004",
    category: "Security",
    statement: "Validate security disclosure behavior 004 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 04.",
  }),
  Object.freeze({
    testId: "DAT-005",
    category: "Integrity",
    statement: "Validate integrity disclosure behavior 005 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 05.",
  }),
  Object.freeze({
    testId: "DAT-006",
    category: "Registry",
    statement: "Validate registry disclosure behavior 006 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 06.",
  }),
  Object.freeze({
    testId: "DAT-007",
    category: "Claims",
    statement: "Validate claims disclosure behavior 007 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 07.",
  }),
  Object.freeze({
    testId: "DAT-008",
    category: "Redaction",
    statement: "Validate redaction disclosure behavior 008 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 08.",
  }),
  Object.freeze({
    testId: "DAT-009",
    category: "Projection",
    statement: "Validate projection disclosure behavior 009 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 09.",
  }),
  Object.freeze({
    testId: "DAT-010",
    category: "Publication",
    statement: "Validate publication disclosure behavior 010 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 10.",
  }),
  Object.freeze({
    testId: "DAT-011",
    category: "Policy",
    statement: "Validate policy disclosure behavior 011 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 11.",
  }),
  Object.freeze({
    testId: "DAT-012",
    category: "Authority",
    statement: "Validate authority disclosure behavior 012 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 12.",
  }),
  Object.freeze({
    testId: "DAT-013",
    category: "Privacy",
    statement: "Validate privacy disclosure behavior 013 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 13.",
  }),
  Object.freeze({
    testId: "DAT-014",
    category: "Security",
    statement: "Validate security disclosure behavior 014 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 14.",
  }),
  Object.freeze({
    testId: "DAT-015",
    category: "Integrity",
    statement: "Validate integrity disclosure behavior 015 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 15.",
  }),
  Object.freeze({
    testId: "DAT-016",
    category: "Registry",
    statement: "Validate registry disclosure behavior 016 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 16.",
  }),
  Object.freeze({
    testId: "DAT-017",
    category: "Claims",
    statement: "Validate claims disclosure behavior 017 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 17.",
  }),
  Object.freeze({
    testId: "DAT-018",
    category: "Redaction",
    statement: "Validate redaction disclosure behavior 018 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 18.",
  }),
  Object.freeze({
    testId: "DAT-019",
    category: "Projection",
    statement: "Validate projection disclosure behavior 019 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 19.",
  }),
  Object.freeze({
    testId: "DAT-020",
    category: "Publication",
    statement: "Validate publication disclosure behavior 020 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 20.",
  }),
  Object.freeze({
    testId: "DAT-021",
    category: "Policy",
    statement: "Validate policy disclosure behavior 021 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 21.",
  }),
  Object.freeze({
    testId: "DAT-022",
    category: "Authority",
    statement: "Validate authority disclosure behavior 022 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 22.",
  }),
  Object.freeze({
    testId: "DAT-023",
    category: "Privacy",
    statement: "Validate privacy disclosure behavior 023 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 23.",
  }),
  Object.freeze({
    testId: "DAT-024",
    category: "Security",
    statement: "Validate security disclosure behavior 024 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 24.",
  }),
  Object.freeze({
    testId: "DAT-025",
    category: "Integrity",
    statement: "Validate integrity disclosure behavior 025 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 25.",
  }),
  Object.freeze({
    testId: "DAT-026",
    category: "Registry",
    statement: "Validate registry disclosure behavior 026 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 26.",
  }),
  Object.freeze({
    testId: "DAT-027",
    category: "Claims",
    statement: "Validate claims disclosure behavior 027 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 27.",
  }),
  Object.freeze({
    testId: "DAT-028",
    category: "Redaction",
    statement: "Validate redaction disclosure behavior 028 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 28.",
  }),
  Object.freeze({
    testId: "DAT-029",
    category: "Projection",
    statement: "Validate projection disclosure behavior 029 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 29.",
  }),
  Object.freeze({
    testId: "DAT-030",
    category: "Publication",
    statement: "Validate publication disclosure behavior 030 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 30.",
  }),
  Object.freeze({
    testId: "DAT-031",
    category: "Policy",
    statement: "Validate policy disclosure behavior 031 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 31.",
  }),
  Object.freeze({
    testId: "DAT-032",
    category: "Authority",
    statement: "Validate authority disclosure behavior 032 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 32.",
  }),
  Object.freeze({
    testId: "DAT-033",
    category: "Privacy",
    statement: "Validate privacy disclosure behavior 033 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 33.",
  }),
  Object.freeze({
    testId: "DAT-034",
    category: "Security",
    statement: "Validate security disclosure behavior 034 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 34.",
  }),
  Object.freeze({
    testId: "DAT-035",
    category: "Integrity",
    statement: "Validate integrity disclosure behavior 035 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 35.",
  }),
  Object.freeze({
    testId: "DAT-036",
    category: "Registry",
    statement: "Validate registry disclosure behavior 036 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 36.",
  }),
  Object.freeze({
    testId: "DAT-037",
    category: "Claims",
    statement: "Validate claims disclosure behavior 037 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 37.",
  }),
  Object.freeze({
    testId: "DAT-038",
    category: "Redaction",
    statement: "Validate redaction disclosure behavior 038 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 38.",
  }),
  Object.freeze({
    testId: "DAT-039",
    category: "Projection",
    statement: "Validate projection disclosure behavior 039 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 39.",
  }),
  Object.freeze({
    testId: "DAT-040",
    category: "Publication",
    statement: "Validate publication disclosure behavior 040 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 40.",
  }),
  Object.freeze({
    testId: "DAT-041",
    category: "Policy",
    statement: "Validate policy disclosure behavior 041 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 41.",
  }),
  Object.freeze({
    testId: "DAT-042",
    category: "Authority",
    statement: "Validate authority disclosure behavior 042 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 42.",
  }),
  Object.freeze({
    testId: "DAT-043",
    category: "Privacy",
    statement: "Validate privacy disclosure behavior 043 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 43.",
  }),
  Object.freeze({
    testId: "DAT-044",
    category: "Security",
    statement: "Validate security disclosure behavior 044 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 44.",
  }),
  Object.freeze({
    testId: "DAT-045",
    category: "Integrity",
    statement: "Validate integrity disclosure behavior 045 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 45.",
  }),
  Object.freeze({
    testId: "DAT-046",
    category: "Registry",
    statement: "Validate registry disclosure behavior 046 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 46.",
  }),
  Object.freeze({
    testId: "DAT-047",
    category: "Claims",
    statement: "Validate claims disclosure behavior 047 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 47.",
  }),
  Object.freeze({
    testId: "DAT-048",
    category: "Redaction",
    statement: "Validate redaction disclosure behavior 048 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 48.",
  }),
  Object.freeze({
    testId: "DAT-049",
    category: "Projection",
    statement: "Validate projection disclosure behavior 049 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 49.",
  }),
  Object.freeze({
    testId: "DAT-050",
    category: "Publication",
    statement: "Validate publication disclosure behavior 050 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 50.",
  }),
  Object.freeze({
    testId: "DAT-051",
    category: "Policy",
    statement: "Validate policy disclosure behavior 051 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 51.",
  }),
  Object.freeze({
    testId: "DAT-052",
    category: "Authority",
    statement: "Validate authority disclosure behavior 052 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 52.",
  }),
  Object.freeze({
    testId: "DAT-053",
    category: "Privacy",
    statement: "Validate privacy disclosure behavior 053 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 53.",
  }),
  Object.freeze({
    testId: "DAT-054",
    category: "Security",
    statement: "Validate security disclosure behavior 054 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 54.",
  }),
  Object.freeze({
    testId: "DAT-055",
    category: "Integrity",
    statement: "Validate integrity disclosure behavior 055 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 55.",
  }),
  Object.freeze({
    testId: "DAT-056",
    category: "Registry",
    statement: "Validate registry disclosure behavior 056 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 56.",
  }),
  Object.freeze({
    testId: "DAT-057",
    category: "Claims",
    statement: "Validate claims disclosure behavior 057 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 57.",
  }),
  Object.freeze({
    testId: "DAT-058",
    category: "Redaction",
    statement: "Validate redaction disclosure behavior 058 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 58.",
  }),
  Object.freeze({
    testId: "DAT-059",
    category: "Projection",
    statement: "Validate projection disclosure behavior 059 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 59.",
  }),
  Object.freeze({
    testId: "DAT-060",
    category: "Publication",
    statement: "Validate publication disclosure behavior 060 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 60.",
  }),
  Object.freeze({
    testId: "DAT-061",
    category: "Policy",
    statement: "Validate policy disclosure behavior 061 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 61.",
  }),
  Object.freeze({
    testId: "DAT-062",
    category: "Authority",
    statement: "Validate authority disclosure behavior 062 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 62.",
  }),
  Object.freeze({
    testId: "DAT-063",
    category: "Privacy",
    statement: "Validate privacy disclosure behavior 063 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 63.",
  }),
  Object.freeze({
    testId: "DAT-064",
    category: "Security",
    statement: "Validate security disclosure behavior 064 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 64.",
  }),
  Object.freeze({
    testId: "DAT-065",
    category: "Integrity",
    statement: "Validate integrity disclosure behavior 065 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 65.",
  }),
  Object.freeze({
    testId: "DAT-066",
    category: "Registry",
    statement: "Validate registry disclosure behavior 066 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 66.",
  }),
  Object.freeze({
    testId: "DAT-067",
    category: "Claims",
    statement: "Validate claims disclosure behavior 067 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 67.",
  }),
  Object.freeze({
    testId: "DAT-068",
    category: "Redaction",
    statement: "Validate redaction disclosure behavior 068 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 68.",
  }),
  Object.freeze({
    testId: "DAT-069",
    category: "Projection",
    statement: "Validate projection disclosure behavior 069 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 69.",
  }),
  Object.freeze({
    testId: "DAT-070",
    category: "Publication",
    statement: "Validate publication disclosure behavior 070 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 70.",
  }),
  Object.freeze({
    testId: "DAT-071",
    category: "Policy",
    statement: "Validate policy disclosure behavior 071 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 71.",
  }),
  Object.freeze({
    testId: "DAT-072",
    category: "Authority",
    statement: "Validate authority disclosure behavior 072 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 72.",
  }),
  Object.freeze({
    testId: "DAT-073",
    category: "Privacy",
    statement: "Validate privacy disclosure behavior 073 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 01.",
  }),
  Object.freeze({
    testId: "DAT-074",
    category: "Security",
    statement: "Validate security disclosure behavior 074 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 02.",
  }),
  Object.freeze({
    testId: "DAT-075",
    category: "Integrity",
    statement: "Validate integrity disclosure behavior 075 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 03.",
  }),
  Object.freeze({
    testId: "DAT-076",
    category: "Registry",
    statement: "Validate registry disclosure behavior 076 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 04.",
  }),
  Object.freeze({
    testId: "DAT-077",
    category: "Claims",
    statement: "Validate claims disclosure behavior 077 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 05.",
  }),
  Object.freeze({
    testId: "DAT-078",
    category: "Redaction",
    statement: "Validate redaction disclosure behavior 078 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 06.",
  }),
  Object.freeze({
    testId: "DAT-079",
    category: "Projection",
    statement: "Validate projection disclosure behavior 079 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 07.",
  }),
  Object.freeze({
    testId: "DAT-080",
    category: "Publication",
    statement: "Validate publication disclosure behavior 080 against the frozen canonical record.",
    passCondition: "The projection remains attributable, bounded, hash-committed, and consistent with policy control 08.",
  }),
]);

export function listDisclosureAcceptanceTests(category?: string): DisclosureAcceptanceTest[] {
  return category ? DISCLOSURE_ACCEPTANCE_TESTS.filter((test) => test.category === category) : [...DISCLOSURE_ACCEPTANCE_TESTS];
}
