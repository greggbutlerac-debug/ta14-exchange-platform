/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * ACD-005 — Academy Assessment Contracts
 *
 * Create:
 *   apps/web/lib/academy/assessment-contracts.ts
 *
 * Constitutional boundaries:
 * - Passing does not create authority.
 * - Passing does not issue a credential.
 * - Passing does not create Registry or artifact effect.
 * - Passing may create bounded eligibility evidence for a separate process.
 */

import type {
  AssessmentState,
  ContentHash,
  CorrelationIdentifier,
  InstitutionalIdentifier,
  InstitutionalRecordType,
  InstitutionalRole,
  ISODateTimeString,
  JsonValue,
  LessonIdentifier,
  ValidationIssue,
  ValidationResult,
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
  AssessmentResultPayload,
} from "./academy-events";

import { createAssessmentResultEventDraft } from "./academy-events";

export const TA14_ACADEMY_ASSESSMENT_ENGINE_VERSION = "3.0" as const;
export const TA14_ACADEMY_ASSESSMENT_ENGINE_ID =
  "TA14-ACD-ASSESSMENT-ENGINE-000001" as const;
export const TA14_ACADEMY_ASSESSMENT_BOUNDARY =
  "Assessment may establish bounded evidence of learning or competence. It does not itself issue a credential, grant authority, admit operational evidence, create a determination, create an execution artifact, or publish a Registry record." as const;

export const ASSESSMENT_PUBLICATION_STATES = [
  "draft",
  "active",
  "restricted",
  "superseded",
  "withdrawn",
] as const;
export type AssessmentPublicationState =
  (typeof ASSESSMENT_PUBLICATION_STATES)[number];

export const ASSESSMENT_ITEM_TYPES = [
  "single_choice",
  "multiple_choice",
  "true_false",
  "short_answer",
  "long_form",
  "ordering",
  "matching",
  "classification",
  "evidence_selection",
  "boundary_identification",
  "scenario_decision",
  "route_construction",
  "record_interpretation",
  "practical_exercise",
  "simulation_observation",
  "oral_review",
  "portfolio_review",
] as const;
export type AssessmentItemType = (typeof ASSESSMENT_ITEM_TYPES)[number];

export const ASSESSMENT_DELIVERY_MODES = [
  "self_paced",
  "timed",
  "instructor_led",
  "proctored",
  "simulation_linked",
  "practical",
  "oral",
  "portfolio",
  "hybrid",
] as const;
export type AssessmentDeliveryMode =
  (typeof ASSESSMENT_DELIVERY_MODES)[number];

export const SCORING_MODELS = [
  "points",
  "weighted_domains",
  "rubric",
  "binary",
  "mastery",
  "hybrid",
] as const;
export type ScoringModel = (typeof SCORING_MODELS)[number];

export const EVALUATOR_TYPES = [
  "automated",
  "authorized_human",
  "hybrid",
  "panel",
] as const;
export type AssessmentEvaluatorType = (typeof EVALUATOR_TYPES)[number];

export const ASSESSMENT_INTEGRITY_STATES = [
  "unverified",
  "verified",
  "flagged",
  "under_review",
  "invalidated",
] as const;
export type AssessmentIntegrityState =
  (typeof ASSESSMENT_INTEGRITY_STATES)[number];

export const ASSESSMENT_REVIEW_STATES = [
  "not_required",
  "pending",
  "assigned",
  "in_progress",
  "returned_for_clarification",
  "completed",
  "escalated",
] as const;
export type AssessmentReviewState =
  (typeof ASSESSMENT_REVIEW_STATES)[number];

export const APPEAL_STATES = [
  "not_filed",
  "filed",
  "screening",
  "accepted_for_review",
  "denied",
  "in_review",
  "resolved",
  "withdrawn",
] as const;
export type AssessmentAppealState = (typeof APPEAL_STATES)[number];

export const COMPETENCY_LEVELS = [
  "awareness",
  "foundational",
  "working",
  "applied",
  "advanced",
  "specialist",
] as const;
export type CompetencyLevel = (typeof COMPETENCY_LEVELS)[number];

export const ACCOMMODATION_TYPES = [
  "extended_time",
  "screen_reader",
  "keyboard_navigation",
  "high_contrast",
  "reduced_motion",
  "alternative_format",
  "breaks",
  "oral_response",
  "scribe",
  "language_support",
  "other",
] as const;
export type AccommodationType = (typeof ACCOMMODATION_TYPES)[number];

export type EligibilityEvidenceState =
  | "not_created"
  | "pending"
  | "active"
  | "restricted"
  | "expired"
  | "revoked"
  | "superseded";

export interface AssessmentMetadata {
  readonly ownerSubjectId: InstitutionalIdentifier;
  readonly ownerOrganizationId?: InstitutionalIdentifier;
  readonly createdBy: InstitutionalIdentifier;
  readonly createdAt: ISODateTimeString;
  readonly updatedBy: InstitutionalIdentifier;
  readonly updatedAt: ISODateTimeString;
  readonly approvedBy?: InstitutionalIdentifier;
  readonly approvedAt?: ISODateTimeString;
  readonly technicalOwnerId?: InstitutionalIdentifier;
  readonly academyStandardsReviewerId?: InstitutionalIdentifier;
}

export interface AssessmentDomain {
  readonly domainId: string;
  readonly title: string;
  readonly description: string;
  readonly weight: number;
  readonly minimumDomainScore?: number;
  readonly boundaryCritical: boolean;
  readonly competencyIds: readonly string[];
}

export interface CompetencyMapping {
  readonly competencyId: string;
  readonly title: string;
  readonly description: string;
  readonly level: CompetencyLevel;
  readonly domainId: string;
  readonly itemIds: readonly string[];
  readonly minimumEvidenceCount: number;
  readonly requiresHumanReview: boolean;
}

export interface AssessmentItemReference {
  readonly itemId: string;
  readonly itemVersion?: string;
  readonly order: number;
  readonly required: boolean;
  readonly domainId: string;
  readonly points: number;
  readonly randomizationGroup?: string;
  readonly branchCondition?: string;
}

export interface AssessmentPassPolicy {
  readonly minimumOverallScore?: number;
  readonly minimumDomainScores: Readonly<Record<string, number>>;
  readonly requiredItemIds: readonly string[];
  readonly boundaryFailureIds: readonly string[];
  readonly boundaryFailuresAlwaysFail: boolean;
  readonly allowConditionalPass: boolean;
  readonly conditionalPassConditions: readonly string[];
  readonly manualReviewThreshold?: number;
  readonly automaticPassAllowed: boolean;
  readonly automaticFailAllowed: boolean;
  readonly underReviewOnAmbiguity: boolean;
}

export interface AssessmentAttemptPolicy {
  readonly maximumAttempts?: number;
  readonly cooldownMinutes?: number;
  readonly attemptWindowDays?: number;
  readonly resumeAllowed: boolean;
  readonly restartAllowed: boolean;
  readonly preservePriorAttempts: true;
  readonly invalidateOnVersionChange: boolean;
  readonly allowInstructorReset: boolean;
  readonly resetRequiresReason: boolean;
}

export interface AssessmentTimePolicy {
  readonly timed: boolean;
  readonly durationMinutes?: number;
  readonly warningMinutes: readonly number[];
  readonly autoSubmitOnExpiry: boolean;
  readonly pauseAllowed: boolean;
  readonly pauseRequiresAuthorization: boolean;
  readonly serverTimeAuthoritative: true;
}

export interface AssessmentIntegrityPolicy {
  readonly identityVerificationRequired: boolean;
  readonly browserLockdownRequired: boolean;
  readonly proctoringRequired: boolean;
  readonly plagiarismCheckRequired: boolean;
  readonly responseHashRequired: boolean;
  readonly itemOrderRandomized: boolean;
  readonly optionOrderRandomized: boolean;
  readonly detectConcurrentAttempts: boolean;
  readonly detectCopyPaste: boolean;
  readonly detectTabSwitches: boolean;
  readonly detectAutomationSignals: boolean;
  readonly suspiciousBehaviorThreshold?: number;
  readonly integrityFlagsRequireReview: boolean;
  readonly invalidationAuthorityRole:
    | "academy_standards_reviewer"
    | "institutional_administrator"
    | "service_role";
}

export interface AssessmentAccommodationPolicy {
  readonly accommodationsAllowed: boolean;
  readonly supportedTypes: readonly AccommodationType[];
  readonly requestRequired: boolean;
  readonly approvalRequired: boolean;
  readonly approvingRoles: readonly InstitutionalRole[];
  readonly preservePrivacy: boolean;
  readonly alterCompetencyStandard: false;
  readonly auditRequired: boolean;
}

export interface AssessmentReviewPolicy {
  readonly reviewRequired: "never" | "always" | "conditional";
  readonly reviewTriggers: readonly string[];
  readonly reviewerRoles: readonly InstitutionalRole[];
  readonly conflictCheckRequired: boolean;
  readonly blindReviewAllowed: boolean;
  readonly multipleReviewersRequired: boolean;
  readonly minimumReviewerCount: number;
  readonly reviewerAgreementRequired: boolean;
  readonly disagreementCreatesEscalation: boolean;
  readonly reviewSlaHours?: number;
}

export interface AssessmentAppealPolicy {
  readonly appealsAllowed: boolean;
  readonly filingWindowDays?: number;
  readonly grounds: readonly string[];
  readonly initialScreeningRole?: InstitutionalRole;
  readonly reviewingRoles: readonly InstitutionalRole[];
  readonly independentReviewerRequired: boolean;
  readonly preserveOriginalResult: true;
  readonly possibleOutcomes: readonly (
    | "affirm"
    | "rescore"
    | "reassess"
    | "invalidate"
    | "return_for_clarification"
    | "escalate"
  )[];
}

