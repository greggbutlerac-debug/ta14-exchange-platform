/**
 * TA-14-EIE-ARCH-1.0 s03 Environmental Integrity Recorder: evidence-window core.
 *
 * The Recorder creates, sequences, seals and closes evidence windows on defined triggers,
 * accepts attributable submissions, records continuity under a governed continuity profile, and
 * preserves C1-R7 receipts produced by the configured Gate A engine (s09). It preserves evidence
 * only: it never interprets, calculates, diagnoses, decides admissibility, grants authority or
 * commands execution, and no submitter can alter what it preserved.
 *
 * The Recorder holds no authoritative state: every operation re-derives window state from the
 * append-only store.
 */
import { canonicalJson } from "../canonical-json";
import { STATE_EVENT_TYPES } from "../niret/invalidation";
import { computeEntryHash, frozenCopy, objectHash } from "./chain";
import { established, GOVERNED_CONTINUITY_PROFILES, resolveContinuityProfile, type ContinuityProfileRegistry } from "./continuity-profile";
import { bindGateAReceipt, gateAReceiptIntact, type PreservedWindow } from "./gate-a-binding";
import { validateObservation } from "./observation";
import { EIE_REASON } from "./reason-codes";
import type { RecorderKeyResolver, RecorderSealSigner } from "./signer";
import { buildGateAInput, receiptCitesManifest, type GateAInputRequest } from "./gate-a-input/adapter";
import { EIE_ARCHITECTURE_FINGERPRINT } from "./spec-guard";
import { AppendOnlyViolation, InMemoryEvidenceStore, type EvidenceStore, type StoredWindow, type WindowSeal } from "./store";
import { MS_PER_SECOND, parseInstant } from "./time";
import {
  CHANNELS, ENTRY_KINDS, EVENT_KINDS, OPEN_TRIGGERS, REFRIGERANT_PRESSURE_CHANNELS, WINDOW_PURPOSES,
  type Channel, type ChainRecord, type CloseTrigger, type ContinuityEffect, type ContinuityStatus, type CorrectionRecord,
  type EvidenceWindow, type EventRecord, type GapRecord, type GateAReceiptRecord, type MaterialChangeRecord,
  type NodeObservation, type ObservationRecord, type OpenTriggerType, type OpenWindowRequest, type Outcome,
  type PrematurePressureRecord, type RecorderMode, type RejectedSubmissionRecord, type Submitter, type SubmitterRole,
  type WindowHeader, type WindowPurpose,
} from "./types";

/**
 * The configured C1-R7 engine (trusted server wiring, fixed at construction; never per request).
 * It returns the canonical C1-R7 receipt for a Gate A input evaluated at `now`.
 */
export type GateAEvaluator = (input: unknown, context: { now: Date }) => unknown;

export interface RecorderOptions {
  recorderId: string;
  mode: RecorderMode;
  /** Recorder clock (s18: authoritative). Must return zoned ISO 8601. */
  clock: () => string;
  /** Seal signer. null means no key custody is established: no window can open. */
  signer: RecorderSealSigner | null;
  store?: EvidenceStore;
  gateAEvaluator?: GateAEvaluator;
  profileRegistry?: ContinuityProfileRegistry;
  /** Trusted Recorder public keys, used to re-verify sealed evidence windows before they supply Gate A input. */
  resolveRecorderKey?: RecorderKeyResolver;
  /** When set, a sealed evidence window supplies Gate A input only if an independent witness binds its exact seal. */
  evidenceWitness?: (window: EvidenceWindow) => Promise<boolean>;
  /**
   * When set, a Gate A evaluation proceeds only if the declared equipment identity exactly equals the
   * asset's independently verified nameplate transcriptions. Returns reason codes (empty = consistent).
   */
  assetIdentity?: (assetId: string, declared: unknown) => Promise<string[]>;
}

/** Phase 1 enables Node and technician submissions only; Analyzer and Governor do not exist yet. */
const ENABLED_ROLES: ReadonlySet<SubmitterRole> = new Set(["NODE", "TECHNICIAN"]);

/** s03 openTriggers. GATE_B_COMMIT and GOVERNOR_TERMINATION have no implemented issuer in Phase 1. */
const TRIGGER_PURPOSES: Readonly<Record<OpenTriggerType, readonly WindowPurpose[]>> = {
  SESSION_START: ["BASELINE_NONINVASIVE"],
  SCHEDULE: ["CONTINUOUS"],
  GATE_A_ALLOW_RECEIPT: ["PRESSURE_EVIDENCE"],
  GATE_B_COMMIT: [],
  GOVERNOR_TERMINATION: [],
};

