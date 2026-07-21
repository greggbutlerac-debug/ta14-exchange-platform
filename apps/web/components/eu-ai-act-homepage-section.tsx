// apps/web/components/eu-ai-act-homepage-section.tsx
'use client';

import Link from 'next/link';

const primaryPaths = [
  {
    eyebrow: 'START HERE',
    title: 'Explore the EU AI Act',
    description:
      'Enter the guided governance laboratory and move from a plain-language question into roles, risk pathways, Articles, Annexes, evidence, and governed implementation routes.',
    href: '/eu-ai-act',
    cta: 'Open the EU AI Act Laboratory',
    featured: true,
  },
  {
    eyebrow: 'EVERY REQUIREMENT',
    title: 'Requirements Registry',
    description:
      'Browse the Act as structured obligations rather than a single wall of legal text. Inspect role, trigger, evidence expectation, exception, status, and connected governance routes.',
    href: '/eu-ai-act/requirements',
    cta: 'Browse Every Requirement',
  },
  {
    eyebrow: 'ARTICLE 50',
    title: 'Transparency Workspace',
    description:
      'Explore provider and deployer transparency routes for direct interaction, machine-readable marking, detectability, deepfakes, and public-interest text.',
    href: '/eu-ai-act/article-50',
    cta: 'Open Article 50',
  },
  {
    eyebrow: 'HIGH-RISK SYSTEMS',
    title: 'High-Risk Lifecycle',
    description:
      'Move from preliminary classification through risk management, data governance, documentation, oversight, conformity, deployment, monitoring, and incident response.',
    href: '/eu-ai-act/high-risk',
    cta: 'Open High-Risk Workspace',
  },
  {
    eyebrow: 'ARTICLE 27',
    title: 'Fundamental Rights',
    description:
      'Preserve the deployer process, affected persons, harm pathways, oversight, mitigation, complaint, remedy, notification, and reassessment record.',
    href: '/eu-ai-act/fundamental-rights',
    cta: 'Open FRIA Workspace',
  },
];

const capabilities = [
  {
    number: '01',
    title: 'Learn',
    description:
      'Open plain-language explanations linked to the controlling Articles, Annexes, Recitals, and official-source categories.',
  },
  {
    number: '02',
    title: 'Model',
    description:
      'Describe an AI system, model, product, role, geography, use case, and affected population without beginning inside a legal database.',
  },
  {
    number: '03',
    title: 'Map',
    description:
      'Turn applicable duties into evidence expectations, governed records, declared gaps, reviewers, and unresolved assumptions.',
  },
  {
    number: '04',
    title: 'Build',
    description:
      'Convert selected obligations into an ordered TA-14 governance route with explicit gates, authorities, thresholds, holds, and outcomes.',
  },
  {
    number: '05',
    title: 'Test',
    description:
      'Run bounded scenarios against declared controls and expose missing, stale, unsupported, substituted, or disconnected evidence.',
  },
  {
    number: '06',
    title: 'Preserve',
    description:
      'Create source-dated records and receipts without presenting a demonstration as legal advice, certification, or regulator action.',
  },
];

