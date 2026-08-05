/**
 * TA-14 Authority Governance Institution
 * MCI-001 — Institutional Mission Control Adapter
 *
 * CREATE:
 *   apps/web/lib/academy/mission-control-integration.ts
 *
 * Converts institutional-engine lifecycle snapshots into stable,
 * presentation-ready Mission Control data without creating or mutating
 * institutional effects.
 */

import {
  buildMissionControlSummary,
  getInstitutionalStage,
  listInstitutionalStages,
  resolveLifecycleStatus,
  type InstitutionalActionRecommendation,
  type InstitutionalLifecycleSnapshot,
  type InstitutionalMissionControlSummary,
  type InstitutionalStageId,
  type InstitutionalStageStatus,
} from "./institutional-engine";

export const TA14_MISSION_CONTROL_INTEGRATION_ID =
  "TA14-MCI-INSTITUTIONAL-ADAPTER-000001" as const;

export const TA14_MISSION_CONTROL_INTEGRATION_VERSION =
  "1.0.0" as const;

export const TA14_MISSION_CONTROL_INTEGRATION_BOUNDARY =
  "Mission Control projects institutional state and required actions without creating or mutating institutional effects." as const;

export type MissionControlTone =
  | "neutral"
  | "positive"
  | "attention"
  | "warning"
  | "critical";

export type MissionControlCardKind =
  | "current_stage"
  | "next_stage"
  | "progress"
  | "required_action"
  | "registry"
  | "execution"
  | "outcome"
  | "continuity"
  | "revalidation"
  | "institutional_health";

export interface MissionControlMetric {
  readonly id: string;
  readonly label: string;
  readonly value: number | string;
  readonly detail?: string;
  readonly tone: MissionControlTone;
}

export interface MissionControlAction {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly actionType:
    | "open"
    | "continue"
    | "review"
    | "correct"
    | "escalate"
    | "revalidate"
    | "inspect";
  readonly priority: "routine" | "important" | "urgent" | "critical";
  readonly stageId: InstitutionalStageId;
  readonly recordId?: string;
  readonly href?: string;
}

export interface MissionControlCard {
  readonly id: string;
  readonly kind: MissionControlCardKind;
  readonly title: string;
  readonly eyebrow?: string;
  readonly description: string;
  readonly value?: string | number;
  readonly tone: MissionControlTone;
  readonly stageId?: InstitutionalStageId;
  readonly action?: MissionControlAction;
  readonly metadata: Readonly<Record<string, string | number | boolean>>;
}

export interface MissionControlStageRailItem {
  readonly stageId: InstitutionalStageId;
  readonly order: number;
  readonly title: string;
  readonly shortTitle: string;
  readonly status: InstitutionalStageStatus["status"];
  readonly tone: MissionControlTone;
  readonly current: boolean;
  readonly next: boolean;
  readonly recordId?: string;
  readonly href?: string;
}

export interface MissionControlAlert {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly severity: "informational" | "important" | "urgent" | "critical";
  readonly stageId?: InstitutionalStageId;
  readonly recordId?: string;
  readonly action?: MissionControlAction;
}

export interface MissionControlSection {
  readonly id:
    | "overview"
    | "required_actions"
    | "registry"
    | "execution"
    | "continuity"
    | "institutional_health";
  readonly title: string;
  readonly description: string;
  readonly cards: readonly MissionControlCard[];
}

