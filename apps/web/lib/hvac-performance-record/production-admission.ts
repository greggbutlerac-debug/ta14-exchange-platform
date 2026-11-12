/**
 * HPR production baseline admission precondition — NON-OPERATIONAL.
 *
 * Chain of custody this gate sits inside (each stage a separate authority):
 *   Technician → Evidence Capture → Independent Verification → HVAC Analyzer
 *   → DDD → Separate Execution Authorization → Governor
 *
 * This module only checks that caller-supplied claims about a baseline, its
 * evidence envelopes, and verification receipts are internally consistent.
 * It does NOT issue a DDD, authorize intervention, freeze or persist a
 * baseline, verify identity, compute digests, or authenticate anything.
 *
 * A verification receipt here is a plain object supplied by the caller. It is
 * NOT authenticated: nothing proves a trusted server-side verifier produced
 * it, that `serverComputedSha256` was computed by a server, or that the
 * principal ids came from an identity provider. A TypeScript brand, a frozen
 * object, or a client-provided signature would not change that. Until a
 * trusted verification authority, authenticated storage, and authenticated
 * identities exist and are wired in server-side, this gate can never return
 * `admissible: true` (enforced by the result type) and always reports
 * TRUSTED_VERIFICATION_AUTHORITY_UNAVAILABLE.
 */
import {HVAC_BASELINE_STEP_TITLES} from './step-definitions';

export const PRODUCTION_ADMISSION_OPERATIONAL = false as const;

export type BaselineZone = 'INDOOR' | 'OUTDOOR_SYSTEM_CLOSURE';

/** Canonical zone per step: steps 1–7 indoor (air handler), 8–14 outdoor / system closure. */
export const HVAC_BASELINE_STEP_ZONES: ReadonlyArray<BaselineZone> = Object.freeze(
  HVAC_BASELINE_STEP_TITLES.map((_, i): BaselineZone => (i < 7 ? 'INDOOR' : 'OUTDOOR_SYSTEM_CLOSURE')),
);
const REQUIRED_STEPS = 14;
if (HVAC_BASELINE_STEP_ZONES.length !== REQUIRED_STEPS) {
  throw new Error('Canonical HVAC baseline must define exactly 14 steps');
}

export type ProductionBaselineCandidate = {
  intakeId: string;
  frozenAt: string | null;
  steps: ReadonlyArray<{
    number: number;
    zone: BaselineZone;
    technicianAttested: boolean;
    evidenceRefs: ReadonlyArray<string>;
  }>;
  unresolvedSafetyStops: ReadonlyArray<string>;
};

