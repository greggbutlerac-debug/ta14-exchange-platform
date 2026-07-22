import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type RegistrySubmission = {
  id: string;
  governance_name: string;
  short_name: string | null;
  claimant_name: string;
  organization_name: string | null;
  governance_category: string;
  current_version: string;
  status: string;
  submitted_at: string | null;
  updated_at: string | null;
  requested_review_pathway: string | null;
  record_visibility: string | null;
  registry_identifier: string | null;
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
          // Server Components can read the current authenticated session even
          // when response-cookie mutation is unavailable.
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

function formatDate(value: string | null): string {
  if (!value) {
    return 'Not recorded';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function statusLabel(status: string): string {
  switch (status) {
    case 'under_review':
      return 'Under Review';
    case 'submitted':
      return 'Submitted';
    case 'hold':
      return 'Hold';
    case 'escalated':
      return 'Escalated';
    default:
      return status.replaceAll('_', ' ');
  }
}

function statusClass(status: string): string {
  switch (status) {
    case 'under_review':
      return 'status statusReview';
    case 'hold':
      return 'status statusHold';
    case 'escalated':
      return 'status statusEscalated';
    default:
      return 'status statusSubmitted';
  }
}

export default async function RegistryReviewPage() {
  const cookieStore = await cookies();
  const supabase = createSupabaseClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      '/sign-in?next=/workspace/ai-governance/registry/review',
    );
  }

  const reviewerEmails = parseReviewerEmails();
  const reviewerEmail = user.email?.toLowerCase() ?? '';
  const isReviewer = reviewerEmails.has(reviewerEmail);

  if (!isReviewer) {
    return (
      <main className="pageShell">
        <section className="accessPanel">
          <p className="eyebrow">TA-14 AI GOVERNANCE REGISTRY</p>
          <h1>Registry Review Console</h1>
          <p className="lead">
            This workspace is restricted to authorized Registry reviewers.
          </p>
          <div className="boundaryBox">
            <strong>Access boundary</strong>
            <p>
              Signing in does not create reviewer authority. Reviewer access
              must be explicitly assigned by the TA-14 AI Governance Registry.
            </p>
          </div>
          <Link
            className="buttonSecondary"
            href="/workspace/ai-governance/registry"
          >
            Return to Registry
          </Link>
        </section>

        <style>{styles}</style>
      </main>
    );
  }

  const { data, error } = await supabase
    .from('ai_governance_registry_submissions')
    .select('*')
    .in('status', ['submitted', 'under_review', 'hold', 'escalated'])
    .order('submitted_at', { ascending: true });

  const submissions = (data ?? []) as RegistrySubmission[];

  const counts = submissions.reduce(
    (accumulator, submission) => {
      if (submission.status === 'submitted') accumulator.submitted += 1;
      if (submission.status === 'under_review') accumulator.underReview += 1;
      if (submission.status === 'hold') accumulator.hold += 1;
      if (submission.status === 'escalated') accumulator.escalated += 1;
      return accumulator;
    },
    { submitted: 0, underReview: 0, hold: 0, escalated: 0 },
  );

  return (
    <main className="pageShell">
      <section className="hero">
        <div>
          <p className="eyebrow">AUTHORIZED REVIEW WORKSPACE</p>
          <h1>TA-14 Registry Review Console</h1>
          <p className="lead">
            Inspect submitted governance records, verify their preserved
            evidence boundaries, and route each intake through a bounded
            Registry decision.
          </p>
        </div>

        <div className="reviewerCard">
          <span>Signed in reviewer</span>
          <strong>{user.email}</strong>
          <small>
            Reviewer access permits review activity. It does not authorize
            certification, endorsement, or claims beyond the Registry record.
          </small>
        </div>
      </section>

      <section className="metrics" aria-label="Registry review queue metrics">
        <article>
          <span>Awaiting Review</span>
          <strong>{counts.submitted}</strong>
        </article>
        <article>
          <span>Under Review</span>
          <strong>{counts.underReview}</strong>
        </article>
        <article>
          <span>On Hold</span>
          <strong>{counts.hold}</strong>
        </article>
        <article>
          <span>Escalated</span>
          <strong>{counts.escalated}</strong>
        </article>
      </section>

      <section className="boundaryBox">
        <strong>Registry decision boundary</strong>
        <p>
          Review determines whether the submitted identity, attribution,
          claims, non-claims, limitations, authority basis, and supporting
          record are sufficiently preserved for registration. It does not
          certify that the governance architecture works, is legally
          sufficient, or is suitable for any particular execution.
        </p>
      </section>

      <section className="queueSection">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">SUBMITTED RECORDS</p>
            <h2>Review Queue</h2>
          </div>
          <Link
            className="buttonSecondary"
            href="/workspace/ai-governance/registry"
          >
            Open Registry Institution
          </Link>
        </div>

        {error ? (
          <div className="errorBox">
            <strong>Unable to load the review queue.</strong>
            <p>{error.message}</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="emptyState">
            <strong>No Registry submissions are awaiting review.</strong>
            <p>
              New records will appear here after a registrant completes the
              intake, preserves evidence, accepts the declarations, and submits
              the record for review.
            </p>
          </div>
        ) : (
          <div className="queueList">
            {submissions.map((submission) => (
              <article className="submissionCard" key={submission.id}>
                <div className="cardTop">
                  <div>
                    <div className="titleLine">
                      <h3>{submission.governance_name}</h3>
                      <span className={statusClass(submission.status)}>
                        {statusLabel(submission.status)}
                      </span>
                    </div>
                    {submission.short_name ? (
                      <p className="shortName">{submission.short_name}</p>
                    ) : null}
                  </div>
                  <Link
                    className="buttonPrimary"
                    href={`/workspace/ai-governance/registry/review/${submission.id}`}
                  >
                    Open Review
                  </Link>
                </div>

                <dl className="recordGrid">
                  <div>
                    <dt>Claimant</dt>
                    <dd>{submission.claimant_name}</dd>
                  </div>
                  <div>
                    <dt>Organization</dt>
                    <dd>{submission.organization_name || 'Not declared'}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{submission.governance_category}</dd>
                  </div>
                  <div>
                    <dt>Version</dt>
                    <dd>{submission.current_version}</dd>
                  </div>
                  <div>
                    <dt>Review pathway</dt>
                    <dd>
                      {submission.requested_review_pathway || 'Standard review'}
                    </dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{formatDate(submission.submitted_at)}</dd>
                  </div>
                  <div>
                    <dt>Visibility request</dt>
                    <dd>{submission.record_visibility || 'Private'}</dd>
                  </div>
                  <div>
                    <dt>Registry identifier</dt>
                    <dd>
                      {submission.registry_identifier || 'Not yet assigned'}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>

      <style>{styles}</style>
    </main>
  );
}

const styles = `
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    background:
      radial-gradient(circle at 15% 15%, rgba(78, 124, 255, 0.16), transparent 34rem),
      radial-gradient(circle at 85% 10%, rgba(114, 255, 213, 0.10), transparent 30rem),
      #07101f;
    color: #eef4ff;
  }

  .pageShell {
    min-height: 100vh;
    padding: 48px 24px 80px;
  }

  .hero,
  .queueSection,
  .metrics,
  .boundaryBox,
  .accessPanel {
    width: min(1180px, 100%);
    margin-inline: auto;
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.8fr);
    gap: 28px;
    align-items: end;
    margin-bottom: 28px;
  }

  h1,
  h2,
  h3,
  p {
    margin-top: 0;
  }

  h1 {
    max-width: 820px;
    margin-bottom: 18px;
    font-size: clamp(2.5rem, 6vw, 5.6rem);
    line-height: 0.96;
    letter-spacing: -0.055em;
  }

  h2 {
    margin-bottom: 0;
    font-size: clamp(1.8rem, 3vw, 3rem);
    letter-spacing: -0.035em;
  }

  h3 {
    margin-bottom: 0;
    font-size: 1.35rem;
  }

  .eyebrow {
    margin-bottom: 12px;
    color: #7fe4c4;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.18em;
  }

  .lead {
    max-width: 760px;
    margin-bottom: 0;
    color: #b9c7df;
    font-size: 1.08rem;
    line-height: 1.75;
  }

  .reviewerCard,
  .boundaryBox,
  .submissionCard,
  .emptyState,
  .errorBox,
  .accessPanel {
    border: 1px solid rgba(164, 190, 231, 0.18);
    background: rgba(11, 25, 47, 0.82);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);
    backdrop-filter: blur(18px);
  }

  .reviewerCard {
    padding: 22px;
    border-radius: 22px;
  }

  .reviewerCard span,
  .reviewerCard small {
    display: block;
    color: #91a2be;
  }

  .reviewerCard strong {
    display: block;
    margin: 8px 0 16px;
    overflow-wrap: anywhere;
  }

  .reviewerCard small {
    line-height: 1.6;
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 18px;
  }

  .metrics article {
    padding: 20px;
    border: 1px solid rgba(164, 190, 231, 0.15);
    border-radius: 18px;
    background: rgba(13, 29, 54, 0.72);
  }

  .metrics span {
    display: block;
    color: #9cadc8;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .metrics strong {
    display: block;
    margin-top: 10px;
    font-size: 2rem;
  }

  .boundaryBox {
    margin-bottom: 34px;
    padding: 20px 22px;
    border-left: 4px solid #7fe4c4;
    border-radius: 16px;
  }

  .boundaryBox strong {
    display: block;
    margin-bottom: 7px;
  }

  .boundaryBox p {
    margin-bottom: 0;
    color: #b8c6dc;
    line-height: 1.65;
  }

  .queueSection {
    padding-top: 8px;
  }

  .sectionHeading,
  .cardTop,
  .titleLine {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
  }

  .sectionHeading {
    margin-bottom: 20px;
  }

  .queueList {
    display: grid;
    gap: 18px;
  }

  .submissionCard {
    padding: 24px;
    border-radius: 22px;
  }

  .shortName {
    margin: 8px 0 0;
    color: #91a2be;
  }

  .status {
    display: inline-flex;
    padding: 7px 10px;
    border: 1px solid transparent;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .statusSubmitted {
    border-color: rgba(108, 166, 255, 0.45);
    background: rgba(60, 116, 205, 0.17);
    color: #9ec8ff;
  }

  .statusReview {
    border-color: rgba(127, 228, 196, 0.45);
    background: rgba(53, 170, 135, 0.16);
    color: #9df0d5;
  }

  .statusHold {
    border-color: rgba(255, 202, 92, 0.45);
    background: rgba(173, 118, 20, 0.16);
    color: #ffd98c;
  }

  .statusEscalated {
    border-color: rgba(255, 124, 145, 0.45);
    background: rgba(173, 49, 76, 0.16);
    color: #ffadbb;
  }

  .recordGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
    margin: 24px 0 0;
  }

  .recordGrid div {
    min-width: 0;
  }

  .recordGrid dt {
    margin-bottom: 6px;
    color: #8092ae;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .recordGrid dd {
    margin: 0;
    color: #e6edfa;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .buttonPrimary,
  .buttonSecondary {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    padding: 11px 16px;
    border-radius: 12px;
    font-weight: 800;
    text-decoration: none;
    transition:
      transform 160ms ease,
      border-color 160ms ease,
      background 160ms ease;
  }

  .buttonPrimary {
    border: 1px solid #7fe4c4;
    background: #7fe4c4;
    color: #07101f;
  }

  .buttonSecondary {
    border: 1px solid rgba(164, 190, 231, 0.32);
    background: rgba(15, 34, 63, 0.7);
    color: #eaf1ff;
  }

  .buttonPrimary:hover,
  .buttonSecondary:hover {
    transform: translateY(-1px);
  }

  .emptyState,
  .errorBox {
    padding: 30px;
    border-radius: 20px;
  }

  .emptyState p,
  .errorBox p {
    margin: 8px 0 0;
    color: #aebdd3;
    line-height: 1.65;
  }

  .errorBox {
    border-color: rgba(255, 124, 145, 0.38);
  }

  .accessPanel {
    max-width: 760px;
    margin-top: 8vh;
    padding: 38px;
    border-radius: 26px;
  }

  .accessPanel .buttonSecondary {
    margin-top: 8px;
  }

  @media (max-width: 900px) {
    .hero {
      grid-template-columns: 1fr;
    }

    .metrics,
    .recordGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 620px) {
    .pageShell {
      padding-inline: 16px;
    }

    .metrics,
    .recordGrid {
      grid-template-columns: 1fr;
    }

    .sectionHeading,
    .cardTop,
    .titleLine {
      align-items: flex-start;
      flex-direction: column;
    }

    .buttonPrimary,
    .buttonSecondary {
      width: 100%;
    }
  }
`;
