/**
 * TA-14 Institutional Record Resolver
 *
 * Repository path:
 *   apps/web/lib/institution/record-resolver.ts
 *
 * Institutional purpose:
 *   Provide one deterministic, typed resolution boundary for every institutional
 *   record family presented through Mission Control, Registry, governance entity
 *   pages, reviews, demonstrations, routes, artifacts, scopes, credentials,
 *   actions, outcomes, challenges, corrections, and public projections.
 *
 * Governing principles:
 *   - No page-local institutional truth.
 *   - No silent status collapse.
 *   - No public projection without an explicit visibility decision.
 *   - No correction that erases prior institutional state.
 *   - No resolved record without identity, version, lifecycle, stewardship,
 *     limitations, and continuity metadata.
 *
 * This module is dependency-light by design. It defines the shared contracts and
 * orchestration logic while allowing existing record systems to be connected by
 * adapters incrementally. Persistence remains the responsibility of adapters.
 */

export const TA14_RECORD_RESOLVER_VERSION = "1.0.0" as const;
export const TA14_RECORD_CONTRACT_VERSION = "1.0" as const;

// -----------------------------------------------------------------------------
// Canonical primitives
// -----------------------------------------------------------------------------

export type ISODateTime = string;
export type InstitutionalId = string;
export type SubjectId = string;
export type RecordId = string;
export type RecordVersionId = string;
export type RelationshipId = string;
export type EventId = string;
export type AuthorityGrantId = string;
export type VisibilityPolicyId = string;

export type InstitutionalDivision =
  | "AI_GOVERNANCE_EXCHANGE"
  | "TA14_ACADEMY"
  | "ENVIRONMENTAL_INTEGRITY_GOVERNANCE"
  | "PUBLIC_RESEARCH_AND_PUBLIC_RECORDS"
  | "STANDARDS"
  | "PROPOSED_WORLD_LAW"
  | "INSTITUTIONAL_CORE";

export type InstitutionalRecordType =
  | "GOVERNANCE_ENTITY"
  | "GOVERNANCE_REGISTRATION"
  | "DECLARED_CLAIM"
  | "EVIDENCE_PACKAGE"
  | "EVIDENCE_ITEM"
  | "BOUNDED_REVIEW"
  | "REVIEW_FINDING"
  | "GOVERNED_DEMONSTRATION"
  | "GOVERNANCE_ROUTE"
  | "EXECUTION_DETERMINATION"
  | "EXECUTION_EVENT"
  | "EXECUTION_ARTIFACT"
  | "OUTCOME_RECORD"
  | "REGISTRY_RECORD"
  | "CHALLENGE"
  | "CORRECTION"
  | "REVALIDATION"
  | "ACADEMY_CREDENTIAL"
  | "AUTHORITY_GRANT"
  | "PARTNER_APPLICATION"
  | "PARTNER_ASSIGNMENT"
  | "COMMERCIAL_SCOPE"
  | "PAYMENT_RECORD"
  | "ACTION_REQUIREMENT"
  | "PUBLICATION"
  | "STANDARD"
  | "LAW_RECORD"
  | "RESEARCH_RECORD"
  | "ENVIRONMENTAL_RECORD"
  | "AIR_RECORD"
  | "PAIR_RECORD"
  | "BUILDING_RECORD"
  | "HVAC_RECORD"
  | "CUSTOM";

export type RecordLifecycleState =
  | "draft"
  | "configured"
  | "submitted"
  | "under_review"
  | "returned"
  | "accepted"
  | "published"
  | "superseded"
  | "withdrawn"
  | "archived";

export type EvidenceState =
  | "declared"
  | "received"
  | "admitted"
  | "excluded"
  | "disputed"
  | "stale"
  | "inaccessible";

export type FindingState =
  | "supported"
  | "partially_supported"
  | "unsupported"
  | "outside_scope"
  | "unresolved";

export type ExecutionDetermination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

export type OutcomeState =
  | "expected"
  | "observed"
  | "verified"
  | "contradicted"
  | "unresolved";

export type CredentialState =
  | "pending"
  | "active"
  | "restricted"
  | "expired"
  | "suspended"
  | "revoked";

export type CommercialState =
  | "configured"
  | "scoped"
  | "accepted"
  | "ordered"
  | "paid"
  | "disputed"
  | "refunded"
  | "complete";

export type ActionState =
  | "open"
  | "in_progress"
  | "blocked"
  | "satisfied"
  | "withdrawn"
  | "expired";

export type VisibilityBoundary =
  | "public"
  | "controlled"
  | "confidential"
  | "mixed"
  | "embargoed";

export type ProjectionAudience =
  | "PUBLIC"
  | "AUTHENTICATED"
  | "OWNER"
  | "ASSIGNED_REVIEWER"
  | "INSTITUTIONAL_ADMIN"
  | "SERVICE";

export type RelationshipType =
  | "owns"
  | "declares"
  | "supported_by"
  | "reviewed_in"
  | "demonstrated_by"
  | "governed_by"
  | "determined_by"
  | "executed_through"
  | "produced"
  | "registered_as"
  | "verified_by"
  | "challenged_by"
  | "corrected_by"
  | "supersedes"
  | "superseded_by"
  | "revalidates"
  | "requires"
  | "authorized_by"
  | "credentialed_by"
  | "scoped_by"
  | "paid_by"
  | "assigned_to"
  | "published_as"
  | "derived_from"
  | "references"
  | "applies_to"
  | "related_to";

export type RelationshipDirection = "OUTBOUND" | "INBOUND";

export type ResolutionStatus =
  | "RESOLVED"
  | "NOT_FOUND"
  | "NOT_AUTHORIZED"
  | "AMBIGUOUS"
  | "PARTIAL"
  | "STALE"
  | "ERROR";

export type ResolverSeverity = "info" | "warning" | "error";

export interface ResolverIssue {
  code: string;
  severity: ResolverSeverity;
  message: string;
  recordId?: string;
  adapterId?: string;
  field?: string;
  recoverable: boolean;
}

// -----------------------------------------------------------------------------
// Subject, authority, visibility, integrity
// -----------------------------------------------------------------------------

export type InstitutionalSubjectType =
  | "person"
  | "organization"
  | "governance_entity"
  | "system"
  | "facility"
  | "service";

export interface InstitutionalSubjectSummary {
  subjectId: SubjectId;
  subjectType: InstitutionalSubjectType;
  displayName: string;
  organizationName?: string;
  publicReference?: string;
  active: boolean;
}

export interface AuthorityContext {
  actorSubjectId?: SubjectId;
  audience: ProjectionAudience;
  organizationIds: string[];
  roleCodes: string[];
  authorityGrantIds: AuthorityGrantId[];
  credentialIds: InstitutionalId[];
  assignedRecordIds: RecordId[];
  conflictRecordIds: RecordId[];
  serviceRole: boolean;
  requestedAt: ISODateTime;
}

export interface VisibilityPolicySummary {
  policyId?: VisibilityPolicyId;
  boundary: VisibilityBoundary;
  publicSummaryAllowed: boolean;
  metadataAllowed: boolean;
  relationshipMetadataAllowed: boolean;
  confidentialEvidenceReferenced: boolean;
  embargoUntil?: ISODateTime;
  redactedFields: string[];
  reason?: string;
}

export interface IntegrityEnvelope {
  algorithm?: string;
  canonicalHash?: string;
  contentHash?: string;
  signatureId?: string;
  signedBy?: SubjectId;
  signedAt?: ISODateTime;
  timestampAuthority?: string;
  timestampReference?: string;
  storageReference?: string;
  verifiedAt?: ISODateTime;
  verificationState?: "unverified" | "verified" | "failed" | "not_applicable";
}

// -----------------------------------------------------------------------------
// Institutional record contracts
// -----------------------------------------------------------------------------

