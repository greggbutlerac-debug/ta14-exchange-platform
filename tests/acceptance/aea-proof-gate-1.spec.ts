/**
 * AEA Proof Gate 1 — isolated simulated controller enforcement.
 * No hardware, network, database, or production writes.
 *
 * The simulated controller is private to this harness. This proves only the
 * behavior of this controlled interface, not protection against privileged
 * direct writes to real equipment.
 */
import { describe, expect, it } from 'vitest';
import { BASELINE, minuteToIso } from '../../apps/web/lib/refrigeration-boundary/baseline';
import { submitCommand, executeCommitted, type Command, type HeldGrant } from '../../apps/web/lib/refrigeration-boundary/gate';
import type { EvidenceStanding, MaterialChange } from '../../apps/web/lib/governance-continuity-execution-authority';

const validEvidence: EvidenceStanding = {
  continuitySupported: true, admissibilitySupported: true, evidenceId: 'PG1-EVIDENCE',
};
const grant = (overrides: Partial<HeldGrant['grant']> = {}): HeldGrant => ({
  holderActorId: 'TECH-01', issuedBy: 'FM-01', issuedAtMinute: 0,
  grant: {
    authorityId: 'PG1-GRANT', assetId: BASELINE.equipment.assetId,
    assetVersion: BASELINE.version, routeId: BASELINE.equipment.commandRoute,
    consequence: 'INITIATE_DEFROST', effectiveAt: minuteToIso(0),
    expiresAt: minuteToIso(500), revoked: false, ...overrides,
  },
});
const command = (id: string, durationMin = 20): Command => ({
  commandId: id, consequence: 'INITIATE_DEFROST', params: { durationMin },
});
type Attempt = {
  actorId: string; command: Command; held: HeldGrant | null;
  evidence: EvidenceStanding; minute: number; change?: MaterialChange | null;
};
class ControlledFreezer {
  private defrostUntilMinute = 0;
  readonly attempts: Array<{ id: string; determination: string; mutated: boolean; receipt: string }> = [];
  observe() { return { defrostUntilMinute: this.defrostUntilMinute }; }
  request(input: Attempt, executeAtMinute = input.minute, executionOverrides: Partial<Attempt> = {}) {
    const submit = submitCommand({ ...input, change: input.change ?? null });
    if (!submit.commitPermitted) {
      this.attempts.push({ id: input.command.commandId, determination: submit.determination, mutated: false, receipt: submit.gcea.receiptHash });
      return { submit, execution: null, mutated: false };
    }
    const executionInput = { ...input, ...executionOverrides, minute: executeAtMinute };
    const execution = executeCommitted({ ...executionInput, change: executionInput.change ?? null });
    const mutated = execution.executionPermitted && execution.determination === 'ALLOW';
    if (mutated) this.defrostUntilMinute = executeAtMinute + input.command.params.durationMin!;
    this.attempts.push({ id: input.command.commandId, determination: execution.determination, mutated, receipt: execution.gcea.receiptHash });
    return { submit, execution, mutated };
  }
}
const attempt = (id: string): Attempt => ({
  actorId: 'TECH-01', command: command(id), held: grant(), evidence: validEvidence, minute: 60,
});

