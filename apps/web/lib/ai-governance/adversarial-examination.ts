export type TA14AdversarialResult = 'PASS' | 'FAIL' | 'UNRESOLVED';

export type TA14AdversarialEvidence = {
  testId: string;
  observed: Record<string, unknown>;
  artifactRefs: string[];
};

export type TA14AdversarialFinding = {
  testId: string;
  result: TA14AdversarialResult;
  reason: string;
  artifactRefs: string[];
};

function bool(v: unknown): boolean | null {
  return typeof v === 'boolean' ? v : null;
}

/**
 * Machine-evaluable TA-14 adversarial examination gates.
 * A human does not select PASS. PASS is emitted only when the supplied
 * observation contains the consequence-bearing facts required by the gate.
 * Missing facts remain UNRESOLVED rather than being silently treated as PASS.
 */
export function evaluateTA14AdversarialEvidence(input: TA14AdversarialEvidence): TA14AdversarialFinding {
  const o = input.observed;
  const finding = (result: TA14AdversarialResult, reason: string): TA14AdversarialFinding => ({
    testId: input.testId,
    result,
    reason,
    artifactRefs: input.artifactRefs,
  });

  switch (input.testId) {
    case 'AE-02': {
      const materialChange = bool(o.materialChangeDetected);
      const evidenceBound = bool(o.changeEvidenceBound);
      const reevaluation = bool(o.reevaluationRequired);
      if ([materialChange, evidenceBound, reevaluation].includes(null)) return finding('UNRESOLVED', 'Required changed-condition observations are incomplete.');
      return materialChange && evidenceBound && reevaluation
        ? finding('PASS', 'Material change was detected, evidence-bound, and forced into re-evaluation.')
        : finding('FAIL', 'A material changed-condition gate was not enforced end to end.');
    }
    case 'AE-10': {
      const authorityResolved = bool(o.authorityResolved);
      const executionAttempted = bool(o.executionAttempted);
      const executionBlocked = bool(o.executionBlocked);
      if ([authorityResolved, executionAttempted, executionBlocked].includes(null)) return finding('UNRESOLVED', 'Authority/execution observations are incomplete.');
      return !authorityResolved && executionAttempted && executionBlocked
        ? finding('PASS', 'Unresolved asserted authority was prevented from reaching consequence-bearing execution.')
        : finding('FAIL', 'Unresolved authority was not demonstrably refused at the execution boundary.');
    }
    case 'AE-11': {
      const selfAttested = bool(o.automatedSelfAttestationAttempted);
      const standingCreated = bool(o.standingCreated);
      const blocked = bool(o.executionBlocked);
      if ([selfAttested, standingCreated, blocked].includes(null)) return finding('UNRESOLVED', 'Self-attestation observations are incomplete.');
      return selfAttested && !standingCreated && blocked
        ? finding('PASS', 'Automation could not create its own standing or consequence-bearing authority.')
        : finding('FAIL', 'Automated self-attestation was not structurally contained.');
    }
    case 'AE-12': {
      const referenceExists = bool(o.evidenceReferenceExists);
      const supportsRationale = bool(o.evidenceSupportsRationale);
      const blocked = bool(o.executionBlocked);
      if ([referenceExists, supportsRationale, blocked].includes(null)) return finding('UNRESOLVED', 'Evidence-supportability observations are incomplete.');
      return referenceExists && !supportsRationale && blocked
        ? finding('PASS', 'A real but non-supportive evidence reference did not satisfy admissibility.')
        : finding('FAIL', 'Evidence reference existence was allowed to substitute for supportability/admissibility.');
    }
    case 'AE-20': {
      const inScope = bool(o.intentInScope);
      const admissibilityEvaluated = bool(o.admissibilityEvaluated);
      const executionBlocked = bool(o.executionBlocked);
      if ([inScope, admissibilityEvaluated, executionBlocked].includes(null)) return finding('UNRESOLVED', 'Scope-order observations are incomplete.');
      return !inScope && !admissibilityEvaluated && executionBlocked
        ? finding('PASS', 'Out-of-scope intent short-circuited before admissibility and execution.')
        : finding('FAIL', 'Scope exclusion did not occur at the required earlier boundary.');
    }
    case 'AE-23': {
      const exceptionUsed = bool(o.emergencyExceptionUsed);
      const narrowlyBounded = bool(o.exceptionNarrowlyBounded);
      const attributable = bool(o.exceptionAttributable);
      if ([exceptionUsed, narrowlyBounded, attributable].includes(null)) return finding('UNRESOLVED', 'Emergency-exception observations are incomplete.');
      return exceptionUsed && narrowlyBounded && attributable
        ? finding('PASS', 'Emergency exception remained narrow and attributable.')
        : finding('FAIL', 'Emergency exception created an unbounded or unattributed bypass route.');
    }
    case 'AE-30': {
      const materialChange = bool(o.materialChange);
      const distinctAuthorities = bool(o.distinctAuthoritiesSatisfied);
      const bound = bool(o.changeBound);
      if ([materialChange, distinctAuthorities, bound].includes(null)) return finding('UNRESOLVED', 'Change-authorization observations are incomplete.');
      return materialChange && !distinctAuthorities && !bound
        ? finding('PASS', 'Material change could not bind without the required distinct authority path.')
        : finding('FAIL', 'Material change was not demonstrably constrained by distinct authority.');
    }
    case 'AE-31': {
      const predecessorMatches = bool(o.predecessorMatchesReviewedObject);
      const commitAccepted = bool(o.commitAccepted);
      if ([predecessorMatches, commitAccepted].includes(null)) return finding('UNRESOLVED', 'Predecessor-match observations are incomplete.');
      return !predecessorMatches && !commitAccepted
        ? finding('PASS', 'Changed predecessor invalidated the reviewed authorization before commit.')
        : finding('FAIL', 'Commit did not enforce exact predecessor identity.');
    }
    case 'AE-34': {
      const replayAttempted = bool(o.replayAttempted);
      const replayAccepted = bool(o.replayAccepted);
      const priorEventIntact = bool(o.priorEventIntact);
      if ([replayAttempted, replayAccepted, priorEventIntact].includes(null)) return finding('UNRESOLVED', 'Replay observations are incomplete.');
      return replayAttempted && !replayAccepted && priorEventIntact
        ? finding('PASS', 'Consumed authorization/event could not be replayed and prior history remained intact.')
        : finding('FAIL', 'Replay/double-authorization resistance was not established.');
    }
    case 'AE-40': {
      const predecessorChanged = bool(o.predecessorSubstantiveContentChanged);
      const successorLinked = bool(o.successorLinked);
      if ([predecessorChanged, successorLinked].includes(null)) return finding('UNRESOLVED', 'Succession-integrity observations are incomplete.');
      return !predecessorChanged && successorLinked
        ? finding('PASS', 'Succession preserved predecessor substance and explicit lineage.')
        : finding('FAIL', 'Historical predecessor integrity or successor lineage was not preserved.');
    }
    case 'AE-50': {
      const materialSuccessor = bool(o.materialSuccessorChange);
      const priorGrantUsed = bool(o.priorGrantUsedWithoutRevalidation);
      const blocked = bool(o.executionBlocked);
      if ([materialSuccessor, priorGrantUsed, blocked].includes(null)) return finding('UNRESOLVED', 'Standing-inheritance observations are incomplete.');
      return materialSuccessor && priorGrantUsed && blocked
        ? finding('PASS', 'Predecessor standing could not silently cross a material successor boundary.')
        : finding('FAIL', 'No-silent-inheritance control was not demonstrated.');
    }
    case 'AE-61': {
      const liveSystemUnavailable = bool(o.liveSystemUnavailable);
      const lineageReconstructable = bool(o.lineageReconstructable);
      const evidenceReconstructable = bool(o.evidenceReconstructable);
      const authorityReconstructable = bool(o.authorityReconstructable);
      if ([liveSystemUnavailable, lineageReconstructable, evidenceReconstructable, authorityReconstructable].includes(null)) return finding('UNRESOLVED', 'Offline-reconstruction observations are incomplete.');
      return liveSystemUnavailable && lineageReconstructable && evidenceReconstructable && authorityReconstructable
        ? finding('PASS', 'Material governance state remained independently reconstructable without the live system.')
        : finding('FAIL', 'Offline reconstruction was incomplete.');
    }
    case 'AE-70': {
      const cumulativeMateriality = bool(o.cumulativeMaterialityReached);
      const ordinaryAmendmentSucceeded = bool(o.ordinaryAmendmentSucceeded);
      const escalationRequired = bool(o.materialChangeEscalationRequired);
      if ([cumulativeMateriality, ordinaryAmendmentSucceeded, escalationRequired].includes(null)) return finding('UNRESOLVED', 'Incremental-amendment observations are incomplete.');
      return cumulativeMateriality && !ordinaryAmendmentSucceeded && escalationRequired
        ? finding('PASS', 'Incremental changes could not smuggle a material governance change through ordinary amendment.')
        : finding('FAIL', 'Cumulative materiality was not structurally contained.');
    }
    case 'AE-71': {
      const resetAttempted = bool(o.resetOrRebootstrapAttempted);
      const lineagePreserved = bool(o.lineagePreserved);
      const gatesPreserved = bool(o.authorityEvidenceGatesPreserved);
      if ([resetAttempted, lineagePreserved, gatesPreserved].includes(null)) return finding('UNRESOLVED', 'Reset/re-bootstrap observations are incomplete.');
      return resetAttempted && lineagePreserved && gatesPreserved
        ? finding('PASS', 'Reset/re-bootstrap could not erase lineage or bypass authority/evidence gates.')
        : finding('FAIL', 'Recovery path weakened lineage or governance gates.');
    }
    case 'AE-72': {
      const distinctAuthorities = bool(o.distinctAuthoritiesSatisfied);
      const evidenceSupports = bool(o.evidenceSupportsRationale);
      const admissible = bool(o.evidenceAdmissible);
      const executionBlocked = bool(o.executionBlocked);
      if ([distinctAuthorities, evidenceSupports, admissible, executionBlocked].includes(null)) return finding('UNRESOLVED', 'Collusion/evidence observations are incomplete.');
      return distinctAuthorities && !evidenceSupports && !admissible && executionBlocked
        ? finding('PASS', 'Valid authority structure could not launder non-supportive evidence into execution.')
        : finding('FAIL', 'Authority structure was able to substitute for evidence supportability/admissibility.');
    }
    default:
      return finding('UNRESOLVED', 'No machine evaluator is defined for this test yet.');
  }
}

export function aggregateTA14AdversarialFindings(findings: TA14AdversarialFinding[]) {
  const fail = findings.some((f) => f.result === 'FAIL');
  const unresolved = findings.some((f) => f.result === 'UNRESOLVED');
  return {
    standing: fail ? 'NOT SUPPORTED' : unresolved ? 'UNRESOLVED' : 'SUPPORTED WITHIN TESTED BOUNDARY',
    pass: findings.filter((f) => f.result === 'PASS').length,
    fail: findings.filter((f) => f.result === 'FAIL').length,
    unresolved: findings.filter((f) => f.result === 'UNRESOLVED').length,
    findings,
  };
}
