import type {
  GovernanceLaneId,
  JsonValue,
  RouteLifecycleState,
} from "./types";

/**
 * TA-14 Governance-Specific Playgrounds
 * Local draft persistence
 *
 * This module is intentionally browser-storage only. It provides a safe,
 * account-independent draft layer until server persistence is connected.
 *
 * Local drafts are not governed records, evidence, determinations, or proof
 * of execution. They may be edited or deleted by the user.
 */

export const GOVERNANCE_DRAFT_STORAGE_PREFIX =
  "ta14:governance-playground:draft" as const;

export const GOVERNANCE_DRAFT_SCHEMA_VERSION = 1 as const;

export interface GovernanceDraftPayload {
  schemaVersion: typeof GOVERNANCE_DRAFT_SCHEMA_VERSION;
  draftId: string;
  laneId: GovernanceLaneId;
  laneVersion: string;
  lifecycleState: Extract<
    RouteLifecycleState,
    "DRAFT" | "READY_FOR_TEST"
  >;
  title: string;
  values: Readonly<Record<string, JsonValue>>;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceDraftSummary {
  draftId: string;
  laneId: GovernanceLaneId;
  title: string;
  lifecycleState: GovernanceDraftPayload["lifecycleState"];
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceDraftImportResult {
  valid: boolean;
  draft?: GovernanceDraftPayload;
  errors: string[];
}

function canUseBrowserStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

function storageKey(
  laneId: GovernanceLaneId,
  draftId: string,
): string {
  return `${GOVERNANCE_DRAFT_STORAGE_PREFIX}:${laneId}:${draftId}`;
}

function indexKey(laneId: GovernanceLaneId): string {
  return `${GOVERNANCE_DRAFT_STORAGE_PREFIX}:${laneId}:index`;
}

function createDraftId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    "randomUUID" in globalThis.crypto
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `draft-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isIsoDateString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    !Number.isNaN(Date.parse(value))
  );
}

function validateDraftPayload(
  value: unknown,
): GovernanceDraftImportResult {
  const errors: string[] = [];

  if (!isPlainObject(value)) {
    return {
      valid: false,
      errors: ["Draft payload must be an object."],
    };
  }

  if (
    value.schemaVersion !== GOVERNANCE_DRAFT_SCHEMA_VERSION
  ) {
    errors.push(
      `Unsupported draft schema version "${String(
        value.schemaVersion,
      )}".`,
    );
  }

  if (
    typeof value.draftId !== "string" ||
    value.draftId.trim() === ""
  ) {
    errors.push("Draft ID is required.");
  }

  if (
    typeof value.laneId !== "string" ||
    value.laneId.trim() === ""
  ) {
    errors.push("Governance lane ID is required.");
  }

  if (
    typeof value.laneVersion !== "string" ||
    value.laneVersion.trim() === ""
  ) {
    errors.push("Lane version is required.");
  }

  if (
    value.lifecycleState !== "DRAFT" &&
    value.lifecycleState !== "READY_FOR_TEST"
  ) {
    errors.push(
      'Lifecycle state must be "DRAFT" or "READY_FOR_TEST".',
    );
  }

  if (typeof value.title !== "string") {
    errors.push("Draft title must be a string.");
  }

  if (!isPlainObject(value.values)) {
    errors.push("Draft values must be an object.");
  }

  if (!isIsoDateString(value.createdAt)) {
    errors.push("Draft createdAt must be a valid date.");
  }

  if (!isIsoDateString(value.updatedAt)) {
    errors.push("Draft updatedAt must be a valid date.");
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    draft: value as unknown as GovernanceDraftPayload,
    errors: [],
  };
}

