/**
 * The shipped production CRR-1 registry. Every entry is CANDIDATE: registered, not possessed, not
 * reviewed, not conformance-tested, not pinned, not activated. There is no production write path for
 * promotion events; a governed promotion-attestation authority does not exist yet.
 *
 * The two EXTERNAL entries are the frozen s05 candidates. Their content is recorded only as far as
 * publicly identifiable: nothing requiring the possessed text (equations, units, domain) is recorded.
 * The TA14_METHOD entry is TA-14-authored and receives no privilege from that authorship.
 */
import { deepFreeze, objectHash } from "../../chain";
import { WINDOW_STATISTICS_IMPLEMENTATION } from "../implementations";
import { buildRegistry } from "./registry";
import type { CrrEntry, CrrEvent } from "./types";

const notEstablished = (requiredFrom: string) => ({ status: "NOT_ESTABLISHED" as const, requiredFrom });
const POSSESSED_TEXT = "the lawfully possessed reference text (possession NOT_ESTABLISHED)";

export const CRR_PSY_ASHRAE_F2025_CH1: CrrEntry = {
  referenceId: "CRR-PSY-ASHRAE-F2025-CH1",
  kind: "EXTERNAL",
  role: "PSYCHROMETRIC_PROPERTIES",
  publisher: "ASHRAE",
  title: "ASHRAE Handbook - Fundamentals",
  editionOrVersion: "2025",
  chapterOrSection: "Chapter 1, Psychrometrics (SI and I-P)",
  methodOrEquations: notEstablished(POSSESSED_TEXT),
  units: notEstablished(POSSESSED_TEXT),
  assumptions: [],
  validDomain: notEstablished(POSSESSED_TEXT),
  pressureOrElevationBasis: notEstablished(POSSESSED_TEXT),
  refrigerantIdentityAndComposition: null,
  fluidModel: null,
  saturationConvention: null,
  uncertaintyMethod: notEstablished(POSSESSED_TEXT),
  implementation: null,
  implementationNote: "s05 implementationRule: an implementation (e.g. PsychroLib, which states it implements the 2017 edition) is admissible only for the edition it is conformance-verified against; it never substitutes for this edition and is never itself a governing reference.",
  conformanceTestRef: null,
  calculationVersion: null,
  acquisition: { method: "NOT_ACQUIRED", sourceRef: "https://handbook.ashrae.org/Handbooks/F25/SI/F25_Ch01/F25_Ch01_si.aspx", acquiredAt: null },
  contentIdentity: { sha256: null, basis: "NOT_POSSESSED" },
  applicability: "Governing psychrometric reference candidate for TA-14-EIE-ARCH-1.0 (s05).",
  locators: [],
  supersedes: null,
};

export const CRR_REF_NIST_REFPROP_10_0: CrrEntry = {
  referenceId: "CRR-REF-NIST-REFPROP-10.0",
  kind: "EXTERNAL",
  role: "REFRIGERANT_PROPERTIES",
  publisher: "NIST",
  title: "NIST Standard Reference Database 23: Reference Fluid Thermodynamic and Transport Properties (REFPROP)",
  editionOrVersion: "10.0",
  chapterOrSection: null,
  methodOrEquations: notEstablished(POSSESSED_TEXT),
  units: notEstablished(POSSESSED_TEXT),
  assumptions: [],
  validDomain: notEstablished(POSSESSED_TEXT),
  pressureOrElevationBasis: null,
  refrigerantIdentityAndComposition: notEstablished("per-refrigerant binding at activation (ASHRAE Standard 34 designation and composition)"),
  fluidModel: { status: "ESTABLISHED", value: "full mixture model at the composition of the ASHRAE Standard 34 designation", basisRef: "TA-14-EIE-ARCH-1.0 s05 candidateEntries" },
  saturationConvention: notEstablished("a cited authority for the saturation convention (G1 ruling)"),
  uncertaintyMethod: notEstablished(POSSESSED_TEXT),
  implementation: null,
  implementationNote: null,
  conformanceTestRef: null,
  calculationVersion: null,
  acquisition: { method: "NOT_ACQUIRED", sourceRef: "https://pages.nist.gov/REFPROP-docs/", acquiredAt: null },
  contentIdentity: { sha256: null, basis: "NOT_POSSESSED" },
  applicability: "Governing refrigerant-property reference candidate for TA-14-EIE-ARCH-1.0 (s05). Never OEM charging authority.",
  locators: [],
  supersedes: null,
};

