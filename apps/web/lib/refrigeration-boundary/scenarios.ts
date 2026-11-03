/*
 * SIMULATION ONLY: the eight adversarial scenarios of the Refrigeration Consequence Boundary.
 *
 * Each run is deterministic (fixed epoch, 1-minute steps, seeded noise). What TA-14 sees and
 * preserves (EIN samples, EIR entries, AEA determinations) is kept apart from the simulation's
 * ground truth (true temperatures and the attacker's actions), which exists only because this is a
 * simulation. Every claim verdict is computed from the run, never asserted.
 */
import { BASELINE, SAMPLE_EVERY_MIN, SIMULATION_LABEL, hashObject, inAuthorizedDefrostContext, inAuthorizedDefrostWindow, minuteToIso, sealBaseline, sha256 } from './baseline';
import { controllerReport, initialController, readProbes, round, settledState, stepPlant, type ControllerConfig, type ProbeFault, type TruthState } from './plant';
import { EnvironmentalIntegrityNode, SEVERITY, type EinSample, type EinStatus } from './ein';
import { EnvironmentalIntegrityRecorder } from './eir';
import { executeCommitted, submitCommand, type Command, type HeldGrant, type SubmissionResult, type ExecutionResult } from './gate';
import { verifyIncidentRecord, type IncidentRecord, type VerificationResult } from './verify';
import type { MaterialChange } from '../governance-continuity-execution-authority';

export const DURATION_MIN = 1440;
export const ATTACK_MINUTE = 180; // 03:00, outside every authorized defrost window
const URGENT: EinStatus[] = ['EXCEPTION', 'FAULT', 'EVIDENCE_INSUFFICIENT'];

export type ClaimStatus = 'PASS' | 'FAIL' | 'NOT_DEMONSTRATED';
export type Claim = { capability: string; status: ClaimStatus; basis: string };

type AeaSubmitEvent = { at: number; kind: 'AEA_SUBMIT'; actorId: string; command: Command; grantKey: string | null; authorized: boolean; label: string };
type BypassEvent = { at: number; kind: 'BYPASS'; label: string; apply: (c: ControllerConfig) => void };
type ScenarioEvent = AeaSubmitEvent | BypassEvent;

export type ScenarioDefinition = {
  id: string;
  number: number;
  title: string;
  attempted: string;
  events: ScenarioEvent[];
  probeFaults: ProbeFault[];
  response: 'AUTO' | 'NONE';
  revalidationDrill?: boolean;
  routineCommandDuringIncident?: boolean;
  capabilities: string[];
  unproven: string[];
};

const ATTACKER = 'UNKNOWN-REMOTE-01';
const grant = (authorityId: string, consequence: Command['consequence'], effectiveMin: number, expiresMin: number) => ({
  authorityId, assetId: BASELINE.equipment.assetId, assetVersion: BASELINE.version, routeId: BASELINE.equipment.commandRoute, consequence,
  effectiveAt: minuteToIso(effectiveMin), expiresAt: minuteToIso(expiresMin), revoked: false,
});

/** Grants that exist before each run starts. */
function initialGrants(): Record<string, HeldGrant> {
  return {
    // A technician's manual-defrost authority, valid for this whole day.
    'TECH-DEFROST-CURRENT': { holderActorId: 'TECH-01', issuedBy: 'FM-01', issuedAtMinute: -60, grant: grant('AUTH-TECH-DEFROST-0701', 'INITIATE_DEFROST', -60, 1440) },
    // Yesterday's manual-defrost authority: genuine, but expired at 23:00 on the previous day.
    'TECH-DEFROST-EXPIRED': { holderActorId: 'TECH-01', issuedBy: 'FM-01', issuedAtMinute: -1500, grant: grant('AUTH-TECH-DEFROST-0630', 'INITIATE_DEFROST', -1500, -60) },
  };
}

