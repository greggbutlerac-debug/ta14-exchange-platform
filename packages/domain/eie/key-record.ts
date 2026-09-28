/**
 * TA-14 Recorder Key Record (s18 "Recorder seals signed with a server-side key"; Phase 2C custody ruling).
 *
 * An append-only event log of Recorder seal-signing keys. It publishes the verification material and
 * the governance state of each key, so seals stay verifiable after rotation, revocation or a later
 * migration to other custody. Each seal is bound to the exact keyId and algorithm that made it.
 *
 * - The TA-14 RECORD INTEGRITY CUSTODIAN registers, retires and revokes keys (never signs).
 * - The TA-14 GOVERNANCE OWNER approves a registered key before it may seal.
 * - Only ED25519 is admitted (the existing contract). Another algorithm is an explicit versioning decision.
 * - The protection level is always explicit; SOFTWARE is never represented as HSM.
 */
import { createHash, createPublicKey } from "node:crypto";
import { deepFreeze, objectHash } from "./chain";
import { EIE_REASON } from "./reason-codes";
import { parseInstant } from "./time";

export const KEY_CUSTODIAN_ROLE = "TA-14 RECORD INTEGRITY CUSTODIAN" as const;
export const KEY_APPROVER_ROLE = "TA-14 GOVERNANCE OWNER" as const;
export const SEAL_ALGORITHMS = ["ED25519"] as const;
export const PROTECTION_LEVELS = ["SOFTWARE", "HSM", "HSM_SINGLE_TENANT", "EXTERNAL", "HARDWARE_TOKEN", "DEVELOPMENT"] as const;
export const KEY_ENVIRONMENTS = ["DEVELOPMENT", "TEST", "PILOT", "PRODUCTION"] as const;

export type KeyEnvironment = (typeof KEY_ENVIRONMENTS)[number];

export interface KeyActor {
  role: typeof KEY_CUSTODIAN_ROLE | typeof KEY_APPROVER_ROLE;
  accountId: string;
}

/** Registration of one key version. Immutable once recorded. */
export interface KeyRegistration {
  keyId: string;
  algorithm: (typeof SEAL_ALGORITHMS)[number];
  protectionLevel: (typeof PROTECTION_LEVELS)[number];
  provider: "GOOGLE_CLOUD_KMS" | "DEVELOPMENT";
  /** e.g. projects/…/locations/…/keyRings/…/cryptoKeys/…/cryptoKeyVersions/1 */
  providerResource: string | null;
  purpose: "EIE_RECORDER_SEAL";
  environment: KeyEnvironment;
  publicKeyPem: string;
  /** SHA-256 of the DER SubjectPublicKeyInfo. */
  publicKeySha256: string;
  supersedes: string | null;
  createdAt: string;
  custodianRole: typeof KEY_CUSTODIAN_ROLE;
}

export type KeyRecordEvent =
  | { type: "REGISTERED"; keyId: string; registration: KeyRegistration; by: KeyActor; at: string }
  | { type: "APPROVED"; keyId: string; registrationHash: string; by: KeyActor; at: string }
  | { type: "ACTIVATED"; keyId: string; by: KeyActor; at: string }
  | { type: "RETIRED"; keyId: string; by: KeyActor; at: string; reason: string }
  | { type: "REVOKED"; keyId: string; by: KeyActor; at: string; effectiveAt: string; reason: string };

export type KeyStatus = "PENDING_APPROVAL" | "APPROVED" | "ACTIVE" | "RETIRED" | "REVOKED";

export interface KeyState {
  keyId: string;
  registration: KeyRegistration;
  registrationHash: string;
  status: KeyStatus;
  approval: { approvedBy: string | null; approvedAt: string | null; approverRole: typeof KEY_APPROVER_ROLE };
  activatedAt: string | null;
  retiredAt: string | null;
  revocation: { revokedAt: string; effectiveAt: string; reason: string } | null;
  supersededBy: string | null;
  refused: Array<{ event: KeyRecordEvent; reasonCode: string }>;
}

export function publicKeySha256(publicKeyPem: string): string {
  const der = createPublicKey(publicKeyPem).export({ type: "spki", format: "der" });
  return createHash("sha256").update(der).digest("hex");
}

function registrationValid(r: KeyRegistration): boolean {
  if (!(SEAL_ALGORITHMS as readonly string[]).includes(r.algorithm)) return false;
  if (!(PROTECTION_LEVELS as readonly string[]).includes(r.protectionLevel)) return false;
  if (!(KEY_ENVIRONMENTS as readonly string[]).includes(r.environment)) return false;
  if (r.purpose !== "EIE_RECORDER_SEAL" || r.custodianRole !== KEY_CUSTODIAN_ROLE) return false;
  // Development keys stay in development; a production-class environment never accepts a development key.
  if ((r.provider === "DEVELOPMENT") !== (r.protectionLevel === "DEVELOPMENT")) return false;
  if (r.protectionLevel === "DEVELOPMENT" && r.environment !== "DEVELOPMENT" && r.environment !== "TEST") return false;
  if (r.provider === "GOOGLE_CLOUD_KMS" && !r.providerResource) return false;
  try {
    const key = createPublicKey(r.publicKeyPem);
    return key.asymmetricKeyType === "ed25519" && publicKeySha256(r.publicKeyPem) === r.publicKeySha256 && parseInstant(r.createdAt) !== null;
  } catch {
    return false;
  }
}

