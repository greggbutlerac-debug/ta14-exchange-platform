#!/usr/bin/env node
import { createHash } from "node:crypto";

const PROFILE = "cp:ta14.avp.passport:candidate-v0.2";
const DECISIONS = new Set(["ACCEPT","ACCEPT_NARROWED","HOLD","REJECT"]);
const digest = v => "sha256:" + createHash("sha256").update(JSON.stringify(v)).digest("hex");
const sign = body => ({...body, signer:"test:receiver", signature:"TEST_ONLY:"+digest({...body,signer:"test:receiver"})});
const verify = r => {
  const {signature,...body}=r;
  return signature==="TEST_ONLY:"+digest(body);
};
const noNarrowing = passportDigest => ({type:"NO_NARROWING_ASSERTION",passport_digest:passportDigest,decision:"ACCEPT",version:"candidate-v0.2"});

function passport(overrides={}) {
  return {passport_id:"avp_candidate_001",version:"1.0.2",purpose:["supplier_payment"],scope:"bounded",budget:{currency:"USD",remaining:"1000"},expiry:"2026-09-27T00:00:00Z",lineage:["principal-001"],revoked:false,...overrides};
}
function makeExchange(p, decision="ACCEPT_NARROWED") {
  const pd=digest(p);
  let proof;
  let narrowingDigest;
  if(decision==="ACCEPT_NARROWED"){
    proof={type:"NarrowingProof",parent_passport_digest:pd,narrowed_dimensions:["purpose"],resulting_scope:["supplier_payment"],signer:"test:receiver"};
    narrowingDigest=digest(proof);
  } else if(decision==="ACCEPT") {
    narrowingDigest=digest(noNarrowing(pd));
  } else {
    narrowingDigest=digest({type:"NO_ACCEPTANCE_BINDING",passport_digest:pd,decision});
  }
  const receipt=sign({receipt_type:"PassportAcceptanceReceipt",passport_digest:pd,decision,narrowing_proof_digest:narrowingDigest});
  return {provider:{passport:p,passport_digest:pd},consumer:{decision,receipt,...(proof?{narrowing_proof:proof}:{})}};
}
function evaluate(id, setup) {
  let x=makeExchange(passport());
  let expected="PASS";
  let note="";
  ({x,expected,note}=setup?setup({x,expected,note})||{x,expected,note}:{x,expected,note});
  const errors=[];
  if(!x.provider || !("passport" in x.provider) || !x.provider.passport_digest) errors.push("MISSING_PROVIDER_PROPERTY");
  if(x.provider?.passport && x.provider.passport_digest!==digest(x.provider.passport)) errors.push("PASSPORT_DIGEST_MISMATCH");
  if(!x.consumer || !DECISIONS.has(x.consumer.decision)) errors.push("BAD_DECISION");
  if(!x.consumer?.receipt) errors.push("MISSING_RECEIPT");
  else {
    if(!verify(x.consumer.receipt)) errors.push("RECEIPT_INTEGRITY_MISMATCH");
    if(x.consumer.receipt.passport_digest!==x.provider.passport_digest) errors.push("RECEIPT_PASSPORT_BINDING_MISMATCH");
    if(x.consumer.receipt.decision!==x.consumer.decision) errors.push("RECEIPT_DECISION_BINDING_MISMATCH");
    if(x.consumer.decision==="ACCEPT_NARROWED"){
      if(!x.consumer.narrowing_proof) errors.push("MISSING_NARROWING_PROOF");
      else if(x.consumer.receipt.narrowing_proof_digest!==digest(x.consumer.narrowing_proof)) errors.push("NARROWING_PROOF_BINDING_MISMATCH");
    } else {
      if(x.consumer.narrowing_proof) errors.push("EXTRANEOUS_NARROWING_PROOF");
      if(x.consumer.decision==="ACCEPT"){
        const expectedDigest=digest(noNarrowing(x.provider.passport_digest));
        if(x.consumer.receipt.narrowing_proof_digest!==expectedDigest) errors.push("NO_NARROWING_BINDING_MISMATCH");
      }
    }
  }
  const actual=errors.length?"FAIL_CLOSED":"PASS";
  return {fixture_id:id,profile:PROFILE,expected,actual,expectation_met:expected===actual,note,errors,execution_authority:"NOT_ESTABLISHED_BY_CP",local_execution_observed:false};
}

const fixtures=[
 ["CP2-FX-001",null],
 ["CP2-FX-002",s=>{s.x=makeExchange(passport(),"ACCEPT");s.note="valid ACCEPT with deterministic no-narrowing receipt binding";return s}],
 ["CP2-FX-003",s=>{s.x=makeExchange(passport(),"HOLD");return s}],
 ["CP2-FX-004",s=>{s.x=makeExchange(passport(),"REJECT");return s}],
 ["CP2-FX-005",s=>{s.x.provider.passport_digest="sha256:tampered";s.expected="FAIL_CLOSED";return s}],
 ["CP2-FX-006",s=>{s.x.consumer.receipt.decision="ACCEPT";s.expected="FAIL_CLOSED";return s}],
 ["CP2-FX-007",s=>{delete s.x.consumer.narrowing_proof;s.expected="FAIL_CLOSED";return s}],
 ["CP2-FX-008",s=>{s.x.consumer.narrowing_proof={...s.x.consumer.narrowing_proof,narrowed_dimensions:["budget"]};s.expected="FAIL_CLOSED";return s}],
 ["CP2-FX-009",s=>{s.x=makeExchange(passport(),"ACCEPT");s.x.consumer.receipt.narrowing_proof_digest="sha256:fake";s.expected="FAIL_CLOSED";return s}],
 ["CP2-FX-010",s=>{s.x=makeExchange(passport(),"ACCEPT");s.x.consumer.narrowing_proof={type:"NarrowingProof"};s.expected="FAIL_CLOSED";return s}],
 ["CP2-FX-011",s=>{delete s.x.provider.passport;s.expected="FAIL_CLOSED";return s}],
 ["CP2-FX-012",s=>{s.x.consumer.decision="ESCALATE";s.expected="FAIL_CLOSED";return s}],
 ["CP2-FX-013",s=>{s.x=makeExchange(passport({revoked:true}),"HOLD");s.note="revocation semantic simulated locally; revoked is inside opaque Passport, not a CP property";return s}],
 ["CP2-FX-014",s=>{s.x=makeExchange(passport({expiry:"2026-09-01T00:00:00Z"}),"HOLD");s.note="freshness semantic simulated locally; expiry remains inside opaque Passport";return s}],
 ["CP2-FX-015",s=>{s.x=makeExchange(passport(),"ACCEPT_NARROWED");s.x.consumer.receipt.passport_digest="sha256:other";s.expected="FAIL_CLOSED";return s}],
 ["CP2-FX-016",s=>{s.x=makeExchange(passport(),"ACCEPT");s.x.consumer.receipt.signature="TEST_ONLY:tampered";s.expected="FAIL_CLOSED";return s}]
];
const results=fixtures.map(([id,setup])=>evaluate(id,setup));
const report={status:"LOCAL_EXERCISE_ONLY",profile:PROFILE,executed_at:new Date().toISOString(),candidate_seam:"ACCEPT no-narrowing serialization remains proposed pending CNS/CP review",all_expectations_met:results.every(r=>r.expectation_met),invariants_preserved:results.every(r=>r.execution_authority==="NOT_ESTABLISHED_BY_CP"&&r.local_execution_observed===false),results};
console.log(JSON.stringify(report,null,2));
if(!report.all_expectations_met||!report.invariants_preserved) process.exit(2);
