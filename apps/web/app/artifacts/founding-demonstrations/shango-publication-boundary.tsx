'use client';

import Link from 'next/link';

export default function ShangoPublicationBoundary() {
  return (
    <aside
      style={{
        position: 'relative',
        zIndex: 5,
        width: 'min(1310px, 90vw)',
        margin: '0 auto 44px',
        padding: 24,
        borderRadius: 22,
        border: '1px solid rgba(105,239,176,.20)',
        background:
          'linear-gradient(135deg, rgba(15,54,40,.48), rgba(5,20,31,.94))',
        color: '#edf8ff',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <p
        style={{
          margin: 0,
          color: '#78eeb4',
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: '.15em',
        }}
      >
        SHANGO PUBLICATION AUTHORIZATION · RECORDED
      </p>
      <h2 style={{ margin: '10px 0 9px', fontSize: 28 }}>
        FD-2026-0005 may be publicly referenced with its evidence boundary intact.
      </h2>
      <p style={{ margin: 0, maxWidth: 1050, lineHeight: 1.7, opacity: .78 }}>
        Shango MID authorized publication of the governed finding and closure
        summary through the Exchange and TA-14 public communications. Any public
        reference must preserve that the finding concerns one frozen
        transaction-boundary claim; the dependency surface was not submitted;
        TA-14 did not independently re-execute the submitted check; and Shango
        itself volunteered the later T3 narrowing.
      </p>
      <p style={{ margin: '12px 0 0', maxWidth: 1050, lineHeight: 1.7, opacity: .68 }}>
        Version 2.2 is a Registry version string and should not be expanded into
        claims about deployment state or capabilities that were outside the
        admitted evidence. Counter-signing is not running in the current build.
        No certification, endorsement, or production validation is implied.
      </p>
      <Link
        href="/artifacts/fd-2026-0005"
        style={{
          display: 'inline-flex',
          marginTop: 17,
          padding: '11px 15px',
          borderRadius: 11,
          background: 'rgba(105,239,176,.11)',
          border: '1px solid rgba(105,239,176,.22)',
          fontSize: 12,
          fontWeight: 850,
          textDecoration: 'none',
          color: '#caffdf',
        }}
      >
        Open the full Shango governed record →
      </Link>
    </aside>
  );
}
