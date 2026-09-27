/**
 * TA-14-NIRET-GA-C1 input/output contract types.
 *
 * Entries are evidence, not conclusions: the engine alone decides whether a
 * proposition is established. The JSON schemas in /schemas mirror these types.
 */

import type { PropositionId } from "./propositions";

export type Unit = "F" | "PCT_RH" | "CFM" | "IN_WC" | "V" | "A";

export type MeasurementKey =
  | "returnDryBulb" | "returnWetBulb" | "returnRh"
  | "supplyDryBulb" | "supplyWetBulb" | "supplyRh"
  | "outdoorDryBulb" | "outdoorWetBulb" | "outdoorRh"
  | "airflow" | "returnStatic" | "supplyStatic"
  | "suctionLineTemp" | "liquidLineTemp"
  | "supplyVoltage" | "compressorCurrent" | "blowerCurrent";

/** Where a value came from. Provenance never changes the determination. */
export type Provenance = "MANUAL" | `INSTRUMENT:${string}`;

export interface Measurement {
  value: number;
  unit: Unit;
  /** Instrument accuracy in the same unit; absent => the comparison cannot be established (F1). */
  accuracy?: number;
  measuredAt: string;
  location: string;
  instrumentId: string;
  provenance: Provenance;
}

export type StateEventType =
  | "FILTER_REPLACED_OR_REMOVED" | "BLOWER_SETTING_CHANGED" | "DUCT_DAMPER_ZONING_CHANGE"
  | "EVAPORATOR_COIL_CLEANED" | "CONDENSER_COIL_CLEANED" | "PANELS_REMOVED"
  | "THERMOSTAT_CONTROL_MODE_CHANGE" | "COMPRESSOR_POWER_INTERRUPTED_OR_CYCLED"
  | "REFRIGERANT_CHARGE_CHANGED" | "FREEZE_SWITCH_TRIP_OR_ICING" | "DEFROST_CYCLE"
  | "REPAIR_OR_COMPONENT_REPLACEMENT" | "MATERIAL_WEATHER_OR_LOAD_CHANGE";

export interface StateEvent {
  type: StateEventType;
  at: string;
  /** Repair affected equipment identity or the metering device (P01/P03 must be re-verified). */
  affectsIdentity?: boolean;
}

export type BasisCode = string;

export interface GateARequest {
  requestId: string;
  question: "REFRIGERANT_CHARGE" | "RESTRICTION" | "NON_CONDENSABLES" | "COMPRESSOR" | "VALVE" | "LEAK" | "OTHER";
  statedProposition: string;
  statedBasis: BasisCode[];
  /** Evaluation instant supplied by the caller; the engine reads no clock. */
  evaluatedAt: string;
  priorReceiptIds?: string[];
}

export interface Instrument {
  instrumentId: string;
  calibrationValid: boolean;
  setupVerified: boolean;
}

export interface PressureInstrument {
  instrumentId: string;
  ratedForRefrigerants: string[];
  calibrationValid: boolean;
}

export interface CorrectionRecord {
  at: string;
  declaredFinding: string;
  authorityRef: string;
  beforeRecordRef: string;
  correctionDescription: string;
  afterRecordRef: string;
  rebaselinedAt?: string;
}

export interface IceRestorationRecord {
  iceCompletelyRemoved: boolean;
  causeInvestigated: boolean;
  causeDisposition: "CORRECTED" | "BOUNDED" | "UNRESOLVED";
  airflowAndHeatTransferReestablished: boolean;
  returnedToOperatingEnvelope: boolean;
  steadyStateReestablished: boolean;
  freshMeasurementSetObtained: boolean;
  completedAt: string;
}

export type CertificationEvidence =
  | { status: "CERTIFIED"; type: "TYPE_I" | "TYPE_II" | "TYPE_III" | "UNIVERSAL"; certificateRef: string }
  | { status: "SUPERVISED_APPRENTICE"; supervisorCertificateRef: string; supervisorType: "TYPE_I" | "TYPE_II" | "TYPE_III" | "UNIVERSAL" }
  | { status: "NOT_CERTIFIED" };

export type AirflowMethod =
  | "OEM_SPECIFIED_METHOD" | "OEM_CFM_ESP_TABLE" | "DUCT_TRAVERSE" | "FLOW_GRID"
  | "PRESSURE_MATCHING" | "TEMPERATURE_RISE";

export type PressureSideEntry = "NOT_PERFORMED" | "PROPOSED_OUTSIDE_GATE_A" | "ATTEMPTED" | "INSTRUMENTS_CONNECTED";

