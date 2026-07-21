import Link from 'next/link';

const readinessItems = [
  {
    title: 'Declared review domain',
    description:
      'Identify the exact governance, evidence, technical, operational, or domain-specific work you are qualified to review.',
  },
  {
    title: 'Documented methodology',
    description:
      'Show how your review process reaches bounded findings, preserves uncertainty, and avoids unsupported conclusions.',
  },
  {
    title: 'Evidence of prior work',
    description:
      'Provide representative materials, anonymized reports, publications, architectures, or other evidence of demonstrated capability.',
  },
  {
    title: 'Boundary discipline',
    description:
      'State what you can review, what you cannot review, when you must escalate, and where another specialist is required.',
  },
  {
    title: 'Independent review readiness',
    description:
      'Be prepared for TA-14 to inspect the evidence, challenge assumptions, request clarification, and issue an adverse determination.',
  },
  {
    title: 'Professional accountability',
    description:
      'Confirm that reviewers will work only within declared authority and will preserve conflicts, limitations, and uncertainty.',
  },
];

const evaluationAreas = [
  'Governance architecture and operating method',
  'Evidence qualification and provenance practices',
  'Declared reviewer authority and limitations',
  'Continuity, binding, and execution awareness',
  'Handling of HOLD, DENY, and ESCALATE outcomes',
  'Independence, conflicts, and professional accountability',
  'Ability to produce bounded, inspectable review records',
  'Fit for a defined Partner Review Network lane',
];

const possibleOutcomes = [
  {
    status: 'QUALIFIED',
    description:
      'The applicant may proceed toward onboarding within an explicitly approved review lane.',
  },
  {
    status: 'QUALIFIED WITH CONDITIONS',
    description:
      'The applicant may proceed after completing specified corrections, restrictions, or additional evidence requirements.',
  },
  {
    status: 'DEFERRED',
    description:
      'The application is not ready for a final determination. Additional material, operating history, or clarification is required.',
  },
  {
    status: 'NOT QUALIFIED',
    description:
      'The submitted material does not currently support admission to the Partner Review Network.',
  },
];

