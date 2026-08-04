/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * ACD-001 — Canonical Academy Lesson Contracts and Validation
 *
 * Create:
 *   apps/web/lib/academy/lesson-contracts.ts
 *
 * Purpose:
 *   Establish one dependency-light, versioned, production-safe contract shared by:
 *   - Academy content registry
 *   - Context resolver
 *   - Embedded learning panel
 *   - Dedicated Academy lesson pages
 *   - Simulations
 *   - Assessments
 *   - Mission Control learning blockers
 *   - Credential eligibility
 *   - Authority-link checks
 *   - Continuity and revalidation services
 *
 * Constitutional boundary:
 *   Learning completion, account access, payment, organizational title,
 *   credential status, or administrative role never creates substantive
 *   institutional authority by itself.
 *
 * Operating principle:
 *   Teach where the work occurs.
 *   Practice without consequence.
 *   Assess competence honestly.
 *   Grant authority separately.
 *   Preserve every material transition.
 */

export const TA14_ACADEMY_CONTRACT_VERSION = "3.0" as const;

export const TA14_ACADEMY_OPERATING_PRINCIPLE =
  "Teach where the work occurs. Practice without consequence. Assess competence honestly. Grant authority separately. Preserve every material transition." as const;

export const TA14_ACADEMY_NON_SUBSTITUTION_RULE =
  "Learning completion, account access, payment, organizational title, credential status, or administrative role never substitutes for evidence admission, specialist competence, conflict clearance, external authority, outcome verification, or an institutional determination." as const;

/* ========================================================================== *
 * Core primitives
 * ========================================================================== */

export type ISODateString = string;
export type ISODateTimeString = string;
export type ContentHash = `sha256:${string}`;
export type InstitutionalIdentifier = string;
export type RoutePattern = string;
export type RecordIdentifier = string;
export type ActionIdentifier = string;
export type LessonIdentifier = string;
export type LessonVersionIdentifier = string;
export type CorrelationIdentifier = string;
export type IdempotencyKey = string;
export type LocaleCode = string;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export type NonEmptyArray<T> = readonly [T, ...T[]];

export interface ValidationIssue {
  readonly path: string;
  readonly code: ValidationIssueCode;
  readonly message: string;
  readonly severity: ValidationSeverity;
  readonly received?: unknown;
  readonly expected?: string;
}

export type ValidationSeverity = "error" | "warning";

export type ValidationIssueCode =
  | "required"
  | "invalid_type"
  | "invalid_value"
  | "invalid_format"
  | "duplicate_value"
  | "empty_value"
  | "unsupported_value"
  | "inconsistent_state"
  | "authority_boundary_missing"
  | "immutability_violation"
  | "unsafe_projection"
  | "unsafe_simulation"
  | "unsafe_return_context"
  | "invalid_hash"
  | "invalid_version"
  | "invalid_effective_time"
  | "invalid_supersession"
  | "missing_completion_rule"
  | "missing_continuity_rule"
  | "missing_institutional_basis"
  | "missing_evidence_standard";

export interface ValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly issues: readonly ValidationIssue[];
}

export class AcademyContractValidationError extends Error {
  readonly issues: readonly ValidationIssue[];

  constructor(message: string, issues: readonly ValidationIssue[]) {
    super(message);
    this.name = "AcademyContractValidationError";
    this.issues = issues;
  }
}

/* ========================================================================== *
 * Canonical enumerations
 * ========================================================================== */

export const INSTITUTIONAL_DIVISIONS = [
  "ta14-academy",
  "ai-governance-exchange",
  "environmental-integrity-governance",
  "standards",
  "proposed-world-law",
  "public-research-and-records",
] as const;

export type InstitutionalDivision = (typeof INSTITUTIONAL_DIVISIONS)[number];

export const INSTITUTIONAL_RECORD_TYPES = [
  "institutional_subject",
  "organization",
  "governance_entity",
  "governance_registration",
  "architecture_declaration",
  "capability_declaration",
  "bounded_claim",
  "evidence_boundary",
  "evidence_item",
  "evidence_package",
  "governed_route",
  "route_gate",
  "review",
  "finding",
  "determination",
  "demonstration",
  "governed_record",
  "execution_artifact",
  "outcome",
  "registry_record",
  "challenge",
  "correction",
  "appeal",
  "commercial_scope",
  "payment",
  "fee_waiver",
  "academy_lesson",
  "academy_enrollment",
  "academy_progress",
  "academy_simulation",
  "academy_assessment",
  "academy_assessment_attempt",
  "academy_credential",
  "authority_grant",
  "assignment",
  "revalidation_action",
  "institutional_action",
  "institutional_event",
  "environmental_record",
  "air_record",
  "pair_record",
  "building_record",
  "hvac_diagnostic_record",
  "standard_record",
  "law_record",
  "public_research_record",
] as const;

export type InstitutionalRecordType =
  (typeof INSTITUTIONAL_RECORD_TYPES)[number];

export const INSTITUTIONAL_ROLES = [
  "visitor",
  "participant",
  "registered_participant",
  "entity_steward",
  "organization_steward",
  "reviewer_candidate",
  "authorized_reviewer",
  "artifact_steward",
  "registry_reviewer",
  "academy_learner",
  "academy_instructor",
  "academy_standards_reviewer",
  "credential_issuer",
  "authority_grantor",
  "continuity_steward",
  "public_record_steward",
  "institutional_administrator",
  "technical_owner",
  "service_role",
] as const;

export type InstitutionalRole = (typeof INSTITUTIONAL_ROLES)[number];

export const LESSON_PUBLICATION_STATES = [
  "draft",
  "active",
  "restricted",
  "superseded",
  "withdrawn",
] as const;

export type LessonPublicationState =
  (typeof LESSON_PUBLICATION_STATES)[number];

export const LESSON_LIFECYCLE_STATES = [
  "not_started",
  "in_progress",
  "completed",
  "expired",
  "restricted",
  "superseded",
] as const;

export type LessonLifecycleState =
  (typeof LESSON_LIFECYCLE_STATES)[number];

export const ASSESSMENT_STATES = [
  "not_attempted",
  "in_progress",
  "passed",
  "conditionally_passed",
  "failed",
  "under_review",
  "invalidated",
] as const;

export type AssessmentState = (typeof ASSESSMENT_STATES)[number];

export const CREDENTIAL_STATES = [
  "pending",
  "active",
  "expiring",
  "expired",
  "suspended",
  "revoked",
  "superseded",
] as const;

export type CredentialState = (typeof CREDENTIAL_STATES)[number];

export const AUTHORITY_STATES = [
  "not_granted",
  "active",
  "constrained",
  "held",
  "revoked",
  "expired",
] as const;

export type AuthorityState = (typeof AUTHORITY_STATES)[number];

export const SIMULATION_STATES = [
  "draft",
  "running",
  "completed",
  "invalid",
  "archived",
] as const;

export type SimulationState = (typeof SIMULATION_STATES)[number];

export const HANDOFF_STATES = [
  "not_ready",
  "ready",
  "opened",
  "completed",
  "blocked",
  "returned_for_correction",
  "denied",
  "escalated",
] as const;

export type OperationalHandoffState = (typeof HANDOFF_STATES)[number];

export const VISIBILITY_CLASSES = [
  "public",
  "controlled",
  "confidential",
  "mixed",
  "embargoed",
] as const;

export type VisibilityClass = (typeof VISIBILITY_CLASSES)[number];

export const PROJECTION_CLASSES = [
  "public",
  "authenticated",
  "organization",
  "controlled",
  "confidential",
  "service",
] as const;

export type ProjectionClass = (typeof PROJECTION_CLASSES)[number];

export const DECISION_RESULTS = [
  "ALLOW",
  "HOLD",
  "DENY",
  "ESCALATE",
  "CORRECT",
  "REVALIDATE",
  "OUTSIDE_SCOPE",
] as const;

export type DecisionResult = (typeof DECISION_RESULTS)[number];

export const REQUIREMENT_ENFORCEMENT_MODES = [
  "informational",
  "recommended",
  "required",
  "blocking",
] as const;

export type RequirementEnforcementMode =
  (typeof REQUIREMENT_ENFORCEMENT_MODES)[number];

export const EXAMPLE_CLASSIFICATIONS = [
  "fictional",
  "redacted",
  "participant_approved",
  "controlled",
  "public",
] as const;

export type ExampleClassification =
  (typeof EXAMPLE_CLASSIFICATIONS)[number];

export const EVIDENCE_CLASSES = [
  "public",
  "controlled",
  "confidential",
  "excluded",
  "conditionally_permitted",
] as const;

export type EvidenceClass = (typeof EVIDENCE_CLASSES)[number];

export const CONTINUITY_TRIGGER_TYPES = [
  "lesson_content_change",
  "standard_change",
  "law_change",
  "architecture_change",
  "identity_change",
  "ownership_change",
  "authority_change",
  "evidence_policy_change",
  "role_change",
  "conflict_change",
  "jurisdiction_change",
  "scope_change",
  "material_fact_change",
  "credential_expiry",
  "authority_expiry",
  "record_supersession",
] as const;

export type ContinuityTriggerType =
  (typeof CONTINUITY_TRIGGER_TYPES)[number];

export const COMPLETION_RULE_OPERATORS = [
  "equals",
  "not_equals",
  "exists",
  "not_exists",
  "includes",
  "excludes",
  "greater_than_or_equal",
  "less_than_or_equal",
  "all",
  "any",
  "server_verified",
] as const;

export type CompletionRuleOperator =
  (typeof COMPLETION_RULE_OPERATORS)[number];

/* ========================================================================== *
 * Supporting contracts
 * ========================================================================== */

export interface InstitutionalBasis {
  readonly basisId: string;
  readonly basisType:
    | "institutional_rule"
    | "policy"
    | "standard"
    | "law"
    | "authority_boundary"
    | "chain_stage"
    | "record_requirement"
    | "commercial_boundary"
    | "publication_boundary";
  readonly title: string;
  readonly description: string;
  readonly reference?: string;
  readonly jurisdiction?: string;
  readonly version?: string;
  readonly effectiveAt?: ISODateTimeString;
}

export interface LessonPrerequisite {
  readonly prerequisiteId: string;
  readonly type:
    | "lesson"
    | "record"
    | "registration"
    | "credential"
    | "authority"
    | "role"
    | "evidence"
    | "assignment"
    | "commercial_scope"
    | "visibility"
    | "attestation";
  readonly title: string;
  readonly description: string;
  readonly enforcement: RequirementEnforcementMode;
  readonly referencedObjectType?: InstitutionalRecordType;
  readonly referencedObjectId?: string;
  readonly requiredState?: string;
  readonly requiredRole?: InstitutionalRole;
  readonly completionMessage?: string;
  readonly failureMessage?: string;
}

export interface EvidenceStandardRule {
  readonly ruleId: string;
  readonly title: string;
  readonly description: string;
  readonly acceptedClasses: readonly EvidenceClass[];
  readonly prohibitedClasses?: readonly EvidenceClass[];
  readonly provenanceRequired: boolean;
  readonly attributionRequired: boolean;
  readonly currencyRequired: boolean;
  readonly permissionRequired: boolean;
  readonly integrityReferenceRequired: boolean;
  readonly scopeRelevanceRequired: boolean;
  readonly retentionRequired: boolean;
  readonly confidentialityHandling?: string;
  readonly freshnessWindowDays?: number;
  readonly failureResult:
    | "HOLD"
    | "DENY"
    | "ESCALATE"
    | "CORRECT"
    | "OUTSIDE_SCOPE";
}

