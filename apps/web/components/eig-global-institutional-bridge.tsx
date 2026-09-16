'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function EIGGlobalInstitutionalBridge() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/environmental-integrity-governance') return;

    const actions = document.querySelector('.heroActions');
    if (!actions || actions.querySelector('[data-global-institutional-bridge]')) return;

    const link = document.createElement('a');
    link.href = '/global-institutional-engagement';
    link.className = 'button secondary';
    link.setAttribute('data-global-institutional-bridge', 'true');
    link.setAttribute('aria-label', 'Explore Global Institutional Engagement');
    link.innerHTML = 'Explore Global Institutional Engagement <span aria-hidden="true">↗</span>';
    actions.appendChild(link);
  }, [pathname]);

  return null;
}
