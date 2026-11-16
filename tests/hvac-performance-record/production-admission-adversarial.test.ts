import {describe, expect, it} from 'vitest';
import {
  HVAC_BASELINE_STEP_ZONES,
  evaluateProductionBaselineAdmission,
} from '../../apps/web/lib/hvac-performance-record/production-admission';
import {HVAC_BASELINE_STEP_TITLES} from '../../apps/web/lib/hvac-performance-record/step-definitions';
import {claimCodes, codes, consistent, digest, envelope, receipt} from './production-admission.fixture';

// Simulates an untyped JavaScript caller or a deserialized request body.
const admit = (input: unknown) => evaluateProductionBaselineAdmission(input);
type Loose = Record<string, unknown>;
const loose = () => consistent() as unknown as {baseline: Loose & {steps: Loose[]}; evidence: Loose[]; receipts: Loose[]};

describe('finding 1: caller-built receipts are never admissible', () => {
  it('a technician-forged but fully consistent receipt set is still not admissible', () => {
    const r = admit(consistent());
    expect(r.admissible).toBe(false);
    expect(r.operational).toBe(false);
    expect(codes(r)[0]).toBe('TRUSTED_VERIFICATION_AUTHORITY_UNAVAILABLE');
  });
  it.each([
    ['signature', 'base64-client-signature'],
    ['authenticated', true],
    ['issuer', 'trusted-verifier'],
    ['admissible', true],
  ])('rejects receipts that self-assert %s', (field, value) => {
    const input = loose();
    input.receipts[0][field] = value;
    expect(claimCodes(admit(input))).toEqual(['MALFORMED_INPUT']);
  });
  it('rejects top-level attempts to assert admissibility or operation', () => {
    expect(claimCodes(admit({...consistent(), admissible: true}))).toEqual(['MALFORMED_INPUT']);
    expect(claimCodes(admit({...consistent(), operational: true}))).toEqual(['MALFORMED_INPUT']);
  });
  it('returns a frozen result that cannot be flipped by the caller', () => {
    const r = admit(consistent());
    expect(Object.isFrozen(r)).toBe(true);
    expect(Object.isFrozen(r.rejections)).toBe(true);
    expect(() => { (r as {admissible: boolean}).admissible = true; }).toThrow(TypeError);
  });
});

describe('finding 2: separation of duties', () => {
  it('rejects a verifier identical to the capturing technician', () => {
    const input = consistent();
    input.receipts[0].verifierPrincipalId = 'TECH-1';
    expect(claimCodes(admit(input))).toEqual(['SEPARATION_OF_DUTIES_VIOLATION']);
  });
  it('rejects a receipt whose technician does not match the evidence author', () => {
    const input = consistent();
    input.receipts[0].technicianPrincipalId = 'TECH-2';
    expect(claimCodes(admit(input))).toEqual(['RECEIPT_TECHNICIAN_MISMATCH']);
  });
  it('rejects relabelling the technician to dodge the verifier check', () => {
    const input = consistent();
    input.receipts[0].technicianPrincipalId = 'TECH-X';
    input.receipts[0].verifierPrincipalId = 'TECH-1';
    expect(claimCodes(admit(input))).toEqual(['RECEIPT_TECHNICIAN_MISMATCH', 'SEPARATION_OF_DUTIES_VIOLATION']);
  });
  it('rejects whitespace-padded principal ids that could alias a technician', () => {
    const input = consistent();
    input.receipts[0].verifierPrincipalId = ' TECH-1 ';
    expect(claimCodes(admit(input))).toEqual(['MALFORMED_INPUT']);
  });
});

