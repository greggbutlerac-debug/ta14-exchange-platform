/*
 * SIMULATION ONLY: separately authorized emergency-response pathway for loss of independent
 * evidence during a refrigeration incident.
 *
 * Three tiers, never interchangeable:
 *   E0 EMERGENCY_NOTIFICATION: tell people. No equipment effect; recorded; needs no authority.
 *   E1 PROTECTIVE_MEASURE: a closed list of parameterless actions that can only re-assert values
 *      already in the sealed authorized baseline. Requires a pre-issued emergency authority (scoped
 *      to the emergency route and the specific measure), an emergency responder with standing,
 *      and the emergency condition: sustained loss of independent evidence, computed here from the
 *      EIN's own record and never accepted from the caller. One use per measure per incident;
 *      revalidated at execution; ordinary re-authorization is still required afterwards.
 *   E2 CONSEQUENTIAL_COMMAND: everything else (defrost, any other setpoint, disabling alarms or
 *      reporting). Never available on the emergency path. It must use ordinary governance, which
 *      still refuses to act without admissible evidence.
 *
 * GCEA is called unchanged. The evidence it receives for E1 is the evidence the emergency route
 * relies on: a continuous, recorded EIN determination that state cannot be established. When
 * independent evidence is available the emergency route is refused, so it cannot be used to avoid
 * ordinary governance.
 */
import {
  evaluateCommit, evaluateExecutionAttempt,
  type AuthorityDetermination, type AuthorityGrant,
} from '../governance-continuity-execution-authority';
import { BASELINE, hashObject, minuteToIso, sealBaseline, type AuthorizedBaseline } from './baseline';
import type { EnvironmentalIntegrityNode } from './ein';
import type { ControllerConfig } from './plant';

export const PROTECTIVE_MEASURES = {
  RESTORE_SEALED_SETPOINT: 'Set the controller setpoint to the value in the sealed baseline.',
  TERMINATE_ACTIVE_DEFROST: 'End any defrost in progress (cooling resumes under the thermostat).',
  RE_ENABLE_CONTROLLER_ALARM: 'Re-enable the controller\'s own high-temperature alarm.',
} as const;
export type ProtectiveMeasure = keyof typeof PROTECTIVE_MEASURES;
export type EmergencyRequest =
  | { kind: 'EMERGENCY_NOTIFICATION'; message: string }
  | { kind: 'PROTECTIVE_MEASURE'; requestId: string; measure: string; params?: Record<string, unknown> }
  | { kind: 'CONSEQUENTIAL_COMMAND'; requestId: string; consequence: string; params?: Record<string, unknown> };

export type EmergencyProtocol = {
  protocolId: string;
  version: string;
  sealedBaselineSha256: string;
  routeId: string;
  activation: { requiredEinStatus: 'EVIDENCE_INSUFFICIENT'; sustainedMin: number };
  responders: Array<{ actorId: string; role: 'EMERGENCY_RESPONDER'; standing: 'CURRENT' | 'REVOKED' }>;
  measures: ProtectiveMeasure[];
  followUp: 'ORDINARY_REAUTHORIZATION_REQUIRED';
};

export function emergencyProtocol(b: AuthorizedBaseline = BASELINE): EmergencyProtocol {
  return {
    protocolId: 'RCB-EP-1.0', version: '1.0', sealedBaselineSha256: sealBaseline(b).sealSha256, routeId: 'emergency-protective-route',
    activation: { requiredEinStatus: 'EVIDENCE_INSUFFICIENT', sustainedMin: 15 },
    responders: [{ actorId: 'TECH-01', role: 'EMERGENCY_RESPONDER', standing: 'CURRENT' }],
    measures: ['RESTORE_SEALED_SETPOINT', 'TERMINATE_ACTIVE_DEFROST', 'RE_ENABLE_CONTROLLER_ALARM'],
    followUp: 'ORDINARY_REAUTHORIZATION_REQUIRED',
  };
}
export const protocolSeal = (p: EmergencyProtocol) => hashObject(p);

/** GCEA grant for one protective measure on the emergency route, pre-issued by the facility manager. */
export function emergencyGrant(measure: ProtectiveMeasure, effectiveMin: number, expiresMin: number, b: AuthorizedBaseline = BASELINE): AuthorityGrant {
  return { authorityId: `AUTH-EMERGENCY-${measure}`, assetId: b.equipment.assetId, assetVersion: b.version, routeId: emergencyProtocol(b).routeId, consequence: `EMERGENCY_PROTECTIVE:${measure}`, effectiveAt: minuteToIso(effectiveMin), expiresAt: minuteToIso(expiresMin), revoked: false };
}
export type HeldEmergencyGrant = { holderActorId: string; grant: AuthorityGrant };