export interface MissionControlViewModel {
  readonly integrationId: typeof TA14_MISSION_CONTROL_INTEGRATION_ID;
  readonly integrationVersion:
    typeof TA14_MISSION_CONTROL_INTEGRATION_VERSION;
  readonly boundary:
    typeof TA14_MISSION_CONTROL_INTEGRATION_BOUNDARY;
  readonly snapshotId: string;
  readonly generatedAt: string;
  readonly summary: InstitutionalMissionControlSummary;
  readonly metrics: readonly MissionControlMetric[];
  readonly cards: readonly MissionControlCard[];
  readonly sections: readonly MissionControlSection[];
  readonly actions: readonly MissionControlAction[];
  readonly alerts: readonly MissionControlAlert[];
  readonly stageRail: readonly MissionControlStageRailItem[];
  readonly currentStageId?: InstitutionalStageId;
  readonly nextStageId?: InstitutionalStageId;
  readonly hasCriticalAction: boolean;
  readonly hasUrgentAction: boolean;
  readonly hasHeldWork: boolean;
  readonly hasEscalatedWork: boolean;
  readonly hasRevalidationRequirement: boolean;
  readonly createsInstitutionalEffect: false;
  readonly mutatesHistoricalRecord: false;
}

export interface MissionControlRouteMap {
  readonly defaultHref: string;
  readonly stageHrefs?: Partial<
    Readonly<Record<InstitutionalStageId, string>>
  >;
  readonly recordHrefResolver?: (
    stageId: InstitutionalStageId,
    recordId: string,
  ) => string | undefined;
}

export const DEFAULT_MISSION_CONTROL_ROUTE_MAP:
MissionControlRouteMap = Object.freeze({
  defaultHref: "/ai-governance/mission-control",
  stageHrefs: Object.freeze({
    lesson: "/academy",
    simulation: "/ai-governance/playground",
    assessment: "/academy",
    credential: "/ai-governance/credentials",
    authority_review: "/ai-governance/authority",
    authority: "/ai-governance/authority",
    assignment: "/ai-governance/mission-control",
    governed_work: "/ai-governance/mission-control",
    finding: "/ai-governance/mission-control",
    determination: "/ai-governance/mission-control",
    registry_review: "/ai-governance/registry",
    registry_publication: "/ai-governance/registry",
    execution_artifact: "/ai-governance/registry",
    execution: "/ai-governance/mission-control",
    outcome: "/ai-governance/mission-control",
    continuity: "/ai-governance/mission-control",
    revalidation: "/ai-governance/mission-control",
  }),
});

export function buildMissionControlViewModel(
  snapshot: InstitutionalLifecycleSnapshot,
  routeMap: MissionControlRouteMap =
    DEFAULT_MISSION_CONTROL_ROUTE_MAP,
): MissionControlViewModel {
  const summary = buildMissionControlSummary(snapshot);
  const statuses = resolveLifecycleStatus(snapshot);
  const currentStageId = summary.currentStage?.stageId;
  const nextStageId = summary.nextStage?.stageId;

  const actions = Object.freeze(
    summary.actions.map((action) =>
      projectAction(action, statuses, routeMap),
    ),
  );

  const alerts = Object.freeze(
    buildAlerts(summary, statuses, actions),
  );

  const cards = Object.freeze(
    buildCards(summary, statuses, actions, routeMap),
  );

  const sections = Object.freeze(buildSections(cards));
  const metrics = Object.freeze(buildMetrics(summary, statuses));

  const stageRail = Object.freeze(
    statuses
      .filter((status) =>
        getInstitutionalStage(status.stageId).missionControlVisible,
      )
      .map((status) =>
        projectStageRailItem(
          status,
          currentStageId,
          nextStageId,
          routeMap,
        ),
      ),
  );

  return Object.freeze({
    integrationId: TA14_MISSION_CONTROL_INTEGRATION_ID,
    integrationVersion: TA14_MISSION_CONTROL_INTEGRATION_VERSION,
    boundary: TA14_MISSION_CONTROL_INTEGRATION_BOUNDARY,
    snapshotId: snapshot.snapshotId,
    generatedAt: snapshot.generatedAt,
    summary,
    metrics,
    cards,
    sections,
    actions,
    alerts,
    stageRail,
    currentStageId,
    nextStageId,
    hasCriticalAction: actions.some((action) => action.priority === "critical"),
    hasUrgentAction: actions.some((action) => action.priority === "urgent"),
    hasHeldWork: summary.heldStageCount > 0,
    hasEscalatedWork: summary.escalatedStageCount > 0,
    hasRevalidationRequirement: statuses.some(
      (status) =>
        status.stageId === "revalidation" &&
        ["available", "active", "held", "escalated"].includes(status.status),
    ),
    createsInstitutionalEffect: false,
    mutatesHistoricalRecord: false,
  });
}

