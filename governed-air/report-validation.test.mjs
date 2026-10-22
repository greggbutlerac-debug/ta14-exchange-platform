import test from 'node:test';
import assert from 'node:assert/strict';
import {createExaminationReport} from './examination-report.mjs';
import {validateExaminationReport} from './report-validation.mjs';
import {explainUnverifiedExamination} from './browser-explanation.mjs';
import {explainGovernanceGaps} from './gap-explanation.mjs';
const c={case_id:'TEST-001',created_at:'2026-10-20T00:00:00Z',observation:{description:'fictional'},proposed_action:'change_ventilation',evidence:{},authority:{},result:{reason:'Not established'}};
const record={...c,pipeline:explainUnverifiedExamination(c),gaps:explainGovernanceGaps(c)};
test('preliminary report validates without implying execution authority',()=>{const report=createExaminationReport(record,null);assert.equal(validateExaminationReport(report).valid,true);assert.equal(report.execution_authorized,false)});
test('altered execution permission is rejected',()=>{const report=createExaminationReport(record,null);report.execution_authorized=true;assert.equal(validateExaminationReport(report).valid,false)});
test('missing governance anchor is rejected',()=>{const report=createExaminationReport(record,null);report.eight_anchor_trace.pop();assert.equal(validateExaminationReport(report).valid,false)});
test('fake established requirement is rejected',()=>{const report=createExaminationReport(record,null);report.outstanding_requirements[0].established=true;assert.equal(validateExaminationReport(report).valid,false)});

test('report preserves claims examined without treating them as established',()=>{
 const supplied={...record,evidence:{source:'fictional sensor'},authority:{actor:'fictional operator'},safety_escalation:true};
 const report=createExaminationReport(supplied,null);
 assert.equal(report.evidence_claims.source,'fictional sensor');
 assert.equal(report.authority_claims.actor,'fictional operator');
 assert.equal(report.safety_escalation_claim,true);
 assert.equal(report.execution_authorized,false);
 assert.equal(validateExaminationReport(report).valid,true);
});

test('rejects missing evidence claims',()=>{
 const report=createExaminationReport(record,null);
 delete report.evidence_claims;
 const result=validateExaminationReport(report);
 assert.equal(result.valid,false);
 assert.ok(result.issues.includes('Missing or invalid evidence claims'));
});
test('rejects malformed authority claims',()=>{
 const report=createExaminationReport(record,null);
 report.authority_claims='fictional operator';
 const result=validateExaminationReport(report);
 assert.equal(result.valid,false);
 assert.ok(result.issues.includes('Missing or invalid authority claims'));
});
test('rejects absent safety escalation classification',()=>{
 const report=createExaminationReport(record,null);
 delete report.safety_escalation_claim;
 const result=validateExaminationReport(report);
 assert.equal(result.valid,false);
 assert.ok(result.issues.includes('Missing safety escalation claim'));
});
