import Link from "next/link";
import type { ReactNode } from "react";

type GovernanceLibraryLayoutProps = {
  children: ReactNode;
};

const navigationSections = [
  {
    label: "Library",
    links: [
      { href: "/governance-library", label: "Overview" },
      {
        href: "/governance-library/dictionary",
        label: "AI Governance Dictionary",
      },
      { href: "/governance-library?category=law", label: "Laws" },
      {
        href: "/governance-library?category=standard",
        label: "Standards",
      },
      {
        href: "/governance-library?category=framework",
        label: "Frameworks",
      },
    ],
  },
  {
    label: "Governance Systems",
    links: [
      {
        href: "/governance-library?category=management-system",
        label: "Management Systems",
      },
      {
        href: "/governance-library?category=risk-management",
        label: "Risk Management",
      },
      {
        href: "/governance-library?category=testing",
        label: "Testing",
      },
      {
        href: "/governance-library?category=sector-governance",
        label: "Sector Governance",
      },
    ],
  },
  {
    label: "Execution Tools",
    links: [
      {
        href: "/governance-library/crosswalks",
        label: "Crosswalks",
      },
      {
        href: "/governance-library/applicability",
        label: "Applicability Engine",
      },
      {
        href: "/workspace/ai-governance",
        label: "TA-14 Route Builder",
      },
    ],
  },
];

