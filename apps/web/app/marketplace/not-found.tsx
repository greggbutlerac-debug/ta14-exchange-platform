import Link from 'next/link';

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none">
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MarketplaceNotFound() {
  return (
    <main className="notFoundPage">
      <div className="backgroundLayer" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="star starOne" />
        <div className="star starTwo" />
        <div className="star starThree" />
      </div>

      <section className="notFoundSection">
        <div className="pageShell">
          <div className="notFoundCard">
            <div className="iconWrap">
              <SearchIcon />
            </div>

            <span className="kicker">MARKETPLACE ROUTE NOT FOUND</span>
            <h1>This Marketplace record is not available.</h1>

            <p className="lead">
              The requested professional, organization, opportunity, record,
              review, or Marketplace route may not exist, may have been renamed,
              or may not yet be published.
            </p>

            <div className="boundaryNotice">
              <strong>Nothing has been inferred.</strong>
              <span>
                The TA-14 AI Governance Exchange Marketplace does not invent a
                missing record, substitute a different profile, or treat an
                unavailable route as evidence of withdrawal, dispute, or
                rejection.
              </span>
            </div>

            <div className="actionGrid">
              <Link className="primaryButton" href="/marketplace">
                Return to Marketplace
                <ArrowIcon />
              </Link>

              <Link
                className="secondaryButton"
                href="/marketplace/opportunities"
              >
                Browse Opportunities
              </Link>

              <Link
                className="secondaryButton"
                href="/marketplace/professionals"
              >
                Browse Professionals
              </Link>

              <Link
                className="secondaryButton"
                href="/marketplace/organizations"
              >
                Browse Organizations
              </Link>

              <Link className="secondaryButton" href="/marketplace/records">
                Browse Records
              </Link>

              <Link className="secondaryButton" href="/marketplace/reviews">
                Browse Reviews
              </Link>
            </div>

            <div className="postNeedPanel">
              <div>
                <span>CAN'T FIND THE RIGHT ROUTE?</span>
                <strong>Declare the governance need instead.</strong>
                <p>
                  Post the problem, consequential action, evidence available,
                  expected deliverable, timing, budget, and known boundaries.
                </p>
              </div>

              <Link
                className="postNeedButton"
                href="/marketplace/post-a-need"
              >
                Post a Governance Need
                <ArrowIcon />
              </Link>
            </div>

            <div className="maxim">
              No admissible evidence. No admissible execution.
            </div>
          </div>
        </div>
      </section>

      <style>{`
        :root {
          --bg: #041019;
          --border: rgba(118, 213, 220, 0.2);
          --border-strong: rgba(118, 213, 220, 0.42);
          --text: #f3fbfc;
          --muted: #a9c1c8;
          --teal: #67e0df;
          --gold: #ffd878;
          --violet: #bca4ff;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--bg);
        }

        .notFoundPage {
          position: relative;
          min-height: calc(100vh - 140px);
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 14% 12%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(188, 164, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .notFoundPage::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        .backgroundLayer {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .glow {
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.13;
          animation: glowPulse 9s ease-in-out infinite;
        }

        .glowOne {
          top: 5%;
          left: -120px;
          background: var(--teal);
        }

        .glowTwo {
          bottom: -140px;
          right: -120px;
          background: var(--violet);
          animation-delay: 3s;
        }

        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 12px white;
          animation: twinkle 4.2s ease-in-out infinite;
        }

        .starOne {
          top: 12%;
          left: 22%;
        }

        .starTwo {
          top: 23%;
          right: 16%;
          animation-delay: 1.2s;
        }

        .starThree {
          bottom: 18%;
          left: 10%;
          animation-delay: 2.4s;
        }

        .notFoundSection {
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          min-height: calc(100vh - 140px);
          padding: 72px 0;
        }

        .pageShell {
          width: min(980px, calc(100% - 40px));
          margin: 0 auto;
        }

        .notFoundCard {
          padding: 48px;
          border: 1px solid var(--border-strong);
          border-radius: 30px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.11), transparent 29%),
            radial-gradient(circle at 100% 0, rgba(188, 164, 255, 0.1), transparent 28%),
            linear-gradient(145deg, rgba(9, 31, 43, 0.94), rgba(4, 17, 25, 0.98));
          box-shadow: 0 34px 90px rgba(0, 0, 0, 0.34);
          text-align: center;
        }

        .iconWrap {
          display: grid;
          place-items: center;
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          border: 1px solid rgba(103, 224, 223, 0.35);
          border-radius: 50%;
          color: var(--teal);
          background: rgba(103, 224, 223, 0.07);
          box-shadow: 0 0 28px rgba(103, 224, 223, 0.13);
        }

        .kicker {
          display: inline-flex;
          color: var(--teal);
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h1,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 780px;
          margin: 14px auto 20px;
          font-size: clamp(2.8rem, 6vw, 5.8rem);
          line-height: 0.98;
          letter-spacing: -0.058em;
          text-wrap: balance;
        }

        .lead {
          max-width: 720px;
          margin: 0 auto;
          color: var(--muted);
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          line-height: 1.75;
        }

        .boundaryNotice {
          display: grid;
          gap: 7px;
          max-width: 760px;
          margin: 30px auto 0;
          padding: 16px 18px;
          border: 1px solid rgba(255, 216, 120, 0.22);
          border-radius: 15px;
          color: #eadfbf;
          background: rgba(255, 216, 120, 0.055);
          text-align: left;
        }

        .boundaryNotice strong {
          color: var(--gold);
          font-size: 0.76rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .boundaryNotice span {
          font-size: 0.86rem;
          line-height: 1.6;
        }

        .actionGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 32px;
        }

        .primaryButton,
        .secondaryButton,
        .postNeedButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 48px;
          padding: 0 17px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 820;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .primaryButton {
          grid-column: 1 / -1;
          color: #031114;
          background: linear-gradient(135deg, var(--teal), #b2f7f1);
          box-shadow: 0 12px 34px rgba(37, 185, 189, 0.22);
        }

        .secondaryButton {
          color: var(--text);
          border: 1px solid rgba(118, 213, 220, 0.22);
          background: rgba(255, 255, 255, 0.018);
        }

        .primaryButton:hover,
        .secondaryButton:hover,
        .postNeedButton:hover {
          transform: translateY(-2px);
        }

        .secondaryButton:hover {
          border-color: var(--border-strong);
          background: rgba(103, 224, 223, 0.05);
        }

        .postNeedPanel {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
          margin-top: 34px;
          padding: 22px;
          border: 1px solid rgba(188, 164, 255, 0.2);
          border-radius: 20px;
          background:
            radial-gradient(circle at 0 0, rgba(188, 164, 255, 0.1), transparent 28%),
            rgba(188, 164, 255, 0.035);
          text-align: left;
        }

        .postNeedPanel > div {
          display: grid;
          gap: 6px;
        }

        .postNeedPanel span {
          color: #d7c9ff;
          font-size: 0.66rem;
          font-weight: 850;
          letter-spacing: 0.12em;
        }

        .postNeedPanel strong {
          font-size: 1.1rem;
        }

        .postNeedPanel p {
          margin: 0;
          color: #b7adc9;
          font-size: 0.8rem;
          line-height: 1.55;
        }

        .postNeedButton {
          color: #f0eaff;
          border: 1px solid rgba(188, 164, 255, 0.32);
          background: rgba(188, 164, 255, 0.08);
          white-space: nowrap;
        }

        .postNeedButton:hover {
          border-color: rgba(188, 164, 255, 0.52);
          background: rgba(188, 164, 255, 0.13);
        }

        .maxim {
          margin-top: 34px;
          padding-top: 24px;
          border-top: 1px solid rgba(118, 213, 220, 0.14);
          color: var(--teal);
          font-size: 0.78rem;
          font-weight: 850;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.09;
            transform: scale(0.92);
          }
          50% {
            opacity: 0.17;
            transform: scale(1.08);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @media (max-width: 760px) {
          .pageShell {
            width: min(100% - 24px, 980px);
          }

          .notFoundCard {
            padding: 36px 22px;
          }

          .actionGrid {
            grid-template-columns: 1fr;
          }

          .primaryButton {
            grid-column: auto;
          }

          .postNeedPanel {
            grid-template-columns: 1fr;
          }

          .postNeedButton {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: clamp(2.6rem, 15vw, 4rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}
