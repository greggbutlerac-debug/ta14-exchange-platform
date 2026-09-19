# TA-14 AVP × CNS/CP Test-Profile Schema Binding v0.1

**Status:** TEST CANDIDATE — NOT REGISTERED — NOT FROZEN  
**Parent design record:** TA14_AVP_CNSCP_Normative_Mapping_CP_v0_1_Design_Record.md  
**Controls:** Frozen TA14-AVP V1.0.2 controls on conflict. CNS/CP defines the connection contract; it does not confer AVP execution authority.

## 1. Purpose

This companion binding defines how the first AVP Passport Presentation + Acceptance interaction may be represented as CNS/CP string Properties for a future `padi.test.*` interoperability profile without changing TA14-AVP V1.0.2.

It is intentionally narrower than a complete AVP schema. It binds only the cross-domain seam:

**Provider / Authority Passport Presenter -> Passport Properties -> Consumer / Authority Passport Receiver -> PassportAcceptanceReceipt Properties -> Provider**

The Connection ends at the bounded receipt exchange. Local compilation, local admissibility, Local Lease, Local Capsule, Commit, Execution, Effect and Closure remain outside this profile.

## 2. Authority and semantic precedence

1. Frozen TA14-AVP V1.0.2 controls AVP semantics.
2. A future registered CNS/CP profile controls the Connection's Property names, source role, mandatory status and delivery behavior.
3. This binding controls only the test serialization of AVP values into those CNS/CP string Properties.
4. Parsing, transport success, Connection establishment, or receipt delivery never establishes local effect authority.
5. Ambiguity affecting authority, lineage, freshness, revocation, budget, jurisdiction, proof or closure fails closed.

## 3. Roles

### Provider — Authority Passport Presenter

Sources the Passport-side Properties. The Provider is the presenter and is not necessarily the AVP issuer.

### Consumer — Authority Passport Receiver

Sources the acceptance-receipt Properties after AVP boundary evaluation. Binding as Consumer is not acceptance of the Passport.

## 4. Value-envelope rule

Every CNS/CP Property value is a string. To avoid silently redefining AVP compound objects, v0.1 uses one explicit transport envelope for structured values:

`avp-json-v1:<base64url(UTF-8 JSON bytes)>`

This envelope is a **test-binding convention**, not an AVP core rule and not a CNS/CP rule.

Until a canonical AVP JSON schema/canonicalization profile is separately frozen:

- the JSON bytes are treated as the exact integrity-bearing representation supplied by the AVP fixture;
- intermediaries MUST NOT parse-and-reserialize a structured value before digest/signature verification;
- whitespace/key-order normalization MUST NOT be assumed safe;
- decoded JSON MUST preserve the AVP field semantics and types used by the fixture;
- malformed base64url or malformed JSON makes the Property unusable for acceptance.

Scalar registry tokens and self-identifying digest strings remain plain UTF-8 strings and do not use the envelope.

## 5. Passport Property binding

| CNS/CP Property | Source | Mandatory | Delivery | v0.1 value form |
| --- | --- | ---: | --- | --- |
| `passport_id` | Provider | YES | propagate | UTF-8 identifier |
| `issuer` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `principal_lineage` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `constitution_reference` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `purpose` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `delegation_envelope` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `authority_state` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `freshness` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `consequence_budget` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `irreversibility_position` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `jurisdiction` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `proof_obligations` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `revocation` | Provider | YES | propagate | `avp-json-v1:` envelope |
| `closure_responsibility` | Provider | YES | propagate | `avp-json-v1:` envelope |

The test fixture SHALL additionally preserve the complete signed Passport object from which these Properties were projected. The Property projection is not a substitute for the signed Passport.

## 6. PassportAcceptanceReceipt Property binding

Every field below is mandatory because AVP V1.0.2 Appendix H.1 defines every minimum PassportAcceptanceReceipt field as required and integrity-bound.

| CNS/CP Property | Source | Mandatory | Delivery | v0.1 value form |
| --- | --- | ---: | --- | --- |
| `receipt_type` | Consumer | YES | addressed | exact registered/test receipt type token |
| `passport_digest` | Consumer | YES | addressed | self-identifying digest string from AVP fixture |
| `receiver_identity` | Consumer | YES | addressed | UTF-8 stable identity/reference |
| `decision` | Consumer | YES | addressed | exact AVP decision token |
| `narrowing_proof_digest` | Consumer | YES | addressed | self-identifying digest string; see §7 |
| `local_constitution_digest` | Consumer | YES | addressed | self-identifying digest string |
| `freshness_status` | Consumer | YES | addressed | exact AVP freshness token |
| `revocation_sequence` | Consumer | YES | addressed | base-10 ASCII integer for test fixture |
| `jurisdiction_profile` | Consumer | YES | addressed | UTF-8 stable profile/reference |
| `limitations` | Consumer | YES | addressed | `avp-json-v1:` envelope |
| `signer` | Consumer | YES | addressed | UTF-8 stable signer/reference |
| `signature` | Consumer | YES | addressed | opaque AVP signature encoding from fixture |

Allowed `decision` tokens are exactly:

