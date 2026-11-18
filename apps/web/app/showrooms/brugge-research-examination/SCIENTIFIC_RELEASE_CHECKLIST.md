# Brugge research examination — scientific release checklist

Status: **HOLD — internal review only**. Prepared 18 November 2026.

## Source-of-truth rules
1. The 11 publication-specific exhibit entries in the 28-page review PDF are review material, not a systematic review or independent statistical replication.
2. The twelve uploaded PNGs are **conceptual artwork**, not published scientific figures. Several contain inaccurate embedded text. The showroom's corrected body citations do not remove that text. Correct the actual PNGs before public release.
3. Dr. Douglas Brugge and coauthors have not authored, endorsed, partnered on, independently reviewed, approved or validated the TA-14 showroom or architecture merely by corresponding with TA-14.
4. Exhibit 12 is a distinct TA-14 proposal, not a conclusion from the 11 publications.
5. Do not invent figures, participant counts, effects, confidence intervals, journal titles or DOI identifiers; verify all nontrivial claims against originals.

## Consolidated asset inventory (18 November 2026)

The following twelve source-to-artwork links are currently wired into `page.tsx`. They are distinct exhibit slots, not twelve approved scientific figures. The PDF and two separate overview concepts are also retained in the repository.

| Exhibit | Current asset |
|---|---|
| 01 | Reducing Traffic Pollution Exposure.png |
| 02 | TA-14 Air Pollution Communication Exhibit.png |
| 03 | Two Communities, One Highway.png |
| 04 | CBPR Partnerships for Cleaner Roadways.png |
| 05 | Traffic Air Pollution Health Infographic.png |
| 06 | Particulate Policy_ Ultrafine Particle Exposure.png |
| 07 | Boston Chinatown Community Charrette Infographic.png |
| 08 | Communities Taking Action on Air Quality.png |
| 09 | HEPA Filtration and Blood Pressure Trial.png |
| 10 | HEPA Filtration and Cognitive Function.png |
| 11 | HEPA Filtration Study_ Inflammatory Marker Findings.png |
| 12 | From Research Evidence to Justified Action.png |

Companion PDF: `TA14_Brugge_Research_Examination_v4_Editorial_Corrected (2).pdf`.

Separate editorial overview concepts (not counted as exhibits): `TA-14 Air Pollution Accountability Exhibition-2.png`; `TA-14 Air Quality Evidence to Action-1.png`. Do not replace an exhibit with these or add them as additional numbered lessons by accident.

Image candidates superseded for this room should remain in the asset repository for now, but should **not** be reintroduced into the room: `Visualizing Air Quality in Chinatown.png`, `HEPA Purifiers and Blood Pressure Findings.png`, `HEPA Filtration and Inflammation Study.png`, `HEPA Filtration and Inflammatory Markers.png`.

Artwork and document release is still HOLD; the verified GitHub file references do not establish that captions, DOI strings or visualized statistics are accurate.

## Exhibit-by-exhibit image review
| # | Correct study/source | Artwork release check |
|---|---|---|
| 01 | 2015 *Environmental Justice*, DOI 10.1089/env.2015.0007 | Show planning/charrette options, not a controlled reduction trial; avoid performance claims for buffers/intakes/filtration without field evidence. |
| 02 | 2019 *Journal of Health Communication*, DOI 10.1080/10810730.2019.1597949 | Replace any wrong journal and DOI. A bilingual visual-communication evaluation is not measured health or pollution improvement. |
| 03 | 2020 *BMC Public Health*, DOI 10.1186/s12889-020-09751-w | Preserve the qualitative comparison of Somerville and Boston Chinatown, not causal exposure reduction. Review captions/maps for geographic accuracy. |
| 04 | 2020 *Environments*, DOI 10.3390/environments7060044 | 13 key-informant interviews. Participation/influence does not prove enacted policy or reduced pollution. |
| 05 | 2021 *INQUIRY*, DOI 10.1177/00469580211059290 | One focus group, four interviews, 74 anonymous surveys; do not claim a pre/post experiment or measured exposure reduction. Verify publication credits and avoid inventing a reproduction of the original infographic. |
| 06 | June 21, 2021 Metropolitan Area Planning Council report, Brugge & Sharon Ron, *Particulate Policy* | **Remove any invented journal name or DOI.** A policy argument does not prove enacted or effective regulation; stable institutional URL needs verification. |
| 07 | 2023 *Environmental Justice*, DOI 10.1089/env.2022.0001 | Replace incorrect DOI printed on image. A Boston Chinatown charrette yielded planning insights, not measured intervention outcomes. |
| 08 | 2024 *BMC Public Health*, DOI 10.1186/s12889-024-17864-9 | Replace incorrect DOI. Qualitative community-process work (24 interviews, observation of 10 meetings, records 2016–2021), not an intervention trial. Review/remove unsupported quantitative chart values. |
| 09 | 2025 *JACC*, DOI 10.1016/j.jacc.2025.06.037 | **Critical:** comparison was HEPA vs sham, not HEPA vs no purifier. Of 154 analyzed participants, baseline systolic BP ≥120 mm Hg subgroup had HEPA change −2.8 and sham +0.2 mm Hg, between-condition contrast 3.0 mm Hg (p=.04). Do not print 3.3 as the source estimate, invent absolute BP baselines, or imply overall significant benefit. No significant diastolic benefit. Full methods/results/CI still to verify. |
| 10 | 2026 *Scientific Reports*, DOI 10.1038/s41598-026-48063-8 | Overall cognition comparison nonsignificant among 119 analyzed participants. Age ≥40 Trail Making Test B subgroup signal is secondary; do not show invented effect-size graphs or claim all users benefited. |
| 11 | 2026 online / 2027 volume *American Journal of Preventive Cardiology*, DOI 10.1016/j.ajpc.2026.101775 | **Critical:** no overall IL-1β difference among 116. High-visceral-adiposity subgroup (n=12) showed a reported **IL-1β reduction**, **not a reduction in visceral fat**. Replace wrong DOI and biomedical endpoint labels; check multiple comparison handling. |
| 12 | Separate proposed TA-14 governance framework | Label **PROPOSED TA-14 SYSTEM — NOT TESTED IN CITED STUDIES**. No suggestion of Brugge validation/endorsement; validate the runtime/execution claims independently. |

## PDF correction
- The uploaded review master `TA14_Brugge_Research_Examination_v4_Editorial_Corrected (2).pdf` has duplicate `scripts` on page 27 in the Evidence Status paragraph. Fix in a revised PDF, then point showroom at the revised asset.
- Source controls still pending: DOI landing pages; all complete coauthor lists (particularly 2025 JACC); 2021 MAPC stable link; clinical methods/tables/intervals/prespecification and multiplicity; community contributor attribution preferences.

## Web / release verification
- [ ] Confirm each image file path and the PDF path return 200 on preview, including spaces, underscores, parentheses.
- [ ] Ensure Samantha playback beneath every one of twelve images works on target browsers; accurately describe fallback behavior if no Samantha voice is installed.
- [ ] Check responsive layout and keyboard controls.
- [ ] Run typecheck, tests and production build. Recheck checks after final revisions.
- [ ] Keep the page out of public showroom index and `noindex` while HOLD.
- [ ] Remove HOLD only after a fresh, dated scientific fact check of image pixels, narration, text and PDF; then separately decide about public registration/merge.

This is an **editorial review checklist**; it does not certify correctness or source reproduction.
