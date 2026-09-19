# Local Exercise Profile — TA-14 AVP Passport Presentation & Acceptance

**Reference:** `cp:test.ta14-avp-passport-acceptance:unpublished`  
**Status:** LOCAL EXERCISE / UNPUBLISHED / NON-RESOLVABLE  
**CNS/CP source:** 2026 working draft, §§6–7  
**TA-14 source:** TA14-AVP V1.0.2

## Important correction

The CNS/CP 2026 working draft reserves the Top Level Prefix `test` for local exercise and states that it is **never globally resolvable**. It is not `padi.test.*`. The `test` prefix is distinct from the Unpublished lifecycle state.

This artifact exercises the profile locally as `cp:test.ta14-avp-passport-acceptance:unpublished`. It does **not** claim registry registration, publication, allocation of a TA-14 Top Level Prefix, or interoperability.

## Interaction

Provider = Authority Passport Presenter. Consumer = Authority Passport Receiver. The profile ends at the PassportAcceptanceReceipt crossing.

Excluded: Local Compilation, Local Lease, Local Capsule, Commit, Execution, Effect and Closure.

## Header candidate

- Name: `test.ta14-avp-passport-acceptance`
- Provider: Authority Passport Presenter
- Consumer: Authority Passport Receiver
- Lifecycle: Unpublished
- Channels: none

## Provider Properties

All are **Mandatory = true** and **Propagate = true** for this local exercise candidate:

`passport_id`, `issuer`, `principal_lineage`, `constitution_reference`, `purpose`, `delegation_envelope`, `authority_state`, `freshness`, `consequence_budget`, `irreversibility_position`, `jurisdiction`, `proof_obligations`, `revocation`, `closure_responsibility`.

## Consumer Properties

All are **Mandatory = true** and **Propagate = false** (addressed per Connection, not a confidentiality claim):

`receipt_type`, `passport_digest`, `receiver_identity`, `decision`, `narrowing_proof_digest`, `local_constitution_digest`, `freshness_status`, `revocation_sequence`, `jurisdiction_profile`, `limitations`, `signer`, `signature`.

Decision vocabulary: `ACCEPT`, `ACCEPT_NARROWED`, `HOLD`, `REJECT`, `QUARANTINE`, `SUSPEND`, `ESCALATE`.

Freshness vocabulary: `CURRENT`, `AGING`, `STALE`, `EXPIRED`, `UNKNOWN`.

## Local exercise HOLD

The profile can exercise `ACCEPT_NARROWED`, because a real NarrowingProof digest can satisfy the frozen receipt field. Plain `ACCEPT` remains on HOLD until TA-14 defines the AVP-compatible required value/binding for `narrowing_proof_digest` when no narrowing occurs.

## Promotion boundary

A globally resolvable TA-14 profile requires: (1) allocation/confirmation of TA-14's Top Level Prefix by the namespace authority; (2) registration beneath it; (3) unpublished authoring under that registered name; (4) closure of the no-narrowing receipt seam; (5) executed fixture evidence; and (6) publication only when ready for immutable versioning.

**Boundary:** Connection success does not establish execution authority.
