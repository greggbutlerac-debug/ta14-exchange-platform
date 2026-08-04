/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * ACD-018 — Revalidation Contracts
 *
 * Create:
 *   apps/web/lib/academy/revalidation-contracts.ts
 *
 * Purpose:
 *   Govern how material change, expiry, contradiction, drift, or new evidence
 *   triggers a new review cycle without rewriting the institutional history
 *   that preceded it.
 *
 * Constitutional chain:
 *   Outcome
 *   -> Continuity
 *   -> Revalidation Trigger
 *   -> Revalidation Review
 *   -> New Finding / Determination / Publication / Artifact as separately
 *      authorized future records
 *
 * Hard boundaries:
 *   Revalidation != Historical Mutation
 *   Revalidation != Automatic Determination
 *   Revalidation != Automatic Registry Publication
 *   Revalidation != Automatic Execution Artifact
 *   Revalidation != Automatic Execution
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
import type { ContinuityRecord } from "./continuity-contracts";
import type { OutcomeRecord } from "./outcome-contracts";

/* ========================================================================== *
 * Engine identity
 * ========================================================================== */

export const TA14_REVALIDATION_ENGINE_VERSION = "3.0" as const;

export const TA14_REVALIDATION_ENGINE_ID =
  "TA14-ACD-REVALIDATION-ENGINE-000001" as const;

export const TA14_REVALIDATION_BOUNDARY =
  "Revalidation evaluates whether prior governance remains current after material change. It creates a new governed review record and never rewrites the historical determination, review, publication, artifact, execution, outcome, or continuity record." as const;

/* ========================================================================== *
 * Canonical enumerations
 * ========================================================================== */

export const REVALIDATION_STATES = [
  "draft",
  "triggered",
  "screening",
  "evidence_requested",
  "under_review",
  "awaiting_authority",
  "awaiting_scope_confirmation",
  "awaiting_continuity_confirmation",
  "returned_for_correction",
  "held",
  "escalated",
  "completed",
  "withdrawn",
  "expired",
  "superseded",
  "invalidated",
] as const;

export type RevalidationState =
  (typeof REVALIDATION_STATES)[number];

export const REVALIDATION_TRIGGER_TYPES = [
  "material_fact_change",
  "new_evidence",
  "evidence_version_change",
  "evidence_expiry",
  "authority_change",
  "authority_expiry",
  "authority_revocation",
  "assignment_change",
  "scope_change",
  "jurisdiction_change",
  "organization_change",
  "law_change",
  "regulation_change",
  "standard_change",
  "policy_change",
  "technical_control_change",
  "system_version_change",
  "model_version_change",
  "data_change",
  "runtime_change",
  "outcome_change",
  "outcome_contradiction",
  "continuity_break",
  "confidence_degradation",
  "challenge_received",
  "appeal_received",
  "scheduled_review",
  "manual_request",
  "other",
] as const;

export type RevalidationTriggerType =
  (typeof REVALIDATION_TRIGGER_TYPES)[number];

export const REVALIDATION_SEVERITIES = [
  "informational",
  "low",
  "moderate",
  "high",
  "critical",
] as const;

export type RevalidationSeverity =
  (typeof REVALIDATION_SEVERITIES)[number];

export const REVALIDATION_DECISIONS = [
  "CURRENT",
  "CURRENT_WITH_CONDITIONS",
  "REVIEW_REQUIRED",
  "HOLD",
  "SUPERSEDE",
  "WITHDRAW",
  "INVALIDATE",
  "ESCALATE",
] as const;

export type RevalidationDecision =
  (typeof REVALIDATION_DECISIONS)[number];

export const REVALIDATION_TARGET_TYPES = [
  "finding",
  "determination",
  "registry_review",
  "registry_publication",
  "execution_artifact",
  "execution",
  "outcome",
  "continuity",
  "authority_grant",
  "assignment",
  "credential",
  "evidence_package",
  "governed_record",
] as const;

export type RevalidationTargetType =
  (typeof REVALIDATION_TARGET_TYPES)[number];

export const REVALIDATION_REVIEW_POSITIONS = [
  "confirm_current",
  "confirm_with_conditions",
  "require_new_review",
  "hold",
  "supersede",
  "withdraw",
  "invalidate",
  "escalate",
  "abstain",
  "recuse",
] as const;

export type RevalidationReviewPosition =
  (typeof REVALIDATION_REVIEW_POSITIONS)[number];

export const REVALIDATION_CHANGE_CLASSES = [
  "non_material",
  "administrative",
  "material",
  "critical",
  "unknown",
] as const;

export type RevalidationChangeClass =
  (typeof REVALIDATION_CHANGE_CLASSES)[number];

/* ========================================================================== *
 * Definition and policy contracts
 * ========================================================================== */

export interface RevalidationDefinition {
  readonly revalidationDefinitionId: InstitutionalIdentifier;
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly active: boolean;

  readonly supportedTargetTypes: readonly RevalidationTargetType[];
  readonly allowedRoles: readonly InstitutionalRole[];
  readonly allowedRecordTypes: readonly InstitutionalRecordType[];
  readonly supportedTriggerTypes: readonly RevalidationTriggerType[];

  readonly triggerPolicy: RevalidationTriggerPolicy;
  readonly screeningPolicy: RevalidationScreeningPolicy;
  readonly evidencePolicy: RevalidationEvidencePolicy;
  readonly authorityPolicy: RevalidationAuthorityPolicy;
  readonly scopePolicy: RevalidationScopePolicy;
  readonly reviewPolicy: RevalidationReviewPolicy;
  readonly decisionPolicy: RevalidationDecisionPolicy;
  readonly continuityPolicy: RevalidationContinuityPolicy;
  readonly projectionPolicy: RevalidationProjectionPolicy;
  readonly retentionPolicy: RevalidationRetentionPolicy;

  readonly revalidationBoundary: string;
  readonly nonSubstitutionRule:
    typeof TA14_ACADEMY_NON_SUBSTITUTION_RULE;

  readonly contentHash: ContentHash;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
}

export interface RevalidationTriggerPolicy {
  readonly automaticTriggersAllowed: boolean;
  readonly manualTriggersAllowed: boolean;
  readonly scheduledTriggersAllowed: boolean;
  readonly challengeTriggersAllowed: boolean;
  readonly appealTriggersAllowed: boolean;
  readonly minimumSeverityForAutomaticReview: RevalidationSeverity;
  readonly criticalTriggerImmediatelyHoldsTarget: boolean;
  readonly authorityRevocationImmediatelyHoldsTarget: boolean;
  readonly evidenceExpiryImmediatelyHoldsTarget: boolean;
  readonly outcomeContradictionImmediatelyEscalates: boolean;
  readonly duplicateTriggerWindowHours: number;
  readonly preserveDuplicateTriggerReferences: boolean;
}

export interface RevalidationScreeningPolicy {
  readonly screeningRequired: boolean;
  readonly classifyMateriality: boolean;
  readonly classifySeverity: boolean;
  readonly identifyAffectedRecords: boolean;
  readonly identifyAffectedEvidence: boolean;
  readonly identifyAffectedAuthority: boolean;
  readonly identifyAffectedScope: boolean;
  readonly identifyAffectedOutcomes: boolean;
  readonly nonMaterialChangeMayCloseWithoutFullReview: boolean;
  readonly unknownMaterialityDecision: "HOLD" | "ESCALATE";
}

export interface RevalidationEvidencePolicy {
  readonly requireChangeEvidence: boolean;
  readonly requireAttribution: boolean;
  readonly requirePermission: boolean;
  readonly requireCurrentVersion: boolean;
  readonly requireIntegrityVerification: boolean;
  readonly requireProvenanceVerification: boolean;
  readonly requireComparisonToPriorEvidence: boolean;
  readonly requireAffectedPropositionMapping: boolean;
  readonly allowConfidentialEvidence: boolean;
  readonly allowExternallyHostedEvidence: boolean;
  readonly staleEvidenceDecision: "HOLD" | "ESCALATE";
  readonly conflictingEvidenceDecision: "HOLD" | "ESCALATE";
}

export interface RevalidationAuthorityPolicy {
  readonly requireCurrentReviewAuthority: boolean;
  readonly requireAuthorityForTargetType: boolean;
  readonly requireOrganizationMatch: boolean;
  readonly requireJurisdictionMatch: boolean;
  readonly requireRoleMatch: boolean;
  readonly requireAssignmentMatch: boolean;
  readonly allowConstrainedAuthority: boolean;
  readonly authorityChangeRequiresIndependentReview: boolean;
  readonly authorityRevocationDecision: "HOLD" | "INVALIDATE" | "ESCALATE";
}

export interface RevalidationScopePolicy {
  readonly requirePriorScopeSnapshot: boolean;
  readonly requireCurrentScopeSnapshot: boolean;
  readonly requireScopeComparison: boolean;
  readonly requireTargetRecordMatch: boolean;
  readonly requireTargetVersionMatch: boolean;
  readonly requireOrganizationMatch: boolean;
  readonly requireJurisdictionMatch: boolean;
  readonly scopeExpansionRequiresNewAuthority: boolean;
  readonly scopeReductionMayProceedWithConstraints: boolean;
  readonly unknownScopeDecision: "HOLD" | "ESCALATE";
}

export interface RevalidationReviewPolicy {
  readonly reviewRequired: boolean;
  readonly minimumReviewerCount: number;
  readonly minimumApproverCount: number;
  readonly dualReviewRequiredForCritical: boolean;
  readonly panelRequiredForInvalidation: boolean;
  readonly independentReviewerRequiredForAuthorityChange: boolean;
  readonly conflictCheckRequired: boolean;
  readonly authorityCheckRequired: boolean;
  readonly assignmentCheckRequired: boolean;
  readonly competenceCheckRequired: boolean;
  readonly unanimityRequiredForInvalidation: boolean;
  readonly dissentAllowed: boolean;
  readonly abstentionAllowed: boolean;
  readonly recusalAllowed: boolean;
  readonly disputedReviewDecision: "HOLD" | "ESCALATE";
}

export interface RevalidationDecisionPolicy {
  readonly currentDecisionAllowed: boolean;
  readonly conditionalCurrentDecisionAllowed: boolean;
  readonly reviewRequiredDecisionAllowed: boolean;
  readonly holdDecisionAllowed: boolean;
  readonly supersedeDecisionAllowed: boolean;
  readonly withdrawDecisionAllowed: boolean;
  readonly invalidateDecisionAllowed: boolean;
  readonly escalateDecisionAllowed: boolean;
  readonly supersessionCreatesNewRecordOnly: boolean;
  readonly invalidationPreservesHistoricalRecord: true;
  readonly withdrawalPreservesHistoricalRecord: true;
  readonly decisionCreatesFinding: false;
  readonly decisionCreatesDetermination: false;
  readonly decisionCreatesRegistryPublication: false;
  readonly decisionCreatesExecutionArtifact: false;
  readonly decisionCreatesExecution: false;
}

