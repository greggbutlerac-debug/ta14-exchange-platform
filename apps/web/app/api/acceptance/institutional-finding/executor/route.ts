import { NextResponse } from 'next/server';
import {
  createTA14InstitutionalFinding,
  sealTA14InstitutionalFinding,
} from '@/lib/ai-governance/institutional-examination-finding';
import type { TA14ExaminationRunReceipt } from '@/lib/ai-governance/examination-run-receipt';
import {
  acceptanceExecutorCredentialFrom,
  acceptanceFixtureMarkerFrom,
  verifyTA14AcceptanceExecutor,
} from '@/lib/ai-governance/acceptance-executor-authority';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ExecutorRequest = {
  recordId?: string;
  governanceRegistryIdentifier?: string;
  governanceName?: string;
  governanceVersion?: string;
};

function acceptanceReceipt(input: {
  recordId: string;
  governanceRegistryIdentifier: string;
  governanceName: string;
  governanceVersion: string;
}): TA14ExaminationRunReceipt {
  return {
    schema: 'TA14-Examination-Run-Receipt-v1',
    receiptId: `${input.recordId}-RECEIPT`,
    suiteId: 'TA14-AE-27-v1',
    evaluatorVersion: 'institutional-production-acceptance-executor-v1',
    createdAt: new Date().toISOString(),
    governedObject: {
      objectId: input.governanceRegistryIdentifier,
      objectType: 'REGISTERED_GOVERNANCE_ARCHITECTURE',
      name: input.governanceName,
      version: input.governanceVersion,
      frozenRef: 'docs/institutional-examination-production-acceptance-v1.md',
      frozenDigest: 'ACCEPTANCE-FIXTURE-NOT-A-PARTICIPANT-TECHNICAL-FREEZE',
    },
    observations: {},
    evidenceRefs: {
      ACCEPTANCE_FIXTURE: ['evidence://ta14/institutional-production-acceptance'],
    },
    findings: [],
    counts: { pass: 0, fail: 0, unresolved: 27, total: 27 },
    workingStanding: 'UNRESOLVED',
    institutionalStanding: 'NOT ISSUED',
    canonicalDigest: `${input.recordId}-SYNTHETIC-RECEIPT-DIGEST`,
  };
}

export async function POST(request: Request) {
  const presentedCredential = acceptanceExecutorCredentialFrom(request);
  const fixtureMarker = acceptanceFixtureMarkerFrom(request);

  let body: ExecutorRequest;
  try {
    body = await request.json() as ExecutorRequest;
  } catch {
    return NextResponse.json({ error: 'A JSON acceptance request is required.' }, { status: 400 });
  }

  const recordId = body.recordId?.trim();
  const governanceRegistryIdentifier = body.governanceRegistryIdentifier?.trim();
  const governanceName = body.governanceName?.trim();
  const governanceVersion = body.governanceVersion?.trim();
  const executorDecision = verifyTA14AcceptanceExecutor({
    presentedCredential,
    recordId,
    fixtureMarker,
  });

  if (!executorDecision.authorized) {
    return NextResponse.json(
      { error: 'Acceptance executor authorization refused.', reason: executorDecision.reason },
      { status: 401 },
    );
  }
  if (!recordId || !governanceRegistryIdentifier || !governanceName || !governanceVersion) {
    return NextResponse.json(
      { error: 'recordId, governanceRegistryIdentifier, governanceName, and governanceVersion are required.' },
      { status: 400 },
    );
  }

  const receipt = acceptanceReceipt({
    recordId,
    governanceRegistryIdentifier,
    governanceName,
    governanceVersion,
  });
  const finding = createTA14InstitutionalFinding({
    findingId: `${recordId}-FINDING`,
    verifiedReceipt: receipt,
    receiptDigestVerified: true,
    evidenceAdmissions: [{
      evidenceRef: 'evidence://ta14/institutional-production-acceptance',
      disposition: 'ADMITTED',
      rationale: 'Synthetic acceptance-only evidence fixture.',
      reviewer: executorDecision.executorId,
      reviewedAt: new Date().toISOString(),
    }],
    determination: 'INDETERMINATE',
    boundedProposition: 'Whether the synthetic acceptance fixture can traverse the authoritative institutional-finding admission boundary.',
    findingRationale: 'No substantive architecture determination is made. This acceptance-only fixture exists solely to observe production admission, persistence, and first-event chronology behavior.',
    limitations: [
      'This fixture is not a participant finding, certification, Registry action, or substantive architecture examination.',
      'The executor records technical behavior only; institutional interpretation remains separate.',
    ],
    issuer: executorDecision.executorId,
    authorityRef: 'docs/institutional-acceptance-execution-authority-v1.md',
  });
  const sealedFinding = await sealTA14InstitutionalFinding(finding);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const admissionUrl = new URL('/api/artifacts/governed/institutional-finding', request.url);
    const response = await fetch(admissionUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-ta14-acceptance-executor': presentedCredential!,
        'x-ta14-acceptance-fixture': 'acceptance-only',
      },
      body: JSON.stringify({
        recordId,
        governanceRegistryIdentifier,
        governanceName,
        finding: sealedFinding,
      }),
      cache: 'no-store',
      signal: controller.signal,
    });
    const admission = await response.json().catch(() => ({ error: 'Admission endpoint returned a non-JSON response.' }));
    return NextResponse.json({
      schema: 'TA14-Institutional-Acceptance-Executor-Observation-v1',
      executedAt: new Date().toISOString(),
      executorId: executorDecision.executorId,
      deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      acceptanceFixture: true,
      recordId,
      governanceRegistryIdentifier,
      governanceVersion,
      sealedFinding,
      admission: { status: response.status, body: admission },
      observation: response.status === 201 ? 'ADMISSION_CREATED' : 'ADMISSION_REFUSED_OR_FAILED',
      determination: 'INCOMPLETE',
      determinationBoundary: 'This endpoint preserves a production observation. It does not independently award protocol PASS or alter the controlled acceptance run.',
    }, { status: response.ok ? 200 : response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown executor failure.';
    return NextResponse.json({
      error: 'Acceptance executor could not complete the authoritative admission probe.',
      detail: message,
      determination: 'INCOMPLETE',
    }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
