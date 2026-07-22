import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import FinalizeRegistrationPanel from './FinalizeRegistrationPanel';

type PageProps = {
  params: Promise<{ submissionId: string }>;
};

type RegistrySubmission = Record<string, unknown> & {
  id: string;
  governance_name: string;
  short_name: string | null;
  governance_category: string;
  current_version: string;
  claimed_establishment_date: string | null;
  effective_version_date: string | null;
  claimant_name: string;
  claimant_type: string;
  submitter_authority_role: string;
  authority_basis: string;
  current_steward: string | null;
  organization_name: string | null;
  contact_email: string;
  public_contact_mode: string;
  public_website: string | null;
  geographic_scope: string | null;
  regulatory_scope: string | null;
  plain_language_description: string;
  formal_claims: string;
  explicit_non_claims: string;
  known_limitations: string | null;
  known_disputes: string | null;
  ownership_declaration: string;
  license_statement: string | null;
  requested_review_pathway: string | null;
  record_visibility: string | null;
  allow_review_requests: boolean;
  allow_collaboration_inquiries: boolean;
  allow_dispute_notices: boolean;
  authority_declaration_accepted: boolean;
  accuracy_declaration_accepted: boolean;
  registry_boundary_accepted: boolean;
  status: string;
  review_decision?: string | null;
  review_rationale?: string | null;
  reviewed_at?: string | null;
  reviewed_by_user_id?: string | null;
  submitted_at: string | null;
  intake_locked_at: string | null;
  accepted_at?: string | null;
  registry_identifier: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type EvidenceRecord = Record<string, unknown> & {
  id: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  sha256_hex: string;
  evidence_relationship: string;
  evidence_classification: string | null;
  description: string;
  visibility: string;
  evidence_state: string;
  source_date: string | null;
  source_url: string | null;
  submitted_at: string | null;
};

type ChildRecord = Record<string, unknown> & {
  id: string;
};

function createSupabaseClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Existing authenticated cookies remain readable in a Server Component.
        }
      },
    },
  });
}

