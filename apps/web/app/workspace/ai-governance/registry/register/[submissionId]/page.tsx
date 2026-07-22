'use client';

import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

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

        setRecord(data as RegistrySubmission);
      } catch (caught) {
        if (cancelled) return;

        setError(
          caught instanceof Error
            ? caught.message
            : 'The Registry record could not be loaded.',
        );
      } finally {
        if (!cancelled) setLoading(false);
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
  const isRegistered =
    record?.status?.toLowerCase() === 'registered' &&
    Boolean(record.registry_identifier);

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
            </dl>
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

            {isRegistered ? (
              <Link
                href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
                  record.registry_identifier ?? '',
                )}`}
                className="primaryButton"
              >
                Open Permanent Record
              </Link>
            ) : isDraft ? (
              <Link
                href={`/workspace/ai-governance/registry/register?draft=${encodeURIComponent(
                  record.id,
                )}`}
                className="primaryButton"
              >
                Continue Draft
              </Link>
            ) : (
              <Link
                href="/workspace/ai-governance/registry/my-records"
                className="secondaryButton"
              >
                Return to My Records
              </Link>
            )}
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

  @media (max-width: 920px) {
    .hero,
    .detailGrid,
    .statementGrid {
      grid-template-columns: 1fr;
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
  }

  @media (prefers-reduced-motion: reduce) {
    .stars,
    .orbit,
    .pulseDot {
      animation: none;
    }
  }
`;