export interface RevalidationContinuityPolicy {
  readonly preserveOriginalRecord: true;
  readonly preserveOriginalHashes: true;
  readonly preserveOriginalTimestamps: true;
  readonly preserveOriginalAuthorityContext: true;
  readonly preserveOriginalScopeContext: true;
  readonly preserveOriginalEvidenceContext: true;
  readonly preserveOriginalOutcomeContext: true;
  readonly createForwardReferenceToNewReview: boolean;
  readonly createBackwardReferenceToPriorRecord: boolean;
  readonly requireNewVersionForMaterialChange: boolean;
  readonly requireNewDeterminationForDecisionChange: boolean;
}

export interface RevalidationProjectionPolicy {
  readonly publicProjectionAllowed: boolean;
  readonly authenticatedProjectionAllowed: boolean;
  readonly controlledProjectionAllowed: boolean;
  readonly confidentialProjectionAllowed: boolean;
  readonly protectedFields: readonly string[];
  readonly publicFields: readonly string[];
  readonly exposeTriggerTypePublicly: boolean;
  readonly exposeSeverityPublicly: boolean;
  readonly exposeDecisionPublicly: boolean;
  readonly exposeConditionsPublicly: boolean;
  readonly exposeLimitationsPublicly: boolean;
  readonly exposeAffectedRecordIdsPublicly: boolean;
}

export interface RevalidationRetentionPolicy {
  readonly retainRequestDays?: number;
  readonly retainTriggerDays?: number;
  readonly retainReviewDays?: number;
  readonly retainDecisionDays?: number;
  readonly retainEvidenceComparisonDays?: number;
  readonly preserveCompletedRevalidation: true;
  readonly preserveWithdrawnRevalidation: true;
  readonly preserveSupersededRevalidation: true;
  readonly preserveInvalidatedRevalidation: true;
}

/* ========================================================================== *
 * Trigger and screening contracts
 * ========================================================================== */

export interface RevalidationTrigger {
  readonly triggerId: InstitutionalIdentifier;
  readonly triggerType: RevalidationTriggerType;
  readonly severity: RevalidationSeverity;
  readonly sourceType:
    | "service"
    | "human"
    | "system"
    | "schedule"
    | "challenge"
    | "appeal"
    | "external_authority";
  readonly sourceId?: InstitutionalIdentifier;

  readonly targetType: RevalidationTargetType;
  readonly targetId: InstitutionalIdentifier;
  readonly targetVersion?: string;
  readonly targetHash?: ContentHash;

  readonly title: string;
  readonly description: string;
  readonly observedChange: JsonValue;
  readonly priorValue?: JsonValue;
  readonly newValue?: JsonValue;

  readonly evidenceRefs: readonly InstitutionalIdentifier[];
  readonly affectedRecordIds: readonly InstitutionalIdentifier[];
  readonly affectedEvidenceIds: readonly InstitutionalIdentifier[];
  readonly affectedAuthorityGrantIds: readonly InstitutionalIdentifier[];
  readonly affectedAssignmentIds: readonly InstitutionalIdentifier[];
  readonly affectedOutcomeIds: readonly InstitutionalIdentifier[];

  readonly detectedAt: ISODateTimeString;
  readonly detectedBy:
    | "service"
    | InstitutionalIdentifier;
  readonly correlationId: CorrelationIdentifier;
  readonly integrityHash: ContentHash;
}

export interface RevalidationScreening {
  readonly screeningId: InstitutionalIdentifier;
  readonly triggerId: InstitutionalIdentifier;
  readonly targetType: RevalidationTargetType;
  readonly targetId: InstitutionalIdentifier;

  readonly changeClass: RevalidationChangeClass;
  readonly severity: RevalidationSeverity;
  readonly material: boolean;
  readonly critical: boolean;
  readonly duplicate: boolean;
  readonly duplicateTriggerIds: readonly InstitutionalIdentifier[];

  readonly fullReviewRequired: boolean;
  readonly immediateHoldRequired: boolean;
  readonly immediateEscalationRequired: boolean;
  readonly independentReviewRequired: boolean;
  readonly panelReviewRequired: boolean;

  readonly affectedDimensions: readonly (
    | "evidence"
    | "authority"
    | "assignment"
    | "scope"
    | "jurisdiction"
    | "organization"
    | "law"
    | "standard"
    | "policy"
    | "technical_control"
    | "runtime"
    | "outcome"
    | "continuity"
    | "confidence"
    | "other"
  )[];

  readonly rationale: string;
  readonly limitations: readonly string[];
  readonly screenedAt: ISODateTimeString;
  readonly screenedBy:
    | "service"
    | InstitutionalIdentifier;
}

/* ========================================================================== *
 * Evidence comparison and impact analysis
 * ========================================================================== */

export interface RevalidationEvidenceComparison {
  readonly comparisonId: InstitutionalIdentifier;
  readonly triggerId: InstitutionalIdentifier;
  readonly priorEvidenceId?: InstitutionalIdentifier;
  readonly priorEvidenceVersion?: string;
  readonly currentEvidenceId: InstitutionalIdentifier;
  readonly currentEvidenceVersion: string;

  readonly relationship:
    | "same"
    | "administrative_change"
    | "expanded"
    | "reduced"
    | "contradictory"
    | "superseding"
    | "expired"
    | "withdrawn"
    | "unavailable"
    | "unknown";

  readonly attributable: boolean;
  readonly permitted: boolean;
  readonly current: boolean;
  readonly integrityVerified: boolean;
  readonly provenanceVerified: boolean;
  readonly relevant: boolean;

  readonly affectedPropositions: readonly string[];
  readonly changedFields: readonly string[];
  readonly priorHash?: ContentHash;
  readonly currentHash: ContentHash;
  readonly limitations: readonly string[];

  readonly comparedAt: ISODateTimeString;
  readonly comparedBy:
    | "service"
    | InstitutionalIdentifier;
}

export interface RevalidationImpactAnalysis {
  readonly impactAnalysisId: InstitutionalIdentifier;
  readonly triggerId: InstitutionalIdentifier;
  readonly targetType: RevalidationTargetType;
  readonly targetId: InstitutionalIdentifier;

  readonly affectedFindingIds: readonly InstitutionalIdentifier[];
  readonly affectedDeterminationIds: readonly InstitutionalIdentifier[];
  readonly affectedRegistryReviewIds: readonly InstitutionalIdentifier[];
  readonly affectedPublicationIds: readonly InstitutionalIdentifier[];
  readonly affectedArtifactIds: readonly InstitutionalIdentifier[];
  readonly affectedExecutionIds: readonly InstitutionalIdentifier[];
  readonly affectedOutcomeIds: readonly InstitutionalIdentifier[];
  readonly affectedContinuityIds: readonly InstitutionalIdentifier[];

  readonly evidenceImpact:
    | "none"
    | "limited"
    | "material"
    | "critical"
    | "unknown";
  readonly authorityImpact:
    | "none"
    | "limited"
    | "material"
    | "critical"
    | "unknown";
  readonly scopeImpact:
    | "none"
    | "limited"
    | "material"
    | "critical"
    | "unknown";
  readonly outcomeImpact:
    | "none"
    | "limited"
    | "material"
    | "critical"
    | "unknown";
  readonly continuityImpact:
    | "none"
    | "limited"
    | "material"
    | "critical"
    | "unknown";

  readonly priorDecisionMayRemainCurrent: boolean;
  readonly priorDecisionRequiresConditions: boolean;
  readonly newFindingRequired: boolean;
  readonly newDeterminationRequired: boolean;
  readonly newRegistryReviewRequired: boolean;
  readonly newPublicationRequired: boolean;
  readonly newArtifactRequired: boolean;
  readonly executionHoldRequired: boolean;

  readonly rationale: string;
  readonly limitations: readonly string[];
  readonly analyzedAt: ISODateTimeString;
  readonly analyzedBy:
    | "service"
    | InstitutionalIdentifier;
}

/* ========================================================================== *
 * Authority, scope, continuity, and outcome verification
 * ========================================================================== */

export interface RevalidationAuthorityVerification {
  readonly authorityVerificationId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly authorityGrantIds: readonly InstitutionalIdentifier[];
  readonly state:
    | "current"
    | "constrained"
    | "held"
    | "expired"
    | "revoked"
    | "insufficient"
    | "not_checked";
  readonly roleMatched: boolean;
  readonly organizationMatched: boolean;
  readonly jurisdictionMatched: boolean;
  readonly assignmentMatched: boolean;
  readonly targetTypePermitted: boolean;
  readonly decisionPermitted: boolean;
  readonly independentReviewSatisfied: boolean;
  readonly limitations: readonly string[];
  readonly verifiedAt: ISODateTimeString;
  readonly verifiedBy:
    | "service"
    | InstitutionalIdentifier;
}

export interface RevalidationScopeVerification {
  readonly scopeVerificationId: InstitutionalIdentifier;
  readonly priorScope: readonly JsonValue[];
  readonly currentScope: readonly JsonValue[];
  readonly addedElements: readonly JsonValue[];
  readonly removedElements: readonly JsonValue[];
  readonly changedElements: readonly JsonValue[];

  readonly targetRecordMatched: boolean;
  readonly targetVersionMatched: boolean;
  readonly organizationMatched: boolean;
  readonly jurisdictionMatched: boolean;
  readonly authorityCoversCurrentScope: boolean;

  readonly state:
    | "same"
    | "reduced"
    | "expanded"
    | "changed"
    | "outside_authority"
    | "unknown";

  readonly limitations: readonly string[];
  readonly verifiedAt: ISODateTimeString;
  readonly verifiedBy:
    | "service"
    | InstitutionalIdentifier;
}

export interface RevalidationOutcomeVerification {
  readonly outcomeVerificationId: InstitutionalIdentifier;
  readonly outcomeId: InstitutionalIdentifier;
  readonly executionId: InstitutionalIdentifier;
  readonly priorOutcomeHash?: ContentHash;
  readonly currentOutcomeHash: ContentHash;
  readonly state:
    | "consistent"
    | "expanded"
    | "degraded"
    | "contradictory"
    | "failed"
    | "unknown";
  readonly priorOutcomeSupported: boolean;
  readonly currentOutcomeSupported: boolean;
  readonly contradictionDetected: boolean;
  readonly failureDetected: boolean;
  readonly limitations: readonly string[];
  readonly verifiedAt: ISODateTimeString;
  readonly verifiedBy:
    | "service"
    | InstitutionalIdentifier;
}

export interface RevalidationContinuityVerification {
  readonly continuityVerificationId: InstitutionalIdentifier;
  readonly continuityId: InstitutionalIdentifier;
  readonly continuityState:
    | "current"
    | "revalidation_required"
    | "superseded"
    | "archived";
  readonly priorChainIntact: boolean;
  readonly hashesIntact: boolean;
  readonly referencesIntact: boolean;
  readonly timestampsIntact: boolean;
  readonly originalAuthorityContextPreserved: boolean;
  readonly originalScopeContextPreserved: boolean;
  readonly originalEvidenceContextPreserved: boolean;
  readonly originalOutcomeContextPreserved: boolean;
  readonly historicalMutationDetected: boolean;
  readonly limitations: readonly string[];
  readonly verifiedAt: ISODateTimeString;
  readonly verifiedBy:
    | "service"
    | InstitutionalIdentifier;
}

/* ========================================================================== *
 * Review, concurrence, and decision contracts
 * ========================================================================== */