export interface LessonStep {
  readonly stepId: string;
  readonly order: number;
  readonly title: string;
  readonly purpose: string;
  readonly instructions: readonly string[];
  readonly liveUiLabel?: string;
  readonly liveRoute?: RoutePattern;
  readonly requiredRole?: InstitutionalRole;
  readonly requiredRecordType?: InstitutionalRecordType;
  readonly evidenceRuleIds?: readonly string[];
  readonly prerequisiteIds?: readonly string[];
  readonly completionRuleIds?: readonly string[];
  readonly authorityBoundary?: string;
  readonly warnings?: readonly string[];
  readonly nextStepId?: string;
}

export interface DecisionCondition {
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

export interface DecisionBranch {
  readonly branchId: string;
  readonly title: string;
  readonly conditions: NonEmptyArray<DecisionCondition>;
  readonly result: DecisionResult;
  readonly explanation: string;
  readonly institutionalEffect: string;
  readonly nextAction?: string;
  readonly linkedLessonId?: LessonIdentifier;
  readonly linkedActionType?: string;
  readonly blocking: boolean;
}

export interface LessonExampleRef {
  readonly exampleId: string;
  readonly title: string;
  readonly description: string;
  readonly classification: ExampleClassification;
  readonly recordType?: InstitutionalRecordType;
  readonly route?: RoutePattern;
  readonly sourceReference?: string;
  readonly permittedRoles?: readonly InstitutionalRole[];
  readonly permittedProjections?: readonly ProjectionClass[];
  readonly limitations: readonly string[];
  readonly authorityBoundary: string;
}

export interface CompletionRule {
  readonly ruleId: string;
  readonly title: string;
  readonly description: string;
  readonly field?: string;
  readonly operator: CompletionRuleOperator;
  readonly expected?: JsonValue;
  readonly enforcement: RequirementEnforcementMode;
  readonly serverVerificationRequired: boolean;
  readonly authoritativeService?: string;
  readonly failureResult:
    | "HOLD"
    | "DENY"
    | "ESCALATE"
    | "CORRECT"
    | "REVALIDATE";
  readonly successMessage: string;
  readonly failureMessage: string;
}

export interface FailureConsequence {
  readonly consequenceId: string;
  readonly trigger: string;
  readonly result:
    | "HOLD"
    | "DENY"
    | "ESCALATE"
    | "CORRECT"
    | "REVALIDATE"
    | "OUTSIDE_SCOPE";
  readonly description: string;
  readonly blocksLiveWork: boolean;
  readonly blocksInstitutionalEffect: boolean;
  readonly createsAction: boolean;
  readonly actionType?: string;
}

export interface SimulationPolicy {
  readonly available: boolean;
  readonly required: boolean;
  readonly scenarioIds: readonly string[];
  readonly persistentMarker: "SIMULATION - NO PRODUCTION EFFECT";
  readonly separateIdentifierPrefix: string;
  readonly mayUseProductionForeignKeys: false;
  readonly mayCreateRegistryEffect: false;
  readonly mayCreateArtifactEffect: false;
  readonly mayCreateAuthorityEffect: false;
  readonly allowedDataClasses: readonly ExampleClassification[];
  readonly exportAllowed: boolean;
  readonly screenshotAllowed: boolean;
  readonly exportNotice: string;
  readonly retentionDays?: number;
  readonly handoffPolicy: "none" | "reviewed_inputs_only";
  readonly limitations: readonly string[];
}

export interface AssessmentPolicy {
  readonly required: boolean;
  readonly assessmentIds: readonly string[];
  readonly minimumScore?: number;
  readonly boundaryFailuresAlwaysFail: boolean;
  readonly maximumAttempts?: number;
  readonly evaluator:
    | "automated"
    | "authorized_human"
    | "hybrid"
    | "not_applicable";
  readonly createsCredentialEligibilityOnly: boolean;
  readonly createsAuthority: false;
  readonly underReviewOnAmbiguity: boolean;
  readonly restrictions?: readonly string[];
}

export interface ContinuityTrigger {
  readonly triggerId: string;
  readonly type: ContinuityTriggerType;
  readonly description: string;
  readonly severity: "low" | "moderate" | "high" | "critical";
  readonly affectsProgress: boolean;
  readonly affectsAssessment: boolean;
  readonly affectsCredential: boolean;
  readonly affectsAuthorityEligibility: boolean;
  readonly mayHoldAssignments: boolean;
  readonly requiredAction:
    | "none"
    | "review"
    | "relearn"
    | "reassess"
    | "revalidate"
    | "authority_review";
}

export interface ReturnContextPolicy {
  readonly enabled: boolean;
  readonly allowedRoutePatterns: readonly RoutePattern[];
  readonly requireRecordId: boolean;
  readonly requireActionId: boolean;
  readonly preserveRole: boolean;
  readonly preserveLifecycleState: boolean;
  readonly preserveScrollAnchor: boolean;
  readonly signed: boolean;
  readonly ttlSeconds: number;
  readonly allowedQueryKeys: readonly string[];
  readonly blockedQueryKeys: readonly string[];
  readonly fallbackRoute: RoutePattern;
}

export interface VisibilityPolicy {
  readonly visibility: VisibilityClass;
  readonly publicSafe: boolean;
  readonly protectedFields: readonly string[];
  readonly omittedFieldsByProjection: Readonly<
    Partial<Record<ProjectionClass, readonly string[]>>
  >;
  readonly permittedRoles?: readonly InstitutionalRole[];
  readonly permittedOrganizations?: readonly string[];
  readonly embargoUntil?: ISODateTimeString;
}

export interface AccessPolicy {
  readonly authenticationRequired: boolean;
  readonly permittedRoles: readonly InstitutionalRole[];
  readonly deniedRoles?: readonly InstitutionalRole[];
  readonly organizationMatchRequired: boolean;
  readonly assignmentRequired: boolean;
  readonly authorityGrantRequired: boolean;
  readonly requiredAuthorityGrantTypes: readonly string[];
  readonly serviceRoleOnlyOperations: readonly string[];
}

export interface AcademyLessonMetadata {
  readonly ownerSubjectId: InstitutionalIdentifier;
  readonly ownerOrganizationId?: InstitutionalIdentifier;
  readonly lessonOwnerRole: InstitutionalRole;
  readonly divisionStewardId?: InstitutionalIdentifier;
  readonly academyStandardsReviewerId?: InstitutionalIdentifier;
  readonly technicalOwnerId?: InstitutionalIdentifier;
  readonly createdAt: ISODateTimeString;
  readonly createdBy: InstitutionalIdentifier;
  readonly updatedAt: ISODateTimeString;
  readonly updatedBy: InstitutionalIdentifier;
  readonly approvedAt?: ISODateTimeString;
  readonly approvedBy?: InstitutionalIdentifier;
}

export interface AcademyLessonDefinition {
  readonly lessonId: LessonIdentifier;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly version: string;
  readonly locale: LocaleCode;
  readonly division: InstitutionalDivision;

  readonly operationalFunctions: NonEmptyArray<string>;
  readonly operationalRoutes: NonEmptyArray<RoutePattern>;
  readonly recordTypes: NonEmptyArray<InstitutionalRecordType>;
  readonly roles: NonEmptyArray<InstitutionalRole>;

  readonly learningObjectives: NonEmptyArray<string>;
  readonly prerequisites: readonly LessonPrerequisite[];
  readonly institutionalBasis: NonEmptyArray<InstitutionalBasis>;
  readonly evidenceStandard: NonEmptyArray<EvidenceStandardRule>;
  readonly steps: NonEmptyArray<LessonStep>;
  readonly decisionMap: NonEmptyArray<DecisionBranch>;
  readonly examples: readonly LessonExampleRef[];
  readonly completionStandard: NonEmptyArray<CompletionRule>;
  readonly failureConsequences: readonly FailureConsequence[];
  readonly relatedLessons: readonly LessonIdentifier[];

  readonly simulation: SimulationPolicy;
  readonly assessment: AssessmentPolicy;

  readonly requiredCredentialIds: readonly string[];
  readonly requiredAuthorityGrantTypes: readonly string[];

  readonly continuityTriggers: NonEmptyArray<ContinuityTrigger>;
  readonly returnContext: ReturnContextPolicy;
  readonly visibility: VisibilityPolicy;
  readonly accessPolicy: AccessPolicy;

  readonly authorityBoundary: string;
  readonly nonSubstitutionRule: typeof TA14_ACADEMY_NON_SUBSTITUTION_RULE;

  readonly contentHash: ContentHash;
  readonly effectiveAt: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly supersedesLessonId?: LessonIdentifier;
  readonly supersedesVersion?: string;
  readonly publicationState: LessonPublicationState;

  readonly metadata: AcademyLessonMetadata;
}

/* ========================================================================== *
 * Route resolution contracts
 * ========================================================================== */

export interface AcademyResolverContext {
  readonly route: string;
  readonly recordType?: InstitutionalRecordType;
  readonly recordId?: RecordIdentifier;
  readonly actionType?: string;
  readonly actionId?: ActionIdentifier;
  readonly performingRole?: InstitutionalRole;
  readonly lifecycleState?: string;
  readonly blockerType?: string;
  readonly projection: ProjectionClass;
  readonly institutionalSubjectId?: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly correlationId?: CorrelationIdentifier;
  readonly returnUrl?: string;
  readonly scrollAnchor?: string;
  readonly now?: ISODateTimeString;
}

export interface AcademyRouteMapping {
  readonly mappingId: string;
  readonly lessonId: LessonIdentifier;
  readonly lessonVersion?: string;
  readonly routePattern?: RoutePattern;
  readonly recordType?: InstitutionalRecordType;
  readonly actionType?: string;
  readonly role?: InstitutionalRole;
  readonly lifecycleState?: string;
  readonly blockerType?: string;
  readonly projection?: ProjectionClass;
  readonly priority: number;
  readonly active: boolean;
  readonly effectiveAt?: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
}

export interface ResolvedAcademyLesson {
  readonly lesson: AcademyLessonDefinition;
  readonly score: number;
  readonly matchedMappingIds: readonly string[];
  readonly relatedLessons: readonly AcademyLessonDefinition[];
  readonly returnContext?: SignedAcademyReturnContext;
  readonly warnings: readonly string[];
  readonly contentGapAction?: AcademyContentGapAction;
}

export interface AcademyContentGapAction {
  readonly actionType: "academy_content_gap";
  readonly route: string;
  readonly recordType?: InstitutionalRecordType;
  readonly actionContext?: string;
  readonly role?: InstitutionalRole;
  readonly reason: string;
}

export interface AcademyReturnContextPayload {
  readonly version: 1;
  readonly route: string;
  readonly recordId?: RecordIdentifier;
  readonly recordType?: InstitutionalRecordType;
  readonly actionId?: ActionIdentifier;
  readonly actionType?: string;
  readonly role?: InstitutionalRole;
  readonly lifecycleState?: string;
  readonly scrollAnchor?: string;
  readonly projection: ProjectionClass;
  readonly issuedAt: ISODateTimeString;
  readonly expiresAt: ISODateTimeString;
  readonly correlationId?: CorrelationIdentifier;
}

export interface SignedAcademyReturnContext {
  readonly payload: AcademyReturnContextPayload;
  readonly signature: string;
  readonly algorithm: "HMAC-SHA256" | "ED25519";
}

/* ========================================================================== *
 * Institutional event contracts
 * ========================================================================== */

export const ACADEMY_EVENT_TYPES = [
  "academy.lesson.resolved",
  "academy.lesson.viewed",
  "academy.enrollment.created",
  "academy.progress.updated",
  "academy.simulation.created",
  "academy.simulation.completed",
  "academy.simulation.invalidated",
  "academy.assessment.attempted",
  "academy.assessment.passed",
  "academy.assessment.failed",
  "academy.credential.issued",
  "academy.credential.suspended",
  "academy.credential.revoked",
  "academy.authority.eligibility_created",
  "academy.handoff.requested",
  "academy.handoff.approved",
  "academy.handoff.denied",
  "academy.revalidation.required",
  "academy.revalidation.completed",
  "academy.lesson.superseded",
  "authority.grant.issued",
  "authority.grant.constrained",
  "authority.grant.held",
  "authority.grant.revoked",
] as const;

export type AcademyEventType = (typeof ACADEMY_EVENT_TYPES)[number];

export interface AcademyInstitutionalEvent<TPayload extends JsonValue = JsonValue> {
  readonly eventId: InstitutionalIdentifier;
  readonly eventType: AcademyEventType;
  readonly occurredAt: ISODateTimeString;
  readonly actorSubjectId?: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly recordId: InstitutionalIdentifier;
  readonly recordType: InstitutionalRecordType;
  readonly recordVersion?: string;
  readonly priorState?: string | null;
  readonly newState?: string | null;
  readonly authorityBasis: string;
  readonly correlationId: CorrelationIdentifier;
  readonly idempotencyKey: IdempotencyKey;
  readonly payload: TPayload;
  readonly integrityHash: ContentHash;
}

/* ========================================================================== *
 * Validation helpers
 * ========================================================================== */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNonEmptyArrayValue(value: unknown): value is readonly unknown[] {
  return Array.isArray(value) && value.length > 0;
}

function isOneOf<T extends readonly string[]>(
  value: unknown,
  allowed: T,
): value is T[number] {
  return typeof value === "string" && allowed.includes(value);
}

function isISODateTime(value: unknown): value is ISODateTimeString {
  if (typeof value !== "string") return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && /T/.test(value);
}

function isContentHash(value: unknown): value is ContentHash {
  return (
    typeof value === "string" &&
    /^sha256:[a-fA-F0-9]{64}$/.test(value)
  );
}

function isSemverLike(value: unknown): value is string {
  return typeof value === "string" && /^\d+\.\d+(?:\.\d+)?(?:[-+][0-9A-Za-z.-]+)?$/.test(value);
}

function pushIssue(
  issues: ValidationIssue[],
  issue: ValidationIssue,
): void {
  issues.push(issue);
}

function checkRequiredString(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isNonEmptyString(value)) {
    pushIssue(issues, {
      path,
      code: "required",
      message: `${path} must be a non-empty string.`,
      severity: "error",
      received: value,
      expected: "non-empty string",
    });
  }
}

