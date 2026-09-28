/**
 * TA-14-EIE-ARCH-1.0 Phase 2A: Analyzer calculation contract + CRR-1 reference registry shell.
 *
 * SEALED EVIDENCE -> GOVERNED CALCULATION -> ATTRIBUTABLE CALCULATION RESULT.
 * Every promoted reference here is SYNTHETIC and SIMULATION ONLY. No real reference is promoted.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  EIE_REASON, InMemoryEvidenceStore, objectHash,
  type ChainRecord, type NodeObservation, type ObservationRecord, type RecorderSealSigner,
} from "../../packages/domain/eie";
import {
  ANALYZER_VERSION, buildRegistry, calculate, CRR_TA14_WINDOW_STATISTICS_1, EIE_CALCULATION_CATALOGUE, PRODUCTION_CRR_1,
  PRODUCTION_CRR_ENTRIES, PRODUCTION_CRR_EVENTS, recorderEvidenceReader, verifyCalculation, WINDOW_STATISTICS_FUNCTION,
  WINDOW_STATISTICS_IMPLEMENTATION,
  type AnalyzerContext, type CalculationRequest, type CalculationResult, type CrrEvent, type InputBinding,
} from "../../packages/domain/eie/analyzer";
import spec from "../../docs/eie/TA-14-EIE-ARCH-1.0.spec.json";
import crrSchema from "../../schemas/eie-crr-entry.schema.json";
import resultSchema from "../../schemas/eie-calculation-result.schema.json";
import {
  DEV_SIGNER, NODE, RESOLVE_KEY, SOURCE, TECH, at, baselineRequest, makeRecorder, profileWith, simulatedStream,
} from "./fixtures/eie-simulated";
import {
  promotion, SIMULATION_CATALOGUE, simulationRegistry, SYN_ACTORS, SYN_DIFFERENCE_FUNCTION, SYN_DIFFERENCE_REF, SYN_MEAN_FUNCTION,
  SYN_MEAN_REF, SYN_WINDOW_STATISTICS_REF, SYNTHETIC_ENTRIES,
} from "./fixtures/eie-synthetic-references";

const ANALYZER = { role: "ANALYZER" as const, id: "EIE-ANALYZER-SIM-01" };
const mutable = <T>(value: T): T => structuredClone(value) as T;
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validCrrEntry = ajv.compile(crrSchema);
const validResult = ajv.compile(resultSchema);

type Run = ReturnType<typeof makeRecorder>;

/** Records the given streams (merged by source time) into a baseline window and seals it. */
async function sealedWindow(streams: NodeObservation[][], opts: Parameters<typeof makeRecorder>[0] & { run?: Run; keepOpen?: boolean; assetId?: string } = {}) {
  const run = opts.run ?? makeRecorder(opts);
  const opened = await run.recorder.openWindow(baselineRequest({ assetId: opts.assetId ?? "ASSET-SYNTHETIC-01" }), TECH);
  if (!opened.opened) throw new Error(`${opened.reasonCodes}`);
  const all = streams.flat().sort((a, b) => Date.parse(a.observedAt) - Date.parse(b.observedAt));
  for (const o of all) {
    run.time.set((Date.parse(o.observedAt) - Date.parse(at(0))) / 1000 + 1);
    await run.recorder.submitObservation(opened.windowId, o, NODE);
  }
  if (!opts.keepOpen) {
    run.time.set(Math.max(...all.map((o) => (Date.parse(o.observedAt) - Date.parse(at(0))) / 1000)) + 10);
    await run.recorder.closeWindow(opened.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
  }
  return { ...run, windowId: opened.windowId };
}

function context(run: Run, overrides: Partial<AnalyzerContext> = {}): AnalyzerContext {
  return {
    analyzerId: ANALYZER.id, mode: "SIMULATION", registry: simulationRegistry(), catalogue: SIMULATION_CATALOGUE,
    evidence: recorderEvidenceReader(run.recorder, run.store), resolveRecorderKey: RESOLVE_KEY, ...overrides,
  };
}

const channel = (windowId: string, name = "series", ch: NodeObservation["channel"] = "RETURN_DRY_BULB"): InputBinding =>
  ({ kind: "WINDOW_CHANNEL", name, windowId, channel: ch, source: SOURCE });

const statsRequest = (windowId: string, referenceId = SYN_WINDOW_STATISTICS_REF.referenceId): CalculationRequest => ({
  functionId: WINDOW_STATISTICS_FUNCTION.functionId, functionVersion: WINDOW_STATISTICS_FUNCTION.functionVersion, referenceId,
  inputs: [channel(windowId)], requestedBy: ANALYZER,
});
const meanRequest = (windowId: string, ch: NodeObservation["channel"] = "RETURN_DRY_BULB"): CalculationRequest => ({
  functionId: SYN_MEAN_FUNCTION.functionId, functionVersion: SYN_MEAN_FUNCTION.functionVersion, referenceId: SYN_MEAN_REF.referenceId,
  inputs: [channel(windowId, "series", ch)], requestedBy: ANALYZER,
});

afterEach(() => { vi.useRealTimers(); });

// ─────────────────────────────── CRR-1 registry shell ───────────────────────────────

describe("CRR-1 production registry (fail-closed)", () => {
  it("ships the two frozen s05 candidates and the TA-14 window-statistics method, all CANDIDATE", () => {
    expect(Object.keys(PRODUCTION_CRR_1.entries).sort()).toEqual(["CRR-PSY-ASHRAE-F2025-CH1", "CRR-REF-NIST-REFPROP-10.0", "CRR-TA14-WINDOW-STATISTICS-1"]);
    expect(PRODUCTION_CRR_1.refused).toEqual([]);
    for (const state of Object.values(PRODUCTION_CRR_1.states)) {
      expect(state).toMatchObject({
        possessionAndUseBasis: { status: "NOT_ESTABLISHED" }, review: { state: "NOT_REVIEWED" }, conformance: { state: "NOT_TESTED" },
        pin: { state: "NOT_PINNED" }, activation: { state: "CANDIDATE" }, supersededBy: null, refusedEvents: [],
      });
    }
    for (const c of spec.s05_calculation.candidateEntries) {
      expect(PRODUCTION_CRR_1.entries[c.referenceId].entry.kind).toBe("EXTERNAL");
      expect(PRODUCTION_CRR_1.states[c.referenceId].possessionAndUseBasis.status).toBe(c.possessionAndUse);
    }
  });

  it("every production entry validates, records no possessed content for external references, and is frozen", () => {
    for (const entry of PRODUCTION_CRR_ENTRIES) expect(validCrrEntry(entry)).toBe(true);
    for (const entry of PRODUCTION_CRR_ENTRIES.filter((e) => e.kind === "EXTERNAL")) {
      expect(entry).toMatchObject({ methodOrEquations: { status: "NOT_ESTABLISHED" }, validDomain: { status: "NOT_ESTABLISHED" }, implementation: null, contentIdentity: { sha256: null }, acquisition: { method: "NOT_ACQUIRED" } });
    }
    expect(() => { (PRODUCTION_CRR_1.states["CRR-TA14-WINDOW-STATISTICS-1"].activation as { state: string }).state = "ACTIVE"; }).toThrow(TypeError);
    expect(() => { (PRODUCTION_CRR_1.entries as Record<string, unknown>)["CRR-X"] = {}; }).toThrow(TypeError);
    expect(() => { (PRODUCTION_CRR_ENTRIES[0] as { title: string }).title = "x"; }).toThrow(TypeError);
  });

  it("the production registry refuses every promotion event and every synthetic entry", () => {
    const attempted = buildRegistry([...PRODUCTION_CRR_ENTRIES, SYN_MEAN_REF], [...PRODUCTION_CRR_EVENTS, ...promotion(CRR_TA14_WINDOW_STATISTICS_1).slice(1), ...promotion(SYN_MEAN_REF)], "PRODUCTION");
    expect(attempted.refused).toEqual([{ referenceId: SYN_MEAN_REF.referenceId, reasonCodes: [EIE_REASON.REF_SYNTHETIC_IN_PRODUCTION] }]);
    const state = attempted.states["CRR-TA14-WINDOW-STATISTICS-1"];
    expect(state.activation.state).toBe("CANDIDATE");
    expect(state.refusedEvents.map((r) => r.reasonCodes)).toEqual(Array(5).fill([EIE_REASON.REF_PROMOTION_ATTESTATION_NOT_GOVERNED]));
  });

  it("no real reference (external or TA-14-authored) can be promoted, even in simulation", () => {
    const events = PRODUCTION_CRR_ENTRIES.flatMap((e) => promotion(e).slice(1));
    const registry = buildRegistry(PRODUCTION_CRR_ENTRIES, [...PRODUCTION_CRR_EVENTS, ...events], "SIMULATION");
    for (const state of Object.values(registry.states)) {
      expect(state.activation.state).toBe("CANDIDATE");
      expect(state.refusedEvents).toHaveLength(5);
      expect(state.refusedEvents.every((r) => r.reasonCodes[0] === EIE_REASON.REF_PROMOTION_REFUSED)).toBe(true);
    }
  });

  it("the window-statistics implementation identity is the SHA-256 of its source file", () => {
    const file = readFileSync(new URL("../../packages/domain/eie/analyzer/functions/window-statistics.ts", import.meta.url));
    expect(createHash("sha256").update(file).digest("hex")).toBe(WINDOW_STATISTICS_IMPLEMENTATION.fileHash);
    expect(CRR_TA14_WINDOW_STATISTICS_1.implementation).toEqual(WINDOW_STATISTICS_IMPLEMENTATION);
  });
});

describe("CRR-1 promotion state model (SYNTHETIC only)", () => {
  const promoted = (events: CrrEvent[]) => buildRegistry([SYN_MEAN_REF], events, "SIMULATION").states[SYN_MEAN_REF.referenceId];

  it("all five s05 prerequisites plus owner activation make a SYNTHETIC entry ACTIVE", () => {
    expect(promoted(promotion(SYN_MEAN_REF))).toMatchObject({
      possessionAndUseBasis: { status: "ESTABLISHED", evidenceRef: "SYNTHETIC-POSSESSION-EVIDENCE" }, review: { state: "APPROVED", reviewedBy: "SYN-REVIEWER" },
      conformance: { state: "PASSED" }, pin: { state: "PINNED" }, activation: { state: "ACTIVE", activatedBy: "SYN-OWNER" },
    });
  });

  it.each(["POSSESSION_ESTABLISHED", "REVIEWED", "CONFORMANCE_PASSED", "PINNED"])("without %s the entry stays CANDIDATE", (missing) => {
    const state = promoted(promotion(SYN_MEAN_REF).filter((e) => e.type !== missing));
    expect(state.activation.state).toBe("CANDIDATE");
    expect(state.refusedEvents.at(-1)).toMatchObject({ event: { type: "ACTIVATED" }, reasonCodes: [EIE_REASON.REF_NOT_ACTIVATED] });
  });

  it("the registrant cannot review its own entry; a non-owner cannot activate; activation before prerequisites is refused", () => {
    const events = promotion(SYN_MEAN_REF);
    const selfReview = events.map((e) => (e.type === "REVIEWED" ? { ...e, by: SYN_ACTORS.registrar } : e));
    expect(promoted(selfReview).review.state).toBe("NOT_REVIEWED");
    const nonOwner = events.map((e) => (e.type === "ACTIVATED" ? { ...e, by: SYN_ACTORS.reviewer } : e));
    expect(promoted(nonOwner).activation.state).toBe("CANDIDATE");
    const early = [events[0], events[5], ...events.slice(1, 5)];
    expect(promoted(early).activation.state).toBe("CANDIDATE");
  });

  it("a conformance hash or pin that does not match the registered entry is refused", () => {
    const events = promotion(SYN_MEAN_REF);
    expect(promoted(events.map((e) => (e.type === "CONFORMANCE_PASSED" ? { ...e, implementationFileHash: "0".repeat(64) } : e))).conformance.state).toBe("NOT_TESTED");
    expect(promoted(events.map((e) => (e.type === "PINNED" ? { ...e, entryHash: "0".repeat(64) } : e))).pin.state).toBe("NOT_PINNED");
    const wrongRegistration = buildRegistry([SYN_MEAN_REF], events.map((e) => (e.type === "REGISTERED" ? { ...e, entryHash: "0".repeat(64) } : e)), "SIMULATION");
    expect(wrongRegistration.entries[SYN_MEAN_REF.referenceId]).toBeUndefined();
  });

  it("suspension, retirement and supersession each stop resolution; re-activation restores it", async () => {
    const run = await sealedWindow([simulatedStream()]);
    const at2 = "2026-09-28T16:00:00Z";
    const id = SYN_MEAN_REF.referenceId;
    const suspended: CrrEvent = { type: "SUSPENDED", referenceId: id, reason: "synthetic", by: SYN_ACTORS.owner, at: at2 };
    const reactivated: CrrEvent = { type: "ACTIVATED", referenceId: id, by: SYN_ACTORS.owner, at: at2 };
    const retired: CrrEvent = { type: "RETIRED", referenceId: id, reason: "synthetic", by: SYN_ACTORS.owner, at: at2 };
    const superseded: CrrEvent = { type: "SUPERSEDED", referenceId: id, supersededBy: "CRR-SYNTHETIC-MEAN-2", by: SYN_ACTORS.owner, at: at2 };
    const codesWith = async (extra: CrrEvent[]) => (await calculate(meanRequest(run.windowId), context(run, { registry: simulationRegistry(extra) }))).reasonCodes;
    expect(await codesWith([suspended])).toContain(EIE_REASON.REF_NOT_ACTIVATED);
    expect(await codesWith([suspended, reactivated])).toEqual([]);
    expect(await codesWith([retired])).toContain(EIE_REASON.REF_NOT_ACTIVATED);
    expect(await codesWith([superseded])).toContain(EIE_REASON.REF_SUPERSEDED);
  });
});

// ─────────────────────────────── Frozen catalogue ───────────────────────────────

describe("Frozen s05 catalogue", () => {
  it("the catalogue is exactly the frozen s05 list", () => {
    expect(EIE_CALCULATION_CATALOGUE.map((f) => f.catalogueItem).sort()).toEqual([...spec.s05_calculation.catalogue].sort());
    expect(EIE_CALCULATION_CATALOGUE.filter((f) => f.compute !== null).map((f) => f.functionId)).toEqual(["EIE-FN-WINDOW-STATISTICS"]);
  });

  it("every psychrometric and refrigerant-property calculation is NOT ESTABLISHED: no possessed, activated reference", async () => {
    const run = await sealedWindow([simulatedStream()]);
    for (const fn of EIE_CALCULATION_CATALOGUE.filter((f) => f.compute === null)) {
      const referenceId = fn.role === "PSYCHROMETRIC_PROPERTIES" ? "CRR-PSY-ASHRAE-F2025-CH1" : "CRR-REF-NIST-REFPROP-10.0";
      for (const ctx of [context(run), context(run, { mode: "PRODUCTION", registry: PRODUCTION_CRR_1, catalogue: EIE_CALCULATION_CATALOGUE })]) {
        const result = await calculate({ functionId: fn.functionId, functionVersion: fn.functionVersion, referenceId, inputs: [channel(run.windowId)], requestedBy: ANALYZER }, ctx);
        expect(result).toMatchObject({ status: "NOT_ESTABLISHED", outputs: [] });
        expect(result.reasonCodes).toEqual(expect.arrayContaining([
          EIE_REASON.CALCULATION_NOT_ESTABLISHED, EIE_REASON.CALC_FUNCTION_NOT_IMPLEMENTED, EIE_REASON.REF_NOT_ACTIVATED,
          EIE_REASON.REF_POSSESSION_NOT_ESTABLISHED, EIE_REASON.REF_IMPLEMENTATION_UNVERIFIED,
        ]));
        if (fn.requiresSaturationConvention) expect(result.reasonCodes).toContain(EIE_REASON.REF_CONVENTION_NOT_ESTABLISHED);
        expect(validResult(result)).toBe(true);
      }
    }
  });

  it("TA-14 authorship confers nothing: window statistics under the TA-14 candidate is NOT ESTABLISHED", async () => {
    const run = await sealedWindow([simulatedStream()]);
    const result = await calculate(statsRequest(run.windowId, CRR_TA14_WINDOW_STATISTICS_1.referenceId), context(run));
    expect(result.status).toBe("NOT_ESTABLISHED");
    expect(result.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.REF_NOT_ACTIVATED, EIE_REASON.REF_UNCONFIRMED, EIE_REASON.REF_POSSESSION_NOT_ESTABLISHED]));
    expect(result.reference).toMatchObject({ kind: "TA14_METHOD", activationState: "CANDIDATE" });
  });
});

