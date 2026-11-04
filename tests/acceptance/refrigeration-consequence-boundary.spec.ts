import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { BASELINE, SIMULATION_LABEL, sealBaseline, sha256 } from "../../apps/web/lib/refrigeration-boundary/baseline";
import { canonical } from "../../apps/web/lib/refrigeration-boundary/canonical";
import { EnvironmentalIntegrityNode } from "../../apps/web/lib/refrigeration-boundary/ein";
import { scenarioExport } from "../../apps/web/lib/refrigeration-boundary/export";
import { submitCommand } from "../../apps/web/lib/refrigeration-boundary/gate";
import { SCENARIOS, runAllScenarios, runExtensionScenarios, runScenario, type ScenarioResult } from "../../apps/web/lib/refrigeration-boundary/scenarios";
import { verifyIncidentRecord, type IncidentRecord } from "../../apps/web/lib/refrigeration-boundary/verify";

/*
 * Refrigeration Consequence Boundary: SIMULATION tests. They verify the simulation's software
 * behaviour, not any physical refrigeration system.
 */

const ROOT = join(__dirname, "..", "..");
const EXPORT_DIR = join(ROOT, "docs/refrigeration-consequence-boundary/evidence");
let results: ScenarioResult[];
let extension: ScenarioResult[];
const byId = (id: string) => results.find((r) => r.id === id)!;
const claim = (id: string, capability: string) => byId(id).claims.find((c) => c.capability === capability)!;
const webSha256 = async (text: string) => Buffer.from(await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))).toString("hex");

beforeAll(async () => { results = await runAllScenarios(); extension = await runExtensionScenarios(); });

describe("claimed capabilities: computed verdicts, including honest failures", () => {
  const expected: Record<string, Record<string, string>> = {
    S1: { PREVENTION: "PASS", NO_FALSE_ALERT: "PASS", EVIDENCE_PRESERVATION: "PASS" },
    S2: { PREVENTION: "FAIL", DETECTION: "PASS", NO_FABRICATED_AUTHORIZATION: "PASS", ATTRIBUTION_NOT_ASSERTED: "PASS", EVIDENCE_PRESERVATION: "PASS" },
    S3: { PREVENTION: "FAIL", DETECTION: "PASS", NO_FABRICATED_AUTHORIZATION: "PASS", EVIDENCE_PRESERVATION: "PASS" },
    S4: { DETECTION: "PASS", DETECTION_INDEPENDENT_OF_CONTROLLER_REPORTS: "PASS", EVIDENCE_PRESERVATION: "PASS" },
    S5: { DETECTION: "PASS", ALERT_INDEPENDENT_OF_CONTROLLER_ALARM: "PASS", EVIDENCE_PRESERVATION: "PASS" },
    S6: { DETECTION: "FAIL", EVIDENCE_GAP_DISCLOSED: "PASS", NO_EXECUTION_WITHOUT_ADMISSIBLE_EVIDENCE: "PASS", EVIDENCE_PRESERVATION: "PASS" },
    S7: { PREVENTION: "PASS", NO_FALSE_ALERT: "PASS", EVIDENCE_PRESERVATION: "PASS" },
    S8: { ROUTINE_COMMAND_HELD_DURING_INCIDENT: "PASS", RUNTIME_REVALIDATION: "PASS", RECOVERY_AUTHORIZED: "PASS", POST_INTERVENTION_VERIFICATION: "PASS", EVIDENCE_PRESERVATION: "PASS" },
  };
  for (const [id, caps] of Object.entries(expected)) {
    it(`${id}: ${Object.entries(caps).map(([c, s]) => `${c}=${s}`).join(", ")}`, () => {
      expect(Object.fromEntries(byId(id).claims.map((c) => [c.capability, c.status]))).toEqual(caps);
    });
  }
  it("bypass prevention is reported as FAIL, never converted into a success", () => {
    for (const id of ["S2", "S3"]) expect(claim(id, "PREVENTION").basis).toMatch(/bypassed the governed route/);
  });
  it("S6 detection failure is reported against the ground truth it missed", () => {
    expect(byId("S6").physical.maxTruthProductC).toBeGreaterThan(BASELINE.productLimitC);
    expect(byId("S6").ein.firstDeviationMinute).toBeNull();
  });
});