/** The emergency condition, computed from the EIN's own samples. Never supplied by the caller. */
export function emergencyCondition(ein: EnvironmentalIntegrityNode, minute: number, p: EmergencyProtocol) {
  const samples = ein.samples.filter((s) => s.minute <= minute);
  const latest = samples.at(-1);
  if (!latest || latest.status !== p.activation.requiredEinStatus) return { present: false, sustainedMin: 0, since: null as number | null, reason: 'INDEPENDENT_EVIDENCE_AVAILABLE_USE_ORDINARY_GOVERNANCE' };
  let since = latest.minute;
  for (let i = samples.length - 1; i >= 0 && samples[i].status === p.activation.requiredEinStatus; i--) since = samples[i].minute;
  const sustainedMin = latest.minute - since;
  return { present: sustainedMin >= p.activation.sustainedMin, sustainedMin, since, reason: sustainedMin >= p.activation.sustainedMin ? 'EVIDENCE_LOSS_SUSTAINED' : 'EVIDENCE_LOSS_NOT_YET_SUSTAINED' };
}

const RANK: Record<AuthorityDetermination, number> = { ALLOW: 0, HOLD: 1, ESCALATE: 2, DENY: 3 };
const stricter = (a: AuthorityDetermination, b: AuthorityDetermination) => (RANK[b] > RANK[a] ? b : a);

export type EmergencyDecision = {
  tier: 'E0_NOTIFICATION' | 'E1_PROTECTIVE_MEASURE' | 'E2_CONSEQUENTIAL_COMMAND';
  determination: AuthorityDetermination;
  permitted: boolean;
  reasonCodes: string[];
  gcea: { receiptHash: string; replayId: string } | null;
  conditionEvidenceId: string | null;
};

function preChecks(input: { actorId: string; request: EmergencyRequest; held: HeldEmergencyGrant | null; ein: EnvironmentalIntegrityNode; minute: number; protocol: EmergencyProtocol; executed: ReadonlySet<string> }) {
  const { request, protocol } = input;
  const reasons: string[] = [];
  let d: AuthorityDetermination = 'ALLOW';
  const deny = (c: string) => { d = stricter(d, 'DENY'); reasons.push(c); };
  const hold = (c: string) => { d = stricter(d, 'HOLD'); reasons.push(c); };
  if (protocol.sealedBaselineSha256 !== sealBaseline().sealSha256) deny('EMERGENCY_PROTOCOL_BASELINE_MISMATCH');
  const responder = protocol.responders.find((r) => r.actorId === input.actorId);
  if (!responder || responder.standing !== 'CURRENT') deny('EMERGENCY_RESPONDER_STANDING_NOT_ESTABLISHED');
  if (input.held && input.held.holderActorId !== input.actorId) deny('EMERGENCY_ACTOR_IS_NOT_GRANT_HOLDER');
  if (request.kind === 'PROTECTIVE_MEASURE') {
    if (!(protocol.measures as string[]).includes(request.measure)) deny('NOT_A_PROTECTIVE_MEASURE_USE_ORDINARY_GOVERNANCE');
    if (request.params && Object.keys(request.params).length > 0) deny('PROTECTIVE_MEASURES_TAKE_NO_PARAMETERS');
    if (input.executed.has(request.measure)) deny('PROTECTIVE_MEASURE_ALREADY_USED_THIS_INCIDENT');
  }
  const condition = emergencyCondition(input.ein, input.minute, protocol);
  if (!condition.present) (condition.reason === 'EVIDENCE_LOSS_NOT_YET_SUSTAINED' ? hold : deny)(`EMERGENCY_CONDITION_${condition.reason}`);
  return { d, reasons, condition };
}

