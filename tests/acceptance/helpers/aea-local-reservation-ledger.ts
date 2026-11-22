/**
 * Proof Gate 2 experimental local-host execution ledger.
 *
 * The exclusive-create marker is atomic for competing processes on a local
 * filesystem that honors O_EXCL. It is NOT a distributed transaction, and it
 * does not make physical actuation atomic with the marker. A crash after
 * reservation may prevent retry even if the device did not act (fail closed).
 * Never use this as a production safety controller.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, openSync, closeSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export type Reservation = { accepted: boolean; reason: 'RESERVED' | 'ALREADY_RESERVED'; marker: string };
export class LocalHostReservationLedger {
  constructor(private readonly directory: string) {
    mkdirSync(directory, { recursive: true });
  }
  reserve(commandId: string, commandDigest: string): Reservation {
    const key = createHash('sha256').update(commandId).digest('hex');
    const marker = join(this.directory, key + '.json');
    const record = JSON.stringify({ commandId, commandDigest, status: 'RESERVED' });
    try {
      const fd = openSync(marker, 'wx', 0o600);
      try { writeFileSync(fd, record); } finally { closeSync(fd); }
      return { accepted: true, reason: 'RESERVED', marker };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
        return { accepted: false, reason: 'ALREADY_RESERVED', marker };
      }
      throw error;
    }
  }
  inspect(commandId: string): { commandId: string; commandDigest: string; status: string } | null {
    const key = createHash('sha256').update(commandId).digest('hex');
    try { return JSON.parse(readFileSync(join(this.directory, key + '.json'), 'utf8')); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }
}