const COMMON_UNPROVEN = [
  'Physical-system behaviour: the thermal model is illustrative and unvalidated.',
  'Real controller protocols, network paths and attacker capabilities were not tested.',
  'Detection depends on independent sensors existing, being installed correctly and staying independent of the compromised path.',
];

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'S1', number: 1, title: 'Unauthorized defrost command submitted through AEA',
    attempted: 'An unrecognized remote actor submits a 6-hour defrost through the governed command route, without any authority grant.',
    events: [{ at: ATTACK_MINUTE, kind: 'AEA_SUBMIT', actorId: ATTACKER, command: { commandId: 'CMD-S1-DEFROST-360', consequence: 'INITIATE_DEFROST', params: { durationMin: 360 } }, grantKey: null, authorized: false, label: 'Unauthorized 6-hour defrost via AEA' }],
    probeFaults: [], response: 'NONE',
    capabilities: ['PREVENTION', 'NO_FALSE_ALERT', 'EVIDENCE_PRESERVATION'],
    unproven: ['That every real command path passes through the gate. A bypass path is examined in S2.', ...COMMON_UNPROVEN],
  },
  {
    id: 'S2', number: 2, title: 'Unauthorized defrost command bypassing AEA',
    attempted: 'An attacker writes a 6-hour defrost directly to the controller, outside the governed route.',
    events: [{ at: ATTACK_MINUTE, kind: 'BYPASS', label: 'Direct controller write: defrost for 360 min', apply: (c) => { c.defrostUntilMinute = ATTACK_MINUTE + 360; } }],
    probeFaults: [], response: 'AUTO',
    capabilities: ['PREVENTION', 'DETECTION', 'NO_FABRICATED_AUTHORIZATION', 'ATTRIBUTION_NOT_ASSERTED', 'EVIDENCE_PRESERVATION'],
    unproven: ['That the cause was malicious: the record shows an actuation with no authorization record, not who or why.', ...COMMON_UNPROVEN],
  },
  {
    id: 'S3', number: 3, title: 'Unauthorized temperature setpoint change',
    attempted: 'An attacker changes the controller setpoint from −22 °C to +2 °C outside the governed route.',
    events: [{ at: ATTACK_MINUTE, kind: 'BYPASS', label: 'Direct controller write: setpoint +2 °C', apply: (c) => { c.setpointC = 2; } }],
    probeFaults: [], response: 'AUTO',
    capabilities: ['PREVENTION', 'DETECTION', 'NO_FABRICATED_AUTHORIZATION', 'EVIDENCE_PRESERVATION'],
    unproven: ['Detection speed for slower or subtler setpoint drift (e.g. −22 → −19 °C) was not examined.', ...COMMON_UNPROVEN],
  },
  {
    id: 'S4', number: 4, title: 'Compromised controller reporting false temperatures',
    attempted: 'An attacker raises the setpoint to +2 °C and makes the controller report a steady, plausible −21.8 °C.',
    events: [{ at: ATTACK_MINUTE, kind: 'BYPASS', label: 'Direct controller write: setpoint +2 °C and falsified reporting', apply: (c) => { c.setpointC = 2; c.reportMode = 'FALSIFIED'; } }],
    probeFaults: [], response: 'AUTO',
    capabilities: ['DETECTION', 'DETECTION_INDEPENDENT_OF_CONTROLLER_REPORTS', 'EVIDENCE_PRESERVATION'],
    unproven: ['An attacker who also controls the independent probes or their logger was not modelled.', ...COMMON_UNPROVEN],
  },
  {
    id: 'S5', number: 5, title: 'Suppressed controller alarm',
    attempted: 'An attacker raises the setpoint to +2 °C and disables the controller\'s own high-temperature alarm.',
    events: [{ at: ATTACK_MINUTE, kind: 'BYPASS', label: 'Direct controller write: setpoint +2 °C and alarm suppressed', apply: (c) => { c.setpointC = 2; c.alarmSuppressed = true; } }],
    probeFaults: [], response: 'AUTO',
    capabilities: ['DETECTION', 'ALERT_INDEPENDENT_OF_CONTROLLER_ALARM', 'EVIDENCE_PRESERVATION'],
    unproven: ['Whether a real notification path (paging, SMS, staff response) would deliver the independent alert.', ...COMMON_UNPROVEN],
  },
  {
    id: 'S6', number: 6, title: 'Independent sensor failure or unavailable evidence',
    attempted: 'An attacker raises the setpoint to +2 °C while the independent temperature evidence fails: P1 sticks, P2 and the air probe stop reporting.',
    events: [{ at: ATTACK_MINUTE, kind: 'BYPASS', label: 'Direct controller write: setpoint +2 °C', apply: (c) => { c.setpointC = 2; } }],
    probeFaults: [{ sourceId: 'P1', fromMinute: ATTACK_MINUTE - 10, mode: 'STUCK' }, { sourceId: 'P2', fromMinute: ATTACK_MINUTE - 10, mode: 'MISSING' }, { sourceId: 'AIR', fromMinute: ATTACK_MINUTE - 10, mode: 'MISSING' }],
    response: 'AUTO',
    capabilities: ['DETECTION', 'EVIDENCE_GAP_DISCLOSED', 'NO_EXECUTION_WITHOUT_ADMISSIBLE_EVIDENCE', 'EVIDENCE_PRESERVATION'],
    unproven: [
      'In this run the controller\'s own alarm, an untrusted channel, fired while the independent evidence was missing. The simulated architecture does not let untrusted signals authorize correction, so the corrective action was held and the product kept warming. How untrusted signals should feed an emergency path is an open design question, not a demonstrated capability.',
      'Any emergency procedure for acting without admissible evidence. Real sites need one; it is not modelled here.',
      ...COMMON_UNPROVEN,
    ],
  },
  {
    id: 'S7', number: 7, title: 'Expired authorization replay',
    attempted: 'Yesterday\'s genuine but expired defrost authority is replayed through the governed route: first by an unrecognized actor, then by its original holder.',
    events: [
      { at: ATTACK_MINUTE, kind: 'AEA_SUBMIT', actorId: ATTACKER, command: { commandId: 'CMD-S7-REPLAY-ATTACKER', consequence: 'INITIATE_DEFROST', params: { durationMin: 20 } }, grantKey: 'TECH-DEFROST-EXPIRED', authorized: false, label: 'Expired authority replayed by an unrecognized actor' },
      { at: ATTACK_MINUTE + 5, kind: 'AEA_SUBMIT', actorId: 'TECH-01', command: { commandId: 'CMD-S7-REPLAY-HOLDER', consequence: 'INITIATE_DEFROST', params: { durationMin: 20 } }, grantKey: 'TECH-DEFROST-EXPIRED', authorized: false, label: 'Expired authority replayed by its original holder' },
    ],
    probeFaults: [], response: 'NONE',
    capabilities: ['PREVENTION', 'NO_FALSE_ALERT', 'EVIDENCE_PRESERVATION'],
    unproven: ['Theft of a current, unexpired grant together with the holder\'s identity was not modelled.', ...COMMON_UNPROVEN],
  },
  {
    id: 'S8', number: 8, title: 'Authorized recovery with post-intervention verification',
    attempted: 'After a bypassed 6-hour defrost, a routine command is attempted during the open incident; a corrective authority is revoked between commit and execution; a fresh authority restores the baseline; recovery is verified independently.',
    events: [{ at: ATTACK_MINUTE, kind: 'BYPASS', label: 'Direct controller write: defrost for 360 min', apply: (c) => { c.defrostUntilMinute = ATTACK_MINUTE + 360; } }],
    probeFaults: [], response: 'AUTO', revalidationDrill: true, routineCommandDuringIncident: true,
    capabilities: ['ROUTINE_COMMAND_HELD_DURING_INCIDENT', 'RUNTIME_REVALIDATION', 'RECOVERY_AUTHORIZED', 'POST_INTERVENTION_VERIFICATION', 'EVIDENCE_PRESERVATION'],
    unproven: ['Product disposition: TA-14 records the temperature excursion but does not decide food safety.', 'That restoring controller configuration removes an attacker\'s access (assumed here).', ...COMMON_UNPROVEN],
  },
];

