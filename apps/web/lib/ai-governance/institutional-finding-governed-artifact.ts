import type { TA14InstitutionalFindingRecord } from './institutional-finding-record';
import type { TA14SealedInstitutionalFinding } from './institutional-examination-finding';

export type TA14InstitutionalFindingGovernedArtifact = {
  artifact_identifier: string;
  artifact_series_identifier: string;
  case_identifier: string | null;
  governance_registry_identifier: string;
  governance_name: string;
  governance_version: string;
  governance_version_verification_status: 'BOUND_TO_EXAMINED_OBJECT';
  artifact_type: 'INSTITUTIONAL_EXAMINATION_FINDING';
  title: string;
  current_record_version: '1.0';
  finding_class: TA14SealedInstitutionalFinding['determination'];
  technical_review_status: 'ISSUED_AND_SEALED';
  correction_status: 'ORIGINAL';
  administrative_verification_status: 'SEAL_VERIFIED';
  publication_state: 'INSTITUTIONAL_RECORD';
  disclosure_state: 'CONTROLLED';
  public_summary: string;
  claims_boundary: string;
  public_finding_language: string;
  limitations: string[];
  evidence_object_identifiers: string[];
  source_filename: string;
  source_media_type: 'application/json';
  source_sha256: string;
  file_publication_authorized: false;
  public_file_url: null;
  public_record_href: null;
  registered_at: string;
  closed_at: null;
  metadata: Record<string, unknown>;
};

export function mapInstitutionalFindingToGovernedArtifact(input: {
  record: TA14InstitutionalFindingRecord;
  finding: TA14SealedInstitutionalFinding;
  governanceRegistryIdentifier: string;
  governanceName: string;
}): TA14InstitutionalFindingGovernedArtifact {
  const { record, finding } = input;
  if (record.findingId !== finding.findingId || record.findingDigest !== finding.canonicalDigest) {
    throw new Error('Institutional record and sealed finding do not identify the same immutable finding.');
  }
  if (!input.governanceRegistryIdentifier.trim() || !input.governanceName.trim()) {
    throw new Error('Governance registry identity and governance name are required for governed-artifact admission.');
  }
  const admittedEvidence = finding.evidenceAdmissions
    .filter(item => item.disposition === 'ADMITTED' || item.disposition === 'PARTIALLY ADMITTED')
    .map(item => item.evidenceRef);
  return {
    artifact_identifier: record.recordId,
    artifact_series_identifier: `TA14-AIFR-${finding.governedObject.objectId}`,
    case_identifier: finding.receiptId,
    governance_registry_identifier: input.governanceRegistryIdentifier.trim(),
    governance_name: input.governanceName.trim(),
    governance_version: finding.governedObject.version,
    governance_version_verification_status: 'BOUND_TO_EXAMINED_OBJECT',
    artifact_type: 'INSTITUTIONAL_EXAMINATION_FINDING',
    title: `Institutional Examination Finding — ${finding.governedObject.objectId} ${finding.governedObject.version}`,
    current_record_version: '1.0',
    finding_class: finding.determination,
    technical_review_status: 'ISSUED_AND_SEALED',
    correction_status: 'ORIGINAL',
    administrative_verification_status: 'SEAL_VERIFIED',
    publication_state: 'INSTITUTIONAL_RECORD',
    disclosure_state: 'CONTROLLED',
    public_summary: `${finding.determination}: ${finding.boundedProposition}`,
    claims_boundary: finding.boundedProposition,
    public_finding_language: finding.findingRationale,
    limitations: finding.limitations,
    evidence_object_identifiers: admittedEvidence,
    source_filename: `${finding.findingId}.sealed.json`,
    source_media_type: 'application/json',
    source_sha256: finding.canonicalDigest,
    file_publication_authorized: false,
    public_file_url: null,
    public_record_href: null,
    registered_at: record.recordedAt,
    closed_at: null,
    metadata: {
      institutionalFindingSchema: finding.schema,
      findingSealSchema: finding.sealSchema,
      findingId: finding.findingId,
      findingDigest: finding.canonicalDigest,
      receiptId: finding.receiptId,
      receiptDigest: finding.receiptDigest,
      suiteId: finding.suiteId,
      evaluatorVersion: finding.evaluatorVersion,
      issuer: finding.issuer,
      authorityRef: finding.authorityRef,
      findingIssuedAt: finding.issuedAt,
      institutionalRecordSchema: record.schema,
      preservationStanding: record.preservationStanding,
      verificationRoute: record.verification.verificationRoute,
      evidenceAdmissions: finding.evidenceAdmissions,
    },
  };
}
