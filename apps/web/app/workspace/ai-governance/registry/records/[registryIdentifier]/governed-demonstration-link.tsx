'use client';

import Link from 'next/link';

type GovernedDemonstrationLinkProps = {
  registryIdentifier: string;
};

const SHANGO_REGISTRY_IDENTIFIER = 'TA-14-AIGR-000011';

export default function GovernedDemonstrationLink({
  registryIdentifier,
}: GovernedDemonstrationLinkProps) {
  if (registryIdentifier.trim().toUpperCase() !== SHANGO_REGISTRY_IDENTIFIER) {
    return null;
  }

  return (
    <section
      aria-labelledby="governed-demonstration-title"
      style={{
        marginTop: 24,
        padding: 24,
        borderRadius: 22,
        border: '1px solid rgba(244, 186, 84, .28)',
        background:
          'linear-gradient(135deg, rgba(244,186,84,.10), rgba(16,48,70,.72))',
        boxShadow: '0 24px 70px rgba(0,0,0,.18)',
      }}
    >
      <p
        style={{
          margin: 0,
          color: '#e8bc70',
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
        }}
      >
        Governed demonstration record
      </p>

      <h2
        id="governed-demonstration-title"
        style={{ margin: '10px 0 8px', fontSize: 28, lineHeight: 1.1 }}
      >
        FD-2026-0005 · Shango MID Founding Demonstration
      </h2>

      <p style={{ margin: 0, maxWidth: 900, lineHeight: 1.7, opacity: .78 }}>
        TA-14 completed a bounded founding demonstration against this registered
        governance identity. The governed finding is PARTIALLY SUPPORTED. The
        technical review is closed, the controlled correction is complete, and
        Registry-side administrative verification is complete. The public
        record preserves the finding boundary without publishing protected
        evidence files or private correspondence.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          marginTop: 18,
        }}
      >
        <span style={badgeStyle}>PARTIALLY SUPPORTED</span>
        <span style={badgeStyle}>CLOSED</span>
        <span style={badgeStyle}>SELECTIVE DISCLOSURE</span>
      </div>

      <div style={{ marginTop: 20 }}>
        <Link
          href="/artifacts/fd-2026-0005"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 16px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0d86bd, #185b82)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 850,
            textDecoration: 'none',
          }}
        >
          Open Governed Finding →
        </Link>
      </div>

      <p style={{ margin: '16px 0 0', fontSize: 12, lineHeight: 1.55, opacity: .58 }}>
        Registration is not certification or endorsement. The founding
        demonstration does not establish production readiness, universal
        Shango MID performance, legal validity, or regulatory approval.
      </p>
    </section>
  );
}

const badgeStyle = {
  display: 'inline-flex',
  padding: '7px 10px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,.15)',
  background: 'rgba(255,255,255,.05)',
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: '.09em',
} as const;
