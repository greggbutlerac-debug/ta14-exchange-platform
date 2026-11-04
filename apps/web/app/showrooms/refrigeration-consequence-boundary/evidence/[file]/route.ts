/*
 * Owner-gated evidence exports. Each export is regenerated from the deterministic simulation; the
 * test suite asserts it is identical to the committed copy in docs/refrigeration-consequence-boundary/evidence.
 */
import { NextResponse } from 'next/server';
import { scenarioExport, summaryExport } from '@/lib/refrigeration-boundary/export';
import { runAllScenarios, runExtensionScenarios } from '@/lib/refrigeration-boundary/scenarios';
import { examinationAccess } from '../../access';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  if (!(await examinationAccess()).allowed) return new NextResponse('Not found.', { status: 404 });
  const { file } = await params;
  const results = [...await runAllScenarios(), ...await runExtensionScenarios()];
  const body = file === 'summary.json' ? summaryExport(results) : (() => { const r = results.find((x) => `${x.id}.json` === file); return r ? scenarioExport(r) : null; })();
  if (!body) return new NextResponse('Not found.', { status: 404 });
  return new NextResponse(JSON.stringify(body), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' },
  });
}
