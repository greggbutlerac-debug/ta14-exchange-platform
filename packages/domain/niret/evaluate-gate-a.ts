/**
 * Pipeline stages: PROPOSITION EVALUATION -> NIRET DETERMINATION.
 *
 * Implements the frozen TA-14-NIRET-GA-C1 rules exactly. No OEM value, target,
 * run time or threshold is defined here: every range and duration comes from
 * the OEM reference input. Anything not established fails closed.
 *
 * Gate A ALLOW authorizes acquisition of pressure evidence only. Nothing in
 * this module can produce refrigerant-mass (Gate B) authority.
 */

import { deriveDecision, type RequirementResult } from "../state-machine";
import { classifyInterval, worstCaseUncertainty } from "./interval";
import { invalidatedBy } from "./invalidation";
import {
  APPENDIX_W_A2L_REFRIGERANTS,
  GATE_A_VERSION,
  PROHIBITED_BASES,
  REQUIRED_PROPOSITIONS,
  type PropositionId,
} from "./propositions";
import type {
  CheckResult,
  GateAEvaluation,
  GateAInput,
  IntervalFinding,
  Measurement,
  MeasurementKey,
  OemRange,
  PropositionCheck,
  Unit,
} from "./types";
import type { ValidationOutcome } from "./validate";

const EXPECTED_UNIT: Readonly<Record<MeasurementKey, Unit>> = {
  returnDryBulb: "F", returnWetBulb: "F", returnRh: "PCT_RH",
  supplyDryBulb: "F", supplyWetBulb: "F", supplyRh: "PCT_RH",
  outdoorDryBulb: "F", outdoorWetBulb: "F", outdoorRh: "PCT_RH",
  airflow: "CFM", returnStatic: "IN_WC", supplyStatic: "IN_WC",
  suctionLineTemp: "F", liquidLineTemp: "F",
  supplyVoltage: "V", compressorCurrent: "A", blowerCurrent: "A",
};

/** Measurements whose location must be the OEM-specified location (spec "measurement"). */
const OEM_LOCATION_REQUIRED = new Set<MeasurementKey>([
  "returnDryBulb", "returnWetBulb", "returnRh", "supplyDryBulb", "supplyWetBulb", "supplyRh",
  "outdoorDryBulb", "outdoorWetBulb", "outdoorRh", "returnStatic", "supplyStatic",
  "suctionLineTemp", "liquidLineTemp",
]);

const ACCEPTED_CERTIFICATIONS = new Set(["TYPE_II", "UNIVERSAL"]);
const PROHIBITED = new Set<string>(PROHIBITED_BASES);

