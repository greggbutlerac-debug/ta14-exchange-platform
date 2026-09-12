import { describe, expect, it } from 'vitest';

import { evaluateRegistryApiReadiness } from './registry-api-readiness';

const minimalSubmission = {
  governance_name: 'Example Governance',
  current_version: '1.0',
  claimant_name: 'Example Claimant',
  submitter_authority_role: 'Founder',
  steward_name: 'Example Steward',
  contact_email: 'steward@example.com',
  plain_language_description: 'A bounded governance architecture.',
  formal_claims: 'Claims a defined governance function.',
  authority_declaration_accepted: true,
  accuracy_declaration_accepted: true,
  registry_boundary_accepted: true,
  terms_accepted: true,
};

describe('Registry API migration guard', () => {
  it('accepts the minimal 14-step registration contract without enrichment', () => {
    const result = evaluateRegistryApiReadiness(minimalSubmission);
    expect(result.ready).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.reviewPathway).toBe('Record-only registration');
  });

  it('does not resurrect legacy enrichment gates', () => {
    const result = evaluateRegistryApiReadiness({
      ...minimalSubmission,
      requested_review_pathway: '',
    });
    expect(result.ready).toBe(true);
  });

  it('still blocks missing attribution essentials', () => {
    const result = evaluateRegistryApiReadiness({
      ...minimalSubmission,
      steward_name: '',
      authority_declaration_accepted: false,
    });
    expect(result.ready).toBe(false);
    expect(result.missing).toContain('stewardName');
    expect(result.missing).toContain('authorityConfirmed');
  });
});
