# Evidence Before Intervention — technical release examination

Status: **HOLD — editorial/technical review outstanding**  
Scope: PR #607, eight-lesson showroom; not a replacement for the TA14 Academy HVAC field standard.

## Verified from repository

- The Academy blueprint `apps/web/app/academy/hvac/blueprint/page.tsx` explicitly provides the nine-stage chain: Sequence → Non-Invasive Evidence → NIRET → Refrigerant-Side Evidence (if justified) → Original-State HVAC Performance Record → Declared Diagnostic Determination → Evidence-Based Intervention → HVAC Post-Performance Record → Proof of Performance.
- The blueprint explicitly calls refrigerant entry before applicable NIRET, intervention before the original record is preserved, altered/backfilled baseline, omitted diagnostic determination, unsupported intervention, improvement asserted from post-state alone, and unsafe/unlawful action **critical failures**.
- The eight lesson pages in this showroom are a **teaching organization**, not eight stages replacing the nine Academy stages.
- The eight illustration PNGs and reference PDF are present in repository `apps/web/public`, with exact names referenced by the showroom.
- Samantha narration is displayed directly after each illustration and split into paragraphs. The page provides text; no speech playback should be claimed.
- Image disclaimers mark measurements, signatures, approvals, and outcomes as illustrative, not authenticated evidence.
- The page has `robots: {index:false, follow:false}` and remains in a draft PR, not merged to production.

## Outstanding gates — required before merging

1. **Controlling source — diagnostic termination**: obtain the exact Academy/Google Sites diagnostic-termination language, record its URL/version, and compare it with the showroom. Do not substitute HOLD, DENY, or ESCALATE as equivalents.
2. **Controlling source — NIRET details**: verify the full governing threshold criteria rather than inferring them from a general principle in the blueprint. Keep the distinction between evidentiary necessity and independent execution authorization.
3. **Technical image review**: assess all eight images for sequence, measurement context, safe electrical/refrigerant practices, fictional signatures/credentials, repair scope, comparative conditions, and overclaimed improvement. The on-page caution cannot automatically cure a materially misleading image.
4. **Rendered visual review**: independently check desktop/mobile legibility and that all eight PNGs and the PDF actually load from the preview; repository presence alone does not prove successful browser delivery.
5. **Independent technical validation**: qualified examiner records what was checked and disposition; no automatic approval from a passing code build.
6. **Explicit release decision**: retain draft status and publication HOLD until the recorded gates are satisfied.

## Current findings

- **Supported**: the central evidence-before-intervention teaching chain and major critical-failure language.
- **Qualified**: the illustrated field scenarios are examples, not admissible operational evidence, credentials, approved interventions, or independently validated outcomes.
- **Not established**: complete controlling diagnostic-termination text, exact applicable NIRET threshold details, completed technical image examination, independently verified rendered layout, or formal publication approval.

## Review boundary

This examination note is not a field credential, regulatory opinion, equipment diagnostic instruction, governing amendment, or release authorization. It preserves the independent technical-review questions so they cannot be silently treated as solved by CI.
