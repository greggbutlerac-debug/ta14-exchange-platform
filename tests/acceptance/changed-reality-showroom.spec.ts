import {describe,it,expect} from "vitest";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";

const source=readFileSync(resolve(process.cwd(),"apps/web/app/registry/ta-14-admissible-execution-architecture/showcase/changed-reality-test/page.tsx"),"utf8");
const rawBlock=source.slice(source.indexOf("const raw:"),source.indexOf("const provenanceText"));

describe("changed-reality R1 showroom invariants",()=>{
 it("keeps verdict fields out of raw fixtures",()=>{
  for(const forbidden of ["evidence:","authority:","standing:","decision:","gate:","commitAuthorized:"]){
   expect(rawBlock).not.toContain(forbidden);
  }
 });
 it("derives evidence from structured provenance",()=>{
  expect(source).toContain('x.provenance.sourceId.length>0&&x.provenance.signed&&x.provenance.sequenceContinuous?"ESTABLISHED":"UNRESOLVED"');
 });
 it("derives authority from the raw fire-smoke condition",()=>{
  expect(source).toContain('x.fireSmokeOverride===true?"NORMAL PATH DISPLACED":"APPLICABLE"');
 });
 it("derives standing after evidence and authority",()=>{
  expect(source).toContain('evidence!=="ESTABLISHED"?"UNRESOLVED":authority!=="APPLICABLE"?"DEFEATED":"ESTABLISHED"');
 });
 it("permits commit only for ALLOW",()=>{
  expect(source).toContain('decision==="ALLOW"?{authorized:true,gate:"COMMIT MAY PROCEED"}:{authorized:false,gate:"COMMIT BLOCKED"}');
 });
 it("keeps distinct receipt identities for all four cases",()=>{
  expect(source).toContain('run==="unresolved"?"DN3":"T0"');
  expect(source).toContain('"DN3:PROVENANCE-INCOMPLETE"');
 });
 it("binds ruleset and evaluator identity into the integrity payload",()=>{
  expect(source).toContain("RULESET.id,RULESET.version,EVALUATOR.id,EVALUATOR.version");
 });
 it("states the bounded physical-enforcement limitation",()=>{
  expect(source).toContain("does not establish universal runtime efficacy or independent physical enforcement outside this examination environment");
 });
});