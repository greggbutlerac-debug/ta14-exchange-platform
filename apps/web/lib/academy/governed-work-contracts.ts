/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * ACD-009 — Governed Work Contracts
 *
 * Create:
 *   apps/web/lib/academy/governed-work-contracts.ts
 *
 * Purpose:
 *   Govern the operational workspace between an accepted assignment and any
 *   later finding, determination, Registry review, publication, or artifact.
 *
 * Constitutional boundaries:
 *   Governed Work != Finding
 *   Finding != Determination
 *   Determination != Registry Publication
 *   Registry Publication != Execution Artifact
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

import type {
  AcademyEventActor,
  AcademyEventAuthority,
  AcademyEventRecordRef,
  AcademyEventService,
} from "./academy-events";

import type {
  AssignmentState,
  InstitutionalAssignment,
} from "./assignment-contracts";

/* ========================================================================== *
 * Engine identity
 * ========================================================================== */

export const TA14_GOVERNED_WORK_ENGINE_VERSION = "3.0" as const;

export const TA14_GOVERNED_WORK_ENGINE_ID =
  "TA14-ACD-GOVERNED-WORK-ENGINE-000001" as const;

export const TA14_GOVERNED_WORK_BOUNDARY =
  "Governed work preserves attributable inspection, analysis, collaboration, and readiness records. It does not itself create a finding, determination, Registry publication, execution artifact, or runtime execution effect." as const;

/* ========================================================================== *
 * Canonical enumerations
 * ========================================================================== */

export const GOVERNED_WORK_STATES = [
  "draft",
  "opened",
  "in_progress",
  "awaiting_evidence",
  "awaiting_collaborator",
  "awaiting_revalidation",
  "held",
  "escalated",
  "returned_for_correction",
  "submitted",
  "ready_for_finding",
  "completed",
  "withdrawn",
  "expired",
  "superseded",
] as const;

export type GovernedWorkState =
  (typeof GOVERNED_WORK_STATES)[number];

export const GOVERNED_WORK_SESSION_STATES = [
  "open",
  "paused",
  "closed",
  "invalidated",
] as const;

export type GovernedWorkSessionState =
  (typeof GOVERNED_WORK_SESSION_STATES)[number];

export const GOVERNED_WORK_ITEM_TYPES = [
  "note",
  "observation",
  "question",
  "issue",
  "evidence_reference",
  "scope_check",
  "authority_check",
  "assignment_check",
  "confidentiality_check",
  "continuity_check",
  "checkpoint",
  "collaboration_request",
  "correction_request",
  "escalation_request",
  "readiness_assertion",
] as const;

export type GovernedWorkItemType =
  (typeof GOVERNED_WORK_ITEM_TYPES)[number];

export const GOVERNED_WORK_ITEM_STATES = [
  "open",
  "in_review",
  "resolved",
  "withdrawn",
  "invalidated",
  "superseded",
] as const;

export type GovernedWorkItemState =
  (typeof GOVERNED_WORK_ITEM_STATES)[number];

export const EVIDENCE_INSPECTION_STATES = [
  "not_started",
  "permitted",
  "restricted",
  "inspected",
  "rejected",
  "held",
  "expired",
  "superseded",
] as const;

export type EvidenceInspectionState =
  (typeof EVIDENCE_INSPECTION_STATES)[number];

export const SCOPE_DRIFT_SEVERITIES = [
  "none",
  "low",
  "moderate",
  "high",
  "critical",
] as const;

export type ScopeDriftSeverity =
  (typeof SCOPE_DRIFT_SEVERITIES)[number];

export const MATERIAL_CHANGE_SEVERITIES = [
  "informational",
  "minor",
  "material",
  "critical",
] as const;

export type MaterialChangeSeverity =
  (typeof MATERIAL_CHANGE_SEVERITIES)[number];

export const WORKSPACE_COLLABORATION_ROLES = [
  "lead",
  "co_reviewer",
  "technical_advisor",
  "evidence_steward",
  "observer",
  "academy_instructor",
  "standards_reviewer",
  "institutional_administrator",
] as const;

export type WorkspaceCollaborationRole =
  (typeof WORKSPACE_COLLABORATION_ROLES)[number];

export const DETERMINATION_READINESS_STATES = [
  "not_evaluated",
  "not_ready",
  "conditionally_ready",
  "ready",
  "held",
  "escalated",
] as const;

export type DeterminationReadinessState =
  (typeof DETERMINATION_READINESS_STATES)[number];

/* ========================================================================== *
 * Definition and policy contracts
 * ========================================================================== */

export interface GovernedWorkDefinition {
  readonly governedWorkDefinitionId: InstitutionalIdentifier;
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly active: boolean;

  readonly supportedAssignmentTypes: readonly string[];
  readonly allowedRoles: readonly InstitutionalRole[];
  readonly allowedRecordTypes: readonly InstitutionalRecordType[];
  readonly allowedWorkItemTypes: readonly GovernedWorkItemType[];

  readonly evidencePolicy: GovernedWorkEvidencePolicy;
  readonly sessionPolicy: GovernedWorkSessionPolicy;
  readonly collaborationPolicy: GovernedWorkCollaborationPolicy;
  readonly scopePolicy: GovernedWorkScopePolicy;
  readonly continuityPolicy: GovernedWorkContinuityPolicy;
  readonly submissionPolicy: GovernedWorkSubmissionPolicy;
  readonly readinessPolicy: DeterminationReadinessPolicy;
  readonly retentionPolicy: GovernedWorkRetentionPolicy;

  readonly publicProjectionAllowed: boolean;
  readonly governedWorkBoundary: string;
  readonly nonSubstitutionRule:
    typeof TA14_ACADEMY_NON_SUBSTITUTION_RULE;

  readonly contentHash: ContentHash;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
}

export interface GovernedWorkEvidencePolicy {
  readonly permittedEvidenceClasses: readonly string[];
  readonly prohibitedEvidenceClasses: readonly string[];
  readonly requireAttribution: boolean;
  readonly requirePermission: boolean;
  readonly requireCurrentVersion: boolean;
  readonly requireIntegrityHash: boolean;
  readonly requireProvenance: boolean;
  readonly allowConfidentialEvidence: boolean;
  readonly allowExternallyHostedEvidence: boolean;
  readonly rejectUnknownEvidenceClass: boolean;
  readonly staleEvidenceDecision: "HOLD" | "REJECT" | "ESCALATE";
  readonly prohibitedEvidenceDecision: "REJECT" | "ESCALATE";
}

export interface GovernedWorkSessionPolicy {
  readonly maximumOpenSessionsPerSubject: number;
  readonly maximumSessionHours?: number;
  readonly inactivityTimeoutMinutes?: number;
  readonly explicitCloseRequired: boolean;
  readonly preserveSessionEvents: true;
  readonly sessionResumeAllowed: boolean;
  readonly concurrentSessionDecision:
    | "HOLD"
    | "DENY"
    | "ESCALATE";
}

export interface GovernedWorkCollaborationPolicy {
  readonly collaborationAllowed: boolean;
  readonly maximumCollaborators?: number;
  readonly requireLeadReviewer: boolean;
  readonly dualReviewRequired: boolean;
  readonly independentReviewRequired: boolean;
  readonly conflictCheckRequired: boolean;
  readonly authorityCheckRequired: boolean;
  readonly assignmentCheckRequired: boolean;
  readonly confidentialityAttestationRequired: boolean;
  readonly collaboratorRemovalRequiresReason: boolean;
}

export interface GovernedWorkScopePolicy {
  readonly checkOnWorkspaceOpen: boolean;
  readonly checkOnSessionOpen: boolean;
  readonly checkOnEvidenceInspection: boolean;
  readonly checkOnWorkItemCreate: boolean;
  readonly checkOnSubmission: boolean;
  readonly driftTolerance: ScopeDriftSeverity;
  readonly materialDriftDecision:
    | "HOLD"
    | "RETURN_FOR_CORRECTION"
    | "ESCALATE";
  readonly criticalDriftDecision:
    | "HOLD"
    | "ESCALATE";
}

export interface GovernedWorkContinuityPolicy {
  readonly materialChangeTriggers: readonly string[];
  readonly revalidateAssignmentOnMaterialChange: boolean;
  readonly revalidateAuthorityOnMaterialChange: boolean;
  readonly revalidateEvidenceOnMaterialChange: boolean;
  readonly lockWorkspaceOnCriticalChange: boolean;
  readonly preservePriorVersion: true;
  readonly preserveEarliestFailure: true;
}

export interface GovernedWorkSubmissionPolicy {
  readonly summaryRequired: boolean;
  readonly unresolvedIssuesRequired: boolean;
  readonly evidenceInventoryRequired: boolean;
  readonly scopeAttestationRequired: boolean;
  readonly authorityAttestationRequired: boolean;
  readonly assignmentAttestationRequired: boolean;
  readonly confidentialityAttestationRequired: boolean;
  readonly collaboratorAcknowledgementRequired: boolean;
  readonly submissionCreatesFinding: false;
  readonly submissionCreatesDetermination: false;
  readonly submissionCreatesRegistryEffect: false;
  readonly submissionCreatesArtifactEffect: false;
}

export interface DeterminationReadinessPolicy {
  readonly requireAssignmentCurrent: boolean;
  readonly requireAuthorityCurrent: boolean;
  readonly requireScopeCurrent: boolean;
  readonly requireConflictCurrent: boolean;
  readonly requireCompetenceCurrent: boolean;
  readonly requireEvidenceInspectionComplete: boolean;
  readonly requireNoCriticalIssues: boolean;
  readonly requireNoUnresolvedBlockingItems: boolean;
  readonly requireCollaboratorAcknowledgement: boolean;
  readonly requireVersionLockCurrent: boolean;
  readonly requireMaterialChangeReviewComplete: boolean;
}

