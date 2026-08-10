import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const registrationPagePath = resolve(
  process.cwd(),
  'apps/web/app/workspace/ai-governance/registry/register/page.tsx',
);

function readRegistrationPage(): string {
  return readFileSync(registrationPagePath, 'utf8');
}

describe('TA-14 Registry lifecycle telemetry source-of-truth', () => {
  it('keeps browser telemetry alive across navigation', () => {
    const source = readRegistrationPage();

    const lifecycleStart = source.indexOf(
      'async function recordLifecycleEvent(',
    );
    const lifecycleEnd = source.indexOf(
      'useEffect(() => {',
      lifecycleStart,
    );

    expect(lifecycleStart).toBeGreaterThan(-1);
    expect(lifecycleEnd).toBeGreaterThan(lifecycleStart);

    const lifecycleBlock = source.slice(
      lifecycleStart,
      lifecycleEnd,
    );

    expect(lifecycleBlock).toContain('keepalive: true');
  });

  it('limits browser lifecycle telemetry to browser-originated milestones', () => {
    const source = readRegistrationPage();

    const lifecycleStart = source.indexOf(
      'async function recordLifecycleEvent(',
    );
    const lifecycleEnd = source.indexOf(
      'useEffect(() => {',
      lifecycleStart,
    );

    const lifecycleBlock = source.slice(
      lifecycleStart,
      lifecycleEnd,
    );

    expect(lifecycleBlock).toContain(
      "'registration_page_opened'",
    );
    expect(lifecycleBlock).toContain(
      "'registration_started'",
    );
    expect(lifecycleBlock).toContain("'draft_saved'");
    expect(lifecycleBlock).toContain(
      "'registration_failed'",
    );

    expect(lifecycleBlock).not.toContain(
      "'submission_submitted'",
    );
    expect(lifecycleBlock).not.toContain(
      "'registration_completed'",
    );
  });

  it('does not emit submission_submitted from the browser submit path', () => {
    const source = readRegistrationPage();

    const submitStart = source.indexOf(
      'async function submitForReview()',
    );
    const submitEnd = source.indexOf(
      'async function discardDraft()',
      submitStart,
    );

    expect(submitStart).toBeGreaterThan(-1);
    expect(submitEnd).toBeGreaterThan(submitStart);

    const submitBlock = source.slice(
      submitStart,
      submitEnd,
    );

    expect(submitBlock).not.toContain(
      "recordLifecycleEvent(\n        'submission_submitted'",
    );
  });

  it('does not emit registration_completed from the browser submit path', () => {
    const source = readRegistrationPage();

    const submitStart = source.indexOf(
      'async function submitForReview()',
    );
    const submitEnd = source.indexOf(
      'async function discardDraft()',
      submitStart,
    );

    const submitBlock = source.slice(
      submitStart,
      submitEnd,
    );

    expect(submitBlock).not.toContain(
      "recordLifecycleEvent(\n          'registration_completed'",
    );
  });

  it('documents database authority for Submitted and Registered milestones', () => {
    const source = readRegistrationPage();

    expect(source).toContain(
      'SUBMITTED and REGISTERED lifecycle milestones are emitted from',
    );
    expect(source).toContain(
      'authoritative Registry state by database triggers',
    );
  });

  it('preserves the Page 14 confirmed-draft manifest binding', () => {
    const source = readRegistrationPage();

    expect(source).toContain(
      'draftId: confirmedDraftId ?? draftId',
    );
  });
});
