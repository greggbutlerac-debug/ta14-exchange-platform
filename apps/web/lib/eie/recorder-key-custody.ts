/**
 * TA-14-EIE-ARCH-1.0 s18: Recorder seal-signing key custody boundary (server side).
 *
 * Owner/infrastructure decision required and NOT made: where the Recorder's private signing key is
 * held (for example a managed KMS/HSM or a platform secret), who may use it, how it rotates, and which
 * record publishes the trusted public keys that verifiers resolve by keyId. No production secret is
 * created or read here. Until custody is established, the production signer is unavailable and the
 * Recorder refuses to open windows in PRODUCTION mode (EIE-WIN-SEAL_SIGNER_UNAVAILABLE).
 */
import type { RecorderKeyResolver, RecorderSealSigner } from "../../../../packages/domain/eie/signer";

export interface RecorderKeyCustody {
  readonly status: "ESTABLISHED" | "NOT_ESTABLISHED";
  /** Signer bound to the custodied key; null when custody is not established. */
  signer(): RecorderSealSigner | null;
  /** Trusted public keys by keyId, from the governed key record. */
  resolvePublicKey: RecorderKeyResolver;
}

export const KEY_CUSTODY_NOT_ESTABLISHED: RecorderKeyCustody = Object.freeze({
  status: "NOT_ESTABLISHED" as const,
  signer: () => null,
  resolvePublicKey: () => undefined,
});

/** The production custody in force. Replace only by owner decision with a governed custody implementation. */
export function productionRecorderKeyCustody(): RecorderKeyCustody {
  return KEY_CUSTODY_NOT_ESTABLISHED;
}
