'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type RegistryStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Registered'
  | 'Disputed'
  | 'Superseded'
  | 'Withdrawn'
  | 'Archived';

type PillTone = 'blue' | 'gold' | 'green' | 'violet' | 'red' | 'slate';

const STATUS_TONES: Record<RegistryStatus, PillTone> = {
  Submitted: 'blue',
  'Under Review': 'gold',
  Registered: 'green',
  Disputed: 'red',
  Superseded: 'violet',
  Withdrawn: 'slate',
  Archived: 'slate',
};

const REGISTRY_FIELDS = [
  ['Identity', 'Governance name, registry identifier, version, category, steward, and contact route.'],
  ['Scope', 'What the architecture claims to govern, where it applies, and which actors or systems it covers.'],
  ['Claims', 'Precisely stated governance, evidence, review, runtime, and execution claims.'],
  ['Non-claims', 'What the submission does not establish, certify, guarantee, or authorize.'],
  ['Evidence', 'Supporting publications, repositories, demonstrations, standards mappings, filings, and records.'],
  ['Provenance', 'Who submitted the record, when it was submitted, what changed, and which source produced each assertion.'],
  ['Lifecycle', 'Current status, effective dates, previous versions, superseding versions, disputes, withdrawals, and archival state.'],
  ['Rights', 'Ownership, licensing, attribution, permitted use, confidentiality, and disclosure declarations.'],
];

const LEGITIMACY_CONTROLS = [
  {
    number: '01',
    title: 'Persistent identity',
    text: 'Every accepted record receives a stable TA-14 registry identifier that does not change when descriptive metadata is updated.',
  },
  {
    number: '02',
    title: 'Immutable event history',
    text: 'Submission, review, amendment, dispute, supersession, withdrawal, and archival events remain visible as a dated chain.',
  },
  {
    number: '03',
    title: 'Attributable provenance',
    text: 'Records distinguish the claimant, submitter, steward, reviewer, evidence source, and system-generated events.',
  },
  {
    number: '04',
    title: 'Version integrity',
    text: 'Material changes create a new version connected to the prior version rather than silently rewriting history.',
  },
  {
    number: '05',
    title: 'Claims and non-claims',
    text: 'Every record separates affirmative claims from limitations so registration cannot be mistaken for certification.',
  },
  {
    number: '06',
    title: 'Evidence traceability',
    text: 'Evidence is identified by source, date, relationship, access state, and integrity information where available.',
  },
  {
    number: '07',
    title: 'Dispute and correction route',
    text: 'Affected parties can challenge attribution, ownership, scope, evidence, or material accuracy without erasing the original record.',
  },
  {
    number: '08',
    title: 'Explicit governance boundary',
    text: 'The Registry preserves declarations and evidence; it does not grant regulatory approval, legal priority, or technical validity.',
  },
];

const REFERENCE_FOUNDATIONS = [
  {
    label: 'NIST AI RMF',
    text: 'Systematic documentation, defined responsibilities, lifecycle governance, transparency, and accountability.',
  },
  {
    label: 'W3C PROV',
    text: 'Provenance relationships among entities, activities, agents, derivations, and responsibility.',
  },
  {
    label: 'DataCite practice',
    text: 'Consistent metadata, persistent identification, related resources, contributors, dates, and version relationships.',
  },
  {
    label: 'EU AI Act',
    text: 'Registration and transparency concepts for regulated AI systems, while keeping this Registry independent and non-governmental.',
  },
];

function Pill({ children, tone = 'blue' }: { children: React.ReactNode; tone?: PillTone }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function PolishedLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'bronze';
}) {
  return (
    <Link href={href} className={`polished-button polished-button-${variant}`}>
      <span>{children}</span>
      <span aria-hidden="true" className="button-arrow">
        →
      </span>
    </Link>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="section-heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <div className="title-rule" />
      <span>{text}</span>
    </div>
  );
}

