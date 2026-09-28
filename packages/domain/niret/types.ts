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
  /**
   * Amendment A9 (C1-R6): TA-14 governed measurement method followed where the OEM does not
   * prescribe the location (e.g. "GM-RA-01"). Ignored where the OEM prescribes the location.
   */
  methodId?: string;
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
  /** Amendment A8 (C1-R5): repair affected the refrigerant circuit (I3 event anchor). */
  affectsRefrigerantCircuit?: boolean;
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

/**
 * Amendment A4: how the credential was supplied (assurance) is separate from
 * whether it was independently verified. Technician entry is never VERIFIED.
 */
export interface CertificationVerification {
  assurance: "DECLARED" | "DOCUMENTED";
  status: "VERIFIED" | "NOT_VERIFIED" | "VERIFICATION_UNAVAILABLE";
  verifier?: string;
  reference?: string;
  verifiedAt?: string;
}

export type CertificationEvidence =
  | { status: "CERTIFIED"; type: "TYPE_I" | "TYPE_II" | "TYPE_III" | "UNIVERSAL"; certificateRef: string; verification?: CertificationVerification }
  | { status: "SUPERVISED_APPRENTICE"; supervisorCertificateRef: string; supervisorType: "TYPE_I" | "TYPE_II" | "TYPE_III" | "UNIVERSAL"; verification?: CertificationVerification }
  | { status: "NOT_CERTIFIED" };

/** Amendment A5: an authority/standing element established by an independent, server-side source. */
export interface AuthorityEstablishment {
  status: "ESTABLISHED" | "NOT_ESTABLISHED" | "SOURCE_UNAVAILABLE";
  finding?: string;
  source?: string;
  reference?: string;
  establishedAt?: string;
}

export type AuthorityElement = "identity" | "workScope" | "sitePermission" | "jurisdiction";

/**
 * Amendment A5: provenance of the OEM reference supplying ALLOW-contributing criteria.
 * Amendment A8 (C1-R5): a governed reference is a system binding over separately
 * preserved source records; the binding never merges their provenance.
 * The descriptive document fields (documentId, revision, pageRef, sourceRef) describe
 * a manual transcription only.
 */
export interface OemProvenance {
  acquisitionMethod: "GOVERNED_LIBRARY" | "MANUAL_TRANSCRIPTION";
  verification: "VERIFIED" | "NOT_VERIFIED" | "VERIFICATION_UNAVAILABLE";
  manufacturer?: string;
  model?: string;
  documentId?: string;
  revision?: string;
  pageRef?: string;
  sourceRef?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  /** Governed system binding identity and custody (A7/A8). */
  recordId?: string;
  recordHash?: string;
  matchedSystems?: MatchedSystem[];
  transcribedBy?: string;
  transcribedAt?: string;
  supersession?: Supersession;
  /** A8: every constituent source record, each with its own provenance. */
  sources?: OemSourceProvenance[];
  /** A8: constituent records establishing the matched-system pairing. */
  pairingSources?: string[];
  /** A8: which constituent supplies each criterion. */
  criterionSources?: Record<string, string>;
  /** A8 (R5-02): conflicts found between bound sources; any conflict -> HOLD. */
  conflicts?: string[];
}

export type Supersession = "CURRENT" | "SUPERSEDED" | "WITHDRAWN";

export type OemSourceClass =
  | "OEM_OUTDOOR_UNIT_INSTRUCTIONS"
  | "OEM_INDOOR_UNIT_FAN_PERFORMANCE"
  | "OEM_PRODUCT_DATA"
  | "AHRI_CERTIFICATION_LISTING";

/** Amendment A8: provenance of one constituent source record of a system binding. */
export interface OemSourceProvenance {
  recordId: string;
  recordHash: string;
  sourceClass: OemSourceClass;
  documentId: string;
  revision?: string;
  documentDate?: string;
  documentHash: string;
  sourceRef: string;
  transcribedBy: string;
  transcribedAt: string;
  verification: "VERIFIED" | "NOT_VERIFIED";
  verifiedBy?: string;
  verifiedAt?: string;
  supersession: Supersession;
  /** A10: AHRI listings only — present AHRI status (never read as current certification unless ACTIVE/PRODUCTION_STOPPED). */
  ahriPresentStatus?: "ACTIVE" | "PRODUCTION_STOPPED" | "DISCONTINUED" | "OBSOLETE";
  ahriCertifiedAtObservation?: boolean;
  ahriStatusObservedAt?: string;
}

/** Amendment A7: an indoor/outdoor combination the OEM document explicitly covers. */
export interface MatchedSystem {
  indoorModel: string;
  outdoorModel: string;
}

