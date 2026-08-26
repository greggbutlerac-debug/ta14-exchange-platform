# TA-14 Institutional Acceptance Execution Authority v1.0

Status: CONTROLLED AUTHORITY BOUNDARY

## Purpose

Define a non-human execution identity for bounded TA-14 production acceptance probes so acceptance evidence does not depend on a named institutional operator manually pressing browser controls.

## Identity

Execution identity: `TA14_ACCEPTANCE_EXECUTOR_V1`

Role: technical acceptance executor only.

This identity is not a governance claimant, institutional reviewer, finding issuer, registry authority, publication authority, or certification authority.

## Permitted authority

The executor may:

1. invoke explicitly enumerated production acceptance probes;
2. submit synthetic acceptance fixtures that are unmistakably marked as acceptance-only;
3. observe and preserve HTTP response status, bounded response metadata, persistence/non-persistence results, chronology results, and controlled-retrieval results;
4. preserve execution timestamps and production version identity;
5. report PASS/FAIL/INCOMPLETE strictly against the frozen acceptance protocol.

## Prohibited authority

The executor must not:

- issue institutional findings about participant architectures;
- alter Registry standing;
- publish controlled evidence;
- impersonate Greggory Don Butler or any other human operator;
- reuse a human Supabase session or browser cookie;
- convert a test result into institutional certification;
- bypass production authentication for ordinary institutional records;
- create an acceptance artifact that can be mistaken for a participant or governance artifact.

## Authentication rule

Machine execution must use a dedicated server-side secret credential scoped only to the acceptance executor. The credential must never be exposed to client code, committed to the repository, returned in acceptance evidence, or accepted by general public routes.

An acceptance-enabled production endpoint must independently verify the executor credential and must additionally require an explicit acceptance fixture marker before exercising any machine-authorized mutation.

## Fixture namespace

All machine-created records must use identifiers beginning with:

`TA14-ACCEPTANCE-`

and must carry an explicit acceptance-only marker in persisted metadata where persistence is part of the control under examination.

## Evidence rule

Execution by this identity can establish technical production behavior only. Institutional interpretation of the preserved result remains separate.

## Fail-closed rule

If executor authentication, fixture marking, control identity, or expected production preconditions are absent or ambiguous, execution must refuse rather than fall back to a human or public authority path.
