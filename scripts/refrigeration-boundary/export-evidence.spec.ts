/*
 * Regenerates the committed Refrigeration Consequence Boundary evidence exports (SIMULATION).
 * Skipped unless TA14_RCB_WRITE_EXPORTS=1:
 *   TA14_RCB_WRITE_EXPORTS=1 npx vitest run scripts/refrigeration-boundary/export-evidence.spec.ts
 * tests/acceptance/refrigeration-consequence-boundary.spec.ts checks the committed files match a fresh run.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { it } from "vitest";
import { scenarioExport, summaryExport } from "../../apps/web/lib/refrigeration-boundary/export";
import { runAllScenarios, runExtensionScenarios } from "../../apps/web/lib/refrigeration-boundary/scenarios";

const OUT = join(__dirname, "..", "..", "apps/web/public/showrooms/refrigeration-consequence-boundary/evidence");

it.skipIf(process.env.TA14_RCB_WRITE_EXPORTS !== "1")("write evidence exports", async () => {
  const results = [...await runAllScenarios(), ...await runExtensionScenarios()];
  mkdirSync(OUT, { recursive: true });
  for (const r of results) writeFileSync(join(OUT, `${r.id}.json`), JSON.stringify(scenarioExport(r)) + "\n");
  writeFileSync(join(OUT, "summary.json"), JSON.stringify(summaryExport(results), null, 1) + "\n");
}, 120000);