type SeriesPoint = { minute: number; t: string; truthAirC: number; truthProductC: number; einAirC: number | null; einProductC: number | null; controllerReportedAirC: number; status: EinStatus; heaterOn: boolean; compressorOn: boolean };

export type ScenarioResult = {
  label: string;
  id: string; number: number; title: string; attempted: string;
  aea: { involved: boolean; submissions: Array<SubmissionResult & { label: string; atMinute: number; executed: boolean; execution: ExecutionResult | null }> };
  ein: { maxStatus: EinStatus; firstDeviationMinute: number | null; firstAlertMinute: number | null; transitions: Array<{ minute: number; from: EinStatus; to: EinStatus; findings: string[] }> };
  eir: { entries: number; byType: Record<string, number>; chainHead: string; verification: VerificationResult; evidenceGaps: number };
  alerts: { ein: Array<{ minute: number; status: EinStatus }>; controllerAlarm: Array<{ minute: number }>; controllerAlarmConditionMetMinute: number | null; controllerAlarmSuppressed: boolean };
  physical: { changed: boolean; truthDeviationMinute: number | null; maxTruthProductC: number; maxTruthAirC: number; truthMinutesProductAboveLimit: number; endTruthProductC: number; endTruthAirC: number };
  response: { triggeredMinute: number | null; steps: Array<{ minute: number; step: string; detail: string }>; restoredMinute: number | null };
  outcome: string;
  claims: Claim[];
  unproven: string[];
  groundTruth: { bypassActions: Array<{ minute: number; label: string }>; note: string };
  series: SeriesPoint[];
  record: IncidentRecord;
};

