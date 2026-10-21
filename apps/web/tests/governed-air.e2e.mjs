// Browser integration test: actual Next.js server, actual browser clicks, actual downloads.
// Run against a local development server only; never exercise production.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

const origin=process.env.GOVERNED_AIR_TEST_ORIGIN||'http://127.0.0.1:3000';
test('fictional classroom examination returns HOLD and exports matching report and fingerprint',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({acceptDownloads:true});
  const page=await context.newPage();
  await page.goto(origin+'/governed-air/workspace',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Load classroom ventilation case'}).click();
  await assert.equal(await page.getByLabel('Case identifier').inputValue(),'GA-CASE-SCHOOL-001');
  await page.getByRole('button',{name:'Examine proposed consequence'}).click();
  await page.getByText('Server-side fail-closed examination: HOLD').waitFor({timeout:20000});
  const downloads=[];
  page.on('download',d=>downloads.push(d));
  await page.getByRole('button',{name:'Download report + SHA-256 fingerprint'}).click();
  for(let i=0;i<40&&downloads.length<2;i++)await page.waitForTimeout(250);
  assert.equal(downloads.length,2,'Expected two real browser downloads');
  const byName={};
  for(const download of downloads){byName[download.suggestedFilename()]=JSON.parse(await readFile(await download.path(),'utf8'))}
  const report=byName['governed-air-preliminary-examination-report.json'];
  const fingerprint=byName['governed-air-report-fingerprint.json'];
  assert.ok(report&&fingerprint,'Report and fingerprint downloads exist');
  assert.equal(report.case_id,'GA-CASE-SCHOOL-001');
  assert.equal(report.disposition,'HOLD');
  assert.equal(report.execution_authorized,false);
  assert.equal(report.eight_anchor_trace.length,8);
  assert.equal(report.outstanding_requirements.length,11);
  const bytes=Buffer.from(JSON.stringify(report,null,2),'utf8');
  assert.equal(fingerprint.digest,createHash('sha256').update(bytes).digest('hex'));
  assert.equal(fingerprint.byte_length,bytes.length);
  await context.close();
 }finally{await browser.close()}
});
test('changing a field invalidates an in-flight examination and prevents stale export',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({acceptDownloads:true});
  const page=await context.newPage();
  await page.goto(origin+'/governed-air/workspace',{waitUntil:'networkidle'});
  await page.route('**/api/governed-air/examine',async route=>{
   await new Promise(resolve=>setTimeout(resolve,1200));
   await route.continue();
  });
  await page.getByRole('button',{name:'Examine proposed consequence'}).click();
  await page.getByLabel('Observation description').fill('Changed while examination was pending');
  await page.waitForTimeout(1800);
  assert.equal(await page.getByText('AWAITING EXAMINATION',{exact:true}).count(),1);
  assert.equal(await page.getByRole('button',{name:'Download report + SHA-256 fingerprint'}).count(),0);
  await context.close();
 }finally{await browser.close()}
});

test('editing a completed examination clears the prior server trace and report export',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto(origin+'/governed-air/workspace',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Examine proposed consequence'}).click();
  await page.getByText('Server-side fail-closed examination: HOLD').waitFor({timeout:20000});
  await page.getByLabel('Observation description').fill('A revised hypothetical observation');
  assert.equal(await page.getByText('Server-side fail-closed examination: HOLD').count(),0);
  assert.equal(await page.getByRole('button',{name:'Download report + SHA-256 fingerprint'}).count(),0);
  assert.equal(await page.getByText('AWAITING EXAMINATION',{exact:true}).count(),1);
 }finally{await browser.close()}
});
