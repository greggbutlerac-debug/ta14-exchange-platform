import type { Metadata } from 'next';

const canonical = '/showrooms/municipal-air-quality-governance';

export const metadata: Metadata = {
  title: 'Municipal Air Quality Governance: Evidence to Authorized Action',
  description: 'Eight illustrated lessons showing how cities connect environmental evidence, local authority and standing, bounded infrastructure actions, and verified outcomes.',
  alternates: { canonical },
  openGraph: { type: 'article', url: canonical, title: 'Municipal Air Quality Governance: Evidence to Authorized Action', description: 'Eight illustrated lessons showing how cities connect environmental evidence, local authority and standing, bounded infrastructure actions, and verified outcomes.' },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
