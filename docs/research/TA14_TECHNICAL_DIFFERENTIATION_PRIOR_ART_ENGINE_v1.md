# TA-14 Technical Differentiation & Prior-Art Engine v1.1

**Status:** OPEN RESEARCH RECORD — no novelty or patentability conclusion is self-awarded.

**Correction notice:** Earlier v1 analysis treated the public Chain of Eight as though it were the complete architecture. That was incomplete. This record is now governed by the canonical 24-link source `apps/web/lib/academy/ta14-24-link-canon.ts`. The Chain of Eight remains the parent route; the 24-link architecture is its higher-resolution decomposition and maturation.

## Canonical provenance

Canonical source states:

- Chain of Eight origin date: **2025-05-01**.
- Parent anchors: **Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit -> Execution -> Outcome**.
- The 24-link architecture is the subsequent higher-resolution decomposition of that already-existing parent route.

## Canonical 24-link TA-14 Admissible Execution Architecture

1. Admissible Reality
2. Record
3. Continuity
4. Evidence Governance
5. Admissible Evidence
6. Admissible Truth
7. Reliance
8. Authority
9. Legitimacy
10. Consequence Formation
11. Attachment / Assent
12. Binding Reality
13. Binding
14. Commit Reality
15. Commit
16. Execution Reality
17. Admissible Non-Occurrence
18. Prevented Consequence
19. Execution
20. Outcome Reality
21. Outcome
22. New Reality
23. Memory
24. Future Chain

## Governing research rule

Do not ask whether another system uses TA-14 vocabulary. Ask whether it discloses the same operative mechanism, the same material dependency, or an obvious equivalent. TA-14 does not claim ownership of words such as authority, admissibility, binding, commit, execution, outcome, provenance, authorization or audit. The research object is the **integrated consequence architecture and the operative relationships among its links**.

A component is not novel because TA-14 names it differently. A collection is not non-obvious merely because nobody used the same list. The burden is to determine whether the 24-link ordering/dependencies create technical behavior not already disclosed or predictably obtainable from known systems.

## Industrial-control comparator scope

Industrial-control systems are retained as a comparator class because they establish familiar component functions including external physical state acquisition, programmed evaluation, authentication/authorization, command/no-command control, physical effect and audit/history. Those capabilities do **not by themselves establish equivalence to the canonical 24-link TA-14 architecture**.

The industrial-control question is therefore not whether a mature building-control platform can perform control. It can. The question is whether a pre-TA-14 system discloses an equivalent consequence-governance dependency architecture across the 24 canonical TA-14 functions, or whether additional orchestration and semantics must be introduced.

## Established mechanisms TA-14 should NOT claim to have invented

Sensors/external-state acquisition; programmed conditional control; authentication/authorization/RBAC; Permit/Deny policy decisions; PDP/PEP separation; ongoing authorization and revocation; environmental/system conditions as authorization inputs; obligations/advice; audit/event histories; hashing/signatures/manifests; ordered workflows; authorized functionaries; provenance chains; generic fail-closed gates; generic command/no-command physical control.

## Comparator set

- **UCONABC (2004):** authorization, obligations, conditions, continuity/ongoing controls, mutability and revocation.
- **XACML 3.0:** PDP/PEP, Permit/Deny/Indeterminate/NotApplicable, conditions, obligations/advice and combining algorithms.
- **NIST SP 800-207 Zero Trust (2020):** policy engine/administrator/enforcement separation using supporting/current information to grant, deny or revoke.
- **in-toto (pre-TA-14):** signed ordered layouts, authorized functionaries, link metadata, materials/products/byproducts, verification and freshness/expiration.
- **Industrial/building-control architectures (pre-TA-14):** physical state acquisition, programmed control, authorization, protected operations, command/no-command and audit/history.

## Canonical 24-link comparator matrix — v1

Legend: **S** = substantial analogue established; **P** = partial/analogous; **N/E** = equivalent not established in reviewed material; **C** = known component but TA-14-specific relationship remains open.

