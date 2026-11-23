import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LocalHostReservationLedger } from './helpers/aea-local-reservation-ledger';

const dirs: string[] = [];
function dir() { const d = mkdtempSync(join(tmpdir(), 'aea-ledger-')); dirs.push(d); return d; }
afterEach(() => { for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true }); });

describe('Proof Gate 2: local-host reservation ledger prototype', () => {
  it('allows first reservation and denies duplicate across fresh instances', () => {
    const d = dir();
    const first = new LocalHostReservationLedger(d);
    expect(first.reserve('COMMAND-1', 'digest-a').accepted).toBe(true);
    const restarted = new LocalHostReservationLedger(d);
    expect(restarted.reserve('COMMAND-1', 'digest-a')).toMatchObject({ accepted: false, reason: 'ALREADY_RESERVED' });
    expect(restarted.inspect('COMMAND-1')).toEqual({ commandId: 'COMMAND-1', commandDigest: 'digest-a', status: 'RESERVED' });
  });
  it('does not allow command ID reuse with different parameters', () => {
    const d = dir();
    const ledger = new LocalHostReservationLedger(d);
    expect(ledger.reserve('COMMAND-2', 'digest-a').accepted).toBe(true);
    expect(ledger.reserve('COMMAND-2', 'digest-b').accepted).toBe(false);
    expect(ledger.inspect('COMMAND-2')?.commandDigest).toBe('digest-a');
  });
  it('two ledger objects competing for one ID accept only one reservation', () => {
    const d = dir();
    const a = new LocalHostReservationLedger(d);
    const b = new LocalHostReservationLedger(d);
    const results = [a.reserve('COMMAND-COMPETE', 'digest'), b.reserve('COMMAND-COMPETE', 'digest')];
    expect(results.filter((result) => result.accepted)).toHaveLength(1);
  });
  it('permits distinct command IDs', () => {
    const ledger = new LocalHostReservationLedger(dir());
    expect(ledger.reserve('COMMAND-A', 'a').accepted).toBe(true);
    expect(ledger.reserve('COMMAND-B', 'b').accepted).toBe(true);
  });
  it('fail-closed reservation survives a new instance without completion acknowledgement', () => {
    const d = dir();
    expect(new LocalHostReservationLedger(d).reserve('COMMAND-3', 'digest').accepted).toBe(true);
    expect(new LocalHostReservationLedger(d).reserve('COMMAND-3', 'digest').accepted).toBe(false);
  });
});
