import { describe, expect, it } from 'vitest';

import { evaluateMinimalRegistryReadiness } from './registry-minimal-readiness';

const minimum = {
  governanceName: 'Example Governance Architecture',
  currentVersion: '1.0',
  claimantName: 'Example Claimant',
  authorityRole: 'Founder',
  stewardName: 'Example Steward',
  contactEmail: 'steward@example.com',
  plainDescription: 'A bounded governance architecture.',
  claims: 'The architecture claims a defined governance function.',
  authorityConfirmed: true,
  accuracyConfirmed: true,
  boundaryConfirmed: true,
  termsAccepted: true,
};

describe('TA-14 minimal Registry readiness', () => {
  it('allows ordinary registration with only the true blocking fields', () => {
    expect(evaluateMinimalRegistryReadiness(minimum)).toEqual({
      ready: true,
      missing: [],
    });
  });

  it('does not require evidence, publications, repositories, patents, non-claims, jurisdiction, ownership narrative, or review pathway', () => {
    const result = evaluateMinimalRegistryReadiness({ ...minimum });
    expect(result.ready).toBe(true);
  });

  it('does not allow attribution and boundary essentials to disappear', () => {
    const result = evaluateMinimalRegistryReadiness({
      ...minimum,
      claimantName: '',
      accuracyConfirmed: false,
    });

    expect(result.ready).toBe(false);
    expect(result.missing).toContain('claimantName');
    expect(result.missing).toContain('accuracyConfirmed');
  });
});
