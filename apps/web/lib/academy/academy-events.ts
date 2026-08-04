/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * ACD-003 — Academy Institutional Event Engine
 *
 * Create:
 *   apps/web/lib/academy/academy-events.ts
 *
 * Purpose:
 *   Establish the canonical append-only event boundary for the TA-14 Academy.
 *
 * This file provides:
 *   - canonical Academy event names
 *   - immutable event envelopes
 *   - event creation and validation
 *   - idempotency and correlation support
 *   - integrity-hash inputs
 *   - append-only repository contracts
 *   - replay and reduction utilities
 *   - timeline and Mission Control projections
 *   - public-safe audit projections
 *   - continuity and revalidation event support
 *   - in-memory implementation for testing and demonstrations
 *
 * Constitutional boundary:
 *   Academy events record institutional transitions. They do not themselves
 *   create substantive authority, admit evidence, issue a registration,
 *   commit a determination, create an execution artifact, or publish a
 *   Registry record unless an authoritative service separately performs
 *   that transition.
 */

import type {
  AcademyEventType,
  AcademyInstitutionalEvent,
  AssessmentState,
  AuthorityState,
  ContentHash,
  CorrelationIdentifier,
  CredentialState,
  IdempotencyKey,
  InstitutionalIdentifier,
  InstitutionalRecordType,
  InstitutionalRole,
  ISODateTimeString,
  JsonValue,
  LessonLifecycleState,
  LessonPublicationState,
  OperationalHandoffState,
  ProjectionClass,
  SimulationState,
} from "./lesson-contracts";

import {
  ACADEMY_EVENT_TYPES,
  TA14_ACADEMY_NON_SUBSTITUTION_RULE,
  TA14_ACADEMY_OPERATING_PRINCIPLE,
  deepFreeze,
  isAcademyEventType,
  isInstitutionalRecordType,
  isInstitutionalRole,
  isProjectionClass,
} from "./lesson-contracts";

/* ========================================================================== *
 * Engine identity
 * ========================================================================== */

export const TA14_ACADEMY_EVENT_ENGINE_VERSION = "3.0" as const;

export const TA14_ACADEMY_EVENT_ENGINE_ID =
  "TA14-ACD-EVENT-ENGINE-000001" as const;

export const TA14_ACADEMY_EVENT_BOUNDARY =
  "Academy events preserve attributable institutional history. Event presence alone does not create substantive authority, evidentiary admission, registration issuance, determination, artifact effect, or Registry publication." as const;

/* ========================================================================== *
 * Additional canonical event types
 * ========================================================================== */

export const EXTENDED_ACADEMY_EVENT_TYPES = [
  ...ACADEMY_EVENT_TYPES,

  "academy.lesson.activation_requested",
  "academy.lesson.activated",
  "academy.lesson.restricted",
  "academy.lesson.withdrawn",

  "academy.return_context.created",
  "academy.return_context.restored",
  "academy.return_context.expired",
  "academy.return_context.rejected",

  "academy.content_gap.created",
  "academy.content_gap.resolved",

  "academy.learning_blocker.created",
  "academy.learning_blocker.updated",
  "academy.learning_blocker.resolved",
  "academy.learning_blocker.withdrawn",

  "academy.assessment.started",
  "academy.assessment.conditionally_passed",
  "academy.assessment.invalidated",
  "academy.assessment.review_requested",
  "academy.assessment.review_completed",

  "academy.credential.expiring",
  "academy.credential.expired",
  "academy.credential.superseded",

  "academy.authority.eligibility_removed",

  "academy.assignment.eligibility_checked",
  "academy.assignment.blocked",
  "academy.assignment.unblocked",

  "academy.simulation.started",
  "academy.simulation.reset",
  "academy.simulation.exported",
  "academy.simulation.handoff_requested",

  "academy.handoff.applied",
  "academy.handoff.closed",
  "academy.handoff.returned_for_correction",
  "academy.handoff.escalated",

  "academy.revalidation.started",
  "academy.revalidation.failed",
  "academy.revalidation.held",
  "academy.revalidation.withdrawn",

  "academy.continuity.scan_started",
  "academy.continuity.scan_completed",
  "academy.continuity.material_change_detected",

  "academy.projection.created",
  "academy.projection.updated",
  "academy.projection.withheld",

  "academy.audit.export_created",
  "academy.audit.export_downloaded",

  "academy.event.replayed",
  "academy.event.reconciliation_required",
] as const;

export type ExtendedAcademyEventType =
  (typeof EXTENDED_ACADEMY_EVENT_TYPES)[number];

/* ========================================================================== *
 * Event categories and institutional effects
 * ========================================================================== */

export const ACADEMY_EVENT_CATEGORIES = [
  "lesson",
  "enrollment",
  "progress",
  "simulation",
  "assessment",
  "credential",
  "authority",
  "handoff",
  "revalidation",
  "continuity",
  "blocker",
  "assignment",
  "projection",
  "audit",
  "system",
] as const;

export type AcademyEventCategory =
  (typeof ACADEMY_EVENT_CATEGORIES)[number];

export const ACADEMY_EVENT_EFFECTS = [
  "informational",
  "administrative",
  "learning_state",
  "assessment_state",
  "credential_state",
  "eligibility_state",
  "authority_state",
  "assignment_state",
  "simulation_state",
  "handoff_state",
  "revalidation_state",
  "projection_state",
  "continuity_state",
] as const;

export type AcademyEventEffect =
  (typeof ACADEMY_EVENT_EFFECTS)[number];

export const ACADEMY_EVENT_VISIBILITY = [
  "public",
  "authenticated",
  "organization",
  "controlled",
  "confidential",
  "service",
] as const;

export type AcademyEventVisibility =
  (typeof ACADEMY_EVENT_VISIBILITY)[number];

/* ========================================================================== *
 * Core event envelope
 * ========================================================================== */

export interface AcademyEventActor {
  readonly subjectId?: InstitutionalIdentifier;
  readonly organizationId?: InstitutionalIdentifier;
  readonly role?: InstitutionalRole;
  readonly displayName?: string;
  readonly serviceName?: string;
  readonly serviceVersion?: string;
  readonly authenticated: boolean;
}

export interface AcademyEventAuthority {
  readonly basis: string;
  readonly authorityGrantId?: InstitutionalIdentifier;
  readonly credentialId?: InstitutionalIdentifier;
  readonly assignmentId?: InstitutionalIdentifier;
  readonly serviceRoleOperation?: string;
  readonly limitations: readonly string[];
}

export interface AcademyEventRecordRef {
  readonly recordId: InstitutionalIdentifier;
  readonly recordType: InstitutionalRecordType;
  readonly recordVersion?: string;
  readonly parentRecordId?: InstitutionalIdentifier;
  readonly relationshipType?: string;
}

export interface AcademyEventProjectionPolicy {
  readonly visibility: AcademyEventVisibility;
  readonly permittedRoles?: readonly InstitutionalRole[];
  readonly permittedOrganizationIds?: readonly InstitutionalIdentifier[];
  readonly protectedPayloadPaths: readonly string[];
  readonly publicSummary?: string;
  readonly embargoUntil?: ISODateTimeString;
}

export interface AcademyEventIntegrity {
  readonly hashAlgorithm: "sha256";
  readonly integrityHash: ContentHash;
  readonly priorEventHash?: ContentHash;
  readonly eventSequence?: number;
  readonly canonicalPayloadVersion: string;
  readonly signedBy?: InstitutionalIdentifier;
  readonly signature?: string;
  readonly signatureAlgorithm?: "HMAC-SHA256" | "ED25519";
}

export interface AcademyEvent<TPayload extends JsonValue = JsonValue> {
  readonly eventId: InstitutionalIdentifier;
  readonly eventType: ExtendedAcademyEventType;
  readonly category: AcademyEventCategory;
  readonly effect: AcademyEventEffect;
  readonly occurredAt: ISODateTimeString;
  readonly recordedAt: ISODateTimeString;

  readonly actor: AcademyEventActor;
  readonly authority: AcademyEventAuthority;
  readonly record: AcademyEventRecordRef;

  readonly priorState?: string | null;
  readonly newState?: string | null;

  readonly correlationId: CorrelationIdentifier;
  readonly causationId?: InstitutionalIdentifier;
  readonly idempotencyKey: IdempotencyKey;

  readonly payload: TPayload;
  readonly projection: AcademyEventProjectionPolicy;
  readonly integrity: AcademyEventIntegrity;

  readonly engineVersion: typeof TA14_ACADEMY_EVENT_ENGINE_VERSION;
  readonly boundary: typeof TA14_ACADEMY_EVENT_BOUNDARY;
  readonly nonSubstitutionRule: typeof TA14_ACADEMY_NON_SUBSTITUTION_RULE;
  readonly operatingPrinciple: typeof TA14_ACADEMY_OPERATING_PRINCIPLE;
}

export interface AcademyEventDraft<TPayload extends JsonValue = JsonValue> {
  readonly eventType: ExtendedAcademyEventType;
  readonly category?: AcademyEventCategory;
  readonly effect?: AcademyEventEffect;
  readonly occurredAt?: ISODateTimeString;

  readonly actor: AcademyEventActor;
  readonly authority: AcademyEventAuthority;
  readonly record: AcademyEventRecordRef;

  readonly priorState?: string | null;
  readonly newState?: string | null;

  readonly correlationId: CorrelationIdentifier;
  readonly causationId?: InstitutionalIdentifier;
  readonly idempotencyKey: IdempotencyKey;

  readonly payload: TPayload;
  readonly projection?: Partial<AcademyEventProjectionPolicy>;

  readonly priorEventHash?: ContentHash;
  readonly eventSequence?: number;
  readonly signature?: string;
  readonly signatureAlgorithm?: "HMAC-SHA256" | "ED25519";
}

export interface AcademyEventCreationDependencies {
  readonly createEventId: () => InstitutionalIdentifier;
  readonly now: () => ISODateTimeString;
  readonly hashCanonicalValue: (
    value: JsonValue,
  ) => Promise<ContentHash> | ContentHash;
}

/* ========================================================================== *
 * Canonical payloads
 * ========================================================================== */

