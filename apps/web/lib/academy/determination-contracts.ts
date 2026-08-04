/**
 * TA-14 Authority Governance Institution
 * ACD-011 — Determination Contracts
 *
 * Create:
 *   apps/web/lib/academy/determination-contracts.ts
 *
 * Chain:
 *   Finding -> Determination -> Registry Review -> Registry Publication
 *   -> Execution Artifact -> Execution
 *
 * Boundaries:
 *   Determination != Registry Review
 *   Determination != Registry Publication
 *   Determination != Execution Artifact
 *   Determination != Execution
 */

import type {
  ContentHash,
  CorrelationIdentifier,
  InstitutionalIdentifier,
  InstitutionalRecordType,
  InstitutionalRole,
  ISODateTimeString,
  JsonValue,
} from "./lesson-contracts";

import {
  TA14_ACADEMY_NON_SUBSTITUTION_RULE,
  deepFreeze,
  isInstitutionalRecordType,
  isInstitutionalRole,
} from "./lesson-contracts";

import type { AcademyEventService } from "./academy-events";

import type {
  FindingConcurrence,
  FindingConfidenceLevel,
  FindingEvidenceMapping,
  FindingType,
  InstitutionalFinding,
} from "./finding-contracts";

export const TA14_DETERMINATION_ENGINE_VERSION = "3.0" as const;

export const TA14_DETERMINATION_ENGINE_ID =
  "TA14-ACD-DETERMINATION-ENGINE-000001" as const;

export const TA14_DETERMINATION_BOUNDARY =
  "A determination commits an attributable institutional decision within a bounded authority, scope, evidence, finding, version, and continuity context. It does not itself create Registry review, Registry publication, an execution artifact, or execution." as const;

export const DETERMINATION_STATES = [
  "draft",
  "under_review",
  "returned_for_correction",
  "held",
  "escalated",
  "committed",
  "amended",
  "superseded",
  "withdrawn",
  "invalidated",
  "expired",
] as const;

export type DeterminationState =
  (typeof DETERMINATION_STATES)[number];

export const DETERMINATION_TYPES = [
  "ALLOW",
  "HOLD",
  "DENY",
  "ESCALATE",
] as const;

export type DeterminationType =
  (typeof DETERMINATION_TYPES)[number];

export const DETERMINATION_REVIEW_POSITIONS = [
  "approve",
  "approve_with_conditions",
  "deny",
  "hold",
  "escalate",
  "abstain",
  "recuse",
] as const;

export type DeterminationReviewPosition =
  (typeof DETERMINATION_REVIEW_POSITIONS)[number];

export type DeterminationAuthorityState =
  | "not_checked"
  | "current"
  | "constrained"
  | "held"
  | "expired"
  | "revoked"
  | "insufficient";

export type DeterminationScopeState =
  | "not_checked"
  | "within_scope"
  | "within_scope_with_constraints"
  | "partially_outside_scope"
  | "outside_scope"
  | "conflicting_scope";

export type DeterminationEvidenceState =
  | "not_checked"
  | "sufficient"
  | "conditionally_sufficient"
  | "insufficient"
  | "conflicting"
  | "stale"
  | "unattributed"
  | "not_permitted";

export type DeterminationFindingState =
  | "not_checked"
  | "accepted"
  | "accepted_with_limitations"
  | "conflicting"
  | "insufficient"
  | "superseded"
  | "withdrawn"
  | "invalidated";

export type DeterminationSignatureType =
  | "reviewer"
  | "approver"
  | "authority_holder"
  | "panel_member"
  | "institutional_commit"
  | "technical_seal";

export interface DeterminationDefinition {
  readonly determinationDefinitionId: InstitutionalIdentifier;
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly active: boolean;
  readonly supportedFindingTypes: readonly FindingType[];
  readonly permittedDeterminationTypes: readonly DeterminationType[];
  readonly allowedRoles: readonly InstitutionalRole[];
  readonly allowedRecordTypes: readonly InstitutionalRecordType[];
  readonly findingPolicy: DeterminationFindingPolicy;
  readonly evidencePolicy: DeterminationEvidencePolicy;
  readonly authorityPolicy: DeterminationAuthorityPolicy;
  readonly scopePolicy: DeterminationScopePolicy;
  readonly reviewPolicy: DeterminationReviewPolicy;
  readonly signaturePolicy: DeterminationSignaturePolicy;
  readonly commitPolicy: DeterminationCommitPolicy;
  readonly amendmentPolicy: DeterminationAmendmentPolicy;
  readonly continuityPolicy: DeterminationContinuityPolicy;
  readonly projectionPolicy: DeterminationProjectionPolicy;
  readonly retentionPolicy: DeterminationRetentionPolicy;
  readonly determinationBoundary: string;
  readonly nonSubstitutionRule:
    typeof TA14_ACADEMY_NON_SUBSTITUTION_RULE;
  readonly contentHash: ContentHash;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
}

export interface DeterminationFindingPolicy {
  readonly minimumFindingCount: number;
  readonly requireAcceptedFinding: boolean;
  readonly allowConditionallySupportedFinding: boolean;
  readonly allowPartiallySupportedFinding: boolean;
  readonly allowConflictingFinding: boolean;
  readonly allowInconclusiveFindingForEscalation: boolean;
  readonly allowUnsupportedFindingForDeny: boolean;
  readonly requireFindingConcurrence: boolean;
  readonly requireCurrentFindingVersion: boolean;
  readonly prohibitWithdrawnFinding: boolean;
  readonly prohibitInvalidatedFinding: boolean;
  readonly preserveFindingLimitations: true;
}

export interface DeterminationEvidencePolicy {
  readonly requireEvidenceMapping: boolean;
  readonly requireAttribution: boolean;
  readonly requirePermission: boolean;
  readonly requireCurrentVersion: boolean;
  readonly requireIntegrityVerification: boolean;
  readonly requireProvenanceVerification: boolean;
  readonly requireRelevance: boolean;
  readonly requireNoUnresolvedCriticalEvidence: boolean;
  readonly allowConflictingEvidenceForEscalation: boolean;
  readonly allowStaleEvidenceForHold: boolean;
  readonly preserveExcludedEvidenceReferences: boolean;
}

export interface DeterminationAuthorityPolicy {
  readonly requireCurrentAuthority: boolean;
  readonly requireAuthorityForDeterminationType: boolean;
  readonly requireOrganizationMatch: boolean;
  readonly requireJurisdictionMatch: boolean;
  readonly requireRoleMatch: boolean;
  readonly requireAssignmentMatch: boolean;
  readonly requireActionPermission: boolean;
  readonly requireDecisionPermission: boolean;
  readonly allowConstrainedAuthority: boolean;
  readonly heldAuthorityDecision: "HOLD" | "DENY" | "ESCALATE";
  readonly expiredAuthorityDecision: "HOLD" | "DENY" | "ESCALATE";
  readonly revokedAuthorityDecision: "DENY" | "ESCALATE";
}

export interface DeterminationScopePolicy {
  readonly requireRecordMatch: boolean;
  readonly requireRecordTypeMatch: boolean;
  readonly requireVersionMatch: boolean;
  readonly requireActionMatch: boolean;
  readonly requireDecisionTypeMatch: boolean;
  readonly requireOrganizationMatch: boolean;
  readonly requireJurisdictionMatch: boolean;
  readonly allowConstrainedScope: boolean;
  readonly partialScopeDecision: "HOLD" | "DENY" | "ESCALATE";
  readonly outsideScopeDecision: "DENY" | "ESCALATE";
}

export interface DeterminationReviewPolicy {
  readonly reviewRequired: boolean;
  readonly minimumReviewerCount: number;
  readonly minimumApproverCount: number;
  readonly dualReviewRequired: boolean;
  readonly panelRequired: boolean;
  readonly independentReviewerRequired: boolean;
  readonly conflictCheckRequired: boolean;
  readonly authorityCheckRequired: boolean;
  readonly assignmentCheckRequired: boolean;
  readonly competenceCheckRequired: boolean;
  readonly unanimityRequired: boolean;
  readonly dissentAllowed: boolean;
  readonly abstentionAllowed: boolean;
  readonly recusalAllowed: boolean;
  readonly disputedDecision: "HOLD" | "ESCALATE";
}

export interface DeterminationSignaturePolicy {
  readonly signaturesRequired: boolean;
  readonly requiredSignatureTypes:
    readonly DeterminationSignatureType[];
  readonly minimumSignatureCount: number;
  readonly requireIntegrityHash: boolean;
  readonly requireSigningAuthority: boolean;
  readonly requireSignedContentHash: boolean;
  readonly requireTimestamp: boolean;
  readonly allowDetachedSignature: boolean;
  readonly preserveRevokedSignature: true;
}

export interface DeterminationCommitPolicy {
  readonly commitRequired: boolean;
  readonly commitAfterReviewOnly: boolean;
  readonly commitAfterSignaturesOnly: boolean;
  readonly commitAfterAuthorityVerificationOnly: boolean;
  readonly commitAfterScopeVerificationOnly: boolean;
  readonly commitAfterFindingVerificationOnly: boolean;
  readonly commitAfterEvidenceVerificationOnly: boolean;
  readonly commitAfterContinuityCheckOnly: boolean;
  readonly commitCreatesRegistryReview: false;
  readonly commitCreatesRegistryPublication: false;
  readonly commitCreatesExecutionArtifact: false;
  readonly commitCreatesExecution: false;
}

