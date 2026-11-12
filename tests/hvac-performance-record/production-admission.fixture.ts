import {
  HVAC_BASELINE_STEP_ZONES,
  type AdmissionEvidenceEnvelope,
  type AdmissionResult,
  type ProductionAdmissionInput,
  type VerificationReceiptClaim,
} from '../../apps/web/lib/hvac-performance-record/production-admission';

export const digest = (n: number) => n.toString(16).padStart(2, '0').repeat(32);

export const envelope = (n: number): AdmissionEvidenceEnvelope => ({
  schemaVersion: 'hvac-evidence-envelope-v0.1',
  recordId: 'EV-' + n, intakeId: 'INTAKE-1', stepNumber: n, kind: 'PHOTO',
  capturedAt: '2026-11-12T15:00:00Z', technicianId: 'TECH-1', equipmentSerial: 'SERIAL-1',
  payloadRef: 'capture://intake-1/step-' + n, payloadSha256: digest(n),
  instrumentId: null, calibrationRef: null, measurement: null, observation: null,
  source: 'TECHNICIAN_CAPTURE', status: 'UNVERIFIED',
});

export const receipt = (n: number): VerificationReceiptClaim => ({
  receiptId: 'RCPT-' + n, evidenceRecordId: 'EV-' + n, intakeId: 'INTAKE-1', stepNumber: n,
  serverComputedSha256: digest(n), technicianPrincipalId: 'TECH-1',
  verifierPrincipalId: 'VERIFIER-1', verification: 'VERIFIED', stored: true,
  digestVerified: true, identityVerified: true, calibrationVerified: true,
});

/** A fully consistent set of claims (still inadmissible: no trusted authority). */
export const consistent = () => ({
  baseline: {
    intakeId: 'INTAKE-1', frozenAt: null as string | null, unresolvedSafetyStops: [] as string[],
    steps: Array.from({length: 14}, (_, i) => ({
      number: i + 1, zone: HVAC_BASELINE_STEP_ZONES[i], technicianAttested: true,
      evidenceRefs: ['EV-' + (i + 1)],
    })),
  },
  evidence: Array.from({length: 14}, (_, i) => envelope(i + 1)),
  receipts: Array.from({length: 14}, (_, i) => receipt(i + 1)),
}) satisfies ProductionAdmissionInput;

export const codes = (r: AdmissionResult) => r.rejections.map(x => x.code);

/** Codes other than the always-present authority-unavailable blocker. */
export const claimCodes = (r: AdmissionResult) =>
  codes(r).filter(c => c !== 'TRUSTED_VERIFICATION_AUTHORITY_UNAVAILABLE');
