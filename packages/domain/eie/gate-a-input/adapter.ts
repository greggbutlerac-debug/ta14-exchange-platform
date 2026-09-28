/**
 * TA-14-EIE-ARCH-1.0 s09: SEALED RECORDER EVIDENCE -> C1-R7 GATE A INPUT ADAPTER (Phase 2B).
 *
 * A translation and provenance boundary. Not a gate, not an Analyzer, not an authority engine,
 * not an inference or completion engine. It packages admitted Node readings from sealed, verified,
 * INTACT baseline windows of one asset as C1-R7 Measurements, preserving lineage for each, and
 * leaves every derivation and every determination to C1-R7.
 *
 * - Only raw observed values are mapped: no interpolation, extrapolation, estimation, defaulting,
 *   unit conversion or aliasing. Units, accuracy, instrument registration, calibration, location
 *   authority and the qualifying time window are evaluated by C1-R7 under its own reason codes.
 * - C1-R7 takes one point Measurement per key. A continuous series is not consumed (s09: that needs a
 *   separately frozen amendment, e.g. C1-R8), so more than one admitted reading for a key fails closed.
 *   Repeated stability readings are not mapped: the stability variable is named by the OEM record the
 *   server resolves at evaluation, which this adapter cannot see.
 * - Identity, OEM authority, technician qualification, execution authority, work scope, site permission,
 *   jurisdiction and every other non-evidence input come only from the separately governed declared
 *   input, which the NIRET server trust boundary then replaces or verifies. Nothing is inferred from
 *   environmental evidence, and a declared input may not carry measurements.
 * - No dependency on the Analyzer or CRR-1.
 */
import { canonicalJson } from "../../canonical-json";
import type { Measurement, MeasurementKey } from "../../niret/types";
import { objectHash } from "../chain";
import { EIE_REASON } from "../reason-codes";
import type { RecorderKeyResolver } from "../signer";
import { EIE_ARCHITECTURE_FINGERPRINT } from "../spec-guard";
import type { Channel, EvidenceWindow, NodeObservation, ObservationRecord, RecorderMode } from "../types";
import { verifyWindow } from "../verify";

export const GATE_A_INPUT_ADAPTER_VERSION = "EIE-S09-GATE-A-INPUT-ADAPTER-1.0.0";

/**
 * Node channel -> C1-R7 MeasurementKey, where the two contracts name the same quantity at the same
 * point. VOLTAGE and CURRENT are not mapped: C1-R7 distinguishes supplyVoltage, compressorCurrent and
 * blowerCurrent, and the Node channel does not say which one was measured.
 */
export const CHANNEL_TO_MEASUREMENT_KEY: Readonly<Partial<Record<Channel, MeasurementKey>>> = Object.freeze({
  RETURN_DRY_BULB: "returnDryBulb",
  RETURN_WET_BULB: "returnWetBulb",
  RETURN_RH: "returnRh",
  SUPPLY_DRY_BULB: "supplyDryBulb",
  SUPPLY_RH: "supplyRh",
  OUTDOOR_DRY_BULB: "outdoorDryBulb",
  AIRFLOW: "airflow",
  RETURN_STATIC_PRESSURE: "returnStatic",
  SUPPLY_STATIC_PRESSURE: "supplyStatic",
  LIQUID_LINE_TEMPERATURE: "liquidLineTemp",
  SUCTION_LINE_TEMPERATURE: "suctionLineTemp",
});

/** EvidenceRecord fields that come only from the separately governed declared input. */
const DECLARED_EVIDENCE_FIELDS = new Set([
  "recordId", "pressureSideEntry", "submittedBy", "authorityEstablishment", "equipment", "mode", "metering", "refrigerant",
  "technician", "authorization", "safety", "instruments", "plannedPressureInstruments", "operation", "events", "corrections",
  "evaporator", "condenser", "airflowMethod", "observations",
]);
/** Recorder evidence only: never accepted from the declared input. */
const RECORDER_EVIDENCE_FIELDS = new Set(["measurements", "stabilityReadings"]);
const DECLARED_TOP_LEVEL = new Set(["request", "evidence", "oem"]);

