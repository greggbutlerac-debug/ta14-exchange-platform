import { describe, expect, it } from 'vitest';
import { verifyCompletedOrder, type PayPalOrder } from './paypal-server';

const intakeId = 'TA14-CEX-20261001-ABCDEF1234';
const expect149 = {
  orderId: 'ORDER123',
  referenceId: 'governed-consequence-examination',
  customId: `governed-consequence-examination:${intakeId}`,
  amount: '149.00',
  currency: 'USD',
};

function order(overrides: Partial<PayPalOrder> = {}, capture: Record<string, unknown> = {}, unit: Record<string, unknown> = {}): PayPalOrder {
  return {
    id: 'ORDER123',
    status: 'COMPLETED',
    payer: { email_address: 'buyer@example.com', name: { given_name: 'Ada', surname: 'Buyer' } },
    purchase_units: [
      {
        reference_id: 'governed-consequence-examination',
        custom_id: `governed-consequence-examination:${intakeId}`,
        payments: { captures: [{ id: 'CAP1', status: 'COMPLETED', amount: { value: '149.00', currency_code: 'USD' }, create_time: '2026-10-01T12:00:00Z', ...capture }] },
        ...unit,
      },
    ],
    ...overrides,
  };
}

describe('verifyCompletedOrder', () => {
  it('accepts a completed, correctly bound $149 capture and returns PayPal values', () => {
    const r = verifyCompletedOrder(order(), expect149);
    expect(r).toMatchObject({ ok: true, captureId: 'CAP1', amount: '149.00', currency: 'USD', payerName: 'Ada Buyer', payerEmail: 'buyer@example.com', capturedAt: '2026-10-01T12:00:00Z' });
  });

  it('rejects a missing order', () => {
    expect(verifyCompletedOrder(null, expect149)).toEqual({ ok: false, reason: 'ORDER_NOT_FOUND' });
  });

  it('rejects an order that is not completed', () => {
    expect(verifyCompletedOrder(order({ status: 'APPROVED' }), expect149)).toEqual({ ok: false, reason: 'ORDER_NOT_COMPLETED' });
  });

  it('rejects an order bound to a different intake', () => {
    expect(verifyCompletedOrder(order({}, {}, { custom_id: 'governed-consequence-examination:OTHER' }), expect149)).toEqual({ ok: false, reason: 'ORDER_NOT_BOUND_TO_THIS_INTAKE' });
  });

  it('rejects a different product', () => {
    expect(verifyCompletedOrder(order({}, {}, { reference_id: 'preserved-governed-run' }), expect149)).toEqual({ ok: false, reason: 'PRODUCT_MISMATCH' });
  });

  it('rejects a wrong amount or currency', () => {
    expect(verifyCompletedOrder(order({}, { amount: { value: '9.00', currency_code: 'USD' } }), expect149)).toEqual({ ok: false, reason: 'AMOUNT_MISMATCH' });
    expect(verifyCompletedOrder(order({}, { amount: { value: '149.00', currency_code: 'EUR' } }), expect149)).toEqual({ ok: false, reason: 'AMOUNT_MISMATCH' });
  });

  it('rejects when no capture is completed', () => {
    expect(verifyCompletedOrder(order({}, { status: 'PENDING' }), expect149)).toEqual({ ok: false, reason: 'NO_COMPLETED_CAPTURE' });
  });

  it('rejects a capture id that differs from what the client claimed', () => {
    expect(verifyCompletedOrder(order(), { ...expect149, claimedCaptureId: 'FORGED' })).toEqual({ ok: false, reason: 'CAPTURE_ID_MISMATCH' });
  });

  it('rejects an order id mismatch', () => {
    expect(verifyCompletedOrder(order({ id: 'OTHER' }), expect149)).toEqual({ ok: false, reason: 'ORDER_ID_MISMATCH' });
  });
});
