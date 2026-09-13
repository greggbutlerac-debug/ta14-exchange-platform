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
  const isOperationalMissionRecord =
    pathname === '/workspace/ai-governance/operational-mission-records' ||
    pathname.startsWith('/workspace/ai-governance/operational-mission-records/') ||
    pathname === '/public/ai-governance/operational-mission-records' ||
    pathname.startsWith('/public/ai-governance/operational-mission-records/');
  const isAdmissibleComputationResearch =
    pathname === '/ai-governance/admissible-computation' ||
    pathname.startsWith('/ai-governance/admissible-computation/') ||
    pathname === '/workspace/ai-governance/admissible-computation' ||
    pathname.startsWith('/workspace/ai-governance/admissible-computation/') ||
    pathname === '/public/ai-governance/admissible-computation' ||
    pathname.startsWith('/public/ai-governance/admissible-computation/');
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
            <span className="academy-school-commercial-cta-kicker">HVAC SCHOOLS</span>
            <strong>Bring TA-14 Into Your Program</strong>
            <span className="academy-school-commercial-cta-copy">Free for students. Licensed to teach.</span>
            <span className="academy-school-commercial-cta-arrow">→</span>
          </a>
          <style>{`
            .academy-school-commercial-cta {
              position: fixed;
              left: 270px;
              top: 50%;
              z-index: 89;
              width: 88px;
              min-height: 248px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 12px;
              padding: 16px 10px;
              border: 1px solid rgba(98, 239, 178, .55);
              border-left: 0;
              border-radius: 0 18px 18px 0;
              color: #effcff;
              background: linear-gradient(180deg, rgba(5, 31, 39, .98), rgba(3, 17, 27, .98));
              box-shadow: 18px 18px 50px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.06);
              text-decoration: none;
              transform: translateY(-50%);
              backdrop-filter: blur(18px);
            }
            .academy-school-commercial-cta:hover,
            .academy-school-commercial-cta:focus-visible {
              border-color: rgba(98, 239, 178, .9);
              background: linear-gradient(180deg, rgba(8, 48, 53, .99), rgba(4, 26, 34, .99));
              outline: none;
            }
            .academy-school-commercial-cta-kicker,
            .academy-school-commercial-cta strong,
            .academy-school-commercial-cta-copy {
              writing-mode: vertical-rl;
              transform: rotate(180deg);
              text-align: center;
            }
            .academy-school-commercial-cta-kicker {
              color: #62efb2;
              font-size: .58rem;
              font-weight: 950;
              letter-spacing: .16em;
            }
            .academy-school-commercial-cta strong {
              color: #fff;
              font-size: .76rem;
              line-height: 1.2;
            }
            .academy-school-commercial-cta-copy {
              color: #9ebbc8;
              font-size: .57rem;
              line-height: 1.2;
            }
            .academy-school-commercial-cta-arrow {
              width: 30px;
              height: 30px;
              display: grid;
              place-items: center;
              border-radius: 50%;
              color: #03130d;
              background: #62efb2;
              font-weight: 950;
            }
            @media (max-width: 1180px) {
              .academy-school-commercial-cta { left: 248px; }
            }
            @media (max-width: 760px) {
              .academy-school-commercial-cta {
                left: 10px;
                top: auto;
                bottom: 86px;
                width: auto;
                min-height: 48px;
                flex-direction: row;
                gap: 9px;
                padding: 9px 12px;
                border-left: 1px solid rgba(98, 239, 178, .55);
                border-radius: 14px;
                transform: none;
              }
              .academy-school-commercial-cta-kicker,
              .academy-school-commercial-cta strong,
              .academy-school-commercial-cta-copy {
                writing-mode: horizontal-tb;
                transform: none;
              }
              .academy-school-commercial-cta-copy { display: none; }
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
