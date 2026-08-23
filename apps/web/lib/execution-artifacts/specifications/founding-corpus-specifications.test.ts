import { describe, expect, it } from "vitest";
import { executeArtifactSpecification, mutatePredicate } from "../execution-harness";
import { FOUNDING_CORPUS_SPECIFICATIONS } from "./founding-corpus-specifications";

const EXECUTED_AT = "2026-08-23T20:52:00.000Z";

describe("TA-14 founding execution-artifact corpus", () => {
  it("contains exactly EA-000001 through EA-000012", () => {
    expect(FOUNDING_CORPUS_SPECIFICATIONS).toHaveLength(12);
    expect(FOUNDING_CORPUS_SPECIFICATIONS.map((s) => s.artifactId)).toEqual(
      Array.from({ length: 12 }, (_, i) => `TA14-EA-${String(i + 1).padStart(6, "0")}`),
    );
  });

  for (const specification of FOUNDING_CORPUS_SPECIFICATIONS) {
    it(`${specification.artifactId} executes to ${specification.expectedDetermination}`, () => {
      const result = executeArtifactSpecification(specification, EXECUTED_AT);
      expect(result.receipt.determination).toBe(specification.expectedDetermination);
      expect(result.receipt.specificationHash).toMatch(/^sha256:[0-9a-f]{64}$/);
      expect(result.receipt.traceHash).toMatch(/^sha256:[0-9a-f]{64}$/);
      expect(result.rootHash).toMatch(/^sha256:[0-9a-f]{64}$/);
      expect(result.trace).toHaveLength(8);

      const terminal = result.trace.find((stage) => stage.disposition !== "PASS" && stage.disposition !== "NOT_REACHED");
      if (specification.expectedDetermination === "ALLOW") {
        expect(terminal).toBeUndefined();
        expect(result.trace.every((stage) => stage.disposition === "PASS")).toBe(true);
      } else {
        expect(terminal?.disposition).toBe(specification.expectedDetermination);
        const terminalIndex = result.trace.findIndex((stage) => stage === terminal);
        expect(result.trace.slice(terminalIndex + 1).every((stage) => stage.disposition === "NOT_REACHED")).toBe(true);
      }
    });
  }

  it("EA-000001 loses ALLOW when outcome correspondence is removed", () => {
    const spec = FOUNDING_CORPUS_SPECIFICATIONS.find((s) => s.artifactId === "TA14-EA-000001")!;
    const baseline = executeArtifactSpecification(spec, EXECUTED_AT);
    expect(baseline.receipt.determination).toBe("ALLOW");

    const outcome = spec.predicates.find((p) => p.id.includes("OUTCOME-CORRESPONDENCE"))!;
    const challenged = executeArtifactSpecification(mutatePredicate(spec, outcome.id, false), EXECUTED_AT);
    expect(challenged.receipt.determination).toBe("HOLD");
    expect(challenged.receipt.terminalStage).toBe("OUTCOME");
    expect(challenged.rootHash).not.toBe(baseline.rootHash);
  });

  it("EA-000009 remains DENY without mandatory gate proof", () => {
    const spec = FOUNDING_CORPUS_SPECIFICATIONS.find((s) => s.artifactId === "TA14-EA-000009")!;
    const baseline = executeArtifactSpecification(spec, EXECUTED_AT);
    expect(baseline.receipt.determination).toBe("DENY");
    expect(baseline.receipt.terminalStage).toBe("EXECUTION");

    const gate = spec.predicates.find((p) => p.id.includes("MANDATORY-GATE-PROOF"))!;
    const restored = executeArtifactSpecification(mutatePredicate(spec, gate.id, true), EXECUTED_AT);
    expect(restored.receipt.determination).toBe("HOLD");
    expect(restored.receipt.terminalStage).toBe("OUTCOME");
  });

  it("EA-000010 loses ALLOW when dual-authority standing is removed before outcome", () => {
    const spec = FOUNDING_CORPUS_SPECIFICATIONS.find((s) => s.artifactId === "TA14-EA-000010")!;
    const baseline = executeArtifactSpecification(spec, EXECUTED_AT);
    expect(baseline.receipt.determination).toBe("ALLOW");

    const binding = spec.predicates.find((p) => p.stage === "BINDING")!;
    const challenged = executeArtifactSpecification(mutatePredicate(spec, binding.id, false), EXECUTED_AT);
    expect(challenged.receipt.determination).toBe("HOLD");
    expect(challenged.receipt.terminalStage).toBe("BINDING");
  });
});
