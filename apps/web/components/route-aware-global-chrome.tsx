"use client";

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';

import { SiteActivityCounter } from './site-activity-counter';
import { AtlasEnvironmentalIntegrityFundStrip } from './atlas-environmental-integrity-fund-strip';

export function RouteAwareGlobalChrome() {
  const pathname = usePathname();
  const isTransparentAir = pathname === '/transparent-air' || pathname.startsWith('/transparent-air/');
  const isPrivateEnvironmentalGateway = pathname === '/admin/environmental-evidence-gateway' || pathname.startsWith('/admin/environmental-evidence-gateway/');
  const isPrivateGcea = pathname === '/admin/governance-continuity-execution-authority' || pathname.startsWith('/admin/governance-continuity-execution-authority/');
  const isAcademy = pathname === '/academy' || pathname.startsWith('/academy/');
  const isHvacSchoolOffer = pathname === '/academy/hvac/schools' || pathname.startsWith('/academy/hvac/schools/');
  const isConsequenceBoundary = pathname === '/consequence-boundary';
  const isPublicShowroom =
    pathname.includes('/showcase/') ||
    pathname.startsWith('/governance-showcase/') ||
    (pathname.startsWith('/global-institutional-engagement/') && pathname !== '/global-institutional-engagement/showrooms') ||
    pathname === '/admissible-federation-architecture' ||
    pathname === '/execution-authority-boundary-architecture' ||
    pathname === '/ai-governance/ta14-architecture-showroom' ||
    pathname === '/ai-governance/admissible-architecture';
  const isEnvironmentalIntegrityContext =
    pathname === '/environmental-integrity-governance' ||
    pathname.startsWith('/environmental-integrity-governance/') ||
    pathname === '/atlas-environmental-integrity-fund' ||
    pathname.startsWith('/atlas-environmental-integrity-fund/');

  const isGuidedEuClassifier = pathname === '/eu-ai-act/classifier-review' || pathname === '/eu-ai-act/classifier';
  if (isTransparentAir || isPrivateEnvironmentalGateway || isPrivateGcea || isGuidedEuClassifier) return null;

  return (
    <>
      {isEnvironmentalIntegrityContext && !isPublicShowroom ? <AtlasEnvironmentalIntegrityFundStrip /> : null}

      {isAcademy && !isHvacSchoolOffer ? (
        <>
          <a className="academy-school-commercial-cta" href="/academy/hvac/schools" aria-label="HVAC schools: bring TA-14 into your program">
            <span className="academy-school-commercial-cta-icon" aria-hidden="true">SC</span>
            <span className="academy-school-commercial-cta-copy">
              <strong>HVAC SCHOOLS</strong>
              <small>Bring TA-14 Into Your Program</small>
            </span>
            <span className="academy-school-commercial-cta-arrow" aria-hidden="true">→</span>
          </a>
          <style>{`
            .academy-school-commercial-cta {
              position: fixed;
              left: 21px;
              bottom: 22px;
              z-index: 89;
              width: 228px;
              min-height: 62px;
              display: grid;
              grid-template-columns: 34px minmax(0, 1fr) 24px;
              align-items: center;
              gap: 10px;
              padding: 10px 11px;
              border: 1px solid rgba(242, 196, 86, .78);
              border-radius: 13px;
              color: #fff;
              background: linear-gradient(135deg, rgba(63, 48, 11, .97), rgba(23, 22, 15, .98));
              box-shadow: 0 14px 34px rgba(0,0,0,.32), inset 3px 0 0 #f2c456, inset 0 1px 0 rgba(255,255,255,.06);
              text-decoration: none;
              backdrop-filter: blur(18px);
              transition: 160ms ease;
            }
            .academy-school-commercial-cta:hover,
            .academy-school-commercial-cta:focus-visible {
              border-color: #f2c456;
              background: linear-gradient(135deg, rgba(78, 59, 12, .99), rgba(29, 27, 17, .99));
              outline: none;
              transform: translateX(2px);
            }
            .academy-school-commercial-cta-icon {
              width: 32px;
              height: 32px;
              display: grid;
              place-items: center;
              border: 1px solid rgba(242, 196, 86, .28);
              border-radius: 9px;
              color: #f2c456;
              background: rgba(242, 196, 86, .07);
              font-size: .56rem;
              font-weight: 950;
              letter-spacing: -.02em;
            }
            .academy-school-commercial-cta-copy {
              min-width: 0;
              display: grid;
              gap: 3px;
            }
            .academy-school-commercial-cta-copy strong {
              color: #f2c456;
              font-size: .71rem;
              font-weight: 950;
              letter-spacing: .06em;
            }
            .academy-school-commercial-cta-copy small {
              overflow: hidden;
              color: #f7f0dc;
              font-size: .61rem;
              font-weight: 760;
              line-height: 1.25;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .academy-school-commercial-cta-arrow {
              color: #f2c456;
              font-size: 1.18rem;
              font-weight: 950;
              text-align: center;
            }
            @media (max-width: 1180px) {
              .academy-school-commercial-cta {
                left: 18px;
                width: 212px;
              }
            }
            @media (max-width: 760px) {
              .academy-school-commercial-cta {
                left: 10px;
                right: auto;
                bottom: 86px;
                width: min(300px, calc(100vw - 20px));
                min-height: 52px;
                grid-template-columns: 30px minmax(0, 1fr) 22px;
                padding: 8px 10px;
              }
              .academy-school-commercial-cta-icon {
                width: 29px;
                height: 29px;
              }
            }
          `}</style>
        </>
      ) : null}

      {isPublicShowroom ? (
        <>
          <nav className="ta14-showroom-wayfinding" aria-label="TA-14 showroom navigation">
            <a href="/" aria-label="Return to TA-14 Exchange">TA-14 EXCHANGE</a>
            <span aria-hidden="true">·</span>
            <a href="/governance-showcase">GOVERNANCE SHOWCASES</a>
            <span aria-hidden="true">·</span>
            <a href="/global-institutional-engagement/showrooms">PUBLIC SHOWROOMS</a>
          </nav>
          <style>{`
            .ta14-showroom-wayfinding {
              position: fixed;
              left: 18px;
              bottom: 18px;
              z-index: 88;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              gap: 8px;
              max-width: min(720px, calc(100vw - 36px));
              padding: 10px 13px;
              border: 1px solid rgba(239,198,110,.34);
              border-radius: 12px;
              background: rgba(3,8,14,.94);
              box-shadow: 0 14px 38px rgba(0,0,0,.34);
              backdrop-filter: blur(16px);
              font-family: Inter,ui-sans-serif,system-ui,sans-serif;
            }
            .ta14-showroom-wayfinding a {
              color: #efc66e;
              text-decoration: none;
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .08em;
              white-space: nowrap;
            }
            .ta14-showroom-wayfinding a:hover,
            .ta14-showroom-wayfinding a:focus-visible {
              color: #fff;
              text-decoration: underline;
              text-underline-offset: 3px;
              outline: none;
            }
            .ta14-showroom-wayfinding span { color: rgba(255,255,255,.28); }
            @media (max-width: 760px) {
              .ta14-showroom-wayfinding {
                left: 10px;
                right: 10px;
                bottom: 10px;
                max-width: none;
                justify-content: center;
                gap: 6px;
                padding: 9px 10px;
              }
              .ta14-showroom-wayfinding a { font-size: 9px; }
            }
          `}</style>
        </>
      ) : null}

      {!isConsequenceBoundary ? (
        <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
          <Suspense fallback={null}>
            <SiteActivityCounter />
          </Suspense>
        </div>
      ) : null}
    </>
  );
}
