# Refrigeration Consequence Boundary: Phase 1 repository audit

**Date:** 2026-11-03 · **Branch:** `feat/refrigeration-consequence-boundary` (from `origin/main` `04b58e0c`) · **Repository:** `ta14-exchange-platform`

| Component | Status | Location | Decision |
|---|---|---|---|
| AEA execution gate | **EXISTS** | `apps/web/lib/governance-continuity-execution-authority.ts` (GCEA). Covers ALLOW/HOLD/DENY/ESCALATE; evidence (continuity and admissibility); an authority grant scoped to asset, version, route and consequence; standing (CURRENT/CHALLENGED/EXPIRED/REVOKED); material change; commit; execution-attempt revalidation; and SHA-256 receipts | **REUSABLE, used unchanged.** The production engine is not modified |
| Actor identity in the gate | **MISSING** | GCEA grants carry no holder or actor | **REQUIRES ADAPTATION:** a simulation-only actor-standing and holder check around GCEA. It can only make a determination stricter |
| Command parameter bounds | **MISSING** in GCEA | — | Simulation-only bounds check against the authorized baseline (same rule: stricter only) |
| EIN / EIR | **MISSING on main.** EIE (Node, Recorder) exists only on the unmerged branch `eie/arch-1.0-phase1-2b`, and has no refrigeration channels | `packages/domain/eie` on that branch | **SIMULATION** EIN and EIR built here and labelled as simulation, not production EIE |
| Environmental Evidence Gateway | EXISTS (IAQ only); its fail-closed repair is unmerged (`fix/eeg-evidence-validation`) | `apps/web/lib/environmental-evidence-gateway.ts` | Not used: wrong domain |
| ASA | **MISSING** (no occurrence in the repository) | — | Not used. Reported |
| AHIA | Explanatory text only (five showroom pages) | e.g. `apps/web/app/showrooms/interoperability-systems` | No engine to reuse. Human intervention uses GCEA's `InterventionAuthority` and a fresh grant |
| Canonical hashing | EXISTS | `packages/domain/canonical-json.ts`, `packages/crypto/receipts.ts` | Same canonicalisation convention as GCEA |
| Samantha narration | EXISTS (browser `speechSynthesis`, prefers the "Samantha" voice) | `apps/web/app/eight24-hvacdr/curriculum/01/LessonVisualSamantha.tsx` | **REQUIRES ADAPTATION:** that component requires a finished image and Spanish text, and has no EXPLAIN, previous/next or autoplay. A new English component follows its pattern |
| Showroom infrastructure | EXISTS (23 showrooms; hand-maintained index and sitemap) | `apps/web/app/showrooms/*`, `apps/web/app/sitemap.ts` | New route, **unlisted**: not in the index or sitemap, with `robots: noindex` |
| Related precedent | EXISTS | `apps/web/app/examinations/stop-the-cyber-attack` (Kimon's three-condition interoperability experiment); `apps/web/app/showrooms/onuma` | Not modified. **No refrigeration-specific challenge text is preserved in the repository** |
| Refrigeration thermal model | **MISSING** | — | Built here as an **illustrative, unvalidated** lumped model |
| PDF tooling | **MISSING** (no PDF library); Google Chrome installed | — | HTML generated from actual results, printed with headless Chrome |
| Image generation | **UNAVAILABLE** to the implementer | — | Image slots with exact production specifications. No placeholders presented as finished assets |
| Deployment boundary | Vercel (from build scripts); no deployment performed | — | Local branch only, no deployment |
