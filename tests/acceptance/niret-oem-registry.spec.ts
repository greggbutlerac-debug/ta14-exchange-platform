import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { sha256Canonical } from "../../packages/crypto/receipts.js";
import { runGateA } from "../../packages/domain/niret/index.js";
import manifest from "../../packages/domain/niret/oem-registry/manifest.json";
import { REGISTERED_BINDINGS, REGISTERED_RECORDS } from "../../packages/domain/niret/oem-registry/records.js";
import {
  GOVERNED_OEM_REGISTRY, loadOemRegistry, projectBinding, registrationFindings, resolveOemReference,
  type OemReferenceRecord, type OemSystemBinding,
} from "../../packages/domain/niret/oem-registry/index.js";
import { DeterminationPanel, type EvaluationResponse } from "../../apps/web/components/niret/NiretResult";
import { buildCurationRequest } from "../../apps/web/lib/niret/curation-request";
import { buildGateAInput } from "../../apps/web/lib/niret/evidence-adapter";
import { emptyNiretForm } from "../../apps/web/lib/niret/form-state";
import type { ReceiptLike } from "../../apps/web/lib/niret/presentation";
import {
  applyServerEvidence, evaluateNiretSubmission, NO_SOURCES, stampEvaluatedAt, submissionContext, type EvaluationSources,
} from "../../apps/web/lib/niret/server-evaluate";
import {
  BINDING_ID, hypotheticalBinding, hypotheticalRegistry, indoorRecord, INDOOR_ID, manifestFor, outdoorRecord, OUTDOOR_ID,
} from "./fixtures/niret-hypothetical-oem-record";

/*
 * Every OEM record in this file is a HYPOTHETICAL, SYNTHETIC test fixture
 * (see fixtures/niret-hypothetical-oem-record.ts). None is a real manufacturer
 * record and none is registered in the governed registry.
 */

const T = (hhmm: string) => `2026-09-27T${hhmm}:00Z`;
const SERVER_NOW = new Date(T("10:30"));
const SYSTEM = { manufacturer: "ExampleCo", indoorModel: "AH-100", outdoorModel: "CU-200" };

const outdoor = (patch: (draft: OemReferenceRecord) => void = () => {}) => {
  const draft = outdoorRecord();
  patch(draft);
  return draft;
};
const indoor = (patch: (draft: OemReferenceRecord) => void = () => {}) => {
  const draft = indoorRecord();
  patch(draft);
  return draft;
};
const binding = (records: OemReferenceRecord[], patch: (draft: OemSystemBinding) => void = () => {}) => {
  const draft = hypotheticalBinding(records);
  patch(draft);
  return draft;
};
/** A hypothetical synthetic AHRI certification listing (pairing identity only; no criteria). */
const ahriListing = (patch: (draft: OemReferenceRecord) => void = () => {}): OemReferenceRecord => {
  const draft: OemReferenceRecord = {
    ...outdoorRecord(),
    recordId: "NIRET-OEM-SYNTHETIC-AHRI-1",
    sourceClass: "AHRI_CERTIFICATION_LISTING",
    coverage: { modelFamily: null, models: ["AH-100", "CU-200"] },
    matchedSystems: [{ indoorModel: "AH-100", outdoorModel: "CU-200", meteringDevice: null, cite: { pageRef: "1", tableOrChart: null } }],
    ahriReference: "SYNTHETIC-000000",
    document: { documentId: "AHRI-CERT-SYN", title: "Synthetic AHRI certificate (test fixture)", revision: null, date: "2026-02", sha256: sha256Canonical("SYNTHETIC-AHRI"), mediaType: "application/pdf" },
    acquisition: { method: "AHRI_DIRECTORY_RECORD", sourceRef: "synthetic://ahri", acquiredBy: "CURATOR-TEST-1", acquiredAt: T("08:00") },
    ahriListing: {
      referenceNumber: "SYNTHETIC-000000", listedOutdoorModel: "CU-200", listedIndoorModel: "AH-100",
      enhancements: [], historicalListingEvidence: "synthetic directory record (test fixture)",
      presentStatus: "DISCONTINUED", presentStatusObservedAt: T("08:00"), certifiedAtObservation: false,
      listedFrom: null, discontinuedOn: null, ratingsBasis: null, ratings: {}, limitations: "synthetic test fixture",
    },
    criteria: {},
  };
  patch(draft);
  return draft;
};
const registryOf = (records: OemReferenceRecord[], bindings: OemSystemBinding[]) =>
  loadOemRegistry(records, bindings, manifestFor(records, bindings));

