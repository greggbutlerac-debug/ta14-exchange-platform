/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * ACD-006 — Academy Credential Contracts
 *
 * Create:
 *   apps/web/lib/academy/credential-contracts.ts
 *
 * Constitutional chain:
 *   Learning -> Assessment -> Eligibility Evidence -> Credential
 *   -> Separate Authority Review -> Authority Grant -> Bounded Assignment
 *
 * Hard boundaries:
 *   - A credential does not create authority.
 *   - A credential does not create an assignment.
 *   - A credential does not admit evidence.
 *   - A credential does not commit a determination.
 *   - A credential does not create Registry or artifact effect.
 */

import type {
  ContentHash,
  CorrelationIdentifier,
  CredentialState,
  InstitutionalIdentifier,
  InstitutionalRecordType,
  InstitutionalRole,
  ISODateTimeString,
  JsonValue,
  ProjectionClass,
  ValidationIssue,
} from "./lesson-contracts";

import {
  TA14_ACADEMY_NON_SUBSTITUTION_RULE,
  TA14_ACADEMY_OPERATING_PRINCIPLE,
  deepFreeze,
  isInstitutionalRecordType,
  isInstitutionalRole,
  isProjectionClass,
} from "./lesson-contracts";

import type {
  AcademyEventActor,
  AcademyEventAuthority,
  AcademyEventRecordRef,
  AcademyEventService,
  CredentialStatePayload,
} from "./academy-events";

import { createCredentialStateEventDraft } from "./academy-events";

import type { CredentialEligibilityEvidence } from "./assessment-contracts";

export const TA14_ACADEMY_CREDENTIAL_ENGINE_VERSION = "3.0" as const;
export const TA14_ACADEMY_CREDENTIAL_ENGINE_ID =
  "TA14-ACD-CREDENTIAL-ENGINE-000001" as const;
export const TA14_ACADEMY_CREDENTIAL_BOUNDARY =
  "A credential may preserve attributable evidence of bounded competence. It does not itself grant authority, create an assignment, admit evidence, commit a determination, create an execution artifact, or publish a Registry record." as const;

export const CREDENTIAL_PUBLICATION_STATES = [
  "draft",
  "active",
  "restricted",
  "superseded",
  "withdrawn",
] as const;
export type CredentialPublicationState =
  (typeof CREDENTIAL_PUBLICATION_STATES)[number];

export const CREDENTIAL_TYPES = [
  "orientation",
  "foundational",
  "practitioner",
  "reviewer",
  "artifact_steward",
  "registry_reviewer",
  "instructor",
  "specialist",
  "continuity",
  "domain",
  "microcredential",
  "certificate",
] as const;
export type AcademyCredentialType = (typeof CREDENTIAL_TYPES)[number];

export const CREDENTIAL_LEVELS = [
  "awareness",
  "foundational",
  "working",
  "applied",
  "advanced",
  "specialist",
] as const;
export type AcademyCredentialLevel = (typeof CREDENTIAL_LEVELS)[number];

export const CREDENTIAL_ISSUANCE_MODES = [
  "automatic_after_eligibility",
  "authorized_human_review",
  "hybrid",
  "panel",
] as const;
export type CredentialIssuanceMode =
  (typeof CREDENTIAL_ISSUANCE_MODES)[number];

export const CREDENTIAL_RENEWAL_MODES = [
  "none",
  "continuing_education",
  "reassessment",
  "portfolio_review",
  "authority_review",
  "hybrid",
] as const;
export type CredentialRenewalMode =
  (typeof CREDENTIAL_RENEWAL_MODES)[number];

export const CREDENTIAL_VISIBILITY_CLASSES = [
  "public",
  "authenticated",
  "organization",
  "controlled",
  "confidential",
  "embargoed",
] as const;
export type CredentialVisibilityClass =
  (typeof CREDENTIAL_VISIBILITY_CLASSES)[number];

export const CREDENTIAL_RESTRICTION_TYPES = [
  "scope",
  "jurisdiction",
  "organization",
  "division",
  "record_type",
  "role",
  "time",
  "supervision",
  "publication",
  "confidentiality",
  "assignment",
  "other",
] as const;
export type CredentialRestrictionType =
  (typeof CREDENTIAL_RESTRICTION_TYPES)[number];

export const CREDENTIAL_TRANSITION_ACTIONS = [
  "issue",
  "activate",
  "mark_expiring",
  "expire",
  "suspend",
  "reinstate",
  "revoke",
  "supersede",
  "renew",
] as const;
export type CredentialTransitionAction =
  (typeof CREDENTIAL_TRANSITION_ACTIONS)[number];

export interface CredentialDefinition {
  readonly credentialDefinitionId: InstitutionalIdentifier;
  readonly stableSlug: string;
  readonly title: string;
  readonly summary: string;
  readonly version: string;
  readonly locale: string;
  readonly publicationState: CredentialPublicationState;
  readonly credentialType: AcademyCredentialType;
  readonly level: AcademyCredentialLevel;
  readonly division: string;
  readonly operationalFunctions: readonly string[];
  readonly recordTypes: readonly InstitutionalRecordType[];
  readonly eligibleRoles: readonly InstitutionalRole[];
  readonly competencies: readonly CredentialCompetencyRequirement[];
  readonly eligibilityPolicy: CredentialEligibilityPolicy;
  readonly issuancePolicy: CredentialIssuancePolicy;
  readonly validityPolicy: CredentialValidityPolicy;
  readonly renewalPolicy: CredentialRenewalPolicy;
  readonly continuingEducationPolicy: ContinuingEducationPolicy;
  readonly suspensionPolicy: CredentialSuspensionPolicy;
  readonly revocationPolicy: CredentialRevocationPolicy;
  readonly supersessionPolicy: CredentialSupersessionPolicy;
  readonly verificationPolicy: CredentialVerificationPolicy;
  readonly projectionPolicy: CredentialProjectionPolicy;
  readonly revalidationPolicy: CredentialRevalidationPolicy;
  readonly authorityBoundary: string;
  readonly nonSubstitutionRule: typeof TA14_ACADEMY_NON_SUBSTITUTION_RULE;
  readonly contentHash: ContentHash;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly supersedesDefinitionId?: InstitutionalIdentifier;
  readonly supersedesVersion?: string;
  readonly metadata: CredentialDefinitionMetadata;
}

export interface CredentialDefinitionMetadata {
  readonly ownerSubjectId: InstitutionalIdentifier;
  readonly ownerOrganizationId?: InstitutionalIdentifier;
  readonly createdBy: InstitutionalIdentifier;
  readonly createdAt: ISODateTimeString;
  readonly updatedBy: InstitutionalIdentifier;
  readonly updatedAt: ISODateTimeString;
  readonly approvedBy?: InstitutionalIdentifier;
  readonly approvedAt?: ISODateTimeString;
  readonly academyStandardsReviewerId?: InstitutionalIdentifier;
  readonly technicalOwnerId?: InstitutionalIdentifier;
}

export interface CredentialCompetencyRequirement {
  readonly competencyId: string;
  readonly title: string;
  readonly description: string;
  readonly requiredLevel: AcademyCredentialLevel;
  readonly minimumEvidenceCount: number;
  readonly permittedEligibilityTypes: readonly string[];
  readonly evidenceFreshnessDays?: number;
  readonly requiresHumanReview: boolean;
  readonly boundaryCritical: boolean;
}

export interface CredentialEligibilityPolicy {
  readonly requiredEligibilityTypes: readonly string[];
  readonly minimumEvidenceCount: number;
  readonly allCompetenciesRequired: boolean;
  readonly permitConditionalPassEvidence: boolean;
  readonly evidenceMustBeActive: true;
  readonly evidenceMustMatchSubject: true;
  readonly evidenceMustMatchAssessmentVersion: boolean;
  readonly disqualifyingRestrictions: readonly string[];
  readonly conflictCheckRequired: boolean;
  readonly identityVerificationRequired: boolean;
}

export interface CredentialIssuancePolicy {
  readonly mode: CredentialIssuanceMode;
  readonly permittedIssuerRoles: readonly InstitutionalRole[];
  readonly minimumIssuerCount: number;
  readonly independentIssuerRequired: boolean;
  readonly issuerConflictCheckRequired: boolean;
  readonly serverValidationRequired: true;
  readonly serviceRoleCommitRequired: true;
  readonly idempotencyRequired: true;
  readonly issueOnlyCurrentDefinition: true;
  readonly createsAuthority: false;
  readonly createsAssignment: false;
  readonly createsRegistryEffect: false;
  readonly createsArtifactEffect: false;
}