export interface AssessmentRevalidationPolicy {
  readonly triggers: readonly string[];
  readonly severityByTrigger: Readonly<
    Record<string, "low" | "moderate" | "high" | "critical">
  >;
  readonly expiresEligibilityEvidence: boolean;
  readonly mayInvalidateAttempts: boolean;
  readonly mayRequireReassessment: boolean;
  readonly mayHoldDependentAssignments: boolean;
  readonly preserveHistoricalResult: true;
}

export interface AssessmentProjectionPolicy {
  readonly publicSafe: boolean;
  readonly visibility:
    | "public"
    | "authenticated"
    | "organization"
    | "controlled"
    | "confidential";
  readonly protectedFields: readonly string[];
  readonly publicSummary?: string;
  readonly exposeItemContentPublicly: false;
  readonly exposeCorrectAnswersPublicly: false;
  readonly exposeRubricPublicly: boolean;
  readonly exposeAggregateAnalyticsPublicly: boolean;
}

export interface CredentialEligibilityOutput {
  readonly eligibilityType: string;
  readonly credentialType?: string;
  readonly competencyIds: readonly string[];
  readonly minimumAssessmentResult: "passed" | "conditionally_passed";
  readonly expiresAfterDays?: number;
  readonly restrictions: readonly string[];
  readonly createsCredential: false;
  readonly createsAuthority: false;
  readonly requiresSeparateCredentialProcess: true;
  readonly requiresSeparateAuthorityProcess: true;
}

export interface SimulationAssessmentHook {
  readonly simulationScenarioId: InstitutionalIdentifier;
  readonly simulationVersion?: string;
  readonly requiredCheckpointIds: readonly string[];
  readonly allowedEvidenceFields: readonly string[];
  readonly prohibitedEvidenceFields: readonly string[];
  readonly resultImportMode: "none" | "observations_only" | "reviewed_inputs_only";
  readonly simulationOutcomeCreatesAssessmentPass: false;
  readonly simulationOutcomeCreatesAuthority: false;
}

export interface AssessmentDefinition {
  readonly assessmentId: InstitutionalIdentifier;
  readonly stableSlug: string;
  readonly title: string;
  readonly summary: string;
  readonly version: string;
  readonly locale: string;
  readonly publicationState: AssessmentPublicationState;
  readonly lessonIds: readonly LessonIdentifier[];
  readonly operationalFunctions: readonly string[];
  readonly recordTypes: readonly InstitutionalRecordType[];
  readonly roles: readonly InstitutionalRole[];
  readonly deliveryMode: AssessmentDeliveryMode;
  readonly evaluatorType: AssessmentEvaluatorType;
  readonly scoringModel: ScoringModel;
  readonly instructions: readonly string[];
  readonly learningObjectives: readonly string[];
  readonly competencyMappings: readonly CompetencyMapping[];
  readonly domains: readonly AssessmentDomain[];
  readonly itemRefs: readonly AssessmentItemReference[];
  readonly rubricRefs: readonly string[];
  readonly passPolicy: AssessmentPassPolicy;
  readonly attemptPolicy: AssessmentAttemptPolicy;
  readonly timePolicy: AssessmentTimePolicy;
  readonly integrityPolicy: AssessmentIntegrityPolicy;
  readonly accommodationPolicy: AssessmentAccommodationPolicy;
  readonly reviewPolicy: AssessmentReviewPolicy;
  readonly appealPolicy: AssessmentAppealPolicy;
  readonly revalidationPolicy: AssessmentRevalidationPolicy;
  readonly projectionPolicy: AssessmentProjectionPolicy;
  readonly simulationHooks: readonly SimulationAssessmentHook[];
  readonly credentialEligibilityOutputs: readonly CredentialEligibilityOutput[];
  readonly authorityBoundary: string;
  readonly nonSubstitutionRule: typeof TA14_ACADEMY_NON_SUBSTITUTION_RULE;
  readonly contentHash: ContentHash;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly supersedesAssessmentId?: InstitutionalIdentifier;
  readonly supersedesVersion?: string;
  readonly metadata: AssessmentMetadata;
}

export interface AssessmentItemBase {
  readonly itemId: string;
  readonly version: string;
  readonly type: AssessmentItemType;
  readonly title: string;
  readonly prompt: string;
  readonly instructions: readonly string[];
  readonly domainId: string;
  readonly competencyIds: readonly string[];
  readonly points: number;
  readonly difficulty: "introductory" | "intermediate" | "advanced" | "specialist";
  readonly required: boolean;
  readonly boundaryCritical: boolean;
  readonly boundaryFailureId?: string;
  readonly rationale: string;
  readonly tags: readonly string[];
  readonly effectiveAt: ISODateTimeString;
  readonly contentHash: ContentHash;
  readonly publicationState: AssessmentPublicationState;
}

export interface ChoiceOption {
  readonly optionId: string;
  readonly label: string;
  readonly correct: boolean;
  readonly rationale: string;
  readonly boundaryViolation?: string;
}

export interface ChoiceAssessmentItem extends AssessmentItemBase {
  readonly type: "single_choice" | "multiple_choice" | "true_false";
  readonly options: readonly ChoiceOption[];
  readonly minimumSelections?: number;
  readonly maximumSelections?: number;
  readonly partialCreditAllowed: boolean;
}

export interface TextAssessmentItem extends AssessmentItemBase {
  readonly type: "short_answer" | "long_form";
  readonly minimumCharacters?: number;
  readonly maximumCharacters?: number;
  readonly requiredConcepts: readonly string[];
  readonly prohibitedClaims: readonly string[];
  readonly evaluator: AssessmentEvaluatorType;
}

export interface OrderingAssessmentItem extends AssessmentItemBase {
  readonly type: "ordering";
  readonly values: readonly {
    readonly valueId: string;
    readonly label: string;
    readonly correctOrder: number;
  }[];
  readonly partialCreditAllowed: boolean;
}

export interface MatchingAssessmentItem extends AssessmentItemBase {
  readonly type: "matching";
  readonly left: readonly { readonly valueId: string; readonly label: string }[];
  readonly right: readonly { readonly valueId: string; readonly label: string }[];
  readonly correctPairs: Readonly<Record<string, string>>;
  readonly partialCreditAllowed: boolean;
}

export interface AssessmentEvidenceOption {
  readonly evidenceId: string;
  readonly title: string;
  readonly description: string;
  readonly admissible: boolean;
  readonly classification:
    | "public"
    | "controlled"
    | "confidential"
    | "excluded"
    | "conditionally_permitted";
  readonly rationale: string;
}

export interface AssessmentDecisionOption {
  readonly decisionId: string;
  readonly label: string;
  readonly result:
    | "ALLOW"
    | "HOLD"
    | "DENY"
    | "ESCALATE"
    | "CORRECT"
    | "REVALIDATE"
    | "OUTSIDE_SCOPE";
  readonly correct: boolean;
  readonly rationale: string;
  readonly boundaryViolation?: string;
}

export interface ScenarioDecisionAssessmentItem extends AssessmentItemBase {
  readonly type:
    | "scenario_decision"
    | "evidence_selection"
    | "boundary_identification"
    | "record_interpretation"
    | "classification";
  readonly scenario: string;
  readonly sourceRecordType?: InstitutionalRecordType;
  readonly availableEvidence: readonly AssessmentEvidenceOption[];
  readonly decisions: readonly AssessmentDecisionOption[];
  readonly requiredRationale: boolean;
  readonly minimumRationaleCharacters?: number;
}

export interface PracticalAssessmentItem extends AssessmentItemBase {
  readonly type:
    | "practical_exercise"
    | "route_construction"
    | "simulation_observation"
    | "oral_review"
    | "portfolio_review";
  readonly task: string;
  readonly requiredOutputs: readonly string[];
  readonly artifactSchema?: Readonly<Record<string, JsonValue>>;
  readonly rubricId: string;
  readonly reviewerRequired: boolean;
  readonly simulationScenarioId?: InstitutionalIdentifier;
}

export type AssessmentItem =
  | ChoiceAssessmentItem
  | TextAssessmentItem
  | OrderingAssessmentItem
  | MatchingAssessmentItem
  | ScenarioDecisionAssessmentItem
  | PracticalAssessmentItem;

export interface AssessmentRubric {
  readonly rubricId: string;
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly criteria: readonly RubricCriterion[];
  readonly scoringModel: "points" | "levels" | "hybrid";
  readonly maximumScore: number;
  readonly minimumPassingScore: number;
  readonly boundaryCriticalCriterionIds: readonly string[];
  readonly requiresHumanReview: boolean;
  readonly contentHash: ContentHash;
  readonly effectiveAt: ISODateTimeString;
  readonly publicationState: AssessmentPublicationState;
}

export interface RubricCriterion {
  readonly criterionId: string;
  readonly title: string;
  readonly description: string;
  readonly weight: number;
  readonly competencyIds: readonly string[];
  readonly boundaryCritical: boolean;
  readonly levels: readonly RubricLevel[];
}

export interface RubricLevel {
  readonly levelId: string;
  readonly title: string;
  readonly description: string;
  readonly score: number;
  readonly pass: boolean;
  readonly limitations: readonly string[];
}

export interface AssessmentResponseBase {
  readonly itemId: string;
  readonly itemVersion: string;
  readonly startedAt?: ISODateTimeString;
  readonly answeredAt?: ISODateTimeString;
  readonly durationSeconds?: number;
  readonly changedCount: number;
  readonly flaggedForReview: boolean;
}

export interface ChoiceResponse extends AssessmentResponseBase {
  readonly responseType: "choice";
  readonly selectedOptionIds: readonly string[];
}

export interface TextResponse extends AssessmentResponseBase {
  readonly responseType: "text";
  readonly text: string;
  readonly attachments: readonly AssessmentAttachment[];
}

