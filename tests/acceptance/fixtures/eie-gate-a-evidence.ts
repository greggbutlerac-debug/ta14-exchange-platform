/*
 * SYNTHETIC s09 fixtures: the NIRET complete-form measurements recorded as Node observations in a sealed
 * baseline window, and the separately governed declared (non-evidence) portion of the C1-R7 input.
 * Timeline, values, locations and instruments match tests/acceptance/fixtures/niret-complete-form.ts and the
 * HYPOTHETICAL OEM registry. Nothing here is a real system, instrument or OEM record.
 */
import { buildGateAInput as buildFormInput } from "../../../apps/web/lib/niret/evidence-adapter";
import type { NiretFormState } from "../../../apps/web/lib/niret/form-state";
import { NO_SOURCES, type CertificationVerifier } from "../../../apps/web/lib/niret/server-evaluate";
import { certificationVerifierFrom, type CertificationVerificationRow } from "../../../apps/web/lib/niret/certification-verifier";
import { createNiretGateAEvaluator } from "../../../apps/web/lib/eie/niret-gate-a-evaluator";
import {
  EvidenceRecorder, InMemoryEvidenceStore, type Channel, type EvidenceStore, type GateAEvaluator, type NodeObservation, type RecorderMode,
  type RecorderSealSigner, type Submitter, type ContinuityProfileRegistry, type ContinuityProfile,
} from "../../../packages/domain/eie";
import { completeForm, SERVER_NOW, T } from "./niret-complete-form";
import { hypotheticalRegistry } from "./niret-hypothetical-oem-record";
import { DEV_SIGNER, RESOLVE_KEY, TECH, TEST_PROFILE, baselineRequest } from "./eie-simulated";

export const ASSET = "ASSET-SYNTHETIC-01";
export const OBSERVED_AT = T("10:25");
const PROVIDER = "SIM-PROVIDER";

interface Reading { channel: Channel; value: number; unit: string; instrument: string; accuracy: number; location: string; basis: NodeObservation["location"]["basis"]; cls: "A" | "B" | "C" }
const OEM = (ref: string) => ({ kind: "OEM_CITATION" as const, ref: `SYNTHETIC-OEM:${ref}` });

/** The complete-form measurements, as the Node would have observed them (static pressure signed as read). */
export const FORM_READINGS: readonly Reading[] = [
  { channel: "RETURN_DRY_BULB", value: 76, unit: "F", instrument: "THERMO-1", accuracy: 0.5, location: "RETURN_PLENUM", basis: OEM("returnDryBulb"), cls: "A" },
  { channel: "RETURN_WET_BULB", value: 64, unit: "F", instrument: "THERMO-1", accuracy: 0.5, location: "RETURN_PLENUM", basis: OEM("returnWetBulb"), cls: "A" },
  { channel: "SUPPLY_DRY_BULB", value: 52, unit: "F", instrument: "THERMO-1", accuracy: 0.5, location: "SUPPLY_PLENUM", basis: OEM("supplyDryBulb"), cls: "A" },
  { channel: "OUTDOOR_DRY_BULB", value: 88, unit: "F", instrument: "THERMO-1", accuracy: 0.5, location: "CONDENSER_INLET", basis: OEM("outdoorDryBulb"), cls: "A" },
  { channel: "AIRFLOW", value: 1180, unit: "CFM", instrument: "FLOW-1", accuracy: 30, location: "SUPPLY_TRUNK", basis: { kind: "GOVERNED_METHOD", ref: "GM-AF-01" }, cls: "C" },
  { channel: "RETURN_STATIC_PRESSURE", value: -0.2, unit: "IN_WC", instrument: "MANO-1", accuracy: 0.01, location: "RETURN_PORT", basis: OEM("returnStatic"), cls: "A" },
  { channel: "SUPPLY_STATIC_PRESSURE", value: 0.3, unit: "IN_WC", instrument: "MANO-1", accuracy: 0.01, location: "SUPPLY_PORT", basis: OEM("supplyStatic"), cls: "A" },
];

