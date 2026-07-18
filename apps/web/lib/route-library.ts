import type { TransferRouteDraft } from "./route-draft-transfer";

export const ROUTE_LIBRARY_STORAGE_KEY =
  "ta14-exchange-route-library-v1";

export type StoredRoute = {
  id: string;
  route: TransferRouteDraft;
  createdAt: string;
  updatedAt: string;
};

type StoredRouteLibrary = {
  schema: "TA14_ROUTE_LIBRARY_V1";
  routes: StoredRoute[];
};

const emptyLibrary: StoredRouteLibrary = {
  schema: "TA14_ROUTE_LIBRARY_V1",
  routes: [],
};

function canUseStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTransferRouteDraft(
  value: unknown,
): value is TransferRouteDraft {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.schema !== "TA14_ROUTE_DRAFT_V1" ||
    typeof value.routeId !== "string" ||
    !isRecord(value.metadata) ||
    !isRecord(value.chain) ||
    !isRecord(value.readiness)
  ) {
    return false;
  }

  const metadata = value.metadata;
  const chain = value.chain;
  const readiness = value.readiness;

  const stageKeys = [
    "reality",
    "record",
    "continuity",
    "admissibility",
    "binding",
    "commit",
    "execution",
    "outcome",
  ] as const;

  return (
    typeof metadata.name === "string" &&
    typeof metadata.domain === "string" &&
    typeof metadata.owner === "string" &&
    typeof metadata.version === "number" &&
    stageKeys.every((key) => typeof chain[key] === "string") &&
    typeof readiness.completedStages === "number" &&
    typeof readiness.totalStages === "number" &&
    Array.isArray(readiness.missingStages) &&
    readiness.missingStages.every(
      (stage) => typeof stage === "string",
    ) &&
    typeof readiness.nextAction === "string" &&
    typeof value.governingPrinciple === "string"
  );
}

function isStoredRoute(value: unknown): value is StoredRoute {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    isTransferRouteDraft(value.route)
  );
}

function readLibrary(): StoredRouteLibrary {
  if (!canUseStorage()) {
    return emptyLibrary;
  }

  try {
    const raw = window.localStorage.getItem(
      ROUTE_LIBRARY_STORAGE_KEY,
    );

    if (!raw) {
      return emptyLibrary;
    }

    const parsed = JSON.parse(raw) as unknown;

    if (
      !isRecord(parsed) ||
      parsed.schema !== "TA14_ROUTE_LIBRARY_V1" ||
      !Array.isArray(parsed.routes)
    ) {
      return emptyLibrary;
    }

    return {
      schema: "TA14_ROUTE_LIBRARY_V1",
      routes: parsed.routes
        .filter(isStoredRoute)
        .sort(
          (a, b) =>
            Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
        ),
    };
  } catch {
    return emptyLibrary;
  }
}

function writeLibrary(routes: StoredRoute[]): void {
  if (!canUseStorage()) {
    return;
  }

  const library: StoredRouteLibrary = {
    schema: "TA14_ROUTE_LIBRARY_V1",
    routes: [...routes].sort(
      (a, b) =>
        Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
    ),
  };

  window.localStorage.setItem(
    ROUTE_LIBRARY_STORAGE_KEY,
    JSON.stringify(library),
  );

  window.dispatchEvent(
    new CustomEvent("ta14-route-library-updated"),
  );
}

function createStoredRouteId(route: TransferRouteDraft): string {
  const slug = route.metadata.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "route";

  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);

  return `${slug}:${randomPart}`;
}

export function listStoredRoutes(): StoredRoute[] {
  return readLibrary().routes;
}

export function getStoredRoute(id: string): StoredRoute | null {
  return (
    readLibrary().routes.find((item) => item.id === id) ?? null
  );
}

export function saveStoredRoute(
  route: TransferRouteDraft,
  existingId?: string,
): StoredRoute {
  const routes = readLibrary().routes;
  const now = new Date().toISOString();
  const existing = existingId
    ? routes.find((item) => item.id === existingId)
    : undefined;

  const stored: StoredRoute = {
    id: existing?.id ?? createStoredRouteId(route),
    route,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const nextRoutes = existing
    ? routes.map((item) =>
        item.id === existing.id ? stored : item,
      )
    : [stored, ...routes];

  writeLibrary(nextRoutes);
  return stored;
}

export function deleteStoredRoute(id: string): boolean {
  const routes = readLibrary().routes;
  const nextRoutes = routes.filter((item) => item.id !== id);

  if (nextRoutes.length === routes.length) {
    return false;
  }

  writeLibrary(nextRoutes);
  return true;
}

export function duplicateStoredRoute(id: string): StoredRoute | null {
  const source = getStoredRoute(id);

  if (!source) {
    return null;
  }

  return saveStoredRoute({
    ...source.route,
    routeId: `${source.route.routeId}:copy`,
    metadata: {
      ...source.route.metadata,
      name: `${source.route.metadata.name} Copy`,
      version: source.route.metadata.version + 1,
    },
  });
}

export function clearStoredRoutes(): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ROUTE_LIBRARY_STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent("ta14-route-library-updated"),
  );
}