export interface CredentialValidityPolicy {
  readonly startsOn: "issuance" | "activation";
  readonly validityDays?: number;
  readonly noExpiration: boolean;
  readonly expiringWarningDays: readonly number[];
  readonly gracePeriodDays?: number;
  readonly expirationEffect:
    | "credential_only"
    | "credential_and_eligibility_review";
  readonly authorityReviewTriggeredOnExpiry: boolean;
}

export interface CredentialRenewalPolicy {
  readonly mode: CredentialRenewalMode;
  readonly renewalWindowDays?: number;
  readonly renewalAfterExpiryAllowed: boolean;
  readonly maximumExpiredDaysForRenewal?: number;
  readonly requiredEligibilityTypes: readonly string[];
  readonly requiresCurrentDefinition: boolean;
  readonly createsNewCredentialVersion: true;
  readonly preservesPriorCredential: true;
}

export interface ContinuingEducationPolicy {
  readonly required: boolean;
  readonly cycleDays?: number;
  readonly requiredUnits?: number;
  readonly acceptedActivityTypes: readonly string[];
  readonly maximumSelfReportedUnits?: number;
  readonly evidenceRequired: boolean;
  readonly reviewRequired: boolean;
  readonly failureEffect:
    | "none"
    | "mark_expiring"
    | "suspend"
    | "expire";
}

export interface CredentialSuspensionPolicy {
  readonly permittedReasons: readonly string[];
  readonly permittedActorRoles: readonly InstitutionalRole[];
  readonly immediateForCriticalRisk: boolean;
  readonly noticeRequired: boolean;
  readonly appealAllowed: boolean;
  readonly preservesHistory: true;
  readonly mayTriggerAuthorityHold: boolean;
}

export interface CredentialRevocationPolicy {
  readonly permittedReasons: readonly string[];
  readonly permittedActorRoles: readonly InstitutionalRole[];
  readonly panelRequired: boolean;
  readonly minimumDecisionMakers: number;
  readonly noticeRequired: boolean;
  readonly appealAllowed: boolean;
  readonly preservesHistory: true;
  readonly stopsFutureCredentialReliance: true;
  readonly mayTriggerAuthorityRevocationReview: boolean;
}

export interface CredentialSupersessionPolicy {
  readonly supersedeOnDefinitionChange: boolean;
  readonly supersedeOnMaterialCompetencyChange: boolean;
  readonly preserveHistoricalMeaning: true;
  readonly createRevalidationAction: boolean;
  readonly mayRestrictCurrentCredential: boolean;
}

export interface CredentialVerificationPolicy {
  readonly publicVerificationAllowed: boolean;
  readonly verificationRoute?: string;
  readonly includeIntegrityHash: boolean;
  readonly includeIssuer: boolean;
  readonly includeCompetencyScope: boolean;
  readonly includeRestrictions: boolean;
  readonly includeExpiration: boolean;
  readonly includeAuthorityDisclaimer: true;
  readonly signedVerificationRequired: boolean;
}

export interface CredentialProjectionPolicy {
  readonly visibility: CredentialVisibilityClass;
  readonly publicSafe: boolean;
  readonly protectedFields: readonly string[];
  readonly publicSummary?: string;
  readonly permittedRoles?: readonly InstitutionalRole[];
  readonly permittedOrganizationIds?: readonly InstitutionalIdentifier[];
  readonly embargoUntil?: ISODateTimeString;
}

export interface CredentialRevalidationPolicy {
  readonly triggers: readonly string[];
  readonly severityByTrigger: Readonly<
    Record<string, "low" | "moderate" | "high" | "critical">
  >;
  readonly maySuspendCredential: boolean;
  readonly mayExpireCredential: boolean;
  readonly mayRequireReassessment: boolean;
  readonly mayRequireContinuingEducation: boolean;
  readonly mayTriggerAuthorityReview: boolean;
  readonly preserveHistoricalCredential: true;
}

export interface CredentialRestriction {
  readonly restrictionId: InstitutionalIdentifier;
  readonly type: CredentialRestrictionType;
  readonly title: string;
  readonly description: string;
  readonly values: readonly string[];
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly imposedBy: InstitutionalIdentifier;
  readonly authorityBasis: string;
}

export interface AcademyCredential {
  readonly credentialId: InstitutionalIdentifier;
  readonly credentialDefinitionId: InstitutionalIdentifier;
  readonly credentialDefinitionVersion: string;
  readonly credentialType: AcademyCredentialType;
  readonly subjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly state: CredentialState;
  readonly version: string;
  readonly issuedAt: ISODateTimeString;
  readonly activatedAt?: ISODateTimeString;
  readonly expiringAt?: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly suspendedAt?: ISODateTimeString;
  readonly revokedAt?: ISODateTimeString;
  readonly supersededAt?: ISODateTimeString;
  readonly issuerSubjectIds: readonly InstitutionalIdentifier[];
  readonly issuerOrganizationId?: InstitutionalIdentifier;
  readonly eligibilityEvidenceIds: readonly InstitutionalIdentifier[];
  readonly competencyScope: readonly string[];
  readonly restrictions: readonly CredentialRestriction[];
  readonly continuingEducationState?: ContinuingEducationState;
  readonly verification: CredentialVerificationRecord;
  readonly authorityCreated: false;
  readonly assignmentCreated: false;
  readonly registryEffectCreated: false;
  readonly artifactEffectCreated: false;
  readonly correlationId: CorrelationIdentifier;
  readonly integrityHash: ContentHash;
  readonly priorCredentialHash?: ContentHash;
  readonly createdAt: ISODateTimeString;
  readonly updatedAt: ISODateTimeString;
}

export interface CredentialVerificationRecord {
  readonly verificationId: InstitutionalIdentifier;
  readonly verificationRoute?: string;
  readonly publicVerificationAllowed: boolean;
  readonly signed: boolean;
  readonly signature?: string;
  readonly signatureAlgorithm?: "HMAC-SHA256" | "ED25519";
  readonly issuedAt: ISODateTimeString;
  readonly integrityHash: ContentHash;
}

export interface ContinuingEducationState {
  readonly cycleStartedAt: ISODateTimeString;
  readonly cycleEndsAt: ISODateTimeString;
  readonly requiredUnits: number;
  readonly completedUnits: number;
  readonly acceptedActivityIds: readonly InstitutionalIdentifier[];
  readonly state:
    | "not_started"
    | "in_progress"
    | "complete"
    | "overdue"
    | "waived";
}

export interface CredentialIssuanceRequest {
  readonly requestId: InstitutionalIdentifier;
  readonly credentialDefinitionId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly eligibilityEvidenceIds: readonly InstitutionalIdentifier[];
  readonly requestedBy: InstitutionalIdentifier;
  readonly requestedAt: ISODateTimeString;
  readonly correlationId: CorrelationIdentifier;
  readonly idempotencyKey: string;
  readonly requestedRestrictions: readonly CredentialRestriction[];
  readonly state:
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "denied"
    | "returned_for_correction"
    | "issued";
}

export interface CredentialIssuanceDecision {
  readonly decisionId: InstitutionalIdentifier;
  readonly requestId: InstitutionalIdentifier;
  readonly decision:
    | "approve"
    | "deny"
    | "return_for_correction"
    | "escalate";
  readonly decidedBy: readonly InstitutionalIdentifier[];
  readonly decidedAt: ISODateTimeString;
  readonly authorityBasis: string;
  readonly rationale: string;
  readonly restrictions: readonly CredentialRestriction[];
  readonly limitations: readonly string[];
  readonly createsAuthority: false;
}

export interface CredentialTransitionRequest {
  readonly transitionId: InstitutionalIdentifier;
  readonly credentialId: InstitutionalIdentifier;
  readonly action: CredentialTransitionAction;
  readonly reason: string;
  readonly requestedBy: InstitutionalIdentifier;
  readonly requestedAt: ISODateTimeString;
  readonly authorityBasis: string;
  readonly correlationId: CorrelationIdentifier;
  readonly idempotencyKey: string;
  readonly effectiveAt?: ISODateTimeString;
  readonly replacementCredentialId?: InstitutionalIdentifier;
}

export interface CredentialTransitionResult {
  readonly credential: AcademyCredential;
  readonly priorState: CredentialState;
  readonly newState: CredentialState;
  readonly transitionId: InstitutionalIdentifier;
  readonly authorityReviewRecommended: boolean;
  readonly authorityCreated: false;
  readonly assignmentCreated: false;
}

