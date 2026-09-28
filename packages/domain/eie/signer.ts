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
  /** True only for development keys generated outside any governed custody. */
  readonly development: boolean;
  sign(payload: unknown): string;
}

/** Resolves the public key a verifier trusts for a Recorder key id. */
export type RecorderKeyResolver = (keyId: string) => string | undefined;

export function developmentSealSigner(pair: SigningKeyPair): RecorderSealSigner {
  return { keyId: pair.keyId, development: true, sign: (payload) => signCanonical(payload, pair.privateKeyPem) };
}

export function verifySealSignature(payload: unknown, signature: { keyId: string; signature: string } | null, resolve: RecorderKeyResolver): boolean {
  if (!signature) return false;
  const publicKeyPem = resolve(signature.keyId);
  if (!publicKeyPem) return false;
  try {
    return verifyCanonical(payload, signature.signature, publicKeyPem);
  } catch {
    return false;
  }
}
