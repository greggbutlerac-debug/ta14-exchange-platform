import type { Metadata } from 'next';
import { BASELINE, SIMULATION_LABEL, sealBaseline } from '@/lib/refrigeration-boundary/baseline';
import { runAllScenarios } from '@/lib/refrigeration-boundary/scenarios';
import { AdversarialDemo, type DemoScenario } from './AdversarialDemo';
import { DriftChart } from './DriftChart';
import { LessonViewer } from './LessonViewer';
import { buildLessons } from './lessons';

// UNLISTED PREVIEW: not linked from the showroom index or the sitemap, and not indexed.
// Publication requires Greggory's approval.
export const metadata: Metadata = {
  title: 'When the Attacker Bypasses Governance · TA-14 (Simulation preview)',
  description: 'Refrigeration consequence boundary: a simulated adversarial demonstration of AEA prevention, independent detection and evidence preservation.',
  robots: { index: false, follow: false, nocache: true },
};

const PDF = '/showrooms/refrigeration-consequence-boundary/TA-14_Refrigeration_Consequence_Boundary_Technical_Examination_v1.pdf';
const STATUS_BG: Record<string, string> = { PASS: '#2f6f5e', FAIL: '#c0392b', NOT_DEMONSTRATED: '#5d6b75' };
const hhmm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default async function RefrigerationConsequenceBoundaryPage() {
  const results = await runAllScenarios();
  const lessons = buildLessons(results);
  const seal = sealBaseline().sealSha256;
  const r = (id: string) => results.find((x) => x.id === id)!;
  const demo: DemoScenario[] = results.map((x) => ({
    id: x.id, title: x.title, attempted: x.attempted, outcome: x.outcome, unproven: x.unproven,
    bypass: x.groundTruth.bypassActions,
    submissions: x.aea.submissions.map((s) => ({ commandId: s.commandId, label: s.label, actorId: s.actorId, atMinute: s.atMinute, determination: s.determination, reasonCodes: s.reasonCodes, executed: s.executed, execution: s.execution && { determination: s.execution.determination, reasonCodes: s.execution.reasonCodes }, replayId: s.gcea.replayId })),
    transitions: x.ein.transitions.map((t) => ({ minute: t.minute, to: t.to, findings: t.findings })),
    einAlerts: x.alerts.ein, controllerAlarms: x.alerts.controllerAlarm.map((a) => a.minute), response: x.response.steps, claims: x.claims,
    physical: { changed: x.physical.changed, maxTruthProductC: x.physical.maxTruthProductC, truthMinutesProductAboveLimit: x.physical.truthMinutesProductAboveLimit, endTruthProductC: x.physical.endTruthProductC },
    eir: { entries: x.eir.entries, chainHead: x.eir.chainHead, valid: x.eir.verification.valid, evidenceGaps: x.eir.evidenceGaps },
    series: x.series.map(({ minute, truthAirC, truthProductC, einAirC, einProductC, controllerReportedAirC, status }) => ({ minute, truthAirC, truthProductC, einAirC, einProductC, controllerReportedAirC, status })),
  }));
  const chart = (id: string, title: string) => <DriftChart series={demo.find((d) => d.id === id)!.series} band={BASELINE.approvedAirBandC} productLimit={BASELINE.productLimitC} title={title} events={r(id).groundTruth.bypassActions.map((b) => ({ minute: b.minute, label: 'bypass' }))} />;
  const capabilities = [...new Set(results.flatMap((x) => x.claims.map((c) => c.capability)))];
  const matrix = (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 12, color: '#C9E0EF', minWidth: 720 }}>
        <thead><tr><th style={{ textAlign: 'left', padding: 6 }}>Capability</th>{results.map((x) => <th key={x.id} style={{ padding: 6 }}>{x.id}</th>)}</tr></thead>
        <tbody>{capabilities.map((c) => <tr key={c}><td style={{ padding: 6, borderTop: '1px solid #285b78' }}>{c}</td>{results.map((x) => { const cl = x.claims.find((k) => k.capability === c); return <td key={x.id} style={{ padding: 4, borderTop: '1px solid #285b78', textAlign: 'center' }}>{cl ? <span title={cl.basis} style={{ display: 'inline-block', padding: '2px 6px', borderRadius: 5, background: STATUS_BG[cl.status], color: '#fff', fontWeight: 800 }}>{cl.status === 'NOT_DEMONSTRATED' ? 'N/D' : cl.status}</span> : <span style={{ color: '#4e6a7d' }}>·</span>}</td>; })}</tr>)}</tbody>
      </table>
    </div>
  );
  const latency = (
    <table style={{ borderCollapse: 'collapse', fontSize: 14, color: '#C9E0EF', width: '100%' }}>
      <thead><tr>{['Scenario', 'Change', 'First independent deviation', 'Latency'].map((h) => <th key={h} style={{ textAlign: 'left', padding: 6 }}>{h}</th>)}</tr></thead>
      <tbody>{['S2', 'S3', 'S4', 'S5', 'S6'].map((id) => { const x = r(id); return <tr key={id}><td style={{ padding: 6, borderTop: '1px solid #285b78' }}>{id}</td><td style={{ padding: 6, borderTop: '1px solid #285b78' }}>{x.groundTruth.bypassActions[0]?.label}</td><td style={{ padding: 6, borderTop: '1px solid #285b78' }}>{x.ein.firstDeviationMinute === null ? 'NOT DETECTED (evidence missing)' : hhmm(x.ein.firstDeviationMinute)}</td><td style={{ padding: 6, borderTop: '1px solid #285b78' }}>{x.ein.firstDeviationMinute === null ? '—' : `${x.ein.firstDeviationMinute - 180} min`}</td></tr>; })}</tbody>
    </table>
  );

  return (
    <main style={{ background: '#001426', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div role="note" style={{ background: '#E8B04B', color: '#001426', padding: '10px 16px', fontWeight: 900, fontSize: 13, textAlign: 'center' }}>{SIMULATION_LABEL} · UNLISTED PREVIEW · NOT FOR PUBLICATION UNTIL APPROVED</div>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 16px 64px' }}>
        <header style={{ marginBottom: 28 }}>
          <small style={{ color: '#7BAFD4', fontWeight: 900, letterSpacing: 2 }}>TA-14 EXCHANGE · REFRIGERATION CONSEQUENCE BOUNDARY · TECHNICAL EXAMINATION (PROPOSED, NOT VALIDATED)</small>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 6vw, 56px)', lineHeight: 1.05, margin: '12px 0' }}>WHEN THE ATTACKER BYPASSES GOVERNANCE</h1>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(18px, 3vw, 24px)', color: '#B9D9EB', margin: '0 0 16px' }}><em>The Ice Cream Is Melting. Who Authorized the Consequence?</em></p>
          <p style={{ color: '#C9E0EF', lineHeight: 1.8, maxWidth: 860 }}>An attacker may bypass the governance boundary without automatically escaping independent observation and evidence preservation. That is a conditional architectural capability, not a guarantee of detection. This showroom examines it in a deterministic simulation and reports what passed, what failed and what was not demonstrated.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
            <a href="#lessons" style={{ padding: '12px 16px', borderRadius: 10, background: '#7BAFD4', color: '#001426', fontWeight: 900, textDecoration: 'none' }}>Start the eight lessons</a>
            <a href="#demonstration" style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid #7BAFD4', color: '#C9E0EF', fontWeight: 800, textDecoration: 'none' }}>Open the interactive demonstration</a>
            <a href={PDF} style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid #7BAFD4', color: '#C9E0EF', fontWeight: 800, textDecoration: 'none' }}>⬇ Technical examination (PDF)</a>
          </div>
        </header>

        <LessonViewer lessons={lessons} figures={{ '04': chart('S4', 'S4 · falsified controller reporting'), '05': latency, '08': matrix }} />
        <AdversarialDemo scenarios={demo} baseline={{ band: BASELINE.approvedAirBandC, productLimit: BASELINE.productLimitC, setpoint: BASELINE.setpointC, defrost: `${BASELINE.defrost.startsAt.join(', ')} × ${BASELINE.defrost.durationMin} min`, sealSha256: seal }} />

        <section aria-label="Governing requirements and limitations" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
          <div style={{ padding: 18, border: '1px solid #316987', borderRadius: 14 }}>
            <b style={{ color: '#7BAFD4', fontSize: 12 }}>GOVERNING REQUIREMENTS</b>
            <ul style={{ color: '#C9E0EF', lineHeight: 1.8, paddingLeft: 18 }}>
              <li>No admissible evidence. No admissible execution.</li>
              <li>Commissioned once does not mean authorized forever.</li>
              <li>A bypassed authorization gate is not an authorized execution.</li>
              <li>A physical deviation is not automatically proof of malicious activity.</li>
              <li>An evidence record is not automatically admissible merely because it exists.</li>
            </ul>
          </div>
          <div style={{ padding: 18, border: '1px solid #E8B04B', borderRadius: 14 }}>
            <b style={{ color: '#E8B04B', fontSize: 12 }}>WHAT THIS DOES NOT SHOW</b>
            <ul style={{ color: '#C9E0EF', lineHeight: 1.8, paddingLeft: 18 }}>
              <li>Any physical refrigeration system: the thermal model is illustrative and unvalidated.</li>
              <li>Real controller protocols, networks or attacker capabilities.</li>
              <li>That independent sensors in a real site are actually independent of a compromised path.</li>
              <li>Food-safety decisions: thresholds are configured for the simulation.</li>
            </ul>
          </div>
        </section>

        <footer style={{ marginTop: 28, color: '#89A9BF', fontSize: 13, lineHeight: 1.8 }}>
          <p>This examination was prompted by a refrigeration cybersecurity challenge raised by Kimon Onuma. No person or organization named or referenced here has reviewed, participated in, or endorsed this demonstration or its conclusions.</p>
          <p>Evidence exports: {results.map((x) => <a key={x.id} href={`/showrooms/refrigeration-consequence-boundary/evidence/${x.id}.json`} style={{ color: '#B9D9EB', marginRight: 10 }}>{x.id}.json</a>)} · <a href="/showrooms/refrigeration-consequence-boundary/evidence/summary.json" style={{ color: '#B9D9EB' }}>summary.json</a></p>
          <p>The AEA decisions come from TA-14&apos;s production GCEA module, used unchanged. The EIN, EIR, actor checks, thermal model and attacker are simulation components. TA14 Authority Governance Institution · TA-14 Exchange.</p>
        </footer>
      </div>
    </main>
  );
}
