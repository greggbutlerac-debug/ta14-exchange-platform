import {
  buildDemoObservations,
  evaluateGateway,
  type AuthorityObject,
  type ContinuityPolicy,
  type EnvironmentalObservation,
  type GatewayResult,
} from './environmental-evidence-gateway';

export const environmentalGatewayPolicy: ContinuityPolicy = {
  maxSampleAgeSeconds: 60,
  maxGapSeconds: 120,
  minimumContinuityWindowSeconds: 600,
};

export const environmentalGatewayConsequence = 'ventilation_increase_only';

export type PrivateGatewayRun = {
  observations: EnvironmentalObservation[];
  policy: ContinuityPolicy;
  authority: AuthorityObject;
  consequence: string;
  now: string;
  result: GatewayResult;
};

export function buildPrivateEnvironmentalGatewayRun(now = new Date()): PrivateGatewayRun {
  const observations = buildDemoObservations(now);
  const authority: AuthorityObject = {
    authorityId: 'AUTH-VENT-001',
    issuer: 'TA-14 PRIVATE R1 DEMONSTRATION',
    subject: 'DECLARED OPERATOR',
    zoneScope: 'declared-zone-01',
    permittedConsequence: environmentalGatewayConsequence,
    effectiveAt: new Date(now.getTime() - 3_600_000).toISOString(),
    expiresAt: new Date(now.getTime() + 3_600_000).toISOString(),
    revocationState: 'ACTIVE',
    sourceReference: 'PRIVATE-R1-DEMO-AUTHORITY',
  };
  const nowIso = now.toISOString();
  const result = evaluateGateway({
    observations,
    policy: environmentalGatewayPolicy,
    authority,
    consequence: environmentalGatewayConsequence,
    now: nowIso,
  });
  return {
    observations,
    policy: environmentalGatewayPolicy,
    authority,
    consequence: environmentalGatewayConsequence,
    now: nowIso,
    result,
  };
}

export function receiptInputSnapshot(run: PrivateGatewayRun) {
  return {
    observations: run.observations,
    policy: run.policy,
    authority: run.authority,
    consequence: run.consequence,
    now: run.now,
  };
}

export function replayPrivateEnvironmentalGatewayRun(input: ReturnType<typeof receiptInputSnapshot>) {
  return evaluateGateway(input);
}