export interface LessonResolvedPayload {
  readonly lessonId: InstitutionalIdentifier;
  readonly lessonVersion: string;
  readonly route: string;
  readonly recordType?: InstitutionalRecordType;
  readonly recordId?: InstitutionalIdentifier;
  readonly actionType?: string;
  readonly actionId?: InstitutionalIdentifier;
  readonly performingRole?: InstitutionalRole;
  readonly lifecycleState?: string;
  readonly blockerType?: string;
  readonly projection: ProjectionClass;
  readonly score: number;
  readonly matchedMappingIds: readonly string[];
  readonly relatedLessonIds: readonly InstitutionalIdentifier[];
  readonly warnings: readonly string[];
  readonly fallbackUsed: boolean;
}

export interface LessonViewedPayload {
  readonly lessonId: InstitutionalIdentifier;
  readonly lessonVersion: string;
  readonly surface:
    | "embedded_panel"
    | "dedicated_page"
    | "mission_control"
    | "public_projection"
    | "simulation"
    | "assessment";
  readonly sectionId?: string;
  readonly returnContextId?: InstitutionalIdentifier;
}

export interface ProgressUpdatedPayload {
  readonly enrollmentId: InstitutionalIdentifier;
  readonly lessonId: InstitutionalIdentifier;
  readonly lessonVersion: string;
  readonly priorProgressPercent: number;
  readonly newProgressPercent: number;
  readonly completedSectionIds: readonly string[];
  readonly currentCheckpoint?: string;
  readonly completionCandidate: boolean;
  readonly completionAuthorityService?: string;
}

export interface SimulationCreatedPayload {
  readonly simulationId: InstitutionalIdentifier;
  readonly lessonId: InstitutionalIdentifier;
  readonly lessonVersion: string;
  readonly scenarioId: string;
  readonly state: SimulationState;
  readonly persistentMarker: "SIMULATION - NO PRODUCTION EFFECT";
  readonly mayCreateRegistryEffect: false;
  readonly mayCreateArtifactEffect: false;
  readonly mayCreateAuthorityEffect: false;
}

export interface SimulationCompletedPayload {
  readonly simulationId: InstitutionalIdentifier;
  readonly scenarioId: string;
  readonly priorState: SimulationState;
  readonly newState: SimulationState;
  readonly resultSummary: string;
  readonly limitations: readonly string[];
  readonly handoffAvailable: boolean;
  readonly productionEffectCreated: false;
}

export interface AssessmentAttemptedPayload {
  readonly assessmentId: InstitutionalIdentifier;
  readonly assessmentVersion: string;
  readonly attemptId: InstitutionalIdentifier;
  readonly lessonId: InstitutionalIdentifier;
  readonly lessonVersion: string;
  readonly state: AssessmentState;
  readonly attemptNumber: number;
}

export interface AssessmentResultPayload {
  readonly assessmentId: InstitutionalIdentifier;
  readonly assessmentVersion: string;
  readonly attemptId: InstitutionalIdentifier;
  readonly lessonId: InstitutionalIdentifier;
  readonly lessonVersion: string;
  readonly result: AssessmentState;
  readonly score?: number;
  readonly boundaryFailures: readonly string[];
  readonly credentialEligibilityCreated: boolean;
  readonly authorityCreated: false;
  readonly evaluatorType:
    | "automated"
    | "authorized_human"
    | "hybrid";
}

export interface CredentialStatePayload {
  readonly credentialId: InstitutionalIdentifier;
  readonly credentialType: string;
  readonly priorState?: CredentialState | null;
  readonly newState: CredentialState;
  readonly competenceScope: readonly string[];
  readonly restrictions: readonly string[];
  readonly effectiveAt?: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly authorityCreated: false;
}

export interface AuthorityStatePayload {
  readonly authorityGrantId: InstitutionalIdentifier;
  readonly grantType: string;
  readonly priorState?: AuthorityState | null;
  readonly newState: AuthorityState;
  readonly scope: readonly string[];
  readonly restrictions: readonly string[];
  readonly effectiveAt?: ISODateTimeString;
  readonly expiresAt?: ISODateTimeString;
  readonly credentialEvidenceIds: readonly InstitutionalIdentifier[];
  readonly assignmentId?: InstitutionalIdentifier;
}

export interface LearningBlockerPayload {
  readonly blockerId: InstitutionalIdentifier;
  readonly actionId: InstitutionalIdentifier;
  readonly actionType: string;
  readonly lessonId: InstitutionalIdentifier;
  readonly lessonVersion: string;
  readonly responsibleSubjectId: InstitutionalIdentifier;
  readonly reason: string;
  readonly blockingEffect: string;
  readonly completionCondition: string;
  readonly priorState?: string | null;
  readonly newState: string;
}

export interface HandoffPayload {
  readonly handoffId: InstitutionalIdentifier;
  readonly simulationId?: InstitutionalIdentifier;
  readonly lessonId?: InstitutionalIdentifier;
  readonly sourceRecordId?: InstitutionalIdentifier;
  readonly targetRecordId?: InstitutionalIdentifier;
  readonly priorState?: OperationalHandoffState | null;
  readonly newState: OperationalHandoffState;
  readonly requestedFields: readonly string[];
  readonly transformations: readonly string[];
  readonly decision?: "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
  readonly limitations: readonly string[];
}

export interface RevalidationPayload {
  readonly revalidationActionId: InstitutionalIdentifier;
  readonly triggerType: string;
  readonly triggerRecordId?: InstitutionalIdentifier;
  readonly affectedLessonIds: readonly InstitutionalIdentifier[];
  readonly affectedCredentialIds: readonly InstitutionalIdentifier[];
  readonly affectedAuthorityGrantIds: readonly InstitutionalIdentifier[];
  readonly affectedAssignmentIds: readonly InstitutionalIdentifier[];
  readonly priorState?: string | null;
  readonly newState: string;
  readonly requiredAction: string;
  readonly dueAt?: ISODateTimeString;
}

export interface ReturnContextPayload {
  readonly returnContextId: InstitutionalIdentifier;
  readonly route: string;
  readonly recordId?: InstitutionalIdentifier;
  readonly recordType?: InstitutionalRecordType;
  readonly actionId?: InstitutionalIdentifier;
  readonly role?: InstitutionalRole;
  readonly lifecycleState?: string;
  readonly scrollAnchor?: string;
  readonly projection: ProjectionClass;
  readonly issuedAt: ISODateTimeString;
  readonly expiresAt: ISODateTimeString;
  readonly restoredAt?: ISODateTimeString;
  readonly result?: "restored" | "expired" | "rejected";
}

export interface ContentGapPayload {
  readonly contentGapId: InstitutionalIdentifier;
  readonly route: string;
  readonly recordType?: InstitutionalRecordType;
  readonly actionType?: string;
  readonly role?: InstitutionalRole;
  readonly reason: string;
  readonly fallbackLessonId?: InstitutionalIdentifier;
  readonly priorState?: string | null;
  readonly newState: "open" | "resolved" | "withdrawn";
}

export interface AuditExportPayload {
  readonly exportId: InstitutionalIdentifier;
  readonly exportFormat: "json" | "jsonl" | "csv" | "pdf";
  readonly eventCount: number;
  readonly from?: ISODateTimeString;
  readonly to?: ISODateTimeString;
  readonly projection: AcademyEventVisibility;
  readonly integrityHash: ContentHash;
}

/* ========================================================================== *
 * Event classification
 * ========================================================================== */

const EVENT_CATEGORY_RULES: readonly [
  readonly string[],
  AcademyEventCategory,
][] = [
  [["academy.lesson.", "academy.return_context.", "academy.content_gap."], "lesson"],
  [["academy.enrollment.", "academy.progress."], "progress"],
  [["academy.simulation."], "simulation"],
  [["academy.assessment."], "assessment"],
  [["academy.credential."], "credential"],
  [["academy.authority.", "authority.grant."], "authority"],
  [["academy.handoff."], "handoff"],
  [["academy.revalidation."], "revalidation"],
  [["academy.continuity."], "continuity"],
  [["academy.learning_blocker."], "blocker"],
  [["academy.assignment."], "assignment"],
  [["academy.projection."], "projection"],
  [["academy.audit."], "audit"],
  [["academy.event."], "system"],
];

const EFFECT_BY_PREFIX: readonly [
  string,
  AcademyEventEffect,
][] = [
  ["academy.progress.", "learning_state"],
  ["academy.enrollment.", "learning_state"],
  ["academy.lesson.", "informational"],
  ["academy.return_context.", "administrative"],
  ["academy.content_gap.", "administrative"],
  ["academy.simulation.", "simulation_state"],
  ["academy.assessment.", "assessment_state"],
  ["academy.credential.", "credential_state"],
  ["academy.authority.eligibility", "eligibility_state"],
  ["authority.grant.", "authority_state"],
  ["academy.assignment.", "assignment_state"],
  ["academy.handoff.", "handoff_state"],
  ["academy.revalidation.", "revalidation_state"],
  ["academy.continuity.", "continuity_state"],
  ["academy.learning_blocker.", "learning_state"],
  ["academy.projection.", "projection_state"],
  ["academy.audit.", "administrative"],
  ["academy.event.", "administrative"],
];

export function classifyAcademyEventCategory(
  eventType: ExtendedAcademyEventType,
): AcademyEventCategory {
  for (const [prefixes, category] of EVENT_CATEGORY_RULES) {
    if (prefixes.some((prefix) => eventType.startsWith(prefix))) {
      return category;
    }
  }

  return "system";
}

export function classifyAcademyEventEffect(
  eventType: ExtendedAcademyEventType,
): AcademyEventEffect {
  for (const [prefix, effect] of EFFECT_BY_PREFIX) {
    if (eventType.startsWith(prefix)) {
      return effect;
    }
  }

  return "informational";
}

/* ========================================================================== *
 * Canonical event creation
 * ========================================================================== */

export async function createAcademyEvent<
  TPayload extends JsonValue,
