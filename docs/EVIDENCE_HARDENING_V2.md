# TA-14 Exchange Evidence Hardening v2

## Governing objective

The Exchange distinguishes governance demonstrations from stronger proof of external state and causal control. Synthetic scenarios remain valid demonstrations when explicitly bounded. Terminology never promotes a lower evidence rung into a higher one.

## Evidence ladder

| Rung | Mode | Establishes | Boundary |
|---|---|---|---|
| E0 | Narrative / UI | A proposition or scenario is represented | No event-occurrence claim |
| E1 | Synthetic execution | Deterministic governance behavior over supplied facts | Supplied facts are not independently true |
| E2 | Replayable package | Frozen inputs reproduce the same governed result | Does not independently prove source truth |
| E3 | External observation | Evidence originated outside artifact logic | Provenance/source trust remains inspectable and bounded |
| E4 | Live controlled consequence | A protected action was permitted or prevented by an operative enforcement point | Bounded to tested target/action corridor |
| E5 | Independent challenge / replay | A third party changes a material condition and reproduces changed standing | Highest demonstration standing; not universal proof |

## Verification vocabulary

`VERIFIED` is not a generic completion state. Surfaces should use:

- `IDLE`
- `CHECKING`
- `SELF_CHECK_COMPLETE`
- `REPLAY_CONFIRMED`
- `EXTERNALLY_VERIFIED`
- `VERIFICATION_FAILED`
- `VERIFICATION_UNRESOLVED`

A timer may drive presentation progress. It must never determine evidence standing.

## Three proof questions

1. **Determination correctness:** did the engine produce the required ALLOW / HOLD / DENY / ESCALATE result over the admitted evidence, authority, policy and route version?
2. **Causal execution control:** did that determination actually control whether the protected action could form while still preventable?
3. **Reality / outcome correspondence:** if execution occurred, did authoritative post-state evidence correspond to the committed action and expected outcome?

These questions must not collapse into one generic PASS.

## Protected execution invariant

No protected execution may form without a current `ALLOW` commit bound to the exact route version, target and canonical action. Revocation, expiry, stale mandatory evidence, target drift or action drift fail closed before outbound transmission.

HOLD, DENY and ESCALATE are enforceable outcomes, not presentation states.

## Proof of non-formation

Negative decisions should preserve target-specific evidence including, where applicable:

- `commitId` absent or invalid
- `outboundAttempted=false`
- `outboundSent=false`
- `targetAcknowledged=false`
- `effectObserved=false`
- earliest governing refusal reason code

Local adapter invocation must be distinguished from external action formation.

## Source standing rule

Receipts serialize evidence; they do not create independent truth. A receipt cannot elevate the standing of its supporting source. Public claims must resolve to the exact proposition, artifact, evidence rung and limitations supporting them.

## Current implementation

`apps/web/lib/evidence-hardening-types.ts` defines canonical proof contracts for evidence, authority, commit, verification, execution, outcome and replay objects.

`apps/web/lib/evidence-hardening-engine.ts` implements reusable currentness checks, exact commit/action parity, protected-action fail-closed guarding, proof-standing derivation and evidence-rung capping.

These modules are intentionally connector-neutral. E3-E5 standing must not be awarded until the required external observation, causal target evidence, or independent replay is actually connected and preserved.

## Reference-corridor acceptance cases

A live corridor is not complete until it demonstrates at least:

- baseline valid set -> ALLOW
- missing mandatory evidence -> HOLD before commit
- revoked authority -> DENY/HOLD before outbound
- stale evidence -> HOLD/UNRESOLVED
- post-commit mutation -> parity failure
- required source outage -> UNRESOLVED/HOLD, never fabricated PASS
- outcome divergence -> execution recorded, outcome DIVERGENT
- replay tampering -> digest mismatch
- bypass attempt -> prevented or detected governance violation
- independent material mutation -> changed governed result reproduced

## Public claim discipline

Prefer exact bounded language:

- "This artifact demonstrates deterministic governance behavior over supplied conditions."
- "This replay reproduced a governed result from a frozen package."
- "This external corridor shows the protected action was blocked before outbound transmission when the required condition failed."

Do not call a scripted checklist external verification, authored state a real-world event, or conventional software primitives novel merely because their architectural arrangement is distinct.

## End state

The Exchange should demonstrate not merely that governance logic can classify a scenario, but that a required condition can causally prevent a protected action from forming, that permitted execution corresponds to the immutable commit, that outcome is separately observed, and that materially changed conditions can be independently replayed to produce the required changed governed result.
