import type { ReactNode } from 'react';
import Link from 'next/link';
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

      <section
        aria-label="Interoperability examinations pathway"
        style={{
          background: 'linear-gradient(180deg, #061522, #040a11)',
          color: '#eef9ff',
          padding: '34px 5vw',
          borderTop: '1px solid rgba(101,221,255,.16)',
          borderBottom: '1px solid rgba(101,221,255,.12)',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 1450,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(280px, .75fr)',
            gap: 28,
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                color: '#72dcff',
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
              }}
            >
              Separate governed pathway
            </div>
            <h2
              style={{
                margin: '8px 0 10px',
                fontSize: 'clamp(24px, 3vw, 40px)',
                lineHeight: 1.04,
                letterSpacing: '-.025em',
              }}
            >
              Founding Demonstrations test bounded claims. Interoperability Examinations test bounded relationships between independent architectures.
            </h2>
            <p
              style={{
                maxWidth: 980,
                margin: 0,
                color: '#a9c2d0',
                lineHeight: 1.7,
                fontSize: 14,
              }}
            >
              TA-14 now preserves these as distinct institutional record classes. The first controlled interoperability examination, TA-14 / ANDEKS™ IE-2026-001, reached SUPPORTED INTEROPERABILITY — DOCUMENTARY GOVERNANCE-INTERFACE ONLY while preserving separate sovereign authority, attribution, normative lineage, and architectural identity.
            </p>
          </div>

          <div
            style={{
              border: '1px solid rgba(101,221,255,.22)',
              borderRadius: 18,
              padding: 20,
              background: 'rgba(101,221,255,.045)',
            }}
          >
            <strong
              style={{
                display: 'block',
                color: '#7ff0c2',
                fontSize: 12,
                letterSpacing: '.1em',
              }}
            >
              TA-14-ANDEKS-IE-2026-001
            </strong>
            <span
              style={{
                display: 'block',
                marginTop: 8,
                color: '#d9edf6',
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              SUPPORTED INTEROPERABILITY
            </span>
            <span
              style={{
                display: 'block',
                marginTop: 3,
                color: '#9fb8c6',
                fontSize: 12,
              }}
            >
              DOCUMENTARY GOVERNANCE-INTERFACE ONLY
            </span>
            <Link
              href="/artifacts/interoperability-examinations"
              style={{
                display: 'inline-flex',
                marginTop: 17,
                padding: '11px 14px',
                borderRadius: 11,
                background: 'linear-gradient(135deg, #1687ae, #0c5d7d)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 850,
              }}
            >
              Explore Interoperability Examinations →
            </Link>
          </div>
        </div>
      </section>

      <FoundingMethodologyEntry />
      <ShangoPublicationBoundary />
    </>
  );
}
