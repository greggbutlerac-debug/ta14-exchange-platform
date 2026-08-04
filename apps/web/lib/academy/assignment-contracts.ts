/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * ACD-008 — Assignment Contracts
 *
 * Create:
 *   apps/web/lib/academy/assignment-contracts.ts
 *
 * Purpose:
 *   Govern the transition from bounded institutional authority into
 *   attributable, scoped, time-limited institutional work.
 *
 * Constitutional boundaries:
 *   Authority != Assignment
 *   Assignment != Determination
 *   Determination != Registry Publication
 *   Registry Publication != Execution Artifact
 */

import type {
  AuthorityState,
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
  TA14_ACADEMY_OPERATING_PRINCIPLE,
  deepFreeze,
  isInstitutionalRecordType,
  isInstitutionalRole,
} from "./lesson-contracts";

import type {
  AcademyEventActor,
  AcademyEventAuthority,
  AcademyEventRecordRef,
  AcademyEventService,
} from "./academy-events";

import type {
  AssignmentEligibilityCheck,
  AuthorityGrant,
  AuthorityGrantType,
  AuthorityScopeRule,
  AuthorityRestriction,
} from "./authority-review-contracts";

/* ========================================================================== *
 * Engine identity
 * ========================================================================== */

export const TA14_ACADEMY_ASSIGNMENT_ENGINE_VERSION = "3.0" as const;

export const TA14_ACADEMY_ASSIGNMENT_ENGINE_ID =
  "TA14-ACD-ASSIGNMENT-ENGINE-000001" as const;

export const TA14_ACADEMY_ASSIGNMENT_BOUNDARY =
  "An assignment authorizes only the bounded institutional work described in the assignment record. It does not itself create a finding, determination, Registry publication, execution artifact, or runtime execution effect." as const;

/* ========================================================================== *
 * Canonical states and enums
 * ========================================================================== */

export const ASSIGNMENT_STATES = [
  "draft",
  "requested",
  "screening",
  "eligible",
  "conditionally_eligible",
  "offered",
  "accepted",
  "in_progress",
  "held",
  "suspended",
  "returned_for_correction",
  "completed",
  "declined",
  "withdrawn",
  "expired",
  "transferred",
  "revoked",
  "superseded",
] as const;

export type AssignmentState =
  (typeof ASSIGNMENT_STATES)[number];

export const ASSIGNMENT_TYPES = [
  "review",
  "registry_review",
  "artifact_stewardship",
  "academy_assessment_review",
  "credential_review",
  "authority_review",
  "continuity_review",
  "public_record_review",
  "environmental_review",
  "standards_review",
  "law_review",
  "research_review",
  "technical_administration",
] as const;

export type AssignmentType =
  (typeof ASSIGNMENT_TYPES)[number];

export const ASSIGNMENT_PRIORITY_LEVELS = [
  "low",
  "normal",
  "high",
  "critical",
] as const;

export type AssignmentPriority =
  (typeof ASSIGNMENT_PRIORITY_LEVELS)[number];

export const ASSIGNMENT_DECISIONS = [
  "OFFER",
  "HOLD",
  "DENY",
  "ESCALATE",
  "RETURN_FOR_CORRECTION",
] as const;

export type AssignmentDecision =
  (typeof ASSIGNMENT_DECISIONS)[number];

export const ASSIGNMENT_TRANSFER_STATES = [
  "requested",
  "screening",
  "approved",
  "denied",
  "completed",
  "cancelled",
] as const;

export type AssignmentTransferState =
  (typeof ASSIGNMENT_TRANSFER_STATES)[number];

export const ASSIGNMENT_COMPLETION_STATES = [
  "not_started",
  "in_progress",
  "submitted",
  "accepted",
  "returned_for_correction",
  "rejected",
] as const;

export type AssignmentCompletionState =
  (typeof ASSIGNMENT_COMPLETION_STATES)[number];

export const SEPARATION_OF_DUTY_RULE_TYPES = [
  "requester_cannot_review",
  "evidence_submitter_cannot_decide",
  "credential_issuer_cannot_grant_authority",
  "authority_grantor_cannot_self_assign",
  "reviewer_cannot_publish_registry",
  "artifact_steward_cannot_verify_own_artifact",
  "conflicted_actor_cannot_participate",
  "custom",
] as const;

export type SeparationOfDutyRuleType =
  (typeof SEPARATION_OF_DUTY_RULE_TYPES)[number];

/* ========================================================================== *
 * Core assignment definitions
 * ========================================================================== */

export interface AssignmentDefinition {
  readonly assignmentDefinitionId: InstitutionalIdentifier;
  readonly assignmentType: AssignmentType;
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly active: boolean;

  readonly requiredAuthorityGrantTypes: readonly AuthorityGrantType[];
  readonly allowedRoles: readonly InstitutionalRole[];
  readonly allowedRecordTypes: readonly InstitutionalRecordType[];
  readonly allowedActionTypes: readonly string[];

  readonly requiredScopeDimensions: readonly string[];
  readonly defaultRestrictions: readonly AssignmentRestriction[];
  readonly separationOfDutyRules: readonly SeparationOfDutyRule[];
  readonly workloadPolicy: AssignmentWorkloadPolicy;
  readonly timingPolicy: AssignmentTimingPolicy;
  readonly acceptancePolicy: AssignmentAcceptancePolicy;
  readonly transferPolicy: AssignmentTransferPolicy;
  readonly completionPolicy: AssignmentCompletionPolicy;
  readonly revalidationPolicy: AssignmentRevalidationPolicy;

  readonly publicProjectionAllowed: boolean;
  readonly assignmentBoundary: string;
  readonly nonSubstitutionRule:
    typeof TA14_ACADEMY_NON_SUBSTITUTION_RULE;

  readonly contentHash: ContentHash;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
}

export interface AssignmentRestriction {
  readonly restrictionId: string;
  readonly type:
    | "scope"
    | "organization"
    | "record_type"
    | "action_type"
    | "decision_type"
    | "confidentiality"
    | "publication"
    | "time"
    | "supervision"
    | "dual_review"
    | "panel"
    | "workload"
    | "other";
  readonly title: string;
  readonly description: string;
  readonly blocking: boolean;
  readonly value?: JsonValue;
  readonly expiresAt?: ISODateTimeString;
}

export interface SeparationOfDutyRule {
  readonly ruleId: string;
  readonly type: SeparationOfDutyRuleType;
  readonly title: string;
  readonly description: string;
  readonly blocking: boolean;
  readonly subjectRelationshipTypes: readonly string[];
  readonly actionTypes: readonly string[];
  readonly recordTypes: readonly InstitutionalRecordType[];
}

export interface AssignmentWorkloadPolicy {
  readonly maximumOpenAssignments?: number;
  readonly maximumConcurrentCriticalAssignments?: number;
  readonly maximumWeightedLoad?: number;
  readonly assignmentWeights:
    Readonly<Record<AssignmentPriority, number>>;
  readonly countHeldAssignments: boolean;
  readonly countSuspendedAssignments: boolean;
  readonly overloadDecision:
    | "HOLD"
    | "DENY"
    | "ESCALATE";
}

export interface AssignmentTimingPolicy {
  readonly offerExpiresAfterHours?: number;
  readonly mustStartWithinHours?: number;
  readonly maximumAssignmentDays?: number;
  readonly warningHoursBeforeDue: readonly number[];
  readonly autoExpireOnDueDate: boolean;
  readonly extensionAllowed: boolean;
  readonly extensionRequiresAuthority: boolean;
}

export interface AssignmentAcceptancePolicy {
  readonly explicitAcceptanceRequired: boolean;
  readonly conflictRecheckRequired: boolean;
  readonly authorityRecheckRequired: boolean;
  readonly competenceRecheckRequired: boolean;
  readonly confidentialityAttestationRequired: boolean;
  readonly scopeAttestationRequired: boolean;
  readonly declineReasonRequired: boolean;
}

export interface AssignmentTransferPolicy {
  readonly transferAllowed: boolean;
  readonly transferRequiresReason: boolean;
  readonly receivingActorEligibilityRequired: boolean;
  readonly receivingActorAcceptanceRequired: boolean;
  readonly preservePriorAssignmentHistory: true;
  readonly transferCreatesNewAssignmentRecord: boolean;
  readonly originalAssignmentStateAfterTransfer:
    | "transferred"
    | "revoked"
    | "completed";
}

