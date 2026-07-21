// apps/web/app/eu-ai-act/requirements/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Actor =
  | 'Provider'
  | 'Deployer'
  | 'Importer'
  | 'Distributor'
  | 'Authorised Representative'
  | 'GPAI Provider'
  | 'Public Authority';

type RequirementState = 'IN FORCE' | 'APPLIES 2026' | 'APPLIES LATER' | 'REVIEW TIMELINE';

type Requirement = {
  id: string;
  family: string;
  title: string;
  articles: string;
  actors: Actor[];
  state: RequirementState;
  summary: string;
  evidence: string[];
  ta14: string[];
  route: string;
};

const requirements: Requirement[] = [
  {
    id: 'EU-AIA-001',
    family: 'Prohibited Practices',
    title: 'Identify and prevent prohibited AI practices',
    articles: 'Article 5',
    actors: ['Provider', 'Deployer', 'Public Authority'],
    state: 'IN FORCE',
    summary:
      'Organisations must determine whether an intended or actual AI use falls within a prohibited practice and preserve the basis for that determination.',
    evidence: [
      'Use-case inventory',
      'Purpose and deployment-context record',
      'Affected-person analysis',
      'Prohibited-practice screening',
      'Exception and legal-basis analysis',
      'Decision and escalation record',
    ],
    ta14: [
      'Applicability route',
      'Prohibited-use gate',
      'Evidence-bound determination',
      'HOLD or DENY outcome record',
    ],
    route: '/marketplace/routes',
  },
  {
    id: 'EU-AIA-002',
    family: 'AI Literacy',
    title: 'Maintain sufficient AI literacy',
    articles: 'Article 4',
    actors: ['Provider', 'Deployer'],
    state: 'IN FORCE',
    summary:
      'Providers and deployers must take measures to ensure an appropriate level of AI literacy among relevant staff and persons operating AI systems on their behalf.',
    evidence: [
      'Role-based competency framework',
      'Training records',
      'Assessment results',
      'System-specific operating guidance',
      'Refresher and change records',
      'Responsibility assignment',
    ],
    ta14: [
      'Competency record',
      'Training evidence map',
      'Role-to-system binding',
      'Continuity and review record',
    ],
    route: '/academy',
  },
  {
    id: 'EU-AIA-003',
    family: 'High-Risk Classification',
    title: 'Classify high-risk AI systems',
    articles: 'Articles 6–7 and Annexes I and III',
    actors: ['Provider', 'Deployer', 'Importer', 'Distributor'],
    state: 'REVIEW TIMELINE',
    summary:
      'Organisations must determine whether an AI system is high-risk because it is a safety component of a regulated product or falls within an Annex III use case.',
    evidence: [
      'System identity and intended purpose',
      'Product and sector classification',
      'Annex I and Annex III analysis',
      'Materiality and exception analysis',
      'Versioned classification decision',
      'Independent review where required',
    ],
    ta14: [
      'Classification record',
      'Rule-bound applicability route',
      'Exception evidence',
      'Review and supersession record',
    ],
    route: '/eu-ai-act/high-risk',
  },
  {
    id: 'EU-AIA-004',
    family: 'Risk Management',
    title: 'Operate a continuous risk-management system',
    articles: 'Article 9',
    actors: ['Provider'],
    state: 'REVIEW TIMELINE',
    summary:
      'High-risk AI providers must establish, implement, document, and maintain a continuous iterative risk-management system throughout the lifecycle.',
    evidence: [
      'Known and foreseeable risk inventory',
      'Risk estimation and evaluation',
      'Mitigation decisions',
      'Residual-risk determination',
      'Testing and validation evidence',
      'Post-market feedback loop',
    ],
    ta14: [
      'Risk route chain',
      'Declared thresholds',
      'Mitigation evidence',
      'Residual-risk outcome record',
    ],
    route: '/marketplace/routes',
  },
  {
    id: 'EU-AIA-005',
    family: 'Data Governance',
    title: 'Govern training, validation, and testing data',
    articles: 'Article 10',
    actors: ['Provider'],
    state: 'REVIEW TIMELINE',
    summary:
      'High-risk AI systems using model training must apply data-governance and management practices appropriate to the intended purpose.',
    evidence: [
      'Dataset provenance',
      'Collection and preparation methods',
      'Relevance and representativeness analysis',
      'Bias and gap evaluation',
      'Data quality controls',
      'Version and lineage records',
    ],
    ta14: [
      'Dataset admissibility record',
      'Provenance chain',
      'Bias and limitation record',
      'Version continuity',
    ],
    route: '/marketplace/governed-records',
  },
  {
    id: 'EU-AIA-006',
    family: 'Technical Documentation',
    title: 'Create and maintain technical documentation',
    articles: 'Article 11 and Annex IV',
    actors: ['Provider'],
    state: 'REVIEW TIMELINE',
    summary:
      'Technical documentation must demonstrate conformity and provide competent authorities with the information needed to assess the system.',
    evidence: [
      'System description',
      'Architecture and development methods',
      'Data and model information',
      'Performance and limitation evidence',
      'Risk controls',
      'Change and version history',
    ],
    ta14: [
      'Governed technical record',
      'Evidence-to-claim mapping',
      'Versioned architecture route',
      'Change continuity record',
    ],
    route: '/marketplace/governed-records',
  },
  {
    id: 'EU-AIA-007',
    family: 'Record-Keeping',
    title: 'Enable automatic event logging',
    articles: 'Article 12',
    actors: ['Provider', 'Deployer'],
    state: 'REVIEW TIMELINE',
    summary:
      'High-risk AI systems must technically allow automatic recording of events over the system lifetime where appropriate to the intended purpose.',
    evidence: [
      'Logging architecture',
      'Event taxonomy',
      'Timestamp and identity controls',
      'Retention configuration',
      'Integrity and access controls',
      'Replay and incident evidence',
    ],
    ta14: [
      'Admissible execution record',
      'Continuity chain',
      'Replay verification',
      'Tamper-evident outcome record',
    ],
    route: '/records',
  },
  {
    id: 'EU-AIA-008',
    family: 'Transparency and Instructions',
    title: 'Provide sufficient transparency and instructions for use',
    articles: 'Article 13',
    actors: ['Provider', 'Deployer'],
    state: 'REVIEW TIMELINE',
    summary:
      'High-risk AI systems must be sufficiently transparent to enable deployers to interpret outputs and use them appropriately.',
    evidence: [
      'Instructions for use',
      'Intended purpose and limitations',
      'Performance characteristics',
      'Human oversight instructions',
      'Input specifications',
      'Maintenance and update requirements',
    ],
    ta14: [
      'Instruction evidence map',
      'Limitation record',
      'Operator route',
      'Interpretation boundary record',
    ],
    route: '/marketplace/governed-records',
  },
  {
    id: 'EU-AIA-009',
    family: 'Human Oversight',
    title: 'Design and operate effective human oversight',
    articles: 'Article 14',
    actors: ['Provider', 'Deployer'],
    state: 'REVIEW TIMELINE',
    summary:
      'High-risk AI systems must support effective human oversight appropriate to the risk, autonomy, and context of use.',
    evidence: [
      'Oversight role definition',
      'Intervention and stop controls',
      'Competency evidence',
      'Alert and escalation design',
      'Automation-bias safeguards',
      'Override and outcome records',
    ],
    ta14: [
      'Authority record',
      'Intervention gate',
      'HOLD and ESCALATE routes',
      'Override accountability record',
    ],
    route: '/marketplace/routes',
  },
  {
    id: 'EU-AIA-010',
    family: 'Accuracy, Robustness, Cybersecurity',
    title: 'Maintain accuracy, robustness, and cybersecurity',
    articles: 'Article 15',
    actors: ['Provider', 'Deployer'],
    state: 'REVIEW TIMELINE',
    summary:
      'High-risk AI systems must achieve appropriate levels of accuracy, robustness, and cybersecurity and perform consistently throughout their lifecycle.',
    evidence: [
      'Declared performance metrics',
      'Test and validation results',
      'Robustness and resilience testing',
      'Cybersecurity controls',
      'Failure-mode analysis',
      'Monitoring and corrective-action record',
    ],
    ta14: [
      'Threshold record',
      'Performance baseline',
      'Failure-state route',
      'Post-intervention outcome comparison',
    ],
    route: '/verification',
  },
  {
    id: 'EU-AIA-011',
    family: 'Provider Quality System',
    title: 'Operate a quality-management system',
    articles: 'Article 17',
    actors: ['Provider'],
    state: 'REVIEW TIMELINE',
    summary:
      'Providers of high-risk AI systems must implement a documented quality-management system covering compliance strategy, design, testing, records, accountability, and corrective action.',
    evidence: [
      'Quality policy and procedures',
      'Responsibility matrix',
      'Design and development controls',
      'Testing and validation procedures',
      'Supplier and change controls',
      'Corrective-action records',
    ],
    ta14: [
      'Governance operating record',
      'Role and authority map',
      'Change-control route',
      'Corrective-action evidence chain',
    ],
    route: '/ai-governance-registry',
  },
  {
    id: 'EU-AIA-012',
    family: 'Conformity and Registration',
    title: 'Complete conformity assessment and registration',
    articles: 'Articles 43, 47–49 and 71',
    actors: ['Provider', 'Authorised Representative', 'Importer'],
    state: 'REVIEW TIMELINE',
    summary:
      'Applicable high-risk systems require conformity assessment, an EU declaration of conformity, CE marking, and registration before market placement or use.',
    evidence: [
      'Conformity-assessment route',
      'Assessment evidence package',
      'Declaration of conformity',
      'CE-marking record',
      'Registration record',
      'Substantial-modification analysis',
    ],
    ta14: [
      'Conformity route record',
      'Evidence completeness gate',
      'Registration continuity',
      'Modification re-assessment route',
    ],
    route: '/eu-ai-act/high-risk',
  },
  {
    id: 'EU-AIA-013',
    family: 'Deployer Duties',
    title: 'Operate high-risk AI under deployer obligations',
    articles: 'Article 26',
    actors: ['Deployer', 'Public Authority'],
    state: 'REVIEW TIMELINE',
    summary:
      'Deployers must follow instructions, assign competent oversight, monitor operation, preserve logs where under their control, and act when risks or incidents arise.',
    evidence: [
      'Deployment and operating record',
      'Human oversight assignment',
      'Input-data relevance analysis',
      'Monitoring records',
      'Incident and suspension records',
      'Worker or affected-person notices where applicable',
    ],
    ta14: [
      'Deployment route',
      'Operator authority record',
      'Monitoring continuity',
      'Suspend and escalate outcome record',
    ],
    route: '/marketplace/routes',
  },
  {
    id: 'EU-AIA-014',
    family: 'Fundamental Rights',
    title: 'Perform a fundamental-rights impact assessment',
    articles: 'Article 27',
    actors: ['Deployer', 'Public Authority'],
    state: 'REVIEW TIMELINE',
    summary:
      'Certain deployers of high-risk AI systems must assess effects on fundamental rights before deployment and when material conditions change.',
    evidence: [
      'Process and context description',
      'Affected-person and group analysis',
      'Risk and harm pathways',
      'Oversight and mitigation measures',
      'Complaint and remedy pathways',
      'Review and notification record',
    ],
    ta14: [
      'Impact-assessment record',
      'Affected-party evidence',
      'Mitigation route',
      'Change-triggered reassessment',
    ],
    route: '/eu-ai-act/fundamental-rights',
  },
  {
    id: 'EU-AIA-015',
    family: 'Transparency',
    title: 'Meet Article 50 transparency obligations',
    articles: 'Article 50',
    actors: ['Provider', 'Deployer'],
    state: 'APPLIES 2026',
    summary:
      'Providers and deployers of certain AI systems must provide interaction notices, machine-readable marking, detectability, and specified content disclosures.',
    evidence: [
      'Applicability record',
      'Disclosure wording and timing',
      'Machine-readable marking evidence',
      'Detectability testing',
      'Deepfake or public-interest content record',
      'Exception and limitation analysis',
    ],
    ta14: [
      'Article 50 assessment',
      'Transparency implementation record',
      'Detectability evidence route',
      'Disclosure outcome record',
    ],
    route: '/eu-ai-act/article-50',
  },
  {
    id: 'EU-AIA-016',
    family: 'GPAI Models',
    title: 'Meet general-purpose AI model obligations',
    articles: 'Articles 51–56',
    actors: ['GPAI Provider', 'Provider'],
    state: 'IN FORCE',
    summary:
      'Providers of general-purpose AI models must maintain documentation, provide downstream information, implement copyright-policy measures, and publish training-content summaries, with additional duties for systemic-risk models.',
    evidence: [
      'Model technical documentation',
      'Downstream-provider information',
      'Copyright compliance policy',
      'Training-content summary',
      'Systemic-risk classification',
      'Evaluation, incident, and cybersecurity records',
    ],
    ta14: [
      'Model-governance registry',
      'Downstream evidence package',
      'Systemic-risk route',
      'Incident and mitigation records',
    ],
    route: '/ai-governance-registry',
  },
  {
    id: 'EU-AIA-017',
    family: 'Post-Market Monitoring',
    title: 'Operate post-market monitoring',
    articles: 'Article 72',
    actors: ['Provider'],
    state: 'REVIEW TIMELINE',
    summary:
      'Providers of high-risk systems must establish a proportionate post-market monitoring system that actively and systematically collects and analyses performance data.',
    evidence: [
      'Post-market monitoring plan',
      'Operational performance data',
      'Complaint and incident signals',
      'Trend and drift analysis',
      'Corrective-action record',
      'Updated risk-management evidence',
    ],
    ta14: [
      'Operational evidence stream',
      'Drift record',
      'Corrective-action route',
      'Updated outcome determination',
    ],
    route: '/records',
  },
  {
    id: 'EU-AIA-018',
    family: 'Serious Incidents',
    title: 'Report and manage serious incidents',
    articles: 'Article 73',
    actors: ['Provider', 'Deployer'],
    state: 'REVIEW TIMELINE',
    summary:
      'Providers must report serious incidents involving high-risk AI systems and preserve investigation, corrective action, and communication records.',
    evidence: [
      'Incident identity and chronology',
      'Severity assessment',
      'Authority notification',
      'Root-cause evidence',
      'Corrective and preventive action',
      'Closure and residual-risk record',
    ],
    ta14: [
      'Incident route',
      'Chronology and custody record',
      'Correction evidence',
      'Closure determination',
    ],
    route: '/marketplace/routes',
  },
];

