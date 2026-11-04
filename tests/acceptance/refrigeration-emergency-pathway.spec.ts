import { beforeAll, describe, expect, it } from "vitest";
import { BASELINE, minuteToIso } from "../../apps/web/lib/refrigeration-boundary/baseline";
import { EnvironmentalIntegrityNode } from "../../apps/web/lib/refrigeration-boundary/ein";
import {
  PROTECTIVE_MEASURES, applyProtectiveMeasure, emergencyGrant, emergencyProtocol, evaluateEmergency, executeEmergency,
  type EmergencyRequest, type HeldEmergencyGrant,
} from "../../apps/web/lib/refrigeration-boundary/emergency";
import { submitCommand } from "../../apps/web/lib/refrigeration-boundary/gate";
import { initialController } from "../../apps/web/lib/refrigeration-boundary/plant";
import { runAllScenarios, runExtensionScenarios, type ScenarioResult } from "../../apps/web/lib/refrigeration-boundary/scenarios";

/*
 * Emergency-response pathway (SIMULATION): the pathway works only for its narrow purpose, and it
 * cannot be used to bypass ordinary governance. Software verification only.
 */

const LOST = { P1: null, P2: null, AIR: null, HEATER_CT: 0.08, COMPRESSOR_CT: 0.08 };
const HEALTHY = (i: number) => ({ P1: -21.4 + i * 0.01, P2: -21.2 - i * 0.01, AIR: -22 + i * 0.013, HEATER_CT: 0.08, COMPRESSOR_CT: 6 });

/** An EIN whose last samples (5-minute cadence, from minute 200) show evidence loss for `lostMin` minutes. */
function einWith(lostMin: number, healthyAfter = false) {
  const ein = new EnvironmentalIntegrityNode();
  let m = 200;
  for (let i = 0; i < 4; i++, m += 5) ein.observe(m, HEALTHY(i), -22);
  for (let k = 0; k <= lostMin; k += 5, m += 5) ein.observe(m, LOST, -22);
  if (healthyAfter) ein.observe(m, HEALTHY(9), -22), (m += 5);
  return { ein, minute: m - 5 };
}
const held = (measure: keyof typeof PROTECTIVE_MEASURES = "RESTORE_SEALED_SETPOINT", holder = "TECH-01", overrides: Partial<HeldEmergencyGrant["grant"]> = {}): HeldEmergencyGrant => ({ holderActorId: holder, grant: { ...emergencyGrant(measure, 0, 1440), ...overrides } });
const restore: EmergencyRequest = { kind: "PROTECTIVE_MEASURE", requestId: "R", measure: "RESTORE_SEALED_SETPOINT" };

describe("the emergency pathway does what it is for", () => {
  it("E0 notification is allowed and has no equipment effect", () => {
    const { ein, minute } = einWith(30);
    const d = evaluateEmergency({ actorId: "ANYONE", request: { kind: "EMERGENCY_NOTIFICATION", message: "evidence lost" }, held: null, ein, minute });
    expect(d).toMatchObject({ tier: "E0_NOTIFICATION", determination: "ALLOW", gcea: null });
    expect(d.reasonCodes).toContain("NOTIFICATION_HAS_NO_EQUIPMENT_EFFECT");
  });
  it("E1 is allowed for the responder, with its scoped authority, after sustained evidence loss", () => {
    const { ein, minute } = einWith(20);
    const d = evaluateEmergency({ actorId: "TECH-01", request: restore, held: held(), ein, minute });
    expect(d).toMatchObject({ tier: "E1_PROTECTIVE_MEASURE", determination: "ALLOW", permitted: true });
    expect(d.conditionEvidenceId).toMatch(/^[0-9a-f]{64}$/);
    expect(executeEmergency({ actorId: "TECH-01", request: restore, held: held(), ein, minute: minute + 1 }).permitted).toBe(true);
  });
  it("each protective measure only re-asserts a sealed-baseline value and touches nothing else", () => {
    for (const m of Object.keys(PROTECTIVE_MEASURES) as Array<keyof typeof PROTECTIVE_MEASURES>) {
      const c = { ...initialController(), setpointC: 2, defrostUntilMinute: 900, alarmSuppressed: true, reportMode: "FALSIFIED" as const };
      const before = { ...c };
      const changed = applyProtectiveMeasure(m, c);
      expect(Object.keys(changed)).toHaveLength(1);
      expect({ setpointC: BASELINE.setpointC, defrostUntilMinute: null, alarmSuppressed: false }).toMatchObject(changed);
      for (const k of Object.keys(before) as Array<keyof typeof before>) if (!(k in changed)) expect(c[k]).toEqual(before[k]);
      expect(c.reportMode).toBe("FALSIFIED"); // re-imaging the controller is an ordinary, consequential action
    }
  });
});