// ─────────────────────────────── Calculation, lineage, replay ───────────────────────────────

describe("Governed calculation with complete lineage (simulation)", () => {
  it("window statistics over a sealed INTACT window: correct outputs and complete lineage", async () => {
    const run = await sealedWindow([simulatedStream()]);
    const window = (await run.recorder.getWindow(run.windowId))!;
    const result = await calculate(statsRequest(run.windowId), context(run));
    expect(result.status).toBe("ESTABLISHED");
    expect(result.reasonCodes).toEqual([]);
    const byName = Object.fromEntries(result.outputs.map((o) => [o.name, o]));
    expect(byName.count).toMatchObject({ value: 4, unit: "1" });
    expect(byName.minimum).toMatchObject({ value: 74.9, unit: "degF" });
    expect(byName.maximum).toMatchObject({ value: 75.1, unit: "degF" });
    expect(byName.mean.value).toBeCloseTo((75.1 + 75.0 + 74.9 + 74.9) / 4, 12);
    expect(byName.span).toMatchObject({ value: 180, unit: "s" });
    for (const o of result.outputs) expect(o.uncertainty).toEqual({ status: "NOT_PROPAGATED", reason: "NO_UNCERTAINTY_METHOD_ESTABLISHED" });

    expect(result.inputs.windows).toEqual([expect.objectContaining({ windowId: run.windowId, sealHash: window.sealHash, headerHash: window.headerHash, continuityStatus: "INTACT", recorderMode: "SIMULATION" })]);
    const recorded = window.entries.filter((e): e is ObservationRecord => e.kind === "OBSERVATION");
    expect(result.inputs.observations.map((o) => [o.entryHash, o.observationHash, o.observationId])).toEqual(recorded.map((e) => [e.entryHash, e.observationHash, e.observation.observationId]));
    expect(result).toMatchObject({
      evidenceMode: "SIMULATION",
      analyzer: { analyzerId: ANALYZER.id, analyzerVersion: ANALYZER_VERSION, mode: "SIMULATION" },
      function: { functionId: "EIE-FN-WINDOW-STATISTICS", catalogueItem: "declared window statistics", implementation: WINDOW_STATISTICS_IMPLEMENTATION },
      reference: { referenceId: SYN_WINDOW_STATISTICS_REF.referenceId, kind: "SYNTHETIC", entryHash: objectHash(SYN_WINDOW_STATISTICS_REF), activationState: "ACTIVE" },
      request: { requestedBy: ANALYZER },
    });
    expect(result.resultHash).toBe(objectHash({ ...result, resultHash: undefined }));
    expect(validResult(result)).toBe(true);
  });

  it("deterministic replay reproduces the result hash, independent of wall-clock time", async () => {
    const run = await sealedWindow([simulatedStream()]);
    const ctx = context(run);
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2030-01-01T00:00:00Z"));
    const first = await calculate(statsRequest(run.windowId), ctx);
    vi.setSystemTime(new Date("2031-06-01T00:00:00Z"));
    const second = await calculate(statsRequest(run.windowId), ctx);
    expect(second.resultHash).toBe(first.resultHash);
    expect(await verifyCalculation(first, ctx)).toEqual({ valid: true, reasonCodes: [], replayHash: first.resultHash });
  });

  it("an altered result fails integrity; an altered-and-rehashed result fails replay", async () => {
    const run = await sealedWindow([simulatedStream()]);
    const ctx = context(run);
    const result = await calculate(statsRequest(run.windowId), ctx);
    const altered = mutable(result) as CalculationResult;
    altered.outputs[3].value = 99;
    expect(await verifyCalculation(altered, ctx)).toMatchObject({ valid: false, reasonCodes: [EIE_REASON.HASH_MISMATCH] });
    const { resultHash: _h, ...body } = altered;
    const rehashed = { ...body, resultHash: objectHash(body) } as CalculationResult;
    expect(await verifyCalculation(rehashed, ctx)).toMatchObject({ valid: false, reasonCodes: [EIE_REASON.LINEAGE_BROKEN] });
  });

  it("a later correction of an input invalidates replay of an earlier result and fails a new calculation closed", async () => {
    const run = await sealedWindow([simulatedStream()]);
    const ctx = context(run);
    const result = await calculate(statsRequest(run.windowId), ctx);
    const window = (await run.recorder.getWindow(run.windowId))!;
    run.time.set(300);
    const next = await run.recorder.openWindow(baselineRequest({ predecessorWindowIds: [run.windowId] }), TECH);
    if (!next.opened) throw new Error();
    await run.recorder.submitCorrection(next.windowId, { correctsWindowId: run.windowId, correctsEntryHash: window.entries[1].entryHash, reason: "synthetic", replacement: null }, TECH);
    expect((await verifyCalculation(result, ctx)).valid).toBe(false);
    const again = await calculate(statsRequest(run.windowId), ctx);
    expect(again.reasonCodes).toContain(EIE_REASON.CALC_INPUT_CORRECTED);
  });

  it("chained calculation: prior results enter by hash with their outputs and propagated uncertainty", async () => {
    const run = await sealedWindow([simulatedStream(), simulatedStream({ channel: "SUPPLY_DRY_BULB", values: [55.2, 55.0, 54.9, 55.1] })]);
    const ctx = context(run);
    const returnMean = await calculate(meanRequest(run.windowId), ctx);
    const supplyMean = await calculate(meanRequest(run.windowId, "SUPPLY_DRY_BULB"), ctx);
    expect(returnMean.outputs[0].uncertainty).toEqual({ status: "PROPAGATED", methodRef: "SYNTHETIC-WORST-CASE-STATED-ACCURACY", value: 0.5, unit: "degF" });
    const request: CalculationRequest = {
      functionId: SYN_DIFFERENCE_FUNCTION.functionId, functionVersion: SYN_DIFFERENCE_FUNCTION.functionVersion, referenceId: SYN_DIFFERENCE_REF.referenceId,
      inputs: [{ kind: "PRIOR_RESULT", name: "a", resultHash: returnMean.resultHash, output: "mean" }, { kind: "PRIOR_RESULT", name: "b", resultHash: supplyMean.resultHash, output: "mean" }],
      requestedBy: ANALYZER,
    };
    const chained = { ...ctx, priorResults: [returnMean, supplyMean] };
    const difference = await calculate(request, chained);
    expect(difference.status).toBe("ESTABLISHED");
    expect(difference.outputs[0].value).toBeCloseTo(returnMean.outputs[0].value - supplyMean.outputs[0].value, 12);
    expect(difference.outputs[0].uncertainty).toEqual({ status: "PROPAGATED", methodRef: "SYNTHETIC-LINEAR-SUM", value: 1, unit: "degF" });
    expect(difference.inputs.priorResults.map((p) => p.resultHash)).toEqual([returnMean.resultHash, supplyMean.resultHash]);
    expect((await verifyCalculation(difference, chained)).valid).toBe(true);

    const forged = mutable(returnMean) as CalculationResult;
    forged.outputs[0].value = 10;
    const { resultHash: _f, ...forgedBody } = forged;
    const forgedPrior = { ...forgedBody, resultHash: objectHash(forgedBody) } as CalculationResult;
    const withForged = await calculate({ ...request, inputs: [{ ...request.inputs[0], resultHash: forgedPrior.resultHash } as InputBinding, request.inputs[1]] }, { ...ctx, priorResults: [forgedPrior, supplyMean] });
    expect(withForged.reasonCodes).toContain(EIE_REASON.CALC_PRIOR_RESULT_INVALID);
    expect((await calculate(request, ctx)).reasonCodes).toContain(EIE_REASON.CALC_INPUT_MISSING);
  });

  it("uncertainty is propagated only where the governing reference establishes a method and the inputs state one", async () => {
    const run = await sealedWindow([simulatedStream({ accuracyOrUncertainty: null })]);
    const result = await calculate(meanRequest(run.windowId), context(run));
    expect(result.outputs[0].uncertainty).toEqual({ status: "NOT_PROPAGATED", reason: "INPUT_UNCERTAINTY_NOT_STATED" });
  });
});

