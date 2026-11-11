import {describe, expect, it} from 'vitest';
import {createEvidenceEnvelope} from '../../apps/web/lib/hvac-performance-record/evidence-envelope';

const base = {
  recordId: 'REC-1', intakeId: 'INTAKE-1', stepNumber: 3,
  kind: 'MEASUREMENT' as const, capturedAt: '2026-11-09T20:00:00Z',
  technicianId: 'TECH-1', equipmentSerial: 'SERIAL-1',
  payloadRef: 'capture://rec-1/step-3',
  payloadSha256: 'a'.repeat(64), instrumentId: 'METER-1',
  calibrationRef: null, measurement: {value: 0, unit: 'inWC'},
  observation: null,
};

describe('HVAC evidence envelope structure', () => {
  it('marks all technician evidence unverified and never diagnostic', () => {
    const envelope = createEvidenceEnvelope(base);
    expect(envelope.status).toBe('UNVERIFIED');
    expect(envelope.source).toBe('TECHNICIAN_CAPTURE');
    expect('dddStatus' in envelope).toBe(false);
  });
  it('requires valid step, hash format, and instrument identity', () => {
    expect(() => createEvidenceEnvelope({...base, stepNumber: 15})).toThrow();
    expect(() => createEvidenceEnvelope({...base, payloadSha256: 'fake'})).toThrow();
    expect(() => createEvidenceEnvelope({...base, instrumentId: null})).toThrow();
  });
  it('allows zero readings, rejects nonfinite readings', () => {
    expect(createEvidenceEnvelope(base).measurement?.value).toBe(0);
    expect(() => createEvidenceEnvelope({...base, measurement: {value: NaN, unit:'inWC'}})).toThrow();
  });
});
