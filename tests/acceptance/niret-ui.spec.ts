import { readdirSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { sha256Canonical } from "../../packages/crypto/receipts.js";
import { FROZEN_SPEC_SHA256, runGateA } from "../../packages/domain/niret/index.js";
import { DeterminationPanel, ReceiptPanel, type EvaluationResponse } from "../../apps/web/components/niret/NiretResult";
import { buildGateAInput } from "../../apps/web/lib/niret/evidence-adapter";
import { emptyNiretForm, type NiretFormState } from "../../apps/web/lib/niret/form-state";
import { describeReason, NEXT_ACTION_LABELS, REASON_MESSAGES } from "../../apps/web/lib/niret/labels";
import {
  BOUNDARY_NOTICE, cfmPerTonContext, ENTRY_AUTHORIZED, ENTRY_NOT_AUTHORIZED, EXECUTION_TEXT, fieldsNeedingAttention, presentReceipt,
  TECHNICAL_TEXT, type ReceiptLike,
} from "../../apps/web/lib/niret/presentation";
import {
  applyServerEvidence, evaluateNiretSubmission, NO_SOURCES, stampEvaluatedAt, submissionContext, type EvaluationSources,
} from "../../apps/web/lib/niret/server-evaluate";
import spec from "../../packages/domain/niret/gate-a-c1.spec.json";
import { GOVERNED_OEM_REGISTRY } from "../../packages/domain/niret/oem-registry/index.js";
import { completeForm, SERVER_NOW, T } from "./fixtures/niret-complete-form";
import { hypotheticalRegistry } from "./fixtures/niret-hypothetical-oem-record";

/*
 * OEM ranges, run times and locations below are SYNTHETIC FIXTURES standing in
 * for a technician's transcription of a model-specific OEM document.
 */


/** Test doubles for independent, server-side sources (certification, authority) and a HYPOTHETICAL governed OEM registry. */
const TEST_SOURCES: EvaluationSources = {
  submitter: { accountId: "account-uuid-1" },
  certificationVerifier: { verify: () => ({ status: "VERIFIED", verifier: "INDEPENDENT-VERIFIER-TEST", reference: "VR-TEST-1", verifiedAt: T("10:10") }) },
  authorityEstablisher: {
    establish: (element) => ({
      status: "ESTABLISHED",
      finding: { identity: "MATCHES_DECLARED_TECHNICIAN", workScope: "INCLUDES_DIAGNOSIS", sitePermission: "GRANTED", jurisdiction: "NOT_REQUIRED" }[element],
      source: "DISPATCH-AUTHORITY-TEST", reference: `AUTH-${element}`, establishedAt: T("09:45"),
    }),
  },
  oemRegistry: hypotheticalRegistry(),
};
/** Production default (as the route): authenticated submitter and the shipped, empty governed OEM registry. */
const PRODUCTION_SOURCES: EvaluationSources = { ...NO_SOURCES, submitter: { accountId: "account-uuid-1" }, oemRegistry: GOVERNED_OEM_REGISTRY };

/** The UI path: form -> adapter -> server evaluator (server clock, server-side verification). */
function uiEvaluate(mutate: (form: NiretFormState) => void = () => {}, sources: EvaluationSources = TEST_SOURCES) {
  const form = completeForm();
  mutate(form);
  const input = buildGateAInput(form, { requestId: "NIRET-TEST-1" });
  const { receipt, findings } = evaluateNiretSubmission(JSON.parse(JSON.stringify(input)), SERVER_NOW, sources);
  return { form, input, findings, receipt: receipt as unknown as ReceiptLike & Record<string, unknown> };
}

/** The same input through the engine directly, prepared exactly as the server prepares it. */
const direct = (input: unknown, sources: EvaluationSources = TEST_SOURCES) =>
  runGateA(applyServerEvidence(stampEvaluatedAt(JSON.parse(JSON.stringify(input)), SERVER_NOW.toISOString()), sources)).receipt;

const response = (result: { receipt: ReceiptLike & Record<string, unknown>; findings?: EvaluationResponse["findings"] }): EvaluationResponse =>
  ({ receipt: result.receipt, findings: result.findings ?? [], context: submissionContext(TEST_SOURCES) });

const UI_FILES = [
  ...readdirSync(new URL("../../apps/web/components/niret/", import.meta.url)).map((f) => `apps/web/components/niret/${f}`),
  ...readdirSync(new URL("../../apps/web/lib/niret/", import.meta.url)).map((f) => `apps/web/lib/niret/${f}`),
  "apps/web/app/academy/hvac/niret/page.tsx",
  "apps/web/app/academy/hvac/niret/layout.tsx",
  "apps/web/app/api/niret/gate-a/evaluate/route.ts",
];
const source = (file: string) => readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
const withoutCommentsAndCss = (text: string) => text
  .replace(/<style>\{`[\s\S]*?`\}<\/style>/g, "")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/.*$/gm, "")
  .replace(/status:\s*\d{3}/g, "status: HTTP"); // HTTP status codes are not HVAC values