export interface GovernedWorkRetentionPolicy {
  readonly retainWorkspaceDays?: number;
  readonly retainSessionsDays?: number;
  readonly retainItemsDays?: number;
  readonly retainEvidenceInspectionsDays?: number;
  readonly preserveCompletedWorkspace: true;
  readonly preserveWithdrawnWorkspace: true;
  readonly preserveSupersededWorkspace: true;
}

/* ========================================================================== *
 * Workspace, session, and participant contracts
 * ========================================================================== */

export interface GovernedWorkWorkspace {
  readonly workspaceId: InstitutionalIdentifier;
  readonly governedWorkDefinitionId: InstitutionalIdentifier;
  readonly assignmentId: InstitutionalIdentifier;

  readonly targetRecordId: InstitutionalIdentifier;
  readonly targetRecordType: InstitutionalRecordType;
  readonly targetRecordVersion: string;

  readonly leadSubjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly participants: readonly GovernedWorkParticipant[];

  readonly authorityGrantIds: readonly InstitutionalIdentifier[];
  readonly permittedActionTypes: readonly string[];
  readonly scopeSnapshot: readonly JsonValue[];
  readonly restrictionSnapshot: readonly JsonValue[];

  readonly state: GovernedWorkState;
  readonly openedAt: ISODateTimeString;
  readonly updatedAt: ISODateTimeString;
  readonly submittedAt?: ISODateTimeString;
  readonly completedAt?: ISODateTimeString;
  readonly heldAt?: ISODateTimeString;
  readonly escalatedAt?: ISODateTimeString;
  readonly withdrawnAt?: ISODateTimeString;

  readonly activeSessionIds: readonly InstitutionalIdentifier[];
  readonly workItemIds: readonly InstitutionalIdentifier[];
  readonly evidenceInspectionIds: readonly InstitutionalIdentifier[];
  readonly materialChangeIds: readonly InstitutionalIdentifier[];
  readonly scopeDriftIds: readonly InstitutionalIdentifier[];

  readonly versionLock: GovernedRecordVersionLock;
  readonly submission?: GovernedWorkSubmission;
  readonly readiness?: DeterminationReadinessEvaluation;

  readonly governedWorkCreatedFinding: false;
  readonly governedWorkCreatedDetermination: false;
  readonly governedWorkCreatedRegistryEffect: false;
  readonly governedWorkCreatedArtifactEffect: false;
  readonly governedWorkCreatedExecution: false;

  readonly correlationId: CorrelationIdentifier;
  readonly integrityHash: ContentHash;
}

export interface GovernedWorkParticipant {
  readonly participantId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly role: InstitutionalRole;
  readonly collaborationRole: WorkspaceCollaborationRole;
  readonly authorityGrantIds: readonly InstitutionalIdentifier[];
  readonly assignmentIds: readonly InstitutionalIdentifier[];
  readonly joinedAt: ISODateTimeString;
  readonly removedAt?: ISODateTimeString;
  readonly active: boolean;
  readonly conflictChecked: boolean;
  readonly authorityChecked: boolean;
  readonly assignmentChecked: boolean;
  readonly confidentialityAttested: boolean;
  readonly limitations: readonly string[];
}

export interface GovernedWorkSession {
  readonly sessionId: InstitutionalIdentifier;
  readonly workspaceId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly state: GovernedWorkSessionState;
  readonly openedAt: ISODateTimeString;
  readonly pausedAt?: ISODateTimeString;
  readonly resumedAt?: ISODateTimeString;
  readonly closedAt?: ISODateTimeString;
  readonly lastActivityAt: ISODateTimeString;
  readonly workItemIds: readonly InstitutionalIdentifier[];
  readonly evidenceInspectionIds: readonly InstitutionalIdentifier[];
  readonly eventCount: number;
  readonly closeReason?: string;
  readonly invalidationReason?: string;
  readonly correlationId: CorrelationIdentifier;
}

export interface GovernedRecordVersionLock {
  readonly lockId: InstitutionalIdentifier;
  readonly recordId: InstitutionalIdentifier;
  readonly recordType: InstitutionalRecordType;
  readonly recordVersion: string;
  readonly contentHash: ContentHash;
  readonly lockedAt: ISODateTimeString;
  readonly lockedBySubjectId: InstitutionalIdentifier;
  readonly current: boolean;
  readonly supersededAt?: ISODateTimeString;
  readonly supersededByVersion?: string;
  readonly materialChangeReviewRequired: boolean;
}

/* ========================================================================== *
 * Work items and evidence inspection
 * ========================================================================== */

export interface GovernedWorkItem {
  readonly workItemId: InstitutionalIdentifier;
  readonly workspaceId: InstitutionalIdentifier;
  readonly sessionId?: InstitutionalIdentifier;
  readonly type: GovernedWorkItemType;
  readonly state: GovernedWorkItemState;

  readonly title: string;
  readonly body: string;
  readonly createdBySubjectId: InstitutionalIdentifier;
  readonly createdAt: ISODateTimeString;
  readonly updatedAt: ISODateTimeString;

  readonly relatedRecordIds: readonly InstitutionalIdentifier[];
  readonly relatedEvidenceIds: readonly InstitutionalIdentifier[];
  readonly relatedWorkItemIds: readonly InstitutionalIdentifier[];

  readonly blocking: boolean;
  readonly severity:
    | "informational"
    | "low"
    | "moderate"
    | "high"
    | "critical";
  readonly confidentialityClass:
    | "public"
    | "controlled"
    | "confidential";

  readonly resolution?: GovernedWorkItemResolution;
  readonly supersededByWorkItemId?: InstitutionalIdentifier;

  readonly workItemCreatedFinding: false;
  readonly workItemCreatedDetermination: false;
  readonly workItemCreatedRegistryEffect: false;
  readonly workItemCreatedArtifactEffect: false;

  readonly integrityHash: ContentHash;
}

export interface GovernedWorkItemResolution {
  readonly resolutionId: InstitutionalIdentifier;
  readonly resolutionType:
    | "resolved"
    | "withdrawn"
    | "invalidated"
    | "superseded"
    | "returned_for_correction"
    | "escalated";
  readonly rationale: string;
  readonly resolvedBySubjectId: InstitutionalIdentifier;
  readonly resolvedAt: ISODateTimeString;
  readonly limitations: readonly string[];
}

export interface GovernedEvidenceInspection {
  readonly inspectionId: InstitutionalIdentifier;
  readonly workspaceId: InstitutionalIdentifier;
  readonly sessionId?: InstitutionalIdentifier;
  readonly evidenceId: InstitutionalIdentifier;
  readonly evidenceVersion: string;
  readonly evidenceClass: string;

  readonly state: EvidenceInspectionState;
  readonly inspectedBySubjectId: InstitutionalIdentifier;
  readonly inspectedAt?: ISODateTimeString;

  readonly attributable: boolean;
  readonly permitted: boolean;
  readonly current: boolean;
  readonly integrityVerified: boolean;
  readonly provenanceVerified: boolean;
  readonly relevant: boolean;
  readonly confidentialityPermitted: boolean;

  readonly limitations: readonly string[];
  readonly rejectionReasons: readonly string[];
  readonly holdReasons: readonly string[];

  readonly inspectionCreatedFinding: false;
  readonly inspectionCreatedDetermination: false;
  readonly inspectionCreatedRegistryEffect: false;
  readonly inspectionCreatedArtifactEffect: false;

  readonly integrityHash: ContentHash;
}

/* ========================================================================== *
 * Scope drift and material change
 * ========================================================================== */

export interface GovernedScopeDriftRecord {
  readonly scopeDriftId: InstitutionalIdentifier;
  readonly workspaceId: InstitutionalIdentifier;
  readonly detectedBySubjectId:
    | InstitutionalIdentifier
    | "service";
  readonly detectedAt: ISODateTimeString;

  readonly expectedScope: readonly JsonValue[];
  readonly observedScope: readonly JsonValue[];
  readonly outOfScopeElements: readonly JsonValue[];

  readonly severity: ScopeDriftSeverity;
  readonly state:
    | "open"
    | "under_review"
    | "resolved"
    | "accepted_with_constraints"
    | "returned_for_correction"
    | "held"
    | "escalated";

  readonly decision:
    | "ALLOW"
    | "HOLD"
    | "DENY"
    | "ESCALATE"
    | "RETURN_FOR_CORRECTION";
  readonly rationale: string;
  readonly restrictions: readonly string[];
  readonly resolvedAt?: ISODateTimeString;
}

export interface GovernedMaterialChange {
  readonly materialChangeId: InstitutionalIdentifier;
  readonly workspaceId: InstitutionalIdentifier;
  readonly triggerType: string;
  readonly severity: MaterialChangeSeverity;

  readonly priorRecordVersion: string;
  readonly newRecordVersion?: string;
  readonly priorContentHash: ContentHash;
  readonly newContentHash?: ContentHash;

  readonly detectedAt: ISODateTimeString;
  readonly detectedBy:
    | InstitutionalIdentifier
    | "service";

  readonly assignmentRevalidationRequired: boolean;
  readonly authorityRevalidationRequired: boolean;
  readonly evidenceRevalidationRequired: boolean;
  readonly workspaceLockRequired: boolean;

  readonly state:
    | "open"
    | "in_review"
    | "revalidated"
    | "held"
    | "escalated"
    | "withdrawn";

  readonly limitations: readonly string[];
  readonly completedAt?: ISODateTimeString;
}

/* ========================================================================== *
 * Collaboration and review coordination
 * ========================================================================== */

