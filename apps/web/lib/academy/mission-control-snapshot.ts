/**
 * TA-14 Authority Governance Institution
 * MCS-001 — Mission Control Snapshot Resolver
 *
 * CREATE:
 *   apps/web/lib/academy/mission-control-snapshot.ts
 *
 * Purpose:
 *   Assemble institutional records from repository-backed providers into
 *   one InstitutionalLifecycleSnapshot for Mission Control.
 *
 * Boundary:
 *   This resolver reads, normalizes, orders, and projects institutional
 *   records. It does not create credentials, authority, assignments,
 *   findings, determinations, Registry publications, execution artifacts,
 *   executions, outcomes, continuity records, or revalidation decisions.
 */

import type {
  InstitutionalLifecycleSnapshot,
  InstitutionalStageId,
  InstitutionalStageRecordRef,
} from "./institutional-engine";

export const TA14_MISSION_CONTROL_SNAPSHOT_ID =
  "TA14-MCS-SNAPSHOT-RESOLVER-000001" as const;

export const TA14_MISSION_CONTROL_SNAPSHOT_VERSION =
  "1.0.0" as const;

export const TA14_MISSION_CONTROL_SNAPSHOT_BOUNDARY =
  "Mission Control snapshot resolution reads and projects institutional records without creating or mutating institutional effects." as const;

/* ========================================================================== *
 * Shared identifiers and source contracts
 * ========================================================================== */

export interface MissionControlSubjectContext {
  readonly subjectId: string;
  readonly organizationId?: string;
  readonly governanceEntityId?: string;
  readonly routeId?: string;
  readonly targetRecordId?: string;
  readonly correlationId?: string;
}

export interface MissionControlSourceRecord {
  readonly recordId: string;
  readonly recordType?: string;
  readonly version?: string;
  readonly state: string;
  readonly integrityHash?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly completedAt?: string;
  readonly ownerSubjectId?: string;
  readonly organizationId?: string;
  readonly routeId?: string;
  readonly correlationId?: string;
  readonly limitations?: readonly string[];
}

export interface MissionControlStageSource {
  readonly stageId: InstitutionalStageId;
  readonly sourceName: string;
  readonly required: boolean;

  listRecords(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlSourceRecord[]>;
}

export interface MissionControlSnapshotProvider {
  readonly providerId: string;
  readonly providerVersion: string;

  getSubjectContext(
    input: MissionControlSnapshotRequest,
  ): Promise<MissionControlSubjectContext>;

  getStageSources(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlStageSource[]>;
}

/* ========================================================================== *
 * Request and result contracts
 * ========================================================================== */

export interface MissionControlSnapshotRequest {
  readonly subjectId: string;
  readonly organizationId?: string;
  readonly governanceEntityId?: string;
  readonly routeId?: string;
  readonly targetRecordId?: string;
  readonly correlationId?: string;
  readonly includeStageIds?: readonly InstitutionalStageId[];
  readonly excludeStageIds?: readonly InstitutionalStageId[];
  readonly generatedAt?: string;
  readonly snapshotId?: string;
}

export interface MissionControlSnapshotSourceResult {
  readonly stageId: InstitutionalStageId;
  readonly sourceName: string;
  readonly required: boolean;
  readonly ok: boolean;
  readonly recordCount: number;
  readonly records: readonly InstitutionalStageRecordRef[];
  readonly error?: string;
  readonly resolvedAt: string;
}

export interface MissionControlSnapshotResolution {
  readonly snapshot: InstitutionalLifecycleSnapshot;
  readonly sourceResults: readonly MissionControlSnapshotSourceResult[];
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
  readonly complete: boolean;
  readonly generatedAt: string;
  readonly createsInstitutionalEffect: false;
  readonly mutatesHistoricalRecord: false;
}

/* ========================================================================== *
 * Resolution policy
 * ========================================================================== */

export interface MissionControlSnapshotPolicy {
  readonly failOnRequiredSourceError: boolean;
  readonly preserveSourceErrors: boolean;
  readonly preserveDuplicateRecords: boolean;
  readonly deduplicateByRecordId: boolean;
  readonly sortByStageOrder: boolean;
  readonly sortRecordsByUpdatedAt: boolean;
  readonly includeEmptyRequiredStages: boolean;
  readonly maximumRecordsPerStage?: number;
}

export const DEFAULT_MISSION_CONTROL_SNAPSHOT_POLICY:
MissionControlSnapshotPolicy = Object.freeze({
  failOnRequiredSourceError: false,
  preserveSourceErrors: true,
  preserveDuplicateRecords: false,
  deduplicateByRecordId: true,
  sortByStageOrder: true,
  sortRecordsByUpdatedAt: true,
  includeEmptyRequiredStages: true,
});

/* ========================================================================== *
 * Canonical stage ordering
 * ========================================================================== */

const STAGE_ORDER: Readonly<Record<InstitutionalStageId, number>> =
  Object.freeze({
    reality: 1,
    record: 2,
    context: 3,
    relationship: 4,
    lesson: 5,
    simulation: 6,
    assessment: 7,
    credential: 8,
    authority_review: 9,
    authority: 10,
    assignment: 11,
    governed_work: 12,
    finding: 13,
    determination: 14,
    registry_review: 15,
    registry_publication: 16,
    execution_artifact: 17,
    execution: 18,
    outcome: 19,
    continuity: 20,
    revalidation: 21,
    governance_cycle: 22,
    institutional_evolution: 23,
    institutional_memory: 24,
    institutional_knowledge: 25,
    institutional_intelligence: 26,
    institutional_strategy: 27,
    institutional_stewardship: 28,
    institutional_assurance: 29,
    institutional_oversight: 30,
    institutional_accountability: 31,
    institutional_transparency: 32,
    institutional_trust: 33,
    institutional_legitimacy: 34,
    institutional_continuity_governance: 35,
    institutional_resilience: 36,
    institutional_sustainability: 37,
  });

/* ========================================================================== *
 * Main resolver
 * ========================================================================== */

export class MissionControlSnapshotResolver {
  constructor(
    private readonly provider: MissionControlSnapshotProvider,
    private readonly policy: MissionControlSnapshotPolicy =
      DEFAULT_MISSION_CONTROL_SNAPSHOT_POLICY,
  ) {}