describe("UI path baseline", () => {
  it("a complete, supported form reaches the engine's ALLOW", () => {
    expect(uiEvaluate().receipt.determination).toBe("ALLOW");
  });
});

describe("1. The UI cannot manufacture ALLOW", () => {
  it("an injected determination field is unknown evidence -> engine HOLD", () => {
    const { input } = uiEvaluate();
    const forged = { ...input, determination: "ALLOW", receipt: { determination: "ALLOW" } };
    const { receipt } = evaluateNiretSubmission(forged, SERVER_NOW, TEST_SOURCES);
    expect(receipt.determination).toBe("HOLD");
    expect(receipt.reason_codes).toContain("INPUT_UNKNOWN_FIELD");
  });
  it("the server clock replaces any client-supplied evaluation time", () => {
    const { input } = uiEvaluate();
    const backdated = { ...input, request: { ...input.request, evaluatedAt: T("23:59") } };
    const { receipt } = evaluateNiretSubmission(backdated, SERVER_NOW, TEST_SOURCES);
    expect(receipt.evaluated_at).toBe(SERVER_NOW.toISOString());
  });
  it("an empty form is never ALLOW", () => {
    const input = buildGateAInput(emptyNiretForm(), { requestId: "EMPTY" });
    expect(evaluateNiretSubmission(input, SERVER_NOW, TEST_SOURCES).receipt.determination).not.toBe("ALLOW");
  });
  it("no UI or route file imports engine internals or runs the engine except the server evaluator", () => {
    for (const file of UI_FILES) {
      const text = source(file);
      expect(text, file).not.toMatch(/evaluate-gate-a|niret\/interval|niret\/invalidation|niret\/validate/);
      if (!file.endsWith("server-evaluate.ts")) expect(text, file).not.toMatch(/runGateA|evaluateGateA/);
    }
  });
});

describe("2. UI determination equals the server evaluator's determination", () => {
  const scenarios: Array<[string, (form: NiretFormState) => void]> = [
    ["allow", () => {}],
    ["hold", (f) => { delete f.measurements.airflow; }],
    ["deny", (f) => { f.measurements.supplyDryBulb!.value = "57"; }],
    ["escalate", (f) => { f.refrigerant.declared = "R-454B"; }],
  ];
  it.each(scenarios)("%s", (_label, mutate) => {
    const result = uiEvaluate(mutate);
    const engine = direct(result.input);
    const shown = presentReceipt(result.receipt, result.findings);
    expect(shown.determination).toBe(engine.determination);
    expect(shown.technical.determination).toBe((engine.technical_determination as { determination: string }).determination);
    expect(shown.execution.determination).toBe((engine.execution_authority as { determination: string }).determination);
    expect(shown.headline).toBe(engine.determination === "ALLOW" ? ENTRY_AUTHORIZED : ENTRY_NOT_AUTHORIZED);
    const html = renderToStaticMarkup(createElement(DeterminationPanel, { response: response(result), nominalCapacityBtuh: "" }));
    expect(html).toContain(shown.headline);
    expect(html).toContain(TECHNICAL_TEXT[shown.technical.determination].headline);
    expect(html).toContain(EXECUTION_TEXT[shown.execution.determination].headline);
    expect(html).toContain("Technical ALLOW is not authority to execute.");
  });
});

