/**
 * TA-14 EIE Phase 3 — Tier 1 pilot enablement.
 *
 * REAL MANUAL-INSTRUMENT OBSERVATION -> NODE -> RECORDER -> SEALED INTACT WINDOW -> s09 ADAPTER
 * -> REAL C1-R7 EVALUATION -> ATTRIBUTABLE GATE A RECEIPT, with KMS-style custody (stub client, real
 * Ed25519), an independent RFC 3161 witness (SYNTHETIC TSA), governed asset identity and a documented
 * instrument register. The governed OEM registry is the real, empty one: the expected Tier 1 outcome is
 * an attributable HOLD. Profiles, keys, TSA, accounts and equipment here are SYNTHETIC.
 */
import { generateKeyPairSync, randomBytes, sign as edSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  EIE_REASON, InMemoryEvidenceStore, InMemoryWitnessStore, objectHash, publicKeySha256, witnessSealedWindows, KEY_APPROVER_ROLE, KEY_CUSTODIAN_ROLE,
  type ContinuityProfile, type EvidenceWindow, type KeyRecordEvent, type KeyRegistration, type NodeObservation,
} from "../../packages/domain/eie";
import {
  assetEventRefusal, declaredEquipmentConsistency, deriveAsset, deriveInstruments, instrumentEventRefusal, manualObservation, manualSubmitter,
  nextSequence, verifyPilotExport, PILOT_PINNED_CONTINUITY_PROFILES, GOVERNED_MANUAL_CHANNELS,
  type AssetEvent, type InstrumentEvent, type ManualReading, type PilotExport,
} from "../../packages/domain/eie/pilot";
import { GOVERNED_OEM_REGISTRY } from "../../packages/domain/niret/oem-registry";
import { NO_SOURCES } from "../../apps/web/lib/niret/server-evaluate";
import { pilotGuard } from "../../apps/web/lib/eie/pilot/environment";
import { kmsSealSigner } from "../../apps/web/lib/eie/pilot/kms-seal-signer";
import { buildPilotRecorder, pilotReadiness, PILOT_RECORDER_ID } from "../../apps/web/lib/eie/pilot/pilot-recorder";
import { T } from "./fixtures/niret-complete-form";
import { declaredInput, verifiedRow, verifierWith, FORM_READINGS } from "./fixtures/eie-gate-a-evidence";
import { createSyntheticTsa } from "./fixtures/eie-synthetic-tsa";

// ─────────────────────────────── Environment guard ───────────────────────────────

describe("Pilot environment guard (P4 = 4a)", () => {
  const env = { TA14_EIE_PILOT_ENABLED: "true", TA14_EIE_PILOT_PROJECT_REFS: "pilotref0000", NEXT_PUBLIC_SUPABASE_URL: "https://pilotref0000.supabase.co" };
  it("is enabled only with the flag, an allowlisted project, a local request and no deployment", () => {
    expect(pilotGuard(env, "localhost:3000")).toEqual({ enabled: true, projectRef: "pilotref0000" });
    expect(pilotGuard(env, "127.0.0.1:3000").enabled).toBe(true);
  });
  it.each([
    ["flag absent", { ...env, TA14_EIE_PILOT_ENABLED: undefined }, "localhost", "PILOT_FLAG_ABSENT"],
    ["flag not exactly true", { ...env, TA14_EIE_PILOT_ENABLED: "1" }, "localhost", "PILOT_FLAG_ABSENT"],
    ["allowlist absent", { ...env, TA14_EIE_PILOT_PROJECT_REFS: "" }, "localhost", "PILOT_ALLOWLIST_ABSENT"],
    ["project not allowlisted", { ...env, NEXT_PUBLIC_SUPABASE_URL: "https://productionref.supabase.co" }, "localhost", "PILOT_PROJECT_NOT_ALLOWLISTED"],
    ["project unidentifiable", { ...env, NEXT_PUBLIC_SUPABASE_URL: "https://example.com" }, "localhost", "PILOT_PROJECT_UNIDENTIFIED"],
    ["non-local request", env, "ta14.example.org", "PILOT_NOT_LOCAL"],
    ["no host header", env, null, "PILOT_NOT_LOCAL"],
    ["running in a deployment", { ...env, VERCEL: "1" }, "localhost", "PILOT_DEPLOYED_ENVIRONMENT"],
  ])("is inert when %s", (_name, e, host, reason) => {
    const guard = pilotGuard(e as Record<string, string | undefined>, host as string | null);
    expect(guard.enabled).toBe(false);
    expect(!guard.enabled && guard.reasons).toContain(reason);
  });
  it("the route and the page check the guard before anything else and answer 404 otherwise", () => {
    const route = readFileSync(new URL("../../apps/web/app/api/eie/pilot/[operation]/route.ts", import.meta.url), "utf8");
    expect(route.indexOf("pilotGuard(")).toBeLessThan(route.indexOf("auth.getUser"));
    expect(route).toMatch(/if \(!guard\.enabled\) return notFound\(\);/);
    const page = readFileSync(new URL("../../apps/web/app/eie/pilot/page.tsx", import.meta.url), "utf8");
    expect(page).toMatch(/if \(!pilotGuard\(process\.env, host\)\.enabled\) notFound\(\);/);
  });
});