export interface GateAInputRequest {
  /** Sealed BASELINE_NONINVASIVE windows supplying the evidence. */
  evidenceWindowIds: string[];
  /** The separately governed, non-evidence portion of the C1-R7 input (request, declared evidence fields, oem). */
  declared: unknown;
}

export interface AdapterContext {
  mode: RecorderMode;
  assetId: string;
  /** The requested evidence windows as preserved by the Recorder, aligned with evidenceWindowIds. */
  evidenceWindows: ReadonlyArray<EvidenceWindow | undefined>;
  /** Every preserved window of the asset (for corrections that postdate the evidence). */
  assetWindows: readonly EvidenceWindow[];
  resolveRecorderKey: RecorderKeyResolver;
}

export interface MeasurementLineage {
  measurementKey: MeasurementKey;
  measurementHash: string;
  channel: Channel;
  windowId: string;
  sealHash: string;
  windowSeq: number;
  entryHash: string;
  recordedAt: string;
  submittedBy: { role: string; id: string } | null;
  observationId: string;
  observationHash: string;
  value: number;
  unit: string;
  observedAt: string;
  receivedAt: string;
  sequence: number;
  acquisitionMethod: NodeObservation["acquisitionMethod"];
  source: NodeObservation["source"];
  instrument: NodeObservation["instrument"];
  location: NodeObservation["location"];
  accuracyOrUncertainty: NodeObservation["accuracyOrUncertainty"];
  adapterVersion: string;
  /** Which C1-R7 Measurement fields were populated from this observation. */
  mapped: { accuracy: boolean; methodId: boolean };
}

export interface GateAInputManifest {
  contract: "TA-14-EIE-ARCH-1.0/s09";
  architectureFingerprint: string;
  adapterVersion: string;
  evidenceMode: "SIMULATION" | "PRODUCTION";
  assetId: string;
  evidenceWindows: Array<{ windowId: string; headerHash: string; sealHash: string; purpose: string; continuityStatus: string; recorderMode: RecorderMode; openedAt: string; closedAt: string }>;
  measurements: MeasurementLineage[];
  /** Admitted observations present in the evidence that have no C1-R7 measurement key: disclosed, never silently dropped. */
  unmappedEvidence: Array<{ windowId: string; entryHash: string; channel: Channel; reason: "NO_C1_R7_MEASUREMENT_KEY" }>;
  stabilityReadings: "NOT_MAPPED";
  declaredInputHash: string;
  inputHash: string;
}