function checkStringArray(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
  options: { nonEmpty?: boolean } = {},
): void {
  if (!isStringArray(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an array of strings.`,
      severity: "error",
      received: value,
      expected: "string[]",
    });
    return;
  }

  if (options.nonEmpty && value.length === 0) {
    pushIssue(issues, {
      path,
      code: "empty_value",
      message: `${path} must contain at least one value.`,
      severity: "error",
      received: value,
      expected: "non-empty string[]",
    });
  }

  const duplicates = value.filter(
    (item, index) => value.indexOf(item) !== index,
  );

  if (duplicates.length > 0) {
    pushIssue(issues, {
      path,
      code: "duplicate_value",
      message: `${path} contains duplicate values: ${[
        ...new Set(duplicates),
      ].join(", ")}.`,
      severity: "warning",
      received: duplicates,
    });
  }
}

function checkEnumArray<T extends readonly string[]>(
  value: unknown,
  path: string,
  allowed: T,
  issues: ValidationIssue[],
  nonEmpty = true,
): void {
  if (!Array.isArray(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an array.`,
      severity: "error",
      received: value,
      expected: `Array<${allowed.join(" | ")}>`,
    });
    return;
  }

  if (nonEmpty && value.length === 0) {
    pushIssue(issues, {
      path,
      code: "empty_value",
      message: `${path} must contain at least one value.`,
      severity: "error",
      received: value,
    });
  }

  value.forEach((item, index) => {
    if (!isOneOf(item, allowed)) {
      pushIssue(issues, {
        path: `${path}[${index}]`,
        code: "unsupported_value",
        message: `${path}[${index}] is not supported.`,
        severity: "error",
        received: item,
        expected: allowed.join(" | "),
      });
    }
  });
}

function validateInstitutionalBasis(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  checkRequiredString(value.basisId, `${path}.basisId`, issues);
  checkRequiredString(value.title, `${path}.title`, issues);
  checkRequiredString(value.description, `${path}.description`, issues);

  const allowedBasisTypes = [
    "institutional_rule",
    "policy",
    "standard",
    "law",
    "authority_boundary",
    "chain_stage",
    "record_requirement",
    "commercial_boundary",
    "publication_boundary",
  ] as const;

  if (!isOneOf(value.basisType, allowedBasisTypes)) {
    pushIssue(issues, {
      path: `${path}.basisType`,
      code: "unsupported_value",
      message: `${path}.basisType is not supported.`,
      severity: "error",
      received: value.basisType,
      expected: allowedBasisTypes.join(" | "),
    });
  }

  if (
    value.effectiveAt !== undefined &&
    !isISODateTime(value.effectiveAt)
  ) {
    pushIssue(issues, {
      path: `${path}.effectiveAt`,
      code: "invalid_format",
      message: `${path}.effectiveAt must be an ISO date-time string.`,
      severity: "error",
      received: value.effectiveAt,
    });
  }
}

function validatePrerequisite(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  checkRequiredString(value.prerequisiteId, `${path}.prerequisiteId`, issues);
  checkRequiredString(value.title, `${path}.title`, issues);
  checkRequiredString(value.description, `${path}.description`, issues);

  const types = [
    "lesson",
    "record",
    "registration",
    "credential",
    "authority",
    "role",
    "evidence",
    "assignment",
    "commercial_scope",
    "visibility",
    "attestation",
  ] as const;

  if (!isOneOf(value.type, types)) {
    pushIssue(issues, {
      path: `${path}.type`,
      code: "unsupported_value",
      message: `${path}.type is not supported.`,
      severity: "error",
      received: value.type,
      expected: types.join(" | "),
    });
  }

  if (!isOneOf(value.enforcement, REQUIREMENT_ENFORCEMENT_MODES)) {
    pushIssue(issues, {
      path: `${path}.enforcement`,
      code: "unsupported_value",
      message: `${path}.enforcement is not supported.`,
      severity: "error",
      received: value.enforcement,
      expected: REQUIREMENT_ENFORCEMENT_MODES.join(" | "),
    });
  }

  if (
    value.requiredRole !== undefined &&
    !isOneOf(value.requiredRole, INSTITUTIONAL_ROLES)
  ) {
    pushIssue(issues, {
      path: `${path}.requiredRole`,
      code: "unsupported_value",
      message: `${path}.requiredRole is not supported.`,
      severity: "error",
      received: value.requiredRole,
    });
  }
}

function validateEvidenceStandardRule(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  checkRequiredString(value.ruleId, `${path}.ruleId`, issues);
  checkRequiredString(value.title, `${path}.title`, issues);
  checkRequiredString(value.description, `${path}.description`, issues);

  checkEnumArray(
    value.acceptedClasses,
    `${path}.acceptedClasses`,
    EVIDENCE_CLASSES,
    issues,
    true,
  );

  const booleanFields = [
    "provenanceRequired",
    "attributionRequired",
    "currencyRequired",
    "permissionRequired",
    "integrityReferenceRequired",
    "scopeRelevanceRequired",
    "retentionRequired",
  ] as const;

  for (const field of booleanFields) {
    if (typeof value[field] !== "boolean") {
      pushIssue(issues, {
        path: `${path}.${field}`,
        code: "invalid_type",
        message: `${path}.${field} must be boolean.`,
        severity: "error",
        received: value[field],
      });
    }
  }

  const allowedFailureResults = [
    "HOLD",
    "DENY",
    "ESCALATE",
    "CORRECT",
    "OUTSIDE_SCOPE",
  ] as const;

  if (!isOneOf(value.failureResult, allowedFailureResults)) {
    pushIssue(issues, {
      path: `${path}.failureResult`,
      code: "unsupported_value",
      message: `${path}.failureResult is not supported.`,
      severity: "error",
      received: value.failureResult,
    });
  }
}

function validateLessonStep(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  checkRequiredString(value.stepId, `${path}.stepId`, issues);
  checkRequiredString(value.title, `${path}.title`, issues);
  checkRequiredString(value.purpose, `${path}.purpose`, issues);
  checkStringArray(value.instructions, `${path}.instructions`, issues, {
    nonEmpty: true,
  });

  if (
    typeof value.order !== "number" ||
    !Number.isInteger(value.order) ||
    value.order < 1
  ) {
    pushIssue(issues, {
      path: `${path}.order`,
      code: "invalid_value",
      message: `${path}.order must be a positive integer.`,
      severity: "error",
      received: value.order,
    });
  }

  if (
    value.requiredRole !== undefined &&
    !isOneOf(value.requiredRole, INSTITUTIONAL_ROLES)
  ) {
    pushIssue(issues, {
      path: `${path}.requiredRole`,
      code: "unsupported_value",
      message: `${path}.requiredRole is not supported.`,
      severity: "error",
      received: value.requiredRole,
    });
  }
}

function validateDecisionBranch(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  checkRequiredString(value.branchId, `${path}.branchId`, issues);
  checkRequiredString(value.title, `${path}.title`, issues);
  checkRequiredString(value.explanation, `${path}.explanation`, issues);
  checkRequiredString(
    value.institutionalEffect,
    `${path}.institutionalEffect`,
    issues,
  );

  if (!isNonEmptyArrayValue(value.conditions)) {
    pushIssue(issues, {
      path: `${path}.conditions`,
      code: "empty_value",
      message: `${path}.conditions must contain at least one condition.`,
      severity: "error",
      received: value.conditions,
    });
  }

  if (!isOneOf(value.result, DECISION_RESULTS)) {
    pushIssue(issues, {
      path: `${path}.result`,
      code: "unsupported_value",
      message: `${path}.result is not supported.`,
      severity: "error",
      received: value.result,
    });
  }

  if (typeof value.blocking !== "boolean") {
    pushIssue(issues, {
      path: `${path}.blocking`,
      code: "invalid_type",
      message: `${path}.blocking must be boolean.`,
      severity: "error",
      received: value.blocking,
    });
  }
}

function validateCompletionRule(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  checkRequiredString(value.ruleId, `${path}.ruleId`, issues);
  checkRequiredString(value.title, `${path}.title`, issues);
  checkRequiredString(value.description, `${path}.description`, issues);
  checkRequiredString(value.successMessage, `${path}.successMessage`, issues);
  checkRequiredString(value.failureMessage, `${path}.failureMessage`, issues);

  if (!isOneOf(value.operator, COMPLETION_RULE_OPERATORS)) {
    pushIssue(issues, {
      path: `${path}.operator`,
      code: "unsupported_value",
      message: `${path}.operator is not supported.`,
      severity: "error",
      received: value.operator,
    });
  }

  if (!isOneOf(value.enforcement, REQUIREMENT_ENFORCEMENT_MODES)) {
    pushIssue(issues, {
      path: `${path}.enforcement`,
      code: "unsupported_value",
      message: `${path}.enforcement is not supported.`,
      severity: "error",
      received: value.enforcement,
    });
  }

  if (typeof value.serverVerificationRequired !== "boolean") {
    pushIssue(issues, {
      path: `${path}.serverVerificationRequired`,
      code: "invalid_type",
      message: `${path}.serverVerificationRequired must be boolean.`,
      severity: "error",
      received: value.serverVerificationRequired,
    });
  }

  if (
    value.serverVerificationRequired === true &&
    !isNonEmptyString(value.authoritativeService)
  ) {
    pushIssue(issues, {
      path: `${path}.authoritativeService`,
      code: "required",
      message:
        `${path}.authoritativeService is required when server verification is required.`,
      severity: "error",
      received: value.authoritativeService,
    });
  }
}

