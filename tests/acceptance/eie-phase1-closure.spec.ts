/**
 * TA-14-EIE-ARCH-1.0 Phase 1 closure and integration hardening:
 *   1. governed continuity profile;
 *   2. Gate A receipt binding through the REAL C1-R7 engine (NIRET server evaluation path);
 *   3. persistence (Supabase adapter over an emulated append-only gateway) and seal-key custody.
 * Observations, profiles and OEM records are SYNTHETIC. Gate A receipts here are genuine engine output.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  EIE_REASON, EvidenceRecorder, GOVERNED_CONTINUITY_PROFILES, InMemoryEvidenceStore, objectHash, resolveContinuityProfile, verifyWindow,
  type ChainRecord, type ContinuityProfile, type EvidenceStore, type EvidenceWindow, type GateAReceiptRecord, type NodeObservation,
  type OpenWindowRequest, type RecorderSealSigner,
} from "../../packages/domain/eie";
import { UNAVAILABLE_VERIFIER } from "../../apps/web/lib/niret/certification-verifier";
import type { NiretFormState } from "../../apps/web/lib/niret/form-state";
import { NO_SOURCES, type CertificationVerifier } from "../../apps/web/lib/niret/server-evaluate";
import { createProductionRecorder } from "../../apps/web/lib/eie/production-recorder";
import { KEY_CUSTODY_NOT_ESTABLISHED, productionRecorderKeyCustody } from "../../apps/web/lib/eie/recorder-key-custody";
import {
  EIE_TABLES, serviceRoleRowGateway, StoreIntegrityError, SupabaseEvidenceStore, type EieRowGateway,
} from "../../apps/web/lib/eie/supabase-evidence-store";
import { SERVER_NOW } from "./fixtures/niret-complete-form";
import {
  ASSET, declaredInput, evaluated, evidenceWindow, formObservations, gateARecorder, preservingWindow, verifierWith, type GateARun,
} from "./fixtures/eie-gate-a-evidence";
import {
  DEV_SIGNER, NODE, RESOLVE_KEY, TECH, TEST_PROFILE, baselineRequest, forgedGateAReceipt,
  makeRecorder, profileWith, simulatedStream, at,
} from "./fixtures/eie-simulated";

const mutable = <T>(value: T): T => structuredClone(value) as T;

// ───────────────────────────── 1. Governed continuity profile ─────────────────────────────

const established = <T>(value: T) => ({ status: "ESTABLISHED" as const, value, basisRef: "SYNTHETIC-FIXTURE-0" });
const notEstablished = { status: "NOT_ESTABLISHED" as const, requiredFrom: "equipment/profile-specific authority" };

async function streamWith(profile: ContinuityProfile, observations: NodeObservation[], recordAt?: (o: NodeObservation) => number) {
  const run = makeRecorder();
  const opened = await run.recorder.openWindow(baselineRequest({ continuityProfile: profile }), TECH);
  if (!opened.opened) throw new Error(`${opened.reasonCodes}`);
  const outcomes = [];
  for (const o of observations) {
    run.time.set(recordAt ? recordAt(o) : (Date.parse(o.observedAt) - Date.parse(at(0))) / 1000 + 1);
    outcomes.push(await run.recorder.submitObservation(opened.windowId, o, NODE));
  }
  return { ...run, windowId: opened.windowId, outcomes, window: async () => (await run.recorder.getWindow(opened.windowId))! };
}

describe("1. Governed continuity profile", () => {
  it("no governed production profile exists; production accepts only pinned, non-synthetic profiles", () => {
    expect(GOVERNED_CONTINUITY_PROFILES.size).toBe(0);
    expect(resolveContinuityProfile(TEST_PROFILE, "SIMULATION").ok).toBe(true);
    expect(resolveContinuityProfile(TEST_PROFILE, "PRODUCTION")).toMatchObject({ ok: false, reasonCodes: [EIE_REASON.PROFILE_NOT_GOVERNED] });

    const documented = profileWith({ basis: { kind: "SOURCE_DOCUMENTATION", ref: "SYNTHETIC-SOURCE-DOC" } });
    expect(resolveContinuityProfile(documented, "PRODUCTION")).toMatchObject({ ok: false, reasonCodes: [EIE_REASON.PROFILE_NOT_GOVERNED] });
    const pinned = new Map([[`${documented.profileId}@${documented.profileVersion}`, objectHash(documented)]]);
    expect(resolveContinuityProfile(documented, "PRODUCTION", pinned).ok).toBe(true);
    const altered = { ...documented, maxGapSeconds: established(999) };
    expect(resolveContinuityProfile(altered, "PRODUCTION", pinned)).toMatchObject({ ok: false, reasonCodes: [EIE_REASON.PROFILE_NOT_GOVERNED] });
  });

  it("expected sequence and maximum gap must be supplied by the governing authority; otherwise no window opens", async () => {
    for (const missing of [{ sequenceSemantics: notEstablished }, { maxGapSeconds: notEstablished }]) {
      const { recorder } = makeRecorder();
      expect(await recorder.openWindow(baselineRequest({ continuityProfile: profileWith(missing as Partial<ContinuityProfile>) }), TECH))
        .toMatchObject({ opened: false, reasonCodes: [EIE_REASON.PROFILE_BOUND_NOT_ESTABLISHED] });
    }
    const unsourced = profileWith({ maxGapSeconds: { status: "ESTABLISHED", value: 120, basisRef: "" } as never });
    expect(resolveContinuityProfile(unsourced, "SIMULATION")).toMatchObject({ ok: false, reasonCodes: [EIE_REASON.PROFILE_INVALID] });
  });

  it("CONTIGUOUS_PER_STREAM: a sequence skip is missing evidence; the window is BROKEN and closes", async () => {
    const s = simulatedStream();
    const run = await streamWith(TEST_PROFILE, [s[0], s[2]]);
    expect(run.outcomes[1]).toMatchObject({ accepted: true, reasonCodes: [EIE_REASON.CONTINUITY_BROKEN] });
    const window = await run.window();
    expect(window.gaps).toMatchObject([{ gapType: "SEQUENCE_GAP", missingSequences: { from: 101, to: 101 } }]);
    expect(window).toMatchObject({ continuityStatus: "BROKEN", closeTrigger: { type: "CONTINUITY_BREAK" } });
    expect(verifyWindow(window, RESOLVE_KEY).valid).toBe(true);
  });

  it("MONOTONIC_PER_STREAM: a sequence skip is not a gap", async () => {
    const s = simulatedStream();
    const run = await streamWith(profileWith({ sequenceSemantics: established("MONOTONIC_PER_STREAM" as const) }), [s[0], s[2]]);
    expect(run.outcomes.map((o) => o.accepted)).toEqual([true, true]);
    expect((await run.window()).continuityStatus).toBe("INTACT");
  });

  it("source-time spacing beyond the established maximum gap breaks continuity; within it does not", async () => {
    const broken = await streamWith(TEST_PROFILE, simulatedStream({ spacingSeconds: 180, values: [75.1, 75.0] }));
    expect((await broken.window()).gaps).toMatchObject([{ gapType: "TIME_GAP", gapSeconds: 180 }]);
    const intact = await streamWith(TEST_PROFILE, simulatedStream({ spacingSeconds: 120, values: [75.1, 75.0] }));
    expect((await intact.window()).continuityStatus).toBe("INTACT");
  });

  it("maximum observation age applies only where the profile establishes one", async () => {
    const late = (o: NodeObservation) => (Date.parse(o.observedAt) - Date.parse(at(0))) / 1000 + 100;
    const noAge = await streamWith(profileWith({ maxObservationAgeSeconds: notEstablished }), simulatedStream().slice(0, 1), late);
    expect(noAge.outcomes[0].accepted).toBe(true);
    const aged = await streamWith(profileWith({ maxObservationAgeSeconds: established(60) }), simulatedStream().slice(0, 1), late);
    expect(aged.outcomes[0]).toMatchObject({ accepted: false, record: { continuityEffect: "DEGRADED" }, reasonCodes: [EIE_REASON.STALE] });
    expect((await aged.window()).continuityStatus).toBe("DEGRADED");
  });

  it("an exact duplicate is rejected with no continuity effect", async () => {
    const s = simulatedStream();
    const run = await streamWith(TEST_PROFILE, [s[0], s[1]]);
    run.time.set(72);
    const dup = await run.recorder.submitObservation(run.windowId, s[1], NODE);
    expect(dup).toMatchObject({ accepted: false, record: { continuityEffect: "NONE" }, reasonCodes: [EIE_REASON.REPLAY] });
    expect((await run.window()).continuityStatus).toBe("INTACT");
  });

  it("conflicting duplicates (same id or same stream sequence, different content) degrade continuity; the window stays open", async () => {
    const s = simulatedStream();
    const run = await streamWith(TEST_PROFILE, [s[0], s[1]]);
    run.time.set(72);
    const sameId = await run.recorder.submitObservation(run.windowId, { ...s[1], value: 99 }, NODE);
    expect(sameId).toMatchObject({ record: { continuityEffect: "DEGRADED" } });
    const sameSeq = await run.recorder.submitObservation(run.windowId, { ...s[1], observationId: "SIM-OTHER-101", value: 98 }, NODE);
    expect(sameSeq.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.REPLAY, EIE_REASON.HASH_MISMATCH]));
    const window = await run.window();
    expect(window).toMatchObject({ continuityStatus: "DEGRADED", closedAt: null });
    expect(window.entries.map((e) => e.kind === "OBSERVATION" && e.observation.value)).toEqual([75.1, 75.0]);
  });

  it("out-of-order arrivals are rejected, never re-sequenced, and degrade continuity", async () => {
    const s = simulatedStream();
    const run = await streamWith(profileWith({ sequenceSemantics: established("MONOTONIC_PER_STREAM" as const) }), [s[0], s[2]]);
    run.time.set(132);
    const late = await run.recorder.submitObservation(run.windowId, s[1], NODE);
    expect(late).toMatchObject({ accepted: false, record: { continuityEffect: "DEGRADED" }, reasonCodes: [EIE_REASON.CHRONOLOGY_VIOLATION] });
    const window = await run.window();
    expect(window.entries.map((e) => e.kind === "OBSERVATION" && e.observation.sequence)).toEqual([100, 102]);
    expect(window.continuityStatus).toBe("DEGRADED");
  });

  it("source time ahead of the Recorder is rejected: zero tolerance unless the profile establishes a lead", async () => {
    const ahead = (o: NodeObservation) => (Date.parse(o.observedAt) - Date.parse(at(0))) / 1000 - 3;
    const strict = await streamWith(profileWith({ maxSourceClockLeadSeconds: notEstablished }), simulatedStream().slice(0, 1), ahead);
    expect(strict.outcomes[0]).toMatchObject({ accepted: false, record: { continuityEffect: "DEGRADED" }, reasonCodes: [EIE_REASON.CHRONOLOGY_VIOLATION] });
    const tolerant = await streamWith(TEST_PROFILE, simulatedStream().slice(0, 1), ahead);
    expect(tolerant.outcomes[0].accepted).toBe(true);
    const record = tolerant.outcomes[0].record as { recordedAt: string; observation: NodeObservation };
    expect(Date.parse(record.recordedAt)).toBeLessThan(Date.parse(record.observation.observedAt));
  });

  it("BROKEN takes precedence over DEGRADED, and a falsified status is detected", async () => {
    const s = simulatedStream();
    const run = await streamWith(TEST_PROFILE, [s[0]]);
    run.time.set(12);
    await run.recorder.submitObservation(run.windowId, { ...s[0], value: 1 }, NODE);
    expect((await run.window()).continuityStatus).toBe("DEGRADED");
    run.time.set(131);
    await run.recorder.submitObservation(run.windowId, s[2], NODE);
    const window = await run.window();
    expect(window.continuityStatus).toBe("BROKEN");
    const falsified = mutable(window) as EvidenceWindow;
    falsified.continuityStatus = "INTACT";
    expect(verifyWindow(falsified, RESOLVE_KEY).reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.CONTINUITY_BROKEN]));
  });

  it("closure eligibility: a DEGRADED window closes on a declared trigger; only an established timeout auto-closes", async () => {
    const s = simulatedStream();
    const run = await streamWith(TEST_PROFILE, [s[0]]);
    run.time.set(12);
    await run.recorder.submitObservation(run.windowId, { ...s[0], value: 1 }, NODE);
    const closed = await run.recorder.closeWindow(run.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
    expect(closed.closed && closed.window.continuityStatus).toBe("DEGRADED");

    const noTimeout = makeRecorder();
    const a = await noTimeout.recorder.openWindow(baselineRequest(), TECH);
    noTimeout.time.set(100_000);
    expect(a.opened && (await noTimeout.recorder.closeIfTimedOut(a.windowId))).toBe(false);

    const timed = makeRecorder();
    const b = await timed.recorder.openWindow(baselineRequest({ continuityProfile: profileWith({ windowTimeoutSeconds: established(30) }) }), TECH);
    if (!b.opened) throw new Error();
    timed.time.set(31);
    expect(await timed.recorder.submitObservation(b.windowId, s[0], NODE)).toMatchObject({ accepted: false, reasonCodes: [EIE_REASON.WINDOW_CLOSED] });
    expect((await timed.recorder.getWindow(b.windowId))!.closeTrigger).toMatchObject({ type: "PROFILE_TIMEOUT", ref: "SYNTHETIC-TEST-PROFILE" });
  });

  it("the governing profile is bound into the window by hash; altering it is detected", async () => {
    const run = await streamWith(TEST_PROFILE, simulatedStream().slice(0, 1));
    const window = await run.window();
    expect(window.continuityProfileHash).toBe(objectHash(TEST_PROFILE));
    const altered = mutable(window) as EvidenceWindow;
    (altered.continuityProfile.maxGapSeconds as { value: number }).value = 99_999;
    expect(verifyWindow(altered, RESOLVE_KEY).reasonCodes).toContain(EIE_REASON.HASH_MISMATCH);
  });
});

// ───────────────────────────── 2. Gate A receipt binding (real C1-R7 engine, s09 sealed-evidence path) ─────────────────────────────

/** Sets the Recorder clock relative to SERVER_NOW (the Gate A evaluation instant). */
const later = (run: GateARun, seconds: number) => run.setTime(new Date(SERVER_NOW.getTime() + seconds * 1000).toISOString());
const withReading = (channel: string, change: Partial<NodeObservation> | null) =>
  formObservations().flatMap((o) => (o.channel !== channel ? [o] : change === null ? [] : [{ ...o, ...change }]));

