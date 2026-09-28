/**
 * TA-14-EIE-ARCH-1.0 Phase 2B — s09 SEALED RECORDER EVIDENCE -> C1-R7 GATE A INPUT ADAPTER.
 *
 * PHYSICAL REALITY -> NODE OBSERVATION -> RECORDER SEALED INTACT WINDOW -> s09 ADAPTER -> C1-R7 -> GATE A RECEIPT.
 * Every Gate A determination here is produced by the real C1-R7 server path. Evidence, profiles and
 * OEM records are SYNTHETIC; the OEM registry is the HYPOTHETICAL fixture registry.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildGateAInput, CHANNEL_TO_MEASUREMENT_KEY, EIE_REASON, objectHash, verifyWindow,
  type EvidenceWindow, type GateAReceiptRecord, type NodeObservation, type RecorderSealSigner,
} from "../../packages/domain/eie";
import { evaluateNiretSubmission, NO_SOURCES } from "../../apps/web/lib/niret/server-evaluate";
import spec from "../../docs/eie/TA-14-EIE-ARCH-1.0.spec.json";
import { SERVER_NOW, T } from "./fixtures/niret-complete-form";
import { hypotheticalRegistry } from "./fixtures/niret-hypothetical-oem-record";
import {
  ASSET, declaredInput, engine, evaluated, evidenceWindow, formObservations, FORM_READINGS, gateARecorder, preservingWindow, verifierWith,
  verifiedRow, type GateARun,
} from "./fixtures/eie-gate-a-evidence";
import { DEV_SIGNER, RESOLVE_KEY, TECH, baselineRequest, profileWith } from "./fixtures/eie-simulated";

const mutable = <T>(value: T): T => structuredClone(value) as T;
const reading = (channel: string, change: Partial<NodeObservation> | null, base = formObservations()) =>
  base.flatMap((o) => (o.channel !== channel ? [o] : change === null ? [] : [{ ...o, ...change }]));

/** Evaluates through the Recorder with the given evidence windows as predecessors; returns the Recorder outcome. */
async function attempt(run: GateARun, evidenceIds: string[], declared: unknown = declaredInput(), assetId = ASSET) {
  const baselineId = await preservingWindow(run, evidenceIds, assetId);
  run.setTime(SERVER_NOW.toISOString());
  const result = await run.recorder.recordGateAEvaluation(baselineId, { evidenceWindowIds: evidenceIds, declared }, TECH);
  return { baselineId, result };
}

/** Runs the full path and returns the genuine C1-R7 receipt. */
async function receiptFor(opts: Parameters<typeof evaluated>[1] & { verifier?: ReturnType<typeof verifierWith> } = {}) {
  const run = gateARecorder({ verifier: opts.verifier });
  return (await evaluated(run, opts)).receipt;
}

// ─────────────────────────────── Contract and lineage ───────────────────────────────

