/**
 * Proof Gate 2 prototype: deterministic, single-process command-bound execution.
 * Not a production adapter or distributed durable ledger.
 */
import { createHash } from 'node:crypto';
import { BASELINE, minuteToIso } from '../../../apps/web/lib/refrigeration-boundary/baseline';
import { submitCommand, executeCommitted, type Command, type HeldGrant } from '../../../apps/web/lib/refrigeration-boundary/gate';
import type { EvidenceStanding, MaterialChange } from '../../../apps/web/lib/governance-continuity-execution-authority';

type Request = {
  actorId: string; command: Command; held: HeldGrant | null;
  evidence: EvidenceStanding; change: MaterialChange | null; minute: number;
};
const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export type Ticket = { token: string; commandDigest: string; commandId: string; issuedAt: number; commitId: string; actorId: string; authorityId: string; evidenceId: string };
export type Result = { allowed: boolean; reason: string; state: number };

export class CommandBoundEmulator {
  private readonly tickets = new Map<string, Ticket>();
  private readonly consumed = new Set<string>();
  private state = 0;
  observe() { return this.state; }
  authorize(request: Request): Ticket | null {
    const submission = submitCommand(request);
    if (!submission.commitPermitted || !submission.gcea.commitId) return null;
    const commandDigest = digest(request.command);
    const token = digest({ commandDigest, commitId: submission.gcea.commitId, actorId: request.actorId, minute: request.minute });
    const ticket = { token, commandDigest, commandId: request.command.commandId, issuedAt: request.minute, commitId: submission.gcea.commitId, actorId: request.actorId, authorityId: request.held!.grant.authorityId, evidenceId: request.evidence.evidenceId };
    // A repeat authorization for the same token is not a fresh capability.
    if (!this.consumed.has(token)) this.tickets.set(token, ticket);
    return ticket;
  }
  execute(ticket: Ticket, request: Request): Result {
    const fail = (reason: string): Result => ({ allowed: false, reason, state: this.state });
    const issued = this.tickets.get(ticket.token);
    if (!issued || this.consumed.has(ticket.token)) return fail('MISSING_OR_CONSUMED_TICKET');
    if (digest(issued) !== digest(ticket)) return fail('ALTERED_TICKET');
    if (digest(request.command) !== issued.commandDigest || request.command.commandId !== issued.commandId) return fail('COMMAND_PAYLOAD_MISMATCH');
    if (request.minute < issued.issuedAt) return fail('EXECUTION_BEFORE_AUTHORIZATION');
    if (request.actorId !== issued.actorId || request.held?.grant.authorityId !== issued.authorityId || request.evidence.evidenceId !== issued.evidenceId) return fail('AUTHORIZATION_BINDING_MISMATCH');
    // Re-evaluate standing at the final write boundary.
    const execution = executeCommitted(request);
    if (!execution.executionPermitted) return fail('EXECUTION_BOUNDARY_REFUSED');
    // Synchronous check + consume + state write: atomic only within one JS process.
    this.consumed.add(ticket.token);
    this.tickets.delete(ticket.token);
    this.state += 1;
    return { allowed: true, reason: 'EXECUTED_ONCE', state: this.state };
  }
}
export function proofFixture(id: string): Request {
  const held: HeldGrant = {
    holderActorId: 'TECH-01', issuedBy: 'FM-01', issuedAtMinute: 0,
    grant: {
      authorityId: 'PG2-AUTH', assetId: BASELINE.equipment.assetId,
      assetVersion: BASELINE.version, routeId: BASELINE.equipment.commandRoute,
      consequence: 'INITIATE_DEFROST', effectiveAt: minuteToIso(0),
      expiresAt: minuteToIso(500), revoked: false,
    },
  };
  return {
    actorId: 'TECH-01',
    command: { commandId: id, consequence: 'INITIATE_DEFROST', params: { durationMin: 20 } },
    held, evidence: { continuitySupported: true, admissibilitySupported: true, evidenceId: 'PG2-EVIDENCE' },
    change: null, minute: 60,
  };
}
