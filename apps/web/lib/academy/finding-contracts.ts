/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * ACD-010 — Finding Contracts
 *
 * Create:
 *   apps/web/lib/academy/finding-contracts.ts
 *
 * Purpose:
 *   Convert completed, bounded governed work into an attributable
 *   institutional finding without allowing the finding itself to become
 *   a determination, Registry publication, execution artifact, or execution.
 *
 * Constitutional chain:
 *   Governed Work -> Finding -> Determination -> Registry Review
 *   -> Registry Publication -> Execution Artifact
 *
 * Hard boundaries:
 *   Finding != Determination
 *   Finding != Registry Publication
 *   Finding != Execution Artifact
 *   Finding != Execution
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
  AcademyEventService,
} from "./academy-events";

import type {
  DeterminationReadinessEvaluation,
  GovernedEvidenceInspection,
  GovernedMaterialChange,
  GovernedScopeDriftRecord,
  GovernedWorkItem,
  GovernedWorkSubmission,
  GovernedWorkWorkspace,
} from "./governed-work-contracts";

/* ========================================================================== *
 * Engine identity
 * ========================================================================== */

export const TA14_FINDING_ENGINE_VERSION = "3.0" as const;

export const TA14_FINDING_ENGINE_ID =
  "TA14-ACD-FINDING-ENGINE-000001" as const;

export const TA14_FINDING_BOUNDARY =
  "A finding records what completed governed work supports within a bounded scope. It does not itself commit a determination, publish a Registry record, create an execution artifact, authorize execution, or produce runtime effect." as const;

/* ========================================================================== *
 * Canonical enumerations
 * ========================================================================== */

export const FINDING_STATES = [
  "draft",
  "under_review",
  "returned_for_correction",
  "held",
  "escalated",
  "accepted",
  "amended",
  "superseded",
  "withdrawn",
  "invalidated",
] as const;

export type FindingState =
  (typeof FINDING_STATES)[number];

export const FINDING_TYPES = [
  "supported",
  "conditionally_supported",
  "partially_supported",
  "unsupported",
  "inconclusive",
  "conflicting",
  "outside_scope",
  "not_reviewed",
  "revalidation_required",
] as const;

export type FindingType =
  (typeof FINDING_TYPES)[number];

export const FINDING_CONFIDENCE_LEVELS = [
  "not_assessed",
  "low",
  "moderate",
  "high",
  "very_high",
] as const;

export type FindingConfidenceLevel =
  (typeof FINDING_CONFIDENCE_LEVELS)[number];

export const FINDING_EVIDENCE_RELATIONSHIPS = [
  "supports",
  "partially_supports",
  "contradicts",
  "qualifies",
  "limits",
  "contextualizes",
  "unresolved",
  "excluded",
] as const;

export type FindingEvidenceRelationship =
  (typeof FINDING_EVIDENCE_RELATIONSHIPS)[number];

export const FINDING_REVIEW_POSITIONS = [
  "concur",
  "concur_with_limitations",
  "dissent",
  "abstain",
  "recused",
] as const;

export type FindingReviewPosition =
  (typeof FINDING_REVIEW_POSITIONS)[number];

export const FINDING_CHANGE_TYPES = [
  "clerical_correction",
  "clarification",
  "limitation_added",
  "limitation_removed",
  "evidence_added",
  "evidence_removed",
  "scope_changed",
  "confidence_changed",
  "finding_type_changed",
  "material_amendment",
  "supersession",
  "withdrawal",
  "invalidation",
] as const;

export type FindingChangeType =
  (typeof FINDING_CHANGE_TYPES)[number];

export const FINDING_PROJECTION_CLASSES = [
  "public",
  "authenticated",
  "organization",
  "controlled",
  "confidential",
  "service",
] as const;

export type FindingProjectionClass =
  (typeof FINDING_PROJECTION_CLASSES)[number];

/* ========================================================================== *
 * Definition and policy contracts
 * ========================================================================== */

export interface FindingDefinition {
  readonly findingDefinitionId: InstitutionalIdentifier;
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly active: boolean;

  readonly supportedWorkspaceTypes: readonly string[];
  readonly allowedRoles: readonly InstitutionalRole[];
  readonly allowedRecordTypes: readonly InstitutionalRecordType[];
  readonly permittedFindingTypes: readonly FindingType[];

  readonly evidencePolicy: FindingEvidencePolicy;
  readonly confidencePolicy: FindingConfidencePolicy;
  readonly reviewPolicy: FindingReviewPolicy;
  readonly amendmentPolicy: FindingAmendmentPolicy;
  readonly projectionPolicy: FindingProjectionPolicy;
  readonly continuityPolicy: FindingContinuityPolicy;
  readonly retentionPolicy: FindingRetentionPolicy;

  readonly findingBoundary: string;
  readonly nonSubstitutionRule:
    typeof TA14_ACADEMY_NON_SUBSTITUTION_RULE;

  readonly contentHash: ContentHash;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
}

export interface FindingEvidencePolicy {
  readonly minimumSupportingEvidenceCount: number;
  readonly allowConflictingEvidence: boolean;
  readonly allowExcludedEvidenceReferences: boolean;
  readonly requireAttribution: boolean;
  readonly requirePermission: boolean;
  readonly requireCurrentVersion: boolean;
  readonly requireIntegrityVerification: boolean;
  readonly requireProvenanceVerification: boolean;
  readonly requireRelevance: boolean;
  readonly requireEvidenceRelationship: boolean;
  readonly preserveRejectedEvidenceReferences: boolean;
  readonly preserveEarliestFailure: true;
}

export interface FindingConfidencePolicy {
  readonly confidenceRequired: boolean;
  readonly confidenceMethod:
    | "qualitative"
    | "weighted_evidence"
    | "reviewer_judgment"
    | "hybrid";
  readonly allowVeryHighConfidence: boolean;
  readonly requireRationaleByLevel: boolean;
  readonly maximumConfidenceWithConflict:
    FindingConfidenceLevel;
  readonly maximumConfidenceWithMaterialLimitation:
    FindingConfidenceLevel;
  readonly maximumConfidenceWithPartialEvidence:
    FindingConfidenceLevel;
}

export interface FindingReviewPolicy {
  readonly reviewRequired: boolean;
  readonly minimumReviewerCount: number;
  readonly independentReviewerRequired: boolean;
  readonly dualReviewRequired: boolean;
  readonly panelRequired: boolean;
  readonly conflictCheckRequired: boolean;
  readonly authorityCheckRequired: boolean;
  readonly assignmentCheckRequired: boolean;
  readonly dissentAllowed: boolean;
  readonly abstentionAllowed: boolean;
  readonly unanimityRequired: boolean;
  readonly disputedFindingDecision:
    | "HOLD"
    | "ESCALATE";
}

export interface FindingAmendmentPolicy {
  readonly amendmentAllowed: boolean;
  readonly materialAmendmentCreatesNewVersion: boolean;
  readonly clericalCorrectionCreatesNewVersion: boolean;
  readonly preservePriorVersion: true;
  readonly requireReason: boolean;
  readonly requireReviewerApproval: boolean;
  readonly supersessionAllowed: boolean;
  readonly withdrawalAllowed: boolean;
  readonly invalidationAllowed: boolean;
}

export interface FindingProjectionPolicy {
  readonly publicProjectionAllowed: boolean;
  readonly authenticatedProjectionAllowed: boolean;
  readonly controlledProjectionAllowed: boolean;
  readonly confidentialProjectionAllowed: boolean;
  readonly protectedFields: readonly string[];
  readonly publicFields: readonly string[];
  readonly redactSubjectIdentityPublicly: boolean;
  readonly redactEvidenceIdentifiersPublicly: boolean;
  readonly exposeConfidencePublicly: boolean;
  readonly exposeDissentPublicly: boolean;
  readonly exposeLimitationsPublicly: boolean;
}

export interface FindingContinuityPolicy {
  readonly materialChangeTriggers: readonly string[];
  readonly evidenceChangeRequiresReview: boolean;
  readonly scopeChangeRequiresReview: boolean;
  readonly authorityChangeRequiresReview: boolean;
  readonly assignmentChangeRequiresReview: boolean;
  readonly lawChangeRequiresReview: boolean;
  readonly standardChangeRequiresReview: boolean;
  readonly criticalChangeHoldsFinding: boolean;
  readonly preserveHistoricalFinding: true;
}

export interface FindingRetentionPolicy {
  readonly retainFindingDays?: number;
  readonly retainReviewDays?: number;
  readonly retainAmendmentDays?: number;
  readonly retainDissentDays?: number;
  readonly preserveAcceptedFinding: true;
  readonly preserveSupersededFinding: true;
  readonly preserveWithdrawnFinding: true;
  readonly preserveInvalidatedFinding: true;
}

/* ========================================================================== *
 * Core finding record
 * ========================================================================== */

