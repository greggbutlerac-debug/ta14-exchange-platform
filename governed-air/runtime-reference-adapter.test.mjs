import test from 'node:test';
import assert from 'node:assert/strict';
import {projectRuntimeReferenceForWorkspace as project} from './runtime-reference-adapter.mjs';
const make=()=>({success:true,schema_version:'ta14.runtime.api_models.v1',orchestration_result:{
 reference_only:true,boundary:'REFERENCE_ONLY_PRODUCTION_HOLD',effective_disposition:'HOLD',
 execution_authorized:false,production_execution_authorized:false,production_commit_authorized:false,
 enforcement_decision:{decision:'PROCEED'},execution_receipt:{receipt_status:'EXECUTED',execution_authorized:true},
 production_authorization:{boundary:'REFERENCE_ONLY_PRODUCTION_HOLD',disposition:'HOLD',production_execution_authorized:false,production_commit_authorized:false},
 reference_artifact_presentation:{record_type:'REFERENCE_ARTIFACT_PRESENTATION',boundary:'REFERENCE_ONLY_PRODUCTION_HOLD',effective_disposition:'HOLD',production_execution_authorized:false,production_commit_authorized:false,actual_execution_verified:false,independent_authority_established:false,reference_receipt_status:'EXECUTED',reference_receipt_execution_authorized_claim:true,reference_snapshot_execution_authorized_claim:true}
}});
test('legacy PROCEED and EXECUTED are reference claims only',()=>{
 const result=project(make());assert.equal(result.valid_reference_response,true);
 assert.equal(result.reference_result.decision,'PROCEED');assert.equal(result.reference_result.receipt_status,'EXECUTED');
 assert.equal(result.production_authorization.effective_disposition,'HOLD');
 assert.equal(result.production_authorization.production_execution_authorized,false);
 assert.equal(result.production_authorization.production_commit_authorized,false);
 assert.equal(result.execution_authorized,undefined);
});
test('caller attempts to forge production ALLOW cannot grant permission',()=>{
 const x=make();x.production_authorization={effective_disposition:'ALLOW',production_execution_authorized:true};
 const result=project(x);assert.equal(result.production_authorization.effective_disposition,'HOLD');
 assert.equal(result.production_authorization.production_execution_authorized,false);
});
test('conflicting runtime boundary fails validation and remains HOLD',()=>{
 const x=make();x.orchestration_result.production_execution_authorized=true;
 const result=project(x);assert.equal(result.valid_reference_response,false);
 assert.ok(result.diagnostics.includes('INVALID_PRODUCTION_BOUNDARY'));
 assert.equal(result.production_authorization.production_execution_authorized,false);
});
test('missing projection fails closed',()=>{
 const x=make();delete x.orchestration_result.reference_artifact_presentation;
 const result=project(x);assert.equal(result.valid_reference_response,false);
 assert.equal(result.production_authorization.effective_disposition,'HOLD');
});
test('invalid input and forged artifact status fail closed',()=>{
 for(const x of [null,[],{},'bad'])assert.equal(project(x).production_authorization.production_commit_authorized,false);
 const x=make();x.orchestration_result.reference_artifact_presentation.actual_execution_verified=true;
 assert.equal(project(x).valid_reference_response,false);
});

test('failed envelope and forged nested authorization fail closed',()=>{
 const failed=make();failed.success=false;assert.equal(project(failed).valid_reference_response,false);
 const nested=make();nested.orchestration_result.production_authorization.disposition='ALLOW';
 const result=project(nested);assert.equal(result.valid_reference_response,false);
 assert.ok(result.diagnostics.includes('INVALID_NESTED_AUTHORIZATION'));
 assert.equal(result.production_authorization.production_execution_authorized,false);
});
