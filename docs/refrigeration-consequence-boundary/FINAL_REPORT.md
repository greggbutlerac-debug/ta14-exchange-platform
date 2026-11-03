# Refrigeration Consequence Boundary: final report (Phase 8)

**Date:** 2026-11-03 · **Repository:** `greggbutlerac-debug/ta14-exchange-platform` · **Branch:** `feat/refrigeration-consequence-boundary` (from `origin/main` `04b58e0c`; worktree `~/ta14-refrigeration-boundary`) · **Deployment:** none. **Not pushed, not published.**

> Everything below is software verification of a **simulation**. Nothing here validates a physical refrigeration system.

## Files created (no existing file modified)

| Area | Files |
|---|---|
| Audit and documentation | `docs/refrigeration-consequence-boundary/AUDIT.md`, `README.md`, `IMAGE_SPECIFICATIONS.md`, `FINAL_REPORT.md` |
| Simulation | `apps/web/lib/refrigeration-boundary/{baseline,canonical,plant,ein,eir,verify,gate,scenarios,export}.ts` |
| Showroom (unlisted) | `apps/web/app/showrooms/refrigeration-consequence-boundary/{page.tsx,lessons.ts,LessonViewer.tsx,AdversarialDemo.tsx,DriftChart.tsx}` |
| Evidence exports | `apps/web/public/showrooms/refrigeration-consequence-boundary/evidence/S1–S8.json`, `summary.json` (2.7 MB) |
| Technical examination | `docs/refrigeration-consequence-boundary/TA-14_Refrigeration_Consequence_Boundary_Technical_Examination_v1.{html,pdf}` (14 pages), plus a copy in the showroom's `public` folder |
| Tests and generators | `tests/acceptance/refrigeration-consequence-boundary.spec.ts`; `scripts/refrigeration-boundary/export-evidence.spec.ts`, `build-report.spec.tsx` (gated, skipped by default) |

The production GCEA engine is used unchanged; a test asserts it equals `origin/main`. No existing route, component, sitemap entry or showroom index was changed.

## Results by scenario (computed from the runs)

| Scenario | Claim verdicts |
|---|---|
| S1 unauthorized defrost via AEA | PREVENTION PASS · NO_FALSE_ALERT PASS · EVIDENCE_PRESERVATION PASS |
| S2 defrost bypassing AEA | **PREVENTION FAIL** · DETECTION PASS (10 min) · NO_FABRICATED_AUTHORIZATION PASS · ATTRIBUTION_NOT_ASSERTED PASS · EVIDENCE PASS |
| S3 setpoint change (bypass) | **PREVENTION FAIL** · DETECTION PASS (35 min) · NO_FABRICATED_AUTHORIZATION PASS · EVIDENCE PASS |
| S4 falsified controller reports | DETECTION PASS · DETECTION_INDEPENDENT_OF_CONTROLLER_REPORTS PASS · EVIDENCE PASS |
| S5 suppressed controller alarm | DETECTION PASS · ALERT_INDEPENDENT_OF_CONTROLLER_ALARM PASS · EVIDENCE PASS |
| S6 independent sensor failure | **DETECTION FAIL** · EVIDENCE_GAP_DISCLOSED PASS · NO_EXECUTION_WITHOUT_ADMISSIBLE_EVIDENCE PASS · EVIDENCE PASS |
| S7 expired authorization replay | PREVENTION PASS · NO_FALSE_ALERT PASS · EVIDENCE PASS |
| S8 authorized recovery | ROUTINE_COMMAND_HELD_DURING_INCIDENT · RUNTIME_REVALIDATION · RECOVERY_AUTHORIZED · POST_INTERVENTION_VERIFICATION · EVIDENCE, all PASS |

Totals: **27 PASS, 3 FAIL, 0 NOT DEMONSTRATED.** The failures are reported as failures.

## Validation (Phase 8)

