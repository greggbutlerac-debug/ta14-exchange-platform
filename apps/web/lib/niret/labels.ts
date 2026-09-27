/**
 * Plain-language labels for engine identifiers. Display text only: labels
 * never change meaning, and any identifier without a label is shown raw.
 */

export const PROPOSITION_LABELS: Readonly<Record<string, string>> = {
  INPUT: "Evidence record is complete and well-formed",
  ENTRY: "No pressure-instrument entry before Gate-A ALLOW",
  SCOPE: "Inside the bounded Gate-A scope",
  P01: "Equipment identity and pairing",
  P02: "Refrigerant identity (non-A2L) and rated pressure instruments",
  P03: "Metering device identified from direct evidence",
  P04: "OEM minimum run and steady operation",
  P05: "Measurement instruments valid",
  P06: "Evaporator free of ice (TA-14 policy)",
  P07: "Corrections recorded and re-baselined",
  P08: "Airflow within the OEM range",
  P09: "External static pressure within the OEM range",
  P10: "Heat rejection valid",
  P11: "Outdoor ambient within the OEM envelope",
  P12: "Entering air dry bulb and wet bulb/RH measured",
  P13: "Fresh synchronized measurement set",
  P14: "OEM charging method identified",
  P15: "Basis is not solely a prohibited basis",
  P16: "No unresolved hazard",
  P17: "Authority to test",
  P18: "Indication against the OEM criterion",
};

export const NEXT_ACTION_LABELS: Readonly<Record<string, string>> = {
  CORRECT_EVIDENCE_INPUT: "Correct the entries flagged as missing or invalid.",
  RETURN_TO_NONINVASIVE_EVIDENCE_AND_RESUBMIT: "Do not connect pressure instruments. Return to non-invasive evidence and submit a new Gate-A evaluation.",
  REFER_OUTSIDE_BOUNDED_GATE_A: "Refer outside the bounded Gate-A path (scope, safety, certification, or OEM authority).",
  ESTABLISH_EQUIPMENT_IDENTITY_AND_PAIRING: "Establish indoor/outdoor identity and verify pairing against the OEM documentation.",
  ESTABLISH_REFRIGERANT_IDENTITY_AND_RATED_INSTRUMENTS: "Establish the declared refrigerant and use pressure instruments rated for it.",
  ESTABLISH_METERING_DEVICE_FROM_DIRECT_EVIDENCE: "Identify the metering device from direct or configuration evidence.",
  COMPLETE_OEM_MINIMUM_RUN_AT_STEADY_STATE: "Complete the OEM minimum run without interruption, with the compressor running steadily.",
  VALIDATE_INSTRUMENTS_AND_RECORD_ACCURACY: "Register valid, calibrated instruments and record their accuracy.",
  ESTABLISH_EVAPORATOR_FREE_OF_ICE: "Establish the evaporator free of ice; complete the TA-14 restoration sequence if icing occurred.",
  COMPLETE_CORRECTION_RECORD_AND_REBASELINE: "Complete each correction record and re-baseline after it.",
  ESTABLISH_AIRFLOW_WITHIN_OEM_RANGE: "Establish airflow by an accepted method within the OEM range.",
  ESTABLISH_EXTERNAL_STATIC_PRESSURE_WITHIN_OEM_RANGE: "Measure return and supply static at the OEM locations; TESP must be within the OEM range.",
  ESTABLISH_VALID_HEAT_REJECTION: "Establish panels in place, fan operating, and a clear condenser coil after the latest state change.",
  ESTABLISH_AMBIENT_WITHIN_OEM_ENVELOPE: "Measure outdoor dry bulb at the OEM location; it must be inside the OEM envelope.",
  MEASURE_ENTERING_AIR_DRY_BULB_AND_WET_BULB_OR_RH: "Measure entering (return) dry bulb and wet bulb or RH at the OEM location.",
  OBTAIN_FRESH_SYNCHRONIZED_MEASUREMENT_SET: "Take the measurement set inside the qualifying window, after the OEM minimum run.",
  OBTAIN_OEM_CHARGING_METHOD: "Obtain the OEM charging method for this model.",
  RESTATE_BASIS_ON_ESTABLISHED_EVIDENCE: "State the basis for pressure evidence on the established non-invasive evidence.",
  RESOLVE_HAZARD: "Resolve or record the safety condition.",
  ESTABLISH_AUTHORITY_TO_TEST: "Provide certification, work-scope, site, and jurisdiction documentation.",
  ESTABLISH_INDICATION_AGAINST_OEM_CRITERION: "Obtain the OEM non-invasive criterion and complete the indicator measurements.",
  OBTAIN_AUTHORITY_TO_TEST: "Authority to test has been withheld. Do not connect pressure instruments.",
  CONTINUE_DIAGNOSIS_WITHOUT_PRESSURE_ENTRY: "Pressure-side entry is not currently indicated. Continue diagnosis without pressure instruments.",
  DO_NOT_CONNECT_UNTIL_EXECUTION_AUTHORITY_ESTABLISHED: "The evidence justifies pressure evidence, but execution authority is not established. Do not connect pressure instruments yet.",
  ACQUIRE_PRESSURE_EVIDENCE_ONLY: "You may connect rated pressure instruments to acquire pressure evidence only.",
};

