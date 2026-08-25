import { describe, expect, it } from "vitest";
import { compileTechnicalFreeze, type FreezeCandidate } from "./freeze-compiler";

const hash = "a".repeat(64);
const base: FreezeCandidate = {
  recordId: "TF-R1",
  instrumentId: "CEI-R1",
  intakeId: "INTAKE-R1",
  issuer: { name: "TA-14 Authority", authorityRecordId: "AUTH-1" },
  participant: { name: "Participant", reviewState: "COMPLETE" },
  gates: [{ id: "TF-01", title: "Identity", state: "SATISFIED", requiredObject: "Identity", evidenceObjectIds: ["OBJ-1"] }],
  frozenObjects: [{ id: "OBJ-1", sha256: hash }],
  issuedAt: "2026-08-25T22:00:00.000Z",
};

describe("compileTechnicalFreeze", () => {
  it("refuses unresolved gates", () => {
    const result = compileTechnicalFreeze({ ...base, gates: [{ ...base.gates[0], state: "UNSATISFIED", evidenceObjectIds: [] }] });
    expect(result.executable).toBe(false);
    expect(result.unresolvedGateIds).toContain("TF-01");
  });

  it("refuses satisfied gates without evidence identity", () => {
    const result = compileTechnicalFreeze({ ...base, gates: [{ ...base.gates[0], evidenceObjectIds: [] }] });
    expect(result.executable).toBe(false);
  });

  it("refuses incomplete participant review", () => {
    const result = compileTechnicalFreeze({ ...base, participant: { ...base.participant, reviewState: "INCOMPLETE" } });
    expect(result.executable).toBe(false);
  });

  it("issues deterministic canonical hash for a complete candidate", () => {
    const first = compileTechnicalFreeze(base);
    const second = compileTechnicalFreeze(base);
    expect(first.executable).toBe(true);
    expect(first.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(first.sha256).toBe(second.sha256);
    expect(first.canonicalJson).toBe(second.canonicalJson);
  });
});