>(
  draft: AcademyEventDraft<TPayload>,
  dependencies: AcademyEventCreationDependencies,
): Promise<AcademyEvent<TPayload>> {
  const occurredAt = draft.occurredAt ?? dependencies.now();
  const recordedAt = dependencies.now();
  const category =
    draft.category ?? classifyAcademyEventCategory(draft.eventType);
  const effect =
    draft.effect ?? classifyAcademyEventEffect(draft.eventType);

  const projection: AcademyEventProjectionPolicy = {
    visibility: draft.projection?.visibility ?? "authenticated",
    permittedRoles: draft.projection?.permittedRoles,
    permittedOrganizationIds:
      draft.projection?.permittedOrganizationIds,
    protectedPayloadPaths:
      draft.projection?.protectedPayloadPaths ?? [],
    publicSummary: draft.projection?.publicSummary,
    embargoUntil: draft.projection?.embargoUntil,
  };

  const canonicalValue = buildCanonicalEventHashInput({
    eventType: draft.eventType,
    category,
    effect,
    occurredAt,
    actor: draft.actor,
    authority: draft.authority,
    record: draft.record,
    priorState: draft.priorState ?? null,
    newState: draft.newState ?? null,
    correlationId: draft.correlationId,
    causationId: draft.causationId,
    idempotencyKey: draft.idempotencyKey,
    payload: draft.payload,
    projection,
    priorEventHash: draft.priorEventHash,
    eventSequence: draft.eventSequence,
  });

  const integrityHash = await dependencies.hashCanonicalValue(
    canonicalValue,
  );

  const event: AcademyEvent<TPayload> = {
    eventId: dependencies.createEventId(),
    eventType: draft.eventType,
    category,
    effect,
    occurredAt,
    recordedAt,
    actor: deepFreeze({ ...draft.actor }),
    authority: deepFreeze({
      ...draft.authority,
      limitations: [...draft.authority.limitations],
    }),
    record: deepFreeze({ ...draft.record }),
    priorState: draft.priorState,
    newState: draft.newState,
    correlationId: draft.correlationId,
    causationId: draft.causationId,
    idempotencyKey: draft.idempotencyKey,
    payload: deepFreeze(cloneJson(draft.payload)),
    projection: deepFreeze(projection),
    integrity: deepFreeze({
      hashAlgorithm: "sha256",
      integrityHash,
      priorEventHash: draft.priorEventHash,
      eventSequence: draft.eventSequence,
      canonicalPayloadVersion: "3.0",
      signature: draft.signature,
      signatureAlgorithm: draft.signatureAlgorithm,
    }),
    engineVersion: TA14_ACADEMY_EVENT_ENGINE_VERSION,
    boundary: TA14_ACADEMY_EVENT_BOUNDARY,
    nonSubstitutionRule: TA14_ACADEMY_NON_SUBSTITUTION_RULE,
    operatingPrinciple: TA14_ACADEMY_OPERATING_PRINCIPLE,
  };

  const validation = validateAcademyEvent(event);

  if (!validation.ok) {
    throw new AcademyEventValidationError(
      "Academy event creation failed validation.",
      validation.issues,
    );
  }

  return deepFreeze(event);
}

function buildCanonicalEventHashInput(
  input: {
    readonly eventType: ExtendedAcademyEventType;
    readonly category: AcademyEventCategory;
    readonly effect: AcademyEventEffect;
    readonly occurredAt: ISODateTimeString;
    readonly actor: AcademyEventActor;
    readonly authority: AcademyEventAuthority;
    readonly record: AcademyEventRecordRef;
    readonly priorState: string | null;
    readonly newState: string | null;
    readonly correlationId: CorrelationIdentifier;
    readonly causationId?: InstitutionalIdentifier;
    readonly idempotencyKey: IdempotencyKey;
    readonly payload: JsonValue;
    readonly projection: AcademyEventProjectionPolicy;
    readonly priorEventHash?: ContentHash;
    readonly eventSequence?: number;
  },
): JsonValue {
  return {
    eventType: input.eventType,
    category: input.category,
    effect: input.effect,
    occurredAt: input.occurredAt,
    actor: cloneJson(input.actor as unknown as JsonValue),
    authority: cloneJson(input.authority as unknown as JsonValue),
    record: cloneJson(input.record as unknown as JsonValue),
    priorState: input.priorState,
    newState: input.newState,
    correlationId: input.correlationId,
    causationId: input.causationId ?? null,
    idempotencyKey: input.idempotencyKey,
    payload: cloneJson(input.payload),
    projection: cloneJson(input.projection as unknown as JsonValue),
    priorEventHash: input.priorEventHash ?? null,
    eventSequence: input.eventSequence ?? null,
    engineVersion: TA14_ACADEMY_EVENT_ENGINE_VERSION,
    boundary: TA14_ACADEMY_EVENT_BOUNDARY,
    nonSubstitutionRule: TA14_ACADEMY_NON_SUBSTITUTION_RULE,
  };
}

/* ========================================================================== *
 * Validation
 * ========================================================================== */

export type AcademyEventValidationCode =
  | "required"
  | "invalid_type"
  | "invalid_value"
  | "invalid_event_type"
  | "invalid_record_type"
  | "invalid_role"
  | "invalid_projection"
  | "invalid_timestamp"
  | "invalid_hash"
  | "invalid_state_transition"
  | "unsafe_authority_effect"
  | "unsafe_simulation_effect"
  | "unsafe_projection"
  | "idempotency_missing"
  | "correlation_missing"
  | "boundary_mismatch"
  | "engine_version_mismatch";

export interface AcademyEventValidationIssue {
  readonly path: string;
  readonly code: AcademyEventValidationCode;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly received?: unknown;
  readonly expected?: string;
}

export interface AcademyEventValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly issues: readonly AcademyEventValidationIssue[];
}

export class AcademyEventValidationError extends Error {
  readonly issues: readonly AcademyEventValidationIssue[];

  constructor(
    message: string,
    issues: readonly AcademyEventValidationIssue[],
  ) {
    super(message);
    this.name = "AcademyEventValidationError";
    this.issues = issues;
  }
}

export function validateAcademyEvent(
  input: unknown,
): AcademyEventValidationResult<AcademyEvent> {
  const issues: AcademyEventValidationIssue[] = [];

  if (!isPlainObject(input)) {
    return {
      ok: false,
      issues: [
        {
          path: "$",
          code: "invalid_type",
          message: "Academy event must be an object.",
          severity: "error",
          received: input,
        },
      ],
    };
  }

  requiredString(input.eventId, "$.eventId", issues);

  if (!isExtendedAcademyEventType(input.eventType)) {
    issues.push({
      path: "$.eventType",
      code: "invalid_event_type",
      message: "Unsupported Academy event type.",
      severity: "error",
      received: input.eventType,
    });
  }

  if (!isOneOf(input.category, ACADEMY_EVENT_CATEGORIES)) {
    issues.push({
      path: "$.category",
      code: "invalid_value",
      message: "Unsupported Academy event category.",
      severity: "error",
      received: input.category,
    });
  }

  if (!isOneOf(input.effect, ACADEMY_EVENT_EFFECTS)) {
    issues.push({
      path: "$.effect",
      code: "invalid_value",
      message: "Unsupported Academy event effect.",
      severity: "error",
      received: input.effect,
    });
  }

  if (!isIsoDateTime(input.occurredAt)) {
    issues.push({
      path: "$.occurredAt",
      code: "invalid_timestamp",
      message: "$.occurredAt must be an ISO date-time.",
      severity: "error",
      received: input.occurredAt,
    });
  }

  if (!isIsoDateTime(input.recordedAt)) {
    issues.push({
      path: "$.recordedAt",
      code: "invalid_timestamp",
      message: "$.recordedAt must be an ISO date-time.",
      severity: "error",
      received: input.recordedAt,
    });
  }

  validateActor(input.actor, "$.actor", issues);
  validateAuthority(input.authority, "$.authority", issues);
  validateRecordRef(input.record, "$.record", issues);
  validateProjection(input.projection, "$.projection", issues);
  validateIntegrity(input.integrity, "$.integrity", issues);

  requiredString(input.correlationId, "$.correlationId", issues);
  requiredString(input.idempotencyKey, "$.idempotencyKey", issues);

  if (input.engineVersion !== TA14_ACADEMY_EVENT_ENGINE_VERSION) {
    issues.push({
      path: "$.engineVersion",
      code: "engine_version_mismatch",
      message: "Event engine version does not match.",
      severity: "error",
      received: input.engineVersion,
      expected: TA14_ACADEMY_EVENT_ENGINE_VERSION,
    });
  }

  if (input.boundary !== TA14_ACADEMY_EVENT_BOUNDARY) {
    issues.push({
      path: "$.boundary",
      code: "boundary_mismatch",
      message: "Event boundary must match the canonical boundary.",
      severity: "error",
      received: input.boundary,
      expected: TA14_ACADEMY_EVENT_BOUNDARY,
    });
  }

  if (
    input.nonSubstitutionRule !==
    TA14_ACADEMY_NON_SUBSTITUTION_RULE
  ) {
    issues.push({
      path: "$.nonSubstitutionRule",
      code: "boundary_mismatch",
      message:
        "Event non-substitution rule must match the canonical rule.",
      severity: "error",
      received: input.nonSubstitutionRule,
    });
  }

  applyConstitutionalEventChecks(
    input as unknown as AcademyEvent,
    issues,
  );

  const ok = !issues.some((issue) => issue.severity === "error");

  return {
    ok,
    value: ok ? (input as unknown as AcademyEvent) : undefined,
    issues,
  };
}

function validateActor(
  input: unknown,
  path: string,
  issues: AcademyEventValidationIssue[],
): void {
  if (!isPlainObject(input)) {
    issues.push({
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: input,
    });
    return;
  }

  if (typeof input.authenticated !== "boolean") {
    issues.push({
      path: `${path}.authenticated`,
      code: "invalid_type",
      message: `${path}.authenticated must be boolean.`,
      severity: "error",
      received: input.authenticated,
    });
  }

  if (
    input.role !== undefined &&
    !isInstitutionalRole(input.role)
  ) {
    issues.push({
      path: `${path}.role`,
      code: "invalid_role",
      message: `${path}.role is not supported.`,
      severity: "error",
      received: input.role,
    });
  }

  if (
    input.authenticated === true &&
    !isNonEmptyString(input.subjectId) &&
    !isNonEmptyString(input.serviceName)
  ) {
    issues.push({
      path,
      code: "required",
      message:
        `${path} requires subjectId or serviceName for authenticated events.`,
      severity: "error",
      received: input,
    });
  }
}

function validateAuthority(
  input: unknown,
  path: string,
  issues: AcademyEventValidationIssue[],
): void {
  if (!isPlainObject(input)) {
    issues.push({
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: input,
    });
    return;
  }

  requiredString(input.basis, `${path}.basis`, issues);

  if (
    !Array.isArray(input.limitations) ||
    !input.limitations.every((value) => typeof value === "string")
  ) {
    issues.push({
      path: `${path}.limitations`,
      code: "invalid_type",
      message: `${path}.limitations must be string[].`,
      severity: "error",
      received: input.limitations,
    });
  }
}

