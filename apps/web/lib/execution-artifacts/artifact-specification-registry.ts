import type { ArtifactTestSpecification } from "./execution-harness";
import { FOUNDING_CORPUS_SPECIFICATIONS } from "./specifications/founding-corpus-specifications";
import { SECOND_CORPUS_SPECIFICATIONS } from "./specifications/second-corpus-specifications";
import { EVIDENCE_HARDENING_SPECIFICATIONS } from "./specifications/evidence-hardening-specifications";

export const ALL_EXECUTABLE_ARTIFACT_SPECIFICATIONS: readonly ArtifactTestSpecification[] = [
  ...FOUNDING_CORPUS_SPECIFICATIONS,
  ...SECOND_CORPUS_SPECIFICATIONS,
  ...EVIDENCE_HARDENING_SPECIFICATIONS,
];

export function getExecutableArtifactSpecification(artifactId: string): ArtifactTestSpecification | undefined {
  return ALL_EXECUTABLE_ARTIFACT_SPECIFICATIONS.find((specification) => specification.artifactId === artifactId);
}

export function assertCompleteExecutableCorpus(): void {
  if (ALL_EXECUTABLE_ARTIFACT_SPECIFICATIONS.length !== 40) {
    throw new Error(`Expected 40 executable artifact specifications; found ${ALL_EXECUTABLE_ARTIFACT_SPECIFICATIONS.length}.`);
  }

  const ids = new Set(ALL_EXECUTABLE_ARTIFACT_SPECIFICATIONS.map((specification) => specification.artifactId));
  if (ids.size !== 40) throw new Error("Executable artifact corpus contains duplicate artifact IDs.");

  for (let n = 1; n <= 40; n += 1) {
    const artifactId = `TA14-EA-${String(n).padStart(6, "0")}`;
    if (!ids.has(artifactId)) throw new Error(`Executable artifact corpus is missing ${artifactId}.`);
  }
}
