# Refrigeration Consequence Boundary: final report (revision 1.2)

**Date:** 2026-11-04 · **Repository:** `greggbutlerac-debug/ta14-exchange-platform` · **Branch:** `feat/refrigeration-consequence-boundary` · **Integrated with:** `origin/main` `f636d639` (merge commit, no history rewritten) · **Deployment:** none.

> Everything here is software verification of a **simulation**. Nothing validates a physical refrigeration system, a real controller, or real sensors.

## 1. Integration with current main

- The branch was 727 commits behind `main`. Upstream touched **no** examination file, the GCEA engine, dependencies or the test configuration. It did change `middleware.ts` (all `/showrooms/*` now bypass the session middleware), `sitemap.ts`, the showroom index and the global navigation. The merge was clean, with no conflicts.
- **GCEA (`apps/web/lib/governance-continuity-execution-authority.ts`) is identical to current `main`.** A test asserts this.
- Upstream regression observed: six images committed upstream with decomposed-Unicode file names show as untracked twins on macOS (`core.precomposeunicode=true`). This is an upstream naming issue; they were not touched or staged.

## 2. Owner gate (new in 1.2)

Because `/showrooms/*` is now public in middleware, the gate sits in the route itself (`access.ts`, `layout.tsx`). It uses the same rule as `/admin/*`: 404 unless the signed-in user is `TA14_REVENUE_OWNER_USER_ID`. It fails closed on a missing owner, a missing session or any Supabase error. The evidence exports and the PDF moved out of `public/` into owner-gated route handlers. `TA14_RCB_LOCAL_PREVIEW=1` opens the gate for local verification **only when `VERCEL` is unset**.

| Live-server check | Page | Evidence | PDF |
|---|:-:|:-:|:-:|
| No configuration | 404 | 404 | 404 |
| Owner configured, Supabase unreachable | 404 | 404 | 404 |
| Preview flag with `VERCEL=1` | 404 | 404 | 404 |
| Preview flag, local | 200 | 200 | 200 |

Existing routes (`/`, `/showrooms`, `/showrooms/onuma`) returned 200 throughout. The served evidence (S2, S6, E1, summary) and the PDF are identical to the committed files. Responses carry `x-robots-tag: noindex, nofollow` and `cache-control: private, no-store`.

## 3. Tests (exact, on the merged branch)

| Run | Result |
|---|---|
| `npx vitest run` (full repository) | **25 files: 266 passed, 3 skipped, 0 failed.** The 3 skipped are this work's gated generator scripts |
| `refrigeration-consequence-boundary.spec.ts` | 33 passed |
| `refrigeration-emergency-pathway.spec.ts` | 28 passed (22 adversarial) |
| `refrigeration-owner-gate.spec.ts` (new) | 15 passed: gate decisions; gate enforced before anything else in the layout and both routes; nothing in `public/`; `noindex`; not in the sitemap or index; no third-party attribution in content; controller (untrusted) reports cannot influence emergency decisions; evidence loss alone never authorizes |
| `npx tsc --noEmit` | 0 errors |
| `npx next build apps/web` | Succeeded, 963 pages; the showroom and its two routes are dynamic |
| Lint | **Not run: the repository has no lint script or ESLint configuration** |
| `node scripts/refrigeration-boundary/browser-check.mjs` (headless Chrome, local production build, preview flag) | Exit 0, no failures, no console errors: lesson navigation, EXPLAIN, image slots, autoplay toggle, 9 scenario tabs, in-page verification "VALID · 591 entries recomputed with WebCrypto", a real download, untouched upload VALID, tampered upload "INVALID · ENTRY_HASH_MISMATCH@40", PDF 200, 390 px layout without overflow |

## 4. Requirements checklist

