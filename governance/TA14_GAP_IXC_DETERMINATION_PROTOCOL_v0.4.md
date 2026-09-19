# TA-14 GAP-IXC Determination Protocol

**Instrument ID:** TA14-GAP-IXC-DP-001  
**Version:** 0.4 — CAR-E Candidate  
**Status:** NOT ADOPTED / ADVERSARIAL REVIEW REQUIRED  
**Issued by:** TA-14 Authority

## 1. Purpose
This protocol defines a reproducible, proposition-addressable method for bounded assurance without collapsing materially different evidence states into one scalar level.

This candidate does not replace L0-L7 and does not create an issued assurance finding until it passes CAR-E review and a separate adoption event.

## 2. Governing object and pre-evidence freeze
No GAP-IXC determination attaches to an architecture in the abstract. The minimum addressable object is:

**Architecture identity → version → proposition → evidence set → assessment time**

Before evidentiary determination begins, freeze: proposition ID; material sub-propositions; architecture/version/build; route/environment; scope/exclusions; execution boundary; consequence boundary/observation window; dimension criteria; evidence-admission rules; required output schema.

After evidence review begins, narrowing, decomposition, exclusion, route restriction, consequence-boundary change, or other material reframing may not improve the frozen proposition. A materially reframed claim becomes a new proposition with a new determination identity. The original proposition and result remain preserved.

## 3. Six dimensions
**G — Governance-Basis Support:** Has an attributable governance basis been established for the system to perform the declared bounded function within the declared domain and purpose? G does not establish moral legitimacy, legal sufficiency, regulatory approval, endorsement, or universal standing.

**A — Authority Standing:** Has current, bounded authority for the specific consequential action been established from an attributable source?

**P — Proposition Support:** Does the admitted evidence establish the factual proposition relied upon for the governed determination?

**I — Implementation Support:** Does admitted evidence establish that the claimed control exists in the identified implementation/version?

**X — Execution Support:** Does admitted evidence establish what occurred at the identified governed execution boundary for the frozen case?

**C — Consequence Support:** Does admitted evidence establish formation or non-formation of the specifically identified downstream consequence within the declared observation boundary?

## 4. Determination grammar
Each applicable dimension receives exactly one state:

- **ESTABLISHED** — admitted frozen evidence satisfies every mandatory criterion for the bounded proposition.
- **PARTIALLY ESTABLISHED** — available only when material sub-propositions were frozen before evidence review began, at least one is ESTABLISHED, and at least one other material frozen sub-proposition is UNESTABLISHED or INDETERMINATE. It is not a discretionary midpoint.
- **UNESTABLISHED** — admitted evidence does not establish the proposition within scope. This does not establish the opposite proposition.
- **INDETERMINATE** — admitted evidence is materially conflicting, inaccessible, ambiguous, integrity-compromised, or otherwise incapable of resolving the proposition.
- **NOT APPLICABLE** — the dimension is outside the frozen proposition. N/A requires an applicability rationale and may not be used because evidence is missing.

Missing evidence defaults to UNESTABLISHED unless an actual indeterminate condition prevents a defensible determination.

## 5. Evidentiary standing qualifier
A GAP-IXC state must never travel alone.

Every state must carry an explicit **evidentiary standing qualifier** identifying the basis on which the state was reached. At minimum, one or more of the following must be declared where applicable:

- **REGISTRANT-EVIDENCE BASIS**
- **TA-14-EVIDENCE BASIS**
- **INDEPENDENTLY PRODUCED BASIS**
- **INDEPENDENTLY REPRODUCED BASIS**
- **PUBLIC-SOURCE BASIS**
- **CROSS-PARTY BASIS**
- **NOT INDEPENDENTLY ESTABLISHED**
- **NOT SUBMITTED**
- **NOT PRESERVED**
- **OUTSIDE REVIEW SCOPE**

A favorable state based solely on registrant-produced evidence must not be rendered or exported in a form that visually or semantically implies independent reproduction.

Example:

**P: ESTABLISHED — REGISTRANT-EVIDENCE BASIS — INDEPENDENT REPRODUCTION NOT PERFORMED**

is materially different from:

**P: ESTABLISHED — INDEPENDENTLY REPRODUCED BASIS**

The determination state expresses what the admitted record establishes for the frozen proposition. The standing qualifier expresses whose evidence or reproduction supports that determination and where independence terminates.

## 6. Evidence admission gate
No evidence item may contribute to ESTABLISHED or PARTIALLY ESTABLISHED unless the record identifies the evidence object, provenance, proposition/sub-proposition supported, temporal relevance, integrity state where material, scope/applicability, conflicts/limitations, and evidence class.

Evidence existence is not evidence admission. Evidence admission is not proof. The assessor must state why an admitted item is capable of supporting the proposition.

### 6.1 Derived-evidence lineage
For transformed, summarized, calculated, normalized, aggregated, AI-generated/interpreted, converted, extracted, or otherwise derived evidence, preserve where applicable: source IDs; transformation method; tool/model/software identity/version; parameters/configuration; operator/process identity; transformation time; output ID/integrity binding; known information loss, uncertainty, or non-reversibility.

Missing material lineage prevents the derived object from independently establishing the claim.

### 6.2 Material contradiction rule
ESTABLISHED is prohibited while admitted evidence contains an unresolved material contradiction relevant to a mandatory criterion. Post-evidence exclusion may not manufacture a favorable state.