export interface OrderingResponse extends AssessmentResponseBase {
  readonly responseType: "ordering";
  readonly orderedValueIds: readonly string[];
}

export interface MatchingResponse extends AssessmentResponseBase {
  readonly responseType: "matching";
  readonly pairs: Readonly<Record<string, string>>;
}

export interface ScenarioDecisionResponse extends AssessmentResponseBase {
  readonly responseType: "scenario_decision";
  readonly selectedEvidenceIds: readonly string[];
  readonly selectedDecisionId: string;
  readonly rationale: string;
}

export interface PracticalResponse extends AssessmentResponseBase {
  readonly responseType: "practical";
  readonly output: Readonly<Record<string, JsonValue>>;
  readonly attachments: readonly AssessmentAttachment[];
  readonly simulationRecordId?: InstitutionalIdentifier;
}

export type AssessmentResponse =
  | ChoiceResponse
  | TextResponse
  | OrderingResponse
  | MatchingResponse
  | ScenarioDecisionResponse
  | PracticalResponse;

export interface AssessmentAttachment {
  readonly attachmentId: InstitutionalIdentifier;
  readonly fileName: string;
  readonly mediaType: string;
  readonly sizeBytes: number;
  readonly integrityHash: ContentHash;
  readonly visibility: "controlled" | "confidential";
  readonly uploadedAt: ISODateTimeString;
}

export interface AssessmentIntegritySignal {
  readonly signalId: InstitutionalIdentifier;
  readonly type:
    | "concurrent_session"
    | "rapid_response"
    | "copy_paste"
    | "tab_switch"
    | "automation_signal"
    | "identity_mismatch"
    | "proctor_flag"
    | "response_similarity"
    | "attachment_integrity"
    | "other";
  readonly severity: "low" | "moderate" | "high" | "critical";
  readonly description: string;
  readonly observedAt: ISODateTimeString;
  readonly evidenceRefs: readonly string[];
  readonly reviewRequired: boolean;
  readonly invalidatingByItself: boolean;
}

export interface ApprovedAssessmentAccommodation {
  readonly accommodationId: InstitutionalIdentifier;
  readonly type: AccommodationType;
  readonly description: string;
  readonly approvedBy?: InstitutionalIdentifier;
  readonly approvedAt?: ISODateTimeString;
  readonly parameters: Readonly<Record<string, JsonValue>>;
  readonly altersCompetencyStandard: false;
  readonly privacyClassification: "controlled" | "confidential";
}

export interface AssessmentReviewAssignment {
  readonly assignmentId: InstitutionalIdentifier;
  readonly reviewerSubjectId: InstitutionalIdentifier;
  readonly reviewerRole: InstitutionalRole;
  readonly assignedAt: ISODateTimeString;
  readonly acceptedAt?: ISODateTimeString;
  readonly completedAt?: ISODateTimeString;
  readonly conflictDeclared: boolean;
  readonly conflictDescription?: string;
  readonly authorityGrantId?: InstitutionalIdentifier;
  readonly scope: readonly string[];
  readonly state: AssessmentReviewState;
}

export interface AssessmentAppeal {
  readonly appealId: InstitutionalIdentifier;
  readonly attemptId: InstitutionalIdentifier;
  readonly appellantSubjectId: InstitutionalIdentifier;
  readonly filedAt: ISODateTimeString;
  readonly state: AssessmentAppealState;
  readonly grounds: readonly string[];
  readonly statement: string;
  readonly attachments: readonly AssessmentAttachment[];
  readonly screeningDecision?: string;
  readonly assignedReviewerIds: readonly InstitutionalIdentifier[];
}

export interface AssessmentScoreAdjustment {
  readonly adjustmentId: InstitutionalIdentifier;
  readonly criterion: string;
  readonly delta: number;
  readonly reason: string;
  readonly actorSubjectId: InstitutionalIdentifier;
  readonly authorityBasis: string;
  readonly occurredAt: ISODateTimeString;
}

export interface AssessmentScore {
  readonly rawPoints: number;
  readonly maximumPoints: number;
  readonly percentage: number;
  readonly domainScores: Readonly<Record<string, number>>;
  readonly competencyScores: Readonly<Record<string, number>>;
  readonly rubricScores: Readonly<Record<string, number>>;
  readonly boundaryFailures: readonly string[];
  readonly integrityPenalty?: number;
  readonly manualAdjustments: readonly AssessmentScoreAdjustment[];
  readonly calculatedAt: ISODateTimeString;
  readonly calculatedBy: "automated" | InstitutionalIdentifier;
}

export interface AssessmentResult {
  readonly state:
    | "passed"
    | "conditionally_passed"
    | "failed"
    | "under_review"
    | "invalidated";
  readonly summary: string;
  readonly limitations: readonly string[];
  readonly unmetConditions: readonly string[];
  readonly requiredRemediation: readonly string[];
  readonly eligibilityEvidenceCreated: boolean;
  readonly eligibilityEvidenceTypes: readonly string[];
  readonly credentialCreated: false;
  readonly authorityCreated: false;
  readonly registryEffectCreated: false;
  readonly artifactEffectCreated: false;
  readonly determinedAt: ISODateTimeString;
  readonly determinedBy: "automated" | InstitutionalIdentifier;
}

export interface AssessmentAttempt {
  readonly attemptId: InstitutionalIdentifier;
  readonly assessmentId: InstitutionalIdentifier;
  readonly assessmentVersion: string;
  readonly learnerSubjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly lessonId?: LessonIdentifier;
  readonly state: AssessmentState;
  readonly integrityState: AssessmentIntegrityState;
  readonly reviewState: AssessmentReviewState;
  readonly appealState: AssessmentAppealState;
  readonly startedAt: ISODateTimeString;
  readonly submittedAt?: ISODateTimeString;
  readonly completedAt?: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly attemptNumber: number;
  readonly itemOrder: readonly string[];
  readonly responses: Readonly<Record<string, AssessmentResponse>>;
  readonly score?: AssessmentScore;
  readonly result?: AssessmentResult;
  readonly accommodations: readonly ApprovedAssessmentAccommodation[];
  readonly integritySignals: readonly AssessmentIntegritySignal[];
  readonly reviewAssignments: readonly AssessmentReviewAssignment[];
  readonly appeal?: AssessmentAppeal;
  readonly credentialEligibilityEvidenceIds: readonly InstitutionalIdentifier[];
  readonly authorityCreated: false;
  readonly credentialCreated: false;
  readonly registryEffectCreated: false;
  readonly artifactEffectCreated: false;
  readonly correlationId: CorrelationIdentifier;
  readonly createdAt: ISODateTimeString;
  readonly updatedAt: ISODateTimeString;
}

export interface CredentialEligibilityEvidence {
  readonly evidenceId: InstitutionalIdentifier;
  readonly assessmentId: InstitutionalIdentifier;
  readonly assessmentVersion: string;
  readonly attemptId: InstitutionalIdentifier;
  readonly subjectId: InstitutionalIdentifier;
  readonly eligibilityType: string;
  readonly credentialType?: string;
  readonly competencyIds: readonly string[];
  readonly result: "passed" | "conditionally_passed";
  readonly restrictions: readonly string[];
  readonly state: EligibilityEvidenceState;
  readonly issuedAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly createsCredential: false;
  readonly createsAuthority: false;
  readonly requiresSeparateCredentialProcess: true;
  readonly requiresSeparateAuthorityProcess: true;
  readonly integrityHash: ContentHash;
}

export interface AssessmentScoringContext {
  readonly assessment: AssessmentDefinition;
  readonly items: Readonly<Record<string, AssessmentItem>>;
  readonly rubrics: Readonly<Record<string, AssessmentRubric>>;
  readonly attempt: AssessmentAttempt;
  readonly now: ISODateTimeString;
}

export interface AssessmentScoringResult {
  readonly score: AssessmentScore;
  readonly proposedResult: AssessmentResult;
  readonly requiresManualReview: boolean;
  readonly reviewReasons: readonly string[];
  readonly eligibilityOutputs: readonly CredentialEligibilityOutput[];
}

export interface AssessmentScorer {
  score(context: AssessmentScoringContext): Promise<AssessmentScoringResult>;
}

