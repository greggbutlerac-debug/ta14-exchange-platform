/**
 * Evidence envelope schema for HVAC field capture.
 *
 * This module validates structure only: it does NOT authenticate identity,
 * verify instrument calibration, attest measurement truth, compute or
 * authenticate digests, or persist data. The returned envelope is frozen in
 * memory; that is not tamper evidence, sealing, or secure storage.
 *
 * Input is treated as untrusted (e.g. a JavaScript caller or deserialized
 * request body). Only the allowlisted capture fields below are accepted;
 * any other own property — including attempts to supply `status`, `source`,
 * `schemaVersion`, `dddStatus`, `verifiedBy`, or `interventionAuthorization` —
 * is rejected. Technician-captured evidence is always UNVERIFIED here;
 * verification, DDD issuance, and authorization belong to separate authorities.
 */
export type EvidenceKind = 'PHOTO' | 'MEASUREMENT' | 'OBSERVATION';
export type EvidenceEnvelope = {
  readonly schemaVersion: 'hvac-evidence-envelope-v0.1';
  readonly recordId: string;
  readonly intakeId: string;
  readonly stepNumber: number;
  readonly kind: EvidenceKind;
  readonly capturedAt: string;
  readonly technicianId: string;
  readonly equipmentSerial: string;
  readonly payloadRef: string;
  readonly payloadSha256: string;
  readonly instrumentId: string | null;
  readonly calibrationRef: string | null;
  readonly measurement: Readonly<{value: number; unit: string}> | null;
  readonly observation: string | null;
  readonly source: 'TECHNICIAN_CAPTURE';
  readonly status: 'UNVERIFIED';
};

export type EvidenceEnvelopeInput = {
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
};

const INPUT_FIELDS = [
  'recordId', 'intakeId', 'stepNumber', 'kind', 'capturedAt', 'technicianId',
  'equipmentSerial', 'payloadRef', 'payloadSha256', 'instrumentId',
  'calibrationRef', 'measurement', 'observation',
] as const satisfies ReadonlyArray<keyof EvidenceEnvelopeInput>;
const MEASUREMENT_FIELDS = ['value', 'unit'] as const;

const sha256Pattern = /^[a-f0-9]{64}$/i;
const allowedKinds: ReadonlyArray<string> = ['PHOTO', 'MEASUREMENT', 'OBSERVATION'];

function fail(message: string): never {
  throw new Error(message);
}

/**
 * Reads an untrusted plain object into a snapshot of its own data properties.
 * Rejects non-plain objects, symbol keys, accessors (whose value could change
 * between validation and use), unknown keys, and missing keys.
 */
function readExactRecord(
  value: unknown,
  fields: ReadonlyArray<string>,
  label: string,
): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) fail(label + ' must be a plain object');
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) fail(label + ' must be a plain object');
  if (Object.getOwnPropertySymbols(value).length > 0) fail(label + ' contains unsupported symbol keys');
  const allowed = new Set(fields);
  const snapshot: Record<string, unknown> = Object.create(null);
  for (const key of Object.getOwnPropertyNames(value)) {
    if (!allowed.has(key)) fail(label + ' contains unknown field ' + JSON.stringify(key.slice(0, 64)));
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (!('value' in descriptor)) fail(label + ' field ' + key + ' must be a data property');
    snapshot[key] = descriptor.value;
  }
  for (const key of fields) {
    if (!Object.prototype.hasOwnProperty.call(snapshot, key)) fail(label + ' missing field ' + key);
  }
  return snapshot;
}

function requireText(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) fail('Missing required evidence field ' + field);
  return value;
}

function optionalText(value: unknown, field: string): string | null {
  return value === null ? null : requireText(value, field);
}

export function createEvidenceEnvelope(input: EvidenceEnvelopeInput): EvidenceEnvelope;
export function createEvidenceEnvelope(input: unknown): EvidenceEnvelope;
export function createEvidenceEnvelope(input: unknown): EvidenceEnvelope {
  const raw = readExactRecord(input, INPUT_FIELDS, 'Evidence input');

  const recordId = requireText(raw.recordId, 'recordId');
  const intakeId = requireText(raw.intakeId, 'intakeId');
  const technicianId = requireText(raw.technicianId, 'technicianId');
  const equipmentSerial = requireText(raw.equipmentSerial, 'equipmentSerial');
  const payloadRef = requireText(raw.payloadRef, 'payloadRef');

  const stepNumber = raw.stepNumber;
  if (typeof stepNumber !== 'number' || !Number.isInteger(stepNumber) || stepNumber < 1 || stepNumber > 14)
    fail('Invalid baseline step');

  const kind = raw.kind;
  if (typeof kind !== 'string' || !allowedKinds.includes(kind)) fail('Invalid evidence kind');

  const capturedAt = raw.capturedAt;
  if (typeof capturedAt !== 'string' || !Number.isFinite(Date.parse(capturedAt)))
    fail('Invalid capture timestamp');

  const payloadSha256 = raw.payloadSha256;
  if (typeof payloadSha256 !== 'string' || !sha256Pattern.test(payloadSha256))
    fail('Invalid SHA-256 digest format');

  const instrumentId = optionalText(raw.instrumentId, 'instrumentId');
  const calibrationRef = optionalText(raw.calibrationRef, 'calibrationRef');
  const observation = optionalText(raw.observation, 'observation');

  let measurement: Readonly<{value: number; unit: string}> | null = null;
  if (kind === 'MEASUREMENT') {
    if (raw.measurement === null) fail('Measurement requires a finite value and unit');
    const m = readExactRecord(raw.measurement, MEASUREMENT_FIELDS, 'Measurement');
    if (typeof m.value !== 'number' || !Number.isFinite(m.value) || typeof m.unit !== 'string' || !m.unit.trim())
      fail('Measurement requires a finite value and unit');
    if (instrumentId === null) fail('Measurement requires instrument identity');
    measurement = Object.freeze({value: m.value, unit: m.unit});
  } else if (raw.measurement !== null) {
    fail('Measurement payload only permitted for MEASUREMENT');
  }
  if (kind === 'OBSERVATION' && observation === null) fail('Observation text required');

  return Object.freeze({
    schemaVersion: 'hvac-evidence-envelope-v0.1',
    recordId,
    intakeId,
    stepNumber,
    kind: kind as EvidenceKind,
    capturedAt,
    technicianId,
    equipmentSerial,
    payloadRef,
    payloadSha256,
    instrumentId,
    calibrationRef,
    measurement,
    observation,
    source: 'TECHNICIAN_CAPTURE',
    status: 'UNVERIFIED',
  });
}