function projectAction(
  recommendation: InstitutionalActionRecommendation,
  statuses: readonly InstitutionalStageStatus[],
  routeMap: MissionControlRouteMap,
): MissionControlAction {
  const status = statuses.find(
    (value) => value.stageId === recommendation.stageId,
  );
  const recordId = status?.currentRecordRef?.recordId;

  return Object.freeze({
    id: recommendation.actionId,
    label: recommendation.title,
    description: recommendation.description,
    actionType: normalizeActionType(recommendation.actionType),
    priority: recommendation.priority,
    stageId: recommendation.stageId,
    recordId,
    href: resolveHref(
      recommendation.stageId,
      recordId,
      routeMap,
      recommendation.href,
    ),
  });
}

function normalizeActionType(
  value: InstitutionalActionRecommendation["actionType"],
): MissionControlAction["actionType"] {
  switch (value) {
    case "open":
      return "open";
    case "continue":
      return "continue";
    case "correct":
      return "correct";
    case "escalate":
      return "escalate";
    case "revalidate":
      return "revalidate";
    case "review":
    case "approve":
    case "hold":
    case "deny":
    case "submit":
    case "publish":
    case "seal":
    case "execute":
    case "verify":
    case "supersede":
    case "withdraw":
    case "archive":
      return "review";
    default:
      return "inspect";
  }
}

function buildMetrics(
  summary: InstitutionalMissionControlSummary,
  statuses: readonly InstitutionalStageStatus[],
): readonly MissionControlMetric[] {
  const visible = statuses.filter(
    (status) =>
      getInstitutionalStage(status.stageId).missionControlVisible,
  );
  const complete = visible.filter(
    (status) =>
      status.status === "completed" || status.status === "superseded",
  ).length;

  return [
    Object.freeze({
      id: "lifecycle-progress",
      label: "Lifecycle Progress",
      value: `${summary.lifecycleProgressPercent}%`,
      detail: `${complete} visible stages complete`,
      tone: toneForProgress(summary.lifecycleProgressPercent),
    }),
    Object.freeze({
      id: "active-stages",
      label: "Active Work",
      value: summary.activeStageCount,
      detail: "Institutional stages currently active",
      tone: summary.activeStageCount > 0 ? "positive" : "neutral",
    }),
    Object.freeze({
      id: "required-actions",
      label: "Required Actions",
      value: summary.actions.length,
      detail:
        `${summary.criticalActionCount} critical, ${summary.urgentActionCount} urgent`,
      tone:
        summary.criticalActionCount > 0
          ? "critical"
          : summary.urgentActionCount > 0
            ? "warning"
            : summary.actions.length > 0
              ? "attention"
              : "positive",
    }),
    Object.freeze({
      id: "held-stages",
      label: "Held Work",
      value: summary.heldStageCount,
      detail: "Stages requiring correction or review",
      tone: summary.heldStageCount > 0 ? "warning" : "positive",
    }),
    Object.freeze({
      id: "escalations",
      label: "Escalations",
      value: summary.escalatedStageCount,
      detail: "Stages requiring higher review",
      tone: summary.escalatedStageCount > 0 ? "critical" : "positive",
    }),
  ];
}

