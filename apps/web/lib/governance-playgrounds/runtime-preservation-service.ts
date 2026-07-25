import type { ActorReference, JsonValue, RecordId, RecordVisibility } from "./types";
import type { GovernedRecordCandidate } from "./runtime-governed-record-candidate";
import {
  preserveGovernedRecordCandidate,
  type PreservedRuntimeGovernedRecord,
} from "./runtime-preserved-governed-record";
import {
  savePreservedRuntimeGovernedRecord,
} from "./runtime-preserved-governed-record-storage";
import {
  assertRuntimePreservationReady,
  evaluateRuntimePreservationReadiness,
  type RuntimePreservationReadiness,
} from "./runtime-preservation-readiness";

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
}

export function inspectRuntimeCandidateForPreservation(
  candidate: GovernedRecordCandidate,
): RuntimePreservationReadiness {
  return evaluateRuntimePreservationReadiness(candidate);
}

export function preserveRuntimeCandidate(
  request: PreserveRuntimeCandidateRequest,
): PreserveRuntimeCandidateResult {
  const readiness = evaluateRuntimePreservationReadiness(
    request.candidate,
  );

  assertRuntimePreservationReady(request.candidate);

  const authorityBasis = request.authorityBasis.trim();

  if (!authorityBasis) {
    throw new Error(
      "An explicit preservation authority basis is required.",
    );
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

  savePreservedRuntimeGovernedRecord(record);

  return {
    readiness,
    record,
  };
}
