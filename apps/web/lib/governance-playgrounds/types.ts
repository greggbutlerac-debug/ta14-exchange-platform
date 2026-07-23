/**
 * TA-14 Governance-Specific Playgrounds
 * Shared domain contracts
 *
 * This file is intentionally dependency-free. It defines the canonical
 * vocabulary used by every governance-specific playground, evaluator,
 * preserved record, challenge, correction, replay, and cross-lane handoff.
 *
 * Governing principle:
 * No admissible evidence. No admissible execution.
 */

export const GOVERNANCE_LANE_IDS = [
  "general",
  "runtime-execution",
  "model-evaluation",
  "data-provenance",
  "agent-tools",
  "decision",
  "human-oversight",
  "policy-controls",
  "risk",
  "compliance-regulatory",
  "security-third-party",
  "outcome-assurance",
] as const;

export type GovernanceLaneId = (typeof GOVERNANCE_LANE_IDS)[number];

export const ROUTE_DETERMINATIONS = [
  "ALLOW",
  "HOLD",
  "DENY",
  "ESCALATE",
] as const;

export type RouteDetermination = (typeof ROUTE_DETERMINATIONS)[number];

export const GATE_RESULT_STATUSES = [
  "PASS",
  "FAIL",
  "UNRESOLVED",
  "ESCALATED",
  "NOT_APPLICABLE",
  "NOT_TESTED",
] as const;

export type GateResultStatus = (typeof GATE_RESULT_STATUSES)[number];

export const GATE_REQUIREMENT_LEVELS = [
  "MANDATORY",
  "CONDITIONAL",
  "ADVISORY",
] as const;

export type GateRequirementLevel =
  (typeof GATE_REQUIREMENT_LEVELS)[number];

export const ROUTE_LIFECYCLE_STATES = [
  "DRAFT",
  "READY_FOR_TEST",
  "TESTING",
  "DETERMINED",
  "CHALLENGED",
  "CORRECTION_REQUIRED",
  "SUPERSEDED",
  "WITHDRAWN",
  "EXPIRED",
  "ARCHIVED",
] as const;

export type RouteLifecycleState = (typeof ROUTE_LIFECYCLE_STATES)[number];

export const RECORD_VISIBILITIES = [
  "PRIVATE",
  "SELECTIVE",
  "PUBLIC",
] as const;

export type RecordVisibility = (typeof RECORD_VISIBILITIES)[number];

export const RECORD_CLASSES = [
  "DECLARED_GOVERNANCE_CLAIM",
  "TEST_CONFIGURATION",
  "OBSERVED_TEST_RESULT",
  "TA14_BOUNDED_DETERMINATION",
] as const;

export type RecordClass = (typeof RECORD_CLASSES)[number];

export const EVIDENCE_STATUSES = [
  "DECLARED",
  "UPLOADED",
  "LINKED",
  "VERIFIED",
  "CONFLICTED",
  "EXPIRED",
  "REVOKED",
  "UNAVAILABLE",
] as const;

export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];

export const EVIDENCE_VISIBILITIES = [
  "OWNER_ONLY",
  "AUTHORIZED_REVIEWERS",
  "SELECTIVE",
  "PUBLIC",
] as const;

export type EvidenceVisibility = (typeof EVIDENCE_VISIBILITIES)[number];

export const SCENARIO_CLASSES = [
  "BASELINE",
  "SINGLE_FAILURE",
  "COMPOUND_FAILURE",
  "ADVERSARIAL",
  "RECOVERY",
  "POST_ALLOW_DRIFT",
  "EXECUTION_MISMATCH",
] as const;

export type ScenarioClass = (typeof SCENARIO_CLASSES)[number];

export const SCENARIO_RUN_STATUSES = [
  "NOT_STARTED",
  "RUNNING",
  "COMPLETED",
  "FAILED_TO_RUN",
  "CANCELLED",
] as const;

export type ScenarioRunStatus = (typeof SCENARIO_RUN_STATUSES)[number];

export const CHALLENGE_STATUSES = [
  "OPEN",
  "UNDER_REVIEW",
  "RESPONSE_REQUESTED",
  "COUNTEREVIDENCE_SUBMITTED",
  "RESOLVED",
  "REJECTED",
  "WITHDRAWN",
] as const;

export type ChallengeStatus = (typeof CHALLENGE_STATUSES)[number];

