/**
 * TA-14-NIRET-GA-C1 — stable identifiers only.
 *
 * Proposition IDs, reason codes and next-action IDs are the contract a
 * technician-facing surface renders. No display text lives here; the UI maps
 * these IDs to labels and must never add or redefine decision rules.
 */

export const GATE_A_VERSION = "TA-14-NIRET-GA-C1" as const;

/** SHA-256 of the canonical frozen specification (gate-a-c1.spec.json). */
export const FROZEN_SPEC_SHA256 =
  "484cd55baaf36f23c3150b68c79fa2fa54c66269d2862eb2bf822ca1efd6f358" as const;

export const GATE_A_SCOPE = "PRESSURE_EVIDENCE_ONLY" as const;

export const GATE_A_STATEMENT =
  "Permission to connect gauges != permission to move refrigerant." as const;

/**
 * Gating propositions evaluated before P01-P18:
 * INPUT  — the evidence input is structurally valid.
 * ENTRY  — no premature pressure-instrument entry (Amendment A1).
 * SCOPE  — the request lies inside the frozen bounded scope.
 */
export const REQUIRED_PROPOSITIONS = [
  "INPUT", "ENTRY", "SCOPE",
  "P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09",
  "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18",
] as const;

export type PropositionId = (typeof REQUIRED_PROPOSITIONS)[number];

export const NEXT_ACTION_BY_PROPOSITION: Readonly<Record<PropositionId, string>> = {
  INPUT: "CORRECT_EVIDENCE_INPUT",
  ENTRY: "RETURN_TO_NONINVASIVE_EVIDENCE_AND_RESUBMIT",
  SCOPE: "REFER_OUTSIDE_BOUNDED_GATE_A",
  P01: "ESTABLISH_EQUIPMENT_IDENTITY_AND_PAIRING",
  P02: "ESTABLISH_REFRIGERANT_IDENTITY_AND_RATED_INSTRUMENTS",
  P03: "ESTABLISH_METERING_DEVICE_FROM_DIRECT_EVIDENCE",
  P04: "COMPLETE_OEM_MINIMUM_RUN_AT_STEADY_STATE",
  P05: "VALIDATE_INSTRUMENTS_AND_RECORD_ACCURACY",
  P06: "ESTABLISH_EVAPORATOR_FREE_OF_ICE",
  P07: "COMPLETE_CORRECTION_RECORD_AND_REBASELINE",
  P08: "ESTABLISH_AIRFLOW_WITHIN_OEM_RANGE",
  P09: "ESTABLISH_EXTERNAL_STATIC_PRESSURE_WITHIN_OEM_RANGE",
  P10: "ESTABLISH_VALID_HEAT_REJECTION",
  P11: "ESTABLISH_AMBIENT_WITHIN_OEM_ENVELOPE",
  P12: "MEASURE_ENTERING_AIR_DRY_BULB_AND_WET_BULB_OR_RH",
  P13: "OBTAIN_FRESH_SYNCHRONIZED_MEASUREMENT_SET",
  P14: "OBTAIN_OEM_CHARGING_METHOD",
  P15: "RESTATE_BASIS_ON_ESTABLISHED_EVIDENCE",
  P16: "RESOLVE_HAZARD",
  P17: "ESTABLISH_AUTHORITY_TO_TEST",
  P18: "ESTABLISH_INDICATION_AGAINST_OEM_CRITERION",
};

/** Refrigerant designations listed with A2L use conditions in 40 CFR Part 82 Subpart G Appendix W. */
export const APPENDIX_W_A2L_REFRIGERANTS = [
  "R-32", "R-452B", "R-454A", "R-454B", "R-454C", "R-457A",
] as const;

/** Refrigerant-side pressure evidence keys (Amendment A1). Air-side static pressures are not among them. */
export const PRESSURE_EVIDENCE_KEYS = [
  "refrigerantPressureReadings", "suctionPressure", "liquidPressure",
  "dischargePressure", "saturationTemperature", "superheat", "subcooling",
] as const;

/** Stated bases that can never, on their own, satisfy P15 (TA-14 policy T3). */
export const PROHIBITED_BASES = [
  "GAUGE_AVAILABLE", "CUSTOMER_CLAIM", "PRIOR_TECHNICIAN_CLAIM", "SYSTEMS_ARE_ALWAYS_LOW",
  "TIME_OR_DISPATCH_PRESSURE", "REFRIGERATION_CYCLE_KNOWLEDGE", "SERVICE_HISTORY", "RH_ALONE",
] as const;

export const PERMITTED_BASES = ["NONINVASIVE_EVIDENCE"] as const;

export const TA14_POLICY_REFS = [
  "TA14-POLICY-T1: Gate A evidentiary boundary (stricter than federal certification-only requirement)",
  "TA14-POLICY-T2: Complete evaporator ice removal (owner decision; not attributed to any external authority)",
  "TA14-POLICY-T3: Prohibited bases",
  "TA14-POLICY-T4: I2 discrimination rule (not establishable by the engine in C1)",
  "TA14-POLICY-T5: Synchronized measurement set and state-change invalidation",
  "TA14-POLICY-T6: Determinations limited to ALLOW/HOLD/DENY/ESCALATE",
  "TA14-RULING-F1: Ambiguity fails closed (accuracy-interval rule)",
  "TA14-RULING-F2: Evaporator free of ice before the qualifying measurement set",
  "TA14-AMENDMENT-A1: Premature pressure-instrument entry -> DENY",
  "TA14-AMENDMENT-A2: P15 evaluated at the indication step",
  "TA14-AMENDMENT-A3: No OEM-table invention, no unit conversion, derived TESP, certification handling, CLEAR-only observations",
] as const;
