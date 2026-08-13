import type { ReactNode } from 'react';
import Link from 'next/link';
import GovernedDemonstrationLink from './governed-demonstration-link';

type RegistryRecordLayoutProps = {
  children: ReactNode;
  params: Promise<{ registryIdentifier: string }>;
};

export default async function RegistryRecordLayout({ children, params }: RegistryRecordLayoutProps) {
  const { registryIdentifier } = await params;
  const normalizedIdentifier = decodeURIComponent(registryIdentifier ?? '').trim().toUpperCase();

  return (
    <>
      {children}
      <section style={{ position: 'relative', zIndex: 20, width: 'min(1180px, calc(100% - 40px))', margin: '-58px auto 88px' }}>
        <div style={{ border: '1px solid rgba(218,174,85,.34)', borderRadius: 22, padding: '28px 30px', background: 'linear-gradient(125deg,rgba(31,24,10,.96),rgba(5,20,34,.97))', boxShadow: '0 24px 80px rgba(0,0,0,.28)', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 28, alignItems: 'center' }}>
          <div>
            <div style={{ color: '#d9ad55', fontSize: 10, fontWeight: 900, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 9 }}>Governance Life History</div>
            <h2 style={{ margin: 0, color: '#f1f6f9', fontSize: 'clamp(24px,3vw,38px)', letterSpacing: '-.035em' }}>This record is one state in a continuing institutional history.</h2>
            <p style={{ margin: '12px 0 0', maxWidth: 790, color: '#9fb5c5', lineHeight: 1.72, fontSize: 14 }}>Inspect the preserved chronology of versions, demonstrations, examinations, artifacts, findings, challenges, corrections, responses, and independent publications associated with this governance identity. Later events do not silently rewrite earlier states.</p>
          </div>
          <Link href={`/workspace/ai-governance/registry/history/${encodeURIComponent(normalizedIdentifier)}`} style={{ minHeight: 48, padding: '0 18px', border: '1px solid rgba(218,174,85,.72)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#d7ab52,#9e6e20)', color: '#06101c', textDecoration: 'none', fontSize: 12, fontWeight: 900, whiteSpace: 'nowrap' }}>Open Life History →</Link>
        </div>
      </section>
      {normalizedIdentifier === 'TA-14-AIGR-000011' ? (
        <div style={{ position: 'relative', zIndex: 20, width: 'min(1500px, 90vw)', margin: '-54px auto 88px' }}>
          <GovernedDemonstrationLink registryIdentifier={normalizedIdentifier} />
        </div>
      ) : null}
    </>
  );
}