export type AdapterResult =
  | { ok: true; input: Record<string, unknown>; manifest: GateAInputManifest }
  | { ok: false; reasonCodes: string[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function provenanceOf(o: NodeObservation): Measurement["provenance"] {
  if (o.acquisitionMethod === "MANUAL_INSTRUMENT") return "MANUAL";
  if (o.acquisitionMethod === "LIVE_ADAPTER") return `INSTRUMENT:${o.source.provider}/${o.source.deviceId}`;
  return `INSTRUMENT:SIMULATED/${o.source.provider}/${o.source.deviceId}`;
}

/** Packages one admitted observation as a C1-R7 Measurement, from its own fields only. */
function measurementOf(o: NodeObservation): Record<string, unknown> {
  const m: Record<string, unknown> = {
    value: o.value,
    unit: o.unit,
    measuredAt: o.observedAt,
    location: o.location.physical,
    instrumentId: o.instrument.id,
    provenance: provenanceOf(o),
  };
  const stated = o.accuracyOrUncertainty;
  if (stated && stated.kind === "ACCURACY" && stated.unit === o.unit) m.accuracy = stated.value;
  if (o.location.basis.kind === "GOVERNED_METHOD") m.methodId = o.location.basis.ref;
  return m;
}

export function buildGateAInput(request: GateAInputRequest, ctx: AdapterContext): AdapterResult {
  const codes = new Set<string>();
  const ids = isRecord(request) && Array.isArray(request.evidenceWindowIds) ? request.evidenceWindowIds : null;
  if (!ids || ids.length === 0 || new Set(ids).size !== ids.length || ids.length !== ctx.evidenceWindows.length) {
    return { ok: false, reasonCodes: [EIE_REASON.REQUEST_INVALID] };
  }

  // ── Declared input: separately governed; never a source of measurements ──
  let declared: Record<string, unknown> | null = null;
  try {
    declared = JSON.parse(canonicalJson(request.declared)) as Record<string, unknown>;
  } catch {
    declared = null;
  }
  if (!isRecord(declared) || Object.keys(declared).some((k) => !DECLARED_TOP_LEVEL.has(k)) || !isRecord(declared.evidence)) {
    codes.add(EIE_REASON.REQUEST_INVALID);
  } else {
    for (const key of Object.keys(declared.evidence)) {
      if (RECORDER_EVIDENCE_FIELDS.has(key)) codes.add(EIE_REASON.DECLARED_EVIDENCE_SUBSTITUTION);
      else if (!DECLARED_EVIDENCE_FIELDS.has(key)) codes.add(EIE_REASON.REQUEST_INVALID);
    }
  }

  // ── Evidence windows: sealed, verified, INTACT BASELINE_NONINVASIVE windows of this asset only ──
  const windows: EvidenceWindow[] = [];
  ctx.evidenceWindows.forEach((window, index) => {
    if (!window || window.windowId !== ids[index]) { codes.add(EIE_REASON.EVIDENCE_WINDOW_MISSING); return; }
    if (window.sealHash === null) codes.add(EIE_REASON.EVIDENCE_WINDOW_UNSEALED);
    else if (!verifyWindow(window, ctx.resolveRecorderKey).valid) codes.add(EIE_REASON.EVIDENCE_WINDOW_UNVERIFIED);
    if (window.purpose !== "BASELINE_NONINVASIVE") codes.add(EIE_REASON.EVIDENCE_WINDOW_PURPOSE);
    if (window.continuityStatus !== "INTACT") codes.add(EIE_REASON.EVIDENCE_WINDOW_CONTINUITY);
    if (window.assetId !== ctx.assetId) codes.add(EIE_REASON.EVIDENCE_WINDOW_ASSET_MISMATCH);
    if (ctx.mode === "PRODUCTION" && window.recorderMode !== "PRODUCTION") codes.add(EIE_REASON.SIMULATED_IN_PRODUCTION);
    // A recorded state change inside the evidence means the evidence spans it; C1-R7 events are declared, never inferred here.
    if (window.events.some((e) => e.kind === "MATERIAL_CHANGE")) codes.add(EIE_REASON.EVIDENCE_MATERIAL_CHANGE);
    windows.push(window);
  });

  // ── Observations: admitted OBSERVATION entries only ──
  const byKey = new Map<MeasurementKey, Array<{ window: EvidenceWindow; entry: ObservationRecord }>>();
  const unmappedEvidence: GateAInputManifest["unmappedEvidence"] = [];
  for (const window of windows) {
    for (const entry of window.entries) {
      if (entry.kind !== "OBSERVATION") continue;
      const key = CHANNEL_TO_MEASUREMENT_KEY[entry.observation.channel];
      if (!key) { unmappedEvidence.push({ windowId: window.windowId, entryHash: entry.entryHash, channel: entry.observation.channel, reason: "NO_C1_R7_MEASUREMENT_KEY" }); continue; }
      byKey.set(key, [...(byKey.get(key) ?? []), { window, entry }]);
    }
  }
  const corrected = new Set(ctx.assetWindows.flatMap((w) => w.entries.filter((e) => e.kind === "CORRECTION").map((e) => e.kind === "CORRECTION" ? e.correctsEntryHash : "")));

  const measurements: Record<string, Record<string, unknown>> = {};
  const lineage: MeasurementLineage[] = [];
  for (const [key, found] of [...byKey].sort(([a], [b]) => a.localeCompare(b))) {
    if (found.length !== 1) { codes.add(EIE_REASON.SERIES_NOT_CONSUMED); continue; }
    const [{ window, entry }] = found;
    const o = entry.observation;
    if (corrected.has(entry.entryHash)) codes.add(EIE_REASON.OBSERVATION_CORRECTED);
    if (ctx.mode === "PRODUCTION" && o.acquisitionMethod === "SIMULATED") codes.add(EIE_REASON.SIMULATED_IN_PRODUCTION);
    const measurement = measurementOf(o);
    measurements[key] = measurement;
    lineage.push({
      measurementKey: key, measurementHash: objectHash(measurement), channel: o.channel,
      windowId: window.windowId, sealHash: window.sealHash ?? "", windowSeq: entry.windowSeq, entryHash: entry.entryHash,
      recordedAt: entry.recordedAt, submittedBy: entry.submittedBy ? { ...entry.submittedBy } : null,
      observationId: o.observationId, observationHash: entry.observationHash, value: o.value, unit: o.unit,
      observedAt: o.observedAt, receivedAt: o.receivedAt, sequence: o.sequence, acquisitionMethod: o.acquisitionMethod,
      source: { ...o.source }, instrument: { ...o.instrument }, location: { ...o.location, basis: { ...o.location.basis } },
      accuracyOrUncertainty: o.accuracyOrUncertainty ? { ...o.accuracyOrUncertainty } : null, adapterVersion: o.adapterVersion,
      mapped: { accuracy: "accuracy" in measurement, methodId: "methodId" in measurement },
    });
  }

  if (codes.size > 0 || !declared) return { ok: false, reasonCodes: [...codes].sort() };

  const input = { ...declared, evidence: { ...(declared.evidence as Record<string, unknown>), measurements } };
  const simulated = windows.some((w) => w.recorderMode === "SIMULATION") || lineage.some((l) => l.acquisitionMethod === "SIMULATED");
  const manifest: GateAInputManifest = {
    contract: "TA-14-EIE-ARCH-1.0/s09",
    architectureFingerprint: EIE_ARCHITECTURE_FINGERPRINT,
    adapterVersion: GATE_A_INPUT_ADAPTER_VERSION,
    evidenceMode: simulated ? "SIMULATION" : "PRODUCTION",
    assetId: ctx.assetId,
    evidenceWindows: windows.map((w) => ({
      windowId: w.windowId, headerHash: w.headerHash, sealHash: w.sealHash!, purpose: w.purpose, continuityStatus: w.continuityStatus,
      recorderMode: w.recorderMode, openedAt: w.openedAt, closedAt: w.closedAt!,
    })),
    measurements: lineage,
    unmappedEvidence,
    stabilityReadings: "NOT_MAPPED",
    declaredInputHash: objectHash(declared),
    inputHash: objectHash(input),
  };
  return { ok: true, input, manifest };
}

/**
 * Receipt lineage: C1-R7 records sha256Canonical(measurement) per key in evidence_hashes.
 * - A receipt may cite no measurement the adapter did not map, and no mapped measurement altered.
 * - An ALLOW must cite exactly the mapped measurements.
 * - A non-ALLOW receipt may cite fewer (C1-R7 refused them, e.g. at schema validation); it is preserved as issued.
 */
export function receiptCitesManifest(receipt: Record<string, unknown>, manifest: GateAInputManifest): boolean {
  const hashes = receipt.evidence_hashes;
  if (!isRecord(hashes) || !isRecord(manifest) || !Array.isArray(manifest.measurements)) return false;
  const mapped = new Map(manifest.measurements.map((m) => [m.measurementKey as string, m.measurementHash]));
  const cited = Object.keys(hashes).filter((k) => k !== "evidence_record" && k !== "oem_reference");
  if (cited.some((key) => mapped.get(key) !== hashes[key])) return false;
  return receipt.determination !== "ALLOW" || cited.length === mapped.size;
}
