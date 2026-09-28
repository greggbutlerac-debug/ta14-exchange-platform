/**
 * TA-14-EIE-ARCH-1.0 s05 Analyzer calculation engine (Phase 2A).
 *
 * SEALED EVIDENCE -> GOVERNED CALCULATION -> ATTRIBUTABLE CALCULATION RESULT.
 *
 * The engine binds inputs only from sealed, verified, INTACT Recorder windows (read through the
 * EvidenceReader port) or from earlier results that replay, resolves the governing CRR-1 reference,
 * runs a pure function, and records complete lineage. Anything missing, unverified, degraded, broken,
 * corrected, simulated-in-production, unit-incompatible, out of domain, unimplemented or ungoverned
 * yields CALCULATION NOT ESTABLISHED with reason codes: never an exception, never a partial output.
 *
 * Calculation != interpretation. Results carry no comparison, threshold, determination or authority.
 * Results are independent of wall-clock time, so replay reproduces the result hash.
 */
import { canonicalJson } from "../../canonical-json";
import { objectHash } from "../chain";
import { EIE_REASON } from "../reason-codes";
import type { RecorderKeyResolver } from "../signer";
import { EIE_ARCHITECTURE_FINGERPRINT } from "../spec-guard";
import { verifyWindow } from "../verify";
import type { EvidenceWindow, ObservationRecord } from "../types";
import type {
  CalculationFunction, CalculationOutput, CalculationRequest, CalculationResult, EvidenceMode, InputBinding,
  ObservationInput, PriorResultInput, WindowInput,
} from "./contract";
import { resolveReference, type CrrRegistry } from "./crr/registry";
import type { CrrEntry } from "./crr/types";
import type { EvidenceReader } from "./evidence-reader";

export const ANALYZER_VERSION = "EIE-ANALYZER-PHASE-2A-1.0.0";

export interface AnalyzerContext {
  analyzerId: string;
  mode: EvidenceMode;
  registry: CrrRegistry;
  catalogue: readonly CalculationFunction[];
  evidence: EvidenceReader;
  resolveRecorderKey: RecorderKeyResolver;
  priorResults?: readonly CalculationResult[];
}

const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function requestValid(request: unknown): request is CalculationRequest {
  if (!isRecord(request) || !nonEmpty(request.functionId) || !nonEmpty(request.functionVersion) || !nonEmpty(request.referenceId)) return false;
  if (!isRecord(request.requestedBy) || !nonEmpty(request.requestedBy.id) || !nonEmpty(request.requestedBy.role)) return false;
  if (!Array.isArray(request.inputs)) return false;
  const names = new Set<string>();
  for (const b of request.inputs as unknown[]) {
    if (!isRecord(b) || !nonEmpty(b.name) || names.has(b.name)) return false;
    names.add(b.name);
    if (b.kind === "WINDOW_CHANNEL") {
      if (!nonEmpty(b.windowId) || !nonEmpty(b.channel) || !isRecord(b.source) || !nonEmpty(b.source.provider) || !nonEmpty(b.source.deviceId)) return false;
    } else if (b.kind === "PRIOR_RESULT") {
      if (!nonEmpty(b.resultHash) || !nonEmpty(b.output)) return false;
    } else return false;
  }
  return true;
}

function canonicalCopy<T>(value: T): T | null {
  try {
    return JSON.parse(canonicalJson(value)) as T;
  } catch {
    return null;
  }
}

function withoutHash(result: CalculationResult): Omit<CalculationResult, "resultHash"> {
  const { resultHash: _omit, ...body } = result;
  return body;
}

