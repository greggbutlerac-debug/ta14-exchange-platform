# Refrigeration Consequence Boundary: When the Attacker Bypasses Governance

**Status:** proposed technical examination; **simulation only**. Unlisted preview, not published.

| Item | Location |
|---|---|
| Phase 1 audit | `AUDIT.md` |
| Simulation (baseline, plant, EIN, EIR, gate, emergency pathway, scenarios, verifier, exports) | `apps/web/lib/refrigeration-boundary/` |
| Tests | `tests/acceptance/refrigeration-consequence-boundary.spec.ts` (S1–S8, 33 tests); `tests/acceptance/refrigeration-emergency-pathway.spec.ts` (emergency pathway, E1, S6 preservation, 28 tests) |
| Real-browser check | `node scripts/refrigeration-boundary/browser-check.mjs <base-url> <work-dir>` (Chrome DevTools Protocol) |
| Evidence exports (machine-readable) | `apps/web/public/showrooms/refrigeration-consequence-boundary/evidence/S1–S8.json`, `E1.json` (extension), `summary.json` |
| Technical examination PDF (and HTML source) | `TA-14_Refrigeration_Consequence_Boundary_Technical_Examination_v1.pdf` (copy served from the showroom's `public` folder) |
| Teaching image specifications (images not yet produced) | `IMAGE_SPECIFICATIONS.md` |
| Showroom (unlisted, `noindex`) | `apps/web/app/showrooms/refrigeration-consequence-boundary/` → `/showrooms/refrigeration-consequence-boundary` |

## Reproduce

```bash
npx vitest run tests/acceptance/refrigeration-consequence-boundary.spec.ts
TA14_RCB_WRITE_EXPORTS=1 npx vitest run scripts/refrigeration-boundary/export-evidence.spec.ts   # regenerate exports
TA14_RCB_WRITE_REPORT=1  npx vitest run scripts/refrigeration-boundary/build-report.spec.tsx      # regenerate report HTML and image specifications
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
  --print-to-pdf=docs/refrigeration-consequence-boundary/TA-14_Refrigeration_Consequence_Boundary_Technical_Examination_v1.pdf \
  file://$PWD/docs/refrigeration-consequence-boundary/TA-14_Refrigeration_Consequence_Boundary_Technical_Examination_v1.html
```

A local `next start` needs the Supabase environment variables the site's middleware requires. For a
preview without an account system, fake localhost values work (`NEXT_PUBLIC_SUPABASE_URL=http://localhost:9`).

## Boundaries

- The AEA decisions come from the production GCEA module (`apps/web/lib/governance-continuity-execution-authority.ts`), unchanged; a test checks it equals `origin/main`.
- The EIN, EIR, actor and bounds checks, thermal model, controller and attacker are simulation components.
- No network calls or control endpoints exist in the simulation (tested).
- This is an independent TA-14 technical examination; no external party has reviewed or endorsed it.
- S6 is a preserved failure case. The emergency pathway (E0 notification, E1 protective measures that only re-assert sealed-baseline values, no E2 consequential commands) is an extension examined in scenario E1; it does not modify GCEA.
