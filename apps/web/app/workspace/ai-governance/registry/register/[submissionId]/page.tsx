'use client';

import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type RegistryEvidence = {
  id: string;
  original_filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  sha256_hex: string | null;
  evidence_relationship: string | null;
  evidence_classification: string | null;
  description: string | null;
  visibility: string | null;
  evidence_state: string | null;
  submitted_at: string | null;
};

type RegistryPublication = {
  id: string;
  publication_type: string | null;
  title: string | null;
  authors: string | null;
  publisher_or_platform: string | null;
  publication_date: string | null;
  url: string | null;
  doi: string | null;
  isbn: string | null;
  relationship_to_governance: string | null;
};

type RegistryRepository = {
  id: string;
  provider: string | null;
  repository_name: string | null;
  repository_owner: string | null;
  repository_url: string | null;
  release_or_tag: string | null;
  commit_sha: string | null;
  license: string | null;
  relationship_to_governance: string | null;
};

type RegistryZenodoRecord = {
  id: string;
  title: string | null;
  record_url: string | null;
  doi: string | null;
  concept_doi: string | null;
  zenodo_record_id: string | null;
  version: string | null;
  publication_date: string | null;
  creators: string | null;
  relationship_to_governance: string | null;
};

type RegistryPatentRecord = {
  id: string;
  title: string | null;
  jurisdiction: string | null;
  filing_type: string | null;
  application_status: string | null;
  application_number: string | null;
  publication_number: string | null;
  patent_number: string | null;
  filing_date: string | null;
  grant_date: string | null;
  inventors: string | null;
  applicant_or_assignee: string | null;
  official_url: string | null;
  relationship_to_governance: string | null;
};

type RegistryReviewNote = {
  id: string;
  review_stage: string | null;
  note_type: string | null;
  note_text: string | null;
  created_at: string | null;
};

