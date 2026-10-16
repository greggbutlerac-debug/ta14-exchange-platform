import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'From Laboratory Efficacy to Authorized Deployment | TA14 Technical Review',
  description: 'Unlisted independent technical examination for a bounded research-to-deployment discussion.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function LaboratoryReviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