/** Evidence envelope as produced by createEvidenceEnvelope (always UNVERIFIED). */
export type AdmissionEvidenceEnvelope = {
  schemaVersion: 'hvac-evidence-envelope-v0.1';
  recordId: string;
  intakeId: string;
  stepNumber: number;
  kind: 'PHOTO' | 'MEASUREMENT' | 'OBSERVATION';
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

/**
 * An UNAUTHENTICATED claim that independent verification occurred. Field
 * names describe what a future trusted verifier must attest; nothing here
 * proves that it did.
 */
export type VerificationReceiptClaim = {
  receiptId: string;
  evidenceRecordId: string;
  intakeId: string;
  stepNumber: number;
  serverComputedSha256: string;
  technicianPrincipalId: string;
  verifierPrincipalId: string;
  verification: 'VERIFIED' | 'UNVERIFIED' | 'REJECTED';
  stored: boolean;
  digestVerified: boolean;
  identityVerified: boolean;
  calibrationVerified: boolean;
};

export type ProductionAdmissionInput = {
  baseline: ProductionBaselineCandidate;
  evidence: ReadonlyArray<AdmissionEvidenceEnvelope>;
  receipts: ReadonlyArray<VerificationReceiptClaim>;
};

export type AdmissionRejectionCode =
  | 'TRUSTED_VERIFICATION_AUTHORITY_UNAVAILABLE'
  | 'MALFORMED_INPUT'
  | 'MISSING_INTAKE_IDENTITY'
  | 'BASELINE_ALREADY_FROZEN'
  | 'UNRESOLVED_SAFETY_STOP'
  | 'STEP_COUNT_INVALID'
  | 'STEP_OUT_OF_ORDER'
  | 'STEP_ZONE_MISMATCH'
  | 'STEP_NOT_ATTESTED'
  | 'STEP_EVIDENCE_MISSING'
  | 'STEP_EVIDENCE_DUPLICATE'
  | 'EVIDENCE_RECORD_MISSING'
  | 'EVIDENCE_RECORD_DUPLICATE'
  | 'EVIDENCE_UNREFERENCED'
  | 'EVIDENCE_INTAKE_MISMATCH'
  | 'EVIDENCE_STEP_MISMATCH'
  | 'RECEIPT_DUPLICATE_ID'
  | 'RECEIPT_UNMATCHED'
  | 'RECEIPT_MISSING'
  | 'RECEIPT_CONFLICT'
  | 'RECEIPT_BINDING_MISMATCH'
  | 'RECEIPT_DIGEST_MISMATCH'
  | 'RECEIPT_TECHNICIAN_MISMATCH'
  | 'SEPARATION_OF_DUTIES_VIOLATION'
  | 'RECEIPT_NOT_VERIFIED'
  | 'RECEIPT_CHECK_FAILED';

export type AdmissionRejection = {
  code: AdmissionRejectionCode;
  detail: string;
  step?: number;
  recordId?: string;
  receiptId?: string;
  path?: string;
};

export type AdmissionResult = {
  /** Always false: no trusted verification authority exists. */
  readonly admissible: false;
  readonly operational: typeof PRODUCTION_ADMISSION_OPERATIONAL;
  /**
   * True only when the supplied (unauthenticated) claims are well-formed and
   * mutually consistent. This is NOT admissibility and must not be used as
   * a substitute for it.
   */
  readonly claimsConsistent: boolean;
  readonly rejections: ReadonlyArray<AdmissionRejection>;
};

const AUTHORITY_UNAVAILABLE: AdmissionRejection = Object.freeze({
  code: 'TRUSTED_VERIFICATION_AUTHORITY_UNAVAILABLE',
  detail:
    'Receipts and principal ids are unauthenticated caller-supplied claims; no trusted server-side ' +
    'verifier, authenticated storage, or identity provider is implemented.',
});

// ---------------------------------------------------------------------------
// Untrusted-input snapshotting. Anything unexpected becomes MALFORMED_INPUT.
// ---------------------------------------------------------------------------

class MalformedInput extends Error {
  constructor(readonly path: string, detail: string) {
    super(detail);
  }
}

const MAX_ITEMS = 1024;
const sha256Pattern = /^[a-f0-9]{64}$/i;

function record(value: unknown, fields: ReadonlyArray<string>, path: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new MalformedInput(path, 'must be a plain object');
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) throw new MalformedInput(path, 'must be a plain object');
  if (Object.getOwnPropertySymbols(value).length > 0) throw new MalformedInput(path, 'symbol keys not permitted');
  const allowed = new Set(fields);
  const out: Record<string, unknown> = Object.create(null);
  for (const key of Object.getOwnPropertyNames(value)) {
    if (!allowed.has(key)) throw new MalformedInput(path, 'unexpected field ' + JSON.stringify(key.slice(0, 64)));
    const d = Object.getOwnPropertyDescriptor(value, key)!;
    if (!('value' in d)) throw new MalformedInput(path + '.' + key, 'must be a data property');
    out[key] = d.value;
  }
  for (const key of fields) {
    if (!Object.prototype.hasOwnProperty.call(out, key)) throw new MalformedInput(path, 'missing field ' + key);
  }
  return out;
}