export interface CredentialEligibilityEvaluation {
  readonly eligible: boolean;
  readonly subjectId: InstitutionalIdentifier;
  readonly credentialDefinitionId: InstitutionalIdentifier;
  readonly acceptedEvidenceIds: readonly InstitutionalIdentifier[];
  readonly rejectedEvidence: readonly CredentialEvidenceRejection[];
  readonly satisfiedCompetencyIds: readonly string[];
  readonly missingCompetencyIds: readonly string[];
  readonly restrictions: readonly string[];
  readonly warnings: readonly string[];
}

export interface CredentialEvidenceRejection {
  readonly evidenceId: InstitutionalIdentifier;
  readonly reason:
    | "inactive"
    | "expired"
    | "wrong_subject"
    | "wrong_type"
    | "restricted"
    | "stale"
    | "insufficient_result"
    | "duplicate"
    | "unknown";
  readonly explanation: string;
}

export interface CredentialVerificationProjection {
  readonly credentialId: InstitutionalIdentifier;
  readonly title: string;
  readonly credentialType: AcademyCredentialType;
  readonly subjectDisplay: string;
  readonly state: CredentialState;
  readonly version: string;
  readonly issuedAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly competencyScope: readonly string[];
  readonly restrictions: readonly string[];
  readonly issuerDisplay: readonly string[];
  readonly integrityHash?: ContentHash;
  readonly authorityDisclaimer: string;
}

export interface CredentialAnalytics {
  readonly credentialDefinitionId: InstitutionalIdentifier;
  readonly issuedCount: number;
  readonly activeCount: number;
  readonly expiringCount: number;
  readonly expiredCount: number;
  readonly suspendedCount: number;
  readonly revokedCount: number;
  readonly supersededCount: number;
  readonly renewalCount: number;
  readonly authorityCreatedCount: 0;
  readonly assignmentCreatedCount: 0;
}

export type CredentialValidationCode =
  | "required"
  | "invalid_type"
  | "invalid_value"
  | "invalid_format"
  | "unsupported_value"
  | "duplicate_value"
  | "inconsistent_state"
  | "invalid_hash"
  | "invalid_version"
  | "invalid_effective_time"
  | "unsafe_authority_effect"
  | "unsafe_assignment_effect"
  | "unsafe_registry_effect"
  | "unsafe_artifact_effect"
  | "missing_boundary"
  | "missing_eligibility_policy"
  | "missing_issuance_policy"
  | "missing_validity_policy"
  | "invalid_transition"
  | "invalid_evidence"
  | "invalid_projection";

export interface CredentialValidationIssue {
  readonly path: string;
  readonly code: CredentialValidationCode;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly received?: unknown;
  readonly expected?: string;
}

export interface CredentialValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly issues: readonly CredentialValidationIssue[];
}

export class CredentialContractValidationError extends Error {
  readonly issues: readonly CredentialValidationIssue[];

  constructor(message: string, issues: readonly CredentialValidationIssue[]) {
    super(message);
    this.name = "CredentialContractValidationError";
    this.issues = issues;
  }
}

export function validateCredentialDefinition(
  input: unknown,
): CredentialValidationResult<CredentialDefinition> {
  const issues: CredentialValidationIssue[] = [];

  if (!isObject(input)) {
    return {
      ok: false,
      issues: [
        {
          path: "$",
          code: "invalid_type",
          message: "Credential definition must be an object.",
          severity: "error",
          received: input,
        },
      ],
    };
  }

  requiredString(input.credentialDefinitionId, "$.credentialDefinitionId", issues);
  requiredString(input.stableSlug, "$.stableSlug", issues);
  requiredString(input.title, "$.title", issues);
  requiredString(input.summary, "$.summary", issues);
  requiredString(input.locale, "$.locale", issues);
  requiredString(input.division, "$.division", issues);
  requiredString(input.authorityBoundary, "$.authorityBoundary", issues);

  if (!isVersion(input.version)) {
    addIssue(issues, "$.version", "invalid_version", "Version must be semantic-version-like.", input.version);
  }

  if (!isOneOf(input.publicationState, CREDENTIAL_PUBLICATION_STATES)) {
    addIssue(issues, "$.publicationState", "unsupported_value", "Unsupported publication state.", input.publicationState);
  }

  if (!isOneOf(input.credentialType, CREDENTIAL_TYPES)) {
    addIssue(issues, "$.credentialType", "unsupported_value", "Unsupported credential type.", input.credentialType);
  }

  if (!isOneOf(input.level, CREDENTIAL_LEVELS)) {
    addIssue(issues, "$.level", "unsupported_value", "Unsupported credential level.", input.level);
  }

  stringArray(input.operationalFunctions, "$.operationalFunctions", issues, true);
  enumArray(input.recordTypes, "$.recordTypes", isInstitutionalRecordType, issues);
  enumArray(input.eligibleRoles, "$.eligibleRoles", isInstitutionalRole, issues);

  validateEligibilityPolicy(input.eligibilityPolicy, "$.eligibilityPolicy", issues);
  validateIssuancePolicy(input.issuancePolicy, "$.issuancePolicy", issues);
  validateValidityPolicy(input.validityPolicy, "$.validityPolicy", issues);
  validateProjectionPolicy(input.projectionPolicy, "$.projectionPolicy", issues);

  if (input.nonSubstitutionRule !== TA14_ACADEMY_NON_SUBSTITUTION_RULE) {
    addIssue(
      issues,
      "$.nonSubstitutionRule",
      "missing_boundary",
      "Canonical non-substitution rule is required.",
      input.nonSubstitutionRule,
    );
  }

  if (!isContentHash(input.contentHash)) {
    addIssue(issues, "$.contentHash", "invalid_hash", "Content hash must be sha256 plus 64 hexadecimal characters.", input.contentHash);
  }

  if (!isDateTime(input.effectiveAt)) {
    addIssue(issues, "$.effectiveAt", "invalid_effective_time", "effectiveAt must be an ISO date-time.", input.effectiveAt);
  }

  if (input.expiresAt !== undefined && !isDateTime(input.expiresAt)) {
    addIssue(issues, "$.expiresAt", "invalid_effective_time", "expiresAt must be an ISO date-time.", input.expiresAt);
  }

  const ok = !issues.some((issue) => issue.severity === "error");
  return {
    ok,
    value: ok ? (input as unknown as CredentialDefinition) : undefined,
    issues,
  };
}

export function validateAcademyCredential(
  input: unknown,
): CredentialValidationResult<AcademyCredential> {
  const issues: CredentialValidationIssue[] = [];

  if (!isObject(input)) {
    return {
      ok: false,
      issues: [
        {
          path: "$",
          code: "invalid_type",
          message: "Academy credential must be an object.",
          severity: "error",
          received: input,
        },
      ],
    };
  }

  requiredString(input.credentialId, "$.credentialId", issues);
  requiredString(input.credentialDefinitionId, "$.credentialDefinitionId", issues);
  requiredString(input.credentialDefinitionVersion, "$.credentialDefinitionVersion", issues);
  requiredString(input.subjectId, "$.subjectId", issues);
  requiredString(input.version, "$.version", issues);
  requiredString(input.correlationId, "$.correlationId", issues);

  if (!isOneOf(input.state, [
    "pending",
    "active",
    "expiring",
    "expired",
    "suspended",
    "revoked",
    "superseded",
  ] as const)) {
    addIssue(issues, "$.state", "unsupported_value", "Unsupported credential state.", input.state);
  }

  if (input.authorityCreated !== false) {
    addIssue(issues, "$.authorityCreated", "unsafe_authority_effect", "Credential may not create authority.", input.authorityCreated);
  }
  if (input.assignmentCreated !== false) {
    addIssue(issues, "$.assignmentCreated", "unsafe_assignment_effect", "Credential may not create assignment.", input.assignmentCreated);
  }
  if (input.registryEffectCreated !== false) {
    addIssue(issues, "$.registryEffectCreated", "unsafe_registry_effect", "Credential may not create Registry effect.", input.registryEffectCreated);
  }
  if (input.artifactEffectCreated !== false) {
    addIssue(issues, "$.artifactEffectCreated", "unsafe_artifact_effect", "Credential may not create artifact effect.", input.artifactEffectCreated);
  }

  if (!isContentHash(input.integrityHash)) {
    addIssue(issues, "$.integrityHash", "invalid_hash", "Credential integrity hash is invalid.", input.integrityHash);
  }

  const ok = !issues.some((issue) => issue.severity === "error");
  return {
    ok,
    value: ok ? (input as unknown as AcademyCredential) : undefined,
    issues,
  };
}

