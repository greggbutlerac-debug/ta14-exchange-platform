import type { GapIxcDetermination, GapIxcPropositionFreeze } from "./types";

export type HistoricalVerificationLevel = "L0" | "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7";

export type GapIxcPropositionRecord = {
  propositionId: string;
  architectureRegistryId: string;
  architectureVersion: string;
  text: string;
  status: "DECLARED" | "FROZEN" | "ASSESSED" | "SUPERSEDED" | "WITHDRAWN";
  claimType: "CLAIM" | "NON_CLAIM" | "BOUNDARY";
  createdAt: string;
  supersedes?: string;
};

export type GapIxcEvidenceRecord = {
  evidenceId: string;
  sourceId: string;
  title: string;
  provenance: string;
  evidenceClass: string;
  integrity?: string;
  temporalRelevance?: string;
  lineage?: string[];
  admittedFor: string[];
  limitations: string[];
};

export type GapIxcRegistryEnvelope = {
  architectureRegistryId: string;
  architectureVersion: string;
  historicalVerificationLevel?: HistoricalVerificationLevel;
  historicalSourceId?: string;
  propositionIds: string[];
  evidenceIds: string[];
  freezeIds: string[];
  determinationIds: string[];
  currentRevalidationState: "CURRENT" | "REVALIDATION_REQUIRED" | "SUPERSEDED" | "HISTORICAL_ONLY";
};

export type LegacyExecutionArtifact = {
  artifactId: string;
  governanceRegistryId: string;
  verificationLevel?: HistoricalVerificationLevel;
};

export function legacyArtifactEnvelope(artifact: LegacyExecutionArtifact): GapIxcRegistryEnvelope {
  return {
    architectureRegistryId: artifact.governanceRegistryId,
    architectureVersion: "HISTORICAL_VERSION_NOT_MIGRATED",
    historicalVerificationLevel: artifact.verificationLevel,
    historicalSourceId: artifact.artifactId,
    propositionIds: [],
    evidenceIds: [],
    freezeIds: [],
    determinationIds: [],
    currentRevalidationState: "HISTORICAL_ONLY",
  };
}

export type GapIxcRegistryStore = {
  propositions: GapIxcPropositionRecord[];
  evidence: GapIxcEvidenceRecord[];
  freezes: GapIxcPropositionFreeze[];
  determinations: GapIxcDetermination[];
};

export const EMPTY_GAP_IXC_REGISTRY: GapIxcRegistryStore = {
  propositions: [],
  evidence: [],
  freezes: [],
  determinations: [],
};