function validateSimulationPolicy(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  const booleanFields = [
    "available",
    "required",
    "exportAllowed",
    "screenshotAllowed",
  ] as const;

  for (const field of booleanFields) {
    if (typeof value[field] !== "boolean") {
      pushIssue(issues, {
        path: `${path}.${field}`,
        code: "invalid_type",
        message: `${path}.${field} must be boolean.`,
        severity: "error",
        received: value[field],
      });
    }
  }

  const alwaysFalseFields = [
    "mayUseProductionForeignKeys",
    "mayCreateRegistryEffect",
    "mayCreateArtifactEffect",
    "mayCreateAuthorityEffect",
  ] as const;

  for (const field of alwaysFalseFields) {
    if (value[field] !== false) {
      pushIssue(issues, {
        path: `${path}.${field}`,
        code: "unsafe_simulation",
        message: `${path}.${field} must be false.`,
        severity: "error",
        received: value[field],
        expected: "false",
      });
    }
  }

  if (value.persistentMarker !== "SIMULATION - NO PRODUCTION EFFECT") {
    pushIssue(issues, {
      path: `${path}.persistentMarker`,
      code: "unsafe_simulation",
      message:
        `${path}.persistentMarker must equal "SIMULATION - NO PRODUCTION EFFECT".`,
      severity: "error",
      received: value.persistentMarker,
    });
  }

  checkStringArray(value.scenarioIds, `${path}.scenarioIds`, issues);
  checkEnumArray(
    value.allowedDataClasses,
    `${path}.allowedDataClasses`,
    EXAMPLE_CLASSIFICATIONS,
    issues,
    false,
  );
  checkRequiredString(
    value.separateIdentifierPrefix,
    `${path}.separateIdentifierPrefix`,
    issues,
  );
  checkRequiredString(value.exportNotice, `${path}.exportNotice`, issues);
  checkStringArray(value.limitations, `${path}.limitations`, issues);

  if (!isOneOf(value.handoffPolicy, ["none", "reviewed_inputs_only"] as const)) {
    pushIssue(issues, {
      path: `${path}.handoffPolicy`,
      code: "unsupported_value",
      message: `${path}.handoffPolicy is not supported.`,
      severity: "error",
      received: value.handoffPolicy,
    });
  }

  if (value.available === false && value.required === true) {
    pushIssue(issues, {
      path,
      code: "inconsistent_state",
      message: `${path} cannot be required when unavailable.`,
      severity: "error",
      received: value,
    });
  }
}

function validateAssessmentPolicy(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  const booleanFields = [
    "required",
    "boundaryFailuresAlwaysFail",
    "createsCredentialEligibilityOnly",
    "underReviewOnAmbiguity",
  ] as const;

  for (const field of booleanFields) {
    if (typeof value[field] !== "boolean") {
      pushIssue(issues, {
        path: `${path}.${field}`,
        code: "invalid_type",
        message: `${path}.${field} must be boolean.`,
        severity: "error",
        received: value[field],
      });
    }
  }

  if (value.createsAuthority !== false) {
    pushIssue(issues, {
      path: `${path}.createsAuthority`,
      code: "authority_boundary_missing",
      message: `${path}.createsAuthority must be false.`,
      severity: "error",
      received: value.createsAuthority,
    });
  }

  checkStringArray(value.assessmentIds, `${path}.assessmentIds`, issues);

  if (
    !isOneOf(
      value.evaluator,
      ["automated", "authorized_human", "hybrid", "not_applicable"] as const,
    )
  ) {
    pushIssue(issues, {
      path: `${path}.evaluator`,
      code: "unsupported_value",
      message: `${path}.evaluator is not supported.`,
      severity: "error",
      received: value.evaluator,
    });
  }

  if (
    value.minimumScore !== undefined &&
    (typeof value.minimumScore !== "number" ||
      value.minimumScore < 0 ||
      value.minimumScore > 100)
  ) {
    pushIssue(issues, {
      path: `${path}.minimumScore`,
      code: "invalid_value",
      message: `${path}.minimumScore must be between 0 and 100.`,
      severity: "error",
      received: value.minimumScore,
    });
  }
}

function validateContinuityTrigger(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  checkRequiredString(value.triggerId, `${path}.triggerId`, issues);
  checkRequiredString(value.description, `${path}.description`, issues);

  if (!isOneOf(value.type, CONTINUITY_TRIGGER_TYPES)) {
    pushIssue(issues, {
      path: `${path}.type`,
      code: "unsupported_value",
      message: `${path}.type is not supported.`,
      severity: "error",
      received: value.type,
    });
  }

  if (
    !isOneOf(value.severity, ["low", "moderate", "high", "critical"] as const)
  ) {
    pushIssue(issues, {
      path: `${path}.severity`,
      code: "unsupported_value",
      message: `${path}.severity is not supported.`,
      severity: "error",
      received: value.severity,
    });
  }

  const booleanFields = [
    "affectsProgress",
    "affectsAssessment",
    "affectsCredential",
    "affectsAuthorityEligibility",
    "mayHoldAssignments",
  ] as const;

  for (const field of booleanFields) {
    if (typeof value[field] !== "boolean") {
      pushIssue(issues, {
        path: `${path}.${field}`,
        code: "invalid_type",
        message: `${path}.${field} must be boolean.`,
        severity: "error",
        received: value[field],
      });
    }
  }
}

function validateReturnContextPolicy(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  const booleanFields = [
    "enabled",
    "requireRecordId",
    "requireActionId",
    "preserveRole",
    "preserveLifecycleState",
    "preserveScrollAnchor",
    "signed",
  ] as const;

  for (const field of booleanFields) {
    if (typeof value[field] !== "boolean") {
      pushIssue(issues, {
        path: `${path}.${field}`,
        code: "invalid_type",
        message: `${path}.${field} must be boolean.`,
        severity: "error",
        received: value[field],
      });
    }
  }

  checkStringArray(
    value.allowedRoutePatterns,
    `${path}.allowedRoutePatterns`,
    issues,
    { nonEmpty: true },
  );
  checkStringArray(
    value.allowedQueryKeys,
    `${path}.allowedQueryKeys`,
    issues,
  );
  checkStringArray(
    value.blockedQueryKeys,
    `${path}.blockedQueryKeys`,
    issues,
  );
  checkRequiredString(value.fallbackRoute, `${path}.fallbackRoute`, issues);

  if (
    typeof value.ttlSeconds !== "number" ||
    !Number.isFinite(value.ttlSeconds) ||
    value.ttlSeconds <= 0 ||
    value.ttlSeconds > 86400
  ) {
    pushIssue(issues, {
      path: `${path}.ttlSeconds`,
      code: "unsafe_return_context",
      message: `${path}.ttlSeconds must be between 1 and 86400.`,
      severity: "error",
      received: value.ttlSeconds,
    });
  }

  if (value.enabled === true && value.signed !== true) {
    pushIssue(issues, {
      path: `${path}.signed`,
      code: "unsafe_return_context",
      message: `${path}.signed must be true when return context is enabled.`,
      severity: "error",
      received: value.signed,
    });
  }

  if (
    Array.isArray(value.allowedQueryKeys) &&
    Array.isArray(value.blockedQueryKeys)
  ) {
    const allowedQueryKeys = value.allowedQueryKeys;
    const blockedQueryKeys = value.blockedQueryKeys;

    const overlap = allowedQueryKeys.filter((key) =>
      blockedQueryKeys.includes(key),
    );

    if (overlap.length > 0) {
      pushIssue(issues, {
        path,
        code: "inconsistent_state",
        message:
          `${path} contains query keys in both allowed and blocked lists: ${overlap.join(", ")}.`,
        severity: "error",
        received: overlap,
      });
    }
  }
}

function validateVisibilityPolicy(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  if (!isOneOf(value.visibility, VISIBILITY_CLASSES)) {
    pushIssue(issues, {
      path: `${path}.visibility`,
      code: "unsupported_value",
      message: `${path}.visibility is not supported.`,
      severity: "error",
      received: value.visibility,
    });
  }

  if (typeof value.publicSafe !== "boolean") {
    pushIssue(issues, {
      path: `${path}.publicSafe`,
      code: "invalid_type",
      message: `${path}.publicSafe must be boolean.`,
      severity: "error",
      received: value.publicSafe,
    });
  }

  checkStringArray(
    value.protectedFields,
    `${path}.protectedFields`,
    issues,
  );

  if (
    value.visibility === "confidential" &&
    value.publicSafe === true &&
    (!Array.isArray(value.protectedFields) ||
      value.protectedFields.length === 0)
  ) {
    pushIssue(issues, {
      path,
      code: "unsafe_projection",
      message:
        `${path} cannot be confidential and public-safe without protected fields.`,
      severity: "error",
      received: value,
    });
  }
}

function validateAccessPolicy(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  const booleanFields = [
    "authenticationRequired",
    "organizationMatchRequired",
    "assignmentRequired",
    "authorityGrantRequired",
  ] as const;

  for (const field of booleanFields) {
    if (typeof value[field] !== "boolean") {
      pushIssue(issues, {
        path: `${path}.${field}`,
        code: "invalid_type",
        message: `${path}.${field} must be boolean.`,
        severity: "error",
        received: value[field],
      });
    }
  }

  checkEnumArray(
    value.permittedRoles,
    `${path}.permittedRoles`,
    INSTITUTIONAL_ROLES,
    issues,
    true,
  );
  checkStringArray(
    value.requiredAuthorityGrantTypes,
    `${path}.requiredAuthorityGrantTypes`,
    issues,
  );
  checkStringArray(
    value.serviceRoleOnlyOperations,
    `${path}.serviceRoleOnlyOperations`,
    issues,
  );

  if (
    value.authorityGrantRequired === true &&
    Array.isArray(value.requiredAuthorityGrantTypes) &&
    value.requiredAuthorityGrantTypes.length === 0
  ) {
    pushIssue(issues, {
      path: `${path}.requiredAuthorityGrantTypes`,
      code: "required",
      message:
        `${path}.requiredAuthorityGrantTypes must contain at least one type when authorityGrantRequired is true.`,
      severity: "error",
      received: value.requiredAuthorityGrantTypes,
    });
  }
}

function validateMetadata(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    pushIssue(issues, {
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: value,
    });
    return;
  }

  checkRequiredString(
    value.ownerSubjectId,
    `${path}.ownerSubjectId`,
    issues,
  );
  checkRequiredString(value.createdBy, `${path}.createdBy`, issues);
  checkRequiredString(value.updatedBy, `${path}.updatedBy`, issues);

  if (!isOneOf(value.lessonOwnerRole, INSTITUTIONAL_ROLES)) {
    pushIssue(issues, {
      path: `${path}.lessonOwnerRole`,
      code: "unsupported_value",
      message: `${path}.lessonOwnerRole is not supported.`,
      severity: "error",
      received: value.lessonOwnerRole,
    });
  }

  for (const field of ["createdAt", "updatedAt"] as const) {
    if (!isISODateTime(value[field])) {
      pushIssue(issues, {
        path: `${path}.${field}`,
        code: "invalid_format",
        message: `${path}.${field} must be an ISO date-time string.`,
        severity: "error",
        received: value[field],
      });
    }
  }

  if (
    value.approvedAt !== undefined &&
    !isISODateTime(value.approvedAt)
  ) {
    pushIssue(issues, {
      path: `${path}.approvedAt`,
      code: "invalid_format",
      message: `${path}.approvedAt must be an ISO date-time string.`,
      severity: "error",
      received: value.approvedAt,
    });
  }

  if (
    value.approvedAt !== undefined &&
    !isNonEmptyString(value.approvedBy)
  ) {
    pushIssue(issues, {
      path: `${path}.approvedBy`,
      code: "required",
      message: `${path}.approvedBy is required when approvedAt exists.`,
      severity: "error",
      received: value.approvedBy,
    });
  }
}