export interface InstitutionalRecordIdentity {
  recordId: RecordId;
  institutionalId: InstitutionalId;
  recordType: InstitutionalRecordType;
  division: InstitutionalDivision;
  title: string;
  subtitle?: string;
  stewardSubjectId: SubjectId;
  ownerSubjectId?: SubjectId;
  issuerSubjectId?: SubjectId;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InstitutionalRecordVersion {
  versionId: RecordVersionId;
  sequence: number;
  label: string;
  createdAt: ISODateTime;
  createdBy: SubjectId;
  priorVersionId?: RecordVersionId;
  changeKind:
    | "original"
    | "amendment"
    | "correction"
    | "supersession"
    | "withdrawal"
    | "migration";
  reason: string;
  contentHash?: string;
  current: boolean;
}

export interface InstitutionalStateDimensions {
  lifecycle: RecordLifecycleState;
  evidence?: EvidenceState;
  finding?: FindingState;
  determination?: ExecutionDetermination;
  outcome?: OutcomeState;
  credential?: CredentialState;
  commercial?: CommercialState;
  action?: ActionState;
}

export interface ClaimBoundary {
  supportedClaims: string[];
  partiallySupportedClaims: string[];
  unsupportedClaims: string[];
  outsideScopeClaims: string[];
  nonClaims: string[];
  limitations: string[];
  expiredOrWithdrawnClaims: string[];
}

export interface InstitutionalRecordSummary {
  identity: InstitutionalRecordIdentity;
  version: InstitutionalRecordVersion;
  states: InstitutionalStateDimensions;
  visibility: VisibilityPolicySummary;
  steward?: InstitutionalSubjectSummary;
  owner?: InstitutionalSubjectSummary;
  authorityGrantIds: AuthorityGrantId[];
  claimBoundary: ClaimBoundary;
  integrity?: IntegrityEnvelope;
  tags: string[];
  jurisdictions: string[];
  frameworks: string[];
  effectiveAt?: ISODateTime;
  expiresAt?: ISODateTime;
}

export interface InstitutionalRecordDetail extends InstitutionalRecordSummary {
  data: Record<string, unknown>;
  publicData?: Record<string, unknown>;
  confidentialFieldNames: string[];
  searchableText: string;
  sourceSystem: string;
  sourceReference?: string;
}

export interface InstitutionalRelationship {
  relationshipId: RelationshipId;
  relationshipType: RelationshipType;
  sourceRecordId: RecordId;
  targetRecordId: RecordId;
  createdAt: ISODateTime;
  createdBy?: SubjectId;
  effectiveAt?: ISODateTime;
  expiresAt?: ISODateTime;
  authorityReference?: string;
  scope?: string;
  public: boolean;
  metadata?: Record<string, unknown>;
}

export interface InstitutionalEvent {
  eventId: EventId;
  eventType: string;
  recordId: RecordId;
  actorSubjectId?: SubjectId;
  occurredAt: ISODateTime;
  priorState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  authorityReference?: string;
  reason?: string;
  idempotencyKey?: string;
  integrity?: IntegrityEnvelope;
  public: boolean;
}

export interface InstitutionalActionSummary {
  actionId: InstitutionalId;
  actionType: string;
  recordId: RecordId;
  basis: string;
  responsibleSubjectId: SubjectId;
  blockingEffect: string;
  completionCondition: string;
  status: ActionState;
  priority: number;
  dueAt?: ISODateTime;
  visibility: VisibilityBoundary;
  createdAt: ISODateTime;
  satisfiedAt?: ISODateTime;
}

export interface ResolvedRelationship {
  relationship: InstitutionalRelationship;
  direction: RelationshipDirection;
  relatedRecord: InstitutionalRecordSummary;
}

export interface InstitutionalContinuity {
  currentVersionId: RecordVersionId;
  versions: InstitutionalRecordVersion[];
  predecessorRecordIds: RecordId[];
  successorRecordIds: RecordId[];
  challengedByRecordIds: RecordId[];
  correctedByRecordIds: RecordId[];
  revalidationRecordIds: RecordId[];
  materialChangePending: boolean;
  continuityComplete: boolean;
}

export interface InstitutionalResolutionMeta {
  resolverVersion: typeof TA14_RECORD_RESOLVER_VERSION;
  contractVersion: typeof TA14_RECORD_CONTRACT_VERSION;
  resolvedAt: ISODateTime;
  requestId: string;
  sourceAdapters: string[];
  cached: boolean;
  projectionAudience: ProjectionAudience;
  partial: boolean;
  stale: boolean;
}

export interface ResolvedInstitutionalRecord {
  status: ResolutionStatus;
  record?: InstitutionalRecordDetail;
  relationships: ResolvedRelationship[];
  events: InstitutionalEvent[];
  actions: InstitutionalActionSummary[];
  continuity?: InstitutionalContinuity;
  issues: ResolverIssue[];
  meta: InstitutionalResolutionMeta;
}

// -----------------------------------------------------------------------------
// Query and projection contracts
// -----------------------------------------------------------------------------

export interface ResolveRecordQuery {
  recordId?: RecordId;
  institutionalId?: InstitutionalId;
  recordType?: InstitutionalRecordType;
  includeRelationships?: boolean;
  relationshipDepth?: 0 | 1 | 2;
  includeEvents?: boolean;
  includeActions?: boolean;
  includeVersions?: boolean;
  includeConfidentialMetadata?: boolean;
  allowStale?: boolean;
  asOf?: ISODateTime;
}

export interface SearchRecordsQuery {
  text?: string;
  institutionalIds?: InstitutionalId[];
  recordTypes?: InstitutionalRecordType[];
  divisions?: InstitutionalDivision[];
  lifecycleStates?: RecordLifecycleState[];
  determinationStates?: ExecutionDetermination[];
  visibilityBoundaries?: VisibilityBoundary[];
  ownerSubjectIds?: SubjectId[];
  stewardSubjectIds?: SubjectId[];
  tags?: string[];
  jurisdictions?: string[];
  frameworks?: string[];
  createdFrom?: ISODateTime;
  createdTo?: ISODateTime;
  limit?: number;
  cursor?: string;
}

export interface SearchRecordsResult {
  records: InstitutionalRecordSummary[];
  nextCursor?: string;
  total?: number;
  issues: ResolverIssue[];
  meta: InstitutionalResolutionMeta;
}

export interface RecordProjection {
  audience: ProjectionAudience;
  record: InstitutionalRecordDetail;
  removedFields: string[];
  transformedFields: string[];
  authorityBasis: string[];
}

// -----------------------------------------------------------------------------
// Adapter contracts
// -----------------------------------------------------------------------------

export interface AdapterResolutionContext {
  authority: AuthorityContext;
  query: ResolveRecordQuery;
  requestId: string;
  now: ISODateTime;
}

export interface AdapterRecordResult {
  record?: InstitutionalRecordDetail;
  issues?: ResolverIssue[];
  stale?: boolean;
}

export interface InstitutionalRecordAdapter {
  readonly adapterId: string;
  readonly priority: number;
  readonly supportedRecordTypes: readonly InstitutionalRecordType[];

  canResolve(query: ResolveRecordQuery): boolean | Promise<boolean>;
  resolveRecord(
    query: ResolveRecordQuery,
    context: AdapterResolutionContext,
  ): Promise<AdapterRecordResult>;

  resolveByRecordId?(
    recordId: RecordId,
    context: AdapterResolutionContext,
  ): Promise<AdapterRecordResult>;

  listRelationships?(
    record: InstitutionalRecordDetail,
    context: AdapterResolutionContext,
  ): Promise<InstitutionalRelationship[]>;

  listEvents?(
    record: InstitutionalRecordDetail,
    context: AdapterResolutionContext,
  ): Promise<InstitutionalEvent[]>;

  listActions?(
    record: InstitutionalRecordDetail,
    context: AdapterResolutionContext,
  ): Promise<InstitutionalActionSummary[]>;

  listVersions?(
    record: InstitutionalRecordDetail,
    context: AdapterResolutionContext,
  ): Promise<InstitutionalRecordVersion[]>;

