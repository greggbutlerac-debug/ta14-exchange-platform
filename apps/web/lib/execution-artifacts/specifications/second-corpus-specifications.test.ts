import { describe, expect, it } from "vitest";
import { executeArtifactSpecification, mutatePredicate } from "../execution-harness";
import { SECOND_CORPUS_SPECIFICATIONS } from "./second-corpus-specifications";

const EXECUTED_AT = "2026-08-23T20:30:00.000Z";

describe("TA-14 second execution-artifact corpus", () => {
  it("contains exactly EA-000013 through EA-000024", () => {
    expect(SECOND_CORPUS_SPECIFICATIONS).toHaveLength(12);
    expect(SECOND_CORPUS_SPECIFICATIONS.map((s) => s.artifactId)).toEqual(
      Array.from({ length: 12 }, (_, i) => `TA14-EA-${String(i + 13).padStart(6, "0")}`),
    );
  });

  for (const specification of SECOND_CORPUS_SPECIFICATIONS) {
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

  it("EA-000024 loses ALLOW when a material pre-outcome predicate is withdrawn", () => {
    const allow = SECOND_CORPUS_SPECIFICATIONS.find((s) => s.artifactId === "TA14-EA-000024");
    expect(allow).toBeDefined();
    const baseline = executeArtifactSpecification(allow!, EXECUTED_AT);
    expect(baseline.receipt.determination).toBe("ALLOW");

    const bindingPredicate = allow!.predicates.find((p) => p.stage === "BINDING");
    expect(bindingPredicate).toBeDefined();
    const mutated = mutatePredicate(allow!, bindingPredicate!.id, false);
    const challenged = executeArtifactSpecification(mutated, EXECUTED_AT);

    expect(challenged.receipt.determination).not.toBe("ALLOW");
    expect(challenged.receipt.terminalStage).toBe("BINDING");
    expect(challenged.receipt.specificationHash).not.toBe(baseline.receipt.specificationHash);
    expect(challenged.rootHash).not.toBe(baseline.rootHash);
  });

  it("EA-000018 cannot inherit action authority across a destination mismatch", () => {
    const spec = SECOND_CORPUS_SPECIFICATIONS.find((s) => s.artifactId === "TA14-EA-000018")!;
    const baseline = executeArtifactSpecification(spec, EXECUTED_AT);
    expect(baseline.receipt.determination).toBe("DENY");
    expect(baseline.receipt.terminalStage).toBe("BINDING");

    const destination = spec.predicates.find((p) => p.id.includes("BOUND-DESTINATION-MATCH"))!;
    const corrected = executeArtifactSpecification(mutatePredicate(spec, destination.id, true), EXECUTED_AT);
    expect(corrected.receipt.determination).toBe("HOLD");
    expect(corrected.receipt.terminalStage).toBe("COMMIT");
  });
});