function normalizeRefrigerant(designation: string): string {
  return designation.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
const A2L_DESIGNATIONS = new Set(APPENDIX_W_A2L_REFRIGERANTS.map(normalizeRefrigerant));

const ms = (stamp: string): number => Date.parse(stamp);
const iso = (value: number): string => new Date(value).toISOString();

class Checks {
  readonly items: PropositionCheck[] = [];
  add(proposition: PropositionId, result: CheckResult, reason: string, evidenceKeys: string[] = []): void {
    this.items.push({ proposition, result, reason, evidenceKeys });
  }
  /** Record SATISFIED when the proposition has no failing check yet. */
  settle(proposition: PropositionId, reason: string, evidenceKeys: string[] = []): void {
    if (!this.items.some((c) => c.proposition === proposition && c.result !== "SATISFIED")) {
      this.add(proposition, "SATISFIED", reason, evidenceKeys);
    }
  }
  failing(proposition?: PropositionId): boolean {
    return this.items.some((c) => c.result !== "SATISFIED" && (proposition === undefined || c.proposition === proposition));
  }
}

function toRequirementResults(checks: PropositionCheck[]): RequirementResult[] {
  return checks.map((check) => ({
    requirementId: `${check.proposition}:${check.reason}`,
    requirementVersion: GATE_A_VERSION,
    result: check.result,
    reason: check.reason,
    evidenceIds: check.evidenceKeys,
  }));
}

export function evaluateGateA(raw: unknown, validation: ValidationOutcome): GateAEvaluation {
  const checks = new Checks();
  const findings: IntervalFinding[] = [];
  let derivedTesp: GateAEvaluation["derivedTesp"] = null;
  let indicationPath: GateAEvaluation["indicationPath"] = null;

  // ENTRY — Amendment A1: premature pressure-instrument entry.
  if (validation.prematureEntry.length > 0) {
    checks.add("ENTRY", "DENY", "PRESSURE_INSTRUMENT_ENTRY_NOT_AUTHORIZED", validation.prematureEntry);
  }

  const evaluatedAtRaw = (raw as { request?: { evaluatedAt?: unknown } } | null)?.request?.evaluatedAt;
  const windowEnd = typeof evaluatedAtRaw === "string" && !Number.isNaN(ms(evaluatedAtRaw)) ? evaluatedAtRaw : "UNESTABLISHED";

  // INPUT — structural validation; unknown or invalid input fails closed.
  if (!validation.valid) {
    for (const field of validation.unknownFields) checks.add("INPUT", "HOLD", "INPUT_UNKNOWN_FIELD", [field]);
    for (const field of validation.invalidFields) checks.add("INPUT", "HOLD", "INPUT_INVALID", [field]);
    return finalize(checks, findings, null, null, { effectiveRunStart: null, windowStart: null, windowEnd }, false);
  }
  checks.add("INPUT", "SATISFIED", "INPUT_VALID");
  checks.settle("ENTRY", "NO_PRESSURE_SIDE_ENTRY");

  const { request, evidence, oem } = raw as GateAInput;
  const evaluatedAt = ms(request.evaluatedAt);

  // SCOPE — bounded use case; out-of-scope conditions escalate, unknowns hold.
  if (request.question !== "REFRIGERANT_CHARGE") checks.add("SCOPE", "ESCALATE", "OUT_OF_SCOPE_QUESTION");
  if (evidence.mode === "HEATING") checks.add("SCOPE", "ESCALATE", "OUT_OF_SCOPE_MODE");
  if (evidence.mode === "UNKNOWN") checks.add("SCOPE", "HOLD", "MODE_UNESTABLISHED");
  if (evidence.equipment.configuration === "UNKNOWN") checks.add("SCOPE", "HOLD", "EQUIPMENT_CONFIGURATION_UNESTABLISHED");
  else if (evidence.equipment.configuration !== "DUCTED_SPLIT") checks.add("SCOPE", "ESCALATE", "OUT_OF_SCOPE_EQUIPMENT");
  if (evidence.equipment.compressorStaging === "INVERTER") checks.add("SCOPE", "ESCALATE", "OUT_OF_SCOPE_INVERTER");
  if (evidence.equipment.compressorStaging === "UNKNOWN") checks.add("SCOPE", "HOLD", "COMPRESSOR_STAGING_UNESTABLISHED");
  if (evidence.metering.type === "EEV") checks.add("SCOPE", "ESCALATE", "OUT_OF_SCOPE_METERING");
  const refrigerant = evidence.refrigerant;
  const declaredIsA2l = refrigerant.declared !== undefined && A2L_DESIGNATIONS.has(normalizeRefrigerant(refrigerant.declared));
  if (refrigerant.safetyClass === "A2L" || declaredIsA2l || refrigerant.a2lMarkingsObserved || refrigerant.flammableRefrigerantLabelsObserved) {
    checks.add("SCOPE", "ESCALATE", "OUT_OF_SCOPE_A2L");
  } else if (refrigerant.safetyClass !== undefined && refrigerant.safetyClass !== "A1" && refrigerant.safetyClass !== "UNKNOWN") {
    // "Non-A2L" is ambiguous for other safety classes; F1 requires failing closed.
    checks.add("SCOPE", "ESCALATE", "OUT_OF_SCOPE_REFRIGERANT_CLASS");
  }
  checks.settle("SCOPE", "WITHIN_BOUNDED_SCOPE");

  const repairsAffecting = (marker: string) =>
    evidence.events.filter((event) => event.affectsIdentity === true && invalidatedBy(event.type).includes(marker));
  const identityRepairs = repairsAffecting("P01_IF_AFFECTED");
  const meteringRepairs = repairsAffecting("P03_IF_AFFECTED");

  // P01 — equipment identity and pairing.
  const equipment = evidence.equipment;
  if (!equipment.indoorModel || !equipment.outdoorModel || equipment.pairingVerifiedAgainstOem !== true) {
    checks.add("P01", equipment.identityEstablishableFromOem === false ? "ESCALATE" : "HOLD",
      equipment.identityEstablishableFromOem === false ? "IDENTITY_UNESTABLISHABLE" : "IDENTITY_OR_PAIRING_UNESTABLISHED");
  } else if (identityRepairs.some((event) => !equipment.verifiedAt || ms(equipment.verifiedAt) < ms(event.at))) {
    checks.add("P01", "HOLD", "IDENTITY_REVERIFICATION_REQUIRED_AFTER_REPAIR");
  }
  checks.settle("P01", "IDENTITY_AND_PAIRING_ESTABLISHED");

  // P02 — refrigerant identity (non-A2L declared) and rated pressure instruments.
  if (refrigerant.integritySuspect) checks.add("P02", "ESCALATE", "REFRIGERANT_INTEGRITY_SUSPECT");
  if (!refrigerant.declared) checks.add("P02", "HOLD", "REFRIGERANT_UNDECLARED");
  if (refrigerant.safetyClass === undefined || refrigerant.safetyClass === "UNKNOWN") checks.add("P02", "HOLD", "REFRIGERANT_SAFETY_CLASS_UNESTABLISHED");
  if (evidence.plannedPressureInstruments.length === 0) checks.add("P02", "HOLD", "PRESSURE_INSTRUMENT_UNSPECIFIED");
  for (const instrument of evidence.plannedPressureInstruments) {
    const rated = refrigerant.declared !== undefined && instrument.ratedForRefrigerants
      .some((designation) => normalizeRefrigerant(designation) === normalizeRefrigerant(refrigerant.declared as string));
    if (!rated) checks.add("P02", "HOLD", "INSTRUMENT_NOT_RATED_FOR_REFRIGERANT", [instrument.instrumentId]);
    if (!instrument.calibrationValid) checks.add("P02", "HOLD", "PRESSURE_INSTRUMENT_CALIBRATION_INVALID", [instrument.instrumentId]);
  }
  checks.settle("P02", "REFRIGERANT_DECLARED_NON_A2L_INSTRUMENTS_RATED");

  // P03 — metering device from direct evidence, never inferred from pressure.
  const metering = evidence.metering;
  if (metering.evidenceBasis === "INFERRED_FROM_PRESSURE") {
    checks.add("P03", "HOLD", "METERING_INFERRED_FROM_PRESSURE_REJECTED");
  } else if (metering.type === "UNKNOWN" || metering.evidenceBasis === "NONE") {
    checks.add("P03", metering.establishableFromOem === false ? "ESCALATE" : "HOLD",
      metering.establishableFromOem === false ? "METERING_UNESTABLISHABLE" : "METERING_UNESTABLISHED");
  } else if (meteringRepairs.some((event) => !metering.verifiedAt || ms(metering.verifiedAt) < ms(event.at))) {
    checks.add("P03", "HOLD", "METERING_REVERIFICATION_REQUIRED_AFTER_REPAIR");
  }
  if (metering.type !== "EEV") checks.settle("P03", "METERING_DEVICE_ESTABLISHED");

  // P16 — safety.
  const hazard = evidence.safety.hazard;
  if (hazard === "BEYOND_COMPETENCE") checks.add("P16", "ESCALATE", "HAZARD_BEYOND_COMPETENCE");
  else if (hazard === "CORRECTABLE_HAZARD") checks.add("P16", "HOLD", "CORRECTABLE_HAZARD_UNRESOLVED");
  else if (hazard !== "NONE_IDENTIFIED") checks.add("P16", "HOLD", "SAFETY_UNESTABLISHED");
  checks.settle("P16", "NO_HAZARD_IDENTIFIED");

  // P17 — authority to test.
  const certification = evidence.technician.certification;
  if (!certification) checks.add("P17", "HOLD", "CERTIFICATION_DOCUMENTATION_MISSING");
  else if (certification.status === "NOT_CERTIFIED") checks.add("P17", "ESCALATE", "TECHNICIAN_NOT_CERTIFIED");
  else if (certification.status === "CERTIFIED" && !ACCEPTED_CERTIFICATIONS.has(certification.type)) checks.add("P17", "ESCALATE", "CERTIFICATION_TYPE_NOT_APPLICABLE");
  else if (certification.status === "SUPERVISED_APPRENTICE" && !ACCEPTED_CERTIFICATIONS.has(certification.supervisorType)) checks.add("P17", "ESCALATE", "SUPERVISOR_CERTIFICATION_TYPE_NOT_APPLICABLE");
  const authorization = evidence.authorization;
  if (authorization.workScopeIncludesDiagnosis === false) checks.add("P17", "ESCALATE", "WORK_SCOPE_EXCLUDES_DIAGNOSIS");
  else if (authorization.workScopeIncludesDiagnosis !== true || !authorization.workScopeRef) checks.add("P17", "HOLD", "WORK_SCOPE_DOCUMENTATION_MISSING");
  if (authorization.sitePermission === "WITHHELD") checks.add("P17", "DENY", "AUTHORITY_TO_TEST_WITHHELD");
  else if (authorization.sitePermission !== "GRANTED") checks.add("P17", "HOLD", "SITE_PERMISSION_UNCONFIRMED");
  if (authorization.jurisdiction !== "NOT_REQUIRED" && authorization.jurisdiction !== "CONFIRMED") checks.add("P17", "HOLD", "JURISDICTIONAL_AUTHORIZATION_UNCONFIRMED");
  checks.settle("P17", "AUTHORITY_TO_TEST_ESTABLISHED");

  // P14 — OEM charging method.
  if (oem.chargingMethod.status === "NOT_OBTAINED") {
    checks.add("P14", oem.chargingMethod.obtainable ? "HOLD" : "ESCALATE",
      oem.chargingMethod.obtainable ? "OEM_CHARGING_METHOD_PENDING" : "OEM_CHARGING_METHOD_UNAVAILABLE");
  }
  if (oem.requiresUnavailableToolOrMode) checks.add("P14", "ESCALATE", "OEM_PROCEDURE_REQUIRES_UNAVAILABLE_TOOL_OR_MODE");
  checks.settle("P14", "OEM_CHARGING_METHOD_IDENTIFIED");

  // P04 — steady state: OEM minimum run after the latest state change.
  const resetTimes = [
    ...evidence.events.map((event) => ms(event.at)),
    ...evidence.corrections.map((correction) => ms(correction.at)),
  ];
  const runRestarted = resetTimes.length > 0;
  let effectiveRunStart: number | null = null;
  let windowStart: number | null = null;
  if (!evidence.operation.runStartedAt) {
    checks.add("P04", "HOLD", "RUN_START_UNRECORDED");
  } else {
    effectiveRunStart = Math.max(ms(evidence.operation.runStartedAt), ...resetTimes);
    if (!oem.minRunMinutes) {
      checks.add("P04", "HOLD", "STABILIZATION_AUTHORITY_UNAVAILABLE");
    } else {
      windowStart = effectiveRunStart + oem.minRunMinutes.value * 60_000;
      if (windowStart > evaluatedAt) checks.add("P04", "HOLD", "OEM_MINIMUM_RUN_INCOMPLETE");
    }
  }
  if (evidence.operation.compressorRunningSteadily !== true) checks.add("P04", "HOLD", "COMPRESSOR_NOT_ESTABLISHED_RUNNING_STEADILY");

  /** Establish one measurement for use; failures are attributed to the responsible proposition. */
  const use = (key: MeasurementKey, owner: PropositionId): Measurement | null => {
    const measurement = evidence.measurements[key];
    if (!measurement) {
      checks.add(owner, "HOLD", `${key.toUpperCase()}_UNAVAILABLE`, [key]);
      return null;
    }
    let usable = true;
    if (measurement.unit !== EXPECTED_UNIT[key]) { checks.add(owner, "HOLD", "UNIT_MISMATCH", [key]); usable = false; }
    if (measurement.accuracy === undefined) { checks.add(owner, "HOLD", "INSTRUMENT_ACCURACY_UNRECORDED", [key]); usable = false; }
    const instrument = evidence.instruments.find((item) => item.instrumentId === measurement.instrumentId);
    if (!instrument) { checks.add("P05", "HOLD", "INSTRUMENT_UNREGISTERED", [key]); usable = false; }
    else if (!instrument.calibrationValid || !instrument.setupVerified) { checks.add("P05", "HOLD", "INSTRUMENT_INVALID", [key]); usable = false; }
    if (OEM_LOCATION_REQUIRED.has(key)) {
      const oemLocation = oem.measurementLocations[key];
      if (!oemLocation) { checks.add(owner, "HOLD", "OEM_LOCATION_AUTHORITY_UNAVAILABLE", [key]); usable = false; }
      else if (oemLocation !== measurement.location) { checks.add(owner, "HOLD", "MEASUREMENT_LOCATION_NOT_OEM_LOCATION", [key]); usable = false; }
    }
    if (windowStart === null) { checks.add("P13", "HOLD", "STEADY_STATE_WINDOW_UNESTABLISHED", [key]); usable = false; }
    else if (ms(measurement.measuredAt) < windowStart) { checks.add("P13", "HOLD", "MEASUREMENT_OUTSIDE_QUALIFYING_WINDOW", [key]); usable = false; }
    return usable ? measurement : null;
  };

  const compare = (
    subject: string, owner: PropositionId, value: number, uncertainty: number, range: OemRange, unit: Unit,
    reasons: { outside: string; ambiguous: string },
  ): "WITHIN" | "OUTSIDE" | "AMBIGUOUS" | null => {
    if (range.unit !== unit) { checks.add(owner, "HOLD", "UNIT_MISMATCH", [subject]); return null; }
    const classification = classifyInterval(value, uncertainty, range);
    findings.push({ subject, value, uncertainty, range: { min: range.min, max: range.max, unit: range.unit, ref: range.ref }, classification });
    if (classification === "OUTSIDE" && reasons.outside) checks.add(owner, "HOLD", reasons.outside, [subject]);
    if (classification === "AMBIGUOUS" && reasons.ambiguous) checks.add(owner, "HOLD", reasons.ambiguous, [subject]);
    return classification;
  };

  // C06 — OEM measured-stability criterion (only where the OEM specifies one).
  if (oem.stabilityCriterion) {
    const criterion = oem.stabilityCriterion;
    const readings = (evidence.stabilityReadings ?? []).filter((reading) => ms(reading.measuredAt) >= (windowStart ?? Infinity));
    const series = readings.filter((reading) =>
      reading.unit === criterion.unit && reading.accuracy !== undefined &&
      evidence.instruments.some((item) => item.instrumentId === reading.instrumentId && item.calibrationValid && item.setupVerified));
    if (series.length < 2 || series.length !== readings.length) {
      checks.add("P04", "HOLD", "OEM_STABILITY_CRITERION_UNESTABLISHED", [criterion.measurement]);
    } else {
      const high = series.reduce((a, b) => (b.value > a.value ? b : a));
      const low = series.reduce((a, b) => (b.value < a.value ? b : a));
      compare(`stability:${criterion.measurement}`, "P04", high.value - low.value,
        worstCaseUncertainty([high.accuracy as number, low.accuracy as number]),
        { min: 0, max: criterion.maxChange, unit: criterion.unit, ref: criterion.ref }, criterion.unit,
        { outside: "OEM_STABILITY_CRITERION_NOT_MET", ambiguous: "OEM_STABILITY_AMBIGUOUS" });
    }
  }

  // C03 — voltage, where the OEM operating envelope specifies it.
  if (oem.voltageRange) {
    const voltage = use("supplyVoltage", "P04");
    if (voltage) compare("supplyVoltage", "P04", voltage.value, voltage.accuracy as number, oem.voltageRange, voltage.unit,
      { outside: "VOLTAGE_OUTSIDE_OEM_RANGE", ambiguous: "VOLTAGE_AMBIGUOUS" });
  }
  checks.settle("P04", "OEM_MINIMUM_RUN_COMPLETE_AT_STEADY_STATE");

  // P06 — TA-14 policy: evaporator free of ice; complete restoration after any icing.
  const evaporator = evidence.evaporator;
  const icingEvents = evidence.events.filter((event) => event.type === "FREEZE_SWITCH_TRIP_OR_ICING");
  if (evaporator.iceStatus === "ICE_PRESENT") checks.add("P06", "HOLD", "TA14_ICE_POLICY_ICE_PRESENT");
  else if (evaporator.iceStatus !== "NO_ICE") checks.add("P06", "HOLD", "EVAPORATOR_ICE_STATUS_UNESTABLISHED");
  else if (!evaporator.iceObservedAt || windowStart === null || ms(evaporator.iceObservedAt) < windowStart) {
    checks.add("P06", "HOLD", "NO_ICE_NOT_OBSERVED_IN_QUALIFYING_WINDOW");
  }
  if (evaporator.icingOccurred === true || icingEvents.length > 0) {
    const restoration = evaporator.iceRestoration;
    const lastIcing = Math.max(-Infinity, ...icingEvents.map((event) => ms(event.at)));
    const complete = restoration !== undefined &&
      restoration.iceCompletelyRemoved && restoration.causeInvestigated &&
      (restoration.causeDisposition === "CORRECTED" || restoration.causeDisposition === "BOUNDED") &&
      restoration.airflowAndHeatTransferReestablished && restoration.returnedToOperatingEnvelope &&
      restoration.steadyStateReestablished && restoration.freshMeasurementSetObtained &&
      ms(restoration.completedAt) >= lastIcing;
    if (!complete) checks.add("P06", "HOLD", "TA14_ICE_RESTORATION_INCOMPLETE");
  }
  checks.settle("P06", "EVAPORATOR_FREE_OF_ICE_IN_QUALIFYING_WINDOW");

  // P07 — pre-Gate-A corrections recorded and re-baselined.
  for (const correction of evidence.corrections) {
    const complete = [correction.declaredFinding, correction.authorityRef, correction.beforeRecordRef,
      correction.correctionDescription, correction.afterRecordRef].every((field) => field.trim().length > 0);
    if (!complete) checks.add("P07", "HOLD", "CORRECTION_RECORD_INCOMPLETE", [correction.at]);
    if (!correction.rebaselinedAt || ms(correction.rebaselinedAt) < ms(correction.at)) {
      checks.add("P07", "HOLD", "CORRECTION_NOT_REBASELINED", [correction.at]);
    }
  }
  checks.settle("P07", evidence.corrections.length ? "CORRECTIONS_RECORDED_AND_REBASELINED" : "NO_PRE_GATE_CORRECTIONS");

  // P08 — airflow within OEM range by an acceptable method.
  const method = evidence.airflowMethod;
  if (!method) checks.add("P08", "HOLD", "AIRFLOW_METHOD_UNRECORDED");
  else if (method.method === "TEMPERATURE_RISE") checks.add("P08", "HOLD", "AIRFLOW_METHOD_NOT_ACCEPTABLE_FOR_COOLING");
  else if (method.method === "OEM_CFM_ESP_TABLE") {
    if (method.motorType === "UNKNOWN") checks.add("P08", "HOLD", "BLOWER_MOTOR_TYPE_UNESTABLISHED");
    if (method.motorType === "ECM" && oem.permitsEcmWithTableMethod !== true) checks.add("P08", "HOLD", "OEM_TABLE_METHOD_NOT_PERMITTED_FOR_ECM");
    if (method.componentsClean !== true) checks.add("P08", "HOLD", "COMPONENTS_NOT_ESTABLISHED_CLEAN_FOR_TABLE_METHOD");
  }
  const airflow = use("airflow", "P08");
  if (!oem.airflowRange) checks.add("P08", "HOLD", "OEM_AIRFLOW_RANGE_UNAVAILABLE");
  else if (airflow) compare("airflow", "P08", airflow.value, airflow.accuracy as number, oem.airflowRange, airflow.unit,
    { outside: "AIRFLOW_OUTSIDE_OEM_RANGE", ambiguous: "AIRFLOW_AMBIGUOUS" });
  checks.settle("P08", "AIRFLOW_WITHIN_OEM_RANGE");

  // P09 — TESP derived from raw supply and return static (Amendment A3).
  const returnStatic = use("returnStatic", "P09");
  const supplyStatic = use("supplyStatic", "P09");
  if (returnStatic && supplyStatic) {
    derivedTesp = {
      value: supplyStatic.value - returnStatic.value,
      uncertainty: worstCaseUncertainty([supplyStatic.accuracy as number, returnStatic.accuracy as number]),
      unit: "IN_WC",
    };
    if (!oem.espRange) checks.add("P09", "HOLD", "OEM_ESP_RANGE_UNAVAILABLE");
    else compare("derivedTesp", "P09", derivedTesp.value, derivedTesp.uncertainty, oem.espRange, "IN_WC",
      { outside: "ESP_OUTSIDE_OEM_RANGE", ambiguous: "ESP_AMBIGUOUS" });
  } else if (!oem.espRange) {
    checks.add("P09", "HOLD", "OEM_ESP_RANGE_UNAVAILABLE");
  }
  checks.settle("P09", "EXTERNAL_STATIC_PRESSURE_WITHIN_OEM_RANGE");

  // P10 — heat rejection: only CLEAR, panels in place, fan operating, observed after the latest state change.
  const condenser = evidence.condenser;
  if (condenser.panelsInPlace !== true) checks.add("P10", "HOLD", "PANELS_NOT_ESTABLISHED_IN_PLACE");
  if (condenser.fanOperating !== true) checks.add("P10", "HOLD", "CONDENSER_FAN_NOT_ESTABLISHED_OPERATING");
  if (condenser.coilCondition !== "CLEAR") checks.add("P10", "HOLD", "CONDENSER_COIL_NOT_ESTABLISHED_CLEAR");
  if (!condenser.observedAt || effectiveRunStart === null || ms(condenser.observedAt) < effectiveRunStart) {
    checks.add("P10", "HOLD", "CONDENSER_OBSERVATION_NOT_CURRENT");
  }
  checks.settle("P10", "HEAT_REJECTION_VALID");

  // P11 — ambient within the OEM envelope.
  const outdoor = use("outdoorDryBulb", "P11");
  if (!oem.ambientEnvelope) checks.add("P11", "HOLD", "OEM_AMBIENT_ENVELOPE_UNAVAILABLE");
  else if (outdoor) compare("outdoorDryBulb", "P11", outdoor.value, outdoor.accuracy as number, oem.ambientEnvelope, outdoor.unit,
    { outside: "AMBIENT_OUTSIDE_OEM_ENVELOPE", ambiguous: "AMBIENT_AMBIGUOUS" });
  checks.settle("P11", "AMBIENT_WITHIN_OEM_ENVELOPE");

  // P12 — entering-air dry bulb and wet bulb (or RH).
  use("returnDryBulb", "P12");
  if (evidence.measurements.returnWetBulb) use("returnWetBulb", "P12");
  else if (evidence.measurements.returnRh) use("returnRh", "P12");
  else checks.add("P12", "HOLD", "ENTERING_WET_BULB_OR_RH_UNAVAILABLE");
  checks.settle("P12", "ENTERING_AIR_CONDITIONS_MEASURED");

  // Indication inputs are part of the qualifying measurement set.
  const criterion = oem.noninvasiveCriterion;
  let indicator: { value: number; uncertainty: number; unit: Unit } | null = null;
  if (criterion.status === "PUBLISHED") {
    const derivation = criterion.derivation;
    if (derivation.kind === "SINGLE_MEASUREMENT") {
      const single = use(derivation.measurement, "P18");
      if (single) indicator = { value: single.value, uncertainty: single.accuracy as number, unit: single.unit };
    } else {
      const [returnKey, supplyKey]: [MeasurementKey, MeasurementKey] = derivation.kind === "RETURN_MINUS_SUPPLY_DRY_BULB"
        ? ["returnDryBulb", "supplyDryBulb"] : ["returnWetBulb", "supplyWetBulb"];
      const entering = use(returnKey, "P18");
      const leaving = use(supplyKey, "P18");
      if (entering && leaving) {
        indicator = {
          value: entering.value - leaving.value,
          uncertainty: worstCaseUncertainty([entering.accuracy as number, leaving.accuracy as number]),
          unit: "F",
        };
      }
    }
  }

  // P05 and P13 settle after every measurement has been examined.
  checks.settle("P05", "INSTRUMENTS_VALID");
  if (windowStart === null) checks.add("P13", "HOLD", "STEADY_STATE_WINDOW_UNESTABLISHED");
  checks.settle("P13", "SYNCHRONIZED_MEASUREMENT_SET_IN_QUALIFYING_WINDOW");

  // P15 + P18 — indication step (Amendment A2), reached only when all else is satisfied.
  const prerequisitesSatisfied = !checks.failing();
  const basis = request.statedBasis;
  const prohibitedOnly = basis.length > 0 && basis.every((code) => PROHIBITED.has(code));
  if (!prerequisitesSatisfied) {
    checks.add("P15", "HOLD", "NOT_EVALUATED_PREREQUISITES_UNRESOLVED");
    if (!checks.failing("P18")) checks.add("P18", "HOLD", "NOT_EVALUATED_PREREQUISITES_UNRESOLVED");
  } else if (criterion.status === "NOT_OBTAINED") {
    checks.add("P15", "HOLD", "NOT_EVALUATED_INDICATION_UNAVAILABLE");
    checks.add("P18", criterion.obtainable ? "HOLD" : "ESCALATE",
      criterion.obtainable ? "OEM_NONINVASIVE_CRITERION_PENDING" : "INDICATION_AUTHORITY_UNAVAILABLE");
  } else if (indicator) {
    const classification = compare("indicator", "P18", indicator.value, indicator.uncertainty, criterion.range, indicator.unit,
      { outside: "", ambiguous: "" });
    if (basis.length === 0) {
      checks.add("P15", "HOLD", "STATED_BASIS_MISSING");
      checks.add("P18", "HOLD", "NOT_EVALUATED_BASIS_UNRESOLVED");
    } else if (classification === "AMBIGUOUS") {
      if (prohibitedOnly) checks.add("P15", "HOLD", "PROHIBITED_BASIS_RESTATE_REQUIRED");
      else checks.add("P15", "SATISFIED", "BASIS_NOT_SOLELY_PROHIBITED");
      checks.add("P18", "HOLD", "I2_PREDICATES_NOT_ESTABLISHABLE");
    } else if (classification === "OUTSIDE") {
      if (prohibitedOnly) {
        checks.add("P15", "HOLD", "PROHIBITED_BASIS_RESTATE_REQUIRED");
        checks.add("P18", "HOLD", "NOT_EVALUATED_BASIS_UNRESOLVED");
      } else {
        checks.add("P15", "SATISFIED", "BASIS_NOT_SOLELY_PROHIBITED");
        checks.add("P18", "SATISFIED", "I1_OEM_INDICATION");
        indicationPath = "I1";
      }
    } else if (classification === "WITHIN") {
      if (prohibitedOnly) {
        checks.add("P15", "HOLD", "BASIS_SOLELY_PROHIBITED");
        checks.add("P18", "DENY", "NOT_INDICATED_PROHIBITED_BASIS");
      } else {
        checks.add("P15", "SATISFIED", "BASIS_NOT_SOLELY_PROHIBITED");
        checks.add("P18", "DENY", "NOT_INDICATED");
      }
    }
  }

  const window = {
    effectiveRunStart: effectiveRunStart === null ? null : iso(effectiveRunStart),
    windowStart: windowStart === null ? null : iso(windowStart),
    windowEnd,
  };
  return finalize(checks, findings, derivedTesp, indicationPath, window, runRestarted);
}

function finalize(
  checks: Checks,
  findings: IntervalFinding[],
  derivedTesp: GateAEvaluation["derivedTesp"],
  indicationPath: GateAEvaluation["indicationPath"],
  window: GateAEvaluation["window"],
  runRestarted: boolean,
): GateAEvaluation {
  // Fail closed: any required proposition without a check is unresolved.
  for (const proposition of REQUIRED_PROPOSITIONS) {
    if (!checks.items.some((check) => check.proposition === proposition)) {
      checks.add(proposition, "HOLD", "NOT_EVALUATED");
    }
  }
  const determination = deriveDecision(toRequirementResults(checks.items));
  return {
    determination,
    checks: checks.items,
    indicationPath: determination === "ALLOW" ? indicationPath : null,
    ambiguityFindings: findings,
    derivedTesp,
    window,
    runRestarted,
  };
}
