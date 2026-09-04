import { TA14_REGISTRY_REQUIRED_FIELD_IDS } from './registry-14-step-policy';

export type MinimalRegistryReadinessInput = {
  governanceName?: string | null;
  currentVersion?: string | null;
  claimantName?: string | null;
  authorityRole?: string | null;
  stewardName?: string | null;
  contactEmail?: string | null;
  plainDescription?: string | null;
  claims?: string | null;
  authorityConfirmed?: boolean | null;
  accuracyConfirmed?: boolean | null;
  boundaryConfirmed?: boolean | null;
  termsAccepted?: boolean | null;
};

export type MinimalRegistryReadinessResult = {
  ready: boolean;
  missing: string[];
};

const text = (value: string | null | undefined) => Boolean(value?.trim());

/**
 * Basic TA-14 Governance Entity Registration is intentionally a low-friction
 * record-establishment pathway. Optional enrichment must never silently become
 * a registration gate. Evidence, publications, repositories, patents, detailed
 * non-claims, jurisdictional mappings, ownership narratives, and review choices
 * belong to enrichment or later assurance unless a separate governed pathway
 * explicitly requires them.
 */
export function evaluateMinimalRegistryReadiness(
  input: MinimalRegistryReadinessInput,
): MinimalRegistryReadinessResult {
  const missing: string[] = [];

  if (!text(input.governanceName)) missing.push('governanceName');
  if (!text(input.currentVersion)) missing.push('currentVersion');
  if (!text(input.claimantName)) missing.push('claimantName');
  if (!text(input.authorityRole)) missing.push('authorityRole');
  if (!text(input.stewardName)) missing.push('stewardName');
  if (!text(input.contactEmail)) missing.push('contactEmail');
  if (!text(input.plainDescription)) missing.push('plainDescription');
  if (!text(input.claims)) missing.push('claims');
  if (!input.authorityConfirmed) missing.push('authorityConfirmed');
  if (!input.accuracyConfirmed) missing.push('accuracyConfirmed');
  if (!input.boundaryConfirmed) missing.push('boundaryConfirmed');
  if (!input.termsAccepted) missing.push('termsAccepted');

  return { ready: missing.length === 0, missing };
}

// Guard against policy/readiness drift. Terms acceptance is stored outside the
// form policy, so it is intentionally the only readiness key not represented in
// TA14_REGISTRY_REQUIRED_FIELD_IDS.
const readinessPolicyFields = new Set([
  'governanceName',
  'currentVersion',
  'claimantName',
  'authorityRole',
  'stewardName',
  'contactEmail',
  'plainDescription',
  'claims',
  'authorityConfirmed',
  'accuracyConfirmed',
  'boundaryConfirmed',
]);

for (const field of TA14_REGISTRY_REQUIRED_FIELD_IDS) {
  if (!readinessPolicyFields.has(field)) {
    throw new Error(`Registry readiness is missing required policy field: ${field}`);
  }
}

for (const field of readinessPolicyFields) {
  if (!TA14_REGISTRY_REQUIRED_FIELD_IDS.includes(field)) {
    throw new Error(`Registry readiness contains an undeclared blocking field: ${field}`);
  }
}
