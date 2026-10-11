# TA14-AE001 — Temporal validity and disposition precedence

**Status: HOLD / characterization only.** Branch: `examination/ta14-internal-adversarial-001`. No production fix or deployment authorized.

## Directly inspected evaluator

`apps/web/lib/governance-continuity-execution-authority.ts` exports `evaluateExecutionAuthority`, `evaluateCommit`, and `evaluateExecutionAttempt`.

The authority evaluator compares `new Date(...).getTime()` using `>` and `<=` without first rejecting `NaN`. In JavaScript, both comparisons are false for `NaN`; thus malformed `effectiveAt`, `expiresAt`, or `now` may leave `ALLOW` in place when the other supplied fields support it. The attempt evaluator reevaluates at `attempt.attemptedAt`, with the same temporal issue. These are bounded local observations, **not proof that untrusted input can reach these functions in a deployed workflow**.

An invalid intervention authority changes the attempt determination to `ESCALATE` even when a preceding mismatch set it to `DENY`. `executionPermitted` remains false in that case. This is a **disposition-integrity concern**, not demonstrated unauthorized execution.

## Tests

- AE001-06: malformed `effectiveAt` -> characterized `ALLOW` (prior test).
- AE001-10: malformed `expiresAt` -> characterized `ALLOW`.
- AE001-11: malformed `now` -> characterized `ALLOW`.
- AE001-12: malformed `attemptedAt` -> characterized execution permission.
- AE001-13: scope mismatch `DENY` plus invalid intervention authority -> characterized `ESCALATE` with `executionPermitted=false`.

All tests intentionally assert **observed behavior**, not desired safety outcomes. Passing tests do not mean defects have been corrected.

## Published architecture correspondence (dashboard descriptions only)

The founder-provided Zenodo dashboard describes LAS, CAG, RAP, EABA and ASA as requiring bounded, continuing and locally established authority. This note does **not** claim exact clause-level nonconformance without their full normative texts. The descriptions do not establish that malformed timestamps reach any deployed effector.

## Next evidence gate

1. Inventory all production callers of the three evaluator functions and document schema validation at every entry.
2. Distinguish internally constructed ISO timestamps from externally supplied data, and determine whether malformed dates can traverse any route.
3. Define precedence policy from frozen normative clauses; test DENY preservation and permitted ESCALATE behavior.
4. Add **remediation expectation tests** separately from characterization tests. Do not change these characterization assertions retroactively.
5. Require an independent effector observation before claiming bypass or unauthorized consequence.

**Provisional disposition: HOLD.** No evidence yet of actual unauthorized external effect, complete mediation, or independent outcome verification.
