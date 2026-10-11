# SX-002 — Read-only PostgreSQL NULL-gate test evidence

Date: 2026-10-11. Target: existing production Supabase project, **read-only SELECT only**. No effects, writes, migrations or RPC invocation performed.

## Confirmed source defect

Live `pg_get_functiondef` for `public.ta14_afa_eaba_apply_effect(uuid,text,text,text,boolean,boolean,boolean,boolean,boolean,boolean)` computes `v_authorized` as an AND of five Boolean predicates and `NOT p_bypass`, then rejects using `IF NOT v_authorized THEN`. In PL/pgSQL an IF condition that evaluates to NULL does not enter the branch. An input NULL in any one of the six predicates, with all others permissive, produces NULL and skips the rejection. The function then reaches INSERT. This is a logic-level fail-open defect; public exploitability was not established.

## Pure SQL truth-table evidence (no writes)

Nine cases were evaluated with a read-only SELECT: valid, false passport, explicit bypass, and six single-NULL cases (passport, freshness, scope, local standing, commit binding, bypass). In all six NULL cases the original rejection condition `(NOT decision) IS TRUE` was false. The proposed rejection condition `decision IS DISTINCT FROM TRUE` was true for all six NULL cases and for the two explicit denials, and false only for valid.

## Required remediation (candidate only; not deployed)

Change the function's denial check to `IF v_authorized IS DISTINCT FROM TRUE THEN`, reject NULLs explicitly at the database boundary, validate provenance and transactional binding rather than accepting caller-supplied booleans, and eliminate direct INSERT privilege from shared application service credentials. Run adversarial staging tests before production migration. A NULL-gate fix alone does **not** prove non-bypassability.

Disposition: **DENY** for claim that current effect gate is fail-closed; **HOLD** for SX-002 candidate readiness. Preserve SX-001 and production unchanged pending safe release.