export const STATE_EVENT_LABELS: Readonly<Record<string, string>> = {
  FILTER_REPLACED_OR_REMOVED: "Filter replaced or removed",
  BLOWER_SETTING_CHANGED: "Blower setting changed",
  DUCT_DAMPER_ZONING_CHANGE: "Duct / damper / zoning change",
  EVAPORATOR_COIL_CLEANED: "Evaporator coil cleaned",
  CONDENSER_COIL_CLEANED: "Condenser coil cleaned",
  PANELS_REMOVED: "Panels removed",
  THERMOSTAT_CONTROL_MODE_CHANGE: "Thermostat / control / mode change",
  COMPRESSOR_POWER_INTERRUPTED_OR_CYCLED: "Compressor power interrupted or cycled",
  REFRIGERANT_CHARGE_CHANGED: "Refrigerant charge changed",
  FREEZE_SWITCH_TRIP_OR_ICING: "Freeze-switch trip or icing",
  DEFROST_CYCLE: "Defrost cycle",
  REPAIR_OR_COMPONENT_REPLACEMENT: "Repair or component replacement",
  MATERIAL_WEATHER_OR_LOAD_CHANGE: "Material weather or load change",
};

export function humanize(code: string): string {
  return code.toLowerCase().replace(/_/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
}

/** Technician-facing names for evidence fields (measurement keys and derived subjects). */
export const FIELD_LABELS: Readonly<Record<string, string>> = {
  returnDryBulb: "Return / entering dry bulb (°F)",
  returnWetBulb: "Return / entering wet bulb (°F)",
  returnRh: "Return / entering RH (%)",
  supplyDryBulb: "Supply / leaving dry bulb (°F)",
  supplyWetBulb: "Supply / leaving wet bulb (°F)",
  supplyRh: "Supply / leaving RH (%)",
  outdoorDryBulb: "Outdoor dry bulb (°F)",
  outdoorWetBulb: "Outdoor wet bulb (°F)",
  outdoorRh: "Outdoor RH (%)",
  airflow: "Airflow (CFM)",
  returnStatic: "Return static (in. w.c.)",
  supplyStatic: "Supply static (in. w.c.)",
  derivedTesp: "TESP derived from return and supply static",
  suctionLineTemp: "Suction-line surface temperature (°F)",
  liquidLineTemp: "Liquid-line surface temperature (°F)",
  supplyVoltage: "Supply voltage (V)",
  compressorCurrent: "Compressor current (A)",
  blowerCurrent: "Blower current (A)",
  indicator: "OEM non-invasive criterion reading",
};

/** Plain-language meaning of each canonical reason code. `{field}` is replaced with the field name. */
export const REASON_MESSAGES: Readonly<Record<string, string>> = {
  INPUT_INVALID: "{field} is missing or invalid. Correct it before evaluating.",
  INPUT_UNKNOWN_FIELD: "The submission contained information this Gate-A version does not accept ({field}).",
  PRESSURE_INSTRUMENT_ENTRY_NOT_AUTHORIZED: "Pressure instruments were requested, attempted, or connected before a Gate-A ALLOW. That entry is not authorized.",
  OUT_OF_SCOPE_A2L: "The refrigerant is A2L (by class, designation, or red markings). This Gate-A version does not cover A2L systems.",
  OUT_OF_SCOPE_EQUIPMENT: "This Gate-A version covers ducted split systems only.",
  OUT_OF_SCOPE_INVERTER: "Inverter equipment is outside this Gate-A version.",
  OUT_OF_SCOPE_METERING: "EEV metering is outside this Gate-A version.",
  OUT_OF_SCOPE_MODE: "Only cooling mode is covered by this Gate-A version.",
  OUT_OF_SCOPE_QUESTION: "Only the refrigerant-charge question is covered by this Gate-A version.",
  OUT_OF_SCOPE_REFRIGERANT_CLASS: "Only A1 refrigerants are covered by this Gate-A version.",
  MODE_UNESTABLISHED: "Select the operating mode.",
  EQUIPMENT_CONFIGURATION_UNESTABLISHED: "Select the system configuration.",
  COMPRESSOR_STAGING_UNESTABLISHED: "Select the compressor staging.",
  IDENTITY_OR_PAIRING_UNESTABLISHED: "Enter the nameplate manufacturer and the indoor and outdoor models (a pairing you declared as not matching also stops here).",
  IDENTITY_UNESTABLISHABLE: "Equipment identity cannot be established from OEM documentation.",
  IDENTITY_REVERIFICATION_REQUIRED_AFTER_REPAIR: "A repair affected the equipment; re-verify identity and pairing.",
  REFRIGERANT_INTEGRITY_SUSPECT: "Mixed or contaminated refrigerant is suspected.",
  REFRIGERANT_UNDECLARED: "Enter the refrigerant exactly as shown on the nameplate.",
  REFRIGERANT_SAFETY_CLASS_UNESTABLISHED: "Select the refrigerant's safety class.",
  PRESSURE_INSTRUMENT_UNSPECIFIED: "List the pressure instrument(s) you intend to use.",
  INSTRUMENT_NOT_RATED_FOR_REFRIGERANT: "A planned pressure instrument is not rated for the declared refrigerant.",
  PRESSURE_INSTRUMENT_CALIBRATION_INVALID: "A planned pressure instrument is not marked as calibrated.",
  METERING_INFERRED_FROM_PRESSURE_REJECTED: "The metering device cannot be identified from pressure. Identify it by direct observation or documentation.",
  METERING_UNESTABLISHED: "Identify the metering device and how you identified it.",
  METERING_UNESTABLISHABLE: "The metering device cannot be established even from OEM documentation.",
  METERING_REVERIFICATION_REQUIRED_AFTER_REPAIR: "A repair affected the metering device; re-verify it.",
  HAZARD_BEYOND_COMPETENCE: "A hazard beyond the technician's competence was reported.",
  CORRECTABLE_HAZARD_UNRESOLVED: "Resolve the correctable hazard before continuing.",
  SAFETY_UNESTABLISHED: "Record the safety assessment.",
  CERTIFICATION_DOCUMENTATION_MISSING: "Enter the EPA 608 certification status, type, and certificate number.",
  TECHNICIAN_NOT_CERTIFIED: "The technician is recorded as not certified.",
  CERTIFICATION_TYPE_NOT_APPLICABLE: "This equipment needs Type II or Universal EPA 608 certification.",
  SUPERVISOR_CERTIFICATION_TYPE_NOT_APPLICABLE: "The supervising technician needs Type II or Universal EPA 608 certification.",
  CERTIFICATION_NOT_VERIFIED: "The certification has been declared but not independently verified. A certificate number alone does not verify it.",
  CERTIFICATION_VERIFICATION_UNAVAILABLE: "No independent certification-verification source is available, so certification cannot be verified here. Authority must be confirmed outside this tool.",
  CERTIFICATION_VERIFICATION_EVIDENCE_INCOMPLETE: "The certification verification record is incomplete (verifier, reference and time are required).",
  CERTIFICATION_SELF_VERIFICATION_REJECTED: "A technician cannot verify their own certification.",
  WORK_SCOPE_EXCLUDES_DIAGNOSIS: "The work scope does not include diagnosis.",
  WORK_SCOPE_DOCUMENTATION_MISSING: "Enter the work order reference and confirm it includes diagnosis.",
  AUTHORITY_TO_TEST_WITHHELD: "Site permission to test has been withheld.",
  SITE_PERMISSION_UNCONFIRMED: "Confirm site permission to test.",
  JURISDICTIONAL_AUTHORIZATION_UNCONFIRMED: "Confirm whether jurisdictional authorization is required, and that it is in place if so.",
  OEM_CHARGING_METHOD_PENDING: "Obtain the OEM charging method for this model and enter its reference.",
  OEM_CHARGING_METHOD_UNAVAILABLE: "The OEM charging method is unavailable for this model.",
  OEM_PROCEDURE_REQUIRES_UNAVAILABLE_TOOL_OR_MODE: "The OEM procedure needs a tool or service mode that isn't available.",
  RUN_START_UNRECORDED: "Record when the system started running.",
  STABILIZATION_AUTHORITY_UNAVAILABLE: "Enter the OEM minimum run time before measuring. No generic time is substituted.",
  OEM_MINIMUM_RUN_INCOMPLETE: "The OEM minimum run has not been completed since the last start or state change.",
  COMPRESSOR_NOT_ESTABLISHED_RUNNING_STEADILY: "Confirm the compressor is running steadily.",
  OEM_STABILITY_CRITERION_UNESTABLISHED: "Take at least two stability readings, with valid instruments, after the minimum run.",
  OEM_STABILITY_CRITERION_NOT_MET: "The OEM stability criterion is not met.",
  OEM_STABILITY_AMBIGUOUS: "Stability can't be confirmed within instrument accuracy. Take further readings.",
  VOLTAGE_OUTSIDE_OEM_RANGE: "Supply voltage is outside the OEM range.",
  VOLTAGE_AMBIGUOUS: "Supply voltage is too close to the OEM limit to confirm within instrument accuracy.",
  UNIT_MISMATCH: "{field}: units don't match the OEM reference. Values are never converted.",
  INSTRUMENT_ACCURACY_UNRECORDED: "{field}: the instrument's accuracy isn't recorded (or the instrument type doesn't match this reading).",
  INSTRUMENT_UNREGISTERED: "{field}: select a registered instrument.",
  INSTRUMENT_INVALID: "{field}: the instrument isn't marked as calibrated and set up correctly.",
  OEM_LOCATION_AUTHORITY_UNAVAILABLE: "{field}: enter the OEM-specified measurement location.",
  MEASUREMENT_LOCATION_NOT_OEM_LOCATION: "{field}: the reading wasn't taken at the OEM-specified location.",
  STEADY_STATE_WINDOW_UNESTABLISHED: "{field}: the qualifying measurement window isn't established yet (run start or OEM minimum run missing).",
  MEASUREMENT_OUTSIDE_QUALIFYING_WINDOW: "{field}: taken before the qualifying window. Re-measure after the OEM minimum run.",
  TA14_ICE_POLICY_ICE_PRESENT: "Ice is present on the evaporator. Complete the TA-14 ice restoration sequence.",
  EVAPORATOR_ICE_STATUS_UNESTABLISHED: "Record whether the evaporator is free of ice.",
  NO_ICE_NOT_OBSERVED_IN_QUALIFYING_WINDOW: "Observe and record \"no ice\" during the qualifying window.",
  TA14_ICE_RESTORATION_INCOMPLETE: "Complete all six TA-14 ice restoration steps.",
  CORRECTION_RECORD_INCOMPLETE: "Complete every field of the correction record.",
  CORRECTION_NOT_REBASELINED: "Re-baseline after the correction.",
  AIRFLOW_METHOD_UNRECORDED: "Select the airflow method you used.",
  AIRFLOW_METHOD_NOT_ACCEPTABLE_FOR_COOLING: "Temperature rise is not an accepted method for cooling airflow.",
  BLOWER_MOTOR_TYPE_UNESTABLISHED: "Select the blower motor type.",
  OEM_TABLE_METHOD_NOT_PERMITTED_FOR_ECM: "The OEM table method isn't permitted with an ECM motor unless the OEM allows it.",
  COMPONENTS_NOT_ESTABLISHED_CLEAN_FOR_TABLE_METHOD: "The table method needs the filter, coil and fan confirmed clean.",
  OEM_AIRFLOW_RANGE_UNAVAILABLE: "Enter the OEM airflow range with its reference.",
  AIRFLOW_OUTSIDE_OEM_RANGE: "Airflow is outside the OEM range.",
  AIRFLOW_AMBIGUOUS: "Airflow is too close to an OEM limit to confirm within instrument accuracy.",
  OEM_ESP_RANGE_UNAVAILABLE: "Enter the OEM external static pressure range with its reference.",
  ESP_OUTSIDE_OEM_RANGE: "TESP is outside the OEM range.",
  ESP_AMBIGUOUS: "TESP is too close to an OEM limit to confirm within instrument accuracy.",
  PANELS_NOT_ESTABLISHED_IN_PLACE: "Confirm the condenser panels are in place.",
  CONDENSER_FAN_NOT_ESTABLISHED_OPERATING: "Confirm the condenser fan is operating.",
  CONDENSER_COIL_NOT_ESTABLISHED_CLEAR: "The condenser coil must be observed clear.",
  CONDENSER_OBSERVATION_NOT_CURRENT: "Re-observe the condenser after the latest state change.",
  OEM_AMBIENT_ENVELOPE_UNAVAILABLE: "Enter the OEM outdoor ambient envelope with its reference.",
  AMBIENT_OUTSIDE_OEM_ENVELOPE: "Outdoor temperature is outside the OEM envelope for this method.",
  AMBIENT_AMBIGUOUS: "Outdoor temperature is too close to an OEM limit to confirm within instrument accuracy.",
  ENTERING_WET_BULB_OR_RH_UNAVAILABLE: "Enter the return/entering wet bulb or RH.",
  OEM_NONINVASIVE_CRITERION_PENDING: "Obtain the OEM non-invasive criterion for this model.",
  INDICATION_AUTHORITY_UNAVAILABLE: "No OEM non-invasive criterion is available for this model.",
  I2_PREDICATES_NOT_ESTABLISHABLE: "The indicator is too close to the OEM criterion limit to decide within instrument accuracy.",
  STATED_BASIS_MISSING: "Select the basis for wanting pressure evidence.",
  PROHIBITED_BASIS_RESTATE_REQUIRED: "The stated basis is not an accepted basis. Restate it on the measured evidence.",
  BASIS_SOLELY_PROHIBITED: "The stated basis is not an accepted basis.",
  NOT_INDICATED: "The measured evidence is within the OEM criterion: pressure-side entry is not currently indicated.",
  NOT_INDICATED_PROHIBITED_BASIS: "The evidence is within the OEM criterion and the stated basis is not an accepted basis.",
  NOT_EVALUATED_PREREQUISITES_UNRESOLVED: "Not evaluated yet: other prerequisites are unresolved.",
  NOT_EVALUATED_INDICATION_UNAVAILABLE: "Not evaluated yet: the OEM criterion is unavailable.",
  NOT_EVALUATED_BASIS_UNRESOLVED: "Not evaluated yet: the basis must be resolved first.",
  NOT_EVALUATED: "Not evaluated.",
};

/** Amendment A5 messages: authority/standing elements and OEM reference provenance. */
const AUTHORITY_ELEMENT_NAMES: Readonly<Record<string, string>> = {
  TECHNICIAN_IDENTITY: "Technician identity",
  WORK_SCOPE: "Work authorization (scope includes diagnosis)",
  SITE_PERMISSION: "Site/property permission",
  JURISDICTION: "Jurisdictional authorization",
};

export const AUTHORITY_REASON_MESSAGES: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(AUTHORITY_ELEMENT_NAMES).flatMap(([code, name]) => [
    [`${code}_NOT_ESTABLISHED`, `${name} is only declared. It must be established by an independent source; your entry does not establish it.`],
    [`${code}_ESTABLISHMENT_UNAVAILABLE`, `${name} cannot be established here: no independent source is connected. Authority must be confirmed outside this tool.`],
    [`${code}_ESTABLISHMENT_EVIDENCE_INCOMPLETE`, `${name}: the establishment record is incomplete (source, reference, time and finding are required).`],
    [`${code}_SELF_ESTABLISHMENT_REJECTED`, `${name} cannot be established by the technician or the submitting account.`],
  ]),
);