export const EVIDENCE_CHANNELS: Channel[] = [...new Set(FORM_READINGS.map((r) => r.channel)), "VOLTAGE"];
export const EVIDENCE_SOURCES = ["THERMO-1", "FLOW-1", "MANO-1", "VOLT-1"].map((deviceId) => ({ provider: PROVIDER, deviceId }));

export function formObservations(acquisitionMethod: NodeObservation["acquisitionMethod"] = "SIMULATED", readings: readonly Reading[] = FORM_READINGS): NodeObservation[] {
  return readings.map((r, i) => ({
    observationId: `S09:${acquisitionMethod}:${r.channel}:${i}`,
    channel: r.channel,
    source: { provider: PROVIDER, deviceId: r.instrument },
    instrument: { id: r.instrument, calibrationOrFitnessRef: `SYNTHETIC-CAL:${r.instrument}`, fitUntil: "2027-01-01T00:00:00Z" },
    location: { physical: r.location, class: r.cls, basis: r.basis },
    value: r.value,
    unit: r.unit,
    observedAt: OBSERVED_AT,
    receivedAt: OBSERVED_AT,
    sequence: 1,
    acquisitionMethod,
    accuracyOrUncertainty: { kind: "ACCURACY", value: r.accuracy, unit: r.unit, basisRef: `SYNTHETIC-SPEC:${r.instrument}` },
    sourceQuality: acquisitionMethod === "SIMULATED" ? "SIMULATED" : "REPORTED",
    adapterVersion: "ta14-eie-s09-fixture/1.0.0",
  }));
}

/** The separately governed, non-evidence portion of the C1-R7 input: the form input without its measurements. */
export function declaredInput(mutate: (f: NiretFormState) => void = () => {}): Record<string, any> {
  const form = completeForm();
  mutate(form);
  const input = JSON.parse(JSON.stringify(buildFormInput(form, { requestId: "EIE-S09-1" })));
  delete input.evidence.measurements;
  delete input.evidence.stabilityReadings;
  return input;
}

const SUBMITTER = "account-uuid-1";
export const verifiedRow: CertificationVerificationRow = {
  verification_id: "c0ffee00-0000-4000-8000-000000000001", technician_account_id: SUBMITTER, technician_identity: "TECH-1",
  certification_type: "UNIVERSAL", certificate_ref: "EPA608-0001", verifier_account_id: "verifier-account-uuid-9", verified_at: T("08:00"),
};
export const verifierWith = (rows: CertificationVerificationRow[]) => certificationVerifierFrom(rows, new Set(), SUBMITTER, SERVER_NOW);
/** The real C1-R7 server path (as the evaluate route wires it), with the HYPOTHETICAL OEM registry. */
export const engine = (verifier: CertificationVerifier = verifierWith([verifiedRow])) =>
  createNiretGateAEvaluator({ ...NO_SOURCES, submitter: { accountId: SUBMITTER }, certificationVerifier: verifier, oemRegistry: hypotheticalRegistry() });

/** Recorder on the NIRET fixture timeline; its clock is set explicitly. */
export function gateARecorder(opts: {
  verifier?: CertificationVerifier; store?: EvidenceStore; evaluator?: GateAEvaluator | null; mode?: RecorderMode;
  signer?: RecorderSealSigner; profileRegistry?: ContinuityProfileRegistry; resolveKey?: typeof RESOLVE_KEY | null;
} = {}) {
  let now = Date.parse(T("10:24")) + 30_000;
  const recorder = new EvidenceRecorder({
    recorderId: "EIE-RECORDER-TEST", mode: opts.mode ?? "SIMULATION", clock: () => new Date(now).toISOString(),
    signer: opts.signer ?? DEV_SIGNER, store: opts.store ?? new InMemoryEvidenceStore(),
    gateAEvaluator: opts.evaluator === null ? undefined : opts.evaluator ?? engine(opts.verifier),
    profileRegistry: opts.profileRegistry,
    resolveRecorderKey: opts.resolveKey === null ? undefined : opts.resolveKey ?? RESOLVE_KEY,
  });
  return { recorder, setTime: (iso: string) => { now = Date.parse(iso); } };
}
export type GateARun = ReturnType<typeof gateARecorder>;

