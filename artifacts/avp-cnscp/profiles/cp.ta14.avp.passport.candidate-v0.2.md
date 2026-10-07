# cp:ta14.avp.passport — Candidate v0.2

**Status:** LOCAL CANDIDATE / UNPUBLISHED / NON-RESOLVABLE  
**Target registry name:** `cp:ta14.avp.passport`  
**Controlling TA-14 object:** Authority Passport Protocol (AVP) v1.0.2

## Purpose

Define the bounded CNS/CP connection-layer projection used when a TA-14 Authority Passport is presented across an organizational boundary.

A Passport carries authority context. It does not carry the right to execute.

## Roles

- **Provider:** Authority Passport Presenter
- **Consumer:** Authority Passport Receiver

## Provider → Consumer properties

### `passport`
The Authority Passport as an opaque governed value. CNS/CP transports the value but does not interpret its internal TA-14 semantics.

### `passport_digest`
Integrity identity of the exact Passport value presented on the connection.

No AVP internal field is promoted into an independent Connection Profile property merely because it exists inside the Passport.

## Consumer → Provider properties

### `decision`
One of:

- `ACCEPT`
- `ACCEPT_NARROWED`
- `HOLD`
- `REJECT`

### `receipt`
Opaque signed PassportAcceptanceReceipt bound to the presented Passport digest and the returned decision.

### `narrowing_proof`
Conditional property. Present only for `ACCEPT_NARROWED`. Contains the actual NarrowingProof whose digest is bound by the signed receipt.

It MUST be absent for `ACCEPT`, `HOLD`, and `REJECT`.

## ACCEPT candidate serialization seam

Frozen AVP v1.0.2 requires a `narrowing_proof_digest` within PassportAcceptanceReceipt.

For ordinary `ACCEPT`, no NarrowingProof crosses this Connection Profile. Candidate v0.2 therefore binds a deterministic, integrity-protected **no-narrowing assertion** inside the receipt serialization. This assertion:

- is not a NarrowingProof;
- is not emitted as the `narrowing_proof` Connection Profile property;
- does not represent a fictitious narrowing event;
- exists only to make the frozen receipt binding unambiguous for an ACCEPT path.

**UNRESOLVED CANDIDATE SEAM:** this serialization rule remains proposed pending CNS/CP boundary and well-formedness review. It does not amend or reinterpret AVP v1.0.2.

## Negative space

This Connection Profile contains no property for:

- Local Constitution
- Local Lease
- Local Capsule
- Commit authorization
- Execution authorization
- Effect
- Closure

Absence is the mechanism. A successful bind, successful transport, valid digest, signed receipt, or ACCEPT decision does not establish local execution authority.

## Revocation and lifecycle

Passport revocation and connection revocation are distinct.

- **Passport revocation** is a TA-14 authority-context event carried through its separate governed channel.
- **Connection revocation** is CNS/CP connection policy and ends the governed exchange.
- Neither event silently implies the other.
- A renewed or superseding Passport is a new value of the `passport` property on the same connection when that connection remains valid; it is not inherently a new connection.

## Boundary invariant

`execution_authority = NOT_ESTABLISHED_BY_CP`

`local_execution_observed = false`

The Connection Profile ends at the governed crossing. Any later determination about consequence remains local.

## TA-14 consequence boundary

> Does this proposed consequence have sufficient **Admissible Evidence**, **Applicable Authority**, and **Established Standing** to become reality **NOW**?

**No admissible evidence. No admissible execution.**

CNS/CP governs the connection. AVP carries authority context. TA-14 governs admissible execution at the consequence boundary.

**Authority context may cross. Execution authority must be established locally.**

## Candidate review questions

1. Is the Connection Profile structurally well-formed?
2. Are `passport` + `passport_digest` and `decision` + `receipt` + conditional `narrowing_proof` correctly located at the connection layer?
3. Does any property or statement improperly reach below the connection boundary?
4. Are Passport revocation and connection revocation correctly separated?
5. Is the proposed ACCEPT no-narrowing receipt binding well-formed without creating a fictitious NarrowingProof?

## Claims boundary

This candidate is not registered. It makes no claim of CNS/CP publication, external conformance, interoperability, or execution authority.
