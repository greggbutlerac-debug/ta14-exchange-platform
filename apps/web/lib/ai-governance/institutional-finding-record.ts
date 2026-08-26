import type { TA14SealedInstitutionalFinding } from './institutional-examination-finding';

export type TA14InstitutionalFindingRecord = {
  schema: 'TA14-Institutional-Finding-Record-v1';
  recordId: string;
  recordedAt: string;
  findingId: string;
  findingDigest: string;
  receiptId: string;
  receiptDigest: string;
  governedObjectId: string;
  governedObjectVersion: string;
  determination: TA14SealedInstitutionalFinding['determination'];
  boundedProposition: string;
  issuer: string;
  authorityRef: string;
  chronology: {
    findingIssuedAt: string;
    recordCreatedAt: string;
  };
  verification: {
    findingSealSchema: TA14SealedInstitutionalFinding['sealSchema'];
    verificationRoute: '/workspace/ai-governance/adversarial-examination/finding-verify';
  };
  preservationStanding: 'RECORDED';
};

export function createTA14InstitutionalFindingRecord(input: {
  recordId: string;
  sealedFinding: TA14SealedInstitutionalFinding;
  findingSealVerified: boolean;
}): TA14InstitutionalFindingRecord {
  if (!input.findingSealVerified) throw new Error('Institutional record cannot be created from an unverified finding seal.');
  if (!input.recordId.trim()) throw new Error('Institutional record ID is required.');
  const finding = input.sealedFinding;
  const recordedAt = new Date().toISOString();
  return {
    schema: 'TA14-Institutional-Finding-Record-v1',
    recordId: input.recordId.trim(),
    recordedAt,
    findingId: finding.findingId,
    findingDigest: finding.canonicalDigest,
    receiptId: finding.receiptId,
    receiptDigest: finding.receiptDigest,
    governedObjectId: finding.governedObject.objectId,
    governedObjectVersion: finding.governedObject.version,
    determination: finding.determination,
    boundedProposition: finding.boundedProposition,
    issuer: finding.issuer,
    authorityRef: finding.authorityRef,
    chronology: {
      findingIssuedAt: finding.issuedAt,
      recordCreatedAt: recordedAt,
    },
    verification: {
      findingSealSchema: finding.sealSchema,
      verificationRoute: '/workspace/ai-governance/adversarial-examination/finding-verify',
    },
    preservationStanding: 'RECORDED',
  };
}
