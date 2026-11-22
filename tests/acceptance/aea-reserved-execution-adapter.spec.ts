import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CommandBoundEmulator, proofFixture } from './helpers/aea-command-bound-emulator';
import { LocalHostReservationLedger } from './helpers/aea-local-reservation-ledger';
import { ReservedExecutionAdapter } from './helpers/aea-reserved-execution-adapter';

const directories: string[] = [];
function newDirectory() {
  const directory = mkdtempSync(join(tmpdir(), 'aea-reserved-'));
  directories.push(directory);
  return directory;
}
afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('Proof Gate 2: fail-closed reservation-before-execution adapter', () => {
  it('executes an authorized command once, then refuses replay with a fresh emulator', () => {
    const directory = newDirectory();
    const request = proofFixture('RESERVED-ONCE');
    const first = new CommandBoundEmulator();
    const firstTicket = first.authorize(request)!;
    const firstAdapter = new ReservedExecutionAdapter(first, new LocalHostReservationLedger(directory));
    expect(firstAdapter.execute(firstTicket, request)).toMatchObject({ allowed: true, state: 1 });

    const restarted = new CommandBoundEmulator();
    const restartedTicket = restarted.authorize(request)!;
    const secondAdapter = new ReservedExecutionAdapter(restarted, new LocalHostReservationLedger(directory));
    expect(secondAdapter.execute(restartedTicket, request)).toMatchObject({
      allowed: false, reason: 'DUPLICATE_DURABLE_RESERVATION', state: 0,
    });
  });

  it('fails closed after reservation even when execution validation denies', () => {
    const directory = newDirectory();
    const request = proofFixture('RESERVED-REVOKED');
    const emulator = new CommandBoundEmulator();
    const ticket = emulator.authorize(request)!;
    const adapter = new ReservedExecutionAdapter(emulator, new LocalHostReservationLedger(directory));
    const revoked = { ...request, held: { ...request.held!, grant: { ...request.held!.grant, revoked: true } } };
    expect(adapter.execute(ticket, revoked)).toMatchObject({ allowed: false, reason: 'EXECUTION_BOUNDARY_REFUSED', state: 0 });
    expect(adapter.execute(ticket, request)).toMatchObject({ allowed: false, reason: 'DUPLICATE_DURABLE_RESERVATION', state: 0 });
  });

  it('does not permit a changed payload after an earlier reservation', () => {
    const directory = newDirectory();
    const request = proofFixture('RESERVED-SWAP');
    const emulator = new CommandBoundEmulator();
    const ticket = emulator.authorize(request)!;
    const adapter = new ReservedExecutionAdapter(emulator, new LocalHostReservationLedger(directory));
    const altered = { ...request, command: { ...request.command, params: { durationMin: 30 } } };
    expect(adapter.execute(ticket, altered)).toMatchObject({ allowed: false, reason: 'COMMAND_PAYLOAD_MISMATCH', state: 0 });
    expect(adapter.execute(ticket, request)).toMatchObject({ allowed: true, state: 1 });
  });
});
