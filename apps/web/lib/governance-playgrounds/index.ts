/**
 * TA-14 Governance-Specific Playgrounds
 * Public module entry point
 *
 * Application pages and components should import from this file whenever
 * possible. Internal files may continue importing directly from neighboring
 * modules to avoid circular dependencies.
 */

export {
  ACTOR_ROLES,
  CHALLENGE_STATUSES,
  EVIDENCE_STATUSES,
  EVIDENCE_VISIBILITIES,
  FIELD_TYPES,
  GATE_REQUIREMENT_LEVELS,
  GATE_RESULT_STATUSES,
  GOVERNANCE_LANE_IDS,
  RECORD_CLASSES,
  RECORD_VISIBILITIES,
  ROUTE_DETERMINATIONS,
  ROUTE_LIFECYCLE_STATES,
  SCENARIO_CLASSES,
  SCENARIO_RUN_STATUSES,
  isGateResultStatus,
  isGovernanceLaneId,
  isRouteDetermination,
} from "./types";

export type {
  ActorId,
  ActorReference,
  ActorRole,
  ApplicabilityRule,
  AuditStamp,
  AuthorityDeclaration,
  BoundedDetermination,
  ChallengeId,
  ChallengeRecord,
  ChallengeStatus,
  CrossLaneHandoff,
  DeterminationInput,
  DeterminationOutput,
  DeterminationReason,
  EvaluationCondition,
  EvidenceId,
  EvidenceReference,
  EvidenceStatus,
  EvidenceVisibility,
  FailureInjection,
  GateDefinition,
  GateFinding,
  GateId,
  GateRequirementLevel,
  GateResult,
  GateResultStatus,
  GovernanceClaim,
  GovernanceLaneId,
  GovernanceRoute,
  ISODateTimeString,
  JsonValue,
  LaneDefinition,
  PlaygroundFieldDefinition,
  PlaygroundFieldOption,
  PlaygroundFieldType,
  PlaygroundRegistryEntry,
  PlaygroundSectionDefinition,
  PreservedRecord,
  Primitive,
  RecordClass,
  RecordId,
  RecordVisibility,
  RouteDetermination,
  RouteId,
  RouteLifecycleState,
  ScenarioClass,
  ScenarioDefinition,
  ScenarioId,
  ScenarioRun,
  ScenarioRunStatus,
  VersionStamp,
} from "./types";

export {
  ENABLED_GOVERNANCE_PLAYGROUNDS,
  ENABLED_SPECIALIZED_GOVERNANCE_PLAYGROUNDS,
  GOVERNANCE_PLAYGROUND_BASE_PATH,
  GOVERNANCE_PLAYGROUND_BY_LANE,
  GOVERNANCE_PLAYGROUND_REGISTRY,
  SPECIALIZED_GOVERNANCE_PLAYGROUNDS,
  getGovernancePlaygroundByLane,
  getGovernancePlaygroundBySlug,
  getGovernancePlaygroundHref,
  isGovernancePlaygroundEnabled,
} from "./registry";

export type {
  GovernancePlaygroundRegistryEntry,
} from "./registry";

export {
  SHARED_GATE_BY_ID,
  SHARED_GATE_DEFINITIONS,
  SHARED_GATE_IDS,
  getSharedGateDefinition,
} from "./gates";

export type {
  SharedGateDefinition,
  SharedGateId,
} from "./gates";

export {
  DETERMINATION_REASON_CODES,
  determineRouteOutcome,
  determinationRank,
  evaluateRouteOutcome,
  mostRestrictiveDetermination,
} from "./determine";

export type {
  DeterminationEvaluationDetail,
  DeterminationEvaluationOptions,
  DeterminationReasonCode,
} from "./determine";

export {
  ENABLED_IMPLEMENTED_GOVERNANCE_LANES,
  GOVERNANCE_LANE_CATALOG,
  IMPLEMENTED_GOVERNANCE_LANES,
  LANE_DEFINITION_BY_ID,
  LANE_DEFINITIONS,
  getLaneCatalogEntry,
  getLaneDefinition,
  isLaneAvailable,
  isLaneImplemented,
  requireLaneDefinition,
} from "./lanes";