export interface InstitutionalFinding {
  readonly findingId: InstitutionalIdentifier;
  readonly findingDefinitionId: InstitutionalIdentifier;
  readonly workspaceId: InstitutionalIdentifier;
  readonly assignmentId: InstitutionalIdentifier;
  readonly submissionId: InstitutionalIdentifier;
  readonly readinessEvaluationId: InstitutionalIdentifier;

  readonly targetRecordId: InstitutionalIdentifier;
  readonly targetRecordType: InstitutionalRecordType;
  readonly targetRecordVersion: string;

  readonly findingType: FindingType;
  readonly state: FindingState;
  readonly title: string;
  readonly statement: string;
  readonly rationale: string;

  readonly confidence: FindingConfidence;
  readonly evidenceMappings: readonly FindingEvidenceMapping[];
  readonly scope: FindingScope;
  readonly assumptions: readonly FindingAssumption[];
  readonly limitations: readonly FindingLimitation[];
  readonly dependencies: readonly FindingDependency[];
  readonly unresolvedIssues: readonly FindingUnresolvedIssue[];

  readonly reviewerPositions: readonly FindingReviewerPosition[];
  readonly concurrence: FindingConcurrence;
  readonly minorityOpinions: readonly FindingMinorityOpinion[];
  readonly dissentingOpinions: readonly FindingDissentingOpinion[];

  readonly createdBySubjectId: InstitutionalIdentifier;
  readonly createdAt: ISODateTimeString;
  readonly reviewedAt?: ISODateTimeString;
  readonly acceptedAt?: ISODateTimeString;
  readonly amendedAt?: ISODateTimeString;
  readonly supersededAt?: ISODateTimeString;
  readonly withdrawnAt?: ISODateTimeString;
  readonly invalidatedAt?: ISODateTimeString;

  readonly version: string;
  readonly priorFindingId?: InstitutionalIdentifier;
  readonly priorVersion?: string;
  readonly supersededByFindingId?: InstitutionalIdentifier;

  readonly findingCreatedDetermination: false;
  readonly findingCreatedRegistryPublication: false;
  readonly findingCreatedArtifact: false;
  readonly findingCreatedExecution: false;

  readonly correlationId: CorrelationIdentifier;
  readonly integrityHash: ContentHash;
}

export interface FindingConfidence {
  readonly level: FindingConfidenceLevel;
  readonly score?: number;
  readonly method:
    FindingConfidencePolicy["confidenceMethod"];
  readonly rationale: string;
  readonly supportingEvidenceCount: number;
  readonly contradictingEvidenceCount: number;
  readonly unresolvedEvidenceCount: number;
  readonly materialLimitationCount: number;
  readonly calculatedAt: ISODateTimeString;
  readonly calculatedBy:
    | "service"
    | InstitutionalIdentifier;
}

export interface FindingEvidenceMapping {
  readonly mappingId: InstitutionalIdentifier;
  readonly findingId?: InstitutionalIdentifier;
  readonly evidenceId: InstitutionalIdentifier;
  readonly evidenceVersion: string;
  readonly inspectionId: InstitutionalIdentifier;
  readonly relationship: FindingEvidenceRelationship;
  readonly weight:
    | "minimal"
    | "limited"
    | "moderate"
    | "substantial"
    | "decisive";
  readonly proposition: string;
  readonly rationale: string;

  readonly attributable: boolean;
  readonly permitted: boolean;
  readonly current: boolean;
  readonly integrityVerified: boolean;
  readonly provenanceVerified: boolean;
  readonly relevant: boolean;

  readonly limitations: readonly string[];
  readonly mappedBySubjectId: InstitutionalIdentifier;
  readonly mappedAt: ISODateTimeString;
}

export interface FindingScope {
  readonly scopeId: InstitutionalIdentifier;
  readonly includedRecordIds: readonly InstitutionalIdentifier[];
  readonly includedRecordTypes: readonly InstitutionalRecordType[];
  readonly includedActionTypes: readonly string[];
  readonly includedDecisionTypes: readonly string[];
  readonly includedOrganizations: readonly InstitutionalIdentifier[];
  readonly includedJurisdictions: readonly string[];
  readonly includedVersions: readonly string[];
  readonly excludedElements: readonly FindingScopeExclusion[];
  readonly scopeStatement: string;
  readonly verifiedAgainstAssignment: boolean;
  readonly verifiedAgainstWorkspace: boolean;
  readonly verifiedAt: ISODateTimeString;
}

export interface FindingScopeExclusion {
  readonly exclusionId: string;
  readonly category:
    | "record"
    | "action"
    | "decision"
    | "organization"
    | "jurisdiction"
    | "version"
    | "claim"
    | "evidence"
    | "outcome"
    | "other";
  readonly description: string;
  readonly rationale: string;
}

export interface FindingAssumption {
  readonly assumptionId: InstitutionalIdentifier;
  readonly statement: string;
  readonly material: boolean;
  readonly verified: boolean;
  readonly verificationEvidenceIds: readonly InstitutionalIdentifier[];
  readonly consequencesIfFalse: readonly string[];
  readonly createdBySubjectId: InstitutionalIdentifier;
  readonly createdAt: ISODateTimeString;
}

export interface FindingLimitation {
  readonly limitationId: InstitutionalIdentifier;
  readonly type:
    | "scope"
    | "evidence"
    | "authority"
    | "assignment"
    | "version"
    | "time"
    | "jurisdiction"
    | "confidentiality"
    | "method"
    | "confidence"
    | "continuity"
    | "other";
  readonly description: string;
  readonly material: boolean;
  readonly affectsConfidence: boolean;
  readonly affectsFindingType: boolean;
  readonly requiresDisclosure: boolean;
  readonly createdBySubjectId: InstitutionalIdentifier;
  readonly createdAt: ISODateTimeString;
}

