import {describe, expect, it} from 'vitest';
import {createEvidenceEnvelope} from '../../apps/web/lib/hvac-performance-record/evidence-envelope';

// Simulates an untyped JavaScript caller or a deserialized request body.
const untyped = (value: unknown) => () => createEvidenceEnvelope(value);

const measurement = () => ({
  recordId: 'REC-1', intakeId: 'INTAKE-1', stepNumber: 3,
  kind: 'MEASUREMENT', capturedAt: '2026-11-09T20:00:00Z',
  technicianId: 'TECH-1', equipmentSerial: 'SERIAL-1',
  payloadRef: 'capture://rec-1/step-3',
  payloadSha256: 'a'.repeat(64), instrumentId: 'METER-1',
  calibrationRef: null, measurement: {value: 0, unit: 'inWC'},
  observation: null,
} as Record<string, unknown>);

const photo = () => ({...measurement(), kind: 'PHOTO', measurement: null, instrumentId: null});
const observation = () => ({...photo(), kind: 'OBSERVATION', observation: 'Filter visibly loaded'});

describe('evidence envelope rejects injected authority fields', () => {
  it.each([
    ['dddStatus', 'ISSUED'],
    ['verifiedBy', 'TECH-1'],
    ['interventionAuthorization', {authorized: true, by: 'TECH-1'}],
    ['status', 'VERIFIED'],
    ['source', 'INDEPENDENT_VERIFIER'],
    ['schemaVersion', 'hvac-evidence-envelope-v9'],
    ['verification', 'VERIFIED'],
    ['refrigerantAdjustment', {chargeOz: 4}],
    ['analyzerDetermination', 'PASS'],
  ])('rejects injected %s', (field, value) => {
    expect(untyped({...measurement(), [field]: value})).toThrow(/unknown field/);
  });

  it('rejects status override even with the mandatory value', () => {
    expect(untyped({...measurement(), status: 'UNVERIFIED'})).toThrow(/unknown field/);
  });

  it('rejects symbol-keyed and __proto__-smuggled properties', () => {
    expect(untyped({...measurement(), [Symbol('dddStatus')]: 'ISSUED'})).toThrow(/symbol/);
    const parsed = JSON.parse(JSON.stringify(measurement()).replace(/^\{/, '{"__proto__":{"dddStatus":"ISSUED"},'));
    expect(untyped(parsed)).toThrow(/unknown field/);
  });

  it('rejects inherited fields and non-plain inputs', () => {
    expect(untyped(Object.assign(Object.create({dddStatus: 'ISSUED'}), measurement()))).toThrow(/plain object/);
    class Capture {}
    expect(untyped(Object.assign(new Capture(), measurement()))).toThrow(/plain object/);
    for (const bad of [null, undefined, 'REC-1', 42, [], new Map()]) expect(untyped(bad)).toThrow();
  });

  it('rejects accessor properties that could change after validation', () => {
    const input = measurement();
    let reads = 0;
    Object.defineProperty(input, 'stepNumber', {enumerable: true, get: () => (reads++ === 0 ? 3 : 99)});
    expect(untyped(input)).toThrow(/data property/);
  });

  it('rejects extra fields inside the measurement object', () => {
    expect(untyped({...measurement(), measurement: {value: 1, unit: 'inWC', verified: true}})).toThrow(/unknown field/);
    expect(untyped({...measurement(), measurement: {value: 1}})).toThrow(/missing field unit/);
  });
});

describe('evidence envelope rejects malformed untyped input', () => {
  it('requires every allowlisted field to be present', () => {
    for (const key of Object.keys(measurement())) {
      const input = measurement();
      delete input[key];
      expect(untyped(input), key).toThrow();
    }
  });

  it.each([
    ['recordId', 42], ['recordId', '  '], ['intakeId', null], ['technicianId', {}],
    ['equipmentSerial', ''], ['payloadRef', ['x']],
    ['stepNumber', '3'], ['stepNumber', 0], ['stepNumber', 3.5], ['stepNumber', NaN], ['stepNumber', 15],
    ['kind', 'measurement'], ['kind', 'DDD'], ['kind', null],
    ['capturedAt', 'not a date'], ['capturedAt', 1731182400000],
    ['payloadSha256', 'a'.repeat(63)], ['payloadSha256', 'g'.repeat(64)], ['payloadSha256', null],
    ['instrumentId', ''], ['instrumentId', 7], ['calibrationRef', 7],
    ['measurement', {value: '0', unit: 'inWC'}], ['measurement', {value: Infinity, unit: 'inWC'}],
    ['measurement', {value: 1, unit: ' '}], ['measurement', null], ['measurement', [1, 'inWC']],
    ['observation', 12],
  ])('rejects %s = %j', (field, value) => {
    expect(untyped({...measurement(), [field]: value})).toThrow();
  });

  it('enforces kind-specific payload rules', () => {
    expect(untyped({...photo(), measurement: {value: 1, unit: 'inWC'}})).toThrow(/only permitted/);
    expect(untyped({...observation(), observation: null})).toThrow(/Observation text/);
  });
});

describe('evidence envelope output is constructed, not copied', () => {
  it('accepts valid photo, observation and measurement captures as UNVERIFIED', () => {
    for (const input of [photo(), observation(), measurement()]) {
      const envelope = createEvidenceEnvelope(input);
      expect(envelope.status).toBe('UNVERIFIED');
      expect(envelope.source).toBe('TECHNICIAN_CAPTURE');
      expect(Object.keys(envelope).sort()).toEqual([
        ...Object.keys(input), 'schemaVersion', 'source', 'status',
      ].sort());
    }
  });

  it('is frozen and detached from caller-owned objects', () => {
    const input = measurement();
    const envelope = createEvidenceEnvelope(input);
    expect(Object.isFrozen(envelope)).toBe(true);
    expect(Object.isFrozen(envelope.measurement)).toBe(true);
    (input.measurement as {value: number}).value = 999;
    expect(envelope.measurement?.value).toBe(0);
    expect(() => {
      (envelope as unknown as {status: string}).status = 'VERIFIED';
    }).toThrow(TypeError);
    expect(() => {
      (envelope as unknown as Record<string, unknown>).dddStatus = 'ISSUED';
    }).toThrow(TypeError);
    expect(envelope.status).toBe('UNVERIFIED');
  });
});