/** A complete engine input for SYSTEM whose OEM values arrive only from the client (to be replaced or kept by the server). */
function submission(): Record<string, any> {
  const input = JSON.parse(JSON.stringify({
    request: { requestId: "REQ-1", question: "REFRIGERANT_CHARGE", statedProposition: "Charge condition requires pressure evidence", statedBasis: ["NONINVASIVE_EVIDENCE"], evaluatedAt: T("10:30") },
    evidence: {
      recordId: "REC-1", pressureSideEntry: "NOT_PERFORMED",
      equipment: { ...SYSTEM, configuration: "DUCTED_SPLIT", compressorStaging: "SINGLE_STAGE", verifiedAt: T("09:50") },
      mode: "COOLING",
      metering: { type: "TXV", evidenceBasis: "DIRECT_OBSERVATION", verifiedAt: T("09:55") },
      refrigerant: { declared: "R-410A", safetyClass: "A1", a2lMarkingsObserved: false, flammableRefrigerantLabelsObserved: false, integritySuspect: false },
      technician: { identity: "TECH-1", certification: { status: "CERTIFIED", type: "UNIVERSAL", certificateRef: "EPA608-0001" } },
      authorization: {},
      safety: { hazard: "NONE_IDENTIFIED" },
      instruments: ["THERMO-1", "MANO-1", "FLOW-1"].map((instrumentId) => ({ instrumentId, calibrationValid: true, setupVerified: true })),
      plannedPressureInstruments: [{ instrumentId: "GAUGE-1", ratedForRefrigerants: ["R-410A"], calibrationValid: true }],
      operation: { runStartedAt: T("10:00"), compressorRunningSteadily: true },
      events: [], corrections: [],
      evaporator: { iceStatus: "NO_ICE", iceObservedAt: T("10:24") },
      condenser: { panelsInPlace: true, coilCondition: "CLEAR", fanOperating: true, observedAt: T("10:05") },
      airflowMethod: { method: "FLOW_GRID", motorType: "PSC" },
      measurements: Object.fromEntries(([
        ["returnDryBulb", 76, "F", 0.5, "RETURN_PLENUM", "THERMO-1"], ["returnWetBulb", 64, "F", 0.5, "RETURN_PLENUM", "THERMO-1"],
        ["supplyDryBulb", 52, "F", 0.5, "SUPPLY_PLENUM", "THERMO-1"], ["outdoorDryBulb", 88, "F", 0.5, "CONDENSER_INLET", "THERMO-1"],
        ["airflow", 1180, "CFM", 30, "SUPPLY_TRUNK", "FLOW-1"], ["returnStatic", -0.2, "IN_WC", 0.01, "RETURN_PORT", "MANO-1"],
        ["supplyStatic", 0.3, "IN_WC", 0.01, "SUPPLY_PORT", "MANO-1"],
      ] as const).map(([key, value, unit, accuracy, location, instrumentId]) =>
        [key, { value, unit, accuracy, location, instrumentId, measuredAt: T("10:25"), provenance: "MANUAL", ...(key === "airflow" ? { methodId: "GM-AF-01" } : {}) }])),
    },
    // A technician transcription that disagrees with the record: the server must not use it when a record resolves.
    oem: {
      documentRefs: ["technician transcription"],
      provenance: { acquisitionMethod: "GOVERNED_LIBRARY", verification: "VERIFIED", verifiedBy: "ME", verifiedAt: T("09:00"), manufacturer: "ExampleCo" },
      chargingMethod: { status: "IDENTIFIED", ref: "tech" },
      requiresUnavailableToolOrMode: false,
      airflowCriteria: [{ kind: "CFM_RANGE", range: { min: 1190, max: 1250, unit: "CFM", ref: "tech" } }],
      measurementLocations: {},
      noninvasiveCriterion: {
        status: "PUBLISHED", derivation: { kind: "RETURN_MINUS_SUPPLY_DRY_BULB" }, coverage: "PARTIAL",
        lookup: { interpolationRequired: false, calculationRequired: false, unrepresentedConditions: [] },
        candidates: [{ candidateId: "MANUAL_TRANSCRIPTION", range: { min: 20, max: 30, unit: "F", ref: "tech" }, appliesWhen: [] }],
      },
    },
  }));
  return input;
}

/** Sources with certification verified (so execution authority is not the limiting factor) and a chosen registry. */
const sourcesWith = (oemRegistry: EvaluationSources["oemRegistry"]): EvaluationSources => ({
  ...NO_SOURCES,
  submitter: { accountId: "account-uuid-1" },
  certificationVerifier: { verify: () => ({ status: "VERIFIED", verifier: "INDEPENDENT-VERIFIER-TEST", reference: "VR-1", verifiedAt: T("10:10") }) },
  oemRegistry,
});

