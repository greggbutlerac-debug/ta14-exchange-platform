/**
 * Route-level tests for payment verification and the commercial owner alerts.
 * PayPal (fetch), Supabase (client) and the alert sink (raiseOwnerAlert) are faked at their boundaries;
 * the route handlers themselves run unmodified.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { fakeSupabase, type FakeQuery, type FakeResult } from './test-support/fake-supabase';

const alerts = vi.hoisted(() => ({ raised: [] as Record<string, any>[] }));
const db = vi.hoisted(() => ({ handler: (() => ({ data: null, error: null })) as (q: any) => any, log: [] as any[] }));

vi.mock('@/lib/owner-alerts/server', () => ({
  raiseOwnerAlert: async (alert: Record<string, any>) => {
    alerts.raised.push(alert);
  },
  isOperatorIdentity: ({ email }: { email?: string | null }) => email === 'owner@ta14.test',
  isPaymentSandbox: () => process.env.PAYPAL_ENVIRONMENT === 'sandbox',
  ownerRecordUrl: (p: string) => `https://example.test${p}`,
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => {
    const fake = fakeSupabase((q: FakeQuery) => db.handler(q));
    db.log = fake.log;
    return fake.client;
  },
}));

const INTAKE = 'TA14-CEX-20261001-ABCDEF1234';
type PayPalScript = { order?: Record<string, unknown> | null; capture?: Record<string, unknown>; created?: Record<string, unknown> };
let paypal: PayPalScript = {};
const paypalCalls: string[] = [];

function completedOrder(overrides: Record<string, unknown> = {}, captureAmount = '149.00') {
  return {
    id: 'ORDER1',
    status: 'COMPLETED',
    payer: { email_address: 'buyer@example.com', name: { given_name: 'Ada', surname: 'Buyer' } },
    purchase_units: [
      {
        reference_id: 'governed-consequence-examination',
        custom_id: `governed-consequence-examination:${INTAKE}`,
        payments: { captures: [{ id: 'CAP1', status: 'COMPLETED', amount: { value: captureAmount, currency_code: 'USD' }, create_time: '2026-10-01T12:00:00Z' }] },
      },
    ],
    ...overrides,
  };
}

beforeEach(() => {
  alerts.raised.length = 0;
  paypalCalls.length = 0;
  paypal = {};
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://db.example.test';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test';
  process.env.PAYPAL_CLIENT_ID = 'client';
  process.env.PAYPAL_CLIENT_SECRET = 'secret';
  process.env.PAYPAL_ENVIRONMENT = 'live';
  vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
    paypalCalls.push(`${init?.method ?? 'GET'} ${url}`);
    const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
    if (url.endsWith('/v1/oauth2/token')) return json(200, { access_token: 'token' });
    if (url.endsWith('/capture')) return json(201, paypal.capture);
    if (url.endsWith('/v2/checkout/orders') && init?.method === 'POST') return json(201, paypal.created);
    if (url.includes('/v2/checkout/orders/')) return paypal.order === null ? json(404, {}) : json(200, paypal.order);
    throw new Error(`unexpected fetch ${url}`);
  });
});
afterEach(() => vi.unstubAllGlobals());

function intakeDb(status: 'READY_FOR_PAYMENT' | 'PAID', paidOrderId: string | null = null) {
  return (q: FakeQuery): FakeResult => {
    if (q.table === 'ta14_consequence_examination_intakes' && q.action === 'select') return { data: { intake_id: INTAKE, status, paypal_order_id: paidOrderId, paypal_capture_id: paidOrderId ? 'CAP1' : null }, error: null };
    if (q.table === 'ta14_consequence_intake_evidence') return { data: [], error: null };
    if (q.table === 'ta14_consequence_examination_intakes' && q.action === 'update') return { data: { intake_id: INTAKE, status: 'PAID', paid_at: (q.payload as any).paid_at, payload_sha256: 'p', evidence_manifest_sha256: 'm', evidence_item_count: 0, evidence_frozen_at: (q.payload as any).paid_at }, error: null };
    if (q.table === 'ta14_consequence_examination_queue') return { data: { queue_id: 'TA14-CEX-Q-1', state: 'QUEUED', queued_at: '2026-10-01T12:00:05Z' }, error: null };
    if (q.table === 'ta14_consequence_examination_queue_events') return { data: null, error: null };
    throw new Error(`unexpected query ${q.table} ${q.action}`);
  };
}

async function postPayment(body: Record<string, unknown>) {
  const { POST } = await import('@/app/api/consequence-examination/payment/route');
  return POST(new NextRequest('https://www.ta14exchange.com/api/consequence-examination/payment', { method: 'POST', headers: { 'Content-Type': 'application/json', origin: 'https://www.ta14exchange.com' }, body: JSON.stringify(body) }));
}

const updates = () => db.log.filter((q) => q.action === 'update');

describe('$149 payment verification route', () => {
  it('rejects a forged confirmation when PayPal shows no completed payment, and changes nothing', async () => {
    db.handler = intakeDb('READY_FOR_PAYMENT');
    paypal.order = completedOrder({ status: 'APPROVED' });
    const res = await postPayment({ intakeId: INTAKE, orderId: 'ORDER1', captureId: 'FORGED', amount: '149.00', currency: 'USD' });
    expect(res.status).toBe(402);
    expect((await res.json()).reason).toBe('ORDER_NOT_COMPLETED');
    expect(updates()).toHaveLength(0);
    expect(alerts.raised).toHaveLength(0);
  });

  it('rejects a capture that PayPal records at a different amount', async () => {
    db.handler = intakeDb('READY_FOR_PAYMENT');
    paypal.order = completedOrder({}, '1.00');
    const res = await postPayment({ intakeId: INTAKE, orderId: 'ORDER1' });
    expect(res.status).toBe(402);
    expect((await res.json()).reason).toBe('AMOUNT_MISMATCH');
    expect(updates()).toHaveLength(0);
  });

  it('rejects an order that does not exist at PayPal', async () => {
    db.handler = intakeDb('READY_FOR_PAYMENT');
    paypal.order = null;
    const res = await postPayment({ intakeId: INTAKE, orderId: 'NOSUCHORDER' });
    expect(res.status).toBe(402);
    expect(updates()).toHaveLength(0);
  });

  it('marks PAID only from PayPal-verified values, queues the work, and raises PAYMENT VERIFIED + READY FOR FULFILLMENT', async () => {
    db.handler = intakeDb('READY_FOR_PAYMENT');
    paypal.order = completedOrder();
    const res = await postPayment({ intakeId: INTAKE, orderId: 'ORDER1', amount: '0.01', capturedAt: '1999-01-01T00:00:00Z' });
    expect(res.status).toBe(200);
    const paid = updates()[0].payload as Record<string, unknown>;
    expect(paid).toMatchObject({ status: 'PAID', paypal_order_id: 'ORDER1', paypal_capture_id: 'CAP1', paid_amount: 149, paid_at: '2026-10-01T12:00:00Z' });
    expect(paypalCalls).toContain('GET https://api-m.paypal.com/v2/checkout/orders/ORDER1');
    expect(alerts.raised.map((a) => [a.alertType, a.alertKey, a.isTest])).toEqual([
      ['PAYMENT_VERIFIED', 'payment_verified:paypal-capture:CAP1', false],
      ['READY_FOR_FULFILLMENT', `ready_for_fulfillment:consequence-intake:${INTAKE}`, false],
    ]);
    expect(alerts.raised[0].facts).toMatchObject({ amount: '149.00', currency: 'USD', amountBasis: 'PAID', providerReference: 'CAP1', who: { name: 'Ada Buyer', email: 'buyer@example.com' } });
    expect(alerts.raised[1].facts.action).toContain('TA14-CEX-Q-1');
  });

  it('is idempotent: a replayed confirmation for an already-paid intake raises nothing and does not touch PayPal', async () => {
    db.handler = intakeDb('PAID', 'ORDER1');
    const res = await postPayment({ intakeId: INTAKE, orderId: 'ORDER1' });
    expect(res.status).toBe(200);
    expect((await res.json()).idempotent).toBe(true);
    expect(paypalCalls).toHaveLength(0);
    expect(alerts.raised).toHaveLength(0);
  });

  it('flags sandbox payments as test alerts', async () => {
    process.env.PAYPAL_ENVIRONMENT = 'sandbox';
    db.handler = intakeDb('READY_FOR_PAYMENT');
    paypal.order = completedOrder();
    await postPayment({ intakeId: INTAKE, orderId: 'ORDER1' });
    expect(alerts.raised.every((a) => a.isTest === true)).toBe(true);
  });

  it('flags an operator payer as a test alert', async () => {
    db.handler = intakeDb('READY_FOR_PAYMENT');
    paypal.order = completedOrder({ payer: { email_address: 'owner@ta14.test' } });
    await postPayment({ intakeId: INTAKE, orderId: 'ORDER1' });
    expect(alerts.raised.every((a) => a.isTest === true)).toBe(true);
  });
});

describe('PayPal order and capture routes', () => {
  it('create-order raises PAYMENT INITIATED — never a paid amount', async () => {
    paypal.created = { id: 'ORDER9', status: 'CREATED', links: [] };
    const { POST } = await import('@/app/api/paypal/create-order/route');
    const res = await POST(new NextRequest('https://www.ta14exchange.com/api/paypal/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: 'governed-consequence-examination', customerReference: INTAKE }) }));
    expect(res.status).toBe(201);
    expect(alerts.raised).toHaveLength(1);
    expect(alerts.raised[0]).toMatchObject({ alertType: 'PAYMENT_INITIATED', alertKey: 'payment_initiated:paypal-order:ORDER9', isTest: false });
    expect(alerts.raised[0].facts).toMatchObject({ amount: '149.00', amountBasis: 'LISTED_PRICE' });
    expect(alerts.raised[0].facts.status).toContain('NOT YET VERIFIED');
  });

  it('capture-order raises PAYMENT VERIFIED from PayPal’s server-side capture result, keyed by capture ID', async () => {
    paypal.capture = completedOrder({ id: 'ORDER1' });
    const { POST } = await import('@/app/api/paypal/capture-order/route');
    const res = await POST(new NextRequest('https://www.ta14exchange.com/api/paypal/capture-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: 'ORDER1' }) }));
    expect(res.status).toBe(200);
    expect(alerts.raised).toHaveLength(1);
    expect(alerts.raised[0]).toMatchObject({ alertType: 'PAYMENT_VERIFIED', alertKey: 'payment_verified:paypal-capture:CAP1' });
    expect(alerts.raised[0].facts).toMatchObject({ amount: '149.00', amountBasis: 'PAID', providerReference: 'CAP1' });
  });

  it('capture-order raises nothing when PayPal does not complete the capture', async () => {
    paypal.capture = completedOrder({ status: 'PAYER_ACTION_REQUIRED', purchase_units: [] });
    const { POST } = await import('@/app/api/paypal/capture-order/route');
    const res = await POST(new NextRequest('https://www.ta14exchange.com/api/paypal/capture-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: 'ORDER1' }) }));
    expect(res.status).toBe(409);
    expect(alerts.raised).toHaveLength(0);
  });

  it('the capture route and the payment route produce the same alert key for one payment (one email)', async () => {
    paypal.capture = completedOrder({ id: 'ORDER1' });
    const capture = await import('@/app/api/paypal/capture-order/route');
    await capture.POST(new NextRequest('https://www.ta14exchange.com/api/paypal/capture-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: 'ORDER1' }) }));
    db.handler = intakeDb('READY_FOR_PAYMENT');
    paypal.order = completedOrder();
    await postPayment({ intakeId: INTAKE, orderId: 'ORDER1' });
    const verifiedKeys = alerts.raised.filter((a) => a.alertType === 'PAYMENT_VERIFIED').map((a) => a.alertKey);
    expect(new Set(verifiedKeys)).toEqual(new Set(['payment_verified:paypal-capture:CAP1']));
  });

  it('readiness-review intake raises one COMMERCIAL ENGAGEMENT ACCEPTED after the intake is saved', async () => {
    db.handler = (q) => (q.table === 'ta14_eu_ai_act_readiness_review_intakes' ? { data: { intake_id: 'EU-1', status: 'submitted', submitted_at: '2026-10-01T12:00:00Z' }, error: null } : { data: null, error: null });
    const { POST } = await import('@/app/api/eu-ai-act/readiness-review/route');
    const body = {
      organizationName: 'Acme', contactName: 'Ada', contactEmail: 'ada@acme.test', systemName: 'Screener', intendedPurpose: 'Screening candidates',
      euExposure: 'EU customers', requestedOutcome: 'Readiness', evidenceSummary: 'Docs', limitationAcknowledged: true, accuracyAcknowledged: true,
    };
    const res = await POST(new NextRequest('https://www.ta14exchange.com/api/eu-ai-act/readiness-review', { method: 'POST', headers: { 'Content-Type': 'application/json', origin: 'https://www.ta14exchange.com' }, body: JSON.stringify(body) }));
    expect(res.status).toBe(201);
    expect(alerts.raised).toHaveLength(1);
    expect(alerts.raised[0]).toMatchObject({ alertType: 'COMMERCIAL_ENGAGEMENT_ACCEPTED', alertKey: 'engagement:eu-readiness-intake:EU-1', isTest: false });
    expect(alerts.raised[0].facts.who).toMatchObject({ email: 'ada@acme.test', organization: 'Acme' });
  });
});