// ─────────────────────────────── Fail-closed and adversarial ───────────────────────────────

describe("Fail-closed inputs", () => {
  const expectNotEstablished = (result: CalculationResult, ...codes: string[]) => {
    expect(result).toMatchObject({ status: "NOT_ESTABLISHED", outputs: [] });
    expect(result.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.CALCULATION_NOT_ESTABLISHED, ...codes]));
    expect(validResult(result)).toBe(true);
  };

  it("an unsealed window is not a calculation input", async () => {
    const run = await sealedWindow([simulatedStream()], { keepOpen: true });
    expectNotEstablished(await calculate(statsRequest(run.windowId), context(run)), EIE_REASON.CALC_INPUT_UNSEALED);
  });

  it("a window altered at rest, or sealed by an untrusted key, is not verified", async () => {
    class TamperingStore extends InMemoryEvidenceStore {
      override async readRecords(windowId: string): Promise<readonly ChainRecord[]> {
        return (await super.readRecords(windowId)).map((r) => (r.kind === "OBSERVATION" ? { ...r, observation: { ...r.observation, value: 1 } } as ChainRecord : r));
      }
    }
    const tampered = await sealedWindow([simulatedStream()], { store: new TamperingStore() });
    expectNotEstablished(await calculate(statsRequest(tampered.windowId), context(tampered)), EIE_REASON.CALC_INPUT_UNVERIFIED);
    const run = await sealedWindow([simulatedStream()]);
    expectNotEstablished(await calculate(statsRequest(run.windowId), context(run, { resolveRecorderKey: () => undefined })), EIE_REASON.CALC_INPUT_UNVERIFIED);
  });

  it("BROKEN and DEGRADED windows fail closed; the windows themselves are preserved unchanged", async () => {
    const s = simulatedStream();
    const broken = await sealedWindow([[s[0], s[2]]]);
    const brokenWindow = await broken.recorder.getWindow(broken.windowId);
    expect(brokenWindow!.continuityStatus).toBe("BROKEN");
    expectNotEstablished(await calculate(statsRequest(broken.windowId), context(broken)), EIE_REASON.CALC_INPUT_CONTINUITY);
    expect(await broken.recorder.getWindow(broken.windowId)).toEqual(brokenWindow);

    const degraded = await sealedWindow([simulatedStream().slice(0, 2)], { keepOpen: true });
    degraded.time.set(72);
    await degraded.recorder.submitObservation(degraded.windowId, { ...s[1], value: 99 }, NODE);
    degraded.time.set(80);
    await degraded.recorder.closeWindow(degraded.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
    expect((await degraded.recorder.getWindow(degraded.windowId))!.continuityStatus).toBe("DEGRADED");
    expectNotEstablished(await calculate(statsRequest(degraded.windowId), context(degraded)), EIE_REASON.CALC_INPUT_CONTINUITY);
  });

  it("missing windows, channels with no admitted observations, and premature pressure entries are never inputs", async () => {
    const run = await sealedWindow([simulatedStream()], { keepOpen: true });
    run.time.set(195);
    await run.recorder.submitObservation(run.windowId, { ...simulatedStream()[0], observationId: "SIM-P", channel: "SUCTION_PRESSURE", unit: "psig", observedAt: at(194), receivedAt: at(194) }, NODE);
    run.time.set(200);
    await run.recorder.closeWindow(run.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
    const ctx = context(run);
    expectNotEstablished(await calculate(statsRequest("EIE-WIN-unknown"), ctx), EIE_REASON.CALC_INPUT_MISSING);
    expectNotEstablished(await calculate({ ...statsRequest(run.windowId), inputs: [channel(run.windowId, "series", "SUPPLY_DRY_BULB")] }, ctx), EIE_REASON.CALC_INPUT_MISSING);
    expectNotEstablished(await calculate({ ...statsRequest(run.windowId), inputs: [channel(run.windowId, "series", "SUCTION_PRESSURE")] }, ctx), EIE_REASON.CALC_INPUT_MISSING);
  });

  it("units must be exactly those the reference declares; no conversion", async () => {
    const run = await sealedWindow([simulatedStream({ unit: "degC", values: [24, 24, 24, 24], accuracyOrUncertainty: null })]);
    expectNotEstablished(await calculate(meanRequest(run.windowId), context(run)), EIE_REASON.CALC_UNIT_INCOMPATIBLE);
  });

  it("inputs outside the reference's valid domain, or a reference with no established domain, fail closed", async () => {
    const run = await sealedWindow([simulatedStream({ values: [250, 250, 250, 250] })]);
    expectNotEstablished(await calculate(meanRequest(run.windowId), context(run)), EIE_REASON.REF_OUT_OF_DOMAIN);
    const noDomain = { ...SYN_MEAN_REF, validDomain: { status: "NOT_ESTABLISHED" as const, requiredFrom: "synthetic" } };
    const ok = await sealedWindow([simulatedStream()]);
    const registry = simulationRegistry([], [noDomain, SYN_DIFFERENCE_REF, SYN_WINDOW_STATISTICS_REF]);
    expectNotEstablished(await calculate(meanRequest(ok.windowId), context(ok, { registry })), EIE_REASON.REF_OUT_OF_DOMAIN);
  });

  it("malformed, unknown, under- or over-bound requests fail closed", async () => {
    const run = await sealedWindow([simulatedStream()]);
    const ctx = context(run);
    expectNotEstablished(await calculate({ ...statsRequest(run.windowId), functionId: "EIE-FN-NONE" }, ctx), EIE_REASON.CALC_FUNCTION_UNKNOWN);
    expectNotEstablished(await calculate({ ...statsRequest(run.windowId), inputs: [] }, ctx), EIE_REASON.CALC_INPUT_MISSING);
    expectNotEstablished(await calculate({ ...statsRequest(run.windowId), inputs: [channel(run.windowId), channel(run.windowId, "extra")] }, ctx), EIE_REASON.CALC_REQUEST_INVALID);
    expectNotEstablished(await calculate({ ...statsRequest(run.windowId), requestedBy: undefined } as never, ctx), EIE_REASON.CALC_REQUEST_INVALID);
    expectNotEstablished(await calculate(null as never, ctx), EIE_REASON.CALC_REQUEST_INVALID);
    expectNotEstablished(await calculate({ ...statsRequest(run.windowId), referenceId: "CRR-NONE" }, ctx), EIE_REASON.REF_MISSING);
    expectNotEstablished(await calculate({ ...statsRequest(run.windowId), referenceId: SYN_MEAN_REF.referenceId }, ctx), EIE_REASON.REF_ROLE_MISMATCH);
  });

  it("an implementation that does not match the reference's conformance-tested identity is unverified", async () => {
    const run = await sealedWindow([simulatedStream()]);
    const drifted = { ...SYN_WINDOW_STATISTICS_REF, implementation: { ...WINDOW_STATISTICS_IMPLEMENTATION, fileHash: "a".repeat(64) } };
    const registry = simulationRegistry([], [SYN_MEAN_REF, SYN_DIFFERENCE_REF, drifted]);
    expectNotEstablished(await calculate(statsRequest(run.windowId), context(run, { registry })), EIE_REASON.REF_IMPLEMENTATION_UNVERIFIED);
  });
});

