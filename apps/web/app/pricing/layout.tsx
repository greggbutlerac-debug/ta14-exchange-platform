import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TA-14 Pricing | Admissible Execution & AI Governance Examinations',
  description: 'TA-14 pricing for bounded admissible execution examinations across AI agents, buildings, HVACD/R, data, finance and autonomous systems. Examine evidence, authority, standing and execution before consequence.',
  alternates: { canonical: '/pricing' },
  openGraph: { title: 'TA-14 Pricing & Engagement', description: 'Bounded admissible execution examinations starting at $149. Payment buys the examination, never a predetermined ALLOW determination.', url: '/pricing', type: 'website' },
};
export default function PricingLayout({ children }: { children: React.ReactNode }) { return children; }
