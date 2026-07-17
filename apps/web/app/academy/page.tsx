import Link from 'next/link';

type AcademyModule = {
  number: string;
  phase: string;
  title: string;
  description: string;
  outcome: string;
  href: string;
  status: 'Available now' | 'Lab pathway' | 'Foundation';
  accent: 'cyan' | 'green' | 'violet' | 'amber';
};

const modules: AcademyModule[] = [
  {
    number: '01',
    phase: 'Orientation',
    title: 'What Is a Governance Route?',
    description:
      'Learn why a route is more than a workflow. A governance route binds reality, evidence, authority, continuity, and consequence into one inspectable execution path.',
    outcome: 'Identify the route, consequence, accountable actor, and governing boundary.',
    href: '/academy/what-is-a-route',
    status: 'Available now',
    accent: 'cyan',
  },
  {
    number: '02',
    phase: 'Foundation',
    title: 'Reality and Record',
    description:
      'Separate what actually occurred from what a system merely claims occurred. Build the first durable record without replacing reality with a dashboard assertion.',
    outcome: 'Define the source reality and minimum record required for later verification.',
    href: '/workspace/lab?lesson=reality-record',
    status: 'Lab pathway',
    accent: 'green',
  },
  {
    number: '03',
    phase: 'Foundation',
    title: 'Continuity and Provenance',
    description:
      'Follow evidence across collection, transfer, transformation, and decision use. Learn where continuity breaks and why provenance alone is not enough.',
    outcome: 'Map custody, version, time, origin, and transformation continuity.',
    href: '/workspace/lab?lesson=continuity',
    status: 'Lab pathway',
    accent: 'violet',
  },
  {
    number: '04',
    phase: 'Gate',
    title: 'Admissibility Before Execution',
    description:
      'Test whether the route possesses enough valid evidence and authority to proceed before consequence is created.',
    outcome: 'Classify a route as ALLOW, HOLD, DENY, or ESCALATE.',
    href: '/workspace/demonstrations',
    status: 'Available now',
    accent: 'amber',
  },
  {
    number: '05',
    phase: 'Binding',
    title: 'Authority, Object, and Destination Binding',
    description:
      'Connect the authorized actor to the exact action object, beneficiary, destination, scope, and time window rather than relying on generic permission.',
    outcome: 'Construct exact authority and beneficiary bindings for a consequential route.',
    href: '/workspace/lab?lesson=binding',
    status: 'Lab pathway',
    accent: 'cyan',
  },
  {
    number: '06',
    phase: 'Commit',
    title: 'Commit Without Erasing History',
    description:
      'Understand why correction must create a new immutable version instead of overwriting the original HOLD, failure, or incomplete submission.',
    outcome: 'Preserve version lineage and issue a defensible commit state.',
    href: '/workspace/demonstrations',
    status: 'Available now',
    accent: 'green',
  },
  {
    number: '07',
    phase: 'Execution',
    title: 'Execution and Outcome Correspondence',
    description:
      'Verify that the action that occurred corresponds to the route that was approved, and that the observed outcome corresponds to the committed execution.',
    outcome: 'Detect route drift, execution mismatch, and outcome mismatch.',
    href: '/workspace/lab?lesson=execution-outcome',
    status: 'Lab pathway',
    accent: 'violet',
  },
  {
    number: '08',
    phase: 'Verification',
    title: 'AER, Preservation, Replay, and Verification',
    description:
      'Generate a reconstructable Admissible Execution Record, inspect signatures and event continuity, and verify the route independently after consequence.',
    outcome: 'Preserve and verify a replay-ready governance artifact.',
    href: '/verify',
    status: 'Available now',
    accent: 'amber',
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

const learningLoop = [
  { step: 'Learn', copy: 'Study the governing principle and its failure boundary.' },
  { step: 'Construct', copy: 'Build the relevant route section inside the Exchange.' },
  { step: 'Test', copy: 'Challenge the route against deterministic requirements.' },
  { step: 'Correct', copy: 'Supply missing proof without deleting the failed version.' },
  { step: 'Preserve', copy: 'Generate a durable record, event history, and identity.' },
  { step: 'Verify', copy: 'Reconstruct and independently inspect what occurred.' },
];

export default function AcademyPage() {
  return (
    <main className="academy-page">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #02050a; color: #f5f8ff; }
        a { color: inherit; }

        .academy-page {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 14% 0%, rgba(52, 193, 255, .16), transparent 31%),
            radial-gradient(circle at 92% 12%, rgba(67, 239, 174, .10), transparent 28%),
            radial-gradient(circle at 48% 65%, rgba(117, 87, 255, .07), transparent 34%),
            linear-gradient(180deg, #02050a 0%, #07111c 48%, #02060b 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .academy-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .22;
          background-image:
            linear-gradient(rgba(255,255,255,.026) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.026) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, #000, transparent 90%);
        }

        .shell {
          position: relative;
          z-index: 1;
          width: min(1240px, 92vw);
          margin: 0 auto;
          padding: 28px 0 110px;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 82px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          text-decoration: none;
          font-weight: 950;
          letter-spacing: .09em;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(84, 232, 255, .46);
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(84, 232, 255, .18), rgba(41, 167, 255, .04));
          box-shadow: 0 0 32px rgba(41, 167, 255, .20), inset 0 0 18px rgba(84, 232, 255, .05);
        }

        .nav-actions { display: flex; flex-wrap: wrap; gap: 10px; }
        .nav-link, .primary, .secondary, .module-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
          transition: transform .2s ease, border-color .2s ease, filter .2s ease, background .2s ease;
        }

        .nav-link, .secondary {
          border: 1px solid rgba(145, 180, 214, .20);
          color: #d7e4f0;
          background: rgba(8, 17, 29, .66);
        }

        .nav-link:hover, .secondary:hover, .module-link:hover {
          transform: translateY(-1px);
          border-color: rgba(84, 232, 255, .44);
        }

        .primary {
          border: 0;
          color: #03100c;
          background: linear-gradient(100deg, #54e8ff, #39f2a1);
          box-shadow: 0 0 38px rgba(57, 242, 161, .16);
        }
        .primary:hover { transform: translateY(-1px); filter: brightness(1.07); }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, .8fr);
          gap: 42px;
          align-items: end;
          margin-bottom: 88px;
        }

        .eyebrow {
          color: #65e9ff;
          font-size: .75rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 890px;
          margin: 18px 0 24px;
          font-size: clamp(3.7rem, 8.7vw, 7.8rem);
          line-height: .88;
          letter-spacing: -.075em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(100deg, #fff 8%, #8deeff 48%, #50f0b4 94%);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 770px;
          margin: 0;
          color: #9eb0c4;
          font-size: clamp(1.05rem, 1.8vw, 1.28rem);
          line-height: 1.78;
        }

        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

        .principle-card {
          position: relative;
          padding: 30px;
          overflow: hidden;
          border: 1px solid rgba(84, 232, 255, .20);
          border-radius: 28px;
          background: linear-gradient(180deg, rgba(15, 31, 49, .89), rgba(5, 13, 22, .94));
          box-shadow: 0 34px 90px rgba(0, 0, 0, .32);
        }

        .principle-card::before {
          content: "14";
          position: absolute;
          right: 20px;
          bottom: -36px;
          color: rgba(255,255,255,.035);
          font-size: 11rem;
          font-weight: 1000;
          letter-spacing: -.1em;
        }

        .principle-card strong {
          position: relative;
          display: block;
          margin-top: 18px;
          font-size: clamp(1.8rem, 3vw, 2.75rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .principle-card p {
          position: relative;
          margin: 20px 0 0;
          color: #91a7bb;
          line-height: 1.7;
        }

        .section { margin-top: 88px; }
        .section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 34px;
          margin-bottom: 28px;
        }
        .section-head h2 {
          max-width: 780px;
          margin: 12px 0 0;
          font-size: clamp(2.2rem, 5vw, 4.3rem);
          line-height: .98;
          letter-spacing: -.06em;
        }
        .section-head p {
          max-width: 450px;
          margin: 0;
          color: #91a5b9;
          line-height: 1.7;
        }

        .chain-panel {
          padding: 26px;
          border: 1px solid rgba(135, 173, 211, .15);
          border-radius: 26px;
          background: rgba(7, 16, 27, .72);
          box-shadow: 0 30px 90px rgba(0,0,0,.25);
        }

        .chain-grid {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 10px;
        }

        .chain-step {
          position: relative;
          min-height: 118px;
          padding: 16px;
          overflow: hidden;
          border: 1px solid rgba(135, 173, 211, .14);
          border-radius: 18px;
          color: #eef7ff;
          background: linear-gradient(180deg, rgba(13, 27, 43, .84), rgba(4, 11, 19, .86));
          font-weight: 900;
        }

        .chain-step span {
          display: block;
          margin-bottom: 22px;
          color: #58748d;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: .7rem;
          letter-spacing: .14em;
        }

        .chain-step::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, #29a7ff, #54e8ff, #39f2a1);
          opacity: .68;
        }

        .module-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .module-card {
          position: relative;
          display: flex;
          min-height: 390px;
          flex-direction: column;
          padding: 28px;
          overflow: hidden;
          border: 1px solid rgba(137, 174, 213, .15);
          border-radius: 26px;
          background: linear-gradient(180deg, rgba(14, 27, 44, .87), rgba(5, 12, 21, .94));
          box-shadow: 0 28px 80px rgba(0,0,0,.24);
          transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
        }

        .module-card:hover {
          transform: translateY(-4px);
          border-color: rgba(84, 232, 255, .34);
          box-shadow: 0 34px 100px rgba(0,0,0,.34);
        }

        .module-card::before {
          content: "";
          position: absolute;
          top: -100px;
          right: -70px;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          opacity: .14;
          filter: blur(18px);
        }
        .module-card.cyan::before { background: #49dfff; }
        .module-card.green::before { background: #48efa7; }
        .module-card.violet::before { background: #8f78ff; }
        .module-card.amber::before { background: #ffc65c; }

        .module-top, .module-bottom {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .module-number {
          color: #5b748c;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: .78rem;
          font-weight: 950;
          letter-spacing: .13em;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 0 10px;
          border: 1px solid rgba(84, 232, 255, .17);
          border-radius: 999px;
          color: #9beeff;
          background: rgba(7, 18, 29, .72);
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .module-phase {
          position: relative;
          margin-top: 48px;
          color: #6adff6;
          font-size: .72rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .module-card h3 {
          position: relative;
          margin: 10px 0 14px;
          font-size: clamp(1.65rem, 3vw, 2.45rem);
          line-height: 1.02;
          letter-spacing: -.05em;
        }

        .module-card > p {
          position: relative;
          margin: 0;
          color: #91a5b9;
          line-height: 1.68;
        }

        .outcome {
          position: relative;
          margin-top: 22px;
          padding: 15px;
          border: 1px solid rgba(137, 174, 213, .12);
          border-radius: 14px;
          color: #a9bbcd;
          background: rgba(2, 8, 14, .40);
          font-size: .86rem;
          line-height: 1.55;
        }
        .outcome strong { color: #e7f3fc; }

        .module-bottom {
          align-items: flex-end;
          margin-top: auto;
          padding-top: 26px;
        }

        .module-link {
          min-height: 42px;
          border: 1px solid rgba(84, 232, 255, .22);
          color: #e6f8ff;
          background: rgba(14, 34, 52, .84);
        }

        .loop-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .loop-card {
          padding: 22px;
          border: 1px solid rgba(137, 174, 213, .14);
          border-radius: 20px;
          background: rgba(7, 16, 27, .66);
        }
        .loop-card span {
          color: #63e9ff;
          font-size: .72rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .loop-card h3 { margin: 12px 0 8px; font-size: 1.4rem; }
        .loop-card p { margin: 0; color: #91a5b9; line-height: 1.62; }

        .cta-panel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 28px;
          align-items: center;
          margin-top: 88px;
          padding: clamp(28px, 5vw, 50px);
          overflow: hidden;
          border: 1px solid rgba(84, 232, 255, .22);
          border-radius: 30px;
          background:
            radial-gradient(circle at 85% 40%, rgba(57, 242, 161, .11), transparent 30%),
            linear-gradient(110deg, rgba(18, 41, 61, .95), rgba(6, 15, 25, .96));
          box-shadow: 0 35px 100px rgba(0,0,0,.30);
        }
        .cta-panel h2 {
          margin: 12px 0 14px;
          font-size: clamp(2rem, 4vw, 3.8rem);
          line-height: 1;
          letter-spacing: -.055em;
        }
        .cta-panel p { max-width: 760px; margin: 0; color: #9db1c5; line-height: 1.72; }

        .boundary {
          margin-top: 24px;
          padding: 20px 22px;
          border: 1px solid rgba(255, 212, 106, .15);
          border-radius: 17px;
          color: #bfb38a;
          background: rgba(255, 212, 106, .045);
          line-height: 1.68;
        }
        .boundary strong { color: #e9dca9; }

        @media (max-width: 1060px) {
          .hero { grid-template-columns: 1fr; }
          .chain-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }

        @media (max-width: 820px) {
          .topbar, .section-head { align-items: flex-start; flex-direction: column; }
          .module-grid, .loop-grid { grid-template-columns: 1fr; }
          .cta-panel { grid-template-columns: 1fr; }
        }

        @media (max-width: 620px) {
          .shell { width: min(94vw, 1240px); padding-top: 18px; }
          .nav-actions { display: none; }
          .topbar { margin-bottom: 54px; }
          .hero h1 { font-size: 3.55rem; }
          .chain-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .module-card { min-height: 0; padding: 22px; }
          .module-bottom { align-items: stretch; flex-direction: column; }
          .module-link, .primary, .secondary { width: 100%; }
        }
      `}</style>

      <div className="shell">
        <nav className="topbar" aria-label="Academy navigation">
          <Link className="brand" href="/">
            <span className="brand-mark">14</span>
            <span>TA-14 ACADEMY</span>
          </Link>

          <div className="nav-actions">
            <Link className="nav-link" href="/workspace">
              Workspace
            </Link>
            <Link className="nav-link" href="/workspace/demonstrations">
              Demonstrations
            </Link>
            <Link className="nav-link" href="/verify">
              Verify a record
            </Link>
          </div>
        </nav>

        <section className="hero">
          <div>
            <div className="eyebrow">TA-14 Academy of Admissible Execution Governance</div>
            <h1>
              Learn to build <span className="gradient">governance that survives consequence.</span>
            </h1>
            <p className="hero-copy">
              The Academy teaches people how to identify a consequential route, construct its
              evidence and authority boundary, test it before execution, correct failures without
              erasing history, preserve the resulting record, and verify what actually occurred.
            </p>

            <div className="hero-actions">
              <Link className="primary" href="/workspace/demonstrations">
                Begin with a live route →
              </Link>
              <Link className="secondary" href="/workspace">
                Open the Exchange Workspace
              </Link>
            </div>
          </div>

          <aside className="principle-card">
            <div className="eyebrow">Governing principle</div>
            <strong>No admissible evidence. No admissible execution.</strong>
            <p>
              Education does not end with explanation. Every principle is intended to open into a
              practical route-building, testing, correction, preservation, or verification task.
            </p>
          </aside>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">The architecture learners must understand</div>
              <h2>One chain from reality to outcome.</h2>
            </div>
            <p>
              Each stage protects a different part of execution legitimacy. Skipping a stage does
              not make the route faster; it makes the consequence harder to defend.
            </p>
          </div>

          <div className="chain-panel">
            <div className="chain-grid" aria-label="TA-14 admissible execution chain">
              {chain.map((stage, index) => (
                <div className="chain-step" key={stage}>
                  <span>0{index + 1}</span>
                  {stage}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="curriculum-title">
          <div className="section-head">
            <div>
              <div className="eyebrow">Interactive curriculum</div>
              <h2 id="curriculum-title">Eight modules. One governed route.</h2>
            </div>
            <p>
              Start with the concept, move into the Exchange, produce an observable route state,
              and return with an artifact that can be inspected rather than merely claimed.
            </p>
          </div>

          <div className="module-grid">
            {modules.map((module) => (
              <article className={`module-card ${module.accent}`} key={module.number}>
                <div className="module-top">
                  <span className="module-number">MODULE {module.number}</span>
                  <span className="status-pill">{module.status}</span>
                </div>

                <div className="module-phase">{module.phase}</div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>

                <div className="outcome">
                  <strong>Learning outcome:</strong> {module.outcome}
                </div>

                <div className="module-bottom">
                  <Link className="module-link" href={module.href}>
                    Open module →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Academy learning loop</div>
              <h2>Knowledge becomes a governed artifact.</h2>
            </div>
            <p>
              The Academy and Exchange are connected. Learners should repeatedly move between
              explanation, construction, testing, correction, preservation, and verification.
            </p>
          </div>

          <div className="loop-grid">
            {learningLoop.map((item, index) => (
              <article className="loop-card" key={item.step}>
                <span>0{index + 1}</span>
                <h3>{item.step}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-panel">
          <div>
            <div className="eyebrow">Begin inside the working engine</div>
            <h2>Watch an inadmissible route stop before you study why.</h2>
            <p>
              The current public demonstration lets a learner run an incomplete consequential
              payment route, inspect the HOLD, add the missing authority and beneficiary proof,
              preserve the original failure, generate an AER, and open the resulting registry
              record.
            </p>
          </div>

          <Link className="primary" href="/workspace/demonstrations">
            Launch the first practical →
          </Link>
        </section>

        <div className="boundary">
          <strong>Current Academy release boundary:</strong> the Academy hub, conceptual pathway,
          live demonstrations, existing learning page, verification surface, and permanent lab
          routes are now connected. Modules marked “Lab pathway” point to their permanent Exchange
          locations while their dedicated interactive lesson bodies are built sequentially. The
          working consequential-payment route remains the live instructional engine and is not
          represented as a completed domain engine for every governance context.
        </div>
      </div>
    </main>
  );
}