function list(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype)
    throw new MalformedInput(path, 'must be an array');
  if (value.length > MAX_ITEMS) throw new MalformedInput(path, 'too many items');
  if (Object.getOwnPropertySymbols(value).length > 0) throw new MalformedInput(path, 'symbol keys not permitted');
  const keys = Object.getOwnPropertyNames(value);
  if (keys.length !== value.length + 1) throw new MalformedInput(path, 'sparse arrays or extra properties not permitted');
  const out: unknown[] = [];
  for (let i = 0; i < value.length; i++) {
    const d = Object.getOwnPropertyDescriptor(value, String(i));
    if (!d || !('value' in d)) throw new MalformedInput(path + '[' + i + ']', 'must be a data element');
    out.push(d.value);
  }
  return out;
}

function str(value: unknown, path: string): string {
  if (typeof value !== 'string') throw new MalformedInput(path, 'must be a string');
  return value;
}

function text(value: unknown, path: string): string {
  const s = str(value, path);
  if (!s.trim() || s !== s.trim()) throw new MalformedInput(path, 'must be non-empty with no surrounding whitespace');
  return s;
}

function bool(value: unknown, path: string): boolean {
  if (typeof value !== 'boolean') throw new MalformedInput(path, 'must be a boolean');
  return value;
}

function int(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) throw new MalformedInput(path, 'must be an integer');
  return value;
}

function oneOf<T extends string>(value: unknown, allowed: ReadonlyArray<T>, path: string): T {
  if (typeof value !== 'string' || !(allowed as ReadonlyArray<string>).includes(value))
    throw new MalformedInput(path, 'unexpected value');
  return value as T;
}

function sha(value: unknown, path: string): string {
  const s = str(value, path);
  if (!sha256Pattern.test(s)) throw new MalformedInput(path, 'must be a 64-character hex SHA-256 digest');
  return s.toLowerCase();
}

function nullableText(value: unknown, path: string): string | null {
  return value === null ? null : text(value, path);
}

type Step = {number: number; zone: BaselineZone; technicianAttested: boolean; evidenceRefs: string[]};
type Baseline = {intakeId: string; frozenAt: string | null; steps: Step[]; unresolvedSafetyStops: string[]};
type Evidence = {recordId: string; intakeId: string; stepNumber: number; technicianId: string; payloadSha256: string};
type Receipt = VerificationReceiptClaim;

const ZONES: ReadonlyArray<BaselineZone> = ['INDOOR', 'OUTDOOR_SYSTEM_CLOSURE'];
const VERIFICATION_STATES = ['VERIFIED', 'UNVERIFIED', 'REJECTED'] as const;

function readBaseline(value: unknown): Baseline {
  const b = record(value, ['intakeId', 'frozenAt', 'steps', 'unresolvedSafetyStops'], 'baseline');
  return {
    intakeId: str(b.intakeId, 'baseline.intakeId'),
    frozenAt: b.frozenAt === null ? null : str(b.frozenAt, 'baseline.frozenAt'),
    unresolvedSafetyStops: list(b.unresolvedSafetyStops, 'baseline.unresolvedSafetyStops')
      .map((s, i) => str(s, 'baseline.unresolvedSafetyStops[' + i + ']')),
    steps: list(b.steps, 'baseline.steps').map((raw, i) => {
      const p = 'baseline.steps[' + i + ']';
      const s = record(raw, ['number', 'zone', 'technicianAttested', 'evidenceRefs'], p);
      return {
        number: int(s.number, p + '.number'),
        zone: oneOf(s.zone, ZONES, p + '.zone'),
        technicianAttested: bool(s.technicianAttested, p + '.technicianAttested'),
        evidenceRefs: list(s.evidenceRefs, p + '.evidenceRefs').map((r, j) => str(r, p + '.evidenceRefs[' + j + ']')),
      };
    }),
  };
}

