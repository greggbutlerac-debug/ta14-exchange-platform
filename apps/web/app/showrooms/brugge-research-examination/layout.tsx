import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'From Air Pollution Research to Accountable Action | TA-14 Scientific Review Draft',
  description: 'Independent 12-exhibit educational examination of eleven publications and a separate proposed TA-14 evidence-to-action research framework. Under scientific review.',
  robots: { index: false, follow: false }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
