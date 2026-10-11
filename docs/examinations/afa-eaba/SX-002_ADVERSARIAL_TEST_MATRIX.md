# SX-002 Adversarial Test Matrix v0.1
Status: DESIGN ONLY / HOLD. No production tests or changes. SX-001 historical mechanism remains unchanged.

## Critical NULL regression
SX-001 computes v_authorized as an AND of caller-supplied booleans and NOT p_bypass. When one input is NULL and no other predicate is FALSE, v_authorized is NULL. PL/pgSQL IF NOT v_authorized THEN does not execute its refusal branch on NULL, so the function may attempt effect insertion. Verify only in isolated staging. SX-002 must reject any result IS DISTINCT FROM TRUE and must derive authority from independently verified records, not submitted booleans.

## Staging-only tests
| Test | Adversarial input | Required outcome |
|---|---|---|
| T01 | Valid current actor, evidence, scope, standing, target, commit | Exactly one bound effect |
| T02 | Passport predicate NULL, others TRUE | No effect |
| T03 | Freshness predicate NULL, others TRUE | No effect |
| T04 | Local standing NULL, others TRUE | No effect |
| T05 | Bypass predicate NULL, others TRUE | No effect |
| T06 | All submitted booleans TRUE, no authoritative evidence | No effect |
| T07 | Expired or revoked authority | No effect |
| T08 | Target/action/scope/version substituted | No effect |
| T09 | Direct INSERT as ordinary app identity | Permission denied |
| T10 | Direct INSERT as general service_role | Permission denied on SX-002 table |
| T11 | Replay consumed commit | No second effect |
| T12 | Concurrent same commit | At most one effect |
| T13 | Evidence dependency unavailable | Fail closed; no effect |
| T14 | Alternate endpoint or background job | No ungated effect |
| T15 | Receipt preservation fails | Atomic rollback or indeterminate HOLD, never false success |
| T16 | Privileged owner/SECURITY DEFINER route review | Documented trust boundary and independent review |

## Evidence package
For each test preserve code SHA, migration SHA, database version, execution identity, frozen input, authoritative record IDs, expected and actual disposition, before/after effect counts, receipt, query transcript, timestamp, and reviewer. Do not store credentials. Never infer an effect solely from an HTTP response.

## Exit rule
Bounded PASS requires T01-T16 to pass in isolated staging, independently reviewed route inventory, and signed evidence. Otherwise HOLD, DENY if unauthorized effects are demonstrated, or ESCALATE for unresolved privileged paths.