function buildCards(
  summary: InstitutionalMissionControlSummary,
  statuses: readonly InstitutionalStageStatus[],
  actions: readonly MissionControlAction[],
  routeMap: MissionControlRouteMap,
): readonly MissionControlCard[] {
  const cards: MissionControlCard[] = [];

  if (summary.currentStage) {
    const definition = getInstitutionalStage(summary.currentStage.stageId);
    cards.push(
      Object.freeze({
        id: "current-stage",
        kind: "current_stage",
        title: definition.title,
        eyebrow: "Current institutional stage",
        description: definition.description,
        value: humanizeStatus(summary.currentStage.status),
        tone: toneForStatus(summary.currentStage.status),
        stageId: definition.id,
        action: actionForStage(actions, definition.id),
        metadata: Object.freeze({
          order: definition.order,
          maturity: definition.maturity,
          stageClass: definition.stageClass,
        }),
      }),
    );
  }

  if (summary.nextStage) {
    const definition = getInstitutionalStage(summary.nextStage.stageId);
    cards.push(
      Object.freeze({
        id: "next-stage",
        kind: "next_stage",
        title: definition.title,
        eyebrow: "Next governed stage",
        description: definition.description,
        value: humanizeStatus(summary.nextStage.status),
        tone:
          summary.nextStage.status === "available"
            ? "positive"
            : toneForStatus(summary.nextStage.status),
        stageId: definition.id,
        action:
          actionForStage(actions, definition.id) ??
          Object.freeze({
            id: `TA14-MC-OPEN-${definition.id}`,
            label: `Open ${definition.title}`,
            description: definition.description,
            actionType: "open",
            priority: "routine",
            stageId: definition.id,
            href: resolveHref(definition.id, undefined, routeMap),
          }),
        metadata: Object.freeze({
          order: definition.order,
          maturity: definition.maturity,
          stageClass: definition.stageClass,
        }),
      }),
    );
  }

  cards.push(
    Object.freeze({
      id: "progress",
      kind: "progress",
      title: "Institutional lifecycle progress",
      description:
        "Progress reflects completed canonical stages. It does not imply compliance, certification, authority, or execution permission.",
      value: `${summary.lifecycleProgressPercent}%`,
      tone: toneForProgress(summary.lifecycleProgressPercent),
      metadata: Object.freeze({
        completedStageCount: summary.completedStageCount,
        totalStageCount: listInstitutionalStages().length,
      }),
    }),
  );

  cards.push(
    ...actions.slice(0, 6).map((action) =>
      Object.freeze({
        id: `card-${action.id}`,
        kind: "required_action" as const,
        title: action.label,
        eyebrow: `${capitalize(action.priority)} priority`,
        description: action.description,
        tone: toneForPriority(action.priority),
        stageId: action.stageId,
        action,
        metadata: Object.freeze({
          priority: action.priority,
          actionType: action.actionType,
          recordId: action.recordId ?? "",
        }),
      }),
    ),
  );

  cards.push(...buildDomainCards(statuses, actions));
  return cards;
}