export const CRR_TA14_WINDOW_STATISTICS_1: CrrEntry = {
  referenceId: "CRR-TA14-WINDOW-STATISTICS-1",
  kind: "TA14_METHOD",
  role: "WINDOW_STATISTICS",
  publisher: "TA-14",
  title: "Declared window statistics",
  editionOrVersion: "1.0.0",
  chapterOrSection: null,
  methodOrEquations: { status: "ESTABLISHED", value: "count; minimum; maximum; arithmetic mean = sum / count; span = last observedAt - first observedAt, in seconds", basisRef: "CRR-TA14-WINDOW-STATISTICS-1 (TA-14-authored; unreviewed)" },
  units: { status: "ESTABLISHED", value: { inputs: { series: "SINGLE_DECLARED_UNIT" }, outputs: { count: "1", minimum: "INPUT_UNIT", maximum: "INPUT_UNIT", mean: "INPUT_UNIT", span: "s" } }, basisRef: "CRR-TA14-WINDOW-STATISTICS-1" },
  assumptions: [
    "Inputs are admitted OBSERVATION entries of one channel and one source in one sealed, INTACT window.",
    "All inputs share one declared unit; no conversion.",
    "No weighting, interpolation, resampling, outlier removal or gap filling.",
  ],
  validDomain: { status: "ESTABLISHED", value: {}, basisRef: "finite values; no bounds" },
  pressureOrElevationBasis: null,
  refrigerantIdentityAndComposition: null,
  fluidModel: null,
  saturationConvention: null,
  uncertaintyMethod: notEstablished("an owner-reviewed uncertainty-propagation method"),
  implementation: WINDOW_STATISTICS_IMPLEMENTATION,
  implementationNote: "Authorship by TA-14 establishes nothing; this entry is subject to the full CRR-1 promotion discipline.",
  conformanceTestRef: "tests/acceptance/eie-phase2a-calculation.spec.ts (window statistics conformance)",
  calculationVersion: "EIE-CALC-WINDOW-STATISTICS-1.0.0",
  acquisition: { method: "TA14_AUTHORED", sourceRef: "packages/domain/eie/analyzer/functions/window-statistics.ts", acquiredAt: null },
  contentIdentity: { sha256: WINDOW_STATISTICS_IMPLEMENTATION.fileHash, basis: "implementation source file" },
  applicability: "Descriptive statistics of one declared channel in one sealed window. No interpretation.",
  locators: ["CRR-TA14-WINDOW-STATISTICS-1#method"],
  supersedes: null,
};

export const PRODUCTION_CRR_ENTRIES: readonly CrrEntry[] = deepFreeze([CRR_PSY_ASHRAE_F2025_CH1, CRR_REF_NIST_REFPROP_10_0, CRR_TA14_WINDOW_STATISTICS_1]);

const REGISTERED_AT = "2026-09-28T00:00:00Z";
export const PRODUCTION_CRR_EVENTS: readonly CrrEvent[] = deepFreeze([
  { type: "REGISTERED", referenceId: CRR_PSY_ASHRAE_F2025_CH1.referenceId, entryHash: objectHash(CRR_PSY_ASHRAE_F2025_CH1), by: { id: "TA-14-EIE-ARCH-1.0/s05", role: "REGISTRAR" }, at: REGISTERED_AT },
  { type: "REGISTERED", referenceId: CRR_REF_NIST_REFPROP_10_0.referenceId, entryHash: objectHash(CRR_REF_NIST_REFPROP_10_0), by: { id: "TA-14-EIE-ARCH-1.0/s05", role: "REGISTRAR" }, at: REGISTERED_AT },
  { type: "REGISTERED", referenceId: CRR_TA14_WINDOW_STATISTICS_1.referenceId, entryHash: objectHash(CRR_TA14_WINDOW_STATISTICS_1), by: { id: "TA-14-EIE-PHASE-2A", role: "REGISTRAR" }, at: REGISTERED_AT },
]);

/** The production registry: fail-closed, nothing resolves. */
export const PRODUCTION_CRR_1 = buildRegistry(PRODUCTION_CRR_ENTRIES, PRODUCTION_CRR_EVENTS, "PRODUCTION");
