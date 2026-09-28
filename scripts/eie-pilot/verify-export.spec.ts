/**
 * Offline verifier for a TA-14 EIE Tier 1 pilot export. Uses public material only.
 *
 *   TA14_EIE_EXPORT_FILE=export.json TA14_EIE_TSA_TRUST_ANCHORS_FILE=tsa-root.pem npm run eie:verify-export
 *
 * Skipped unless TA14_EIE_EXPORT_FILE is set. Establishes integrity and lineage only; it says nothing about
 * the truth of declared propositions or the meaning of the evidence.
 */
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { verifyPilotExport, type PilotExport } from "../../packages/domain/eie/pilot";

const exportFile = process.env.TA14_EIE_EXPORT_FILE;

it.skipIf(!exportFile)("pilot export verifies from public material", async () => {
  const raw = JSON.parse(readFileSync(exportFile!, "utf8")) as { export?: PilotExport } & PilotExport;
  const bundle = raw.export ?? raw;
  const anchors = readFileSync(process.env.TA14_EIE_TSA_TRUST_ANCHORS_FILE ?? "", "utf8").match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g) ?? [];
  const result = await verifyPilotExport(bundle, { trustAnchorsPem: anchors }, ["PILOT"]);
  console.log(JSON.stringify(result, null, 2));
  expect(result.findings).toEqual([]);
  expect(result.valid).toBe(true);
});
