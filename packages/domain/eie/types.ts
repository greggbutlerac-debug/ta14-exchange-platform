/**
 * TA-14-EIE-ARCH-1.0 Phase 1 types: Environmental Integrity Node observation
 * contract (s04) and Environmental Integrity Recorder evidence-window contract (s03).
 *
 * OBSERVATION -> RECORD only. Nothing here calculates, interprets, determines,
 * authorizes, commits or executes.
 */

import type { GateAInputManifest } from "./gate-a-input/adapter";

/** s04 channels. "return RH or wet bulb" is split by quantity; "IAQ channels" are not yet defined and are not admissible. */
export const CHANNELS = [
  "RETURN_DRY_BULB",
  "RETURN_RH",
  "RETURN_WET_BULB",
  "SUPPLY_DRY_BULB",
  "SUPPLY_RH",
  "OUTDOOR_DRY_BULB",
  "BAROMETRIC_PRESSURE",
  "ELEVATION",
  "LIQUID_LINE_TEMPERATURE",
  "SUCTION_LINE_TEMPERATURE",
  "RETURN_STATIC_PRESSURE",
  "SUPPLY_STATIC_PRESSURE",
  "AIRFLOW",
  "VOLTAGE",
  "CURRENT",
  "SCALE_MASS",
  "SUCTION_PRESSURE",
  "LIQUID_PRESSURE",
] as const;
export type Channel = (typeof CHANNELS)[number];

/** s04: refrigerant pressure channels are admissible only inside a PRESSURE_EVIDENCE window. */
export const REFRIGERANT_PRESSURE_CHANNELS: ReadonlySet<Channel> = new Set(["SUCTION_PRESSURE", "LIQUID_PRESSURE"]);

export const ACQUISITION_METHODS = ["LIVE_ADAPTER", "MANUAL_INSTRUMENT", "SIMULATED"] as const;
export type AcquisitionMethod = (typeof ACQUISITION_METHODS)[number];

export const LOCATION_CLASSES = ["A", "B", "C"] as const;
export const LOCATION_BASIS_KINDS = ["OEM_CITATION", "GOVERNED_METHOD"] as const;

/** s04 raw observation. Raw values only. */
export interface NodeObservation {
  observationId: string;
  channel: Channel;
  source: { provider: string; deviceId: string };
  instrument: { id: string; calibrationOrFitnessRef: string; fitUntil: string };
  location: {
    physical: string;
    class: (typeof LOCATION_CLASSES)[number];
    basis: { kind: (typeof LOCATION_BASIS_KINDS)[number]; ref: string };
  };
  value: number;
  unit: string;
  observedAt: string;
  receivedAt: string;
  sequence: number;
  acquisitionMethod: AcquisitionMethod;
  /** Explicit null means the source states none; omission is rejected. */
  accuracyOrUncertainty: { kind: "ACCURACY" | "UNCERTAINTY"; value: number; unit: string; basisRef: string } | null;
  sourceQuality: string;
  adapterVersion: string;
}

export const WINDOW_PURPOSES = [
  "CONTINUOUS",
  "BASELINE_NONINVASIVE",
  "PRESSURE_EVIDENCE",
  "EXECUTION",
  "POST_STABILIZATION",
  "POST_VERIFICATION",
] as const;
export type WindowPurpose = (typeof WINDOW_PURPOSES)[number];

export const OPEN_TRIGGERS = ["SESSION_START", "GATE_A_ALLOW_RECEIPT", "GATE_B_COMMIT", "GOVERNOR_TERMINATION", "SCHEDULE"] as const;
export type OpenTriggerType = (typeof OPEN_TRIGGERS)[number];

export const CLOSE_TRIGGERS = ["DECLARED_END_OF_PURPOSE", "NEXT_LIFECYCLE_RECEIPT", "CONTINUITY_BREAK", "PROFILE_TIMEOUT"] as const;
export type CloseTriggerType = (typeof CLOSE_TRIGGERS)[number];

