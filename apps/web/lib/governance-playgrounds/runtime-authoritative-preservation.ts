import type { RecordId } from "./types";
import type { PreservedRuntimeGovernedRecord } from "./runtime-preserved-governed-record";

/**
 * TA-14 authoritative runtime preservation boundary.
 *
 * This contract deliberately separates creation of a record-shaped object from
 * durable institutional preservation. An implementation is authoritative only
 * when it can return a durable receipt from a server-controlled append-only
 * persistence boundary. Browser/local persistence MUST NOT implement this
 * interface as authoritative storage.
 */
export interface AuthoritativePreservationReceipt {
  recordId: RecordId;
  receiptId: string;
  persistedAt: string;
  contentDigest: string;
  storageAuthority: "AUTHORITATIVE_SERVER_APPEND_ONLY";
  immutable: true;
}

export interface AuthoritativePreservationResult {
  record: PreservedRuntimeGovernedRecord;
  receipt: AuthoritativePreservationReceipt;
}

export interface AuthoritativeRuntimeRecordStore {
  preserve(record: PreservedRuntimeGovernedRecord): Promise<AuthoritativePreservationReceipt>;
  get(recordId: RecordId): Promise<PreservedRuntimeGovernedRecord | undefined>;
}

export class AuthoritativePreservationUnavailableError extends Error {
  constructor(message = "Authoritative server-side preservation is unavailable. Preservation fails closed.") {
    super(message);
    this.name = "AuthoritativePreservationUnavailableError";
  }
}

export function assertAuthoritativeReceipt(
  record: PreservedRuntimeGovernedRecord,
  receipt: AuthoritativePreservationReceipt,
): void {
  if (receipt.storageAuthority !== "AUTHORITATIVE_SERVER_APPEND_ONLY") {
    throw new Error("Preservation receipt does not identify the authoritative server append-only boundary.");
  }
  if (receipt.immutable !== true) {
    throw new Error("Preservation receipt does not assert immutable append-only semantics.");
  }
  if (receipt.recordId !== record.recordId) {
    throw new Error(`Preservation receipt recordId ${receipt.recordId} does not match record ${record.recordId}.`);
  }
  if (!receipt.receiptId.trim() || !receipt.persistedAt.trim() || !receipt.contentDigest.trim()) {
    throw new Error("Preservation receipt is incomplete.");
  }
}
