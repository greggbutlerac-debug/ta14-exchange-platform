import {
  createTA14InstitutionalFinding,
  sealTA14InstitutionalFinding,
  verifyTA14InstitutionalFindingSeal,
  type TA14EvidenceAdmission,
} from './institutional-examination-finding';
import type { TA14ExaminationRunReceipt } from './examination-run-receipt';

export type InstitutionalFindingAcceptanceResult = {
  control: 'N02' | 'N03' | 'P04' | 'P05' | 'N04';
  pass: boolean;
  detail: string;
};

function baseReceipt(): TA14ExaminationRunReceipt {
  return {
    schema: 'TA14-Examination-Run-Receipt-v1',
    receiptId: 'TA14-ACCEPTANCE-RECEIPT-001',
    issuedAt: '2026-08-26T00:00:00.000Z',
    governedObject: { id: 'TA14-ACCEPTANCE-OBJECT', version: '1.0.0' },
    suiteId: 'AE-27',
    evaluatorVersion: 'acceptance-v1',
    counts: { pass: 27, fail: 0, unresolved: 0 },
    results: [],
    evidenceRefs: { AE01: ['evidence://acceptance/001'] },
    canonicalDigest: 'acceptance-receipt-digest',
  } as unknown as TA14ExaminationRunReceipt;
}

function admittedEvidence(): TA14EvidenceAdmission[] {
  return [{ evidenceRef: 'evidence://acceptance/001', disposition: 'ADMITTED', rationale: 'Acceptance fixture.', reviewer: 'TA-14 Acceptance Harness', reviewedAt: '2026-08-26T00:00:00.000Z' }];
}

function input(receiptDigestVerified = true, evidenceAdmissions = admittedEvidence()) {
  return {
    findingId: 'TA14-ACCEPTANCE-FINDING-001',
    verifiedReceipt: baseReceipt(),
    receiptDigestVerified,
    evidenceAdmissions,
    determination: 'SUPPORTED' as const,
    boundedProposition: 'The acceptance fixture satisfies the bounded institutional finding controls under examination.',
    findingRationale: 'Acceptance harness fixture only.',
    limitations: ['This fixture does not establish production persistence or authentication controls.'],
    issuer: 'TA-14 Acceptance Harness',
    authorityRef: 'institutional-examination-production-acceptance-v1',
  };
}

export async function runInstitutionalFindingAcceptanceControls(): Promise<InstitutionalFindingAcceptanceResult[]> {
  const results: InstitutionalFindingAcceptanceResult[] = [];
  try { createTA14InstitutionalFinding(input(false)); results.push({ control:'N02', pass:false, detail:'Unverified receipt unexpectedly issued a finding.' }); }
  catch { results.push({ control:'N02', pass:true, detail:'Unverified receipt refused finding issuance.' }); }

  try { createTA14InstitutionalFinding(input(true, [])); results.push({ control:'N03', pass:false, detail:'Finding without evidence admission unexpectedly issued.' }); }
  catch { results.push({ control:'N03', pass:true, detail:'Missing evidence-admission disposition refused issuance.' }); }

  let sealed;
  try {
    const finding = createTA14InstitutionalFinding(input());
    results.push({ control:'P04', pass:true, detail:'Bounded institutional finding issued from verified receipt and admitted evidence fixture.' });
    sealed = await sealTA14InstitutionalFinding(finding);
    const verified = await verifyTA14InstitutionalFindingSeal(sealed);
    results.push({ control:'P05', pass:verified, detail:verified?'Finding seal independently verified.':'Finding seal failed independent verification.' });
  } catch (error) {
    results.push({ control:'P04', pass:false, detail:error instanceof Error?error.message:'Finding issuance failed.' });
    results.push({ control:'P05', pass:false, detail:'No sealed finding was available for verification.' });
  }

  if (sealed) {
    const tampered = { ...sealed, boundedProposition: `${sealed.boundedProposition} TAMPERED` };
    const refused = !(await verifyTA14InstitutionalFindingSeal(tampered));
    results.push({ control:'N04', pass:refused, detail:refused?'Tampered sealed finding failed cryptographic verification.':'Tampered sealed finding unexpectedly verified.' });
  } else results.push({ control:'N04', pass:false, detail:'No sealed finding was available for tamper control.' });

  return results;
}
