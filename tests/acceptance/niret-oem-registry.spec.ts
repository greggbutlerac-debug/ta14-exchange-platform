import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { sha256Canonical } from "../../packages/crypto/receipts.js";
import { runGateA } from "../../packages/domain/niret/index.js";
import manifest from "../../packages/domain/niret/oem-registry/manifest.json";
import { REGISTERED_RECORDS } from "../../packages/domain/niret/oem-registry/records.js";
import {
  GOVERNED_OEM_REGISTRY, loadOemRegistry, projectRecord, registrationFindings, resolveOemReference, type OemReferenceRecord,
} from "../../packages/domain/niret/oem-registry/index.js";
import { DeterminationPanel, type EvaluationResponse } from "../../apps/web/components/niret/NiretResult";
import { buildCurationRequest } from "../../apps/web/lib/niret/curation-request";
import { buildGateAInput } from "../../apps/web/lib/niret/evidence-adapter";
import { emptyNiretForm } from "../../apps/web/lib/niret/form-state";
import type { ReceiptLike } from "../../apps/web/lib/niret/presentation";
import {
  applyServerEvidence, evaluateNiretSubmission, NO_SOURCES, stampEvaluatedAt, submissionContext, type EvaluationSources,
} from "../../apps/web/lib/niret/server-evaluate";
import { hypotheticalRecord, hypotheticalRegistry, manifestFor } from "./fixtures/niret-hypothetical-oem-record";

/*
 * Every OEM record in this file is a HYPOTHETICAL, SYNTHETIC test fixture
 * (see fixtures/niret-hypothetical-oem-record.ts). None is a real manufacturer
 * record and none is registered in the governed registry.
 */

const T = (hhmm: string) => `2026-09-27T${hhmm}:00Z`;
const SERVER_NOW = new Date(T("10:30"));
const SYSTEM = { manufacturer: "ExampleCo", indoorModel: "AH-100", outdoorModel: "CU-200" };

const record = (patch: (draft: OemReferenceRecord) => void = () => {}) => {
  const draft = hypotheticalRecord();
  patch(draft);
  return draft;
};

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
        [key, { value, unit, accuracy, location, instrumentId, measuredAt: T("10:25"), provenance: "MANUAL" }])),
    },
    // A technician transcription that disagrees with the record: the server must not use it when a record resolves.
    oem: {
      documentRefs: ["technician transcription"],
      provenance: { acquisitionMethod: "GOVERNED_LIBRARY", verification: "VERIFIED", verifiedBy: "ME", verifiedAt: T("09:00"), manufacturer: "ExampleCo" },
      chargingMethod: { status: "IDENTIFIED", ref: "tech" },
      requiresUnavailableToolOrMode: false,
      airflowRange: { min: 1190, max: 1250, unit: "CFM", ref: "tech" },
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

describe("A7 governed OEM registry — shipped state (T98)", () => {
  it("T98 the shipped registry is empty, pins no record, and resolves nothing", () => {
    expect(REGISTERED_RECORDS).toEqual([]);
    expect(manifest.records).toEqual({});
    expect(GOVERNED_OEM_REGISTRY).toEqual({ available: true, records: [], rejections: [] });
    expect(resolveOemReference(GOVERNED_OEM_REGISTRY, SYSTEM)).toEqual({ status: "NO_RECORD" });
    // No OEM criterion value ships with the registry source.
    const source = ["registry.ts", "index.ts", "records.ts"].map((file) =>
      readFileSync(new URL(`../../packages/domain/niret/oem-registry/${file}`, import.meta.url), "utf8")).join("\n");
    expect(source).not.toMatch(/"?(min|max|value)"?\s*:\s*\d/);
  });
  it("T98 with the shipped registry, the complete technical evidence set cannot reach ALLOW", () => {
    const { receipt } = evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(GOVERNED_OEM_REGISTRY));
    expect(receipt.determination).toBe("HOLD");
    expect(receipt.reason_codes).toEqual(expect.arrayContaining(["OEM_REFERENCE_NOT_VERIFIED", "PAIRING_NOT_ESTABLISHED_BY_GOVERNED_OEM_RECORD"]));
  });
});

