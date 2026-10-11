/** SX-002 isolated policy prototype. NOT a database authorization boundary. */
export type AuthorityRecord = {
  actorId: string; targetId: string; action: string; scope: string;
  expiresAt: string; revoked: boolean; localStanding: boolean;
  evidenceDigest: string; evidenceVerified: boolean;
};
export type CommitRequest = {
  actorId: string; targetId: string; action: string; scope: string;
  evidenceDigest: string; commitId: string;
};
export type Decision = { disposition: 'ALLOW' | 'HOLD'; reason: string };
const nonempty = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
/** Inputs MUST come from an independently authenticated/verified authority store. */
export function evaluateSX002(request: CommitRequest, authority: AuthorityRecord | null, now: Date): Decision {
  if (![request.actorId,request.targetId,request.action,request.scope,request.evidenceDigest,request.commitId].every(nonempty)) return {disposition:'HOLD',reason:'MISSING_COMMIT_BINDING'};
  if (!authority) return {disposition:'HOLD',reason:'AUTHORITY_NOT_ESTABLISHED'};
  if (![authority.actorId,authority.targetId,authority.action,authority.scope,authority.evidenceDigest].every(nonempty)) return {disposition:'HOLD',reason:'INCOMPLETE_AUTHORITY'};
  if (authority.revoked !== false || authority.localStanding !== true || authority.evidenceVerified !== true) return {disposition:'HOLD',reason:'UNVERIFIED_AUTHORITY'};
  const expiry = Date.parse(authority.expiresAt);
  if (!Number.isFinite(expiry) || !Number.isFinite(now.getTime()) || expiry <= now.getTime()) return {disposition:'HOLD',reason:'STALE_AUTHORITY'};
  if (request.actorId !== authority.actorId || request.targetId !== authority.targetId || request.action !== authority.action || request.scope !== authority.scope || request.evidenceDigest !== authority.evidenceDigest) return {disposition:'HOLD',reason:'BINDING_MISMATCH'};
  return {disposition:'ALLOW',reason:'POLICY_PREDICATES_SATISFIED'};
}
/**
 * SECURITY LIMIT: this function does not authenticate authority records, establish
 * their provenance, check revocation transactionally, prevent replay, control SQL
 * grants, or create effects. It must NOT be used alone to authorize execution.
 */