export interface FindingDependency {
  readonly dependencyId: InstitutionalIdentifier;
  readonly type:
    | "record"
    | "evidence"
    | "authority"
    | "assignment"
    | "credential"
    | "standard"
    | "law"
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

export interface FindingUnresolvedIssue {
  readonly unresolvedIssueId: InstitutionalIdentifier;
  readonly sourceWorkItemId?: InstitutionalIdentifier;
  readonly title: string;
  readonly description: string;
  readonly severity:
    | "low"
    | "moderate"
    | "high"
    | "critical";
  readonly blocking: boolean;
  readonly disposition:
    | "accepted_limitation"
    | "requires_correction"
    | "requires_revalidation"
    | "requires_escalation"
    | "outside_scope";
  readonly rationale: string;
}

/* ========================================================================== *
 * Reviewer positions, concurrence, and dissent
 * ========================================================================== */

export interface FindingReviewerPosition {
  readonly reviewerPositionId: InstitutionalIdentifier;
  readonly findingId?: InstitutionalIdentifier;
  readonly reviewerSubjectId: InstitutionalIdentifier;
  readonly reviewerRole: InstitutionalRole;
  readonly position: FindingReviewPosition;
  readonly rationale: string;
  readonly limitations: readonly string[];
  readonly conflictChecked: boolean;
  readonly authorityChecked: boolean;
  readonly assignmentChecked: boolean;
  readonly competenceChecked: boolean;
  readonly recordedAt: ISODateTimeString;
  readonly integrityHash: ContentHash;
}

export interface FindingConcurrence {
  readonly concurrenceId: InstitutionalIdentifier;
  readonly state:
    | "not_evaluated"
    | "unanimous"
    | "majority"
    | "qualified"
    | "disputed"
    | "insufficient_reviewers";
  readonly concurringReviewerIds: readonly InstitutionalIdentifier[];
  readonly qualifiedReviewerIds: readonly InstitutionalIdentifier[];
  readonly dissentingReviewerIds: readonly InstitutionalIdentifier[];
  readonly abstainingReviewerIds: readonly InstitutionalIdentifier[];
  readonly recusedReviewerIds: readonly InstitutionalIdentifier[];
  readonly minimumReviewerCountSatisfied: boolean;
  readonly independenceSatisfied: boolean;
  readonly unanimitySatisfied: boolean;
  readonly evaluatedAt: ISODateTimeString;
}

export interface FindingMinorityOpinion {
  readonly opinionId: InstitutionalIdentifier;
  readonly findingId?: InstitutionalIdentifier;
  readonly reviewerSubjectIds: readonly InstitutionalIdentifier[];
  readonly title: string;
  readonly statement: string;
  readonly rationale: string;
  readonly evidenceMappingIds: readonly InstitutionalIdentifier[];
  readonly limitations: readonly string[];
  readonly recordedAt: ISODateTimeString;
}

export interface FindingDissentingOpinion {
  readonly dissentId: InstitutionalIdentifier;
  readonly findingId?: InstitutionalIdentifier;
  readonly reviewerSubjectId: InstitutionalIdentifier;
  readonly statement: string;
  readonly rationale: string;
  readonly proposedFindingType?: FindingType;
  readonly evidenceMappingIds: readonly InstitutionalIdentifier[];
  readonly limitations: readonly string[];
  readonly recordedAt: ISODateTimeString;
  readonly integrityHash: ContentHash;
}

/* ========================================================================== *
 * Amendment, supersession, withdrawal, and invalidation
 * ========================================================================== */

export interface FindingChangeRecord {
  readonly changeId: InstitutionalIdentifier;
  readonly findingId: InstitutionalIdentifier;
  readonly priorVersion: string;
  readonly newVersion?: string;
  readonly changeType: FindingChangeType;
  readonly reason: string;
  readonly changedFields: readonly string[];
  readonly priorValues?: Readonly<Record<string, JsonValue>>;
  readonly newValues?: Readonly<Record<string, JsonValue>>;
  readonly requestedBySubjectId: InstitutionalIdentifier;
  readonly approvedBySubjectIds: readonly InstitutionalIdentifier[];
  readonly requestedAt: ISODateTimeString;
  readonly approvedAt?: ISODateTimeString;
  readonly effectiveAt?: ISODateTimeString;
  readonly integrityHash: ContentHash;
}

export interface FindingSupersession {
  readonly supersessionId: InstitutionalIdentifier;
  readonly priorFindingId: InstitutionalIdentifier;
  readonly priorVersion: string;
  readonly newFindingId: InstitutionalIdentifier;
  readonly newVersion: string;
  readonly reason: string;
  readonly supersededAt: ISODateTimeString;
  readonly supersededBySubjectIds: readonly InstitutionalIdentifier[];
}

export interface FindingContinuityAction {
  readonly continuityActionId: InstitutionalIdentifier;
  readonly findingId: InstitutionalIdentifier;
  readonly triggerType: string;
  readonly severity:
    | "low"
    | "moderate"
    | "high"
    | "critical";
  readonly requiredAction:
    | "review"
    | "amend"
    | "supersede"
    | "hold"
    | "withdraw"
    | "invalidate";
  readonly priorState: FindingState;
  readonly newState: FindingState;
  readonly affectedEvidenceIds: readonly InstitutionalIdentifier[];
  readonly affectedDependencyIds: readonly InstitutionalIdentifier[];
  readonly createdAt: ISODateTimeString;
  readonly dueAt?: ISODateTimeString;
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

export type FindingValidationCode =
  | "required"
  | "invalid_type"
  | "invalid_value"
  | "invalid_state"
  | "invalid_hash"
  | "invalid_date"
  | "invalid_role"
  | "invalid_record_type"
  | "workspace_not_ready"
  | "submission_not_accepted"
  | "readiness_not_ready"
  | "insufficient_evidence"
  | "evidence_not_attributable"
  | "evidence_not_permitted"
  | "evidence_not_current"
  | "evidence_integrity_failed"
  | "evidence_provenance_failed"
  | "evidence_not_relevant"
  | "scope_not_verified"
  | "critical_issue_unresolved"
  | "blocking_issue_unresolved"
  | "reviewer_count_insufficient"
  | "reviewer_conflict"
  | "reviewer_authority_invalid"
  | "reviewer_assignment_invalid"
  | "finding_created_determination"
  | "finding_created_registry_publication"
  | "finding_created_artifact"
  | "finding_created_execution";

export interface FindingValidationIssue {
  readonly path: string;
  readonly code: FindingValidationCode;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly received?: unknown;
  readonly expected?: string;
}

export interface FindingValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly issues: readonly FindingValidationIssue[];
}

export class FindingContractValidationError extends Error {
  readonly issues: readonly FindingValidationIssue[];

  constructor(
    message: string,
    issues: readonly FindingValidationIssue[],
  ) {
    super(message);
    this.name = "FindingContractValidationError";
    this.issues = issues;
  }
}

export function validateFindingDefinition(
  input: unknown,
): FindingValidationResult<FindingDefinition> {
  const issues: FindingValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Finding definition must be an object.",
      input,
    );
  }

  requiredString(
    input.findingDefinitionId,
    "$.findingDefinitionId",
    issues,
  );
  requiredString(input.title, "$.title", issues);
  requiredString(input.description, "$.description", issues);
  requiredString(input.version, "$.version", issues);
  requiredString(
    input.findingBoundary,
    "$.findingBoundary",
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
    input as unknown as FindingDefinition,
    issues,
  );
}