function readDraftIndex(
  laneId: GovernanceLaneId,
): GovernanceDraftSummary[] {
  if (!canUseBrowserStorage()) {
    return [];
  }

  const rawIndex = window.localStorage.getItem(indexKey(laneId));

  if (!rawIndex) {
    return [];
  }

  const parsed = parseJson(rawIndex);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter((item): item is GovernanceDraftSummary => {
    if (!isPlainObject(item)) {
      return false;
    }

    return (
      typeof item.draftId === "string" &&
      item.laneId === laneId &&
      typeof item.title === "string" &&
      (item.lifecycleState === "DRAFT" ||
        item.lifecycleState === "READY_FOR_TEST") &&
      isIsoDateString(item.createdAt) &&
      isIsoDateString(item.updatedAt)
    );
  });
}

function writeDraftIndex(
  laneId: GovernanceLaneId,
  summaries: readonly GovernanceDraftSummary[],
): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(
    indexKey(laneId),
    JSON.stringify(summaries),
  );
}

function upsertDraftSummary(
  draft: GovernanceDraftPayload,
): void {
  const existing = readDraftIndex(draft.laneId);
  const nextSummary: GovernanceDraftSummary = {
    draftId: draft.draftId,
    laneId: draft.laneId,
    title: draft.title,
    lifecycleState: draft.lifecycleState,
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
  };

  const next = [
    nextSummary,
    ...existing.filter(
      (summary) => summary.draftId !== draft.draftId,
    ),
  ].sort(
    (a, b) =>
      Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
  );

  writeDraftIndex(draft.laneId, next);
}

export function createGovernanceDraft(input: {
  laneId: GovernanceLaneId;
  laneVersion: string;
  title?: string;
  values?: Readonly<Record<string, JsonValue>>;
  lifecycleState?: GovernanceDraftPayload["lifecycleState"];
}): GovernanceDraftPayload {
  const now = new Date().toISOString();

  return {
    schemaVersion: GOVERNANCE_DRAFT_SCHEMA_VERSION,
    draftId: createDraftId(),
    laneId: input.laneId,
    laneVersion: input.laneVersion,
    lifecycleState: input.lifecycleState ?? "DRAFT",
    title: input.title?.trim() || "Untitled governance route",
    values: input.values ?? {},
    createdAt: now,
    updatedAt: now,
  };
}

export function saveGovernanceDraft(
  draft: GovernanceDraftPayload,
): GovernanceDraftPayload {
  if (!canUseBrowserStorage()) {
    return draft;
  }

  const updatedDraft: GovernanceDraftPayload = {
    ...draft,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    storageKey(updatedDraft.laneId, updatedDraft.draftId),
    JSON.stringify(updatedDraft),
  );

  upsertDraftSummary(updatedDraft);

  return updatedDraft;
}

export function loadGovernanceDraft(
  laneId: GovernanceLaneId,
  draftId: string,
): GovernanceDraftPayload | undefined {
  if (!canUseBrowserStorage()) {
    return undefined;
  }

  const rawDraft = window.localStorage.getItem(
    storageKey(laneId, draftId),
  );

  if (!rawDraft) {
    return undefined;
  }

  const result = validateDraftPayload(parseJson(rawDraft));

  if (!result.valid || !result.draft) {
    return undefined;
  }

  return result.draft;
}

export function listGovernanceDrafts(
  laneId: GovernanceLaneId,
): GovernanceDraftSummary[] {
  return readDraftIndex(laneId);
}

export function deleteGovernanceDraft(
  laneId: GovernanceLaneId,
  draftId: string,
): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(storageKey(laneId, draftId));

  writeDraftIndex(
    laneId,
    readDraftIndex(laneId).filter(
      (summary) => summary.draftId !== draftId,
    ),
  );
}

export function clearGovernanceDrafts(
  laneId: GovernanceLaneId,
): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  for (const summary of readDraftIndex(laneId)) {
    window.localStorage.removeItem(
      storageKey(laneId, summary.draftId),
    );
  }

  window.localStorage.removeItem(indexKey(laneId));
}

export function exportGovernanceDraft(
  draft: GovernanceDraftPayload,
): string {
  return JSON.stringify(draft, null, 2);
}

export function importGovernanceDraft(
  serializedDraft: string,
): GovernanceDraftImportResult {
  return validateDraftPayload(parseJson(serializedDraft));
}
