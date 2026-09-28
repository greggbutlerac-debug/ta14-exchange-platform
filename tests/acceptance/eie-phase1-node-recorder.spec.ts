import { readdirSync, readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020";
import { describe, expect, it } from "vitest";
import { generateDevelopmentSigningKey } from "../../packages/crypto/receipts";
import * as eie from "../../packages/domain/eie";
import {
  AppendOnlyViolation, EIE_ARCHITECTURE_FINGERPRINT, EIE_REASON, EvidenceRecorder, InMemoryEvidenceStore,
  OPEN_TRIGGERS, WINDOW_PURPOSES, eieSpecFingerprint, objectHash, validateObservation, verifyWindow,
  type EvidenceWindow, type NodeObservation, type WindowHeader,
} from "../../packages/domain/eie";
import spec from "../../docs/eie/TA-14-EIE-ARCH-1.0.spec.json";
import observationSchema from "../../schemas/eie-node-observation.schema.json";
import windowSchema from "../../schemas/eie-evidence-window.schema.json";
import {
  NODE, RESOLVE_KEY, TECH, at, baselineRequest, makeRecorder, profileWith, simulatedStream,
} from "./fixtures/eie-simulated";

/*
 * TA-14-EIE-ARCH-1.0 Phase 1 conformance: Physical Reality -> Node -> Recorder.
 * Every observation and profile here is SYNTHETIC (s21). Gate A binding, continuity-profile
 * governance and persistence hardening are in eie-phase1-closure.spec.ts.
 */

const mutable = <T>(value: T): T => structuredClone(value) as T;

/** Opens a baseline window at t=0 and records the given observations, each one second after it was observed. */
async function recordStream(observations: NodeObservation[] = simulatedStream(), opts: Parameters<typeof makeRecorder>[0] = {}) {
  const run = makeRecorder(opts);
  const opened = await run.recorder.openWindow(baselineRequest(), TECH);
  if (!opened.opened) throw new Error(`open failed: ${opened.reasonCodes}`);
  const outcomes = [];
  for (const o of observations) {
    run.time.set((Date.parse(o.observedAt) - Date.parse(at(0))) / 1000 + 1);
    outcomes.push(await run.recorder.submitObservation(opened.windowId, o, NODE));
  }
  return { ...run, windowId: opened.windowId, outcomes };
}

async function sealedStream() {
  const run = await recordStream();
  run.time.set(200);
  const closed = await run.recorder.closeWindow(run.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
  if (!closed.closed) throw new Error("close failed");
  return { ...run, window: closed.window };
}

describe("Frozen baseline binding", () => {
  it("binds to TA-14-EIE-ARCH-1.0 by canonical fingerprint", () => {
    expect(eieSpecFingerprint()).toBe("f4575172495fec67c29b964465d5f90f23845dbe98d30bd31f4e9281ba075170");
    expect(EIE_ARCHITECTURE_FINGERPRINT).toBe(eieSpecFingerprint());
    expect(spec.specId).toBe("TA-14-EIE-ARCH-1.0");
  });
  it("uses exactly the frozen window purposes and open triggers", () => {
    expect([...WINDOW_PURPOSES]).toEqual(spec.s03_evidenceWindow.purposes);
    expect([...OPEN_TRIGGERS]).toEqual(Object.keys(spec.s03_evidenceWindow.openTriggers));
  });
  it("uses every frozen EIE-OBS/WIN/PROV reason code member", () => {
    const frozen = ["EIE-OBS-*", "EIE-WIN-*", "EIE-PROV-*"].flatMap((family) =>
      (spec.s17_reasonCodeFamilies[family as keyof typeof spec.s17_reasonCodeFamilies] as string[]).map((m) => `${family.slice(0, -1)}${m}`));
    expect(Object.values(EIE_REASON)).toEqual(expect.arrayContaining(frozen));
  });
  it("covers every frozen s04 observation field and no others", () => {
    const frozen = spec.s04_nodeObservation.fields.map((f) => f.split(/[{ ]/)[0]);
    expect([...observationSchema.required].sort()).toEqual([...frozen].sort());
  });
});

describe("Node observation contract (s04)", () => {
  const [base] = simulatedStream();

  it("identical observations canonicalize identically, whatever the key order", () => {
    const reordered = Object.fromEntries(Object.entries(mutable(base)).reverse());
    const a = validateObservation(base, "SIMULATION");
    const b = validateObservation(reordered, "SIMULATION");
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) expect(a.observationHash).toBe(b.observationHash);
    expect(objectHash(reordered)).toBe(objectHash(base));
  });

  it("changed evidence changes its hash", async () => {
    const changed = { ...mutable(base), value: base.value + 0.1 };
    expect(objectHash(changed)).not.toBe(objectHash(base));
    const a = (await recordStream([base])).outcomes[0];
    const b = (await recordStream([changed])).outcomes[0];
    expect(a.record!.entryHash).not.toBe(b.record!.entryHash);
  });

  const cases: Array<[string, (o: Record<string, any>) => void, string]> = [
    ["unit omitted", (o) => { delete o.unit; }, EIE_REASON.UNIT_UNDECLARED],
    ["unit blank", (o) => { o.unit = " "; }, EIE_REASON.UNIT_UNDECLARED],
    ["unparseable observedAt", (o) => { o.observedAt = "2026-09-28 14:00"; }, EIE_REASON.TIME_UNPARSEABLE],
    ["zone-less receivedAt", (o) => { o.receivedAt = "2026-09-28T14:00:10"; }, EIE_REASON.TIME_UNPARSEABLE],
    ["non-finite value", (o) => { o.value = Number.NaN; }, EIE_REASON.VALUE_INVALID],
    ["string value", (o) => { o.value = "75.1"; }, EIE_REASON.VALUE_INVALID],
    ["negative sequence", (o) => { o.sequence = -1; }, EIE_REASON.VALUE_INVALID],
    ["undefined IAQ channel", (o) => { o.channel = "IAQ"; }, EIE_REASON.CHANNEL_UNKNOWN],
    ["derived value smuggled in", (o) => { o.enthalpy = 28.1; }, EIE_REASON.FIELD_UNRECOGNIZED],
    ["uncertainty omitted rather than declared null", (o) => { delete o.accuracyOrUncertainty; }, EIE_REASON.FIELD_MISSING],
    ["observationId blank", (o) => { o.observationId = ""; }, EIE_REASON.FIELD_MISSING],
  ];
  it.each(cases)("malformed observation fails closed: %s", (_name, mutate, code) => {
    const input = mutable(base) as Record<string, any>;
    mutate(input);
    const result = validateObservation(input, "SIMULATION");
    expect(result.ok).toBe(false);
    expect(result.reasonCodes).toContain(code);
  });

  const provenance: Array<[string, (o: Record<string, any>) => void, string]> = [
    ["source missing", (o) => { delete o.source; }, EIE_REASON.SOURCE_UNIDENTIFIED],
    ["source deviceId blank", (o) => { o.source.deviceId = ""; }, EIE_REASON.SOURCE_UNIDENTIFIED],
    ["instrument missing", (o) => { delete o.instrument; }, EIE_REASON.INSTRUMENT_UNFIT],
    ["calibration reference missing", (o) => { o.instrument.calibrationOrFitnessRef = ""; }, EIE_REASON.INSTRUMENT_UNFIT],
    ["instrument not fit at observation time", (o) => { o.instrument.fitUntil = "2026-09-01T00:00:00Z"; }, EIE_REASON.INSTRUMENT_UNFIT],
    ["location basis missing", (o) => { delete o.location.basis; }, EIE_REASON.LOCATION_BASIS_MISSING],
    ["location basis ref blank", (o) => { o.location.basis.ref = ""; }, EIE_REASON.LOCATION_BASIS_MISSING],
    ["airflow without a governed method", (o) => { o.channel = "AIRFLOW"; o.location.basis.kind = "OEM_CITATION"; }, EIE_REASON.LOCATION_BASIS_MISSING],
    ["adapter version missing", (o) => { delete o.adapterVersion; }, EIE_REASON.FIELD_MISSING],
    ["acquisition method missing", (o) => { delete o.acquisitionMethod; }, EIE_REASON.FIELD_MISSING],
  ];
  it.each(provenance)("missing required provenance fails closed: %s", (_name, mutate, code) => {
    const input = mutable(base) as Record<string, any>;
    mutate(input);
    const result = validateObservation(input, "SIMULATION");
    expect(result.ok).toBe(false);
    expect(result.reasonCodes).toContain(code);
  });

  it("a rejected observation is preserved as a rejected submission and never admitted as evidence", async () => {
    const bad = { ...mutable(base), unit: "" };
    const { recorder, windowId, outcomes } = await recordStream([bad as NodeObservation]);
    expect(outcomes[0]).toMatchObject({ accepted: false, record: { kind: "REJECTED_SUBMISSION", reasonCodes: [EIE_REASON.UNIT_UNDECLARED], continuityEffect: "NONE" } });
    const window = (await recorder.getWindow(windowId))!;
    expect(window.entries).toHaveLength(0);
    expect(window.events).toHaveLength(1);
    expect((window.events[0] as { submission: unknown }).submission).toEqual(bad);
    expect(window.continuityStatus).toBe("INTACT");
  });

  it("schema and validator agree on valid simulated observations", () => {
    const validate = new Ajv2020({ allErrors: true, strict: false }).compile(observationSchema);
    for (const o of simulatedStream()) {
      expect(validate(o)).toBe(true);
      expect(validateObservation(o, "SIMULATION").ok).toBe(true);
    }
  });
});

describe("Simulation boundary (s20)", () => {
  it("simulated observations remain explicitly SIMULATED through recording and sealing", async () => {
    const { window } = await sealedStream();
    expect(window.recorderMode).toBe("SIMULATION");
    expect(window.entries.length).toBeGreaterThan(0);
    for (const entry of window.entries) {
      if (entry.kind !== "OBSERVATION") continue;
      expect(entry.observation.acquisitionMethod).toBe("SIMULATED");
      expect(entry.observation.sourceQuality).toBe("SIMULATED");
    }
  });
  it("SIMULATED observations are rejected in production", () => {
    const result = validateObservation(simulatedStream()[0], "PRODUCTION");
    expect(result.ok).toBe(false);
    expect(result.reasonCodes).toContain(EIE_REASON.SIMULATED_IN_PRODUCTION);
  });
  it("a production Recorder cannot open a window on a synthetic profile or a development key", async () => {
    const { recorder } = makeRecorder({ mode: "PRODUCTION" });
    const result = await recorder.openWindow(baselineRequest(), TECH);
    expect(result).toMatchObject({ opened: false });
    expect(!result.opened && result.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.PROFILE_NOT_GOVERNED, EIE_REASON.SEAL_SIGNER_UNAVAILABLE]));
  });
});