export function validateInstitutionalFinding(
  input: unknown,
): FindingValidationResult<InstitutionalFinding> {
  const issues: FindingValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Institutional finding must be an object.",
      input,
    );
  }

  requiredString(input.findingId, "$.findingId", issues);
  requiredString(input.workspaceId, "$.workspaceId", issues);
  requiredString(input.assignmentId, "$.assignmentId", issues);
  requiredString(input.submissionId, "$.submissionId", issues);
  requiredString(
    input.readinessEvaluationId,
    "$.readinessEvaluationId",
    issues,
  );
  requiredString(
    input.targetRecordId,
    "$.targetRecordId",
    issues,
  );
  requiredString(input.title, "$.title", issues);
  requiredString(input.statement, "$.statement", issues);
  requiredString(input.rationale, "$.rationale", issues);
  requiredString(input.version, "$.version", issues);
  requiredString(
    input.correlationId,
    "$.correlationId",
    issues,
  );

  if (!isOneOf(input.findingType, FINDING_TYPES)) {
    pushIssue(
      issues,
      "$.findingType",
      "invalid_value",
      "Unsupported finding type.",
      input.findingType,
    );
  }

  if (!isOneOf(input.state, FINDING_STATES)) {
    pushIssue(
      issues,
      "$.state",
      "invalid_state",
      "Unsupported finding state.",
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
    "findingCreatedDetermination",
    "findingCreatedRegistryPublication",
    "findingCreatedArtifact",
    "findingCreatedExecution",
  ] as const;

  for (const field of hardFalseFields) {
    if (input[field] !== false) {
      pushIssue(
        issues,
        `$.${field}`,
        field === "findingCreatedDetermination"
          ? "finding_created_determination"
          : field === "findingCreatedRegistryPublication"
            ? "finding_created_registry_publication"
            : field === "findingCreatedArtifact"
              ? "finding_created_artifact"
              : "finding_created_execution",
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
      "Invalid finding integrity hash.",
      input.integrityHash,
    );
  }

  return completeValidation(
    input as unknown as InstitutionalFinding,
    issues,
  );
}

/* ========================================================================== *
 * Evidence mapping and confidence
 * ========================================================================== */

export function createFindingEvidenceMappings(
  input: {
    readonly inspections:
      readonly GovernedEvidenceInspection[];
    readonly propositions:
      Readonly<Record<InstitutionalIdentifier, string>>;
    readonly relationships?:
      Readonly<
        Record<
          InstitutionalIdentifier,
          FindingEvidenceRelationship
        >
      >;
    readonly mappedBySubjectId:
      InstitutionalIdentifier;
    readonly now:
      ISODateTimeString;
  },
): readonly FindingEvidenceMapping[] {
  return deepFreeze(
    input.inspections.map(
      (inspection, index) => {
        const relationship =
          input.relationships?.[
            inspection.evidenceId
          ] ??
          (inspection.state === "inspected"
            ? "supports"
            : inspection.state === "rejected"
              ? "excluded"
              : "unresolved");

        return {
          mappingId:
            `TA14-FINDING-EVMAP-${String(index + 1).padStart(6, "0")}`,
          evidenceId:
            inspection.evidenceId,
          evidenceVersion:
            inspection.evidenceVersion,
          inspectionId:
            inspection.inspectionId,
          relationship,
          weight:
            relationship === "supports"
              ? "substantial"
              : relationship === "partially_supports"
                ? "moderate"
                : relationship === "contradicts"
                  ? "substantial"
                  : "limited",
          proposition:
            input.propositions[
              inspection.evidenceId
            ] ??
            "Evidence relationship recorded without an explicit proposition.",
          rationale:
            buildEvidenceMappingRationale(
              inspection,
              relationship,
            ),
          attributable:
            inspection.attributable,
          permitted:
            inspection.permitted,
          current:
            inspection.current,
          integrityVerified:
            inspection.integrityVerified,
          provenanceVerified:
            inspection.provenanceVerified,
          relevant:
            inspection.relevant,
          limitations:
            inspection.limitations,
          mappedBySubjectId:
            input.mappedBySubjectId,
          mappedAt:
            input.now,
        };
      },
    ),
  );
}

export function calculateFindingConfidence(
  input: {
    readonly policy:
      FindingConfidencePolicy;
    readonly evidenceMappings:
      readonly FindingEvidenceMapping[];
    readonly limitations:
      readonly FindingLimitation[];
    readonly calculatedBy:
      | InstitutionalIdentifier
      | "service";
    readonly now:
      ISODateTimeString;
  },
): FindingConfidence {
  const supportingEvidenceCount =
    input.evidenceMappings.filter(
      (mapping) =>
        mapping.relationship === "supports" ||
        mapping.relationship ===
          "partially_supports",
    ).length;

  const contradictingEvidenceCount =
    input.evidenceMappings.filter(
      (mapping) =>
        mapping.relationship === "contradicts",
    ).length;

  const unresolvedEvidenceCount =
    input.evidenceMappings.filter(
      (mapping) =>
        mapping.relationship === "unresolved",
    ).length;

  const materialLimitationCount =
    input.limitations.filter(
      (limitation) => limitation.material,
    ).length;

  let score = 0;

  for (const mapping of input.evidenceMappings) {
    score += evidenceWeightScore(mapping);
  }

  score -= contradictingEvidenceCount * 18;
  score -= unresolvedEvidenceCount * 10;
  score -= materialLimitationCount * 12;

  score = Math.max(0, Math.min(100, score));

  let level: FindingConfidenceLevel;

  if (score >= 90) {
    level = "very_high";
  } else if (score >= 75) {
    level = "high";
  } else if (score >= 50) {
    level = "moderate";
  } else if (score > 0) {
    level = "low";
  } else {
    level = "not_assessed";
  }

  if (
    contradictingEvidenceCount > 0 &&
    confidenceRank(level) >
      confidenceRank(
        input.policy.maximumConfidenceWithConflict,
      )
  ) {
    level =
      input.policy.maximumConfidenceWithConflict;
  }

  if (
    materialLimitationCount > 0 &&
    confidenceRank(level) >
      confidenceRank(
        input.policy
          .maximumConfidenceWithMaterialLimitation,
      )
  ) {
    level =
      input.policy
        .maximumConfidenceWithMaterialLimitation;
  }

  if (
    supportingEvidenceCount <
      input.evidenceMappings.length &&
    confidenceRank(level) >
      confidenceRank(
        input.policy
          .maximumConfidenceWithPartialEvidence,
      )
  ) {
    level =
      input.policy
        .maximumConfidenceWithPartialEvidence;
  }

  if (
    level === "very_high" &&
    !input.policy.allowVeryHighConfidence
  ) {
    level = "high";
  }

  return deepFreeze({
    level,
    score,
    method:
      input.policy.confidenceMethod,
    rationale:
      `Confidence reflects ${supportingEvidenceCount} supporting, ` +
      `${contradictingEvidenceCount} contradicting, ` +
      `${unresolvedEvidenceCount} unresolved evidence mappings, and ` +
      `${materialLimitationCount} material limitations.`,
    supportingEvidenceCount,
    contradictingEvidenceCount,
    unresolvedEvidenceCount,
    materialLimitationCount,
    calculatedAt: input.now,
    calculatedBy: input.calculatedBy,
  });
}

function evidenceWeightScore(
  mapping: FindingEvidenceMapping,
): number {
  const base =
    mapping.weight === "decisive"
      ? 35
      : mapping.weight === "substantial"
        ? 25
        : mapping.weight === "moderate"
          ? 16
          : mapping.weight === "limited"
            ? 8
            : 3;

  const relationshipMultiplier =
    mapping.relationship === "supports"
      ? 1
      : mapping.relationship === "partially_supports"
        ? 0.65
        : mapping.relationship === "qualifies"
          ? 0.35
          : mapping.relationship === "contextualizes"
            ? 0.25
            : mapping.relationship === "limits"
              ? -0.2
              : mapping.relationship === "contradicts"
                ? -0.8
                : 0;

  const qualityMultiplier =
    [
      mapping.attributable,
      mapping.permitted,
      mapping.current,
      mapping.integrityVerified,
      mapping.provenanceVerified,
      mapping.relevant,
    ].filter(Boolean).length / 6;

  return base *
    relationshipMultiplier *
    qualityMultiplier;
}

function confidenceRank(
  level: FindingConfidenceLevel,
): number {
  return FINDING_CONFIDENCE_LEVELS.indexOf(
    level,
  );
}

/* ========================================================================== *
 * Finding type resolution
 * ========================================================================== */

export function resolveFindingType(
  input: {
    readonly evidenceMappings:
      readonly FindingEvidenceMapping[];
    readonly limitations:
      readonly FindingLimitation[];
    readonly unresolvedIssues:
      readonly FindingUnresolvedIssue[];
    readonly scopeVerified:
      boolean;
  },
): FindingType {
  if (!input.scopeVerified) {
    return "outside_scope";
  }

  const supporting =
    input.evidenceMappings.filter(
      (mapping) =>
        mapping.relationship === "supports",
    ).length;

  const partial =
    input.evidenceMappings.filter(
      (mapping) =>
        mapping.relationship ===
          "partially_supports",
    ).length;

  const contradicting =
    input.evidenceMappings.filter(
      (mapping) =>
        mapping.relationship === "contradicts",
    ).length;

  const unresolved =
    input.evidenceMappings.filter(
      (mapping) =>
        mapping.relationship === "unresolved",
    ).length;

  const criticalIssue =
    input.unresolvedIssues.some(
      (issue) =>
        issue.blocking ||
        issue.severity === "critical",
    );

  const materialLimitation =
    input.limitations.some(
      (limitation) =>
        limitation.material,
    );

  if (criticalIssue || unresolved > 0) {
    return "inconclusive";
  }

  if (
    contradicting > 0 &&
    supporting > 0
  ) {
    return "conflicting";
  }

  if (
    supporting > 0 &&
    partial > 0
  ) {
    return "partially_supported";
  }

  if (
    supporting > 0 &&
    materialLimitation
  ) {
    return "conditionally_supported";
  }

  if (supporting > 0) {
    return "supported";
  }

  if (
    partial > 0 &&
    contradicting === 0
  ) {
    return "partially_supported";
  }

  if (contradicting > 0) {
    return "unsupported";
  }

  return "inconclusive";
}

/* ========================================================================== *
 * Concurrence and reviewer positions
 * ========================================================================== */

export function evaluateFindingConcurrence(
  input: {
    readonly concurrenceId:
      InstitutionalIdentifier;
    readonly positions:
      readonly FindingReviewerPosition[];
    readonly policy:
      FindingReviewPolicy;
    readonly now:
      ISODateTimeString;
  },
): FindingConcurrence {
  const activePositions =
    input.positions.filter(
      (position) =>
        position.position !== "recused",
    );

  const concurring =
    activePositions.filter(
      (position) =>
        position.position === "concur",
    );

  const qualified =
    activePositions.filter(
      (position) =>
        position.position ===
          "concur_with_limitations",
    );

  const dissenting =
    activePositions.filter(
      (position) =>
        position.position === "dissent",
    );

  const abstaining =
    activePositions.filter(
      (position) =>
        position.position === "abstain",
    );

  const recused =
    input.positions.filter(
      (position) =>
        position.position === "recused",
    );

  const minimumReviewerCountSatisfied =
    activePositions.length >=
    input.policy.minimumReviewerCount;

  const independenceSatisfied =
    !input.policy.independentReviewerRequired ||
    new Set(
      activePositions.map(
        (position) =>
          position.reviewerSubjectId,
      ),
    ).size >= 2;

  const unanimitySatisfied =
    dissenting.length === 0 &&
    abstaining.length === 0 &&
    activePositions.length > 0;

  let state:
    FindingConcurrence["state"];

  if (!minimumReviewerCountSatisfied) {
    state = "insufficient_reviewers";
  } else if (
    input.policy.unanimityRequired &&
    !unanimitySatisfied
  ) {
    state = "disputed";
  } else if (
    dissenting.length > 0
  ) {
    state = "disputed";
  } else if (
    qualified.length > 0
  ) {
    state = "qualified";
  } else if (
    unanimitySatisfied
  ) {
    state = "unanimous";
  } else {
    state = "majority";
  }

  return deepFreeze({
    concurrenceId:
      input.concurrenceId,
    state,
    concurringReviewerIds:
      concurring.map(
        (position) =>
          position.reviewerSubjectId,
      ),
    qualifiedReviewerIds:
      qualified.map(
        (position) =>
          position.reviewerSubjectId,
      ),
    dissentingReviewerIds:
      dissenting.map(
        (position) =>
          position.reviewerSubjectId,
      ),
    abstainingReviewerIds:
      abstaining.map(
        (position) =>
          position.reviewerSubjectId,
      ),
    recusedReviewerIds:
      recused.map(
        (position) =>
          position.reviewerSubjectId,
      ),
    minimumReviewerCountSatisfied,
    independenceSatisfied,
    unanimitySatisfied,
    evaluatedAt: input.now,
  });
}

/* ========================================================================== *
 * Finding creation
 * ========================================================================== */

export interface CreateFindingInput {
  readonly findingId: InstitutionalIdentifier;
  readonly definition: FindingDefinition;
  readonly workspace: GovernedWorkWorkspace;
  readonly submission: GovernedWorkSubmission;
  readonly readiness:
    DeterminationReadinessEvaluation;

  readonly title: string;
  readonly statement: string;
  readonly rationale: string;

  readonly evidenceMappings:
    readonly FindingEvidenceMapping[];
  readonly scope: FindingScope;
  readonly assumptions:
    readonly FindingAssumption[];
  readonly limitations:
    readonly FindingLimitation[];
  readonly dependencies:
    readonly FindingDependency[];
  readonly unresolvedIssues:
    readonly FindingUnresolvedIssue[];

  readonly reviewerPositions:
    readonly FindingReviewerPosition[];
  readonly concurrence: FindingConcurrence;
  readonly minorityOpinions?:
    readonly FindingMinorityOpinion[];
  readonly dissentingOpinions?:
    readonly FindingDissentingOpinion[];

  readonly createdBySubjectId:
    InstitutionalIdentifier;
  readonly version: string;
  readonly now: ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) =>
      Promise<ContentHash> | ContentHash;
}

