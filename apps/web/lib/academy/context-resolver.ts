/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * ACD-002 — Canonical Academy Context Resolver
 *
 * Create:
 *   apps/web/lib/academy/context-resolver.ts
 *
 * Depends on:
 *   apps/web/lib/academy/lesson-contracts.ts
 *
 * Purpose:
 *   Resolve one current, role-appropriate, projection-safe Academy lesson for
 *   a live institutional page, action, record, blocker, or Mission Control
 *   requirement. The resolver does not hard-code instructional content into
 *   operational pages. It receives bounded context, evaluates active mappings,
 *   filters by visibility and authority, scores candidates, preserves return
 *   context, and reports content gaps when no exact lesson exists.
 *
 * Constitutional boundary:
 *   The resolver may select guidance. It may not grant authority, admit
 *   evidence, approve a registration, commit a determination, create an
 *   artifact, publish a Registry record, or otherwise create substantive
 *   institutional effect.
 */

import {
  ACADEMY_RESOLVER_SCORES,
  GOVERNANCE_ENTITY_REGISTRATION_LESSON_ID,
  TA14_ACADEMY_NON_SUBSTITUTION_RULE,
  type AcademyContentGapAction,
  type AcademyLessonDefinition,
  type AcademyResolverContext,
  type AcademyRouteMapping,
  type CorrelationIdentifier,
  type InstitutionalRecordType,
  type InstitutionalRole,
  type LessonIdentifier,
  type ProjectionClass,
  type ResolvedAcademyLesson,
  type RoutePattern,
  type SignedAcademyReturnContext,
  type ValidationIssue,
  deepFreeze,
  governanceEntityRegistrationLessonExample,
  projectAcademyLesson,
  validateAcademyLessonDefinition,
} from "./lesson-contracts";

/* ========================================================================== *
 * Resolver constants
 * ========================================================================== */

export const TA14_ACADEMY_RESOLVER_VERSION = "3.0" as const;

export const TA14_ACADEMY_RESOLVER_BOUNDARY =
  "The Academy Context Resolver selects instructional guidance only. It does not create registration, review, approval, endorsement, evidence admission, credential, authority, determination, execution, artifact, Registry, or outcome effect." as const;

export const DEFAULT_ORIENTATION_LESSON_ID =
  "TA14-ACD-LESSON-000001" as const;

export const DEFAULT_RESOLVER_MAX_RELATED_LESSONS = 3;
export const DEFAULT_RESOLVER_MINIMUM_PRIMARY_SCORE = 1;
export const DEFAULT_RETURN_CONTEXT_TTL_SECONDS = 3600;

export const RESOLUTION_REASONS = [
  "action_type_exact",
  "record_type_exact",
  "route_exact",
  "route_pattern",
  "role_exact",
  "role_general",
  "lifecycle_state_exact",
  "blocker_type_exact",
  "projection_exact",
  "lesson_operational_route",
  "lesson_record_type",
  "lesson_role",
  "lesson_active",
  "lesson_effective",
  "lesson_fresh",
  "mapping_priority",
  "orientation_fallback",
  "content_gap_fallback",
] as const;

export type ResolutionReason = (typeof RESOLUTION_REASONS)[number];

export const RESOLUTION_WARNING_CODES = [
  "no_exact_mapping",
  "orientation_fallback_used",
  "content_gap_created",
  "lesson_not_effective",
  "lesson_expired",
  "lesson_superseded",
  "lesson_restricted",
  "projection_filtered",
  "role_filtered",
  "authority_sensitive",
  "return_context_omitted",
  "return_context_sanitized",
  "duplicate_mapping",
  "mapping_references_missing_lesson",
  "lesson_contract_invalid",
  "ambiguous_top_score",
  "related_lesson_filtered",
] as const;

export type ResolutionWarningCode =
  (typeof RESOLUTION_WARNING_CODES)[number];

/* ========================================================================== *
 * Repository contracts
 * ========================================================================== */

export interface AcademyLessonRepository {
  getLessonById(
    lessonId: LessonIdentifier,
    version?: string,
  ): Promise<AcademyLessonDefinition | null>;

  getActiveLessonById(
    lessonId: LessonIdentifier,
    at?: string,
  ): Promise<AcademyLessonDefinition | null>;

  listLessons(): Promise<readonly AcademyLessonDefinition[]>;

  listActiveLessons(at?: string): Promise<readonly AcademyLessonDefinition[]>;
}

export interface AcademyRouteMappingRepository {
  listMappings(): Promise<readonly AcademyRouteMapping[]>;

  listActiveMappings(at?: string): Promise<readonly AcademyRouteMapping[]>;
}

export interface AcademyResolutionAuditSink {
  recordResolution(
    event: AcademyResolutionAuditEvent,
  ): Promise<void> | void;
}

export interface AcademyReturnContextSigner {
  sign(payload: AcademyReturnContextPayload): Promise<string> | string;
  algorithm: "HMAC-SHA256" | "ED25519";
}

export interface AcademyClock {
  now(): Date;
}

export interface AcademyResolverDependencies {
  readonly lessons: AcademyLessonRepository;
  readonly mappings: AcademyRouteMappingRepository;
  readonly signer?: AcademyReturnContextSigner;
  readonly audit?: AcademyResolutionAuditSink;
  readonly clock?: AcademyClock;
}

/* ========================================================================== *
 * Resolution contracts
 * ========================================================================== */

export interface AcademyReturnContextPayload {
  readonly version: 1;
  readonly route: string;
  readonly recordId?: string;
  readonly recordType?: InstitutionalRecordType;
  readonly actionId?: string;
  readonly actionType?: string;
  readonly role?: InstitutionalRole;
  readonly lifecycleState?: string;
  readonly scrollAnchor?: string;
  readonly projection: ProjectionClass;
  readonly issuedAt: string;
  readonly expiresAt: string;
  readonly correlationId?: CorrelationIdentifier;
}

export interface ResolverCandidateScore {
  readonly mappingId: string;
  readonly lessonId: LessonIdentifier;
  readonly lessonVersion?: string;
  readonly mappingPriority: number;
  readonly score: number;
  readonly reasons: readonly ResolverScoreReason[];
  readonly warnings: readonly ResolverWarning[];
  readonly rejected: boolean;
  readonly rejectionReasons: readonly string[];
}

export interface ResolverScoreReason {
  readonly reason: ResolutionReason;
  readonly points: number;
  readonly detail: string;
}

export interface ResolverWarning {
  readonly code: ResolutionWarningCode;
  readonly message: string;
  readonly mappingId?: string;
  readonly lessonId?: LessonIdentifier;
}

export interface ResolverTrace {
  readonly resolverVersion: typeof TA14_ACADEMY_RESOLVER_VERSION;
  readonly context: AcademyResolverContext;
  readonly normalizedContext: NormalizedAcademyResolverContext;
  readonly candidateScores: readonly ResolverCandidateScore[];
  readonly selectedMappingId?: string;
  readonly selectedLessonId?: LessonIdentifier;
  readonly selectedLessonVersion?: string;
  readonly fallbackUsed: boolean;
  readonly contentGapCreated: boolean;
  readonly warnings: readonly ResolverWarning[];
  readonly startedAt: string;
  readonly completedAt: string;
  readonly durationMs: number;
}

export interface AcademyResolutionResult extends ResolvedAcademyLesson {
  readonly trace: ResolverTrace;
  readonly panel: EmbeddedLearningPanelModel;
  readonly requirements: AcademyResolvedRequirements;
  readonly missionControl: MissionControlLearningSignal;
}

export interface AcademyResolvedRequirements {
  readonly simulationAvailable: boolean;
  readonly simulationRequired: boolean;
  readonly assessmentRequired: boolean;
  readonly credentialIds: readonly string[];
  readonly authorityGrantTypes: readonly string[];
  readonly authorityGrantRequiredForLiveWork: boolean;
  readonly blockingPrerequisites: readonly ResolvedPrerequisite[];
  readonly completionRuleIds: readonly string[];
  readonly continuityTriggerIds: readonly string[];
  readonly authorityBoundary: string;
  readonly nonSubstitutionRule: string;
}

export interface ResolvedPrerequisite {
  readonly prerequisiteId: string;
  readonly title: string;
  readonly description: string;
  readonly enforcement: string;
  readonly satisfied: boolean | null;
  readonly blocking: boolean;
  readonly referencedObjectId?: string;
  readonly requiredState?: string;
}

