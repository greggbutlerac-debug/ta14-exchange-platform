import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Framework for Action → Real Consequence | TA-14',
  description: 'Interactive TA-14 examination of how the 2026 Global Framework for Action moves from global indoor-air strategy to evidence, authority, execution, outcome and revalidation.',
  alternates: { canonical: '/global-framework-for-action' },
  openGraph: {
    title: 'Global Framework for Action → Real Consequence | TA-14',
    description: 'Nine global levers meet one local execution boundary. Change evidence, authority, standing or conditions and watch the consequence change.',
    url: '/global-framework-for-action',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Framework for Action → Real Consequence | TA-14',
    description: 'Nine global levers meet one local execution boundary. Change evidence, authority, standing or conditions and watch the consequence change.',
  },
};

export default function GlobalFrameworkLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
