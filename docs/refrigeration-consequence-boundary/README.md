# Refrigeration Consequence Boundary: When the Attacker Bypasses Governance

**Status:** proposed technical examination; **simulation only**. **Owner-gated** pending publication approval: the page, evidence exports and PDF return 404 to everyone except the signed-in owner (`TA14_REVENUE_OWNER_USER_ID`).

| Item | Location |
|---|---|
| Phase 1 audit | `AUDIT.md` |
| Simulation (baseline, plant, EIN, EIR, gate, emergency pathway, scenarios, verifier, exports) | `apps/web/lib/refrigeration-boundary/` |
| Tests | `tests/acceptance/refrigeration-consequence-boundary.spec.ts` (S1–S8, 33 tests); `tests/acceptance/refrigeration-emergency-pathway.spec.ts` (emergency pathway, E1, S6 preservation, 28 tests) |
| Real-browser check | `node scripts/refrigeration-boundary/browser-check.mjs <base-url> <work-dir>` (Chrome DevTools Protocol) |
| Evidence exports (machine-readable) | `docs/refrigeration-consequence-boundary/evidence/S1–S8.json`, `E1.json` (extension), `summary.json` |
| Technical examination PDF (and HTML source) | `TA-14_Refrigeration_Consequence_Boundary_Technical_Examination_v1.pdf`, served only through the owner-gated route `/showrooms/refrigeration-consequence-boundary/files/<name>` |
| Teaching image specifications (images not yet produced) | `IMAGE_SPECIFICATIONS.md` |
| Showroom (owner-gated, `noindex`, not in the sitemap or index) | `apps/web/app/showrooms/refrigeration-consequence-boundary/` (gate: `access.ts`, `layout.tsx`; gated routes `evidence/[file]`, `files/[file]`) |

## Reproduce

```bash
npx vitest run tests/acceptance/refrigeration-consequence-boundary.spec.ts
TA14_RCB_WRITE_EXPORTS=1 npx vitest run scripts/refrigeration-boundary/export-evidence.spec.ts   # regenerate exports
TA14_RCB_WRITE_REPORT=1  npx vitest run scripts/refrigeration-boundary/build-report.spec.tsx      # regenerate report HTML and image specifications
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
  --print-to-pdf=docs/refrigeration-consequence-boundary/TA-14_Refrigeration_Consequence_Boundary_Technical_Examination_v1.pdf \
  file://$PWD/docs/refrigeration-consequence-boundary/TA-14_Refrigeration_Consequence_Boundary_Technical_Examination_v1.html
```

Local preview: `TA14_RCB_LOCAL_PREVIEW=1 npx next start apps/web`. The flag opens the gate only when `VERCEL` is unset, so it cannot take effect on a Vercel deployment. Without it, the examination returns 404 locally (fail closed).

## Boundaries

- The AEA decisions come from the production GCEA module (`apps/web/lib/governance-continuity-execution-authority.ts`), unchanged; a test checks it equals `origin/main`.
- The EIN, EIR, actor and bounds checks, thermal model, controller and attacker are simulation components.
- No network calls or control endpoints exist in the simulation (tested).
- This is an independent TA-14 technical examination; no external party has reviewed or endorsed it.
- S6 is a preserved failure case. The emergency pathway (E0 notification, E1 protective measures that only re-assert sealed-baseline values, no E2 consequential commands) is an extension examined in scenario E1; it does not modify GCEA.
