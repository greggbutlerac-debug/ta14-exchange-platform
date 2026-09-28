import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020";
import { describe, expect, it, vi } from "vitest";
import { sha256Canonical } from "../../packages/crypto/receipts.js";
import { deriveDecision } from "../../packages/domain/state-machine.js";
import spec from "../../packages/domain/niret/gate-a-c1.spec.json";
import { FROZEN_SPEC_SHA256, frozenSpecSha256, runGateA } from "../../packages/domain/niret/index.js";
import { STATE_EVENT_TYPES } from "../../packages/domain/niret/invalidation.js";
import type { GateAInput, Measurement, StateEventType } from "../../packages/domain/niret/types.js";
import receiptSchema from "../../schemas/niret-gate-a-receipt.schema.json";

/*
 * All OEM ranges, run times and locations below are SYNTHETIC TEST FIXTURES
 * standing in for a model-specific OEM reference. They are not TA-14
 * thresholds and appear nowhere in the engine.
 */

const validateReceipt = new Ajv2020({ allErrors: true, strict: false }).compile(receiptSchema);
const T = (hhmm: string) => `2026-09-27T${hhmm}:00Z`;

/** Independent verification evidence (test double for a server-side verification source). */
const VERIFIED = () => ({ assurance: "DECLARED" as const, status: "VERIFIED" as const, verifier: "CERT-VERIFIER-SVC", reference: "VR-0001", verifiedAt: T("10:10") });

/** Independent, server-side authority establishment (test double for A5 sources). */
const ESTABLISHED = (finding: string) => ({ status: "ESTABLISHED" as const, finding, source: "DISPATCH-AUTHORITY-SVC", reference: `AUTH-${finding}`, establishedAt: T("09:45") });
const ALL_ESTABLISHED = () => ({
  identity: ESTABLISHED("MATCHES_DECLARED_TECHNICIAN"),
  workScope: ESTABLISHED("INCLUDES_DIAGNOSIS"),
  sitePermission: ESTABLISHED("GRANTED"),
  jurisdiction: ESTABLISHED("NOT_REQUIRED"),
});
/**
 * Provenance of a HYPOTHETICAL governed OEM system binding (A7/A8 test double) over two separately
 * preserved synthetic sources. "ExampleCo", its models, documents and hashes are synthetic: this is
 * not a real-world OEM record and is never registered in the governed registry.
 */
const OUTDOOR_SRC = "NIRET-OEM-SYNTHETIC-OUTDOOR";
const INDOOR_SRC = "NIRET-OEM-SYNTHETIC-INDOOR";
const SOURCE = (recordId: string, sourceClass: "OEM_OUTDOOR_UNIT_INSTRUCTIONS" | "OEM_INDOOR_UNIT_FAN_PERFORMANCE" | "OEM_PRODUCT_DATA" | "AHRI_CERTIFICATION_LISTING") => ({
  recordId, recordHash: sha256Canonical(`SYNTHETIC-${recordId}`), sourceClass,
  documentId: `DOC-${recordId}`, revision: "A", documentDate: "2026-01", documentHash: sha256Canonical(`SYNTHETIC-DOC-${recordId}`),
  sourceRef: `synthetic://${recordId}`, transcribedBy: "CURATOR-TEST-2", transcribedAt: T("09:10"),
  verification: "VERIFIED" as const, verifiedBy: "OEM-SOURCE-REVIEWER", verifiedAt: T("09:15"), supersession: "CURRENT" as const,
});
const VERIFIED_OEM = () => ({
  acquisitionMethod: "GOVERNED_LIBRARY" as const, verification: "VERIFIED" as const,
  manufacturer: "ExampleCo", verifiedBy: "OEM-LIBRARY-SVC", verifiedAt: T("09:40"),
  recordId: "NIRET-OEM-SYNTHETIC-TEST-1", recordHash: sha256Canonical("SYNTHETIC-TEST-RECORD"),
  matchedSystems: [{ indoorModel: "AH-100", outdoorModel: "CU-200" }],
  transcribedBy: "CURATOR-TEST-1", transcribedAt: T("09:20"), supersession: "CURRENT" as const,
  sources: [SOURCE(OUTDOOR_SRC, "OEM_OUTDOOR_UNIT_INSTRUCTIONS"), SOURCE(INDOOR_SRC, "OEM_INDOOR_UNIT_FAN_PERFORMANCE")],
  pairingSources: [OUTDOOR_SRC],
  criterionSources: { chargingMethod: OUTDOOR_SRC, airflowCriteria: INDOOR_SRC, espTableDomain: INDOOR_SRC, noninvasiveCriterion: OUTDOOR_SRC } as Record<string, string>,
});
/** A7 criterion shape: one condition-independent synthetic candidate. */
const CRITERION = () => ({
  status: "PUBLISHED" as const, derivation: { kind: "RETURN_MINUS_SUPPLY_DRY_BULB" as const },
  coverage: "PARTIAL" as const,
  lookup: { interpolationRequired: false, calculationRequired: false, unrepresentedConditions: [] as string[] },
  candidates: [{ candidateId: "TD-1", range: { min: 16, max: 21, unit: "F" as const, ref: "OEM-IOM-CU200:td" }, appliesWhen: [] as Array<{ measurement: "outdoorDryBulb" | "returnWetBulb"; min: number; max: number; unit: "F"; ref: string }> }],
});

function m(value: number, unit: Measurement["unit"], accuracy: number | undefined, location: string, instrumentId: string, at = "10:25"): Measurement {
  const measurement: Measurement = { value, unit, measuredAt: T(at), location, instrumentId, provenance: "MANUAL" };
  if (accuracy !== undefined) measurement.accuracy = accuracy;
  return measurement;
}

function baseline(): GateAInput {
  return {
    request: {
      requestId: "REQ-1", question: "REFRIGERANT_CHARGE",
      statedProposition: "Refrigerant charge condition requires pressure-side evidence",
      statedBasis: ["NONINVASIVE_EVIDENCE"], evaluatedAt: T("10:30"),
    },
    evidence: {
      recordId: "REC-1", pressureSideEntry: "NOT_PERFORMED",
      submittedBy: { accountId: "account-uuid-1", method: "AUTHENTICATED_SESSION" },
      authorityEstablishment: ALL_ESTABLISHED(),
      equipment: { manufacturer: "ExampleCo", indoorModel: "AH-100", outdoorModel: "CU-200", pairingVerifiedAgainstOem: true, configuration: "DUCTED_SPLIT", compressorStaging: "SINGLE_STAGE", verifiedAt: T("09:50") },
      mode: "COOLING",
      metering: { type: "TXV", evidenceBasis: "DIRECT_OBSERVATION", verifiedAt: T("09:55") },
      refrigerant: { declared: "R-410A", safetyClass: "A1", a2lMarkingsObserved: false, flammableRefrigerantLabelsObserved: false, integritySuspect: false },
      technician: { identity: "TECH-1", certification: { status: "CERTIFIED", type: "UNIVERSAL", certificateRef: "EPA608-0001", verification: VERIFIED() } },
      authorization: { workScopeRef: "WO-1", workScopeIncludesDiagnosis: true, sitePermission: "GRANTED", jurisdiction: "NOT_REQUIRED" },
      safety: { hazard: "NONE_IDENTIFIED" },
      instruments: ["THERMO-1", "MANO-1", "FLOW-1", "VOLT-1"].map((instrumentId) => ({ instrumentId, calibrationValid: true, setupVerified: true })),
      plannedPressureInstruments: [{ instrumentId: "GAUGE-1", ratedForRefrigerants: ["R-410A"], calibrationValid: true }],
      operation: { runStartedAt: T("10:00"), compressorRunningSteadily: true },
      events: [], corrections: [],
      evaporator: { iceStatus: "NO_ICE", iceObservedAt: T("10:24") },
      condenser: { panelsInPlace: true, coilCondition: "CLEAR", fanOperating: true, observedAt: T("10:05") },
      airflowMethod: { method: "FLOW_GRID", motorType: "PSC" },
      measurements: {
        returnDryBulb: m(76, "F", 0.5, "RETURN_PLENUM", "THERMO-1"),
        returnWetBulb: m(64, "F", 0.5, "RETURN_PLENUM", "THERMO-1"),
        supplyDryBulb: m(52, "F", 0.5, "SUPPLY_PLENUM", "THERMO-1"),
        supplyWetBulb: m(51, "F", 0.5, "SUPPLY_PLENUM", "THERMO-1"),
        outdoorDryBulb: m(88, "F", 0.5, "CONDENSER_INLET", "THERMO-1"),
        airflow: { ...m(1180, "CFM", 30, "SUPPLY_TRUNK", "FLOW-1"), methodId: "GM-AF-01" },
        returnStatic: m(-0.2, "IN_WC", 0.01, "RETURN_PORT", "MANO-1"),
        supplyStatic: m(0.3, "IN_WC", 0.01, "SUPPLY_PORT", "MANO-1"),
      },
    },
    oem: {
      documentRefs: ["OEM-IOM-CU200"],
      provenance: VERIFIED_OEM(),
      chargingMethod: { status: "IDENTIFIED", ref: "OEM-IOM-CU200:charging" },
      requiresUnavailableToolOrMode: false,
      airflowCriteria: [{ kind: "CFM_RANGE", range: { min: 1050, max: 1300, unit: "CFM", ref: "OEM-IOM-CU200:airflow" } }],
      espTableDomain: { min: 0.1, max: 0.8, unit: "IN_WC", ref: "OEM-IOM-CU200:esp" },
      ambientEnvelope: { min: 65, max: 115, unit: "F", ref: "OEM-IOM-CU200:ambient" },
      minRunMinutes: { value: 20, ref: "OEM-IOM-CU200:stabilize" },
      measurementLocations: {
        returnDryBulb: "RETURN_PLENUM", returnWetBulb: "RETURN_PLENUM", supplyDryBulb: "SUPPLY_PLENUM",
        supplyWetBulb: "SUPPLY_PLENUM", outdoorDryBulb: "CONDENSER_INLET", returnStatic: "RETURN_PORT", supplyStatic: "SUPPLY_PORT",
      },
      noninvasiveCriterion: CRITERION(),
    },
  };
}

type Mutable = GateAInput & Record<string, unknown>;

/** Runs Gate A and asserts the invariants every receipt must satisfy (T03, T04, T33). */
function run(mutate: (input: Mutable) => void = () => {}) {
  const input = structuredClone(baseline()) as Mutable;
  mutate(input);
  const result = runGateA(input);
  const { receipt } = result;
  expect(validateReceipt(receipt), JSON.stringify(validateReceipt.errors)).toBe(true);
  expect(receipt.gate_b_authorized).toBe(false);
  expect(receipt.scope).toBe("PRESSURE_EVIDENCE_ONLY");
  expect(Object.keys(receipt)).toEqual(expect.arrayContaining(spec.receipt_schema));
  return { ...result, reasons: receipt.reason_codes as string[] };
}

describe("TA-14-NIRET-GA-C1 freeze guard", () => {
  it("frozen specification matches the approved fingerprint", () => {
    expect(FROZEN_SPEC_SHA256).toBe("f934afe35313adac9f8794e0d345119a9bb64d621cc028aec286f9c3f5e09fa6");
    expect(frozenSpecSha256()).toBe(FROZEN_SPEC_SHA256);
    expect(sha256Canonical(spec)).toBe(FROZEN_SPEC_SHA256);
  });
  it("the engine refuses to load against a tampered specification", async () => {
    vi.resetModules();
    vi.doMock("../../packages/domain/niret/gate-a-c1.spec.json", () => ({ default: { ...spec, status: "TAMPERED" } }));
    await expect(import("../../packages/domain/niret/index.js")).rejects.toThrow(/fingerprint mismatch/);
    vi.doUnmock("../../packages/domain/niret/gate-a-c1.spec.json");
    vi.resetModules();
  });
  it("the frozen spec records the A1/A2/A3 amendments and the prior fingerprint", () => {
    expect(spec.amendments.prior_fingerprint).toBe("f28332524c72b8fec95bb0e8190fa56287d43d199b7864188d989b55eb42fde9");
    expect(spec.amendments.A2_D2_P15_resolution.ruling).toBe("Option A");
  });
  it("revision history preserves every prior fingerprint (A4 is auditable, not a silent replacement)", () => {
    expect(spec.revision).toBe("C1-R7");
    expect(spec.fingerprint_history.map((entry) => entry.sha256)).toEqual([
      "0f261ea12efef7a9c068187370aafdeec145cc64ac0ba80b2166a7d9c540b185",
      "f28332524c72b8fec95bb0e8190fa56287d43d199b7864188d989b55eb42fde9",
      "484cd55baaf36f23c3150b68c79fa2fa54c66269d2862eb2bf822ca1efd6f358",
      "6eee7ae91c1da70aaba5b88165c1a59cbb9887973603f2dc62b47c4eaf84e261",
      "ff8d7d3262071ae94fbe81a5ce2b77078deae4c227adb4ed452ea3e9920cea7a",
      "e94ecb338b7b53d6342fd1f0c77cfe0fa0de8180214808cd701260f36d1367b5",
      "4f0a6c874157833f4e4aa5254605bd687f6fccd43a435132e9fd4aac4855f04a",
      "14f120712d0bdb68f96a25e81d95f88fe84c3c7f75a3ae883dc2a2fcf36c0ec5",
      "c133db7fff88f3e30397c78b1703355e685c9bb2f075b3c4c66268cb74618628",
    ]);
    expect(spec.amendments.A10_c1_r7_historical_ahri_listing.prior_fingerprint).toBe("c133db7fff88f3e30397c78b1703355e685c9bb2f075b3c4c66268cb74618628");
    expect(spec.amendments.A9_c1_r6_airflow_and_measurement_authority.prior_fingerprint).toBe("14f120712d0bdb68f96a25e81d95f88fe84c3c7f75a3ae883dc2a2fcf36c0ec5");
    expect(spec.amendments.A8_c1_r5_oem_evidence_forms_and_i3.prior_fingerprint).toBe("4f0a6c874157833f4e4aa5254605bd687f6fccd43a435132e9fd4aac4855f04a");
    expect(spec.amendments.A7_governed_oem_reference_record.prior_fingerprint).toBe("e94ecb338b7b53d6342fd1f0c77cfe0fa0de8180214808cd701260f36d1367b5");
    expect(spec.amendments.A6_technical_vs_execution_authority.prior_fingerprint).toBe("ff8d7d3262071ae94fbe81a5ce2b77078deae4c227adb4ed452ea3e9920cea7a");
    expect(spec.amendments.A5_authority_standing_and_oem_provenance.prior_fingerprint).toBe("6eee7ae91c1da70aaba5b88165c1a59cbb9887973603f2dc62b47c4eaf84e261");
    expect(spec.amendments.A4_certification_verification.prior_fingerprint).toBe("484cd55baaf36f23c3150b68c79fa2fa54c66269d2862eb2bf822ca1efd6f358");
  });
});

