import { describe, expect, it } from 'vitest';
import { buildOwnerAlertEmail, ownerAlertSubject, type OwnerAlertFacts } from './templates';
import {
  deliverOwnerAlert,
  deliverPendingOwnerAlerts,
  recordOwnerAlert,
  type EmailSender,
  type NewOwnerAlert,
  type OwnerAlertConfig,
  type OwnerAlertRecord,
  type OwnerAlertStore,
} from './service';

// ---------------------------------------------------------------- fakes

type Row = OwnerAlertRecord & { claimedAt: number | null; lastAttemptAt: number | null; messageId: string | null };

function memoryStore() {
  const rows = new Map<string, Row>();
  let seq = 0;
  const store: OwnerAlertStore = {
    async insertIfAbsent(alert) {
      if ([...rows.values()].some((r) => r.alertKey === alert.alertKey)) return { created: false, alert: null };
      const row: Row = { id: `id-${++seq}`, alertKey: alert.alertKey, alertType: alert.alertType, facts: alert.facts, isTest: alert.isTest, occurredAt: alert.facts.occurredAt, deliveryState: alert.deliveryState, attempts: 0, lastError: null, claimedAt: null, lastAttemptAt: null, messageId: null };
      rows.set(row.id, row);
      return { created: true, alert: { ...row } };
    },
    async claim(id, now, staleBefore) {
      const r = rows.get(id);
      if (!r) return null;
      const claimable = r.deliveryState === 'pending' || r.deliveryState === 'failed' || (r.deliveryState === 'sending' && (r.claimedAt ?? 0) < staleBefore.getTime());
      if (!claimable) return null;
      r.deliveryState = 'sending';
      r.claimedAt = now.getTime();
      return { ...r };
    },
    async markDelivered(id, attempts, messageId) {
      const r = rows.get(id)!;
      Object.assign(r, { deliveryState: 'delivered', attempts, messageId, lastError: null });
    },
    async markFailed(id, attempts, error, now) {
      const r = rows.get(id)!;
      Object.assign(r, { deliveryState: 'failed', attempts, lastError: error, lastAttemptAt: now.getTime() });
    },
    async listDeliverable(limit, retryBefore, staleBefore, maxAttempts) {
      return [...rows.values()]
        .filter(
          (r) =>
            r.deliveryState === 'pending' ||
            (r.deliveryState === 'failed' && (r.lastAttemptAt ?? 0) < retryBefore.getTime() && r.attempts < maxAttempts) ||
            (r.deliveryState === 'sending' && (r.claimedAt ?? 0) < staleBefore.getTime()),
        )
        .slice(0, limit)
        .map((r) => ({ ...r }));
    },
    async resetForRetry(id) {
      const r = rows.get(id);
      if (!r || !['failed', 'suppressed'].includes(r.deliveryState)) return null;
      r.deliveryState = 'pending';
      return { ...r };
    },
  };
  return { store, rows };
}

function fakeSender(behaviour: 'ok' | 'fail' = 'ok') {
  const sent: Parameters<EmailSender['send']>[0][] = [];
  const sender: EmailSender = {
    async send(message) {
      sent.push(message);
      if (behaviour === 'fail') throw new Error('Resend returned HTTP 503.');
      return { id: `msg-${sent.length}` };
    },
  };
  return { sender, sent };
}

const config: OwnerAlertConfig = { recipients: ['owner@example.com'], from: 'TA-14 <alerts@example.com>', sendTestAlerts: false, retryCooldownMinutes: 15, staleClaimMinutes: 15, maxAttempts: 12 };
const now = new Date('2026-10-01T12:00:00Z');

const verifiedFacts: OwnerAlertFacts = {
  who: { name: 'Ada Buyer', email: 'ada@example.com' },
  product: 'Governed Consequence Examination ($149)',
  route: '/consequence-machine',
  status: 'PAID — verified with PayPal by the server',
  references: [{ label: 'Intake ID', value: 'TA14-CEX-1' }],
  amount: '149.00',
  currency: 'USD',
  amountBasis: 'PAID',
  provider: 'PayPal',
  providerReference: 'CAP-123',
  occurredAt: '2026-10-01T11:59:00Z',
  verifiedAt: '2026-10-01T12:00:00Z',
  action: 'Perform the examination.',
};
const paymentVerified: NewOwnerAlert = { alertKey: 'payment_verified:paypal-capture:CAP-123', alertType: 'PAYMENT_VERIFIED', facts: verifiedFacts, isTest: false };

// ---------------------------------------------------------------- templates

describe('owner alert templates', () => {
  it('uses the required subjects', () => {
    expect(ownerAlertSubject('PAYMENT_VERIFIED', { occurredAt: 'x', action: 'y' })).toBe('[TA-14] PAYMENT VERIFIED — ACTION REQUIRED');
    expect(ownerAlertSubject('READY_FOR_FULFILLMENT', { occurredAt: 'x', action: 'y' })).toBe('[TA-14] READY FOR FULFILLMENT — ACTION REQUIRED');
    expect(ownerAlertSubject('PAYMENT_INITIATED', { occurredAt: 'x', action: 'y' })).toBe('[TA-14] PAYMENT INITIATED — NOT YET VERIFIED');
    expect(ownerAlertSubject('PAYMENT_VERIFIED', { occurredAt: 'x', action: 'y' }, true)).toBe('[TA-14 TEST] PAYMENT VERIFIED — ACTION REQUIRED');
  });

  it('answers who, what, when, how much and what to do', () => {
    const email = buildOwnerAlertEmail('PAYMENT_VERIFIED', verifiedFacts, paymentVerified.alertKey);
    for (const heading of ['WHO?', 'WHAT HAPPENED?', 'WHEN?', 'HOW MUCH?', 'WHAT DO I NEED TO DO?']) expect(email.text).toContain(heading);
    expect(email.text).toContain('Ada Buyer');
    expect(email.text).toContain('149.00 USD (paid — verified with PayPal)');
    expect(email.text).toContain('CAP-123');
    expect(email.text).toContain('Perform the examination.');
  });

  it('never presents an initiated payment as paid', () => {
    const email = buildOwnerAlertEmail('PAYMENT_INITIATED', { amount: '149.00', currency: 'USD', amountBasis: 'LISTED_PRICE', occurredAt: 'x', action: 'No action.' }, 'k');
    expect(email.text).toContain('NOT a payment');
    expect(email.text).toContain('listed price — NOT paid');
    expect(email.text).not.toContain('verified with');
  });

  it('escapes HTML and strips line breaks from customer-supplied text', () => {
    const email = buildOwnerAlertEmail('COMMERCIAL_ENGAGEMENT_ACCEPTED', { who: { name: '<script>x</script>\nBcc: a@b.c' }, occurredAt: 'x', action: 'y' }, 'k');
    expect(email.html).not.toContain('<script>');
    expect(email.html).toContain('&lt;script&gt;');
    expect(email.text).not.toMatch(/\nBcc:/);
  });
});

