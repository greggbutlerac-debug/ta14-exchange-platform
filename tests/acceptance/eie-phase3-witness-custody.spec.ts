/**
 * TA-14 EIE Phase 3 — pilot custody and independent witness.
 *   - Recorder Key Record: explicit algorithm/protection level/environment, approval by role, historical
 *     verification after rotation and revocation, no silent algorithm change.
 *   - KMS seal signer (stubbed KMS client; real Ed25519 signatures): PureEdDSA over canonical bytes,
 *     refuses a KMS signature that does not verify against the Key Record.
 *   - RFC 3161 checkpoint witness against a SYNTHETIC TSA (real DER tokens; never a real trust anchor).
 * Everything here is SYNTHETIC.
 */
import { generateKeyPairSync, randomBytes, sign as edSign } from "node:crypto";
import * as asn1js from "asn1js";
import * as pkijs from "pkijs";
import { describe, expect, it } from "vitest";
import {
  buildTimestampRequest, checkpointFor, deriveKeyRecord, EIE_REASON, InMemoryWitnessStore, keyMaySeal, keyRecordResolver, objectHash,
  pemToDer, publicKeySha256, resolveSealKey, verifyTimestampResponse, verifyWindow, verifyWitnessChain, WitnessAppendViolation,
  witnessPort, witnessSealedWindows, KEY_APPROVER_ROLE, KEY_CUSTODIAN_ROLE,
  type EvidenceWindow, type KeyRecordEvent, type KeyRegistration, type WitnessRecord,
} from "../../packages/domain/eie";
import { canonicalJson } from "../../packages/domain/canonical-json";
import { kmsSealSigner, type KmsSigningClient } from "../../apps/web/lib/eie/pilot/kms-seal-signer";
import { createSyntheticTsa } from "./fixtures/eie-synthetic-tsa";
import { makeRecorder, NODE, TECH, baselineRequest, simulatedStream, at } from "./fixtures/eie-simulated";

const CUSTODIAN = { role: KEY_CUSTODIAN_ROLE, accountId: "custodian-synthetic" } as const;
const OWNER = { role: KEY_APPROVER_ROLE, accountId: "owner-synthetic" } as const;

function edKey() {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  return { publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(), privateKey };
}

function registration(keyId: string, publicKeyPem: string, overrides: Partial<KeyRegistration> = {}): KeyRegistration {
  return {
    keyId, algorithm: "ED25519", protectionLevel: "SOFTWARE", provider: "GOOGLE_CLOUD_KMS",
    providerResource: `projects/synthetic/locations/us/keyRings/pilot/cryptoKeys/recorder/cryptoKeyVersions/${keyId.slice(-1)}`,
    purpose: "EIE_RECORDER_SEAL", environment: "PILOT", publicKeyPem, publicKeySha256: publicKeySha256(publicKeyPem),
    supersedes: null, createdAt: "2026-09-28T10:00:00Z", custodianRole: KEY_CUSTODIAN_ROLE, ...overrides,
  };
}

function lifecycle(reg: KeyRegistration, activatedAt: string): KeyRecordEvent[] {
  return [
    { type: "REGISTERED", keyId: reg.keyId, registration: reg, by: CUSTODIAN, at: reg.createdAt },
    { type: "APPROVED", keyId: reg.keyId, registrationHash: objectHash(reg), by: OWNER, at: activatedAt },
    { type: "ACTIVATED", keyId: reg.keyId, by: CUSTODIAN, at: activatedAt },
  ];
}