// ─────────────────────────────── Asset identity ───────────────────────────────

const A = { accountId: "account-transcriber-A" };
const B = { accountId: "account-verifier-B" };
const at = (hhmmss: string) => `2026-09-27T${hhmmss}Z`;
const HASH = "c".repeat(64);

function assetLog(values: { manufacturer: string; outdoorModel: string; indoorModel: string }, verify = true): AssetEvent[] {
  const events: AssetEvent[] = [
    { type: "ASSET_REGISTERED", assetId: "ASSET-P1", siteRef: "SITE-SYNTHETIC", installedLocation: "rear yard / attic", by: A, at: at("09:00:00") },
    { type: "COMPONENT_REGISTERED", assetId: "ASSET-P1", componentId: "OUT-1", role: "OUTDOOR_UNIT", by: A, at: at("09:00:01") },
    { type: "COMPONENT_REGISTERED", assetId: "ASSET-P1", componentId: "IN-1", role: "INDOOR_UNIT", by: A, at: at("09:00:02") },
    { type: "NAMEPLATE_EVIDENCE", assetId: "ASSET-P1", componentId: "OUT-1", evidenceId: "EV-OUT", imageSha256: HASH, mediaType: "image/jpeg", storageRef: "eie-pilot-evidence/nameplate/x", capturedAt: at("08:55:00"), by: A, at: at("09:01:00") },
    { type: "NAMEPLATE_EVIDENCE", assetId: "ASSET-P1", componentId: "IN-1", evidenceId: "EV-IN", imageSha256: "d".repeat(64), mediaType: "image/jpeg", storageRef: null, capturedAt: at("08:56:00"), by: A, at: at("09:01:01") },
    { type: "TRANSCRIPTION", assetId: "ASSET-P1", componentId: "OUT-1", transcriptionId: "T-MFR", evidenceId: "EV-OUT", field: "MANUFACTURER", value: values.manufacturer, supersedes: null, by: A, at: at("09:02:00") },
    { type: "TRANSCRIPTION", assetId: "ASSET-P1", componentId: "OUT-1", transcriptionId: "T-OUT", evidenceId: "EV-OUT", field: "MODEL", value: values.outdoorModel, supersedes: null, by: A, at: at("09:02:01") },
    { type: "TRANSCRIPTION", assetId: "ASSET-P1", componentId: "IN-1", transcriptionId: "T-IN", evidenceId: "EV-IN", field: "MODEL", value: values.indoorModel, supersedes: null, by: A, at: at("09:02:02") },
  ];
  if (verify) for (const id of ["T-MFR", "T-OUT", "T-IN"]) events.push({ type: "TRANSCRIPTION_VERIFICATION", assetId: "ASSET-P1", transcriptionId: id, outcome: "MATCHES_SOURCE", by: B, at: at("09:03:00") });
  return events;
}
/** Appends events one at a time through the governed refusal check, as the pilot API does. */
function governed(events: AssetEvent[]) {
  const accepted: AssetEvent[] = [];
  for (const e of events) {
    const codes = assetEventRefusal(accepted, e);
    if (codes.length > 0) throw new Error(`${e.type}: ${codes}`);
    accepted.push(e);
  }
  return accepted;
}
const FORM_IDENTITY = { manufacturer: "ExampleCo", outdoorModel: "CU-200", indoorModel: "AH-100" };