describe('finding 3: strict booleans, no truthiness', () => {
  it.each(['stored', 'digestVerified', 'identityVerified', 'calibrationVerified'])(
    'rejects non-boolean %s values',
    field => {
      for (const value of ['false', 'true', 'no', '0', 1, 0, null, {}, []]) {
        const input = loose();
        input.receipts[0][field] = value;
        const r = admit(input);
        expect(claimCodes(r), field + '=' + JSON.stringify(value)).toEqual(['MALFORMED_INPUT']);
        expect(r.rejections[1].path).toBe('receipts[0].' + field);
      }
    },
  );
  it('rejects non-boolean technician attestation', () => {
    for (const value of ['false', 'true', 1, null]) {
      const input = loose();
      input.baseline.steps[0].technicianAttested = value;
      expect(claimCodes(admit(input))).toEqual(['MALFORMED_INPUT']);
    }
  });
  it('rejects explicit false attestation as unattested', () => {
    const input = consistent();
    input.baseline.steps[4].technicianAttested = false;
    expect(admit(input).rejections.slice(1)).toEqual([expect.objectContaining({code: 'STEP_NOT_ATTESTED', step: 5})]);
  });
});

describe('finding 4: receipts bound to the exact evidence record and digest', () => {
  it('rejects a receipt whose digest differs from the evidence payload digest', () => {
    const input = consistent();
    input.receipts[0].serverComputedSha256 = digest(99);
    expect(claimCodes(admit(input))).toEqual(['RECEIPT_DIGEST_MISMATCH']);
  });
  it('rejects a receipt replayed onto other evidence via its digest', () => {
    const input = consistent();
    input.receipts[0].serverComputedSha256 = input.receipts[1].serverComputedSha256;
    expect(claimCodes(admit(input))).toEqual(['RECEIPT_DIGEST_MISMATCH']);
  });
  it('treats digests case-insensitively but requires valid hex', () => {
    const input = consistent();
    input.evidence[0].payloadSha256 = 'AB'.repeat(32);
    input.receipts[0].serverComputedSha256 = 'ab'.repeat(32);
    expect(admit(input).claimsConsistent).toBe(true);
    input.receipts[0].serverComputedSha256 = 'not-a-digest';
    expect(claimCodes(admit(input))).toEqual(['MALFORMED_INPUT']);
  });
  it('rejects evidence captured for a different step than it is filed under', () => {
    const input = consistent();
    input.evidence[0].stepNumber = 2;
    input.receipts[0].stepNumber = 2;
    expect(claimCodes(admit(input))).toEqual(['EVIDENCE_STEP_MISMATCH', 'RECEIPT_BINDING_MISMATCH']);
  });
  it('rejects evidence and receipts from another intake', () => {
    const input = consistent();
    input.evidence[0].intakeId = 'INTAKE-2';
    input.receipts[0].intakeId = 'INTAKE-2';
    expect(claimCodes(admit(input))).toEqual(['EVIDENCE_INTAKE_MISMATCH', 'RECEIPT_BINDING_MISMATCH']);
  });
});

describe('finding 5: untrusted input is snapshotted and shape-checked', () => {
  it('rejects accessor properties that could change between check and use', () => {
    const input = loose();
    let reads = 0;
    Object.defineProperty(input.receipts[0], 'verification', {
      enumerable: true, get: () => (reads++ === 0 ? 'VERIFIED' : 'UNVERIFIED'),
    });
    const r = admit(input);
    expect(claimCodes(r)).toEqual(['MALFORMED_INPUT']);
    expect(r.rejections[1].path).toBe('receipts[0].verification');
    expect(r.rejections[1].detail).toBe('must be a data property');
    expect(reads).toBe(0);
  });
  it('rejects unexpected properties at every level', () => {
    const cases: Array<(i: ReturnType<typeof loose>) => void> = [
      i => { i.baseline.dddStatus = 'ISSUED'; },
      i => { i.baseline.steps[0].zone2 = 'INDOOR'; },
      i => { i.evidence[0].verifiedBy = 'VERIFIER-1'; },
      i => { i.evidence[0].interventionAuthorization = 'GRANTED'; },
      i => { i.receipts[0].dddStatus = 'ISSUED'; },
    ];
    for (const mutate of cases) {
      const input = loose();
      mutate(input);
      expect(claimCodes(admit(input))).toEqual(['MALFORMED_INPUT']);
    }
  });
  it('rejects evidence envelopes that claim to be verified or not technician-sourced', () => {
    for (const [field, value] of [['status', 'VERIFIED'], ['source', 'INDEPENDENT_VERIFIER'], ['schemaVersion', 'v9']]) {
      const input = loose();
      input.evidence[0][field] = value;
      expect(claimCodes(admit(input))).toEqual(['MALFORMED_INPUT']);
    }
  });
  it('rejects inherited, class-instance, symbol-keyed and __proto__-smuggled objects', () => {
    const inherited = loose();
    inherited.receipts[0] = Object.assign(Object.create({calibrationVerified: true}), inherited.receipts[0]);
    class Receipt {}
    const instance = loose();
    instance.receipts[0] = Object.assign(new Receipt(), instance.receipts[0]);
    const symbol = loose();
    symbol.receipts[0] = {...symbol.receipts[0], [Symbol('trusted')]: true};
    const proto = JSON.parse(JSON.stringify(consistent()).replace('{"receiptId"', '{"__proto__":{"x":1},"receiptId"'));
    for (const input of [inherited, instance, symbol, proto]) expect(claimCodes(admit(input))).toEqual(['MALFORMED_INPUT']);
  });
  it('is unaffected by caller mutation after evaluation', () => {
    const input = consistent();
    const r = admit(input);
    input.receipts[0].verification = 'REJECTED';
    expect(r.claimsConsistent).toBe(true);
  });
});