describe("A7 registry integrity and registration (T99, T100)", () => {
  it("T99 a record whose hash is not pinned, a dangling manifest entry, or a schema-invalid record makes the registry unavailable", () => {
    const good = hypotheticalRecord();
    const tampered = record((draft) => { draft.criteria.airflowRange = { ...draft.criteria.airflowRange!, max: 1400 }; });
    const cases = [
      loadOemRegistry([tampered], manifestFor([good])),
      loadOemRegistry([], manifestFor([good])),
      loadOemRegistry([{ ...good, extra: true }], manifestFor([good])),
      loadOemRegistry([good, hypotheticalRecord()], manifestFor([good])),
    ];
    for (const registry of cases) {
      expect(registry.available).toBe(false);
      expect(resolveOemReference(registry, SYSTEM).status).toBe("REGISTRY_UNAVAILABLE");
    }
    expect(cases.map((registry) => registry.rejections[0]?.reason.split(":")[0])).toEqual([
      "RECORD_HASH_NOT_PINNED_IN_MANIFEST", "MANIFEST_ENTRY_WITHOUT_RECORD", "SCHEMA_INVALID", "RECORD_ID_DUPLICATED",
    ]);
  });
  it("T99 an unavailable registry -> OEM VERIFICATION_UNAVAILABLE -> P14 ESCALATE; nothing from it is relied on", () => {
    const broken = loadOemRegistry([record((draft) => { draft.recordVersion = 2; })], manifestFor([hypotheticalRecord()]));
    const { receipt } = evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(broken));
    expect(receipt.determination).toBe("ESCALATE");
    expect(receipt.reason_codes).toContain("OEM_REFERENCE_VERIFICATION_UNAVAILABLE");
    expect(receipt.oem_reference_provenance).toMatchObject({ acquisition_method: "MANUAL_TRANSCRIPTION", verification: "VERIFICATION_UNAVAILABLE", record_id: null });
  });
  it("T100 registration rejects non-independent or out-of-order review and missing reviewer", () => {
    expect(registrationFindings(record((d) => { d.review.reviewedBy = "curator-test-1"; }))).toContain("REVIEW_NOT_INDEPENDENT_OF_TRANSCRIPTION");
    expect(registrationFindings(record((d) => { d.review.reviewedAt = T("08:10"); }))).toContain("REVIEW_PRECEDES_TRANSCRIPTION");
    expect(registrationFindings(record((d) => { d.review.reviewedBy = null; }))).toContain("REVIEW_IDENTITY_OR_TIME_MISSING");
    expect(registrationFindings(record((d) => { d.review = { ...d.review, state: "PENDING_REVIEW", reviewedBy: null, reviewedAt: null }; }))).toEqual([]);
  });
  it("T100 registration rejects overlapping or non-uniform candidates, unit mismatches and inverted bounds", () => {
    const withCandidates = (candidates: Array<{ id: string; odb?: [number, number]; rh?: [number, number]; unit?: string }>) => record((d) => {
      if (d.criteria.noninvasiveCriterion.status !== "PUBLISHED") throw new Error("fixture");
      d.criteria.noninvasiveCriterion.candidates = candidates.map(({ id, odb, rh, unit }) => ({
        candidateId: id, range: { min: 16, max: 21, unit: "F" }, cite: { pageRef: "16", tableOrChart: null },
        appliesWhen: [
          ...(odb ? [{ measurement: "outdoorDryBulb" as const, min: odb[0], max: odb[1], unit: (unit ?? "F") as "F", cite: { pageRef: "16", tableOrChart: null } }] : []),
          ...(rh ? [{ measurement: "returnRh" as const, min: rh[0], max: rh[1], unit: "PCT_RH" as const, cite: { pageRef: "16", tableOrChart: null } }] : []),
        ],
      }));
    });
    expect(registrationFindings(withCandidates([{ id: "A", odb: [80, 95] }, { id: "B", odb: [95, 105] }]))).toEqual([]);
    expect(registrationFindings(withCandidates([{ id: "A", odb: [80, 95] }, { id: "B", odb: [90, 105] }]))).toContain("CANDIDATE_BANDS_OVERLAP:A/B");
    expect(registrationFindings(withCandidates([{ id: "A" }, { id: "B" }]))).toContain("CANDIDATE_BANDS_OVERLAP:A/B");
    expect(registrationFindings(withCandidates([{ id: "A", odb: [80, 95] }, { id: "B", odb: [95, 105], rh: [40, 60] }]))).toContain("CANDIDATE_CONDITIONS_NOT_UNIFORM:B");
    expect(registrationFindings(withCandidates([{ id: "A", odb: [80, 95], unit: "PCT_RH" }]))).toContain("UNIT_NOT_CONTRACT_UNIT:A:outdoorDryBulb");
    expect(registrationFindings(withCandidates([{ id: "A", odb: [95, 80] }]))).toContain("BOUNDS_INVERTED:A:outdoorDryBulb");
    expect(registrationFindings(record((d) => { d.criteria.airflowRange = { ...d.criteria.airflowRange!, unit: "F" }; }))).toContain("UNIT_NOT_CONTRACT_UNIT:airflowRange");
    expect(registrationFindings(record((d) => { d.criteria.espRange = { ...d.criteria.espRange!, min: 0.9 }; }))).toContain("BOUNDS_INVERTED:espRange");
  });
  it("T100 registration rejects duplicate CURRENT records for one system and SUPERSEDED without a successor", () => {
    const second = record((d) => { d.recordId = "NIRET-OEM-SYNTHETIC-FIXTURE-2"; });
    const duplicate = hypotheticalRegistry([hypotheticalRecord(), second]);
    expect(duplicate.available).toBe(false);
    expect(duplicate.rejections[0]?.reason).toMatch(/^DUPLICATE_CURRENT_RECORD_FOR_SYSTEM/);
    expect(registrationFindings(record((d) => { d.status.supersession = "SUPERSEDED"; }))).toContain("SUPERSEDED_WITHOUT_SUCCESSOR");
  });
});

