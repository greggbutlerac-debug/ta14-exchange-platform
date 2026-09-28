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
import spec from "./gate-a-c1.spec.json";
import { classifyInterval, worstCaseUncertainty } from "./interval";
import { isTwoSided, magnitudeInterval, rangeRecord, resolveRange } from "./range";
import { invalidatedBy } from "./invalidation";
import {
  APPENDIX_W_A2L_REFRIGERANTS,
  GATE_A_VERSION,
  I3_PERMITTED_BASES,
  PROHIBITED_BASES,
  REQUIRED_PROPOSITIONS,
  SHA256_HEX,
  type PropositionId,
} from "./propositions";
import type {
  AirflowEvidence,
  AuthorityElement,
  CheckResult,
  CriterionCandidate,
  CriterionSelection,
  GateAEvaluation,
  GateAInput,
  IntervalFinding,
  Measurement,
  MeasurementAuthority,
  MeasurementKey,
  MeteringType,
  OemProvenance,
  OemRange,
  OemSourceClass,
  PropositionCheck,
  Unit,
} from "./types";
import type { ValidationOutcome } from "./validate";

export const EXPECTED_UNIT: Readonly<Record<MeasurementKey, Unit>> = {
  returnDryBulb: "F", returnWetBulb: "F", returnRh: "PCT_RH",
  supplyDryBulb: "F", supplyWetBulb: "F", supplyRh: "PCT_RH",
  outdoorDryBulb: "F", outdoorWetBulb: "F", outdoorRh: "PCT_RH",
  airflow: "CFM", returnStatic: "IN_WC", supplyStatic: "IN_WC",
  suctionLineTemp: "F", liquidLineTemp: "F",
  supplyVoltage: "V", compressorCurrent: "A", blowerCurrent: "A",
};

/**
 * Amendment A9 (C1-R6) location authority. Class A: an OEM-prescribed location governs.
 * Class B/C: where the OEM prescribes none, a TA-14 governed measurement method (spec
 * governed_measurement_methods) applicable to the key establishes the location and procedure.
 */
const CLASS_C = new Set<MeasurementKey>(["airflow", "supplyVoltage", "compressorCurrent", "blowerCurrent"]);
/** Criterion inputs whose measurement point must be the OEM's (no governed substitute). */
const OEM_POINT_REQUIRED_AS_CRITERION_INPUT = new Set<MeasurementKey>(["suctionLineTemp"]);
const GOVERNED_METHODS: ReadonlyMap<string, readonly string[]> = new Map(
  (spec.governed_measurement_methods as Array<{ id: string; applies_to: string[] }>).map((method) => [method.id, method.applies_to]),
);

const ACCEPTED_CERTIFICATIONS = new Set(["TYPE_II", "UNIVERSAL"]);

/** Amendment A6: propositions that govern authority to execute the entry, not the technical question. */
export const EXECUTION_AUTHORITY: ReadonlySet<PropositionId> = new Set<PropositionId>(["P17", "ENTRY"]);

// Amendment A5/A6 authority elements: findings that restrict execution authority.
const AUTHORITY_ELEMENTS: readonly AuthorityElement[] = ["identity", "workScope", "sitePermission", "jurisdiction"];
const AUTHORITY_RESTRICTIONS: Readonly<Record<AuthorityElement, Readonly<Record<string, [CheckResult, string]>>>> = {
  identity: { DOES_NOT_MATCH: ["ESCALATE", "TECHNICIAN_IDENTITY_MISMATCH"] },
  workScope: { EXCLUDES_DIAGNOSIS: ["ESCALATE", "WORK_SCOPE_EXCLUDES_DIAGNOSIS"] },
  sitePermission: { WITHHELD: ["DENY", "AUTHORITY_TO_TEST_WITHHELD"] },
  jurisdiction: { REQUIRED_NOT_CONFIRMED: ["HOLD", "JURISDICTIONAL_AUTHORIZATION_UNCONFIRMED"] },
};
const PROHIBITED = new Set<string>(PROHIBITED_BASES);
const I3_PERMITTED = new Set<string>(I3_PERMITTED_BASES);

