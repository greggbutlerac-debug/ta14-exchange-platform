import { describe, expect, it } from 'vitest';
import { CommandBoundEmulator, proofFixture } from './helpers/aea-command-bound-emulator';

describe('Proof Gate 2 prototype: exact-command one-shot capability', () => {
  it('allows one authorized execution and rejects a replay', () => {
    const emu = new CommandBoundEmulator();
    const request = proofFixture('PG2-ONCE');
    const ticket = emu.authorize(request);
    expect(ticket).not.toBeNull();
    expect(emu.execute(ticket!, request)).toMatchObject({ allowed: true, state: 1 });
    expect(emu.execute(ticket!, request)).toMatchObject({ allowed: false, reason: 'MISSING_OR_CONSUMED_TICKET', state: 1 });
  });
  it('rejects an execution without a prior ticket', () => {
    const emu = new CommandBoundEmulator();
    const request = proofFixture('PG2-NO-COMMIT');
    const ticket = { token: 'forged', commandDigest: 'forged', commandId: request.command.commandId, issuedAt: 60, commitId: 'forged' };
    expect(emu.execute(ticket, request)).toMatchObject({ allowed: false, state: 0 });
  });
  it('rejects changed command parameters and preserves ticket for the original command', () => {
    const emu = new CommandBoundEmulator();
    const request = proofFixture('PG2-SWAP');
    const ticket = emu.authorize(request)!;
    const altered = { ...request, command: { ...request.command, params: { durationMin: 25 } } };
    expect(emu.execute(ticket, altered)).toMatchObject({ allowed: false, reason: 'COMMAND_PAYLOAD_MISMATCH', state: 0 });
    expect(emu.execute(ticket, request)).toMatchObject({ allowed: true, state: 1 });
  });
  it('rejects changed command ID and forged ticket contents', () => {
    const emu = new CommandBoundEmulator();
    const request = proofFixture('PG2-ID');
    const ticket = emu.authorize(request)!;
    expect(emu.execute(ticket, { ...request, command: { ...request.command, commandId: 'OTHER' } }).allowed).toBe(false);
    expect(emu.execute({ ...ticket, commandId: 'OTHER' }, request)).toMatchObject({ allowed: false, reason: 'ALTERED_TICKET' });
    expect(emu.observe()).toBe(0);
  });
  it('revalidates revocation at execution', () => {
    const emu = new CommandBoundEmulator();
    const request = proofFixture('PG2-REVOKE');
    const ticket = emu.authorize(request)!;
    const revoked = { ...request, held: { ...request.held!, grant: { ...request.held!.grant, revoked: true } } };
    expect(emu.execute(ticket, revoked)).toMatchObject({ allowed: false, reason: 'EXECUTION_BOUNDARY_REFUSED', state: 0 });
  });
  it('KNOWN GAP: a fresh emulator can reauthorize an already executed command', () => {
    // Two process instances have no shared ledger. This intentionally
    // characterizes the restart/distributed replay gap, not a security pass.
    const request = proofFixture('PG2-RESTART');
    const first = new CommandBoundEmulator();
    const ticket = first.authorize(request)!;
    expect(first.execute(ticket, request).allowed).toBe(true);
    const restarted = new CommandBoundEmulator();
    const replayedTicket = restarted.authorize(request)!;
    expect(restarted.execute(replayedTicket, request).allowed).toBe(true);
    // Each instance observed one mutation: no globally enforced at-most-once rule.
    expect(first.observe() + restarted.observe()).toBe(2);
  });
  it('sequential attempts from the same ticket execute at most once', () => {
    const emu = new CommandBoundEmulator();
    const request = proofFixture('PG2-RACE');
    const ticket = emu.authorize(request)!;
    const results = Array.from({ length: 50 }, () => emu.execute(ticket, request));
    expect(results.filter((x) => x.allowed)).toHaveLength(1);
    expect(emu.observe()).toBe(1);
  });
});
