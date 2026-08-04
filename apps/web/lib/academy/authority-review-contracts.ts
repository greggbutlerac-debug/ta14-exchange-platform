/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * ACD-007 — Authority Review Contracts
 *
 * Create:
 *   apps/web/lib/academy/authority-review-contracts.ts
 *
 * Constitutional chain:
 *   Lesson
 *   -> Assessment
 *   -> Eligibility Evidence
 *   -> Credential
 *   -> Authority Review
 *   -> Authority Grant
 *   -> Bounded Assignment
 *   -> Governed Execution
 *
 * Hard boundaries:
 *   Credential != Authority
 *   Authority != Assignment
 *   Assignment != Execution
 *
 * Every transition requires a separate governed review,
 * attributable decision, and preserved institutional record.
 */

import type {
  AuthorityState,
  ContentHash,
  CorrelationIdentifier,
  CredentialState,
  InstitutionalIdentifier,
  InstitutionalRecordType,
  InstitutionalRole,
  ISODateTimeString,
  JsonValue,
  ProjectionClass,
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
  AuthorityStatePayload,
} from "./academy-events";

import { createAuthorityStateEventDraft } from "./academy-events";

import type {
  AcademyCredential,
  CredentialDefinition,
} from "./credential-contracts";

/* ========================================================================== *
 * Engine identity
 * ========================================================================== */

export const TA14_ACADEMY_AUTHORITY_REVIEW_ENGINE_VERSION = "3.0" as const;

export const TA14_ACADEMY_AUTHORITY_REVIEW_ENGINE_ID =
  "TA14-ACD-AUTHORITY-REVIEW-ENGINE-000001" as const;

export const TA14_ACADEMY_AUTHORITY_REVIEW_BOUNDARY =
  "Authority may be granted only through a separate, attributable, bounded institutional review. Credentials may support eligibility but never create authority, assignment, execution, evidentiary admission, determination, artifact effect, or Registry publication by themselves." as const;

/* ========================================================================== *
 * Canonical enumerations
 * ========================================================================== */

export const AUTHORITY_REVIEW_STATES = [
  "draft",
  "submitted",
  "screening",
  "eligibility_review",
  "conflict_review",
  "competence_review",
  "scope_review",
  "panel_review",
  "returned_for_correction",
  "held",
  "escalated",
  "approved",
  "denied",
  "withdrawn",
  "superseded",
] as const;

export type AuthorityReviewState =
  (typeof AUTHORITY_REVIEW_STATES)[number];

export const AUTHORITY_REQUEST_TYPES = [
  "initial_grant",
  "renewal",
  "scope_expansion",
  "scope_reduction",
  "constraint_change",
  "temporary_grant",
  "emergency_hold_release",
  "reinstatement",
  "revalidation",
] as const;

export type AuthorityRequestType =
  (typeof AUTHORITY_REQUEST_TYPES)[number];

export const AUTHORITY_GRANT_TYPES = [
  "review",
  "registry_review",
  "artifact_stewardship",
  "academy_assessment",
  "credential_issuance",
  "public_record_stewardship",
  "continuity_review",
  "technical_administration",
  "environmental_review",
  "standards_review",
  "law_review",
  "research_review",
] as const;

export type AuthorityGrantType =
  (typeof AUTHORITY_GRANT_TYPES)[number];

export const AUTHORITY_DECISIONS = [
  "ALLOW",
  "HOLD",
  "DENY",
  "ESCALATE",
  "RETURN_FOR_CORRECTION",
] as const;

export type AuthorityDecision =
  (typeof AUTHORITY_DECISIONS)[number];

export const CONFLICT_STATES = [
  "not_declared",
  "declared_none",
  "declared_potential",
  "declared_actual",
  "under_review",
  "cleared",
  "mitigated",
  "disqualifying",
] as const;

export type ConflictState =
  (typeof CONFLICT_STATES)[number];

export const COMPETENCE_REVIEW_STATES = [
  "not_started",
  "evidence_requested",
  "under_review",
  "sufficient",
  "conditionally_sufficient",
  "insufficient",
  "expired",
  "superseded",
] as const;

export type CompetenceReviewState =
  (typeof COMPETENCE_REVIEW_STATES)[number];

export const AUTHORITY_SCOPE_DIMENSIONS = [
  "record_type",
  "division",
  "organization",
  "jurisdiction",
  "role",
  "action_type",
  "decision_type",
  "evidence_class",
  "confidentiality",
  "time",
  "assignment",
  "system",
  "version",
] as const;

export type AuthorityScopeDimension =
  (typeof AUTHORITY_SCOPE_DIMENSIONS)[number];

export const AUTHORITY_RESTRICTION_TYPES = [
  "scope",
  "supervision_required",
  "dual_review_required",
  "panel_required",
  "no_publication",
  "no_confidential_evidence",
  "no_final_determination",
  "limited_record_types",
  "limited_organization",
  "limited_jurisdiction",
  "limited_division",
  "limited_actions",
  "limited_duration",
  "assignment_specific",
  "revalidation_required",
  "other",
] as const;

export type AuthorityRestrictionType =
  (typeof AUTHORITY_RESTRICTION_TYPES)[number];

export const AUTHORITY_REVIEW_MODES = [
  "single_reviewer",
  "dual_review",
  "panel",
  "independent_external",
  "service_validated_human_decision",
] as const;

export type AuthorityReviewMode =
  (typeof AUTHORITY_REVIEW_MODES)[number];

export const ASSIGNMENT_ELIGIBILITY_STATES = [
  "not_evaluated",
  "eligible",
  "conditionally_eligible",
  "ineligible",
  "held",
  "expired",
] as const;

export type AssignmentEligibilityState =
  (typeof ASSIGNMENT_ELIGIBILITY_STATES)[number];

/* ========================================================================== *
 * Core authority contracts
 * ========================================================================== */

export interface AuthorityDefinition {
  readonly authorityDefinitionId: InstitutionalIdentifier;
  readonly grantType: AuthorityGrantType;
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly active: boolean;

  readonly permittedRoles: readonly InstitutionalRole[];
  readonly requiredCredentialTypes: readonly string[];
  readonly requiredCredentialStates: readonly CredentialState[];
  readonly requiredCompetencyIds: readonly string[];
  readonly requiredEligibilityEvidenceTypes: readonly string[];

  readonly allowedRecordTypes: readonly InstitutionalRecordType[];
  readonly allowedActionTypes: readonly string[];
  readonly allowedDecisionTypes: readonly string[];
  readonly defaultScope: readonly AuthorityScopeRule[];
  readonly defaultRestrictions: readonly AuthorityRestriction[];

  readonly reviewMode: AuthorityReviewMode;
  readonly minimumReviewerCount: number;
  readonly conflictCheckRequired: boolean;
  readonly competenceCheckRequired: boolean;
  readonly scopeCheckRequired: boolean;
  readonly assignmentCheckRequired: boolean;
  readonly revalidationRequired: boolean;

  readonly maximumGrantDays?: number;
  readonly renewalWindowDays?: number;
  readonly gracePeriodDays?: number;

  readonly publicProjectionAllowed: boolean;
  readonly authorityBoundary: string;
  readonly nonSubstitutionRule:
    typeof TA14_ACADEMY_NON_SUBSTITUTION_RULE;

  readonly contentHash: ContentHash;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
}

export interface AuthorityScopeRule {
  readonly ruleId: string;
  readonly dimension: AuthorityScopeDimension;
  readonly operator:
    | "equals"
    | "not_equals"
    | "includes"
    | "excludes"
    | "in"
    | "not_in"
    | "matches"
    | "before"
    | "after";
  readonly value: JsonValue;
  readonly description: string;
  readonly required: boolean;
}

export interface AuthorityRestriction {
  readonly restrictionId: string;
  readonly type: AuthorityRestrictionType;
  readonly title: string;
  readonly description: string;
  readonly blocking: boolean;
  readonly value?: JsonValue;
  readonly expiresAt?: ISODateTimeString;
}

export interface AuthorityReviewRequest {
  readonly requestId: InstitutionalIdentifier;
  readonly requestType: AuthorityRequestType;
  readonly authorityDefinitionId: InstitutionalIdentifier;
  readonly grantType: AuthorityGrantType;

  readonly subjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly requestedBySubjectId: InstitutionalIdentifier;
  readonly requestedAt: ISODateTimeString;

  readonly requestedScope: readonly AuthorityScopeRule[];
  readonly requestedRestrictions: readonly AuthorityRestriction[];
  readonly requestedStartAt?: ISODateTimeString;
  readonly requestedEndAt?: ISODateTimeString;

  readonly credentialIds: readonly InstitutionalIdentifier[];
  readonly eligibilityEvidenceIds: readonly InstitutionalIdentifier[];
  readonly competenceEvidenceRefs: readonly string[];
  readonly priorAuthorityGrantId?: InstitutionalIdentifier;
  readonly assignmentId?: InstitutionalIdentifier;

  readonly conflictDeclaration: ConflictDeclaration;
  readonly attestations: readonly AuthorityAttestation[];

  readonly state: AuthorityReviewState;
  readonly correlationId: CorrelationIdentifier;
  readonly createdAt: ISODateTimeString;
  readonly updatedAt: ISODateTimeString;
}

export interface ConflictDeclaration {
  readonly declarationId: InstitutionalIdentifier;
  readonly state: ConflictState;
  readonly declaredBySubjectId: InstitutionalIdentifier;
  readonly declaredAt: ISODateTimeString;
  readonly relationships: readonly ConflictRelationship[];
  readonly description?: string;
  readonly mitigationProposal?: string;
  readonly attested: boolean;
}

export interface ConflictRelationship {
  readonly relationshipType:
    | "employment"
    | "ownership"
    | "financial"
    | "family"
    | "professional"
    | "competitive"
    | "litigation"
    | "prior_work"
    | "personal"
    | "other";
  readonly relatedSubjectId?: InstitutionalIdentifier;
  readonly relatedOrganizationId?: InstitutionalIdentifier;
  readonly description: string;
  readonly material: boolean;
}

