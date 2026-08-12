import type { ReactNode } from 'react';
import FoundingMethodologyEntry from './methodology-entry';
import ShangoPublicationBoundary from './shango-publication-boundary';

export default function FoundingDemonstrationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <FoundingMethodologyEntry />
      <ShangoPublicationBoundary />
    </>
  );
}
