/*
 * AEA execution gate for the simulated freezer.
 *
 * The decision engine is the production GCEA module, called unchanged:
 * evaluateCommit at submission and evaluateExecutionAttempt at execution (runtime revalidation).
 * GCEA covers evidence, authority, standing, material change and the commit and execution
 * boundaries. GCEA grants carry no actor identity and no command parameters, so this simulation
 * adds two checks around it, actor standing / grant holder and parameter bounds. Both are
 * SIMULATION adaptations and can only make a determination stricter, never turn one into ALLOW.
 *
 * Commands that bypass this gate never reach it. The gate records nothing for them and nothing
 * is fabricated on their behalf.
 */
import {
  evaluateCommit, evaluateExecutionAttempt,
  type AuthorityDetermination, type AuthorityGrant, type EvidenceStanding, type MaterialChange,
} from '../governance-continuity-execution-authority';
import { BASELINE, minuteToIso, type AuthorizedBaseline } from './baseline';

export type Consequence = 'INITIATE_DEFROST' | 'CHANGE_SETPOINT' | 'RESTORE_AUTHORIZED_BASELINE';
export type Command = { commandId: string; consequence: Consequence; params: { durationMin?: number; setpointC?: number } };
/** A GCEA grant plus the actor it was issued to (the holder is simulation-side). */
export type HeldGrant = { holderActorId: string; issuedBy: string; issuedAtMinute: number; grant: AuthorityGrant };

const RANK: Record<AuthorityDetermination, number> = { ALLOW: 0, HOLD: 1, ESCALATE: 2, DENY: 3 };
const stricter = (a: AuthorityDetermination, b: AuthorityDetermination) => (RANK[b] > RANK[a] ? b : a);

export function assetFor(command: Command, b: AuthorizedBaseline = BASELINE) {
  return { assetId: b.equipment.assetId, version: b.version, routeId: b.equipment.commandRoute, consequence: command.consequence };
}

function actorCheck(actorId: string, held: HeldGrant | null, b: AuthorizedBaseline) {
  const actor = b.actors.find((a) => a.actorId === actorId);
  const reasons: string[] = [];
  let determination: AuthorityDetermination = 'ALLOW';
  if (!actor || actor.standing !== 'CURRENT') { determination = 'DENY'; reasons.push('SIM_ACTOR_STANDING_NOT_ESTABLISHED'); }
  if (held && held.holderActorId !== actorId) { determination = 'DENY'; reasons.push('SIM_ACTOR_IS_NOT_GRANT_HOLDER'); }
  return { determination, reasons };
}

function boundsCheck(command: Command, b: AuthorizedBaseline) {
  const reasons: string[] = [];
  const { durationMin, setpointC } = command.params;
  if (command.consequence === 'INITIATE_DEFROST' && !(typeof durationMin === 'number' && durationMin > 0 && durationMin <= b.operatingLimits.maxDefrostMin)) reasons.push('SIM_COMMAND_OUTSIDE_AUTHORIZED_LIMITS');
  if (command.consequence === 'CHANGE_SETPOINT' && !(typeof setpointC === 'number' && setpointC >= b.operatingLimits.setpointRangeC[0] && setpointC <= b.operatingLimits.setpointRangeC[1])) reasons.push('SIM_COMMAND_OUTSIDE_AUTHORIZED_LIMITS');
  return { determination: (reasons.length ? 'DENY' : 'ALLOW') as AuthorityDetermination, reasons };
}

export type SubmissionResult = {
  commandId: string;
  actorId: string;
  determination: AuthorityDetermination;
  commitPermitted: boolean;
  reasonCodes: string[];
  gcea: { determination: AuthorityDetermination; reasonCodes: string[]; receiptHash: string; replayId: string; commitId: string | null };
};

/** Submission through the governed route: simulation pre-checks, then GCEA commit evaluation. */
export function submitCommand(input: { actorId: string; command: Command; held: HeldGrant | null; evidence: EvidenceStanding; change: MaterialChange | null; minute: number; b?: AuthorizedBaseline }): SubmissionResult {
  const b = input.b ?? BASELINE;
  const actor = actorCheck(input.actorId, input.held, b);
  const bounds = boundsCheck(input.command, b);
  const commit = evaluateCommit({ asset: assetFor(input.command, b), authority: input.held?.grant ?? null, change: input.change, evidence: input.evidence, now: minuteToIso(input.minute) });
  const determination = [actor.determination, bounds.determination].reduce(stricter, commit.determination);
  return {
    commandId: input.command.commandId,
    actorId: input.actorId,
    determination,
    commitPermitted: determination === 'ALLOW' && commit.commitPermitted,
    reasonCodes: [...actor.reasons, ...bounds.reasons, ...commit.reasonCodes],
    gcea: { determination: commit.determination, reasonCodes: commit.reasonCodes, receiptHash: commit.receipt.hash, replayId: commit.receipt.replayId, commitId: commit.commit?.commitId ?? null },
  };
}

export type ExecutionResult = { commandId: string; determination: AuthorityDetermination; executionPermitted: boolean; reasonCodes: string[]; gcea: { receiptHash: string; replayId: string } };

/** Runtime revalidation at the execution boundary: authority and evidence are re-evaluated NOW. */
export function executeCommitted(input: { actorId: string; command: Command; held: HeldGrant | null; evidence: EvidenceStanding; change: MaterialChange | null; minute: number; b?: AuthorizedBaseline }): ExecutionResult {
  const b = input.b ?? BASELINE;
  const actor = actorCheck(input.actorId, input.held, b);
  const attempt = evaluateExecutionAttempt({
    authorityInput: { asset: assetFor(input.command, b), authority: input.held?.grant ?? null, change: input.change, evidence: input.evidence, now: minuteToIso(input.minute) },
    attempt: { attemptId: `${input.command.commandId}-EXEC`, attemptedAt: minuteToIso(input.minute), consequence: input.command.consequence },
  });
  const determination = stricter(attempt.determination, actor.determination);
  return {
    commandId: input.command.commandId,
    determination,
    executionPermitted: determination === 'ALLOW' && attempt.executionPermitted,
    reasonCodes: [...actor.reasons, ...attempt.reasonCodes],
    gcea: { receiptHash: attempt.receipt.hash, replayId: attempt.receipt.replayId },
  };
}
