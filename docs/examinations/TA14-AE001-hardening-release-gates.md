# TA14 AE001 Hardening — Evidence Gates and Release Blockers

Status: **HOLD — remediation proposed, not deployed or certified.**

## Implemented in this draft branch
- Fail closed when `now`, authority `effectiveAt`/`expiresAt`, or execution `attemptedAt` is not a parseable finite timestamp.
- Do not allow invalid intervention authority to overwrite an existing DENY with ESCALATE.
- Compare the separately supplied commit object with the commit object embedded in the receipt payload; compare authority input with the receipt's authority input.
- Nine regression expectations in `tests/ta14-ae001-remediation.test.ts`.

## Security caveats
- SHA-256 receipt hashes demonstrate integrity relative to the supplied payload, **not authenticity of an external issuer**. An adversary controlling both payload and hash can recompute a hash. Signed attestations, key custody and independent provenance remain unverified.
- `EXECUTED` is still an internal status; external physical or financial settlement is not independently verified.
- The evaluator is a library; no proof that every consequential effector routes through it. Credential bypass and complete mediation remain untested.
- Timestamp parsing checks validity, not trusted time source, clock skew, replay windows, or chronological order between effectiveAt and expiresAt.
- Binding authority input at commit to input at execution may reject legitimate refreshed evidence or a newly issued authority. A future controlled recommit or reauthorization protocol is needed; do not weaken this check without evidence.

## Release blockers
1. GitHub CI typecheck, all tests, and production build pass on this branch.
2. Independent review of the exact patch and regressions.
3. Trace every server action, API route, background job and physical/financial effector; test alternate credentials and direct paths.
4. Authenticate external evidence provenance, grant issuance and signing keys; test tampering where both payload and hash are attacker-controlled.
5. Define and test trusted-time semantics, invalid ranges, expiration at boundary, and replay prevention.
6. Establish independent outcome oracle and explicit statuses AUTHORIZED / ATTEMPTED / EXECUTED / VERIFIED / INDETERMINATE, where supported.
7. Map actual normative Zenodo clauses, not summaries, to code and tests.
8. Obtain an independent adversarial assessment before claiming system-level assurance.

Do not merge or deploy until the relevant gates are satisfied. PR #577 preserves original findings.