function validateRecordRef(
  input: unknown,
  path: string,
  issues: AcademyEventValidationIssue[],
): void {
  if (!isPlainObject(input)) {
    issues.push({
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: input,
    });
    return;
  }

  requiredString(input.recordId, `${path}.recordId`, issues);

  if (!isInstitutionalRecordType(input.recordType)) {
    issues.push({
      path: `${path}.recordType`,
      code: "invalid_record_type",
      message: `${path}.recordType is not supported.`,
      severity: "error",
      received: input.recordType,
    });
  }
}

function validateProjection(
  input: unknown,
  path: string,
  issues: AcademyEventValidationIssue[],
): void {
  if (!isPlainObject(input)) {
    issues.push({
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: input,
    });
    return;
  }

  if (!isOneOf(input.visibility, ACADEMY_EVENT_VISIBILITY)) {
    issues.push({
      path: `${path}.visibility`,
      code: "invalid_projection",
      message: `${path}.visibility is not supported.`,
      severity: "error",
      received: input.visibility,
    });
  }

  if (
    !Array.isArray(input.protectedPayloadPaths) ||
    !input.protectedPayloadPaths.every(
      (value) => typeof value === "string",
    )
  ) {
    issues.push({
      path: `${path}.protectedPayloadPaths`,
      code: "invalid_type",
      message:
        `${path}.protectedPayloadPaths must be string[].`,
      severity: "error",
      received: input.protectedPayloadPaths,
    });
  }

  if (
    input.visibility === "public" &&
    !isNonEmptyString(input.publicSummary)
  ) {
    issues.push({
      path: `${path}.publicSummary`,
      code: "unsafe_projection",
      message:
        "Public events require a bounded public summary.",
      severity: "error",
      received: input.publicSummary,
    });
  }
}

function validateIntegrity(
  input: unknown,
  path: string,
  issues: AcademyEventValidationIssue[],
): void {
  if (!isPlainObject(input)) {
    issues.push({
      path,
      code: "invalid_type",
      message: `${path} must be an object.`,
      severity: "error",
      received: input,
    });
    return;
  }

  if (input.hashAlgorithm !== "sha256") {
    issues.push({
      path: `${path}.hashAlgorithm`,
      code: "invalid_hash",
      message: `${path}.hashAlgorithm must be sha256.`,
      severity: "error",
      received: input.hashAlgorithm,
    });
  }

  if (!isContentHashValue(input.integrityHash)) {
    issues.push({
      path: `${path}.integrityHash`,
      code: "invalid_hash",
      message:
        `${path}.integrityHash must use sha256: plus 64 hexadecimal characters.`,
      severity: "error",
      received: input.integrityHash,
    });
  }

  if (
    input.priorEventHash !== undefined &&
    !isContentHashValue(input.priorEventHash)
  ) {
    issues.push({
      path: `${path}.priorEventHash`,
      code: "invalid_hash",
      message:
        `${path}.priorEventHash must use sha256: plus 64 hexadecimal characters.`,
      severity: "error",
      received: input.priorEventHash,
    });
  }
}

function applyConstitutionalEventChecks(
  event: AcademyEvent,
  issues: AcademyEventValidationIssue[],
): void {
  if (
    event.eventType.startsWith("academy.simulation.") &&
    isPlainObject(event.payload)
  ) {
    for (const field of [
      "mayCreateRegistryEffect",
      "mayCreateArtifactEffect",
      "mayCreateAuthorityEffect",
      "productionEffectCreated",
    ]) {
      if (event.payload[field] === true) {
        issues.push({
          path: `$.payload.${field}`,
          code: "unsafe_simulation_effect",
          message:
            `Simulation events may not create ${field}.`,
          severity: "error",
          received: true,
          expected: "false",
        });
      }
    }
  }

  if (
    event.eventType.startsWith("academy.assessment.") &&
    isPlainObject(event.payload) &&
    event.payload.authorityCreated === true
  ) {
    issues.push({
      path: "$.payload.authorityCreated",
      code: "unsafe_authority_effect",
      message:
        "Assessment events may not directly create authority.",
      severity: "error",
      received: true,
      expected: "false",
    });
  }

  if (
    event.eventType.startsWith("academy.credential.") &&
    isPlainObject(event.payload) &&
    event.payload.authorityCreated === true
  ) {
    issues.push({
      path: "$.payload.authorityCreated",
      code: "unsafe_authority_effect",
      message:
        "Credential events may not directly create authority.",
      severity: "error",
      received: true,
      expected: "false",
    });
  }
}

/* ========================================================================== *
 * Repository contracts
 * ========================================================================== */

export interface AcademyEventQuery {
  readonly eventIds?: readonly InstitutionalIdentifier[];
  readonly eventTypes?: readonly ExtendedAcademyEventType[];
  readonly categories?: readonly AcademyEventCategory[];
  readonly effects?: readonly AcademyEventEffect[];
  readonly recordIds?: readonly InstitutionalIdentifier[];
  readonly recordTypes?: readonly InstitutionalRecordType[];
  readonly actorSubjectIds?: readonly InstitutionalIdentifier[];
  readonly organizationIds?: readonly InstitutionalIdentifier[];
  readonly correlationIds?: readonly CorrelationIdentifier[];
  readonly causationIds?: readonly InstitutionalIdentifier[];
  readonly visibility?: readonly AcademyEventVisibility[];
  readonly from?: ISODateTimeString;
  readonly to?: ISODateTimeString;
  readonly text?: string;
  readonly limit?: number;
  readonly cursor?: string;
  readonly ascending?: boolean;
}

export interface AcademyEventPage {
  readonly events: readonly AcademyEvent[];
  readonly nextCursor?: string;
  readonly total?: number;
}

export interface AcademyEventAppendResult {
  readonly event: AcademyEvent;
  readonly appended: boolean;
  readonly duplicateOfEventId?: InstitutionalIdentifier;
}

export interface AcademyEventRepository {
  append(event: AcademyEvent): Promise<AcademyEventAppendResult>;
  appendMany(
    events: readonly AcademyEvent[],
  ): Promise<readonly AcademyEventAppendResult[]>;
  getById(
    eventId: InstitutionalIdentifier,
  ): Promise<AcademyEvent | null>;
  getByIdempotencyKey(
    idempotencyKey: IdempotencyKey,
  ): Promise<AcademyEvent | null>;
  query(query: AcademyEventQuery): Promise<AcademyEventPage>;
  getRecordStream(
    recordId: InstitutionalIdentifier,
  ): Promise<readonly AcademyEvent[]>;
  getCorrelationStream(
    correlationId: CorrelationIdentifier,
  ): Promise<readonly AcademyEvent[]>;
  getLatestRecordEvent(
    recordId: InstitutionalIdentifier,
  ): Promise<AcademyEvent | null>;
  count(query?: AcademyEventQuery): Promise<number>;
}

export interface AcademyEventPublisher {
  publish(event: AcademyEvent): Promise<void>;
}

export interface AcademyEventSubscriber {
  readonly subscriberId: string;
  readonly eventTypes?: readonly ExtendedAcademyEventType[];
  readonly categories?: readonly AcademyEventCategory[];
  handle(event: AcademyEvent): Promise<void>;
}

/* ========================================================================== *
 * Event service
 * ========================================================================== */

export interface AcademyEventServiceDependencies {
  readonly repository: AcademyEventRepository;
  readonly publisher?: AcademyEventPublisher;
  readonly creation: AcademyEventCreationDependencies;
}

export class AcademyEventService {
  readonly repository: AcademyEventRepository;
  readonly publisher?: AcademyEventPublisher;
  readonly creation: AcademyEventCreationDependencies;

  constructor(dependencies: AcademyEventServiceDependencies) {
    this.repository = dependencies.repository;
    this.publisher = dependencies.publisher;
    this.creation = dependencies.creation;
  }

  async emit<TPayload extends JsonValue>(
    draft: AcademyEventDraft<TPayload>,
  ): Promise<AcademyEventAppendResult> {
    const duplicate = await this.repository.getByIdempotencyKey(
      draft.idempotencyKey,
    );

    if (duplicate) {
      return {
        event: duplicate,
        appended: false,
        duplicateOfEventId: duplicate.eventId,
      };
    }

    const latest = await this.repository.getLatestRecordEvent(
      draft.record.recordId,
    );

    const event = await createAcademyEvent(
      {
        ...draft,
        priorEventHash:
          draft.priorEventHash ??
          latest?.integrity.integrityHash,
        eventSequence:
          draft.eventSequence ??
          (latest?.integrity.eventSequence ?? 0) + 1,
      },
      this.creation,
    );

    const result = await this.repository.append(event);

    if (result.appended && this.publisher) {
      await this.publisher.publish(result.event);
    }

    return result;
  }

  async emitMany(
    drafts: readonly AcademyEventDraft[],
  ): Promise<readonly AcademyEventAppendResult[]> {
    const results: AcademyEventAppendResult[] = [];

    for (const draft of drafts) {
      results.push(await this.emit(draft));
    }

    return results;
  }

  async replayRecord(
    recordId: InstitutionalIdentifier,
  ): Promise<AcademyReplayResult> {
    const events = await this.repository.getRecordStream(recordId);
    return replayAcademyEvents(events);
  }

  async buildTimeline(
    query: AcademyEventQuery,
    projection: ProjectionClass,
    role?: InstitutionalRole,
    organizationId?: InstitutionalIdentifier,
  ): Promise<AcademyTimeline> {
    const page = await this.repository.query(query);
    return buildAcademyTimeline(
      page.events,
      projection,
      role,
      organizationId,
    );
  }
}

/* ========================================================================== *
 * Replay and reduction
 * ========================================================================== */

export interface AcademyReplayState {
  readonly recordId: InstitutionalIdentifier;
  readonly recordType: InstitutionalRecordType;
  readonly latestEventId?: InstitutionalIdentifier;
  readonly latestEventType?: ExtendedAcademyEventType;
  readonly latestOccurredAt?: ISODateTimeString;
  readonly latestState?: string | null;
  readonly lessonState?: LessonLifecycleState;
  readonly assessmentState?: AssessmentState;
  readonly credentialState?: CredentialState;
  readonly authorityState?: AuthorityState;
  readonly simulationState?: SimulationState;
  readonly handoffState?: OperationalHandoffState;
  readonly blockerOpen?: boolean;
  readonly revalidationRequired?: boolean;
  readonly projectionState?: string;
  readonly eventCount: number;
  readonly correlationIds: readonly CorrelationIdentifier[];
  readonly integrityChainValid: boolean;
  readonly warnings: readonly string[];
}