const pressureRequest = (receiptId: string, predecessors: string[], extra: Partial<OpenWindowRequest> = {}): OpenWindowRequest => baselineRequest({
  purpose: "PRESSURE_EVIDENCE", openTrigger: { type: "GATE_A_ALLOW_RECEIPT", ref: receiptId },
  admittedChannels: ["SUCTION_PRESSURE", "LIQUID_PRESSURE"], predecessorWindowIds: predecessors, ...extra,
});

describe("2. Gate A receipt binding", () => {
  it("a genuine full ALLOW receipt, preserved by the Recorder, opens exactly one PRESSURE_EVIDENCE window for its asset", async () => {
    const run = gateARecorder();
    const { baselineId, record, receipt } = await evaluated(run);
    expect(receipt).toMatchObject({ determination: "ALLOW", scope: "PRESSURE_EVIDENCE_ONLY", gate_b_authorized: false });
    const baseline = (await run.recorder.getWindow(baselineId))!;
    expect(baseline.closeTrigger).toMatchObject({ type: "NEXT_LIFECYCLE_RECEIPT", ref: receipt.receipt_id });
    expect(baseline.events.at(-1)).toMatchObject({ kind: "GATE_A_RECEIPT", assetId: ASSET, producedBy: "TA-14-NIRET-GA-C1" });
    expect(verifyWindow(baseline, RESOLVE_KEY).valid).toBe(true);

    const opened = await run.recorder.openWindow(pressureRequest(receipt.receipt_id, [baselineId]), TECH);
    expect(opened.opened).toBe(true);
    if (!opened.opened) return;
    expect(opened.window.openTrigger).toMatchObject({
      gateAReceiptId: receipt.receipt_id, gateAReceiptContentHash: receipt.content_hash, gateAReceiptWindowId: baselineId, gateAReceiptEntryHash: record.entryHash,
    });
    later(run, 2);
    const pressure = { ...simulatedStream()[0], observationId: "SIM-P-1", channel: "SUCTION_PRESSURE" as const, unit: "psig",
      observedAt: new Date(SERVER_NOW.getTime() + 1500).toISOString(), receivedAt: new Date(SERVER_NOW.getTime() + 1500).toISOString() };
    expect(await run.recorder.submitObservation(opened.windowId, pressure, NODE)).toMatchObject({ accepted: true, record: { kind: "OBSERVATION" } });

    const again = await run.recorder.openWindow(pressureRequest(receipt.receipt_id, [baselineId]), TECH);
    expect(again).toMatchObject({ opened: false });
    expect(!again.opened && again.reasonCodes).toContain(EIE_REASON.RECEIPT_CONSUMED);
  });

  it("a caller-supplied receipt object or boolean cannot substitute for a preserved receipt", async () => {
    const run = gateARecorder();
    const { baselineId, receipt } = await evaluated(run);
    for (const extra of [{ gateAAllowed: true }, { gateAReceipt: receipt }, { gateAReceipt: forgedGateAReceipt() }]) {
      expect(await run.recorder.openWindow({ ...pressureRequest(receipt.receipt_id, [baselineId]), ...extra } as never, TECH))
        .toMatchObject({ opened: false, reasonCodes: [EIE_REASON.REQUEST_INVALID] });
    }
    const flagInTrigger = pressureRequest(receipt.receipt_id, [baselineId]);
    (flagInTrigger.openTrigger as unknown as Record<string, unknown>).allowed = true;
    expect(await run.recorder.openWindow(flagInTrigger, TECH)).toMatchObject({ opened: false, reasonCodes: [EIE_REASON.REQUEST_INVALID] });
  });

  it("a forged receipt cannot open PRESSURE_EVIDENCE: it was never preserved by the Recorder", async () => {
    const run = gateARecorder();
    const { baselineId } = await evaluated(run);
    const forged = forgedGateAReceipt();
    const result = await run.recorder.openWindow(pressureRequest(forged.receipt_id as string, [baselineId]), TECH);
    expect(result).toMatchObject({ opened: false });
    expect(!result.opened && result.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.TRIGGER_INVALID, EIE_REASON.RECEIPT_NOT_PRESERVED]));
    const noLineage = await run.recorder.openWindow(pressureRequest(forged.receipt_id as string, []), TECH);
    expect(!noLineage.opened && noLineage.reasonCodes).toContain(EIE_REASON.RECEIPT_NOT_PRESERVED);
  });

  it("an evaluator output that fails C1-R7 integrity is refused and never preserved as a receipt", async () => {
    const tampered = () => ({ ...forgedGateAReceipt(), determination: "ALLOW", scope: "ANY" });
    const run = gateARecorder({ evaluator: tampered });
    const evidenceId = await evidenceWindow(run);
    const baselineId = await preservingWindow(run, [evidenceId]);
    run.setTime(SERVER_NOW.toISOString());
    const result = await run.recorder.recordGateAEvaluation(baselineId, { evidenceWindowIds: [evidenceId], declared: declaredInput() }, TECH);
    expect(result).toMatchObject({ accepted: false, reasonCodes: [EIE_REASON.RECEIPT_INTEGRITY] });
    const window = (await run.recorder.getWindow(baselineId))!;
    expect(window.events.some((e) => e.kind === "GATE_A_RECEIPT")).toBe(false);
    expect(window.closedAt).toBeNull();
  });

  it("a preserved receipt altered at rest fails integrity and cannot open the window", async () => {
    class TamperingStore extends InMemoryEvidenceStore {
      override async readRecords(windowId: string): Promise<readonly ChainRecord[]> {
        return (await super.readRecords(windowId)).map((r) => r.kind === "GATE_A_RECEIPT"
          ? { ...(r as GateAReceiptRecord), receipt: { ...(r as GateAReceiptRecord).receipt, determination: "ALLOW", reason_codes: [] } } as ChainRecord
          : r);
      }
    }
    const run = gateARecorder({ store: new TamperingStore(), verifier: verifierWith([]) }); // genuine HOLD, then "upgraded" at rest
    const { baselineId, receipt } = await evaluated(run);
    const result = await run.recorder.openWindow(pressureRequest(receipt.receipt_id, [baselineId]), TECH);
    expect(!result.opened && result.reasonCodes).toContain(EIE_REASON.RECEIPT_INTEGRITY);
  });

  const outcomes: Array<[string, { verifier?: CertificationVerifier; mutateForm?: (f: NiretFormState) => void; observations?: NodeObservation[] }, Record<string, string>]> = [
    ["technical ALLOW, execution authority not established (HOLD)", { verifier: verifierWith([]) }, { determination: "HOLD", technical: "ALLOW", execution: "HOLD" }],
    ["technical ALLOW, verification source unavailable (ESCALATE)", { verifier: UNAVAILABLE_VERIFIER }, { technical: "ALLOW", execution: "ESCALATE" }],
    ["technical HOLD (no airflow evidence in the sealed window)", { observations: withReading("AIRFLOW", null) }, { determination: "HOLD", technical: "HOLD" }],
    ["DENY (non-invasive indicator within the OEM criterion)", { observations: withReading("SUPPLY_DRY_BULB", { value: 57 }) }, { determination: "DENY" }],
    ["ESCALATE (A2L refrigerant)", { mutateForm: (f) => { f.refrigerant.declared = "R-32"; } }, { determination: "ESCALATE" }],
  ];
  it.each(outcomes)("%s cannot open PRESSURE_EVIDENCE", async (_name, setup, expected) => {
    const run = gateARecorder({ verifier: setup.verifier });
    const { baselineId, receipt } = await evaluated(run, { mutateForm: setup.mutateForm, observations: setup.observations });
    if (expected.determination) expect(receipt.determination).toBe(expected.determination);
    if (expected.technical) expect(receipt.technical_determination.determination).toBe(expected.technical);
    if (expected.execution) expect(receipt.execution_authority.determination).toBe(expected.execution);
    expect(receipt.determination).not.toBe("ALLOW");
    const result = await run.recorder.openWindow(pressureRequest(receipt.receipt_id, [baselineId]), TECH);
    expect(result).toMatchObject({ opened: false });
    expect(!result.opened && result.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.TRIGGER_INVALID, EIE_REASON.RECEIPT_NOT_ALLOW]));
  });

  it("a receipt preserved for one asset cannot be reused for another", async () => {
    const run = gateARecorder();
    const { baselineId, receipt } = await evaluated(run, { assetId: "ASSET-A" });
    const result = await run.recorder.openWindow(pressureRequest(receipt.receipt_id, [baselineId], { assetId: "ASSET-B" }), TECH);
    expect(!result.opened && result.reasonCodes).toContain(EIE_REASON.RECEIPT_ASSET_MISMATCH);
  });

  it("a C1-R7 validity-terminating state change recorded for the asset after the receipt challenges it", async () => {
    const run = gateARecorder();
    const { baselineId, receipt } = await evaluated(run);
    expect(receipt.validity_terminating_conditions).toContain("FILTER_REPLACED_OR_REMOVED");

    const other = await run.recorder.openWindow(baselineRequest({ assetId: "ASSET-OTHER", purpose: "CONTINUOUS", openTrigger: { type: "SCHEDULE", ref: "S-2" } }), TECH);
    if (!other.opened) throw new Error();
    await run.recorder.recordMaterialChange(other.windowId, { changeType: "FILTER_REPLACED_OR_REMOVED", detail: {} }, TECH);
    expect((await run.recorder.openWindow(pressureRequest(receipt.receipt_id, [baselineId]), TECH)).opened).toBe(true); // other asset: no effect

    const run2 = gateARecorder();
    const second = await evaluated(run2);
    const cont = await run2.recorder.openWindow(baselineRequest({ purpose: "CONTINUOUS", openTrigger: { type: "SCHEDULE", ref: "S-1" } }), TECH);
    if (!cont.opened) throw new Error();
    later(run2, 2);
    const ungoverned = await run2.recorder.recordMaterialChange(cont.windowId, { changeType: "SOMETHING_ELSE", detail: {} }, TECH);
    expect(ungoverned.reasonCodes).toContain(EIE_REASON.MATERIAL_CHANGE_UNGOVERNED);
    expect((await run2.recorder.recordMaterialChange(cont.windowId, { changeType: "FILTER_REPLACED_OR_REMOVED", detail: { note: "synthetic" } }, TECH)).accepted).toBe(true);
    const result = await run2.recorder.openWindow(pressureRequest(second.receipt.receipt_id, [second.baselineId]), TECH);
    expect(!result.opened && result.reasonCodes).toContain(EIE_REASON.RECEIPT_CHALLENGED);
  });

  it("C1-R7 receipts expire by state change, not elapsed time: no age limit is invented", async () => {
    const run = gateARecorder();
    const { baselineId, receipt } = await evaluated(run);
    later(run, 30 * 24 * 3600);
    expect((await run.recorder.openWindow(pressureRequest(receipt.receipt_id, [baselineId]), TECH)).opened).toBe(true);
  });

  it("evaluation requires a configured engine, a technician, and a baseline window", async () => {
    const none = gateARecorder({ evaluator: null });
    const evidenceA = await evidenceWindow(none);
    const a = await preservingWindow(none, [evidenceA]);
    none.setTime(SERVER_NOW.toISOString());
    expect(await none.recorder.recordGateAEvaluation(a, { evidenceWindowIds: [evidenceA], declared: declaredInput() }, TECH))
      .toMatchObject({ accepted: false, reasonCodes: [EIE_REASON.GATE_A_EVALUATOR_UNAVAILABLE] });
    expect((await none.recorder.getWindow(a))!.events.at(-1)).toMatchObject({ kind: "REJECTED_SUBMISSION", submissionType: "GATE_A_EVALUATION" });

    const run = gateARecorder();
    const evidenceB = await evidenceWindow(run);
    const b = await preservingWindow(run, [evidenceB]);
    run.setTime(SERVER_NOW.toISOString());
    expect((await run.recorder.recordGateAEvaluation(b, { evidenceWindowIds: [evidenceB], declared: declaredInput() }, NODE)).reasonCodes).toContain(EIE_REASON.ROLE_NOT_ENABLED);
    const cont = await run.recorder.openWindow(baselineRequest({ purpose: "CONTINUOUS", openTrigger: { type: "SCHEDULE", ref: "S" } }), TECH);
    if (!cont.opened) throw new Error();
    expect((await run.recorder.recordGateAEvaluation(cont.windowId, { evidenceWindowIds: [evidenceB], declared: declaredInput() }, TECH)).reasonCodes).toContain(EIE_REASON.REQUEST_INVALID);
  });

  it("opening a pressure window produces no Gate B, execution or Governor authority", async () => {
    const run = gateARecorder();
    const { baselineId, receipt } = await evaluated(run);
    const opened = await run.recorder.openWindow(pressureRequest(receipt.receipt_id, [baselineId]), TECH);
    if (!opened.opened) throw new Error();
    const keys = new Set<string>();
    const walk = (v: unknown) => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) { keys.add(k); walk(x); } };
    walk(opened.window);
    expect([...keys].filter((k) => /gate_?b|commit|execut|governor|authori|allow/i.test(k))).toEqual([]);
    expect(receipt.gate_b_authorized).toBe(false);
    for (const [type, purpose] of [["GATE_B_COMMIT", "EXECUTION"], ["GOVERNOR_TERMINATION", "POST_STABILIZATION"]] as const) {
      const attempt = await run.recorder.openWindow(baselineRequest({ purpose, openTrigger: { type, ref: receipt.receipt_id }, predecessorWindowIds: [baselineId] }), TECH);
      expect(attempt).toMatchObject({ opened: false });
      expect(!attempt.opened && attempt.reasonCodes).toContain(EIE_REASON.TRIGGER_INVALID);
    }
  });
});