/* ========================================================================== *
 * Public validation API
 * ========================================================================== */

export function validateAcademyLessonDefinition(
  input: unknown,
): ValidationResult<AcademyLessonDefinition> {
  const issues: ValidationIssue[] = [];

  if (!isObject(input)) {
    return {
      ok: false,
      issues: [
        {
          path: "$",
          code: "invalid_type",
          message: "Academy lesson definition must be an object.",
          severity: "error",
          received: input,
          expected: "AcademyLessonDefinition",
        },
      ],
    };
  }

  checkRequiredString(input.lessonId, "$.lessonId", issues);
  checkRequiredString(input.slug, "$.slug", issues);
  checkRequiredString(input.title, "$.title", issues);
  checkRequiredString(input.summary, "$.summary", issues);

  if (!isSemverLike(input.version)) {
    pushIssue(issues, {
      path: "$.version",
      code: "invalid_version",
      message: "$.version must be a semantic version-like string.",
      severity: "error",
      received: input.version,
      expected: "e.g. 3.0 or 3.0.1",
    });
  }

  checkRequiredString(input.locale, "$.locale", issues);

  if (!isOneOf(input.division, INSTITUTIONAL_DIVISIONS)) {
    pushIssue(issues, {
      path: "$.division",
      code: "unsupported_value",
      message: "$.division is not supported.",
      severity: "error",
      received: input.division,
      expected: INSTITUTIONAL_DIVISIONS.join(" | "),
    });
  }

  checkStringArray(
    input.operationalFunctions,
    "$.operationalFunctions",
    issues,
    { nonEmpty: true },
  );
  checkStringArray(
    input.operationalRoutes,
    "$.operationalRoutes",
    issues,
    { nonEmpty: true },
  );
  checkEnumArray(
    input.recordTypes,
    "$.recordTypes",
    INSTITUTIONAL_RECORD_TYPES,
    issues,
    true,
  );
  checkEnumArray(
    input.roles,
    "$.roles",
    INSTITUTIONAL_ROLES,
    issues,
    true,
  );
  checkStringArray(
    input.learningObjectives,
    "$.learningObjectives",
    issues,
    { nonEmpty: true },
  );

  if (!isNonEmptyArrayValue(input.institutionalBasis)) {
    pushIssue(issues, {
      path: "$.institutionalBasis",
      code: "missing_institutional_basis",
      message:
        "$.institutionalBasis must contain at least one institutional basis.",
      severity: "error",
      received: input.institutionalBasis,
    });
  } else {
    input.institutionalBasis.forEach((item, index) =>
      validateInstitutionalBasis(
        item,
        `$.institutionalBasis[${index}]`,
        issues,
      ),
    );
  }

  if (!Array.isArray(input.prerequisites)) {
    pushIssue(issues, {
      path: "$.prerequisites",
      code: "invalid_type",
      message: "$.prerequisites must be an array.",
      severity: "error",
      received: input.prerequisites,
    });
  } else {
    input.prerequisites.forEach((item, index) =>
      validatePrerequisite(item, `$.prerequisites[${index}]`, issues),
    );
  }

  if (!isNonEmptyArrayValue(input.evidenceStandard)) {
    pushIssue(issues, {
      path: "$.evidenceStandard",
      code: "missing_evidence_standard",
      message:
        "$.evidenceStandard must contain at least one evidence standard rule.",
      severity: "error",
      received: input.evidenceStandard,
    });
  } else {
    input.evidenceStandard.forEach((item, index) =>
      validateEvidenceStandardRule(
        item,
        `$.evidenceStandard[${index}]`,
        issues,
      ),
    );
  }

  if (!isNonEmptyArrayValue(input.steps)) {
    pushIssue(issues, {
      path: "$.steps",
      code: "empty_value",
      message: "$.steps must contain at least one step.",
      severity: "error",
      received: input.steps,
    });
  } else {
    input.steps.forEach((item, index) =>
      validateLessonStep(item, `$.steps[${index}]`, issues),
    );

    const stepOrders = input.steps
      .map((item) => (isObject(item) ? item.order : undefined))
      .filter((value): value is number => typeof value === "number");

    const uniqueOrders = new Set(stepOrders);
    if (stepOrders.length !== uniqueOrders.size) {
      pushIssue(issues, {
        path: "$.steps",
        code: "duplicate_value",
        message: "$.steps contains duplicate order values.",
        severity: "error",
        received: stepOrders,
      });
    }
  }

  if (!isNonEmptyArrayValue(input.decisionMap)) {
    pushIssue(issues, {
      path: "$.decisionMap",
      code: "empty_value",
      message: "$.decisionMap must contain at least one decision branch.",
      severity: "error",
      received: input.decisionMap,
    });
  } else {
    input.decisionMap.forEach((item, index) =>
      validateDecisionBranch(item, `$.decisionMap[${index}]`, issues),
    );
  }

  if (!isNonEmptyArrayValue(input.completionStandard)) {
    pushIssue(issues, {
      path: "$.completionStandard",
      code: "missing_completion_rule",
      message:
        "$.completionStandard must contain at least one completion rule.",
      severity: "error",
      received: input.completionStandard,
    });
  } else {
    input.completionStandard.forEach((item, index) =>
      validateCompletionRule(
        item,
        `$.completionStandard[${index}]`,
        issues,
      ),
    );
  }

  if (!isNonEmptyArrayValue(input.continuityTriggers)) {
    pushIssue(issues, {
      path: "$.continuityTriggers",
      code: "missing_continuity_rule",
      message:
        "$.continuityTriggers must contain at least one continuity trigger.",
      severity: "error",
      received: input.continuityTriggers,
    });
  } else {
    input.continuityTriggers.forEach((item, index) =>
      validateContinuityTrigger(
        item,
        `$.continuityTriggers[${index}]`,
        issues,
      ),
    );
  }

  validateSimulationPolicy(input.simulation, "$.simulation", issues);
  validateAssessmentPolicy(input.assessment, "$.assessment", issues);
  validateReturnContextPolicy(
    input.returnContext,
    "$.returnContext",
    issues,
  );
  validateVisibilityPolicy(input.visibility, "$.visibility", issues);
  validateAccessPolicy(input.accessPolicy, "$.accessPolicy", issues);
  validateMetadata(input.metadata, "$.metadata", issues);

  checkRequiredString(
    input.authorityBoundary,
    "$.authorityBoundary",
    issues,
  );

  if (
    input.nonSubstitutionRule !== TA14_ACADEMY_NON_SUBSTITUTION_RULE
  ) {
    pushIssue(issues, {
      path: "$.nonSubstitutionRule",
      code: "authority_boundary_missing",
      message:
        "$.nonSubstitutionRule must match the canonical TA-14 Academy non-substitution rule.",
      severity: "error",
      received: input.nonSubstitutionRule,
      expected: TA14_ACADEMY_NON_SUBSTITUTION_RULE,
    });
  }

  if (!isContentHash(input.contentHash)) {
    pushIssue(issues, {
      path: "$.contentHash",
      code: "invalid_hash",
      message:
        "$.contentHash must use sha256: followed by 64 hexadecimal characters.",
      severity: "error",
      received: input.contentHash,
    });
  }

  if (!isISODateTime(input.effectiveAt)) {
    pushIssue(issues, {
      path: "$.effectiveAt",
      code: "invalid_effective_time",
      message: "$.effectiveAt must be an ISO date-time string.",
      severity: "error",
      received: input.effectiveAt,
    });
  }

  if (
    input.expiresAt !== undefined &&
    !isISODateTime(input.expiresAt)
  ) {
    pushIssue(issues, {
      path: "$.expiresAt",
      code: "invalid_effective_time",
      message: "$.expiresAt must be an ISO date-time string.",
      severity: "error",
      received: input.expiresAt,
    });
  }

  if (
    isISODateTime(input.effectiveAt) &&
    isISODateTime(input.expiresAt) &&
    Date.parse(input.expiresAt) <= Date.parse(input.effectiveAt)
  ) {
    pushIssue(issues, {
      path: "$.expiresAt",
      code: "inconsistent_state",
      message: "$.expiresAt must be later than $.effectiveAt.",
      severity: "error",
      received: input.expiresAt,
    });
  }

  if (!isOneOf(input.publicationState, LESSON_PUBLICATION_STATES)) {
    pushIssue(issues, {
      path: "$.publicationState",
      code: "unsupported_value",
      message: "$.publicationState is not supported.",
      severity: "error",
      received: input.publicationState,
    });
  }

  if (
    input.publicationState === "superseded" &&
    !isNonEmptyString(input.supersedesLessonId)
  ) {
    pushIssue(issues, {
      path: "$.supersedesLessonId",
      code: "invalid_supersession",
      message:
        "$.supersedesLessonId is required when publicationState is superseded.",
      severity: "warning",
      received: input.supersedesLessonId,
    });
  }

  if (
    input.publicationState === "active" &&
    isObject(input.metadata) &&
    !isNonEmptyString(input.metadata.approvedBy)
  ) {
    pushIssue(issues, {
      path: "$.metadata.approvedBy",
      code: "required",
      message:
        "$.metadata.approvedBy is required for active lesson versions.",
      severity: "error",
      received: input.metadata.approvedBy,
    });
  }

  checkStringArray(
    input.relatedLessons,
    "$.relatedLessons",
    issues,
  );
  checkStringArray(
    input.requiredCredentialIds,
    "$.requiredCredentialIds",
    issues,
  );
  checkStringArray(
    input.requiredAuthorityGrantTypes,
    "$.requiredAuthorityGrantTypes",
    issues,
  );

  const hasErrors = issues.some((issue) => issue.severity === "error");

  return {
    ok: !hasErrors,
    value: !hasErrors
      ? (input as unknown as AcademyLessonDefinition)
      : undefined,
    issues,
  };
}

export function parseAcademyLessonDefinition(
  input: unknown,
): AcademyLessonDefinition {
  const result = validateAcademyLessonDefinition(input);

  if (!result.ok || !result.value) {
    throw new AcademyContractValidationError(
      "Academy lesson definition failed validation.",
      result.issues,
    );
  }

  return deepFreeze(result.value);
}

/* ========================================================================== *
 * Immutability and supersession
 * ========================================================================== */

export function deepFreeze<T>(value: T): T {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  Object.freeze(value);

  for (const key of Object.keys(value as object)) {
    const child = (value as Record<string, unknown>)[key];
    deepFreeze(child);
  }

  return value;
}

const MUTABLE_METADATA_FIELDS = new Set([
  "metadata.updatedAt",
  "metadata.updatedBy",
]);

export interface ImmutabilityCheckResult {
  readonly ok: boolean;
  readonly changedPaths: readonly string[];
  readonly prohibitedPaths: readonly string[];
}

export function compareLessonVersionsForImmutability(
  previous: AcademyLessonDefinition,
  next: AcademyLessonDefinition,
): ImmutabilityCheckResult {
  const changedPaths = diffPaths(previous, next);
  const prohibitedPaths =
    previous.publicationState === "active"
      ? changedPaths.filter((path) => !MUTABLE_METADATA_FIELDS.has(path))
      : [];

  return {
    ok: prohibitedPaths.length === 0,
    changedPaths,
    prohibitedPaths,
  };
}