export interface AssignmentCompletionPolicy {
  readonly completionReportRequired: boolean;
  readonly completionEvidenceRequired: boolean;
  readonly completionReviewRequired: boolean;
  readonly completionReviewerRoles: readonly InstitutionalRole[];
  readonly allowPartialCompletion: boolean;
  readonly completionDoesNotCreateDetermination: true;
  readonly completionDoesNotCreateRegistryEffect: true;
  readonly completionDoesNotCreateArtifactEffect: true;
}

export interface AssignmentRevalidationPolicy {
  readonly triggers: readonly (
    | "authority_change"
    | "authority_expiry"
    | "credential_change"
    | "credential_expiry"
    | "conflict_change"
    | "competence_change"
    | "scope_change"
    | "record_change"
    | "organization_change"
    | "jurisdiction_change"
    | "law_change"
    | "standard_change"
    | "material_fact_change"
  )[];
  readonly criticalTriggersHoldAssignment: boolean;
  readonly mayRequireTransfer: boolean;
  readonly mayRequireScopeReduction: boolean;
  readonly mayRequireReacceptance: boolean;
  readonly preserveHistoricalAssignment: true;
}

/* ========================================================================== *
 * Requests, offers, acceptance, and lifecycle
 * ========================================================================== */

export interface AssignmentRequest {
  readonly requestId: InstitutionalIdentifier;
  readonly assignmentDefinitionId: InstitutionalIdentifier;
  readonly assignmentType: AssignmentType;

  readonly requestedBySubjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly targetRecordId: InstitutionalIdentifier;
  readonly targetRecordType: InstitutionalRecordType;
  readonly requestedActionTypes: readonly string[];

  readonly preferredSubjectIds: readonly InstitutionalIdentifier[];
  readonly excludedSubjectIds: readonly InstitutionalIdentifier[];

  readonly priority: AssignmentPriority;
  readonly requestedScope: readonly AuthorityScopeRule[];
  readonly requestedRestrictions: readonly AssignmentRestriction[];

  readonly requiredBy?: ISODateTimeString;
  readonly assignmentReason: string;
  readonly confidentialityClass:
    | "public"
    | "controlled"
    | "confidential"
    | "mixed";

  readonly state:
    | "draft"
    | "submitted"
    | "screening"
    | "offered"
    | "held"
    | "denied"
    | "withdrawn";

  readonly correlationId: CorrelationIdentifier;
  readonly createdAt: ISODateTimeString;
  readonly updatedAt: ISODateTimeString;
}

export interface AssignmentCandidate {
  readonly subjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly role: InstitutionalRole;
  readonly authorityGrantIds: readonly InstitutionalIdentifier[];
  readonly credentialIds: readonly InstitutionalIdentifier[];
  readonly openAssignmentCount: number;
  readonly criticalAssignmentCount: number;
  readonly weightedLoad: number;
  readonly conflictCurrent: boolean;
  readonly competenceCurrent: boolean;
  readonly available: boolean;
}

export interface AssignmentCandidateEvaluation {
  readonly evaluationId: InstitutionalIdentifier;
  readonly requestId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly eligible: boolean;
  readonly conditionallyEligible: boolean;

  readonly authorityChecks:
    readonly AssignmentEligibilityCheck[];
  readonly separationOfDutyFindings:
    readonly SeparationOfDutyFinding[];
  readonly workloadFinding: AssignmentWorkloadFinding;
  readonly conflictCurrent: boolean;
  readonly competenceCurrent: boolean;
  readonly availabilityCurrent: boolean;

  readonly reasons: readonly string[];
  readonly restrictions: readonly AssignmentRestriction[];
  readonly evaluatedAt: ISODateTimeString;
}

export interface SeparationOfDutyFinding {
  readonly ruleId: string;
  readonly ruleType: SeparationOfDutyRuleType;
  readonly passed: boolean;
  readonly blocking: boolean;
  readonly description: string;
  readonly relatedSubjectIds: readonly InstitutionalIdentifier[];
  readonly relatedRecordIds: readonly InstitutionalIdentifier[];
}

export interface AssignmentWorkloadFinding {
  readonly withinOpenAssignmentLimit: boolean;
  readonly withinCriticalAssignmentLimit: boolean;
  readonly withinWeightedLoadLimit: boolean;
  readonly currentOpenAssignments: number;
  readonly currentCriticalAssignments: number;
  readonly currentWeightedLoad: number;
  readonly projectedWeightedLoad: number;
  readonly result:
    | "acceptable"
    | "conditionally_acceptable"
    | "overloaded";
  readonly limitations: readonly string[];
}

export interface AssignmentOffer {
  readonly offerId: InstitutionalIdentifier;
  readonly requestId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly candidateEvaluationId: InstitutionalIdentifier;

  readonly offeredScope: readonly AuthorityScopeRule[];
  readonly restrictions: readonly AssignmentRestriction[];
  readonly priority: AssignmentPriority;

  readonly offeredAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly state:
    | "offered"
    | "accepted"
    | "declined"
    | "expired"
    | "withdrawn";

  readonly issuedBySubjectId: InstitutionalIdentifier;
  readonly correlationId: CorrelationIdentifier;
}

export interface AssignmentAcceptance {
  readonly acceptanceId: InstitutionalIdentifier;
  readonly offerId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly accepted: boolean;
  readonly acceptedAt?: ISODateTimeString;
  readonly declinedAt?: ISODateTimeString;
  readonly declineReason?: string;

  readonly conflictRechecked: boolean;
  readonly authorityRechecked: boolean;
  readonly competenceRechecked: boolean;
  readonly confidentialityAttested: boolean;
  readonly scopeAttested: boolean;

  readonly attestations: readonly AssignmentAttestation[];
  readonly limitations: readonly string[];
}

export interface AssignmentAttestation {
  readonly attestationId: InstitutionalIdentifier;
  readonly type:
    | "conflict"
    | "scope"
    | "confidentiality"
    | "authority"
    | "competence"
    | "continuity"
    | "other";
  readonly statement: string;
  readonly attestedBySubjectId: InstitutionalIdentifier;
  readonly attestedAt: ISODateTimeString;
  readonly integrityHash?: ContentHash;
}

/* ========================================================================== *
 * Assignment record
 * ========================================================================== */

export interface InstitutionalAssignment {
  readonly assignmentId: InstitutionalIdentifier;
  readonly assignmentDefinitionId: InstitutionalIdentifier;
  readonly assignmentType: AssignmentType;

  readonly requestId: InstitutionalIdentifier;
  readonly offerId: InstitutionalIdentifier;
  readonly acceptanceId: InstitutionalIdentifier;

  readonly assignedSubjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;

  readonly targetRecordId: InstitutionalIdentifier;
  readonly targetRecordType: InstitutionalRecordType;
  readonly permittedActionTypes: readonly string[];

  readonly authorityGrantIds: readonly InstitutionalIdentifier[];
  readonly scope: readonly AuthorityScopeRule[];
  readonly restrictions: readonly AssignmentRestriction[];
  readonly priority: AssignmentPriority;

  readonly state: AssignmentState;
  readonly completionState: AssignmentCompletionState;

  readonly assignedBySubjectId: InstitutionalIdentifier;
  readonly assignedAt: ISODateTimeString;
  readonly acceptedAt: ISODateTimeString;
  readonly startedAt?: ISODateTimeString;
  readonly dueAt?: ISODateTimeString;
  readonly completedAt?: ISODateTimeString;
  readonly heldAt?: ISODateTimeString;
  readonly suspendedAt?: ISODateTimeString;
  readonly expiredAt?: ISODateTimeString;
  readonly transferredAt?: ISODateTimeString;
  readonly revokedAt?: ISODateTimeString;

  readonly completionReport?: AssignmentCompletionReport;
  readonly priorAssignmentId?: InstitutionalIdentifier;
  readonly supersededByAssignmentId?: InstitutionalIdentifier;

  readonly assignmentCreatedDetermination: false;
  readonly assignmentCreatedRegistryEffect: false;
  readonly assignmentCreatedArtifactEffect: false;
  readonly assignmentCreatedExecution: false;

