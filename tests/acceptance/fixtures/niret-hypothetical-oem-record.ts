/**
 * HYPOTHETICAL governed OEM reference record — TEST FIXTURE ONLY.
 *
 * "ExampleCo", its models, its document, its hash and every value below are
 * synthetic. This is NOT a real-world OEM record, is NOT authoritative, and is
 * never registered in the governed registry (packages/domain/niret/oem-registry).
 * It exists so the A7 registry, resolver, projection and engine path can be
 * exercised end to end without representing any manufacturer's data.
 */

import { sha256Canonical } from "../../../packages/crypto/receipts.js";
import { loadOemRegistry, type OemReferenceRecord, type OemRegistry } from "../../../packages/domain/niret/oem-registry/index.js";

const T = (hhmm: string) => `2026-09-27T${hhmm}:00Z`;
const cite = (pageRef: string, tableOrChart: string | null = null) => ({ pageRef, tableOrChart });

export function hypotheticalRecord(): OemReferenceRecord {
  return {
    recordId: "NIRET-OEM-SYNTHETIC-FIXTURE-1",
    recordVersion: 1,
    contract: "TA-14-NIRET-GA-C1/A7",
    equipment: {
      manufacturer: "ExampleCo",
      modelFamily: "SYNTHETIC CU family",
      matchedSystems: [{ indoorModel: "AH-100", outdoorModel: "CU-200", cite: cite("3", "Table 1 (synthetic)") }],
    },
    document: {
      documentId: "IOM-SYN",
      title: "Synthetic Installation & Service Manual (test fixture)",
      revision: "A",
      date: "2026-01",
      sha256: sha256Canonical("SYNTHETIC-FIXTURE-DOCUMENT-BYTES"),
      mediaType: "application/pdf",
    },
    acquisition: { method: "OEM_WEBSITE_DOWNLOAD", sourceRef: "synthetic://not-a-real-source/IOM-SYN-A.pdf", acquiredBy: "CURATOR-TEST-1", acquiredAt: T("08:00") },
    curation: { transcribedBy: "CURATOR-TEST-1", transcribedAt: T("08:30"), curationRequestRef: null },
    review: { state: "VERIFIED", reviewedBy: "OEM-REVIEWER-TEST", reviewedAt: T("09:00"), method: "INDEPENDENT_SECOND_READ_AGAINST_HASHED_DOCUMENT", notes: null },
    status: { supersession: "CURRENT", supersededBy: null, supersedes: [] },
    criteria: {
      chargingMethod: { status: "IDENTIFIED", description: "Synthetic charging method", cite: cite("14", "Table 7 (synthetic)") },
      specialToolOrModeRequired: { value: false, description: null, cite: null },
      airflowRange: { min: 1050, max: 1300, unit: "CFM", cite: cite("9", "Blower table 3 (synthetic)") },
      espRange: { min: 0.1, max: 0.8, unit: "IN_WC", cite: cite("9", "Blower table 3 (synthetic)") },
      ambientEnvelope: { min: 65, max: 115, unit: "F", cite: cite("14", "Table 7 (synthetic)") },
      minRunMinutes: { value: 20, cite: cite("14", "Step 3 (synthetic)") },
      measurementLocations: {
        returnDryBulb: { location: "RETURN_PLENUM", oemText: "return plenum (synthetic)", cite: cite("15") },
        returnWetBulb: { location: "RETURN_PLENUM", oemText: "return plenum (synthetic)", cite: cite("15") },
        supplyDryBulb: { location: "SUPPLY_PLENUM", oemText: "supply plenum (synthetic)", cite: cite("15") },
        outdoorDryBulb: { location: "CONDENSER_INLET", oemText: "condenser air inlet (synthetic)", cite: cite("15") },
        returnStatic: { location: "RETURN_PORT", oemText: "return static port (synthetic)", cite: cite("9") },
        supplyStatic: { location: "SUPPLY_PORT", oemText: "supply static port (synthetic)", cite: cite("9") },
      },
      noninvasiveCriterion: {
        status: "PUBLISHED",
        derivation: { kind: "RETURN_MINUS_SUPPLY_DRY_BULB" },
        coverage: "PARTIAL",
        lookup: { interpolationRequired: false, calculationRequired: false, unrepresentedConditions: [] },
        candidates: [{ candidateId: "TD-1", range: { min: 16, max: 21, unit: "F" }, cite: cite("16", "Figure 9 (synthetic)"), appliesWhen: [] }],
      },
    },
  };
}

/** Pins each record's canonical hash, exactly as the governed manifest would. */
export function manifestFor(records: readonly OemReferenceRecord[]) {
  return { records: Object.fromEntries(records.map((record) => [record.recordId, sha256Canonical(record)])) };
}

export function hypotheticalRegistry(records: OemReferenceRecord[] = [hypotheticalRecord()]): OemRegistry {
  return loadOemRegistry(records, manifestFor(records));
}