export interface GovernedCollaborationRequest {
  readonly collaborationRequestId: InstitutionalIdentifier;
  readonly workspaceId: InstitutionalIdentifier;
  readonly requestedBySubjectId: InstitutionalIdentifier;
  readonly requestedSubjectId: InstitutionalIdentifier;
  readonly requestedRole: InstitutionalRole;
  readonly requestedCollaborationRole: WorkspaceCollaborationRole;
  readonly reason: string;
  readonly scope: readonly string[];
  readonly state:
    | "requested"
    | "screening"
    | "approved"
    | "denied"
    | "withdrawn";
  readonly requestedAt: ISODateTimeString;
  readonly decidedAt?: ISODateTimeString;
  readonly decidedBySubjectIds: readonly InstitutionalIdentifier[];
}

export interface GovernedCollaborationAcknowledgement {
  readonly acknowledgementId: InstitutionalIdentifier;
  readonly workspaceId: InstitutionalIdentifier;
  readonly participantId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly acknowledgedAt: ISODateTimeString;
  readonly acknowledgesScope: boolean;
  readonly acknowledgesLimitations: boolean;
  readonly acknowledgesUnresolvedIssues: boolean;
  readonly acknowledgesReadinessState: boolean;
  readonly limitations: readonly string[];
}

/* ========================================================================== *
 * Submission and determination readiness
 * ========================================================================== */

export interface GovernedWorkSubmission {
  readonly submissionId: InstitutionalIdentifier;
  readonly workspaceId: InstitutionalIdentifier;
  readonly submittedBySubjectId: InstitutionalIdentifier;
  readonly submittedAt: ISODateTimeString;

  readonly summary: string;
  readonly workPerformed: readonly string[];
  readonly evidenceInspectionIds: readonly InstitutionalIdentifier[];
  readonly unresolvedWorkItemIds: readonly InstitutionalIdentifier[];
  readonly blockingWorkItemIds: readonly InstitutionalIdentifier[];
  readonly materialChangeIds: readonly InstitutionalIdentifier[];
  readonly scopeDriftIds: readonly InstitutionalIdentifier[];

  readonly scopeAttested: boolean;
  readonly authorityAttested: boolean;
  readonly assignmentAttested: boolean;
  readonly confidentialityAttested: boolean;
  readonly collaboratorAcknowledgementIds:
    readonly InstitutionalIdentifier[];

  readonly state:
    | "submitted"
    | "returned_for_correction"
    | "held"
    | "escalated"
    | "accepted";

  readonly submissionCreatedFinding: false;
  readonly submissionCreatedDetermination: false;
  readonly submissionCreatedRegistryEffect: false;
  readonly submissionCreatedArtifactEffect: false;

  readonly integrityHash: ContentHash;
}

export interface DeterminationReadinessEvaluation {
  readonly readinessEvaluationId: InstitutionalIdentifier;
  readonly workspaceId: InstitutionalIdentifier;
  readonly submissionId: InstitutionalIdentifier;
  readonly state: DeterminationReadinessState;

  readonly assignmentCurrent: boolean;
  readonly authorityCurrent: boolean;
  readonly scopeCurrent: boolean;
  readonly conflictCurrent: boolean;
  readonly competenceCurrent: boolean;
  readonly evidenceInspectionComplete: boolean;
  readonly noCriticalIssues: boolean;
  readonly noUnresolvedBlockingItems: boolean;
  readonly collaboratorsAcknowledged: boolean;
  readonly versionLockCurrent: boolean;
  readonly materialChangeReviewComplete: boolean;

  readonly reasons: readonly string[];
  readonly limitations: readonly string[];
  readonly evaluatedAt: ISODateTimeString;
  readonly evaluatedBy:
    | InstitutionalIdentifier
    | "service";

  readonly readinessCreatedFinding: false;
  readonly readinessCreatedDetermination: false;
  readonly readinessCreatedRegistryEffect: false;
  readonly readinessCreatedArtifactEffect: false;
}

/* ========================================================================== *
 * Validation
 * ========================================================================== */

export type GovernedWorkValidationCode =
  | "required"
  | "invalid_type"
  | "invalid_value"
  | "invalid_state"
  | "invalid_hash"
  | "invalid_date"
  | "invalid_role"
  | "invalid_record_type"
  | "assignment_not_current"
  | "authority_not_current"
  | "scope_not_current"
  | "conflict_not_current"
  | "competence_not_current"
  | "version_lock_not_current"
  | "evidence_not_attributable"
  | "evidence_not_permitted"
  | "evidence_not_current"
  | "evidence_integrity_failed"
  | "evidence_provenance_failed"
  | "critical_issue_open"
  | "blocking_item_open"
  | "material_change_unresolved"
  | "workspace_created_finding"
  | "workspace_created_determination"
  | "workspace_created_registry_effect"
  | "workspace_created_artifact_effect"
  | "workspace_created_execution";

export interface GovernedWorkValidationIssue {
  readonly path: string;
  readonly code: GovernedWorkValidationCode;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly received?: unknown;
  readonly expected?: string;
}

export interface GovernedWorkValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly issues: readonly GovernedWorkValidationIssue[];
}

export class GovernedWorkContractValidationError extends Error {
  readonly issues: readonly GovernedWorkValidationIssue[];

  constructor(
    message: string,
    issues: readonly GovernedWorkValidationIssue[],
  ) {
    super(message);
    this.name = "GovernedWorkContractValidationError";
    this.issues = issues;
  }
}

export function validateGovernedWorkDefinition(
  input: unknown,
): GovernedWorkValidationResult<GovernedWorkDefinition> {
  const issues: GovernedWorkValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Governed work definition must be an object.",
      input,
    );
  }

  requiredString(
    input.governedWorkDefinitionId,
    "$.governedWorkDefinitionId",
    issues,
  );
  requiredString(input.title, "$.title", issues);
  requiredString(input.description, "$.description", issues);
  requiredString(input.version, "$.version", issues);
  requiredString(
    input.governedWorkBoundary,
    "$.governedWorkBoundary",
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
    input as unknown as GovernedWorkDefinition,
    issues,
  );
}

export function validateGovernedWorkWorkspace(
  input: unknown,
): GovernedWorkValidationResult<GovernedWorkWorkspace> {
  const issues: GovernedWorkValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Governed work workspace must be an object.",
      input,
    );
  }

  requiredString(input.workspaceId, "$.workspaceId", issues);
  requiredString(input.assignmentId, "$.assignmentId", issues);
  requiredString(input.targetRecordId, "$.targetRecordId", issues);
  requiredString(input.leadSubjectId, "$.leadSubjectId", issues);
  requiredString(input.correlationId, "$.correlationId", issues);

  if (!isOneOf(input.state, GOVERNED_WORK_STATES)) {
    pushIssue(
      issues,
      "$.state",
      "invalid_state",
      "Unsupported governed work state.",
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
    "governedWorkCreatedFinding",
    "governedWorkCreatedDetermination",
    "governedWorkCreatedRegistryEffect",
    "governedWorkCreatedArtifactEffect",
    "governedWorkCreatedExecution",
  ] as const;

  for (const field of hardFalseFields) {
    if (input[field] !== false) {
      pushIssue(
        issues,
        `$.${field}`,
        field === "governedWorkCreatedFinding"
          ? "workspace_created_finding"
          : field === "governedWorkCreatedDetermination"
            ? "workspace_created_determination"
            : field === "governedWorkCreatedRegistryEffect"
              ? "workspace_created_registry_effect"
              : field === "governedWorkCreatedArtifactEffect"
                ? "workspace_created_artifact_effect"
                : "workspace_created_execution",
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
      "Invalid workspace integrity hash.",
      input.integrityHash,
    );
  }

  return completeValidation(
    input as unknown as GovernedWorkWorkspace,
    issues,
  );
}

/* ========================================================================== *
 * Workspace creation
 * ========================================================================== */

export interface CreateGovernedWorkWorkspaceInput {
  readonly workspaceId: InstitutionalIdentifier;
  readonly definition: GovernedWorkDefinition;
  readonly assignment: InstitutionalAssignment;
  readonly leadParticipantId: InstitutionalIdentifier;
  readonly targetRecordVersion: string;
  readonly targetRecordContentHash: ContentHash;
  readonly versionLockId: InstitutionalIdentifier;
  readonly now: ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) =>
      Promise<ContentHash> | ContentHash;
}