describe('finding 6: malformed input yields structured rejection, never a throw', () => {
  const brokenProxy = new Proxy({}, {ownKeys: () => { throw new Error('boom'); }});
  const sparse = loose();
  sparse.receipts = [, ...sparse.receipts.slice(1)] as Loose[];
  const extraArrayProp = loose();
  (extraArrayProp.receipts as unknown as Loose).extra = 1;
  const cases: Array<[string, unknown]> = [
    ['null', null], ['undefined', undefined], ['number', 5], ['string', 'baseline'], ['array', []],
    ['missing receipts', {baseline: consistent().baseline, evidence: []}],
    ['receipts null', {...consistent(), receipts: null}],
    ['intakeId number', {...consistent(), baseline: {...consistent().baseline, intakeId: 5}}],
    ['steps not array', {...consistent(), baseline: {...consistent().baseline, steps: {length: 14}}}],
    ['stepNumber string', {...consistent(), receipts: consistent().receipts.map(r => ({...r, stepNumber: String(r.stepNumber)}))}],
    ['NaN step', {...consistent(), evidence: consistent().evidence.map(e => ({...e, stepNumber: NaN}))}],
    ['too many receipts', {...consistent(), receipts: Array.from({length: 1025}, (_, i) => receipt((i % 14) + 1))}],
    ['sparse array', sparse],
    ['array with extra property', extraArrayProp],
    ['throwing proxy', {...consistent(), receipts: [brokenProxy]}],
  ];
  it.each(cases)('%s', (_, input) => {
    let r: ReturnType<typeof admit> | undefined;
    expect(() => { r = admit(input); }).not.toThrow();
    expect(r!.admissible).toBe(false);
    expect(r!.claimsConsistent).toBe(false);
    expect(claimCodes(r!)).toEqual(['MALFORMED_INPUT']);
    expect(typeof r!.rejections[1].detail).toBe('string');
  });
});

