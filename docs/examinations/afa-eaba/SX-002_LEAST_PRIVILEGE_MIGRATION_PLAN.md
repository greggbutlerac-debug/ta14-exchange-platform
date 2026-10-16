# SX-002 — Least-Privilege Migration and Rollback Plan

Status: DESIGN ONLY / HOLD. No schema, credentials, deployments, or production records modified.

## Source evidence
- Production read-only privilege audit (2026-10-11): service_role has INSERT, SELECT, REFERENCES and TRIGGER on public.ta14_afa_eaba_challenge_effects, bypasses RLS; no UPDATE/DELETE; append-only trigger enabled. Gate is SECURITY DEFINER and executable by service_role and postgres.
- Repository search: 38 files match SUPABASE_SERVICE_ROLE_KEY (including documentation; not 38 confirmed running services). Uses span AFA/EABA, registry, billing/trials, runtime preservation, notifications, analytics, and evidence intake.
- Supabase documentation: https://supabase.com/docs/guides/database/postgres/row-level-security . RLS is not a substitute for grants, and bypassrls roles do not rely on RLS to constrain writes.

## Phases and entry/exit gates
0. Baseline: freeze repository SHA, current grants, function ownership and definitions, trigger definitions, policies, API schema exposure, receipt/effect counts, deployed environment configuration (names only; no secrets). Preserve SX-001 unchanged. EXIT: independently repeatable snapshot.
1. Dependency map: classify each service-role usage by component, table/function, read/write permission, actor, and exposure; inspect cron/background jobs and external integrations. EXIT: reviewed dependency map and explicit protected-effect route inventory.
2. Isolated staging: provision separate SX-002 effect and authority/evidence tables in a non-exposed schema. Create a dedicated minimally privileged database identity, with no direct INSERT on effects. Keep effect owner distinct from application identity. Design a tightly scoped gateway; where SECURITY DEFINER is essential, restrict EXECUTE to the intended identity, pin safe search_path, fully qualify objects, and audit function owner and privileges. EXIT: privilege matrix confirms ordinary service role and app identities cannot write effects directly.
3. Evidence-based gate: derive all predicates from authoritative stored records and verified signatures; reject missing/NULL values, stale evidence, revoked authority, mismatched actor/action/target/scope/version, unresolved local standing, and consumed commit IDs. Lock relevant state or use equivalent concurrency-safe transaction semantics; commit and effect insertion atomically. EXIT: negative tests A-H plus NULL/unknown-state and concurrent-replay tests.
4. Independent verification: second reviewer inspects effects table, refusal ledger, commit bindings, logs, grants, and all alternate paths. Verify denial without a row and ALLOW with exactly one effect. EXIT: signed bounded report; never universal security claim.
5. Controlled rollout: only after explicit authorization, deploy new route with a feature flag default OFF, bounded audience, reversible traffic routing, monitoring and stop criteria. Do not rotate or revoke the existing shared service key until its unrelated dependencies have been migrated and tested.

## Stop / rollback triggers
- Unauthorized effect, forged authorization accepted, duplicate effect, or alternate route: immediately disable SX-002 traffic and preserve evidence; disposition DENY.
- Unexpected permission error, dependency regression, receipt/effect mismatch, incomplete audit logs, or unresolved state: disable new traffic; disposition HOLD.
- Rollback only application routing and feature flags to the last known safe configuration. NEVER fall back from a denied SX-002 authorization to an ungated effect path. Do not delete preserved effects or receipts. For a detected security breach, suspend consequential operations until containment and re-examination.

## Explicit nonclaims
No claim of universal non-bypassability, real HVAC physical actuation, production fitness, or independent certification. Database owner/admin powers remain outside a narrow application-credential threat model unless separately controlled and examined.

## Implementation gate
No production migration, privilege revoke, service key rotation, deployment, or staging attack is authorized by this design record. Separate review and explicit approval required.