export async function createGovernedWorkWorkspace(
  input: CreateGovernedWorkWorkspaceInput,
): Promise<GovernedWorkWorkspace> {
  assertAssignmentCanOpenWorkspace(input.assignment);

  const participant: GovernedWorkParticipant = {
    participantId: input.leadParticipantId,
    subjectId: input.assignment.assignedSubjectId,
    role: "authorized_reviewer",
    collaborationRole: "lead",
    authorityGrantIds: input.assignment.authorityGrantIds,
    assignmentIds: [input.assignment.assignmentId],
    joinedAt: input.now,
    active: true,
    conflictChecked: true,
    authorityChecked: true,
    assignmentChecked: true,
    confidentialityAttested: true,
    limitations: [
      TA14_GOVERNED_WORK_BOUNDARY,
    ],
  };

  const versionLock: GovernedRecordVersionLock = {
    lockId: input.versionLockId,
    recordId: input.assignment.targetRecordId,
    recordType: input.assignment.targetRecordType,
    recordVersion: input.targetRecordVersion,
    contentHash: input.targetRecordContentHash,
    lockedAt: input.now,
    lockedBySubjectId:
      input.assignment.assignedSubjectId,
    current: true,
    materialChangeReviewRequired: false,
  };

  const base = {
    workspaceId: input.workspaceId,
    governedWorkDefinitionId:
      input.definition.governedWorkDefinitionId,
    assignmentId:
      input.assignment.assignmentId,
    targetRecordId:
      input.assignment.targetRecordId,
    targetRecordType:
      input.assignment.targetRecordType,
    targetRecordVersion:
      input.targetRecordVersion,
    leadSubjectId:
      input.assignment.assignedSubjectId,
    organizationId:
      input.assignment.organizationId,
    participants: [participant],
    authorityGrantIds:
      input.assignment.authorityGrantIds,
    permittedActionTypes:
      input.assignment.permittedActionTypes,
    scopeSnapshot:
      input.assignment.scope as unknown as JsonValue[],
    restrictionSnapshot:
      input.assignment.restrictions as unknown as JsonValue[],
    state: "opened" as const,
    openedAt: input.now,
    updatedAt: input.now,
    activeSessionIds: [] as InstitutionalIdentifier[],
    workItemIds: [] as InstitutionalIdentifier[],
    evidenceInspectionIds: [] as InstitutionalIdentifier[],
    materialChangeIds: [] as InstitutionalIdentifier[],
    scopeDriftIds: [] as InstitutionalIdentifier[],
    versionLock,
    governedWorkCreatedFinding: false as const,
    governedWorkCreatedDetermination: false as const,
    governedWorkCreatedRegistryEffect: false as const,
    governedWorkCreatedArtifactEffect: false as const,
    governedWorkCreatedExecution: false as const,
    correlationId: input.assignment.correlationId,
  };

  const integrityHash =
    await input.hashCanonicalValue(
      base as unknown as JsonValue,
    );

  const workspace: GovernedWorkWorkspace = {
    ...base,
    integrityHash,
  };

  const validation =
    validateGovernedWorkWorkspace(workspace);

  if (!validation.ok) {
    throw new GovernedWorkContractValidationError(
      "Governed work workspace failed validation.",
      validation.issues,
    );
  }

  return deepFreeze(workspace);
}

function assertAssignmentCanOpenWorkspace(
  assignment: InstitutionalAssignment,
): void {
  const allowedStates: readonly AssignmentState[] = [
    "accepted",
    "in_progress",
  ];

  if (!allowedStates.includes(assignment.state)) {
    throw new Error(
      `Assignment ${assignment.assignmentId} cannot open governed work from state ${assignment.state}.`,
    );
  }

  if (
    assignment.assignmentCreatedDetermination !== false ||
    assignment.assignmentCreatedRegistryEffect !== false ||
    assignment.assignmentCreatedArtifactEffect !== false ||
    assignment.assignmentCreatedExecution !== false
  ) {
    throw new Error(
      "Assignment violates governed work constitutional boundaries.",
    );
  }
}

/* ========================================================================== *
 * Session lifecycle
 * ========================================================================== */

export function openGovernedWorkSession(
  input: {
    readonly sessionId: InstitutionalIdentifier;
    readonly workspace: GovernedWorkWorkspace;
    readonly subjectId: InstitutionalIdentifier;
    readonly policy: GovernedWorkSessionPolicy;
    readonly currentlyOpenSessions:
      readonly GovernedWorkSession[];
    readonly now: ISODateTimeString;
  },
): GovernedWorkSession {
  assertWorkspaceMutable(input.workspace);

  const subjectOpenSessions =
    input.currentlyOpenSessions.filter(
      (session) =>
        session.subjectId === input.subjectId &&
        session.state === "open",
    );

  if (
    subjectOpenSessions.length >=
    input.policy.maximumOpenSessionsPerSubject
  ) {
    throw new Error(
      "Maximum open governed work sessions reached.",
    );
  }

  const participant =
    input.workspace.participants.find(
      (candidate) =>
        candidate.subjectId === input.subjectId &&
        candidate.active,
    );

  if (!participant) {
    throw new Error(
      "Subject is not an active workspace participant.",
    );
  }

  return deepFreeze({
    sessionId: input.sessionId,
    workspaceId: input.workspace.workspaceId,
    subjectId: input.subjectId,
    state: "open",
    openedAt: input.now,
    lastActivityAt: input.now,
    workItemIds: [],
    evidenceInspectionIds: [],
    eventCount: 0,
    correlationId: input.workspace.correlationId,
  });
}

export function pauseGovernedWorkSession(
  session: GovernedWorkSession,
  now: ISODateTimeString,
): GovernedWorkSession {
  if (session.state !== "open") {
    throw new Error(
      `Session ${session.sessionId} cannot pause from state ${session.state}.`,
    );
  }

  return deepFreeze({
    ...session,
    state: "paused",
    pausedAt: now,
    lastActivityAt: now,
  });
}

export function resumeGovernedWorkSession(
  session: GovernedWorkSession,
  now: ISODateTimeString,
): GovernedWorkSession {
  if (session.state !== "paused") {
    throw new Error(
      `Session ${session.sessionId} cannot resume from state ${session.state}.`,
    );
  }

  return deepFreeze({
    ...session,
    state: "open",
    resumedAt: now,
    lastActivityAt: now,
  });
}

export function closeGovernedWorkSession(
  session: GovernedWorkSession,
  reason: string,
  now: ISODateTimeString,
): GovernedWorkSession {
  if (
    session.state === "closed" ||
    session.state === "invalidated"
  ) {
    throw new Error(
      `Session ${session.sessionId} is already terminal.`,
    );
  }

  return deepFreeze({
    ...session,
    state: "closed",
    closedAt: now,
    lastActivityAt: now,
    closeReason: reason,
  });
}

/* ========================================================================== *
 * Work item creation and resolution
 * ========================================================================== */

export async function createGovernedWorkItem(
  input: {
    readonly workItemId: InstitutionalIdentifier;
    readonly workspace: GovernedWorkWorkspace;
    readonly session?: GovernedWorkSession;
    readonly type: GovernedWorkItemType;
    readonly title: string;
    readonly body: string;
    readonly createdBySubjectId: InstitutionalIdentifier;
    readonly relatedRecordIds?: readonly InstitutionalIdentifier[];
    readonly relatedEvidenceIds?: readonly InstitutionalIdentifier[];
    readonly relatedWorkItemIds?: readonly InstitutionalIdentifier[];
    readonly blocking: boolean;
    readonly severity:
      GovernedWorkItem["severity"];
    readonly confidentialityClass:
      GovernedWorkItem["confidentialityClass"];
    readonly now: ISODateTimeString;
    readonly hashCanonicalValue:
      (value: JsonValue) =>
        Promise<ContentHash> | ContentHash;
  },
): Promise<GovernedWorkItem> {
  assertWorkspaceMutable(input.workspace);

  if (
    !input.workspace.participants.some(
      (participant) =>
        participant.subjectId ===
          input.createdBySubjectId &&
        participant.active,
    )
  ) {
    throw new Error(
      "Only active workspace participants may create work items.",
    );
  }

  const base = {
    workItemId: input.workItemId,
    workspaceId: input.workspace.workspaceId,
    sessionId: input.session?.sessionId,
    type: input.type,
    state: "open" as const,
    title: input.title,
    body: input.body,
    createdBySubjectId:
      input.createdBySubjectId,
    createdAt: input.now,
    updatedAt: input.now,
    relatedRecordIds:
      [...(input.relatedRecordIds ?? [])],
    relatedEvidenceIds:
      [...(input.relatedEvidenceIds ?? [])],
    relatedWorkItemIds:
      [...(input.relatedWorkItemIds ?? [])],
    blocking: input.blocking,
    severity: input.severity,
    confidentialityClass:
      input.confidentialityClass,
    workItemCreatedFinding: false as const,
    workItemCreatedDetermination: false as const,
    workItemCreatedRegistryEffect: false as const,
    workItemCreatedArtifactEffect: false as const,
  };

  const integrityHash =
    await input.hashCanonicalValue(
      base as unknown as JsonValue,
    );

  return deepFreeze({
    ...base,
    integrityHash,
  });
}

export function resolveGovernedWorkItem(
  item: GovernedWorkItem,
  resolution: GovernedWorkItemResolution,
): GovernedWorkItem {
  if (
    item.state === "resolved" ||
    item.state === "withdrawn" ||
    item.state === "invalidated" ||
    item.state === "superseded"
  ) {
    throw new Error(
      `Work item ${item.workItemId} is already terminal.`,
    );
  }

  const nextState: GovernedWorkItemState =
    resolution.resolutionType === "resolved"
      ? "resolved"
      : resolution.resolutionType === "withdrawn"
        ? "withdrawn"
        : resolution.resolutionType === "invalidated"
          ? "invalidated"
          : resolution.resolutionType === "superseded"
            ? "superseded"
            : "in_review";

  return deepFreeze({
    ...item,
    state: nextState,
    resolution,
    updatedAt: resolution.resolvedAt,
  });
}

/* ========================================================================== *
 * Evidence inspection
 * ========================================================================== */