export default function EuAiActHomepageSection() {
  return (
    <section className="eu-act-section" aria-labelledby="eu-ai-act-homepage-title">
      <div className="ambient" aria-hidden="true">
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="moving-line line-one" />
        <span className="moving-line line-two" />
        <span className="orb orb-one" />
        <span className="orb orb-two" />
      </div>

      <div className="section-shell">
        <header className="section-header">
          <div className="heading-copy">
            <span className="eyebrow">REGULATION (EU) 2024/1689</span>
            <h2 id="eu-ai-act-homepage-title">
              The European Union Artificial Intelligence Act is now part of the TA-14 front door.
            </h2>
            <p>
              Find the requirements that may apply to your AI system, model, role, and use case.
              Open the controlling pathways, identify evidence expectations, expose unresolved
              assumptions, and build a bounded TA-14 governance route without reading the entire
              Regulation before you can begin.
            </p>
          </div>

          <div className="status-card">
            <span>PUBLIC GOVERNANCE LABORATORY</span>
            <strong>EU AI ACT</strong>
            <p>
              Guided learning, system modeling, requirement mapping, route building, bounded
              testing, and source-dated preservation.
            </p>
            <Link href="/eu-ai-act">Enter the laboratory</Link>
          </div>
        </header>

        <div className="boundary-banner">
          <div>
            <span>BOUNDARY</span>
            <strong>Source-linked governance assistance—not legal advice or certification.</strong>
          </div>
          <p>
            Outputs remain preliminary and bounded until the relevant facts, official sources,
            evidence, role, system version, jurisdiction, exceptions, and professional review are
            established.
          </p>
        </div>

        <div className="door-grid">
          {primaryPaths.map((path) => (
            <Link
              className={path.featured ? 'door-card featured' : 'door-card'}
              href={path.href}
              key={path.href}
            >
              <div className="door-light" aria-hidden="true" />
              <div className="door-frame" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className="door-content">
                <span className="card-eyebrow">{path.eyebrow}</span>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <strong>{path.cta} →</strong>
              </div>
            </Link>
          ))}
        </div>

        <div className="question-panel">
          <div>
            <span className="eyebrow">BEGIN WITH YOUR REAL QUESTION</span>
            <h3>What are you building, providing, deploying, importing, distributing, or using?</h3>
          </div>

          <div className="question-options">
            {[
              'AI system',
              'GPAI model',
              'Embedded product',
              'Public-sector use',
              'Content-generation tool',
              'High-risk use case',
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="question-actions">
            <Link className="primary-action" href="/eu-ai-act">
              Start the EU AI Act Path
            </Link>
            <Link className="secondary-action" href="/eu-ai-act/requirements">
              Browse Requirements
            </Link>
          </div>
        </div>

        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article key={capability.number}>
              <span>{capability.number}</span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </article>
          ))}
        </div>

        <footer className="section-footer">
          <div>
            <span className="eyebrow">ONE ACT. EVERY ROLE. EVERY OBLIGATION.</span>
            <h3>One interactive governance path from legal requirement to preserved outcome.</h3>
          </div>

          <div className="footer-actions">
            <Link className="primary-action" href="/eu-ai-act">
              Open EU AI Act Requirements
            </Link>
            <Link className="secondary-action" href="/workspace">
              Open the TA-14 Workspace
            </Link>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .eu-act-section {
          position: relative;
          overflow: hidden;
          padding: clamp(76px, 10vw, 138px) 0;
          border-top: 1px solid rgba(239, 199, 104, 0.16);
          border-bottom: 1px solid rgba(98, 205, 230, 0.14);
          color: #f5fbff;
          background:
            linear-gradient(180deg, rgba(5, 15, 25, 0.98), rgba(7, 20, 33, 0.97)),
            radial-gradient(circle at 18% 8%, rgba(224, 177, 70, 0.13), transparent 32%),
            radial-gradient(circle at 82% 4%, rgba(65, 173, 213, 0.14), transparent 34%);
        }

        .section-shell {
          position: relative;
          z-index: 2;
          width: min(1220px, calc(100% - 36px));
          margin: 0 auto;
        }

        .ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .star {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f7d783;
          box-shadow: 0 0 18px rgba(247, 215, 131, 0.88);
          animation: starDrift 11s ease-in-out infinite;
        }

        .star-one {
          top: 14%;
          left: 8%;
        }

        .star-two {
          top: 27%;
          right: 9%;
          animation-delay: -4s;
        }

        .star-three {
          bottom: 18%;
          left: 15%;
          animation-delay: -7s;
        }

        .star-four {
          bottom: 10%;
          right: 18%;
          animation-delay: -2s;
        }

        .moving-line {
          position: absolute;
          width: 52vw;
          height: 1px;
          opacity: 0.38;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(247, 211, 123, 0.5),
            rgba(81, 204, 231, 0.38),
            transparent
          );
          animation: linePulse 8s ease-in-out infinite;
        }

        .line-one {
          top: 22%;
          left: -12%;
          transform: rotate(-14deg);
        }

        .line-two {
          right: -14%;
          bottom: 22%;
          transform: rotate(17deg);
          animation-delay: -3s;
        }

        .orb {
          position: absolute;
          width: 10px;
          height: 10px;
          border: 1px solid rgba(113, 218, 239, 0.7);
          border-radius: 50%;
          box-shadow: 0 0 26px rgba(82, 201, 226, 0.4);
          animation: orbitFloat 13s ease-in-out infinite;
        }

        .orb-one {
          top: 38%;
          left: 4%;
        }

        .orb-two {
          right: 5%;
          bottom: 35%;
          animation-delay: -6s;
        }

        .section-header {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.55fr);
          gap: clamp(28px, 6vw, 74px);
          align-items: end;
        }

        .eyebrow,
        .card-eyebrow {
          display: inline-block;
          color: #f1cb70;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h2,
        h3,
        p {
          margin-top: 0;
        }

        .heading-copy h2 {
          max-width: 920px;
          margin: 16px 0 22px;
          font-size: clamp(2.65rem, 6vw, 5.65rem);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .heading-copy p {
          max-width: 890px;
          margin-bottom: 0;
          color: #b2c8d2;
          font-size: 1.05rem;
          line-height: 1.78;
        }

        .status-card {
          position: relative;
          overflow: hidden;
          min-height: 285px;
          padding: 26px;
          border: 1px solid rgba(236, 194, 94, 0.3);
          border-radius: 25px;
          background:
            linear-gradient(145deg, rgba(67, 49, 18, 0.36), rgba(8, 28, 43, 0.86)),
            rgba(9, 28, 43, 0.92);
          box-shadow:
            inset 0 0 0 1px rgba(255, 233, 172, 0.04),
            0 25px 70px rgba(0, 0, 0, 0.22);
        }

        .status-card::after {
          content: '';
          position: absolute;
          inset: -40% -30% auto;
          height: 180px;
          background: radial-gradient(circle, rgba(245, 206, 112, 0.14), transparent 65%);
          animation: statusGlow 7s ease-in-out infinite;
        }

        .status-card > span {
          color: #d5b968;
          font-size: 0.67rem;
          font-weight: 950;
          letter-spacing: 0.11em;
        }

        .status-card > strong {
          display: block;
          margin: 50px 0 11px;
          font-size: 2.1rem;
          letter-spacing: -0.04em;
        }

        .status-card p {
          position: relative;
          z-index: 1;
          color: #aabfc8;
          line-height: 1.62;
        }

        .status-card a {
          position: relative;
          z-index: 1;
          color: #f7da8e;
          font-weight: 900;
          text-decoration: none;
        }

        .boundary-banner {
          display: grid;
          grid-template-columns: minmax(280px, 0.7fr) minmax(0, 1.3fr);
          gap: 22px;
          margin-top: 42px;
          padding: 22px 24px;
          border: 1px solid rgba(231, 190, 91, 0.2);
          border-radius: 18px;
          background: rgba(190, 139, 32, 0.055);
        }

        .boundary-banner span {
          display: block;
          margin-bottom: 7px;
          color: #c8a957;
          font-size: 0.66rem;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .boundary-banner p {
          margin: 0;
          color: #a99f81;
          line-height: 1.65;
        }

        .door-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 13px;
          margin-top: 34px;
        }

        .door-card {
          position: relative;
          min-height: 390px;
          overflow: hidden;
          grid-column: span 2;
          border: 1px solid rgba(230, 190, 94, 0.22);
          border-radius: 25px;
          color: inherit;
          background:
            linear-gradient(160deg, rgba(90, 66, 20, 0.28), rgba(8, 28, 43, 0.92) 52%),
            rgba(9, 29, 44, 0.88);
          box-shadow:
            inset 0 0 0 1px rgba(255, 230, 164, 0.035),
            0 22px 55px rgba(0, 0, 0, 0.18);
          text-decoration: none;
          transition:
            transform 190ms ease,
            border-color 190ms ease,
            box-shadow 190ms ease;
        }

        .door-card:nth-child(4),
        .door-card:nth-child(5) {
          grid-column: span 3;
        }

        .door-card.featured {
          border-color: rgba(243, 205, 111, 0.52);
          background:
            linear-gradient(160deg, rgba(124, 88, 18, 0.4), rgba(8, 28, 43, 0.93) 55%),
            rgba(9, 29, 44, 0.9);
        }

        .door-card:hover {
          transform: translateY(-6px);
          border-color: rgba(247, 211, 123, 0.56);
          box-shadow:
            inset 0 0 0 1px rgba(255, 230, 164, 0.06),
            0 32px 80px rgba(0, 0, 0, 0.28);
        }

        .door-light {
          position: absolute;
          top: -80px;
          left: 14%;
          width: 72%;
          height: 220px;
          opacity: 0.55;
          background: radial-gradient(circle, rgba(247, 211, 123, 0.25), transparent 66%);
          transition: opacity 190ms ease;
        }

        .door-card:hover .door-light {
          opacity: 0.92;
        }

        .door-frame {
          position: absolute;
          inset: 22px 22px auto auto;
          width: 88px;
          height: 142px;
          border: 1px solid rgba(239, 200, 105, 0.2);
          border-bottom: 0;
          border-radius: 44px 44px 0 0;
          opacity: 0.56;
        }

        .door-frame::after {
          content: '';
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(239, 200, 105, 0.14);
          border-bottom: 0;
          border-radius: 35px 35px 0 0;
        }

        .door-frame span {
          position: absolute;
          bottom: 0;
          width: 1px;
          height: 72%;
          background: linear-gradient(transparent, rgba(239, 200, 105, 0.25));
        }

        .door-frame span:nth-child(1) {
          left: 23%;
        }

        .door-frame span:nth-child(2) {
          left: 50%;
        }

        .door-frame span:nth-child(3) {
          right: 22%;
        }

        .door-content {
          position: relative;
          z-index: 1;
          display: flex;
          min-height: 390px;
          flex-direction: column;
          padding: 25px;
        }

        .door-content h3 {
          max-width: 78%;
          margin: 82px 0 16px;
          font-size: clamp(1.5rem, 2.2vw, 2.2rem);
          line-height: 1.04;
          letter-spacing: -0.035em;
        }

        .door-content p {
          color: #9fb5bf;
          line-height: 1.65;
        }

        .door-content > strong {
          margin-top: auto;
          color: #f4d37f;
          font-size: 0.86rem;
        }

        .question-panel {
          display: grid;
          grid-template-columns: 1.1fr 1fr auto;
          gap: 24px;
          align-items: center;
          margin-top: 16px;
          padding: 28px;
          border: 1px solid rgba(92, 202, 227, 0.17);
          border-radius: 25px;
          background:
            radial-gradient(circle at top left, rgba(65, 174, 208, 0.08), transparent 40%),
            rgba(8, 27, 42, 0.86);
        }

        .question-panel h3 {
          margin: 11px 0 0;
          font-size: clamp(1.5rem, 2.7vw, 2.4rem);
          line-height: 1.08;
          letter-spacing: -0.035em;
        }

        .question-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .question-options span {
          border: 1px solid rgba(104, 199, 222, 0.16);
          border-radius: 999px;
          padding: 9px 11px;
          color: #a8c0ca;
          background: rgba(255, 255, 255, 0.025);
          font-size: 0.75rem;
          font-weight: 800;
        }

        .question-actions,
        .footer-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 220px;
        }

        .primary-action,
        .secondary-action {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          min-height: 48px;
          border-radius: 999px;
          padding: 12px 17px;
          font-size: 0.82rem;
          font-weight: 950;
          text-decoration: none;
          transition: transform 170ms ease;
        }

        .primary-action {
          border: 1px solid #f2d17d;
          color: #171205;
          background: linear-gradient(135deg, #ffe39c, #d7a83d);
          box-shadow: 0 12px 34px rgba(187, 132, 29, 0.15);
        }

        .secondary-action {
          border: 1px solid rgba(125, 208, 228, 0.25);
          color: #e8f8fc;
          background: rgba(9, 31, 47, 0.85);
        }

        .primary-action:hover,
        .secondary-action:hover {
          transform: translateY(-2px);
        }

        .capability-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
          margin-top: 16px;
        }

        .capability-grid article {
          min-height: 245px;
          padding: 19px;
          border: 1px solid rgba(94, 197, 221, 0.13);
          border-radius: 18px;
          background: rgba(8, 27, 42, 0.66);
        }

        .capability-grid article > span {
          color: #e4bc5d;
          font-size: 0.69rem;
          font-weight: 950;
        }

        .capability-grid h3 {
          margin: 48px 0 12px;
          font-size: 1.12rem;
        }

        .capability-grid p {
          margin-bottom: 0;
          color: #8fa8b3;
          line-height: 1.58;
        }

        .section-footer {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 28px;
          align-items: center;
          margin-top: 18px;
          padding: clamp(30px, 5vw, 54px);
          border: 1px solid rgba(235, 196, 101, 0.2);
          border-radius: 28px;
          background:
            radial-gradient(circle at 10% 0, rgba(226, 179, 64, 0.1), transparent 42%),
            rgba(9, 28, 43, 0.84);
        }

        .section-footer h3 {
          max-width: 780px;
          margin: 12px 0 0;
          font-size: clamp(2rem, 4vw, 3.65rem);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        @keyframes starDrift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(0.85);
            opacity: 0.38;
          }

          50% {
            transform: translate3d(18px, -22px, 0) scale(1.35);
            opacity: 1;
          }
        }

        @keyframes linePulse {
          0%,
          100% {
            opacity: 0.2;
          }

          50% {
            opacity: 0.65;
          }
        }

        @keyframes orbitFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(25px, -32px, 0);
          }
        }

        @keyframes statusGlow {
          0%,
          100% {
            transform: translateX(-8%);
            opacity: 0.55;
          }

          50% {
            transform: translateX(8%);
            opacity: 1;
          }
        }

        @media (max-width: 1080px) {
          .section-header {
            grid-template-columns: 1fr;
          }

          .status-card {
            min-height: 230px;
          }

          .door-card,
          .door-card:nth-child(4),
          .door-card:nth-child(5) {
            grid-column: span 3;
          }

          .door-card:last-child {
            grid-column: 2 / span 4;
          }

          .question-panel {
            grid-template-columns: 1fr 1fr;
          }

          .question-actions {
            grid-column: 1 / -1;
            flex-direction: row;
          }

          .capability-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .boundary-banner,
          .question-panel,
          .section-footer {
            grid-template-columns: 1fr;
          }

          .door-grid {
            grid-template-columns: 1fr;
          }

          .door-card,
          .door-card:nth-child(4),
          .door-card:nth-child(5),
          .door-card:last-child {
            grid-column: auto;
          }

          .question-actions,
          .footer-actions {
            flex-direction: column;
            min-width: 0;
          }

          .capability-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .section-shell {
            width: min(100% - 24px, 1220px);
          }

          .capability-grid {
            grid-template-columns: 1fr;
          }

          .door-content h3 {
            max-width: 74%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .star,
          .moving-line,
          .orb,
          .status-card::after {
            animation: none;
          }

          .door-card,
          .primary-action,
          .secondary-action {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