export interface AuthorityAttestation {
  readonly attestationId: InstitutionalIdentifier;
  readonly type:
    | "identity"
    | "credential_accuracy"
    | "conflict_disclosure"
    | "scope_understanding"
    | "authority_boundary"
    | "confidentiality"
    | "continuity"
    | "other";
  readonly statement: string;
  readonly attestedBySubjectId: InstitutionalIdentifier;
  readonly attestedAt: ISODateTimeString;
  readonly integrityHash?: ContentHash;
}

export interface AuthorityEligibilityReview {
  readonly eligibilityReviewId: InstitutionalIdentifier;
  readonly requestId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly credentialFindings: readonly CredentialEligibilityFinding[];
  readonly evidenceFindings: readonly AuthorityEvidenceFinding[];
  readonly result:
    | "eligible"
    | "conditionally_eligible"
    | "ineligible"
    | "held";
  readonly conditions: readonly string[];
  readonly limitations: readonly string[];
  readonly reviewedAt: ISODateTimeString;
  readonly reviewedBy:
    | "service"
    | InstitutionalIdentifier;
}

export interface CredentialEligibilityFinding {
  readonly credentialId: InstitutionalIdentifier;
  readonly credentialType: string;
  readonly expectedState: readonly CredentialState[];
  readonly actualState: CredentialState;
  readonly valid: boolean;
  readonly current: boolean;
  readonly restrictionsCompatible: boolean;
  readonly limitations: readonly string[];
}

export interface AuthorityEvidenceFinding {
  readonly evidenceId: InstitutionalIdentifier;
  readonly evidenceType: string;
  readonly valid: boolean;
  readonly current: boolean;
  readonly attributable: boolean;
  readonly permitted: boolean;
  readonly relevant: boolean;
  readonly limitations: readonly string[];
}

export interface CompetenceReview {
  readonly competenceReviewId: InstitutionalIdentifier;
  readonly requestId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly requiredCompetencyIds: readonly string[];
  readonly demonstratedCompetencyIds: readonly string[];
  readonly missingCompetencyIds: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly state: CompetenceReviewState;
  readonly conditions: readonly string[];
  readonly limitations: readonly string[];
  readonly reviewedBySubjectIds: readonly InstitutionalIdentifier[];
  readonly reviewedAt: ISODateTimeString;
}

export interface ConflictReview {
  readonly conflictReviewId: InstitutionalIdentifier;
  readonly requestId: InstitutionalIdentifier;
  readonly declarationId: InstitutionalIdentifier;
  readonly priorState: ConflictState;
  readonly newState: ConflictState;
  readonly findings: readonly string[];
  readonly mitigations: readonly string[];
  readonly disqualifyingReasons: readonly string[];
  readonly reviewedBySubjectIds: readonly InstitutionalIdentifier[];
  readonly reviewedAt: ISODateTimeString;
}

export interface ScopeReview {
  readonly scopeReviewId: InstitutionalIdentifier;
  readonly requestId: InstitutionalIdentifier;
  readonly requestedScope: readonly AuthorityScopeRule[];
  readonly approvedScope: readonly AuthorityScopeRule[];
  readonly rejectedScope: readonly AuthorityScopeRule[];
  readonly addedRestrictions: readonly AuthorityRestriction[];
  readonly result:
    | "approved"
    | "approved_with_constraints"
    | "held"
    | "denied";
  readonly rationale: string;
  readonly reviewedBySubjectIds: readonly InstitutionalIdentifier[];
  readonly reviewedAt: ISODateTimeString;
}

export interface AuthorityReviewAssignment {
  readonly assignmentId: InstitutionalIdentifier;
  readonly requestId: InstitutionalIdentifier;
  readonly reviewerSubjectId: InstitutionalIdentifier;
  readonly reviewerRole: InstitutionalRole;
  readonly authorityGrantId?: InstitutionalIdentifier;
  readonly assignedAt: ISODateTimeString;
  readonly acceptedAt?: ISODateTimeString;
  readonly completedAt?: ISODateTimeString;
  readonly conflictDeclared: boolean;
  readonly state:
    | "assigned"
    | "accepted"
    | "declined"
    | "in_progress"
    | "completed"
    | "removed";
  readonly scope: readonly string[];
}

export interface AuthorityReviewDecision {
  readonly decisionId: InstitutionalIdentifier;
  readonly requestId: InstitutionalIdentifier;
  readonly decision: AuthorityDecision;
  readonly rationale: string;
  readonly eligibilityReviewId?: InstitutionalIdentifier;
  readonly competenceReviewId?: InstitutionalIdentifier;
  readonly conflictReviewId?: InstitutionalIdentifier;
  readonly scopeReviewId?: InstitutionalIdentifier;
  readonly reviewerSubjectIds: readonly InstitutionalIdentifier[];
  readonly reviewerAgreement:
    | "unanimous"
    | "majority"
    | "single_reviewer"
    | "disputed";
  readonly approvedScope: readonly AuthorityScopeRule[];
  readonly restrictions: readonly AuthorityRestriction[];
  readonly conditions: readonly string[];
  readonly limitations: readonly string[];
  readonly decidedAt: ISODateTimeString;
  readonly integrityHash: ContentHash;
}

export interface AuthorityGrant {
  readonly authorityGrantId: InstitutionalIdentifier;
  readonly authorityDefinitionId: InstitutionalIdentifier;
  readonly requestId: InstitutionalIdentifier;
  readonly decisionId: InstitutionalIdentifier;

  readonly subjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly grantType: AuthorityGrantType;
  readonly state: AuthorityState;

  readonly scope: readonly AuthorityScopeRule[];
  readonly restrictions: readonly AuthorityRestriction[];
  readonly conditions: readonly string[];
  readonly limitations: readonly string[];

  readonly credentialEvidenceIds: readonly InstitutionalIdentifier[];
  readonly eligibilityEvidenceIds: readonly InstitutionalIdentifier[];
  readonly assignmentId?: InstitutionalIdentifier;

  readonly issuedBySubjectIds: readonly InstitutionalIdentifier[];
  readonly issuedAt: ISODateTimeString;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly heldAt?: ISODateTimeString;
  readonly revokedAt?: ISODateTimeString;
  readonly supersededByGrantId?: InstitutionalIdentifier;

  readonly authorityCreatedByCredential: false;
  readonly assignmentCreated: false;
  readonly executionCreated: false;
  readonly registryEffectCreated: false;
  readonly artifactEffectCreated: false;

  readonly correlationId: CorrelationIdentifier;
  readonly integrityHash: ContentHash;
}

export interface AssignmentEligibilityCheck {
  readonly checkId: InstitutionalIdentifier;
  readonly authorityGrantId: InstitutionalIdentifier;
  readonly assignmentId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly state: AssignmentEligibilityState;
  readonly scopeMatched: boolean;
  readonly authorityCurrent: boolean;
  readonly restrictionsSatisfied: boolean;
  readonly conflictCurrent: boolean;
  readonly competenceCurrent: boolean;
  readonly recordTypeAllowed: boolean;
  readonly actionTypeAllowed: boolean;
  readonly decisionTypeAllowed: boolean;
  readonly reasons: readonly string[];
  readonly limitations: readonly string[];
  readonly checkedAt: ISODateTimeString;
  readonly checkedBy:
    | "service"
    | InstitutionalIdentifier;
  readonly assignmentCreated: false;
  readonly executionCreated: false;
}

export interface AuthorityRevalidationAction {
  readonly revalidationActionId: InstitutionalIdentifier;
  readonly authorityGrantId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly triggerType:
    | "credential_change"
    | "credential_expiry"
    | "assessment_change"
    | "lesson_change"
    | "policy_change"
    | "law_change"
    | "standard_change"
    | "conflict_change"
    | "role_change"
    | "organization_change"
    | "scope_change"
    | "material_fact_change";
  readonly severity:
    | "low"
    | "moderate"
    | "high"
    | "critical";
  readonly requiredAction:
    | "review"
    | "relearn"
    | "reassess"
    | "credential_review"
    | "authority_review"
    | "scope_reduction"
    | "hold"
    | "revoke";
  readonly priorAuthorityState: AuthorityState;
  readonly newAuthorityState: AuthorityState;
  readonly dueAt?: ISODateTimeString;
  readonly createdAt: ISODateTimeString;
  readonly completedAt?: ISODateTimeString;
  readonly state:
    | "open"
    | "in_progress"
    | "completed"
    | "failed"
    | "withdrawn";
}

/* ========================================================================== *
 * Validation
 * ========================================================================== */

export type AuthorityValidationCode =
  | "required"
  | "invalid_type"
  | "invalid_value"
  | "invalid_state"
  | "invalid_hash"
  | "invalid_date"
  | "invalid_scope"
  | "invalid_role"
  | "invalid_record_type"
  | "missing_credential"
  | "missing_eligibility_evidence"
  | "missing_conflict_declaration"
  | "conflict_disqualifying"
  | "competence_insufficient"
  | "scope_unsupported"
  | "reviewer_count_insufficient"
  | "authority_boundary_violation"
  | "credential_created_authority"
  | "authority_created_assignment"
  | "authority_created_execution"
  | "authority_created_registry_effect"
  | "authority_created_artifact_effect"
  | "expired_authority"
  | "held_authority"
  | "revoked_authority";

export interface AuthorityValidationIssue {
  readonly path: string;
  readonly code: AuthorityValidationCode;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly received?: unknown;
  readonly expected?: string;
}

export interface AuthorityValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly issues: readonly AuthorityValidationIssue[];
}

export class AuthorityContractValidationError extends Error {
  readonly issues: readonly AuthorityValidationIssue[];

