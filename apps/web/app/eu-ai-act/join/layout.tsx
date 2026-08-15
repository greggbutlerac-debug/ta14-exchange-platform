import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import JoinConversionAnalytics from './JoinConversionAnalytics';

export const metadata: Metadata = {
  title: 'Start EU AI Act Governance Access',
  description:
    'Start a TA-14 EU AI Act governance workspace for system classification, evidence preservation, obligation mapping, change tracking, and revalidation.',
  alternates: {
    canonical: '/eu-ai-act/commercial',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function JoinLayout({ children }: { children: ReactNode }) {
  return <><JoinConversionAnalytics />{children}</>;
}