export interface DeterminationAmendmentPolicy {
  readonly amendmentAllowed: boolean;
  readonly materialAmendmentCreatesNewVersion: boolean;
  readonly clericalCorrectionCreatesNewVersion: boolean;
  readonly preservePriorVersion: true;
  readonly requireReason: boolean;
  readonly requireReviewerApproval: boolean;
  readonly requireNewSignaturesForMaterialChange: boolean;
  readonly supersessionAllowed: boolean;
  readonly withdrawalAllowed: boolean;
  readonly invalidationAllowed: boolean;
}

export interface DeterminationContinuityPolicy {
  readonly materialChangeTriggers: readonly string[];
  readonly findingChangeRequiresReview: boolean;
  readonly evidenceChangeRequiresReview: boolean;
  readonly authorityChangeRequiresReview: boolean;
  readonly assignmentChangeRequiresReview: boolean;
  readonly scopeChangeRequiresReview: boolean;
  readonly lawChangeRequiresReview: boolean;
  readonly standardChangeRequiresReview: boolean;
  readonly outcomeChangeRequiresReview: boolean;
  readonly criticalChangeHoldsDetermination: boolean;
  readonly preserveHistoricalDetermination: true;
}

export interface DeterminationProjectionPolicy {
  readonly publicProjectionAllowed: boolean;
  readonly authenticatedProjectionAllowed: boolean;
  readonly controlledProjectionAllowed: boolean;
  readonly confidentialProjectionAllowed: boolean;
  readonly protectedFields: readonly string[];
  readonly publicFields: readonly string[];
  readonly redactSubjectIdentityPublicly: boolean;
  readonly redactFindingIdentifiersPublicly: boolean;
  readonly redactEvidenceIdentifiersPublicly: boolean;
  readonly exposeConditionsPublicly: boolean;
  readonly exposeLimitationsPublicly: boolean;
  readonly exposeDissentPublicly: boolean;
  readonly exposeAuthoritySummaryPublicly: boolean;
}

export interface DeterminationRetentionPolicy {
  readonly retainDeterminationDays?: number;
  readonly retainReviewDays?: number;
  readonly retainSignatureDays?: number;
  readonly retainAmendmentDays?: number;
  readonly preserveCommittedDetermination: true;
  readonly preserveSupersededDetermination: true;
  readonly preserveWithdrawnDetermination: true;
  readonly preserveInvalidatedDetermination: true;
}

export interface DeterminationAuthorityVerification {
  readonly authorityVerificationId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly authorityGrantIds: readonly InstitutionalIdentifier[];
  readonly state: DeterminationAuthorityState;
  readonly roleMatched: boolean;
  readonly organizationMatched: boolean;
  readonly jurisdictionMatched: boolean;
  readonly assignmentMatched: boolean;
  readonly actionPermitted: boolean;
  readonly decisionPermitted: boolean;
  readonly current: boolean;
  readonly constraints: readonly string[];
  readonly limitations: readonly string[];
  readonly verifiedAt: ISODateTimeString;
  readonly verifiedBy: "service" | InstitutionalIdentifier;
}

export interface DeterminationScopeVerification {
  readonly scopeVerificationId: InstitutionalIdentifier;
  readonly state: DeterminationScopeState;
  readonly targetRecordMatched: boolean;
  readonly targetRecordTypeMatched: boolean;
  readonly targetRecordVersionMatched: boolean;
  readonly actionMatched: boolean;
  readonly determinationTypeMatched: boolean;
  readonly organizationMatched: boolean;
  readonly jurisdictionMatched: boolean;
  readonly approvedElements: readonly JsonValue[];
  readonly rejectedElements: readonly JsonValue[];
  readonly constraints: readonly string[];
  readonly limitations: readonly string[];
  readonly verifiedAt: ISODateTimeString;
  readonly verifiedBy: "service" | InstitutionalIdentifier;
}

export interface DeterminationEvidenceVerification {
  readonly evidenceVerificationId: InstitutionalIdentifier;
  readonly state: DeterminationEvidenceState;
  readonly evidenceMappings: readonly FindingEvidenceMapping[];
  readonly attributableCount: number;
  readonly permittedCount: number;
  readonly currentCount: number;
  readonly integrityVerifiedCount: number;
  readonly provenanceVerifiedCount: number;
  readonly relevantCount: number;
  readonly conflictingCount: number;
  readonly unresolvedCount: number;
  readonly rejectedCount: number;
  readonly limitations: readonly string[];
  readonly verifiedAt: ISODateTimeString;
  readonly verifiedBy: "service" | InstitutionalIdentifier;
}

export interface DeterminationFindingVerification {
  readonly findingVerificationId: InstitutionalIdentifier;
  readonly state: DeterminationFindingState;
  readonly findingIds: readonly InstitutionalIdentifier[];
  readonly findingVersions: readonly string[];
  readonly findingTypes: readonly FindingType[];
  readonly confidenceLevels: readonly FindingConfidenceLevel[];
  readonly concurrenceStates:
    readonly FindingConcurrence["state"][];
  readonly acceptedFindingCount: number;
  readonly conflictingFindingCount: number;
  readonly invalidFindingCount: number;
  readonly limitations: readonly string[];
  readonly verifiedAt: ISODateTimeString;
  readonly verifiedBy: "service" | InstitutionalIdentifier;
}

export interface DeterminationContinuityVerification {
  readonly continuityVerificationId: InstitutionalIdentifier;
  readonly findingVersionsCurrent: boolean;
  readonly evidenceVersionsCurrent: boolean;
  readonly authorityCurrent: boolean;
  readonly assignmentCurrent: boolean;
  readonly scopeCurrent: boolean;
  readonly lawCurrent: boolean;
  readonly standardsCurrent: boolean;
  readonly materialChangeOpen: boolean;
  readonly state:
    | "current"
    | "conditionally_current"
    | "revalidation_required"
    | "held"
    | "invalid";
  readonly limitations: readonly string[];
  readonly verifiedAt: ISODateTimeString;
  readonly verifiedBy: "service" | InstitutionalIdentifier;
}

export interface DeterminationReviewerPosition {
  readonly reviewerPositionId: InstitutionalIdentifier;
  readonly determinationId?: InstitutionalIdentifier;
  readonly reviewerSubjectId: InstitutionalIdentifier;
  readonly reviewerRole: InstitutionalRole;
  readonly position: DeterminationReviewPosition;
  readonly rationale: string;
  readonly conditions: readonly string[];
  readonly limitations: readonly string[];
  readonly conflictChecked: boolean;
  readonly authorityChecked: boolean;
  readonly assignmentChecked: boolean;
  readonly competenceChecked: boolean;
  readonly independent: boolean;
  readonly recordedAt: ISODateTimeString;
  readonly integrityHash: ContentHash;
}

export interface DeterminationConcurrence {
  readonly concurrenceId: InstitutionalIdentifier;
  readonly state:
    | "not_evaluated"
    | "unanimous"
    | "majority"
    | "qualified"
    | "disputed"
    | "insufficient_reviewers"
    | "insufficient_approvers";
  readonly approvingReviewerIds:
    readonly InstitutionalIdentifier[];
  readonly conditionalApproverIds:
    readonly InstitutionalIdentifier[];
  readonly denyingReviewerIds:
    readonly InstitutionalIdentifier[];
  readonly holdingReviewerIds:
    readonly InstitutionalIdentifier[];
  readonly escalatingReviewerIds:
    readonly InstitutionalIdentifier[];
  readonly abstainingReviewerIds:
    readonly InstitutionalIdentifier[];
  readonly recusedReviewerIds:
    readonly InstitutionalIdentifier[];
  readonly minimumReviewerCountSatisfied: boolean;
  readonly minimumApproverCountSatisfied: boolean;
  readonly independenceSatisfied: boolean;
  readonly unanimitySatisfied: boolean;
  readonly evaluatedAt: ISODateTimeString;
}

export interface DeterminationSignature {
  readonly signatureId: InstitutionalIdentifier;
  readonly determinationId?: InstitutionalIdentifier;
  readonly signatureType: DeterminationSignatureType;
  readonly signerSubjectId: InstitutionalIdentifier;
  readonly signerRole: InstitutionalRole;
  readonly authorityGrantIds: readonly InstitutionalIdentifier[];
  readonly signedContentHash: ContentHash;
  readonly signatureValue: string;
  readonly signatureAlgorithm:
    | "sha256-attestation"
    | "hmac-sha256"
    | "ed25519"
    | "rsa-pss-sha256"
    | "external";
  readonly detached: boolean;
  readonly signedAt: ISODateTimeString;
  readonly revokedAt?: ISODateTimeString;
  readonly revocationReason?: string;
  readonly valid: boolean;
  readonly limitations: readonly string[];
}

export interface DeterminationCommitAuthorization {
  readonly commitAuthorizationId: InstitutionalIdentifier;
  readonly determinationId?: InstitutionalIdentifier;
  readonly authorized: boolean;
  readonly authorityVerified: boolean;
  readonly scopeVerified: boolean;
  readonly findingVerified: boolean;
  readonly evidenceVerified: boolean;
  readonly continuityVerified: boolean;
  readonly concurrenceSatisfied: boolean;
  readonly signaturesSatisfied: boolean;
  readonly blockingReasons: readonly string[];
  readonly limitations: readonly string[];
  readonly authorizedAt?: ISODateTimeString;
  readonly authorizedBy: "service" | InstitutionalIdentifier;
}

