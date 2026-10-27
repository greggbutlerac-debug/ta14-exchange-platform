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

## Primary administrator enrollment — gated procedure

Designated mailbox: `ta14admissibleexecution@gmail.com`. The institutional subject ID displayed by Mission Control is a candidate identifier, not sufficient evidence by itself to grant a privileged role.

1. A trusted operator independently checks the live Supabase Auth user directory for the candidate UUID, matching email, and confirmed email status. Do not rely solely on a pasted screen, chat message, or client-supplied email.
2. Independently establish TA14 authorization to administer referral entitlements and record the approval basis.
3. Only after both checks, enroll the verified UUID in `public.ta14_open_door_admins` using a privileged administrative channel. Never expose the service-role key or implement self-enrollment.
4. Verify `/open-door/admin` displays the read-only ledger for that account, while unrelated and anonymous sessions remain denied.
5. Revoke access when authority ends and verify deployment protections before publication.

Enrollment remains pending until those checks are complete. The dashboard does not issue payments or award services.

## Test evidence and limits

- A rolled-back referral insertion created an audit INSERT event.
- A rolled-back entitlement update created an audit UPDATE event.
- A database constraint rejected redemption beyond the earned balance.
- The rollback and follow-up checks left zero fictional test records.
- These checks do not establish authenticated administrator access, service-role-only function behavior, concurrency safety, reversal handling, or a production-ready payment flow.
