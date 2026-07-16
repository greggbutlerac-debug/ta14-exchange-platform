# TA-14 Global Admissible Execution Exchange — V0.3.1 Integrity-Corrected Vertical Slice

This repository contains a runnable browser application for the first TA-14 Exchange transaction.

## What works

- Next.js public landing page and route workspace
- Vendor-payment route above USD 25,000
- Initial deterministic HOLD for missing dual authority and beneficiary proof
- User-entered correction records and a free rerun
- Append-only route versions that preserve the original HOLD
- Hash-chained route events with public integrity verification
- Actor-, organization-, system-, policy-, and payment-bound authority checks
- Explicit evidence-to-requirement bindings
- ALLOW / HOLD / DENY / ESCALATE precedence
- Deterministic decision fingerprint separate from unique receipt identity
- Ed25519-signed test receipts
- Signed AER with purpose, scope, authority basis, evidence index, limitations, event history, and verification instructions
- Simulated preservation and public TA14-RID registry lookup
- Downloadable verification bundle with development public key, AER, registry boundary, and event chain
- Ajv validation at route-creation and correction API boundaries
- Atomic local file replacement, serialized writes, and optimistic route-version checks

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and select **Start the demonstration route**.

## Verify

```bash
npm run verify
```

The release was verified with TypeScript checking, 18 automated tests, and a successful Next.js production build.

## Important boundary

V0.3.1 is a local demonstration vertical slice. It does **not** charge money, use production authentication, hold production evidence, issue independently verified status, or replace the planned PostgreSQL, managed KMS, Stripe, custody, and enterprise security layers.

Selected bypass, replay, duplicate-payment, execution, and outcome observations are visibly labeled demonstration fixtures. The local JSON store and exported development signing key must not be used in production.

## Next release

V0.4 should replace local persistence with managed PostgreSQL and authenticated tenant isolation, add Stripe test-mode entitlements, move signing to managed key infrastructure, add private evidence storage, and execute database, security, backup, and recovery acceptance tests.