export async function calculate(requestInput: CalculationRequest, ctx: AnalyzerContext): Promise<CalculationResult> {
  const codes = new Set<string>();
  const copied = canonicalCopy(requestInput);
  const valid = copied !== null && requestValid(copied);
  const request: CalculationRequest = valid
    ? copied
    : { functionId: "", functionVersion: "", referenceId: "", inputs: [], requestedBy: { role: "TECHNICIAN", id: "" } };
  if (!valid) codes.add(EIE_REASON.CALC_REQUEST_INVALID);

  const fn = ctx.catalogue.find((f) => f.functionId === request.functionId && f.functionVersion === request.functionVersion);
  if (valid && !fn) codes.add(EIE_REASON.CALC_FUNCTION_UNKNOWN);
  if (fn?.synthetic && ctx.mode === "PRODUCTION") codes.add(EIE_REASON.REF_SYNTHETIC_IN_PRODUCTION);

  const resolution = valid && fn ? resolveReference(ctx.registry, request.referenceId, fn.role, ctx.mode) : null;
  if (resolution && !resolution.ok) resolution.reasonCodes.forEach((c) => codes.add(c));
  const entry: CrrEntry | null = resolution?.entry ?? null;

  if (fn && (!fn.compute || !fn.implementation)) codes.add(EIE_REASON.CALC_FUNCTION_NOT_IMPLEMENTED).add(EIE_REASON.REF_IMPLEMENTATION_UNVERIFIED);
  if (fn?.implementation && entry && canonicalJson(entry.implementation) !== canonicalJson(fn.implementation)) codes.add(EIE_REASON.REF_IMPLEMENTATION_UNVERIFIED);
  if (fn?.requiresSaturationConvention && entry?.saturationConvention?.status !== "ESTABLISHED") codes.add(EIE_REASON.REF_CONVENTION_NOT_ESTABLISHED);

  // ── Input binding: sealed, verified, INTACT windows and replayable prior results only ──
  const windows = new Map<string, WindowInput>();
  const observations: ObservationInput[] = [];
  const priorResults: PriorResultInput[] = [];
  const byBinding: Record<string, ObservationInput[]> = {};
  const priorByBinding: Record<string, PriorResultInput> = {};

  if (valid && fn?.inputs) {
    const required = new Map(fn.inputs.map((i) => [i.name, i.kind]));
    for (const b of request.inputs) if (required.get(b.name) !== b.kind) codes.add(EIE_REASON.CALC_REQUEST_INVALID);
    for (const name of required.keys()) if (!request.inputs.some((b) => b.name === name)) codes.add(EIE_REASON.CALC_INPUT_MISSING);

    for (const binding of request.inputs) {
      if (binding.kind === "WINDOW_CHANNEL") await bindWindowChannel(binding, ctx, codes, windows, observations, byBinding);
      else await bindPriorResult(binding, ctx, codes, priorResults, priorByBinding);
    }
  }

  const evidenceMode: EvidenceMode =
    [...windows.values()].some((w) => w.recorderMode === "SIMULATION")
    || observations.some((o) => o.acquisitionMethod === "SIMULATED")
    || priorResults.some((p) => ctx.priorResults?.find((r) => r.resultHash === p.resultHash)?.evidenceMode === "SIMULATION")
      ? "SIMULATION" : "PRODUCTION";
  if (ctx.mode === "PRODUCTION" && evidenceMode === "SIMULATION") codes.add(EIE_REASON.CALC_INPUT_SIMULATED_IN_PRODUCTION);
  if (entry?.kind === "SYNTHETIC" && evidenceMode === "PRODUCTION") codes.add(EIE_REASON.REF_SYNTHETIC_IN_PRODUCTION);

  // ── Units and valid domain, exactly as the governing reference declares them ──
  const outputUnits: Record<string, string> = {};
  if (entry && fn?.inputs) {
    if (entry.units.status !== "ESTABLISHED") codes.add(EIE_REASON.REF_UNCONFIRMED);
    else {
      for (const { name } of fn.inputs) {
        const declared = entry.units.value.inputs[name];
        const units = [...(byBinding[name] ?? []).map((o) => o.unit), ...(priorByBinding[name] ? [priorByBinding[name].unit] : [])];
        if (declared === undefined) codes.add(EIE_REASON.CALC_UNIT_INCOMPATIBLE);
        else if (declared === "SINGLE_DECLARED_UNIT" ? new Set(units).size > 1 : units.some((u) => u !== declared)) codes.add(EIE_REASON.CALC_UNIT_INCOMPATIBLE);
      }
      const inputUnit = observations[0]?.unit ?? priorResults[0]?.unit ?? "";
      for (const [name, unit] of Object.entries(entry.units.value.outputs)) outputUnits[name] = unit === "INPUT_UNIT" ? inputUnit : unit;
    }
    if (entry.validDomain.status !== "ESTABLISHED") codes.add(EIE_REASON.REF_OUT_OF_DOMAIN);
    else {
      const domain = entry.validDomain.value;
      const values = [...observations.map((o) => [o.unit, o.value] as const), ...priorResults.map((p) => [p.unit, p.value] as const)];
      for (const [unit, value] of values) {
        const bounds = Object.hasOwn(domain, unit) ? domain[unit] : undefined;
        if (!Number.isFinite(value) || (bounds && ((bounds.min !== null && value < bounds.min) || (bounds.max !== null && value > bounds.max)))) {
          codes.add(EIE_REASON.REF_OUT_OF_DOMAIN);
        }
      }
    }
  }

  // ── Pure calculation ──
  let outputs: CalculationOutput[] = [];
  if (codes.size === 0 && fn?.compute && entry) {
    const uncertaintyMethod = entry.uncertaintyMethod.status === "ESTABLISHED" ? entry.uncertaintyMethod.value : null;
    try {
      const computed = fn.compute({ observations: byBinding, priorResults: priorByBinding }, { uncertaintyMethod, units: outputUnits });
      if ("notEstablished" in computed) codes.add(EIE_REASON.CALC_INPUT_MISSING);
      else if (!outputsValid(computed.outputs, outputUnits, uncertaintyMethod)) codes.add(EIE_REASON.CALC_OUTPUT_INVALID);
      else outputs = canonicalCopy(computed.outputs) ?? [];
    } catch {
      codes.add(EIE_REASON.CALC_OUTPUT_INVALID);
    }
  }
  if (codes.size > 0) {
    codes.add(EIE_REASON.CALCULATION_NOT_ESTABLISHED);
    outputs = [];
  }

  const body: Omit<CalculationResult, "resultHash"> = {
    contract: "TA-14-EIE-ARCH-1.0/s05",
    architectureFingerprint: EIE_ARCHITECTURE_FINGERPRINT,
    analyzer: { analyzerId: ctx.analyzerId, analyzerVersion: ANALYZER_VERSION, mode: ctx.mode },
    request,
    function: { functionId: request.functionId, functionVersion: request.functionVersion, catalogueItem: fn?.catalogueItem ?? null, implementation: fn?.implementation ?? null },
    reference: {
      referenceId: request.referenceId,
      kind: entry?.kind ?? null,
      role: entry?.role ?? null,
      entryHash: resolution?.entryHash ?? null,
      activationState: resolution?.state?.activation.state ?? null,
      calculationVersion: entry?.calculationVersion ?? null,
      locators: entry ? [...entry.locators] : [],
    },
    evidenceMode,
    inputs: {
      windows: [...windows.values()].sort((a, b) => a.windowId.localeCompare(b.windowId)),
      observations: observations.sort((a, b) => a.binding.localeCompare(b.binding) || a.windowId.localeCompare(b.windowId) || a.windowSeq - b.windowSeq),
      priorResults: priorResults.sort((a, b) => a.binding.localeCompare(b.binding)),
    },
    assumptions: entry ? [...entry.assumptions] : [],
    status: codes.size === 0 ? "ESTABLISHED" : "NOT_ESTABLISHED",
    outputs,
    reasonCodes: [...codes].sort(),
  };
  return { ...body, resultHash: objectHash(body) };
}

