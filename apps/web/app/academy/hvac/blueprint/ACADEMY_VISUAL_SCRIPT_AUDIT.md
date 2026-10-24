# TA14 Academy Evidence Before Intervention — visual and narration source audit
**2026-10-19 · PR #619 · Code/content inspection only · HOLD**

**Object examined:** `apps/web/app/academy/hvac/blueprint/page.tsx` on `main` and its `SamanthaNarration.tsx` companion. This inspection reviews **the names, ordering, captions, lesson guides and scripted narration** in the published-page source. It is **not a visual inspection of the original PNG pixels** and does **not** verify sound playback on a real browser. Preserve the existing Academy images and audio implementation pending user-directed improvements.

## Structural findings

- The teaching collection contains **11** numbered images, **00–10**, *not eight*. These include an overview image 00, nine subject steps 01–09, and a closing sequence image 10. Do not confuse **11 images**, **nine proof-chain anchors**, and the **seven original guideline service stages**.
- `teachingImages.map(...)` generates one `SamanthaNarration` control and one `lessonGuide` for each image. Static sources contain **11 image entries**, **11 guide entries** and **11 script entries** (alignment requires runtime verification as part of QA).
- The instructional image collection uses original `/public/*.png` names; no replacements are proposed by this audit. The public Academy experience remains the preferred version, while PR #607 is a separate, unpublished draft.

## Exact current image-to-lesson index

| Image | Teaching title | Source asset | Script review priority |
|---|---|---|---|
| 00 | Evidence Before Intervention | `/HVAC Evidence-First Service Sequence Poster (1).png` | Ensure summary doesn't imply every service action is prohibited before all measurements where immediate safety is involved. |
| 01 | Sequence | `/HVAC Sequence_ Evidence Before Intervention.png` | Narration expressly protects necessary immediate safety actions; preserve this. |
| 02 | Original-State Baseline | `/Original-State HVAC Baseline Infographic.png` | Check any displayed readings for units, context and illustrative status. |
| 03 | NIRET | `/HVAC NIRET Decision Flow Infographic.png` | Confirm the image contains no invented universal numerical threshold and never equates evidence for entry with authorization. |
| 04 | Refrigerant-Side Evidence — if justified | `/Refrigerant-Side HVAC Evidence Baseline.png` | Illustrate conditional authorized observation, not a routine gauge step or authority for charging/adjustment. |
| 05 | Original-State Established | `/Original-State HVAC Performance Record.png` | Verify raw and inferred values distinguishable; no reconstructed baseline or falsely completed record. |
| 06 | Declared Diagnostic Determination | `/HVAC Evidence-Based Diagnostic Workflow (1).png` | **Highest wording priority:** a DDD is not automatic diagnostic termination, service closure or action permission. |
| 07 | Evidence-Based Intervention | `/Evidence-Based HVAC Intervention Workflow.png` | Verify applicable authority **and** established standing, bounded scope, current conditions and separate commit. |
| 08 | HVAC Post-Performance Record | `/HVAC Post-Performance Record Infographic.png` | Post-observations are not outcome proof on their own; retain raw observations distinct from adjustments. |
| 09 | Proof of Performance | `/HVAC Proof of Performance Workflow.png` | Script lists five outcome labels while proposed vNext draft lists seven; **do not change until controlling definitions are sourced**. |
| 10 | Complete Governed Sequence | `/Complete HVAC Evidence-to-Outcome Sequence.png` | Check visually for missing evidence, standing, binding, commit or revalidation steps and clarify any condensed diagrams. |

## Script findings grounded in page source

**V-01 — Script/lesson association appears internally coherent (source-level).** Current array mapping uses the same `index` for `samanthaScripts[index]` and `lessonGuides[index]`; ordering of source image labels matches narration topics. The scripts discuss safety precedence, original-state evidence, optional refrigerant entry, diagnosis vs authority, bounded intervention and before/after comparison. **Acceptance remains pending playback and imagery inspection.**

**V-02 — Diagnostic termination boundary incomplete.** Lesson 06 describes a DDD as a bounded, supported finding, while no authenticated current Academy examination-stop conditions were established in the reviewed source. Proposed educational clarification: a supported DDD cannot itself authorize ending investigation or closing a service call. **Exact normative stopping criteria remain [U]**; do not guess.

**V-03 — Entry vs adjustment.** Lesson 03 explicitly states NIRET does not itself supply permission/safety; lesson 04 discusses pressure/saturation/superheat/subcooling as conditional observations. Verify that visual 03→04 depicts entry/observation, not refrigerant charging/repair, and add explicitly scoped explanation after qualified approval if necessary.

**V-04 — Standing and Commit.** Lesson 06 references both applicable authority and established standing; lesson 07 addresses scope and changing conditions, but its main script does not establish a separately named ALLOW-versus-Commit test. This is an appropriate **candidate** to clarify after normative governance review, without asserting the original 39-page guideline already contained it.

**V-05 — Outcome taxonomy difference.** Lesson 09 guide and narration present IMPROVED, RESTORED, UNCHANGED, DEGRADED, UNRESOLVED; the newer working draft additionally proposes PARTIALLY RESOLVED and INDETERMINATE. Keep five as current *script source*, seven as *proposed* pending control. Do not silently harmonize or claim a current seven-label Academy standard.

**V-06 — Technically illustrative records.** The source cannot verify whether PNG visual text uses invented pressure, temperature, credentials, signatures, approvals, or performance gains. Every original image requires direct inspection with the exact rendered PNG before a claim of visual technical acceptance.

**V-07 — Existing Samantha player has a known platform limitation.** It uses browser `speechSynthesis` with a device-dependent voice preference for a voice named Samantha, then US-English/English fallback. Code presence does **not** imply identical narration voice, reliable long-utterance playback or audible success on all devices. Run an actual-browser acceptance for all 11 scripts, including full completion, stop/resume sequence and mobile handling; no audio regression changes are currently authorized.

## Visual inspection checklist for image-level review

For **each** numbered PNG inspect: (1) safety and sequence; (2) distinction between field observation, inference and authority; (3) units, dates, system state, illustrative vs recorded evidence; (4) mechanical/refrigerant/electrical depictions; (5) readability at mobile size; (6) consistency with Samantha's adjacent script; (7) whether the image proves a different claim than its caption; (8) no unsupported NIST/ASHRAE branding or certification language.

**Acceptance markers:** source-label/text alignment = **PRELIMINARY**; image pixels = **NOT INSPECTED**; browser audio = **NOT RETESTED**; technical field review = **HOLD**. A GitHub build success cannot close these gaps.

## Suggested next authorized changes

1. Retrieve/view all 11 original Academy PNG images at full resolution and record pixel-level findings, rather than infer content from filenames.
2. Once exact current Academy diagnostic-termination and NIRET rules are authenticated, author **targeted** script and caption corrections where necessary. Preserve favored visual style and illustrations.
3. Submit proposed edit diff to owner/qualified examiner. Make changes to the existing Academy page **only on draft branch** and verify build/real browsing before discussing release.

**Disposition: HOLD — substantive script audit complete; visual pixels and qualified technical approval still outstanding.**