export class CanonicalAssessmentScorer implements AssessmentScorer {
  async score(context: AssessmentScoringContext): Promise<AssessmentScoringResult> {
    const { assessment, items, attempt, now } = context;
    let rawPoints = 0;
    let maximumPoints = 0;
    const domainPoints: Record<string, number> = {};
    const domainMaximums: Record<string, number> = {};
    const competencyPoints: Record<string, number> = {};
    const competencyMaximums: Record<string, number> = {};
    const boundaryFailures: string[] = [];
    const reviewReasons: string[] = [];

    for (const ref of assessment.itemRefs) {
      maximumPoints += ref.points;
      domainMaximums[ref.domainId] = (domainMaximums[ref.domainId] ?? 0) + ref.points;
      const item = items[ref.itemId];
      if (!item) {
        reviewReasons.push(`Missing item ${ref.itemId}.`);
        continue;
      }
      for (const competencyId of item.competencyIds) {
        competencyMaximums[competencyId] =
          (competencyMaximums[competencyId] ?? 0) + ref.points;
      }
      const response = attempt.responses[ref.itemId];
      const scored = response ? scoreItem(item, response) : {
        points: 0,
        requiresReview: false,
        boundaryFailureId: item.boundaryCritical ? item.boundaryFailureId : undefined,
      };
      rawPoints += scored.points;
      domainPoints[ref.domainId] = (domainPoints[ref.domainId] ?? 0) + scored.points;
      for (const competencyId of item.competencyIds) {
        competencyPoints[competencyId] =
          (competencyPoints[competencyId] ?? 0) + scored.points;
      }
      if (scored.boundaryFailureId) boundaryFailures.push(scored.boundaryFailureId);
      if (scored.requiresReview) reviewReasons.push(`Item ${item.itemId} requires review.`);
    }

    const percentage = maximumPoints > 0 ? round((rawPoints / maximumPoints) * 100, 2) : 0;
    const domainScores: Record<string, number> = {};
    for (const domain of assessment.domains) {
      const earned = domainPoints[domain.domainId] ?? 0;
      const possible = domainMaximums[domain.domainId] ?? 0;
      domainScores[domain.domainId] = possible > 0 ? round((earned / possible) * 100, 2) : 0;
    }
    const competencyScores: Record<string, number> = {};
    for (const mapping of assessment.competencyMappings) {
      const earned = competencyPoints[mapping.competencyId] ?? 0;
      const possible = competencyMaximums[mapping.competencyId] ?? 0;
      competencyScores[mapping.competencyId] =
        possible > 0 ? round((earned / possible) * 100, 2) : 0;
    }

    const score: AssessmentScore = {
      rawPoints,
      maximumPoints,
      percentage,
      domainScores,
      competencyScores,
      rubricScores: {},
      boundaryFailures: Array.from(new Set(boundaryFailures)),
      manualAdjustments: [],
      calculatedAt: now,
      calculatedBy: "automated",
    };

    const result = determineResult(assessment, attempt, score, reviewReasons, now);
    const eligibilityOutputs =
      result.state === "passed" || result.state === "conditionally_passed"
        ? assessment.credentialEligibilityOutputs.filter((output) =>
            output.minimumAssessmentResult === "passed"
              ? result.state === "passed"
              : true,
          )
        : [];

    return deepFreeze({
      score,
      proposedResult: {
        ...result,
        eligibilityEvidenceTypes: eligibilityOutputs.map((output) => output.eligibilityType),
      },
      requiresManualReview: result.state === "under_review",
      reviewReasons,
      eligibilityOutputs,
    });
  }
}

interface ItemScore {
  readonly points: number;
  readonly requiresReview: boolean;
  readonly boundaryFailureId?: string;
}

function scoreItem(item: AssessmentItem, response: AssessmentResponse): ItemScore {
  switch (item.type) {
    case "single_choice":
    case "multiple_choice":
    case "true_false": {
      if (response.responseType !== "choice") return failItem(item);
      const selected = new Set(response.selectedOptionIds);
      const correct = new Set(item.options.filter((o) => o.correct).map((o) => o.optionId));
      const exact = selected.size === correct.size && [...selected].every((id) => correct.has(id));
      return exact
        ? { points: item.points, requiresReview: false }
        : failItem(item);
    }
    case "ordering": {
      if (response.responseType !== "ordering") return failItem(item);
      const expected = [...item.values].sort((a, b) => a.correctOrder - b.correctOrder).map((v) => v.valueId);
      const exact = expected.length === response.orderedValueIds.length &&
        expected.every((id, index) => response.orderedValueIds[index] === id);
      return exact ? { points: item.points, requiresReview: false } : failItem(item);
    }
    case "matching": {
      if (response.responseType !== "matching") return failItem(item);
      const exact = Object.entries(item.correctPairs).every(
        ([left, right]) => response.pairs[left] === right,
      );
      return exact ? { points: item.points, requiresReview: false } : failItem(item);
    }
    case "scenario_decision":
    case "evidence_selection":
    case "boundary_identification":
    case "record_interpretation":
    case "classification": {
      if (response.responseType !== "scenario_decision") return failItem(item);
      const decision = item.decisions.find((d) => d.decisionId === response.selectedDecisionId);
      const excludedSelected = item.availableEvidence.some(
        (e) => !e.admissible && response.selectedEvidenceIds.includes(e.evidenceId),
      );
      const rationaleOk = !item.requiredRationale ||
        response.rationale.trim().length >= (item.minimumRationaleCharacters ?? 1);
      const exact = decision?.correct === true && !excludedSelected && rationaleOk;
      return exact ? { points: item.points, requiresReview: false } : failItem(item);
    }
    case "short_answer":
    case "long_form":
    case "practical_exercise":
    case "route_construction":
    case "simulation_observation":
    case "oral_review":
    case "portfolio_review":
      return {
        points: 0,
        requiresReview: true,
        boundaryFailureId: item.boundaryCritical ? item.boundaryFailureId : undefined,
      };
  }
}

function failItem(item: AssessmentItem): ItemScore {
  return {
    points: 0,
    requiresReview: false,
    boundaryFailureId: item.boundaryCritical ? item.boundaryFailureId : undefined,
  };
}

function determineResult(
  assessment: AssessmentDefinition,
  attempt: AssessmentAttempt,
  score: AssessmentScore,
  reviewReasons: string[],
  now: ISODateTimeString,
): AssessmentResult {
  if (attempt.integrityState === "invalidated" || attempt.state === "invalidated") {
    return result("invalidated", "Assessment attempt invalidated.", now, [
      "Complete a new authorized attempt or resolve the integrity review.",
    ]);
  }

  if (attempt.integrityState === "flagged" || attempt.integrityState === "under_review") {
    reviewReasons.push("Assessment integrity requires review.");
  }

  const boundaryFailure =
    assessment.passPolicy.boundaryFailuresAlwaysFail &&
    score.boundaryFailures.length > 0;

  const domainFailures = Object.entries(assessment.passPolicy.minimumDomainScores)
    .filter(([domainId, minimum]) => (score.domainScores[domainId] ?? 0) < minimum)
    .map(([domainId]) => domainId);

  const minimum = assessment.passPolicy.minimumOverallScore ?? 0;
  const reviewRequired =
    assessment.reviewPolicy.reviewRequired === "always" ||
    reviewReasons.length > 0 ||
    (assessment.passPolicy.manualReviewThreshold !== undefined &&
      Math.abs(score.percentage - minimum) <= assessment.passPolicy.manualReviewThreshold);

  if (reviewRequired) {
    return result("under_review", "Authorized review is required.", now, reviewReasons);
  }

  if (boundaryFailure) {
    return {
      ...result("failed", "A boundary-critical requirement was not satisfied.", now, [
        "Review the applicable boundary lesson and complete a new eligible attempt.",
      ]),
      unmetConditions: score.boundaryFailures,
    };
  }

  if (score.percentage >= minimum && domainFailures.length === 0) {
    return result("passed", "The assessment meets the configured passing standard.", now, []);
  }

  if (
    assessment.passPolicy.allowConditionalPass &&
    score.percentage >= minimum &&
    domainFailures.length > 0
  ) {
    return {
      ...result("conditionally_passed", "Overall score is sufficient, but domain conditions remain.", now,
        assessment.passPolicy.conditionalPassConditions),
      unmetConditions: domainFailures,
    };
  }

  return {
    ...result("failed", "The assessment does not meet the configured passing standard.", now, [
      "Review the applicable lesson and complete a new eligible attempt.",
    ]),
    unmetConditions: [
      ...(score.percentage < minimum ? [`overall_score_below_${minimum}`] : []),
      ...domainFailures,
    ],
  };
}

function result(
  state: AssessmentResult["state"],
  summary: string,
  now: ISODateTimeString,
  remediation: readonly string[],
): AssessmentResult {
  return {
    state,
    summary,
    limitations: [TA14_ACADEMY_ASSESSMENT_BOUNDARY],
    unmetConditions: [],
    requiredRemediation: remediation,
    eligibilityEvidenceCreated: false,
    eligibilityEvidenceTypes: [],
    credentialCreated: false,
    authorityCreated: false,
    registryEffectCreated: false,
    artifactEffectCreated: false,
    determinedAt: now,
    determinedBy: "automated",
  };
}

export function createAssessmentAttempt(input: {
  readonly attemptId: InstitutionalIdentifier;
  readonly assessment: AssessmentDefinition;
  readonly learnerSubjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly lessonId?: LessonIdentifier;
  readonly attemptNumber: number;
  readonly itemOrder: readonly string[];
  readonly accommodations: readonly ApprovedAssessmentAccommodation[];
  readonly correlationId: CorrelationIdentifier;
  readonly now: ISODateTimeString;
}): AssessmentAttempt {
  const expiresAt =
    input.assessment.timePolicy.timed && input.assessment.timePolicy.durationMinutes
      ? new Date(
          Date.parse(input.now) + input.assessment.timePolicy.durationMinutes * 60_000,
        ).toISOString()
      : undefined;

  const attempt: AssessmentAttempt = {
    attemptId: input.attemptId,
    assessmentId: input.assessment.assessmentId,
    assessmentVersion: input.assessment.version,
    learnerSubjectId: input.learnerSubjectId,
    organizationId: input.organizationId,
    lessonId: input.lessonId,
    state: "in_progress",
    integrityState: "unverified",
    reviewState: "not_required",
    appealState: "not_filed",
    startedAt: input.now,
    expiresAt,
    attemptNumber: input.attemptNumber,
    itemOrder: [...input.itemOrder],
    responses: {},
    accommodations: [...input.accommodations],
    integritySignals: [],
    reviewAssignments: [],
    credentialEligibilityEvidenceIds: [],
    authorityCreated: false,
    credentialCreated: false,
    registryEffectCreated: false,
    artifactEffectCreated: false,
    correlationId: input.correlationId,
    createdAt: input.now,
    updatedAt: input.now,
  };

  const validation = validateAssessmentAttempt(attempt);
  if (!validation.ok) {
    throw new AssessmentContractValidationError(
      "Assessment attempt failed validation.",
      validation.issues as readonly AssessmentValidationIssue[],
    );
  }
  return deepFreeze(attempt);
}

