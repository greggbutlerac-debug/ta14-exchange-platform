/**
 * CRR-1 Calculation Reference Registry types (TA-14-EIE-ARCH-1.0 s05).
 *
 * An entry is an immutable registration. Its status (possession, review, conformance, pin,
 * activation, supersession) is never a settable field: it is derived from an append-only event log.
 * Candidate != established. Implementation != authority. Authorship != verification.
 */

/** EXTERNAL: a published technical reference. TA14_METHOD: a TA-14-authored method (same discipline, no privilege). SYNTHETIC: simulation-only fixture. */
export type ReferenceKind = "EXTERNAL" | "TA14_METHOD" | "SYNTHETIC";

/** The calculation role a reference may govern. */
export type ReferenceRole = "PSYCHROMETRIC_PROPERTIES" | "REFRIGERANT_PROPERTIES" | "WINDOW_STATISTICS" | "SYNTHETIC";

export type Established<T> = { status: "ESTABLISHED"; value: T; basisRef: string } | { status: "NOT_ESTABLISHED"; requiredFrom: string };

export interface ImplementationIdentity {
  package: string;
  version: string;
  /** SHA-256 of the implementation source file, enforced by conformance test. */
  fileHash: string;
}

/** Inclusive bounds per input unit. An empty map with ESTABLISHED status means "finite values, no bounds". */
export type ValidDomain = Record<string, { min: number | null; max: number | null }>;

export interface CrrEntry {
  referenceId: string;
  kind: ReferenceKind;
  role: ReferenceRole;
  publisher: string;
  title: string;
  editionOrVersion: string;
  chapterOrSection: string | null;
  methodOrEquations: Established<string>;
  /** Exact input unit required per binding name, and output units; no conversion unless declared. */
  units: Established<{ inputs: Record<string, string | "SINGLE_DECLARED_UNIT">; outputs: Record<string, string | "INPUT_UNIT"> }>;
  assumptions: string[];
  validDomain: Established<ValidDomain>;
  pressureOrElevationBasis: Established<string> | null;
  refrigerantIdentityAndComposition: Established<string> | null;
  fluidModel: Established<string> | null;
  saturationConvention: Established<string> | null;
  uncertaintyMethod: Established<string>;
  implementation: ImplementationIdentity | null;
  implementationNote: string | null;
  conformanceTestRef: string | null;
  calculationVersion: string | null;
  acquisition: { method: "NOT_ACQUIRED" | "LICENSED_COPY" | "PUBLIC_DOCUMENT" | "TA14_AUTHORED" | "SYNTHETIC_FIXTURE"; sourceRef: string | null; acquiredAt: string | null };
  contentIdentity: { sha256: string | null; basis: string };
  applicability: string;
  /** Section / equation / table locators cited in calculation lineage. */
  locators: string[];
  supersedes: string | null;
}

export interface Actor {
  id: string;
  role: "REGISTRAR" | "REVIEWER" | "CONFORMANCE" | "OWNER" | "SYNTHETIC";
}

export type CrrEvent =
  | { type: "REGISTERED"; referenceId: string; entryHash: string; by: Actor; at: string }
  | { type: "POSSESSION_ESTABLISHED"; referenceId: string; evidenceRef: string; by: Actor; at: string }
  | { type: "REVIEWED"; referenceId: string; outcome: "APPROVED" | "REJECTED"; by: Actor; at: string }
  | { type: "CONFORMANCE_PASSED"; referenceId: string; testRef: string; implementationFileHash: string; by: Actor; at: string }
  | { type: "PINNED"; referenceId: string; entryHash: string; manifestRef: string; by: Actor; at: string }
  | { type: "ACTIVATED"; referenceId: string; by: Actor; at: string }
  | { type: "SUSPENDED"; referenceId: string; reason: string; by: Actor; at: string }
  | { type: "RETIRED"; referenceId: string; reason: string; by: Actor; at: string }
  | { type: "SUPERSEDED"; referenceId: string; supersededBy: string; by: Actor; at: string };

export type ActivationState = "CANDIDATE" | "ACTIVE" | "SUSPENDED" | "RETIRED";

/** Derived, read-only state of one entry. */
export interface ReferenceState {
  referenceId: string;
  entryHash: string;
  possessionAndUseBasis: { status: "NOT_ESTABLISHED" | "ESTABLISHED"; evidenceRef: string | null };
  review: { state: "NOT_REVIEWED" | "APPROVED" | "REJECTED"; reviewedBy: string | null; reviewedAt: string | null };
  conformance: { state: "NOT_TESTED" | "PASSED"; testRef: string | null; implementationFileHash: string | null };
  pin: { state: "NOT_PINNED" | "PINNED"; entryHash: string | null; manifestRef: string | null };
  activation: { state: ActivationState; activatedBy: string | null; activatedAt: string | null };
  supersededBy: string | null;
  /** Events refused while deriving this state, with reason codes. */
  refusedEvents: Array<{ event: CrrEvent; reasonCodes: string[] }>;
}

export type RegistryMode = "SIMULATION" | "PRODUCTION";
