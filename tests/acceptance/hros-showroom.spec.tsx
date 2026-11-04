/**
 * Regression: the HROS v3.3 interactive showroom (TA-14-AIGR-000046) must
 *   - reproduce the permanent Registry record's claims, non-claims and limitations verbatim (digests below were
 *     computed from GET /api/registry/public/TA-14-AIGR-000046 when the showroom was prepared);
 *   - preserve all five public evidence items with their SHA-256 digests and registrant-stated claim support;
 *   - offer every visitor-operable condition with accessible, stateful controls;
 *   - keep declared architecture visibly separate from TA-14 examination, and never present registration as
 *     certification, validation or proof;
 *   - be listed in the Registered Governance showroom directory.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HrosShowroom from "../../apps/web/app/governance-showcase/TA-14-AIGR-000046/hros-showroom";
import {
  HROS_CONDITIONS,
  HROS_EVIDENCE,
  HROS_LINKS,
  HROS_LIVING_HISTORY,
  HROS_NODES,
  NEXT_EXAMINATION_SURFACES,
  REGISTERED_FORMAL_CLAIMS,
  REGISTERED_KNOWN_LIMITATIONS,
  REGISTERED_NON_CLAIMS,
  REGISTRATION_ESTABLISHED,
  REGISTRATION_NOT_ESTABLISHED,
  type ConditionId,
} from "../../apps/web/app/governance-showcase/TA-14-AIGR-000046/showroom-data";

const sha256 = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
const decode = (html: string) =>
  html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const render = (props: { initialCondition?: ConditionId; initialClaim?: number | null } = {}) =>
  decode(renderToStaticMarkup(<HrosShowroom {...props} />));
const text = (html: string) => html.replace(/<style>[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

const EXPECTED_EVIDENCE: Array<[string, string, number[]]> = [
  ["HROS_Attribution_Gate_Execution_Boundary.jpg", "bb9fc4099046bc349eb3862d36bd0cadf952f5e13e0dc3f438711aeece2d637e", [2, 3, 5]],
  ["DeepKang_Labs_IAST_Corpus_Review_Independent_Evaluation.pdf", "2816bb3c1e12edcc54d234951fe11cf610e5dd7c69d044cdb5dda6ceedab5731", [1, 4, 6]],
  ["WeRAI_Sovereign_Mesh_Architecture_Infographic.jpg", "4bfdbf028840a76b10ad2145bf652c1601cfdc9723c55703bab784a1ca0a2621", [7]],
  ["HROS_HABITS_Foundational_Architecture_v2.0.pdf", "fafc5f5316e661b6fb8734ab8f3ae4bc18dc68f5704e47067df43085e06a0137", [1, 2, 3, 4]],
  ["HROS_Document_Laundering_Matrix_Forensic_Anatomy.pdf", "6d3120de1b30b975760a1916bdfeaf623a12909b86d13aab482a14fdd22941bb", [4, 5, 6]],
];

const REQUIRED_CONDITIONS: ConditionId[] = [
  "baseline",
  "missing-signature",
  "authority-revoked",
  "transport-bypass",
  "historian-failure",
  "compromised-host",
  "authorization-fatigue",
];

describe("HROS showroom — verbatim Registry record", () => {
  it("formal claims, non-claims and known limitations match the registered text byte for byte", () => {
    expect(sha256(REGISTERED_FORMAL_CLAIMS.join("\n"))).toBe("28e8af9dff31cf4858f3eba65bf2f5c3a7c758ccdb96d704cbb47bea671ca5be");
    expect(sha256(REGISTERED_NON_CLAIMS.join("\n"))).toBe("850b49908fb2fcd7a4bd814703cacbeaf51cbe1eec016e107ba6df06efdc2b82");
    expect(sha256(REGISTERED_KNOWN_LIMITATIONS.join("\n"))).toBe("ae8a1db9a8c05ccc0c7fd21bf0d09d997f4becff35217cb046c4496a488b888d");
    expect([REGISTERED_FORMAL_CLAIMS.length, REGISTERED_NON_CLAIMS.length, REGISTERED_KNOWN_LIMITATIONS.length]).toEqual([7, 5, 4]);
  });

  it("renders every registered claim, non-claim and limitation on the page", () => {
    const page = text(render());
    for (const line of [...REGISTERED_FORMAL_CLAIMS, ...REGISTERED_NON_CLAIMS, ...REGISTERED_KNOWN_LIMITATIONS]) {
      const [heading, body] = [line.slice(0, line.indexOf(": ")), line.slice(line.indexOf(": ") + 2)];
      expect(page).toContain(heading);
      expect(page).toContain(body);
    }
  });
});

describe("HROS showroom — preserved evidence", () => {
  it("preserves all five public evidence items with SHA-256 digests and stated claim support", () => {
    expect(HROS_EVIDENCE.map((e) => [e.fileName, e.sha256, e.supportsClaims])).toEqual(EXPECTED_EVIDENCE);
    const page = render();
    for (const [fileName, hash] of EXPECTED_EVIDENCE) {
      expect(page).toContain(fileName);
      expect(page).toContain(hash);
    }
    for (const item of HROS_EVIDENCE) expect(page).toContain(item.description);
  });

  it("each description's stated claim numbers agree with the structured claim support", () => {
    for (const item of HROS_EVIDENCE) {
      const stated = item.description.slice(0, item.description.indexOf(":")).match(/\d+/g)!.map(Number);
      expect(stated).toEqual(item.supportsClaims);
    }
  });

  it("labels the registrant-described 'independent' review as registrant-submitted, not a TA-14 finding", () => {
    const deepKang = HROS_EVIDENCE.find((e) => e.fileName.startsWith("DeepKang"))!;
    expect(deepKang.note).toMatch(/Registrant-submitted/);
    expect(deepKang.note).toMatch(/not a TA-14 review/);
  });

  it("the claim trace narrows evidence to the items that state support for the chosen claim", () => {
    for (const claim of [1, 2, 3, 4, 5, 6, 7]) {
      const page = render({ initialClaim: claim });
      const active = [...page.matchAll(/data-active="true"/g)].length;
      expect(active).toBe(EXPECTED_EVIDENCE.filter(([, , claims]) => claims.includes(claim)).length);
      expect(page).toContain(`items state support for Claim ${claim}`);
    }
    expect([...render({ initialClaim: null }).matchAll(/data-active="true"/g)].length).toBe(5);
  });
});

describe("HROS showroom — interactive declared authority chain", () => {
  it("chains PROPOSAL → GATE → HUMAN AUTHORITY → RECEIPT → EXECUTION → PROVENANCE", () => {
    expect(HROS_NODES.map((n) => n.label)).toEqual(["PROPOSAL", "GATE", "HUMAN AUTHORITY", "RECEIPT", "EXECUTION", "PROVENANCE"]);
  });

  it("offers all seven visitor-operable conditions", () => {
    expect(HROS_CONDITIONS.map((c) => c.id)).toEqual(REQUIRED_CONDITIONS);
  });

  it.each(REQUIRED_CONDITIONS)("condition %s renders its state with accessible, pressed controls and a live region", (id) => {
    const condition = HROS_CONDITIONS.find((c) => c.id === id)!;
    const page = render({ initialCondition: id });
    // Exactly one condition button is pressed, and it is this one.
    const pressed = [...page.matchAll(/<button type="button" aria-pressed="true" aria-controls="hros-state">([^<]+)<\/button>/g)].map((m) => m[1]);
    expect(pressed).toEqual([condition.control]);
    expect(page).toContain('id="hros-state" class="state" role="status" aria-live="polite"');
    expect(page).toContain(condition.label);
    expect(page).toContain(condition.result);
    expect(page).toContain("HROS DECLARED ARCHITECTURE · NOT A TA-14 FINDING");
    // Every node reports this condition's status, in order.
    const statuses = [...page.matchAll(/class="node s-[a-z]+" data-status="([a-z]+)"/g)].map((m) => m[1]);
    expect(statuses).toEqual(HROS_NODES.map((n) => condition.nodes[n.id]));
    // Declared basis and registered boundary are quoted verbatim for this condition.
    for (const n of condition.claims) expect(text(page)).toContain(REGISTERED_FORMAL_CLAIMS[n - 1].split(": ")[1]);
    for (const n of condition.nonClaims) expect(text(page)).toContain(REGISTERED_NON_CLAIMS[n - 1].split(": ")[1]);
    for (const n of condition.limitations) expect(text(page)).toContain(REGISTERED_KNOWN_LIMITATIONS[n - 1].split(": ")[1]);
    if (condition.gap) expect(page).toContain(condition.gap);
  });

  it("conditions cite only registered claims, non-claims and limitations that exist", () => {
    for (const c of HROS_CONDITIONS) {
      for (const n of c.claims) expect(n >= 1 && n <= REGISTERED_FORMAL_CLAIMS.length).toBe(true);
      for (const n of c.nonClaims) expect(n >= 1 && n <= REGISTERED_NON_CLAIMS.length).toBe(true);
      for (const n of c.limitations) expect(n >= 1 && n <= REGISTERED_KNOWN_LIMITATIONS.length).toBe(true);
      expect(c.claims.length).toBeGreaterThan(0);
    }
  });

  it("a missing signature halts at the human-authority node and never reaches execution", () => {
    const c = HROS_CONDITIONS.find((x) => x.id === "missing-signature")!;
    expect(c.nodes.authority).toBe("halted");
    expect(c.nodes.execution).toBe("unreached");
  });

  it("conditions the record is silent on say so instead of assuming a fail-closed outcome", () => {
    for (const id of ["authority-revoked", "historian-failure"] as const) {
      const c = HROS_CONDITIONS.find((x) => x.id === id)!;
      expect(c.gap).toMatch(/does not/);
      expect(Object.values(c.nodes)).toContain("undeclared");
    }
    expect(HROS_CONDITIONS.find((x) => x.id === "compromised-host")!.limitations).toContain(2);
    expect(HROS_CONDITIONS.find((x) => x.id === "authorization-fatigue")!.limitations).toContain(3);
  });
});

describe("HROS showroom — registration boundary and non-overclaiming", () => {
  it("states what registration established and did not establish", () => {
    const page = text(render());
    expect(page).toContain("WHAT REGISTRATION ESTABLISHED");
    expect(page).toContain("WHAT REGISTRATION DID NOT ESTABLISH");
    expect(page).toContain(
      "Registration establishes the attributable, bounded, preserved Registry record. It is not certification, technical validation, patent validation, legal approval, safety assurance, interoperability proof, performance proof, or execution authorization.",
    );
    expect(REGISTRATION_NOT_ESTABLISHED).toEqual([
      "Certification",
      "Technical validation",
      "Patent validation",
      "Legal approval",
      "Safety assurance",
      "Interoperability proof",
      "Performance proof",
      "Execution authorization",
    ]);
    expect(page).toContain("Registration is not certification.");
    expect(page).toContain("Evidence presence is not a TA-14 finding.");
  });

  it("TA-14-authored copy never asserts certification, verification, validation or proof", () => {
    const authored = [
      ...HROS_CONDITIONS.flatMap((c) => [c.control, c.label, c.result, c.declared, c.gap ?? ""]),
      ...HROS_NODES.map((n) => n.role),
      ...REGISTRATION_ESTABLISHED,
      ...NEXT_EXAMINATION_SURFACES.flatMap((s) => [s.kind, s.title, ...s.questions]),
      ...HROS_LIVING_HISTORY.flatMap((h) => [h.title, h.detail]),
      ...HROS_EVIDENCE.map((e) => e.note ?? ""),
    ].join("\n");
    expect(authored).not.toMatch(/\b(certified|certifies|verified|verifies|validated|validates|proven|proves|endorsed|endorses|approved)\b/i);
  });

  it("states that TA-14 has published no examination for HROS and labels next surfaces as not entered", () => {
    const page = text(render());
    expect(page).toContain("No TA-14 demonstration, examination finding or governed artifact is published under TA-14-AIGR-000046.");
    expect(NEXT_EXAMINATION_SURFACES.map((s) => s.kind)).toEqual([
      "FOUNDING DEMONSTRATIONS",
      "ADVERSARIAL EXAMINATIONS",
      "CONSEQUENCE EXAMINATIONS",
      "INTEROPERABILITY EXAMINATIONS",
    ]);
    expect([...page.matchAll(/OPEN · NOT ENTERED/g)].length).toBe(4);
    expect(page).toContain("Candidate surfaces only.");
  });
});

describe("HROS showroom — teaching visuals", () => {
  it("places all three HROS teaching images in the showroom with explicit declaration boundaries", () => {
    const page = render();
    for (const src of [
      "/hros-human-authority-execution-boundary.png",
      "/hros-fail-closed-bypass-boundary.png",
      "/hros-provenance-execution-record.png",
    ]) expect(page).toContain(`src="${src}"`);
    expect(text(page)).toContain("THE HUMAN-AUTHORITY BOUNDARY");
    expect(text(page)).toContain("THE BYPASS QUESTION");
    expect(text(page)).toContain("THE RECORD AFTER THE CONSEQUENCE");
    expect(text(page)).toContain("it is not evidence that HROS has demonstrated it");
  });
});

describe("HROS showroom — permanent record CTAs, living history and directory", () => {
  it("links to the permanent record, evidence, life history, Registry and Artifact surfaces", () => {
    const page = render();
    for (const href of [
      "/workspace/ai-governance/registry/records/TA-14-AIGR-000046",
      "/workspace/ai-governance/registry/records/TA-14-AIGR-000046/evidence",
      "/workspace/ai-governance/registry/history/TA-14-AIGR-000046",
      "/workspace/ai-governance/registry",
      "/artifacts/registry",
      "/governance-showcase",
      "/showrooms/registered-governance",
      HROS_LINKS.foundingDemonstrations,
      HROS_LINKS.adversarialExamination,
      HROS_LINKS.consequenceExamination,
      HROS_LINKS.interoperabilityExaminations,
    ]) {
      expect(page).toContain(`href="${href}"`);
    }
  });

  it("living history is chronological and ends with an open next entry", () => {
    expect(HROS_LIVING_HISTORY[0].kind).toBe("evidence");
    expect(HROS_LIVING_HISTORY[1].title).toContain("TA-14-AIGR-000046");
    expect(text(render())).toContain("NEXT ENTRY Open");
  });

  it("is listed uniquely in the Registered Governance showroom directory", () => {
    const source = readFileSync("apps/web/app/showrooms/registered-governance/page.tsx", "utf8");
    const rooms = JSON.parse(source.match(/const rooms=(\[.*?\]);/s)![1]) as Array<{ kind: string; href: string }>;
    expect(rooms.find((r) => r.kind === "TA-14-AIGR-000046")).toMatchObject({ kind: "TA-14-AIGR-000046", href: "/governance-showcase/TA-14-AIGR-000046" });
    expect(rooms.filter((r) => r.kind === "TA-14-AIGR-000046")).toHaveLength(1);
    // Prior entries are untouched and still present.
    for (const kind of ["TA-14-AIGR-000045", "TA-14-AIGR-000008", "TA-14-AIGR-000044"]) expect(rooms.some((r) => r.kind === kind)).toBe(true);
  });
});
