/**
 * Recorder seal signer backed by a non-exportable Google Cloud KMS key (Phase 2C P2 = Option A, Tier 1
 * pilot only): EC_SIGN_ED25519 (PureEdDSA over raw data), SOFTWARE protection level. The Recorder service
 * holds sign-only permission; key material never reaches the application.
 *
 * Every signature returned by KMS is verified locally against the public key recorded in the Key Record
 * before it is used, so a mis-bound key version, a different algorithm or a corrupted response can never
 * seal evidence. The algorithm is fixed at ED25519; changing it is an explicit versioning decision.
 */
import { createPublicKey, verify } from "node:crypto";
import { canonicalJson } from "../../../../../packages/domain/canonical-json";
import type { RecorderSealSigner } from "../../../../../packages/domain/eie/signer";

/** The one KMS operation the Recorder may use. */
export interface KmsSigningClient {
  asymmetricSign(request: { name: string; data: Uint8Array }): Promise<[{ name?: string | null; signature?: Uint8Array | string | null }, ...unknown[]]>;
}

export function kmsSealSigner(args: { keyId: string; keyVersionName: string; publicKeyPem: string; client: KmsSigningClient }): RecorderSealSigner {
  const publicKey = createPublicKey(args.publicKeyPem);
  if (publicKey.asymmetricKeyType !== "ed25519") throw new Error("Key Record public key is not Ed25519; refusing to construct the seal signer");
  return {
    keyId: args.keyId,
    algorithm: "ED25519",
    development: false,
    async sign(payload: unknown): Promise<string> {
      const data = Buffer.from(canonicalJson(payload), "utf8");
      const [response] = await args.client.asymmetricSign({ name: args.keyVersionName, data });
      if (response?.name !== args.keyVersionName) throw new Error("KMS answered for a different key version; seal refused");
      const raw = response.signature;
      const signature = typeof raw === "string" ? Buffer.from(raw, "base64") : Buffer.from(raw ?? []);
      if (!verify(null, data, publicKey, signature)) throw new Error("KMS signature does not verify against the Key Record public key; seal refused");
      return signature.toString("base64url");
    },
  };
}

/** Production client: @google-cloud/kms, authenticated by the pilot host's service identity (sign-only). */
export async function googleKmsClient(): Promise<KmsSigningClient> {
  const { KeyManagementServiceClient } = await import("@google-cloud/kms");
  const client = new KeyManagementServiceClient();
  return { asymmetricSign: (request) => client.asymmetricSign(request) as never };
}
