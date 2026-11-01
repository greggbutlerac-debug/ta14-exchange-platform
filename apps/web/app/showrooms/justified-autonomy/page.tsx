import type { Metadata } from 'next';
import JustifiedAutonomyShowroom from './JustifiedAutonomyShowroom';

export const metadata: Metadata = {
  title: 'Justified Autonomy | TA-14 Authority Teaching Showroom',
  description: 'Eight visual lessons, Samantha-guided narration, and an interactive execution-boundary challenge. Learn why autonomous capability needs admissible evidence, applicable authority, and established standing NOW.',
  openGraph: {
    title: 'Justified Autonomy — From Capability to Admissible Execution',
    description: 'A guided TA-14 Authority teaching showroom with eight lessons and a changed-reality ALLOW-to-HOLD examination.',
    images: ['/Justified%20Autonomy%20Framework%20at%20Dusk.png']
  }
};

export default function Page() {
  return <JustifiedAutonomyShowroom />;
}