describe("3. Missing evidence maps to the right fields and next actions", () => {
  it("missing airflow and entering wet bulb are reported against those fields", () => {
    const { receipt } = uiEvaluate((f) => { delete f.measurements.airflow; delete f.measurements.returnWetBulb; });
    expect(receipt.determination).toBe("HOLD");
    expect(fieldsNeedingAttention(receipt)).toEqual(expect.arrayContaining(["airflow"]));
    const shown = presentReceipt(receipt);
    const p08 = shown.unresolved.find((item) => item.proposition === "P08");
    expect(p08?.nextAction).toBe(NEXT_ACTION_LABELS.ESTABLISH_AIRFLOW_WITHIN_OEM_RANGE);
    expect(shown.unresolved.map((item) => item.proposition)).toEqual(expect.arrayContaining(["P08", "P12"]));
    expect(shown.establishedCount + shown.unresolved.length).toBe(shown.requiredCount);
  });
});

describe("4. Non-applicable fields do not create false failures", () => {
  it("empty supply wet bulb, outdoor wet bulb/RH, line temps, voltage and currents still allow ALLOW", () => {
    const { input, receipt } = uiEvaluate();
    expect(receipt.determination).toBe("ALLOW");
    const keys = Object.keys(input.evidence.measurements);
    for (const absent of ["supplyWetBulb", "outdoorWetBulb", "outdoorRh", "suctionLineTemp", "liquidLineTemp", "supplyVoltage", "compressorCurrent"]) {
      expect(keys).not.toContain(absent);
    }
    expect(fieldsNeedingAttention(receipt)).toEqual([]);
  });
});

describe("5. Premature gauge-entry request is governed by Gate A", () => {
  it.each(["PROPOSED_OUTSIDE_GATE_A", "ATTEMPTED", "INSTRUMENTS_CONNECTED"] as const)("%s -> governed DENY", (entry) => {
    const result = uiEvaluate((f) => { f.pressureSideEntry = entry; });
    const { receipt } = result;
    expect(receipt.determination).toBe("DENY");
    expect(receipt.reason_codes).toContain("PRESSURE_INSTRUMENT_ENTRY_NOT_AUTHORIZED");
    const shown = presentReceipt(receipt);
    expect(shown.prematureEntry).toBe(true);
    const html = renderToStaticMarkup(createElement(DeterminationPanel, { response: response(result), nominalCapacityBtuh: "" }));
    expect(html).toContain("not authorized before a Gate-A ALLOW");
    expect(html).toContain("does not end the diagnostic workflow");
  });
  it("the request control submits PROPOSED_OUTSIDE_GATE_A to the engine rather than validating locally", () => {
    const workbench = source("apps/web/components/niret/NiretWorkbench.tsx");
    expect(workbench).toMatch(/evaluate\("PROPOSED_OUTSIDE_GATE_A"\)/);
  });
});

describe("6. Complete-looking input can still return HOLD, DENY or ESCALATE", () => {
  it("complete form, indicator within the OEM criterion -> DENY", () => {
    expect(uiEvaluate((f) => { f.measurements.supplyDryBulb!.value = "57"; }).receipt.determination).toBe("DENY");
  });
  it("complete form, A2L refrigerant -> ESCALATE", () => {
    expect(uiEvaluate((f) => { f.refrigerant.declared = "R-32"; }).receipt.determination).toBe("ESCALATE");
  });
  it("complete form, airflow uncertainty straddles the OEM boundary -> HOLD", () => {
    expect(uiEvaluate((f) => { f.measurements.airflow!.value = "1290"; }).receipt.determination).toBe("HOLD");
  });
  it("complete form, static direction missing -> HOLD (no silent sign)", () => {
    expect(uiEvaluate((f) => { f.staticDirection.returnStatic = ""; }).receipt.determination).toBe("HOLD");
  });
});

describe("7. No generic HVAC threshold in the UI layer", () => {
  it("UI logic contains no universal thresholds or numeric comparisons", () => {
    for (const file of UI_FILES) {
      const text = withoutCommentsAndCss(source(file));
      expect(text, file).not.toMatch(/(?<![\w.])(400|350|450|0?\.50?|18|22)(?![\w.])\s*(CFM|cfm|°|\/ton)?/);
      expect(text, file).not.toMatch(/[<>]=?\s*-?(?!0(?![.\d]))\d+(\.\d+)?(?![\w])/); // comparisons against a non-zero number
    }
  });
  it("only the unit definition of a ton appears as a constant in presentation logic", () => {
    const literals = withoutCommentsAndCss(source("apps/web/lib/niret/presentation.ts")).match(/(?<![\w.$-])\d[\d_]*(\.\d+)?(?![\w])/g) ?? [];
    expect(literals.filter((n) => n !== "0")).toEqual(["12_000"]);
  });
});

