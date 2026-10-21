import test from 'node:test';
import assert from 'node:assert/strict';
import {createBrowserReportFingerprint} from './browser-report-fingerprint.mjs';
import {fingerprintReport,verifyReportFingerprint} from './report-fingerprint.mjs';
import {createExaminationReport} from './examination-report.mjs';
import {explainUnverifiedExamination} from './browser-explanation.mjs';
import {explainGovernanceGaps} from './gap-explanation.mjs';
const input={case_id:'BROWSER-PARITY-001',created_at:'2026-10-21T12:00:00Z',observation:{description:'Hypothetical CO2 measurement',value:'1680',unit:'ppm'},proposed_action:'change_ventilation',evidence:{},authority:{}};
const report=createExaminationReport({...input,pipeline:explainUnverifiedExamination(input),gaps:explainGovernanceGaps(input)});
test('browser SHA-256 fingerprint exactly matches independent Node verifier',async()=>{
 const browser=await createBrowserReportFingerprint(report);
 const node=fingerprintReport(report);
 assert.deepEqual(browser,node);
 assert.equal(verifyReportFingerprint(report,browser).matches,true);
 assert.equal(verifyReportFingerprint(report,browser).authorityEstablished,false);
});
test('browser fingerprint refuses unauthorized report',async()=>{
 await assert.rejects(createBrowserReportFingerprint({...report,execution_authorized:true}),/validation/);
});
test('serialized downloaded report preserves independent digest equality',async()=>{
 const downloadedReport=JSON.parse(JSON.stringify(report,null,2));
 const downloadedFingerprint=JSON.parse(JSON.stringify(await createBrowserReportFingerprint(report),null,2));
 assert.equal(verifyReportFingerprint(downloadedReport,downloadedFingerprint).matches,true);
});