function buildDomainCards(
  statuses: readonly InstitutionalStageStatus[],
  actions: readonly MissionControlAction[],
): readonly MissionControlCard[] {
  const groups: readonly {
    readonly id: string;
    readonly kind: MissionControlCardKind;
    readonly title: string;
    readonly description: string;
    readonly stageIds: readonly InstitutionalStageId[];
  }[] = [
    {
      id: "registry-domain",
      kind: "registry",
      title: "Registry",
      description:
        "Determination review, controlled publication, and artifact status.",
      stageIds: [
        "registry_review",
        "registry_publication",
        "execution_artifact",
      ],
    },
    {
      id: "execution-domain",
      kind: "execution",
      title: "Execution",
      description:
        "Governed execution status and upstream boundary preservation.",
      stageIds: ["execution"],
    },
    {
      id: "outcome-domain",
      kind: "outcome",
      title: "Outcome",
      description:
        "Observed and verified post-execution reality.",
      stageIds: ["outcome"],
    },
    {
      id: "continuity-domain",
      kind: "continuity",
      title: "Continuity",
      description:
        "Historical continuity and future-governance readiness.",
      stageIds: ["continuity"],
    },
    {
      id: "revalidation-domain",
      kind: "revalidation",
      title: "Revalidation",
      description:
        "Material-change triggers and new governed review cycles.",
      stageIds: ["revalidation"],
    },
    {
      id: "institutional-health-domain",
      kind: "institutional_health",
      title: "Institutional Health",
      description:
        "Oversight, accountability, resilience, and sustainability.",
      stageIds: [
        "institutional_assurance",
        "institutional_oversight",
        "institutional_accountability",
        "institutional_resilience",
        "institutional_sustainability",
      ],
    },
  ];

  return groups.map((group) => {
    const groupStatuses = statuses.filter((status) =>
      group.stageIds.includes(status.stageId),
    );
    const highestRiskStatus = selectHighestRiskStatus(groupStatuses);
    const action = group.stageIds
      .map((stageId) => actionForStage(actions, stageId))
      .find(Boolean);
    const completeCount = groupStatuses.filter(
      (status) =>
        status.status === "completed" || status.status === "superseded",
    ).length;

    return Object.freeze({
      id: group.id,
      kind: group.kind,
      title: group.title,
      description: group.description,
      value: `${completeCount}/${groupStatuses.length}`,
      tone: highestRiskStatus
        ? toneForStatus(highestRiskStatus.status)
        : "neutral",
      stageId: highestRiskStatus?.stageId ?? group.stageIds[0],
      action,
      metadata: Object.freeze({
        completed: completeCount,
        total: groupStatuses.length,
        highestRisk: highestRiskStatus?.status ?? "not_started",
      }),
    });
  });
}

function buildAlerts(
  summary: InstitutionalMissionControlSummary,
  statuses: readonly InstitutionalStageStatus[],
  actions: readonly MissionControlAction[],
): readonly MissionControlAlert[] {
  const alerts: MissionControlAlert[] = [];

  for (const status of statuses) {
    if (
      !["held", "escalated", "blocked", "invalidated"].includes(status.status)
    ) {
      continue;
    }

    const definition = getInstitutionalStage(status.stageId);
    const action = actionForStage(actions, status.stageId);

    alerts.push(
      Object.freeze({
        id:
          `TA14-MC-ALERT-${status.stageId}-${status.currentRecordRef?.recordId ?? "stage"}`,
        title:
          status.status === "held"
            ? `${definition.title} is held`
            : status.status === "escalated"
              ? `${definition.title} requires escalation`
              : status.status === "invalidated"
                ? `${definition.title} requires revalidation`
                : `${definition.title} is blocked`,
        description:
          status.currentRecordRef?.limitations?.join(" ") ??
          definition.blockedLabel,
        severity:
          status.status === "invalidated" ||
          status.status === "escalated"
            ? "critical"
            : "urgent",
        stageId: status.stageId,
        recordId: status.currentRecordRef?.recordId,
        action,
      }),
    );
  }

  if (summary.actions.length > 0 && alerts.length === 0) {
    alerts.push(
      Object.freeze({
        id: "TA14-MC-ALERT-ACTIONS",
        title: "Institutional actions are available",
        description:
          `${summary.actions.length} governed action${summary.actions.length === 1 ? "" : "s"} require attention.`,
        severity: "important",
        action: actions[0],
      }),
    );
  }

  return alerts;
}

