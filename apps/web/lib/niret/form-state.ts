/**
 * NIRET Gate A technician form state.
 *
 * This is raw technician entry (strings and tri-state choices). It carries no
 * decision rules. The evidence adapter translates it into the frozen
 * TA-14-NIRET-GA-C1 input contract; only the server-side engine decides.
 */

import type { MeasurementKey, StateEventType } from "../../../../packages/domain/niret/types";

export type TriState = "" | "YES" | "NO";

export type InstrumentKind = "TEMPERATURE" | "HUMIDITY" | "AIR_PRESSURE" | "AIRFLOW" | "VOLTAGE" | "CURRENT";

export interface InstrumentRow {
  id: string;
  kind: InstrumentKind;
  /** Stated accuracy, in the unit of the instrument kind. */
  accuracy: string;
  calibrationValid: boolean;
  setupVerified: boolean;
}

export interface PressureInstrumentRow {
  id: string;
  /** Comma-separated refrigerant designations from the instrument's rating. */
  ratedFor: string;
  calibrationValid: boolean;
}

export interface MeasurementEntry {
  value: string;
  instrumentId: string;
  location: string;
  measuredAt: string;
  /** A9: technician affirms the TA-14 governed measurement method was followed (used only where the OEM prescribes no location). */
  governedMethod?: boolean;
}

/** Air-side static is entered as magnitude plus direction; the adapter signs it. */
export type StaticDirection = "" | "BELOW_AMBIENT" | "ABOVE_AMBIENT";

export interface RangeEntry {
  min: string;
  max: string;
  /** Chart/table/page reference for this value; defaults to the OEM source reference. */
  ref: string;
}

export interface CorrectionEntry {
  at: string;
  declaredFinding: string;
  authorityRef: string;
  beforeRecordRef: string;
  correctionDescription: string;
  afterRecordRef: string;
  rebaselinedAt: string;
}

export interface EventEntry {
  type: StateEventType;
  at: string;
  affectsIdentity: boolean;
  /** A8 (I3 event anchor): the repair affected the refrigerant circuit. */
  affectsRefrigerantCircuit?: boolean;
}

/**
 * How the technician supplied the credential (Amendment A4). Never verification:
 * VERIFIED can only come from an independent server-side source.
 */
export type CertificationAssurance = "DECLARED" | "DOCUMENTED";

export interface NiretFormState {
  job: {
    technicianId: string;
    certificationStatus: "" | "CERTIFIED" | "SUPERVISED_APPRENTICE" | "NOT_CERTIFIED";
    certificationType: "" | "TYPE_I" | "TYPE_II" | "TYPE_III" | "UNIVERSAL";
    certificateRef: string;
    certificationAssurance: CertificationAssurance;
    workScopeRef: string;
    workScopeIncludesDiagnosis: TriState;
    sitePermission: "" | "GRANTED" | "WITHHELD" | "UNCONFIRMED";
    jurisdiction: "" | "NOT_REQUIRED" | "CONFIRMED" | "UNCONFIRMED";
    hazard: "" | "NONE_IDENTIFIED" | "CORRECTABLE_HAZARD" | "BEYOND_COMPETENCE";
    statedProposition: string;
    statedBasis: string[];
  };
  equipment: {
    /** Nameplate manufacturer (A7: matched exactly against the governed OEM record). */
    manufacturer: string;
    indoorModel: string;
    outdoorModel: string;
    pairingVerified: TriState;
    identityEstablishableFromOem: TriState;
    configuration: "" | "DUCTED_SPLIT" | "DUCTLESS" | "MINI_SPLIT" | "MULTI_SPLIT" | "PACKAGED" | "UNKNOWN";
    compressorStaging: "" | "SINGLE_STAGE" | "TWO_STAGE" | "INVERTER" | "UNKNOWN";
    mode: "" | "COOLING" | "HEATING" | "UNKNOWN";
    verifiedAt: string;
    /** Technician context only (CFM/ton display); never sent to Gate A. */
    nominalCapacityBtuh: string;
  };
  refrigerant: {
    declared: string;
    safetyClass: "" | "A1" | "A2L" | "A2" | "A3" | "B1" | "B2L" | "B2" | "B3" | "UNKNOWN";
    a2lMarkingsObserved: boolean;
    flammableLabelsObserved: boolean;
    integritySuspect: boolean;
  };
  metering: {
    type: "" | "FIXED_ORIFICE" | "CAPILLARY_TUBE" | "TXV" | "EEV" | "UNKNOWN";
    evidenceBasis: "" | "DIRECT_OBSERVATION" | "CONFIGURATION_DOCUMENT" | "INFERRED_FROM_PRESSURE" | "NONE";
    establishableFromOem: TriState;
    verifiedAt: string;
  };
  oem: {
    manufacturer: string;
    model: string;
    document: string;
    /** Revision or publication identifier/date, where available. */
    revision: string;
    section: string;
    /** Source URL, file, or library reference the technician used. */
    sourceRef: string;
    chargingMethodStatus: "" | "IDENTIFIED" | "NOT_OBTAINED";
    chargingMethodRef: string;
    chargingMethodObtainable: TriState;
    requiresUnavailableToolOrMode: boolean;
    airflow: RangeEntry;
    esp: RangeEntry;
    ambient: RangeEntry;
    voltage: RangeEntry;
    minRunMinutes: string;
    minRunRef: string;
    stabilityMeasurement: "" | MeasurementKey;
    stabilityMaxChange: string;
    stabilityRef: string;
    permitsEcmWithTableMethod: TriState;
    locations: Partial<Record<MeasurementKey, string>>;
    criterionStatus: "" | "PUBLISHED" | "NOT_OBTAINED";
    criterionDerivation: "" | "RETURN_MINUS_SUPPLY_DRY_BULB" | "RETURN_MINUS_SUPPLY_WET_BULB" | "SINGLE_MEASUREMENT";
    criterionMeasurement: "" | MeasurementKey;
    criterion: RangeEntry;
    criterionObtainable: TriState;
  };
  operation: {
    runStartedAt: string;
    compressorRunningSteadily: TriState;
  };
  events: EventEntry[];
  corrections: CorrectionEntry[];
  evaporator: {
    iceStatus: "" | "NO_ICE" | "ICE_PRESENT" | "UNDETERMINED";
    iceObservedAt: string;
    icingOccurred: boolean;
    restoration: {
      iceCompletelyRemoved: boolean;
      causeInvestigated: boolean;
      causeDisposition: "" | "CORRECTED" | "BOUNDED" | "UNRESOLVED";
      airflowAndHeatTransferReestablished: boolean;
      returnedToOperatingEnvelope: boolean;
      steadyStateReestablished: boolean;
      freshMeasurementSetObtained: boolean;
      completedAt: string;
    };
  };
  condenser: {
    panelsInPlace: TriState;
    coilCondition: "" | "CLEAR" | "PARTIAL_OBSTRUCTION" | "MATERIALLY_RESTRICTED" | "UNDETERMINED";
    fanOperating: TriState;
    observedAt: string;
  };
  airflowMethod: {
    method: "" | "OEM_SPECIFIED_METHOD" | "OEM_CFM_ESP_TABLE" | "DUCT_TRAVERSE" | "FLOW_GRID" | "PRESSURE_MATCHING" | "TEMPERATURE_RISE";
    motorType: "" | "PSC" | "ECM" | "OTHER" | "UNKNOWN";
    componentsClean: TriState;
    /** A9: installed indoor blower setting exactly as the OEM labels it. */
    blowerSetting?: string;
  };
  measurements: Partial<Record<MeasurementKey, MeasurementEntry>>;
  staticDirection: { returnStatic: StaticDirection; supplyStatic: StaticDirection };
  stabilityReadings: MeasurementEntry[];
  instruments: InstrumentRow[];
  pressureInstruments: PressureInstrumentRow[];
  pressureSideEntry: "NOT_PERFORMED" | "PROPOSED_OUTSIDE_GATE_A" | "ATTEMPTED" | "INSTRUMENTS_CONNECTED";
  observations: {
    filterCondition: string;
    blowerOperatingEvidence: string;
    compressorOperatingEvidence: string;
    leakIndications: string;
  };
}