type RegistrySubmission = {
  id: string;
  governance_name: string;
  short_name: string | null;
  current_version: string | null;
  governance_category: string | null;
  plain_language_description: string | null;
  formal_claims: string | null;
  explicit_non_claims: string | null;
  limitations: string | null;
  status: string;
  record_visibility: string | null;
  registry_identifier: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  accepted_at: string | null;
  finalized_at?: string | null;
  published_at?: string | null;
  review_pathway?: string | null;
  claimant_name?: string | null;
  current_steward?: string | null;
  organization_name?: string | null;
  authority_basis?: string | null;
  ownership_declaration?: string | null;
  license_statement?: string | null;
  known_disputes?: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return 'Not recorded';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function label(value: string | null | undefined, fallback = 'Not declared') {
  if (!value?.trim()) return fallback;

  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function RegistrySubmissionWorkspacePage() {
  const params = useParams<{ submissionId: string }>();
  const submissionId = useMemo(
    () => decodeURIComponent(params.submissionId ?? '').trim(),
    [params.submissionId],
  );

  const [record, setRecord] = useState<RegistrySubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [evidence, setEvidence] = useState<RegistryEvidence[]>([]);
  const [publications, setPublications] = useState<RegistryPublication[]>([]);
  const [repositories, setRepositories] = useState<RegistryRepository[]>([]);
  const [zenodoRecords, setZenodoRecords] = useState<RegistryZenodoRecord[]>([]);
  const [patentRecords, setPatentRecords] = useState<RegistryPatentRecord[]>([]);
  const [reviewNotes, setReviewNotes] = useState<RegistryReviewNote[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;

    return createBrowserClient(url, anonKey);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSubmission() {
      setLoading(true);
      setError('');
      setNotFound(false);

      try {
        if (!supabase) {
          throw new Error('Supabase environment variables are not configured.');
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.access_token) {
          throw new Error(
            'Your Registry session is missing or expired. Sign in again.',
          );
        }

        const { data, error: queryError } = await supabase
          .from('ai_governance_registry_submissions')
          .select(
            [
              'id',
              'governance_name',
              'short_name',
              'current_version',
              'governance_category',
              'plain_language_description',
              'formal_claims',
              'explicit_non_claims',
              'limitations',
              'status',
              'record_visibility',
              'registry_identifier',
              'submitted_at',
              'reviewed_at',
              'accepted_at',
              'finalized_at',
              'published_at',
              'review_pathway',
              'claimant_name',
              'current_steward',
              'organization_name',
              'authority_basis',
              'ownership_declaration',
              'license_statement',
              'known_disputes',
              'created_at',
              'updated_at',
            ].join(','),
          )
          .eq('id', submissionId)
          .maybeSingle();

        if (queryError) throw queryError;

        if (cancelled) return;

        if (!data) {
          setNotFound(true);
          return;
        }

        setRecord(data as unknown as RegistrySubmission);

        setRelatedLoading(true);
        const [
          evidenceResult,
          publicationsResult,
          repositoriesResult,
          zenodoResult,
          patentsResult,
          notesResult,
        ] = await Promise.all([
          supabase
            .from('ai_governance_registry_evidence')
            .select('id,original_filename,mime_type,size_bytes,sha256_hex,evidence_relationship,evidence_classification,description,visibility,evidence_state,submitted_at')
            .eq('submission_id', submissionId)
            .order('submitted_at', { ascending: true }),
          supabase
            .from('ai_governance_registry_publications')
            .select('id,publication_type,title,authors,publisher_or_platform,publication_date,url,doi,isbn,relationship_to_governance')
            .eq('submission_id', submissionId)
            .order('publication_date', { ascending: true }),
          supabase
            .from('ai_governance_registry_repositories')
            .select('id,provider,repository_name,repository_owner,repository_url,release_or_tag,commit_sha,license,relationship_to_governance')
            .eq('submission_id', submissionId),
          supabase
            .from('ai_governance_registry_zenodo_records')
            .select('id,title,record_url,doi,concept_doi,zenodo_record_id,version,publication_date,creators,relationship_to_governance')
            .eq('submission_id', submissionId),
          supabase
            .from('ai_governance_registry_patent_records')
            .select('id,title,jurisdiction,filing_type,application_status,application_number,publication_number,patent_number,filing_date,grant_date,inventors,applicant_or_assignee,official_url,relationship_to_governance')
            .eq('submission_id', submissionId),
          supabase
            .from('ai_governance_registry_review_notes')
            .select('id,review_stage,note_type,note_text,created_at')
            .eq('submission_id', submissionId)
            .order('created_at', { ascending: true }),
        ]);

        if (!cancelled) {
          setEvidence((evidenceResult.data ?? []) as RegistryEvidence[]);
          setPublications((publicationsResult.data ?? []) as RegistryPublication[]);
          setRepositories((repositoriesResult.data ?? []) as RegistryRepository[]);
          setZenodoRecords((zenodoResult.data ?? []) as RegistryZenodoRecord[]);
          setPatentRecords((patentsResult.data ?? []) as RegistryPatentRecord[]);
          setReviewNotes((notesResult.data ?? []) as RegistryReviewNote[]);
        }
      } catch (caught) {
        if (cancelled) return;

        setError(
          caught instanceof Error
            ? caught.message
            : 'The Registry record could not be loaded.',
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRelatedLoading(false);
        }
      }
    }

    if (submissionId) {
      void loadSubmission();
    } else {
      setLoading(false);
      setNotFound(true);
    }

    return () => {
      cancelled = true;
    };
  }, [submissionId, supabase]);

  const isDraft = record?.status?.toLowerCase() === 'draft';
  const normalizedStatus = record?.status?.toLowerCase() ?? '';
  const isDraft = normalizedStatus === 'draft';
  const isRegistered =
    ['registered', 'published'].includes(normalizedStatus) &&
    Boolean(record?.registry_identifier);

  const lifecycleStages = [
    { key: 'draft', label: 'Draft' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'administrative_review', label: 'Administrative Review' },
    { key: 'identity_review', label: 'Identity Review' },
    { key: 'evidence_review', label: 'Evidence Review' },
    { key: 'accepted', label: 'Registry Acceptance' },
    { key: 'identifier_assigned', label: 'Identifier Assigned' },
    { key: 'published', label: 'Published' },
  ];

  const currentLifecycleIndex = (() => {
    if (!record) return 0;
    if (['published', 'registered'].includes(normalizedStatus) && record.registry_identifier) return 7;
    if (record.registry_identifier) return 6;
    if (record.accepted_at || normalizedStatus === 'accepted') return 5;
    if (normalizedStatus === 'evidence_review') return 4;
    if (normalizedStatus === 'identity_review') return 3;
    if (normalizedStatus === 'administrative_review' || normalizedStatus === 'under_review') return 2;
    if (record.submitted_at || normalizedStatus === 'submitted') return 1;
    return 0;
  })();

  const readiness = useMemo(() => {
    if (!record) {
      return {
        identity: 0,
        attribution: 0,
        claims: 0,
        nonClaims: 0,
        evidence: 0,
        versioning: 0,
        publications: 0,
        repositories: 0,
        overall: 0,
      };
    }

    const ratio = (items: unknown[]) =>
      Math.round((items.filter(Boolean).length / Math.max(items.length, 1)) * 100);

    const scores = {
      identity: ratio([
        record.governance_name,
        record.short_name || true,
        record.current_version,
        record.governance_category,
        record.plain_language_description,
      ]),
      attribution: ratio([
        record.claimant_name,
        record.current_steward || record.claimant_name,
        record.organization_name || true,
        record.authority_basis,
      ]),
      claims: ratio([record.formal_claims]),
      nonClaims: ratio([record.explicit_non_claims, record.limitations || true]),
      evidence: Math.min(100, evidence.length * 20),
      versioning: ratio([
        record.current_version,
        record.updated_at,
        record.created_at,
      ]),
      publications: Math.min(100, publications.length * 25),
      repositories: Math.min(
        100,
        repositories.length * 30 + zenodoRecords.length * 20 + patentRecords.length * 10,
      ),
    };

    return {
      ...scores,
      overall: Math.round(
        Object.values(scores).reduce((total, value) => total + value, 0) /
          Object.values(scores).length,
      ),
    };
  }, [
    record,
    evidence.length,
    publications.length,
    repositories.length,
    zenodoRecords.length,
    patentRecords.length,
  ]);

  const lifecycleAction = (() => {
    if (!record) return null;
    if (['published', 'registered'].includes(normalizedStatus) && record.registry_identifier) {
      return {
        label: 'Open Permanent Record',
        href: `/workspace/ai-governance/registry/records/${encodeURIComponent(record.registry_identifier)}`,
        className: 'primaryButton',
      };
    }
    if (normalizedStatus === 'superseded') {
      return {
        label: 'Compare Versions',
        href: `/workspace/ai-governance/registry/records/${encodeURIComponent(record.registry_identifier ?? record.id)}?view=versions`,
        className: 'secondaryButton',
      };
    }
    if (normalizedStatus === 'disputed') {
      return {
        label: 'Open Dispute Workspace',
        href: `/workspace/ai-governance/registry/register/${encodeURIComponent(record.id)}?view=dispute`,
        className: 'primaryButton dangerAction',
      };
    }
    if (isDraft) {
      return {
        label: 'Continue Draft',
        href: `/workspace/ai-governance/registry/register?draft=${encodeURIComponent(record.id)}`,
        className: 'primaryButton',
      };
    }
    if (['submitted', 'administrative_review', 'identity_review', 'evidence_review', 'under_review'].includes(normalizedStatus)) {
      return {
        label: 'View Review Status',
        href: `#review-notes`,
        className: 'primaryButton',
      };
    }
    if (normalizedStatus === 'accepted') {
      return {
        label: 'Await Registry Identifier',
        href: '#lifecycle',
        className: 'secondaryButton',
      };
    }
    return {
      label: 'Return to My Records',
      href: '/workspace/ai-governance/registry/my-records',
      className: 'secondaryButton',
    };
  })();

  function downloadWorkspaceReceipt() {
    if (!record) return;

    const receipt = {
      receiptType: 'TA-14 AI Governance Registry Submission Workspace Receipt',
      generatedAt: new Date().toISOString(),
      submission: {
        id: record.id,
        governanceName: record.governance_name,
        status: record.status,
        registryIdentifier: record.registry_identifier,
        currentVersion: record.current_version,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        submittedAt: record.submitted_at,
        reviewedAt: record.reviewed_at,
        acceptedAt: record.accepted_at,
      },
      packageCounts: {
        evidence: evidence.length,
        publications: publications.length,
        repositories: repositories.length,
        zenodoRecords: zenodoRecords.length,
        patentRecords: patentRecords.length,
        reviewNotes: reviewNotes.length,
      },
      readiness,
      registryBoundary:
        'This receipt documents the current state of an account-scoped Registry submission. It is not certification, public registration, legal validation, regulatory approval, or proof of technical performance.',
    };

    const blob = new Blob([JSON.stringify(receipt, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${record.short_name || record.governance_name || 'registry-submission'}-workspace-receipt.json`
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, '-');
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="pageShell">
      <div className="stars starsOne" aria-hidden="true" />
      <div className="stars starsTwo" aria-hidden="true" />
      <div className="orbit orbitOne" aria-hidden="true" />
      <div className="orbit orbitTwo" aria-hidden="true" />

      <nav className="topBar">
        <Link
          href="/workspace/ai-governance/registry/my-records"
          className="secondaryButton"
        >
          Back to My Registry Records
        </Link>

        <Link
          href="/workspace/ai-governance/registry"
          className="textLink"
        >
          Registry Home
        </Link>
      </nav>

      {loading ? (
        <section className="stateCard">
          <span className="pulseDot" aria-hidden="true" />
          <div>
            <p className="eyebrow">REGISTRY WORKSPACE</p>
            <h1>Opening submission.</h1>
            <p>
              Retrieving the account-scoped Registry record and lifecycle
              state.
            </p>
          </div>
        </section>
      ) : null}

      {!loading && notFound ? (
        <section className="stateCard">
          <div>
            <p className="eyebrow">RECORD NOT FOUND</p>
            <h1>This Registry submission is unavailable.</h1>
            <p>
              The record may not exist, may belong to another account, or may
              not be accessible under the current Registry policies.
            </p>
          </div>

          <Link
            href="/workspace/ai-governance/registry/my-records"
            className="primaryButton"
          >
            Return to My Records
          </Link>
        </section>
      ) : null}

      {!loading && error ? (
        <section className="stateCard errorCard">
          <div>
            <p className="eyebrow">REGISTRY RECORD UNAVAILABLE</p>
            <h1>The submission could not be opened.</h1>
            <p>{error}</p>
          </div>

          <button
            type="button"
            className="primaryButton"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </section>
      ) : null}

      {!loading && record ? (
        <>
          <section className="hero">
            <div className="heroCopy">
              <p className="eyebrow">ACCOUNT-SCOPED REGISTRY RECORD</p>
              <p className="recordId">{record.id}</p>
              <h1>{record.governance_name}</h1>
              <p className="lead">
                {record.plain_language_description ||
                  'No plain-language description has been preserved for this record yet.'}
              </p>

              <div className="badgeRow">
                <span>{label(record.status)}</span>
                <span>{label(record.record_visibility, 'Visibility pending')}</span>
                {record.current_version ? (
                  <span>Version {record.current_version}</span>
                ) : null}
              </div>
            </div>

            <aside className="lifecyclePanel">
              <p className="eyebrow">CURRENT LIFECYCLE STATE</p>
              <strong>{label(record.status)}</strong>
              <p>
                Draft, submission, review, acceptance, finalization, and
                registration remain separate controlled states.
              </p>
            </aside>
          </section>

          <section className="boundaryCard">
            <p className="eyebrow">REGISTRY BOUNDARY</p>
            <h2>Registration is not certification.</h2>
            <p>
              This workspace preserves the registrant&apos;s record and its
              lifecycle state. It does not certify effectiveness, legality,
              safety, compliance, or operational fitness.
            </p>
          </section>

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">IDENTITY</p>
              <h2>Core Registry Record</h2>
            </div>

            <dl className="detailGrid">
              <div>
                <dt>Governance name</dt>
                <dd>{record.governance_name}</dd>
              </div>
              <div>
                <dt>Short name</dt>
                <dd>{record.short_name || 'Not declared'}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{label(record.governance_category)}</dd>
              </div>
              <div>
                <dt>Current version</dt>
                <dd>{record.current_version || 'Not declared'}</dd>
              </div>
              <div>
                <dt>Visibility</dt>
                <dd>{label(record.record_visibility)}</dd>
              </div>
              <div>
                <dt>Registry identifier</dt>
                <dd className="mono">
                  {record.registry_identifier || 'Permanent identifier pending'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">DECLARED GOVERNANCE POSITION</p>
              <h2>Claims, Non-Claims, and Limitations</h2>
            </div>

            <div className="statementGrid">
              <article>
                <h3>Formal claims</h3>
                <p>{record.formal_claims || 'No formal claims recorded.'}</p>
              </article>
              <article>
                <h3>Explicit non-claims</h3>
                <p>
                  {record.explicit_non_claims ||
                    'No explicit non-claims recorded.'}
                </p>
              </article>
              <article>
                <h3>Limitations</h3>
                <p>{record.limitations || 'No limitations recorded.'}</p>
              </article>
            </div>
          </section>

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">LIFECYCLE TIMESTAMPS</p>
              <h2>Preserved State History</h2>
            </div>

            <dl className="detailGrid">
              <div>
                <dt>Created</dt>
                <dd>{formatDate(record.created_at)}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{formatDate(record.updated_at)}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>{formatDate(record.submitted_at)}</dd>
              </div>
              <div>
                <dt>Reviewed</dt>
                <dd>{formatDate(record.reviewed_at)}</dd>
              </div>
              <div>
                <dt>Accepted</dt>
                <dd>{formatDate(record.accepted_at)}</dd>
              </div>
              <div>
                <dt>Finalized</dt>
                <dd>{formatDate(record.finalized_at ?? null)}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{formatDate(record.published_at ?? null)}</dd>
              </div>
            </dl>
          </section>

          <section id="lifecycle" className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">REGISTRY PROGRESS TIMELINE</p>
              <h2>Lifecycle stages remain separate and reviewable.</h2>
              <p className="sectionLead">
                The highlighted stage shows the current preserved state. Later stages are not implied
                until the Registry records them.
              </p>
            </div>

            <div className="lifecycleTimeline">
              {lifecycleStages.map((stage, index) => (
                <div
                  key={stage.key}
                  className={`${index < currentLifecycleIndex ? 'completed' : ''} ${
                    index === currentLifecycleIndex ? 'current' : ''
                  }`}
                >
                  <span>{index < currentLifecycleIndex ? '✓' : String(index + 1).padStart(2, '0')}</span>
                  <strong>{stage.label}</strong>
                  {index < lifecycleStages.length - 1 ? <i>→</i> : null}
                </div>
              ))}
            </div>
          </section>

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">REGISTRY READINESS DASHBOARD</p>
              <h2>Quality indicators for the preserved intake.</h2>
              <p className="sectionLead">
                These indicators describe completeness and supporting-record coverage. They are not
                certification, endorsement, technical validation, or a legal finding.
              </p>
            </div>

            <div className="readinessSummary">
              <div>
                <span>Overall Registry Readiness</span>
                <strong>{readiness.overall}%</strong>
              </div>
              <p>
                {relatedLoading
                  ? 'Loading supporting Registry records.'
                  : `${evidence.length} evidence file(s), ${publications.length} publication(s), ${repositories.length} repository record(s), ${zenodoRecords.length} Zenodo record(s), and ${patentRecords.length} patent record(s) are currently associated with this submission.`}
              </p>
            </div>

            <div className="readinessGrid">
              {[
                ['Identity completeness', readiness.identity],
                ['Attribution completeness', readiness.attribution],
                ['Claims completeness', readiness.claims],
                ['Non-claims completeness', readiness.nonClaims],
                ['Evidence completeness', readiness.evidence],
                ['Version documentation', readiness.versioning],
                ['Publication coverage', readiness.publications],
                ['Repository coverage', readiness.repositories],
              ].map(([itemLabel, value]) => (
                <article key={String(itemLabel)}>
                  <div>
                    <span>{itemLabel}</span>
                    <strong>{value}%</strong>
                  </div>
                  <div className="scoreTrack">
                    <i style={{ width: `${value}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">EVIDENCE WORKSPACE</p>
              <h2>The complete supporting package.</h2>
              <p className="sectionLead">
                Evidence, publications, repositories, deposits, patents, and rights declarations
                remain distinguishable because they carry different evidentiary meanings.
              </p>
            </div>

            <div className="evidenceWorkspace">
              <article className="evidenceGroup">
                <div className="groupHeading">
                  <div><span>EV</span><h3>Evidence Files</h3></div>
                  <strong>{evidence.length}</strong>
                </div>
                {evidence.length === 0 ? (
                  <p className="emptyState">No evidence files are currently visible for this submission.</p>
                ) : (
                  <div className="recordList">
                    {evidence.map((item) => (
                      <div key={item.id}>
                        <div>
                          <strong>{item.original_filename}</strong>
                          <span>{label(item.evidence_classification)} · {label(item.evidence_relationship)}</span>
                        </div>
                        <p>{item.description || 'No evidence description recorded.'}</p>
                        <code>{item.sha256_hex || 'SHA-256 unavailable'}</code>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="evidenceGroup">
                <div className="groupHeading">
                  <div><span>PB</span><h3>Publications</h3></div>
                  <strong>{publications.length}</strong>
                </div>
                {publications.length === 0 ? (
                  <p className="emptyState">No publications are currently associated with this submission.</p>
                ) : (
                  <div className="recordList compactList">
                    {publications.map((item) => (
                      <div key={item.id}>
                        <div>
                          <strong>{item.title || 'Untitled publication'}</strong>
                          <span>{label(item.publication_type)} · {item.authors || 'Author not declared'}</span>
                        </div>
                        <p>{item.relationship_to_governance || 'Relationship not described.'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="evidenceGroup">
                <div className="groupHeading">
                  <div><span>GH</span><h3>Repositories</h3></div>
                  <strong>{repositories.length}</strong>
                </div>
                {repositories.length === 0 ? (
                  <p className="emptyState">No software repositories are currently associated with this submission.</p>
                ) : (
                  <div className="recordList compactList">
                    {repositories.map((item) => (
                      <div key={item.id}>
                        <div>
                          <strong>{item.repository_name || 'Unnamed repository'}</strong>
                          <span>{label(item.provider)} · {item.repository_owner || 'Owner not declared'}</span>
                        </div>
                        <p>{item.relationship_to_governance || item.repository_url || 'Relationship not described.'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="evidenceGroup">
                <div className="groupHeading">
                  <div><span>ZE</span><h3>Zenodo Records</h3></div>
                  <strong>{zenodoRecords.length}</strong>
                </div>
                {zenodoRecords.length === 0 ? (
                  <p className="emptyState">No Zenodo deposits are currently associated with this submission.</p>
                ) : (
                  <div className="recordList compactList">
                    {zenodoRecords.map((item) => (
                      <div key={item.id}>
                        <div>
                          <strong>{item.title || 'Untitled Zenodo record'}</strong>
                          <span>{item.doi || item.concept_doi || item.zenodo_record_id || 'Identifier not declared'}</span>
                        </div>
                        <p>{item.relationship_to_governance || 'Relationship not described.'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="evidenceGroup">
                <div className="groupHeading">
                  <div><span>IP</span><h3>Patent Records</h3></div>
                  <strong>{patentRecords.length}</strong>
                </div>
                {patentRecords.length === 0 ? (
                  <p className="emptyState">No patent records are currently associated with this submission.</p>
                ) : (
                  <div className="recordList compactList">
                    {patentRecords.map((item) => (
                      <div key={item.id}>
                        <div>
                          <strong>{item.title || 'Untitled patent record'}</strong>
                          <span>{item.application_number || item.patent_number || 'Identifier not declared'} · {label(item.application_status)}</span>
                        </div>
                        <p>{item.relationship_to_governance || 'Relationship not described.'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="evidenceGroup rightsGroup">
                <div className="groupHeading">
                  <div><span>RT</span><h3>Rights & Disputes</h3></div>
                </div>
                <dl className="rightsList">
                  <div><dt>Ownership declaration</dt><dd>{record.ownership_declaration || 'Not declared'}</dd></div>
                  <div><dt>License statement</dt><dd>{record.license_statement || 'Not declared'}</dd></div>
                  <div><dt>Known disputes</dt><dd>{record.known_disputes || 'None recorded'}</dd></div>
                </dl>
              </article>
            </div>
          </section>

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">INTAKE RECEIPT</p>
              <h2>Download a snapshot of the current submission state.</h2>
              <p className="sectionLead">
                The receipt preserves lifecycle state, timestamps, supporting-record counts, and
                readiness indicators. It does not create a public Registry identifier.
              </p>
            </div>

            <div className="receiptPanel">
              <dl>
                <div><dt>Draft or submission ID</dt><dd className="mono">{record.id}</dd></div>
                <div><dt>Registry identifier</dt><dd className="mono">{record.registry_identifier || 'Pending'}</dd></div>
                <div><dt>Submitted</dt><dd>{formatDate(record.submitted_at)}</dd></div>
                <div><dt>Current lifecycle state</dt><dd>{label(record.status)}</dd></div>
                <div><dt>Evidence package</dt><dd>{evidence.length} file(s)</dd></div>
                <div><dt>Readiness snapshot</dt><dd>{readiness.overall}%</dd></div>
              </dl>

              <button type="button" className="primaryButton" onClick={downloadWorkspaceReceipt}>
                Download Workspace Receipt
              </button>
            </div>
          </section>

          <section id="review-notes" className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">REGISTRY REVIEW NOTES</p>
              <h2>Preserved review activity and clarification history.</h2>
              <p className="sectionLead">
                Administrative observations, identity questions, evidence findings, clarification
                requests, registrant responses, and final dispositions remain attributable.
              </p>
            </div>

            {reviewNotes.length === 0 ? (
              <div className="emptyReviewState">
                <strong>No Registry review notes have been recorded yet.</strong>
                <p>
                  This space is reserved for preserved review activity. The absence of a note does
                  not imply approval, acceptance, or completion.
                </p>
              </div>
            ) : (
              <div className="reviewTimeline">
                {reviewNotes.map((note, index) => (
                  <article key={note.id}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <small>{label(note.review_stage)} · {formatDate(note.created_at)}</small>
                      <h3>{label(note.note_type, 'Review Note')}</h3>
                      <p>{note.note_text || 'No review note text preserved.'}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="actionCard">
            <div>
              <p className="eyebrow">AVAILABLE ACTION</p>
              <h2>
                {isRegistered
                  ? 'Open the permanent public Registry record.'
                  : isDraft
                    ? 'Continue developing this Registry draft.'
                    : 'Review the preserved Registry submission.'}
              </h2>
              <p>
                Editing remains available only while the record is in a
                permitted editable state.
              </p>
            </div>

            {lifecycleAction ? (
              <Link href={lifecycleAction.href} className={lifecycleAction.className}>
                {lifecycleAction.label}
              </Link>
            ) : null}
          </section>
        </>
      ) : null}

      <style jsx global>{styles}</style>
    </main>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background:
      radial-gradient(circle at 12% 8%, rgba(74, 122, 255, 0.18), transparent 32rem),
      radial-gradient(circle at 88% 12%, rgba(103, 231, 195, 0.12), transparent 30rem),
      radial-gradient(circle at 50% 92%, rgba(255, 184, 82, 0.08), transparent 32rem),
      #07101f;
    color: #eef4ff;
  }

  .pageShell {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    padding: 32px 24px 86px;
  }

  .pageShell > *:not(.stars):not(.orbit) {
    position: relative;
    z-index: 2;
  }

  .stars {
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.42;
    background-image:
      radial-gradient(circle, rgba(255,255,255,.8) 0 1px, transparent 1.3px);
    background-size: 54px 54px;
    animation: starDrift 28s linear infinite;
  }

  .starsTwo {
    opacity: 0.18;
    background-size: 86px 86px;
    animation-duration: 48s;
    animation-direction: reverse;
  }

  .orbit {
    position: fixed;
    width: 430px;
    height: 430px;
    border: 1px solid rgba(127, 228, 196, 0.12);
    border-radius: 50%;
    pointer-events: none;
    animation: rotateOrbit 36s linear infinite;
  }

  .orbit::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    top: 22px;
    left: 210px;
    border-radius: 50%;
    background: rgba(127, 228, 196, 0.85);
    box-shadow: 0 0 24px rgba(127, 228, 196, 0.9);
  }

  .orbitOne {
    top: 5%;
    right: -200px;
  }

  .orbitTwo {
    width: 540px;
    height: 540px;
    left: -240px;
    bottom: 3%;
    animation-duration: 52s;
    animation-direction: reverse;
  }

  .topBar,
  .hero,
  .boundaryCard,
  .sectionCard,
  .actionCard,
  .stateCard {
    width: min(1180px, 100%);
    margin-inline: auto;
  }

  .topBar {
    margin-bottom: 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
  }

  .hero {
    margin-bottom: 22px;
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.5fr);
    gap: 28px;
  }

  .heroCopy,
  .lifecyclePanel,
  .boundaryCard,
  .sectionCard,
  .actionCard,
  .stateCard {
    border: 1px solid rgba(164, 190, 231, 0.18);
    background: rgba(11, 25, 47, 0.86);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(18px);
  }

  .heroCopy,
  .lifecyclePanel,
  .sectionCard,
  .actionCard,
  .stateCard {
    border-radius: 24px;
  }

  .heroCopy {
    padding: clamp(28px, 5vw, 54px);
  }

  .lifecyclePanel {
    padding: 26px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .lifecyclePanel strong {
    margin-bottom: 12px;
    font-size: 2.2rem;
  }

  h1,
  h2,
  h3,
  p {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 18px;
    font-size: clamp(2.7rem, 6vw, 5.7rem);
    line-height: 0.95;
    letter-spacing: -0.055em;
  }

  h2 {
    margin-bottom: 12px;
    font-size: clamp(1.6rem, 3.2vw, 2.7rem);
    letter-spacing: -0.04em;
  }

  h3 {
    margin-bottom: 10px;
    font-size: 1.05rem;
  }

  .eyebrow {
    margin-bottom: 10px;
    color: #7fe4c4;
    font-size: 0.76rem;
    font-weight: 900;
    letter-spacing: 0.18em;
  }

  .recordId {
    margin-bottom: 12px;
    color: #ffd27f;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.82rem;
    font-weight: 900;
    overflow-wrap: anywhere;
  }

  .lead,
  .lifecyclePanel p,
  .boundaryCard p,
  .statementGrid p,
  .actionCard p,
  .stateCard p {
    margin-bottom: 0;
    color: #aebdd4;
    line-height: 1.7;
  }

  .badgeRow {
    margin-top: 22px;
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .badgeRow span {
    padding: 8px 11px;
    border: 1px solid rgba(127, 228, 196, 0.2);
    border-radius: 999px;
    background: rgba(31, 71, 91, 0.42);
    color: #c8f6e7;
    font-size: 0.8rem;
    font-weight: 800;
  }

  .boundaryCard {
    margin-bottom: 18px;
    padding: 24px;
    border-left: 4px solid #ffd27f;
    border-radius: 18px;
  }

  .sectionCard {
    margin-bottom: 18px;
    padding: 28px;
  }

  .sectionHeading {
    margin-bottom: 20px;
  }

  .detailGrid {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .detailGrid > div,
  .statementGrid article {
    min-width: 0;
    padding: 16px;
    border: 1px solid rgba(164, 190, 231, 0.11);
    border-radius: 14px;
    background: rgba(7, 17, 33, 0.4);
  }

  dt {
    margin-bottom: 6px;
    color: #8092ae;
    font-size: 0.7rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  .mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .statementGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .sectionLead {
    max-width: 860px;
    margin: 0;
    color: #9eafc7;
    line-height: 1.7;
  }

  .lifecycleTimeline {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 8px;
  }

  .lifecycleTimeline > div {
    min-width: 0;
    display: grid;
    grid-template-columns: 30px 1fr;
    gap: 8px;
    align-items: center;
    padding: 12px;
    position: relative;
    border: 1px solid rgba(164, 190, 231, 0.11);
    border-radius: 13px;
    background: rgba(7, 17, 33, 0.4);
  }

  .lifecycleTimeline > div > span {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: #8394ab;
    background: rgba(255,255,255,.04);
    font-size: .68rem;
    font-weight: 900;
  }

  .lifecycleTimeline > div > strong {
    font-size: .78rem;
    line-height: 1.25;
  }

  .lifecycleTimeline > div > i {
    display: none;
  }

  .lifecycleTimeline > div.completed {
    border-color: rgba(127, 228, 196, 0.22);
    background: rgba(20, 79, 65, 0.17);
  }

  .lifecycleTimeline > div.completed > span {
    color: #071610;
    background: #7fe4c4;
  }

  .lifecycleTimeline > div.current {
    border-color: rgba(255, 210, 127, 0.5);
    background: rgba(96, 65, 22, 0.28);
    box-shadow: 0 0 0 2px rgba(255, 210, 127, 0.06);
  }

  .lifecycleTimeline > div.current > span {
    color: #171005;
    background: #ffd27f;
  }

  .readinessSummary {
    margin-bottom: 18px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    border: 1px solid rgba(255, 210, 127, 0.18);
    border-radius: 16px;
    background: rgba(84, 56, 20, 0.18);
  }

  .readinessSummary > div span {
    display: block;
    color: #aebdd4;
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .readinessSummary > div strong {
    display: block;
    margin-top: 4px;
    color: #ffd27f;
    font-size: 2.6rem;
  }

  .readinessSummary p {
    max-width: 680px;
    margin: 0;
    color: #aebdd4;
    line-height: 1.65;
  }

  .readinessGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .readinessGrid article {
    padding: 15px;
    border: 1px solid rgba(164, 190, 231, 0.11);
    border-radius: 13px;
    background: rgba(7, 17, 33, 0.4);
  }

  .readinessGrid article > div:first-child {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .readinessGrid span {
    color: #96a7bf;
    font-size: .74rem;
  }

  .readinessGrid strong {
    color: #d9e8f6;
    font-size: .78rem;
  }

  .scoreTrack {
    height: 6px;
    margin-top: 12px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255,255,255,.06);
  }

  .scoreTrack i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #74b7ff, #7fe4c4, #ffd27f);
  }

  .evidenceWorkspace {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .evidenceGroup {
    min-width: 0;
    padding: 18px;
    border: 1px solid rgba(164, 190, 231, 0.11);
    border-radius: 16px;
    background: rgba(7, 17, 33, 0.4);
  }

  .rightsGroup {
    grid-column: 1 / -1;
  }

  .groupHeading {
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
  }

  .groupHeading > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .groupHeading > div > span {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    color: #171005;
    background: linear-gradient(145deg, #ffe4a6, #e8a33d);
    font-family: Georgia, serif;
    font-weight: 900;
  }

  .groupHeading h3 {
    margin: 0;
    font-size: 1.08rem;
  }

  .groupHeading > strong {
    min-width: 34px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    color: #c8f6e7;
    background: rgba(31, 71, 91, 0.42);
    font-size: .78rem;
  }

  .recordList {
    display: grid;
    gap: 10px;
  }

  .recordList > div {
    min-width: 0;
    padding: 13px;
    border: 1px solid rgba(164, 190, 231, 0.09);
    border-radius: 12px;
    background: rgba(4, 12, 25, 0.45);
  }

  .recordList > div > div {
    display: flex;
    justify-content: space-between;
    gap: 14px;
  }

  .recordList strong {
    overflow-wrap: anywhere;
  }

  .recordList span {
    color: #8193ac;
    font-size: .7rem;
    text-align: right;
  }

  .recordList p {
    margin: 8px 0;
    color: #9fafc5;
    font-size: .78rem;
    line-height: 1.55;
  }

  .recordList code {
    display: block;
    overflow-wrap: anywhere;
    color: #8fc0ef;
    font-size: .66rem;
  }

  .compactList p {
    margin-bottom: 0;
  }

  .emptyState {
    margin: 0;
    padding: 14px;
    border: 1px dashed rgba(164, 190, 231, 0.14);
    border-radius: 12px;
    color: #8798af;
    background: rgba(255,255,255,.02);
  }

  .rightsList {
    margin: 0;
    display: grid;
    gap: 10px;
  }

  .rightsList > div {
    padding: 13px;
    border: 1px solid rgba(164, 190, 231, 0.09);
    border-radius: 12px;
    background: rgba(4, 12, 25, 0.45);
  }

  .receiptPanel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    padding: 20px;
    border: 1px solid rgba(127, 228, 196, 0.16);
    border-radius: 16px;
    background: rgba(20, 79, 65, 0.12);
  }

  .receiptPanel dl {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    flex: 1;
  }

  .receiptPanel dl > div {
    min-width: 0;
  }

  .emptyReviewState {
    padding: 22px;
    border: 1px dashed rgba(164, 190, 231, 0.16);
    border-radius: 16px;
    background: rgba(255,255,255,.02);
  }

  .emptyReviewState strong {
    color: #dce8f6;
  }

  .emptyReviewState p {
    margin: 7px 0 0;
    color: #8fa0b8;
    line-height: 1.65;
  }

  .reviewTimeline {
    display: grid;
    gap: 12px;
  }

  .reviewTimeline article {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 14px;
    padding: 16px;
    border: 1px solid rgba(164, 190, 231, 0.11);
    border-radius: 14px;
    background: rgba(7, 17, 33, 0.4);
  }

  .reviewTimeline article > span {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: #171005;
    background: #ffd27f;
    font-size: .72rem;
    font-weight: 900;
  }

  .reviewTimeline small {
    color: #7fe4c4;
    font-size: .68rem;
    font-weight: 900;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .reviewTimeline h3 {
    margin: 5px 0 7px;
  }

  .reviewTimeline p {
    margin: 0;
    color: #9fafc5;
    line-height: 1.65;
  }

  .dangerAction {
    border-color: rgba(255, 124, 145, 0.55);
    background: linear-gradient(135deg, #ffd2d9, #d75b72);
  }

  .actionCard {
    padding: 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .stateCard {
    min-height: 330px;
    padding: 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
  }

  .errorCard {
    border-color: rgba(255, 124, 145, 0.28);
  }

  .pulseDot {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: #7fe4c4;
    box-shadow: 0 0 28px rgba(127, 228, 196, 0.9);
    animation: pulse 1.5s ease-in-out infinite;
  }

  .primaryButton,
  .secondaryButton {
    min-height: 46px;
    padding: 11px 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 13px;
    font: inherit;
    font-weight: 900;
    text-decoration: none;
    cursor: pointer;
  }

  .primaryButton {
    border: 1px solid rgba(255, 226, 167, 0.72);
    background: linear-gradient(135deg, #ffe4a6, #e8a33d);
    color: #171005;
  }

  .secondaryButton {
    border: 1px solid rgba(164, 190, 231, 0.3);
    background: rgba(15, 34, 63, 0.74);
    color: #eef4ff;
  }

  .textLink {
    color: #9ec8ff;
    font-weight: 800;
    text-decoration: none;
  }

  @keyframes starDrift {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(54px, 54px, 0); }
  }

  @keyframes rotateOrbit {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(0.85); opacity: 0.6; }
    50% { transform: scale(1.2); opacity: 1; }
  }

  @media (max-width: 1100px) {
    .lifecycleTimeline {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .readinessGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .hero,
    .detailGrid,
    .statementGrid,
    .evidenceWorkspace {
      grid-template-columns: 1fr;
    }

    .rightsGroup {
      grid-column: auto;
    }

    .readinessSummary,
    .receiptPanel {
      align-items: stretch;
      flex-direction: column;
    }

    .receiptPanel dl {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .actionCard {
      align-items: stretch;
      flex-direction: column;
    }
  }

  @media (max-width: 650px) {
    .pageShell {
      padding-inline: 16px;
    }

    .topBar,
    .stateCard {
      align-items: stretch;
      flex-direction: column;
    }

    .primaryButton,
    .secondaryButton {
      width: 100%;
    }

    .lifecycleTimeline,
    .readinessGrid,
    .receiptPanel dl {
      grid-template-columns: 1fr;
    }

    .recordList > div > div {
      flex-direction: column;
    }

    .recordList span {
      text-align: left;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .stars,
    .orbit,
    .pulseDot {
      animation: none;
    }
  }
`;