function buildSections(
  cards: readonly MissionControlCard[],
): readonly MissionControlSection[] {
  const definitions: readonly {
    readonly id: MissionControlSection["id"];
    readonly title: string;
    readonly description: string;
    readonly kinds: readonly MissionControlCardKind[];
  }[] = [
    {
      id: "overview",
      title: "Institutional Overview",
      description:
        "Current stage, next stage, and lifecycle progress.",
      kinds: ["current_stage", "next_stage", "progress"],
    },
    {
      id: "required_actions",
      title: "Required Actions",
      description:
        "Governed actions that require participant or reviewer attention.",
      kinds: ["required_action"],
    },
    {
      id: "registry",
      title: "Registry",
      description:
        "Registry review, publication, and execution-artifact status.",
      kinds: ["registry"],
    },
    {
      id: "execution",
      title: "Execution and Outcome",
      description:
        "Execution, observed outcome, and consequence status.",
      kinds: ["execution", "outcome"],
    },
    {
      id: "continuity",
      title: "Continuity and Revalidation",
      description:
        "Historical continuity and future-governance requirements.",
      kinds: ["continuity", "revalidation"],
    },
    {
      id: "institutional_health",
      title: "Institutional Health",
      description:
        "Assurance, oversight, accountability, resilience, and sustainability.",
      kinds: ["institutional_health"],
    },
  ];

  return definitions
    .map((definition) =>
      Object.freeze({
        id: definition.id,
        title: definition.title,
        description: definition.description,
        cards: Object.freeze(
          cards.filter((card) => definition.kinds.includes(card.kind)),
        ),
      }),
    )
    .filter((section) => section.cards.length > 0);
}

function projectStageRailItem(
  status: InstitutionalStageStatus,
  currentStageId: InstitutionalStageId | undefined,
  nextStageId: InstitutionalStageId | undefined,
  routeMap: MissionControlRouteMap,
): MissionControlStageRailItem {
  const definition = getInstitutionalStage(status.stageId);
  const recordId = status.currentRecordRef?.recordId;

  return Object.freeze({
    stageId: status.stageId,
    order: status.order,
    title: status.title,
    shortTitle: definition.shortTitle,
    status: status.status,
    tone: toneForStatus(status.status),
    current: status.stageId === currentStageId,
    next: status.stageId === nextStageId,
    recordId,
    href: resolveHref(status.stageId, recordId, routeMap),
  });
}

function actionForStage(
  actions: readonly MissionControlAction[],
  stageId: InstitutionalStageId,
): MissionControlAction | undefined {
  return actions.find((action) => action.stageId === stageId);
}

function resolveHref(
  stageId: InstitutionalStageId,
  recordId: string | undefined,
  routeMap: MissionControlRouteMap,
  explicitHref?: string,
): string | undefined {
  if (explicitHref) return explicitHref;

  if (recordId && routeMap.recordHrefResolver) {
    const resolved = routeMap.recordHrefResolver(stageId, recordId);
    if (resolved) return resolved;
  }

  return routeMap.stageHrefs?.[stageId] ?? routeMap.defaultHref;
}

function selectHighestRiskStatus(
  statuses: readonly InstitutionalStageStatus[],
): InstitutionalStageStatus | undefined {
  const rank: Readonly<
    Record<InstitutionalStageStatus["status"], number>
  > = {
    invalidated: 10,
    escalated: 9,
    held: 8,
    blocked: 7,
    active: 6,
    available: 5,
    not_started: 4,
    withdrawn: 3,
    superseded: 2,
    completed: 1,
  };

  return [...statuses].sort(
    (a, b) => rank[b.status] - rank[a.status],
  )[0];
}

function toneForStatus(
  status: InstitutionalStageStatus["status"],
): MissionControlTone {
  switch (status) {
    case "completed":
    case "superseded":
      return "positive";
    case "available":
    case "active":
      return "attention";
    case "held":
    case "blocked":
      return "warning";
    case "escalated":
    case "invalidated":
      return "critical";
    default:
      return "neutral";
  }
}

function toneForPriority(
  priority: MissionControlAction["priority"],
): MissionControlTone {
  switch (priority) {
    case "critical":
      return "critical";
    case "urgent":
      return "warning";
    case "important":
      return "attention";
    default:
      return "neutral";
  }
}

function toneForProgress(progress: number): MissionControlTone {
  if (progress >= 90) return "positive";
  if (progress >= 50) return "attention";
  return "neutral";
}

function humanizeStatus(
  status: InstitutionalStageStatus["status"],
): string {
  return status.split("_").map(capitalize).join(" ");
}

function capitalize(value: string): string {
  return value.length === 0
    ? value
    : value[0].toUpperCase() + value.slice(1);
}