export interface DeterminationCondition {
  readonly conditionId: InstitutionalIdentifier;
  readonly type:
    | "precondition"
    | "postcondition"
    | "time"
    | "scope"
    | "authority"
    | "evidence"
    | "continuity"
    | "supervision"
    | "revalidation"
    | "other";
  readonly title: string;
  readonly description: string;
  readonly blocking: boolean;
  readonly satisfied: boolean;
  readonly satisfactionEvidenceIds:
    readonly InstitutionalIdentifier[];
  readonly dueAt?: ISODateTimeString;
  readonly limitations: readonly string[];
}

export interface DeterminationLimitation {
  readonly limitationId: InstitutionalIdentifier;
  readonly type:
    | "scope"
    | "evidence"
    | "finding"
    | "authority"
    | "assignment"
    | "version"
    | "time"
    | "jurisdiction"
    | "confidentiality"
    | "method"
    | "continuity"
    | "other";
  readonly description: string;
  readonly material: boolean;
  readonly affectsDecision: boolean;
  readonly requiresDisclosure: boolean;
  readonly sourceFindingId?: InstitutionalIdentifier;
  readonly createdAt: ISODateTimeString;
}

export interface DeterminationAssumption {
  readonly assumptionId: InstitutionalIdentifier;
  readonly statement: string;
  readonly material: boolean;
  readonly verified: boolean;
  readonly verificationEvidenceIds:
    readonly InstitutionalIdentifier[];
  readonly consequencesIfFalse: readonly string[];
  readonly sourceFindingIds:
    readonly InstitutionalIdentifier[];
}

export interface DeterminationDependency {
  readonly dependencyId: InstitutionalIdentifier;
  readonly type:
    | "finding"
    | "record"
    | "evidence"
    | "authority"
    | "assignment"
    | "credential"
    | "law"
    | "standard"
    | "policy"
    | "technical_control"
    | "continuity"
    | "other";
  readonly referenceId: string;
  readonly referenceVersion?: string;
  readonly required: boolean;
  readonly current: boolean;
  readonly limitations: readonly string[];
}

export interface DeterminationReference {
  readonly referenceId: InstitutionalIdentifier;
  readonly type:
    | "law"
    | "regulation"
    | "standard"
    | "framework"
    | "policy"
    | "guidance"
    | "contract"
    | "other";
  readonly title: string;
  readonly citation: string;
  readonly jurisdiction?: string;
  readonly version?: string;
  readonly effectiveAt?: ISODateTimeString;
  readonly current: boolean;
  readonly relationship:
    | "authorizes"
    | "requires"
    | "constrains"
    | "informs"
    | "prohibits"
    | "contextualizes";
  readonly limitations: readonly string[];
}

export interface InstitutionalDetermination {
  readonly determinationId: InstitutionalIdentifier;
  readonly determinationDefinitionId: InstitutionalIdentifier;
  readonly targetRecordId: InstitutionalIdentifier;
  readonly targetRecordType: InstitutionalRecordType;
  readonly targetRecordVersion: string;
  readonly findingIds: readonly InstitutionalIdentifier[];
  readonly findingVersions: readonly string[];
  readonly workspaceIds: readonly InstitutionalIdentifier[];
  readonly assignmentIds: readonly InstitutionalIdentifier[];
  readonly determinationType: DeterminationType;
  readonly state: DeterminationState;
  readonly title: string;
  readonly statement: string;
  readonly rationale: string;
  readonly conditions: readonly DeterminationCondition[];
  readonly limitations: readonly DeterminationLimitation[];
  readonly assumptions: readonly DeterminationAssumption[];
  readonly dependencies: readonly DeterminationDependency[];
  readonly legalReferences: readonly DeterminationReference[];
  readonly standardsReferences: readonly DeterminationReference[];
  readonly authorityVerification: DeterminationAuthorityVerification;
  readonly scopeVerification: DeterminationScopeVerification;
  readonly findingVerification: DeterminationFindingVerification;
  readonly evidenceVerification: DeterminationEvidenceVerification;
  readonly continuityVerification: DeterminationContinuityVerification;
  readonly reviewerPositions:
    readonly DeterminationReviewerPosition[];
  readonly concurrence: DeterminationConcurrence;
  readonly signatures: readonly DeterminationSignature[];
  readonly commitAuthorization: DeterminationCommitAuthorization;
  readonly createdBySubjectId: InstitutionalIdentifier;
  readonly createdAt: ISODateTimeString;
  readonly reviewedAt?: ISODateTimeString;
  readonly committedAt?: ISODateTimeString;
  readonly amendedAt?: ISODateTimeString;
  readonly supersededAt?: ISODateTimeString;
  readonly withdrawnAt?: ISODateTimeString;
  readonly invalidatedAt?: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly version: string;
  readonly priorDeterminationId?: InstitutionalIdentifier;
  readonly priorVersion?: string;
  readonly supersededByDeterminationId?: InstitutionalIdentifier;
  readonly determinationCreatedRegistryReview: false;
  readonly determinationCreatedRegistryPublication: false;
  readonly determinationCreatedExecutionArtifact: false;
  readonly determinationCreatedExecution: false;
  readonly correlationId: CorrelationIdentifier;
  readonly integrityHash: ContentHash;
  readonly commitHash?: ContentHash;
}

export type DeterminationValidationCode =
  | "required"
  | "invalid_type"
  | "invalid_value"
  | "invalid_state"
  | "invalid_hash"
  | "invalid_date"
  | "invalid_role"
  | "invalid_record_type"
  | "finding_not_accepted"
  | "finding_invalid"
  | "finding_count_insufficient"
  | "evidence_insufficient"
  | "authority_not_current"
  | "scope_not_verified"
  | "continuity_not_current"
  | "reviewer_count_insufficient"
  | "approver_count_insufficient"
  | "signature_count_insufficient"
  | "commit_not_authorized"
  | "determination_created_registry_review"
  | "determination_created_registry_publication"
  | "determination_created_execution_artifact"
  | "determination_created_execution";

export interface DeterminationValidationIssue {
  readonly path: string;
  readonly code: DeterminationValidationCode;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly received?: unknown;
  readonly expected?: string;
}

export interface DeterminationValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly issues: readonly DeterminationValidationIssue[];
}

export class DeterminationContractValidationError extends Error {
  readonly issues: readonly DeterminationValidationIssue[];

  constructor(
    message: string,
    issues: readonly DeterminationValidationIssue[],
  ) {
    super(message);
    this.name = "DeterminationContractValidationError";
    this.issues = issues;
  }
}

export function validateDeterminationDefinition(
  input: unknown,
): DeterminationValidationResult<DeterminationDefinition> {
  const issues: DeterminationValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Determination definition must be an object.",
      input,
    );
  }

  requiredString(
    input.determinationDefinitionId,
    "$.determinationDefinitionId",
    issues,
  );
  requiredString(input.title, "$.title", issues);
  requiredString(input.description, "$.description", issues);
  requiredString(input.version, "$.version", issues);
  requiredString(
    input.determinationBoundary,
    "$.determinationBoundary",
    issues,
  );

  enumArray(
    input.allowedRoles,
    "$.allowedRoles",
    isInstitutionalRole,
    issues,
  );

  enumArray(
    input.allowedRecordTypes,
    "$.allowedRecordTypes",
    isInstitutionalRecordType,
    issues,
  );

  if (
    input.nonSubstitutionRule !==
    TA14_ACADEMY_NON_SUBSTITUTION_RULE
  ) {
    pushIssue(
      issues,
      "$.nonSubstitutionRule",
      "invalid_value",
      "Canonical non-substitution rule is required.",
      input.nonSubstitutionRule,
    );
  }

  if (!isContentHash(input.contentHash)) {
    pushIssue(
      issues,
      "$.contentHash",
      "invalid_hash",
      "Invalid determination definition content hash.",
      input.contentHash,
    );
  }

  if (!isDateTime(input.effectiveAt)) {
    pushIssue(
      issues,
      "$.effectiveAt",
      "invalid_date",
      "effectiveAt must be an ISO date-time.",
      input.effectiveAt,
    );
  }

  return completeValidation(
    input as unknown as DeterminationDefinition,
    issues,
  );
}

export function validateInstitutionalDetermination(
  input: unknown,
): DeterminationValidationResult<InstitutionalDetermination> {
  const issues: DeterminationValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Institutional determination must be an object.",
      input,
    );
  }

  requiredString(input.determinationId, "$.determinationId", issues);
  requiredString(
    input.determinationDefinitionId,
    "$.determinationDefinitionId",
    issues,
  );
  requiredString(input.targetRecordId, "$.targetRecordId", issues);
  requiredString(
    input.targetRecordVersion,
    "$.targetRecordVersion",
    issues,
  );
  requiredString(input.title, "$.title", issues);
  requiredString(input.statement, "$.statement", issues);
  requiredString(input.rationale, "$.rationale", issues);
  requiredString(input.version, "$.version", issues);
  requiredString(input.correlationId, "$.correlationId", issues);

  if (!isOneOf(input.determinationType, DETERMINATION_TYPES)) {
    pushIssue(
      issues,
      "$.determinationType",
      "invalid_value",
      "Unsupported determination type.",
      input.determinationType,
    );
  }

  if (!isOneOf(input.state, DETERMINATION_STATES)) {
    pushIssue(
      issues,
      "$.state",
      "invalid_state",
      "Unsupported determination state.",
      input.state,
    );
  }

  if (!isInstitutionalRecordType(input.targetRecordType)) {
    pushIssue(
      issues,
      "$.targetRecordType",
      "invalid_record_type",
      "Unsupported target record type.",
      input.targetRecordType,
    );
  }

  const hardFalseFields = [
    "determinationCreatedRegistryReview",
    "determinationCreatedRegistryPublication",
    "determinationCreatedExecutionArtifact",
    "determinationCreatedExecution",
  ] as const;

  for (const field of hardFalseFields) {
    if (input[field] !== false) {
      const code: DeterminationValidationCode =
        field === "determinationCreatedRegistryReview"
          ? "determination_created_registry_review"
          : field === "determinationCreatedRegistryPublication"
            ? "determination_created_registry_publication"
            : field === "determinationCreatedExecutionArtifact"
              ? "determination_created_execution_artifact"
              : "determination_created_execution";

      pushIssue(
        issues,
        `$.${field}`,
        code,
        `${field} must be false.`,
        input[field],
      );
    }
  }

  if (!isContentHash(input.integrityHash)) {
    pushIssue(
      issues,
      "$.integrityHash",
      "invalid_hash",
      "Invalid determination integrity hash.",
      input.integrityHash,
    );
  }

  return completeValidation(
    input as unknown as InstitutionalDetermination,
    issues,
  );
}

