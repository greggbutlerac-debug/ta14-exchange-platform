/**
 * TA-14-EIE-ARCH-1.0 Phase 2A: Analyzer calculation contract + CRR-1 reference registry shell.
 *
 * SEALED EVIDENCE -> GOVERNED CALCULATION -> ATTRIBUTABLE CALCULATION RESULT.
 * No interpretation, DDD, authority, commitment or execution. Every production reference is CANDIDATE,
 * so every production calculation is CALCULATION NOT ESTABLISHED.
 *
 * Persistence is deliberately deferred (owner ruling): results are pure and reproducible by replay from
 * sealed windows. The s19 "analyzer computations" store and CRR-1 entry/activation-event tables follow
 * once a promotion-attestation authority and persistence contract are governed.
 */
export * from "./contract";
export * from "./crr/types";
export { buildRegistry, resolveReference, type CrrRegistry, type ReferenceResolution } from "./crr/registry";
export {
  CRR_PSY_ASHRAE_F2025_CH1, CRR_REF_NIST_REFPROP_10_0, CRR_TA14_WINDOW_STATISTICS_1, PRODUCTION_CRR_1, PRODUCTION_CRR_ENTRIES, PRODUCTION_CRR_EVENTS,
} from "./crr/entries";
export { EIE_CALCULATION_CATALOGUE, WINDOW_STATISTICS_FUNCTION } from "./catalogue";
export { WINDOW_STATISTICS_IMPLEMENTATION } from "./implementations";
export { recorderEvidenceReader, type EvidenceReader } from "./evidence-reader";
export { ANALYZER_VERSION, calculate, verifyCalculation, type AnalyzerContext, type CalculationVerification } from "./engine";
