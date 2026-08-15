import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'EU AI Act Compliance Software Pricing',
  description:
    'Compare TA-14 EU AI Act compliance workspace plans for AI system classification, evidence mapping, Article 50 transparency, high-risk readiness, change tracking, and revalidation.',
  alternates: {
    canonical: '/eu-ai-act/commercial',
  },
  keywords: [
    'EU AI Act compliance software',
    'EU AI Act compliance platform',
    'EU AI Act pricing',
    'AI compliance evidence platform',
    'EU AI Act governance software',
  ],
  openGraph: {
    title: 'EU AI Act Compliance Software Pricing | TA-14',
    description:
      'Maintain AI system identity, obligations, evidence, gaps, change, and revalidation in a governed EU AI Act operating workspace.',
    url: '/eu-ai-act/commercial',
    type: 'website',
  },
};

export default function CommercialLayout({ children }: { children: ReactNode }) {
  return children;
}