function normalizeRefrigerant(designation: string): string {
  return designation.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
const A2L_DESIGNATIONS = new Set(APPENDIX_W_A2L_REFRIGERANTS.map(normalizeRefrigerant));

/** A7: model and manufacturer identity compare exactly, ignoring only case and whitespace. */
const identityKey = (value: string): string => value.toUpperCase().replace(/\s+/g, "");

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
  const measurementAuthority: GateAEvaluation["measurementAuthority"] = {};
  let airflowEvidence: AirflowEvidence = {
    path: null, blowerSetting: null, designatedSetting: null, operatingPoint: null, bracket: null, convention: null, ref: null,
  };
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
    return finalize(checks, findings, null, null, { status: "NOT_EVALUATED", candidateId: null },
      { effectiveRunStart: null, windowStart: null, windowEnd }, false, {}, airflowEvidence);
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

  // P01 — equipment identity and pairing. Amendment A7: the pairing is established only by an
  // independently verified governed OEM record that names this exact manufacturer and indoor/outdoor
  // combination; a declared pairing may restrict (false), never grant.
  const equipment = evidence.equipment;
  const provenance = oem.provenance;
  // Amendment A8: the pairing comes from a VERIFIED, CURRENT system binding naming its pairing source(s).
  const governedRecord = provenance?.verification === "VERIFIED" && provenance.acquisitionMethod === "GOVERNED_LIBRARY" &&
    !(provenance.conflicts?.length);
  if (!equipment.manufacturer?.trim() || !equipment.indoorModel?.trim() || !equipment.outdoorModel?.trim() || equipment.pairingVerifiedAgainstOem === false) {
    checks.add("P01", equipment.identityEstablishableFromOem === false ? "ESCALATE" : "HOLD",
      equipment.identityEstablishableFromOem === false ? "IDENTITY_UNESTABLISHABLE" : "IDENTITY_OR_PAIRING_UNESTABLISHED");
  } else if (!governedRecord) {
    checks.add("P01", "HOLD", "PAIRING_NOT_ESTABLISHED_BY_GOVERNED_OEM_RECORD");
  } else if (!provenance.pairingSources?.length) {
    checks.add("P01", "HOLD", "PAIRING_SOURCE_ABSENT");
  } else if (
    identityKey(provenance.manufacturer ?? "") !== identityKey(equipment.manufacturer) ||
    !(provenance.matchedSystems ?? []).some((system) =>
      identityKey(system.indoorModel) === identityKey(equipment.indoorModel as string) &&
      identityKey(system.outdoorModel) === identityKey(equipment.outdoorModel as string))
  ) {
    checks.add("P01", "HOLD", "OEM_REFERENCE_MODEL_MISMATCH");
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
  // A8 (R5-12): metering-restricted OEM criteria apply only to an established metering device.
  const establishedMetering = checks.failing("P03") ? null : metering.type;
  const meteringApplies = (types: readonly MeteringType[] | undefined) =>
    !types || (establishedMetering !== null && (types as readonly string[]).includes(establishedMetering));

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
  else {
    // Amendment A4: declaration or documentation never verifies itself.
    const verification = certification.verification;
    if (!verification || verification.status === "NOT_VERIFIED") checks.add("P17", "HOLD", "CERTIFICATION_NOT_VERIFIED");
    else if (verification.status === "VERIFICATION_UNAVAILABLE") checks.add("P17", "ESCALATE", "CERTIFICATION_VERIFICATION_UNAVAILABLE");
    else if (!verification.verifier?.trim() || !verification.reference?.trim() || !verification.verifiedAt) {
      checks.add("P17", "HOLD", "CERTIFICATION_VERIFICATION_EVIDENCE_INCOMPLETE");
    } else if (verification.verifier.trim().toLowerCase() === evidence.technician.identity.trim().toLowerCase()) {
      checks.add("P17", "HOLD", "CERTIFICATION_SELF_VERIFICATION_REJECTED");
    }
  }
  // Amendment A6: execution authority requires an authenticated submitter and verified
  // certification. Work scope, site permission, jurisdiction and identity grants are not
  // required here (field-authority layer), but any declared or established restriction
  // still restricts (A5: declarations may restrict, never grant).
  const authorization = evidence.authorization;
  if (authorization.workScopeIncludesDiagnosis === false) checks.add("P17", "ESCALATE", "WORK_SCOPE_EXCLUDES_DIAGNOSIS");
  if (authorization.sitePermission === "WITHHELD") checks.add("P17", "DENY", "AUTHORITY_TO_TEST_WITHHELD");
  else if (authorization.sitePermission === "UNCONFIRMED") checks.add("P17", "HOLD", "SITE_PERMISSION_UNCONFIRMED");
  if (authorization.jurisdiction === "UNCONFIRMED") checks.add("P17", "HOLD", "JURISDICTIONAL_AUTHORIZATION_UNCONFIRMED");
  const technicianId = evidence.technician.identity.trim().toLowerCase();
  const submitterId = evidence.submittedBy?.accountId.trim().toLowerCase();
  const isSelf = (party: string) => {
    const normalized = party.trim().toLowerCase();
    return normalized === technicianId || (submitterId !== undefined && normalized === submitterId);
  };
  if (!evidence.submittedBy) checks.add("P17", "HOLD", "SUBMITTER_UNAUTHENTICATED");
  for (const element of AUTHORITY_ELEMENTS) {
    const finding = evidence.authorityEstablishment?.[element]?.finding;
    const restriction = finding ? AUTHORITY_RESTRICTIONS[element][finding] : undefined;
    if (restriction) { const [result, reason] = restriction; checks.add("P17", result, reason); }
  }
  checks.settle("P17", "AUTHORITY_TO_TEST_ESTABLISHED");

  // P14 — OEM charging method.
  if (oem.chargingMethod.status === "NOT_OBTAINED") {
    checks.add("P14", oem.chargingMethod.obtainable ? "HOLD" : "ESCALATE",
      oem.chargingMethod.obtainable ? "OEM_CHARGING_METHOD_PENDING" : "OEM_CHARGING_METHOD_UNAVAILABLE");
  }
  if (oem.requiresUnavailableToolOrMode) checks.add("P14", "ESCALATE", "OEM_PROCEDURE_REQUIRES_UNAVAILABLE_TOOL_OR_MODE");
  // Amendment A5: ALLOW-contributing OEM criteria need an independently VERIFIED reference with provenance.
  // Amendment A7: only a governed OEM reference satisfies it — transcription never does.
  // Amendment A8 (C1-R5): the governed reference is a system binding over separately preserved source
  // records; the binding and every constituent must be complete, current, verified and independently
  // reviewed, and no criterion may come from a certification listing (AHRI establishes pairing only).
  const provenanceFinding = governedProvenanceFinding(provenance, isSelf);
  if (provenanceFinding) { const [result, reason] = provenanceFinding; checks.add("P14", result, reason); }
  if (oem.chargingMethod.status === "IDENTIFIED" && !meteringApplies(oem.chargingMethod.meteringTypes)) {
    checks.add("P14", "HOLD", "OEM_CHARGING_METHOD_NOT_APPLICABLE_TO_METERING");
  }
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
  /** A9: apply Class A/B/C location authority; returns false (with a HOLD) when not established. */
  const locationEstablished = (key: MeasurementKey, measurement: Measurement, owner: PropositionId, criterionInput: boolean): boolean => {
    const oemLocation = oem.measurementLocations[key] ?? null;
    const record = (authorityClass: MeasurementAuthority["authorityClass"], locationBasis: MeasurementAuthority["locationBasis"]) => {
      measurementAuthority[key] = { authorityClass, locationBasis, location: measurement.location, oemLocation, methodId: measurement.methodId ?? null };
    };
    if (oemLocation) {
      record("A", oemLocation === measurement.location ? "OEM" : "UNESTABLISHED");
      if (oemLocation !== measurement.location) { checks.add(owner, "HOLD", "MEASUREMENT_LOCATION_NOT_OEM_LOCATION", [key]); return false; }
      return true;
    }
    const authorityClass = CLASS_C.has(key) ? "C" : "B";
    if (criterionInput && OEM_POINT_REQUIRED_AS_CRITERION_INPUT.has(key)) {
      record("A", "UNESTABLISHED");
      checks.add(owner, "HOLD", "OEM_LOCATION_AUTHORITY_UNAVAILABLE", [key]);
      return false;
    }
    if (!measurement.methodId) {
      record(authorityClass, "UNESTABLISHED");
      checks.add(owner, "HOLD", "OEM_LOCATION_AUTHORITY_UNAVAILABLE", [key]);
      return false;
    }
    if (!(GOVERNED_METHODS.get(measurement.methodId) ?? []).includes(key)) {
      record(authorityClass, "UNESTABLISHED");
      checks.add(owner, "HOLD", "GOVERNED_METHOD_NOT_APPLICABLE", [key]);
      return false;
    }
    record(authorityClass, "GOVERNED_METHOD");
    return true;
  };

  const use = (key: MeasurementKey, owner: PropositionId, criterionInput = false): Measurement | null => {
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
    if (!locationEstablished(key, measurement, owner, criterionInput)) usable = false;
    if (windowStart === null) { checks.add("P13", "HOLD", "STEADY_STATE_WINDOW_UNESTABLISHED", [key]); usable = false; }
    else if (ms(measurement.measuredAt) < windowStart) { checks.add("P13", "HOLD", "MEASUREMENT_OUTSIDE_QUALIFYING_WINDOW", [key]); usable = false; }
    return usable ? measurement : null;
  };

  /** F1 comparison against an OEM range whose bounds are resolved per Amendment A8 (stated, unbounded or derived). */
  const compare = (
    subject: string, owner: PropositionId, value: number, uncertainty: number, range: OemRange, unit: Unit,
    reasons: { outside: string; ambiguous: string },
  ): "WITHIN" | "OUTSIDE" | "AMBIGUOUS" | null => {
    if (range.unit !== unit) { checks.add(owner, "HOLD", "UNIT_MISMATCH", [subject]); return null; }
    const bounds = resolveRange(range);
    if (!bounds) { checks.add(owner, "HOLD", "OEM_RANGE_INVALID", [subject]); return null; }
    const classification = classifyInterval(value, uncertainty, bounds);
    findings.push({ subject, value, uncertainty, range: rangeRecord(range, bounds), classification });
    if (classification === "OUTSIDE" && reasons.outside) checks.add(owner, "HOLD", reasons.outside, [subject]);
    if (classification === "AMBIGUOUS" && reasons.ambiguous) checks.add(owner, "HOLD", reasons.ambiguous, [subject]);
    return classification;
  };

  /**
   * Amendment A7/A8: select exactly one OEM-published candidate whose applicability conditions contain the
   * measured conditions (F1) and whose metering restriction matches the established metering device.
   * Nothing is interpolated; anything else fails closed with `${prefix}_...` reasons on `owner`.
   */
  const selectCandidate = (
    candidates: readonly CriterionCandidate[], owner: PropositionId, prefix: string, coverage: "COMPLETE" | "PARTIAL",
  ): { selected: CriterionCandidate | null; selection: CriterionSelection } => {
    const conditionKeys = [...new Set(candidates.flatMap((candidate) => candidate.appliesWhen.map((condition) => condition.measurement)))];
    const conditions = new Map(conditionKeys.map((key) => [key, use(key, owner)] as const));
    const conditionsValid = candidates.every((candidate) => candidate.appliesWhen.every((condition) => {
      const subject = `applicability:${candidate.candidateId}:${condition.measurement}`;
      if (condition.unit !== EXPECTED_UNIT[condition.measurement]) { checks.add(owner, "HOLD", "UNIT_MISMATCH", [subject]); return false; }
      if (!resolveRange(condition)) { checks.add(owner, "HOLD", "OEM_RANGE_INVALID", [subject]); return false; }
      return true;
    }));
    if (!conditionsValid || [...conditions.values()].some((measurement) => measurement === null)) {
      return { selected: null, selection: { status: "NOT_EVALUATED", candidateId: null } };
    }
    const matches: CriterionCandidate[] = [];
    const ambiguous: CriterionCandidate[] = [];
    for (const candidate of candidates) {
      if (!meteringApplies(candidate.meteringTypes)) continue;
      const classes = candidate.appliesWhen.map((condition) => {
        const measurement = conditions.get(condition.measurement) as Measurement;
        const bounds = resolveRange(condition) as { min: number; max: number };
        return { condition, measurement, bounds, classification: classifyInterval(measurement.value, measurement.accuracy as number, bounds) };
      });
      if (classes.every((item) => item.classification === "WITHIN")) matches.push(candidate);
      else if (!classes.some((item) => item.classification === "OUTSIDE")) ambiguous.push(candidate);
      for (const item of classes) {
        if (item.classification === "AMBIGUOUS" || classes.every((other) => other.classification === "WITHIN")) {
          findings.push({
            subject: `applicability:${candidate.candidateId}:${item.condition.measurement}`,
            value: item.measurement.value,
            uncertainty: item.measurement.accuracy as number,
            range: rangeRecord(item.condition, item.bounds),
            classification: item.classification,
          });
        }
      }
    }
    const [only, ...others] = matches;
    if (only && others.length === 0) return { selected: only, selection: { status: "SELECTED", candidateId: only.candidateId } };
    if (only) {
      checks.add(owner, "HOLD", `${prefix}_CANDIDATES_CONFLICT`, matches.map((candidate) => candidate.candidateId));
      return { selected: null, selection: { status: "CONFLICT", candidateId: null } };
    }
    if (ambiguous.length > 0) {
      checks.add(owner, "HOLD", `${prefix}_APPLICABILITY_AMBIGUOUS`, ambiguous.map((candidate) => candidate.candidateId));
      return { selected: null, selection: { status: "AMBIGUOUS", candidateId: null } };
    }
    checks.add(owner, coverage === "COMPLETE" ? "ESCALATE" : "HOLD",
      coverage === "COMPLETE" ? `${prefix}_NOT_PUBLISHED_FOR_CONDITIONS` : `${prefix}_NOT_IN_RECORD_FOR_CONDITIONS`);
    return { selected: null, selection: { status: "NONE_APPLICABLE", candidateId: null } };
  };

  // C06 — OEM measured-stability criterion (only where the OEM specifies one).
  if (oem.stabilityCriterion) {
    const criterion = oem.stabilityCriterion;
    const readings = (evidence.stabilityReadings ?? []).filter((reading) => ms(reading.measuredAt) >= (windowStart ?? Infinity));
    const series = readings.filter((reading) =>
      reading.unit === criterion.unit && reading.accuracy !== undefined &&
      evidence.instruments.some((item) => item.instrumentId === reading.instrumentId && item.calibrationValid && item.setupVerified) &&
      locationEstablished(criterion.measurement, reading, "P04", true));
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

  // Static pressures and derived TESP (A3) are established first: P08 path (b) and P09 both rely on them.
  const returnStatic = use("returnStatic", "P09");
  const supplyStatic = use("supplyStatic", "P09");
  if (returnStatic && supplyStatic) {
    derivedTesp = {
      value: supplyStatic.value - returnStatic.value,
      uncertainty: worstCaseUncertainty([supplyStatic.accuracy as number, returnStatic.accuracy as number]),
      unit: "IN_WC",
    };
  }

  // P08 — airflow established as not confounding the OEM charging method (A8/A9):
  // (a) an applicable OEM airflow acceptance criterion (typed forms; one-sided limits enforced only), or
  // (b) the OEM published operating point: identified OEM cooling setting (designated where the OEM
  //     designates one), TESP within the OEM fan-performance range, airflow bracketed between adjacent
  //     published values without interpolation, OEM limits met, clean components.
  // Generic CFM/ton values are never used.
  const method = evidence.airflowMethod;
  if (!method) checks.add("P08", "HOLD", "AIRFLOW_METHOD_UNRECORDED");
  else if (method.method === "TEMPERATURE_RISE") checks.add("P08", "HOLD", "AIRFLOW_METHOD_NOT_ACCEPTABLE_FOR_COOLING");
  else if (method.method === "OEM_CFM_ESP_TABLE") {
    if (method.motorType === "UNKNOWN") checks.add("P08", "HOLD", "BLOWER_MOTOR_TYPE_UNESTABLISHED");
    if (method.motorType === "ECM" && oem.permitsEcmWithTableMethod !== true) checks.add("P08", "HOLD", "OEM_TABLE_METHOD_NOT_PERMITTED_FOR_ECM");
    if (method.componentsClean !== true) checks.add("P08", "HOLD", "COMPONENTS_NOT_ESTABLISHED_CLEAN_FOR_TABLE_METHOD");
  }
  const airflowCriteria = (oem.airflowCriteria ?? []).filter((criterion) => meteringApplies(criterion.meteringTypes));
  const fanPerformance = oem.fanPerformance;
  const tableMethod = method?.method === "OEM_CFM_ESP_TABLE";
  // A measured airflow is required unless the OEM table method establishes it through path (b).
  const airflow = !(tableMethod && fanPerformance) && (airflowCriteria.length === 0 || airflowCriteria.some((criterion) => criterion.kind === "CFM_RANGE"))
    ? use("airflow", "P08") : null;
  if (airflowCriteria.length === 0 && !fanPerformance) checks.add("P08", "HOLD", "OEM_AIRFLOW_RANGE_UNAVAILABLE");

  // Path (a): OEM acceptance criteria — every applicable criterion is enforced as a limit.
  let acceptedTwoSided = false;
  const oneSidedRanges: OemRange[] = [];
  for (const criterion of airflowCriteria) {
    if (criterion.kind === "CFM_RANGE") {
      if (!isTwoSided(criterion.range)) oneSidedRanges.push(criterion.range);
      if (airflow) {
        const classification = compare("airflow", "P08", airflow.value, airflow.accuracy as number, criterion.range, airflow.unit,
          { outside: "AIRFLOW_OUTSIDE_OEM_RANGE", ambiguous: "AIRFLOW_AMBIGUOUS" });
        if (classification === "WITHIN" && isTwoSided(criterion.range)) acceptedTwoSided = true;
      }
    } else {
      const { selected: cell } = selectCandidate(criterion.candidates, "P08", "OEM_AIRFLOW_CHECK", criterion.coverage);
      if (!cell) continue;
      const entering = use("returnDryBulb", "P08", true);
      const leaving = use("supplyDryBulb", "P08", true);
      if (entering && leaving) {
        const classification = compare("coilTemperatureDrop", "P08", entering.value - leaving.value,
          worstCaseUncertainty([entering.accuracy as number, leaving.accuracy as number]), cell.range, "F",
          { outside: "AIRFLOW_TEMPERATURE_DROP_OUTSIDE_OEM_CHECK", ambiguous: "AIRFLOW_TEMPERATURE_DROP_AMBIGUOUS" });
        if (classification === "WITHIN" && isTwoSided(cell.range)) acceptedTwoSided = true;
      }
    }
  }
  if (acceptedTwoSided) {
    airflowEvidence = { ...airflowEvidence, path: "OEM_ACCEPTANCE_CRITERION" };
  } else if (fanPerformance) {
    // Path (b): OEM published operating point.
    const failing = (reason: string, keys: string[] = []) => checks.add("P08", "HOLD", reason, keys);
    const setting = method?.blowerSetting?.trim() || null;
    const published = setting ? fanPerformance.settings.find((entry) => identityKey(entry.setting) === identityKey(setting)) : undefined;
    airflowEvidence = {
      ...airflowEvidence, blowerSetting: setting, designatedSetting: fanPerformance.designatedSetting,
      convention: fanPerformance.convention, ref: fanPerformance.ref,
    };
    if (!method || method.componentsClean !== true) failing("COMPONENTS_NOT_ESTABLISHED_CLEAN_FOR_TABLE_METHOD");
    if (method?.motorType === "ECM" && tableMethod && oem.permitsEcmWithTableMethod !== true && !checks.items.some((c) => c.reason === "OEM_TABLE_METHOD_NOT_PERMITTED_FOR_ECM")) {
      failing("OEM_TABLE_METHOD_NOT_PERMITTED_FOR_ECM");
    }
    if (!setting) failing("BLOWER_SETTING_UNIDENTIFIED");
    else if (!published || !published.coolingPermitted) failing("BLOWER_SETTING_NOT_OEM_COOLING_SETTING");
    else if (fanPerformance.designatedSetting !== null && identityKey(fanPerformance.designatedSetting) !== identityKey(setting)) {
      failing("BLOWER_SETTING_NOT_OEM_DESIGNATED");
    } else if (derivedTesp) {
      const points = [...published.points].sort((a, b) => a.esp - b.esp);
      const domain = { min: (points[0] as { esp: number }).esp, max: (points.at(-1) as { esp: number }).esp };
      const classification = compare("operatingPointTesp", "P08", derivedTesp.value, derivedTesp.uncertainty,
        { min: domain.min, max: domain.max, unit: "IN_WC", ref: fanPerformance.ref }, "IN_WC",
        { outside: "AIRFLOW_OPERATING_POINT_OUTSIDE_OEM_DATA", ambiguous: "AIRFLOW_OPERATING_POINT_AMBIGUOUS" });
      if (classification === "WITHIN") {
        const low = derivedTesp.value - derivedTesp.uncertainty;
        const high = derivedTesp.value + derivedTesp.uncertainty;
        const from = [...points].reverse().find((point) => point.esp <= low) as { esp: number; cfm: number };
        const to = points.find((point) => point.esp >= high) as { esp: number; cfm: number };
        const span = points.filter((point) => point.esp >= from.esp && point.esp <= to.esp).map((point) => point.cfm);
        const steps: number[] = [];
        span.reduce((previous, cfm) => { steps.push(Math.sign(cfm - previous)); return cfm; });
        const monotonic = steps.every((step) => step <= 0) || steps.every((step) => step >= 0);
        if (!monotonic) {
          failing("AIRFLOW_BRACKET_NOT_MONOTONIC", ["airflow"]);
        } else {
          const bracket = { espLow: from.esp, espHigh: to.esp, cfmMin: Math.min(...span), cfmMax: Math.max(...span) };
          airflowEvidence = { ...airflowEvidence, operatingPoint: { tesp: derivedTesp.value, uncertainty: derivedTesp.uncertainty }, bracket };
          // OEM one-sided limits apply to the bracketed airflow (table method) or the measured airflow.
          const half = (bracket.cfmMax - bracket.cfmMin) / 2;
          for (const range of oneSidedRanges) {
            if (tableMethod) compare("airflow", "P08", bracket.cfmMin + half, half, range, "CFM",
              { outside: "AIRFLOW_OUTSIDE_OEM_RANGE", ambiguous: "AIRFLOW_AMBIGUOUS" });
          }
          if (!checks.failing("P08")) airflowEvidence = { ...airflowEvidence, path: "OEM_PUBLISHED_OPERATING_POINT" };
        }
      }
    }
    if (airflowEvidence.path === null && !checks.failing("P08")) failing("AIRFLOW_OPERATING_POINT_UNESTABLISHED");
  } else if (airflowCriteria.length > 0) {
    checks.add("P08", "HOLD", "AIRFLOW_ACCEPTANCE_ONE_SIDED");
  }
  checks.settle("P08", "AIRFLOW_ACCEPTED_BY_OEM_CRITERION");

  // P09 — Amendment A8 (R5-05): TESP lies within the ESP range of the OEM blower-performance data
  // (no extrapolation) and every OEM static limit is met.
  const staticLimits = oem.staticLimits ?? [];
  if (!oem.espTableDomain && staticLimits.length === 0) checks.add("P09", "HOLD", "OEM_ESP_RANGE_UNAVAILABLE");
  if (derivedTesp && oem.espTableDomain) {
    compare("derivedTesp", "P09", derivedTesp.value, derivedTesp.uncertainty, oem.espTableDomain, "IN_WC",
      { outside: "ESP_OUTSIDE_OEM_RANGE", ambiguous: "ESP_AMBIGUOUS" });
  }
  for (const limit of staticLimits) {
    const measured = limit.component === "TOTAL" ? derivedTesp
      : limit.component === "RETURN" ? returnStatic && { value: returnStatic.value, uncertainty: returnStatic.accuracy as number }
      : supplyStatic && { value: supplyStatic.value, uncertainty: supplyStatic.accuracy as number };
    if (!measured) continue;
    const interval = limit.basis === "MAGNITUDE" ? magnitudeInterval(measured.value, measured.uncertainty) : measured;
    compare(`staticLimit:${limit.component}:${limit.basis}`, "P09", interval.value, interval.uncertainty, limit.range, "IN_WC",
      { outside: "STATIC_PRESSURE_LIMIT_NOT_MET", ambiguous: "STATIC_PRESSURE_LIMIT_AMBIGUOUS" });
  }
  checks.settle("P09", "EXTERNAL_STATIC_PRESSURE_WITHIN_OEM_DATA");

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
  let selected: CriterionCandidate | null = null;
  let criterionSelection: CriterionSelection = { status: criterion.status === "PUBLISHED" ? "NOT_EVALUATED" : "NOT_PUBLISHED", candidateId: null };
  if (criterion.status === "PUBLISHED") {
    const derivation = criterion.derivation;
    if (derivation.kind === "SINGLE_MEASUREMENT") {
      const single = use(derivation.measurement, "P18", true);
      if (single) indicator = { value: single.value, uncertainty: single.accuracy as number, unit: single.unit };
    } else {
      const [minuendKey, subtrahendKey]: [MeasurementKey, MeasurementKey] =
        derivation.kind === "RETURN_MINUS_SUPPLY_DRY_BULB" ? ["returnDryBulb", "supplyDryBulb"]
        : derivation.kind === "RETURN_MINUS_SUPPLY_WET_BULB" ? ["returnWetBulb", "supplyWetBulb"]
        // A8 (R5-09): OEM-defined approach = liquid-line temperature minus outdoor ambient.
        : ["liquidLineTemp", "outdoorDryBulb"];
      const minuend = use(minuendKey, "P18", true);
      const subtrahend = use(subtrahendKey, "P18", true);
      if (minuend && subtrahend) {
        indicator = {
          value: minuend.value - subtrahend.value,
          uncertainty: worstCaseUncertainty([minuend.accuracy as number, subtrahend.accuracy as number]),
          unit: "F",
        };
      }
    }

    // Amendment A7: the criterion value is taken from exactly one OEM-published candidate whose
    // applicability conditions contain the measured conditions (F1). Nothing is interpolated,
    // calculated beyond A8 OEM-stated arithmetic, or looked up outside the bounded record.
    const lookup = criterion.lookup;
    if (lookup.interpolationRequired) checks.add("P18", "ESCALATE", "OEM_CRITERION_REQUIRES_INTERPOLATION");
    if (lookup.calculationRequired) checks.add("P18", "ESCALATE", "OEM_CRITERION_REQUIRES_CALCULATION");
    if (lookup.unrepresentedConditions.length > 0) {
      checks.add("P18", "ESCALATE", "OEM_CRITERION_CONDITION_NOT_REPRESENTED", [...lookup.unrepresentedConditions]);
    }
    if (lookup.interpolationRequired || lookup.calculationRequired || lookup.unrepresentedConditions.length > 0) {
      criterionSelection = { status: "NOT_REPRESENTABLE", candidateId: null };
    } else {
      const result = selectCandidate(criterion.candidates, "P18", "OEM_CRITERION", criterion.coverage);
      selected = result.selected;
      criterionSelection = result.selection;
    }
  }

  // P05 and P13 settle after every measurement has been examined.
  checks.settle("P05", "INSTRUMENTS_VALID");
  if (windowStart === null) checks.add("P13", "HOLD", "STEADY_STATE_WINDOW_UNESTABLISHED");
  checks.settle("P13", "SYNCHRONIZED_MEASUREMENT_SET_IN_QUALIFYING_WINDOW");

  // P15 + P18 — indication step (Amendment A2), reached only when all else is satisfied.
  // A6: the technical indication waits on technical prerequisites only.
  const prerequisitesSatisfied = !checks.items.some((check) => check.result !== "SATISFIED" && !EXECUTION_AUTHORITY.has(check.proposition));
  const basis = request.statedBasis;
  const prohibitedOnly = basis.length > 0 && basis.every((code) => PROHIBITED.has(code));
  if (!prerequisitesSatisfied) {
    checks.add("P15", "HOLD", "NOT_EVALUATED_PREREQUISITES_UNRESOLVED");
    if (!checks.failing("P18")) checks.add("P18", "HOLD", "NOT_EVALUATED_PREREQUISITES_UNRESOLVED");
  } else if (criterion.status === "NOT_OBTAINED") {
    // Amendment A8 (C1-R5) I3 — OEM post-event verification path (owner ruling Option C). Available only when
    // no governed source publishes a non-invasive charge criterion, the OEM method is pressure-based and its
    // documentation requires or supports verification after a charge change or repair, and the evidence
    // record carries that event (the anchor). The anchor establishes a bounded purpose, not a diagnosis.
    const chargingMethod = oem.chargingMethod;
    const postEvent = chargingMethod.status === "IDENTIFIED" && chargingMethod.pressureBased === true
      ? chargingMethod.postEventVerification : undefined;
    const anchors = evidence.events.filter((event) =>
      (event.type === "REFRIGERANT_CHARGE_CHANGED" ||
        (event.type === "REPAIR_OR_COMPONENT_REPLACEMENT" && event.affectsRefrigerantCircuit === true)) &&
      effectiveRunStart !== null && ms(event.at) <= effectiveRunStart);
    if (!postEvent || anchors.length === 0) {
      checks.add("P15", "HOLD", "NOT_EVALUATED_INDICATION_UNAVAILABLE");
      checks.add("P18", criterion.obtainable ? "HOLD" : "ESCALATE",
        criterion.obtainable ? "OEM_NONINVASIVE_CRITERION_PENDING" : "INDICATION_AUTHORITY_UNAVAILABLE");
      if (postEvent) checks.add("P18", "HOLD", "I3_EVENT_ANCHOR_ABSENT");
      else if (anchors.length > 0) checks.add("P18", "HOLD", "I3_OEM_POST_EVENT_VERIFICATION_NOT_DOCUMENTED");
    } else {
      let methodConditionsEstablished = true;
      for (const condition of (chargingMethod.status === "IDENTIFIED" ? chargingMethod.conditions : undefined) ?? []) {
        const measurement = use(condition.measurement, "P18", true);
        const classification = measurement
          ? compare(`methodCondition:${condition.measurement}`, "P18", measurement.value, measurement.accuracy as number, condition, measurement.unit,
            { outside: "I3_METHOD_CONDITIONS_NOT_ESTABLISHED", ambiguous: "I3_METHOD_CONDITIONS_AMBIGUOUS" })
          : null;
        if (classification !== "WITHIN") methodConditionsEstablished = false;
      }
      if (basis.length === 0) {
        checks.add("P15", "HOLD", "STATED_BASIS_MISSING");
        checks.add("P18", "HOLD", "NOT_EVALUATED_BASIS_UNRESOLVED");
      } else if (prohibitedOnly) {
        checks.add("P15", "HOLD", "PROHIBITED_BASIS_RESTATE_REQUIRED");
        checks.add("P18", "HOLD", "NOT_EVALUATED_BASIS_UNRESOLVED");
      } else if (!basis.some((code) => I3_PERMITTED.has(code))) {
        checks.add("P15", "HOLD", "I3_BASIS_NOT_PERMITTED");
        checks.add("P18", "HOLD", "NOT_EVALUATED_BASIS_UNRESOLVED");
      } else {
        checks.add("P15", "SATISFIED", "BASIS_NOT_SOLELY_PROHIBITED");
        if (methodConditionsEstablished) {
          checks.add("P18", "SATISFIED", "I3_OEM_POST_EVENT_VERIFICATION", anchors.map((event) => `${event.type}@${event.at}`));
          indicationPath = "I3";
        } else if (!checks.failing("P18")) {
          checks.add("P18", "HOLD", "I3_METHOD_CONDITIONS_NOT_ESTABLISHED");
        }
      }
    }
  } else if (indicator && selected) {
    const classification = compare("indicator", "P18", indicator.value, indicator.uncertainty, selected.range, indicator.unit,
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
  return finalize(checks, findings, derivedTesp, indicationPath, criterionSelection, window, runRestarted, measurementAuthority, airflowEvidence);
}

const CERTIFICATION_LISTING: OemSourceClass = "AHRI_CERTIFICATION_LISTING";

/** Amendments A5/A7/A8: provenance rules for the governed OEM reference (binding + constituents). */
function governedProvenanceFinding(
  provenance: OemProvenance | undefined,
  isSelf: (party: string) => boolean,
): [CheckResult, string] | null {
  if (provenance?.conflicts?.length) return ["HOLD", "OEM_BINDING_CONFLICT"];
  if (!provenance || provenance.verification === "NOT_VERIFIED") return ["HOLD", "OEM_REFERENCE_NOT_VERIFIED"];
  if (provenance.verification === "VERIFICATION_UNAVAILABLE") return ["ESCALATE", "OEM_REFERENCE_VERIFICATION_UNAVAILABLE"];
  if (provenance.acquisitionMethod !== "GOVERNED_LIBRARY") return ["HOLD", "OEM_REFERENCE_NOT_FROM_GOVERNED_REGISTRY"];
  const blank = (value: string | undefined) => !value?.trim();
  const sources = provenance.sources ?? [];
  const sourceIds = new Set(sources.map((source) => source.recordId));
  const complete =
    ![provenance.manufacturer, provenance.verifiedBy, provenance.verifiedAt, provenance.recordId, provenance.transcribedBy, provenance.transcribedAt].some(blank) &&
    SHA256_HEX.test(provenance.recordHash ?? "") && !!provenance.matchedSystems?.length && !!provenance.supersession &&
    sources.length > 0 && !!provenance.pairingSources?.length && provenance.criterionSources !== undefined &&
    provenance.pairingSources.every((id) => sourceIds.has(id)) &&
    Object.values(provenance.criterionSources).every((id) => sourceIds.has(id)) &&
    sources.every((source) =>
      ![source.recordId, source.documentId, source.sourceRef, source.transcribedBy, source.transcribedAt].some(blank) &&
      SHA256_HEX.test(source.recordHash) && SHA256_HEX.test(source.documentHash) && !!source.supersession);
  if (!complete) return ["HOLD", "OEM_REFERENCE_PROVENANCE_INCOMPLETE"];
  const supersessions = [provenance.supersession, ...sources.map((source) => source.supersession)];
  if (supersessions.includes("SUPERSEDED")) return ["HOLD", "OEM_REFERENCE_SUPERSEDED"];
  if (supersessions.includes("WITHDRAWN")) return ["HOLD", "OEM_REFERENCE_WITHDRAWN"];
  if (sources.some((source) => source.verification !== "VERIFIED" || blank(source.verifiedBy) || blank(source.verifiedAt))) {
    return ["HOLD", "OEM_SOURCE_NOT_VERIFIED"];
  }
  const reviews = [
    { by: provenance.verifiedBy as string, at: provenance.verifiedAt as string, transcriber: provenance.transcribedBy as string, transcribedAt: provenance.transcribedAt as string },
    ...sources.map((source) => ({ by: source.verifiedBy as string, at: source.verifiedAt as string, transcriber: source.transcribedBy, transcribedAt: source.transcribedAt })),
  ];
  if (reviews.some((review) => isSelf(review.by))) return ["HOLD", "OEM_REFERENCE_SELF_VERIFICATION_REJECTED"];
  if (reviews.some((review) => identityKey(review.by) === identityKey(review.transcriber))) return ["HOLD", "OEM_REFERENCE_REVIEW_NOT_INDEPENDENT"];
  if (reviews.some((review) => ms(review.at) < ms(review.transcribedAt))) return ["HOLD", "OEM_REFERENCE_REVIEW_PRECEDES_TRANSCRIPTION"];
  const listings = new Set(sources.filter((source) => source.sourceClass === CERTIFICATION_LISTING).map((source) => source.recordId));
  if (Object.values(provenance.criterionSources ?? {}).some((id) => listings.has(id))) return ["HOLD", "OEM_CRITERION_FROM_NON_OEM_SOURCE"];
  return null;
}

function finalize(
  checks: Checks,
  findings: IntervalFinding[],
  derivedTesp: GateAEvaluation["derivedTesp"],
  indicationPath: GateAEvaluation["indicationPath"],
  criterionSelection: CriterionSelection,
  window: GateAEvaluation["window"],
  runRestarted: boolean,
  measurementAuthority: GateAEvaluation["measurementAuthority"],
  airflowEvidence: AirflowEvidence,
): GateAEvaluation {
  // Fail closed: any required proposition without a check is unresolved.
  for (const proposition of REQUIRED_PROPOSITIONS) {
    if (!checks.items.some((check) => check.proposition === proposition)) {
      checks.add(proposition, "HOLD", "NOT_EVALUATED");
    }
  }
  const determination = deriveDecision(toRequirementResults(checks.items));
  const technicalDetermination = deriveDecision(toRequirementResults(checks.items.filter((check) => !EXECUTION_AUTHORITY.has(check.proposition))));
  const executionAuthorityDetermination = deriveDecision(toRequirementResults(checks.items.filter((check) => EXECUTION_AUTHORITY.has(check.proposition))));
  return {
    determination,
    technicalDetermination,
    executionAuthorityDetermination,
    checks: checks.items,
    indicationPath: technicalDetermination === "ALLOW" ? indicationPath : null,
    ambiguityFindings: findings,
    derivedTesp,
    criterionSelection,
    measurementAuthority,
    airflowEvidence,
    window,
    runRestarted,
  };
}
