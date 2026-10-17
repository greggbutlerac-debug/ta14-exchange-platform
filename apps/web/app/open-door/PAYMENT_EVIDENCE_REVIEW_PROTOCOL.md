# TA14 Open Door — Payment Evidence Review Protocol (DRAFT / HOLD)

**Status:** internal operating procedure for human review. No automatic admission, entitlement award, or redemption. The payment evidence schema and evidence-gated RPC are proposals, not deployed controls.

## 1. Intake / record
Record the qualifying engagement ID, referring and referred entity IDs, intended eligible service scope, amount in cents, currency, and the date of the introduction. Reject self-referrals and duplicate engagement IDs. Never enter raw card numbers, bank credentials, confidential case files, or payment-provider secrets in the referral ledger.

## 2. Independent payment-source inspection
An authorized reviewer must open the authoritative payment provider or bank record using a trusted administrative session. Match the payment's provider transaction reference, recipient, payer/engagement, amount, currency, capture/settlement state, and refund/chargeback state to the proposed engagement. A customer screenshot, email assertion, ledger timestamp, or payment link is not proof of settlement. Preserve only a bounded, non-secret source reference and a record of the review.

## 3. Referral and eligibility review
Confirm the introduction preceded the paid engagement, the referrer is distinct from the purchaser, the transaction qualifies under written referral terms, and the benefit is permissible under procurement, conflict-of-interest, and professional rules. Record any exclusions and the accountable reviewer. Conflicts or unclear evidence require HOLD / ESCALATE, never presumed ALLOW.

## 4. Admission boundary
Only after the evidence-binding migration, governed reviewer workflow, and revised RPC are deployed and tested may a privileged operator attach a verified payment reference, reviewer UUID, and review timestamp. Reconcile any historical pending or eligible rows before activating the new gate. A reference field by itself is not proof: review must trace to the actual provider record.

## 5. Approval
The approval service may execute only for a pending, verified, eligible engagement with an independently confirmed payment and established referral standing. It must recheck current refund/reversal state and duplicate-award status atomically. Record reviewer identity, evidence basis, disposition, and the audit event. No customer-visible promise before the award is confirmed.

## 6. Redemption boundary
Require an independently accepted service order, the specific eligible complimentary service scope, remaining balance, and an attributable reviewer. Reject overdraw, duplicate redemption, and redemption during refund/chargeback disputes. The current redemption UI stays disabled until those checks exist.

## 7. Exceptions and continuity
On refund, chargeback, cancellation, duplicate payment, or disputed introduction: HOLD new approvals/redemptions, investigate, and reconcile already earned or redeemed benefits under agreed terms. Do not silently erase the audit history. Escalate any conflict requiring policy or legal review.

## Current engineering gates
- [ ] Verified TA14 administrator enrolled independently in Supabase Auth/allowlist.
- [ ] Evidence-binding schema reviewed and migrated.
- [ ] Authoritative payment provider or documented independent manual verification connected.
- [ ] Revised approval RPC deployed with evidence and reversal gates.
- [ ] Linked service-order verification and redemption safeguards implemented.
- [ ] Authenticated end-to-end, concurrency, reversal, and duplicate tests passed.
- [ ] Written referral terms, privacy, retention, and audit policies approved.

**Until all relevant gates are satisfied: HOLD.**
