/**
 * Server-only PayPal helpers.
 *
 * Payment evidence is established by asking PayPal, never by trusting values supplied by the browser.
 * `verifyCompletedOrder` is a pure function so the acceptance rules can be unit tested without the network.
 */

export type PayPalMoney = { currency_code?: string; value?: string };
export type PayPalCapture = { id?: string; status?: string; amount?: PayPalMoney; create_time?: string; update_time?: string };
export type PayPalPurchaseUnit = {
  reference_id?: string;
  custom_id?: string;
  amount?: PayPalMoney;
  payments?: { captures?: PayPalCapture[] };
};
export type PayPalOrder = {
  id?: string;
  status?: string;
  purchase_units?: PayPalPurchaseUnit[];
  payer?: { email_address?: string; name?: { given_name?: string; surname?: string } };
  payment_source?: { paypal?: { email_address?: string; name?: { given_name?: string; surname?: string } } };
};

export type PayPalConfig = { clientId: string; clientSecret: string; environment: 'sandbox' | 'live'; apiBase: string };

export function getPayPalConfig(): PayPalConfig | null {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  const environment = process.env.PAYPAL_ENVIRONMENT?.trim().toLowerCase() === 'sandbox' ? 'sandbox' : 'live';
  const apiBase = environment === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
  return { clientId, clientSecret, environment, apiBase };
}

export async function getPayPalAccessToken(config: PayPalConfig): Promise<string> {
  const response = await fetch(`${config.apiBase}/v1/oauth2/token`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const payload = (await response.json().catch(() => null)) as { access_token?: string } | null;
  if (!response.ok || !payload?.access_token) throw new Error(`PayPal access token request failed (HTTP ${response.status}).`);
  return payload.access_token;
}

/** Reads the order as PayPal currently records it. */
export async function getPayPalOrder(config: PayPalConfig, orderId: string): Promise<PayPalOrder | null> {
  const token = await getPayPalAccessToken(config);
  const response = await fetch(`${config.apiBase}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`PayPal order lookup failed (HTTP ${response.status}).`);
  return (await response.json()) as PayPalOrder;
}

export function isValidPayPalOrderId(value: string): boolean {
  return /^[A-Z0-9]{1,36}$/.test(value);
}

export type OrderExpectation = {
  orderId: string;
  referenceId: string;
  customId: string;
  amount: string;
  currency: string;
  /** Optional capture id reported by the client; if present it must match PayPal's record. */
  claimedCaptureId?: string | null;
};

export type VerifiedPayment = {
  ok: true;
  orderId: string;
  captureId: string;
  amount: string;
  currency: string;
  capturedAt: string | null;
  payerName: string | null;
  payerEmail: string | null;
};
export type RejectedPayment = { ok: false; reason: string };

/** Pure acceptance rules for a completed PayPal order. */
export function verifyCompletedOrder(order: PayPalOrder | null, expect: OrderExpectation): VerifiedPayment | RejectedPayment {
  if (!order) return { ok: false, reason: 'ORDER_NOT_FOUND' };
  if (order.id !== expect.orderId) return { ok: false, reason: 'ORDER_ID_MISMATCH' };
  if (order.status !== 'COMPLETED') return { ok: false, reason: 'ORDER_NOT_COMPLETED' };
  const unit = order.purchase_units?.find((u) => u.reference_id === expect.referenceId);
  if (!unit) return { ok: false, reason: 'PRODUCT_MISMATCH' };
  if (unit.custom_id !== expect.customId) return { ok: false, reason: 'ORDER_NOT_BOUND_TO_THIS_INTAKE' };
  const capture = unit.payments?.captures?.find((c) => c.status === 'COMPLETED' && typeof c.id === 'string');
  if (!capture?.id) return { ok: false, reason: 'NO_COMPLETED_CAPTURE' };
  if (expect.claimedCaptureId && expect.claimedCaptureId !== capture.id) return { ok: false, reason: 'CAPTURE_ID_MISMATCH' };
  const amount = capture.amount ?? unit.amount;
  if (amount?.value !== expect.amount || amount?.currency_code !== expect.currency) return { ok: false, reason: 'AMOUNT_MISMATCH' };
  const name = order.payer?.name ?? order.payment_source?.paypal?.name;
  const payerName = [name?.given_name, name?.surname].filter(Boolean).join(' ') || null;
  return {
    ok: true,
    orderId: order.id,
    captureId: capture.id,
    amount: amount.value,
    currency: amount.currency_code,
    capturedAt: capture.create_time ?? capture.update_time ?? null,
    payerName,
    payerEmail: order.payer?.email_address ?? order.payment_source?.paypal?.email_address ?? null,
  };
}