export const ACTOR_ROLES = [
  "ROUTE_OWNER",
  "COLLABORATOR",
  "AFFECTED_PARTY_REVIEWER",
  "INDEPENDENT_REVIEWER",
  "TA14_REVIEWER",
  "RULE_AUTHOR",
  "RELEASE_APPROVER",
  "RECORDS_CUSTODIAN",
  "ADMINISTRATOR",
  "PUBLIC_OBSERVER",
] as const;

export type ActorRole = (typeof ACTOR_ROLES)[number];

export const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "boolean",
  "date",
  "datetime",
  "select",
  "multiselect",
  "url",
  "email",
  "json",
] as const;

export type PlaygroundFieldType = (typeof FIELD_TYPES)[number];

export type ISODateTimeString = string;
export type RouteId = string;
export type GateId = string;
export type EvidenceId = string;
export type ScenarioId = string;
export type ActorId = string;
export type RecordId = string;
export type ChallengeId = string;

export type Primitive = string | number | boolean | null;
export type JsonValue =
  | Primitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface AuditStamp {
  createdAt: ISODateTimeString;
  createdBy: ActorId;
  updatedAt: ISODateTimeString;
  updatedBy: ActorId;
}

export interface VersionStamp {
  version: string;
  previousVersionId?: string;
  supersedesId?: string;
}

export interface ActorReference {
  actorId: ActorId;
  displayName: string;
  role: ActorRole;
  organization?: string;
}

export interface AuthorityDeclaration {
  authorityId: string;
  authorityType:
    | "LEGAL"
    | "CONTRACTUAL"
    | "ORGANIZATIONAL"
    | "DELEGATED"
    | "TECHNICAL"
    | "REGULATORY"
    | "OTHER";
  holder: ActorReference;
  scope: string;
  sourceEvidenceIds: readonly EvidenceId[];
  validFrom?: ISODateTimeString;
  validUntil?: ISODateTimeString;
  revokedAt?: ISODateTimeString;
  limitations: readonly string[];
}

export interface GovernanceClaim {
  claimId: string;
  routeId: RouteId;
  claimant: ActorReference;
  laneId: GovernanceLaneId;
  title: string;
  plainLanguageClaim: string;
  claimedControlLayers: readonly GovernanceLaneId[];
  claimedScope: readonly string[];
  explicitNonClaims: readonly string[];
  limitations: readonly string[];
  supportingEvidenceIds: readonly EvidenceId[];
  status: "ACTIVE" | "SUPERSEDED" | "DISPUTED" | "WITHDRAWN";
  audit: AuditStamp;
  version: VersionStamp;
}

export interface EvidenceReference {
  evidenceId: EvidenceId;
  routeId: RouteId;
  title: string;
  description?: string;
  evidenceType: string;
  status: EvidenceStatus;
  visibility: EvidenceVisibility;
  sourceUri?: string;
  storagePath?: string;
  contentHash?: string;
  mediaType?: string;
  issuedBy?: string;
  issuedAt?: ISODateTimeString;
  validFrom?: ISODateTimeString;
  validUntil?: ISODateTimeString;
  collectedAt?: ISODateTimeString;
  transformedFromEvidenceId?: EvidenceId;
  transformationDescription?: string;
  custodyNotes?: readonly string[];
  rightsDeclaration?: string;
  conflictsWithEvidenceIds?: readonly EvidenceId[];
  metadata?: Record<string, JsonValue>;
  audit: AuditStamp;
}

export interface ApplicabilityRule {
  ruleId: string;
  description: string;
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "includes"
    | "not_includes"
    | "exists"
    | "not_exists"
    | "greater_than"
    | "less_than";
  expected?: JsonValue;
}

export interface EvaluationCondition {
  conditionId: string;
  description: string;
  source:
    | "ROUTE_FIELD"
    | "EVIDENCE"
    | "AUTHORITY"
    | "SCENARIO"
    | "PRIOR_GATE"
    | "REVIEWER_FINDING"
    | "SYSTEM_STATE";
  field?: string;
  operator:
    | "equals"
    | "not_equals"
    | "includes"
    | "exists"
    | "not_exists"
    | "valid"
    | "expired"
    | "conflicted"
    | "verified"
    | "within_scope"
    | "outside_scope";
  expected?: JsonValue;
  evidenceType?: string;
  relatedGateId?: GateId;
}

