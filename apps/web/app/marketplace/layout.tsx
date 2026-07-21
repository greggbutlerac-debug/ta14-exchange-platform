import Link from 'next/link';

import {
  marketplaceActions,
  marketplaceNavigation,
} from '../../lib/marketplace-routes';

export default function MarketplaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="marketplaceLayout">
      <div className="marketplaceNavShell">
        <div className="marketplaceNavInner">
          <div className="marketplaceNavIdentity">
            <span>TA-14 MARKETPLACE</span>
            <strong>Governance work, review, records, and collaboration</strong>
          </div>

          <nav
            className="marketplaceNavigation"
            aria-label="Marketplace navigation"
          >
            {marketplaceNavigation.map((item) => (
              <Link
                aria-label={item.description}
                href={item.href}
                key={item.key}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            aria-label={marketplaceActions.postNeed.description}
            className="marketplaceNavAction"
            href={marketplaceActions.postNeed.href}
          >
            {marketplaceActions.postNeed.label}
          </Link>
        </div>
      </div>

      {children}

      <style>{`
        .marketplaceLayout {
          min-height: 100%;
        }

        .marketplaceNavShell {
          position: sticky;
          top: 76px;
          z-index: 900;
          border-bottom: 1px solid rgba(118, 213, 220, 0.12);
          background:
            linear-gradient(
              180deg,
              rgba(5, 17, 25, 0.97),
              rgba(5, 17, 25, 0.88)
            );
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .marketplaceNavInner {
          width: min(1240px, calc(100% - 32px));
          min-height: 64px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 24px;
          align-items: center;
        }

        .marketplaceNavIdentity {
          display: grid;
          gap: 3px;
          min-width: 190px;
        }

        .marketplaceNavIdentity span {
          color: #67e0df;
          font-size: 0.63rem;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .marketplaceNavIdentity strong {
          color: #dcebed;
          font-size: 0.72rem;
          line-height: 1.35;
        }

        .marketplaceNavigation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .marketplaceNavigation a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 34px;
          padding: 0 10px;
          border: 1px solid transparent;
          border-radius: 999px;
          color: #9eb7be;
          text-decoration: none;
          font-size: 0.74rem;
          font-weight: 760;
          white-space: nowrap;
          transition:
            color 180ms ease,
            background 180ms ease,
            border-color 180ms ease,
            transform 180ms ease;
        }

        .marketplaceNavigation a:hover,
        .marketplaceNavigation a:focus-visible {
          color: #f3fbfc;
          border-color: rgba(103, 224, 223, 0.26);
          background: rgba(103, 224, 223, 0.06);
          transform: translateY(-1px);
          outline: none;
        }

        .marketplaceNavAction {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 14px;
          border: 1px solid rgba(255, 216, 120, 0.3);
          border-radius: 999px;
          color: #fff1bd;
          background: rgba(255, 216, 120, 0.07);
          text-decoration: none;
          font-size: 0.74rem;
          font-weight: 850;
          white-space: nowrap;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .marketplaceNavAction:hover,
        .marketplaceNavAction:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(255, 216, 120, 0.52);
          background: rgba(255, 216, 120, 0.12);
          outline: none;
        }

        @media (max-width: 1120px) {
          .marketplaceNavInner {
            grid-template-columns: auto auto;
            justify-content: space-between;
            gap: 14px;
            padding: 10px 0;
          }

          .marketplaceNavigation {
            grid-column: 1 / -1;
            order: 3;
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 2px;
            scrollbar-width: thin;
          }

          .marketplaceNavigation a {
            flex: 0 0 auto;
          }
        }

        @media (max-width: 620px) {
          .marketplaceNavShell {
            top: 106px;
          }

          .marketplaceNavInner {
            width: min(100% - 20px, 1240px);
          }

          .marketplaceNavIdentity strong {
            display: none;
          }

          .marketplaceNavIdentity {
            min-width: auto;
          }

          .marketplaceNavAction {
            min-height: 35px;
            padding: 0 11px;
            font-size: 0.68rem;
          }

          .marketplaceNavigation a {
            min-height: 32px;
            padding: 0 9px;
            font-size: 0.7rem;
          }
        }

        @media (max-width: 430px) {
          .marketplaceNavShell {
            top: 104px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marketplaceNavigation a,
          .marketplaceNavAction {
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </div>
  );
}
