/*
 * Refrigeration Consequence Boundary: SIMULATION ONLY.
 *
 * The authorized operating baseline for one simulated display freezer. Every value is
 * illustrative. Thresholds are configured for this demonstration, not taken from any food-safety
 * plan: -18 °C (0 °F) is a commonly cited frozen-storage temperature, but a real site's limits
 * come from its own food-safety plan and equipment documentation.
 */
import { createHash } from 'node:crypto';
import { canonical } from './canonical';

export const SIMULATION_LABEL = 'SIMULATION — NOT PHYSICAL-SYSTEM VALIDATION';
export const SIM_EPOCH = '2026-07-01T00:00:00.000Z';
export const STEP_MIN = 1;
export const SAMPLE_EVERY_MIN = 5;

export type ActorRole = 'FACILITY_MANAGER' | 'REFRIGERATION_TECHNICIAN';
export type Actor = { actorId: string; role: ActorRole; standing: 'CURRENT' | 'REVOKED' | 'EXPIRED' };
export type EvidenceSourceId = 'P1' | 'P2' | 'AIR' | 'HEATER_CT' | 'COMPRESSOR_CT';
export type EvidenceSource = { sourceId: EvidenceSourceId; kind: string; unit: string; independentOfController: true; logger: string };

export type AuthorizedBaseline = {
  baselineId: string;
  version: string;
  label: string;
  equipment: { assetId: string; description: string; product: string; controllerId: string; commandRoute: string };
  setpointC: number;
  differentialK: number;
  approvedAirBandC: [number, number];
  productLimitC: number;
  productExceptionC: number;
  defrost: { startsAt: string[]; durationMin: number; maxDurationMin: number; recoveryMin: number };
  operatingLimits: { setpointRangeC: [number, number]; maxDefrostMin: number };
  einThresholds: { watchAirOutsideBandMin: number; heaterOnAmps: number; compressorOnAmps: number; reportDisagreementK: number; reportDisagreementSamples: number; probeDisagreementK: number; stuckSamples: number; maxSampleAgeMin: number };
  controllerAlarm: { airAboveC: number; forMin: number };
  actors: Actor[];
  evidenceSources: EvidenceSource[];
  thresholdBasis: string;
};

export const BASELINE: AuthorizedBaseline = {
  baselineId: 'RCB-BL-1.0',
  version: '1.0',
  label: SIMULATION_LABEL,
  equipment: {
    assetId: 'RCB-FREEZER-01',
    description: 'Simulated reach-in display freezer',
    product: 'Simulated packaged ice cream',
    controllerId: 'CTRL-SIM-01',
    commandRoute: 'controller-command-route',
  },
  setpointC: -22,
  differentialK: 2,
  approvedAirBandC: [-25, -19],
  productLimitC: -18,
  productExceptionC: -15,
  defrost: { startsAt: ['02:00', '08:00', '14:00', '20:00'], durationMin: 20, maxDurationMin: 30, recoveryMin: 40 },
  operatingLimits: { setpointRangeC: [-25, -18], maxDefrostMin: 30 },
  einThresholds: { watchAirOutsideBandMin: 10, heaterOnAmps: 1, compressorOnAmps: 1, reportDisagreementK: 3, reportDisagreementSamples: 3, probeDisagreementK: 2, stuckSamples: 6, maxSampleAgeMin: 10 },
  controllerAlarm: { airAboveC: -12, forMin: 30 },
  actors: [
    { actorId: 'FM-01', role: 'FACILITY_MANAGER', standing: 'CURRENT' },
    { actorId: 'TECH-01', role: 'REFRIGERATION_TECHNICIAN', standing: 'CURRENT' },
  ],
  evidenceSources: [
    { sourceId: 'P1', kind: 'product-simulant probe (glycol bottle)', unit: 'degC', independentOfController: true, logger: 'EIN-LOGGER-A' },
    { sourceId: 'P2', kind: 'product-simulant probe (glycol bottle)', unit: 'degC', independentOfController: true, logger: 'EIN-LOGGER-B' },
    { sourceId: 'AIR', kind: 'cabinet air probe', unit: 'degC', independentOfController: true, logger: 'EIN-LOGGER-A' },
    { sourceId: 'HEATER_CT', kind: 'defrost heater current clamp', unit: 'A', independentOfController: true, logger: 'EIN-LOGGER-B' },
    { sourceId: 'COMPRESSOR_CT', kind: 'compressor current clamp', unit: 'A', independentOfController: true, logger: 'EIN-LOGGER-B' },
  ],
  thresholdBasis: 'Configured for this simulation. -18 °C is a commonly cited frozen-storage temperature; site limits must come from the operator\'s food-safety plan and equipment documentation.',
};

export { canonical };
export const sha256 = (text: string) => createHash('sha256').update(text).digest('hex');
export const hashObject = (value: unknown) => sha256(canonical(value));

export const minuteToIso = (minute: number) => new Date(Date.parse(SIM_EPOCH) + minute * 60_000).toISOString();

/** Minutes since midnight at which each authorized defrost starts. */
export function authorizedDefrostStarts(b: AuthorizedBaseline = BASELINE): number[] {
  return b.defrost.startsAt.map((t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; });
}

/** True when the minute falls inside an authorized defrost or its recovery allowance. */
export function inAuthorizedDefrostContext(minute: number, b: AuthorizedBaseline = BASELINE): boolean {
  const day = ((minute % 1440) + 1440) % 1440;
  return authorizedDefrostStarts(b).some((s) => day >= s && day < s + b.defrost.durationMin + b.defrost.recoveryMin);
}
export function inAuthorizedDefrostWindow(minute: number, b: AuthorizedBaseline = BASELINE): boolean {
  const day = ((minute % 1440) + 1440) % 1440;
  return authorizedDefrostStarts(b).some((s) => day >= s && day < s + b.defrost.maxDurationMin);
}

/** The sealed baseline, stored separately from the incident record. */
export function sealBaseline(b: AuthorizedBaseline = BASELINE) {
  return { baseline: b, sealedAt: SIM_EPOCH, sealSha256: hashObject(b) };
}
