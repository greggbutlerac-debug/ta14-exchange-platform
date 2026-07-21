'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type StatusTone = 'law' | 'guidance' | 'voluntary' | 'ta14';

type SectionCard = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  articles: string;
  tone: 'blue' | 'purple' | 'green' | 'gold' | 'red' | 'navy';
  status: StatusTone;
  bullets: string[];
};

const SECTIONS: SectionCard[] = [
  {
    id: 'scope-definitions',
    title: 'Scope + Definitions',
    eyebrow: 'Start here',
    summary:
      'Determine whether the EU AI Act reaches the system, model, organization, output, or activity.',
    articles: 'Articles 1-4',
    tone: 'blue',
    status: 'law',
    bullets: [
      'Territorial reach',
      'AI-system definition',
      'Excluded activities',
      'AI literacy',
    ],
  },
  {
    id: 'prohibited-practices',
    title: 'Prohibited Practices',
    eyebrow: 'Article 5',
    summary:
      'Screen the intended practice against each prohibition and any narrow statutory exception.',
    articles: 'Article 5',
    tone: 'red',
    status: 'law',
    bullets: [
      'Manipulation and exploitation',
      'Social scoring',
      'Predictive policing',
      'Biometric and emotion-recognition restrictions',
    ],
  },
  {
    id: 'high-risk-classification',
    title: 'High-Risk Classification',
    eyebrow: 'Classify the system',
    summary:
      'Walk through Annex I, Annex III, intended purpose, and the Article 6 exclusion analysis.',
    articles: 'Articles 6-7',
    tone: 'gold',
    status: 'law',
    bullets: [
      'Product-safety route',
      'Annex III use-case route',
      'Article 6(3) analysis',
      'Classification record',
    ],
  },
  {
    id: 'high-risk-requirements',
    title: 'High-Risk Requirements',
    eyebrow: 'Build the controls',
    summary:
      'Open each lifecycle obligation as a governance workspace instead of treating it as a checklist.',
    articles: 'Articles 8-15',
    tone: 'purple',
    status: 'law',
    bullets: [
      'Risk management',
      'Data governance',
      'Technical documentation and logging',
      'Human oversight, accuracy, robustness, cybersecurity',
    ],
  },
  {
    id: 'provider-deployer',
    title: 'Provider + Deployer Duties',
    eyebrow: 'Role-specific',
    summary:
      'Separate provider, deployer, importer, distributor, representative, and product-manufacturer duties.',
    articles: 'Articles 16-27',
    tone: 'navy',
    status: 'law',
    bullets: [
      'Provider obligations',
      'Value-chain handoffs',
      'Deployer monitoring and notices',
      'Fundamental Rights Impact Assessment',
    ],
  },
  {
    id: 'conformity-registration',
    title: 'Conformity + Registration',
    eyebrow: 'Before market or service',
    summary:
      'Understand conformity assessment, declarations, CE marking, registration, and reassessment triggers.',
    articles: 'Articles 43-49',
    tone: 'green',
    status: 'law',
    bullets: [
      'Assessment pathway',
      'EU declaration of conformity',
      'CE marking',
      'EU database registration',
    ],
  },
  {
    id: 'article-50',
    title: 'Article 50 Transparency',
    eyebrow: 'Applies from 2 August 2026',
    summary:
      'Design interaction notices, machine-readable marking, deepfake disclosure, and public-interest text disclosure.',
    articles: 'Article 50',
    tone: 'gold',
    status: 'guidance',
    bullets: [
      'Provider-side design duties',
      'Deployer-side disclosure duties',
      'Exceptions and accessibility',
      'Transparency Record and evidence map',
    ],
  },
  {
    id: 'gpai',
    title: 'General-Purpose AI',
    eyebrow: 'Model governance',
    summary:
      'Separate obligations for all GPAI providers from additional systemic-risk obligations.',
    articles: 'Articles 51-56',
    tone: 'purple',
    status: 'guidance',
    bullets: [
      'Technical documentation',
      'Downstream information package',
      'Copyright policy and training summary',
      'Systemic-risk evaluation, incidents, and cybersecurity',
    ],
  },
  {
    id: 'post-market',
    title: 'Post-Market + Incidents',
    eyebrow: 'After deployment',
    summary:
      'Build monitoring, corrective-action, evidence-preservation, and serious-incident reporting workflows.',
    articles: 'Articles 72-73',
    tone: 'blue',
    status: 'law',
    bullets: [
      'Monitoring plan',
      'Signals and trends',
      'Corrective actions',
      'Serious-incident triage and reporting',
    ],
  },
  {
    id: 'governance-enforcement',
    title: 'Governance + Enforcement',
    eyebrow: 'Institutions and powers',
    summary:
      'Explore the AI Office, AI Board, national authorities, sandboxes, enforcement, and penalties.',
    articles: 'Articles 57-101',
    tone: 'red',
    status: 'law',
    bullets: [
      'Regulatory sandboxes',
      'European and national governance',
      'Market surveillance',
      'Penalty pathways and proportionality',
    ],
  },
  {
    id: 'annexes-tools',
    title: 'Annexes + Implementing Tools',
    eyebrow: 'Deep reference',
    summary:
      'Navigate Annexes, templates, codes, standards, FAQs, and implementation materials by legal status.',
    articles: 'Annexes I-XIII',
    tone: 'green',
    status: 'voluntary',
    bullets: [
      'Annex classification paths',
      'Technical-documentation structure',
      'Codes and templates',
      'Harmonised standards and common specifications',
    ],
  },
  {
    id: 'ta14-route',
    title: 'Build a TA-14 Route',
    eyebrow: 'Governance action layer',
    summary:
      'Turn selected legal requirements into evidence-bound records, routes, tests, reviews, and receipts.',
    articles: 'TA-14 interpretation layer',
    tone: 'navy',
    status: 'ta14',
    bullets: [
      'Save requirement',
      'Map evidence',
      'Run readiness check',
      'Test, review, and preserve receipt',
    ],
  },
];