export interface AcademyReplayResult {
  readonly state: AcademyReplayState | null;
  readonly events: readonly AcademyEvent[];
  readonly integrityIssues: readonly string[];
}

export function replayAcademyEvents(
  events: readonly AcademyEvent[],
): AcademyReplayResult {
  if (events.length === 0) {
    return {
      state: null,
      events: [],
      integrityIssues: [],
    };
  }

  const sorted = [...events].sort(compareAcademyEvents);
  const integrityIssues = verifyEventChain(sorted);
  const warnings: string[] = [];

  let lessonState: LessonLifecycleState | undefined;
  let assessmentState: AssessmentState | undefined;
  let credentialState: CredentialState | undefined;
  let authorityState: AuthorityState | undefined;
  let simulationState: SimulationState | undefined;
  let handoffState: OperationalHandoffState | undefined;
  let blockerOpen: boolean | undefined;
  let revalidationRequired: boolean | undefined;
  let projectionState: string | undefined;
  let latestState: string | null | undefined;

  for (const event of sorted) {
    latestState = event.newState ?? latestState;

    switch (event.eventType) {
      case "academy.progress.updated":
        if (event.newState && isLessonLifecycleState(event.newState)) {
          lessonState = event.newState;
        }
        break;

      case "academy.assessment.started":
      case "academy.assessment.attempted":
      case "academy.assessment.passed":
      case "academy.assessment.conditionally_passed":
      case "academy.assessment.failed":
      case "academy.assessment.invalidated":
      case "academy.assessment.review_requested":
      case "academy.assessment.review_completed":
        if (event.newState && isAssessmentState(event.newState)) {
          assessmentState = event.newState;
        }
        break;

      case "academy.credential.issued":
      case "academy.credential.suspended":
      case "academy.credential.revoked":
      case "academy.credential.expiring":
      case "academy.credential.expired":
      case "academy.credential.superseded":
        if (event.newState && isCredentialState(event.newState)) {
          credentialState = event.newState;
        }
        break;

      case "authority.grant.issued":
      case "authority.grant.constrained":
      case "authority.grant.held":
      case "authority.grant.revoked":
        if (event.newState && isAuthorityState(event.newState)) {
          authorityState = event.newState;
        }
        break;

      case "academy.simulation.created":
      case "academy.simulation.started":
      case "academy.simulation.completed":
      case "academy.simulation.invalidated":
      case "academy.simulation.reset":
        if (event.newState && isSimulationState(event.newState)) {
          simulationState = event.newState;
        }
        break;

      case "academy.handoff.requested":
      case "academy.handoff.approved":
      case "academy.handoff.denied":
      case "academy.handoff.applied":
      case "academy.handoff.closed":
      case "academy.handoff.returned_for_correction":
      case "academy.handoff.escalated":
        if (event.newState && isHandoffState(event.newState)) {
          handoffState = event.newState;
        }
        break;

      case "academy.learning_blocker.created":
      case "academy.learning_blocker.updated":
        blockerOpen = true;
        break;

      case "academy.learning_blocker.resolved":
      case "academy.learning_blocker.withdrawn":
        blockerOpen = false;
        break;

      case "academy.revalidation.required":
      case "academy.revalidation.started":
      case "academy.revalidation.held":
      case "academy.revalidation.failed":
        revalidationRequired = true;
        break;

      case "academy.revalidation.completed":
      case "academy.revalidation.withdrawn":
        revalidationRequired = false;
        break;

      case "academy.projection.created":
      case "academy.projection.updated":
      case "academy.projection.withheld":
        projectionState = event.newState ?? projectionState;
        break;

      default:
        break;
    }
  }

  const latest = sorted[sorted.length - 1];
  const first = sorted[0];

  const state: AcademyReplayState = {
    recordId: first.record.recordId,
    recordType: first.record.recordType,
    latestEventId: latest.eventId,
    latestEventType: latest.eventType,
    latestOccurredAt: latest.occurredAt,
    latestState,
    lessonState,
    assessmentState,
    credentialState,
    authorityState,
    simulationState,
    handoffState,
    blockerOpen,
    revalidationRequired,
    projectionState,
    eventCount: sorted.length,
    correlationIds: Array.from(
      new Set(sorted.map((event) => event.correlationId)),
    ),
    integrityChainValid: integrityIssues.length === 0,
    warnings,
  };

  return {
    state: deepFreeze(state),
    events: deepFreeze(sorted),
    integrityIssues,
  };
}

function compareAcademyEvents(
  a: AcademyEvent,
  b: AcademyEvent,
): number {
  const sequenceA = a.integrity.eventSequence ?? Number.MAX_SAFE_INTEGER;
  const sequenceB = b.integrity.eventSequence ?? Number.MAX_SAFE_INTEGER;

  if (sequenceA !== sequenceB) return sequenceA - sequenceB;

  const time = Date.parse(a.occurredAt) - Date.parse(b.occurredAt);
  if (time !== 0) return time;

  return a.eventId.localeCompare(b.eventId);
}

function verifyEventChain(
  events: readonly AcademyEvent[],
): string[] {
  const issues: string[] = [];

  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    const expectedSequence = index + 1;

    if (
      event.integrity.eventSequence !== undefined &&
      event.integrity.eventSequence !== expectedSequence
    ) {
      issues.push(
        `Event ${event.eventId} has sequence ${event.integrity.eventSequence}; expected ${expectedSequence}.`,
      );
    }

    if (index > 0) {
      const prior = events[index - 1];
      const expectedHash = prior.integrity.integrityHash;

      if (
        event.integrity.priorEventHash !== undefined &&
        event.integrity.priorEventHash !== expectedHash
      ) {
        issues.push(
          `Event ${event.eventId} priorEventHash does not match event ${prior.eventId}.`,
        );
      }
    }
  }

  return issues;
}

/* ========================================================================== *
 * Timeline and Mission Control projections
 * ========================================================================== */

export interface AcademyTimelineItem {
  readonly eventId: InstitutionalIdentifier;
  readonly eventType: ExtendedAcademyEventType;
  readonly occurredAt: ISODateTimeString;
  readonly category: AcademyEventCategory;
  readonly title: string;
  readonly summary: string;
  readonly actorLabel: string;
  readonly recordId: InstitutionalIdentifier;
  readonly recordType: InstitutionalRecordType;
  readonly priorState?: string | null;
  readonly newState?: string | null;
  readonly correlationId: CorrelationIdentifier;
  readonly visibility: AcademyEventVisibility;
  readonly authorityBasis: string;
  readonly limitations: readonly string[];
}

export interface AcademyTimeline {
  readonly generatedAt: ISODateTimeString;
  readonly itemCount: number;
  readonly items: readonly AcademyTimelineItem[];
  readonly categories: readonly AcademyEventCategory[];
  readonly correlationIds: readonly CorrelationIdentifier[];
}

export function buildAcademyTimeline(
  events: readonly AcademyEvent[],
  projection: ProjectionClass,
  role?: InstitutionalRole,
  organizationId?: InstitutionalIdentifier,
): AcademyTimeline {
  const visible = events
    .filter((event) =>
      canProjectEvent(event, projection, role, organizationId),
    )
    .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt));

  const items = visible.map((event) =>
    projectAcademyTimelineItem(event, projection),
  );

  return deepFreeze({
    generatedAt: new Date().toISOString(),
    itemCount: items.length,
    items,
    categories: Array.from(
      new Set(items.map((item) => item.category)),
    ),
    correlationIds: Array.from(
      new Set(items.map((item) => item.correlationId)),
    ),
  });
}

export function projectAcademyTimelineItem(
  event: AcademyEvent,
  projection: ProjectionClass,
): AcademyTimelineItem {
  const publicMode = projection === "public";
  const summary =
    publicMode && event.projection.publicSummary
      ? event.projection.publicSummary
      : buildEventSummary(event);

  return deepFreeze({
    eventId: event.eventId,
    eventType: event.eventType,
    occurredAt: event.occurredAt,
    category: event.category,
    title: buildEventTitle(event),
    summary,
    actorLabel: publicMode
      ? buildPublicActorLabel(event.actor)
      : buildActorLabel(event.actor),
    recordId: event.record.recordId,
    recordType: event.record.recordType,
    priorState: event.priorState,
    newState: event.newState,
    correlationId: event.correlationId,
    visibility: event.projection.visibility,
    authorityBasis: event.authority.basis,
    limitations: event.authority.limitations,
  });
}

export interface MissionControlAcademySignal {
  readonly signalId: string;
  readonly kind:
    | "required_learning"
    | "assessment"
    | "credential"
    | "authority"
    | "simulation"
    | "handoff"
    | "revalidation"
    | "content_gap";
  readonly priority: "low" | "normal" | "high" | "critical";
  readonly title: string;
  readonly description: string;
  readonly recordId: InstitutionalIdentifier;
  readonly recordType: InstitutionalRecordType;
  readonly eventId: InstitutionalIdentifier;
  readonly occurredAt: ISODateTimeString;
  readonly status: string;
  readonly blockingEffect?: string;
  readonly nextAction?: string;
  readonly correlationId: CorrelationIdentifier;
}