Object.assign(REASON_MESSAGES as Record<string, string>, AUTHORITY_REASON_MESSAGES, {
  SUBMITTER_UNAUTHENTICATED: "The submission was not made from an authenticated account.",
  TECHNICIAN_IDENTITY_MISMATCH: "An independent source reports that the technician is not who was declared.",
  OEM_REFERENCE_NOT_VERIFIED: "The OEM values were transcribed manually. A transcription cannot, by itself, supply the OEM criteria an ALLOW depends on.",
  OEM_REFERENCE_VERIFICATION_UNAVAILABLE: "No governed OEM reference source is connected, so the OEM criteria cannot be verified here. The measurements are still recorded as evidence.",
  OEM_REFERENCE_PROVENANCE_INCOMPLETE: "The OEM reference record is incomplete (record, document hash, matched systems, source, transcriber, reviewer and times are required).",
  OEM_REFERENCE_SELF_VERIFICATION_REJECTED: "The technician or submitting account cannot verify the OEM reference.",
  // Amendment A7: governed OEM reference record.
  OEM_REFERENCE_NOT_FROM_GOVERNED_REGISTRY: "Only a governed OEM reference record can supply the OEM criteria an ALLOW depends on. A transcription cannot.",
  OEM_REFERENCE_SUPERSEDED: "The OEM reference record has been superseded by a newer document revision.",
  OEM_REFERENCE_WITHDRAWN: "The OEM reference record has been withdrawn.",
  OEM_REFERENCE_REVIEW_NOT_INDEPENDENT: "The OEM reference record was reviewed by the person who transcribed it. It needs an independent reviewer.",
  OEM_REFERENCE_REVIEW_PRECEDES_TRANSCRIPTION: "The OEM reference record's review predates its transcription.",
  OEM_REFERENCE_MODEL_MISMATCH: "The nameplate manufacturer or indoor/outdoor combination is not one the OEM reference record covers.",
  PAIRING_NOT_ESTABLISHED_BY_GOVERNED_OEM_RECORD: "No verified OEM reference record covers this exact manufacturer and indoor/outdoor combination, so the pairing is not established. You can submit a curation request.",
  OEM_CRITERION_REQUIRES_INTERPOLATION: "The OEM criterion for this system requires interpolation, which this Gate-A version does not perform. Refer outside Gate A.",
  OEM_CRITERION_REQUIRES_CALCULATION: "The OEM criterion for this system requires a calculation this Gate-A version does not perform. Refer outside Gate A.",
  OEM_CRITERION_CONDITION_NOT_REPRESENTED: "The OEM criterion depends on a condition the governed record cannot represent. Refer outside Gate A.",
  OEM_CRITERION_CANDIDATES_CONFLICT: "More than one OEM criterion value applies to the measured conditions. The record must be corrected before it can be relied on.",
  OEM_CRITERION_APPLICABILITY_AMBIGUOUS: "The measured conditions are too close to an OEM table boundary (within instrument accuracy) to select one OEM criterion value.",
  OEM_CRITERION_NOT_PUBLISHED_FOR_CONDITIONS: "The OEM publishes no criterion for the measured conditions.",
  OEM_CRITERION_NOT_IN_RECORD_FOR_CONDITIONS: "The governed record holds no OEM criterion value for the measured conditions.",
});