describe("A7/A8 governed OEM registry — shipped state (T98, T121)", () => {
  it("T98/T121 the shipped registry is empty, pins no record or binding, and resolves nothing", () => {
    expect(REGISTERED_RECORDS).toEqual([]);
    expect(REGISTERED_BINDINGS).toEqual([]);
    expect(manifest.records).toEqual({});
    expect(manifest.bindings).toEqual({});
    expect(GOVERNED_OEM_REGISTRY).toEqual({ available: true, records: [], bindings: [], rejections: [] });
    expect(resolveOemReference(GOVERNED_OEM_REGISTRY, SYSTEM)).toEqual({ status: "NO_RECORD" });
    const source = ["registry.ts", "index.ts", "records.ts"].map((file) =>
      readFileSync(new URL(`../../packages/domain/niret/oem-registry/${file}`, import.meta.url), "utf8")).join("\n");
    expect(source).not.toMatch(/"?(min|max|value|nominal|tolerance|percent)"?\s*:\s*\d/);
  });
  it("T98 with the shipped registry, the complete technical evidence set cannot reach ALLOW", () => {
    const { receipt } = evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(GOVERNED_OEM_REGISTRY));
    expect(receipt.determination).toBe("HOLD");
    expect(receipt.reason_codes).toEqual(expect.arrayContaining(["OEM_REFERENCE_NOT_VERIFIED", "PAIRING_NOT_ESTABLISHED_BY_GOVERNED_OEM_RECORD"]));
  });
});

