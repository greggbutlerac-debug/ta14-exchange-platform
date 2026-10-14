# TA14 Open Door — referral administration (draft)

## What exists
- Public-facing /open-door inquiry form prepares an email for the prospect to review and send. It is **not** a database intake or an automated submission.
- Supabase private table: public.ta14_open_door_referral_entitlements.
- Service-role-only database functions:
  - public.ta14_open_door_approve_referral(uuid)
  - public.ta14_open_door_redeem_referral(uuid, integer)

## Human verification required
1. Confirm that the referring entity introduced the new customer before the paid engagement and that the referral is genuine.
2. Confirm the paid engagement, cleared payment, currency, and eligible service scope from authoritative payment records. Never award from a claimed email amount.
3. Confirm the referring entity is not the referred entity and that the benefit is lawful under applicable procurement, ethics, and professional rules.
4. An authorized administrator creates the private pending record with a unique qualifying_engagement_id and verified paid_amount_cents; do not store confidential case records in this ledger.
5. An authorized administrator approves a pending record with the service-role function. Approval sets the entitlement to the verified paid amount.
6. At service redemption, agree on the eligible complimentary scope, record a separate service order, and redeem the exact value via the service-role function.
7. Keep records of refund, reversal, dispute, cancellation, and corrections; do not grant entitlements for reversed payments.

## Still required before production
- Verified payment provider integration or documented manual payment verification.
- Authenticated, role-limited administrator UI and audit trail of approvals/redemptions.
- Refund and chargeback handling, including treatment of already redeemed services.
- Written terms defining referral attribution, qualifying purchases, exclusions, scope equivalence, refunds, and jurisdictional restrictions.
- Tests of permissions, concurrency, double redemption, and reversal handling.
- Privacy notice and retention policy for inquiry data.

**Do not expose a Supabase service-role key to the browser.** The public inquiry form does not call this ledger. No customer-facing rewards are live.
