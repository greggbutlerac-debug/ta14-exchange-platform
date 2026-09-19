# TA-14 AVP × CNS/CP CP v0.1 — Executable Fixture Package

**Status:** TEST CANDIDATE — PRE-REGISTRATION  
**Controls:** TA14-AVP V1.0.2; AVP × CNS/CP Design Record v0.1; Test-Profile Schema Binding v0.1  
**Purpose:** Define deterministic fixtures that test the CNS/CP crossing without treating Connection success as execution authority.

## 1. Harness contract

Each fixture contains:

- `fixture_id`
- `avp_vector`
- `precondition`
- `provider_projection`
- `consumer_projection`
- `integrity_artifacts`
- `expected_avp_result`
- `forbidden_result`
- `evidence_to_preserve`

The harness SHALL separately report:

1. **CP transport result** — whether the Connection and Property exchange behaved as profiled.
2. **AVP governance result** — the receiving-domain AVP disposition.
3. **execution_authority** — always `NOT_ESTABLISHED_BY_CP`.

A CP PASS MUST NOT be rendered as an AVP ACCEPT, Local Lease, Local Capsule, Commit, Execution, or Effect.

## 2. Fixture matrix

| Fixture | AVP vector | Condition | Expected AVP result |
| --- | --- | --- | --- |
| CP-FX-001 | AV-005 | Valid presentation; receiver narrows authority | ACCEPT_NARROWED + valid NarrowingProof |
| CP-FX-002 | AV-021 | Cryptographically valid but stale Passport | SUSPEND / refresh required |
| CP-FX-003 | AV-007 | Revocation-channel gap exceeds declared bound | HOLD or QUARANTINE |
| CP-FX-004 | AV-004 | Child broadens target set | INHERITANCE_FAILURE |
| CP-FX-005 | AV-008 | Semantic mismatch in irreversibility stage | HOLD / ESCALATE |
| CP-FX-006 | AV-002 | Passport presented directly to effector | REJECTED / violation evidence |
| CP-FX-007 | AV-024 | FT5 relationship treated as execution authority | REJECT / violation evidence |
| CP-FX-008 | AV-013 | Closure responsibility omitted | SCHEMA_FAILURE |
| CP-FX-009 | AV-003 | Unknown mandatory extension | FAIL_CLOSED |
| CP-FX-010 | AV-006 | Revocation races local capsule issuance | REVOCATION_PRECEDENCE; no effect |
| CP-FX-011 | AV-014 | Receiver cannot resolve profile version | INDETERMINATE / HOLD |
| CP-FX-012 | AV-022 | Passport identity confused with principal identity | SEMANTIC_FAILURE |
| CP-FX-013 | Binding-specific | Malformed `avp-json-v1:` structured value | CP projection invalid; cannot ACCEPT |
| CP-FX-014 | Binding-specific | Projected receipt field differs from signed receipt | Integrity mismatch; cannot rely on projection |
| CP-FX-015 | Recovery rule | Changed condition after prior acceptance | Prior acceptance not reusable; re-establishment required |

## 3. Baseline fixture — CP-FX-001

### Intent

Prove that a valid CNS/CP exchange can carry a Passport presentation and a bounded receiving receipt while preserving the distinction between transport, acceptance and local effect authority.

### Precondition

- Provider and Consumer are bound under the test CP.
- Passport is structurally valid and current.
- Receiver determines that imported authority must be narrowed.
- A machine-verifiable NarrowingProof is produced.
- No Local Lease, Local Capsule, Commit, Execution or Effect occurs inside this fixture.

### Provider projection

The Provider supplies all required Passport Properties from the same signed Passport artifact. Structured values use the test binding's `avp-json-v1:` envelope.

Representative fixture values are derived from the AVP canonical skeleton:

- `passport_id = avp_pay_001`
- `freshness` decodes to status `CURRENT` and a next-required-by timestamp.
- `issuer` decodes to the issuer domain/id/key reference.
- `purpose` decodes to allowed supplier payment and forbidden cash advance.
- `delegation_envelope` decodes to bounded receiver/depth/fan-out rules.
- `authority_state` decodes to the source lease/route/expiry context.
- `consequence_budget` decodes to the bounded financial allocation.
- `irreversibility_position` decodes to PREPARE -> COMMIT.
- `jurisdiction` decodes to origin/destination constraints.
- `revocation` decodes to class/endpoint/latency/sequence.
- `proof_obligations` and `closure_responsibility` remain present.

### Consumer projection

The Consumer returns all twelve required PassportAcceptanceReceipt fields:

- `receipt_type`
- `passport_digest`
- `receiver_identity`
- `decision = ACCEPT_NARROWED`
- `narrowing_proof_digest` = digest of the actual NarrowingProof artifact
- `local_constitution_digest`
- `freshness_status = CURRENT`
- `revocation_sequence`
- `jurisdiction_profile`
- `limitations`
- `signer`
- `signature`

### Assertions

PASS only if:

- all mandatory CP Properties are present;
- Provider/Consumer source direction is correct;
- the Passport projection binds to the preserved signed Passport artifact;
- the receipt projection binds to the preserved signed receipt artifact;
- the NarrowingProof binds parent and child Passport digests and contains no broadened dimension;
- CP result and AVP result are reported separately;
- `execution_authority = NOT_ESTABLISHED_BY_CP`.

