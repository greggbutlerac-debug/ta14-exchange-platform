# TA-14 AVP × CNS/CP Normative Mapping & CP v0.1 Design Record

**Status:** DESIGN RECORD — PRE-FREEZE  
**Scope:** First bounded Connection Profile for TA-14 Authority Passport presentation and acceptance  
**Controlling TA-14 source:** Authority Passport Protocol (TA14-AVP) V1.0.2  
**Interface model:** CNS/CP Connection Profile  
**Rule:** A Passport carries authority context. It does not carry the right to execute.

## 1. Purpose

This record defines the seam between the frozen TA-14 Authority Passport Protocol and a CNS/CP Connection Profile without changing AVP semantics.

The Connection Profile governs the bounded cross-organizational interaction. TA-14 continues to govern the receiving domain's local admissibility, authority, Commit, Execution, Effect and Closure determinations.

This record does **not** establish interoperability as proven. It defines the first proposition and testable boundary from which an implementation and bounded examination may proceed.

## 2. Proposed first Connection Profile

**Working name:** TA-14 AVP Passport Presentation & Acceptance CP v0.1

**Provider → Receiver:** Authority Passport object  
**Receiver → Provider:** PassportAcceptanceReceipt  
**Profile termination:** receipt return / preserved refusal state

The profile ends before local compilation and before any local execution entitlement is created.

## 3. Positive space — what may cross

### Authority Passport

The provider may present the AVP-defined Passport object containing:

- `passport_id`
- `issuer`
- `principal_lineage`
- `constitution_reference`
- `purpose`
- `delegation_envelope`
- `authority_state`
- `freshness`
- `consequence_budget`
- `irreversibility_position`
- `jurisdiction`
- `proof_obligations`
- `revocation`
- `closure_responsibility`

The Connection Profile may constrain representation, transport, required/optional presence, integrity binding and interaction behavior. It may not broaden the authority represented by the Passport.

### PassportAcceptanceReceipt

The receiver may return the AVP minimum interoperable receipt containing:

- `receipt_type`
- `passport_digest`
- `receiver_identity`
- `decision`
- `narrowing_proof_digest`
- `local_constitution_digest`
- `freshness_status`
- `revocation_sequence`
- `jurisdiction_profile`
- `limitations`
- `signer`
- `signature`

The receipt records the bounded receiving-domain response. It does not grant execution authority.

## 4. Negative space — what must not cross as implied authority

The first CP must not represent, imply or transport:

- local execution authority;
- a receiving-domain Local Lease;
- a receiving-domain Local Capsule;
- Commit authorization;
- Execution authorization;
- permission to produce Effect;
- proof that local evidence is sufficient;
- proof that current receiving-domain reality remains admissible;
- authority to broaden the delegation envelope;
- authority to exceed consequence budget or irreversibility constraints;
- authority inferred solely from identity, trust, compatibility, receipt, acceptance or successful transport.

Nothing omitted from the Connection Profile is silently imported through interpretation.

## 5. Boundary decisions

The receiving domain may record the AVP receiving posture applicable to the presented Passport, including:

- ACCEPT
- HOLD
- REJECT
- QUARANTINE
- ESCALATE

**ACCEPT is not execution permission.** It means the Passport may enter local assessment.

HOLD preserves restraint at the protected threshold. REJECT preserves refusal evidence. QUARANTINE freezes the path. ESCALATE preserves a safe posture while additional authority or evidence is sought.

## 6. The exact seam

The cross-domain profile terminates here:

```
PROVIDER
  ↓
Authority Passport
  ↓
[ CONNECTION PROFILE ]
  ↓
RECEIVER
  ↓
PassportAcceptanceReceipt
  ↑
[ CONNECTION PROFILE ]
  ↑
PROVIDER
```

The receiving domain then proceeds independently:

```
Passport accepted
→ local constitution compiled
→ local evidence attached
→ local admissibility assessed
→ local capacity reserved
→ final heartbeat
→ local capsule issued
→ local effect
→ closure
```

Those downstream stages are not granted by the CP and are not part of CP v0.1.

## 7. Responsibility split

### Provider

The provider is responsible for presenting an integrity-bound Passport that truthfully represents the bounded authority context it claims to carry, including freshness, revocation, jurisdiction, delegation and proof obligations.

### Connection Profile

The CP names the interaction and the contract for the crossing: what is presented, what may be returned, what semantics apply at the boundary, and what is explicitly outside the interaction.

### Receiver

The receiver is responsible for independently applying its local constitution, evidence requirements, admissibility rules, capacity constraints and execution governance after receipt.