describe("Recorder Key Record", () => {
  const k1 = edKey();
  const r1 = registration("TA14-EIE-PILOT-REC-0001", k1.publicKeyPem);

  it("records algorithm, protection level, provider, environment and custodian explicitly; SOFTWARE is never HSM", () => {
    const record = deriveKeyRecord(lifecycle(r1, "2026-09-28T11:00:00Z"));
    expect(record[r1.keyId]).toMatchObject({
      status: "ACTIVE", registration: { algorithm: "ED25519", protectionLevel: "SOFTWARE", provider: "GOOGLE_CLOUD_KMS", environment: "PILOT", custodianRole: KEY_CUSTODIAN_ROLE },
      approval: { approvedBy: "owner-synthetic", approverRole: KEY_APPROVER_ROLE },
    });
    expect(keyMaySeal(record, r1.keyId, "PILOT")).toBe(true);
    expect(keyMaySeal(record, r1.keyId, "PRODUCTION")).toBe(false);
  });

  it("refuses invalid registrations: another algorithm, a mismatched public-key hash, a development key outside development/test", () => {
    const bad: KeyRegistration[] = [
      { ...r1, keyId: "A", algorithm: "ECDSA_P256_SHA256" as never },
      { ...r1, keyId: "B", publicKeySha256: "0".repeat(64) },
      { ...r1, keyId: "C", provider: "DEVELOPMENT", protectionLevel: "DEVELOPMENT", providerResource: null, environment: "PILOT" },
      { ...r1, keyId: "D", protectionLevel: "HSM" as const, provider: "DEVELOPMENT" },
      { ...r1, keyId: "E", providerResource: null },
    ];
    const record = deriveKeyRecord(bad.map((r) => ({ type: "REGISTERED" as const, keyId: r.keyId, registration: r, by: CUSTODIAN, at: r.createdAt })));
    expect(Object.keys(record)).toEqual([]);
  });

  it("only the Governance Owner approves, only the Custodian activates, and nothing is out of order", () => {
    const [registered, approved, activated] = lifecycle(r1, "2026-09-28T11:00:00Z");
    const selfApproved = deriveKeyRecord([registered, { ...approved, by: { ...CUSTODIAN } } as KeyRecordEvent, activated]);
    expect(selfApproved[r1.keyId].status).toBe("PENDING_APPROVAL");
    const early = deriveKeyRecord([registered, activated, approved]);
    expect(early[r1.keyId].status).toBe("APPROVED");
    const wrongHash = deriveKeyRecord([registered, { ...approved, registrationHash: "0".repeat(64) } as KeyRecordEvent]);
    expect(wrongHash[r1.keyId].status).toBe("PENDING_APPROVAL");
  });

  it("rotation and revocation preserve historical verification; each seal binds to the key active when it sealed", () => {
    const k2 = edKey();
    const r2 = registration("TA14-EIE-PILOT-REC-0002", k2.publicKeyPem, { supersedes: r1.keyId, createdAt: "2026-09-28T12:00:00Z" });
    const events: KeyRecordEvent[] = [
      ...lifecycle(r1, "2026-09-28T11:00:00Z"),
      { type: "RETIRED", keyId: r1.keyId, by: CUSTODIAN, at: "2026-09-28T13:00:00Z", reason: "rotation" },
      ...lifecycle(r2, "2026-09-28T13:00:00Z"),
    ];
    const record = deriveKeyRecord(events);
    expect(record[r1.keyId]).toMatchObject({ status: "RETIRED", supersededBy: r2.keyId });
    expect(resolveSealKey(record, r1.keyId, "2026-09-28T12:30:00Z", ["PILOT"])).toMatchObject({ ok: true, algorithm: "ED25519", protectionLevel: "SOFTWARE" });
    expect(resolveSealKey(record, r1.keyId, "2026-09-28T13:30:00Z", ["PILOT"])).toEqual({ ok: false, reasonCode: EIE_REASON.KEY_NOT_ACTIVE_AT_SEAL });
    expect(resolveSealKey(record, r1.keyId, "2026-09-28T10:30:00Z", ["PILOT"])).toEqual({ ok: false, reasonCode: EIE_REASON.KEY_NOT_ACTIVE_AT_SEAL });
    expect(keyMaySeal(record, r1.keyId, "PILOT")).toBe(false);

    const revoked = deriveKeyRecord([...events, { type: "REVOKED", keyId: r2.keyId, by: CUSTODIAN, at: "2026-09-28T16:00:00Z", effectiveAt: "2026-09-28T15:00:00Z", reason: "synthetic compromise" }]);
    expect(resolveSealKey(revoked, r2.keyId, "2026-09-28T14:00:00Z", ["PILOT"])).toMatchObject({ ok: true, underReview: true });
    expect(resolveSealKey(revoked, r2.keyId, "2026-09-28T15:30:00Z", ["PILOT"])).toEqual({ ok: false, reasonCode: EIE_REASON.KEY_REVOKED });
    expect(resolveSealKey(revoked, r2.keyId, "2026-09-28T14:00:00Z", ["PRODUCTION"])).toEqual({ ok: false, reasonCode: EIE_REASON.KEY_ENVIRONMENT_MISMATCH });
  });
});