describe("s09 adapter contract", () => {
  it("maps only channels that name the same C1-R7 quantity; VOLTAGE and CURRENT are ambiguous and not mapped", () => {
    expect(CHANNEL_TO_MEASUREMENT_KEY).toEqual({
      RETURN_DRY_BULB: "returnDryBulb", RETURN_WET_BULB: "returnWetBulb", RETURN_RH: "returnRh", SUPPLY_DRY_BULB: "supplyDryBulb",
      SUPPLY_RH: "supplyRh", OUTDOOR_DRY_BULB: "outdoorDryBulb", AIRFLOW: "airflow", RETURN_STATIC_PRESSURE: "returnStatic",
      SUPPLY_STATIC_PRESSURE: "supplyStatic", LIQUID_LINE_TEMPERATURE: "liquidLineTemp", SUCTION_LINE_TEMPERATURE: "suctionLineTemp",
    });
    for (const unmapped of ["VOLTAGE", "CURRENT", "BAROMETRIC_PRESSURE", "ELEVATION", "SCALE_MASS", "SUCTION_PRESSURE", "LIQUID_PRESSURE"]) {
      expect(CHANNEL_TO_MEASUREMENT_KEY).not.toHaveProperty(unmapped);
    }
    expect(spec.s09_gateAInterface[0]).toMatch(/builds the C1-R7 input from sealed windows/);
  });

  it("sealed INTACT evidence -> adapter -> C1-R7 -> ALLOW, with the receipt preserved alongside its lineage manifest", async () => {
    const run = gateARecorder();
    const { evidenceId, baselineId, record, receipt } = await evaluated(run);
    expect(receipt).toMatchObject({ determination: "ALLOW", scope: "PRESSURE_EVIDENCE_ONLY", gate_b_authorized: false });

    const evidence = (await run.recorder.getWindow(evidenceId))!;
    const manifest = record.inputManifest;
    expect(manifest).toMatchObject({
      contract: "TA-14-EIE-ARCH-1.0/s09", evidenceMode: "SIMULATION", assetId: ASSET, stabilityReadings: "NOT_MAPPED",
      evidenceWindows: [{ windowId: evidenceId, sealHash: evidence.sealHash, headerHash: evidence.headerHash, purpose: "BASELINE_NONINVASIVE", continuityStatus: "INTACT" }],
    });
    expect(manifest.measurements.map((m) => m.measurementKey).sort()).toEqual(
      ["airflow", "outdoorDryBulb", "returnDryBulb", "returnStatic", "returnWetBulb", "supplyDryBulb", "supplyStatic"]);
    for (const m of manifest.measurements) {
      const entry = evidence.entries.find((e) => e.entryHash === m.entryHash)!;
      expect(entry.kind).toBe("OBSERVATION");
      if (entry.kind !== "OBSERVATION") continue;
      expect(m).toMatchObject({
        windowId: evidenceId, sealHash: evidence.sealHash, windowSeq: entry.windowSeq, observationId: entry.observation.observationId,
        observationHash: entry.observationHash, value: entry.observation.value, unit: entry.observation.unit, observedAt: entry.observation.observedAt,
        sequence: entry.observation.sequence, acquisitionMethod: "SIMULATED", instrument: entry.observation.instrument, location: entry.observation.location,
        submittedBy: { role: "NODE", id: "NODE-SIM-01" }, recordedAt: entry.recordedAt,
      });
      // The receipt cites exactly this measurement: C1-R7's own evidence_hashes[key] = sha256Canonical(measurement).
      expect(receipt.evidence_hashes[m.measurementKey]).toBe(m.measurementHash);
    }
    expect(verifyWindow((await run.recorder.getWindow(baselineId))!, RESOLVE_KEY).valid).toBe(true);
  });

  it("the adapter changes nothing about C1-R7: the preserved receipt equals a direct evaluation of the adapted input", async () => {
    const run = gateARecorder();
    const { record, receipt } = await evaluated(run);
    const input = { ...declaredInput(), evidence: { ...declaredInput().evidence, measurements: {} as Record<string, unknown> } };
    const evidence = (await run.recorder.getWindow(record.inputManifest.evidenceWindows[0].windowId))!;
    const rebuilt = buildGateAInput({ evidenceWindowIds: [evidence.windowId], declared: declaredInput() }, {
      mode: "SIMULATION", assetId: ASSET, evidenceWindows: [evidence], assetWindows: [evidence], resolveRecorderKey: RESOLVE_KEY,
    });
    expect(rebuilt.ok).toBe(true);
    if (!rebuilt.ok) return;
    expect(rebuilt.manifest.inputHash).toBe(record.gateAInputHash);
    Object.assign(input.evidence.measurements, (rebuilt.input.evidence as { measurements: object }).measurements);
    const direct = evaluateNiretSubmission(rebuilt.input, SERVER_NOW, { ...NO_SOURCES, submitter: { accountId: "account-uuid-1" }, certificationVerifier: verifierWith([verifiedRow]), oemRegistry: hypotheticalRegistry() }).receipt;
    expect(direct.content_hash).toBe(receipt.content_hash);
    expect(objectHash(input)).toBe(objectHash(rebuilt.input));
  });

  it("the lineage is traceable backwards from a pressure window to each Node observation", async () => {
    const run = gateARecorder();
    const { baselineId, receipt } = await evaluated(run);
    const pressure = await run.recorder.openWindow(baselineRequest({
      purpose: "PRESSURE_EVIDENCE", openTrigger: { type: "GATE_A_ALLOW_RECEIPT", ref: receipt.receipt_id },
      admittedChannels: ["SUCTION_PRESSURE"], predecessorWindowIds: [baselineId],
    }), TECH);
    if (!pressure.opened) throw new Error(`${pressure.reasonCodes}`);
    // GATE A RECEIPT <- C1-R7 INPUT <- s09 MAPPING <- SEALED WINDOW <- RECORDER ENTRY <- NODE OBSERVATION
    const preserving = (await run.recorder.getWindow(pressure.window.openTrigger.gateAReceiptWindowId!))!;
    const receiptRecord = preserving.events.find((e): e is GateAReceiptRecord => e.kind === "GATE_A_RECEIPT" && e.entryHash === pressure.window.openTrigger.gateAReceiptEntryHash)!;
    expect(receiptRecord.receiptContentHash).toBe(pressure.window.openTrigger.gateAReceiptContentHash);
    for (const m of receiptRecord.inputManifest.measurements) {
      expect(receiptRecord.receipt.evidence_hashes).toMatchObject({ [m.measurementKey]: m.measurementHash });
      expect(preserving.predecessorWindowIds).toContain(m.windowId);
      const source = (await run.recorder.getWindow(m.windowId))!;
      expect(source.sealHash).toBe(m.sealHash);
      const entry = source.entries.find((e) => e.entryHash === m.entryHash);
      expect(entry && entry.kind === "OBSERVATION" && objectHash(entry.observation)).toBe(m.observationHash);
    }
  });

  it("admitted evidence without a C1-R7 key is disclosed as unmapped, never dropped silently or re-labelled", async () => {
    const voltage: NodeObservation = { ...formObservations()[0], observationId: "S09:V", channel: "VOLTAGE", unit: "V", value: 240,
      source: { provider: "SIM-PROVIDER", deviceId: "VOLT-1" }, instrument: { id: "VOLT-1", calibrationOrFitnessRef: "SYNTHETIC-CAL:VOLT-1", fitUntil: "2027-01-01T00:00:00Z" },
      location: { physical: "DISCONNECT", class: "C", basis: { kind: "GOVERNED_METHOD", ref: "GM-EL-01" } }, accuracyOrUncertainty: null };
    const run = gateARecorder();
    const { record } = await evaluated(run, { observations: [...formObservations(), voltage] });
    expect(record.inputManifest.unmappedEvidence).toEqual([expect.objectContaining({ channel: "VOLTAGE", reason: "NO_C1_R7_MEASUREMENT_KEY" })]);
    expect(record.receipt.evidence_hashes).not.toHaveProperty("supplyVoltage");
    expect(record.receipt.evidence_hashes).not.toHaveProperty("compressorCurrent");
  });

  it("a receipt that does not cite exactly the adapted measurements is refused", async () => {
    const base = engine();
    const altering = (input: unknown, ctx: { now: Date }) => {
      const copy = mutable(input) as { evidence: { measurements: { returnDryBulb: { value: number } } } };
      copy.evidence.measurements.returnDryBulb.value = 70;
      return base(copy, ctx);
    };
    const run = gateARecorder({ evaluator: altering });
    const evidenceId = await evidenceWindow(run);
    const { result } = await attempt(run, [evidenceId]);
    expect(result).toMatchObject({ accepted: false, reasonCodes: [EIE_REASON.RECEIPT_EVIDENCE_MISMATCH] });
  });

  it("altering a preserved manifest is detected by window verification", async () => {
    const run = gateARecorder();
    const { baselineId } = await evaluated(run);
    const window = mutable((await run.recorder.getWindow(baselineId))!) as EvidenceWindow;
    const record = window.events.find((e) => e.kind === "GATE_A_RECEIPT") as GateAReceiptRecord;
    record.inputManifest.measurements[0].value = 1;
    expect(verifyWindow(window, RESOLVE_KEY).reasonCodes).toContain(EIE_REASON.HASH_MISMATCH);
  });

  it("the adapter is deterministic", async () => {
    const run = gateARecorder();
    const evidenceId = await evidenceWindow(run);
    const evidence = (await run.recorder.getWindow(evidenceId))!;
    const build = () => buildGateAInput({ evidenceWindowIds: [evidenceId], declared: declaredInput() }, {
      mode: "SIMULATION", assetId: ASSET, evidenceWindows: [evidence], assetWindows: [evidence], resolveRecorderKey: RESOLVE_KEY,
    });
    const [a, b] = [build(), build()];
    expect(a.ok && b.ok && objectHash(a.manifest)).toBe(b.ok && objectHash(b.manifest));
  });
});