### TA-14 runtime

TA-14 governs the consequence-bearing determination after the crossing. No CP state substitutes for the receiving runtime's own present-tense determination.

## 8. Normative mapping

| CP concern | AVP source object / obligation | CP treatment | Boundary |
| --- | --- | --- | --- |
| Interaction identity | `passport_id`, issuer, receiver identity | Name and bind the crossing | Crosses |
| Principal / lineage | `principal_lineage` | Preserve without broadening | Crosses |
| Constitutional reference | `constitution_reference` | Transport reference/digest as defined | Crosses |
| Purpose | `purpose` | Bound interaction purpose | Crosses |
| Delegated authority envelope | `delegation_envelope` | Carry bounded context only | Crosses |
| Authority state | `authority_state` | Carry declared state | Crosses |
| Freshness | `freshness`, `freshness_status` | Require current-state handling | Crosses |
| Consequence bounds | `consequence_budget`, `irreversibility_position` | Preserve constraints | Crosses |
| Jurisdiction | `jurisdiction`, `jurisdiction_profile` | Preserve domain context | Crosses |
| Proof obligations | `proof_obligations` | Carry obligations, not proof of local sufficiency | Crosses |
| Revocation | `revocation`, `revocation_sequence` | Support revocation-aware interaction | Crosses |
| Closure | `closure_responsibility` | Preserve responsibility | Context crosses |
| Acceptance result | `decision`, limitations | Return receipt | Crosses back |
| Narrowing | `narrowing_proof_digest` | Bind receiver narrowing | Crosses back |
| Local constitution | `local_constitution_digest` | Receipt evidence only | Digest crosses back; constitution does not |
| Local admissibility | receiving-domain determination | Never inherited from CP | Does not cross |
| Local Lease | receiving-domain runtime | Excluded | Does not cross |
| Local Capsule | receiving-domain runtime | Excluded | Does not cross |
| Commit / Execution / Effect | receiving-domain runtime | Excluded | Does not cross |

## 9. Initial interoperability fixtures

The first bounded examination should select AVP reference vectors that attack the seam rather than merely demonstrate a happy path. Initial fixture classes should include:

1. valid Passport presentation and bounded acceptance;
2. stale Passport;
3. revoked Passport / revocation race;
4. attempted broadening by the receiver;
5. semantic mismatch at the boundary;
6. direct Passport-to-effector attempt;
7. trust or compatibility treated as execution authority;
8. consequence-budget or irreversibility conflict;
9. receipt integrity failure;
10. changed condition after acceptance requiring reassessment.

Expected behavior is fail-closed where the required present evidence, authority, freshness, semantic compatibility or local entitlement is not established.

## 10. Conformance and commercial boundary

The Connection Profile itself remains an open interface artifact. Commercial work may exist behind implementation, examination, assurance, recognition and revalidation.

AVP's existing claim classes remain controlling:

```
SELF_DECLARED
→ INDEPENDENT_ASSESSED
→ TA14_RECOGNIZED
```

TA14_RECOGNIZED is not implied by compatibility, copied terminology, successful transport, a CNS/CP registry entry, or a self-declared implementation.

A conformance claim should identify the applicable AVP version, dependency versions, sector profile, issuer/receiver domains, trust anchors, conformance level, evidence bundle, validity period and reassessment triggers.

## 11. Non-claims

This v0.1 Design Record does not claim:

- CNS/CP certification or endorsement;
- OSTERA Working Group adoption;
- completed CNS/CP registry publication;
- proven interoperability;
- TA14_RECOGNIZED status for any implementation;
- transfer of execution authority between domains;
- modification of frozen AVP semantics.

## 12. Freeze gates for CP v0.1

Before the first CP is frozen or registered:

1. inspect the live CNS/CP registry form;
2. inspect representative existing Connection Profiles;
3. map actual registry fields to this design record;
4. confirm TA-14 organization/prefix practicalities;
5. define exact provider and consumer identifiers;
6. define field cardinality and serialization requirements;
7. define integrity/digest/signature handling;
8. select the exact AVP reference-vector identifiers used as fixtures;
9. verify positive and negative space against AVP V1.0.2;
10. perform a final claim-control review.

Only after those gates close should the artifact advance from Design Record to a candidate Connection Profile.

---

**TA-14 boundary statement**

**The Connection Profile defines the crossing. TA-14 governs what happens after the crossing before consequence.**

Two independently governed architectures may meet at one boundary without either architecture absorbing, subordinating or redefining the other.