describe("Governed asset identity (ruling 4)", () => {
  it("a second person's verification makes a transcription VERIFIED; field evidence and actors are preserved", () => {
    const asset = deriveAsset(governed(assetLog(FORM_IDENTITY)))!;
    const outdoor = asset.components.find((c) => c.componentId === "OUT-1")!;
    expect(outdoor.fields.MANUFACTURER).toMatchObject({ value: "ExampleCo", status: "VERIFIED", transcribedBy: A.accountId, verifiedBy: B.accountId, evidenceId: "EV-OUT" });
    expect(outdoor.evidence[0]).toMatchObject({ imageSha256: HASH, capturedBy: A.accountId });
    expect(deriveAsset(governed(assetLog(FORM_IDENTITY, false)))!.components[0].fields.MODEL!.status).toBe("DOCUMENTED");
  });

  it("the transcriber cannot verify their own transcription; a transcription needs recorded nameplate evidence", () => {
    const log = governed(assetLog(FORM_IDENTITY, false));
    expect(assetEventRefusal(log, { type: "TRANSCRIPTION_VERIFICATION", assetId: "ASSET-P1", transcriptionId: "T-MFR", outcome: "MATCHES_SOURCE", by: A, at: at("09:03:00") }))
      .toEqual([EIE_REASON.ASSET_EVENT_REFUSED]);
    expect(assetEventRefusal(log, { type: "TRANSCRIPTION", assetId: "ASSET-P1", componentId: "OUT-1", transcriptionId: "T-X", evidenceId: "EV-NONE", field: "SERIAL", value: "123", supersedes: null, by: A, at: at("09:04:00") }))
      .toEqual([EIE_REASON.ASSET_EVENT_REFUSED]);
  });

  it("corrections are new entries: the correction needs its own independent verification, the history is kept", () => {
    const log = governed([
      ...assetLog({ ...FORM_IDENTITY, outdoorModel: "CU-20O" }),
      { type: "TRANSCRIPTION", assetId: "ASSET-P1", componentId: "OUT-1", transcriptionId: "T-OUT-2", evidenceId: "EV-OUT", field: "MODEL", value: "CU-200", supersedes: "T-OUT", by: A, at: at("09:05:00") },
    ]);
    const model = deriveAsset(log)!.components.find((c) => c.componentId === "OUT-1")!.fields.MODEL!;
    expect(model).toMatchObject({ value: "CU-200", status: "DOCUMENTED", corrections: ["T-OUT"] });
    const refuted = governed([...assetLog(FORM_IDENTITY, false), { type: "TRANSCRIPTION_VERIFICATION", assetId: "ASSET-P1", transcriptionId: "T-OUT", outcome: "DOES_NOT_MATCH", by: B, at: at("09:03:00") }]);
    expect(deriveAsset(refuted)!.components[0].fields.MODEL!.status).toBe("REFUTED");
  });

  it("declared equipment must equal the verified transcriptions byte for byte: no case, whitespace, prefix or truncation matching", () => {
    const asset = deriveAsset(governed(assetLog(FORM_IDENTITY)));
    const declared = (e: Partial<typeof FORM_IDENTITY>) => ({ evidence: { equipment: { ...FORM_IDENTITY, ...e } } });
    expect(declaredEquipmentConsistency(asset, declared({}))).toEqual([]);
    for (const variant of [{ manufacturer: "exampleco" }, { manufacturer: "ExampleCo " }, { outdoorModel: "CU-200A" }, { outdoorModel: "CU-20" }, { indoorModel: "AH100" }]) {
      expect(declaredEquipmentConsistency(asset, declared(variant))).toEqual([EIE_REASON.ASSET_IDENTITY_MISMATCH]);
    }
    expect(declaredEquipmentConsistency(deriveAsset(governed(assetLog(FORM_IDENTITY, false))), declared({}))).toEqual([EIE_REASON.ASSET_IDENTITY_UNVERIFIED]);
    expect(declaredEquipmentConsistency(undefined, declared({}))).toEqual([EIE_REASON.ASSET_UNKNOWN]);
    // An empty declared field is left to C1-R7 (which holds on missing identity); nothing is filled in.
    expect(declaredEquipmentConsistency(asset, declared({ indoorModel: "" }))).toEqual([]);
  });

  it("a replaced component no longer supplies verified identity", () => {
    const log = governed([...assetLog(FORM_IDENTITY), { type: "COMPONENT_REPLACED", assetId: "ASSET-P1", componentId: "OUT-1", reason: "synthetic", by: A, at: at("09:10:00") }]);
    expect(declaredEquipmentConsistency(deriveAsset(log), { evidence: { equipment: FORM_IDENTITY } })).toEqual([EIE_REASON.ASSET_IDENTITY_UNVERIFIED]);
  });
});

// ─────────────────────────────── Instrument register + manual Node adapter ───────────────────────────────

const TECH_ACCOUNT = "account-uuid-1";
const CAL_FROM = "2026-06-01T00:00:00Z";
const CAL_UNTIL = "2027-06-01T00:00:00Z";
function instrumentLog(): InstrumentEvent[] {
  const events: InstrumentEvent[] = [];
  const add = (id: string, kind: "TEMPERATURE" | "AIR_PRESSURE" | "AIRFLOW", accuracy: { value: number; unit: string }) => {
    events.push({ type: "INSTRUMENT_REGISTERED", instrumentId: id, kind, manufacturer: "SYNTHETIC", model: `M-${id}`, serial: `S-${id}`, by: A, at: at("08:00:00") });
    events.push({ type: "CALIBRATION_DOCUMENTED", instrumentId: id, calibrationId: `CAL-${id}`, certificateRef: `CERT-${id}`, certificateSha256: "e".repeat(64), issuer: "SYNTHETIC LAB",
      calibratedAt: CAL_FROM, fitUntil: CAL_UNTIL, accuracy: { ...accuracy, basisRef: `CERT-${id}#accuracy` }, by: A, at: at("08:00:01") });
  };
  add("THERMO-1", "TEMPERATURE", { value: 0.5, unit: "F" });
  add("FLOW-1", "AIRFLOW", { value: 30, unit: "CFM" });
  add("MANO-1", "AIR_PRESSURE", { value: 0.01, unit: "IN_WC" });
  return events.filter((e, i, all) => instrumentEventRefusal(all.slice(0, i), e).length === 0);
}
const instruments = deriveInstruments(instrumentLog());
const readingFor = (r: (typeof FORM_READINGS)[number], observedAt = T("10:25")): ManualReading => ({
  channel: r.channel, value: r.value, unit: r.unit, observedAt, instrumentId: r.instrument,
  location: { physical: r.location, class: r.cls, basis: r.basis },
  ...(GOVERNED_MANUAL_CHANNELS[r.channel]?.signedRelativeToAmbient ? { signConvention: "SIGNED_RELATIVE_TO_AMBIENT" as const } : {}),
});
const ctx = (sequence = 1) => ({ technicianAccountId: TECH_ACCOUNT, instruments, receivedAt: "2026-09-27T10:25:01Z", sequence, observationId: `MANUAL:${randomBytes(4).toString("hex")}` });

