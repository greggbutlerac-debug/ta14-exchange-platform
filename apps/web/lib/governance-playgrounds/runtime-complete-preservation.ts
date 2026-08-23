import type {
  ActorReference,
  JsonValue,
  RecordId,
  RecordVisibility,
} from "./types";
import type { GovernedRecordCandidate } from "./runtime-governed-record-candidate";
import type { PreservedRuntimeGovernedRecord } from "./runtime-preserved-governed-record";
import type { PreservedRuntimeRecordEnvelope } from "./runtime-preserved-record-envelope";
import {
  createPreservedRuntimeRecordEnvelope,
} from "./runtime-preserved-record-envelope";
import {
  savePreservedRuntimeRecordEnvelope,
} from "./runtime-preserved-record-envelope-storage";
import {
  preserveRuntimeCandidate,
  type PreserveRuntimeCandidateResult,
} from "./runtime-preservation-service";

export interface CompleteRuntimePreservationRequest {
  candidate: GovernedRecordCandidate;
  preservedBy: ActorReference;
  authorityBasis: string;
  authorityEvidenceIds?: readonly string[];
  authorityDeclaration?: string;
  preservationNote?: string;
  visibility?: RecordVisibility;
  supersedesRecordId?: RecordId;
  recordMetadata?: Readonly<Record<string, JsonValue>>;
  envelopeMetadata?: Readonly<Record<string, JsonValue>>;
}

export interface CompleteRuntimePreservationResult {
  preservation: PreserveRuntimeCandidateResult;
  record: PreservedRuntimeGovernedRecord;
  envelope: PreservedRuntimeRecordEnvelope;
}

export async function completeRuntimePreservation(
  request: CompleteRuntimePreservationRequest,
): Promise<CompleteRuntimePreservationResult> {
  const preservation = await preserveRuntimeCandidate({
    candidate: request.candidate,
    preservedBy: request.preservedBy,
    authorityBasis: request.authorityBasis,
    authorityEvidenceIds: request.authorityEvidenceIds,
    authorityDeclaration: request.authorityDeclaration,
    preservationNote: request.preservationNote,
    visibility: request.visibility,
    supersedesRecordId: request.supersedesRecordId,
    metadata: request.recordMetadata,
  });

  const envelope = await createPreservedRuntimeRecordEnvelope({
    record: preservation.record,
    metadata: request.envelopeMetadata,
  });

  savePreservedRuntimeRecordEnvelope(envelope);

  return {
    preservation,
    record: preservation.record,
    envelope,
  };
}
