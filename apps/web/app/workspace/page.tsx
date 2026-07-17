import Link from 'next/link';

type EntryCard = {
  href: string;
  number: string;
  glyph: string;
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  status: string;
  featured?: boolean;
};

const entryCards: EntryCard[] = [
  {
    href: '/workspace/discover',
    number: '01',
    glyph: '⌁',
    eyebrow: 'Start with an idea',
    title: 'Discover My Route',
    description:
      'Describe the system, proposed action, and consequence. TA-14 will help identify the route, accountable actors, evidence needs, authority boundaries, and likely failure points.',
    action: 'Begin route discovery',
    status: 'Guided intake',
    featured: true,
  },
  {
    href: '/workspace/build',
    number: '02',
    glyph: '◇',
    eyebrow: 'Start with a route',
    title: 'Build a Route',
    description:
      'Construct a bounded consequential route manually. Define the actor, authority, policy, evidence, object, destination, beneficiary, execution, and intended outcome.',
    action: 'Open manual builder',
    status: 'Structured construction',
  },
  {
    href: '/workspace/upload',
    number: '03',
    glyph: '⇧',
    eyebrow: 'Start with a file',
    title: 'Upload a Route',
    description:
      'Bring an existing route package, JSON record, policy bundle, or implementation artifact into the Exchange for extraction, confirmation, validation, and testing.',
    action: 'Upload route package',
    status: 'File intake',
  },
  {
    href: '/workspace/paste',
    number: '04',
    glyph: '▤',
    eyebrow: 'Start with text or JSON',
    title: 'Paste Anything',
    description:
      'Paste structured or unstructured material. Extracted values remain proposed input until a person confirms them, and anything unsupported remains explicitly unknown.',
    action: 'Open paste intake',
    status: 'Evidence-aware extraction',
  },
  {
    href: '/workspace/lab',
    number: '05',
    glyph: 'A',
    eyebrow: 'TA-14 Academy',
    title: 'Learn to Build',
    description:
      'Learn what a route is, why consequence changes governance, how the eight-stage chain works, and how the 24 links determine whether execution remains admissible.',
    action: 'Enter the Academy Lab',
    status: 'Learn by constructing',
    featured: true,
  },
  {
    href: '/workspace/demonstrations',
    number: '06',
    glyph: '◎',
    eyebrow: 'Live route engine',
    title: 'Test a Prepared Route',
    description:
      'Run a working consequential-payment route, inspect the initial HOLD, add missing authority and beneficiary proof, preserve the original version, and issue an AER.',
    action: 'Launch demonstrations',
    status: 'Operational now',
  },
  {
    href: '/workspace/scanner',
    number: '07',
    glyph: '⌕',
    eyebrow: 'Readiness review',
    title: 'Scan for Missing Requirements',
    description:
      'Evaluate whether a route package contains the identities, authorities, evidence, bindings, receipts, continuity, and execution correspondence required for testing.',
    action: 'Open readiness scanner',
    status: 'Pre-test analysis',
  },
  {
    href: '/verify',
    number: '08',
    glyph: '✓',
    eyebrow: 'Independent inspection',
    title: 'Verify a Record',
    description:
      'Use a TA14-RID to inspect a preserved route record, decision history, declared limitations, event continuity, signatures, and downloadable verification material.',
    action: 'Open public verification',
    status: 'Public surface',
  },
];