export interface RevalidationReviewerPosition {
  readonly reviewerPositionId: InstitutionalIdentifier;
  readonly revalidationId?: InstitutionalIdentifier;
  readonly reviewerSubjectId: InstitutionalIdentifier;
  readonly reviewerRole: InstitutionalRole;
  readonly position: RevalidationReviewPosition;
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

export interface RevalidationConcurrence {
  readonly concurrenceId: InstitutionalIdentifier;
  readonly state:
    | "not_evaluated"
    | "unanimous"
    | "majority"
    | "qualified"
    | "disputed"
    | "insufficient_reviewers"
    | "insufficient_approvers";

  readonly currentReviewerIds: readonly InstitutionalIdentifier[];
  readonly conditionalReviewerIds: readonly InstitutionalIdentifier[];
  readonly newReviewReviewerIds: readonly InstitutionalIdentifier[];
  readonly holdReviewerIds: readonly InstitutionalIdentifier[];
  readonly supersedeReviewerIds: readonly InstitutionalIdentifier[];
  readonly withdrawReviewerIds: readonly InstitutionalIdentifier[];
  readonly invalidateReviewerIds: readonly InstitutionalIdentifier[];
  readonly escalateReviewerIds: readonly InstitutionalIdentifier[];
  readonly abstainingReviewerIds: readonly InstitutionalIdentifier[];
  readonly recusedReviewerIds: readonly InstitutionalIdentifier[];

  readonly minimumReviewerCountSatisfied: boolean;
  readonly minimumApproverCountSatisfied: boolean;
  readonly independenceSatisfied: boolean;
  readonly unanimitySatisfied: boolean;
  readonly evaluatedAt: ISODateTimeString;
}

export interface RevalidationDecisionRecord {
  readonly decisionId: InstitutionalIdentifier;
  readonly revalidationId?: InstitutionalIdentifier;
  readonly decision: RevalidationDecision;
  readonly rationale: string;
  readonly conditions: readonly RevalidationCondition[];
  readonly limitations: readonly RevalidationLimitation[];

  readonly priorRecordRemainsImmutable: true;
  readonly historicalMutationPerformed: false;
  readonly findingCreated: false;
  readonly determinationCreated: false;
  readonly registryPublicationCreated: false;
  readonly executionArtifactCreated: false;
  readonly executionCreated: false;

  readonly decidedBySubjectIds: readonly InstitutionalIdentifier[];
  readonly decidedAt: ISODateTimeString;
  readonly integrityHash: ContentHash;
}

export interface RevalidationCondition {
  readonly conditionId: InstitutionalIdentifier;
  readonly type:
    | "evidence"
    | "authority"
    | "scope"
    | "assignment"
    | "law"
    | "standard"
    | "technical_control"
    | "runtime"
    | "outcome"
    | "continuity"
    | "time"
    | "other";
  readonly title: string;
  readonly description: string;
  readonly blocking: boolean;
  readonly satisfied: boolean;
  readonly satisfactionEvidenceIds: readonly InstitutionalIdentifier[];
  readonly dueAt?: ISODateTimeString;
}

export interface RevalidationLimitation {
  readonly limitationId: InstitutionalIdentifier;
  readonly type:
    | "evidence"
    | "authority"
    | "scope"
    | "assignment"
    | "version"
    | "jurisdiction"
    | "organization"
    | "law"
    | "standard"
    | "technical_control"
    | "runtime"
    | "outcome"
    | "continuity"
    | "other";
  readonly description: string;
  readonly material: boolean;
  readonly affectsDecision: boolean;
  readonly requiresDisclosure: boolean;
  readonly createdAt: ISODateTimeString;
}

/* ========================================================================== *
 * Core revalidation record
 * ========================================================================== */

export interface InstitutionalRevalidation {
  readonly revalidationId: InstitutionalIdentifier;
  readonly revalidationDefinitionId: InstitutionalIdentifier;

  readonly triggerId: InstitutionalIdentifier;
  readonly screeningId: InstitutionalIdentifier;
  readonly targetType: RevalidationTargetType;
  readonly targetId: InstitutionalIdentifier;
  readonly targetVersion?: string;
  readonly targetHash?: ContentHash;

  readonly state: RevalidationState;
  readonly severity: RevalidationSeverity;
  readonly changeClass: RevalidationChangeClass;

  readonly evidenceComparisonIds: readonly InstitutionalIdentifier[];
  readonly impactAnalysisId: InstitutionalIdentifier;
  readonly authorityVerificationId: InstitutionalIdentifier;
  readonly scopeVerificationId: InstitutionalIdentifier;
  readonly outcomeVerificationId?: InstitutionalIdentifier;
  readonly continuityVerificationId?: InstitutionalIdentifier;

  readonly reviewerPositions: readonly RevalidationReviewerPosition[];
  readonly concurrence: RevalidationConcurrence;
  readonly decision?: RevalidationDecisionRecord;

  readonly affectedRecordIds: readonly InstitutionalIdentifier[];
  readonly affectedFindingIds: readonly InstitutionalIdentifier[];
  readonly affectedDeterminationIds: readonly InstitutionalIdentifier[];
  readonly affectedRegistryReviewIds: readonly InstitutionalIdentifier[];
  readonly affectedPublicationIds: readonly InstitutionalIdentifier[];
  readonly affectedArtifactIds: readonly InstitutionalIdentifier[];
  readonly affectedExecutionIds: readonly InstitutionalIdentifier[];
  readonly affectedOutcomeIds: readonly InstitutionalIdentifier[];
  readonly affectedContinuityIds: readonly InstitutionalIdentifier[];

  readonly createdBySubjectId: InstitutionalIdentifier;
  readonly createdAt: ISODateTimeString;
  readonly updatedAt: ISODateTimeString;
  readonly completedAt?: ISODateTimeString;
  readonly heldAt?: ISODateTimeString;
  readonly escalatedAt?: ISODateTimeString;
  readonly withdrawnAt?: ISODateTimeString;
  readonly expiredAt?: ISODateTimeString;
  readonly supersededAt?: ISODateTimeString;
  readonly invalidatedAt?: ISODateTimeString;

  readonly priorRecordRemainsImmutable: true;
  readonly revalidationCreatedFinding: false;
  readonly revalidationCreatedDetermination: false;
  readonly revalidationCreatedRegistryPublication: false;
  readonly revalidationCreatedExecutionArtifact: false;
  readonly revalidationCreatedExecution: false;

  readonly correlationId: CorrelationIdentifier;
  readonly integrityHash: ContentHash;
}

/* ========================================================================== *
 * Validation
 * ========================================================================== */

export type RevalidationValidationCode =
  | "required"
  | "invalid_type"
  | "invalid_value"
  | "invalid_state"
  | "invalid_hash"
  | "invalid_date"
  | "invalid_role"
  | "invalid_record_type"
  | "unsupported_target_type"
  | "unsupported_trigger_type"
  | "duplicate_trigger"
  | "screening_incomplete"
  | "evidence_comparison_incomplete"
  | "impact_analysis_incomplete"
  | "authority_not_current"
  | "scope_not_verified"
  | "outcome_not_verified"
  | "continuity_not_verified"
  | "historical_mutation_detected"
  | "reviewer_count_insufficient"
  | "approver_count_insufficient"
  | "revalidation_created_finding"
  | "revalidation_created_determination"
  | "revalidation_created_registry_publication"
  | "revalidation_created_execution_artifact"
  | "revalidation_created_execution";

export interface RevalidationValidationIssue {
  readonly path: string;
  readonly code: RevalidationValidationCode;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly received?: unknown;
  readonly expected?: string;
}

export interface RevalidationValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly issues: readonly RevalidationValidationIssue[];
}

export class RevalidationContractValidationError extends Error {
  readonly issues: readonly RevalidationValidationIssue[];

  constructor(
    message: string,
    issues: readonly RevalidationValidationIssue[],
  ) {
    super(message);
    this.name = "RevalidationContractValidationError";
    this.issues = issues;
  }
}

export function validateRevalidationDefinition(
  input: unknown,
): RevalidationValidationResult<RevalidationDefinition> {
  const issues: RevalidationValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Revalidation definition must be an object.",
      input,
    );
  }

  requiredString(
    input.revalidationDefinitionId,
    "$.revalidationDefinitionId",
    issues,
  );
  requiredString(input.title, "$.title", issues);
  requiredString(input.description, "$.description", issues);
  requiredString(input.version, "$.version", issues);
  requiredString(
    input.revalidationBoundary,
    "$.revalidationBoundary",
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
      "Invalid revalidation definition hash.",
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
    input as unknown as RevalidationDefinition,
    issues,
  );
}

export function validateInstitutionalRevalidation(
  input: unknown,
): RevalidationValidationResult<InstitutionalRevalidation> {
  const issues: RevalidationValidationIssue[] = [];

  if (!isObject(input)) {
    return failValidation(
      "Institutional revalidation must be an object.",
      input,
    );
  }

  requiredString(input.revalidationId, "$.revalidationId", issues);
  requiredString(
    input.revalidationDefinitionId,
    "$.revalidationDefinitionId",
    issues,
  );
  requiredString(input.triggerId, "$.triggerId", issues);
  requiredString(input.screeningId, "$.screeningId", issues);
  requiredString(input.targetId, "$.targetId", issues);
  requiredString(input.correlationId, "$.correlationId", issues);

  if (!isOneOf(input.state, REVALIDATION_STATES)) {
    pushIssue(
      issues,
      "$.state",
      "invalid_state",
      "Unsupported revalidation state.",
      input.state,
    );
  }

  if (!isOneOf(input.targetType, REVALIDATION_TARGET_TYPES)) {
    pushIssue(
      issues,
      "$.targetType",
      "unsupported_target_type",
      "Unsupported revalidation target type.",
      input.targetType,
    );
  }

  if (input.priorRecordRemainsImmutable !== true) {
    pushIssue(
      issues,
      "$.priorRecordRemainsImmutable",
      "historical_mutation_detected",
      "Prior record immutability must remain true.",
      input.priorRecordRemainsImmutable,
    );
  }

  const hardFalseFields = [
    "revalidationCreatedFinding",
    "revalidationCreatedDetermination",
    "revalidationCreatedRegistryPublication",
    "revalidationCreatedExecutionArtifact",
    "revalidationCreatedExecution",
  ] as const;

  for (const field of hardFalseFields) {
    if (input[field] !== false) {
      const code: RevalidationValidationCode =
        field === "revalidationCreatedFinding"
          ? "revalidation_created_finding"
          : field === "revalidationCreatedDetermination"
            ? "revalidation_created_determination"
            : field === "revalidationCreatedRegistryPublication"
              ? "revalidation_created_registry_publication"
              : field === "revalidationCreatedExecutionArtifact"
                ? "revalidation_created_execution_artifact"
                : "revalidation_created_execution";

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
      "Invalid revalidation integrity hash.",
      input.integrityHash,
    );
  }

  return completeValidation(
    input as unknown as InstitutionalRevalidation,
    issues,
  );
}

/* ========================================================================== *
 * Trigger creation and screening
 * ========================================================================== */