  readonly correlationId: CorrelationIdentifier;
  readonly integrityHash: ContentHash;
}

export interface AssignmentCompletionReport {
  readonly reportId: InstitutionalIdentifier;
  readonly assignmentId: InstitutionalIdentifier;
  readonly submittedBySubjectId: InstitutionalIdentifier;
  readonly submittedAt: ISODateTimeString;

  readonly summary: string;
  readonly workPerformed: readonly string[];
  readonly recordRefs: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly limitations: readonly string[];
  readonly unresolvedIssues: readonly string[];

  readonly findingIds: readonly InstitutionalIdentifier[];
  readonly determinationIds: readonly InstitutionalIdentifier[];

  readonly state: AssignmentCompletionState;
  readonly reviewedBySubjectIds: readonly InstitutionalIdentifier[];
  readonly reviewedAt?: ISODateTimeString;

  readonly createdDetermination: false;
  readonly createdRegistryEffect: false;
  readonly createdArtifactEffect: false;
}

/* ========================================================================== *
 * Transfer, hold, suspension, and revalidation
 * ========================================================================== */

export interface AssignmentTransferRequest {
  readonly transferRequestId: InstitutionalIdentifier;
  readonly assignmentId: InstitutionalIdentifier;
  readonly requestedBySubjectId: InstitutionalIdentifier;
  readonly requestedAt: ISODateTimeString;
  readonly reason: string;
  readonly proposedReceivingSubjectId?: InstitutionalIdentifier;
  readonly state: AssignmentTransferState;
  readonly limitations: readonly string[];
}

export interface AssignmentTransferDecision {
  readonly transferDecisionId: InstitutionalIdentifier;
  readonly transferRequestId: InstitutionalIdentifier;
  readonly decision:
    | "ALLOW"
    | "HOLD"
    | "DENY"
    | "ESCALATE";
  readonly rationale: string;
  readonly receivingCandidateEvaluationId?: InstitutionalIdentifier;
  readonly decidedBySubjectIds: readonly InstitutionalIdentifier[];
  readonly decidedAt: ISODateTimeString;
}

export interface AssignmentRevalidationAction {
  readonly revalidationActionId: InstitutionalIdentifier;
  readonly assignmentId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly triggerType:
    AssignmentDefinition["revalidationPolicy"]["triggers"][number];
  readonly severity:
    | "low"
    | "moderate"
    | "high"
    | "critical";
  readonly requiredAction:
    | "review"
    | "reaccept"
    | "scope_reduction"
    | "hold"
    | "suspend"
    | "transfer"
    | "revoke";
  readonly priorState: AssignmentState;
  readonly newState: AssignmentState;
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

export type AssignmentValidationCode =
  | "required"
  | "invalid_type"
  | "invalid_value"
  | "invalid_state"
  | "invalid_hash"
  | "invalid_date"
  | "invalid_role"
  | "invalid_record_type"
  | "missing_authority"
  | "authority_not_current"
  | "scope_mismatch"
  | "separation_of_duty_violation"
  | "workload_exceeded"
  | "conflict_not_current"
  | "competence_not_current"
  | "offer_expired"
  | "acceptance_incomplete"
  | "assignment_created_determination"
  | "assignment_created_registry_effect"
  | "assignment_created_artifact_effect"
  | "assignment_created_execution";

export interface AssignmentValidationIssue {
  readonly path: string;
  readonly code: AssignmentValidationCode;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly received?: unknown;
  readonly expected?: string;
}

export interface AssignmentValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly issues: readonly AssignmentValidationIssue[];
}

export class AssignmentContractValidationError extends Error {
  readonly issues: readonly AssignmentValidationIssue[];

  constructor(
    message: string,
    issues: readonly AssignmentValidationIssue[],
  ) {
    super(message);
    this.name = "AssignmentContractValidationError";
    this.issues = issues;
  }
}

export function validateAssignmentDefinition(
  input: unknown,
): AssignmentValidationResult<AssignmentDefinition> {
  const issues: AssignmentValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Assignment definition must be an object.",
      input,
    );
  }

  requiredString(
    input.assignmentDefinitionId,
    "$.assignmentDefinitionId",
    issues,
  );
  requiredString(input.title, "$.title", issues);
  requiredString(input.description, "$.description", issues);
  requiredString(input.version, "$.version", issues);
  requiredString(
    input.assignmentBoundary,
    "$.assignmentBoundary",
    issues,
  );

  if (!isOneOf(input.assignmentType, ASSIGNMENT_TYPES)) {
    pushIssue(
      issues,
      "$.assignmentType",
      "invalid_value",
      "Unsupported assignment type.",
      input.assignmentType,
    );
  }

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
    input as unknown as AssignmentDefinition,
    issues,
  );
}

export function validateInstitutionalAssignment(
  input: unknown,
): AssignmentValidationResult<InstitutionalAssignment> {
  const issues: AssignmentValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Institutional assignment must be an object.",
      input,
    );
  }

  requiredString(
    input.assignmentId,
    "$.assignmentId",
    issues,
  );
  requiredString(
    input.assignedSubjectId,
    "$.assignedSubjectId",
    issues,
  );
  requiredString(
    input.targetRecordId,
    "$.targetRecordId",
    issues,
  );
  requiredString(
    input.correlationId,
    "$.correlationId",
    issues,
  );

  if (!isOneOf(input.state, ASSIGNMENT_STATES)) {
    pushIssue(
      issues,
      "$.state",
      "invalid_state",
      "Unsupported assignment state.",
      input.state,
    );
  }

  if (
    !isInstitutionalRecordType(
      input.targetRecordType,
    )
  ) {
    pushIssue(
      issues,
      "$.targetRecordType",
      "invalid_record_type",
      "Unsupported target record type.",
      input.targetRecordType,
    );
  }

  const hardFalseFields = [
    "assignmentCreatedDetermination",
    "assignmentCreatedRegistryEffect",
    "assignmentCreatedArtifactEffect",
    "assignmentCreatedExecution",
  ] as const;

  for (const field of hardFalseFields) {
    if (input[field] !== false) {
      pushIssue(
        issues,
        `$.${field}`,
        field === "assignmentCreatedDetermination"
          ? "assignment_created_determination"
          : field === "assignmentCreatedRegistryEffect"
            ? "assignment_created_registry_effect"
            : field === "assignmentCreatedArtifactEffect"
              ? "assignment_created_artifact_effect"
              : "assignment_created_execution",
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
      "Invalid assignment integrity hash.",
      input.integrityHash,
    );
  }

  return completeValidation(
    input as unknown as InstitutionalAssignment,
    issues,
  );
}

/* ========================================================================== *
 * Candidate evaluation
 * ========================================================================== */

export interface AssignmentCandidateEvaluationInput {
  readonly evaluationId: InstitutionalIdentifier;
  readonly definition: AssignmentDefinition;
  readonly request: AssignmentRequest;
  readonly candidate: AssignmentCandidate;
  readonly authorityGrants: readonly AuthorityGrant[];
  readonly authorityChecks: readonly AssignmentEligibilityCheck[];
  readonly relationshipFacts:
    readonly AssignmentRelationshipFact[];
  readonly evaluatedAt: ISODateTimeString;
}

export interface AssignmentRelationshipFact {
  readonly factId: string;
  readonly subjectId: InstitutionalIdentifier;
  readonly relatedSubjectId?: InstitutionalIdentifier;
  readonly relatedRecordId?: InstitutionalIdentifier;
  readonly relationshipType: string;
  readonly actionType?: string;
  readonly material: boolean;
}