  constructor(
    message: string,
    issues: readonly AuthorityValidationIssue[],
  ) {
    super(message);
    this.name = "AuthorityContractValidationError";
    this.issues = issues;
  }
}

export function validateAuthorityDefinition(
  input: unknown,
): AuthorityValidationResult<AuthorityDefinition> {
  const issues: AuthorityValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Authority definition must be an object.",
      input,
    );
  }

  requiredString(
    input.authorityDefinitionId,
    "$.authorityDefinitionId",
    issues,
  );
  requiredString(input.title, "$.title", issues);
  requiredString(input.description, "$.description", issues);
  requiredString(input.version, "$.version", issues);
  requiredString(
    input.authorityBoundary,
    "$.authorityBoundary",
    issues,
  );

  if (
    !isOneOf(
      input.grantType,
      AUTHORITY_GRANT_TYPES,
    )
  ) {
    pushIssue(
      issues,
      "$.grantType",
      "invalid_value",
      "Unsupported authority grant type.",
      input.grantType,
    );
  }

  if (
    !isOneOf(
      input.reviewMode,
      AUTHORITY_REVIEW_MODES,
    )
  ) {
    pushIssue(
      issues,
      "$.reviewMode",
      "invalid_value",
      "Unsupported authority review mode.",
      input.reviewMode,
    );
  }

  enumArray(
    input.permittedRoles,
    "$.permittedRoles",
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
    typeof input.minimumReviewerCount !== "number" ||
    input.minimumReviewerCount < 1
  ) {
    pushIssue(
      issues,
      "$.minimumReviewerCount",
      "invalid_value",
      "minimumReviewerCount must be at least 1.",
      input.minimumReviewerCount,
    );
  }

  if (
    input.nonSubstitutionRule !==
    TA14_ACADEMY_NON_SUBSTITUTION_RULE
  ) {
    pushIssue(
      issues,
      "$.nonSubstitutionRule",
      "authority_boundary_violation",
      "Canonical non-substitution rule is required.",
      input.nonSubstitutionRule,
    );
  }

  if (!isContentHash(input.contentHash)) {
    pushIssue(
      issues,
      "$.contentHash",
      "invalid_hash",
      "Invalid content hash.",
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
    input as unknown as AuthorityDefinition,
    issues,
  );
}

export function validateAuthorityReviewRequest(
  input: unknown,
): AuthorityValidationResult<AuthorityReviewRequest> {
  const issues: AuthorityValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Authority review request must be an object.",
      input,
    );
  }

  requiredString(input.requestId, "$.requestId", issues);
  requiredString(
    input.authorityDefinitionId,
    "$.authorityDefinitionId",
    issues,
  );
  requiredString(input.subjectId, "$.subjectId", issues);
  requiredString(
    input.requestedBySubjectId,
    "$.requestedBySubjectId",
    issues,
  );
  requiredString(
    input.correlationId,
    "$.correlationId",
    issues,
  );

  if (
    !isOneOf(
      input.requestType,
      AUTHORITY_REQUEST_TYPES,
    )
  ) {
    pushIssue(
      issues,
      "$.requestType",
      "invalid_value",
      "Unsupported authority request type.",
      input.requestType,
    );
  }

  if (
    !isOneOf(
      input.grantType,
      AUTHORITY_GRANT_TYPES,
    )
  ) {
    pushIssue(
      issues,
      "$.grantType",
      "invalid_value",
      "Unsupported authority grant type.",
      input.grantType,
    );
  }

  if (
    !isOneOf(
      input.state,
      AUTHORITY_REVIEW_STATES,
    )
  ) {
    pushIssue(
      issues,
      "$.state",
      "invalid_state",
      "Unsupported authority review state.",
      input.state,
    );
  }

  if (
    !isObject(input.conflictDeclaration)
  ) {
    pushIssue(
      issues,
      "$.conflictDeclaration",
      "missing_conflict_declaration",
      "Conflict declaration is required.",
      input.conflictDeclaration,
    );
  }

  return completeValidation(
    input as unknown as AuthorityReviewRequest,
    issues,
  );
}

export function validateAuthorityGrant(
  input: unknown,
): AuthorityValidationResult<AuthorityGrant> {
  const issues: AuthorityValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Authority grant must be an object.",
      input,
    );
  }

  requiredString(
    input.authorityGrantId,
    "$.authorityGrantId",
    issues,
  );
  requiredString(input.requestId, "$.requestId", issues);
  requiredString(input.decisionId, "$.decisionId", issues);
  requiredString(input.subjectId, "$.subjectId", issues);
  requiredString(
    input.correlationId,
    "$.correlationId",
    issues,
  );

  if (
    !isOneOf(
      input.grantType,
      AUTHORITY_GRANT_TYPES,
    )
  ) {
    pushIssue(
      issues,
      "$.grantType",
      "invalid_value",
      "Unsupported authority grant type.",
      input.grantType,
    );
  }

  if (
    !isOneOf(
      input.state,
      [
        "not_granted",
        "active",
        "constrained",
        "held",
        "revoked",
        "expired",
      ] as const,
    )
  ) {
    pushIssue(
      issues,
      "$.state",
      "invalid_state",
      "Unsupported authority state.",
      input.state,
    );
  }

  const hardFalseFields = [
    "authorityCreatedByCredential",
    "assignmentCreated",
    "executionCreated",
    "registryEffectCreated",
    "artifactEffectCreated",
  ] as const;

  for (const field of hardFalseFields) {
    if (input[field] !== false) {
      pushIssue(
        issues,
        `$.${field}`,
        field === "authorityCreatedByCredential"
          ? "credential_created_authority"
          : field === "assignmentCreated"
            ? "authority_created_assignment"
            : field === "executionCreated"
              ? "authority_created_execution"
              : field === "registryEffectCreated"
                ? "authority_created_registry_effect"
                : "authority_created_artifact_effect",
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
      "Invalid authority integrity hash.",
      input.integrityHash,
    );
  }

  return completeValidation(
    input as unknown as AuthorityGrant,
    issues,
  );
}

/* ========================================================================== *
 * Eligibility, conflict, competence, and scope review
 * ========================================================================== */

export function evaluateCredentialEligibility(
  definition: AuthorityDefinition,
  credentials: readonly AcademyCredential[],
): readonly CredentialEligibilityFinding[] {
  const findings: CredentialEligibilityFinding[] = [];

  for (const credentialType of definition.requiredCredentialTypes) {
    const credential = credentials.find(
      (candidate) =>
        candidate.credentialType === credentialType,
    );

    if (!credential) {
      findings.push({
        credentialId: "missing",
        credentialType,
        expectedState: definition.requiredCredentialStates,
        actualState: "pending",
        valid: false,
        current: false,
        restrictionsCompatible: false,
        limitations: [
          `Required credential type ${credentialType} is missing.`,
        ],
      });
      continue;
    }

    const current =
      credential.state === "active" ||
      credential.state === "expiring";

    const valid =
      definition.requiredCredentialStates.includes(
        credential.state,
      );

    findings.push({
      credentialId: credential.credentialId,
      credentialType,
      expectedState: definition.requiredCredentialStates,
      actualState: credential.state,
      valid,
      current,
      restrictionsCompatible: true,
      limitations: credential.restrictions.map(
        (restriction) => restriction.description,
      ),
    });
  }

  return deepFreeze(findings);
}

export function evaluateAuthorityEligibility(
  definition: AuthorityDefinition,
  request: AuthorityReviewRequest,
  credentials: readonly AcademyCredential[],
  evidenceFindings: readonly AuthorityEvidenceFinding[],
  now: ISODateTimeString,
  reviewedBy:
    | "service"
    | InstitutionalIdentifier = "service",
): AuthorityEligibilityReview {
  const credentialFindings =
    evaluateCredentialEligibility(
      definition,
      credentials,
    );

  const invalidCredentials =
    credentialFindings.filter(
      (finding) =>
        !finding.valid ||
        !finding.current ||
        !finding.restrictionsCompatible,
    );

  const invalidEvidence =
    evidenceFindings.filter(
      (finding) =>
        !finding.valid ||
        !finding.current ||
        !finding.attributable ||
        !finding.permitted ||
        !finding.relevant,
    );

  let result:
    AuthorityEligibilityReview["result"];
  const conditions: string[] = [];
  const limitations: string[] = [];

  if (
    invalidCredentials.length === 0 &&
    invalidEvidence.length === 0
  ) {
    result = "eligible";
  } else if (
    invalidCredentials.length === 0 &&
    invalidEvidence.every(
      (finding) => finding.valid && finding.attributable,
    )
  ) {
    result = "conditionally_eligible";
    conditions.push(
      "Resolve evidence currency, permission, or relevance conditions before issuance.",
    );
  } else {
    result = "ineligible";
  }

  limitations.push(
    TA14_ACADEMY_AUTHORITY_REVIEW_BOUNDARY,
  );

  return deepFreeze({
    eligibilityReviewId:
      `TA14-AUTH-ELIG-${request.requestId}`,
    requestId: request.requestId,
    subjectId: request.subjectId,
    credentialFindings,
    evidenceFindings,
    result,
    conditions,
    limitations,
    reviewedAt: now,
    reviewedBy,
  });
}

