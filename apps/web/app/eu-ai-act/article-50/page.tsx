// apps/web/app/eu-ai-act/article-50/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type ActorRole = 'Provider' | 'Deployer' | 'Provider and Deployer';
type ContentType = 'Audio' | 'Image' | 'Video' | 'Text' | 'Interactive AI';
type AssessmentState = 'NOT ASSESSED' | 'LIKELY APPLIES' | 'REVIEW REQUIRED' | 'EVIDENCE INCOMPLETE';

type Obligation = {
  id: string;
  article: string;
  title: string;
  actorRoles: ActorRole[];
  contentTypes: ContentType[];
  trigger: string;
  requiredEvidence: string[];
  implementationQuestions: string[];
  nonClaims: string[];
};

const obligations: Obligation[] = [
  {
    id: 'TA-14-A50-01',
    article: 'Article 50(1)',
    title: 'Direct interaction with an AI system',
    actorRoles: ['Provider', 'Provider and Deployer'],
    contentTypes: ['Interactive AI'],
    trigger:
      'Natural persons interact directly with an AI system unless the interaction is obvious from the circumstances and context of use.',
    requiredEvidence: [
      'System intended-purpose statement',
      'User journey and interface captures',
      'Disclosure wording',
      'Disclosure timing and placement',
      'Context-based exception analysis',
      'Deployment version record',
    ],
    implementationQuestions: [
      'Does the user interact directly with the AI system?',
      'Would a reasonable person understand from context that the system is AI?',
      'When is the disclosure first presented?',
      'Can the disclosure be distinguished from ordinary interface content?',
      'Does the disclosure remain present after material interface changes?',
    ],
    nonClaims: [
      'A chatbot label alone does not prove sufficient disclosure.',
      'A policy document does not prove the disclosure appeared to users.',
      'A design mock-up does not prove production deployment.',
    ],
  },
  {
    id: 'TA-14-A50-02',
    article: 'Article 50(2)',
    title: 'Machine-readable marking and detectability',
    actorRoles: ['Provider', 'Provider and Deployer'],
    contentTypes: ['Audio', 'Image', 'Video', 'Text'],
    trigger:
      'The provider generates synthetic audio, image, video, or text content that must be marked in a machine-readable format and made detectable where technically feasible.',
    requiredEvidence: [
      'Output-classification record',
      'Machine-readable marking design',
      'Marking persistence tests',
      'Detection test results',
      'Interoperability evidence',
      'Robustness and removal-resistance evidence',
      'Technical-feasibility determination',
      'Known limitation record',
    ],
    implementationQuestions: [
      'Which generated outputs receive a machine-readable mark?',
      'At what point in the generation or export process is the mark applied?',
      'Does the mark survive common transformations?',
      'Can independent tools detect it?',
      'What failure states are observable?',
      'Which content classes remain technically infeasible to mark or detect?',
    ],
    nonClaims: [
      'Metadata insertion alone does not prove robust detectability.',
      'A successful laboratory test does not prove all deployment outputs are marked.',
      'Technical infeasibility must be evidenced, not merely asserted.',
    ],
  },
  {
    id: 'TA-14-A50-03',
    article: 'Article 50(3)',
    title: 'Emotion recognition and biometric categorisation notice',
    actorRoles: ['Provider', 'Deployer', 'Provider and Deployer'],
    contentTypes: ['Interactive AI', 'Image', 'Video'],
    trigger:
      'Natural persons are exposed to an emotion-recognition or biometric-categorisation system and an applicable exception has not been established.',
    requiredEvidence: [
      'System classification record',
      'Biometric or emotion function description',
      'Deployment-context record',
      'Affected-person pathway',
      'Notice wording and placement',
      'Exception analysis',
      'Version and change history',
    ],
    implementationQuestions: [
      'Does the system infer emotion or assign a biometric category?',
      'Who is exposed to the system?',
      'Where and when is notice given?',
      'Can the affected person understand the system is operating?',
      'Is the claimed exception documented and bounded?',
      'Does the deployment context create additional duties?',
    ],
    nonClaims: [
      'A vendor description does not conclusively classify the deployed system.',
      'A notice does not legalise a prohibited use.',
      'A general privacy policy may not prove timely notice.',
    ],
  },
  {
    id: 'TA-14-A50-04',
    article: 'Article 50(4)',
    title: 'Deepfake disclosure',
    actorRoles: ['Deployer', 'Provider and Deployer'],
    contentTypes: ['Audio', 'Image', 'Video'],
    trigger:
      'A deployer uses AI-generated or manipulated content constituting a deepfake and no applicable exception removes or modifies the disclosure requirement.',
    requiredEvidence: [
      'Content identity and classification',
      'Creation and manipulation chronology',
      'Disclosure wording',
      'Disclosure placement and timing',
      'Artistic or satirical context analysis',
      'Publication record',
      'Editorial approval record',
    ],
    implementationQuestions: [
      'Does the content resemble existing persons, objects, places, entities, or events?',
      'Would the content falsely appear authentic or truthful?',
      'Where is the disclosure displayed or communicated?',
      'Is the disclosure appropriate to the medium?',
      'Does an artistic, satirical, fictional, or analogous context affect presentation?',
      'Was the disclosed version the version actually published?',
    ],
    nonClaims: [
      'Internal labelling does not prove public disclosure.',
      'A platform watermark does not automatically satisfy every deployer duty.',
      'An artistic context may modify presentation but does not erase the need for analysis.',
    ],
  },
  {
    id: 'TA-14-A50-05',
    article: 'Article 50(4)',
    title: 'Public-interest text disclosure',
    actorRoles: ['Deployer', 'Provider and Deployer'],
    contentTypes: ['Text'],
    trigger:
      'AI-generated or manipulated text is published to inform the public on matters of public interest, subject to the stated editorial-control and responsibility conditions.',
    requiredEvidence: [
      'Public-interest classification',
      'Text-generation chronology',
      'Human editorial-control record',
      'Editorial responsibility declaration',
      'Disclosure wording and placement',
      'Publication version record',
      'Exception analysis',
    ],
    implementationQuestions: [
      'Is the text intended to inform the public on a matter of public interest?',
      'Was the text generated or manipulated by AI?',
      'Was there human review or editorial control?',
      'Who bears editorial responsibility?',
      'Does the claimed exception actually match the production process?',
      'Can the final published text be tied to the reviewed version?',
    ],
    nonClaims: [
      'Human review alone does not automatically establish an exception.',
      'Editorial responsibility must be attributable.',
      'A draft history does not prove the published version was reviewed.',
    ],
  },
];

