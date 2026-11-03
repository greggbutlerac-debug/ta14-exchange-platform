/*
 * SIMULATION ONLY: Environmental Integrity Node for the simulated freezer.
 *
 * The EIN classifies only what its own independent probes and current clamps report, compared
 * against the sealed authorized baseline. It never reads the plant's true state and never trusts
 * the controller's self-report; it only compares that report with independent readings.
 * It does not attribute causes: every finding is CAUSE_UNDETERMINED with candidate causes listed.
 */
import { BASELINE, inAuthorizedDefrostContext, inAuthorizedDefrostWindow, type AuthorizedBaseline } from './baseline';

export type EinStatus = 'NORMAL' | 'WATCH' | 'EVIDENCE_INSUFFICIENT' | 'EXCEPTION' | 'FAULT';
export const SEVERITY: Record<EinStatus, number> = { NORMAL: 0, WATCH: 1, EVIDENCE_INSUFFICIENT: 2, EXCEPTION: 3, FAULT: 4 };
export type EvidenceQuality = 'COMPLETE' | 'DEGRADED' | 'MISSING';

export type ProbeReadings = { P1: number | null; P2: number | null; AIR: number | null; HEATER_CT: number; COMPRESSOR_CT: number };
export type Finding = { code: string; status: EinStatus; detail: string; possibleCauses?: string[] };
export type EinSample = {
  minute: number;
  readings: ProbeReadings;
  controllerReportedAirC: number;
  productC: number | null;
  airC: number | null;
  evidenceQuality: EvidenceQuality;
  status: EinStatus;
  findings: Finding[];
  attribution: 'CAUSE_UNDETERMINED';
};

const CAUSES_ACTUATION = ['unauthorized command', 'controller malfunction or misconfiguration', 'local manual override', 'wiring or relay fault'];
const CAUSES_TEMPERATURE = ['unauthorized setpoint or configuration change', 'refrigeration fault (compressor, fan, refrigerant)', 'door left open or heavy product loading', 'probe placement or calibration error'];
const CAUSES_REPORT = ['compromised or falsified controller reporting', 'controller sensor fault', 'independent probe fault'];

export class EnvironmentalIntegrityNode {
  private history: EinSample[] = [];
  private stuckRun: Record<'P1' | 'P2' | 'AIR', { value: number | null; count: number }> = { P1: { value: null, count: 0 }, P2: { value: null, count: 0 }, AIR: { value: null, count: 0 } };
  private airOutsideSince: number | null = null;
  private heaterOutsideCount = 0;
  private coolingNotRespondingCount = 0;
  private reportDisagreeCount = 0;

  constructor(private readonly b: AuthorizedBaseline = BASELINE) {}

