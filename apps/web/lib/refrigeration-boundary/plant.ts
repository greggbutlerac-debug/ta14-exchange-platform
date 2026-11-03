/*
 * SIMULATION ONLY: an illustrative, unvalidated lumped thermal model of a display freezer and its
 * controller. It is deterministic: fixed time step, seeded noise, no wall clock.
 *
 * Two nodes: cabinet air (Ta) and product (Tp).
 *   cooling (compressor on): dTa/dt = (T_evap - Ta) / tau_cool
 *   idle (compressor off):   dTa/dt = (T_room - Ta) / tau_leak
 *   defrost (heater on):     dTa/dt = (T_defrost - Ta) / tau_defrost, compressor off
 *   product:                 dTp/dt = (Ta - Tp) / tau_product
 * The parameters are plausible orders of magnitude chosen for teaching, not measured from any
 * equipment.
 */
import { BASELINE, inAuthorizedDefrostWindow, authorizedDefrostStarts, type AuthorizedBaseline } from './baseline';

export const MODEL = {
  roomC: 24, evapC: -32, defrostTargetC: 15,
  tauCoolMin: 25, tauLeakMin: 240, tauDefrostMin: 40, tauProductMin: 300,
  heaterAmps: 8, compressorAmps: 6, idleAmps: 0.08,
  basis: 'Illustrative lumped two-node model; parameters chosen for teaching, not measured.',
} as const;

export type ControllerConfig = {
  setpointC: number;
  differentialK: number;
  scheduledDefrost: boolean;
  defrostUntilMinute: number | null;
  alarmSuppressed: boolean;
  /** TRUE: report its own sensor. FALSIFIED: report a fixed plausible value (compromised controller). */
  reportMode: 'TRUE' | 'FALSIFIED';
};

export type TruthState = { minute: number; airC: number; productC: number; compressorOn: boolean; heaterOn: boolean };

export function initialController(b: AuthorizedBaseline = BASELINE): ControllerConfig {
  return { setpointC: b.setpointC, differentialK: b.differentialK, scheduledDefrost: true, defrostUntilMinute: null, alarmSuppressed: false, reportMode: 'TRUE' };
}

/** Deterministic noise in [-amp, amp] from a hash of (seed, channel, minute). */
export function noise(seed: number, channel: string, minute: number, amp: number): number {
  let h = 2166136261 ^ seed;
  for (const c of `${channel}:${minute}`) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return ((h >>> 0) / 0xffffffff * 2 - 1) * amp;
}

/** Advances the plant one minute under the controller's current configuration. */
export function stepPlant(s: TruthState, c: ControllerConfig, b: AuthorizedBaseline = BASELINE): TruthState {
  const minute = s.minute + 1;
  const day = ((minute % 1440) + 1440) % 1440;
  const scheduledStart = c.scheduledDefrost && authorizedDefrostStarts(b).includes(day);
  if (scheduledStart && c.defrostUntilMinute === null) c.defrostUntilMinute = minute + b.defrost.durationMin;
  const heaterOn = c.defrostUntilMinute !== null && minute < c.defrostUntilMinute;
  if (c.defrostUntilMinute !== null && minute >= c.defrostUntilMinute) c.defrostUntilMinute = null;
  let compressorOn = s.compressorOn;
  if (heaterOn) compressorOn = false;
  else if (s.airC > c.setpointC + c.differentialK / 2) compressorOn = true;
  else if (s.airC < c.setpointC - c.differentialK / 2) compressorOn = false;
  const target = heaterOn ? MODEL.defrostTargetC : compressorOn ? MODEL.evapC : MODEL.roomC;
  const tau = heaterOn ? MODEL.tauDefrostMin : compressorOn ? MODEL.tauCoolMin : MODEL.tauLeakMin;
  const airC = s.airC + (target - s.airC) * (1 - Math.exp(-1 / tau));
  const productC = s.productC + (s.airC - s.productC) * (1 - Math.exp(-1 / MODEL.tauProductMin));
  return { minute, airC, productC, compressorOn, heaterOn };
}

/** What the controller reports about itself. Untrusted once the controller may be compromised. */
export function controllerReport(s: TruthState, c: ControllerConfig, seed: number) {
  const reportedAirC = c.reportMode === 'TRUE' ? s.airC + noise(seed, 'CTRL', s.minute, 0.2) : -21.8 + noise(seed, 'CTRL-FAKE', s.minute, 0.3);
  return { reportedAirC: round(reportedAirC), reportedSetpointC: c.reportMode === 'TRUE' ? c.setpointC : BASELINE.setpointC, reportMode: c.reportMode };
}

export type ProbeFault = { sourceId: 'P1' | 'P2' | 'AIR'; fromMinute: number; mode: 'MISSING' | 'STUCK' };

/** Independent probe readings: true state plus deterministic noise, unless a probe has failed. */
export function readProbes(s: TruthState, seed: number, faults: ProbeFault[]) {
  const fault = (id: ProbeFault['sourceId']) => faults.find((f) => f.sourceId === id && s.minute >= f.fromMinute);
  const temp = (id: 'P1' | 'P2' | 'AIR', truth: number, stuckValue: number) => {
    const f = fault(id);
    if (f?.mode === 'MISSING') return null;
    if (f?.mode === 'STUCK') return stuckValue;
    return round(truth + noise(seed, id, s.minute, 0.15));
  };
  return {
    P1: temp('P1', s.productC, -21.3),
    P2: temp('P2', s.productC + 0.2, -21.1),
    AIR: temp('AIR', s.airC, -22.0),
    HEATER_CT: round((s.heaterOn ? MODEL.heaterAmps : MODEL.idleAmps) + noise(seed, 'HCT', s.minute, 0.05)),
    COMPRESSOR_CT: round((s.compressorOn ? MODEL.compressorAmps : MODEL.idleAmps) + noise(seed, 'CCT', s.minute, 0.05)),
  };
}

export function round(v: number, places = 2) { const f = 10 ** places; return Math.round(v * f) / f; }

/** Steady-state start: run the authorized baseline for a day so scenarios begin from equilibrium. */
export function settledState(b: AuthorizedBaseline = BASELINE): { state: TruthState; controller: ControllerConfig } {
  const controller = initialController(b);
  let state: TruthState = { minute: -1440, airC: b.setpointC, productC: b.setpointC, compressorOn: false, heaterOn: false };
  while (state.minute < 0) state = stepPlant(state, controller, b);
  return { state, controller };
}

export { inAuthorizedDefrostWindow };