export function recordAssessmentResponse(
  attempt: AssessmentAttempt,
  response: AssessmentResponse,
  now: ISODateTimeString,
): AssessmentAttempt {
  assertAttemptMutable(attempt);
  return deepFreeze({
    ...attempt,
    responses: { ...attempt.responses, [response.itemId]: response },
    updatedAt: now,
  });
}

export function addAssessmentIntegritySignal(
  attempt: AssessmentAttempt,
  signal: AssessmentIntegritySignal,
  now: ISODateTimeString,
): AssessmentAttempt {
  assertAttemptMutable(attempt);
  return deepFreeze({
    ...attempt,
    integrityState: signal.severity === "critical" ? "flagged" : attempt.integrityState,
    reviewState: signal.reviewRequired ? "pending" : attempt.reviewState,
    integritySignals: [...attempt.integritySignals, signal],
    updatedAt: now,
  });
}

export function submitAssessmentAttempt(
  attempt: AssessmentAttempt,
  now: ISODateTimeString,
): AssessmentAttempt {
  assertAttemptMutable(attempt);
  return deepFreeze({
    ...attempt,
    state: "under_review",
    submittedAt: now,
    reviewState: attempt.reviewState === "not_required" ? "pending" : attempt.reviewState,
    updatedAt: now,
  });
}

export function finalizeAssessmentAttempt(
  attempt: AssessmentAttempt,
  scoring: AssessmentScoringResult,
  now: ISODateTimeString,
): AssessmentAttempt {
  return deepFreeze({
    ...attempt,
    state: scoring.proposedResult.state,
    score: scoring.score,
    result: scoring.proposedResult,
    completedAt: scoring.proposedResult.state === "under_review" ? undefined : now,
    reviewState: scoring.requiresManualReview ? "pending" : "completed",
    integrityState: attempt.integrityState === "unverified" ? "verified" : attempt.integrityState,
    updatedAt: now,
    authorityCreated: false,
    credentialCreated: false,
    registryEffectCreated: false,
    artifactEffectCreated: false,
  });
}

function assertAttemptMutable(attempt: AssessmentAttempt): void {
  if (
    attempt.state === "passed" ||
    attempt.state === "conditionally_passed" ||
    attempt.state === "failed" ||
    attempt.state === "invalidated"
  ) {
    throw new Error(`Assessment attempt ${attempt.attemptId} is immutable.`);
  }
}

export interface EligibilityEvidenceDependencies {
  readonly createEvidenceId: () => InstitutionalIdentifier;
  readonly now: () => ISODateTimeString;
  readonly hashCanonicalValue: (value: JsonValue) => Promise<ContentHash> | ContentHash;
}

export async function createCredentialEligibilityEvidence(
  assessment: AssessmentDefinition,
  attempt: AssessmentAttempt,
  output: CredentialEligibilityOutput,
  dependencies: EligibilityEvidenceDependencies,
): Promise<CredentialEligibilityEvidence> {
  if (!attempt.result || !["passed", "conditionally_passed"].includes(attempt.result.state)) {
    throw new Error("Eligibility evidence requires a passed result.");
  }
  if (output.minimumAssessmentResult === "passed" && attempt.result.state !== "passed") {
    throw new Error("This eligibility output requires a full pass.");
  }
  const issuedAt = dependencies.now();
  const expiresAt = output.expiresAfterDays
    ? new Date(Date.parse(issuedAt) + output.expiresAfterDays * 86_400_000).toISOString()
    : undefined;

  const base = {
    evidenceId: dependencies.createEvidenceId(),
    assessmentId: assessment.assessmentId,
    assessmentVersion: assessment.version,
    attemptId: attempt.attemptId,
    subjectId: attempt.learnerSubjectId,
    eligibilityType: output.eligibilityType,
    credentialType: output.credentialType,
    competencyIds: [...output.competencyIds],
    result: attempt.result.state as "passed" | "conditionally_passed",
    restrictions: [...output.restrictions],
    state: "active" as const,
    issuedAt,
    expiresAt,
    createsCredential: false as const,
    createsAuthority: false as const,
    requiresSeparateCredentialProcess: true as const,
    requiresSeparateAuthorityProcess: true as const,
  };
  const integrityHash = await dependencies.hashCanonicalValue(base as unknown as JsonValue);
  return deepFreeze({ ...base, integrityHash });
}

export type AssessmentValidationCode =
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
  | "unsafe_credential_effect"
  | "unsafe_registry_effect"
  | "unsafe_artifact_effect"
  | "missing_boundary"
  | "missing_pass_policy"
  | "missing_domain"
  | "missing_item"
  | "invalid_weight"
  | "invalid_score"
  | "invalid_attempt_state"
  | "invalid_integrity_state";

export interface AssessmentValidationIssue extends ValidationIssue {
  readonly code: AssessmentValidationCode;
}

export class AssessmentContractValidationError extends Error {
  readonly issues: readonly AssessmentValidationIssue[];
  constructor(message: string, issues: readonly AssessmentValidationIssue[]) {
    super(message);
    this.name = "AssessmentContractValidationError";
    this.issues = issues;
  }
}

export function validateAssessmentDefinition(
  input: unknown,
): ValidationResult<AssessmentDefinition> {
  const issues: AssessmentValidationIssue[] = [];
  if (!isObject(input)) {
    return {
      ok: false,
      issues: [{
        path: "$",
        code: "invalid_type",
        message: "Assessment definition must be an object.",
        severity: "error",
        received: input,
      }],
    };
  }

  requiredString(input.assessmentId, "$.assessmentId", issues);
  requiredString(input.stableSlug, "$.stableSlug", issues);
  requiredString(input.title, "$.title", issues);
  requiredString(input.summary, "$.summary", issues);
  requiredString(input.locale, "$.locale", issues);
  if (!isVersion(input.version)) issue(issues, "$.version", "invalid_version", "Invalid version.", input.version);
  if (!isOneOf(input.publicationState, ASSESSMENT_PUBLICATION_STATES)) {
    issue(issues, "$.publicationState", "unsupported_value", "Unsupported publication state.", input.publicationState);
  }
  stringArray(input.lessonIds, "$.lessonIds", issues, TrueFalse.TRUE);
  stringArray(input.operationalFunctions, "$.operationalFunctions", issues, TrueFalse.TRUE);
  enumArray(input.recordTypes, "$.recordTypes", isInstitutionalRecordType, issues);
  enumArray(input.roles, "$.roles", isInstitutionalRole, issues);
  if (!isOneOf(input.deliveryMode, ASSESSMENT_DELIVERY_MODES)) {
    issue(issues, "$.deliveryMode", "unsupported_value", "Unsupported delivery mode.", input.deliveryMode);
  }
  if (!isOneOf(input.evaluatorType, EVALUATOR_TYPES)) {
    issue(issues, "$.evaluatorType", "unsupported_value", "Unsupported evaluator type.", input.evaluatorType);
  }
  if (!isOneOf(input.scoringModel, SCORING_MODELS)) {
    issue(issues, "$.scoringModel", "unsupported_value", "Unsupported scoring model.", input.scoringModel);
  }

  if (!Array.isArray(input.domains) || input.domains.length === 0) {
    issue(issues, "$.domains", "missing_domain", "At least one domain is required.", input.domains);
  } else {
    const totalWeight = input.domains.reduce((sum, domain) => {
      if (!isObject(domain) || typeof domain.weight !== "number") return sum;
      return sum + domain.weight;
    }, 0);
    if (Math.abs(totalWeight - 100) > 0.001) {
      issue(issues, "$.domains", "invalid_weight", "Domain weights must total 100.", totalWeight);
    }
  }

  if (!Array.isArray(input.itemRefs) || input.itemRefs.length === 0) {
    issue(issues, "$.itemRefs", "missing_item", "At least one item reference is required.", input.itemRefs);
  }

  requiredString(input.authorityBoundary, "$.authorityBoundary", issues);
  if (input.nonSubstitutionRule !== TA14_ACADEMY_NON_SUBSTITUTION_RULE) {
    issue(issues, "$.nonSubstitutionRule", "missing_boundary", "Canonical non-substitution rule is required.", input.nonSubstitutionRule);
  }
  if (!isContentHash(input.contentHash)) {
    issue(issues, "$.contentHash", "invalid_hash", "Invalid content hash.", input.contentHash);
  }
  if (!isDateTime(input.effectiveAt)) {
    issue(issues, "$.effectiveAt", "invalid_effective_time", "Invalid effectiveAt.", input.effectiveAt);
  }

  const ok = !issues.some((i) => i.severity === "error");
  return {
    ok,
    value: ok ? (input as unknown as AssessmentDefinition) : undefined,
    issues,
  };
}

export function validateAssessmentAttempt(
  input: unknown,
): ValidationResult<AssessmentAttempt> {
  const issues: AssessmentValidationIssue[] = [];
  if (!isObject(input)) {
    return {
      ok: false,
      issues: [{
        path: "$",
        code: "invalid_type",
        message: "Assessment attempt must be an object.",
        severity: "error",
        received: input,
      }],
    };
  }

  requiredString(input.attemptId, "$.attemptId", issues);
  requiredString(input.assessmentId, "$.assessmentId", issues);
  requiredString(input.assessmentVersion, "$.assessmentVersion", issues);
  requiredString(input.learnerSubjectId, "$.learnerSubjectId", issues);
  requiredString(input.correlationId, "$.correlationId", issues);

  if (input.authorityCreated !== false) {
    issue(issues, "$.authorityCreated", "unsafe_authority_effect", "Assessment may not create authority.", input.authorityCreated);
  }
  if (input.credentialCreated !== false) {
    issue(issues, "$.credentialCreated", "unsafe_credential_effect", "Assessment may not create credentials.", input.credentialCreated);
  }
  if (input.registryEffectCreated !== false) {
    issue(issues, "$.registryEffectCreated", "unsafe_registry_effect", "Assessment may not create Registry effect.", input.registryEffectCreated);
  }
  if (input.artifactEffectCreated !== false) {
    issue(issues, "$.artifactEffectCreated", "unsafe_artifact_effect", "Assessment may not create artifact effect.", input.artifactEffectCreated);
  }

  const ok = !issues.some((i) => i.severity === "error");
  return {
    ok,
    value: ok ? (input as unknown as AssessmentAttempt) : undefined,
    issues,
  };
}

