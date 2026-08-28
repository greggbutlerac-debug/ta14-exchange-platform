import { buildPrivateGceaDemonstration } from '@/lib/governance-continuity-execution-authority';
import R1ExecutionControl from './r1-execution-control';

export const dynamic = 'force-dynamic';

const cell = { padding: 12, border: '1px solid #d8dde3', verticalAlign: 'top' as const };
const head = { ...cell, textAlign: 'left' as const, background: '#17212b', color: '#fff' };

export default function GovernanceContinuityExecutionAuthorityPage() {
  const run = buildPrivateGceaDemonstration(new Date());
  const stages = [
    ['Baseline', run.baseline.determination, run.baseline.standing, run.baseline.bindingScope ?? 'NONE', run.baseline.reasonCodes.join(' · ')],
    ['Material change', run.challenged.determination, run.challenged.standing, run.challenged.bindingScope ?? 'NONE', run.challenged.reasonCodes.join(' · ')],
    ['Reauthorized', run.restored.determination, run.restored.standing, run.restored.bindingScope ?? 'NONE', run.restored.reasonCodes.join(' · ')],
  ];
  return <main style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px 80px', fontFamily: 'Arial,sans-serif', color: '#17212b' }}>
    <div style={{ fontSize: 12, letterSpacing: 2, fontWeight: 700 }}>TA-14 AUTHORITY · PRIVATE OWNER CONSOLE</div>
    <h1 style={{ fontSize: 40, marginBottom: 4 }}>Governance Continuity & Execution Authority Engine</h1>
    <p style={{ fontSize: 19, color: '#59636e' }}>Independent TA-14 architecture · R1 private build</p>
    <div style={{ marginTop: 22, border: '1px solid #9d7c35', padding: 18, background: '#fffdf7' }}><b>PRIVATE / NOT PUBLIC.</b> Independently developed TA-14 capability. No OrchestrAI code, branding, confidential material, schema, or claimed interoperability. No public navigation or Registry publication.</div>

    <R1ExecutionControl />

    <section style={{ marginTop: 34 }}><h2>Execution-authority boundary</h2><p><b>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</b></p><p>A prior approval does not automatically survive a material change. Binding scope exists only while evidence continuity, admissibility, authority scope, and present standing all hold.</p></section>

    <section style={{ marginTop: 34 }}><h2>R1 demonstration</h2><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th style={head}>Stage</th><th style={head}>Determination</th><th style={head}>Standing</th><th style={head}>Binding</th><th style={head}>Reason</th></tr></thead><tbody>{stages.map((row) => <tr key={row[0]}>{row.map((value, i) => <td key={i} style={cell}><b>{i === 1 ? value : ''}</b>{i !== 1 ? value : ''}</td>)}</tr>)}</tbody></table></section>

    <section style={{ marginTop: 34 }}><h2>Material-change challenge</h2><p>Frozen asset: <b>{run.asset.assetId}</b> · version <b>{run.asset.version}</b> · route <b>{run.asset.routeId}</b></p><p>Change: <b>{run.change.changeId}</b> · {run.change.category} · material = <b>{String(run.change.material)}</b></p><p>Prior authority remains historically preserved, but its present binding scope collapses to <b>NONE</b> while the material change requires reauthorization.</p></section>

    <section style={{ marginTop: 34 }}><h2>Cryptographic replay identities</h2><table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody><tr><th style={head}>Baseline</th><td style={cell}>{run.baseline.receipt.replayId}<br/><small>{run.baseline.receipt.hash}</small></td></tr><tr><th style={head}>Challenged</th><td style={cell}>{run.challenged.receipt.replayId}<br/><small>{run.challenged.receipt.hash}</small></td></tr><tr><th style={head}>Restored</th><td style={cell}>{run.restored.receipt.replayId}<br/><small>{run.restored.receipt.hash}</small></td></tr></tbody></table></section>

    <section style={{ marginTop: 34 }}><h2>R1 build status</h2><p><b>Implemented:</b> independent governed asset identity, scoped authority object, evidence standing, material-change challenge, fail-closed determination, binding-scope collapse, reauthorization demonstration, SHA-256 canonical receipt and replay identity, owner-only console, append-only production chronology, and deterministic persisted replay verification.</p><p><b>Intentionally absent:</b> OrchestrAI integration, copied OMG UI or terminology, customer data, public navigation, Registry publication, external execution adapter, or automatic equipment/system action.</p><p><b>Current gate:</b> execute and preserve the first authenticated owner R1 run above. A PASS is established only after the production ledger is read back and replay verification succeeds.</p></section>
  </main>;
}