export async function inspectGovernedEvidence(
  input: {
    readonly inspectionId: InstitutionalIdentifier;
    readonly workspace: GovernedWorkWorkspace;
    readonly session?: GovernedWorkSession;
    readonly evidenceId: InstitutionalIdentifier;
    readonly evidenceVersion: string;
    readonly evidenceClass: string;
    readonly inspectedBySubjectId: InstitutionalIdentifier;
    readonly attributable: boolean;
    readonly permitted: boolean;
    readonly current: boolean;
    readonly integrityVerified: boolean;
    readonly provenanceVerified: boolean;
    readonly relevant: boolean;
    readonly confidentialityPermitted: boolean;
    readonly policy: GovernedWorkEvidencePolicy;
    readonly now: ISODateTimeString;
    readonly hashCanonicalValue:
      (value: JsonValue) =>
        Promise<ContentHash> | ContentHash;
  },
): Promise<GovernedEvidenceInspection> {
  assertWorkspaceMutable(input.workspace);

  const rejectionReasons: string[] = [];
  const holdReasons: string[] = [];
  const limitations: string[] = [];

  if (
    !input.policy.permittedEvidenceClasses.includes(
      input.evidenceClass,
    )
  ) {
    if (
      input.policy.prohibitedEvidenceClasses.includes(
        input.evidenceClass,
      ) ||
      input.policy.rejectUnknownEvidenceClass
    ) {
      rejectionReasons.push(
        `Evidence class ${input.evidenceClass} is not permitted.`,
      );
    }
  }

  if (
    input.policy.requireAttribution &&
    !input.attributable
  ) {
    rejectionReasons.push(
      "Evidence is not attributable.",
    );
  }

  if (
    input.policy.requirePermission &&
    !input.permitted
  ) {
    rejectionReasons.push(
      "Evidence is not permitted for this workspace.",
    );
  }

  if (
    input.policy.requireCurrentVersion &&
    !input.current
  ) {
    if (
      input.policy.staleEvidenceDecision === "REJECT"
    ) {
      rejectionReasons.push(
        "Evidence is not current.",
      );
    } else {
      holdReasons.push(
        "Evidence currency requires resolution.",
      );
    }
  }

  if (
    input.policy.requireIntegrityHash &&
    !input.integrityVerified
  ) {
    rejectionReasons.push(
      "Evidence integrity could not be verified.",
    );
  }

  if (
    input.policy.requireProvenance &&
    !input.provenanceVerified
  ) {
    rejectionReasons.push(
      "Evidence provenance could not be verified.",
    );
  }

  if (!input.relevant) {
    rejectionReasons.push(
      "Evidence is not relevant to the bounded work.",
    );
  }

  if (!input.confidentialityPermitted) {
    rejectionReasons.push(
      "Evidence confidentiality is not permitted.",
    );
  }

  let state: EvidenceInspectionState;

  if (rejectionReasons.length > 0) {
    state = "rejected";
  } else if (holdReasons.length > 0) {
    state = "held";
  } else {
    state = "inspected";
  }

  limitations.push(
    "Evidence inspection does not create a finding or determination.",
  );

  const base = {
    inspectionId: input.inspectionId,
    workspaceId: input.workspace.workspaceId,
    sessionId: input.session?.sessionId,
    evidenceId: input.evidenceId,
    evidenceVersion: input.evidenceVersion,
    evidenceClass: input.evidenceClass,
    state,
    inspectedBySubjectId:
      input.inspectedBySubjectId,
    inspectedAt: input.now,
    attributable: input.attributable,
    permitted: input.permitted,
    current: input.current,
    integrityVerified: input.integrityVerified,
    provenanceVerified: input.provenanceVerified,
    relevant: input.relevant,
    confidentialityPermitted:
      input.confidentialityPermitted,
    limitations,
    rejectionReasons,
    holdReasons,
    inspectionCreatedFinding: false as const,
    inspectionCreatedDetermination: false as const,
    inspectionCreatedRegistryEffect: false as const,
    inspectionCreatedArtifactEffect: false as const,
  };

  const integrityHash =
    await input.hashCanonicalValue(
      base as unknown as JsonValue,
    );

  return deepFreeze({
    ...base,
    integrityHash,
  });
}

/* ========================================================================== *
 * Scope drift and material change
 * ========================================================================== */

export function detectScopeDrift(
  input: {
    readonly scopeDriftId: InstitutionalIdentifier;
    readonly workspace: GovernedWorkWorkspace;
    readonly observedScope: readonly JsonValue[];
    readonly detectedBy:
      InstitutionalIdentifier
      | "service";
    readonly policy: GovernedWorkScopePolicy;
    readonly now: ISODateTimeString;
  },
): GovernedScopeDriftRecord {
  const expectedSerialized =
    input.workspace.scopeSnapshot.map(stableStringify);
  const observedSerialized =
    input.observedScope.map(stableStringify);

  const outOfScopeElements =
    input.observedScope.filter(
      (value) =>
        !expectedSerialized.includes(
          stableStringify(value),
        ),
    );

  let severity: ScopeDriftSeverity;

  if (outOfScopeElements.length === 0) {
    severity = "none";
  } else if (outOfScopeElements.length === 1) {
    severity = "low";
  } else if (outOfScopeElements.length <= 3) {
    severity = "moderate";
  } else {
    severity = "high";
  }

  let decision:
    GovernedScopeDriftRecord["decision"];

  if (severity === "none" || severity === "low") {
    decision = "ALLOW";
  } else if (severity === "moderate") {
    decision =
      input.policy.materialDriftDecision;
  } else {
    decision =
      input.policy.criticalDriftDecision;
  }

  const state:
    GovernedScopeDriftRecord["state"] =
    decision === "ALLOW"
      ? "resolved"
      : decision === "HOLD"
        ? "held"
        : decision === "RETURN_FOR_CORRECTION"
          ? "returned_for_correction"
          : "escalated";

  return deepFreeze({
    scopeDriftId: input.scopeDriftId,
    workspaceId: input.workspace.workspaceId,
    detectedBySubjectId: input.detectedBy,
    detectedAt: input.now,
    expectedScope:
      input.workspace.scopeSnapshot,
    observedScope: input.observedScope,
    outOfScopeElements,
    severity,
    state,
    decision,
    rationale:
      outOfScopeElements.length === 0
        ? "Observed work remains within scope."
        : "Observed work contains elements outside the locked assignment scope.",
    restrictions:
      decision === "ALLOW"
        ? []
        : [
            "Do not continue affected work until scope disposition is complete.",
          ],
    resolvedAt:
      state === "resolved"
        ? input.now
        : undefined,
  });
}

export function createGovernedMaterialChange(
  input: {
    readonly materialChangeId: InstitutionalIdentifier;
    readonly workspace: GovernedWorkWorkspace;
    readonly triggerType: string;
    readonly severity: MaterialChangeSeverity;
    readonly newRecordVersion?: string;
    readonly newContentHash?: ContentHash;
    readonly detectedBy:
      InstitutionalIdentifier
      | "service";
    readonly policy: GovernedWorkContinuityPolicy;
    readonly now: ISODateTimeString;
  },
): GovernedMaterialChange {
  const material =
    input.severity === "material" ||
    input.severity === "critical";

  return deepFreeze({
    materialChangeId: input.materialChangeId,
    workspaceId: input.workspace.workspaceId,
    triggerType: input.triggerType,
    severity: input.severity,
    priorRecordVersion:
      input.workspace.targetRecordVersion,
    newRecordVersion:
      input.newRecordVersion,
    priorContentHash:
      input.workspace.versionLock.contentHash,
    newContentHash:
      input.newContentHash,
    detectedAt: input.now,
    detectedBy: input.detectedBy,
    assignmentRevalidationRequired:
      material &&
      input.policy
        .revalidateAssignmentOnMaterialChange,
    authorityRevalidationRequired:
      material &&
      input.policy
        .revalidateAuthorityOnMaterialChange,
    evidenceRevalidationRequired:
      material &&
      input.policy
        .revalidateEvidenceOnMaterialChange,
    workspaceLockRequired:
      input.severity === "critical" &&
      input.policy.lockWorkspaceOnCriticalChange,
    state:
      input.severity === "critical"
        ? "held"
        : material
          ? "in_review"
          : "open",
    limitations: [
      "Prior workspace history remains preserved.",
      "Material change does not silently update the locked record version.",
    ],
  });
}

/* ========================================================================== *
 * Submission and readiness
 * ========================================================================== */

export async function createGovernedWorkSubmission(
  input: {
    readonly submissionId: InstitutionalIdentifier;
    readonly workspace: GovernedWorkWorkspace;
    readonly submittedBySubjectId: InstitutionalIdentifier;
    readonly summary: string;
    readonly workPerformed: readonly string[];
    readonly inspections:
      readonly GovernedEvidenceInspection[];
    readonly workItems:
      readonly GovernedWorkItem[];
    readonly materialChanges:
      readonly GovernedMaterialChange[];
    readonly scopeDrifts:
      readonly GovernedScopeDriftRecord[];
    readonly scopeAttested: boolean;
    readonly authorityAttested: boolean;
    readonly assignmentAttested: boolean;
    readonly confidentialityAttested: boolean;
    readonly collaboratorAcknowledgementIds:
      readonly InstitutionalIdentifier[];
    readonly policy:
      GovernedWorkSubmissionPolicy;
    readonly now: ISODateTimeString;
    readonly hashCanonicalValue:
      (value: JsonValue) =>
        Promise<ContentHash> | ContentHash;
  },
): Promise<GovernedWorkSubmission> {
  assertWorkspaceMutable(input.workspace);

  if (
    input.policy.summaryRequired &&
    input.summary.trim().length === 0
  ) {
    throw new Error(
      "Governed work submission requires a summary.",
    );
  }

  const unresolved =
    input.workItems.filter(
      (item) =>
        item.state === "open" ||
        item.state === "in_review",
    );

  const blocking =
    unresolved.filter(
      (item) => item.blocking,
    );

  const incompleteAttestations =
    (input.policy.scopeAttestationRequired &&
      !input.scopeAttested) ||
    (input.policy.authorityAttestationRequired &&
      !input.authorityAttested) ||
    (input.policy.assignmentAttestationRequired &&
      !input.assignmentAttested) ||
    (input.policy.confidentialityAttestationRequired &&
      !input.confidentialityAttested);

  if (incompleteAttestations) {
    throw new Error(
      "Governed work submission attestations are incomplete.",
    );
  }

  const state:
    GovernedWorkSubmission["state"] =
    blocking.length > 0
      ? "held"
      : "submitted";

  const base = {
    submissionId: input.submissionId,
    workspaceId: input.workspace.workspaceId,
    submittedBySubjectId:
      input.submittedBySubjectId,
    submittedAt: input.now,
    summary: input.summary,
    workPerformed:
      [...input.workPerformed],
    evidenceInspectionIds:
      input.inspections.map(
        (inspection) =>
          inspection.inspectionId,
      ),
    unresolvedWorkItemIds:
      unresolved.map(
        (item) => item.workItemId,
      ),
    blockingWorkItemIds:
      blocking.map(
        (item) => item.workItemId,
      ),
    materialChangeIds:
      input.materialChanges.map(
        (change) =>
          change.materialChangeId,
      ),
    scopeDriftIds:
      input.scopeDrifts.map(
        (drift) => drift.scopeDriftId,
      ),
    scopeAttested:
      input.scopeAttested,
    authorityAttested:
      input.authorityAttested,
    assignmentAttested:
      input.assignmentAttested,
    confidentialityAttested:
      input.confidentialityAttested,
    collaboratorAcknowledgementIds:
      [...input.collaboratorAcknowledgementIds],
    state,
    submissionCreatedFinding: false as const,
    submissionCreatedDetermination: false as const,
    submissionCreatedRegistryEffect: false as const,
    submissionCreatedArtifactEffect: false as const,
  };

  const integrityHash =
    await input.hashCanonicalValue(
      base as unknown as JsonValue,
    );

  return deepFreeze({
    ...base,
    integrityHash,
  });
}

