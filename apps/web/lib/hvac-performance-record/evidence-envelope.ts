/**
 * Immutable-by-convention evidence envelope schema for HVAC field capture.
 * This module validates structure only: it does NOT authenticate identity,
 * verify instrument calibration, attest measurement truth, or persist data.
 */
export type EvidenceKind = 'PHOTO' | 'MEASUREMENT' | 'OBSERVATION';
export type EvidenceEnvelope = {
  schemaVersion: 'hvac-evidence-envelope-v0.1';
  recordId: string;
  intakeId: string;
  stepNumber: number;
  kind: EvidenceKind;
  capturedAt: string;
  technicianId: string;
  equipmentSerial: string;
  payloadRef: string;
  payloadSha256: string;
  instrumentId: string | null;
  calibrationRef: string | null;
  measurement: {value: number; unit: string} | null;
  observation: string | null;
  source: 'TECHNICIAN_CAPTURE';
  status: 'UNVERIFIED';
};

const sha256Pattern = /^[a-f0-9]{64}$/i;
const allowedKinds: EvidenceKind[] = ['PHOTO', 'MEASUREMENT', 'OBSERVATION'];

export function createEvidenceEnvelope(
  input: Omit<EvidenceEnvelope, 'schemaVersion' | 'source' | 'status'>,
): EvidenceEnvelope {
  const required = ['recordId', 'intakeId', 'technicianId', 'equipmentSerial', 'payloadRef'] as const;
  if (required.some(key => !input[key]?.trim())) throw new Error('Missing required evidence identity or reference');
  if (!Number.isInteger(input.stepNumber) || input.stepNumber < 1 || input.stepNumber > 14)
    throw new Error('Invalid baseline step');
  if (!allowedKinds.includes(input.kind)) throw new Error('Invalid evidence kind');
  if (!Number.isFinite(Date.parse(input.capturedAt))) throw new Error('Invalid capture timestamp');
  if (!sha256Pattern.test(input.payloadSha256)) throw new Error('Invalid SHA-256 digest format');
  if (input.kind === 'MEASUREMENT') {
    if (!input.measurement || !Number.isFinite(input.measurement.value) || !input.measurement.unit.trim())
      throw new Error('Measurement requires a finite value and unit');
    if (!input.instrumentId?.trim()) throw new Error('Measurement requires instrument identity');
  } else if (input.measurement !== null) {
    throw new Error('Measurement payload only permitted for MEASUREMENT');
  }
  if (input.kind === 'OBSERVATION' && !input.observation?.trim())
    throw new Error('Observation text required');
  return {
    ...input,
    schemaVersion: 'hvac-evidence-envelope-v0.1',
    source: 'TECHNICIAN_CAPTURE',
    status: 'UNVERIFIED',
  };
}