// ---------------------------------------------------------------- service

describe('owner alert recording and delivery', () => {
  it('records one alert per business event; a duplicate event creates nothing', async () => {
    const { store, rows } = memoryStore();
    expect((await recordOwnerAlert(store, paymentVerified, config)).created).toBe(true);
    expect((await recordOwnerAlert(store, paymentVerified, config)).created).toBe(false);
    expect(rows.size).toBe(1);
  });

  it('delivers once, passes the alert key for provider idempotency, and will not send twice', async () => {
    const { store, rows } = memoryStore();
    const { sender, sent } = fakeSender();
    const { alert } = await recordOwnerAlert(store, paymentVerified, config);
    expect((await deliverOwnerAlert(store, sender, alert!.id, config, now)).outcome).toBe('delivered');
    expect((await deliverOwnerAlert(store, sender, alert!.id, config, now)).outcome).toBe('skipped');
    expect(sent).toHaveLength(1);
    expect(sent[0].idempotencyKey).toBe(paymentVerified.alertKey);
    expect(sent[0].to).toEqual(['owner@example.com']);
    expect([...rows.values()][0]).toMatchObject({ deliveryState: 'delivered', attempts: 1, messageId: 'msg-1' });
  });

  it('records a delivery failure without throwing, and retries only after the cooldown', async () => {
    const { store, rows } = memoryStore();
    const failing = fakeSender('fail');
    const { alert } = await recordOwnerAlert(store, paymentVerified, config);
    const outcome = await deliverOwnerAlert(store, failing.sender, alert!.id, config, now);
    expect(outcome).toMatchObject({ outcome: 'failed', reason: 'Resend returned HTTP 503.' });
    expect([...rows.values()][0]).toMatchObject({ deliveryState: 'failed', attempts: 1, lastError: 'Resend returned HTTP 503.' });

    const working = fakeSender();
    expect(await deliverPendingOwnerAlerts(store, working.sender, config, 25, new Date(now.getTime() + 5 * 60_000))).toEqual([]);
    const later = await deliverPendingOwnerAlerts(store, working.sender, config, 25, new Date(now.getTime() + 16 * 60_000));
    expect(later.map((o) => o.outcome)).toEqual(['delivered']);
    expect([...rows.values()][0]).toMatchObject({ deliveryState: 'delivered', attempts: 2 });
  });

  it('fails visibly when no recipient is configured', async () => {
    const { store, rows } = memoryStore();
    const { sender, sent } = fakeSender();
    const { alert } = await recordOwnerAlert(store, paymentVerified, config);
    const outcome = await deliverOwnerAlert(store, sender, alert!.id, { ...config, recipients: [] }, now);
    expect(outcome).toMatchObject({ outcome: 'failed', reason: 'NO_RECIPIENTS_CONFIGURED' });
    expect(sent).toHaveLength(0);
    expect([...rows.values()][0].deliveryState).toBe('failed');
  });

  it('suppresses test/operator events by default, and sends them only on an explicit owner retry', async () => {
    const { store, rows } = memoryStore();
    const { sender, sent } = fakeSender();
    const { alert } = await recordOwnerAlert(store, { ...paymentVerified, isTest: true }, config);
    expect(alert!.deliveryState).toBe('suppressed');
    expect(await deliverPendingOwnerAlerts(store, sender, config, 25, now)).toEqual([]);
    expect((await deliverOwnerAlert(store, sender, alert!.id, config, now)).outcome).toBe('skipped');
    expect(sent).toHaveLength(0);

    await store.resetForRetry(alert!.id);
    expect((await deliverOwnerAlert(store, sender, alert!.id, config, now)).outcome).toBe('delivered');
    expect(sent[0].subject.startsWith('[TA-14 TEST]')).toBe(true);
    expect([...rows.values()][0].deliveryState).toBe('delivered');
  });

  it('recovers an abandoned sending claim after it goes stale', async () => {
    const { store } = memoryStore();
    const { sender, sent } = fakeSender();
    const { alert } = await recordOwnerAlert(store, paymentVerified, config);
    await store.claim(alert!.id, now, new Date(0)); // a sender claimed it and then crashed
    expect(await deliverPendingOwnerAlerts(store, sender, config, 25, new Date(now.getTime() + 5 * 60_000))).toEqual([]);
    const recovered = await deliverPendingOwnerAlerts(store, sender, config, 25, new Date(now.getTime() + 16 * 60_000));
    expect(recovered.map((o) => o.outcome)).toEqual(['delivered']);
    expect(sent).toHaveLength(1);
  });
});
