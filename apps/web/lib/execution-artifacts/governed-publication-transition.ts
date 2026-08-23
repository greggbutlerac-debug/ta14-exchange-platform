import {
  transitionRegistryState,
  type ArtifactRegistryRecord,
  type RegistryTransitionRequest,
  type RegistryTransitionResult,
} from "./artifact-registry-engine";
import {
  evaluateRegistryCorpusForPublication,
  type PublicationIntegrityOptions,
} from "./registry-publication-integrity-gate";

export interface GovernedPublicationTransitionRequest
  extends Omit<RegistryTransitionRequest, "toState"> {
  toState: "PUBLISHED";
  /** Current persisted corpus before this transition is committed. */
  registryCorpus: readonly ArtifactRegistryRecord[];
  integrityOptions?: PublicationIntegrityOptions;
}

export interface GovernedPublicationTransitionResult
  extends RegistryTransitionResult {
  publicationIntegrity: ReturnType<typeof evaluateRegistryCorpusForPublication>;
}

/**
 * Corpus-aware governed publication path.
 *
 * The core Registry Engine remains deterministic and single-record scoped.
 * This wrapper supplies the missing corpus context before a record may enter
 * PUBLISHED / PUBLIC_RELIANCE. The candidate record replaces any existing
 * record with the same registry id for evaluation, preventing self-duplication
 * while still detecting correspondence against every other artifact.
 */
export function transitionRegistryRecordToPublished(
  request: GovernedPublicationTransitionRequest,
): GovernedPublicationTransitionResult {
  const corpusWithoutCandidate = request.registryCorpus.filter(
    (record) => record.registryId !== request.record.registryId,
  );
  const candidateCorpus = [...corpusWithoutCandidate, request.record];
  const publicationIntegrity = evaluateRegistryCorpusForPublication(
    candidateCorpus,
    request.integrityOptions,
  );

  if (!publicationIntegrity.allowed) {
    return {
      allowed: false,
      issues: [
        {
          code: "REGISTRATION_COMMIT_FAILED",
          path: "publicationIntegrity",
          message: publicationIntegrity.message,
          disposition: "HOLD",
          publicRelianceBlocked: true,
          repairHint:
            "Preserve the colliding records, establish source correspondence or explicit shared lineage, then resubmit the publication transition.",
          details: {
            reasonCode: publicationIntegrity.reasonCode,
            collisionCount: publicationIntegrity.report.collisionCount,
            unexplainedCollisionCount:
              publicationIntegrity.report.unexplainedCollisionCount,
            collisions: publicationIntegrity.report.collisions,
          },
        },
      ],
      publicationIntegrity,
    };
  }

  const { registryCorpus: _registryCorpus, integrityOptions: _integrityOptions, ...transition } = request;
  const result = transitionRegistryState({
    ...transition,
    toState: "PUBLISHED",
  });

  return {
    ...result,
    publicationIntegrity,
  };
}