describe("Manual-instrument Node adapter and instrument register", () => {
  it("builds an s04 MANUAL_INSTRUMENT observation from a registered, documented instrument", () => {
    const built = manualObservation(readingFor(FORM_READINGS[0]), ctx());
    expect(built).toMatchObject({ ok: true, observation: {
      acquisitionMethod: "MANUAL_INSTRUMENT", source: { provider: "TA14-MANUAL-INSTRUMENT", deviceId: "THERMO-1" }, unit: "F", value: 76,
      instrument: { id: "THERMO-1", calibrationOrFitnessRef: `CERT-THERMO-1#sha256:${"e".repeat(64)}`, fitUntil: CAL_UNTIL },
      accuracyOrUncertainty: { kind: "ACCURACY", value: 0.5, unit: "F" }, receivedAt: "2026-09-27T10:25:01Z", sourceQuality: "TECHNICIAN_READING",
    } });
    expect(manualSubmitter(TECH_ACCOUNT)).toEqual({ role: "NODE", id: `TA14-MANUAL-NODE/${TECH_ACCOUNT}` });
  });

  it.each([
    ["a unit that is not the exact C1-R7 code", { unit: "degF" }, EIE_REASON.UNIT_NOT_GOVERNED],
    ["an incompatible unit", { unit: "PCT_RH" }, EIE_REASON.UNIT_NOT_GOVERNED],
    ["an unregistered instrument", { instrumentId: "THERMO-9" }, EIE_REASON.INSTRUMENT_UNREGISTERED],
    ["a reading outside the documented calibration", { observedAt: "2027-07-01T10:25:00Z" }, EIE_REASON.INSTRUMENT_UNFIT],
    ["an unparseable time (never defaulted)", { observedAt: "" }, EIE_REASON.TIME_UNPARSEABLE],
    ["a non-finite value", { value: Number.NaN }, EIE_REASON.VALUE_INVALID],
  ])("refuses %s", (_name, change, code) => {
    const built = manualObservation({ ...readingFor(FORM_READINGS[0]), ...change } as ManualReading, ctx());
    expect(built.ok).toBe(false);
    expect(!built.ok && built.reasonCodes).toContain(code);
  });

  it("static pressure must be stated as signed relative to ambient; VOLTAGE and CURRENT are not governed for the pilot", () => {
    const staticReading = FORM_READINGS.find((r) => r.channel === "RETURN_STATIC_PRESSURE")!;
    const { signConvention: _omit, ...unsigned } = readingFor(staticReading);
    expect(manualObservation(unsigned as ManualReading, ctx())).toEqual({ ok: false, reasonCodes: [EIE_REASON.SIGN_NOT_DECLARED] });
    expect(manualObservation(readingFor(staticReading), ctx())).toMatchObject({ ok: true, observation: { value: -0.2, unit: "IN_WC" } });
    for (const channel of ["VOLTAGE", "CURRENT", "SUCTION_PRESSURE", "BAROMETRIC_PRESSURE"] as const) {
      expect(manualObservation({ ...readingFor(FORM_READINGS[0]), channel }, ctx())).toEqual({ ok: false, reasonCodes: [EIE_REASON.CHANNEL_NOT_GOVERNED] });
    }
  });

  it("overlapping calibration records are ambiguous and cover nothing; an accuracy in another unit is not carried", () => {
    const overlapping = deriveInstruments([...instrumentLog(), { type: "CALIBRATION_DOCUMENTED", instrumentId: "THERMO-1", calibrationId: "CAL-2", certificateRef: "CERT-2",
      certificateSha256: "f".repeat(64), issuer: "X", calibratedAt: "2026-09-01T00:00:00Z", fitUntil: CAL_UNTIL, accuracy: null, by: A, at: at("08:10:00") }]);
    expect(manualObservation(readingFor(FORM_READINGS[0]), { ...ctx(), instruments: overlapping })).toEqual({ ok: false, reasonCodes: [EIE_REASON.INSTRUMENT_UNFIT] });
    const otherUnit = deriveInstruments(instrumentLog().map((e) => (e.type === "CALIBRATION_DOCUMENTED" && e.instrumentId === "THERMO-1" ? { ...e, accuracy: { value: 0.3, unit: "C", basisRef: "x" } } : e)));
    expect(manualObservation(readingFor(FORM_READINGS[0]), { ...ctx(), instruments: otherUnit })).toMatchObject({ ok: true, observation: { accuracyOrUncertainty: null } });
  });

  it("the register refuses undocumented calibration and duplicate instruments", () => {
    const log = instrumentLog();
    expect(instrumentEventRefusal(log, { type: "INSTRUMENT_REGISTERED", instrumentId: "THERMO-1", kind: "TEMPERATURE", manufacturer: "x", model: "x", serial: "x", by: A, at: at("09:00:00") })).not.toEqual([]);
    expect(instrumentEventRefusal(log, { type: "CALIBRATION_DOCUMENTED", instrumentId: "THERMO-1", calibrationId: "C9", certificateRef: "x", certificateSha256: "not-a-hash",
      issuer: "x", calibratedAt: CAL_FROM, fitUntil: CAL_UNTIL, accuracy: null, by: A, at: at("09:00:00") })).not.toEqual([]);
  });

  it("assigns contiguous per-stream sequences from what the window admitted", () => {
    const obs = (seq: number) => ({ kind: "OBSERVATION", observation: { source: { provider: "TA14-MANUAL-INSTRUMENT", deviceId: "THERMO-1" }, channel: "RETURN_DRY_BULB", sequence: seq } as NodeObservation });
    expect(nextSequence([], "THERMO-1", "RETURN_DRY_BULB")).toBe(1);
    expect(nextSequence([obs(1), obs(2), { kind: "REJECTED_SUBMISSION" }], "THERMO-1", "RETURN_DRY_BULB")).toBe(3);
    expect(nextSequence([obs(1)], "THERMO-1", "SUPPLY_DRY_BULB")).toBe(1);
  });
});

