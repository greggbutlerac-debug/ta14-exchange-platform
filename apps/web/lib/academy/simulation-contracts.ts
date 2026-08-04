/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * ACD-004 — Simulation Contracts and Isolation Engine
 *
 * Create:
 *   apps/web/lib/academy/simulation-contracts.ts
 *
 * Constitutional purpose:
 *   Provide safe, attributable practice environments that can support learning,
 *   assessment, instructor review, credential eligibility evidence, and reviewed
 *   return-to-live handoffs without creating production, Registry, artifact,
 *   payment, review, determination, or authority effects.
 */

import type {
  AssessmentState,
  ContentHash,
  CorrelationIdentifier,
  IdempotencyKey,
  InstitutionalIdentifier,
  InstitutionalRecordType,
  InstitutionalRole,
  ISODateTimeString,
  JsonValue,
  OperationalHandoffState,
  ProjectionClass,
  SimulationState,
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
  ExtendedAcademyEventType,
} from "./academy-events";

export const TA14_ACADEMY_SIMULATION_ENGINE_VERSION = "3.0" as const;
export const TA14_ACADEMY_SIMULATION_ENGINE_ID =
  "TA14-ACD-SIM-ENGINE-000001" as const;

export const TA14_SIMULATION_MARKER =
  "SIMULATION - NO PRODUCTION EFFECT" as const;

export const TA14_SIMULATION_BOUNDARY =
  "Simulation may support learning, assessment, instructor review, credential eligibility evidence, and reviewed input handoff. It may not create production records, Registry effects, execution artifacts, substantive review findings, determinations, payment effects, authority grants, or legal or institutional effect." as const;

export const TA14_SIMULATION_NON_RELIANCE_NOTICE =
  "This simulation is educational and non-production. Its decisions, scores, outputs, screenshots, exports, and outcomes are not live institutional results and may not be relied upon as evidence of completed governance work." as const;

/* ========================================================================== *
 * Canonical enumerations
 * ========================================================================== */

export const SIMULATION_MODES = [
  "individual",
  "instructor_led",
  "team",
  "reviewer_practice",
  "artifact_practice",
  "mission_control_practice",
  "demonstration_rehearsal",
] as const;
export type SimulationMode = (typeof SIMULATION_MODES)[number];

export const SIMULATION_DIFFICULTY_LEVELS = [
  "orientation",
  "foundational",
  "intermediate",
  "advanced",
  "expert",
] as const;
export type SimulationDifficulty =
  (typeof SIMULATION_DIFFICULTY_LEVELS)[number];

export const SIMULATION_DATA_CLASSES = [
  "fictional",
  "synthetic",
  "redacted",
  "participant_approved",
  "controlled",
] as const;
export type SimulationDataClass =
  (typeof SIMULATION_DATA_CLASSES)[number];

export const SIMULATION_PARTICIPANT_ROLES = [
  "learner",
  "team_member",
  "team_lead",
  "observer",
  "instructor",
  "assessor",
  "scenario_operator",
] as const;
export type SimulationParticipantRole =
  (typeof SIMULATION_PARTICIPANT_ROLES)[number];

export const SIMULATION_CHECKPOINT_TYPES = [
  "orientation",
  "evidence_boundary",
  "decision",
  "authority_check",
  "route_gate",
  "determination",
  "outcome",
  "reflection",
  "assessment",
] as const;
export type SimulationCheckpointType =
  (typeof SIMULATION_CHECKPOINT_TYPES)[number];

export const SIMULATION_BRANCH_RESULTS = [
  "continue",
  "ALLOW",
  "HOLD",
  "DENY",
  "ESCALATE",
  "CORRECT",
  "REVALIDATE",
  "OUTSIDE_SCOPE",
  "complete",
  "invalid",
] as const;
export type SimulationBranchResult =
  (typeof SIMULATION_BRANCH_RESULTS)[number];

export const SIMULATION_EXPORT_FORMATS = [
  "json",
  "jsonl",
  "csv",
  "pdf",
  "image",
] as const;
export type SimulationExportFormat =
  (typeof SIMULATION_EXPORT_FORMATS)[number];

export const SIMULATION_RETENTION_STATES = [
  "active",
  "retained",
  "expired",
  "archived",
  "invalidated",
  "scheduled_for_deletion",
] as const;
export type SimulationRetentionState =
  (typeof SIMULATION_RETENTION_STATES)[number];

export const SIMULATION_HANDOFF_DECISIONS = [
  "ALLOW",
  "HOLD",
  "DENY",
  "ESCALATE",
] as const;
export type SimulationHandoffDecision =
  (typeof SIMULATION_HANDOFF_DECISIONS)[number];

export const SIMULATION_RANDOMIZATION_STRATEGIES = [
  "none",
  "seeded",
  "bounded_variant",
  "instructor_selected",
] as const;
export type SimulationRandomizationStrategy =
  (typeof SIMULATION_RANDOMIZATION_STRATEGIES)[number];

/* ========================================================================== *
 * Core records
 * ========================================================================== */

export interface SimulationScenarioDefinition {
  readonly scenarioId: InstitutionalIdentifier;
  readonly version: string;
  readonly title: string;
  readonly summary: string;
  readonly lessonId: InstitutionalIdentifier;
  readonly lessonVersion: string;
  readonly division: string;
  readonly mode: SimulationMode;
  readonly difficulty: SimulationDifficulty;
  readonly supportedRoles: readonly InstitutionalRole[];
  readonly participantRoles: readonly SimulationParticipantRole[];
  readonly recordTypes: readonly InstitutionalRecordType[];
  readonly learningObjectives: readonly string[];
  readonly institutionalBasis: readonly string[];
  readonly prerequisites: readonly SimulationPrerequisite[];
  readonly initialState: SimulationScenarioState;
  readonly evidenceItems: readonly SimulationEvidenceItem[];
  readonly authorityProfiles: readonly SimulationAuthorityProfile[];
  readonly checkpoints: readonly SimulationCheckpoint[];
  readonly branches: readonly SimulationBranch[];
  readonly completionRules: readonly SimulationCompletionRule[];
  readonly scoringPolicy: SimulationScoringPolicy;
  readonly randomization: SimulationRandomizationPolicy;
  readonly exportPolicy: SimulationExportPolicy;
  readonly retentionPolicy: SimulationRetentionPolicy;
  readonly handoffPolicy: SimulationHandoffPolicy;
  readonly visibility: SimulationVisibilityPolicy;
  readonly authorityBoundary: string;
  readonly persistentMarker: typeof TA14_SIMULATION_MARKER;
  readonly nonRelianceNotice: typeof TA14_SIMULATION_NON_RELIANCE_NOTICE;
  readonly contentHash: ContentHash;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly publicationState: "draft" | "active" | "restricted" | "superseded";
}

export interface SimulationPrerequisite {
  readonly prerequisiteId: string;
  readonly title: string;
  readonly description: string;
  readonly type:
    | "lesson"
    | "role"
    | "attestation"
    | "assessment"
    | "credential"
    | "instructor_approval";
  readonly enforcement: "informational" | "recommended" | "required" | "blocking";
  readonly referencedObjectId?: string;
  readonly requiredState?: string;
  readonly failureMessage: string;
}

export interface SimulationScenarioState {
  readonly stageId: string;
  readonly checkpointId?: string;
  readonly values: Readonly<Record<string, JsonValue>>;
  readonly visibleEvidenceIds: readonly string[];
  readonly activeAuthorityProfileIds: readonly string[];
  readonly elapsedSeconds: number;
  readonly attemptCount: number;
  readonly warnings: readonly string[];
}

export interface SimulationEvidenceItem {
  readonly evidenceId: string;
  readonly title: string;
  readonly description: string;
  readonly classification: SimulationDataClass;
  readonly provenance: string;
  readonly version: string;
  readonly current: boolean;
  readonly permitted: boolean;
  readonly relevantTo: readonly string[];
  readonly limitations: readonly string[];
  readonly payload: JsonValue;
  readonly integrityHash?: ContentHash;
}

export interface SimulationAuthorityProfile {
  readonly authorityProfileId: string;
  readonly title: string;
  readonly holderRole: InstitutionalRole;
  readonly scope: readonly string[];
  readonly restrictions: readonly string[];
  readonly active: boolean;
  readonly simulatedOnly: true;
  readonly createsProductionAuthority: false;
}

export interface SimulationCheckpoint {
  readonly checkpointId: string;
  readonly order: number;
  readonly type: SimulationCheckpointType;
  readonly title: string;
  readonly prompt: string;
  readonly instructions: readonly string[];
  readonly requiredResponseType:
    | "acknowledgement"
    | "single_choice"
    | "multiple_choice"
    | "text"
    | "structured"
    | "decision"
    | "evidence_selection";
  readonly options?: readonly SimulationCheckpointOption[];
  readonly requiredEvidenceIds?: readonly string[];
  readonly permittedAuthorityProfileIds?: readonly string[];
  readonly assessmentHookIds?: readonly string[];
  readonly timeLimitSeconds?: number;
  readonly blocking: boolean;
}

export interface SimulationCheckpointOption {
  readonly optionId: string;
  readonly label: string;
  readonly description?: string;
  readonly value: JsonValue;
  readonly consequenceHint?: string;
}

export interface SimulationBranchCondition {
  readonly field: string;
  readonly operator:
    | "equals"
    | "not_equals"
    | "exists"
    | "not_exists"
    | "includes"
    | "excludes"
    | "greater_than"
    | "greater_than_or_equal"
    | "less_than"
    | "less_than_or_equal"
    | "in"
    | "not_in";
  readonly value?: JsonValue;
}

export interface SimulationBranch {
  readonly branchId: string;
  readonly checkpointId: string;
  readonly conditions: readonly SimulationBranchCondition[];
  readonly result: SimulationBranchResult;
  readonly explanation: string;
  readonly nextCheckpointId?: string;
  readonly scoreAdjustment: number;
  readonly boundaryFailures: readonly string[];
  readonly learningFeedback: readonly string[];
  readonly createsProductionEffect: false;
}

export interface SimulationCompletionRule {
  readonly ruleId: string;
  readonly title: string;
  readonly description: string;
  readonly requiredCheckpointIds: readonly string[];
  readonly minimumScore?: number;
  readonly prohibitedBoundaryFailures: readonly string[];
  readonly resultState: "completed" | "invalid";
  readonly completionMessage: string;
  readonly failureMessage: string;
}

export interface SimulationScoringPolicy {
  readonly enabled: boolean;
  readonly maximumScore: number;
  readonly passingScore?: number;
  readonly assessmentStateOnPass?: AssessmentState;
  readonly assessmentStateOnFail?: AssessmentState;
  readonly boundaryFailureOverridesScore: boolean;
  readonly scoreCreatesCredentialEligibilityOnly: boolean;
  readonly scoreCreatesAuthority: false;
}

export interface SimulationRandomizationPolicy {
  readonly strategy: SimulationRandomizationStrategy;
  readonly seedRequired: boolean;
  readonly allowedVariantIds: readonly string[];
  readonly preservesLearningObjectives: true;
  readonly preservesAuthorityBoundary: true;
  readonly deterministicReplay: boolean;
}

export interface SimulationExportPolicy {
  readonly allowed: boolean;
  readonly formats: readonly SimulationExportFormat[];
  readonly permittedRoles: readonly InstitutionalRole[];
  readonly includeInputs: boolean;
  readonly includeDecisions: boolean;
  readonly includeScores: boolean;
  readonly includeInstructorFeedback: boolean;
  readonly watermarkRequired: true;
  readonly nonRelianceNoticeRequired: true;
  readonly publicSharingAllowed: boolean;
  readonly protectedPaths: readonly string[];
}

