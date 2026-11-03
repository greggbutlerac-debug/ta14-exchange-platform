# Refrigeration Consequence Boundary: final report (revision 1.1)

**Date:** 2026-11-03 · **Repository:** `greggbutlerac-debug/ta14-exchange-platform` · **Branch:** `feat/refrigeration-consequence-boundary` (from `origin/main` `04b58e0c`) · **Deployment:** none.

> Everything below is software verification of a **simulation**. Nothing here validates a physical refrigeration system.

## What changed in revision 1.1

1. **Origin statement.** The materials now present an *independent TA-14 technical examination*. All attribution to, and mention of, named external parties is removed from the showroom, PDF and documentation.
2. **S6 preserved.** S6 stays a documented failure: detection FAIL, and the corrective action is held without admissible evidence. GCEA is unchanged (tested against `origin/main`). The S1–S8 evidence exports are byte-identical to revision 1.0.
3. **Emergency-response pathway** (`apps/web/lib/refrigeration-boundary/emergency.ts`):
   - **E0 emergency notification:** no equipment effect.
   - **E1 protective measures:** `RESTORE_SEALED_SETPOINT`, `TERMINATE_ACTIVE_DEFROST` and `RE_ENABLE_CONTROLLER_ALARM`. They take no parameters, only re-assert sealed-baseline values, and require all of:
     - a pre-issued GCEA authority scoped to the emergency route and the specific measure;
     - emergency-responder standing;
     - independent evidence lost for at least 15 minutes, **computed from the EIN record**;
     - one use per measure per incident;
     - revalidation at execution, including the emergency condition;
     - ordinary re-authorization afterwards.
   - **E2 consequential commands:** never available on the emergency path.
   - The evidence for E1 is the recorded, continuous determination that state cannot be established. GCEA receives it honestly.
4. **Extension scenario E1** (S6 conditions plus the emergency protocol). Verdicts:
   - EMERGENCY_PROTECTIVE_MEASURE_EXECUTED: PASS
   - EMERGENCY_EFFECT_LIMITED_TO_SEALED_BASELINE: PASS
   - ORDINARY_GOVERNANCE_STILL_HOLDS: PASS
   - DETECTION: NOT DEMONSTRATED
   - OUTCOME_VERIFIED_BY_INDEPENDENT_EVIDENCE: NOT DEMONSTRATED
   - EVIDENCE_PRESERVATION: PASS
5. **Adversarial tests:** 22 tests, all passing, showing that emergency provisions cannot bypass ordinary governance (section 4 below).
6. **Real-browser check** (`scripts/refrigeration-boundary/browser-check.mjs`). It found and led to fixes for two phone-width overflows: footer links that could not wrap, and an unbreakable reason code in the demonstration timeline.

## Files changed in revision 1.1 (against `c9ea8c04`)

| Status | File |
|---|---|
| Added | `apps/web/lib/refrigeration-boundary/emergency.ts` |
| Modified | `apps/web/lib/refrigeration-boundary/scenarios.ts`: optional `emergency` hook (unused by S1–S8), `EXTENSION_SCENARIOS` with E1, four new claim evaluators |
| Added | `tests/acceptance/refrigeration-emergency-pathway.spec.ts` (28 tests) |
| Modified | `tests/acceptance/refrigeration-consequence-boundary.spec.ts`: the export check also covers E1 |
| Modified | `apps/web/app/showrooms/refrigeration-consequence-boundary/page.tsx`: origin statement, emergency-pathway section, E1 in the demonstration, wrapping footer, `overflowWrap: anywhere` |
| Modified | `apps/web/app/showrooms/refrigeration-consequence-boundary/AdversarialDemo.tsx`: shows emergency steps in the corrective-action panel |
| Modified | `apps/web/app/showrooms/refrigeration-consequence-boundary/lessons.ts`: lesson 07 explanation references E1 and S6's preserved failure |
| Added | `apps/web/public/showrooms/refrigeration-consequence-boundary/evidence/E1.json` |
| Modified | `.../evidence/summary.json` (E1 added). **S1–S8.json unchanged** |
| Modified | `scripts/refrigeration-boundary/export-evidence.spec.ts`, `build-report.spec.tsx`: E1 and section 9A, origin statement, test counts |
| Added | `scripts/refrigeration-boundary/browser-check.mjs` |
| Modified | `docs/refrigeration-consequence-boundary/{AUDIT.md, README.md, FINAL_REPORT.md}`; PDF and HTML regenerated (`IMAGE_SPECIFICATIONS.md` regenerated, unchanged) (16 pages), PDF copy in `public` |

