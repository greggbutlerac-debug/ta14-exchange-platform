'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function send(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, {
    event_category: 'transparent_air_local_seo',
    ...params,
  });
}

export default function TransparentAirCallAnalytics() {
  useEffect(() => {
    const landingPath = window.location.pathname;
    const query = new URLSearchParams(window.location.search);
    const source = query.get('utm_source') || document.referrer || 'direct';
    const medium = query.get('utm_medium') || 'organic_or_direct';
    const campaign = query.get('utm_campaign') || 'none';

    send('transparent_air_page_view', {
      landing_path: landingPath,
      traffic_source: source.slice(0, 120),
      traffic_medium: medium.slice(0, 80),
      campaign: campaign.slice(0, 120),
    });

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute('href') || '';
      if (!href.startsWith('tel:')) return;

      const label = (link.textContent || '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 120);

      send('transparent_air_phone_click', {
        landing_path: landingPath,
        phone_number: href.replace('tel:', '').slice(0, 32),
        link_label: label,
        traffic_source: source.slice(0, 120),
        traffic_medium: medium.slice(0, 80),
        campaign: campaign.slice(0, 120),
      });
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