function outputsValid(outputs: CalculationOutput[], units: Record<string, string>, uncertaintyMethod: string | null): boolean {
  const names = new Set<string>();
  for (const o of outputs) {
    if (!nonEmpty(o.name) || names.has(o.name) || !Number.isFinite(o.value) || !nonEmpty(o.unit) || units[o.name] !== o.unit) return false;
    names.add(o.name);
    const u = o.uncertainty;
    if (u.status === "PROPAGATED") {
      if (uncertaintyMethod === null || u.methodRef !== uncertaintyMethod || !Number.isFinite(u.value) || !nonEmpty(u.unit)) return false;
    } else if (u.status !== "NOT_PROPAGATED" || !nonEmpty(u.reason)) return false;
  }
  return names.size === Object.keys(units).length;
}

async function readVerifiedWindow(windowId: string, ctx: AnalyzerContext): Promise<{ window?: EvidenceWindow; code?: string }> {
  let window: EvidenceWindow | undefined;
  try {
    window = await ctx.evidence.readWindow(windowId);
  } catch {
    return { code: EIE_REASON.CALC_INPUT_UNVERIFIED };
  }
  if (!window) return { code: EIE_REASON.CALC_INPUT_MISSING };
  if (window.sealHash === null) return { code: EIE_REASON.CALC_INPUT_UNSEALED };
  if (!verifyWindow(window, ctx.resolveRecorderKey).valid) return { code: EIE_REASON.CALC_INPUT_UNVERIFIED };
  return { window };
}