export interface EvidenceRecord {
  recordId: string;
  pressureSideEntry: PressureSideEntry;
  equipment: {
    indoorModel?: string;
    outdoorModel?: string;
    pairingVerifiedAgainstOem?: boolean;
    identityEstablishableFromOem?: boolean;
    configuration: "DUCTED_SPLIT" | "DUCTLESS" | "MINI_SPLIT" | "MULTI_SPLIT" | "PACKAGED" | "UNKNOWN";
    compressorStaging: "SINGLE_STAGE" | "TWO_STAGE" | "INVERTER" | "UNKNOWN";
    verifiedAt?: string;
  };
  mode: "COOLING" | "HEATING" | "UNKNOWN";
  metering: {
    type: "FIXED_ORIFICE" | "CAPILLARY_TUBE" | "TXV" | "EEV" | "UNKNOWN";
    evidenceBasis: "DIRECT_OBSERVATION" | "CONFIGURATION_DOCUMENT" | "INFERRED_FROM_PRESSURE" | "NONE";
    establishableFromOem?: boolean;
    verifiedAt?: string;
  };
  refrigerant: {
    declared?: string;
    safetyClass?: "A1" | "A2L" | "A2" | "A3" | "B1" | "B2L" | "B2" | "B3" | "UNKNOWN";
    a2lMarkingsObserved: boolean;
    flammableRefrigerantLabelsObserved: boolean;
    integritySuspect: boolean;
  };
  technician: {
    identity: string;
    certification?: CertificationEvidence;
  };
  authorization: {
    workScopeRef?: string;
    workScopeIncludesDiagnosis?: boolean;
    sitePermission?: "GRANTED" | "WITHHELD" | "UNCONFIRMED";
    jurisdiction?: "NOT_REQUIRED" | "CONFIRMED" | "UNCONFIRMED";
  };
  safety: { hazard?: "NONE_IDENTIFIED" | "CORRECTABLE_HAZARD" | "BEYOND_COMPETENCE" };
  instruments: Instrument[];
  plannedPressureInstruments: PressureInstrument[];
  operation: {
    runStartedAt?: string;
    compressorRunningSteadily?: boolean;
  };
  events: StateEvent[];
  corrections: CorrectionRecord[];
  evaporator: {
    iceStatus?: "NO_ICE" | "ICE_PRESENT" | "UNDETERMINED";
    iceObservedAt?: string;
    icingOccurred?: boolean;
    iceRestoration?: IceRestorationRecord;
  };
  condenser: {
    panelsInPlace?: boolean;
    coilCondition?: "CLEAR" | "PARTIAL_OBSTRUCTION" | "MATERIALLY_RESTRICTED" | "UNDETERMINED";
    fanOperating?: boolean;
    observedAt?: string;
  };
  airflowMethod?: {
    method: AirflowMethod;
    motorType: "PSC" | "ECM" | "OTHER" | "UNKNOWN";
    componentsClean?: boolean;
  };
  /** Recorded observations that C1 preserves but does not evaluate. */
  observations?: {
    filterCondition?: string;
    blowerOperatingEvidence?: string;
    compressorOperatingEvidence?: string;
    leakIndications?: string;
  };
  measurements: Partial<Record<MeasurementKey, Measurement>>;
  /** Repeated readings of the variable named by the OEM stability criterion (C06). */
  stabilityReadings?: Measurement[];
}

export interface OemRange {
  min: number;
  max: number;
  unit: Unit;
  ref: string;
}

export type NoninvasiveDerivation =
  | { kind: "RETURN_MINUS_SUPPLY_DRY_BULB" }
  | { kind: "RETURN_MINUS_SUPPLY_WET_BULB" }
  | { kind: "SINGLE_MEASUREMENT"; measurement: MeasurementKey };

export interface OemReference {
  documentRefs: string[];
  chargingMethod: { status: "IDENTIFIED"; ref: string } | { status: "NOT_OBTAINED"; obtainable: boolean };
  requiresUnavailableToolOrMode: boolean;
  airflowRange?: OemRange;
  espRange?: OemRange;
  ambientEnvelope?: OemRange;
  voltageRange?: OemRange;
  minRunMinutes?: { value: number; ref: string };
  stabilityCriterion?: { measurement: MeasurementKey; maxChange: number; unit: Unit; ref: string };
  permitsEcmWithTableMethod?: boolean;
  measurementLocations: Partial<Record<MeasurementKey, string>>;
  noninvasiveCriterion:
    | { status: "PUBLISHED"; derivation: NoninvasiveDerivation; range: OemRange }
    | { status: "NOT_OBTAINED"; obtainable: boolean };
}

export interface GateAInput {
  request: GateARequest;
  evidence: EvidenceRecord;
  oem: OemReference;
}

export type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
export type CheckResult = "SATISFIED" | "HOLD" | "ESCALATE" | "DENY";

export interface PropositionCheck {
  proposition: PropositionId;
  result: CheckResult;
  reason: string;
  evidenceKeys: string[];
}

export interface IntervalFinding {
  subject: string;
  value: number;
  uncertainty: number;
  range: { min: number; max: number; unit: Unit; ref: string };
  classification: "WITHIN" | "OUTSIDE" | "AMBIGUOUS";
}

export interface GateAEvaluation {
  determination: Determination;
  checks: PropositionCheck[];
  indicationPath: "I1" | null;
  ambiguityFindings: IntervalFinding[];
  derivedTesp: { value: number; uncertainty: number; unit: Unit } | null;
  window: { effectiveRunStart: string | null; windowStart: string | null; windowEnd: string };
  runRestarted: boolean;
}