/** Derives every key's state from the append-only log. Out-of-order or unauthorized events are refused, never applied. */
export function deriveKeyRecord(events: readonly KeyRecordEvent[]): Readonly<Record<string, KeyState>> {
  const states: Record<string, KeyState> = {};
  for (const event of events) {
    const existing = Object.hasOwn(states, event.keyId) ? states[event.keyId] : undefined;
    if (event.type === "REGISTERED") {
      if (existing || event.by.role !== KEY_CUSTODIAN_ROLE || event.registration.keyId !== event.keyId || !registrationValid(event.registration)) continue;
      states[event.keyId] = {
        keyId: event.keyId, registration: structuredClone(event.registration), registrationHash: objectHash(event.registration),
        status: "PENDING_APPROVAL", approval: { approvedBy: null, approvedAt: null, approverRole: KEY_APPROVER_ROLE },
        activatedAt: null, retiredAt: null, revocation: null, supersededBy: null, refused: [],
      };
      const predecessor = event.registration.supersedes;
      if (predecessor && Object.hasOwn(states, predecessor)) states[predecessor].supersededBy = event.keyId;
      continue;
    }
    if (!existing) continue;
    const refuse = (reasonCode: string) => existing.refused.push({ event: structuredClone(event), reasonCode });
    const custodian = event.by.role === KEY_CUSTODIAN_ROLE;
    switch (event.type) {
      case "APPROVED":
        if (event.by.role !== KEY_APPROVER_ROLE || existing.status !== "PENDING_APPROVAL" || event.registrationHash !== existing.registrationHash) refuse(EIE_REASON.KEY_EVENT_REFUSED);
        else { existing.status = "APPROVED"; existing.approval = { approvedBy: event.by.accountId, approvedAt: event.at, approverRole: KEY_APPROVER_ROLE }; }
        break;
      case "ACTIVATED":
        if (!custodian || existing.status !== "APPROVED") refuse(EIE_REASON.KEY_EVENT_REFUSED);
        else { existing.status = "ACTIVE"; existing.activatedAt = event.at; }
        break;
      case "RETIRED":
        if (!custodian || existing.status !== "ACTIVE") refuse(EIE_REASON.KEY_EVENT_REFUSED);
        else { existing.status = "RETIRED"; existing.retiredAt = event.at; }
        break;
      case "REVOKED":
        if (!custodian || existing.revocation || parseInstant(event.effectiveAt) === null) refuse(EIE_REASON.KEY_EVENT_REFUSED);
        else { existing.status = "REVOKED"; existing.revocation = { revokedAt: event.at, effectiveAt: event.effectiveAt, reason: event.reason }; }
        break;
    }
  }
  return deepFreeze(states);
}

/** A key may create new seals only while ACTIVE, in the expected environment. */
export function keyMaySeal(record: Readonly<Record<string, KeyState>>, keyId: string, environment: KeyEnvironment): boolean {
  const state = Object.hasOwn(record, keyId) ? record[keyId] : undefined;
  return state?.status === "ACTIVE" && state.registration.environment === environment;
}

export type SealKeyResolution =
  | { ok: true; publicKeyPem: string; algorithm: "ED25519"; protectionLevel: KeyRegistration["protectionLevel"]; environment: KeyEnvironment; underReview: boolean }
  | { ok: false; reasonCode: string };

/**
 * Historical verification: the key that made a seal verifies it if the seal was made while the key was
 * active (activatedAt <= sealedAt, and before retirement). Retired keys keep verifying what they sealed.
 * A seal made at or after a revocation's effective time does not verify; one made before it verifies
 * but is flagged for review (a compromised key could backdate).
 */
export function resolveSealKey(record: Readonly<Record<string, KeyState>>, keyId: string, sealedAt: string | null, environments: readonly KeyEnvironment[]): SealKeyResolution {
  const state = Object.hasOwn(record, keyId) ? record[keyId] : undefined;
  const sealedMs = parseInstant(sealedAt);
  if (!state || sealedMs === null) return { ok: false, reasonCode: EIE_REASON.KEY_UNKNOWN };
  if (!environments.includes(state.registration.environment)) return { ok: false, reasonCode: EIE_REASON.KEY_ENVIRONMENT_MISMATCH };
  const activatedMs = parseInstant(state.activatedAt);
  if (activatedMs === null || sealedMs < activatedMs) return { ok: false, reasonCode: EIE_REASON.KEY_NOT_ACTIVE_AT_SEAL };
  const retiredMs = parseInstant(state.retiredAt);
  if (retiredMs !== null && sealedMs >= retiredMs) return { ok: false, reasonCode: EIE_REASON.KEY_NOT_ACTIVE_AT_SEAL };
  if (state.revocation && sealedMs >= parseInstant(state.revocation.effectiveAt)!) return { ok: false, reasonCode: EIE_REASON.KEY_REVOKED };
  return {
    ok: true, publicKeyPem: state.registration.publicKeyPem, algorithm: state.registration.algorithm,
    protectionLevel: state.registration.protectionLevel, environment: state.registration.environment, underReview: state.revocation !== null,
  };
}

/** Adapts the Key Record to the Recorder's verification resolver (keyId, sealedAt) -> public key. */
export function keyRecordResolver(record: Readonly<Record<string, KeyState>>, environments: readonly KeyEnvironment[]) {
  return (keyId: string, sealedAt?: string | null): string | undefined => {
    const resolved = resolveSealKey(record, keyId, sealedAt ?? null, environments);
    return resolved.ok ? resolved.publicKeyPem : undefined;
  };
}