describe("Recorder evidence window (s03): chain, sequence, chronology", () => {
  it("a sealed window verifies and validates against the window schema", async () => {
    const { window } = await sealedStream();
    expect(verifyWindow(window, RESOLVE_KEY)).toEqual({ valid: true, sealed: true, reasonCodes: [] });
    expect(window).toMatchObject({ continuityStatus: "INTACT", closeTrigger: { type: "DECLARED_END_OF_PURPOSE", by: TECH } });
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    ajv.addSchema(observationSchema);
    expect(ajv.validate(windowSchema, window)).toBe(true);
  });

  it("each entry links to its predecessor; the first links to the window header", async () => {
    const { window } = await sealedStream();
    expect(window.entries[0].prevEntryHash).toBe(window.headerHash);
    window.entries.slice(1).forEach((e, i) => expect(e.prevEntryHash).toBe(window.entries[i].entryHash));
    expect(window.lastEntryHash).toBe(window.entries.at(-1)!.entryHash);
  });

  it("reordered evidence is detectable", async () => {
    const { window } = await sealedStream();
    const swappedArray = mutable(window) as EvidenceWindow;
    [swappedArray.entries[1], swappedArray.entries[2]] = [swappedArray.entries[2], swappedArray.entries[1]];
    expect(verifyWindow(swappedArray, RESOLVE_KEY).reasonCodes).toContain(EIE_REASON.LINEAGE_BROKEN);

    const swappedSeq = mutable(window) as EvidenceWindow;
    const [a, b] = [swappedSeq.entries[1], swappedSeq.entries[2]];
    [a.windowSeq, b.windowSeq] = [b.windowSeq, a.windowSeq];
    swappedSeq.entries.sort((x, y) => x.windowSeq - y.windowSeq);
    const result = verifyWindow(swappedSeq, RESOLVE_KEY);
    expect(result.valid).toBe(false);
    expect(result.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.LINEAGE_BROKEN, EIE_REASON.HASH_MISMATCH]));
  });

  it("deleted evidence breaks continuity of the chain", async () => {
    const { window } = await sealedStream();
    const deleted = mutable(window) as EvidenceWindow;
    deleted.entries.splice(1, 1);
    const result = verifyWindow(deleted, RESOLVE_KEY);
    expect(result.valid).toBe(false);
    expect(result.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.LINEAGE_BROKEN, EIE_REASON.SEAL_MISMATCH]));

    const truncated = mutable(window) as EvidenceWindow;
    truncated.entries.pop();
    expect(verifyWindow(truncated, RESOLVE_KEY).reasonCodes).toContain(EIE_REASON.LINEAGE_BROKEN);
  });

  it("a stream that falls silent before closure is a gap at seal time", async () => {
    const run = await recordStream(simulatedStream().slice(0, 1));
    run.time.set(400);
    const closed = await run.recorder.closeWindow(run.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
    expect(closed.closed && closed.window.continuityStatus).toBe("BROKEN");
    expect(closed.closed && closed.window.gaps[0]).toMatchObject({ gapType: "TIME_GAP", before: null });
  });
});

