import { randomUUID } from "node:crypto";
import {
  sha256Canonical,
  signCanonical,
  verifyCanonical,
} from "../crypto/receipts";
import type { SignedTestReceipt } from "../testing/payment-route-tests";

export interface AerRecord {
  aerId: string;
  rid: string;
  routeVersion: number;

  organizationId: string;
  systemId: string;

  purpose: string;
  scope: string;
  limitations: string[];

  boundary: "SELF_DECLARED" | "REVIEWABLE" | "VERIFIED";

  issuedAt: string;

  authorityBasis: string[];
  policyVersion: string;

  testReceipt: SignedTestReceipt;

  evidenceIndex: Array<{
    evidenceId: string;
    hash: string;
    source: string;
    claim: string;

    evidenceProvenance: {
      capturedBy: string;
      capturedAt: string;

      captureMethod:
        | "DIRECT_DEVICE"
        | "USER_ENTRY"
        | "SYSTEM_IMPORT"
        | "DERIVED";

      origin: string;
    };
  }>;

  history: Array<{
    event: string;
    at: string;
    version: number;
    eventHash?: string;
    prevEventHash?: string | null;
  }>;

  verificationInstructions: string;

  manifestHash: string;
  signingKeyId: string;
  signature: string;
}

export function generateAer(
  input: Omit<
    AerRecord,
    "aerId" | "manifestHash" | "signature" | "issuedAt" | "signingKeyId"
  >,
  signing: {
    keyId: string;
    privateKeyPem: string;
  },
  issuedAt = new Date().toISOString()
): AerRecord {
  const base = {
    ...input,
    aerId: randomUUID(),
    issuedAt,
    signingKeyId: signing.keyId,
  };

  const manifestHash = sha256Canonical(base);

  const unsigned = {
    ...base,
    manifestHash,
  };

  return {
    ...unsigned,
    signature: signCanonical(unsigned, signing.privateKeyPem),
  };
}

export function verifyAer(
  aer: AerRecord,
  publicKeyPem: string
): boolean {
  const { signature, ...unsigned } = aer;
  const { manifestHash, ...base } = unsigned;

  return (
    manifestHash === sha256Canonical(base) &&
    verifyCanonical(unsigned, signature, publicKeyPem)
  );
}
