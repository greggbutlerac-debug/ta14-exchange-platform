export type ChallengeSelectionProtocol = {
  claimSurfaceRef: string;
  populationDerivationMethod: string;
  populationDigest: string;
  populationSize: number;
  selectedChallengeIds: string[];
  selectionMethod: string;
  selectionCommitment: string;
  selectionReveal?: string;
  selectorAuthority: string;
  populationDerivationAuthority: string;
  examinedCount: number;
  exclusions: Array<{ conditionId: string; justification: string }>;
};

export type ChallengeCoverage = {
  examined: number;
  population: number;
  ratio: number;
  statement: string;
};

export function validateChallengeSelectionProtocol(protocol: ChallengeSelectionProtocol): string[] {
  const failures: string[] = [];
  if (!protocol.claimSurfaceRef.trim()) failures.push('CLAIM_SURFACE_REF_REQUIRED');
  if (!protocol.populationDerivationMethod.trim()) failures.push('POPULATION_DERIVATION_METHOD_REQUIRED');
  if (!protocol.populationDigest.trim()) failures.push('POPULATION_DIGEST_REQUIRED');
  if (!Number.isInteger(protocol.populationSize) || protocol.populationSize < 1) failures.push('POPULATION_SIZE_INVALID');
  if (!protocol.selectionMethod.trim()) failures.push('SELECTION_METHOD_REQUIRED');
  if (!protocol.selectionCommitment.trim()) failures.push('SELECTION_COMMITMENT_REQUIRED');
  if (!protocol.selectorAuthority.trim()) failures.push('SELECTOR_AUTHORITY_REQUIRED');
  if (!protocol.populationDerivationAuthority.trim()) failures.push('POPULATION_DERIVATION_AUTHORITY_REQUIRED');
  if (!protocol.selectedChallengeIds.length) failures.push('SELECTED_CHALLENGE_REQUIRED');
  if (protocol.examinedCount !== protocol.selectedChallengeIds.length) failures.push('EXAMINED_COUNT_MISMATCH');
  if (protocol.examinedCount > protocol.populationSize) failures.push('COVERAGE_EXCEEDS_POPULATION');
  return failures;
}

export function deriveChallengeCoverage(protocol: ChallengeSelectionProtocol): ChallengeCoverage {
  const failures = validateChallengeSelectionProtocol(protocol);
  if (failures.length) throw new Error(`Challenge selection protocol invalid: ${failures.join(', ')}`);
  const ratio = protocol.examinedCount / protocol.populationSize;
  return {
    examined: protocol.examinedCount,
    population: protocol.populationSize,
    ratio,
    statement: `${protocol.examinedCount}/${protocol.populationSize} challenge conditions examined. No standing is implied for unexamined conditions.`,
  };
}