export async function createRevalidationTrigger(
  input: {
    readonly triggerId: InstitutionalIdentifier;
    readonly triggerType: RevalidationTriggerType;
    readonly severity: RevalidationSeverity;
    readonly sourceType: RevalidationTrigger["sourceType"];
    readonly sourceId?: InstitutionalIdentifier;
    readonly targetType: RevalidationTargetType;
    readonly targetId: InstitutionalIdentifier;
    readonly targetVersion?: string;
    readonly targetHash?: ContentHash;
    readonly title: string;
    readonly description: string;
    readonly observedChange: JsonValue;
    readonly priorValue?: JsonValue;
    readonly newValue?: JsonValue;
    readonly evidenceRefs?: readonly InstitutionalIdentifier[];
    readonly affectedRecordIds?: readonly InstitutionalIdentifier[];
    readonly affectedEvidenceIds?: readonly InstitutionalIdentifier[];
    readonly affectedAuthorityGrantIds?: readonly InstitutionalIdentifier[];
    readonly affectedAssignmentIds?: readonly InstitutionalIdentifier[];
    readonly affectedOutcomeIds?: readonly InstitutionalIdentifier[];
    readonly detectedAt: ISODateTimeString;
    readonly detectedBy: "service" | InstitutionalIdentifier;
    readonly correlationId: CorrelationIdentifier;
    readonly hashCanonicalValue:
      (value: JsonValue) => Promise<ContentHash> | ContentHash;
  },
): Promise<RevalidationTrigger> {
  const base = {
    triggerId: input.triggerId,
    triggerType: input.triggerType,
    severity: input.severity,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    targetType: input.targetType,
    targetId: input.targetId,
    targetVersion: input.targetVersion,
    targetHash: input.targetHash,
    title: input.title,
    description: input.description,
    observedChange: input.observedChange,
    priorValue: input.priorValue,
    newValue: input.newValue,
    evidenceRefs: [...(input.evidenceRefs ?? [])],
    affectedRecordIds: [...(input.affectedRecordIds ?? [])],
    affectedEvidenceIds: [...(input.affectedEvidenceIds ?? [])],
    affectedAuthorityGrantIds: [
      ...(input.affectedAuthorityGrantIds ?? []),
    ],
    affectedAssignmentIds: [...(input.affectedAssignmentIds ?? [])],
    affectedOutcomeIds: [...(input.affectedOutcomeIds ?? [])],
    detectedAt: input.detectedAt,
    detectedBy: input.detectedBy,
    correlationId: input.correlationId,
  };

  const integrityHash = await input.hashCanonicalValue(
    base as unknown as JsonValue,
  );

  return deepFreeze({
    ...base,
    integrityHash,
  });
}

export function screenRevalidationTrigger(
  input: {
    readonly screeningId: InstitutionalIdentifier;
    readonly trigger: RevalidationTrigger;
    readonly policy: RevalidationScreeningPolicy;
    readonly duplicateTriggerIds?: readonly InstitutionalIdentifier[];
    readonly screenedAt: ISODateTimeString;
    readonly screenedBy: "service" | InstitutionalIdentifier;
  },
): RevalidationScreening {
  const duplicateTriggerIds = [...(input.duplicateTriggerIds ?? [])];
  const duplicate = duplicateTriggerIds.length > 0;

  const material = [
    "material_fact_change",
    "new_evidence",
    "evidence_version_change",
    "authority_change",
    "authority_expiry",
    "authority_revocation",
    "scope_change",
    "jurisdiction_change",
    "law_change",
    "regulation_change",
    "standard_change",
    "technical_control_change",
    "system_version_change",
    "model_version_change",
    "runtime_change",
    "outcome_change",
    "outcome_contradiction",
    "continuity_break",
    "confidence_degradation",
    "challenge_received",
    "appeal_received",
  ].includes(input.trigger.triggerType);

  const critical =
    input.trigger.severity === "critical" ||
    input.trigger.triggerType === "authority_revocation" ||
    input.trigger.triggerType === "outcome_contradiction" ||
    input.trigger.triggerType === "continuity_break";

  const changeClass: RevalidationChangeClass =
    critical
      ? "critical"
      : material
        ? "material"
        : input.trigger.severity === "informational"
          ? "administrative"
          : "non_material";

  const affectedDimensions = inferAffectedDimensions(
    input.trigger.triggerType,
  );

  const fullReviewRequired =
    critical ||
    material ||
    !input.policy.nonMaterialChangeMayCloseWithoutFullReview;

  const immediateHoldRequired =
    critical ||
    input.trigger.triggerType === "authority_revocation" ||
    input.trigger.triggerType === "evidence_expiry";

  const immediateEscalationRequired =
    input.trigger.triggerType === "outcome_contradiction" ||
    input.trigger.triggerType === "continuity_break";

  return deepFreeze({
    screeningId: input.screeningId,
    triggerId: input.trigger.triggerId,
    targetType: input.trigger.targetType,
    targetId: input.trigger.targetId,
    changeClass,
    severity: input.trigger.severity,
    material,
    critical,
    duplicate,
    duplicateTriggerIds,
    fullReviewRequired,
    immediateHoldRequired,
    immediateEscalationRequired,
    independentReviewRequired:
      input.trigger.triggerType === "authority_change" ||
      input.trigger.triggerType === "authority_revocation",
    panelReviewRequired:
      critical &&
      (
        input.trigger.triggerType === "outcome_contradiction" ||
        input.trigger.triggerType === "continuity_break"
      ),
    affectedDimensions,
    rationale:
      `Trigger ${input.trigger.triggerType} classified as ${changeClass} ` +
      `with ${input.trigger.severity} severity.`,
    limitations:
      duplicate
        ? ["Duplicate triggers remain preserved and linked."]
        : [],
    screenedAt: input.screenedAt,
    screenedBy: input.screenedBy,
  });
}

/* ========================================================================== *
 * Evidence comparison and impact analysis
 * ========================================================================== */

export function compareRevalidationEvidence(
  input: {
    readonly comparisonId: InstitutionalIdentifier;
    readonly triggerId: InstitutionalIdentifier;
    readonly priorEvidenceId?: InstitutionalIdentifier;
    readonly priorEvidenceVersion?: string;
    readonly currentEvidenceId: InstitutionalIdentifier;
    readonly currentEvidenceVersion: string;
    readonly priorHash?: ContentHash;
    readonly currentHash: ContentHash;
    readonly attributable: boolean;
    readonly permitted: boolean;
    readonly current: boolean;
    readonly integrityVerified: boolean;
    readonly provenanceVerified: boolean;
    readonly relevant: boolean;
    readonly affectedPropositions?: readonly string[];
    readonly changedFields?: readonly string[];
    readonly limitations?: readonly string[];
    readonly comparedAt: ISODateTimeString;
    readonly comparedBy: "service" | InstitutionalIdentifier;
  },
): RevalidationEvidenceComparison {
  let relationship: RevalidationEvidenceComparison["relationship"];

  if (!input.current) {
    relationship = "expired";
  } else if (!input.priorHash) {
    relationship = "expanded";
  } else if (input.priorHash === input.currentHash) {
    relationship = "same";
  } else if (
    (input.changedFields?.length ?? 0) === 0
  ) {
    relationship = "administrative_change";
  } else {
    relationship = "superseding";
  }

  return deepFreeze({
    comparisonId: input.comparisonId,
    triggerId: input.triggerId,
    priorEvidenceId: input.priorEvidenceId,
    priorEvidenceVersion: input.priorEvidenceVersion,
    currentEvidenceId: input.currentEvidenceId,
    currentEvidenceVersion: input.currentEvidenceVersion,
    relationship,
    attributable: input.attributable,
    permitted: input.permitted,
    current: input.current,
    integrityVerified: input.integrityVerified,
    provenanceVerified: input.provenanceVerified,
    relevant: input.relevant,
    affectedPropositions: [...(input.affectedPropositions ?? [])],
    changedFields: [...(input.changedFields ?? [])],
    priorHash: input.priorHash,
    currentHash: input.currentHash,
    limitations: [...(input.limitations ?? [])],
    comparedAt: input.comparedAt,
    comparedBy: input.comparedBy,
  });
}

export function analyzeRevalidationImpact(
  input: {
    readonly impactAnalysisId: InstitutionalIdentifier;
    readonly trigger: RevalidationTrigger;
    readonly screening: RevalidationScreening;
    readonly evidenceComparisons:
      readonly RevalidationEvidenceComparison[];
    readonly affectedFindingIds?: readonly InstitutionalIdentifier[];
    readonly affectedDeterminationIds?: readonly InstitutionalIdentifier[];
    readonly affectedRegistryReviewIds?: readonly InstitutionalIdentifier[];
    readonly affectedPublicationIds?: readonly InstitutionalIdentifier[];
    readonly affectedArtifactIds?: readonly InstitutionalIdentifier[];
    readonly affectedExecutionIds?: readonly InstitutionalIdentifier[];
    readonly affectedOutcomeIds?: readonly InstitutionalIdentifier[];
    readonly affectedContinuityIds?: readonly InstitutionalIdentifier[];
    readonly analyzedAt: ISODateTimeString;
    readonly analyzedBy: "service" | InstitutionalIdentifier;
  },
): RevalidationImpactAnalysis {
  const contradictoryEvidence = input.evidenceComparisons.some(
    (comparison) => comparison.relationship === "contradictory",
  );

  const expiredEvidence = input.evidenceComparisons.some(
    (comparison) => comparison.relationship === "expired",
  );

  const evidenceImpact:
    RevalidationImpactAnalysis["evidenceImpact"] =
    contradictoryEvidence
      ? "critical"
      : expiredEvidence
        ? "material"
        : input.evidenceComparisons.some(
            (comparison) =>
              comparison.relationship === "superseding" ||
              comparison.relationship === "expanded" ||
              comparison.relationship === "reduced",
          )
          ? "material"
          : input.evidenceComparisons.length > 0
            ? "limited"
            : "none";

  const authorityImpact =
    input.screening.affectedDimensions.includes("authority")
      ? input.screening.critical
        ? "critical"
        : "material"
      : "none";

  const scopeImpact =
    input.screening.affectedDimensions.includes("scope")
      ? input.screening.material
        ? "material"
        : "limited"
      : "none";

  const outcomeImpact =
    input.screening.affectedDimensions.includes("outcome")
      ? input.screening.critical
        ? "critical"
        : "material"
      : "none";

  const continuityImpact =
    input.screening.affectedDimensions.includes("continuity")
      ? input.screening.critical
        ? "critical"
        : "material"
      : "none";

  const criticalImpact = [
    evidenceImpact,
    authorityImpact,
    scopeImpact,
    outcomeImpact,
    continuityImpact,
  ].includes("critical");

  const materialImpact = [
    evidenceImpact,
    authorityImpact,
    scopeImpact,
    outcomeImpact,
    continuityImpact,
  ].includes("material");

  return deepFreeze({
    impactAnalysisId: input.impactAnalysisId,
    triggerId: input.trigger.triggerId,
    targetType: input.trigger.targetType,
    targetId: input.trigger.targetId,
    affectedFindingIds: [...(input.affectedFindingIds ?? [])],
    affectedDeterminationIds: [...(input.affectedDeterminationIds ?? [])],
    affectedRegistryReviewIds: [
      ...(input.affectedRegistryReviewIds ?? []),
    ],
    affectedPublicationIds: [...(input.affectedPublicationIds ?? [])],
    affectedArtifactIds: [...(input.affectedArtifactIds ?? [])],
    affectedExecutionIds: [...(input.affectedExecutionIds ?? [])],
    affectedOutcomeIds: [...(input.affectedOutcomeIds ?? [])],
    affectedContinuityIds: [...(input.affectedContinuityIds ?? [])],
    evidenceImpact,
    authorityImpact,
    scopeImpact,
    outcomeImpact,
    continuityImpact,
    priorDecisionMayRemainCurrent: !criticalImpact && !materialImpact,
    priorDecisionRequiresConditions: materialImpact && !criticalImpact,
    newFindingRequired: materialImpact || criticalImpact,
    newDeterminationRequired: materialImpact || criticalImpact,
    newRegistryReviewRequired: materialImpact || criticalImpact,
    newPublicationRequired: false,
    newArtifactRequired: false,
    executionHoldRequired:
      criticalImpact || input.screening.immediateHoldRequired,
    rationale:
      criticalImpact
        ? "Critical impact requires hold or escalation and a new governed review cycle."
        : materialImpact
          ? "Material impact requires a new governed review cycle."
          : "No material impact requiring a new decision was identified.",
    limitations: [
      TA14_REVALIDATION_BOUNDARY,
    ],
    analyzedAt: input.analyzedAt,
    analyzedBy: input.analyzedBy,
  });
}

