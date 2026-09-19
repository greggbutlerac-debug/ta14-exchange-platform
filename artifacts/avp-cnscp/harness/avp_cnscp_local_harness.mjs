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
const signed = (body, signer="test:receiver") => ({...body, signer, signature:"TEST_ONLY:"+digest(body)});

function parseEnvelope(v){
  if(typeof v!=="string" || !v.startsWith("avp-json-v1:")) throw new Error("BAD_ENVELOPE");
  return JSON.parse(Buffer.from(v.slice(12),"base64url").toString("utf8"));
}
function required(obj,names){return names.filter(k=>!(k in obj)||obj[k]===""||obj[k]===undefined);}
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
 ({p,provider,consumer,proof}=mutate?mutate({p,provider,consumer,proof})||{p,provider,consumer,proof}:{p,provider,consumer,proof});
 const errors=[]; const pm=required(provider,PROVIDER_REQUIRED), cm=required(consumer,CONSUMER_REQUIRED);
 if(pm.length) errors.push("MISSING_PROVIDER:"+pm.join(",")); if(cm.length) errors.push("MISSING_CONSUMER:"+cm.join(","));
 for(const k of structured) if(k in provider||k==="limitations") try{parseEnvelope(k==="limitations"?consumer[k]:provider[k])}catch{errors.push("BAD_ENVELOPE:"+k)}
 if(consumer.decision&&!DECISIONS.has(consumer.decision)) errors.push("BAD_DECISION");
 if(consumer.freshness_status&&!FRESHNESS.has(consumer.freshness_status)) errors.push("BAD_FRESHNESS");
 return {fixture_id:name,profile:PROFILE,cp_transport_result:errors.length?"FAIL":"PASS",avp_result:errors.length?"FAIL_CLOSED":consumer.decision,
 execution_authority:"NOT_ESTABLISHED_BY_CP",local_execution_observed:false,errors};
}
const fixtures=[
 ["CP-FX-001",null],
 ["CP-FX-002",s=>{s.p.freshness.status="STALE";s.provider.freshness=env(s.p.freshness);s.consumer.freshness_status="STALE";s.consumer.decision="SUSPEND";return s}],
 ["CP-FX-006",s=>{s.consumer.decision="REJECT";return s}],
 ["CP-FX-008",s=>{delete s.provider.closure_responsibility;return s}],
 ["CP-FX-013",s=>{s.provider.freshness="avp-json-v1:%%%";return s}],
 ["CP-FX-014",s=>{s.consumer.decision="ACCEPT";return s}]
];
const results=fixtures.map(([id,m])=>evaluate(id,m));
console.log(JSON.stringify({status:"LOCAL_EXERCISE_ONLY",profile:PROFILE,executed_at:new Date().toISOString(),results},null,2));
if(results.some(r=>r.execution_authority!=="NOT_ESTABLISHED_BY_CP")) process.exit(2);
