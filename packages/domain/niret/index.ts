/**
 * TA-14-NIRET-GA-C1 — Pressure-Instrument Diagnostic Entry (Gate A).
 *
 * EVIDENCE INPUT -> VALIDATION -> PROPOSITION EVALUATION -> NIRET DETERMINATION -> DETERMINISTIC RECEIPT
 *
 * This is the only entry point a technician-facing surface or instrument
 * adapter should call. Consumers render the receipt; they never re-implement
 * or override the rules. Gate A ALLOW authorizes acquisition of pressure
 * evidence only and never authorizes Gate B refrigerant-mass intervention.
 */

import { sha256Canonical } from "../../crypto/receipts";
import spec from "./gate-a-c1.spec.json";
import { evaluateGateA } from "./evaluate-gate-a";
import { FROZEN_SPEC_SHA256 } from "./propositions";
import { buildReceipt, type GateAReceipt } from "./receipt";
import type { GateAEvaluation } from "./types";
import { validateGateAInput, type ValidationOutcome } from "./validate";

export function frozenSpecSha256(): string {
  return sha256Canonical(spec);
}

// Freeze guard: the engine refuses to load against a modified specification.
if (frozenSpecSha256() !== FROZEN_SPEC_SHA256) {
  throw new Error("TA-14-NIRET-GA-C1 frozen specification fingerprint mismatch; engine disabled.");
}

export interface GateAResult {
  validation: ValidationOutcome;
  evaluation: GateAEvaluation;
  receipt: GateAReceipt;
}

export function runGateA(input: unknown): GateAResult {
  const validation = validateGateAInput(input);
  const evaluation = evaluateGateA(input, validation);
  const receipt = buildReceipt(input, evaluation);
  return { validation, evaluation, receipt };
}

export { FROZEN_SPEC_SHA256, GATE_A_SCOPE, GATE_A_VERSION, REQUIRED_PROPOSITIONS } from "./propositions";
export type { GateAReceipt } from "./receipt";
export type * from "./types";