export type ContinuityStatus = "INTACT" | "DEGRADED" | "BROKEN";
export type RecorderMode = "SIMULATION" | "PRODUCTION";

/**
 * A profile value is either established by a named basis or explicitly not established,
 * naming the authority that must supply it. The Recorder holds no default values.
 */
export type ProfileBound<T> =
  | { status: "ESTABLISHED"; value: T; basisRef: string }
  | { status: "NOT_ESTABLISHED"; requiredFrom: string };

export const SEQUENCE_SEMANTICS = ["CONTIGUOUS_PER_STREAM", "MONOTONIC_PER_STREAM"] as const;
export type SequenceSemantics = (typeof SEQUENCE_SEMANTICS)[number];

export const PROFILE_BASIS_KINDS = ["SYNTHETIC_FIXTURE", "OEM_CRITERION", "GOVERNED_METHOD", "SOURCE_DOCUMENTATION"] as const;

/**
 * s03 continuityPolicy (profile-supplied): a governed continuity profile.
 * Required: sequenceSemantics and maxGapSeconds. Optional (explicitly NOT_ESTABLISHED allowed):
 * maxObservationAgeSeconds (no age bound applied), maxSourceClockLeadSeconds (zero tolerance),
 * windowTimeoutSeconds (no timeout).
 */
export interface ContinuityProfile {
  profileId: string;
  profileVersion: string;
  basis: { kind: (typeof PROFILE_BASIS_KINDS)[number]; ref: string };
  sequenceSemantics: ProfileBound<SequenceSemantics>;
  maxGapSeconds: ProfileBound<number>;
  maxObservationAgeSeconds: ProfileBound<number>;
  maxSourceClockLeadSeconds: ProfileBound<number>;
  windowTimeoutSeconds: ProfileBound<number>;
}

export type SubmitterRole = "NODE" | "TECHNICIAN" | "ANALYZER" | "GOVERNOR";
/** Authenticated submitter identity, supplied by the trusted server context, never by the payload. */
export interface Submitter {
  role: SubmitterRole;
  id: string;
}

export interface OpenTrigger {
  type: OpenTriggerType;
  /** For GATE_A_ALLOW_RECEIPT: the receipt_id of a Gate A receipt the Recorder itself preserved. */
  ref: string;
}

/** A window request carries no receipt object and no authorization flag; the Recorder resolves the trigger itself. */
export interface OpenWindowRequest {
  purpose: WindowPurpose;
  assetId: string;
  openTrigger: OpenTrigger;
  admittedChannels: Channel[];
  admittedSources: Array<{ provider: string; deviceId: string }>;
  continuityProfile: ContinuityProfile;
  predecessorWindowIds: string[];
}

export interface WindowHeader {
  contract: "TA-14-EIE-ARCH-1.0/s03";
  architectureFingerprint: string;
  recorderId: string;
  recorderMode: RecorderMode;
  purpose: WindowPurpose;
  assetId: string;
  openTrigger: OpenTrigger & {
    gateAReceiptId: string | null;
    gateAReceiptContentHash: string | null;
    gateAReceiptWindowId: string | null;
    gateAReceiptEntryHash: string | null;
  };
  openedAt: string;
  openedBy: Submitter;
  admittedChannels: Channel[];
  admittedSources: Array<{ provider: string; deviceId: string }>;
  continuityProfile: ContinuityProfile;
  continuityProfileHash: string;
  predecessorWindowIds: string[];
  predecessorSealHashes: string[];
}

export type RecordKind =
  | "OBSERVATION"
  | "CORRECTION"
  | "EVENT"
  | "REJECTED_SUBMISSION"
  | "PREMATURE_PRESSURE_ENTRY"
  | "GATE_A_RECEIPT"
  | "MATERIAL_CHANGE"
  | "GAP";

interface ChainFields {
  windowId: string;
  windowSeq: number;
  kind: RecordKind;
  recordedAt: string;
  submittedBy: Submitter | null;
  prevEntryHash: string;
  entryHash: string;
}