export function evaluateAssignmentCandidate(
  input: AssignmentCandidateEvaluationInput,
): AssignmentCandidateEvaluation {
  const reasons: string[] = [];
  const restrictions: AssignmentRestriction[] = [];

  const authorityChecks = input.authorityChecks;
  const hasEligibleAuthority =
    authorityChecks.some(
      (check) =>
        check.state === "eligible" ||
        check.state === "conditionally_eligible",
    );

  if (!hasEligibleAuthority) {
    reasons.push(
      "No current authority grant satisfies the requested assignment.",
    );
  }

  const separationFindings =
    evaluateSeparationOfDuty(
      input.definition.separationOfDutyRules,
      input.candidate.subjectId,
      input.request,
      input.relationshipFacts,
    );

  const blockingSeparationViolation =
    separationFindings.some(
      (finding) =>
        !finding.passed && finding.blocking,
    );

  if (blockingSeparationViolation) {
    reasons.push(
      "A blocking separation-of-duty rule was violated.",
    );
  }

  const workloadFinding =
    evaluateWorkload(
      input.definition.workloadPolicy,
      input.candidate,
      input.request.priority,
    );

  if (workloadFinding.result === "overloaded") {
    reasons.push(
      "Candidate workload exceeds assignment policy.",
    );
  }

  if (!input.candidate.conflictCurrent) {
    reasons.push(
      "Conflict review is not current.",
    );
  }

  if (!input.candidate.competenceCurrent) {
    reasons.push(
      "Competence status is not current.",
    );
  }

  if (!input.candidate.available) {
    reasons.push(
      "Candidate is not currently available.",
    );
  }

  const eligible =
    hasEligibleAuthority &&
    !blockingSeparationViolation &&
    workloadFinding.result !== "overloaded" &&
    input.candidate.conflictCurrent &&
    input.candidate.competenceCurrent &&
    input.candidate.available;

  const conditionallyEligible =
    !eligible &&
    hasEligibleAuthority &&
    !blockingSeparationViolation &&
    workloadFinding.result ===
      "conditionally_acceptable" &&
    input.candidate.conflictCurrent &&
    input.candidate.competenceCurrent &&
    input.candidate.available;

  if (conditionallyEligible) {
    restrictions.push({
      restrictionId:
        `TA14-ASG-RESTR-WORKLOAD-${input.evaluationId}`,
      type: "workload",
      title: "Conditional workload restriction",
      description:
        "Assignment may proceed only with workload reduction or supervisory approval.",
      blocking: true,
      value: {
        projectedWeightedLoad:
          workloadFinding.projectedWeightedLoad,
      },
    });
  }

  return deepFreeze({
    evaluationId: input.evaluationId,
    requestId: input.request.requestId,
    subjectId: input.candidate.subjectId,
    eligible,
    conditionallyEligible,
    authorityChecks,
    separationOfDutyFindings:
      separationFindings,
    workloadFinding,
    conflictCurrent:
      input.candidate.conflictCurrent,
    competenceCurrent:
      input.candidate.competenceCurrent,
    availabilityCurrent:
      input.candidate.available,
    reasons,
    restrictions,
    evaluatedAt: input.evaluatedAt,
  });
}

export function evaluateSeparationOfDuty(
  rules: readonly SeparationOfDutyRule[],
  candidateSubjectId: InstitutionalIdentifier,
  request: AssignmentRequest,
  facts: readonly AssignmentRelationshipFact[],
): readonly SeparationOfDutyFinding[] {
  return deepFreeze(
    rules.map((rule) => {
      const related = facts.filter(
        (fact) =>
          fact.subjectId === candidateSubjectId &&
          fact.material,
      );

      const violated =
        related.some((fact) =>
          rule.subjectRelationshipTypes.includes(
            fact.relationshipType,
          ),
        );

      return {
        ruleId: rule.ruleId,
        ruleType: rule.type,
        passed: !violated,
        blocking: rule.blocking,
        description: violated
          ? `Candidate violates separation-of-duty rule: ${rule.description}`
          : `Candidate satisfies separation-of-duty rule: ${rule.description}`,
        relatedSubjectIds: related
          .map((fact) => fact.relatedSubjectId)
          .filter(
            (
              value,
            ): value is InstitutionalIdentifier =>
              Boolean(value),
          ),
        relatedRecordIds: related
          .map((fact) => fact.relatedRecordId)
          .filter(
            (
              value,
            ): value is InstitutionalIdentifier =>
              Boolean(value),
          ),
      };
    }),
  );
}

export function evaluateWorkload(
  policy: AssignmentWorkloadPolicy,
  candidate: AssignmentCandidate,
  priority: AssignmentPriority,
): AssignmentWorkloadFinding {
  const assignmentWeight =
    policy.assignmentWeights[priority] ?? 1;

  const projectedWeightedLoad =
    candidate.weightedLoad + assignmentWeight;

  const withinOpenAssignmentLimit =
    policy.maximumOpenAssignments === undefined ||
    candidate.openAssignmentCount + 1 <=
      policy.maximumOpenAssignments;

  const withinCriticalAssignmentLimit =
    priority !== "critical" ||
    policy.maximumConcurrentCriticalAssignments ===
      undefined ||
    candidate.criticalAssignmentCount + 1 <=
      policy.maximumConcurrentCriticalAssignments;

  const withinWeightedLoadLimit =
    policy.maximumWeightedLoad === undefined ||
    projectedWeightedLoad <=
      policy.maximumWeightedLoad;

  const result:
    AssignmentWorkloadFinding["result"] =
    withinOpenAssignmentLimit &&
    withinCriticalAssignmentLimit &&
    withinWeightedLoadLimit
      ? "acceptable"
      : withinWeightedLoadLimit &&
          withinOpenAssignmentLimit
        ? "conditionally_acceptable"
        : "overloaded";

  return deepFreeze({
    withinOpenAssignmentLimit,
    withinCriticalAssignmentLimit,
    withinWeightedLoadLimit,
    currentOpenAssignments:
      candidate.openAssignmentCount,
    currentCriticalAssignments:
      candidate.criticalAssignmentCount,
    currentWeightedLoad:
      candidate.weightedLoad,
    projectedWeightedLoad,
    result,
    limitations:
      result === "acceptable"
        ? []
        : [
            "Workload conditions must be resolved before unrestricted assignment.",
          ],
  });
}

/* ========================================================================== *
 * Offer, acceptance, and assignment creation
 * ========================================================================== */

export function createAssignmentOffer(
  input: {
    readonly offerId: InstitutionalIdentifier;
    readonly request: AssignmentRequest;
    readonly evaluation:
      AssignmentCandidateEvaluation;
    readonly issuedBySubjectId:
      InstitutionalIdentifier;
    readonly offerExpiresAt?:
      ISODateTimeString;
    readonly now:
      ISODateTimeString;
  },
): AssignmentOffer {
  if (
    !input.evaluation.eligible &&
    !input.evaluation.conditionallyEligible
  ) {
    throw new Error(
      "Assignment offer cannot be created for an ineligible candidate.",
    );
  }

  return deepFreeze({
    offerId: input.offerId,
    requestId: input.request.requestId,
    subjectId:
      input.evaluation.subjectId,
    candidateEvaluationId:
      input.evaluation.evaluationId,
    offeredScope:
      input.request.requestedScope,
    restrictions: [
      ...input.request.requestedRestrictions,
      ...input.evaluation.restrictions,
    ],
    priority: input.request.priority,
    offeredAt: input.now,
    expiresAt:
      input.offerExpiresAt,
    state: "offered",
    issuedBySubjectId:
      input.issuedBySubjectId,
    correlationId:
      input.request.correlationId,
  });
}

export function acceptAssignmentOffer(
  input: {
    readonly acceptanceId:
      InstitutionalIdentifier;
    readonly offer:
      AssignmentOffer;
    readonly definition:
      AssignmentDefinition;
    readonly subjectId:
      InstitutionalIdentifier;
    readonly conflictRechecked:
      boolean;
    readonly authorityRechecked:
      boolean;
    readonly competenceRechecked:
      boolean;
    readonly confidentialityAttested:
      boolean;
    readonly scopeAttested:
      boolean;
    readonly attestations:
      readonly AssignmentAttestation[];
    readonly now:
      ISODateTimeString;
  },
): AssignmentAcceptance {
  if (
    input.offer.subjectId !==
    input.subjectId
  ) {
    throw new Error(
      "Assignment offer may only be accepted by the offered subject.",
    );
  }

  if (
    input.offer.expiresAt &&
    Date.parse(input.now) >
      Date.parse(input.offer.expiresAt)
  ) {
    throw new Error(
      "Assignment offer has expired.",
    );
  }

  const policy =
    input.definition.acceptancePolicy;

  const incomplete =
    (policy.conflictRecheckRequired &&
      !input.conflictRechecked) ||
    (policy.authorityRecheckRequired &&
      !input.authorityRechecked) ||
    (policy.competenceRecheckRequired &&
      !input.competenceRechecked) ||
    (policy.confidentialityAttestationRequired &&
      !input.confidentialityAttested) ||
    (policy.scopeAttestationRequired &&
      !input.scopeAttested);

  if (incomplete) {
    throw new Error(
      "Assignment acceptance requirements are incomplete.",
    );
  }

  return deepFreeze({
    acceptanceId:
      input.acceptanceId,
    offerId: input.offer.offerId,
    subjectId: input.subjectId,
    accepted: true,
    acceptedAt: input.now,
    conflictRechecked:
      input.conflictRechecked,
    authorityRechecked:
      input.authorityRechecked,
    competenceRechecked:
      input.competenceRechecked,
    confidentialityAttested:
      input.confidentialityAttested,
    scopeAttested:
      input.scopeAttested,
    attestations:
      [...input.attestations],
    limitations: [
      TA14_ACADEMY_ASSIGNMENT_BOUNDARY,
    ],
  });
}

