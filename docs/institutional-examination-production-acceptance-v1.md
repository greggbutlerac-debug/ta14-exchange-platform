# TA-14 Institutional Examination Production Acceptance Protocol v1.0

Status: CONTROLLED OPERATIONAL TEST PROTOCOL

## Purpose

This protocol defines the minimum end-to-end acceptance test required before the TA-14 Exchange institutional examination path may be represented as operationally proven in production.

A successful application build or deployment is not sufficient evidence of this chain.

## Chain under examination

Registered governance -> bounded examination -> sealed run receipt -> evidence admission review -> institutional finding -> cryptographic seal -> authenticated admission -> governed-artifact persistence -> append-only chronology -> controlled retrieval.

## Acceptance rule

The production path is accepted only when every required positive control passes and every required negative control refuses progression at the intended boundary. A partial run is not a production acceptance pass.

## Required positive controls

1. A valid examination run produces a sealed receipt with a verifiable canonical digest.
2. The institutional review surface accepts a valid receipt only after receipt verification.
3. Evidence references receive explicit admission dispositions.
4. A bounded institutional finding can be issued from the verified receipt and reviewed evidence state.
5. The issued finding receives a cryptographic seal whose canonical digest independently verifies.
6. An authenticated institutional session can submit the sealed finding to the authoritative admission endpoint.
7. The server independently re-verifies the finding seal before persistence.
8. Successful admission creates exactly one governed-artifact record of type `INSTITUTIONAL_EXAMINATION_FINDING`.
9. Successful admission creates the corresponding first institutional chronology event.
10. The admitted record is retrievable through the authenticated controlled finding viewer and controlled findings index.
11. The retrieved record preserves the registered governance identity, bounded proposition, determination, limitations, admitted evidence references, finding digest, receipt binding, and chronology.

## Required negative controls

1. Tampered receipt digest -> review progression refused.
2. Finding created from an unverified receipt -> issuance refused.
3. Finding with no evidence references where evidence is required -> issuance refused.
4. Tampered sealed finding -> authoritative admission refused with no governed-artifact record created.
5. Missing authenticated institutional session -> authoritative admission refused.
6. Missing record ID, governance Registry ID, governance name, or sealed finding -> admission refused.
7. Duplicate immutable institutional record ID -> overwrite refused.
8. Chronology insertion failure -> newly created governed-artifact record must not remain admitted.
9. Unauthenticated controlled-record retrieval -> refused.
10. Controlled institutional finding -> must not become publicly exposed merely because authoritative persistence succeeded.

## Evidence to preserve

For the acceptance run preserve:

- production deployment/commit identity;
- registered governance Registry ID and version used for the test;
- bounded examination proposition;
- sealed examination receipt and digest;
- evidence admission dispositions;
- sealed institutional finding and digest;
- institutional record identifier;
- authoritative persistence result;
- chronology event key and timestamp;
- controlled retrieval result;
- each negative-control request and refusal result;
- operator identity and test timestamp.

Secrets, session tokens, service-role credentials, and non-public evidence contents must not be placed in the acceptance artifact.

## Determination grammar

`PASS` — all required positive and negative controls were demonstrated and preserved.

`FAIL` — one or more required controls produced behavior contrary to the protocol.

`INCOMPLETE` — the full protocol was not executed or required evidence was not preserved.

## Representation boundary

Until a production run satisfies this protocol, TA-14 may accurately state that the institutional examination architecture is implemented and deployed, but must not represent the complete end-to-end institutional examination path as production acceptance proven.

A PASS establishes only the behavior demonstrated by the frozen production version and bounded protocol. It is not certification of a registered governance architecture, regulatory approval, legal sufficiency, or proof that all possible bypass routes are absent.