describe("ALLOW path", () => {
  it("complete, valid, indicated evidence yields ALLOW for pressure evidence only (I1)", () => {
    const { evaluation, receipt } = run();
    expect(evaluation.determination).toBe("ALLOW");
    expect(receipt.indication_path).toBe("I1");
    expect(receipt.next_justified_actions).toEqual(["ACQUIRE_PRESSURE_EVIDENCE_ONLY"]);
    expect(receipt.established_propositions).toEqual(receipt.required_propositions);
  });
  it("T03/T04 ALLOW never carries Gate B authority", () => {
    const { receipt } = run();
    expect(receipt.gate_b_authorized).toBe(false);
    expect(receipt.statement).toBe("Permission to connect gauges != permission to move refrigerant.");
    expect(JSON.stringify(receipt)).not.toMatch(/"gate_b_authorized":true/);
  });
  it("supervised apprentice with a Type II/Universal supervisor can reach ALLOW", () => {
    const { evaluation } = run((i) => { i.evidence.technician.certification = { status: "SUPERVISED_APPRENTICE", supervisorCertificateRef: "EPA608-0002", supervisorType: "TYPE_II", verification: VERIFIED() }; });
    expect(evaluation.determination).toBe("ALLOW");
  });
});

describe("fail-closed input handling", () => {
  it("T01 empty and null inputs -> HOLD", () => {
    expect(runGateA({}).evaluation.determination).toBe("HOLD");
    expect(runGateA(null).evaluation.determination).toBe("HOLD");
  });
  it("T02 unknown field -> HOLD, never ALLOW", () => {
    const { evaluation, reasons } = run((i) => { (i.evidence as unknown as Record<string, unknown>).favoriteColor = "blue"; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("INPUT_UNKNOWN_FIELD");
  });
  it("T41 fully populated evidence whose values do not support the propositions is not ALLOW", () => {
    const { evaluation } = run((i) => {
      i.evidence.measurements.airflow = { ...m(700, "CFM", 30, "SUPPLY_TRUNK", "FLOW-1"), methodId: "GM-AF-01" };
      i.evidence.measurements.outdoorDryBulb = m(40, "F", 0.5, "CONDENSER_INLET", "THERMO-1");
    });
    expect(evaluation.determination).not.toBe("ALLOW");
  });
  it("incomplete evidence -> HOLD with every unresolved proposition and its next action (T42)", () => {
    const { evaluation, receipt } = run((i) => { delete i.evidence.measurements.airflow; delete i.evidence.measurements.returnWetBulb; });
    expect(evaluation.determination).toBe("HOLD");
    const unresolved = receipt.unresolved_propositions as Array<{ proposition: string; next_justified_action: string; reason_codes: string[] }>;
    const ids = unresolved.map((u) => u.proposition);
    expect(ids).toEqual(expect.arrayContaining(["P08", "P12", "P18"]));
    expect(unresolved.find((u) => u.proposition === "P08")?.next_justified_action).toBe("ESTABLISH_AIRFLOW_WITHIN_OEM_RANGE");
    expect((receipt.established_propositions as string[]).length + unresolved.length).toBe((receipt.required_propositions as string[]).length);
  });
});

describe("Amendment A1 — premature pressure-instrument entry", () => {
  it.each(["ATTEMPTED", "INSTRUMENTS_CONNECTED", "PROPOSED_OUTSIDE_GATE_A"] as const)("T45 pressureSideEntry=%s -> DENY", (status) => {
    const { evaluation, reasons } = run((i) => { i.evidence.pressureSideEntry = status; });
    expect(evaluation.determination).toBe("DENY");
    expect(reasons).toContain("PRESSURE_INSTRUMENT_ENTRY_NOT_AUTHORIZED");
  });
  it("T46 refrigerant-side pressure evidence in the record -> DENY, not merely HOLD", () => {
    const nested = run((i) => { (i.evidence.measurements as Record<string, unknown>).suctionPressure = { value: 118 }; });
    expect(nested.evaluation.determination).toBe("DENY");
    expect(nested.reasons).toContain("PRESSURE_INSTRUMENT_ENTRY_NOT_AUTHORIZED");
    const topLevel = run((i) => { (i.evidence as unknown as Record<string, unknown>).superheat = 12; });
    expect(topLevel.evaluation.determination).toBe("DENY");
  });
  it("T47 premature-entry DENY does not terminate the workflow; next action is non-invasive evidence", () => {
    const { receipt } = run((i) => { i.evidence.pressureSideEntry = "INSTRUMENTS_CONNECTED"; });
    expect(receipt.workflow_terminated).toBe(false);
    expect(receipt.next_justified_actions).toContain("RETURN_TO_NONINVASIVE_EVIDENCE_AND_RESUBMIT");
  });
  it("air-side static pressure measurements are not refrigerant-side entry", () => {
    expect(run().evaluation.determination).toBe("ALLOW");
  });
});

describe("DENY path", () => {
  it("T20 D1: all prerequisites satisfied and indicator entirely WITHIN OEM criterion -> DENY(NOT_INDICATED)", () => {
    const { evaluation, reasons, receipt } = run((i) => { i.evidence.measurements.supplyDryBulb = m(57, "F", 0.5, "SUPPLY_PLENUM", "THERMO-1"); });
    expect(evaluation.determination).toBe("DENY");
    expect(reasons).toEqual(["NOT_INDICATED"]);
    expect(receipt.next_justified_actions).toEqual(["CONTINUE_DIAGNOSIS_WITHOUT_PRESSURE_ENTRY"]);
  });
  it("T48/T21 D2: prohibited-only basis, complete evidence, not indicated -> DENY(NOT_INDICATED_PROHIBITED_BASIS)", () => {
    const { evaluation, reasons } = run((i) => {
      i.request.statedBasis = ["CUSTOMER_CLAIM"];
      i.evidence.measurements.supplyDryBulb = m(57, "F", 0.5, "SUPPLY_PLENUM", "THERMO-1");
    });
    expect(evaluation.determination).toBe("DENY");
    expect(reasons).toContain("NOT_INDICATED_PROHIBITED_BASIS");
  });
  it("T21 prohibited-only basis with incomplete evidence -> HOLD", () => {
    const { evaluation } = run((i) => { i.request.statedBasis = ["GAUGE_AVAILABLE"]; delete i.evidence.measurements.airflow; });
    expect(evaluation.determination).toBe("HOLD");
  });
  it("T49 prohibited-only basis with indicated evidence -> HOLD(PROHIBITED_BASIS_RESTATE_REQUIRED), never ALLOW", () => {
    const { evaluation, reasons } = run((i) => { i.request.statedBasis = ["SYSTEMS_ARE_ALWAYS_LOW"]; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("PROHIBITED_BASIS_RESTATE_REQUIRED");
  });
  it("T22 authority to test expressly withheld -> DENY regardless of other gaps", () => {
    const { evaluation, reasons } = run((i) => { i.evidence.authorization.sitePermission = "WITHHELD"; delete i.evidence.measurements.airflow; i.evidence.mode = "HEATING"; });
    expect(evaluation.determination).toBe("DENY");
    expect(reasons).toContain("AUTHORITY_TO_TEST_WITHHELD");
  });
  it("T19/T16 missing evidence or missing OEM method never yields DENY", () => {
    expect(run((i) => { delete i.evidence.measurements.outdoorDryBulb; }).evaluation.determination).toBe("HOLD");
    expect(run((i) => { i.oem.chargingMethod = { status: "NOT_OBTAINED", obtainable: true }; }).evaluation.determination).toBe("HOLD");
    expect(run((i) => { i.oem.chargingMethod = { status: "NOT_OBTAINED", obtainable: false }; }).evaluation.determination).toBe("ESCALATE");
  });
});

describe("ESCALATE path (T12, T13, T25, scope)", () => {
  const cases: Array<[string, (i: Mutable) => void, string]> = [
    ["A2L declared (Appendix W designation)", (i) => { i.evidence.refrigerant.declared = "R-454B"; }, "OUT_OF_SCOPE_A2L"],
    ["A2L safety class", (i) => { i.evidence.refrigerant.safetyClass = "A2L"; }, "OUT_OF_SCOPE_A2L"],
    ["A2L red markings", (i) => { i.evidence.refrigerant.a2lMarkingsObserved = true; }, "OUT_OF_SCOPE_A2L"],
    ["other safety class fails closed", (i) => { i.evidence.refrigerant.safetyClass = "A3"; }, "OUT_OF_SCOPE_REFRIGERANT_CLASS"],
    ["inverter", (i) => { i.evidence.equipment.compressorStaging = "INVERTER"; }, "OUT_OF_SCOPE_INVERTER"],
    ["ductless", (i) => { i.evidence.equipment.configuration = "DUCTLESS"; }, "OUT_OF_SCOPE_EQUIPMENT"],
    ["multi-split", (i) => { i.evidence.equipment.configuration = "MULTI_SPLIT"; }, "OUT_OF_SCOPE_EQUIPMENT"],
    ["heating mode", (i) => { i.evidence.mode = "HEATING"; }, "OUT_OF_SCOPE_MODE"],
    ["non-charge question", (i) => { i.request.question = "LEAK"; }, "OUT_OF_SCOPE_QUESTION"],
    ["EEV metering", (i) => { i.evidence.metering.type = "EEV"; }, "OUT_OF_SCOPE_METERING"],
    ["not certified (T52)", (i) => { i.evidence.technician.certification = { status: "NOT_CERTIFIED" }; }, "TECHNICIAN_NOT_CERTIFIED"],
    ["hazard beyond competence", (i) => { i.evidence.safety.hazard = "BEYOND_COMPETENCE"; }, "HAZARD_BEYOND_COMPETENCE"],
    ["refrigerant integrity suspect", (i) => { i.evidence.refrigerant.integritySuspect = true; }, "REFRIGERANT_INTEGRITY_SUSPECT"],
    ["OEM tooling unavailable", (i) => { i.oem.requiresUnavailableToolOrMode = true; }, "OEM_PROCEDURE_REQUIRES_UNAVAILABLE_TOOL_OR_MODE"],
    ["work scope excludes diagnosis", (i) => { i.evidence.authorization.workScopeIncludesDiagnosis = false; }, "WORK_SCOPE_EXCLUDES_DIAGNOSIS"],
  ];
  it.each(cases)("%s -> ESCALATE", (_label, mutate, reason) => {
    const { evaluation, reasons } = run(mutate);
    expect(evaluation.determination).toBe("ESCALATE");
    expect(reasons).toContain(reason);
  });
});

describe("OEM data availability (T14-T18, T28)", () => {
  it("T17 no OEM non-invasive criterion: obtainable -> HOLD, unobtainable -> ESCALATE", () => {
    expect(run((i) => { i.oem.noninvasiveCriterion = { status: "NOT_OBTAINED", obtainable: true }; }).evaluation.determination).toBe("HOLD");
    expect(run((i) => { i.oem.noninvasiveCriterion = { status: "NOT_OBTAINED", obtainable: false }; }).evaluation.determination).toBe("ESCALATE");
  });
  it("T18 no OEM minimum run time -> HOLD", () => {
    const { evaluation, reasons } = run((i) => { delete i.oem.minRunMinutes; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("STABILIZATION_AUTHORITY_UNAVAILABLE");
  });
  it.each([["airflowCriteria", "OEM_AIRFLOW_RANGE_UNAVAILABLE"], ["espTableDomain", "OEM_ESP_RANGE_UNAVAILABLE"], ["ambientEnvelope", "OEM_AMBIENT_ENVELOPE_UNAVAILABLE"]] as const)(
    "T28 missing OEM %s -> HOLD", (key, reason) => {
      const { evaluation, reasons } = run((i) => { delete i.oem[key]; });
      expect(evaluation.determination).toBe("HOLD");
      expect(reasons).toContain(reason);
    });
  it("OEM silent on a required measurement location -> HOLD", () => {
    const { evaluation, reasons } = run((i) => { delete i.oem.measurementLocations.supplyDryBulb; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("OEM_LOCATION_AUTHORITY_UNAVAILABLE");
  });
});

describe("Owner ruling F1 — ambiguity fails closed", () => {
  it("T36 airflow interval straddling the OEM boundary -> HOLD, never DENY or ALLOW", () => {
    const { evaluation, reasons } = run((i) => { i.evidence.measurements.airflow = { ...m(1290, "CFM", 30, "SUPPLY_TRUNK", "FLOW-1"), methodId: "GM-AF-01" }; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("AIRFLOW_AMBIGUOUS");
  });
  it("T37 interval entirely outside the OEM range fails the proposition", () => {
    const { reasons } = run((i) => { i.evidence.measurements.airflow = { ...m(1400, "CFM", 30, "SUPPLY_TRUNK", "FLOW-1"), methodId: "GM-AF-01" }; });
    expect(reasons).toContain("AIRFLOW_OUTSIDE_OEM_RANGE");
  });
  it("T38 missing instrument accuracy -> HOLD", () => {
    const { evaluation, reasons } = run((i) => { i.evidence.measurements.airflow = m(1180, "CFM", undefined, "SUPPLY_TRUNK", "FLOW-1"); });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("INSTRUMENT_ACCURACY_UNRECORDED");
  });
  it("T39/T40/T23/T24 ambiguous indicator (worst-case derived uncertainty) -> HOLD(I2_PREDICATES_NOT_ESTABLISHABLE)", () => {
    // TD = 76 - 55.5 = 20.5; uncertainty 0.5 + 0.5 = 1.0; interval [19.5, 21.5] straddles max 21.
    const { evaluation, reasons, receipt } = run((i) => { i.evidence.measurements.supplyDryBulb = m(55.5, "F", 0.5, "SUPPLY_PLENUM", "THERMO-1"); });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("I2_PREDICATES_NOT_ESTABLISHABLE");
    const finding = (receipt.ambiguity_findings as Array<{ subject: string; uncertainty: number; classification: string }>).find((f) => f.subject === "indicator");
    expect(finding).toMatchObject({ uncertainty: 1, classification: "AMBIGUOUS" });
  });
  it("T51 unit mismatch -> HOLD; no conversion", () => {
    const { evaluation, reasons } = run((i) => { i.oem.airflowCriteria = [{ kind: "CFM_RANGE", range: { min: 500, max: 600, unit: "IN_WC", ref: "x" } }]; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("UNIT_MISMATCH");
  });
  it("T53 condenser PARTIAL_OBSTRUCTION or UNDETERMINED never satisfies P10", () => {
    for (const coilCondition of ["PARTIAL_OBSTRUCTION", "UNDETERMINED", "MATERIALLY_RESTRICTED"] as const) {
      const { evaluation, reasons } = run((i) => { i.evidence.condenser.coilCondition = coilCondition; });
      expect(evaluation.determination).toBe("HOLD");
      expect(reasons).toContain("CONDENSER_COIL_NOT_ESTABLISHED_CLEAR");
    }
  });
});

describe("TA-14 ice policy (T05-T09, T44)", () => {
  it("T05 ice present -> HOLD even with everything else valid", () => {
    const { evaluation, reasons, receipt } = run((i) => { i.evidence.evaporator.iceStatus = "ICE_PRESENT"; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("TA14_ICE_POLICY_ICE_PRESENT");
    const unresolved = (receipt.unresolved_propositions as Array<{ proposition: string }>).map((u) => u.proposition);
    expect(unresolved).toEqual(["P06", "P15", "P18"]);
    expect((receipt.ice_policy_status as { asserts_diagnosis: boolean }).asserts_diagnosis).toBe(false);
  });
  it("T08 ice policy is cited as TA-14 policy, never as an external authority", () => {
    const { receipt } = run((i) => { i.evidence.evaporator.iceStatus = "ICE_PRESENT"; });
    expect((receipt.policy_refs as string[]).some((ref) => ref.startsWith("TA14-POLICY-T2"))).toBe(true);
    expect((receipt.authority_refs as string[]).some((ref) => /\bice\b|iced|frozen|thaw/i.test(ref))).toBe(false);
  });
  it("T09 icing receipt asserts no diagnosis", () => {
    const { receipt } = run((i) => { i.evidence.evaporator.iceStatus = "ICE_PRESENT"; });
    expect(receipt.reason_codes).not.toContain("NOT_INDICATED");
    expect(receipt.indication_path).toBeNull();
  });
  const restored = () => ({
    iceCompletelyRemoved: true, causeInvestigated: true, causeDisposition: "BOUNDED" as const,
    airflowAndHeatTransferReestablished: true, returnedToOperatingEnvelope: true,
    steadyStateReestablished: true, freshMeasurementSetObtained: true, completedAt: T("10:24"),
  });
  it("icing with complete restoration and a fresh window can reach ALLOW", () => {
    const { evaluation } = run((i) => {
      i.evidence.events = [{ type: "FREEZE_SWITCH_TRIP_OR_ICING", at: T("10:02") }];
      i.evidence.evaporator.iceRestoration = restored();
    });
    expect(evaluation.determination).toBe("ALLOW");
  });
  it.each(["iceCompletelyRemoved", "causeInvestigated", "airflowAndHeatTransferReestablished", "returnedToOperatingEnvelope", "steadyStateReestablished", "freshMeasurementSetObtained"] as const)(
    "T07 restoration missing %s -> HOLD", (step) => {
      const { evaluation, reasons } = run((i) => {
        i.evidence.events = [{ type: "FREEZE_SWITCH_TRIP_OR_ICING", at: T("10:02") }];
        i.evidence.evaporator.iceRestoration = { ...restored(), [step]: false };
      });
      expect(evaluation.determination).toBe("HOLD");
      expect(reasons).toContain("TA14_ICE_RESTORATION_INCOMPLETE");
    });
  it("unresolved icing cause -> HOLD", () => {
    const { evaluation } = run((i) => {
      i.evidence.events = [{ type: "FREEZE_SWITCH_TRIP_OR_ICING", at: T("10:02") }];
      i.evidence.evaporator.iceRestoration = { ...restored(), causeDisposition: "UNRESOLVED" };
    });
    expect(evaluation.determination).toBe("HOLD");
  });
  it("T06 pre-restoration measurements are not carried forward", () => {
    const { evaluation, reasons } = run((i) => {
      i.evidence.events = [{ type: "FREEZE_SWITCH_TRIP_OR_ICING", at: T("10:08") }];
      i.evidence.evaporator.iceRestoration = { ...restored(), completedAt: T("10:09") };
    });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("MEASUREMENT_OUTSIDE_QUALIFYING_WINDOW");
  });
  it("T44 icing after the qualifying window started invalidates the window", () => {
    const { evaluation } = run((i) => { i.evidence.events = [{ type: "FREEZE_SWITCH_TRIP_OR_ICING", at: T("10:27") }]; });
    expect(evaluation.determination).toBe("HOLD");
  });
});

describe("State change and re-baselining (T10, T11, T34)", () => {
  it.each(STATE_EVENT_TYPES)("T10 %s after the measurement set -> HOLD until re-established", (type: StateEventType) => {
    const { evaluation } = run((i) => { i.evidence.events = [{ type, at: T("10:26") }]; });
    expect(evaluation.determination).toBe("HOLD");
  });
  it("T11 compressor interruption restarts the OEM minimum run", () => {
    const { evaluation, reasons } = run((i) => { i.evidence.events = [{ type: "COMPRESSOR_POWER_INTERRUPTED_OR_CYCLED", at: T("10:15") }]; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("OEM_MINIMUM_RUN_INCOMPLETE");
  });
  it("correction recorded, re-baselined, and a fresh synchronized set -> ALLOW", () => {
    const { evaluation } = run((i) => {
      i.evidence.events = [{ type: "FILTER_REPLACED_OR_REMOVED", at: T("10:04") }];
      i.evidence.corrections = [{ at: T("10:04"), declaredFinding: "Loaded filter restricting airflow", authorityRef: "WO-1", beforeRecordRef: "PHOTO-1", correctionDescription: "Filter replaced", afterRecordRef: "PHOTO-2", rebaselinedAt: T("10:25") }];
      i.evidence.condenser.observedAt = T("10:24");
    });
    expect(evaluation.determination).toBe("ALLOW");
  });
  it("T34 correction without re-baseline -> HOLD", () => {
    const { evaluation, reasons } = run((i) => {
      i.evidence.corrections = [{ at: T("10:01"), declaredFinding: "x", authorityRef: "WO-1", beforeRecordRef: "b", correctionDescription: "c", afterRecordRef: "a" }];
    });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("CORRECTION_NOT_REBASELINED");
  });
  it("condenser observation older than a condenser cleaning is stale", () => {
    const { reasons } = run((i) => {
      i.evidence.condenser.observedAt = T("10:02");
      i.evidence.events = [{ type: "CONDENSER_COIL_CLEANED", at: T("10:03") }];
    });
    expect(reasons).toContain("CONDENSER_OBSERVATION_NOT_CURRENT");
  });
  it("repair affecting identity requires re-verification", () => {
    const { reasons } = run((i) => { i.evidence.events = [{ type: "REPAIR_OR_COMPONENT_REPLACEMENT", at: T("10:02"), affectsIdentity: true }]; });
    expect(reasons).toEqual(expect.arrayContaining(["IDENTITY_REVERIFICATION_REQUIRED_AFTER_REPAIR", "METERING_REVERIFICATION_REQUIRED_AFTER_REPAIR"]));
  });
  it("OEM stability criterion (C06) is applied only where the OEM specifies it", () => {
    const withCriterion = (readings: Measurement[]) => run((i) => {
      i.oem.stabilityCriterion = { measurement: "supplyDryBulb", maxChange: 1, unit: "F", ref: "OEM-IOM-CU200:stable" };
      i.evidence.stabilityReadings = readings;
    });
    expect(withCriterion([m(52, "F", 0.1, "SUPPLY_PLENUM", "THERMO-1", "10:21"), m(52.3, "F", 0.1, "SUPPLY_PLENUM", "THERMO-1", "10:25")]).evaluation.determination).toBe("ALLOW");
    expect(withCriterion([m(52, "F", 0.1, "SUPPLY_PLENUM", "THERMO-1", "10:21"), m(54, "F", 0.1, "SUPPLY_PLENUM", "THERMO-1", "10:25")]).evaluation.determination).toBe("HOLD");
    expect(withCriterion([]).evaluation.determination).toBe("HOLD");
  });
});

describe("Identity, instruments, authority (T30, T31, T35, T52)", () => {
  it("T30 unknown metering device -> HOLD", () => {
    expect(run((i) => { i.evidence.metering = { type: "UNKNOWN", evidenceBasis: "NONE" }; }).evaluation.determination).toBe("HOLD");
  });
  it("T31 metering device inferred from pressure is rejected", () => {
    const { reasons } = run((i) => { i.evidence.metering.evidenceBasis = "INFERRED_FROM_PRESSURE"; });
    expect(reasons).toContain("METERING_INFERRED_FROM_PRESSURE_REJECTED");
  });
  it("T35 pressure instruments not rated for the declared refrigerant -> HOLD", () => {
    const { evaluation, reasons } = run((i) => { i.evidence.plannedPressureInstruments = [{ instrumentId: "GAUGE-1", ratedForRefrigerants: ["R-22"], calibrationValid: true }]; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("INSTRUMENT_NOT_RATED_FOR_REFRIGERANT");
  });
  it("T52 missing certification documentation -> HOLD", () => {
    const { evaluation, reasons } = run((i) => { delete i.evidence.technician.certification; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("CERTIFICATION_DOCUMENTATION_MISSING");
  });
  it("Type I-only certification is not applicable to this equipment -> ESCALATE", () => {
    expect(run((i) => { i.evidence.technician.certification = { status: "CERTIFIED", type: "TYPE_I", certificateRef: "c" }; }).evaluation.determination).toBe("ESCALATE");
  });
  it("uncalibrated measurement instrument -> HOLD", () => {
    expect(run((i) => { i.evidence.instruments[0].calibrationValid = false; }).evaluation.determination).toBe("HOLD");
  });
  it("T50 TESP derived from raw supply and return static with summed uncertainty; raw preserved", () => {
    const { receipt } = run();
    expect(receipt.derived_tesp).toMatchObject({ value: 0.5, uncertainty: 0.02, unit: "IN_WC", lineage: { method: "GM-DV-01", inputs: ["supplyStatic", "returnStatic"] } });
    const raw = receipt.raw_static_pressures as { returnStatic: Measurement; supplyStatic: Measurement };
    expect(raw.returnStatic.value).toBe(-0.2);
    expect(raw.supplyStatic.value).toBe(0.3);
  });
});

describe("Determinism, precedence, decoupling (T26, T27, T29, T32, T43)", () => {
  it("T32 identical inputs produce identical receipts and content hashes", () => {
    const a = runGateA(baseline()).receipt;
    const b = runGateA(baseline()).receipt;
    expect(a.content_hash).toBe(b.content_hash);
    expect(a.receipt_id).toBe(b.receipt_id);
    const reordered = JSON.parse(JSON.stringify(baseline(), Object.keys(baseline()).reverse()));
    expect(runGateA({ ...reordered, request: baseline().request, evidence: baseline().evidence, oem: baseline().oem }).receipt.content_hash).toBe(a.content_hash);
  });
  it("different evidence produces a different content hash", () => {
    const changed = run((i) => { i.evidence.measurements.outdoorDryBulb = m(89, "F", 0.5, "CONDENSER_INLET", "THERMO-1"); }).receipt;
    expect(changed.content_hash).not.toBe(runGateA(baseline()).receipt.content_hash);
  });
  it("T26 precedence is DENY > ESCALATE > HOLD > ALLOW, delegated to deriveDecision", () => {
    const denyAndEscalate = run((i) => { i.evidence.pressureSideEntry = "ATTEMPTED"; i.evidence.refrigerant.declared = "R-32"; });
    expect(denyAndEscalate.evaluation.determination).toBe("DENY");
    const escalateAndHold = run((i) => { i.evidence.mode = "HEATING"; delete i.evidence.measurements.airflow; });
    expect(escalateAndHold.evaluation.determination).toBe("ESCALATE");
    const r = (result: "SATISFIED" | "HOLD" | "ESCALATE" | "DENY") => ({ requirementId: "x", requirementVersion: "1", result, reason: "x", evidenceIds: [] });
    expect(deriveDecision([])).toBe("HOLD");
    expect(deriveDecision([r("SATISFIED")])).toBe("ALLOW");
  });
  it("T43 identical values yield identical propositions regardless of MANUAL or INSTRUMENT provenance", () => {
    const manual = runGateA(baseline());
    const instrumented = run((i) => {
      for (const measurement of Object.values(i.evidence.measurements)) if (measurement) measurement.provenance = "INSTRUMENT:BLE-PROBE-7";
    });
    expect(instrumented.evaluation.determination).toBe(manual.evaluation.determination);
    expect(instrumented.evaluation.checks).toEqual(manual.evaluation.checks);
    expect(instrumented.receipt.evidence_provenance).toMatchObject({ airflow: "INSTRUMENT:BLE-PROBE-7" });
  });
  it("T27 the evaluator contains no hard-coded thresholds", () => {
    const source = ["evaluate-gate-a.ts", "interval.ts", "range.ts"].map((file) =>
      readFileSync(new URL(`../../packages/domain/niret/${file}`, import.meta.url), "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")).join("\n");
    // A8: range.ts defines percent (per hundred) for OEM-stated "± N percent" formulas; that is a unit definition, not a threshold.
    const literals = (source.match(/(?<![\w.$-])\d[\d_]*(\.\d+)?(?![\w])/g) ?? []).filter((n) => !["0", "2", "60_000"].includes(n));
    expect(literals).toEqual(["100"]);
    expect(source).toMatch(/const PER_HUNDRED = 100;/);
  });
  it("T29 RESNET 310 Table B1 / non-invasive method and Title 24 RA3.2 contribute nothing to the engine", () => {
    const source = readFileSync(new URL("../../packages/domain/niret/evaluate-gate-a.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/Table B1|RA3\.2|RESNET|Title 24/i);
    expect(spec.not_generalized).toEqual(expect.arrayContaining(["RESNET 310 Table B1"]));
  });
});

describe("Amendment A4 — certification must be independently verified (T54-T63)", () => {
  type Cert = NonNullable<GateAInput["evidence"]["technician"]["certification"]>;
  const withCert = (certification: Cert) => run((i) => { i.evidence.technician.certification = certification; });
  const certified = (verification?: Record<string, unknown>) =>
    ({ status: "CERTIFIED", type: "UNIVERSAL", certificateRef: "EPA608-0001", ...(verification ? { verification } : {}) }) as Cert;

  it("T54 declared certificate number with no verification -> HOLD(CERTIFICATION_NOT_VERIFIED), never ALLOW", () => {
    const { evaluation, reasons, receipt } = withCert(certified());
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("CERTIFICATION_NOT_VERIFIED");
    // A6: only execution authority (P17) is unresolved; the technical question is answered.
    expect((receipt.unresolved_propositions as Array<{ proposition: string }>).map((u) => u.proposition)).toEqual(["P17"]);
    expect(evaluation.technicalDetermination).toBe("ALLOW");
  });
  it("T55 documented but NOT_VERIFIED -> HOLD(CERTIFICATION_NOT_VERIFIED)", () => {
    const { evaluation, reasons } = withCert(certified({ assurance: "DOCUMENTED", status: "NOT_VERIFIED" }));
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("CERTIFICATION_NOT_VERIFIED");
  });
  it("T56 VERIFICATION_UNAVAILABLE -> ESCALATE(CERTIFICATION_VERIFICATION_UNAVAILABLE)", () => {
    const { evaluation, reasons } = withCert(certified({ assurance: "DECLARED", status: "VERIFICATION_UNAVAILABLE" }));
    expect(evaluation.determination).toBe("ESCALATE");
    expect(reasons).toContain("CERTIFICATION_VERIFICATION_UNAVAILABLE");
  });
  it("T57 self-verification by the technician -> HOLD(CERTIFICATION_SELF_VERIFICATION_REJECTED)", () => {
    const { evaluation, reasons } = withCert(certified({ ...VERIFIED(), verifier: " tech-1 " }));
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("CERTIFICATION_SELF_VERIFICATION_REJECTED");
  });
  it.each(["verifier", "reference", "verifiedAt"])("T58 VERIFIED without %s -> HOLD(CERTIFICATION_VERIFICATION_EVIDENCE_INCOMPLETE)", (field) => {
    const verification: Record<string, unknown> = VERIFIED();
    delete verification[field];
    const { evaluation, reasons } = withCert(certified(verification));
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("CERTIFICATION_VERIFICATION_EVIDENCE_INCOMPLETE");
  });
  it("T59 complete independent verification satisfies the certification element; ALLOW still needs everything else", () => {
    expect(withCert(certified(VERIFIED())).evaluation.determination).toBe("ALLOW");
    const incomplete = run((i) => { delete i.evidence.measurements.airflow; });
    expect(incomplete.evaluation.determination).toBe("HOLD");
    expect((incomplete.receipt.certification_status as { established: boolean }).established).toBe(true);
  });
  it("T60 supervised apprentice requires the supervisor's certification to be verified", () => {
    const unverified = withCert({ status: "SUPERVISED_APPRENTICE", supervisorCertificateRef: "EPA608-0002", supervisorType: "TYPE_II" });
    expect(unverified.evaluation.determination).toBe("HOLD");
    expect(unverified.reasons).toContain("CERTIFICATION_NOT_VERIFIED");
    expect((unverified.receipt.certification_status as { applies_to: string }).applies_to).toBe("SUPERVISOR");
  });
  it("T61 receipt certification_status distinguishes declared from verified and records verifier evidence", () => {
    const declared = withCert(certified()).receipt.certification_status as Record<string, unknown>;
    expect(declared).toMatchObject({ credential: "CERTIFIED", assurance: "DECLARED", verification_status: "NOT_VERIFIED", verifier: null, established: false });
    const verified = run().receipt.certification_status as Record<string, unknown>;
    expect(verified).toMatchObject({ assurance: "DECLARED", verification_status: "VERIFIED", verifier: "CERT-VERIFIER-SVC", verification_reference: "VR-0001", established: true, reason_codes: [] });
  });
  it("T62 missing certification -> HOLD and explicit NOT_CERTIFIED -> ESCALATE are unchanged", () => {
    const missing = run((i) => { delete i.evidence.technician.certification; });
    expect(missing.evaluation.determination).toBe("HOLD");
    expect((missing.receipt.certification_status as { credential: string }).credential).toBe("MISSING");
    const notCertified = withCert({ status: "NOT_CERTIFIED" });
    expect(notCertified.evaluation.determination).toBe("ESCALATE");
    expect(notCertified.reasons).toContain("TECHNICIAN_NOT_CERTIFIED");
  });
});

describe("Amendment A5 — declarations may restrict, never grant (T64, T69-T75; T65-T68 superseded by A6)", () => {
  const ELEMENTS = [
    ["identity", "TECHNICIAN_IDENTITY"], ["workScope", "WORK_SCOPE"], ["sitePermission", "SITE_PERMISSION"], ["jurisdiction", "JURISDICTION"],
  ] as const;
  type Est = NonNullable<GateAInput["evidence"]["authorityEstablishment"]>;
  const withElement = (element: keyof Est, record: Est[keyof Est] | undefined) => run((i) => {
    const establishment = { ...ALL_ESTABLISHED() } as Est;
    if (record === undefined) delete establishment[element]; else establishment[element] = record;
    i.evidence.authorityEstablishment = establishment;
  });

  it("T64 missing server-stamped submitter -> HOLD(SUBMITTER_UNAUTHENTICATED)", () => {
    const { evaluation, reasons } = run((i) => { delete i.evidence.submittedBy; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("SUBMITTER_UNAUTHENTICATED");
  });
  it("T69 established restrictive findings restrict; declared restrictions still restrict", () => {
    expect(withElement("identity", ESTABLISHED("DOES_NOT_MATCH")).evaluation.determination).toBe("ESCALATE");
    expect(withElement("workScope", ESTABLISHED("EXCLUDES_DIAGNOSIS")).evaluation.determination).toBe("ESCALATE");
    expect(withElement("sitePermission", ESTABLISHED("WITHHELD")).evaluation.determination).toBe("DENY");
    expect(withElement("jurisdiction", ESTABLISHED("REQUIRED_NOT_CONFIRMED")).reasons).toContain("JURISDICTIONAL_AUTHORIZATION_UNCONFIRMED");
    expect(run((i) => { i.evidence.authorization.sitePermission = "WITHHELD"; }).evaluation.determination).toBe("DENY");
    expect(run((i) => { i.evidence.authorization.workScopeIncludesDiagnosis = false; }).evaluation.determination).toBe("ESCALATE");
  });
  it("T70 manual OEM transcription -> HOLD(OEM_REFERENCE_NOT_VERIFIED), never ALLOW", () => {
    for (const provenance of [undefined, { ...VERIFIED_OEM(), acquisitionMethod: "MANUAL_TRANSCRIPTION" as const, verification: "NOT_VERIFIED" as const }]) {
      const { evaluation, reasons } = run((i) => { if (provenance) i.oem.provenance = provenance; else delete i.oem.provenance; });
      expect(evaluation.determination).toBe("HOLD");
      expect(reasons).toContain("OEM_REFERENCE_NOT_VERIFIED");
    }
  });
  it("T71 OEM verification unavailable -> ESCALATE", () => {
    const { evaluation, reasons } = run((i) => { i.oem.provenance = { acquisitionMethod: "MANUAL_TRANSCRIPTION", verification: "VERIFICATION_UNAVAILABLE" }; });
    expect(evaluation.determination).toBe("ESCALATE");
    expect(reasons).toContain("OEM_REFERENCE_VERIFICATION_UNAVAILABLE");
  });
  // A7 supersedes "model" with matchedSystems (T87 covers the A7 record fields).
  // A7/A8: document-level fields live on each constituent source (T87 covers the binding and source fields).
  it.each(["manufacturer", "verifiedBy", "verifiedAt"] as const)("T72 OEM provenance without %s -> HOLD", (field) => {
    const provenance: Record<string, unknown> = VERIFIED_OEM();
    delete provenance[field];
    const { evaluation, reasons } = run((i) => { i.oem.provenance = provenance as never; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("OEM_REFERENCE_PROVENANCE_INCOMPLETE");
  });
  it("T72 source revision is optional; self-verified OEM reference -> HOLD", () => {
    const noRevision = VERIFIED_OEM();
    noRevision.sources = noRevision.sources.map(({ revision: _omit, ...source }) => source) as typeof noRevision.sources;
    expect(run((i) => { i.oem.provenance = noRevision; }).evaluation.determination).toBe("ALLOW");
    const self = run((i) => { i.oem.provenance = { ...VERIFIED_OEM(), verifiedBy: "tech-1" }; });
    expect(self.evaluation.determination).toBe("HOLD");
    expect(self.reasons).toContain("OEM_REFERENCE_SELF_VERIFICATION_REJECTED");
  });
  it("T73 the same measurements reach ALLOW only with an independently VERIFIED OEM reference", () => {
    const manual = run((i) => { i.oem.provenance = { ...VERIFIED_OEM(), acquisitionMethod: "MANUAL_TRANSCRIPTION", verification: "NOT_VERIFIED" }; });
    const verified = run();
    expect(manual.receipt.measurement_set).toEqual(verified.receipt.measurement_set);
    expect(manual.evaluation.determination).not.toBe("ALLOW");
    expect(verified.evaluation.determination).toBe("ALLOW");
  });
  it("T74 with a manual OEM reference, measurements are still evaluated and established as evidence", () => {
    const { receipt, evaluation } = run((i) => { i.oem.provenance = { ...VERIFIED_OEM(), acquisitionMethod: "MANUAL_TRANSCRIPTION", verification: "NOT_VERIFIED" }; });
    for (const proposition of ["P05", "P08", "P09", "P10", "P11", "P12", "P13"]) expect(receipt.established_propositions).toContain(proposition);
    expect(evaluation.ambiguityFindings.map((finding) => finding.subject)).toEqual(expect.arrayContaining(["airflow", "derivedTesp", "outdoorDryBulb"]));
    expect(receipt.derived_tesp).toMatchObject({ value: 0.5, uncertainty: 0.02, unit: "IN_WC", lineage: { method: "GM-DV-01", inputs: ["supplyStatic", "returnStatic"] } });
  });
  it("T75 receipt records submitter, per-element authority status and OEM provenance", () => {
    const established = run().receipt;
    expect(established.submitted_by).toEqual({ accountId: "account-uuid-1", method: "AUTHENTICATED_SESSION" });
    expect(established.authority_status).toMatchObject({
      submitter_authenticated: true,
      work_scope: { declared_assurance: "DECLARED", establishment_status: "ESTABLISHED", source: "DISPATCH-AUTHORITY-SVC", established: true },
    });
    expect(established.oem_reference_provenance).toMatchObject({ acquisition_method: "GOVERNED_LIBRARY", verification: "VERIFIED", established: true });
    const declaredOnly = run((i) => { delete i.evidence.authorityEstablishment; delete i.oem.provenance; }).receipt;
    expect(declaredOnly.authority_status).toMatchObject({ site_permission: { declared: "GRANTED", establishment_status: "NOT_ESTABLISHED", established: false } });
    expect(declaredOnly.oem_reference_provenance).toMatchObject({ verification: "NOT_VERIFIED", established: false });
  });
});

describe("Amendment A6 — technical NIRET determination vs execution authority (T77-T84)", () => {
  const unverified = (i: Mutable) => { i.evidence.technician.certification = { status: "CERTIFIED", type: "UNIVERSAL", certificateRef: "EPA608-0001" }; };

  it("T77 complete technical evidence, certification not verified -> technical ALLOW, execution HOLD, entry not authorized", () => {
    const { evaluation, receipt } = run(unverified);
    expect(evaluation.technicalDetermination).toBe("ALLOW");
    expect(evaluation.executionAuthorityDetermination).toBe("HOLD");
    expect(evaluation.determination).toBe("HOLD");
    expect(receipt.technical_determination).toMatchObject({ determination: "ALLOW", unresolved_propositions: [], reason_codes: [] });
    expect(receipt.execution_authority).toMatchObject({ determination: "HOLD", unresolved_propositions: ["P17"], reason_codes: ["CERTIFICATION_NOT_VERIFIED"] });
    expect(receipt.indication_path).toBe("I1");
  });
  it("T78 determination is ALLOW only when both parts are ALLOW", () => {
    const both = run();
    expect([both.evaluation.technicalDetermination, both.evaluation.executionAuthorityDetermination, both.evaluation.determination]).toEqual(["ALLOW", "ALLOW", "ALLOW"]);
    for (const mutate of [unverified, (i: Mutable) => { delete i.evidence.measurements.airflow; }]) {
      const { evaluation } = run(mutate);
      expect(evaluation.determination).not.toBe("ALLOW");
    }
  });
  it("T79 technical HOLD, DENY and ESCALATE follow the evidence rules even when execution authority is also missing", () => {
    const hold = run((i) => { unverified(i); delete i.evidence.measurements.airflow; });
    expect(hold.evaluation.technicalDetermination).toBe("HOLD");
    const deny = run((i) => { unverified(i); i.evidence.measurements.supplyDryBulb = m(57, "F", 0.5, "SUPPLY_PLENUM", "THERMO-1"); });
    expect(deny.evaluation.technicalDetermination).toBe("DENY");
    expect(deny.reasons).toContain("NOT_INDICATED");
    expect(deny.evaluation.determination).toBe("DENY");
    const escalate = run((i) => { unverified(i); i.oem.provenance = { acquisitionMethod: "MANUAL_TRANSCRIPTION", verification: "VERIFICATION_UNAVAILABLE" }; });
    expect(escalate.evaluation.technicalDetermination).toBe("ESCALATE");
    expect(escalate.reasons).toContain("OEM_REFERENCE_VERIFICATION_UNAVAILABLE");
  });
  it("T80 missing work-scope, site-permission, jurisdiction or identity grants no longer block Gate A", () => {
    const { evaluation } = run((i) => {
      delete i.evidence.authorityEstablishment;
      i.evidence.authorization = {};
    });
    expect(evaluation.technicalDetermination).toBe("ALLOW");
    expect(evaluation.executionAuthorityDetermination).toBe("ALLOW");
    expect(evaluation.determination).toBe("ALLOW");
    const unavailable = run((i) => {
      i.evidence.authorityEstablishment = { workScope: { status: "SOURCE_UNAVAILABLE" }, sitePermission: { status: "NOT_ESTABLISHED" }, jurisdiction: { status: "SOURCE_UNAVAILABLE" }, identity: { status: "SOURCE_UNAVAILABLE" } };
    });
    expect(unavailable.evaluation.determination).toBe("ALLOW");
  });
  it("T81 declared and established restrictions still restrict execution authority, never the technical answer", () => {
    const cases: Array<[(i: Mutable) => void, string, string]> = [
      [(i) => { i.evidence.authorization.sitePermission = "WITHHELD"; }, "DENY", "AUTHORITY_TO_TEST_WITHHELD"],
      [(i) => { i.evidence.authorization.sitePermission = "UNCONFIRMED"; }, "HOLD", "SITE_PERMISSION_UNCONFIRMED"],
      [(i) => { i.evidence.authorization.jurisdiction = "UNCONFIRMED"; }, "HOLD", "JURISDICTIONAL_AUTHORIZATION_UNCONFIRMED"],
      [(i) => { i.evidence.authorization.workScopeIncludesDiagnosis = false; }, "ESCALATE", "WORK_SCOPE_EXCLUDES_DIAGNOSIS"],
      [(i) => { i.evidence.authorityEstablishment!.identity = { status: "ESTABLISHED", finding: "DOES_NOT_MATCH", source: "HR", reference: "R", establishedAt: T("09:00") }; }, "ESCALATE", "TECHNICIAN_IDENTITY_MISMATCH"],
      [(i) => { i.evidence.authorityEstablishment!.sitePermission = { status: "ESTABLISHED", finding: "WITHHELD" }; }, "DENY", "AUTHORITY_TO_TEST_WITHHELD"],
    ];
    for (const [mutate, expected, reason] of cases) {
      const { evaluation, reasons } = run(mutate);
      expect(evaluation.executionAuthorityDetermination).toBe(expected);
      expect(evaluation.technicalDetermination).toBe("ALLOW");
      expect(evaluation.determination).toBe(expected);
      expect(reasons).toContain(reason);
    }
  });
  it("T82 premature pressure-instrument entry -> execution DENY and determination DENY; technical unaffected", () => {
    const { evaluation, receipt } = run((i) => { i.evidence.pressureSideEntry = "INSTRUMENTS_CONNECTED"; });
    expect(evaluation.executionAuthorityDetermination).toBe("DENY");
    expect(evaluation.determination).toBe("DENY");
    expect(evaluation.technicalDetermination).toBe("ALLOW");
    expect((receipt.execution_authority as { reason_codes: string[] }).reason_codes).toContain("PRESSURE_INSTRUMENT_ENTRY_NOT_AUTHORIZED");
  });
  it("T83 technical ALLOW without execution authority carries the do-not-connect action first", () => {
    const { receipt } = run(unverified);
    expect((receipt.next_justified_actions as string[])[0]).toBe("DO_NOT_CONNECT_UNTIL_EXECUTION_AUTHORITY_ESTABLISHED");
    expect(receipt.next_justified_actions).not.toContain("ACQUIRE_PRESSURE_EVIDENCE_ONLY");
    expect(run().receipt.next_justified_actions).toEqual(["ACQUIRE_PRESSURE_EVIDENCE_ONLY"]);
  });
  it("T84 receipt records the two parts separately, and Gate B is never authorized", () => {
    const { receipt } = run(unverified);
    expect(Object.keys(receipt)).toEqual(expect.arrayContaining(["technical_determination", "execution_authority", "determination"]));
    expect((receipt.technical_determination as { unresolved_propositions: string[] }).unresolved_propositions).not.toContain("P17");
    expect((receipt.execution_authority as { established_propositions: string[] }).established_propositions).toEqual(["ENTRY"]);
    expect(receipt.gate_b_authorized).toBe(false);
  });
});

describe("Amendment A7 — governed OEM reference record and bounded criteria (T85-T97)", () => {
  type Candidate = ReturnType<typeof CRITERION>["candidates"][number];
  const cell = (candidateId: string, min: number, max: number, outdoor: [number, number]): Candidate => ({
    candidateId, range: { min, max, unit: "F", ref: `OEM-IOM-CU200:${candidateId}` },
    appliesWhen: [{ measurement: "outdoorDryBulb", min: outdoor[0], max: outdoor[1], unit: "F", ref: `OEM-IOM-CU200:${candidateId}:odb` }],
  });
  const withCandidates = (candidates: Candidate[], coverage: "COMPLETE" | "PARTIAL" = "PARTIAL") => (i: Mutable) => {
    i.oem.noninvasiveCriterion = { ...CRITERION(), coverage, candidates };
  };
  const provenance = (patch: Record<string, unknown>) => (i: Mutable) => { i.oem.provenance = { ...VERIFIED_OEM(), ...patch } as never; };
  const checksFor = (evaluation: { checks: Array<{ proposition: string; result: string; reason: string }> }, proposition: string) =>
    evaluation.checks.filter((check) => check.proposition === proposition);

  it("T85 a VERIFIED, CURRENT governed record for the exact system satisfies P01 and P14 and can reach ALLOW", () => {
    const { evaluation, receipt } = run();
    expect(evaluation.determination).toBe("ALLOW");
    expect(checksFor(evaluation, "P01")).toEqual([expect.objectContaining({ result: "SATISFIED" })]);
    expect(checksFor(evaluation, "P14")).toEqual([expect.objectContaining({ result: "SATISFIED" })]);
    expect(receipt.pairing).toMatchObject({ establishedByGovernedOemRecord: "NIRET-OEM-SYNTHETIC-TEST-1" });
  });
  it("T86 VERIFIED provenance not acquired from the governed registry -> HOLD; execution authority unaffected (A6)", () => {
    const { evaluation, reasons } = run(provenance({ acquisitionMethod: "MANUAL_TRANSCRIPTION" }));
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toEqual(expect.arrayContaining(["OEM_REFERENCE_NOT_FROM_GOVERNED_REGISTRY", "PAIRING_NOT_ESTABLISHED_BY_GOVERNED_OEM_RECORD"]));
    expect(evaluation.technicalDetermination).toBe("HOLD");
    expect(evaluation.executionAuthorityDetermination).toBe("ALLOW");
  });
  it.each(["recordId", "recordHash", "sources", "pairingSources", "criterionSources", "matchedSystems", "transcribedBy", "transcribedAt", "supersession"])(
    "T87 governed provenance without %s -> HOLD(OEM_REFERENCE_PROVENANCE_INCOMPLETE)", (field) => {
      const incomplete: Record<string, unknown> = VERIFIED_OEM();
      delete incomplete[field];
      const { evaluation, reasons } = run((i) => { i.oem.provenance = incomplete as never; });
      expect(evaluation.determination).toBe("HOLD");
      expect(reasons).toContain("OEM_REFERENCE_PROVENANCE_INCOMPLETE");
    });
  it("T87 malformed record or document hash, or no matched system -> HOLD", () => {
    const badSource = { ...VERIFIED_OEM().sources[0], documentHash: "Z".repeat(64) };
    for (const patch of [{ recordHash: "abc123" }, { sources: [badSource] }, { matchedSystems: [] }, { pairingSources: ["NOT-A-CONSTITUENT"] }]) {
      const { evaluation, reasons } = run(provenance(patch));
      expect(evaluation.determination).toBe("HOLD");
      expect(reasons).toContain("OEM_REFERENCE_PROVENANCE_INCOMPLETE");
    }
  });
  it("T88 review must be independent of the transcriber, technician and submitter, and follow transcription", () => {
    const cases: Array<[Record<string, unknown>, string]> = [
      [{ verifiedBy: "curator-test-1" }, "OEM_REFERENCE_REVIEW_NOT_INDEPENDENT"],
      [{ verifiedBy: "TECH-1" }, "OEM_REFERENCE_SELF_VERIFICATION_REJECTED"],
      [{ verifiedBy: "account-uuid-1" }, "OEM_REFERENCE_SELF_VERIFICATION_REJECTED"],
      [{ verifiedAt: T("09:10") }, "OEM_REFERENCE_REVIEW_PRECEDES_TRANSCRIPTION"],
    ];
    for (const [patch, reason] of cases) {
      const { evaluation, reasons } = run(provenance(patch));
      expect(evaluation.determination).toBe("HOLD");
      expect(reasons).toContain(reason);
    }
  });
  it("T89 SUPERSEDED or WITHDRAWN record -> HOLD", () => {
    expect(run(provenance({ supersession: "SUPERSEDED" })).reasons).toContain("OEM_REFERENCE_SUPERSEDED");
    expect(run(provenance({ supersession: "WITHDRAWN" })).reasons).toContain("OEM_REFERENCE_WITHDRAWN");
    expect(run(provenance({ supersession: "SUPERSEDED" })).evaluation.determination).toBe("HOLD");
  });
  it("T90 manufacturer or indoor/outdoor combination not in the record -> P01 HOLD(OEM_REFERENCE_MODEL_MISMATCH); exact match ignores only case and whitespace", () => {
    for (const mutate of [
      (i: Mutable) => { i.evidence.equipment.outdoorModel = "CU-300"; },
      (i: Mutable) => { i.evidence.equipment.indoorModel = "AH-1000"; },
      (i: Mutable) => { i.evidence.equipment.manufacturer = "OtherCo"; },
      (i: Mutable) => { i.evidence.equipment.outdoorModel = "CU200"; },
    ]) {
      const { evaluation, reasons } = run(mutate);
      expect(evaluation.determination).toBe("HOLD");
      expect(reasons).toContain("OEM_REFERENCE_MODEL_MISMATCH");
    }
    expect(run((i) => { i.evidence.equipment.outdoorModel = " cu-200 "; i.evidence.equipment.manufacturer = "EXAMPLECO"; }).evaluation.determination).toBe("ALLOW");
  });
  it("T91 a declared pairing never establishes P01 without a governed record; a declared false pairing restricts", () => {
    expect(run((i) => { delete i.evidence.equipment.pairingVerifiedAgainstOem; }).evaluation.determination).toBe("ALLOW");
    const declaredFalse = run((i) => { i.evidence.equipment.pairingVerifiedAgainstOem = false; });
    expect(declaredFalse.reasons).toContain("IDENTITY_OR_PAIRING_UNESTABLISHED");
    const declaredOnly = run((i) => { i.evidence.equipment.pairingVerifiedAgainstOem = true; i.oem.provenance = { ...VERIFIED_OEM(), acquisitionMethod: "MANUAL_TRANSCRIPTION", verification: "NOT_VERIFIED" }; });
    expect(declaredOnly.reasons).toContain("PAIRING_NOT_ESTABLISHED_BY_GOVERNED_OEM_RECORD");
    expect(run((i) => { delete i.evidence.equipment.manufacturer; }).reasons).toContain("IDENTITY_OR_PAIRING_UNESTABLISHED");
  });
  it("T92 exactly one applicable candidate supplies the criterion; the indication uses that candidate's range", () => {
    // Indicator: return 76 - supply 52 = 24 +/- 1 F. Outdoor 88 +/- 0.5 F selects cell A.
    const outside = run(withCandidates([cell("A", 16, 21, [80, 95]), cell("B", 20, 30, [95, 110])]));
    expect(outside.evaluation.criterionSelection).toEqual({ status: "SELECTED", candidateId: "A" });
    expect(outside.evaluation.determination).toBe("ALLOW");
    const within = run(withCandidates([cell("A", 20, 26, [80, 95]), cell("B", 16, 21, [95, 110])]));
    expect(within.evaluation.criterionSelection).toEqual({ status: "SELECTED", candidateId: "A" });
    expect(within.evaluation.determination).toBe("DENY");
    expect(within.reasons).toContain("NOT_INDICATED");
  });
  it("T93 no applicable candidate: coverage COMPLETE -> ESCALATE, PARTIAL -> HOLD; no value is substituted", () => {
    const cells = [cell("A", 16, 21, [95, 105]), cell("B", 16, 21, [105, 115])];
    const complete = run(withCandidates(cells, "COMPLETE"));
    expect(complete.evaluation.determination).toBe("ESCALATE");
    expect(complete.reasons).toContain("OEM_CRITERION_NOT_PUBLISHED_FOR_CONDITIONS");
    const partial = run(withCandidates(cells, "PARTIAL"));
    expect(partial.evaluation.determination).toBe("HOLD");
    expect(partial.reasons).toContain("OEM_CRITERION_NOT_IN_RECORD_FOR_CONDITIONS");
    for (const result of [complete, partial]) {
      expect(result.evaluation.criterionSelection.status).toBe("NONE_APPLICABLE");
      expect(result.evaluation.ambiguityFindings.map((finding) => finding.subject)).not.toContain("indicator");
    }
  });
  it("T94 applicability ambiguous under F1 -> HOLD; more than one applicable candidate -> HOLD", () => {
    const ambiguous = run(withCandidates([cell("A", 16, 21, [80, 88.2]), cell("B", 16, 21, [88.2, 95])]));
    expect(ambiguous.evaluation.determination).toBe("HOLD");
    expect(ambiguous.reasons).toContain("OEM_CRITERION_APPLICABILITY_AMBIGUOUS");
    expect(ambiguous.evaluation.criterionSelection.status).toBe("AMBIGUOUS");
    const conflict = run(withCandidates([cell("A", 16, 21, [80, 95]), cell("B", 10, 30, [85, 100])]));
    expect(conflict.evaluation.determination).toBe("HOLD");
    expect(conflict.reasons).toContain("OEM_CRITERION_CANDIDATES_CONFLICT");
    expect(conflict.evaluation.criterionSelection.status).toBe("CONFLICT");
  });
  it("T95 interpolation, calculation or an unrepresented lookup condition -> ESCALATE; no value manufactured, no indication evaluated", () => {
    const lookups = [
      [{ interpolationRequired: true, calculationRequired: false, unrepresentedConditions: [] }, "OEM_CRITERION_REQUIRES_INTERPOLATION"],
      [{ interpolationRequired: false, calculationRequired: true, unrepresentedConditions: [] }, "OEM_CRITERION_REQUIRES_CALCULATION"],
      [{ interpolationRequired: false, calculationRequired: false, unrepresentedConditions: ["indoor load"] }, "OEM_CRITERION_CONDITION_NOT_REPRESENTED"],
    ] as const;
    for (const [lookup, reason] of lookups) {
      const { evaluation, reasons, receipt } = run((i) => { i.oem.noninvasiveCriterion = { ...CRITERION(), lookup: { ...lookup, unrepresentedConditions: [...lookup.unrepresentedConditions] } }; });
      expect(evaluation.determination).toBe("ESCALATE");
      expect(evaluation.technicalDetermination).toBe("ESCALATE");
      expect(reasons).toContain(reason);
      expect(evaluation.criterionSelection).toEqual({ status: "NOT_REPRESENTABLE", candidateId: null });
      expect(evaluation.ambiguityFindings.map((finding) => finding.subject)).not.toContain("indicator");
      expect(receipt.indication_path).toBeNull();
      expect(receipt.oem_criterion_selection).toMatchObject({ range: null, interpolation_performed: false });
    }
  });
  it("T96 an applicability condition measurement unusable or in a non-contract unit -> HOLD, no candidate selected", () => {
    const unmeasured = run(withCandidates([{ ...cell("A", 16, 21, [80, 95]), appliesWhen: [{ measurement: "outdoorWetBulb", min: 60, max: 80, unit: "F", ref: "x" }] } as unknown as Candidate]));
    expect(unmeasured.evaluation.determination).toBe("HOLD");
    expect(unmeasured.reasons).toContain("OUTDOORWETBULB_UNAVAILABLE");
    expect(unmeasured.evaluation.criterionSelection.status).toBe("NOT_EVALUATED");
    const wrongUnit = run(withCandidates([{ ...cell("A", 16, 21, [80, 95]), appliesWhen: [{ measurement: "outdoorDryBulb", min: 27, max: 35, unit: "PCT_RH", ref: "x" }] } as unknown as Candidate]));
    expect(wrongUnit.evaluation.determination).toBe("HOLD");
    expect(wrongUnit.reasons).toContain("UNIT_MISMATCH");
    expect(wrongUnit.evaluation.criterionSelection.status).toBe("NOT_EVALUATED");
  });
  it("T97 the receipt identifies the governed record, document hash, custody and selected candidate; P01/P14/P18 stay technical (A6)", () => {
    const { receipt } = run(withCandidates([cell("A", 16, 21, [80, 95])]));
    expect(receipt.oem_reference_provenance).toMatchObject({
      acquisition_method: "GOVERNED_LIBRARY", verification: "VERIFIED", established: true,
      record_id: "NIRET-OEM-SYNTHETIC-TEST-1", record_hash: sha256Canonical("SYNTHETIC-TEST-RECORD"),
      sources: VERIFIED_OEM().sources, pairing_sources: [OUTDOOR_SRC], conflicts: [],
      matched_systems: [{ indoorModel: "AH-100", outdoorModel: "CU-200" }],
      transcribed_by: "CURATOR-TEST-1", verified_by: "OEM-LIBRARY-SVC", supersession: "CURRENT",
    });
    expect(receipt.oem_criterion_selection).toEqual({
      status: "SELECTED", candidateId: "A", range: { min: 16, max: 21, unit: "F", ref: "OEM-IOM-CU200:A" }, interpolation_performed: false,
    });
    expect(receipt.oem_document_refs).toEqual(expect.arrayContaining(["OEM-IOM-CU200:A", "OEM-IOM-CU200:A:odb"]));
    expect(receipt.equipment_identity).toEqual({ manufacturer: "ExampleCo", indoorModel: "AH-100", outdoorModel: "CU-200" });
    for (const id of ["P01", "P14", "P18"]) expect(spec.amendments.A6_technical_vs_execution_authority.partition.technical).toContain(id);
    expect(receipt.gate_b_authorized).toBe(false);
  });
});

describe("Amendment A8 (C1-R5) — OEM evidence forms, multi-source binding, event-anchored I3 (T106-T118, T122)", () => {
  const cfm = (range: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({ kind: "CFM_RANGE", range: { unit: "CFM", ref: "OEM-AH:airflow", min: null, max: null, ...range }, ...extra });
  const setAirflow = (...criteria: unknown[]) => (i: Mutable) => { i.oem.airflowCriteria = criteria as never; };
  const source = (index: number, patch: Record<string, unknown>) => (i: Mutable) => {
    const provenance = VERIFIED_OEM();
    provenance.sources = provenance.sources.map((item, at) => (at === index ? { ...item, ...patch } : item)) as typeof provenance.sources;
    i.oem.provenance = provenance as never;
  };
  const I3_METHOD = {
    status: "IDENTIFIED", ref: "OEM-IOM:charging", pressureBased: true, meteringTypes: ["TXV"],
    postEventVerification: { ref: "OEM-IOM:p16 whenever charge is removed or added" },
    conditions: [
      { measurement: "outdoorDryBulb", min: 70, max: 100, unit: "F", ref: "OEM-IOM:p8 favorable outdoor" },
      { measurement: "returnDryBulb", min: 70, max: 80, unit: "F", ref: "OEM-IOM:p8 favorable indoor" },
    ],
  };
  const REPAIR = { type: "REPAIR_OR_COMPONENT_REPLACEMENT", at: T("09:58"), affectsRefrigerantCircuit: true };
  const i3 = (patch: (i: Mutable) => void = () => {}) => (i: Mutable) => {
    i.oem.noninvasiveCriterion = { status: "NOT_OBTAINED", obtainable: true };
    i.oem.chargingMethod = structuredClone(I3_METHOD) as never;
    i.evidence.events = [structuredClone(REPAIR) as never];
    i.request.statedBasis = ["POST_CHARGE_CHANGE_OR_REPAIR_VERIFICATION"];
    patch(i);
  };
  const approach = (nominal: number, extra: Record<string, unknown> = {}) => (i: Mutable) => {
    i.evidence.measurements.liquidLineTemp = m(nominal, "F", 0.5, "LIQUID_LINE_AT_SERVICE_VALVE", "THERMO-1");
    i.oem.measurementLocations.liquidLineTemp = "LIQUID_LINE_AT_SERVICE_VALVE";
    i.oem.noninvasiveCriterion = {
      status: "PUBLISHED", derivation: { kind: "LIQUID_LINE_MINUS_OUTDOOR_DRY_BULB" }, coverage: "PARTIAL",
      lookup: { interpolationRequired: false, calculationRequired: false, unrepresentedConditions: [] },
      candidates: [{
        candidateId: "APP-036", meteringTypes: ["TXV"],
        range: { min: null, max: null, unit: "F", ref: "OEM:Table 4 approach", derivation: { form: "TOLERANCE_BAND", nominal: 9, tolerance: 1 } },
        appliesWhen: [{ measurement: "outdoorDryBulb", min: 65, max: null, unbounded: "MAX", unit: "F", ref: "OEM:Fig 19 65F and above" }],
        ...extra,
      }],
    } as never;
  };

  it("T106 a constituent source that is unverified, superseded, withdrawn, self-reviewed or not independently reviewed -> HOLD", () => {
    const cases: Array<[Record<string, unknown>, string]> = [
      [{ verification: "NOT_VERIFIED" }, "OEM_SOURCE_NOT_VERIFIED"],
      [{ supersession: "SUPERSEDED" }, "OEM_REFERENCE_SUPERSEDED"],
      [{ supersession: "WITHDRAWN" }, "OEM_REFERENCE_WITHDRAWN"],
      [{ verifiedBy: "TECH-1" }, "OEM_REFERENCE_SELF_VERIFICATION_REJECTED"],
      [{ verifiedBy: "curator-test-2" }, "OEM_REFERENCE_REVIEW_NOT_INDEPENDENT"],
      [{ verifiedAt: T("09:05") }, "OEM_REFERENCE_REVIEW_PRECEDES_TRANSCRIPTION"],
    ];
    for (const [patch, reason] of cases) {
      const { evaluation, reasons } = run(source(1, patch));
      expect(evaluation.technicalDetermination).toBe("HOLD");
      expect(reasons).toContain(reason);
    }
  });
  it("T107 a criterion attributed to an AHRI certification listing -> HOLD; binding conflicts -> HOLD", () => {
    const listing = run((i) => {
      const provenance = VERIFIED_OEM();
      provenance.sources[1] = { ...provenance.sources[1]!, sourceClass: "AHRI_CERTIFICATION_LISTING" } as never;
      i.oem.provenance = provenance as never;
    });
    expect(listing.evaluation.determination).toBe("HOLD");
    expect(listing.reasons).toContain("OEM_CRITERION_FROM_NON_OEM_SOURCE");
    const conflict = run((i) => { i.oem.provenance = { ...VERIFIED_OEM(), conflicts: ["CRITERION_CONFLICT:ambientEnvelope"] } as never; });
    expect(conflict.evaluation.determination).toBe("HOLD");
    expect(conflict.reasons).toEqual(expect.arrayContaining(["OEM_BINDING_CONFLICT", "PAIRING_NOT_ESTABLISHED_BY_GOVERNED_OEM_RECORD"]));
  });
  it("T108 P08 admits stated bounds, percent-of-rated, per-ton and tolerance-band criteria; one-sided alone -> HOLD", () => {
    for (const criterion of [
      cfm({ min: 1050, max: 1300 }),
      cfm({ derivation: { form: "PERCENT_OF_RATED", rated: 1180, percent: 21 } }),
      cfm({ derivation: { form: "PER_TON", nominalTons: 3, minPerTon: 350, maxPerTon: 430 } }),
      cfm({ derivation: { form: "TOLERANCE_BAND", nominal: 1175, tolerance: 125 } }),
    ]) {
      expect(run(setAirflow(criterion)).evaluation.determination).toBe("ALLOW");
    }
    const derived = run(setAirflow(cfm({ derivation: { form: "PERCENT_OF_RATED", rated: 1180, percent: 21 } }))).evaluation.ambiguityFindings.find((f) => f.subject === "airflow");
    expect(derived?.range).toMatchObject({ min: 932.2, max: 1427.8, derivation: { form: "PERCENT_OF_RATED", rated: 1180, percent: 21 } });
    const oneSided = run(setAirflow(cfm({ derivation: { form: "PER_TON", nominalTons: 3, minPerTon: null, maxPerTon: 450 } })));
    expect(oneSided.evaluation.determination).toBe("HOLD");
    expect(oneSided.reasons).toContain("AIRFLOW_ACCEPTANCE_ONE_SIDED");
    const bothEnforced = run(setAirflow(cfm({ min: 1050, max: 1300 }), cfm({ derivation: { form: "PER_TON", nominalTons: 3, minPerTon: null, maxPerTon: 380 } })));
    expect(bothEnforced.evaluation.determination).toBe("HOLD");
    expect(bothEnforced.reasons).toContain("AIRFLOW_OUTSIDE_OEM_RANGE");
    expect(run(setAirflow(cfm({ min: 1050, max: 1300 }), cfm({ derivation: { form: "PER_TON", nominalTons: 3, minPerTon: null, maxPerTon: 450 } }))).evaluation.determination).toBe("ALLOW");
  });
  it("T109 P08 OEM coil temperature-drop check: cell selected without interpolation; outside or grid-point-only -> HOLD", () => {
    const dropCheck = (nominal: number, db: [number, number], wb: [number, number]) => ({
      kind: "TEMPERATURE_DROP", coverage: "PARTIAL",
      candidates: [{
        candidateId: "DT", range: { min: null, max: null, unit: "F", ref: "OEM:Fig 18 Delta-T", derivation: { form: "TOLERANCE_BAND", nominal, tolerance: 3 } },
        appliesWhen: [
          { measurement: "returnDryBulb", min: db[0], max: db[1], unit: "F", ref: "OEM:Fig 18 DB" },
          { measurement: "returnWetBulb", min: wb[0], max: wb[1], unit: "F", ref: "OEM:Fig 18 WB" },
        ],
      }],
    });
    // Measured drop 76 - 52 = 24 +/- 1 F; entering 76/64 +/- 0.5 F.
    const within = run((i) => { setAirflow(dropCheck(22, [75, 77], [63, 65]))(i); delete i.evidence.measurements.airflow; });
    expect(within.evaluation.determination).toBe("ALLOW");
    const outside = run(setAirflow(dropCheck(15, [75, 77], [63, 65])));
    expect(outside.evaluation.determination).toBe("HOLD");
    expect(outside.reasons).toContain("AIRFLOW_TEMPERATURE_DROP_OUTSIDE_OEM_CHECK");
    const gridPoint = run(setAirflow(dropCheck(22, [76, 76], [64, 64])));
    expect(gridPoint.evaluation.determination).toBe("HOLD");
    expect(gridPoint.reasons).toContain("OEM_AIRFLOW_CHECK_APPLICABILITY_AMBIGUOUS");
  });
  it("T110 metering-restricted airflow criteria apply only to the established metering device", () => {
    const pistonOnly = run(setAirflow(cfm({ min: 1050, max: 1300 }, { meteringTypes: ["FIXED_ORIFICE"] })));
    expect(pistonOnly.evaluation.determination).toBe("HOLD");
    expect(pistonOnly.reasons).toContain("OEM_AIRFLOW_RANGE_UNAVAILABLE");
    expect(run(setAirflow(cfm({ min: 1050, max: 1300 }, { meteringTypes: ["TXV"] }))).evaluation.determination).toBe("ALLOW");
  });
  it("T111 P09: TESP within the OEM blower-data ESP range and every OEM static limit (signed and magnitude)", () => {
    const returnLimit = { component: "RETURN", basis: "MAGNITUDE", range: { min: 0, max: 0.4, unit: "IN_WC", ref: "OEM:return static < 0.40" } };
    const supplyLimit = { component: "SUPPLY", basis: "SIGNED", range: { min: 0.2, max: null, unbounded: "MAX", unit: "IN_WC", ref: "OEM:supply static > 0.20" } };
    expect(run((i) => { i.oem.staticLimits = [returnLimit, supplyLimit] as never; }).evaluation.determination).toBe("ALLOW");
    expect(run((i) => { delete i.oem.espTableDomain; i.oem.staticLimits = [returnLimit] as never; }).evaluation.determination).toBe("ALLOW");
    const exceeded = run((i) => { i.oem.staticLimits = [returnLimit] as never; i.evidence.measurements.returnStatic = m(-0.45, "IN_WC", 0.01, "RETURN_PORT", "MANO-1"); });
    expect(exceeded.evaluation.determination).toBe("HOLD");
    expect(exceeded.reasons).toContain("STATIC_PRESSURE_LIMIT_NOT_MET");
    const ambiguous = run((i) => { i.oem.staticLimits = [returnLimit] as never; i.evidence.measurements.returnStatic = m(-0.395, "IN_WC", 0.01, "RETURN_PORT", "MANO-1"); });
    expect(ambiguous.reasons).toContain("STATIC_PRESSURE_LIMIT_AMBIGUOUS");
    const beyondTable = run((i) => { i.oem.espTableDomain = { min: 0.1, max: 0.4, unit: "IN_WC", ref: "OEM:blower table" }; });
    expect(beyondTable.evaluation.determination).toBe("HOLD");
    expect(beyondTable.reasons).toContain("ESP_OUTSIDE_OEM_RANGE");
  });
  it("T112 P18 OEM-defined approach with an OEM tolerance band: outside -> I1 ALLOW; within -> D1 DENY; metering or ambient not applicable -> HOLD", () => {
    // Approach = liquid line - outdoor 88 F; target 9 +/- 1 F.
    const indicated = run(approach(102));
    expect(indicated.evaluation.determination).toBe("ALLOW");
    expect(indicated.receipt.indication_path).toBe("I1");
    expect(indicated.receipt.oem_criterion_selection).toMatchObject({ status: "SELECTED", candidateId: "APP-036", interpolation_performed: false });
    const notIndicated = run(approach(97));
    expect(notIndicated.evaluation.determination).toBe("DENY");
    expect(notIndicated.reasons).toContain("NOT_INDICATED");
    const pistonOnly = run(approach(102, { meteringTypes: ["FIXED_ORIFICE"] }));
    expect(pistonOnly.evaluation.determination).toBe("HOLD");
    expect(pistonOnly.reasons).toContain("OEM_CRITERION_NOT_IN_RECORD_FOR_CONDITIONS");
    const cold = run((i) => { approach(102)(i); i.evidence.measurements.outdoorDryBulb = m(66, "F", 0.5, "CONDENSER_INLET", "THERMO-1"); i.evidence.measurements.liquidLineTemp = m(80, "F", 0.5, "LIQUID_LINE_AT_SERVICE_VALVE", "THERMO-1"); });
    expect(cold.evaluation.criterionSelection.status).toBe("SELECTED");
    const belowWindow = run((i) => { approach(102)(i); i.oem.ambientEnvelope = { min: 55, max: 115, unit: "F", ref: "x" }; i.evidence.measurements.outdoorDryBulb = m(60, "F", 0.5, "CONDENSER_INLET", "THERMO-1"); });
    expect(belowWindow.evaluation.determination).toBe("HOLD");
    expect(belowWindow.reasons).toContain("OEM_CRITERION_NOT_IN_RECORD_FOR_CONDITIONS");
  });
  it("T113 unbounded sides only where OEM-stated; inconsistent ranges or derivations are rejected, never manufactured", () => {
    for (const mutate of [
      (i: Mutable) => { i.oem.ambientEnvelope = { min: 65, max: null, unit: "F", ref: "x" } as never; },
      (i: Mutable) => { i.oem.ambientEnvelope = { min: 65, max: 115, unbounded: "MAX", unit: "F", ref: "x" } as never; },
      setAirflow(cfm({ min: 1000, derivation: { form: "TOLERANCE_BAND", nominal: 1175, tolerance: 125 } })),
      setAirflow(cfm({ derivation: { form: "PER_TON", nominalTons: 3, minPerTon: null, maxPerTon: null } })),
    ]) {
      const { evaluation, reasons } = run(mutate);
      expect(evaluation.determination).toBe("HOLD");
      expect(reasons).toContain("INPUT_INVALID");
    }
    expect(run((i) => { i.oem.ambientEnvelope = { min: 65, max: null, unbounded: "MAX", unit: "F", ref: "OEM: 65F and above" }; }).evaluation.determination).toBe("ALLOW");
  });
  it("T114 I3: event anchor + OEM post-event verification + method conditions + permitted basis -> technical ALLOW via I3, not a fault finding", () => {
    for (const basis of ["POST_CHARGE_CHANGE_OR_REPAIR_VERIFICATION", "NONINVASIVE_EVIDENCE"]) {
      const { evaluation, receipt } = run(i3((i) => { i.request.statedBasis = [basis]; }));
      expect(evaluation.determination).toBe("ALLOW");
      expect(receipt.indication_path).toBe("I3");
      expect(receipt.indication_meaning).toMatch(/^OEM_PRESCRIBED_PRESSURE_BASED_VERIFICATION_ADMISSIBLE_AFTER_RECORDED_EVENT — not an indication of charge fault/);
      expect(evaluation.checks).toContainEqual(expect.objectContaining({ proposition: "P18", result: "SATISFIED", reason: "I3_OEM_POST_EVENT_VERIFICATION" }));
      expect(receipt.gate_b_authorized).toBe(false);
    }
    const chargeChange = run(i3((i) => { i.evidence.events = [{ type: "REFRIGERANT_CHARGE_CHANGED", at: T("09:58") }]; }));
    expect(chargeChange.receipt.indication_path).toBe("I3");
  });
  it("T115 I3 without the event anchor stays HOLD/ESCALATE; a concern, customer claim or unflagged repair never establishes it", () => {
    const noEvent = run(i3((i) => { i.evidence.events = []; i.request.statedBasis = ["NONINVASIVE_EVIDENCE", "CUSTOMER_CLAIM"]; }));
    expect(noEvent.evaluation.determination).toBe("HOLD");
    expect(noEvent.reasons).toEqual(expect.arrayContaining(["OEM_NONINVASIVE_CRITERION_PENDING", "I3_EVENT_ANCHOR_ABSENT"]));
    expect(noEvent.receipt.indication_path).toBeNull();
    const unflagged = run(i3((i) => { i.evidence.events = [{ type: "REPAIR_OR_COMPONENT_REPLACEMENT", at: T("09:58") }]; }));
    expect(unflagged.reasons).toContain("I3_EVENT_ANCHOR_ABSENT");
    const unobtainable = run(i3((i) => { i.evidence.events = []; i.oem.noninvasiveCriterion = { status: "NOT_OBTAINED", obtainable: false }; }));
    expect(unobtainable.evaluation.determination).toBe("ESCALATE");
  });
  it("T116 I3 without OEM-documented post-event verification, with method conditions unmet or ambiguous, or with a prohibited-only basis -> HOLD", () => {
    const cases: Array<[(i: Mutable) => void, string]> = [
      [(i) => { delete (i.oem.chargingMethod as { postEventVerification?: unknown }).postEventVerification; }, "I3_OEM_POST_EVENT_VERIFICATION_NOT_DOCUMENTED"],
      [(i) => { (i.oem.chargingMethod as { pressureBased?: boolean }).pressureBased = false; }, "I3_OEM_POST_EVENT_VERIFICATION_NOT_DOCUMENTED"],
      [(i) => { (i.oem.chargingMethod as typeof I3_METHOD).conditions[0]!.max = 85; }, "I3_METHOD_CONDITIONS_NOT_ESTABLISHED"],
      [(i) => { (i.oem.chargingMethod as typeof I3_METHOD).conditions[0]!.max = 88.2; }, "I3_METHOD_CONDITIONS_AMBIGUOUS"],
      [(i) => { i.request.statedBasis = ["GAUGE_AVAILABLE"]; }, "PROHIBITED_BASIS_RESTATE_REQUIRED"],
      [(i) => { i.request.statedBasis = []; }, "STATED_BASIS_MISSING"],
    ];
    for (const [patch, reason] of cases) {
      const { evaluation, reasons } = run(i3(patch));
      expect(evaluation.technicalDetermination).toBe("HOLD");
      expect(reasons).toContain(reason);
    }
  });
  it("T117 I3 is unavailable where a non-invasive criterion is published; D1 is never reached via I3", () => {
    const published = run((i) => {
      i3()(i);
      i.oem.noninvasiveCriterion = { ...CRITERION(), candidates: [{ ...CRITERION().candidates[0]!, range: { min: 20, max: 26, unit: "F", ref: "x" } }] };
    });
    expect(published.evaluation.determination).toBe("DENY");
    expect(published.reasons).toContain("NOT_INDICATED");
    expect(published.receipt.indication_path).toBeNull();
    const viaI3 = run(i3());
    expect(viaI3.evaluation.checks.some((check) => check.result === "DENY")).toBe(false);
  });
  it("T118 an OEM charging method not applicable to the established metering device -> HOLD", () => {
    const { evaluation, reasons } = run((i) => { i.oem.chargingMethod = { status: "IDENTIFIED", ref: "OEM:superheat (piston)", meteringTypes: ["FIXED_ORIFICE"] } as never; });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("OEM_CHARGING_METHOD_NOT_APPLICABLE_TO_METERING");
  });
  it("T122 the receipt records the binding, constituents, criterion sources, derivations and indication meaning; Gate B never authorized", () => {
    const { receipt } = run(approach(102));
    expect(receipt.indication_meaning).toBe("OEM_NONINVASIVE_CRITERION_INDICATES_PRESSURE_EVIDENCE");
    expect(receipt.oem_reference_provenance).toMatchObject({
      record_id: "NIRET-OEM-SYNTHETIC-TEST-1", pairing_sources: [OUTDOOR_SRC],
      criterion_sources: { airflowCriteria: INDOOR_SRC, noninvasiveCriterion: OUTDOOR_SRC },
    });
    expect((receipt.oem_reference_provenance as { sources: unknown[] }).sources).toHaveLength(2);
    expect((receipt.ambiguity_findings as Array<{ subject: string; range: unknown }>).find((f) => f.subject === "indicator")?.range)
      .toMatchObject({ min: 8, max: 10, derivation: { form: "TOLERANCE_BAND", nominal: 9, tolerance: 1 } });
    expect(receipt.gate_b_authorized).toBe(false);
    expect(receipt.scope).toBe("PRESSURE_EVIDENCE_ONLY");
  });
});

describe("Amendment A9 (C1-R6) — OEM published operating point and measurement-location authority (T123-T132)", () => {
  /** SYNTHETIC fan-performance data (test fixture only). Baseline TESP = 0.5 +/- 0.02 in. w.c. */
  const FAN = () => ({
    ref: "SYN-FAN:Table 3", convention: "external to unit, dry coil, filter in place", designatedSetting: null as string | null,
    settings: [
      { setting: "Tap 3", coolingPermitted: true, points: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((esp, i) => ({ esp, cfm: [1300, 1260, 1220, 1180, 1130, 1080][i] as number })) },
      { setting: "Tap 4", coolingPermitted: false, points: [{ esp: 0.1, cfm: 1400 }, { esp: 0.6, cfm: 1200 }] },
    ],
  });
  const pathB = (patch: (i: Mutable) => void = () => {}) => (i: Mutable) => {
    delete i.oem.airflowCriteria;
    i.oem.fanPerformance = FAN() as never;
    delete i.evidence.measurements.airflow;
    i.evidence.airflowMethod = { method: "OEM_CFM_ESP_TABLE", motorType: "PSC", componentsClean: true, blowerSetting: "Tap 3" };
    patch(i);
  };
  const perTon = (maxPerTon: number) => ({ kind: "CFM_RANGE", range: { min: null, max: null, unit: "CFM", ref: "SYN:caution", derivation: { form: "PER_TON", nominalTons: 3, minPerTon: null, maxPerTon } } });

  it("T123 P08 path (b): identified OEM cooling setting, TESP within OEM data, monotonic bracket, clean -> ALLOW without a two-sided band", () => {
    const { evaluation, receipt } = run(pathB());
    expect(evaluation.determination).toBe("ALLOW");
    expect(receipt.airflow_evidence).toMatchObject({
      path: "OEM_PUBLISHED_OPERATING_POINT", blowerSetting: "Tap 3", designatedSetting: null,
      bracket: { espLow: 0.4, espHigh: 0.6, cfmMin: 1080, cfmMax: 1180 }, convention: "external to unit, dry coil, filter in place",
    });
    expect(run(pathB((i) => { i.oem.fanPerformance = { ...FAN(), designatedSetting: "tap 3" } as never; })).evaluation.determination).toBe("ALLOW");
  });
  it("T124 path (b): setting unidentified, not an OEM cooling setting, or not the OEM-designated setting -> HOLD", () => {
    const cases: Array<[(i: Mutable) => void, string]> = [
      [(i) => { delete i.evidence.airflowMethod!.blowerSetting; }, "BLOWER_SETTING_UNIDENTIFIED"],
      [(i) => { i.evidence.airflowMethod!.blowerSetting = "Tap 9"; }, "BLOWER_SETTING_NOT_OEM_COOLING_SETTING"],
      [(i) => { i.evidence.airflowMethod!.blowerSetting = "Tap 4"; }, "BLOWER_SETTING_NOT_OEM_COOLING_SETTING"],
      [(i) => { i.oem.fanPerformance = { ...FAN(), designatedSetting: "Tap 5" } as never; }, "BLOWER_SETTING_NOT_OEM_DESIGNATED"],
    ];
    for (const [patch, reason] of cases) {
      const { evaluation, reasons, receipt } = run(pathB(patch));
      expect(evaluation.determination).toBe("HOLD");
      expect(reasons).toContain(reason);
      expect((receipt.airflow_evidence as { path: unknown }).path).toBeNull();
    }
  });
  it("T125 path (b): TESP outside or ambiguous against the OEM data -> HOLD; no extrapolation", () => {
    const outside = run(pathB((i) => { i.evidence.measurements.supplyStatic = m(0.9, "IN_WC", 0.01, "SUPPLY_PORT", "MANO-1"); i.oem.espTableDomain = { min: 0.1, max: 1.2, unit: "IN_WC", ref: "x" }; }));
    expect(outside.evaluation.determination).toBe("HOLD");
    expect(outside.reasons).toContain("AIRFLOW_OPERATING_POINT_OUTSIDE_OEM_DATA");
    const edge = run(pathB((i) => { i.evidence.measurements.supplyStatic = m(0.4, "IN_WC", 0.01, "SUPPLY_PORT", "MANO-1"); }));
    expect(edge.evaluation.determination).toBe("HOLD");
    expect(edge.reasons).toContain("AIRFLOW_OPERATING_POINT_AMBIGUOUS");
  });
  it("T126 path (b): a non-monotonic bracket -> HOLD; no interpolated airflow value is produced", () => {
    const { evaluation, reasons, receipt } = run(pathB((i) => {
      const fan = FAN();
      fan.settings[0]!.points = fan.settings[0]!.points.map((point) => (point.esp === 0.5 ? { esp: 0.5, cfm: 1200 } : point));
      i.oem.fanPerformance = fan as never;
    }));
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("AIRFLOW_BRACKET_NOT_MONOTONIC");
    expect((receipt.airflow_evidence as { bracket: unknown }).bracket).toBeNull();
  });
  it("T127 path (b): OEM one-sided limits still enforced; unclean components or unpermitted ECM table method -> HOLD", () => {
    const limited = run(pathB((i) => { i.oem.airflowCriteria = [perTon(350)] as never; }));
    expect(limited.evaluation.determination).toBe("HOLD");
    expect(limited.reasons).toContain("AIRFLOW_OUTSIDE_OEM_RANGE");
    expect(run(pathB((i) => { i.oem.airflowCriteria = [perTon(450)] as never; })).evaluation.determination).toBe("ALLOW");
    expect(run(pathB((i) => { i.evidence.airflowMethod!.componentsClean = false; })).reasons).toContain("COMPONENTS_NOT_ESTABLISHED_CLEAN_FOR_TABLE_METHOD");
    expect(run(pathB((i) => { i.evidence.airflowMethod!.motorType = "ECM"; })).reasons).toContain("OEM_TABLE_METHOD_NOT_PERMITTED_FOR_ECM");
  });
  it("T128 Class A: an OEM-specified location not followed -> HOLD even when a governed method is claimed", () => {
    const { evaluation, reasons, receipt } = run((i) => {
      i.evidence.measurements.returnDryBulb = { ...m(76, "F", 0.5, "RETURN_GRILLE", "THERMO-1"), methodId: "GM-RA-01" };
    });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("MEASUREMENT_LOCATION_NOT_OEM_LOCATION");
    expect((receipt.measurement_authority as Record<string, unknown>).returnDryBulb).toMatchObject({ authorityClass: "A", locationBasis: "UNESTABLISHED", oemLocation: "RETURN_PLENUM" });
  });
  it("T129 Class B/C: OEM silent + governed method with complete provenance -> accepted; missing or inapplicable method -> HOLD", () => {
    const governed = run((i) => {
      delete i.oem.measurementLocations.returnDryBulb;
      i.evidence.measurements.returnDryBulb = { ...m(76, "F", 0.5, "Return test hole, 18 in. upstream of coil", "THERMO-1"), methodId: "GM-RA-01" };
    });
    expect(governed.evaluation.determination).toBe("ALLOW");
    expect((governed.receipt.measurement_authority as Record<string, unknown>).returnDryBulb).toMatchObject({ authorityClass: "B", locationBasis: "GOVERNED_METHOD", methodId: "GM-RA-01", oemLocation: null });
    expect((governed.receipt.measurement_authority as Record<string, unknown>).airflow).toMatchObject({ authorityClass: "C", locationBasis: "GOVERNED_METHOD", methodId: "GM-AF-01" });
    const missing = run((i) => { delete i.oem.measurementLocations.returnDryBulb; });
    expect(missing.evaluation.determination).toBe("HOLD");
    expect(missing.reasons).toContain("OEM_LOCATION_AUTHORITY_UNAVAILABLE");
    const wrong = run((i) => {
      delete i.oem.measurementLocations.returnDryBulb;
      i.evidence.measurements.returnDryBulb = { ...m(76, "F", 0.5, "RETURN_TEST_HOLE", "THERMO-1"), methodId: "GM-SA-01" };
    });
    expect(wrong.reasons).toContain("GOVERNED_METHOD_NOT_APPLICABLE");
    const airflowNoMethod = run((i) => { i.evidence.measurements.airflow = m(1180, "CFM", 30, "SUPPLY_TRUNK", "FLOW-1"); });
    expect(airflowNoMethod.evaluation.determination).toBe("HOLD");
    expect(airflowNoMethod.reasons).toContain("OEM_LOCATION_AUTHORITY_UNAVAILABLE");
  });
  it("T130 suction line as an OEM criterion input without an OEM point -> HOLD, even with a governed method", () => {
    const { evaluation, reasons } = run((i) => {
      i.evidence.measurements.suctionLineTemp = { ...m(55, "F", 0.5, "SUCTION_LINE_AT_SERVICE_VALVE", "THERMO-1"), methodId: "GM-RL-01" };
      i.oem.noninvasiveCriterion = { ...CRITERION(), derivation: { kind: "SINGLE_MEASUREMENT", measurement: "suctionLineTemp" } } as never;
    });
    expect(evaluation.determination).toBe("HOLD");
    expect(reasons).toContain("OEM_LOCATION_AUTHORITY_UNAVAILABLE");
  });
  it("T131 a governed method never supplies an acceptance criterion", () => {
    const noAirflowAuthority = run((i) => { delete i.oem.airflowCriteria; });
    expect(noAirflowAuthority.evaluation.determination).toBe("HOLD");
    expect(noAirflowAuthority.reasons).toContain("OEM_AIRFLOW_RANGE_UNAVAILABLE");
    const noStaticAuthority = run((i) => {
      delete i.oem.espTableDomain;
      delete i.oem.measurementLocations.returnStatic;
      i.evidence.measurements.returnStatic = { ...m(-0.2, "IN_WC", 0.01, "Return test hole at unit", "MANO-1"), methodId: "GM-SP-01" };
    });
    expect(noStaticAuthority.evaluation.determination).toBe("HOLD");
    expect(noStaticAuthority.reasons).toContain("OEM_ESP_RANGE_UNAVAILABLE");
  });
  it("T132 receipt records measurement authority, airflow evidence and derived lineage; generic CFM/ton stays non-generalized", () => {
    const { receipt } = run();
    expect(receipt.airflow_evidence).toMatchObject({ path: "OEM_ACCEPTANCE_CRITERION" });
    expect(receipt.derived_tesp).toMatchObject({ lineage: { method: "GM-DV-01", inputs: ["supplyStatic", "returnStatic"] } });
    expect(Object.keys(receipt.measurement_authority as object)).toEqual(expect.arrayContaining(["returnDryBulb", "airflow", "returnStatic"]));
    expect(spec.not_generalized).toContain("ACCA 5 QI informative 55F/60F ambient and 350-450 CFM/ton");
    expect(spec.governed_measurement_methods.map((method) => method.id)).toEqual(["GM-RA-01", "GM-SA-01", "GM-OA-01", "GM-RL-01", "GM-SP-01", "GM-AF-01", "GM-EL-01", "GM-DV-01"]);
    expect(JSON.stringify(spec.governed_measurement_methods)).not.toMatch(/cfm\/ton|CFM per ton|\b(350|400|450)\b/i);
    expect(receipt.gate_b_authorized).toBe(false);
  });
});
