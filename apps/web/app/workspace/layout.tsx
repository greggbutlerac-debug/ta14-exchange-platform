import Link from 'next/link';

import { LogoutButton } from '../../components/auth/logout-button';
import { requireUser } from '../../lib/auth/require-user';

const workspaceNavigation = [
  { href: '/workspace', label: 'Overview', glyph: '◈', active: true },
  { href: '/workspace/discover', label: 'Discover', glyph: '⌁' },
  { href: '/workspace/build', label: 'Build', glyph: '◇' },
  { href: '/workspace/upload', label: 'Upload', glyph: '⇧' },
  { href: '/workspace/paste', label: 'Paste', glyph: '▤' },
  { href: '/workspace/lab', label: 'Academy Lab', glyph: 'A' },
  { href: '/workspace/scanner', label: 'Scanner', glyph: '⌕' },
  {
    href: '/workspace/demonstrations',
    label: 'Demonstrations',
    glyph: '◎',
  },
];

const recordNavigation = [
  { href: '/records', label: 'Records', glyph: 'R' },
  { href: '/verify', label: 'Verification', glyph: '✓' },
  { href: '/execution-map', label: 'Execution Map', glyph: '↗' },
];

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

        body {
          margin: 0;
          background: #02050a;
        }

        .ta14-workspace-frame {
          min-height: 100vh;
          color: #f5f8ff;
          background:
            radial-gradient(circle at 18% -8%, rgba(56, 194, 255, .16), transparent 30%),
            radial-gradient(circle at 92% 12%, rgba(69, 240, 176, .09), transparent 25%),
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

        .ta14-workspace-frame::before,
        .ta14-workspace-frame::after {
          content: "";
          position: fixed;
          pointer-events: none;
          z-index: 0;
        }

        .ta14-workspace-frame::before {
          inset: 0;
          opacity: .22;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(
            to bottom,
            #000 0%,
            rgba(0,0,0,.75) 58%,
            transparent 100%
          );
        }

        .ta14-workspace-frame::after {
          top: -220px;
          left: 44%;
          width: 760px;
          height: 520px;
          border-radius: 50%;
          transform: translateX(-50%);
          background: rgba(70, 218, 255, .065);
          filter: blur(100px);
          animation: ta14-drift 12s ease-in-out infinite alternate;
        }

        @keyframes ta14-drift {
          from {
            transform: translateX(-54%) translateY(-8px) scale(.96);
          }

          to {
            transform: translateX(-46%) translateY(28px) scale(1.08);
          }
        }

        .ta14-command-bar {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 50;
          display: grid;
          grid-template-columns: 258px minmax(0, 1fr) auto;
          align-items: center;
          min-height: 68px;
          border-bottom: 1px solid rgba(137, 174, 213, .14);
          background: rgba(2, 7, 13, .78);
          box-shadow: 0 18px 60px rgba(0, 0, 0, .22);
          backdrop-filter: blur(24px) saturate(135%);
          -webkit-backdrop-filter: blur(24px) saturate(135%);
        }

        .ta14-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 68px;
          padding: 0 22px;
          border-right: 1px solid rgba(137, 174, 213, .12);
          color: #fff;
          text-decoration: none;
        }

        .ta14-brand-mark {
          display: grid;
          place-items: center;
          width: 39px;
          height: 39px;
          flex: 0 0 39px;
          border: 1px solid rgba(84, 232, 255, .46);
          border-radius: 13px;
          color: #eaffff;
          background: linear-gradient(
            145deg,
            rgba(84, 232, 255, .18),
            rgba(41, 167, 255, .04)
          );
          box-shadow:
            0 0 28px rgba(41, 167, 255, .18),
            inset 0 0 18px rgba(84, 232, 255, .05);
          font-size: .82rem;
          font-weight: 950;
          letter-spacing: -.03em;
        }

        .ta14-brand-copy {
          display: grid;
          gap: 2px;
          min-width: 0;
        }

        .ta14-brand-copy strong {
          font-size: .78rem;
          letter-spacing: .13em;
          white-space: nowrap;
        }

        .ta14-brand-copy span {
          color: #6f879e;
          font-size: .66rem;
          font-weight: 800;
          letter-spacing: .06em;
          white-space: nowrap;
        }

        .ta14-command-context {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          padding: 0 22px;
        }

        .ta14-live-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 7px;
          border-radius: 50%;
          background: #4af0aa;
          box-shadow: 0 0 14px rgba(74, 240, 170, .76);
        }

        .ta14-command-context strong {
          overflow: hidden;
          color: #dfeaf5;
          font-size: .78rem;
          letter-spacing: .03em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ta14-command-context span:last-child {
          overflow: hidden;
          color: #6f859b;
          font-size: .75rem;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ta14-command-actions {
          display: flex;
          align-items: center;
          gap: 9px;
          padding-right: 18px;
        }

        .ta14-account-identity {
          display: grid;
          max-width: 190px;
          gap: 2px;
          padding: 0 4px 0 8px;
          text-align: right;
        }

        .ta14-account-identity span {
          color: #5f7890;
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .ta14-account-identity strong {
          overflow: hidden;
          color: #dce8f3;
          font-size: .7rem;
          font-weight: 800;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ta14-command-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 14px;
          border: 1px solid rgba(137, 174, 213, .17);
          border-radius: 999px;
          color: #cbd9e7;
          background: rgba(9, 19, 31, .68);
          text-decoration: none;
          font-size: .74rem;
          font-weight: 850;
          transition:
            transform .2s ease,
            border-color .2s ease,
            background .2s ease;
        }

        .ta14-command-link:hover {
          transform: translateY(-1px);
          border-color: rgba(84, 232, 255, .42);
          background: rgba(16, 35, 52, .88);
        }

        .ta14-command-link.primary {
          border-color: rgba(84, 232, 255, .28);
          color: #03100c;
          background: linear-gradient(100deg, #54e8ff, #39f2a1);
          box-shadow: 0 0 28px rgba(57, 242, 161, .13);
        }

        .ta14-sidebar {
          position: fixed;
          top: 68px;
          bottom: 0;
          left: 0;
          z-index: 40;
          display: flex;
          width: 258px;
          flex-direction: column;
          padding: 22px 14px 18px;
          overflow-y: auto;
          border-right: 1px solid rgba(137, 174, 213, .12);
          background: rgba(3, 9, 16, .72);
          backdrop-filter: blur(22px) saturate(125%);
          -webkit-backdrop-filter: blur(22px) saturate(125%);
        }

        .ta14-nav-section + .ta14-nav-section {
          margin-top: 24px;
          padding-top: 22px;
          border-top: 1px solid rgba(137, 174, 213, .10);
        }

        .ta14-nav-label {
          display: block;
          padding: 0 10px 9px;
          color: #526b82;
          font-size: .63rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .ta14-nav-list {
          display: grid;
          gap: 4px;
        }

        .ta14-nav-item {
          display: grid;
          grid-template-columns: 31px minmax(0, 1fr) auto;
          align-items: center;
          min-height: 44px;
          padding: 0 10px;
          border: 1px solid transparent;
          border-radius: 13px;
          color: #8fa4b9;
          text-decoration: none;
          font-size: .79rem;
          font-weight: 800;
          transition:
            color .2s ease,
            border-color .2s ease,
            background .2s ease,
            transform .2s ease;
        }

        .ta14-nav-item:hover {
          transform: translateX(2px);
          border-color: rgba(137, 174, 213, .13);
          color: #e6f2fc;
          background: rgba(12, 27, 43, .58);
        }

        .ta14-nav-item.active {
          border-color: rgba(84, 232, 255, .21);
          color: #f1fbff;
          background: linear-gradient(
            90deg,
            rgba(42, 167, 255, .16),
            rgba(57, 242, 161, .05)
          );
          box-shadow: inset 2px 0 0 #54e8ff;
        }

        .ta14-nav-glyph {
          display: grid;
          place-items: center;
          width: 25px;
          height: 25px;
          border: 1px solid rgba(137, 174, 213, .12);
          border-radius: 8px;
          color: #6edff5;
          background: rgba(3, 9, 16, .55);
          font-size: .72rem;
          font-weight: 950;
        }

        .ta14-nav-soon {
          color: #496176;
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .ta14-academy-card {
          position: relative;
          margin-top: auto;
          padding: 18px;
          overflow: hidden;
          border: 1px solid rgba(84, 232, 255, .18);
          border-radius: 18px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(84, 232, 255, .14),
              transparent 42%
            ),
            linear-gradient(
              145deg,
              rgba(15, 32, 49, .92),
              rgba(5, 13, 22, .92)
            );
        }

        .ta14-academy-card::after {
          content: "A";
          position: absolute;
          right: -4px;
          bottom: -24px;
          color: rgba(255,255,255,.025);
          font-size: 7rem;
          font-weight: 1000;
        }

        .ta14-academy-card small {
          position: relative;
          z-index: 1;
          color: #61ddf6;
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .ta14-academy-card strong {
          position: relative;
          z-index: 1;
          display: block;
          margin: 8px 0;
          font-size: .95rem;
          line-height: 1.25;
        }

        .ta14-academy-card p {
          position: relative;
          z-index: 1;
          margin: 0 0 13px;
          color: #8298ad;
          font-size: .72rem;
          line-height: 1.55;
        }

        .ta14-academy-card a {
          position: relative;
          z-index: 1;
          color: #dffaff;
          text-decoration: none;
          font-size: .72rem;
          font-weight: 900;
        }

        .ta14-workspace-content {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          margin-left: 258px;
          padding-top: 68px;
        }

        .ta14-workspace-content .workspace-shell {
          padding-top: 42px !important;
        }

        .ta14-workspace-content .workspace-shell > .wrap > .topbar {
          display: none !important;
        }

        .ta14-workspace-content .workspace-shell .wrap {
          width: min(1220px, calc(100% - 48px)) !important;
        }

        .ta14-mobile-nav {
          display: none;
        }

        @media (max-width: 1180px) {
          .ta14-account-identity {
            display: none;
          }
        }

        @media (max-width: 1080px) {
          .ta14-command-bar {
            grid-template-columns: 224px minmax(0, 1fr) auto;
          }

          .ta14-brand,
          .ta14-sidebar {
            width: 224px;
          }

          .ta14-workspace-content {
            margin-left: 224px;
          }

          .ta14-command-context span:last-child,
          .ta14-command-link.secondary-link {
            display: none;
          }
        }

        @media (max-width: 820px) {
          .ta14-command-bar {
            grid-template-columns: minmax(0, 1fr) auto;
          }

          .ta14-brand {
            width: auto;
            border-right: 0;
          }

          .ta14-command-context,
          .ta14-sidebar {
            display: none;
          }

          .ta14-command-actions {
            padding-right: 12px;
          }

          .ta14-command-link.secondary-link {
            display: none;
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
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 5px;
            padding: 7px;
            border: 1px solid rgba(137, 174, 213, .18);
            border-radius: 19px;
            background: rgba(3, 9, 16, .88);
            box-shadow: 0 24px 70px rgba(0, 0, 0, .42);
            backdrop-filter: blur(24px) saturate(140%);
            -webkit-backdrop-filter: blur(24px) saturate(140%);
          }

          .ta14-mobile-nav a {
            display: grid;
            place-items: center;
            gap: 4px;
            min-height: 48px;
            border-radius: 13px;
            color: #8197ac;
            text-decoration: none;
            font-size: .58rem;
            font-weight: 850;
          }

          .ta14-mobile-nav a:first-child {
            color: #e9fbff;
            background: rgba(41, 167, 255, .13);
          }

          .ta14-mobile-nav b {
            color: #69def6;
            font-size: .9rem;
          }
        }

        @media (max-width: 560px) {
          .ta14-command-bar {
            min-height: 62px;
          }

          .ta14-brand {
            min-height: 62px;
            padding-left: 12px;
          }

          .ta14-brand-copy span {
            display: none;
          }

          .ta14-brand-mark {
            width: 36px;
            height: 36px;
            flex-basis: 36px;
          }

          .ta14-command-link {
            display: none;
          }

          .ta14-workspace-content {
            padding-top: 62px;
          }

          .ta14-workspace-content .workspace-shell .wrap {
            width: min(1220px, calc(100% - 28px)) !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ta14-workspace-frame::after {
            animation: none;
          }

          .ta14-nav-item,
          .ta14-command-link {
            transition: none;
          }
        }
      `}</style>

      <header className="ta14-command-bar">
        <Link className="ta14-brand" href="/" aria-label="TA-14 Exchange home">
          <span className="ta14-brand-mark">14</span>

          <span className="ta14-brand-copy">
            <strong>TA-14 EXCHANGE</strong>
            <span>Admissible Execution Workspace</span>
          </span>
        </Link>

        <div className="ta14-command-context" aria-label="Workspace status">
          <span className="ta14-live-dot" aria-hidden="true" />
          <strong>Authenticated workspace</strong>
          <span>One Exchange · One Engine · One Record</span>
        </div>

        <nav className="ta14-command-actions" aria-label="Global navigation">
          <div className="ta14-account-identity">
            <span>Signed in</span>
            <strong title={accountEmail}>{accountEmail}</strong>
          </div>

          <Link
            className="ta14-command-link secondary-link"
            href="/architecture"
          >
            Architecture
          </Link>

          <Link className="ta14-command-link primary" href="/verify">
            Verify record
          </Link>

          <LogoutButton />
        </nav>
      </header>

      <aside className="ta14-sidebar" aria-label="Workspace navigation">
        <section className="ta14-nav-section">
          <span className="ta14-nav-label">Build and test</span>

          <nav className="ta14-nav-list">
            {workspaceNavigation.map((item) => (
              <Link
                className={`ta14-nav-item${item.active ? ' active' : ''}`}
                href={item.href}
                key={item.href}
              >
                <span className="ta14-nav-glyph" aria-hidden="true">
                  {item.glyph}
                </span>

                <span>{item.label}</span>

                {!item.active && (
                  <span className="ta14-nav-soon">Soon</span>
                )}
              </Link>
            ))}
          </nav>
        </section>

        <section className="ta14-nav-section">
          <span className="ta14-nav-label">Records and proof</span>

          <nav className="ta14-nav-list">
            {recordNavigation.map((item) => (
              <Link className="ta14-nav-item" href={item.href} key={item.href}>
                <span className="ta14-nav-glyph" aria-hidden="true">
                  {item.glyph}
                </span>

                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </section>

        <article className="ta14-academy-card">
          <small>TA-14 Academy</small>
          <strong>Learn how consequential routes are built.</strong>

          <p>
            Study the chain, enter guided labs, and carry each lesson directly
            into the Exchange.
          </p>

          <Link href="/academy">Enter the Academy →</Link>
        </article>
      </aside>

      <main className="ta14-workspace-content">{children}</main>

      <nav className="ta14-mobile-nav" aria-label="Mobile workspace navigation">
        <Link href="/workspace">
          <b>◈</b>
          Overview
        </Link>

        <Link href="/workspace/build">
          <b>◇</b>
          Build
        </Link>

        <Link href="/workspace/lab">
          <b>A</b>
          Academy
        </Link>

        <Link href="/records">
          <b>R</b>
          Records
        </Link>

        <Link href="/verify">
          <b>✓</b>
          Verify
        </Link>
      </nav>
    </div>
  );
}