/** Records observations into a baseline window for the asset (open 10:24:30, observed 10:25, sealed 10:25:30 unless kept open). */
export async function evidenceWindow(run: GateARun, opts: {
  assetId?: string; observations?: NodeObservation[]; keepOpen?: boolean; profile?: ContinuityProfile; by?: Submitter; ref?: string; purpose?: "BASELINE_NONINVASIVE" | "CONTINUOUS";
} = {}) {
  run.setTime(new Date(Date.parse(T("10:24")) + 30_000).toISOString());
  const continuous = opts.purpose === "CONTINUOUS";
  const opened = await run.recorder.openWindow(baselineRequest({
    assetId: opts.assetId ?? ASSET, admittedChannels: EVIDENCE_CHANNELS, admittedSources: EVIDENCE_SOURCES,
    continuityProfile: opts.profile ?? TEST_PROFILE,
    purpose: continuous ? "CONTINUOUS" : "BASELINE_NONINVASIVE",
    openTrigger: { type: continuous ? "SCHEDULE" : "SESSION_START", ref: opts.ref ?? "SESSION-S09-EVIDENCE" },
  }), TECH);
  if (!opened.opened) throw new Error(`evidence window: ${opened.reasonCodes}`);
  run.setTime(new Date(Date.parse(OBSERVED_AT) + 1000).toISOString());
  for (const o of opts.observations ?? formObservations()) {
    const outcome = await run.recorder.submitObservation(opened.windowId, o, opts.by ?? { role: "NODE", id: "NODE-SIM-01" });
    if (!outcome.accepted && outcome.record?.kind !== "REJECTED_SUBMISSION") throw new Error(`${outcome.reasonCodes}`);
  }
  if (!opts.keepOpen) {
    run.setTime(new Date(Date.parse(OBSERVED_AT) + 30_000).toISOString());
    await run.recorder.closeWindow(opened.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
  }
  return opened.windowId;
}

/** Opens the successor baseline window (10:26) that will preserve the receipt, with the evidence windows as predecessors. */
export async function preservingWindow(run: GateARun, evidenceWindowIds: string[], assetId = ASSET) {
  run.setTime(T("10:26"));
  const opened = await run.recorder.openWindow(baselineRequest({ assetId, predecessorWindowIds: evidenceWindowIds, openTrigger: { type: "SESSION_START", ref: "SESSION-S09-EVAL" } }), TECH);
  if (!opened.opened) throw new Error(`preserving window: ${opened.reasonCodes}`);
  return opened.windowId;
}

/** The full s09 path: sealed evidence -> adapter -> C1-R7 -> receipt preserved with lineage (evaluated at SERVER_NOW). */
export async function evaluated(run: GateARun, opts: { assetId?: string; mutateForm?: (f: NiretFormState) => void; observations?: NodeObservation[] } = {}) {
  const assetId = opts.assetId ?? ASSET;
  const evidenceId = await evidenceWindow(run, { assetId, observations: opts.observations });
  const baselineId = await preservingWindow(run, [evidenceId], assetId);
  run.setTime(SERVER_NOW.toISOString());
  const result = await run.recorder.recordGateAEvaluation(baselineId, { evidenceWindowIds: [evidenceId], declared: declaredInput(opts.mutateForm) }, TECH);
  if (!result.accepted) throw new Error(`evaluation: ${result.reasonCodes}`);
  run.setTime(new Date(SERVER_NOW.getTime() + 1000).toISOString());
  return { evidenceId, baselineId, record: result.record, receipt: result.record.receipt as Record<string, any> };
}