function diffPaths(
  previous: unknown,
  next: unknown,
  basePath = "",
): string[] {
  if (Object.is(previous, next)) return [];

  if (
    typeof previous !== typeof next ||
    previous === null ||
    next === null ||
    typeof previous !== "object"
  ) {
    return [basePath || "$"];
  }

  if (Array.isArray(previous) || Array.isArray(next)) {
    if (!Array.isArray(previous) || !Array.isArray(next)) {
      return [basePath || "$"];
    }

    const max = Math.max(previous.length, next.length);
    const changes: string[] = [];

    for (let index = 0; index < max; index += 1) {
      changes.push(
        ...diffPaths(
          previous[index],
          next[index],
          `${basePath}[${index}]`,
        ),
      );
    }

    return changes;
  }

  const previousRecord = previous as Record<string, unknown>;
  const nextRecord = next as Record<string, unknown>;
  const keys = new Set([
    ...Object.keys(previousRecord),
    ...Object.keys(nextRecord),
  ]);
  const changes: string[] = [];

  for (const key of keys) {
    const path = basePath ? `${basePath}.${key}` : key;
    changes.push(
      ...diffPaths(previousRecord[key], nextRecord[key], path),
    );
  }

  return changes;
}

export interface SupersessionValidationResult {
  readonly ok: boolean;
  readonly issues: readonly ValidationIssue[];
}

export function validateLessonSupersession(
  previous: AcademyLessonDefinition,
  next: AcademyLessonDefinition,
): SupersessionValidationResult {
  const issues: ValidationIssue[] = [];

  if (previous.lessonId !== next.lessonId) {
    pushIssue(issues, {
      path: "$.lessonId",
      code: "invalid_supersession",
      message:
        "A new lesson version must preserve the stable lessonId.",
      severity: "error",
      received: next.lessonId,
      expected: previous.lessonId,
    });
  }

  if (previous.version === next.version) {
    pushIssue(issues, {
      path: "$.version",
      code: "invalid_supersession",
      message:
        "A superseding lesson version must use a different version.",
      severity: "error",
      received: next.version,
    });
  }

  if (previous.contentHash === next.contentHash) {
    pushIssue(issues, {
      path: "$.contentHash",
      code: "invalid_supersession",
      message:
        "A superseding lesson version must use a new content hash.",
      severity: "error",
      received: next.contentHash,
    });
  }

  if (next.supersedesLessonId !== previous.lessonId) {
    pushIssue(issues, {
      path: "$.supersedesLessonId",
      code: "invalid_supersession",
      message:
        "The superseding version must reference the prior stable lessonId.",
      severity: "error",
      received: next.supersedesLessonId,
      expected: previous.lessonId,
    });
  }

  if (next.supersedesVersion !== previous.version) {
    pushIssue(issues, {
      path: "$.supersedesVersion",
      code: "invalid_supersession",
      message:
        "The superseding version must reference the prior version.",
      severity: "error",
      received: next.supersedesVersion,
      expected: previous.version,
    });
  }

  if (Date.parse(next.effectiveAt) <= Date.parse(previous.effectiveAt)) {
    pushIssue(issues, {
      path: "$.effectiveAt",
      code: "invalid_supersession",
      message:
        "The superseding version must become effective after the prior version.",
      severity: "error",
      received: next.effectiveAt,
    });
  }

  return {
    ok: !issues.some((issue) => issue.severity === "error"),
    issues,
  };
}

/* ========================================================================== *
 * Projection safety
 * ========================================================================== */

export interface AcademyLessonProjection {
  readonly lessonId: LessonIdentifier;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly version: string;
  readonly locale: LocaleCode;
  readonly division: InstitutionalDivision;
  readonly operationalFunctions: readonly string[];
  readonly operationalRoutes: readonly RoutePattern[];
  readonly recordTypes: readonly InstitutionalRecordType[];
  readonly roles: readonly InstitutionalRole[];
  readonly learningObjectives: readonly string[];
  readonly institutionalBasis: readonly InstitutionalBasis[];
  readonly steps: readonly LessonStep[];
  readonly decisionMap: readonly DecisionBranch[];
  readonly completionStandard: readonly CompletionRule[];
  readonly authorityBoundary: string;
  readonly nonSubstitutionRule: string;
  readonly publicationState: LessonPublicationState;
  readonly effectiveAt: ISODateTimeString;
  readonly simulation: Pick<
    SimulationPolicy,
    | "available"
    | "required"
    | "persistentMarker"
    | "mayCreateRegistryEffect"
    | "mayCreateArtifactEffect"
    | "mayCreateAuthorityEffect"
    | "handoffPolicy"
    | "limitations"
  >;
}

export function projectAcademyLesson(
  lesson: AcademyLessonDefinition,
  projection: ProjectionClass,
  role?: InstitutionalRole,
): AcademyLessonProjection {
  assertProjectionAllowed(lesson, projection, role);

  return {
    lessonId: lesson.lessonId,
    slug: lesson.slug,
    title: lesson.title,
    summary: lesson.summary,
    version: lesson.version,
    locale: lesson.locale,
    division: lesson.division,
    operationalFunctions: lesson.operationalFunctions,
    operationalRoutes: lesson.operationalRoutes,
    recordTypes: lesson.recordTypes,
    roles: lesson.roles,
    learningObjectives: lesson.learningObjectives,
    institutionalBasis: lesson.institutionalBasis,
    steps: lesson.steps,
    decisionMap: lesson.decisionMap,
    completionStandard: lesson.completionStandard,
    authorityBoundary: lesson.authorityBoundary,
    nonSubstitutionRule: lesson.nonSubstitutionRule,
    publicationState: lesson.publicationState,
    effectiveAt: lesson.effectiveAt,
    simulation: {
      available: lesson.simulation.available,
      required: lesson.simulation.required,
      persistentMarker: lesson.simulation.persistentMarker,
      mayCreateRegistryEffect:
        lesson.simulation.mayCreateRegistryEffect,
      mayCreateArtifactEffect:
        lesson.simulation.mayCreateArtifactEffect,
      mayCreateAuthorityEffect:
        lesson.simulation.mayCreateAuthorityEffect,
      handoffPolicy: lesson.simulation.handoffPolicy,
      limitations: lesson.simulation.limitations,
    },
  };
}

function assertProjectionAllowed(
  lesson: AcademyLessonDefinition,
  projection: ProjectionClass,
  role?: InstitutionalRole,
): void {
  if (
    projection === "public" &&
    (!lesson.visibility.publicSafe ||
      lesson.publicationState !== "active")
  ) {
    throw new AcademyContractValidationError(
      "Lesson is not eligible for public projection.",
      [
        {
          path: "$.visibility",
          code: "unsafe_projection",
          message:
            "Public projection requires an active, public-safe lesson.",
          severity: "error",
          received: {
            publicSafe: lesson.visibility.publicSafe,
            publicationState: lesson.publicationState,
          },
        },
      ],
    );
  }

  if (
    lesson.visibility.permittedRoles &&
    lesson.visibility.permittedRoles.length > 0 &&
    role &&
    !lesson.visibility.permittedRoles.includes(role)
  ) {
    throw new AcademyContractValidationError(
      "Role is not permitted to view this lesson projection.",
      [
        {
          path: "$.visibility.permittedRoles",
          code: "unsafe_projection",
          message: `Role ${role} is not permitted.`,
          severity: "error",
          received: role,
        },
      ],
    );
  }
}

/* ========================================================================== *
 * Canonical factories
 * ========================================================================== */

export function createDefaultSimulationPolicy(
  overrides: Partial<SimulationPolicy> = {},
): SimulationPolicy {
  return {
    available: false,
    required: false,
    scenarioIds: [],
    persistentMarker: "SIMULATION - NO PRODUCTION EFFECT",
    separateIdentifierPrefix: "TA14-SIM",
    mayUseProductionForeignKeys: false,
    mayCreateRegistryEffect: false,
    mayCreateArtifactEffect: false,
    mayCreateAuthorityEffect: false,
    allowedDataClasses: ["fictional", "redacted"],
    exportAllowed: false,
    screenshotAllowed: false,
    exportNotice:
      "SIMULATION - NO PRODUCTION EFFECT. This output is not a live institutional record, determination, artifact, or Registry record.",
    handoffPolicy: "none",
    limitations: [
      "Simulation output may not be presented as completed live work.",
      "Simulation completion creates no authority.",
      "Simulation output may not be registered as an execution artifact.",
    ],
    ...overrides,
  };
}

export function createDefaultAssessmentPolicy(
  overrides: Partial<AssessmentPolicy> = {},
): AssessmentPolicy {
  return {
    required: false,
    assessmentIds: [],
    boundaryFailuresAlwaysFail: true,
    evaluator: "not_applicable",
    createsCredentialEligibilityOnly: true,
    createsAuthority: false,
    underReviewOnAmbiguity: true,
    ...overrides,
  };
}

export function createDefaultReturnContextPolicy(
  fallbackRoute: RoutePattern,
  overrides: Partial<ReturnContextPolicy> = {},
): ReturnContextPolicy {
  return {
    enabled: true,
    allowedRoutePatterns: [fallbackRoute],
    requireRecordId: false,
    requireActionId: false,
    preserveRole: true,
    preserveLifecycleState: true,
    preserveScrollAnchor: true,
    signed: true,
    ttlSeconds: 3600,
    allowedQueryKeys: [
      "recordId",
      "actionId",
      "role",
      "state",
      "anchor",
    ],
    blockedQueryKeys: [
      "token",
      "access_token",
      "refresh_token",
      "authorization",
      "secret",
    ],
    fallbackRoute,
    ...overrides,
  };
}

export function createDefaultVisibilityPolicy(
  overrides: Partial<VisibilityPolicy> = {},
): VisibilityPolicy {
  return {
    visibility: "controlled",
    publicSafe: false,
    protectedFields: [],
    omittedFieldsByProjection: {
      public: [
        "examples",
        "metadata",
        "accessPolicy",
        "requiredCredentialIds",
        "requiredAuthorityGrantTypes",
      ],
    },
    ...overrides,
  };
}

export function createDefaultAccessPolicy(
  permittedRoles: readonly InstitutionalRole[],
  overrides: Partial<AccessPolicy> = {},
): AccessPolicy {
  return {
    authenticationRequired: true,
    permittedRoles,
    organizationMatchRequired: false,
    assignmentRequired: false,
    authorityGrantRequired: false,
    requiredAuthorityGrantTypes: [],
    serviceRoleOnlyOperations: [
      "activate_lesson_version",
      "supersede_lesson_version",
      "emit_integrity_event",
      "run_continuity_scan",
    ],
    ...overrides,
  };
}

/* ========================================================================== *
 * Canonical registration lesson example
 * ========================================================================== */

export const GOVERNANCE_ENTITY_REGISTRATION_LESSON_ID =
  "TA14-ACD-LESSON-000003" as const;