const TONE_CLASS: Record<SectionCard['tone'], string> = {
  blue: 'eu-card--blue',
  purple: 'eu-card--purple',
  green: 'eu-card--green',
  gold: 'eu-card--gold',
  red: 'eu-card--red',
  navy: 'eu-card--navy',
};

const STATUS_LABEL: Record<StatusTone, string> = {
  law: 'ENACTED LAW',
  guidance: 'ADOPTED GUIDANCE + LAW',
  voluntary: 'LAW + IMPLEMENTING TOOLS',
  ta14: 'TA-14 INTERPRETATION',
};

const ROLE_OPTIONS = [
  'Provider',
  'Deployer',
  'Importer',
  'Distributor',
  'Authorised representative',
  'Product manufacturer',
  'GPAI provider',
  'Public authority',
];

const SYSTEM_OPTIONS = [
  'Chatbot or assistant',
  'Hiring or employment AI',
  'Education AI',
  'Biometric system',
  'Healthcare AI',
  'Critical-infrastructure AI',
  'Public-service AI',
  'GPAI model',
  'Content generator',
  'Custom system',
];

export default function EuAiActWorkspacePage() {
  const [selectedId, setSelectedId] = useState(SECTIONS[0].id);
  const [role, setRole] = useState('Provider');
  const [system, setSystem] = useState('Chatbot or assistant');
  const [euUse, setEuUse] = useState(true);
  const [affectsPeople, setAffectsPeople] = useState(true);

  const selected = useMemo(
    () => SECTIONS.find((section) => section.id === selectedId) ?? SECTIONS[0],
    [selectedId],
  );

  const likelyPaths = useMemo(() => {
    const paths = ['Scope + Definitions'];

    if (system.includes('Biometric')) paths.push('Prohibited Practices', 'High-Risk Classification');
    if (system.includes('Hiring') || system.includes('Education') || system.includes('Critical')) {
      paths.push('High-Risk Classification', 'High-Risk Requirements');
    }
    if (system.includes('GPAI')) paths.push('General-Purpose AI');
    if (system.includes('Content') || system.includes('Chatbot')) paths.push('Article 50 Transparency');
    if (role === 'Public authority') paths.push('Provider + Deployer Duties', 'Governance + Enforcement');
    if (euUse && affectsPeople) paths.push('Build a TA-14 Route');

    return Array.from(new Set(paths));
  }, [affectsPeople, euUse, role, system]);

  return (
    <main className="eu-shell">
      <div className="eu-space" aria-hidden="true">
        <span className="eu-orbit eu-orbit--one" />
        <span className="eu-orbit eu-orbit--two" />
        <span className="eu-line eu-line--one" />
        <span className="eu-line eu-line--two" />
        {Array.from({ length: 34 }).map((_, index) => (
          <span
            className="eu-star"
            key={index}
            style={
              {
                '--x': `${(index * 37) % 100}%`,
                '--y': `${(index * 61) % 100}%`,
                '--delay': `${(index % 9) * -0.55}s`,
                '--size': `${2 + (index % 3)}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <section className="eu-hero">
        <nav className="eu-breadcrumb" aria-label="Breadcrumb">
          <Link href="/workspace">Workspace</Link>
          <span>/</span>
          <span>EU AI Act</span>
        </nav>

        <div className="eu-kicker">TA-14 AI GOVERNANCE EXCHANGE</div>
        <h1>Understand the EU AI Act by building through it.</h1>
        <p className="eu-hero-copy">
          Choose what you are building or using. This laboratory identifies likely roles,
          risk pathways, controlling provisions, evidence expectations, deadlines, and the
          next governed action.
        </p>

        <div className="eu-hero-actions">
          <button type="button" onClick={() => document.getElementById('eu-wizard')?.scrollIntoView({ behavior: 'smooth' })}>
            Start the wizard
          </button>
          <button
            type="button"
            className="eu-button--secondary"
            onClick={() => document.getElementById('eu-sections')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Browse every section
          </button>
        </div>

        <div className="eu-boundary">
          <strong>Governance boundary</strong>
          <span>
            This playground explains, organizes, maps, and tests governance evidence. It does
            not provide legal advice, certification, conformity assessment, or a regulator's
            determination.
          </span>
        </div>
      </section>

      <section className="eu-wizard" id="eu-wizard" aria-labelledby="eu-wizard-heading">
        <div className="eu-section-heading">
          <div>
            <span className="eu-eyebrow">Interactive starting point</span>
            <h2 id="eu-wizard-heading">What are you building or using?</h2>
          </div>
          <span className="eu-status eu-status--ta14">TA-14 INTERPRETATION</span>
        </div>

        <div className="eu-wizard-grid">
          <label>
            <span>System or model</span>
            <select value={system} onChange={(event) => setSystem(event.target.value)}>
              {SYSTEM_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Your role</span>
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              {ROLE_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="eu-toggle-row">
            <input type="checkbox" checked={euUse} onChange={(event) => setEuUse(event.target.checked)} />
            <span>
              <strong>EU connection</strong>
              The system is placed on the EU market, used in the EU, or produces outputs used in the EU.
            </span>
          </label>

          <label className="eu-toggle-row">
            <input
              type="checkbox"
              checked={affectsPeople}
              onChange={(event) => setAffectsPeople(event.target.checked)}
            />
            <span>
              <strong>Affects people or consequential decisions</strong>
              The system influences access, employment, education, services, safety, rights, or public information.
            </span>
          </label>
        </div>

        <div className="eu-output">
          <div>
            <span className="eu-eyebrow">Preliminary navigation only</span>
            <h3>Likely paths to inspect</h3>
          </div>
          <div className="eu-chip-row">
            {likelyPaths.map((path) => (
              <button
                type="button"
                className="eu-chip"
                key={path}
                onClick={() => {
                  const match = SECTIONS.find((section) => section.title === path);
                  if (match) {
                    setSelectedId(match.id);
                    document.getElementById('eu-detail')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {path}
              </button>
            ))}
          </div>
          <p>
            This result is bounded by the facts selected above. Missing information, changed intended purpose,
            rebranding, substantial modification, or a different value-chain role can change the pathway.
          </p>
        </div>
      </section>

      <section className="eu-sections" id="eu-sections" aria-labelledby="eu-sections-heading">
        <div className="eu-section-heading">
          <div>
            <span className="eu-eyebrow">Every major requirement family</span>
            <h2 id="eu-sections-heading">Open an EU AI Act workspace</h2>
          </div>
          <span className="eu-updated">Source set checked: 21 July 2026</span>
        </div>

        <div className="eu-card-grid">
          {SECTIONS.map((section) => (
            <button
              type="button"
              key={section.id}
              className={`eu-card ${TONE_CLASS[section.tone]} ${selectedId === section.id ? 'eu-card--active' : ''}`}
              onClick={() => {
                setSelectedId(section.id);
                requestAnimationFrame(() => {
                  document.getElementById('eu-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
              }}
            >
              <span className="eu-card-eyebrow">{section.eyebrow}</span>
              <strong>{section.title}</strong>
              <span>{section.summary}</span>
              <small>{section.articles}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="eu-detail" id="eu-detail" aria-live="polite">
        <div className="eu-detail-topline">
          <span className={`eu-status eu-status--${selected.status}`}>{STATUS_LABEL[selected.status]}</span>
          <span>{selected.articles}</span>
        </div>

        <div className="eu-detail-grid">
          <div>
            <span className="eu-eyebrow">Specialized understanding</span>
            <h2>{selected.title}</h2>
            <p>{selected.summary}</p>

            <ul>
              {selected.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>

          <aside className="eu-action-panel">
            <h3>Available governed actions</h3>
            <button type="button">Save requirement</button>
            <button type="button">Map evidence</button>
            <button type="button">Build route</button>
            <button type="button">Run readiness check</button>
            <button type="button">Preserve receipt</button>
            <p>
              These controls are demonstration actions in this first file. They establish the interface without
              inventing storage, review, or cryptographic capabilities that are not yet connected.
            </p>
          </aside>
        </div>

        <div className="eu-workspace-template">
          {[
            ['Plain-language answer', 'What this provision governs and why it matters.'],
            ['Controlling law', 'Article, paragraph, point, linked Recitals, definitions, and Annexes.'],
            ['Who is affected', 'Role-specific applicability and value-chain duties.'],
            ['Applicability test', 'Likely applies, likely not, or requires review - with assumptions.'],
            ['Exceptions and boundaries', 'Exemptions, narrow exceptions, and evidence needed to rely on them.'],
            ['Evidence expectation', 'Policies, logs, datasets, tests, notices, assessments, and records.'],
            ['TA-14 route', 'Requirement -> facts -> role -> evidence -> review -> decision -> test -> receipt.'],
          ].map(([title, text]) => (
            <div key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="eu-footer">
        <div>
          <strong>No admissible evidence. No admissible execution.</strong>
          <span>
            The next file should turn the first selected workspace into its own dedicated route without breaking this hub.
          </span>
        </div>
        <Link href="/workspace">Return to Workspace</Link>
      </footer>

      <style jsx>{`
        :global(body) {
          background: #06111f;
        }

        .eu-shell {
          --ink: #eff8ff;
          --muted: #a9bfd2;
          --line: rgba(120, 213, 235, 0.25);
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--ink);
          background:
            radial-gradient(circle at 12% 8%, rgba(31, 132, 176, 0.28), transparent 28%),
            radial-gradient(circle at 88% 18%, rgba(100, 69, 191, 0.22), transparent 24%),
            linear-gradient(180deg, #071827 0%, #06111f 52%, #030a12 100%);
          padding: 28px clamp(18px, 4vw, 64px) 56px;
        }

        .eu-space {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          opacity: 0.72;
        }

        .eu-star {
          position: absolute;
          left: var(--x);
          top: var(--y);
          width: var(--size);
          height: var(--size);
          border-radius: 999px;
          background: rgba(220, 248, 255, 0.82);
          box-shadow: 0 0 12px rgba(115, 224, 255, 0.82);
          animation: twinkle 5.5s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .eu-orbit {
          position: absolute;
          width: 460px;
          height: 460px;
          border: 1px solid rgba(89, 204, 231, 0.12);
          border-radius: 50%;
          animation: orbit 28s linear infinite;
        }

        .eu-orbit::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #69dcf4;
          top: 50%;
          left: -5px;
          box-shadow: 0 0 18px #69dcf4;
        }

        .eu-orbit--one {
          right: -180px;
          top: 90px;
        }

        .eu-orbit--two {
          left: -260px;
          bottom: -150px;
          width: 620px;
          height: 620px;
          animation-direction: reverse;
          animation-duration: 36s;
        }

        .eu-line {
          position: absolute;
          height: 1px;
          width: 42vw;
          background: linear-gradient(90deg, transparent, rgba(93, 217, 242, 0.7), transparent);
          animation: drift 12s ease-in-out infinite;
        }

        .eu-line--one {
          top: 24%;
          left: -20%;
          transform: rotate(16deg);
        }

        .eu-line--two {
          bottom: 24%;
          right: -20%;
          transform: rotate(-14deg);
          animation-delay: -5s;
        }

        .eu-hero,
        .eu-wizard,
        .eu-sections,
        .eu-detail,
        .eu-footer {
          position: relative;
          z-index: 1;
          width: min(1180px, 100%);
          margin-inline: auto;
        }

        .eu-hero {
          padding: 28px 0 54px;
        }

        .eu-breadcrumb {
          display: flex;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--muted);
          margin-bottom: 38px;
        }

        .eu-breadcrumb a {
          color: #79dff2;
          text-decoration: none;
        }

        .eu-kicker,
        .eu-eyebrow {
          color: #77dff4;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.76rem;
          font-weight: 800;
        }

        h1 {
          max-width: 920px;
          font-size: clamp(2.65rem, 7vw, 6.2rem);
          line-height: 0.96;
          letter-spacing: -0.045em;
          margin: 14px 0 24px;
        }

        .eu-hero-copy {
          max-width: 790px;
          font-size: clamp(1.05rem, 2vw, 1.3rem);
          line-height: 1.7;
          color: var(--muted);
        }

        .eu-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin: 30px 0;
        }

        button,
        select,
        a {
          font: inherit;
        }

        .eu-hero-actions button,
        .eu-action-panel button {
          border: 1px solid rgba(121, 223, 242, 0.6);
          color: #04111a;
          background: linear-gradient(135deg, #79e1f4, #40b9d5);
          border-radius: 999px;
          padding: 13px 20px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .eu-hero-actions button:hover,
        .eu-action-panel button:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px rgba(69, 196, 222, 0.24);
        }

        .eu-hero-actions .eu-button--secondary {
          color: var(--ink);
          background: rgba(255, 255, 255, 0.035);
        }

        .eu-boundary {
          display: grid;
          gap: 8px;
          max-width: 890px;
          padding: 18px 20px;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: rgba(7, 28, 43, 0.72);
          backdrop-filter: blur(16px);
        }

        .eu-boundary span,
        .eu-output p,
        .eu-action-panel p,
        .eu-footer span {
          color: var(--muted);
          line-height: 1.6;
        }

        .eu-wizard,
        .eu-sections,
        .eu-detail {
          padding: 34px;
          border: 1px solid var(--line);
          border-radius: 28px;
          background: rgba(5, 21, 34, 0.78);
          backdrop-filter: blur(20px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
          margin-bottom: 28px;
        }

        .eu-section-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 24px;
        }

        h2 {
          font-size: clamp(1.9rem, 4vw, 3.3rem);
          line-height: 1.06;
          letter-spacing: -0.03em;
          margin: 8px 0 0;
        }

        .eu-status,
        .eu-updated {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          border-radius: 999px;
          padding: 6px 11px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          white-space: nowrap;
        }

        .eu-status--law {
          background: rgba(67, 164, 111, 0.18);
          color: #9ff3bd;
          border: 1px solid rgba(100, 221, 152, 0.34);
        }

        .eu-status--guidance {
          background: rgba(199, 145, 21, 0.18);
          color: #ffd87a;
          border: 1px solid rgba(235, 181, 45, 0.34);
        }

        .eu-status--voluntary {
          background: rgba(112, 85, 201, 0.18);
          color: #cbbcff;
          border: 1px solid rgba(156, 132, 244, 0.34);
        }

        .eu-status--ta14 {
          background: rgba(58, 177, 213, 0.18);
          color: #9eeaff;
          border: 1px solid rgba(96, 213, 239, 0.34);
        }

        .eu-updated {
          color: #a9bfd2;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .eu-wizard-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .eu-wizard-grid label {
          display: grid;
          gap: 9px;
          color: #dcebf4;
          font-weight: 700;
        }

        select {
          width: 100%;
          min-height: 50px;
          border-radius: 14px;
          border: 1px solid rgba(124, 214, 235, 0.26);
          background: #0b2233;
          color: var(--ink);
          padding: 0 14px;
        }

        .eu-toggle-row {
          grid-template-columns: auto 1fr;
          align-items: start;
          padding: 16px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .eu-toggle-row input {
          width: 20px;
          height: 20px;
          accent-color: #67d4ed;
          margin-top: 2px;
        }

        .eu-toggle-row span {
          display: grid;
          gap: 5px;
          color: var(--muted);
          line-height: 1.45;
          font-weight: 500;
        }

        .eu-toggle-row strong {
          color: var(--ink);
        }

        .eu-output {
          margin-top: 20px;
          padding: 20px;
          border-radius: 18px;
          background: rgba(35, 129, 157, 0.1);
          border: 1px solid rgba(95, 210, 235, 0.2);
        }

        .eu-output h3,
        .eu-action-panel h3 {
          margin: 5px 0 14px;
          font-size: 1.25rem;
        }

        .eu-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .eu-chip {
          border: 1px solid rgba(111, 219, 239, 0.28);
          border-radius: 999px;
          color: #c9f5ff;
          background: rgba(71, 188, 213, 0.1);
          padding: 9px 12px;
          cursor: pointer;
        }

        .eu-card-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .eu-card {
          min-height: 215px;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
          padding: 20px;
          color: white;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          cursor: pointer;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }

        .eu-card:hover,
        .eu-card--active {
          transform: translateY(-4px);
          border-color: rgba(190, 239, 250, 0.72);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.26);
        }

        .eu-card--blue { background: linear-gradient(145deg, #167aaa, #0d4e70); }
        .eu-card--purple { background: linear-gradient(145deg, #7253d8, #3b277d); }
        .eu-card--green { background: linear-gradient(145deg, #249362, #11533c); }
        .eu-card--gold { background: linear-gradient(145deg, #d59208, #7f5200); }
        .eu-card--red { background: linear-gradient(145deg, #c64a4d, #7b242b); }
        .eu-card--navy { background: linear-gradient(145deg, #153e60, #081e31); }

        .eu-card-eyebrow {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.78;
          font-weight: 800;
        }

        .eu-card strong {
          font-size: 1.35rem;
          line-height: 1.1;
        }

        .eu-card span:not(.eu-card-eyebrow) {
          color: rgba(255, 255, 255, 0.84);
          line-height: 1.5;
        }

        .eu-card small {
          color: rgba(255, 255, 255, 0.68);
          font-weight: 700;
        }

        .eu-detail-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          color: var(--muted);
          margin-bottom: 20px;
        }

        .eu-detail-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
          gap: 28px;
        }

        .eu-detail-grid p {
          color: var(--muted);
          font-size: 1.06rem;
          line-height: 1.65;
        }

        .eu-detail-grid ul {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          padding: 0;
          list-style: none;
          margin-top: 22px;
        }

        .eu-detail-grid li {
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.035);
        }

        .eu-action-panel {
          display: grid;
          align-content: start;
          gap: 10px;
          padding: 20px;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .eu-action-panel button {
          width: 100%;
          border-radius: 12px;
          padding: 11px 14px;
        }

        .eu-workspace-template {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 28px;
        }

        .eu-workspace-template div {
          display: grid;
          gap: 5px;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .eu-workspace-template span {
          color: var(--muted);
          line-height: 1.45;
        }

        .eu-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 24px 0 0;
        }

        .eu-footer div {
          display: grid;
          gap: 5px;
        }

        .eu-footer strong {
          font-size: 1.2rem;
        }

        .eu-footer a {
          color: #8ce6f7;
          text-decoration: none;
          font-weight: 800;
          white-space: nowrap;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.28; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.35); }
        }

        @keyframes orbit {
          to { transform: rotate(360deg); }
        }

        @keyframes drift {
          0%, 100% { transform: translateX(0) rotate(16deg); opacity: 0.25; }
          50% { transform: translateX(42vw) rotate(16deg); opacity: 0.85; }
        }

        @media (max-width: 900px) {
          .eu-card-grid,
          .eu-detail-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .eu-action-panel {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 680px) {
          .eu-shell {
            padding-inline: 14px;
          }

          .eu-wizard,
          .eu-sections,
          .eu-detail {
            padding: 22px;
            border-radius: 20px;
          }

          .eu-section-heading,
          .eu-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .eu-wizard-grid,
          .eu-card-grid,
          .eu-detail-grid,
          .eu-detail-grid ul,
          .eu-workspace-template {
            grid-template-columns: 1fr;
          }

          .eu-card {
            min-height: 190px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </main>
  );
}
