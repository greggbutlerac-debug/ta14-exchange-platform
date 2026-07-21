export default function MarketplaceLoading() {
  return (
    <main className="loadingPage" aria-busy="true" aria-live="polite">
      <div className="backgroundLayer" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="star starOne" />
        <div className="star starTwo" />
        <div className="star starThree" />
        <div className="line lineOne" />
        <div className="line lineTwo" />
      </div>

      <section className="loadingSection">
        <div className="pageShell">
          <div className="loadingHeader">
            <div className="loadingBadge">
              <span />
              <strong>TA-14 MARKETPLACE</strong>
            </div>

            <div className="titleSkeleton skeleton" />
            <div className="titleSkeleton titleSkeletonShort skeleton" />
            <div className="leadSkeleton skeleton" />
            <div className="leadSkeleton leadSkeletonShort skeleton" />

            <div className="buttonRow">
              <div className="buttonSkeleton skeleton" />
              <div className="buttonSkeleton secondaryButtonSkeleton skeleton" />
            </div>
          </div>

          <div className="statusPanel">
            <div className="statusIndicator">
              <span className="orbit orbitOne" />
              <span className="orbit orbitTwo" />
              <span className="core" />
            </div>

            <div>
              <span className="statusKicker">LOADING MARKETPLACE ROUTE</span>
              <strong>Preserving structure while the page resolves.</strong>
              <p>
                The requested Marketplace page is loading. No profile, record,
                review, organization, opportunity, or status is being inferred
                before the route completes.
              </p>
            </div>
          </div>

          <div className="cardGrid" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, index) => (
              <article className="cardSkeleton" key={index}>
                <div className="cardTopline">
                  <div className="eyebrowSkeleton skeleton" />
                  <div className="iconSkeleton skeleton" />
                </div>

                <div className="cardTitleSkeleton skeleton" />
                <div className="cardTitleSkeleton cardTitleSkeletonShort skeleton" />

                <div className="cardTextSkeleton skeleton" />
                <div className="cardTextSkeleton skeleton" />
                <div className="cardTextSkeleton cardTextSkeletonShort skeleton" />

                <div className="cardFooter">
                  <div className="metricSkeleton skeleton" />
                  <div className="openSkeleton skeleton" />
                </div>
              </article>
            ))}
          </div>

          <div className="maxim">
            No admissible evidence. No admissible execution.
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
          --blue: #62a9ff;
          --violet: #bca4ff;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--bg);
        }

        .loadingPage {
          position: relative;
          min-height: calc(100vh - 140px);
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 8%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(98, 169, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .loadingPage::before {
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
          width: 390px;
          height: 390px;
          border-radius: 50%;
          filter: blur(95px);
          opacity: 0.13;
          animation: glowPulse 9s ease-in-out infinite;
        }

        .glowOne {
          top: 4%;
          left: -130px;
          background: var(--teal);
        }

        .glowTwo {
          top: 40%;
          right: -150px;
          background: var(--violet);
          animation-delay: 3s;
        }

        .line {
          position: absolute;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(103, 224, 223, 0.58),
            transparent
          );
          filter: drop-shadow(0 0 7px rgba(103, 224, 223, 0.35));
          animation: lineMove 13s linear infinite;
        }

        .lineOne {
          top: 13%;
          left: -10%;
          width: 46vw;
          transform: rotate(17deg);
        }

        .lineTwo {
          top: 58%;
          right: -8%;
          width: 38vw;
          transform: rotate(-19deg);
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
          top: 7%;
          left: 24%;
        }

        .starTwo {
          top: 16%;
          right: 14%;
          animation-delay: 1.2s;
        }

        .starThree {
          top: 44%;
          left: 7%;
          animation-delay: 2.4s;
        }

        .loadingSection {
          position: relative;
          z-index: 2;
          padding: 88px 0 100px;
        }

        .pageShell {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .loadingHeader {
          max-width: 880px;
        }

        .loadingBadge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 20px;
          color: var(--teal);
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .loadingBadge > span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 14px rgba(103, 224, 223, 0.7);
          animation: badgePulse 1.4s ease-in-out infinite;
        }

        .skeleton {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(118, 213, 220, 0.08);
          background:
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.035),
              rgba(103, 224, 223, 0.1),
              rgba(255, 255, 255, 0.035)
            );
          background-size: 220% 100%;
          animation: shimmer 1.75s linear infinite;
        }

        .titleSkeleton {
          width: 92%;
          height: clamp(44px, 6vw, 72px);
          margin-bottom: 11px;
          border-radius: 14px;
        }

        .titleSkeletonShort {
          width: 68%;
        }

        .leadSkeleton {
          width: 82%;
          height: 18px;
          margin-top: 27px;
          border-radius: 999px;
        }

        .leadSkeletonShort {
          width: 61%;
          margin-top: 10px;
        }

        .buttonRow {
          display: flex;
          gap: 14px;
          margin-top: 31px;
        }

        .buttonSkeleton {
          width: 205px;
          height: 48px;
          border-radius: 999px;
        }

        .secondaryButtonSkeleton {
          width: 185px;
        }

        .statusPanel {
          display: grid;
          grid-template-columns: 90px 1fr;
          gap: 20px;
          align-items: center;
          margin-top: 50px;
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.09), transparent 30%),
            linear-gradient(145deg, rgba(10, 31, 43, 0.8), rgba(4, 18, 27, 0.94));
        }

        .statusIndicator {
          position: relative;
          width: 72px;
          height: 72px;
          margin: 0 auto;
        }

        .core {
          position: absolute;
          inset: 26px;
          border-radius: 50%;
          background: var(--teal);
          box-shadow:
            0 0 18px rgba(103, 224, 223, 0.72),
            0 0 38px rgba(103, 224, 223, 0.28);
          animation: corePulse 1.8s ease-in-out infinite;
        }

        .orbit {
          position: absolute;
          inset: 7px;
          border: 1px solid rgba(103, 224, 223, 0.38);
          border-radius: 50%;
          animation: orbitSpin 3.6s linear infinite;
        }

        .orbit::after {
          content: '';
          position: absolute;
          top: -4px;
          left: calc(50% - 4px);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 12px rgba(103, 224, 223, 0.72);
        }

        .orbitTwo {
          inset: 16px;
          border-color: rgba(98, 169, 255, 0.38);
          animation-direction: reverse;
          animation-duration: 2.8s;
        }

        .orbitTwo::after {
          background: var(--blue);
          box-shadow: 0 0 12px rgba(98, 169, 255, 0.72);
        }

        .statusPanel > div:last-child {
          display: grid;
          gap: 6px;
        }

        .statusKicker {
          color: var(--teal);
          font-size: 0.66rem;
          font-weight: 850;
          letter-spacing: 0.12em;
        }

        .statusPanel strong {
          font-size: 1.1rem;
        }

        .statusPanel p {
          margin: 0;
          color: var(--muted);
          font-size: 0.84rem;
          line-height: 1.6;
        }

        .cardGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 28px;
        }

        .cardSkeleton {
          display: grid;
          min-height: 300px;
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.06), transparent 28%),
            linear-gradient(145deg, rgba(10, 31, 43, 0.78), rgba(4, 18, 27, 0.94));
        }

        .cardTopline {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .eyebrowSkeleton {
          width: 84px;
          height: 10px;
          border-radius: 999px;
        }

        .iconSkeleton {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }

        .cardTitleSkeleton {
          width: 88%;
          height: 22px;
          margin-top: 42px;
          border-radius: 8px;
        }

        .cardTitleSkeletonShort {
          width: 58%;
          margin-top: 8px;
        }

        .cardTextSkeleton {
          width: 100%;
          height: 12px;
          margin-top: 20px;
          border-radius: 999px;
        }

        .cardTextSkeleton + .cardTextSkeleton {
          margin-top: 8px;
        }

        .cardTextSkeletonShort {
          width: 72%;
        }

        .cardFooter {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: center;
          margin-top: auto;
          padding-top: 23px;
          border-top: 1px solid rgba(118, 213, 220, 0.09);
        }

        .metricSkeleton {
          width: 86px;
          height: 10px;
          border-radius: 999px;
        }

        .openSkeleton {
          width: 56px;
          height: 12px;
          border-radius: 999px;
        }

        .maxim {
          margin-top: 38px;
          padding-top: 24px;
          border-top: 1px solid rgba(118, 213, 220, 0.14);
          color: var(--teal);
          font-size: 0.78rem;
          font-weight: 850;
          letter-spacing: 0.14em;
          text-align: center;
          text-transform: uppercase;
        }

        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -120% 0;
          }
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

        @keyframes orbitSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: scale(0.82);
            opacity: 0.72;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes badgePulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.86);
          }
          50% {
            opacity: 1;
            transform: scale(1.18);
          }
        }

        @media (max-width: 1000px) {
          .cardGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .pageShell {
            width: min(100% - 24px, 1180px);
          }

          .loadingSection {
            padding: 70px 0 82px;
          }

          .statusPanel {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .cardGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .buttonRow {
            flex-direction: column;
          }

          .buttonSkeleton,
          .secondaryButtonSkeleton {
            width: 100%;
          }

          .titleSkeleton {
            width: 100%;
          }

          .titleSkeletonShort {
            width: 78%;
          }

          .leadSkeleton {
            width: 94%;
          }

          .leadSkeletonShort {
            width: 72%;
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