export interface EmbeddedLearningPanelModel {
  readonly heading: "TA-14 ACADEMY — LEARN THIS PAGE";
  readonly currentFunction: string;
  readonly recordType?: InstitutionalRecordType;
  readonly recordId?: string;
  readonly role?: InstitutionalRole;
  readonly lifecycleState?: string;
  readonly blockerType?: string;
  readonly lessonId: LessonIdentifier;
  readonly lessonTitle: string;
  readonly lessonVersion: string;
  readonly lessonSummary: string;
  readonly whyThisMatters: string;
  readonly actions: readonly EmbeddedLearningPanelAction[];
  readonly authorityBoundary: string;
  readonly simulationMarker?: "SIMULATION - NO PRODUCTION EFFECT";
  readonly warnings: readonly string[];
}

export interface EmbeddedLearningPanelAction {
  readonly id:
    | "learn_this_section"
    | "why_this_matters"
    | "step_by_step_guide"
    | "view_completed_example"
    | "practice_safely"
    | "check_completion_standard"
    | "return_to_live_record";
  readonly label: string;
  readonly enabled: boolean;
  readonly href?: string;
  readonly reasonDisabled?: string;
}

export interface MissionControlLearningSignal {
  readonly createsAction: boolean;
  readonly actionType?: "complete_required_learning" | "academy_content_gap";
  readonly priority: "none" | "low" | "normal" | "high" | "critical";
  readonly title?: string;
  readonly description?: string;
  readonly blockingEffect?: string;
  readonly resolution?: string;
  readonly linkedLessonId?: LessonIdentifier;
  readonly linkedRecordId?: string;
  readonly linkedActionId?: string;
}

export interface AcademyResolutionAuditEvent {
  readonly eventType: "academy.lesson.resolved";
  readonly resolverVersion: typeof TA14_ACADEMY_RESOLVER_VERSION;
  readonly occurredAt: string;
  readonly correlationId: CorrelationIdentifier;
  readonly institutionalSubjectId?: string;
  readonly organizationId?: string;
  readonly route: string;
  readonly recordId?: string;
  readonly recordType?: InstitutionalRecordType;
  readonly actionId?: string;
  readonly actionType?: string;
  readonly performingRole?: InstitutionalRole;
  readonly projection: ProjectionClass;
  readonly selectedLessonId?: LessonIdentifier;
  readonly selectedLessonVersion?: string;
  readonly selectedMappingId?: string;
  readonly score?: number;
  readonly fallbackUsed: boolean;
  readonly contentGapCreated: boolean;
  readonly warnings: readonly ResolutionWarningCode[];
  readonly authorityBoundary: typeof TA14_ACADEMY_RESOLVER_BOUNDARY;
}

export interface NormalizedAcademyResolverContext {
  readonly route: string;
  readonly recordType?: InstitutionalRecordType;
  readonly recordId?: string;
  readonly actionType?: string;
  readonly actionId?: string;
  readonly performingRole?: InstitutionalRole;
  readonly lifecycleState?: string;
  readonly blockerType?: string;
  readonly projection: ProjectionClass;
  readonly institutionalSubjectId?: string;
  readonly organizationId?: string;
  readonly correlationId: CorrelationIdentifier;
  readonly returnUrl?: string;
  readonly scrollAnchor?: string;
  readonly now: string;
}

export interface ResolveAcademyLessonOptions {
  readonly includeRelatedLessons?: boolean;
  readonly maxRelatedLessons?: number;
  readonly minimumPrimaryScore?: number;
  readonly createContentGapAction?: boolean;
  readonly useOrientationFallback?: boolean;
  readonly signReturnContext?: boolean;
  readonly emitAuditEvent?: boolean;
  readonly allowRestrictedLessons?: boolean;
}

const DEFAULT_RESOLVE_OPTIONS: Required<ResolveAcademyLessonOptions> = {
  includeRelatedLessons: true,
  maxRelatedLessons: DEFAULT_RESOLVER_MAX_RELATED_LESSONS,
  minimumPrimaryScore: DEFAULT_RESOLVER_MINIMUM_PRIMARY_SCORE,
  createContentGapAction: true,
  useOrientationFallback: true,
  signReturnContext: true,
  emitAuditEvent: true,
  allowRestrictedLessons: false,
};

/* ========================================================================== *
 * Errors
 * ========================================================================== */

export class AcademyResolverError extends Error {
  readonly code: AcademyResolverErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    code: AcademyResolverErrorCode,
    message: string,
    details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = "AcademyResolverError";
    this.code = code;
    this.details = details;
  }
}

export type AcademyResolverErrorCode =
  | "INVALID_CONTEXT"
  | "LESSON_REPOSITORY_FAILURE"
  | "MAPPING_REPOSITORY_FAILURE"
  | "NO_LESSON_AVAILABLE"
  | "LESSON_CONTRACT_INVALID"
  | "RETURN_CONTEXT_SIGNING_FAILED"
  | "AUDIT_FAILURE";

/* ========================================================================== *
 * Resolver implementation
 * ========================================================================== */

export class AcademyContextResolver {
  private readonly dependencies: AcademyResolverDependencies;

  constructor(dependencies: AcademyResolverDependencies) {
    this.dependencies = dependencies;
  }

  async resolve(
    context: AcademyResolverContext,
    options: ResolveAcademyLessonOptions = {},
  ): Promise<AcademyResolutionResult> {
    const resolvedOptions = { ...DEFAULT_RESOLVE_OPTIONS, ...options };
    const clock = this.dependencies.clock ?? systemClock;
    const started = clock.now();
    const startedAt = started.toISOString();
    const normalized = normalizeResolverContext(context, started);
    const globalWarnings: ResolverWarning[] = [];

    let mappings: readonly AcademyRouteMapping[];
    let lessons: readonly AcademyLessonDefinition[];

    try {
      [mappings, lessons] = await Promise.all([
        this.dependencies.mappings.listActiveMappings(normalized.now),
        this.dependencies.lessons.listActiveLessons(normalized.now),
      ]);
    } catch (error) {
      throw new AcademyResolverError(
        "MAPPING_REPOSITORY_FAILURE",
        "Unable to load Academy mappings or lessons.",
        { cause: error instanceof Error ? error.message : String(error) },
      );
    }

    const lessonByKey = buildLessonIndex(lessons, globalWarnings);
    const candidateMappings = collectCandidateMappings(
      mappings,
      normalized,
      globalWarnings,
    );

    const candidateScores = candidateMappings.map((mapping) =>
      scoreCandidate({
        mapping,
        context: normalized,
        lesson: findMappedLesson(mapping, lessonByKey),
        allowRestrictedLessons: resolvedOptions.allowRestrictedLessons,
      }),
    );

    const acceptedCandidates = candidateScores
      .filter((candidate) => !candidate.rejected)
      .filter((candidate) => candidate.score >= resolvedOptions.minimumPrimaryScore)
      .sort(compareCandidateScores);

    let selectedCandidate = acceptedCandidates[0];
    let selectedLesson = selectedCandidate
      ? findLessonForCandidate(selectedCandidate, lessonByKey)
      : null;
    let fallbackUsed = false;
    let contentGapCreated = false;
    let contentGapAction: AcademyContentGapAction | undefined;

    if (acceptedCandidates.length > 1) {
      const first = acceptedCandidates[0];
      const second = acceptedCandidates[1];
      if (first.score === second.score) {
        globalWarnings.push({
          code: "ambiguous_top_score",
          message:
            `Two Academy mappings tied at score ${first.score}; deterministic tie-breaking selected ${first.mappingId}.`,
          mappingId: first.mappingId,
          lessonId: first.lessonId,
        });
      }
    }

    if (!selectedLesson && resolvedOptions.useOrientationFallback) {
      const orientation = await this.resolveOrientationFallback(
        lessonByKey,
        normalized,
      );

      if (orientation) {
        fallbackUsed = true;
        selectedLesson = orientation;
        selectedCandidate = createFallbackCandidate(orientation);
        globalWarnings.push({
          code: "orientation_fallback_used",
          message:
            "No exact Academy mapping was available. Institutional Orientation was selected as the safe fallback.",
          lessonId: orientation.lessonId,
        });
      }
    }

    if (!selectedLesson && resolvedOptions.createContentGapAction) {
      contentGapCreated = true;
      contentGapAction = createContentGap(normalized);
      globalWarnings.push({
        code: "content_gap_created",
        message:
          "No current, projection-safe Academy lesson could be resolved. A content-gap action was created.",
      });
    }

    if (!selectedLesson || !selectedCandidate) {
      throw new AcademyResolverError(
        "NO_LESSON_AVAILABLE",
        "No Academy lesson could be resolved for the supplied context.",
        { context: normalized, contentGapAction },
      );
    }

    const lessonValidation = validateAcademyLessonDefinition(selectedLesson);
    if (!lessonValidation.ok) {
      throw new AcademyResolverError(
        "LESSON_CONTRACT_INVALID",
        "The selected Academy lesson failed contract validation.",
        {
          lessonId: selectedLesson.lessonId,
          lessonVersion: selectedLesson.version,
          issues: lessonValidation.issues,
        },
      );
    }

    assertLessonProjectionSafe(
      selectedLesson,
      normalized.projection,
      normalized.performingRole,
    );

    const relatedLessons = resolvedOptions.includeRelatedLessons
      ? resolveRelatedLessons({
          primary: selectedLesson,
          lessonByKey,
          projection: normalized.projection,
          role: normalized.performingRole,
          max: resolvedOptions.maxRelatedLessons,
          warnings: globalWarnings,
        })
      : [];

    const returnContext =
      resolvedOptions.signReturnContext && this.dependencies.signer
        ? await createSignedReturnContext({
            lesson: selectedLesson,
            context: normalized,
            signer: this.dependencies.signer,
            warnings: globalWarnings,
          })
        : undefined;

    if (
      resolvedOptions.signReturnContext &&
      !this.dependencies.signer &&
      selectedLesson.returnContext.enabled
    ) {
      globalWarnings.push({
        code: "return_context_omitted",
        message:
          "The lesson permits return context, but no signer was configured. Return context was omitted.",
        lessonId: selectedLesson.lessonId,
      });
    }

    const completed = clock.now();
    const trace: ResolverTrace = deepFreeze({
      resolverVersion: TA14_ACADEMY_RESOLVER_VERSION,
      context,
      normalizedContext: normalized,
      candidateScores,
      selectedMappingId: selectedCandidate.mappingId,
      selectedLessonId: selectedLesson.lessonId,
      selectedLessonVersion: selectedLesson.version,
      fallbackUsed,
      contentGapCreated,
      warnings: globalWarnings,
      startedAt,
      completedAt: completed.toISOString(),
      durationMs: Math.max(0, completed.getTime() - started.getTime()),
    });

    const result: AcademyResolutionResult = deepFreeze({
      lesson: selectedLesson,
      score: selectedCandidate.score,
      matchedMappingIds: candidateScores
        .filter((candidate) => candidate.lessonId === selectedLesson.lessonId)
        .map((candidate) => candidate.mappingId),
      relatedLessons,
      returnContext,
      warnings: globalWarnings.map((warning) => warning.message),
      contentGapAction,
      trace,
      panel: buildEmbeddedLearningPanel({
        lesson: selectedLesson,
        context: normalized,
        returnContext,
        warnings: globalWarnings,
      }),
      requirements: resolveRequirements(selectedLesson),
      missionControl: buildMissionControlSignal({
        lesson: selectedLesson,
        context: normalized,
        contentGapAction,
      }),
    });

    if (resolvedOptions.emitAuditEvent && this.dependencies.audit) {
      await this.emitAuditEvent(result, normalized, globalWarnings);
    }

    return result;
  }