describe("A7/A8 registry integrity, registration and binding structure (T99, T100, T119, T120)", () => {
  it("T99/T119 unpinned or dangling records and bindings, schema-invalid entries, or a constituent hash mismatch make the registry unavailable", () => {
    const records = [outdoorRecord(), indoorRecord()];
    const good = hypotheticalBinding(records);
    const changedIndoor = indoor((d) => { d.recordVersion = 2; });
    const cases: Array<[ReturnType<typeof loadOemRegistry>, string]> = [
      [loadOemRegistry([outdoor((d) => { d.recordVersion = 2; }), indoorRecord()], [good], manifestFor(records, [good])), "RECORD_HASH_NOT_PINNED_IN_MANIFEST"],
      [loadOemRegistry(records, [binding(records, (d) => { d.bindingVersion = 2; })], manifestFor(records, [good])), "BINDING_HASH_NOT_PINNED_IN_MANIFEST"],
      [loadOemRegistry([outdoorRecord()], [], manifestFor(records, [])), "MANIFEST_ENTRY_WITHOUT_RECORD"],
      [loadOemRegistry(records, [], manifestFor(records, [good])), "MANIFEST_ENTRY_WITHOUT_BINDING"],
      [loadOemRegistry([{ ...outdoorRecord(), extra: true }, indoorRecord()], [], manifestFor(records, [])), "SCHEMA_INVALID"],
      [loadOemRegistry([outdoorRecord(), changedIndoor], [good], manifestFor([outdoorRecord(), changedIndoor], [good])), "CONSTITUENT_HASH_MISMATCH"],
    ];
    for (const [registry, reason] of cases) {
      expect(registry.available).toBe(false);
      expect(registry.rejections.map((item) => item.reason.split(":")[0])).toContain(reason);
      expect(resolveOemReference(registry, SYSTEM).status).toBe("REGISTRY_UNAVAILABLE");
    }
  });
  it("T99 an unavailable registry -> OEM VERIFICATION_UNAVAILABLE -> P14 ESCALATE; nothing from it is relied on", () => {
    const records = [outdoorRecord(), indoorRecord()];
    const broken = loadOemRegistry(records, [binding(records, (d) => { d.bindingVersion = 9; })], manifestFor(records, [hypotheticalBinding(records)]));
    const { receipt } = evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(broken));
    expect(receipt.determination).toBe("ESCALATE");
    expect(receipt.reason_codes).toContain("OEM_REFERENCE_VERIFICATION_UNAVAILABLE");
    expect(receipt.oem_reference_provenance).toMatchObject({ acquisition_method: "MANUAL_TRANSCRIPTION", verification: "VERIFICATION_UNAVAILABLE", record_id: null });
  });
  it("T119 structural binding faults make the registry unavailable", () => {
    const records = [outdoorRecord(), indoorRecord()];
    const listing = ahriListing();
    const cases: Array<[OemReferenceRecord[], (d: OemSystemBinding) => void, string]> = [
      [records, (d) => { d.pairingSources = ["NIRET-OEM-NOT-BOUND"]; }, "PAIRING_SOURCE_NOT_CONSTITUENT"],
      [records, (d) => { d.criterionSources.voltageRange = OUTDOOR_ID; }, "CRITERION_NOT_IN_SOURCE"],
      [records, (d) => { delete d.criterionSources.noninvasiveCriterion; }, "NONINVASIVE_CRITERION_UNACCOUNTED"],
      [records, (d) => { d.review.reviewedBy = "binding-curator-test"; }, "BINDING_REVIEW_NOT_INDEPENDENT_OF_TRANSCRIPTION"],
      [[...records, listing], (d) => { d.criterionSources.ambientEnvelope = listing.recordId; }, "CRITERION_FROM_CERTIFICATION_LISTING"],
    ];
    for (const [set, patch, reason] of cases) {
      const b = binding(set, patch);
      const registry = registryOf(set, [b]);
      expect(registry.available).toBe(false);
      expect(registry.rejections.map((item) => item.reason.split(":")[0])).toContain(reason);
    }
    const second = binding(records, (d) => { d.bindingId = "NIRET-OEM-BIND-SYNTHETIC-2"; });
    const duplicate = registryOf(records, [hypotheticalBinding(records), second]);
    expect(duplicate.available).toBe(false);
    expect(duplicate.rejections[0]?.reason).toMatch(/^DUPLICATE_CURRENT_BINDING_FOR_SYSTEM/);
  });
  it("T100 source registration rejects non-independent or out-of-order review and missing reviewer", () => {
    expect(registrationFindings(outdoor((d) => { d.review.reviewedBy = "curator-test-1"; }))).toContain("REVIEW_NOT_INDEPENDENT_OF_TRANSCRIPTION");
    expect(registrationFindings(outdoor((d) => { d.review.reviewedAt = T("08:10"); }))).toContain("REVIEW_PRECEDES_TRANSCRIPTION");
    expect(registrationFindings(outdoor((d) => { d.review.reviewedBy = null; }))).toContain("REVIEW_IDENTITY_OR_TIME_MISSING");
    expect(registrationFindings(outdoor((d) => { d.review = { ...d.review, state: "PENDING_REVIEW", reviewedBy: null, reviewedAt: null }; }))).toEqual([]);
    expect(registrationFindings(outdoor((d) => { d.status.supersession = "SUPERSEDED"; }))).toContain("SUPERSEDED_WITHOUT_SUCCESSOR");
  });
  it("T100 source registration rejects overlapping or non-uniform candidates, unit mismatches and invalid bounds", () => {
    const withCandidates = (candidates: Array<{ id: string; odb?: [number | null, number | null]; rh?: [number, number]; unit?: string }>) => outdoor((d) => {
      if (d.criteria.noninvasiveCriterion?.status !== "PUBLISHED") throw new Error("fixture");
      d.criteria.noninvasiveCriterion.candidates = candidates.map(({ id, odb, rh, unit }) => ({
        candidateId: id, range: { min: 16, max: 21, unit: "F" }, cite: { pageRef: "16", tableOrChart: null },
        appliesWhen: [
          ...(odb ? [{ measurement: "outdoorDryBulb" as const, min: odb[0], max: odb[1], unit: (unit ?? "F") as "F", cite: { pageRef: "16", tableOrChart: null } }] : []),
          ...(rh ? [{ measurement: "returnRh" as const, min: rh[0], max: rh[1], unit: "PCT_RH" as const, cite: { pageRef: "16", tableOrChart: null } }] : []),
        ],
      })) as never;
    });
    expect(registrationFindings(withCandidates([{ id: "A", odb: [80, 95] }, { id: "B", odb: [95, 105] }]))).toEqual([]);
    expect(registrationFindings(withCandidates([{ id: "A", odb: [80, 95] }, { id: "B", odb: [90, 105] }]))).toContain("CANDIDATE_BANDS_OVERLAP:noninvasiveCriterion:A/B");
    expect(registrationFindings(withCandidates([{ id: "A" }, { id: "B" }]))).toContain("CANDIDATE_BANDS_OVERLAP:noninvasiveCriterion:A/B");
    expect(registrationFindings(withCandidates([{ id: "A", odb: [80, 95] }, { id: "B", odb: [95, 105], rh: [40, 60] }]))).toContain("CANDIDATE_CONDITIONS_NOT_UNIFORM:noninvasiveCriterion:B");
    expect(registrationFindings(withCandidates([{ id: "A", odb: [80, 95], unit: "PCT_RH" }]))).toContain("UNIT_NOT_CONTRACT_UNIT:noninvasiveCriterion:A:outdoorDryBulb");
    expect(registrationFindings(withCandidates([{ id: "A", odb: [95, 80] }]))).toContain("BOUNDS_INVALID:noninvasiveCriterion:A:outdoorDryBulb");
    expect(registrationFindings(withCandidates([{ id: "A", odb: [65, null] }]))).toContain("BOUNDS_INVALID:noninvasiveCriterion:A:outdoorDryBulb");
    expect(registrationFindings(indoor((d) => { d.criteria.airflowCriteria = [{ kind: "CFM_RANGE", range: { min: 1050, max: 1300, unit: "F", cite: { pageRef: "9", tableOrChart: null } } }]; })))
      .toContain("UNIT_NOT_CONTRACT_UNIT:airflowCriteria:0");
    expect(registrationFindings(outdoor((d) => { d.criteria.ambientEnvelope = { ...d.criteria.ambientEnvelope!, min: 120 }; }))).toContain("BOUNDS_INVALID:ambientEnvelope");
  });
  it("T120 registration rejects AHRI listings with criteria, undefined approach derivations, stated bounds beside a derivation, and uncited unbounded sides", () => {
    expect(registrationFindings(ahriListing())).toEqual([]);
    expect(registrationFindings(ahriListing((d) => { d.criteria = { minRunMinutes: { value: 20, cite: { pageRef: "1", tableOrChart: null } } }; }))).toContain("CERTIFICATION_LISTING_CARRIES_CRITERIA");
    expect(registrationFindings(ahriListing((d) => { d.ahriReference = null; }))).toContain("CERTIFICATION_LISTING_WITHOUT_REFERENCE");
    expect(registrationFindings(outdoor((d) => { d.ahriReference = "X"; }))).toContain("AHRI_REFERENCE_ON_NON_LISTING_SOURCE");
    const approach = outdoor((d) => {
      d.criteria.noninvasiveCriterion = {
        status: "PUBLISHED", derivation: { kind: "LIQUID_LINE_MINUS_OUTDOOR_DRY_BULB" }, coverage: "PARTIAL",
        lookup: { interpolationRequired: false, calculationRequired: false, unrepresentedConditions: [] },
        candidates: [{ candidateId: "APP-1", appliesWhen: [], range: { min: null, max: null, unit: "F", cite: { pageRef: "34", tableOrChart: "Table 4" },
          derivation: { form: "TOLERANCE_BAND", nominal: { value: 9, cite: { pageRef: "34", tableOrChart: "Table 4" } }, tolerance: { value: 1, cite: { pageRef: "34", tableOrChart: "Table 4" } } } } }],
      };
    });
    expect(registrationFindings(approach)).toContain("DERIVATION_NOT_DEFINED_BY_OEM:noninvasiveCriterion");
    const defined = outdoor((d) => { d.criteria.noninvasiveCriterion = { ...(approach.criteria.noninvasiveCriterion as object), definitionCite: { pageRef: "34", tableOrChart: "note 3" } } as never; });
    expect(registrationFindings(defined)).toEqual([]);
    const statedAndDerived = outdoor((d) => {
      const criterion = defined.criteria.noninvasiveCriterion as { candidates: Array<{ range: { min: number | null } }> };
      d.criteria.noninvasiveCriterion = JSON.parse(JSON.stringify(criterion));
      (d.criteria.noninvasiveCriterion as typeof criterion).candidates[0]!.range.min = 8;
    });
    expect(registrationFindings(statedAndDerived)).toContain("BOUNDS_INVALID:noninvasiveCriterion:APP-1");
    const unbounded = outdoor((d) => { d.criteria.ambientEnvelope = { min: 65, max: null, unit: "F", cite: { pageRef: "31", tableOrChart: "Fig. 19" }, unbounded: { side: "MAX", cite: { pageRef: "31", tableOrChart: "Fig. 19" } } }; });
    expect(registrationFindings(unbounded)).toEqual([]);
    expect(registrationFindings(outdoor((d) => { d.criteria.ambientEnvelope = { min: 65, max: null, unit: "F", cite: { pageRef: "31", tableOrChart: null } }; })))
      .toContain("BOUNDS_INVALID:ambientEnvelope");
  });
});