export interface SimulationRetentionPolicy {
  readonly retentionDays: number;
  readonly retainInvalidatedRecords: boolean;
  readonly retainEventHistory: true;
  readonly deletionRequiresServiceRole: true;
  readonly exportBeforeDeletionAllowed: boolean;
  readonly legalHoldSupported: boolean;
}

export interface SimulationHandoffPolicy {
  readonly enabled: boolean;
  readonly copiedInputsOnly: true;
  readonly decisionMayTransfer: false;
  readonly scoreMayTransfer: false;
  readonly outcomeMayTransfer: false;
  readonly productionValidationRequired: true;
  readonly evidenceValidationRequired: true;
  readonly permissionValidationRequired: true;
  readonly authorityValidationRequired: true;
  readonly provenanceValidationRequired: true;
  readonly authorizedReviewerRoles: readonly InstitutionalRole[];
  readonly allowedTargetRecordTypes: readonly InstitutionalRecordType[];
}

export interface SimulationVisibilityPolicy {
  readonly projection: ProjectionClass;
  readonly permittedRoles: readonly InstitutionalRole[];
  readonly organizationMatchRequired: boolean;
  readonly protectedFields: readonly string[];
  readonly publicSafeSummary?: string;
}

export interface AcademySimulationRecord {
  readonly simulationId: InstitutionalIdentifier;
  readonly scenarioId: InstitutionalIdentifier;
  readonly scenarioVersion: string;
  readonly lessonId: InstitutionalIdentifier;
  readonly lessonVersion: string;
  readonly ownerSubjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly mode: SimulationMode;
  readonly difficulty: SimulationDifficulty;
  readonly state: SimulationState;
  readonly retentionState: SimulationRetentionState;
  readonly participantIds: readonly InstitutionalIdentifier[];
  readonly currentState: SimulationScenarioState;
  readonly checkpointResponses: readonly SimulationCheckpointResponse[];
  readonly decisions: readonly SimulationDecision[];
  readonly snapshots: readonly SimulationSnapshot[];
  readonly score: SimulationScore;
  readonly boundaryFailures: readonly string[];
  readonly instructorFeedback: readonly SimulationInstructorFeedback[];
  readonly createdAt: ISODateTimeString;
  readonly startedAt?: ISODateTimeString;
  readonly completedAt?: ISODateTimeString;
  readonly invalidatedAt?: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly lastActivityAt: ISODateTimeString;
  readonly randomSeed?: string;
  readonly correlationId: CorrelationIdentifier;
  readonly persistentMarker: typeof TA14_SIMULATION_MARKER;
  readonly createsProductionEffect: false;
  readonly createsRegistryEffect: false;
  readonly createsArtifactEffect: false;
  readonly createsAuthorityEffect: false;
  readonly nonRelianceNotice: typeof TA14_SIMULATION_NON_RELIANCE_NOTICE;
  readonly integrityHash: ContentHash;
}

export interface SimulationCheckpointResponse {
  readonly responseId: InstitutionalIdentifier;
  readonly checkpointId: string;
  readonly actorSubjectId: InstitutionalIdentifier;
  readonly participantRole: SimulationParticipantRole;
  readonly submittedAt: ISODateTimeString;
  readonly value: JsonValue;
  readonly selectedEvidenceIds: readonly string[];
  readonly authorityProfileId?: string;
  readonly valid: boolean;
  readonly validationMessages: readonly string[];
}

export interface SimulationDecision {
  readonly decisionId: InstitutionalIdentifier;
  readonly checkpointId: string;
  readonly actorSubjectId: InstitutionalIdentifier;
  readonly result: SimulationBranchResult;
  readonly rationale: string;
  readonly evidenceIds: readonly string[];
  readonly authorityProfileId?: string;
  readonly branchId?: string;
  readonly scoreAdjustment: number;
  readonly boundaryFailures: readonly string[];
  readonly decidedAt: ISODateTimeString;
  readonly simulatedOnly: true;
  readonly createsProductionEffect: false;
}

export interface SimulationScore {
  readonly current: number;
  readonly maximum: number;
  readonly percentage: number;
  readonly passing: boolean;
  readonly boundaryFailureOverride: boolean;
  readonly assessmentEligible: boolean;
  readonly credentialEligibilityEvidenceOnly: boolean;
  readonly authorityCreated: false;
}

export interface SimulationSnapshot {
  readonly snapshotId: InstitutionalIdentifier;
  readonly label: string;
  readonly createdAt: ISODateTimeString;
  readonly createdBy: InstitutionalIdentifier;
  readonly state: SimulationScenarioState;
  readonly checkpointResponseCount: number;
  readonly decisionCount: number;
  readonly score: SimulationScore;
  readonly integrityHash: ContentHash;
}

export interface SimulationInstructorFeedback {
  readonly feedbackId: InstitutionalIdentifier;
  readonly instructorSubjectId: InstitutionalIdentifier;
  readonly createdAt: ISODateTimeString;
  readonly checkpointId?: string;
  readonly decisionId?: InstitutionalIdentifier;
  readonly message: string;
  readonly classification:
    | "observation"
    | "correction"
    | "boundary_warning"
    | "commendation"
    | "assessment_note";
  readonly visibleToLearner: boolean;
  readonly createsInstitutionalEffect: false;
}

export interface SimulationParticipant {
  readonly subjectId: InstitutionalIdentifier;
  readonly institutionalRole?: InstitutionalRole;
  readonly participantRole: SimulationParticipantRole;
  readonly joinedAt: ISODateTimeString;
  readonly active: boolean;
}

export interface SimulationTeam {
  readonly teamId: InstitutionalIdentifier;
  readonly simulationId: InstitutionalIdentifier;
  readonly title: string;
  readonly members: readonly SimulationParticipant[];
  readonly teamLeadSubjectId?: InstitutionalIdentifier;
  readonly sharedDecisionMode:
    | "individual_then_merge"
    | "consensus"
    | "team_lead"
    | "instructor_moderated";
}

/* ========================================================================== *
 * Handoff records
 * ========================================================================== */

export interface SimulationToLiveHandoffRequest {
  readonly handoffId: InstitutionalIdentifier;
  readonly simulationId: InstitutionalIdentifier;
  readonly scenarioId: InstitutionalIdentifier;
  readonly scenarioVersion: string;
  readonly sourceSnapshotId?: InstitutionalIdentifier;
  readonly targetRecordId?: InstitutionalIdentifier;
  readonly targetRecordType: InstitutionalRecordType;
  readonly requestedFields: readonly SimulationHandoffField[];
  readonly sourceClassification: SimulationDataClass;
  readonly requestedBy: InstitutionalIdentifier;
  readonly requestedAt: ISODateTimeString;
  readonly state: OperationalHandoffState;
  readonly limitations: readonly string[];
  readonly correlationId: CorrelationIdentifier;
  readonly idempotencyKey: IdempotencyKey;
}

export interface SimulationHandoffField {
  readonly sourcePath: string;
  readonly targetPath: string;
  readonly sourceValue: JsonValue;
  readonly transformation?: string;
  readonly evidenceReference?: string;
  readonly permissionReference?: string;
  readonly provenanceReference?: string;
}

export interface SimulationToLiveHandoffReview {
  readonly reviewId: InstitutionalIdentifier;
  readonly handoffId: InstitutionalIdentifier;
  readonly reviewerSubjectId: InstitutionalIdentifier;
  readonly reviewerRole: InstitutionalRole;
  readonly reviewedAt: ISODateTimeString;
  readonly decision: SimulationHandoffDecision;
  readonly approvedFields: readonly string[];
  readonly deniedFields: readonly string[];
  readonly requiredTransformations: readonly string[];
  readonly rationale: string;
  readonly limitations: readonly string[];
  readonly productionEvidenceAccepted: false;
  readonly simulationDecisionTransferred: false;
  readonly simulationScoreTransferred: false;
  readonly simulationOutcomeTransferred: false;
}

export interface AppliedSimulationHandoff {
  readonly applicationId: InstitutionalIdentifier;
  readonly handoffId: InstitutionalIdentifier;
  readonly reviewId: InstitutionalIdentifier;
  readonly targetRecordId: InstitutionalIdentifier;
  readonly targetRecordType: InstitutionalRecordType;
  readonly appliedFields: readonly string[];
  readonly appliedAt: ISODateTimeString;
  readonly appliedByService: string;
  readonly productionValidationCompleted: true;
  readonly evidenceValidationCompleted: true;
  readonly permissionValidationCompleted: true;
  readonly authorityValidationCompleted: true;
  readonly provenanceValidationCompleted: true;
  readonly simulationResultTransferred: false;
}

/* ========================================================================== *
 * Commands and service dependencies
 * ========================================================================== */

export interface SimulationEngineDependencies {
  readonly now: () => ISODateTimeString;
  readonly createId: (prefix: string) => InstitutionalIdentifier;
  readonly hashCanonicalValue: (
    value: JsonValue,
  ) => Promise<ContentHash> | ContentHash;
  readonly scenarioRepository: SimulationScenarioRepository;
  readonly simulationRepository: AcademySimulationRepository;
  readonly handoffRepository: SimulationHandoffRepository;
  readonly eventService?: AcademyEventService;
}

export interface CreateSimulationCommand {
  readonly scenarioId: InstitutionalIdentifier;
  readonly ownerSubjectId: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly mode?: SimulationMode;
  readonly difficulty?: SimulationDifficulty;
  readonly participantIds?: readonly InstitutionalIdentifier[];
  readonly randomSeed?: string;
  readonly correlationId: CorrelationIdentifier;
  readonly idempotencyKey: IdempotencyKey;
  readonly actor: AcademyEventActor;
  readonly authority: AcademyEventAuthority;
}

export interface StartSimulationCommand {
  readonly simulationId: InstitutionalIdentifier;
  readonly actor: AcademyEventActor;
  readonly authority: AcademyEventAuthority;
  readonly correlationId: CorrelationIdentifier;
  readonly idempotencyKey: IdempotencyKey;
}

export interface SubmitCheckpointCommand {
  readonly simulationId: InstitutionalIdentifier;
  readonly checkpointId: string;
  readonly actorSubjectId: InstitutionalIdentifier;
  readonly participantRole: SimulationParticipantRole;
  readonly value: JsonValue;
  readonly selectedEvidenceIds?: readonly string[];
  readonly authorityProfileId?: string;
  readonly rationale?: string;
  readonly correlationId: CorrelationIdentifier;
  readonly idempotencyKey: IdempotencyKey;
  readonly actor: AcademyEventActor;
  readonly authority: AcademyEventAuthority;
}

export interface ResetSimulationCommand {
  readonly simulationId: InstitutionalIdentifier;
  readonly snapshotId?: InstitutionalIdentifier;
  readonly actor: AcademyEventActor;
  readonly authority: AcademyEventAuthority;
  readonly correlationId: CorrelationIdentifier;
  readonly idempotencyKey: IdempotencyKey;
}

export interface CompleteSimulationCommand {
  readonly simulationId: InstitutionalIdentifier;
  readonly actor: AcademyEventActor;
  readonly authority: AcademyEventAuthority;
  readonly correlationId: CorrelationIdentifier;
  readonly idempotencyKey: IdempotencyKey;
}

export interface InvalidateSimulationCommand {
  readonly simulationId: InstitutionalIdentifier;
  readonly reason: string;
  readonly actor: AcademyEventActor;
  readonly authority: AcademyEventAuthority;
  readonly correlationId: CorrelationIdentifier;
  readonly idempotencyKey: IdempotencyKey;
}

