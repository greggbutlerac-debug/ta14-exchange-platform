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
  await page.getByText('Server-side fail-closed examination: HOLD',{exact:false}).waitFor({timeout:20000});
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download report and fingerprint package'}).click()]);
  assert.equal(download.suggestedFilename(),'governed-air-examination-package.json');
  const bundle=JSON.parse(await readFile(await download.path(),'utf8'));
  assert.equal(bundle.schema,'ta14-governed-air-export-package-v0.1');
  const {report,fingerprint}=bundle;
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
  assert.equal(await page.getByRole('heading',{name:'Disposition: AWAITING EXAMINATION'}).count(),1);
  assert.equal(await page.getByRole('button',{name:'Download report and fingerprint package'}).count(),0);
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
  assert.equal(await page.getByRole('button',{name:'Download report and fingerprint package'}).count(),0);
  assert.equal(await page.getByRole('heading',{name:'Disposition: AWAITING EXAMINATION'}).count(),1);
 }finally{await browser.close()}
});

test('editing inputs during delayed fingerprint calculation prevents stale download',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({acceptDownloads:true});
  const page=await context.newPage();
  await page.addInitScript(()=>{
   const original=SubtleCrypto.prototype.digest;
   SubtleCrypto.prototype.digest=async function(...args){
    window.__fingerprintStarted=true;
    await new Promise(resolve=>setTimeout(resolve,1200));
    return original.apply(this,args);
   };
  });
  await page.goto(origin+'/governed-air/workspace',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Examine proposed consequence'}).click();
  await page.getByText('Server-side fail-closed examination: HOLD').waitFor({timeout:20000});
  let downloaded=false;
  page.on('download',()=>{downloaded=true});
  await page.getByRole('button',{name:'Download report and fingerprint package'}).click();
  await page.waitForFunction(()=>window.__fingerprintStarted===true);
  await page.getByLabel('Observation description').fill('Updated before fingerprint completes');
  await page.waitForTimeout(1500);
  assert.equal(downloaded,false,'Stale report must not download');
  assert.equal(await page.getByRole('button',{name:'Download report and fingerprint package'}).count(),0);
  await context.close();
 }finally{await browser.close()}
});

test('synthetic runtime reference page displays legacy PROCEED but production HOLD without actuation',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const response=await page.goto(origin+'/governed-air/runtime-reference',{waitUntil:'networkidle'});
  assert.equal(response?.status(),200,'Synthetic runtime reference route must load');
  await page.getByRole('heading',{name:'Runtime Reference Boundary Demonstration'}).waitFor();
  assert.equal(await page.getByText('SYNTHETIC FIXTURE ONLY.',{exact:false}).count(),1);
  assert.equal(await page.getByText('Reference decision:').count(),1);
  assert.equal(await page.getByText('Legacy receipt status:').count(),1);
  const boundary=page.locator('section').filter({has:page.getByRole('heading',{name:'Effective production boundary'})});
  assert.equal(await boundary.getByText('HOLD',{exact:true}).count(),1);
  assert.equal(await boundary.getByText('Production execution authorized:').count(),1);
  assert.equal(await boundary.getByText('Production commit authorized:').count(),1);
  assert.equal(await page.locator('button').count(),0,'No execution buttons may be rendered');
 }finally{await browser.close()}
});
