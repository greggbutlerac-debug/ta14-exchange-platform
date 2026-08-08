'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

type PublicRegistryRecord = {
  id: string;
  registryIdentifier: string;
  governanceName: string;
  shortName: string | null;
  version: string | null;
  category: string | null;
  steward: string | null;
  claimedEstablishmentDate: string | null;
  registeredAt: string;
  status: string;
  summary: string | null;
  formalClaims: string | null;
  explicitNonClaims: string | null;
  knownLimitations: string | null;
  domains: string[];
  regulatoryScope: string | null;
  evidenceCount: number;
  disputeCount: number;
  supersedesRegistryIdentifier: string | null;
  recordDigestSha256: string | null;
  publicProjectionDigestSha256: string | null;
  publicProjectionDigestVersion: string | null;
  publishedAt: string | null;
  boundary: string;
};

type PublicVersionSeries = {
  seriesIdentifier: string;
  governanceName: string;
  shortName: string | null;
  category: string | null;
  steward: string | null;
  status: string;
  seriesSummary: string | null;
  boundaryStatement: string;
  memberCount: number;
  currentMemberOrdinal: number;
};

type PublicVersionSeriesMember = {
  seriesIdentifier: string;
  registryIdentifier: string;
  governanceName: string;
  version: string | null;
  registryStatus: string;
  registeredAt: string;
  ordinal: number;
  relationshipType: string;
  previousRegistryIdentifier: string | null;
  lineageNote: string | null;
  findingsInherited: boolean;
  evidenceInherited: boolean;
};

type ApiSuccess = {
  record: PublicRegistryRecord;
  versionSeries: PublicVersionSeries | null;
  versionSeriesMembers: PublicVersionSeriesMember[];
  generatedAt: string;
};

type ApiFailure = {
  error?: string;
  message?: string;
  detail?: unknown;
};