/* ========================================================================== *
 * Review concurrence and decision
 * ========================================================================== */

export function evaluateRevalidationConcurrence(
  input: {
    readonly concurrenceId: InstitutionalIdentifier;
    readonly positions: readonly RevalidationReviewerPosition[];
    readonly policy: RevalidationReviewPolicy;
    readonly critical: boolean;
    readonly invalidationProposed: boolean;
    readonly authorityChange: boolean;
    readonly now: ISODateTimeString;
  },
): RevalidationConcurrence {
  const active = input.positions.filter(
    (position) => position.position !== "recuse",
  );

  const current = active.filter(
    (position) => position.position === "confirm_current",
  );
  const conditional = active.filter(
    (position) => position.position === "confirm_with_conditions",
  );
  const newReview = active.filter(
    (position) => position.position === "require_new_review",
  );
  const hold = active.filter(
    (position) => position.position === "hold",
  );
  const supersede = active.filter(
    (position) => position.position === "supersede",
  );
  const withdraw = active.filter(
    (position) => position.position === "withdraw",
  );
  const invalidate = active.filter(
    (position) => position.position === "invalidate",
  );
  const escalate = active.filter(
    (position) => position.position === "escalate",
  );
  const abstaining = active.filter(
    (position) => position.position === "abstain",
  );
  const recused = input.positions.filter(
    (position) => position.position === "recuse",
  );

  const minimumReviewerCount =
    input.critical && input.policy.dualReviewRequiredForCritical
      ? Math.max(2, input.policy.minimumReviewerCount)
      : input.policy.minimumReviewerCount;

  const minimumReviewerCountSatisfied =
    active.length >= minimumReviewerCount;

  const approvers =
    current.length +
    conditional.length +
    newReview.length +
    hold.length +
    supersede.length +
    withdraw.length +
    invalidate.length +
    escalate.length;

  const minimumApproverCountSatisfied =
    approvers >= input.policy.minimumApproverCount;

  const independenceRequired =
    input.authorityChange &&
    input.policy.independentReviewerRequiredForAuthorityChange;

  const independenceSatisfied =
    !independenceRequired ||
    active.some((position) => position.independent);

  const unanimityRequired =
    input.invalidationProposed &&
    input.policy.unanimityRequiredForInvalidation;

  const nonInvalidatePositions =
    active.filter(
      (position) =>
        !["invalidate", "abstain"].includes(position.position),
    );

  const unanimitySatisfied =
    !unanimityRequired ||
    (
      invalidate.length > 0 &&
      nonInvalidatePositions.length === 0
    );

  const decisionGroups = [
    current.length > 0,
    conditional.length > 0,
    newReview.length > 0,
    hold.length > 0,
    supersede.length > 0,
    withdraw.length > 0,
    invalidate.length > 0,
    escalate.length > 0,
  ].filter(Boolean).length;

  const state: RevalidationConcurrence["state"] =
    !minimumReviewerCountSatisfied
      ? "insufficient_reviewers"
      : !minimumApproverCountSatisfied
        ? "insufficient_approvers"
        : !independenceSatisfied || !unanimitySatisfied
          ? "disputed"
          : decisionGroups > 1
            ? "disputed"
            : conditional.length > 0
              ? "qualified"
              : active.length > 0 && abstaining.length === 0
                ? "unanimous"
                : "majority";

  return deepFreeze({
    concurrenceId: input.concurrenceId,
    state,
    currentReviewerIds: current.map((position) => position.reviewerSubjectId),
    conditionalReviewerIds: conditional.map(
      (position) => position.reviewerSubjectId,
    ),
    newReviewReviewerIds: newReview.map(
      (position) => position.reviewerSubjectId,
    ),
    holdReviewerIds: hold.map((position) => position.reviewerSubjectId),
    supersedeReviewerIds: supersede.map(
      (position) => position.reviewerSubjectId,
    ),
    withdrawReviewerIds: withdraw.map(
      (position) => position.reviewerSubjectId,
    ),
    invalidateReviewerIds: invalidate.map(
      (position) => position.reviewerSubjectId,
    ),
    escalateReviewerIds: escalate.map(
      (position) => position.reviewerSubjectId,
    ),
    abstainingReviewerIds: abstaining.map(
      (position) => position.reviewerSubjectId,
    ),
    recusedReviewerIds: recused.map(
      (position) => position.reviewerSubjectId,
    ),
    minimumReviewerCountSatisfied,
    minimumApproverCountSatisfied,
    independenceSatisfied,
    unanimitySatisfied,
    evaluatedAt: input.now,
  });
}

export function resolveRevalidationDecision(
  input: {
    readonly screening: RevalidationScreening;
    readonly impact: RevalidationImpactAnalysis;
    readonly authority: RevalidationAuthorityVerification;
    readonly scope: RevalidationScopeVerification;
    readonly outcome?: RevalidationOutcomeVerification;
    readonly continuity?: RevalidationContinuityVerification;
    readonly concurrence: RevalidationConcurrence;
  },
): RevalidationDecision {
  if (
    input.continuity?.historicalMutationDetected ||
    input.continuity?.priorChainIntact === false
  ) {
    return "INVALIDATE";
  }

  if (
    input.authority.state === "revoked" ||
    input.scope.state === "outside_authority"
  ) {
    return "HOLD";
  }

  if (
    input.outcome?.state === "contradictory" ||
    input.outcome?.state === "failed" ||
    input.screening.immediateEscalationRequired
  ) {
    return "ESCALATE";
  }

  if (
    input.concurrence.state === "disputed" ||
    input.concurrence.state === "insufficient_reviewers" ||
    input.concurrence.state === "insufficient_approvers"
  ) {
    return "ESCALATE";
  }

  if (input.impact.executionHoldRequired) {
    return "HOLD";
  }

  if (input.impact.newDeterminationRequired) {
    return "REVIEW_REQUIRED";
  }

  if (input.impact.priorDecisionRequiresConditions) {
    return "CURRENT_WITH_CONDITIONS";
  }

  return "CURRENT";
}

export async function createRevalidationDecision(
  input: {
    readonly decisionId: InstitutionalIdentifier;
    readonly revalidationId?: InstitutionalIdentifier;
    readonly decision: RevalidationDecision;
    readonly rationale: string;
    readonly conditions?: readonly RevalidationCondition[];
    readonly limitations?: readonly RevalidationLimitation[];
    readonly decidedBySubjectIds: readonly InstitutionalIdentifier[];
    readonly decidedAt: ISODateTimeString;
    readonly hashCanonicalValue:
      (value: JsonValue) => Promise<ContentHash> | ContentHash;
  },
): Promise<RevalidationDecisionRecord> {
  const base = {
    decisionId: input.decisionId,
    revalidationId: input.revalidationId,
    decision: input.decision,
    rationale: input.rationale,
    conditions: [...(input.conditions ?? [])],
    limitations: [...(input.limitations ?? [])],
    priorRecordRemainsImmutable: true as const,
    historicalMutationPerformed: false as const,
    findingCreated: false as const,
    determinationCreated: false as const,
    registryPublicationCreated: false as const,
    executionArtifactCreated: false as const,
    executionCreated: false as const,
    decidedBySubjectIds: [...input.decidedBySubjectIds],
    decidedAt: input.decidedAt,
  };

  const integrityHash = await input.hashCanonicalValue(
    base as unknown as JsonValue,
  );

  return deepFreeze({
    ...base,
    integrityHash,
  });
}

/* ========================================================================== *
 * Revalidation creation and lifecycle
 * ========================================================================== */

export async function createInstitutionalRevalidation(
  input: {
    readonly revalidationId: InstitutionalIdentifier;
    readonly definition: RevalidationDefinition;
    readonly trigger: RevalidationTrigger;
    readonly screening: RevalidationScreening;
    readonly evidenceComparisons:
      readonly RevalidationEvidenceComparison[];
    readonly impact: RevalidationImpactAnalysis;
    readonly authority: RevalidationAuthorityVerification;
    readonly scope: RevalidationScopeVerification;
    readonly outcome?: RevalidationOutcomeVerification;
    readonly continuity?: RevalidationContinuityVerification;
    readonly reviewerPositions: readonly RevalidationReviewerPosition[];
    readonly concurrence: RevalidationConcurrence;
    readonly createdBySubjectId: InstitutionalIdentifier;
    readonly now: ISODateTimeString;
    readonly hashCanonicalValue:
      (value: JsonValue) => Promise<ContentHash> | ContentHash;
  },
): Promise<InstitutionalRevalidation> {
  if (
    !input.definition.supportedTargetTypes.includes(
      input.trigger.targetType,
    )
  ) {
    throw new Error(
      `Target type ${input.trigger.targetType} is not supported.`,
    );
  }

  if (
    !input.definition.supportedTriggerTypes.includes(
      input.trigger.triggerType,
    )
  ) {
    throw new Error(
      `Trigger type ${input.trigger.triggerType} is not supported.`,
    );
  }

  const state: RevalidationState =
    input.screening.immediateEscalationRequired
      ? "escalated"
      : input.screening.immediateHoldRequired
        ? "held"
        : input.screening.fullReviewRequired
          ? "under_review"
          : "screening";

  const base = {
    revalidationId: input.revalidationId,
    revalidationDefinitionId:
      input.definition.revalidationDefinitionId,
    triggerId: input.trigger.triggerId,
    screeningId: input.screening.screeningId,
    targetType: input.trigger.targetType,
    targetId: input.trigger.targetId,
    targetVersion: input.trigger.targetVersion,
    targetHash: input.trigger.targetHash,
    state,
    severity: input.screening.severity,
    changeClass: input.screening.changeClass,
    evidenceComparisonIds: input.evidenceComparisons.map(
      (comparison) => comparison.comparisonId,
    ),
    impactAnalysisId: input.impact.impactAnalysisId,
    authorityVerificationId:
      input.authority.authorityVerificationId,
    scopeVerificationId: input.scope.scopeVerificationId,
    outcomeVerificationId: input.outcome?.outcomeVerificationId,
    continuityVerificationId:
      input.continuity?.continuityVerificationId,
    reviewerPositions: input.reviewerPositions.map((position) => ({
      ...position,
      revalidationId: input.revalidationId,
    })),
    concurrence: input.concurrence,
    affectedRecordIds: input.trigger.affectedRecordIds,
    affectedFindingIds: input.impact.affectedFindingIds,
    affectedDeterminationIds: input.impact.affectedDeterminationIds,
    affectedRegistryReviewIds: input.impact.affectedRegistryReviewIds,
    affectedPublicationIds: input.impact.affectedPublicationIds,
    affectedArtifactIds: input.impact.affectedArtifactIds,
    affectedExecutionIds: input.impact.affectedExecutionIds,
    affectedOutcomeIds: input.impact.affectedOutcomeIds,
    affectedContinuityIds: input.impact.affectedContinuityIds,
    createdBySubjectId: input.createdBySubjectId,
    createdAt: input.now,
    updatedAt: input.now,
    heldAt: state === "held" ? input.now : undefined,
    escalatedAt: state === "escalated" ? input.now : undefined,
    priorRecordRemainsImmutable: true as const,
    revalidationCreatedFinding: false as const,
    revalidationCreatedDetermination: false as const,
    revalidationCreatedRegistryPublication: false as const,
    revalidationCreatedExecutionArtifact: false as const,
    revalidationCreatedExecution: false as const,
    correlationId: input.trigger.correlationId,
  };

  const integrityHash = await input.hashCanonicalValue(
    base as unknown as JsonValue,
  );

  const revalidation: InstitutionalRevalidation = {
    ...base,
    integrityHash,
  };

  const validation = validateInstitutionalRevalidation(revalidation);

  if (!validation.ok) {
    throw new RevalidationContractValidationError(
      "Institutional revalidation failed validation.",
      validation.issues,
    );
  }

  return deepFreeze(revalidation);
}

