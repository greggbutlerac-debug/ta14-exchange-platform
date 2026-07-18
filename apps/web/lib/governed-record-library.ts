import type {
  GovernedRecord,
  GovernedRecordIntakeDraft,
} from "./governed-records";

const governedRecordLibraryKey = "ta14-governed-record-library-v1";
const governedRecordIntakeKey = "ta14-governed-record-intake-v1";

export type StoredGovernedRecord = {
  id: string;
  record: GovernedRecord;
  savedAt: string;
};

export type StoredGovernedRecordIntake = {
  id: string;
  intake: GovernedRecordIntakeDraft;
  savedAt: string;
};

function canUseBrowserStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJsonArray<T>(key: string): T[] {
  if (!canUseBrowserStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;

    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    window.localStorage.removeItem(key);
    return [];
  }
}

function writeJsonArray<T>(key: string, value: T[]): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function listStoredGovernedRecords(): StoredGovernedRecord[] {
  return readJsonArray<StoredGovernedRecord>(governedRecordLibraryKey)
    .filter(
      (item) =>
        Boolean(item) &&
        typeof item.id === "string" &&
        typeof item.savedAt === "string" &&
        Boolean(item.record),
    )
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function getStoredGovernedRecord(
  id: string,
): StoredGovernedRecord | null {
  return (
    listStoredGovernedRecords().find((item) => item.id === id) ?? null
  );
}

export function saveStoredGovernedRecord(
  record: GovernedRecord,
  existingId?: string,
): StoredGovernedRecord {
  const savedAt = new Date().toISOString();
  const records = listStoredGovernedRecords();
  const id = existingId?.trim() || record.recordId;

  const stored: StoredGovernedRecord = {
    id,
    record: {
      ...record,
      updatedAt: savedAt,
    },
    savedAt,
  };

  const next = [
    stored,
    ...records.filter((item) => item.id !== id),
  ];

  writeJsonArray(governedRecordLibraryKey, next);

  return stored;
}

export function deleteStoredGovernedRecord(id: string): void {
  const next = listStoredGovernedRecords().filter(
    (item) => item.id !== id,
  );

  writeJsonArray(governedRecordLibraryKey, next);
}

export function listStoredGovernedRecordIntakes(): StoredGovernedRecordIntake[] {
  return readJsonArray<StoredGovernedRecordIntake>(governedRecordIntakeKey)
    .filter(
      (item) =>
        Boolean(item) &&
        typeof item.id === "string" &&
        typeof item.savedAt === "string" &&
        Boolean(item.intake),
    )
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function getStoredGovernedRecordIntake(
  id: string,
): StoredGovernedRecordIntake | null {
  return (
    listStoredGovernedRecordIntakes().find((item) => item.id === id) ?? null
  );
}

export function saveStoredGovernedRecordIntake(
  intake: GovernedRecordIntakeDraft,
  existingId?: string,
): StoredGovernedRecordIntake {
  const savedAt = new Date().toISOString();
  const intakes = listStoredGovernedRecordIntakes();
  const id = existingId?.trim() || intake.intakeId;

  const stored: StoredGovernedRecordIntake = {
    id,
    intake,
    savedAt,
  };

  const next = [
    stored,
    ...intakes.filter((item) => item.id !== id),
  ];

  writeJsonArray(governedRecordIntakeKey, next);

  return stored;
}

export function deleteStoredGovernedRecordIntake(id: string): void {
  const next = listStoredGovernedRecordIntakes().filter(
    (item) => item.id !== id,
  );

  writeJsonArray(governedRecordIntakeKey, next);
}

export function clearGovernedRecordWorkspace(): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(governedRecordIntakeKey);
}
