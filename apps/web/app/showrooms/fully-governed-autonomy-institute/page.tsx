import type { Metadata } from 'next';
import FGAIShowroom from './FGAIShowroom';

export const metadata: Metadata = {
  title: 'Fully Governed Autonomy Institute | TA-14 Exchange',
  description: 'The FGAI educational showroom: eight exhibits, Samantha narration, interactive governance challenges, and the founding charter. Justified Autonomy. Accountable Execution. Verifiable Consequences.',
  openGraph: {
    title: 'FGAI — The Architecture of Accountable Autonomy',
    description: 'Explore eight guided exhibits examining the proposed Level 5 of Fully Governed Autonomy.',
    images: ['/The%20Architecture%20of%20Accountable%20Autonomy.png']
  }
};

export default function Page() {
  return <FGAIShowroom />;
}