export async function createInstitutionalFinding(
  input: CreateFindingInput,
): Promise<InstitutionalFinding> {
  assertWorkspaceReadyForFinding(
    input.workspace,
    input.submission,
    input.readiness,
  );

  const findingType =
    resolveFindingType({
      evidenceMappings:
        input.evidenceMappings,
      limitations:
        input.limitations,
      unresolvedIssues:
        input.unresolvedIssues,
      scopeVerified:
        input.scope
          .verifiedAgainstAssignment &&
        input.scope
          .verifiedAgainstWorkspace,
    });

  const confidence =
    calculateFindingConfidence({
      policy:
        input.definition.confidencePolicy,
      evidenceMappings:
        input.evidenceMappings,
      limitations:
        input.limitations,
      calculatedBy:
        input.createdBySubjectId,
      now:
        input.now,
    });

  const state: FindingState =
    input.concurrence.state === "disputed"
      ? "escalated"
      : input.concurrence.state ===
          "insufficient_reviewers"
        ? "held"
        : input.definition.reviewPolicy
            .reviewRequired
          ? "under_review"
          : "accepted";

  const base = {
    findingId:
      input.findingId,
    findingDefinitionId:
      input.definition.findingDefinitionId,
    workspaceId:
      input.workspace.workspaceId,
    assignmentId:
      input.workspace.assignmentId,
    submissionId:
      input.submission.submissionId,
    readinessEvaluationId:
      input.readiness
        .readinessEvaluationId,

    targetRecordId:
      input.workspace.targetRecordId,
    targetRecordType:
      input.workspace.targetRecordType,
    targetRecordVersion:
      input.workspace.targetRecordVersion,

    findingType,
    state,
    title:
      input.title,
    statement:
      input.statement,
    rationale:
      input.rationale,

    confidence,
    evidenceMappings:
      input.evidenceMappings.map(
        (mapping) => ({
          ...mapping,
          findingId:
            input.findingId,
        }),
      ),
    scope:
      input.scope,
    assumptions:
      input.assumptions,
    limitations:
      input.limitations,
    dependencies:
      input.dependencies,
    unresolvedIssues:
      input.unresolvedIssues,

    reviewerPositions:
      input.reviewerPositions.map(
        (position) => ({
          ...position,
          findingId:
            input.findingId,
        }),
      ),
    concurrence:
      input.concurrence,
    minorityOpinions:
      (input.minorityOpinions ?? []).map(
        (opinion) => ({
          ...opinion,
          findingId:
            input.findingId,
        }),
      ),
    dissentingOpinions:
      (input.dissentingOpinions ?? []).map(
        (opinion) => ({
          ...opinion,
          findingId:
            input.findingId,
        }),
      ),

    createdBySubjectId:
      input.createdBySubjectId,
    createdAt:
      input.now,
    version:
      input.version,

    findingCreatedDetermination:
      false as const,
    findingCreatedRegistryPublication:
      false as const,
    findingCreatedArtifact:
      false as const,
    findingCreatedExecution:
      false as const,

    correlationId:
      input.workspace.correlationId,
  };

  const integrityHash =
    await input.hashCanonicalValue(
      base as unknown as JsonValue,
    );

  const finding:
    InstitutionalFinding = {
    ...base,
    integrityHash,
  };

  const validation =
    validateInstitutionalFinding(
      finding,
    );

  if (!validation.ok) {
    throw new FindingContractValidationError(
      "Institutional finding failed validation.",
      validation.issues,
    );
  }

  return deepFreeze(finding);
}

function assertWorkspaceReadyForFinding(
  workspace: GovernedWorkWorkspace,
  submission: GovernedWorkSubmission,
  readiness:
    DeterminationReadinessEvaluation,
): void {
  if (
    workspace.state !== "ready_for_finding" &&
    workspace.state !== "completed"
  ) {
    throw new Error(
      `Workspace ${workspace.workspaceId} is not ready for a finding.`,
    );
  }

  if (
    submission.workspaceId !==
    workspace.workspaceId
  ) {
    throw new Error(
      "Submission does not belong to the workspace.",
    );
  }

  if (
    readiness.workspaceId !==
      workspace.workspaceId ||
    readiness.submissionId !==
      submission.submissionId
  ) {
    throw new Error(
      "Readiness evaluation does not match the workspace submission.",
    );
  }

  if (
    readiness.state !== "ready" &&
    readiness.state !==
      "conditionally_ready"
  ) {
    throw new Error(
      `Readiness state ${readiness.state} does not permit finding creation.`,
    );
  }

  if (
    workspace.governedWorkCreatedFinding !==
      false ||
    workspace
      .governedWorkCreatedDetermination !==
      false ||
    workspace
      .governedWorkCreatedRegistryEffect !==
      false ||
    workspace
      .governedWorkCreatedArtifactEffect !==
      false ||
    workspace
      .governedWorkCreatedExecution !==
      false
  ) {
    throw new Error(
      "Governed work workspace violates constitutional boundaries.",
    );
  }
}

/* ========================================================================== *
 * Review and acceptance
 * ========================================================================== */

export function acceptFinding(
  finding: InstitutionalFinding,
  acceptedBySubjectIds:
    readonly InstitutionalIdentifier[],
  now: ISODateTimeString,
): InstitutionalFinding {
  if (
    finding.state !== "under_review" &&
    finding.state !== "held"
  ) {
    throw new Error(
      `Finding ${finding.findingId} cannot be accepted from state ${finding.state}.`,
    );
  }

  if (
    finding.concurrence.state ===
      "disputed" ||
    finding.concurrence.state ===
      "insufficient_reviewers"
  ) {
    throw new Error(
      "Finding cannot be accepted while concurrence is disputed or insufficient.",
    );
  }

  if (
    acceptedBySubjectIds.length === 0
  ) {
    throw new Error(
      "Finding acceptance requires at least one attributable reviewer.",
    );
  }

  return deepFreeze({
    ...finding,
    state: "accepted",
    acceptedAt: now,
  });
}

export function holdFinding(
  finding: InstitutionalFinding,
  limitation:
    FindingLimitation,
  now: ISODateTimeString,
): InstitutionalFinding {
  assertFindingMutable(finding);

  return deepFreeze({
    ...finding,
    state: "held",
    limitations: [
      ...finding.limitations,
      limitation,
    ],
    reviewedAt: now,
  });
}

export function escalateFinding(
  finding: InstitutionalFinding,
  dissent:
    FindingDissentingOpinion,
  now: ISODateTimeString,
): InstitutionalFinding {
  assertFindingMutable(finding);

  return deepFreeze({
    ...finding,
    state: "escalated",
    dissentingOpinions: [
      ...finding.dissentingOpinions,
      {
        ...dissent,
        findingId:
          finding.findingId,
      },
    ],
    reviewedAt: now,
  });
}

export function returnFindingForCorrection(
  finding: InstitutionalFinding,
  issue:
    FindingUnresolvedIssue,
  now: ISODateTimeString,
): InstitutionalFinding {
  assertFindingMutable(finding);

  return deepFreeze({
    ...finding,
    state:
      "returned_for_correction",
    unresolvedIssues: [
      ...finding.unresolvedIssues,
      issue,
    ],
    reviewedAt:
      now,
  });
}

/* ========================================================================== *
 * Amendment and supersession
 * ========================================================================== */