describe("8. CFM per ton is contextual only", () => {
  it("shown only after the engine establishes airflow; never sent to Gate A; changes no receipt", () => {
    const allow = uiEvaluate();
    const context = cfmPerTonContext(allow.receipt, "36000");
    expect(context?.value).toBeCloseTo(393.3, 1);
    expect(context?.note).toMatch(/Context only/);
    expect(JSON.stringify(allow.input)).not.toMatch(/nominalCapacity|cfmPerTon/i);
    const otherCapacity = uiEvaluate((f) => { f.equipment.nominalCapacityBtuh = "24000"; });
    expect(otherCapacity.receipt.content_hash).toBe(allow.receipt.content_hash);
    const hold = uiEvaluate((f) => { f.measurements.airflow!.value = "1290"; });
    expect(cfmPerTonContext(hold.receipt, "36000")).toBeNull();
    expect(cfmPerTonContext(allow.receipt, "")).toBeNull();
  });
});

describe("9. The UI path returns the evaluator's canonical receipt", () => {
  it("identical to the direct engine receipt, with a verifiable content hash", () => {
    const result = uiEvaluate();
    const { input, receipt } = result;
    expect(receipt).toEqual(direct(input));
    const { receipt_id: _id, content_hash: hash, ...body } = receipt;
    expect(sha256Canonical(body)).toBe(hash);
    expect(receipt.frozen_spec_sha256).toBe(FROZEN_SPEC_SHA256);
    const html = renderToStaticMarkup(createElement(ReceiptPanel, { response: response(result) }));
    expect(html).toContain(receipt.content_hash);
    expect(html).toContain(receipt.receipt_id);
  });
  it("findings are the same evaluation's failing checks: their reasons equal the receipt's reason codes", () => {
    for (const mutate of [() => {}, (f: NiretFormState) => { delete f.measurements.airflow; }, (f: NiretFormState) => { f.refrigerant.declared = "R-32"; }]) {
      const { receipt, findings } = uiEvaluate(mutate);
      expect([...new Set(findings.map((finding) => finding.reason))].sort()).toEqual(receipt.reason_codes);
    }
  });
});

describe("10. No Gate-B action exists in this interface", () => {
  it("no button, endpoint, or next action moves refrigerant", () => {
    for (const file of UI_FILES.filter((f) => f.endsWith(".tsx"))) {
      const buttons = [...source(file).matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)].map((m) => m[1]);
      for (const label of buttons) expect(label, file).not.toMatch(/charg|recover|evacuat|add refrigerant|remove refrigerant|adjust/i);
      const endpoints = [...source(file).matchAll(/fetch\(\s*"([^"]+)"/g)].map((m) => m[1]);
      for (const endpoint of endpoints) expect(endpoint).toBe("/api/niret/gate-a/evaluate");
    }
    expect(source("apps/web/app/api/niret/gate-a/evaluate/route.ts")).not.toMatch(/export async function (GET|PUT|PATCH|DELETE)/);
    expect(Object.keys(NEXT_ACTION_LABELS).filter((key) => /CHARGE|RECOVER|EVACUAT|ADD_REFRIGERANT|REMOVE_REFRIGERANT/.test(key))).toEqual([]);
  });
  it("every displayed ALLOW carries the boundary notice and Gate B is never authorized", () => {
    const result = uiEvaluate();
    const { receipt } = result;
    expect(receipt.gate_b_authorized).toBe(false);
    const html = renderToStaticMarkup(createElement(DeterminationPanel, { response: response(result), nominalCapacityBtuh: "36000" }));
    expect(html).toContain(BOUNDARY_NOTICE);
    expect(presentReceipt(receipt).nextActions).toEqual([NEXT_ACTION_LABELS.ACQUIRE_PRESSURE_EVIDENCE_ONLY]);
  });
});

