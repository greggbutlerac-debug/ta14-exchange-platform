export type GatewayDetermination = 'EVALUATING' | 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';

export type EnvironmentalObservation = {
  schema: 'ta14.environmental-observation.v1';
  source: { provider: string; deviceId: string; siteId: string };
  observedAt: string;
  receivedAt: string;
  sequence: number;
  zone: string;
  measurements: { co2Ppm: number; pm25UgM3: number; voc: number; temperatureC: number; rhPct: number };
  quality: { status: string; calibration: 'known' | 'unknown' | 'expired' };
  provenance: { adapter: string; requestId: string };
};

export type ContinuityPolicy = {
  maxSampleAgeSeconds: number;
  maxGapSeconds: number;
  minimumContinuityWindowSeconds: number;
};

export type AuthorityObject = {
  authorityId: string;
  issuer: string;
  subject: string;
  zoneScope: string;
  permittedConsequence: string;
  effectiveAt: string;
  expiresAt: string;
  revocationState: 'ACTIVE' | 'REVOKED';
  sourceReference: string;
};

export type GatewayResult = {
  recordId: string;
  propositionId: 'R1A' | 'R1B';
  determination: GatewayDetermination;
  continuity: 'INTACT' | 'DEGRADED' | 'BROKEN';
  admissibility: 'SUPPORTED' | 'HOLD' | 'UNSUPPORTED';
  authorityStatus: 'VERIFIED' | 'MISSING' | 'EXPIRED' | 'REVOKED' | 'OUT_OF_SCOPE';
  bindingScope: string | null;
  validUntil: string | null;
  reasonCodes: string[];
  limitations: string[];
  receipt: { hash: string; replayId: string };
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
}

export function evaluateGateway(input: {
  observations: EnvironmentalObservation[];
  policy: ContinuityPolicy;
  authority: AuthorityObject | null;
  consequence: string;
  now: string;
}): GatewayResult {
  const { observations, policy, authority, consequence, now } = input;
  const reasons: string[] = [];
  const limitations = ['NO_DIAGNOSIS', 'NO_COMPLIANCE_CERTIFICATION', 'NO_FUTURE_CONDITION_CERTIFICATION'];
  const nowMs = Date.parse(now);
  const ordered = [...observations].sort((a, b) => Date.parse(a.observedAt) - Date.parse(b.observedAt));
  const latest = ordered.at(-1);
  let continuity: GatewayResult['continuity'] = 'INTACT';
  let admissibility: GatewayResult['admissibility'] = 'SUPPORTED';
  let determination: GatewayDetermination = 'EVALUATING';

  if (!latest?.source.deviceId || !latest.observedAt || !latest.zone) {
    continuity = 'BROKEN'; admissibility = 'HOLD'; determination = 'HOLD'; reasons.push('MISSING_SOURCE_OR_TIME');
  }

  if (latest) {
    const ageSeconds = Math.max(0, (nowMs - Date.parse(latest.observedAt)) / 1000);
    if (ageSeconds > policy.maxSampleAgeSeconds) {
      continuity = 'BROKEN'; admissibility = 'HOLD'; determination = 'HOLD'; reasons.push('STALE_STREAM');
    } else reasons.push('FRESH_STREAM');

    const sourceChanged = ordered.some((item) => item.source.deviceId !== latest.source.deviceId || item.zone !== latest.zone);
    if (sourceChanged) {
      continuity = 'BROKEN'; admissibility = 'HOLD'; determination = 'HOLD'; reasons.push('SOURCE_IDENTITY_CHANGED');
    }

    for (let i = 1; i < ordered.length; i += 1) {
      const gap = (Date.parse(ordered[i].observedAt) - Date.parse(ordered[i - 1].observedAt)) / 1000;
      if (gap > policy.maxGapSeconds) {
        continuity = 'BROKEN'; admissibility = 'HOLD'; determination = 'HOLD'; reasons.push('GAP_BEYOND_TOLERANCE'); break;
      }
    }

    const historySeconds = ordered.length > 1 ? (Date.parse(latest.observedAt) - Date.parse(ordered[0].observedAt)) / 1000 : 0;
    if (historySeconds < policy.minimumContinuityWindowSeconds) {
      admissibility = 'HOLD'; determination = 'HOLD'; reasons.push('CONTINUITY_WINDOW_NOT_MET');
    } else reasons.push('CONTINUITY_WINDOW_MET');

    if (latest.quality.status !== 'reported') {
      admissibility = 'HOLD'; determination = 'HOLD'; reasons.push('QUALITY_STATUS_NOT_RELIABLE');
    }
  }

  let authorityStatus: GatewayResult['authorityStatus'] = 'MISSING';
  if (authority) {
    if (authority.revocationState === 'REVOKED') authorityStatus = 'REVOKED';
    else if (Date.parse(authority.expiresAt) <= nowMs) authorityStatus = 'EXPIRED';
    else if (latest && authority.zoneScope !== latest.zone) authorityStatus = 'OUT_OF_SCOPE';
    else if (authority.permittedConsequence !== consequence) authorityStatus = 'OUT_OF_SCOPE';
    else authorityStatus = 'VERIFIED';
  }

  if (determination !== 'HOLD') {
    if (!authority) { determination = 'HOLD'; reasons.push('AUTHORITY_MISSING'); }
    else if (authorityStatus === 'REVOKED' || authorityStatus === 'EXPIRED') { determination = 'DENY'; reasons.push(`AUTHORITY_${authorityStatus}`); }
    else if (authorityStatus === 'OUT_OF_SCOPE') { determination = 'DENY'; reasons.push('AUTHORITY_OUT_OF_SCOPE'); }
    else { determination = 'ALLOW'; reasons.push('AUTHORITY_VALID', 'BINDING_SCOPE_MATCHED'); }
  }

  const recordId = `TA14-AIR-HIBOU-${latest?.sequence ?? 0}`;
  const canonical = JSON.stringify({ ordered, policy, authority, consequence, now, determination, reasons });
  return {
    recordId,
    propositionId: 'R1B',
    determination,
    continuity,
    admissibility,
    authorityStatus,
    bindingScope: authorityStatus === 'VERIFIED' ? consequence : null,
    validUntil: latest && determination === 'ALLOW' ? new Date(Date.parse(latest.observedAt) + policy.maxSampleAgeSeconds * 1000).toISOString() : null,
    reasonCodes: reasons,
    limitations,
    receipt: { hash: `fnv1a:${hashString(canonical)}`, replayId: `REPLAY-${hashString(canonical + recordId)}` },
  };
}

export function buildDemoObservations(now = new Date()): EnvironmentalObservation[] {
  const result: EnvironmentalObservation[] = [];
  for (let minute = 10; minute >= 0; minute -= 1) {
    const at = new Date(now.getTime() - minute * 60_000);
    result.push({
      schema: 'ta14.environmental-observation.v1',
      source: { provider: 'HibouAir', deviceId: 'HIBOU-R1-DEMO-01', siteId: 'TA14-PRIVATE-LAB' },
      observedAt: at.toISOString(), receivedAt: new Date(at.getTime() + 3_000).toISOString(), sequence: 18421 - minute,
      zone: 'declared-zone-01',
      measurements: { co2Ppm: 912 + (10 - minute) * 3, pm25UgM3: 7.4, voc: 118, temperatureC: 23.1, rhPct: 49.2 },
      quality: { status: 'reported', calibration: 'unknown' },
      provenance: { adapter: 'hibouair-r1-simulator', requestId: `demo-${18421 - minute}` },
    });
  }
  return result;
}