describe("the AEA execution boundary (production GCEA, unchanged)", () => {
  it("the GCEA engine file is byte-identical to the reviewed version (main f636d639)", () => {
    // Pinned by content hash so the check works in any checkout (CI clones have no origin/main ref).
    // A change to the engine must fail here and be reviewed; this examination never modifies it.
    const gcea = readFileSync(join(ROOT, "apps/web/lib/governance-continuity-execution-authority.ts"));
    expect(createHash("sha256").update(gcea).digest("hex")).toBe("0754f3add88880d23ffdda6ad102194284c48065102a39cb2690ec7c933c6562");
  });
  it("every gate determination carries the GCEA receipt, and simulation checks only ever tighten it", () => {
    for (const r of results) for (const s of r.aea.submissions) {
      expect(s.gcea.receiptHash).toMatch(/^[0-9a-f]{64}$/);
      if (s.gcea.determination !== "ALLOW") expect(s.determination).not.toBe("ALLOW");
    }
  });
  it("an authority grant held by someone else does not authorize the submitter", () => {
    const s = byId("S7").aea.submissions.find((x) => x.commandId === "CMD-S7-REPLAY-ATTACKER")!;
    expect(s.reasonCodes).toEqual(expect.arrayContaining(["SIM_ACTOR_IS_NOT_GRANT_HOLDER", "AUTHORITY_EXPIRED"]));
  });
  it("an in-limits command from the holder with a current grant and admissible evidence is ALLOWed", () => {
    const r = submitCommand({
      actorId: "TECH-01", command: { commandId: "T", consequence: "INITIATE_DEFROST", params: { durationMin: 20 } },
      held: { holderActorId: "TECH-01", issuedBy: "FM-01", issuedAtMinute: 0, grant: { authorityId: "A", assetId: BASELINE.equipment.assetId, assetVersion: BASELINE.version, routeId: BASELINE.equipment.commandRoute, consequence: "INITIATE_DEFROST", effectiveAt: "2026-07-01T00:00:00.000Z", expiresAt: "2026-07-02T00:00:00.000Z", revoked: false } },
      evidence: { continuitySupported: true, admissibilitySupported: true, evidenceId: "E" }, change: null, minute: 60,
    });
    expect(r.determination).toBe("ALLOW");
    expect(r.commitPermitted).toBe(true);
  });
  it("bypassed commands leave no AEA record and no authorization is fabricated for them", () => {
    for (const id of ["S2", "S3", "S4", "S5", "S6", "S8"]) {
      const r = byId(id);
      const firstAea = r.record.entries.find((e) => e.type.startsWith("AEA_"));
      if (firstAea) expect(Date.parse(firstAea.recordedAt)).toBeGreaterThan(Date.parse(r.record.entries.find((e) => e.type === "NOTIFICATION_SENT")!.recordedAt));
      expect(r.record.entries.filter((e) => e.type === "AEA_COMMAND_EXECUTED").every((e) => (e.payload as { commandId: string }).commandId.includes("RESTORE"))).toBe(true);
    }
  });
});

describe("independent observation (EIN)", () => {
  it("the EIN raises no alert across a normal day with four authorized defrosts", () => {
    expect(byId("S1").alerts.ein).toEqual([]);
  });
  it("a falsified controller report does not mask independent evidence", () => {
    const codes = byId("S4").ein.transitions.flatMap((t) => t.findings);
    expect(codes).toContain("CONTROLLER_REPORT_DISAGREES_WITH_INDEPENDENT_EVIDENCE");
  });
  it("with no temperature evidence the EIN reports EVIDENCE_INSUFFICIENT, never NORMAL", () => {
    const n = new EnvironmentalIntegrityNode();
    const s = n.observe(180, { P1: null, P2: null, AIR: null, HEATER_CT: 0.08, COMPRESSOR_CT: 0.08 }, -22);
    expect(s.status).toBe("EVIDENCE_INSUFFICIENT");
    expect(n.evidenceStanding("E")).toMatchObject({ admissibilitySupported: false });
  });
  it("a stuck probe is not trusted", () => {
    const n = new EnvironmentalIntegrityNode();
    let last;
    for (let i = 0; i < 6; i++) last = n.observe(180 + i * 5, { P1: -21.3, P2: -21.4 - i * 0.01, AIR: -22 + i * 0.01, HEATER_CT: 0.08, COMPRESSOR_CT: 6 }, -22);
    expect(last!.findings.map((f) => f.code)).toContain("EVIDENCE_STUCK:P1");
  });
  it("findings never attribute a cause; every attribution is CAUSE_UNDETERMINED", () => {
    for (const r of results) for (const e of r.record.entries) {
      const a = (e.payload as { attribution?: string }).attribution;
      if (a !== undefined) expect(a).toBe("CAUSE_UNDETERMINED");
    }
  });
});