// ─────────────────────────────── Tier 1 end-to-end ───────────────────────────────

const CUSTODIAN = { role: KEY_CUSTODIAN_ROLE, accountId: "custodian-synthetic" } as const;
const OWNER = { role: KEY_APPROVER_ROLE, accountId: "owner-synthetic" } as const;
const KMS_RESOURCE = "projects/synthetic/locations/us/keyRings/pilot/cryptoKeys/recorder/cryptoKeyVersions/1";
const KEY_ID = "TA14-EIE-PILOT-REC-0001";

/** A pilot-shaped profile, SYNTHETIC values, pinned only in this test's registry (the shipped pilot registry stays empty). */
const PILOT_PROFILE: ContinuityProfile = {
  profileId: "SYNTHETIC-PILOT-MANUAL-SNAPSHOT", profileVersion: "0.0.0-test",
  basis: { kind: "SOURCE_DOCUMENTATION", ref: "SYNTHETIC: packages/domain/eie/pilot/manual-node.ts" },
  sequenceSemantics: { status: "ESTABLISHED", value: "CONTIGUOUS_PER_STREAM", basisRef: "SYNTHETIC" },
  maxGapSeconds: { status: "ESTABLISHED", value: 120, basisRef: "SYNTHETIC" },
  maxObservationAgeSeconds: { status: "NOT_ESTABLISHED", requiredFrom: "SYNTHETIC" },
  maxSourceClockLeadSeconds: { status: "NOT_ESTABLISHED", requiredFrom: "SYNTHETIC" },
  windowTimeoutSeconds: { status: "NOT_ESTABLISHED", requiredFrom: "SYNTHETIC" },
  applicability: { purposes: ["BASELINE_NONINVASIVE"], channels: Object.keys(GOVERNED_MANUAL_CHANNELS) as ContinuityProfile["applicability"]["channels"], acquisitionMethods: ["MANUAL_INSTRUMENT"] },
};
const PINNED = new Map([[`${PILOT_PROFILE.profileId}@${PILOT_PROFILE.profileVersion}`, objectHash(PILOT_PROFILE)]]);