const ENVELOPE_FIELDS = [
  'schemaVersion', 'recordId', 'intakeId', 'stepNumber', 'kind', 'capturedAt', 'technicianId',
  'equipmentSerial', 'payloadRef', 'payloadSha256', 'instrumentId', 'calibrationRef',
  'measurement', 'observation', 'source', 'status',
] as const;

function readEvidence(value: unknown, i: number): Evidence {
  const p = 'evidence[' + i + ']';
  const e = record(value, ENVELOPE_FIELDS, p);
  oneOf(e.schemaVersion, ['hvac-evidence-envelope-v0.1'], p + '.schemaVersion');
  oneOf(e.source, ['TECHNICIAN_CAPTURE'], p + '.source');
  oneOf(e.status, ['UNVERIFIED'], p + '.status');
  oneOf(e.kind, ['PHOTO', 'MEASUREMENT', 'OBSERVATION'], p + '.kind');
  text(e.capturedAt, p + '.capturedAt');
  text(e.equipmentSerial, p + '.equipmentSerial');
  text(e.payloadRef, p + '.payloadRef');
  nullableText(e.instrumentId, p + '.instrumentId');
  nullableText(e.calibrationRef, p + '.calibrationRef');
  nullableText(e.observation, p + '.observation');
  if (e.measurement !== null) {
    const m = record(e.measurement, ['value', 'unit'], p + '.measurement');
    if (typeof m.value !== 'number' || !Number.isFinite(m.value)) throw new MalformedInput(p + '.measurement.value', 'must be finite');
    text(m.unit, p + '.measurement.unit');
  }
  return {
    recordId: text(e.recordId, p + '.recordId'),
    intakeId: text(e.intakeId, p + '.intakeId'),
    stepNumber: int(e.stepNumber, p + '.stepNumber'),
    technicianId: text(e.technicianId, p + '.technicianId'),
    payloadSha256: sha(e.payloadSha256, p + '.payloadSha256'),
  };
}

const RECEIPT_FIELDS = [
  'receiptId', 'evidenceRecordId', 'intakeId', 'stepNumber', 'serverComputedSha256',
  'technicianPrincipalId', 'verifierPrincipalId', 'verification', 'stored', 'digestVerified',
  'identityVerified', 'calibrationVerified',
] as const;

function readReceipt(value: unknown, i: number): Receipt {
  const p = 'receipts[' + i + ']';
  const r = record(value, RECEIPT_FIELDS, p);
  return {
    receiptId: text(r.receiptId, p + '.receiptId'),
    evidenceRecordId: text(r.evidenceRecordId, p + '.evidenceRecordId'),
    intakeId: text(r.intakeId, p + '.intakeId'),
    stepNumber: int(r.stepNumber, p + '.stepNumber'),
    serverComputedSha256: sha(r.serverComputedSha256, p + '.serverComputedSha256'),
    technicianPrincipalId: text(r.technicianPrincipalId, p + '.technicianPrincipalId'),
    verifierPrincipalId: text(r.verifierPrincipalId, p + '.verifierPrincipalId'),
    verification: oneOf(r.verification, VERIFICATION_STATES, p + '.verification'),
    stored: bool(r.stored, p + '.stored'),
    digestVerified: bool(r.digestVerified, p + '.digestVerified'),
    identityVerified: bool(r.identityVerified, p + '.identityVerified'),
    calibrationVerified: bool(r.calibrationVerified, p + '.calibrationVerified'),
  };
}

// ---------------------------------------------------------------------------
// Consistency checks on the snapshot.
// ---------------------------------------------------------------------------