export interface ExportSimulationCommand {
  readonly simulationId: InstitutionalIdentifier;
  readonly format: SimulationExportFormat;
  readonly projection: ProjectionClass;
  readonly requestedByRole: InstitutionalRole;
  readonly includeInstructorFeedback?: boolean;
}

export interface CreateHandoffCommand {
  readonly simulationId: InstitutionalIdentifier;
  readonly targetRecordId?: InstitutionalIdentifier;
  readonly targetRecordType: InstitutionalRecordType;
  readonly requestedFields: readonly SimulationHandoffField[];
  readonly requestedBy: InstitutionalIdentifier;
  readonly correlationId: CorrelationIdentifier;
  readonly idempotencyKey: IdempotencyKey;
  readonly actor: AcademyEventActor;
  readonly authority: AcademyEventAuthority;
}

/* ========================================================================== *
 * Repository contracts
 * ========================================================================== */

export interface SimulationScenarioRepository {
  getById(
    scenarioId: InstitutionalIdentifier,
    version?: string,
  ): Promise<SimulationScenarioDefinition | null>;
  listActive(): Promise<readonly SimulationScenarioDefinition[]>;
  save(scenario: SimulationScenarioDefinition): Promise<void>;
}

export interface AcademySimulationQuery {
  readonly simulationIds?: readonly InstitutionalIdentifier[];
  readonly scenarioIds?: readonly InstitutionalIdentifier[];
  readonly lessonIds?: readonly InstitutionalIdentifier[];
  readonly ownerSubjectIds?: readonly InstitutionalIdentifier[];
  readonly organizationIds?: readonly InstitutionalIdentifier[];
  readonly states?: readonly SimulationState[];
  readonly modes?: readonly SimulationMode[];
  readonly from?: ISODateTimeString;
  readonly to?: ISODateTimeString;
  readonly limit?: number;
  readonly cursor?: string;
}

export interface AcademySimulationPage {
  readonly simulations: readonly AcademySimulationRecord[];
  readonly nextCursor?: string;
  readonly total?: number;
}

export interface AcademySimulationRepository {
  getById(
    simulationId: InstitutionalIdentifier,
  ): Promise<AcademySimulationRecord | null>;
  getByIdempotencyKey(
    idempotencyKey: IdempotencyKey,
  ): Promise<AcademySimulationRecord | null>;
  create(
    simulation: AcademySimulationRecord,
    idempotencyKey: IdempotencyKey,
  ): Promise<AcademySimulationRecord>;
  replace(
    simulation: AcademySimulationRecord,
  ): Promise<AcademySimulationRecord>;
  query(query: AcademySimulationQuery): Promise<AcademySimulationPage>;
}

export interface SimulationHandoffRepository {
  getById(
    handoffId: InstitutionalIdentifier,
  ): Promise<SimulationToLiveHandoffRequest | null>;
  getByIdempotencyKey(
    idempotencyKey: IdempotencyKey,
  ): Promise<SimulationToLiveHandoffRequest | null>;
  create(
    handoff: SimulationToLiveHandoffRequest,
  ): Promise<SimulationToLiveHandoffRequest>;
  replace(
    handoff: SimulationToLiveHandoffRequest,
  ): Promise<SimulationToLiveHandoffRequest>;
  addReview(review: SimulationToLiveHandoffReview): Promise<void>;
  getReviews(
    handoffId: InstitutionalIdentifier,
  ): Promise<readonly SimulationToLiveHandoffReview[]>;
}

/* ========================================================================== *
 * Validation
 * ========================================================================== */

export type SimulationValidationCode =
  | "required"
  | "invalid_type"
  | "invalid_value"
  | "invalid_state"
  | "invalid_transition"
  | "invalid_scenario"
  | "invalid_checkpoint"
  | "invalid_branch"
  | "invalid_hash"
  | "unsafe_production_effect"
  | "unsafe_registry_effect"
  | "unsafe_artifact_effect"
  | "unsafe_authority_effect"
  | "unsafe_handoff"
  | "unsafe_export"
  | "unsafe_projection"
  | "missing_non_reliance_notice"
  | "missing_simulation_marker"
  | "unsupported_role"
  | "unsupported_record_type"
  | "duplicate_value";

export interface SimulationValidationIssue {
  readonly path: string;
  readonly code: SimulationValidationCode;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly received?: unknown;
  readonly expected?: string;
}

export interface SimulationValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly issues: readonly SimulationValidationIssue[];
}

export class SimulationContractValidationError extends Error {
  readonly issues: readonly SimulationValidationIssue[];

  constructor(
    message: string,
    issues: readonly SimulationValidationIssue[],
  ) {
    super(message);
    this.name = "SimulationContractValidationError";
    this.issues = issues;
  }
}

export function validateSimulationScenario(
  input: unknown,
): SimulationValidationResult<SimulationScenarioDefinition> {
  const issues: SimulationValidationIssue[] = [];

  if (!isObject(input)) {
    return invalidRoot("Simulation scenario must be an object.", input);
  }

  requireString(input.scenarioId, "$.scenarioId", issues);
  requireString(input.version, "$.version", issues);
  requireString(input.title, "$.title", issues);
  requireString(input.summary, "$.summary", issues);
  requireString(input.lessonId, "$.lessonId", issues);
  requireString(input.lessonVersion, "$.lessonVersion", issues);
  requireString(input.division, "$.division", issues);

  if (!isOneOf(input.mode, SIMULATION_MODES)) {
    pushIssue(issues, "$.mode", "invalid_value", "Unsupported simulation mode.", input.mode);
  }

  if (!isOneOf(input.difficulty, SIMULATION_DIFFICULTY_LEVELS)) {
    pushIssue(issues, "$.difficulty", "invalid_value", "Unsupported difficulty.", input.difficulty);
  }

  validateEnumArray(input.supportedRoles, "$.supportedRoles", isInstitutionalRole, issues, "unsupported_role");
  validateEnumArray(input.recordTypes, "$.recordTypes", isInstitutionalRecordType, issues, "unsupported_record_type");
  validateStringArray(input.learningObjectives, "$.learningObjectives", issues, true);
  validateStringArray(input.institutionalBasis, "$.institutionalBasis", issues, true);

  if (!Array.isArray(input.checkpoints) || input.checkpoints.length === 0) {
    pushIssue(issues, "$.checkpoints", "required", "At least one checkpoint is required.", input.checkpoints);
  } else {
    const ids = new Set<string>();
    const orders = new Set<number>();
    input.checkpoints.forEach((checkpoint, index) => {
      validateCheckpoint(checkpoint, `$.checkpoints[${index}]`, issues);
      if (isObject(checkpoint) && typeof checkpoint.checkpointId === "string") {
        if (ids.has(checkpoint.checkpointId)) {
          pushIssue(issues, `$.checkpoints[${index}].checkpointId`, "duplicate_value", "Duplicate checkpoint ID.", checkpoint.checkpointId);
        }
        ids.add(checkpoint.checkpointId);
      }
      if (isObject(checkpoint) && typeof checkpoint.order === "number") {
        if (orders.has(checkpoint.order)) {
          pushIssue(issues, `$.checkpoints[${index}].order`, "duplicate_value", "Duplicate checkpoint order.", checkpoint.order);
        }
        orders.add(checkpoint.order);
      }
    });
  }

  if (!Array.isArray(input.branches) || input.branches.length === 0) {
    pushIssue(issues, "$.branches", "required", "At least one branch is required.", input.branches);
  } else {
    input.branches.forEach((branch, index) =>
      validateBranch(branch, `$.branches[${index}]`, issues),
    );
  }

  validateScoringPolicy(input.scoringPolicy, "$.scoringPolicy", issues);
  validateRandomizationPolicy(input.randomization, "$.randomization", issues);
  validateExportPolicy(input.exportPolicy, "$.exportPolicy", issues);
  validateRetentionPolicy(input.retentionPolicy, "$.retentionPolicy", issues);
  validateHandoffPolicy(input.handoffPolicy, "$.handoffPolicy", issues);
  validateVisibilityPolicy(input.visibility, "$.visibility", issues);

  if (input.persistentMarker !== TA14_SIMULATION_MARKER) {
    pushIssue(issues, "$.persistentMarker", "missing_simulation_marker", `Marker must equal ${TA14_SIMULATION_MARKER}.`, input.persistentMarker);
  }

  if (input.nonRelianceNotice !== TA14_SIMULATION_NON_RELIANCE_NOTICE) {
    pushIssue(issues, "$.nonRelianceNotice", "missing_non_reliance_notice", "Non-reliance notice must match the canonical notice.", input.nonRelianceNotice);
  }

  requireString(input.authorityBoundary, "$.authorityBoundary", issues);

  if (!isContentHash(input.contentHash)) {
    pushIssue(issues, "$.contentHash", "invalid_hash", "Content hash must use sha256 plus 64 hexadecimal characters.", input.contentHash);
  }

  if (!isIsoDateTime(input.effectiveAt)) {
    pushIssue(issues, "$.effectiveAt", "invalid_value", "effectiveAt must be an ISO date-time.", input.effectiveAt);
  }

  const ok = !issues.some((issue) => issue.severity === "error");
  return {
    ok,
    value: ok ? (input as unknown as SimulationScenarioDefinition) : undefined,
    issues,
  };
}

export function validateAcademySimulationRecord(
  input: unknown,
): SimulationValidationResult<AcademySimulationRecord> {
  const issues: SimulationValidationIssue[] = [];

  if (!isObject(input)) {
    return invalidRoot("Simulation record must be an object.", input);
  }

  requireString(input.simulationId, "$.simulationId", issues);
  requireString(input.scenarioId, "$.scenarioId", issues);
  requireString(input.scenarioVersion, "$.scenarioVersion", issues);
  requireString(input.lessonId, "$.lessonId", issues);
  requireString(input.lessonVersion, "$.lessonVersion", issues);
  requireString(input.ownerSubjectId, "$.ownerSubjectId", issues);
  requireString(input.correlationId, "$.correlationId", issues);

  if (!isOneOf(input.state, ["draft", "running", "completed", "invalid", "archived"] as const)) {
    pushIssue(issues, "$.state", "invalid_state", "Unsupported simulation state.", input.state);
  }

  if (!isOneOf(input.retentionState, SIMULATION_RETENTION_STATES)) {
    pushIssue(issues, "$.retentionState", "invalid_value", "Unsupported retention state.", input.retentionState);
  }

  if (!isOneOf(input.mode, SIMULATION_MODES)) {
    pushIssue(issues, "$.mode", "invalid_value", "Unsupported simulation mode.", input.mode);
  }

  if (!isOneOf(input.difficulty, SIMULATION_DIFFICULTY_LEVELS)) {
    pushIssue(issues, "$.difficulty", "invalid_value", "Unsupported difficulty.", input.difficulty);
  }

  if (input.persistentMarker !== TA14_SIMULATION_MARKER) {
    pushIssue(issues, "$.persistentMarker", "missing_simulation_marker", "Simulation marker is required.", input.persistentMarker);
  }

  if (input.nonRelianceNotice !== TA14_SIMULATION_NON_RELIANCE_NOTICE) {
    pushIssue(issues, "$.nonRelianceNotice", "missing_non_reliance_notice", "Canonical non-reliance notice is required.", input.nonRelianceNotice);
  }

  for (const [field, code] of [
    ["createsProductionEffect", "unsafe_production_effect"],
    ["createsRegistryEffect", "unsafe_registry_effect"],
    ["createsArtifactEffect", "unsafe_artifact_effect"],
    ["createsAuthorityEffect", "unsafe_authority_effect"],
  ] as const) {
    if (input[field] !== false) {
      pushIssue(issues, `$.${field}`, code, `${field} must be false.`, input[field]);
    }
  }

  if (!isContentHash(input.integrityHash)) {
    pushIssue(issues, "$.integrityHash", "invalid_hash", "Integrity hash is invalid.", input.integrityHash);
  }

  const ok = !issues.some((issue) => issue.severity === "error");
  return {
    ok,
    value: ok ? (input as unknown as AcademySimulationRecord) : undefined,
    issues,
  };
}

