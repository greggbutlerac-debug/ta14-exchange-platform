import type { ArtifactPredicate, ArtifactTestSpecification, ChainStage, Determination } from "../execution-harness";
import { TA14_EA_000025_SPECIFICATION } from "./ta14-ea-000025";

type Case = {
  n: number; title: string; expected: Determination; terminal: ChainStage;
  predicate: string; description: string; failure: Exclude<Determination,"ALLOW">;
  boundary: string;
};

const stages: ChainStage[] = ["REALITY","RECORD","CONTINUITY","ADMISSIBILITY","BINDING","COMMIT","EXECUTION","OUTCOME"];
const cases: Case[] = [
  {n:26,title:"Independent Authority Resolution",expected:"HOLD",terminal:"BINDING",predicate:"AUTHORITATIVE-AUTHORITY",description:"Authority is resolved from a qualifying authoritative source at decision time.",failure:"HOLD",boundary:"Demonstrates authority-source gating; does not claim universal identity or authorization integration."},
  {n:27,title:"Evidence-to-Fact Correspondence",expected:"DENY",terminal:"ADMISSIBILITY",predicate:"PROPOSITION-CORRESPONDENCE",description:"Offered evidence corresponds to the proposition for which standing is requested.",failure:"DENY",boundary:"Demonstrates proposition-specific evidence correspondence; integrity metadata alone does not establish external truth."},
  {n:28,title:"Live Execution-Boundary Enforcement",expected:"DENY",terminal:"EXECUTION",predicate:"EXECUTION-PREDICATE",description:"Every required execution predicate has standing at the governed consequence boundary.",failure:"DENY",boundary:"Demonstrates operative refusal semantics on the frozen route; downstream non-occurrence requires separate evidence."},
  {n:29,title:"Alternate-Route and Bypass Closure",expected:"DENY",terminal:"EXECUTION",predicate:"ALTERNATE-ROUTE-AUTHORIZED",description:"A challenged alternate route has separate authorization and admissible evidence.",failure:"DENY",boundary:"Demonstrates bypass resistance only across the frozen challenge surface."},
  {n:30,title:"Protected Consequence Non-Formation",expected:"HOLD",terminal:"OUTCOME",predicate:"DOWNSTREAM-NON-OCCURRENCE",description:"Independent downstream evidence supports that the prohibited consequence did not form.",failure:"HOLD",boundary:"Demonstrates the proof requirement for non-occurrence; an internal DENY status is insufficient."},
  {n:31,title:"Independent Outcome Observation",expected:"HOLD",terminal:"OUTCOME",predicate:"INDEPENDENT-OUTCOME",description:"A qualifying independent observation supports the claimed external outcome.",failure:"HOLD",boundary:"Separates execution telemetry from independent outcome evidence."},
  {n:32,title:"Changed-Condition Requalification",expected:"HOLD",terminal:"CONTINUITY",predicate:"REQUALIFIED-AFTER-CHANGE",description:"A material changed condition has been requalified under a new governed record.",failure:"HOLD",boundary:"Demonstrates withdrawal of prior standing after material change; does not establish the changed state without evidence."},
  {n:33,title:"Frozen Independent Reproduction",expected:"ESCALATE",terminal:"OUTCOME",predicate:"SEPARATE-EVALUATOR-REPLAY",description:"A separate evaluator has completed and preserved the frozen reproduction.",failure:"ESCALATE",boundary:"Creates a reproducible package; independent standing requires an actually separate evaluator."},
  {n:34,title:"Assertion-Laundering Resistance",expected:"DENY",terminal:"ADMISSIBILITY",predicate:"QUALIFYING-PROVENANCE",description:"A VERIFIED assertion has qualifying provenance beyond internally authored metadata.",failure:"DENY",boundary:"Demonstrates evidence-rung enforcement; rejection does not establish that an assertion is false."},
  {n:35,title:"Control-System Functional Differentiation",expected:"ESCALATE",terminal:"BINDING",predicate:"COMPARATIVE-STANDING",description:"A comparative architectural claim has evidence sufficient for the requested standing.",failure:"ESCALATE",boundary:"Demonstrates functional differentiation only; no patent novelty, infringement, or universal superiority claim."},
  {n:36,title:"End-to-End Consequence-Bearing Proof — ALLOW Path",expected:"ALLOW",terminal:"OUTCOME",predicate:"OUTCOME-CLOSURE",description:"Independent outcome observation and governed closure have standing.",failure:"HOLD",boundary:"Demonstrates a bounded complete ALLOW chain only when every configured predicate passes."},
  {n:37,title:"End-to-End Consequence-Bearing Proof — HOLD Path",expected:"HOLD",terminal:"CONTINUITY",predicate:"MATERIAL-UNCERTAINTY-RESOLVED",description:"Material uncertainty introduced after record formation has been requalified.",failure:"HOLD",boundary:"Demonstrates complete-chain HOLD behavior; withholding alone does not establish safety or truth."},
  {n:38,title:"End-to-End Consequence-Bearing Proof — DENY Path",expected:"DENY",terminal:"EXECUTION",predicate:"DISQUALIFYING-CONDITION-ABSENT",description:"No disqualifying authority, admissibility, destination, or execution-boundary condition remains.",failure:"DENY",boundary:"Demonstrates bounded complete-chain DENY behavior; downstream non-occurrence requires separate evidence."},
  {n:39,title:"End-to-End Consequence-Bearing Proof — ESCALATE Path",expected:"ESCALATE",terminal:"BINDING",predicate:"CONFLICT-RESOLVED",description:"Conflicting valid evidence or authority has an admissible autonomous resolution.",failure:"ESCALATE",boundary:"Demonstrates transfer of unresolved conflict before consequence; does not claim the recipient resolved it."},
  {n:40,title:"End-to-End Independent Reproduction and Bypass Challenge",expected:"ESCALATE",terminal:"OUTCOME",predicate:"INDEPENDENT-CHALLENGE-COMPLETE",description:"A separate evaluator has completed frozen replay, mutation, bypass challenge, and preserved comparison.",failure:"ESCALATE",boundary:"Establishes a reproducible challenge package; independent-reproduction standing is never self-awarded."},
];