function checkClaims(baseline: Baseline, evidence: Evidence[], receipts: Receipt[]): AdmissionRejection[] {
  const out: AdmissionRejection[] = [];
  const add = (r: AdmissionRejection) => out.push(r);

  if (!baseline.intakeId.trim()) add({code: 'MISSING_INTAKE_IDENTITY', detail: 'Baseline intake identity is empty'});
  if (baseline.frozenAt !== null) add({code: 'BASELINE_ALREADY_FROZEN', detail: 'Admission must precede freeze'});
  if (baseline.unresolvedSafetyStops.length > 0)
    add({code: 'UNRESOLVED_SAFETY_STOP', detail: baseline.unresolvedSafetyStops.length + ' unresolved safety stop(s)'});
  if (baseline.steps.length !== REQUIRED_STEPS)
    add({code: 'STEP_COUNT_INVALID', detail: 'Exactly 14 steps required, got ' + baseline.steps.length});

  // Evidence records by id.
  const evidenceById = new Map<string, Evidence>();
  for (const e of evidence) {
    if (evidenceById.has(e.recordId)) {
      add({code: 'EVIDENCE_RECORD_DUPLICATE', detail: 'Evidence record supplied more than once', recordId: e.recordId});
      continue;
    }
    evidenceById.set(e.recordId, e);
    if (e.intakeId !== baseline.intakeId)
      add({code: 'EVIDENCE_INTAKE_MISMATCH', detail: 'Evidence belongs to another intake', recordId: e.recordId});
  }

  // Receipts: unique ids, grouped by evidence record.
  const receiptIds = new Set<string>();
  const receiptsByEvidence = new Map<string, Receipt[]>();
  for (const r of receipts) {
    if (receiptIds.has(r.receiptId)) {
      add({code: 'RECEIPT_DUPLICATE_ID', detail: 'Receipt id supplied more than once', receiptId: r.receiptId});
      continue;
    }
    receiptIds.add(r.receiptId);
    if (!evidenceById.has(r.evidenceRecordId)) {
      add({code: 'RECEIPT_UNMATCHED', detail: 'Receipt references no supplied evidence record', receiptId: r.receiptId});
      continue;
    }
    const group = receiptsByEvidence.get(r.evidenceRecordId) ?? [];
    group.push(r);
    receiptsByEvidence.set(r.evidenceRecordId, group);
  }

  // Steps: canonical order and zone, attestation, evidence references.
  const referenced = new Map<string, number>();
  for (let n = 1; n <= REQUIRED_STEPS; n++) {
    const step = baseline.steps[n - 1];
    if (!step) continue; // covered by STEP_COUNT_INVALID
    if (step.number !== n) {
      add({code: 'STEP_OUT_OF_ORDER', detail: 'Expected step ' + n + ' at this position, got ' + step.number, step: n});
      continue;
    }
    if (step.zone !== HVAC_BASELINE_STEP_ZONES[n - 1])
      add({code: 'STEP_ZONE_MISMATCH', detail: 'Step ' + n + ' must be ' + HVAC_BASELINE_STEP_ZONES[n - 1], step: n});
    if (step.technicianAttested !== true)
      add({code: 'STEP_NOT_ATTESTED', detail: 'Technician attestation missing', step: n});
    const refs = step.evidenceRefs;
    if (refs.length === 0 || refs.some(ref => !ref.trim()))
      add({code: 'STEP_EVIDENCE_MISSING', detail: 'Step requires non-empty evidence references', step: n});
    if (new Set(refs).size !== refs.length)
      add({code: 'STEP_EVIDENCE_DUPLICATE', detail: 'Duplicate evidence reference within step', step: n});

    for (const ref of new Set(refs)) {
      if (!ref.trim()) continue;
      const prior = referenced.get(ref);
      if (prior !== undefined) {
        add({code: 'STEP_EVIDENCE_DUPLICATE', detail: 'Evidence also referenced by step ' + prior, step: n, recordId: ref});
        continue;
      }
      referenced.set(ref, n);
      const e = evidenceById.get(ref);
      if (!e) {
        add({code: 'EVIDENCE_RECORD_MISSING', detail: 'No evidence envelope supplied for reference', step: n, recordId: ref});
        continue;
      }
      if (e.stepNumber !== n)
        add({code: 'EVIDENCE_STEP_MISMATCH', detail: 'Evidence captured for step ' + e.stepNumber, step: n, recordId: ref});

      const group = receiptsByEvidence.get(ref) ?? [];
      if (group.length === 0) {
        add({code: 'RECEIPT_MISSING', detail: 'No verification receipt for evidence', step: n, recordId: ref});
        continue;
      }
      if (group.length > 1) {
        add({code: 'RECEIPT_CONFLICT', detail: group.length + ' receipts claim the same evidence', step: n, recordId: ref});
        continue;
      }
      const r = group[0];
      const at = {step: n, recordId: ref, receiptId: r.receiptId};
      if (r.intakeId !== e.intakeId || r.intakeId !== baseline.intakeId || r.stepNumber !== e.stepNumber || r.stepNumber !== n)
        add({code: 'RECEIPT_BINDING_MISMATCH', detail: 'Receipt intake/step does not match evidence', ...at});
      if (r.serverComputedSha256 !== e.payloadSha256)
        add({code: 'RECEIPT_DIGEST_MISMATCH', detail: 'Receipt digest does not match evidence payload digest', ...at});
      if (r.technicianPrincipalId !== e.technicianId)
        add({code: 'RECEIPT_TECHNICIAN_MISMATCH', detail: 'Receipt technician does not match evidence author', ...at});
      if (r.verifierPrincipalId === r.technicianPrincipalId || r.verifierPrincipalId === e.technicianId)
        add({code: 'SEPARATION_OF_DUTIES_VIOLATION', detail: 'Verifier must not be the capturing technician', ...at});
      if (r.verification !== 'VERIFIED')
        add({code: 'RECEIPT_NOT_VERIFIED', detail: 'Receipt state is ' + r.verification, ...at});
      for (const check of ['stored', 'digestVerified', 'identityVerified', 'calibrationVerified'] as const) {
        if (r[check] !== true) add({code: 'RECEIPT_CHECK_FAILED', detail: check + ' is not true', ...at});
      }
    }
  }

  for (const e of evidenceById.values()) {
    if (!referenced.has(e.recordId))
      add({code: 'EVIDENCE_UNREFERENCED', detail: 'Evidence not referenced by any step', recordId: e.recordId});
  }
  for (const [recordId, group] of receiptsByEvidence) {
    if (!referenced.has(recordId))
      for (const r of group)
        add({code: 'RECEIPT_UNMATCHED', detail: 'Receipt targets evidence not referenced by any step', receiptId: r.receiptId, recordId});
  }
  return out;
}