const actorOptions: ActorRole[] = ['Provider', 'Deployer', 'Provider and Deployer'];
const contentOptions: ContentType[] = ['Audio', 'Image', 'Video', 'Text', 'Interactive AI'];

function calculateState(
  role: ActorRole,
  contentTypes: ContentType[],
  selectedObligations: string[],
  evidenceConfirmed: string[],
): AssessmentState {
  if (selectedObligations.length === 0) {
    return 'NOT ASSESSED';
  }

  const relevant = obligations.filter(
    (item) =>
      selectedObligations.includes(item.id) &&
      item.actorRoles.includes(role) &&
      item.contentTypes.some((type) => contentTypes.includes(type)),
  );

  if (relevant.length === 0) {
    return 'REVIEW REQUIRED';
  }

  const requiredEvidence = new Set(relevant.flatMap((item) => item.requiredEvidence));
  const confirmed = evidenceConfirmed.filter((item) => requiredEvidence.has(item));

  if (confirmed.length === 0 || confirmed.length < Math.ceil(requiredEvidence.size * 0.5)) {
    return 'EVIDENCE INCOMPLETE';
  }

  return 'LIKELY APPLIES';
}

export default function Article50WorkspacePage() {
  const [role, setRole] = useState<ActorRole>('Provider');
  const [contentTypes, setContentTypes] = useState<ContentType[]>(['Interactive AI']);
  const [selectedObligations, setSelectedObligations] = useState<string[]>(['TA-14-A50-01']);
  const [evidenceConfirmed, setEvidenceConfirmed] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const visibleObligations = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return obligations.filter((item) => {
      const roleMatch = item.actorRoles.includes(role);
      const contentMatch = item.contentTypes.some((type) => contentTypes.includes(type));
      const queryMatch =
        !normalized ||
        [
          item.id,
          item.article,
          item.title,
          item.trigger,
          ...item.requiredEvidence,
          ...item.implementationQuestions,
          ...item.nonClaims,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized);

      return roleMatch && contentMatch && queryMatch;
    });
  }, [contentTypes, query, role]);

  const selectedRecords = obligations.filter((item) => selectedObligations.includes(item.id));
  const selectedEvidence = Array.from(
    new Set(selectedRecords.flatMap((item) => item.requiredEvidence)),
  );

  const assessmentState = calculateState(
    role,
    contentTypes,
    selectedObligations,
    evidenceConfirmed,
  );

  const stateClass = assessmentState.toLowerCase().replaceAll(' ', '-');

  function toggleContentType(type: ContentType) {
    setContentTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  }

  function toggleObligation(id: string) {
    setSelectedObligations((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleEvidence(item: string) {
    setEvidenceConfirmed((current) =>
      current.includes(item)
        ? current.filter((evidence) => evidence !== item)
        : [...current, item],
    );
  }

  return (
    <main className="page-shell">
      <div className="ambient" aria-hidden="true">
        <span className="signal signal-one" />
        <span className="signal signal-two" />
        <span className="signal signal-three" />
        <span className="beam beam-one" />
        <span className="beam beam-two" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">TA-14 AI Governance Exchange</Link>
          <span>/</span>
          <Link href="/eu-ai-act">EU AI Act</Link>
          <span>/</span>
          <span>Article 50 Workspace</span>
        </nav>

        <header className="hero">
          <span className="eyebrow">ARTICLE 50 TRANSPARENCY WORKSPACE</span>
          <h1>Map the actor, content, obligation, evidence, and disclosure route.</h1>
          <p className="hero-copy">
            This front-end workspace helps separate applicability from implementation and evidence.
            It does not make a legal determination. It creates a bounded assessment record showing
            which Article 50 pathways were considered, what evidence was declared, what remains
            missing, and where independent review is required.
          </p>

          <div className="boundary-banner">
            <strong>Demonstration assessment only.</strong>
            <p>
              No account persistence, file upload, regulator submission, legal interpretation,
              conformity assessment, or compliance certification is connected to this page.
            </p>
          </div>

          <div className="action-row">
            <a className="primary-button" href="#assessment-builder">
              Start assessment
            </a>
            <Link className="secondary-button" href="/eu-ai-act">
              Return to EU AI Act
            </Link>
            <Link className="text-link" href="/marketplace/professionals">
              Find an independent reviewer
            </Link>
          </div>
        </header>

        <section className="assessment-shell" id="assessment-builder">
          <div className="builder-column">
            <div className="section-heading">
              <span className="eyebrow">ASSESSMENT BUILDER</span>
              <h2>Declare the context before selecting the obligation.</h2>
            </div>

            <section className="builder-card">
              <span className="step-label">STEP 01 · ACTOR ROLE</span>
              <h3>What role is being assessed?</h3>
              <div className="choice-grid three">
                {actorOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={role === item ? 'choice selected' : 'choice'}
                    onClick={() => setRole(item)}
                  >
                    <strong>{item}</strong>
                    <span>
                      {item === 'Provider'
                        ? 'Develops or places the relevant AI system or output capability on the market.'
                        : item === 'Deployer'
                          ? 'Uses the AI system under its authority in an operational context.'
                          : 'Performs both provider-side and deployer-side functions.'}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="builder-card">
              <span className="step-label">STEP 02 · CONTENT OR INTERACTION TYPE</span>
              <h3>What does the system generate, manipulate, or present?</h3>
              <div className="choice-grid content">
                {contentOptions.map((item) => {
                  const selected = contentTypes.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      className={selected ? 'choice compact selected' : 'choice compact'}
                      onClick={() => toggleContentType(item)}
                    >
                      <strong>{item}</strong>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="builder-card">
              <span className="step-label">STEP 03 · OBLIGATION PATHWAY</span>
              <div className="card-heading-row">
                <div>
                  <h3>Select pathways requiring assessment</h3>
                  <p>Only pathways matching the declared role and content are displayed.</p>
                </div>

                <label className="search-label">
                  <span>Search</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search obligations or evidence"
                  />
                </label>
              </div>

              <div className="obligation-list">
                {visibleObligations.map((item) => {
                  const selected = selectedObligations.includes(item.id);

                  return (
                    <article
                      key={item.id}
                      className={selected ? 'obligation selected' : 'obligation'}
                    >
                      <div className="obligation-topline">
                        <div>
                          <span>{item.article}</span>
                          <small>{item.id}</small>
                        </div>
                        <button type="button" onClick={() => toggleObligation(item.id)}>
                          {selected ? 'Remove pathway' : 'Add pathway'}
                        </button>
                      </div>

                      <h4>{item.title}</h4>
                      <p>{item.trigger}</p>

                      <div className="obligation-meta">
                        <span>{item.actorRoles.join(' · ')}</span>
                        <span>{item.contentTypes.join(' · ')}</span>
                      </div>
                    </article>
                  );
                })}
              </div>

              {visibleObligations.length === 0 && (
                <div className="empty-state">
                  No demonstration pathways match the selected role, content, and search.
                </div>
              )}
            </section>

            <section className="builder-card">
              <span className="step-label">STEP 04 · EVIDENCE DECLARATION</span>
              <h3>Which evidence items are presently available?</h3>
              <p className="helper-copy">
                Selecting an item only records a declaration in this browser state. It does not
                validate, upload, inspect, or authenticate the evidence.
              </p>

              {selectedEvidence.length > 0 ? (
                <div className="evidence-list">
                  {selectedEvidence.map((item) => {
                    const confirmed = evidenceConfirmed.includes(item);

                    return (
                      <label
                        key={item}
                        className={confirmed ? 'evidence-item confirmed' : 'evidence-item'}
                      >
                        <input
                          type="checkbox"
                          checked={confirmed}
                          onChange={() => toggleEvidence(item)}
                        />
                        <span>
                          <strong>{item}</strong>
                          <small>
                            {confirmed ? 'Declared available' : 'Not yet declared available'}
                          </small>
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  Select at least one obligation pathway to generate an evidence list.
                </div>
              )}
            </section>
          </div>

          <aside className="assessment-panel">
            <div className="panel-sticky">
              <span className="eyebrow">LIVE ASSESSMENT RECORD</span>
              <div className={`assessment-state ${stateClass}`}>{assessmentState}</div>

              <dl>
                <div>
                  <dt>Actor role</dt>
                  <dd>{role}</dd>
                </div>
                <div>
                  <dt>Content types</dt>
                  <dd>{contentTypes.length > 0 ? contentTypes.join(', ') : 'None selected'}</dd>
                </div>
                <div>
                  <dt>Pathways selected</dt>
                  <dd>{selectedObligations.length}</dd>
                </div>
                <div>
                  <dt>Evidence declared</dt>
                  <dd>
                    {evidenceConfirmed.length} of {selectedEvidence.length}
                  </dd>
                </div>
              </dl>

              <div className="progress-track" aria-label="Evidence declaration progress">
                <span
                  style={{
                    width:
                      selectedEvidence.length > 0
                        ? `${Math.round(
                            (evidenceConfirmed.length / selectedEvidence.length) * 100,
                          )}%`
                        : '0%',
                  }}
                />
              </div>

              <div className="state-explanation">
                {assessmentState === 'NOT ASSESSED' && (
                  <p>Select one or more obligation pathways to begin the assessment record.</p>
                )}
                {assessmentState === 'EVIDENCE INCOMPLETE' && (
                  <p>
                    A relevant pathway is selected, but the declared evidence is insufficient for a
                    review-ready package.
                  </p>
                )}
                {assessmentState === 'REVIEW REQUIRED' && (
                  <p>
                    The selected pathway does not cleanly align with the declared actor role and
                    content context. Independent applicability review is required.
                  </p>
                )}
                {assessmentState === 'LIKELY APPLIES' && (
                  <p>
                    The selected pathway appears relevant and a substantial portion of the evidence
                    list is declared available. This is not a legal or compliance determination.
                  </p>
                )}
              </div>

              <div className="panel-actions">
                <Link href="/marketplace/routes">Open route workspace</Link>
                <Link href="/marketplace/governed-records">Open governed records</Link>
                <Link href="/marketplace/professionals">Find independent review</Link>
              </div>
            </div>
          </aside>
        </section>

        <section className="detail-section">
          <div className="section-heading">
            <span className="eyebrow">SELECTED PATHWAY DETAILS</span>
            <h2>What must be tested, and what must not be overstated?</h2>
          </div>

          <div className="detail-grid">
            {selectedRecords.map((item) => (
              <article key={item.id} className="detail-card">
                <div className="detail-topline">
                  <span>{item.article}</span>
                  <small>{item.id}</small>
                </div>
                <h3>{item.title}</h3>

                <div className="detail-columns">
                  <div>
                    <span>Implementation questions</span>
                    <ul>
                      {item.implementationQuestions.map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span>Claims this record cannot support by itself</span>
                    <ul>
                      {item.nonClaims.map((nonClaim) => (
                        <li key={nonClaim}>{nonClaim}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="output-section">
          <div className="section-heading">
            <span className="eyebrow">GOVERNED OUTPUT PACKAGE</span>
            <h2>A complete route should produce separate records.</h2>
          </div>

          <div className="output-grid">
            {[
              [
                'Applicability Record',
                'Actor, system, content type, deployment context, obligation considered, exception considered, and unresolved interpretation.',
              ],
              [
                'Evidence Map',
                'Each claimed measure bound to evidence identity, owner, version, date, location, and validation state.',
              ],
              [
                'Implementation Record',
                'The actual marking, notice, disclosure, interface, workflow, or publication mechanism used.',
              ],
              [
                'Testing Record',
                'Detectability, persistence, placement, timing, robustness, failure states, and technical limitations.',
              ],
              [
                'Independent Review Record',
                'Reviewer, scope, evidence inspected, objections, corrections, findings, and limitations.',
              ],
              [
                'Change and Outcome Record',
                'What changed, what was approved, held, denied, escalated, superseded, or left unresolved.',
              ],
            ].map(([title, description]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow">SEPARATE THE RECORD FROM THE DETERMINATION</span>
          <h2>An Article 50 checklist is not an admissible transparency record.</h2>
          <p>
            The assessment must preserve who made the claim, what role they occupied, what content
            was involved, which obligation was considered, what evidence existed, what remained
            missing, who reviewed the route, and what conclusion the evidence could actually support.
          </p>

          <div className="action-row centered-actions">
            <a className="primary-button" href="#assessment-builder">
              Return to assessment
            </a>
            <Link className="secondary-button" href="/marketplace/opportunities">
              Post an Article 50 review need
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #eff8ff;
          background: #06101b;
        }

        :global(a) {
          color: inherit;
        }

        button,
        input {
          font: inherit;
        }

        .page-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(rgba(4, 14, 24, 0.82), rgba(4, 14, 24, 0.98)),
            radial-gradient(circle at 11% 5%, rgba(16, 135, 175, 0.2), transparent 33%),
            radial-gradient(circle at 88% 8%, rgba(72, 62, 170, 0.16), transparent 30%);
        }

        .content-shell {
          width: min(1220px, calc(100% - 36px));
          margin: 0 auto;
          padding: 34px 0 96px;
          position: relative;
          z-index: 2;
        }

        .ambient {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.65;
        }

        .signal {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #86e6f8;
          box-shadow: 0 0 22px rgba(94, 216, 243, 0.95);
          animation: drift 12s ease-in-out infinite;
        }

        .signal-one {
          top: 15%;
          right: 12%;
        }

        .signal-two {
          top: 51%;
          left: 8%;
          animation-delay: -4s;
        }

        .signal-three {
          bottom: 15%;
          right: 18%;
          animation-delay: -8s;
        }

        .beam {
          position: absolute;
          width: 44vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(78, 204, 233, 0.3), transparent);
          animation: pulse 7s ease-in-out infinite;
        }

        .beam-one {
          top: 24%;
          left: -5%;
          transform: rotate(-17deg);
        }

        .beam-two {
          bottom: 23%;
          right: -7%;
          transform: rotate(21deg);
          animation-delay: -3s;
        }

        .breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 58px;
          color: #83a7b6;
          font-size: 0.86rem;
        }

        .breadcrumbs a {
          text-decoration: none;
        }

        .breadcrumbs a:hover,
        .text-link:hover {
          color: #ffffff;
        }

        .eyebrow,
        .step-label {
          display: inline-block;
          color: #70d8ef;
          font-size: 0.73rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        h4,
        p {
          margin-top: 0;
        }

        .hero {
          max-width: 1020px;
          padding-bottom: 72px;
        }

        h1 {
          margin: 18px 0 24px;
          font-size: clamp(3.1rem, 7vw, 6.7rem);
          line-height: 0.95;
          letter-spacing: -0.058em;
        }

        .hero-copy {
          max-width: 900px;
          color: #b5cbd6;
          font-size: 1.09rem;
          line-height: 1.79;
        }

        .boundary-banner {
          margin-top: 26px;
          border-left: 3px solid #d9b656;
          border-radius: 0 15px 15px 0;
          padding: 18px 20px;
          background: rgba(201, 149, 29, 0.07);
        }

        .boundary-banner p {
          margin: 8px 0 0;
          color: #beb28b;
          line-height: 1.64;
        }

        .action-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 30px;
        }

        .primary-button,
        .secondary-button {
          border-radius: 999px;
          padding: 14px 21px;
          font-weight: 950;
          text-decoration: none;
          transition: transform 170ms ease;
        }

        .primary-button {
          border: 1px solid #88e5f8;
          color: #031019;
          background: linear-gradient(135deg, #a5efff, #55cae7);
          box-shadow: 0 12px 34px rgba(60, 191, 222, 0.17);
        }

        .secondary-button {
          border: 1px solid rgba(147, 208, 227, 0.3);
          color: #eaf9ff;
          background: rgba(10, 29, 44, 0.82);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-2px);
        }

        .text-link {
          color: #96ccdc;
          font-weight: 850;
          text-decoration: none;
        }

        .assessment-shell {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 22px;
          align-items: start;
        }

        .section-heading {
          max-width: 900px;
          margin-bottom: 26px;
        }

        .section-heading h2 {
          margin: 12px 0 0;
          font-size: clamp(2.25rem, 4.7vw, 4.25rem);
          line-height: 1;
          letter-spacing: -0.048em;
        }

        .builder-column {
          min-width: 0;
        }

        .builder-card {
          margin-bottom: 16px;
          padding: clamp(22px, 3vw, 32px);
          border: 1px solid rgba(103, 194, 220, 0.17);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(14, 38, 55, 0.94), rgba(7, 23, 36, 0.91));
        }

        .builder-card h3 {
          margin: 10px 0 20px;
          font-size: 1.58rem;
          letter-spacing: -0.025em;
        }

        .helper-copy,
        .card-heading-row p {
          color: #8fa8b4;
          line-height: 1.6;
        }

        .choice-grid {
          display: grid;
          gap: 10px;
        }

        .choice-grid.three {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .choice-grid.content {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .choice {
          min-height: 145px;
          padding: 17px;
          border: 1px solid rgba(115, 198, 220, 0.17);
          border-radius: 17px;
          color: #dbeef5;
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
          text-align: left;
        }

        .choice.compact {
          min-height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .choice strong {
          display: block;
          margin-bottom: 10px;
        }

        .choice span {
          color: #8fa7b2;
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .choice.selected {
          border-color: #6ed9ef;
          background: rgba(74, 193, 220, 0.12);
          box-shadow: inset 0 0 0 1px rgba(110, 217, 239, 0.2);
        }

        .card-heading-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
          gap: 18px;
          align-items: end;
        }

        .search-label span {
          display: block;
          margin-bottom: 8px;
          color: #7899a7;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        input[type='search'] {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid rgba(130, 207, 227, 0.22);
          border-radius: 13px;
          color: #f5fbff;
          background: rgba(4, 16, 27, 0.78);
          outline: none;
        }

        input[type='search']:focus {
          border-color: #70d8ef;
          box-shadow: 0 0 0 3px rgba(76, 198, 227, 0.13);
        }

        input::placeholder {
          color: #648091;
        }

        .obligation-list {
          display: grid;
          gap: 11px;
          margin-top: 22px;
        }

        .obligation {
          padding: 19px;
          border: 1px solid rgba(105, 190, 214, 0.15);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.023);
        }

        .obligation.selected {
          border-color: rgba(102, 216, 239, 0.54);
          background: rgba(55, 173, 204, 0.08);
        }

        .obligation-topline {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: flex-start;
        }

        .obligation-topline > div {
          display: grid;
          gap: 4px;
        }

        .obligation-topline span {
          color: #87d7e9;
          font-size: 0.76rem;
          font-weight: 950;
        }

        .obligation-topline small {
          color: #6f8d9a;
        }

        .obligation-topline button {
          border: 1px solid rgba(120, 203, 224, 0.22);
          border-radius: 999px;
          padding: 9px 11px;
          color: #d9f4fa;
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
        }

        .obligation h4 {
          margin: 18px 0 8px;
          font-size: 1.18rem;
        }

        .obligation p {
          color: #9bb1bb;
          line-height: 1.62;
        }

        .obligation-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .obligation-meta span {
          border-radius: 999px;
          padding: 7px 9px;
          color: #82a8b5;
          background: rgba(255, 255, 255, 0.035);
          font-size: 0.7rem;
        }

        .evidence-list {
          display: grid;
          gap: 9px;
          margin-top: 20px;
        }

        .evidence-item {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          padding: 14px;
          border: 1px solid rgba(105, 190, 214, 0.14);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.022);
          cursor: pointer;
        }

        .evidence-item.confirmed {
          border-color: rgba(80, 211, 155, 0.33);
          background: rgba(48, 157, 112, 0.07);
        }

        .evidence-item input {
          width: 18px;
          height: 18px;
          accent-color: #64d8ee;
        }

        .evidence-item span {
          display: grid;
          gap: 4px;
        }

        .evidence-item small {
          color: #7593a0;
        }

        .empty-state {
          margin-top: 18px;
          padding: 26px;
          border: 1px dashed rgba(127, 199, 219, 0.22);
          border-radius: 17px;
          color: #849fab;
          text-align: center;
        }

        .assessment-panel {
          min-width: 0;
        }

        .panel-sticky {
          position: sticky;
          top: 24px;
          padding: 24px;
          border: 1px solid rgba(112, 203, 226, 0.19);
          border-radius: 24px;
          background:
            radial-gradient(circle at top, rgba(57, 178, 207, 0.11), transparent 42%),
            rgba(8, 27, 42, 0.95);
          box-shadow: 0 24px 65px rgba(0, 0, 0, 0.22);
        }

        .assessment-state {
          margin: 18px 0;
          border-radius: 14px;
          padding: 16px;
          font-size: 0.86rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-align: center;
        }

        .assessment-state.not-assessed {
          color: #b7c6cc;
          background: rgba(119, 137, 145, 0.1);
        }

        .assessment-state.evidence-incomplete {
          color: #ffe09a;
          background: rgba(184, 131, 27, 0.12);
        }

        .assessment-state.review-required {
          color: #a8dcff;
          background: rgba(52, 129, 178, 0.12);
        }

        .assessment-state.likely-applies {
          color: #8cebc3;
          background: rgba(45, 163, 113, 0.12);
        }

        dl {
          margin: 0;
        }

        dl div {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 12px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(106, 183, 205, 0.1);
        }

        dt {
          color: #7895a2;
          font-size: 0.76rem;
        }

        dd {
          margin: 0;
          color: #dceef4;
          font-size: 0.78rem;
          font-weight: 800;
          text-align: right;
        }

        .progress-track {
          height: 8px;
          margin-top: 22px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
        }

        .progress-track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #56cce6, #8fe7f7);
          transition: width 180ms ease;
        }

        .state-explanation {
          margin-top: 18px;
          border-left: 3px solid #d9b757;
          padding-left: 14px;
        }

        .state-explanation p {
          margin: 0;
          color: #a9b7b5;
          font-size: 0.84rem;
          line-height: 1.6;
        }

        .panel-actions {
          display: grid;
          gap: 8px;
          margin-top: 22px;
        }

        .panel-actions a {
          border: 1px solid rgba(120, 202, 224, 0.2);
          border-radius: 999px;
          padding: 11px 13px;
          color: #dff7fd;
          background: rgba(255, 255, 255, 0.025);
          font-size: 0.78rem;
          font-weight: 850;
          text-align: center;
          text-decoration: none;
        }

        .detail-section,
        .output-section {
          padding-top: 88px;
        }

        .detail-grid {
          display: grid;
          gap: 15px;
        }

        .detail-card {
          padding: 25px;
          border: 1px solid rgba(103, 194, 220, 0.16);
          border-radius: 23px;
          background: rgba(10, 30, 45, 0.74);
        }

        .detail-topline {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          color: #73cce1;
          font-size: 0.76rem;
          font-weight: 900;
        }

        .detail-topline small {
          color: #6b8794;
        }

        .detail-card h3 {
          margin: 16px 0 20px;
          font-size: 1.55rem;
        }

        .detail-columns {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .detail-columns > div {
          padding: 18px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.025);
        }

        .detail-columns > div > span {
          color: #79a7b5;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .detail-columns ul {
          margin: 12px 0 0;
          padding-left: 18px;
          color: #9eb4be;
          line-height: 1.68;
        }

        .output-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .output-grid article {
          min-height: 220px;
          padding: 22px;
          border: 1px solid rgba(103, 194, 220, 0.15);
          border-radius: 20px;
          background: rgba(10, 30, 45, 0.72);
        }

        .output-grid h3 {
          margin-bottom: 14px;
          font-size: 1.25rem;
        }

        .output-grid p {
          color: #96adb7;
          line-height: 1.65;
        }

        .final-cta {
          max-width: 960px;
          margin: 86px auto 0;
          padding: clamp(32px, 5vw, 60px);
          border: 1px solid rgba(117, 205, 228, 0.19);
          border-radius: 30px;
          text-align: center;
          background:
            radial-gradient(circle at top, rgba(56, 173, 205, 0.11), transparent 48%),
            rgba(10, 30, 46, 0.84);
        }

        .final-cta h2 {
          margin: 12px 0 17px;
          font-size: clamp(2rem, 4vw, 3.55rem);
          letter-spacing: -0.04em;
        }

        .final-cta p {
          color: #aabec9;
          line-height: 1.77;
        }

        .centered-actions {
          justify-content: center;
        }

        @keyframes drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(0.85);
            opacity: 0.4;
          }
          50% {
            transform: translate3d(20px, -24px, 0) scale(1.35);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.82;
          }
        }

        @media (max-width: 1060px) {
          .assessment-shell {
            grid-template-columns: 1fr;
          }

          .panel-sticky {
            position: static;
          }

          .choice-grid.content {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 780px) {
          .choice-grid.three,
          .output-grid,
          .detail-columns {
            grid-template-columns: 1fr;
          }

          .card-heading-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .content-shell {
            width: min(100% - 24px, 1220px);
            padding-top: 22px;
          }

          .breadcrumbs {
            margin-bottom: 42px;
          }

          .choice-grid.content {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .obligation-topline {
            align-items: stretch;
            flex-direction: column;
          }

          dl div {
            grid-template-columns: 1fr;
          }

          dd {
            text-align: left;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) {
            scroll-behavior: auto;
          }

          .signal,
          .beam {
            animation: none;
          }

          .primary-button,
          .secondary-button,
          .progress-track span {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