export interface GateDefinition {
  gateId: GateId;
  order: number;
  title: string;
  shortTitle: string;
  purpose: string;
  requirementLevel: GateRequirementLevel;
  applicableLanes: readonly GovernanceLaneId[];
  applicabilityRules: readonly ApplicabilityRule[];
  requiredFieldKeys: readonly string[];
  requiredEvidenceTypes: readonly string[];
  dependencies: readonly GateId[];
  passConditions: readonly EvaluationCondition[];
  failConditions: readonly EvaluationCondition[];
  escalationConditions: readonly EvaluationCondition[];
  outputClaims: readonly string[];
  prohibitedClaims: readonly string[];
  remediationGuidance: readonly string[];
}

export interface GateFinding {
  findingId: string;
  severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
  evidenceIds: readonly EvidenceId[];
  affectedFieldKeys: readonly string[];
  remediation?: string;
}

export interface GateResult {
  gateId: GateId;
  status: GateResultStatus;
  requirementLevel: GateRequirementLevel;
  summary: string;
  findings: readonly GateFinding[];
  supportingEvidenceIds: readonly EvidenceId[];
  conflictingEvidenceIds: readonly EvidenceId[];
  evaluatedAt: ISODateTimeString;
  evaluatedBy: ActorReference | { system: "TA14_EVALUATOR" };
  evaluatorVersion: string;
}

export interface PlaygroundFieldOption {
  value: string;
  label: string;
  description?: string;
}

export interface PlaygroundFieldDefinition {
  key: string;
  label: string;
  description?: string;
  type: PlaygroundFieldType;
  required: boolean;
  placeholder?: string;
  defaultValue?: JsonValue;
  options?: readonly PlaygroundFieldOption[];
  appliesWhen?: readonly ApplicabilityRule[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    pattern?: string;
  };
}

export interface PlaygroundSectionDefinition {
  sectionId: string;
  title: string;
  description: string;
  order: number;
  fields: readonly PlaygroundFieldDefinition[];
}

export interface FailureInjection {
  injectionId: string;
  title: string;
  description: string;
  mutationType:
    | "REMOVE_EVIDENCE"
    | "EXPIRE_EVIDENCE"
    | "REVOKE_AUTHORITY"
    | "ALTER_ROUTE_FIELD"
    | "CHANGE_MODEL"
    | "CHANGE_DATA"
    | "CHANGE_TOOL"
    | "BLOCK_HUMAN_INTERVENTION"
    | "CREATE_EVIDENCE_CONFLICT"
    | "CREATE_EXECUTION_MISMATCH"
    | "CREATE_OUTCOME_MISMATCH"
    | "CUSTOM";
  target: string;
  value?: JsonValue;
}

export interface ScenarioDefinition {
  scenarioId: ScenarioId;
  laneId: GovernanceLaneId;
  title: string;
  description: string;
  scenarioClass: ScenarioClass;
  required: boolean;
  preconditions: readonly EvaluationCondition[];
  injections: readonly FailureInjection[];
  expectedGateStatuses: Partial<Record<GateId, GateResultStatus>>;
  expectedDetermination: RouteDetermination;
  recoveryRequirements: readonly string[];
}

export interface ScenarioRun {
  scenarioRunId: string;
  scenarioId: ScenarioId;
  routeId: RouteId;
  status: ScenarioRunStatus;
  startedAt?: ISODateTimeString;
  completedAt?: ISODateTimeString;
  injectionsApplied: readonly FailureInjection[];
  gateResults: readonly GateResult[];
  determination?: RouteDetermination;
  error?: string;
}

export interface DeterminationReason {
  code: string;
  gateId?: GateId;
  title: string;
  description: string;
  severity: "INFO" | "WARNING" | "BLOCKING";
  evidenceIds: readonly EvidenceId[];
}

export interface BoundedDetermination {
  determinationId: string;
  routeId: RouteId;
  laneId: GovernanceLaneId;
  determination: RouteDetermination;
  summary: string;
  reasons: readonly DeterminationReason[];
  gateResults: readonly GateResult[];
  scenarioRunIds: readonly string[];
  claimsSupported: readonly string[];
  claimsNotSupported: readonly string[];
  unresolvedQuestions: readonly string[];
  explicitNonClaims: readonly string[];
  validFrom: ISODateTimeString;
  validUntil?: ISODateTimeString;
  invalidatedAt?: ISODateTimeString;
  invalidationReason?: string;
  evaluatorVersion: string;
  ruleSetVersion: string;
  issuedAt: ISODateTimeString;
  issuedBy: ActorReference | { system: "TA14_EVALUATOR" };
  visibility: RecordVisibility;
  version: VersionStamp;
}

