# AE001 — Mutation and credential pathway sample (not exhaustive)

**Status: HOLD.** Source inspection only; no live endpoint exploitation, no credential access and no production changes.

| Candidate | Evidence from repository source | Boundary observation | Required negative test |
|---|---|---|---|
| `apps/web/app/api/paypal/webhook/route.ts` | Calls PayPal webhook-signature verification, then writes to `ta14_paypal_webhook_events` and `ta14_billing_subscriptions` using a Supabase service-role client | Signature verification exists; no call to the GCEA `evaluateExecutionAttempt` boundary in the inspected route. Billing settlement is a different consequence domain, so mediation scope must be explicitly defined before declaring this a bypass. | Reject invalid signatures, duplicate/reordered events, forged user bindings and stale subscription transitions; verify authoritative PayPal state and database row-level consequences |
| `apps/web/app/api/paypal/create-subscription/route.ts` | Accepts a plan key, optionally identifies an authenticated user, calls PayPal to create a subscription; can fall back to caller-supplied `customerReference` | External side-effect route, not demonstrated to be mediated by GCEA. Its own response states that payment does not confer governance certification. | Confirm unauthenticated checkout policy, idempotency, replay resistance, customer-reference integrity and entitlement activation boundaries |
| `apps/web/app/api/ai-governance/registry/submit/route.ts` | Requires authenticated user and matches owner ID before submitting a registry record; further database checks are present | Application authentication and ownership checks observed; not equivalent to proof of every database policy or complete mediation | Attempt cross-user submission, stale eligibility, direct RPC and privileged service-role paths |
| `apps/web/app/api/admin/governance-continuity-execution-authority/run-r1/route.ts` | Requires configured owner user, creates internal demo chronology and inserts/replays rows | Demonstration evidence, not a real-world actuator authorization or outcome oracle | Test non-owner, unset owner, replay corruption and direct database write with least-privilege roles |

## Methodology and constraints

This is a **sample inventory**, selected from repository searches for service-role access, PayPal external requests, and registry RPC usage. It does **not** prove a comprehensive list of all mutation-capable paths. Absence of a GCEA call is not by itself a vulnerability: governance coverage must be defined per consequence and per effector, including payment versus execution authority. Before system-wide claims, produce a complete route/job/RPC/trigger/service-account inventory and run permission-scoped negative tests in a nonproduction environment.

## Follow-up priority
1. Map consequence classes and mandatory enforcement points.
2. Prove service-role keys cannot be used by lower-trust callers and database RLS/privileges enforce the intended scope.
3. For PayPal, test signed webhook replay, out-of-order state transitions, and subscriber identity binding with mocked provider events.
4. For registry, test authenticated ownership and direct-RPC bypass attempts with test identities.
5. Only then claim coverage of the specifically tested paths, not of the entire platform.
