import { buildDemoObservations, evaluateGateway, type AuthorityObject, type EnvironmentalObservation, type GatewayDetermination } from './environmental-evidence-gateway';

type Scenario = { id: string; name: string; expected: GatewayDetermination; actual: GatewayDetermination; pass: boolean; reasonCodes: string[] };

const policy = { maxSampleAgeSeconds: 60, maxGapSeconds: 120, minimumContinuityWindowSeconds: 600 };
const consequence = 'ventilation_increase_only';

function authority(now: Date, overrides: Partial<AuthorityObject> = {}): AuthorityObject {
  return { authorityId: 'AUTH-VENT-001', issuer: 'TA-14 PRIVATE R1', subject: 'DECLARED OPERATOR', zoneScope: 'declared-zone-01', permittedConsequence: consequence, effectiveAt: new Date(now.getTime() - 3_600_000).toISOString(), expiresAt: new Date(now.getTime() + 3_600_000).toISOString(), revocationState: 'ACTIVE', sourceReference: 'PRIVATE-R1-DEMO-AUTHORITY', ...overrides };
}

function run(id: string, name: string, expected: GatewayDetermination, observations: EnvironmentalObservation[], now: Date, auth: AuthorityObject | null, requestedConsequence = consequence): Scenario {
  const result = evaluateGateway({ observations, policy, authority: auth, consequence: requestedConsequence, now: now.toISOString() });
  return { id, name, expected, actual: result.determination, pass: result.determination === expected, reasonCodes: result.reasonCodes };
}

export function runEnvironmentalGatewayConformance(now = new Date()): Scenario[] {
  const healthy = buildDemoObservations(now);
  const stale = healthy.map((o) => ({ ...o, observedAt: new Date(Date.parse(o.observedAt) - 5 * 60_000).toISOString() }));
  const shortWindow = healthy.slice(-3);
  const sourceSwap = healthy.map((o, i) => i === 5 ? { ...o, source: { ...o.source, deviceId: 'HIBOU-R1-DEMO-02' } } : o);
  const gap = healthy.map((o, i) => i >= 6 ? { ...o, observedAt: new Date(Date.parse(o.observedAt) + 4 * 60_000).toISOString() } : o);
  const poorQuality = healthy.map((o, i) => i === healthy.length - 1 ? { ...o, quality: { ...o.quality, status: 'fault' } } : o);

  return [
    run('T01', 'Healthy stream + valid authority', 'ALLOW', healthy, now, authority(now)),
    run('T02', 'Stale stream', 'HOLD', stale, now, authority(now)),
    run('T03', 'Missing authority', 'HOLD', healthy, now, null),
    run('T04', 'Revoked authority', 'DENY', healthy, now, authority(now, { revocationState: 'REVOKED' })),
    run('T05', 'Expired authority', 'DENY', healthy, now, authority(now, { expiresAt: new Date(now.getTime() - 1000).toISOString() })),
    run('T06', 'Authority outside zone', 'DENY', healthy, now, authority(now, { zoneScope: 'other-zone' })),
    run('T07', 'Consequence outside authority', 'DENY', healthy, now, authority(now), 'equipment_shutdown'),
    run('T08', 'Insufficient continuity window', 'HOLD', shortWindow, now, authority(now)),
    run('T09', 'Source identity changes mid-stream', 'HOLD', sourceSwap, now, authority(now)),
    run('T10', 'Gap beyond continuity tolerance', 'HOLD', gap, now, authority(now)),
    run('T11', 'Latest observation quality fault', 'HOLD', poorQuality, now, authority(now)),
    run('T12', 'Deterministic replay of identical evidence', 'ALLOW', healthy, now, authority(now)),
  ];
}

export function summarizeEnvironmentalGatewayConformance(now = new Date()) {
  const scenarios = runEnvironmentalGatewayConformance(now);
  const passed = scenarios.filter((scenario) => scenario.pass).length;
  return { scenarios, passed, failed: scenarios.length - passed, total: scenarios.length, overall: passed === scenarios.length ? 'PASS' : 'FAIL' as 'PASS' | 'FAIL' };
}