export default function AiGovernanceRegistryPage() {
  const [activeStatus, setActiveStatus] = useState<RegistryStatus>('Registered');
  const statusCopy = useMemo(
    () =>
      ({
        Submitted: 'A registrant has delivered a record, but completeness and identity checks are not finished.',
        'Under Review': 'The record is being checked for completeness, attribution, conflicts, evidence references, and publication readiness.',
        Registered: 'The record has passed registry intake controls and has been assigned a stable public or controlled identifier.',
        Disputed: 'A documented challenge affects one or more claims, identities, rights, evidence sources, or scope statements.',
        Superseded: 'A later version now represents the current declaration, while this version remains preserved and citable.',
        Withdrawn: 'The steward has withdrawn the record from active representation; the withdrawal event and prior history remain preserved.',
        Archived: 'The record is no longer active but remains retained for historical, evidentiary, or research continuity.',
      })[activeStatus],
    [activeStatus],
  );

  return (
    <main className="registry-page">
      <div className="cosmos" aria-hidden="true">
        <div className="stars stars-a" />
        <div className="stars stars-b" />
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="orb orb-three" />
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
      </div>

      <header className="topbar">
        <Link href="/" className="brand" aria-label="TA-14 AI Governance Exchange home">
          <span className="brand-mark">TA-14</span>
          <span className="brand-copy">
            <strong>AI Governance Registry</strong>
            <small>TA-14 AI Governance Exchange</small>
          </span>
        </Link>
        <nav aria-label="Registry navigation">
          <a href="#record">Registry Record</a>
          <a href="#integrity">Integrity Controls</a>
          <a href="#status">Status Model</a>
          <a href="#method">Method</a>
        </nav>
        <PolishedLink href="/workspace/ai-governance/registry/directory" variant="secondary">
          Browse Registry
        </PolishedLink>
      </header>

      <section className="hero">
        <div className="hero-seal" aria-hidden="true">
          <div className="seal-ring seal-ring-a" />
          <div className="seal-ring seal-ring-b" />
          <div className="seal-core">TA-14</div>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">A DATED, SEARCHABLE, ATTRIBUTABLE PUBLIC RECORD</p>
          <h1>
            The TA-14
            <span>AI Governance Registry</span>
          </h1>
          <p className="hero-summary">
            A governed record of what an AI governance architecture calls itself, who claims it,
            what it claims to govern, when the declaration was made, which evidence supports it,
            and how the record changes over time.
          </p>
          <div className="hero-boundary">
            <strong>Registration is not certification.</strong>
            <span>
              The Registry preserves identity, declarations, evidence, provenance, version history,
              and disputes. It does not determine legal validity, regulatory approval, technical
              efficacy, ownership priority, or fitness for use.
            </span>
          </div>
          <div className="hero-actions">
            <PolishedLink href="/workspace/ai-governance/registry/register" variant="primary">
              Register a Governance Architecture
            </PolishedLink>
            <PolishedLink href="/workspace/ai-governance/registry/directory" variant="bronze">
              Browse Registered Governances
            </PolishedLink>
          </div>
          <div className="trust-strip" aria-label="Registry principles">
            <span>Persistent identity</span>
            <span>Version lineage</span>
            <span>Evidence traceability</span>
            <span>Claims and non-claims</span>
            <span>Dispute preservation</span>
          </div>
        </div>
      </section>

      <section className="institutional-banner">
        <p>THE REGISTRY PRESERVES THE DECLARATION. IT DOES NOT ENDORSE THE DECLARATION.</p>
      </section>

      <section id="record" className="section-shell">
        <SectionTitle
          eyebrow="THE CORE REGISTRY RECORD"
          title="A record designed to remain understandable under scrutiny."
          text="Each registration must preserve enough identity, context, limitation, evidence, and history for another person to determine exactly what was declared and what the Registry did—and did not—verify."
        />
        <div className="record-grid">
          {REGISTRY_FIELDS.map(([title, text], index) => (
            <article className="record-card" key={title}>
              <div className="record-number">{String(index + 1).padStart(2, '0')}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="integrity" className="section-shell integrity-section">
        <SectionTitle
          eyebrow="REGISTRY LEGITIMACY CONTROLS"
          title="Legitimacy comes from controls, not appearance."
          text="A serious registry must preserve stable identity, provenance, version history, correction routes, transparent status, and clear boundaries between recording a claim and validating it."
        />
        <div className="control-list">
          {LEGITIMACY_CONTROLS.map((control) => (
            <article key={control.number} className="control-row">
              <span>{control.number}</span>
              <div>
                <h3>{control.title}</h3>
                <p>{control.text}</p>
              </div>
              <div className="control-check" aria-label="Required control">REQUIRED</div>
            </article>
          ))}
        </div>
      </section>

      <section id="status" className="section-shell status-section">
        <SectionTitle
          eyebrow="PUBLIC STATUS MODEL"
          title="No record is forced into a false binary."
          text="The Registry shows where a record is in its lifecycle and preserves adverse events instead of quietly deleting inconvenient history."
        />
        <div className="status-panel">
          <div className="status-tabs" role="tablist" aria-label="Registry statuses">
            {(Object.keys(STATUS_TONES) as RegistryStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={activeStatus === status}
                onClick={() => setActiveStatus(status)}
                className={activeStatus === status ? 'active' : ''}
              >
                <Pill tone={STATUS_TONES[status]}>{status}</Pill>
              </button>
            ))}
          </div>
          <div className="status-explainer">
            <div className="status-led" />
            <div>
              <p>SELECTED REGISTRY STATE</p>
              <h3>{activeStatus}</h3>
              <span>{statusCopy}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell architecture-section">
        <SectionTitle
          eyebrow="THE REGISTRY CHAIN"
          title="Every published record must remain connected to its origin and history."
          text="The chain is designed to make silent substitution, orphaned evidence, unattributed claims, and invisible corrections harder to conceal."
        />
        <div className="chain" aria-label="Registry chain">
          {['Declaration', 'Identity', 'Evidence', 'Review', 'Registration', 'Version', 'Dispute', 'Archive'].map(
            (item, index, array) => (
              <div className="chain-item" key={item}>
                <span>{item}</span>
                {index < array.length - 1 && <b aria-hidden="true">→</b>}
              </div>
            ),
          )}
        </div>
      </section>

      <section id="method" className="section-shell method-section">
        <SectionTitle
          eyebrow="REFERENCE-INFORMED METHOD"
          title="Built from established practices, without pretending to be a government register."
          text="The operating model draws from authoritative documentation, provenance, metadata, lifecycle, and registration concepts. TA-14 remains responsible for its own registry rules, controls, and public representations."
        />
        <div className="reference-grid">
          {REFERENCE_FOUNDATIONS.map((reference) => (
            <article key={reference.label}>
              <Pill tone="gold">{reference.label}</Pill>
              <p>{reference.text}</p>
            </article>
          ))}
        </div>
        <div className="method-boundaries">
          <div>
            <p>THE REGISTRY MAY VERIFY</p>
            <ul>
              <li>That required fields were submitted.</li>
              <li>That a submitter completed an identity or authority check defined by registry policy.</li>
              <li>That cited evidence was accessible at the recorded time.</li>
              <li>That the published record matches the accepted registry version.</li>
              <li>That status and history events were recorded by the Registry.</li>
            </ul>
          </div>
          <div>
            <p>THE REGISTRY DOES NOT, BY REGISTRATION ALONE, VERIFY</p>
            <ul>
              <li>That the governance architecture works as claimed.</li>
              <li>That the claimant owns every underlying idea or right.</li>
              <li>That the architecture complies with any law or standard.</li>
              <li>That a regulator, standards body, or independent reviewer endorses it.</li>
              <li>That a registration creates legal priority, exclusivity, certification, or admissibility.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-shell launch-section">
        <div className="launch-card">
          <div>
            <p className="eyebrow">FOUNDATIONAL RELEASE</p>
            <h2>The front door is now established.</h2>
            <span>
              The Registry is moving from institutional design into operation. Governance architectures
              can enter governed intake, preserve identity and authority declarations, submit evidence,
              proceed through review, receive a permanent Registry identifier, and appear in the public
              directory when public visibility is authorized.
            </span>
          </div>
          <div className="launch-actions">
            <PolishedLink href="/workspace/ai-governance/registry/register" variant="primary">
              Begin a Registry Filing
            </PolishedLink>
            <PolishedLink href="/workspace/ai-governance/registry/directory" variant="secondary">
              Open the Public Directory
            </PolishedLink>
            <PolishedLink href="/workspace/ai-governance/registry/my-records" variant="bronze">
              Open My Registry Records
            </PolishedLink>
            <PolishedLink href="/workspace/ai-governance/registry/review" variant="secondary">
              Open Reviewer Queue
            </PolishedLink>
          </div>
        </div>
      </section>

      <footer>
        <div>
          <strong>TA-14 AI Governance Registry</strong>
          <span>A registry of declarations, evidence, provenance, status, and lineage.</span>
        </div>
        <p>No admissible evidence. No admissible execution.</p>
      </footer>

      <style jsx global>{`
        :root {
          color-scheme: dark;
          --ink: #eef7ff;
          --muted: #9eb2c5;
          --line: rgba(137, 196, 255, 0.2);
          --panel: rgba(5, 16, 29, 0.82);
          --panel-strong: rgba(7, 20, 35, 0.96);
          --blue: #6ed8ff;
          --deep-blue: #208cff;
          --bronze: #d59a45;
          --gold: #ffd587;
          --green: #69e2b1;
          --red: #ff8585;
          --violet: #c7a0ff;
          --shadow: 0 24px 90px rgba(0, 0, 0, 0.38);
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #020914; color: var(--ink); }
        a { color: inherit; text-decoration: none; }
        button { font: inherit; }

        .registry-page {
          min-height: 100vh;
          overflow: hidden;
          position: relative;
          background:
            radial-gradient(circle at 50% 10%, rgba(25, 100, 170, 0.22), transparent 32%),
            linear-gradient(180deg, #020713 0%, #06111e 52%, #020812 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .cosmos { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .stars { position: absolute; inset: -20%; opacity: .7; background-repeat: repeat; }
        .stars-a { background-image: radial-gradient(circle, rgba(255,255,255,.8) 0 1px, transparent 1.4px); background-size: 88px 88px; animation: drift 45s linear infinite; }
        .stars-b { background-image: radial-gradient(circle, rgba(110,216,255,.8) 0 1px, transparent 1.7px); background-size: 143px 143px; transform: rotate(18deg); animation: drift 68s linear infinite reverse; }
        .orb { position: absolute; border-radius: 50%; filter: blur(.3px); box-shadow: 0 0 70px currentColor; opacity: .72; }
        .orb-one { width: 16px; height: 16px; color: #54caff; background: currentColor; top: 16%; left: 7%; animation: float 8s ease-in-out infinite; }
        .orb-two { width: 26px; height: 26px; color: #f7aa36; background: currentColor; top: 11%; right: 7%; animation: float 11s ease-in-out infinite reverse; }
        .orb-three { width: 9px; height: 9px; color: #89f4ff; background: currentColor; top: 48%; right: 14%; animation: float 7s ease-in-out infinite; }
        .orbit { position: absolute; border: 1px solid rgba(213,154,69,.22); border-radius: 50%; transform: rotate(-18deg); }
        .orbit-one { width: 420px; height: 120px; top: 6%; left: -130px; }
        .orbit-two { width: 520px; height: 150px; top: 9%; right: -180px; transform: rotate(16deg); }

        .topbar, .hero, .section-shell, .institutional-banner, footer { position: relative; z-index: 2; }
        .topbar {
          width: min(1480px, calc(100% - 40px));
          margin: 18px auto 0;
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 12px 14px 12px 18px;
          border: 1px solid rgba(147, 205, 255, .18);
          border-radius: 20px;
          background: rgba(2, 10, 19, .72);
          backdrop-filter: blur(18px);
          box-shadow: 0 16px 60px rgba(0,0,0,.25);
        }
        .brand { display: flex; align-items: center; gap: 12px; min-width: 270px; }
        .brand-mark { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 16px; border: 1px solid rgba(255,213,135,.55); background: linear-gradient(145deg, rgba(213,154,69,.25), rgba(26,98,155,.18)); color: var(--gold); font-weight: 900; font-size: 13px; box-shadow: inset 0 0 22px rgba(255,213,135,.08), 0 0 30px rgba(74,176,255,.1); }
        .brand-copy { display: flex; flex-direction: column; gap: 3px; }
        .brand-copy strong { font-family: Georgia, 'Times New Roman', serif; font-size: 17px; letter-spacing: .02em; }
        .brand-copy small { color: var(--muted); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
        .topbar nav { display: flex; align-items: center; gap: 8px; }
        .topbar nav a { padding: 10px 13px; border-radius: 12px; color: #bed0df; font-size: 12px; font-weight: 800; letter-spacing: .04em; transition: .25s ease; }
        .topbar nav a:hover { color: white; background: rgba(105,197,255,.1); box-shadow: inset 0 0 0 1px rgba(105,197,255,.16); transform: translateY(-1px); }

        .polished-button { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 12px; min-height: 46px; padding: 0 18px; border-radius: 14px; border: 1px solid transparent; font-size: 12px; font-weight: 900; letter-spacing: .045em; overflow: hidden; transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease; }
        .polished-button::before { content: ''; position: absolute; inset: 0; background: linear-gradient(110deg, transparent 25%, rgba(255,255,255,.18) 48%, transparent 70%); transform: translateX(-130%); transition: transform .6s ease; }
        .polished-button:hover::before { transform: translateX(130%); }
        .polished-button:hover { transform: translateY(-2px); }
        .polished-button-primary { color: #00111e; background: linear-gradient(135deg, #b6efff, #65c9ff 55%, #3a9ff6); border-color: rgba(196,242,255,.9); box-shadow: 0 12px 30px rgba(55,172,255,.24), inset 0 1px rgba(255,255,255,.7); }
        .polished-button-primary:hover { box-shadow: 0 16px 42px rgba(55,172,255,.34), inset 0 1px rgba(255,255,255,.8); }
        .polished-button-secondary { color: #dceeff; background: linear-gradient(180deg, rgba(36,76,108,.7), rgba(8,26,42,.86)); border-color: rgba(136,204,255,.28); box-shadow: inset 0 1px rgba(255,255,255,.08), 0 10px 24px rgba(0,0,0,.2); }
        .polished-button-bronze { color: #fff3d9; background: linear-gradient(180deg, rgba(140,91,34,.86), rgba(61,36,15,.9)); border-color: rgba(255,205,120,.42); box-shadow: inset 0 1px rgba(255,239,201,.16), 0 12px 30px rgba(174,103,30,.16); }
        .button-arrow { font-size: 18px; line-height: 1; transition: transform .2s ease; }
        .polished-button:hover .button-arrow { transform: translateX(3px); }

        .hero { width: min(1280px, calc(100% - 40px)); margin: 0 auto; padding: 116px 0 90px; display: grid; grid-template-columns: 280px 1fr; align-items: center; gap: 70px; }
        .hero-seal { width: 260px; aspect-ratio: 1; position: relative; display: grid; place-items: center; border-radius: 50%; filter: drop-shadow(0 30px 60px rgba(0,0,0,.3)); }
        .seal-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,213,135,.35); }
        .seal-ring-a { inset: 0; animation: spin 30s linear infinite; box-shadow: inset 0 0 50px rgba(71,174,255,.08), 0 0 60px rgba(71,174,255,.08); }
        .seal-ring-a::before, .seal-ring-a::after { content:''; position:absolute; width:12px; height:12px; border-radius:50%; background: var(--blue); box-shadow:0 0 24px var(--blue); top:16px; left:50%; }
        .seal-ring-a::after { background:var(--bronze); box-shadow:0 0 24px var(--bronze); top:auto; bottom:16px; }
        .seal-ring-b { inset: 28px; border-style: dashed; border-color: rgba(110,216,255,.35); animation: spin 22s linear infinite reverse; }
        .seal-core { width: 146px; aspect-ratio: 1; display: grid; place-items: center; border-radius: 50%; font-family: Georgia, serif; font-weight: 900; letter-spacing: .08em; font-size: 28px; color: var(--gold); border: 1px solid rgba(255,213,135,.52); background: radial-gradient(circle at 40% 30%, rgba(39,114,170,.6), rgba(5,20,34,.95) 65%); box-shadow: inset 0 0 45px rgba(99,203,255,.14), 0 0 70px rgba(39,141,219,.2); }
        .hero-copy { max-width: 940px; }
        .eyebrow { margin: 0 0 18px; color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .24em; text-transform: uppercase; }
        .hero h1 { margin: 0; max-width: 980px; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(44px, 7vw, 88px); line-height: .98; letter-spacing: -.045em; font-weight: 500; }
        .hero h1 span { display: block; margin-top: 8px; color: transparent; background: linear-gradient(100deg, #f8fbff 0%, #7fdcff 42%, #ffd089 82%); -webkit-background-clip: text; background-clip: text; font-style: italic; }
        .hero-summary { max-width: 900px; margin: 30px 0 0; color: #c4d3e0; font-size: 17px; line-height: 1.8; }
        .hero-boundary { margin-top: 30px; max-width: 930px; padding: 18px 20px; border-radius: 16px; border: 1px solid rgba(255,199,108,.26); background: linear-gradient(90deg, rgba(113,67,17,.23), rgba(9,24,38,.72)); display: grid; gap: 5px; }
        .hero-boundary strong { color: #ffe1a8; font-family: Georgia, serif; font-size: 17px; }
        .hero-boundary span { color: #c6d1db; line-height: 1.6; font-size: 13px; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
        .trust-strip { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
        .trust-strip span { padding: 8px 10px; border-radius: 999px; border: 1px solid rgba(132,198,247,.16); background: rgba(9,31,49,.62); color: #a9c4d8; font-size: 10px; font-weight: 800; letter-spacing: .045em; }

        .institutional-banner { border-top: 1px solid rgba(255,206,125,.2); border-bottom: 1px solid rgba(255,206,125,.2); background: linear-gradient(90deg, rgba(71,42,12,.16), rgba(10,31,48,.7), rgba(71,42,12,.16)); }
        .institutional-banner p { width: min(1200px, calc(100% - 40px)); margin: 0 auto; padding: 19px 0; text-align: center; color: #f3d49d; font-family: Georgia, serif; font-size: 13px; letter-spacing: .14em; }

        .section-shell { width: min(1200px, calc(100% - 40px)); margin: 0 auto; padding: 110px 0; }
        .section-heading { max-width: 860px; margin-bottom: 50px; }
        .section-heading > p { margin: 0 0 12px; color: var(--blue); font-size: 10px; font-weight: 900; letter-spacing: .22em; }
        .section-heading h2 { margin: 0; font-family: Georgia, serif; font-size: clamp(32px, 5vw, 54px); line-height: 1.08; font-weight: 500; letter-spacing: -.025em; }
        .title-rule { width: 90px; height: 2px; margin: 22px 0; background: linear-gradient(90deg, var(--bronze), var(--blue)); box-shadow: 0 0 20px rgba(90,194,255,.3); }
        .section-heading > span { display: block; color: #aebfce; font-size: 15px; line-height: 1.8; }

        .record-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .record-card { position: relative; min-height: 220px; padding: 26px 23px; border-radius: 20px; border: 1px solid rgba(126,191,240,.16); background: linear-gradient(155deg, rgba(12,35,54,.86), rgba(4,15,26,.9)); box-shadow: var(--shadow); overflow: hidden; transition: transform .25s ease, border-color .25s ease; }
        .record-card::after { content:''; position:absolute; width:140px; height:140px; border-radius:50%; right:-72px; bottom:-72px; border:1px solid rgba(213,154,69,.14); box-shadow:0 0 60px rgba(74,168,235,.07); }
        .record-card:hover { transform: translateY(-5px); border-color: rgba(126,210,255,.35); }
        .record-number { color: var(--bronze); font-family: Georgia, serif; font-size: 13px; letter-spacing: .15em; }
        .record-card h3 { margin: 42px 0 11px; font-family: Georgia, serif; font-size: 23px; font-weight: 500; }
        .record-card p { margin: 0; color: #9fb2c2; font-size: 13px; line-height: 1.65; }

        .integrity-section { padding-top: 60px; }
        .control-list { display: grid; gap: 10px; }
        .control-row { display: grid; grid-template-columns: 62px 1fr auto; gap: 22px; align-items: center; padding: 20px 22px; border: 1px solid rgba(126,191,240,.14); border-radius: 17px; background: linear-gradient(90deg, rgba(10,31,48,.85), rgba(4,15,26,.78)); transition: .25s ease; }
        .control-row:hover { transform: translateX(4px); border-color: rgba(126,210,255,.32); }
        .control-row > span { color: var(--gold); font-family: Georgia, serif; font-size: 17px; }
        .control-row h3 { margin: 0 0 5px; font-family: Georgia, serif; font-weight: 500; font-size: 20px; }
        .control-row p { margin: 0; color: #9fb2c2; font-size: 13px; line-height: 1.55; }
        .control-check { padding: 8px 10px; border-radius: 999px; background: rgba(60,190,139,.11); border: 1px solid rgba(105,226,177,.28); color: var(--green); font-size: 9px; font-weight: 900; letter-spacing: .12em; }

        .status-section { padding-top: 60px; }
        .status-panel { padding: 22px; border-radius: 24px; border: 1px solid rgba(126,191,240,.18); background: rgba(5,17,29,.86); box-shadow: var(--shadow); }
        .status-tabs { display: flex; flex-wrap: wrap; gap: 8px; }
        .status-tabs button { border: 0; background: transparent; padding: 0; cursor: pointer; border-radius: 999px; opacity: .62; transition: .2s ease; }
        .status-tabs button:hover, .status-tabs button.active { opacity: 1; transform: translateY(-2px); }
        .pill { display: inline-flex; align-items: center; min-height: 30px; padding: 0 12px; border-radius: 999px; font-size: 10px; font-weight: 900; letter-spacing: .055em; border: 1px solid; }
        .pill-blue { color:#81dcff; background:rgba(47,151,216,.12); border-color:rgba(94,202,255,.3); }
        .pill-gold { color:#ffd98e; background:rgba(181,119,37,.13); border-color:rgba(255,205,120,.3); }
        .pill-green { color:#77e4b7; background:rgba(54,181,130,.12); border-color:rgba(105,226,177,.3); }
        .pill-violet { color:#cfadff; background:rgba(133,88,194,.13); border-color:rgba(199,160,255,.3); }
        .pill-red { color:#ff9a9a; background:rgba(197,60,60,.12); border-color:rgba(255,133,133,.3); }
        .pill-slate { color:#bac8d4; background:rgba(132,151,168,.1); border-color:rgba(172,190,205,.24); }
        .status-explainer { margin-top: 24px; min-height: 180px; display: flex; align-items: center; gap: 22px; padding: 26px; border-radius: 18px; background: linear-gradient(135deg, rgba(17,49,74,.68), rgba(5,17,29,.96)); border: 1px solid rgba(111,199,255,.14); }
        .status-led { width: 14px; height: 14px; flex: 0 0 auto; border-radius: 50%; background: var(--green); box-shadow: 0 0 25px var(--green); }
        .status-explainer p { margin: 0 0 8px; color: var(--blue); font-size: 9px; font-weight: 900; letter-spacing: .19em; }
        .status-explainer h3 { margin: 0 0 10px; font-family: Georgia, serif; font-size: 32px; font-weight: 500; }
        .status-explainer span { color: #aebfce; line-height: 1.7; }

        .architecture-section { padding-top: 60px; }
        .chain { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 28px; border-radius: 22px; background: linear-gradient(90deg, rgba(85,49,13,.2), rgba(7,29,46,.85)); border: 1px solid rgba(255,205,120,.16); }
        .chain-item { display: flex; align-items: center; gap: 10px; }
        .chain-item span { display: grid; place-items: center; min-height: 48px; padding: 0 15px; border-radius: 14px; border: 1px solid rgba(132,203,255,.2); background: rgba(4,17,29,.84); font-family: Georgia, serif; font-size: 14px; }
        .chain-item b { color: var(--bronze); font-size: 18px; }

        .method-section { padding-top: 60px; }
        .reference-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .reference-grid article { min-height: 175px; padding: 22px; border-radius: 18px; border: 1px solid rgba(126,191,240,.15); background: rgba(6,21,34,.82); }
        .reference-grid p { margin: 28px 0 0; color: #aebfce; line-height: 1.65; font-size: 13px; }
        .method-boundaries { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 28px; }
        .method-boundaries > div { padding: 27px; border-radius: 20px; border: 1px solid rgba(126,191,240,.16); background: linear-gradient(155deg, rgba(12,35,54,.78), rgba(4,15,26,.9)); }
        .method-boundaries > div:last-child { border-color: rgba(255,151,121,.18); background: linear-gradient(155deg, rgba(61,30,25,.45), rgba(15,13,19,.92)); }
        .method-boundaries p { margin: 0 0 18px; color: var(--gold); font-size: 10px; font-weight: 900; letter-spacing: .16em; }
        .method-boundaries ul { margin: 0; padding-left: 20px; color: #afc0cf; }
        .method-boundaries li { margin: 10px 0; line-height: 1.55; font-size: 13px; }

        .launch-section { padding-top: 60px; }
        .launch-card { display: grid; grid-template-columns: 1fr auto; gap: 60px; align-items: center; padding: 42px; border-radius: 26px; border: 1px solid rgba(255,205,120,.23); background: radial-gradient(circle at 20% 0%, rgba(60,142,204,.24), transparent 45%), linear-gradient(135deg, rgba(47,30,12,.75), rgba(5,20,34,.96) 55%); box-shadow: var(--shadow); }
        .launch-card h2 { margin: 0 0 14px; font-family: Georgia, serif; font-weight: 500; font-size: clamp(30px, 4vw, 48px); }
        .launch-card span { color: #b3c2cf; line-height: 1.7; }
        .launch-actions { display: grid; gap: 10px; min-width: 280px; }

        footer { width: min(1200px, calc(100% - 40px)); margin: 0 auto; padding: 45px 0 60px; border-top: 1px solid rgba(126,191,240,.15); display: flex; justify-content: space-between; gap: 30px; color: #8499aa; }
        footer div { display: grid; gap: 5px; }
        footer strong { color: #d7e7f3; font-family: Georgia, serif; font-size: 16px; }
        footer span, footer p { margin: 0; font-size: 12px; }
        footer p { color: var(--gold); font-family: Georgia, serif; font-style: italic; }

        @keyframes drift { from { transform: translate3d(0,0,0); } to { transform: translate3d(120px,80px,0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1100px) {
          .topbar nav { display: none; }
          .hero { grid-template-columns: 210px 1fr; gap: 38px; }
          .hero-seal { width: 200px; }
          .record-grid, .reference-grid { grid-template-columns: repeat(2, 1fr); }
          .launch-card { grid-template-columns: 1fr; gap: 28px; }
          .launch-actions { display: flex; flex-wrap: wrap; }
        }
        @media (max-width: 760px) {
          .topbar { width: min(100% - 22px, 1480px); min-height: 68px; }
          .brand { min-width: 0; }
          .brand-copy small { display: none; }
          .topbar > .polished-button { display: none; }
          .hero { width: min(100% - 28px, 1280px); padding: 74px 0 68px; grid-template-columns: 1fr; gap: 34px; }
          .hero-seal { width: 180px; margin: 0 auto; }
          .hero-copy { text-align: center; }
          .hero-summary { font-size: 15px; }
          .hero-boundary { text-align: left; }
          .hero-actions, .trust-strip { justify-content: center; }
          .institutional-banner p { font-size: 10px; line-height: 1.7; }
          .section-shell { width: min(100% - 28px, 1200px); padding: 80px 0; }
          .record-grid, .reference-grid, .method-boundaries { grid-template-columns: 1fr; }
          .control-row { grid-template-columns: 45px 1fr; }
          .control-check { display: none; }
          .chain { align-items: stretch; }
          .chain-item { flex: 1 1 100%; }
          .chain-item span { flex: 1; }
          .chain-item b { transform: rotate(90deg); }
          .launch-card { padding: 28px 22px; }
          .launch-actions { display: grid; min-width: 0; }
          footer { width: min(100% - 28px, 1200px); flex-direction: column; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
        }
      `}</style>
    </main>
  );
}