export type {
  GovernanceLaneCatalogEntry,
  RegisteredLaneDefinition,
} from "./lanes";

export {
  RUNTIME_EXECUTION_EVIDENCE_TYPES,
  RUNTIME_EXECUTION_GATE_IDS,
  RUNTIME_EXECUTION_LANE,
  RUNTIME_EXECUTION_SCENARIOS,
  RUNTIME_EXECUTION_SECTIONS,
  getRuntimeExecutionScenario,
} from "./lanes/runtime-execution";

export type {
  RuntimeExecutionEvidenceType,
  RuntimeExecutionScenario,
} from "./lanes/runtime-execution";

export {
  assertValidLaneDefinition,
  validateLaneDefinition,
} from "./validate";

export type {
  ValidationIssue,
  ValidationResult,
  ValidationSeverity,
} from "./validate";

export {
  allRequiredScenarioRunsValid,
  verifyRequiredScenarioRuns,
  verifyScenarioRun,
} from "./scenario-verification";

export type {
  ScenarioVerificationIssue,
  ScenarioVerificationResult,
  ScenarioVerificationSeverity,
} from "./scenario-verification";

export {
  GOVERNANCE_DRAFT_SCHEMA_VERSION,
  GOVERNANCE_DRAFT_STORAGE_PREFIX,
  clearGovernanceDrafts,
  createGovernanceDraft,
  deleteGovernanceDraft,
  exportGovernanceDraft,
  importGovernanceDraft,
  listGovernanceDrafts,
  loadGovernanceDraft,
  saveGovernanceDraft,
} from "./draft-storage";

export type {
  GovernanceDraftImportResult,
  GovernanceDraftPayload,
  GovernanceDraftSummary,
} from "./draft-storage";

export {
  evaluateRouteReadiness,
} from "./route-readiness";

export type {
  RouteReadinessIssue,
  RouteReadinessResult,
  RouteReadinessStatus,
} from "./route-readiness";

export {
  SCENARIO_RUN_SCHEMA_VERSION,
  SCENARIO_RUN_STORAGE_PREFIX,
  clearStoredScenarioRuns,
  createStoredScenarioRun,
  deleteStoredScenarioRun,
  exportStoredScenarioRun,
  importStoredScenarioRun,
  listStoredScenarioRuns,
  loadStoredScenarioRun,
  saveStoredScenarioRun,
} from "./scenario-run-storage";

export type {
  CreateStoredScenarioRunInput,
  ScenarioRunImportResult,
  ScenarioRunSummary,
  StoredScenarioRun,
} from "./scenario-run-storage";

export {
  RUNTIME_TEST_SESSION_SCHEMA_VERSION,
  RUNTIME_TEST_SESSION_STORAGE_KEY,
  clearRuntimeTestSession,
  createRuntimeTestSession,
  exportRuntimeTestSession,
  loadRuntimeTestSession,
  saveRuntimeTestSession,
  selectRuntimeDraftForTesting,
  updateRuntimeTestSessionRoute,
} from "./runtime-test-session";

export type {
  RuntimeTestSession,
} from "./runtime-test-session";

export {
  countGateResultStatuses,
  determineFromGateResults,
  determineFromGateStatusMap,
} from "./scenario-determination";

export type {
  GateDeterminationContext,
  GateDeterminationOptions,
  GateDeterminationResult,
  GateStatusCount,
} from "./scenario-determination";

export {
  RUNTIME_EVIDENCE_SCHEMA_VERSION,
  RUNTIME_EVIDENCE_STORAGE_PREFIX,
  clearRuntimeEvidenceAttachments,
  createRuntimeEvidenceAttachment,
  deleteRuntimeEvidenceAttachment,
  exportRuntimeEvidenceAttachment,
  listRuntimeEvidenceAttachments,
  loadRuntimeEvidenceAttachment,
  saveRuntimeEvidenceAttachment,
  toEvidenceReference,
} from "./runtime-evidence-storage";

export type {
  CreateRuntimeEvidenceAttachmentInput,
  EvidenceRelationship,
  EvidenceSourceType,
  RuntimeEvidenceAttachment,
  RuntimeEvidenceSummary,
} from "./runtime-evidence-storage";