function validateEligibilityPolicy(
  input: unknown,
  path: string,
  issues: CredentialValidationIssue[],
): void {
  if (!isObject(input)) {
    addIssue(issues, path, "missing_eligibility_policy", "Eligibility policy is required.", input);
    return;
  }
  stringArray(input.requiredEligibilityTypes, `${path}.requiredEligibilityTypes`, issues, true);
  if (input.evidenceMustBeActive !== true) {
    addIssue(issues, `${path}.evidenceMustBeActive`, "inconsistent_state", "Eligibility evidence must be active.", input.evidenceMustBeActive);
  }
  if (input.evidenceMustMatchSubject !== true) {
    addIssue(issues, `${path}.evidenceMustMatchSubject`, "inconsistent_state", "Eligibility evidence must match the credential subject.", input.evidenceMustMatchSubject);
  }
}

function validateIssuancePolicy(
  input: unknown,
  path: string,
  issues: CredentialValidationIssue[],
): void {
  if (!isObject(input)) {
    addIssue(issues, path, "missing_issuance_policy", "Issuance policy is required.", input);
    return;
  }
  if (!isOneOf(input.mode, CREDENTIAL_ISSUANCE_MODES)) {
    addIssue(issues, `${path}.mode`, "unsupported_value", "Unsupported issuance mode.", input.mode);
  }
  enumArray(input.permittedIssuerRoles, `${path}.permittedIssuerRoles`, isInstitutionalRole, issues);
  for (const field of [
    "serverValidationRequired",
    "serviceRoleCommitRequired",
    "idempotencyRequired",
    "issueOnlyCurrentDefinition",
  ] as const) {
    if (input[field] !== true) {
      addIssue(issues, `${path}.${field}`, "inconsistent_state", `${field} must be true.`, input[field]);
    }
  }
  for (const field of [
    "createsAuthority",
    "createsAssignment",
    "createsRegistryEffect",
    "createsArtifactEffect",
  ] as const) {
    if (input[field] !== false) {
      addIssue(issues, `${path}.${field}`, "unsafe_authority_effect", `${field} must be false.`, input[field]);
    }
  }
}

function validateValidityPolicy(
  input: unknown,
  path: string,
  issues: CredentialValidationIssue[],
): void {
  if (!isObject(input)) {
    addIssue(issues, path, "missing_validity_policy", "Validity policy is required.", input);
    return;
  }
  if (input.noExpiration !== true && (typeof input.validityDays !== "number" || input.validityDays <= 0)) {
    addIssue(issues, `${path}.validityDays`, "invalid_value", "A positive validityDays value is required when noExpiration is false.", input.validityDays);
  }
}

function validateProjectionPolicy(
  input: unknown,
  path: string,
  issues: CredentialValidationIssue[],
): void {
  if (!isObject(input)) {
    addIssue(issues, path, "invalid_projection", "Projection policy is required.", input);
    return;
  }
  if (!isOneOf(input.visibility, CREDENTIAL_VISIBILITY_CLASSES)) {
    addIssue(issues, `${path}.visibility`, "invalid_projection", "Unsupported visibility.", input.visibility);
  }
  if (typeof input.publicSafe !== "boolean") {
    addIssue(issues, `${path}.publicSafe`, "invalid_type", "publicSafe must be boolean.", input.publicSafe);
  }
}

export function evaluateCredentialEligibility(
  definition: CredentialDefinition,
  subjectId: InstitutionalIdentifier,
  evidence: readonly CredentialEligibilityEvidence[],
  now: ISODateTimeString,
): CredentialEligibilityEvaluation {
  const acceptedEvidenceIds: InstitutionalIdentifier[] = [];
  const rejectedEvidence: CredentialEvidenceRejection[] = [];
  const satisfied = new Set<string>();
  const restrictions = new Set<string>();
  const seen = new Set<InstitutionalIdentifier>();

  for (const item of evidence) {
    if (seen.has(item.evidenceId)) {
      rejectedEvidence.push({
        evidenceId: item.evidenceId,
        reason: "duplicate",
        explanation: "The same eligibility evidence was supplied more than once.",
      });
      continue;
    }
    seen.add(item.evidenceId);

    if (item.subjectId !== subjectId) {
      rejectedEvidence.push({
        evidenceId: item.evidenceId,
        reason: "wrong_subject",
        explanation: "Eligibility evidence belongs to a different institutional subject.",
      });
      continue;
    }

    if (item.state !== "active") {
      rejectedEvidence.push({
        evidenceId: item.evidenceId,
        reason: "inactive",
        explanation: `Eligibility evidence is ${item.state}.`,
      });
      continue;
    }

    if (item.expiresAt && Date.parse(item.expiresAt) <= Date.parse(now)) {
      rejectedEvidence.push({
        evidenceId: item.evidenceId,
        reason: "expired",
        explanation: "Eligibility evidence has expired.",
      });
      continue;
    }

    if (!definition.eligibilityPolicy.requiredEligibilityTypes.includes(item.eligibilityType)) {
      rejectedEvidence.push({
        evidenceId: item.evidenceId,
        reason: "wrong_type",
        explanation: `Eligibility type ${item.eligibilityType} is not accepted for this credential.`,
      });
      continue;
    }

    if (
      item.result === "conditionally_passed" &&
      !definition.eligibilityPolicy.permitConditionalPassEvidence
    ) {
      rejectedEvidence.push({
        evidenceId: item.evidenceId,
        reason: "insufficient_result",
        explanation: "Conditional pass evidence is not accepted for this credential.",
      });
      continue;
    }

    const disqualifying = item.restrictions.filter((restriction) =>
      definition.eligibilityPolicy.disqualifyingRestrictions.includes(restriction),
    );
    if (disqualifying.length > 0) {
      rejectedEvidence.push({
        evidenceId: item.evidenceId,
        reason: "restricted",
        explanation: `Evidence contains disqualifying restrictions: ${disqualifying.join(", ")}.`,
      });
      continue;
    }

    acceptedEvidenceIds.push(item.evidenceId);
    item.competencyIds.forEach((competencyId) => satisfied.add(competencyId));
    item.restrictions.forEach((restriction) => restrictions.add(restriction));
  }

  const requiredCompetencyIds = definition.competencies.map((item) => item.competencyId);
  const missingCompetencyIds = requiredCompetencyIds.filter((id) => !satisfied.has(id));
  const allTypesPresent = definition.eligibilityPolicy.requiredEligibilityTypes.every((type) =>
    evidence.some(
      (item) => acceptedEvidenceIds.includes(item.evidenceId) && item.eligibilityType === type,
    ),
  );

  const eligible =
    acceptedEvidenceIds.length >= definition.eligibilityPolicy.minimumEvidenceCount &&
    allTypesPresent &&
    (definition.eligibilityPolicy.allCompetenciesRequired
      ? missingCompetencyIds.length === 0
      : satisfied.size > 0);

  return deepFreeze({
    eligible,
    subjectId,
    credentialDefinitionId: definition.credentialDefinitionId,
    acceptedEvidenceIds,
    rejectedEvidence,
    satisfiedCompetencyIds: Array.from(satisfied),
    missingCompetencyIds,
    restrictions: Array.from(restrictions),
    warnings: eligible
      ? ["Eligibility supports credential issuance review only. It does not create authority."]
      : ["Credential eligibility requirements are not yet satisfied."],
  });
}

export interface CredentialIdentifierFactory {
  createCredentialId(): InstitutionalIdentifier;
  createVerificationId(): InstitutionalIdentifier;
  createDecisionId(): InstitutionalIdentifier;
  createTransitionId(): InstitutionalIdentifier;
}

export interface CredentialHashProvider {
  hashCanonicalValue(value: JsonValue): Promise<ContentHash> | ContentHash;
}

