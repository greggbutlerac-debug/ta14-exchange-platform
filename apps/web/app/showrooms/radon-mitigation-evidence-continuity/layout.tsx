import type { Metadata } from 'next';

const canonical = '/showrooms/radon-mitigation-evidence-continuity';

export const metadata: Metadata = {
  title: 'Radon Mitigation: Evidence Continuity and Verified Outcomes',
  description: 'An eight-lesson technical examination of radon measurements, admissibility, qualified intervention, post-mitigation verification, and changing building conditions.',
  alternates: { canonical },
  openGraph: { type: 'article', url: canonical, title: 'Radon Mitigation: Evidence Continuity and Verified Outcomes', description: 'An eight-lesson technical examination of radon measurements, admissibility, qualified intervention, post-mitigation verification, and changing building conditions.' },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