export async function runScenario(def: ScenarioDefinition): Promise<ScenarioResult> {
  const seed = def.number * 7919;
  const { state: settled, controller } = settledState();
  let state: TruthState = { ...settled, minute: 0 };
  const ein = new EnvironmentalIntegrityNode();
  const eir = new EnvironmentalIntegrityRecorder(def.id);
  const grants = initialGrants();
  const submissions: ScenarioResult['aea']['submissions'] = [];
  const responseSteps: ScenarioResult['response']['steps'] = [];
  const einAlerts: ScenarioResult['alerts']['ein'] = [];
  const controllerAlarms: Array<{ minute: number }> = [];
  const transitions: ScenarioResult['ein']['transitions'] = [];
  const series: SeriesPoint[] = [];
  const bypassActions: Array<{ minute: number; label: string }> = [];
  let alertedSeverity = 0;
  let prevStatus: EinStatus = 'NORMAL';
  let gapOpen: Record<string, boolean> = {};
  let evidenceGaps = 0;
  let reportedAboveSince: number | null = null;
  let trueAboveSince: number | null = null;
  let alarmConditionMet: number | null = null;
  let alarmActive = false;
  let suppressedWhileConditionMet = false;
  let truthAirOutsideSince: number | null = null;
  let truthDeviation: number | null = null;
  let maxP = -Infinity, maxA = -Infinity, minutesAbove = 0;
  let triggered: number | null = null;
  let restored: number | null = null;
  let incidentOpen = false;
  const pending: Array<{ at: number; run: () => void }> = [];

  eir.append(0, 'BASELINE_REFERENCE', { kind: 'RECORDER', id: 'EIR-SIM-01' }, true, { baselineId: BASELINE.baselineId, sealSha256: eir.sealed.sealSha256, note: 'The last authorized baseline is sealed and stored separately from observed reality.' }, null);

  const evidence = () => ein.evidenceStanding(eir.entries.filter((e) => e.type === 'EIN_OBSERVATION').at(-1)?.entryHash ?? 'NO-EVIDENCE');
  const changeNow = (consequence: Command['consequence']): MaterialChange | null => incidentOpen && consequence !== 'RESTORE_AUTHORIZED_BASELINE'
    ? { changeId: `INCIDENT-${def.id}`, detectedAt: minuteToIso(triggered ?? 0), category: 'OPERATIONAL', material: true, description: 'Open incident: independently observed state deviates from the authorized baseline.' }
    : null;

  const submit = (minute: number, actorId: string, command: Command, grantKey: string | null, label: string, executeAfter: number | null) => {
    const held = grantKey ? grants[grantKey] ?? null : null;
    const result = submitCommand({ actorId, command, held, evidence: evidence(), change: changeNow(command.consequence), minute });
    const record: ScenarioResult['aea']['submissions'][number] = { ...result, label, atMinute: minute, executed: false, execution: null };
    submissions.push(record);
    eir.append(minute, 'AEA_COMMAND_SUBMITTED', { kind: 'AEA_GATE', id: 'GCEA' }, true, { commandId: command.commandId, actorId, consequence: command.consequence, params: command.params, authorityId: held?.grant.authorityId ?? null, determination: result.determination, commitPermitted: result.commitPermitted, reasonCodes: result.reasonCodes, gceaCommitReceiptHash: result.gcea.receiptHash, gceaReplayId: result.gcea.replayId });
    if (result.commitPermitted && executeAfter !== null) {
      pending.push({ at: minute + executeAfter, run: () => {
        const exec = executeCommitted({ actorId, command, held: grantKey ? grants[grantKey] ?? null : null, evidence: evidence(), change: changeNow(command.consequence), minute: minute + executeAfter });
        record.execution = exec;
        eir.append(minute + executeAfter, exec.executionPermitted ? 'AEA_COMMAND_EXECUTED' : 'AEA_EXECUTION_REFUSED', { kind: 'AEA_GATE', id: 'GCEA' }, true, { commandId: command.commandId, determination: exec.determination, reasonCodes: exec.reasonCodes, gceaExecutionReceiptHash: exec.gcea.receiptHash, gceaReplayId: exec.gcea.replayId });
        if (exec.executionPermitted) {
          record.executed = true;
          applyAuthorized(command, minute + executeAfter);
        }
      } });
    }
    return record;
  };

  const applyAuthorized = (command: Command, minute: number) => {
    if (command.consequence === 'INITIATE_DEFROST') controller.defrostUntilMinute = minute + (command.params.durationMin ?? 0);
    if (command.consequence === 'CHANGE_SETPOINT') controller.setpointC = command.params.setpointC!;
    if (command.consequence === 'RESTORE_AUTHORIZED_BASELINE') {
      Object.assign(controller, initialController());
      restored = minute;
      incidentOpen = false;
      responseSteps.push({ minute, step: 'CORRECTIVE_ACTION_EXECUTED', detail: 'Controller restored from the sealed authorized configuration (assumes the attacker\'s access was also removed).' });
    }
  };

  const human = (minute: number, type: string, actorId: string, payload: Record<string, unknown>, step: string, detail: string) => {
    eir.append(minute, type, { kind: 'HUMAN', id: actorId }, true, { actorId, ...payload, note: 'Simulated human action.' });
    responseSteps.push({ minute, step, detail });
  };

  const startResponse = (t: number) => {
    triggered = t;
    incidentOpen = true;
    eir.append(t, 'NOTIFICATION_SENT', { kind: 'RECORDER', id: 'EIR-SIM-01' }, true, { recipients: ['TECH-01 (on call)', 'FM-01'], channel: 'simulated notification', einStatus: ein.latest?.status });
    responseSteps.push({ minute: t, step: 'NOTIFICATION', detail: `Independent EIN status ${ein.latest?.status}; on-call technician and facility manager notified (simulated).` });
    pending.push({ at: t + 15, run: () => human(t + 15, 'HUMAN_ACKNOWLEDGED', 'TECH-01', { alertAtMinute: t }, 'ACKNOWLEDGED', 'TECH-01 acknowledges the alert.') });
    pending.push({ at: t + 20, run: () => {
      const executedAea = eir.entries.filter((e) => e.type === 'AEA_COMMAND_EXECUTED');
      const deviationFindings = [...new Set(ein.samples.filter((s) => s.minute >= t - 60).flatMap((s) => s.findings.filter((f) => !f.code.startsWith('EVIDENCE_')).map((f) => f.code)))];
      const findings = [...deviationFindings];
      if (deviationFindings.length && executedAea.length === 0) findings.push('NO_AUTHORIZATION_RECORD_FOR_OBSERVED_STATE_CHANGE');
      if (!deviationFindings.length) findings.push('STATE_CANNOT_BE_ESTABLISHED_FROM_INDEPENDENT_EVIDENCE');
      human(t + 20, 'INVESTIGATION_RECORDED', 'TECH-01', { findings, attribution: 'CAUSE_UNDETERMINED', ledgerCompared: 'AEA execution records versus independently observed actuation and temperatures' }, 'INVESTIGATION', findings.join(', '));
    } });
    pending.push({ at: t + 40, run: () => {
      grants['RESTORE-1'] = { holderActorId: 'TECH-01', issuedBy: 'FM-01', issuedAtMinute: t + 40, grant: grant(`AUTH-RESTORE-${def.id}-1`, 'RESTORE_AUTHORIZED_BASELINE', t + 40, t + 280) };
      human(t + 40, 'AUTHORITY_ISSUED', 'FM-01', { authorityId: grants['RESTORE-1'].grant.authorityId, holder: 'TECH-01', consequence: 'RESTORE_AUTHORIZED_BASELINE', basis: 'Re-authorization after the incident; the prior commissioning authority is not reused.' }, 'REAUTHORIZATION', 'FM-01 issues a fresh, scoped corrective authority to TECH-01.');
    } });
    if (def.routineCommandDuringIncident) {
      pending.push({ at: t + 42, run: () => {
        const r = submit(t + 42, 'TECH-01', { commandId: `CMD-${def.id}-ROUTINE-DEFROST`, consequence: 'INITIATE_DEFROST', params: { durationMin: 20 } }, 'TECH-DEFROST-CURRENT', 'Routine defrost attempted during the open incident (current grant)', 1);
        responseSteps.push({ minute: t + 42, step: 'ROUTINE_COMMAND_DURING_INCIDENT', detail: `Routine defrost with a current grant: ${r.determination} (${r.reasonCodes.join(', ')})` });
      } });
    }
    pending.push({ at: t + 45, run: () => {
      const s = submit(t + 45, 'TECH-01', { commandId: `CMD-${def.id}-RESTORE-1`, consequence: 'RESTORE_AUTHORIZED_BASELINE', params: {} }, 'RESTORE-1', 'Corrective action: restore the authorized baseline', 15);
      responseSteps.push({ minute: t + 45, step: 'CORRECTIVE_COMMAND_SUBMITTED', detail: `${s.determination} (${s.reasonCodes.join(', ')})` });
    } });
    {
      if (def.revalidationDrill) {
        pending.push({ at: t + 50, run: () => {
          grants['RESTORE-1'] = { ...grants['RESTORE-1'], grant: { ...grants['RESTORE-1'].grant, revoked: true } };
          human(t + 50, 'AUTHORITY_REVOKED', 'FM-01', { authorityId: grants['RESTORE-1'].grant.authorityId, reason: 'Revoked between commit and execution (revalidation drill).' }, 'AUTHORITY_REVOKED', 'FM-01 revokes the corrective authority after commit and before execution.');
        } });
        pending.push({ at: t + 70, run: () => {
          grants['RESTORE-2'] = { holderActorId: 'TECH-01', issuedBy: 'FM-01', issuedAtMinute: t + 70, grant: grant(`AUTH-RESTORE-${def.id}-2`, 'RESTORE_AUTHORIZED_BASELINE', t + 70, t + 310) };
          human(t + 70, 'AUTHORITY_ISSUED', 'FM-01', { authorityId: grants['RESTORE-2'].grant.authorityId, holder: 'TECH-01', consequence: 'RESTORE_AUTHORIZED_BASELINE', basis: 'Fresh authority after revocation.' }, 'REAUTHORIZATION', 'FM-01 issues a new corrective authority.');
        } });
        pending.push({ at: t + 75, run: () => {
          const s2 = submit(t + 75, 'TECH-01', { commandId: `CMD-${def.id}-RESTORE-2`, consequence: 'RESTORE_AUTHORIZED_BASELINE', params: {} }, 'RESTORE-2', 'Corrective action (second authority)', 15);
          responseSteps.push({ minute: t + 75, step: 'CORRECTIVE_COMMAND_SUBMITTED', detail: `${s2.determination} (${s2.reasonCodes.join(', ')})` });
        } });
      }
    }
  };

  for (let minute = 0; minute <= DURATION_MIN; minute++) {
    if (minute > 0) state = stepPlant(state, controller);
    for (const ev of def.events.filter((e) => e.at === minute)) {
      if (ev.kind === 'BYPASS') { ev.apply(controller); bypassActions.push({ minute, label: ev.label }); }
      else submit(minute, ev.actorId, ev.command, ev.grantKey, ev.label, 1);
    }
    for (const p of pending.filter((p) => p.at === minute)) p.run();

    // Ground truth (simulation only).
    maxP = Math.max(maxP, state.productC); maxA = Math.max(maxA, state.airC);
    if (state.productC > BASELINE.productLimitC) minutesAbove++;
    const [lo, hi] = BASELINE.approvedAirBandC;
    if ((state.airC < lo || state.airC > hi) && !inAuthorizedDefrostContext(minute)) truthAirOutsideSince ??= minute; else truthAirOutsideSince = null;
    const truthDeviant = state.productC > BASELINE.productLimitC || (truthAirOutsideSince !== null && minute - truthAirOutsideSince >= BASELINE.einThresholds.watchAirOutsideBandMin) || (state.heaterOn && !inAuthorizedDefrostWindow(minute));
    if (truthDeviant && truthDeviation === null) truthDeviation = minute;

    const report = controllerReport(state, controller, seed);
    // Controller's own alarm, from its own (possibly falsified) report.
    if (report.reportedAirC > BASELINE.controllerAlarm.airAboveC) reportedAboveSince ??= minute; else { reportedAboveSince = null; alarmActive = false; }
    if (state.airC > BASELINE.controllerAlarm.airAboveC) trueAboveSince ??= minute; else trueAboveSince = null;
    if (trueAboveSince !== null && minute - trueAboveSince >= BASELINE.controllerAlarm.forMin) alarmConditionMet ??= minute;
    const reportedConditionMet = reportedAboveSince !== null && minute - reportedAboveSince >= BASELINE.controllerAlarm.forMin;
    if (reportedConditionMet && controller.alarmSuppressed) suppressedWhileConditionMet = true;
    if (reportedConditionMet && !controller.alarmSuppressed && !alarmActive) {
      alarmActive = true;
      controllerAlarms.push({ minute });
      eir.append(minute, 'CONTROLLER_ALARM_REPORTED', { kind: 'CONTROLLER_REPORTED', id: BASELINE.equipment.controllerId }, false, { reportedAirC: report.reportedAirC, note: 'Controller self-report: untrusted channel.' });
    }

    if (minute % SAMPLE_EVERY_MIN !== 0) continue;
    const readings = readProbes(state, seed, def.probeFaults);
    const sample: EinSample = ein.observe(minute, readings, report.reportedAirC);
    eir.append(minute, 'CONTROLLER_REPORT', { kind: 'CONTROLLER_REPORTED', id: BASELINE.equipment.controllerId }, false, { reportedAirC: report.reportedAirC, reportedSetpointC: report.reportedSetpointC, note: 'Controller self-report: untrusted channel.' });
    eir.append(minute, 'EIN_OBSERVATION', { kind: 'EIN', id: 'EIN-SIM-01' }, true, { readings, productC: sample.productC, airC: sample.airC, evidenceQuality: sample.evidenceQuality, status: sample.status, findings: sample.findings.map((f) => f.code), attribution: sample.attribution });
    for (const id of ['P1', 'P2', 'AIR'] as const) {
      const bad = sample.findings.some((f) => f.code === `EVIDENCE_MISSING:${id}` || f.code === `EVIDENCE_STUCK:${id}`);
      if (bad && !gapOpen[id]) { gapOpen[id] = true; evidenceGaps++; eir.append(minute, 'EVIDENCE_GAP_OPENED', { kind: 'EIN', id: 'EIN-SIM-01' }, true, { sourceId: id, finding: sample.findings.find((f) => f.code.endsWith(`:${id}`))?.code }); }
      if (!bad && gapOpen[id]) { gapOpen[id] = false; eir.append(minute, 'EVIDENCE_GAP_CLOSED', { kind: 'EIN', id: 'EIN-SIM-01' }, true, { sourceId: id }); }
    }
    if (sample.status !== prevStatus) {
      const codes = sample.findings.map((f) => f.code);
      transitions.push({ minute, from: prevStatus, to: sample.status, findings: codes });
      eir.append(minute, 'EIN_STATUS_CHANGED', { kind: 'EIN', id: 'EIN-SIM-01' }, true, { from: prevStatus, to: sample.status, findings: sample.findings.map((f) => ({ code: f.code, detail: f.detail, possibleCauses: f.possibleCauses ?? null })), attribution: 'CAUSE_UNDETERMINED' });
      if (sample.status === 'NORMAL') alertedSeverity = 0;
      prevStatus = sample.status;
    }
    if (SEVERITY[sample.status] > alertedSeverity) {
      alertedSeverity = SEVERITY[sample.status];
      einAlerts.push({ minute, status: sample.status });
      eir.append(minute, 'EIN_ALERT', { kind: 'EIN', id: 'EIN-SIM-01' }, true, { status: sample.status, level: URGENT.includes(sample.status) ? 'URGENT' : 'ADVISORY', attribution: 'CAUSE_UNDETERMINED' });
    }
    if (def.response === 'AUTO' && triggered === null && URGENT.includes(sample.status)) startResponse(minute);
    const pt = series.length === 0 || minute % 10 === 0;
    if (pt) series.push({ minute, t: minuteToIso(minute), truthAirC: round(state.airC), truthProductC: round(state.productC), einAirC: sample.airC, einProductC: sample.productC, controllerReportedAirC: report.reportedAirC, status: sample.status, heaterOn: state.heaterOn, compressorOn: state.compressorOn });
  }

  // Outcome compared against the sealed baseline, from independent evidence only.
  const after = restored === null ? [] : ein.samples.filter((s) => s.minute >= restored!);
  const backNormal = after.find((s) => s.status === 'NORMAL' && s.findings.length === 0)?.minute ?? null;
  const observedAbove = ein.samples.filter((s) => s.productC !== null && s.productC > BASELINE.productLimitC).length * SAMPLE_EVERY_MIN;
  const maxObservedProduct = Math.max(...ein.samples.map((s) => s.productC ?? -Infinity));
  const end = ein.latest!;
  const outcomePayload = {
    comparedAgainst: BASELINE.baselineId, restoredAtMinute: restored, independentStatusAtEnd: end.status, independentAirAtEndC: end.airC, independentProductAtEndC: end.productC,
    firstNormalAfterRestoreMinute: backNormal, maxIndependentProductC: Number.isFinite(maxObservedProduct) ? maxObservedProduct : null, observedMinutesProductAboveLimit: observedAbove,
    disposition: 'PRODUCT_DISPOSITION_NOT_DETERMINED_BY_TA14', attribution: 'CAUSE_UNDETERMINED',
  };
  eir.append(DURATION_MIN, 'OUTCOME_RECORDED', { kind: 'RECORDER', id: 'EIR-SIM-01' }, true, outcomePayload);

  const record = eir.export();
  const verification = await verifyIncidentRecord(record, sha256);
  const byType: Record<string, number> = {};
  for (const e of record.entries) byType[e.type] = (byType[e.type] ?? 0) + 1;
  const firstDeviationMinute = ein.samples.find((s) => s.findings.some((f) => !f.code.startsWith('EVIDENCE_') && f.status !== 'NORMAL'))?.minute ?? null;
  const maxStatus = ein.samples.reduce<EinStatus>((m, s) => (SEVERITY[s.status] > SEVERITY[m] ? s.status : m), 'NORMAL');

  const result: ScenarioResult = {
    label: SIMULATION_LABEL,
    id: def.id, number: def.number, title: def.title, attempted: def.attempted,
    aea: { involved: submissions.length > 0, submissions },
    ein: { maxStatus, firstDeviationMinute, firstAlertMinute: einAlerts[0]?.minute ?? null, transitions },
    eir: { entries: record.entries.length, byType, chainHead: record.chainHead, verification, evidenceGaps },
    alerts: { ein: einAlerts, controllerAlarm: controllerAlarms, controllerAlarmConditionMetMinute: alarmConditionMet, controllerAlarmSuppressed: suppressedWhileConditionMet },
    physical: { changed: truthDeviation !== null, truthDeviationMinute: truthDeviation, maxTruthProductC: round(maxP), maxTruthAirC: round(maxA), truthMinutesProductAboveLimit: minutesAbove, endTruthProductC: round(state.productC), endTruthAirC: round(state.airC) },
    response: { triggeredMinute: triggered, steps: responseSteps, restoredMinute: restored },
    outcome: '',
    claims: [],
    unproven: def.unproven,
    groundTruth: { bypassActions, note: 'Available only because this is a simulation. Never supplied to the EIN, the EIR or the AEA gate.' },
    series,
    record,
  };
  result.claims = evaluateClaims(def, result);
  result.outcome = describeOutcome(result);
  return result;
}