export async function createInstitutionalAssignment(
  input: {
    readonly assignmentId:
      InstitutionalIdentifier;
    readonly definition:
      AssignmentDefinition;
    readonly request:
      AssignmentRequest;
    readonly offer:
      AssignmentOffer;
    readonly acceptance:
      AssignmentAcceptance;
    readonly authorityGrantIds:
      readonly InstitutionalIdentifier[];
    readonly assignedBySubjectId:
      InstitutionalIdentifier;
    readonly now:
      ISODateTimeString;
    readonly hashCanonicalValue:
      (value: JsonValue) =>
        Promise<ContentHash> | ContentHash;
  },
): Promise<InstitutionalAssignment> {
  if (!input.acceptance.accepted) {
    throw new Error(
      "Assignment cannot be created without accepted offer.",
    );
  }

  const maximumDays =
    input.definition.timingPolicy
      .maximumAssignmentDays;

  const dueAt =
    input.request.requiredBy ??
    (maximumDays !== undefined
      ? new Date(
          Date.parse(input.now) +
            maximumDays * 86_400_000,
        ).toISOString()
      : undefined);

  const base = {
    assignmentId:
      input.assignmentId,
    assignmentDefinitionId:
      input.definition.assignmentDefinitionId,
    assignmentType:
      input.definition.assignmentType,
    requestId:
      input.request.requestId,
    offerId:
      input.offer.offerId,
    acceptanceId:
      input.acceptance.acceptanceId,
    assignedSubjectId:
      input.acceptance.subjectId,
    organizationId:
      input.offer.organizationId,
    targetRecordId:
      input.request.targetRecordId,
    targetRecordType:
      input.request.targetRecordType,
    permittedActionTypes:
      input.request.requestedActionTypes,
    authorityGrantIds:
      [...input.authorityGrantIds],
    scope:
      input.offer.offeredScope,
    restrictions:
      input.offer.restrictions,
    priority:
      input.offer.priority,
    state: "accepted" as const,
    completionState:
      "not_started" as const,
    assignedBySubjectId:
      input.assignedBySubjectId,
    assignedAt:
      input.now,
    acceptedAt:
      input.acceptance.acceptedAt ??
      input.now,
    dueAt,
    assignmentCreatedDetermination:
      false as const,
    assignmentCreatedRegistryEffect:
      false as const,
    assignmentCreatedArtifactEffect:
      false as const,
    assignmentCreatedExecution:
      false as const,
    correlationId:
      input.request.correlationId,
  };

  const integrityHash =
    await input.hashCanonicalValue(
      base as unknown as JsonValue,
    );

  const assignment:
    InstitutionalAssignment = {
    ...base,
    integrityHash,
  };

  const validation =
    validateInstitutionalAssignment(
      assignment,
    );

  if (!validation.ok) {
    throw new AssignmentContractValidationError(
      "Institutional assignment failed validation.",
      validation.issues,
    );
  }

  return deepFreeze(assignment);
}

/* ========================================================================== *
 * Lifecycle functions
 * ========================================================================== */

export function startAssignment(
  assignment: InstitutionalAssignment,
  now: ISODateTimeString,
): InstitutionalAssignment {
  if (
    assignment.state !== "accepted"
  ) {
    throw new Error(
      `Assignment ${assignment.assignmentId} cannot start from state ${assignment.state}.`,
    );
  }

  return deepFreeze({
    ...assignment,
    state: "in_progress",
    completionState: "in_progress",
    startedAt: now,
  });
}

export function holdAssignment(
  assignment: InstitutionalAssignment,
  reason: string,
  now: ISODateTimeString,
): InstitutionalAssignment {
  assertAssignmentMutable(assignment);

  return deepFreeze({
    ...assignment,
    state: "held",
    heldAt: now,
    restrictions: [
      ...assignment.restrictions,
      {
        restrictionId:
          `TA14-ASG-HOLD-${assignment.assignmentId}`,
        type: "other",
        title: "Assignment hold",
        description: reason,
        blocking: true,
      },
    ],
  });
}

export function suspendAssignment(
  assignment: InstitutionalAssignment,
  reason: string,
  now: ISODateTimeString,
): InstitutionalAssignment {
  assertAssignmentMutable(assignment);

  return deepFreeze({
    ...assignment,
    state: "suspended",
    suspendedAt: now,
    restrictions: [
      ...assignment.restrictions,
      {
        restrictionId:
          `TA14-ASG-SUSPEND-${assignment.assignmentId}`,
        type: "other",
        title: "Assignment suspension",
        description: reason,
        blocking: true,
      },
    ],
  });
}

export function expireAssignment(
  assignment: InstitutionalAssignment,
  now: ISODateTimeString,
): InstitutionalAssignment {
  if (
    !assignment.dueAt ||
    Date.parse(now) <
      Date.parse(assignment.dueAt)
  ) {
    return assignment;
  }

  if (
    assignment.state === "completed" ||
    assignment.state === "withdrawn" ||
    assignment.state === "revoked" ||
    assignment.state === "expired"
  ) {
    return assignment;
  }

  return deepFreeze({
    ...assignment,
    state: "expired",
    expiredAt: now,
  });
}

export function revokeAssignment(
  assignment: InstitutionalAssignment,
  reason: string,
  now: ISODateTimeString,
): InstitutionalAssignment {
  if (
    assignment.state === "completed" ||
    assignment.state === "revoked"
  ) {
    throw new Error(
      `Assignment ${assignment.assignmentId} cannot be revoked from state ${assignment.state}.`,
    );
  }

  return deepFreeze({
    ...assignment,
    state: "revoked",
    revokedAt: now,
    restrictions: [
      ...assignment.restrictions,
      {
        restrictionId:
          `TA14-ASG-REVOKE-${assignment.assignmentId}`,
        type: "other",
        title: "Assignment revoked",
        description: reason,
        blocking: true,
      },
    ],
  });
}

export function submitAssignmentCompletion(
  assignment: InstitutionalAssignment,
  report: AssignmentCompletionReport,
): InstitutionalAssignment {
  assertAssignmentMutable(assignment);

  if (
    report.assignmentId !==
    assignment.assignmentId
  ) {
    throw new Error(
      "Completion report does not match assignment.",
    );
  }

  if (
    report.createdDetermination !== false ||
    report.createdRegistryEffect !== false ||
    report.createdArtifactEffect !== false
  ) {
    throw new Error(
      "Completion report may not create determination, Registry, or artifact effect.",
    );
  }

  return deepFreeze({
    ...assignment,
    completionState: "submitted",
    completionReport: report,
  });
}

export function completeAssignment(
  assignment: InstitutionalAssignment,
  reviewedReport: AssignmentCompletionReport,
  now: ISODateTimeString,
): InstitutionalAssignment {
  if (
    reviewedReport.state !== "accepted"
  ) {
    throw new Error(
      "Assignment completion requires an accepted completion report.",
    );
  }

  return deepFreeze({
    ...assignment,
    state: "completed",
    completionState: "accepted",
    completionReport:
      reviewedReport,
    completedAt: now,
  });
}

function assertAssignmentMutable(
  assignment: InstitutionalAssignment,
): void {
  if (
    assignment.state === "completed" ||
    assignment.state === "withdrawn" ||
    assignment.state === "expired" ||
    assignment.state === "revoked" ||
    assignment.state === "superseded"
  ) {
    throw new Error(
      `Assignment ${assignment.assignmentId} is immutable in state ${assignment.state}.`,
    );
  }
}

