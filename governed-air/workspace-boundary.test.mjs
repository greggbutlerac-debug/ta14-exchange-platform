import test from 'node:test';
import assert from 'node:assert/strict';
import {examineUnverifiedClaims} from './workspace-boundary.mjs';
const claims={proposed_action:'investigate',evidence:{source:'asserted sensor',timestamp:'asserted timestamp',calibration:'asserted',continuity:'asserted'},authority:{actor:'asserted actor',capacity:'asserted capacity',standing_basis:'asserted basis',authority_relationship:'asserted relationship',applicable_policy:'asserted policy'}};
test('complete caller assertions cannot obtain ALLOW',()=>{const r=examineUnverifiedClaims(claims);assert.equal(r.disposition,'HOLD');assert.equal(r.executionAuthorized,false);assert.equal(r.claimsVerified,false)});
test('missing evidence remains HOLD',()=>assert.equal(examineUnverifiedClaims({...claims,evidence:{}}).disposition,'HOLD'));
test('safety escalation stays ESCALATE',()=>assert.equal(examineUnverifiedClaims({...claims,safety_escalation:true}).disposition,'ESCALATE'));
test('unknown action stays DENY',()=>assert.equal(examineUnverifiedClaims({...claims,proposed_action:'override'}).disposition,'DENY'));
test('physical action stays HOLD',()=>assert.equal(examineUnverifiedClaims({...claims,proposed_action:'change_ventilation'}).disposition,'HOLD'));
