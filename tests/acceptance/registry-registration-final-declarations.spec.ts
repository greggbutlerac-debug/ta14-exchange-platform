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

describe('TA-14 Registry final declaration regression', () => {
  it('exposes every final declaration on Page 14', () => {
    const source = readRegistrationPage();

    expect(source).toContain('Authority to submit');
    expect(source).toContain('Accuracy and attribution');
    expect(source).toContain('Registry boundary');
    expect(source).toContain('TA14-RET-001 v1.1 Registry Terms');
  });

  it('binds authority confirmation to the validated form state', () => {
    const source = readRegistrationPage();

    expect(source).toContain('checked={form.authorityConfirmed}');
    expect(source).toMatch(
      /updateField\(\s*'authorityConfirmed',\s*event\.target\.checked/s,
    );
  });

  it('binds accuracy confirmation to the validated form state', () => {
    const source = readRegistrationPage();

    expect(source).toContain('checked={form.accuracyConfirmed}');
    expect(source).toMatch(
      /updateField\(\s*'accuracyConfirmed',\s*event\.target\.checked/s,
    );
  });

  it('binds boundary confirmation to the validated form state', () => {
    const source = readRegistrationPage();

    expect(source).toContain('checked={form.boundaryConfirmed}');
    expect(source).toMatch(
      /updateField\(\s*'boundaryConfirmed',\s*event\.target\.checked/s,
    );
  });

  it('binds Registry Terms acceptance to the final-page control', () => {
    const source = readRegistrationPage();

    expect(source).toContain('checked={termsAccepted}');
    expect(source).toContain(
      'setTermsAccepted(event.target.checked)',
    );
  });

  it('marks every unchecked final declaration as incomplete', () => {
    const source = readRegistrationPage();

    expect(source).toMatch(
      /data-required-incomplete=\{\s*!form\.authorityConfirmed/s,
    );
    expect(source).toMatch(
      /data-required-incomplete=\{\s*!form\.accuracyConfirmed/s,
    );
    expect(source).toMatch(
      /data-required-incomplete=\{\s*!form\.boundaryConfirmed/s,
    );
    expect(source).toMatch(
      /data-required-incomplete=\{\s*!termsAccepted/s,
    );
  });

  it('keeps the ownership declaration visible at the final boundary', () => {
    const source = readRegistrationPage();

    expect(source).toContain(
      'data-required-field="ownershipDeclaration"',
    );
    expect(source).toContain(
      'Ownership and submission-rights declaration',
    );
  });

  it('saves Page 14 before generating the manifest', () => {
    const source = readRegistrationPage();

    const start = source.indexOf(
      'async function downloadManifest()',
    );
    const end = source.indexOf(
      'function handleSubmit',
      start,
    );

    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);

    const block = source.slice(start, end);

    expect(block).toContain(
      'const confirmedDraftId = await saveDraft()',
    );
    expect(block).toContain(
      'buildManifest(confirmedDraftId)',
    );
    expect(
      block.indexOf(
        'const confirmedDraftId = await saveDraft()',
      ),
    ).toBeLessThan(
      block.indexOf('buildManifest(confirmedDraftId)'),
    );
  });

  it('binds the manifest to the freshly confirmed draft', () => {
    const source = readRegistrationPage();

    expect(source).toContain(
      'draftId: confirmedDraftId ?? draftId',
    );
  });

  it('does not silently generate a manifest when draft persistence fails', () => {
    const source = readRegistrationPage();

    expect(source).toContain('if (!confirmedDraftId)');
    expect(source).toContain(
      'could not be confirmed as an account-backed TA-14 Registry draft',
    );
  });
});