function parseReviewerEmails(): Set<string> {
  return new Set(
    (process.env.TA14_REGISTRY_REVIEWER_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function text(value: unknown, fallback = 'Not declared'): string {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return String(value);
  return fallback;
}

function boolLabel(value: unknown): string {
  return value === true ? 'Accepted' : 'Not accepted';
}

function formatDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return 'Not recorded';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0 bytes';

  const units = ['bytes', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1,
  );
  const amount = value / 1024 ** index;

  return `${amount.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function statusLabel(status: string): string {
  return status
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayRecordValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return 'Not declared';
  }

  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.map(String).join(', ');
  if (typeof value === 'object') return JSON.stringify(value, null, 2);

  return String(value);
}

function RecordList({
  records,
  emptyMessage,
  fields,
}: {
  records: ChildRecord[];
  emptyMessage: string;
  fields: Array<{ key: string; label: string }>;
}) {
  if (records.length === 0) {
    return <p className="emptyLine">{emptyMessage}</p>;
  }

  return (
    <div className="recordStack">
      {records.map((record, index) => (
        <article className="sourceCard" key={record.id}>
          <p className="sourceNumber">Record {index + 1}</p>
          <dl className="detailGrid">
            {fields.map(({ key, label }) => (
              <div key={key}>
                <dt>{label}</dt>
                <dd className={key.includes('hash') ? 'hash' : undefined}>
                  {displayRecordValue(record[key])}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}

export default async function RegistrySubmissionReviewPage({
  params,
}: PageProps) {
  const { submissionId } = await params;
  const cookieStore = await cookies();
  const supabase = createSupabaseClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/sign-in?next=/workspace/ai-governance/registry/review/${submissionId}`,
    );
  }

  const reviewerEmail = user.email?.toLowerCase() ?? '';
  const isReviewer = parseReviewerEmails().has(reviewerEmail);

  if (!isReviewer) {
    redirect('/workspace/ai-governance/registry/review');
  }

  const [
    submissionResult,
    evidenceResult,
    publicationsResult,
    repositoriesResult,
    zenodoResult,
    patentsResult,
    eventsResult,
    disputesResult,
  ] = await Promise.all([
    supabase
      .from('ai_governance_registry_submissions')
      .select('*')
      .eq('id', submissionId)
      .single(),
    supabase
      .from('ai_governance_registry_evidence')
      .select('*')
      .eq('submission_id', submissionId)
      .order('submitted_at', { ascending: true }),
    supabase
      .from('ai_governance_registry_publications')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true }),
    supabase
      .from('ai_governance_registry_repositories')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true }),
    supabase
      .from('ai_governance_registry_zenodo_records')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true }),
    supabase
      .from('ai_governance_registry_patent_records')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true }),
    supabase
      .from('ai_governance_registry_events')
      .select('*')
      .eq('submission_id', submissionId)
      .order('occurred_at', { ascending: true }),
    supabase
      .from('ai_governance_registry_disputes')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true }),
  ]);

  if (submissionResult.error || !submissionResult.data) {
    notFound();
  }

  const childError = [
    evidenceResult.error,
    publicationsResult.error,
    repositoriesResult.error,
    zenodoResult.error,
    patentsResult.error,
    eventsResult.error,
    disputesResult.error,
  ].find(Boolean);

  const submission = submissionResult.data as RegistrySubmission;
  const evidence = (evidenceResult.data ?? []) as EvidenceRecord[];
  const publications = (publicationsResult.data ?? []) as ChildRecord[];
  const repositories = (repositoriesResult.data ?? []) as ChildRecord[];
  const zenodoRecords = (zenodoResult.data ?? []) as ChildRecord[];
  const patentRecords = (patentsResult.data ?? []) as ChildRecord[];
  const events = (eventsResult.data ?? []) as ChildRecord[];
  const disputes = (disputesResult.data ?? []) as ChildRecord[];

  return (
    <main className="pageShell">
      <nav className="topBar">
        <Link
          href="/workspace/ai-governance/registry/review"
          className="buttonSecondary"
        >
          Back to Review Queue
        </Link>
        <span className="reviewerIdentity">{user.email}</span>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">INDIVIDUAL REGISTRY REVIEW</p>
          <h1>{submission.governance_name}</h1>
          <p className="lead">
            Review the submitted identity, authority, claims, declared
            boundaries, preserved evidence, external source records, and
            lifecycle history before issuing a bounded Registry decision.
          </p>
        </div>

        <aside className="statusPanel">
          <span>Current status</span>
          <strong>{statusLabel(submission.status)}</strong>
          <dl>
            <div>
              <dt>Submitted</dt>
              <dd>{formatDate(submission.submitted_at)}</dd>
            </div>
            <div>
              <dt>Pathway</dt>
              <dd>{text(submission.requested_review_pathway, 'Standard review')}</dd>
            </div>
            <div>
              <dt>Identifier</dt>
              <dd>{text(submission.registry_identifier, 'Not assigned')}</dd>
            </div>
          </dl>
        </aside>
      </section>

      {childError ? (
        <section className="errorBox">
          <strong>Some supporting records could not be loaded.</strong>
          <p>{childError.message}</p>
        </section>
      ) : null}

      <section className="boundaryBox">
        <strong>Review boundary</strong>
        <p>
          This review determines whether the Registry record is sufficiently
          attributable, bounded, and preserved for registration. It does not
          certify performance, legality, safety, operational suitability, or
          fitness for execution.
        </p>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">IDENTITY AND SCOPE</p>
          <h2>Governance Record</h2>
        </div>

        <dl className="detailGrid">
          <div><dt>Governance name</dt><dd>{submission.governance_name}</dd></div>
          <div><dt>Short name</dt><dd>{text(submission.short_name)}</dd></div>
          <div><dt>Category</dt><dd>{submission.governance_category}</dd></div>
          <div><dt>Current version</dt><dd>{submission.current_version}</dd></div>
          <div><dt>Claimed establishment date</dt><dd>{text(submission.claimed_establishment_date)}</dd></div>
          <div><dt>Effective version date</dt><dd>{text(submission.effective_version_date)}</dd></div>
          <div><dt>Geographic scope</dt><dd>{text(submission.geographic_scope)}</dd></div>
          <div><dt>Regulatory scope</dt><dd>{text(submission.regulatory_scope)}</dd></div>
          <div className="spanFull">
            <dt>Plain-language description</dt>
            <dd className="longText">{submission.plain_language_description}</dd>
          </div>
        </dl>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">AUTHORITY AND ATTRIBUTION</p>
          <h2>Claimant Record</h2>
        </div>

        <dl className="detailGrid">
          <div><dt>Claimant</dt><dd>{submission.claimant_name}</dd></div>
          <div><dt>Claimant type</dt><dd>{submission.claimant_type}</dd></div>
          <div><dt>Authority role</dt><dd>{submission.submitter_authority_role}</dd></div>
          <div><dt>Current steward</dt><dd>{text(submission.current_steward)}</dd></div>
          <div><dt>Organization</dt><dd>{text(submission.organization_name)}</dd></div>
          <div><dt>Contact email</dt><dd>{submission.contact_email}</dd></div>
          <div><dt>Public contact mode</dt><dd>{submission.public_contact_mode}</dd></div>
          <div><dt>Public website</dt><dd>{text(submission.public_website)}</dd></div>
          <div className="spanFull">
            <dt>Authority basis</dt>
            <dd className="longText">{submission.authority_basis}</dd>
          </div>
          <div className="spanFull">
            <dt>Ownership declaration</dt>
            <dd className="longText">{submission.ownership_declaration}</dd>
          </div>
          <div className="spanFull">
            <dt>License statement</dt>
            <dd className="longText">{text(submission.license_statement)}</dd>
          </div>
        </dl>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">CLAIMS AND BOUNDARIES</p>
          <h2>Declared Governance Position</h2>
        </div>

        <div className="narrativeStack">
          <article><h3>Formal claims</h3><p>{submission.formal_claims}</p></article>
          <article><h3>Explicit non-claims</h3><p>{submission.explicit_non_claims}</p></article>
          <article><h3>Known limitations</h3><p>{text(submission.known_limitations)}</p></article>
          <article><h3>Known disputes</h3><p>{text(submission.known_disputes)}</p></article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">DECLARATIONS</p>
          <h2>Registrant Attestations</h2>
        </div>

        <dl className="detailGrid">
          <div><dt>Authority declaration</dt><dd>{boolLabel(submission.authority_declaration_accepted)}</dd></div>
          <div><dt>Accuracy declaration</dt><dd>{boolLabel(submission.accuracy_declaration_accepted)}</dd></div>
          <div><dt>Registry boundary</dt><dd>{boolLabel(submission.registry_boundary_accepted)}</dd></div>
          <div><dt>Visibility request</dt><dd>{text(submission.record_visibility)}</dd></div>
          <div><dt>Review requests</dt><dd>{submission.allow_review_requests ? 'Allowed' : 'Not allowed'}</dd></div>
          <div><dt>Collaboration inquiries</dt><dd>{submission.allow_collaboration_inquiries ? 'Allowed' : 'Not allowed'}</dd></div>
          <div><dt>Dispute notices</dt><dd>{submission.allow_dispute_notices ? 'Allowed' : 'Not allowed'}</dd></div>
          <div><dt>Intake locked</dt><dd>{formatDate(submission.intake_locked_at)}</dd></div>
        </dl>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">PRESERVED EVIDENCE</p>
          <h2>Evidence Files and Hashes</h2>
        </div>

        {evidence.length === 0 ? (
          <p className="emptyLine">No preserved evidence records were found.</p>
        ) : (
          <div className="recordStack">
            {evidence.map((record, index) => (
              <article className="sourceCard" key={record.id}>
                <p className="sourceNumber">Evidence {index + 1}</p>
                <dl className="detailGrid">
                  <div><dt>Filename</dt><dd>{record.original_filename}</dd></div>
                  <div><dt>Type</dt><dd>{record.mime_type}</dd></div>
                  <div><dt>Size</dt><dd>{formatBytes(record.size_bytes)}</dd></div>
                  <div><dt>Visibility</dt><dd>{record.visibility}</dd></div>
                  <div><dt>Relationship</dt><dd>{record.evidence_relationship}</dd></div>
                  <div><dt>Classification</dt><dd>{text(record.evidence_classification)}</dd></div>
                  <div><dt>Source date</dt><dd>{text(record.source_date)}</dd></div>
                  <div><dt>Source URL</dt><dd>{text(record.source_url)}</dd></div>
                  <div className="spanFull"><dt>Description</dt><dd className="longText">{record.description}</dd></div>
                  <div className="spanFull"><dt>SHA-256</dt><dd className="hash">{record.sha256_hex}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="sectionCard">
        <div className="sectionHeading"><p className="eyebrow">PUBLICATIONS</p><h2>Articles, Books, Papers, and Reports</h2></div>
        <RecordList
          records={publications}
          emptyMessage="No publication records were found."
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'publication_type', label: 'Type' },
            { key: 'publisher', label: 'Publisher' },
            { key: 'publication_date', label: 'Publication date' },
            { key: 'url', label: 'URL' },
          ]}
        />
      </section>

      <section className="sectionCard">
        <div className="sectionHeading"><p className="eyebrow">SOFTWARE RECORDS</p><h2>GitHub and Other Repositories</h2></div>
        <RecordList
          records={repositories}
          emptyMessage="No repository records were found."
          fields={[
            { key: 'repository_name', label: 'Repository' },
            { key: 'repository_url', label: 'URL' },
            { key: 'repository_provider', label: 'Provider' },
            { key: 'default_branch', label: 'Default branch' },
            { key: 'commit_reference', label: 'Commit reference' },
          ]}
        />
      </section>

      <section className="sectionCard">
        <div className="sectionHeading"><p className="eyebrow">ZENODO</p><h2>DOIs, Concept DOIs, and Versions</h2></div>
        <RecordList
          records={zenodoRecords}
          emptyMessage="No Zenodo records were found."
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'doi', label: 'DOI' },
            { key: 'concept_doi', label: 'Concept DOI' },
            { key: 'version', label: 'Version' },
            { key: 'record_url', label: 'Record URL' },
          ]}
        />
      </section>

      <section className="sectionCard">
        <div className="sectionHeading"><p className="eyebrow">PATENT RECORDS</p><h2>Applications, Lineage, Publications, and Grants</h2></div>
        <RecordList
          records={patentRecords}
          emptyMessage="No patent records were found."
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'jurisdiction', label: 'Jurisdiction' },
            { key: 'application_number', label: 'Application number' },
            { key: 'filing_date', label: 'Filing date' },
            { key: 'patent_status', label: 'Status' },
          ]}
        />
      </section>

      <section className="sectionCard">
        <div className="sectionHeading"><p className="eyebrow">DISPUTES</p><h2>Dispute and Challenge Record</h2></div>
        <RecordList
          records={disputes}
          emptyMessage="No dispute records were found."
          fields={[
            { key: 'dispute_type', label: 'Type' },
            { key: 'status', label: 'Status' },
            { key: 'summary', label: 'Summary' },
            { key: 'created_at', label: 'Opened' },
            { key: 'resolved_at', label: 'Resolved' },
          ]}
        />
      </section>

      <section className="sectionCard">
        <div className="sectionHeading"><p className="eyebrow">LIFECYCLE HISTORY</p><h2>Registry Events</h2></div>
        <RecordList
          records={events}
          emptyMessage="No Registry lifecycle events were found."
          fields={[
            { key: 'event_type', label: 'Event type' },
            { key: 'event_summary', label: 'Summary' },
            { key: 'actor_label', label: 'Actor' },
            { key: 'actor_role', label: 'Role' },
            { key: 'occurred_at', label: 'Occurred' },
            { key: 'event_hash', label: 'Event hash' },
          ]}
        />
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">REVIEW DETERMINATION</p>
          <h2>Latest Bounded Decision</h2>
        </div>

        <dl className="detailGrid">
          <div><dt>Decision</dt><dd>{text(submission.review_decision, 'No decision recorded')}</dd></div>
          <div><dt>Reviewed at</dt><dd>{formatDate(submission.reviewed_at)}</dd></div>
          <div><dt>Accepted at</dt><dd>{formatDate(submission.accepted_at)}</dd></div>
          <div className="spanFull">
            <dt>Reviewer rationale</dt>
            <dd className="longText">{text(submission.review_rationale, 'No rationale recorded')}</dd>
          </div>
        </dl>
      </section>

      <FinalizeRegistrationPanel
        submissionId={submission.id}
        status={submission.status}
        registryIdentifier={submission.registry_identifier}
      />

      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </main>
  );
}

