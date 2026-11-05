// Run from apps/web: node scripts/test-payment-verifier.cjs
// Isolated unit checks: no network calls, payments, or credentials.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../app/open-door/admin/payment-verifier.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}
}).outputText;
const isolated = new Module('payment-verifier-test', module);
isolated.filename = 'payment-verifier-test';
isolated.paths = module.paths;
isolated.require = (id) => id === 'server-only' ? {} : require(id);
isolated._compile(compiled, isolated.filename);
const {matchPaymentEvidence, unavailablePaymentVerifier} = isolated.exports;

const request = {
  engagementId:'ENG-123', providerTransactionReference:'TX-123',
  expectedAmountCents:14900, expectedCurrency:'USD'
};
const verified = {
  disposition:'VERIFIED', provider:'fixture-only', transactionReference:'TX-123',
  engagementId:'ENG-123', settledAmountCents:14900, currency:'USD',
  settlementState:'settled', reversalState:'clear',
  verifiedAt:'2026-01-01T00:00:00.000Z'
};
const hold = (req, evidence) => assert.equal(matchPaymentEvidence(req, evidence).disposition, 'HOLD');

(async () => {
  assert.equal((await unavailablePaymentVerifier.verify(request)).disposition, 'HOLD');
  assert.equal(matchPaymentEvidence(request, verified).disposition, 'VERIFIED');
  hold(request, {...verified, transactionReference:'OTHER'});
  hold(request, {...verified, engagementId:'OTHER'});
  hold(request, {...verified, settledAmountCents:14899});
  hold(request, {...verified, currency:'EUR'});
  hold(request, {...verified, settlementState:'pending'});
  hold(request, {...verified, reversalState:'refunded'});
  hold(request, {...verified, reversalState:'charged_back'});
  hold(request, {...verified, verifiedAt:'not-a-date'});
  hold(request, {...verified, verifiedAt:'2999-01-01T00:00:00.000Z'});
  hold({...request, expectedAmountCents:0}, verified);
  hold({...request, expectedAmountCents:149.5}, verified);
  hold({...request, providerTransactionReference:''}, verified);
  hold({...request, engagementId:''}, verified);
  hold(request, {disposition:'HOLD', reason:'provider unavailable'});
  console.log('PASS: 16 fail-closed payment-verification fixtures (no external payment activity)');
})().catch(error => { console.error(error); process.exitCode = 1; });
