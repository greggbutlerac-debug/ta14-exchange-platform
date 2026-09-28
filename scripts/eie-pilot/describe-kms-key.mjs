#!/usr/bin/env node
/**
 * TA-14 EIE Tier 1 pilot — for the TA-14 RECORD INTEGRITY CUSTODIAN.
 *
 * Reads the PUBLIC key of a Google Cloud KMS key version and prints the Key Record REGISTERED event to
 * insert through the runbook. It never reads, prints or exports private key material (KMS cannot export it).
 * It refuses any key that is not EC_SIGN_ED25519, and records the protection level exactly as KMS reports it.
 *
 * Usage: node scripts/eie-pilot/describe-kms-key.mjs <cryptoKeyVersion resource name> <keyId> <custodian account uuid>
 */
import { createHash, createPublicKey } from "node:crypto";
import { KeyManagementServiceClient } from "@google-cloud/kms";

const [name, keyId, custodian] = process.argv.slice(2);
if (!name || !keyId || !custodian) {
  console.error("usage: describe-kms-key.mjs <cryptoKeyVersion> <keyId> <custodian account uuid>");
  process.exit(2);
}
const client = new KeyManagementServiceClient();
const [version] = await client.getCryptoKeyVersion({ name });
const [publicKey] = await client.getPublicKey({ name });
if (version.algorithm !== "EC_SIGN_ED25519" || publicKey.algorithm !== "EC_SIGN_ED25519") {
  console.error(`REFUSED: algorithm is ${version.algorithm}; the pilot seal contract is Ed25519 only.`);
  process.exit(1);
}
const pem = publicKey.pem;
const der = createPublicKey(pem).export({ type: "spki", format: "der" });
const createdAt = new Date(Number(version.createTime.seconds) * 1000).toISOString();
const registration = {
  keyId, algorithm: "ED25519", protectionLevel: String(version.protectionLevel), provider: "GOOGLE_CLOUD_KMS", providerResource: name,
  purpose: "EIE_RECORDER_SEAL", environment: "PILOT", publicKeyPem: pem, publicKeySha256: createHash("sha256").update(der).digest("hex"),
  supersedes: null, createdAt, custodianRole: "TA-14 RECORD INTEGRITY CUSTODIAN",
};
const event = { type: "REGISTERED", keyId, registration, by: { role: "TA-14 RECORD INTEGRITY CUSTODIAN", accountId: custodian }, at: new Date().toISOString() };
console.log(JSON.stringify(event, null, 2));