| # | Requirement | Status |
|---|---|---|
| 1–2 | Status confirmed; latest main fetched | Done (`f636d639`) |
| 3–5 | Examination files compared; conflicts and upstream changes identified; main integrated safely | Done: clean merge; nothing unrelated overwritten |
| 6 | Build, type check, lint, tests | Build, type check and tests pass. **Lint unavailable** in the repository |
| 7 | AEA boundaries and fail-closed behaviour preserved | GCEA unchanged; S1–S8 results and exports byte-identical; the gate fails closed |
| 8 | No unverified third-party attribution | Tested over all examination content |
| 9 | Owner-gated pending approval | Done and verified (section 2) |
| 10 | Eight image specifications, no claim that images exist | `IMAGE_SPECIFICATIONS.md` unchanged; slots say "not yet produced" (browser-verified) |
| 11 | Limitations documented | Section 6 and PDF section 11 |
| 12 | No emergency authorization based solely on inadmissible evidence | E1 needs a scoped authority, standing and an EIN-computed condition; untrusted controller signals have no effect (tested) |
| 13 | Final report | This document |

## 5. Files changed in revision 1.2 (on top of `ec4fd67a`, excluding the merge itself)

| Status | File |
|---|---|
| Added | `apps/web/app/showrooms/refrigeration-consequence-boundary/access.ts`, `layout.tsx`, `evidence/[file]/route.ts`, `files/[file]/route.ts` |
| Added | `tests/acceptance/refrigeration-owner-gate.spec.ts` |
| Modified | `apps/web/app/showrooms/refrigeration-consequence-boundary/page.tsx`: gated PDF link, owner-gated banner and comment |
| Moved | `apps/web/public/showrooms/refrigeration-consequence-boundary/evidence/*` → `docs/refrigeration-consequence-boundary/evidence/*` (content unchanged) |
| Removed | `apps/web/public/showrooms/refrigeration-consequence-boundary/…v1.pdf` (now served by the gated route from `docs/`) |
| Modified | `scripts/refrigeration-boundary/export-evidence.spec.ts`, `build-report.spec.tsx`; `tests/acceptance/refrigeration-consequence-boundary.spec.ts` (export directory) |
| Modified | `docs/refrigeration-consequence-boundary/README.md`, `FINAL_REPORT.md`; PDF and HTML regenerated (17 pages, revision 1.2) |

## 6. Remaining defects and limitations

- **The owner's signed-in path is unverified.** No live Supabase session was available. The gate was verified closed in all other configurations and open only under the local preview flag.
- **The PDF route on Vercel is unverified.** The route reads the PDF from `docs/` at runtime. If Vercel's file tracing does not include it, the route returns 404 (fail closed), not the file. Check on a preview deployment; adding the file to `outputFileTracingIncludes` may be needed.
- **Narration is unverified.** In headless Chrome, PLAY switches to PAUSE with 199 voices listed, but `speechSynthesis.speaking` stays false. Audible playback needs a person.
- **Records are unsigned:** hash-chained, with no signature and no trusted time-stamp.
- **Simulation only.** The thermal model is illustrative. Real controllers, protocols, networks, attackers and sensor independence are untested, and real-world controller behaviour was not tested. Compromise of probes, loggers or the recorder was not modelled.
- **E1 cannot show its own benefit.** TA-14's evidence stays EVIDENCE_INSUFFICIENT. Repeated attacks, and controllers that ignore protective writes, were not modelled.
- **No teaching images exist.** Eight specifications and slots only.
- **History still names a third party.** Earlier branch commits (`2450fda0`, `c9ea8c04`) contain the superseded origin wording. The current files do not. Squash-merging the PR would keep it out of `main`; the branch history was not rewritten.
- **No lint.** No lint tooling exists in the repository.

## 7. Publication readiness

**Not ready for public publication.** Publication requires Greggory's approval, plus:

1. the eight teaching images to be produced;
2. a person to verify audible narration;
3. the owner path and the PDF route to be verified on a preview deployment.

The branch is ready for review as a **draft pull request**. It must not be merged or deployed without explicit approval.
