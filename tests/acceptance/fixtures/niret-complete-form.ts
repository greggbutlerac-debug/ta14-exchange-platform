/**
 * A complete NIRET technician form for acceptance tests.
 *
 * OEM ranges, run times and locations are SYNTHETIC FIXTURES standing in for a
 * technician's transcription of a model-specific OEM document; they match the
 * HYPOTHETICAL governed registry in niret-hypothetical-oem-record.ts.
 */

import { emptyNiretForm, type NiretFormState } from "../../../apps/web/lib/niret/form-state";

export const T = (hhmm: string) => `2026-09-27T${hhmm}:00Z`;
export const SERVER_NOW = new Date(T("10:30"));

export function completeForm(): NiretFormState {
  const form = emptyNiretForm();
  Object.assign(form.job, {
    technicianId: "TECH-1", certificationStatus: "CERTIFIED", certificationType: "UNIVERSAL", certificateRef: "EPA608-0001",
    workScopeRef: "WO-1", workScopeIncludesDiagnosis: "YES", sitePermission: "GRANTED", jurisdiction: "NOT_REQUIRED",
    hazard: "NONE_IDENTIFIED", statedProposition: "Charge condition requires pressure evidence", statedBasis: ["NONINVASIVE_EVIDENCE"],
  });
  Object.assign(form.equipment, {
    manufacturer: "ExampleCo", indoorModel: "AH-100", outdoorModel: "CU-200", pairingVerified: "YES", verifiedAt: T("09:50"),
    configuration: "DUCTED_SPLIT", compressorStaging: "SINGLE_STAGE", mode: "COOLING", nominalCapacityBtuh: "36000",
  });
  Object.assign(form.refrigerant, { declared: "R-410A", safetyClass: "A1" });
  Object.assign(form.metering, { type: "TXV", evidenceBasis: "DIRECT_OBSERVATION", verifiedAt: T("09:55") });
  Object.assign(form.oem, {
    manufacturer: "ExampleCo", model: "CU-200", document: "Installation & Service Manual", revision: "Rev A (2024-03)",
    section: "Charging, p.14", sourceRef: "file://ExampleCo-CU200-IOM-RevA.pdf",
    chargingMethodStatus: "IDENTIFIED", chargingMethodRef: "Table 7",
    airflow: { min: "1050", max: "1300", ref: "Blower table 3" }, esp: { min: "0.1", max: "0.8", ref: "Table 3" },
    ambient: { min: "65", max: "115", ref: "Table 7" }, minRunMinutes: "20", minRunRef: "Step 3",
    locations: {
      returnDryBulb: "RETURN_PLENUM", returnWetBulb: "RETURN_PLENUM", supplyDryBulb: "SUPPLY_PLENUM",
      outdoorDryBulb: "CONDENSER_INLET", returnStatic: "RETURN_PORT", supplyStatic: "SUPPLY_PORT",
    },
    criterionStatus: "PUBLISHED", criterionDerivation: "RETURN_MINUS_SUPPLY_DRY_BULB", criterion: { min: "16", max: "21", ref: "Figure 9" },
  });
  Object.assign(form.operation, { runStartedAt: T("10:00"), compressorRunningSteadily: "YES" });
  Object.assign(form.evaporator, { iceStatus: "NO_ICE", iceObservedAt: T("10:24") });
  Object.assign(form.condenser, { panelsInPlace: "YES", coilCondition: "CLEAR", fanOperating: "YES", observedAt: T("10:05") });
  Object.assign(form.airflowMethod, { method: "FLOW_GRID", motorType: "PSC" });
  form.instruments = [
    { id: "THERMO-1", kind: "TEMPERATURE", accuracy: "0.5", calibrationValid: true, setupVerified: true },
    { id: "MANO-1", kind: "AIR_PRESSURE", accuracy: "0.01", calibrationValid: true, setupVerified: true },
    { id: "FLOW-1", kind: "AIRFLOW", accuracy: "30", calibrationValid: true, setupVerified: true },
  ];
  form.pressureInstruments = [{ id: "GAUGE-1", ratedFor: "R-410A, R-22", calibrationValid: true }];
  const at = T("10:25");
  form.measurements = {
    returnDryBulb: { value: "76", instrumentId: "THERMO-1", location: "RETURN_PLENUM", measuredAt: at },
    returnWetBulb: { value: "64", instrumentId: "THERMO-1", location: "RETURN_PLENUM", measuredAt: at },
    supplyDryBulb: { value: "52", instrumentId: "THERMO-1", location: "SUPPLY_PLENUM", measuredAt: at },
    outdoorDryBulb: { value: "88", instrumentId: "THERMO-1", location: "CONDENSER_INLET", measuredAt: at },
    airflow: { value: "1180", instrumentId: "FLOW-1", location: "SUPPLY_TRUNK", measuredAt: at, governedMethod: true },
    returnStatic: { value: "0.2", instrumentId: "MANO-1", location: "RETURN_PORT", measuredAt: at },
    supplyStatic: { value: "0.3", instrumentId: "MANO-1", location: "SUPPLY_PORT", measuredAt: at },
  };
  form.staticDirection = { returnStatic: "BELOW_AMBIENT", supplyStatic: "ABOVE_AMBIENT" };
  return form;
}
