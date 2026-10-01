/**
 * Owner-alert email content. Pure: no I/O, so every template is unit tested.
 *
 * Only whitelisted, display-safe facts reach an email. Provider transaction IDs are used instead of any
 * payment detail; no credentials, secrets or card data are ever part of `OwnerAlertFacts`.
 */

export type OwnerAlertType =
  | 'COMMERCIAL_ENGAGEMENT_ACCEPTED'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_VERIFIED'
  | 'READY_FOR_FULFILLMENT';

export type OwnerAlertFacts = {
  who?: { name?: string | null; email?: string | null; organization?: string | null };
  product?: string | null;
  route?: string | null;
  status?: string | null;
  /** Labelled identifiers such as Intake ID, Order ID, Queue ID. */
  references?: { label: string; value: string }[];
  amount?: string | null;
  currency?: string | null;
  /** Whether `amount` was paid (verified) or is only the listed price. */
  amountBasis?: 'PAID' | 'LISTED_PRICE' | null;
  provider?: string | null;
  providerReference?: string | null;
  occurredAt: string;
  verifiedAt?: string | null;
  action: string;
  adminUrl?: string | null;
};

export type OwnerAlertEmail = { subject: string; text: string; html: string };

const EVENT_LABEL: Record<OwnerAlertType, string> = {
  COMMERCIAL_ENGAGEMENT_ACCEPTED: 'COMMERCIAL ENGAGEMENT ACCEPTED',
  PAYMENT_INITIATED: 'PAYMENT INITIATED',
  PAYMENT_VERIFIED: 'PAYMENT VERIFIED',
  READY_FOR_FULFILLMENT: 'READY FOR FULFILLMENT',
};

const SUBJECT_SUFFIX: Record<OwnerAlertType, string> = {
  COMMERCIAL_ENGAGEMENT_ACCEPTED: 'REVIEW',
  PAYMENT_INITIATED: 'NOT YET VERIFIED',
  PAYMENT_VERIFIED: 'ACTION REQUIRED',
  READY_FOR_FULFILLMENT: 'ACTION REQUIRED',
};

const HEADLINE: Record<OwnerAlertType, string> = {
  COMMERCIAL_ENGAGEMENT_ACCEPTED: 'A customer submitted or accepted a commercial engagement.',
  PAYMENT_INITIATED: 'A payment was started with the provider. It is NOT a payment and has NOT been verified.',
  PAYMENT_VERIFIED: 'The payment provider confirmed a completed payment to the TA-14 server.',
  READY_FOR_FULFILLMENT: 'The customer has paid and TA-14 now needs to perform the work.',
};

const MAX_FIELD = 300;

export function clip(value: unknown, max = MAX_FIELD): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).replace(/[\r\n\t]+/g, ' ').trim();
  if (!s) return null;
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

export function ownerAlertSubject(type: OwnerAlertType, facts: OwnerAlertFacts, isTest = false): string {
  const prefix = isTest ? '[TA-14 TEST]' : '[TA-14]';
  const product = clip(facts.product, 80);
  const base = `${prefix} ${EVENT_LABEL[type]} — ${SUBJECT_SUFFIX[type]}`;
  return product ? `${base} — ${product}` : base;
}

function howMuch(facts: OwnerAlertFacts): string {
  const amount = clip(facts.amount, 40);
  if (!amount) return 'Not applicable';
  const money = `${amount} ${clip(facts.currency, 10) ?? ''}`.trim();
  if (facts.amountBasis === 'PAID') return `${money} (paid — verified with ${clip(facts.provider, 40) ?? 'the provider'})`;
  if (facts.amountBasis === 'LISTED_PRICE') return `${money} (listed price — NOT paid)`;
  return money;
}

type Section = { heading: string; lines: string[] };

function sections(type: OwnerAlertType, facts: OwnerAlertFacts): Section[] {
  const who = [
    clip(facts.who?.name) ? `Name: ${clip(facts.who?.name)}` : null,
    clip(facts.who?.email) ? `Email: ${clip(facts.who?.email)}` : null,
    clip(facts.who?.organization) ? `Organization: ${clip(facts.who?.organization)}` : null,
  ].filter(Boolean) as string[];
  const what = [
    HEADLINE[type],
    clip(facts.product) ? `Product / service: ${clip(facts.product)}` : null,
    clip(facts.route) ? `Commercial route: ${clip(facts.route)}` : null,
    clip(facts.status) ? `Status: ${clip(facts.status)}` : null,
    ...(facts.references ?? []).map((r) => `${clip(r.label, 60)}: ${clip(r.value)}`),
  ].filter(Boolean) as string[];
  const when = [
    `Occurred: ${clip(facts.occurredAt, 60)}`,
    clip(facts.verifiedAt, 60) ? `Verified: ${clip(facts.verifiedAt, 60)}` : null,
  ].filter(Boolean) as string[];
  const money = [`Amount: ${howMuch(facts)}`];
  if (clip(facts.provider, 40)) money.push(`Payment provider: ${clip(facts.provider, 40)}`);
  if (clip(facts.providerReference, 80)) money.push(`Provider transaction / reference ID: ${clip(facts.providerReference, 80)}`);
  const todo = [clip(facts.action, 1200) ?? 'No action recorded.'];
  if (clip(facts.adminUrl, 500)) todo.push(`Record: ${clip(facts.adminUrl, 500)}`);
  return [
    { heading: 'WHO?', lines: who.length ? who : ['Not provided by this event'] },
    { heading: 'WHAT HAPPENED?', lines: what },
    { heading: 'WHEN?', lines: when },
    { heading: 'HOW MUCH?', lines: money },
    { heading: 'WHAT DO I NEED TO DO?', lines: todo },
  ];
}

export function buildOwnerAlertEmail(type: OwnerAlertType, facts: OwnerAlertFacts, alertKey: string, isTest = false): OwnerAlertEmail {
  const subject = ownerAlertSubject(type, facts, isTest);
  const body = sections(type, facts);
  const footer = `Generated server-side from a persisted TA-14 business event. Alert key: ${clip(alertKey, 200)}${isTest ? ' · TEST / OPERATOR EVENT' : ''}`;
  const text = [subject, '', ...body.flatMap((s) => [s.heading, ...s.lines.map((l) => `  ${l}`), '']), footer].join('\n');
  const html = `<!doctype html><html><body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#0b1720">
<div style="max-width:640px;margin:0 auto;padding:24px">
<div style="background:#ffffff;border:1px solid #d7dde2;border-radius:10px;padding:24px">
<p style="margin:0 0 6px;font-size:12px;letter-spacing:.12em;color:#5b6b78">TA-14 OWNER ALERT${isTest ? ' · TEST' : ''}</p>
<h1 style="margin:0 0 18px;font-size:20px;line-height:1.3">${escapeHtml(EVENT_LABEL[type])} — ${escapeHtml(SUBJECT_SUFFIX[type])}</h1>
${body
  .map(
    (s) =>
      `<h2 style="margin:18px 0 6px;font-size:13px;letter-spacing:.08em;color:#33505f">${escapeHtml(s.heading)}</h2>${s.lines
        .map((l) => `<p style="margin:0 0 4px;font-size:14px;line-height:1.5">${escapeHtml(l)}</p>`)
        .join('')}`,
  )
  .join('\n')}
<p style="margin:22px 0 0;font-size:11px;color:#6b7a86">${escapeHtml(footer)}</p>
</div></div></body></html>`;
  return { subject, text, html };
}