describe("Simulation never becomes production", () => {
  it("a production Analyzer refuses simulated evidence, synthetic functions and simulation registries", async () => {
    const run = await sealedWindow([simulatedStream()]);
    const production = context(run, { mode: "PRODUCTION", registry: PRODUCTION_CRR_1, catalogue: SIMULATION_CATALOGUE });
    const stats = await calculate(statsRequest(run.windowId, CRR_TA14_WINDOW_STATISTICS_1.referenceId), production);
    expect(stats.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.CALC_INPUT_SIMULATED_IN_PRODUCTION, EIE_REASON.REF_NOT_ACTIVATED]));
    const synthetic = await calculate(meanRequest(run.windowId), production);
    expect(synthetic.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.REF_SYNTHETIC_IN_PRODUCTION]));
    const mixed = await calculate(statsRequest(run.windowId), context(run, { mode: "PRODUCTION" }));
    expect(mixed.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.REF_REGISTRY_MODE_MISMATCH, EIE_REASON.REF_SYNTHETIC_IN_PRODUCTION]));
  });

  it("a synthetic reference never applies to production evidence", async () => {
    const pinned = profileWith({ basis: { kind: "SOURCE_DOCUMENTATION", ref: "SYNTHETIC-SOURCE-DOC" } });
    const registry = new Map([[`${pinned.profileId}@${pinned.profileVersion}`, objectHash(pinned)]]);
    const custodied: RecorderSealSigner = { ...DEV_SIGNER, development: false };
    const run = makeRecorder({ mode: "PRODUCTION", profileRegistry: registry, signer: custodied });
    const opened = await run.recorder.openWindow(baselineRequest({ continuityProfile: pinned }), TECH);
    if (!opened.opened) throw new Error(`${opened.reasonCodes}`);
    for (const o of simulatedStream().map((x) => ({ ...x, acquisitionMethod: "MANUAL_INSTRUMENT" as const, sourceQuality: "REPORTED" }))) {
      run.time.set((Date.parse(o.observedAt) - Date.parse(at(0))) / 1000 + 1);
      expect((await run.recorder.submitObservation(opened.windowId, o, NODE)).accepted).toBe(true);
    }
    run.time.set(200);
    await run.recorder.closeWindow(opened.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
    const result = await calculate(statsRequest(opened.windowId), context(run));
    expect(result.evidenceMode).toBe("PRODUCTION");
    expect(result.reasonCodes).toContain(EIE_REASON.REF_SYNTHETIC_IN_PRODUCTION);
  });
});