describe("A7/A8 resolution, binding conflicts and projection (T101, T102, T105, T107)", () => {
  it("T101 resolution is exact and never resolves unreviewed, rejected or superseded bindings as VERIFIED", () => {
    const registry = hypotheticalRegistry();
    expect(resolveOemReference(registry, { manufacturer: " exampleco ", indoorModel: "ah-100", outdoorModel: "CU-200 " }).status).toBe("RESOLVED");
    for (const equipment of [{ ...SYSTEM, outdoorModel: "CU200" }, { ...SYSTEM, manufacturer: "OtherCo" }, { ...SYSTEM, indoorModel: undefined }]) {
      expect(resolveOemReference(registry, equipment).status).toBe("NO_RECORD");
    }
    const records = [outdoorRecord(), indoorRecord()];
    const pending = registryOf(records, [binding(records, (d) => { d.review = { ...d.review, state: "PENDING_REVIEW", reviewedBy: null, reviewedAt: null }; })]);
    expect(resolveOemReference(pending, SYSTEM)).toEqual({ status: "NOT_VERIFIED", bindingId: BINDING_ID });
    expect(evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(pending)).receipt.reason_codes).toContain("OEM_REFERENCE_NOT_VERIFIED");
    const rejected = registryOf(records, [binding(records, (d) => { d.review.state = "REJECTED"; })]);
    expect(resolveOemReference(rejected, SYSTEM).status).toBe("NO_RECORD");
    const superseded = registryOf(records, [binding(records, (d) => { d.status = { supersession: "SUPERSEDED", supersededBy: "NIRET-OEM-BIND-SYNTHETIC-2", supersedes: [] }; })]);
    expect(resolveOemReference(superseded, SYSTEM).status).toBe("NO_RECORD");
  });
  it("T106 a superseded or unreviewed constituent source keeps the binding from supporting ALLOW", () => {
    const supersededIndoor = indoor((d) => { d.status = { supersession: "SUPERSEDED", supersededBy: "NIRET-OEM-SYNTHETIC-INDOOR-2", supersedes: [] }; });
    const pendingIndoor = indoor((d) => { d.review = { ...d.review, state: "PENDING_REVIEW", reviewedBy: null, reviewedAt: null }; });
    for (const [constituent, reason] of [[supersededIndoor, "OEM_REFERENCE_SUPERSEDED"], [pendingIndoor, "OEM_SOURCE_NOT_VERIFIED"]] as const) {
      const records = [outdoorRecord(), constituent];
      const { receipt } = evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(registryOf(records, [hypotheticalBinding(records)])));
      expect(receipt.determination).toBe("HOLD");
      expect(receipt.reason_codes).toContain(reason);
    }
  });
  it("T105 conflicting pairing or criterion values across bound sources -> HOLD(OEM_BINDING_CONFLICT); nothing is reconciled", () => {
    const wrongPairing = outdoor((d) => { d.matchedSystems = [{ ...d.matchedSystems[0]!, indoorModel: "AH-999" }]; });
    const conflictingValue = indoor((d) => { d.criteria.measurementLocations = { ...d.criteria.measurementLocations, returnDryBulb: { location: "RETURN_DUCT", oemText: "return duct", cite: { pageRef: "9", tableOrChart: null } } }; });
    for (const [records, expected] of [
      [[wrongPairing, indoorRecord()], `PAIRING_SOURCE_DOES_NOT_LIST_SYSTEM:${OUTDOOR_ID}`],
      [[outdoorRecord(), conflictingValue], "CRITERION_CONFLICT:measurementLocations.returnDryBulb"],
    ] as const) {
      const registry = registryOf([...records], [hypotheticalBinding([...records])]);
      expect(registry.available).toBe(true);
      expect(resolveOemReference(registry, SYSTEM)).toMatchObject({ status: "CONFLICT", conflicts: [expected] });
      const { receipt } = evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(registry));
      expect(receipt.determination).toBe("HOLD");
      expect(receipt.reason_codes).toEqual(expect.arrayContaining(["OEM_BINDING_CONFLICT", "PAIRING_NOT_ESTABLISHED_BY_GOVERNED_OEM_RECORD"]));
      expect(receipt.oem_reference_provenance).toMatchObject({ conflicts: [expected], established: false });
    }
  });
  it("T107 a verified AHRI listing may establish the pairing; OEM documents still supply every criterion", () => {
    const listing = ahriListing();
    const noPairingOutdoor = outdoor((d) => { d.matchedSystems = []; });
    const records = [noPairingOutdoor, indoorRecord(), listing];
    const b = binding(records, (d) => { d.pairingSources = [listing.recordId]; });
    const { receipt } = evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(registryOf(records, [b])));
    expect(receipt.determination).toBe("ALLOW");
    expect(receipt.oem_reference_provenance).toMatchObject({ pairing_sources: [listing.recordId] });
    const criterionSources = (receipt.oem_reference_provenance as { criterion_sources: Record<string, string> }).criterion_sources;
    expect(Object.values(criterionSources)).not.toContain(listing.recordId);
  });
  it("T102/T104 a resolved multi-source binding replaces every submitted OEM value; each source keeps its own provenance", () => {
    const registry = hypotheticalRegistry();
    const records = [outdoorRecord(), indoorRecord()];
    const b = hypotheticalBinding(records);
    const prepared = applyServerEvidence(stampEvaluatedAt(submission(), SERVER_NOW.toISOString()), sourcesWith(registry)) as { oem: unknown };
    expect(prepared.oem).toEqual(projectBinding(b, sha256Canonical(b), records.map((record) => ({ record, recordHash: sha256Canonical(record) }))));
    const { receipt } = evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(registry));
    expect(receipt.determination).toBe("ALLOW");
    const provenance = receipt.oem_reference_provenance as { sources: Array<Record<string, unknown>>; criterion_sources: Record<string, string> };
    expect(receipt.oem_reference_provenance).toMatchObject({
      acquisition_method: "GOVERNED_LIBRARY", verification: "VERIFIED", established: true,
      record_id: BINDING_ID, record_hash: sha256Canonical(b), verified_by: "BINDING-REVIEWER-TEST", pairing_sources: [OUTDOOR_ID],
    });
    expect(provenance.sources.map((source) => [source.recordId, source.sourceClass, source.documentHash])).toEqual([
      [OUTDOOR_ID, "OEM_OUTDOOR_UNIT_INSTRUCTIONS", records[0]!.document.sha256],
      [INDOOR_ID, "OEM_INDOOR_UNIT_FAN_PERFORMANCE", records[1]!.document.sha256],
    ]);
    expect(provenance.criterion_sources).toMatchObject({ airflowCriteria: INDOOR_ID, chargingMethod: OUTDOOR_ID, "measurementLocations.returnStatic": INDOOR_ID });
    expect(receipt.oem_document_refs).toContain("PD-AH-SYN rev B · p. 9 · Blower table 3 (synthetic)");
    expect(JSON.stringify(receipt)).not.toContain('"tech"');
    expect(receipt.gate_b_authorized).toBe(false);
  });
  it("T102 the pinned binding and sources plus the prepared evidence reproduce the same receipt (replay)", () => {
    const sources = sourcesWith(hypotheticalRegistry());
    const prepared = applyServerEvidence(stampEvaluatedAt(submission(), SERVER_NOW.toISOString()), sources) as Record<string, unknown>;
    const records = [outdoorRecord(), indoorRecord()];
    const b = hypotheticalBinding(records);
    const replayed = runGateA({ ...prepared, oem: projectBinding(b, sha256Canonical(b), records.map((record) => ({ record, recordHash: sha256Canonical(record) }))) }).receipt;
    expect(replayed.content_hash).toBe(evaluateNiretSubmission(submission(), SERVER_NOW, sources).receipt.content_hash);
  });
  it("T102 the technician result shows the binding, each bound document, and the OEM measurement locations", () => {
    const sources = sourcesWith(hypotheticalRegistry());
    const { receipt, findings, oemReference } = evaluateNiretSubmission(submission(), SERVER_NOW, sources);
    const response: EvaluationResponse = { receipt: receipt as unknown as ReceiptLike & Record<string, unknown>, findings, context: submissionContext(sources, oemReference) };
    const html = renderToStaticMarkup(createElement(DeterminationPanel, { response, nominalCapacityBtuh: "" }));
    expect(html).toContain("A governed OEM system binding was used. Your manual OEM entries were not used.");
    expect(html).toContain(BINDING_ID);
    expect(html).toContain("OEM_INDOOR_UNIT_FAN_PERFORMANCE · ExampleCo · PD-AH-SYN");
    expect(html).toContain("CONDENSER_INLET (condenser air inlet (synthetic))");
    const none = evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(GOVERNED_OEM_REGISTRY));
    const noneHtml = renderToStaticMarkup(createElement(DeterminationPanel, {
      response: { receipt: none.receipt as unknown as ReceiptLike & Record<string, unknown>, findings: none.findings, context: submissionContext(sources, none.oemReference) },
      nominalCapacityBtuh: "",
    }));
    expect(noneHtml).toContain("No governed OEM record covers this exact manufacturer and indoor/outdoor combination");
  });
});