function validateCheckpoint(
  input: unknown,
  path: string,
  issues: SimulationValidationIssue[],
): void {
  if (!isObject(input)) {
    pushIssue(issues, path, "invalid_type", `${path} must be an object.`, input);
    return;
  }

  requireString(input.checkpointId, `${path}.checkpointId`, issues);
  requireString(input.title, `${path}.title`, issues);
  requireString(input.prompt, `${path}.prompt`, issues);
  validateStringArray(input.instructions, `${path}.instructions`, issues, true);

  if (typeof input.order !== "number" || !Number.isInteger(input.order) || input.order < 1) {
    pushIssue(issues, `${path}.order`, "invalid_value", "Checkpoint order must be a positive integer.", input.order);
  }

  if (!isOneOf(input.type, SIMULATION_CHECKPOINT_TYPES)) {
    pushIssue(issues, `${path}.type`, "invalid_value", "Unsupported checkpoint type.", input.type);
  }

  if (typeof input.blocking !== "boolean") {
    pushIssue(issues, `${path}.blocking`, "invalid_type", "blocking must be boolean.", input.blocking);
  }
}

function validateBranch(
  input: unknown,
  path: string,
  issues: SimulationValidationIssue[],
): void {
  if (!isObject(input)) {
    pushIssue(issues, path, "invalid_type", `${path} must be an object.`, input);
    return;
  }

  requireString(input.branchId, `${path}.branchId`, issues);
  requireString(input.checkpointId, `${path}.checkpointId`, issues);
  requireString(input.explanation, `${path}.explanation`, issues);

  if (!isOneOf(input.result, SIMULATION_BRANCH_RESULTS)) {
    pushIssue(issues, `${path}.result`, "invalid_branch", "Unsupported branch result.", input.result);
  }

  if (input.createsProductionEffect !== false) {
    pushIssue(issues, `${path}.createsProductionEffect`, "unsafe_production_effect", "Simulation branches may not create production effect.", input.createsProductionEffect);
  }

  if (typeof input.scoreAdjustment !== "number") {
    pushIssue(issues, `${path}.scoreAdjustment`, "invalid_type", "scoreAdjustment must be numeric.", input.scoreAdjustment);
  }
}

function validateScoringPolicy(
  input: unknown,
  path: string,
  issues: SimulationValidationIssue[],
): void {
  if (!isObject(input)) {
    pushIssue(issues, path, "invalid_type", `${path} must be an object.`, input);
    return;
  }

  if (input.scoreCreatesAuthority !== false) {
    pushIssue(issues, `${path}.scoreCreatesAuthority`, "unsafe_authority_effect", "Scores may not create authority.", input.scoreCreatesAuthority);
  }

  if (input.scoreCreatesCredentialEligibilityOnly !== true) {
    pushIssue(issues, `${path}.scoreCreatesCredentialEligibilityOnly`, "invalid_value", "Scores may support credential eligibility evidence only.", input.scoreCreatesCredentialEligibilityOnly);
  }
}

function validateRandomizationPolicy(
  input: unknown,
  path: string,
  issues: SimulationValidationIssue[],
): void {
  if (!isObject(input)) {
    pushIssue(issues, path, "invalid_type", `${path} must be an object.`, input);
    return;
  }

  if (!isOneOf(input.strategy, SIMULATION_RANDOMIZATION_STRATEGIES)) {
    pushIssue(issues, `${path}.strategy`, "invalid_value", "Unsupported randomization strategy.", input.strategy);
  }

  if (input.preservesLearningObjectives !== true || input.preservesAuthorityBoundary !== true) {
    pushIssue(issues, path, "invalid_value", "Randomization must preserve objectives and authority boundary.", input);
  }
}

function validateExportPolicy(
  input: unknown,
  path: string,
  issues: SimulationValidationIssue[],
): void {
  if (!isObject(input)) {
    pushIssue(issues, path, "invalid_type", `${path} must be an object.`, input);
    return;
  }

  if (input.watermarkRequired !== true || input.nonRelianceNoticeRequired !== true) {
    pushIssue(issues, path, "unsafe_export", "Exports require watermark and non-reliance notice.", input);
  }

  validateEnumArray(input.permittedRoles, `${path}.permittedRoles`, isInstitutionalRole, issues, "unsupported_role");
}

function validateRetentionPolicy(
  input: unknown,
  path: string,
  issues: SimulationValidationIssue[],
): void {
  if (!isObject(input)) {
    pushIssue(issues, path, "invalid_type", `${path} must be an object.`, input);
    return;
  }

  if (typeof input.retentionDays !== "number" || input.retentionDays < 1) {
    pushIssue(issues, `${path}.retentionDays`, "invalid_value", "retentionDays must be positive.", input.retentionDays);
  }

  if (input.retainEventHistory !== true || input.deletionRequiresServiceRole !== true) {
    pushIssue(issues, path, "invalid_value", "Event history retention and service-role deletion are required.", input);
  }
}

function validateHandoffPolicy(
  input: unknown,
  path: string,
  issues: SimulationValidationIssue[],
): void {
  if (!isObject(input)) {
    pushIssue(issues, path, "invalid_type", `${path} must be an object.`, input);
    return;
  }

  for (const field of ["copiedInputsOnly", "productionValidationRequired", "evidenceValidationRequired", "permissionValidationRequired", "authorityValidationRequired", "provenanceValidationRequired"] as const) {
    if (input[field] !== true) {
      pushIssue(issues, `${path}.${field}`, "unsafe_handoff", `${field} must be true.`, input[field]);
    }
  }

  for (const field of ["decisionMayTransfer", "scoreMayTransfer", "outcomeMayTransfer"] as const) {
    if (input[field] !== false) {
      pushIssue(issues, `${path}.${field}`, "unsafe_handoff", `${field} must be false.`, input[field]);
    }
  }
}

function validateVisibilityPolicy(
  input: unknown,
  path: string,
  issues: SimulationValidationIssue[],
): void {
  if (!isObject(input)) {
    pushIssue(issues, path, "invalid_type", `${path} must be an object.`, input);
    return;
  }

  if (!isProjectionClass(input.projection)) {
    pushIssue(issues, `${path}.projection`, "unsafe_projection", "Unsupported projection.", input.projection);
  }

  validateEnumArray(input.permittedRoles, `${path}.permittedRoles`, isInstitutionalRole, issues, "unsupported_role");
}

/* ========================================================================== *
 * Simulation engine
 * ========================================================================== */

export class AcademySimulationEngine {
  readonly dependencies: SimulationEngineDependencies;

  constructor(dependencies: SimulationEngineDependencies) {
    this.dependencies = dependencies;
  }

  async create(
    command: CreateSimulationCommand,
  ): Promise<AcademySimulationRecord> {
    const existing = await this.dependencies.simulationRepository.getByIdempotencyKey(command.idempotencyKey);
    if (existing) return existing;

    const scenario = await this.dependencies.scenarioRepository.getById(command.scenarioId);
    if (!scenario) {
      throw new Error(`Simulation scenario ${command.scenarioId} was not found.`);
    }

    const scenarioValidation = validateSimulationScenario(scenario);
    if (!scenarioValidation.ok) {
      throw new SimulationContractValidationError("Scenario failed validation.", scenarioValidation.issues as readonly SimulationValidationIssue[]);
    }

    const now = this.dependencies.now();
    const simulationId = this.dependencies.createId("TA14-SIM");
    const initialScore = calculateSimulationScore(scenario, [], []);

    const unsigned: Omit<AcademySimulationRecord, "integrityHash"> = {
      simulationId,
      scenarioId: scenario.scenarioId,
      scenarioVersion: scenario.version,
      lessonId: scenario.lessonId,
      lessonVersion: scenario.lessonVersion,
      ownerSubjectId: command.ownerSubjectId,
      organizationId: command.organizationId,
      mode: command.mode ?? scenario.mode,
      difficulty: command.difficulty ?? scenario.difficulty,
      state: "draft",
      retentionState: "active",
      participantIds: command.participantIds ?? [command.ownerSubjectId],
      currentState: scenario.initialState,
      checkpointResponses: [],
      decisions: [],
      snapshots: [],
      score: initialScore,
      boundaryFailures: [],
      instructorFeedback: [],
      createdAt: now,
      lastActivityAt: now,
      randomSeed: command.randomSeed,
      correlationId: command.correlationId,
      persistentMarker: TA14_SIMULATION_MARKER,
      createsProductionEffect: false,
      createsRegistryEffect: false,
      createsArtifactEffect: false,
      createsAuthorityEffect: false,
      nonRelianceNotice: TA14_SIMULATION_NON_RELIANCE_NOTICE,
    };

    const integrityHash = await this.dependencies.hashCanonicalValue(unsigned as unknown as JsonValue);
    const record = deepFreeze({ ...unsigned, integrityHash });
    const validation = validateAcademySimulationRecord(record);
    if (!validation.ok) {
      throw new SimulationContractValidationError("Simulation record failed validation.", validation.issues as readonly SimulationValidationIssue[]);
    }

    const created = await this.dependencies.simulationRepository.create(record, command.idempotencyKey);
    await this.emit("academy.simulation.created", created, command.actor, command.authority, command.correlationId, command.idempotencyKey, null, "draft");
    return created;
  }

  async start(command: StartSimulationCommand): Promise<AcademySimulationRecord> {
    const simulation = await this.requireSimulation(command.simulationId);
    assertSimulationTransition(simulation.state, "running");
    const now = this.dependencies.now();
    const updated = await this.rehash({
      ...simulation,
      state: "running",
      startedAt: simulation.startedAt ?? now,
      lastActivityAt: now,
    });
    await this.dependencies.simulationRepository.replace(updated);
    await this.emit("academy.simulation.started", updated, command.actor, command.authority, command.correlationId, command.idempotencyKey, simulation.state, "running");
    return updated;
  }

  async submitCheckpoint(
    command: SubmitCheckpointCommand,
  ): Promise<AcademySimulationRecord> {
    const simulation = await this.requireSimulation(command.simulationId);
    if (simulation.state !== "running") {
      throw new Error("Checkpoint responses require a running simulation.");
    }

    const scenario = await this.requireScenario(simulation.scenarioId, simulation.scenarioVersion);
    const checkpoint = scenario.checkpoints.find((item) => item.checkpointId === command.checkpointId);
    if (!checkpoint) {
      throw new Error(`Checkpoint ${command.checkpointId} was not found.`);
    }

    const validationMessages = validateCheckpointResponse(checkpoint, command);
    const responseId = this.dependencies.createId("TA14-SIM-RESP");
    const now = this.dependencies.now();
    const response: SimulationCheckpointResponse = {
      responseId,
      checkpointId: checkpoint.checkpointId,
      actorSubjectId: command.actorSubjectId,
      participantRole: command.participantRole,
      submittedAt: now,
      value: command.value,
      selectedEvidenceIds: command.selectedEvidenceIds ?? [],
      authorityProfileId: command.authorityProfileId,
      valid: validationMessages.length === 0,
      validationMessages,
    };

    const branch = resolveSimulationBranch(scenario, checkpoint, command.value, command.selectedEvidenceIds ?? [], command.authorityProfileId);
    const decision: SimulationDecision | null = checkpoint.requiredResponseType === "decision" || branch
      ? {
          decisionId: this.dependencies.createId("TA14-SIM-DEC"),
          checkpointId: checkpoint.checkpointId,
          actorSubjectId: command.actorSubjectId,
          result: branch?.result ?? "continue",
          rationale: command.rationale ?? "",
          evidenceIds: command.selectedEvidenceIds ?? [],
          authorityProfileId: command.authorityProfileId,
          branchId: branch?.branchId,
          scoreAdjustment: branch?.scoreAdjustment ?? 0,
          boundaryFailures: branch?.boundaryFailures ?? [],
          decidedAt: now,
          simulatedOnly: true,
          createsProductionEffect: false,
        }
      : null;

    const responses = [...simulation.checkpointResponses, response];
    const decisions = decision ? [...simulation.decisions, decision] : [...simulation.decisions];
    const boundaryFailures = Array.from(new Set([
      ...simulation.boundaryFailures,
      ...(decision?.boundaryFailures ?? []),
    ]));
    const score = calculateSimulationScore(scenario, decisions, boundaryFailures);
    const nextCheckpointId = branch?.nextCheckpointId ?? nextCheckpointAfter(scenario, checkpoint.checkpointId);

    const updated = await this.rehash({
      ...simulation,
      checkpointResponses: responses,
      decisions,
      boundaryFailures,
      score,
      currentState: {
        ...simulation.currentState,
        checkpointId: nextCheckpointId,
        elapsedSeconds: simulation.currentState.elapsedSeconds,
        attemptCount: simulation.currentState.attemptCount + 1,
      },
      lastActivityAt: now,
    });

    await this.dependencies.simulationRepository.replace(updated);
    return updated;
  }