function gceaInput(input: { request: EmergencyRequest; held: HeldEmergencyGrant | null; ein: EnvironmentalIntegrityNode; minute: number; protocol: EmergencyProtocol }, condition: ReturnType<typeof emergencyCondition>) {
  const measure = input.request.kind === 'PROTECTIVE_MEASURE' ? input.request.measure : 'NONE';
  const lossSamples = condition.since === null ? [] : input.ein.samples.filter((s) => s.minute >= condition.since! && s.minute <= input.minute);
  const conditionEvidenceId = lossSamples.length ? hashObject(lossSamples.map((s) => ({ minute: s.minute, status: s.status, evidenceQuality: s.evidenceQuality, findings: s.findings.map((f) => f.code) }))) : 'NO-CONDITION-EVIDENCE';
  return {
    conditionEvidenceId,
    authorityInput: {
      asset: { assetId: BASELINE.equipment.assetId, version: BASELINE.version, routeId: input.protocol.routeId, consequence: `EMERGENCY_PROTECTIVE:${measure}` },
      authority: input.held?.grant ?? null,
      change: null,
      // The evidence this route relies on: a continuous, recorded determination that state cannot be established.
      evidence: { continuitySupported: condition.present, admissibilitySupported: condition.present, evidenceId: conditionEvidenceId },
      now: minuteToIso(input.minute),
    },
  };
}

/** Evaluates an emergency request at submission (commit boundary). */
export function evaluateEmergency(input: { actorId: string; request: EmergencyRequest; held: HeldEmergencyGrant | null; ein: EnvironmentalIntegrityNode; minute: number; protocol?: EmergencyProtocol; executed?: ReadonlySet<string> }): EmergencyDecision {
  const protocol = input.protocol ?? emergencyProtocol();
  const executed = input.executed ?? new Set<string>();
  if (input.request.kind === 'EMERGENCY_NOTIFICATION') return { tier: 'E0_NOTIFICATION', determination: 'ALLOW', permitted: true, reasonCodes: ['NOTIFICATION_HAS_NO_EQUIPMENT_EFFECT'], gcea: null, conditionEvidenceId: null };
  if (input.request.kind === 'CONSEQUENTIAL_COMMAND') return { tier: 'E2_CONSEQUENTIAL_COMMAND', determination: 'DENY', permitted: false, reasonCodes: ['CONSEQUENTIAL_COMMAND_NOT_AVAILABLE_ON_EMERGENCY_PATH', 'USE_ORDINARY_GOVERNANCE'], gcea: null, conditionEvidenceId: null };
  const pre = preChecks({ ...input, protocol, executed });
  const g = gceaInput({ ...input, protocol }, pre.condition);
  const commit = evaluateCommit(g.authorityInput);
  const determination = stricter(commit.determination, pre.d);
  return { tier: 'E1_PROTECTIVE_MEASURE', determination, permitted: determination === 'ALLOW' && commit.commitPermitted, reasonCodes: [...pre.reasons, ...commit.reasonCodes], gcea: { receiptHash: commit.receipt.hash, replayId: commit.receipt.replayId }, conditionEvidenceId: g.conditionEvidenceId };
}

/** Revalidation at the execution boundary: authority, standing and the emergency condition, NOW. */
export function executeEmergency(input: { actorId: string; request: EmergencyRequest; held: HeldEmergencyGrant | null; ein: EnvironmentalIntegrityNode; minute: number; protocol?: EmergencyProtocol; executed?: ReadonlySet<string> }): EmergencyDecision {
  const protocol = input.protocol ?? emergencyProtocol();
  if (input.request.kind !== 'PROTECTIVE_MEASURE') return evaluateEmergency(input);
  const pre = preChecks({ ...input, protocol, executed: input.executed ?? new Set() });
  const g = gceaInput({ ...input, protocol }, pre.condition);
  const attempt = evaluateExecutionAttempt({ authorityInput: g.authorityInput, attempt: { attemptId: `${input.request.requestId}-EXEC`, attemptedAt: minuteToIso(input.minute), consequence: g.authorityInput.asset.consequence } });
  const determination = stricter(attempt.determination, pre.d);
  return { tier: 'E1_PROTECTIVE_MEASURE', determination, permitted: determination === 'ALLOW' && attempt.executionPermitted, reasonCodes: [...pre.reasons, ...attempt.reasonCodes], gcea: { receiptHash: attempt.receipt.hash, replayId: attempt.receipt.replayId }, conditionEvidenceId: g.conditionEvidenceId };
}

/** Applies a permitted protective measure. Each one only re-asserts a sealed-baseline value. */
export function applyProtectiveMeasure(measure: ProtectiveMeasure, c: ControllerConfig, b: AuthorizedBaseline = BASELINE): Partial<ControllerConfig> {
  if (measure === 'RESTORE_SEALED_SETPOINT') { c.setpointC = b.setpointC; return { setpointC: b.setpointC }; }
  if (measure === 'TERMINATE_ACTIVE_DEFROST') { c.defrostUntilMinute = null; return { defrostUntilMinute: null }; }
  c.alarmSuppressed = false;
  return { alarmSuppressed: false };
}
