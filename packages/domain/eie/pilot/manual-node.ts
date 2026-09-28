/**
 * Manual-instrument Node adapter (Phase 2C ruling 5: MANUAL_INSTRUMENT only). A technician's reading
 * from a registered, documented instrument becomes an s04 Node observation. Manual does not mean
 * ungoverned: channel, unit, sign convention, instrument, calibration, location and time are all required,
 * and nothing is converted, defaulted or inferred.
 *
 * Governed pilot vocabulary (ruling 6): exact C1-R7 unit codes; static pressure is signed pressure relative
 * to ambient (negative = below ambient) and the technician must state that the value is so signed.
 * VOLTAGE and CURRENT are not governed for the pilot (their measurement-point vocabulary is deferred).
 */
import { EIE_REASON } from "../reason-codes";
import { parseInstant } from "../time";
import type { Channel, NodeObservation, Submitter } from "../types";
import { calibrationCovering, type InstrumentState } from "./instrument-register";

export const MANUAL_ADAPTER_VERSION = "ta14-eie-manual-node/1.0.0";
export const MANUAL_SOURCE_PROVIDER = "TA14-MANUAL-INSTRUMENT";

/** Channel -> the exact C1-R7 unit code it must be recorded in; signed = static pressure relative to ambient. */
export const GOVERNED_MANUAL_CHANNELS: Readonly<Partial<Record<Channel, { unit: string; signedRelativeToAmbient: boolean }>>> = Object.freeze({
  RETURN_DRY_BULB: { unit: "F", signedRelativeToAmbient: false },
  RETURN_WET_BULB: { unit: "F", signedRelativeToAmbient: false },
  RETURN_RH: { unit: "PCT_RH", signedRelativeToAmbient: false },
  SUPPLY_DRY_BULB: { unit: "F", signedRelativeToAmbient: false },
  SUPPLY_RH: { unit: "PCT_RH", signedRelativeToAmbient: false },
  OUTDOOR_DRY_BULB: { unit: "F", signedRelativeToAmbient: false },
  AIRFLOW: { unit: "CFM", signedRelativeToAmbient: false },
  RETURN_STATIC_PRESSURE: { unit: "IN_WC", signedRelativeToAmbient: true },
  SUPPLY_STATIC_PRESSURE: { unit: "IN_WC", signedRelativeToAmbient: true },
  LIQUID_LINE_TEMPERATURE: { unit: "F", signedRelativeToAmbient: false },
  SUCTION_LINE_TEMPERATURE: { unit: "F", signedRelativeToAmbient: false },
});

export interface ManualReading {
  channel: Channel;
  value: number;
  unit: string;
  /** When the technician read the instrument (zoned ISO 8601). Required; never defaulted. */
  observedAt: string;
  instrumentId: string;
  location: NodeObservation["location"];
  /** Required for static pressure channels: the technician states the value is signed relative to ambient. */
  signConvention?: "SIGNED_RELATIVE_TO_AMBIENT";
}

export interface ManualContext {
  technicianAccountId: string;
  instruments: Readonly<Record<string, InstrumentState>>;
  /** Server receive time. */
  receivedAt: string;
  /** Next contiguous sequence for this (source, channel) stream in the window. */
  sequence: number;
  /** Server-generated unique id. */
  observationId: string;
}

export function manualSubmitter(technicianAccountId: string): Submitter {
  return { role: "NODE", id: `TA14-MANUAL-NODE/${technicianAccountId}` };
}

export function manualObservation(reading: ManualReading, ctx: ManualContext):
  { ok: true; observation: NodeObservation } | { ok: false; reasonCodes: string[] } {
  const codes = new Set<string>();
  const governed = GOVERNED_MANUAL_CHANNELS[reading?.channel];
  if (!governed) return { ok: false, reasonCodes: [EIE_REASON.CHANNEL_NOT_GOVERNED] };
  if (reading.unit !== governed.unit) codes.add(EIE_REASON.UNIT_NOT_GOVERNED);
  if (governed.signedRelativeToAmbient && reading.signConvention !== "SIGNED_RELATIVE_TO_AMBIENT") codes.add(EIE_REASON.SIGN_NOT_DECLARED);
  if (typeof reading.value !== "number" || !Number.isFinite(reading.value)) codes.add(EIE_REASON.VALUE_INVALID);
  if (parseInstant(reading.observedAt) === null) codes.add(EIE_REASON.TIME_UNPARSEABLE);

  const instrument = Object.hasOwn(ctx.instruments, reading.instrumentId) ? ctx.instruments[reading.instrumentId] : undefined;
  const calibration = calibrationCovering(instrument, reading.observedAt);
  if (!instrument) codes.add(EIE_REASON.INSTRUMENT_UNREGISTERED);
  else if (!calibration) codes.add(EIE_REASON.INSTRUMENT_UNFIT);
  if (codes.size > 0 || !instrument || !calibration) return { ok: false, reasonCodes: [...codes].sort() };

  const accuracy = calibration.accuracy && calibration.accuracy.unit === reading.unit
    ? { kind: "ACCURACY" as const, value: calibration.accuracy.value, unit: calibration.accuracy.unit, basisRef: calibration.accuracy.basisRef }
    : null;
  return {
    ok: true,
    observation: {
      observationId: ctx.observationId,
      channel: reading.channel,
      source: { provider: MANUAL_SOURCE_PROVIDER, deviceId: instrument.instrumentId },
      instrument: {
        id: instrument.instrumentId,
        calibrationOrFitnessRef: `${calibration.certificateRef}#sha256:${calibration.certificateSha256}`,
        fitUntil: calibration.fitUntil,
      },
      location: reading.location,
      value: reading.value,
      unit: reading.unit,
      observedAt: reading.observedAt,
      receivedAt: ctx.receivedAt,
      sequence: ctx.sequence,
      acquisitionMethod: "MANUAL_INSTRUMENT",
      accuracyOrUncertainty: accuracy,
      sourceQuality: "TECHNICIAN_READING",
      adapterVersion: MANUAL_ADAPTER_VERSION,
    },
  };
}

/** Next contiguous sequence for a stream, from what the window already admitted (sequence 1 for a new stream). */
export function nextSequence(entries: ReadonlyArray<{ kind: string; observation?: NodeObservation }>, instrumentId: string, channel: Channel): number {
  const seqs = entries
    .filter((e) => e.kind === "OBSERVATION" && e.observation?.source.provider === MANUAL_SOURCE_PROVIDER
      && e.observation.source.deviceId === instrumentId && e.observation.channel === channel)
    .map((e) => e.observation!.sequence);
  return seqs.length === 0 ? 1 : Math.max(...seqs) + 1;
}