/* ========================================================================== *
 * Transfer and revalidation
 * ========================================================================== */

export function createAssignmentTransferRequest(
  input: {
    readonly transferRequestId:
      InstitutionalIdentifier;
    readonly assignment:
      InstitutionalAssignment;
    readonly requestedBySubjectId:
      InstitutionalIdentifier;
    readonly reason: string;
    readonly proposedReceivingSubjectId?:
      InstitutionalIdentifier;
    readonly now:
      ISODateTimeString;
  },
): AssignmentTransferRequest {
  if (
    input.assignment.state === "completed" ||
    input.assignment.state === "revoked" ||
    input.assignment.state === "expired"
  ) {
    throw new Error(
      "Terminal assignments cannot be transferred.",
    );
  }

  return deepFreeze({
    transferRequestId:
      input.transferRequestId,
    assignmentId:
      input.assignment.assignmentId,
    requestedBySubjectId:
      input.requestedBySubjectId,
    requestedAt:
      input.now,
    reason:
      input.reason,
    proposedReceivingSubjectId:
      input.proposedReceivingSubjectId,
    state: "requested",
    limitations: [
      "Transfer does not preserve authority or acceptance automatically.",
      "Receiving subject must independently satisfy eligibility and acceptance requirements.",
    ],
  });
}

export function createAssignmentRevalidationAction(
  input: {
    readonly revalidationActionId:
      InstitutionalIdentifier;
    readonly assignment:
      InstitutionalAssignment;
    readonly triggerType:
      AssignmentRevalidationAction["triggerType"];
    readonly severity:
      AssignmentRevalidationAction["severity"];
    readonly requiredAction:
      AssignmentRevalidationAction["requiredAction"];
    readonly dueAt?:
      ISODateTimeString;
    readonly now:
      ISODateTimeString;
  },
): AssignmentRevalidationAction {
  const newState: AssignmentState =
    input.requiredAction === "revoke"
      ? "revoked"
      : input.requiredAction === "suspend"
        ? "suspended"
        : input.requiredAction === "hold" ||
            input.severity === "critical"
          ? "held"
          : input.assignment.state;

  return deepFreeze({
    revalidationActionId:
      input.revalidationActionId,
    assignmentId:
      input.assignment.assignmentId,
    subjectId:
      input.assignment.assignedSubjectId,
    triggerType:
      input.triggerType,
    severity:
      input.severity,
    requiredAction:
      input.requiredAction,
    priorState:
      input.assignment.state,
    newState,
    dueAt:
      input.dueAt,
    createdAt:
      input.now,
    state: "open",
  });
}

/* ========================================================================== *
 * Public projection
 * ========================================================================== */

export interface PublicAssignmentProjection {
  readonly assignmentId:
    InstitutionalIdentifier;
  readonly assignmentType:
    AssignmentType;
  readonly assignedSubjectId:
    InstitutionalIdentifier;
  readonly organizationId?:
    InstitutionalIdentifier;
  readonly targetRecordType:
    InstitutionalRecordType;
  readonly priority:
    AssignmentPriority;
  readonly state:
    AssignmentState;
  readonly assignedAt:
    ISODateTimeString;
  readonly dueAt?:
    ISODateTimeString;
  readonly completedAt?:
    ISODateTimeString;
  readonly scopeSummary:
    readonly string[];
  readonly restrictionSummary:
    readonly string[];
  readonly assignmentBoundary:
    string;
  readonly verificationHash:
    ContentHash;
}

export function projectPublicAssignment(
  definition: AssignmentDefinition,
  assignment: InstitutionalAssignment,
): PublicAssignmentProjection {
  if (!definition.publicProjectionAllowed) {
    throw new Error(
      "Assignment definition does not permit public projection.",
    );
  }

  return deepFreeze({
    assignmentId:
      assignment.assignmentId,
    assignmentType:
      assignment.assignmentType,
    assignedSubjectId:
      assignment.assignedSubjectId,
    organizationId:
      assignment.organizationId,
    targetRecordType:
      assignment.targetRecordType,
    priority:
      assignment.priority,
    state:
      assignment.state,
    assignedAt:
      assignment.assignedAt,
    dueAt:
      assignment.dueAt,
    completedAt:
      assignment.completedAt,
    scopeSummary:
      assignment.scope.map(
        (rule) =>
          `${rule.dimension} ${rule.operator} ${JSON.stringify(rule.value)}`,
      ),
    restrictionSummary:
      assignment.restrictions.map(
        (restriction) =>
          restriction.description,
      ),
    assignmentBoundary:
      TA14_ACADEMY_ASSIGNMENT_BOUNDARY,
    verificationHash:
      assignment.integrityHash,
  });
}

/* ========================================================================== *
 * Repository contracts
 * ========================================================================== */

export interface AssignmentDefinitionRepository {
  getDefinition(
    assignmentDefinitionId:
      InstitutionalIdentifier,
    version?: string,
  ): Promise<AssignmentDefinition | null>;

  getActiveDefinition(
    assignmentType: AssignmentType,
    at?: ISODateTimeString,
  ): Promise<AssignmentDefinition | null>;

  saveDefinition(
    definition: AssignmentDefinition,
  ): Promise<void>;
}

export interface AssignmentRequestRepository {
  getRequest(
    requestId: InstitutionalIdentifier,
  ): Promise<AssignmentRequest | null>;

  saveRequest(
    request: AssignmentRequest,
  ): Promise<void>;
}

export interface AssignmentRepository {
  getAssignment(
    assignmentId: InstitutionalIdentifier,
  ): Promise<InstitutionalAssignment | null>;

  saveAssignment(
    assignment: InstitutionalAssignment,
  ): Promise<void>;

  listOpenAssignmentsForSubject(
    subjectId: InstitutionalIdentifier,
  ): Promise<readonly InstitutionalAssignment[]>;
}

/* ========================================================================== *
 * In-memory repositories
 * ========================================================================== */

export class InMemoryAssignmentDefinitionRepository
  implements AssignmentDefinitionRepository
{
  private readonly values =
    new Map<string, AssignmentDefinition>();

  async getDefinition(
    assignmentDefinitionId:
      InstitutionalIdentifier,
    version?: string,
  ): Promise<AssignmentDefinition | null> {
    if (version) {
      return (
        this.values.get(
          `${assignmentDefinitionId}@${version}`,
        ) ?? null
      );
    }

    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.assignmentDefinitionId ===
            assignmentDefinitionId,
        )
        .sort(
          (a, b) =>
            Date.parse(b.effectiveAt) -
            Date.parse(a.effectiveAt),
        )[0] ?? null
    );
  }

  async getActiveDefinition(
    assignmentType: AssignmentType,
    at = new Date().toISOString(),
  ): Promise<AssignmentDefinition | null> {
    const time = Date.parse(at);

    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.assignmentType ===
              assignmentType &&
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
    definition: AssignmentDefinition,
  ): Promise<void> {
    const validation =
      validateAssignmentDefinition(
        definition,
      );

    if (!validation.ok) {
      throw new AssignmentContractValidationError(
        "Cannot save invalid assignment definition.",
        validation.issues,
      );
    }

    const key =
      `${definition.assignmentDefinitionId}@${definition.version}`;

    if (this.values.has(key)) {
      throw new Error(
        `Assignment definition ${key} already exists.`,
      );
    }

    this.values.set(
      key,
      deepFreeze(definition),
    );
  }
}

export class InMemoryAssignmentRequestRepository
  implements AssignmentRequestRepository
{
  private readonly values =
    new Map<
      InstitutionalIdentifier,
      AssignmentRequest
    >();

  async getRequest(
    requestId: InstitutionalIdentifier,
  ): Promise<AssignmentRequest | null> {
    return this.values.get(requestId) ?? null;
  }

  async saveRequest(
    request: AssignmentRequest,
  ): Promise<void> {
    this.values.set(
      request.requestId,
      deepFreeze(request),
    );
  }
}

