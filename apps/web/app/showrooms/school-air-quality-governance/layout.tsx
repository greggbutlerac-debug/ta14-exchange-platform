import type { Metadata } from 'next';

const path = '/showrooms/school-air-quality-governance';

export const metadata: Metadata = {
  title: 'School Air Quality Governance: Evidence to Authorized Action',
  description: 'Eight illustrated lessons tracing school indoor air observations through continuity, admissibility, local authority, approved HVAC intervention, and verified outcomes.',
  alternates: { canonical: path },
  openGraph: {
    type: 'article',
    url: path,
    title: 'School Air Quality Governance: Evidence to Authorized Action',
    description: 'Eight illustrated lessons tracing school indoor air observations through continuity, admissibility, local authority, approved HVAC intervention, and verified outcomes.',
  },
};

export default function ShowroomLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
