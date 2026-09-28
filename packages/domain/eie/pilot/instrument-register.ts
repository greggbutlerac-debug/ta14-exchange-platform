/**
 * Pilot instrument register (Phase 3). Append-only. Calibration records are DOCUMENTED (certificate
 * reference plus the SHA-256 of the certificate document) and never VERIFIED here. The register supplies
 * the Node contract's instrument identity, calibration/fitness reference and fit-until instant for manual
 * readings; C1-R7's declared instrument list remains a separate declaration.
 */
import { deepFreeze } from "../chain";
import { EIE_REASON } from "../reason-codes";
import { parseInstant } from "../time";

export const INSTRUMENT_KINDS = ["TEMPERATURE", "HUMIDITY", "AIR_PRESSURE", "AIRFLOW"] as const;

export interface RegisterActor { accountId: string }

export type InstrumentEvent =
  | { type: "INSTRUMENT_REGISTERED"; instrumentId: string; kind: (typeof INSTRUMENT_KINDS)[number]; manufacturer: string; model: string; serial: string; by: RegisterActor; at: string }
  | {
    type: "CALIBRATION_DOCUMENTED"; instrumentId: string; calibrationId: string; certificateRef: string; certificateSha256: string; issuer: string;
    calibratedAt: string; fitUntil: string; accuracy: { value: number; unit: string; basisRef: string } | null; by: RegisterActor; at: string;
  };

export interface CalibrationState {
  calibrationId: string;
  certificateRef: string;
  certificateSha256: string;
  issuer: string;
  calibratedAt: string;
  fitUntil: string;
  accuracy: { value: number; unit: string; basisRef: string } | null;
  status: "DOCUMENTED";
}

export interface InstrumentState {
  instrumentId: string;
  kind: (typeof INSTRUMENT_KINDS)[number];
  manufacturer: string;
  model: string;
  serial: string;
  calibrations: CalibrationState[];
}

const nonEmpty = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

export function instrumentEventRefusal(existing: readonly InstrumentEvent[], event: InstrumentEvent): string[] {
  const refuse = [EIE_REASON.INSTRUMENT_UNREGISTERED];
  if (!event || !nonEmpty(event.instrumentId) || !event.by || !nonEmpty(event.by.accountId) || parseInstant(event.at) === null) return refuse;
  const registered = existing.some((e) => e.type === "INSTRUMENT_REGISTERED" && e.instrumentId === event.instrumentId);
  if (event.type === "INSTRUMENT_REGISTERED") {
    return registered || !(INSTRUMENT_KINDS as readonly string[]).includes(event.kind) || !nonEmpty(event.manufacturer) || !nonEmpty(event.model) || !nonEmpty(event.serial) ? refuse : [];
  }
  if (event.type === "CALIBRATION_DOCUMENTED") {
    const from = parseInstant(event.calibratedAt);
    const until = parseInstant(event.fitUntil);
    const accuracyOk = event.accuracy === null
      || (Number.isFinite(event.accuracy.value) && event.accuracy.value >= 0 && nonEmpty(event.accuracy.unit) && nonEmpty(event.accuracy.basisRef));
    return !registered || !nonEmpty(event.calibrationId) || !nonEmpty(event.certificateRef) || !/^[0-9a-f]{64}$/.test(event.certificateSha256)
      || !nonEmpty(event.issuer) || from === null || until === null || until <= from || !accuracyOk
      || existing.some((e) => e.type === "CALIBRATION_DOCUMENTED" && e.calibrationId === event.calibrationId) ? refuse : [];
  }
  return refuse;
}

export function deriveInstruments(events: readonly InstrumentEvent[]): Readonly<Record<string, InstrumentState>> {
  const out: Record<string, InstrumentState> = {};
  for (const e of events) {
    if (e.type === "INSTRUMENT_REGISTERED") {
      out[e.instrumentId] = { instrumentId: e.instrumentId, kind: e.kind, manufacturer: e.manufacturer, model: e.model, serial: e.serial, calibrations: [] };
    } else if (Object.hasOwn(out, e.instrumentId)) {
      out[e.instrumentId].calibrations.push({
        calibrationId: e.calibrationId, certificateRef: e.certificateRef, certificateSha256: e.certificateSha256, issuer: e.issuer,
        calibratedAt: e.calibratedAt, fitUntil: e.fitUntil, accuracy: e.accuracy, status: "DOCUMENTED",
      });
    }
  }
  return deepFreeze(out);
}

/** The documented calibration covering an instant, if exactly one does. Overlapping records are ambiguous and cover nothing. */
export function calibrationCovering(instrument: InstrumentState | undefined, observedAt: string): CalibrationState | undefined {
  const at = parseInstant(observedAt);
  if (!instrument || at === null) return undefined;
  const covering = instrument.calibrations.filter((c) => parseInstant(c.calibratedAt)! <= at && at <= parseInstant(c.fitUntil)!);
  return covering.length === 1 ? covering[0] : undefined;
}
