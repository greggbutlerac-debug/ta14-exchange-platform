import { describe, expect, it } from 'vitest';
import { createIntakeRecord, emptyIntake, validateIntake } from '../../apps/web/lib/hvac-performance-record/intake';

const valid = {
  manufacturer: 'Example', model: 'ABC123', serial: 'SN001',
  equipmentType: 'Split system', concern: 'Not cooling',
  operatingMode: 'Cooling', technicianId: 'TECH-1',
};

describe('HVAC Performance Record intake', () => {
  it('rejects missing required fields', () => {
    expect(validateIntake(emptyIntake)).toHaveLength(7);
    expect(() => createIntakeRecord(emptyIntake, new Date().toISOString())).toThrow('Incomplete intake');
  });

  it('rejects an invalid timestamp', () => {
    expect(() => createIntakeRecord(valid, 'invalid')).toThrow('Invalid capture timestamp');
  });

  it('creates a locked, non-authorizing intake record', () => {
    const record = createIntakeRecord(valid, '2026-11-06T12:00:00.000Z');
    expect(record.intake.model).toBe('ABC123');
    expect(record.completedBaselineSteps).toBe(0);
    expect(record.baselineFrozen).toBe(false);
    expect(record.dddStatus).toBe('LOCKED');
    expect(record.interventionAuthorization).toBe('NONE');
  });
});