  async createSnapshot(
    simulationId: InstitutionalIdentifier,
    label: string,
    createdBy: InstitutionalIdentifier,
  ): Promise<AcademySimulationRecord> {
    const simulation = await this.requireSimulation(simulationId);
    const now = this.dependencies.now();
    const hash = await this.dependencies.hashCanonicalValue({
      simulationId,
      label,
      state: simulation.currentState,
      responseCount: simulation.checkpointResponses.length,
      decisionCount: simulation.decisions.length,
      score: simulation.score,
    } as unknown as JsonValue);

    const snapshot: SimulationSnapshot = {
      snapshotId: this.dependencies.createId("TA14-SIM-SNAP"),
      label,
      createdAt: now,
      createdBy,
      state: simulation.currentState,
      checkpointResponseCount: simulation.checkpointResponses.length,
      decisionCount: simulation.decisions.length,
      score: simulation.score,
      integrityHash: hash,
    };

    const updated = await this.rehash({
      ...simulation,
      snapshots: [...simulation.snapshots, snapshot],
      lastActivityAt: now,
    });
    await this.dependencies.simulationRepository.replace(updated);
    return updated;
  }

  async reset(command: ResetSimulationCommand): Promise<AcademySimulationRecord> {
    const simulation = await this.requireSimulation(command.simulationId);
    if (!["draft", "running", "completed"].includes(simulation.state)) {
      throw new Error(`Simulation in state ${simulation.state} cannot be reset.`);
    }

    const scenario = await this.requireScenario(simulation.scenarioId, simulation.scenarioVersion);
    const snapshot = command.snapshotId
      ? simulation.snapshots.find((item) => item.snapshotId === command.snapshotId)
      : undefined;

    if (command.snapshotId && !snapshot) {
      throw new Error(`Snapshot ${command.snapshotId} was not found.`);
    }

    const responseCount = snapshot?.checkpointResponseCount ?? 0;
    const decisionCount = snapshot?.decisionCount ?? 0;
    const responses = simulation.checkpointResponses.slice(0, responseCount);
    const decisions = simulation.decisions.slice(0, decisionCount);
    const boundaryFailures = Array.from(new Set(decisions.flatMap((item) => item.boundaryFailures)));
    const now = this.dependencies.now();

    const updated = await this.rehash({
      ...simulation,
      state: "running",
      currentState: snapshot?.state ?? scenario.initialState,
      checkpointResponses: responses,
      decisions,
      boundaryFailures,
      score: snapshot?.score ?? calculateSimulationScore(scenario, decisions, boundaryFailures),
      completedAt: undefined,
      invalidatedAt: undefined,
      lastActivityAt: now,
    });

    await this.dependencies.simulationRepository.replace(updated);
    await this.emit("academy.simulation.reset", updated, command.actor, command.authority, command.correlationId, command.idempotencyKey, simulation.state, "running");
    return updated;
  }

  async complete(command: CompleteSimulationCommand): Promise<AcademySimulationRecord> {
    const simulation = await this.requireSimulation(command.simulationId);
    assertSimulationTransition(simulation.state, "completed");
    const scenario = await this.requireScenario(simulation.scenarioId, simulation.scenarioVersion);
    const evaluation = evaluateSimulationCompletion(scenario, simulation);
    if (!evaluation.complete) {
      throw new SimulationContractValidationError("Simulation completion requirements were not met.", evaluation.issues);
    }

    const now = this.dependencies.now();
    const updated = await this.rehash({
      ...simulation,
      state: "completed",
      completedAt: now,
      lastActivityAt: now,
    });
    await this.dependencies.simulationRepository.replace(updated);
    await this.emit("academy.simulation.completed", updated, command.actor, command.authority, command.correlationId, command.idempotencyKey, simulation.state, "completed");
    return updated;
  }

  async invalidate(command: InvalidateSimulationCommand): Promise<AcademySimulationRecord> {
    const simulation = await this.requireSimulation(command.simulationId);
    assertSimulationTransition(simulation.state, "invalid");
    const now = this.dependencies.now();
    const updated = await this.rehash({
      ...simulation,
      state: "invalid",
      retentionState: "invalidated",
      invalidatedAt: now,
      lastActivityAt: now,
      boundaryFailures: Array.from(new Set([...simulation.boundaryFailures, command.reason])),
    });
    await this.dependencies.simulationRepository.replace(updated);
    await this.emit("academy.simulation.invalidated", updated, command.actor, command.authority, command.correlationId, command.idempotencyKey, simulation.state, "invalid");
    return updated;
  }

  async export(command: ExportSimulationCommand): Promise<SimulationExportPackage> {
    const simulation = await this.requireSimulation(command.simulationId);
    const scenario = await this.requireScenario(simulation.scenarioId, simulation.scenarioVersion);
    assertSimulationExportAllowed(scenario, command);

    const generatedAt = this.dependencies.now();
    const body: SimulationExportBody = {
      marker: TA14_SIMULATION_MARKER,
      nonRelianceNotice: TA14_SIMULATION_NON_RELIANCE_NOTICE,
      simulationId: simulation.simulationId,
      scenarioId: simulation.scenarioId,
      scenarioVersion: simulation.scenarioVersion,
      lessonId: simulation.lessonId,
      lessonVersion: simulation.lessonVersion,
      state: simulation.state,
      score: scenario.exportPolicy.includeScores ? simulation.score : undefined,
      checkpointResponses: scenario.exportPolicy.includeInputs ? simulation.checkpointResponses : undefined,
      decisions: scenario.exportPolicy.includeDecisions ? simulation.decisions : undefined,
      instructorFeedback:
        command.includeInstructorFeedback && scenario.exportPolicy.includeInstructorFeedback
          ? simulation.instructorFeedback
          : undefined,
      limitations: [
        TA14_SIMULATION_BOUNDARY,
        ...scenario.handoffPolicy.enabled
          ? ["Reviewed input handoff does not transfer simulation decisions, scores, or outcomes."]
          : [],
      ],
    };

    const integrityHash = await this.dependencies.hashCanonicalValue(body as unknown as JsonValue);
    return deepFreeze({
      exportId: this.dependencies.createId("TA14-SIM-EXPORT"),
      simulationId: simulation.simulationId,
      format: command.format,
      generatedAt,
      projection: command.projection,
      watermark: TA14_SIMULATION_MARKER,
      nonRelianceNotice: TA14_SIMULATION_NON_RELIANCE_NOTICE,
      body,
      integrityHash,
    });
  }

  async createHandoff(
    command: CreateHandoffCommand,
  ): Promise<SimulationToLiveHandoffRequest> {
    const existing = await this.dependencies.handoffRepository.getByIdempotencyKey(command.idempotencyKey);
    if (existing) return existing;

    const simulation = await this.requireSimulation(command.simulationId);
    const scenario = await this.requireScenario(simulation.scenarioId, simulation.scenarioVersion);
    assertHandoffAllowed(scenario, command);

    const handoff: SimulationToLiveHandoffRequest = deepFreeze({
      handoffId: this.dependencies.createId("TA14-SIM-HANDOFF"),
      simulationId: simulation.simulationId,
      scenarioId: simulation.scenarioId,
      scenarioVersion: simulation.scenarioVersion,
      targetRecordId: command.targetRecordId,
      targetRecordType: command.targetRecordType,
      requestedFields: command.requestedFields,
      sourceClassification: inferSourceClassification(scenario.evidenceItems),
      requestedBy: command.requestedBy,
      requestedAt: this.dependencies.now(),
      state: "ready",
      limitations: [
        "Only copied inputs may be considered for live use.",
        "Simulation decisions, scores, and outcomes do not transfer.",
        "Every copied value must independently satisfy production evidence, permission, provenance, and authority requirements.",
      ],
      correlationId: command.correlationId,
      idempotencyKey: command.idempotencyKey,
    });

    await this.dependencies.handoffRepository.create(handoff);
    await this.emitHandoff("academy.handoff.requested", handoff, command.actor, command.authority, command.correlationId, command.idempotencyKey, null, "ready");
    return handoff;
  }

  private async requireSimulation(
    simulationId: InstitutionalIdentifier,
  ): Promise<AcademySimulationRecord> {
    const simulation = await this.dependencies.simulationRepository.getById(simulationId);
    if (!simulation) throw new Error(`Simulation ${simulationId} was not found.`);
    return simulation;
  }

  private async requireScenario(
    scenarioId: InstitutionalIdentifier,
    version: string,
  ): Promise<SimulationScenarioDefinition> {
    const scenario = await this.dependencies.scenarioRepository.getById(scenarioId, version);
    if (!scenario) throw new Error(`Scenario ${scenarioId}@${version} was not found.`);
    return scenario;
  }

  private async rehash(
    input: Omit<AcademySimulationRecord, "integrityHash"> & { readonly integrityHash?: ContentHash },
  ): Promise<AcademySimulationRecord> {
    const { integrityHash: _previousHash, ...unsigned } = input;
    const integrityHash = await this.dependencies.hashCanonicalValue(unsigned as unknown as JsonValue);
    const record = deepFreeze({ ...unsigned, integrityHash });
    const validation = validateAcademySimulationRecord(record);
    if (!validation.ok) {
      throw new SimulationContractValidationError("Updated simulation failed validation.", validation.issues as readonly SimulationValidationIssue[]);
    }
    return record;
  }

  private async emit(
    eventType: ExtendedAcademyEventType,
    simulation: AcademySimulationRecord,
    actor: AcademyEventActor,
    authority: AcademyEventAuthority,
    correlationId: CorrelationIdentifier,
    idempotencyKey: IdempotencyKey,
    priorState: string | null,
    newState: string | null,
  ): Promise<void> {
    if (!this.dependencies.eventService) return;
    const record: AcademyEventRecordRef = {
      recordId: simulation.simulationId,
      recordType: "academy_simulation",
      recordVersion: simulation.scenarioVersion,
    };
    await this.dependencies.eventService.emit({
      eventType,
      actor,
      authority,
      record,
      priorState,
      newState,
      correlationId,
      idempotencyKey,
      payload: {
        simulationId: simulation.simulationId,
        scenarioId: simulation.scenarioId,
        scenarioVersion: simulation.scenarioVersion,
        state: simulation.state,
        marker: TA14_SIMULATION_MARKER,
        createsProductionEffect: false,
        createsRegistryEffect: false,
        createsArtifactEffect: false,
        createsAuthorityEffect: false,
      },
      projection: {
        visibility: "controlled",
        protectedPayloadPaths: ["simulationId"],
        publicSummary: "A TA-14 Academy simulation changed state with no production effect.",
      },
    });
  }