export interface ObservationRecord extends ChainFields {
  kind: "OBSERVATION";
  observation: NodeObservation;
  observationHash: string;
}

export interface CorrectionRecord extends ChainFields {
  kind: "CORRECTION";
  correctsWindowId: string;
  correctsEntryHash: string;
  reason: string;
  replacement: NodeObservation | null;
  replacementHash: string | null;
}

export interface EventRecord extends ChainFields {
  kind: "EVENT";
  actor: Submitter;
  eventKind: string;
  payload: unknown;
}

/** Continuity effect of a rejected submission under the governed profile. */
export type ContinuityEffect = "NONE" | "DEGRADED";

export interface RejectedSubmissionRecord extends ChainFields {
  kind: "REJECTED_SUBMISSION";
  submissionType: "OBSERVATION" | "EVENT" | "CORRECTION" | "GATE_A_EVALUATION" | "MATERIAL_CHANGE";
  submission: unknown;
  submissionHash: string | null;
  reasonCodes: string[];
  continuityEffect: ContinuityEffect;
}

export interface PrematurePressureRecord extends ChainFields {
  kind: "PREMATURE_PRESSURE_ENTRY";
  observation: NodeObservation;
  observationHash: string;
  reasonCodes: string[];
}

/** s09: the C1-R7 receipt, produced by the configured Gate A engine and preserved unchanged. */
export interface GateAReceiptRecord extends ChainFields {
  kind: "GATE_A_RECEIPT";
  assetId: string;
  producedBy: "TA-14-NIRET-GA-C1";
  gateAInputHash: string;
  /** s09 lineage: the sealed evidence windows, Recorder entries and Node observations each measurement came from. */
  inputManifest: GateAInputManifest;
  receiptId: string;
  receiptContentHash: string;
  receipt: Record<string, unknown>;
}

/** A C1-R7 validity-terminating state change, recorded against the asset. */
export interface MaterialChangeRecord extends ChainFields {
  kind: "MATERIAL_CHANGE";
  assetId: string;
  changeType: string;
  detail: unknown;
}

export interface GapRecord extends ChainFields {
  kind: "GAP";
  gapType: "SEQUENCE_GAP" | "TIME_GAP";
  stream: { provider: string; deviceId: string; channel: Channel };
  after: { sequence: number; observedAt: string } | null;
  before: { sequence: number; observedAt: string } | null;
  missingSequences: { from: number; to: number } | null;
  gapSeconds: number | null;
  reasonCodes: string[];
}

export type EntryRecord = ObservationRecord | CorrectionRecord;
export type EventLikeRecord = EventRecord | RejectedSubmissionRecord | PrematurePressureRecord | GateAReceiptRecord | MaterialChangeRecord;
export type ChainRecord = EntryRecord | EventLikeRecord | GapRecord;

export const ENTRY_KINDS: ReadonlySet<RecordKind> = new Set(["OBSERVATION", "CORRECTION"]);
export const EVENT_KINDS: ReadonlySet<RecordKind> = new Set(["EVENT", "REJECTED_SUBMISSION", "PREMATURE_PRESSURE_ENTRY", "GATE_A_RECEIPT", "MATERIAL_CHANGE"]);

export interface CloseTrigger {
  type: CloseTriggerType;
  ref: string | null;
  by: Submitter | null;
}

/** s03 evidence window as exported by the Recorder. */
export interface EvidenceWindow extends WindowHeader {
  windowId: string;
  headerHash: string;
  entries: EntryRecord[];
  events: EventLikeRecord[];
  gaps: GapRecord[];
  closeTrigger: CloseTrigger | null;
  closedAt: string | null;
  continuityStatus: ContinuityStatus;
  lastEntryHash: string;
  sealHash: string | null;
  recorderSignature: { keyId: string; signature: string } | null;
}

export type Outcome<T> =
  | { accepted: true; record: T; reasonCodes: string[] }
  | { accepted: false; record: ChainRecord | null; reasonCodes: string[] };