export function evaluateDeterminationReadiness(
  input: {
    readonly readinessEvaluationId:
      InstitutionalIdentifier;
    readonly workspace:
      GovernedWorkWorkspace;
    readonly submission:
      GovernedWorkSubmission;
    readonly assignmentCurrent:
      boolean;
    readonly authorityCurrent:
      boolean;
    readonly scopeCurrent:
      boolean;
    readonly conflictCurrent:
      boolean;
    readonly competenceCurrent:
      boolean;
    readonly inspections:
      readonly GovernedEvidenceInspection[];
    readonly workItems:
      readonly GovernedWorkItem[];
    readonly collaboratorAcknowledged:
      boolean;
    readonly materialChanges:
      readonly GovernedMaterialChange[];
    readonly policy:
      DeterminationReadinessPolicy;
    readonly evaluatedBy:
      InstitutionalIdentifier
      | "service";
    readonly now:
      ISODateTimeString;
  },
): DeterminationReadinessEvaluation {
  const reasons: string[] = [];
  const limitations: string[] = [];

  const evidenceInspectionComplete =
    input.inspections.length > 0 &&
    input.inspections.every(
      (inspection) =>
        inspection.state === "inspected",
    );

  const noCriticalIssues =
    !input.workItems.some(
      (item) =>
        item.severity === "critical" &&
        (item.state === "open" ||
          item.state === "in_review"),
    );

  const noUnresolvedBlockingItems =
    !input.workItems.some(
      (item) =>
        item.blocking &&
        (item.state === "open" ||
          item.state === "in_review"),
    );

  const versionLockCurrent =
    input.workspace.versionLock.current;

  const materialChangeReviewComplete =
    input.materialChanges.every(
      (change) =>
        change.state === "revalidated" ||
        change.state === "withdrawn" ||
        change.severity === "informational" ||
        change.severity === "minor",
    );

  const checks: readonly [
    boolean,
    boolean,
    string,
  ][] = [
    [
      input.policy.requireAssignmentCurrent,
      input.assignmentCurrent,
      "Assignment is not current.",
    ],
    [
      input.policy.requireAuthorityCurrent,
      input.authorityCurrent,
      "Authority is not current.",
    ],
    [
      input.policy.requireScopeCurrent,
      input.scopeCurrent,
      "Scope is not current.",
    ],
    [
      input.policy.requireConflictCurrent,
      input.conflictCurrent,
      "Conflict review is not current.",
    ],
    [
      input.policy.requireCompetenceCurrent,
      input.competenceCurrent,
      "Competence status is not current.",
    ],
    [
      input.policy.requireEvidenceInspectionComplete,
      evidenceInspectionComplete,
      "Evidence inspection is incomplete.",
    ],
    [
      input.policy.requireNoCriticalIssues,
      noCriticalIssues,
      "A critical issue remains open.",
    ],
    [
      input.policy.requireNoUnresolvedBlockingItems,
      noUnresolvedBlockingItems,
      "A blocking work item remains unresolved.",
    ],
    [
      input.policy.requireCollaboratorAcknowledgement,
      input.collaboratorAcknowledged,
      "Required collaborator acknowledgement is missing.",
    ],
    [
      input.policy.requireVersionLockCurrent,
      versionLockCurrent,
      "The record version lock is not current.",
    ],
    [
      input.policy.requireMaterialChangeReviewComplete,
      materialChangeReviewComplete,
      "Material change review is incomplete.",
    ],
  ];

  for (const [
    required,
    satisfied,
    reason,
  ] of checks) {
    if (required && !satisfied) {
      reasons.push(reason);
    }
  }

  const criticalReason =
    reasons.some(
      (reason) =>
        reason.includes("Authority") ||
        reason.includes("Assignment") ||
        reason.includes("version lock") ||
        reason.includes("critical issue"),
    );

  const state: DeterminationReadinessState =
    reasons.length === 0
      ? "ready"
      : criticalReason
        ? "held"
        : "conditionally_ready";

  limitations.push(
    TA14_GOVERNED_WORK_BOUNDARY,
  );

  return deepFreeze({
    readinessEvaluationId:
      input.readinessEvaluationId,
    workspaceId:
      input.workspace.workspaceId,
    submissionId:
      input.submission.submissionId,
    state,
    assignmentCurrent:
      input.assignmentCurrent,
    authorityCurrent:
      input.authorityCurrent,
    scopeCurrent:
      input.scopeCurrent,
    conflictCurrent:
      input.conflictCurrent,
    competenceCurrent:
      input.competenceCurrent,
    evidenceInspectionComplete,
    noCriticalIssues,
    noUnresolvedBlockingItems,
    collaboratorsAcknowledged:
      input.collaboratorAcknowledged,
    versionLockCurrent,
    materialChangeReviewComplete,
    reasons,
    limitations,
    evaluatedAt: input.now,
    evaluatedBy: input.evaluatedBy,
    readinessCreatedFinding: false,
    readinessCreatedDetermination: false,
    readinessCreatedRegistryEffect: false,
    readinessCreatedArtifactEffect: false,
  });
}

/* ========================================================================== *
 * Workspace lifecycle
 * ========================================================================== */

export function beginGovernedWork(
  workspace: GovernedWorkWorkspace,
  now: ISODateTimeString,
): GovernedWorkWorkspace {
  if (
    workspace.state !== "opened"
  ) {
    throw new Error(
      `Workspace ${workspace.workspaceId} cannot begin from state ${workspace.state}.`,
    );
  }

  return deepFreeze({
    ...workspace,
    state: "in_progress",
    updatedAt: now,
  });
}

export function holdGovernedWork(
  workspace: GovernedWorkWorkspace,
  now: ISODateTimeString,
): GovernedWorkWorkspace {
  assertWorkspaceMutable(workspace);

  return deepFreeze({
    ...workspace,
    state: "held",
    heldAt: now,
    updatedAt: now,
  });
}

export function escalateGovernedWork(
  workspace: GovernedWorkWorkspace,
  now: ISODateTimeString,
): GovernedWorkWorkspace {
  assertWorkspaceMutable(workspace);

  return deepFreeze({
    ...workspace,
    state: "escalated",
    escalatedAt: now,
    updatedAt: now,
  });
}

export function submitGovernedWork(
  workspace: GovernedWorkWorkspace,
  submission: GovernedWorkSubmission,
  readiness: DeterminationReadinessEvaluation,
  now: ISODateTimeString,
): GovernedWorkWorkspace {
  assertWorkspaceMutable(workspace);

  if (
    submission.workspaceId !==
    workspace.workspaceId
  ) {
    throw new Error(
      "Submission does not belong to workspace.",
    );
  }

  const state: GovernedWorkState =
    readiness.state === "ready"
      ? "ready_for_finding"
      : readiness.state === "held"
        ? "held"
        : "submitted";

  return deepFreeze({
    ...workspace,
    state,
    submission,
    readiness,
    submittedAt: now,
    updatedAt: now,
  });
}

export function completeGovernedWork(
  workspace: GovernedWorkWorkspace,
  now: ISODateTimeString,
): GovernedWorkWorkspace {
  if (
    workspace.state !== "ready_for_finding" &&
    workspace.state !== "submitted"
  ) {
    throw new Error(
      `Workspace ${workspace.workspaceId} cannot complete from state ${workspace.state}.`,
    );
  }

  return deepFreeze({
    ...workspace,
    state: "completed",
    completedAt: now,
    updatedAt: now,
  });
}

function assertWorkspaceMutable(
  workspace: GovernedWorkWorkspace,
): void {
  if (
    workspace.state === "completed" ||
    workspace.state === "withdrawn" ||
    workspace.state === "expired" ||
    workspace.state === "superseded"
  ) {
    throw new Error(
      `Workspace ${workspace.workspaceId} is immutable in state ${workspace.state}.`,
    );
  }
}

/* ========================================================================== *
 * Repository contracts
 * ========================================================================== */

export interface GovernedWorkDefinitionRepository {
  getDefinition(
    governedWorkDefinitionId:
      InstitutionalIdentifier,
    version?: string,
  ): Promise<GovernedWorkDefinition | null>;

  getActiveDefinition(
    assignmentType: string,
    at?: ISODateTimeString,
  ): Promise<GovernedWorkDefinition | null>;

  saveDefinition(
    definition: GovernedWorkDefinition,
  ): Promise<void>;
}

export interface GovernedWorkWorkspaceRepository {
  getWorkspace(
    workspaceId: InstitutionalIdentifier,
  ): Promise<GovernedWorkWorkspace | null>;

  saveWorkspace(
    workspace: GovernedWorkWorkspace,
  ): Promise<void>;