export async function amendFinding(
  input: {
    readonly priorFinding:
      InstitutionalFinding;
    readonly newFindingId:
      InstitutionalIdentifier;
    readonly newVersion:
      string;
    readonly changeRecord:
      FindingChangeRecord;
    readonly changes:
      Partial<
        Pick<
          InstitutionalFinding,
          | "findingType"
          | "title"
          | "statement"
          | "rationale"
          | "confidence"
          | "evidenceMappings"
          | "scope"
          | "assumptions"
          | "limitations"
          | "dependencies"
          | "unresolvedIssues"
          | "reviewerPositions"
          | "concurrence"
          | "minorityOpinions"
          | "dissentingOpinions"
        >
      >;
    readonly amendedBySubjectId:
      InstitutionalIdentifier;
    readonly now:
      ISODateTimeString;
    readonly hashCanonicalValue:
      (value: JsonValue) =>
        Promise<ContentHash> | ContentHash;
  },
): Promise<InstitutionalFinding> {
  if (
    input.priorFinding.state ===
      "withdrawn" ||
    input.priorFinding.state ===
      "invalidated"
  ) {
    throw new Error(
      `Finding ${input.priorFinding.findingId} cannot be amended from state ${input.priorFinding.state}.`,
    );
  }

  const base = {
    ...input.priorFinding,
    ...input.changes,
    findingId:
      input.newFindingId,
    state:
      "amended" as const,
    version:
      input.newVersion,
    priorFindingId:
      input.priorFinding.findingId,
    priorVersion:
      input.priorFinding.version,
    supersededByFindingId:
      undefined,
    createdBySubjectId:
      input.amendedBySubjectId,
    createdAt:
      input.now,
    amendedAt:
      input.now,
    acceptedAt:
      undefined,
    supersededAt:
      undefined,
    withdrawnAt:
      undefined,
    invalidatedAt:
      undefined,
    findingCreatedDetermination:
      false as const,
    findingCreatedRegistryPublication:
      false as const,
    findingCreatedArtifact:
      false as const,
    findingCreatedExecution:
      false as const,
  };

  const hashInput = {
    ...base,
    integrityHash:
      undefined,
  };

  const integrityHash =
    await input.hashCanonicalValue(
      hashInput as unknown as JsonValue,
    );

  const amended:
    InstitutionalFinding = {
    ...base,
    integrityHash,
  };

  const validation =
    validateInstitutionalFinding(
      amended,
    );

  if (!validation.ok) {
    throw new FindingContractValidationError(
      "Amended finding failed validation.",
      validation.issues,
    );
  }

  return deepFreeze(amended);
}

export function supersedeFinding(
  priorFinding: InstitutionalFinding,
  newFindingId: InstitutionalIdentifier,
  now: ISODateTimeString,
): InstitutionalFinding {
  if (
    priorFinding.state === "withdrawn" ||
    priorFinding.state === "invalidated"
  ) {
    throw new Error(
      "Withdrawn or invalidated findings cannot be superseded.",
    );
  }

  return deepFreeze({
    ...priorFinding,
    state: "superseded",
    supersededByFindingId:
      newFindingId,
    supersededAt:
      now,
  });
}

export function withdrawFinding(
  finding: InstitutionalFinding,
  now: ISODateTimeString,
): InstitutionalFinding {
  if (
    finding.state === "invalidated"
  ) {
    throw new Error(
      "Invalidated finding cannot be withdrawn.",
    );
  }

  return deepFreeze({
    ...finding,
    state: "withdrawn",
    withdrawnAt:
      now,
  });
}

export function invalidateFinding(
  finding: InstitutionalFinding,
  limitation:
    FindingLimitation,
  now: ISODateTimeString,
): InstitutionalFinding {
  return deepFreeze({
    ...finding,
    state: "invalidated",
    limitations: [
      ...finding.limitations,
      limitation,
    ],
    invalidatedAt:
      now,
  });
}

function assertFindingMutable(
  finding: InstitutionalFinding,
): void {
  if (
    finding.state === "superseded" ||
    finding.state === "withdrawn" ||
    finding.state === "invalidated"
  ) {
    throw new Error(
      `Finding ${finding.findingId} is immutable in state ${finding.state}.`,
    );
  }
}

/* ========================================================================== *
 * Continuity
 * ========================================================================== */

export function createFindingContinuityAction(
  input: {
    readonly continuityActionId:
      InstitutionalIdentifier;
    readonly finding:
      InstitutionalFinding;
    readonly triggerType:
      string;
    readonly severity:
      FindingContinuityAction["severity"];
    readonly requiredAction:
      FindingContinuityAction["requiredAction"];
    readonly affectedEvidenceIds?:
      readonly InstitutionalIdentifier[];
    readonly affectedDependencyIds?:
      readonly InstitutionalIdentifier[];
    readonly now:
      ISODateTimeString;
    readonly dueAt?:
      ISODateTimeString;
  },
): FindingContinuityAction {
  const newState: FindingState =
    input.requiredAction === "invalidate"
      ? "invalidated"
      : input.requiredAction === "withdraw"
        ? "withdrawn"
        : input.requiredAction === "supersede"
          ? "superseded"
          : input.requiredAction === "hold" ||
              input.severity === "critical"
            ? "held"
            : input.finding.state;

  return deepFreeze({
    continuityActionId:
      input.continuityActionId,
    findingId:
      input.finding.findingId,
    triggerType:
      input.triggerType,
    severity:
      input.severity,
    requiredAction:
      input.requiredAction,
    priorState:
      input.finding.state,
    newState,
    affectedEvidenceIds:
      [...(input.affectedEvidenceIds ?? [])],
    affectedDependencyIds:
      [...(input.affectedDependencyIds ?? [])],
    createdAt:
      input.now,
    dueAt:
      input.dueAt,
    state:
      "open",
  });
}

/* ========================================================================== *
 * Projections
 * ========================================================================== */

export interface PublicFindingProjection {
  readonly findingId:
    InstitutionalIdentifier;
  readonly targetRecordType:
    InstitutionalRecordType;
  readonly findingType:
    FindingType;
  readonly state:
    FindingState;
  readonly title:
    string;
  readonly statement:
    string;
  readonly confidence?:
    FindingConfidenceLevel;
  readonly limitations:
    readonly string[];
  readonly scopeStatement:
    string;
  readonly reviewerConcurrence:
    FindingConcurrence["state"];
  readonly dissentPresent:
    boolean;
  readonly version:
    string;
  readonly createdAt:
    ISODateTimeString;
  readonly acceptedAt?:
    ISODateTimeString;
  readonly findingBoundary:
    string;
  readonly verificationHash:
    ContentHash;
}

export function projectPublicFinding(
  definition: FindingDefinition,
  finding: InstitutionalFinding,
): PublicFindingProjection {
  if (
    !definition
      .projectionPolicy
      .publicProjectionAllowed
  ) {
    throw new Error(
      "Finding definition does not permit public projection.",
    );
  }

  return deepFreeze({
    findingId:
      finding.findingId,
    targetRecordType:
      finding.targetRecordType,
    findingType:
      finding.findingType,
    state:
      finding.state,
    title:
      finding.title,
    statement:
      finding.statement,
    confidence:
      definition
        .projectionPolicy
        .exposeConfidencePublicly
        ? finding.confidence.level
        : undefined,
    limitations:
      definition
        .projectionPolicy
        .exposeLimitationsPublicly
        ? finding.limitations
            .filter(
              (limitation) =>
                limitation.requiresDisclosure,
            )
            .map(
              (limitation) =>
                limitation.description,
            )
        : [],
    scopeStatement:
      finding.scope.scopeStatement,
    reviewerConcurrence:
      finding.concurrence.state,
    dissentPresent:
      definition
        .projectionPolicy
        .exposeDissentPublicly &&
      finding.dissentingOpinions.length > 0,
    version:
      finding.version,
    createdAt:
      finding.createdAt,
    acceptedAt:
      finding.acceptedAt,
    findingBoundary:
      TA14_FINDING_BOUNDARY,
    verificationHash:
      finding.integrityHash,
  });
}

export interface ControlledFindingProjection {
  readonly finding:
    InstitutionalFinding;
  readonly projectionClass:
    FindingProjectionClass;
  readonly permittedRole?:
    InstitutionalRole;
  readonly generatedAt:
    ISODateTimeString;
  readonly protectedFields:
    readonly string[];
}

export function projectControlledFinding(
  definition: FindingDefinition,
  finding: InstitutionalFinding,
  projectionClass:
    FindingProjectionClass,
  generatedAt:
    ISODateTimeString,
  permittedRole?:
    InstitutionalRole,
): ControlledFindingProjection {
  if (
    projectionClass === "public"
  ) {
    throw new Error(
      "Use projectPublicFinding for public projection.",
    );
  }

  if (
    projectionClass === "confidential" &&
    !definition
      .projectionPolicy
      .confidentialProjectionAllowed
  ) {
    throw new Error(
      "Confidential projection is not permitted.",
    );
  }

  if (
    projectionClass === "controlled" &&
    !definition
      .projectionPolicy
      .controlledProjectionAllowed
  ) {
    throw new Error(
      "Controlled projection is not permitted.",
    );
  }

  return deepFreeze({
    finding,
    projectionClass,
    permittedRole,
    generatedAt,
    protectedFields:
      definition
        .projectionPolicy
        .protectedFields,
  });
}

/* ========================================================================== *
 * Repository contracts
 * ========================================================================== */