export function verifyDeterminationFindings(input: {
  readonly findingVerificationId: InstitutionalIdentifier;
  readonly findings: readonly InstitutionalFinding[];
  readonly policy: DeterminationFindingPolicy;
  readonly verifiedAt: ISODateTimeString;
  readonly verifiedBy: "service" | InstitutionalIdentifier;
}): DeterminationFindingVerification {
  const accepted = input.findings.filter(
    (finding) =>
      finding.state === "accepted" ||
      finding.state === "amended",
  );

  const conflicting = input.findings.filter(
    (finding) => finding.findingType === "conflicting",
  );

  const invalid = input.findings.filter(
    (finding) =>
      finding.state === "invalidated" ||
      finding.state === "withdrawn" ||
      finding.state === "superseded",
  );

  const limitations: string[] = [];

  if (input.findings.length < input.policy.minimumFindingCount) {
    limitations.push("Minimum finding count is not satisfied.");
  }

  if (input.policy.requireAcceptedFinding && accepted.length === 0) {
    limitations.push("No accepted finding is available.");
  }

  if (invalid.length > 0) {
    limitations.push(
      "One or more findings are invalid, withdrawn, or superseded.",
    );
  }

  let state: DeterminationFindingState;

  if (invalid.some((finding) => finding.state === "invalidated")) {
    state = "invalidated";
  } else if (invalid.some((finding) => finding.state === "withdrawn")) {
    state = "withdrawn";
  } else if (invalid.some((finding) => finding.state === "superseded")) {
    state = "superseded";
  } else if (accepted.length === 0) {
    state = "insufficient";
  } else if (conflicting.length > 0) {
    state = "conflicting";
  } else if (
    accepted.some((finding) =>
      finding.limitations.some((limitation) => limitation.material),
    )
  ) {
    state = "accepted_with_limitations";
  } else {
    state = "accepted";
  }

  return deepFreeze({
    findingVerificationId: input.findingVerificationId,
    state,
    findingIds: input.findings.map((finding) => finding.findingId),
    findingVersions: input.findings.map((finding) => finding.version),
    findingTypes: input.findings.map((finding) => finding.findingType),
    confidenceLevels: input.findings.map(
      (finding) => finding.confidence.level,
    ),
    concurrenceStates: input.findings.map(
      (finding) => finding.concurrence.state,
    ),
    acceptedFindingCount: accepted.length,
    conflictingFindingCount: conflicting.length,
    invalidFindingCount: invalid.length,
    limitations,
    verifiedAt: input.verifiedAt,
    verifiedBy: input.verifiedBy,
  });
}

export function verifyDeterminationEvidence(input: {
  readonly evidenceVerificationId: InstitutionalIdentifier;
  readonly findings: readonly InstitutionalFinding[];
  readonly policy: DeterminationEvidencePolicy;
  readonly verifiedAt: ISODateTimeString;
  readonly verifiedBy: "service" | InstitutionalIdentifier;
}): DeterminationEvidenceVerification {
  const mappings = input.findings.flatMap(
    (finding) => finding.evidenceMappings,
  );

  const attributableCount = mappings.filter(
    (mapping) => mapping.attributable,
  ).length;
  const permittedCount = mappings.filter(
    (mapping) => mapping.permitted,
  ).length;
  const currentCount = mappings.filter(
    (mapping) => mapping.current,
  ).length;
  const integrityVerifiedCount = mappings.filter(
    (mapping) => mapping.integrityVerified,
  ).length;
  const provenanceVerifiedCount = mappings.filter(
    (mapping) => mapping.provenanceVerified,
  ).length;
  const relevantCount = mappings.filter(
    (mapping) => mapping.relevant,
  ).length;
  const conflictingCount = mappings.filter(
    (mapping) => mapping.relationship === "contradicts",
  ).length;
  const unresolvedCount = mappings.filter(
    (mapping) => mapping.relationship === "unresolved",
  ).length;
  const rejectedCount = mappings.filter(
    (mapping) => mapping.relationship === "excluded",
  ).length;

  const limitations: string[] = [];

  if (input.policy.requireEvidenceMapping && mappings.length === 0) {
    limitations.push("No evidence mappings are available.");
  }
  if (input.policy.requireAttribution && attributableCount < mappings.length) {
    limitations.push("One or more evidence mappings are not attributable.");
  }
  if (input.policy.requirePermission && permittedCount < mappings.length) {
    limitations.push("One or more evidence mappings are not permitted.");
  }
  if (input.policy.requireCurrentVersion && currentCount < mappings.length) {
    limitations.push("One or more evidence mappings are not current.");
  }
  if (
    input.policy.requireIntegrityVerification &&
    integrityVerifiedCount < mappings.length
  ) {
    limitations.push("One or more evidence mappings lack integrity verification.");
  }
  if (
    input.policy.requireProvenanceVerification &&
    provenanceVerifiedCount < mappings.length
  ) {
    limitations.push("One or more evidence mappings lack provenance verification.");
  }
  if (input.policy.requireRelevance && relevantCount < mappings.length) {
    limitations.push("One or more evidence mappings are not relevant.");
  }

  let state: DeterminationEvidenceState;

  if (mappings.length === 0 || attributableCount === 0 || permittedCount === 0) {
    state = "insufficient";
  } else if (conflictingCount > 0) {
    state = "conflicting";
  } else if (currentCount < mappings.length) {
    state = "stale";
  } else if (attributableCount < mappings.length) {
    state = "unattributed";
  } else if (permittedCount < mappings.length) {
    state = "not_permitted";
  } else if (unresolvedCount > 0 || limitations.length > 0) {
    state = "conditionally_sufficient";
  } else {
    state = "sufficient";
  }

  return deepFreeze({
    evidenceVerificationId: input.evidenceVerificationId,
    state,
    evidenceMappings: mappings,
    attributableCount,
    permittedCount,
    currentCount,
    integrityVerifiedCount,
    provenanceVerifiedCount,
    relevantCount,
    conflictingCount,
    unresolvedCount,
    rejectedCount,
    limitations,
    verifiedAt: input.verifiedAt,
    verifiedBy: input.verifiedBy,
  });
}

export function verifyDeterminationAuthority(
  input: Omit<DeterminationAuthorityVerification, "constraints" | "limitations"> & {
    readonly constraints?: readonly string[];
    readonly limitations?: readonly string[];
  },
): DeterminationAuthorityVerification {
  return deepFreeze({
    ...input,
    constraints: [...(input.constraints ?? [])],
    limitations: [...(input.limitations ?? [])],
  });
}

export function verifyDeterminationScope(
  input: Omit<
    DeterminationScopeVerification,
    "state" | "approvedElements" | "rejectedElements" | "constraints" | "limitations"
  > & {
    readonly approvedElements?: readonly JsonValue[];
    readonly rejectedElements?: readonly JsonValue[];
    readonly constraints?: readonly string[];
    readonly limitations?: readonly string[];
  },
): DeterminationScopeVerification {
  const checks = [
    input.targetRecordMatched,
    input.targetRecordTypeMatched,
    input.targetRecordVersionMatched,
    input.actionMatched,
    input.determinationTypeMatched,
    input.organizationMatched,
    input.jurisdictionMatched,
  ];

  const failed = checks.filter((value) => !value).length;
  const rejected = input.rejectedElements?.length ?? 0;

  const state: DeterminationScopeState =
    failed === 0 && rejected === 0
      ? "within_scope"
      : failed === 0
        ? "within_scope_with_constraints"
        : failed <= 2
          ? "partially_outside_scope"
          : "outside_scope";

  return deepFreeze({
    ...input,
    state,
    approvedElements: [...(input.approvedElements ?? [])],
    rejectedElements: [...(input.rejectedElements ?? [])],
    constraints: [...(input.constraints ?? [])],
    limitations: [...(input.limitations ?? [])],
  });
}

export function verifyDeterminationContinuity(
  input: Omit<DeterminationContinuityVerification, "state" | "limitations"> & {
    readonly limitations?: readonly string[];
  },
): DeterminationContinuityVerification {
  const checks = [
    input.findingVersionsCurrent,
    input.evidenceVersionsCurrent,
    input.authorityCurrent,
    input.assignmentCurrent,
    input.scopeCurrent,
    input.lawCurrent,
    input.standardsCurrent,
  ];

  const falseCount = checks.filter((value) => !value).length;

  const state: DeterminationContinuityVerification["state"] =
    input.materialChangeOpen && falseCount > 0
      ? "held"
      : falseCount === 0 && !input.materialChangeOpen
        ? "current"
        : falseCount <= 2
          ? "conditionally_current"
          : "revalidation_required";

  return deepFreeze({
    ...input,
    state,
    limitations: [...(input.limitations ?? [])],
  });
}

