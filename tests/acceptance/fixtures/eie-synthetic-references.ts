/*
 * SYNTHETIC CRR-1 references, promotion events and functions for TA-14 EIE Phase 2A tests.
 * SIMULATION ONLY. Every id is CRR-SYNTHETIC-* / EIE-FN-SYNTHETIC-*, every title begins "SYNTHETIC",
 * and every actor is a synthetic fixture identity. None of this is a technical reference, a review,
 * a possession record or an owner activation. Production registries refuse all of it.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  buildRegistry, EIE_CALCULATION_CATALOGUE, PRODUCTION_CRR_ENTRIES, PRODUCTION_CRR_EVENTS, WINDOW_STATISTICS_IMPLEMENTATION,
  type CalculationFunction, type CrrEntry, type CrrEvent, type ImplementationIdentity,
} from "../../../packages/domain/eie/analyzer";
import { objectHash } from "../../../packages/domain/eie";
import { syntheticDifference, syntheticMean } from "./eie-synthetic-functions";

const FUNCTIONS_FILE = new URL("./eie-synthetic-functions.ts", import.meta.url);
export const SYNTHETIC_IMPLEMENTATION: ImplementationIdentity = {
  package: "tests/acceptance/fixtures/eie-synthetic-functions.ts",
  version: "0.0.0-synthetic",
  fileHash: createHash("sha256").update(readFileSync(FUNCTIONS_FILE)).digest("hex"),
};

const est = <T>(value: T) => ({ status: "ESTABLISHED" as const, value, basisRef: "SYNTHETIC-FIXTURE" });
const na = { status: "NOT_ESTABLISHED" as const, requiredFrom: "SYNTHETIC: not applicable" };

function syntheticEntry(overrides: Partial<CrrEntry> & Pick<CrrEntry, "referenceId" | "title" | "units">): CrrEntry {
  return {
    kind: "SYNTHETIC", role: "SYNTHETIC", publisher: "SYNTHETIC FIXTURE", editionOrVersion: "0.0.0-synthetic", chapterOrSection: null,
    methodOrEquations: est("SYNTHETIC: see tests/acceptance/fixtures/eie-synthetic-functions.ts"),
    assumptions: ["SYNTHETIC fixture; not a technical reference"], validDomain: est({}),
    pressureOrElevationBasis: null, refrigerantIdentityAndComposition: null, fluidModel: null, saturationConvention: null,
    uncertaintyMethod: na, implementation: SYNTHETIC_IMPLEMENTATION, implementationNote: "SYNTHETIC",
    conformanceTestRef: "SYNTHETIC", calculationVersion: "SYNTHETIC-0",
    acquisition: { method: "SYNTHETIC_FIXTURE", sourceRef: null, acquiredAt: null }, contentIdentity: { sha256: null, basis: "SYNTHETIC" },
    applicability: "SIMULATION ONLY", locators: ["SYNTHETIC#0"], supersedes: null,
    ...overrides,
  };
}

export const SYN_MEAN_REF = syntheticEntry({
  referenceId: "CRR-SYNTHETIC-MEAN-1",
  title: "SYNTHETIC - NOT A TECHNICAL REFERENCE: mean",
  units: est({ inputs: { series: "degF" }, outputs: { mean: "INPUT_UNIT" } }),
  validDomain: est({ degF: { min: -40, max: 200 } }),
  uncertaintyMethod: est("SYNTHETIC-WORST-CASE-STATED-ACCURACY"),
});

export const SYN_DIFFERENCE_REF = syntheticEntry({
  referenceId: "CRR-SYNTHETIC-DIFFERENCE-1",
  title: "SYNTHETIC - NOT A TECHNICAL REFERENCE: difference",
  units: est({ inputs: { a: "degF", b: "degF" }, outputs: { difference: "degF" } }),
  uncertaintyMethod: est("SYNTHETIC-LINEAR-SUM"),
});

/** A SYNTHETIC reference governing the real window-statistics implementation, so it can run in simulation. */
export const SYN_WINDOW_STATISTICS_REF = syntheticEntry({
  referenceId: "CRR-SYNTHETIC-WINDOW-STATISTICS-1",
  title: "SYNTHETIC - NOT A TECHNICAL REFERENCE: window statistics",
  role: "WINDOW_STATISTICS",
  units: est({ inputs: { series: "SINGLE_DECLARED_UNIT" }, outputs: { count: "1", minimum: "INPUT_UNIT", maximum: "INPUT_UNIT", mean: "INPUT_UNIT", span: "s" } }),
  implementation: WINDOW_STATISTICS_IMPLEMENTATION,
});