describe("Backdating and replay cannot rewrite chronology", () => {
  const stream = simulatedStream();

  it("an observation dated before the window opened is rejected and preserved as an attempt", async () => {
    const { recorder, time } = makeRecorder({ startSeconds: 60 });
    const opened = await recorder.openWindow(baselineRequest(), TECH);
    if (!opened.opened) throw new Error();
    time.set(61);
    const outcome = await recorder.submitObservation(opened.windowId, stream[0], NODE); // observed at t=10
    expect(outcome.accepted).toBe(false);
    expect(outcome.reasonCodes).toContain(EIE_REASON.CHRONOLOGY_VIOLATION);
    expect((await recorder.getWindow(opened.windowId))!.events[0].kind).toBe("REJECTED_SUBMISSION");
  });

  it("an exact replay is rejected; a replay with changed content is also flagged as a hash mismatch", async () => {
    const run = await recordStream(stream.slice(0, 2));
    expect((await run.recorder.submitObservation(run.windowId, stream[0], NODE)).reasonCodes).toContain(EIE_REASON.REPLAY);
    const rewritten = { ...stream[1], value: 80 };
    expect((await run.recorder.submitObservation(run.windowId, rewritten, NODE)).reasonCodes)
      .toEqual(expect.arrayContaining([EIE_REASON.REPLAY, EIE_REASON.HASH_MISMATCH]));
    const window = (await run.recorder.getWindow(run.windowId))!;
    expect(window.entries.map((e) => e.kind === "OBSERVATION" && e.observation.value)).toEqual([75.1, 75.0]);
  });

  it("a replay into a later window is still a replay", async () => {
    const run = await recordStream(stream.slice(0, 1));
    run.time.set(20);
    await run.recorder.closeWindow(run.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
    const next = await run.recorder.openWindow(baselineRequest({ predecessorWindowIds: [run.windowId] }), TECH);
    if (!next.opened) throw new Error(`${next.reasonCodes}`);
    expect((await run.recorder.submitObservation(next.windowId, stream[0], NODE)).reasonCodes).toContain(EIE_REASON.REPLAY);
  });

  it("sequence regression and time regression within a stream are chronology violations", async () => {
    const run = await recordStream(stream.slice(0, 2));
    const regressed = { ...stream[2], observationId: "SIM-NEW-1", sequence: 100 };
    expect((await run.recorder.submitObservation(run.windowId, regressed, NODE)).reasonCodes).toContain(EIE_REASON.CHRONOLOGY_VIOLATION);
    const earlier = { ...stream[2], observedAt: at(20), receivedAt: at(20) };
    expect((await run.recorder.submitObservation(run.windowId, earlier, NODE)).reasonCodes).toContain(EIE_REASON.CHRONOLOGY_VIOLATION);
  });

  it("future-dated and stale observations are rejected against the Recorder clock", async () => {
    const { recorder, time } = makeRecorder();
    const opened = await recorder.openWindow(baselineRequest(), TECH);
    if (!opened.opened) throw new Error();
    time.set(0);
    expect((await recorder.submitObservation(opened.windowId, stream[0], NODE)).reasonCodes).toContain(EIE_REASON.CHRONOLOGY_VIOLATION);
    time.set(1000);
    expect((await recorder.submitObservation(opened.windowId, stream[1], NODE)).reasonCodes).toContain(EIE_REASON.STALE);
  });

  it("the Recorder refuses to record if its own clock runs backwards", async () => {
    const run = await recordStream(stream.slice(0, 2));
    run.time.set(5);
    await expect(run.recorder.submitObservation(run.windowId, stream[2], NODE)).rejects.toThrow(/backwards/);
  });

  it("backdating a recorded time in an exported window is detected", async () => {
    const { window } = await sealedStream();
    const backdated = mutable(window) as EvidenceWindow;
    backdated.entries[2].recordedAt = at(1);
    expect(verifyWindow(backdated, RESOLVE_KEY).reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.HASH_MISMATCH, EIE_REASON.CHRONOLOGY_VIOLATION]));
  });
});