  private async emitHandoff(
    eventType: ExtendedAcademyEventType,
    handoff: SimulationToLiveHandoffRequest,
    actor: AcademyEventActor,
    authority: AcademyEventAuthority,
    correlationId: CorrelationIdentifier,
    idempotencyKey: IdempotencyKey,
    priorState: string | null,
    newState: string | null,
  ): Promise<void> {
    if (!this.dependencies.eventService) return;
    await this.dependencies.eventService.emit({
      eventType,
      actor,
      authority,
      record: {
        recordId: handoff.handoffId,
        recordType: "academy_simulation",
      },
      priorState,
      newState,
      correlationId,
      idempotencyKey,
      payload: {
        handoffId: handoff.handoffId,
        simulationId: handoff.simulationId,
        targetRecordId: handoff.targetRecordId ?? null,
        targetRecordType: handoff.targetRecordType,
        requestedFields: handoff.requestedFields.map((field) => field.sourcePath),
        decisionTransferred: false,
        scoreTransferred: false,
        outcomeTransferred: false,
      },
      projection: {
        visibility: "controlled",
        protectedPayloadPaths: ["targetRecordId", "requestedFields"],
        publicSummary: "A reviewed simulation-to-live input handoff changed state.",
      },
    });
  }
}

/* ========================================================================== *
 * Evaluation helpers
 * ========================================================================== */

export interface SimulationCompletionEvaluation {
  readonly complete: boolean;
  readonly matchedRuleIds: readonly string[];
  readonly issues: readonly SimulationValidationIssue[];
}

export function evaluateSimulationCompletion(
  scenario: SimulationScenarioDefinition,
  simulation: AcademySimulationRecord,
): SimulationCompletionEvaluation {
  const issues: SimulationValidationIssue[] = [];
  const matchedRuleIds: string[] = [];
  const completedCheckpointIds = new Set(simulation.checkpointResponses.filter((item) => item.valid).map((item) => item.checkpointId));

  for (const rule of scenario.completionRules) {
    const missing = rule.requiredCheckpointIds.filter((id) => !completedCheckpointIds.has(id));
    const scorePass = rule.minimumScore === undefined || simulation.score.current >= rule.minimumScore;
    const prohibited = simulation.boundaryFailures.filter((failure) => rule.prohibitedBoundaryFailures.includes(failure));

    if (missing.length === 0 && scorePass && prohibited.length === 0) {
      matchedRuleIds.push(rule.ruleId);
    } else {
      if (missing.length > 0) {
        pushIssue(issues, "$.checkpointResponses", "invalid_checkpoint", `Missing required checkpoints: ${missing.join(", ")}.`, missing);
      }
      if (!scorePass) {
        pushIssue(issues, "$.score.current", "invalid_value", `Score ${simulation.score.current} is below ${rule.minimumScore}.`, simulation.score.current);
      }
      if (prohibited.length > 0) {
        pushIssue(issues, "$.boundaryFailures", "invalid_value", `Prohibited boundary failures: ${prohibited.join(", ")}.`, prohibited);
      }
    }
  }

  return {
    complete: matchedRuleIds.length > 0 && issues.length === 0,
    matchedRuleIds,
    issues,
  };
}

export function calculateSimulationScore(
  scenario: SimulationScenarioDefinition,
  decisions: readonly SimulationDecision[],
  boundaryFailures: readonly string[],
): SimulationScore {
  const maximum = Math.max(1, scenario.scoringPolicy.maximumScore);
  const raw = decisions.reduce((sum, decision) => sum + decision.scoreAdjustment, 0);
  const current = Math.max(0, Math.min(maximum, raw));
  const boundaryFailureOverride = scenario.scoringPolicy.boundaryFailureOverridesScore && boundaryFailures.length > 0;
  const passingScore = scenario.scoringPolicy.passingScore ?? maximum;
  const passing = !boundaryFailureOverride && current >= passingScore;
  return deepFreeze({
    current,
    maximum,
    percentage: Math.round((current / maximum) * 100),
    passing,
    boundaryFailureOverride,
    assessmentEligible: scenario.scoringPolicy.enabled,
    credentialEligibilityEvidenceOnly: true,
    authorityCreated: false,
  });
}

export function resolveSimulationBranch(
  scenario: SimulationScenarioDefinition,
  checkpoint: SimulationCheckpoint,
  value: JsonValue,
  selectedEvidenceIds: readonly string[],
  authorityProfileId?: string,
): SimulationBranch | null {
  const context: Record<string, JsonValue> = {
    response: value,
    selectedEvidenceIds: [...selectedEvidenceIds],
    authorityProfileId: authorityProfileId ?? null,
  };

  return scenario.branches.find((branch) =>
    branch.checkpointId === checkpoint.checkpointId &&
    branch.conditions.every((condition) => evaluateCondition(context, condition)),
  ) ?? null;
}

function evaluateCondition(
  context: Record<string, JsonValue>,
  condition: SimulationBranchCondition,
): boolean {
  const actual = getPath(context, condition.field);
  const expected = condition.value;
  switch (condition.operator) {
    case "equals": return deepEqual(actual, expected);
    case "not_equals": return !deepEqual(actual, expected);
    case "exists": return actual !== undefined && actual !== null;
    case "not_exists": return actual === undefined || actual === null;
    case "includes": return Array.isArray(actual) && actual.some((item) => deepEqual(item, expected));
    case "excludes": return Array.isArray(actual) && !actual.some((item) => deepEqual(item, expected));
    case "greater_than": return typeof actual === "number" && typeof expected === "number" && actual > expected;
    case "greater_than_or_equal": return typeof actual === "number" && typeof expected === "number" && actual >= expected;
    case "less_than": return typeof actual === "number" && typeof expected === "number" && actual < expected;
    case "less_than_or_equal": return typeof actual === "number" && typeof expected === "number" && actual <= expected;
    case "in": return Array.isArray(expected) && expected.some((item) => deepEqual(item, actual));
    case "not_in": return Array.isArray(expected) && !expected.some((item) => deepEqual(item, actual));
    default: return false;
  }
}

function validateCheckpointResponse(
  checkpoint: SimulationCheckpoint,
  command: SubmitCheckpointCommand,
): string[] {
  const messages: string[] = [];
  if (checkpoint.requiredEvidenceIds?.length) {
    const selected = new Set(command.selectedEvidenceIds ?? []);
    const missing = checkpoint.requiredEvidenceIds.filter((id) => !selected.has(id));
    if (missing.length) messages.push(`Missing required evidence: ${missing.join(", ")}.`);
  }
  if (checkpoint.permittedAuthorityProfileIds?.length && command.authorityProfileId && !checkpoint.permittedAuthorityProfileIds.includes(command.authorityProfileId)) {
    messages.push("Selected simulated authority profile is not permitted for this checkpoint.");
  }
  return messages;
}

function nextCheckpointAfter(
  scenario: SimulationScenarioDefinition,
  checkpointId: string,
): string | undefined {
  const ordered = [...scenario.checkpoints].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((item) => item.checkpointId === checkpointId);
  return index >= 0 ? ordered[index + 1]?.checkpointId : undefined;
}

export function assertSimulationTransition(
  prior: SimulationState,
  next: SimulationState,
): void {
  const allowed: Readonly<Record<SimulationState, readonly SimulationState[]>> = {
    draft: ["running", "invalid", "archived"],
    running: ["completed", "invalid", "archived"],
    completed: ["running", "archived", "invalid"],
    invalid: ["archived"],
    archived: [],
  };
  if (!allowed[prior].includes(next)) {
    throw new Error(`Simulation transition ${prior} -> ${next} is not permitted.`);
  }
}

function assertSimulationExportAllowed(
  scenario: SimulationScenarioDefinition,
  command: ExportSimulationCommand,
): void {
  if (!scenario.exportPolicy.allowed) throw new Error("Simulation export is not allowed.");
  if (!scenario.exportPolicy.formats.includes(command.format)) throw new Error(`Export format ${command.format} is not allowed.`);
  if (!scenario.exportPolicy.permittedRoles.includes(command.requestedByRole)) throw new Error(`Role ${command.requestedByRole} may not export this simulation.`);
  if (command.projection === "public" && !scenario.exportPolicy.publicSharingAllowed) throw new Error("Public sharing is not allowed.");
}

function assertHandoffAllowed(
  scenario: SimulationScenarioDefinition,
  command: CreateHandoffCommand,
): void {
  if (!scenario.handoffPolicy.enabled) throw new Error("Simulation-to-live handoff is disabled.");
  if (!scenario.handoffPolicy.allowedTargetRecordTypes.includes(command.targetRecordType)) throw new Error(`Target record type ${command.targetRecordType} is not allowed.`);
  if (command.requestedFields.length === 0) throw new Error("At least one copied input field is required.");
}

function inferSourceClassification(
  evidenceItems: readonly SimulationEvidenceItem[],
): SimulationDataClass {
  const order: readonly SimulationDataClass[] = ["controlled", "participant_approved", "redacted", "synthetic", "fictional"];
  return order.find((classification) => evidenceItems.some((item) => item.classification === classification)) ?? "fictional";
}

/* ========================================================================== *
 * Export records
 * ========================================================================== */

export interface SimulationExportBody {
  readonly marker: typeof TA14_SIMULATION_MARKER;
  readonly nonRelianceNotice: typeof TA14_SIMULATION_NON_RELIANCE_NOTICE;
  readonly simulationId: InstitutionalIdentifier;
  readonly scenarioId: InstitutionalIdentifier;
  readonly scenarioVersion: string;
  readonly lessonId: InstitutionalIdentifier;
  readonly lessonVersion: string;
  readonly state: SimulationState;
  readonly score?: SimulationScore;
  readonly checkpointResponses?: readonly SimulationCheckpointResponse[];
  readonly decisions?: readonly SimulationDecision[];
  readonly instructorFeedback?: readonly SimulationInstructorFeedback[];
  readonly limitations: readonly string[];
}

export interface SimulationExportPackage {
  readonly exportId: InstitutionalIdentifier;
  readonly simulationId: InstitutionalIdentifier;
  readonly format: SimulationExportFormat;
  readonly generatedAt: ISODateTimeString;
  readonly projection: ProjectionClass;
  readonly watermark: typeof TA14_SIMULATION_MARKER;
  readonly nonRelianceNotice: typeof TA14_SIMULATION_NON_RELIANCE_NOTICE;
  readonly body: SimulationExportBody;
  readonly integrityHash: ContentHash;
}

/* ========================================================================== *
 * In-memory repositories
 * ========================================================================== */

export class InMemorySimulationScenarioRepository
  implements SimulationScenarioRepository {
  private readonly scenarios = new Map<string, SimulationScenarioDefinition>();

  async getById(
    scenarioId: InstitutionalIdentifier,
    version?: string,
  ): Promise<SimulationScenarioDefinition | null> {
    if (version) return this.scenarios.get(`${scenarioId}@${version}`) ?? null;
    const matches = [...this.scenarios.values()].filter((item) => item.scenarioId === scenarioId && item.publicationState === "active");
    matches.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
    return matches[0] ?? null;
  }

  async listActive(): Promise<readonly SimulationScenarioDefinition[]> {
    return deepFreeze([...this.scenarios.values()].filter((item) => item.publicationState === "active"));
  }

  async save(scenario: SimulationScenarioDefinition): Promise<void> {
    const validation = validateSimulationScenario(scenario);
    if (!validation.ok) throw new SimulationContractValidationError("Scenario failed validation.", validation.issues as readonly SimulationValidationIssue[]);
    this.scenarios.set(`${scenario.scenarioId}@${scenario.version}`, deepFreeze(scenario));
  }
}