FAIL if the harness labels Connection success as execution permission.

## 4. Negative fixtures

### CP-FX-002 — stale Passport

Mutate only freshness from a current fixture to `STALE` while preserving cryptographic validity.

**Expected:** AV-021 `SUSPEND / refresh required`.  
**Forbidden:** ACCEPT solely because signature verification succeeds.

### CP-FX-003 — revocation gap

Make the receiver unable to confirm revocation freshness within the declared bound.

**Expected:** AV-007 `HOLD or QUARANTINE`.  
**Forbidden:** cached acceptance silently reused beyond the permitted freshness boundary.

### CP-FX-004 — broadening

Create a descendant whose target/scope is broader than the parent.

**Expected:** AV-004 `INHERITANCE_FAILURE`.  
**Forbidden:** normalization or transport-layer rewriting that hides the broadened dimension.

### CP-FX-005 — irreversibility mismatch

Present source and destination semantics that cannot establish safe equivalence/narrowing for irreversibility stage.

**Expected:** AV-008 `HOLD / ESCALATE`.  
**Forbidden:** default semantic translation.

### CP-FX-006 — direct-to-effector misuse

Route a Passport presentation as though possession were sufficient input to an effector.

**Expected:** AV-002 `REJECTED / violation evidence`.  
**Forbidden:** any protected effect.

### CP-FX-007 — trust-as-authority misuse

Set the relationship to the strongest federated trust posture and then attempt to treat that status as execution authority.

**Expected:** AV-024 `REJECT / violation evidence`.  
**Forbidden:** Local Lease/Local Capsule inferred from trust level.

### CP-FX-008 — closure responsibility omitted

Remove `closure_responsibility` from the Provider projection/artifact.

**Expected:** AV-013 `SCHEMA_FAILURE`.  
**Forbidden:** defaulting closure ownership.

### CP-FX-009 — unknown mandatory extension

Add an unknown mandatory extension whose semantics cannot be resolved.

**Expected:** AV-003 `FAIL_CLOSED`.  
**Forbidden:** ignoring the extension.

### CP-FX-010 — revocation race

Introduce revocation between acceptance and a simulated local capsule issuance boundary.

**Expected:** AV-006 `REVOCATION_PRECEDENCE; no effect`.  
**Forbidden:** progress because acceptance occurred first.

### CP-FX-011 — unresolved profile version

Make the receiver unable to resolve the required profile/version.

**Expected:** AV-014 `INDETERMINATE / HOLD`.  
**Forbidden:** nearest-version guessing.

### CP-FX-012 — identity confusion

Substitute Passport identity for principal identity or collapse issuer/receiver/local-effect identity classes.

**Expected:** AV-022 `SEMANTIC_FAILURE`.  
**Forbidden:** successful identity signature treated as proof of local effect authority.

### CP-FX-013 — malformed structured envelope

Corrupt the base64url or decoded JSON of one mandatory structured Property.

**Expected:** projection invalid; AVP ACCEPT prohibited.  
**Forbidden:** silent repair.

### CP-FX-014 — receipt integrity mismatch

Send a projected `decision` or other receipt field that differs from the corresponding integrity-bound field in the preserved signed receipt.

**Expected:** projection cannot be relied upon; fail closed.  
**Forbidden:** trusting the CNS/CP Property over the signed receipt.

### CP-FX-015 — changed condition after acceptance

Start from a previously accepted Passport and change a material present condition before a later protected threshold.

**Expected:** prior acceptance is not reusable; local re-establishment/revalidation required.  
**Forbidden:** treating persistent Connection state as continuing permission.

## 5. Evidence record

Each run SHALL preserve at minimum:

```json
{
  "fixture_id": "CP-FX-001",
  "cp_profile": "HOLD_UNTIL_REGISTERED_TEST_PROFILE",
  "cp_transport_result": "PASS|FAIL",
  "avp_vector": "AV-005",
  "avp_result": "ACCEPT_NARROWED",
  "passport_artifact_digest": "fixture-defined",
  "receipt_artifact_digest": "fixture-defined",
  "narrowing_proof_digest": "fixture-defined",
  "execution_authority": "NOT_ESTABLISHED_BY_CP",
  "local_execution_observed": false,
  "evidence_bundle": "fixture-defined",
  "notes": []
}
```

The exact digest strings are not populated until the fixture artifacts and digest profile are frozen. Placeholder values MUST NOT be presented as executed evidence.

## 6. Execution status

**LOCAL HARNESS EXECUTION IN PROGRESS.**

The local harness and preserved evidence records exercise this package under the reserved, non-resolvable `test` Top Level Prefix. This does not claim CNS/CP registry publication, globally resolvable registration, conformance, or interoperability.

## 7. Exit criteria

The package may advance from PRE-REGISTRATION only when:

1. a permitted local `test` profile is exercised, or a globally resolvable profile is registered beneath an allocated Top Level Prefix;
2. the no-narrowing receipt seam is resolved under AVP authority;
3. fixture serialization/digest/signature metadata is frozen;
4. the harness runs the fixtures without semantic rewriting;
5. actual outputs and preserved evidence bundles are committed;
6. expected versus observed results are compared;
7. failures are retained rather than silently corrected;
8. no CP PASS is reported as execution authority.

**Boundary:** Connection success proves only the bounded crossing tested. It does not prove admissible execution.