`ACCEPT`, `ACCEPT_NARROWED`, `HOLD`, `REJECT`, `QUARANTINE`, `SUSPEND`, `ESCALATE`.

Allowed `freshness_status` tokens are exactly:

`CURRENT`, `AGING`, `STALE`, `EXPIRED`, `UNKNOWN`.

## 7. Narrowing-proof binding — HOLD

AVP V1.0.2 requires `narrowing_proof_digest` on every minimum PassportAcceptanceReceipt, while its NarrowingProof object is specifically defined for derived/narrowed Passport lineage.

The frozen artifact does not define the canonical value to place in `narrowing_proof_digest` for a plain `ACCEPT` where no narrowing occurred.

Therefore:

- `ACCEPT_NARROWED` MUST bind a real NarrowingProof digest.
- A `NONE`, empty string, null, zero digest, or invented sentinel MUST NOT be introduced by this binding.
- Plain `ACCEPT` remains a **schema HOLD** for registry testing until TA-14 defines an AVP-compatible no-narrowing binding through schema/registry/erratum authority.
- Test fixtures that require a completed receipt before that resolution SHOULD exercise `ACCEPT_NARROWED` or a non-accepting disposition with an explicitly defined receipt fixture rather than fabricate a value.

This HOLD is deliberate evidence of a schema seam, not permission to alter the frozen AVP core.

## 8. Integrity binding

CNS/CP delivery does not satisfy AVP receipt integrity by itself.

For v0.1:

1. the Consumer SHALL construct the complete PassportAcceptanceReceipt object using all twelve required fields;
2. the receipt SHALL be signed according to the AVP fixture's declared signature method;
3. the exact signed receipt artifact SHALL be preserved alongside the CNS/CP Property projection;
4. the Provider SHALL verify the receipt artifact independently of CNS/CP transport success;
5. a mismatch between a projected Property and the integrity-bound receipt artifact invalidates the projection.

The exact canonical digest and signature algorithms remain fixture/profile metadata until separately frozen. Example use of `sha256:...` in AVP V1.0.2 is evidence of an interoperable form, not authority to invent a universal digest grammar here.

## 9. Freshness and revocation

The Passport's `freshness` structured value carries the AVP-defined current state and next validation boundary. The receiving `freshness_status` is an evaluated result and MUST NOT be inferred by CNS/CP.

A Connection MUST NOT convert:

- `STALE` into CURRENT;
- `EXPIRED` into CURRENT;
- `UNKNOWN` into CURRENT;
- a revocation-channel gap into acceptance;
- an old acceptance into continuing permission after a changed condition.

Changed conditions require present re-establishment under AVP. CP state is not a substitute for it.

## 10. Absence and parse failure

For this test binding:

- all Passport Properties listed in §5 are required for the projected Passport interaction;
- all receipt Properties in §6 are required;
- empty string is invalid for a required Property unless a later AVP schema explicitly gives it meaning;
- malformed envelopes, malformed JSON, unknown required tokens, or unresolvable integrity bindings fail closed;
- no transport layer may silently correct, default, broaden, or infer missing AVP meaning.

The receiving AVP runtime chooses the applicable HOLD, REJECT, QUARANTINE, SUSPEND, ESCALATE, or other frozen AVP failure posture.

## 11. Test profile identity

The eventual development profile SHALL use a `padi.test.*` name and SHALL remain visibly non-production until the registry authoring requirements and profile semantics are verified.

**Working descriptive label:** TA-14 AVP Passport Presentation & Acceptance CP v0.1

**Registry name:** HOLD — do not invent until namespace/prefix rules are confirmed.

## 12. Minimum fixture set before registration

The test binding must demonstrate at least:

1. valid bounded presentation with a complete integrity-bound receipt;
2. ACCEPT_NARROWED with valid NarrowingProof;
3. stale Passport;
4. expired Passport;
5. revocation-channel gap;
6. attempted broadening;
7. semantic mismatch;
8. direct Passport-to-effector misuse;
9. FT5/trust treated as execution authority;
10. missing closure responsibility;
11. malformed structured Property envelope;
12. Property/receipt integrity mismatch;
13. changed condition after prior acceptance;
14. unknown mandatory extension.

Expected outcomes must be aligned to AVP V1.0.2 reference vectors rather than invented by CNS/CP.

## 13. Freeze gates

This binding remains TEST CANDIDATE until all of the following close:

- canonical CNS/CP registry authoring fields confirmed;
- TA-14 namespace/prefix confirmed;
- actual `padi.test.*` profile name confirmed;
- no-narrowing value/binding for required `narrowing_proof_digest` resolved under AVP authority;
- canonical AVP schema/serialization profile fixed for the test fixture;
- digest and signature profile fixed;
- integrity coverage verified for all twelve receipt fields;
- reference fixtures executed;
- negative-space review confirms no Local Lease, Local Capsule, Commit, Execution or Effect semantics leaked into the CP;
- final claim-control review completed.

## 14. Non-claims

This document does not claim CNS/CP certification or endorsement, OSTERA adoption, registry publication, proven interoperability, TA-14 recognition, transfer of execution authority, or modification of TA14-AVP V1.0.2.

**Boundary statement:** The Connection Profile defines the crossing. TA-14 governs what happens after the crossing before consequence.