// ───────────────────────────── 3. Persistence and key custody ─────────────────────────────

/** In-memory stand-in for the migration's tables: insert and select only, with its constraints and triggers. */
function emulatedDatabase() {
  const tables: Record<string, Array<Record<string, any>>> = { [EIE_TABLES.windows]: [], [EIE_TABLES.entries]: [], [EIE_TABLES.seals]: [] };
  const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
  const fail = (code: string) => ({ error: { code, message: code } });
  const gateway: EieRowGateway = {
    async insert(table, row) {
      const rows = tables[table];
      if (table === EIE_TABLES.windows) {
        if (rows.some((r) => r.window_id === row.window_id)) return fail("23505");
        if (row.purpose === "PRESSURE_EVIDENCE" && rows.some((r) => r.purpose === "PRESSURE_EVIDENCE" && r.gate_a_receipt_id === row.gate_a_receipt_id)) return fail("23505");
      }
      if (table === EIE_TABLES.entries) {
        if (tables[EIE_TABLES.seals].some((s) => s.window_id === row.window_id)) return fail("P0001");
        const own = rows.filter((r) => r.window_id === row.window_id);
        const head = own.at(-1)?.entry_hash ?? tables[EIE_TABLES.windows].find((w) => w.window_id === row.window_id)?.header_hash;
        if (row.window_seq !== own.length + 1 || row.prev_entry_hash !== head) return fail("P0001");
        if (row.observation_id && rows.some((r) => r.observation_id === row.observation_id)) return fail("23505");
      }
      if (table === EIE_TABLES.seals && rows.some((r) => r.window_id === row.window_id)) return fail("23505");
      rows.push(clone(row));
      return { error: null };
    },
    async select(table, _columns, match, orderBy = []) {
      const rows = tables[table].filter((r) => Object.entries(match).every(([k, v]) => r[k] === v)).map(clone);
      for (const column of [...orderBy].reverse()) rows.sort((a, b) => (a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0));
      return { data: rows, error: null };
    },
  };
  return { gateway, tables };
}

