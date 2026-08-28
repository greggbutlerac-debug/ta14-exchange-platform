import { buildPrivateGceaDemonstration } from '@/lib/governance-continuity-execution-authority';
import R1ExecutionControl from './r1-execution-control';
import LifecycleVerificationControl from './lifecycle-verification-control';

export const dynamic = 'force-dynamic';

const card = { border: '1px solid #dbe2e8', borderRadius: 14, background: '#fff', padding: 24, boxShadow: '0 10px 28px rgba(23,33,43,.06)' };
const cell = { padding: '13px 14px', borderBottom: '1px solid #e7ebef', verticalAlign: 'top' as const };
const head = { ...cell, textAlign: 'left' as const, background: '#17212b', color: '#fff', fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase' as const };

export default function GovernanceContinuityExecutionAuthorityPage() {
  const run = buildPrivateGceaDemonstration(new Date());
  const stages = [
    ['Baseline', run.baseline.determination, run.baseline.standing, run.baseline.bindingScope ?? 'NONE', 'Present standing established'],
    ['Material change', run.challenged.determination, run.challenged.standing, run.challenged.bindingScope ?? 'NONE', 'Material change requires reauthorization'],
    ['Execution attempt', run.deniedAttempt.determination, run.challenged.standing, 'NONE', 'Execution boundary refused'],
    ['Reauthorized', run.restored.determination, run.restored.standing, run.restored.bindingScope ?? 'NONE', 'Present standing re-established'],
  ];

  return <main style={{ minHeight: '100vh', background: '#f4f6f8', color: '#17212b', fontFamily: 'Arial,sans-serif' }}>
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '52px 24px 90px' }}>
      <header style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-block', padding: '7px 10px', borderRadius: 999, background: '#17212b', color: '#fff', fontSize: 11, letterSpacing: 1.7, fontWeight: 700 }}>TA-14 AUTHORITY · OWNER ONLY</div>
        <h1 style={{ fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.05, margin: '18px 0 8px', letterSpacing: '-.035em' }}>Governance Continuity &<br/>Execution Authority Engine</h1>
        <p style={{ fontSize: 19, color: '#5c6772', maxWidth: 800, lineHeight: 1.55 }}>Private GCEA control surface for present standing, material-change challenge, execution-boundary refusal, reauthorization, preservation, semantic replay, and complete lifecycle verification.</p>
      </header>

      <div style={{ ...card, borderColor: '#d6b35b', background: '#fffdf6', marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: '#765a12' }}>PRIVATE DEVELOPMENT BOUNDARY</div>
        <p style={{ marginBottom: 0, lineHeight: 1.6 }}>Independent TA-14 capability. No OrchestrAI code, branding, confidential material, schema, claimed interoperability, public navigation, or Registry publication.</p>
      </div>

      <R1ExecutionControl />
      <div style={{ marginTop: 22 }}><LifecycleVerificationControl /></div>

      <section style={{ ...card, marginTop: 22, borderColor: '#9cc5a1', background: '#f7fff8' }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.3, color: '#35633b' }}>R2 PRODUCTION EVIDENCE · PASS</div>
        <h2 style={{ margin: '8px 0 12px', fontSize: 25 }}>Semantic replay and execution-boundary refusal established</h2>
        <p style={{ lineHeight: 1.65 }}>Production run <b>TA14-GCEA-R2-20260828122853</b> preserved five append-only events. Persisted semantic replay reproduced all five authority states, and the challenged execution attempt was <b>DENY · permitted = false</b>.</p>
        <p style={{ lineHeight: 1.65, marginBottom: 0, color: '#52606c' }}>Terminal event hash: <span style={{ fontFamily: 'monospace', overflowWrap: 'anywhere' }}>8a7ceb2f5c53ed97ae9fe910c4509d50d18311ea83621e9b66ffd706db3497c8</span></p>
      </section>

      <section style={{ ...card, marginTop: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.3, color: '#66717c' }}>GOVERNING CHAIN</div>
        <h2 style={{ margin: '8px 0 14px', fontSize: 25 }}>Execution-authority boundary</h2>
        <div style={{ padding: '17px 18px', background: '#17212b', color: '#fff', borderRadius: 10, fontWeight: 700, lineHeight: 1.7 }}>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</div>
        <p style={{ lineHeight: 1.65, color: '#52606c' }}>A prior approval does not automatically survive a material change. Binding exists only while evidence continuity, admissibility, authority scope, and present standing all remain valid.</p>
      </section>

      <section style={{ ...card, marginTop: 22, overflowX: 'auto' }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.3, color: '#66717c' }}>R2 STATE TRANSITION</div>
        <h2 style={{ margin: '8px 0 18px', fontSize: 25 }}>Standing challenge, refusal, and restoration</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}><thead><tr><th style={head}>Stage</th><th style={head}>Determination</th><th style={head}>Standing</th><th style={head}>Binding</th><th style={head}>Reason</th></tr></thead><tbody>{stages.map((row) => <tr key={row[0]}>{row.map((value, i) => <td key={i} style={cell}>{i === 1 ? <b>{value}</b> : value}</td>)}</tr>)}</tbody></table>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22, marginTop: 22 }}>
        <section style={card}><div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.3, color: '#66717c' }}>FROZEN R1 OBJECT</div><h2 style={{ fontSize: 22 }}>Material-change challenge</h2><p style={{ lineHeight: 1.65 }}><b>{run.asset.assetId}</b><br/>Version {run.asset.version}<br/>Route {run.asset.routeId}</p><p style={{ lineHeight: 1.65, color: '#52606c' }}>Change <b>{run.change.changeId}</b> · {run.change.category} · material = <b>{String(run.change.material)}</b>. Historical authority is preserved while present binding collapses to <b>NONE</b> pending reauthorization.</p></section>
        <section style={card}><div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.3, color: '#66717c' }}>CURRENT CONTROL STATUS</div><h2 style={{ fontSize: 22 }}>R1 and R2 evidence established</h2><p style={{ lineHeight: 1.65 }}>R1 established authenticated production preservation, append-only chronology, and persisted replay. R2 established preserved authority inputs, semantic replay, and explicit execution-boundary refusal during challenged standing.</p><p style={{ lineHeight: 1.65, color: '#52606c' }}>Complete lifecycle verification is a separate post-R2 control. Until its result is durably preserved, it does not alter the historical R1 or R2 evidence claims.</p></section>
      </div>

      <section style={{ ...card, marginTop: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.3, color: '#66717c' }}>DETERMINISTIC IDENTITIES</div>
        <h2 style={{ margin: '8px 0 16px', fontSize: 25 }}>Current demonstration receipts</h2>
        {[['Baseline', run.baseline.receipt], ['Challenged', run.challenged.receipt], ['Restored', run.restored.receipt]].map(([label, receipt]) => <div key={String(label)} style={{ padding: '13px 0', borderTop: '1px solid #e7ebef' }}><b>{String(label)}</b><div style={{ marginTop: 5, fontFamily: 'monospace', fontSize: 12, overflowWrap: 'anywhere', color: '#52606c' }}>{typeof receipt === 'object' && receipt ? `${receipt.replayId}\n${receipt.hash}` : ''}</div></div>)}
      </section>

      <section style={{ ...card, marginTop: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.3, color: '#66717c' }}>BUILD BOUNDARY</div>
        <h2 style={{ margin: '8px 0 12px', fontSize: 25 }}>What R1 + R2 prove — and what they do not</h2>
        <p style={{ lineHeight: 1.65 }}><b>Established:</b> governed asset identity, scoped authority, evidence standing, material-change challenge, fail-closed standing determination, binding-scope collapse, challenged execution refusal, reauthorization, SHA-256 receipt identity, owner authentication, append-only production chronology, preserved authority inputs, and persisted semantic replay verification.</p>
        <p style={{ lineHeight: 1.65, marginBottom: 0 }}><b>Not claimed:</b> OrchestrAI integration, OMG compatibility, customer deployment, Registry standing, external third-party execution control, regulatory certification, or automatic control of systems outside this bounded GCEA production demonstration.</p>
      </section>
    </div>
  </main>;
}
