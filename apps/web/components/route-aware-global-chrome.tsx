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
  const isEnvironmentalIntegrityContext =
    pathname === '/environmental-integrity-governance' ||
    pathname.startsWith('/environmental-integrity-governance/') ||
    pathname === '/atlas-environmental-integrity-fund' ||
    pathname.startsWith('/atlas-environmental-integrity-fund/');

  if (isTransparentAir || isPrivateEnvironmentalGateway || isPrivateGcea) return null;

  return (
    <>
      {isEnvironmentalIntegrityContext ? <AtlasEnvironmentalIntegrityFundStrip /> : null}

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

      <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
        <Suspense fallback={null}>
          <SiteActivityCounter />
        </Suspense>
      </div>
    </>
  );
}