describe("evidence preservation (EIR)", () => {
  it("every scenario's record verifies, server-side and with WebCrypto (the browser path)", async () => {
    for (const r of results) {
      expect(r.eir.verification.valid).toBe(true);
      expect((await verifyIncidentRecord(r.record, webSha256)).valid).toBe(true);
    }
  });
  it("the sealed baseline is stored separately and is unchanged by the incident", () => {
    for (const r of results) expect(r.record.sealedBaseline).toEqual(sealBaseline());
  });
  it("controller self-reports are preserved but marked as not independent", () => {
    for (const e of byId("S4").record.entries.filter((e) => e.source.kind === "CONTROLLER_REPORTED")) expect(e.independentOfController).toBe(false);
  });
  it("evidence gaps are recorded explicitly", () => {
    expect(byId("S6").record.entries.filter((e) => e.type === "EVIDENCE_GAP_OPENED").map((e) => (e.payload as { sourceId: string }).sourceId).sort()).toEqual(["AIR", "P1", "P2"]);
  });
  const tamper: Array<[string, (r: IncidentRecord) => void, string]> = [
    ["an altered observation", (r) => { (r.entries[50].payload as { productC: number }).productC = -30; }, "ENTRY_HASH_MISMATCH@50"],
    ["a deleted entry", (r) => { r.entries.splice(60, 1); }, "SEQUENCE_GAP_OR_REORDER@60"],
    ["reordered entries", (r) => { [r.entries[70], r.entries[71]] = [r.entries[71], r.entries[70]]; }, "CHAIN_LINK_BROKEN@70"],
    ["an altered baseline", (r) => { (r.sealedBaseline.baseline as { setpointC: number }).setpointC = 2; }, "BASELINE_SEAL_MISMATCH"],
    ["a truncated chain", (r) => { r.entries.pop(); }, "CHAIN_HEAD_MISMATCH"],
  ];
  for (const [name, mutate, failure] of tamper) {
    it(`detects ${name}`, async () => {
      const copy = structuredClone(byId("S2").record);
      mutate(copy);
      const v = await verifyIncidentRecord(copy, sha256);
      expect(v.valid).toBe(false);
      expect(v.failures).toContain(failure);
    });
  }
});

describe("reproducibility and exports", () => {
  it("runs are deterministic", async () => {
    const again = await runScenario(SCENARIOS[1]);
    expect(again.record.chainHead).toBe(byId("S2").record.chainHead);
  });
  it("every export is labelled as simulation and separates ground truth from the preserved record", () => {
    for (const r of results) {
      const x = scenarioExport(r);
      expect(x.label).toBe(SIMULATION_LABEL);
      expect(x.incidentRecord.label).toBe(SIMULATION_LABEL);
      expect(Object.keys(x)).toEqual(expect.arrayContaining(["incidentRecord", "simulationGroundTruth"]));
    }
  });
  it("the committed evidence exports match a fresh run", () => {
    const all = [...results, ...extension];
    const files = readdirSync(EXPORT_DIR).filter((f) => /^[SE]\d\.json$/.test(f)).sort();
    expect(files).toEqual(all.map((r) => `${r.id}.json`).sort());
    for (const r of all) expect(canonical(JSON.parse(readFileSync(join(EXPORT_DIR, `${r.id}.json`), "utf8")))).toBe(canonical(JSON.parse(JSON.stringify(scenarioExport(r)))));
  });
  it("the simulation contains no network calls or real control endpoints", () => {
    const dir = join(ROOT, "apps/web/lib/refrigeration-boundary");
    for (const f of readdirSync(dir)) expect(readFileSync(join(dir, f), "utf8")).not.toMatch(/fetch\(|https?:\/\/|XMLHttpRequest|WebSocket|net\.connect|modbus|bacnet/i);
  });
});
