import type { RecordId } from "./types";
import type {
  PreservedRuntimeGovernedRecord,
  PreservedRuntimeRecordStatus,
} from "./runtime-preserved-governed-record";

/**
 * Browser-local cache for preserved-record shaped objects.
 *
 * SECURITY / GOVERNANCE BOUNDARY:
 * localStorage is mutable by the browser operator and is NOT authoritative
 * preservation. Objects read from or written to this module are cache copies
 * only. No caller may use successful browser persistence as evidence that an
 * append-only institutional record was durably preserved.
 */
const STORAGE_KEY =
  "ta14.runtime-governance.preserved-governed-record-cache.v2";

export const RUNTIME_RECORD_STORAGE_AUTHORITY = "NON_AUTHORITATIVE_BROWSER_CACHE" as const;

export interface PreservedRuntimeRecordSummary {
  recordId: RecordId;
  title: string;
  status: PreservedRuntimeRecordStatus;
  visibility: PreservedRuntimeGovernedRecord["visibility"];
  recordClass: PreservedRuntimeGovernedRecord["recordClass"];
  preservedAt: string;
  preservedBy: PreservedRuntimeGovernedRecord["preservedBy"];
  routeDraftId: string;
  storedRunId: string;
  determination: PreservedRuntimeGovernedRecord["determination"];
  storageAuthority: typeof RUNTIME_RECORD_STORAGE_AUTHORITY;
}

function canUseBrowserStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isPreservedRuntimeGovernedRecord(value: unknown): value is PreservedRuntimeGovernedRecord {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PreservedRuntimeGovernedRecord>;
  return (
    typeof candidate.recordId === "string" &&
    typeof candidate.schemaVersion === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.preservedAt === "string" &&
    candidate.status !== undefined &&
    candidate.lineage !== undefined &&
    candidate.payload !== undefined &&
    candidate.authority !== undefined
  );
}

function readCachedRecords(): PreservedRuntimeGovernedRecord[] {
  if (!canUseBrowserStorage()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isPreservedRuntimeGovernedRecord) : [];
  } catch {
    return [];
  }
}

function writeCachedRecords(records: readonly PreservedRuntimeGovernedRecord[]): void {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function sortNewestFirst(records: readonly PreservedRuntimeGovernedRecord[]): PreservedRuntimeGovernedRecord[] {
  return [...records].sort((left, right) => right.preservedAt.localeCompare(left.preservedAt));
}

/** @deprecated Non-authoritative browser cache only. */
export function listPreservedRuntimeGovernedRecords(): PreservedRuntimeGovernedRecord[] {
  return sortNewestFirst(readCachedRecords());
}

export function listPreservedRuntimeRecordSummaries(): PreservedRuntimeRecordSummary[] {
  return listPreservedRuntimeGovernedRecords().map((record) => ({
    recordId: record.recordId,
    title: record.title,
    status: record.status,
    visibility: record.visibility,
    recordClass: record.recordClass,
    preservedAt: record.preservedAt,
    preservedBy: record.preservedBy,
    routeDraftId: record.lineage.routeDraftId,
    storedRunId: record.lineage.storedRunId,
    determination: record.determination,
    storageAuthority: RUNTIME_RECORD_STORAGE_AUTHORITY,
  }));
}

/** @deprecated Returns a mutable browser-cache copy, not an authoritative record. */
export function getPreservedRuntimeGovernedRecord(recordId: RecordId): PreservedRuntimeGovernedRecord | undefined {
  return readCachedRecords().find((record) => record.recordId === recordId);
}

/**
 * Cache a record-shaped object for browser display/export convenience.
 * This function deliberately refuses to represent the operation as durable
 * institutional preservation.
 */
export function savePreservedRuntimeGovernedRecord(
  record: PreservedRuntimeGovernedRecord,
): PreservedRuntimeGovernedRecord {
  const existingRecords = readCachedRecords();
  if (existingRecords.some((existing) => existing.recordId === record.recordId)) {
    throw new Error(`Browser cache record ${record.recordId} already exists and cannot be silently overwritten.`);
  }
  writeCachedRecords(sortNewestFirst([record, ...existingRecords]));
  return record;
}

/**
 * Browser status mutation is presentation state only. It cannot supersede,
 * revoke or otherwise mutate an authoritative institutional record.
 */
export function updatePreservedRuntimeRecordStatus(
  recordId: RecordId,
  status: Exclude<PreservedRuntimeRecordStatus, "PRESERVED">,
): PreservedRuntimeGovernedRecord {
  const existingRecords = readCachedRecords();
  const index = existingRecords.findIndex((record) => record.recordId === recordId);
  if (index < 0) throw new Error(`Browser cache record ${recordId} was not found.`);
  const existing = existingRecords[index];
  if (existing.status !== "PRESERVED") {
    throw new Error(`Browser cache record ${recordId} is already ${existing.status}.`);
  }
  const updated = { ...existing, status } as PreservedRuntimeGovernedRecord;
  const nextRecords = [...existingRecords];
  nextRecords[index] = updated;
  writeCachedRecords(sortNewestFirst(nextRecords));
  return updated;
}

export function exportPreservedRuntimeRecordById(recordId: RecordId): string {
  const record = getPreservedRuntimeGovernedRecord(recordId);
  if (!record) throw new Error(`Browser cache record ${recordId} was not found.`);
  return JSON.stringify({
    storageAuthority: RUNTIME_RECORD_STORAGE_AUTHORITY,
    warning: "This export is a mutable browser-cache copy and is not proof of authoritative institutional preservation.",
    record,
  }, null, 2);
}

export function deleteAllPreservedRuntimeGovernedRecords(): void {
  if (!canUseBrowserStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