enum TrueFalse {
  FALSE = 0,
  TRUE = 1,
}

function issue(
  issues: AssessmentValidationIssue[],
  path: string,
  code: AssessmentValidationCode,
  message: string,
  received?: unknown,
): void {
  issues.push({ path, code, message, severity: "error", received });
}

function requiredString(
  value: unknown,
  path: string,
  issues: AssessmentValidationIssue[],
): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    issue(issues, path, "required", `${path} must be a non-empty string.`, value);
  }
}

function stringArray(
  value: unknown,
  path: string,
  issues: AssessmentValidationIssue[],
  requireNonEmpty: TrueFalse = TrueFalse.FALSE,
): void {
  if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) {
    issue(issues, path, "invalid_type", `${path} must be string[].`, value);
    return;
  }
  if (requireNonEmpty === TrueFalse.TRUE && value.length === 0) {
    issue(issues, path, "required", `${path} must not be empty.`, value);
  }
}

function enumArray<T>(
  value: unknown,
  path: string,
  guard: (value: unknown) => value is T,
  issues: AssessmentValidationIssue[],
): void {
  if (!Array.isArray(value) || value.length === 0 || !value.every(guard)) {
    issue(issues, path, "invalid_type", `${path} contains unsupported values.`, value);
  }
}

export interface AssessmentDefinitionRepository {
  getAssessment(id: InstitutionalIdentifier, version?: string): Promise<AssessmentDefinition | null>;
  getActiveAssessment(id: InstitutionalIdentifier, at?: ISODateTimeString): Promise<AssessmentDefinition | null>;
  saveAssessment(assessment: AssessmentDefinition): Promise<void>;
}

export interface AssessmentItemRepository {
  getItem(id: string, version?: string): Promise<AssessmentItem | null>;
  saveItem(item: AssessmentItem): Promise<void>;
  getMany(refs: readonly AssessmentItemReference[]): Promise<Readonly<Record<string, AssessmentItem>>>;
}

export interface AssessmentAttemptRepository {
  getAttempt(id: InstitutionalIdentifier): Promise<AssessmentAttempt | null>;
  saveAttempt(attempt: AssessmentAttempt): Promise<void>;
  listAttempts(subjectId: InstitutionalIdentifier, assessmentId: InstitutionalIdentifier): Promise<readonly AssessmentAttempt[]>;
}

export interface CredentialEligibilityEvidenceRepository {
  saveEvidence(evidence: CredentialEligibilityEvidence): Promise<void>;
  listEvidence(subjectId: InstitutionalIdentifier): Promise<readonly CredentialEligibilityEvidence[]>;
}

export class InMemoryAssessmentDefinitionRepository implements AssessmentDefinitionRepository {
  private readonly values = new Map<string, AssessmentDefinition>();
  async getAssessment(id: InstitutionalIdentifier, version?: string): Promise<AssessmentDefinition | null> {
    if (version) return this.values.get(`${id}@${version}`) ?? null;
    return Array.from(this.values.values()).find((v) => v.assessmentId === id) ?? null;
  }
  async getActiveAssessment(id: InstitutionalIdentifier, at = new Date().toISOString()): Promise<AssessmentDefinition | null> {
    const time = Date.parse(at);
    return Array.from(this.values.values())
      .filter((v) => v.assessmentId === id && v.publicationState === "active")
      .filter((v) => Date.parse(v.effectiveAt) <= time && (!v.expiresAt || Date.parse(v.expiresAt) > time))
      .sort((a, b) => Date.parse(b.effectiveAt) - Date.parse(a.effectiveAt))[0] ?? null;
  }
  async saveAssessment(value: AssessmentDefinition): Promise<void> {
    const validation = validateAssessmentDefinition(value);
    if (!validation.ok) {
      throw new AssessmentContractValidationError("Invalid assessment.", validation.issues as readonly AssessmentValidationIssue[]);
    }
    const key = `${value.assessmentId}@${value.version}`;
    if (this.values.has(key)) throw new Error(`Assessment ${key} already exists.`);
    this.values.set(key, deepFreeze(value));
  }
}

export class InMemoryAssessmentItemRepository implements AssessmentItemRepository {
  private readonly values = new Map<string, AssessmentItem>();
  async getItem(id: string, version?: string): Promise<AssessmentItem | null> {
    if (version) return this.values.get(`${id}@${version}`) ?? null;
    return Array.from(this.values.values()).find((v) => v.itemId === id) ?? null;
  }
  async saveItem(value: AssessmentItem): Promise<void> {
    const key = `${value.itemId}@${value.version}`;
    if (this.values.has(key)) throw new Error(`Item ${key} already exists.`);
    this.values.set(key, deepFreeze(value));
  }
  async getMany(refs: readonly AssessmentItemReference[]): Promise<Readonly<Record<string, AssessmentItem>>> {
    const result: Record<string, AssessmentItem> = {};
    for (const ref of refs) {
      const item = await this.getItem(ref.itemId, ref.itemVersion);
      if (item) result[ref.itemId] = item;
    }
    return deepFreeze(result);
  }
}

export class InMemoryAssessmentAttemptRepository implements AssessmentAttemptRepository {
  private readonly values = new Map<InstitutionalIdentifier, AssessmentAttempt>();
  async getAttempt(id: InstitutionalIdentifier): Promise<AssessmentAttempt | null> {
    return this.values.get(id) ?? null;
  }
  async saveAttempt(value: AssessmentAttempt): Promise<void> {
    const validation = validateAssessmentAttempt(value);
    if (!validation.ok) {
      throw new AssessmentContractValidationError("Invalid attempt.", validation.issues as readonly AssessmentValidationIssue[]);
    }
    this.values.set(value.attemptId, deepFreeze(value));
  }
  async listAttempts(subjectId: InstitutionalIdentifier, assessmentId: InstitutionalIdentifier): Promise<readonly AssessmentAttempt[]> {
    return deepFreeze(Array.from(this.values.values()).filter(
      (v) => v.learnerSubjectId === subjectId && v.assessmentId === assessmentId,
    ));
  }
}

export class InMemoryCredentialEligibilityEvidenceRepository
implements CredentialEligibilityEvidenceRepository {
  private readonly values = new Map<InstitutionalIdentifier, CredentialEligibilityEvidence>();
  async saveEvidence(value: CredentialEligibilityEvidence): Promise<void> {
    if (value.createsCredential !== false || value.createsAuthority !== false) {
      throw new Error("Eligibility evidence may not create credential or authority.");
    }
    if (this.values.has(value.evidenceId)) throw new Error(`Evidence ${value.evidenceId} already exists.`);
    this.values.set(value.evidenceId, deepFreeze(value));
  }
  async listEvidence(subjectId: InstitutionalIdentifier): Promise<readonly CredentialEligibilityEvidence[]> {
    return deepFreeze(Array.from(this.values.values()).filter((v) => v.subjectId === subjectId));
  }
}

export interface AssessmentIdentifierFactory {
  createAttemptId(): InstitutionalIdentifier;
  createEligibilityEvidenceId(): InstitutionalIdentifier;
}

export interface AssessmentServiceDependencies {
  readonly assessments: AssessmentDefinitionRepository;
  readonly items: AssessmentItemRepository;
  readonly attempts: AssessmentAttemptRepository;
  readonly evidence: CredentialEligibilityEvidenceRepository;
  readonly scorer: AssessmentScorer;
  readonly ids: AssessmentIdentifierFactory;
  readonly now: () => ISODateTimeString;
  readonly hashCanonicalValue: (value: JsonValue) => Promise<ContentHash> | ContentHash;
  readonly events?: AcademyEventService;
}

export class AcademyAssessmentService {
  constructor(private readonly d: AssessmentServiceDependencies) {}

  async start(input: {
    readonly assessmentId: InstitutionalIdentifier;
    readonly subjectId: InstitutionalIdentifier;
    readonly organizationId?: InstitutionalIdentifier;
    readonly lessonId?: LessonIdentifier;
    readonly correlationId: CorrelationIdentifier;
  }): Promise<AssessmentAttempt> {
    const assessment = await this.d.assessments.getActiveAssessment(input.assessmentId, this.d.now());
    if (!assessment) throw new Error(`Active assessment ${input.assessmentId} not found.`);
    const prior = await this.d.attempts.listAttempts(input.subjectId, input.assessmentId);
    const maximum = assessment.attemptPolicy.maximumAttempts;
    if (maximum !== undefined && prior.length >= maximum) throw new Error("Maximum attempts reached.");
    const attempt = createAssessmentAttempt({
      attemptId: this.d.ids.createAttemptId(),
      assessment,
      learnerSubjectId: input.subjectId,
      organizationId: input.organizationId,
      lessonId: input.lessonId,
      attemptNumber: prior.length + 1,
      itemOrder: assessment.itemRefs.map((r) => r.itemId),
      accommodations: [],
      correlationId: input.correlationId,
      now: this.d.now(),
    });
    await this.d.attempts.saveAttempt(attempt);
    return attempt;
  }

  async saveResponse(id: InstitutionalIdentifier, response: AssessmentResponse): Promise<AssessmentAttempt> {
    const attempt = await this.requireAttempt(id);
    const next = recordAssessmentResponse(attempt, response, this.d.now());
    await this.d.attempts.saveAttempt(next);
    return next;
  }