describe("KMS seal signer (stub client, real Ed25519)", () => {
  const key = edKey();
  const resource = "projects/synthetic/locations/us/keyRings/pilot/cryptoKeys/recorder/cryptoKeyVersions/1";
  const client = (signWith = key.privateKey, name = resource): KmsSigningClient => ({
    asymmetricSign: async (request) => [{ name, signature: edSign(null, Buffer.from(request.data), signWith) }],
  });

  it("signs the canonical bytes with PureEdDSA; the seal verifies under the Key Record", async () => {
    const signer = kmsSealSigner({ keyId: "TA14-EIE-PILOT-REC-0001", keyVersionName: resource, publicKeyPem: key.publicKeyPem, client: client() });
    expect(signer).toMatchObject({ algorithm: "ED25519", development: false });
    const payload = { windowId: "EIE-WIN-x", sealHash: "a".repeat(64) };
    const signature = await signer.sign(payload);
    const { verifyCanonical } = await import("../../packages/crypto/receipts");
    expect(verifyCanonical(payload, signature, key.publicKeyPem)).toBe(true);
    expect(canonicalJson(payload)).toBe('{"sealHash":"' + "a".repeat(64) + '","windowId":"EIE-WIN-x"}');
  });

  it("refuses a KMS signature that does not verify against the recorded public key, or from another key version", async () => {
    const other = edKey();
    await expect(kmsSealSigner({ keyId: "K", keyVersionName: resource, publicKeyPem: key.publicKeyPem, client: client(other.privateKey) }).sign({ a: 1 }))
      .rejects.toThrow(/does not verify/);
    await expect(kmsSealSigner({ keyId: "K", keyVersionName: resource, publicKeyPem: key.publicKeyPem, client: client(key.privateKey, `${resource}0`) }).sign({ a: 1 }))
      .rejects.toThrow(/key version/);
  });

  it("a Recorder sealing through the KMS signer produces windows that verify historically under the Key Record", async () => {
    const reg = registration("TA14-EIE-PILOT-REC-0001", key.publicKeyPem);
    const record = deriveKeyRecord(lifecycle(reg, "2026-09-28T13:00:00Z"));
    const signer = kmsSealSigner({ keyId: reg.keyId, keyVersionName: resource, publicKeyPem: key.publicKeyPem, client: client() });
    const run = makeRecorder({ signer });
    const opened = await run.recorder.openWindow(baselineRequest(), TECH);
    if (!opened.opened) throw new Error(`${opened.reasonCodes}`);
    run.time.set(11);
    await run.recorder.submitObservation(opened.windowId, simulatedStream()[0], NODE);
    run.time.set(20);
    const closed = await run.recorder.closeWindow(opened.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
    if (!closed.closed) throw new Error();
    expect(closed.window.recorderSignature).toMatchObject({ keyId: reg.keyId, algorithm: "ED25519" });
    expect(verifyWindow(closed.window, keyRecordResolver(record, ["PILOT"])).valid).toBe(true);
    expect(verifyWindow(closed.window, keyRecordResolver(record, ["PRODUCTION"])).reasonCodes).toContain(EIE_REASON.SIGNATURE_INVALID);
    const relabelled = structuredClone(closed.window) as EvidenceWindow;
    (relabelled.recorderSignature as { algorithm: string }).algorithm = "ECDSA_P256_SHA256";
    expect(verifyWindow(relabelled, keyRecordResolver(record, ["PILOT"])).reasonCodes).toContain(EIE_REASON.SIGNATURE_INVALID);
  });
});

describe("RFC 3161 token verification (SYNTHETIC TSA)", () => {
  const digest = "ab".repeat(32);
  const nonce = "31" + randomBytes(15).toString("hex");
  const genTime = new Date("2026-09-28T15:00:00Z");
  const expectations = (anchor: string) => ({ digestHex: digest, nonceHex: nonce, trustAnchorsDer: [pemToDer(anchor)], notBefore: "2026-09-28T14:00:00Z" });

  it("a granted response verifies and exposes TSA identity, time, algorithm, imprint and token", async () => {
    const tsa = await createSyntheticTsa();
    const v = await verifyTimestampResponse(await tsa.respond(buildTimestampRequest(digest, nonce), genTime), expectations(tsa.trustAnchorPem));
    expect(v).toMatchObject({ valid: true, fields: { genTime: genTime.toISOString(), hashAlgorithmOid: "2.16.840.1.101.3.4.2.1", messageImprintHex: digest, nonceHex: nonce } });
    expect(v.valid && v.fields.tsaSubject).toMatch(/SYNTHETIC TEST TSA/);
    expect(v.valid && v.fields.tokenDerBase64.length).toBeGreaterThan(100);
  });

  it.each([
    ["imprint does not match the checkpoint", { tamperImprint: true }, "IMPRINT_MISMATCH"],
    ["nonce missing", { dropNonce: true }, "NONCE_MISMATCH"],
    ["TSA rejected the request", { reject: true }, "TSA_STATUS_REJECTED"],
    ["signer certificate not bound by the ESS signing-certificate attribute", { omitSigningCertificate: true }, "SIGNING_CERTIFICATE_UNBOUND"],
  ])("%s fails closed", async (_name, options, code) => {
    const tsa = await createSyntheticTsa();
    const v = await verifyTimestampResponse(await tsa.respond(buildTimestampRequest(digest, nonce), genTime, options), expectations(tsa.trustAnchorPem));
    expect(v.valid).toBe(false);
    expect(v.detail).toContain(code);
  });

  it("an untrusted TSA, a TSA without the time-stamping key usage, a stamp before the seal, or garbage all fail closed", async () => {
    const tsa = await createSyntheticTsa();
    const other = await createSyntheticTsa({ label: "OTHER" });
    const reply = await tsa.respond(buildTimestampRequest(digest, nonce), genTime);
    expect((await verifyTimestampResponse(reply, expectations(other.trustAnchorPem))).detail).toContain("CHAIN_UNTRUSTED");
    const noEku = await createSyntheticTsa({ eku: false, label: "NOEKU" });
    expect((await verifyTimestampResponse(await noEku.respond(buildTimestampRequest(digest, nonce), genTime), expectations(noEku.trustAnchorPem))).detail).toContain("EKU_MISSING");
    expect((await verifyTimestampResponse(reply, { ...expectations(tsa.trustAnchorPem), notBefore: "2026-09-28T16:00:00Z" })).detail).toContain("GENTIME_BEFORE_SEAL");
    // RFC 3161 2.3: the time-stamping key usage must be marked critical.
    const nonCritical = await createSyntheticTsa({ ekuCritical: false, label: "NONCRITICAL" });
    expect((await verifyTimestampResponse(await nonCritical.respond(buildTimestampRequest(digest, nonce), genTime), expectations(nonCritical.trustAnchorPem))).detail).toContain("EKU_MISSING");
    expect((await verifyTimestampResponse(new Uint8Array([1, 2, 3]), expectations(tsa.trustAnchorPem))).detail).toEqual(["PARSE_ERROR"]);
  });
});

describe("Checkpoint witness chain", () => {
  async function sealedWindows(count: number) {
    const run = makeRecorder();
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      run.time.set(i * 1000);
      const opened = await run.recorder.openWindow(baselineRequest({ openTrigger: { type: "SESSION_START", ref: `S-${i}` } }), TECH);
      if (!opened.opened) throw new Error(`${opened.reasonCodes}`);
      run.time.set(i * 1000 + 11);
      const obs = simulatedStream({ firstObservedAt: at(i * 1000 + 10), firstSequence: 100 + i * 10 })[0];
      await run.recorder.submitObservation(opened.windowId, { ...obs, observationId: `W${i}` }, NODE);
      run.time.set(i * 1000 + 20);
      await run.recorder.closeWindow(opened.windowId, { type: "DECLARED_END_OF_PURPOSE", ref: null }, TECH);
      ids.push(opened.windowId);
    }
    const windows = (await Promise.all(ids.map((id) => run.recorder.getWindow(id)))) as EvidenceWindow[];
    return { run, windows };
  }
  const later = (w: EvidenceWindow) => () => new Date(Date.parse(w.closedAt!) + 5000);

  it("each seal is witnessed in order; the TSA receives only the checkpoint hash; the chain verifies offline", async () => {
    const tsa = await createSyntheticTsa();
    const { windows } = await sealedWindows(3);
    const store = new InMemoryWitnessStore();
    const seen: Uint8Array[] = [];
    const transport = { url: tsa.url, request: async (q: Uint8Array) => { seen.push(q); return tsa.respond(q, new Date("2026-09-28T18:00:00Z")); } };
    const result = await witnessSealedWindows({
      recorderId: "EIE-RECORDER-TEST", sealedWindows: windows, store, tsa: transport, trust: { trustAnchorsPem: [tsa.trustAnchorPem] },
      now: () => "2026-09-28T18:00:00Z", randomBytes: (n) => randomBytes(n),
    });
    expect(result).toMatchObject({ failure: null, pending: [] });
    const records = await store.list("EIE-RECORDER-TEST");
    expect(records.map((r) => r.checkpoint.seq)).toEqual([1, 2, 3]);
    expect(records[1].checkpoint.prevCheckpointHash).toBe(records[0].checkpointHash);
    // The request carries a 32-byte digest equal to the checkpoint hash and nothing from the evidence.
    const asText = Buffer.from(seen[0]).toString("latin1");
    expect(Buffer.from(seen[0]).toString("hex")).toContain(records[0].checkpointHash);
    expect(asText).not.toContain("EIE-WIN");
    const chain = await verifyWitnessChain(records, { trustAnchorsPem: [tsa.trustAnchorPem] });
    expect(chain.valid).toBe(true);
    expect([...chain.witnessed.keys()]).toEqual(windows.map((w) => w.windowId).sort((a, b) =>
      windows.find((w) => w.windowId === a)!.closedAt!.localeCompare(windows.find((w) => w.windowId === b)!.closedAt!)));
    // Parse every outbound request: it is exactly an RFC 3161 TimeStampReq over the checkpoint digest, nothing else.
    for (const [index, query] of seen.entries()) {
      const request = new pkijs.TimeStampReq({ schema: asn1js.fromBER(Uint8Array.from(query).buffer).result });
      expect(request.version).toBe(1);
      expect(request.messageImprint.hashAlgorithm.algorithmId).toBe("2.16.840.1.101.3.4.2.1");
      expect(Buffer.from(request.messageImprint.hashedMessage.valueBlock.valueHexView).toString("hex")).toBe(records[index].checkpointHash);
      expect(request.certReq).toBe(true);
      expect(request.reqPolicy).toBeUndefined();
      expect(request.extensions).toBeUndefined();
      const bytes = Buffer.from(query);
      for (const w of windows) {
        for (const fragment of [w.windowId, w.sealHash!, w.assetId, JSON.stringify(w.entries[0])]) expect(bytes.includes(Buffer.from(fragment))).toBe(false);
        expect(bytes.includes(Buffer.from(w.sealHash!, "hex"))).toBe(false);
      }
      // SEQUENCE { version, messageImprint { AlgorithmIdentifier, 32-byte digest }, 16-byte nonce, certReq }: small and fixed-shape.
      expect(query.byteLength).toBeLessThan(100);
    }
    const port = witnessPort(store, "EIE-RECORDER-TEST", { trustAnchorsPem: [tsa.trustAnchorPem] });
    expect(await port(windows[0])).toBe(true);
    expect(await port({ ...windows[0], sealHash: "f".repeat(64) })).toBe(false);
  });

  it("a TSA failure leaves the seal standing and the window pending; a later run resumes without skipping", async () => {
    const tsa = await createSyntheticTsa();
    const { windows } = await sealedWindows(2);
    const store = new InMemoryWitnessStore();
    const trust = { trustAnchorsPem: [tsa.trustAnchorPem] };
    const base = { recorderId: "EIE-RECORDER-TEST", sealedWindows: windows, store, trust, now: () => "x", randomBytes: (n: number) => randomBytes(n) };
    const failed = await witnessSealedWindows({ ...base, tsa: { url: tsa.url, request: async () => { throw new Error("offline"); } } });
    expect(failed).toMatchObject({ witnessed: [], failure: { detail: ["TSA_UNREACHABLE"] } });
    expect(failed.pending).toHaveLength(2);
    const rejected = await witnessSealedWindows({ ...base, tsa: tsa.transport(later(windows[1]), { reject: true }) });
    expect(rejected.failure?.detail).toEqual(["TSA_STATUS_REJECTED"]);
    const resumed = await witnessSealedWindows({ ...base, tsa: tsa.transport(later(windows[1])) });
    expect(resumed).toMatchObject({ failure: null });
    expect((await store.list("EIE-RECORDER-TEST")).map((r) => r.checkpoint.seq)).toEqual([1, 2]);
  });

  it("deleting, reordering or altering a checkpoint breaks the chain; the store refuses non-extending appends", async () => {
    const tsa = await createSyntheticTsa();
    const { windows } = await sealedWindows(3);
    const store = new InMemoryWitnessStore();
    const trust = { trustAnchorsPem: [tsa.trustAnchorPem] };
    await witnessSealedWindows({ recorderId: "EIE-RECORDER-TEST", sealedWindows: windows, store, tsa: tsa.transport(later(windows[2])), trust, now: () => "x", randomBytes: (n) => randomBytes(n) });
    const records = await store.list("EIE-RECORDER-TEST");
    expect((await verifyWitnessChain([records[0], records[2]], trust)).reasonCodes).toEqual([EIE_REASON.WITNESS_CHAIN_BROKEN]);
    expect((await verifyWitnessChain([records[1], records[0], records[2]], trust)).valid).toBe(false);
    const altered = structuredClone(records) as WitnessRecord[];
    altered[1].checkpoint.sealHash = "e".repeat(64);
    expect((await verifyWitnessChain(altered, trust)).reasonCodes).toEqual([EIE_REASON.WITNESS_CHAIN_BROKEN]);
    const swappedToken = structuredClone(records) as WitnessRecord[];
    swappedToken[1].tsa = { ...records[2].tsa };
    expect((await verifyWitnessChain(swappedToken, trust)).reasonCodes).toEqual([EIE_REASON.WITNESS_INVALID]);
    expect((await verifyWitnessChain(records, { trustAnchorsPem: [(await createSyntheticTsa({ label: "X" })).trustAnchorPem] })).valid).toBe(false);
    await expect(store.append({ ...records[0] })).rejects.toThrow(WitnessAppendViolation);
    const next = checkpointFor("EIE-RECORDER-TEST", null, windows[0]);
    await expect(store.append({ ...records[0], checkpoint: next })).rejects.toThrow(WitnessAppendViolation);
  });
});