  observe(minute: number, readings: ProbeReadings, controllerReportedAirC: number): EinSample {
    const t = this.b.einThresholds;
    const findings: Finding[] = [];

    // Evidence quality: missing, stuck, or mutually disagreeing probes.
    const usable: Record<'P1' | 'P2' | 'AIR', number | null> = { P1: null, P2: null, AIR: null };
    for (const id of ['P1', 'P2', 'AIR'] as const) {
      const v = readings[id];
      const run = this.stuckRun[id];
      if (v === null) { run.value = null; run.count = 0; findings.push({ code: `EVIDENCE_MISSING:${id}`, status: 'NORMAL', detail: `${id} returned no reading` }); continue; }
      run.count = run.value === v ? run.count + 1 : 1;
      run.value = v;
      if (run.count >= t.stuckSamples) findings.push({ code: `EVIDENCE_STUCK:${id}`, status: 'NORMAL', detail: `${id} reported an identical value for ${run.count} consecutive samples` });
      else usable[id] = v;
    }
    let productC: number | null = null;
    if (usable.P1 !== null && usable.P2 !== null) {
      if (Math.abs(usable.P1 - usable.P2) > t.probeDisagreementK) findings.push({ code: 'EVIDENCE_PRODUCT_PROBES_DISAGREE', status: 'NORMAL', detail: `P1 ${usable.P1} vs P2 ${usable.P2}` });
      else productC = round((usable.P1 + usable.P2) / 2);
    } else productC = usable.P1 ?? usable.P2;
    const airC = usable.AIR;
    const allFive = usable.P1 !== null && usable.P2 !== null && airC !== null;
    const evidenceQuality: EvidenceQuality = productC === null || airC === null ? 'MISSING' : allFive ? 'COMPLETE' : 'DEGRADED';
    if (evidenceQuality === 'MISSING') findings.push({ code: 'EVIDENCE_INSUFFICIENT_TO_CONFIRM_STATE', status: 'EVIDENCE_INSUFFICIENT', detail: `${productC === null ? 'product' : 'air'} temperature cannot be established from independent probes` });

    // Physical deviation from the authorized baseline.
    if (productC !== null && productC > this.b.productExceptionC) findings.push({ code: 'PRODUCT_TEMPERATURE_EXCEPTION', status: 'EXCEPTION', detail: `product ${productC} °C above configured exception ${this.b.productExceptionC} °C`, possibleCauses: CAUSES_TEMPERATURE });
    else if (productC !== null && productC > this.b.productLimitC) findings.push({ code: 'PRODUCT_TEMPERATURE_ABOVE_LIMIT', status: 'WATCH', detail: `product ${productC} °C above configured limit ${this.b.productLimitC} °C`, possibleCauses: CAUSES_TEMPERATURE });
    const [lo, hi] = this.b.approvedAirBandC;
    const expectedExcursion = inAuthorizedDefrostContext(minute, this.b);
    if (airC !== null && (airC < lo || airC > hi) && !expectedExcursion) {
      this.airOutsideSince ??= minute;
      if (minute - this.airOutsideSince >= t.watchAirOutsideBandMin) findings.push({ code: 'AIR_OUTSIDE_AUTHORIZED_BAND', status: 'WATCH', detail: `air ${airC} °C outside [${lo}, ${hi}] °C for ${minute - this.airOutsideSince} min outside any authorized defrost`, possibleCauses: CAUSES_TEMPERATURE });
    } else this.airOutsideSince = null;

    // Actuation compared against the authorized baseline (independent current clamps).
    const heaterOn = readings.HEATER_CT > t.heaterOnAmps;
    this.heaterOutsideCount = heaterOn && !inAuthorizedDefrostWindow(minute, this.b) ? this.heaterOutsideCount + 1 : 0;
    if (this.heaterOutsideCount >= 2) findings.push({ code: 'DEFROST_HEATER_OUTSIDE_AUTHORIZED_WINDOW', status: 'FAULT', detail: `defrost heater drawing ${readings.HEATER_CT} A outside every authorized defrost window`, possibleCauses: CAUSES_ACTUATION });
    const compressorOn = readings.COMPRESSOR_CT > t.compressorOnAmps;
    this.coolingNotRespondingCount = airC !== null && airC > hi + 2 && !compressorOn && !heaterOn && !expectedExcursion ? this.coolingNotRespondingCount + 1 : 0;
    if (this.coolingNotRespondingCount >= 3) findings.push({ code: 'COOLING_NOT_RESPONDING', status: 'FAULT', detail: `air ${airC} °C above band while the compressor draws no current`, possibleCauses: [...CAUSES_ACTUATION, 'compressor or contactor failure'] });

    // Controller self-report compared against the independent air probe.
    this.reportDisagreeCount = airC !== null && Math.abs(controllerReportedAirC - airC) > t.reportDisagreementK ? this.reportDisagreeCount + 1 : 0;
    if (this.reportDisagreeCount >= t.reportDisagreementSamples) findings.push({ code: 'CONTROLLER_REPORT_DISAGREES_WITH_INDEPENDENT_EVIDENCE', status: 'FAULT', detail: `controller reports ${controllerReportedAirC} °C; independent air probe reads ${airC} °C`, possibleCauses: CAUSES_REPORT });

    const status = findings.reduce<EinStatus>((s, f) => (SEVERITY[f.status] > SEVERITY[s] ? f.status : s), 'NORMAL');
    const sample: EinSample = { minute, readings, controllerReportedAirC, productC, airC, evidenceQuality, status, findings, attribution: 'CAUSE_UNDETERMINED' };
    this.history.push(sample);
    return sample;
  }

  get samples(): readonly EinSample[] { return this.history; }
  get latest(): EinSample | undefined { return this.history.at(-1); }

  /** Evidence standing handed to the AEA gate. Admissible only when the EIN can establish state. */
  evidenceStanding(evidenceId: string) {
    const l = this.latest;
    const continuitySupported = !!l && l.evidenceQuality !== 'MISSING';
    const admissibilitySupported = continuitySupported && l!.status !== 'EVIDENCE_INSUFFICIENT';
    return { continuitySupported, admissibilitySupported, evidenceId };
  }
}

function round(v: number) { return Math.round(v * 100) / 100; }