export interface FindingDefinitionRepository {
  getDefinition(
    findingDefinitionId:
      InstitutionalIdentifier,
    version?: string,
  ): Promise<FindingDefinition | null>;

  getActiveDefinition(
    workspaceType: string,
    at?: ISODateTimeString,
  ): Promise<FindingDefinition | null>;

  saveDefinition(
    definition: FindingDefinition,
  ): Promise<void>;
}

export interface FindingRepository {
  getFinding(
    findingId: InstitutionalIdentifier,
  ): Promise<InstitutionalFinding | null>;

  saveFinding(
    finding: InstitutionalFinding,
  ): Promise<void>;

  listForWorkspace(
    workspaceId: InstitutionalIdentifier,
  ): Promise<readonly InstitutionalFinding[]>;

  listForTargetRecord(
    targetRecordId: InstitutionalIdentifier,
  ): Promise<readonly InstitutionalFinding[]>;
}

export interface FindingChangeRepository {
  getChange(
    changeId: InstitutionalIdentifier,
  ): Promise<FindingChangeRecord | null>;

  saveChange(
    change: FindingChangeRecord,
  ): Promise<void>;

  listForFinding(
    findingId: InstitutionalIdentifier,
  ): Promise<readonly FindingChangeRecord[]>;
}

/* ========================================================================== *
 * In-memory repositories
 * ========================================================================== */

export class InMemoryFindingDefinitionRepository
  implements FindingDefinitionRepository
{
  private readonly values =
    new Map<string, FindingDefinition>();

  async getDefinition(
    findingDefinitionId:
      InstitutionalIdentifier,
    version?: string,
  ): Promise<FindingDefinition | null> {
    if (version) {
      return (
        this.values.get(
          `${findingDefinitionId}@${version}`,
        ) ?? null
      );
    }

    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.findingDefinitionId ===
            findingDefinitionId,
        )
        .sort(
          (a, b) =>
            Date.parse(b.effectiveAt) -
            Date.parse(a.effectiveAt),
        )[0] ?? null
    );
  }

  async getActiveDefinition(
    workspaceType: string,
    at = new Date().toISOString(),
  ): Promise<FindingDefinition | null> {
    const time = Date.parse(at);

    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.active &&
            value.supportedWorkspaceTypes.includes(
              workspaceType,
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
    definition: FindingDefinition,
  ): Promise<void> {
    const validation =
      validateFindingDefinition(
        definition,
      );

    if (!validation.ok) {
      throw new FindingContractValidationError(
        "Cannot save invalid finding definition.",
        validation.issues,
      );
    }

    const key =
      `${definition.findingDefinitionId}@${definition.version}`;

    if (this.values.has(key)) {
      throw new Error(
        `Finding definition ${key} already exists.`,
      );
    }

    this.values.set(
      key,
      deepFreeze(definition),
    );
  }
}

export class InMemoryFindingRepository
  implements FindingRepository
{
  private readonly values =
    new Map<
      InstitutionalIdentifier,
      InstitutionalFinding
    >();

  async getFinding(
    findingId: InstitutionalIdentifier,
  ): Promise<InstitutionalFinding | null> {
    return this.values.get(findingId) ?? null;
  }

  async saveFinding(
    finding: InstitutionalFinding,
  ): Promise<void> {
    const validation =
      validateInstitutionalFinding(
        finding,
      );

    if (!validation.ok) {
      throw new FindingContractValidationError(
        "Cannot save invalid finding.",
        validation.issues,
      );
    }

    this.values.set(
      finding.findingId,
      deepFreeze(finding),
    );
  }

  async listForWorkspace(
    workspaceId: InstitutionalIdentifier,
  ): Promise<readonly InstitutionalFinding[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (finding) =>
            finding.workspaceId ===
            workspaceId,
        ),
    );
  }

  async listForTargetRecord(
    targetRecordId: InstitutionalIdentifier,
  ): Promise<readonly InstitutionalFinding[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (finding) =>
            finding.targetRecordId ===
            targetRecordId,
        ),
    );
  }
}

export class InMemoryFindingChangeRepository
  implements FindingChangeRepository
{
  private readonly values =
    new Map<
      InstitutionalIdentifier,
      FindingChangeRecord
    >();

  async getChange(
    changeId: InstitutionalIdentifier,
  ): Promise<FindingChangeRecord | null> {
    return this.values.get(changeId) ?? null;
  }

  async saveChange(
    change: FindingChangeRecord,
  ): Promise<void> {
    if (this.values.has(change.changeId)) {
      throw new Error(
        `Finding change ${change.changeId} already exists.`,
      );
    }

    this.values.set(
      change.changeId,
      deepFreeze(change),
    );
  }

  async listForFinding(
    findingId: InstitutionalIdentifier,
  ): Promise<readonly FindingChangeRecord[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (change) =>
            change.findingId === findingId,
        ),
    );
  }
}

/* ========================================================================== *
 * Service orchestration
 * ========================================================================== */

export interface FindingIdentifierFactory {
  readonly createFindingId:
    () => InstitutionalIdentifier;
  readonly createScopeId:
    () => InstitutionalIdentifier;
  readonly createConcurrenceId:
    () => InstitutionalIdentifier;
  readonly createReviewerPositionId:
    () => InstitutionalIdentifier;
  readonly createAssumptionId:
    () => InstitutionalIdentifier;
  readonly createLimitationId:
    () => InstitutionalIdentifier;
  readonly createDependencyId:
    () => InstitutionalIdentifier;
  readonly createUnresolvedIssueId:
    () => InstitutionalIdentifier;
  readonly createChangeId:
    () => InstitutionalIdentifier;
  readonly createContinuityActionId:
    () => InstitutionalIdentifier;
}

export interface FindingServiceDependencies {
  readonly definitions:
    FindingDefinitionRepository;
  readonly findings:
    FindingRepository;
  readonly changes:
    FindingChangeRepository;
  readonly ids:
    FindingIdentifierFactory;
  readonly now:
    () => ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) =>
      Promise<ContentHash> | ContentHash;
  readonly events?: AcademyEventService;
}

export class FindingService {
  constructor(
    private readonly dependencies:
      FindingServiceDependencies,
  ) {}

  async createFinding(
    input: {
      readonly workspace:
        GovernedWorkWorkspace;
      readonly submission:
        GovernedWorkSubmission;
      readonly readiness:
        DeterminationReadinessEvaluation;
      readonly title:
        string;
      readonly statement:
        string;
      readonly rationale:
        string;
      readonly evidenceMappings:
        readonly FindingEvidenceMapping[];
      readonly scope:
        FindingScope;
      readonly assumptions?:
        readonly FindingAssumption[];
      readonly limitations?:
        readonly FindingLimitation[];
      readonly dependencies?:
        readonly FindingDependency[];
      readonly unresolvedIssues?:
        readonly FindingUnresolvedIssue[];
      readonly reviewerPositions:
        readonly FindingReviewerPosition[];
      readonly minorityOpinions?:
        readonly FindingMinorityOpinion[];
      readonly dissentingOpinions?:
        readonly FindingDissentingOpinion[];
      readonly createdBySubjectId:
        InstitutionalIdentifier;
      readonly version:
        string;
    },
  ): Promise<InstitutionalFinding> {
    const definition =
      await this.dependencies.definitions
        .getActiveDefinition(
          "governance_review",
          this.dependencies.now(),
        );

    if (!definition) {
      throw new Error(
        "No active finding definition exists for governance review.",
      );
    }

    const concurrence =
      evaluateFindingConcurrence({
        concurrenceId:
          this.dependencies.ids
            .createConcurrenceId(),
        positions:
          input.reviewerPositions,
        policy:
          definition.reviewPolicy,
        now:
          this.dependencies.now(),
      });

    const finding =
      await createInstitutionalFinding({
        findingId:
          this.dependencies.ids
            .createFindingId(),
        definition,
        workspace:
          input.workspace,
        submission:
          input.submission,
        readiness:
          input.readiness,
        title:
          input.title,
        statement:
          input.statement,
        rationale:
          input.rationale,
        evidenceMappings:
          input.evidenceMappings,
        scope:
          input.scope,
        assumptions:
          input.assumptions ?? [],
        limitations:
          input.limitations ?? [],
        dependencies:
          input.dependencies ?? [],
        unresolvedIssues:
          input.unresolvedIssues ?? [],
        reviewerPositions:
          input.reviewerPositions,
        concurrence,
        minorityOpinions:
          input.minorityOpinions ?? [],
        dissentingOpinions:
          input.dissentingOpinions ?? [],
        createdBySubjectId:
          input.createdBySubjectId,
        version:
          input.version,
        now:
          this.dependencies.now(),
        hashCanonicalValue:
          this.dependencies
            .hashCanonicalValue,
      });

    await this.dependencies.findings
      .saveFinding(finding);

    return finding;
  }
}

/* ========================================================================== *
 * Canonical finding definition
 * ========================================================================== */