export class InMemoryAssignmentRepository
  implements AssignmentRepository
{
  private readonly values =
    new Map<
      InstitutionalIdentifier,
      InstitutionalAssignment
    >();

  async getAssignment(
    assignmentId: InstitutionalIdentifier,
  ): Promise<InstitutionalAssignment | null> {
    return (
      this.values.get(assignmentId) ??
      null
    );
  }

  async saveAssignment(
    assignment: InstitutionalAssignment,
  ): Promise<void> {
    const validation =
      validateInstitutionalAssignment(
        assignment,
      );

    if (!validation.ok) {
      throw new AssignmentContractValidationError(
        "Cannot save invalid assignment.",
        validation.issues,
      );
    }

    this.values.set(
      assignment.assignmentId,
      deepFreeze(assignment),
    );
  }

  async listOpenAssignmentsForSubject(
    subjectId: InstitutionalIdentifier,
  ): Promise<readonly InstitutionalAssignment[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (assignment) =>
            assignment.assignedSubjectId ===
            subjectId,
        )
        .filter(
          (assignment) =>
            ![
              "completed",
              "withdrawn",
              "expired",
              "revoked",
              "superseded",
            ].includes(assignment.state),
        ),
    );
  }
}

/* ========================================================================== *
 * Assignment service
 * ========================================================================== */

export interface AssignmentIdentifierFactory {
  readonly createRequestId:
    () => InstitutionalIdentifier;
  readonly createEvaluationId:
    () => InstitutionalIdentifier;
  readonly createOfferId:
    () => InstitutionalIdentifier;
  readonly createAcceptanceId:
    () => InstitutionalIdentifier;
  readonly createAssignmentId:
    () => InstitutionalIdentifier;
  readonly createTransferRequestId:
    () => InstitutionalIdentifier;
  readonly createTransferDecisionId:
    () => InstitutionalIdentifier;
  readonly createRevalidationActionId:
    () => InstitutionalIdentifier;
}

export interface AssignmentServiceDependencies {
  readonly definitions:
    AssignmentDefinitionRepository;
  readonly requests:
    AssignmentRequestRepository;
  readonly assignments:
    AssignmentRepository;
  readonly ids:
    AssignmentIdentifierFactory;
  readonly now:
    () => ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) =>
      Promise<ContentHash> | ContentHash;
  readonly events?: AcademyEventService;
}

export class AcademyAssignmentService {
  constructor(
    private readonly dependencies:
      AssignmentServiceDependencies,
  ) {}

  async createRequest(
    input: {
      readonly assignmentType:
        AssignmentType;
      readonly requestedBySubjectId:
        InstitutionalIdentifier;
      readonly organizationId?:
        InstitutionalIdentifier;
      readonly targetRecordId:
        InstitutionalIdentifier;
      readonly targetRecordType:
        InstitutionalRecordType;
      readonly requestedActionTypes:
        readonly string[];
      readonly preferredSubjectIds?:
        readonly InstitutionalIdentifier[];
      readonly excludedSubjectIds?:
        readonly InstitutionalIdentifier[];
      readonly priority:
        AssignmentPriority;
      readonly requestedScope:
        readonly AuthorityScopeRule[];
      readonly requestedRestrictions?:
        readonly AssignmentRestriction[];
      readonly requiredBy?:
        ISODateTimeString;
      readonly assignmentReason:
        string;
      readonly confidentialityClass:
        AssignmentRequest["confidentialityClass"];
      readonly correlationId:
        CorrelationIdentifier;
    },
  ): Promise<AssignmentRequest> {
    const definition =
      await this.dependencies.definitions
        .getActiveDefinition(
          input.assignmentType,
          this.dependencies.now(),
        );

    if (!definition) {
      throw new Error(
        `No active assignment definition exists for ${input.assignmentType}.`,
      );
    }

    const now =
      this.dependencies.now();

    const request:
      AssignmentRequest = {
      requestId:
        this.dependencies.ids.createRequestId(),
      assignmentDefinitionId:
        definition.assignmentDefinitionId,
      assignmentType:
        input.assignmentType,
      requestedBySubjectId:
        input.requestedBySubjectId,
      organizationId:
        input.organizationId,
      targetRecordId:
        input.targetRecordId,
      targetRecordType:
        input.targetRecordType,
      requestedActionTypes:
        [...input.requestedActionTypes],
      preferredSubjectIds:
        [...(input.preferredSubjectIds ?? [])],
      excludedSubjectIds:
        [...(input.excludedSubjectIds ?? [])],
      priority:
        input.priority,
      requestedScope:
        [...input.requestedScope],
      requestedRestrictions:
        [...(input.requestedRestrictions ?? [])],
      requiredBy:
        input.requiredBy,
      assignmentReason:
        input.assignmentReason,
      confidentialityClass:
        input.confidentialityClass,
      state:
        "submitted",
      correlationId:
        input.correlationId,
      createdAt:
        now,
      updatedAt:
        now,
    };

    await this.dependencies.requests
      .saveRequest(request);

    return request;
  }

  async createAssignment(
    input: {
      readonly request:
        AssignmentRequest;
      readonly definition:
        AssignmentDefinition;
      readonly candidateEvaluation:
        AssignmentCandidateEvaluation;
      readonly issuedBySubjectId:
        InstitutionalIdentifier;
      readonly authorityGrantIds:
        readonly InstitutionalIdentifier[];
      readonly acceptanceInput:
        Omit<
          Parameters<
            typeof acceptAssignmentOffer
          >[0],
          "offer" | "definition"
        >;
    },
  ): Promise<InstitutionalAssignment> {
    const now =
      this.dependencies.now();

    const offer =
      createAssignmentOffer({
        offerId:
          this.dependencies.ids
            .createOfferId(),
        request:
          input.request,
        evaluation:
          input.candidateEvaluation,
        issuedBySubjectId:
          input.issuedBySubjectId,
        offerExpiresAt:
          input.definition.timingPolicy
            .offerExpiresAfterHours !==
          undefined
            ? new Date(
                Date.parse(now) +
                  input.definition
                    .timingPolicy
                    .offerExpiresAfterHours *
                    3_600_000,
              ).toISOString()
            : undefined,
        now,
      });

    const acceptance =
      acceptAssignmentOffer({
        ...input.acceptanceInput,
        offer,
        definition:
          input.definition,
      });

    const assignment =
      await createInstitutionalAssignment({
        assignmentId:
          this.dependencies.ids
            .createAssignmentId(),
        definition:
          input.definition,
        request:
          input.request,
        offer,
        acceptance,
        authorityGrantIds:
          input.authorityGrantIds,
        assignedBySubjectId:
          input.issuedBySubjectId,
        now:
          this.dependencies.now(),
        hashCanonicalValue:
          this.dependencies.hashCanonicalValue,
      });

    await this.dependencies.assignments
      .saveAssignment(assignment);

    return assignment;
  }
}

/* ========================================================================== *
 * Canonical assignment definition
 * ========================================================================== */

export const GOVERNANCE_REVIEW_ASSIGNMENT_DEFINITION_ID =
  "TA14-ASG-DEF-GOVERNANCE-REVIEW-000001" as const;

