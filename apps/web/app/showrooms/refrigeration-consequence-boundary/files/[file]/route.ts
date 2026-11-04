/*
 * Owner-gated technical examination PDF, served from docs/refrigeration-consequence-boundary.
 * If the file cannot be found in the running deployment the route returns 404 (fail closed).
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { examinationAccess } from '../../access';

export const dynamic = 'force-dynamic';
const PDF_NAME = 'TA14_When_the_Attacker_Bypasses_Governance_Revision_1_4.pdf';

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  if (!(await examinationAccess()).allowed) return new NextResponse('Not found.', { status: 404 });
  if ((await params).file !== PDF_NAME) return new NextResponse('Not found.', { status: 404 });
  for (const root of [process.cwd(), join(process.cwd(), '..', '..')]) {
    try {
      const pdf = await readFile(join(root, 'docs', 'refrigeration-consequence-boundary', PDF_NAME));
      return new NextResponse(new Uint8Array(pdf), { headers: { 'content-type': 'application/pdf', 'content-disposition': `inline; filename="${PDF_NAME}"`, 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' } });
    } catch { /* try next root */ }
  }
  return new NextResponse('Not found.', { status: 404 });
}