  async resolve(
    request: MissionControlSnapshotRequest,
  ): Promise<MissionControlSnapshotResolution> {
    const generatedAt =
      request.generatedAt ?? new Date().toISOString();

    const context =
      await this.provider.getSubjectContext(request);

    const allSources =
      await this.provider.getStageSources(context);

    const filteredSources =
      filterSources(allSources, request);

    const sourceResults =
      await Promise.all(
        filteredSources.map((source) =>
          resolveSource(
            source,
            context,
            generatedAt,
            this.policy,
          ),
        ),
      );

    const warnings: string[] = [];
    const errors: string[] = [];

    for (const result of sourceResults) {
      if (!result.ok && result.error) {
        const message =
          `${result.stageId}/${result.sourceName}: ${result.error}`;

        if (result.required) {
          errors.push(message);
        } else {
          warnings.push(message);
        }
      }

      if (
        result.required &&
        result.ok &&
        result.recordCount === 0 &&
        this.policy.includeEmptyRequiredStages
      ) {
        warnings.push(
          `${result.stageId}/${result.sourceName}: no records returned.`,
        );
      }
    }

    let records =
      sourceResults.flatMap((result) => result.records);

    if (this.policy.deduplicateByRecordId) {
      records = deduplicateRecords(records);
    }

    if (this.policy.sortByStageOrder) {
      records = sortRecords(records);
    }

    const snapshot: InstitutionalLifecycleSnapshot =
      Object.freeze({
        snapshotId:
          request.snapshotId ??
          createSnapshotId(context, generatedAt),
        subjectId: context.subjectId,
        organizationId: context.organizationId,
        governanceEntityId: context.governanceEntityId,
        routeId: context.routeId,
        targetRecordId: context.targetRecordId,
        records: Object.freeze(records),
        generatedAt,
      });

    const requiredSourceFailure =
      sourceResults.some(
        (result) => result.required && !result.ok,
      );

    if (
      requiredSourceFailure &&
      this.policy.failOnRequiredSourceError
    ) {
      throw new MissionControlSnapshotResolutionError(
        "One or more required Mission Control sources failed.",
        sourceResults,
      );
    }

    return Object.freeze({
      snapshot,
      sourceResults: Object.freeze(sourceResults),
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors),
      complete: errors.length === 0,
      generatedAt,
      createsInstitutionalEffect: false,
      mutatesHistoricalRecord: false,
    });
  }
}

export class MissionControlSnapshotResolutionError extends Error {
  readonly sourceResults:
    readonly MissionControlSnapshotSourceResult[];

