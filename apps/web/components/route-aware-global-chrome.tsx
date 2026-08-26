"use client";

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';

import { SiteActivityCounter } from './site-activity-counter';
import { AtlasEnvironmentalIntegrityFundStrip } from './atlas-environmental-integrity-fund-strip';

export function RouteAwareGlobalChrome() {
  const pathname = usePathname();
  const isTransparentAir = pathname === '/transparent-air' || pathname.startsWith('/transparent-air/');

  if (isTransparentAir) return null;

  return (
    <>
      <AtlasEnvironmentalIntegrityFundStrip />
      <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
        <Suspense fallback={null}>
          <SiteActivityCounter />
        </Suspense>
      </div>
    </>
  );
}