async function pilot(options: { activateKey?: boolean; pinned?: boolean; identity?: typeof FORM_IDENTITY; verifyIdentity?: boolean; witness?: boolean } = {}) {
  const key = generateKeyPairSync("ed25519");
  const publicKeyPem = key.publicKey.export({ type: "spki", format: "pem" }).toString();
  const registration: KeyRegistration = {
    keyId: KEY_ID, algorithm: "ED25519", protectionLevel: "SOFTWARE", provider: "GOOGLE_CLOUD_KMS", providerResource: KMS_RESOURCE, purpose: "EIE_RECORDER_SEAL",
    environment: "PILOT", publicKeyPem, publicKeySha256: publicKeySha256(publicKeyPem), supersedes: null, createdAt: "2026-09-27T08:00:00Z", custodianRole: KEY_CUSTODIAN_ROLE,
  };
  const keyRecord: KeyRecordEvent[] = [
    { type: "REGISTERED", keyId: KEY_ID, registration, by: CUSTODIAN, at: "2026-09-27T08:00:00Z" },
    { type: "APPROVED", keyId: KEY_ID, registrationHash: objectHash(registration), by: OWNER, at: "2026-09-27T08:30:00Z" },
    ...(options.activateKey === false ? [] : [{ type: "ACTIVATED" as const, keyId: KEY_ID, by: CUSTODIAN, at: "2026-09-27T09:00:00Z" }]),
  ];
  const kmsClient = { asymmetricSign: async (r: { name: string; data: Uint8Array }) => [{ name: KMS_RESOURCE, signature: edSign(null, Buffer.from(r.data), key.privateKey) }] as [{ name: string; signature: Buffer }] };
  const tsa = await createSyntheticTsa({ label: "PILOT" });
  const witnessStore = new InMemoryWitnessStore();
  const evidenceStore = new InMemoryEvidenceStore();
  const assets = governed(assetLog(options.identity ?? FORM_IDENTITY, options.verifyIdentity ?? true));
  let now = Date.parse("2026-09-27T10:24:30Z");
  const clock = () => new Date(now).toISOString();
  const recorder = buildPilotRecorder({
    evidenceStore, keyRecord, keyId: KEY_ID, witnessStore, witnessTrust: { trustAnchorsPem: [tsa.trustAnchorPem] }, clock,
    assetEvents: async (assetId) => assets.filter((e) => e.assetId === assetId),
    profileRegistry: options.pinned === false ? PILOT_PINNED_CONTINUITY_PROFILES : PINNED,
    signerFor: (state) => kmsSealSigner({ keyId: state.keyId, keyVersionName: KMS_RESOURCE, publicKeyPem: state.registration.publicKeyPem, client: kmsClient }),
    gateASources: { ...NO_SOURCES, submitter: { accountId: TECH_ACCOUNT }, certificationVerifier: verifierWith([verifiedRow]), oemRegistry: GOVERNED_OEM_REGISTRY },
  });
  const set = (iso: string) => { now = Date.parse(iso); };
  const tech = { role: "TECHNICIAN" as const, id: TECH_ACCOUNT };
  const request = (predecessors: string[] = [], ref = "SESSION-PILOT-EVIDENCE") => ({
    purpose: "BASELINE_NONINVASIVE" as const, assetId: "ASSET-P1", openTrigger: { type: "SESSION_START" as const, ref },
    admittedChannels: [...new Set(FORM_READINGS.map((r) => r.channel))],
    admittedSources: ["THERMO-1", "FLOW-1", "MANO-1"].map((deviceId) => ({ provider: "TA14-MANUAL-INSTRUMENT", deviceId })),
    continuityProfile: PILOT_PROFILE, predecessorWindowIds: predecessors,
  });

  async function run() {
    const opened = await recorder.openWindow(request(), tech);
    if (!opened.opened) return { opened };
    set("2026-09-27T10:25:01Z");
    for (const r of FORM_READINGS) {
      const window = (await recorder.getWindow(opened.windowId))!;
      const built = manualObservation(readingFor(r), { ...ctx(nextSequence(window.entries, r.instrument, r.channel)) });
      if (!built.ok) throw new Error(`${built.reasonCodes}`);
      const outcome = await recorder.submitObservation(opened.windowId, built.observation, manualSubmitter(TECH_ACCOUNT));
      if (!outcome.accepted) throw new Error(`${outcome.reasonCodes}`);
    }
    set("2026-09-27T10:25:30Z");
    const closed = await recorder.closeWindow(opened.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, tech);
    if (!closed.closed) throw new Error(`${closed.reasonCodes}`);
    if (options.witness !== false) {
      const w = await witnessSealedWindows({ recorderId: PILOT_RECORDER_ID, sealedWindows: [closed.window], store: witnessStore, tsa: tsa.transport(() => new Date("2026-09-27T10:25:40Z")),
        trust: { trustAnchorsPem: [tsa.trustAnchorPem] }, now: clock, randomBytes: (n) => new Uint8Array(randomBytes(n)) });
      if (w.failure) throw new Error(`${w.failure.detail}`);
    }
    set("2026-09-27T10:26:00Z");
    const preserving = await recorder.openWindow(request([opened.windowId], "SESSION-PILOT-EVAL"), tech);
    if (!preserving.opened) throw new Error(`${preserving.reasonCodes}`);
    set("2026-09-27T10:30:00Z");
    const evaluation = await recorder.recordGateAEvaluation(preserving.windowId, { evidenceWindowIds: [opened.windowId], declared: declaredInput() }, tech);
    // As the pilot gate-a operation does: the receipt sealed the preserving window, so witness it too.
    if (evaluation.accepted && options.witness !== false) {
      const w = await witnessSealedWindows({ recorderId: PILOT_RECORDER_ID, sealedWindows: [closed.window, evaluation.window], store: witnessStore,
        tsa: tsa.transport(() => new Date("2026-09-27T10:30:10Z")), trust: { trustAnchorsPem: [tsa.trustAnchorPem] }, now: clock, randomBytes: (n) => new Uint8Array(randomBytes(n)) });
      if (w.failure) throw new Error(`${w.failure.detail}`);
    }
    return { opened, evidenceWindow: closed.window, preservingId: preserving.windowId, evaluation };
  }
  const witnessAll = async (windows: EvidenceWindow[], atIso: string) => witnessSealedWindows({
    recorderId: PILOT_RECORDER_ID, sealedWindows: windows, store: witnessStore, tsa: tsa.transport(() => new Date(atIso)),
    trust: { trustAnchorsPem: [tsa.trustAnchorPem] }, now: clock, randomBytes: (n) => new Uint8Array(randomBytes(n)),
  });
  return { recorder, keyRecord, witnessStore, tsa, run, evidenceStore, request, set, tech, witnessAll };
}