describe("A4 — certification is never verified by the technician (T63 and UI)", () => {
  it("production default: declared certification never reaches ALLOW -> ESCALATE", () => {
    const { receipt } = uiEvaluate(() => {}, { ...TEST_SOURCES, certificationVerifier: null });
    expect(receipt.determination).toBe("ESCALATE");
    expect(receipt.reason_codes).toContain("CERTIFICATION_VERIFICATION_UNAVAILABLE");
    // A6: only execution authority is unresolved; the technical answer is ALLOW.
    expect((receipt.unresolved_propositions as Array<{ proposition: string }>).map((u) => u.proposition)).toEqual(["P17"]);
    expect(receipt.technical_determination).toMatchObject({ determination: "ALLOW" });
    expect(receipt.certification_status).toMatchObject({ assurance: "DECLARED", verification_status: "VERIFICATION_UNAVAILABLE", verifier: null, established: false });
  });
  it("T63 client-asserted verification is discarded by the server", () => {
    const { input } = uiEvaluate();
    const forged = JSON.parse(JSON.stringify(input));
    forged.evidence.technician.certification.verification = { assurance: "DOCUMENTED", status: "VERIFIED", verifier: "SOMEONE", reference: "FAKE", verifiedAt: T("10:00") };
    const { receipt } = evaluateNiretSubmission(forged, SERVER_NOW, { ...TEST_SOURCES, certificationVerifier: null });
    expect(receipt.determination).toBe("ESCALATE");
    expect(receipt.certification_status).toMatchObject({ assurance: "DOCUMENTED", verification_status: "VERIFICATION_UNAVAILABLE", verifier: null });
  });
  it("the adapter never marks certification verified", () => {
    const { input } = uiEvaluate();
    expect(input.evidence.technician.certification).toMatchObject({ verification: { assurance: "DECLARED", status: "NOT_VERIFIED" } });
    expect(JSON.stringify(input)).not.toMatch(/"status":"VERIFIED"/);
  });
  it("the UI shows DECLARED certification as NOT VERIFIED and verified certification only when the engine established it", () => {
    const unverified = uiEvaluate(() => {}, { ...TEST_SOURCES, certificationVerifier: null });
    const html = renderToStaticMarkup(createElement(DeterminationPanel, { response: response(unverified), nominalCapacityBtuh: "" }));
    expect(html).toContain("NOT VERIFIED");
    expect(presentReceipt(unverified.receipt).certification?.verified).toBe(false);
    const verified = presentReceipt(uiEvaluate().receipt).certification;
    expect(verified?.verified).toBe(true);
    expect(verified?.summary).toContain("VERIFIED by INDEPENDENT-VERIFIER-TEST");
  });
});