export const governanceReviewAssignmentDefinition:
  AssignmentDefinition = deepFreeze({
    assignmentDefinitionId:
      GOVERNANCE_REVIEW_ASSIGNMENT_DEFINITION_ID,
    assignmentType: "review",
    title:
      "Bounded AI Governance Review Assignment",
    description:
      "Assigns an authorized reviewer to a specifically identified governance review record, action set, scope, confidentiality class, and due condition.",
    version: "3.0",
    active: true,

    requiredAuthorityGrantTypes: [
      "review",
    ],

    allowedRoles: [
      "authorized_reviewer",
      "academy_standards_reviewer",
    ],

    allowedRecordTypes: [
      "review",
      "demonstration",
      "governed_record",
      "evidence_package",
      "finding",
      "determination",
    ],

    allowedActionTypes: [
      "inspect_evidence",
      "record_finding",
      "return_for_correction",
      "hold_review",
      "escalate_review",
      "commit_bounded_determination",
    ],

    requiredScopeDimensions: [
      "record_type",
      "action_type",
      "decision_type",
    ],

    defaultRestrictions: [
      {
        restrictionId:
          "TA14-ASG-RESTR-NO-REGISTRY",
        type: "publication",
        title:
          "No Registry publication authority",
        description:
          "The assignment does not authorize Registry publication.",
        blocking: true,
      },
      {
        restrictionId:
          "TA14-ASG-RESTR-NO-EXECUTION",
        type: "other",
        title:
          "No execution authority",
        description:
          "The assignment does not authorize runtime execution.",
        blocking: true,
      },
    ],

    separationOfDutyRules: [
      {
        ruleId:
          "TA14-SOD-REQUESTER-CANNOT-REVIEW",
        type:
          "requester_cannot_review",
        title:
          "Requester may not review own submission",
        description:
          "A person who requested or submitted the governed work may not independently review it.",
        blocking: true,
        subjectRelationshipTypes: [
          "requester",
          "submitter",
        ],
        actionTypes: [
          "inspect_evidence",
          "record_finding",
          "commit_bounded_determination",
        ],
        recordTypes: [
          "review",
          "demonstration",
          "governed_record",
        ],
      },
      {
        ruleId:
          "TA14-SOD-EVIDENCE-SUBMITTER-CANNOT-DECIDE",
        type:
          "evidence_submitter_cannot_decide",
        title:
          "Evidence submitter may not decide",
        description:
          "A person who submitted material evidence may not independently commit the final determination.",
        blocking: true,
        subjectRelationshipTypes: [
          "evidence_submitter",
        ],
        actionTypes: [
          "commit_bounded_determination",
        ],
        recordTypes: [
          "determination",
        ],
      },
    ],

    workloadPolicy: {
      maximumOpenAssignments: 10,
      maximumConcurrentCriticalAssignments: 2,
      maximumWeightedLoad: 20,
      assignmentWeights: {
        low: 1,
        normal: 2,
        high: 4,
        critical: 8,
      },
      countHeldAssignments: true,
      countSuspendedAssignments: true,
      overloadDecision: "HOLD",
    },

    timingPolicy: {
      offerExpiresAfterHours: 48,
      mustStartWithinHours: 72,
      maximumAssignmentDays: 30,
      warningHoursBeforeDue: [
        72,
        24,
        4,
      ],
      autoExpireOnDueDate: true,
      extensionAllowed: true,
      extensionRequiresAuthority: true,
    },

    acceptancePolicy: {
      explicitAcceptanceRequired: true,
      conflictRecheckRequired: true,
      authorityRecheckRequired: true,
      competenceRecheckRequired: true,
      confidentialityAttestationRequired: true,
      scopeAttestationRequired: true,
      declineReasonRequired: true,
    },

    transferPolicy: {
      transferAllowed: true,
      transferRequiresReason: true,
      receivingActorEligibilityRequired: true,
      receivingActorAcceptanceRequired: true,
      preservePriorAssignmentHistory: true,
      transferCreatesNewAssignmentRecord: true,
      originalAssignmentStateAfterTransfer:
        "transferred",
    },

    completionPolicy: {
      completionReportRequired: true,
      completionEvidenceRequired: true,
      completionReviewRequired: true,
      completionReviewerRoles: [
        "academy_standards_reviewer",
        "institutional_administrator",
      ],
      allowPartialCompletion: false,
      completionDoesNotCreateDetermination: true,
      completionDoesNotCreateRegistryEffect: true,
      completionDoesNotCreateArtifactEffect: true,
    },

    revalidationPolicy: {
      triggers: [
        "authority_change",
        "authority_expiry",
        "credential_change",
        "credential_expiry",
        "conflict_change",
        "competence_change",
        "scope_change",
        "record_change",
        "organization_change",
        "jurisdiction_change",
        "law_change",
        "standard_change",
        "material_fact_change",
      ],
      criticalTriggersHoldAssignment: true,
      mayRequireTransfer: true,
      mayRequireScopeReduction: true,
      mayRequireReacceptance: true,
      preserveHistoricalAssignment: true,
    },

    publicProjectionAllowed: true,

    assignmentBoundary:
      TA14_ACADEMY_ASSIGNMENT_BOUNDARY,

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

export function createDeterministicAssignmentDependencies(
  startAt = "2026-08-04T16:00:00.000Z",
): {
  readonly ids:
    AssignmentIdentifierFactory;
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
        next("TA14-ASG-REQ"),
      createEvaluationId: () =>
        next("TA14-ASG-EVAL"),
      createOfferId: () =>
        next("TA14-ASG-OFFER"),
      createAcceptanceId: () =>
        next("TA14-ASG-ACCEPT"),
      createAssignmentId: () =>
        next("TA14-ASG"),
      createTransferRequestId: () =>
        next("TA14-ASG-TRANSFER-REQ"),
      createTransferDecisionId: () =>
        next("TA14-ASG-TRANSFER-DEC"),
      createRevalidationActionId: () =>
        next("TA14-ASG-REVALIDATE"),
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

export interface AssignmentEngineSelfCheck {
  readonly ok: boolean;
  readonly definitionValid: boolean;
  readonly workloadEvaluationValid: boolean;
  readonly assignmentCreatedDetermination: false;
  readonly assignmentCreatedRegistryEffect: false;
  readonly assignmentCreatedArtifactEffect: false;
  readonly assignmentCreatedExecution: false;
  readonly issues: readonly string[];
}

export function runAssignmentEngineSelfCheck():
  AssignmentEngineSelfCheck {
  const issues: string[] = [];

  const definitionValidation =
    validateAssignmentDefinition(
      governanceReviewAssignmentDefinition,
    );

  if (!definitionValidation.ok) {
    issues.push(
      "Canonical governance review assignment definition failed validation.",
    );
  }

  const workload =
    evaluateWorkload(
      governanceReviewAssignmentDefinition
        .workloadPolicy,
      {
        subjectId:
          "TA14-SUBJECT-REVIEWER-TEST",
        role:
          "authorized_reviewer",
        authorityGrantIds: [
          "TA14-AUTH-GRANT-TEST",
        ],
        credentialIds: [
          "TA14-CREDENTIAL-TEST",
        ],
        openAssignmentCount: 1,
        criticalAssignmentCount: 0,
        weightedLoad: 2,
        conflictCurrent: true,
        competenceCurrent: true,
        available: true,
      },
      "normal",
    );

  if (workload.result !== "acceptable") {
    issues.push(
      "Canonical workload evaluation was not acceptable.",
    );
  }

  return {
    ok: issues.length === 0,
    definitionValid:
      definitionValidation.ok,
    workloadEvaluationValid:
      workload.result === "acceptable",
    assignmentCreatedDetermination: false,
    assignmentCreatedRegistryEffect: false,
    assignmentCreatedArtifactEffect: false,
    assignmentCreatedExecution: false,
    issues,
  };
}

/* ========================================================================== *
 * Internal utilities
 * ========================================================================== */

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
    AssignmentValidationIssue[],
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
    AssignmentValidationIssue[],
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
    AssignmentValidationIssue[],
  path: string,
  code: AssignmentValidationCode,
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
): AssignmentValidationResult<T> {
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
    AssignmentValidationIssue[],
): AssignmentValidationResult<T> {
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

const assignmentContracts = {
  engineId:
    TA14_ACADEMY_ASSIGNMENT_ENGINE_ID,

  engineVersion:
    TA14_ACADEMY_ASSIGNMENT_ENGINE_VERSION,

  boundary:
    TA14_ACADEMY_ASSIGNMENT_BOUNDARY,

  assignmentStates:
    ASSIGNMENT_STATES,

  assignmentTypes:
    ASSIGNMENT_TYPES,

  priorities:
    ASSIGNMENT_PRIORITY_LEVELS,

  validateAssignmentDefinition,
  validateInstitutionalAssignment,

  evaluateAssignmentCandidate,
  evaluateSeparationOfDuty,
  evaluateWorkload,

  createAssignmentOffer,
  acceptAssignmentOffer,
  createInstitutionalAssignment,

  startAssignment,
  holdAssignment,
  suspendAssignment,
  expireAssignment,
  revokeAssignment,
  submitAssignmentCompletion,
  completeAssignment,

  createAssignmentTransferRequest,
  createAssignmentRevalidationAction,
  projectPublicAssignment,

  InMemoryAssignmentDefinitionRepository,
  InMemoryAssignmentRequestRepository,
  InMemoryAssignmentRepository,

  AcademyAssignmentService,

  governanceReviewAssignmentDefinition,
  createDeterministicAssignmentDependencies,
  runAssignmentEngineSelfCheck,
};

export default assignmentContracts;
