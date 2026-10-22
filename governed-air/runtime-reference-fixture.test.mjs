import test from 'node:test';
import assert from 'node:assert/strict';
import {syntheticRuntimeResponse} from './runtime-reference-fixture.mjs';
import {projectRuntimeReferenceForWorkspace} from './runtime-reference-adapter.mjs';
test('synthetic runtime reference has conflicting legacy statuses but effective HOLD',()=>{
 const p=projectRuntimeReferenceForWorkspace(syntheticRuntimeResponse);
 assert.equal(p.valid_reference_response,true);
 assert.equal(p.reference_result.decision,'PROCEED');
 assert.equal(p.reference_result.receipt_status,'EXECUTED');
 assert.equal(p.production_authorization.effective_disposition,'HOLD');
 assert.equal(p.production_authorization.production_execution_authorized,false);
 assert.equal(p.production_authorization.production_commit_authorized,false);
});
