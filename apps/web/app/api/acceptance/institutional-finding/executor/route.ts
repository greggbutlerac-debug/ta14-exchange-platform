import { NextResponse } from 'next/server';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import {
  createTA14InstitutionalFinding,
  sealTA14InstitutionalFinding,
} from '@/lib/ai-governance/institutional-examination-finding';
import type { TA14ExaminationRunReceipt } from '@/lib/ai-governance/examination-run-receipt';
import {
  acceptanceExecutorCredentialFrom,
  acceptanceFixtureMarkerFrom,
  TA14_ACCEPTANCE_FIXTURE_PREFIX,
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

type AdmissionObservation = {
  status: number;
  body: unknown;
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
    evaluatorVersion: 'institutional-production-acceptance-executor-v2',
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

function acceptancePersistenceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    throw new Error('Acceptance observation persistence access is not configured.');
  }
  return createSupabaseAdminClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function inspectAcceptanceRecord(recordId: string) {
  if (!recordId.startsWith(TA14_ACCEPTANCE_FIXTURE_PREFIX)) {
    throw new Error('Acceptance observation may inspect acceptance-fixture identifiers only.');
  }
  const supabase = acceptancePersistenceClient();
  const { data: artifact, error } = await supabase
    .from('ta14_governed_artifact_records')
    .select('id,artifact_identifier,artifact_type,governance_registry_identifier,governance_name,governance_version,finding_class,claims_boundary,limitations,evidence_object_identifiers,source_sha256,registered_at,metadata,publication_state,disclosure_state,file_publication_authorized,public_file_url,public_record_href')
    .eq('artifact_identifier', recordId)
    .eq('artifact_type', 'INSTITUTIONAL_EXAMINATION_FINDING')
    .maybeSingle();
  if (error) throw new Error(`Acceptance fixture persistence inspection failed: ${error.message}`);
  if (!artifact) return { artifact: null, chronology: [] as unknown[] };
  const { data: chronology, error: chronologyError } = await supabase
    .from('ta14_governed_artifact_events')
    .select('event_key,event_type,event_at,sequence_number,metadata')
    .eq('artifact_record_id', artifact.id)
    .order('sequence_number', { ascending: true });
  if (chronologyError) throw new Error(`Acceptance fixture chronology inspection failed: ${chronologyError.message}`);
  return { artifact, chronology: chronology ?? [] };
}

async function admissionRequest(input: {
  admissionUrl: URL;
  body: unknown;
  credential?: string | null;
  fixtureMarker?: string | null;
  signal: AbortSignal;
}): Promise<AdmissionObservation> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (input.credential) headers['x-ta14-acceptance-executor'] = input.credential;
  if (input.fixtureMarker) headers['x-ta14-acceptance-fixture'] = input.fixtureMarker;
  const response = await fetch(input.admissionUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(input.body),
    cache: 'no-store',
    signal: input.signal,
  });
  const body = await response.json().catch(() => ({ error: 'Admission endpoint returned a non-JSON response.' }));
  return { status: response.status, body };
}

