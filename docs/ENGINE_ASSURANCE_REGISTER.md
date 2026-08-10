# TA-14 Engine Assurance Register

## Purpose

The TA-14 AI Governance Exchange must not merely expose engines. It must be able to state what each engine is intended to do, what evidence demonstrates that behavior, how failure and refusal are handled, and whether operating guidance reflects the verified production surface.

## Assurance states

1. **INVENTORIED** — engine and operating surface identified.
2. **CODE REVIEWED** — implementation boundaries and dependencies inspected.
3. **HAPPY PATH TESTED** — intended successful operating sequence exercised.
4. **FAILURE / REFUSAL TESTED** — invalid, incomplete, conflicting, or inadmissible states exercised.
5. **INTEGRATION TESTED** — upstream/downstream record and persistence behavior exercised.
6. **ACADEMY GUIDE COMPLETE** — step-by-step embedded operating guidance exists.
7. **PRODUCTION VERIFIED** — verified production behavior corresponds to the documented operating model.

No engine should be represented as production verified merely because a page renders or a guide exists.

## Initial engine inventory

| Engine | Surface / implementation | Current assurance state | Academy guidance |
|---|---|---|---|
| Execution Artifact Registry | `/artifacts/registry` + `lib/execution-artifacts/artifact-registry-engine.ts` | CODE REVIEWED | FIRST GUIDE IMPLEMENTED IN CURRENT PR |
| Canonical Artifact Engine | `lib/execution-artifacts/canonical-artifact-engine.ts` | INVENTORIED | Pending |
| Artifact Verification Engine | `lib/execution-artifacts/artifact-verification-engine.ts` | INVENTORIED | Pending |
| Artifact PDF Engine | `lib/execution-artifacts/artifact-pdf-engine.ts` | INVENTORIED | Pending |
| Digital Signature Engine | `lib/execution-artifacts/digital-signature-engine.ts` | INVENTORIED | Pending |
| Integrity Hash Engine | `lib/execution-artifacts/integrity-hash-engine.ts` | INVENTORIED | Pending |
| Disclosure Policy Engine | `lib/execution-artifacts/disclosure-policy-engine.ts` | INVENTORIED | Pending |
| Portfolio Export Engine | `lib/execution-artifacts/portfolio-export-engine.ts` | INVENTORIED | Pending |
| Challenge / Correction Engine | `lib/execution-artifacts/challenge-correction-engine.ts` | INVENTORIED | Pending |
| Governance Playground Determination | `lib/governance-playgrounds/determine.ts` | INVENTORIED | Pending |
| Imported Route Verification / Replay | `lib/imported-route-verification-replay.ts` | INVENTORIED | Pending |
| Governance Life-History Engine | `ta14_governance_life_history_events` + public history route | INTEGRATION FOUNDATION LIVE | Pending |

## Academy guidance standard

Every engine guide should eventually include:

- purpose and governing question;
- when to use / when not to use;
- prerequisites;
- field-by-field explanation;
- step-by-step operating sequence;
- real production screenshots or verified interface diagrams;
- worked example;
- correct completion state;
- HOLD / DENY / ESCALATE / failure conditions where applicable;
- recovery or correction path;
- record created by the engine;
- downstream governed action;
- known limitations and non-claims;
- engine assurance state and last verification date.

## Operating rule

**Teach only what the Exchange can demonstrate. Verify before elevating an engine to production-assured status.**