export function completeRevalidation(
  revalidation: InstitutionalRevalidation,
  decision: RevalidationDecisionRecord,
  now: ISODateTimeString,
): InstitutionalRevalidation {
  assertRevalidationMutable(revalidation);

  if (
    decision.revalidationId &&
    decision.revalidationId !== revalidation.revalidationId
  ) {
    throw new Error(
      "Revalidation decision does not belong to the revalidation.",
    );
  }

  return deepFreeze({
    ...revalidation,
    state:
      decision.decision === "HOLD"
        ? "held"
        : decision.decision === "ESCALATE"
          ? "escalated"
          : decision.decision === "INVALIDATE"
            ? "invalidated"
            : decision.decision === "WITHDRAW"
              ? "withdrawn"
              : decision.decision === "SUPERSEDE"
                ? "superseded"
                : "completed",
    decision: {
      ...decision,
      revalidationId: revalidation.revalidationId,
    },
    completedAt:
      ["CURRENT", "CURRENT_WITH_CONDITIONS", "REVIEW_REQUIRED"].includes(
        decision.decision,
      )
        ? now
        : undefined,
    heldAt:
      decision.decision === "HOLD"
        ? now
        : revalidation.heldAt,
    escalatedAt:
      decision.decision === "ESCALATE"
        ? now
        : revalidation.escalatedAt,
    withdrawnAt:
      decision.decision === "WITHDRAW"
        ? now
        : revalidation.withdrawnAt,
    supersededAt:
      decision.decision === "SUPERSEDE"
        ? now
        : revalidation.supersededAt,
    invalidatedAt:
      decision.decision === "INVALIDATE"
        ? now
        : revalidation.invalidatedAt,
    updatedAt: now,
  });
}

export function holdRevalidation(
  revalidation: InstitutionalRevalidation,
  now: ISODateTimeString,
): InstitutionalRevalidation {
  assertRevalidationMutable(revalidation);

  return deepFreeze({
    ...revalidation,
    state: "held",
    heldAt: now,
    updatedAt: now,
  });
}

export function escalateRevalidation(
  revalidation: InstitutionalRevalidation,
  now: ISODateTimeString,
): InstitutionalRevalidation {
  assertRevalidationMutable(revalidation);

  return deepFreeze({
    ...revalidation,
    state: "escalated",
    escalatedAt: now,
    updatedAt: now,
  });
}

export function withdrawRevalidation(
  revalidation: InstitutionalRevalidation,
  now: ISODateTimeString,
): InstitutionalRevalidation {
  assertRevalidationMutable(revalidation);

  return deepFreeze({
    ...revalidation,
    state: "withdrawn",
    withdrawnAt: now,
    updatedAt: now,
  });
}

function assertRevalidationMutable(
  revalidation: InstitutionalRevalidation,
): void {
  if (
    [
      "completed",
      "withdrawn",
      "expired",
      "superseded",
      "invalidated",
    ].includes(revalidation.state)
  ) {
    throw new Error(
      `Revalidation ${revalidation.revalidationId} is immutable in state ${revalidation.state}.`,
    );
  }
}

/* ========================================================================== *
 * Public projection
 * ========================================================================== */

export interface PublicRevalidationProjection {
  readonly revalidationId: InstitutionalIdentifier;
  readonly targetType: RevalidationTargetType;
  readonly state: RevalidationState;
  readonly triggerType?: RevalidationTriggerType;
  readonly severity?: RevalidationSeverity;
  readonly decision?: RevalidationDecision;
  readonly conditions: readonly string[];
  readonly limitations: readonly string[];
  readonly affectedRecordIds: readonly InstitutionalIdentifier[];
  readonly createdAt: ISODateTimeString;
  readonly completedAt?: ISODateTimeString;
  readonly revalidationBoundary: string;
  readonly integrityHash: ContentHash;
}

export function projectPublicRevalidation(
  definition: RevalidationDefinition,
  trigger: RevalidationTrigger,
  revalidation: InstitutionalRevalidation,
): PublicRevalidationProjection {
  if (!definition.projectionPolicy.publicProjectionAllowed) {
    throw new Error(
      "Revalidation definition does not permit public projection.",
    );
  }

  return deepFreeze({
    revalidationId: revalidation.revalidationId,
    targetType: revalidation.targetType,
    state: revalidation.state,
    triggerType:
      definition.projectionPolicy.exposeTriggerTypePublicly
        ? trigger.triggerType
        : undefined,
    severity:
      definition.projectionPolicy.exposeSeverityPublicly
        ? revalidation.severity
        : undefined,
    decision:
      definition.projectionPolicy.exposeDecisionPublicly
        ? revalidation.decision?.decision
        : undefined,
    conditions:
      definition.projectionPolicy.exposeConditionsPublicly
        ? (
            revalidation.decision?.conditions.map(
              (condition) => condition.description,
            ) ?? []
          )
        : [],
    limitations:
      definition.projectionPolicy.exposeLimitationsPublicly
        ? (
            revalidation.decision?.limitations
              .filter((limitation) => limitation.requiresDisclosure)
              .map((limitation) => limitation.description) ?? []
          )
        : [],
    affectedRecordIds:
      definition.projectionPolicy.exposeAffectedRecordIdsPublicly
        ? revalidation.affectedRecordIds
        : [],
    createdAt: revalidation.createdAt,
    completedAt: revalidation.completedAt,
    revalidationBoundary: TA14_REVALIDATION_BOUNDARY,
    integrityHash: revalidation.integrityHash,
  });
}

/* ========================================================================== *
 * Repository contracts
 * ========================================================================== */

export interface RevalidationDefinitionRepository {
  getDefinition(
    revalidationDefinitionId: InstitutionalIdentifier,
    version?: string,
  ): Promise<RevalidationDefinition | null>;

  getActiveDefinition(
    targetType: RevalidationTargetType,
    at?: ISODateTimeString,
  ): Promise<RevalidationDefinition | null>;

  saveDefinition(
    definition: RevalidationDefinition,
  ): Promise<void>;
}

export interface RevalidationTriggerRepository {
  getTrigger(
    triggerId: InstitutionalIdentifier,
  ): Promise<RevalidationTrigger | null>;

  saveTrigger(
    trigger: RevalidationTrigger,
  ): Promise<void>;

  listForTarget(
    targetType: RevalidationTargetType,
    targetId: InstitutionalIdentifier,
  ): Promise<readonly RevalidationTrigger[]>;
}

export interface RevalidationRepository {
  getRevalidation(
    revalidationId: InstitutionalIdentifier,
  ): Promise<InstitutionalRevalidation | null>;

  saveRevalidation(
    revalidation: InstitutionalRevalidation,
  ): Promise<void>;

  listForTarget(
    targetType: RevalidationTargetType,
    targetId: InstitutionalIdentifier,
  ): Promise<readonly InstitutionalRevalidation[]>;
}

/* ========================================================================== *
 * In-memory repositories
 * ========================================================================== */

export class InMemoryRevalidationDefinitionRepository
implements RevalidationDefinitionRepository {
  private readonly values =
    new Map<string, RevalidationDefinition>();

  async getDefinition(
    id: InstitutionalIdentifier,
    version?: string,
  ): Promise<RevalidationDefinition | null> {
    if (version) {
      return this.values.get(`${id}@${version}`) ?? null;
    }

    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.revalidationDefinitionId === id,
        )
        .sort(
          (a, b) =>
            Date.parse(b.effectiveAt) -
            Date.parse(a.effectiveAt),
        )[0] ?? null
    );
  }

  async getActiveDefinition(
    targetType: RevalidationTargetType,
    at = new Date().toISOString(),
  ): Promise<RevalidationDefinition | null> {
    const time = Date.parse(at);

    return (
      Array.from(this.values.values())
        .filter(
          (value) =>
            value.active &&
            value.supportedTargetTypes.includes(targetType),
        )
        .filter(
          (value) =>
            Date.parse(value.effectiveAt) <= time &&
            (
              !value.expiresAt ||
              Date.parse(value.expiresAt) > time
            ),
        )
        .sort(
          (a, b) =>
            Date.parse(b.effectiveAt) -
            Date.parse(a.effectiveAt),
        )[0] ?? null
    );
  }

  async saveDefinition(
    definition: RevalidationDefinition,
  ): Promise<void> {
    const validation = validateRevalidationDefinition(definition);

    if (!validation.ok) {
      throw new RevalidationContractValidationError(
        "Cannot save invalid revalidation definition.",
        validation.issues,
      );
    }

    const key =
      `${definition.revalidationDefinitionId}@${definition.version}`;

    if (this.values.has(key)) {
      throw new Error(
        `Revalidation definition ${key} already exists.`,
      );
    }

    this.values.set(key, deepFreeze(definition));
  }
}