export function createEmptyMissionControlSnapshot(
  input: {
    readonly snapshotId: string;
    readonly subjectId?: string;
    readonly organizationId?: string;
    readonly governanceEntityId?: string;
    readonly routeId?: string;
    readonly generatedAt?: string;
  },
): InstitutionalLifecycleSnapshot {
  return Object.freeze({
    snapshotId: input.snapshotId,
    subjectId: input.subjectId,
    organizationId: input.organizationId,
    governanceEntityId: input.governanceEntityId,
    routeId: input.routeId,
    records: Object.freeze([]),
    generatedAt: input.generatedAt ?? new Date().toISOString(),
  });
}

export function createMissionControlDemonstrationSnapshot(
  generatedAt = "2026-08-05T13:00:00.000Z",
): InstitutionalLifecycleSnapshot {
  return Object.freeze({
    snapshotId: "TA14-MC-DEMO-SNAPSHOT-000001",
    subjectId: "TA14-SUBJECT-DEMO-000001",
    organizationId: "TA14-ORG-DEMO-000001",
    governanceEntityId: "TA14-GOV-ENTITY-DEMO-000001",
    routeId: "TA14-ROUTE-DEMO-000001",
    records: Object.freeze([
      Object.freeze({
        stageId: "reality",
        recordId: "TA14-REALITY-DEMO-000001",
        state: "completed",
        completedAt: generatedAt,
      }),
      Object.freeze({
        stageId: "record",
        recordId: "TA14-RECORD-DEMO-000001",
        recordType: "governed_record",
        recordVersion: "1.0.0",
        state: "completed",
        completedAt: generatedAt,
      }),
      Object.freeze({
        stageId: "context",
        recordId: "TA14-CONTEXT-DEMO-000001",
        state: "completed",
        completedAt: generatedAt,
      }),
      Object.freeze({
        stageId: "relationship",
        recordId: "TA14-RELATIONSHIP-DEMO-000001",
        state: "completed",
        completedAt: generatedAt,
      }),
      Object.freeze({
        stageId: "lesson",
        recordId: "TA14-LESSON-DEMO-000001",
        state: "completed",
        completedAt: generatedAt,
      }),
      Object.freeze({
        stageId: "simulation",
        recordId: "TA14-SIMULATION-DEMO-000001",
        state: "completed",
        completedAt: generatedAt,
      }),
      Object.freeze({
        stageId: "assessment",
        recordId: "TA14-ASSESSMENT-DEMO-000001",
        state: "completed",
        completedAt: generatedAt,
      }),
      Object.freeze({
        stageId: "credential",
        recordId: "TA14-CREDENTIAL-DEMO-000001",
        state: "completed",
        completedAt: generatedAt,
      }),
      Object.freeze({
        stageId: "authority_review",
        recordId: "TA14-AUTH-REVIEW-DEMO-000001",
        state: "completed",
        completedAt: generatedAt,
      }),
      Object.freeze({
        stageId: "authority",
        recordId: "TA14-AUTHORITY-DEMO-000001",
        state: "completed",
        completedAt: generatedAt,
      }),
      Object.freeze({
        stageId: "assignment",
        recordId: "TA14-ASSIGNMENT-DEMO-000001",
        state: "active",
        updatedAt: generatedAt,
        limitations: Object.freeze([
          "Evidence package review remains open.",
        ]),
      }),
    ]),
    generatedAt,
  });
}

export interface MissionControlIntegrationValidationIssue {
  readonly code:
    | "missing_snapshot_id"
    | "missing_generated_at"
    | "duplicate_action_id"
    | "duplicate_card_id"
    | "unknown_stage"
    | "historical_mutation_enabled"
    | "institutional_effect_enabled";
  readonly message: string;
  readonly severity: "error" | "warning";
}

export interface MissionControlIntegrationValidationResult {
  readonly ok: boolean;
  readonly issues:
    readonly MissionControlIntegrationValidationIssue[];
}

