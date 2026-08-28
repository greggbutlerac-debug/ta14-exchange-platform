import {describe,expect,it} from "vitest";
import {evaluateGdprAiActIntersection,type IntersectionInput} from "./gdpr-intersection";

const base: IntersectionInput={personalData:"yes",lawfulBasis:"yes",gdprEvidence:"yes",aiInScope:"yes",aiClassified:"yes",aiEvidence:"yes",materialChange:"no"};

describe("evaluateGdprAiActIntersection",()=>{
  it("keeps AI Act incomplete when GDPR is supported",()=>{
    const result=evaluateGdprAiActIntersection({...base,aiEvidence:"unknown"});
    expect(result.gdpr).toBe("SUPPORTED");
    expect(result.aiAct).toBe("INCOMPLETE");
  });

  it("keeps GDPR incomplete when AI Act is supported",()=>{
    const result=evaluateGdprAiActIntersection({...base,lawfulBasis:"unknown"});
    expect(result.gdpr).toBe("INCOMPLETE");
    expect(result.aiAct).toBe("SUPPORTED");
  });

  it("requires revalidation and withdraws reliance after a material change",()=>{
    const result=evaluateGdprAiActIntersection({...base,materialChange:"yes"});
    expect(result.revalidationRequired).toBe(true);
    expect(result.gdpr).toBe("INCOMPLETE");
    expect(result.aiAct).toBe("INCOMPLETE");
  });

  it("fails closed when material-change state is unknown",()=>{
    const result=evaluateGdprAiActIntersection({...base,materialChange:"unknown"});
    expect(result.revalidationRequired).toBe(true);
    expect(result.gdpr).not.toBe("SUPPORTED");
    expect(result.aiAct).not.toBe("SUPPORTED");
  });

  it("keeps missing evidence incomplete",()=>{
    const result=evaluateGdprAiActIntersection({...base,gdprEvidence:"no",aiEvidence:"no"});
    expect(result.gdpr).toBe("INCOMPLETE");
    expect(result.aiAct).toBe("INCOMPLETE");
  });

  it("represents explicit non-scope without manufacturing compliance",()=>{
    const result=evaluateGdprAiActIntersection({...base,personalData:"no",aiInScope:"no"});
    expect(result.gdpr).toBe("OUT_OF_SCOPE");
    expect(result.aiAct).toBe("OUT_OF_SCOPE");
  });
});