  searchRecords?(
    query: SearchRecordsQuery,
    authority: AuthorityContext,
    requestId: string,
  ): Promise<InstitutionalRecordSummary[]>;
}

export interface VisibilityPolicyEvaluator {
  evaluate(
    record: InstitutionalRecordDetail,
    authority: AuthorityContext,
  ): Promise<RecordProjection> | RecordProjection;
}

export interface AuthorityEvaluator {
  canResolveRecord(
    record: InstitutionalRecordDetail,
    authority: AuthorityContext,
  ): Promise<AuthorityDecision> | AuthorityDecision;

  canViewRelationship(
    relationship: InstitutionalRelationship,
    source: InstitutionalRecordDetail,
    target: InstitutionalRecordSummary,
    authority: AuthorityContext,
  ): Promise<AuthorityDecision> | AuthorityDecision;

  canViewEvent(
    event: InstitutionalEvent,
    record: InstitutionalRecordDetail,
    authority: AuthorityContext,
  ): Promise<AuthorityDecision> | AuthorityDecision;
}

export interface AuthorityDecision {
  allowed: boolean;
  basis: string[];
  reason?: string;
  redact?: boolean;
}

export interface ResolverLogger {
  debug(message: string, detail?: Record<string, unknown>): void;
  info(message: string, detail?: Record<string, unknown>): void;
  warn(message: string, detail?: Record<string, unknown>): void;
  error(message: string, detail?: Record<string, unknown>): void;
}

export interface ResolverClock {
  now(): Date;
}

export interface ResolverIdFactory {
  requestId(): string;
}

export interface ResolverCacheEntry<T> {
  value: T;
  storedAt: number;
  expiresAt: number;
}

export interface ResolverCache {
  get<T>(key: string): Promise<ResolverCacheEntry<T> | undefined>;
  set<T>(key: string, entry: ResolverCacheEntry<T>): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface InstitutionalRecordResolverOptions {
  adapters: InstitutionalRecordAdapter[];
  authorityEvaluator?: AuthorityEvaluator;
  visibilityEvaluator?: VisibilityPolicyEvaluator;
  logger?: ResolverLogger;
  clock?: ResolverClock;
  idFactory?: ResolverIdFactory;
  cache?: ResolverCache;
  cacheTtlMs?: number;
  maxRelationships?: number;
  maxEvents?: number;
  maxActions?: number;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const defaultLogger: ResolverLogger = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

const defaultClock: ResolverClock = {
  now: () => new Date(),
};

const defaultIdFactory: ResolverIdFactory = {
  requestId: () => {
    const random = Math.random().toString(36).slice(2, 10).toUpperCase();
    return `TA14-RES-${Date.now()}-${random}`;
  },
};

const defaultAuthorityEvaluator: AuthorityEvaluator = {
  canResolveRecord(record, authority) {
    if (authority.serviceRole || authority.audience === "SERVICE") {
      return { allowed: true, basis: ["service_role"] };
    }

    if (record.visibility.boundary === "public") {
      return { allowed: true, basis: ["public_visibility"] };
    }

    if (
      authority.actorSubjectId &&
      (authority.actorSubjectId === record.identity.ownerSubjectId ||
        authority.actorSubjectId === record.identity.stewardSubjectId)
    ) {
      return { allowed: true, basis: ["record_owner_or_steward"] };
    }

    if (authority.assignedRecordIds.includes(record.identity.recordId)) {
      return { allowed: true, basis: ["record_assignment"] };
    }

    if (authority.audience === "INSTITUTIONAL_ADMIN") {
      return { allowed: true, basis: ["institutional_admin"] };
    }

    if (record.visibility.boundary === "controlled" && authority.actorSubjectId) {
      return { allowed: true, basis: ["authenticated_controlled_projection"], redact: true };
    }

    return {
      allowed: false,
      basis: [],
      reason: "No public visibility, ownership, assignment, or institutional authority.",
    };
  },

  canViewRelationship(relationship, _source, _target, authority) {
    if (relationship.public) {
      return { allowed: true, basis: ["public_relationship"] };
    }
    if (authority.serviceRole || authority.audience === "INSTITUTIONAL_ADMIN") {
      return { allowed: true, basis: ["institutional_authority"] };
    }
    return {
      allowed: false,
      basis: [],
      reason: "Relationship metadata is not public.",
    };
  },

  canViewEvent(event, _record, authority) {
    if (event.public) {
      return { allowed: true, basis: ["public_event"] };
    }
    if (authority.serviceRole || authority.audience === "INSTITUTIONAL_ADMIN") {
      return { allowed: true, basis: ["institutional_authority"] };
    }
    return { allowed: false, basis: [], reason: "Event is not publicly projected." };
  },
};

const defaultVisibilityEvaluator: VisibilityPolicyEvaluator = {
  evaluate(record, authority) {
    const removedFields = new Set<string>();
    const transformedFields: string[] = [];
    const authorityBasis: string[] = [];

    if (
      authority.serviceRole ||
      authority.audience === "SERVICE" ||
      authority.audience === "INSTITUTIONAL_ADMIN"
    ) {
      authorityBasis.push("institutional_full_projection");
      return {
        audience: authority.audience,
        record: cloneRecord(record),
        removedFields: [],
        transformedFields: [],
        authorityBasis,
      };
    }

    const projected = cloneRecord(record);
    const publicData = projected.publicData;

    if (authority.audience === "PUBLIC") {
      authorityBasis.push("public_projection");
      projected.data = publicData ? cloneUnknownRecord(publicData) : {};
      for (const field of record.confidentialFieldNames) {
        removedFields.add(field);
      }
      projected.confidentialFieldNames = [];
      projected.searchableText = buildPublicSearchableText(projected);
    } else if (record.visibility.boundary === "controlled") {
      authorityBasis.push("controlled_authenticated_projection");
      for (const field of record.confidentialFieldNames) {
        delete projected.data[field];
        removedFields.add(field);
      }
      projected.confidentialFieldNames = [];
    } else if (record.visibility.boundary === "mixed") {
      authorityBasis.push("mixed_projection");
      for (const field of record.confidentialFieldNames) {
        if (!hasPrivilegedRecordAccess(record, authority)) {
          delete projected.data[field];
          removedFields.add(field);
        }
      }
    }

    return {
      audience: authority.audience,
      record: projected,
      removedFields: [...removedFields],
      transformedFields,
      authorityBasis,
    };
  },
};

// -----------------------------------------------------------------------------
// Resolver implementation
// -----------------------------------------------------------------------------

export class InstitutionalRecordResolver {
  private readonly adapters: InstitutionalRecordAdapter[];
  private readonly authorityEvaluator: AuthorityEvaluator;
  private readonly visibilityEvaluator: VisibilityPolicyEvaluator;
  private readonly logger: ResolverLogger;
  private readonly clock: ResolverClock;
  private readonly idFactory: ResolverIdFactory;
  private readonly cache?: ResolverCache;
  private readonly cacheTtlMs: number;
  private readonly maxRelationships: number;
  private readonly maxEvents: number;
  private readonly maxActions: number;

  constructor(options: InstitutionalRecordResolverOptions) {
    if (!options.adapters.length) {
      throw new Error("InstitutionalRecordResolver requires at least one adapter.");
    }

    this.adapters = [...options.adapters].sort((a, b) => b.priority - a.priority);
    this.authorityEvaluator = options.authorityEvaluator ?? defaultAuthorityEvaluator;
    this.visibilityEvaluator = options.visibilityEvaluator ?? defaultVisibilityEvaluator;
    this.logger = options.logger ?? defaultLogger;
    this.clock = options.clock ?? defaultClock;
    this.idFactory = options.idFactory ?? defaultIdFactory;
    this.cache = options.cache;
    this.cacheTtlMs = clamp(options.cacheTtlMs ?? 30_000, 0, 15 * 60_000);
    this.maxRelationships = clamp(options.maxRelationships ?? 250, 1, 2_000);
    this.maxEvents = clamp(options.maxEvents ?? 500, 1, 5_000);
    this.maxActions = clamp(options.maxActions ?? 250, 1, 2_000);
  }

  async resolve(
    query: ResolveRecordQuery,
    authority: AuthorityContext,
  ): Promise<ResolvedInstitutionalRecord> {
    const requestId = this.idFactory.requestId();
    const now = this.clock.now().toISOString();
    const issues: ResolverIssue[] = [];

    const validationIssues = validateResolveQuery(query);
    if (validationIssues.length) {
      return this.emptyResolution("ERROR", authority, requestId, now, validationIssues);
    }

    const cacheKey = this.createCacheKey(query, authority);
    const cached = await this.readCache(cacheKey);
    if (cached) {
      const cloned = cloneResolution(cached);
      cloned.meta.cached = true;
      cloned.meta.resolvedAt = now;
      cloned.meta.requestId = requestId;
      return cloned;
    }

    const context: AdapterResolutionContext = {
      authority,
      query,
      requestId,
      now,
    };

    const candidates = await this.selectAdapters(query, issues);
    if (!candidates.length) {
      issues.push({
        code: "NO_ADAPTER",
        severity: "error",
        message: "No institutional record adapter accepted the resolution query.",
        recoverable: true,
      });
      return this.emptyResolution("NOT_FOUND", authority, requestId, now, issues);
    }

    const adapterResults = await Promise.all(
      candidates.map(async (adapter) => {
        try {
          const result = await adapter.resolveRecord(query, context);
          return { adapter, result };
        } catch (error) {
          const issue = adapterErrorIssue(adapter.adapterId, error);
          issues.push(issue);
          this.logger.error("Institutional adapter resolution failed.", {
            adapterId: adapter.adapterId,
            requestId,
            error: errorMessage(error),
          });
          return { adapter, result: { issues: [issue] } as AdapterRecordResult };
        }
      }),
    );

    for (const { result } of adapterResults) {
      if (result.issues?.length) issues.push(...result.issues);
    }

    const records = adapterResults
      .filter((entry) => Boolean(entry.result.record))
      .map((entry) => ({
        adapter: entry.adapter,
        record: entry.result.record as InstitutionalRecordDetail,
        stale: Boolean(entry.result.stale),
      }));

    if (!records.length) {
      return this.emptyResolution("NOT_FOUND", authority, requestId, now, issues, candidates);
    }

    const selected = chooseCanonicalRecord(records, query, issues);
    if (!selected) {
      return this.emptyResolution("AMBIGUOUS", authority, requestId, now, issues, candidates);
    }

    const contractIssues = validateInstitutionalRecord(selected.record);
    issues.push(...contractIssues);
    if (contractIssues.some((issue) => issue.severity === "error")) {
      return this.emptyResolution("ERROR", authority, requestId, now, issues, candidates);
    }

    const authorityDecision = await this.authorityEvaluator.canResolveRecord(
      selected.record,
      authority,
    );
    if (!authorityDecision.allowed) {
      issues.push({
        code: "NOT_AUTHORIZED",
        severity: "warning",
        message: authorityDecision.reason ?? "The current subject may not resolve this record.",
        recordId: selected.record.identity.recordId,
        recoverable: false,
      });
      return this.emptyResolution("NOT_AUTHORIZED", authority, requestId, now, issues, candidates);
    }

    const projection = await this.visibilityEvaluator.evaluate(selected.record, authority);
    let relationships: ResolvedRelationship[] = [];
    let events: InstitutionalEvent[] = [];
    let actions: InstitutionalActionSummary[] = [];
    let versions: InstitutionalRecordVersion[] = [selected.record.version];

    if (query.includeRelationships !== false && (query.relationshipDepth ?? 1) > 0) {
      relationships = await this.resolveRelationships(selected.adapter, selected.record, context, issues);
    }

    if (query.includeEvents !== false) {
      events = await this.resolveEvents(selected.adapter, selected.record, context, issues);
    }

    if (query.includeActions !== false) {
      actions = await this.resolveActions(selected.adapter, selected.record, context, issues);
    }

    if (query.includeVersions !== false) {
      versions = await this.resolveVersions(selected.adapter, selected.record, context, issues);
    }

    const continuity = buildContinuity(selected.record, versions, relationships);
    const partial = issues.some((issue) => issue.severity === "error" && issue.recoverable);
    const stale = selected.stale || isRecordStale(selected.record, this.clock.now());

    if (stale && !query.allowStale) {
      issues.push({
        code: "STALE_RECORD",
        severity: "warning",
        message: "The record projection is stale and should be refreshed before consequential reliance.",
        recordId: selected.record.identity.recordId,
        recoverable: true,
      });
    }

    const resolution: ResolvedInstitutionalRecord = {
      status: stale ? "STALE" : partial ? "PARTIAL" : "RESOLVED",
      record: projection.record,
      relationships,
      events,
      actions,
      continuity,
      issues: deduplicateIssues(issues),
      meta: {
        resolverVersion: TA14_RECORD_RESOLVER_VERSION,
        contractVersion: TA14_RECORD_CONTRACT_VERSION,
        resolvedAt: now,
        requestId,
        sourceAdapters: unique(candidates.map((adapter) => adapter.adapterId)),
        cached: false,
        projectionAudience: authority.audience,
        partial,
        stale,
      },
    };

    await this.writeCache(cacheKey, resolution);
    return cloneResolution(resolution);
  }

  async search(
    query: SearchRecordsQuery,
    authority: AuthorityContext,
  ): Promise<SearchRecordsResult> {
    const requestId = this.idFactory.requestId();
    const resolvedAt = this.clock.now().toISOString();
    const issues: ResolverIssue[] = [];
    const limit = clamp(query.limit ?? 50, 1, 250);

    const searchableAdapters = this.adapters.filter((adapter) => adapter.searchRecords);
    if (!searchableAdapters.length) {
      issues.push({
        code: "SEARCH_NOT_SUPPORTED",
        severity: "warning",
        message: "No registered adapter currently supports institutional record search.",
        recoverable: true,
      });
      return {
        records: [],
        issues,
        meta: this.meta(authority, requestId, resolvedAt, searchableAdapters, true, false),
      };
    }

    const batches = await Promise.all(
      searchableAdapters.map(async (adapter) => {
        try {
          return await adapter.searchRecords!(query, authority, requestId);
        } catch (error) {
          issues.push(adapterErrorIssue(adapter.adapterId, error));
          return [];
        }
      }),
    );

    const merged = mergeSearchRecords(batches.flat());
    const filtered = merged
      .filter((record) => matchesSearchQuery(record, query))
      .sort(compareRecordSummaries)
      .slice(0, limit);

    const authorized: InstitutionalRecordSummary[] = [];
    for (const summary of filtered) {
      const syntheticDetail = summaryToDetail(summary);
      const decision = await this.authorityEvaluator.canResolveRecord(syntheticDetail, authority);
      if (decision.allowed) authorized.push(summary);
    }

    return {
      records: authorized,
      total: merged.length,
      nextCursor: merged.length > limit ? encodeCursor(limit) : undefined,
      issues: deduplicateIssues(issues),
      meta: this.meta(
        authority,
        requestId,
        resolvedAt,
        searchableAdapters,
        issues.length > 0,
        false,
      ),
    };
  }

  async resolveMany(
    queries: ResolveRecordQuery[],
    authority: AuthorityContext,
    concurrency = 6,
  ): Promise<ResolvedInstitutionalRecord[]> {
    const boundedConcurrency = clamp(concurrency, 1, 20);
    return mapWithConcurrency(queries, boundedConcurrency, (query) => this.resolve(query, authority));
  }

  async invalidate(recordIdOrInstitutionalId: string): Promise<void> {
    if (!this.cache) return;
    // Generic cache implementations do not necessarily support prefix deletion.
    // Consumers should call this method only when their cache adapter maps the
    // supplied value to a deterministic key, or provide short resolver TTLs.
    await this.cache.delete(recordIdOrInstitutionalId);
  }

  private async selectAdapters(
    query: ResolveRecordQuery,
    issues: ResolverIssue[],
  ): Promise<InstitutionalRecordAdapter[]> {
    const selected: InstitutionalRecordAdapter[] = [];
    for (const adapter of this.adapters) {
      if (query.recordType && !adapter.supportedRecordTypes.includes(query.recordType)) {
        continue;
      }
      try {
        if (await adapter.canResolve(query)) selected.push(adapter);
      } catch (error) {
        issues.push(adapterErrorIssue(adapter.adapterId, error));
      }
    }
    return selected;
  }

  private async resolveRelationships(
    adapter: InstitutionalRecordAdapter,
    record: InstitutionalRecordDetail,
    context: AdapterResolutionContext,
    issues: ResolverIssue[],
  ): Promise<ResolvedRelationship[]> {
    if (!adapter.listRelationships) return [];

    let raw: InstitutionalRelationship[] = [];
    try {
      raw = await adapter.listRelationships(record, context);
    } catch (error) {
      issues.push(adapterErrorIssue(adapter.adapterId, error, "RELATIONSHIP_RESOLUTION_FAILED"));
      return [];
    }

    const bounded = raw.slice(0, this.maxRelationships);
    if (raw.length > bounded.length) {
      issues.push({
        code: "RELATIONSHIP_LIMIT_APPLIED",
        severity: "warning",
        message: `Relationship result was limited to ${this.maxRelationships} entries.`,
        recordId: record.identity.recordId,
        adapterId: adapter.adapterId,
        recoverable: true,
      });
    }

    const results: ResolvedRelationship[] = [];
    for (const relationship of bounded) {
      const direction = relationship.sourceRecordId === record.identity.recordId ? "OUTBOUND" : "INBOUND";
      const relatedRecordId =
        direction === "OUTBOUND" ? relationship.targetRecordId : relationship.sourceRecordId;

      const related = await this.resolveRelatedRecord(adapter, relatedRecordId, context, issues);
      if (!related) continue;

      const decision = await this.authorityEvaluator.canViewRelationship(
        relationship,
        record,
        related,
        context.authority,
      );
      if (!decision.allowed) continue;

      results.push({ relationship, direction, relatedRecord: related });
    }

    return results.sort(compareResolvedRelationships);
  }

  private async resolveRelatedRecord(
    preferredAdapter: InstitutionalRecordAdapter,
    recordId: RecordId,
    context: AdapterResolutionContext,
    issues: ResolverIssue[],
  ): Promise<InstitutionalRecordSummary | undefined> {
    const adapters = [preferredAdapter, ...this.adapters.filter((item) => item !== preferredAdapter)];
    for (const adapter of adapters) {
      if (!adapter.resolveByRecordId) continue;
      try {
        const result = await adapter.resolveByRecordId(recordId, {
          ...context,
          query: { recordId, includeRelationships: false, includeActions: false, includeEvents: false },
        });
        if (result.record) return toSummary(result.record);
      } catch (error) {
        issues.push(adapterErrorIssue(adapter.adapterId, error, "RELATED_RECORD_RESOLUTION_FAILED"));
      }
    }
    issues.push({
      code: "RELATED_RECORD_NOT_RESOLVED",
      severity: "warning",
      message: `A related institutional record could not be resolved: ${recordId}.`,
      recordId,
      recoverable: true,
    });
    return undefined;
  }

  private async resolveEvents(
    adapter: InstitutionalRecordAdapter,
    record: InstitutionalRecordDetail,
    context: AdapterResolutionContext,
    issues: ResolverIssue[],
  ): Promise<InstitutionalEvent[]> {
    if (!adapter.listEvents) return [];
    try {
      const raw = await adapter.listEvents(record, context);
      const visible: InstitutionalEvent[] = [];
      for (const event of raw.slice(0, this.maxEvents)) {
        const decision = await this.authorityEvaluator.canViewEvent(event, record, context.authority);
        if (decision.allowed) visible.push(event);
      }
      return visible.sort((a, b) => compareIsoDesc(a.occurredAt, b.occurredAt));
    } catch (error) {
      issues.push(adapterErrorIssue(adapter.adapterId, error, "EVENT_RESOLUTION_FAILED"));
      return [];
    }
  }

  private async resolveActions(
    adapter: InstitutionalRecordAdapter,
    record: InstitutionalRecordDetail,
    context: AdapterResolutionContext,
    issues: ResolverIssue[],
  ): Promise<InstitutionalActionSummary[]> {
    if (!adapter.listActions) return [];
    try {
      const raw = await adapter.listActions(record, context);
      return raw
        .filter((action) => canViewAction(action, record, context.authority))
        .slice(0, this.maxActions)
        .sort(compareActions);
    } catch (error) {
      issues.push(adapterErrorIssue(adapter.adapterId, error, "ACTION_RESOLUTION_FAILED"));
      return [];
    }
  }

  private async resolveVersions(
    adapter: InstitutionalRecordAdapter,
    record: InstitutionalRecordDetail,
    context: AdapterResolutionContext,
    issues: ResolverIssue[],
  ): Promise<InstitutionalRecordVersion[]> {
    if (!adapter.listVersions) return [record.version];
    try {
      const versions = await adapter.listVersions(record, context);
      return normalizeVersions(versions, record.version, issues, record.identity.recordId);
    } catch (error) {
      issues.push(adapterErrorIssue(adapter.adapterId, error, "VERSION_RESOLUTION_FAILED"));
      return [record.version];
    }
  }

  private emptyResolution(
    status: ResolutionStatus,
    authority: AuthorityContext,
    requestId: string,
    resolvedAt: string,
    issues: ResolverIssue[],
    adapters: InstitutionalRecordAdapter[] = [],
  ): ResolvedInstitutionalRecord {
    return {
      status,
      relationships: [],
      events: [],
      actions: [],
      issues: deduplicateIssues(issues),
      meta: this.meta(authority, requestId, resolvedAt, adapters, status === "PARTIAL", status === "STALE"),
    };
  }

  private meta(
    authority: AuthorityContext,
    requestId: string,
    resolvedAt: string,
    adapters: InstitutionalRecordAdapter[],
    partial: boolean,
    stale: boolean,
  ): InstitutionalResolutionMeta {
    return {
      resolverVersion: TA14_RECORD_RESOLVER_VERSION,
      contractVersion: TA14_RECORD_CONTRACT_VERSION,
      resolvedAt,
      requestId,
      sourceAdapters: unique(adapters.map((adapter) => adapter.adapterId)),
      cached: false,
      projectionAudience: authority.audience,
      partial,
      stale,
    };
  }

  private createCacheKey(query: ResolveRecordQuery, authority: AuthorityContext): string {
    return stableJson({
      resolver: TA14_RECORD_RESOLVER_VERSION,
      query,
      audience: authority.audience,
      actor: authority.actorSubjectId ?? null,
      roles: [...authority.roleCodes].sort(),
      grants: [...authority.authorityGrantIds].sort(),
      assignments: [...authority.assignedRecordIds].sort(),
    });
  }

  private async readCache(key: string): Promise<ResolvedInstitutionalRecord | undefined> {
    if (!this.cache || this.cacheTtlMs <= 0) return undefined;
    try {
      const entry = await this.cache.get<ResolvedInstitutionalRecord>(key);
      if (!entry) return undefined;
      if (entry.expiresAt <= this.clock.now().getTime()) {
        await this.cache.delete(key);
        return undefined;
      }
      return entry.value;
    } catch (error) {
      this.logger.warn("Institutional resolver cache read failed.", { error: errorMessage(error) });
      return undefined;
    }
  }

  private async writeCache(key: string, value: ResolvedInstitutionalRecord): Promise<void> {
    if (!this.cache || this.cacheTtlMs <= 0) return;
    const storedAt = this.clock.now().getTime();
    try {
      await this.cache.set(key, {
        value: cloneResolution(value),
        storedAt,
        expiresAt: storedAt + this.cacheTtlMs,
      });
    } catch (error) {
      this.logger.warn("Institutional resolver cache write failed.", { error: errorMessage(error) });
    }
  }
}

// -----------------------------------------------------------------------------
// Adapter factory for incremental migration
// -----------------------------------------------------------------------------

export interface InMemoryInstitutionalAdapterOptions {
  adapterId?: string;
  priority?: number;
  records: InstitutionalRecordDetail[];
  relationships?: InstitutionalRelationship[];
  events?: InstitutionalEvent[];
  actions?: InstitutionalActionSummary[];
  versions?: InstitutionalRecordVersion[];
}

/**
 * Creates a deterministic adapter suitable for demonstrations, tests, static
 * registries, and incremental migration. Production Supabase adapters can
 * implement the same InstitutionalRecordAdapter interface without changing
 * resolver consumers.
 */
export function createInMemoryInstitutionalAdapter(
  options: InMemoryInstitutionalAdapterOptions,
): InstitutionalRecordAdapter {
  const records = new Map(options.records.map((record) => [record.identity.recordId, cloneRecord(record)]));
  const institutionalIndex = new Map(
    options.records.map((record) => [record.identity.institutionalId, record.identity.recordId]),
  );
  const relationships = options.relationships ?? [];
  const events = options.events ?? [];
  const actions = options.actions ?? [];
  const versions = options.versions ?? options.records.map((record) => record.version);

  return {
    adapterId: options.adapterId ?? "ta14.in-memory",
    priority: options.priority ?? 10,
    supportedRecordTypes: unique(options.records.map((record) => record.identity.recordType)),

    canResolve(query) {
      if (query.recordId) return records.has(query.recordId);
      if (query.institutionalId) return institutionalIndex.has(query.institutionalId);
      return Boolean(query.recordType);
    },

    async resolveRecord(query) {
      let record: InstitutionalRecordDetail | undefined;
      if (query.recordId) record = records.get(query.recordId);
      if (!record && query.institutionalId) {
        const id = institutionalIndex.get(query.institutionalId);
        if (id) record = records.get(id);
      }
      if (!record && query.recordType) {
        record = [...records.values()].find((candidate) => candidate.identity.recordType === query.recordType);
      }
      return { record: record ? cloneRecord(record) : undefined };
    },

    async resolveByRecordId(recordId) {
      const record = records.get(recordId);
      return { record: record ? cloneRecord(record) : undefined };
    },

    async listRelationships(record) {
      return relationships.filter(
        (relationship) =>
          relationship.sourceRecordId === record.identity.recordId ||
          relationship.targetRecordId === record.identity.recordId,
      );
    },

    async listEvents(record) {
      return events.filter((event) => event.recordId === record.identity.recordId);
    },

    async listActions(record) {
      return actions.filter((action) => action.recordId === record.identity.recordId);
    },

    async listVersions(record) {
      const matching = versions.filter(
        (version) =>
          version.versionId === record.version.versionId ||
          version.priorVersionId === record.version.versionId ||
          record.version.priorVersionId === version.versionId,
      );
      return matching.length ? matching : [record.version];
    },

    async searchRecords(query) {
      return [...records.values()].map(toSummary).filter((summary) => matchesSearchQuery(summary, query));
    },
  };
}

// -----------------------------------------------------------------------------
// Contract validation
// -----------------------------------------------------------------------------

export function validateResolveQuery(query: ResolveRecordQuery): ResolverIssue[] {
  const issues: ResolverIssue[] = [];
  const identifiers = [query.recordId, query.institutionalId].filter(Boolean);

  if (!identifiers.length && !query.recordType) {
    issues.push({
      code: "QUERY_IDENTITY_REQUIRED",
      severity: "error",
      message: "Resolution requires a record ID, institutional ID, or record type.",
      recoverable: true,
    });
  }

  if (query.relationshipDepth !== undefined && ![0, 1, 2].includes(query.relationshipDepth)) {
    issues.push({
      code: "INVALID_RELATIONSHIP_DEPTH",
      severity: "error",
      message: "Relationship depth must be 0, 1, or 2.",
      field: "relationshipDepth",
      recoverable: true,
    });
  }

  return issues;
}

export function validateInstitutionalRecord(record: InstitutionalRecordDetail): ResolverIssue[] {
  const issues: ResolverIssue[] = [];
  const identity = record.identity;

  requireString(identity.recordId, "record.identity.recordId", issues);
  requireString(identity.institutionalId, "record.identity.institutionalId", issues);
  requireString(identity.title, "record.identity.title", issues);
  requireString(identity.stewardSubjectId, "record.identity.stewardSubjectId", issues);
  requireIso(identity.createdAt, "record.identity.createdAt", issues);
  requireIso(identity.updatedAt, "record.identity.updatedAt", issues);
  requireString(record.version.versionId, "record.version.versionId", issues);
  requireIso(record.version.createdAt, "record.version.createdAt", issues);

  if (!record.version.current) {
    issues.push({
      code: "NON_CURRENT_RECORD_VERSION",
      severity: "warning",
      message: "Resolved record version is not marked current.",
      recordId: identity.recordId,
      field: "record.version.current",
      recoverable: true,
    });
  }

  if (record.visibility.boundary === "public" && !record.visibility.publicSummaryAllowed) {
    issues.push({
      code: "PUBLIC_VISIBILITY_CONTRADICTION",
      severity: "warning",
      message: "Record is public but public summary projection is disabled.",
      recordId: identity.recordId,
      recoverable: true,
    });
  }

  if (!record.claimBoundary.limitations.length) {
    issues.push({
      code: "LIMITATIONS_NOT_DECLARED",
      severity: "warning",
      message: "Institutional record does not declare limitations.",
      recordId: identity.recordId,
      recoverable: true,
    });
  }

  if (!record.sourceSystem.trim()) {
    issues.push({
      code: "SOURCE_SYSTEM_REQUIRED",
      severity: "error",
      message: "Institutional record must identify its source system.",
      recordId: identity.recordId,
      field: "record.sourceSystem",
      recoverable: true,
    });
  }

  return issues;
}

// -----------------------------------------------------------------------------
// Projection and continuity utilities
// -----------------------------------------------------------------------------

export function toSummary(record: InstitutionalRecordDetail): InstitutionalRecordSummary {
  return {
    identity: { ...record.identity },
    version: { ...record.version },
    states: { ...record.states },
    visibility: { ...record.visibility, redactedFields: [...record.visibility.redactedFields] },
    steward: record.steward ? { ...record.steward } : undefined,
    owner: record.owner ? { ...record.owner } : undefined,
    authorityGrantIds: [...record.authorityGrantIds],
    claimBoundary: cloneClaimBoundary(record.claimBoundary),
    integrity: record.integrity ? { ...record.integrity } : undefined,
    tags: [...record.tags],
    jurisdictions: [...record.jurisdictions],
    frameworks: [...record.frameworks],
    effectiveAt: record.effectiveAt,
    expiresAt: record.expiresAt,
  };
}

export function buildContinuity(
  record: InstitutionalRecordDetail,
  versions: InstitutionalRecordVersion[],
  relationships: ResolvedRelationship[],
): InstitutionalContinuity {
  const predecessorRecordIds = relatedIds(relationships, ["supersedes", "corrected_by"], "INBOUND");
  const successorRecordIds = relatedIds(relationships, ["superseded_by", "corrected_by"], "OUTBOUND");
  const challengedByRecordIds = relatedIds(relationships, ["challenged_by"]);
  const correctedByRecordIds = relatedIds(relationships, ["corrected_by"]);
  const revalidationRecordIds = relatedIds(relationships, ["revalidates"]);

  const ordered = [...versions].sort((a, b) => a.sequence - b.sequence);
  const continuityComplete = ordered.every((version, index) => {
    if (index === 0) return !version.priorVersionId;
    return version.priorVersionId === ordered[index - 1]?.versionId;
  });

  return {
    currentVersionId: record.version.versionId,
    versions: ordered,
    predecessorRecordIds,
    successorRecordIds,
    challengedByRecordIds,
    correctedByRecordIds,
    revalidationRecordIds,
    materialChangePending: record.states.lifecycle === "returned" || revalidationRecordIds.length > 0,
    continuityComplete,
  };
}

export function createPublicProjection(
  record: InstitutionalRecordDetail,
): InstitutionalRecordDetail {
  return (defaultVisibilityEvaluator.evaluate(
    record,
    createAnonymousPublicAuthorityContext(),
  ) as RecordProjection).record;
}

export function createAnonymousPublicAuthorityContext(
  requestedAt = new Date().toISOString(),
): AuthorityContext {
  return {
    audience: "PUBLIC",
    organizationIds: [],
    roleCodes: [],
    authorityGrantIds: [],
    credentialIds: [],
    assignedRecordIds: [],
    conflictRecordIds: [],
    serviceRole: false,
    requestedAt,
  };
}

export function createAuthenticatedAuthorityContext(input: {
  actorSubjectId: SubjectId;
  organizationIds?: string[];
  roleCodes?: string[];
  authorityGrantIds?: AuthorityGrantId[];
  credentialIds?: InstitutionalId[];
  assignedRecordIds?: RecordId[];
  conflictRecordIds?: RecordId[];
  audience?: ProjectionAudience;
  requestedAt?: ISODateTime;
}): AuthorityContext {
  return {
    actorSubjectId: input.actorSubjectId,
    audience: input.audience ?? "AUTHENTICATED",
    organizationIds: input.organizationIds ?? [],
    roleCodes: input.roleCodes ?? [],
    authorityGrantIds: input.authorityGrantIds ?? [],
    credentialIds: input.credentialIds ?? [],
    assignedRecordIds: input.assignedRecordIds ?? [],
    conflictRecordIds: input.conflictRecordIds ?? [],
    serviceRole: input.audience === "SERVICE",
    requestedAt: input.requestedAt ?? new Date().toISOString(),
  };
}

// -----------------------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------------------

function chooseCanonicalRecord(
  records: Array<{ adapter: InstitutionalRecordAdapter; record: InstitutionalRecordDetail; stale: boolean }>,
  query: ResolveRecordQuery,
  issues: ResolverIssue[],
): { adapter: InstitutionalRecordAdapter; record: InstitutionalRecordDetail; stale: boolean } | undefined {
  const exact = records.filter(({ record }) => {
    if (query.recordId && record.identity.recordId !== query.recordId) return false;
    if (query.institutionalId && record.identity.institutionalId !== query.institutionalId) return false;
    if (query.recordType && record.identity.recordType !== query.recordType) return false;
    return true;
  });

  const candidates = exact.length ? exact : records;
  if (candidates.length === 1) return candidates[0];

  const sorted = [...candidates].sort((a, b) => {
    if (a.record.version.current !== b.record.version.current) return a.record.version.current ? -1 : 1;
    if (a.record.version.sequence !== b.record.version.sequence) {
      return b.record.version.sequence - a.record.version.sequence;
    }
    return compareIsoDesc(a.record.identity.updatedAt, b.record.identity.updatedAt);
  });

  const first = sorted[0];
  const second = sorted[1];
  if (
    first &&
    second &&
    first.record.identity.institutionalId === second.record.identity.institutionalId &&
    first.record.version.sequence === second.record.version.sequence &&
    first.record.version.versionId !== second.record.version.versionId
  ) {
    issues.push({
      code: "AMBIGUOUS_CURRENT_VERSION",
      severity: "error",
      message: "Multiple adapters returned conflicting current versions for the same institutional record.",
      recordId: first.record.identity.recordId,
      recoverable: false,
    });
    return undefined;
  }

  if (sorted.length > 1) {
    issues.push({
      code: "MULTIPLE_RECORD_CANDIDATES",
      severity: "warning",
      message: "Multiple adapters resolved the record; the current highest version was selected.",
      recordId: first?.record.identity.recordId,
      recoverable: true,
    });
  }

  return first;
}

function normalizeVersions(
  versions: InstitutionalRecordVersion[],
  current: InstitutionalRecordVersion,
  issues: ResolverIssue[],
  recordId: RecordId,
): InstitutionalRecordVersion[] {
  const byId = new Map<string, InstitutionalRecordVersion>();
  for (const version of [...versions, current]) byId.set(version.versionId, { ...version });
  const normalized = [...byId.values()].sort((a, b) => a.sequence - b.sequence);
  const currentVersions = normalized.filter((version) => version.current);
  if (currentVersions.length !== 1) {
    issues.push({
      code: "INVALID_CURRENT_VERSION_COUNT",
      severity: "warning",
      message: `Expected exactly one current version but found ${currentVersions.length}.`,
      recordId,
      recoverable: true,
    });
  }
  return normalized;
}

function matchesSearchQuery(record: InstitutionalRecordSummary, query: SearchRecordsQuery): boolean {
  if (query.institutionalIds?.length && !query.institutionalIds.includes(record.identity.institutionalId)) return false;
  if (query.recordTypes?.length && !query.recordTypes.includes(record.identity.recordType)) return false;
  if (query.divisions?.length && !query.divisions.includes(record.identity.division)) return false;
  if (query.lifecycleStates?.length && !query.lifecycleStates.includes(record.states.lifecycle)) return false;
  if (
    query.determinationStates?.length &&
    (!record.states.determination || !query.determinationStates.includes(record.states.determination))
  ) return false;
  if (query.visibilityBoundaries?.length && !query.visibilityBoundaries.includes(record.visibility.boundary)) return false;
  if (query.ownerSubjectIds?.length && (!record.identity.ownerSubjectId || !query.ownerSubjectIds.includes(record.identity.ownerSubjectId))) return false;
  if (query.stewardSubjectIds?.length && !query.stewardSubjectIds.includes(record.identity.stewardSubjectId)) return false;
  if (query.tags?.length && !query.tags.every((tag) => record.tags.includes(tag))) return false;
  if (query.jurisdictions?.length && !query.jurisdictions.some((item) => record.jurisdictions.includes(item))) return false;
  if (query.frameworks?.length && !query.frameworks.some((item) => record.frameworks.includes(item))) return false;
  if (query.createdFrom && record.identity.createdAt < query.createdFrom) return false;
  if (query.createdTo && record.identity.createdAt > query.createdTo) return false;
  if (query.text) {
    const haystack = [
      record.identity.institutionalId,
      record.identity.title,
      record.identity.subtitle ?? "",
      ...record.tags,
      ...record.jurisdictions,
      ...record.frameworks,
      ...record.claimBoundary.supportedClaims,
      ...record.claimBoundary.limitations,
    ].join(" ").toLowerCase();
    if (!haystack.includes(query.text.toLowerCase().trim())) return false;
  }
  return true;
}

function mergeSearchRecords(records: InstitutionalRecordSummary[]): InstitutionalRecordSummary[] {
  const index = new Map<string, InstitutionalRecordSummary>();
  for (const record of records) {
    const key = record.identity.institutionalId;
    const prior = index.get(key);
    if (!prior || compareRecordSummaries(record, prior) < 0) index.set(key, record);
  }
  return [...index.values()];
}

function compareRecordSummaries(a: InstitutionalRecordSummary, b: InstitutionalRecordSummary): number {
  if (a.version.current !== b.version.current) return a.version.current ? -1 : 1;
  if (a.version.sequence !== b.version.sequence) return b.version.sequence - a.version.sequence;
  return compareIsoDesc(a.identity.updatedAt, b.identity.updatedAt);
}

function compareResolvedRelationships(a: ResolvedRelationship, b: ResolvedRelationship): number {
  const typeCompare = a.relationship.relationshipType.localeCompare(b.relationship.relationshipType);
  if (typeCompare !== 0) return typeCompare;
  return a.relatedRecord.identity.institutionalId.localeCompare(b.relatedRecord.identity.institutionalId);
}

function compareActions(a: InstitutionalActionSummary, b: InstitutionalActionSummary): number {
  if (a.status !== b.status) {
    const rank: Record<ActionState, number> = {
      open: 0,
      in_progress: 1,
      blocked: 2,
      expired: 3,
      satisfied: 4,
      withdrawn: 5,
    };
    return rank[a.status] - rank[b.status];
  }
  if (a.priority !== b.priority) return b.priority - a.priority;
  if (a.dueAt && b.dueAt) return a.dueAt.localeCompare(b.dueAt);
  if (a.dueAt) return -1;
  if (b.dueAt) return 1;
  return compareIsoDesc(a.createdAt, b.createdAt);
}

function canViewAction(
  action: InstitutionalActionSummary,
  record: InstitutionalRecordDetail,
  authority: AuthorityContext,
): boolean {
  if (authority.serviceRole || authority.audience === "INSTITUTIONAL_ADMIN") return true;
  if (action.visibility === "public") return true;
  if (authority.actorSubjectId === action.responsibleSubjectId) return true;
  if (authority.actorSubjectId === record.identity.ownerSubjectId) return true;
  if (authority.assignedRecordIds.includes(record.identity.recordId)) return true;
  return false;
}

function hasPrivilegedRecordAccess(record: InstitutionalRecordDetail, authority: AuthorityContext): boolean {
  if (authority.serviceRole || authority.audience === "INSTITUTIONAL_ADMIN") return true;
  if (!authority.actorSubjectId) return false;
  if (authority.actorSubjectId === record.identity.ownerSubjectId) return true;
  if (authority.actorSubjectId === record.identity.stewardSubjectId) return true;
  return authority.assignedRecordIds.includes(record.identity.recordId);
}

function isRecordStale(record: InstitutionalRecordDetail, now: Date): boolean {
  if (record.states.evidence === "stale") return true;
  if (!record.expiresAt) return false;
  const expires = Date.parse(record.expiresAt);
  return Number.isFinite(expires) && expires <= now.getTime();
}

function relatedIds(
  relationships: ResolvedRelationship[],
  types: RelationshipType[],
  direction?: RelationshipDirection,
): RecordId[] {
  return unique(
    relationships
      .filter((item) => types.includes(item.relationship.relationshipType))
      .filter((item) => !direction || item.direction === direction)
      .map((item) => item.relatedRecord.identity.recordId),
  );
}

function summaryToDetail(summary: InstitutionalRecordSummary): InstitutionalRecordDetail {
  return {
    ...summary,
    data: {},
    publicData: {},
    confidentialFieldNames: [],
    searchableText: summary.identity.title,
    sourceSystem: "institutional-search-summary",
  };
}

function buildPublicSearchableText(record: InstitutionalRecordDetail): string {
  return [
    record.identity.institutionalId,
    record.identity.title,
    record.identity.subtitle ?? "",
    ...record.tags,
    ...record.jurisdictions,
    ...record.frameworks,
    ...record.claimBoundary.supportedClaims,
    ...record.claimBoundary.limitations,
  ].join(" ").trim();
}

function cloneRecord(record: InstitutionalRecordDetail): InstitutionalRecordDetail {
  return {
    ...record,
    identity: { ...record.identity },
    version: { ...record.version },
    states: { ...record.states },
    visibility: { ...record.visibility, redactedFields: [...record.visibility.redactedFields] },
    steward: record.steward ? { ...record.steward } : undefined,
    owner: record.owner ? { ...record.owner } : undefined,
    authorityGrantIds: [...record.authorityGrantIds],
    claimBoundary: cloneClaimBoundary(record.claimBoundary),
    integrity: record.integrity ? { ...record.integrity } : undefined,
    tags: [...record.tags],
    jurisdictions: [...record.jurisdictions],
    frameworks: [...record.frameworks],
    data: cloneUnknownRecord(record.data),
    publicData: record.publicData ? cloneUnknownRecord(record.publicData) : undefined,
    confidentialFieldNames: [...record.confidentialFieldNames],
  };
}

function cloneClaimBoundary(boundary: ClaimBoundary): ClaimBoundary {
  return {
    supportedClaims: [...boundary.supportedClaims],
    partiallySupportedClaims: [...boundary.partiallySupportedClaims],
    unsupportedClaims: [...boundary.unsupportedClaims],
    outsideScopeClaims: [...boundary.outsideScopeClaims],
    nonClaims: [...boundary.nonClaims],
    limitations: [...boundary.limitations],
    expiredOrWithdrawnClaims: [...boundary.expiredOrWithdrawnClaims],
  };
}

function cloneUnknownRecord(value: Record<string, unknown>): Record<string, unknown> {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

function cloneResolution(value: ResolvedInstitutionalRecord): ResolvedInstitutionalRecord {
  return {
    ...value,
    record: value.record ? cloneRecord(value.record) : undefined,
    relationships: value.relationships.map((item) => ({
      relationship: { ...item.relationship, metadata: item.relationship.metadata ? cloneUnknownRecord(item.relationship.metadata) : undefined },
      direction: item.direction,
      relatedRecord: {
        ...item.relatedRecord,
        identity: { ...item.relatedRecord.identity },
        version: { ...item.relatedRecord.version },
        states: { ...item.relatedRecord.states },
        visibility: { ...item.relatedRecord.visibility, redactedFields: [...item.relatedRecord.visibility.redactedFields] },
        authorityGrantIds: [...item.relatedRecord.authorityGrantIds],
        claimBoundary: cloneClaimBoundary(item.relatedRecord.claimBoundary),
        tags: [...item.relatedRecord.tags],
        jurisdictions: [...item.relatedRecord.jurisdictions],
        frameworks: [...item.relatedRecord.frameworks],
      },
    })),
    events: value.events.map((event) => ({ ...event })),
    actions: value.actions.map((action) => ({ ...action })),
    continuity: value.continuity
      ? {
          ...value.continuity,
          versions: value.continuity.versions.map((version) => ({ ...version })),
          predecessorRecordIds: [...value.continuity.predecessorRecordIds],
          successorRecordIds: [...value.continuity.successorRecordIds],
          challengedByRecordIds: [...value.continuity.challengedByRecordIds],
          correctedByRecordIds: [...value.continuity.correctedByRecordIds],
          revalidationRecordIds: [...value.continuity.revalidationRecordIds],
        }
      : undefined,
    issues: value.issues.map((issue) => ({ ...issue })),
    meta: { ...value.meta, sourceAdapters: [...value.meta.sourceAdapters] },
  };
}

function adapterErrorIssue(
  adapterId: string,
  error: unknown,
  code = "ADAPTER_RESOLUTION_FAILED",
): ResolverIssue {
  return {
    code,
    severity: "error",
    message: `Adapter ${adapterId} failed: ${errorMessage(error)}`,
    adapterId,
    recoverable: true,
  };
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown adapter error";
}

function requireString(value: unknown, field: string, issues: ResolverIssue[]): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push({
      code: "REQUIRED_STRING_MISSING",
      severity: "error",
      message: `${field} is required.`,
      field,
      recoverable: true,
    });
  }
}

function requireIso(value: unknown, field: string, issues: ResolverIssue[]): void {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) {
    issues.push({
      code: "INVALID_ISO_DATETIME",
      severity: "error",
      message: `${field} must be a valid ISO date-time string.`,
      field,
      recoverable: true,
    });
  }
}

function deduplicateIssues(issues: ResolverIssue[]): ResolverIssue[] {
  const seen = new Set<string>();
  const result: ResolverIssue[] = [];
  for (const issue of issues) {
    const key = [issue.code, issue.adapterId, issue.recordId, issue.field, issue.message].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(issue);
  }
  return result;
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

function compareIsoDesc(a: string, b: string): number {
  return b.localeCompare(a);
}

function stableJson(value: unknown): string {
  return JSON.stringify(sortForStableJson(value));
}

function sortForStableJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortForStableJson);
  if (value && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) result[key] = sortForStableJson(source[key]);
    return result;
  }
  return value;
}

function encodeCursor(offset: number): string {
  const raw = `ta14:${offset}`;
  if (typeof btoa !== "undefined") return btoa(raw);
  return raw;
}

async function mapWithConcurrency<T, R>(
  values: T[],
  concurrency: number,
  mapper: (value: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= values.length) return;
      results[index] = await mapper(values[index] as T, index);
    }
  });

  await Promise.all(workers);
  return results;
}

// -----------------------------------------------------------------------------
// Recommended singleton factory
// -----------------------------------------------------------------------------

export function createInstitutionalRecordResolver(
  options: InstitutionalRecordResolverOptions,
): InstitutionalRecordResolver {
  return new InstitutionalRecordResolver(options);
}
