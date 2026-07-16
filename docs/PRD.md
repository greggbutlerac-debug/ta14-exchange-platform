# MVP Product Requirements Document

## Product
TA-14 Global Admissible Execution Exchange.

## Objective
Build the smallest credible path from a consequential action to a durable, independently testable record.

## First user outcome
A new user can create an organization and system, define one vendor-payment route above USD 25,000, bind authority and evidence, receive a deterministic decision, correct a legitimate HOLD without payment, rerun the same route lineage, export a self-declared AER, and optionally activate one Durable Route Record.

## In scope
1. Account and accountable organization creation.
2. Named system registration.
3. Immutable route versions.
4. Authority, evidence, policy, commit, execution, and expected outcome objects.
5. Deterministic completeness, freshness, identity binding, policy binding, commit correspondence, bypass, replay, and outcome correspondence tests.
6. ALLOW, HOLD, DENY, and ESCALATE receipts with exact requirement IDs and reasons.
7. Free correction and rerun.
8. AER JSON and PDF parity.
9. One-time Durable Route Record entitlement.
10. Public/private registry projection with live status and limitations.
11. Audit history, backups, restoration proof, and misuse reporting.

## Out of scope for first release
- Certification or broad legal opinion.
- Unlimited private evidence storage.
- Autonomous VERIFIED status.
- Full enterprise SSO, sovereign deployment, or reviewer marketplace.
- General-purpose no-code workflow automation.

## Personas
- Individual builder evaluating one route.
- Organization operator managing recurring routes.
- Third party checking a TA14-RID.
- TA-14 operations administrator handling misuse and status events.

## Core route
Vendor payment above USD 25,000.

Required authority: current dual approval from procurement and finance.
Required evidence: supplier identity, invoice, policy version, beneficiary verification, and committed payment object.
Initial intended adverse result: HOLD when current dual authority or exact beneficiary binding is missing.

## Decision precedence
1. DENY — fabrication, unauthorized substitution, successful bypass, altered committed payload, or critical integrity failure.
2. ESCALATE — qualified human authority, legal interpretation, specialist judgment, or unresolved attribution required.
3. HOLD — mandatory proof missing, stale, invalid, or correctable.
4. ALLOW — all mandatory deterministic requirements satisfied within scope.

Payment never changes precedence or test outcomes.

## MVP success criteria
- Deterministic repeated HOLD for the same pinned route version.
- Free correction creates a new immutable route version.
- AER JSON and PDF contain matching identifiers, hashes, state, and history.
- Confirmed payment activates exactly one record entitlement.
- Registry lookup resolves scope, current status, limitation, history, and signature metadata.
- Backup restoration reproduces essential record hashes.

## Non-functional requirements
- Tenant isolation.
- Private-by-default evidence.
- Append-only signed receipts and registry events.
- Idempotent payment handling.
- Stable, documented APIs.
- Explainable errors with correlation IDs and safe next actions.
- No hidden score and no paid suppression of adverse findings.
