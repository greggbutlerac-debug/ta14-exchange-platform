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

## Follow-up verification — October 17, 2026

- GitHub checks on commit `cfe167f78eb440c33d224130abf215cda08222a8`: **Verify application = success** and **Vercel Preview Comments = success**. These establish a passing application check, not technical approval.
- GitHub search for `diagnostic termination`, `NIRET threshold`, and TA14 Google Sites references did **not** establish the controlling diagnostic-termination wording or complete detailed NIRET decision criteria. No substitute language was introduced.
- Direct preview page, image, and PDF requests from the available external viewer were inaccessible to that viewer. This is **not** proof of a browser error or a passing rendering test; visual acceptance remains unverified.
- Release decision remains **HOLD**; do not merge until the governing Academy source is provided and the image/desktop/mobile review is recorded.

## User audio acceptance — October 18, 2026

- The owner reported that Samantha **finishes the narration** in the live preview on their device. This is user-reported successful end-to-end playback, not independent verification of all devices, voices, or accessibility modes.
- Eight per-image Play / Stop controls are implemented, and the application check on commit `2ad64510d04d0545bac59de44934d840614b2521` completed successfully.
- Audio implementation is **accepted for the user's tested browser/device**. Broader compatibility and interruption/resume behavior remain unverified.
- Audio acceptance does **not** clear the NIRET, diagnostic-termination, technical image, or release authorization gates. **HOLD remains.**

## Public-source cross-check — October 18, 2026

- Published [TA14 Academy HVAC blueprint](https://www.ta14exchange.com/academy/hvac/blueprint) states that the **current TA14 Academy NIRET** must govern invasive refrigerant entry, and expressly notes that the blueprint does **not** silently redefine the threshold. This confirms that the summary is not a substitute for the controlling criteria.
- Published [HVAC Academy schools description](https://www.ta14authority.org/academy/hvac/schools) corroborates baseline preservation, non-invasive threshold, declared diagnostic determination, bounded intervention, and post-intervention outcome comparison. It does not supply the complete operative threshold criteria.
- The user's published [NIRET discussion](https://www.linkedin.com/pulse/i-never-wanted-homeowner-have-trust-me-greggory-don-butler-5asre) further distinguishes the gate for pressure-side evidence gathering from refrigerant movement. This is relevant background, **not** a verified replacement for the Academy's current controlling source.
- Targeted searches of publicly indexed Google Sites pages did not recover an authoritative diagnostic-termination text or full NIRET rules. **Source release gate remains open**. Do not interpolate numerical conditions, declare an adopted termination rule, or infer approval.
- The preview URL is not accessible to the external text viewer. This does not negate the owner's successful audio playback; browser-level image and mobile validation remain separate unverified requirements.
