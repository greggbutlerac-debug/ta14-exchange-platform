import Link from 'next/link';

import { LogoutButton } from '../../components/auth/logout-button';
import { AiGovernanceNavigation } from '../../components/workspace/ai-governance-navigation';
import { requireUser } from '../../lib/auth/require-user';

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();
  const accountEmail = user.email ?? 'Authenticated account';

  return (
    <div className="ta14-workspace-frame">
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
          background: #02050a;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .ta14-workspace-frame {
          min-height: 100vh;
          color: #f5f8ff;
          background:
            radial-gradient(circle at 18% -8%, rgba(56, 194, 255, 0.16), transparent 30%),
            radial-gradient(circle at 92% 12%, rgba(69, 240, 176, 0.09), transparent 25%),
            linear-gradient(180deg, #02050a 0%, #06101a 48%, #02060b 100%);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .ta14-workspace-frame::before {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          content: "";
          opacity: 0.2;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(
            to bottom,
            #000 0%,
            rgba(0,0,0,0.72) 58%,
            transparent 100%
          );
        }

        .ta14-command-bar {
          position: sticky;
          top: 0;
          z-index: 50;
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-right: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.09);
          background: rgba(3, 8, 15, 0.9);
          box-shadow: 0 18px 45px rgba(0,0,0,0.24);
          backdrop-filter: blur(22px);
        }

        .ta14-brand {
          min-height: 76px;
          width: 270px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 18px;
          border-right: 1px solid rgba(255,255,255,0.08);
        }

        .ta14-brand-mark {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(125,211,252,0.38);
          border-radius: 14px;
          color: #e0f2fe;
          background:
            linear-gradient(145deg, rgba(56,189,248,0.24), rgba(15,23,42,0.72));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.16),
            0 12px 26px rgba(14,165,233,0.16);
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .ta14-brand-copy {
          min-width: 0;
          display: grid;
          gap: 3px;
        }

        .ta14-brand-copy strong {
          color: #ffffff;
          font-size: 0.82rem;
          letter-spacing: 0.14em;
        }

        .ta14-brand-copy span {
          overflow: hidden;
          color: #91a4bd;
          font-size: 0.72rem;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .ta14-account-actions {
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .ta14-return-link {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: #dbeafe;
          background: rgba(255,255,255,0.04);
          font-size: 0.78rem;
          font-weight: 800;
          transition:
            color 160ms ease,
            border-color 160ms ease,
            background 160ms ease,
            transform 160ms ease;
        }

        .ta14-return-link:hover,
        .ta14-return-link:focus-visible {
          color: #ffffff;
          border-color: rgba(125,211,252,0.35);
          background: rgba(56,189,248,0.09);
          transform: translateY(-1px);
          outline: none;
        }

        .ta14-account-identity {
          min-width: 0;
          max-width: 220px;
          display: grid;
          gap: 2px;
          text-align: right;
        }

        .ta14-account-identity span {
          color: #7f93ad;
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .ta14-account-identity strong {
          overflow: hidden;
          color: #dbe7f7;
          font-size: 0.76rem;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .ta14-sidebar {
          position: fixed;
          top: 76px;
          bottom: 0;
          left: 0;
          z-index: 30;
          width: 270px;
          display: flex;
          flex-direction: column;
          padding: 22px 14px 26px;
          border-right: 1px solid rgba(255,255,255,0.08);
          background: rgba(3,8,15,0.76);
          backdrop-filter: blur(18px);
          overflow-y: auto;
        }

        .ta14-nav-label {
          display: block;
          padding: 0 10px 10px;
          color: #667991;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .ta14-nav-list {
          display: grid;
          gap: 7px;
        }

        .ta14-nav-item {
          min-height: 48px;
          display: grid;
          grid-template-columns: 32px minmax(0, 1fr);
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border: 1px solid transparent;
          border-radius: 14px;
          color: #b9c7d8;
          font-size: 0.88rem;
          font-weight: 700;
          transition:
            color 160ms ease,
            border-color 160ms ease,
            background 160ms ease,
            transform 160ms ease;
        }

        .ta14-nav-item:hover,
        .ta14-nav-item:focus-visible {
          color: #ffffff;
          border-color: rgba(125,211,252,0.23);
          background: rgba(56,189,248,0.075);
          transform: translateX(2px);
          outline: none;
        }

        .ta14-nav-item.active {
          color: #ffffff;
          border-color: rgba(125,211,252,0.32);
          background:
            linear-gradient(135deg, rgba(56,189,248,0.16), rgba(14,165,233,0.06));
          box-shadow:
            inset 3px 0 0 #38bdf8,
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .ta14-nav-item.partner {
          color: #fde8a8;
          border-color: rgba(251,191,36,0.2);
          background: rgba(245,158,11,0.065);
        }

        .ta14-nav-item.partner.active {
          color: #fff7d6;
          border-color: rgba(251,191,36,0.38);
          background:
            linear-gradient(135deg, rgba(245,158,11,0.16), rgba(251,191,36,0.06));
          box-shadow:
            inset 3px 0 0 #fbbf24,
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .ta14-nav-glyph {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #8fddff;
          background: rgba(255,255,255,0.035);
          font-size: 0.76rem;
          font-weight: 900;
        }

        .ta14-nav-item.partner .ta14-nav-glyph {
          color: #fcd34d;
          border-color: rgba(251,191,36,0.22);
          background: rgba(245,158,11,0.08);
        }

        .ta14-sidebar-note {
          margin-top: auto;
          padding: 16px;
          border: 1px solid rgba(125,211,252,0.13);
          border-radius: 18px;
          background:
            linear-gradient(145deg, rgba(56,189,248,0.08), rgba(255,255,255,0.025));
        }

        .ta14-sidebar-note small {
          display: block;
          color: #7dd3fc;
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ta14-sidebar-note strong {
          display: block;
          margin-top: 8px;
          color: #f8fbff;
          font-size: 0.92rem;
          line-height: 1.4;
        }

        .ta14-sidebar-note p {
          margin: 8px 0 0;
          color: #94a6bd;
          font-size: 0.76rem;
          line-height: 1.55;
        }

        .ta14-sidebar-note a {
          display: inline-flex;
          margin-top: 13px;
          color: #bae6fd;
          font-size: 0.77rem;
          font-weight: 800;
        }

        .ta14-workspace-content {
          position: relative;
          z-index: 1;
          min-height: calc(100vh - 76px);
          margin-left: 270px;
        }

        .ta14-mobile-nav {
          display: none;
        }

        .ta14-mobile-link.active {
          color: #ffffff;
          background: rgba(56,189,248,0.12);
          box-shadow: inset 0 0 0 1px rgba(125,211,252,0.2);
        }

        .ta14-mobile-link.partner.active {
          color: #fff7d6;
          background: rgba(245,158,11,0.13);
          box-shadow: inset 0 0 0 1px rgba(251,191,36,0.22);
        }

        @media (max-width: 1240px) {
          .ta14-brand {
            width: 250px;
            padding-left: 14px;
          }

          .ta14-account-identity {
            display: none;
          }

          .ta14-sidebar {
            width: 250px;
          }

          .ta14-workspace-content {
            margin-left: 250px;
          }
        }

        @media (max-width: 960px) {
          .ta14-sidebar {
            display: none;
          }

          .ta14-brand {
            width: auto;
            min-width: 220px;
            border-right: 0;
          }

          .ta14-workspace-content {
            margin-left: 0;
            padding-bottom: 76px;
          }

          .ta14-mobile-nav {
            position: fixed;
            right: 12px;
            bottom: 12px;
            left: 12px;
            z-index: 60;
            min-height: 62px;
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            padding: 7px;
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 19px;
            background: rgba(4,10,18,0.94);
            box-shadow: 0 22px 55px rgba(0,0,0,0.42);
            backdrop-filter: blur(20px);
          }

          .ta14-mobile-link {
            min-width: 0;
            display: grid;
            place-items: center;
            align-content: center;
            gap: 3px;
            padding: 5px 2px;
            border-radius: 13px;
            color: #aebed2;
            font-size: 0.64rem;
            font-weight: 800;
          }

          .ta14-mobile-link:hover,
          .ta14-mobile-link:focus-visible {
            color: #ffffff;
            background: rgba(56,189,248,0.09);
            outline: none;
          }

          .ta14-mobile-link b {
            color: #7dd3fc;
            font-size: 0.82rem;
          }

          .ta14-mobile-link.partner b {
            color: #fcd34d;
          }
        }

        @media (max-width: 760px) {
          .ta14-command-bar {
            min-height: 66px;
            padding-right: 10px;
          }

          .ta14-brand {
            min-height: 66px;
            min-width: 0;
            padding-left: 12px;
          }

          .ta14-brand-copy span,
          .ta14-return-link {
            display: none;
          }
        }

        @media (max-width: 440px) {
          .ta14-brand-copy strong {
            font-size: 0.72rem;
            letter-spacing: 0.09em;
          }

          .ta14-brand-mark {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
          }

          .ta14-mobile-nav {
            right: 7px;
            bottom: 7px;
            left: 7px;
          }

          .ta14-mobile-link {
            font-size: 0.58rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <header className="ta14-command-bar">
        <Link
          className="ta14-brand"
          href="/"
          aria-label="Return to the TA-14 AI Governance Exchange"
        >
          <span className="ta14-brand-mark">TA-14</span>
          <span className="ta14-brand-copy">
            <strong>TA-14 EXCHANGE</strong>
            <span>AI Governance Playground</span>
          </span>
        </Link>

        <div className="ta14-account-actions">
          <Link className="ta14-return-link" href="/">
            Return to Exchange
          </Link>

          <div className="ta14-account-identity">
            <span>Signed in</span>
            <strong title={accountEmail}>{accountEmail}</strong>
          </div>

          <LogoutButton />
        </div>
      </header>

      <AiGovernanceNavigation />

      <main className="ta14-workspace-content">{children}</main>
    </div>
  );
}
