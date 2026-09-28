/**
 * HYPOTHETICAL governed OEM sources and system binding — TEST FIXTURES ONLY.
 *
 * "ExampleCo", its models, documents, hashes and every value below are synthetic.
 * They are NOT real-world OEM records, are NOT authoritative, and are never
 * registered in the governed registry (packages/domain/niret/oem-registry).
 * They exist so the A7/A8 registry, binding, resolver, projection and engine path
 * can be exercised end to end without representing any manufacturer's data.
 */

import { sha256Canonical } from "../../../packages/crypto/receipts.js";
import {
  loadOemRegistry, type OemReferenceRecord, type OemRegistry, type OemSystemBinding,
} from "../../../packages/domain/niret/oem-registry/index.js";

const T = (hhmm: string) => `2026-09-27T${hhmm}:00Z`;
const cite = (pageRef: string, tableOrChart: string | null = null) => ({ pageRef, tableOrChart });

export const OUTDOOR_ID = "NIRET-OEM-SYNTHETIC-OUTDOOR-1";
export const INDOOR_ID = "NIRET-OEM-SYNTHETIC-INDOOR-1";
export const BINDING_ID = "NIRET-OEM-BIND-SYNTHETIC-1";

const common = (recordId: string) => ({
  recordId,
  recordVersion: 1,
  contract: "TA-14-NIRET-GA-C1/A8" as const,
  manufacturer: "ExampleCo",
  ahriReference: null,
  acquisition: { method: "OEM_WEBSITE_DOWNLOAD" as const, sourceRef: `synthetic://not-a-real-source/${recordId}.pdf`, acquiredBy: "CURATOR-TEST-1", acquiredAt: T("08:00") },
  curation: { transcribedBy: "CURATOR-TEST-1", transcribedAt: T("08:30"), curationRequestRef: null },
  review: { state: "VERIFIED" as const, reviewedBy: "OEM-REVIEWER-TEST", reviewedAt: T("09:00"), method: "INDEPENDENT_SECOND_READ_AGAINST_HASHED_DOCUMENT" as const, notes: null },
  status: { supersession: "CURRENT" as const, supersededBy: null, supersedes: [] },
});

/** Synthetic outdoor-unit instructions: charging method, conditions, run time, criterion, outdoor/return locations, pairing. */
export function outdoorRecord(): OemReferenceRecord {
  return {
    ...common(OUTDOOR_ID),
    sourceClass: "OEM_OUTDOOR_UNIT_INSTRUCTIONS",
    coverage: { modelFamily: "SYNTHETIC CU family", models: ["CU-200"] },
    matchedSystems: [{ indoorModel: "AH-100", outdoorModel: "CU-200", meteringDevice: "TXV", cite: cite("3", "Table 1 (synthetic)") }],
    document: {
      documentId: "IOM-SYN", title: "Synthetic Installation & Service Manual (test fixture)", revision: "A", date: "2026-01",
      sha256: sha256Canonical("SYNTHETIC-OUTDOOR-DOCUMENT-BYTES"), mediaType: "application/pdf",
    },
    criteria: {
      chargingMethod: { status: "IDENTIFIED", description: "Synthetic charging method", cite: cite("14", "Table 7 (synthetic)"), pressureBased: true },
      specialToolOrModeRequired: { value: false, description: null, cite: null },
      ambientEnvelope: { min: 65, max: 115, unit: "F", cite: cite("14", "Table 7 (synthetic)") },
      minRunMinutes: { value: 20, cite: cite("14", "Step 3 (synthetic)") },
      measurementLocations: {
        returnDryBulb: { location: "RETURN_PLENUM", oemText: "return plenum (synthetic)", cite: cite("15") },
        returnWetBulb: { location: "RETURN_PLENUM", oemText: "return plenum (synthetic)", cite: cite("15") },
        supplyDryBulb: { location: "SUPPLY_PLENUM", oemText: "supply plenum (synthetic)", cite: cite("15") },
        outdoorDryBulb: { location: "CONDENSER_INLET", oemText: "condenser air inlet (synthetic)", cite: cite("15") },
      },
      noninvasiveCriterion: {
        status: "PUBLISHED",
        derivation: { kind: "RETURN_MINUS_SUPPLY_DRY_BULB" },
        coverage: "PARTIAL",
        lookup: { interpolationRequired: false, calculationRequired: false, unrepresentedConditions: [] },
        candidates: [{ candidateId: "TD-1", range: { min: 16, max: 21, unit: "F", cite: cite("16", "Figure 9 (synthetic)") }, appliesWhen: [] }],
      },
    },
  };
}