describe("Plain-language technician messages (canonical codes preserved)", () => {
  it("every reason code the engine can emit has a plain-language message", () => {
    const engine = readFileSync(new URL("../../packages/domain/niret/evaluate-gate-a.ts", import.meta.url), "utf8");
    // Failing checks: checks.add(prop, "HOLD"|"ESCALATE"|"DENY", "CODE") plus ternary-chosen failing codes.
    const direct = [...engine.matchAll(/checks\.add\([^,]+,\s*"(HOLD|ESCALATE|DENY)",\s*"([A-Z0-9_]+)"/g)].map((match) => match[2]);
    const ternary = [...engine.matchAll(/checks\.add\([^;]*\?\s*"(?:HOLD|ESCALATE)"\s*:\s*"(?:HOLD|ESCALATE)",\s*[^;]*?\?\s*"([A-Z0-9_]+)"\s*:\s*"([A-Z0-9_]+)"/gs)]
      .flatMap((match) => [match[1], match[2]]);
    const emitted = [...direct, ...ternary];
    expect(emitted.length).toBeGreaterThan(60);
    const a5 = spec.amendments.A5_authority_standing_and_oem_provenance.authority_elements.codes;
    const generated = Object.values(a5).flatMap((code) =>
      ["_NOT_ESTABLISHED", "_ESTABLISHMENT_UNAVAILABLE", "_ESTABLISHMENT_EVIDENCE_INCOMPLETE", "_SELF_ESTABLISHMENT_REJECTED"].map((suffix) => `${code}${suffix}`));
    const missing = [...new Set([...emitted, ...generated])].filter((code) => !REASON_MESSAGES[code]);
    expect(missing).toEqual([]);
  });
  it("INPUT_INVALID on the airflow value reads as a plain airflow message", () => {
    expect(describeReason("INPUT_INVALID", ["/evidence/measurements/airflow/value: must be number"]))
      .toEqual(["Airflow (CFM) reading is missing or invalid. Enter the measured value before continuing."]);
  });
  it("a missing measurement reads in field language", () => {
    expect(describeReason("AIRFLOW_UNAVAILABLE", ["airflow"])).toEqual(["Airflow (CFM) reading is missing. Enter the measured value before continuing."]);
  });
  it("an invalid entered value is shown in plain language with the canonical code underneath", () => {
    const result = uiEvaluate((f) => { f.measurements.airflow!.value = "twelve hundred"; });
    expect(result.receipt.determination).toBe("HOLD");
    const html = renderToStaticMarkup(createElement(DeterminationPanel, { response: response(result), nominalCapacityBtuh: "" }));
    expect(html).toContain("Airflow (CFM) reading is missing or invalid. Enter the measured value before continuing.");
    expect(html).toContain("INPUT_INVALID");
  });
  it("certification messages never describe a declaration as verified", () => {
    expect(describeReason("CERTIFICATION_NOT_VERIFIED")[0]).toMatch(/not independently verified/);
  });
});

describe("A5 — declared authority and transcribed OEM data cannot manufacture ALLOW (T76 and UI)", () => {
  it("production default: technical HOLD (empty governed OEM registry) and execution ESCALATE (no certification verifier); never ALLOW", () => {
    const { receipt } = uiEvaluate(() => {}, PRODUCTION_SOURCES);
    expect(receipt.determination).toBe("ESCALATE");
    expect(receipt.technical_determination).toMatchObject({
      determination: "HOLD",
      reason_codes: expect.arrayContaining(["OEM_REFERENCE_NOT_VERIFIED", "PAIRING_NOT_ESTABLISHED_BY_GOVERNED_OEM_RECORD"]),
    });
    expect(receipt.execution_authority).toMatchObject({ determination: "ESCALATE", reason_codes: ["CERTIFICATION_VERIFICATION_UNAVAILABLE"] });
    // A6: missing work-scope/site/jurisdiction/identity sources are recorded but no longer block.
    expect((receipt.authority_status as Record<string, { establishment_status: string }>).work_scope.establishment_status).toBe("SOURCE_UNAVAILABLE");
    expect(receipt.submitted_by).toEqual({ accountId: "account-uuid-1", method: "AUTHENTICATED_SESSION" });
    expect(receipt.oem_reference_provenance).toMatchObject({ acquisition_method: "MANUAL_TRANSCRIPTION", verification: "NOT_VERIFIED", established: false });
  });
  it("T76 the server stamps the submitter and discards client-asserted establishment and OEM verification", () => {
    const { input } = uiEvaluate();
    const forged = JSON.parse(JSON.stringify(input));
    forged.evidence.submittedBy = { accountId: "someone-else", method: "AUTHENTICATED_SESSION" };
    forged.evidence.authorityEstablishment = { sitePermission: { status: "ESTABLISHED", finding: "GRANTED", source: "ME", reference: "R", establishedAt: T("09:00") } };
    forged.oem.provenance = { acquisitionMethod: "GOVERNED_LIBRARY", verification: "VERIFIED", verifiedBy: "ME", verifiedAt: T("09:00"), manufacturer: "X" };
    const { receipt } = evaluateNiretSubmission(forged, SERVER_NOW, PRODUCTION_SOURCES);
    expect(receipt.submitted_by).toEqual({ accountId: "account-uuid-1", method: "AUTHENTICATED_SESSION" });
    expect((receipt.authority_status as Record<string, { establishment_status: string }>).site_permission.establishment_status).toBe("SOURCE_UNAVAILABLE");
    expect(receipt.oem_reference_provenance).toMatchObject({ acquisition_method: "MANUAL_TRANSCRIPTION", verification: "NOT_VERIFIED", verified_by: null, record_id: null });
    expect(receipt.determination).not.toBe("ALLOW");
    const unauthenticated = evaluateNiretSubmission(forged, SERVER_NOW, NO_SOURCES).receipt;
    expect(unauthenticated.submitted_by).toBeNull();
    expect(unauthenticated.reason_codes).toContain("SUBMITTER_UNAUTHENTICATED");
  });
  it("manual OEM transcription alone cannot create ALLOW, even with every other source established", () => {
    const noRegistry = uiEvaluate(() => {}, { ...TEST_SOURCES, oemRegistry: null });
    expect(noRegistry.receipt.determination).toBe("ESCALATE");
    expect(noRegistry.receipt.reason_codes).toEqual(expect.arrayContaining(["OEM_REFERENCE_VERIFICATION_UNAVAILABLE"]));
    const emptyRegistry = uiEvaluate(() => {}, { ...TEST_SOURCES, oemRegistry: GOVERNED_OEM_REGISTRY });
    expect(emptyRegistry.receipt.determination).toBe("HOLD");
    expect(emptyRegistry.receipt.reason_codes).toEqual(expect.arrayContaining(["OEM_REFERENCE_NOT_VERIFIED", "PAIRING_NOT_ESTABLISHED_BY_GOVERNED_OEM_RECORD"]));
    expect(uiEvaluate().receipt.determination).toBe("ALLOW");
  });
  it("measurements remain usable evidence when the OEM reference is only transcribed", () => {
    const { receipt } = uiEvaluate(() => {}, PRODUCTION_SOURCES);
    for (const proposition of ["P05", "P08", "P09", "P10", "P11", "P12", "P13"]) expect(receipt.established_propositions).toContain(proposition);
    expect(receipt.derived_tesp).toMatchObject({ value: 0.5, uncertainty: 0.02, unit: "IN_WC" });
  });
  it("the adapter sends OEM information only as a manual, unverified transcription with its provenance", () => {
    const { input } = uiEvaluate();
    expect(input.oem.provenance).toEqual({
      acquisitionMethod: "MANUAL_TRANSCRIPTION", verification: "NOT_VERIFIED", manufacturer: "ExampleCo", model: "CU-200",
      documentId: "Installation & Service Manual", revision: "Rev A (2024-03)", pageRef: "Charging, p.14", sourceRef: "file://ExampleCo-CU200-IOM-RevA.pdf",
    });
    expect(JSON.stringify(input)).not.toMatch(/authorityEstablishment|submittedBy/);
  });
  it("the UI shows declared authority and transcribed OEM data as NOT ESTABLISHED / NOT VERIFIED", () => {
    const result = uiEvaluate(() => {}, PRODUCTION_SOURCES);
    const html = renderToStaticMarkup(createElement(DeterminationPanel, { response: response(result), nominalCapacityBtuh: "" }));
    expect(html).toContain("Site/property permission: declared: GRANTED · NOT ESTABLISHED — no independent source available");
    expect(html).toContain("(manual transcription) · NOT VERIFIED");
    expect(html).toContain("identifies the submitter only");
    const shown = presentReceipt(uiEvaluate().receipt);
    expect(shown.authority.every((item) => item.established)).toBe(true);
    expect(shown.oemProvenance?.established).toBe(true);
  });
});

describe("A6 — two-part technician result", () => {
  it("technical ALLOW + execution HOLD reads unmistakably in the panel", () => {
    const result = uiEvaluate((f) => { f.job.certificationAssurance = "DOCUMENTED"; }, {
      ...TEST_SOURCES,
      certificationVerifier: { verify: () => ({ status: "NOT_VERIFIED" }) },
    });
    expect(result.receipt.determination).toBe("HOLD");
    const html = renderToStaticMarkup(createElement(DeterminationPanel, { response: response(result), nominalCapacityBtuh: "" }));
    expect(html).toContain("TECHNICAL NIRET: ALLOW");
    expect(html).toContain("Sufficient admissible non-invasive evidence exists to justify obtaining pressure evidence.");
    expect(html).toContain("EXECUTION AUTHORITY: HOLD / NOT ESTABLISHED");
    expect(html).toContain("Pressure-instrument entry may not yet be executed.");
    expect(html).toContain(ENTRY_NOT_AUTHORIZED);
    expect(html).toContain("Do not connect pressure instruments yet.");
    expect(html).not.toContain(ENTRY_AUTHORIZED);
  });
});
