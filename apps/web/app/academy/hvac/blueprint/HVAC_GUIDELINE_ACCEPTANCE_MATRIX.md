# TA14 HVAC Service Guideline — Technical Acceptance Matrix
**Draft examination plan · 2026-10-19 · PR #619 · HOLD**

**Scope.** This is a prospective review and test specification for the *proposed* revised HVAC diagnostic/service-process guideline, not a record of passed physical tests or of ASHRAE/NIST approval. The original 39-page September 30, 2026 NIST-delivered guideline remains historical evidence and is not overwritten. Preserve the original TA14 Academy Blueprint v0.2 images and Samantha playback.

**Disposition vocabulary.** PASS means independently examined against identified governing sources and recorded test output. FAIL means a demonstrated contradictory result. HOLD means necessary source, implementation, or qualified review is missing. NOT APPLICABLE requires a documented reason. No item in this matrix presently has a qualified PASS.

## A. Textual and authority gates

| ID | Requirement to examine | Acceptance evidence | Current disposition |
|---|---|---|---|
| T-01 | Historical original remains distinct from proposed revision | Original filename, 39-page attachment, sent-email provenance, original seven §5.2 stages and revision/change ledger preserved | HOLD — source versioning package not issued |
| T-02 | Seven-stage service process and nine-anchor Academy chain do not silently contradict each other | Reviewed crosswalk specifying *normative seven-stage sequence* vs *educational nine-anchor presentation*, and exact treatment of HPR Part A / NIRET / Part B | HOLD — proposed mapping only |
| T-03 | Applicable current Academy NIRET threshold is authenticated | Source URL/file, controlling version, date, author/authority, complete decision criteria and applicability; no inferred numerical defaults | HOLD — complete field rule unavailable |
| T-04 | Intrusive inspection vs refrigerant entry boundary is resolved | Written determination how original guideline §7's broader intrusion gate relates to later refrigerant-specific NIRET and safety/OEM requirements | HOLD — technical review required |
| T-05 | Diagnostic classification and *diagnostic termination* remain separate | Verbatim current controlling termination rule, version and worked examples of supported diagnosis, indeterminate state, refusal of refrigerant entry, and service-call closure | HOLD — controlling termination text unavailable |
| T-06 | Applicable Authority and Established Standing are explicit | Actor, capacity, standing basis, authority relationship, site/customer permission, qualification, bounded proposed consequence and time | HOLD — proposed new language not approved |
| T-07 | ALLOW, binding, commit and execution are separate | Versioned specification and executable evidence showing approval without execution, time-of-use revalidation and blocked attempts | HOLD — no end-to-end enforcement evidence attached |
| T-08 | Raw original and post-state records are independent | Technical review of provenance, timestamp, methods, measurement points, conditions, separately stored before/after and any adjustment rationale | HOLD — prospective test |
| T-09 | Seven outcome labels have defensible criteria | Independent definitions and decision examples for IMPROVED, RESTORED, UNCHANGED, DEGRADED, PARTIALLY RESOLVED, UNRESOLVED, INDETERMINATE | HOLD — proposed taxonomy not validated |
| T-10 | Protective action and hazards are governed without unsafe delay | Qualified HVAC/safety review showing immediate lawful protective acts are possible, with loss of original testability recorded and post-action revalidation where relevant | HOLD — qualified review required |
| T-11 | All visuals correspond to evidence boundaries | Image-by-image technical signoff for current Academy original illustrations; fictional numbers/signatures distinguished from field evidence | HOLD — Academy visual review missing |
| T-12 | Institutional characterization is accurate | Wording says practitioner-originated proposed guideline; ASHRAE/NIST correspondence is receipt/technical dialogue, not adoption, certification or endorsement | HOLD — final package editorial approval pending |

## B. Proposed test cases — no operational test claimed