export class InMemoryAcademySimulationRepository
  implements AcademySimulationRepository {
  private readonly simulations = new Map<InstitutionalIdentifier, AcademySimulationRecord>();
  private readonly idempotency = new Map<IdempotencyKey, InstitutionalIdentifier>();

  async getById(simulationId: InstitutionalIdentifier): Promise<AcademySimulationRecord | null> {
    return this.simulations.get(simulationId) ?? null;
  }

  async getByIdempotencyKey(idempotencyKey: IdempotencyKey): Promise<AcademySimulationRecord | null> {
    const id = this.idempotency.get(idempotencyKey);
    return id ? this.simulations.get(id) ?? null : null;
  }

  async create(simulation: AcademySimulationRecord, idempotencyKey: IdempotencyKey): Promise<AcademySimulationRecord> {
    const existing = await this.getByIdempotencyKey(idempotencyKey);
    if (existing) return existing;
    if (this.simulations.has(simulation.simulationId)) throw new Error(`Simulation ${simulation.simulationId} already exists.`);
    this.simulations.set(simulation.simulationId, deepFreeze(simulation));
    this.idempotency.set(idempotencyKey, simulation.simulationId);
    return simulation;
  }

  async replace(simulation: AcademySimulationRecord): Promise<AcademySimulationRecord> {
    if (!this.simulations.has(simulation.simulationId)) throw new Error(`Simulation ${simulation.simulationId} does not exist.`);
    this.simulations.set(simulation.simulationId, deepFreeze(simulation));
    return simulation;
  }

  async query(query: AcademySimulationQuery): Promise<AcademySimulationPage> {
    let values = [...this.simulations.values()];
    if (query.simulationIds?.length) { const set = new Set(query.simulationIds); values = values.filter((item) => set.has(item.simulationId)); }
    if (query.scenarioIds?.length) { const set = new Set(query.scenarioIds); values = values.filter((item) => set.has(item.scenarioId)); }
    if (query.lessonIds?.length) { const set = new Set(query.lessonIds); values = values.filter((item) => set.has(item.lessonId)); }
    if (query.ownerSubjectIds?.length) { const set = new Set(query.ownerSubjectIds); values = values.filter((item) => set.has(item.ownerSubjectId)); }
    if (query.organizationIds?.length) { const set = new Set(query.organizationIds); values = values.filter((item) => item.organizationId ? set.has(item.organizationId) : false); }
    if (query.states?.length) { const set = new Set(query.states); values = values.filter((item) => set.has(item.state)); }
    if (query.modes?.length) { const set = new Set(query.modes); values = values.filter((item) => set.has(item.mode)); }
    if (query.from) values = values.filter((item) => Date.parse(item.createdAt) >= Date.parse(query.from!));
    if (query.to) values = values.filter((item) => Date.parse(item.createdAt) <= Date.parse(query.to!));
    values.sort((a, b) => Date.parse(b.lastActivityAt) - Date.parse(a.lastActivityAt));
    const offset = decodeCursor(query.cursor);
    const limit = normalizeLimit(query.limit);
    const page = values.slice(offset, offset + limit);
    return { simulations: deepFreeze(page), nextCursor: offset + page.length < values.length ? String(offset + page.length) : undefined, total: values.length };
  }
}

export class InMemorySimulationHandoffRepository
  implements SimulationHandoffRepository {
  private readonly handoffs = new Map<InstitutionalIdentifier, SimulationToLiveHandoffRequest>();
  private readonly idempotency = new Map<IdempotencyKey, InstitutionalIdentifier>();
  private readonly reviews = new Map<InstitutionalIdentifier, SimulationToLiveHandoffReview[]>();

  async getById(handoffId: InstitutionalIdentifier): Promise<SimulationToLiveHandoffRequest | null> {
    return this.handoffs.get(handoffId) ?? null;
  }

  async getByIdempotencyKey(idempotencyKey: IdempotencyKey): Promise<SimulationToLiveHandoffRequest | null> {
    const id = this.idempotency.get(idempotencyKey);
    return id ? this.handoffs.get(id) ?? null : null;
  }

  async create(handoff: SimulationToLiveHandoffRequest): Promise<SimulationToLiveHandoffRequest> {
    const existing = await this.getByIdempotencyKey(handoff.idempotencyKey);
    if (existing) return existing;
    this.handoffs.set(handoff.handoffId, deepFreeze(handoff));
    this.idempotency.set(handoff.idempotencyKey, handoff.handoffId);
    return handoff;
  }

  async replace(handoff: SimulationToLiveHandoffRequest): Promise<SimulationToLiveHandoffRequest> {
    if (!this.handoffs.has(handoff.handoffId)) throw new Error(`Handoff ${handoff.handoffId} does not exist.`);
    this.handoffs.set(handoff.handoffId, deepFreeze(handoff));
    return handoff;
  }

  async addReview(review: SimulationToLiveHandoffReview): Promise<void> {
    const list = this.reviews.get(review.handoffId) ?? [];
    this.reviews.set(review.handoffId, [...list, deepFreeze(review)]);
  }

  async getReviews(handoffId: InstitutionalIdentifier): Promise<readonly SimulationToLiveHandoffReview[]> {
    return deepFreeze(this.reviews.get(handoffId) ?? []);
  }
}

/* ========================================================================== *
 * Canonical scenario example
 * ========================================================================== */

export const GOVERNANCE_ENTITY_REGISTRATION_SIMULATION_SCENARIO:
  SimulationScenarioDefinition = deepFreeze({
    scenarioId: "TA14-SIM-SCENARIO-ENTITY-REG-001",
    version: "3.0",
    title: "Practice Governance Entity Registration",
    summary: "Practice creating a bounded governance entity registration using fictional data without creating a Registry record or production effect.",
    lessonId: "TA14-ACD-LESSON-000003",
    lessonVersion: "3.0",
    division: "ai-governance-exchange",
    mode: "individual",
    difficulty: "foundational",
    supportedRoles: ["participant", "registered_participant", "entity_steward"],
    participantRoles: ["learner", "instructor"],
    recordTypes: ["governance_entity", "governance_registration"],
    learningObjectives: [
      "Distinguish free registration from substantive review.",
      "Declare identity, architecture, claims, non-claims, versions, and evidence references.",
      "Recognize when incomplete or unsupported information requires correction rather than registration issuance.",
    ],
    institutionalBasis: ["registry.identity_rule", "artifact.registration_prerequisite", "commercial.free_registration_boundary"],
    prerequisites: [
      {
        prerequisiteId: "SIM-REG-PREQ-001",
        title: "Registration lesson opened",
        description: "The learner should review the governance registration lesson before beginning practice.",
        type: "lesson",
        enforcement: "recommended",
        referencedObjectId: "TA14-ACD-LESSON-000003",
        failureMessage: "Open the registration lesson before continuing.",
      },
    ],
    initialState: {
      stageId: "orientation",
      checkpointId: "SIM-REG-CP-001",
      values: {},
      visibleEvidenceIds: ["SIM-EVID-001", "SIM-EVID-002"],
      activeAuthorityProfileIds: ["SIM-AUTH-ENTITY-STEWARD"],
      elapsedSeconds: 0,
      attemptCount: 0,
      warnings: [TA14_SIMULATION_NON_RELIANCE_NOTICE],
    },
    evidenceItems: [
      {
        evidenceId: "SIM-EVID-001",
        title: "Fictional Zenodo record",
        description: "A fictional DOI and Zenodo-style publication reference.",
        classification: "fictional",
        provenance: "TA-14 Academy synthetic scenario generator",
        version: "1.0",
        current: true,
        permitted: true,
        relevantTo: ["architecture_declaration"],
        limitations: ["Fictional; no production evidentiary effect."],
        payload: { doi: "10.0000/fictional.ta14.001", title: "Fictional Governance Architecture" } as JsonValue,
      },
      {
        evidenceId: "SIM-EVID-002",
        title: "Fictional repository reference",
        description: "A synthetic source repository reference.",
        classification: "synthetic",
        provenance: "TA-14 Academy",
        version: "1.0",
        current: true,
        permitted: true,
        relevantTo: ["capability_declaration"],
        limitations: ["Synthetic; no production evidentiary effect."],
        payload: { repository: "example.invalid/fictional-governance" } as JsonValue,
      },
    ],
    authorityProfiles: [
      {
        authorityProfileId: "SIM-AUTH-ENTITY-STEWARD",
        title: "Simulated Entity Steward",
        holderRole: "entity_steward",
        scope: ["prepare_simulated_registration"],
        restrictions: ["May not issue registration", "May not create production authority"],
        active: true,
        simulatedOnly: true,
        createsProductionAuthority: false,
      },
    ],
    checkpoints: [
      {
        checkpointId: "SIM-REG-CP-001",
        order: 1,
        type: "orientation",
        title: "Acknowledge the simulation boundary",
        prompt: "Confirm that this exercise creates no production, Registry, artifact, or authority effect.",
        instructions: ["Read the marker and non-reliance notice.", "Acknowledge before continuing."],
        requiredResponseType: "acknowledgement",
        blocking: true,
      },
      {
        checkpointId: "SIM-REG-CP-002",
        order: 2,
        type: "evidence_boundary",
        title: "Classify the supporting references",
        prompt: "Select the fictional references permitted for this practice registration.",
        instructions: ["Check provenance.", "Check permission.", "Check version relevance."],
        requiredResponseType: "evidence_selection",
        requiredEvidenceIds: ["SIM-EVID-001", "SIM-EVID-002"],
        blocking: true,
      },
      {
        checkpointId: "SIM-REG-CP-003",
        order: 3,
        type: "decision",
        title: "Determine technical completeness",
        prompt: "Is the fictional registration technically complete for simulated issuance?",
        instructions: ["Evaluate identity, stewardship, architecture, claims, non-claims, version, and references."],
        requiredResponseType: "decision",
        options: [
          { optionId: "complete", label: "Technically complete", value: "technically_complete" },
          { optionId: "correct", label: "Return for correction", value: "returned_for_correction" },
        ],
        permittedAuthorityProfileIds: ["SIM-AUTH-ENTITY-STEWARD"],
        blocking: true,
      },
      {
        checkpointId: "SIM-REG-CP-004",
        order: 4,
        type: "reflection",
        title: "Explain the institutional boundary",
        prompt: "Explain why simulated technical completeness is not review, endorsement, verification, certification, or authority.",
        instructions: ["State the registration boundary in your own words."],
        requiredResponseType: "text",
        blocking: true,
      },
    ],
    branches: [
      {
        branchId: "SIM-REG-BR-001",
        checkpointId: "SIM-REG-CP-001",
        conditions: [{ field: "response", operator: "equals", value: true }],
        result: "continue",
        explanation: "The learner acknowledged the non-production boundary.",
        nextCheckpointId: "SIM-REG-CP-002",
        scoreAdjustment: 20,
        boundaryFailures: [],
        learningFeedback: ["Boundary acknowledged."],
        createsProductionEffect: false,
      },
      {
        branchId: "SIM-REG-BR-002",
        checkpointId: "SIM-REG-CP-003",
        conditions: [{ field: "response", operator: "equals", value: "technically_complete" }],
        result: "ALLOW",
        explanation: "The fictional record is technically complete within the simulation only.",
        nextCheckpointId: "SIM-REG-CP-004",
        scoreAdjustment: 40,
        boundaryFailures: [],
        learningFeedback: ["Technical completeness does not imply substantive review."],
        createsProductionEffect: false,
      },
      {
        branchId: "SIM-REG-BR-003",
        checkpointId: "SIM-REG-CP-003",
        conditions: [{ field: "response", operator: "equals", value: "returned_for_correction" }],
        result: "CORRECT",
        explanation: "The learner identified a correction route.",
        nextCheckpointId: "SIM-REG-CP-004",
        scoreAdjustment: 30,
        boundaryFailures: [],
        learningFeedback: ["Correction preserves the boundary when required information is incomplete."],
        createsProductionEffect: false,
      },
      {
        branchId: "SIM-REG-BR-004",
        checkpointId: "SIM-REG-CP-004",
        conditions: [{ field: "response", operator: "exists" }],
        result: "complete",
        explanation: "The learner articulated the registration boundary.",
        scoreAdjustment: 40,
        boundaryFailures: [],
        learningFeedback: ["Registration remains distinct from review and authority."],
        createsProductionEffect: false,
      },
    ],
    completionRules: [
      {
        ruleId: "SIM-REG-COMP-001",
        title: "Registration practice complete",
        description: "All four checkpoints are completed without boundary failure.",
        requiredCheckpointIds: ["SIM-REG-CP-001", "SIM-REG-CP-002", "SIM-REG-CP-003", "SIM-REG-CP-004"],
        minimumScore: 80,
        prohibitedBoundaryFailures: ["claimed_production_effect", "claimed_authority_effect"],
        resultState: "completed",
        completionMessage: "Registration practice is complete.",
        failureMessage: "Complete the remaining checkpoints and correct boundary failures.",
      },
    ],
    scoringPolicy: {
      enabled: true,
      maximumScore: 100,
      passingScore: 80,
      assessmentStateOnPass: "passed",
      assessmentStateOnFail: "failed",
      boundaryFailureOverridesScore: true,
      scoreCreatesCredentialEligibilityOnly: true,
      scoreCreatesAuthority: false,
    },
    randomization: {
      strategy: "seeded",
      seedRequired: false,
      allowedVariantIds: ["default", "missing-jurisdiction", "stale-reference"],
      preservesLearningObjectives: true,
      preservesAuthorityBoundary: true,
      deterministicReplay: true,
    },
    exportPolicy: {
      allowed: true,
      formats: ["json", "pdf", "image"],
      permittedRoles: ["participant", "registered_participant", "entity_steward", "academy_instructor"],
      includeInputs: true,
      includeDecisions: true,
      includeScores: true,
      includeInstructorFeedback: true,
      watermarkRequired: true,
      nonRelianceNoticeRequired: true,
      publicSharingAllowed: false,
      protectedPaths: ["ownerSubjectId", "organizationId", "participantIds"],
    },
    retentionPolicy: {
      retentionDays: 365,
      retainInvalidatedRecords: true,
      retainEventHistory: true,
      deletionRequiresServiceRole: true,
      exportBeforeDeletionAllowed: true,
      legalHoldSupported: true,
    },
    handoffPolicy: {
      enabled: true,
      copiedInputsOnly: true,
      decisionMayTransfer: false,
      scoreMayTransfer: false,
      outcomeMayTransfer: false,
      productionValidationRequired: true,
      evidenceValidationRequired: true,
      permissionValidationRequired: true,
      authorityValidationRequired: true,
      provenanceValidationRequired: true,
      authorizedReviewerRoles: ["academy_instructor", "institutional_administrator", "service_role"],
      allowedTargetRecordTypes: ["governance_entity", "governance_registration"],
    },
    visibility: {
      projection: "authenticated",
      permittedRoles: ["participant", "registered_participant", "entity_steward", "academy_instructor"],
      organizationMatchRequired: false,
      protectedFields: ["participantIds", "instructorFeedback"],
      publicSafeSummary: "A fictional governance registration practice scenario.",
    },
    authorityBoundary: TA14_SIMULATION_BOUNDARY,
    persistentMarker: TA14_SIMULATION_MARKER,
    nonRelianceNotice: TA14_SIMULATION_NON_RELIANCE_NOTICE,
    contentHash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
    effectiveAt: "2026-08-04T00:00:00.000Z",
    publicationState: "active",
  });

