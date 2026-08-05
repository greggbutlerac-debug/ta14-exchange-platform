/**
 * TA-14 Authority Governance Institution
 * MCL-001 — Mission Control Live Resolver
 *
 * CREATE:
 *   apps/web/lib/academy/mission-control-live-resolver.ts
 *
 * Purpose:
 *   Connect application-backed institutional data sources to the
 *   Mission Control Snapshot Resolver.
 *
 * Boundary:
 *   This module reads and maps live institutional data. It does not create
 *   credentials, authority, assignments, findings, determinations, Registry
 *   publications, execution artifacts, executions, outcomes, continuity
 *   records, or revalidation decisions.
 */

import {
  CompositeMissionControlSnapshotProvider,
  MissionControlSnapshotResolver,
  createCanonicalMissionControlLoaders,
  type CanonicalMissionControlLoaders,
  type MissionControlSnapshotPolicy,
  type MissionControlSnapshotRequest,
  type MissionControlSnapshotResolution,
  type MissionControlSourceRecord,
  type MissionControlSubjectContext,
} from "./mission-control-snapshot";

export const TA14_MISSION_CONTROL_LIVE_RESOLVER_ID =
  "TA14-MCL-LIVE-RESOLVER-000001" as const;

export const TA14_MISSION_CONTROL_LIVE_RESOLVER_VERSION =
  "1.0.0" as const;

export const TA14_MISSION_CONTROL_LIVE_RESOLVER_BOUNDARY =
  "Mission Control live resolution reads and maps institutional data into lifecycle snapshots without creating or mutating institutional effects." as const;

/* ========================================================================== *
 * Live data contracts
 * ========================================================================== */

export interface MissionControlLiveIdentity {
  readonly subjectId: string;
  readonly email?: string;
  readonly displayName?: string;
  readonly organizationId?: string;
  readonly governanceEntityId?: string;
  readonly active: boolean;
}

export interface MissionControlLiveRecord {
  readonly id: string;
  readonly type?: string;
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

export interface MissionControlLiveRepository {
  getIdentity(
    subjectId: string,
  ): Promise<MissionControlLiveIdentity | null>;