export function resolveDeterminationType(input: {
  readonly findingVerification: DeterminationFindingVerification;
  readonly evidenceVerification: DeterminationEvidenceVerification;
  readonly authorityVerification: DeterminationAuthorityVerification;
  readonly scopeVerification: DeterminationScopeVerification;
  readonly continuityVerification: DeterminationContinuityVerification;
  readonly findings: readonly InstitutionalFinding[];
}): DeterminationType {
  if (
    input.authorityVerification.state === "revoked" ||
    input.scopeVerification.state === "outside_scope" ||
    input.findingVerification.state === "insufficient"
  ) {
    return "DENY";
  }

  if (
    input.authorityVerification.state === "held" ||
    input.authorityVerification.state === "expired" ||
    input.evidenceVerification.state === "stale" ||
    input.continuityVerification.state === "held" ||
    input.continuityVerification.state === "revalidation_required"
  ) {
    return "HOLD";
  }

  if (
    input.findingVerification.state === "conflicting" ||
    input.evidenceVerification.state === "conflicting" ||
    input.scopeVerification.state === "conflicting_scope" ||
    input.continuityVerification.state === "invalid"
  ) {
    return "ESCALATE";
  }

  const findingTypes = input.findings.map((finding) => finding.findingType);

  if (
    findingTypes.includes("unsupported") &&
    !findingTypes.some((type) =>
      ["supported", "conditionally_supported", "partially_supported"].includes(type),
    )
  ) {
    return "DENY";
  }

  if (findingTypes.some((type) => type === "inconclusive" || type === "conflicting")) {
    return "ESCALATE";
  }

  return "ALLOW";
}

export function evaluateDeterminationConcurrence(input: {
  readonly concurrenceId: InstitutionalIdentifier;
  readonly positions: readonly DeterminationReviewerPosition[];
  readonly policy: DeterminationReviewPolicy;
  readonly now: ISODateTimeString;
}): DeterminationConcurrence {
  const active = input.positions.filter(
    (position) => position.position !== "recuse",
  );
  const approving = active.filter((position) => position.position === "approve");
  const conditional = active.filter(
    (position) => position.position === "approve_with_conditions",
  );
  const denying = active.filter((position) => position.position === "deny");
  const holding = active.filter((position) => position.position === "hold");
  const escalating = active.filter(
    (position) => position.position === "escalate",
  );
  const abstaining = active.filter(
    (position) => position.position === "abstain",
  );
  const recused = input.positions.filter(
    (position) => position.position === "recuse",
  );

  const minimumReviewerCountSatisfied =
    active.length >= input.policy.minimumReviewerCount;

  const minimumApproverCountSatisfied =
    approving.length + conditional.length >=
    input.policy.minimumApproverCount;

  const independenceSatisfied =
    !input.policy.independentReviewerRequired ||
    active.some((position) => position.independent);

  const unanimitySatisfied =
    active.length > 0 &&
    denying.length === 0 &&
    holding.length === 0 &&
    escalating.length === 0 &&
    abstaining.length === 0;

  const state: DeterminationConcurrence["state"] =
    !minimumReviewerCountSatisfied
      ? "insufficient_reviewers"
      : !minimumApproverCountSatisfied
        ? "insufficient_approvers"
        : input.policy.unanimityRequired && !unanimitySatisfied
          ? "disputed"
          : denying.length > 0 || holding.length > 0 || escalating.length > 0
            ? "disputed"
            : conditional.length > 0
              ? "qualified"
              : unanimitySatisfied
                ? "unanimous"
                : "majority";

  return deepFreeze({
    concurrenceId: input.concurrenceId,
    state,
    approvingReviewerIds: approving.map((p) => p.reviewerSubjectId),
    conditionalApproverIds: conditional.map((p) => p.reviewerSubjectId),
    denyingReviewerIds: denying.map((p) => p.reviewerSubjectId),
    holdingReviewerIds: holding.map((p) => p.reviewerSubjectId),
    escalatingReviewerIds: escalating.map((p) => p.reviewerSubjectId),
    abstainingReviewerIds: abstaining.map((p) => p.reviewerSubjectId),
    recusedReviewerIds: recused.map((p) => p.reviewerSubjectId),
    minimumReviewerCountSatisfied,
    minimumApproverCountSatisfied,
    independenceSatisfied,
    unanimitySatisfied,
    evaluatedAt: input.now,
  });
}

export function createDeterminationSignature(
  input: Omit<DeterminationSignature, "valid" | "limitations">,
): DeterminationSignature {
  if (!isContentHash(input.signedContentHash)) {
    throw new Error("Determination signature requires a valid content hash.");
  }

  return deepFreeze({
    ...input,
    valid: true,
    limitations: [],
  });
}

export function evaluateCommitAuthorization(input: {
  readonly commitAuthorizationId: InstitutionalIdentifier;
  readonly definition: DeterminationDefinition;
  readonly authorityVerification: DeterminationAuthorityVerification;
  readonly scopeVerification: DeterminationScopeVerification;
  readonly findingVerification: DeterminationFindingVerification;
  readonly evidenceVerification: DeterminationEvidenceVerification;
  readonly continuityVerification: DeterminationContinuityVerification;
  readonly concurrence: DeterminationConcurrence;
  readonly signatures: readonly DeterminationSignature[];
  readonly authorizedBy: "service" | InstitutionalIdentifier;
  readonly now: ISODateTimeString;
}): DeterminationCommitAuthorization {
  const blockingReasons: string[] = [];

  const authorityVerified =
    input.authorityVerification.state === "current" ||
    (
      input.definition.authorityPolicy.allowConstrainedAuthority &&
      input.authorityVerification.state === "constrained"
    );

  const scopeVerified =
    input.scopeVerification.state === "within_scope" ||
    (
      input.definition.scopePolicy.allowConstrainedScope &&
      input.scopeVerification.state === "within_scope_with_constraints"
    );

  const findingVerified =
    input.findingVerification.state === "accepted" ||
    input.findingVerification.state === "accepted_with_limitations";

  const evidenceVerified =
    input.evidenceVerification.state === "sufficient" ||
    input.evidenceVerification.state === "conditionally_sufficient";

  const continuityVerified =
    input.continuityVerification.state === "current" ||
    input.continuityVerification.state === "conditionally_current";

  const concurrenceSatisfied = [
    "unanimous",
    "majority",
    "qualified",
  ].includes(input.concurrence.state);

  const validSignatures = input.signatures.filter(
    (signature) => signature.valid && !signature.revokedAt,
  );

  const signatureTypesSatisfied =
    input.definition.signaturePolicy.requiredSignatureTypes.every(
      (type) =>
        validSignatures.some((signature) => signature.signatureType === type),
    );

  const signaturesSatisfied =
    !input.definition.signaturePolicy.signaturesRequired ||
    (
      validSignatures.length >=
        input.definition.signaturePolicy.minimumSignatureCount &&
      signatureTypesSatisfied
    );

  if (!authorityVerified) blockingReasons.push("Authority is not verified.");
  if (!scopeVerified) blockingReasons.push("Scope is not verified.");
  if (!findingVerified) blockingReasons.push("Findings are not verified.");
  if (!evidenceVerified) blockingReasons.push("Evidence is not verified.");
  if (!continuityVerified) blockingReasons.push("Continuity is not verified.");
  if (!concurrenceSatisfied) blockingReasons.push("Concurrence is insufficient.");
  if (!signaturesSatisfied) blockingReasons.push("Signatures are insufficient.");

  const authorized = blockingReasons.length === 0;

  return deepFreeze({
    commitAuthorizationId: input.commitAuthorizationId,
    authorized,
    authorityVerified,
    scopeVerified,
    findingVerified,
    evidenceVerified,
    continuityVerified,
    concurrenceSatisfied,
    signaturesSatisfied,
    blockingReasons,
    limitations: [TA14_DETERMINATION_BOUNDARY],
    authorizedAt: authorized ? input.now : undefined,
    authorizedBy: input.authorizedBy,
  });
}