// ─────────────────────────────── Boundaries ───────────────────────────────

describe("Calculation != interpretation != determination != authority", () => {
  it("results carry no comparison, threshold, interpretation, determination, authority, gate, command or quantity field", async () => {
    const run = await sealedWindow([simulatedStream()]);
    const result = await calculate(statsRequest(run.windowId), context(run));
    const keys = new Set<string>();
    const walk = (v: unknown) => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) { keys.add(k); walk(x); } };
    walk(result);
    expect([...keys].filter((k) => /threshold|pass|fail|within|exceed|accept|compliant|correct|finding|interpret|determin|verdict|diagnos|authori|allow|gate|commit|execut|command|quantity|charge/i.test(k))).toEqual([]);
  });

  it("Analyzer source: no thresholds, no Recorder mutation, no Gate/Governor/NIRET coupling", () => {
    const root = new URL("../../packages/domain/eie/analyzer/", import.meta.url);
    const files: string[] = [];
    const walk = (dir: URL) => {
      for (const name of readdirSync(dir)) {
        const url = new URL(name, dir);
        if (statSync(url).isDirectory()) walk(new URL(`${name}/`, dir));
        else if (name.endsWith(".ts")) files.push(readFileSync(url, "utf8"));
      }
    };
    walk(root);
    expect(files.length).toBe(10);
    const code = files.map((f) => f.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")).join("\n");
    expect(code).not.toMatch(/\b(submitObservation|submitEvent|submitCorrection|openWindow|closeWindow|recordGateAEvaluation|recordMaterialChange|appendRecord|appendWindow|appendSeal)\b/);
    expect(code).not.toMatch(/niret|gate-a|gateB|gate_b|governor/i);
    const literals = code.replace(/"[^"\n]*"|`[^`\n]*`/g, "").match(/(?<![\w.$-])\d[\d_]*(\.\d+)?(?![\w])/g) ?? [];
    // 0 and 1 are structural counts (empty; more than one distinct unit), as in the Phase 1 check; no other number appears.
    expect([...new Set(literals)].sort()).toEqual(["0", "1"]);
  });

  it("SYNTHETIC fixtures are unmistakable", () => {
    for (const entry of SYNTHETIC_ENTRIES) {
      expect(entry.referenceId.startsWith("CRR-SYNTHETIC-")).toBe(true);
      expect(entry.title.startsWith("SYNTHETIC")).toBe(true);
      expect(entry.kind).toBe("SYNTHETIC");
    }
    for (const fn of [SYN_MEAN_FUNCTION, SYN_DIFFERENCE_FUNCTION]) expect(fn).toMatchObject({ synthetic: true, catalogueItem: null });
    expect(fnIds(SIMULATION_CATALOGUE).filter((id) => id.includes("SYNTHETIC"))).toEqual(["EIE-FN-SYNTHETIC-MEAN", "EIE-FN-SYNTHETIC-DIFFERENCE"]);
  });
});

function fnIds(catalogue: readonly { functionId: string }[]) {
  return catalogue.map((f) => f.functionId);
}
