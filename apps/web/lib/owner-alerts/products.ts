/**
 * Names, routes and fulfilment instructions for paid products, keyed by the PayPal reference_id used in
 * app/api/paypal/create-order (PRODUCT_CATALOG). Used only to make owner alerts actionable.
 */
export type AlertProduct = { name: string; route: string; fulfilment: string };

const PRODUCTS: Record<string, AlertProduct> = {
  'governed-consequence-examination': {
    name: 'Governed Consequence Examination ($149)',
    route: '/consequence-machine',
    fulfilment:
      'The payment confirmation step marks the intake PAID and queues it; a READY FOR FULFILLMENT alert follows with the queue ID. If it does not arrive within 15 minutes, reconcile the intake named in the custom reference against this capture.',
  },
  'eu-ai-act-readiness-review': {
    name: 'EU AI Act Readiness Review ($750)',
    route: '/eu-ai-act/readiness-review',
    fulfilment:
      'Find the matching readiness-review intake (ta14_eu_ai_act_readiness_review_intakes) by the customer email, confirm scope with the customer, and deliver the readiness review. No paid/fulfilment state is recorded on the intake automatically.',
  },
  'preserved-governed-run': {
    name: 'Preserved Governed Run ($9)',
    route: '/workspace/ai-governance/pricing',
    fulfilment: 'Confirm the run was preserved for the customer; contact them if it was not.',
  },
  'independent-partner-review': {
    name: 'Independent Partner Review ($995)',
    route: '/workspace/ai-governance/pricing',
    fulfilment: 'Contact the customer to confirm scope, assign the partner reviewer, and schedule the review.',
  },
  'dual-partner-review': {
    name: 'Dual Partner Review ($1,995)',
    route: '/workspace/ai-governance/pricing',
    fulfilment: 'Contact the customer to confirm scope, assign both partner reviewers, and schedule the review.',
  },
  'architecture-demonstration': {
    name: 'Architecture Demonstration ($2,495)',
    route: '/workspace/ai-governance/pricing',
    fulfilment: 'Contact the customer to agree the demonstration proposition and schedule it.',
  },
  'multidisciplinary-review-panel': {
    name: 'Multidisciplinary Review Panel ($3,995)',
    route: '/workspace/ai-governance/pricing',
    fulfilment: 'Contact the customer to confirm scope, convene the panel, and schedule the review.',
  },
};

export function alertProduct(referenceId: string | null | undefined): AlertProduct {
  const id = referenceId?.trim() ?? '';
  return (
    PRODUCTS[id] ?? {
      name: id ? `Unlisted product (${id})` : 'Unidentified product',
      route: 'Unknown',
      fulfilment: 'Identify the product from the PayPal reference and contact the customer to arrange fulfilment.',
    }
  );
}

/** Subscription plan keys used by the PayPal subscription flow (lib/billing/eu-ai-act-entitlements). */
const PLAN_NAMES: Record<string, string> = {
  'passport-monthly': 'EU AI Act Evidence Passport — monthly',
  'passport-annual': 'EU AI Act Evidence Passport — annual',
  'workspace-monthly': 'EU AI Act Compliance Workspace — monthly',
  'workspace-annual': 'EU AI Act Compliance Workspace — annual',
  'pro-monthly': 'EU AI Act Governance Pro — monthly',
  'pro-annual': 'EU AI Act Governance Pro — annual',
  'institution-monthly': 'EU AI Act Institution — monthly',
  'institution-annual': 'EU AI Act Institution — annual',
};

export function planName(planKey: string | null | undefined): string {
  return (planKey && PLAN_NAMES[planKey]) || (planKey ? `Plan ${planKey}` : 'Unidentified plan');
}
