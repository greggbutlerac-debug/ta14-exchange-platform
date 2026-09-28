# PENDING_REVIEW — Trane 4TTR4036L1 + TEM6A0C36H31+TDR governed OEM package (C1-R7)

Independent review recorded 2026-09-28T02:36:50Z: **PASS WITH EXPLICIT LIMITATIONS** (Atlas / OpenAI; result conveyed by the owner). The three source records are VERIFIED. The binding is held at PENDING_REVIEW. Nothing in this folder is loaded by the registry or pinned in `manifest.json`.
Transcriber: Claude Opus 5.5 (AI assistant) acting on instruction of greggbutlerac-debug.

| File | Canonical SHA-256 (record) | Source artifact SHA-256 |
|---|---|---|
| `NIRET-OEM-TRANE-4TTR4-IG-18-AC51D1-9.json` | `90e11bd5ca3bef41f03760a21f662eb92f910e8e3dae3cead291178e6d1adda3` | `568b190d5ffa6f010bd890b8f16404ff6e8d8a4bc4ecd79a4887320f1e8bc157` (18-AC51D1-9-EN) |
| `NIRET-OEM-TRANE-TEM6-IG-18-GF74D1-1F.json` | `20c87dd67e886ce2ee1336a1517b3d1765993db35ff227d91b025fa23cac1dc3` | `add434c1d08e5aacf74121e4df01cfb90940e657652cf7b14be156711a01a818` (18-GF74D1-1F-EN) |
| `NIRET-OEM-AHRI-7791584.json` (reference record) | `eb1f6057a57695f61627acf348404e303cf4236e6d9e0801d99b1e93ef274c3f` | `ff81495b38d7b559c2d0b7254225a7122c17c05681649c738be74c7141f82b15` (AHRI Certificate No. 134350330301305940, 2026-09-27; owner-held, not reproduced) |
| `NIRET-OEM-BIND-TRANE-4TTR4036L1-TEM6A0C36H31.binding.json` | `c4cc42823ba88b5a9f1f47868179194002e5c213681a81ece8c766ae9af8ec13` | — |

## Scope of the review

The reviewer attests that each record faithfully and exactly represents its hashed source, and that the binding maps each criterion to the correct source. The review does not establish field equipment identity. Complete nameplate → AHRI designation mapping and the realization of "+TDR" are NOT ESTABLISHED. So even after verification and pinning, every real field entry resolves to NO_RECORD (fail closed) until a Trane-issued identity artifact is registered.

## 1. Reviewer eligibility

- [ ] The reviewer is not the transcriber, not the owner acting as curator, and not a technician who will be evaluated against this package.
- [ ] Reviewer identity and review time are recorded on each source record and on the binding at completion.

## 2. Independently retrieve (the reviewer's own downloads; do not use the transcriber's copies)

- [ ] Trane 18-AC51D1-9-EN: https://www.trane.com/content/dam/Trane/Commercial/global/products-systems/equipment/unitary/split-systems/Small%20Splits/Air%20Conditioners/18-AC51D1-9-EN.pdf. File SHA-256 = `568b190d…c157`.
- [ ] Trane 18-GF74D1-1F-EN: https://www.trane.com/content/dam/Trane/Commercial/global/products-systems/equipment/unitary/split-systems/Small%20Splits/Air%20Handlers/18-GF74D1-1F-EN.pdf. File SHA-256 = `add434c1…a818`.
- [ ] AHRI directory (www.ahridirectory.org), reference 7791584: open the listing and obtain your own certificate for personal reference. A freshly issued certificate carries a new date and number, so its hash will differ; that is expected.
- [ ] AHRI "Verify Certificate": verify the owner's artifact using reference 7791584, issue date 09-27-2026 and certificate number 134350330301305940. Confirm AHRI reports it genuine.
- [ ] AHRI General Operations Manual (May 2025) §11.4.3, and AHRI USE Operations Manual (June 2026) §5.1 and §5.8. Confirm the texts relied on.

## 3. Verify: 4TTR4 record against 18-AC51D1-9-EN

- [ ] p.15 §14.1 STEP 1: "Subcooling (in cooling mode) is the only recommended method of charging above 55º F". The "Outdoor Temp" graphic shows ✗ above 120º F, ✓ between 55º F and 120º F, and ✗ below 55º F. Record: outdoorDryBulb 55–120 °F, as both a method condition and the ambient envelope.
- [ ] p.15 indoor 70–80 °F: the prose is "For best results … should"; the graphic shows ✓/✗; the source nowhere states that the procedure is invalid outside that range. Confirm it is recorded only as an OEM ADVISORY in the description and not as a condition.
- [ ] p.16 §14.2 STEP 3: "minimum of 20 minutes". Confirm the post-event text is verbatim ("At startup, or whenever charge is removed or added …").
- [ ] p.17 STEP 4: the liquid-line location is "at the outdoor unit's service valve".
- [ ] p.1: metering TXV/EEV; `specialToolOrModeRequired: false`; `noninvasiveCriterion: NOT_IN_DOCUMENT` (no approach, ΔT or superheat criterion published).
- [ ] Coverage and citations match the pages; no value appears that is not in the document.

## 4. Verify: TEM6 record against 18-GF74D1-1F-EN

- [ ] p.13 Table 6, 3-ton rows at 0.1 / 0.3 / 0.5 / 0.7 / 0.9 in. w.c.:
  - LOW 961 / 962 / 947 / 914 / 862
  - NORMAL 1092 / 1093 / 1082 / 1060 / 1026
  - HIGH 1231 / 1231 / 1221 / 1203 / 1175
