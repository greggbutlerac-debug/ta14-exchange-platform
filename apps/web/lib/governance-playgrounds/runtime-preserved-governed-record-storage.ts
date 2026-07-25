import type { RecordId } from "./types";
import type {
  PreservedRuntimeGovernedRecord,
  PreservedRuntimeRecordStatus,
} from "./runtime-preserved-governed-record";

const STORAGE_KEY =
  "ta14.runtime-governance.preserved-governed-records.v1";

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
}

function canUseBrowserStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

function isPreservedRuntimeGovernedRecord(
  value: unknown,
): value is PreservedRuntimeGovernedRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

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

function readStoredRecords(): PreservedRuntimeGovernedRecord[] {
  if (!canUseBrowserStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isPreservedRuntimeGovernedRecord);
  } catch {
    return [];
  }
}

function writeStoredRecords(
  records: readonly PreservedRuntimeGovernedRecord[],
): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records),
  );
}

function sortNewestFirst(
  records: readonly PreservedRuntimeGovernedRecord[],
): PreservedRuntimeGovernedRecord[] {
  return [...records].sort((left, right) =>
    right.preservedAt.localeCompare(left.preservedAt),
  );
}

export function listPreservedRuntimeGovernedRecords():
  PreservedRuntimeGovernedRecord[] {
  return sortNewestFirst(readStoredRecords());
}

export function listPreservedRuntimeRecordSummaries():
  PreservedRuntimeRecordSummary[] {
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
  }));
}

export function getPreservedRuntimeGovernedRecord(
  recordId: RecordId,
): PreservedRuntimeGovernedRecord | undefined {
  return readStoredRecords().find(
    (record) => record.recordId === recordId,
  );
}

export function savePreservedRuntimeGovernedRecord(
  record: PreservedRuntimeGovernedRecord,
): PreservedRuntimeGovernedRecord {
  const existingRecords = readStoredRecords();

  if (
    existingRecords.some(
      (existing) => existing.recordId === record.recordId,
    )
  ) {
    throw new Error(
      `Preserved governed record ${record.recordId} already exists and cannot be silently overwritten.`,
    );
  }

  writeStoredRecords(
    sortNewestFirst([record, ...existingRecords]),
  );

  return record;
}

export function updatePreservedRuntimeRecordStatus(
  recordId: RecordId,
  status: Exclude<PreservedRuntimeRecordStatus, "PRESERVED">,
): PreservedRuntimeGovernedRecord {
  const existingRecords = readStoredRecords();
  const index = existingRecords.findIndex(
    (record) => record.recordId === recordId,
  );

  if (index < 0) {
    throw new Error(
      `Preserved governed record ${recordId} was not found.`,
    );
  }

  const existing = existingRecords[index];

  if (existing.status !== "PRESERVED") {
    throw new Error(
      `Preserved governed record ${recordId} is already ${existing.status}.`,
    );
  }

  const updated: PreservedRuntimeGovernedRecord = {
    ...existing,
    status,
  };

  const nextRecords = [...existingRecords];
  nextRecords[index] = updated;

  writeStoredRecords(sortNewestFirst(nextRecords));

  return updated;
}

export function exportPreservedRuntimeRecordById(
  recordId: RecordId,
): string {
  const record = getPreservedRuntimeGovernedRecord(recordId);

  if (!record) {
    throw new Error(
      `Preserved governed record ${recordId} was not found.`,
    );
  }

  return JSON.stringify(record, null, 2);
}

export function deleteAllPreservedRuntimeGovernedRecords(): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