export async function createInstitutionalDetermination(input: {
  readonly determinationId: InstitutionalIdentifier;
  readonly definition: DeterminationDefinition;
  readonly findings: readonly InstitutionalFinding[];
  readonly targetRecordId: InstitutionalIdentifier;
  readonly targetRecordType: InstitutionalRecordType;
  readonly targetRecordVersion: string;
  readonly title: string;
  readonly statement: string;
  readonly rationale: string;
  readonly conditions: readonly DeterminationCondition[];
  readonly limitations: readonly DeterminationLimitation[];
  readonly assumptions: readonly DeterminationAssumption[];
  readonly dependencies: readonly DeterminationDependency[];
  readonly legalReferences: readonly DeterminationReference[];
  readonly standardsReferences: readonly DeterminationReference[];
  readonly authorityVerification: DeterminationAuthorityVerification;
  readonly scopeVerification: DeterminationScopeVerification;
  readonly findingVerification: DeterminationFindingVerification;
  readonly evidenceVerification: DeterminationEvidenceVerification;
  readonly continuityVerification: DeterminationContinuityVerification;
  readonly reviewerPositions: readonly DeterminationReviewerPosition[];
  readonly concurrence: DeterminationConcurrence;
  readonly signatures: readonly DeterminationSignature[];
  readonly commitAuthorization: DeterminationCommitAuthorization;
  readonly createdBySubjectId: InstitutionalIdentifier;
  readonly version: string;
  readonly correlationId: CorrelationIdentifier;
  readonly now: ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) => Promise<ContentHash> | ContentHash;
}): Promise<InstitutionalDetermination> {
  if (input.findings.length === 0) {
    throw new Error("Determination requires at least one finding.");
  }

  const determinationType = resolveDeterminationType({
    findingVerification: input.findingVerification,
    evidenceVerification: input.evidenceVerification,
    authorityVerification: input.authorityVerification,
    scopeVerification: input.scopeVerification,
    continuityVerification: input.continuityVerification,
    findings: input.findings,
  });

  if (!input.definition.permittedDeterminationTypes.includes(determinationType)) {
    throw new Error(`Determination type ${determinationType} is not permitted.`);
  }

  const state: DeterminationState =
    input.commitAuthorization.authorized
      ? "under_review"
      : input.concurrence.state === "disputed"
        ? "escalated"
        : "held";

  const base = {
    determinationId: input.determinationId,
    determinationDefinitionId: input.definition.determinationDefinitionId,
    targetRecordId: input.targetRecordId,
    targetRecordType: input.targetRecordType,
    targetRecordVersion: input.targetRecordVersion,
    findingIds: input.findings.map((f) => f.findingId),
    findingVersions: input.findings.map((f) => f.version),
    workspaceIds: Array.from(new Set(input.findings.map((f) => f.workspaceId))),
    assignmentIds: Array.from(new Set(input.findings.map((f) => f.assignmentId))),
    determinationType,
    state,
    title: input.title,
    statement: input.statement,
    rationale: input.rationale,
    conditions: input.conditions,
    limitations: input.limitations,
    assumptions: input.assumptions,
    dependencies: input.dependencies,
    legalReferences: input.legalReferences,
    standardsReferences: input.standardsReferences,
    authorityVerification: input.authorityVerification,
    scopeVerification: input.scopeVerification,
    findingVerification: input.findingVerification,
    evidenceVerification: input.evidenceVerification,
    continuityVerification: input.continuityVerification,
    reviewerPositions: input.reviewerPositions.map((position) => ({
      ...position,
      determinationId: input.determinationId,
    })),
    concurrence: input.concurrence,
    signatures: input.signatures.map((signature) => ({
      ...signature,
      determinationId: input.determinationId,
    })),
    commitAuthorization: {
      ...input.commitAuthorization,
      determinationId: input.determinationId,
    },
    createdBySubjectId: input.createdBySubjectId,
    createdAt: input.now,
    version: input.version,
    determinationCreatedRegistryReview: false as const,
    determinationCreatedRegistryPublication: false as const,
    determinationCreatedExecutionArtifact: false as const,
    determinationCreatedExecution: false as const,
    correlationId: input.correlationId,
  };

  const integrityHash = await input.hashCanonicalValue(
    base as unknown as JsonValue,
  );

  const determination: InstitutionalDetermination = {
    ...base,
    integrityHash,
  };

  const validation = validateInstitutionalDetermination(determination);

  if (!validation.ok) {
    throw new DeterminationContractValidationError(
      "Institutional determination failed validation.",
      validation.issues,
    );
  }

  return deepFreeze(determination);
}

export async function commitInstitutionalDetermination(input: {
  readonly determination: InstitutionalDetermination;
  readonly committedBySubjectId: InstitutionalIdentifier;
  readonly now: ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) => Promise<ContentHash> | ContentHash;
}): Promise<InstitutionalDetermination> {
  if (!input.determination.commitAuthorization.authorized) {
    throw new Error("Determination commit is not authorized.");
  }

  if (!["under_review", "held"].includes(input.determination.state)) {
    throw new Error(
      `Determination cannot commit from state ${input.determination.state}.`,
    );
  }

  if (
    ["disputed", "insufficient_reviewers", "insufficient_approvers"].includes(
      input.determination.concurrence.state,
    )
  ) {
    throw new Error("Determination concurrence does not permit commit.");
  }

  const commitHash = await input.hashCanonicalValue({
    determinationId: input.determination.determinationId,
    integrityHash: input.determination.integrityHash,
    determinationType: input.determination.determinationType,
    version: input.determination.version,
    committedBySubjectId: input.committedBySubjectId,
    committedAt: input.now,
    boundary: TA14_DETERMINATION_BOUNDARY,
  });

  return deepFreeze({
    ...input.determination,
    state: "committed",
    committedAt: input.now,
    commitHash,
    determinationCreatedRegistryReview: false,
    determinationCreatedRegistryPublication: false,
    determinationCreatedExecutionArtifact: false,
    determinationCreatedExecution: false,
  });
}

export function holdDetermination(
  determination: InstitutionalDetermination,
  limitation: DeterminationLimitation,
  now: ISODateTimeString,
): InstitutionalDetermination {
  assertDeterminationMutable(determination);
  return deepFreeze({
    ...determination,
    state: "held",
    limitations: [...determination.limitations, limitation],
    reviewedAt: now,
  });
}

export function escalateDetermination(
  determination: InstitutionalDetermination,
  position: DeterminationReviewerPosition,
  now: ISODateTimeString,
): InstitutionalDetermination {
  assertDeterminationMutable(determination);
  return deepFreeze({
    ...determination,
    state: "escalated",
    reviewerPositions: [
      ...determination.reviewerPositions,
      { ...position, determinationId: determination.determinationId },
    ],
    reviewedAt: now,
  });
}

export function withdrawDetermination(
  determination: InstitutionalDetermination,
  now: ISODateTimeString,
): InstitutionalDetermination {
  if (determination.state === "invalidated") {
    throw new Error("Invalidated determination cannot be withdrawn.");
  }
  return deepFreeze({
    ...determination,
    state: "withdrawn",
    withdrawnAt: now,
  });
}

export function invalidateDetermination(
  determination: InstitutionalDetermination,
  limitation: DeterminationLimitation,
  now: ISODateTimeString,
): InstitutionalDetermination {
  return deepFreeze({
    ...determination,
    state: "invalidated",
    limitations: [...determination.limitations, limitation],
    invalidatedAt: now,
  });
}

function assertDeterminationMutable(
  determination: InstitutionalDetermination,
): void {
  if (
    ["superseded", "withdrawn", "invalidated", "expired"].includes(
      determination.state,
    )
  ) {
    throw new Error(
      `Determination ${determination.determinationId} is immutable.`,
    );
  }
}

export interface PublicDeterminationProjection {
  readonly determinationId: InstitutionalIdentifier;
  readonly targetRecordType: InstitutionalRecordType;
  readonly determinationType: DeterminationType;
  readonly state: DeterminationState;
  readonly title: string;
  readonly statement: string;
  readonly conditions: readonly string[];
  readonly limitations: readonly string[];
  readonly authoritySummary?: string;
  readonly concurrenceState: DeterminationConcurrence["state"];
  readonly dissentPresent: boolean;
  readonly version: string;
  readonly createdAt: ISODateTimeString;
  readonly committedAt?: ISODateTimeString;
  readonly determinationBoundary: string;
  readonly integrityHash: ContentHash;
  readonly commitHash?: ContentHash;
}

export function projectPublicDetermination(
  definition: DeterminationDefinition,
  determination: InstitutionalDetermination,
): PublicDeterminationProjection {
  if (!definition.projectionPolicy.publicProjectionAllowed) {
    throw new Error("Public determination projection is not permitted.");
  }

  return deepFreeze({
    determinationId: determination.determinationId,
    targetRecordType: determination.targetRecordType,
    determinationType: determination.determinationType,
    state: determination.state,
    title: determination.title,
    statement: determination.statement,
    conditions: definition.projectionPolicy.exposeConditionsPublicly
      ? determination.conditions.map((condition) => condition.description)
      : [],
    limitations: definition.projectionPolicy.exposeLimitationsPublicly
      ? determination.limitations
          .filter((limitation) => limitation.requiresDisclosure)
          .map((limitation) => limitation.description)
      : [],
    authoritySummary: definition.projectionPolicy.exposeAuthoritySummaryPublicly
      ? `Authority state: ${determination.authorityVerification.state}`
      : undefined,
    concurrenceState: determination.concurrence.state,
    dissentPresent:
      definition.projectionPolicy.exposeDissentPublicly &&
      determination.reviewerPositions.some((position) =>
        ["deny", "hold", "escalate"].includes(position.position),
      ),
    version: determination.version,
    createdAt: determination.createdAt,
    committedAt: determination.committedAt,
    determinationBoundary: TA14_DETERMINATION_BOUNDARY,
    integrityHash: determination.integrityHash,
    commitHash: determination.commitHash,
  });
}

export interface DeterminationDefinitionRepository {
  getDefinition(
    determinationDefinitionId: InstitutionalIdentifier,
    version?: string,
  ): Promise<DeterminationDefinition | null>;
  getActiveDefinition(
    targetRecordType: InstitutionalRecordType,
    at?: ISODateTimeString,
  ): Promise<DeterminationDefinition | null>;
  saveDefinition(definition: DeterminationDefinition): Promise<void>;
}

export interface DeterminationRepository {
  getDetermination(
    determinationId: InstitutionalIdentifier,
  ): Promise<InstitutionalDetermination | null>;
  saveDetermination(
    determination: InstitutionalDetermination,
  ): Promise<void>;
  listForTargetRecord(
    targetRecordId: InstitutionalIdentifier,
  ): Promise<readonly InstitutionalDetermination[]>;
}

