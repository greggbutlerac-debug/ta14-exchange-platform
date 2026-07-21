// apps/web/app/eu-ai-act/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type RouteState = 'READY TO MAP' | 'EVIDENCE GAP' | 'REVIEW REQUIRED';

type TransparencyPathway = {
  id: string;
  article: string;
  role: string;
  title: string;
  description: string;
  appliesTo: string[];
  evidence: string[];
  outputs: string[];
  state: RouteState;
};

const transparencyPathways: TransparencyPathway[] = [
  {
    id: 'TA-14-EU-AIA-50-1',
    article: 'Article 50(1)',
    role: 'Provider',
    title: 'Direct AI interaction disclosure',
    description:
      'Map whether a system interacts directly with natural persons and whether the disclosure design clearly informs them that they are interacting with AI.',
    appliesTo: [
      'Interactive AI systems',
      'Chatbots and conversational systems',
      'Direct user-facing AI interfaces',
    ],
    evidence: [
      'Intended-purpose statement',
      'User-interface captures',
      'Disclosure timing and wording',
      'Exception analysis',
      'Version and deployment record',
    ],
    outputs: [
      'Applicability record',
      'Disclosure evidence map',
      'Gap and exception record',
      'Review-ready route package',
    ],
    state: 'READY TO MAP',
  },
  {
    id: 'TA-14-EU-AIA-50-2',
    article: 'Article 50(2)',
    role: 'Provider',
    title: 'Machine-readable marking and detectability',
    description:
      'Preserve how synthetic or manipulated audio, image, video, and text outputs are marked in a machine-readable format and made detectable where technically feasible.',
    appliesTo: [
      'Generative AI systems',
      'Synthetic media systems',
      'AI-generated or manipulated content',
    ],
    evidence: [
      'Marking architecture',
      'Detection testing',
      'Interoperability evidence',
      'Robustness evidence',
      'Technical-feasibility determination',
    ],
    outputs: [
      'Marking implementation record',
      'Detectability test record',
      'Technical limitation record',
      'Provider evidence package',
    ],
    state: 'EVIDENCE GAP',
  },
  {
    id: 'TA-14-EU-AIA-50-3',
    article: 'Article 50(3)',
    role: 'Provider or Deployer',
    title: 'Emotion recognition and biometric categorisation notice',
    description:
      'Map notice obligations where natural persons are exposed to emotion-recognition or biometric-categorisation systems, subject to the applicable exceptions.',
    appliesTo: [
      'Emotion-recognition systems',
      'Biometric-categorisation systems',
      'Workplace or public-facing deployments',
    ],
    evidence: [
      'System classification',
      'Deployment context',
      'Notice design',
      'Exception analysis',
      'Affected-person pathway',
    ],
    outputs: [
      'Applicability determination',
      'Notice implementation record',
      'Exception and limitation record',
      'Deployment evidence package',
    ],
    state: 'REVIEW REQUIRED',
  },
  {
    id: 'TA-14-EU-AIA-50-4',
    article: 'Article 50(4)',
    role: 'Deployer',
    title: 'Deepfake and public-interest text disclosure',
    description:
      'Map deployer-side disclosure for deepfakes and certain AI-generated or manipulated text published to inform the public on matters of public interest.',
    appliesTo: [
      'Deepfakes',
      'AI-generated public-interest text',
      'Professionally deployed synthetic media',
    ],
    evidence: [
      'Content classification',
      'Editorial-control record',
      'Disclosure wording and placement',
      'Publication chronology',
      'Exception analysis',
    ],
    outputs: [
      'Deployer disclosure record',
      'Editorial-control determination',
      'Publication evidence package',
      'Exception and boundary record',
    ],
    state: 'READY TO MAP',
  },
];

const routeStateClass: Record<RouteState, string> = {
  'READY TO MAP': 'ready',
  'EVIDENCE GAP': 'gap',
  'REVIEW REQUIRED': 'review',
};

const platformRoutes = {
  marketplace: '/marketplace',
  opportunities: '/marketplace/opportunities',
  professionals: '/marketplace/professionals',
  governedRecords: '/marketplace/governed-records',
  routes: '/marketplace/routes',
  registry: '/ai-governance-registry',
} as const;

