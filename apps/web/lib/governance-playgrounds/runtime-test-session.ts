import type { GovernanceDraftPayload } from "./draft-storage";
import type { JsonValue } from "./types";

/**
 * TA-14 Runtime Governance Playground
 * Active route-to-testing handoff
 *
 * This browser-local session identifies which editable Runtime route draft
 * is currently being tested. It does not convert the draft into evidence,
 * a governed record, or proof of execution.
 */

export const RUNTIME_TEST_SESSION_STORAGE_KEY =
  "ta14:runtime-execution:active-test-session";

export const RUNTIME_TEST_SESSION_SCHEMA_VERSION = "1.0.0";

export interface RuntimeTestSession {
  schemaVersion: string;
  sessionId: string;
  laneId: string;
  laneVersion: string;
  routeDraftId: string;
  routeTitle: string;
  routeValues: Readonly<Record<string, JsonValue>>;
  selectedAt: string;
  updatedAt: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function createId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    "randomUUID" in globalThis.crypto
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `runtime-test-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function isRuntimeTestSession(
  value: unknown,
): value is RuntimeTestSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<RuntimeTestSession>;

  return (
    candidate.schemaVersion ===
      RUNTIME_TEST_SESSION_SCHEMA_VERSION &&
    typeof candidate.sessionId === "string" &&
    typeof candidate.laneId === "string" &&
    typeof candidate.laneVersion === "string" &&
    typeof candidate.routeDraftId === "string" &&
    typeof candidate.routeTitle === "string" &&
    !!candidate.routeValues &&
    typeof candidate.routeValues === "object" &&
    typeof candidate.selectedAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

export function createRuntimeTestSession(
  draft: GovernanceDraftPayload,
): RuntimeTestSession {
  const timestamp = new Date().toISOString();

  return {
    schemaVersion: RUNTIME_TEST_SESSION_SCHEMA_VERSION,
    sessionId: createId(),
    laneId: draft.laneId,
    laneVersion: draft.laneVersion,
    routeDraftId: draft.draftId,
    routeTitle: draft.title,
    routeValues: draft.values,
    selectedAt: timestamp,
    updatedAt: timestamp,
  };
}

export function saveRuntimeTestSession(
  session: RuntimeTestSession,
): RuntimeTestSession {
  const updatedSession: RuntimeTestSession = {
    ...session,
    schemaVersion: RUNTIME_TEST_SESSION_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  };

  if (isBrowser()) {
    window.localStorage.setItem(
      RUNTIME_TEST_SESSION_STORAGE_KEY,
      JSON.stringify(updatedSession),
    );
  }

  return updatedSession;
}

export function selectRuntimeDraftForTesting(
  draft: GovernanceDraftPayload,
): RuntimeTestSession {
  return saveRuntimeTestSession(
    createRuntimeTestSession(draft),
  );
}

export function loadRuntimeTestSession():
  | RuntimeTestSession
  | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  const raw = window.localStorage.getItem(
    RUNTIME_TEST_SESSION_STORAGE_KEY,
  );

  if (!raw) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    return isRuntimeTestSession(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function updateRuntimeTestSessionRoute(
  draft: GovernanceDraftPayload,
): RuntimeTestSession {
  const existingSession = loadRuntimeTestSession();
  const timestamp = new Date().toISOString();

  const nextSession: RuntimeTestSession = existingSession
    ? {
        ...existingSession,
        laneId: draft.laneId,
        laneVersion: draft.laneVersion,
        routeDraftId: draft.draftId,
        routeTitle: draft.title,
        routeValues: draft.values,
        updatedAt: timestamp,
      }
    : createRuntimeTestSession(draft);

  return saveRuntimeTestSession(nextSession);
}

export function clearRuntimeTestSession(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(
    RUNTIME_TEST_SESSION_STORAGE_KEY,
  );
}

export function exportRuntimeTestSession(
  session: RuntimeTestSession,
): string {
  return JSON.stringify(session, null, 2);
}