/* ========================================================================== *
 * Deterministic dependencies and self-check
 * ========================================================================== */

export function createDeterministicSimulationDependencies(
  scenarioRepository = new InMemorySimulationScenarioRepository(),
  simulationRepository = new InMemoryAcademySimulationRepository(),
  handoffRepository = new InMemorySimulationHandoffRepository(),
  startAt = "2026-08-04T14:00:00.000Z",
): SimulationEngineDependencies {
  let counter = 0;
  return {
    now: () => new Date(Date.parse(startAt) + counter * 1000).toISOString(),
    createId: (prefix) => {
      counter += 1;
      return `${prefix}-${String(counter).padStart(6, "0")}`;
    },
    hashCanonicalValue: (value) => `sha256:${deterministicHex(stableStringify(value))}`,
    scenarioRepository,
    simulationRepository,
    handoffRepository,
  };
}

export interface SimulationEngineSelfCheck {
  readonly ok: boolean;
  readonly scenarioValid: boolean;
  readonly simulationCreated: boolean;
  readonly simulationStarted: boolean;
  readonly constitutionalBoundaryValid: boolean;
  readonly issueCount: number;
  readonly issues: readonly string[];
}

export async function runSimulationEngineSelfCheck(): Promise<SimulationEngineSelfCheck> {
  const issues: string[] = [];
  const dependencies = createDeterministicSimulationDependencies();
  await dependencies.scenarioRepository.save(GOVERNANCE_ENTITY_REGISTRATION_SIMULATION_SCENARIO);
  const scenarioValidation = validateSimulationScenario(GOVERNANCE_ENTITY_REGISTRATION_SIMULATION_SCENARIO);
  const engine = new AcademySimulationEngine(dependencies);
  const actor: AcademyEventActor = { subjectId: "TA14-SUBJECT-TEST", role: "entity_steward", authenticated: true };
  const authority: AcademyEventAuthority = { basis: "academy.simulation.self_check", limitations: [TA14_SIMULATION_BOUNDARY] };
  const simulation = await engine.create({
    scenarioId: GOVERNANCE_ENTITY_REGISTRATION_SIMULATION_SCENARIO.scenarioId,
    ownerSubjectId: "TA14-SUBJECT-TEST",
    correlationId: "TA14-CORR-SIM-TEST",
    idempotencyKey: "sim-self-check:create",
    actor,
    authority,
  });
  const started = await engine.start({
    simulationId: simulation.simulationId,
    correlationId: "TA14-CORR-SIM-TEST",
    idempotencyKey: "sim-self-check:start",
    actor,
    authority,
  });
  const boundaryValid =
    !started.createsProductionEffect &&
    !started.createsRegistryEffect &&
    !started.createsArtifactEffect &&
    !started.createsAuthorityEffect &&
    started.persistentMarker === TA14_SIMULATION_MARKER;

  if (!scenarioValidation.ok) issues.push("Canonical scenario failed validation.");
  if (simulation.state !== "draft") issues.push("Simulation was not created in draft state.");
  if (started.state !== "running") issues.push("Simulation did not enter running state.");
  if (!boundaryValid) issues.push("Simulation constitutional boundary failed.");

  return {
    ok: issues.length === 0,
    scenarioValid: scenarioValidation.ok,
    simulationCreated: simulation.state === "draft",
    simulationStarted: started.state === "running",
    constitutionalBoundaryValid: boundaryValid,
    issueCount: issues.length,
    issues,
  };
}

/* ========================================================================== *
 * Utility helpers
 * ========================================================================== */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === "string" && allowed.includes(value as T[number]);
}

function isIsoDateTime(value: unknown): value is ISODateTimeString {
  return typeof value === "string" && value.includes("T") && Number.isFinite(Date.parse(value));
}

function isContentHash(value: unknown): value is ContentHash {
  return typeof value === "string" && /^sha256:[a-fA-F0-9]{64}$/.test(value);
}

function requireString(
  value: unknown,
  path: string,
  issues: SimulationValidationIssue[],
): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    pushIssue(issues, path, "required", `${path} must be a non-empty string.`, value);
  }
}

function validateStringArray(
  value: unknown,
  path: string,
  issues: SimulationValidationIssue[],
  nonEmpty = false,
): void {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    pushIssue(issues, path, "invalid_type", `${path} must be string[].`, value);
    return;
  }
  if (nonEmpty && value.length === 0) {
    pushIssue(issues, path, "required", `${path} must not be empty.`, value);
  }
}

function validateEnumArray(
  value: unknown,
  path: string,
  guard: (item: unknown) => boolean,
  issues: SimulationValidationIssue[],
  code: SimulationValidationCode,
): void {
  if (!Array.isArray(value)) {
    pushIssue(issues, path, "invalid_type", `${path} must be an array.`, value);
    return;
  }
  value.forEach((item, index) => {
    if (!guard(item)) pushIssue(issues, `${path}[${index}]`, code, "Unsupported value.", item);
  });
}

function pushIssue(
  issues: SimulationValidationIssue[],
  path: string,
  code: SimulationValidationCode,
  message: string,
  received: unknown,
): void {
  issues.push({ path, code, message, severity: "error", received });
}

function invalidRoot(
  message: string,
  received: unknown,
): SimulationValidationResult<never> {
  return {
    ok: false,
    issues: [{ path: "$", code: "invalid_type", message, severity: "error", received } satisfies SimulationValidationIssue],
  };
}

function getPath(value: JsonValue, path: string): JsonValue | undefined {
  const parts = path.split(".").filter(Boolean);
  let current: unknown = value;
  for (const part of parts) {
    if (!isObject(current) || !(part in current)) return undefined;
    current = current[part];
  }
  return current as JsonValue | undefined;
}

function deepEqual(a: unknown, b: unknown): boolean {
  return stableStringify(a as JsonValue) === stableStringify(b as JsonValue);
}

function stableStringify(value: JsonValue): string {
  return JSON.stringify(sortJson(value));
}

function sortJson(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(sortJson);
  if (isObject(value)) {
    const result: Record<string, JsonValue> = {};
    for (const key of Object.keys(value).sort()) result[key] = sortJson(value[key] as JsonValue);
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

function decodeCursor(cursor?: string): number {
  if (!cursor) return 0;
  const parsed = Number(cursor);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
}

function normalizeLimit(limit?: number): number {
  if (typeof limit !== "number" || !Number.isFinite(limit) || limit <= 0) return 100;
  return Math.min(Math.floor(limit), 1000);
}

const simulationContracts = {
  engineId: TA14_ACADEMY_SIMULATION_ENGINE_ID,
  engineVersion: TA14_ACADEMY_SIMULATION_ENGINE_VERSION,
  marker: TA14_SIMULATION_MARKER,
  boundary: TA14_SIMULATION_BOUNDARY,
  nonRelianceNotice: TA14_SIMULATION_NON_RELIANCE_NOTICE,
  validateSimulationScenario,
  validateAcademySimulationRecord,
  evaluateSimulationCompletion,
  calculateSimulationScore,
  resolveSimulationBranch,
  assertSimulationTransition,
  AcademySimulationEngine,
  InMemorySimulationScenarioRepository,
  InMemoryAcademySimulationRepository,
  InMemorySimulationHandoffRepository,
  GOVERNANCE_ENTITY_REGISTRATION_SIMULATION_SCENARIO,
  createDeterministicSimulationDependencies,
  runSimulationEngineSelfCheck,
};

export default simulationContracts;