describe("Correction by new entry", () => {
  it("a correction is a new entry referencing the corrected entry; the original is preserved unchanged", async () => {
    const run = await recordStream(simulatedStream().slice(0, 2));
    const original = (await run.recorder.getWindow(run.windowId))!.entries[0];
    const replacement = { ...simulatedStream()[0], observationId: "SIM-CORRECTED-100", value: 75.3 };
    const outcome = await run.recorder.submitCorrection(run.windowId, {
      correctsWindowId: run.windowId, correctsEntryHash: original.entryHash, reason: "transcription error (synthetic)", replacement,
    }, NODE);
    expect(outcome).toMatchObject({ accepted: true, record: { kind: "CORRECTION", correctsEntryHash: original.entryHash, submittedBy: NODE } });
    const window = (await run.recorder.getWindow(run.windowId))!;
    expect(window.entries[0]).toEqual(original);
    expect(window.entries).toHaveLength(3);
    expect(verifyWindow(window, RESOLVE_KEY).valid).toBe(true);
  });

  it("a correction may reference a sealed predecessor window, which stays unchanged", async () => {
    const { recorder, time, window: sealed } = await sealedStream();
    time.set(210);
    const next = await recorder.openWindow(baselineRequest({ predecessorWindowIds: [sealed.windowId] }), TECH);
    if (!next.opened) throw new Error(`${next.reasonCodes}`);
    expect(next.window.predecessorSealHashes).toEqual([sealed.sealHash]);
    const outcome = await recorder.submitCorrection(next.windowId, {
      correctsWindowId: sealed.windowId, correctsEntryHash: sealed.entries[1].entryHash, reason: "retraction (synthetic)", replacement: null,
    }, TECH);
    expect(outcome.accepted).toBe(true);
    expect(await recorder.getWindow(sealed.windowId)).toEqual(sealed);
  });

  it("a correction of an unknown entry or of a different measurement stream is rejected", async () => {
    const run = await recordStream(simulatedStream().slice(0, 1));
    const unknown = await run.recorder.submitCorrection(run.windowId, {
      correctsWindowId: run.windowId, correctsEntryHash: "0".repeat(64), reason: "x", replacement: null,
    }, NODE);
    expect(unknown.reasonCodes).toContain(EIE_REASON.LINEAGE_BROKEN);
    const target = (await run.recorder.getWindow(run.windowId))!.entries[0];
    const otherStream = { ...simulatedStream()[0], observationId: "SIM-OTHER", channel: "SUPPLY_DRY_BULB" as const };
    const crossed = await run.recorder.submitCorrection(run.windowId, {
      correctsWindowId: run.windowId, correctsEntryHash: target.entryHash, reason: "x", replacement: otherStream,
    }, NODE);
    expect(crossed.reasonCodes).toContain(EIE_REASON.LINEAGE_BROKEN);
  });
});

