/**
 * TA-14-EIE-ARCH-1.0 Phase 1: Physical Reality -> Environmental Integrity Node -> Environmental Integrity Recorder.
 *
 * OBSERVATION -> RECORD only. Phase 1 has no calculation, interpretation, determination,
 * authority, commitment or execution output of its own. It preserves C1-R7 receipts produced by
 * the Gate A engine; Gate A ALLOW opens pressure evidence only, and nothing here can authorize
 * Gate B or refrigerant movement.
 */
export { EIE_ARCHITECTURE_FINGERPRINT, EIE_ARCHITECTURE_ID, eieSpecFingerprint } from "./spec-guard";
export { EIE_REASON, type EieReasonCode } from "./reason-codes";
export { computeEntryHash, objectHash } from "./chain";
export { validateObservation, type ObservationValidation } from "./observation";
export {
  established, GOVERNED_CONTINUITY_PROFILES, resolveContinuityProfile, type ContinuityProfileRegistry, type ProfileResolution,
} from "./continuity-profile";
export {
  bindGateAReceipt, gateAReceiptIntact, GATE_A_RECEIPT_ID_PREFIX, type BindingResult, type PreservedWindow,
} from "./gate-a-binding";
export { developmentSealSigner, verifySealSignature, type RecorderKeyResolver, type RecorderSealSigner } from "./signer";
export {
  AppendOnlyViolation, InMemoryEvidenceStore, preservedObservationIds, type EvidenceStore, type StoredWindow, type WindowSeal,
} from "./store";
export { continuityStatusOf, EvidenceRecorder, type GateAEvaluator, type RecorderOptions } from "./recorder";
export { verifyWindow, type WindowVerification } from "./verify";
export { SimulatedNodeAdapter, SIMULATED_ADAPTER_VERSION, type NodeAdapter, type SimulatedStreamFixture } from "./simulated-node";
export {
  buildGateAInput, CHANNEL_TO_MEASUREMENT_KEY, GATE_A_INPUT_ADAPTER_VERSION, receiptCitesManifest,
  type AdapterContext, type AdapterResult, type GateAInputManifest, type GateAInputRequest, type MeasurementLineage,
} from "./gate-a-input";
export * from "./types";
