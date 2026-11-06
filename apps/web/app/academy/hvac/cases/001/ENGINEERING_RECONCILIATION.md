# TA14 Academy | Case 001 | Engineering reconciliation record

Status: **TECHNICAL REVIEW HOLD**. This is a simulated educational case, not a real field record or a released technician procedure.

## Controlling case narrative

- Complaint: residence does not cool adequately. A reported comfort problem is not itself a measured failure mode.
- Original state: heavily loaded return-air filter and concerning air-side measurements are investigated before any intervention. Preserve the original measurements and the operating context.
- NIRET: **HOLD / NO REFRIGERANT ENTRY** in this scenario. No refrigerant gauge readings may be attributed to this case unless the decision is formally re-examined, justified and separately authorized.
- Determination: a restricted return filter is an evidence-supported contributor to inadequate airflow. It is not proof that every possible defect is absent.
- Intervention: appropriately qualified and authorized technician replaces the filter within the approved scope and applicable safety requirements.
- Post-state: comparable air-side measurements support improvement, but do not by themselves prove design airflow, stable setpoint achievement, or complete system restoration.
- Disposition: **IMPROVED; RESTORED NOT ESTABLISHED**. Additional evidence may be required.

## Working simulated values (not independently validated)

The earlier v0.2 teaching discussion used a return-to-supply temperature difference of 13°F before and 18°F after, and total external static pressure of 0.92 in. w.c. before and 0.61 in. w.c. after. These are *illustrative working values*, not a verified equipment-specific diagnosis. Do not claim either value is universally normal or abnormal without the actual equipment data, measurement configuration, airflow assessment and operating conditions.

## Artwork conflicts requiring correction

- Images 08–10: depicted refrigerant pressures or gauge connections must not be described as measurements taken during this NIRET-HOLD case.
- Images 11–14: several before/after values and refrigerant measurements differ between images and from the working case narrative. Do not present them as a single consistent service record.
- Images 12–14: claims such as “all readings within manufacturer specifications,” “customer comfort restored,” and “case complete” exceed the presently reconciled evidence.
- Throughout: stock-like imagery and generated instrument displays are illustrations, not traceable raw instrument records. Samantha narration must never read invented display values as observed fact.

## Required source record before instructional release

1. Confirm the exact controlling 14-step Academy field sequence and current NIRET criteria from the governing document.
2. Define simulated equipment identity, manufacturer data, rated airflow, test points, instrument details, calibration assumptions, and safe operating procedure.
3. Record a single timestamped original-state dataset, including measured versus inferred quantities and any uncertainties.
4. Record the NIRET determination separately from actor standing and execution authorization.
5. Record approved intervention scope and safety constraints.
6. Capture post-intervention measurements at comparable test points, units, methods and conditions.
7. Reconcile all fourteen teaching images and Samantha scripts to that dataset.
8. Have a qualified HVAC reviewer verify technical claims before removing HOLD.

## Instructor prompt

Ask: “Why can the technician replace a loaded filter while refrigerant entry remains on HOLD?” Expected reasoning: the evidence and applicable authority for a bounded filter intervention are separate from the threshold and authorization for refrigerant-system access. Neither a diagnosis nor possession of tools creates permission.

Ask: “Does an improved temperature difference prove full restoration?” Answer: no; assess load, equipment specifications, actual airflow, stability, comfort conditions and comparability before making a restoration claim.

**Principle:** No admissible evidence. No admissible execution. Observed is not inferred. Inferred is not authorized.


## Consolidated candidate-artwork audit — Lessons 08–14 (2026-10-19)

**Scope:** Visual/textual review of candidate images generated during the Academy drafting conversation. These replacement candidates are **not repository assets**, are **not installed in the student-facing page**, and have **not received independent qualified HVAC sign-off**. Existing withheld artwork remains withheld. This is a preliminary editorial audit, not an instructional release decision.

| Lesson | Candidate finding | Remaining correction or release gate | Disposition |
| --- | --- | --- | --- |
| 08 — NIRET decision | Later candidate removes connected gauges and unsupported refrigerant identification; depicts documentation and non-refrigerant scope. | Check all small text and instrument imagery; clarify that each diagnostic test requires its own safety, scope and authority basis. | CANDIDATE / HOLD |
| 09 — Competing hypotheses | Loaded filter presented as supported *hypothesis*; duct, blower, coil, electrical and refrigerant-side alternatives remain unproven. | Verify no diagram implies other causes were ruled out or authorizes testing; keep refrigerant-side entry on HOLD. | CANDIDATE / HOLD |
| 10 — Diagnostic determination | Uses 13°F and 0.92 in. w.c. only as illustrative original-state values; no invented individual return/supply temperatures; intervention requires separate authorization. | Review any language implying measured airflow, equipment-specific limits, or complete diagnosis. | CANDIDATE / HOLD |
| 11 — Authorized intervention | Candidate corrects post-state total external static pressure to 0.61 in. w.c.; emphasizes separate standing and bounded filter replacement. | Ensure the illustrated checks are *scenario assumptions*, not verified credentials; don't claim design airflow or complete restoration. | CANDIDATE / HOLD |
| 12 — Post-intervention record | Candidate includes both 0.92→0.61 in. w.c. and 13→18°F; states comparability verification pending. | Some green/checklist copy still implies completed photos, notes, or evidence preservation not independently supported. Replace with illustrative/planned record labels; do not mark comparability verified. | REVISE / HOLD |
| 13 — Proof of performance | Candidate removes invented numerical OEM targets; applicable design/OEM criteria not established; retains NIRET HOLD and 'IMPROVED; RESTORED NOT ESTABLISHED'. | Check wording does not suggest admissibility or authority is already established for case closure. | CANDIDATE / HOLD |
| 14 — Final disposition | Candidate uses controlling values and correct bounded outcome; identifies unresolved comparability, OEM criteria, and refrigerant scope. | Remove any checked claims that photographs, conditions, calibration, complete evidence, or preservation were actually verified; differentiate *simulated narrative* from authenticated records. | REVISE / HOLD |

### Single-source evidence constraints for every candidate

- Illustrative original-state ΔT: **13°F**; post-intervention ΔT: **18°F**.
- Illustrative original-state total external static pressure: **0.92 in. w.c.**; post-intervention: **0.61 in. w.c.**
- No individual raw supply/return temperatures, refrigerant type, refrigerant pressures, superheat, subcooling, CFM, manufacturer performance target, or authenticated meter photographs are established.
- NIRET remains **HOLD / NO REFRIGERANT ENTRY** throughout the case.
- The filter intervention is a **bounded simulated authorized action**, not proof that an actual actor's credentials or standing were independently verified.
- Matching test conditions, instrument calibration, source provenance, full evidence continuity, and OEM/design performance compliance **have not been independently established**.
- Final case disposition is **IMPROVED (illustrative); RESTORED NOT ESTABLISHED**. Do not state full system restoration or case closure as a proven outcome.

### Integration and release gate

1. Correct Lessons 12 and 14 candidate artwork, preferably by removing dense generated microtext and using a controlled, editable HTML text overlay or SVG for evidence claims.
2. Inspect the actual final image files at readable resolution and perform a claim-by-claim comparison against this record.
3. Upload reviewed replacements under distinct filenames and reference them from `page.tsx` **only after** image review. Preserve the old images as withheld; never silently overwrite source evidence.
4. Verify rendering on desktop and mobile, Samantha alignment, and exercise consistency; run the Vercel preview build.
5. Keep the **TECHNICAL REVIEW HOLD** until a qualified HVAC reviewer confirms the case sequence, authority model, safety language, and technical content. Preview build success does not equal engineering approval.