export function validateMissionControlViewModel(
  value: MissionControlViewModel,
): MissionControlIntegrationValidationResult {
  const issues: MissionControlIntegrationValidationIssue[] = [];

  if (!value.snapshotId.trim()) {
    issues.push({
      code: "missing_snapshot_id",
      message: "Mission Control view model requires a snapshot id.",
      severity: "error",
    });
  }

  if (!value.generatedAt.trim()) {
    issues.push({
      code: "missing_generated_at",
      message: "Mission Control view model requires a generated timestamp.",
      severity: "error",
    });
  }

  const actionIds = new Set<string>();

  for (const action of value.actions) {
    if (actionIds.has(action.id)) {
      issues.push({
        code: "duplicate_action_id",
        message: `Duplicate Mission Control action id ${action.id}.`,
        severity: "error",
      });
    }

    actionIds.add(action.id);

    try {
      getInstitutionalStage(action.stageId);
    } catch {
      issues.push({
        code: "unknown_stage",
        message:
          `Mission Control action ${action.id} references unknown stage ${action.stageId}.`,
        severity: "error",
      });
    }
  }

  const cardIds = new Set<string>();

  for (const card of value.cards) {
    if (cardIds.has(card.id)) {
      issues.push({
        code: "duplicate_card_id",
        message: `Duplicate Mission Control card id ${card.id}.`,
        severity: "error",
      });
    }
    cardIds.add(card.id);
  }

  if (value.mutatesHistoricalRecord) {
    issues.push({
      code: "historical_mutation_enabled",
      message:
        "Mission Control integration cannot mutate historical records.",
      severity: "error",
    });
  }

  if (value.createsInstitutionalEffect) {
    issues.push({
      code: "institutional_effect_enabled",
      message:
        "Mission Control integration cannot create institutional effects.",
      severity: "error",
    });
  }

  return Object.freeze({
    ok: !issues.some((issue) => issue.severity === "error"),
    issues: Object.freeze(issues),
  });
}

export interface MissionControlIntegrationSelfCheck {
  readonly ok: boolean;
  readonly integrationId: typeof TA14_MISSION_CONTROL_INTEGRATION_ID;
  readonly integrationVersion:
    typeof TA14_MISSION_CONTROL_INTEGRATION_VERSION;
  readonly cardCount: number;
  readonly sectionCount: number;
  readonly stageRailCount: number;
  readonly createsInstitutionalEffect: false;
  readonly mutatesHistoricalRecord: false;
  readonly issues:
    readonly MissionControlIntegrationValidationIssue[];
}

export function runMissionControlIntegrationSelfCheck():
MissionControlIntegrationSelfCheck {
  const snapshot = createMissionControlDemonstrationSnapshot();
  const viewModel = buildMissionControlViewModel(snapshot);
  const validation = validateMissionControlViewModel(viewModel);

  return Object.freeze({
    ok: validation.ok,
    integrationId: TA14_MISSION_CONTROL_INTEGRATION_ID,
    integrationVersion: TA14_MISSION_CONTROL_INTEGRATION_VERSION,
    cardCount: viewModel.cards.length,
    sectionCount: viewModel.sections.length,
    stageRailCount: viewModel.stageRail.length,
    createsInstitutionalEffect: false,
    mutatesHistoricalRecord: false,
    issues: validation.issues,
  });
}

const missionControlIntegration = Object.freeze({
  integrationId: TA14_MISSION_CONTROL_INTEGRATION_ID,
  integrationVersion: TA14_MISSION_CONTROL_INTEGRATION_VERSION,
  boundary: TA14_MISSION_CONTROL_INTEGRATION_BOUNDARY,
  defaultRouteMap: DEFAULT_MISSION_CONTROL_ROUTE_MAP,
  buildMissionControlViewModel,
  createEmptyMissionControlSnapshot,
  createMissionControlDemonstrationSnapshot,
  validateMissionControlViewModel,
  runMissionControlIntegrationSelfCheck,
});

export default missionControlIntegration;
