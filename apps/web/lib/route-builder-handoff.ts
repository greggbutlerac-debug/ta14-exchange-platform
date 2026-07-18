import type { TransferRouteDraft } from "./route-draft-transfer";

export const ROUTE_BUILDER_HANDOFF_KEY =
  "ta14.route-builder.handoff.v1";

export const ROUTE_BUILDER_HANDOFF_EVENT =
  "ta14:route-builder-handoff";

export type RouteBuilderHandoffSource =
  | "MY_ROUTES"
  | "IMPORT"
  | "DUPLICATE"
  | "EVALUATION"
  | "UNKNOWN";

export type RouteBuilderHandoff = {
  schema: "TA14_ROUTE_BUILDER_HANDOFF_V1";
  createdAt: string;
  source: RouteBuilderHandoffSource;
  libraryRouteId: string | null;
  route: TransferRouteDraft;
};

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isStringRecord(
  value: unknown,
): value is Record<string, string> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(
    (item) => typeof item === "string",
  );
}

export function isTransferRouteDraft(
  value: unknown,
): value is TransferRouteDraft {
  if (!isRecord(value)) {
    return false;
  }

  if (value.schema !== "TA14_ROUTE_DRAFT_V1") {
    return false;
  }

  if (
    typeof value.routeId !== "string" ||
    typeof value.status !== "string"
  ) {
    return false;
  }

  if (!isRecord(value.metadata)) {
    return false;
  }

  if (
    typeof value.metadata.name !== "string" ||
    typeof value.metadata.domain !== "string" ||
    typeof value.metadata.owner !== "string" ||
    typeof value.metadata.version !== "number"
  ) {
    return false;
  }

  if (!isStringRecord(value.chain)) {
    return false;
  }

  const requiredStages = [
    "reality",
    "record",
    "continuity",
    "admissibility",
    "binding",
    "commit",
    "execution",
    "outcome",
  ];

  if (
    requiredStages.some(
      (stage) => typeof value.chain[stage] !== "string",
    )
  ) {
    return false;
  }

  if (!isRecord(value.readiness)) {
    return false;
  }

  return (
    typeof value.readiness.completedStages === "number" &&
    typeof value.readiness.totalStages === "number" &&
    Array.isArray(value.readiness.missingStages) &&
    value.readiness.missingStages.every(
      (item) => typeof item === "string",
    ) &&
    typeof value.readiness.nextAction === "string" &&
    typeof value.governingPrinciple === "string"
  );
}

export function isRouteBuilderHandoff(
  value: unknown,
): value is RouteBuilderHandoff {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.schema === "TA14_ROUTE_BUILDER_HANDOFF_V1" &&
    typeof value.createdAt === "string" &&
    typeof value.source === "string" &&
    (value.libraryRouteId === null ||
      typeof value.libraryRouteId === "string") &&
    isTransferRouteDraft(value.route)
  );
}

export function stageRouteForBuilder(
  route: TransferRouteDraft,
  options?: {
    source?: RouteBuilderHandoffSource;
    libraryRouteId?: string | null;
  },
): RouteBuilderHandoff {
  const handoff: RouteBuilderHandoff = {
    schema: "TA14_ROUTE_BUILDER_HANDOFF_V1",
    createdAt: new Date().toISOString(),
    source: options?.source ?? "UNKNOWN",
    libraryRouteId: options?.libraryRouteId ?? null,
    route,
  };

  if (!hasWindow()) {
    return handoff;
  }

  window.sessionStorage.setItem(
    ROUTE_BUILDER_HANDOFF_KEY,
    JSON.stringify(handoff),
  );

  window.dispatchEvent(
    new CustomEvent(ROUTE_BUILDER_HANDOFF_EVENT, {
      detail: handoff,
    }),
  );

  return handoff;
}

export function peekRouteBuilderHandoff():
  | RouteBuilderHandoff
  | null {
  if (!hasWindow()) {
    return null;
  }

  const raw = window.sessionStorage.getItem(
    ROUTE_BUILDER_HANDOFF_KEY,
  );

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isRouteBuilderHandoff(parsed)) {
      window.sessionStorage.removeItem(
        ROUTE_BUILDER_HANDOFF_KEY,
      );
      return null;
    }

    return parsed;
  } catch {
    window.sessionStorage.removeItem(
      ROUTE_BUILDER_HANDOFF_KEY,
    );
    return null;
  }
}

export function consumeRouteBuilderHandoff():
  | RouteBuilderHandoff
  | null {
  const handoff = peekRouteBuilderHandoff();

  if (!hasWindow()) {
    return handoff;
  }

  window.sessionStorage.removeItem(
    ROUTE_BUILDER_HANDOFF_KEY,
  );

  return handoff;
}

export function clearRouteBuilderHandoff(): void {
  if (!hasWindow()) {
    return;
  }

  window.sessionStorage.removeItem(
    ROUTE_BUILDER_HANDOFF_KEY,
  );
}