describe("A7 technician transcription cannot manufacture OEM authority (T103)", () => {
  it("T103 a transcription yields only a non-authoritative curation request, which can never load as a registry record", () => {
    const form = emptyNiretForm();
    Object.assign(form.equipment, { manufacturer: "ExampleCo", indoorModel: "AH-100", outdoorModel: "CU-200" });
    Object.assign(form.oem, { manufacturer: "ExampleCo", document: "IOM", revision: "A", section: "p. 16", sourceRef: "file://iom.pdf" });
    const request = buildCurationRequest(form, T("10:20"));
    expect(request).toMatchObject({
      kind: "NIRET_OEM_CURATION_REQUEST", authoritative: false, verification: "NOT_VERIFIED",
      equipment: { manufacturer: "ExampleCo", indoorModel: "AH-100", outdoorModel: "CU-200" },
    });
    expect(JSON.stringify(request)).not.toMatch(/"VERIFIED"|GOVERNED_LIBRARY/);
    const asRecord = loadOemRegistry([request], [], { records: { undefined: sha256Canonical(request) }, bindings: {} });
    expect(asRecord.available).toBe(false);
    expect(asRecord.rejections.map((item) => item.reason.split(":")[0])).toContain("SCHEMA_INVALID");
  });
  it("T103 a manual transcription, even claiming GOVERNED_LIBRARY/VERIFIED, cannot satisfy P14 or P01 on the server path", () => {
    const form = emptyNiretForm();
    Object.assign(form.equipment, { manufacturer: "ExampleCo", indoorModel: "AH-100", outdoorModel: "CU-200" });
    const input = buildGateAInput(form, { requestId: "REQ-T103" }) as { oem: { provenance: unknown } };
    expect(input.oem.provenance).toMatchObject({ acquisitionMethod: "MANUAL_TRANSCRIPTION", verification: "NOT_VERIFIED" });
    for (const registry of [GOVERNED_OEM_REGISTRY, null]) {
      const { receipt } = evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(registry));
      expect(receipt.determination).not.toBe("ALLOW");
      expect(receipt.oem_reference_provenance).toMatchObject({ acquisition_method: "MANUAL_TRANSCRIPTION", verified_by: null, established: false });
      expect((receipt.unresolved_propositions as Array<{ proposition: string }>).map((item) => item.proposition)).toEqual(expect.arrayContaining(["P01", "P14"]));
    }
  });
});