export async function issueAcademyCredential(
  input: {
    readonly definition: CredentialDefinition;
    readonly request: CredentialIssuanceRequest;
    readonly decision: CredentialIssuanceDecision;
    readonly eligibility: CredentialEligibilityEvaluation;
    readonly ids: CredentialIdentifierFactory;
    readonly hash: CredentialHashProvider;
    readonly now: ISODateTimeString;
  },
): Promise<AcademyCredential> {
  const { definition, request, decision, eligibility, ids, hash, now } = input;

  if (decision.decision !== "approve") {
    throw new Error("Credential issuance requires an approved issuance decision.");
  }
  if (!eligibility.eligible) {
    throw new Error("Credential issuance requires satisfied eligibility requirements.");
  }
  if (request.subjectId !== eligibility.subjectId) {
    throw new Error("Credential request and eligibility subject do not match.");
  }

  const credentialId = ids.createCredentialId();
  const expiresAt = definition.validityPolicy.noExpiration
    ? undefined
    : new Date(
        Date.parse(now) + (definition.validityPolicy.validityDays ?? 0) * 86_400_000,
      ).toISOString();
  const expiringAt = expiresAt && definition.validityPolicy.expiringWarningDays.length > 0
    ? new Date(
        Date.parse(expiresAt) -
          Math.max(...definition.validityPolicy.expiringWarningDays) * 86_400_000,
      ).toISOString()
    : undefined;

  const verificationId = ids.createVerificationId();
  const verificationBase = {
    verificationId,
    credentialId,
    definitionId: definition.credentialDefinitionId,
    definitionVersion: definition.version,
    subjectId: request.subjectId,
    issuedAt: now,
  };
  const verificationHash = await hash.hashCanonicalValue(
    verificationBase as unknown as JsonValue,
  );

  const base = {
    credentialId,
    credentialDefinitionId: definition.credentialDefinitionId,
    credentialDefinitionVersion: definition.version,
    credentialType: definition.credentialType,
    subjectId: request.subjectId,
    organizationId: request.organizationId,
    state: "active" as const,
    version: "1.0",
    issuedAt: now,
    activatedAt: now,
    expiringAt,
    expiresAt,
    issuerSubjectIds: [...decision.decidedBy],
    eligibilityEvidenceIds: [...eligibility.acceptedEvidenceIds],
    competencyScope: eligibility.satisfiedCompetencyIds,
    restrictions: [...request.requestedRestrictions, ...decision.restrictions],
    verification: {
      verificationId,
      verificationRoute: definition.verificationPolicy.verificationRoute,
      publicVerificationAllowed:
        definition.verificationPolicy.publicVerificationAllowed,
      signed: definition.verificationPolicy.signedVerificationRequired,
      issuedAt: now,
      integrityHash: verificationHash,
    },
    authorityCreated: false as const,
    assignmentCreated: false as const,
    registryEffectCreated: false as const,
    artifactEffectCreated: false as const,
    correlationId: request.correlationId,
    createdAt: now,
    updatedAt: now,
  };

  const integrityHash = await hash.hashCanonicalValue(base as unknown as JsonValue);
  const credential: AcademyCredential = {
    ...base,
    integrityHash,
  };

  const validation = validateAcademyCredential(credential);
  if (!validation.ok) {
    throw new CredentialContractValidationError(
      "Issued credential failed validation.",
      validation.issues,
    );
  }

  return deepFreeze(credential);
}

const CREDENTIAL_TRANSITIONS: Readonly<
  Record<CredentialState, Readonly<Partial<Record<CredentialTransitionAction, CredentialState>>>>
> = {
  pending: {
    activate: "active",
    revoke: "revoked",
  },
  active: {
    mark_expiring: "expiring",
    suspend: "suspended",
    revoke: "revoked",
    supersede: "superseded",
    expire: "expired",
    renew: "active",
  },
  expiring: {
    renew: "active",
    suspend: "suspended",
    revoke: "revoked",
    expire: "expired",
    supersede: "superseded",
  },
  expired: {
    renew: "active",
    supersede: "superseded",
  },
  suspended: {
    reinstate: "active",
    revoke: "revoked",
    expire: "expired",
    supersede: "superseded",
  },
  revoked: {},
  superseded: {},
};

export async function transitionAcademyCredential(
  credential: AcademyCredential,
  request: CredentialTransitionRequest,
  hash: CredentialHashProvider,
  now: ISODateTimeString,
): Promise<CredentialTransitionResult> {
  const nextState = CREDENTIAL_TRANSITIONS[credential.state][request.action];
  if (!nextState) {
    throw new CredentialContractValidationError(
      `Transition ${request.action} is not permitted from ${credential.state}.`,
      [
        {
          path: "$.action",
          code: "invalid_transition",
          message: `Transition ${request.action} is not permitted from ${credential.state}.`,
          severity: "error",
          received: request.action,
        },
      ],
    );
  }

  const base: AcademyCredential = {
    ...credential,
    state: nextState,
    version: incrementVersion(credential.version),
    expiringAt: nextState === "expiring" ? request.effectiveAt ?? now : credential.expiringAt,
    expiresAt: nextState === "expired" ? request.effectiveAt ?? now : credential.expiresAt,
    suspendedAt: nextState === "suspended" ? request.effectiveAt ?? now : credential.suspendedAt,
    revokedAt: nextState === "revoked" ? request.effectiveAt ?? now : credential.revokedAt,
    supersededAt: nextState === "superseded" ? request.effectiveAt ?? now : credential.supersededAt,
    priorCredentialHash: credential.integrityHash,
    correlationId: request.correlationId,
    updatedAt: now,
    authorityCreated: false,
    assignmentCreated: false,
    registryEffectCreated: false,
    artifactEffectCreated: false,
    integrityHash: credential.integrityHash,
  };

  const integrityHash = await hash.hashCanonicalValue(base as unknown as JsonValue);
  const next = deepFreeze({ ...base, integrityHash });

  return {
    credential: next,
    priorState: credential.state,
    newState: nextState,
    transitionId: request.transitionId,
    authorityReviewRecommended:
      nextState === "expired" ||
      nextState === "suspended" ||
      nextState === "revoked" ||
      nextState === "superseded",
    authorityCreated: false,
    assignmentCreated: false,
  };
}

export interface CredentialDefinitionRepository {
  getDefinition(
    definitionId: InstitutionalIdentifier,
    version?: string,
  ): Promise<CredentialDefinition | null>;
  getActiveDefinition(
    definitionId: InstitutionalIdentifier,
    at?: ISODateTimeString,
  ): Promise<CredentialDefinition | null>;
  saveDefinition(definition: CredentialDefinition): Promise<void>;
}

export interface AcademyCredentialRepository {
  getCredential(credentialId: InstitutionalIdentifier): Promise<AcademyCredential | null>;
  saveCredential(credential: AcademyCredential): Promise<void>;
  listCredentials(filter: CredentialFilter): Promise<readonly AcademyCredential[]>;
}

export interface CredentialIssuanceRequestRepository {
  getRequest(requestId: InstitutionalIdentifier): Promise<CredentialIssuanceRequest | null>;
  saveRequest(request: CredentialIssuanceRequest): Promise<void>;
}

export interface CredentialFilter {
  readonly subjectId?: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly definitionId?: InstitutionalIdentifier;
  readonly states?: readonly CredentialState[];
  readonly credentialTypes?: readonly AcademyCredentialType[];
}

export class InMemoryCredentialDefinitionRepository
  implements CredentialDefinitionRepository
{
  private readonly values = new Map<string, CredentialDefinition>();

  async getDefinition(
    definitionId: InstitutionalIdentifier,
    version?: string,
  ): Promise<CredentialDefinition | null> {
    if (version) return this.values.get(`${definitionId}@${version}`) ?? null;
    return (
      Array.from(this.values.values())
        .filter((value) => value.credentialDefinitionId === definitionId)
        .sort((a, b) => Date.parse(b.effectiveAt) - Date.parse(a.effectiveAt))[0] ?? null
    );
  }

  async getActiveDefinition(
    definitionId: InstitutionalIdentifier,
    at = new Date().toISOString(),
  ): Promise<CredentialDefinition | null> {
    const time = Date.parse(at);
    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.credentialDefinitionId === definitionId &&
            value.publicationState === "active" &&
            Date.parse(value.effectiveAt) <= time &&
            (!value.expiresAt || Date.parse(value.expiresAt) > time),
        )
        .sort((a, b) => Date.parse(b.effectiveAt) - Date.parse(a.effectiveAt))[0] ?? null
    );
  }

  async saveDefinition(definition: CredentialDefinition): Promise<void> {
    const validation = validateCredentialDefinition(definition);
    if (!validation.ok) {
      throw new CredentialContractValidationError(
        "Cannot save invalid credential definition.",
        validation.issues,
      );
    }
    const key = `${definition.credentialDefinitionId}@${definition.version}`;
    if (this.values.has(key)) {
      throw new Error(`Credential definition ${key} is immutable and already exists.`);
    }
    this.values.set(key, deepFreeze(definition));
  }
}

