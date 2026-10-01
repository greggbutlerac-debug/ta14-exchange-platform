/**
 * Owner-alert recording and delivery logic, independent of Supabase and Resend so it can be unit tested.
 *
 * Guarantees:
 * - At most one alert per business event: `insertIfAbsent` on a unique alert_key.
 * - At most one concurrent sender per alert: `claim` is a conditional state transition.
 * - Delivery never throws to the caller and never undoes the business event; failures are recorded on
 *   the alert row (visible to the owner) and retried later.
 */
import { buildOwnerAlertEmail, type OwnerAlertFacts, type OwnerAlertType } from './templates';

export type DeliveryState = 'pending' | 'sending' | 'delivered' | 'failed' | 'suppressed';

export type OwnerAlertRecord = {
  id: string;
  alertKey: string;
  alertType: OwnerAlertType;
  facts: OwnerAlertFacts;
  isTest: boolean;
  occurredAt: string;
  deliveryState: DeliveryState;
  attempts: number;
  lastError: string | null;
};

export type NewOwnerAlert = {
  alertKey: string;
  alertType: OwnerAlertType;
  facts: OwnerAlertFacts;
  isTest: boolean;
};

export interface OwnerAlertStore {
  /** Inserts unless alert_key already exists. `created` is false for a duplicate event. */
  insertIfAbsent(alert: NewOwnerAlert & { deliveryState: 'pending' | 'suppressed' }): Promise<{ created: boolean; alert: OwnerAlertRecord | null }>;
  /** pending|failed → sending (or a stale sending claim). Returns null if another sender holds it or it is done. */
  claim(id: string, now: Date, staleBefore: Date): Promise<OwnerAlertRecord | null>;
  markDelivered(id: string, attempts: number, providerMessageId: string | null, now: Date): Promise<void>;
  markFailed(id: string, attempts: number, error: string, now: Date): Promise<void>;
  /** Alerts the retry job should attempt now. */
  listDeliverable(limit: number, retryBefore: Date, staleBefore: Date, maxAttempts: number): Promise<OwnerAlertRecord[]>;
  /** Owner-requested retry: failed/suppressed → pending. */
  resetForRetry(id: string): Promise<OwnerAlertRecord | null>;
}

export interface EmailSender {
  send(message: { from: string; to: string[]; subject: string; text: string; html: string; idempotencyKey: string }): Promise<{ id: string | null }>;
}

export type OwnerAlertConfig = {
  recipients: string[];
  from: string;
  sendTestAlerts: boolean;
  /** Minutes before a failed alert is retried by the job. */
  retryCooldownMinutes: number;
  /** Minutes after which a 'sending' claim is considered abandoned. */
  staleClaimMinutes: number;
  maxAttempts: number;
};

export type DeliveryOutcome = { alertId: string; outcome: 'delivered' | 'failed' | 'skipped'; reason?: string };

const minutesBefore = (now: Date, minutes: number) => new Date(now.getTime() - minutes * 60_000);

export async function recordOwnerAlert(store: OwnerAlertStore, alert: NewOwnerAlert, config: Pick<OwnerAlertConfig, 'sendTestAlerts'>) {
  const deliveryState = alert.isTest && !config.sendTestAlerts ? 'suppressed' : 'pending';
  return store.insertIfAbsent({ ...alert, deliveryState });
}

export async function deliverOwnerAlert(
  store: OwnerAlertStore,
  sender: EmailSender,
  alertId: string,
  config: OwnerAlertConfig,
  now: Date = new Date(),
): Promise<DeliveryOutcome> {
  let claimed: OwnerAlertRecord | null;
  try {
    claimed = await store.claim(alertId, now, minutesBefore(now, config.staleClaimMinutes));
  } catch (error) {
    console.error('TA14_OWNER_ALERT_CLAIM_FAILED', { alertId, message: error instanceof Error ? error.message : String(error) });
    return { alertId, outcome: 'skipped', reason: 'CLAIM_FAILED' };
  }
  if (!claimed) return { alertId, outcome: 'skipped', reason: 'NOT_CLAIMABLE' };

  const attempts = claimed.attempts + 1;
  const fail = async (reason: string): Promise<DeliveryOutcome> => {
    try {
      await store.markFailed(alertId, attempts, reason.slice(0, 1000), now);
    } catch (error) {
      console.error('TA14_OWNER_ALERT_MARK_FAILED_FAILED', { alertId, reason, message: error instanceof Error ? error.message : String(error) });
    }
    console.error('TA14_OWNER_ALERT_DELIVERY_FAILED', { alertId, alertKey: claimed?.alertKey, reason });
    return { alertId, outcome: 'failed', reason };
  };

  if (!config.recipients.length) return fail('NO_RECIPIENTS_CONFIGURED');
  if (!config.from) return fail('NO_SENDER_CONFIGURED');

  const email = buildOwnerAlertEmail(claimed.alertType, claimed.facts, claimed.alertKey, claimed.isTest);
  let messageId: string | null;
  try {
    messageId = (await sender.send({ from: config.from, to: config.recipients, ...email, idempotencyKey: claimed.alertKey })).id;
  } catch (error) {
    return fail(error instanceof Error ? error.message : String(error));
  }
  try {
    await store.markDelivered(alertId, attempts, messageId, now);
  } catch (error) {
    // The email went out; only the bookkeeping failed. Logged loudly; the 'sending' claim goes stale and a
    // later retry could re-send, which is the safer failure mode than silently losing a payment alert.
    console.error('TA14_OWNER_ALERT_MARK_DELIVERED_FAILED', { alertId, messageId, message: error instanceof Error ? error.message : String(error) });
  }
  return { alertId, outcome: 'delivered' };
}

export async function deliverPendingOwnerAlerts(
  store: OwnerAlertStore,
  sender: EmailSender,
  config: OwnerAlertConfig,
  limit = 25,
  now: Date = new Date(),
): Promise<DeliveryOutcome[]> {
  const candidates = await store.listDeliverable(
    limit,
    minutesBefore(now, config.retryCooldownMinutes),
    minutesBefore(now, config.staleClaimMinutes),
    config.maxAttempts,
  );
  const outcomes: DeliveryOutcome[] = [];
  for (const alert of candidates) outcomes.push(await deliverOwnerAlert(store, sender, alert.id, config, now));
  return outcomes;
}