function predicate(n:number, stage:ChainStage, id:string, description:string, observed:boolean|null, failure:Exclude<Determination,"ALLOW">): ArtifactPredicate {
  return { id:`EA${n}-${id}`, stage, description, required:true, observed, failureDetermination:failure, evidenceRef:`specification.json#predicates.${id}` };
}

function build(c:Case): ArtifactTestSpecification {
  const terminalIndex=stages.indexOf(c.terminal);
  const predicates=stages.map((stage,index) => {
    if (index < terminalIndex) return predicate(c.n,stage,`${stage}-STANDING`,`Required ${stage.toLowerCase()} standing is present in the frozen test vector.`,true,"HOLD");
    if (index === terminalIndex) return predicate(c.n,stage,c.predicate,c.description,c.expected === "ALLOW" ? true : false,c.failure);
    return predicate(c.n,stage,`${stage}-DOWNSTREAM`,`Downstream ${stage.toLowerCase()} predicate is evaluated only if prior stages permit progression.`,c.expected === "ALLOW" ? true : null,"HOLD");
  });
  return {
    schemaVersion:"ta14.execution-spec.v1",
    artifactId:`TA14-EA-${String(c.n).padStart(6,"0")}`,
    routeId:`TA14-ROUTE-${String(c.n).padStart(3,"0")}`,
    title:c.title,
    frozenAt:"2026-08-23T19:36:00.000Z",
    input:{ testVector:"TA-14 evidence hardening corpus", case:c.n, synthetic:true, requestedStanding:c.expected },
    predicates,
    expectedDetermination:c.expected,
    claimsBoundary:c.boundary,
  };
}

export const EVIDENCE_HARDENING_SPECIFICATIONS: ArtifactTestSpecification[] = [
  TA14_EA_000025_SPECIFICATION,
  ...cases.map(build),
];

export function getEvidenceHardeningSpecification(artifactId:string): ArtifactTestSpecification | undefined {
  return EVIDENCE_HARDENING_SPECIFICATIONS.find((spec)=>spec.artifactId===artifactId);
}
