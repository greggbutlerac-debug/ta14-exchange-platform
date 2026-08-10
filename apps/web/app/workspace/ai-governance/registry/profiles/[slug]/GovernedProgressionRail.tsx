import Link from 'next/link';

type Props = {
  registryIdentifier: string;
  eventCount: number;
  currentVersion: string | null;
};

export default function GovernedProgressionRail({
  registryIdentifier,
  eventCount,
  currentVersion,
}: Props) {
  if (eventCount < 1) return null;

  return (
    <section
      aria-label="Governed progression"
      style={{
        width: 'min(1220px, calc(100% - 40px))',
        margin: '0 auto',
        padding: '26px 0 0',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: 24,
          alignItems: 'center',
          padding: '24px 26px',
          border: '1px solid rgba(213, 167, 75, 0.30)',
          borderRadius: 20,
          background:
            'linear-gradient(135deg, rgba(31, 24, 10, 0.72), rgba(6, 23, 39, 0.92))',
          boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
        }}
      >
        <div>
          <div
            style={{
              color: '#d7aa51',
              fontSize: 10,
              fontWeight: 850,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Governed Progression Record
          </div>

          <div
            style={{
              color: '#f2f6f9',
              fontSize: 'clamp(21px, 3vw, 30px)',
              fontWeight: 820,
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
            }}
          >
            {eventCount} preserved {eventCount === 1 ? 'event' : 'events'} beneath one permanent governance identity.
          </div>

          <p
            style={{
              margin: '9px 0 0',
              color: '#9fb4c6',
              fontSize: 14,
              lineHeight: 1.65,
            }}
          >
            Registration, versions, artifacts, findings, challenges, responses, and later evidence remain chronological rather than replacing earlier states.
            {currentVersion ? ` Current architecture version: ${currentVersion}.` : ''}
          </p>
        </div>

        <Link
          href={`/workspace/ai-governance/registry/history/${registryIdentifier}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 48,
            padding: '0 18px',
            borderRadius: 12,
            border: '1px solid rgba(218, 174, 85, 0.82)',
            background: 'linear-gradient(135deg, #d7ab52, #9e6e20)',
            color: '#06101c',
            textDecoration: 'none',
            fontWeight: 850,
            fontSize: 13,
            whiteSpace: 'nowrap',
          }}
        >
          View Governed Progression →
        </Link>
      </div>
    </section>
  );
}