const families = ['All', ...Array.from(new Set(requirements.map((item) => item.family)))];
const actorFilters = ['All', ...Array.from(new Set(requirements.flatMap((item) => item.actors)))];

const stateClass: Record<RequirementState, string> = {
  'IN FORCE': 'in-force',
  'APPLIES 2026': 'applies-2026',
  'APPLIES LATER': 'applies-later',
  'REVIEW TIMELINE': 'review-timeline',
};

export default function EuAiActRequirementsPage() {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('All');
  const [actor, setActor] = useState('All');
  const [state, setState] = useState<'All' | RequirementState>('All');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return requirements.filter((item) => {
      const queryMatch =
        !normalized ||
        [
          item.id,
          item.family,
          item.title,
          item.articles,
          item.summary,
          ...item.actors,
          ...item.evidence,
          ...item.ta14,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized);

      const familyMatch = family === 'All' || item.family === family;
      const actorMatch = actor === 'All' || item.actors.includes(actor as Actor);
      const stateMatch = state === 'All' || item.state === state;

      return queryMatch && familyMatch && actorMatch && stateMatch;
    });
  }, [actor, family, query, state]);

  return (
    <main className="page-shell">
      <div className="ambient" aria-hidden="true">
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="beam beam-one" />
        <span className="beam beam-two" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">TA-14 AI Governance Exchange</Link>
          <span>/</span>
          <Link href="/eu-ai-act">EU AI Act</Link>
          <span>/</span>
          <span>Requirements Registry</span>
        </nav>

        <header className="hero">
          <span className="eyebrow">EU AI ACT REQUIREMENTS REGISTRY</span>
          <h1>One place to inspect the obligation, actor, evidence, and governance route.</h1>
          <p className="hero-copy">
            This registry organises the EU AI Act into major requirement families without collapsing
            legal applicability, operational implementation, evidence, review, and outcome into a
            single checklist. Each entry shows what must be examined and how TA-14 can structure the
            corresponding evidence route.
          </p>

          <div className="boundary-banner">
            <strong>Requirements map, not legal advice.</strong>
            <p>
              This page is a front-end governance workspace. It does not determine whether a specific
              organisation or system is legally in scope, replace the official regulation or
              Commission guidance, or certify conformity.
            </p>
          </div>

          <div className="action-row">
            <a className="primary-button" href="#requirements-registry">
              Open requirements registry
            </a>
            <Link className="secondary-button" href="/eu-ai-act/article-50">
              Open Article 50 workspace
            </Link>
            <Link className="text-link" href="/marketplace/professionals">
              Find independent review
            </Link>
          </div>
        </header>

        <section className="summary-grid">
          <article>
            <span>Requirement records</span>
            <strong>{requirements.length}</strong>
            <p>Major obligation families represented in the current front-end registry.</p>
          </article>
          <article>
            <span>Actor categories</span>
            <strong>{actorFilters.length - 1}</strong>
            <p>Provider, deployer, supply-chain, GPAI, and public-authority pathways.</p>
          </article>
          <article>
            <span>Active focus</span>
            <strong>ARTICLE 50</strong>
            <p>Transparency obligations apply from 2 August 2026.</p>
          </article>
          <article>
            <span>Governance principle</span>
            <strong>SEPARATE LAYERS</strong>
            <p>Obligation, evidence, determination, review, execution, and outcome remain distinct.</p>
          </article>
        </section>

        <section className="registry-section" id="requirements-registry">
          <div className="section-heading">
            <span className="eyebrow">INSPECTABLE REQUIREMENTS</span>
            <h2>Filter by family, actor, status, evidence, or article.</h2>
          </div>

          <div className="filter-panel">
            <label className="search-field">
              <span>Search registry</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search article, requirement, actor, evidence, or TA-14 route"
              />
            </label>

            <label>
              <span>Requirement family</span>
              <select value={family} onChange={(event) => setFamily(event.target.value)}>
                {families.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Actor</span>
              <select value={actor} onChange={(event) => setActor(event.target.value)}>
                {actorFilters.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Application state</span>
              <select
                value={state}
                onChange={(event) =>
                  setState(event.target.value as 'All' | RequirementState)
                }
              >
                <option>All</option>
                <option>IN FORCE</option>
                <option>APPLIES 2026</option>
                <option>APPLIES LATER</option>
                <option>REVIEW TIMELINE</option>
              </select>
            </label>
          </div>

          <div className="results-meta">
            <span>{filtered.length} requirement record(s)</span>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFamily('All');
                setActor('All');
                setState('All');
              }}
            >
              Reset filters
            </button>
          </div>

          <div className="requirements-grid">
            {filtered.map((item) => (
              <article className="requirement-card" key={item.id}>
                <div className="card-topline">
                  <div>
                    <span>{item.family}</span>
                    <small>{item.id}</small>
                  </div>
                  <span className={`state-badge ${stateClass[item.state]}`}>{item.state}</span>
                </div>

                <p className="articles">{item.articles}</p>
                <h3>{item.title}</h3>
                <p className="summary">{item.summary}</p>

                <div className="actor-row">
                  {item.actors.map((itemActor) => (
                    <span key={itemActor}>{itemActor}</span>
                  ))}
                </div>

                <div className="detail-grid">
                  <div>
                    <span>Evidence to preserve</span>
                    <ul>
                      {item.evidence.map((evidence) => (
                        <li key={evidence}>{evidence}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span>TA-14 response pathway</span>
                    <ul>
                      {item.ta14.map((route) => (
                        <li key={route}>{route}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="card-actions">
                  <Link href={item.route}>Open related workspace</Link>
                  <Link href="/marketplace/opportunities">Post a review need</Link>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <h3>No requirement records match those filters.</h3>
              <p>Reset the registry or broaden the search terms.</p>
            </div>
          )}
        </section>

        <section className="architecture-section">
          <div className="section-heading">
            <span className="eyebrow">TA-14 REQUIREMENT ARCHITECTURE</span>
            <h2>Every requirement must remain traceable through the full route.</h2>
          </div>

          <div className="architecture-chain">
            {[
              ['01', 'Legal requirement', 'The article, annex, guidance, standard, or applicable rule.'],
              ['02', 'Actor and scope', 'Who is acting, which system is involved, and why the requirement applies.'],
              ['03', 'Evidence package', 'The records, tests, declarations, logs, controls, and versions supporting the claim.'],
              ['04', 'Determination', 'A bounded conclusion tied to identified rules and evidence.'],
              ['05', 'Independent review', 'Challenge, correction, escalation, confirmation, and visible limitations.'],
              ['06', 'Execution and outcome', 'What was approved, held, denied, changed, reported, or preserved.'],
            ].map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="connected-section">
          <div className="section-heading">
            <span className="eyebrow">CONNECTED EU AI ACT WORKSPACES</span>
            <h2>The registry is the index. Each requirement needs an operational route.</h2>
          </div>

          <div className="connected-grid">
            <Link href="/eu-ai-act/article-50">
              <span>01</span>
              <h3>Article 50 Transparency</h3>
              <p>Assess actor role, content type, disclosure pathway, marking, and evidence readiness.</p>
            </Link>
            <Link href="/eu-ai-act/high-risk">
              <span>02</span>
              <h3>High-Risk Systems</h3>
              <p>Map classification, lifecycle duties, conformity, deployer responsibilities, and monitoring.</p>
            </Link>
            <Link href="/eu-ai-act/fundamental-rights">
              <span>03</span>
              <h3>Fundamental Rights</h3>
              <p>Structure affected-party analysis, harm pathways, mitigation, oversight, and reassessment.</p>
            </Link>
            <Link href="/ai-governance-registry">
              <span>04</span>
              <h3>AI Governance Registry</h3>
              <p>Preserve system identity, governance identity, versions, claims, evidence, and stewardship.</p>
            </Link>
            <Link href="/marketplace/professionals">
              <span>05</span>
              <h3>Independent Review</h3>
              <p>Find professionals through declared expertise, evidence signals, artifacts, and limitations.</p>
            </Link>
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</span>
          <h2>A requirement list is only the beginning of the governance route.</h2>
          <p>
            The organisation must still establish what applies, what evidence exists, what is missing,
            who has authority, what was independently reviewed, what changed, and what outcome the
            evidence can support.
          </p>

          <div className="action-row centered">
            <a className="primary-button" href="#requirements-registry">
              Inspect requirements
            </a>
            <Link className="secondary-button" href="/marketplace/routes">
              Open governance routes
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
          color: #eef8ff;
          background: #06101b;
        }

        :global(a) {
          color: inherit;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .page-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(rgba(4, 14, 24, 0.82), rgba(4, 14, 24, 0.98)),
            radial-gradient(circle at 12% 5%, rgba(18, 132, 174, 0.21), transparent 32%),
            radial-gradient(circle at 88% 9%, rgba(74, 61, 175, 0.16), transparent 31%);
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
          opacity: 0.68;
        }

        .star {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #87e7f9;
          box-shadow: 0 0 22px rgba(91, 215, 243, 0.95);
          animation: drift 12s ease-in-out infinite;
        }

        .star-one {
          top: 14%;
          right: 11%;
        }

        .star-two {
          top: 49%;
          left: 8%;
          animation-delay: -4s;
        }

        .star-three {
          bottom: 15%;
          right: 18%;
          animation-delay: -8s;
        }

        .beam {
          position: absolute;
          width: 46vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79, 205, 234, 0.3), transparent);
          animation: pulse 8s ease-in-out infinite;
        }

        .beam-one {
          top: 23%;
          left: -5%;
          transform: rotate(-16deg);
        }

        .beam-two {
          bottom: 21%;
          right: -8%;
          transform: rotate(20deg);
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

        .eyebrow {
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
        p {
          margin-top: 0;
        }

        .hero {
          max-width: 1030px;
          padding-bottom: 70px;
        }

        h1 {
          margin: 18px 0 24px;
          font-size: clamp(3.1rem, 7vw, 6.75rem);
          line-height: 0.95;
          letter-spacing: -0.058em;
        }

        .hero-copy {
          max-width: 930px;
          color: #b5cbd6;
          font-size: 1.09rem;
          line-height: 1.8;
        }

        .boundary-banner {
          margin-top: 27px;
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

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          padding-bottom: 82px;
        }

        .summary-grid article {
          min-height: 190px;
          padding: 21px;
          border: 1px solid rgba(103, 194, 218, 0.16);
          border-radius: 20px;
          background: rgba(9, 29, 44, 0.74);
        }

        .summary-grid span {
          color: #7899a8;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .summary-grid strong {
          display: block;
          margin: 40px 0 11px;
          font-size: 1.4rem;
        }

        .summary-grid p {
          color: #91aab5;
          line-height: 1.57;
        }

        .registry-section,
        .architecture-section,
        .connected-section {
          padding-top: 82px;
        }

        .section-heading {
          max-width: 940px;
          margin-bottom: 28px;
        }

        .section-heading h2 {
          margin: 12px 0 0;
          font-size: clamp(2.3rem, 5vw, 4.6rem);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .filter-panel {
          display: grid;
          grid-template-columns: 1.6fr repeat(3, minmax(160px, 0.7fr));
          gap: 12px;
          padding: 24px;
          border: 1px solid rgba(103, 194, 220, 0.18);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(14, 38, 55, 0.94), rgba(7, 23, 36, 0.91));
        }

        label > span {
          display: block;
          margin-bottom: 8px;
          color: #7899a7;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        input,
        select {
          width: 100%;
          min-height: 46px;
          border: 1px solid rgba(130, 207, 227, 0.22);
          border-radius: 13px;
          padding: 11px 13px;
          color: #f5fbff;
          background: rgba(4, 16, 27, 0.82);
          outline: none;
        }

        select option {
          color: #eaf7fb;
          background: #091b2a;
        }

        input:focus,
        select:focus {
          border-color: #70d8ef;
          box-shadow: 0 0 0 3px rgba(76, 198, 227, 0.13);
        }

        input::placeholder {
          color: #648091;
        }

        .results-meta {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: center;
          padding: 18px 4px;
          color: #7f9cab;
          font-size: 0.82rem;
        }

        .results-meta button {
          border: 0;
          color: #92d5e5;
          background: transparent;
          cursor: pointer;
          font-weight: 850;
        }

        .requirements-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 17px;
        }

        .requirement-card {
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
          gap: 14px;
          align-items: flex-start;
        }

        .card-topline > div {
          display: grid;
          gap: 5px;
        }

        .card-topline > div > span {
          color: #83d5e7;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .card-topline small {
          color: #678492;
        }

        .state-badge {
          border-radius: 999px;
          padding: 7px 9px;
          font-size: 0.64rem;
          font-weight: 950;
          letter-spacing: 0.07em;
          white-space: nowrap;
        }

        .state-badge.in-force {
          color: #8cebc3;
          background: rgba(45, 163, 113, 0.11);
        }

        .state-badge.applies-2026 {
          color: #ffe09a;
          background: rgba(184, 131, 27, 0.12);
        }

        .state-badge.applies-later,
        .state-badge.review-timeline {
          color: #a7dcff;
          background: rgba(52, 129, 178, 0.11);
        }

        .articles {
          margin: 24px 0 8px;
          color: #e4c76f;
          font-size: 0.82rem;
          font-weight: 850;
        }

        .requirement-card h3 {
          margin-bottom: 12px;
          font-size: 1.55rem;
          letter-spacing: -0.025em;
        }

        .summary {
          color: #a5bac4;
          line-height: 1.67;
        }

        .actor-row {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin: 5px 0 17px;
        }

        .actor-row span {
          border-radius: 999px;
          padding: 7px 9px;
          color: #82a9b6;
          background: rgba(255, 255, 255, 0.035);
          font-size: 0.69rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .detail-grid > div {
          padding: 16px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.027);
        }

        .detail-grid > div > span {
          color: #79a8b6;
          font-size: 0.69rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .detail-grid ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9fb5bf;
          line-height: 1.64;
        }

        .card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: auto;
          padding-top: 22px;
        }

        .card-actions a {
          border: 1px solid rgba(120, 202, 224, 0.2);
          border-radius: 999px;
          padding: 11px 14px;
          color: #dff7fd;
          background: rgba(255, 255, 255, 0.025);
          font-size: 0.8rem;
          font-weight: 850;
          text-decoration: none;
        }

        .card-actions a:first-child {
          border-color: transparent;
          color: #04121a;
          background: #75dced;
        }

        .empty-state {
          margin-top: 18px;
          padding: 45px 24px;
          border: 1px dashed rgba(127, 199, 219, 0.22);
          border-radius: 22px;
          color: #849fab;
          text-align: center;
        }

        .architecture-chain {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
        }

        .architecture-chain article,
        .connected-grid a {
          min-height: 235px;
          padding: 20px;
          border: 1px solid rgba(103, 194, 220, 0.15);
          border-radius: 19px;
          background: rgba(10, 30, 45, 0.72);
        }

        .architecture-chain article > span,
        .connected-grid a > span {
          color: #5ed0e9;
          font-size: 0.74rem;
        }

        .architecture-chain h3,
        .connected-grid h3 {
          margin: 48px 0 10px;
          font-size: 1.17rem;
        }

        .architecture-chain p,
        .connected-grid p {
          color: #94abb6;
          line-height: 1.58;
        }

        .connected-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 11px;
        }

        .connected-grid a {
          text-decoration: none;
        }

        .connected-grid a:hover {
          border-color: rgba(103, 194, 220, 0.42);
          background: rgba(20, 53, 73, 0.78);
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

        .centered {
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

        @media (max-width: 1080px) {
          .summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .filter-panel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .search-field {
            grid-column: 1 / -1;
          }

          .architecture-chain {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .connected-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 790px) {
          .requirements-grid,
          .connected-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 620px) {
          .content-shell {
            width: min(100% - 24px, 1220px);
            padding-top: 22px;
          }

          .breadcrumbs {
            margin-bottom: 42px;
          }

          .summary-grid,
          .filter-panel,
          .architecture-chain,
          .detail-grid {
            grid-template-columns: 1fr;
          }

          .search-field {
            grid-column: auto;
          }

          .results-meta {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) {
            scroll-behavior: auto;
          }

          .star,
          .beam {
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
