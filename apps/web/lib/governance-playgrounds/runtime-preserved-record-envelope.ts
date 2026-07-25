import type { JsonValue } from "./types";
import type { PreservedRuntimeGovernedRecord } from "./runtime-preserved-governed-record";
import {
  createPreservedRuntimeRecordIntegrity,
  verifyPreservedRuntimeRecordIntegrity,
  type PreservedRuntimeRecordIntegrity,
} from "./runtime-preserved-record-integrity";
import {
  verifyPreservedRuntimeGovernedRecord,
  type PreservedRuntimeRecordVerification,
} from "./runtime-preserved-record-verification";

export const PRESERVED_RUNTIME_ENVELOPE_SCHEMA_VERSION = "1.0.0";

export interface PreservedRuntimeRecordEnvelope {
  envelopeSchemaVersion: string;
  createdAt: string;
  record: PreservedRuntimeGovernedRecord;
  integrity: PreservedRuntimeRecordIntegrity;
  metadata: Readonly<Record<string, JsonValue>>;
}

export interface PreservedRuntimeEnvelopeVerification {
  verifiedAt: string;
  recordVerification: PreservedRuntimeRecordVerification;
  integrityValid: boolean;
  envelopeValid: boolean;
  reasons: readonly string[];
}

export interface CreatePreservedRuntimeEnvelopeInput {
  record: PreservedRuntimeGovernedRecord;
  metadata?: Readonly<Record<string, JsonValue>>;
}

export async function createPreservedRuntimeRecordEnvelope(
  input: CreatePreservedRuntimeEnvelopeInput,
): Promise<PreservedRuntimeRecordEnvelope> {
  const integrity = await createPreservedRuntimeRecordIntegrity(
    input.record,
  );

  return {
    envelopeSchemaVersion:
      PRESERVED_RUNTIME_ENVELOPE_SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    record: input.record,
    integrity,
    metadata: input.metadata ?? {},
  };
}

export async function verifyPreservedRuntimeRecordEnvelope(
  envelope: PreservedRuntimeRecordEnvelope,
): Promise<PreservedRuntimeEnvelopeVerification> {
  const reasons: string[] = [];

  if (
    envelope.envelopeSchemaVersion !==
    PRESERVED_RUNTIME_ENVELOPE_SCHEMA_VERSION
  ) {
    reasons.push(
      `Unsupported envelope schema version: ${envelope.envelopeSchemaVersion}.`,
    );
  }

  if (
    envelope.record.recordId !== envelope.integrity.recordId
  ) {
    reasons.push(
      "Envelope record identifier does not match the integrity record identifier.",
    );
  }

  if (
    envelope.record.schemaVersion !==
    envelope.integrity.schemaVersion
  ) {
    reasons.push(
      "Envelope record schema version does not match the integrity schema version.",
    );
  }

  const recordVerification =
    verifyPreservedRuntimeGovernedRecord(envelope.record);

  const integrityValid =
    await verifyPreservedRuntimeRecordIntegrity(
      envelope.record,
      envelope.integrity,
    );

  if (!recordVerification.structurallyValid) {
    reasons.push(
      "The preserved record failed structural verification.",
    );
  }

  if (!recordVerification.preservationValid) {
    reasons.push(
      "The preserved record is not valid for active reliance.",
    );
  }

  if (!integrityValid) {
    reasons.push(
      "The preserved record content does not match its stored SHA-256 digest.",
    );
  }

  return {
    verifiedAt: new Date().toISOString(),
    recordVerification,
    integrityValid,
    envelopeValid:
      reasons.length === 0 &&
      recordVerification.preservationValid &&
      integrityValid,
    reasons,
  };
}

export function exportPreservedRuntimeRecordEnvelope(
  envelope: PreservedRuntimeRecordEnvelope,
): string {
  return JSON.stringify(envelope, null, 2);
}