describe("A9 fan-performance data in governed sources (T123 registry side)", () => {
  const cite = { pageRef: "6", tableOrChart: "Blower performance (synthetic)" };
  const fan = (patch: Record<string, unknown> = {}) => indoor((d) => {
    d.criteria.fanPerformance = {
      convention: { text: "measured external to unit with dry coil (synthetic)", cite },
      designatedSetting: null,
      settings: [{ setting: "High", coolingPermitted: true, cite, points: [{ esp: 0.1, cfm: 1300 }, { esp: 0.5, cfm: 1100 }] }],
      ...patch,
    } as never;
  });
  it("registration rejects duplicate ESP points and a designated setting not published for cooling", () => {
    expect(registrationFindings(fan())).toEqual([]);
    expect(registrationFindings(fan({ settings: [{ setting: "High", coolingPermitted: true, cite, points: [{ esp: 0.1, cfm: 1300 }, { esp: 0.1, cfm: 1250 }] }] })))
      .toContain("FAN_ESP_DUPLICATED:High");
    expect(registrationFindings(fan({ designatedSetting: { setting: "Low", cite } }))).toContain("FAN_DESIGNATED_SETTING_NOT_PUBLISHED_FOR_COOLING");
  });
  it("a bound fan-performance source projects exactly its published values with citations", () => {
    const records = [outdoorRecord(), fan()];
    const b = binding(records, (d) => { d.criterionSources.fanPerformance = INDOOR_ID; });
    const resolution = resolveOemReference(registryOf(records, [b]), SYSTEM);
    expect(resolution.status).toBe("RESOLVED");
    const reference = (resolution as { reference: { fanPerformance: unknown } }).reference;
    expect(reference.fanPerformance).toEqual({
      ref: "PD-AH-SYN rev B · p. 6 · Blower performance (synthetic) | High: PD-AH-SYN rev B · p. 6 · Blower performance (synthetic)",
      convention: "measured external to unit with dry coil (synthetic)", designatedSetting: null,
      settings: [{ setting: "High", coolingPermitted: true, points: [{ esp: 0.1, cfm: 1300 }, { esp: 0.5, cfm: 1100 }] }],
    });
  });
});