  async score(id: InstitutionalIdentifier, event?: {
    readonly actor: AcademyEventActor;
    readonly authority: AcademyEventAuthority;
    readonly record: AcademyEventRecordRef;
    readonly idempotencyKey: string;
  }): Promise<AssessmentAttempt> {
    const attempt = await this.requireAttempt(id);
    const assessment = await this.d.assessments.getAssessment(
      attempt.assessmentId,
      attempt.assessmentVersion,
    );
    if (!assessment) throw new Error("Assessment definition not found.");
    const items = await this.d.items.getMany(assessment.itemRefs);
    const scoring = await this.d.scorer.score({
      assessment,
      items,
      rubrics: {},
      attempt,
      now: this.d.now(),
    });
    let finalized = finalizeAssessmentAttempt(attempt, scoring, this.d.now());
    const evidenceIds: InstitutionalIdentifier[] = [];
    if (finalized.result && ["passed", "conditionally_passed"].includes(finalized.result.state)) {
      for (const output of scoring.eligibilityOutputs) {
        const evidence = await createCredentialEligibilityEvidence(
          assessment,
          finalized,
          output,
          {
            createEvidenceId: this.d.ids.createEligibilityEvidenceId,
            now: this.d.now,
            hashCanonicalValue: this.d.hashCanonicalValue,
          },
        );
        await this.d.evidence.saveEvidence(evidence);
        evidenceIds.push(evidence.evidenceId);
      }
      finalized = deepFreeze({
        ...finalized,
        credentialEligibilityEvidenceIds: evidenceIds,
        result: finalized.result
          ? { ...finalized.result, eligibilityEvidenceCreated: evidenceIds.length > 0 }
          : finalized.result,
      });
    }
    await this.d.attempts.saveAttempt(finalized);

    if (this.d.events && event && finalized.result) {
      const state = finalized.result.state;
      const eventType =
        state === "passed"
          ? "academy.assessment.passed"
          : state === "conditionally_passed"
            ? "academy.assessment.conditionally_passed"
            : state === "invalidated"
              ? "academy.assessment.invalidated"
              : "academy.assessment.failed";

      const payload: AssessmentResultPayload = {
        assessmentId: assessment.assessmentId,
        assessmentVersion: assessment.version,
        attemptId: finalized.attemptId,
        lessonId: finalized.lessonId ?? assessment.lessonIds[0] ?? "TA14-ACD-LESSON-UNSPECIFIED",
        lessonVersion: assessment.version,
        result: state,
        score: finalized.score?.percentage,
        boundaryFailures: finalized.score?.boundaryFailures ?? [],
        credentialEligibilityCreated: evidenceIds.length > 0,
        authorityCreated: false,
        evaluatorType:
          assessment.evaluatorType === "panel"
            ? "authorized_human"
            : assessment.evaluatorType,
      };

      await this.d.events.emit(
        createAssessmentResultEventDraft({
          eventType,
          actor: event.actor,
          authority: event.authority,
          record: event.record,
          correlationId: finalized.correlationId,
          idempotencyKey: event.idempotencyKey,
          payload,
        }),
      );
    }

    return finalized;
  }

  private async requireAttempt(id: InstitutionalIdentifier): Promise<AssessmentAttempt> {
    const attempt = await this.d.attempts.getAttempt(id);
    if (!attempt) throw new Error(`Attempt ${id} not found.`);
    return attempt;
  }
}

export interface PublicAssessmentProjection {
  readonly assessmentId: InstitutionalIdentifier;
  readonly stableSlug: string;
  readonly title: string;
  readonly summary: string;
  readonly version: string;
  readonly learningObjectives: readonly string[];
  readonly deliveryMode: AssessmentDeliveryMode;
  readonly authorityBoundary: string;
  readonly nonSubstitutionRule: string;
}

export function projectPublicAssessment(
  assessment: AssessmentDefinition,
): PublicAssessmentProjection {
  if (assessment.publicationState !== "active" || !assessment.projectionPolicy.publicSafe) {
    throw new Error("Assessment is not eligible for public projection.");
  }
  return deepFreeze({
    assessmentId: assessment.assessmentId,
    stableSlug: assessment.stableSlug,
    title: assessment.title,
    summary: assessment.projectionPolicy.publicSummary ?? assessment.summary,
    version: assessment.version,
    learningObjectives: assessment.learningObjectives,
    deliveryMode: assessment.deliveryMode,
    authorityBoundary: assessment.authorityBoundary,
    nonSubstitutionRule: assessment.nonSubstitutionRule,
  });
}

export interface AssessmentAnalytics {
  readonly assessmentId: InstitutionalIdentifier;
  readonly assessmentVersion: string;
  readonly attemptCount: number;
  readonly passedCount: number;
  readonly conditionalPassCount: number;
  readonly failedCount: number;
  readonly underReviewCount: number;
  readonly invalidatedCount: number;
  readonly averageScore?: number;
  readonly authorityCreatedCount: 0;
  readonly credentialCreatedCount: 0;
}

export function buildAssessmentAnalytics(
  assessmentId: InstitutionalIdentifier,
  assessmentVersion: string,
  attempts: readonly AssessmentAttempt[],
): AssessmentAnalytics {
  const matching = attempts.filter(
    (a) => a.assessmentId === assessmentId && a.assessmentVersion === assessmentVersion,
  );
  const scores = matching
    .map((a) => a.score?.percentage)
    .filter((v): v is number => typeof v === "number");

  return deepFreeze({
    assessmentId,
    assessmentVersion,
    attemptCount: matching.length,
    passedCount: matching.filter((a) => a.state === "passed").length,
    conditionalPassCount: matching.filter((a) => a.state === "conditionally_passed").length,
    failedCount: matching.filter((a) => a.state === "failed").length,
    underReviewCount: matching.filter((a) => a.state === "under_review").length,
    invalidatedCount: matching.filter((a) => a.state === "invalidated").length,
    averageScore:
      scores.length > 0
        ? round(scores.reduce((sum, v) => sum + v, 0) / scores.length, 2)
        : undefined,
    authorityCreatedCount: 0,
    credentialCreatedCount: 0,
  });
}

export const REVIEWER_ORIENTATION_ASSESSMENT_ID =
  "TA14-ACD-ASSESSMENT-000001" as const;