function result(claimsConsistent: boolean, rejections: AdmissionRejection[]): AdmissionResult {
  return Object.freeze({
    admissible: false,
    operational: PRODUCTION_ADMISSION_OPERATIONAL,
    claimsConsistent,
    rejections: Object.freeze([AUTHORITY_UNAVAILABLE, ...rejections.map(r => Object.freeze(r))]),
  });
}

/**
 * Evaluates admission claims. Never throws; malformed input yields a
 * MALFORMED_INPUT rejection. Always returns `admissible: false` because no
 * trusted verification authority exists.
 */
export function evaluateProductionBaselineAdmission(input: ProductionAdmissionInput): AdmissionResult;
export function evaluateProductionBaselineAdmission(input: unknown): AdmissionResult;
export function evaluateProductionBaselineAdmission(input: unknown): AdmissionResult {
  try {
    const top = record(input, ['baseline', 'evidence', 'receipts'], 'input');
    const baseline = readBaseline(top.baseline);
    const evidence = list(top.evidence, 'evidence').map(readEvidence);
    const receipts = list(top.receipts, 'receipts').map(readReceipt);
    const rejections = checkClaims(baseline, evidence, receipts);
    return result(rejections.length === 0, rejections);
  } catch (error) {
    const path = error instanceof MalformedInput ? error.path : undefined;
    const detail = error instanceof MalformedInput ? error.message : 'Input could not be read';
    return result(false, [{code: 'MALFORMED_INPUT', detail, ...(path ? {path} : {})}]);
  }
}