export function reviewConflictDeclaration(
  request: AuthorityReviewRequest,
  reviewerSubjectIds: readonly InstitutionalIdentifier[],
  now: ISODateTimeString,
): ConflictReview {
  const declaration = request.conflictDeclaration;

  let newState: ConflictState;
  const findings: string[] = [];
  const mitigations: string[] = [];
  const disqualifyingReasons: string[] = [];

  const materialRelationships =
    declaration.relationships.filter(
      (relationship) => relationship.material,
    );

  if (
    declaration.state === "declared_none" &&
    materialRelationships.length === 0
  ) {
    newState = "cleared";
    findings.push("No material conflict declared.");
  } else if (
    materialRelationships.some(
      (relationship) =>
        relationship.relationshipType === "ownership" ||
        relationship.relationshipType === "financial" ||
        relationship.relationshipType === "litigation",
    )
  ) {
    newState = "disqualifying";
    disqualifyingReasons.push(
      "Material ownership, financial, or litigation conflict requires disqualification unless independently resolved.",
    );
  } else if (materialRelationships.length > 0) {
    newState = "mitigated";
    mitigations.push(
      declaration.mitigationProposal ??
        "Apply independent secondary review and scope restriction.",
    );
  } else {
    newState = "cleared";
  }

  return deepFreeze({
    conflictReviewId:
      `TA14-AUTH-CONFLICT-${request.requestId}`,
    requestId: request.requestId,
    declarationId: declaration.declarationId,
    priorState: declaration.state,
    newState,
    findings,
    mitigations,
    disqualifyingReasons,
    reviewedBySubjectIds: [...reviewerSubjectIds],
    reviewedAt: now,
  });
}

export function reviewCompetence(
  definition: AuthorityDefinition,
  request: AuthorityReviewRequest,
  demonstratedCompetencyIds: readonly string[],
  reviewerSubjectIds: readonly InstitutionalIdentifier[],
  now: ISODateTimeString,
): CompetenceReview {
  const missingCompetencyIds =
    definition.requiredCompetencyIds.filter(
      (competencyId) =>
        !demonstratedCompetencyIds.includes(competencyId),
    );

  const state: CompetenceReviewState =
    missingCompetencyIds.length === 0
      ? "sufficient"
      : demonstratedCompetencyIds.length > 0
        ? "conditionally_sufficient"
        : "insufficient";

  const conditions =
    state === "conditionally_sufficient"
      ? [
          "Complete the missing competency requirements before full authority issuance.",
        ]
      : [];

  return deepFreeze({
    competenceReviewId:
      `TA14-AUTH-COMP-${request.requestId}`,
    requestId: request.requestId,
    subjectId: request.subjectId,
    requiredCompetencyIds:
      definition.requiredCompetencyIds,
    demonstratedCompetencyIds:
      [...demonstratedCompetencyIds],
    missingCompetencyIds,
    evidenceRefs: request.competenceEvidenceRefs,
    state,
    conditions,
    limitations: [
      TA14_ACADEMY_AUTHORITY_REVIEW_BOUNDARY,
    ],
    reviewedBySubjectIds: [...reviewerSubjectIds],
    reviewedAt: now,
  });
}

export function reviewAuthorityScope(
  definition: AuthorityDefinition,
  request: AuthorityReviewRequest,
  reviewerSubjectIds: readonly InstitutionalIdentifier[],
  now: ISODateTimeString,
): ScopeReview {
  const approvedScope: AuthorityScopeRule[] = [];
  const rejectedScope: AuthorityScopeRule[] = [];
  const addedRestrictions: AuthorityRestriction[] = [];

  for (const requested of request.requestedScope) {
    const supported = definition.defaultScope.some(
      (allowed) =>
        allowed.dimension === requested.dimension,
    );

    if (supported) {
      approvedScope.push(requested);
    } else {
      rejectedScope.push(requested);
    }
  }

  let result: ScopeReview["result"];

  if (
    approvedScope.length > 0 &&
    rejectedScope.length === 0
  ) {
    result = "approved";
  } else if (approvedScope.length > 0) {
    result = "approved_with_constraints";
    addedRestrictions.push({
      restrictionId:
        `TA14-AUTH-RESTR-SCOPE-${request.requestId}`,
      type: "scope",
      title: "Unsupported requested scope removed",
      description:
        "Authority is limited to the approved scope.",
      blocking: true,
      value: rejectedScope as unknown as JsonValue,
    });
  } else {
    result = "denied";
  }

  return deepFreeze({
    scopeReviewId:
      `TA14-AUTH-SCOPE-${request.requestId}`,
    requestId: request.requestId,
    requestedScope: request.requestedScope,
    approvedScope,
    rejectedScope,
    addedRestrictions,
    result,
    rationale:
      result === "approved"
        ? "Requested scope is supported by the authority definition."
        : result === "approved_with_constraints"
          ? "Only the supported portion of the requested scope may be granted."
          : "Requested scope is not supported by the authority definition.",
    reviewedBySubjectIds: [...reviewerSubjectIds],
    reviewedAt: now,
  });
}

/* ========================================================================== *
 * Decision and grant issuance
 * ========================================================================== */

export interface AuthorityDecisionInput {
  readonly definition: AuthorityDefinition;
  readonly request: AuthorityReviewRequest;
  readonly eligibility: AuthorityEligibilityReview;
  readonly competence: CompetenceReview;
  readonly conflict: ConflictReview;
  readonly scope: ScopeReview;
  readonly reviewerSubjectIds: readonly InstitutionalIdentifier[];
  readonly reviewerAgreement:
    AuthorityReviewDecision["reviewerAgreement"];
  readonly decisionId: InstitutionalIdentifier;
  readonly now: ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) =>
      Promise<ContentHash> | ContentHash;
}

export async function decideAuthorityReview(
  input: AuthorityDecisionInput,
): Promise<AuthorityReviewDecision> {
  const {
    definition,
    request,
    eligibility,
    competence,
    conflict,
    scope,
  } = input;

  let decision: AuthorityDecision;
  const conditions: string[] = [];
  const limitations: string[] = [];
  const restrictions: AuthorityRestriction[] = [
    ...definition.defaultRestrictions,
    ...request.requestedRestrictions,
    ...scope.addedRestrictions,
  ];

  if (
    conflict.newState === "disqualifying"
  ) {
    decision = "DENY";
    limitations.push(
      ...conflict.disqualifyingReasons,
    );
  } else if (
    eligibility.result === "ineligible" ||
    competence.state === "insufficient" ||
    scope.result === "denied"
  ) {
    decision = "DENY";
  } else if (
    eligibility.result === "held" ||
    scope.result === "held"
  ) {
    decision = "HOLD";
  } else if (
    input.reviewerAgreement === "disputed"
  ) {
    decision = "ESCALATE";
  } else if (
    eligibility.result === "conditionally_eligible" ||
    competence.state === "conditionally_sufficient" ||
    scope.result === "approved_with_constraints"
  ) {
    decision = "ALLOW";
    conditions.push(
      ...eligibility.conditions,
      ...competence.conditions,
    );
  } else {
    decision = "ALLOW";
  }

  limitations.push(
    TA14_ACADEMY_AUTHORITY_REVIEW_BOUNDARY,
  );

  const decisionBase = {
    decisionId: input.decisionId,
    requestId: request.requestId,
    decision,
    rationale: buildDecisionRationale(
      eligibility,
      competence,
      conflict,
      scope,
      input.reviewerAgreement,
    ),
    eligibilityReviewId:
      eligibility.eligibilityReviewId,
    competenceReviewId:
      competence.competenceReviewId,
    conflictReviewId:
      conflict.conflictReviewId,
    scopeReviewId: scope.scopeReviewId,
    reviewerSubjectIds:
      [...input.reviewerSubjectIds],
    reviewerAgreement:
      input.reviewerAgreement,
    approvedScope: scope.approvedScope,
    restrictions,
    conditions,
    limitations,
    decidedAt: input.now,
  };

  const integrityHash =
    await input.hashCanonicalValue(
      decisionBase as unknown as JsonValue,
    );

  return deepFreeze({
    ...decisionBase,
    integrityHash,
  });
}

export interface AuthorityGrantIssuanceInput {
  readonly definition: AuthorityDefinition;
  readonly request: AuthorityReviewRequest;
  readonly decision: AuthorityReviewDecision;
  readonly authorityGrantId: InstitutionalIdentifier;
  readonly issuedBySubjectIds:
    readonly InstitutionalIdentifier[];
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) =>
      Promise<ContentHash> | ContentHash;
}

export async function issueAuthorityGrant(
  input: AuthorityGrantIssuanceInput,
): Promise<AuthorityGrant> {
  if (input.decision.decision !== "ALLOW") {
    throw new Error(
      `Authority grant cannot be issued from decision ${input.decision.decision}.`,
    );
  }

  if (
    input.issuedBySubjectIds.length <
    input.definition.minimumReviewerCount
  ) {
    throw new Error(
      "Insufficient authorized issuers for authority grant.",
    );
  }

  const requestedEnd =
    input.expiresAt ??
    input.request.requestedEndAt;

  const maximumEnd =
    input.definition.maximumGrantDays !== undefined
      ? new Date(
          Date.parse(input.effectiveAt) +
            input.definition.maximumGrantDays *
              86_400_000,
        ).toISOString()
      : undefined;

  const expiresAt =
    requestedEnd && maximumEnd
      ? Date.parse(requestedEnd) <
        Date.parse(maximumEnd)
        ? requestedEnd
        : maximumEnd
      : requestedEnd ?? maximumEnd;

  const base = {
    authorityGrantId: input.authorityGrantId,
    authorityDefinitionId:
      input.definition.authorityDefinitionId,
    requestId: input.request.requestId,
    decisionId: input.decision.decisionId,
    subjectId: input.request.subjectId,
    organizationId:
      input.request.organizationId,
    grantType: input.definition.grantType,
    state:
      input.decision.restrictions.length > 0
        ? ("constrained" as const)
        : ("active" as const),
    scope: input.decision.approvedScope,
    restrictions:
      input.decision.restrictions,
    conditions: input.decision.conditions,
    limitations: input.decision.limitations,
    credentialEvidenceIds:
      input.request.credentialIds,
    eligibilityEvidenceIds:
      input.request.eligibilityEvidenceIds,
    assignmentId: input.request.assignmentId,
    issuedBySubjectIds:
      [...input.issuedBySubjectIds],
    issuedAt: input.effectiveAt,
    effectiveAt: input.effectiveAt,
    expiresAt,
    authorityCreatedByCredential: false as const,
    assignmentCreated: false as const,
    executionCreated: false as const,
    registryEffectCreated: false as const,
    artifactEffectCreated: false as const,
    correlationId: input.request.correlationId,
  };

  const integrityHash =
    await input.hashCanonicalValue(
      base as unknown as JsonValue,
    );

  const grant: AuthorityGrant = {
    ...base,
    integrityHash,
  };

  const validation = validateAuthorityGrant(
    grant,
  );

  if (!validation.ok) {
    throw new AuthorityContractValidationError(
      "Authority grant failed validation.",
      validation.issues,
    );
  }

  return deepFreeze(grant);
}