describe("A10 (C1-R7) historical AHRI listing evidence (T133-T135)", () => {
  it("T133 an AHRI listing must carry structured listing evidence whose certification flag matches its present status", () => {
    expect(registrationFindings(ahriListing())).toEqual([]);
    expect(registrationFindings(ahriListing((d) => { d.ahriListing = null; }))).toContain("AHRI_LISTING_EVIDENCE_MISSING");
    expect(registrationFindings(ahriListing((d) => { d.ahriListing = { ...d.ahriListing!, certifiedAtObservation: true }; }))).toContain("AHRI_CERTIFICATION_STATUS_MISREPRESENTED");
    expect(registrationFindings(ahriListing((d) => { d.ahriListing = { ...d.ahriListing!, presentStatus: "PRODUCTION_STOPPED", certifiedAtObservation: true }; }))).toEqual([]);
    expect(registrationFindings(ahriListing((d) => { d.ahriListing = { ...d.ahriListing!, referenceNumber: "OTHER" }; }))).toContain("AHRI_LISTING_REFERENCE_MISMATCH");
    expect(registrationFindings(ahriListing((d) => { d.ahriListing = { ...d.ahriListing!, listedIndoorModel: "AH-999" }; }))).toContain("AHRI_LISTED_COMBINATION_NOT_IN_MATCHED_SYSTEMS");
    expect(registrationFindings(outdoor((d) => { d.ahriListing = ahriListing().ahriListing; }))).toContain("AHRI_LISTING_ON_NON_LISTING_SOURCE");
  });
  it("T134 a Discontinued (historical) listing may establish pairing; its present status is preserved and never shown as currently certified", () => {
    const listing = ahriListing();
    const records = [outdoor((d) => { d.matchedSystems = []; }), indoorRecord(), listing];
    const b = binding(records, (d) => { d.pairingSources = [listing.recordId]; });
    const sources = sourcesWith(registryOf(records, [b]));
    const { receipt, findings, oemReference } = evaluateNiretSubmission(submission(), SERVER_NOW, sources);
    expect(receipt.determination).toBe("ALLOW");
    const ahriSource = (receipt.oem_reference_provenance as { sources: Array<Record<string, unknown>> }).sources.find((s) => s.recordId === listing.recordId);
    expect(ahriSource).toMatchObject({ sourceClass: "AHRI_CERTIFICATION_LISTING", ahriPresentStatus: "DISCONTINUED", ahriCertifiedAtObservation: false });
    const html = renderToStaticMarkup(createElement(DeterminationPanel, {
      response: { receipt: receipt as unknown as ReceiptLike & Record<string, unknown>, findings, context: submissionContext(sources, oemReference) }, nominalCapacityBtuh: "",
    }));
    expect(html).toContain("AHRI present status DISCONTINUED (historical listing; not currently AHRI certified)");
    expect(html).not.toContain("(currently certified)");
  });
  it("T135 historical AHRI evidence never supplies criteria", () => {
    const listing = ahriListing((d) => { d.criteria = { minRunMinutes: { value: 20, cite: { pageRef: "1", tableOrChart: null } } }; });
    expect(registrationFindings(listing)).toContain("CERTIFICATION_LISTING_CARRIES_CRITERIA");
  });
});