export async function GET() {
  return NextResponse.json({
    schema: 'TA14-Institutional-Acceptance-Executor-Readiness-v1',
    executorCredentialConfigured: Boolean(process.env.TA14_ACCEPTANCE_EXECUTOR_SECRET?.trim()),
    persistenceObservationConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
    ),
    deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    executionPerformed: false,
    boundary: 'Readiness only. This response performs no acceptance control and creates no acceptance evidence.',
  });
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
    findingRationale: 'No substantive architecture determination is made. This acceptance-only fixture exists solely to observe production admission, persistence, first-event chronology, and refusal behavior.',
    limitations: [
      'This fixture is not a participant finding, certification, Registry action, or substantive architecture examination.',
      'The executor records technical behavior only; institutional interpretation remains separate.',
      'This machine execution does not substitute for protocol controls that explicitly require an authenticated institutional-user retrieval or submission surface.',
    ],
    issuer: executorDecision.executorId,
    authorityRef: 'docs/institutional-acceptance-execution-authority-v1.md',
  });
  const sealedFinding = await sealTA14InstitutionalFinding(finding);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  const admissionUrl = new URL('/api/artifacts/governed/institutional-finding', request.url);

  try {
    const positiveAdmission = await admissionRequest({
      admissionUrl,
      credential: presentedCredential,
      fixtureMarker: 'acceptance-only',
      signal: controller.signal,
      body: { recordId, governanceRegistryIdentifier, governanceName, finding: sealedFinding },
    });

    if (positiveAdmission.status !== 201) {
      return NextResponse.json({
        schema: 'TA14-Institutional-Acceptance-Executor-Observation-v2',
        executedAt: new Date().toISOString(),
        executorId: executorDecision.executorId,
        deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
        acceptanceFixture: true,
        recordId,
        governanceRegistryIdentifier,
        governanceVersion,
        sealedFinding,
        firstExecutionPreserved: true,
        positiveAdmission,
        technicalDetermination: 'FAIL',
        protocolDetermination: 'INCOMPLETE',
        stoppedAfterFirstContraryResult: true,
        boundary: 'The positive authoritative admission did not return 201. No retry was attempted and no later mutation probe was executed.',
      }, { status: 200 });
    }

    const persisted = await inspectAcceptanceRecord(recordId);
    const chronology = persisted.chronology as Array<{ event_key?: string; event_type?: string; sequence_number?: number }>;
    const firstChronology = chronology[0] ?? null;

    const duplicateAdmission = await admissionRequest({
      admissionUrl,
      credential: presentedCredential,
      fixtureMarker: 'acceptance-only',
      signal: controller.signal,
      body: { recordId, governanceRegistryIdentifier, governanceName, finding: sealedFinding },
    });

    const tamperRecordId = `${recordId}-TAMPER`;
    const tamperedFinding = {
      ...sealedFinding,
      findingRationale: `${sealedFinding.findingRationale} [ACCEPTANCE TAMPER PROBE]`,
    };
    const tamperedAdmission = await admissionRequest({
      admissionUrl,
      credential: presentedCredential,
      fixtureMarker: 'acceptance-only',
      signal: controller.signal,
      body: {
        recordId: tamperRecordId,
        governanceRegistryIdentifier,
        governanceName,
        finding: tamperedFinding,
      },
    });
    const tamperPersistence = await inspectAcceptanceRecord(tamperRecordId);

    const noAuthRecordId = `${recordId}-NOAUTH`;
    const noAuthAdmission = await admissionRequest({
      admissionUrl,
      signal: controller.signal,
      body: {
        recordId: noAuthRecordId,
        governanceRegistryIdentifier,
        governanceName,
        finding: sealedFinding,
      },
    });
    const noAuthPersistence = await inspectAcceptanceRecord(noAuthRecordId);

    const missingFieldsRecordId = `${recordId}-MISSING-FIELDS`;
    const missingFieldsAdmission = await admissionRequest({
      admissionUrl,
      credential: presentedCredential,
      fixtureMarker: 'acceptance-only',
      signal: controller.signal,
      body: { recordId: missingFieldsRecordId },
    });
    const missingFieldsPersistence = await inspectAcceptanceRecord(missingFieldsRecordId);

    const unauthenticatedRetrievalResponse = await fetch(
      new URL(`/api/artifacts/governed/institutional-finding?artifactIdentifier=${encodeURIComponent(recordId)}`, request.url),
      { method: 'GET', cache: 'no-store', signal: controller.signal },
    );
    const unauthenticatedRetrievalBody = await unauthenticatedRetrievalResponse.json()
      .catch(() => ({ error: 'Controlled retrieval endpoint returned a non-JSON response.' }));

    const artifact = persisted.artifact as null | {
      artifact_identifier?: string;
      artifact_type?: string;
      governance_registry_identifier?: string;
      governance_name?: string;
      governance_version?: string;
      finding_class?: string;
      claims_boundary?: string;
      limitations?: unknown;
      evidence_object_identifiers?: unknown;
      source_sha256?: string;
      metadata?: Record<string, unknown>;
      publication_state?: string;
      disclosure_state?: string;
      file_publication_authorized?: boolean;
      public_file_url?: string | null;
      public_record_href?: string | null;
    };

    const technicalControls = {
      P07_SERVER_SEAL_REVERIFICATION: {
        result: (positiveAdmission.body as { sealVerified?: boolean } | null)?.sealVerified === true ? 'PASS' : 'FAIL',
        evidence: positiveAdmission,
      },
      P08_EXACTLY_ONE_GOVERNED_ARTIFACT: {
        result: artifact?.artifact_identifier === recordId && artifact?.artifact_type === 'INSTITUTIONAL_EXAMINATION_FINDING' ? 'PASS' : 'FAIL',
        observedArtifact: artifact,
      },
      P09_FIRST_CHRONOLOGY_EVENT: {
        result: chronology.length === 1 && firstChronology?.sequence_number === 1 && firstChronology?.event_type === 'INSTITUTIONAL_FINDING_RECORDED' ? 'PASS' : 'FAIL',
        chronology,
      },
      N04_TAMPERED_FINDING_REFUSED_NO_PERSISTENCE: {
        result: tamperedAdmission.status === 422 && tamperPersistence.artifact === null ? 'PASS' : 'FAIL',
        admission: tamperedAdmission,
        persistenceObserved: tamperPersistence.artifact !== null,
      },
      N05_MISSING_AUTHORITY_REFUSED: {
        result: noAuthAdmission.status === 401 && noAuthPersistence.artifact === null ? 'PASS' : 'FAIL',
        admission: noAuthAdmission,
        persistenceObserved: noAuthPersistence.artifact !== null,
      },
      N06_MISSING_FIELDS_REFUSED: {
        result: missingFieldsAdmission.status === 400 && missingFieldsPersistence.artifact === null ? 'PASS' : 'FAIL',
        admission: missingFieldsAdmission,
        persistenceObserved: missingFieldsPersistence.artifact !== null,
      },
      N07_DUPLICATE_IMMUTABLE_ID_REFUSED: {
        result: duplicateAdmission.status === 409 ? 'PASS' : 'FAIL',
        admission: duplicateAdmission,
      },
      N09_UNAUTHENTICATED_CONTROLLED_RETRIEVAL_REFUSED: {
        result: unauthenticatedRetrievalResponse.status === 401 ? 'PASS' : 'FAIL',
        status: unauthenticatedRetrievalResponse.status,
        body: unauthenticatedRetrievalBody,
      },
      N10_CONTROLLED_RECORD_NOT_PUBLICATION_AUTHORIZED: {
        result: artifact?.publication_state === 'INSTITUTIONAL_RECORD'
          && artifact?.disclosure_state === 'CONTROLLED'
          && artifact?.file_publication_authorized === false
          && artifact?.public_file_url === null
          && artifact?.public_record_href === null ? 'PASS' : 'FAIL',
        observedProjectionState: artifact ? {
          publication_state: artifact.publication_state,
          disclosure_state: artifact.disclosure_state,
          file_publication_authorized: artifact.file_publication_authorized,
          public_file_url: artifact.public_file_url,
          public_record_href: artifact.public_record_href,
        } : null,
      },
    } as const;

    const technicalResults = Object.values(technicalControls).map(control => control.result);
    const technicalFailed = technicalResults.filter(result => result === 'FAIL').length;

    return NextResponse.json({
      schema: 'TA14-Institutional-Acceptance-Executor-Observation-v2',
      executedAt: new Date().toISOString(),
      executorId: executorDecision.executorId,
      deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      acceptanceFixture: true,
      recordId,
      governanceRegistryIdentifier,
      governanceVersion,
      sealedFinding,
      firstExecutionPreserved: true,
      positiveAdmission,
      persistedObservation: persisted,
      technicalControls,
      technicalDetermination: technicalFailed === 0 ? 'PASS' : 'FAIL',
      protocolDetermination: 'INCOMPLETE',
      protocolControlsStillReserved: [
        'P01-P03 examination receipt/review/evidence-admission production path',
        'P06 authenticated institutional-user submission',
        'P10 authenticated controlled viewer and findings-index retrieval',
        'P11 authenticated retrieved-record preservation verification',
        'N01 tampered-receipt review refusal',
        'N08 chronology-failure rollback fault injection',
      ],
      determinationBoundary: 'Technical PASS/FAIL values apply only to the enumerated production observations in this response. The executor does not award full protocol PASS, issue participant findings, alter Registry standing, or substitute for authenticated institutional-user controls.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown executor failure.';
    return NextResponse.json({
      error: 'Acceptance executor could not complete the authoritative production probe.',
      detail: message,
      firstExecutionPreserved: true,
      determination: 'INCOMPLETE',
    }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