  listRealityRecords(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listGovernedRecords(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listContexts(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listRelationships(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listLessons(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listSimulations(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listAssessments(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listCredentials(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listAuthorityReviews(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listAuthorityGrants(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listAssignments(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listGovernedWork(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listFindings(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listDeterminations(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listRegistryReviews(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listRegistryPublications(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listExecutionArtifacts(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listExecutions(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listOutcomes(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listContinuityRecords(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listRevalidations(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listGovernanceCycles(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalEvolution(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalMemory(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalKnowledge(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalIntelligence(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalStrategy(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalStewardship(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalAssurance(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalOversight(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalAccountability(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalTransparency(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalTrust(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalLegitimacy(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalContinuityGovernance(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalResilience(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;

  listInstitutionalSustainability(
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]>;
}

/* ========================================================================== *
 * Resolver options
 * ========================================================================== */

export interface MissionControlLiveResolverOptions {
  readonly repository: MissionControlLiveRepository;
  readonly snapshotPolicy?: MissionControlSnapshotPolicy;
  readonly providerId?: string;
  readonly providerVersion?: string;
  readonly requireActiveIdentity?: boolean;
  readonly defaultOrganizationId?: string;
  readonly defaultGovernanceEntityId?: string;
}

export interface MissionControlLiveResolution {
  readonly identity: MissionControlLiveIdentity;
  readonly resolution: MissionControlSnapshotResolution;
  readonly resolvedAt: string;
  readonly createsInstitutionalEffect: false;
  readonly mutatesHistoricalRecord: false;
}

/* ========================================================================== *
 * Live resolver
 * ========================================================================== */

export class MissionControlLiveResolver {
  private readonly repository: MissionControlLiveRepository;
  private readonly snapshotPolicy?: MissionControlSnapshotPolicy;
  private readonly providerId: string;
  private readonly providerVersion: string;
  private readonly requireActiveIdentity: boolean;
  private readonly defaultOrganizationId?: string;
  private readonly defaultGovernanceEntityId?: string;

  constructor(
    options: MissionControlLiveResolverOptions,
  ) {
    this.repository = options.repository;
    this.snapshotPolicy = options.snapshotPolicy;
    this.providerId =
      options.providerId ??
      "TA14-MC-LIVE-PROVIDER-000001";
    this.providerVersion =
      options.providerVersion ?? "1.0.0";
    this.requireActiveIdentity =
      options.requireActiveIdentity ?? true;
    this.defaultOrganizationId =
      options.defaultOrganizationId;
    this.defaultGovernanceEntityId =
      options.defaultGovernanceEntityId;
  }

  async resolve(
    request: MissionControlSnapshotRequest,
  ): Promise<MissionControlLiveResolution> {
    const identity =
      await this.repository.getIdentity(
        request.subjectId,
      );

    if (!identity) {
      throw new MissionControlLiveResolverError(
        "Mission Control identity was not found.",
        "identity_not_found",
      );
    }

    if (
      this.requireActiveIdentity &&
      !identity.active
    ) {
      throw new MissionControlLiveResolverError(
        "Mission Control identity is inactive.",
        "identity_inactive",
      );
    }

    const provider =
      new CompositeMissionControlSnapshotProvider({
        providerId: this.providerId,
        providerVersion: this.providerVersion,
        contextResolver: async (input) =>
          Object.freeze({
            subjectId: identity.subjectId,
            organizationId:
              input.organizationId ??
              identity.organizationId ??
              this.defaultOrganizationId,
            governanceEntityId:
              input.governanceEntityId ??
              identity.governanceEntityId ??
              this.defaultGovernanceEntityId,
            routeId: input.routeId,
            targetRecordId: input.targetRecordId,
            correlationId: input.correlationId,
          }),
        loaders:
          createCanonicalMissionControlLoaders(
            createRepositoryLoaders(
              this.repository,
            ),
          ),
      });

    const snapshotResolver =
      new MissionControlSnapshotResolver(
        provider,
        this.snapshotPolicy,
      );

    const resolution =
      await snapshotResolver.resolve(request);

    return Object.freeze({
      identity,
      resolution,
      resolvedAt:
        resolution.generatedAt,
      createsInstitutionalEffect: false,
      mutatesHistoricalRecord: false,
    });
  }
}

export type MissionControlLiveResolverErrorCode =
  | "identity_not_found"
  | "identity_inactive"
  | "repository_error"
  | "resolution_error";

export class MissionControlLiveResolverError extends Error {
  readonly code: MissionControlLiveResolverErrorCode;

  constructor(
    message: string,
    code: MissionControlLiveResolverErrorCode,
  ) {
    super(message);
    this.name =
      "MissionControlLiveResolverError";
    this.code = code;
  }
}

/* ========================================================================== *
 * Repository loader mapping
 * ========================================================================== */

function createRepositoryLoaders(
  repository: MissionControlLiveRepository,
): CanonicalMissionControlLoaders {
  return {
    reality: createLoader(
      repository.listRealityRecords.bind(repository),
    ),
    record: createLoader(
      repository.listGovernedRecords.bind(repository),
    ),
    context: createLoader(
      repository.listContexts.bind(repository),
    ),
    relationship: createLoader(
      repository.listRelationships.bind(repository),
    ),
    lesson: createLoader(
      repository.listLessons.bind(repository),
    ),
    simulation: createLoader(
      repository.listSimulations.bind(repository),
    ),
    assessment: createLoader(
      repository.listAssessments.bind(repository),
    ),
    credential: createLoader(
      repository.listCredentials.bind(repository),
    ),
    authorityReview: createLoader(
      repository.listAuthorityReviews.bind(repository),
    ),
    authority: createLoader(
      repository.listAuthorityGrants.bind(repository),
    ),
    assignment: createLoader(
      repository.listAssignments.bind(repository),
    ),
    governedWork: createLoader(
      repository.listGovernedWork.bind(repository),
    ),
    finding: createLoader(
      repository.listFindings.bind(repository),
    ),
    determination: createLoader(
      repository.listDeterminations.bind(repository),
    ),
    registryReview: createLoader(
      repository.listRegistryReviews.bind(repository),
    ),
    registryPublication: createLoader(
      repository.listRegistryPublications.bind(repository),
    ),
    executionArtifact: createLoader(
      repository.listExecutionArtifacts.bind(repository),
    ),
    execution: createLoader(
      repository.listExecutions.bind(repository),
    ),
    outcome: createLoader(
      repository.listOutcomes.bind(repository),
    ),
    continuity: createLoader(
      repository.listContinuityRecords.bind(repository),
    ),
    revalidation: createLoader(
      repository.listRevalidations.bind(repository),
    ),
    governanceCycle: createLoader(
      repository.listGovernanceCycles.bind(repository),
    ),
    institutionalEvolution: createLoader(
      repository.listInstitutionalEvolution.bind(repository),
    ),
    institutionalMemory: createLoader(
      repository.listInstitutionalMemory.bind(repository),
    ),
    institutionalKnowledge: createLoader(
      repository.listInstitutionalKnowledge.bind(repository),
    ),
    institutionalIntelligence: createLoader(
      repository.listInstitutionalIntelligence.bind(repository),
    ),
    institutionalStrategy: createLoader(
      repository.listInstitutionalStrategy.bind(repository),
    ),
    institutionalStewardship: createLoader(
      repository.listInstitutionalStewardship.bind(repository),
    ),
    institutionalAssurance: createLoader(
      repository.listInstitutionalAssurance.bind(repository),
    ),
    institutionalOversight: createLoader(
      repository.listInstitutionalOversight.bind(repository),
    ),
    institutionalAccountability: createLoader(
      repository.listInstitutionalAccountability.bind(repository),
    ),
    institutionalTransparency: createLoader(
      repository.listInstitutionalTransparency.bind(repository),
    ),
    institutionalTrust: createLoader(
      repository.listInstitutionalTrust.bind(repository),
    ),
    institutionalLegitimacy: createLoader(
      repository.listInstitutionalLegitimacy.bind(repository),
    ),
    institutionalContinuityGovernance: createLoader(
      repository.listInstitutionalContinuityGovernance.bind(repository),
    ),
    institutionalResilience: createLoader(
      repository.listInstitutionalResilience.bind(repository),
    ),
    institutionalSustainability: createLoader(
      repository.listInstitutionalSustainability.bind(repository),
    ),
  };
}

function createLoader(
  load: (
    context: MissionControlSubjectContext,
  ) => Promise<readonly MissionControlLiveRecord[]>,
): (
  context: MissionControlSubjectContext,
) => Promise<readonly MissionControlSourceRecord[]> {
  return async (context) => {
    try {
      const records = await load(context);
      return Object.freeze(
        records.map(mapLiveRecord),
      );
    } catch (error) {
      throw new MissionControlLiveResolverError(
        error instanceof Error
          ? error.message
          : "Unknown repository error.",
        "repository_error",
      );
    }
  };
}

function mapLiveRecord(
  record: MissionControlLiveRecord,
): MissionControlSourceRecord {
  return Object.freeze({
    recordId: record.id,
    recordType: record.type,
    version: record.version,
    state: record.state,
    integrityHash: record.integrityHash,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    completedAt: record.completedAt,
    ownerSubjectId: record.ownerSubjectId,
    organizationId: record.organizationId,
    routeId: record.routeId,
    correlationId: record.correlationId,
    limitations:
      record.limitations
        ? Object.freeze([...record.limitations])
        : undefined,
  });
}

/* ========================================================================== *
 * In-memory repository for testing and initial integration
 * ========================================================================== */

export interface InMemoryMissionControlLiveData {
  readonly identities:
    readonly MissionControlLiveIdentity[];
  readonly records:
    Partial<
      Readonly<
        Record<
          keyof MissionControlLiveRecordBuckets,
          readonly MissionControlLiveRecord[]
        >
      >
    >;
}

interface MissionControlLiveRecordBuckets {
  readonly reality: readonly MissionControlLiveRecord[];
  readonly governedRecords: readonly MissionControlLiveRecord[];
  readonly contexts: readonly MissionControlLiveRecord[];
  readonly relationships: readonly MissionControlLiveRecord[];
  readonly lessons: readonly MissionControlLiveRecord[];
  readonly simulations: readonly MissionControlLiveRecord[];
  readonly assessments: readonly MissionControlLiveRecord[];
  readonly credentials: readonly MissionControlLiveRecord[];
  readonly authorityReviews: readonly MissionControlLiveRecord[];
  readonly authorityGrants: readonly MissionControlLiveRecord[];
  readonly assignments: readonly MissionControlLiveRecord[];
  readonly governedWork: readonly MissionControlLiveRecord[];
  readonly findings: readonly MissionControlLiveRecord[];
  readonly determinations: readonly MissionControlLiveRecord[];
  readonly registryReviews: readonly MissionControlLiveRecord[];
  readonly registryPublications: readonly MissionControlLiveRecord[];
  readonly executionArtifacts: readonly MissionControlLiveRecord[];
  readonly executions: readonly MissionControlLiveRecord[];
  readonly outcomes: readonly MissionControlLiveRecord[];
  readonly continuity: readonly MissionControlLiveRecord[];
  readonly revalidations: readonly MissionControlLiveRecord[];
  readonly governanceCycles: readonly MissionControlLiveRecord[];
  readonly institutionalEvolution: readonly MissionControlLiveRecord[];
  readonly institutionalMemory: readonly MissionControlLiveRecord[];
  readonly institutionalKnowledge: readonly MissionControlLiveRecord[];
  readonly institutionalIntelligence: readonly MissionControlLiveRecord[];
  readonly institutionalStrategy: readonly MissionControlLiveRecord[];
  readonly institutionalStewardship: readonly MissionControlLiveRecord[];
  readonly institutionalAssurance: readonly MissionControlLiveRecord[];
  readonly institutionalOversight: readonly MissionControlLiveRecord[];
  readonly institutionalAccountability: readonly MissionControlLiveRecord[];
  readonly institutionalTransparency: readonly MissionControlLiveRecord[];
  readonly institutionalTrust: readonly MissionControlLiveRecord[];
  readonly institutionalLegitimacy: readonly MissionControlLiveRecord[];
  readonly institutionalContinuityGovernance:
    readonly MissionControlLiveRecord[];
  readonly institutionalResilience: readonly MissionControlLiveRecord[];
  readonly institutionalSustainability: readonly MissionControlLiveRecord[];
}

export class InMemoryMissionControlLiveRepository
implements MissionControlLiveRepository {
  private readonly identities:
    ReadonlyMap<string, MissionControlLiveIdentity>;

  private readonly records:
    InMemoryMissionControlLiveData["records"];

  constructor(
    data: InMemoryMissionControlLiveData,
  ) {
    this.identities = new Map(
      data.identities.map((identity) => [
        identity.subjectId,
        Object.freeze(identity),
      ]),
    );

    this.records = Object.freeze({
      ...data.records,
    });
  }

  async getIdentity(
    subjectId: string,
  ): Promise<MissionControlLiveIdentity | null> {
    return this.identities.get(subjectId) ?? null;
  }

  async listRealityRecords(
    context: MissionControlSubjectContext,
  ) {
    return this.select("reality", context);
  }

  async listGovernedRecords(
    context: MissionControlSubjectContext,
  ) {
    return this.select("governedRecords", context);
  }

  async listContexts(
    context: MissionControlSubjectContext,
  ) {
    return this.select("contexts", context);
  }

  async listRelationships(
    context: MissionControlSubjectContext,
  ) {
    return this.select("relationships", context);
  }

  async listLessons(
    context: MissionControlSubjectContext,
  ) {
    return this.select("lessons", context);
  }

  async listSimulations(
    context: MissionControlSubjectContext,
  ) {
    return this.select("simulations", context);
  }

  async listAssessments(
    context: MissionControlSubjectContext,
  ) {
    return this.select("assessments", context);
  }

  async listCredentials(
    context: MissionControlSubjectContext,
  ) {
    return this.select("credentials", context);
  }

  async listAuthorityReviews(
    context: MissionControlSubjectContext,
  ) {
    return this.select("authorityReviews", context);
  }

  async listAuthorityGrants(
    context: MissionControlSubjectContext,
  ) {
    return this.select("authorityGrants", context);
  }

  async listAssignments(
    context: MissionControlSubjectContext,
  ) {
    return this.select("assignments", context);
  }

  async listGovernedWork(
    context: MissionControlSubjectContext,
  ) {
    return this.select("governedWork", context);
  }

  async listFindings(
    context: MissionControlSubjectContext,
  ) {
    return this.select("findings", context);
  }

  async listDeterminations(
    context: MissionControlSubjectContext,
  ) {
    return this.select("determinations", context);
  }

  async listRegistryReviews(
    context: MissionControlSubjectContext,
  ) {
    return this.select("registryReviews", context);
  }

  async listRegistryPublications(
    context: MissionControlSubjectContext,
  ) {
    return this.select("registryPublications", context);
  }

  async listExecutionArtifacts(
    context: MissionControlSubjectContext,
  ) {
    return this.select("executionArtifacts", context);
  }

  async listExecutions(
    context: MissionControlSubjectContext,
  ) {
    return this.select("executions", context);
  }

  async listOutcomes(
    context: MissionControlSubjectContext,
  ) {
    return this.select("outcomes", context);
  }

  async listContinuityRecords(
    context: MissionControlSubjectContext,
  ) {
    return this.select("continuity", context);
  }

  async listRevalidations(
    context: MissionControlSubjectContext,
  ) {
    return this.select("revalidations", context);
  }

  async listGovernanceCycles(
    context: MissionControlSubjectContext,
  ) {
    return this.select("governanceCycles", context);
  }

  async listInstitutionalEvolution(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalEvolution", context);
  }

  async listInstitutionalMemory(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalMemory", context);
  }

  async listInstitutionalKnowledge(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalKnowledge", context);
  }

  async listInstitutionalIntelligence(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalIntelligence", context);
  }

  async listInstitutionalStrategy(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalStrategy", context);
  }

  async listInstitutionalStewardship(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalStewardship", context);
  }

  async listInstitutionalAssurance(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalAssurance", context);
  }

  async listInstitutionalOversight(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalOversight", context);
  }

  async listInstitutionalAccountability(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalAccountability", context);
  }

  async listInstitutionalTransparency(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalTransparency", context);
  }

  async listInstitutionalTrust(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalTrust", context);
  }

  async listInstitutionalLegitimacy(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalLegitimacy", context);
  }

  async listInstitutionalContinuityGovernance(
    context: MissionControlSubjectContext,
  ) {
    return this.select(
      "institutionalContinuityGovernance",
      context,
    );
  }

  async listInstitutionalResilience(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalResilience", context);
  }

  async listInstitutionalSustainability(
    context: MissionControlSubjectContext,
  ) {
    return this.select("institutionalSustainability", context);
  }

  private async select(
    bucket: keyof MissionControlLiveRecordBuckets,
    context: MissionControlSubjectContext,
  ): Promise<readonly MissionControlLiveRecord[]> {
    const values = this.records[bucket] ?? [];

    return Object.freeze(
      values.filter((record) => {
        if (
          record.ownerSubjectId &&
          record.ownerSubjectId !== context.subjectId
        ) {
          return false;
        }

        if (
          context.organizationId &&
          record.organizationId &&
          record.organizationId !== context.organizationId
        ) {
          return false;
        }

        if (
          context.routeId &&
          record.routeId &&
          record.routeId !== context.routeId
        ) {
          return false;
        }

        return true;
      }),
    );
  }
}

/* ========================================================================== *
 * Demonstration data and self-check
 * ========================================================================== */

export function createMissionControlLiveDemonstrationRepository(
  now = "2026-08-05T13:30:00.000Z",
): InMemoryMissionControlLiveRepository {
  return new InMemoryMissionControlLiveRepository({
    identities: [
      {
        subjectId: "TA14-SUBJECT-DEMO-000001",
        email: "demo@ta14authority.org",
        displayName: "TA-14 Demonstration Subject",
        organizationId: "TA14-ORG-DEMO-000001",
        governanceEntityId: "TA14-GOV-ENTITY-DEMO-000001",
        active: true,
      },
    ],
    records: {
      credentials: [
        {
          id: "TA14-CREDENTIAL-DEMO-000001",
          type: "credential",
          version: "1.0.0",
          state: "active",
          ownerSubjectId: "TA14-SUBJECT-DEMO-000001",
          organizationId: "TA14-ORG-DEMO-000001",
          createdAt: now,
          updatedAt: now,
        },
      ],
      authorityGrants: [
        {
          id: "TA14-AUTHORITY-DEMO-000001",
          type: "authority_grant",
          version: "1.0.0",
          state: "active",
          ownerSubjectId: "TA14-SUBJECT-DEMO-000001",
          organizationId: "TA14-ORG-DEMO-000001",
          createdAt: now,
          updatedAt: now,
        },
      ],
      assignments: [
        {
          id: "TA14-ASSIGNMENT-DEMO-000001",
          type: "assignment",
          version: "1.0.0",
          state: "active",
          ownerSubjectId: "TA14-SUBJECT-DEMO-000001",
          organizationId: "TA14-ORG-DEMO-000001",
          createdAt: now,
          updatedAt: now,
          limitations: [
            "Evidence package review remains open.",
          ],
        },
      ],
    },
  });
}

export interface MissionControlLiveResolverSelfCheck {
  readonly ok: boolean;
  readonly resolverId: typeof TA14_MISSION_CONTROL_LIVE_RESOLVER_ID;
  readonly resolverVersion:
    typeof TA14_MISSION_CONTROL_LIVE_RESOLVER_VERSION;
  readonly identityResolved: boolean;
  readonly snapshotRecordCount: number;
  readonly sourceCount: number;
  readonly createsInstitutionalEffect: false;
  readonly mutatesHistoricalRecord: false;
  readonly issues: readonly string[];
}

export async function runMissionControlLiveResolverSelfCheck():
Promise<MissionControlLiveResolverSelfCheck> {
  const issues: string[] = [];

  try {
    const repository =
      createMissionControlLiveDemonstrationRepository();

    const resolver =
      new MissionControlLiveResolver({
        repository,
      });

    const result =
      await resolver.resolve({
        subjectId: "TA14-SUBJECT-DEMO-000001",
        generatedAt:
          "2026-08-05T13:30:00.000Z",
      });

    if (
      result.resolution.snapshot.records.length === 0
    ) {
      issues.push(
        "Live resolver returned no institutional records.",
      );
    }

    return Object.freeze({
      ok: issues.length === 0,
      resolverId:
        TA14_MISSION_CONTROL_LIVE_RESOLVER_ID,
      resolverVersion:
        TA14_MISSION_CONTROL_LIVE_RESOLVER_VERSION,
      identityResolved: true,
      snapshotRecordCount:
        result.resolution.snapshot.records.length,
      sourceCount:
        result.resolution.sourceResults.length,
      createsInstitutionalEffect: false,
      mutatesHistoricalRecord: false,
      issues: Object.freeze(issues),
    });
  } catch (error) {
    issues.push(
      error instanceof Error
        ? error.message
        : "Unknown live resolver self-check error.",
    );

    return Object.freeze({
      ok: false,
      resolverId:
        TA14_MISSION_CONTROL_LIVE_RESOLVER_ID,
      resolverVersion:
        TA14_MISSION_CONTROL_LIVE_RESOLVER_VERSION,
      identityResolved: false,
      snapshotRecordCount: 0,
      sourceCount: 0,
      createsInstitutionalEffect: false,
      mutatesHistoricalRecord: false,
      issues: Object.freeze(issues),
    });
  }
}

/* ========================================================================== *
 * Default export
 * ========================================================================== */

const missionControlLiveResolver = Object.freeze({
  resolverId:
    TA14_MISSION_CONTROL_LIVE_RESOLVER_ID,
  resolverVersion:
    TA14_MISSION_CONTROL_LIVE_RESOLVER_VERSION,
  boundary:
    TA14_MISSION_CONTROL_LIVE_RESOLVER_BOUNDARY,

  MissionControlLiveResolver,
  InMemoryMissionControlLiveRepository,

  createMissionControlLiveDemonstrationRepository,
  runMissionControlLiveResolverSelfCheck,
});

export default missionControlLiveResolver;
