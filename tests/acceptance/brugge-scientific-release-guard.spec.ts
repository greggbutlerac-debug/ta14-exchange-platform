import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd(), 'apps/web/app/showrooms/brugge-research-examination');
const page = readFileSync(resolve(root, 'page.tsx'), 'utf8');
const challenge = readFileSync(resolve(root, 'BruggeAcademyChallenge.tsx'), 'utf8');
const checklist = readFileSync(resolve(root, 'SCIENTIFIC_RELEASE_CHECKLIST.md'), 'utf8');

describe('Brugge scientific review release guard', () => {
  it('preserves twelve source-specific exhibits and separates the TA-14 proposal', () => {
    const matches = [...page.matchAll(/image: '[^']+\.png'/g)];
    expect(matches).toHaveLength(12);
    expect(new Set(matches.map(m => m[0])).size).toBe(12);
    expect(page).toContain('No study cited here tested TA-14.');
    expect(page).toContain('not a paper by Dr. Brugge');
  });

  it('retains visible scientific HOLD and review-only framing', () => {
    expect(page).toContain('SCIENTIFIC REVIEW HOLD — NOT APPROVED FOR PUBLIC RELEASE');
    expect(page).toContain('embedded labels must not be relied upon');
    expect(checklist).toContain('HOLD — internal review only');
    expect(page).toContain('not a systematic review or an independent statistical replication');
  });

  it('preserves clinical trial interpretation boundaries', () => {
    expect(page).toContain('HEPA versus sham');
    expect(page).toContain('154 analyzed participants');
    expect(page).toContain('3.0 mm Hg');
    expect(page).toContain('No statistically significant overall cognitive effect');
    expect(page).toContain('119 participants');
    expect(page).toContain('No overall IL-1β effect');
    expect(page).toContain('12 participants');
    expect(page).toContain('not evidence that visceral fat was reduced');
  });

  it('keeps all four Academy dispositions and makes the challenge explicitly hypothetical', () => {
    expect(page).toContain('<BruggeAcademyChallenge />');
    for (const decision of ['ALLOW', 'HOLD', 'DENY', 'ESCALATE']) {
      expect(challenge).toContain("answer: '" + decision + "'");
    }
    expect(challenge).toContain('Four fictional governance situations');
    expect(challenge).toContain('not experiments, findings, or endorsements');
  });

  it('references twelve existing image assets and an existing PDF in the public directory', () => {
    const publicDir = resolve(process.cwd(), 'apps/web/public');
    const images = [...page.matchAll(/image: '([^']+\\.png)'/g)].map(m => m[1]);
    expect(images).toHaveLength(12);
    for (const filename of images) {
      expect(existsSync(resolve(publicDir, filename)), 'Missing exhibit asset: ' + filename).toBe(true);
    }
    const pdf = 'TA14_Brugge_Research_Examination_v4_Editorial_Corrected (2).pdf';
    expect(existsSync(resolve(publicDir, pdf)), 'Missing review PDF').toBe(true);
  });

  it('does not insert deployment preview hosts into the tracked checklist', () => {
    expect(checklist).not.toMatch(/vercel\.app/i);
  });
});
