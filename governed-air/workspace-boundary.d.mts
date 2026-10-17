export function examineUnverifiedClaims(input: unknown): {
  disposition: string;
  reason: string;
  missingEvidence: string[];
  missingAuthority: string[];
  simulation: boolean;
  claimsVerified: false;
  executionAuthorized: false;
};