export class InMemoryRevalidationTriggerRepository
implements RevalidationTriggerRepository {
  private readonly values =
    new Map<InstitutionalIdentifier, RevalidationTrigger>();

  async getTrigger(
    triggerId: InstitutionalIdentifier,
  ): Promise<RevalidationTrigger | null> {
    return this.values.get(triggerId) ?? null;
  }

  async saveTrigger(
    trigger: RevalidationTrigger,
  ): Promise<void> {
    if (this.values.has(trigger.triggerId)) {
      throw new Error(
        `Revalidation trigger ${trigger.triggerId} already exists.`,
      );
    }

    this.values.set(trigger.triggerId, deepFreeze(trigger));
  }

  async listForTarget(
    targetType: RevalidationTargetType,
    targetId: InstitutionalIdentifier,
  ): Promise<readonly RevalidationTrigger[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (trigger) =>
            trigger.targetType === targetType &&
            trigger.targetId === targetId,
        )
        .sort(
          (a, b) =>
            Date.parse(b.detectedAt) -
            Date.parse(a.detectedAt),
        ),
    );
  }
}

export class InMemoryRevalidationRepository
implements RevalidationRepository {
  private readonly values =
    new Map<InstitutionalIdentifier, InstitutionalRevalidation>();

  async getRevalidation(
    revalidationId: InstitutionalIdentifier,
  ): Promise<InstitutionalRevalidation | null> {
    return this.values.get(revalidationId) ?? null;
  }

  async saveRevalidation(
    revalidation: InstitutionalRevalidation,
  ): Promise<void> {
    const validation =
      validateInstitutionalRevalidation(revalidation);

    if (!validation.ok) {
      throw new RevalidationContractValidationError(
        "Cannot save invalid institutional revalidation.",
        validation.issues,
      );
    }

    this.values.set(
      revalidation.revalidationId,
      deepFreeze(revalidation),
    );
  }

  async listForTarget(
    targetType: RevalidationTargetType,
    targetId: InstitutionalIdentifier,
  ): Promise<readonly InstitutionalRevalidation[]> {
    return deepFreeze(
      Array.from(this.values.values())
        .filter(
          (revalidation) =>
            revalidation.targetType === targetType &&
            revalidation.targetId === targetId,
        )
        .sort(
          (a, b) =>
            Date.parse(b.createdAt) -
            Date.parse(a.createdAt),
        ),
    );
  }
}

/* ========================================================================== *
 * Service orchestration
 * ========================================================================== */

export interface RevalidationIdentifierFactory {
  readonly createTriggerId: () => InstitutionalIdentifier;
  readonly createScreeningId: () => InstitutionalIdentifier;
  readonly createEvidenceComparisonId: () => InstitutionalIdentifier;
  readonly createImpactAnalysisId: () => InstitutionalIdentifier;
  readonly createAuthorityVerificationId: () => InstitutionalIdentifier;
  readonly createScopeVerificationId: () => InstitutionalIdentifier;
  readonly createOutcomeVerificationId: () => InstitutionalIdentifier;
  readonly createContinuityVerificationId: () => InstitutionalIdentifier;
  readonly createReviewerPositionId: () => InstitutionalIdentifier;
  readonly createConcurrenceId: () => InstitutionalIdentifier;
  readonly createDecisionId: () => InstitutionalIdentifier;
  readonly createConditionId: () => InstitutionalIdentifier;
  readonly createLimitationId: () => InstitutionalIdentifier;
  readonly createRevalidationId: () => InstitutionalIdentifier;
}

export interface RevalidationServiceDependencies {
  readonly definitions: RevalidationDefinitionRepository;
  readonly triggers: RevalidationTriggerRepository;
  readonly revalidations: RevalidationRepository;
  readonly ids: RevalidationIdentifierFactory;
  readonly now: () => ISODateTimeString;
  readonly hashCanonicalValue:
    (value: JsonValue) => Promise<ContentHash> | ContentHash;
  readonly events?: AcademyEventService;
}

export class RevalidationService {
  constructor(
    private readonly dependencies: RevalidationServiceDependencies,
  ) {}

  async trigger(
    input: {
      readonly triggerType: RevalidationTriggerType;
      readonly severity: RevalidationSeverity;
      readonly sourceType: RevalidationTrigger["sourceType"];
      readonly sourceId?: InstitutionalIdentifier;
      readonly targetType: RevalidationTargetType;
      readonly targetId: InstitutionalIdentifier;
      readonly targetVersion?: string;
      readonly targetHash?: ContentHash;
      readonly title: string;
      readonly description: string;
      readonly observedChange: JsonValue;
      readonly priorValue?: JsonValue;
      readonly newValue?: JsonValue;
      readonly evidenceRefs?: readonly InstitutionalIdentifier[];
      readonly affectedRecordIds?: readonly InstitutionalIdentifier[];
      readonly affectedEvidenceIds?: readonly InstitutionalIdentifier[];
      readonly affectedAuthorityGrantIds?: readonly InstitutionalIdentifier[];
      readonly affectedAssignmentIds?: readonly InstitutionalIdentifier[];
      readonly affectedOutcomeIds?: readonly InstitutionalIdentifier[];
      readonly detectedBy: "service" | InstitutionalIdentifier;
      readonly correlationId: CorrelationIdentifier;
    },
  ): Promise<RevalidationTrigger> {
    const trigger = await createRevalidationTrigger({
      triggerId: this.dependencies.ids.createTriggerId(),
      ...input,
      detectedAt: this.dependencies.now(),
      hashCanonicalValue: this.dependencies.hashCanonicalValue,
    });

    await this.dependencies.triggers.saveTrigger(trigger);

    return trigger;
  }

  async open(
    input: {
      readonly trigger: RevalidationTrigger;
      readonly duplicateTriggerIds?: readonly InstitutionalIdentifier[];
      readonly evidenceComparisons?:
        readonly RevalidationEvidenceComparison[];
      readonly affectedFindingIds?: readonly InstitutionalIdentifier[];
      readonly affectedDeterminationIds?: readonly InstitutionalIdentifier[];
      readonly affectedRegistryReviewIds?: readonly InstitutionalIdentifier[];
      readonly affectedPublicationIds?: readonly InstitutionalIdentifier[];
      readonly affectedArtifactIds?: readonly InstitutionalIdentifier[];
      readonly affectedExecutionIds?: readonly InstitutionalIdentifier[];
      readonly affectedOutcomeIds?: readonly InstitutionalIdentifier[];
      readonly affectedContinuityIds?: readonly InstitutionalIdentifier[];
      readonly authority: RevalidationAuthorityVerification;
      readonly scope: RevalidationScopeVerification;
      readonly outcome?: RevalidationOutcomeVerification;
      readonly continuity?: RevalidationContinuityVerification;
      readonly reviewerPositions: readonly RevalidationReviewerPosition[];
      readonly createdBySubjectId: InstitutionalIdentifier;
    },
  ): Promise<InstitutionalRevalidation> {
    const definition =
      await this.dependencies.definitions.getActiveDefinition(
        input.trigger.targetType,
        this.dependencies.now(),
      );

    if (!definition) {
      throw new Error(
        `No active revalidation definition exists for ${input.trigger.targetType}.`,
      );
    }

    const now = this.dependencies.now();

    const screening = screenRevalidationTrigger({
      screeningId: this.dependencies.ids.createScreeningId(),
      trigger: input.trigger,
      policy: definition.screeningPolicy,
      duplicateTriggerIds: input.duplicateTriggerIds,
      screenedAt: now,
      screenedBy: "service",
    });

    const comparisons = [...(input.evidenceComparisons ?? [])];

    const impact = analyzeRevalidationImpact({
      impactAnalysisId:
        this.dependencies.ids.createImpactAnalysisId(),
      trigger: input.trigger,
      screening,
      evidenceComparisons: comparisons,
      affectedFindingIds: input.affectedFindingIds,
      affectedDeterminationIds: input.affectedDeterminationIds,
      affectedRegistryReviewIds: input.affectedRegistryReviewIds,
      affectedPublicationIds: input.affectedPublicationIds,
      affectedArtifactIds: input.affectedArtifactIds,
      affectedExecutionIds: input.affectedExecutionIds,
      affectedOutcomeIds: input.affectedOutcomeIds,
      affectedContinuityIds: input.affectedContinuityIds,
      analyzedAt: now,
      analyzedBy: "service",
    });

    const concurrence = evaluateRevalidationConcurrence({
      concurrenceId: this.dependencies.ids.createConcurrenceId(),
      positions: input.reviewerPositions,
      policy: definition.reviewPolicy,
      critical: screening.critical,
      invalidationProposed: input.reviewerPositions.some(
        (position) => position.position === "invalidate",
      ),
      authorityChange:
        input.trigger.triggerType === "authority_change" ||
        input.trigger.triggerType === "authority_revocation",
      now,
    });

    const revalidation = await createInstitutionalRevalidation({
      revalidationId:
        this.dependencies.ids.createRevalidationId(),
      definition,
      trigger: input.trigger,
      screening,
      evidenceComparisons: comparisons,
      impact,
      authority: input.authority,
      scope: input.scope,
      outcome: input.outcome,
      continuity: input.continuity,
      reviewerPositions: input.reviewerPositions,
      concurrence,
      createdBySubjectId: input.createdBySubjectId,
      now,
      hashCanonicalValue: this.dependencies.hashCanonicalValue,
    });

    await this.dependencies.revalidations.saveRevalidation(
      revalidation,
    );

    return revalidation;
  }
}

/* ========================================================================== *
 * Canonical definition
 * ========================================================================== */

export const INSTITUTIONAL_REVALIDATION_DEFINITION_ID =
  "TA14-REVALIDATION-DEF-INSTITUTIONAL-000001" as const;