/** Synthetic indoor-unit fan-performance data: airflow criterion, blower ESP range, static locations. */
export function indoorRecord(): OemReferenceRecord {
  return {
    ...common(INDOOR_ID),
    sourceClass: "OEM_INDOOR_UNIT_FAN_PERFORMANCE",
    coverage: { modelFamily: "SYNTHETIC AH family", models: ["AH-100"] },
    matchedSystems: [],
    document: {
      documentId: "PD-AH-SYN", title: "Synthetic Air Handler Product Data (test fixture)", revision: "B", date: "2025-11",
      sha256: sha256Canonical("SYNTHETIC-INDOOR-DOCUMENT-BYTES"), mediaType: "application/pdf",
    },
    criteria: {
      airflowCriteria: [{ kind: "CFM_RANGE", range: { min: 1050, max: 1300, unit: "CFM", cite: cite("9", "Blower table 3 (synthetic)") } }],
      espTableDomain: { blowerSetting: "Tap 3", range: { min: 0.1, max: 0.8, unit: "IN_WC", cite: cite("9", "Blower table 3 (synthetic)") } },
      measurementLocations: {
        returnStatic: { location: "RETURN_PORT", oemText: "return static port (synthetic)", cite: cite("9") },
        supplyStatic: { location: "SUPPLY_PORT", oemText: "supply static port (synthetic)", cite: cite("9") },
      },
    },
  };
}

export function hypotheticalBinding(records: OemReferenceRecord[] = [outdoorRecord(), indoorRecord()]): OemSystemBinding {
  return {
    bindingId: BINDING_ID,
    bindingVersion: 1,
    contract: "TA-14-NIRET-GA-C1/A8",
    system: { manufacturer: "ExampleCo", indoorModel: "AH-100", outdoorModel: "CU-200" },
    constituents: records.map((record) => ({ recordId: record.recordId, recordHash: sha256Canonical(record) })),
    pairingSources: [OUTDOOR_ID],
    criterionSources: {
      chargingMethod: OUTDOOR_ID,
      specialToolOrModeRequired: OUTDOOR_ID,
      ambientEnvelope: OUTDOOR_ID,
      minRunMinutes: OUTDOOR_ID,
      noninvasiveCriterion: OUTDOOR_ID,
      airflowCriteria: INDOOR_ID,
      espTableDomain: INDOOR_ID,
      measurementLocations: {
        returnDryBulb: OUTDOOR_ID, returnWetBulb: OUTDOOR_ID, supplyDryBulb: OUTDOOR_ID, outdoorDryBulb: OUTDOOR_ID,
        returnStatic: INDOOR_ID, supplyStatic: INDOOR_ID,
      },
    },
    noninvasiveCriterionAbsence: null,
    curation: { transcribedBy: "BINDING-CURATOR-TEST", transcribedAt: T("09:05") },
    review: { state: "VERIFIED", reviewedBy: "BINDING-REVIEWER-TEST", reviewedAt: T("09:20"), method: "INDEPENDENT_SECOND_READ_AGAINST_HASHED_DOCUMENT", notes: null },
    status: { supersession: "CURRENT", supersededBy: null, supersedes: [] },
  };
}

/** Pins each record's and binding's canonical hash, exactly as the governed manifest would. */
export function manifestFor(records: readonly OemReferenceRecord[], bindings: readonly OemSystemBinding[]) {
  return {
    records: Object.fromEntries(records.map((record) => [record.recordId, sha256Canonical(record)])),
    bindings: Object.fromEntries(bindings.map((binding) => [binding.bindingId, sha256Canonical(binding)])),
  };
}

export function hypotheticalRegistry(
  records: OemReferenceRecord[] = [outdoorRecord(), indoorRecord()],
  bindings: OemSystemBinding[] = [hypotheticalBinding(records)],
): OemRegistry {
  return loadOemRegistry(records, bindings, manifestFor(records, bindings));
}
