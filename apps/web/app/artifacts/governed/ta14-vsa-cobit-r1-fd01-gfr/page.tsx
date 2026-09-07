import Link from 'next/link';

export const metadata = {
  title: 'TA14-VSA-COBIT-R1-FD01-GFR | Governed Finding Record | TA-14',
  description: 'Governed Finding Record for the bounded VSA Azure MCP Execution Containment demonstration.',
};

export default function GovernedFindingRecord() {
  return (
    <main style={{ minHeight: '100vh', background: '#050b13', color: '#edf4ff', padding: '64px 20px', fontFamily: 'Inter,ui-sans-serif,system-ui,sans-serif' }}>
      <article style={{ maxWidth: 980, margin: '0 auto', border: '1px solid rgba(105,216,255,.18)', borderRadius: 22, padding: 'clamp(24px,5vw,54px)', background: 'linear-gradient(155deg,rgba(7,20,34,.98),rgba(4,9,18,.99))' }}>
        <p style={{ color: '#f4c95d', fontSize: 11, fontWeight: 900, letterSpacing: '.15em' }}>GOVERNED FINDING RECORD · FINAL INSTITUTIONAL SEAL</p>
        <h1 style={{ fontSize: 'clamp(34px,6vw,62px)', lineHeight: 1, letterSpacing: '-.04em', margin: '12px 0' }}>Azure MCP Execution Containment</h1>
        <p style={{ color: '#70dfff', fontWeight: 800 }}>TA14-VSA-COBIT-R1-FD01-GFR · Validation Standing Assurance (VSA) v1.0</p>

        <section style={{ marginTop: 34, padding: 22, border: '1px solid rgba(244,201,93,.28)', borderRadius: 14, background: 'rgba(244,201,93,.05)' }}>
          <small style={{ color: '#f4c95d', fontWeight: 900, letterSpacing: '.12em' }}>FINDING</small>
          <h2 style={{ margin: '8px 0 0' }}>SUPPORTED · BOUNDED PASS</h2>
        </section>

        <section style={{ marginTop: 34 }}>
          <h2>What the admitted evidence supports</h2>
          <p style={{ color: '#a8bac9', lineHeight: 1.75 }}>The frozen VSA challenge supported bounded read execution, negative restraint, and authenticated catalog-surface containment within the admitted evidence package. The supported result remains permanently paired with the unresolved catalog-correspondence condition.</p>
        </section>

        <section style={{ marginTop: 30, padding: 22, borderLeft: '4px solid #f4c95d', background: 'rgba(244,201,93,.05)' }}>
          <strong style={{ color: '#f4c95d' }}>EVIDENTIARY BOUNDARY</strong>
          <p style={{ color: '#b5c3cf', lineHeight: 1.75, marginBottom: 0 }}><b>catalog_correspondence_established: FALSE.</b> Independent live reproduction of the Azure MCP execution by TA-14 was not performed. Participant-produced evidence remains participant-produced evidence. This bounded PASS does not establish complete catalog correspondence and does not convert submitted execution evidence into independently reproduced execution evidence.</p>
        </section>

        <section style={{ marginTop: 30 }}>
          <h2>What TA-14 independently adjudicated</h2>
          <p style={{ color: '#a8bac9', lineHeight: 1.75 }}>TA-14's governed finding is limited to what the admitted evidence is supportable to establish under the frozen proposition and preserved evidentiary boundary. The participant does not acquire a broader claim merely because evidence was admitted or preserved. Any condition not established by the admitted record remains unestablished.</p>
        </section>

        <section style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
          {[
            ['Registry identity', 'TA-14-AIGR-000025'],
            ['Demonstration', 'TA14-VSA-COBIT-R1-FD01'],
            ['Record class', 'Governed Demonstration + Finding'],
            ['Verification posture', 'Final institutional seal'],
          ].map(([a, b]) => <div key={a} style={{ padding: 14, border: '1px solid rgba(105,216,255,.12)', borderRadius: 10 }}><small style={{ color: '#718a9c' }}>{a}</small><b style={{ display: 'block', marginTop: 5 }}>{b}</b></div>)}
        </section>

        <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 38 }}>
          <Link href="/artifacts/vsa-cobit-chain-r1" style={{ color: '#edf4ff', textDecoration: 'none', border: '1px solid rgba(105,216,255,.22)', borderRadius: 9, padding: '11px 14px' }}>Open governed demonstration →</Link>
          <Link href="/registry/TA-14-AIGR-000025" style={{ color: '#edf4ff', textDecoration: 'none', border: '1px solid rgba(105,216,255,.22)', borderRadius: 9, padding: '11px 14px' }}>Open Registry record →</Link>
          <Link href="/artifacts" style={{ color: '#edf4ff', textDecoration: 'none', border: '1px solid rgba(105,216,255,.22)', borderRadius: 9, padding: '11px 14px' }}>Artifact library →</Link>
        </nav>
      </article>
    </main>
  );
}