export class InMemoryDeterminationDefinitionRepository
implements DeterminationDefinitionRepository {
  private readonly values = new Map<string, DeterminationDefinition>();

  async getDefinition(
    id: InstitutionalIdentifier,
    version?: string,
  ): Promise<DeterminationDefinition | null> {
    if (version) return this.values.get(`${id}@${version}`) ?? null;
    return (
      Array.from(this.values.values())
        .filter((value) => value.determinationDefinitionId === id)
        .sort(
          (a, b) =>
            Date.parse(b.effectiveAt) - Date.parse(a.effectiveAt),
        )[0] ?? null
    );
  }

  async getActiveDefinition(
    recordType: InstitutionalRecordType,
    at = new Date().toISOString(),
  ): Promise<DeterminationDefinition | null> {
    const time = Date.parse(at);
    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.active &&
            value.allowedRecordTypes.includes(recordType) &&
            Date.parse(value.effectiveAt) <= time &&
            (!value.expiresAt || Date.parse(value.expiresAt) > time),
        )
        .sort(
          (a, b) =>
            Date.parse(b.effectiveAt) - Date.parse(a.effectiveAt),
        )[0] ?? null
    );
  }

  async saveDefinition(value: DeterminationDefinition): Promise<void> {
    const validation = validateDeterminationDefinition(value);
    if (!validation.ok) {
      throw new DeterminationContractValidationError(
        "Invalid determination definition.",
        validation.issues,
      );
    }
    const key = `${value.determinationDefinitionId}@${value.version}`;
    if (this.values.has(key)) {
      throw new Error(`Determination definition ${key} already exists.`);
    }
    this.values.set(key, deepFreeze(value));
  }
}

export class InMemoryDeterminationRepository
implements DeterminationRepository {
  private readonly values =
    new Map<InstitutionalIdentifier, InstitutionalDetermination>();

  async getDetermination(
    id: InstitutionalIdentifier,
  ): Promise<InstitutionalDetermination | null> {
    return this.values.get(id) ?? null;
  }

  async saveDetermination(value: InstitutionalDetermination): Promise<void> {
    const validation = validateInstitutionalDetermination(value);
    if (!validation.ok) {
      throw new DeterminationContractValidationError(
        "Invalid determination.",
        validation.issues,
      );
    }
    this.values.set(value.determinationId, deepFreeze(value));
  }

  async listForTargetRecord(
    targetRecordId: InstitutionalIdentifier,
  ): Promise<readonly InstitutionalDetermination[]> {
    return deepFreeze(
      Array.from(this.values.values()).filter(
        (value) => value.targetRecordId === targetRecordId,
      ),
    );
  }
}

export interface DeterminationIdentifierFactory {
  createDeterminationId(): InstitutionalIdentifier;
  createFindingVerificationId(): InstitutionalIdentifier;
  createEvidenceVerificationId(): InstitutionalIdentifier;
  createConcurrenceId(): InstitutionalIdentifier;
  createCommitAuthorizationId(): InstitutionalIdentifier;
}

export interface DeterminationServiceDependencies {
  readonly definitions: DeterminationDefinitionRepository;
  readonly determinations: DeterminationRepository;
  readonly ids: DeterminationIdentifierFactory;
  readonly now: () => ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) => Promise<ContentHash> | ContentHash;
  readonly events?: AcademyEventService;
}

export class DeterminationService {
  constructor(private readonly d: DeterminationServiceDependencies) {}

  async create(input: {
    readonly findings: readonly InstitutionalFinding[];
    readonly targetRecordId: InstitutionalIdentifier;
    readonly targetRecordType: InstitutionalRecordType;
    readonly targetRecordVersion: string;
    readonly title: string;
    readonly statement: string;
    readonly rationale: string;
    readonly authorityVerification: DeterminationAuthorityVerification;
    readonly scopeVerification: DeterminationScopeVerification;
    readonly continuityVerification: DeterminationContinuityVerification;
    readonly reviewerPositions: readonly DeterminationReviewerPosition[];
    readonly signatures: readonly DeterminationSignature[];
    readonly createdBySubjectId: InstitutionalIdentifier;
    readonly version: string;
    readonly correlationId: CorrelationIdentifier;
  }): Promise<InstitutionalDetermination> {
    const definition = await this.d.definitions.getActiveDefinition(
      input.targetRecordType,
      this.d.now(),
    );
    if (!definition) {
      throw new Error("No active determination definition found.");
    }

    const now = this.d.now();

    const findingVerification = verifyDeterminationFindings({
      findingVerificationId: this.d.ids.createFindingVerificationId(),
      findings: input.findings,
      policy: definition.findingPolicy,
      verifiedAt: now,
      verifiedBy: "service",
    });

    const evidenceVerification = verifyDeterminationEvidence({
      evidenceVerificationId: this.d.ids.createEvidenceVerificationId(),
      findings: input.findings,
      policy: definition.evidencePolicy,
      verifiedAt: now,
      verifiedBy: "service",
    });

    const concurrence = evaluateDeterminationConcurrence({
      concurrenceId: this.d.ids.createConcurrenceId(),
      positions: input.reviewerPositions,
      policy: definition.reviewPolicy,
      now,
    });

    const commitAuthorization = evaluateCommitAuthorization({
      commitAuthorizationId: this.d.ids.createCommitAuthorizationId(),
      definition,
      authorityVerification: input.authorityVerification,
      scopeVerification: input.scopeVerification,
      findingVerification,
      evidenceVerification,
      continuityVerification: input.continuityVerification,
      concurrence,
      signatures: input.signatures,
      authorizedBy: "service",
      now,
    });

    const determination = await createInstitutionalDetermination({
      determinationId: this.d.ids.createDeterminationId(),
      definition,
      findings: input.findings,
      targetRecordId: input.targetRecordId,
      targetRecordType: input.targetRecordType,
      targetRecordVersion: input.targetRecordVersion,
      title: input.title,
      statement: input.statement,
      rationale: input.rationale,
      conditions: [],
      limitations: [],
      assumptions: [],
      dependencies: [],
      legalReferences: [],
      standardsReferences: [],
      authorityVerification: input.authorityVerification,
      scopeVerification: input.scopeVerification,
      findingVerification,
      evidenceVerification,
      continuityVerification: input.continuityVerification,
      reviewerPositions: input.reviewerPositions,
      concurrence,
      signatures: input.signatures,
      commitAuthorization,
      createdBySubjectId: input.createdBySubjectId,
      version: input.version,
      correlationId: input.correlationId,
      now,
      hashCanonicalValue: this.d.hashCanonicalValue,
    });

    await this.d.determinations.saveDetermination(determination);
    return determination;
  }
}

export const GOVERNANCE_REVIEW_DETERMINATION_DEFINITION_ID =
  "TA14-DETERMINATION-DEF-GOVERNANCE-REVIEW-000001" as const;

