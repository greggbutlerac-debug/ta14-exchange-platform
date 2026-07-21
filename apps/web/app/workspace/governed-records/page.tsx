'use client';

import Link from 'next/link';
import { useState } from 'react';

const recordTypes = [
  {
    title: 'Governed Interpretation Record',
    description:
      'A bounded interpretation of an existing record that states what the evidence supports, what it does not support, and where continuity or admissibility breaks remain.',
    href: '/workspace/governed-records/interpreter',
    action: 'Open Interpreter',
  },
  {
    title: 'Governed Review Record',
    description:
      'A preserved account of what was reviewed, which evidence was considered, which findings were declared, and what the reviewer explicitly did not conclude.',
    href: '/workspace/governed-review',
    action: 'Open Review Workspace',
  },
  {
    title: 'Admissible Execution Record',
    description:
      'A route-level record preserving authority, evidence, decision state, binding, execution, and outcome without allowing later layers to rewrite earlier facts.',
    href: '/workspace/records',
    action: 'Open Execution Records',
  },
  {
    title: 'Environmental Integrity Record',
    description:
      'A governed record route for atmospheric, building, HVAC, land, water, hospital, laboratory, and other environmental evidence packages.',
    href: '/workspace/environmental-records',
    action: 'Open Environmental Records',
  },
];

const chain = [
  'Reality',
  'Record',
  'Continuity',
  'Admissibility',
  'Binding',
  'Commit',
  'Execution',
  'Outcome',
];