export type AirflowMethod =
  | "OEM_SPECIFIED_METHOD" | "OEM_CFM_ESP_TABLE" | "DUCT_TRAVERSE" | "FLOW_GRID"
  | "PRESSURE_MATCHING" | "TEMPERATURE_RISE";

export type PressureSideEntry = "NOT_PERFORMED" | "PROPOSED_OUTSIDE_GATE_A" | "ATTEMPTED" | "INSTRUMENTS_CONNECTED";

export interface EvidenceRecord {
  recordId: string;
  pressureSideEntry: PressureSideEntry;
  /** Stamped server-side from the authenticated session (A5). */
  submittedBy?: { accountId: string; method: "AUTHENTICATED_SESSION" };
  /** Supplied server-side by independent sources only (A5). */
  authorityEstablishment?: Partial<Record<AuthorityElement, AuthorityEstablishment>>;
  equipment: {
    /** Nameplate manufacturer (A7: matched exactly against the governed OEM record). */
    manufacturer?: string;
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
    /** A9 (P08 path b): installed indoor blower setting, as the OEM labels it (e.g. "Tap 3", "NORMAL"). */
    blowerSetting?: string;
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

/**
 * An OEM-published range. Amendment A8 (C1-R5):
 * - a bound may be null only where the OEM states "and above"/"and below" (`unbounded`), or
 * - both bounds are null and the engine derives them from OEM-stated operands (`derivation`).
 */
export interface OemRange {
  min: number | null;
  max: number | null;
  unit: Unit;
  ref: string;
  unbounded?: "MIN" | "MAX";
  derivation?: RangeDerivation;
}

/** Amendment A8 (R5-10): OEM-stated arithmetic whose every operand is OEM-published. */
export type RangeDerivation =
  | { form: "TOLERANCE_BAND"; nominal: number; tolerance: number }
  | { form: "PERCENT_OF_RATED"; rated: number; percent: number }
  | { form: "PER_TON"; nominalTons: number; minPerTon: number | null; maxPerTon: number | null };

export type MeteringType = "FIXED_ORIFICE" | "CAPILLARY_TUBE" | "TXV" | "EEV";

export type NoninvasiveDerivation =
  | { kind: "RETURN_MINUS_SUPPLY_DRY_BULB" }
  | { kind: "RETURN_MINUS_SUPPLY_WET_BULB" }
  /** A8 (R5-09): OEM-defined approach, admissible only where a bound OEM document defines it. */
  | { kind: "LIQUID_LINE_MINUS_OUTDOOR_DRY_BULB" }
  | { kind: "SINGLE_MEASUREMENT"; measurement: MeasurementKey };

/** Amendment A8 (R5-03): OEM-published airflow acceptance criteria (typed forms). */
export type AirflowCriterion =
  | { kind: "CFM_RANGE"; range: OemRange; meteringTypes?: MeteringType[] }
  | {
      kind: "TEMPERATURE_DROP";
      coverage: "COMPLETE" | "PARTIAL";
      candidates: CriterionCandidate[];
      meteringTypes?: MeteringType[];
    };

/** Amendment A9: OEM fan-performance data (airflow by setting against external static pressure). */
export interface FanPerformance {
  ref: string;
  /** OEM measurement convention of the table (e.g. "external to unit, dry coil, filter in place"). */
  convention: string;
  /** Setting the OEM designates for the matched system or charging procedure; null if the OEM designates none. */
  designatedSetting: string | null;
  settings: Array<{ setting: string; coolingPermitted: boolean; points: Array<{ esp: number; cfm: number }> }>;
}

/** Amendment A8 (R5-05): an OEM-published static-pressure limit on a measured component. */
export interface StaticLimit {
  component: "TOTAL" | "RETURN" | "SUPPLY";
  /** MAGNITUDE compares the absolute static pressure (e.g. "return static must be less than 0.40"). */
  basis: "SIGNED" | "MAGNITUDE";
  range: OemRange;
}

export interface OemReference {
  documentRefs: string[];
  provenance?: OemProvenance;
  chargingMethod:
    | {
        status: "IDENTIFIED";
        ref: string;
        /** A8 (R5-12): metering devices the method applies to. */
        meteringTypes?: MeteringType[];
        /** A8: the method requires refrigerant pressure evidence. */
        pressureBased?: boolean;
        /** A8: OEM-published applicability conditions of the method (e.g. ambient and indoor windows). */
        conditions?: ApplicabilityCondition[];
        /** A8 (I3): OEM documentation requires or supports verification after a charge change or repair. */
        postEventVerification?: { ref: string };
      }
    | { status: "NOT_OBTAINED"; obtainable: boolean };
  requiresUnavailableToolOrMode: boolean;
  /** A8 (R5-03/R5-04): typed airflow acceptance criteria; at least one applicable two-sided criterion is required. */
  airflowCriteria?: AirflowCriterion[];
  /** A8 (R5-05): ESP range covered by the OEM blower-performance data for the installed blower setting. */
  espTableDomain?: OemRange;
  /** A8 (R5-05): OEM-published static-pressure limits for the matched system. */
  staticLimits?: StaticLimit[];
  /** A9 (P08 path b): OEM fan-performance data for the exactly matched indoor unit. */
  fanPerformance?: FanPerformance;
  ambientEnvelope?: OemRange;
  voltageRange?: OemRange;
  minRunMinutes?: { value: number; ref: string };
  stabilityCriterion?: { measurement: MeasurementKey; maxChange: number; unit: Unit; ref: string };
  permitsEcmWithTableMethod?: boolean;
  measurementLocations: Partial<Record<MeasurementKey, string>>;
  noninvasiveCriterion:
    | {
        status: "PUBLISHED";
        derivation: NoninvasiveDerivation;
        /** A7: COMPLETE when the candidates cover every condition the OEM publishes a criterion for. */
        coverage: "COMPLETE" | "PARTIAL";
        /** A7: anything the bounded record cannot represent fails closed (no interpolation in C1). */
        lookup: { interpolationRequired: boolean; calculationRequired: boolean; unrepresentedConditions: string[] };
        candidates: CriterionCandidate[];
      }
    | { status: "NOT_OBTAINED"; obtainable: boolean };
}

/** Amendment A7: one published criterion value and the OEM-published conditions under which it applies. */
export interface CriterionCandidate {
  candidateId: string;
  range: OemRange;
  appliesWhen: ApplicabilityCondition[];
  /** A8 (R5-12): metering devices the candidate applies to. */
  meteringTypes?: MeteringType[];
}

export interface ApplicabilityCondition {
  measurement: MeasurementKey;
  min: number | null;
  max: number | null;
  unit: Unit;
  ref: string;
  unbounded?: "MIN" | "MAX";
}

export interface MeasurementAuthority {
  authorityClass: "A" | "B" | "C";
  locationBasis: "OEM" | "GOVERNED_METHOD" | "UNESTABLISHED";
  location: string;
  oemLocation: string | null;
  methodId: string | null;
}

export interface AirflowEvidence {
  path: "OEM_ACCEPTANCE_CRITERION" | "OEM_PUBLISHED_OPERATING_POINT" | null;
  blowerSetting: string | null;
  designatedSetting: string | null;
  operatingPoint: { tesp: number; uncertainty: number } | null;
  bracket: { espLow: number; espHigh: number; cfmMin: number; cfmMax: number } | null;
  convention: string | null;
  ref: string | null;
}

export interface CriterionSelection {
  status: "SELECTED" | "NONE_APPLICABLE" | "AMBIGUOUS" | "CONFLICT" | "NOT_REPRESENTABLE" | "NOT_EVALUATED" | "NOT_PUBLISHED";
  candidateId: string | null;
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
  /** null bound = OEM-stated unbounded side. */
  range: { min: number | null; max: number | null; unit: Unit; ref: string; derivation?: RangeDerivation };
  classification: "WITHIN" | "OUTSIDE" | "AMBIGUOUS";
}

export interface GateAEvaluation {
  /** Pressure-instrument entry authorized: both parts must be ALLOW (A6). */
  determination: Determination;
  /** A6: the technical NIRET question only. */
  technicalDetermination: Determination;
  /** A6: authority to execute the pressure-instrument entry (P17, ENTRY). */
  executionAuthorityDetermination: Determination;
  checks: PropositionCheck[];
  indicationPath: "I1" | "I3" | null;
  ambiguityFindings: IntervalFinding[];
  derivedTesp: { value: number; uncertainty: number; unit: Unit } | null;
  /** A7: which OEM criterion candidate (if any) the indication was evaluated against. */
  criterionSelection: CriterionSelection;
  /** A9: location authority applied to each measurement used. */
  measurementAuthority: Partial<Record<MeasurementKey, MeasurementAuthority>>;
  /** A9: how P08 airflow was established (or why not). */
  airflowEvidence: AirflowEvidence;
  window: { effectiveRunStart: string | null; windowStart: string | null; windowEnd: string };
  runRestarted: boolean;
}