export default function EuAiActPage() {
  const [role, setRole] = useState<'All' | 'Provider' | 'Deployer' | 'Provider or Deployer'>(
    'All',
  );
  const [query, setQuery] = useState('');

  const filteredPathways = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return transparencyPathways.filter((pathway) => {
      const roleMatch = role === 'All' || pathway.role === role;
      const queryMatch =
        !normalized ||
        [
          pathway.id,
          pathway.article,
          pathway.role,
          pathway.title,
          pathway.description,
          ...pathway.appliesTo,
          ...pathway.evidence,
          ...pathway.outputs,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized);

      return roleMatch && queryMatch;
    });
  }, [query, role]);

  return (
    <main className="page-shell">
      <div className="ambient-field" aria-hidden="true">
        <span className="grid-line line-one" />
        <span className="grid-line line-two" />
        <span className="grid-line line-three" />
        <span className="signal signal-one" />
        <span className="signal signal-two" />
        <span className="signal signal-three" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">TA-14 AI Governance Exchange</Link>
          <span>/</span>
          <span>EU AI Act</span>
        </nav>

        <header className="hero">
          <span className="eyebrow">EU AI ACT GOVERNANCE WORKSPACE</span>
          <h1>Turn regulatory obligations into inspectable evidence routes.</h1>
          <p className="hero-copy">
            The EU AI Act does not become governable merely because an organisation has a policy,
            checklist, legal memo, or dashboard. TA-14 separates applicability, evidence,
            determination, review, commitment, execution, and preserved outcome so each claimed
            compliance pathway can be inspected under scrutiny.
          </p>

          <div className="deadline-panel">
            <div>
              <span className="deadline-label">ARTICLE 50 APPLICATION DATE</span>
              <strong>2 August 2026</strong>
              <p>
                Transparency obligations for providers and deployers of certain AI systems begin to
                apply.
              </p>
            </div>
            <div>
              <span className="deadline-label">INITIAL CODE SIGNATORY LIST</span>
              <strong>27 July 2026 · 18:00 CEST</strong>
              <p>
                Submission deadline for inclusion in the initial public list of Code of Practice
                signatories.
              </p>
            </div>
          </div>

          <div className="legal-boundary">
            <strong>This workspace does not provide legal advice or certify compliance.</strong>
            <p>
              It structures declared obligations, evidence, gaps, review routes, decisions, and
              records. Final legal interpretation, regulator acceptance, conformity assessment, and
              enforcement remain outside the platform unless separately established by competent
              authority.
            </p>
          </div>

          <div className="action-row">
            <a className="primary-button" href="#article-50-workspace">
              Open Article 50 workspace
            </a>
            <Link className="secondary-button" href={platformRoutes.routes}>
              Browse governance routes
            </Link>
            <Link className="text-link" href={platformRoutes.professionals}>
              Find an independent reviewer
            </Link>
          </div>
        </header>

        <section className="status-grid" aria-label="EU AI Act status">
          <article>
            <span>Regulation</span>
            <strong>EU 2024/1689</strong>
            <p>Risk-based obligations for AI systems, models, providers, deployers, and other actors.</p>
          </article>
          <article>
            <span>Current focus</span>
            <strong>Article 50</strong>
            <p>Interaction disclosure, marking, detectability, deepfakes, and public-interest text.</p>
          </article>
          <article>
            <span>Code status</span>
            <strong>VOLUNTARY</strong>
            <p>Signing can support a compliance pathway but is not conclusive proof of compliance.</p>
          </article>
          <article>
            <span>Alternative route</span>
            <strong>PERMITTED</strong>
            <p>Non-signatories remain responsible for demonstrating adequate alternative measures.</p>
          </article>
        </section>

        <section className="principle-section">
          <div className="section-heading">
            <span className="eyebrow">THE TA-14 DIFFERENCE</span>
            <h2>Do not collapse the law, the evidence, and the conclusion into one layer.</h2>
            <p>
              A regulation states obligations. An organisation declares how those obligations apply.
              Evidence must then support that declaration. Review tests the evidence and reasoning.
              Only after those layers remain separate can a decision or execution route become
              inspectable.
            </p>
          </div>

          <div className="chain">
            {[
              ['01', 'Obligation', 'What the applicable legal text requires.'],
              ['02', 'Applicability', 'Why the organisation, role, system, and use case are in or out.'],
              ['03', 'Evidence', 'What proves the claimed implementation actually exists.'],
              ['04', 'Determination', 'A bounded conclusion tied to stated evidence and rules.'],
              ['05', 'Review', 'Independent challenge, correction, escalation, or confirmation.'],
              ['06', 'Record', 'A dated, attributable, versioned preservation of the route.'],
            ].map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="article-workspace" id="article-50-workspace">
          <div className="section-heading">
            <span className="eyebrow">ARTICLE 50 TRANSPARENCY WORKSPACE</span>
            <h2>Map the obligation before claiming the outcome.</h2>
            <p>
              These demonstration pathways separate provider and deployer duties, identify evidence
              dependencies, expose missing proof, and define review-ready outputs.
            </p>
          </div>

          <div className="filter-panel">
            <label>
              Search pathways
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search obligation, role, evidence, output, or pathway ID"
              />
            </label>

            <div>
              <span className="filter-label">Role</span>
              <div className="filter-row">
                {(['All', 'Provider', 'Deployer', 'Provider or Deployer'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={role === item ? 'filter-button selected' : 'filter-button'}
                    onClick={() => setRole(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="results-meta">
            <span>{filteredPathways.length} pathway demonstration(s)</span>
            <span>No backend evidence submission or legal determination is connected yet.</span>
          </div>

          <div className="pathway-grid">
            {filteredPathways.map((pathway) => (
              <article className="pathway-card" key={pathway.id}>
                <div className="card-topline">
                  <span>{pathway.article}</span>
                  <span className={`state-badge ${routeStateClass[pathway.state]}`}>
                    {pathway.state}
                  </span>
                </div>

                <span className="pathway-id">{pathway.id}</span>
                <h3>{pathway.title}</h3>
                <p className="role-label">{pathway.role}</p>
                <p className="description">{pathway.description}</p>

                <div className="scope-box">
                  <span>Potential scope</span>
                  <ul>
                    {pathway.appliesTo.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="two-column">
                  <div>
                    <span>Evidence to preserve</span>
                    <ul>
                      {pathway.evidence.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span>Governed outputs</span>
                    <ul>
                      {pathway.outputs.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="card-actions">
                  <Link className="card-primary" href={platformRoutes.routes}>
                    Open route workspace
                  </Link>
                  <Link className="card-secondary" href={platformRoutes.professionals}>
                    Find reviewer
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredPathways.length === 0 && (
            <div className="empty-state">
              <h3>No pathways match those filters.</h3>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setRole('All');
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        <section className="code-section">
          <div className="section-heading">
            <span className="eyebrow">CODE OF PRACTICE PATHWAY</span>
            <h2>Signing the Code and complying with Article 50 are not the same claim.</h2>
            <p>
              The Code of Practice is a voluntary tool for demonstrating compliance with specified
              transparency obligations. Adherence can create a more predictable route, but it is not
              conclusive evidence of compliance. Non-signatories still require an adequate,
              documented alternative pathway.
            </p>
          </div>

          <div className="comparison-grid">
            <article>
              <span className="comparison-state">SIGNATORY ROUTE</span>
              <h3>Adhere to the Code</h3>
              <ul>
                <li>Identify the exact commitments that apply.</li>
                <li>Bind implementation evidence to each commitment.</li>
                <li>Preserve testing, exceptions, limitations, and updates.</li>
                <li>Demonstrate continuing adherence rather than one-time signature.</li>
              </ul>
            </article>
            <article>
              <span className="comparison-state">ALTERNATIVE ROUTE</span>
              <h3>Use other adequate measures</h3>
              <ul>
                <li>Document why the selected measures satisfy Article 50.</li>
                <li>Map differences from the Code and justify those differences.</li>
                <li>Prepare evidence for competent-authority information requests.</li>
                <li>Preserve gap analyses, testing, and technical limitations.</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="record-section">
          <div className="section-heading">
            <span className="eyebrow">GOVERNED RECORD ARCHITECTURE</span>
            <h2>Every material claim should become a dated, attributable record.</h2>
          </div>

          <div className="record-grid">
            {[
              ['Applicability Record', 'Preserves actor, role, system, use case, jurisdiction, scope, exceptions, and the basis for inclusion or exclusion.'],
              ['Evidence Map', 'Binds each obligation or commitment to documents, technical artifacts, tests, owners, versions, and unresolved gaps.'],
              ['Transparency Implementation Record', 'Preserves marking, notice, disclosure, placement, timing, detectability, and deployment state.'],
              ['Independent Review Record', 'Preserves reviewer identity, scope, evidence reviewed, findings, objections, corrections, and limitations.'],
              ['Change Record', 'Shows what changed, when, why, by whom, and whether prior evidence remains valid.'],
              ['Outcome Record', 'Preserves what was approved, held, denied, escalated, superseded, withdrawn, or left unresolved.'],
            ].map(([title, description]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="integration-section">
          <div className="section-heading">
            <span className="eyebrow">CONNECTED EXCHANGE PATHWAYS</span>
            <h2>The EU AI Act workspace should not become another isolated compliance page.</h2>
          </div>

          <div className="integration-grid">
            <Link href={platformRoutes.registry}>
              <span>01</span>
              <h3>AI Governance Registry</h3>
              <p>
                Preserve governance identity, establishment date, versions, claims, non-claims,
                evidence, and stewardship.
              </p>
            </Link>
            <Link href={platformRoutes.routes}>
              <span>02</span>
              <h3>Governance Routes</h3>
              <p>
                Convert obligations into inspectable pathways with inputs, gates, evidence, outputs,
                and explicit failure states.
              </p>
            </Link>
            <Link href={platformRoutes.governedRecords}>
              <span>03</span>
              <h3>Governed Records</h3>
              <p>
                Preserve applicability, evidence, review, disclosure, change, and outcome records.
              </p>
            </Link>
            <Link href={platformRoutes.professionals}>
              <span>04</span>
              <h3>Independent Review</h3>
              <p>
                Discover professionals through declared expertise, evidence signals, artifacts, and
                visible limitations.
              </p>
            </Link>
            <Link href={platformRoutes.opportunities}>
              <span>05</span>
              <h3>Post or Find Work</h3>
              <p>
                Create bounded opportunities for gap analysis, evidence mapping, route review, and
                transparency implementation.
              </p>
            </Link>
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</span>
          <h2>The deadline may start the obligation. It does not complete the evidence chain.</h2>
          <p>
            The TA-14 EU AI Act workspace is designed to make each regulatory pathway inspectable:
            what applies, why it applies, what evidence exists, what remains missing, who reviewed
            it, what changed, and what decision the evidence can actually support.
          </p>

          <div className="action-row centered-actions">
            <a className="primary-button" href="#article-50-workspace">
              Explore Article 50
            </a>
            <Link className="secondary-button" href={platformRoutes.marketplace}>
              Open Marketplace
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
            linear-gradient(rgba(4, 14, 24, 0.8), rgba(4, 14, 24, 0.98)),
            radial-gradient(circle at 12% 4%, rgba(17, 129, 171, 0.2), transparent 33%),
            radial-gradient(circle at 87% 8%, rgba(78, 61, 176, 0.16), transparent 31%);
        }

        .content-shell {
          width: min(1180px, calc(100% - 36px));
          margin: 0 auto;
          padding: 34px 0 96px;
          position: relative;
          z-index: 2;
        }

        .ambient-field {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.66;
        }

        .grid-line {
          position: absolute;
          width: 46vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(80, 202, 231, 0.26), transparent);
          animation: pulse 8s ease-in-out infinite;
        }

        .line-one {
          top: 18%;
          left: -7%;
          transform: rotate(-16deg);
        }

        .line-two {
          top: 52%;
          right: -10%;
          transform: rotate(20deg);
          animation-delay: -3s;
        }

        .line-three {
          bottom: 12%;
          left: 8%;
          transform: rotate(8deg);
          animation-delay: -6s;
        }

        .signal {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #89e7fa;
          box-shadow: 0 0 22px rgba(93, 215, 243, 0.95);
          animation: drift 12s ease-in-out infinite;
        }

        .signal-one {
          top: 16%;
          right: 12%;
        }

        .signal-two {
          top: 48%;
          left: 9%;
          animation-delay: -4s;
        }

        .signal-three {
          bottom: 17%;
          right: 18%;
          animation-delay: -8s;
        }

        .breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 60px;
          color: #83a8b7;
          font-size: 0.86rem;
        }

        .breadcrumbs a {
          text-decoration: none;
        }

        .breadcrumbs a:hover,
        .text-link:hover {
          color: #ffffff;
        }

        .eyebrow {
          display: inline-block;
          color: #70d8ef;
          font-size: 0.74rem;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        .hero {
          max-width: 1020px;
          padding-bottom: 64px;
        }

        h1 {
          margin: 18px 0 24px;
          font-size: clamp(3.1rem, 7vw, 6.8rem);
          line-height: 0.95;
          letter-spacing: -0.058em;
        }

        .hero-copy {
          max-width: 920px;
          color: #b5cbd6;
          font-size: 1.1rem;
          line-height: 1.8;
        }

        .deadline-panel {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
          margin-top: 30px;
        }

        .deadline-panel > div {
          padding: 23px;
          border: 1px solid rgba(218, 177, 69, 0.22);
          border-radius: 19px;
          background: rgba(193, 132, 18, 0.07);
        }

        .deadline-label {
          display: block;
          color: #bb9a44;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.09em;
        }

        .deadline-panel strong {
          display: block;
          margin-top: 10px;
          color: #ffe29a;
          font-size: 1.55rem;
        }

        .deadline-panel p {
          margin: 9px 0 0;
          color: #bcae82;
          line-height: 1.6;
        }

        .legal-boundary {
          margin-top: 18px;
          border-left: 3px solid #dcba5d;
          border-radius: 0 15px 15px 0;
          padding: 18px 20px;
          background: rgba(206, 154, 36, 0.065);
        }

        .legal-boundary p {
          margin: 8px 0 0;
          color: #bfb58f;
          line-height: 1.65;
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

        .status-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          padding-bottom: 82px;
        }

        .status-grid article {
          min-height: 190px;
          padding: 21px;
          border: 1px solid rgba(103, 194, 218, 0.16);
          border-radius: 20px;
          background: rgba(9, 29, 44, 0.74);
        }

        .status-grid span {
          color: #7899a8;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .status-grid strong {
          display: block;
          margin: 40px 0 11px;
          font-size: 1.45rem;
        }

        .status-grid p {
          color: #91aab5;
          line-height: 1.57;
        }

        .principle-section,
        .article-workspace,
        .code-section,
        .record-section,
        .integration-section {
          padding-top: 82px;
        }

        .section-heading {
          max-width: 940px;
          margin-bottom: 30px;
        }

        .section-heading h2 {
          margin: 12px 0 17px;
          font-size: clamp(2.3rem, 5vw, 4.65rem);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .section-heading p {
          color: #a8bec8;
          line-height: 1.75;
        }

        .chain {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
        }

        .chain article {
          min-height: 235px;
          padding: 20px;
          border: 1px solid rgba(103, 194, 220, 0.15);
          border-radius: 19px;
          background: rgba(10, 30, 45, 0.72);
        }

        .chain article > span,
        .integration-grid a > span {
          color: #5ed0e9;
          font-size: 0.74rem;
        }

        .chain h3,
        .integration-grid h3 {
          margin: 48px 0 10px;
          font-size: 1.18rem;
        }

        .chain p,
        .integration-grid p {
          color: #94abb6;
          line-height: 1.58;
        }

        .filter-panel {
          display: grid;
          gap: 22px;
          padding: 28px;
          border: 1px solid rgba(103, 194, 220, 0.18);
          border-radius: 25px;
          background: linear-gradient(145deg, rgba(14, 38, 55, 0.94), rgba(7, 23, 36, 0.91));
        }

        label {
          color: #edfaff;
          font-weight: 850;
        }

        input {
          width: 100%;
          display: block;
          margin-top: 9px;
          padding: 14px 15px;
          border: 1px solid rgba(130, 207, 227, 0.22);
          border-radius: 14px;
          color: #f5fbff;
          background: rgba(4, 16, 27, 0.78);
          outline: none;
        }

        input:focus {
          border-color: #70d8ef;
          box-shadow: 0 0 0 3px rgba(76, 198, 227, 0.13);
        }

        input::placeholder {
          color: #648091;
        }

        .filter-label {
          display: block;
          margin-bottom: 9px;
          color: #7898a7;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .filter-button {
          border: 1px solid rgba(123, 202, 224, 0.18);
          border-radius: 999px;
          padding: 10px 13px;
          color: #acd3df;
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
        }

        .filter-button.selected {
          border-color: #67d4eb;
          color: #031019;
          background: #77dff4;
          font-weight: 900;
        }

        .results-meta {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 4px;
          color: #7f9cab;
          font-size: 0.82rem;
        }

        .pathway-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .pathway-card {
          display: flex;
          flex-direction: column;
          padding: 25px;
          border: 1px solid rgba(103, 194, 220, 0.17);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(14, 38, 55, 0.93), rgba(7, 23, 36, 0.9));
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.15);
        }

        .card-topline {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          color: #84bac8;
          font-size: 0.75rem;
          font-weight: 900;
        }

        .state-badge {
          border-radius: 999px;
          padding: 7px 9px;
          font-size: 0.66rem;
          letter-spacing: 0.07em;
        }

        .state-badge.ready {
          color: #8cebc3;
          background: rgba(45, 163, 113, 0.11);
        }

        .state-badge.gap {
          color: #ffe09a;
          background: rgba(184, 131, 27, 0.11);
        }

        .state-badge.review {
          color: #a7dcff;
          background: rgba(52, 129, 178, 0.11);
        }

        .pathway-id {
          display: block;
          margin-top: 24px;
          color: #6f8f9e;
          font-size: 0.74rem;
        }

        .pathway-card h3 {
          margin: 9px 0 8px;
          font-size: 1.55rem;
          letter-spacing: -0.025em;
        }

        .role-label {
          color: #e6ca78;
          font-weight: 850;
        }

        .description {
          color: #a7bdc8;
          line-height: 1.68;
        }

        .scope-box {
          margin-top: 10px;
          border-left: 3px solid #5fcde7;
          border-radius: 0 14px 14px 0;
          padding: 15px 17px;
          background: rgba(59, 169, 198, 0.06);
        }

        .scope-box > span,
        .two-column > div > span {
          color: #79a8b6;
          font-size: 0.69rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .scope-box ul,
        .two-column ul,
        .comparison-grid ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #a4bac4;
          line-height: 1.65;
        }

        .two-column {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 12px;
        }

        .two-column > div {
          padding: 16px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.027);
        }

        .card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: auto;
          padding-top: 22px;
        }

        .card-primary,
        .card-secondary {
          border-radius: 999px;
          padding: 12px 16px;
          font-size: 0.85rem;
          font-weight: 900;
          text-decoration: none;
        }

        .card-primary {
          color: #04121a;
          background: #76dcef;
        }

        .card-secondary {
          border: 1px solid rgba(132, 203, 223, 0.25);
          color: #dff7ff;
          background: rgba(255, 255, 255, 0.025);
        }

        .empty-state {
          margin-top: 18px;
          padding: 44px 24px;
          border: 1px dashed rgba(127, 199, 219, 0.22);
          border-radius: 22px;
          text-align: center;
          color: #8fa9b5;
        }

        .empty-state button {
          border: 1px solid rgba(126, 207, 228, 0.23);
          border-radius: 999px;
          padding: 11px 15px;
          color: #dff8ff;
          background: rgba(66, 178, 207, 0.07);
          font-weight: 850;
          cursor: pointer;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .comparison-grid article {
          min-height: 320px;
          padding: 28px;
          border: 1px solid rgba(103, 194, 220, 0.16);
          border-radius: 23px;
          background: rgba(10, 30, 45, 0.74);
        }

        .comparison-state {
          color: #70d3e9;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .comparison-grid h3 {
          margin: 38px 0 14px;
          font-size: 1.75rem;
        }

        .record-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .record-grid article {
          min-height: 220px;
          padding: 22px;
          border: 1px solid rgba(103, 194, 220, 0.15);
          border-radius: 20px;
          background: rgba(10, 30, 45, 0.72);
        }

        .record-grid h3 {
          margin-bottom: 14px;
          font-size: 1.26rem;
        }

        .record-grid p {
          color: #96adb7;
          line-height: 1.65;
        }

        .integration-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 11px;
        }

        .integration-grid a {
          min-height: 245px;
          padding: 20px;
          border: 1px solid rgba(103, 194, 220, 0.15);
          border-radius: 19px;
          background: rgba(10, 30, 45, 0.72);
          text-decoration: none;
        }

        .integration-grid a:hover {
          border-color: rgba(103, 194, 220, 0.42);
          background: rgba(20, 53, 73, 0.78);
        }

        .final-cta {
          max-width: 960px;
          margin: 84px auto 0;
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

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
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

        @media (max-width: 1080px) {
          .status-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .chain {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .integration-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 800px) {
          .deadline-panel,
          .pathway-grid,
          .comparison-grid,
          .record-grid,
          .integration-grid {
            grid-template-columns: 1fr;
          }

          .results-meta {
            flex-direction: column;
          }
        }

        @media (max-width: 620px) {
          .content-shell {
            width: min(100% - 24px, 1180px);
            padding-top: 22px;
          }

          .breadcrumbs {
            margin-bottom: 42px;
          }

          .status-grid,
          .chain,
          .two-column {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) {
            scroll-behavior: auto;
          }

          .grid-line,
          .signal {
            animation: none;
          }

          .primary-button,
          .secondary-button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