- [ ] The DIP-switch patterns for each setting label are exact.
- [ ] The table convention "WET COIL, NO FILTER, NO HEATER" is preserved.
- [ ] `espTableDomain` is 0.1–0.9 and `designatedSetting` is null.
- [ ] No interpolated or derived airflow values appear.

## 5. Verify: AHRI reference record

- [ ] It contains only the reference metadata (reference number, certificate number, date, artifact hash, directory-record hash) and the relied-on propositions:
  - listed outdoor designation `4TTR4036L1`;
  - listed indoor designation `TEM6A0C36H31+TDR`;
  - present status DISCONTINUED, discontinued on 2024-12-30;
  - `certifiedAtObservation: false`.
- [ ] Ratings are not reproduced. 1065 scfm and R-410A are not attributed to the certificate.
- [ ] The "+TDR" enhancement meaning is attributed to USE OM §5.8, not to the certificate. The limitations state that the realization of +TDR and the nameplate mapping are NOT ESTABLISHED.
- [ ] No criteria are present.

## 6. Verify: binding

- [ ] `system` is {Trane, `TEM6A0C36H31+TDR`, `4TTR4036L1`}, exactly the AHRI designations.
- [ ] `pairingSources` is [AHRI record] only.
- [ ] The 4TTR4 record supplies chargingMethod, specialToolOrModeRequired, ambientEnvelope, minRunMinutes and measurementLocations.liquidLineTemp.
- [ ] The TEM6 record supplies fanPerformance and espTableDomain.
- [ ] `noninvasiveCriterionAbsence` is NOT_IN_BOUND_SOURCES.
- [ ] The constituent hashes equal the table above (recompute with canonical SHA-256).

## 7. Completion (reviewer; owner approves)

- [ ] Set review state, identity and time on each source record and on the binding.
- [ ] Recompute canonical hashes and update the binding's constituent hashes.
- [ ] Present to the owner. Pinning in `manifest.json` / `records.ts` is a separate, owner-approved change.
- [ ] Record any discrepancy as a finding against the record; do not correct it silently.

## Not in review scope (fail-closed propositions; do not attempt to resolve in review)

- **Complete nameplate → AHRI designation mapping: NOT ESTABLISHED.**
  - No first-party Trane rule exists.
  - 22-1907-1B-EN p.4 prints `TEM6A0C36H41SA`, contradicting `…H31S` on its own cover.
  - Required to close: a Trane-issued document or written statement listing the complete nameplate model numbers covered by AHRI designations `4TTR4036L1` and `TEM6A0C36H31` (reference 7791584), and stating what provides "+TDR".
- **+TDR realization: NOT ESTABLISHED.**
  - The TEM6 installer guide Table 3 documents a built-in cooling fan-off delay (DIP switches 5–6).
  - Trane does not link that feature to "+TDR"; no inference is drawn.

Supporting evidence (not constituents):
- Trane 22-1904-1M-EN `7323c52d…18f0` (4TTR4 product data; nomenclature p.5).
- Trane TEM6 product data: 22-1907-1B-EN `3df42a45…7828`, 1E `2efae267…6f67`, 1G `6ed0ce11…77e7`.
- Trane 22-1897-1D-EN `c407473a…6f20`, TEM3 product data `fb6747ad…e36c`, SNInstructions `7adf6869…ee69` (no nomenclature found).
- AHRI directory record JSON `9fba29fe…80cc`; General OM `27d9dc86…390b`; USE OM `6750f43a…c57d`.

## Already mechanically established (re-runnable; not a substitute for review)

- Canonical SHA-256 of each record and of the binding equals the table above (recomputed 2026-09-28).
- The binding's constituent hashes equal the records' canonical hashes.
- `registrationFindings` is empty for all three records. `bindingFindings` has no rejections and no conflicts.
- The transcriber's copies of the source PDFs hash to the recorded `document.sha256` values.
- Exact identity: the binding's `system` identifiers are AHRI designations, and the resolver uses exact equality (A7 ignores only case and whitespace; no prefix, truncation or alias matching). A nameplate entry such as `4TTR4036L1000A` or `TEM6A0C36H31SB` resolves to NO_RECORD.

## Requires a human independent reviewer

- Authenticity: an independent download of each Trane PDF, and AHRI "Verify Certificate" for the certificate.
- Fidelity: every transcribed value, citation, condition and location against the hashed pages (sections 3–6).
- Judgement: that the 70–80 °F item is advisory; that no criterion was inferred; that the AHRI record relies on nothing beyond the certificate's identity and status fields.

## Independent review result (2026-09-28T02:36:50Z)

- Reviewer: Atlas / OpenAI. Determination: PASS WITH EXPLICIT LIMITATIONS. The result was conveyed by the owner (greggbutlerac-debug).
- Supported by the review:
  - 4TTR4 charging-method transcription;
  - TEM6 airflow-table transcription;
  - 70–80 °F recorded as advisory only;
  - the AHRI 7791584 artifact identity and contents;
  - the historical combination 4TTR4036L1 + TEM6A0C36H31+TDR;
  - status Discontinued since 12-30-2024, never represented as current certification;
  - the certificate does not establish R-410A or 1065 CFM.
- Explicit limitations (NOT ESTABLISHED):
  1. nameplate → AHRI designation mapping;
  2. the Trane realization of +TDR.
- Not reported in the review result: an independent re-download and hash comparison of the Trane PDFs (section 2), and an AHRI "Verify Certificate" check.
- The binding stays PENDING_REVIEW. It is the object that would bind a field system, and the reviewer directed that it must not do so until identity is independently established.
