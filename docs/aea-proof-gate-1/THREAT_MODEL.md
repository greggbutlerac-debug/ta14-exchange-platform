# AEA Proof Gate 1 — bounded claims and adversarial review

**Status:** draft engineering experiment; not independently reviewed; simulation only.  
**Tracking:** issue #721, draft PR #722.

## Verified historical result
The existing refrigeration simulation explicitly reports PREVENTION=FAIL for S2/S3 where commands bypass the governed route. These failures are not resolved by adding an in-memory guarded adapter.

## What the new harness can demonstrate
Within a single-process simulated controller adapter, requests pass through submission and execution checks. The tests exercise evidence, grant, actor standing, bounds, runtime revalidation, duplicate IDs, and submitted-command identity. The state observer reads a private simulation variable, **not an independently instrumented physical controller**. An observed state transition in this harness is not proof that a real controller will obey the same boundary.

## Critical gaps before a stronger claim
1. **Mandatory route enforcement:** no proof that every real actuator write path goes through the adapter. Existing S2/S3 demonstrate bypass.
2. **Commit binding:** production GCEA commit records bind asset, route, consequence, authority and evidence, but not the command ID and exact parameters. The adapter compares payloads locally; it is not a durable, cryptographic command-specific commit.
3. **Prior-commit requirement:** exported `executeCommitted` can evaluate a valid execution without receiving a prior commit record. Callers must enforce ordering themselves.
4. **Durable atomic idempotency:** duplicate prevention in the new harness is a process-local `Set`. It does not cover process restart, multiple replicas, concurrent requests, or direct writes.
5. **Identity and authority trust:** simulated actor/grant data are supplied by the caller. No cryptographic issuer validation or authenticated caller binding is established by this harness.
6. **Observation independence:** simulated state is private to the harness, but not an independently acquired physical measurement.
7. **No real equipment validation:** no hardware, BACnet, Modbus, field safety, sensor integrity or attacker access control test.
8. **Novelty:** HOLD behavior alone does not establish improvement over standard ACL, interlock or transaction checks.

## Next acceptance experiment
Use an isolated, single-writer controller emulator with a separately controlled observation interface, a persistent atomic command ledger, and an explicit immutable command digest. Require a signed or otherwise trusted grant tied to authenticated actor identity. Bind a successful commit to command ID, exact parameters, asset version and policy version. The final write boundary must atomically verify the commit and consume its one-time token; no alternate mutation API may be reachable by the test actor. Probe replay, process restart, two simultaneous executions, altered payload, stale evidence, revoked standing and direct-write bypass. Publish raw traces and the failure matrix.

**Pass** only for the specified tested topology if every unauthorized path produces zero independently observed mutations and every authorized control produces the expected single mutation. **Fail** if any claimed route bypasses the gate. **Inconclusive** if observations, trust boundaries, or test execution are missing.

Do not merge, deploy, publish a safety claim or change production equipment based on this draft.
