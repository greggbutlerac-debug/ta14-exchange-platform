/*
 * SYNTHETIC fixtures for TA-14-EIE-ARCH-1.0 Phase 1 tests (s21: synthetic fixtures only).
 * The continuity profile below is a SYNTHETIC_FIXTURE profile. Its numbers are fixture values, not
 * TA-14 doctrine, and it is admissible in SIMULATION mode only. No governed continuity profile exists.
 */
import { generateDevelopmentSigningKey, sha256Canonical } from "../../../packages/crypto/receipts";
import { FROZEN_SPEC_SHA256, GATE_A_SCOPE, GATE_A_VERSION } from "../../../packages/domain/niret/propositions";
import { validityTerminatingConditions } from "../../../packages/domain/niret/invalidation";
import {
  developmentSealSigner, EvidenceRecorder, GATE_A_RECEIPT_ID_PREFIX, InMemoryEvidenceStore, SimulatedNodeAdapter,
  type ContinuityProfile, type ContinuityProfileRegistry, type EvidenceStore, type GateAEvaluator, type NodeObservation,
  type OpenWindowRequest, type RecorderMode, type RecorderSealSigner, type Submitter,
} from "../../../packages/domain/eie";

export const T0 = Date.parse("2026-09-28T14:00:00.000Z");
export const at = (seconds: number) => new Date(T0 + seconds * 1000).toISOString();

const fixtureBound = <T>(value: T) => ({ status: "ESTABLISHED" as const, value, basisRef: "SYNTHETIC-FIXTURE-0" });

export const TEST_PROFILE: ContinuityProfile = {
  profileId: "SYNTHETIC-TEST-PROFILE",
  profileVersion: "0.0.0-test",
  basis: { kind: "SYNTHETIC_FIXTURE", ref: "tests/acceptance/fixtures/eie-simulated.ts" },
  sequenceSemantics: fixtureBound("CONTIGUOUS_PER_STREAM" as const),
  maxGapSeconds: fixtureBound(120),
  maxObservationAgeSeconds: fixtureBound(300),
  maxSourceClockLeadSeconds: fixtureBound(5),
  windowTimeoutSeconds: { status: "NOT_ESTABLISHED", requiredFrom: "SYNTHETIC: no timeout in this fixture" },
};

export const profileWith = (overrides: Partial<ContinuityProfile>): ContinuityProfile => ({ ...structuredClone(TEST_PROFILE), ...overrides });

export const NODE: Submitter = { role: "NODE", id: "NODE-SIM-01" };
export const TECH: Submitter = { role: "TECHNICIAN", id: "TECH-SYNTHETIC-01" };
export const SOURCE = { provider: "SIM-PROVIDER", deviceId: "SIM-PROBE-01" };
export const ASSET = "ASSET-SYNTHETIC-01";

export const LOCATION: NodeObservation["location"] = {
  physical: "return plenum, synthetic",
  class: "A",
  basis: { kind: "GOVERNED_METHOD", ref: "SYNTHETIC-METHOD-0" },
};
export const INSTRUMENT: NodeObservation["instrument"] = {
  id: "SIM-INSTRUMENT-01",
  calibrationOrFitnessRef: "SYNTHETIC-CAL-0",
  fitUntil: "2027-01-01T00:00:00Z",
};

export function simulatedStream(overrides: Partial<ConstructorParameters<typeof SimulatedNodeAdapter>[0]> = {}): NodeObservation[] {
  return new SimulatedNodeAdapter({
    ...SOURCE,
    channel: "RETURN_DRY_BULB",
    unit: "degF",
    values: [75.1, 75.0, 74.9, 74.9],
    firstObservedAt: at(10),
    spacingSeconds: 60,
    firstSequence: 100,
    location: LOCATION,
    instrument: INSTRUMENT,
    accuracyOrUncertainty: { kind: "ACCURACY", value: 0.5, unit: "degF", basisRef: "SYNTHETIC-SPEC-SHEET" },
    ...overrides,
  }).read();
}

/** Controllable Recorder clock. */
export function testClock(startSeconds = 0) {
  let now = T0 + startSeconds * 1000;
  return {
    clock: () => new Date(now).toISOString(),
    set: (seconds: number) => { now = T0 + seconds * 1000; },
    now: () => new Date(now),
  };
}

export const SIGNING_KEY = generateDevelopmentSigningKey("TA14-EIE-TEST-KEY");
export const DEV_SIGNER = developmentSealSigner(SIGNING_KEY);
export const RESOLVE_KEY = (keyId: string) => (keyId === SIGNING_KEY.keyId ? SIGNING_KEY.publicKeyPem : undefined);

export function makeRecorder(opts: {
  mode?: RecorderMode;
  startSeconds?: number;
  store?: EvidenceStore;
  signer?: RecorderSealSigner | null;
  gateAEvaluator?: GateAEvaluator;
  profileRegistry?: ContinuityProfileRegistry;
} = {}) {
  const time = testClock(opts.startSeconds);
  const store = opts.store ?? new InMemoryEvidenceStore();
  const recorder = new EvidenceRecorder({
    recorderId: "EIE-RECORDER-TEST",
    mode: opts.mode ?? "SIMULATION",
    clock: time.clock,
    signer: opts.signer === undefined ? DEV_SIGNER : opts.signer,
    store,
    gateAEvaluator: opts.gateAEvaluator,
    profileRegistry: opts.profileRegistry,
  });
  return { recorder, time, store };
}

export function baselineRequest(overrides: Partial<OpenWindowRequest> = {}): OpenWindowRequest {
  return {
    purpose: "BASELINE_NONINVASIVE",
    assetId: ASSET,
    openTrigger: { type: "SESSION_START", ref: "SESSION-SYNTHETIC-01" },
    admittedChannels: ["RETURN_DRY_BULB", "SUPPLY_DRY_BULB", "AIRFLOW"],
    admittedSources: [SOURCE],
    continuityProfile: TEST_PROFILE,
    predecessorWindowIds: [],
    ...overrides,
  };
}

/**
 * A C1-R7-shaped receipt with a valid content hash, built outside the Gate A engine. Used only to
 * show that such objects are refused on every path; it is never a genuine receipt.
 */
export function forgedGateAReceipt(overrides: Record<string, unknown> = {}) {
  const body: Record<string, unknown> = {
    gate_version: GATE_A_VERSION,
    frozen_spec_sha256: FROZEN_SPEC_SHA256,
    evaluated_at: at(0),
    determination: "ALLOW",
    technical_determination: { determination: "ALLOW" },
    execution_authority: { determination: "ALLOW" },
    scope: GATE_A_SCOPE,
    gate_b_authorized: false,
    validity_terminating_conditions: validityTerminatingConditions(),
    ...overrides,
  };
  const contentHash = sha256Canonical(body);
  return { receipt_id: `${GATE_A_RECEIPT_ID_PREFIX}${contentHash.slice(0, 24).toUpperCase()}`, ...body, content_hash: contentHash };
}