  listForAssignment(
    assignmentId: InstitutionalIdentifier,
  ): Promise<readonly GovernedWorkWorkspace[]>;
}

export interface GovernedWorkSessionRepository {
  getSession(
    sessionId: InstitutionalIdentifier,
  ): Promise<GovernedWorkSession | null>;

  saveSession(
    session: GovernedWorkSession,
  ): Promise<void>;

  listOpenForSubject(
    subjectId: InstitutionalIdentifier,
  ): Promise<readonly GovernedWorkSession[]>;
}

export interface GovernedWorkItemRepository {
  getItem(
    workItemId: InstitutionalIdentifier,
  ): Promise<GovernedWorkItem | null>;

  saveItem(
    item: GovernedWorkItem,
  ): Promise<void>;

  listForWorkspace(
    workspaceId: InstitutionalIdentifier,
  ): Promise<readonly GovernedWorkItem[]>;
}

export interface GovernedEvidenceInspectionRepository {
  getInspection(
    inspectionId: InstitutionalIdentifier,
  ): Promise<GovernedEvidenceInspection | null>;

  saveInspection(
    inspection: GovernedEvidenceInspection,
  ): Promise<void>;

  listForWorkspace(
    workspaceId: InstitutionalIdentifier,
  ): Promise<readonly GovernedEvidenceInspection[]>;
}

/* ========================================================================== *
 * In-memory repositories
 * ========================================================================== */

export class InMemoryGovernedWorkDefinitionRepository
  implements GovernedWorkDefinitionRepository
{
  private readonly values =
    new Map<string, GovernedWorkDefinition>();

  async getDefinition(
    governedWorkDefinitionId:
      InstitutionalIdentifier,
    version?: string,
  ): Promise<GovernedWorkDefinition | null> {
    if (version) {
      return (
        this.values.get(
          `${governedWorkDefinitionId}@${version}`,
        ) ?? null
      );
    }

    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.governedWorkDefinitionId ===
            governedWorkDefinitionId,
        )
        .sort(
          (a, b) =>
            Date.parse(b.effectiveAt) -
            Date.parse(a.effectiveAt),
        )[0] ?? null
    );
  }

  async getActiveDefinition(
    assignmentType: string,
    at = new Date().toISOString(),
  ): Promise<GovernedWorkDefinition | null> {
    const time = Date.parse(at);

    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.active &&
            value.supportedAssignmentTypes.includes(
              assignmentType,
            ),
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
    definition: GovernedWorkDefinition,
  ): Promise<void> {
    const validation =
      validateGovernedWorkDefinition(
        definition,
      );

    if (!validation.ok) {
      throw new GovernedWorkContractValidationError(
        "Cannot save invalid governed work definition.",
        validation.issues,
      );
    }

    const key =
      `${definition.governedWorkDefinitionId}@${definition.version}`;

    if (this.values.has(key)) {
      throw new Error(
        `Governed work definition ${key} already exists.`,
      );
    }

    this.values.set(
      key,
      deepFreeze(definition),
    );
  }
}

export class InMemoryGovernedWorkWorkspaceRepository
  implements GovernedWorkWorkspaceRepository
{
  private readonly values =
    new Map<
      InstitutionalIdentifier,
      GovernedWorkWorkspace
    >();

  async getWorkspace(
    workspaceId: InstitutionalIdentifier,
  ): Promise<GovernedWorkWorkspace | null> {
    return this.values.get(workspaceId) ?? null;
  }

  async saveWorkspace(
    workspace: GovernedWorkWorkspace,
  ): Promise<void> {
    const validation =
      validateGovernedWorkWorkspace(
        workspace,
      );

    if (!validation.ok) {
      throw new GovernedWorkContractValidationError(
        "Cannot save invalid governed work workspace.",
        validation.issues,
      );
    }

    this.values.set(
      workspace.workspaceId,
      deepFreeze(workspace),
    );
  }

  async listForAssignment(
    assignmentId: InstitutionalIdentifier,
  ): Promise<readonly GovernedWorkWorkspace[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (workspace) =>
            workspace.assignmentId ===
            assignmentId,
        ),
    );
  }
}

export class InMemoryGovernedWorkSessionRepository
  implements GovernedWorkSessionRepository
{
  private readonly values =
    new Map<
      InstitutionalIdentifier,
      GovernedWorkSession
    >();

  async getSession(
    sessionId: InstitutionalIdentifier,
  ): Promise<GovernedWorkSession | null> {
    return this.values.get(sessionId) ?? null;
  }

  async saveSession(
    session: GovernedWorkSession,
  ): Promise<void> {
    this.values.set(
      session.sessionId,
      deepFreeze(session),
    );
  }

  async listOpenForSubject(
    subjectId: InstitutionalIdentifier,
  ): Promise<readonly GovernedWorkSession[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (session) =>
            session.subjectId === subjectId &&
            session.state === "open",
        ),
    );
  }
}

export class InMemoryGovernedWorkItemRepository
  implements GovernedWorkItemRepository
{
  private readonly values =
    new Map<
      InstitutionalIdentifier,
      GovernedWorkItem
    >();

  async getItem(
    workItemId: InstitutionalIdentifier,
  ): Promise<GovernedWorkItem | null> {
    return this.values.get(workItemId) ?? null;
  }

  async saveItem(
    item: GovernedWorkItem,
  ): Promise<void> {
    this.values.set(
      item.workItemId,
      deepFreeze(item),
    );
  }

  async listForWorkspace(
    workspaceId: InstitutionalIdentifier,
  ): Promise<readonly GovernedWorkItem[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (item) =>
            item.workspaceId === workspaceId,
        ),
    );
  }
}

export class InMemoryGovernedEvidenceInspectionRepository
  implements GovernedEvidenceInspectionRepository
{
  private readonly values =
    new Map<
      InstitutionalIdentifier,
      GovernedEvidenceInspection
    >();

  async getInspection(
    inspectionId: InstitutionalIdentifier,
  ): Promise<GovernedEvidenceInspection | null> {
    return this.values.get(inspectionId) ?? null;
  }

  async saveInspection(
    inspection: GovernedEvidenceInspection,
  ): Promise<void> {
    this.values.set(
      inspection.inspectionId,
      deepFreeze(inspection),
    );
  }

  async listForWorkspace(
    workspaceId: InstitutionalIdentifier,
  ): Promise<readonly GovernedEvidenceInspection[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (inspection) =>
            inspection.workspaceId ===
            workspaceId,
        ),
    );
  }
}

/* ========================================================================== *
 * Service orchestration
 * ========================================================================== */

export interface GovernedWorkIdentifierFactory {
  readonly createWorkspaceId:
    () => InstitutionalIdentifier;
  readonly createParticipantId:
    () => InstitutionalIdentifier;
  readonly createVersionLockId:
    () => InstitutionalIdentifier;
  readonly createSessionId:
    () => InstitutionalIdentifier;
  readonly createWorkItemId:
    () => InstitutionalIdentifier;
  readonly createInspectionId:
    () => InstitutionalIdentifier;
  readonly createScopeDriftId:
    () => InstitutionalIdentifier;
  readonly createMaterialChangeId:
    () => InstitutionalIdentifier;
  readonly createSubmissionId:
    () => InstitutionalIdentifier;
  readonly createReadinessEvaluationId:
    () => InstitutionalIdentifier;
}

export interface GovernedWorkServiceDependencies {
  readonly definitions:
    GovernedWorkDefinitionRepository;
  readonly workspaces:
    GovernedWorkWorkspaceRepository;
  readonly sessions:
    GovernedWorkSessionRepository;
  readonly workItems:
    GovernedWorkItemRepository;
  readonly inspections:
    GovernedEvidenceInspectionRepository;
  readonly ids:
    GovernedWorkIdentifierFactory;
  readonly now:
    () => ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) =>
      Promise<ContentHash> | ContentHash;
  readonly events?: AcademyEventService;
}

export class GovernedWorkService {
  constructor(
    private readonly dependencies:
      GovernedWorkServiceDependencies,
  ) {}

  async openWorkspace(
    input: {
      readonly assignment:
        InstitutionalAssignment;
      readonly targetRecordVersion:
        string;
      readonly targetRecordContentHash:
        ContentHash;
    },
  ): Promise<GovernedWorkWorkspace> {
    const definition =
      await this.dependencies.definitions
        .getActiveDefinition(
          input.assignment.assignmentType,
          this.dependencies.now(),
        );

    if (!definition) {
      throw new Error(
        `No active governed work definition exists for assignment type ${input.assignment.assignmentType}.`,
      );
    }

    const workspace =
      await createGovernedWorkWorkspace({
        workspaceId:
          this.dependencies.ids
            .createWorkspaceId(),
        definition,
        assignment:
          input.assignment,
        leadParticipantId:
          this.dependencies.ids
            .createParticipantId(),
        targetRecordVersion:
          input.targetRecordVersion,
        targetRecordContentHash:
          input.targetRecordContentHash,
        versionLockId:
          this.dependencies.ids
            .createVersionLockId(),
        now:
          this.dependencies.now(),
        hashCanonicalValue:
          this.dependencies.hashCanonicalValue,
      });

    await this.dependencies.workspaces
      .saveWorkspace(workspace);

    return workspace;
  }

  async openSession(
    workspaceId: InstitutionalIdentifier,
    subjectId: InstitutionalIdentifier,
  ): Promise<GovernedWorkSession> {
    const workspace =
      await this.requireWorkspace(workspaceId);

    const definition =
      await this.dependencies.definitions
        .getDefinition(
          workspace.governedWorkDefinitionId,
        );

    if (!definition) {
      throw new Error(
        "Governed work definition was not found.",
      );
    }

    const openSessions =
      await this.dependencies.sessions
        .listOpenForSubject(subjectId);

    const session =
      openGovernedWorkSession({
        sessionId:
          this.dependencies.ids
            .createSessionId(),
        workspace,
        subjectId,
        policy:
          definition.sessionPolicy,
        currentlyOpenSessions:
          openSessions,
        now:
          this.dependencies.now(),
      });

    await this.dependencies.sessions
      .saveSession(session);

    return session;
  }