function GovernanceLibraryNavigation() {
  return (
    <nav className="libraryNavigation" aria-label="AI Governance Library">
      <Link href="/governance-library" className="libraryIdentity">
        <div className="identityMark" aria-hidden="true">
          <span>TA</span>
          <strong>14</strong>
        </div>

        <div>
          <p>TA-14 Authority</p>
          <h2>Governance Library</h2>
        </div>
      </Link>

      <div className="navigationDivider" />

      <div className="navigationSections">
        {navigationSections.map((section) => (
          <section className="navigationSection" key={section.label}>
            <p className="navigationLabel">{section.label}</p>

            <div className="navigationLinks">
              {section.links.map((link) => (
                <Link
                  key={`${section.label}-${link.href}-${link.label}`}
                  href={link.href}
                  className="navigationLink"
                >
                  <span>{link.label}</span>
                  <i aria-hidden="true">→</i>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="navigationStatement">
        <span aria-hidden="true">◆</span>
        <p>No admissible evidence. No admissible execution.</p>
      </div>

      <Link href="/" className="returnLink">
        <span aria-hidden="true">←</span>
        Return to the Grand Exchange Hall
      </Link>
    </nav>
  );
}

export default function GovernanceLibraryLayout({
  children,
}: GovernanceLibraryLayoutProps) {
  return (
    <div className="governanceLibraryLayout">
      <div className="libraryBackground" aria-hidden="true">
        <div className="libraryStars starsA" />
        <div className="libraryStars starsB" />
        <div className="libraryGlow glowA" />
        <div className="libraryGlow glowB" />
        <div className="libraryRoute routeA" />
        <div className="libraryRoute routeB" />
      </div>

      <aside className="desktopSidebar">
        <GovernanceLibraryNavigation />
      </aside>

      <div className="libraryContent">
        <div className="mobileNavigation">
          <details>
            <summary>
              <span>AI Governance Library Navigation</span>
              <i aria-hidden="true">↓</i>
            </summary>

            <div className="mobileNavigationPanel">
              <GovernanceLibraryNavigation />
            </div>
          </details>
        </div>

        {children}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          background: #020611;
        }

        body {
          margin: 0;
          background: #020611;
          color: #f7fbff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .governanceLibraryLayout {
          position: relative;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
          isolation: isolate;
          overflow: hidden;
          color: #f7fbff;
          background:
            radial-gradient(
              circle at 18% 10%,
              rgba(29, 154, 211, 0.11),
              transparent 28%
            ),
            radial-gradient(
              circle at 88% 38%,
              rgba(117, 71, 190, 0.1),
              transparent 30%
            ),
            linear-gradient(180deg, #020611 0%, #06101b 48%, #020611 100%);
        }

        .libraryBackground {
          position: fixed;
          inset: 0;
          z-index: -5;
          overflow: hidden;
          pointer-events: none;
        }

        .libraryBackground::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.045) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.045) 1px,
              transparent 1px
            );
          background-size: 56px 56px;
          mask-image: linear-gradient(to bottom, black, transparent 94%);
        }

        .libraryStars {
          position: absolute;
          inset: -20%;
          opacity: 0.48;
        }

        .starsA {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.88) 0 1px,
            transparent 1.5px
          );
          background-size: 128px 128px;
          animation: libraryStarDrift 58s linear infinite;
        }

        .starsB {
          background-image: radial-gradient(
            circle,
            rgba(96, 220, 255, 0.72) 0 1px,
            transparent 1.6px
          );
          background-size: 194px 194px;
          background-position: 43px 79px;
          animation: libraryStarDrift 76s linear infinite reverse;
        }

        .libraryGlow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.16;
          animation: libraryGlowFloat 15s ease-in-out infinite alternate;
        }

        .glowA {
          left: -260px;
          top: -160px;
          width: 650px;
          height: 650px;
          background: #078bd1;
        }

        .glowB {
          right: -280px;
          top: 32%;
          width: 720px;
          height: 720px;
          background: #8b4cdf;
          animation-delay: -7s;
        }

        .libraryRoute {
          position: absolute;
          height: 1px;
          width: 75vw;
          opacity: 0.34;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(87, 220, 255, 0.7),
            rgba(255, 199, 87, 0.58),
            transparent
          );
          filter: drop-shadow(0 0 7px rgba(88, 221, 255, 0.4));
        }

        .libraryRoute::after {
          content: "";
          position: absolute;
          left: 4%;
          top: -3px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff0a9;
          box-shadow: 0 0 18px rgba(255, 221, 121, 0.92);
          animation: libraryRoutePacket 9s linear infinite;
        }

        .routeA {
          left: -16%;
          top: 25%;
          transform: rotate(-7deg);
        }

        .routeB {
          right: -18%;
          top: 71%;
          transform: rotate(8deg);
        }

        .desktopSidebar {
          position: relative;
          z-index: 5;
          min-height: 100vh;
          border-right: 1px solid rgba(123, 220, 245, 0.13);
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(63, 205, 238, 0.08),
              transparent 34%
            ),
            linear-gradient(
              180deg,
              rgba(6, 17, 29, 0.98),
              rgba(3, 10, 18, 0.99)
            );
          box-shadow:
            22px 0 55px rgba(0, 0, 0, 0.27),
            inset -1px 0 rgba(255, 255, 255, 0.025);
        }

        .libraryNavigation {
          position: sticky;
          top: 0;
          min-height: 100vh;
          padding: 30px 22px 24px;
          display: flex;
          flex-direction: column;
        }

        .libraryIdentity {
          display: flex;
          align-items: center;
          gap: 14px;
          color: inherit;
          text-decoration: none;
        }

        .identityMark {
          position: relative;
          flex: 0 0 60px;
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid rgba(105, 232, 255, 0.42);
          border-radius: 17px;
          color: #dffcff;
          background:
            radial-gradient(
              circle at 35% 28%,
              rgba(91, 226, 255, 0.25),
              transparent 52%
            ),
            linear-gradient(
              145deg,
              rgba(9, 44, 62, 0.96),
              rgba(3, 17, 29, 0.98)
            );
          box-shadow:
            0 0 28px rgba(54, 199, 230, 0.17),
            inset 0 1px rgba(255, 255, 255, 0.08);
        }

        .identityMark::after {
          content: "";
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(255, 204, 95, 0.28);
          border-radius: 12px;
        }

        .identityMark span,
        .identityMark strong {
          position: relative;
          z-index: 2;
          font-family: Georgia, "Times New Roman", serif;
          line-height: 1;
        }

        .identityMark span {
          margin-top: 6px;
          color: #9befff;
          font-size: 14px;
          letter-spacing: 0.08em;
        }

        .identityMark strong {
          margin-top: -13px;
          color: #ffe19a;
          font-size: 17px;
        }

        .libraryIdentity p {
          margin: 0 0 4px;
          color: #63ddef;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .libraryIdentity h2 {
          margin: 0;
          color: #f8fbff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          line-height: 1.05;
          letter-spacing: -0.025em;
        }

        .navigationDivider {
          height: 1px;
          margin: 25px 0;
          background: linear-gradient(
            90deg,
            rgba(82, 220, 250, 0.48),
            rgba(255, 203, 92, 0.22),
            transparent
          );
        }

        .navigationSections {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .navigationLabel {
          margin: 0 0 8px 10px;
          color: #647d8b;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.19em;
          text-transform: uppercase;
        }

        .navigationLinks {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .navigationLink {
          min-height: 41px;
          padding: 0 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid transparent;
          border-radius: 11px;
          color: #a9bec8;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          transition:
            color 0.22s,
            border-color 0.22s,
            background 0.22s,
            transform 0.22s;
        }

        .navigationLink i {
          color: #55d9ee;
          font-style: normal;
          opacity: 0;
          transform: translateX(-5px);
          transition:
            opacity 0.22s,
            transform 0.22s;
        }

        .navigationLink:hover {
          color: #ffffff;
          border-color: rgba(88, 221, 244, 0.17);
          background:
            linear-gradient(
              90deg,
              rgba(67, 211, 238, 0.09),
              rgba(255, 199, 84, 0.035)
            );
          transform: translateX(3px);
        }

        .navigationLink:hover i {
          opacity: 1;
          transform: translateX(0);
        }

        .navigationStatement {
          margin-top: auto;
          padding: 16px;
          display: grid;
          grid-template-columns: 22px 1fr;
          gap: 10px;
          border: 1px solid rgba(255, 200, 86, 0.18);
          border-radius: 15px;
          color: #eed28e;
          background:
            radial-gradient(
              circle at 0% 0%,
              rgba(255, 193, 63, 0.1),
              transparent 50%
            ),
            rgba(0, 0, 0, 0.19);
        }

        .navigationStatement span {
          color: #ffc95e;
          text-shadow: 0 0 16px rgba(255, 193, 65, 0.72);
        }

        .navigationStatement p {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 12px;
          line-height: 1.45;
        }

        .returnLink {
          margin-top: 12px;
          min-height: 43px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 11px;
          color: #8197a3;
          background: rgba(0, 0, 0, 0.17);
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition:
            color 0.22s,
            border-color 0.22s,
            background 0.22s;
        }

        .returnLink:hover {
          color: white;
          border-color: rgba(93, 223, 247, 0.28);
          background: rgba(77, 214, 239, 0.07);
        }

        .libraryContent {
          position: relative;
          z-index: 2;
          min-width: 0;
          min-height: 100vh;
        }

        .mobileNavigation {
          display: none;
        }

        @keyframes libraryStarDrift {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(125px, 110px, 0);
          }
        }

        @keyframes libraryGlowFloat {
          from {
            transform: translate3d(-18px, -12px, 0) scale(0.96);
          }

          to {
            transform: translate3d(32px, 34px, 0) scale(1.08);
          }
        }

        @keyframes libraryRoutePacket {
          from {
            left: 3%;
          }

          to {
            left: 96%;
          }
        }

        @media (max-width: 980px) {
          .governanceLibraryLayout {
            display: block;
          }

          .desktopSidebar {
            display: none;
          }

          .mobileNavigation {
            position: relative;
            z-index: 20;
            display: block;
            padding: 12px;
            border-bottom: 1px solid rgba(95, 220, 246, 0.13);
            background: rgba(3, 12, 22, 0.94);
            backdrop-filter: blur(18px);
          }

          .mobileNavigation details {
            max-width: 1480px;
            margin: 0 auto;
          }

          .mobileNavigation summary {
            min-height: 52px;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            cursor: pointer;
            list-style: none;
            border: 1px solid rgba(92, 222, 246, 0.18);
            border-radius: 13px;
            color: #f4fbff;
            background:
              linear-gradient(
                90deg,
                rgba(66, 210, 238, 0.08),
                rgba(255, 199, 84, 0.035)
              ),
              rgba(0, 0, 0, 0.21);
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 0.04em;
          }

          .mobileNavigation summary::-webkit-details-marker {
            display: none;
          }

          .mobileNavigation summary i {
            color: #64def2;
            font-style: normal;
            transition: transform 0.25s;
          }

          .mobileNavigation details[open] summary i {
            transform: rotate(180deg);
          }

          .mobileNavigationPanel {
            margin-top: 10px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 17px;
            background: rgba(4, 14, 24, 0.98);
            box-shadow: 0 22px 58px rgba(0, 0, 0, 0.36);
          }

          .mobileNavigationPanel .libraryNavigation {
            position: static;
            min-height: auto;
            padding: 21px;
          }

          .mobileNavigationPanel .navigationStatement {
            margin-top: 25px;
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
    </div>
  );
}