export default function PartnerReviewNetworkPricingPage() {
  return (
    <>
      <main className="prn-page">
        <div className="cosmic-layer cosmic-layer-one" aria-hidden="true" />
        <div className="cosmic-layer cosmic-layer-two" aria-hidden="true" />
        <div className="orbit orbit-one" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />

        <header className="topbar">
          <Link href="/" className="brand" aria-label="Return to the TA-14 AI Governance Exchange homepage">
            <span className="brand-mark">TA-14</span>
            <span className="brand-copy">
              <strong>TA-14 AI Governance Exchange</strong>
              <small>Partner Review Network</small>
            </span>
          </Link>

          <nav className="topnav" aria-label="Partner Review Network navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#readiness">Readiness</a>
            <a href="#outcomes">Outcomes</a>
            <Link href="/workspace/entity-review">Entity Review Center</Link>
          </nav>
        </header>

        <section className="hero" aria-labelledby="page-title">
          <div className="eyebrow">PARTNER REVIEW NETWORK QUALIFICATION</div>
          <h1 id="page-title">
            Is your governance ready to stand up to bounded review?
          </h1>
          <p className="hero-copy">
            The TA-14 Partner Review Network is reserved for governance organizations,
            evidence specialists, cybersecurity teams, controls professionals, runtime
            systems, and domain experts that can perform consequence-bearing review
            within clearly declared boundaries.
          </p>

          <div className="hero-actions">
            <Link
              className="button button-primary"
              href="/workspace/entity-review/partner-review-network/apply"
            >
              Begin Qualification
              <span aria-hidden="true">→</span>
            </Link>
            <a className="button button-secondary" href="#readiness">
              Review Readiness Requirements
            </a>
          </div>

          <div className="hero-notice">
            <span className="notice-icon" aria-hidden="true">◇</span>
            <p>
              Admission cannot be purchased. The qualification fee covers the review
              of submitted materials and the bounded evaluation process. Payment does
              not guarantee acceptance, certification, favorable findings, review
              assignments, or revenue.
            </p>
          </div>
        </section>

        <section className="price-section" aria-label="Qualification review pricing">
          <article className="price-card">
            <div className="price-card-glow" aria-hidden="true" />
            <div className="price-label">PARTNER QUALIFICATION REVIEW</div>

            <div className="price-row">
              <span className="currency">$</span>
              <span className="price">450</span>
            </div>

            <p className="price-description">
              A bounded first-pass review of your submitted governance materials,
              declared review domain, operating method, evidence practices, and
              readiness for a possible Partner Review Network lane.
            </p>

            <div className="price-includes">
              <h2>Included in the qualification review</h2>
              <ul>
                <li>Applicant and organization identity review</li>
                <li>Declared domain and reviewer-boundary assessment</li>
                <li>Submitted methodology and evidence-package review</li>
                <li>Governance discipline and uncertainty-preservation review</li>
                <li>Written qualification determination</li>
                <li>Correction requirements when applicable</li>
              </ul>
            </div>

            <Link
              className="button button-primary button-wide"
              href="/workspace/entity-review/partner-review-network/apply"
            >
              I am ready to be evaluated
              <span aria-hidden="true">→</span>
            </Link>

            <p className="payment-boundary">
              The next step begins the qualification questionnaire and supporting
              material submission. Payment processing should occur only after the
              applicant has reviewed and accepted the qualification terms.
            </p>
          </article>

          <aside className="decision-panel">
            <div className="decision-kicker">BEFORE YOU BEGIN</div>
            <h2>Are you ready, willing, and able?</h2>

            <div className="decision-item">
              <span>01</span>
              <div>
                <strong>Ready</strong>
                <p>
                  You have real governance material, methods, boundaries, and prior
                  work available for inspection.
                </p>
              </div>
            </div>

            <div className="decision-item">
              <span>02</span>
              <div>
                <strong>Willing</strong>
                <p>
                  You accept that TA-14 may identify missing evidence, unsupported
                  claims, weak boundaries, or reasons to HOLD or deny qualification.
                </p>
              </div>
            </div>

            <div className="decision-item">
              <span>03</span>
              <div>
                <strong>Able</strong>
                <p>
                  You can perform work only within declared authority, preserve
                  uncertainty, and produce review findings that others can inspect.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section id="how-it-works" className="section">
          <div className="section-heading">
            <div className="eyebrow">HOW QUALIFICATION WORKS</div>
            <h2>One fee. A bounded evaluation. No automatic acceptance.</h2>
            <p>
              The qualification process is designed to determine whether an applicant
              should enter the Partner Review Network, under what boundaries, and in
              which review lane.
            </p>
          </div>

          <div className="process-grid">
            <article>
              <span>01</span>
              <h3>Review the requirements</h3>
              <p>
                Confirm that your organization, methods, evidence, and declared
                expertise fit the purpose of the network.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Complete the questionnaire</h3>
              <p>
                Declare your domain, review method, authority, limitations, conflicts,
                and intended Partner Review Network role.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Upload supporting material</h3>
              <p>
                Submit reports, architectures, methods, prior work, policies, evidence
                packages, or other material needed for evaluation.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>Receive a determination</h3>
              <p>
                TA-14 issues a bounded qualification result with findings, limitations,
                conditions, or correction requirements.
              </p>
            </article>
          </div>
        </section>

        <section id="readiness" className="section section-muted">
          <div className="section-heading">
            <div className="eyebrow">READINESS REQUIREMENTS</div>
            <h2>What a serious applicant should already have.</h2>
            <p>
              The qualification review is not intended to create an applicant&apos;s
              governance practice for them. It evaluates the practice, evidence, and
              boundaries the applicant already brings.
            </p>
          </div>

          <div className="readiness-grid">
            {readinessItems.map((item, index) => (
              <article key={item.title} className="readiness-card">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="two-column">
            <div>
              <div className="eyebrow">WHAT TA-14 EVALUATES</div>
              <h2>Qualification is based on evidence—not confidence.</h2>
              <p className="section-copy">
                The review does not ask only whether the applicant understands
                governance language. It examines whether their operating method can
                support bounded, consequence-aware review.
              </p>
            </div>

            <ul className="evaluation-list">
              {evaluationAreas.map((area) => (
                <li key={area}>
                  <span aria-hidden="true">✓</span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="outcomes" className="section section-muted">
          <div className="section-heading">
            <div className="eyebrow">POSSIBLE DETERMINATIONS</div>
            <h2>The fee purchases review—not a favorable result.</h2>
          </div>

          <div className="outcome-grid">
            {possibleOutcomes.map((outcome) => (
              <article key={outcome.status}>
                <div className="outcome-status">{outcome.status}</div>
                <p>{outcome.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="boundary-section">
          <div>
            <div className="eyebrow">QUALIFICATION BOUNDARY</div>
            <h2>What the $450 review does—and does not—mean.</h2>
          </div>

          <div className="boundary-grid">
            <article className="boundary-card positive">
              <h3>It does mean</h3>
              <ul>
                <li>Your submitted materials will receive a bounded first-pass review.</li>
                <li>Your declared expertise and review boundaries will be evaluated.</li>
                <li>You will receive a qualification determination.</li>
                <li>Material findings or required corrections will be preserved.</li>
              </ul>
            </article>

            <article className="boundary-card negative">
              <h3>It does not mean</h3>
              <ul>
                <li>Automatic admission to the Partner Review Network.</li>
                <li>TA-14 certification of your entire organization or product.</li>
                <li>A guaranteed favorable finding.</li>
                <li>Guaranteed client referrals, assignments, revenue, or exclusivity.</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="final-cta">
          <div>
            <div className="eyebrow">READY TO PROCEED?</div>
            <h2>Bring the evidence. Declare the boundary. Accept the result.</h2>
            <p>
              The questionnaire will collect your organization details, declared review
              domain, operating method, supporting material, conflicts, limitations,
              and readiness acknowledgments.
            </p>
          </div>

          <Link
            className="button button-primary"
            href="/workspace/entity-review/partner-review-network/apply"
          >
            Begin Partner Qualification
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        <footer className="footer">
          <div>
            <strong>TA-14 Authority Governance Institution</strong>
            <p>No admissible evidence. No admissible execution.</p>
          </div>

          <div className="footer-links">
            <Link href="/">Exchange Home</Link>
            <Link href="/workspace/entity-review">Entity Review Center</Link>
            <Link href="/workspace">Open Workspace</Link>
          </div>
        </footer>
      </main>

      <style>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #050b16;
        }

        a {
          color: inherit;
        }

        .prn-page {
          --bg: #050b16;
          --surface: rgba(8, 17, 31, 0.86);
          --surface-strong: rgba(11, 23, 40, 0.96);
          --line: rgba(139, 170, 207, 0.18);
          --text: #f5f8ff;
          --muted: #aab7cb;
          --mint: #6ee7c8;
          --gold: #ffbf3f;
          --gold-soft: #ffe29a;
          min-height: 100vh;
          overflow: hidden;
          position: relative;
          color: var(--text);
          background:
            radial-gradient(circle at 50% -10%, rgba(25, 93, 120, 0.18), transparent 34rem),
            radial-gradient(circle at 90% 35%, rgba(255, 176, 32, 0.09), transparent 28rem),
            linear-gradient(180deg, #07101f 0%, var(--bg) 48%, #030812 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
        }

        .cosmic-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.48;
          background-repeat: repeat;
        }

        .cosmic-layer-one {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.62) 0 1px, transparent 1.4px),
            radial-gradient(circle, rgba(110,231,200,.52) 0 1px, transparent 1.5px);
          background-size: 170px 170px, 260px 260px;
          background-position: 10px 20px, 90px 120px;
          animation: starDrift 42s linear infinite;
        }

        .cosmic-layer-two {
          background-image:
            radial-gradient(circle, rgba(255,191,63,.4) 0 1px, transparent 1.7px);
          background-size: 330px 330px;
          background-position: 140px 80px;
          animation: starDriftReverse 58s linear infinite;
        }

        .orbit {
          position: absolute;
          width: 46rem;
          height: 46rem;
          border: 1px solid rgba(110, 231, 200, 0.08);
          border-radius: 999px;
          pointer-events: none;
        }

        .orbit-one {
          top: 17rem;
          left: -27rem;
        }

        .orbit-two {
          top: 58rem;
          right: -31rem;
          border-color: rgba(255, 191, 63, 0.08);
        }

        .topbar,
        .hero,
        .price-section,
        .section,
        .boundary-section,
        .final-cta,
        .footer {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 40px));
          margin-inline: auto;
        }

        .topbar {
          min-height: 86px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid var(--line);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          text-decoration: none;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          min-width: 64px;
          height: 42px;
          border: 1px solid rgba(110,231,200,.45);
          border-radius: 12px;
          color: var(--mint);
          font-weight: 900;
          letter-spacing: .06em;
          background: rgba(110,231,200,.06);
          box-shadow: inset 0 0 20px rgba(110,231,200,.04);
        }

        .brand-copy {
          display: grid;
          gap: 2px;
        }

        .brand-copy strong {
          font-size: .94rem;
        }

        .brand-copy small {
          color: var(--muted);
          font-size: .74rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .topnav {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .topnav a,
        .footer-links a {
          text-decoration: none;
          color: var(--muted);
          border: 1px solid transparent;
          border-radius: 999px;
          padding: 9px 13px;
          font-size: .86rem;
          transition: .2s ease;
        }

        .topnav a:hover,
        .topnav a:focus-visible,
        .footer-links a:hover,
        .footer-links a:focus-visible {
          color: var(--text);
          border-color: rgba(110,231,200,.28);
          background: rgba(110,231,200,.06);
          outline: none;
        }

        .hero {
          padding: 100px 0 64px;
          text-align: center;
        }

        .eyebrow,
        .price-label,
        .decision-kicker {
          color: var(--mint);
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
          font-size: .78rem;
        }

        .hero h1 {
          max-width: 980px;
          margin: 18px auto 22px;
          font-size: clamp(2.8rem, 6vw, 5.6rem);
          line-height: .96;
          letter-spacing: -.055em;
        }

        .hero-copy {
          max-width: 820px;
          margin: 0 auto;
          color: var(--muted);
          font-size: clamp(1rem, 1.8vw, 1.26rem);
          line-height: 1.75;
        }

        .hero-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }

        .button {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          padding: 0 22px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 850;
          border: 1px solid transparent;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }

        .button:hover,
        .button:focus-visible {
          transform: translateY(-2px);
          outline: none;
        }

        .button-primary {
          color: #231500;
          background: linear-gradient(135deg, #ffe29a 0%, var(--gold) 55%, #e18b00 100%);
          box-shadow: 0 14px 38px rgba(255, 174, 22, .18), inset 0 1px rgba(255,255,255,.62);
        }

        .button-primary:hover,
        .button-primary:focus-visible {
          box-shadow: 0 18px 46px rgba(255, 174, 22, .27), inset 0 1px rgba(255,255,255,.72);
        }

        .button-secondary {
          color: var(--text);
          border-color: rgba(148, 175, 210, .24);
          background: rgba(10,20,36,.76);
        }

        .button-secondary:hover,
        .button-secondary:focus-visible {
          border-color: rgba(110,231,200,.42);
          box-shadow: 0 14px 34px rgba(0,0,0,.22);
        }

        .button-wide {
          width: 100%;
        }

        .hero-notice {
          max-width: 900px;
          margin: 36px auto 0;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px 20px;
          text-align: left;
          border: 1px solid rgba(255,191,63,.22);
          border-radius: 16px;
          background: rgba(255,191,63,.055);
        }

        .hero-notice p,
        .payment-boundary {
          margin: 0;
          color: #c9d2df;
          line-height: 1.65;
          font-size: .92rem;
        }

        .notice-icon {
          color: var(--gold);
          font-size: 1.35rem;
          line-height: 1.2;
        }

        .price-section {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(320px, .9fr);
          gap: 22px;
          align-items: stretch;
          padding: 42px 0 84px;
        }

        .price-card,
        .decision-panel,
        .process-grid article,
        .readiness-card,
        .outcome-grid article,
        .boundary-card {
          border: 1px solid var(--line);
          background: linear-gradient(180deg, rgba(12,24,42,.94), rgba(6,14,27,.9));
          box-shadow: 0 28px 70px rgba(0,0,0,.22);
        }

        .price-card {
          position: relative;
          overflow: hidden;
          border-color: rgba(255,191,63,.34);
          border-radius: 26px;
          padding: clamp(28px, 5vw, 54px);
        }

        .price-card-glow {
          position: absolute;
          width: 28rem;
          height: 28rem;
          top: -19rem;
          right: -8rem;
          border-radius: 50%;
          background: rgba(255,191,63,.15);
          filter: blur(70px);
          pointer-events: none;
        }

        .price-label {
          color: var(--gold-soft);
        }

        .price-row {
          display: flex;
          align-items: flex-start;
          margin: 12px 0;
          line-height: 1;
        }

        .currency {
          margin-top: 15px;
          color: var(--gold);
          font-size: 2rem;
          font-weight: 900;
        }

        .price {
          color: #fff9e8;
          font-size: clamp(5rem, 10vw, 8.5rem);
          letter-spacing: -.08em;
          font-weight: 950;
          text-shadow: 0 0 34px rgba(255,191,63,.14);
        }

        .price-description,
        .section-heading p,
        .section-copy {
          color: var(--muted);
          line-height: 1.72;
        }

        .price-includes {
          margin: 30px 0;
          padding: 24px;
          border-radius: 18px;
          border: 1px solid rgba(148,175,210,.15);
          background: rgba(2,8,18,.44);
        }

        .price-includes h2 {
          margin: 0 0 18px;
          font-size: 1.05rem;
        }

        .price-includes ul,
        .evaluation-list,
        .boundary-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 13px;
        }

        .price-includes li,
        .evaluation-list li,
        .boundary-card li {
          color: #d4dce8;
          line-height: 1.5;
        }

        .price-includes li::before {
          content: "✓";
          margin-right: 10px;
          color: var(--mint);
          font-weight: 900;
        }

        .payment-boundary {
          margin-top: 16px;
          font-size: .82rem;
          text-align: center;
        }

        .decision-panel {
          border-radius: 26px;
          padding: clamp(28px, 4vw, 46px);
        }

        .decision-panel h2 {
          margin: 12px 0 28px;
          font-size: clamp(2rem, 4vw, 3.4rem);
          letter-spacing: -.045em;
          line-height: 1.02;
        }

        .decision-item {
          display: grid;
          grid-template-columns: 52px 1fr;
          gap: 14px;
          padding: 22px 0;
          border-top: 1px solid var(--line);
        }

        .decision-item > span {
          color: var(--gold);
          font-weight: 900;
        }

        .decision-item strong {
          display: block;
          font-size: 1.12rem;
        }

        .decision-item p {
          color: var(--muted);
          margin: 7px 0 0;
          line-height: 1.63;
        }

        .section,
        .boundary-section {
          padding: 90px 0;
        }

        .section-muted {
          width: 100%;
          padding-inline: max(20px, calc((100% - 1180px) / 2));
          background: rgba(10,20,35,.52);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }

        .section-heading {
          max-width: 800px;
          margin-bottom: 38px;
        }

        .section-heading h2,
        .two-column h2,
        .boundary-section h2,
        .final-cta h2 {
          margin: 12px 0 14px;
          font-size: clamp(2.2rem, 4.8vw, 4.4rem);
          line-height: 1.02;
          letter-spacing: -.05em;
        }

        .process-grid,
        .outcome-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .process-grid article,
        .readiness-card,
        .outcome-grid article {
          border-radius: 20px;
          padding: 25px;
        }

        .process-grid article > span,
        .readiness-card > span {
          display: inline-grid;
          place-items: center;
          min-width: 42px;
          height: 34px;
          border-radius: 10px;
          color: var(--mint);
          border: 1px solid rgba(110,231,200,.28);
          background: rgba(110,231,200,.06);
          font-size: .82rem;
          font-weight: 900;
        }

        .process-grid h3,
        .readiness-card h3 {
          margin: 20px 0 9px;
          font-size: 1.12rem;
        }

        .process-grid p,
        .readiness-card p,
        .outcome-grid p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .readiness-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .two-column {
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
          gap: clamp(36px, 7vw, 96px);
          align-items: start;
        }

        .evaluation-list {
          border: 1px solid var(--line);
          border-radius: 22px;
          padding: 28px;
          background: rgba(8,17,31,.72);
        }

        .evaluation-list li {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 9px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(148,175,210,.1);
        }

        .evaluation-list li:last-child {
          border-bottom: 0;
        }

        .evaluation-list span {
          color: var(--mint);
          font-weight: 900;
        }

        .outcome-grid article {
          min-height: 180px;
        }

        .outcome-status {
          display: inline-flex;
          min-height: 34px;
          align-items: center;
          padding: 0 11px;
          border-radius: 999px;
          border: 1px solid rgba(255,191,63,.28);
          color: var(--gold-soft);
          background: rgba(255,191,63,.06);
          font-size: .75rem;
          font-weight: 900;
          letter-spacing: .08em;
        }

        .outcome-grid p {
          margin-top: 25px;
        }

        .boundary-section {
          display: grid;
          grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
          gap: clamp(34px, 7vw, 90px);
          align-items: start;
        }

        .boundary-grid {
          display: grid;
          gap: 14px;
        }

        .boundary-card {
          border-radius: 20px;
          padding: 26px;
        }

        .boundary-card h3 {
          margin: 0 0 18px;
        }

        .boundary-card li {
          position: relative;
          padding-left: 24px;
        }

        .boundary-card li::before {
          position: absolute;
          left: 0;
          font-weight: 900;
        }

        .boundary-card.positive {
          border-color: rgba(110,231,200,.24);
        }

        .boundary-card.positive li::before {
          content: "✓";
          color: var(--mint);
        }

        .boundary-card.negative {
          border-color: rgba(255,191,63,.24);
        }

        .boundary-card.negative li::before {
          content: "—";
          color: var(--gold);
        }

        .final-cta {
          margin-top: 30px;
          margin-bottom: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 34px;
          padding: clamp(30px, 5vw, 52px);
          border-radius: 26px;
          border: 1px solid rgba(255,191,63,.28);
          background:
            linear-gradient(120deg, rgba(255,191,63,.08), transparent 50%),
            rgba(9,18,32,.9);
          box-shadow: 0 32px 80px rgba(0,0,0,.24);
        }

        .final-cta > div {
          max-width: 740px;
        }

        .final-cta p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .footer {
          min-height: 140px;
          padding: 35px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 26px;
          border-top: 1px solid var(--line);
        }

        .footer p {
          margin: 7px 0 0;
          color: var(--muted);
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 6px;
        }

        @keyframes starDrift {
          to {
            transform: translate3d(-170px, 170px, 0);
          }
        }

        @keyframes starDriftReverse {
          to {
            transform: translate3d(200px, -170px, 0);
          }
        }

        @media (max-width: 980px) {
          .topbar {
            padding: 16px 0;
            align-items: flex-start;
          }

          .topnav {
            display: none;
          }

          .price-section,
          .two-column,
          .boundary-section {
            grid-template-columns: 1fr;
          }

          .process-grid,
          .outcome-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .readiness-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .final-cta {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .topbar,
          .hero,
          .price-section,
          .section,
          .boundary-section,
          .final-cta,
          .footer {
            width: min(100% - 24px, 1180px);
          }

          .hero {
            padding-top: 72px;
          }

          .hero-actions,
          .hero-actions .button {
            width: 100%;
          }

          .hero-notice {
            padding: 16px;
          }

          .price-section {
            padding-top: 18px;
          }

          .process-grid,
          .readiness-grid,
          .outcome-grid {
            grid-template-columns: 1fr;
          }

          .section-muted {
            width: 100%;
            padding-inline: 12px;
          }

          .price-card,
          .decision-panel {
            border-radius: 20px;
          }

          .final-cta {
            margin-inline: 12px;
          }

          .final-cta .button {
            width: 100%;
          }

          .footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .footer-links {
            justify-content: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .cosmic-layer {
            animation: none;
          }

          .button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
