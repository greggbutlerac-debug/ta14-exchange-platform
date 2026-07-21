// apps/web/app/marketplace/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type MarketplaceLayoutProps = {
  children: ReactNode;
};

const marketplaceNavigation = [
  {
    label: 'Marketplace',
    href: '/marketplace',
    match: (pathname: string) => pathname === '/marketplace',
  },
  {
    label: 'Opportunities',
    href: '/marketplace/opportunities',
    match: (pathname: string) => pathname.startsWith('/marketplace/opportunities'),
  },
  {
    label: 'Professionals',
    href: '/marketplace/professionals',
    match: (pathname: string) => pathname.startsWith('/marketplace/professionals'),
  },
  {
    label: 'Governed Records',
    href: '/marketplace/governed-records',
    match: (pathname: string) => pathname.startsWith('/marketplace/governed-records'),
  },
  {
    label: 'Routes',
    href: '/marketplace/routes',
    match: (pathname: string) => pathname.startsWith('/marketplace/routes'),
  },
  {
    label: 'Dashboard',
    href: '/marketplace/dashboard',
    match: (pathname: string) => pathname.startsWith('/marketplace/dashboard'),
  },
];

export default function MarketplaceLayout({ children }: MarketplaceLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="marketplace-layout">
      <a className="skip-link" href="#marketplace-content">
        Skip to Marketplace content
      </a>

      <header className="marketplace-header">
        <div className="header-shell">
          <Link className="brand" href="/marketplace" aria-label="TA-14 Marketplace home">
            <span className="brand-mark">TA-14</span>
            <span className="brand-copy">
              <strong>Collaborative Governance Marketplace</strong>
              <small>Needs · Professionals · Records · Routes</small>
            </span>
          </Link>

          <nav className="desktop-navigation" aria-label="Marketplace navigation">
            {marketplaceNavigation.map((item) => {
              const active = item.match(pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? 'navigation-link active' : 'navigation-link'}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link className="post-need-button" href="/marketplace/post-a-need">
            Post a Need
          </Link>
        </div>

        <div className="mobile-navigation-shell">
          <nav className="mobile-navigation" aria-label="Marketplace mobile navigation">
            {marketplaceNavigation.map((item) => {
              const active = item.match(pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? 'mobile-link active' : 'mobile-link'}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/marketplace/post-a-need"
              className={
                pathname.startsWith('/marketplace/post-a-need')
                  ? 'mobile-link active'
                  : 'mobile-link'
              }
              aria-current={
                pathname.startsWith('/marketplace/post-a-need') ? 'page' : undefined
              }
            >
              Post a Need
            </Link>
          </nav>
        </div>

        <div className="platform-boundary">
          <div className="boundary-shell">
            <strong>Marketplace demonstration environment</strong>
            <span>
              Pages are connected. Live matching, contracting, payments, identity verification,
              licensing, messaging, and persistence are not yet connected.
            </span>
          </div>
        </div>
      </header>

      <div id="marketplace-content">{children}</div>

      <footer className="marketplace-footer">
        <div className="footer-shell">
          <div className="footer-brand">
            <span className="brand-mark">TA-14</span>
            <div>
              <strong>Collaborative Governance Marketplace</strong>
              <p>
                A governed coordination environment for consequential review, records, routes, and
                professional work.
              </p>
            </div>
          </div>

          <div className="footer-navigation">
            <div>
              <span>Explore</span>
              <Link href="/marketplace/opportunities">Opportunities</Link>
              <Link href="/marketplace/professionals">Professionals</Link>
              <Link href="/marketplace/governed-records">Governed Records</Link>
            </div>

            <div>
              <span>Workspaces</span>
              <Link href="/marketplace/routes">Route Marketplace</Link>
              <Link href="/marketplace/dashboard">Professional Dashboard</Link>
              <Link href="/marketplace/post-a-need">Post a Governance Need</Link>
            </div>

            <div>
              <span>Governance boundary</span>
              <p>No admissible evidence. No admissible execution.</p>
              <p>Participation does not create authority.</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-shell">
            <span>TA-14 Authority Governance Institution</span>
            <span>Marketplace front-end demonstration</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-padding-top: 112px;
        }

        :global(body) {
          margin: 0;
          background: #06111d;
        }

        :global(a) {
          color: inherit;
        }

        .marketplace-layout {
          min-height: 100vh;
          color: #eef8ff;
          background: #06111d;
        }

        .skip-link {
          position: fixed;
          top: 10px;
          left: 10px;
          z-index: 1000;
          padding: 11px 14px;
          border-radius: 10px;
          color: #04121a;
          background: #8be5f7;
          font-weight: 900;
          text-decoration: none;
          transform: translateY(-150%);
          transition: transform 160ms ease;
        }

        .skip-link:focus {
          transform: translateY(0);
        }

        .marketplace-header {
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(108, 198, 221, 0.14);
          background: rgba(5, 17, 29, 0.94);
          backdrop-filter: blur(20px);
        }

        .header-shell,
        .boundary-shell,
        .footer-shell,
        .footer-bottom-shell {
          width: min(1180px, calc(100% - 36px));
          margin: 0 auto;
        }

        .header-shell {
          min-height: 76px;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 26px;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          text-decoration: none;
        }

        .brand-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 58px;
          height: 38px;
          border: 1px solid rgba(118, 218, 240, 0.3);
          border-radius: 11px;
          color: #9beafb;
          background: rgba(76, 196, 224, 0.08);
          font-size: 0.83rem;
          font-weight: 950;
          letter-spacing: 0.06em;
        }

        .brand-copy {
          display: grid;
          min-width: 0;
        }

        .brand-copy strong {
          overflow: hidden;
          color: #effaff;
          font-size: 0.9rem;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .brand-copy small {
          margin-top: 4px;
          overflow: hidden;
          color: #7595a4;
          font-size: 0.68rem;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .desktop-navigation {
          display: flex;
          justify-content: center;
          gap: 4px;
          min-width: 0;
        }

        .navigation-link {
          border-radius: 999px;
          padding: 10px 11px;
          color: #92b4c1;
          font-size: 0.8rem;
          font-weight: 800;
          text-decoration: none;
          transition:
            color 160ms ease,
            background 160ms ease;
        }

        .navigation-link:hover {
          color: #f3fbff;
          background: rgba(255, 255, 255, 0.035);
        }

        .navigation-link.active {
          color: #06131b;
          background: #7edff3;
        }

        .post-need-button {
          border: 1px solid rgba(126, 224, 245, 0.58);
          border-radius: 999px;
          padding: 11px 15px;
          color: #041219;
          background: linear-gradient(135deg, #a6efff, #60d2ea);
          font-size: 0.81rem;
          font-weight: 950;
          text-decoration: none;
          white-space: nowrap;
        }

        .mobile-navigation-shell {
          display: none;
          overflow-x: auto;
          border-top: 1px solid rgba(108, 198, 221, 0.1);
          scrollbar-width: none;
        }

        .mobile-navigation-shell::-webkit-scrollbar {
          display: none;
        }

        .mobile-navigation {
          width: max-content;
          min-width: 100%;
          display: flex;
          gap: 5px;
          padding: 9px 12px;
        }

        .mobile-link {
          border-radius: 999px;
          padding: 9px 11px;
          color: #91b1bf;
          font-size: 0.76rem;
          font-weight: 850;
          text-decoration: none;
          white-space: nowrap;
        }

        .mobile-link.active {
          color: #05131b;
          background: #7edff3;
        }

        .platform-boundary {
          border-top: 1px solid rgba(108, 198, 221, 0.1);
          background: rgba(184, 126, 17, 0.055);
        }

        .boundary-shell {
          min-height: 33px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 7px 0;
          color: #b7a977;
          font-size: 0.7rem;
          line-height: 1.45;
          text-align: center;
        }

        .boundary-shell strong {
          color: #e1c568;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .marketplace-footer {
          position: relative;
          z-index: 2;
          border-top: 1px solid rgba(110, 198, 221, 0.14);
          background:
            radial-gradient(circle at top left, rgba(48, 161, 194, 0.07), transparent 35%),
            #05101b;
        }

        .footer-shell {
          display: grid;
          grid-template-columns: minmax(250px, 0.85fr) minmax(0, 1.4fr);
          gap: 70px;
          padding: 58px 0 48px;
        }

        .footer-brand {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .footer-brand strong {
          display: block;
          margin-top: 5px;
          font-size: 1rem;
        }

        .footer-brand p {
          margin: 12px 0 0;
          color: #7895a3;
          font-size: 0.86rem;
          line-height: 1.65;
        }

        .footer-navigation {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 30px;
        }

        .footer-navigation > div {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .footer-navigation span {
          margin-bottom: 5px;
          color: #6fcde3;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .footer-navigation a {
          color: #96b6c3;
          font-size: 0.84rem;
          text-decoration: none;
        }

        .footer-navigation a:hover {
          color: #effaff;
        }

        .footer-navigation p {
          margin: 0;
          color: #8d9fa7;
          font-size: 0.82rem;
          line-height: 1.55;
        }

        .footer-bottom {
          border-top: 1px solid rgba(110, 198, 221, 0.1);
        }

        .footer-bottom-shell {
          min-height: 54px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
          color: #627d8a;
          font-size: 0.72rem;
        }

        @media (max-width: 1120px) {
          .header-shell {
            grid-template-columns: auto 1fr auto;
          }

          .desktop-navigation {
            display: none;
          }

          .mobile-navigation-shell {
            display: block;
          }
        }

        @media (max-width: 760px) {
          :global(html) {
            scroll-padding-top: 150px;
          }

          .header-shell {
            width: min(100% - 24px, 1180px);
            min-height: 68px;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 12px;
          }

          .brand-copy small {
            display: none;
          }

          .post-need-button {
            padding: 10px 12px;
            font-size: 0.75rem;
          }

          .boundary-shell {
            width: min(100% - 24px, 1180px);
            align-items: flex-start;
            flex-direction: column;
            gap: 3px;
            padding: 8px 0;
            text-align: left;
          }

          .footer-shell {
            width: min(100% - 24px, 1180px);
            grid-template-columns: 1fr;
            gap: 38px;
            padding: 45px 0 38px;
          }

          .footer-navigation {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .footer-bottom-shell {
            width: min(100% - 24px, 1180px);
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
            padding: 13px 0;
          }
        }

        @media (max-width: 480px) {
          .brand-mark {
            min-width: 51px;
            height: 35px;
            font-size: 0.74rem;
          }

          .brand-copy strong {
            font-size: 0.78rem;
          }

          .post-need-button {
            max-width: 106px;
            text-align: center;
            white-space: normal;
          }

          .footer-navigation {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skip-link,
          .navigation-link {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