describe("adversarial: emergency provisions cannot bypass ordinary governance", () => {
  const deny = (d: { determination: string; permitted: boolean; reasonCodes: string[] }, code: string) => {
    expect(d.permitted).toBe(false);
    expect(d.determination).toBe("DENY");
    expect(d.reasonCodes).toContain(code);
  };

  it("refused when independent evidence is available: use ordinary governance", () => {
    const ein = new EnvironmentalIntegrityNode();
    for (let i = 0; i < 6; i++) ein.observe(200 + i * 5, HEALTHY(i), -22);
    deny(evaluateEmergency({ actorId: "TECH-01", request: restore, held: held(), ein, minute: 225 }), "EMERGENCY_CONDITION_INDEPENDENT_EVIDENCE_AVAILABLE_USE_ORDINARY_GOVERNANCE");
  });
  it("held until evidence loss is sustained for the protocol's minimum", () => {
    const { ein, minute } = einWith(10);
    const d = evaluateEmergency({ actorId: "TECH-01", request: restore, held: held(), ein, minute });
    expect(d.determination).toBe("HOLD");
    expect(d.reasonCodes).toContain("EMERGENCY_CONDITION_EVIDENCE_LOSS_NOT_YET_SUSTAINED");
  });
  it("refused for an actor without emergency-responder standing, even holding a stolen grant", () => {
    const { ein, minute } = einWith(30);
    const d = evaluateEmergency({ actorId: "UNKNOWN-REMOTE-01", request: restore, held: held(), ein, minute });
    deny(d, "EMERGENCY_RESPONDER_STANDING_NOT_ESTABLISHED");
    expect(d.reasonCodes).toContain("EMERGENCY_ACTOR_IS_NOT_GRANT_HOLDER");
  });
  it("refused when the responder's standing has been revoked", () => {
    const { ein, minute } = einWith(30);
    const p = { ...emergencyProtocol(), responders: [{ actorId: "TECH-01", role: "EMERGENCY_RESPONDER" as const, standing: "REVOKED" as const }] };
    deny(evaluateEmergency({ actorId: "TECH-01", request: restore, held: held(), ein, minute, protocol: p }), "EMERGENCY_RESPONDER_STANDING_NOT_ESTABLISHED");
  });
  const consequential: Array<[string, EmergencyRequest]> = [
    ["a defrost", { kind: "CONSEQUENTIAL_COMMAND", requestId: "C1", consequence: "INITIATE_DEFROST", params: { durationMin: 360 } }],
    ["a setpoint change", { kind: "CONSEQUENTIAL_COMMAND", requestId: "C2", consequence: "CHANGE_SETPOINT", params: { setpointC: 2 } }],
    ["disabling the alarm", { kind: "CONSEQUENTIAL_COMMAND", requestId: "C3", consequence: "DISABLE_ALARM" }],
  ];
  for (const [name, request] of consequential) {
    it(`a consequential command (${name}) is never available on the emergency path`, () => {
      const { ein, minute } = einWith(60);
      const d = evaluateEmergency({ actorId: "TECH-01", request, held: held(), ein, minute });
      expect(d.tier).toBe("E2_CONSEQUENTIAL_COMMAND");
      deny(d, "CONSEQUENTIAL_COMMAND_NOT_AVAILABLE_ON_EMERGENCY_PATH");
    });
  }
  for (const measure of ["CHANGE_SETPOINT", "DISABLE_CONTROLLER_ALARM", "SET_REPORT_MODE", "restore_sealed_setpoint"]) {
    it(`a consequential action disguised as a protective measure (${measure}) is refused`, () => {
      const { ein, minute } = einWith(30);
      deny(evaluateEmergency({ actorId: "TECH-01", request: { kind: "PROTECTIVE_MEASURE", requestId: "D", measure }, held: held(), ein, minute }), "NOT_A_PROTECTIVE_MEASURE_USE_ORDINARY_GOVERNANCE");
    });
  }
  it("parameters smuggled into a protective measure are refused", () => {
    const { ein, minute } = einWith(30);
    deny(evaluateEmergency({ actorId: "TECH-01", request: { ...restore, params: { setpointC: 2 } } as EmergencyRequest, held: held(), ein, minute }), "PROTECTIVE_MEASURES_TAKE_NO_PARAMETERS");
  });
  it("no emergency authority: HOLD (authority absent)", () => {
    const { ein, minute } = einWith(30);
    const d = evaluateEmergency({ actorId: "TECH-01", request: restore, held: null, ein, minute });
    expect(d.permitted).toBe(false);
    expect(d.reasonCodes).toContain("AUTHORITY_ABSENT");
  });
  it("an ordinary grant cannot be used on the emergency route", () => {
    const { ein, minute } = einWith(30);
    const ordinary = { holderActorId: "TECH-01", grant: { authorityId: "AUTH-TECH-DEFROST", assetId: BASELINE.equipment.assetId, assetVersion: BASELINE.version, routeId: BASELINE.equipment.commandRoute, consequence: "INITIATE_DEFROST", effectiveAt: minuteToIso(0), expiresAt: minuteToIso(1440), revoked: false } };
    deny(evaluateEmergency({ actorId: "TECH-01", request: restore, held: ordinary, ein, minute }), "AUTHORITY_SCOPE_MISMATCH");
  });
  it("an emergency grant for one measure cannot authorize another", () => {
    const { ein, minute } = einWith(30);
    deny(evaluateEmergency({ actorId: "TECH-01", request: { kind: "PROTECTIVE_MEASURE", requestId: "X", measure: "RE_ENABLE_CONTROLLER_ALARM" }, held: held("RESTORE_SEALED_SETPOINT"), ein, minute }), "AUTHORITY_SCOPE_MISMATCH");
  });
  it("an emergency grant cannot be laundered into the ordinary command route", () => {
    const r = submitCommand({ actorId: "TECH-01", command: { commandId: "L", consequence: "RESTORE_AUTHORIZED_BASELINE", params: {} }, held: { holderActorId: "TECH-01", issuedBy: "FM-01", issuedAtMinute: 0, grant: emergencyGrant("RESTORE_SEALED_SETPOINT", 0, 1440) }, evidence: { continuitySupported: true, admissibilitySupported: true, evidenceId: "E" }, change: null, minute: 300 });
    expect(r.determination).toBe("DENY");
    expect(r.reasonCodes).toContain("AUTHORITY_SCOPE_MISMATCH");
  });
  it("an expired emergency grant is refused", () => {
    const { ein, minute } = einWith(30);
    deny(evaluateEmergency({ actorId: "TECH-01", request: restore, held: held("RESTORE_SEALED_SETPOINT", "TECH-01", { expiresAt: minuteToIso(100) }), ein, minute }), "AUTHORITY_EXPIRED");
  });
  it("revocation between commit and execution is caught at the execution boundary", () => {
    const { ein, minute } = einWith(30);
    expect(evaluateEmergency({ actorId: "TECH-01", request: restore, held: held(), ein, minute }).permitted).toBe(true);
    deny(executeEmergency({ actorId: "TECH-01", request: restore, held: held("RESTORE_SEALED_SETPOINT", "TECH-01", { revoked: true }), ein, minute: minute + 5 }), "AUTHORITY_REVOKED");
  });
  it("if independent evidence returns before execution, execution is refused and ordinary governance applies", () => {
    const { ein, minute } = einWith(30);
    expect(evaluateEmergency({ actorId: "TECH-01", request: restore, held: held(), ein, minute }).permitted).toBe(true);
    ein.observe(minute + 5, HEALTHY(9), -22);
    deny(executeEmergency({ actorId: "TECH-01", request: restore, held: held(), ein, minute: minute + 5 }), "EMERGENCY_CONDITION_INDEPENDENT_EVIDENCE_AVAILABLE_USE_ORDINARY_GOVERNANCE");
  });
  it("a protective measure cannot be reused in the same incident", () => {
    const { ein, minute } = einWith(30);
    deny(evaluateEmergency({ actorId: "TECH-01", request: restore, held: held(), ein, minute, executed: new Set(["RESTORE_SEALED_SETPOINT"]) }), "PROTECTIVE_MEASURE_ALREADY_USED_THIS_INCIDENT");
  });
  it("a protocol bound to a different baseline is refused", () => {
    const { ein, minute } = einWith(30);
    deny(evaluateEmergency({ actorId: "TECH-01", request: restore, held: held(), ein, minute, protocol: { ...emergencyProtocol(), sealedBaselineSha256: "0".repeat(64) } }), "EMERGENCY_PROTOCOL_BASELINE_MISMATCH");
  });
  it("the emergency condition is computed from the EIN's record, not supplied by the caller", () => {
    expect(evaluateEmergency.length).toBe(1);
    const { ein, minute } = einWith(30, true); // evidence came back at the last sample
    deny(evaluateEmergency({ actorId: "TECH-01", request: restore, held: held(), ein, minute: minute + 5, ...({ condition: { present: true } } as object) }), "EMERGENCY_CONDITION_INDEPENDENT_EVIDENCE_AVAILABLE_USE_ORDINARY_GOVERNANCE");
  });
});