export class InMemoryAcademyCredentialRepository
  implements AcademyCredentialRepository
{
  private readonly values = new Map<InstitutionalIdentifier, AcademyCredential>();

  async getCredential(
    credentialId: InstitutionalIdentifier,
  ): Promise<AcademyCredential | null> {
    return this.values.get(credentialId) ?? null;
  }

  async saveCredential(credential: AcademyCredential): Promise<void> {
    const validation = validateAcademyCredential(credential);
    if (!validation.ok) {
      throw new CredentialContractValidationError(
        "Cannot save invalid credential.",
        validation.issues,
      );
    }
    this.values.set(credential.credentialId, deepFreeze(credential));
  }

  async listCredentials(filter: CredentialFilter): Promise<readonly AcademyCredential[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter((value) => !filter.subjectId || value.subjectId === filter.subjectId)
        .filter(
          (value) =>
            !filter.organizationId || value.organizationId === filter.organizationId,
        )
        .filter(
          (value) =>
            !filter.definitionId ||
            value.credentialDefinitionId === filter.definitionId,
        )
        .filter((value) => !filter.states?.length || filter.states.includes(value.state))
        .filter(
          (value) =>
            !filter.credentialTypes?.length ||
            filter.credentialTypes.includes(value.credentialType),
        ),
    );
  }
}

export class InMemoryCredentialIssuanceRequestRepository
  implements CredentialIssuanceRequestRepository
{
  private readonly values = new Map<
    InstitutionalIdentifier,
    CredentialIssuanceRequest
  >();

  async getRequest(
    requestId: InstitutionalIdentifier,
  ): Promise<CredentialIssuanceRequest | null> {
    return this.values.get(requestId) ?? null;
  }

  async saveRequest(request: CredentialIssuanceRequest): Promise<void> {
    this.values.set(request.requestId, deepFreeze(request));
  }
}

export interface CredentialServiceDependencies {
  readonly definitions: CredentialDefinitionRepository;
  readonly credentials: AcademyCredentialRepository;
  readonly requests: CredentialIssuanceRequestRepository;
  readonly events?: AcademyEventService;
  readonly ids: CredentialIdentifierFactory;
  readonly hash: CredentialHashProvider;
  readonly now: () => ISODateTimeString;
}

export class AcademyCredentialService {
  constructor(private readonly dependencies: CredentialServiceDependencies) {}

  async issue(input: {
    readonly request: CredentialIssuanceRequest;
    readonly decision: CredentialIssuanceDecision;
    readonly eligibility: CredentialEligibilityEvaluation;
    readonly eventContext?: CredentialEventContext;
  }): Promise<AcademyCredential> {
    const definition = await this.dependencies.definitions.getActiveDefinition(
      input.request.credentialDefinitionId,
      this.dependencies.now(),
    );
    if (!definition) {
      throw new Error(
        `Active credential definition ${input.request.credentialDefinitionId} was not found.`,
      );
    }

    const credential = await issueAcademyCredential({
      definition,
      request: input.request,
      decision: input.decision,
      eligibility: input.eligibility,
      ids: this.dependencies.ids,
      hash: this.dependencies.hash,
      now: this.dependencies.now(),
    });

    await this.dependencies.credentials.saveCredential(credential);

    if (this.dependencies.events && input.eventContext) {
      await emitCredentialEvent(
        this.dependencies.events,
        credential,
        null,
        "academy.credential.issued",
        input.eventContext,
      );
    }

    return credential;
  }

  async transition(input: {
    readonly request: CredentialTransitionRequest;
    readonly eventContext?: CredentialEventContext;
  }): Promise<CredentialTransitionResult> {
    const credential = await this.dependencies.credentials.getCredential(
      input.request.credentialId,
    );
    if (!credential) {
      throw new Error(`Credential ${input.request.credentialId} was not found.`);
    }

    const result = await transitionAcademyCredential(
      credential,
      input.request,
      this.dependencies.hash,
      this.dependencies.now(),
    );
    await this.dependencies.credentials.saveCredential(result.credential);

    if (this.dependencies.events && input.eventContext) {
      await emitCredentialEvent(
        this.dependencies.events,
        result.credential,
        result.priorState,
        credentialEventTypeForState(result.newState),
        input.eventContext,
      );
    }

    return result;
  }
}

export interface CredentialEventContext {
  readonly actor: AcademyEventActor;
  readonly authority: AcademyEventAuthority;
  readonly record: AcademyEventRecordRef;
  readonly idempotencyKey: string;
}

async function emitCredentialEvent(
  events: AcademyEventService,
  credential: AcademyCredential,
  priorState: CredentialState | null,
  eventType:
    | "academy.credential.issued"
    | "academy.credential.suspended"
    | "academy.credential.revoked"
    | "academy.credential.expiring"
    | "academy.credential.expired"
    | "academy.credential.superseded",
  context: CredentialEventContext,
): Promise<void> {
  const payload: CredentialStatePayload = {
    credentialId: credential.credentialId,
    credentialType: credential.credentialType,
    priorState,
    newState: credential.state,
    competenceScope: credential.competencyScope,
    restrictions: credential.restrictions.map((item) => item.description),
    effectiveAt: credential.activatedAt ?? credential.issuedAt,
    expiresAt: credential.expiresAt,
    authorityCreated: false,
  };

  await events.emit(
    createCredentialStateEventDraft({
      eventType,
      actor: context.actor,
      authority: context.authority,
      record: context.record,
      correlationId: credential.correlationId,
      idempotencyKey: context.idempotencyKey,
      payload,
    }),
  );
}

function credentialEventTypeForState(
  state: CredentialState,
):
  | "academy.credential.issued"
  | "academy.credential.suspended"
  | "academy.credential.revoked"
  | "academy.credential.expiring"
  | "academy.credential.expired"
  | "academy.credential.superseded" {
  switch (state) {
    case "suspended":
      return "academy.credential.suspended";
    case "revoked":
      return "academy.credential.revoked";
    case "expiring":
      return "academy.credential.expiring";
    case "expired":
      return "academy.credential.expired";
    case "superseded":
      return "academy.credential.superseded";
    default:
      return "academy.credential.issued";
  }
}

export function projectCredentialVerification(
  definition: CredentialDefinition,
  credential: AcademyCredential,
  projection: ProjectionClass,
  subjectDisplay = "Credential holder",
): CredentialVerificationProjection {
  if (!isProjectionClass(projection)) {
    throw new Error("Unsupported credential projection.");
  }

  if (
    projection === "public" &&
    (!definition.projectionPolicy.publicSafe ||
      !credential.verification.publicVerificationAllowed)
  ) {
    throw new Error("Credential is not eligible for public verification.");
  }

  const publicMode = projection === "public";
  return deepFreeze({
    credentialId: credential.credentialId,
    title: definition.title,
    credentialType: credential.credentialType,
    subjectDisplay,
    state: credential.state,
    version: credential.version,
    issuedAt: credential.issuedAt,
    expiresAt: credential.expiresAt,
    competencyScope: definition.verificationPolicy.includeCompetencyScope
      ? credential.competencyScope
      : [],
    restrictions: definition.verificationPolicy.includeRestrictions
      ? credential.restrictions.map((item) => item.description)
      : [],
    issuerDisplay: definition.verificationPolicy.includeIssuer
      ? credential.issuerSubjectIds
      : [],
    integrityHash:
      definition.verificationPolicy.includeIntegrityHash && !publicMode
        ? credential.integrityHash
        : undefined,
    authorityDisclaimer: TA14_ACADEMY_CREDENTIAL_BOUNDARY,
  });
}

export function buildCredentialAnalytics(
  definitionId: InstitutionalIdentifier,
  credentials: readonly AcademyCredential[],
): CredentialAnalytics {
  const matching = credentials.filter(
    (credential) => credential.credentialDefinitionId === definitionId,
  );

  return deepFreeze({
    credentialDefinitionId: definitionId,
    issuedCount: matching.length,
    activeCount: matching.filter((item) => item.state === "active").length,
    expiringCount: matching.filter((item) => item.state === "expiring").length,
    expiredCount: matching.filter((item) => item.state === "expired").length,
    suspendedCount: matching.filter((item) => item.state === "suspended").length,
    revokedCount: matching.filter((item) => item.state === "revoked").length,
    supersededCount: matching.filter((item) => item.state === "superseded").length,
    renewalCount: matching.filter((item) => Number(item.version.split(".")[0]) > 1).length,
    authorityCreatedCount: 0,
    assignmentCreatedCount: 0,
  });
}

export const REVIEWER_ORIENTATION_CREDENTIAL_DEFINITION_ID =
  "TA14-ACD-CREDENTIAL-DEF-000001" as const;

