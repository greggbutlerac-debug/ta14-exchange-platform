import {
  ROUTE_LIBRARY_STORAGE_KEY,
  type StoredRoute,
} from "./route-library";
import { isTransferRouteDraft } from "./route-builder-handoff";

export const ROUTE_LIBRARY_BACKUP_SCHEMA =
  "TA14_ROUTE_LIBRARY_BACKUP_V1" as const;

export type RouteLibraryBackup = {
  schema: typeof ROUTE_LIBRARY_BACKUP_SCHEMA;
  exportedAt: string;
  routeCount: number;
  routes: StoredRoute[];
};

export type RouteLibraryImportMode = "MERGE" | "REPLACE";

export type RouteLibraryImportResult = {
  imported: number;
  updated: number;
  skipped: number;
  total: number;
};

function canUseStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
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

function readStoredRoutes(): StoredRoute[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(
    ROUTE_LIBRARY_STORAGE_KEY,
  );

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      !isRecord(parsed) ||
      parsed.schema !== "TA14_ROUTE_LIBRARY_V1" ||
      !Array.isArray(parsed.routes)
    ) {
      return [];
    }

    return parsed.routes.filter(isStoredRoute);
  } catch {
    return [];
  }
}

function writeStoredRoutes(routes: StoredRoute[]): void {
  if (!canUseStorage()) {
    throw new Error(
      "Route library storage is unavailable in this environment.",
    );
  }

  const sortedRoutes = [...routes].sort(
    (left, right) =>
      Date.parse(right.updatedAt) -
      Date.parse(left.updatedAt),
  );

  window.localStorage.setItem(
    ROUTE_LIBRARY_STORAGE_KEY,
    JSON.stringify({
      schema: "TA14_ROUTE_LIBRARY_V1",
      routes: sortedRoutes,
    }),
  );

  window.dispatchEvent(
    new CustomEvent("ta14-route-library-updated"),
  );
}

function normalizeStoredRoute(
  route: StoredRoute,
): StoredRoute {
  const now = new Date().toISOString();

  return {
    id: route.id.trim(),
    createdAt:
      Number.isNaN(Date.parse(route.createdAt))
        ? now
        : route.createdAt,
    updatedAt:
      Number.isNaN(Date.parse(route.updatedAt))
        ? now
        : route.updatedAt,
    route: route.route,
  };
}

export function createRouteLibraryBackup():
  RouteLibraryBackup {
  const routes = readStoredRoutes();

  return {
    schema: ROUTE_LIBRARY_BACKUP_SCHEMA,
    exportedAt: new Date().toISOString(),
    routeCount: routes.length,
    routes,
  };
}

export function downloadRouteLibraryBackup(): void {
  const backup = createRouteLibraryBackup();
  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    {
      type: "application/json",
    },
  );
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const date = backup.exportedAt.slice(0, 10);

  anchor.href = href;
  anchor.download = `ta14-route-library-${date}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
}

export function parseRouteLibraryBackup(
  input: string,
): RouteLibraryBackup {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch {
    throw new Error(
      "The selected file does not contain valid JSON.",
    );
  }

  if (
    !isRecord(parsed) ||
    parsed.schema !== ROUTE_LIBRARY_BACKUP_SCHEMA ||
    typeof parsed.exportedAt !== "string" ||
    typeof parsed.routeCount !== "number" ||
    !Array.isArray(parsed.routes)
  ) {
    throw new Error(
      "The selected file is not a TA-14 route library backup.",
    );
  }

  const routes = parsed.routes.filter(isStoredRoute);

  if (routes.length !== parsed.routes.length) {
    throw new Error(
      "The backup contains one or more invalid route records.",
    );
  }

  return {
    schema: ROUTE_LIBRARY_BACKUP_SCHEMA,
    exportedAt: parsed.exportedAt,
    routeCount: routes.length,
    routes,
  };
}

export function importRouteLibraryBackup(
  backup: RouteLibraryBackup,
  mode: RouteLibraryImportMode = "MERGE",
): RouteLibraryImportResult {
  const incomingRoutes = backup.routes.map(
    normalizeStoredRoute,
  );
  const existingRoutes =
    mode === "REPLACE" ? [] : readStoredRoutes();
  const routeMap = new Map(
    existingRoutes.map((item) => [item.id, item]),
  );

  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (const incoming of incomingRoutes) {
    const existing = routeMap.get(incoming.id);

    if (!existing) {
      routeMap.set(incoming.id, incoming);
      imported += 1;
      continue;
    }

    const incomingTime = Date.parse(incoming.updatedAt);
    const existingTime = Date.parse(existing.updatedAt);

    if (incomingTime > existingTime) {
      routeMap.set(incoming.id, incoming);
      updated += 1;
    } else {
      skipped += 1;
    }
  }

  const routes = [...routeMap.values()];
  writeStoredRoutes(routes);

  return {
    imported,
    updated,
    skipped,
    total: routes.length,
  };
}