// ─────────────────────────────── Window admissibility (adapter refusals) ───────────────────────────────

describe("Window admissibility: only sealed, verified, INTACT baseline windows of the asset", () => {
  it("an OPEN (unsealed) evidence window cannot supply input", async () => {
    const run = gateARecorder();
    const openId = await evidenceWindow(run, { keepOpen: true });
    const open = (await run.recorder.getWindow(openId))!;
    const direct = buildGateAInput({ evidenceWindowIds: [openId], declared: declaredInput() }, {
      mode: "SIMULATION", assetId: ASSET, evidenceWindows: [open], assetWindows: [open], resolveRecorderKey: RESOLVE_KEY,
    });
    expect(direct).toEqual({ ok: false, reasonCodes: [EIE_REASON.EVIDENCE_WINDOW_UNSEALED] });
    // Through the Recorder, an unsealed window cannot even be a predecessor, so it is never in the evaluation's lineage.
    const other = await evidenceWindow(run, { ref: "S-2", observations: formObservations("SIMULATED").map((o) => ({ ...o, observationId: `${o.observationId}:B` })) });
    const baselineId = await preservingWindow(run, [other]);
    run.setTime(SERVER_NOW.toISOString());
    const result = await run.recorder.recordGateAEvaluation(baselineId, { evidenceWindowIds: [openId], declared: declaredInput() }, TECH);
    expect(result.reasonCodes).toContain(EIE_REASON.EVIDENCE_WINDOW_NOT_IN_LINEAGE);
  });

  it("an invalid seal (altered window or untrusted key) cannot supply input", async () => {
    const run = gateARecorder();
    const evidenceId = await evidenceWindow(run);
    const sealed = (await run.recorder.getWindow(evidenceId))!;
    const altered = mutable(sealed) as EvidenceWindow;
    altered.sealHash = "f".repeat(64);
    const ctx = { mode: "SIMULATION" as const, assetId: ASSET, assetWindows: [sealed] };
    expect(buildGateAInput({ evidenceWindowIds: [evidenceId], declared: declaredInput() }, { ...ctx, evidenceWindows: [altered], resolveRecorderKey: RESOLVE_KEY }).ok).toBe(false);
    expect(buildGateAInput({ evidenceWindowIds: [evidenceId], declared: declaredInput() }, { ...ctx, evidenceWindows: [sealed], resolveRecorderKey: () => undefined }))
      .toEqual({ ok: false, reasonCodes: [EIE_REASON.EVIDENCE_WINDOW_UNVERIFIED] });
    const noKeys = gateARecorder({ resolveKey: null });
    const id = await evidenceWindow(noKeys);
    expect((await attempt(noKeys, [id])).result.reasonCodes).toContain(EIE_REASON.EVIDENCE_WINDOW_UNVERIFIED);
  });

  it("DEGRADED evidence fails closed; the window is preserved unchanged", async () => {
    const run = gateARecorder();
    const obs = formObservations();
    const evidenceId = await evidenceWindow(run, { observations: [...obs, { ...obs[0], value: 99 }] });
    const before = (await run.recorder.getWindow(evidenceId))!;
    expect(before.continuityStatus).toBe("DEGRADED");
    const { result } = await attempt(run, [evidenceId]);
    expect(result.reasonCodes).toEqual([EIE_REASON.EVIDENCE_WINDOW_CONTINUITY]);
    expect(await run.recorder.getWindow(evidenceId)).toEqual(before);
  });

  it("BROKEN evidence fails closed", async () => {
    const run = gateARecorder();
    const [first] = formObservations();
    const evidenceId = await evidenceWindow(run, { observations: [first, { ...first, observationId: "S09:GAP", sequence: 3 }] });
    expect((await run.recorder.getWindow(evidenceId))!.continuityStatus).toBe("BROKEN");
    expect((await attempt(run, [evidenceId])).result.reasonCodes).toContain(EIE_REASON.EVIDENCE_WINDOW_CONTINUITY);
  });

  it("a window of the wrong purpose fails closed", async () => {
    const run = gateARecorder();
    const evidenceId = await evidenceWindow(run, { purpose: "CONTINUOUS" });
    expect((await attempt(run, [evidenceId])).result.reasonCodes).toContain(EIE_REASON.EVIDENCE_WINDOW_PURPOSE);
  });

  it("evidence from another asset fails closed", async () => {
    const run = gateARecorder();
    const evidenceId = await evidenceWindow(run, { assetId: "ASSET-OTHER" });
    expect((await attempt(run, [evidenceId])).result.reasonCodes).toContain(EIE_REASON.EVIDENCE_WINDOW_ASSET_MISMATCH);
  });

  it("evidence spanning a recorded state change fails closed; the event is never inferred into C1-R7 input", async () => {
    const run = gateARecorder();
    const evidenceId = await evidenceWindow(run, { keepOpen: true });
    await run.recorder.recordMaterialChange(evidenceId, { changeType: "FILTER_REPLACED_OR_REMOVED", detail: {} }, TECH);
    run.setTime(T("10:25").replace(":00Z", ":30Z"));
    await run.recorder.closeWindow(evidenceId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
    expect((await attempt(run, [evidenceId])).result.reasonCodes).toContain(EIE_REASON.EVIDENCE_MATERIAL_CHANGE);
  });

  it("simulated evidence cannot be presented as production evidence", async () => {
    const run = gateARecorder();
    const evidenceId = await evidenceWindow(run);
    const evidence = (await run.recorder.getWindow(evidenceId))!;
    expect(buildGateAInput({ evidenceWindowIds: [evidenceId], declared: declaredInput() }, {
      mode: "PRODUCTION", assetId: ASSET, evidenceWindows: [evidence], assetWindows: [evidence], resolveRecorderKey: RESOLVE_KEY,
    })).toEqual({ ok: false, reasonCodes: [EIE_REASON.SIMULATED_IN_PRODUCTION] });
  });

  it("production evidence maps with MANUAL provenance and is labelled PRODUCTION", async () => {
    const pinned = profileWith({ basis: { kind: "SOURCE_DOCUMENTATION", ref: "SYNTHETIC-SOURCE-DOC" } });
    const registry = new Map([[`${pinned.profileId}@${pinned.profileVersion}`, objectHash(pinned)]]);
    const custodied: RecorderSealSigner = { ...DEV_SIGNER, development: false };
    const run = gateARecorder({ mode: "PRODUCTION", signer: custodied, profileRegistry: registry });
    const evidenceId = await evidenceWindow(run, { profile: pinned, observations: formObservations("MANUAL_INSTRUMENT") });
    const baselineId = await (async () => {
      run.setTime(T("10:26"));
      const opened = await run.recorder.openWindow(baselineRequest({ predecessorWindowIds: [evidenceId], continuityProfile: pinned, openTrigger: { type: "SESSION_START", ref: "P" } }), TECH);
      if (!opened.opened) throw new Error(`${opened.reasonCodes}`);
      return opened.windowId;
    })();
    run.setTime(SERVER_NOW.toISOString());
    const result = await run.recorder.recordGateAEvaluation(baselineId, { evidenceWindowIds: [evidenceId], declared: declaredInput() }, TECH);
    if (!result.accepted) throw new Error(`${result.reasonCodes}`);
    expect(result.record.inputManifest.evidenceMode).toBe("PRODUCTION");
    expect(result.record.receipt.evidence_provenance).toMatchObject({ returnDryBulb: "MANUAL" });
  });
});

// ─────────────────────────────── Observation mapping (adapter refusals) ───────────────────────────────

describe("Raw observations only: no series reduction, substitution, inference or defaulting", () => {
  it("more than one admitted reading for a C1-R7 key is a series, which C1-R7 does not consume (s09/C1-R8)", async () => {
    const run = gateARecorder();
    const obs = formObservations();
    const second = { ...obs[0], observationId: "S09:SECOND", sequence: 2 };
    const evidenceId = await evidenceWindow(run, { observations: [...obs, second] });
    expect((await run.recorder.getWindow(evidenceId))!.continuityStatus).toBe("INTACT");
    expect((await attempt(run, [evidenceId])).result.reasonCodes).toEqual([EIE_REASON.SERIES_NOT_CONSUMED]);
  });

  it("the same key observed in two evidence windows is also refused, never merged", async () => {
    const run = gateARecorder();
    const a = await evidenceWindow(run);
    const b = await evidenceWindow(run, { ref: "S-2", observations: formObservations().slice(0, 1).map((o) => ({ ...o, observationId: "S09:B" })) });
    expect((await attempt(run, [a, b])).result.reasonCodes).toContain(EIE_REASON.SERIES_NOT_CONSUMED);
  });

  it("a corrected observation cannot supply input, and its replacement is never substituted", async () => {
    const run = gateARecorder();
    const evidenceId = await evidenceWindow(run);
    const evidence = (await run.recorder.getWindow(evidenceId))!;
    const baselineId = await preservingWindow(run, [evidenceId]);
    await run.recorder.submitCorrection(baselineId, { correctsWindowId: evidenceId, correctsEntryHash: evidence.entries[0].entryHash, reason: "synthetic", replacement: null }, TECH);
    run.setTime(SERVER_NOW.toISOString());
    const result = await run.recorder.recordGateAEvaluation(baselineId, { evidenceWindowIds: [evidenceId], declared: declaredInput() }, TECH);
    expect(result.reasonCodes).toContain(EIE_REASON.OBSERVATION_CORRECTED);
  });

  it("a declared input cannot carry measurements or stability readings (no Analyzer-derived or manual substitution)", async () => {
    const run = gateARecorder();
    const evidenceId = await evidenceWindow(run);
    const derived = declaredInput();
    derived.evidence.measurements = { supplyDryBulb: { value: 57, unit: "F", measuredAt: T("10:25"), location: "SUPPLY_PLENUM", instrumentId: "THERMO-1", provenance: "MANUAL", accuracy: 0.5 } };
    const { result } = await attempt(run, [evidenceId], derived);
    expect(result.reasonCodes).toEqual([EIE_REASON.DECLARED_EVIDENCE_SUBSTITUTION]);
    const stability = declaredInput();
    stability.evidence.stabilityReadings = [];
    const run2 = gateARecorder();
    expect((await attempt(run2, [await evidenceWindow(run2)], stability)).result.reasonCodes).toEqual([EIE_REASON.DECLARED_EVIDENCE_SUBSTITUTION]);
    const extra = { ...declaredInput(), calculationResults: [{ resultHash: "0".repeat(64) }] };
    const run3 = gateARecorder();
    expect((await attempt(run3, [await evidenceWindow(run3)], extra)).result.reasonCodes).toEqual([EIE_REASON.REQUEST_INVALID]);
  });

  it("absent or non-accuracy uncertainty is omitted, never defaulted; missing channels stay missing", async () => {
    const receipt = await receiptFor({ observations: reading("RETURN_DRY_BULB", { accuracyOrUncertainty: { kind: "UNCERTAINTY", value: 0.5, unit: "F", basisRef: "X" } }, reading("SUPPLY_DRY_BULB", null)) });
    expect(receipt.determination).not.toBe("ALLOW");
    expect(receipt.reason_codes).toEqual(expect.arrayContaining(["INSTRUMENT_ACCURACY_UNRECORDED", "SUPPLYDRYBULB_UNAVAILABLE"]));
    expect(receipt.evidence_hashes).not.toHaveProperty("supplyDryBulb");
  });
});

// ─────────────────────────────── C1-R7 governs its own evaluation ───────────────────────────────

describe("C1-R7 evaluates the adapted input under its own reason codes", () => {
  const cases: Array<[string, Parameters<typeof receiptFor>[0], string]> = [
    ["missing observation", { observations: reading("RETURN_DRY_BULB", null) }, "RETURNDRYBULB_UNAVAILABLE"],
    ["malformed unit (not a C1-R7 unit code)", { observations: reading("RETURN_DRY_BULB", { unit: "degF", accuracyOrUncertainty: { kind: "ACCURACY", value: 0.5, unit: "degF", basisRef: "X" } }) }, "INPUT_INVALID"],
    ["incompatible unit", { observations: reading("RETURN_DRY_BULB", { unit: "PCT_RH", accuracyOrUncertainty: { kind: "ACCURACY", value: 0.5, unit: "PCT_RH", basisRef: "X" } }) }, "UNIT_MISMATCH"],
    ["instrument not registered in the declared instrument list", { mutateForm: (f) => { f.instruments = f.instruments.filter((i) => i.id !== "FLOW-1"); } }, "INSTRUMENT_UNREGISTERED"],
    ["declared calibration not valid", { mutateForm: (f) => { f.instruments = f.instruments.map((i) => (i.id === "FLOW-1" ? { ...i, calibrationValid: false } : i)); } }, "INSTRUMENT_INVALID"],
    ["unsupported measurement location", { observations: reading("RETURN_DRY_BULB", { location: { physical: "ATTIC", class: "A", basis: { kind: "OEM_CITATION", ref: "SYNTHETIC-OEM:x" } } }) }, "MEASUREMENT_LOCATION_NOT_OEM_LOCATION"],
    ["governed method not applicable to the key", { observations: reading("AIRFLOW", { location: { physical: "SUPPLY_TRUNK", class: "C", basis: { kind: "GOVERNED_METHOD", ref: "GM-RA-01" } } }) }, "GOVERNED_METHOD_NOT_APPLICABLE"],
    ["evidence outside the C1-R7 qualifying window", { mutateForm: (f) => { f.operation.runStartedAt = T("10:09"); } }, "MEASUREMENT_OUTSIDE_QUALIFYING_WINDOW"],
    ["unresolved OEM criteria (no governed record for the declared identity)", { mutateForm: (f) => { f.equipment.manufacturer = "OtherCo"; } }, "OEM_REFERENCE_NOT_VERIFIED"],
  ];
  it.each(cases)("%s -> not ALLOW under the C1-R7 reason", async (_name, setup, code) => {
    const receipt = await receiptFor(setup);
    expect(receipt.determination).not.toBe("ALLOW");
    expect(receipt.reason_codes).toContain(code);
    expect(receipt.gate_b_authorized).toBe(false);
  });

  it("missing equipment identity, technician certification or execution authority is never inferred from evidence", async () => {
    const noIdentity = await receiptFor({ mutateForm: (f) => { f.equipment.manufacturer = ""; f.equipment.indoorModel = ""; f.equipment.outdoorModel = ""; } });
    expect(noIdentity.determination).not.toBe("ALLOW");
    const noCertificate = await receiptFor({ mutateForm: (f) => { f.job.certificationStatus = ""; f.job.certificateRef = ""; } });
    expect(noCertificate.determination).not.toBe("ALLOW");
    const unverified = await receiptFor({ verifier: verifierWith([]) });
    expect(unverified).toMatchObject({ determination: "HOLD", technical_determination: { determination: "ALLOW" }, execution_authority: { determination: "HOLD" } });
    const noSitePermission = await receiptFor({ mutateForm: (f) => { f.job.sitePermission = "UNCONFIRMED"; } });
    expect(noSitePermission.determination).not.toBe("ALLOW");
  });

  it("the Phase 1 raw-input path no longer exists: a Gate A evaluation must name sealed evidence windows", async () => {
    const run = gateARecorder();
    const evidenceId = await evidenceWindow(run);
    const baselineId = await preservingWindow(run, [evidenceId]);
    run.setTime(SERVER_NOW.toISOString());
    const raw = await run.recorder.recordGateAEvaluation(baselineId, declaredInput() as never, TECH);
    expect(raw.accepted).toBe(false);
    const empty = await run.recorder.recordGateAEvaluation(baselineId, { evidenceWindowIds: [], declared: declaredInput() }, TECH);
    expect(empty.reasonCodes).toContain(EIE_REASON.REQUEST_INVALID);
  });
});

describe("Boundaries", () => {
  it("the adapter depends on neither the Analyzer nor CRR-1, and contains no inference or arithmetic on evidence", () => {
    const source = readFileSync(new URL("../../packages/domain/eie/gate-a-input/adapter.ts", import.meta.url), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(source).not.toMatch(/analyzer|crr|calculat/i);
    expect(source).not.toMatch(/Math\.|interpolat|extrapolat|estimat|default/i);
    expect(source).not.toMatch(/\bvalue\s*[-+*/]|[-+*/]\s*o\.value/);
    const literals = source.replace(/"[^"\n]*"|`[^`\n]*`/g, "").match(/(?<![\w.$-])\d[\d_]*(\.\d+)?(?![\w])/g) ?? [];
    expect([...new Set(literals)].sort()).toEqual(["0", "1"]);
  });

  it("every fixture reading maps to exactly one C1-R7 key", () => {
    for (const r of FORM_READINGS) expect(CHANNEL_TO_MEASUREMENT_KEY[r.channel]).toBeDefined();
  });
});
