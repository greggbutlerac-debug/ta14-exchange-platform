import type { ReactNode } from 'react';
import FlagshipShowcaseBanner from './FlagshipShowcaseBanner';

export default function AdmissibleExecutionArchitectureLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <FlagshipShowcaseBanner />
      {children}
    </>
  );
}
