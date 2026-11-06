import { describe, expect, it } from 'vitest';
import {
  newBaselineDraft, recordStepEvidence, baselineReadyToFreeze, freezeBaseline,
} from '../../apps/web/lib/hvac-performance-record/baseline-gate';

describe('HVAC baseline fail-closed gate', () => {
  it('starts with 14 incomplete steps and a locked DDD', () => {
    const draft = newBaselineDraft('INTAKE-1');
    expect(draft.steps).toHaveLength(14);
    expect(draft.dddStatus).toBe('LOCKED');
    expect(draft.interventionAuthorization).toBe('NONE');
    expect(baselineReadyToFreeze(draft)).toBe(false);
  });

  it('rejects premature freeze and invalid steps', () => {
    const draft = newBaselineDraft('INTAKE-1');
    expect(() => freezeBaseline(draft, '2026-11-06T12:00:00Z')).toThrow();
    expect(() => recordStepEvidence(draft, 15, ['evidence-1'], true)).toThrow();
  });

  it('requires evidence references and technician attestation for every slot', () => {
    let draft = newBaselineDraft('INTAKE-1');
    for (let i = 1; i <= 14; i++) {
      draft = recordStepEvidence(draft, i, ['record-' + i], true);
    }
    expect(baselineReadyToFreeze(draft)).toBe(true);
    draft = freezeBaseline(draft, '2026-11-06T12:00:00Z');
    expect(draft.frozenAt).toBe('2026-11-06T12:00:00Z');
    expect(draft.dddStatus).toBe('LOCKED');
    expect(() => recordStepEvidence(draft, 1, ['replacement'], true)).toThrow();
    expect(() => freezeBaseline(draft, '2026-11-06T13:00:00Z')).toThrow();
  });
});