/* ========================================================================== *
 * Authority lifecycle
 * ========================================================================== */

export function constrainAuthorityGrant(
  grant: AuthorityGrant,
  restrictions: readonly AuthorityRestriction[],
  now: ISODateTimeString,
): AuthorityGrant {
  assertGrantMutable(grant);

  return deepFreeze({
    ...grant,
    state: "constrained",
    restrictions: [
      ...grant.restrictions,
      ...restrictions,
    ],
    limitations: [
      ...grant.limitations,
      "Authority has been constrained.",
    ],
    integrityHash: grant.integrityHash,
    effectiveAt: grant.effectiveAt,
  });
}

export function holdAuthorityGrant(
  grant: AuthorityGrant,
  reason: string,
  now: ISODateTimeString,
): AuthorityGrant {
  assertGrantMutable(grant);

  return deepFreeze({
    ...grant,
    state: "held",
    heldAt: now,
    limitations: [
      ...grant.limitations,
      reason,
    ],
  });
}

export function revokeAuthorityGrant(
  grant: AuthorityGrant,
  reason: string,
  now: ISODateTimeString,
): AuthorityGrant {
  if (
    grant.state === "revoked" ||
    grant.state === "expired"
  ) {
    throw new Error(
      `Authority grant ${grant.authorityGrantId} cannot be revoked from state ${grant.state}.`,
    );
  }

  return deepFreeze({
    ...grant,
    state: "revoked",
    revokedAt: now,
    limitations: [
      ...grant.limitations,
      reason,
    ],
  });
}

export function expireAuthorityGrant(
  grant: AuthorityGrant,
  now: ISODateTimeString,
): AuthorityGrant {
  if (
    !grant.expiresAt ||
    Date.parse(now) < Date.parse(grant.expiresAt)
  ) {
    return grant;
  }

  if (
    grant.state === "revoked" ||
    grant.state === "expired"
  ) {
    return grant;
  }

  return deepFreeze({
    ...grant,
    state: "expired",
    limitations: [
      ...grant.limitations,
      "Authority grant has expired.",
    ],
  });
}

function assertGrantMutable(
  grant: AuthorityGrant,
): void {
  if (
    grant.state === "revoked" ||
    grant.state === "expired"
  ) {
    throw new Error(
      `Authority grant ${grant.authorityGrantId} is immutable in state ${grant.state}.`,
    );
  }
}

/* ========================================================================== *
 * Assignment eligibility
 * ========================================================================== */

export interface AssignmentEligibilityInput {
  readonly checkId: InstitutionalIdentifier;
  readonly grant: AuthorityGrant;
  readonly assignmentId: InstitutionalIdentifier;
  readonly recordType: InstitutionalRecordType;
  readonly actionType: string;
  readonly decisionType?: string;
  readonly organizationId?: InstitutionalIdentifier;
  readonly jurisdiction?: string;
  readonly conflictCurrent: boolean;
  readonly competenceCurrent: boolean;
  readonly checkedAt: ISODateTimeString;
  readonly checkedBy:
    | "service"
    | InstitutionalIdentifier;
}

export function checkAssignmentEligibility(
  input: AssignmentEligibilityInput,
): AssignmentEligibilityCheck {
  const reasons: string[] = [];
  const limitations: string[] = [];

  const authorityCurrent =
    input.grant.state === "active" ||
    input.grant.state === "constrained";

  if (!authorityCurrent) {
    reasons.push(
      `Authority state ${input.grant.state} does not permit assignment.`,
    );
  }

  const recordTypeAllowed =
    scopeAllows(
      input.grant.scope,
      "record_type",
      input.recordType,
    );

  if (!recordTypeAllowed) {
    reasons.push(
      `Record type ${input.recordType} is outside authority scope.`,
    );
  }

  const actionTypeAllowed =
    scopeAllows(
      input.grant.scope,
      "action_type",
      input.actionType,
    );

  if (!actionTypeAllowed) {
    reasons.push(
      `Action type ${input.actionType} is outside authority scope.`,
    );
  }

  const decisionTypeAllowed =
    !input.decisionType ||
    scopeAllows(
      input.grant.scope,
      "decision_type",
      input.decisionType,
    );

  if (!decisionTypeAllowed) {
    reasons.push(
      `Decision type ${input.decisionType} is outside authority scope.`,
    );
  }

  const restrictionsSatisfied =
    !input.grant.restrictions.some(
      (restriction) =>
        restriction.blocking &&
        restriction.type ===
          "revalidation_required",
    );

  if (!restrictionsSatisfied) {
    reasons.push(
      "A blocking authority restriction remains unresolved.",
    );
  }

  if (!input.conflictCurrent) {
    reasons.push(
      "Conflict status is not current.",
    );
  }

  if (!input.competenceCurrent) {
    reasons.push(
      "Competence status is not current.",
    );
  }

  const eligible =
    authorityCurrent &&
    recordTypeAllowed &&
    actionTypeAllowed &&
    decisionTypeAllowed &&
    restrictionsSatisfied &&
    input.conflictCurrent &&
    input.competenceCurrent;

  const state: AssignmentEligibilityState =
    eligible
      ? input.grant.state === "constrained"
        ? "conditionally_eligible"
        : "eligible"
      : input.grant.state === "held"
        ? "held"
        : input.grant.state === "expired"
          ? "expired"
          : "ineligible";

  limitations.push(
    "Assignment eligibility does not create the assignment or execution.",
  );

  return deepFreeze({
    checkId: input.checkId,
    authorityGrantId:
      input.grant.authorityGrantId,
    assignmentId: input.assignmentId,
    subjectId: input.grant.subjectId,
    state,
    scopeMatched:
      recordTypeAllowed &&
      actionTypeAllowed &&
      decisionTypeAllowed,
    authorityCurrent,
    restrictionsSatisfied,
    conflictCurrent: input.conflictCurrent,
    competenceCurrent:
      input.competenceCurrent,
    recordTypeAllowed,
    actionTypeAllowed,
    decisionTypeAllowed,
    reasons,
    limitations,
    checkedAt: input.checkedAt,
    checkedBy: input.checkedBy,
    assignmentCreated: false,
    executionCreated: false,
  });
}

function scopeAllows(
  scope: readonly AuthorityScopeRule[],
  dimension: AuthorityScopeDimension,
  value: string,
): boolean {
  const rules = scope.filter(
    (rule) => rule.dimension === dimension,
  );

  if (rules.length === 0) return false;

  return rules.some((rule) => {
    switch (rule.operator) {
      case "equals":
        return rule.value === value;

      case "not_equals":
        return rule.value !== value;

      case "includes":
        return Array.isArray(rule.value)
          ? rule.value.includes(value)
          : typeof rule.value === "string"
            ? rule.value.includes(value)
            : false;

      case "excludes":
        return Array.isArray(rule.value)
          ? !rule.value.includes(value)
          : typeof rule.value === "string"
            ? !rule.value.includes(value)
            : false;

      case "in":
        return Array.isArray(rule.value)
          ? rule.value.includes(value)
          : false;

      case "not_in":
        return Array.isArray(rule.value)
          ? !rule.value.includes(value)
          : false;

      case "matches":
        return typeof rule.value === "string"
          ? new RegExp(rule.value).test(value)
          : false;

      default:
        return false;
    }
  });
}

/* ========================================================================== *
 * Revalidation
 * ========================================================================== */

export function createAuthorityRevalidationAction(
  input: {
    readonly revalidationActionId:
      InstitutionalIdentifier;
    readonly grant: AuthorityGrant;
    readonly triggerType:
      AuthorityRevalidationAction["triggerType"];
    readonly severity:
      AuthorityRevalidationAction["severity"];
    readonly requiredAction:
      AuthorityRevalidationAction["requiredAction"];
    readonly dueAt?: ISODateTimeString;
    readonly now: ISODateTimeString;
  },
): AuthorityRevalidationAction {
  const newAuthorityState:
    AuthorityState =
    input.requiredAction === "revoke"
      ? "revoked"
      : input.requiredAction === "hold" ||
          input.severity === "critical"
        ? "held"
        : input.grant.state;

  return deepFreeze({
    revalidationActionId:
      input.revalidationActionId,
    authorityGrantId:
      input.grant.authorityGrantId,
    subjectId: input.grant.subjectId,
    triggerType: input.triggerType,
    severity: input.severity,
    requiredAction: input.requiredAction,
    priorAuthorityState:
      input.grant.state,
    newAuthorityState,
    dueAt: input.dueAt,
    createdAt: input.now,
    state: "open",
  });
}

/* ========================================================================== *
 * Public projection
 * ========================================================================== */

export interface PublicAuthorityProjection {
  readonly authorityGrantId:
    InstitutionalIdentifier;
  readonly subjectId:
    InstitutionalIdentifier;
  readonly organizationId?:
    InstitutionalIdentifier;
  readonly grantType: AuthorityGrantType;
  readonly state: AuthorityState;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly scopeSummary: readonly string[];
  readonly restrictionSummary:
    readonly string[];
  readonly authorityBoundary: string;
  readonly verificationHash: ContentHash;
}