export default function GovernedRecordsIntroductionPage() {
  const [activePrinciple, setActivePrinciple] = useState(0);

  const principles = [
    {
      title: 'The record is not the diagnosis.',
      body:
        'A governed record preserves what was captured, by whom, when, under which conditions, and with which declared limitations. Interpretation and diagnosis remain separate layers.',
    },
    {
      title: 'The interpretation is not the optimization.',
      body:
        'A bounded interpretation explains what the record supports. It does not silently become a recommendation, intervention, approval, or optimization plan.',
    },
    {
      title: 'Missing evidence remains missing.',
      body:
        'The system may identify gaps, continuity breaks, uncertain identity, missing calibration evidence, or unsupported claims. It does not invent evidence to complete the route.',
    },
  ];

  return (
    <main className="page">
      <div className="ambient" aria-hidden="true">
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="line line-one" />
        <span className="line line-two" />
        <span className="orbit orbit-one" />
        <span className="orbit orbit-two" />
        <span className="particle particle-one" />
        <span className="particle particle-two" />
        <span className="particle particle-three" />
      </div>

      <header className="topbar">
        <Link className="brand" href="/">
          <span>TA-14</span>
          <div>
            <strong>Governed Records</strong>
            <small>TA-14 AI Governance Exchange</small>
          </div>
        </Link>

        <nav>
          <a href="#record-types">Record Types</a>
          <a href="#separation">Separation</a>
          <a href="#chain">Chain</a>
          <Link className="nav-cta" href="/workspace/governed-records/build">
            Create a Record
          </Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">GOVERNED RECORDS INTRODUCTION</p>
          <h1>A record should preserve reality before anyone is allowed to interpret it.</h1>
          <p className="lead">
            Governed Records are the evidence-preservation layer of the TA-14 AI Governance Exchange. They are designed to preserve identity, chronology, continuity, declared boundaries, evidence gaps, determinations, and outcomes without collapsing the record into diagnosis, approval, or optimization.
          </p>

          <div className="hero-actions">
            <Link className="button primary" href="/workspace/governed-records/build">
              Create a Governed Record
            </Link>
            <Link className="button secondary" href="/workspace/governed-records/interpreter">
              Open Record Interpreter
            </Link>
          </div>

          <div className="motto">
            <span>TA-14 governing principle</span>
            <strong>No admissible evidence. No admissible execution.</strong>
          </div>
        </div>

        <aside className="record-card">
          <div className="record-card-top">
            <span>GOVERNED RECORD</span>
            <strong>TA-14-GR-INTRO</strong>
          </div>

          <div className="record-lines">
            <div>
              <span>Identity</span>
              <strong>Declared</strong>
            </div>
            <div>
              <span>Chronology</span>
              <strong>Preserved</strong>
            </div>
            <div>
              <span>Evidence</span>
              <strong>Bounded</strong>
            </div>
            <div>
              <span>Missing evidence</span>
              <strong>Visible</strong>
            </div>
            <div>
              <span>Interpretation</span>
              <strong>Separated</strong>
            </div>
            <div>
              <span>Optimization</span>
              <strong>Outside record</strong>
            </div>
          </div>

          <p>
            A governed record can preserve a fact pattern without claiming that the fact pattern is complete, admissible, safe, compliant, or sufficient for execution.
          </p>
        </aside>
      </section>

      <section className="shell section" id="record-types">
        <div className="section-heading">
          <p className="eyebrow">FOUR RECORD ROUTES</p>
          <h2>Choose the record that matches what actually happened.</h2>
          <p>
            The Exchange does not force every domain through one schema. Each record type preserves a different governed event while maintaining the same separation discipline.
          </p>
        </div>

        <div className="record-grid">
          {recordTypes.map((record, index) => (
            <article className="record-type" key={record.title}>
              <div className="number">{String(index + 1).padStart(2, '0')}</div>
              <h3>{record.title}</h3>
              <p>{record.description}</p>
              <Link href={record.href}>{record.action} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section" id="separation">
        <div className="section-heading">
          <p className="eyebrow">SEPARATION BY DESIGN</p>
          <h2>The record, interpretation, diagnosis, and optimization cannot be allowed to corrupt one another.</h2>
        </div>

        <div className="principle-layout">
          <div className="principle-tabs" role="tablist" aria-label="Governed record principles">
            {principles.map((principle, index) => (
              <button
                className={activePrinciple === index ? 'active' : ''}
                key={principle.title}
                type="button"
                onClick={() => setActivePrinciple(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {principle.title}
              </button>
            ))}
          </div>

          <article className="principle-panel">
            <span>ACTIVE PRINCIPLE</span>
            <h3>{principles[activePrinciple].title}</h3>
            <p>{principles[activePrinciple].body}</p>
            <div className="principle-boundary">
              <strong>Why this matters</strong>
              <p>
                When layers are collapsed, later conclusions can silently rewrite the original record. TA-14 preserves each layer as its own attributable artifact.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="shell section" id="chain">
        <div className="section-heading">
          <p className="eyebrow">THE TA-14 CHAIN</p>
          <h2>A governed record is not the end of the route. It is the beginning of admissibility.</h2>
        </div>

        <div className="chain-grid">
          {chain.map((step, index) => (
            <div className="chain-step" key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
              {index < chain.length - 1 ? <i aria-hidden="true">→</i> : null}
            </div>
          ))}
        </div>

        <div className="chain-note">
          <strong>Nothing downstream is allowed to retroactively improve what the original record established.</strong>
          <p>
            If identity was missing, it remains missing. If continuity broke, the break remains visible. If the evidence was insufficient, later confidence cannot erase that insufficiency.
          </p>
        </div>
      </section>

      <section className="shell section pathway-section">
        <div className="section-heading">
          <p className="eyebrow">START A GOVERNED RECORD</p>
          <h2>Enter through the route that matches your evidence.</h2>
        </div>

        <div className="pathway-grid">
          <Link className="pathway primary-path" href="/workspace/governed-records/build">
            <span>CREATE</span>
            <h3>Build a new Governed Record</h3>
            <p>Start with identity, chronology, evidence, continuity, and explicit boundaries.</p>
            <strong>Open Record Builder →</strong>
          </Link>

          <Link className="pathway" href="/workspace/governed-records/interpreter">
            <span>INTERPRET</span>
            <h3>Bring an existing record</h3>
            <p>Upload or enter an existing record and create a bounded governed interpretation.</p>
            <strong>Open Record Interpreter →</strong>
          </Link>

          <Link className="pathway" href="/verification">
            <span>VERIFY</span>
            <h3>Verify a preserved record</h3>
            <p>Check a record identifier, preserved receipt, evidence route, or replay state.</p>
            <strong>Open Verification →</strong>
          </Link>
        </div>
      </section>

      <footer>
        <Link className="brand" href="/">
          <span>TA-14</span>
          <div>
            <strong>Governed Records</strong>
            <small>Reality before interpretation.</small>
          </div>
        </Link>
        <p>
          This introduction describes the governed record architecture. It does not certify any record, determine legal compliance, establish safety, or replace domain-qualified review.
        </p>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; }
        :global(body) { margin: 0; background: #05040a; color: #f8f5ff; }
        :global(a) { color: inherit; text-decoration: none; }
        :global(button) { font: inherit; }

        .page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 10% 4%, rgba(127, 76, 255, 0.16), transparent 26%),
            radial-gradient(circle at 91% 12%, rgba(255, 188, 76, 0.1), transparent 24%),
            linear-gradient(180deg, #07050d 0%, #090611 52%, #05040a 100%);
        }

        .page > :not(.ambient) { position: relative; z-index: 2; }
        .shell { width: min(1180px, calc(100% - 40px)); margin: 0 auto; }

        .ambient { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .star, .particle { position: absolute; border-radius: 50%; background: white; box-shadow: 0 0 14px white, 0 0 36px rgba(153, 99, 255, .88); }
        .star { width: 6px; height: 6px; animation: pulse 7s ease-in-out infinite; }
        .star-one { top: 10%; left: 88%; }
        .star-two { top: 42%; left: 5%; animation-delay: -2s; }
        .star-three { top: 72%; left: 82%; animation-delay: -4s; }
        .star-four { top: 90%; left: 28%; animation-delay: -5s; }
        .particle { width: 3px; height: 3px; opacity: .58; animation: drift 18s linear infinite; }
        .particle-one { top: 26%; left: 20%; }
        .particle-two { top: 58%; left: 69%; animation-delay: -7s; }
        .particle-three { top: 82%; left: 45%; animation-delay: -12s; }
        .line { position: absolute; width: 56vw; height: 1px; opacity: .22; background: linear-gradient(90deg, transparent, rgba(213, 187, 255, .7), transparent); animation: lineMove 18s linear infinite; }
        .line-one { top: 29%; left: -22%; transform: rotate(18deg); }
        .line-two { top: 74%; right: -24%; transform: rotate(-16deg); animation-delay: -9s; }
        .orbit { position: absolute; width: 320px; height: 320px; border: 1px solid rgba(183, 143, 255, .14); border-radius: 50%; animation: rotate 26s linear infinite; }
        .orbit::after { content: ''; position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #ffd47b; box-shadow: 0 0 20px #ffd47b; top: 26px; left: 72px; }
        .orbit-one { top: 13%; right: -150px; }
        .orbit-two { bottom: 7%; left: -170px; width: 380px; height: 380px; animation-direction: reverse; }

        .topbar { width: min(1240px, calc(100% - 32px)); margin: 0 auto; min-height: 88px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid rgba(255,255,255,.09); }
        .brand { display: inline-flex; align-items: center; gap: 13px; }
        .brand > span { display: grid; place-items: center; width: 52px; height: 52px; border: 1px solid rgba(235,218,255,.35); border-radius: 15px; background: linear-gradient(145deg, rgba(126,71,229,.34), rgba(255,183,64,.12)); font-weight: 1000; letter-spacing: -.04em; }
        .brand div { display: grid; gap: 3px; }
        .brand strong { font-size: .96rem; }
        .brand small { color: #a99dbd; font-size: .72rem; }
        nav { display: flex; align-items: center; gap: 20px; color: #c7bdd5; font-size: .78rem; font-weight: 800; }
        nav a:hover { color: white; }
        .nav-cta { padding: 12px 16px; border-radius: 999px; color: #140d1c; background: linear-gradient(135deg, #ffe2a0, #caa8ff); }

        .hero { min-height: 690px; display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(330px, .75fr); align-items: center; gap: 60px; padding: 84px 0 70px; }
        .eyebrow { margin: 0 0 15px; color: #d0adff; font-size: .73rem; font-weight: 1000; letter-spacing: .2em; }
        h1, h2, h3, p { margin-top: 0; }
        h1 { max-width: 820px; margin-bottom: 24px; font-size: clamp(3.3rem, 7vw, 6.4rem); line-height: .95; letter-spacing: -.07em; }
        .lead { max-width: 780px; color: #c7bed1; font-size: 1.08rem; line-height: 1.82; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
        .button { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 20px; border-radius: 13px; font-size: .82rem; font-weight: 1000; }
        .button.primary { color: #170e20; background: linear-gradient(135deg, #ffe3a2, #caa8ff); box-shadow: 0 14px 44px rgba(152,96,255,.2); }
        .button.secondary { border: 1px solid rgba(229,213,255,.24); background: rgba(255,255,255,.055); }
        .motto { display: grid; gap: 5px; margin-top: 38px; padding-left: 18px; border-left: 2px solid #d2a9ff; }
        .motto span { color: #8f849e; font-size: .68rem; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
        .motto strong { color: #fff0c8; }

        .record-card { position: relative; padding: 26px; border: 1px solid rgba(229,211,255,.2); border-radius: 28px; background: linear-gradient(160deg, rgba(25,16,37,.92), rgba(10,8,16,.94)); box-shadow: 0 30px 90px rgba(0,0,0,.46); overflow: hidden; }
        .record-card::before { content: ''; position: absolute; inset: 0 auto auto 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #d8b7ff, #ffd987, transparent); }
        .record-card-top { display: flex; justify-content: space-between; gap: 20px; color: #aa9db8; font-size: .67rem; font-weight: 900; letter-spacing: .1em; }
        .record-card-top strong { color: #ffe5a7; }
        .record-lines { display: grid; margin: 25px 0; border-top: 1px solid rgba(255,255,255,.08); }
        .record-lines div { display: flex; justify-content: space-between; gap: 20px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,.08); }
        .record-lines span { color: #9e93aa; font-size: .77rem; }
        .record-lines strong { font-size: .78rem; }
        .record-card p { margin-bottom: 0; color: #aaa0b5; line-height: 1.7; font-size: .82rem; }

        .section { padding: 88px 0; }
        .section-heading { max-width: 820px; margin-bottom: 36px; }
        .section-heading h2 { margin-bottom: 18px; font-size: clamp(2.2rem, 4.5vw, 4.2rem); line-height: 1; letter-spacing: -.055em; }
        .section-heading > p:last-child { color: #aaa1b5; line-height: 1.75; }

        .record-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px; }
        .record-type { position: relative; min-height: 290px; padding: 30px; border: 1px solid rgba(255,255,255,.1); border-radius: 24px; background: rgba(255,255,255,.035); transition: transform .25s ease, border-color .25s ease, background .25s ease; }
        .record-type:hover { transform: translateY(-5px); border-color: rgba(216,183,255,.34); background: rgba(152,99,255,.07); }
        .record-type .number { color: #ffd789; font-size: .69rem; font-weight: 1000; letter-spacing: .16em; }
        .record-type h3 { margin: 48px 0 14px; font-size: 1.45rem; }
        .record-type p { color: #aba1b6; line-height: 1.7; }
        .record-type a { position: absolute; left: 30px; bottom: 28px; color: #ead8ff; font-size: .76rem; font-weight: 1000; }

        .principle-layout { display: grid; grid-template-columns: .8fr 1.2fr; gap: 18px; }
        .principle-tabs { display: grid; gap: 10px; }
        .principle-tabs button { display: grid; grid-template-columns: 46px 1fr; align-items: center; min-height: 86px; padding: 0 20px; color: #b7adbf; text-align: left; border: 1px solid rgba(255,255,255,.09); border-radius: 18px; background: rgba(255,255,255,.025); cursor: pointer; }
        .principle-tabs button span { color: #8f7ba4; font-size: .69rem; font-weight: 1000; }
        .principle-tabs button.active { color: white; border-color: rgba(221,190,255,.34); background: linear-gradient(135deg, rgba(153,97,255,.14), rgba(255,199,91,.05)); }
        .principle-panel { padding: 40px; border: 1px solid rgba(224,200,255,.18); border-radius: 24px; background: linear-gradient(150deg, rgba(28,17,42,.8), rgba(11,8,17,.92)); }
        .principle-panel > span { color: #ffd98e; font-size: .68rem; font-weight: 1000; letter-spacing: .18em; }
        .principle-panel h3 { margin: 25px 0 18px; font-size: clamp(2rem,4vw,3.5rem); line-height: 1; letter-spacing: -.05em; }
        .principle-panel > p { color: #c3bacd; font-size: 1rem; line-height: 1.8; }
        .principle-boundary { margin-top: 34px; padding: 20px; border: 1px solid rgba(255,215,137,.18); border-radius: 16px; background: rgba(255,201,93,.045); }
        .principle-boundary strong { color: #ffe0a2; }
        .principle-boundary p { margin: 8px 0 0; color: #a99faf; line-height: 1.65; }

        .chain-grid { display: grid; grid-template-columns: repeat(8, minmax(0,1fr)); border: 1px solid rgba(255,255,255,.09); border-radius: 22px; overflow: hidden; }
        .chain-step { position: relative; min-height: 128px; display: grid; place-content: center; gap: 12px; text-align: center; border-right: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.025); }
        .chain-step:last-child { border-right: 0; }
        .chain-step span { color: #9b89ad; font-size: .65rem; font-weight: 900; }
        .chain-step strong { font-size: .82rem; }
        .chain-step i { position: absolute; right: -8px; top: 50%; z-index: 2; transform: translateY(-50%); color: #d7b5ff; font-style: normal; }
        .chain-note { margin-top: 18px; padding: 26px; border-radius: 20px; background: linear-gradient(135deg, rgba(117,72,198,.14), rgba(255,196,82,.05)); }
        .chain-note strong { color: #f3e3ff; }
        .chain-note p { margin: 9px 0 0; color: #aaa0b5; line-height: 1.7; }

        .pathway-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px; }
        .pathway { min-height: 300px; display: flex; flex-direction: column; padding: 28px; border: 1px solid rgba(255,255,255,.1); border-radius: 24px; background: rgba(255,255,255,.035); transition: transform .25s ease, border-color .25s ease; }
        .pathway:hover { transform: translateY(-5px); border-color: rgba(221,190,255,.34); }
        .pathway.primary-path { background: linear-gradient(145deg, rgba(139,82,238,.18), rgba(255,195,81,.055)); }
        .pathway > span { color: #d2adff; font-size: .67rem; font-weight: 1000; letter-spacing: .17em; }
        .pathway h3 { margin: 58px 0 14px; font-size: 1.42rem; }
        .pathway p { color: #aaa1b5; line-height: 1.7; }
        .pathway strong { margin-top: auto; color: #ffe0a1; font-size: .79rem; }

        footer { width: min(1240px, calc(100% - 32px)); margin: 50px auto 0; padding: 38px 0 50px; display: flex; justify-content: space-between; align-items: center; gap: 40px; border-top: 1px solid rgba(255,255,255,.09); }
        footer > p { max-width: 620px; margin: 0; color: #857b90; font-size: .75rem; line-height: 1.65; }

        @keyframes pulse { 0%,100% { transform: scale(.75); opacity: .35; } 50% { transform: scale(1.6); opacity: 1; } }
        @keyframes drift { from { transform: translate3d(0,0,0); } to { transform: translate3d(160px,-220px,0); } }
        @keyframes lineMove { 0% { transform: translateX(-8%) rotate(18deg); } 50% { opacity: .42; } 100% { transform: translateX(25%) rotate(18deg); } }
        @keyframes rotate { to { transform: rotate(360deg); } }

        @media (max-width: 980px) {
          nav a:not(.nav-cta) { display: none; }
          .hero { grid-template-columns: 1fr; min-height: auto; }
          .record-card { max-width: 650px; }
          .principle-layout { grid-template-columns: 1fr; }
          .chain-grid { grid-template-columns: repeat(4, 1fr); }
          .chain-step:nth-child(4) { border-right: 0; }
          .pathway-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 680px) {
          .shell { width: min(100% - 24px, 1180px); }
          .topbar { min-height: 76px; }
          .brand small { display: none; }
          .nav-cta { padding: 10px 13px; font-size: .7rem; }
          .hero { padding-top: 58px; gap: 38px; }
          h1 { font-size: clamp(2.7rem, 14vw, 4.2rem); }
          .record-grid { grid-template-columns: 1fr; }
          .record-type { min-height: 270px; }
          .principle-panel { padding: 26px; }
          .chain-grid { grid-template-columns: repeat(2, 1fr); }
          .chain-step:nth-child(even) { border-right: 0; }
          footer { align-items: flex-start; flex-direction: column; }
        }
      `}</style>
    </main>
  );
}
