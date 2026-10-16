# SX-002 staging execution boundary — implementation acceptance specification

Status: **NOT DEPLOYED**. Branch-only candidate. Live project must not be used for destructive/adversarial tests.

## Required database enforcement

1. The effect sink must reject caller-supplied Boolean assertions as authority. Obtain current, verified actor, target, scope, evidence, revocation, and expiry from authoritative records inside one transaction.
2. Deny any missing, false, or NULL gate. PostgreSQL safe condition: `IF v_authorized IS DISTINCT FROM TRUE THEN` (never `IF NOT v_authorized THEN`).
3. Enforce a unique, single-use commit identifier with a database unique constraint and a transaction-bound insert; concurrent duplicate commits must create at most one effect.
4. Reject missing/expired/revoked standing, mismatched actor/target/action/scope/evidence digest, unavailable dependency, and stale state. Do not substitute client assertions for database evidence.
5. Revoke `INSERT` on the effect sink from the shared `service_role` application credential **only after** mapping all consumers and providing a narrower executor path. The shared key currently has direct INSERT privilege and bypasses RLS; RLS alone is not a remedy.
6. Ensure the narrowly authorized execution function and effect INSERT are in the same transaction. Keep refusal receipts separate from effect records. Record immutable audit provenance.
7. Inventory alternate write paths and table owners. SECURITY DEFINER ownership and function EXECUTE grants must be explicitly checked.

## Staging test protocol

T01 authorized matching commit -> exactly one effect. T02-T07 each NULL gate -> zero effects. T08 caller-forged booleans -> zero effects. T09 revoked authority -> zero effects. T10 target mismatch -> zero effects. T11 direct app-role INSERT -> permission denied. T12 shared service-role direct INSERT -> permission denied after migration. T13 repeated commit -> at most one effect. T14 concurrent same commit -> at most one effect. T15 dependency failure -> zero effects. T16 out-of-band write route -> denied. Each test must assert effect-table count before/after and capture receipts. Test using a **separate staging Supabase project** with nonproduction credentials and synthetic records.

## Stop conditions

Do not promote, merge, or describe as proven until isolated staging is available, all negative cases are executed, the shared credential is least-privileged, and independent review is complete. Production stays unchanged.