  constructor(
    message: string,
    sourceResults:
      readonly MissionControlSnapshotSourceResult[],
  ) {
    super(message);
    this.name =
      "MissionControlSnapshotResolutionError";
    this.sourceResults = sourceResults;
  }
}

/* ========================================================================== *
 * Source resolution
 * ========================================================================== */

async function resolveSource(
  source: MissionControlStageSource,
  context: MissionControlSubjectContext,
  resolvedAt: string,
  policy: MissionControlSnapshotPolicy,
): Promise<MissionControlSnapshotSourceResult> {
  try {
    const rawRecords =
      await source.listRecords(context);

    let records =
      rawRecords.map((record) =>
        normalizeSourceRecord(
          source.stageId,
          record,
          context,
        ),
      );

    if (
      policy.maximumRecordsPerStage !== undefined &&
      records.length > policy.maximumRecordsPerStage
    ) {
      records =
        [...records]
          .sort(compareRecordRecency)
          .slice(0, policy.maximumRecordsPerStage);
    }

    if (policy.sortRecordsByUpdatedAt) {
      records = [...records].sort(compareRecordRecency);
    }

    return Object.freeze({
      stageId: source.stageId,
      sourceName: source.sourceName,
      required: source.required,
      ok: true,
      recordCount: records.length,
      records: Object.freeze(records),
      resolvedAt,
    });
  } catch (error) {
    return Object.freeze({
      stageId: source.stageId,
      sourceName: source.sourceName,
      required: source.required,
      ok: false,
      recordCount: 0,
      records: Object.freeze([]),
      error:
        error instanceof Error
          ? error.message
          : "Unknown source resolution error.",
      resolvedAt,
    });
  }
}

function normalizeSourceRecord(
  stageId: InstitutionalStageId,
  record: MissionControlSourceRecord,
  context: MissionControlSubjectContext,
): InstitutionalStageRecordRef {
  return Object.freeze({
    stageId,
    recordId: record.recordId,
    recordType: record.recordType,
    recordVersion: record.version,
    integrityHash: record.integrityHash,
    state: record.state,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    completedAt: record.completedAt,
    ownerSubjectId:
      record.ownerSubjectId ?? context.subjectId,
    organizationId:
      record.organizationId ?? context.organizationId,
    routeId:
      record.routeId ?? context.routeId,
    correlationId:
      record.correlationId ?? context.correlationId,
    limitations:
      record.limitations
        ? Object.freeze([...record.limitations])
        : undefined,
  });
}

/* ========================================================================== *
 * Source filtering and record normalization
 * ========================================================================== */

function filterSources(
  sources: readonly MissionControlStageSource[],
  request: MissionControlSnapshotRequest,
): readonly MissionControlStageSource[] {
  const include =
    request.includeStageIds
      ? new Set(request.includeStageIds)
      : null;

  const exclude =
    new Set(request.excludeStageIds ?? []);

  return sources.filter((source) => {
    if (include && !include.has(source.stageId)) {
      return false;
    }

    return !exclude.has(source.stageId);
  });
}

function deduplicateRecords(
  records: readonly InstitutionalStageRecordRef[],
): InstitutionalStageRecordRef[] {
  const byKey =
    new Map<string, InstitutionalStageRecordRef>();

  for (const record of records) {
    const key = `${record.stageId}:${record.recordId}`;
    const current = byKey.get(key);

    if (!current) {
      byKey.set(key, record);
      continue;
    }

    if (
      compareRecordRecency(record, current) < 0
    ) {
      byKey.set(key, record);
    }
  }

  return Array.from(byKey.values());
}

function sortRecords(
  records: readonly InstitutionalStageRecordRef[],
): InstitutionalStageRecordRef[] {
  return [...records].sort((a, b) => {
    const stageDifference =
      STAGE_ORDER[a.stageId] -
      STAGE_ORDER[b.stageId];

    if (stageDifference !== 0) {
      return stageDifference;
    }

    return compareRecordRecency(a, b);
  });
}

function compareRecordRecency(
  a: InstitutionalStageRecordRef,
  b: InstitutionalStageRecordRef,
): number {
  const aTime =
    Date.parse(
      a.updatedAt ??
      a.completedAt ??
      a.createdAt ??
      "1970-01-01T00:00:00Z",
    );

  const bTime =
    Date.parse(
      b.updatedAt ??
      b.completedAt ??
      b.createdAt ??
      "1970-01-01T00:00:00Z",
    );

  return bTime - aTime;
}

function createSnapshotId(
  context: MissionControlSubjectContext,
  generatedAt: string,
): string {
  const stamp =
    generatedAt
      .replace(/[^0-9]/g, "")
      .slice(0, 17);

  return (
    `TA14-MC-SNAPSHOT-${context.subjectId}-${stamp}`
  );
}

/* ========================================================================== *
 * Provider composition
 * ========================================================================== */

export interface MissionControlStageLoader {
  readonly stageId: InstitutionalStageId;
  readonly sourceName: string;
  readonly required?: boolean;