| # | Check | Command or method | Result |
|---|---|---|---|
| 1 | Automated tests | `npx vitest run` | 23 files: **223 passed, 3 skipped, 0 failed**. The 3 skipped are this work's gated generator scripts. The new suite has 33 tests, all passing |
| 1 | Type check | `npx tsc --noEmit` | 0 errors |
| 1 | Production build | `npx next build apps/web` | Succeeded; 895 static pages; showroom prerendered static |
| 2 | Interactive demonstration | Local `next start`; desktop screenshot reviewed; browser verifier logic tested with WebCrypto in the suite | Renders; verification logic passes. **The click-through of the VERIFY button and the file upload was not exercised in a browser** |
| 3 | Exported evidence records | Suite: committed exports equal a fresh run; all eight chains verify (Node and WebCrypto); five tamper types detected | PASS |
| 4 | PDF contents | Text extracted with pypdf (all 12 sections, title, simulation label, corrected test counts); pages 1 and 8 rendered and reviewed | PASS |
| 5 | Navigation and responsive layout | Desktop 1440 px screenshot; true 390 px render (iframe) | No horizontal page overflow at 390 px. The image slot's minimum height was raised after the phone render showed it scrolling internally |
| 6 | Samantha controls | Headless Chrome: `speechSynthesis` present but **0 voices** (expected in headless mode); macOS has the Samantha voice installed | **Audio playback NOT verified.** Controls render. The page tells visitors when speech is unavailable |
| 7 | Existing routes | Local server with fake localhost Supabase values | `/`, `/showrooms`, `/showrooms/onuma`, `/showrooms/environmental-atmospheric`, `/examinations/stop-the-cyber-attack`, `/eight24-hvacdr/curriculum/01`, `/sitemap.xml`, `/robots.txt`: 200 |
| 8 | Credential and private-info scan | grep across all 30 changed or new text files, plus PDF text | No keys, tokens, private paths or personal email |
| 9 | Unlisted and access | Sitemap and `/showrooms` index do not mention the route; page metadata is `noindex, nofollow, nocache` | Unlisted. **Not access-controlled:** anyone with the URL could view it once deployed |
| 10 | Publication | — | Not published; awaiting Greggory's approval |

Environment note: the site's middleware returns 500 on every route unless the Supabase variables are set. Local previews used fake `localhost` values; no credentials were used. `/governance-showcase` still returned 500 locally ("Supabase environment variables are not configured"); this work does not touch that page.

## Showroom preview URL

None: not deployed. The local route is `/showrooms/refrigeration-consequence-boundary`.

## Remaining limitations

- Simulation only: the thermal model is illustrative and its parameters unmeasured. Real controllers, protocols, networks and attackers were not tested.
- EIN and EIR are simulations, not the EIE implementation. The actor-standing and parameter-bounds checks around GCEA are simulation additions.
- Detection depends on sensors that are genuinely independent. Compromise of the probes, loggers or recorder was not modelled.
- S6 design tension: with independent evidence lost, correction was held, the controller's untrusted alarm fired, and the product kept warming. An emergency path is needed and is not modelled.
- Records are hash-chained but unsigned, with no trusted time-stamp.
- **The eight teaching images are not produced.** Specified slots are shown instead (`IMAGE_SPECIFICATIONS.md`).
- Narration audio is unverified. The interactive VERIFY button and upload were not clicked through in a browser.
- Thresholds are configured, not food-safety limits. Product disposition is outside TA-14.

## Decisions required

1. **Origin wording.** The showroom and PDF say the examination "responds to a refrigeration cybersecurity challenge raised by Kimon Onuma, as described to the TA-14 team", and that no named party has reviewed or endorsed it. The PDF names ONUMA, Keith Gipson and Asset Leadership Network only in that non-endorsement sentence. No source text for the challenge exists in the repository. Please confirm or change this wording, and decide whether those names should appear at all.
2. **Access.** Unlisted with `noindex` is not access control. Should the route instead be owner-gated (like `/admin/*`) before any deployment?
3. **Images.** Who produces the eight images from `IMAGE_SPECIFICATIONS.md`?
4. **Emergency path (S6).** Should TA-14 define a separately authorized emergency procedure for acting without admissible evidence?
5. **Publication:** approval to push, open a PR and deploy.
