import {strict as assert} from 'node:assert';
import {test} from 'node:test';
import {evaluateSX002, type AuthorityRecord, type CommitRequest} from './sx-002-policy-prototype';
const now = new Date('2026-10-11T12:00:00Z');
const request: CommitRequest = {actorId:'actor-1',targetId:'unit-1',action:'setpoint',scope:'zone-1',evidenceDigest:'sha256:abc',commitId:'commit-1'};
const authority: AuthorityRecord = {...request,expiresAt:'2026-10-12T12:00:00Z',revoked:false,localStanding:true,evidenceVerified:true};
const verdict = (a: AuthorityRecord | null, r=request) => evaluateSX002(r,a,now).disposition;
test('valid complete matching authority passes policy predicates',()=>assert.equal(verdict(authority),'ALLOW'));
test('missing authority holds',()=>assert.equal(verdict(null),'HOLD'));
for (const field of ['revoked','localStanding','evidenceVerified'] as const) {
 test('unknown '+field+' holds',()=>assert.equal(verdict({...authority,[field]:null} as unknown as AuthorityRecord),'HOLD'));
}
test('revoked authority holds',()=>assert.equal(verdict({...authority,revoked:true}),'HOLD'));
test('expired authority holds',()=>assert.equal(verdict({...authority,expiresAt:'2026-10-10T00:00:00Z'}),'HOLD'));
test('invalid expiry holds',()=>assert.equal(verdict({...authority,expiresAt:'garbage'}),'HOLD'));
for (const field of ['actorId','targetId','action','scope','evidenceDigest'] as const) {
 test('mismatched '+field+' holds',()=>assert.equal(verdict({...authority,[field]:'forged'}),'HOLD'));
}
test('missing commit id holds',()=>assert.equal(verdict(authority,{...request,commitId:''}),'HOLD'));
// Not tests of database isolation, authorization provenance, race/replay or physical effects.
