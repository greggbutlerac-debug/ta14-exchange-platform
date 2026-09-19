#!/usr/bin/env node
import { createHash } from "node:crypto";

const PROFILE = "cp:test.ta14-avp-passport-acceptance:unpublished";
const PROVIDER_REQUIRED = ["passport_id","issuer","principal_lineage","constitution_reference","purpose","delegation_envelope","authority_state","freshness","consequence_budget","irreversibility_position","jurisdiction","proof_obligations","revocation","closure_responsibility"];
const CONSUMER_REQUIRED = ["receipt_type","passport_digest","receiver_identity","decision","narrowing_proof_digest","local_constitution_digest","freshness_status","revocation_sequence","jurisdiction_profile","limitations","signer","signature"];
const DECISIONS = new Set(["ACCEPT","ACCEPT_NARROWED","HOLD","REJECT","QUARANTINE","SUSPEND","ESCALATE"]);
const FRESHNESS = new Set(["CURRENT","AGING","STALE","EXPIRED","UNKNOWN"]);
const structured = new Set(PROVIDER_REQUIRED.filter(x=>x!=="passport_id").concat(["limitations"]));

const b64u = x => Buffer.from(JSON.stringify(x),"utf8").toString("base64url");
const env = x => "avp-json-v1:"+b64u(x);
const digest = x => "sha256:"+createHash("sha256").update(JSON.stringify(x)).digest("hex");
const signed = (body, signer="test:receiver") => { const signedBody={...body,signer}; return {...signedBody,signature:"TEST_ONLY:"+digest(signedBody)}; };

