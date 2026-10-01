import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Governed Consequence Examination — $149',
  description:
    'Submit one proposed consequence with its evidence, authority and standing, pay $149 online, and receive a preserved ALLOW, HOLD, DENY or ESCALATE examination record. Payment buys the examination, never a favorable result.',
  alternates: { canonical: '/consequence-machine' },
  openGraph: {
    title: 'Governed Consequence Examination — $149 | TA-14',
    description: 'One bounded consequence examination, self-serve and paid online.',
    url: '/consequence-machine',
    type: 'website',
  },
};

export default function ConsequenceMachineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
