import type { Metadata } from 'next';
import EclimaiPilotShowroom from './EclimaiPilotShowroom';
import './showroom.css';

export const metadata: Metadata = {
  title: 'EclimAi × TA-14 | Private Technical Pilot Review',
  description: 'Unapproved exploratory pilot concept. Hypothetical evidence, occupancy, governance, and verification examples. Not a deployed integration.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <EclimaiPilotShowroom />;
}