export function projectPublicAuthority(
  definition: AuthorityDefinition,
  grant: AuthorityGrant,
): PublicAuthorityProjection {
  if (!definition.publicProjectionAllowed) {
    throw new Error(
      "Authority definition does not permit public projection.",
    );
  }

  return deepFreeze({
    authorityGrantId:
      grant.authorityGrantId,
    subjectId: grant.subjectId,
    organizationId: grant.organizationId,
    grantType: grant.grantType,
    state: grant.state,
    effectiveAt: grant.effectiveAt,
    expiresAt: grant.expiresAt,
    scopeSummary:
      grant.scope.map(
        (rule) =>
          `${rule.dimension} ${rule.operator} ${JSON.stringify(rule.value)}`,
      ),
    restrictionSummary:
      grant.restrictions.map(
        (restriction) =>
          restriction.description,
      ),
    authorityBoundary:
      TA14_ACADEMY_AUTHORITY_REVIEW_BOUNDARY,
    verificationHash:
      grant.integrityHash,
  });
}

/* ========================================================================== *
 * Repository contracts
 * ========================================================================== */

export interface AuthorityDefinitionRepository {
  getDefinition(
    authorityDefinitionId:
      InstitutionalIdentifier,
    version?: string,
  ): Promise<AuthorityDefinition | null>;

  getActiveDefinition(
    grantType: AuthorityGrantType,
    at?: ISODateTimeString,
  ): Promise<AuthorityDefinition | null>;

  saveDefinition(
    definition: AuthorityDefinition,
  ): Promise<void>;
}

export interface AuthorityReviewRequestRepository {
  getRequest(
    requestId: InstitutionalIdentifier,
  ): Promise<AuthorityReviewRequest | null>;

  saveRequest(
    request: AuthorityReviewRequest,
  ): Promise<void>;

  listRequests(
    subjectId?: InstitutionalIdentifier,
  ): Promise<readonly AuthorityReviewRequest[]>;
}

export interface AuthorityDecisionRepository {
  getDecision(
    decisionId: InstitutionalIdentifier,
  ): Promise<AuthorityReviewDecision | null>;

  saveDecision(
    decision: AuthorityReviewDecision,
  ): Promise<void>;
}

export interface AuthorityGrantRepository {
  getGrant(
    authorityGrantId:
      InstitutionalIdentifier,
  ): Promise<AuthorityGrant | null>;

  getActiveGrantsForSubject(
    subjectId: InstitutionalIdentifier,
    at?: ISODateTimeString,
  ): Promise<readonly AuthorityGrant[]>;

  saveGrant(
    grant: AuthorityGrant,
  ): Promise<void>;
}

/* ========================================================================== *
 * In-memory repositories
 * ========================================================================== */

export class InMemoryAuthorityDefinitionRepository
  implements AuthorityDefinitionRepository
{
  private readonly values =
    new Map<string, AuthorityDefinition>();

  async getDefinition(
    authorityDefinitionId:
      InstitutionalIdentifier,
    version?: string,
  ): Promise<AuthorityDefinition | null> {
    if (version) {
      return (
        this.values.get(
          `${authorityDefinitionId}@${version}`,
        ) ?? null
      );
    }

    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.authorityDefinitionId ===
            authorityDefinitionId,
        )
        .sort(
          (a, b) =>
            Date.parse(b.effectiveAt) -
            Date.parse(a.effectiveAt),
        )[0] ?? null
    );
  }

  async getActiveDefinition(
    grantType: AuthorityGrantType,
    at = new Date().toISOString(),
  ): Promise<AuthorityDefinition | null> {
    const time = Date.parse(at);

    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.grantType === grantType &&
            value.active,
        )
        .filter(
          (value) =>
            Date.parse(value.effectiveAt) <=
              time &&
            (!value.expiresAt ||
              Date.parse(value.expiresAt) >
                time),
        )
        .sort(
          (a, b) =>
            Date.parse(b.effectiveAt) -
            Date.parse(a.effectiveAt),
        )[0] ?? null
    );
  }

  async saveDefinition(
    definition: AuthorityDefinition,
  ): Promise<void> {
    const validation =
      validateAuthorityDefinition(
        definition,
      );

    if (!validation.ok) {
      throw new AuthorityContractValidationError(
        "Cannot save invalid authority definition.",
        validation.issues,
      );
    }

    const key =
      `${definition.authorityDefinitionId}@${definition.version}`;

    if (this.values.has(key)) {
      throw new Error(
        `Authority definition ${key} already exists.`,
      );
    }

    this.values.set(
      key,
      deepFreeze(definition),
    );
  }
}

export class InMemoryAuthorityReviewRequestRepository
  implements AuthorityReviewRequestRepository
{
  private readonly values =
    new Map<
      InstitutionalIdentifier,
      AuthorityReviewRequest
    >();

  async getRequest(
    requestId: InstitutionalIdentifier,
  ): Promise<AuthorityReviewRequest | null> {
    return this.values.get(requestId) ?? null;
  }

  async saveRequest(
    request: AuthorityReviewRequest,
  ): Promise<void> {
    const validation =
      validateAuthorityReviewRequest(
        request,
      );

    if (!validation.ok) {
      throw new AuthorityContractValidationError(
        "Cannot save invalid authority review request.",
        validation.issues,
      );
    }

    this.values.set(
      request.requestId,
      deepFreeze(request),
    );
  }

  async listRequests(
    subjectId?: InstitutionalIdentifier,
  ): Promise<readonly AuthorityReviewRequest[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (request) =>
            !subjectId ||
            request.subjectId === subjectId,
        )
        .sort(
          (a, b) =>
            Date.parse(b.createdAt) -
            Date.parse(a.createdAt),
        ),
    );
  }
}

export class InMemoryAuthorityDecisionRepository
  implements AuthorityDecisionRepository
{
  private readonly values =
    new Map<
      InstitutionalIdentifier,
      AuthorityReviewDecision
    >();

  async getDecision(
    decisionId: InstitutionalIdentifier,
  ): Promise<AuthorityReviewDecision | null> {
    return this.values.get(decisionId) ?? null;
  }

  async saveDecision(
    decision: AuthorityReviewDecision,
  ): Promise<void> {
    if (this.values.has(decision.decisionId)) {
      throw new Error(
        `Authority decision ${decision.decisionId} already exists.`,
      );
    }

    this.values.set(
      decision.decisionId,
      deepFreeze(decision),
    );
  }
}

export class InMemoryAuthorityGrantRepository
  implements AuthorityGrantRepository
{
  private readonly values =
    new Map<
      InstitutionalIdentifier,
      AuthorityGrant
    >();

  async getGrant(
    authorityGrantId:
      InstitutionalIdentifier,
  ): Promise<AuthorityGrant | null> {
    return (
      this.values.get(authorityGrantId) ??
      null
    );
  }

  async getActiveGrantsForSubject(
    subjectId: InstitutionalIdentifier,
    at = new Date().toISOString(),
  ): Promise<readonly AuthorityGrant[]> {
    const time = Date.parse(at);

    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (grant) =>
            grant.subjectId === subjectId,
        )
        .filter(
          (grant) =>
            grant.state === "active" ||
            grant.state === "constrained",
        )
        .filter(
          (grant) =>
            Date.parse(grant.effectiveAt) <=
              time &&
            (!grant.expiresAt ||
              Date.parse(grant.expiresAt) >
                time),
        ),
    );
  }

  async saveGrant(
    grant: AuthorityGrant,
  ): Promise<void> {
    const validation =
      validateAuthorityGrant(grant);

    if (!validation.ok) {
      throw new AuthorityContractValidationError(
        "Cannot save invalid authority grant.",
        validation.issues,
      );
    }

    this.values.set(
      grant.authorityGrantId,
      deepFreeze(grant),
    );
  }
}

/* ========================================================================== *
 * Authority review service
 * ========================================================================== */

export interface AuthorityIdentifierFactory {
  readonly createRequestId:
    () => InstitutionalIdentifier;
  readonly createDecisionId:
    () => InstitutionalIdentifier;
  readonly createGrantId:
    () => InstitutionalIdentifier;
  readonly createConflictDeclarationId:
    () => InstitutionalIdentifier;
  readonly createEligibilityReviewId:
    () => InstitutionalIdentifier;
  readonly createCompetenceReviewId:
    () => InstitutionalIdentifier;
  readonly createConflictReviewId:
    () => InstitutionalIdentifier;
  readonly createScopeReviewId:
    () => InstitutionalIdentifier;
  readonly createAssignmentCheckId:
    () => InstitutionalIdentifier;
  readonly createRevalidationActionId:
    () => InstitutionalIdentifier;
}

export interface AuthorityReviewServiceDependencies {
  readonly definitions:
    AuthorityDefinitionRepository;
  readonly requests:
    AuthorityReviewRequestRepository;
  readonly decisions:
    AuthorityDecisionRepository;
  readonly grants:
    AuthorityGrantRepository;
  readonly ids:
    AuthorityIdentifierFactory;
  readonly now:
    () => ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) =>
      Promise<ContentHash> | ContentHash;
  readonly events?: AcademyEventService;
}

export class AcademyAuthorityReviewService {
  constructor(
    private readonly dependencies:
      AuthorityReviewServiceDependencies,
  ) {}

