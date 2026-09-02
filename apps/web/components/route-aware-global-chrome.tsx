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
  const isOnumaMissionRecord =
    pathname === '/workspace/ai-governance/operational-mission-records/onuma-re1' ||
    pathname.startsWith('/workspace/ai-governance/operational-mission-records/onuma-re1/') ||
    pathname === '/public/ai-governance/operational-mission-records/onuma-re1' ||
    pathname.startsWith('/public/ai-governance/operational-mission-records/onuma-re1/');

  if (isTransparentAir || isPrivateEnvironmentalGateway || isPrivateGcea) return null;

  return (
    <>
      {!isOnumaMissionRecord && <AtlasEnvironmentalIntegrityFundStrip />}
      <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
        <Suspense fallback={null}>
          <SiteActivityCounter />
        </Suspense>
      </div>
    </>
  );
}