export const governanceReviewDeterminationDefinition:
DeterminationDefinition = deepFreeze({
  determinationDefinitionId:
    GOVERNANCE_REVIEW_DETERMINATION_DEFINITION_ID,
  title: "Bounded AI Governance Review Determination",
  description:
    "Commits an attributable ALLOW, HOLD, DENY, or ESCALATE decision from accepted findings under current authority, scope, evidence, assignment, version, review, signature, and continuity controls.",
  version: "3.0",
  active: true,
  supportedFindingTypes: [
    "supported",
    "conditionally_supported",
    "partially_supported",
    "unsupported",
    "inconclusive",
    "conflicting",
    "outside_scope",
    "revalidation_required",
  ],
  permittedDeterminationTypes: DETERMINATION_TYPES,
  allowedRoles: [
    "authorized_reviewer",
    "academy_standards_reviewer",
    "institutional_administrator",
    "service_role",
  ],
  allowedRecordTypes: [
    "determination",
    "review",
    "demonstration",
    "governed_record",
    "finding",
    "evidence_package",
  ],
  findingPolicy: {
    minimumFindingCount: 1,
    requireAcceptedFinding: true,
    allowConditionallySupportedFinding: true,
    allowPartiallySupportedFinding: true,
    allowConflictingFinding: true,
    allowInconclusiveFindingForEscalation: true,
    allowUnsupportedFindingForDeny: true,
    requireFindingConcurrence: true,
    requireCurrentFindingVersion: true,
    prohibitWithdrawnFinding: true,
    prohibitInvalidatedFinding: true,
    preserveFindingLimitations: true,
  },
  evidencePolicy: {
    requireEvidenceMapping: true,
    requireAttribution: true,
    requirePermission: true,
    requireCurrentVersion: true,
    requireIntegrityVerification: true,
    requireProvenanceVerification: true,
    requireRelevance: true,
    requireNoUnresolvedCriticalEvidence: true,
    allowConflictingEvidenceForEscalation: true,
    allowStaleEvidenceForHold: true,
    preserveExcludedEvidenceReferences: true,
  },
  authorityPolicy: {
    requireCurrentAuthority: true,
    requireAuthorityForDeterminationType: true,
    requireOrganizationMatch: true,
    requireJurisdictionMatch: true,
    requireRoleMatch: true,
    requireAssignmentMatch: true,
    requireActionPermission: true,
    requireDecisionPermission: true,
    allowConstrainedAuthority: true,
    heldAuthorityDecision: "HOLD",
    expiredAuthorityDecision: "HOLD",
    revokedAuthorityDecision: "DENY",
  },
  scopePolicy: {
    requireRecordMatch: true,
    requireRecordTypeMatch: true,
    requireVersionMatch: true,
    requireActionMatch: true,
    requireDecisionTypeMatch: true,
    requireOrganizationMatch: true,
    requireJurisdictionMatch: true,
    allowConstrainedScope: true,
    partialScopeDecision: "HOLD",
    outsideScopeDecision: "DENY",
  },
  reviewPolicy: {
    reviewRequired: true,
    minimumReviewerCount: 1,
    minimumApproverCount: 1,
    dualReviewRequired: false,
    panelRequired: false,
    independentReviewerRequired: false,
    conflictCheckRequired: true,
    authorityCheckRequired: true,
    assignmentCheckRequired: true,
    competenceCheckRequired: true,
    unanimityRequired: false,
    dissentAllowed: true,
    abstentionAllowed: true,
    recusalAllowed: true,
    disputedDecision: "ESCALATE",
  },
  signaturePolicy: {
    signaturesRequired: true,
    requiredSignatureTypes: ["approver", "institutional_commit"],
    minimumSignatureCount: 2,
    requireIntegrityHash: true,
    requireSigningAuthority: true,
    requireSignedContentHash: true,
    requireTimestamp: true,
    allowDetachedSignature: true,
    preserveRevokedSignature: true,
  },
  commitPolicy: {
    commitRequired: true,
    commitAfterReviewOnly: true,
    commitAfterSignaturesOnly: true,
    commitAfterAuthorityVerificationOnly: true,
    commitAfterScopeVerificationOnly: true,
    commitAfterFindingVerificationOnly: true,
    commitAfterEvidenceVerificationOnly: true,
    commitAfterContinuityCheckOnly: true,
    commitCreatesRegistryReview: false,
    commitCreatesRegistryPublication: false,
    commitCreatesExecutionArtifact: false,
    commitCreatesExecution: false,
  },
  amendmentPolicy: {
    amendmentAllowed: true,
    materialAmendmentCreatesNewVersion: true,
    clericalCorrectionCreatesNewVersion: true,
    preservePriorVersion: true,
    requireReason: true,
    requireReviewerApproval: true,
    requireNewSignaturesForMaterialChange: true,
    supersessionAllowed: true,
    withdrawalAllowed: true,
    invalidationAllowed: true,
  },
  continuityPolicy: {
    materialChangeTriggers: [
      "finding_version_changed",
      "evidence_version_changed",
      "authority_changed",
      "assignment_changed",
      "scope_changed",
      "law_changed",
      "standard_changed",
      "outcome_changed",
      "material_fact_changed",
    ],
    findingChangeRequiresReview: true,
    evidenceChangeRequiresReview: true,
    authorityChangeRequiresReview: true,
    assignmentChangeRequiresReview: true,
    scopeChangeRequiresReview: true,
    lawChangeRequiresReview: true,
    standardChangeRequiresReview: true,
    outcomeChangeRequiresReview: true,
    criticalChangeHoldsDetermination: true,
    preserveHistoricalDetermination: true,
  },
  projectionPolicy: {
    publicProjectionAllowed: true,
    authenticatedProjectionAllowed: true,
    controlledProjectionAllowed: true,
    confidentialProjectionAllowed: true,
    protectedFields: [
      "findingIds",
      "findingVersions",
      "authorityVerification.authorityGrantIds",
      "reviewerPositions.reviewerSubjectId",
      "signatures.signerSubjectId",
      "dependencies.referenceId",
    ],
    publicFields: [
      "determinationId",
      "targetRecordType",
      "determinationType",
      "state",
      "title",
      "statement",
      "conditions",
      "limitations",
      "concurrence.state",
      "version",
      "createdAt",
      "committedAt",
      "integrityHash",
      "commitHash",
    ],
    redactSubjectIdentityPublicly: true,
    redactFindingIdentifiersPublicly: true,
    redactEvidenceIdentifiersPublicly: true,
    exposeConditionsPublicly: true,
    exposeLimitationsPublicly: true,
    exposeDissentPublicly: true,
    exposeAuthoritySummaryPublicly: true,
  },
  retentionPolicy: {
    retainDeterminationDays: 2555,
    retainReviewDays: 2555,
    retainSignatureDays: 2555,
    retainAmendmentDays: 2555,
    preserveCommittedDetermination: true,
    preserveSupersededDetermination: true,
    preserveWithdrawnDetermination: true,
    preserveInvalidatedDetermination: true,
  },
  determinationBoundary: TA14_DETERMINATION_BOUNDARY,
  nonSubstitutionRule: TA14_ACADEMY_NON_SUBSTITUTION_RULE,
  contentHash:
    "sha256:0000000000000000000000000000000000000000000000000000000000000000",
  effectiveAt: "2026-08-04T00:00:00Z",
});

export function createDeterministicDeterminationDependencies(
  startAt = "2026-08-04T19:00:00.000Z",
): {
  readonly ids: DeterminationIdentifierFactory;
  readonly now: () => ISODateTimeString;
  readonly hashCanonicalValue: (value: JsonValue) => ContentHash;
} {
  let counter = 0;

  const next = (prefix: string): InstitutionalIdentifier => {
    counter += 1;
    return `${prefix}-${String(counter).padStart(6, "0")}`;
  };

  return {
    ids: {
      createDeterminationId: () => next("TA14-DETERMINATION"),
      createFindingVerificationId: () => next("TA14-DET-FINDING"),
      createEvidenceVerificationId: () => next("TA14-DET-EVIDENCE"),
      createConcurrenceId: () => next("TA14-DET-CONCUR"),
      createCommitAuthorizationId: () => next("TA14-DET-COMMIT-AUTH"),
    },
    now: () =>
      new Date(Date.parse(startAt) + counter * 1000).toISOString(),
    hashCanonicalValue: (value) =>
      `sha256:${deterministicHex(stableStringify(value))}`,
  };
}

export interface DeterminationEngineSelfCheck {
  readonly ok: boolean;
  readonly definitionValid: boolean;
  readonly determinationCreatedRegistryReview: false;
  readonly determinationCreatedRegistryPublication: false;
  readonly determinationCreatedExecutionArtifact: false;
  readonly determinationCreatedExecution: false;
  readonly issues: readonly string[];
}

export function runDeterminationEngineSelfCheck():
DeterminationEngineSelfCheck {
  const issues: string[] = [];
  const validation = validateDeterminationDefinition(
    governanceReviewDeterminationDefinition,
  );

  if (!validation.ok) {
    issues.push(
      "Canonical governance review determination definition failed validation.",
    );
  }

  return {
    ok: issues.length === 0,
    definitionValid: validation.ok,
    determinationCreatedRegistryReview: false,
    determinationCreatedRegistryPublication: false,
    determinationCreatedExecutionArtifact: false,
    determinationCreatedExecution: false,
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

function isContentHash(value: unknown): value is ContentHash {
  return (
    typeof value === "string" &&
    /^sha256:[a-fA-F0-9]{64}$/.test(value)
  );
}

function isDateTime(value: unknown): value is ISODateTimeString {
  return (
    typeof value === "string" &&
    value.includes("T") &&
    Number.isFinite(Date.parse(value))
  );
}

function requiredString(
  value: unknown,
  path: string,
  issues: DeterminationValidationIssue[],
): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    pushIssue(
      issues,
      path,
      "required",
      `${path} must be a non-empty string.`,
      value,
    );
  }
}

function enumArray<T>(
  value: unknown,
  path: string,
  guard: (value: unknown) => value is T,
  issues: DeterminationValidationIssue[],
): void {
  if (!Array.isArray(value) || value.length === 0 || !value.every(guard)) {
    pushIssue(
      issues,
      path,
      "invalid_type",
      `${path} contains unsupported values.`,
      value,
    );
  }
}

function pushIssue(
  issues: DeterminationValidationIssue[],
  path: string,
  code: DeterminationValidationCode,
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

function failValidation<T>(
  message: string,
  received: unknown,
): DeterminationValidationResult<T> {
  return {
    ok: false,
    issues: [
      {
        path: "$",
        code: "invalid_type",
        message,
        severity: "error",
        received,
      },
    ],
  };
}

function completeValidation<T>(
  value: T,
  issues: DeterminationValidationIssue[],
): DeterminationValidationResult<T> {
  const ok = !issues.some((issue) => issue.severity === "error");

  return {
    ok,
    value: ok ? value : undefined,
    issues,
  };
}

function stableStringify(value: JsonValue): string {
  return JSON.stringify(sortJson(value));
}

function sortJson(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }

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

const determinationContracts = {
  engineId: TA14_DETERMINATION_ENGINE_ID,
  engineVersion: TA14_DETERMINATION_ENGINE_VERSION,
  boundary: TA14_DETERMINATION_BOUNDARY,
  determinationStates: DETERMINATION_STATES,
  determinationTypes: DETERMINATION_TYPES,
  validateDeterminationDefinition,
  validateInstitutionalDetermination,
  verifyDeterminationFindings,
  verifyDeterminationEvidence,
  verifyDeterminationAuthority,
  verifyDeterminationScope,
  verifyDeterminationContinuity,
  resolveDeterminationType,
  evaluateDeterminationConcurrence,
  createDeterminationSignature,
  evaluateCommitAuthorization,
  createInstitutionalDetermination,
  commitInstitutionalDetermination,
  holdDetermination,
  escalateDetermination,
  withdrawDetermination,
  invalidateDetermination,
  projectPublicDetermination,
  InMemoryDeterminationDefinitionRepository,
  InMemoryDeterminationRepository,
  DeterminationService,
  governanceReviewDeterminationDefinition,
  createDeterministicDeterminationDependencies,
  runDeterminationEngineSelfCheck,
};

export default determinationContracts;