export const reviewerOrientationCredentialDefinition: CredentialDefinition =
  deepFreeze({
    credentialDefinitionId: REVIEWER_ORIENTATION_CREDENTIAL_DEFINITION_ID,
    stableSlug: "ai-governance/reviewer-orientation",
    title: "TA-14 Reviewer Orientation Credential",
    summary:
      "Preserves bounded evidence that a participant completed current reviewer-orientation learning and assessment requirements. It does not grant reviewer authority.",
    version: "3.0",
    locale: "en-US",
    publicationState: "active",
    credentialType: "orientation",
    level: "foundational",
    division: "ai-governance-exchange",
    operationalFunctions: [
      "reviewer_orientation",
      "reviewer_credential_eligibility",
    ],
    recordTypes: [
      "academy_credential",
      "academy_assessment",
      "academy_assessment_attempt",
      "authority_grant",
      "assignment",
    ],
    eligibleRoles: [
      "reviewer_candidate",
      "authorized_reviewer",
      "academy_instructor",
      "academy_standards_reviewer",
    ],
    competencies: [
      {
        competencyId: "review.boundary_comprehension",
        title: "Review boundary comprehension",
        description:
          "Understands evidence, finding, determination, credential, authority, and assignment boundaries.",
        requiredLevel: "applied",
        minimumEvidenceCount: 1,
        permittedEligibilityTypes: ["reviewer_orientation_completed"],
        evidenceFreshnessDays: 365,
        requiresHumanReview: false,
        boundaryCritical: true,
      },
      {
        competencyId: "review.conflict_and_scope",
        title: "Conflict and scope control",
        description:
          "Understands conflict declaration, competence limits, assignment scope, and escalation.",
        requiredLevel: "applied",
        minimumEvidenceCount: 1,
        permittedEligibilityTypes: ["reviewer_orientation_completed"],
        evidenceFreshnessDays: 365,
        requiresHumanReview: true,
        boundaryCritical: true,
      },
    ],
    eligibilityPolicy: {
      requiredEligibilityTypes: ["reviewer_orientation_completed"],
      minimumEvidenceCount: 1,
      allCompetenciesRequired: true,
      permitConditionalPassEvidence: false,
      evidenceMustBeActive: true,
      evidenceMustMatchSubject: true,
      evidenceMustMatchAssessmentVersion: false,
      disqualifyingRestrictions: [
        "identity_unverified",
        "integrity_under_review",
        "conflict_unresolved",
      ],
      conflictCheckRequired: true,
      identityVerificationRequired: true,
    },
    issuancePolicy: {
      mode: "authorized_human_review",
      permittedIssuerRoles: [
        "credential_issuer",
        "academy_standards_reviewer",
      ],
      minimumIssuerCount: 1,
      independentIssuerRequired: false,
      issuerConflictCheckRequired: true,
      serverValidationRequired: true,
      serviceRoleCommitRequired: true,
      idempotencyRequired: true,
      issueOnlyCurrentDefinition: true,
      createsAuthority: false,
      createsAssignment: false,
      createsRegistryEffect: false,
      createsArtifactEffect: false,
    },
    validityPolicy: {
      startsOn: "issuance",
      validityDays: 365,
      noExpiration: false,
      expiringWarningDays: [60, 30, 7],
      gracePeriodDays: 0,
      expirationEffect: "credential_and_eligibility_review",
      authorityReviewTriggeredOnExpiry: true,
    },
    renewalPolicy: {
      mode: "reassessment",
      renewalWindowDays: 60,
      renewalAfterExpiryAllowed: true,
      maximumExpiredDaysForRenewal: 90,
      requiredEligibilityTypes: ["reviewer_orientation_completed"],
      requiresCurrentDefinition: true,
      createsNewCredentialVersion: true,
      preservesPriorCredential: true,
    },
    continuingEducationPolicy: {
      required: false,
      acceptedActivityTypes: [],
      evidenceRequired: false,
      reviewRequired: false,
      failureEffect: "none",
    },
    suspensionPolicy: {
      permittedReasons: [
        "integrity_concern",
        "conflict_not_disclosed",
        "material_policy_change",
        "identity_uncertainty",
      ],
      permittedActorRoles: [
        "credential_issuer",
        "academy_standards_reviewer",
        "institutional_administrator",
      ],
      immediateForCriticalRisk: true,
      noticeRequired: true,
      appealAllowed: true,
      preservesHistory: true,
      mayTriggerAuthorityHold: true,
    },
    revocationPolicy: {
      permittedReasons: [
        "fraud",
        "material_misrepresentation",
        "confirmed_integrity_violation",
        "credential_issued_in_error",
      ],
      permittedActorRoles: [
        "credential_issuer",
        "academy_standards_reviewer",
      ],
      panelRequired: true,
      minimumDecisionMakers: 2,
      noticeRequired: true,
      appealAllowed: true,
      preservesHistory: true,
      stopsFutureCredentialReliance: true,
      mayTriggerAuthorityRevocationReview: true,
    },
    supersessionPolicy: {
      supersedeOnDefinitionChange: true,
      supersedeOnMaterialCompetencyChange: true,
      preserveHistoricalMeaning: true,
      createRevalidationAction: true,
      mayRestrictCurrentCredential: true,
    },
    verificationPolicy: {
      publicVerificationAllowed: true,
      verificationRoute: "/academy/credentials/verify",
      includeIntegrityHash: true,
      includeIssuer: true,
      includeCompetencyScope: true,
      includeRestrictions: true,
      includeExpiration: true,
      includeAuthorityDisclaimer: true,
      signedVerificationRequired: true,
    },
    projectionPolicy: {
      visibility: "public",
      publicSafe: true,
      protectedFields: [
        "eligibilityEvidenceIds",
        "privateIssuerNotes",
        "internalReview",
        "appealRecords",
      ],
      publicSummary:
        "A current reviewer-orientation credential. Credential status does not create reviewer authority.",
    },
    revalidationPolicy: {
      triggers: [
        "lesson_version_change",
        "assessment_version_change",
        "review_policy_change",
        "authority_policy_change",
        "standard_change",
        "law_change",
        "conflict_policy_change",
      ],
      severityByTrigger: {
        lesson_version_change: "moderate",
        assessment_version_change: "high",
        review_policy_change: "high",
        authority_policy_change: "critical",
        standard_change: "high",
        law_change: "high",
        conflict_policy_change: "high",
      },
      maySuspendCredential: true,
      mayExpireCredential: true,
      mayRequireReassessment: true,
      mayRequireContinuingEducation: false,
      mayTriggerAuthorityReview: true,
      preserveHistoricalCredential: true,
    },
    authorityBoundary:
      "This credential may support eligibility for a separate authority review. It does not grant reviewer authority, accept an assignment, admit evidence, commit a finding, create a determination, or create Registry effect.",
    nonSubstitutionRule: TA14_ACADEMY_NON_SUBSTITUTION_RULE,
    contentHash:
      "sha256:0000000000000000000000000000000000000000000000000000000000000000",
    effectiveAt: "2026-08-04T00:00:00Z",
    metadata: {
      ownerSubjectId: "TA14-SUBJECT-ACADEMY",
      ownerOrganizationId: "TA14-AUTHORITY",
      createdBy: "TA14-SUBJECT-ACADEMY",
      createdAt: "2026-08-04T00:00:00Z",
      updatedBy: "TA14-SUBJECT-ACADEMY",
      updatedAt: "2026-08-04T00:00:00Z",
      approvedBy: "TA14-SUBJECT-ACADEMY-STANDARDS",
      approvedAt: "2026-08-04T00:00:00Z",
      academyStandardsReviewerId: "TA14-SUBJECT-ACADEMY-STANDARDS",
      technicalOwnerId: "TA14-SUBJECT-TECHNICAL",
    },
  });

export function createDeterministicCredentialDependencies(
  startAt = "2026-08-04T15:00:00.000Z",
): {
  readonly ids: CredentialIdentifierFactory;
  readonly hash: CredentialHashProvider;
  readonly now: () => ISODateTimeString;
} {
  let counter = 0;
  const next = (prefix: string): InstitutionalIdentifier => {
    counter += 1;
    return `${prefix}-${String(counter).padStart(6, "0")}`;
  };

  return {
    ids: {
      createCredentialId: () => next("TA14-ACD-CREDENTIAL"),
      createVerificationId: () => next("TA14-ACD-CRED-VERIFY"),
      createDecisionId: () => next("TA14-ACD-CRED-DECISION"),
      createTransitionId: () => next("TA14-ACD-CRED-TRANSITION"),
    },
    hash: {
      hashCanonicalValue: (value) =>
        `sha256:${deterministicHex(stableStringify(value))}`,
    },
    now: () =>
      new Date(Date.parse(startAt) + counter * 1000).toISOString(),
  };
}