describe("Actor versus historian", () => {
  it("an actor cannot silently rewrite its own recorded history", async () => {
    const { recorder, windowId } = await recordStream();
    const window = (await recorder.getWindow(windowId))!;
    expect(Object.isFrozen(window.entries[0])).toBe(true);
    expect(() => { (window.entries[0] as { submittedBy: unknown }).submittedBy = TECH; }).toThrow(TypeError);
    expect(() => { (window.entries[0] as { observation: { value: number } }).observation.value = 1; }).toThrow(TypeError);
    expect(await recorder.getWindow(windowId)).toEqual(window);

    const edited = mutable(window) as EvidenceWindow;
    (edited.entries[0] as { observation: { value: number } }).observation.value = 99;
    expect(verifyWindow(edited, RESOLVE_KEY).reasonCodes).toContain(EIE_REASON.HASH_MISMATCH);
  });

  it("neither the Recorder nor the store has any update or delete operation", () => {
    const names = (proto: object) => Object.getOwnPropertyNames(proto).filter((n) => n !== "constructor");
    expect(names(EvidenceRecorder.prototype).sort()).toEqual([
      "closeIfTimedOut", "closeWindow", "getWindow", "openWindow", "recordGateAEvaluation", "recordMaterialChange",
      "submitCorrection", "submitEvent", "submitObservation",
    ]);
    expect(names(InMemoryEvidenceStore.prototype).sort()).toEqual([
      "appendRecord", "appendSeal", "appendWindow", "findObservation", "listWindowIds", "readRecords", "readSeal", "readWindow",
    ]);
  });

  it("the store refuses appends that break linkage, replay an observation, or follow a seal", async () => {
    const { window } = await sealedStream();
    const store = new InMemoryEvidenceStore();
    const { windowId, headerHash, entries } = window;
    const exportOnly = new Set(["windowId", "headerHash", "entries", "events", "gaps", "closeTrigger", "closedAt", "continuityStatus", "lastEntryHash", "sealHash", "recorderSignature"]);
    const header = Object.fromEntries(Object.entries(window).filter(([k]) => !exportOnly.has(k))) as unknown as WindowHeader;
    await store.appendWindow(windowId, header, headerHash);
    await expect(store.appendRecord(entries[1])).rejects.toThrow(AppendOnlyViolation);
    await store.appendRecord(entries[0]);
    await expect(store.appendWindow(windowId, header, headerHash)).rejects.toThrow(AppendOnlyViolation);
    const seal = { windowId, closeTrigger: window.closeTrigger!, closedAt: window.closedAt!, continuityStatus: "INTACT" as const, sealHash: window.sealHash!, recorderSignature: window.recorderSignature! };
    await expect(store.appendSeal({ ...seal, lastEntryHash: headerHash })).rejects.toThrow(AppendOnlyViolation);
    await store.appendSeal({ ...seal, lastEntryHash: entries[0].entryHash });
    await expect(store.appendRecord(entries[1])).rejects.toThrow(AppendOnlyViolation);
  });

  it("submissions are attributed to the authenticated submitter; forged attribution is rejected", async () => {
    const run = await recordStream(simulatedStream().slice(0, 1));
    const forged = await run.recorder.submitEvent(run.windowId, { actor: NODE, eventKind: "NOTE", payload: { text: "synthetic" } }, TECH);
    expect(forged).toMatchObject({ accepted: false, reasonCodes: [EIE_REASON.ATTRIBUTION_MISMATCH] });
    const byTechnician = await run.recorder.submitObservation(run.windowId, simulatedStream()[1], TECH);
    expect(byTechnician.reasonCodes).toContain(EIE_REASON.ATTRIBUTION_MISMATCH);
    const own = await run.recorder.submitEvent(run.windowId, { actor: TECH, eventKind: "NOTE", payload: { text: "synthetic" } }, TECH);
    expect(own).toMatchObject({ accepted: true, record: { kind: "EVENT", actor: TECH, submittedBy: TECH } });
  });

  it("Analyzer and Governor submissions are not enabled in Phase 1", async () => {
    const run = await recordStream(simulatedStream().slice(0, 1));
    for (const role of ["ANALYZER", "GOVERNOR"] as const) {
      const actor = { role, id: `${role}-1` };
      expect((await run.recorder.submitEvent(run.windowId, { actor, eventKind: "X", payload: {} }, actor)).reasonCodes).toContain(EIE_REASON.ROLE_NOT_ENABLED);
      expect(await run.recorder.openWindow(baselineRequest(), actor)).toMatchObject({ opened: false, reasonCodes: [EIE_REASON.ROLE_NOT_ENABLED] });
    }
  });
});

