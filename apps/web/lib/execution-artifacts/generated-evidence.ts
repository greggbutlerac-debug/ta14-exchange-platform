import { ALL_EXECUTABLE_ARTIFACT_SPECIFICATIONS, assertCompleteExecutableCorpus } from "./artifact-specification-registry";
import { executeArtifactSpecification, type ExecutionEvidencePackage } from "./execution-harness";

/**
 * Stable execution instant for the first executable-corpus publication.
 * This is a new execution event, not a retroactive timestamp for historical
 * registry declarations. Replays may supply a different execution instant and
 * must therefore produce a distinct receipt/package root while preserving the
 * same frozen specification hash and governed determination.
 */
export const EXECUTABLE_CORPUS_PUBLICATION_EXECUTED_AT = "2026-08-23T21:00:00.000Z";

assertCompleteExecutableCorpus();

export const GENERATED_EXECUTION_EVIDENCE: readonly ExecutionEvidencePackage[] =
  ALL_EXECUTABLE_ARTIFACT_SPECIFICATIONS.map((specification) =>
    executeArtifactSpecification(specification, EXECUTABLE_CORPUS_PUBLICATION_EXECUTED_AT),
  );

export function getGeneratedExecutionEvidence(artifactId: string): ExecutionEvidencePackage | undefined {
  return GENERATED_EXECUTION_EVIDENCE.find((result) => result.specification.artifactId === artifactId);
}

export function replayExecutableArtifact(artifactId: string, executedAt = new Date().toISOString()): ExecutionEvidencePackage {
  const specification = ALL_EXECUTABLE_ARTIFACT_SPECIFICATIONS.find((candidate) => candidate.artifactId === artifactId);
  if (!specification) throw new Error(`Unknown executable artifact: ${artifactId}`);
  return executeArtifactSpecification(specification, executedAt);
}
