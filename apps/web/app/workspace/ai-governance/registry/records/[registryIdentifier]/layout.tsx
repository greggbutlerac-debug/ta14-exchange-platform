import type { ReactNode } from 'react';
import GovernedDemonstrationLink from './governed-demonstration-link';

type RegistryRecordLayoutProps = {
  children: ReactNode;
  params: Promise<{ registryIdentifier: string }>;
};

export default async function RegistryRecordLayout({
  children,
  params,
}: RegistryRecordLayoutProps) {
  const { registryIdentifier } = await params;
  const normalizedIdentifier = decodeURIComponent(registryIdentifier ?? '')
    .trim()
    .toUpperCase();

  return (
    <>
      {children}
      {normalizedIdentifier === 'TA-14-AIGR-000011' ? (
        <div
          style={{
            position: 'relative',
            zIndex: 20,
            width: 'min(1500px, 90vw)',
            margin: '-72px auto 88px',
          }}
        >
          <GovernedDemonstrationLink
            registryIdentifier={normalizedIdentifier}
          />
        </div>
      ) : null}
    </>
  );
}