describe('finding 7: unmatched, duplicate, conflicting and unexpected receipts', () => {
  it('rejects a rogue receipt for evidence that was never supplied', () => {
    const input = consistent();
    input.receipts.push({...receipt(1), receiptId: 'RCPT-ROGUE', evidenceRecordId: 'EV-ROGUE', verification: 'REJECTED'});
    expect(claimCodes(admit(input))).toEqual(['RECEIPT_UNMATCHED']);
  });
  it('rejects two receipts claiming the same evidence (conflict)', () => {
    const input = consistent();
    input.receipts.push({...receipt(1), receiptId: 'RCPT-1B', verification: 'REJECTED'});
    expect(admit(input).rejections.slice(1)).toEqual([
      expect.objectContaining({code: 'RECEIPT_CONFLICT', step: 1, recordId: 'EV-1'}),
    ]);
  });
  it('rejects duplicate receipt ids', () => {
    const input = consistent();
    input.receipts.push(receipt(1));
    expect(claimCodes(admit(input))).toEqual(['RECEIPT_DUPLICATE_ID']);
  });
  it('rejects supplied evidence and receipts not referenced by any step', () => {
    const input = consistent();
    input.evidence.push({...envelope(3), recordId: 'EV-EXTRA'});
    input.receipts.push({...receipt(3), receiptId: 'RCPT-EXTRA', evidenceRecordId: 'EV-EXTRA'});
    expect(claimCodes(admit(input))).toEqual(['EVIDENCE_UNREFERENCED', 'RECEIPT_UNMATCHED']);
  });
  it('rejects duplicate evidence records and evidence reused across steps', () => {
    const dupEvidence = consistent();
    dupEvidence.evidence.push(envelope(1));
    expect(claimCodes(admit(dupEvidence))).toEqual(['EVIDENCE_RECORD_DUPLICATE']);
    const reused = consistent();
    reused.baseline.steps[1].evidenceRefs = ['EV-2', 'EV-1'];
    expect(claimCodes(admit(reused))).toEqual(['STEP_EVIDENCE_DUPLICATE']);
  });
  it('rejects step references with no evidence envelope or no receipt', () => {
    const noEnvelope = consistent();
    noEnvelope.evidence.shift();
    expect(claimCodes(admit(noEnvelope))).toEqual(['RECEIPT_UNMATCHED', 'EVIDENCE_RECORD_MISSING']);
    const noReceipt = consistent();
    noReceipt.receipts.shift();
    expect(claimCodes(admit(noReceipt))).toEqual(['RECEIPT_MISSING']);
  });
});

describe('finding 8: canonical seven indoor / seven outdoor ordering', () => {
  it('canonical zones are 7 indoor then 7 outdoor/system-closure, aligned with step titles', () => {
    expect(HVAC_BASELINE_STEP_ZONES).toHaveLength(HVAC_BASELINE_STEP_TITLES.length);
    expect(HVAC_BASELINE_STEP_ZONES.slice(0, 7)).toEqual(Array(7).fill('INDOOR'));
    expect(HVAC_BASELINE_STEP_ZONES.slice(7)).toEqual(Array(7).fill('OUTDOOR_SYSTEM_CLOSURE'));
    expect(HVAC_BASELINE_STEP_TITLES[0]).toMatch(/Air Handler/);
    expect(HVAC_BASELINE_STEP_TITLES[7]).toMatch(/Condenser/);
    expect(Object.isFrozen(HVAC_BASELINE_STEP_ZONES)).toBe(true);
  });
  it('rejects swapping the last indoor and first outdoor steps', () => {
    const input = consistent();
    const s = input.baseline.steps;
    [s[6], s[7]] = [s[7], s[6]];
    expect(claimCodes(admit(input))).toEqual(expect.arrayContaining(['STEP_OUT_OF_ORDER']));
    expect(admit(input).rejections.filter(x => x.code === 'STEP_OUT_OF_ORDER').map(x => x.step)).toEqual([7, 8]);
  });
  it('rejects a step labelled with the wrong zone', () => {
    const input = consistent();
    input.baseline.steps[7].zone = 'INDOOR';
    expect(admit(input).rejections.slice(1)).toEqual([expect.objectContaining({code: 'STEP_ZONE_MISMATCH', step: 8})]);
  });
  it('rejects an all-indoor baseline and an unknown zone', () => {
    const allIndoor = consistent();
    allIndoor.baseline.steps.forEach(step => { step.zone = 'INDOOR'; });
    expect(claimCodes(admit(allIndoor))).toEqual(Array(7).fill('STEP_ZONE_MISMATCH'));
    const unknown = loose();
    unknown.baseline.steps[0].zone = 'ROOF';
    expect(claimCodes(admit(unknown))).toEqual(['MALFORMED_INPUT']);
  });
  it('rejects 13 or 15 steps', () => {
    const short = consistent();
    short.baseline.steps.pop();
    expect(claimCodes(admit(short))).toContain('STEP_COUNT_INVALID');
    const long = consistent();
    long.baseline.steps.push({...long.baseline.steps[13], number: 15, evidenceRefs: ['EV-15']});
    expect(claimCodes(admit(long))).toContain('STEP_COUNT_INVALID');
  });
});
