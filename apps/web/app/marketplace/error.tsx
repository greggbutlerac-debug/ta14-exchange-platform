"use client";

import { useEffect } from "react";
import Link from "next/link";

function RetryIcon() {
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

function ErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
    >
      <path
        d="M12 8v5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
      <path
        d="M10.3 4.4 3.2 17a2 2 0 0 0 1.74 3h14.12A2 2 0 0 0 20.8 17L13.7 4.4a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MarketplaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Marketplace route error:", error);
  }, [error]);

  return (
    <main className="errorPage">
      <div className="backgroundLayer" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="star starOne" />
        <div className="star starTwo" />
        <div className="star starThree" />
        <div className="line lineOne" />
        <div className="line lineTwo" />
      </div>

      <section className="errorSection">
        <div className="pageShell">
          <div className="errorCard">
            <div className="iconWrap">
              <ErrorIcon />
            </div>

            <span className="kicker">MARKETPLACE SYSTEM ERROR</span>

            <h1>This Marketplace route could not be completed.</h1>

            <p className="lead">
              The requested page exists, but an unexpected failure interrupted
              rendering or data resolution. The cause has not been inferred,
              and no Marketplace record has been altered.
            </p>

            <div className="statusGrid">
              <article>
                <span>ROUTE STATE</span>
                <strong>Interrupted</strong>
                <p>
                  The requested page did not complete successfully during this
                  attempt.
                </p>
              </article>

              <article>
                <span>RECORD STATE</span>
                <strong>Unchanged</strong>
                <p>
                  No professional, organization, opportunity, review, or record
                  has been rewritten by this failure.
                </p>
              </article>

              <article>
                <span>CAUSAL STATE</span>
                <strong>Undetermined</strong>
                <p>
                  A runtime failure is not evidence of withdrawal, rejection,
                  dispute, invalidity, or deletion.
                </p>
              </article>
            </div>

            <div className="boundaryNotice">
              <strong>Governed failure boundary</strong>
              <span>
                The system distinguishes a failed route from a missing route.
                This page does not fabricate a cause, substitute another
                listing, or convert technical failure into a governance
                conclusion.
              </span>
            </div>

            {error.digest ? (
              <div className="digestPanel">
                <span>REFERENCE DIGEST</span>
                <code>{error.digest}</code>
              </div>
            ) : null}

            <div className="actionRow">
              <button className="primaryButton" type="button" onClick={reset}>
                <RetryIcon />
                Try Again
              </button>

              <Link className="secondaryButton" href="/marketplace">
                Return to Marketplace
                <ArrowIcon />
              </Link>
            </div>

            <div className="recoveryPanel">
              <div>
                <span>CONTINUE THROUGH ANOTHER ROUTE</span>
                <strong>The rest of the Marketplace remains available.</strong>
                <p>
                  You can return to the Marketplace directory or navigate to a
                  different section without treating this failure as evidence
                  about the underlying listing.
                </p>
              </div>

              <div className="recoveryLinks">
                <Link href="/marketplace/opportunities">Opportunities</Link>
                <Link href="/marketplace/professionals">Professionals</Link>
                <Link href="/marketplace/organizations">Organizations</Link>
                <Link href="/marketplace/records">Records</Link>
                <Link href="/marketplace/reviews">Reviews</Link>
                <Link href="/marketplace/post-a-need">Post a Need</Link>
              </div>
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
          --amber: #ffd878;
          --red: #ff8f8f;
          --violet: #bca4ff;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--bg);
        }

        button,
        a {
          font: inherit;
        }

        .errorPage {
          position: relative;
          min-height: calc(100vh - 140px);
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(
              circle at 12% 9%,
              rgba(255, 143, 143, 0.12),
              transparent 30%
            ),
            radial-gradient(
              circle at 87% 18%,
              rgba(188, 164, 255, 0.12),
              transparent 29%
            ),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .errorPage::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.025) 1px,
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
          filter: blur(95px);
          opacity: 0.13;
          animation: glowPulse 9s ease-in-out infinite;
        }

        .glowOne {
          top: 2%;
          left: -130px;
          background: var(--red);
        }

        .glowTwo {
          bottom: -140px;
          right: -130px;
          background: var(--violet);
          animation-delay: 3s;
        }

        .line {
          position: absolute;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 143, 143, 0.58),
            transparent
          );
          filter: drop-shadow(0 0 7px rgba(255, 143, 143, 0.32));
          animation: lineMove 13s linear infinite;
        }

        .lineOne {
          top: 14%;
          left: -9%;
          width: 44vw;
          transform: rotate(17deg);
        }

        .lineTwo {
          top: 62%;
          right: -7%;
          width: 37vw;
          transform: rotate(-20deg);
          animation-delay: -6s;
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
          top: 11%;
          left: 23%;
        }

        .starTwo {
          top: 19%;
          right: 14%;
          animation-delay: 1.2s;
        }

        .starThree {
          bottom: 18%;
          left: 9%;
          animation-delay: 2.4s;
        }

        .errorSection {
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          min-height: calc(100vh - 140px);
          padding: 72px 0 92px;
        }

        .pageShell {
          width: min(1040px, calc(100% - 40px));
          margin: 0 auto;
        }

        .errorCard {
          padding: 48px;
          border: 1px solid rgba(255, 143, 143, 0.32);
          border-radius: 30px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(255, 143, 143, 0.1),
              transparent 29%
            ),
            radial-gradient(
              circle at 100% 0,
              rgba(188, 164, 255, 0.1),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              rgba(9, 31, 43, 0.94),
              rgba(4, 17, 25, 0.98)
            );
          box-shadow: 0 34px 90px rgba(0, 0, 0, 0.35);
          text-align: center;
        }

        .iconWrap {
          display: grid;
          place-items: center;
          width: 66px;
          height: 66px;
          margin: 0 auto 24px;
          border: 1px solid rgba(255, 143, 143, 0.38);
          border-radius: 50%;
          color: var(--red);
          background: rgba(255, 143, 143, 0.07);
          box-shadow: 0 0 28px rgba(255, 143, 143, 0.14);
        }

        .kicker {
          display: inline-flex;
          color: var(--red);
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
          max-width: 810px;
          margin: 14px auto 20px;
          font-size: clamp(2.8rem, 6vw, 5.8rem);
          line-height: 0.98;
          letter-spacing: -0.058em;
          text-wrap: balance;
        }

        .lead {
          max-width: 760px;
          margin: 0 auto;
          color: var(--muted);
          font-size: clamp(1rem, 1.5vw, 1.18rem);
          line-height: 1.75;
        }

        .statusGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 32px;
          text-align: left;
        }

        .statusGrid article {
          padding: 18px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(103, 224, 223, 0.07),
              transparent 33%
            ),
            rgba(255, 255, 255, 0.018);
        }

        .statusGrid span,
        .recoveryPanel span,
        .digestPanel span {
          color: var(--teal);
          font-size: 0.65rem;
          font-weight: 850;
          letter-spacing: 0.12em;
        }

        .statusGrid strong {
          display: block;
          margin-top: 7px;
          font-size: 1.05rem;
        }

        .statusGrid p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 0.8rem;
          line-height: 1.55;
        }

        .boundaryNotice {
          display: grid;
          gap: 7px;
          margin-top: 20px;
          padding: 17px 18px;
          border: 1px solid rgba(255, 216, 120, 0.24);
          border-radius: 16px;
          color: #eadfbf;
          background: rgba(255, 216, 120, 0.055);
          text-align: left;
        }

        .boundaryNotice strong {
          color: var(--amber);
          font-size: 0.76rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .boundaryNotice span {
          font-size: 0.86rem;
          line-height: 1.6;
        }

        .digestPanel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-top: 16px;
          padding: 14px 16px;
          border: 1px solid rgba(118, 213, 220, 0.16);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.015);
          text-align: left;
        }

        .digestPanel code {
          color: #cfe0e4;
          font-size: 0.78rem;
          word-break: break-all;
        }

        .actionRow {
          display: flex;
          justify-content: center;
          gap: 14px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 49px;
          padding: 0 19px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 0.83rem;
          font-weight: 850;
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .primaryButton {
          border: 0;
          color: #031114;
          background: linear-gradient(135deg, var(--teal), #b2f7f1);
          box-shadow: 0 12px 34px rgba(37, 185, 189, 0.22);
        }

        .secondaryButton {
          color: var(--text);
          border: 1px solid rgba(118, 213, 220, 0.26);
          background: rgba(255, 255, 255, 0.018);
        }

        .primaryButton:hover,
        .secondaryButton:hover,
        .primaryButton:focus-visible,
        .secondaryButton:focus-visible {
          transform: translateY(-2px);
          outline: none;
        }

        .secondaryButton:hover,
        .secondaryButton:focus-visible {
          border-color: var(--border-strong);
          background: rgba(103, 224, 223, 0.05);
        }

        .recoveryPanel {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr);
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

        .recoveryPanel > div:first-child {
          display: grid;
          gap: 6px;
        }

        .recoveryPanel strong {
          font-size: 1.08rem;
        }

        .recoveryPanel p {
          margin: 0;
          color: #b7adc9;
          font-size: 0.81rem;
          line-height: 1.55;
        }

        .recoveryLinks {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .recoveryLinks a {
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          padding: 0 11px;
          border: 1px solid rgba(188, 164, 255, 0.2);
          border-radius: 999px;
          color: #e5dcff;
          background: rgba(188, 164, 255, 0.045);
          text-decoration: none;
          font-size: 0.72rem;
          font-weight: 760;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .recoveryLinks a:hover,
        .recoveryLinks a:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(188, 164, 255, 0.42);
          background: rgba(188, 164, 255, 0.09);
          outline: none;
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

        @keyframes lineMove {
          0% {
            opacity: 0;
            translate: -12% 0;
          }

          20%,
          80% {
            opacity: 0.72;
          }

          100% {
            opacity: 0;
            translate: 38% 0;
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

        @media (max-width: 860px) {
          .statusGrid {
            grid-template-columns: 1fr;
          }

          .recoveryPanel {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .pageShell {
            width: min(100% - 24px, 1040px);
          }

          .errorCard {
            padding: 36px 22px;
          }

          .actionRow {
            flex-direction: column;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .digestPanel {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: clamp(2.55rem, 15vw, 4rem);
          }

          .recoveryLinks {
            grid-template-columns: 1fr;
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