  async createRequest(
    input: {
      readonly grantType:
        AuthorityGrantType;
      readonly requestType:
        AuthorityRequestType;
      readonly subjectId:
        InstitutionalIdentifier;
      readonly organizationId?:
        InstitutionalIdentifier;
      readonly requestedBySubjectId:
        InstitutionalIdentifier;
      readonly requestedScope:
        readonly AuthorityScopeRule[];
      readonly requestedRestrictions?:
        readonly AuthorityRestriction[];
      readonly credentialIds:
        readonly InstitutionalIdentifier[];
      readonly eligibilityEvidenceIds:
        readonly InstitutionalIdentifier[];
      readonly competenceEvidenceRefs:
        readonly string[];
      readonly conflictRelationships:
        readonly ConflictRelationship[];
      readonly conflictDescription?: string;
      readonly assignmentId?:
        InstitutionalIdentifier;
      readonly correlationId:
        CorrelationIdentifier;
    },
  ): Promise<AuthorityReviewRequest> {
    const definition =
      await this.dependencies.definitions
        .getActiveDefinition(
          input.grantType,
          this.dependencies.now(),
        );

    if (!definition) {
      throw new Error(
        `No active authority definition exists for ${input.grantType}.`,
      );
    }

    const now =
      this.dependencies.now();

    const conflictState: ConflictState =
      input.conflictRelationships.length === 0
        ? "declared_none"
        : "declared_potential";

    const request: AuthorityReviewRequest = {
      requestId:
        this.dependencies.ids.createRequestId(),
      requestType: input.requestType,
      authorityDefinitionId:
        definition.authorityDefinitionId,
      grantType: input.grantType,
      subjectId: input.subjectId,
      organizationId: input.organizationId,
      requestedBySubjectId:
        input.requestedBySubjectId,
      requestedAt: now,
      requestedScope:
        [...input.requestedScope],
      requestedRestrictions:
        [...(input.requestedRestrictions ?? [])],
      credentialIds:
        [...input.credentialIds],
      eligibilityEvidenceIds:
        [...input.eligibilityEvidenceIds],
      competenceEvidenceRefs:
        [...input.competenceEvidenceRefs],
      assignmentId: input.assignmentId,
      conflictDeclaration: {
        declarationId:
          this.dependencies.ids
            .createConflictDeclarationId(),
        state: conflictState,
        declaredBySubjectId:
          input.requestedBySubjectId,
        declaredAt: now,
        relationships:
          [...input.conflictRelationships],
        description:
          input.conflictDescription,
        attested: true,
      },
      attestations: [
        {
          attestationId:
            `${input.correlationId}:authority-boundary`,
          type: "authority_boundary",
          statement:
            TA14_ACADEMY_AUTHORITY_REVIEW_BOUNDARY,
          attestedBySubjectId:
            input.requestedBySubjectId,
          attestedAt: now,
        },
      ],
      state: "submitted",
      correlationId: input.correlationId,
      createdAt: now,
      updatedAt: now,
    };

    await this.dependencies.requests
      .saveRequest(request);

    return request;
  }

  async decideAndIssue(
    input: {
      readonly requestId:
        InstitutionalIdentifier;
      readonly credentials:
        readonly AcademyCredential[];
      readonly evidenceFindings:
        readonly AuthorityEvidenceFinding[];
      readonly demonstratedCompetencyIds:
        readonly string[];
      readonly reviewerSubjectIds:
        readonly InstitutionalIdentifier[];
      readonly reviewerAgreement:
        AuthorityReviewDecision["reviewerAgreement"];
      readonly eventContext?:
        {
          readonly actor:
            AcademyEventActor;
          readonly authority:
            AcademyEventAuthority;
          readonly record:
            AcademyEventRecordRef;
          readonly idempotencyKey:
            string;
        };
    },
  ): Promise<{
    readonly decision:
      AuthorityReviewDecision;
    readonly grant?:
      AuthorityGrant;
  }> {
    const request =
      await this.dependencies.requests
        .getRequest(input.requestId);

    if (!request) {
      throw new Error(
        `Authority review request ${input.requestId} was not found.`,
      );
    }

    const definition =
      await this.dependencies.definitions
        .getDefinition(
          request.authorityDefinitionId,
        );

    if (!definition) {
      throw new Error(
        `Authority definition ${request.authorityDefinitionId} was not found.`,
      );
    }

    const now =
      this.dependencies.now();

    const eligibility =
      evaluateAuthorityEligibility(
        definition,
        request,
        input.credentials,
        input.evidenceFindings,
        now,
      );

    const competence =
      reviewCompetence(
        definition,
        request,
        input.demonstratedCompetencyIds,
        input.reviewerSubjectIds,
        now,
      );

    const conflict =
      reviewConflictDeclaration(
        request,
        input.reviewerSubjectIds,
        now,
      );

    const scope =
      reviewAuthorityScope(
        definition,
        request,
        input.reviewerSubjectIds,
        now,
      );

    const decision =
      await decideAuthorityReview({
        definition,
        request,
        eligibility,
        competence,
        conflict,
        scope,
        reviewerSubjectIds:
          input.reviewerSubjectIds,
        reviewerAgreement:
          input.reviewerAgreement,
        decisionId:
          this.dependencies.ids
            .createDecisionId(),
        now,
        hashCanonicalValue:
          this.dependencies.hashCanonicalValue,
      });

    await this.dependencies.decisions
      .saveDecision(decision);

    if (decision.decision !== "ALLOW") {
      return { decision };
    }

    const grant =
      await issueAuthorityGrant({
        definition,
        request,
        decision,
        authorityGrantId:
          this.dependencies.ids
            .createGrantId(),
        issuedBySubjectIds:
          input.reviewerSubjectIds,
        effectiveAt: now,
        hashCanonicalValue:
          this.dependencies.hashCanonicalValue,
      });

    await this.dependencies.grants
      .saveGrant(grant);

    if (
      this.dependencies.events &&
      input.eventContext
    ) {
      const payload:
        AuthorityStatePayload = {
        authorityGrantId:
          grant.authorityGrantId,
        grantType: grant.grantType,
        priorState: "not_granted",
        newState: grant.state,
        scope: grant.scope.map(
          (rule) =>
            `${rule.dimension}:${rule.operator}:${JSON.stringify(rule.value)}`,
        ),
        restrictions:
          grant.restrictions.map(
            (restriction) =>
              restriction.description,
          ),
        effectiveAt:
          grant.effectiveAt,
        expiresAt:
          grant.expiresAt,
        credentialEvidenceIds:
          grant.credentialEvidenceIds,
        assignmentId:
          grant.assignmentId,
      };

      await this.dependencies.events.emit(
        createAuthorityStateEventDraft({
          eventType:
            "authority.grant.issued",
          actor:
            input.eventContext.actor,
          authority:
            input.eventContext.authority,
          record:
            input.eventContext.record,
          correlationId:
            grant.correlationId,
          idempotencyKey:
            input.eventContext.idempotencyKey,
          payload,
        }),
      );
    }

    return {
      decision,
      grant,
    };
  }
}

/* ========================================================================== *
 * Canonical authority definition
 * ========================================================================== */

export const REVIEWER_AUTHORITY_DEFINITION_ID =
  "TA14-AUTH-DEF-REVIEWER-000001" as const;

export const reviewerAuthorityDefinition:
  AuthorityDefinition = deepFreeze({
    authorityDefinitionId:
      REVIEWER_AUTHORITY_DEFINITION_ID,
    grantType: "review",
    title:
      "Bounded AI Governance Reviewer Authority",
    description:
      "Authorizes a qualified reviewer to accept specifically assigned, bounded AI governance reviews within current scope, conflict, competence, evidence, confidentiality, and continuity limits.",
    version: "3.0",
    active: true,

    permittedRoles: [
      "reviewer_candidate",
      "authorized_reviewer",
      "academy_standards_reviewer",
    ],

    requiredCredentialTypes: [
      "TA14-REVIEWER-ORIENTATION",
    ],

    requiredCredentialStates: [
      "active",
      "expiring",
    ],

    requiredCompetencyIds: [
      "review.boundary_comprehension",
      "review.conflict_and_scope",
    ],

    requiredEligibilityEvidenceTypes: [
      "reviewer_orientation_completed",
    ],

    allowedRecordTypes: [
      "review",
      "finding",
      "determination",
      "demonstration",
      "governed_record",
      "evidence_package",
    ],

    allowedActionTypes: [
      "accept_review_assignment",
      "inspect_evidence",
      "record_finding",
      "return_for_correction",
      "hold_review",
      "escalate_review",
      "commit_bounded_determination",
    ],

    allowedDecisionTypes: [
      "ALLOW",
      "HOLD",
      "DENY",
      "ESCALATE",
    ],

    defaultScope: [
      {
        ruleId:
          "AUTH-SCOPE-RECORD-TYPES",
        dimension: "record_type",
        operator: "in",
        value: [
          "review",
          "finding",
          "determination",
          "demonstration",
          "governed_record",
          "evidence_package",
        ],
        description:
          "Authority applies only to approved AI governance review record types.",
        required: true,
      },
      {
        ruleId:
          "AUTH-SCOPE-ACTIONS",
        dimension: "action_type",
        operator: "in",
        value: [
          "accept_review_assignment",
          "inspect_evidence",
          "record_finding",
          "return_for_correction",
          "hold_review",
          "escalate_review",
          "commit_bounded_determination",
        ],
        description:
          "Authority applies only to approved review actions.",
        required: true,
      },
      {
        ruleId:
          "AUTH-SCOPE-DECISIONS",
        dimension: "decision_type",
        operator: "in",
        value: [
          "ALLOW",
          "HOLD",
          "DENY",
          "ESCALATE",
        ],
        description:
          "Authority supports only canonical bounded determinations.",
        required: true,
      },
    ],

    defaultRestrictions: [
      {
        restrictionId:
          "AUTH-RESTR-ASSIGNMENT",
        type: "assignment_specific",
        title:
          "Assignment-specific authority",
        description:
          "The grant does not itself create or accept an assignment.",
        blocking: true,
      },
      {
        restrictionId:
          "AUTH-RESTR-EXECUTION",
        type: "other",
        title:
          "No execution authority",
        description:
          "Review authority does not create runtime execution authority.",
        blocking: true,
      },
    ],

    reviewMode: "dual_review",
    minimumReviewerCount: 2,
    conflictCheckRequired: true,
    competenceCheckRequired: true,
    scopeCheckRequired: true,
    assignmentCheckRequired: true,
    revalidationRequired: true,

    maximumGrantDays: 365,
    renewalWindowDays: 60,
    gracePeriodDays: 0,

    publicProjectionAllowed: true,

    authorityBoundary:
      TA14_ACADEMY_AUTHORITY_REVIEW_BOUNDARY,

    nonSubstitutionRule:
      TA14_ACADEMY_NON_SUBSTITUTION_RULE,

    contentHash:
      "sha256:0000000000000000000000000000000000000000000000000000000000000000",

    effectiveAt:
      "2026-08-04T00:00:00Z",
  });