describe("3. Persistence boundary", () => {
  it("the Supabase store preserves a full window lifecycle that verifies after read-back", async () => {
    const db = emulatedDatabase();
    const run = makeRecorder({ store: new SupabaseEvidenceStore(db.gateway) });
    const opened = await run.recorder.openWindow(baselineRequest(), TECH);
    if (!opened.opened) throw new Error(`${opened.reasonCodes}`);
    for (const o of simulatedStream().slice(0, 3)) {
      run.time.set((Date.parse(o.observedAt) - Date.parse(at(0))) / 1000 + 1);
      expect((await run.recorder.submitObservation(opened.windowId, o, NODE)).accepted).toBe(true);
    }
    run.time.set(200);
    const closed = await run.recorder.closeWindow(opened.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
    if (!closed.closed) throw new Error();
    expect(verifyWindow(closed.window, RESOLVE_KEY).valid).toBe(true);
    expect(db.tables[EIE_TABLES.entries]).toHaveLength(3);
    expect(db.tables[EIE_TABLES.seals]).toHaveLength(1);
  });

  it("Recorder instances share nothing but the store: a second instance sees the first one's history", async () => {
    const db = emulatedDatabase();
    const first = makeRecorder({ store: new SupabaseEvidenceStore(db.gateway) });
    const opened = await first.recorder.openWindow(baselineRequest(), TECH);
    if (!opened.opened) throw new Error();
    first.time.set(11);
    await first.recorder.submitObservation(opened.windowId, simulatedStream()[0], NODE);
    const second = makeRecorder({ store: new SupabaseEvidenceStore(db.gateway), startSeconds: 12 });
    expect((await second.recorder.submitObservation(opened.windowId, simulatedStream()[0], NODE)).reasonCodes).toContain(EIE_REASON.REPLAY);
    expect(await second.recorder.getWindow(opened.windowId)).toEqual(await first.recorder.getWindow(opened.windowId));
  });

  it("rows altered outside the application fail closed on read instead of being trusted", async () => {
    const db = emulatedDatabase();
    const store = new SupabaseEvidenceStore(db.gateway);
    const run = makeRecorder({ store });
    const opened = await run.recorder.openWindow(baselineRequest(), TECH);
    if (!opened.opened) throw new Error();
    run.time.set(11);
    await run.recorder.submitObservation(opened.windowId, simulatedStream()[0], NODE);
    db.tables[EIE_TABLES.entries][0].record.observation.value = 99;
    await expect(store.readRecords(opened.windowId)).rejects.toThrow(StoreIntegrityError);
    await expect(run.recorder.getWindow(opened.windowId)).rejects.toThrow(StoreIntegrityError);
    db.tables[EIE_TABLES.windows][0].header.assetId = "ASSET-REWRITTEN";
    await expect(store.readWindow(opened.windowId)).rejects.toThrow(StoreIntegrityError);
  });

  it("appends that would rewrite, reorder or extend sealed history are refused by the database boundary", async () => {
    const db = emulatedDatabase();
    const store = new SupabaseEvidenceStore(db.gateway);
    const run = makeRecorder({ store });
    const opened = await run.recorder.openWindow(baselineRequest(), TECH);
    if (!opened.opened) throw new Error();
    run.time.set(11);
    const first = await run.recorder.submitObservation(opened.windowId, simulatedStream()[0], NODE);
    await expect(store.appendRecord({ ...(first.record as ChainRecord) })).rejects.toThrow(); // same seq again
    run.time.set(20);
    await run.recorder.closeWindow(opened.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
    await expect(store.appendRecord({ ...(first.record as ChainRecord), windowSeq: 2, prevEntryHash: first.record!.entryHash })).rejects.toThrow();
  });

  it("the adapter has no update, upsert or delete path, and the migration forbids them", () => {
    const adapter = readFileSync(new URL("../../apps/web/lib/eie/supabase-evidence-store.ts", import.meta.url), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(adapter).not.toMatch(/\.(update|upsert|delete|rpc)\(/);
    const sql = readFileSync(new URL("../../supabase/migrations/20260928130000_ta14_eie_evidence_windows.sql", import.meta.url), "utf8");
    for (const table of Object.values(EIE_TABLES)) {
      expect(sql).toMatch(new RegExp(`before update or delete on public\\.${table}`));
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
      expect(sql).toContain(`revoke all on table public.${table} from anon, authenticated;`);
      expect(sql).toContain(`revoke update, delete, truncate on table public.${table} from service_role;`);
    }
    expect(sql).not.toMatch(/create policy/i);
    expect(sql).toMatch(/TA14_EIE_LINEAGE_BROKEN/);
    expect(sql).toMatch(/TA14_EIE_WINDOW_SEALED/);
    expect(sql).toMatch(/unique index if not exists ta14_eie_windows_pressure_receipt/);
    expect(sql).toMatch(/NOT APPLIED/);
  });

  it("the service-role store refuses to start without configuration", () => {
    const saved = { url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    try {
      expect(() => serviceRoleRowGateway()).toThrow("EIE_EVIDENCE_STORE_NOT_CONFIGURED");
    } finally {
      if (saved.url !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = saved.url;
      if (saved.key !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = saved.key;
    }
  });
});

describe("3b. Seal-key custody", () => {
  it("production key custody is not established: no signer, no trusted public keys", () => {
    const custody = productionRecorderKeyCustody();
    expect(custody).toBe(KEY_CUSTODY_NOT_ESTABLISHED);
    expect(custody.status).toBe("NOT_ESTABLISHED");
    expect(custody.signer()).toBeNull();
    expect(custody.resolvePublicKey("TA14-EIE-TEST-KEY")).toBeUndefined();
  });

  it("the production Recorder composition fails closed on every unresolved dependency", async () => {
    const db = emulatedDatabase();
    const recorder = createProductionRecorder({ recorderId: "EIE-PROD", gateASources: NO_SOURCES, gateway: db.gateway });
    const documented = profileWith({ basis: { kind: "SOURCE_DOCUMENTATION", ref: "SYNTHETIC-SOURCE-DOC" } });
    const result = await recorder.openWindow(baselineRequest({ continuityProfile: documented }), TECH);
    expect(result).toMatchObject({ opened: false });
    expect(!result.opened && result.reasonCodes).toEqual(expect.arrayContaining([EIE_REASON.SEAL_SIGNER_UNAVAILABLE, EIE_REASON.PROFILE_NOT_GOVERNED]));
    expect(db.tables[EIE_TABLES.windows]).toHaveLength(0);
  });

  it("development signers are refused in PRODUCTION, and a Recorder with no signer opens nothing", async () => {
    const pinnedProfile = profileWith({ basis: { kind: "SOURCE_DOCUMENTATION", ref: "SYNTHETIC-SOURCE-DOC" } });
    const registry = new Map([[`${pinnedProfile.profileId}@${pinnedProfile.profileVersion}`, objectHash(pinnedProfile)]]);
    const production = makeRecorder({ mode: "PRODUCTION", profileRegistry: registry });
    expect(await production.recorder.openWindow(baselineRequest({ continuityProfile: pinnedProfile }), TECH))
      .toMatchObject({ opened: false, reasonCodes: [EIE_REASON.SEAL_SIGNER_UNAVAILABLE] });
    const custodied: RecorderSealSigner = { ...DEV_SIGNER, development: false };
    const governed = makeRecorder({ mode: "PRODUCTION", profileRegistry: registry, signer: custodied });
    expect((await governed.recorder.openWindow(baselineRequest({ continuityProfile: pinnedProfile }), TECH)).opened).toBe(true);
    const unsigned = makeRecorder({ signer: null });
    expect(await unsigned.recorder.openWindow(baselineRequest(), TECH)).toMatchObject({ opened: false, reasonCodes: [EIE_REASON.SEAL_SIGNER_UNAVAILABLE] });
  });
});

describe("IAQ disposition", () => {
  it("no IAQ channel is admissible until the s04 \"IAQ channels\" set is defined; IAQ fails closed", async () => {
    const schema = JSON.parse(readFileSync(new URL("../../schemas/eie-node-observation.schema.json", import.meta.url), "utf8"));
    expect((schema.properties.channel.enum as string[]).filter((c) => /IAQ|CO2|PM|VOC/i.test(c))).toEqual([]);
    const { recorder } = makeRecorder();
    const result = await recorder.openWindow(baselineRequest({ admittedChannels: ["IAQ_CO2" as never] }), TECH);
    expect(result).toMatchObject({ opened: false });
    expect(!result.opened && result.reasonCodes).toContain(EIE_REASON.CHANNEL_NOT_ADMITTED);
  });
});