describe("A7 resolution and projection (T101, T102)", () => {
  it("T101 resolution is exact (case and whitespace only) and never resolves unreviewed, rejected or superseded records as VERIFIED", () => {
    const registry = hypotheticalRegistry();
    expect(resolveOemReference(registry, { manufacturer: " exampleco ", indoorModel: "ah-100", outdoorModel: "CU-200 " }).status).toBe("RESOLVED");
    for (const equipment of [
      { ...SYSTEM, outdoorModel: "CU200" }, { ...SYSTEM, outdoorModel: "CU-2" }, { ...SYSTEM, manufacturer: "OtherCo" },
      { ...SYSTEM, indoorModel: undefined },
    ]) expect(resolveOemReference(registry, equipment).status).toBe("NO_RECORD");

    const pending = hypotheticalRegistry([record((d) => { d.review = { ...d.review, state: "PENDING_REVIEW", reviewedBy: null, reviewedAt: null }; })]);
    expect(resolveOemReference(pending, SYSTEM)).toEqual({ status: "NOT_VERIFIED", recordId: "NIRET-OEM-SYNTHETIC-FIXTURE-1" });
    const rejected = hypotheticalRegistry([record((d) => { d.review.state = "REJECTED"; })]);
    expect(resolveOemReference(rejected, SYSTEM).status).toBe("NO_RECORD");

    const old = record((d) => { d.status = { supersession: "SUPERSEDED", supersededBy: "NIRET-OEM-SYNTHETIC-FIXTURE-2", supersedes: [] }; });
    const successor = record((d) => { d.recordId = "NIRET-OEM-SYNTHETIC-FIXTURE-2"; d.document.revision = "B"; d.status.supersedes = ["NIRET-OEM-SYNTHETIC-FIXTURE-1"]; });
    const resolved = resolveOemReference(hypotheticalRegistry([old, successor]), SYSTEM);
    expect(resolved).toMatchObject({ status: "RESOLVED", recordId: "NIRET-OEM-SYNTHETIC-FIXTURE-2" });
    expect(resolveOemReference(hypotheticalRegistry([old]), SYSTEM).status).toBe("NO_RECORD");

    const pendingForm = { ...submission() };
    expect(evaluateNiretSubmission(pendingForm, SERVER_NOW, sourcesWith(pending)).receipt.reason_codes).toContain("OEM_REFERENCE_NOT_VERIFIED");
  });
  it("T102 a resolved hypothetical record replaces every submitted OEM value and all client-asserted provenance", () => {
    const registry = hypotheticalRegistry();
    const prepared = applyServerEvidence(stampEvaluatedAt(submission(), SERVER_NOW.toISOString()), sourcesWith(registry)) as { oem: unknown };
    const fixture = hypotheticalRecord();
    expect(prepared.oem).toEqual(projectRecord(fixture, sha256Canonical(fixture)));
    const { receipt } = evaluateNiretSubmission(submission(), SERVER_NOW, sourcesWith(registry));
    // The technician's (wrong) airflow range and criterion were not used: the record's were.
    expect(receipt.determination).toBe("ALLOW");
    expect(receipt.oem_reference_provenance).toMatchObject({
      acquisition_method: "GOVERNED_LIBRARY", verification: "VERIFIED", established: true,
      record_id: "NIRET-OEM-SYNTHETIC-FIXTURE-1", record_hash: sha256Canonical(fixture),
      document_hash: fixture.document.sha256, verified_by: "OEM-REVIEWER-TEST", transcribed_by: "CURATOR-TEST-1",
    });
    expect(receipt.oem_criterion_selection).toEqual({
      status: "SELECTED", candidateId: "TD-1", interpolation_performed: false,
      range: { min: 16, max: 21, unit: "F", ref: "IOM-SYN rev A · p. 16 · Figure 9 (synthetic)" },
    });
    expect(receipt.oem_document_refs).toContain("IOM-SYN rev A · p. 9 · Blower table 3 (synthetic)");
    expect(JSON.stringify(receipt)).not.toContain('"tech"');
    expect(receipt.gate_b_authorized).toBe(false);
  });
  it("T102 the pinned record plus the prepared evidence reproduce the same receipt (replay)", () => {
    const sources = sourcesWith(hypotheticalRegistry());
    const prepared = applyServerEvidence(stampEvaluatedAt(submission(), SERVER_NOW.toISOString()), sources) as Record<string, unknown>;
    const fixture = hypotheticalRecord();
    // Replay: rebuild the OEM input solely from the pinned record, then re-run the frozen engine.
    const replayed = runGateA({ ...prepared, oem: projectRecord(fixture, sha256Canonical(fixture)) }).receipt;
    expect(replayed.content_hash).toBe(evaluateNiretSubmission(submission(), SERVER_NOW, sources).receipt.content_hash);
  });
  it("T102 the technician result shows which governed record was used, and its OEM measurement locations", () => {
    const sources = sourcesWith(hypotheticalRegistry());
    const { receipt, findings, oemReference } = evaluateNiretSubmission(submission(), SERVER_NOW, sources);
    const response: EvaluationResponse = { receipt: receipt as unknown as ReceiptLike & Record<string, unknown>, findings, context: submissionContext(sources, oemReference) };
    const html = renderToStaticMarkup(createElement(DeterminationPanel, { response, nominalCapacityBtuh: "" }));
    expect(html).toContain("A governed OEM record was used. Your manual OEM entries were not used.");
    expect(html).toContain("NIRET-OEM-SYNTHETIC-FIXTURE-1");
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
    const asRecord = loadOemRegistry([request], { records: { [String((request as unknown as { recordId?: string }).recordId)]: sha256Canonical(request) } });
    expect(asRecord.available).toBe(false);
    expect(asRecord.rejections[0]?.reason).toMatch(/^SCHEMA_INVALID/);
  });
  it("T103 a manual transcription, even claiming GOVERNED_LIBRARY/VERIFIED, cannot satisfy P14 or P01 on the server path", () => {
    const form = emptyNiretForm();
    Object.assign(form.equipment, { manufacturer: "ExampleCo", indoorModel: "AH-100", outdoorModel: "CU-200" });
    const input = buildGateAInput(form, { requestId: "REQ-T103" }) as { oem: { provenance: unknown } };
    expect(input.oem.provenance).toMatchObject({ acquisitionMethod: "MANUAL_TRANSCRIPTION", verification: "NOT_VERIFIED" });
    for (const registry of [GOVERNED_OEM_REGISTRY, null]) {
      const forged = submission();
      const { receipt } = evaluateNiretSubmission(forged, SERVER_NOW, sourcesWith(registry));
      expect(receipt.determination).not.toBe("ALLOW");
      expect(receipt.oem_reference_provenance).toMatchObject({ acquisition_method: "MANUAL_TRANSCRIPTION", verified_by: null, established: false });
      expect((receipt.unresolved_propositions as Array<{ proposition: string }>).map((item) => item.proposition)).toEqual(expect.arrayContaining(["P01", "P14"]));
    }
  });
});