export const governanceEntityRegistrationLessonExample:
  AcademyLessonDefinition = deepFreeze({
    lessonId: GOVERNANCE_ENTITY_REGISTRATION_LESSON_ID,
    slug: "ai-governance/entity-registration",
    title: "Register a Governance Entity",
    summary:
      "Create a free, attributable, versioned governance entity registration without collapsing registration into review, endorsement, approval, certification, or payment.",
    version: "3.0",
    locale: "en-US",
    division: "ai-governance-exchange",

    operationalFunctions: [
      "governance_entity_registration",
      "free_registration_issuance",
    ],
    operationalRoutes: [
      "/workspace/entities/new",
      "/workspace/ai-governance/entities/new",
    ],
    recordTypes: [
      "governance_entity",
      "governance_registration",
      "institutional_subject",
    ],
    roles: [
      "participant",
      "registered_participant",
      "entity_steward",
      "registry_reviewer",
    ],

    learningObjectives: [
      "Distinguish free registration from review, endorsement, verification, approval, certification, and paid institutional services.",
      "Declare identity, stewardship, architecture, jurisdiction, claims, non-claims, versions, and authority boundaries.",
      "Attach permitted DOI, Zenodo, patent, repository, publication, standards, and public evidence references.",
      "Understand the explicit registration states from Draft through Registered and Publicly Projected.",
    ],

    prerequisites: [
      {
        prerequisiteId: "REG-PREQ-001",
        type: "attestation",
        title: "Attributable submitter",
        description:
          "The submitting person must identify the institutional subject and attest that they are authorized to create or maintain the registration.",
        enforcement: "blocking",
        requiredState: "attested",
        completionMessage:
          "The submitter identity and attestation are present.",
        failureMessage:
          "Registration cannot be issued without attributable submitter identity and attestation.",
      },
    ],

    institutionalBasis: [
      {
        basisId: "registry.identity_rule",
        basisType: "institutional_rule",
        title: "Governance entity identity rule",
        description:
          "A governance entity must establish attributable identity, stewardship, jurisdiction, architecture, claims, non-claims, and version before participating in artifact registration.",
        version: "3.0",
        effectiveAt: "2026-08-04T00:00:00Z",
      },
      {
        basisId: "artifact.registration_prerequisite",
        basisType: "record_requirement",
        title: "Artifact registration prerequisite",
        description:
          "An execution artifact may be registered only by a governance entity that has first completed governance registration.",
        version: "3.0",
        effectiveAt: "2026-08-04T00:00:00Z",
      },
      {
        basisId: "commercial.free_registration_boundary",
        basisType: "commercial_boundary",
        title: "Free registration boundary",
        description:
          "Governance entity registration does not require payment. Paid services begin only when TA-14 is asked to organize evidence, perform review, construct demonstrations, create artifacts, or preserve additional institutional work.",
        version: "3.0",
        effectiveAt: "2026-08-04T00:00:00Z",
      },
    ],

    evidenceStandard: [
      {
        ruleId: "REG-EVID-001",
        title: "Public evidence references",
        description:
          "DOIs, Zenodo deposits, patents, publications, repositories, standards work, and other public references must be attributable, permitted, current enough for the declared version, and relevant to the bounded registration.",
        acceptedClasses: [
          "public",
          "controlled",
          "conditionally_permitted",
        ],
        prohibitedClasses: ["excluded"],
        provenanceRequired: true,
        attributionRequired: true,
        currencyRequired: true,
        permissionRequired: true,
        integrityReferenceRequired: false,
        scopeRelevanceRequired: true,
        retentionRequired: true,
        confidentialityHandling:
          "Controlled or confidential references must not be publicly projected unless separately permitted.",
        failureResult: "CORRECT",
      },
    ],

    steps: [
      {
        stepId: "REG-STEP-001",
        order: 1,
        title: "Identify the governance entity",
        purpose:
          "Establish the stable institutional identity of the entity being registered.",
        instructions: [
          "Provide the legal, operating, or declared entity name.",
          "Identify the responsible steward and organization.",
          "Declare jurisdiction and contact boundaries.",
        ],
        liveUiLabel: "Entity identity",
        liveRoute: "/workspace/entities/new",
        requiredRole: "entity_steward",
        requiredRecordType: "governance_entity",
        completionRuleIds: ["REG-COMP-001"],
        authorityBoundary:
          "Completing identity fields does not issue the registration.",
        nextStepId: "REG-STEP-002",
      },
      {
        stepId: "REG-STEP-002",
        order: 2,
        title: "Declare architecture and bounded capability",
        purpose:
          "Describe what the governance system is, what it claims to do, and what remains outside scope.",
        instructions: [
          "Describe the governance architecture.",
          "Declare bounded capabilities and jurisdictions.",
          "State explicit non-claims, dependencies, and limitations.",
          "Identify the current version.",
        ],
        liveUiLabel: "Architecture and capability",
        liveRoute: "/workspace/entities/new",
        requiredRole: "entity_steward",
        completionRuleIds: ["REG-COMP-002"],
        authorityBoundary:
          "The declaration is attributable to the entity. TA-14 registration does not verify the declared capability.",
        nextStepId: "REG-STEP-003",
      },
      {
        stepId: "REG-STEP-003",
        order: 3,
        title: "Attach permitted references",
        purpose:
          "Connect the registration to public or controlled evidence references without implying substantive review.",
        instructions: [
          "Add DOI and Zenodo references.",
          "Add patents, publications, repositories, and standards work.",
          "Classify each reference by visibility and permission.",
          "State which claim or architecture element each reference supports.",
        ],
        liveUiLabel: "Evidence references",
        liveRoute: "/workspace/entities/new",
        requiredRole: "entity_steward",
        evidenceRuleIds: ["REG-EVID-001"],
        completionRuleIds: ["REG-COMP-003"],
        authorityBoundary:
          "Referenced evidence remains declared evidence until separately admitted or reviewed.",
        nextStepId: "REG-STEP-004",
      },
      {
        stepId: "REG-STEP-004",
        order: 4,
        title: "Submit for technical completeness",
        purpose:
          "Request server-side completeness, attribution, uniqueness, and policy checks.",
        instructions: [
          "Review identity, architecture, claims, non-claims, versions, and references.",
          "Attest that the submission is complete for processing.",
          "Submit the registration.",
        ],
        liveUiLabel: "Submit registration",
        liveRoute: "/workspace/entities/new",
        requiredRole: "entity_steward",
        prerequisiteIds: ["REG-PREQ-001"],
        completionRuleIds: ["REG-COMP-004"],
        authorityBoundary:
          "Submission creates an immutable event but does not issue the registration.",
        nextStepId: "REG-STEP-005",
      },
      {
        stepId: "REG-STEP-005",
        order: 5,
        title: "Receive registration issuance",
        purpose:
          "Allow the Registration Issuance Service to create the TA-14 governance entity identifier and versioned registration record.",
        instructions: [
          "Resolve any returned corrections.",
          "Wait for technical completeness checks.",
          "Receive the issued governance entity identifier.",
        ],
        liveUiLabel: "Registration status",
        liveRoute: "/workspace/entities/new",
        requiredRole: "entity_steward",
        completionRuleIds: ["REG-COMP-005"],
        authorityBoundary:
          "Registration issuance is not a substantive review, approval, endorsement, verification, or certification.",
      },
    ],

    decisionMap: [
      {
        branchId: "REG-DEC-001",
        title: "Registration technically complete",
        conditions: [
          {
            field: "registration.technicalCompleteness",
            operator: "equals",
            value: true,
          },
        ],
        result: "ALLOW",
        explanation:
          "Required identity, jurisdiction, stewardship, claims, non-claims, versions, and references are present.",
        institutionalEffect:
          "The Registration Issuance Service may issue the free governance entity registration.",
        nextAction: "issue_registration",
        blocking: false,
      },
      {
        branchId: "REG-DEC-002",
        title: "Registration incomplete",
        conditions: [
          {
            field: "registration.technicalCompleteness",
            operator: "equals",
            value: false,
          },
        ],
        result: "CORRECT",
        explanation:
          "Required fields, attribution, or version information are incomplete or inconsistent.",
        institutionalEffect:
          "Registration remains unissued or non-current until corrected.",
        nextAction: "return_for_correction",
        blocking: true,
      },
      {
        branchId: "REG-DEC-003",
        title: "Public projection withheld",
        conditions: [
          {
            field: "registration.publicProjectionPermitted",
            operator: "equals",
            value: false,
          },
        ],
        result: "HOLD",
        explanation:
          "The registration may exist while its public projection remains withheld.",
        institutionalEffect:
          "The institutional record is preserved without publishing protected fields.",
        nextAction: "resolve_projection_permissions",
        blocking: false,
      },
    ],

    examples: [
      {
        exampleId: "REG-EX-001",
        title: "Fictional governance entity registration",
        description:
          "A completed fictional registration showing identity, architecture, claims, non-claims, versions, and DOI references.",
        classification: "fictional",
        recordType: "governance_registration",
        route: "/academy/ai-governance/entity-registration/examples/fictional",
        permittedProjections: ["public", "authenticated"],
        limitations: [
          "The example is fictional.",
          "The example does not demonstrate substantive review.",
          "The example does not create authority.",
        ],
        authorityBoundary:
          "Examples teach field meaning and completion structure only.",
      },
    ],

    completionStandard: [
      {
        ruleId: "REG-COMP-001",
        title: "Identity complete",
        description:
          "Entity name, steward, organization, jurisdiction, and attribution are present.",
        field: "registration.identityComplete",
        operator: "equals",
        expected: true,
        enforcement: "blocking",
        serverVerificationRequired: true,
        authoritativeService: "RegistrationCompletenessService",
        failureResult: "CORRECT",
        successMessage: "Identity and stewardship are complete.",
        failureMessage:
          "Complete entity identity, stewardship, and jurisdiction.",
      },
      {
        ruleId: "REG-COMP-002",
        title: "Architecture declaration complete",
        description:
          "Architecture, bounded capabilities, non-claims, limitations, dependencies, and version are present.",
        field: "registration.architectureDeclarationComplete",
        operator: "equals",
        expected: true,
        enforcement: "blocking",
        serverVerificationRequired: true,
        authoritativeService: "RegistrationCompletenessService",
        failureResult: "CORRECT",
        successMessage: "Architecture declaration is complete.",
        failureMessage:
          "Complete architecture, capability, non-claim, limitation, dependency, and version fields.",
      },
      {
        ruleId: "REG-COMP-003",
        title: "Evidence references classified",
        description:
          "Every submitted reference has attribution, permission, relevance, and visibility classification.",
        field: "registration.referencesClassified",
        operator: "equals",
        expected: true,
        enforcement: "blocking",
        serverVerificationRequired: true,
        authoritativeService: "RegistrationCompletenessService",
        failureResult: "CORRECT",
        successMessage: "Evidence references are classified.",
        failureMessage:
          "Classify attribution, permission, relevance, and visibility for each reference.",
      },
      {
        ruleId: "REG-COMP-004",
        title: "Submission event committed",
        description:
          "The entity steward has attested and submitted the registration.",
        field: "registration.state",
        operator: "equals",
        expected: "submitted",
        enforcement: "blocking",
        serverVerificationRequired: true,
        authoritativeService: "RegistrationSubmissionService",
        failureResult: "HOLD",
        successMessage: "Registration submission is preserved.",
        failureMessage: "Submit the registration for processing.",
      },
      {
        ruleId: "REG-COMP-005",
        title: "Registration issued",
        description:
          "The Registration Issuance Service has created the governance entity identifier and versioned registration record.",
        field: "registration.state",
        operator: "equals",
        expected: "registered",
        enforcement: "blocking",
        serverVerificationRequired: true,
        authoritativeService: "RegistrationIssuanceService",
        failureResult: "HOLD",
        successMessage:
          "The governance entity registration has been issued.",
        failureMessage:
          "The registration is not yet issued. Resolve corrections or wait for issuance.",
      },
    ],

    failureConsequences: [
      {
        consequenceId: "REG-FAIL-001",
        trigger: "missing_required_identity",
        result: "CORRECT",
        description:
          "Registration is returned for correction when attributable identity is incomplete.",
        blocksLiveWork: true,
        blocksInstitutionalEffect: true,
        createsAction: true,
        actionType: "complete_registration_identity",
      },
      {
        consequenceId: "REG-FAIL-002",
        trigger: "duplicate_entity_identity",
        result: "ESCALATE",
        description:
          "Potential duplicate identity requires institutional resolution before a new identifier is issued.",
        blocksLiveWork: true,
        blocksInstitutionalEffect: true,
        createsAction: true,
        actionType: "resolve_duplicate_entity",
      },
      {
        consequenceId: "REG-FAIL-003",
        trigger: "public_projection_not_permitted",
        result: "HOLD",
        description:
          "The registration may remain valid while public projection is held.",
        blocksLiveWork: false,
        blocksInstitutionalEffect: false,
        createsAction: true,
        actionType: "resolve_public_projection",
      },
    ],

    relatedLessons: [
      "TA14-ACD-LESSON-000001",
      "TA14-ACD-LESSON-000002",
      "TA14-ACD-LESSON-000004",
      "TA14-ACD-LESSON-000005",
    ],

    simulation: createDefaultSimulationPolicy({
      available: true,
      required: false,
      scenarioIds: ["SIM-ENTITY-REG-001"],
      handoffPolicy: "reviewed_inputs_only",
      exportAllowed: true,
      screenshotAllowed: true,
      allowedDataClasses: [
        "fictional",
        "redacted",
        "participant_approved",
      ],
      limitations: [
        "Simulation data may not satisfy production foreign keys.",
        "Simulation results may not be registered.",
        "Only reviewed inputs may be copied into a live record.",
        "Simulation completion creates no registration or authority.",
      ],
    }),

    assessment: createDefaultAssessmentPolicy({
      required: false,
      evaluator: "not_applicable",
    }),

    requiredCredentialIds: [],
    requiredAuthorityGrantTypes: [],

    continuityTriggers: [
      {
        triggerId: "REG-CONT-001",
        type: "identity_change",
        description:
          "A material entity identity change requires registration review and possible supersession.",
        severity: "high",
        affectsProgress: false,
        affectsAssessment: false,
        affectsCredential: false,
        affectsAuthorityEligibility: true,
        mayHoldAssignments: true,
        requiredAction: "revalidate",
      },
      {
        triggerId: "REG-CONT-002",
        type: "ownership_change",
        description:
          "A change in ownership or stewardship requires attributable update and revalidation.",
        severity: "high",
        affectsProgress: false,
        affectsAssessment: false,
        affectsCredential: false,
        affectsAuthorityEligibility: true,
        mayHoldAssignments: true,
        requiredAction: "revalidate",
      },
      {
        triggerId: "REG-CONT-003",
        type: "authority_change",
        description:
          "A change in responsible authority requires a current registration update.",
        severity: "high",
        affectsProgress: false,
        affectsAssessment: false,
        affectsCredential: false,
        affectsAuthorityEligibility: true,
        mayHoldAssignments: true,
        requiredAction: "authority_review",
      },
      {
        triggerId: "REG-CONT-004",
        type: "architecture_change",
        description:
          "A material architecture version change requires a superseding registration version.",
        severity: "critical",
        affectsProgress: true,
        affectsAssessment: false,
        affectsCredential: false,
        affectsAuthorityEligibility: true,
        mayHoldAssignments: true,
        requiredAction: "revalidate",
      },
    ],

    returnContext: createDefaultReturnContextPolicy(
      "/workspace/entities/new",
      {
        allowedRoutePatterns: [
          "/workspace/entities/new",
          "/workspace/ai-governance/entities/new",
          "/workspace/entities/*",
        ],
        requireRecordId: false,
        requireActionId: false,
      },
    ),

    visibility: createDefaultVisibilityPolicy({
      visibility: "mixed",
      publicSafe: true,
      protectedFields: [
        "private_contacts",
        "controlled_evidence",
        "confidential_references",
        "internal_notes",
      ],
      omittedFieldsByProjection: {
        public: [
          "examples",
          "metadata",
          "accessPolicy",
          "private_contacts",
          "controlled_evidence",
          "confidential_references",
          "internal_notes",
        ],
      },
    }),

    accessPolicy: createDefaultAccessPolicy(
      [
        "visitor",
        "participant",
        "registered_participant",
        "entity_steward",
        "registry_reviewer",
        "institutional_administrator",
      ],
      {
        authenticationRequired: false,
        organizationMatchRequired: false,
      },
    ),

    authorityBoundary:
      "This lesson may prepare a governance entity registration. It does not issue, review, endorse, verify, approve, certify, or create substantive authority.",

    nonSubstitutionRule: TA14_ACADEMY_NON_SUBSTITUTION_RULE,

    contentHash:
      "sha256:0000000000000000000000000000000000000000000000000000000000000000",
    effectiveAt: "2026-08-04T00:00:00Z",
    publicationState: "active",

    metadata: {
      ownerSubjectId: "TA14-SUBJECT-ACADEMY",
      ownerOrganizationId: "TA14-AUTHORITY",
      lessonOwnerRole: "academy_instructor",
      divisionStewardId: "TA14-SUBJECT-AI-GOVERNANCE",
      academyStandardsReviewerId: "TA14-SUBJECT-ACADEMY-STANDARDS",
      technicalOwnerId: "TA14-SUBJECT-TECHNICAL",
      createdAt: "2026-08-04T00:00:00Z",
      createdBy: "TA14-SUBJECT-ACADEMY",
      updatedAt: "2026-08-04T00:00:00Z",
      updatedBy: "TA14-SUBJECT-ACADEMY",
      approvedAt: "2026-08-04T00:00:00Z",
      approvedBy: "TA14-SUBJECT-ACADEMY-STANDARDS",
    },
  });