/* ========================================================================== *
 * Deterministic dependencies and self-check
 * ========================================================================== */

export function createDeterministicAuthorityDependencies(
  startAt = "2026-08-04T15:00:00.000Z",
): {
  readonly ids:
    AuthorityIdentifierFactory;
  readonly now:
    () => ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) => ContentHash;
} {
  let counter = 0;

  const next = (
    prefix: string,
  ): InstitutionalIdentifier => {
    counter += 1;
    return `${prefix}-${String(counter).padStart(6, "0")}`;
  };

  return {
    ids: {
      createRequestId: () =>
        next("TA14-AUTH-REQ"),
      createDecisionId: () =>
        next("TA14-AUTH-DEC"),
      createGrantId: () =>
        next("TA14-AUTH-GRANT"),
      createConflictDeclarationId: () =>
        next("TA14-AUTH-CONFLICT-DECL"),
      createEligibilityReviewId: () =>
        next("TA14-AUTH-ELIG"),
      createCompetenceReviewId: () =>
        next("TA14-AUTH-COMP"),
      createConflictReviewId: () =>
        next("TA14-AUTH-CONFLICT"),
      createScopeReviewId: () =>
        next("TA14-AUTH-SCOPE"),
      createAssignmentCheckId: () =>
        next("TA14-AUTH-ASG-CHECK"),
      createRevalidationActionId: () =>
        next("TA14-AUTH-REVALIDATE"),
    },

    now: () =>
      new Date(
        Date.parse(startAt) +
          counter * 1000,
      ).toISOString(),

    hashCanonicalValue: (value) =>
      `sha256:${deterministicHex(
        stableStringify(value),
      )}`,
  };
}

export interface AuthorityEngineSelfCheck {
  readonly ok: boolean;
  readonly definitionValid: boolean;
  readonly requestValid: boolean;
  readonly credentialCreatedAuthority: false;
  readonly authorityCreatedAssignment: false;
  readonly authorityCreatedExecution: false;
  readonly issues: readonly string[];
}

export function runAuthorityEngineSelfCheck():
  AuthorityEngineSelfCheck {
  const issues: string[] = [];

  const definitionValidation =
    validateAuthorityDefinition(
      reviewerAuthorityDefinition,
    );

  if (!definitionValidation.ok) {
    issues.push(
      "Canonical reviewer authority definition failed validation.",
    );
  }

  const dependencies =
    createDeterministicAuthorityDependencies();

  const now = dependencies.now();

  const request:
    AuthorityReviewRequest = {
    requestId:
      dependencies.ids.createRequestId(),
    requestType: "initial_grant",
    authorityDefinitionId:
      reviewerAuthorityDefinition.authorityDefinitionId,
    grantType: "review",
    subjectId:
      "TA14-SUBJECT-REVIEWER-TEST",
    organizationId:
      "TA14-ORG-TEST",
    requestedBySubjectId:
      "TA14-SUBJECT-REVIEWER-TEST",
    requestedAt: now,
    requestedScope:
      reviewerAuthorityDefinition.defaultScope,
    requestedRestrictions: [],
    credentialIds: [
      "TA14-CREDENTIAL-TEST-000001",
    ],
    eligibilityEvidenceIds: [
      "TA14-ELIG-TEST-000001",
    ],
    competenceEvidenceRefs: [
      "TA14-ASSESSMENT-ATTEMPT-TEST",
    ],
    conflictDeclaration: {
      declarationId:
        dependencies.ids
          .createConflictDeclarationId(),
      state: "declared_none",
      declaredBySubjectId:
        "TA14-SUBJECT-REVIEWER-TEST",
      declaredAt: now,
      relationships: [],
      attested: true,
    },
    attestations: [
      {
        attestationId:
          "TA14-ATTEST-TEST-000001",
        type: "authority_boundary",
        statement:
          TA14_ACADEMY_AUTHORITY_REVIEW_BOUNDARY,
        attestedBySubjectId:
          "TA14-SUBJECT-REVIEWER-TEST",
        attestedAt: now,
      },
    ],
    state: "submitted",
    correlationId:
      "TA14-CORR-AUTHORITY-TEST",
    createdAt: now,
    updatedAt: now,
  };

  const requestValidation =
    validateAuthorityReviewRequest(request);

  if (!requestValidation.ok) {
    issues.push(
      "Canonical authority review request failed validation.",
    );
  }

  return {
    ok: issues.length === 0,
    definitionValid:
      definitionValidation.ok,
    requestValid:
      requestValidation.ok,
    credentialCreatedAuthority: false,
    authorityCreatedAssignment: false,
    authorityCreatedExecution: false,
    issues,
  };
}

/* ========================================================================== *
 * Internal utilities
 * ========================================================================== */

function buildDecisionRationale(
  eligibility: AuthorityEligibilityReview,
  competence: CompetenceReview,
  conflict: ConflictReview,
  scope: ScopeReview,
  reviewerAgreement:
    AuthorityReviewDecision["reviewerAgreement"],
): string {
  return [
    `Eligibility: ${eligibility.result}.`,
    `Competence: ${competence.state}.`,
    `Conflict: ${conflict.newState}.`,
    `Scope: ${scope.result}.`,
    `Reviewer agreement: ${reviewerAgreement}.`,
    TA14_ACADEMY_AUTHORITY_REVIEW_BOUNDARY,
  ].join(" ");
}

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isOneOf<
  T extends readonly string[],
>(
  value: unknown,
  allowed: T,
): value is T[number] {
  return (
    typeof value === "string" &&
    allowed.includes(
      value as T[number],
    )
  );
}

function isContentHash(
  value: unknown,
): value is ContentHash {
  return (
    typeof value === "string" &&
    /^sha256:[a-fA-F0-9]{64}$/.test(value)
  );
}

function isDateTime(
  value: unknown,
): value is ISODateTimeString {
  return (
    typeof value === "string" &&
    value.includes("T") &&
    Number.isFinite(Date.parse(value))
  );
}

function requiredString(
  value: unknown,
  path: string,
  issues:
    AuthorityValidationIssue[],
): void {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
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
  guard:
    (value: unknown) => value is T,
  issues:
    AuthorityValidationIssue[],
): void {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every(guard)
  ) {
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
  issues:
    AuthorityValidationIssue[],
  path: string,
  code: AuthorityValidationCode,
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
): AuthorityValidationResult<T> {
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
  issues:
    AuthorityValidationIssue[],
): AuthorityValidationResult<T> {
  const ok =
    !issues.some(
      (issue) =>
        issue.severity === "error",
    );

  return {
    ok,
    value: ok ? value : undefined,
    issues,
  };
}

function stableStringify(
  value: JsonValue,
): string {
  return JSON.stringify(
    sortJson(value),
  );
}

function sortJson(
  value: JsonValue,
): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }

  if (isObject(value)) {
    const result:
      Record<string, JsonValue> = {};

    for (
      const key of Object.keys(value).sort()
    ) {
      result[key] =
        sortJson(
          value[key] as JsonValue,
        );
    }

    return result;
  }

  return value;
}

function deterministicHex(
  value: string,
): string {
  let a = 0x9e3779b9;
  let b = 0x85ebca6b;
  let c = 0xc2b2ae35;
  let d = 0x27d4eb2f;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    const code =
      value.charCodeAt(index);

    a = Math.imul(
      a ^ code,
      0x85ebca6b,
    );
    b = Math.imul(
      b + code,
      0xc2b2ae35,
    );
    c = Math.imul(
      c ^ (code << (index % 8)),
      0x27d4eb2f,
    );
    d = Math.imul(
      d + (code ^ index),
      0x165667b1,
    );
  }

  return [
    a,
    b,
    c,
    d,
    a ^ c,
    b ^ d,
    a ^ b,
    c ^ d,
  ]
    .map((part) =>
      (part >>> 0)
        .toString(16)
        .padStart(8, "0"),
    )
    .join("")
    .slice(0, 64);
}

/* ========================================================================== *
 * Default export
 * ========================================================================== */

const authorityReviewContracts = {
  engineId:
    TA14_ACADEMY_AUTHORITY_REVIEW_ENGINE_ID,

  engineVersion:
    TA14_ACADEMY_AUTHORITY_REVIEW_ENGINE_VERSION,

  boundary:
    TA14_ACADEMY_AUTHORITY_REVIEW_BOUNDARY,

  reviewStates:
    AUTHORITY_REVIEW_STATES,

  requestTypes:
    AUTHORITY_REQUEST_TYPES,

  grantTypes:
    AUTHORITY_GRANT_TYPES,

  decisions:
    AUTHORITY_DECISIONS,

  validateAuthorityDefinition,
  validateAuthorityReviewRequest,
  validateAuthorityGrant,

  evaluateCredentialEligibility,
  evaluateAuthorityEligibility,
  reviewConflictDeclaration,
  reviewCompetence,
  reviewAuthorityScope,
  decideAuthorityReview,
  issueAuthorityGrant,

  constrainAuthorityGrant,
  holdAuthorityGrant,
  revokeAuthorityGrant,
  expireAuthorityGrant,

  checkAssignmentEligibility,
  createAuthorityRevalidationAction,
  projectPublicAuthority,

  InMemoryAuthorityDefinitionRepository,
  InMemoryAuthorityReviewRequestRepository,
  InMemoryAuthorityDecisionRepository,
  InMemoryAuthorityGrantRepository,

  AcademyAuthorityReviewService,

  reviewerAuthorityDefinition,
  createDeterministicAuthorityDependencies,
  runAuthorityEngineSelfCheck,
};

export default authorityReviewContracts;
