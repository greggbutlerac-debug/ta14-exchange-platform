/**
 * s18 Recorder seal signing boundary. The Recorder signs seals through this interface only.
 *
 * Production key custody (where the private key lives, who may use it, rotation, and the trusted
 * public-key record) is an owner/infrastructure decision that has not been made. Until it is, there is
 * no production signer and the Recorder cannot open windows in PRODUCTION mode. Development signers
 * are accepted in SIMULATION mode only.
 */
import { signCanonical, verifyCanonical, type SigningKeyPair } from "../../crypto/receipts";

export interface RecorderSealSigner {
  readonly keyId: string;
  /** The seal algorithm. Only ED25519 exists; another algorithm is an explicit versioning decision. */
  readonly algorithm: "ED25519";
  /** True only for development keys generated outside any governed custody. */
  readonly development: boolean;
  /** Signs the canonical JSON of the payload (PureEdDSA over the raw bytes). May be remote (KMS). */
  sign(payload: unknown): string | Promise<string>;
}

/**
 * Resolves the public key a verifier trusts for a Recorder key id, as of the time the seal was made
 * (historical verification after rotation or revocation).
 */
export type RecorderKeyResolver = (keyId: string, sealedAt?: string | null) => string | undefined;

export interface SealSignature {
  keyId: string;
  algorithm: "ED25519";
  signature: string;
}

export function developmentSealSigner(pair: SigningKeyPair): RecorderSealSigner {
  return { keyId: pair.keyId, algorithm: "ED25519", development: true, sign: (payload) => signCanonical(payload, pair.privateKeyPem) };
}

export function verifySealSignature(payload: unknown, signature: SealSignature | null, resolve: RecorderKeyResolver, sealedAt: string | null = null): boolean {
  if (!signature || signature.algorithm !== "ED25519") return false;
  const publicKeyPem = resolve(signature.keyId, sealedAt);
  if (!publicKeyPem) return false;
  try {
    return verifyCanonical(payload, signature.signature, publicKeyPem);
  } catch {
    return false;
  }
}
