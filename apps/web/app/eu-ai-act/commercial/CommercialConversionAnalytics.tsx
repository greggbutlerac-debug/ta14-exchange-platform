'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function send(eventName: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, {
    event_category: 'eu_ai_act_commercial',
    ...params,
  });
}

export default function CommercialConversionAnalytics() {
  useEffect(() => {
    send('eu_commercial_view', { path: window.location.pathname });

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      const text = (anchor.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);

      if (href.startsWith('/eu-ai-act/classifier')) {
        send('eu_free_classifier_click', { href, label: text });
        return;
      }

      if (href === '/workspace/request-review' || href.startsWith('/workspace/request-review?')) {
        send('eu_readiness_review_click', { href, label: text, value: 750, currency: 'USD' });
        return;
      }

      if (href.startsWith('/eu-ai-act/join')) {
        const url = new URL(href, window.location.origin);
        send('eu_plan_click', {
          href,
          label: text,
          plan: url.searchParams.get('plan') || 'unspecified',
        });
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
