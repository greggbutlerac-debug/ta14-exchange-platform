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
  private readonly executedCommandIds = new Set<string>();
  readonly attempts: Array<{ id: string; determination: string; mutated: boolean; receipt: string }> = [];
  observe() { return { defrostUntilMinute: this.defrostUntilMinute }; }
  request(input: Attempt, executeAtMinute = input.minute, executionOverrides: Partial<Attempt> = {}) {
    if (this.executedCommandIds.has(input.command.commandId)) {
      this.attempts.push({ id: input.command.commandId, determination: 'DENY', mutated: false, receipt: 'LOCAL_DUPLICATE_COMMAND_ID' });
      return { submit: null, execution: null, mutated: false, reason: 'DUPLICATE_COMMAND_ID' };
    }
    const submit = submitCommand({ ...input, change: input.change ?? null });
    if (!submit.commitPermitted) {
      this.attempts.push({ id: input.command.commandId, determination: submit.determination, mutated: false, receipt: submit.gcea.receiptHash });
      return { submit, execution: null, mutated: false };
    }
    const executionInput = { ...input, ...executionOverrides, minute: executeAtMinute };
    const execution = executeCommitted({ ...executionInput, change: executionInput.change ?? null });
    const mutated = execution.executionPermitted && execution.determination === 'ALLOW';
    if (mutated) {
      this.executedCommandIds.add(input.command.commandId);
      this.defrostUntilMinute = executeAtMinute + input.command.params.durationMin!;
    }
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
  it('replay: repeated valid command ID is denied by the simulated controller adapter', () => {
    const controller = new ControlledFreezer();
    const first = controller.request(attempt('PG1-DUPLICATE'), 60);
    const second = controller.request(attempt('PG1-DUPLICATE'), 61);
    expect(first.mutated).toBe(true);
    expect(second.mutated).toBe(false);
    expect(second.reason).toBe('DUPLICATE_COMMAND_ID');
    expect(controller.observe().defrostUntilMinute).toBe(80);
    expect(controller.attempts.filter((a) => a.mutated)).toHaveLength(1);
  });
  it('a denied attempt does not consume the command ID', () => {
    const controller = new ControlledFreezer();
    const denied = controller.request({ ...attempt('PG1-RETRY'), held: null });
    const allowed = controller.request(attempt('PG1-RETRY'));
    expect(denied.mutated).toBe(false);
    expect(allowed.mutated).toBe(true);
    expect(controller.attempts.filter((a) => a.mutated)).toHaveLength(1);
  });
  it('KNOWN BOUNDARY: raw executeCommitted is not coupled to an earlier submit receipt', () => {
    // This is a characterization test, NOT a prevention test. The adapter
    // requires submit first; the exported GCEA execution helper itself does not
    // receive a prior commit ID. A caller with direct access may skip submit.
    const input = attempt('PG1-RAW-EXEC');
    const result = executeCommitted({ ...input, change: null });
    expect(result.executionPermitted).toBe(true);
    expect(result.determination).toBe('ALLOW');
  });
  it('raw execution helper now rechecks command parameter bounds', () => {
    // Demonstrates why all claimed writes must pass the guarded adapter.
    const input = { ...attempt('PG1-RAW-BOUND'), command: command('PG1-RAW-BOUND', 360) };
    const submit = submitCommand({ ...input, change: null });
    const execution = executeCommitted({ ...input, change: null });
    expect(submit.commitPermitted).toBe(false);
    expect(execution.executionPermitted).toBe(false);
    expect(execution.reasonCodes).toContain('SIM_COMMAND_OUTSIDE_AUTHORIZED_LIMITS');
  });
  it('KNOWN BOUNDARY: commit ID is not bound to command parameters or command ID', () => {
    // GCEA commit binds asset/route/consequence/authority/evidence/time,
    // not the exact simulation command payload. Do not treat it as a
    // cryptographic authorization for a particular defrost duration.
    const a = attempt('PG1-COMMIT-A');
    const b = { ...attempt('PG1-COMMIT-B'), command: command('PG1-COMMIT-B', 25) };
    const first = submitCommand({ ...a, change: null });
    const second = submitCommand({ ...b, change: null });
    expect(first.commitPermitted).toBe(true);
    expect(second.commitPermitted).toBe(true);
    expect(first.gcea.commitId).toBe(second.gcea.commitId);
  });
  it('explicit scope: the harness exposes no public direct-write method', () => {
    const controller = new ControlledFreezer();
    expect('writeDirect' in controller).toBe(false);
    expect('setDefrostUntilMinute' in controller).toBe(false);
    expect(controller.observe().defrostUntilMinute).toBe(0);
  });
});
