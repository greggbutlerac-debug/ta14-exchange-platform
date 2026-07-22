'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type PublicRegistryRecord = {
  registry_identifier: string;
  governance_name: string;
  current_version: string | null;
  steward_name: string | null;
  establishment_date: string | null;
  registered_at: string | null;
  publication_date: string | null;
  plain_language_description: string | null;
  sha256_digest: string | null;
};

type ApiPayload = {
  record?: PublicRegistryRecord;
  registry_record?: PublicRegistryRecord;
  data?: PublicRegistryRecord;
  error?: string;
};

function formatDate(value: string | null) {
  if (!value) return 'date not recorded';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function buildCitation(record: PublicRegistryRecord) {
  const author = record.steward_name?.trim() || 'Registry steward not declared';
  const version = record.current_version?.trim()
    ? `Version ${record.current_version.trim()}. `
    : '';
  const date = formatDate(record.publication_date || record.registered_at);

  return `${author}. "${record.governance_name}." ${version}TA-14 AI Governance Registry, ${record.registry_identifier}, ${date}.`;
}

export default function RegistryCitationPage() {
  const params = useParams<{ registryIdentifier: string }>();
  const registryIdentifier = useMemo(
    () => decodeURIComponent(params.registryIdentifier ?? '').trim(),
    [params.registryIdentifier],
  );

  const [record, setRecord] = useState<PublicRegistryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<'citation' | 'identifier' | 'digest' | ''>(
    '',
  );

  useEffect(() => {
    let cancelled = false;

    async function loadRecord() {
      setLoading(true);
      setError('');
      setNotFound(false);

      try {
        const response = await fetch(
          `/api/registry/public/${encodeURIComponent(registryIdentifier)}`,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
            cache: 'no-store',
          },
        );

        const payload = (await response.json()) as ApiPayload;

        if (response.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(
            payload.error || 'The permanent Registry record is unavailable.',
          );
        }

        const result = payload.record || payload.registry_record || payload.data;

        if (!result) {
          throw new Error('The Registry response did not contain a public record.');
        }

        if (!cancelled) setRecord(result);
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : 'The permanent Registry record is unavailable.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (registryIdentifier) {
      void loadRecord();
    } else {
      setLoading(false);
      setNotFound(true);
    }

    return () => {
      cancelled = true;
    };
  }, [registryIdentifier]);

  const citation = record ? buildCitation(record) : '';

  async function copyText(
    value: string,
    type: 'citation' | 'identifier' | 'digest',
  ) {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(''), 1800);
  }

  function downloadJson() {
    if (!record) return;

    const exportPayload = {
      registry_identifier: record.registry_identifier,
      governance_name: record.governance_name,
      current_version: record.current_version,
      steward_name: record.steward_name,
      establishment_date: record.establishment_date,
      publication_date: record.publication_date,
      registered_at: record.registered_at,
      plain_language_description: record.plain_language_description,
      sha256_digest: record.sha256_digest,
      citation,
      boundary:
        'Registration is not certification and does not establish effectiveness, legality, safety, compliance, or operational fitness.',
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `${record.registry_identifier}-citation.json`;
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
          href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
            registryIdentifier,
          )}`}
          className="secondaryButton"
        >
          Back to Permanent Record
        </Link>

        <Link
          href="/workspace/ai-governance/registry/directory"
          className="textLink"
        >
          Public Directory
        </Link>
      </nav>

      {loading ? (
        <section className="stateCard">
          <span className="pulseDot" aria-hidden="true" />
          <div>
            <p className="eyebrow">PUBLIC REGISTRY CITATION</p>
            <h1>Preparing citation record.</h1>
            <p>Retrieving the permanent publication-safe Registry record.</p>
          </div>
        </section>
      ) : null}

      {!loading && notFound ? (
        <section className="stateCard">
          <div>
            <p className="eyebrow">RECORD NOT FOUND</p>
            <h1>No permanent Registry record was found.</h1>
            <p>
              Confirm the permanent Registry identifier or return to the public
              directory.
            </p>
          </div>

          <Link
            href="/workspace/ai-governance/registry/directory"
            className="primaryButton"
          >
            Open Public Directory
          </Link>
        </section>
      ) : null}

      {!loading && error ? (
        <section className="stateCard errorCard">
          <div>
            <p className="eyebrow">CITATION UNAVAILABLE</p>
            <h1>The citation record could not be prepared.</h1>
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
              <p className="eyebrow">PERMANENT PUBLIC REGISTRY RECORD</p>
              <p className="recordId">{record.registry_identifier}</p>
              <h1>Cite This Governance Record</h1>
              <p className="lead">
                Use the permanent identifier, preserved publication metadata,
                and finalized digest when referencing this Registry record.
              </p>
            </div>

            <aside className="identityPanel">
              <p className="eyebrow">GOVERNANCE RECORD</p>
              <strong>{record.governance_name}</strong>
              <p>
                {record.current_version
                  ? `Version ${record.current_version}`
                  : 'Version not declared'}
              </p>
            </aside>
          </section>

          <section className="boundaryCard">
            <p className="eyebrow">REGISTRY BOUNDARY</p>
            <h2>Registration is not certification.</h2>
            <p>
              A Registry citation confirms the existence and identity of a
              preserved public record. It does not certify effectiveness,
              legality, safety, compliance, or operational fitness.
            </p>
          </section>

          <section className="citationCard">
            <div className="sectionHeading">
              <p className="eyebrow">RECOMMENDED CITATION</p>
              <h2>Plain-text reference</h2>
            </div>

            <blockquote>{citation}</blockquote>

            <button
              type="button"
              className="primaryButton"
              onClick={() => void copyText(citation, 'citation')}
            >
              {copied === 'citation' ? 'Citation Copied' : 'Copy Citation'}
            </button>
          </section>

          <section className="detailGrid">
            <article>
              <p className="eyebrow">PERMANENT IDENTIFIER</p>
              <h2>{record.registry_identifier}</h2>
              <button
                type="button"
                className="secondaryButton"
                onClick={() =>
                  void copyText(record.registry_identifier, 'identifier')
                }
              >
                {copied === 'identifier' ? 'Identifier Copied' : 'Copy Identifier'}
              </button>
            </article>

            <article>
              <p className="eyebrow">FINALIZED SHA-256 DIGEST</p>
              <p className="digest">
                {record.sha256_digest || 'Digest not available'}
              </p>
              <button
                type="button"
                className="secondaryButton"
                disabled={!record.sha256_digest}
                onClick={() =>
                  record.sha256_digest
                    ? void copyText(record.sha256_digest, 'digest')
                    : undefined
                }
              >
                {copied === 'digest' ? 'Digest Copied' : 'Copy Digest'}
              </button>
            </article>
          </section>

          <section className="metadataCard">
            <div className="sectionHeading">
              <p className="eyebrow">PUBLICATION METADATA</p>
              <h2>Reference details</h2>
            </div>

            <dl>
              <div>
                <dt>Governance name</dt>
                <dd>{record.governance_name}</dd>
              </div>
              <div>
                <dt>Steward</dt>
                <dd>{record.steward_name || 'Not declared'}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>{record.current_version || 'Not declared'}</dd>
              </div>
              <div>
                <dt>Establishment date</dt>
                <dd>{formatDate(record.establishment_date)}</dd>
              </div>
              <div>
                <dt>Publication date</dt>
                <dd>
                  {formatDate(record.publication_date || record.registered_at)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="exportCard">
            <div>
              <p className="eyebrow">PORTABLE REFERENCE</p>
              <h2>Export the citation metadata.</h2>
              <p>
                Download a publication-safe JSON reference containing the
                permanent identifier, citation, digest, and Registry boundary.
              </p>
            </div>

            <button
              type="button"
              className="primaryButton"
              onClick={downloadJson}
            >
              Download Citation JSON
            </button>
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
    padding: 32px 24px 88px;
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
  .citationCard,
  .detailGrid,
  .metadataCard,
  .exportCard,
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
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
    gap: 24px;
  }

  .heroCopy,
  .identityPanel,
  .boundaryCard,
  .citationCard,
  .detailGrid article,
  .metadataCard,
  .exportCard,
  .stateCard {
    border: 1px solid rgba(164, 190, 231, 0.18);
    background: rgba(11, 25, 47, 0.86);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(18px);
  }

  .heroCopy,
  .identityPanel,
  .citationCard,
  .detailGrid article,
  .metadataCard,
  .exportCard,
  .stateCard {
    border-radius: 24px;
  }

  .heroCopy {
    padding: clamp(28px, 5vw, 52px);
  }

  .identityPanel {
    padding: 26px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .identityPanel strong {
    margin-bottom: 12px;
    font-size: 1.7rem;
  }

  h1,
  h2,
  p {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 18px;
    font-size: clamp(2.8rem, 6vw, 5.8rem);
    line-height: 0.95;
    letter-spacing: -0.055em;
  }

  h2 {
    margin-bottom: 12px;
    font-size: clamp(1.55rem, 3vw, 2.5rem);
    letter-spacing: -0.04em;
  }

  .eyebrow {
    margin-bottom: 10px;
    color: #7fe4c4;
    font-size: 0.76rem;
    font-weight: 900;
    letter-spacing: 0.18em;
  }

  .recordId,
  .digest {
    color: #ffd27f;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    overflow-wrap: anywhere;
  }

  .recordId {
    margin-bottom: 12px;
    font-size: 0.84rem;
    font-weight: 900;
  }

  .lead,
  .identityPanel p,
  .boundaryCard p,
  .exportCard p,
  .stateCard p {
    margin-bottom: 0;
    color: #aebdd4;
    line-height: 1.7;
  }

  .boundaryCard {
    margin-bottom: 18px;
    padding: 24px;
    border-left: 4px solid #ffd27f;
    border-radius: 18px;
  }

  .citationCard,
  .metadataCard,
  .exportCard {
    margin-bottom: 18px;
    padding: 28px;
  }

  blockquote {
    margin: 0 0 22px;
    padding: 22px;
    border-left: 4px solid #7fe4c4;
    border-radius: 0 14px 14px 0;
    background: rgba(7, 17, 33, 0.5);
    color: #eef4ff;
    font-size: clamp(1.1rem, 2.4vw, 1.45rem);
    line-height: 1.7;
  }

  .detailGrid {
    margin-bottom: 18px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  .detailGrid article {
    padding: 24px;
  }

  .digest {
    min-height: 54px;
    margin-bottom: 18px;
    line-height: 1.6;
  }

  dl {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  dl > div {
    min-width: 0;
    padding: 15px;
    border: 1px solid rgba(164, 190, 231, 0.1);
    border-radius: 13px;
    background: rgba(7, 17, 33, 0.38);
  }

  dt {
    margin-bottom: 6px;
    color: #8092ae;
    font-size: 0.68rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  .exportCard {
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

  .secondaryButton:disabled {
    cursor: not-allowed;
    opacity: 0.45;
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
    dl {
      grid-template-columns: 1fr;
    }

    .exportCard {
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