export interface GovernanceRoute {
  routeId: RouteId;
  laneId: GovernanceLaneId;
  parentRouteId?: RouteId;
  sourceHandoffId?: string;
  title: string;
  description: string;
  owner: ActorReference;
  collaborators: readonly ActorReference[];
  lifecycleState: RouteLifecycleState;
  visibility: RecordVisibility;
  declaredClaimIds: readonly string[];
  authorityDeclarations: readonly AuthorityDeclaration[];
  values: Record<string, JsonValue>;
  evidenceIds: readonly EvidenceId[];
  scenarioRunIds: readonly string[];
  latestDeterminationId?: string;
  tags: readonly string[];
  audit: AuditStamp;
  version: VersionStamp;
}

export interface PreservedRecord {
  recordId: RecordId;
  routeId: RouteId;
  recordClass: RecordClass;
  title: string;
  payload: JsonValue;
  contentHash: string;
  previousRecordHash?: string;
  visibility: RecordVisibility;
  preservedAt: ISODateTimeString;
  preservedBy: ActorReference | { system: "TA14_RECORD_SERVICE" };
  immutable: true;
  version: VersionStamp;
}

export interface CrossLaneHandoff {
  handoffId: string;
  sourceRouteId: RouteId;
  sourceLaneId: GovernanceLaneId;
  targetRouteId?: RouteId;
  targetLaneId: GovernanceLaneId;
  transferredRecordIds: readonly RecordId[];
  transferredEvidenceIds: readonly EvidenceId[];
  transferredClaims: readonly string[];
  nonTransferredAuthority: true;
  limitations: readonly string[];
  createdAt: ISODateTimeString;
  createdBy: ActorReference;
  acceptedAt?: ISODateTimeString;
  acceptedBy?: ActorReference;
}

export interface ChallengeRecord {
  challengeId: ChallengeId;
  routeId: RouteId;
  determinationId: string;
  status: ChallengeStatus;
  submittedBy: ActorReference;
  basis: string;
  disputedFindingIds: readonly string[];
  counterevidenceIds: readonly EvidenceId[];
  providerResponse?: string;
  resolution?: string;
  resolutionRecordId?: RecordId;
  submittedAt: ISODateTimeString;
  resolvedAt?: ISODateTimeString;
}

export interface LaneDefinition {
  laneId: GovernanceLaneId;
  name: string;
  shortName: string;
  description: string;
  claimsGoverned: readonly string[];
  nonClaims: readonly string[];
  sections: readonly PlaygroundSectionDefinition[];
  gateIds: readonly GateId[];
  evidenceTypes: readonly string[];
  scenarioIds: readonly ScenarioId[];
  determinationGuidance: readonly string[];
  enabled: boolean;
  version: string;
}

export interface PlaygroundRegistryEntry {
  laneId: GovernanceLaneId;
  slug: string;
  href: string;
  name: string;
  shortDescription: string;
  enabled: boolean;
  order: number;
  badge?: "FOUNDATION" | "REFERENCE" | "NEW" | "COMING_SOON";
}

/**
 * Determination precedence contract.
 *
 * DENY:
 * - A prohibited condition is proven; or
 * - execution would exceed authority or violate an explicit boundary.
 *
 * ESCALATE:
 * - A designated escalation condition exists; or
 * - conflicting evidence or authority cannot be resolved automatically.
 *
 * HOLD:
 * - A mandatory gate fails or remains unresolved;
 * - required testing is incomplete; or
 * - prior ALLOW state has materially drifted.
 *
 * ALLOW:
 * - Every applicable mandatory gate passes;
 * - no DENY or ESCALATE condition exists; and
 * - all required scenarios are complete.
 */
export interface DeterminationInput {
  gateResults: readonly GateResult[];
  requiredScenarioRuns: readonly ScenarioRun[];
  prohibitedConditionProven: boolean;
  authorityBoundaryExceeded: boolean;
  designatedEscalationPresent: boolean;
  materialDriftDetected: boolean;
}

export interface DeterminationOutput {
  determination: RouteDetermination;
  reasonCodes: readonly string[];
}

export function isGovernanceLaneId(value: string): value is GovernanceLaneId {
  return (GOVERNANCE_LANE_IDS as readonly string[]).includes(value);
}

export function isRouteDetermination(
  value: string,
): value is RouteDetermination {
  return (ROUTE_DETERMINATIONS as readonly string[]).includes(value);
}

export function isGateResultStatus(value: string): value is GateResultStatus {
  return (GATE_RESULT_STATUSES as readonly string[]).includes(value);
}