export const GOVERNANCE_REVIEW_FINDING_DEFINITION_ID =
  "TA14-FINDING-DEF-GOVERNANCE-REVIEW-000001" as const;

export const governanceReviewFindingDefinition:
  FindingDefinition = deepFreeze({
    findingDefinitionId:
      GOVERNANCE_REVIEW_FINDING_DEFINITION_ID,
    title:
      "Bounded AI Governance Review Finding",
    description:
      "Produces an attributable statement of what completed governed work supports, does not support, or cannot resolve within a declared evidence, authority, assignment, version, confidentiality, and scope boundary.",
    version: "3.0",
    active: true,

    supportedWorkspaceTypes: [
      "governance_review",
      "registry_review",
      "continuity_review",
    ],

    allowedRoles: [
      "authorized_reviewer",
      "academy_standards_reviewer",
      "institutional_administrator",
    ],

    allowedRecordTypes: [
      "finding",
      "review",
      "demonstration",
      "governed_record",
      "evidence_package",
      "determination",
    ],

    permittedFindingTypes:
      FINDING_TYPES,

    evidencePolicy: {
      minimumSupportingEvidenceCount: 1,
      allowConflictingEvidence: true,
      allowExcludedEvidenceReferences: true,
      requireAttribution: true,
      requirePermission: true,
      requireCurrentVersion: true,
      requireIntegrityVerification: true,
      requireProvenanceVerification: true,
      requireRelevance: true,
      requireEvidenceRelationship: true,
      preserveRejectedEvidenceReferences: true,
      preserveEarliestFailure: true,
    },

    confidencePolicy: {
      confidenceRequired: true,
      confidenceMethod:
        "hybrid",
      allowVeryHighConfidence: false,
      requireRationaleByLevel: true,
      maximumConfidenceWithConflict:
        "moderate",
      maximumConfidenceWithMaterialLimitation:
        "moderate",
      maximumConfidenceWithPartialEvidence:
        "high",
    },

    reviewPolicy: {
      reviewRequired: true,
      minimumReviewerCount: 1,
      independentReviewerRequired: false,
      dualReviewRequired: false,
      panelRequired: false,
      conflictCheckRequired: true,
      authorityCheckRequired: true,
      assignmentCheckRequired: true,
      dissentAllowed: true,
      abstentionAllowed: true,
      unanimityRequired: false,
      disputedFindingDecision:
        "ESCALATE",
    },

    amendmentPolicy: {
      amendmentAllowed: true,
      materialAmendmentCreatesNewVersion: true,
      clericalCorrectionCreatesNewVersion: true,
      preservePriorVersion: true,
      requireReason: true,
      requireReviewerApproval: true,
      supersessionAllowed: true,
      withdrawalAllowed: true,
      invalidationAllowed: true,
    },

    projectionPolicy: {
      publicProjectionAllowed: true,
      authenticatedProjectionAllowed: true,
      controlledProjectionAllowed: true,
      confidentialProjectionAllowed: true,
      protectedFields: [
        "evidenceMappings.evidenceId",
        "reviewerPositions.reviewerSubjectId",
        "dissentingOpinions.reviewerSubjectId",
        "dependencies.referenceId",
        "assumptions.verificationEvidenceIds",
      ],
      publicFields: [
        "findingId",
        "findingType",
        "state",
        "title",
        "statement",
        "confidence.level",
        "scope.scopeStatement",
        "limitations",
        "concurrence.state",
        "version",
        "createdAt",
        "acceptedAt",
        "integrityHash",
      ],
      redactSubjectIdentityPublicly: true,
      redactEvidenceIdentifiersPublicly: true,
      exposeConfidencePublicly: true,
      exposeDissentPublicly: true,
      exposeLimitationsPublicly: true,
    },

    continuityPolicy: {
      materialChangeTriggers: [
        "evidence_version_changed",
        "scope_changed",
        "authority_changed",
        "assignment_changed",
        "law_changed",
        "standard_changed",
        "material_fact_changed",
      ],
      evidenceChangeRequiresReview: true,
      scopeChangeRequiresReview: true,
      authorityChangeRequiresReview: true,
      assignmentChangeRequiresReview: true,
      lawChangeRequiresReview: true,
      standardChangeRequiresReview: true,
      criticalChangeHoldsFinding: true,
      preserveHistoricalFinding: true,
    },

    retentionPolicy: {
      retainFindingDays: 2555,
      retainReviewDays: 2555,
      retainAmendmentDays: 2555,
      retainDissentDays: 2555,
      preserveAcceptedFinding: true,
      preserveSupersededFinding: true,
      preserveWithdrawnFinding: true,
      preserveInvalidatedFinding: true,
    },

    findingBoundary:
      TA14_FINDING_BOUNDARY,

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

export function createDeterministicFindingDependencies(
  startAt = "2026-08-04T18:00:00.000Z",
): {
  readonly ids:
    FindingIdentifierFactory;
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
      createFindingId: () =>
        next("TA14-FINDING"),
      createScopeId: () =>
        next("TA14-FINDING-SCOPE"),
      createConcurrenceId: () =>
        next("TA14-FINDING-CONCUR"),
      createReviewerPositionId: () =>
        next("TA14-FINDING-POS"),
      createAssumptionId: () =>
        next("TA14-FINDING-ASSUME"),
      createLimitationId: () =>
        next("TA14-FINDING-LIMIT"),
      createDependencyId: () =>
        next("TA14-FINDING-DEP"),
      createUnresolvedIssueId: () =>
        next("TA14-FINDING-ISSUE"),
      createChangeId: () =>
        next("TA14-FINDING-CHANGE"),
      createContinuityActionId: () =>
        next("TA14-FINDING-CONT"),
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

export interface FindingEngineSelfCheck {
  readonly ok: boolean;
  readonly definitionValid: boolean;
  readonly findingCreatedDetermination: false;
  readonly findingCreatedRegistryPublication: false;
  readonly findingCreatedArtifact: false;
  readonly findingCreatedExecution: false;
  readonly issues: readonly string[];
}

export function runFindingEngineSelfCheck():
  FindingEngineSelfCheck {
  const issues: string[] = [];

  const validation =
    validateFindingDefinition(
      governanceReviewFindingDefinition,
    );

  if (!validation.ok) {
    issues.push(
      "Canonical governance review finding definition failed validation.",
    );
  }

  return {
    ok: issues.length === 0,
    definitionValid:
      validation.ok,
    findingCreatedDetermination: false,
    findingCreatedRegistryPublication: false,
    findingCreatedArtifact: false,
    findingCreatedExecution: false,
    issues,
  };
}

/* ========================================================================== *
 * Internal utilities
 * ========================================================================== */

function buildEvidenceMappingRationale(
  inspection:
    GovernedEvidenceInspection,
  relationship:
    FindingEvidenceRelationship,
): string {
  const status = [
    inspection.attributable
      ? "attributable"
      : "not attributable",
    inspection.permitted
      ? "permitted"
      : "not permitted",
    inspection.current
      ? "current"
      : "not current",
    inspection.integrityVerified
      ? "integrity verified"
      : "integrity not verified",
    inspection.provenanceVerified
      ? "provenance verified"
      : "provenance not verified",
    inspection.relevant
      ? "relevant"
      : "not relevant",
  ].join(", ");

  return (
    `Evidence is mapped as ${relationship}. ` +
    `Inspection status: ${status}.`
  );
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
    FindingValidationIssue[],
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
    FindingValidationIssue[],
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
    FindingValidationIssue[],
  path: string,
  code: FindingValidationCode,
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
): FindingValidationResult<T> {
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
    FindingValidationIssue[],
): FindingValidationResult<T> {
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

const findingContracts = {
  engineId:
    TA14_FINDING_ENGINE_ID,

  engineVersion:
    TA14_FINDING_ENGINE_VERSION,

  boundary:
    TA14_FINDING_BOUNDARY,

  findingStates:
    FINDING_STATES,

  findingTypes:
    FINDING_TYPES,

  confidenceLevels:
    FINDING_CONFIDENCE_LEVELS,

  evidenceRelationships:
    FINDING_EVIDENCE_RELATIONSHIPS,

  validateFindingDefinition,
  validateInstitutionalFinding,

  createFindingEvidenceMappings,
  calculateFindingConfidence,
  resolveFindingType,
  evaluateFindingConcurrence,
  createInstitutionalFinding,

  acceptFinding,
  holdFinding,
  escalateFinding,
  returnFindingForCorrection,

  amendFinding,
  supersedeFinding,
  withdrawFinding,
  invalidateFinding,
  createFindingContinuityAction,

  projectPublicFinding,
  projectControlledFinding,

  InMemoryFindingDefinitionRepository,
  InMemoryFindingRepository,
  InMemoryFindingChangeRepository,

  FindingService,

  governanceReviewFindingDefinition,
  createDeterministicFindingDependencies,
  runFindingEngineSelfCheck,
};

export default findingContracts;