| Case | Precondition / scenario | Expected bounded result | Required evidence artifact |
|---|---|---|---|
| E-01 | System has complaint but contemporaneous non-invasive original-state readings are missing | Do not infer a baseline or authorize non-protective intervention from reconstructed numbers | Immutable or otherwise traceable source record, decision receipt, denial/hold rationale |
| E-02 | Threshold appears satisfied from fixed reading count, but operating state or airflow is unstable | Threshold remains unresolved under actual controlling NIRET criteria; no premature refrigerant entry | Raw readings, stability context, gate decision and source/version |
| E-03 | Non-invasive findings support one class of concern but contradict a suggested refrigerant diagnosis | Preserve contradiction and avoid treating inference as refrigerant entry authority | Competing evidence and decision rationale |
| E-04 | NIRET evidentiary necessity is supported but actor lacks standing or permission | HOLD/ESCALATE/DENY as grounded by governing disposition; physical access blocked on governed path | Actor/authority/standing receipt and enforcement event |
| E-05 | Technician has permission to observe refrigerant side, then attempts adjustment or charging | Separate intervention authority required; previously granted observation does not authorize adjustment | Named-action scope, precommit validation, blocked action |
| E-06 | Valid initial ALLOW followed by changed equipment condition before commit | Revalidate affected evidence and authority gates; old ALLOW cannot silently execute | Original receipt, change event, re-examination and actual execution result |
| E-07 | Refrigerant entry is DENIED, but safe non-invasive diagnostics remain justified | Denial applies to named action; do not silently close the entire service call | Distinct consequence decisions and later service path |
| E-08 | Technician makes urgent safety shutdown before complete baseline is captured | Follow applicable safety and legal procedure; document original evidence that survives and lost testability, never reconstruct measurements | Hazard/safety record and qualified reviewer decision |
| E-09 | Post-work numbers improved but before/after operating conditions differ materially | Do not claim verified improvement without supported comparability; preserve raw and separately reasoned adjustments | Before/after source records, adjustment method, reviewer outcome |
| E-10 | Governance UI displays HOLD but actuator/API still executes `STOP_AHU_7` | FAIL any claim of enforced execution authority for that path; characterize as advisory unless actually blocked | Independent physical/simulated actuator event record with timestamp |

**Pass conditions.** A technical assessor must supply identifiable test fixture/version, execution instructions, expected/actual outcome, provenance and limitations. If there is no real actuator or simulation harness, mark the relevant case **NOT TESTED/HOLD** rather than attributing enforcement to a concept demo. A UI-only response cannot prove physical execution blocking.

## C. Academy teaching review — preserve the preferred original room

1. Confirm all existing Academy illustrations remain ordered and technically consistent with governing text, including distinctions among first non-invasive evidence, NIRET, permitted refrigerant-side evidence and original-state record.
2. Verify Samantha's narration for **each existing Academy image** from the actual browser (not from code presence alone); check start, stop, full completion, and small-screen legibility.
3. Mark any illustration with gauges, pressure, charging, cleaning, opened cabinets, signatures, measurements or success values as *illustrative* where they do not represent authentic field records; correct misleading sequences rather than relying entirely on a generic disclaimer.
4. Keep the public Academy page at `/academy/hvac/blueprint` unchanged until the source, safety and technical reviewers sign off. Do not merge the separate eight-image PR #607 as a replacement.

## D. Evidence register and next approval

| Artifact | Source | Status |
|---|---|---|
| Original 39-page sent guideline | [September 30 NIST email](https://mail.google.com/mail/u/?authuser=ta14admissibleexecution%40gmail.com#all/1a0f33adc54c428c) and `Guideline for HVAC Diagnostic and Service Process (1).pdf` | Historical original; sent |
| Original text comparison | `GUIDELINE_FULL_TEXT_FINDINGS.md` | Editorial review, not engineering signoff |
| Proposed vNext document | `HVAC_SERVICE_PROCESS_PROPOSAL_VNEXT_WORKING_DRAFT.md` | Draft / unapproved |
| Consolidation source record | `GUIDELINE_CONSOLIDATION_REVIEW.md` | Draft examination |
| Actual source for Academy NIRET/termination | Not yet authenticated as complete current field standard | **Missing: HOLD** |
| Physical enforcement tests and HVAC review | Not attached | **Missing: HOLD** |
| ASHRAE TC 7.5 follow-up | [October 17 outreach](https://mail.google.com/mail/u/?authuser=greggbutlerac%40gmail.com#all/1a14aa69abb86526) | Sent; not an adoption request or technical acceptance |

**Release rule:** The current technical disposition is **HOLD**. Passing GitHub build checks verifies source/build integrity only. It cannot resolve HVAC correctness, Academy source authority, actual field controls or institutional endorsement. Only a later documented acceptance decision can authorize merging substantive standard changes or sending a revised external proposal.