  load(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlSourceRecord[]>;
}

export interface CompositeMissionControlProviderOptions {
  readonly providerId?: string;
  readonly providerVersion?: string;
  readonly contextResolver?: (
    input: MissionControlSnapshotRequest,
  ) => Promise<MissionControlSubjectContext>;
  readonly loaders:
    readonly MissionControlStageLoader[];
}

export class CompositeMissionControlSnapshotProvider
implements MissionControlSnapshotProvider {
  readonly providerId: string;
  readonly providerVersion: string;

  private readonly loaders:
    readonly MissionControlStageLoader[];

  private readonly contextResolver:
    (
      input: MissionControlSnapshotRequest,
    ) => Promise<MissionControlSubjectContext>;

  constructor(
    options: CompositeMissionControlProviderOptions,
  ) {
    this.providerId =
      options.providerId ??
      "TA14-MC-COMPOSITE-PROVIDER-000001";

    this.providerVersion =
      options.providerVersion ?? "1.0.0";

    this.loaders =
      Object.freeze([...options.loaders]);

    this.contextResolver =
      options.contextResolver ??
      defaultContextResolver;
  }

  async getSubjectContext(
    input: MissionControlSnapshotRequest,
  ): Promise<MissionControlSubjectContext> {
    return this.contextResolver(input);
  }

  async getStageSources(
    _context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlStageSource[]> {
    return Object.freeze(
      this.loaders.map((loader) =>
        Object.freeze({
          stageId: loader.stageId,
          sourceName: loader.sourceName,
          required: loader.required ?? false,
          listRecords: (
            context: MissionControlSubjectContext,
          ) => loader.load(context),
        }),
      ),
    );
  }
}

async function defaultContextResolver(
  input: MissionControlSnapshotRequest,
): Promise<MissionControlSubjectContext> {
  return Object.freeze({
    subjectId: input.subjectId,
    organizationId: input.organizationId,
    governanceEntityId:
      input.governanceEntityId,
    routeId: input.routeId,
    targetRecordId: input.targetRecordId,
    correlationId: input.correlationId,
  });
}

/* ========================================================================== *
 * In-memory provider
 * ========================================================================== */

export interface InMemoryMissionControlStageData {
  readonly stageId: InstitutionalStageId;
  readonly sourceName?: string;
  readonly required?: boolean;
  readonly records:
    readonly MissionControlSourceRecord[];
}

export class InMemoryMissionControlSnapshotProvider
implements MissionControlSnapshotProvider {
  readonly providerId =
    "TA14-MC-INMEMORY-PROVIDER-000001";

  readonly providerVersion = "1.0.0";

  private readonly data:
    readonly InMemoryMissionControlStageData[];

  constructor(
    data:
      readonly InMemoryMissionControlStageData[],
  ) {
    this.data =
      Object.freeze(
        data.map((item) =>
          Object.freeze({
            ...item,
            records:
              Object.freeze([...item.records]),
          }),
        ),
      );
  }

  async getSubjectContext(
    input: MissionControlSnapshotRequest,
  ): Promise<MissionControlSubjectContext> {
    return defaultContextResolver(input);
  }

  async getStageSources(
    _context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlStageSource[]> {
    return Object.freeze(
      this.data.map((item) =>
        Object.freeze({
          stageId: item.stageId,
          sourceName:
            item.sourceName ??
            `in-memory:${item.stageId}`,
          required: item.required ?? false,
          listRecords: async () => item.records,
        }),
      ),
    );
  }
}

/* ========================================================================== *
 * Canonical loader factory
 * ========================================================================== */

export interface CanonicalMissionControlLoaders {
  readonly reality?: MissionControlStageLoader["load"];
  readonly record?: MissionControlStageLoader["load"];
  readonly context?: MissionControlStageLoader["load"];
  readonly relationship?: MissionControlStageLoader["load"];
  readonly lesson?: MissionControlStageLoader["load"];
  readonly simulation?: MissionControlStageLoader["load"];
  readonly assessment?: MissionControlStageLoader["load"];
  readonly credential?: MissionControlStageLoader["load"];
  readonly authorityReview?: MissionControlStageLoader["load"];
  readonly authority?: MissionControlStageLoader["load"];
  readonly assignment?: MissionControlStageLoader["load"];
  readonly governedWork?: MissionControlStageLoader["load"];
  readonly finding?: MissionControlStageLoader["load"];
  readonly determination?: MissionControlStageLoader["load"];
  readonly registryReview?: MissionControlStageLoader["load"];
  readonly registryPublication?: MissionControlStageLoader["load"];
  readonly executionArtifact?: MissionControlStageLoader["load"];
  readonly execution?: MissionControlStageLoader["load"];
  readonly outcome?: MissionControlStageLoader["load"];
  readonly continuity?: MissionControlStageLoader["load"];
  readonly revalidation?: MissionControlStageLoader["load"];
  readonly governanceCycle?: MissionControlStageLoader["load"];
  readonly institutionalEvolution?: MissionControlStageLoader["load"];
  readonly institutionalMemory?: MissionControlStageLoader["load"];
  readonly institutionalKnowledge?: MissionControlStageLoader["load"];
  readonly institutionalIntelligence?: MissionControlStageLoader["load"];
  readonly institutionalStrategy?: MissionControlStageLoader["load"];
  readonly institutionalStewardship?: MissionControlStageLoader["load"];
  readonly institutionalAssurance?: MissionControlStageLoader["load"];
  readonly institutionalOversight?: MissionControlStageLoader["load"];
  readonly institutionalAccountability?: MissionControlStageLoader["load"];
  readonly institutionalTransparency?: MissionControlStageLoader["load"];
  readonly institutionalTrust?: MissionControlStageLoader["load"];
  readonly institutionalLegitimacy?: MissionControlStageLoader["load"];
  readonly institutionalContinuityGovernance?:
    MissionControlStageLoader["load"];
  readonly institutionalResilience?: MissionControlStageLoader["load"];
  readonly institutionalSustainability?: MissionControlStageLoader["load"];
}

export function createCanonicalMissionControlLoaders(
  loaders: CanonicalMissionControlLoaders,
): readonly MissionControlStageLoader[] {
  const values:
    MissionControlStageLoader[] = [];

  addLoader(values, "reality", "reality", loaders.reality);
  addLoader(values, "record", "records", loaders.record);
  addLoader(values, "context", "contexts", loaders.context);
  addLoader(
    values,
    "relationship",
    "relationships",
    loaders.relationship,
  );
  addLoader(values, "lesson", "lessons", loaders.lesson);
  addLoader(
    values,
    "simulation",
    "simulations",
    loaders.simulation,
  );
  addLoader(
    values,
    "assessment",
    "assessments",
    loaders.assessment,
  );
  addLoader(
    values,
    "credential",
    "credentials",
    loaders.credential,
  );
  addLoader(
    values,
    "authority_review",
    "authority-reviews",
    loaders.authorityReview,
  );
  addLoader(
    values,
    "authority",
    "authority-grants",
    loaders.authority,
  );
  addLoader(
    values,
    "assignment",
    "assignments",
    loaders.assignment,
  );
  addLoader(
    values,
    "governed_work",
    "governed-work",
    loaders.governedWork,
  );
  addLoader(
    values,
    "finding",
    "findings",
    loaders.finding,
  );
  addLoader(
    values,
    "determination",
    "determinations",
    loaders.determination,
  );
  addLoader(
    values,
    "registry_review",
    "registry-reviews",
    loaders.registryReview,
  );
  addLoader(
    values,
    "registry_publication",
    "registry-publications",
    loaders.registryPublication,
  );
  addLoader(
    values,
    "execution_artifact",
    "execution-artifacts",
    loaders.executionArtifact,
  );
  addLoader(
    values,
    "execution",
    "executions",
    loaders.execution,
  );
  addLoader(
    values,
    "outcome",
    "outcomes",
    loaders.outcome,
  );
  addLoader(
    values,
    "continuity",
    "continuity",
    loaders.continuity,
  );
  addLoader(
    values,
    "revalidation",
    "revalidations",
    loaders.revalidation,
  );
  addLoader(
    values,
    "governance_cycle",
    "governance-cycles",
    loaders.governanceCycle,
  );
  addLoader(
    values,
    "institutional_evolution",
    "institutional-evolution",
    loaders.institutionalEvolution,
  );
  addLoader(
    values,
    "institutional_memory",
    "institutional-memory",
    loaders.institutionalMemory,
  );
  addLoader(
    values,
    "institutional_knowledge",
    "institutional-knowledge",
    loaders.institutionalKnowledge,
  );
  addLoader(
    values,
    "institutional_intelligence",
    "institutional-intelligence",
    loaders.institutionalIntelligence,
  );
  addLoader(
    values,
    "institutional_strategy",
    "institutional-strategy",
    loaders.institutionalStrategy,
  );
  addLoader(
    values,
    "institutional_stewardship",
    "institutional-stewardship",
    loaders.institutionalStewardship,
  );
  addLoader(
    values,
    "institutional_assurance",
    "institutional-assurance",
    loaders.institutionalAssurance,
  );
  addLoader(
    values,
    "institutional_oversight",
    "institutional-oversight",
    loaders.institutionalOversight,
  );
  addLoader(
    values,
    "institutional_accountability",
    "institutional-accountability",
    loaders.institutionalAccountability,
  );
  addLoader(
    values,
    "institutional_transparency",
    "institutional-transparency",
    loaders.institutionalTransparency,
  );
  addLoader(
    values,
    "institutional_trust",
    "institutional-trust",
    loaders.institutionalTrust,
  );
  addLoader(
    values,
    "institutional_legitimacy",
    "institutional-legitimacy",
    loaders.institutionalLegitimacy,
  );
  addLoader(
    values,
    "institutional_continuity_governance",
    "institutional-continuity-governance",
    loaders.institutionalContinuityGovernance,
  );
  addLoader(
    values,
    "institutional_resilience",
    "institutional-resilience",
    loaders.institutionalResilience,
  );
  addLoader(
    values,
    "institutional_sustainability",
    "institutional-sustainability",
    loaders.institutionalSustainability,
  );

  return Object.freeze(values);
}

function addLoader(
  target: MissionControlStageLoader[],
  stageId: InstitutionalStageId,
  sourceName: string,
  load:
    MissionControlStageLoader["load"] | undefined,
): void {
  if (!load) {
    return;
  }

  target.push(
    Object.freeze({
      stageId,
      sourceName,
      load,
    }),
  );
}

/* ========================================================================== *
 * Demonstration provider
 * ========================================================================== */

export function createMissionControlSnapshotDemonstrationProvider(
  now = "2026-08-05T13:20:00.000Z",
): InMemoryMissionControlSnapshotProvider {
  return new InMemoryMissionControlSnapshotProvider([
    {
      stageId: "credential",
      records: [
        {
          recordId: "TA14-CREDENTIAL-DEMO-000001",
          recordType: "credential",
          version: "1.0.0",
          state: "active",
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
    {
      stageId: "authority",
      records: [
        {
          recordId: "TA14-AUTHORITY-DEMO-000001",
          recordType: "authority_grant",
          version: "1.0.0",
          state: "active",
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
    {
      stageId: "assignment",
      records: [
        {
          recordId: "TA14-ASSIGNMENT-DEMO-000001",
          recordType: "assignment",
          version: "1.0.0",
          state: "active",
          createdAt: now,
          updatedAt: now,
          limitations: [
            "Evidence package review remains open.",
          ],
        },
      ],
    },
  ]);
}

/* ========================================================================== *
 * Validation and self-check
 * ========================================================================== */

export interface MissionControlSnapshotValidationIssue {
  readonly code:
    | "missing_snapshot_id"
    | "missing_subject_id"
    | "missing_generated_at"
    | "duplicate_stage_record"
    | "invalid_stage_order"
    | "historical_mutation_enabled"
    | "institutional_effect_enabled";
  readonly message: string;
  readonly severity: "error" | "warning";
}

export interface MissionControlSnapshotValidationResult {
  readonly ok: boolean;
  readonly issues:
    readonly MissionControlSnapshotValidationIssue[];
}

export function validateMissionControlSnapshotResolution(
  value: MissionControlSnapshotResolution,
): MissionControlSnapshotValidationResult {
  const issues:
    MissionControlSnapshotValidationIssue[] = [];

  if (!value.snapshot.snapshotId.trim()) {
    issues.push({
      code: "missing_snapshot_id",
      message: "Mission Control snapshot requires a snapshot id.",
      severity: "error",
    });
  }

  if (!value.snapshot.subjectId?.trim()) {
    issues.push({
      code: "missing_subject_id",
      message: "Mission Control snapshot requires a subject id.",
      severity: "error",
    });
  }

  if (!value.snapshot.generatedAt.trim()) {
    issues.push({
      code: "missing_generated_at",
      message: "Mission Control snapshot requires a generated timestamp.",
      severity: "error",
    });
  }

  const keys = new Set<string>();
  let priorOrder = 0;

  for (const record of value.snapshot.records) {
    const key =
      `${record.stageId}:${record.recordId}`;

    if (keys.has(key)) {
      issues.push({
        code: "duplicate_stage_record",
        message:
          `Duplicate snapshot record ${key}.`,
        severity: "error",
      });
    }

    keys.add(key);

    const order = STAGE_ORDER[record.stageId];

    if (order < priorOrder) {
      issues.push({
        code: "invalid_stage_order",
        message:
          `Stage ${record.stageId} is out of canonical order.`,
        severity: "warning",
      });
    }

    priorOrder = Math.max(priorOrder, order);
  }

  if (value.mutatesHistoricalRecord) {
    issues.push({
      code: "historical_mutation_enabled",
      message:
        "Mission Control snapshot resolution cannot mutate historical records.",
      severity: "error",
    });
  }

  if (value.createsInstitutionalEffect) {
    issues.push({
      code: "institutional_effect_enabled",
      message:
        "Mission Control snapshot resolution cannot create institutional effects.",
      severity: "error",
    });
  }

  return Object.freeze({
    ok:
      !issues.some(
        (issue) =>
          issue.severity === "error",
      ),
    issues: Object.freeze(issues),
  });
}

export interface MissionControlSnapshotSelfCheck {
  readonly ok: boolean;
  readonly resolverId:
    typeof TA14_MISSION_CONTROL_SNAPSHOT_ID;
  readonly resolverVersion:
    typeof TA14_MISSION_CONTROL_SNAPSHOT_VERSION;
  readonly recordCount: number;
  readonly sourceCount: number;
  readonly complete: boolean;
  readonly createsInstitutionalEffect: false;
  readonly mutatesHistoricalRecord: false;
  readonly issues:
    readonly MissionControlSnapshotValidationIssue[];
}

export async function runMissionControlSnapshotSelfCheck():
Promise<MissionControlSnapshotSelfCheck> {
  const provider =
    createMissionControlSnapshotDemonstrationProvider();

  const resolver =
    new MissionControlSnapshotResolver(provider);

  const resolution =
    await resolver.resolve({
      subjectId: "TA14-SUBJECT-DEMO-000001",
      generatedAt:
        "2026-08-05T13:20:00.000Z",
    });

  const validation =
    validateMissionControlSnapshotResolution(
      resolution,
    );

  return Object.freeze({
    ok: validation.ok,
    resolverId:
      TA14_MISSION_CONTROL_SNAPSHOT_ID,
    resolverVersion:
      TA14_MISSION_CONTROL_SNAPSHOT_VERSION,
    recordCount:
      resolution.snapshot.records.length,
    sourceCount:
      resolution.sourceResults.length,
    complete:
      resolution.complete,
    createsInstitutionalEffect: false,
    mutatesHistoricalRecord: false,
    issues: validation.issues,
  });
}

/* ========================================================================== *
 * Default export
 * ========================================================================== */

const missionControlSnapshot = Object.freeze({
  resolverId:
    TA14_MISSION_CONTROL_SNAPSHOT_ID,
  resolverVersion:
    TA14_MISSION_CONTROL_SNAPSHOT_VERSION,
  boundary:
    TA14_MISSION_CONTROL_SNAPSHOT_BOUNDARY,

  defaultPolicy:
    DEFAULT_MISSION_CONTROL_SNAPSHOT_POLICY,

  MissionControlSnapshotResolver,
  CompositeMissionControlSnapshotProvider,
  InMemoryMissionControlSnapshotProvider,

  createCanonicalMissionControlLoaders,
  createMissionControlSnapshotDemonstrationProvider,

  validateMissionControlSnapshotResolution,
  runMissionControlSnapshotSelfCheck,
});

export default missionControlSnapshot;