const REQUEST_KEYS = new Set(["purpose", "assetId", "openTrigger", "admittedChannels", "admittedSources", "continuityProfile", "predecessorWindowIds"]);
const TRIGGER_KEYS = new Set(["type", "ref"]);
const GATE_A_STATE_EVENTS: ReadonlySet<string> = new Set(STATE_EVENT_TYPES);

interface StreamState {
  sequence: number;
  observedAtMs: number;
  observedAt: string;
}

interface Loaded extends StoredWindow {
  windowId: string;
  records: ChainRecord[];
  seal: WindowSeal | undefined;
}

type Unhashed<T extends ChainRecord> = Omit<T, "windowId" | "windowSeq" | "recordedAt" | "prevEntryHash" | "entryHash">;

const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const sameSubmitter = (a: unknown, b: Submitter) => isRecord(a) && a.role === b.role && a.id === b.id;
const streamKey = (o: NodeObservation) => canonicalJson([o.source.provider, o.source.deviceId, o.channel]);
const sourceKey = (s: { provider: string; deviceId: string }) => canonicalJson([s.provider, s.deviceId]);

function tryHash(value: unknown): { copy: unknown; hash: string | null } {
  try {
    const copy = JSON.parse(canonicalJson(value));
    return { copy, hash: objectHash(copy) };
  } catch {
    return { copy: null, hash: null };
  }
}

/** Continuity status derived from preserved records (BROKEN takes precedence over DEGRADED). */
export function continuityStatusOf(records: readonly ChainRecord[]): ContinuityStatus {
  if (records.some((r) => r.kind === "GAP")) return "BROKEN";
  if (records.some((r) => r.kind === "REJECTED_SUBMISSION" && r.continuityEffect === "DEGRADED")) return "DEGRADED";
  return "INTACT";
}

function streamsOf(records: readonly ChainRecord[]): Map<string, StreamState> {
  const streams = new Map<string, StreamState>();
  for (const r of records) {
    if (r.kind !== "OBSERVATION") continue;
    streams.set(streamKey(r.observation), { sequence: r.observation.sequence, observedAtMs: parseInstant(r.observation.observedAt)!, observedAt: r.observation.observedAt });
  }
  return streams;
}

export class EvidenceRecorder {
  readonly #options: RecorderOptions;
  readonly #store: EvidenceStore;

  constructor(options: RecorderOptions) {
    if (!nonEmpty(options.recorderId)) throw new Error("recorderId is required");
    this.#options = options;
    this.#store = options.store ?? new InMemoryEvidenceStore();
  }

