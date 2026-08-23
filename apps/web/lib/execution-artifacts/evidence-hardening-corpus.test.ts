import { describe, expect, it } from "vitest";
import { assertExpectedDetermination, executeArtifactSpecification, mutatePredicate, TA14_CHAIN } from "./execution-harness";
import { EVIDENCE_HARDENING_SPECIFICATIONS } from "./specifications/evidence-hardening-specifications";

const EXECUTED_AT = "2026-08-23T19:36:00.000Z";

describe("TA-14 evidence hardening executable corpus", () => {
  it("contains one executable frozen specification for every artifact EA-000025 through EA-000040", () => {
    expect(EVIDENCE_HARDENING_SPECIFICATIONS).toHaveLength(16);
    expect(EVIDENCE_HARDENING_SPECIFICATIONS.map((x)=>x.artifactId)).toEqual(
      Array.from({length:16},(_,i)=>`TA14-EA-${String(i+25).padStart(6,"0")}`),
    );
  });

  for (const specification of EVIDENCE_HARDENING_SPECIFICATIONS) {
    it(`${specification.artifactId} executes to its frozen expected determination`, () => {
      const result=executeArtifactSpecification(specification,EXECUTED_AT);
      assertExpectedDetermination(result);
      expect(result.trace).toHaveLength(TA14_CHAIN.length);
      expect(result.receipt.specificationHash).toMatch(/^sha256:[0-9a-f]{64}$/);
      expect(result.receipt.traceHash).toMatch(/^sha256:[0-9a-f]{64}$/);
      expect(result.rootHash).toMatch(/^sha256:[0-9a-f]{64}$/);
      expect(result.manifest).toHaveLength(3);
    });
  }

  it("EA-000036 ALLOW is contingent rather than hard-coded", () => {
    const spec=EVIDENCE_HARDENING_SPECIFICATIONS.find((x)=>x.artifactId==="TA14-EA-000036")!;
    const baseline=executeArtifactSpecification(spec,EXECUTED_AT);
    expect(baseline.receipt.determination).toBe("ALLOW");
    const authority=spec.predicates.find((p)=>p.stage==="BINDING")!;
    const challenged=executeArtifactSpecification(mutatePredicate(spec,authority.id,false),EXECUTED_AT);
    expect(challenged.receipt.determination).toBe("HOLD");
    expect(challenged.receipt.terminalStage).toBe("BINDING");
    expect(challenged.rootHash).not.toBe(baseline.rootHash);
  });

  it("every non-ALLOW artifact stops progression and marks later stages NOT_REACHED", () => {
    for (const spec of EVIDENCE_HARDENING_SPECIFICATIONS.filter((x)=>x.expectedDetermination!=="ALLOW")) {
      const result=executeArtifactSpecification(spec,EXECUTED_AT);
      const terminalIndex=result.trace.findIndex((x)=>x.stage===result.receipt.terminalStage);
      expect(result.trace.slice(terminalIndex+1).every((x)=>x.disposition==="NOT_REACHED")).toBe(true);
    }
  });
});