describe("Tier 1 pilot path (end to end)", () => {
  it("real manual observations travel the governed chain to a real, attributable C1-R7 receipt: HOLD, not ALLOW", async () => {
    const p = await pilot();
    const result = await p.run();
    if (!("evaluation" in result) || !result.evaluation) throw new Error("did not run");
    const { evaluation, evidenceWindow } = result;
    expect(evaluation.accepted).toBe(true);
    if (!evaluation.accepted) return;
    const receipt = evaluation.record.receipt as Record<string, any>;
    // No governed OEM record is established, so C1-R7 holds. Success is the truthful chain, not ALLOW.
    expect(receipt.determination).not.toBe("ALLOW");
    expect(receipt.reason_codes).toContain("OEM_REFERENCE_NOT_VERIFIED");
    expect(receipt.gate_b_authorized).toBe(false);
    expect(receipt.evidence_provenance).toMatchObject({ returnDryBulb: "MANUAL", airflow: "MANUAL" });
    expect(evaluation.record.inputManifest).toMatchObject({ evidenceMode: "PRODUCTION", assetId: "ASSET-P1" });
    expect(evaluation.record.inputManifest.measurements.every((m) => m.acquisitionMethod === "MANUAL_INSTRUMENT")).toBe(true);
    expect(evidenceWindow).toMatchObject({ recorderMode: "PRODUCTION", continuityStatus: "INTACT", recorderSignature: { keyId: KEY_ID, algorithm: "ED25519" } });

    // Offline verification from public material only (Key Record + TSA anchor + export).
    const windows = (await Promise.all((await p.evidenceStore.listWindowIds("ASSET-P1")).map((id) => p.recorder.getWindow(id)))) as EvidenceWindow[];
    const bundle: PilotExport = { contract: "TA-14-EIE-PILOT-EXPORT/1", recorderId: PILOT_RECORDER_ID, windows, keyRecord: p.keyRecord, witness: [...(await p.witnessStore.list(PILOT_RECORDER_ID))] };
    const offline = await verifyPilotExport(JSON.parse(JSON.stringify(bundle)), { trustAnchorsPem: [p.tsa.trustAnchorPem] }, ["PILOT"]);
    expect(offline.findings).toEqual([]);
    expect(offline.valid).toBe(true);
    expect(offline.receipts).toHaveLength(1);
    expect(offline.receipts[0].measurements.every((m) => m.traced)).toBe(true);

    const tampered = JSON.parse(JSON.stringify(bundle)) as PilotExport;
    tampered.windows[0].entries[0].recordedAt = "2026-09-27T10:25:02Z";
    expect((await verifyPilotExport(tampered, { trustAnchorsPem: [p.tsa.trustAnchorPem] }, ["PILOT"])).valid).toBe(false);
    expect((await verifyPilotExport(bundle, { trustAnchorsPem: [p.tsa.trustAnchorPem] }, ["PRODUCTION"])).valid).toBe(false);
  });

  it("an evidence window without an independent witness cannot supply Gate A input", async () => {
    const result = await (await pilot({ witness: false })).run();
    expect("evaluation" in result && result.evaluation).toMatchObject({ accepted: false, reasonCodes: [EIE_REASON.EVIDENCE_WINDOW_UNWITNESSED] });
  });

  it("declared equipment that differs from the verified nameplate, or an unverified nameplate, stops the evaluation", async () => {
    const mismatch = await (await pilot({ identity: { ...FORM_IDENTITY, outdoorModel: "CU-200A" } })).run();
    expect("evaluation" in mismatch && mismatch.evaluation?.reasonCodes).toContain(EIE_REASON.ASSET_IDENTITY_MISMATCH);
    const unverified = await (await pilot({ verifyIdentity: false })).run();
    expect("evaluation" in unverified && unverified.evaluation?.reasonCodes).toContain(EIE_REASON.ASSET_IDENTITY_UNVERIFIED);
  });

  it("without an independently reviewed, pinned profile, or without an ACTIVE pilot key, no window opens", async () => {
    const unpinned = await (await pilot({ pinned: false })).run();
    expect(unpinned.opened).toMatchObject({ opened: false });
    expect(!unpinned.opened.opened && unpinned.opened.reasonCodes).toContain(EIE_REASON.PROFILE_NOT_GOVERNED);
    const inactive = await (await pilot({ activateKey: false })).run();
    expect(!inactive.opened.opened && inactive.opened.reasonCodes).toContain(EIE_REASON.SEAL_SIGNER_UNAVAILABLE);
  });

  it("simulated evidence is never admitted in the pilot", async () => {
    const p = await pilot();
    const opened = await p.recorder.openWindow({
      purpose: "BASELINE_NONINVASIVE", assetId: "ASSET-P1", openTrigger: { type: "SESSION_START", ref: "S" }, admittedChannels: ["RETURN_DRY_BULB"],
      admittedSources: [{ provider: "TA14-MANUAL-INSTRUMENT", deviceId: "THERMO-1" }], continuityProfile: PILOT_PROFILE, predecessorWindowIds: [],
    }, { role: "TECHNICIAN", id: TECH_ACCOUNT });
    if (!opened.opened) throw new Error(`${opened.reasonCodes}`);
    const built = manualObservation(readingFor(FORM_READINGS[0], "2026-09-27T10:24:40Z"), ctx());
    if (!built.ok) throw new Error();
    const simulated = { ...built.observation, acquisitionMethod: "SIMULATED" as const };
    const outcome = await p.recorder.submitObservation(opened.windowId, simulated, manualSubmitter(TECH_ACCOUNT));
    expect(outcome.accepted).toBe(false);
    expect(outcome.reasonCodes).toContain(EIE_REASON.SIMULATED_IN_PRODUCTION);
  });

  it("readiness reports every unmet activation dependency; the shipped pilot profile registry is empty", () => {
    expect(PILOT_PINNED_CONTINUITY_PROFILES.size).toBe(0);
    expect(pilotReadiness({ keyRecord: [], keyId: null, witnessTrust: null })).toEqual(["PILOT_KEY_NOT_ACTIVE", "TSA_TRUST_ANCHOR_ABSENT", "NO_CONTINUITY_PROFILE_PINNED"]);
  });
});

