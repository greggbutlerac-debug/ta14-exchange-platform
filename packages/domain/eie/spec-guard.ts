/**
 * Freeze guard: Phase 1 refuses to load against a modified TA-14-EIE-ARCH-1.0
 * specification (same pattern as the NIRET C1 engine guard).
 */
import { sha256Canonical } from "../../crypto/receipts";
import spec from "../../../docs/eie/TA-14-EIE-ARCH-1.0.spec.json";

export const EIE_ARCHITECTURE_ID = "TA-14-EIE-ARCH-1.0" as const;
export const EIE_ARCHITECTURE_FINGERPRINT = "f4575172495fec67c29b964465d5f90f23845dbe98d30bd31f4e9281ba075170";

export const EIE_SPEC = spec;

export function eieSpecFingerprint(): string {
  return sha256Canonical(spec);
}

if (eieSpecFingerprint() !== EIE_ARCHITECTURE_FINGERPRINT) {
  throw new Error("TA-14-EIE-ARCH-1.0 frozen specification fingerprint mismatch; Node/Recorder disabled.");
}
