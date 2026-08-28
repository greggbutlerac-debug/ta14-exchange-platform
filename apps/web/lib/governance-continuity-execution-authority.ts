import { createHash } from 'node:crypto';

export type AuthorityDetermination = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
export type StandingState = 'CURRENT' | 'CHALLENGED' | 'EXPIRED' | 'REVOKED';

export type GovernedAsset = { assetId: string; version: string; routeId: string; consequence: string };
export type AuthorityGrant = { authorityId: string; assetId: string; assetVersion: string; routeId: string; consequence: string; effectiveAt: string; expiresAt: string; revoked: boolean };
export type MaterialChange = { changeId: string; detectedAt: string; category: 'MODEL' | 'PROMPT' | 'DATA' | 'VENDOR' | 'POLICY' | 'OPERATIONAL' | 'OTHER'; material: boolean; description: string };
export type EvidenceStanding = { continuitySupported: boolean; admissibilitySupported: boolean; evidenceId: string };
export type ExecutionAuthorityInput = { asset: GovernedAsset; authority: AuthorityGrant | null; change: MaterialChange | null; evidence: EvidenceStanding; now: string };
export type ExecutionAttempt = { attemptId: string; attemptedAt: string; consequence: string };
export type InterventionAuthority = { authorityId: string; routeId: string; consequence: string; effectiveAt: string; expiresAt: string; revoked: boolean };

export type AuthorityEvaluation = {
  determination: AuthorityDetermination;
  standing: StandingState;
  bindingScope: string | null;
  reasonCodes: string[];
  receipt: { algorithm: 'SHA-256'; canonicalVersion: 'TA14.GCEA.RECEIPT.v1'; hash: string; replayId: string; payload: unknown };
};

export type ExecutionAttemptEvaluation = {
  determination: AuthorityDetermination;
  executionPermitted: boolean;
  reasonCodes: string[];
  evaluatedAt: string;
  receipt: { algorithm: 'SHA-256'; canonicalVersion: 'TA14.GCEA.EXECUTION.v1'; hash: string; replayId: string; payload: unknown };
};

