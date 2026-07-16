import { createHash, createPrivateKey, createPublicKey, generateKeyPairSync, sign, verify } from "node:crypto";
import { canonicalJson } from "../domain/canonical-json";

export interface SigningKeyPair {
  keyId: string;
  privateKeyPem: string;
  publicKeyPem: string;
}

export function sha256Canonical(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

export function generateDevelopmentSigningKey(keyId = "TA14-DEV-KEY-001"): SigningKeyPair {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  return {
    keyId,
    privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(),
  };
}

export function signCanonical(value: unknown, privateKeyPem: string): string {
  return sign(null, Buffer.from(canonicalJson(value)), createPrivateKey(privateKeyPem)).toString("base64url");
}

export function verifyCanonical(value: unknown, signature: string, publicKeyPem: string): boolean {
  return verify(null, Buffer.from(canonicalJson(value)), createPublicKey(publicKeyPem), Buffer.from(signature, "base64url"));
}