const emptyRange = (): RangeEntry => ({ min: "", max: "", ref: "" });

/** A new job starts empty: no OEM value, target, or measurement is pre-filled. */
export function emptyNiretForm(): NiretFormState {
  return {
    job: {
      technicianId: "", certificationStatus: "", certificationType: "", certificateRef: "",
      certificationAssurance: "DECLARED", workScopeRef: "", workScopeIncludesDiagnosis: "",
      sitePermission: "", jurisdiction: "", hazard: "", statedProposition: "", statedBasis: [],
    },
    equipment: {
      manufacturer: "", indoorModel: "", outdoorModel: "", pairingVerified: "", identityEstablishableFromOem: "",
      configuration: "", compressorStaging: "", mode: "", verifiedAt: "", nominalCapacityBtuh: "",
    },
    refrigerant: { declared: "", safetyClass: "", a2lMarkingsObserved: false, flammableLabelsObserved: false, integritySuspect: false },
    metering: { type: "", evidenceBasis: "", establishableFromOem: "", verifiedAt: "" },
    oem: {
      manufacturer: "", model: "", document: "", revision: "", section: "", sourceRef: "",
      chargingMethodStatus: "", chargingMethodRef: "", chargingMethodObtainable: "",
      requiresUnavailableToolOrMode: false,
      airflow: emptyRange(), esp: emptyRange(), ambient: emptyRange(), voltage: emptyRange(),
      minRunMinutes: "", minRunRef: "",
      stabilityMeasurement: "", stabilityMaxChange: "", stabilityRef: "",
      permitsEcmWithTableMethod: "", locations: {},
      criterionStatus: "", criterionDerivation: "", criterionMeasurement: "", criterion: emptyRange(), criterionObtainable: "",
    },
    operation: { runStartedAt: "", compressorRunningSteadily: "" },
    events: [],
    corrections: [],
    evaporator: {
      iceStatus: "", iceObservedAt: "", icingOccurred: false,
      restoration: {
        iceCompletelyRemoved: false, causeInvestigated: false, causeDisposition: "",
        airflowAndHeatTransferReestablished: false, returnedToOperatingEnvelope: false,
        steadyStateReestablished: false, freshMeasurementSetObtained: false, completedAt: "",
      },
    },
    condenser: { panelsInPlace: "", coilCondition: "", fanOperating: "", observedAt: "" },
    airflowMethod: { method: "", motorType: "", componentsClean: "" },
    measurements: {},
    staticDirection: { returnStatic: "", supplyStatic: "" },
    stabilityReadings: [],
    instruments: [],
    pressureInstruments: [],
    pressureSideEntry: "NOT_PERFORMED",
    observations: { filterCondition: "", blowerOperatingEvidence: "", compressorOperatingEvidence: "", leakIndications: "" },
  };
}