describe("Tier 1 Gate A path refuses non-INTACT and unsealed evidence", () => {
  /** Opens a pilot evidence window and records the complete reading set; extra observations are appended as given. */
  async function evidence(p: Awaited<ReturnType<typeof pilot>>, extra: (windowId: string) => Promise<void>, seal = true) {
    const opened = await p.recorder.openWindow(p.request(), p.tech);
    if (!opened.opened) throw new Error(`${opened.reasonCodes}`);
    p.set("2026-09-27T10:25:01Z");
    for (const r of FORM_READINGS) {
      const window = (await p.recorder.getWindow(opened.windowId))!;
      const built = manualObservation(readingFor(r), ctx(nextSequence(window.entries, r.instrument, r.channel)));
      if (!built.ok) throw new Error(`${built.reasonCodes}`);
      await p.recorder.submitObservation(opened.windowId, built.observation, manualSubmitter(TECH_ACCOUNT));
    }
    await extra(opened.windowId);
    if (seal) {
      p.set("2026-09-27T10:25:30Z");
      await p.recorder.closeWindow(opened.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, p.tech);
    }
    return opened.windowId;
  }
  async function evaluate(p: Awaited<ReturnType<typeof pilot>>, evidenceId: string) {
    const sealed = (await p.recorder.getWindow(evidenceId))!;
    if (sealed.sealHash) await p.witnessAll([sealed], "2026-09-27T10:25:40Z");
    p.set("2026-09-27T10:26:00Z");
    const preserving = await p.recorder.openWindow(p.request([evidenceId], "SESSION-PILOT-EVAL"), p.tech);
    if (!preserving.opened) return { preserving, evaluation: null };
    p.set("2026-09-27T10:30:00Z");
    return { preserving, evaluation: await p.recorder.recordGateAEvaluation(preserving.windowId, { evidenceWindowIds: [evidenceId], declared: declaredInput() }, p.tech) };
  }

  it("a DEGRADED evidence window (conflicting duplicate) cannot supply Gate A input, even when sealed and witnessed", async () => {
    const p = await pilot();
    const id = await evidence(p, async (windowId) => {
      const first = (await p.recorder.getWindow(windowId))!.entries[0];
      if (first.kind !== "OBSERVATION") throw new Error();
      await p.recorder.submitObservation(windowId, { ...first.observation, value: first.observation.value + 1 }, manualSubmitter(TECH_ACCOUNT));
    });
    expect((await p.recorder.getWindow(id))!.continuityStatus).toBe("DEGRADED");
    const { evaluation } = await evaluate(p, id);
    expect(evaluation).toMatchObject({ accepted: false });
    expect(evaluation?.reasonCodes).toContain(EIE_REASON.EVIDENCE_WINDOW_CONTINUITY);
  });

  it("a BROKEN evidence window (missing source sequence) cannot supply Gate A input", async () => {
    const p = await pilot();
    const id = await evidence(p, async (windowId) => {
      const built = manualObservation(readingFor(FORM_READINGS[0], "2026-09-27T10:25:00Z"), ctx(3));
      if (!built.ok) throw new Error();
      await p.recorder.submitObservation(windowId, built.observation, manualSubmitter(TECH_ACCOUNT));
    }, false);
    expect((await p.recorder.getWindow(id))!).toMatchObject({ continuityStatus: "BROKEN", closeTrigger: { type: "CONTINUITY_BREAK" } });
    const { evaluation } = await evaluate(p, id);
    expect(evaluation?.reasonCodes).toContain(EIE_REASON.EVIDENCE_WINDOW_CONTINUITY);
  });

  it("an OPEN (unsealed) evidence window can be neither a predecessor nor Gate A input", async () => {
    const p = await pilot();
    const id = await evidence(p, async () => {}, false);
    const { preserving } = await evaluate(p, id);
    expect(preserving).toMatchObject({ opened: false });
    expect(!preserving.opened && preserving.reasonCodes).toContain(EIE_REASON.LINEAGE_BROKEN);
  });
});

describe("Phase 3 boundaries", () => {
  it("the pilot surface has no pressure-window, Gate B, Governor or promotion operation", () => {
    const operations = readFileSync(new URL("../../apps/web/lib/eie/pilot/operations.ts", import.meta.url), "utf8");
    expect(operations).not.toMatch(/PRESSURE_EVIDENCE|GATE_A_ALLOW_RECEIPT|GATE_B|governor|ACTIVATED|APPROVED|PINNED/i);
    expect(operations).not.toMatch(/ta14_eie_recorder_key_events|ta14_eie_pilot_role_assignments/);
  });
  it("pilot migrations are append-only, RLS-locked and marked not applied", () => {
    for (const name of ["20260929090000_ta14_eie_pilot_key_record", "20260929090100_ta14_eie_witness_checkpoints", "20260929090200_ta14_eie_asset_identity", "20260929090300_ta14_eie_instrument_register"]) {
      const sql = readFileSync(new URL(`../../supabase/migrations/${name}.sql`, import.meta.url), "utf8");
      expect(sql).toMatch(/ISOLATED PILOT PROJECT ONLY\. NOT APPLIED\./);
      expect(sql).toMatch(/enable row level security/);
      expect(sql).toMatch(/revoke update, delete, truncate on table/);
      expect(sql).toMatch(/before update or delete/);
      expect(sql).not.toMatch(/create policy/i);
    }
  });
});
