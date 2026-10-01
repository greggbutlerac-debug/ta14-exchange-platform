/**
 * Governance-registration owner alert path: the shared delivery used by the cron and by the immediate
 * post-registration send. Supabase and Resend are faked; operator detection is the real implementation.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeSupabase, filterValue, type FakeQuery, type FakeResult } from '../owner-alerts/test-support/fake-supabase';

const state = vi.hoisted(() => ({
  notifications: [] as Record<string, unknown>[],
  submissions: [] as Record<string, unknown>[],
  ledger: [] as Record<string, unknown>[],
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () =>
    fakeSupabase((q: FakeQuery): FakeResult => {
      if (q.table === 'ta14_registry_admin_notifications') {
        const submissionId = filterValue(q, 'submission_id');
        return { data: state.notifications.filter((n) => !submissionId || n.submission_id === submissionId), error: null };
      }
      if (q.table === 'ai_governance_registry_submissions') return { data: state.submissions, error: null };
      if (q.table === 'ta14_registry_admin_notification_deliveries') {
        if (q.action === 'insert') {
          const row = q.payload as Record<string, unknown>;
          const duplicate = row.delivery_state === 'delivered' && state.ledger.some((l) => l.delivery_state === 'delivered' && l.notification_id === row.notification_id && l.recipient === row.recipient);
          if (duplicate) return { data: null, error: { message: 'duplicate key value violates unique constraint', code: '23505' } };
          state.ledger.push({ ...row, id: `d-${state.ledger.length + 1}` });
          return { data: null, error: null };
        }
        const notificationId = filterValue(q, 'notification_id');
        const wanted = filterValue(q, 'delivery_state');
        const rows = state.ledger.filter((l) => (!notificationId || l.notification_id === notificationId) && (!wanted || l.delivery_state === wanted) && (!filterValue(q, 'recipient') || l.recipient === filterValue(q, 'recipient')));
        return { data: q.single ? rows[0] ?? null : rows, error: null };
      }
      throw new Error(`unexpected table ${q.table}`);
    }).client,
}));

const sent: { subject: string; html: string; to: string[]; idempotencyKey: string | null }[] = [];

beforeEach(() => {
  state.notifications = [
    {
      id: 'n-1', notification_key: 'governance_registered:s-1:TA-14-AIGR-000100', notification_type: 'governance_registered', priority: 'informational', state: 'unread',
      submission_id: 's-1', registry_identifier: 'TA-14-AIGR-000100', governance_name: 'Acme Governance', claimant_name: 'Ada Registrant', organization_name: 'Acme',
      requested_review_pathway: 'automatic', title: 'New governance registered', message: 'm', occurred_at: '2026-10-01T12:00:00Z', event_payload: {},
    },
  ];
  state.submissions = [{ id: 's-1', contact_email: 'ada@acme.test', owner_user_id: 'user-ada' }];
  state.ledger = [];
  sent.length = 0;
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://db.example.test';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test';
  process.env.RESEND_API_KEY = 're_test';
  process.env.TA14_REGISTRY_REVIEWER_EMAILS = 'owner@ta14.test';
  process.env.TA14_SEO_ADMIN_EMAILS = 'owner@ta14.test';
  delete process.env.TA14_REGISTRY_NOTIFICATION_EMAIL_CUTOFF_AT;
  vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
    if (url !== 'https://api.resend.com/emails') throw new Error(`unexpected fetch ${url}`);
    const body = JSON.parse(String(init?.body));
    const key = new Headers(init?.headers).get('Idempotency-Key');
    sent.push({ subject: body.subject, html: body.html, to: body.to, idempotencyKey: key });
    return new Response(JSON.stringify({ id: `msg-${sent.length}` }), { status: 200 });
  });
});
afterEach(() => vi.unstubAllGlobals());

describe('governance registration owner alert', () => {
  it('sends immediately for the committed registration with the required subject, contact email and action', async () => {
    const { runRegistryNotificationDelivery } = await import('./delivery');
    const run = await runRegistryNotificationDelivery({ limit: 10, submissionId: 's-1' });
    expect(run.ok).toBe(true);
    expect(sent).toHaveLength(1);
    expect(sent[0].subject).toBe('[TA-14] GOVERNANCE REGISTERED — ACTION REQUIRED — Acme Governance');
    expect(sent[0].to).toEqual(['owner@ta14.test']);
    expect(sent[0].html).toContain('ada@acme.test');
    expect(sent[0].html).toContain('TA-14-AIGR-000100');
    expect(sent[0].html).toContain('Founding Demonstration');
    expect(sent[0].idempotencyKey).toBe('ta14-registry-notification:n-1:owner@ta14.test');
    expect(state.ledger).toEqual([expect.objectContaining({ notification_id: 'n-1', delivery_state: 'delivered' })]);
  });

  it('does not send again once delivered (immediate send followed by the cron)', async () => {
    const { runRegistryNotificationDelivery } = await import('./delivery');
    await runRegistryNotificationDelivery({ limit: 10, submissionId: 's-1' });
    await runRegistryNotificationDelivery({ limit: 25 });
    expect(sent).toHaveLength(1);
  });

  it('a concurrent immediate send and cron run record one delivery and no false failure; Resend dedupes by key', async () => {
    const { runRegistryNotificationDelivery } = await import('./delivery');
    await Promise.all([runRegistryNotificationDelivery({ limit: 10, submissionId: 's-1' }), runRegistryNotificationDelivery({ limit: 25 })]);
    expect(new Set(sent.map((s) => s.idempotencyKey))).toEqual(new Set(['ta14-registry-notification:n-1:owner@ta14.test']));
    expect(state.ledger.filter((l) => l.delivery_state === 'delivered')).toHaveLength(1);
    expect(state.ledger.filter((l) => l.delivery_state === 'failed')).toHaveLength(0);
  });

  it('sends nothing for an operator/test registration', async () => {
    state.submissions = [{ id: 's-1', contact_email: 'owner@ta14.test', owner_user_id: 'user-owner' }];
    const { runRegistryNotificationDelivery } = await import('./delivery');
    const run = await runRegistryNotificationDelivery({ limit: 10, submissionId: 's-1' });
    expect(run.ok).toBe(true);
    expect(sent).toHaveLength(0);
    expect(JSON.stringify(run)).toContain('Operator/test registration');
  });

  it('records a Resend failure without throwing, so the cron retries it', async () => {
    vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ message: 'Domain not verified' }), { status: 403 }));
    const { runRegistryNotificationDelivery, deliverRegistrationNotificationsNow } = await import('./delivery');
    await expect(deliverRegistrationNotificationsNow('s-1')).resolves.toBeUndefined();
    expect(state.ledger).toEqual([expect.objectContaining({ notification_id: 'n-1', delivery_state: 'failed', failure_reason: 'Domain not verified' })]);
    const run = await runRegistryNotificationDelivery({ limit: 25 });
    expect(JSON.stringify(run)).toContain('retry cooldown');
  });

  it('reports missing recipients as a configuration error', async () => {
    process.env.TA14_REGISTRY_REVIEWER_EMAILS = '';
    const { runRegistryNotificationDelivery } = await import('./delivery');
    expect(await runRegistryNotificationDelivery({ limit: 10 })).toEqual({ ok: false, status: 503, error: 'TA14_REGISTRY_REVIEWER_EMAILS is not configured.' });
  });
});
