# TA-14 Final Evidence Determination — S3DVS Version 1.0

**Registry baseline:** TA-14-AIGR-000033  
**Control instrument:** TA14-S3DVS-R1R2-FREEZE-v0.1  
**Determination version:** v1.0  
**Closure state:** CLOSED — SUPPORTED WITH EXPLICIT SCOPE LIMITATIONS

## Final determinations

- **R1 — Protocol 10:** SUPPORTED — BOUNDED PASS
- **R2 — Protocols 1–9:** SUPPORTED — BOUNDED PASS
- **Overall governed demonstration:** SUPPORTED — WITH EXPLICIT SCOPE LIMITATIONS

## Evidence basis

The final R2 evidence set contains Protocols 1 through 9 under the non-overlapping S3DVS Version 1.0 configuration. The record preserves differentiated processor behavior across the declared address regions, including refusal of instruction access where not permitted, processor-specific data access restrictions, and rejection of the tested operations against undefined address 524.

R1 preserves the contrasting Protocol 10 full-overlap condition. Within that frozen simulator condition, the submitted execution record supports the bounded proposition that the tested address-1400 instruction operation becomes available when the declared category boundaries collapse.

## Scope boundary

This determination establishes only the observed behavior of the S3DVS Version 1.0 demonstrator under the frozen configurations and transactions examined. It does **not** establish universal unbypassability, absolute security, immunity to all attack classes, production ASIC/PCB behavior, regulatory certification, patent validity, or any proposition outside the frozen evidence boundary.

## Registry identity

The governed demonstration remains anchored exclusively to **TA-14-AIGR-000033**.

During the S3DVS evidence cycle, `TA-14-AIGR-000034` was referenced by the claimant before that identifier had been assigned and was therefore not recognized or adopted as an S3DVS identity by this determination. The identifier **TA-14-AIGR-000034 has since been independently issued to Elias Human Sovereignty Gateway (HSG) v1.0**. That later Registry issuance does not alter, supersede, or participate in the S3DVS governed demonstration. S3DVS Version 1.0 remains **TA-14-AIGR-000033**.

## Digest treatment

The following values are preserved as claimant-submitted integrity references:

- Finalized Record SHA-256 Digest: `ecc689fac46a6bd0bb775465286c054d1d7620c6ca472d9f324fa4361ee6abb2`
- Public Projection Digest: `99f84cec1c60d3ea8945d09dfdc2408d6044e0cecd7ce3c918c2eced7a445154`

TA-14 has not independently recomputed byte-level correspondence between these values and the exact final evidence object. They therefore are not incorporated into the behavioral finding as independently verified cryptographic conclusions.

## Governed sequence

**Registration → Technical Freeze → Execution → Evidence → Independent Determination → Closure**

The conclusion was not permitted to exist before the evidence.

**TA-14 FINAL STATE: SUPPORTED — BOUNDED PASS**
