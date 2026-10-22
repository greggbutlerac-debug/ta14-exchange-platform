import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {reviewExportPackage} from './verify-export-package.mjs';
import {createExaminationReport} from './examination-report.mjs';
import {explainUnverifiedExamination} from './browser-explanation.mjs';
import {explainGovernanceGaps} from './gap-explanation.mjs';
import {fingerprintReport} from './report-fingerprint.mjs';
const c={case_id:'PACKAGE-001',created_at:'2026-10-21T00:00:00Z',observation:{description:'Fictional'},proposed_action:'investigate',evidence:{},authority:{}};
const report=createExaminationReport({...c,pipeline:explainUnverifiedExamination(c),gaps:explainGovernanceGaps(c)});
const bundle={schema:'ta14-governed-air-export-package-v0.1',report,fingerprint:fingerprintReport(report)};
test('independent reviewer accepts consistent teaching package without conferring authority',()=>{
 const review=reviewExportPackage(bundle);
 assert.equal(review.packageValid,true);
 assert.equal(review.integrityMatch,true);
 assert.equal(review.authorityEstablished,false);
 assert.equal(review.executionAuthorized,false);
 assert.equal(review.disposition,'HOLD');
});
test('independent reviewer rejects changed report',()=>{
 const review=reviewExportPackage({...bundle,report:{...report,case_id:'ALTERED'}});
 assert.equal(review.packageValid,false);
 assert.equal(review.integrityMatch,false);
});
test('independent reviewer rejects invalid schema',()=>{
 assert.equal(reviewExportPackage({...bundle,schema:'other'}).packageValid,false);
});

test('tampering with a supplied authority claim breaks the fingerprint',()=>{
 const withClaims=createExaminationReport({...c,evidence:{source:'fictional sensor A'},authority:{actor:'fictional actor A',standing_basis:'unverified role'},safety_escalation:true,pipeline:explainUnverifiedExamination(c),gaps:explainGovernanceGaps(c)});
 const signedByNobody={schema:'ta14-governed-air-export-package-v0.1',report:withClaims,fingerprint:fingerprintReport(withClaims)};
 assert.equal(reviewExportPackage(signedByNobody).packageValid,true);
 const changed={...withClaims,authority_claims:{...withClaims.authority_claims,standing_basis:'forged approval'}};
 const review=reviewExportPackage({...signedByNobody,report:changed});
 assert.equal(review.packageValid,false);
 assert.equal(review.integrityMatch,false);
 assert.equal(review.executionAuthorized,false);
});