  private async resolveOrientationFallback(
    lessonByKey: ReadonlyMap<string, AcademyLessonDefinition>,
    context: NormalizedAcademyResolverContext,
  ): Promise<AcademyLessonDefinition | null> {
    const indexed = findLessonById(
      lessonByKey,
      DEFAULT_ORIENTATION_LESSON_ID,
    );
    if (indexed && isLessonUsable(indexed, context, false)) return indexed;

    try {
      const repositoryLesson = await this.dependencies.lessons.getActiveLessonById(
        DEFAULT_ORIENTATION_LESSON_ID,
        context.now,
      );
      if (repositoryLesson && isLessonUsable(repositoryLesson, context, false)) {
        return repositoryLesson;
      }
    } catch {
      // Safe fallback continues below.
    }

    return null;
  }

  private async emitAuditEvent(
    result: AcademyResolutionResult,
    context: NormalizedAcademyResolverContext,
    warnings: readonly ResolverWarning[],
  ): Promise<void> {
    if (!this.dependencies.audit) return;

    const event: AcademyResolutionAuditEvent = {
      eventType: "academy.lesson.resolved",
      resolverVersion: TA14_ACADEMY_RESOLVER_VERSION,
      occurredAt: context.now,
      correlationId: context.correlationId,
      institutionalSubjectId: context.institutionalSubjectId,
      organizationId: context.organizationId,
      route: context.route,
      recordId: context.recordId,
      recordType: context.recordType,
      actionId: context.actionId,
      actionType: context.actionType,
      performingRole: context.performingRole,
      projection: context.projection,
      selectedLessonId: result.lesson.lessonId,
      selectedLessonVersion: result.lesson.version,
      selectedMappingId: result.trace.selectedMappingId,
      score: result.score,
      fallbackUsed: result.trace.fallbackUsed,
      contentGapCreated: result.trace.contentGapCreated,
      warnings: warnings.map((warning) => warning.code),
      authorityBoundary: TA14_ACADEMY_RESOLVER_BOUNDARY,
    };

    try {
      await this.dependencies.audit.recordResolution(event);
    } catch (error) {
      throw new AcademyResolverError(
        "AUDIT_FAILURE",
        "The Academy lesson resolved, but the audit event could not be preserved.",
        { cause: error instanceof Error ? error.message : String(error) },
      );
    }
  }
}

/* ========================================================================== *
 * Normalization
 * ========================================================================== */

export function normalizeResolverContext(
  context: AcademyResolverContext,
  now = new Date(),
): NormalizedAcademyResolverContext {
  if (!context || typeof context !== "object") {
    throw new AcademyResolverError(
      "INVALID_CONTEXT",
      "Academy resolver context must be an object.",
    );
  }

  const route = normalizeRoute(context.route);
  if (!route) {
    throw new AcademyResolverError(
      "INVALID_CONTEXT",
      "Academy resolver context requires a valid route.",
      { route: context.route },
    );
  }

  if (!context.projection) {
    throw new AcademyResolverError(
      "INVALID_CONTEXT",
      "Academy resolver context requires a projection.",
    );
  }

  const nowValue = context.now ? new Date(context.now) : now;
  if (!Number.isFinite(nowValue.getTime())) {
    throw new AcademyResolverError(
      "INVALID_CONTEXT",
      "Academy resolver context contains an invalid now value.",
      { now: context.now },
    );
  }

  return deepFreeze({
    route,
    recordType: context.recordType,
    recordId: cleanOptional(context.recordId),
    actionType: normalizeToken(context.actionType),
    actionId: cleanOptional(context.actionId),
    performingRole: context.performingRole,
    lifecycleState: normalizeToken(context.lifecycleState),
    blockerType: normalizeToken(context.blockerType),
    projection: context.projection,
    institutionalSubjectId: cleanOptional(context.institutionalSubjectId),
    organizationId: cleanOptional(context.organizationId),
    correlationId:
      cleanOptional(context.correlationId) ?? createCorrelationId(nowValue),
    returnUrl: sanitizeReturnUrl(context.returnUrl),
    scrollAnchor: sanitizeScrollAnchor(context.scrollAnchor),
    now: nowValue.toISOString(),
  });
}