describe('AEA Proof Gate 1: governed simulation route', () => {
  it('positive control: authorized action changes independently readable state once', () => {
    const controller = new ControlledFreezer();
    const result = controller.request(attempt('PG1-ALLOW'));
    expect(result.submit.determination).toBe('ALLOW');
    expect(result.execution?.determination).toBe('ALLOW');
    expect(result.mutated).toBe(true);
    expect(controller.observe()).toEqual({ defrostUntilMinute: 80 });
    expect(controller.attempts).toHaveLength(1);
    expect(controller.attempts[0].receipt).toMatch(/^[0-9a-f]{64}$/);
  });
  it.each([
    ['no grant', { held: null }],
    ['inadmissible evidence', { evidence: { ...validEvidence, admissibilitySupported: false } }],
    ['missing continuity', { evidence: { ...validEvidence, continuitySupported: false } }],
    ['revoked authority', { held: grant({ revoked: true }) }],
    ['expired authority', { held: grant({ expiresAt: minuteToIso(30) }) }],
    ['unknown actor', { actorId: 'UNKNOWN' }],
    ['wrong grant holder', { actorId: 'FM-01' }],
    ['out of bounds', { command: command('PG1-BOUND', 360) }],
  ] as Array<[string, Partial<Attempt>]> )('%s: never changes controller state', (_label, overrides) => {
    const controller = new ControlledFreezer();
    const result = controller.request({ ...attempt('PG1-NEG'), ...overrides });
    expect(result.mutated).toBe(false);
    expect(result.submit.determination).not.toBe('ALLOW');
    expect(controller.observe().defrostUntilMinute).toBe(0);
  });
  it('TOCTOU: revoked grant after submission blocks execution', () => {
    const controller = new ControlledFreezer();
    const result = controller.request(attempt('PG1-TOCTOU'), 61, { held: grant({ revoked: true }) });
    expect(result.submit.determination).toBe('ALLOW');
    expect(result.execution?.executionPermitted).toBe(false);
    expect(result.mutated).toBe(false);
    expect(controller.observe().defrostUntilMinute).toBe(0);
  });
  it('TOCTOU: evidence withdrawn after submission blocks execution', () => {
    const controller = new ControlledFreezer();
    const result = controller.request(attempt('PG1-EVIDENCE-CHANGE'), 61, {
      evidence: { ...validEvidence, admissibilitySupported: false },
    });
    expect(result.submit.determination).toBe('ALLOW');
    expect(result.execution?.executionPermitted).toBe(false);
    expect(controller.observe().defrostUntilMinute).toBe(0);
  });
  it('repeated unauthorized requests never mutate state', () => {
    const controller = new ControlledFreezer();
    for (let i = 0; i < 25; i++) {
      const result = controller.request({ ...attempt('PG1-REPLAY-' + i), held: grant({ expiresAt: minuteToIso(30) }) });
      expect(result.mutated).toBe(false);
    }
    expect(controller.observe().defrostUntilMinute).toBe(0);
    expect(controller.attempts).toHaveLength(25);
  });
  it('TOCTOU: material operational change after submission blocks execution', () => {
    const controller = new ControlledFreezer();
    const change: MaterialChange = {
      changeId: 'PG1-INCIDENT', detectedAt: minuteToIso(61),
      category: 'OPERATIONAL', material: true, description: 'Open simulated incident',
    };
    const result = controller.request(attempt('PG1-MATERIAL-CHANGE'), 61, { change });
    expect(result.submit.determination).toBe('ALLOW');
    expect(result.execution?.executionPermitted).toBe(false);
    expect(result.mutated).toBe(false);
    expect(controller.observe().defrostUntilMinute).toBe(0);
  });
  it('KNOWN GAP: repeated valid command ID is not deduplicated by this harness', () => {
    const controller = new ControlledFreezer();
    const first = controller.request(attempt('PG1-DUPLICATE'), 60);
    const second = controller.request(attempt('PG1-DUPLICATE'), 61);
    // Two accepted mutations are evidence of missing one-time execution semantics.
    // This test intentionally documents the gap; it does NOT certify replay resistance.
    expect(first.mutated).toBe(true);
    expect(second.mutated).toBe(true);
    expect(controller.attempts.filter((a) => a.mutated)).toHaveLength(2);
  });
  it('explicit scope: the harness exposes no public direct-write method', () => {
    const controller = new ControlledFreezer();
    expect('writeDirect' in controller).toBe(false);
    expect('setDefrostUntilMinute' in controller).toBe(false);
    expect(controller.observe().defrostUntilMinute).toBe(0);
  });
});
