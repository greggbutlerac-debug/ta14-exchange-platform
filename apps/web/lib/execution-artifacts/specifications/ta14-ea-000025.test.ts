import { describe, expect, it } from "vitest";
import {
  assertExpectedDetermination,
  executeArtifactSpecification,
  mutatePredicate,
} from "../execution-harness";
import { TA14_EA_000025_SPECIFICATION } from "./ta14-ea-000025";

const EXECUTED_AT = "2026-08-23T19:36:00.000Z";

describe("TA14-EA-000025 · Independent External-State Acquisition", () => {
  it("executes the frozen baseline to HOLD at RECORD", () => {
    const result = executeArtifactSpecification(TA14_EA_000025_SPECIFICATION, EXECUTED_AT);

    assertExpectedDetermination(result);
    expect(result.receipt.determination).toBe("HOLD");
    expect(result.receipt.terminalStage).toBe("RECORD");
    expect(result.trace.find((stage) => stage.stage === "REALITY")?.disposition).toBe("PASS");
    expect(result.trace.find((stage) => stage.stage === "RECORD")?.disposition).toBe("HOLD");
    expect(result.trace.find((stage) => stage.stage === "CONTINUITY")?.disposition).toBe("NOT_REACHED");
    expect(result.manifest).toHaveLength(3);
    expect(result.rootHash).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it("does not allow an asserted state to substitute for the missing external observation", () => {
    const changedAssertion = {
      ...TA14_EA_000025_SPECIFICATION,
      input: {
        ...TA14_EA_000025_SPECIFICATION.input,
        assertedExternalState: "CONDITION_ABSENT",
      },
    };

    const result = executeArtifactSpecification(changedAssertion, EXECUTED_AT);
    expect(result.receipt.determination).toBe("HOLD");
    expect(result.receipt.terminalStage).toBe("RECORD");
  });

  it("progresses beyond RECORD only when the external-observation predicate is satisfied", () => {
    const observed = mutatePredicate(
      TA14_EA_000025_SPECIFICATION,
      "EA25-RECORD-EXTERNAL-OBSERVATION",
      true,
    );
    const result = executeArtifactSpecification(observed, EXECUTED_AT);

    expect(result.trace.find((stage) => stage.stage === "RECORD")?.disposition).toBe("PASS");
    // The frozen baseline intentionally has no continuity evidence, so the
    // route must now HOLD at the next required evidentiary boundary.
    expect(result.receipt.determination).toBe("HOLD");
    expect(result.receipt.terminalStage).toBe("CONTINUITY");
  });

  it("changes the generated package root when a material predicate changes", () => {
    const baseline = executeArtifactSpecification(TA14_EA_000025_SPECIFICATION, EXECUTED_AT);
    const observed = executeArtifactSpecification(
      mutatePredicate(TA14_EA_000025_SPECIFICATION, "EA25-RECORD-EXTERNAL-OBSERVATION", true),
      EXECUTED_AT,
    );

    expect(observed.rootHash).not.toBe(baseline.rootHash);
    expect(observed.receipt.specificationHash).not.toBe(baseline.receipt.specificationHash);
    expect(observed.receipt.traceHash).not.toBe(baseline.receipt.traceHash);
  });
});
