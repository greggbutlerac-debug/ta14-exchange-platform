import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const repositoryRoot = process.cwd();

const registrationPagePath = resolve(
  repositoryRoot,
  'apps/web/app/workspace/ai-governance/registry/register/page.tsx',
);

const draftsRoutePath = resolve(
  repositoryRoot,
  'apps/web/app/api/ai-governance/registry/drafts/route.ts',
);

const submitRoutePath = resolve(
  repositoryRoot,
  'apps/web/app/api/ai-governance/registry/submit/route.ts',
);

function read(path: string): string {
  return readFileSync(path, 'utf8');
}

describe('TA-14 Registry Page 14 ownership declaration regression', () => {
  it('keeps the ownership declaration in the registration form model', () => {
    const source = read(registrationPagePath);

    expect(source).toContain('ownershipDeclaration: string;');
    expect(source).toContain("ownershipDeclaration: ''");
  });

  it('persists ownershipDeclaration to the account-backed Registry draft', () => {
    const source = read(draftsRoutePath);

    expect(source).toContain(
      'ownership_declaration: text(form.ownershipDeclaration)',
    );
  });

  it('rehydrates ownership_declaration into the registration form', () => {
    const source = read(registrationPagePath);

    expect(source).toContain(
      'ownershipDeclaration: submission.ownership_declaration ??',
    );
  });

  it('requires ownership_declaration at authoritative submission', () => {
    const source = read(submitRoutePath);

    expect(source).toContain("'ownership_declaration'");
  });

  it('surfaces the ownership declaration on the final review page', () => {
    const source = read(registrationPagePath);

    expect(source).toContain(
      'data-required-field="ownershipDeclaration"',
    );

    expect(source).toContain(
      'Ownership and submission-rights declaration',
    );

    expect(source).toContain(
      'Required before manifest generation',
    );
  });

  it('marks an empty ownership declaration as an actual incomplete control', () => {
    const source = read(registrationPagePath);

    expect(source).toMatch(
      /data-required-incomplete=\{\s*!form\.ownershipDeclaration\.trim\(\)/s,
    );
  });

  it('focuses the ownership declaration when manifest generation is blocked', () => {
    const source = read(registrationPagePath);

    expect(source).toContain(
      "'[data-required-field=\"ownershipDeclaration\"]'",
    );

    expect(source).toMatch(
      /querySelector<HTMLTextAreaElement>\('textarea'\)[\s\S]*?\.focus\(\)/,
    );
  });

  it('does not require EIN or CAGE for the ownership declaration', () => {
    const source = read(registrationPagePath);

    expect(source).toContain(
      'No EIN, CAGE code, or hidden corporate identifier is required',
    );
  });

  it('persists the exact Page 14 state before generating the manifest', () => {
    const source = read(registrationPagePath);

    const manifestStart = source.indexOf(
      'async function downloadManifest()',
    );

    expect(manifestStart).toBeGreaterThan(-1);

    const manifestEnd = source.indexOf(
      'function handleSubmit',
      manifestStart,
    );

    expect(manifestEnd).toBeGreaterThan(manifestStart);

    const manifestFunction = source.slice(
      manifestStart,
      manifestEnd,
    );

    const saveIndex = manifestFunction.indexOf(
      'const confirmedDraftId = await saveDraft()',
    );

    const blobIndex = manifestFunction.indexOf(
      'new Blob',
    );

    expect(saveIndex).toBeGreaterThan(-1);
    expect(blobIndex).toBeGreaterThan(-1);
    expect(saveIndex).toBeLessThan(blobIndex);
  });

  it('stops manifest generation when the account-backed draft save fails', () => {
    const source = read(registrationPagePath);

    expect(source).toContain(
      'if (!confirmedDraftId)',
    );

    expect(source).toContain(
      'could not be confirmed as an account-backed TA-14 Registry draft',
    );
  });

  it('binds the generated manifest to the confirmed draft identifier', () => {
    const source = read(registrationPagePath);

    expect(source).toContain(
      'buildManifest(confirmedDraftId)',
    );

    expect(source).toContain(
      'draftId: confirmedDraftId ?? draftId',
    );
  });

  it('persists the current form again before final submission', () => {
    const source = read(registrationPagePath);

    const submitStart = source.indexOf(
      'async function submitForReview()',
    );

    expect(submitStart).toBeGreaterThan(-1);

    const submitEnd = source.indexOf(
      'async function discardDraft',
      submitStart,
    );

    const submitFunction = source.slice(
      submitStart,
      submitEnd > submitStart
        ? submitEnd
        : undefined,
    );

    expect(submitFunction).toContain(
      'const submissionId = await saveDraft()',
    );

    expect(submitFunction).toContain(
      "fetch('/api/ai-governance/registry/submit'",
    );

    expect(
      submitFunction.indexOf(
        'const submissionId = await saveDraft()',
      ),
    ).toBeLessThan(
      submitFunction.indexOf(
        "fetch('/api/ai-governance/registry/submit'",
      ),
    );
  });
});
