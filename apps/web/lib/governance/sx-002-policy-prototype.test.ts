import {expect, test} from 'vitest';
import {evaluateSX002, type AuthorityRecord, type CommitRequest} from './sx-002-policy-prototype';
const now = new Date('2026-10-11T12:00:00Z');
const request: CommitRequest = {actorId:'actor-1',targetId:'unit-1',action:'setpoint',scope:'zone-1',evidenceDigest:'sha256:abc',commitId:'commit-1'};
const authority: AuthorityRecord = {...request,expiresAt:'2026-10-12T12:00:00Z',revoked:false,localStanding:true,evidenceVerified:true};
const verdict = (a: AuthorityRecord | null, r=request) => evaluateSX002(r,a,now).disposition;
test('valid complete matching authority passes policy predicates',()=>expect(verdict(authority)).toBe('ALLOW'));
test('missing authority holds',()=>expect(verdict(null)).toBe('HOLD'));
for (const field of ['revoked','localStanding','evidenceVerified'] as const) {
 test('unknown '+field+' holds',()=>expect(verdict({...authority,[field]:null} as unknown as AuthorityRecord)).toBe('HOLD'));
}
test('revoked authority holds',()=>expect(verdict({...authority,revoked:true})).toBe('HOLD'));
test('expired authority holds',()=>expect(verdict({...authority,expiresAt:'2026-10-10T00:00:00Z'})).toBe('HOLD'));
test('invalid expiry holds',()=>expect(verdict({...authority,expiresAt:'garbage'})).toBe('HOLD'));
for (const field of ['actorId','targetId','action','scope','evidenceDigest'] as const) {
 test('mismatched '+field+' holds',()=>expect(verdict({...authority,[field]:'forged'})).toBe('HOLD'));
}
test('missing commit id holds',()=>expect(verdict(authority,{...request,commitId:''})).toBe('HOLD'));
// Not tests of database isolation, authorization provenance, race/replay or physical effects.