export const reviewerOrientationAssessment: AssessmentDefinition = deepFreeze({
  assessmentId: REVIEWER_ORIENTATION_ASSESSMENT_ID,
  stableSlug: "ai-governance/reviewer-orientation",
  title: "Reviewer Orientation and Boundary Assessment",
  summary:
    "Tests conflict, competence, evidence, scope, finding, determination, and authority boundaries before a separate credential or authority process.",
  version: "3.0",
  locale: "en-US",
  publicationState: "active",
  lessonIds: ["TA14-ACD-LESSON-REVIEWER-ORIENTATION"],
  operationalFunctions: ["reviewer_orientation", "review_assignment_eligibility"],
  recordTypes: ["academy_assessment", "academy_assessment_attempt", "assignment", "authority_grant"],
  roles: ["reviewer_candidate", "authorized_reviewer", "academy_instructor", "academy_standards_reviewer"],
  deliveryMode: "hybrid",
  evaluatorType: "hybrid",
  scoringModel: "weighted_domains",
  instructions: [
    "Complete every required item.",
    "Boundary-critical failures cannot be offset by aggregate score.",
    "Passing creates eligibility evidence only.",
  ],
  learningObjectives: [
    "Distinguish learning, credential, eligibility, authority, assignment, and institutional effect.",
    "Identify conflicts and competence boundaries.",
    "Apply evidence and determination boundaries.",
  ],
  competencyMappings: [
    {
      competencyId: "review.boundary_comprehension",
      title: "Review boundary comprehension",
      description: "Understands evidence, finding, determination, and authority boundaries.",
      level: "applied",
      domainId: "review-boundaries",
      itemIds: ["TA14-ACD-ITEM-000001", "TA14-ACD-ITEM-000002"],
      minimumEvidenceCount: 2,
      requiresHumanReview: false,
    },
  ],
  domains: [
    {
      domainId: "review-boundaries",
      title: "Review Boundaries",
      description: "Evidence, finding, determination, authority, and non-substitution.",
      weight: 60,
      minimumDomainScore: 80,
      boundaryCritical: true,
      competencyIds: ["review.boundary_comprehension"],
    },
    {
      domainId: "conflict-scope",
      title: "Conflict and Scope",
      description: "Conflict, competence, assignment scope, and escalation.",
      weight: 40,
      minimumDomainScore: 75,
      boundaryCritical: true,
      competencyIds: ["review.conflict_and_scope"],
    },
  ],
  itemRefs: [
    { itemId: "TA14-ACD-ITEM-000001", itemVersion: "3.0", order: 1, required: true, domainId: "review-boundaries", points: 30 },
    { itemId: "TA14-ACD-ITEM-000002", itemVersion: "3.0", order: 2, required: true, domainId: "review-boundaries", points: 30 },
    { itemId: "TA14-ACD-ITEM-000003", itemVersion: "3.0", order: 3, required: true, domainId: "conflict-scope", points: 40 },
  ],
  rubricRefs: ["TA14-ACD-RUBRIC-REVIEWER-001"],
  passPolicy: {
    minimumOverallScore: 80,
    minimumDomainScores: { "review-boundaries": 80, "conflict-scope": 75 },
    requiredItemIds: ["TA14-ACD-ITEM-000001", "TA14-ACD-ITEM-000002", "TA14-ACD-ITEM-000003"],
    boundaryFailureIds: [
      "BOUNDARY-AUTHORITY-SUBSTITUTION",
      "BOUNDARY-CONFLICT-NONDISCLOSURE",
      "BOUNDARY-OUTSIDE-SCOPE",
    ],
    boundaryFailuresAlwaysFail: true,
    allowConditionalPass: false,
    conditionalPassConditions: [],
    manualReviewThreshold: 3,
    automaticPassAllowed: true,
    automaticFailAllowed: true,
    underReviewOnAmbiguity: true,
  },
  attemptPolicy: {
    maximumAttempts: 3,
    cooldownMinutes: 60,
    attemptWindowDays: 30,
    resumeAllowed: true,
    restartAllowed: false,
    preservePriorAttempts: true,
    invalidateOnVersionChange: true,
    allowInstructorReset: true,
    resetRequiresReason: true,
  },
  timePolicy: {
    timed: true,
    durationMinutes: 45,
    warningMinutes: [10, 5, 1],
    autoSubmitOnExpiry: true,
    pauseAllowed: false,
    pauseRequiresAuthorization: true,
    serverTimeAuthoritative: true,
  },
  integrityPolicy: {
    identityVerificationRequired: true,
    browserLockdownRequired: false,
    proctoringRequired: false,
    plagiarismCheckRequired: true,
    responseHashRequired: true,
    itemOrderRandomized: true,
    optionOrderRandomized: true,
    detectConcurrentAttempts: true,
    detectCopyPaste: true,
    detectTabSwitches: true,
    detectAutomationSignals: true,
    suspiciousBehaviorThreshold: 3,
    integrityFlagsRequireReview: true,
    invalidationAuthorityRole: "academy_standards_reviewer",
  },
  accommodationPolicy: {
    accommodationsAllowed: true,
    supportedTypes: [
      "extended_time",
      "screen_reader",
      "keyboard_navigation",
      "high_contrast",
      "reduced_motion",
      "alternative_format",
      "breaks",
      "oral_response",
    ],
    requestRequired: true,
    approvalRequired: true,
    approvingRoles: ["academy_instructor", "academy_standards_reviewer"],
    preservePrivacy: true,
    alterCompetencyStandard: false,
    auditRequired: true,
  },
  reviewPolicy: {
    reviewRequired: "conditional",
    reviewTriggers: [
      "integrity_flag",
      "manual_review_item",
      "score_within_threshold",
      "ambiguous_boundary_response",
    ],
    reviewerRoles: ["academy_instructor", "academy_standards_reviewer"],
    conflictCheckRequired: true,
    blindReviewAllowed: true,
    multipleReviewersRequired: false,
    minimumReviewerCount: 1,
    reviewerAgreementRequired: false,
    disagreementCreatesEscalation: true,
    reviewSlaHours: 72,
  },
  appealPolicy: {
    appealsAllowed: true,
    filingWindowDays: 14,
    grounds: [
      "scoring_error",
      "integrity_error",
      "accommodation_failure",
      "procedural_error",
      "new_material_evidence",
    ],
    initialScreeningRole: "academy_standards_reviewer",
    reviewingRoles: ["academy_standards_reviewer"],
    independentReviewerRequired: true,
    preserveOriginalResult: true,
    possibleOutcomes: [
      "affirm",
      "rescore",
      "reassess",
      "invalidate",
      "return_for_clarification",
      "escalate",
    ],
  },
  revalidationPolicy: {
    triggers: [
      "lesson_version_change",
      "review_policy_change",
      "authority_policy_change",
      "standard_change",
      "law_change",
      "conflict_policy_change",
    ],
    severityByTrigger: {
      lesson_version_change: "moderate",
      review_policy_change: "high",
      authority_policy_change: "critical",
      standard_change: "high",
      law_change: "high",
      conflict_policy_change: "high",
    },
    expiresEligibilityEvidence: true,
    mayInvalidateAttempts: false,
    mayRequireReassessment: true,
    mayHoldDependentAssignments: true,
    preserveHistoricalResult: true,
  },
  projectionPolicy: {
    publicSafe: true,
    visibility: "public",
    protectedFields: [
      "itemRefs",
      "passPolicy.boundaryFailureIds",
      "integrityPolicy",
      "responses",
      "correctAnswers",
    ],
    publicSummary:
      "A bounded reviewer-orientation assessment. Passing does not create authority.",
    exposeItemContentPublicly: false,
    exposeCorrectAnswersPublicly: false,
    exposeRubricPublicly: true,
    exposeAggregateAnalyticsPublicly: true,
  },
  simulationHooks: [
    {
      simulationScenarioId: "TA14-SIM-REVIEWER-ORIENTATION-001",
      simulationVersion: "3.0",
      requiredCheckpointIds: ["CP-CONFLICT", "CP-EVIDENCE", "CP-DETERMINATION"],
      allowedEvidenceFields: ["selected_evidence_ids", "declared_conflict", "decision_rationale"],
      prohibitedEvidenceFields: ["simulation_score", "simulation_outcome", "simulation_authority"],
      resultImportMode: "observations_only",
      simulationOutcomeCreatesAssessmentPass: false,
      simulationOutcomeCreatesAuthority: false,
    },
  ],
  credentialEligibilityOutputs: [
    {
      eligibilityType: "reviewer_orientation_completed",
      credentialType: "TA14-REVIEWER-ORIENTATION",
      competencyIds: ["review.boundary_comprehension", "review.conflict_and_scope"],
      minimumAssessmentResult: "passed",
      expiresAfterDays: 365,
      restrictions: [
        "Eligibility does not issue a credential.",
        "Eligibility does not create authority.",
        "Conflict and competence checks remain required.",
      ],
      createsCredential: false,
      createsAuthority: false,
      requiresSeparateCredentialProcess: true,
      requiresSeparateAuthorityProcess: true,
    },
  ],
  authorityBoundary:
    "Passing may create bounded eligibility evidence only. It does not issue a credential, grant reviewer authority, accept an assignment, admit evidence, commit a finding, create a determination, or create Registry effect.",
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
    technicalOwnerId: "TA14-SUBJECT-TECHNICAL",
    academyStandardsReviewerId: "TA14-SUBJECT-ACADEMY-STANDARDS",
  },
});

export function createDeterministicAssessmentDependencies(
  startAt = "2026-08-04T14:00:00.000Z",
): {
  readonly ids: AssessmentIdentifierFactory;
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
      createAttemptId: () => next("TA14-ACD-ATTEMPT"),
      createEligibilityEvidenceId: () => next("TA14-ACD-ELIG"),
    },
    now: () =>
      new Date(Date.parse(startAt) + counter * 1000).toISOString(),
    hashCanonicalValue: (value) =>
      `sha256:${deterministicHex(JSON.stringify(value))}`,
  };
}

export interface AssessmentEngineSelfCheck {
  readonly ok: boolean;
  readonly assessmentValid: boolean;
  readonly attemptValid: boolean;
  readonly authorityCreated: false;
  readonly credentialCreated: false;
  readonly registryEffectCreated: false;
  readonly artifactEffectCreated: false;
  readonly issues: readonly string[];
}

export function runAssessmentEngineSelfCheck(): AssessmentEngineSelfCheck {
  const issues: string[] = [];
  const assessmentValidation = validateAssessmentDefinition(
    reviewerOrientationAssessment,
  );
  if (!assessmentValidation.ok) {
    issues.push("Canonical assessment failed validation.");
  }

  const d = createDeterministicAssessmentDependencies();
  const attempt = createAssessmentAttempt({
    attemptId: d.ids.createAttemptId(),
    assessment: reviewerOrientationAssessment,
    learnerSubjectId: "TA14-SUBJECT-TEST",
    organizationId: "TA14-ORG-TEST",
    lessonId: reviewerOrientationAssessment.lessonIds[0],
    attemptNumber: 1,
    itemOrder: reviewerOrientationAssessment.itemRefs.map((r) => r.itemId),
    accommodations: [],
    correlationId: "TA14-CORR-ASSESSMENT-TEST",
    now: d.now(),
  });
  const attemptValidation = validateAssessmentAttempt(attempt);
  if (!attemptValidation.ok) {
    issues.push("Canonical attempt failed validation.");
  }

  return {
    ok: issues.length === 0,
    assessmentValid: assessmentValidation.ok,
    attemptValid: attemptValidation.ok,
    authorityCreated: false,
    credentialCreated: false,
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
  return typeof value === "string" &&
    /^\d+\.\d+(?:\.\d+)?(?:[-+][0-9A-Za-z.-]+)?$/.test(value);
}

function isDateTime(value: unknown): value is ISODateTimeString {
  return typeof value === "string" &&
    value.includes("T") &&
    Number.isFinite(Date.parse(value));
}

function isContentHash(value: unknown): value is ContentHash {
  return typeof value === "string" &&
    /^sha256:[a-fA-F0-9]{64}$/.test(value);
}

function round(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
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

const assessmentContracts = {
  engineId: TA14_ACADEMY_ASSESSMENT_ENGINE_ID,
  engineVersion: TA14_ACADEMY_ASSESSMENT_ENGINE_VERSION,
  boundary: TA14_ACADEMY_ASSESSMENT_BOUNDARY,
  validateAssessmentDefinition,
  validateAssessmentAttempt,
  createAssessmentAttempt,
  recordAssessmentResponse,
  addAssessmentIntegritySignal,
  submitAssessmentAttempt,
  finalizeAssessmentAttempt,
  createCredentialEligibilityEvidence,
  projectPublicAssessment,
  buildAssessmentAnalytics,
  CanonicalAssessmentScorer,
  AcademyAssessmentService,
  InMemoryAssessmentDefinitionRepository,
  InMemoryAssessmentItemRepository,
  InMemoryAssessmentAttemptRepository,
  InMemoryCredentialEligibilityEvidenceRepository,
  reviewerOrientationAssessment,
  runAssessmentEngineSelfCheck,
};

export default assessmentContracts;
