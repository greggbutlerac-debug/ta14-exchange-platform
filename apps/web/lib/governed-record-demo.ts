import type { GovernedRecordReference } from './governed-record';

export const GOVERNED_DEMO_RECORDS: GovernedRecordReference[] = [
  {
    id: 'AIR-DEMO-014',
    label: 'Building Atmospheric Integrity Record',
    recordClass: 'AIR',
    subject: 'Healthcare Isolation Room 214',
    period: 'July 18–19, 2026',
    decision: 'HOLD',
    summary:
      'Negative-pressure continuity was interrupted during three documented intervals. Door-state evidence is incomplete.',
  },
  {
    id: 'PAIR-DEMO-007',
    label: 'Personal Atmospheric Integrity Record',
    recordClass: 'PAIR',
    subject: 'Authorized exposure chronology',
    period: 'July 17–19, 2026',
    decision: 'ESCALATE',
    summary:
      'Repeated exposure overlap is visible, but clinical interpretation requires an authorized professional review lane.',
  },
  {
    id: 'BER-DEMO-022',
    label: 'Building Environmental Record',
    recordClass: 'BUILDING',
    subject: 'Commercial Office — AHU-3 Zone',
    period: 'July 1–19, 2026',
    decision: 'ALLOW',
    summary:
      'The post-intervention record documents sustained change against the declared baseline within the stated scope.',
  },
];

export const DEFAULT_GOVERNED_RECORD_ID =
  GOVERNED_DEMO_RECORDS[0].id;

export function getGovernedDemoRecord(
  recordId: string,
): GovernedRecordReference {
  return (
    GOVERNED_DEMO_RECORDS.find(
      (record) => record.id === recordId,
    ) ?? GOVERNED_DEMO_RECORDS[0]
  );
}
