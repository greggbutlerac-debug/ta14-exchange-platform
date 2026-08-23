import type { ActorReference, JsonValue, RecordId, RecordVisibility } from "./types";
import type { GovernedRecordCandidate } from "./runtime-governed-record-candidate";
import {
  preserveGovernedRecordCandidate,
  type PreservedRuntimeGovernedRecord,
} from "./runtime-preserved-governed-record";
import {
  assertRuntimePreservationReady,
  evaluateRuntimePreservationReadiness,
  type RuntimePreservationReadiness,
} from "./runtime-preservation-readiness";
import {
  assertAuthoritativeReceipt,
  AuthoritativePreservationUnavailableError,
  type AuthoritativePreservationReceipt,
  type AuthoritativeRuntimeRecordStore,
} from "./runtime-authoritative-preservation";

export interface PreserveRuntimeCandidateRequest {
  candidate: GovernedRecordCandidate;
  preservedBy: ActorReference;
  authorityBasis: string;
  authorityEvidenceIds?: readonly string[];
  authorityDeclaration?: string;
  preservationNote?: string;
  visibility?: RecordVisibility;
  supersedesRecordId?: RecordId;
  metadata?: Readonly<Record<string, JsonValue>>;
}

export interface PreserveRuntimeCandidateResult {
  readiness: RuntimePreservationReadiness;
  record: PreservedRuntimeGovernedRecord;
  receipt: AuthoritativePreservationReceipt;
}

export function inspectRuntimeCandidateForPreservation(
  candidate: GovernedRecordCandidate,
): RuntimePreservationReadiness {
  return evaluateRuntimePreservationReadiness(candidate);
}

/**
 * Preserve only through an explicitly supplied authoritative server store.
 * There is intentionally no browser/local fallback. If the institutional
 * boundary is unavailable, preservation fails closed and no preservation
 * receipt is issued.
 */
export async function preserveRuntimeCandidate(
  request: PreserveRuntimeCandidateRequest,
  store?: AuthoritativeRuntimeRecordStore,
): Promise<PreserveRuntimeCandidateResult> {
  const readiness = evaluateRuntimePreservationReadiness(request.candidate);
  assertRuntimePreservationReady(request.candidate);

  const authorityBasis = request.authorityBasis.trim();
  if (!authorityBasis) {
    throw new Error("An explicit preservation authority basis is required.");
  }

  if (!store) {
    throw new AuthoritativePreservationUnavailableError();
  }

  const record = preserveGovernedRecordCandidate({
    candidate: request.candidate,
    preservedBy: request.preservedBy,
    authorityBasis,
    authorityEvidenceIds: request.authorityEvidenceIds,
    authorityDeclaration: request.authorityDeclaration,
    preservationNote: request.preservationNote,
    visibility: request.visibility,
    supersedesRecordId: request.supersedesRecordId,
    metadata: request.metadata,
  });

  const receipt = await store.preserve(record);
  assertAuthoritativeReceipt(record, receipt);

  return { readiness, record, receipt };
}