Where material contradiction remains unresolved, use INDETERMINATE unless the frozen proposition can be answered UNESTABLISHED without resolving the conflict.

## 7. Mandatory qualifiers
Every dimension determination must preserve: architecture identity; version/build/commit; exact frozen proposition/stable ID; frozen sub-propositions where applicable; scope/exclusions; admitted evidence IDs; provenance and lineage; evidentiary standing qualifier; determination time; validity/observation window; revalidation trigger; unresolved conditions/contradictions; assessor identity/role; independence boundary; criterion-by-criterion disposition.

Provenance, time, scope, and independence are qualifiers, not additional assurance dimensions.

## 8. Minimum establishment criteria
### G — ESTABLISHED requires
identified governance-basis source; attributable issuer/origin; declared purpose/function; domain/jurisdiction where material; admitted evidence that the basis applies to the frozen system/function; current/effective status or bounded historical-status proposition; explicit non-claims where broader legitimacy is not established.

### A — ESTABLISHED requires
identified authority source; authority holder/executable authority path; bounded action/consequence; delegation/derivation where applicable; current validity at decision time; no admitted disqualifying revocation, expiration, scope excess, or unresolved substitution.

### P — ESTABLISHED requires
exact factual proposition; admitted evidence capable of supporting it; temporal relevance; provenance; material conflicts resolved/bounded under frozen rules; no missing mandatory evidence concealed by inference.

### I — ESTABLISHED requires
identified implementation/version; claimed control; inspectable admitted evidence binding control to implementation; evidence sufficient for the implementation proposition; material alternate-path limitations stated.

### X — ESTABLISHED requires
exact execution proposition; frozen target/version/environment; identified input/trigger/challenge; execution boundary; contemporaneous or cryptographically bound execution evidence; resulting determination/action; evidence binding result to frozen case.

### C — ESTABLISHED requires
exact consequence proposition; downstream consequence boundary; observation method capable of detecting claimed formation/non-formation; observation window; evidence binding observed result to frozen case; material alternate-route/bypass conditions addressed or explicitly bounded under pre-evidence freeze.

## 9. No cross-dimension inheritance
No favorable state automatically establishes another dimension. G does not establish A; A does not establish P; P does not establish I; I does not establish X; X does not establish C; C does not retrospectively establish upstream dimensions.

## 10. Temporal rule
Every state is time-bounded. Revalidation triggers include material changes to implementation/configuration, authority, governance basis, evidence, proposition, environment/route, evidence integrity, observation window, or discovered bypass/alternate consequence path.

Historical validity for a frozen target does not create current standing for a changed target.

## 11. Independent reproducibility test
Before adoption, at least two reviewers must independently assess the same frozen packet using the same question set without private drafting context.

Compare dimension-by-dimension:
- **R0 — MATCH**
- **R1 — QUALIFICATION DIVERGENCE**
- **R2 — STATE DIVERGENCE**
- **R3 — BOUNDARY DIVERGENCE**
- **R4 — HIDDEN-CONTEXT DEPENDENCY**

R2-R4 block adoption of the affected rubric until corrected/retested. R1 requires review if the qualification could materially change reliance. Disagreement is not resolved by averaging, majority vote, or selecting the favorable answer.

## 12. Qualification portability
A material limitation and evidentiary standing qualifier must travel with the state they qualify across UI, API, export, summary, index, registry card, badge, receipt, and public finding.

A portable determination must include at minimum:

**dimension + state + proposition ID + target/version + evidentiary standing qualifier + material qualification + evidence-record reference + independence boundary**

A UI may not display a favorable GAP-IXC state as a standalone checkmark, badge, color, or shorthand if the omitted qualifier could strengthen the apparent claim.

## 13. No architecture-wide PASS
GAP-IXC does not issue an undifferentiated architecture-wide PASS. A favorable state for one proposition must not be generalized to an architecture, version, domain, or consequence class.

## 14. Recursion and institutional boundary
TA-14 may apply this protocol to TA-14 records. TA-14 application of a TA-14 protocol does not independently establish TA-14's own independence, legal authority, moral legitimacy, regulatory authority, or universal governance standing. Where independent verification terminates, that boundary must remain visible.

## 15. Historical non-conversion rule
Historical findings are not silently re-scored under GAP-IXC. A later GAP-IXC assessment is a new, separately identified interpretive/assurance record tied to the frozen historical evidence and does not rewrite the original finding.

## 16. CAR-E pre-adoption gates
This candidate must not be adopted until: all six dimensions survive overlap/authority-laundering review; establishment criteria survive adversarial counterexamples; pre-evidence freeze prevents scope laundering; PARTIAL and INDETERMINATE are reproducible; evidence admission/lineage/contradictions are reproducible; evidentiary standing qualifiers survive portability testing; at least two independent-read assessments are performed on the same packet; no unresolved R2-R4 remains; at least one TA-14 self-record and one external architecture record are tested; historical L0-L7 records are not silently reinterpreted; migration/non-migration rules are documented.

## 17. Current status
**CAR-E CANDIDATE ONLY. NOT AN ISSUED TA-14 ASSURANCE STANDARD.**

Illustrative GAP-IXC tables produced during design exploration are model probes only and must not be represented as issued findings.

**Core rule:** No dimension may claim a higher state of assurance than the admitted evidence establishes for the exact frozen proposition, and no favorable state may be displayed without its evidentiary standing.