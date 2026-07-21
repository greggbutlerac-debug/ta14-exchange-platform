"use client";

import { useEffect } from 'react';
import Link from 'next/link';

import {
  marketplaceActions,
  marketplaceRoutes,
} from '../../lib/marketplace-routes';

function RefreshIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
    >
      <path
        d="M20 11a8 8 0 1 0-2.34 5.66"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 5v6h-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
    >
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

const recoveryRoutes = [
  {
    label: 'Browse Opportunities',
    href: marketplaceRoutes.opportunities,
  },
  {
    label: 'Browse Professionals',
    href: marketplaceRoutes.professionals,
  },
  {
    label: 'Browse Organizations',
    href: marketplaceRoutes.organizations,
  },
  {
    label: 'Browse Records',
    href: marketplaceRoutes.records,
  },
  {
    label: 'Browse Reviews',
    href: marketplaceRoutes.reviews,
  },
] as const;

export default function MarketplaceError({
  error,
  reset,
}: Readonly<{
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error('Marketplace route failure:', error);
  }, [error]);

  return (
    <main className="errorPage">
      <div className="backgroundLayer" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="particle particleOne" />
        <div className="particle particleTwo" />
        <div className="particle particleThree" />
      </div>

      <section className="errorSection">
        <div className="pageShell">
          <div className="errorCard">
            <span className="eyebrow">MARKETPLACE RUNTIME INTERRUPTION</span>

            <h1>The route exists, but it did not complete.</h1>

            <p className="lead">
              The Marketplace encountered a runtime failure while attempting to
              render this route. No missing information has been inferred, and
              no unavailable record has been treated as valid evidence.
            </p>

            <div className="distinctionPanel">
              <div>
                <span>NOT A MISSING ROUTE</span>
                <strong>This is a runtime failure.</strong>
              </div>

              <p>
                A missing Marketplace route is handled separately. This page
                confirms that the requested route was reached, but its current
                execution did not complete successfully.
              </p>
            </div>

            <div className="primaryActions">
              <button
                className="retryButton"
                onClick={reset}
                type="button"
              >
                <RefreshIcon />
                Try Again
              </button>

              <Link
                className="returnButton"
                href={marketplaceRoutes.home}
              >
                Return to Marketplace
                <ArrowIcon />
              </Link>
            </div>

            <div className="recoveryGrid">
              {recoveryRoutes.map((route) => (
                <Link
                  className="recoveryLink"
                  href={route.href}
                  key={route.href}
                >
                  {route.label}
                </Link>
              ))}
            </div>

            <div className="postNeedPanel">
              <div>
                <span>NEED TO DECLARE WORK INSTEAD?</span>
                <strong>Post a governed need.</strong>
                <p>
                  Declare the problem, consequential action, available
                  evidence, expected deliverable, timing, budget, and known
                  boundaries.
                </p>
              </div>

              <Link
                aria-label={marketplaceActions.postNeed.description}
                className="postNeedButton"
                href={marketplaceActions.postNeed.href}
              >
                {marketplaceActions.postNeed.label}
                <ArrowIcon />
              </Link>
            </div>

            {error.digest ? (
              <div className="digestPanel">
                <span>ERROR DIGEST</span>
                <code>{error.digest}</code>
              </div>
            ) : null}

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
          --danger: #ff9b9b;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--bg);
        }

        .errorPage {
          position: relative;
          min-height: calc(100vh - 140px);
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(
              circle at 15% 12%,
              rgba(37, 185, 189, 0.14),
              transparent 30%
            ),
            radial-gradient(
              circle at 86% 18%,
              rgba(255, 155, 155, 0.1),
              transparent 28%
            ),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .errorPage::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.2;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.024) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.024) 1px,
              transparent 1px
            );
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
          width: 380px;
          height: 380px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.12;
          animation: pulse 8s ease-in-out infinite;
        }

        .glowOne {
          top: -80px;
          left: -130px;
          background: var(--teal);
        }

        .glowTwo {
          right: -150px;
          bottom: -120px;
          background: var(--danger);
          animation-delay: 2.6s;
        }

        .particle {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 14px white;
          animation: drift 7s ease-in-out infinite;
        }

        .particleOne {
          top: 15%;
          left: 20%;
        }

        .particleTwo {
          top: 28%;
          right: 18%;
          animation-delay: 1.8s;
        }

        .particleThree {
          bottom: 14%;
          left: 12%;
          animation-delay: 3.4s;
        }

        .errorSection {
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

        .errorCard {
          padding: 48px;
          border: 1px solid var(--border-strong);
          border-radius: 30px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(103, 224, 223, 0.1),
              transparent 28%
            ),
            radial-gradient(
              circle at 100% 0,
              rgba(255, 155, 155, 0.08),
              transparent 24%
            ),
            linear-gradient(
              145deg,
              rgba(9, 31, 43, 0.95),
              rgba(4, 17, 25, 0.98)
            );
          box-shadow: 0 34px 90px rgba(0, 0, 0, 0.35);
          text-align: center;
        }

        .eyebrow {
          display: inline-flex;
          color: var(--danger);
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        h1,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 790px;
          margin: 14px auto 20px;
          font-size: clamp(2.8rem, 6vw, 5.7rem);
          line-height: 0.98;
          letter-spacing: -0.058em;
          text-wrap: balance;
        }

        .lead {
          max-width: 720px;
          margin: 0 auto;
          color: var(--muted);
          font-size: clamp(1rem, 1.5vw, 1.18rem);
          line-height: 1.75;
        }

        .distinctionPanel {
          display: grid;
          grid-template-columns: minmax(190px, 0.45fr) 1fr;
          gap: 24px;
          align-items: center;
          max-width: 760px;
          margin: 30px auto 0;
          padding: 20px;
          border: 1px solid rgba(255, 216, 120, 0.22);
          border-radius: 18px;
          background: rgba(255, 216, 120, 0.045);
          text-align: left;
        }

        .distinctionPanel div {
          display: grid;
          gap: 5px;
        }

        .distinctionPanel span {
          color: var(--gold);
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .distinctionPanel strong {
          font-size: 1.05rem;
        }

        .distinctionPanel p {
          margin: 0;
          color: #c8bea4;
          font-size: 0.86rem;
          line-height: 1.6;
        }

        .primaryActions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 32px;
        }

        .retryButton,
        .returnButton,
        .recoveryLink,
        .postNeedButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 48px;
          padding: 0 17px;
          border-radius: 999px;
          font: inherit;
          font-size: 0.82rem;
          font-weight: 830;
          text-decoration: none;
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .retryButton {
          border: 0;
          color: #031114;
          background: linear-gradient(135deg, var(--teal), #b2f7f1);
          box-shadow: 0 12px 34px rgba(37, 185, 189, 0.22);
        }

        .returnButton {
          color: var(--text);
          border: 1px solid rgba(118, 213, 220, 0.28);
          background: rgba(255, 255, 255, 0.02);
        }

        .retryButton:hover,
        .returnButton:hover,
        .recoveryLink:hover,
        .postNeedButton:hover {
          transform: translateY(-2px);
        }

        .returnButton:hover,
        .recoveryLink:hover {
          border-color: var(--border-strong);
          background: rgba(103, 224, 223, 0.055);
        }

        .recoveryGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 14px;
        }

        .recoveryLink {
          min-height: 44px;
          color: #d8e7ea;
          border: 1px solid rgba(118, 213, 220, 0.16);
          background: rgba(255, 255, 255, 0.012);
          font-size: 0.76rem;
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
            radial-gradient(
              circle at 0 0,
              rgba(188, 164, 255, 0.1),
              transparent 28%
            ),
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

        .digestPanel {
          display: grid;
          gap: 8px;
          margin-top: 28px;
          padding: 16px 18px;
          border: 1px solid rgba(255, 155, 155, 0.18);
          border-radius: 14px;
          background: rgba(255, 155, 155, 0.035);
          text-align: left;
        }

        .digestPanel span {
          color: var(--danger);
          font-size: 0.64rem;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .digestPanel code {
          overflow-wrap: anywhere;
          color: #f0c8c8;
          font-size: 0.78rem;
          line-height: 1.5;
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

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.08;
            transform: scale(0.92);
          }

          50% {
            opacity: 0.16;
            transform: scale(1.08);
          }
        }

        @keyframes drift {
          0%,
          100% {
            opacity: 0.25;
            transform: translate3d(0, 0, 0) scale(0.85);
          }

          50% {
            opacity: 1;
            transform: translate3d(10px, -12px, 0) scale(1.3);
          }
        }

        @media (max-width: 760px) {
          .pageShell {
            width: min(100% - 24px, 980px);
          }

          .errorCard {
            padding: 36px 22px;
          }

          .distinctionPanel,
          .postNeedPanel {
            grid-template-columns: 1fr;
          }

          .primaryActions,
          .recoveryGrid {
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