const PATH_LABELS: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
  [/^\/evidence\/measurements\/(\w+)/, (m) => FIELD_LABELS[m[1]] ?? m[1]],
  [/^\/evidence\/stabilityReadings/, () => "Stability reading"],
  [/^\/evidence\/technician\/identity/, () => "Technician ID"],
  [/^\/evidence\/technician\/certification/, () => "EPA 608 certification (type and certificate number)"],
  [/^\/evidence\/corrections/, () => "Correction record"],
  [/^\/evidence\/evaporator\/iceRestoration/, () => "Ice restoration record"],
  [/^\/evidence\/events/, () => "State-change log"],
  [/^\/evidence\/(\w+)/, (m) => humanize(m[1])],
  [/^\/oem\/airflowRange/, () => "OEM airflow range"],
  [/^\/oem\/espRange/, () => "OEM external static range"],
  [/^\/oem\/ambientEnvelope/, () => "OEM outdoor ambient envelope"],
  [/^\/oem\/voltageRange/, () => "OEM voltage range"],
  [/^\/oem\/minRunMinutes/, () => "OEM minimum run"],
  [/^\/oem\/stabilityCriterion/, () => "OEM stability criterion"],
  [/^\/oem\/chargingMethod/, () => "OEM charging method reference"],
  [/^\/oem\/noninvasiveCriterion/, () => "OEM non-invasive criterion (basis, range, and reference)"],
  [/^\/oem/, () => "OEM reference"],
  [/^\/request\/statedProposition/, () => "Refrigerant-charge question"],
  [/^\/request/, () => "Request"],
];