  private async requireWorkspace(
    workspaceId: InstitutionalIdentifier,
  ): Promise<GovernedWorkWorkspace> {
    const workspace =
      await this.dependencies.workspaces
        .getWorkspace(workspaceId);

    if (!workspace) {
      throw new Error(
        `Governed work workspace ${workspaceId} was not found.`,
      );
    }

    return workspace;
  }
}

/* ========================================================================== *
 * Canonical definition
 * ========================================================================== */

export const GOVERNANCE_REVIEW_WORK_DEFINITION_ID =
  "TA14-GW-DEF-GOVERNANCE-REVIEW-000001" as const;

export const governanceReviewWorkDefinition:
  GovernedWorkDefinition = deepFreeze({
    governedWorkDefinitionId:
      GOVERNANCE_REVIEW_WORK_DEFINITION_ID,
    title:
      "Bounded AI Governance Review Workspace",
    description:
      "Provides a controlled workspace for attributable evidence inspection, analysis, collaboration, issue resolution, and determination-readiness evaluation under a current assignment.",
    version: "3.0",
    active: true,

    supportedAssignmentTypes: [
      "review",
      "registry_review",
      "continuity_review",
    ],

    allowedRoles: [
      "authorized_reviewer",
      "academy_standards_reviewer",
      "institutional_administrator",
      "evidence_steward",
    ],

    allowedRecordTypes: [
      "review",
      "demonstration",
      "governed_record",
      "evidence_package",
      "finding",
      "determination",
    ],

    allowedWorkItemTypes:
      GOVERNED_WORK_ITEM_TYPES,

    evidencePolicy: {
      permittedEvidenceClasses: [
        "public",
        "controlled",
        "confidential",
        "technical",
        "authority",
        "continuity",
        "runtime",
        "outcome",
      ],
      prohibitedEvidenceClasses: [
        "unauthorized",
        "unattributed",
        "tampered",
      ],
      requireAttribution: true,
      requirePermission: true,
      requireCurrentVersion: true,
      requireIntegrityHash: true,
      requireProvenance: true,
      allowConfidentialEvidence: true,
      allowExternallyHostedEvidence: true,
      rejectUnknownEvidenceClass: true,
      staleEvidenceDecision: "HOLD",
      prohibitedEvidenceDecision: "REJECT",
    },

    sessionPolicy: {
      maximumOpenSessionsPerSubject: 2,
      maximumSessionHours: 12,
      inactivityTimeoutMinutes: 60,
      explicitCloseRequired: true,
      preserveSessionEvents: true,
      sessionResumeAllowed: true,
      concurrentSessionDecision: "HOLD",
    },

    collaborationPolicy: {
      collaborationAllowed: true,
      maximumCollaborators: 8,
      requireLeadReviewer: true,
      dualReviewRequired: false,
      independentReviewRequired: false,
      conflictCheckRequired: true,
      authorityCheckRequired: true,
      assignmentCheckRequired: true,
      confidentialityAttestationRequired: true,
      collaboratorRemovalRequiresReason: true,
    },

    scopePolicy: {
      checkOnWorkspaceOpen: true,
      checkOnSessionOpen: true,
      checkOnEvidenceInspection: true,
      checkOnWorkItemCreate: true,
      checkOnSubmission: true,
      driftTolerance: "low",
      materialDriftDecision:
        "RETURN_FOR_CORRECTION",
      criticalDriftDecision: "ESCALATE",
    },

    continuityPolicy: {
      materialChangeTriggers: [
        "record_version_changed",
        "evidence_version_changed",
        "authority_changed",
        "assignment_changed",
        "scope_changed",
        "law_changed",
        "standard_changed",
        "material_fact_changed",
      ],
      revalidateAssignmentOnMaterialChange: true,
      revalidateAuthorityOnMaterialChange: true,
      revalidateEvidenceOnMaterialChange: true,
      lockWorkspaceOnCriticalChange: true,
      preservePriorVersion: true,
      preserveEarliestFailure: true,
    },

    submissionPolicy: {
      summaryRequired: true,
      unresolvedIssuesRequired: true,
      evidenceInventoryRequired: true,
      scopeAttestationRequired: true,
      authorityAttestationRequired: true,
      assignmentAttestationRequired: true,
      confidentialityAttestationRequired: true,
      collaboratorAcknowledgementRequired: false,
      submissionCreatesFinding: false,
      submissionCreatesDetermination: false,
      submissionCreatesRegistryEffect: false,
      submissionCreatesArtifactEffect: false,
    },

    readinessPolicy: {
      requireAssignmentCurrent: true,
      requireAuthorityCurrent: true,
      requireScopeCurrent: true,
      requireConflictCurrent: true,
      requireCompetenceCurrent: true,
      requireEvidenceInspectionComplete: true,
      requireNoCriticalIssues: true,
      requireNoUnresolvedBlockingItems: true,
      requireCollaboratorAcknowledgement: false,
      requireVersionLockCurrent: true,
      requireMaterialChangeReviewComplete: true,
    },

    retentionPolicy: {
      retainWorkspaceDays: 2555,
      retainSessionsDays: 2555,
      retainItemsDays: 2555,
      retainEvidenceInspectionsDays: 2555,
      preserveCompletedWorkspace: true,
      preserveWithdrawnWorkspace: true,
      preserveSupersededWorkspace: true,
    },

    publicProjectionAllowed: false,

    governedWorkBoundary:
      TA14_GOVERNED_WORK_BOUNDARY,

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

export function createDeterministicGovernedWorkDependencies(
  startAt = "2026-08-04T17:00:00.000Z",
): {
  readonly ids:
    GovernedWorkIdentifierFactory;
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
      createWorkspaceId: () =>
        next("TA14-GW"),
      createParticipantId: () =>
        next("TA14-GW-PART"),
      createVersionLockId: () =>
        next("TA14-GW-LOCK"),
      createSessionId: () =>
        next("TA14-GW-SESSION"),
      createWorkItemId: () =>
        next("TA14-GW-ITEM"),
      createInspectionId: () =>
        next("TA14-GW-INSPECT"),
      createScopeDriftId: () =>
        next("TA14-GW-DRIFT"),
      createMaterialChangeId: () =>
        next("TA14-GW-CHANGE"),
      createSubmissionId: () =>
        next("TA14-GW-SUBMIT"),
      createReadinessEvaluationId: () =>
        next("TA14-GW-READY"),
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

export interface GovernedWorkEngineSelfCheck {
  readonly ok: boolean;
  readonly definitionValid: boolean;
  readonly governedWorkCreatedFinding: false;
  readonly governedWorkCreatedDetermination: false;
  readonly governedWorkCreatedRegistryEffect: false;
  readonly governedWorkCreatedArtifactEffect: false;
  readonly governedWorkCreatedExecution: false;
  readonly issues: readonly string[];
}

export function runGovernedWorkEngineSelfCheck():
  GovernedWorkEngineSelfCheck {
  const issues: string[] = [];

  const validation =
    validateGovernedWorkDefinition(
      governanceReviewWorkDefinition,
    );

  if (!validation.ok) {
    issues.push(
      "Canonical governance review work definition failed validation.",
    );
  }

  return {
    ok: issues.length === 0,
    definitionValid: validation.ok,
    governedWorkCreatedFinding: false,
    governedWorkCreatedDetermination: false,
    governedWorkCreatedRegistryEffect: false,
    governedWorkCreatedArtifactEffect: false,
    governedWorkCreatedExecution: false,
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
    GovernedWorkValidationIssue[],
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
    GovernedWorkValidationIssue[],
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
    GovernedWorkValidationIssue[],
  path: string,
  code: GovernedWorkValidationCode,
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
): GovernedWorkValidationResult<T> {
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
    GovernedWorkValidationIssue[],
): GovernedWorkValidationResult<T> {
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

const governedWorkContracts = {
  engineId:
    TA14_GOVERNED_WORK_ENGINE_ID,

  engineVersion:
    TA14_GOVERNED_WORK_ENGINE_VERSION,

  boundary:
    TA14_GOVERNED_WORK_BOUNDARY,

  governedWorkStates:
    GOVERNED_WORK_STATES,

  sessionStates:
    GOVERNED_WORK_SESSION_STATES,

  workItemTypes:
    GOVERNED_WORK_ITEM_TYPES,

  validateGovernedWorkDefinition,
  validateGovernedWorkWorkspace,

  createGovernedWorkWorkspace,
  openGovernedWorkSession,
  pauseGovernedWorkSession,
  resumeGovernedWorkSession,
  closeGovernedWorkSession,

  createGovernedWorkItem,
  resolveGovernedWorkItem,
  inspectGovernedEvidence,
  detectScopeDrift,
  createGovernedMaterialChange,

  createGovernedWorkSubmission,
  evaluateDeterminationReadiness,

  beginGovernedWork,
  holdGovernedWork,
  escalateGovernedWork,
  submitGovernedWork,
  completeGovernedWork,

  InMemoryGovernedWorkDefinitionRepository,
  InMemoryGovernedWorkWorkspaceRepository,
  InMemoryGovernedWorkSessionRepository,
  InMemoryGovernedWorkItemRepository,
  InMemoryGovernedEvidenceInspectionRepository,

  GovernedWorkService,

  governanceReviewWorkDefinition,
  createDeterministicGovernedWorkDependencies,
  runGovernedWorkEngineSelfCheck,
};

export default governedWorkContracts;
