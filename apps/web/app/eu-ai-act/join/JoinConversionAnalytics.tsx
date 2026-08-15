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
    event_category: 'eu_ai_act_checkout',
    ...params,
  });
}

export default function JoinConversionAnalytics() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan') || 'passport';
    const payment = params.get('payment') || '';

    send('eu_checkout_view', {
      path: window.location.pathname,
      plan,
      payment_state: payment || 'none',
    });

    if (payment === 'approved') {
      send('eu_paypal_return_approved', { plan });
    } else if (payment === 'cancelled') {
      send('eu_paypal_return_cancelled', { plan });
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (!button) return;

      const label = (button.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);

      if (label.includes('CONTINUE TO PAYPAL')) {
        send('eu_paypal_handoff_click', { plan, label });
      } else if (label.includes('GO TO SECURE PAYMENT')) {
        send('eu_checkout_boundary_complete', { plan });
      } else if (label === 'CONTINUE →' || label.includes('CONTINUE')) {
        send('eu_checkout_step_continue', { plan, label });
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
