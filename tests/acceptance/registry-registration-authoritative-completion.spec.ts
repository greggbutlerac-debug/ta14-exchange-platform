import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const registrationPagePath = resolve(
  process.cwd(),
  'apps/web/app/workspace/ai-governance/registry/register/page.tsx',
);

function source(): string {
  return readFileSync(registrationPagePath, 'utf8');
}

describe('TA-14 Registry authoritative completion boundary', () => {
  it('does not label a pre-submission artifact as a completed Registry receipt', () => {
    const page = source();

    expect(page).toContain(
      'TA-14 AI Governance Registry PRE-SUBMISSION Draft Receipt',
    );
    expect(page).toContain(
      "registrationStatus: 'NOT_REGISTERED'",
    );
    expect(page).toContain(
      "registryIdentifier: null",
    );
  });

  it('requires an account-backed draft before generating a pre-submission receipt', () => {
    const page = source();

    const start = page.indexOf(
      'async function generateReceipt()',
    );
    const end = page.indexOf(
      'function handleSubmit',
      start,
    );

    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);

    const block = page.slice(start, end);

    expect(block).toContain(
      'const confirmedDraftId = await saveDraft()',
    );
    expect(block).toContain(
      'if (!confirmedDraftId)',
    );
    expect(block).toContain(
      'This intake is NOT REGISTERED',
    );
    expect(block).toContain(
      'buildManifest(confirmedDraftId)',
    );
    expect(block).toContain(
      'draftId: confirmedDraftId',
    );
  });

  it('never uses a browser recovery id for the pre-submission receipt', () => {
    const page = source();

    const start = page.indexOf(
      'async function generateReceipt()',
    );
    const end = page.indexOf(
      'function handleSubmit',
      start,
    );

    const block = page.slice(start, end);

    expect(block).not.toContain(
      'browser-recovery-draft',
    );
  });

  it('makes the Page 14 pre-submission state explicit', () => {
    const page = source();

    expect(page).toContain(
      '<h3>Pre-Submission Draft Receipt</h3>',
    );
    expect(page).toContain(
      'PRE-SUBMISSION and NOT REGISTERED',
    );
    expect(page).toContain(
      'PRE-SUBMISSION receipt generated — NOT REGISTERED.',
    );
  });

  it('reserves completed-registration wording for a returned permanent identifier', () => {
    const page = source();

    expect(page).toContain(
      'if (payload.registration?.registryIdentifier)',
    );
    expect(page).toContain(
      'AUTHORITATIVE REGISTRATION COMPLETE',
    );
    expect(page).toContain(
      'Permanent Registry Identifier:',
    );
    expect(page).toContain(
      'This is the only state that constitutes completed TA-14 Governance Entity Registration.',
    );
  });

  it('labels submitted-for-review state as not registered', () => {
    const page = source();

    expect(page).toContain(
      'Registry intake submitted for review. NOT REGISTERED.',
    );
  });

  it('preserves the confirmed draft manifest binding', () => {
    const page = source();

    expect(page).toContain(
      'draftId: confirmedDraftId ?? draftId',
    );
  });
});
