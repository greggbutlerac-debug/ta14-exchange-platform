import Link from 'next/link';

type Props = {
  registryIdentifier: string;
  eventCount: number;
  currentVersion: string | null;
};

export default function GovernedProgressionDock({
  registryIdentifier,
  eventCount,
  currentVersion,
}: Props) {
  if (eventCount < 1) return null;

  return (
    <aside
      aria-label="Governed progression record"
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 60,
        width: 'min(390px, calc(100vw - 40px))',
        border: '1px solid rgba(213, 167, 75, 0.42)',
        borderRadius: 18,
        background: 'linear-gradient(145deg, rgba(28,22,10,.97), rgba(4,17,30,.98))',
        boxShadow: '0 24px 80px rgba(0,0,0,.48)',
        padding: 18,
        backdropFilter: 'blur(16px)',
      }}
    >
      <div
        style={{
          color: '#d7aa51',
          fontSize: 9,
          fontWeight: 850,
          letterSpacing: '.15em',
          textTransform: 'uppercase',
        }}
      >
        Governed Progression
      </div>

      <div
        style={{
          marginTop: 7,
          color: '#f2f6f9',
          fontSize: 17,
          fontWeight: 820,
          lineHeight: 1.3,
        }}
      >
        {eventCount} preserved {eventCount === 1 ? 'event' : 'events'} beneath this permanent governance identity.
      </div>

      <div
        style={{
          marginTop: 6,
          color: '#8fa8bc',
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        {registryIdentifier}{currentVersion ? ` · Current version ${currentVersion}` : ''}
      </div>

      <Link
        href={`/workspace/ai-governance/registry/history/${registryIdentifier}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 13,
          minHeight: 42,
          borderRadius: 11,
          border: '1px solid rgba(218,174,85,.82)',
          background: 'linear-gradient(135deg,#d7ab52,#9e6e20)',
          color: '#06101c',
          textDecoration: 'none',
          fontSize: 12,
          fontWeight: 850,
          letterSpacing: '.02em',
        }}
      >
        View Governed Progression →
      </Link>
    </aside>
  );
}
