import { createHash } from 'node:crypto';

export type AuthorityDetermination = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
export type StandingState = 'CURRENT' | 'CHALLENGED' | 'EXPIRED' | 'REVOKED';

export type GovernedAsset = {
  assetId: string;
  version: string;
  routeId: string;
  consequence: string;
};

export type AuthorityGrant = {
  authorityId: string;
  assetId: string;
  assetVersion: string;
  routeId: string;
  consequence: string;
  effectiveAt: string;
  expiresAt: string;
  revoked: boolean;
};

export type MaterialChange = {
  changeId: string;
  detectedAt: string;
  category: 'MODEL' | 'PROMPT' | 'DATA' | 'VENDOR' | 'POLICY' | 'OPERATIONAL' | 'OTHER';
  material: boolean;
  description: string;
};

export type EvidenceStanding = {
  continuitySupported: boolean;
  admissibilitySupported: boolean;
  evidenceId: string;
};

export type AuthorityEvaluation = {
  determination: AuthorityDetermination;
  standing: StandingState;
  bindingScope: string | null;
  reasonCodes: string[];
  receipt: {
    algorithm: 'SHA-256';
    canonicalVersion: 'TA14.GCEA.RECEIPT.v1';
    hash: string;
    replayId: string;
    payload: unknown;
  };
};

function stable(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(',')}}`;
}

export function evaluateExecutionAuthority(input: {
  asset: GovernedAsset;
  authority: AuthorityGrant | null;
  change: MaterialChange | null;
  evidence: EvidenceStanding;
  now: string;
}): AuthorityEvaluation {
  const { asset, authority, change, evidence, now } = input;
  const reasons: string[] = [];
  let standing: StandingState = 'CURRENT';
  let determination: AuthorityDetermination = 'ALLOW';

  if (!evidence.continuitySupported || !evidence.admissibilitySupported) {
    determination = 'HOLD';
    reasons.push(!evidence.continuitySupported ? 'CONTINUITY_UNSUPPORTED' : 'ADMISSIBILITY_UNSUPPORTED');
  }

  if (change?.material) {
    standing = 'CHALLENGED';
    determination = 'HOLD';
    reasons.push('MATERIAL_CHANGE_REQUIRES_REAUTHORIZATION');
  }

  if (!authority) {
    determination = 'HOLD';
    reasons.push('AUTHORITY_ABSENT');
  } else if (authority.revoked) {
    standing = 'REVOKED';
    determination = 'DENY';
    reasons.push('AUTHORITY_REVOKED');
  } else if (new Date(authority.effectiveAt).getTime() > new Date(now).getTime()) {
    determination = 'HOLD';
    reasons.push('AUTHORITY_NOT_EFFECTIVE');
  } else if (new Date(authority.expiresAt).getTime() <= new Date(now).getTime()) {
    standing = 'EXPIRED';
    determination = 'DENY';
    reasons.push('AUTHORITY_EXPIRED');
  } else if (authority.assetId !== asset.assetId || authority.assetVersion !== asset.version || authority.routeId !== asset.routeId || authority.consequence !== asset.consequence) {
    determination = 'DENY';
    reasons.push('AUTHORITY_SCOPE_MISMATCH');
  }

  const bindingScope = determination === 'ALLOW' && standing === 'CURRENT' && evidence.continuitySupported && evidence.admissibilitySupported
    ? asset.consequence
    : null;

  if (determination === 'ALLOW') reasons.push('PRESENT_STANDING_ESTABLISHED');

  const payload = {
    canonicalVersion: 'TA14.GCEA.RECEIPT.v1',
    asset,
    authority,
    change,
    evidence,
    now,
    determination,
    standing,
    bindingScope,
    reasonCodes: reasons,
  };
  const hash = createHash('sha256').update(stable(payload)).digest('hex');

  return {
    determination,
    standing,
    bindingScope,
    reasonCodes: reasons,
    receipt: {
      algorithm: 'SHA-256',
      canonicalVersion: 'TA14.GCEA.RECEIPT.v1',
      hash,
      replayId: `TA14-GCEA-${hash.slice(0, 20).toUpperCase()}`,
      payload,
    },
  };
}

export function buildPrivateGceaDemonstration(now = new Date()) {
  const asset: GovernedAsset = { assetId: 'TA14-DEMO-ASSET-001', version: '1.0.0', routeId: 'ROUTE-CONSEQUENCE-001', consequence: 'bounded_production_progression' };
  const authority: AuthorityGrant = {
    authorityId: 'TA14-DEMO-AUTH-001', assetId: asset.assetId, assetVersion: asset.version, routeId: asset.routeId,
    consequence: asset.consequence, effectiveAt: new Date(now.getTime() - 3600000).toISOString(), expiresAt: new Date(now.getTime() + 3600000).toISOString(), revoked: false,
  };
  const evidence: EvidenceStanding = { continuitySupported: true, admissibilitySupported: true, evidenceId: 'TA14-DEMO-EVIDENCE-001' };
  const baseline = evaluateExecutionAuthority({ asset, authority, change: null, evidence, now: now.toISOString() });
  const change: MaterialChange = { changeId: 'TA14-DEMO-CHANGE-001', detectedAt: now.toISOString(), category: 'MODEL', material: true, description: 'Material model change challenges prior execution standing.' };
  const challenged = evaluateExecutionAuthority({ asset, authority, change, evidence, now: now.toISOString() });
  const reauthorizedAsset = { ...asset, version: '1.1.0' };
  const reauthorizedAuthority = { ...authority, authorityId: 'TA14-DEMO-AUTH-002', assetVersion: '1.1.0' };
  const restored = evaluateExecutionAuthority({ asset: reauthorizedAsset, authority: reauthorizedAuthority, change: null, evidence: { ...evidence, evidenceId: 'TA14-DEMO-EVIDENCE-002' }, now: now.toISOString() });
  return { asset, authority, evidence, baseline, change, challenged, reauthorizedAsset, reauthorizedAuthority, restored };
}