| # | TA-14 canonical link | UCON | XACML | ZTA | in-toto | Industrial control | Current pressure finding |
|---:|---|:---:|:---:|:---:|:---:|:---:|---|
| 1 | Admissible Reality | P | P | P | N/E | P | External/current state is old; the additional claim that reality itself must obtain governed admissibility before consequence is not yet mapped as an equivalent mechanism. |
| 2 | Record | P | P | P | S | S/P | Records/logs/provenance are established. Weak standalone differentiation. |
| 3 | Continuity | S | P | S | P | P | Broad continuity novelty is defeated by UCON and pressured by ZTA. |
| 4 | Evidence Governance | P | P | P | S/P | Evidence/provenance governance exists; TA-14 must show a distinct runtime consequence role, not mere metadata management. |
| 5 | Admissible Evidence | P | P | P | P | N/E | Candidate distinction only if evidence can be authentic/integrity-valid yet lack proposition-specific consequence standing. |
| 6 | Admissible Truth | N/E | P | N/E | P | N/E | **High-interest link.** Reviewed comparators do not yet establish an equivalent governed transition from admissible evidence to bounded truth standing for consequence. |
| 7 | Reliance | P | P | P | P | N/E | Trust/reliance concepts exist broadly; TA-14 must show operative reliance standing rather than terminology. |
| 8 | Authority | S/P | S/P | S | P | S | Authorization/authority is established territory. No standalone novelty claim recommended. |
| 9 | Legitimacy | N/E | P | P | N/E | N/E | **High-interest link.** Need to establish whether legitimacy is technically distinct from authorization/policy validity and has independent execution consequences. |
| 10 | Consequence Formation | P | P | P | N/E | P | Control systems form consequences; TA-14's candidate delta is treating consequence formation as a governed pre-binding state. |
| 11 | Attachment / Assent | P | P | N/E | P | N/E | **Open.** Need canonical semantics and comparator mapping; avoid novelty assertion until defined mechanistically. |
| 12 | Binding Reality | N/E | P | N/E | N/E | P | **High-interest link.** Need to show this is not simply current-state validation or policy condition checking. |
| 13 | Binding | P | S/P | P | P | P | Generic binding/authorization-to-enforcement concepts are old; TA-14-specific evidence-to-consequence binding remains open. |
| 14 | Commit Reality | N/E | N/E | N/E | P | P | **High-interest link.** Current evidence does not establish an equivalent separately governed reality state immediately associated with consequence commitment. |
| 15 | Commit | P | P | P | P | S/P | Commit/transaction/command concepts are established; only its dependency position in the full chain is potentially differentiating. |
| 16 | Execution Reality | P | P | P | N/E | S | Current runtime/physical state is established; TA-14-specific separation from commit and execution remains open. |
| 17 | Admissible Non-Occurrence | N/E | N/E | N/E | N/E | N/E | **Very high-interest link.** An internal DENY does not itself prove external non-occurrence. Equivalent pre-TA-14 architecture not yet established. |
| 18 | Prevented Consequence | N/E | N/E | P | N/E | P | Prevention is old; separately evidencing the prevented consequence after admissible non-occurrence is not yet mapped as equivalent. |
| 19 | Execution | P | P | S | P | S | Execution/enforcement is established territory. No standalone novelty claim. |
| 20 | Outcome Reality | P | N/E | P | P | S/P | Observation/telemetry is old; separate outcome-reality standing before governed Outcome remains open. |
| 21 | Outcome | P | N/E | P | S/P | S | Outcomes/results/history are established; TA-14 closure semantics remain candidate differentiation. |
| 22 | New Reality | P | N/E | P | P | S/P | Systems update state after action; TA-14's recursive consequence-to-new-reality semantics must be shown, not merely named. |
| 23 | Memory | P | P | P | S | S | Preservation/history is established. No standalone novelty claim. |
| 24 | Future Chain | P | N/E | P | P | P | **Candidate compositional distinction:** prior outcome/new reality/memory becomes governed input to a subsequent consequence chain. Requires deeper workflow/control prior-art search. |

## Architectural differentiation hypothesis — corrected v3

> **TA-14 is a 24-link admissible-execution consequence architecture, derived from the May 1, 2025 Chain of Eight, in which reality/evidence are progressively governed into bounded truth and reliance standing; authority and legitimacy govern whether consequence may form and attach; binding reality/binding and commit reality/commit establish the consequence boundary; execution reality and admissible non-occurrence/prevented-consequence states govern whether execution may or may not bind with reality; and outcome reality/outcome produce new reality, memory and the conditions for a future chain.**

**STATUS: UNPROVEN ARCHITECTURAL DIFFERENTIATION HYPOTHESIS.**

The asserted distinction is the integrated dependency architecture, not ownership of any individual word or known component.

## Combination / obviousness challenge

The strongest technical attack is whether a skilled engineer, before TA-14, could predictably combine usage control + policy evaluation + PDP/PEP/Zero Trust + provenance systems + transactional/industrial control and arrive at the materially equivalent 24-link consequence architecture without inventive orchestration.

That question remains OPEN. A serious analysis must map not only all 24 functions but also the **dependencies between them** and the technical behavior created when a link fails, changes, or lacks standing.

## Required destructive tests — 24-link edition

1. **Full-link reduction test:** map every canonical link to each comparator and to the strongest combination of comparators.
2. **Dependency deletion test:** remove each link from TA-14 and record whether governed consequence behavior materially changes.
3. **Reordering test:** reorder high-interest links (5-18) and determine whether the same consequence semantics survive.
4. **Known-system composition test:** implement the closest usage-control + policy + provenance + enforcement composition without TA-14-specific orchestration and identify where it fails to reproduce the chain.
5. **Non-occurrence test:** distinguish command denial from admissible evidence that a prohibited consequence did not occur.
6. **Recursive-chain test:** test whether Outcome -> New Reality -> Memory -> Future Chain produces a governed successor-chain dependency not present in ordinary audit/history systems.
7. **Industrial-control 24-link challenge:** require an evidence-backed S/P/N-E mapping for all 24 links, not a vocabulary comparison.

## Patent-analysis boundary

This engineering record does not determine patent novelty, non-obviousness, infringement, validity or freedom to operate. Those require actual patent claims, filing/priority chain, jurisdiction, claim construction and legally cognizable prior art. A patent professional should review the final claim chart.

## Next work items

1. Retrieve the canonical definitions/semantics for all 24 links, not merely their names.
2. Build the dependency graph showing which links gate, invalidate or transform standing at adjacent links.
3. Run the industrial-control 24-link challenge against primary technical documentation.
4. Run the combined-obviousness mapping against UCON, XACML, ZTA and in-toto.
5. Establish earliest documentary support dates for the Chain of Eight and each later 24-link refinement.
6. Produce a claim-chart-ready record separating known element, known combination, surviving interaction and unsupported assertion.
