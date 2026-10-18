'use client';

import type { ReactNode } from 'react';

type Props = { serviceId: string; serviceName: string; href: string; className?: string; children: ReactNode };

export function ProfessionalScopeLink({ serviceId, serviceName, href, className, children }: Props) {
  function recordIntent() {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') {
      gtag('event', 'professional_scope_email_click', { service_id: serviceId, service_name: serviceName, inquiry_channel: 'mailto' });
    }
  }
  return <a href={href} className={className} onClick={recordIntent}>{children}</a>;
}