export function buildMissionControlAcademySignals(
  events: readonly AcademyEvent[],
): readonly MissionControlAcademySignal[] {
  const signals: MissionControlAcademySignal[] = [];

  for (const event of [...events].sort(compareAcademyEvents)) {
    switch (event.eventType) {
      case "academy.learning_blocker.created":
      case "academy.learning_blocker.updated": {
        const payload = event.payload as unknown as LearningBlockerPayload;
        signals.push({
          signalId: `signal:${event.eventId}`,
          kind: "required_learning",
          priority: "high",
          title: "Required learning blocks institutional work",
          description: payload.reason,
          recordId: event.record.recordId,
          recordType: event.record.recordType,
          eventId: event.eventId,
          occurredAt: event.occurredAt,
          status: payload.newState,
          blockingEffect: payload.blockingEffect,
          nextAction: payload.completionCondition,
          correlationId: event.correlationId,
        });
        break;
      }

      case "academy.revalidation.required":
      case "academy.revalidation.held": {
        const payload = event.payload as unknown as RevalidationPayload;
        signals.push({
          signalId: `signal:${event.eventId}`,
          kind: "revalidation",
          priority: "critical",
          title: "Academy revalidation required",
          description:
            `Material change requires ${payload.requiredAction}.`,
          recordId: event.record.recordId,
          recordType: event.record.recordType,
          eventId: event.eventId,
          occurredAt: event.occurredAt,
          status: payload.newState,
          nextAction: payload.requiredAction,
          correlationId: event.correlationId,
        });
        break;
      }

      case "academy.assessment.failed":
      case "academy.assessment.conditionally_passed":
      case "academy.assessment.review_requested": {
        signals.push({
          signalId: `signal:${event.eventId}`,
          kind: "assessment",
          priority: "high",
          title: "Assessment requires attention",
          description: buildEventSummary(event),
          recordId: event.record.recordId,
          recordType: event.record.recordType,
          eventId: event.eventId,
          occurredAt: event.occurredAt,
          status: event.newState ?? "attention_required",
          correlationId: event.correlationId,
        });
        break;
      }

      case "academy.credential.expiring":
      case "academy.credential.expired":
      case "academy.credential.suspended":
      case "academy.credential.revoked": {
        signals.push({
          signalId: `signal:${event.eventId}`,
          kind: "credential",
          priority:
            event.eventType === "academy.credential.expiring"
              ? "normal"
              : "critical",
          title: "Credential state changed",
          description: buildEventSummary(event),
          recordId: event.record.recordId,
          recordType: event.record.recordType,
          eventId: event.eventId,
          occurredAt: event.occurredAt,
          status: event.newState ?? "changed",
          correlationId: event.correlationId,
        });
        break;
      }

      case "authority.grant.held":
      case "authority.grant.constrained":
      case "authority.grant.revoked": {
        signals.push({
          signalId: `signal:${event.eventId}`,
          kind: "authority",
          priority: "critical",
          title: "Authority state changed",
          description: buildEventSummary(event),
          recordId: event.record.recordId,
          recordType: event.record.recordType,
          eventId: event.eventId,
          occurredAt: event.occurredAt,
          status: event.newState ?? "changed",
          correlationId: event.correlationId,
        });
        break;
      }

      case "academy.handoff.returned_for_correction":
      case "academy.handoff.escalated":
      case "academy.handoff.denied": {
        signals.push({
          signalId: `signal:${event.eventId}`,
          kind: "handoff",
          priority: "high",
          title: "Simulation-to-live handoff requires action",
          description: buildEventSummary(event),
          recordId: event.record.recordId,
          recordType: event.record.recordType,
          eventId: event.eventId,
          occurredAt: event.occurredAt,
          status: event.newState ?? "attention_required",
          correlationId: event.correlationId,
        });
        break;
      }

      case "academy.content_gap.created": {
        signals.push({
          signalId: `signal:${event.eventId}`,
          kind: "content_gap",
          priority: "normal",
          title: "Academy content gap detected",
          description: buildEventSummary(event),
          recordId: event.record.recordId,
          recordType: event.record.recordType,
          eventId: event.eventId,
          occurredAt: event.occurredAt,
          status: event.newState ?? "open",
          correlationId: event.correlationId,
        });
        break;
      }

      default:
        break;
    }
  }

  return deepFreeze(signals);
}

/* ========================================================================== *
 * Public-safe event projection
 * ========================================================================== */

export interface PublicAcademyEventProjection {
  readonly eventId: InstitutionalIdentifier;
  readonly eventType: ExtendedAcademyEventType;
  readonly occurredAt: ISODateTimeString;
  readonly recordId: InstitutionalIdentifier;
  readonly recordType: InstitutionalRecordType;
  readonly summary: string;
  readonly priorState?: string | null;
  readonly newState?: string | null;
  readonly correlationId: CorrelationIdentifier;
  readonly authorityBasis: string;
  readonly boundary: string;
}

export function projectPublicAcademyEvent(
  event: AcademyEvent,
): PublicAcademyEventProjection {
  if (!canProjectEvent(event, "public")) {
    throw new AcademyEventValidationError(
      "Event is not eligible for public projection.",
      [
        {
          path: "$.projection.visibility",
          code: "unsafe_projection",
          message: "Event cannot be projected publicly.",
          severity: "error",
          received: event.projection.visibility,
        },
      ],
    );
  }

  return deepFreeze({
    eventId: event.eventId,
    eventType: event.eventType,
    occurredAt: event.occurredAt,
    recordId: event.record.recordId,
    recordType: event.record.recordType,
    summary:
      event.projection.publicSummary ??
      buildEventSummary(event),
    priorState: event.priorState,
    newState: event.newState,
    correlationId: event.correlationId,
    authorityBasis: event.authority.basis,
    boundary: TA14_ACADEMY_EVENT_BOUNDARY,
  });
}

export function canProjectEvent(
  event: AcademyEvent,
  projection: ProjectionClass,
  role?: InstitutionalRole,
  organizationId?: InstitutionalIdentifier,
): boolean {
  const visibility = event.projection.visibility;

  if (projection === "service") return true;

  if (projection === "public") {
    return (
      visibility === "public" &&
      (!event.projection.embargoUntil ||
        Date.parse(event.projection.embargoUntil) <= Date.now())
    );
  }

  if (projection === "authenticated") {
    return visibility !== "service";
  }

  if (projection === "organization") {
    if (
      event.projection.permittedOrganizationIds &&
      event.projection.permittedOrganizationIds.length > 0
    ) {
      return Boolean(
        organizationId &&
          event.projection.permittedOrganizationIds.includes(
            organizationId,
          ),
      );
    }

    return visibility !== "confidential" && visibility !== "service";
  }

  if (projection === "controlled") {
    if (
      event.projection.permittedRoles &&
      event.projection.permittedRoles.length > 0
    ) {
      return Boolean(
        role && event.projection.permittedRoles.includes(role),
      );
    }

    return visibility !== "service";
  }

  if (projection === "confidential") {
    return Boolean(
      role &&
        (event.projection.permittedRoles?.includes(role) ??
          false),
    );
  }

  return false;
}

/* ========================================================================== *
 * Audit export
 * ========================================================================== */

export interface AcademyAuditExport {
  readonly exportId: InstitutionalIdentifier;
  readonly generatedAt: ISODateTimeString;
  readonly projection: AcademyEventVisibility;
  readonly eventCount: number;
  readonly events: readonly JsonValue[];
  readonly integrityHash: ContentHash;
  readonly boundary: string;
}

export interface AcademyAuditExportDependencies {
  readonly createExportId: () => InstitutionalIdentifier;
  readonly now: () => ISODateTimeString;
  readonly hashCanonicalValue: (
    value: JsonValue,
  ) => Promise<ContentHash> | ContentHash;
}

export async function createAcademyAuditExport(
  events: readonly AcademyEvent[],
  projection: ProjectionClass,
  dependencies: AcademyAuditExportDependencies,
  role?: InstitutionalRole,
  organizationId?: InstitutionalIdentifier,
): Promise<AcademyAuditExport> {
  const visible = events.filter((event) =>
    canProjectEvent(event, projection, role, organizationId),
  );

  const projected: JsonValue[] = visible.map((event) =>
    projection === "public"
      ? (projectPublicAcademyEvent(event) as unknown as JsonValue)
      : (projectAcademyTimelineItem(
          event,
          projection,
        ) as unknown as JsonValue),
  );

  const integrityHash = await dependencies.hashCanonicalValue(
    projected,
  );

  return deepFreeze({
    exportId: dependencies.createExportId(),
    generatedAt: dependencies.now(),
    projection:
      projection === "authenticated"
        ? "authenticated"
        : projection,
    eventCount: projected.length,
    events: projected,
    integrityHash,
    boundary: TA14_ACADEMY_EVENT_BOUNDARY,
  });
}

/* ========================================================================== *
 * In-memory repository
 * ========================================================================== */

