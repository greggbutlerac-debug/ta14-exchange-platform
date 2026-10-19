import test from 'node:test';
import assert from 'node:assert/strict';
import {explainGovernanceGaps} from './gap-explanation.mjs';
test('empty claims produce explicit missing requirements',()=>{const gaps=explainGovernanceGaps({});assert.equal(gaps.length,11);assert.equal(gaps[0].claimStatus,'CLAIM_MISSING');assert.ok(gaps.every(x=>x.established===false))});
test('populated claims remain unverified',()=>{const gaps=explainGovernanceGaps({evidence:{source:'claimed sensor'},authority:{actor:'claimed operator'}});assert.equal(gaps[0].claimStatus,'CLAIM_PRESENT_UNVERIFIED');assert.equal(gaps.find(x=>x.id==='actor').claimStatus,'CLAIM_PRESENT_UNVERIFIED');assert.equal(gaps.find(x=>x.id==='execution_receipt').claimStatus,'NOT_IMPLEMENTED')});
