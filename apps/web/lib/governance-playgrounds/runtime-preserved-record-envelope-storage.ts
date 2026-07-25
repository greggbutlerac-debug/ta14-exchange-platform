import type { RecordId } from "./types";
import type {
  PreservedRuntimeRecordEnvelope,
  PreservedRuntimeEnvelopeVerification,
} from "./runtime-preserved-record-envelope";
import {
  verifyPreservedRuntimeRecordEnvelope,
} from "./runtime-preserved-record-envelope";

const STORAGE_KEY =
  "ta14.runtime-governance.preserved-record-envelopes.v1";

function canUseBrowserStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

function isPreservedRuntimeRecordEnvelope(
  value: unknown,
): value is PreservedRuntimeRecordEnvelope {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate =
    value as Partial<PreservedRuntimeRecordEnvelope>;

  return (
    typeof candidate.envelopeSchemaVersion === "string" &&
    typeof candidate.createdAt === "string" &&
    candidate.record !== undefined &&
    candidate.integrity !== undefined &&
    candidate.metadata !== undefined
  );
}

function readStoredEnvelopes():
  PreservedRuntimeRecordEnvelope[] {
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

    return parsed.filter(
      isPreservedRuntimeRecordEnvelope,
    );
  } catch {
    return [];
  }
}

function writeStoredEnvelopes(
  envelopes: readonly PreservedRuntimeRecordEnvelope[],
): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(envelopes),
  );
}

function sortNewestFirst(
  envelopes: readonly PreservedRuntimeRecordEnvelope[],
): PreservedRuntimeRecordEnvelope[] {
  return [...envelopes].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

export function listPreservedRuntimeRecordEnvelopes():
  PreservedRuntimeRecordEnvelope[] {
  return sortNewestFirst(readStoredEnvelopes());
}

export function getPreservedRuntimeRecordEnvelope(
  recordId: RecordId,
): PreservedRuntimeRecordEnvelope | undefined {
  return readStoredEnvelopes().find(
    (envelope) => envelope.record.recordId === recordId,
  );
}

export function savePreservedRuntimeRecordEnvelope(
  envelope: PreservedRuntimeRecordEnvelope,
): PreservedRuntimeRecordEnvelope {
  const existingEnvelopes = readStoredEnvelopes();

  if (
    existingEnvelopes.some(
      (existing) =>
        existing.record.recordId ===
        envelope.record.recordId,
    )
  ) {
    throw new Error(
      `A preserved-record envelope already exists for ${envelope.record.recordId} and cannot be silently overwritten.`,
    );
  }

  writeStoredEnvelopes(
    sortNewestFirst([
      envelope,
      ...existingEnvelopes,
    ]),
  );

  return envelope;
}

export async function verifyStoredPreservedRuntimeRecordEnvelope(
  recordId: RecordId,
): Promise<PreservedRuntimeEnvelopeVerification> {
  const envelope =
    getPreservedRuntimeRecordEnvelope(recordId);

  if (!envelope) {
    throw new Error(
      `No preserved-record envelope was found for ${recordId}.`,
    );
  }

  return verifyPreservedRuntimeRecordEnvelope(envelope);
}

export function exportPreservedRuntimeRecordEnvelopeById(
  recordId: RecordId,
): string {
  const envelope =
    getPreservedRuntimeRecordEnvelope(recordId);

  if (!envelope) {
    throw new Error(
      `No preserved-record envelope was found for ${recordId}.`,
    );
  }

  return JSON.stringify(envelope, null, 2);
}

export function deleteAllPreservedRuntimeRecordEnvelopes(): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