const styles = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background:
      radial-gradient(circle at 12% 8%, rgba(81, 125, 255, 0.18), transparent 34rem),
      radial-gradient(circle at 88% 12%, rgba(108, 237, 196, 0.11), transparent 30rem),
      #07101f;
    color: #eef4ff;
  }
  .pageShell { min-height: 100vh; padding: 34px 24px 84px; }
  .topBar, .hero, .boundaryBox, .sectionCard, .errorBox {
    width: min(1180px, 100%);
    margin-inline: auto;
  }
  .topBar {
    display: flex; justify-content: space-between; align-items: center;
    gap: 18px; margin-bottom: 34px;
  }
  .reviewerIdentity { color: #91a2be; overflow-wrap: anywhere; }
  .hero {
    display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.75fr);
    gap: 26px; align-items: end; margin-bottom: 24px;
  }
  h1, h2, h3, p { margin-top: 0; }
  h1 {
    margin-bottom: 18px; font-size: clamp(2.45rem, 5.8vw, 5.4rem);
    line-height: 0.97; letter-spacing: -0.055em;
  }
  h2 {
    margin-bottom: 0; font-size: clamp(1.65rem, 3vw, 2.7rem);
    letter-spacing: -0.035em;
  }
  h3 {
    margin-bottom: 10px; font-size: 1rem; color: #7fe4c4;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .eyebrow {
    margin-bottom: 10px; color: #7fe4c4; font-size: 0.76rem;
    font-weight: 800; letter-spacing: 0.18em;
  }
  .lead {
    max-width: 790px; margin-bottom: 0; color: #b9c7df;
    font-size: 1.06rem; line-height: 1.75;
  }
  .statusPanel, .boundaryBox, .sectionCard, .errorBox {
    border: 1px solid rgba(164, 190, 231, 0.18);
    background: rgba(11, 25, 47, 0.84);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);
    backdrop-filter: blur(18px);
  }
  .statusPanel { padding: 22px; border-radius: 22px; }
  .statusPanel > span {
    color: #91a2be; font-size: 0.78rem;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .statusPanel > strong {
    display: block; margin: 8px 0 18px; font-size: 1.55rem;
  }
  .statusPanel dl, .detailGrid { margin: 0; }
  .statusPanel dl { display: grid; gap: 12px; }
  .statusPanel dl div {
    padding-top: 12px; border-top: 1px solid rgba(164, 190, 231, 0.12);
  }
  dt {
    margin-bottom: 6px; color: #8092ae; font-size: 0.73rem;
    font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
  }
  dd { margin: 0; line-height: 1.55; overflow-wrap: anywhere; }
  .boundaryBox, .errorBox {
    margin-bottom: 22px; padding: 20px 22px;
    border-left: 4px solid #7fe4c4; border-radius: 16px;
  }
  .boundaryBox strong, .errorBox strong {
    display: block; margin-bottom: 7px;
  }
  .boundaryBox p, .errorBox p {
    margin-bottom: 0; color: #b8c6dc; line-height: 1.65;
  }
  .errorBox { border-left-color: #ff7c91; }
  .sectionCard {
    margin-bottom: 18px; padding: 26px; border-radius: 22px;
  }
  .sectionHeading { margin-bottom: 22px; }
  .detailGrid {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 19px;
  }
  .detailGrid > div {
    min-width: 0; padding: 15px;
    border: 1px solid rgba(164, 190, 231, 0.11);
    border-radius: 14px; background: rgba(7, 17, 33, 0.38);
  }
  .detailGrid .spanFull { grid-column: 1 / -1; }
  .longText { white-space: pre-wrap; line-height: 1.7; }
  .hash {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.82rem; word-break: break-all;
  }
  .narrativeStack, .recordStack { display: grid; gap: 14px; }
  .narrativeStack article, .sourceCard {
    padding: 20px; border: 1px solid rgba(164, 190, 231, 0.12);
    border-radius: 16px; background: rgba(7, 17, 33, 0.42);
  }
  .narrativeStack p {
    margin-bottom: 0; color: #d5deec; white-space: pre-wrap; line-height: 1.75;
  }
  .sourceNumber {
    margin-bottom: 15px; color: #9ec8ff; font-size: 0.75rem;
    font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .emptyLine { margin-bottom: 0; color: #9cadc8; line-height: 1.65; }
  .buttonSecondary {
    display: inline-flex; min-height: 44px; align-items: center;
    justify-content: center; padding: 11px 16px;
    border: 1px solid rgba(164, 190, 231, 0.32);
    border-radius: 12px; background: rgba(15, 34, 63, 0.7);
    color: #eaf1ff; font-weight: 800; text-decoration: none;
  }
  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; }
    .detailGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 620px) {
    .pageShell { padding-inline: 16px; }
    .topBar { align-items: flex-start; flex-direction: column; }
    .detailGrid { grid-template-columns: 1fr; }
    .detailGrid .spanFull { grid-column: auto; }
    .buttonSecondary { width: 100%; }
  }
`;