export class InMemoryAcademyEventRepository
  implements AcademyEventRepository
{
  private readonly events = new Map<
    InstitutionalIdentifier,
    AcademyEvent
  >();

  private readonly idempotency = new Map<
    IdempotencyKey,
    InstitutionalIdentifier
  >();

  async append(
    event: AcademyEvent,
  ): Promise<AcademyEventAppendResult> {
    const existingId = this.idempotency.get(event.idempotencyKey);

    if (existingId) {
      const existing = this.events.get(existingId);

      if (!existing) {
        throw new Error(
          `Idempotency index refers to missing event ${existingId}.`,
        );
      }

      return {
        event: existing,
        appended: false,
        duplicateOfEventId: existing.eventId,
      };
    }

    if (this.events.has(event.eventId)) {
      throw new Error(
        `Academy event ${event.eventId} already exists.`,
      );
    }

    const validation = validateAcademyEvent(event);

    if (!validation.ok) {
      throw new AcademyEventValidationError(
        "Cannot append invalid Academy event.",
        validation.issues as readonly AcademyEventValidationIssue[],
      );
    }

    this.events.set(event.eventId, deepFreeze(event));
    this.idempotency.set(event.idempotencyKey, event.eventId);

    return {
      event,
      appended: true,
    };
  }

  async appendMany(
    events: readonly AcademyEvent[],
  ): Promise<readonly AcademyEventAppendResult[]> {
    const results: AcademyEventAppendResult[] = [];

    for (const event of events) {
      results.push(await this.append(event));
    }

    return results;
  }

  async getById(
    eventId: InstitutionalIdentifier,
  ): Promise<AcademyEvent | null> {
    return this.events.get(eventId) ?? null;
  }

  async getByIdempotencyKey(
    idempotencyKey: IdempotencyKey,
  ): Promise<AcademyEvent | null> {
    const eventId = this.idempotency.get(idempotencyKey);
    return eventId ? this.events.get(eventId) ?? null : null;
  }

  async query(query: AcademyEventQuery): Promise<AcademyEventPage> {
    let values = Array.from(this.events.values());

    if (query.eventIds?.length) {
      const set = new Set(query.eventIds);
      values = values.filter((event) => set.has(event.eventId));
    }

    if (query.eventTypes?.length) {
      const set = new Set(query.eventTypes);
      values = values.filter((event) => set.has(event.eventType));
    }

    if (query.categories?.length) {
      const set = new Set(query.categories);
      values = values.filter((event) => set.has(event.category));
    }

    if (query.effects?.length) {
      const set = new Set(query.effects);
      values = values.filter((event) => set.has(event.effect));
    }

    if (query.recordIds?.length) {
      const set = new Set(query.recordIds);
      values = values.filter((event) =>
        set.has(event.record.recordId),
      );
    }

    if (query.recordTypes?.length) {
      const set = new Set(query.recordTypes);
      values = values.filter((event) =>
        set.has(event.record.recordType),
      );
    }

    if (query.actorSubjectIds?.length) {
      const set = new Set(query.actorSubjectIds);
      values = values.filter(
        (event) =>
          event.actor.subjectId &&
          set.has(event.actor.subjectId),
      );
    }

    if (query.organizationIds?.length) {
      const set = new Set(query.organizationIds);
      values = values.filter(
        (event) =>
          event.actor.organizationId &&
          set.has(event.actor.organizationId),
      );
    }

    if (query.correlationIds?.length) {
      const set = new Set(query.correlationIds);
      values = values.filter((event) =>
        set.has(event.correlationId),
      );
    }

    if (query.causationIds?.length) {
      const set = new Set(query.causationIds);
      values = values.filter(
        (event) =>
          event.causationId && set.has(event.causationId),
      );
    }

    if (query.visibility?.length) {
      const set = new Set(query.visibility);
      values = values.filter((event) =>
        set.has(event.projection.visibility),
      );
    }

    if (query.from) {
      const from = Date.parse(query.from);
      values = values.filter(
        (event) => Date.parse(event.occurredAt) >= from,
      );
    }

    if (query.to) {
      const to = Date.parse(query.to);
      values = values.filter(
        (event) => Date.parse(event.occurredAt) <= to,
      );
    }

    if (query.text?.trim()) {
      const needle = query.text.trim().toLowerCase();
      values = values.filter((event) =>
        JSON.stringify(event).toLowerCase().includes(needle),
      );
    }

    values.sort((a, b) =>
      query.ascending
        ? compareAcademyEvents(a, b)
        : compareAcademyEvents(b, a),
    );

    const total = values.length;
    const offset = decodeCursor(query.cursor);
    const limit = normalizeLimit(query.limit);
    const events = values.slice(offset, offset + limit);
    const nextOffset = offset + events.length;

    return {
      events: deepFreeze(events),
      nextCursor:
        nextOffset < total
          ? encodeCursor(nextOffset)
          : undefined,
      total,
    };
  }

  async getRecordStream(
    recordId: InstitutionalIdentifier,
  ): Promise<readonly AcademyEvent[]> {
    const values = Array.from(this.events.values())
      .filter((event) => event.record.recordId === recordId)
      .sort(compareAcademyEvents);

    return deepFreeze(values);
  }

  async getCorrelationStream(
    correlationId: CorrelationIdentifier,
  ): Promise<readonly AcademyEvent[]> {
    const values = Array.from(this.events.values())
      .filter((event) => event.correlationId === correlationId)
      .sort(compareAcademyEvents);

    return deepFreeze(values);
  }

  async getLatestRecordEvent(
    recordId: InstitutionalIdentifier,
  ): Promise<AcademyEvent | null> {
    const stream = await this.getRecordStream(recordId);
    return stream.length > 0 ? stream[stream.length - 1] : null;
  }

  async count(query: AcademyEventQuery = {}): Promise<number> {
    const result = await this.query({
      ...query,
      limit: Number.MAX_SAFE_INTEGER,
    });

    return result.total ?? result.events.length;
  }

  clear(): void {
    this.events.clear();
    this.idempotency.clear();
  }
}

/* ========================================================================== *
 * Subscriber hub
 * ========================================================================== */

export class AcademyEventHub implements AcademyEventPublisher {
  private readonly subscribers = new Map<
    string,
    AcademyEventSubscriber
  >();

  register(subscriber: AcademyEventSubscriber): void {
    if (this.subscribers.has(subscriber.subscriberId)) {
      throw new Error(
        `Subscriber ${subscriber.subscriberId} is already registered.`,
      );
    }

    this.subscribers.set(subscriber.subscriberId, subscriber);
  }

  unregister(subscriberId: string): void {
    this.subscribers.delete(subscriberId);
  }

  async publish(event: AcademyEvent): Promise<void> {
    for (const subscriber of this.subscribers.values()) {
      if (
        subscriber.eventTypes?.length &&
        !subscriber.eventTypes.includes(event.eventType)
      ) {
        continue;
      }

      if (
        subscriber.categories?.length &&
        !subscriber.categories.includes(event.category)
      ) {
        continue;
      }

      await subscriber.handle(event);
    }
  }
}

/* ========================================================================== *
 * Event draft factories
 * ========================================================================== */

export function createLessonResolvedEventDraft(
  input: {
    readonly actor: AcademyEventActor;
    readonly authority: AcademyEventAuthority;
    readonly record: AcademyEventRecordRef;
    readonly correlationId: CorrelationIdentifier;
    readonly idempotencyKey: IdempotencyKey;
    readonly payload: LessonResolvedPayload;
    readonly visibility?: AcademyEventVisibility;
  },
): AcademyEventDraft<LessonResolvedPayload & JsonValue> {
  return {
    eventType: "academy.lesson.resolved",
    actor: input.actor,
    authority: input.authority,
    record: input.record,
    correlationId: input.correlationId,
    idempotencyKey: input.idempotencyKey,
    payload: input.payload as unknown as LessonResolvedPayload & JsonValue,
    projection: {
      visibility: input.visibility ?? "authenticated",
      protectedPayloadPaths: [
        "recordId",
        "actionId",
        "warnings",
      ],
      publicSummary:
        "TA-14 Academy resolved contextual guidance for an institutional function.",
    },
  };
}

export function createLearningBlockerEventDraft(
  input: {
    readonly eventType:
      | "academy.learning_blocker.created"
      | "academy.learning_blocker.updated"
      | "academy.learning_blocker.resolved"
      | "academy.learning_blocker.withdrawn";
    readonly actor: AcademyEventActor;
    readonly authority: AcademyEventAuthority;
    readonly record: AcademyEventRecordRef;
    readonly correlationId: CorrelationIdentifier;
    readonly idempotencyKey: IdempotencyKey;
    readonly payload: LearningBlockerPayload;
  },
): AcademyEventDraft<LearningBlockerPayload & JsonValue> {
  return {
    eventType: input.eventType,
    actor: input.actor,
    authority: input.authority,
    record: input.record,
    priorState: input.payload.priorState,
    newState: input.payload.newState,
    correlationId: input.correlationId,
    idempotencyKey: input.idempotencyKey,
    payload: input.payload as unknown as LearningBlockerPayload & JsonValue,
    projection: {
      visibility: "controlled",
      protectedPayloadPaths: [
        "responsibleSubjectId",
        "reason",
        "completionCondition",
      ],
      publicSummary:
        "A bounded Academy learning requirement changed state.",
    },
  };
}

export function createAssessmentResultEventDraft(
  input: {
    readonly eventType:
      | "academy.assessment.passed"
      | "academy.assessment.conditionally_passed"
      | "academy.assessment.failed"
      | "academy.assessment.invalidated";
    readonly actor: AcademyEventActor;
    readonly authority: AcademyEventAuthority;
    readonly record: AcademyEventRecordRef;
    readonly correlationId: CorrelationIdentifier;
    readonly idempotencyKey: IdempotencyKey;
    readonly payload: AssessmentResultPayload;
  },
): AcademyEventDraft<AssessmentResultPayload & JsonValue> {
  return {
    eventType: input.eventType,
    actor: input.actor,
    authority: input.authority,
    record: input.record,
    priorState: "in_progress",
    newState: input.payload.result,
    correlationId: input.correlationId,
    idempotencyKey: input.idempotencyKey,
    payload: input.payload as unknown as AssessmentResultPayload & JsonValue,
    projection: {
      visibility: "controlled",
      protectedPayloadPaths: [
        "score",
        "boundaryFailures",
        "attemptId",
      ],
      publicSummary:
        "An Academy assessment changed state. Assessment completion does not create authority.",
    },
  };
}

export function createCredentialStateEventDraft(
  input: {
    readonly eventType:
      | "academy.credential.issued"
      | "academy.credential.suspended"
      | "academy.credential.revoked"
      | "academy.credential.expiring"
      | "academy.credential.expired"
      | "academy.credential.superseded";
    readonly actor: AcademyEventActor;
    readonly authority: AcademyEventAuthority;
    readonly record: AcademyEventRecordRef;
    readonly correlationId: CorrelationIdentifier;
    readonly idempotencyKey: IdempotencyKey;
    readonly payload: CredentialStatePayload;
  },
): AcademyEventDraft<CredentialStatePayload & JsonValue> {
  return {
    eventType: input.eventType,
    actor: input.actor,
    authority: input.authority,
    record: input.record,
    priorState: input.payload.priorState,
    newState: input.payload.newState,
    correlationId: input.correlationId,
    idempotencyKey: input.idempotencyKey,
    payload: input.payload as unknown as CredentialStatePayload & JsonValue,
    projection: {
      visibility: "controlled",
      protectedPayloadPaths: [
        "competenceScope",
        "restrictions",
      ],
      publicSummary:
        "An Academy credential changed state. Credential status does not itself create authority.",
    },
  };
}

export function createAuthorityStateEventDraft(
  input: {
    readonly eventType:
      | "authority.grant.issued"
      | "authority.grant.constrained"
      | "authority.grant.held"
      | "authority.grant.revoked";
    readonly actor: AcademyEventActor;
    readonly authority: AcademyEventAuthority;
    readonly record: AcademyEventRecordRef;
    readonly correlationId: CorrelationIdentifier;
    readonly idempotencyKey: IdempotencyKey;
    readonly payload: AuthorityStatePayload;
  },
): AcademyEventDraft<AuthorityStatePayload & JsonValue> {
  return {
    eventType: input.eventType,
    actor: input.actor,
    authority: input.authority,
    record: input.record,
    priorState: input.payload.priorState,
    newState: input.payload.newState,
    correlationId: input.correlationId,
    idempotencyKey: input.idempotencyKey,
    payload: input.payload as unknown as AuthorityStatePayload & JsonValue,
    projection: {
      visibility: "controlled",
      protectedPayloadPaths: [
        "scope",
        "restrictions",
        "credentialEvidenceIds",
        "assignmentId",
      ],
      publicSummary:
        "A separate bounded authority grant changed state.",
    },
  };
}

