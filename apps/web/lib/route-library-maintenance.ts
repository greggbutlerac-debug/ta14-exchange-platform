import {
  ROUTE_LIBRARY_STORAGE_KEY,
  type StoredRoute,
} from "./route-library";

export const ROUTE_LIBRARY_UPDATE_EVENT =
  "ta14-route-library-updated";

export type RouteLibraryStorageReport = {
  routeCount: number;
  estimatedBytes: number;
  estimatedKilobytes: number;
  lastUpdatedAt: string | null;
  available: boolean;
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
    isRecord(value.route)
  );
}

function readRawLibrary(): string | null {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(
    ROUTE_LIBRARY_STORAGE_KEY,
  );
}

function readRoutes(): StoredRoute[] {
  const raw = readRawLibrary();

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

function dispatchLibraryUpdate(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(ROUTE_LIBRARY_UPDATE_EVENT),
  );
}

export function getRouteLibraryStorageReport():
  RouteLibraryStorageReport {
  if (!canUseStorage()) {
    return {
      routeCount: 0,
      estimatedBytes: 0,
      estimatedKilobytes: 0,
      lastUpdatedAt: null,
      available: false,
    };
  }

  const raw = readRawLibrary() ?? "";
  const routes = readRoutes();
  const lastUpdatedAt =
    routes.length === 0
      ? null
      : routes.reduce<string | null>(
          (latest, route) => {
            if (!latest) {
              return route.updatedAt;
            }

            return Date.parse(route.updatedAt) >
              Date.parse(latest)
              ? route.updatedAt
              : latest;
          },
          null,
        );

  const estimatedBytes = new Blob([raw]).size;

  return {
    routeCount: routes.length,
    estimatedBytes,
    estimatedKilobytes:
      Math.round((estimatedBytes / 1024) * 10) / 10,
    lastUpdatedAt,
    available: true,
  };
}

export function clearRouteLibrary(): number {
  if (!canUseStorage()) {
    throw new Error(
      "Route library storage is unavailable in this environment.",
    );
  }

  const routeCount = readRoutes().length;

  window.localStorage.removeItem(
    ROUTE_LIBRARY_STORAGE_KEY,
  );

  dispatchLibraryUpdate();

  return routeCount;
}

export function pruneInvalidRouteLibraryRecords(): {
  removed: number;
  remaining: number;
} {
  if (!canUseStorage()) {
    throw new Error(
      "Route library storage is unavailable in this environment.",
    );
  }

  const raw = readRawLibrary();

  if (!raw) {
    return {
      removed: 0,
      remaining: 0,
    };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(
      ROUTE_LIBRARY_STORAGE_KEY,
    );
    dispatchLibraryUpdate();

    return {
      removed: 1,
      remaining: 0,
    };
  }

  if (
    !isRecord(parsed) ||
    parsed.schema !== "TA14_ROUTE_LIBRARY_V1" ||
    !Array.isArray(parsed.routes)
  ) {
    window.localStorage.removeItem(
      ROUTE_LIBRARY_STORAGE_KEY,
    );
    dispatchLibraryUpdate();

    return {
      removed: 1,
      remaining: 0,
    };
  }

  const validRoutes = parsed.routes.filter(isStoredRoute);
  const removed = parsed.routes.length - validRoutes.length;

  if (removed > 0) {
    window.localStorage.setItem(
      ROUTE_LIBRARY_STORAGE_KEY,
      JSON.stringify({
        schema: "TA14_ROUTE_LIBRARY_V1",
        routes: validRoutes,
      }),
    );

    dispatchLibraryUpdate();
  }

  return {
    removed,
    remaining: validRoutes.length,
  };
}
