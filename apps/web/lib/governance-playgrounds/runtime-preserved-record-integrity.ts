import type { JsonValue } from "./types";
import type { PreservedRuntimeGovernedRecord } from "./runtime-preserved-governed-record";

export interface PreservedRuntimeRecordIntegrity {
  algorithm: "SHA-256";
  digest: string;
  canonicalizedAt: string;
  recordId: string;
  schemaVersion: string;
}

function normalizeJsonValue(value: unknown): JsonValue {
  if (value === null) {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeJsonValue(item));
  }

  if (typeof value === "object") {
    const entries = Object.entries(
      value as Record<string, unknown>,
    )
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([leftKey], [rightKey]) =>
        leftKey.localeCompare(rightKey),
      );

    return Object.fromEntries(
      entries.map(([key, entryValue]) => [
        key,
        normalizeJsonValue(entryValue),
      ]),
    );
  }

  return String(value);
}

export function canonicalizePreservedRuntimeRecord(
  record: PreservedRuntimeGovernedRecord,
): string {
  return JSON.stringify(normalizeJsonValue(record));
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);

  if (
    typeof globalThis.crypto !== "undefined" &&
    globalThis.crypto.subtle
  ) {
    const digest = await globalThis.crypto.subtle.digest(
      "SHA-256",
      encoded,
    );

    return bytesToHex(new Uint8Array(digest));
  }

  throw new Error(
    "SHA-256 digest generation is unavailable in this runtime.",
  );
}

export async function createPreservedRuntimeRecordIntegrity(
  record: PreservedRuntimeGovernedRecord,
): Promise<PreservedRuntimeRecordIntegrity> {
  const canonical = canonicalizePreservedRuntimeRecord(record);
  const digest = await sha256(canonical);

  return {
    algorithm: "SHA-256",
    digest,
    canonicalizedAt: new Date().toISOString(),
    recordId: record.recordId,
    schemaVersion: record.schemaVersion,
  };
}

export async function verifyPreservedRuntimeRecordIntegrity(
  record: PreservedRuntimeGovernedRecord,
  integrity: PreservedRuntimeRecordIntegrity,
): Promise<boolean> {
  if (
    integrity.algorithm !== "SHA-256" ||
    integrity.recordId !== record.recordId ||
    integrity.schemaVersion !== record.schemaVersion
  ) {
    return false;
  }

  const current = await createPreservedRuntimeRecordIntegrity(
    record,
  );

  return current.digest === integrity.digest;
}