export interface CredentialEngineSelfCheck {
  readonly ok: boolean;
  readonly definitionValid: boolean;
  readonly eligibilityEvaluated: boolean;
  readonly credentialIssued: boolean;
  readonly authorityCreated: false;
  readonly assignmentCreated: false;
  readonly registryEffectCreated: false;
  readonly artifactEffectCreated: false;
  readonly issues: readonly string[];
}

export async function runCredentialEngineSelfCheck(): Promise<CredentialEngineSelfCheck> {
  const issues: string[] = [];
  const definitionValidation = validateCredentialDefinition(
    reviewerOrientationCredentialDefinition,
  );
  if (!definitionValidation.ok) {
    issues.push("Canonical credential definition failed validation.");
  }

  const d = createDeterministicCredentialDependencies();
  const evidence: CredentialEligibilityEvidence = {
    evidenceId: "TA14-ACD-ELIG-TEST-000001",
    assessmentId: "TA14-ACD-ASSESSMENT-000001",
    assessmentVersion: "3.0",
    attemptId: "TA14-ACD-ATTEMPT-TEST-000001",
    subjectId: "TA14-SUBJECT-TEST",
    eligibilityType: "reviewer_orientation_completed",
    credentialType: "TA14-REVIEWER-ORIENTATION",
    competencyIds: [
      "review.boundary_comprehension",
      "review.conflict_and_scope",
    ],
    result: "passed",
    restrictions: [],
    state: "active",
    issuedAt: d.now(),
    expiresAt: new Date(Date.parse(d.now()) + 365 * 86_400_000).toISOString(),
    createsCredential: false,
    createsAuthority: false,
    requiresSeparateCredentialProcess: true,
    requiresSeparateAuthorityProcess: true,
    integrityHash:
      "sha256:0000000000000000000000000000000000000000000000000000000000000000",
  };

  const eligibility = evaluateCredentialEligibility(
    reviewerOrientationCredentialDefinition,
    "TA14-SUBJECT-TEST",
    [evidence],
    d.now(),
  );
  if (!eligibility.eligible) {
    issues.push("Canonical eligibility evaluation did not pass.");
  }

  const request: CredentialIssuanceRequest = {
    requestId: "TA14-ACD-CRED-REQ-TEST-000001",
    credentialDefinitionId: REVIEWER_ORIENTATION_CREDENTIAL_DEFINITION_ID,
    subjectId: "TA14-SUBJECT-TEST",
    organizationId: "TA14-ORG-TEST",
    eligibilityEvidenceIds: [evidence.evidenceId],
    requestedBy: "TA14-SUBJECT-TEST",
    requestedAt: d.now(),
    correlationId: "TA14-CORR-CREDENTIAL-TEST",
    idempotencyKey: "credential-test-1",
    requestedRestrictions: [],
    state: "approved",
  };

  const decision: CredentialIssuanceDecision = {
    decisionId: d.ids.createDecisionId(),
    requestId: request.requestId,
    decision: "approve",
    decidedBy: ["TA14-SUBJECT-CREDENTIAL-ISSUER"],
    decidedAt: d.now(),
    authorityBasis: "academy.credential_issuance_policy",
    rationale: "Eligibility requirements satisfied.",
    restrictions: [],
    limitations: [TA14_ACADEMY_CREDENTIAL_BOUNDARY],
    createsAuthority: false,
  };

  const credential = await issueAcademyCredential({
    definition: reviewerOrientationCredentialDefinition,
    request,
    decision,
    eligibility,
    ids: d.ids,
    hash: d.hash,
    now: d.now(),
  });

  const validation = validateAcademyCredential(credential);
  if (!validation.ok) {
    issues.push("Issued credential failed validation.");
  }

  return {
    ok: issues.length === 0,
    definitionValid: definitionValidation.ok,
    eligibilityEvaluated: eligibility.eligible,
    credentialIssued: validation.ok,
    authorityCreated: false,
    assignmentCreated: false,
    registryEffectCreated: false,
    artifactEffectCreated: false,
    issues,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf<T extends readonly string[]>(
  value: unknown,
  allowed: T,
): value is T[number] {
  return typeof value === "string" && allowed.includes(value as T[number]);
}

function isVersion(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d+\.\d+(?:\.\d+)?(?:[-+][0-9A-Za-z.-]+)?$/.test(value)
  );
}

function isDateTime(value: unknown): value is ISODateTimeString {
  return (
    typeof value === "string" &&
    value.includes("T") &&
    Number.isFinite(Date.parse(value))
  );
}

function isContentHash(value: unknown): value is ContentHash {
  return (
    typeof value === "string" &&
    /^sha256:[a-fA-F0-9]{64}$/.test(value)
  );
}

function requiredString(
  value: unknown,
  path: string,
  issues: CredentialValidationIssue[],
): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    addIssue(issues, path, "required", `${path} must be a non-empty string.`, value);
  }
}

function stringArray(
  value: unknown,
  path: string,
  issues: CredentialValidationIssue[],
  nonEmpty = false,
): void {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    addIssue(issues, path, "invalid_type", `${path} must be string[].`, value);
    return;
  }
  if (nonEmpty && value.length === 0) {
    addIssue(issues, path, "required", `${path} must not be empty.`, value);
  }
}

function enumArray<T>(
  value: unknown,
  path: string,
  guard: (value: unknown) => value is T,
  issues: CredentialValidationIssue[],
): void {
  if (!Array.isArray(value) || value.length === 0 || !value.every(guard)) {
    addIssue(issues, path, "invalid_type", `${path} contains unsupported values.`, value);
  }
}

function addIssue(
  issues: CredentialValidationIssue[],
  path: string,
  code: CredentialValidationCode,
  message: string,
  received?: unknown,
): void {
  issues.push({
    path,
    code,
    message,
    severity: "error",
    received,
  });
}

function incrementVersion(version: string): string {
  const [majorText, minorText = "0"] = version.split(".");
  const major = Number(majorText);
  const minor = Number(minorText);
  if (!Number.isFinite(major) || !Number.isFinite(minor)) {
    return "1.1";
  }
  return `${major}.${minor + 1}`;
}

function stableStringify(value: JsonValue): string {
  return JSON.stringify(sortJson(value));
}

function sortJson(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(sortJson);
  if (isObject(value)) {
    const result: Record<string, JsonValue> = {};
    for (const key of Object.keys(value).sort()) {
      result[key] = sortJson(value[key] as JsonValue);
    }
    return result;
  }
  return value;
}

function deterministicHex(value: string): string {
  let a = 0x9e3779b9;
  let b = 0x85ebca6b;
  let c = 0xc2b2ae35;
  let d = 0x27d4eb2f;

  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    a = Math.imul(a ^ code, 0x85ebca6b);
    b = Math.imul(b + code, 0xc2b2ae35);
    c = Math.imul(c ^ (code << (index % 8)), 0x27d4eb2f);
    d = Math.imul(d + (code ^ index), 0x165667b1);
  }

  return [a, b, c, d, a ^ c, b ^ d, a ^ b, c ^ d]
    .map((part) => (part >>> 0).toString(16).padStart(8, "0"))
    .join("")
    .slice(0, 64);
}

const credentialContracts = {
  engineId: TA14_ACADEMY_CREDENTIAL_ENGINE_ID,
  engineVersion: TA14_ACADEMY_CREDENTIAL_ENGINE_VERSION,
  boundary: TA14_ACADEMY_CREDENTIAL_BOUNDARY,
  publicationStates: CREDENTIAL_PUBLICATION_STATES,
  credentialTypes: CREDENTIAL_TYPES,
  credentialLevels: CREDENTIAL_LEVELS,
  issuanceModes: CREDENTIAL_ISSUANCE_MODES,
  renewalModes: CREDENTIAL_RENEWAL_MODES,
  validateCredentialDefinition,
  validateAcademyCredential,
  evaluateCredentialEligibility,
  issueAcademyCredential,
  transitionAcademyCredential,
  projectCredentialVerification,
  buildCredentialAnalytics,
  AcademyCredentialService,
  InMemoryCredentialDefinitionRepository,
  InMemoryAcademyCredentialRepository,
  InMemoryCredentialIssuanceRequestRepository,
  reviewerOrientationCredentialDefinition,
  createDeterministicCredentialDependencies,
  runCredentialEngineSelfCheck,
};

export default credentialContracts;