function normalizeRoute(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return "";

  const [path] = trimmed.split(/[?#]/, 1);
  const collapsed = path.replace(/\/{2,}/g, "/");
  if (collapsed.length > 1 && collapsed.endsWith("/")) {
    return collapsed.slice(0, -1);
  }
  return collapsed;
}

function normalizeToken(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return normalized || undefined;
}

function cleanOptional(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function sanitizeReturnUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  if (!normalized.startsWith("/")) return undefined;
  if (normalized.startsWith("//")) return undefined;
  if (/javascript:/i.test(normalized)) return undefined;
  return normalized;
}

function sanitizeScrollAnchor(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().replace(/^#/, "");
  if (!normalized) return undefined;
  if (!/^[A-Za-z0-9_:\-.]{1,128}$/.test(normalized)) return undefined;
  return normalized;
}

function createCorrelationId(now: Date): CorrelationIdentifier {
  const stamp = now.toISOString().replace(/[-:.TZ]/g, "");
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `TA14-CORR-${stamp}-${random}`;
}

/* ========================================================================== *
 * Candidate collection and scoring
 * ========================================================================== */

function collectCandidateMappings(
  mappings: readonly AcademyRouteMapping[],
  context: NormalizedAcademyResolverContext,
  warnings: ResolverWarning[],
): readonly AcademyRouteMapping[] {
  const seen = new Set<string>();
  const collected: AcademyRouteMapping[] = [];

  for (const mapping of mappings) {
    if (!mapping.active) continue;
    if (!mappingPotentiallyMatches(mapping, context)) continue;

    if (seen.has(mapping.mappingId)) {
      warnings.push({
        code: "duplicate_mapping",
        message: `Duplicate Academy mapping ${mapping.mappingId} was ignored.`,
        mappingId: mapping.mappingId,
        lessonId: mapping.lessonId,
      });
      continue;
    }

    seen.add(mapping.mappingId);
    collected.push(mapping);
  }

  if (collected.length === 0) {
    warnings.push({
      code: "no_exact_mapping",
      message:
        "No active Academy mapping matched the current route, record, action, role, lifecycle state, blocker, or projection.",
    });
  }

  return collected;
}

function mappingPotentiallyMatches(
  mapping: AcademyRouteMapping,
  context: NormalizedAcademyResolverContext,
): boolean {
  const routeMatch = mapping.routePattern
    ? routePatternMatches(mapping.routePattern, context.route)
    : false;
  const recordMatch = mapping.recordType
    ? mapping.recordType === context.recordType
    : false;
  const actionMatch = mapping.actionType
    ? normalizeToken(mapping.actionType) === context.actionType
    : false;
  const blockerMatch = mapping.blockerType
    ? normalizeToken(mapping.blockerType) === context.blockerType
    : false;

  const hasPrimarySelector = Boolean(
    mapping.routePattern ||
      mapping.recordType ||
      mapping.actionType ||
      mapping.blockerType,
  );

  if (hasPrimarySelector && !(routeMatch || recordMatch || actionMatch || blockerMatch)) {
    return false;
  }

  if (mapping.projection && mapping.projection !== context.projection) {
    return false;
  }

  return true;
}

function scoreCandidate(args: {
  mapping: AcademyRouteMapping;
  context: NormalizedAcademyResolverContext;
  lesson: AcademyLessonDefinition | null;
  allowRestrictedLessons: boolean;
}): ResolverCandidateScore {
  const { mapping, context, lesson, allowRestrictedLessons } = args;
  const reasons: ResolverScoreReason[] = [];
  const warnings: ResolverWarning[] = [];
  const rejectionReasons: string[] = [];
  let score = 0;

  if (!lesson) {
    warnings.push({
      code: "mapping_references_missing_lesson",
      message: `Mapping ${mapping.mappingId} references a lesson that is not available.`,
      mappingId: mapping.mappingId,
      lessonId: mapping.lessonId,
    });
    rejectionReasons.push("missing_lesson");
  }

  if (mapping.actionType && normalizeToken(mapping.actionType) === context.actionType) {
    score += ACADEMY_RESOLVER_SCORES.actionTypeExact;
    reasons.push({
      reason: "action_type_exact",
      points: ACADEMY_RESOLVER_SCORES.actionTypeExact,
      detail: `Action type matched ${context.actionType}.`,
    });
  }

  if (mapping.recordType && mapping.recordType === context.recordType) {
    score += ACADEMY_RESOLVER_SCORES.recordTypeExact;
    reasons.push({
      reason: "record_type_exact",
      points: ACADEMY_RESOLVER_SCORES.recordTypeExact,
      detail: `Record type matched ${context.recordType}.`,
    });
  }

  if (mapping.routePattern) {
    const routeQuality = routeMatchQuality(mapping.routePattern, context.route);
    if (routeQuality === "exact") {
      score += ACADEMY_RESOLVER_SCORES.routeExact;
      reasons.push({
        reason: "route_exact",
        points: ACADEMY_RESOLVER_SCORES.routeExact,
        detail: `Route exactly matched ${mapping.routePattern}.`,
      });
    } else if (routeQuality === "pattern") {
      const points = Math.max(1, Math.round(ACADEMY_RESOLVER_SCORES.routeExact * 0.75));
      score += points;
      reasons.push({
        reason: "route_pattern",
        points,
        detail: `Route matched pattern ${mapping.routePattern}.`,
      });
    }
  }

  if (mapping.role && mapping.role === context.performingRole) {
    score += ACADEMY_RESOLVER_SCORES.roleExact;
    reasons.push({
      reason: "role_exact",
      points: ACADEMY_RESOLVER_SCORES.roleExact,
      detail: `Role matched ${mapping.role}.`,
    });
  } else if (!mapping.role) {
    const points = 5;
    score += points;
    reasons.push({
      reason: "role_general",
      points,
      detail: "Mapping is role-general.",
    });
  }

  if (
    mapping.lifecycleState &&
    normalizeToken(mapping.lifecycleState) === context.lifecycleState
  ) {
    score += ACADEMY_RESOLVER_SCORES.lifecycleStateExact;
    reasons.push({
      reason: "lifecycle_state_exact",
      points: ACADEMY_RESOLVER_SCORES.lifecycleStateExact,
      detail: `Lifecycle state matched ${context.lifecycleState}.`,
    });
  }

  if (
    mapping.blockerType &&
    normalizeToken(mapping.blockerType) === context.blockerType
  ) {
    score += ACADEMY_RESOLVER_SCORES.blockerTypeExact;
    reasons.push({
      reason: "blocker_type_exact",
      points: ACADEMY_RESOLVER_SCORES.blockerTypeExact,
      detail: `Blocker type matched ${context.blockerType}.`,
    });
  }

  if (mapping.projection && mapping.projection === context.projection) {
    const points = 10;
    score += points;
    reasons.push({
      reason: "projection_exact",
      points,
      detail: `Projection matched ${context.projection}.`,
    });
  }

  const priorityPoints = Number.isFinite(mapping.priority)
    ? Math.max(-100, Math.min(100, mapping.priority))
    : 0;
  score += priorityPoints;
  reasons.push({
    reason: "mapping_priority",
    points: priorityPoints,
    detail: `Mapping priority contributed ${priorityPoints} points.`,
  });

  if (lesson) {
    if (lesson.operationalRoutes.some((pattern) => routePatternMatches(pattern, context.route))) {
      const points = 12;
      score += points;
      reasons.push({
        reason: "lesson_operational_route",
        points,
        detail: "Lesson operational route matched current route.",
      });
    }

    if (context.recordType && lesson.recordTypes.includes(context.recordType)) {
      const points = 12;
      score += points;
      reasons.push({
        reason: "lesson_record_type",
        points,
        detail: "Lesson declares the current record type.",
      });
    }

    if (context.performingRole && lesson.roles.includes(context.performingRole)) {
      const points = 10;
      score += points;
      reasons.push({
        reason: "lesson_role",
        points,
        detail: "Lesson declares the current performing role.",
      });
    }

    if (lesson.publicationState === "active") {
      const points = 8;
      score += points;
      reasons.push({
        reason: "lesson_active",
        points,
        detail: "Lesson is active.",
      });
    }

    const temporal = evaluateLessonTemporalState(lesson, context.now);
    if (temporal.effective) {
      const points = 5;
      score += points;
      reasons.push({
        reason: "lesson_effective",
        points,
        detail: "Lesson is effective at the resolution time.",
      });
    } else {
      score += ACADEMY_RESOLVER_SCORES.supersededPenalty;
      warnings.push({
        code: temporal.warningCode,
        message: temporal.message,
        mappingId: mapping.mappingId,
        lessonId: mapping.lessonId,
      });
      rejectionReasons.push(temporal.rejectionReason);
    }

    if (lesson.publicationState === "superseded") {
      score += ACADEMY_RESOLVER_SCORES.supersededPenalty;
      warnings.push({
        code: "lesson_superseded",
        message: `Lesson ${lesson.lessonId} version ${lesson.version} is superseded.`,
        mappingId: mapping.mappingId,
        lessonId: lesson.lessonId,
      });
      rejectionReasons.push("superseded");
    }

    if (lesson.publicationState === "restricted" && !allowRestrictedLessons) {
      warnings.push({
        code: "lesson_restricted",
        message: `Lesson ${lesson.lessonId} is restricted and restricted lessons are not allowed for this resolution.`,
        mappingId: mapping.mappingId,
        lessonId: lesson.lessonId,
      });
      rejectionReasons.push("restricted");
    }

    if (!isProjectionAllowed(lesson, context.projection, context.performingRole)) {
      score += ACADEMY_RESOLVER_SCORES.unsafeProjectionPenalty;
      warnings.push({
        code: "projection_filtered",
        message: `Lesson ${lesson.lessonId} is not safe for projection ${context.projection}.`,
        mappingId: mapping.mappingId,
        lessonId: lesson.lessonId,
      });
      rejectionReasons.push("unsafe_projection");
    }

    if (
      context.performingRole &&
      lesson.visibility.permittedRoles &&
      lesson.visibility.permittedRoles.length > 0 &&
      !lesson.visibility.permittedRoles.includes(context.performingRole)
    ) {
      warnings.push({
        code: "role_filtered",
        message: `Role ${context.performingRole} is not permitted to view lesson ${lesson.lessonId}.`,
        mappingId: mapping.mappingId,
        lessonId: lesson.lessonId,
      });
      rejectionReasons.push("role_not_permitted");
    }
  }

  return deepFreeze({
    mappingId: mapping.mappingId,
    lessonId: mapping.lessonId,
    lessonVersion: mapping.lessonVersion,
    mappingPriority: mapping.priority,
    score,
    reasons,
    warnings,
    rejected: rejectionReasons.length > 0,
    rejectionReasons,
  });
}

function compareCandidateScores(
  left: ResolverCandidateScore,
  right: ResolverCandidateScore,
): number {
  if (left.score !== right.score) return right.score - left.score;
  if (left.mappingPriority !== right.mappingPriority) {
    return right.mappingPriority - left.mappingPriority;
  }
  return left.mappingId.localeCompare(right.mappingId);
}

function createFallbackCandidate(
  lesson: AcademyLessonDefinition,
): ResolverCandidateScore {
  return deepFreeze({
    mappingId: `fallback:${lesson.lessonId}`,
    lessonId: lesson.lessonId,
    lessonVersion: lesson.version,
    mappingPriority: 0,
    score: 1,
    reasons: [
      {
        reason: "orientation_fallback",
        points: 1,
        detail: "Safe institutional orientation fallback.",
      },
    ],
    warnings: [],
    rejected: false,
    rejectionReasons: [],
  });
}

/* ========================================================================== *
 * Route matching
 * ========================================================================== */

export function routePatternMatches(
  pattern: RoutePattern,
  route: string,
): boolean {
  return routeMatchQuality(pattern, route) !== "none";
}

export function routeMatchQuality(
  pattern: RoutePattern,
  route: string,
): "exact" | "pattern" | "none" {
  const normalizedPattern = normalizeRoutePattern(pattern);
  const normalizedRoute = normalizeRoute(route);

  if (!normalizedPattern || !normalizedRoute) return "none";
  if (normalizedPattern === normalizedRoute) return "exact";

  const regex = routePatternToRegExp(normalizedPattern);
  return regex.test(normalizedRoute) ? "pattern" : "none";
}

function normalizeRoutePattern(pattern: string): string {
  if (typeof pattern !== "string") return "";
  const trimmed = pattern.trim();
  if (!trimmed.startsWith("/")) return "";
  return trimmed.length > 1 && trimmed.endsWith("/")
    ? trimmed.slice(0, -1)
    : trimmed;
}

function routePatternToRegExp(pattern: string): RegExp {
  const segments = pattern.split("/");
  const regexSegments = segments.map((segment) => {
    if (segment === "*") return ".*";
    if (segment === "**") return ".*";
    if (/^\[\.\.\.[^\]]+\]$/.test(segment)) return ".+";
    if (/^\[[^\]]+\]$/.test(segment)) return "[^/]+";
    if (segment.startsWith(":")) return "[^/]+";
    return escapeRegExp(segment).replace(/\\\*/g, "[^/]*");
  });

  return new RegExp(`^${regexSegments.join("/")}$`);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ========================================================================== *
 * Lesson indexing and selection
 * ========================================================================== */

function buildLessonIndex(
  lessons: readonly AcademyLessonDefinition[],
  warnings: ResolverWarning[],
): ReadonlyMap<string, AcademyLessonDefinition> {
  const index = new Map<string, AcademyLessonDefinition>();

  for (const lesson of lessons) {
    const validation = validateAcademyLessonDefinition(lesson);
    if (!validation.ok) {
      warnings.push({
        code: "lesson_contract_invalid",
        message: `Lesson ${lesson.lessonId} version ${lesson.version} failed contract validation and was excluded.`,
        lessonId: lesson.lessonId,
      });
      continue;
    }

    index.set(lessonKey(lesson.lessonId, lesson.version), lesson);

    const current = index.get(lesson.lessonId);
    if (!current || compareVersions(lesson.version, current.version) > 0) {
      index.set(lesson.lessonId, lesson);
    }
  }

  return index;
}

function lessonKey(lessonId: LessonIdentifier, version?: string): string {
  return version ? `${lessonId}@${version}` : lessonId;
}

function findMappedLesson(
  mapping: AcademyRouteMapping,
  lessonByKey: ReadonlyMap<string, AcademyLessonDefinition>,
): AcademyLessonDefinition | null {
  return (
    lessonByKey.get(lessonKey(mapping.lessonId, mapping.lessonVersion)) ??
    lessonByKey.get(mapping.lessonId) ??
    null
  );
}

function findLessonForCandidate(
  candidate: ResolverCandidateScore,
  lessonByKey: ReadonlyMap<string, AcademyLessonDefinition>,
): AcademyLessonDefinition | null {
  return (
    lessonByKey.get(lessonKey(candidate.lessonId, candidate.lessonVersion)) ??
    lessonByKey.get(candidate.lessonId) ??
    null
  );
}

function findLessonById(
  lessonByKey: ReadonlyMap<string, AcademyLessonDefinition>,
  lessonId: LessonIdentifier,
): AcademyLessonDefinition | null {
  return lessonByKey.get(lessonId) ?? null;
}

function compareVersions(left: string, right: string): number {
  const l = left.split(/[.+-]/).map((value) => Number(value) || 0);
  const r = right.split(/[.+-]/).map((value) => Number(value) || 0);
  const length = Math.max(l.length, r.length);

  for (let index = 0; index < length; index += 1) {
    const difference = (l[index] ?? 0) - (r[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return left.localeCompare(right);
}

function evaluateLessonTemporalState(
  lesson: AcademyLessonDefinition,
  now: string,
): {
  effective: boolean;
  warningCode: ResolutionWarningCode;
  message: string;
  rejectionReason: string;
} {
  const nowMs = Date.parse(now);
  const effectiveMs = Date.parse(lesson.effectiveAt);

  if (Number.isFinite(effectiveMs) && effectiveMs > nowMs) {
    return {
      effective: false,
      warningCode: "lesson_not_effective",
      message: `Lesson ${lesson.lessonId} is not yet effective.`,
      rejectionReason: "not_yet_effective",
    };
  }

  if (lesson.expiresAt) {
    const expiresMs = Date.parse(lesson.expiresAt);
    if (Number.isFinite(expiresMs) && expiresMs <= nowMs) {
      return {
        effective: false,
        warningCode: "lesson_expired",
        message: `Lesson ${lesson.lessonId} expired at ${lesson.expiresAt}.`,
        rejectionReason: "expired",
      };
    }
  }

  return {
    effective: true,
    warningCode: "lesson_not_effective",
    message: "Lesson is effective.",
    rejectionReason: "",
  };
}

function isLessonUsable(
  lesson: AcademyLessonDefinition,
  context: NormalizedAcademyResolverContext,
  allowRestricted: boolean,
): boolean {
  if (lesson.publicationState === "superseded") return false;
  if (lesson.publicationState === "withdrawn") return false;
  if (lesson.publicationState === "restricted" && !allowRestricted) return false;
  if (!evaluateLessonTemporalState(lesson, context.now).effective) return false;
  return isProjectionAllowed(lesson, context.projection, context.performingRole);
}

function isProjectionAllowed(
  lesson: AcademyLessonDefinition,
  projection: ProjectionClass,
  role?: InstitutionalRole,
): boolean {
  try {
    projectAcademyLesson(lesson, projection, role);
    return true;
  } catch {
    return false;
  }
}

function assertLessonProjectionSafe(
  lesson: AcademyLessonDefinition,
  projection: ProjectionClass,
  role?: InstitutionalRole,
): void {
  try {
    projectAcademyLesson(lesson, projection, role);
  } catch (error) {
    throw new AcademyResolverError(
      "LESSON_CONTRACT_INVALID",
      "The selected Academy lesson cannot be projected safely for the current context.",
      {
        lessonId: lesson.lessonId,
        projection,
        role,
        cause: error instanceof Error ? error.message : String(error),
      },
    );
  }
}

/* ========================================================================== *
 * Related lessons
 * ========================================================================== */

function resolveRelatedLessons(args: {
  primary: AcademyLessonDefinition;
  lessonByKey: ReadonlyMap<string, AcademyLessonDefinition>;
  projection: ProjectionClass;
  role?: InstitutionalRole;
  max: number;
  warnings: ResolverWarning[];
}): readonly AcademyLessonDefinition[] {
  const { primary, lessonByKey, projection, role, max, warnings } = args;
  const related: AcademyLessonDefinition[] = [];

  for (const relatedId of primary.relatedLessons) {
    if (related.length >= Math.max(0, max)) break;
    const lesson = findLessonById(lessonByKey, relatedId);
    if (!lesson) {
      warnings.push({
        code: "related_lesson_filtered",
        message: `Related lesson ${relatedId} was not available.`,
        lessonId: relatedId,
      });
      continue;
    }

    if (!isProjectionAllowed(lesson, projection, role)) {
      warnings.push({
        code: "related_lesson_filtered",
        message: `Related lesson ${relatedId} was not safe for the current projection or role.`,
        lessonId: relatedId,
      });
      continue;
    }

    related.push(lesson);
  }

  return related;
}

/* ========================================================================== *
 * Return context
 * ========================================================================== */

async function createSignedReturnContext(args: {
  lesson: AcademyLessonDefinition;
  context: NormalizedAcademyResolverContext;
  signer: AcademyReturnContextSigner;
  warnings: ResolverWarning[];
}): Promise<SignedAcademyReturnContext | undefined> {
  const { lesson, context, signer, warnings } = args;
  const policy = lesson.returnContext;

  if (!policy.enabled) return undefined;

  const route = resolveReturnRoute(lesson, context, warnings);
  if (!route) {
    warnings.push({
      code: "return_context_omitted",
      message: "No safe return route was available.",
      lessonId: lesson.lessonId,
    });
    return undefined;
  }

  if (policy.requireRecordId && !context.recordId) {
    warnings.push({
      code: "return_context_omitted",
      message: "Return context requires a record ID, but no record ID was supplied.",
      lessonId: lesson.lessonId,
    });
    return undefined;
  }

  if (policy.requireActionId && !context.actionId) {
    warnings.push({
      code: "return_context_omitted",
      message: "Return context requires an action ID, but no action ID was supplied.",
      lessonId: lesson.lessonId,
    });
    return undefined;
  }

  const issued = new Date(context.now);
  const expires = new Date(
    issued.getTime() + Math.min(policy.ttlSeconds, 86400) * 1000,
  );

  const payload: AcademyReturnContextPayload = deepFreeze({
    version: 1,
    route,
    recordId: context.recordId,
    recordType: context.recordType,
    actionId: context.actionId,
    actionType: context.actionType,
    role: policy.preserveRole ? context.performingRole : undefined,
    lifecycleState: policy.preserveLifecycleState
      ? context.lifecycleState
      : undefined,
    scrollAnchor: policy.preserveScrollAnchor
      ? context.scrollAnchor
      : undefined,
    projection: context.projection,
    issuedAt: issued.toISOString(),
    expiresAt: expires.toISOString(),
    correlationId: context.correlationId,
  });

  try {
    const signature = await signer.sign(payload);
    return deepFreeze({
      payload,
      signature,
      algorithm: signer.algorithm,
    });
  } catch (error) {
    throw new AcademyResolverError(
      "RETURN_CONTEXT_SIGNING_FAILED",
      "Unable to sign Academy return context.",
      { cause: error instanceof Error ? error.message : String(error) },
    );
  }
}

function resolveReturnRoute(
  lesson: AcademyLessonDefinition,
  context: NormalizedAcademyResolverContext,
  warnings: ResolverWarning[],
): string | undefined {
  const policy = lesson.returnContext;
  const requested = context.returnUrl ?? context.route;
  const allowed = policy.allowedRoutePatterns.some((pattern) =>
    routePatternMatches(pattern, requested),
  );

  if (allowed) return requested;

  warnings.push({
    code: "return_context_sanitized",
    message:
      `Requested return route ${requested} was outside the lesson allow-list. The fallback route was used.`,
    lessonId: lesson.lessonId,
  });

  const fallbackAllowed = policy.allowedRoutePatterns.some((pattern) =>
    routePatternMatches(pattern, policy.fallbackRoute),
  );

  return fallbackAllowed ? policy.fallbackRoute : undefined;
}

/* ========================================================================== *
 * Panel, requirements, and Mission Control
 * ========================================================================== */

function buildEmbeddedLearningPanel(args: {
  lesson: AcademyLessonDefinition;
  context: NormalizedAcademyResolverContext;
  returnContext?: SignedAcademyReturnContext;
  warnings: readonly ResolverWarning[];
}): EmbeddedLearningPanelModel {
  const { lesson, context, returnContext, warnings } = args;
  const lessonHref = `/academy/${encodeURIComponent(lesson.division)}/${encodeURIComponent(lesson.slug)}`;

  const firstBasis = lesson.institutionalBasis[0];
  const whyThisMatters =
    firstBasis?.description ??
    lesson.summary ??
    "This lesson explains the institutional basis, completion standard, and authority boundary for the current action.";

  const hasExamples = lesson.examples.length > 0;
  const canPractice = lesson.simulation.available;
  const canReturn = Boolean(returnContext);

  const actions: EmbeddedLearningPanelAction[] = [
    {
      id: "learn_this_section",
      label: "Learn this section",
      enabled: true,
      href: lessonHref,
    },
    {
      id: "why_this_matters",
      label: "Why this matters",
      enabled: true,
      href: `${lessonHref}#why-this-matters`,
    },
    {
      id: "step_by_step_guide",
      label: "Step-by-step guide",
      enabled: lesson.steps.length > 0,
      href: `${lessonHref}#steps`,
    },
    {
      id: "view_completed_example",
      label: "View completed example",
      enabled: hasExamples,
      href: hasExamples ? `${lessonHref}#examples` : undefined,
      reasonDisabled: hasExamples
        ? undefined
        : "No projection-safe completed example is available.",
    },
    {
      id: "practice_safely",
      label: "Practice safely",
      enabled: canPractice,
      href: canPractice ? `${lessonHref}#simulation` : undefined,
      reasonDisabled: canPractice
        ? undefined
        : "Simulation is not available for this lesson.",
    },
    {
      id: "check_completion_standard",
      label: "Check completion standard",
      enabled: lesson.completionStandard.length > 0,
      href: `${lessonHref}#completion-standard`,
    },
    {
      id: "return_to_live_record",
      label: "Return to live record",
      enabled: canReturn,
      href: returnContext ? buildReturnHref(returnContext) : undefined,
      reasonDisabled: canReturn
        ? undefined
        : "A signed return context was not available.",
    },
  ];

  return deepFreeze({
    heading: "TA-14 ACADEMY — LEARN THIS PAGE",
    currentFunction:
      lesson.operationalFunctions[0] ?? lesson.title,
    recordType: context.recordType,
    recordId: context.recordId,
    role: context.performingRole,
    lifecycleState: context.lifecycleState,
    blockerType: context.blockerType,
    lessonId: lesson.lessonId,
    lessonTitle: lesson.title,
    lessonVersion: lesson.version,
    lessonSummary: lesson.summary,
    whyThisMatters,
    actions,
    authorityBoundary: lesson.authorityBoundary,
    simulationMarker: lesson.simulation.available
      ? lesson.simulation.persistentMarker
      : undefined,
    warnings: warnings.map((warning) => warning.message),
  });
}

function buildReturnHref(
  signed: SignedAcademyReturnContext,
): string {
  const token = encodeURIComponent(
    base64UrlEncode(
      JSON.stringify({
        payload: signed.payload,
        signature: signed.signature,
        algorithm: signed.algorithm,
      }),
    ),
  );
  return `${signed.payload.route}${signed.payload.route.includes("?") ? "&" : "?"}academyReturn=${token}${signed.payload.scrollAnchor ? `#${signed.payload.scrollAnchor}` : ""}`;
}

function base64UrlEncode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let output = "";

  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index] ?? 0;
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    const block =
      (first << 16) |
      ((second ?? 0) << 8) |
      (third ?? 0);

    output += alphabet[(block >> 18) & 63];
    output += alphabet[(block >> 12) & 63];
    output += second === undefined ? "=" : alphabet[(block >> 6) & 63];
    output += third === undefined ? "=" : alphabet[block & 63];
  }

  return output
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function resolveRequirements(
  lesson: AcademyLessonDefinition,
): AcademyResolvedRequirements {
  const blockingPrerequisites: ResolvedPrerequisite[] = lesson.prerequisites
    .filter((prerequisite) =>
      prerequisite.enforcement === "blocking" ||
      prerequisite.enforcement === "required",
    )
    .map((prerequisite) => ({
      prerequisiteId: prerequisite.prerequisiteId,
      title: prerequisite.title,
      description: prerequisite.description,
      enforcement: prerequisite.enforcement,
      satisfied: null,
      blocking: prerequisite.enforcement === "blocking",
      referencedObjectId: prerequisite.referencedObjectId,
      requiredState: prerequisite.requiredState,
    }));

  return deepFreeze({
    simulationAvailable: lesson.simulation.available,
    simulationRequired: lesson.simulation.required,
    assessmentRequired: lesson.assessment.required,
    credentialIds: lesson.requiredCredentialIds,
    authorityGrantTypes: lesson.requiredAuthorityGrantTypes,
    authorityGrantRequiredForLiveWork:
      lesson.accessPolicy.authorityGrantRequired,
    blockingPrerequisites,
    completionRuleIds: lesson.completionStandard.map((rule) => rule.ruleId),
    continuityTriggerIds: lesson.continuityTriggers.map((trigger) => trigger.triggerId),
    authorityBoundary: lesson.authorityBoundary,
    nonSubstitutionRule: TA14_ACADEMY_NON_SUBSTITUTION_RULE,
  });
}

function buildMissionControlSignal(args: {
  lesson: AcademyLessonDefinition;
  context: NormalizedAcademyResolverContext;
  contentGapAction?: AcademyContentGapAction;
}): MissionControlLearningSignal {
  const { lesson, context, contentGapAction } = args;

  if (contentGapAction) {
    return deepFreeze({
      createsAction: true,
      actionType: "academy_content_gap",
      priority: "high",
      title: "Academy guidance required",
      description:
        "No exact, current Academy lesson exists for this institutional action.",
      blockingEffect:
        "The institution should not silently require governance work without explaining its meaning, evidence standard, completion requirement, and authority boundary.",
      resolution:
        "Create and activate a canonical lesson mapping for the current action.",
      linkedRecordId: context.recordId,
      linkedActionId: context.actionId,
    });
  }

  const blockingPrerequisites = lesson.prerequisites.filter(
    (prerequisite) => prerequisite.enforcement === "blocking",
  );
  const requiredLearning =
    blockingPrerequisites.length > 0 ||
    lesson.assessment.required ||
    lesson.simulation.required;

  if (!requiredLearning) {
    return deepFreeze({
      createsAction: false,
      priority: "none",
      linkedLessonId: lesson.lessonId,
      linkedRecordId: context.recordId,
      linkedActionId: context.actionId,
    });
  }

  const priority = context.blockerType
    ? blockerPriority(context.blockerType)
    : lesson.accessPolicy.authorityGrantRequired
      ? "high"
      : "normal";

  return deepFreeze({
    createsAction: true,
    actionType: "complete_required_learning",
    priority,
    title: `Complete required learning: ${lesson.title}`,
    description:
      `Current work requires the active ${lesson.title} lesson and any associated practice or assessment requirements.`,
    blockingEffect:
      context.blockerType
        ? `The current ${context.blockerType} blocker remains unresolved.`
        : "The related live action may remain blocked until the completion standard is satisfied.",
    resolution:
      lesson.assessment.required
        ? "Complete the lesson, pass the attributable assessment, then request any separate authority check required for live work."
        : "Complete the lesson requirements and return to the linked live record.",
    linkedLessonId: lesson.lessonId,
    linkedRecordId: context.recordId,
    linkedActionId: context.actionId,
  });
}

function blockerPriority(
  blockerType: string,
): "low" | "normal" | "high" | "critical" {
  const normalized = normalizeToken(blockerType) ?? "";
  if (/critical|revoked|security|safety|legal|authority_missing/.test(normalized)) {
    return "critical";
  }
  if (/blocked|hold|expired|conflict|assessment|credential/.test(normalized)) {
    return "high";
  }
  if (/recommended|advisory/.test(normalized)) return "low";
  return "normal";
}

/* ========================================================================== *
 * Content gaps
 * ========================================================================== */

function createContentGap(
  context: NormalizedAcademyResolverContext,
): AcademyContentGapAction {
  return deepFreeze({
    actionType: "academy_content_gap",
    route: context.route,
    recordType: context.recordType,
    actionContext: context.actionType ?? context.blockerType,
    role: context.performingRole,
    reason:
      "No exact, current, role-appropriate, projection-safe Academy lesson mapping exists for this institutional context.",
  });
}

/* ========================================================================== *
 * In-memory repositories
 * ========================================================================== */

export class InMemoryAcademyLessonRepository
  implements AcademyLessonRepository
{
  private readonly lessons: readonly AcademyLessonDefinition[];

  constructor(lessons: readonly AcademyLessonDefinition[]) {
    this.lessons = deepFreeze([...lessons]);
  }

  async getLessonById(
    lessonId: LessonIdentifier,
    version?: string,
  ): Promise<AcademyLessonDefinition | null> {
    const exact = this.lessons.find(
      (lesson) =>
        lesson.lessonId === lessonId &&
        (version === undefined || lesson.version === version),
    );
    if (exact) return exact;

    const candidates = this.lessons
      .filter((lesson) => lesson.lessonId === lessonId)
      .sort((left, right) => compareVersions(right.version, left.version));
    return candidates[0] ?? null;
  }

  async getActiveLessonById(
    lessonId: LessonIdentifier,
    at = new Date().toISOString(),
  ): Promise<AcademyLessonDefinition | null> {
    const candidates = this.lessons
      .filter((lesson) => lesson.lessonId === lessonId)
      .filter((lesson) => lesson.publicationState === "active")
      .filter((lesson) => evaluateLessonTemporalState(lesson, at).effective)
      .sort((left, right) => compareVersions(right.version, left.version));
    return candidates[0] ?? null;
  }

  async listLessons(): Promise<readonly AcademyLessonDefinition[]> {
    return this.lessons;
  }

  async listActiveLessons(
    at = new Date().toISOString(),
  ): Promise<readonly AcademyLessonDefinition[]> {
    return this.lessons.filter(
      (lesson) =>
        lesson.publicationState === "active" &&
        evaluateLessonTemporalState(lesson, at).effective,
    );
  }
}

export class InMemoryAcademyRouteMappingRepository
  implements AcademyRouteMappingRepository
{
  private readonly mappings: readonly AcademyRouteMapping[];

  constructor(mappings: readonly AcademyRouteMapping[]) {
    this.mappings = deepFreeze([...mappings]);
  }

  async listMappings(): Promise<readonly AcademyRouteMapping[]> {
    return this.mappings;
  }

  async listActiveMappings(
    at = new Date().toISOString(),
  ): Promise<readonly AcademyRouteMapping[]> {
    const now = Date.parse(at);
    return this.mappings.filter((mapping) => {
      if (!mapping.active) return false;
      if (mapping.effectiveAt && Date.parse(mapping.effectiveAt) > now) {
        return false;
      }
      if (mapping.expiresAt && Date.parse(mapping.expiresAt) <= now) {
        return false;
      }
      return true;
    });
  }
}

export class InMemoryAcademyResolutionAuditSink
  implements AcademyResolutionAuditSink
{
  private readonly events: AcademyResolutionAuditEvent[] = [];

  recordResolution(event: AcademyResolutionAuditEvent): void {
    this.events.push(deepFreeze(event));
  }

  listEvents(): readonly AcademyResolutionAuditEvent[] {
    return deepFreeze([...this.events]);
  }
}

/* ========================================================================== *
 * Canonical initial mapping set
 * ========================================================================== */

export const CANONICAL_INITIAL_ACADEMY_ROUTE_MAPPINGS:
  readonly AcademyRouteMapping[] = deepFreeze([
    {
      mappingId: "TA14-ACD-MAP-000003-A",
      lessonId: GOVERNANCE_ENTITY_REGISTRATION_LESSON_ID,
      lessonVersion: "3.0",
      routePattern: "/workspace/entities/new",
      recordType: "governance_entity",
      actionType: "governance_entity_registration",
      role: "entity_steward",
      lifecycleState: "draft",
      projection: "authenticated",
      priority: 100,
      active: true,
      effectiveAt: "2026-08-04T00:00:00Z",
    },
    {
      mappingId: "TA14-ACD-MAP-000003-B",
      lessonId: GOVERNANCE_ENTITY_REGISTRATION_LESSON_ID,
      lessonVersion: "3.0",
      routePattern: "/workspace/ai-governance/entities/new",
      recordType: "governance_registration",
      actionType: "governance_entity_registration",
      role: "entity_steward",
      projection: "authenticated",
      priority: 95,
      active: true,
      effectiveAt: "2026-08-04T00:00:00Z",
    },
    {
      mappingId: "TA14-ACD-MAP-000003-C",
      lessonId: GOVERNANCE_ENTITY_REGISTRATION_LESSON_ID,
      routePattern: "/workspace/entities/*",
      recordType: "governance_registration",
      blockerType: "registration_incomplete",
      projection: "authenticated",
      priority: 90,
      active: true,
      effectiveAt: "2026-08-04T00:00:00Z",
    },
    {
      mappingId: "TA14-ACD-MAP-000003-PUBLIC",
      lessonId: GOVERNANCE_ENTITY_REGISTRATION_LESSON_ID,
      routePattern: "/registry/entities/*",
      recordType: "governance_entity",
      projection: "public",
      priority: 40,
      active: true,
      effectiveAt: "2026-08-04T00:00:00Z",
    },
  ]);

/* ========================================================================== *
 * Canonical resolver factory
 * ========================================================================== */

export function createCanonicalAcademyContextResolver(args: {
  readonly additionalLessons?: readonly AcademyLessonDefinition[];
  readonly additionalMappings?: readonly AcademyRouteMapping[];
  readonly signer?: AcademyReturnContextSigner;
  readonly audit?: AcademyResolutionAuditSink;
  readonly clock?: AcademyClock;
} = {}): AcademyContextResolver {
  const lessons = [
    governanceEntityRegistrationLessonExample,
    ...(args.additionalLessons ?? []),
  ];
  const mappings = [
    ...CANONICAL_INITIAL_ACADEMY_ROUTE_MAPPINGS,
    ...(args.additionalMappings ?? []),
  ];

  return new AcademyContextResolver({
    lessons: new InMemoryAcademyLessonRepository(lessons),
    mappings: new InMemoryAcademyRouteMappingRepository(mappings),
    signer: args.signer,
    audit: args.audit,
    clock: args.clock,
  });
}

/* ========================================================================== *
 * Deterministic test signer
 * ========================================================================== */

export class DeterministicTestReturnContextSigner
  implements AcademyReturnContextSigner
{
  readonly algorithm = "HMAC-SHA256" as const;

  sign(payload: AcademyReturnContextPayload): string {
    const canonical = stableStringify(payload);
    return `test-signature:${simpleDeterministicHash(canonical)}`;
  }
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

function simpleDeterministicHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/* ========================================================================== *
 * Self-check
 * ========================================================================== */

export interface AcademyContextResolverSelfCheck {
  readonly ok: boolean;
  readonly resolverVersion: typeof TA14_ACADEMY_RESOLVER_VERSION;
  readonly selectedLessonId?: LessonIdentifier;
  readonly selectedLessonVersion?: string;
  readonly selectedMappingId?: string;
  readonly score?: number;
  readonly panelHeading?: string;
  readonly returnContextPresent: boolean;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
}

export async function runAcademyContextResolverSelfCheck():
  Promise<AcademyContextResolverSelfCheck> {
  const audit = new InMemoryAcademyResolutionAuditSink();
  const resolver = createCanonicalAcademyContextResolver({
    signer: new DeterministicTestReturnContextSigner(),
    audit,
    clock: {
      now: () => new Date("2026-08-04T13:00:00Z"),
    },
  });

  try {
    const result = await resolver.resolve({
      route: "/workspace/entities/new",
      recordType: "governance_entity",
      recordId: "TA14-GE-DRAFT-000001",
      actionType: "governance_entity_registration",
      actionId: "TA14-ACT-REG-000001",
      performingRole: "entity_steward",
      lifecycleState: "draft",
      blockerType: "registration_incomplete",
      projection: "authenticated",
      institutionalSubjectId: "TA14-SUBJECT-TEST",
      organizationId: "TA14-ORG-TEST",
      returnUrl: "/workspace/entities/new",
      scrollAnchor: "entity-identity",
      now: "2026-08-04T13:00:00Z",
    });

    const errors: string[] = [];
    if (result.lesson.lessonId !== GOVERNANCE_ENTITY_REGISTRATION_LESSON_ID) {
      errors.push("Resolver did not select the governance registration lesson.");
    }
    if (!result.returnContext) {
      errors.push("Resolver did not produce signed return context.");
    }
    if (result.panel.heading !== "TA-14 ACADEMY — LEARN THIS PAGE") {
      errors.push("Embedded panel heading is incorrect.");
    }
    if (audit.listEvents().length !== 1) {
      errors.push("Resolver did not emit exactly one audit event.");
    }
    if (result.requirements.authorityBoundary.length === 0) {
      errors.push("Authority boundary is missing.");
    }

    return deepFreeze({
      ok: errors.length === 0,
      resolverVersion: TA14_ACADEMY_RESOLVER_VERSION,
      selectedLessonId: result.lesson.lessonId,
      selectedLessonVersion: result.lesson.version,
      selectedMappingId: result.trace.selectedMappingId,
      score: result.score,
      panelHeading: result.panel.heading,
      returnContextPresent: Boolean(result.returnContext),
      warnings: result.warnings,
      errors,
    });
  } catch (error) {
    return deepFreeze({
      ok: false,
      resolverVersion: TA14_ACADEMY_RESOLVER_VERSION,
      returnContextPresent: false,
      warnings: [],
      errors: [error instanceof Error ? error.message : String(error)],
    });
  }
}

/* ========================================================================== *
 * Utility validation
 * ========================================================================== */

export function validateRouteMappings(
  mappings: readonly AcademyRouteMapping[],
): readonly ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();

  for (const [index, mapping] of mappings.entries()) {
    const path = `mappings[${index}]`;

    if (!mapping.mappingId?.trim()) {
      issues.push({
        path: `${path}.mappingId`,
        code: "required",
        message: "Mapping ID is required.",
        severity: "error",
      });
    } else if (ids.has(mapping.mappingId)) {
      issues.push({
        path: `${path}.mappingId`,
        code: "duplicate_value",
        message: `Duplicate mapping ID ${mapping.mappingId}.`,
        severity: "error",
      });
    } else {
      ids.add(mapping.mappingId);
    }

    if (!mapping.lessonId?.trim()) {
      issues.push({
        path: `${path}.lessonId`,
        code: "required",
        message: "Lesson ID is required.",
        severity: "error",
      });
    }

    const hasSelector = Boolean(
      mapping.routePattern ||
        mapping.recordType ||
        mapping.actionType ||
        mapping.role ||
        mapping.lifecycleState ||
        mapping.blockerType,
    );

    if (!hasSelector) {
      issues.push({
        path,
        code: "empty_value",
        message:
          "Mapping must define at least one route, record, action, role, lifecycle, or blocker selector.",
        severity: "error",
      });
    }

    if (!Number.isFinite(mapping.priority)) {
      issues.push({
        path: `${path}.priority`,
        code: "invalid_value",
        message: "Mapping priority must be a finite number.",
        severity: "error",
        received: mapping.priority,
      });
    }
  }

  return deepFreeze(issues);
}

/* ========================================================================== *
 * Runtime clock
 * ========================================================================== */

const systemClock: AcademyClock = {
  now: () => new Date(),
};

/* ========================================================================== *
 * Default export
 * ========================================================================== */

const academyContextResolver = {
  version: TA14_ACADEMY_RESOLVER_VERSION,
  authorityBoundary: TA14_ACADEMY_RESOLVER_BOUNDARY,
  AcademyContextResolver,
  createCanonicalAcademyContextResolver,
  normalizeResolverContext,
  routePatternMatches,
  routeMatchQuality,
  validateRouteMappings,
  runAcademyContextResolverSelfCheck,
  canonicalMappings: CANONICAL_INITIAL_ACADEMY_ROUTE_MAPPINGS,
};

export default academyContextResolver;
