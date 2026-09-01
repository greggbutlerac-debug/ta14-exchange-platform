export const LEGACY_REGISTRATION_RECONSTRUCTION_SCHEMA =
  'TA14.LegacyRegistrationReconstruction.v1' as const;

export type LegacyRegistrationReconstructionStatus =
  | 'OPEN'
  | 'RECONSTRUCTION_IN_PROGRESS'
  | 'PARTICIPANT_CONFIRMED'
  | 'PROMOTED_TO_DRAFT'
  | 'CLOSED';

export type LegacyRegistrationReconstruction = {
  schema: typeof LEGACY_REGISTRATION_RECONSTRUCTION_SCHEMA;
  recoveryRecordId: string;
  ownerUserId: string;
  originalAttemptAt: string;
  originalFailureType: string;
  reconstructedAt: string;
  reconstructedBy: string;
  participantConfirmationRequired: true;
  status: LegacyRegistrationReconstructionStatus;
  reconstructedPayload: Record<string, unknown>;
  provenanceBoundary: {
    originalSubstantivePayloadRecovered: false;
    reconstructedPayloadIsOriginalServerRecord: false;
    originalAttemptTimestampPreserved: true;
    reconstructionTimestampPreserved: true;
  };
};

export function validateLegacyRegistrationReconstruction(
  value: LegacyRegistrationReconstruction,
): string[] {
  const failures: string[] = [];
  if (value.schema !== LEGACY_REGISTRATION_RECONSTRUCTION_SCHEMA) failures.push('SCHEMA_INVALID');
  if (!value.recoveryRecordId.trim()) failures.push('RECOVERY_RECORD_ID_REQUIRED');
  if (!value.ownerUserId.trim()) failures.push('OWNER_USER_ID_REQUIRED');
  if (!value.originalAttemptAt.trim()) failures.push('ORIGINAL_ATTEMPT_AT_REQUIRED');
  if (!value.originalFailureType.trim()) failures.push('ORIGINAL_FAILURE_TYPE_REQUIRED');
  if (!value.reconstructedAt.trim()) failures.push('RECONSTRUCTED_AT_REQUIRED');
  if (!value.reconstructedBy.trim()) failures.push('RECONSTRUCTED_BY_REQUIRED');
  if (!value.reconstructedPayload || typeof value.reconstructedPayload !== 'object') {
    failures.push('RECONSTRUCTED_PAYLOAD_REQUIRED');
  }
  if (value.provenanceBoundary.originalSubstantivePayloadRecovered !== false) {
    failures.push('ORIGINAL_PAYLOAD_MUST_NOT_BE_REPRESENTED_AS_RECOVERED');
  }
  if (value.provenanceBoundary.reconstructedPayloadIsOriginalServerRecord !== false) {
    failures.push('RECONSTRUCTION_MUST_NOT_BE_REPRESENTED_AS_ORIGINAL_RECORD');
  }
  return failures;
}

export const LEGACY_RECONSTRUCTION_NOTICE =
  'This record reconstructs substantive registration information after a documented historical persistence failure. It preserves the original attempt timestamp separately from the reconstruction timestamp. The reconstructed payload is participant-confirmed replacement evidence and is not represented as the original lost server record.';