const lifecycle = [
  'Discover',
  'Construct',
  'Validate',
  'Challenge',
  'Correct',
  'Preserve',
  'Replay',
  'Verify',
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

export default function WorkspaceOverviewPage() {
  return (
    <main className="overview-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .overview-page {
          min-height: calc(100vh - 68px);
          padding: 54px 0 110px;
          overflow: hidden;
        }

        .overview-wrap {
          width: min(1320px, calc(100% - 56px));
          margin: 0 auto;
        }

        .overview-hero {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.28fr) minmax(330px, .72fr);
          gap: 46px;
          align-items: end;
          min-height: 520px;
          padding: clamp(34px, 6vw, 78px);
          overflow: hidden;
          border: 1px solid rgba(137, 174, 213, .16);
          border-radius: 36px;
          background:
            radial-gradient(circle at 82% 25%, rgba(68, 241, 171, .13), transparent 26%),
            radial-gradient(circle at 20% 0%, rgba(57, 193, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(16, 34, 53, .94), rgba(5, 12, 21, .96));
          box-shadow:
            0 44px 130px rgba(0, 0, 0, .35),
            inset 0 0 90px rgba(84, 232, 255, .025);
        }

        .overview-hero::before {
          content: "EXCHANGE";
          position: absolute;
          right: -12px;
          bottom: -43px;
          color: rgba(255, 255, 255, .025);
          font-size: clamp(6rem, 15vw, 13rem);
          font-weight: 1000;
          letter-spacing: -.09em;
          line-height: 1;
          pointer-events: none;
        }

        .hero-copy,
        .hero-console {
          position: relative;
          z-index: 1;
        }

        .eyebrow {
          color: #64e6fb;
          font-size: .72rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .overview-hero h1 {
          max-width: 860px;
          margin: 20px 0 24px;
          font-size: clamp(3.6rem, 7.4vw, 7.7rem);
          line-height: .9;
          letter-spacing: -.075em;
        }

        .gradient-text {
          color: transparent;
          background: linear-gradient(100deg, #ffffff 8%, #89ebff 50%, #56f0b2 94%);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .overview-hero p {
          max-width: 790px;
          margin: 0;
          color: #9eb1c5;
          font-size: clamp(1.05rem, 1.8vw, 1.28rem);
          line-height: 1.76;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primary-link,
        .secondary-link,
        .card-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 0 21px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
          transition: transform .2s ease, border-color .2s ease, filter .2s ease, background .2s ease;
        }

        .primary-link {
          color: #03100c;
          background: linear-gradient(100deg, #54e8ff, #39f2a1);
          box-shadow: 0 0 36px rgba(57, 242, 161, .17);
        }

        .secondary-link {
          border: 1px solid rgba(142, 180, 219, .24);
          color: #dce8f6;
          background: rgba(11, 22, 37, .78);
        }

        .primary-link:hover,
        .secondary-link:hover,
        .card-link:hover {
          transform: translateY(-2px);
        }

        .hero-console {
          padding: 25px;
          border: 1px solid rgba(84, 232, 255, .19);
          border-radius: 26px;
          background: rgba(2, 8, 14, .66);
          box-shadow: inset 0 0 50px rgba(84, 232, 255, .035);
          backdrop-filter: blur(14px);
        }

        .console-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 22px;
          padding-bottom: 17px;
          border-bottom: 1px solid rgba(137, 174, 213, .12);
        }

        .console-head strong {
          font-size: .8rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .live-state {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #74efb6;
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .live-state::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4af0aa;
          box-shadow: 0 0 13px rgba(74, 240, 170, .75);
        }

        .console-chain {
          display: grid;
          gap: 9px;
        }

        .chain-row {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          min-height: 42px;
          padding: 0 12px;
          border: 1px solid rgba(137, 174, 213, .11);
          border-radius: 12px;
          color: #a9b9c9;
          background: rgba(8, 17, 29, .55);
          font-size: .76rem;
          font-weight: 800;
        }

        .chain-row span:first-child {
          color: #567188;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: .66rem;
        }

        .chain-row b {
          color: #6fe7ff;
          font-size: .62rem;
          letter-spacing: .1em;
        }

        .overview-section {
          margin-top: 94px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 34px;
          margin-bottom: 28px;
        }

        .section-heading h2 {
          max-width: 790px;
          margin: 12px 0 0;
          font-size: clamp(2.35rem, 5vw, 4.6rem);
          line-height: .96;
          letter-spacing: -.06em;
        }

        .section-heading p {
          max-width: 470px;
          margin: 0;
          color: #8fa3b8;
          line-height: 1.7;
        }

        .entry-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .entry-card {
          position: relative;
          display: flex;
          min-height: 340px;
          flex-direction: column;
          padding: 30px;
          overflow: hidden;
          border: 1px solid rgba(137, 174, 213, .14);
          border-radius: 27px;
          background: linear-gradient(180deg, rgba(13, 25, 41, .88), rgba(5, 12, 21, .93));
          box-shadow: 0 28px 80px rgba(0, 0, 0, .24);
          transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
        }

        .entry-card:hover {
          transform: translateY(-4px);
          border-color: rgba(84, 232, 255, .34);
          box-shadow: 0 36px 100px rgba(0, 0, 0, .34);
        }

        .entry-card.featured {
          border-color: rgba(84, 232, 255, .25);
          background:
            radial-gradient(circle at 92% 8%, rgba(72, 239, 170, .10), transparent 30%),
            linear-gradient(180deg, rgba(16, 33, 50, .94), rgba(5, 13, 22, .95));
        }

        .entry-card::after {
          content: "";
          position: absolute;
          top: -90px;
          right: -74px;
          width: 230px;
          height: 230px;
          border-radius: 50%;
          background: rgba(69, 218, 255, .08);
          filter: blur(10px);
        }

        .card-top,
        .card-copy,
        .card-bottom {
          position: relative;
          z-index: 1;
        }

        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .card-number {
          color: #536d84;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: .72rem;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .card-glyph {
          display: grid;
          place-items: center;
          width: 49px;
          height: 49px;
          border: 1px solid rgba(126, 193, 225, .19);
          border-radius: 15px;
          color: #8beaff;
          background: rgba(8, 19, 31, .78);
          font-size: 1.2rem;
          font-weight: 900;
          box-shadow: inset 0 0 20px rgba(84, 232, 255, .05);
        }

        .card-copy {
          margin-top: 42px;
        }

        .card-eyebrow {
          color: #68dff6;
          font-size: .69rem;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .entry-card h3 {
          margin: 10px 0 14px;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          line-height: 1.02;
          letter-spacing: -.05em;
        }

        .entry-card p {
          margin: 0;
          color: #91a5ba;
          line-height: 1.68;
        }

        .card-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-top: auto;
          padding-top: 28px;
        }

        .card-status {
          display: grid;
          gap: 5px;
          color: #617b91;
          font-size: .65rem;
          font-weight: 900;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .card-status strong {
          color: #dfeaf4;
          font-size: .76rem;
          letter-spacing: 0;
          text-transform: none;
        }

        .card-link {
          min-height: 43px;
          padding: 0 16px;
          border: 1px solid rgba(84, 232, 255, .22);
          color: #e9f9ff;
          background: rgba(14, 34, 52, .83);
          font-size: .76rem;
          white-space: nowrap;
        }

        .lifecycle-panel {
          position: relative;
          padding: clamp(28px, 5vw, 52px);
          overflow: hidden;
          border: 1px solid rgba(84, 232, 255, .18);
          border-radius: 30px;
          background:
            radial-gradient(circle at 84% 30%, rgba(57, 242, 161, .09), transparent 30%),
            linear-gradient(120deg, rgba(15, 34, 52, .91), rgba(5, 13, 22, .95));
          box-shadow: 0 34px 100px rgba(0, 0, 0, .28);
        }

        .lifecycle-panel h2 {
          max-width: 790px;
          margin: 12px 0 16px;
          font-size: clamp(2.4rem, 5vw, 4.4rem);
          line-height: .98;
          letter-spacing: -.06em;
        }

        .lifecycle-panel > p {
          max-width: 810px;
          margin: 0;
          color: #94a8bc;
          line-height: 1.72;
        }

        .lifecycle-rail {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 8px;
          margin-top: 34px;
        }

        .lifecycle-step {
          position: relative;
          min-height: 92px;
          padding: 16px 13px;
          border: 1px solid rgba(137, 174, 213, .13);
          border-radius: 16px;
          color: #dceaf5;
          background: rgba(4, 11, 19, .57);
          font-size: .76rem;
          font-weight: 850;
        }

        .lifecycle-step span {
          display: block;
          margin-bottom: 18px;
          color: #547086;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: .63rem;
          letter-spacing: .12em;
        }

        .lifecycle-step:not(:last-child)::after {
          content: "→";
          position: absolute;
          top: 50%;
          right: -9px;
          z-index: 2;
          color: #4edeb8;
          transform: translateY(-50%);
          font-size: .76rem;
        }

        .academy-banner {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) auto;
          gap: 34px;
          align-items: center;
          margin-top: 22px;
          padding: clamp(28px, 5vw, 50px);
          border: 1px solid rgba(84, 232, 255, .2);
          border-radius: 30px;
          background:
            radial-gradient(circle at 88% 40%, rgba(57, 242, 161, .12), transparent 28%),
            linear-gradient(110deg, rgba(18, 41, 61, .94), rgba(6, 15, 25, .96));
          box-shadow: 0 35px 100px rgba(0, 0, 0, .29);
        }

        .academy-banner h2 {
          max-width: 820px;
          margin: 12px 0 14px;
          font-size: clamp(2.35rem, 5vw, 4.3rem);
          line-height: .98;
          letter-spacing: -.06em;
        }

        .academy-banner p {
          max-width: 820px;
          margin: 0;
          color: #9db1c5;
          line-height: 1.72;
        }

        .boundary-note {
          margin-top: 28px;
          padding: 22px 24px;
          border: 1px solid rgba(255, 212, 106, .15);
          border-radius: 18px;
          color: #aa9f79;
          background: rgba(255, 212, 106, .04);
          font-size: .86rem;
          line-height: 1.65;
        }

        .boundary-note strong {
          color: #dfd2a2;
        }

        @media (max-width: 1120px) {
          .overview-hero {
            grid-template-columns: 1fr;
          }

          .hero-console {
            max-width: 720px;
          }

          .lifecycle-rail {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .lifecycle-step:nth-child(4)::after {
            display: none;
          }
        }

        @media (max-width: 820px) {
          .overview-page {
            padding-top: 30px;
          }

          .overview-wrap {
            width: min(1320px, calc(100% - 28px));
          }

          .overview-hero {
            min-height: 0;
            padding: 34px 25px;
            border-radius: 27px;
          }

          .overview-hero h1 {
            font-size: clamp(3.2rem, 15vw, 5.8rem);
          }

          .section-heading {
            display: block;
          }

          .section-heading p {
            margin-top: 17px;
          }

          .entry-grid {
            grid-template-columns: 1fr;
          }

          .academy-banner {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 620px) {
          .overview-section {
            margin-top: 68px;
          }

          .hero-actions,
          .card-bottom {
            align-items: stretch;
            flex-direction: column;
          }

          .primary-link,
          .secondary-link,
          .card-link {
            width: 100%;
          }

          .entry-card {
            min-height: 0;
            padding: 23px;
          }

          .lifecycle-rail {
            grid-template-columns: 1fr 1fr;
          }

          .lifecycle-step:nth-child(even)::after {
            display: none;
          }

          .lifecycle-step:not(:last-child)::after {
            right: -8px;
          }
        }
      `}</style>

      <div className="overview-wrap">
        <section className="overview-hero">
          <div className="hero-copy">
            <div className="eyebrow">TA-14 Exchange Workspace</div>
            <h1>
              <span className="gradient-text">What are you bringing to the Exchange?</span>
            </h1>
            <p>
              Start with an idea, an existing route, a file, raw text, a prepared demonstration,
              or a preserved record. Every path enters the same governed route lifecycle and the
              same admissible execution engine.
            </p>

            <div className="hero-actions">
              <Link className="primary-link" href="/workspace/discover">
                Discover my route →
              </Link>
              <Link className="secondary-link" href="/workspace/demonstrations">
                Run the live demonstration
              </Link>
            </div>
          </div>

          <aside className="hero-console" aria-label="TA-14 execution chain">
            <div className="console-head">
              <strong>Execution chain</strong>
              <span className="live-state">Engine available</span>
            </div>

            <div className="console-chain">
              {chain.map((stage, index) => (
                <div className="chain-row" key={stage}>
                  <span>0{index + 1}</span>
                  <span>{stage}</span>
                  <b>BOUND</b>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="overview-section" aria-labelledby="entry-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Choose an entry path</div>
              <h2 id="entry-title">One platform for every stage of route governance.</h2>
            </div>

            <p>
              The Workspace is the engine room of the Exchange. Select the form your work is in
              today, and the platform will carry it toward construction, testing, correction,
              preservation, replay, and verification.
            </p>
          </div>

          <div className="entry-grid">
            {entryCards.map((card) => (
              <article className={`entry-card ${card.featured ? 'featured' : ''}`} key={card.href}>
                <div className="card-top">
                  <span className="card-number">{card.number}</span>
                  <span className="card-glyph" aria-hidden="true">
                    {card.glyph}
                  </span>
                </div>

                <div className="card-copy">
                  <div className="card-eyebrow">{card.eyebrow}</div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>

                <div className="card-bottom">
                  <div className="card-status">
                    Workspace mode
                    <strong>{card.status}</strong>
                  </div>

                  <Link className="card-link" href={card.href}>
                    {card.action} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="overview-section">
          <div className="lifecycle-panel">
            <div className="eyebrow">One continuous record</div>
            <h2>The route should never disappear between tools.</h2>
            <p>
              Discovery, construction, scanning, testing, correction, preservation, replay, and
              verification are not separate products. They are connected stages operating on the
              same identified route, version history, evidence boundary, and event chain.
            </p>

            <div className="lifecycle-rail" aria-label="Exchange route lifecycle">
              {lifecycle.map((stage, index) => (
                <div className="lifecycle-step" key={stage}>
                  <span>0{index + 1}</span>
                  {stage}
                </div>
              ))}
            </div>
          </div>

          <article className="academy-banner">
            <div>
              <div className="eyebrow">TA-14 Academy of Admissible Execution Governance</div>
              <h2>Do not just use the route engine. Learn how to construct governance.</h2>
              <p>
                Academy lessons will open directly into practical Exchange labs. A learner studies
                the governing principle, constructs the relevant route section, watches the engine
                expose failures, corrects the route, and preserves the resulting artifact.
              </p>
            </div>

            <Link className="primary-link" href="/workspace/lab">
              Enter the Academy Lab →
            </Link>
          </article>

          <div className="boundary-note">
            <strong>Current release boundary:</strong> the prepared demonstration and custom form
            use the working consequential-payment route engine. Discovery, upload, paste, Academy,
            and scanner links establish their permanent locations in the unified Workspace and can
            be activated sequentially without disturbing the live route transaction.
          </div>
        </section>
      </div>
    </main>
  );
}
