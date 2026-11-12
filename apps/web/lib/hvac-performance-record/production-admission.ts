/**
 * Production admission precondition only. This does not issue a DDD, authorize
 * intervention, or itself freeze/persist a baseline.
 * Verifier state must come from a trusted server-side authority, never from
 * a technician-supplied evidence envelope.
 */
export type VerifiedEvidenceReceipt = {
  recordId: string;
  intakeId: string;
  stepNumber: number;
  verification: 'VERIFIED' | 'UNVERIFIED' | 'REJECTED';
  stored: boolean;
  digestVerified: boolean;
  identityVerified: boolean;
  calibrationVerified: boolean;
  verifiedBy: string | null;
};

export type ProductionBaselineCandidate = {
  intakeId: string;
  frozenAt: string | null;
  steps: ReadonlyArray<{
    number: number;
    technicianAttested: boolean;
    evidenceRefs: ReadonlyArray<string>;
  }>;
  unresolvedSafetyStops: ReadonlyArray<string>;
};

export type AdmissionResult = { admissible: boolean; reasons: string[] };

export function evaluateProductionBaselineAdmission(
  baseline: ProductionBaselineCandidate,
  receipts: ReadonlyArray<VerifiedEvidenceReceipt>,
): AdmissionResult {
  const reasons: string[] = [];
  if (!baseline.intakeId.trim()) reasons.push('Missing intake identity');
  if (baseline.frozenAt !== null) reasons.push('Baseline already frozen');
  if (baseline.unresolvedSafetyStops.length > 0) reasons.push('Unresolved safety stop');
  if (baseline.steps.length !== 14) reasons.push('Exactly 14 steps required');

  const seenRecords = new Set<string>();
  for (const receipt of receipts) {
    if (seenRecords.has(receipt.recordId)) reasons.push('Duplicate evidence receipt');
    seenRecords.add(receipt.recordId);
  }
  for (let n = 1; n <= 14; n++) {
    const step = baseline.steps[n - 1];
    if (!step || step.number !== n || !step.technicianAttested) {
      reasons.push('Step ' + n + ' incomplete or out of order');
      continue;
    }
    const refs = step.evidenceRefs;
    if (!refs.length || new Set(refs).size !== refs.length || refs.some(ref => !ref.trim())) {
      reasons.push('Step ' + n + ' missing or duplicate evidence');
      continue;
    }
    for (const ref of refs) {
      const matches = receipts.filter(r => r.recordId === ref);
      if (matches.length !== 1) {
        reasons.push('Step ' + n + ' lacks unique verification receipt');
        continue;
      }
      const receipt = matches[0];
      if (receipt.intakeId !== baseline.intakeId || receipt.stepNumber !== n ||
          receipt.verification !== 'VERIFIED' || !receipt.stored ||
          !receipt.digestVerified || !receipt.identityVerified ||
          !receipt.calibrationVerified || !receipt.verifiedBy?.trim()) {
        reasons.push('Step ' + n + ' has inadmissible evidence');
      }
    }
  }
  return {admissible: reasons.length === 0, reasons};
}