describe("Governed window opening and closing", () => {
  it("each trigger opens only its frozen purpose", async () => {
    const { recorder } = makeRecorder();
    expect(await recorder.openWindow(baselineRequest({ purpose: "CONTINUOUS" }), TECH)).toMatchObject({ opened: false, reasonCodes: [EIE_REASON.TRIGGER_INVALID] });
    expect((await recorder.openWindow(baselineRequest({ purpose: "CONTINUOUS", openTrigger: { type: "SCHEDULE", ref: "SCHED-1" } }), TECH)).opened).toBe(true);
    expect((await recorder.openWindow(baselineRequest({ openTrigger: { type: "SESSION_START", ref: "" } }), TECH)).opened).toBe(false);
  });

  it("a window cannot open without a valid continuity profile", async () => {
    const { recorder } = makeRecorder();
    expect(await recorder.openWindow(baselineRequest({ continuityProfile: undefined as never }), TECH)).toMatchObject({ opened: false, reasonCodes: [EIE_REASON.PROFILE_INVALID] });
    expect((await recorder.openWindow(baselineRequest({ continuityProfile: profileWith({ profileId: "" }) }), TECH)).opened).toBe(false);
  });

  it("predecessor windows must exist and be sealed", async () => {
    const { recorder } = makeRecorder();
    const open = await recorder.openWindow(baselineRequest(), TECH);
    if (!open.opened) throw new Error();
    expect(await recorder.openWindow(baselineRequest({ predecessorWindowIds: ["EIE-WIN-unknown"] }), TECH)).toMatchObject({ reasonCodes: [EIE_REASON.LINEAGE_BROKEN] });
    expect(await recorder.openWindow(baselineRequest({ predecessorWindowIds: [open.windowId] }), TECH)).toMatchObject({ reasonCodes: [EIE_REASON.LINEAGE_BROKEN] });
  });

  it("observations outside admitted channels or sources are rejected without degrading continuity", async () => {
    const run = await recordStream(simulatedStream().slice(0, 1));
    const otherChannel = simulatedStream({ channel: "OUTDOOR_DRY_BULB" })[1];
    expect((await run.recorder.submitObservation(run.windowId, otherChannel, NODE)).reasonCodes).toContain(EIE_REASON.CHANNEL_NOT_ADMITTED);
    const otherSource = simulatedStream({ deviceId: "SIM-PROBE-99" })[1];
    expect((await run.recorder.submitObservation(run.windowId, otherSource, NODE)).reasonCodes).toContain(EIE_REASON.SOURCE_NOT_ADMITTED);
    expect((await run.recorder.getWindow(run.windowId))!.continuityStatus).toBe("INTACT");
  });

  it("closure requires a defined trigger; continuity break and timeout are Recorder-internal", async () => {
    const { recorder, windowId } = await recordStream(simulatedStream().slice(0, 1));
    expect(await recorder.closeWindow(windowId, { type: "CONTINUITY_BREAK" as never, ref: null }, TECH)).toMatchObject({ closed: false, reasonCodes: [EIE_REASON.TRIGGER_INVALID] });
    expect(await recorder.closeWindow(windowId, { type: "NEXT_LIFECYCLE_RECEIPT", ref: null }, TECH)).toMatchObject({ closed: false });
    expect((await recorder.closeWindow(windowId, { type: "NEXT_LIFECYCLE_RECEIPT", ref: "RECEIPT-SYNTHETIC-1" }, TECH)).closed).toBe(true);
    expect(await recorder.closeWindow(windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH)).toMatchObject({ closed: false, reasonCodes: [EIE_REASON.WINDOW_CLOSED] });
  });

  it("golden replay: identical inputs reproduce identical window ids, entry hashes and seal hashes", async () => {
    const first = (await sealedStream()).window;
    const second = (await sealedStream()).window;
    expect(second.windowId).toBe(first.windowId);
    expect(second.entries.map((e) => e.entryHash)).toEqual(first.entries.map((e) => e.entryHash));
    expect(second.sealHash).toBe(first.sealHash);
  });

  it("a seal signed by another key, an unknown key id, or a forged seal hash fails verification", async () => {
    const { window } = await sealedStream();
    const other = generateDevelopmentSigningKey("OTHER").publicKeyPem;
    expect(verifyWindow(window, () => other).reasonCodes).toEqual([EIE_REASON.SIGNATURE_INVALID]);
    expect(verifyWindow(window, () => undefined).reasonCodes).toEqual([EIE_REASON.SIGNATURE_INVALID]);
    const forged = mutable(window) as EvidenceWindow;
    forged.sealHash = "f".repeat(64);
    expect(verifyWindow(forged, RESOLVE_KEY).reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.SEAL_MISMATCH, EIE_REASON.SIGNATURE_INVALID]));
  });
});