  #clockMs(): { iso: string; ms: number } {
    const iso = this.#options.clock();
    const ms = parseInstant(iso);
    if (ms === null) throw new Error("Recorder clock returned an unparseable time");
    return { iso, ms };
  }

  /** Recorder time for a window; refuses to record if it precedes what the window already preserved. */
  #now(window: Loaded): { iso: string; ms: number } {
    const now = this.#clockMs();
    const last = window.records.at(-1)?.recordedAt ?? window.header.openedAt;
    if (now.ms < parseInstant(last)!) throw new Error("Recorder clock moved backwards; recording refused");
    return now;
  }

  async #load(windowId: string): Promise<Loaded | undefined> {
    const stored = await this.#store.readWindow(windowId);
    if (!stored) return undefined;
    const [records, seal] = await Promise.all([this.#store.readRecords(windowId), this.#store.readSeal(windowId)]);
    return { ...stored, windowId, records: [...records], seal };
  }

  async #preserved(windowId: string): Promise<PreservedWindow | undefined> {
    const w = await this.#load(windowId);
    return w && { windowId, header: w.header, headerHash: w.headerHash, records: w.records, sealed: w.seal !== undefined };
  }

  async openWindow(request: OpenWindowRequest, submitter: Submitter):
    Promise<{ opened: true; windowId: string; window: EvidenceWindow } | { opened: false; reasonCodes: string[] }> {
    const codes = new Set<string>();
    if (!isRecord(request) || Object.keys(request).some((k) => !REQUEST_KEYS.has(k))
      || !isRecord(request.openTrigger) || Object.keys(request.openTrigger).some((k) => !TRIGGER_KEYS.has(k))) {
      return { opened: false, reasonCodes: [EIE_REASON.REQUEST_INVALID] };
    }
    if (!ENABLED_ROLES.has(submitter.role)) codes.add(EIE_REASON.ROLE_NOT_ENABLED);
    const signer = this.#options.signer;
    if (!signer || (signer.development && this.#options.mode !== "SIMULATION")) codes.add(EIE_REASON.SEAL_SIGNER_UNAVAILABLE);

    const { purpose, openTrigger } = request;
    const triggerOk = WINDOW_PURPOSES.includes(purpose) && OPEN_TRIGGERS.includes(openTrigger.type)
      && nonEmpty(openTrigger.ref) && nonEmpty(request.assetId) && TRIGGER_PURPOSES[openTrigger.type].includes(purpose);
    if (!triggerOk) codes.add(EIE_REASON.TRIGGER_INVALID);

    const profile = resolveContinuityProfile(request.continuityProfile, this.#options.mode, this.#options.profileRegistry ?? GOVERNED_CONTINUITY_PROFILES);
    if (!profile.ok) profile.reasonCodes.forEach((c) => codes.add(c));
    else if (!profile.profile.applicability.purposes.includes(purpose)
      || !Array.isArray(request.admittedChannels) || request.admittedChannels.some((c) => !profile.profile.applicability.channels.includes(c))) {
      codes.add(EIE_REASON.PROFILE_NOT_APPLICABLE);
    }

    const channels = request.admittedChannels;
    if (!Array.isArray(channels) || channels.length === 0 || !channels.every((c) => CHANNELS.includes(c))
      || (purpose !== "PRESSURE_EVIDENCE" && channels.some((c) => REFRIGERANT_PRESSURE_CHANNELS.has(c)))) {
      codes.add(EIE_REASON.CHANNEL_NOT_ADMITTED);
    }
    const sources = request.admittedSources;
    if (!Array.isArray(sources) || sources.length === 0 || !sources.every((s) => isRecord(s) && nonEmpty(s.provider) && nonEmpty(s.deviceId))) {
      codes.add(EIE_REASON.SOURCE_UNIDENTIFIED);
    }

    const predecessors: PreservedWindow[] = [];
    for (const id of Array.isArray(request.predecessorWindowIds) ? request.predecessorWindowIds : [null]) {
      const window = typeof id === "string" ? await this.#preserved(id) : undefined;
      if (!window?.sealed) codes.add(EIE_REASON.LINEAGE_BROKEN);
      else predecessors.push(window);
    }

    const now = this.#clockMs();
    let receipt: GateAReceiptRecord | null = null;
    let receiptWindowId: string | null = null;
    if (triggerOk && openTrigger.type === "GATE_A_ALLOW_RECEIPT") {
      const assetWindows = (await Promise.all((await this.#store.listWindowIds(request.assetId)).map((id) => this.#preserved(id))))
        .filter((w): w is PreservedWindow => w !== undefined);
      const binding = bindGateAReceipt(openTrigger.ref, request.assetId, predecessors, assetWindows, now.ms);
      if (binding.ok) {
        receipt = binding.record;
        receiptWindowId = binding.windowId;
      } else {
        codes.add(EIE_REASON.TRIGGER_INVALID);
        binding.reasonCodes.forEach((c) => codes.add(c));
      }
    }

    if (codes.size > 0 || !profile.ok) return { opened: false, reasonCodes: [...codes].sort() };

    const header: WindowHeader = {
      contract: "TA-14-EIE-ARCH-1.0/s03",
      architectureFingerprint: EIE_ARCHITECTURE_FINGERPRINT,
      recorderId: this.#options.recorderId,
      recorderMode: this.#options.mode,
      purpose,
      assetId: request.assetId,
      openTrigger: {
        type: openTrigger.type,
        ref: openTrigger.ref,
        gateAReceiptId: receipt?.receiptId ?? null,
        gateAReceiptContentHash: receipt?.receiptContentHash ?? null,
        gateAReceiptWindowId: receiptWindowId,
        gateAReceiptEntryHash: receipt?.entryHash ?? null,
      },
      openedAt: now.iso,
      openedBy: { role: submitter.role, id: submitter.id },
      admittedChannels: [...channels],
      admittedSources: sources.map((s) => ({ provider: s.provider, deviceId: s.deviceId })),
      continuityProfile: profile.profile,
      continuityProfileHash: profile.profileHash,
      predecessorWindowIds: [...request.predecessorWindowIds],
      predecessorSealHashes: await Promise.all(request.predecessorWindowIds.map(async (id) => (await this.#store.readSeal(id))!.sealHash)),
    };
    const headerHash = objectHash(header);
    const windowId = `EIE-WIN-${headerHash}`;
    try {
      await this.#store.appendWindow(windowId, header, headerHash);
    } catch (error) {
      if (error instanceof AppendOnlyViolation) return { opened: false, reasonCodes: [EIE_REASON.REPLAY] };
      throw error;
    }
    return { opened: true, windowId, window: (await this.getWindow(windowId))! };
  }

  /** Appends one chain record with predecessor linkage and entry hash, extending the loaded view. */
  async #append<T extends ChainRecord>(window: Loaded, recordedAt: string, fields: Unhashed<T>): Promise<T> {
    const prevEntryHash = window.records.at(-1)?.entryHash ?? window.headerHash;
    const unhashed = { ...fields, windowId: window.windowId, windowSeq: window.records.length + 1, recordedAt, prevEntryHash };
    const record = { ...unhashed, entryHash: computeEntryHash(prevEntryHash, unhashed) } as unknown as T;
    await this.#store.appendRecord(record);
    window.records.push(record);
    return frozenCopy(record);
  }

  async #reject(window: Loaded, recordedAt: string, submitter: Submitter, submissionType: RejectedSubmissionRecord["submissionType"],
    submission: unknown, reasonCodes: Iterable<string>, continuityEffect: ContinuityEffect = "NONE") {
    const { copy, hash } = tryHash(submission);
    const codes = [...new Set(reasonCodes)].sort();
    const record = await this.#append<RejectedSubmissionRecord>(window, recordedAt, {
      kind: "REJECTED_SUBMISSION", submittedBy: { ...submitter }, submissionType, submission: copy, submissionHash: hash, reasonCodes: codes, continuityEffect,
    });
    return { accepted: false as const, record, reasonCodes: codes };
  }

  /** The window if it is open, after sealing it when its established timeout has elapsed. */
  async #openFor(windowId: string): Promise<{ window: Loaded } | { reasonCodes: string[] }> {
    const window = await this.#load(windowId);
    if (!window) return { reasonCodes: [EIE_REASON.WINDOW_UNKNOWN] };
    if (window.seal || (await this.#sealIfTimedOut(window))) return { reasonCodes: [EIE_REASON.WINDOW_CLOSED] };
    return { window };
  }

  async submitObservation(windowId: string, raw: unknown, submitter: Submitter): Promise<Outcome<ObservationRecord>> {
    const found = await this.#openFor(windowId);
    if (!("window" in found)) return { accepted: false, record: null, reasonCodes: found.reasonCodes };
    const { window } = found;
    const { header } = window;
    const profile = header.continuityProfile;
    const now = this.#now(window);

    const codes = new Set<string>();
    if (submitter.role !== "NODE") codes.add(EIE_REASON.ATTRIBUTION_MISMATCH);
    const validation = validateObservation(raw, this.#options.mode);
    if (!validation.ok) {
      validation.reasonCodes.forEach((c) => codes.add(c));
      return this.#reject(window, now.iso, submitter, "OBSERVATION", raw, codes);
    }
    const { observation, observationHash } = validation;

    // s04 / C1-R7 A1: pressure observed outside a PRESSURE_EVIDENCE window is recorded as premature entry, never admitted.
    if (REFRIGERANT_PRESSURE_CHANNELS.has(observation.channel) && header.purpose !== "PRESSURE_EVIDENCE") {
      const reasonCodes = [...codes, EIE_REASON.PRESSURE_OUTSIDE_WINDOW].sort();
      const record = await this.#append<PrematurePressureRecord>(window, now.iso, {
        kind: "PREMATURE_PRESSURE_ENTRY", submittedBy: { ...submitter }, observation, observationHash, reasonCodes,
      });
      return { accepted: false, record, reasonCodes };
    }

    if (!header.admittedChannels.includes(observation.channel)) codes.add(EIE_REASON.CHANNEL_NOT_ADMITTED);
    if (!profile.applicability.acquisitionMethods.includes(observation.acquisitionMethod)) codes.add(EIE_REASON.OBSERVATION_PROFILE_NOT_APPLICABLE);
    if (!header.admittedSources.some((s) => sourceKey(s) === sourceKey(observation.source))) codes.add(EIE_REASON.SOURCE_NOT_ADMITTED);
    if (codes.size > 0) return this.#reject(window, now.iso, submitter, "OBSERVATION", raw, codes);

    // Chronology and duplicates under the governed profile. These anomalies degrade continuity.
    const anomalies = new Set<string>();
    let exactReplay = false;
    const prior = await this.#store.findObservation(observation.observationId);
    if (prior) {
      anomalies.add(EIE_REASON.REPLAY);
      if (prior.observationHash !== observationHash) anomalies.add(EIE_REASON.HASH_MISMATCH);
      else exactReplay = true;
    }
    const observedAtMs = parseInstant(observation.observedAt)!;
    const receivedAtMs = parseInstant(observation.receivedAt)!;
    const leadMs = (established(profile.maxSourceClockLeadSeconds) ?? 0) * MS_PER_SECOND;
    if (receivedAtMs < observedAtMs || receivedAtMs > now.ms + leadMs || observedAtMs < parseInstant(header.openedAt)!) {
      anomalies.add(EIE_REASON.CHRONOLOGY_VIOLATION);
    }
    const maxAge = established(profile.maxObservationAgeSeconds);
    if (maxAge !== null && now.ms - observedAtMs > maxAge * MS_PER_SECOND) anomalies.add(EIE_REASON.STALE);

    const streams = streamsOf(window.records);
    const key = streamKey(observation);
    const last = streams.get(key);
    if (!prior && last) {
      if (observation.sequence === last.sequence) anomalies.add(EIE_REASON.REPLAY).add(EIE_REASON.HASH_MISMATCH);
      else if (observation.sequence < last.sequence || observedAtMs < last.observedAtMs) anomalies.add(EIE_REASON.CHRONOLOGY_VIOLATION);
    }
    if (anomalies.size > 0) {
      const onlyExactReplay = exactReplay && anomalies.size === 1;
      return this.#reject(window, now.iso, submitter, "OBSERVATION", raw, anomalies, onlyExactReplay ? "NONE" : "DEGRADED");
    }

    // Gaps: missing evidence breaks continuity and closes the window.
    const gapCodes: string[] = [];
    const stream = { provider: observation.source.provider, deviceId: observation.source.deviceId, channel: observation.channel };
    const before = { sequence: observation.sequence, observedAt: observation.observedAt };
    const after = last ? { sequence: last.sequence, observedAt: last.observedAt } : null;
    const semantics = established(profile.sequenceSemantics)!;
    if (last && semantics === "CONTIGUOUS_PER_STREAM" && observation.sequence > last.sequence + 1) {
      await this.#append<GapRecord>(window, now.iso, {
        kind: "GAP", submittedBy: null, gapType: "SEQUENCE_GAP", stream, after, before,
        missingSequences: { from: last.sequence + 1, to: observation.sequence - 1 }, gapSeconds: null,
        reasonCodes: [EIE_REASON.CONTINUITY_BROKEN],
      });
      gapCodes.push(EIE_REASON.CONTINUITY_BROKEN);
    }
    const gapMs = observedAtMs - (last ? last.observedAtMs : parseInstant(header.openedAt)!);
    if (gapMs > established(profile.maxGapSeconds)! * MS_PER_SECOND) {
      await this.#append<GapRecord>(window, now.iso, {
        kind: "GAP", submittedBy: null, gapType: "TIME_GAP", stream, after, before,
        missingSequences: null, gapSeconds: gapMs / MS_PER_SECOND, reasonCodes: [EIE_REASON.CONTINUITY_BROKEN],
      });
      gapCodes.push(EIE_REASON.CONTINUITY_BROKEN);
    }

    const record = await this.#append<ObservationRecord>(window, now.iso, {
      kind: "OBSERVATION", submittedBy: { ...submitter }, observation, observationHash,
    });
    if (gapCodes.length > 0) await this.#seal(window, { type: "CONTINUITY_BREAK", ref: record.entryHash, by: null });
    return { accepted: true, record, reasonCodes: [...new Set(gapCodes)] };
  }

  /** Attributable event. The Recorder preserves the payload; it never interprets it. */
  async submitEvent(windowId: string, event: { actor: Submitter; eventKind: string; payload: unknown }, submitter: Submitter): Promise<Outcome<EventRecord>> {
    const found = await this.#openFor(windowId);
    if (!("window" in found)) return { accepted: false, record: null, reasonCodes: found.reasonCodes };
    const { window } = found;
    const now = this.#now(window);
    const codes = new Set<string>();
    if (!ENABLED_ROLES.has(submitter.role)) codes.add(EIE_REASON.ROLE_NOT_ENABLED);
    if (!isRecord(event) || !sameSubmitter(event.actor, submitter)) codes.add(EIE_REASON.ATTRIBUTION_MISMATCH);
    const { copy, hash } = tryHash(isRecord(event) ? event.payload : undefined);
    if (!isRecord(event) || !nonEmpty(event.eventKind) || hash === null) codes.add(EIE_REASON.FIELD_MISSING);
    if (codes.size > 0) return this.#reject(window, now.iso, submitter, "EVENT", event, codes);
    const record = await this.#append<EventRecord>(window, now.iso, {
      kind: "EVENT", submittedBy: { ...submitter }, actor: { ...submitter }, eventKind: event.eventKind, payload: copy,
    });
    return { accepted: true, record, reasonCodes: [] };
  }

  /** Records a C1-R7 validity-terminating state change against the window's asset. */
  async recordMaterialChange(windowId: string, change: { changeType: string; detail: unknown }, submitter: Submitter): Promise<Outcome<MaterialChangeRecord>> {
    const found = await this.#openFor(windowId);
    if (!("window" in found)) return { accepted: false, record: null, reasonCodes: found.reasonCodes };
    const { window } = found;
    const now = this.#now(window);
    const codes = new Set<string>();
    if (!ENABLED_ROLES.has(submitter.role)) codes.add(EIE_REASON.ROLE_NOT_ENABLED);
    if (!isRecord(change) || !GATE_A_STATE_EVENTS.has(change.changeType as string)) codes.add(EIE_REASON.MATERIAL_CHANGE_UNGOVERNED);
    const { copy, hash } = tryHash(isRecord(change) ? change.detail : undefined);
    if (hash === null) codes.add(EIE_REASON.FIELD_MISSING);
    if (codes.size > 0) return this.#reject(window, now.iso, submitter, "MATERIAL_CHANGE", change, codes);
    const record = await this.#append<MaterialChangeRecord>(window, now.iso, {
      kind: "MATERIAL_CHANGE", submittedBy: { ...submitter }, assetId: window.header.assetId, changeType: change.changeType, detail: copy,
    });
    return { accepted: true, record, reasonCodes: [] };
  }

  /**
   * s09: builds the C1-R7 input with the Gate A input adapter from sealed evidence windows that are
   * predecessors of this window, evaluates it with the configured C1-R7 engine, and preserves the receipt
   * together with the adapter's lineage manifest into this baseline window, which then closes on that
   * lifecycle receipt. The Recorder decides nothing: it records what the sole Gate A authority returned,
   * and refuses a receipt that does not cite exactly the measurements the adapter mapped.
   */
  async recordGateAEvaluation(windowId: string, request: GateAInputRequest, submitter: Submitter):
    Promise<{ accepted: true; record: GateAReceiptRecord; window: EvidenceWindow; reasonCodes: [] } | { accepted: false; record: ChainRecord | null; reasonCodes: string[] }> {
    const found = await this.#openFor(windowId);
    if (!("window" in found)) return { accepted: false, record: null, reasonCodes: found.reasonCodes };
    const { window } = found;
    const codes = new Set<string>();
    if (submitter.role !== "TECHNICIAN") codes.add(EIE_REASON.ROLE_NOT_ENABLED);
    if (window.header.purpose !== "BASELINE_NONINVASIVE") codes.add(EIE_REASON.REQUEST_INVALID);
    const evaluator = this.#options.gateAEvaluator;
    if (!evaluator) codes.add(EIE_REASON.GATE_A_EVALUATOR_UNAVAILABLE);
    const resolveKey = this.#options.resolveRecorderKey;
    if (!resolveKey) codes.add(EIE_REASON.EVIDENCE_WINDOW_UNVERIFIED);

    const ids = isRecord(request) && Array.isArray(request.evidenceWindowIds) ? request.evidenceWindowIds : [];
    // Evidence lineage is Recorder-attested: every evidence window must be a sealed predecessor of this window.
    if (ids.some((id) => typeof id !== "string" || !window.header.predecessorWindowIds.includes(id))) codes.add(EIE_REASON.EVIDENCE_WINDOW_NOT_IN_LINEAGE);

    let adapted: ReturnType<typeof buildGateAInput> | null = null;
    if (codes.size === 0 && resolveKey) {
      const evidenceWindows = await Promise.all(ids.map((id) => this.getWindow(id)));
      const witness = this.#options.evidenceWitness;
      if (witness) {
        for (const w of evidenceWindows) if (w && !(await witness(w))) codes.add(EIE_REASON.EVIDENCE_WINDOW_UNWITNESSED);
      }
      if (this.#options.assetIdentity) {
        const declared = isRecord(request) ? request.declared : undefined;
        (await this.#options.assetIdentity(window.header.assetId, declared)).forEach((c) => codes.add(c));
      }
      const assetWindows = (await Promise.all((await this.#store.listWindowIds(window.header.assetId)).map((id) => this.getWindow(id))))
        .filter((w): w is EvidenceWindow => w !== undefined);
      if (codes.size === 0) adapted = buildGateAInput(request, {
        mode: this.#options.mode, assetId: window.header.assetId, evidenceWindows, assetWindows, resolveRecorderKey: resolveKey,
      });
      if (adapted && !adapted.ok) adapted.reasonCodes.forEach((c) => codes.add(c));
    }
    const now = this.#now(window);
    if (codes.size > 0 || !evaluator || !adapted?.ok) return this.#reject(window, now.iso, submitter, "GATE_A_EVALUATION", request, codes);
    const { input, manifest } = adapted;

    let receipt: unknown;
    try {
      receipt = JSON.parse(canonicalJson(evaluator(input, { now: new Date(now.ms) })));
    } catch {
      return this.#reject(window, now.iso, submitter, "GATE_A_EVALUATION", request, [EIE_REASON.GATE_A_EVALUATION_FAILED]);
    }
    if (!gateAReceiptIntact(receipt)) {
      return this.#reject(window, now.iso, submitter, "GATE_A_EVALUATION", request, [EIE_REASON.RECEIPT_INTEGRITY]);
    }
    if (!receiptCitesManifest(receipt, manifest)) {
      return this.#reject(window, now.iso, submitter, "GATE_A_EVALUATION", request, [EIE_REASON.RECEIPT_EVIDENCE_MISMATCH]);
    }
    const record = await this.#append<GateAReceiptRecord>(window, now.iso, {
      kind: "GATE_A_RECEIPT", submittedBy: { ...submitter }, assetId: window.header.assetId, producedBy: "TA-14-NIRET-GA-C1",
      gateAInputHash: manifest.inputHash, inputManifest: manifest, receiptId: receipt.receipt_id, receiptContentHash: receipt.content_hash, receipt,
    });
    await this.#seal(window, { type: "NEXT_LIFECYCLE_RECEIPT", ref: receipt.receipt_id, by: { role: submitter.role, id: submitter.id } });
    return { accepted: true, record, window: (await this.getWindow(windowId))!, reasonCodes: [] };
  }

  /** Correction by new entry: the corrected record is preserved unchanged and referenced by hash. */
  async submitCorrection(
    windowId: string,
    correction: { correctsWindowId: string; correctsEntryHash: string; reason: string; replacement: unknown | null },
    submitter: Submitter,
  ): Promise<Outcome<CorrectionRecord>> {
    const found = await this.#openFor(windowId);
    if (!("window" in found)) return { accepted: false, record: null, reasonCodes: found.reasonCodes };
    const { window } = found;
    const now = this.#now(window);
    const codes = new Set<string>();
    if (!ENABLED_ROLES.has(submitter.role)) codes.add(EIE_REASON.ROLE_NOT_ENABLED);
    if (!isRecord(correction) || !nonEmpty(correction.reason)) codes.add(EIE_REASON.FIELD_MISSING);

    const inLineage = isRecord(correction)
      && (correction.correctsWindowId === windowId || window.header.predecessorWindowIds.includes(correction.correctsWindowId));
    const targetRecords = !inLineage ? [] : correction.correctsWindowId === windowId ? window.records : await this.#store.readRecords(correction.correctsWindowId);
    const target = targetRecords.find((r): r is ObservationRecord => r.kind === "OBSERVATION" && r.entryHash === correction.correctsEntryHash);
    if (!target) codes.add(EIE_REASON.LINEAGE_BROKEN);

    let replacement: NodeObservation | null = null;
    let replacementHash: string | null = null;
    if (isRecord(correction) && correction.replacement !== null) {
      const validation = validateObservation(correction.replacement, this.#options.mode);
      if (!validation.ok) validation.reasonCodes.forEach((c) => codes.add(c));
      else {
        replacement = validation.observation;
        replacementHash = validation.observationHash;
        if (await this.#store.findObservation(replacement.observationId)) codes.add(EIE_REASON.REPLAY);
        if (target && streamKey(replacement) !== streamKey(target.observation)) codes.add(EIE_REASON.LINEAGE_BROKEN);
      }
    }
    if (codes.size > 0) return this.#reject(window, now.iso, submitter, "CORRECTION", correction, codes);

    const record = await this.#append<CorrectionRecord>(window, now.iso, {
      kind: "CORRECTION", submittedBy: { ...submitter }, correctsWindowId: correction.correctsWindowId,
      correctsEntryHash: correction.correctsEntryHash, reason: correction.reason, replacement, replacementHash,
    });
    return { accepted: true, record, reasonCodes: [] };
  }

  /** Closes on a declared end of purpose or the next lifecycle receipt. Other close triggers are Recorder-internal. */
  async closeWindow(windowId: string, trigger: { type: "DECLARED_END_OF_PURPOSE" | "NEXT_LIFECYCLE_RECEIPT"; ref: string | null }, submitter: Submitter):
    Promise<{ closed: true; window: EvidenceWindow } | { closed: false; reasonCodes: string[] }> {
    const found = await this.#openFor(windowId);
    if (!("window" in found)) return { closed: false, reasonCodes: found.reasonCodes };
    const codes = new Set<string>();
    if (!ENABLED_ROLES.has(submitter.role)) codes.add(EIE_REASON.ROLE_NOT_ENABLED);
    const validType = trigger?.type === "DECLARED_END_OF_PURPOSE" || trigger?.type === "NEXT_LIFECYCLE_RECEIPT";
    if (!validType || (trigger.type === "NEXT_LIFECYCLE_RECEIPT" && !nonEmpty(trigger.ref))) codes.add(EIE_REASON.TRIGGER_INVALID);
    if (codes.size > 0) return { closed: false, reasonCodes: [...codes].sort() };
    await this.#seal(found.window, { type: trigger.type, ref: trigger.ref ?? null, by: { role: submitter.role, id: submitter.id } });
    return { closed: true, window: (await this.getWindow(windowId))! };
  }

  /** Seals the window if its profile establishes a timeout that has elapsed. Returns true when it sealed. */
  async closeIfTimedOut(windowId: string): Promise<boolean> {
    const window = await this.#load(windowId);
    return window !== undefined && !window.seal && this.#sealIfTimedOut(window);
  }

  async #sealIfTimedOut(window: Loaded): Promise<boolean> {
    const timeout = established(window.header.continuityProfile.windowTimeoutSeconds);
    if (timeout === null) return false;
    if (this.#clockMs().ms - parseInstant(window.header.openedAt)! <= timeout * MS_PER_SECOND) return false;
    await this.#seal(window, { type: "PROFILE_TIMEOUT", ref: window.header.continuityProfile.profileId, by: null });
    return true;
  }

  async #seal(window: Loaded, closeTrigger: CloseTrigger): Promise<void> {
    const signer = this.#options.signer;
    if (!signer) throw new Error("No Recorder seal signer; sealing refused");
    const now = this.#now(window);
    const maxGapMs = established(window.header.continuityProfile.maxGapSeconds)! * MS_PER_SECOND;
    // Streams silent beyond the profile bound up to closure are gaps too.
    for (const [key, last] of streamsOf(window.records)) {
      const gapMs = now.ms - last.observedAtMs;
      if (gapMs <= maxGapMs) continue;
      const [provider, deviceId, channel] = JSON.parse(key) as [string, string, Channel];
      await this.#append<GapRecord>(window, now.iso, {
        kind: "GAP", submittedBy: null, gapType: "TIME_GAP", stream: { provider, deviceId, channel },
        after: { sequence: last.sequence, observedAt: last.observedAt }, before: null, missingSequences: null,
        gapSeconds: gapMs / MS_PER_SECOND, reasonCodes: [EIE_REASON.CONTINUITY_BROKEN],
      });
    }
    const body = {
      windowId: window.windowId,
      headerHash: window.headerHash,
      closeTrigger,
      closedAt: now.iso,
      continuityStatus: continuityStatusOf(window.records),
      lastEntryHash: window.records.at(-1)?.entryHash ?? window.headerHash,
      entryCount: window.records.length,
    };
    const sealHash = objectHash(body);
    await this.#store.appendSeal({
      windowId: window.windowId, closeTrigger, closedAt: body.closedAt, continuityStatus: body.continuityStatus,
      lastEntryHash: body.lastEntryHash, sealHash,
      recorderSignature: { keyId: signer.keyId, algorithm: signer.algorithm, signature: await signer.sign({ windowId: window.windowId, sealHash }) },
    });
  }

  /** Read-only, frozen export of a window. */
  async getWindow(windowId: string): Promise<EvidenceWindow | undefined> {
    const window = await this.#load(windowId);
    if (!window) return undefined;
    const { records, seal } = window;
    const exported: EvidenceWindow = {
      ...window.header,
      windowId,
      headerHash: window.headerHash,
      entries: records.filter((r) => ENTRY_KINDS.has(r.kind)) as EvidenceWindow["entries"],
      events: records.filter((r) => EVENT_KINDS.has(r.kind)) as EvidenceWindow["events"],
      gaps: records.filter((r) => r.kind === "GAP") as GapRecord[],
      closeTrigger: seal?.closeTrigger ?? null,
      closedAt: seal?.closedAt ?? null,
      continuityStatus: seal?.continuityStatus ?? continuityStatusOf(records),
      lastEntryHash: records.at(-1)?.entryHash ?? window.headerHash,
      sealHash: seal?.sealHash ?? null,
      recorderSignature: seal?.recorderSignature ?? null,
    };
    return frozenCopy(exported);
  }
}