export function createRevalidationEventDraft(
  input: {
    readonly eventType:
      | "academy.revalidation.required"
      | "academy.revalidation.started"
      | "academy.revalidation.completed"
      | "academy.revalidation.failed"
      | "academy.revalidation.held"
      | "academy.revalidation.withdrawn";
    readonly actor: AcademyEventActor;
    readonly authority: AcademyEventAuthority;
    readonly record: AcademyEventRecordRef;
    readonly correlationId: CorrelationIdentifier;
    readonly idempotencyKey: IdempotencyKey;
    readonly payload: RevalidationPayload;
  },
): AcademyEventDraft<RevalidationPayload & JsonValue> {
  return {
    eventType: input.eventType,
    actor: input.actor,
    authority: input.authority,
    record: input.record,
    priorState: input.payload.priorState,
    newState: input.payload.newState,
    correlationId: input.correlationId,
    idempotencyKey: input.idempotencyKey,
    payload: input.payload as unknown as RevalidationPayload & JsonValue,
    projection: {
      visibility: "controlled",
      protectedPayloadPaths: [
        "affectedCredentialIds",
        "affectedAuthorityGrantIds",
        "affectedAssignmentIds",
      ],
      publicSummary:
        "A material change created or resolved an Academy revalidation obligation.",
    },
  };
}

/* ========================================================================== *
 * Utility functions
 * ========================================================================== */

export function isExtendedAcademyEventType(
  value: unknown,
): value is ExtendedAcademyEventType {
  return (
    typeof value === "string" &&
    EXTENDED_ACADEMY_EVENT_TYPES.includes(
      value as ExtendedAcademyEventType,
    )
  );
}

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDateTime(value: unknown): value is ISODateTimeString {
  return (
    typeof value === "string" &&
    value.includes("T") &&
    Number.isFinite(Date.parse(value))
  );
}

function isContentHashValue(value: unknown): value is ContentHash {
  return (
    typeof value === "string" &&
    /^sha256:[a-fA-F0-9]{64}$/.test(value)
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

function requiredString(
  value: unknown,
  path: string,
  issues: AcademyEventValidationIssue[],
): void {
  if (!isNonEmptyString(value)) {
    issues.push({
      path,
      code: "required",
      message: `${path} must be a non-empty string.`,
      severity: "error",
      received: value,
    });
  }
}

function cloneJson<T extends JsonValue>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeLimit(limit?: number): number {
  if (
    typeof limit !== "number" ||
    !Number.isFinite(limit) ||
    limit <= 0
  ) {
    return 100;
  }

  return Math.min(Math.floor(limit), 1000);
}

function encodeCursor(offset: number): string {
  return String(offset);
}

function decodeCursor(cursor?: string): number {
  if (!cursor) return 0;

  const parsed = Number(cursor);
  return Number.isFinite(parsed) && parsed >= 0
    ? Math.floor(parsed)
    : 0;
}

function buildActorLabel(actor: AcademyEventActor): string {
  if (actor.displayName) return actor.displayName;
  if (actor.serviceName) return actor.serviceName;
  if (actor.subjectId) return actor.subjectId;
  return "Unattributed actor";
}

function buildPublicActorLabel(actor: AcademyEventActor): string {
  if (actor.serviceName) return actor.serviceName;
  if (actor.role) return actor.role.replaceAll("_", " ");
  return actor.authenticated
    ? "Authenticated institutional actor"
    : "Public visitor";
}

function buildEventTitle(event: AcademyEvent): string {
  return event.eventType
    .split(".")
    .map((part) => part.replaceAll("_", " "))
    .join(" › ");
}

function buildEventSummary(event: AcademyEvent): string {
  const transition =
    event.priorState !== undefined || event.newState !== undefined
      ? ` State: ${event.priorState ?? "none"} -> ${event.newState ?? "none"}.`
      : "";

  return `${buildEventTitle(event)} for ${event.record.recordType} ${event.record.recordId}.${transition}`;
}

function isLessonLifecycleState(
  value: string,
): value is LessonLifecycleState {
  return [
    "not_started",
    "in_progress",
    "completed",
    "expired",
    "restricted",
    "superseded",
  ].includes(value);
}

function isAssessmentState(
  value: string,
): value is AssessmentState {
  return [
    "not_attempted",
    "in_progress",
    "passed",
    "conditionally_passed",
    "failed",
    "under_review",
    "invalidated",
  ].includes(value);
}

function isCredentialState(
  value: string,
): value is CredentialState {
  return [
    "pending",
    "active",
    "expiring",
    "expired",
    "suspended",
    "revoked",
    "superseded",
  ].includes(value);
}

function isAuthorityState(
  value: string,
): value is AuthorityState {
  return [
    "not_granted",
    "active",
    "constrained",
    "held",
    "revoked",
    "expired",
  ].includes(value);
}

function isSimulationState(
  value: string,
): value is SimulationState {
  return [
    "draft",
    "running",
    "completed",
    "invalid",
    "archived",
  ].includes(value);
}

function isHandoffState(
  value: string,
): value is OperationalHandoffState {
  return [
    "not_ready",
    "ready",
    "opened",
    "completed",
    "blocked",
    "returned_for_correction",
    "denied",
    "escalated",
  ].includes(value);
}

/* ========================================================================== *
 * Deterministic test dependencies
 * ========================================================================== */

export function createDeterministicAcademyEventDependencies(
  startAt = "2026-08-04T13:00:00.000Z",
): AcademyEventCreationDependencies {
  let counter = 0;

  return {
    createEventId: () => {
      counter += 1;
      return `TA14-ACD-EVT-${String(counter).padStart(6, "0")}`;
    },
    now: () =>
      new Date(
        Date.parse(startAt) + counter * 1000,
      ).toISOString(),
    hashCanonicalValue: (value) => {
      const source = stableStringify(value);
      const hash = deterministicHex(source);
      return `sha256:${hash}`;
    },
  };
}

function stableStringify(value: JsonValue): string {
  return JSON.stringify(sortJson(value));
}

function sortJson(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }

  if (isPlainObject(value)) {
    const result: Record<string, JsonValue> = {};

    for (const key of Object.keys(value).sort()) {
      result[key] = sortJson(value[key] as JsonValue);
    }

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

  const parts = [a, b, c, d, a ^ c, b ^ d, a ^ b, c ^ d];

  return parts
    .map((part) => (part >>> 0).toString(16).padStart(8, "0"))
    .join("")
    .slice(0, 64);
}

/* ========================================================================== *
 * Self-check
 * ========================================================================== */

export interface AcademyEventEngineSelfCheck {
  readonly ok: boolean;
  readonly engineVersion: typeof TA14_ACADEMY_EVENT_ENGINE_VERSION;
  readonly eventCreated: boolean;
  readonly eventValidated: boolean;
  readonly idempotencyPreserved: boolean;
  readonly replayIntegrityValid: boolean;
  readonly issueCount: number;
  readonly issues: readonly string[];
}

export async function runAcademyEventEngineSelfCheck():
  Promise<AcademyEventEngineSelfCheck> {
  const issues: string[] = [];
  const repository = new InMemoryAcademyEventRepository();
  const creation = createDeterministicAcademyEventDependencies();
  const service = new AcademyEventService({
    repository,
    creation,
  });

  const draft = createLessonResolvedEventDraft({
    actor: {
      subjectId: "TA14-SUBJECT-TEST",
      organizationId: "TA14-ORG-TEST",
      role: "entity_steward",
      authenticated: true,
    },
    authority: {
      basis: "academy.context_resolver",
      limitations: [
        "Resolution does not issue registration.",
        "Resolution does not create authority.",
      ],
    },
    record: {
      recordId: "TA14-REG-TEST-000001",
      recordType: "governance_registration",
      recordVersion: "1.0",
    },
    correlationId: "TA14-CORR-TEST-000001",
    idempotencyKey: "academy-test:lesson-resolved:1",
    payload: {
      lessonId: "TA14-ACD-LESSON-000003",
      lessonVersion: "3.0",
      route: "/workspace/entities/new",
      recordType: "governance_registration",
      recordId: "TA14-REG-TEST-000001",
      actionType: "complete_registration",
      actionId: "TA14-ACT-TEST-000001",
      performingRole: "entity_steward",
      lifecycleState: "draft",
      projection: "authenticated",
      score: 300,
      matchedMappingIds: ["TA14-ACD-MAP-000001"],
      relatedLessonIds: [],
      warnings: [],
      fallbackUsed: false,
    },
  });

  const first = await service.emit(draft);
  const second = await service.emit(draft);
  const replay = await service.replayRecord(
    "TA14-REG-TEST-000001",
  );

  const validation = validateAcademyEvent(first.event);

  if (!validation.ok) {
    issues.push("Created event failed validation.");
  }

  if (second.appended !== false) {
    issues.push("Idempotency did not prevent duplicate append.");
  }

  if (!replay.state?.integrityChainValid) {
    issues.push("Replay integrity chain is invalid.");
  }

  return {
    ok: issues.length === 0,
    engineVersion: TA14_ACADEMY_EVENT_ENGINE_VERSION,
    eventCreated: first.appended,
    eventValidated: validation.ok,
    idempotencyPreserved: second.appended === false,
    replayIntegrityValid:
      replay.state?.integrityChainValid ?? false,
    issueCount: issues.length,
    issues,
  };
}

/* ========================================================================== *
 * Default export
 * ========================================================================== */

const academyEvents = {
  engineId: TA14_ACADEMY_EVENT_ENGINE_ID,
  engineVersion: TA14_ACADEMY_EVENT_ENGINE_VERSION,
  boundary: TA14_ACADEMY_EVENT_BOUNDARY,

  eventTypes: EXTENDED_ACADEMY_EVENT_TYPES,
  categories: ACADEMY_EVENT_CATEGORIES,
  effects: ACADEMY_EVENT_EFFECTS,

  createAcademyEvent,
  validateAcademyEvent,
  replayAcademyEvents,
  buildAcademyTimeline,
  buildMissionControlAcademySignals,
  projectPublicAcademyEvent,
  createAcademyAuditExport,

  createLessonResolvedEventDraft,
  createLearningBlockerEventDraft,
  createAssessmentResultEventDraft,
  createCredentialStateEventDraft,
  createAuthorityStateEventDraft,
  createRevalidationEventDraft,

  InMemoryAcademyEventRepository,
  AcademyEventService,
  AcademyEventHub,

  createDeterministicAcademyEventDependencies,
  runAcademyEventEngineSelfCheck,
};

export default academyEvents;
