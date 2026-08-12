import type { ReactNode } from 'react';

export default function ShangoArtifactLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <section
        aria-label="Shango publication authorization and scope"
        style={{
          position: 'relative',
          zIndex: 50,
          padding: '18px 5vw',
          borderBottom: '1px solid rgba(244,186,84,.24)',
          background:
            'linear-gradient(90deg, rgba(45,32,12,.96), rgba(5,25,39,.98), rgba(10,38,30,.96))',
          color: '#edf8ff',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ maxWidth: 1500, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <strong
              style={{
                fontSize: 11,
                letterSpacing: '.14em',
                color: '#ffd37b',
              }}
            >
              PUBLICATION AUTHORIZED
            </strong>
            <span style={badge}>FD-2026-0005</span>
            <span style={badge}>SELECTIVE DISCLOSURE</span>
            <span style={badge}>PARTIALLY SUPPORTED</span>
          </div>

          <p style={{ margin: 0, maxWidth: 1180, lineHeight: 1.65, opacity: .84 }}>
            Shango MID expressly authorized TA-14 to publish this governed finding
            and closure summary through the Exchange and to reference it in TA-14
            public communications. The authorization travels with the case scope:
            one frozen transaction-boundary claim, narrowed because the dependency
            surface was not submitted and TA-14 did not independently re-execute
            the submitted check.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 10,
              marginTop: 14,
            }}
          >
            <Boundary title="Participant-initiated narrowing">
              Shango volunteered the post-finding T3 narrowing. The public chronology
              preserves that the participant corrected its own description rather
              than presenting the change as a TA-14-imposed correction.
            </Boundary>
            <Boundary title="Version 2.2 boundary">
              Version 2.2 is a Registry version string. It is not a claim of a
              released product, deployment, customer, or delivered engagement.
            </Boundary>
            <Boundary title="Current implementation boundary">
              Shango MID is pre-revenue with no delivered engagements, and
              counter-signing is not running in the current build.
            </Boundary>
            <Boundary title="Preserved non-claims">
              This record is not certification, endorsement, production validation,
              legal approval, regulatory approval, or universal validation of Shango MID.
            </Boundary>
          </div>
        </div>
      </section>
      {children}
    </>
  );
}

function Boundary({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,.10)',
        background: 'rgba(255,255,255,.035)',
      }}
    >
      <strong
        style={{
          display: 'block',
          marginBottom: 5,
          fontSize: 11,
          letterSpacing: '.08em',
          color: '#aee9ff',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </strong>
      <span style={{ fontSize: 12, lineHeight: 1.55, opacity: .72 }}>{children}</span>
    </div>
  );
}

const badge = {
  display: 'inline-flex',
  padding: '5px 8px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,.13)',
  background: 'rgba(255,255,255,.045)',
  fontSize: 9,
  fontWeight: 900,
  letterSpacing: '.08em',
} as const;