function parseEnvelope(v){
  if(typeof v!=="string" || !v.startsWith("avp-json-v1:")) throw new Error("BAD_ENVELOPE");
  return JSON.parse(Buffer.from(v.slice(12),"base64url").toString("utf8"));
}
function required(obj,names){return names.filter(k=>!(k in obj)||obj[k]===""||obj[k]===undefined);}
function verifyReceiptSignature(receipt){
 const {signature,...signedBody}=receipt;
 if(typeof signature!=="string" || !signature.startsWith("TEST_ONLY:")) return false;
 return signature==="TEST_ONLY:"+digest(signedBody);
}
function basePassport(){
 return {
  passport_id:"avp_test_001",issuer:{domain:"ta14.test",id:"issuer-001"},principal_lineage:["principal-001"],
  constitution_reference:{profile:"TA14-AVP",version:"1.0.2"},purpose:{allowed:["supplier_payment"],forbidden:["cash_advance"]},
  delegation_envelope:{receiver:"receiver-001",max_depth:1,max_fanout:1},authority_state:{lease:"bounded",expires_at:"2026-09-19T00:00:00Z"},
  freshness:{status:"CURRENT",next_required_by:"2026-09-19T00:00:00Z"},consequence_budget:{currency:"USD",remaining:"1000"},
  irreversibility_position:{current:"PREPARE",next:"COMMIT"},jurisdiction:{origin:"US-FL",destination:"US-FL"},
  proof_obligations:{receipt:true},revocation:{sequence:1,max_gap_seconds:60},closure_responsibility:{owner:"receiver-001"}
 };
}
function projectPassport(p){return Object.fromEntries(Object.entries(p).map(([k,v])=>[k,structured.has(k)?env(v):String(v)]));}
function receiptFor(p, decision="ACCEPT_NARROWED"){
 const proof={parent_passport_digest:digest(p),child_passport_digest:digest({...p,purpose:{...p.purpose,allowed:["supplier_payment"]}}),narrowed_dimensions:["purpose"],signer:"test:receiver",signature:"TEST_ONLY"};
 const body={receipt_type:"PassportAcceptanceReceipt",passport_digest:digest(p),receiver_identity:"receiver-001",decision,
 narrowing_proof_digest:digest(proof),local_constitution_digest:digest({constitution:"receiver-test"}),freshness_status:p.freshness.status,
 revocation_sequence:String(p.revocation.sequence),jurisdiction_profile:"test:us-fl",limitations:env(["supplier_payment_only"])};
 return {receipt:signed(body),proof};
}
function evaluate(name, mutate){
 let p=basePassport(); let {receipt,proof}=receiptFor(p); let provider=projectPassport(p); let consumer={...receipt};
 let ctx={p,provider,consumer,proof,expected:"ACCEPT_NARROWED",vector:"AV-005",semantic_errors:[]};
 ctx=mutate?mutate(ctx)||ctx:ctx;
 ({p,provider,consumer,proof}=ctx);
 const errors=[]; const pm=required(provider,PROVIDER_REQUIRED), cm=required(consumer,CONSUMER_REQUIRED);
 if(pm.length) errors.push("MISSING_PROVIDER:"+pm.join(",")); if(cm.length) errors.push("MISSING_CONSUMER:"+cm.join(","));
 for(const k of structured) if(k in provider||k==="limitations") try{parseEnvelope(k==="limitations"?consumer[k]:provider[k])}catch{errors.push("BAD_ENVELOPE:"+k)}
 if(consumer.decision&&!DECISIONS.has(consumer.decision)) errors.push("BAD_DECISION");
 if(consumer.freshness_status&&!FRESHNESS.has(consumer.freshness_status)) errors.push("BAD_FRESHNESS");
 if(!verifyReceiptSignature(consumer)) errors.push("RECEIPT_INTEGRITY_MISMATCH");
 errors.push(...ctx.semantic_errors);
 const transportOrIntegrityFailure=errors.some(e=>e.startsWith("MISSING_")||e.startsWith("BAD_ENVELOPE")||e==="RECEIPT_INTEGRITY_MISMATCH");
 const semanticFailureMap={INHERITANCE_BROADENING:"INHERITANCE_FAILURE",UNKNOWN_MANDATORY_EXTENSION:"FAIL_CLOSED",REVOCATION_PRECEDENCE:"REVOCATION_PRECEDENCE",IDENTITY_CLASS_CONFUSION:"SEMANTIC_FAILURE",CHANGED_CONDITION_REVALIDATION_REQUIRED:"REVALIDATION_REQUIRED"};
 const semanticFailure=ctx.semantic_errors.map(e=>semanticFailureMap[e]).find(Boolean);
 const result=transportOrIntegrityFailure?"FAIL_CLOSED":semanticFailure||consumer.decision;
 return {fixture_id:name,avp_vector:ctx.vector,profile:PROFILE,cp_transport_result:errors.some(e=>e.startsWith("MISSING_")||e.startsWith("BAD_ENVELOPE")||e==="RECEIPT_INTEGRITY_MISMATCH")?"FAIL":"PASS",avp_result:result,
 expected_avp_result:ctx.expected,expectation_met:result===ctx.expected,execution_authority:"NOT_ESTABLISHED_BY_CP",local_execution_observed:false,errors};
}
const fixtures=[
 ["CP-FX-001",null],
 ["CP-FX-002",s=>{s.vector="AV-021";s.p.freshness.status="STALE";s.provider.freshness=env(s.p.freshness);s.consumer={...receiptFor(s.p,"SUSPEND").receipt};s.expected="SUSPEND";return s}],
 ["CP-FX-003",s=>{s.vector="AV-007";s.consumer={...receiptFor(s.p,"HOLD").receipt};s.expected="HOLD";return s}],
 ["CP-FX-004",s=>{s.vector="AV-004";s.semantic_errors.push("INHERITANCE_BROADENING");s.expected="INHERITANCE_FAILURE";return s}],
 ["CP-FX-005",s=>{s.vector="AV-008";s.consumer={...receiptFor(s.p,"ESCALATE").receipt};s.expected="ESCALATE";return s}],
 ["CP-FX-006",s=>{s.vector="AV-002";s.consumer={...receiptFor(s.p,"REJECT").receipt};s.expected="REJECT";return s}],
 ["CP-FX-007",s=>{s.vector="AV-024";s.consumer={...receiptFor(s.p,"REJECT").receipt};s.expected="REJECT";return s}],
 ["CP-FX-008",s=>{s.vector="AV-013";delete s.provider.closure_responsibility;s.expected="FAIL_CLOSED";return s}],
 ["CP-FX-009",s=>{s.vector="AV-003";s.semantic_errors.push("UNKNOWN_MANDATORY_EXTENSION");s.expected="FAIL_CLOSED";return s}],
 ["CP-FX-010",s=>{s.vector="AV-006";s.semantic_errors.push("REVOCATION_PRECEDENCE");s.expected="REVOCATION_PRECEDENCE";return s}],
 ["CP-FX-011",s=>{s.vector="AV-014";s.consumer={...receiptFor(s.p,"HOLD").receipt};s.expected="HOLD";return s}],
 ["CP-FX-012",s=>{s.vector="AV-022";s.semantic_errors.push("IDENTITY_CLASS_CONFUSION");s.expected="SEMANTIC_FAILURE";return s}],
 ["CP-FX-013",s=>{s.vector="BINDING";s.provider.freshness="avp-json-v1:%%%";s.expected="FAIL_CLOSED";return s}],
 ["CP-FX-014",s=>{s.vector="BINDING";s.consumer.decision="ACCEPT";s.expected="FAIL_CLOSED";return s}],
 ["CP-FX-015",s=>{s.vector="RECOVERY";s.semantic_errors.push("CHANGED_CONDITION_REVALIDATION_REQUIRED");s.expected="REVALIDATION_REQUIRED";return s}]
];
const results=fixtures.map(([id,m])=>evaluate(id,m));
console.log(JSON.stringify({status:"LOCAL_EXERCISE_ONLY",profile:PROFILE,executed_at:new Date().toISOString(),all_expectations_met:results.every(r=>r.expectation_met),results},null,2));
if(results.some(r=>r.execution_authority!=="NOT_ESTABLISHED_BY_CP")) process.exit(2);