function stable(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(',')}}`;
}

type GceaCanonicalVersion = 'TA14.GCEA.RECEIPT.v1' | 'TA14.GCEA.EXECUTION.v1';

function receipt<T extends GceaCanonicalVersion>(payload: unknown, canonicalVersion: T): { algorithm: 'SHA-256'; canonicalVersion: T; hash: string; replayId: string; payload: unknown } {
  const hash = createHash('sha256').update(stable(payload)).digest('hex');
  return { algorithm: 'SHA-256', canonicalVersion, hash, replayId: `TA14-GCEA-${hash.slice(0, 20).toUpperCase()}`, payload };
}

export function evaluateExecutionAuthority(input: ExecutionAuthorityInput): AuthorityEvaluation {
  const { asset, authority, change, evidence, now } = input;
  const reasons: string[] = [];
  let standing: StandingState = 'CURRENT';
  let determination: AuthorityDetermination = 'ALLOW';

  if (!evidence.continuitySupported) { determination = 'HOLD'; reasons.push('CONTINUITY_UNSUPPORTED'); }
  if (!evidence.admissibilitySupported) { determination = 'HOLD'; reasons.push('ADMISSIBILITY_UNSUPPORTED'); }
  if (change?.material) { standing = 'CHALLENGED'; determination = 'HOLD'; reasons.push('MATERIAL_CHANGE_REQUIRES_REAUTHORIZATION'); }

  if (!authority) { determination = 'HOLD'; reasons.push('AUTHORITY_ABSENT'); }
  else if (authority.revoked) { standing = 'REVOKED'; determination = 'DENY'; reasons.push('AUTHORITY_REVOKED'); }
  else if (new Date(authority.effectiveAt).getTime() > new Date(now).getTime()) { determination = 'HOLD'; reasons.push('AUTHORITY_NOT_EFFECTIVE'); }
  else if (new Date(authority.expiresAt).getTime() <= new Date(now).getTime()) { standing = 'EXPIRED'; determination = 'DENY'; reasons.push('AUTHORITY_EXPIRED'); }
  else if (authority.assetId !== asset.assetId || authority.assetVersion !== asset.version || authority.routeId !== asset.routeId || authority.consequence !== asset.consequence) { determination = 'DENY'; reasons.push('AUTHORITY_SCOPE_MISMATCH'); }

  const bindingScope = determination === 'ALLOW' && standing === 'CURRENT' && evidence.continuitySupported && evidence.admissibilitySupported ? asset.consequence : null;
  if (determination === 'ALLOW') reasons.push('PRESENT_STANDING_ESTABLISHED');
  const payload = { canonicalVersion: 'TA14.GCEA.RECEIPT.v1', asset, authority, change, evidence, now, determination, standing, bindingScope, reasonCodes: reasons };
  return { determination, standing, bindingScope, reasonCodes: reasons, receipt: receipt(payload, 'TA14.GCEA.RECEIPT.v1') };
}

export function evaluateExecutionAttempt(input: { authorityInput: ExecutionAuthorityInput; attempt: ExecutionAttempt; interventionAuthority?: InterventionAuthority | null }): ExecutionAttemptEvaluation {
  const standing = evaluateExecutionAuthority({ ...input.authorityInput, now: input.attempt.attemptedAt });
  const reasons = [...standing.reasonCodes];
  let determination: AuthorityDetermination = standing.determination;
  let executionPermitted = false;

  if (input.attempt.consequence !== input.authorityInput.asset.consequence) { determination = 'DENY'; reasons.push('ATTEMPT_CONSEQUENCE_MISMATCH'); }
  else if (standing.determination !== 'ALLOW' || standing.bindingScope !== input.attempt.consequence) { determination = 'DENY'; reasons.push('EXECUTION_BOUNDARY_REFUSED'); }
  else { executionPermitted = true; determination = 'ALLOW'; reasons.push('EXECUTION_BOUNDARY_PERMITTED'); }

  if (input.interventionAuthority) {
    const override = input.interventionAuthority;
    const t = new Date(input.attempt.attemptedAt).getTime();
    const valid = !override.revoked && override.routeId === input.authorityInput.asset.routeId && override.consequence === input.attempt.consequence && new Date(override.effectiveAt).getTime() <= t && new Date(override.expiresAt).getTime() > t;
    if (!valid) { determination = 'ESCALATE'; executionPermitted = false; reasons.push('INTERVENTION_AUTHORITY_INVALID_OR_UNSCOPED'); }
  }

  const payload = { canonicalVersion: 'TA14.GCEA.EXECUTION.v1', authorityInput: input.authorityInput, standingReceiptHash: standing.receipt.hash, attempt: input.attempt, interventionAuthority: input.interventionAuthority ?? null, determination, executionPermitted, reasonCodes: reasons, evaluatedAt: input.attempt.attemptedAt };
  return { determination, executionPermitted, reasonCodes: reasons, evaluatedAt: input.attempt.attemptedAt, receipt: receipt(payload, 'TA14.GCEA.EXECUTION.v1') };
}

export function buildPrivateGceaDemonstration(now = new Date()) {
  const asset: GovernedAsset = { assetId: 'TA14-DEMO-ASSET-001', version: '1.0.0', routeId: 'ROUTE-CONSEQUENCE-001', consequence: 'bounded_production_progression' };
  const authority: AuthorityGrant = { authorityId: 'TA14-DEMO-AUTH-001', assetId: asset.assetId, assetVersion: asset.version, routeId: asset.routeId, consequence: asset.consequence, effectiveAt: new Date(now.getTime() - 3600000).toISOString(), expiresAt: new Date(now.getTime() + 3600000).toISOString(), revoked: false };
  const evidence: EvidenceStanding = { continuitySupported: true, admissibilitySupported: true, evidenceId: 'TA14-DEMO-EVIDENCE-001' };
  const baselineInput: ExecutionAuthorityInput = { asset, authority, change: null, evidence, now: now.toISOString() };
  const baseline = evaluateExecutionAuthority(baselineInput);
  const change: MaterialChange = { changeId: 'TA14-DEMO-CHANGE-001', detectedAt: now.toISOString(), category: 'MODEL', material: true, description: 'Material model change challenges prior execution standing.' };
  const challengedInput: ExecutionAuthorityInput = { asset, authority, change, evidence, now: now.toISOString() };
  const challenged = evaluateExecutionAuthority(challengedInput);
  const deniedAttempt = evaluateExecutionAttempt({ authorityInput: challengedInput, attempt: { attemptId: 'TA14-DEMO-ATTEMPT-001', attemptedAt: now.toISOString(), consequence: asset.consequence } });
  const reauthorizedAsset = { ...asset, version: '1.1.0' };
  const reauthorizedAuthority = { ...authority, authorityId: 'TA14-DEMO-AUTH-002', assetVersion: '1.1.0' };
  const restoredInput: ExecutionAuthorityInput = { asset: reauthorizedAsset, authority: reauthorizedAuthority, change: null, evidence: { ...evidence, evidenceId: 'TA14-DEMO-EVIDENCE-002' }, now: now.toISOString() };
  const restored = evaluateExecutionAuthority(restoredInput);
  return { asset, authority, evidence, baselineInput, baseline, change, challengedInput, challenged, deniedAttempt, reauthorizedAsset, reauthorizedAuthority, restoredInput, restored };
}
