/**
 * Experimental fail-closed execution adapter. The reservation is made BEFORE
 * the simulated state mutation. No physical device is connected.
 *
 * This prototype provides at-most-once reservation on one cooperating local
 * filesystem, NOT exactly-once actuation or distributed enforcement.
 */
import { CommandBoundEmulator, type Ticket } from './aea-command-bound-emulator';
import { LocalHostReservationLedger } from './aea-local-reservation-ledger';

type ExecutionRequest = Parameters<CommandBoundEmulator['execute']>[1];

export class ReservedExecutionAdapter {
  constructor(
    private readonly emulator: CommandBoundEmulator,
    private readonly ledger: LocalHostReservationLedger,
  ) {}
  execute(ticket: Ticket, request: ExecutionRequest) {
    // The emulator's own checks are still the final gate, but the reservation
    // is irreversible: any subsequent validation failure needs explicit
    // operator reconciliation, not automatic replay.
    const reservation = this.ledger.reserve(request.command.commandId, ticket.commandDigest);
    if (!reservation.accepted) {
      return { allowed: false, reason: 'DUPLICATE_DURABLE_RESERVATION', state: this.emulator.observe() };
    }
    return this.emulator.execute(ticket, request);
  }
}