function evaluateClaims(def: ScenarioDefinition, r: ScenarioResult): Claim[] {
  const entries = r.record.entries;
  const aeaCommandIds = new Set(entries.filter((e) => e.type.startsWith('AEA_')).map((e) => (e.payload as { commandId: string }).commandId));
  const unauthorized = r.aea.submissions.filter((s) => def.events.some((e) => e.kind === 'AEA_SUBMIT' && !e.authorized && e.command.commandId === s.commandId));
  const bypass = r.groundTruth.bypassActions.length > 0;
  const baselineUnchanged = r.record.sealedBaseline.sealSha256 === sealBaseline().sealSha256 && hashObject(r.record.sealedBaseline.baseline) === sealBaseline().sealSha256;
  const corrective = r.aea.submissions.filter((s) => s.commandId.includes('RESTORE'));
  const claims: Record<string, () => Claim> = {
    PREVENTION: () => {
      if (bypass) return { capability: 'PREVENTION', status: 'FAIL', basis: 'The command bypassed the governed route and changed controller behaviour. AEA cannot prevent a command that never reaches it.' };
      const blocked = unauthorized.length > 0 && unauthorized.every((s) => s.determination !== 'ALLOW' && !s.executed);
      return { capability: 'PREVENTION', status: blocked ? 'PASS' : unauthorized.length ? 'FAIL' : 'NOT_DEMONSTRATED', basis: unauthorized.map((s) => `${s.commandId}: ${s.determination} (${s.reasonCodes.join(', ')}); executed=${s.executed}`).join(' · ') || 'No unauthorized submission.' };
    },
    DETECTION: () => {
      if (!r.physical.changed) return { capability: 'DETECTION', status: 'NOT_DEMONSTRATED', basis: 'No physical deviation occurred, so there was nothing to detect.' };
      const detected = r.ein.firstDeviationMinute !== null && r.ein.firstDeviationMinute >= ATTACK_MINUTE;
      return { capability: 'DETECTION', status: detected ? 'PASS' : 'FAIL', basis: detected ? `Ground-truth deviation from minute ${r.physical.truthDeviationMinute}; independent EIN flagged a deviation at minute ${r.ein.firstDeviationMinute} (${r.ein.firstDeviationMinute! - ATTACK_MINUTE} min after the change).` : `Ground truth deviated from minute ${r.physical.truthDeviationMinute} (max product ${r.physical.maxTruthProductC} °C) but the EIN never established a deviation from its evidence.` };
    },
    NO_FALSE_ALERT: () => ({ capability: 'NO_FALSE_ALERT', status: r.alerts.ein.length === 0 ? 'PASS' : 'FAIL', basis: r.alerts.ein.length === 0 ? 'Four authorized defrost cycles ran; the EIN raised no alert.' : `EIN alerts: ${r.alerts.ein.map((a) => `${a.status}@${a.minute}`).join(', ')}` }),
    NO_FABRICATED_AUTHORIZATION: () => {
      const preRestore = entries.filter((e) => e.type === 'AEA_COMMAND_EXECUTED' && !(e.payload as { commandId: string }).commandId.includes('RESTORE'));
      const ok = preRestore.length === 0 && !r.groundTruth.bypassActions.some((b) => aeaCommandIds.has(b.label));
      return { capability: 'NO_FABRICATED_AUTHORIZATION', status: ok ? 'PASS' : 'FAIL', basis: ok ? 'No AEA determination or execution record exists for the bypassed command; the record states the absence instead.' : 'An AEA execution record exists for a non-corrective command.' };
    },
    ATTRIBUTION_NOT_ASSERTED: () => {
      const attributions = new Set(entries.flatMap((e) => { const a = (e.payload as { attribution?: string })?.attribution; return a ? [a] : []; }));
      const ok = attributions.size > 0 && [...attributions].every((a) => a === 'CAUSE_UNDETERMINED');
      return { capability: 'ATTRIBUTION_NOT_ASSERTED', status: ok ? 'PASS' : 'FAIL', basis: `Attributions recorded: ${[...attributions].join(', ') || 'none'}.` };
    },
    DETECTION_INDEPENDENT_OF_CONTROLLER_REPORTS: () => {
      const reports = entries.filter((e) => e.type === 'CONTROLLER_REPORT' && Date.parse(e.recordedAt) >= Date.parse(minuteToIso(ATTACK_MINUTE)) && (r.response.restoredMinute === null || Date.parse(e.recordedAt) < Date.parse(minuteToIso(r.response.restoredMinute))));
      const looksNormal = reports.length > 0 && reports.every((e) => { const v = (e.payload as { reportedAirC: number }).reportedAirC; return v >= BASELINE.approvedAirBandC[0] && v <= BASELINE.approvedAirBandC[1]; });
      const detected = r.ein.firstDeviationMinute !== null;
      return { capability: 'DETECTION_INDEPENDENT_OF_CONTROLLER_REPORTS', status: looksNormal && detected ? 'PASS' : 'FAIL', basis: `Controller reports during the incident all inside the approved band: ${looksNormal}; independent EIN deviation at minute ${r.ein.firstDeviationMinute}.` };
    },
    ALERT_INDEPENDENT_OF_CONTROLLER_ALARM: () => {
      const until = r.response.restoredMinute ?? DURATION_MIN + 1;
      const ctrlWhileSuppressed = r.alerts.controllerAlarm.filter((a) => a.minute < until);
      const einFirst = r.alerts.ein.find((a) => a.minute >= ATTACK_MINUTE);
      const ok = r.alerts.controllerAlarmSuppressed && ctrlWhileSuppressed.length === 0 && !!einFirst && einFirst.minute < until;
      const later = r.alerts.controllerAlarm.filter((a) => a.minute >= until).map((a) => a.minute);
      return { capability: 'ALERT_INDEPENDENT_OF_CONTROLLER_ALARM', status: ok ? 'PASS' : 'FAIL', basis: `While suppressed (until minute ${until}) the controller alarm condition was met: ${r.alerts.controllerAlarmSuppressed}; controller alarms raised: ${ctrlWhileSuppressed.length}; first independent EIN alert at minute ${einFirst?.minute ?? 'none'}.${later.length ? ` The controller alarm fired at minute ${later.join(', ')}, only after the corrective action re-enabled it.` : ''}` };
    },
    EVIDENCE_GAP_DISCLOSED: () => {
      const gaps = r.eir.byType['EVIDENCE_GAP_OPENED'] ?? 0;
      const falseNormal = entries.some((e) => e.type === 'EIN_OBSERVATION' && (e.payload as { evidenceQuality: string; status: string }).evidenceQuality === 'MISSING' && (e.payload as { status: string }).status === 'NORMAL');
      const ok = gaps > 0 && !falseNormal && r.ein.maxStatus !== 'NORMAL';
      return { capability: 'EVIDENCE_GAP_DISCLOSED', status: ok ? 'PASS' : 'FAIL', basis: `${gaps} evidence gaps opened; NORMAL ever claimed without evidence: ${falseNormal}.` };
    },
    NO_EXECUTION_WITHOUT_ADMISSIBLE_EVIDENCE: () => {
      const ok = corrective.length > 0 && corrective.every((s) => !s.executed && s.determination !== 'ALLOW' && s.reasonCodes.some((c) => c === 'ADMISSIBILITY_UNSUPPORTED' || c === 'CONTINUITY_UNSUPPORTED'));
      return { capability: 'NO_EXECUTION_WITHOUT_ADMISSIBLE_EVIDENCE', status: ok ? 'PASS' : corrective.length ? 'FAIL' : 'NOT_DEMONSTRATED', basis: corrective.map((s) => `${s.commandId}: ${s.determination} (${s.reasonCodes.join(', ')})`).join(' · ') || 'No corrective submission.' };
    },
    ROUTINE_COMMAND_HELD_DURING_INCIDENT: () => {
      const routine = r.aea.submissions.find((s) => s.commandId.includes('ROUTINE'));
      const ok = !!routine && routine.determination === 'HOLD' && routine.reasonCodes.includes('MATERIAL_CHANGE_REQUIRES_REAUTHORIZATION') && !routine.executed;
      return { capability: 'ROUTINE_COMMAND_HELD_DURING_INCIDENT', status: ok ? 'PASS' : routine ? 'FAIL' : 'NOT_DEMONSTRATED', basis: routine ? `${routine.commandId} with a current grant: ${routine.determination} (${routine.reasonCodes.join(', ')})` : 'No routine command attempted.' };
    },
    RUNTIME_REVALIDATION: () => {
      const first = corrective.find((s) => s.commandId.endsWith('RESTORE-1'));
      const ok = !!first && first.commitPermitted && !!first.execution && !first.execution.executionPermitted && first.execution.reasonCodes.includes('AUTHORITY_REVOKED');
      return { capability: 'RUNTIME_REVALIDATION', status: ok ? 'PASS' : first ? 'FAIL' : 'NOT_DEMONSTRATED', basis: first ? `Commit permitted: ${first.commitPermitted}; execution after revocation: ${first.execution?.determination} (${first.execution?.reasonCodes.join(', ')})` : 'No corrective submission.' };
    },
    RECOVERY_AUTHORIZED: () => {
      const executed = corrective.find((s) => s.executed);
      return { capability: 'RECOVERY_AUTHORIZED', status: executed && r.response.restoredMinute !== null ? 'PASS' : 'FAIL', basis: executed ? `${executed.commandId} executed under ${executed.execution?.determination} at minute ${r.response.restoredMinute} after revalidation.` : 'No corrective action executed.' };
    },
    POST_INTERVENTION_VERIFICATION: () => {
      const outcome = entries.find((e) => e.type === 'OUTCOME_RECORDED')?.payload as { firstNormalAfterRestoreMinute: number | null; independentStatusAtEnd: string } | undefined;
      const ok = !!outcome && outcome.firstNormalAfterRestoreMinute !== null && outcome.independentStatusAtEnd === 'NORMAL';
      return { capability: 'POST_INTERVENTION_VERIFICATION', status: ok ? 'PASS' : 'FAIL', basis: outcome ? `Independent EIN first NORMAL after restore at minute ${outcome.firstNormalAfterRestoreMinute}; status at end ${outcome.independentStatusAtEnd}.` : 'No outcome record.' };
    },
    EVIDENCE_PRESERVATION: () => {
      const required = r.physical.changed || bypass ? ['EIN_OBSERVATION', 'EIN_STATUS_CHANGED', 'EIN_ALERT', 'OUTCOME_RECORDED'] : ['AEA_COMMAND_SUBMITTED', 'EIN_OBSERVATION', 'OUTCOME_RECORDED'];
      const missing = required.filter((t) => !r.eir.byType[t]);
      const ok = r.eir.verification.valid && baselineUnchanged && missing.length === 0;
      return { capability: 'EVIDENCE_PRESERVATION', status: ok ? 'PASS' : 'FAIL', basis: `Chain valid: ${r.eir.verification.valid} (${r.eir.verification.entriesChecked} entries); sealed baseline unchanged: ${baselineUnchanged}; missing entry types: ${missing.join(', ') || 'none'}.` };
    },
  };
  return def.capabilities.map((c) => claims[c]());
}

function describeOutcome(r: ScenarioResult): string {
  const p = r.physical;
  if (!p.changed) return `No physical deviation. Product stayed at or below ${BASELINE.productLimitC} °C (max ${p.maxTruthProductC} °C).`;
  const restored = r.response.restoredMinute !== null ? `Baseline restored under fresh authority at minute ${r.response.restoredMinute}.` : 'Baseline was NOT restored within the run.';
  return `${restored} Simulated product peaked at ${p.maxTruthProductC} °C and spent ${p.truthMinutesProductAboveLimit} min above ${BASELINE.productLimitC} °C; at the end it was ${p.endTruthProductC} °C. Product disposition is not decided by TA-14.`;
}

export async function runAllScenarios(): Promise<ScenarioResult[]> {
  const out: ScenarioResult[] = [];
  for (const d of SCENARIOS) out.push(await runScenario(d));
  return out;
}