function formatDate(value: string | null) {
  if (!value) return 'Not recorded';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

function display(value: string | null, fallback = 'Not declared') {
  return value?.trim() || fallback;
}

export default function PermanentPublicRegistryRecordPage() {
  const params = useParams<{ registryIdentifier: string }>();
  const registryIdentifier = useMemo(
    () => decodeURIComponent(params.registryIdentifier ?? '').trim().toUpperCase(),
    [params.registryIdentifier],
  );

  const [record, setRecord] = useState<PublicRegistryRecord | null>(null);
  const [versionSeries, setVersionSeries] = useState<PublicVersionSeries | null>(null);
  const [versionSeriesMembers, setVersionSeriesMembers] = useState<PublicVersionSeriesMember[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRecord() {
      setLoading(true);
      setError('');
      setNotFound(false);
      setVersionSeries(null);
      setVersionSeriesMembers([]);

      try {
        const response = await fetch(
          `/api/registry/public/${encodeURIComponent(registryIdentifier)}`,
          {
            method: 'GET',
            cache: 'no-store',
            headers: {
              Accept: 'application/json',
            },
          },
        );

        const payload = (await response.json()) as ApiSuccess | ApiFailure;

        if (cancelled) return;

        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true);
          } else {
            const failure = payload as ApiFailure;
            setError(
              failure.message ||
                'The permanent Registry record could not be opened.',
            );
          }

          return;
        }

        const success = payload as ApiSuccess;
        setRecord(success.record);
        setVersionSeries(success.versionSeries ?? null);
        setVersionSeriesMembers(
          Array.isArray(success.versionSeriesMembers)
            ? success.versionSeriesMembers
            : [],
        );
        setGeneratedAt(success.generatedAt);
      } catch (caught) {
        if (cancelled) return;

        setError(
          caught instanceof Error
            ? caught.message
            : 'The permanent Registry record service is unavailable.',
        );
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

  return (
    <main className="pageShell">
      <div className="stars starsOne" aria-hidden="true" />
      <div className="stars starsTwo" aria-hidden="true" />
      <div className="orbit orbitOne" aria-hidden="true" />
      <div className="orbit orbitTwo" aria-hidden="true" />

      <nav className="topBar">
        <Link
          href="/workspace/ai-governance/registry/directory"
          className="secondaryButton"
        >
          Back to Public Directory
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
            <p className="eyebrow">PERMANENT REGISTRY RECORD</p>
            <h1>Opening {registryIdentifier}</h1>
            <p>
              Retrieving the publication-safe record from the TA-14 AI
              Governance Registry.
            </p>
          </div>
        </section>
      ) : null}

      {!loading && notFound ? (
        <section className="stateCard">
          <div>
            <p className="eyebrow">PUBLIC RECORD NOT FOUND</p>
            <h1>{registryIdentifier}</h1>
            <p>
              No published public Registry record is available for this
              identifier. The record may be private, controlled, unpublished,
              withdrawn, or nonexistent.
            </p>
          </div>

          <Link
            href="/workspace/ai-governance/registry/directory"
            className="primaryButton"
          >
            Search the Public Directory
          </Link>
        </section>
      ) : null}

      {!loading && error ? (
        <section className="stateCard errorCard">
          <div>
            <p className="eyebrow">REGISTRY RECORD UNAVAILABLE</p>
            <h1>The permanent record could not be opened.</h1>
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
              <p className="identifier">{record.registryIdentifier}</p>
              <h1>{record.governanceName}</h1>
              <p className="lead">
                {display(
                  record.summary,
                  'No public summary was provided for this Registry record.',
                )}
              </p>

              <div className="heroBadges">
                <span>{record.status}</span>
                {record.category ? <span>{record.category}</span> : null}
                {record.version ? <span>Version {record.version}</span> : null}
              </div>

              <div className="heroActions">
                <Link
                  href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
                    record.registryIdentifier,
                  )}/citation`}
                  className="primaryButton"
                >
                  Cite This Record
                </Link>

                <Link
                  href="/workspace/ai-governance/registry/directory"
                  className="secondaryButton"
                >
                  Browse Public Directory
                </Link>
              </div>
            </div>

            <aside className="recordSeal">
              <span className="sealRing" aria-hidden="true">
                TA-14
              </span>
              <strong>Registered</strong>
              <p>Publication-safe permanent record</p>
            </aside>
          </section>

          <section className="boundaryCard">
            <div>
              <p className="eyebrow">REGISTRY BOUNDARY</p>
              <h2>{record.boundary}</h2>
              <p>
                This record establishes a dated, attributable, searchable
                registration of the governance architecture and its declared
                public information. It does not certify effectiveness,
                legality, safety, compliance, operational suitability, or
                fitness for execution.
              </p>
            </div>
          </section>

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">CORE RECORD</p>
              <h2>Registered Identity</h2>
            </div>

            <dl className="detailGrid">
              <div>
                <dt>Registry identifier</dt>
                <dd className="mono">{record.registryIdentifier}</dd>
              </div>
              <div>
                <dt>Governance name</dt>
                <dd>{record.governanceName}</dd>
              </div>
              <div>
                <dt>Short name</dt>
                <dd>{display(record.shortName)}</dd>
              </div>
              <div>
                <dt>Current version</dt>
                <dd>{display(record.version)}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{display(record.category)}</dd>
              </div>
              <div>
                <dt>Steward</dt>
                <dd>{display(record.steward)}</dd>
              </div>
              <div>
                <dt>Claimed establishment date</dt>
                <dd>{display(record.claimedEstablishmentDate, 'Not recorded')}</dd>
              </div>
              <div>
                <dt>Registered at</dt>
                <dd>{formatDate(record.registeredAt)}</dd>
              </div>
              <div>
                <dt>Published at</dt>
                <dd>{formatDate(record.publishedAt)}</dd>
              </div>
            </dl>
          </section>

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">REGISTERED CLAIM BOUNDARY</p>
              <h2>Claims, Non-Claims, and Limitations</h2>
            </div>

            <dl className="detailGrid">
              <div>
                <dt>Registered claims</dt>
                <dd>{display(record.formalClaims)}</dd>
              </div>
              <div>
                <dt>Explicit non-claims</dt>
                <dd>{display(record.explicitNonClaims)}</dd>
              </div>
              <div>
                <dt>Known limitations</dt>
                <dd>{display(record.knownLimitations)}</dd>
              </div>
            </dl>
          </section>

          <section className="metricsGrid">
            <article className="metricCard">
              <span>Evidence records</span>
              <strong>{record.evidenceCount}</strong>
              <p>
                Preserved evidence records associated with the registered
                architecture at finalization.
              </p>
              {record.evidenceCount > 0 ? (
                <Link
                  href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
                    record.registryIdentifier,
                  )}/evidence`}
                  className="metricEvidenceLink"
                >
                  Open Evidence Records →
                </Link>
              ) : null}
            </article>

            <article className="metricCard">
              <span>Active disputes</span>
              <strong>{record.disputeCount}</strong>
              <p>
                Dispute records not dismissed or withdrawn at the time of
                finalization.
              </p>
            </article>

            <article className="metricCard">
              <span>Domains</span>
              <strong>{record.domains.length}</strong>
              <p>
                Publicly declared enumerable geographic or governance scope
                markers. Regulatory/framework scope is shown separately.
              </p>
            </article>
          </section>

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">DECLARED DOMAINS</p>
              <h2>Scope Markers</h2>
            </div>

            {record.domains.length > 0 ? (
              <div className="tagRow">
                {record.domains.map((domain) => (
                  <span key={domain}>{domain}</span>
                ))}
              </div>
            ) : (
              <p className="emptyLine">
                No public domain markers were declared for this record.
              </p>
            )}
          </section>

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">REGULATORY / FRAMEWORK SCOPE</p>
              <h2>Declared Regulatory Context</h2>
            </div>

            {record.regulatoryScope ? (
              <p className="scopeDeclaration">{record.regulatoryScope}</p>
            ) : (
              <p className="emptyLine">
                No separate regulatory or framework scope declaration is
                recorded for this public record.
              </p>
            )}
          </section>

          {versionSeries ? (
            <section className="sectionCard versionSeriesCard">
              <div className="sectionHeading">
                <p className="eyebrow">GOVERNED VERSION LINEAGE</p>
                <h2>{versionSeries.seriesIdentifier}</h2>
              </div>

              <div className="seriesSummaryGrid">
                <div>
                  <span>Governance</span>
                  <strong>{versionSeries.governanceName}</strong>
                </div>
                <div>
                  <span>Series status</span>
                  <strong>{versionSeries.status}</strong>
                </div>
                <div>
                  <span>Registered versions</span>
                  <strong>{versionSeries.memberCount}</strong>
                </div>
                <div>
                  <span>This record</span>
                  <strong>
                    Version position {versionSeries.currentMemberOrdinal} of{' '}
                    {versionSeries.memberCount}
                  </strong>
                </div>
              </div>

              {versionSeries.seriesSummary ? (
                <p className="seriesSummary">{versionSeries.seriesSummary}</p>
              ) : null}

              <div className="seriesBoundary">
                <strong>Lineage boundary</strong>
                <p>{versionSeries.boundaryStatement}</p>
              </div>

              <div className="versionTimeline" aria-label="Governed version lineage">
                {versionSeriesMembers.map((member) => {
                  const isCurrent =
                    member.registryIdentifier === record.registryIdentifier;

                  return (
                    <article
                      key={member.registryIdentifier}
                      className={`versionNode${isCurrent ? ' currentVersionNode' : ''}`}
                    >
                      <div className="versionNodeHeader">
                        <div>
                          <span className="versionOrdinal">
                            {String(member.ordinal).padStart(2, '0')}
                          </span>
                          <p className="versionIdentity">
                            {member.version ? `Version ${member.version}` : 'Version not declared'}
                          </p>
                        </div>
                        <span className="versionStatus">
                          {isCurrent ? 'CURRENT RECORD' : member.registryStatus}
                        </span>
                      </div>

                      <Link
                        href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
                          member.registryIdentifier,
                        )}`}
                        className="versionRegistryLink"
                      >
                        {member.registryIdentifier}
                      </Link>

                      <p className="relationshipType">
                        Relationship: {member.relationshipType.replaceAll('_', ' ')}
                      </p>

                      {member.lineageNote ? (
                        <p className="lineageNote">{member.lineageNote}</p>
                      ) : null}

                      <div className="inheritanceGrid">
                        <div>
                          <span>Prior findings inherited</span>
                          <strong>{member.findingsInherited ? 'Yes' : 'No'}</strong>
                        </div>
                        <div>
                          <span>Prior evidence inherited</span>
                          <strong>{member.evidenceInherited ? 'Yes' : 'No'}</strong>
                        </div>
                      </div>

                      {member.previousRegistryIdentifier ? (
                        <p className="previousVersion">
                          Continues from{' '}
                          <Link
                            href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
                              member.previousRegistryIdentifier,
                            )}`}
                          >
                            {member.previousRegistryIdentifier}
                          </Link>
                        </p>
                      ) : (
                        <p className="previousVersion">Series baseline record.</p>
                      )}
                    </article>
                  );
                })}
              </div>

              <p className="seriesNote">
                Version-series membership preserves attributable architectural
                continuity without carrying a prior version&apos;s evidence,
                finding, PASS, or review conclusion into a later registered
                version unless a governed record expressly establishes that
                relationship.
              </p>
            </section>
          ) : null}

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">LINEAGE</p>
              <h2>Supersession Record</h2>
            </div>

            {record.supersedesRegistryIdentifier ? (
              <div className="lineageBox">
                <p>This registration supersedes:</p>
                <Link
                  href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
                    record.supersedesRegistryIdentifier,
                  )}`}
                  className="lineageLink"
                >
                  {record.supersedesRegistryIdentifier}
                </Link>
              </div>
            ) : (
              <p className="emptyLine">
                No superseded Registry identifier is declared in this public
                record.
              </p>
            )}
          </section>

          <section className="sectionCard">
            <div className="sectionHeading">
              <p className="eyebrow">INTEGRITY DIGEST</p>
              <h2>Finalized Record SHA-256</h2>
            </div>

            {record.recordDigestSha256 ? (
              <code className="digest">{record.recordDigestSha256}</code>
            ) : (
              <p className="emptyLine">
                No public finalized-record digest is available.
              </p>
            )}

            <p className="digestNote">
              This finalized-record digest is preserved as the Registry's
              original integrity reference. It is not a certification mark.
            </p>

            <div className="projectionDigestBlock">
              <h3>Recomputable Public Projection</h3>
              {record.publicProjectionDigestSha256 ? (
                <code className="digest">
                  {record.publicProjectionDigestSha256}
                </code>
              ) : (
                <p className="emptyLine">
                  No recomputable public-projection digest is available.
                </p>
              )}
              <p className="digestNote">
                Canonicalization: {display(record.publicProjectionDigestVersion)}.
                The public-projection digest is computed from the published
                Registry fields using the named canonicalization version so an
                independent reader can reproduce the same projection input.
              </p>
            </div>
          </section>

          <footer className="recordFooter">
            <div>
              <p className="eyebrow">PUBLIC RECORD RESPONSE</p>
              <p>
                Retrieved at {formatDate(generatedAt)} from the TA-14 AI
                Governance Registry public-record service.
              </p>
            </div>

            <Link
              href="/workspace/ai-governance/registry/directory"
              className="secondaryButton"
            >
              Browse More Records
            </Link>
          </footer>
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
      radial-gradient(circle at 12% 10%, rgba(74, 122, 255, 0.18), transparent 31rem),
      radial-gradient(circle at 88% 14%, rgba(103, 231, 195, 0.12), transparent 29rem),
      radial-gradient(circle at 52% 92%, rgba(255, 184, 82, 0.08), transparent 30rem),
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
    opacity: 0.45;
    background-image:
      radial-gradient(circle, rgba(255,255,255,.8) 0 1px, transparent 1.3px);
    background-size: 52px 52px;
    animation: starDrift 26s linear infinite;
  }

  .starsTwo {
    opacity: 0.2;
    background-size: 83px 83px;
    animation-duration: 44s;
    animation-direction: reverse;
  }

  .orbit {
    position: fixed;
    width: 420px;
    height: 420px;
    border: 1px solid rgba(127, 228, 196, 0.12);
    border-radius: 50%;
    pointer-events: none;
    animation: rotateOrbit 34s linear infinite;
  }

  .orbit::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    top: 22px;
    left: 204px;
    border-radius: 50%;
    background: rgba(127, 228, 196, 0.8);
    box-shadow: 0 0 22px rgba(127, 228, 196, 0.9);
  }

  .orbitOne {
    top: 6%;
    right: -190px;
  }

  .orbitTwo {
    left: -220px;
    bottom: 4%;
    width: 520px;
    height: 520px;
    animation-duration: 48s;
    animation-direction: reverse;
  }

  .topBar,
  .hero,
  .boundaryCard,
  .sectionCard,
  .metricsGrid,
  .recordFooter,
  .stateCard {
    width: min(1180px, 100%);
    margin-inline: auto;
  }

  .topBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    margin-bottom: 36px;
  }

  .secondaryButton,
  .primaryButton {
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

  .secondaryButton {
    border: 1px solid rgba(164, 190, 231, 0.3);
    background: rgba(15, 34, 63, 0.74);
    color: #eef4ff;
  }

  .primaryButton {
    border: 1px solid rgba(255, 226, 167, 0.7);
    background: linear-gradient(135deg, #ffe4a6, #e8a33d);
    color: #171005;
  }

  .textLink {
    color: #9ec8ff;
    font-weight: 800;
    text-decoration: none;
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(250px, 0.5fr);
    gap: 30px;
    align-items: center;
    margin-bottom: 24px;
  }

  .heroCopy,
  .recordSeal,
  .boundaryCard,
  .sectionCard,
  .metricCard,
  .recordFooter,
  .stateCard {
    border: 1px solid rgba(164, 190, 231, 0.18);
    background: rgba(11, 25, 47, 0.86);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(18px);
  }

  .heroCopy {
    padding: clamp(26px, 5vw, 54px);
    border-radius: 26px;
  }

  .eyebrow {
    margin: 0 0 10px;
    color: #7fe4c4;
    font-size: 0.76rem;
    font-weight: 900;
    letter-spacing: 0.18em;
  }

  .identifier {
    margin: 0 0 14px;
    color: #ffd27f;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 900;
    letter-spacing: 0.04em;
  }

  h1,
  h2,
  p {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 18px;
    font-size: clamp(2.6rem, 6vw, 5.8rem);
    line-height: 0.96;
    letter-spacing: -0.055em;
  }

  h2 {
    margin-bottom: 12px;
    font-size: clamp(1.7rem, 3.5vw, 3rem);
    letter-spacing: -0.04em;
  }

  .lead {
    margin-bottom: 22px;
    color: #b9c7df;
    font-size: 1.06rem;
    line-height: 1.75;
  }

  .heroBadges,
  .tagRow {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .heroActions {
    margin-top: 22px;
    display: flex;
    flex-wrap: wrap;
    gap: 11px;
  }

  .heroBadges span,
  .tagRow span {
    padding: 8px 11px;
    border: 1px solid rgba(127, 228, 196, 0.2);
    border-radius: 999px;
    background: rgba(31, 71, 91, 0.42);
    color: #c8f6e7;
    font-size: 0.8rem;
    font-weight: 800;
  }

  .recordSeal {
    min-height: 300px;
    padding: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 26px;
    text-align: center;
  }

  .sealRing {
    width: 134px;
    height: 134px;
    margin-bottom: 20px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 210, 127, 0.5);
    border-radius: 50%;
    color: #ffd27f;
    font-size: 1.5rem;
    font-weight: 1000;
    letter-spacing: 0.08em;
    box-shadow:
      inset 0 0 0 11px rgba(255, 210, 127, 0.04),
      0 0 45px rgba(255, 185, 82, 0.14);
  }

  .recordSeal strong {
    font-size: 1.35rem;
  }

  .recordSeal p {
    margin: 8px 0 0;
    color: #91a2be;
    line-height: 1.55;
  }

  .boundaryCard {
    margin-bottom: 22px;
    padding: 26px;
    border-left: 4px solid #ffd27f;
    border-radius: 18px;
  }

  .boundaryCard p {
    margin-bottom: 0;
    color: #b8c6dc;
    line-height: 1.72;
  }

  .sectionCard {
    margin-bottom: 18px;
    padding: 28px;
    border-radius: 22px;
  }

  .sectionHeading {
    margin-bottom: 22px;
  }

  .detailGrid {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .detailGrid > div {
    min-width: 0;
    padding: 16px;
    border: 1px solid rgba(164, 190, 231, 0.11);
    border-radius: 14px;
    background: rgba(7, 17, 33, 0.4);
  }

  dt {
    margin-bottom: 7px;
    color: #8092ae;
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    line-height: 1.58;
    overflow-wrap: anywhere;
  }

  .mono,
  .digest {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .metricsGrid {
    margin-bottom: 18px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .metricCard {
    padding: 24px;
    border-radius: 20px;
  }

  .metricCard span {
    color: #91a2be;
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .metricCard strong {
    display: block;
    margin: 10px 0;
    font-size: 2.5rem;
  }

  .metricEvidenceLink {
    display: inline-flex;
    margin-top: 16px;
    color: #ffd27f;
    font-size: 0.82rem;
    font-weight: 900;
    text-decoration: none;
  }

  .metricEvidenceLink:hover {
    color: #fff0c7;
    text-decoration: underline;
  }

  .metricCard p,
  .emptyLine,
  .digestNote,
  .recordFooter p {
    margin-bottom: 0;
    color: #9cadc8;
    line-height: 1.65;
  }

  .lineageBox {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .lineageBox p {
    margin: 0;
    color: #9cadc8;
  }

  .lineageLink {
    color: #9ec8ff;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 900;
  }

  .digest {
    display: block;
    padding: 18px;
    border: 1px solid rgba(127, 228, 196, 0.18);
    border-radius: 14px;
    background: rgba(7, 17, 33, 0.55);
    color: #c8f6e7;
    line-height: 1.65;
    word-break: break-all;
  }

  .projectionDigestBlock {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid rgba(127, 228, 196, 0.14);
  }

  .projectionDigestBlock h3 {
    margin: 0 0 12px;
    font-size: 15px;
  }

  .scopeDeclaration {
    margin: 0;
    white-space: pre-wrap;
    line-height: 1.75;
  }

  .digestNote {
    margin-top: 13px;
  }

  .recordFooter {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 22px;
    border-radius: 20px;
  }

  .stateCard {
    min-height: 360px;
    padding: 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    border-radius: 24px;
  }

  .stateCard h1 {
    font-size: clamp(2rem, 5vw, 4.8rem);
  }

  .stateCard p {
    margin-bottom: 0;
    color: #b8c6dc;
    line-height: 1.7;
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

  @keyframes starDrift {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(52px, 52px, 0); }
  }

  @keyframes rotateOrbit {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(0.85); opacity: 0.6; }
    50% { transform: scale(1.2); opacity: 1; }
  }

  @media (max-width: 900px) {
    .hero,
    .detailGrid,
    .metricsGrid {
      grid-template-columns: 1fr;
    }

    .recordSeal {
      min-height: 240px;
    }
  }

  @media (max-width: 650px) {
    .pageShell {
      padding-inline: 16px;
    }

    .topBar,
    .recordFooter,
    .stateCard {
      align-items: stretch;
      flex-direction: column;
    }

    .secondaryButton,
    .primaryButton {
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

  .versionSeriesCard {
    border-color: rgba(127, 228, 196, 0.26);
    background:
      linear-gradient(135deg, rgba(13, 36, 55, 0.94), rgba(9, 24, 43, 0.94));
  }

  .seriesSummaryGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin: 24px 0;
  }

  .seriesSummaryGrid > div,
  .inheritanceGrid > div {
    border: 1px solid rgba(164, 190, 231, 0.18);
    border-radius: 14px;
    background: rgba(6, 19, 35, 0.68);
    padding: 16px;
  }

  .seriesSummaryGrid span,
  .inheritanceGrid span {
    display: block;
    color: #94a9c8;
    font-size: 0.76rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 7px;
  }

  .seriesSummaryGrid strong,
  .inheritanceGrid strong {
    color: #f4f8ff;
  }

  .seriesSummary {
    color: #c8d8ef;
    line-height: 1.75;
    margin: 0 0 20px;
  }

  .seriesBoundary {
    border-left: 3px solid rgba(127, 228, 196, 0.75);
    padding: 4px 0 4px 18px;
    margin: 20px 0 28px;
  }

  .seriesBoundary strong {
    color: #9cf0d7;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .seriesBoundary p {
    margin: 8px 0 0;
    color: #dbe7f8;
    line-height: 1.7;
  }

  .versionTimeline {
    position: relative;
    display: grid;
    gap: 16px;
  }

  .versionNode {
    position: relative;
    border: 1px solid rgba(164, 190, 231, 0.2);
    border-radius: 18px;
    padding: 20px;
    background: rgba(7, 20, 38, 0.82);
  }

  .currentVersionNode {
    border-color: rgba(127, 228, 196, 0.56);
    box-shadow: inset 0 0 0 1px rgba(127, 228, 196, 0.12);
  }

  .versionNodeHeader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 18px;
    margin-bottom: 12px;
  }

  .versionOrdinal {
    color: #7fe4c4;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 900;
  }

  .versionIdentity {
    margin: 4px 0 0;
    color: #f2f6ff;
    font-weight: 900;
    font-size: 1.08rem;
  }

  .versionStatus {
    border: 1px solid rgba(127, 228, 196, 0.34);
    border-radius: 999px;
    padding: 7px 10px;
    color: #9cf0d7;
    font-size: 0.7rem;
    font-weight: 900;
    letter-spacing: 0.08em;
  }

  .versionRegistryLink {
    color: #a9c7ff;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 900;
    text-decoration: none;
  }

  .versionRegistryLink:hover,
  .previousVersion a:hover {
    text-decoration: underline;
  }

  .relationshipType,
  .lineageNote,
  .previousVersion,
  .seriesNote {
    color: #aebfd8;
    line-height: 1.65;
  }

  .relationshipType {
    margin: 12px 0 0;
    text-transform: capitalize;
  }

  .lineageNote {
    margin: 10px 0 0;
  }

  .inheritanceGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
  }

  .previousVersion {
    margin: 14px 0 0;
    font-size: 0.9rem;
  }

  .previousVersion a {
    color: #a9c7ff;
    font-weight: 800;
  }

  .seriesNote {
    margin: 22px 0 0;
    padding-top: 18px;
    border-top: 1px solid rgba(164, 190, 231, 0.14);
    font-size: 0.92rem;
  }

  @media (max-width: 880px) {
    .seriesSummaryGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 620px) {
    .seriesSummaryGrid,
    .inheritanceGrid {
      grid-template-columns: 1fr;
    }

    .versionNodeHeader {
      flex-direction: column;
    }
  }
`;