describe("Phase 1 source derives nothing and authorizes nothing", () => {
  it("pressure observed outside a PRESSURE_EVIDENCE window is recorded as premature entry and never admitted", async () => {
    const { recorder, time } = makeRecorder();
    const opened = await recorder.openWindow(baselineRequest(), TECH);
    if (!opened.opened) throw new Error();
    time.set(11);
    const pressure = { ...simulatedStream()[0], observationId: "SIM-PRESSURE-1", channel: "SUCTION_PRESSURE" as const, unit: "psig", value: 118 };
    const outcome = await recorder.submitObservation(opened.windowId, pressure, NODE);
    expect(outcome).toMatchObject({ accepted: false, record: { kind: "PREMATURE_PRESSURE_ENTRY" }, reasonCodes: [EIE_REASON.PRESSURE_OUTSIDE_WINDOW] });
    const window = (await recorder.getWindow(opened.windowId))!;
    expect(window.entries).toHaveLength(0);
    expect(window.events[0]).toMatchObject({ kind: "PREMATURE_PRESSURE_ENTRY", observation: { channel: "SUCTION_PRESSURE" } });
  });

  it("a non-pressure window cannot admit refrigerant pressure channels", async () => {
    const { recorder } = makeRecorder();
    expect(await recorder.openWindow(baselineRequest({ admittedChannels: ["SUCTION_PRESSURE"] }), TECH)).toMatchObject({ opened: false, reasonCodes: [EIE_REASON.CHANNEL_NOT_ADMITTED] });
  });

  it("Gate B commitment and Governor termination triggers cannot open any window in Phase 1", async () => {
    const { recorder } = makeRecorder();
    for (const [type, purpose] of [["GATE_B_COMMIT", "EXECUTION"], ["GOVERNOR_TERMINATION", "POST_STABILIZATION"], ["GOVERNOR_TERMINATION", "POST_VERIFICATION"]] as const) {
      expect(await recorder.openWindow(baselineRequest({ purpose, openTrigger: { type, ref: "SYNTHETIC" } }), TECH)).toMatchObject({ opened: false, reasonCodes: [EIE_REASON.TRIGGER_INVALID] });
    }
  });

  it("Recorder-authored window fields carry no determination, authority, commitment or execution field", async () => {
    const { window } = await sealedStream();
    const keys = new Set<string>();
    const walk = (value: unknown) => {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) { keys.add(k); walk(v); }
    };
    walk(window);
    const forbidden = [...keys].filter((k) => /determin|authori|allow|gate_?b|commit|execut|command|diagnos|admissib|verdict/i.test(k));
    expect(forbidden).toEqual([]);
    const exported = Object.keys(eie).filter((k) => /authori|allow|determin|diagnos|command|execut|commit/i.test(k));
    expect(exported).toEqual([]);
  });

  it("Phase 1 source derives nothing and holds no HVACD/R thresholds (T27-style static checks)", () => {
    const dir = new URL("../../packages/domain/eie/", import.meta.url);
    const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
    expect(files.sort()).toEqual([
      "chain.ts", "continuity-profile.ts", "gate-a-binding.ts", "index.ts", "observation.ts", "reason-codes.ts", "recorder.ts",
      "signer.ts", "simulated-node.ts", "spec-guard.ts", "store.ts", "time.ts", "types.ts", "verify.ts",
    ]);
    const code = (file: string) => readFileSync(new URL(file, dir), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    const all = files.map(code).join("\n");
    expect(all).not.toMatch(/enthalp|psychrometr|superheat|subcool|sensible|latent|capacity|drift|stabilit|converg|dew.?point|wet.?bulb.?calc|Math\.(exp|log|pow)/i);
    // time.ts defines the ISO 8601 format and milliseconds per second; those are formats and units, not thresholds.
    const literals = files.filter((f) => f !== "time.ts").map(code).join("\n")
      .replace(/"[^"\n]*"|`[^`\n]*`/g, "")
      .match(/(?<![\w.$-])\d[\d_]*(\.\d+)?(?![\w])/g) ?? [];
    expect([...new Set(literals)].sort()).toEqual(["0", "1"]);
  });
});
