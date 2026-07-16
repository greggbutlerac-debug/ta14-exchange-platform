import { describe, expect, it } from "vitest";
import { deriveDecision, paymentMayChangeDecision, type RequirementResult } from "../../packages/domain/state-machine.js";
const r = (result: RequirementResult["result"]): RequirementResult => ({ requirementId: "R", requirementVersion: "1", result, reason: "x", evidenceIds: [] });
describe("decision precedence", () => {
  it("DENY overrides ESCALATE, HOLD, and SATISFIED", () => expect(deriveDecision([r("SATISFIED"), r("HOLD"), r("ESCALATE"), r("DENY")])).toBe("DENY"));
  it("ESCALATE overrides HOLD and SATISFIED", () => expect(deriveDecision([r("SATISFIED"), r("HOLD"), r("ESCALATE")])).toBe("ESCALATE"));
  it("payment cannot alter a decision", () => expect(paymentMayChangeDecision()).toBe(false));
});