export const institutionalRevalidationDefinition:
RevalidationDefinition = deepFreeze({
  revalidationDefinitionId:
    INSTITUTIONAL_REVALIDATION_DEFINITION_ID,

  title:
    "Institutional Material-Change Revalidation",

  description:
    "Evaluates whether a prior finding, determination, review, publication, artifact, execution, outcome, continuity record, authority grant, assignment, credential, evidence package, or governed record remains current after material change.",

  version: "3.0",
  active: true,

  supportedTargetTypes: REVALIDATION_TARGET_TYPES,

  allowedRoles: [
    "authorized_reviewer",
    "academy_standards_reviewer",
    "institutional_administrator",
    "registry_reviewer",
    "artifact_steward",
    "service_role",
  ],

  allowedRecordTypes: [
    "finding",
    "determination",
    "review",
    "registry_entry",
    "execution_artifact",
    "execution",
    "outcome",
    "continuity",
    "authority_grant",
    "assignment",
    "credential",
    "evidence_package",
    "governed_record",
  ],

  supportedTriggerTypes: REVALIDATION_TRIGGER_TYPES,

  triggerPolicy: {
    automaticTriggersAllowed: true,
    manualTriggersAllowed: true,
    scheduledTriggersAllowed: true,
    challengeTriggersAllowed: true,
    appealTriggersAllowed: true,
    minimumSeverityForAutomaticReview: "moderate",
    criticalTriggerImmediatelyHoldsTarget: true,
    authorityRevocationImmediatelyHoldsTarget: true,
    evidenceExpiryImmediatelyHoldsTarget: true,
    outcomeContradictionImmediatelyEscalates: true,
    duplicateTriggerWindowHours: 24,
    preserveDuplicateTriggerReferences: true,
  },

  screeningPolicy: {
    screeningRequired: true,
    classifyMateriality: true,
    classifySeverity: true,
    identifyAffectedRecords: true,
    identifyAffectedEvidence: true,
    identifyAffectedAuthority: true,
    identifyAffectedScope: true,
    identifyAffectedOutcomes: true,
    nonMaterialChangeMayCloseWithoutFullReview: true,
    unknownMaterialityDecision: "HOLD",
  },

  evidencePolicy: {
    requireChangeEvidence: true,
    requireAttribution: true,
    requirePermission: true,
    requireCurrentVersion: true,
    requireIntegrityVerification: true,
    requireProvenanceVerification: true,
    requireComparisonToPriorEvidence: true,
    requireAffectedPropositionMapping: true,
    allowConfidentialEvidence: true,
    allowExternallyHostedEvidence: true,
    staleEvidenceDecision: "HOLD",
    conflictingEvidenceDecision: "ESCALATE",
  },

  authorityPolicy: {
    requireCurrentReviewAuthority: true,
    requireAuthorityForTargetType: true,
    requireOrganizationMatch: true,
    requireJurisdictionMatch: true,
    requireRoleMatch: true,
    requireAssignmentMatch: true,
    allowConstrainedAuthority: true,
    authorityChangeRequiresIndependentReview: true,
    authorityRevocationDecision: "HOLD",
  },

  scopePolicy: {
    requirePriorScopeSnapshot: true,
    requireCurrentScopeSnapshot: true,
    requireScopeComparison: true,
    requireTargetRecordMatch: true,
    requireTargetVersionMatch: true,
    requireOrganizationMatch: true,
    requireJurisdictionMatch: true,
    scopeExpansionRequiresNewAuthority: true,
    scopeReductionMayProceedWithConstraints: true,
    unknownScopeDecision: "HOLD",
  },

  reviewPolicy: {
    reviewRequired: true,
    minimumReviewerCount: 1,
    minimumApproverCount: 1,
    dualReviewRequiredForCritical: true,
    panelRequiredForInvalidation: true,
    independentReviewerRequiredForAuthorityChange: true,
    conflictCheckRequired: true,
    authorityCheckRequired: true,
    assignmentCheckRequired: true,
    competenceCheckRequired: true,
    unanimityRequiredForInvalidation: true,
    dissentAllowed: true,
    abstentionAllowed: true,
    recusalAllowed: true,
    disputedReviewDecision: "ESCALATE",
  },

  decisionPolicy: {
    currentDecisionAllowed: true,
    conditionalCurrentDecisionAllowed: true,
    reviewRequiredDecisionAllowed: true,
    holdDecisionAllowed: true,
    supersedeDecisionAllowed: true,
    withdrawDecisionAllowed: true,
    invalidateDecisionAllowed: true,
    escalateDecisionAllowed: true,
    supersessionCreatesNewRecordOnly: true,
    invalidationPreservesHistoricalRecord: true,
    withdrawalPreservesHistoricalRecord: true,
    decisionCreatesFinding: false,
    decisionCreatesDetermination: false,
    decisionCreatesRegistryPublication: false,
    decisionCreatesExecutionArtifact: false,
    decisionCreatesExecution: false,
  },

  continuityPolicy: {
    preserveOriginalRecord: true,
    preserveOriginalHashes: true,
    preserveOriginalTimestamps: true,
    preserveOriginalAuthorityContext: true,
    preserveOriginalScopeContext: true,
    preserveOriginalEvidenceContext: true,
    preserveOriginalOutcomeContext: true,
    createForwardReferenceToNewReview: true,
    createBackwardReferenceToPriorRecord: true,
    requireNewVersionForMaterialChange: true,
    requireNewDeterminationForDecisionChange: true,
  },

  projectionPolicy: {
    publicProjectionAllowed: true,
    authenticatedProjectionAllowed: true,
    controlledProjectionAllowed: true,
    confidentialProjectionAllowed: true,
    protectedFields: [
      "affectedEvidenceIds",
      "affectedAuthorityGrantIds",
      "reviewerPositions.reviewerSubjectId",
      "decision.decidedBySubjectIds",
    ],
    publicFields: [
      "revalidationId",
      "targetType",
      "state",
      "severity",
      "changeClass",
      "decision.decision",
      "decision.conditions",
      "decision.limitations",
      "createdAt",
      "completedAt",
      "integrityHash",
    ],
    exposeTriggerTypePublicly: true,
    exposeSeverityPublicly: true,
    exposeDecisionPublicly: true,
    exposeConditionsPublicly: true,
    exposeLimitationsPublicly: true,
    exposeAffectedRecordIdsPublicly: false,
  },

  retentionPolicy: {
    retainRequestDays: 2555,
    retainTriggerDays: 2555,
    retainReviewDays: 2555,
    retainDecisionDays: 2555,
    retainEvidenceComparisonDays: 2555,
    preserveCompletedRevalidation: true,
    preserveWithdrawnRevalidation: true,
    preserveSupersededRevalidation: true,
    preserveInvalidatedRevalidation: true,
  },

  revalidationBoundary: TA14_REVALIDATION_BOUNDARY,

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

export function createDeterministicRevalidationDependencies(
  startAt = "2026-08-04T21:00:00.000Z",
): {
  readonly ids: RevalidationIdentifierFactory;
  readonly now: () => ISODateTimeString;
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
      createTriggerId: () =>
        next("TA14-REVALIDATION-TRIGGER"),
      createScreeningId: () =>
        next("TA14-REVALIDATION-SCREEN"),
      createEvidenceComparisonId: () =>
        next("TA14-REVALIDATION-EVIDENCE"),
      createImpactAnalysisId: () =>
        next("TA14-REVALIDATION-IMPACT"),
      createAuthorityVerificationId: () =>
        next("TA14-REVALIDATION-AUTH"),
      createScopeVerificationId: () =>
        next("TA14-REVALIDATION-SCOPE"),
      createOutcomeVerificationId: () =>
        next("TA14-REVALIDATION-OUTCOME"),
      createContinuityVerificationId: () =>
        next("TA14-REVALIDATION-CONTINUITY"),
      createReviewerPositionId: () =>
        next("TA14-REVALIDATION-POSITION"),
      createConcurrenceId: () =>
        next("TA14-REVALIDATION-CONCURRENCE"),
      createDecisionId: () =>
        next("TA14-REVALIDATION-DECISION"),
      createConditionId: () =>
        next("TA14-REVALIDATION-CONDITION"),
      createLimitationId: () =>
        next("TA14-REVALIDATION-LIMITATION"),
      createRevalidationId: () =>
        next("TA14-REVALIDATION"),
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

export interface RevalidationEngineSelfCheck {
  readonly ok: boolean;
  readonly definitionValid: boolean;
  readonly priorRecordRemainsImmutable: true;
  readonly revalidationCreatedFinding: false;
  readonly revalidationCreatedDetermination: false;
  readonly revalidationCreatedRegistryPublication: false;
  readonly revalidationCreatedExecutionArtifact: false;
  readonly revalidationCreatedExecution: false;
  readonly issues: readonly string[];
}

export function runRevalidationEngineSelfCheck():
RevalidationEngineSelfCheck {
  const issues: string[] = [];

  const validation = validateRevalidationDefinition(
    institutionalRevalidationDefinition,
  );

  if (!validation.ok) {
    issues.push(
      "Canonical institutional revalidation definition failed validation.",
    );
  }

  return {
    ok: issues.length === 0,
    definitionValid: validation.ok,
    priorRecordRemainsImmutable: true,
    revalidationCreatedFinding: false,
    revalidationCreatedDetermination: false,
    revalidationCreatedRegistryPublication: false,
    revalidationCreatedExecutionArtifact: false,
    revalidationCreatedExecution: false,
    issues,
  };
}

/* ========================================================================== *
 * Internal utilities
 * ========================================================================== */

function inferAffectedDimensions(
  triggerType: RevalidationTriggerType,
): RevalidationScreening["affectedDimensions"] {
  switch (triggerType) {
    case "new_evidence":
    case "evidence_version_change":
    case "evidence_expiry":
      return ["evidence"];

    case "authority_change":
    case "authority_expiry":
    case "authority_revocation":
      return ["authority", "assignment"];

    case "assignment_change":
      return ["assignment"];

    case "scope_change":
      return ["scope"];

    case "jurisdiction_change":
      return ["scope", "jurisdiction"];

    case "organization_change":
      return ["scope", "organization"];

    case "law_change":
    case "regulation_change":
      return ["law"];

    case "standard_change":
      return ["standard"];

    case "policy_change":
      return ["policy"];

    case "technical_control_change":
      return ["technical_control"];

    case "system_version_change":
    case "model_version_change":
    case "runtime_change":
      return ["technical_control", "runtime"];

    case "outcome_change":
    case "outcome_contradiction":
      return ["outcome"];

    case "continuity_break":
      return ["continuity"];

    case "confidence_degradation":
      return ["confidence"];

    default:
      return ["other"];
  }
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

function isOneOf<T extends readonly string[]>(
  value: unknown,
  allowed: T,
): value is T[number] {
  return (
    typeof value === "string" &&
    allowed.includes(value as T[number])
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
  issues: RevalidationValidationIssue[],
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
  guard: (value: unknown) => value is T,
  issues: RevalidationValidationIssue[],
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
  issues: RevalidationValidationIssue[],
  path: string,
  code: RevalidationValidationCode,
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
): RevalidationValidationResult<T> {
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
  issues: RevalidationValidationIssue[],
): RevalidationValidationResult<T> {
  const ok = !issues.some(
    (issue) => issue.severity === "error",
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
  return JSON.stringify(sortJson(value));
}

function sortJson(
  value: JsonValue,
): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }

  if (isObject(value)) {
    const result: Record<string, JsonValue> = {};

    for (const key of Object.keys(value).sort()) {
      result[key] = sortJson(
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
    const code = value.charCodeAt(index);

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
    .map(
      (part) =>
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

const revalidationContracts = {
  engineId: TA14_REVALIDATION_ENGINE_ID,
  engineVersion: TA14_REVALIDATION_ENGINE_VERSION,
  boundary: TA14_REVALIDATION_BOUNDARY,

  revalidationStates: REVALIDATION_STATES,
  triggerTypes: REVALIDATION_TRIGGER_TYPES,
  severities: REVALIDATION_SEVERITIES,
  decisions: REVALIDATION_DECISIONS,
  targetTypes: REVALIDATION_TARGET_TYPES,

  validateRevalidationDefinition,
  validateInstitutionalRevalidation,

  createRevalidationTrigger,
  screenRevalidationTrigger,
  compareRevalidationEvidence,
  analyzeRevalidationImpact,
  evaluateRevalidationConcurrence,
  resolveRevalidationDecision,
  createRevalidationDecision,
  createInstitutionalRevalidation,

  completeRevalidation,
  holdRevalidation,
  escalateRevalidation,
  withdrawRevalidation,

  projectPublicRevalidation,

  InMemoryRevalidationDefinitionRepository,
  InMemoryRevalidationTriggerRepository,
  InMemoryRevalidationRepository,

  RevalidationService,

  institutionalRevalidationDefinition,
  createDeterministicRevalidationDependencies,
  runRevalidationEngineSelfCheck,
};

export default revalidationContracts;
