/**
 * TA-14-EIE-ARCH-1.0 s05 Analyzer calculation contract (Phase 2A).
 *
 * SEALED EVIDENCE -> GOVERNED CALCULATION -> ATTRIBUTABLE CALCULATION RESULT.
 * A result is an evidence transformation. It carries no comparison, threshold, interpretation,
 * determination, authority, gate, command or quantity field.
 */
import type { Channel, ContinuityStatus, NodeObservation, RecorderMode, Submitter, WindowPurpose } from "../types";
import type { ActivationState, ImplementationIdentity, ReferenceKind, ReferenceRole } from "./crr/types";

export type InputBinding =
  | { kind: "WINDOW_CHANNEL"; name: string; windowId: string; channel: Channel; source: { provider: string; deviceId: string } }
  | { kind: "PRIOR_RESULT"; name: string; resultHash: string; output: string };

export interface CalculationRequest {
  functionId: string;
  functionVersion: string;
  referenceId: string;
  inputs: InputBinding[];
  /** Attributable requester, from the trusted server context. Requesting a calculation confers nothing. */
  requestedBy: Submitter;
}

export type Uncertainty =
  | { status: "PROPAGATED"; methodRef: string; value: number; unit: string }
  | { status: "NOT_PROPAGATED"; reason: string };

export interface CalculationOutput {
  name: string;
  value: number;
  unit: string;
  uncertainty: Uncertainty;
}

/** One admitted observation as it entered the calculation. */
export interface ObservationInput {
  binding: string;
  windowId: string;
  windowSeq: number;
  entryHash: string;
  observationId: string;
  observationHash: string;
  value: number;
  unit: string;
  observedAt: string;
  acquisitionMethod: NodeObservation["acquisitionMethod"];
  accuracyOrUncertainty: NodeObservation["accuracyOrUncertainty"];
}

export interface PriorResultInput {
  binding: string;
  resultHash: string;
  output: string;
  value: number;
  unit: string;
  uncertainty: Uncertainty;
}

export interface WindowInput {
  windowId: string;
  headerHash: string;
  sealHash: string;
  recorderMode: RecorderMode;
  purpose: WindowPurpose;
  assetId: string;
  continuityStatus: ContinuityStatus;
}

export type EvidenceMode = "SIMULATION" | "PRODUCTION";

export interface CalculationResult {
  contract: "TA-14-EIE-ARCH-1.0/s05";
  architectureFingerprint: string;
  analyzer: { analyzerId: string; analyzerVersion: string; mode: EvidenceMode };
  request: CalculationRequest;
  function: { functionId: string; functionVersion: string; catalogueItem: string | null; implementation: ImplementationIdentity | null };
  reference: {
    referenceId: string;
    kind: ReferenceKind | null;
    role: ReferenceRole | null;
    entryHash: string | null;
    activationState: ActivationState | null;
    calculationVersion: string | null;
    locators: string[];
  };
  evidenceMode: EvidenceMode;
  inputs: { windows: WindowInput[]; observations: ObservationInput[]; priorResults: PriorResultInput[] };
  assumptions: string[];
  status: "ESTABLISHED" | "NOT_ESTABLISHED";
  outputs: CalculationOutput[];
  reasonCodes: string[];
  resultHash: string;
}

/** Resolved inputs handed to a pure calculation function. */
export interface ResolvedInputs {
  observations: Readonly<Record<string, readonly ObservationInput[]>>;
  priorResults: Readonly<Record<string, PriorResultInput>>;
}

/** A pure, deterministic calculation. It returns outputs or names the inputs it cannot use; it never compares against thresholds. */
export type CalculationImplementation = (inputs: ResolvedInputs, method: { uncertaintyMethod: string | null; units: Record<string, string> }) =>
  | { outputs: CalculationOutput[] }
  | { notEstablished: string[] };

export interface CalculationFunction {
  functionId: string;
  functionVersion: string;
  /** The frozen s05 catalogue item this function implements, or null for SYNTHETIC functions. */
  catalogueItem: string | null;
  role: ReferenceRole;
  synthetic: boolean;
  /** Required input bindings by name and kind; null when no implementation exists yet. */
  inputs: Array<{ name: string; kind: InputBinding["kind"] }> | null;
  requiresSaturationConvention: boolean;
  implementation: ImplementationIdentity | null;
  compute: CalculationImplementation | null;
}