/** Field name for an evidence key or a validation path ("path: message"). */
export function fieldLabel(evidenceKey: string): string {
  if (evidenceKey.startsWith("timestamp after evaluatedAt")) return "A recorded time later than the server time (check the device clock)";
  if (evidenceKey.startsWith("timestamp not parseable")) return "A recorded time";
  const path = evidenceKey.split(":")[0].trim();
  for (const [pattern, label] of PATH_LABELS) {
    const match = path.match(pattern);
    if (match) return label(match);
  }
  return FIELD_LABELS[path] ?? evidenceKey;
}

/** Plain-language messages for a reason code; the canonical code is always shown alongside. */
export function describeReason(code: string, evidenceKeys: readonly string[] = []): string[] {
  const measurementMissing = code.match(/^([A-Z]+)_UNAVAILABLE$/);
  const template = REASON_MESSAGES[code]
    ?? (measurementMissing && evidenceKeys.length ? "{field} reading is missing. Enter the measured value before continuing." : undefined);
  if (!template) return [humanize(code)];
  if (!template.includes("{field}")) return [template];
  if (code === "INPUT_INVALID") {
    return evidenceKeys.map((key) => {
      const label = fieldLabel(key);
      return key.startsWith("/evidence/measurements/")
        ? `${label} reading is missing or invalid. Enter the measured value before continuing.`
        : template.replace("{field}", label);
    });
  }
  const keys = evidenceKeys.length ? evidenceKeys : ["this entry"];
  return keys.map((key) => template.replace("{field}", fieldLabel(key)));
}
