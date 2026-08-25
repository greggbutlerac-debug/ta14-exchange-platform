import type { TA14ExaminationRunReceipt } from './examination-run-receipt';

export type TA14EvidenceAdmission = {
  evidenceRef: string;
  disposition: 'ADMITTED' | 'NOT ADMITTED' | 'PARTIALLY ADMITTED';
  rationale: string;
  reviewer: string;
  reviewedAt: string;
};

export type TA14InstitutionalFinding = {
  schema: 'TA14-Institutional-Examination-Finding-v1';
  findingId: string;
  issuedAt: string;
  receiptId: string;
  receiptDigest: string;
  governedObject: TA14ExaminationRunReceipt['governedObject'];
  suiteId: TA14ExaminationRunReceipt['suiteId'];
  evaluatorVersion: string;
  evidenceAdmissions: TA14EvidenceAdmission[];
  determination: 'SUPPORTED' | 'PARTIALLY SUPPORTED' | 'UNSUPPORTED' | 'INDETERMINATE';
  boundedProposition: string;
  findingRationale: string;
  limitations: string[];
  issuer: string;
  authorityRef: string;
  institutionalStanding: 'ISSUED';
};

export function createTA14InstitutionalFinding(input: {
  findingId: string;
  verifiedReceipt: TA14ExaminationRunReceipt;
  receiptDigestVerified: boolean;
  evidenceAdmissions: TA14EvidenceAdmission[];
  determination: TA14InstitutionalFinding['determination'];
  boundedProposition: string;
  findingRationale: string;
  limitations: string[];
  issuer: string;
  authorityRef: string;
}): TA14InstitutionalFinding {
  if (!input.receiptDigestVerified) throw new Error('Institutional finding cannot issue from an unverified examination receipt.');
  if (!input.findingId.trim()) throw new Error('Finding ID is required.');
  if (!input.boundedProposition.trim()) throw new Error('A bounded proposition is required.');
  if (!input.findingRationale.trim()) throw new Error('Finding rationale is required.');
  if (!input.issuer.trim() || !input.authorityRef.trim()) throw new Error('Issuer identity and authority reference are required.');
  if (!input.evidenceAdmissions.length) throw new Error('At least one explicit evidence-admission disposition is required.');
  const admitted = input.evidenceAdmissions.filter(e => e.disposition === 'ADMITTED' || e.disposition === 'PARTIALLY ADMITTED');
  if (input.determination === 'SUPPORTED' && admitted.length === 0) {
    throw new Error('SUPPORTED cannot issue without admitted evidence.');
  }
  if (input.verifiedReceipt.counts.fail > 0 && input.determination === 'SUPPORTED') {
    throw new Error('SUPPORTED cannot override a disqualifying AE-27 FAIL in the verified receipt.');
  }
  if (input.verifiedReceipt.counts.unresolved > 0 && input.determination === 'SUPPORTED') {
    throw new Error('SUPPORTED cannot issue while the verified AE-27 receipt contains unresolved gates.');
  }
  return {
    schema: 'TA14-Institutional-Examination-Finding-v1',
    findingId: input.findingId.trim(),
    issuedAt: new Date().toISOString(),
    receiptId: input.verifiedReceipt.receiptId,
    receiptDigest: input.verifiedReceipt.canonicalDigest,
    governedObject: input.verifiedReceipt.governedObject,
    suiteId: input.verifiedReceipt.suiteId,
    evaluatorVersion: input.verifiedReceipt.evaluatorVersion,
    evidenceAdmissions: input.evidenceAdmissions,
    determination: input.determination,
    boundedProposition: input.boundedProposition.trim(),
    findingRationale: input.findingRationale.trim(),
    limitations: input.limitations.map(v => v.trim()).filter(Boolean),
    issuer: input.issuer.trim(),
    authorityRef: input.authorityRef.trim(),
    institutionalStanding: 'ISSUED',
  };
}
