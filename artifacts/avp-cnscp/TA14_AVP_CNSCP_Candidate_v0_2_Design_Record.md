# TA-14 AVP × CNS/CP Candidate v0.2 — Design Record

**Status:** CANDIDATE / PRE-REGISTRY / LOCAL EXAMINATION COMPLETE  
**Target Connection Profile:** `cp:ta14.avp.passport`  
**Controlling TA-14 object:** Authority Passport Protocol (AVP) v1.0.2  
**Date:** 2026-09-26

## 1. Governing proposition

A TA-14 Authority Passport may cross an organizational boundary as authority context through a governed CNS/CP connection.

**A Passport carries authority context. It does not carry the right to execute.**

CNS/CP governs the connection and named crossing properties. AVP governs the Authority Passport object. TA-14 separately governs admissible execution at the consequence boundary.

## 2. Connection-layer projection

### Provider → Consumer

- `passport` — opaque Authority Passport value
- `passport_digest` — integrity identity of the exact Passport presented

The Passport remains opaque to CNS/CP. Purpose, scope, delegation, consequence budget, expiry, lineage and other AVP semantics are not promoted into independent Connection Profile properties.

### Consumer → Provider

- `decision` — ACCEPT | ACCEPT_NARROWED | HOLD | REJECT
- `receipt` — opaque signed PassportAcceptanceReceipt
- `narrowing_proof` — conditional; present only for ACCEPT_NARROWED

## 3. Negative space

There is no Connection Profile property for Local Constitution, Local Lease, Local Capsule, Commit authorization, Execution authorization, Effect or Closure.

Their absence is architectural. Successful connection, transport, digest verification, receipt verification or ACCEPT does not establish local execution authority.

## 4. Receipt paths

### ACCEPT_NARROWED

A real NarrowingProof crosses. The signed receipt binds the digest of that proof.

### ACCEPT

No NarrowingProof crosses.

Frozen AVP v1.0.2 requires `narrowing_proof_digest` in PassportAcceptanceReceipt. Candidate v0.2 therefore uses a deterministic integrity-protected no-narrowing assertion inside receipt serialization.

That assertion is not a NarrowingProof, does not cross as `narrowing_proof`, and does not manufacture a narrowing event.

**UNRESOLVED CANDIDATE SEAM:** CNS/CP boundary/well-formedness review is still required for this ACCEPT serialization. Local validation does not settle that question and this design record does not amend or reinterpret AVP v1.0.2.

## 5. Lifecycle and revocation

Passport revocation and connection revocation remain independent.

- Passport revocation is a TA-14 authority-context event carried through its separate governed channel.
- Connection revocation is CNS/CP connection policy and ends the governed exchange.
- Neither silently implies the other.
- A renewed or superseding Passport is a new value of the Passport property on the same valid connection; it is not inherently a new connection.

## 6. Hard boundary

**THE CONNECTION ENDS HERE. EXECUTION AUTHORITY DOES NOT CROSS.**

Invariant:

`execution_authority = NOT_ESTABLISHED_BY_CP`

`local_execution_observed = false`

## 7. TA-14 consequence determination

> Does this proposed consequence have sufficient **Admissible Evidence**, **Applicable Authority**, and **Established Standing** to become reality **NOW**?

**No admissible evidence. No admissible execution.**

**Authority context may cross. Execution authority must be established locally.**

## 8. Candidate local examination

Executable harness:

`artifacts/avp-cnscp/harness/avp_cnscp_candidate_v0_2_harness.mjs`

Evidence:

`artifacts/avp-cnscp/harness/evidence/CANDIDATE_V0_2_LOCAL_VALIDATION_2026-09-26.json`

Result:

- 16 fixtures examined
- 16/16 matched expected outcomes
- 0 expectation failures
- valid ACCEPT_NARROWED path supported locally
- candidate ACCEPT/no-narrowing binding supported locally
- tampered Passport digest failed closed
- tampered receipt failed closed
- missing/mismatched NarrowingProof failed closed
- fake no-narrowing binding failed closed
- extraneous NarrowingProof on ACCEPT failed closed
- invalid decision failed closed
- receipt/Passport binding mismatch failed closed
- execution-authority invariant preserved in every fixture
- no local execution observed

The examination is **LOCAL EXERCISE ONLY**. It is not CNS/CP registry publication, external conformance, interoperability or execution authority.

## 9. External boundary review

The bounded questions are:

1. Is the Connection Profile structurally well-formed?
2. Are `passport` + `passport_digest` and `decision` + `receipt` + conditional `narrowing_proof` correctly located at the connection layer?
3. Does any property or statement improperly reach below the connection boundary?
4. Are Passport revocation and connection revocation correctly separated?
5. Is the proposed ACCEPT no-narrowing receipt binding well-formed without creating a fictitious NarrowingProof?

This review does not delegate TA-14/AVP semantics, Admissible Evidence, Applicable Authority, Established Standing or consequence determination.

## 10. Reconciliation state

The following candidate surfaces now express the same architecture:

- Candidate Connection Profile v0.2
- Candidate executable harness v0.2
- Candidate local validation evidence
- TA-14 Exchange candidate showroom
- This design record

The earlier v0.1 design record, unpublished test profile, harness and evidence remain preserved as audit history.

## 11. Claims boundary

**NOT REGISTERED.**

No CNS/CP publication, registry, external conformance or interoperability claim is made by this candidate package.