## Test results (exact)

| Run | Result |
|---|---|
| `npx vitest run` (full repository) | **24 files: 251 passed, 3 skipped, 0 failed.** The 3 skipped are this work's gated generator scripts |
| `tests/acceptance/refrigeration-consequence-boundary.spec.ts` | 33 passed |
| `tests/acceptance/refrigeration-emergency-pathway.spec.ts` | 28 passed (22 adversarial) |
| `npx tsc --noEmit` | 0 errors |
| `npx next build apps/web` | Succeeded; 895 static pages; showroom prerendered static |
| `node scripts/refrigeration-boundary/browser-check.mjs` (headless Chrome via DevTools protocol, local `next start`) | **Exit 0, no failures, no console errors** (details below) |

### Real-browser verification (headless Chrome 2026-11, local production build)

| Control | Observed |
|---|---|
| Lesson NEXT / PREVIOUS / numbered jump | 01 → 02 → 01 → 08; NEXT disabled on 08; URL hash `#lesson-08` |
| EXPLAIN | `aria-expanded="true"`; explanation items shown |
| Image slot | "Teaching image 08 not yet produced"; production specification expands |
| Autoplay toggle | Toggles |
| Scenario tabs | S1–S8 and E1 present; E1 shows emergency steps and its six claim badges |
| In-browser verification (S2) | "VALID · 591 entries recomputed with WebCrypto" |
| Download | Real download saved `TA-14-RCB-S2-incident-record-SIMULATION.json` to disk |
| Upload, untouched | "VALID (591 entries)" |
| Upload, tampered (entry 40 altered) | "INVALID · ENTRY_HASH_MISMATCH@40" |
| PDF link | HTTP 200 |
| 390 px layout | `scrollWidth` 378 = client width; no overflowing element or text |
| Console | No errors or exceptions |

## Adversarial emergency tests (all pass)

| Attempt | Result |
|---|---|
| Emergency route while independent evidence is available | DENY |
| Evidence loss not yet sustained | HOLD |
| Actor without standing, even holding a stolen grant | DENY |
| Responder whose standing is revoked | DENY |
| Defrost, setpoint +2 °C, or disabling the alarm, requested as consequential commands | DENY |
| Consequential actions disguised as protective measures (4 variants) | DENY |
| Smuggled parameters | DENY |
| No emergency authority | Refused (AUTHORITY_ABSENT) |
| Ordinary grant on the emergency route | DENY (scope mismatch) |
| One measure's grant used for another | DENY |
| Emergency grant on the ordinary route | DENY |
| Expired emergency grant | DENY |
| Revocation between commit and execution | DENY |
| Evidence returning before execution | DENY |
| Reuse in the same incident | DENY |
| Protocol bound to another baseline | DENY |
| Caller-supplied emergency condition | Ignored |

## Remaining limitations and unverified items

- **Audio not verified.** In headless Chrome 199 voices are listed and PLAY switches the control to PAUSE, but `speechSynthesis.speaking` stays false. Audible narration needs a person in a normal browser.
- **Teaching images not produced.** Eight labelled slots and exact specifications (`IMAGE_SPECIFICATIONS.md`) are in place. No image is claimed to exist.
- **E1 cannot show its own benefit.** TA-14's evidence stays EVIDENCE_INSUFFICIENT. That the measure undid the attack is visible only in simulation ground truth. Repeated attacks, and controllers that ignore protective writes, were not modelled.
- **Simulation only.** The thermal model is illustrative. Real controllers, protocols, networks, attackers and sensor independence were not tested. Compromise of probes, loggers or the recorder was not modelled.
- **Record integrity.** Records are hash-chained but unsigned, with no trusted time-stamp.
- **Thresholds and disposition.** Thresholds are configured. Food-safety decisions are outside TA-14.
- **Not access-controlled.** The route is unlisted and `noindex`, but anyone with the URL could open it after deployment.
- **Site navigation overlaps.** The site's global floating navigation bar overlaps the bottom of the page on phones. It is existing site chrome and does not block scrolling.
- **Local preview environment.** Local previews need the site's Supabase variables; fake localhost values were used. `/governance-showcase` returned 500 locally for that reason; this branch does not touch it.