describe("E1 extension scenario, with S6 preserved", () => {
  let s6: ScenarioResult;
  let e1: ScenarioResult;
  beforeAll(async () => { s6 = (await runAllScenarios()).find((r) => r.id === "S6")!; [e1] = await runExtensionScenarios(); });

  it("S6 is unchanged and remains a documented failure", () => {
    expect(Object.fromEntries(s6.claims.map((c) => [c.capability, c.status]))).toEqual({ DETECTION: "FAIL", EVIDENCE_GAP_DISCLOSED: "PASS", NO_EXECUTION_WITHOUT_ADMISSIBLE_EVIDENCE: "PASS", EVIDENCE_PRESERVATION: "PASS" });
    expect(s6.emergency).toEqual([]);
    expect(s6.record.entries.some((e) => e.type.startsWith("EMERGENCY_"))).toBe(false);
  });
  it("E1 claim verdicts", () => {
    expect(Object.fromEntries(e1.claims.map((c) => [c.capability, c.status]))).toEqual({
      EMERGENCY_PROTECTIVE_MEASURE_EXECUTED: "PASS", EMERGENCY_EFFECT_LIMITED_TO_SEALED_BASELINE: "PASS", ORDINARY_GOVERNANCE_STILL_HOLDS: "PASS",
      DETECTION: "NOT_DEMONSTRATED", OUTCOME_VERIFIED_BY_INDEPENDENT_EVIDENCE: "NOT_DEMONSTRATED", EVIDENCE_PRESERVATION: "PASS",
    });
  });
  it("E1 records the emergency separately: no ordinary execution, and a follow-up obligation", () => {
    const types = e1.record.entries.map((e) => e.type);
    expect(types).toEqual(expect.arrayContaining(["EMERGENCY_PROTOCOL_ON_FILE", "EMERGENCY_NOTIFICATION", "EMERGENCY_MEASURE_SUBMITTED", "EMERGENCY_MEASURE_EXECUTED", "EMERGENCY_FOLLOW_UP_REQUIRED"]));
    expect(types).not.toContain("AEA_COMMAND_EXECUTED");
    expect(e1.response.restoredMinute).toBeNull();
    expect(e1.eir.verification.valid).toBe(true);
  });
});