async function bindWindowChannel(
  binding: Extract<InputBinding, { kind: "WINDOW_CHANNEL" }>, ctx: AnalyzerContext, codes: Set<string>,
  windows: Map<string, WindowInput>, observations: ObservationInput[], byBinding: Record<string, ObservationInput[]>,
): Promise<void> {
  const { window, code } = await readVerifiedWindow(binding.windowId, ctx);
  if (!window) { codes.add(code!); return; }
  // Only the continuity state the Phase 2A contract permits enters calculation: INTACT. DEGRADED and BROKEN fail closed.
  if (window.continuityStatus !== "INTACT") codes.add(EIE_REASON.CALC_INPUT_CONTINUITY);
  windows.set(window.windowId, {
    windowId: window.windowId, headerHash: window.headerHash, sealHash: window.sealHash!, recorderMode: window.recorderMode,
    purpose: window.purpose, assetId: window.assetId, continuityStatus: window.continuityStatus,
  });

  // Admitted evidence only: OBSERVATION entries. Premature pressure entries and rejected submissions are never inputs.
  const bound = window.entries.filter((e): e is ObservationRecord => e.kind === "OBSERVATION"
    && e.observation.channel === binding.channel
    && e.observation.source.provider === binding.source.provider && e.observation.source.deviceId === binding.source.deviceId);
  if (bound.length === 0) { codes.add(EIE_REASON.CALC_INPUT_MISSING); return; }

  // A corrected observation is never used, and its replacement is never substituted silently.
  const boundHashes = new Set(bound.map((e) => e.entryHash));
  let assetWindowIds: readonly string[] = [];
  try {
    assetWindowIds = await ctx.evidence.listAssetWindowIds(window.assetId);
  } catch {
    codes.add(EIE_REASON.CALC_INPUT_UNVERIFIED);
  }
  for (const id of assetWindowIds) {
    let other: EvidenceWindow | undefined;
    try {
      other = id === window.windowId ? window : await ctx.evidence.readWindow(id);
    } catch {
      codes.add(EIE_REASON.CALC_INPUT_UNVERIFIED);
      continue;
    }
    if (other?.entries.some((e) => e.kind === "CORRECTION" && boundHashes.has(e.correctsEntryHash))) codes.add(EIE_REASON.CALC_INPUT_CORRECTED);
  }

  const inputs = bound.map((e): ObservationInput => ({
    binding: binding.name, windowId: window.windowId, windowSeq: e.windowSeq, entryHash: e.entryHash,
    observationId: e.observation.observationId, observationHash: e.observationHash, value: e.observation.value, unit: e.observation.unit,
    observedAt: e.observation.observedAt, acquisitionMethod: e.observation.acquisitionMethod, accuracyOrUncertainty: e.observation.accuracyOrUncertainty,
  }));
  observations.push(...inputs);
  byBinding[binding.name] = inputs;
}

async function bindPriorResult(
  binding: Extract<InputBinding, { kind: "PRIOR_RESULT" }>, ctx: AnalyzerContext, codes: Set<string>,
  priorResults: PriorResultInput[], priorByBinding: Record<string, PriorResultInput>,
): Promise<void> {
  const prior = ctx.priorResults?.find((r) => r.resultHash === binding.resultHash);
  if (!prior) { codes.add(EIE_REASON.CALC_INPUT_MISSING); return; }
  const replay = await verifyCalculation(prior, ctx);
  if (!replay.valid || prior.status !== "ESTABLISHED") { codes.add(EIE_REASON.CALC_PRIOR_RESULT_INVALID); return; }
  const output = prior.outputs.find((o) => o.name === binding.output);
  if (!output) { codes.add(EIE_REASON.CALC_INPUT_MISSING); return; }
  const input: PriorResultInput = { binding: binding.name, resultHash: prior.resultHash, output: output.name, value: output.value, unit: output.unit, uncertainty: output.uncertainty };
  priorResults.push(input);
  priorByBinding[binding.name] = input;
}

export interface CalculationVerification {
  valid: boolean;
  reasonCodes: string[];
  replayHash: string | null;
}

/** Replays a result from the governed evidence and registry; valid only if the replay reproduces its hash exactly. */
export async function verifyCalculation(result: CalculationResult, ctx: AnalyzerContext): Promise<CalculationVerification> {
  if (!isRecord(result) || objectHash(withoutHash(result)) !== result.resultHash) {
    return { valid: false, reasonCodes: [EIE_REASON.HASH_MISMATCH], replayHash: null };
  }
  if (result.analyzer.analyzerVersion !== ANALYZER_VERSION || result.analyzer.mode !== ctx.mode) {
    return { valid: false, reasonCodes: [EIE_REASON.LINEAGE_BROKEN], replayHash: null };
  }
  const replay = await calculate(result.request, { ...ctx, analyzerId: result.analyzer.analyzerId });
  const valid = replay.resultHash === result.resultHash;
  return { valid, reasonCodes: valid ? [] : [EIE_REASON.LINEAGE_BROKEN], replayHash: replay.resultHash };
}