/* ========================================================================== *
 * Registration state contract
 * ========================================================================== */

export const GOVERNANCE_REGISTRATION_STATES = [
  "draft",
  "submitted",
  "technically_complete",
  "registered",
  "publicly_projected",
  "returned_for_correction",
  "under_institutional_review",
  "superseded",
] as const;

export type GovernanceRegistrationState =
  (typeof GOVERNANCE_REGISTRATION_STATES)[number];

export interface GovernanceRegistrationStateDefinition {
  readonly state: GovernanceRegistrationState;
  readonly meaning: string;
  readonly institutionalEffect: string;
  readonly requiresPayment: false;
  readonly impliesReview: false;
  readonly impliesEndorsement: false;
  readonly impliesVerification: false;
  readonly impliesCertification: false;
}

export const GOVERNANCE_REGISTRATION_STATE_DEFINITIONS:
  readonly GovernanceRegistrationStateDefinition[] = deepFreeze([
    {
      state: "draft",
      meaning:
        "The entity has started but not submitted the registration.",
      institutionalEffect:
        "No Registry identifier and no artifact eligibility.",
      requiresPayment: false,
      impliesReview: false,
      impliesEndorsement: false,
      impliesVerification: false,
      impliesCertification: false,
    },
    {
      state: "submitted",
      meaning:
        "The entity attests that the record is complete for processing.",
      institutionalEffect:
        "Creates an immutable registration submission event.",
      requiresPayment: false,
      impliesReview: false,
      impliesEndorsement: false,
      impliesVerification: false,
      impliesCertification: false,
    },
    {
      state: "technically_complete",
      meaning:
        "Required identity, jurisdiction, stewardship, claims, non-claims, versions, and references are present.",
      institutionalEffect:
        "Eligible for free registration issuance.",
      requiresPayment: false,
      impliesReview: false,
      impliesEndorsement: false,
      impliesVerification: false,
      impliesCertification: false,
    },
    {
      state: "registered",
      meaning:
        "A TA-14 governance entity identifier and versioned registration record exist.",
      institutionalEffect:
        "May proceed to claims, demonstrations, and artifact eligibility checks.",
      requiresPayment: false,
      impliesReview: false,
      impliesEndorsement: false,
      impliesVerification: false,
      impliesCertification: false,
    },
    {
      state: "publicly_projected",
      meaning:
        "The permitted public projection is published.",
      institutionalEffect:
        "Creates public visibility without implying review, endorsement, or verification.",
      requiresPayment: false,
      impliesReview: false,
      impliesEndorsement: false,
      impliesVerification: false,
      impliesCertification: false,
    },
    {
      state: "returned_for_correction",
      meaning:
        "Required fields, attribution, or version information are incomplete or inconsistent.",
      institutionalEffect:
        "Registration remains unissued or non-current until corrected.",
      requiresPayment: false,
      impliesReview: false,
      impliesEndorsement: false,
      impliesVerification: false,
      impliesCertification: false,
    },
    {
      state: "under_institutional_review",
      meaning:
        "A separate paid or authorized review pathway has begun.",
      institutionalEffect:
        "Creates review records without changing the meaning of registration.",
      requiresPayment: false,
      impliesReview: false,
      impliesEndorsement: false,
      impliesVerification: false,
      impliesCertification: false,
    },
    {
      state: "superseded",
      meaning:
        "A later registration version is current.",
      institutionalEffect:
        "Prior registration remains preserved in institutional history.",
      requiresPayment: false,
      impliesReview: false,
      impliesEndorsement: false,
      impliesVerification: false,
      impliesCertification: false,
    },
  ]);

/* ========================================================================== *
 * Utility guards
 * ========================================================================== */

export function isInstitutionalDivision(
  value: unknown,
): value is InstitutionalDivision {
  return isOneOf(value, INSTITUTIONAL_DIVISIONS);
}

export function isInstitutionalRecordType(
  value: unknown,
): value is InstitutionalRecordType {
  return isOneOf(value, INSTITUTIONAL_RECORD_TYPES);
}

export function isInstitutionalRole(
  value: unknown,
): value is InstitutionalRole {
  return isOneOf(value, INSTITUTIONAL_ROLES);
}

export function isProjectionClass(
  value: unknown,
): value is ProjectionClass {
  return isOneOf(value, PROJECTION_CLASSES);
}

export function isAcademyEventType(
  value: unknown,
): value is AcademyEventType {
  return isOneOf(value, ACADEMY_EVENT_TYPES);
}

export function isGovernanceRegistrationState(
  value: unknown,
): value is GovernanceRegistrationState {
  return isOneOf(value, GOVERNANCE_REGISTRATION_STATES);
}

export function assertNever(
  value: never,
  message = "Unexpected value",
): never {
  throw new Error(`${message}: ${String(value)}`);
}

/* ========================================================================== *
 * Resolver scoring constants
 * ========================================================================== */

export const ACADEMY_RESOLVER_SCORES = deepFreeze({
  actionTypeExact: 100,
  recordTypeExact: 80,
  routeExact: 60,
  roleExact: 40,
  lifecycleStateExact: 25,
  blockerTypeExact: 20,
  supersededPenalty: -200,
  unsafeProjectionPenalty: -100,
} as const);

/* ========================================================================== *
 * Contract acceptance self-check
 * ========================================================================== */

export interface AcademyContractSelfCheck {
  readonly ok: boolean;
  readonly contractVersion: typeof TA14_ACADEMY_CONTRACT_VERSION;
  readonly exampleLessonValid: boolean;
  readonly issueCount: number;
  readonly issues: readonly ValidationIssue[];
}

export function runAcademyContractSelfCheck():
  AcademyContractSelfCheck {
  const result = validateAcademyLessonDefinition(
    governanceEntityRegistrationLessonExample,
  );

  return {
    ok: result.ok,
    contractVersion: TA14_ACADEMY_CONTRACT_VERSION,
    exampleLessonValid: result.ok,
    issueCount: result.issues.length,
    issues: result.issues,
  };
}

/* ========================================================================== *
 * Default export
 * ========================================================================== */

const academyLessonContracts = {
  contractVersion: TA14_ACADEMY_CONTRACT_VERSION,
  operatingPrinciple: TA14_ACADEMY_OPERATING_PRINCIPLE,
  nonSubstitutionRule: TA14_ACADEMY_NON_SUBSTITUTION_RULE,
  validateAcademyLessonDefinition,
  parseAcademyLessonDefinition,
  validateLessonSupersession,
  compareLessonVersionsForImmutability,
  projectAcademyLesson,
  runAcademyContractSelfCheck,
  governanceEntityRegistrationLessonExample,
  governanceRegistrationStates:
    GOVERNANCE_REGISTRATION_STATE_DEFINITIONS,
  resolverScores: ACADEMY_RESOLVER_SCORES,
};

export default academyLessonContracts;