export const SYNTHETIC_ENTRIES = [SYN_MEAN_REF, SYN_DIFFERENCE_REF, SYN_WINDOW_STATISTICS_REF];

export const SYN_ACTORS = {
  registrar: { id: "SYN-REGISTRAR", role: "REGISTRAR" as const },
  reviewer: { id: "SYN-REVIEWER", role: "REVIEWER" as const },
  conformance: { id: "SYN-CONFORMANCE", role: "CONFORMANCE" as const },
  owner: { id: "SYN-OWNER", role: "OWNER" as const },
};

const AT = "2026-09-28T15:00:00Z";
/** The full five-prerequisite promotion of one entry, in order. */
export function promotion(entry: CrrEntry): CrrEvent[] {
  const referenceId = entry.referenceId;
  const entryHash = objectHash(entry);
  return [
    { type: "REGISTERED", referenceId, entryHash, by: SYN_ACTORS.registrar, at: AT },
    { type: "POSSESSION_ESTABLISHED", referenceId, evidenceRef: "SYNTHETIC-POSSESSION-EVIDENCE", by: SYN_ACTORS.owner, at: AT },
    { type: "REVIEWED", referenceId, outcome: "APPROVED", by: SYN_ACTORS.reviewer, at: AT },
    { type: "CONFORMANCE_PASSED", referenceId, testRef: "SYNTHETIC-CONFORMANCE", implementationFileHash: entry.implementation?.fileHash ?? "", by: SYN_ACTORS.conformance, at: AT },
    { type: "PINNED", referenceId, entryHash, manifestRef: "SYNTHETIC-MANIFEST", by: SYN_ACTORS.owner, at: AT },
    { type: "ACTIVATED", referenceId, by: SYN_ACTORS.owner, at: AT },
  ];
}

export const SYN_MEAN_FUNCTION: CalculationFunction = {
  functionId: "EIE-FN-SYNTHETIC-MEAN", functionVersion: "0.0.0-synthetic", catalogueItem: null, role: "SYNTHETIC", synthetic: true,
  inputs: [{ name: "series", kind: "WINDOW_CHANNEL" }], requiresSaturationConvention: false,
  implementation: SYNTHETIC_IMPLEMENTATION, compute: syntheticMean,
};

export const SYN_DIFFERENCE_FUNCTION: CalculationFunction = {
  functionId: "EIE-FN-SYNTHETIC-DIFFERENCE", functionVersion: "0.0.0-synthetic", catalogueItem: null, role: "SYNTHETIC", synthetic: true,
  inputs: [{ name: "a", kind: "PRIOR_RESULT" }, { name: "b", kind: "PRIOR_RESULT" }], requiresSaturationConvention: false,
  implementation: SYNTHETIC_IMPLEMENTATION, compute: syntheticDifference,
};

export const SIMULATION_CATALOGUE: readonly CalculationFunction[] = [...EIE_CALCULATION_CATALOGUE, SYN_MEAN_FUNCTION, SYN_DIFFERENCE_FUNCTION];

/** Simulation registry: the production candidates (unpromoted) plus fully promoted SYNTHETIC entries. */
export function simulationRegistry(extraEvents: CrrEvent[] = [], entries: CrrEntry[] = SYNTHETIC_ENTRIES) {
  return buildRegistry(
    [...PRODUCTION_CRR_ENTRIES, ...entries],
    [...PRODUCTION_CRR_EVENTS, ...entries.flatMap(promotion), ...extraEvents],
    "SIMULATION",
  );
}
