'use client';

/*
 * Interactive adversarial demonstration (SIMULATION DATA ONLY). It shows precomputed, deterministic
 * scenario results and verifies incident records in the browser with WebCrypto. It reads only this
 * showroom's own static evidence files and connects to no equipment or control endpoint.
 */
import { useState } from 'react';
import { verifyIncidentRecord, type IncidentRecord, type VerificationResult } from '@/lib/refrigeration-boundary/verify';
import { DriftChart, statusColor, type ChartPoint } from './DriftChart';

export type DemoScenario = {
  id: string; title: string; attempted: string; outcome: string; unproven: string[];
  bypass: Array<{ minute: number; label: string }>;
  submissions: Array<{ commandId: string; label: string; actorId: string; atMinute: number; determination: string; reasonCodes: string[]; executed: boolean; execution: { determination: string; reasonCodes: string[] } | null; replayId: string }>;
  transitions: Array<{ minute: number; to: string; findings: string[] }>;
  einAlerts: Array<{ minute: number; status: string }>;
  controllerAlarms: number[];
  response: Array<{ minute: number; step: string; detail: string }>;
  claims: Array<{ capability: string; status: string; basis: string }>;
  physical: { changed: boolean; maxTruthProductC: number; truthMinutesProductAboveLimit: number; endTruthProductC: number };
  eir: { entries: number; chainHead: string; valid: boolean; evidenceGaps: number };
  series: ChartPoint[];
};

const hhmm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const CLAIM_COLOR: Record<string, string> = { PASS: '#2f6f5e', FAIL: '#c0392b', NOT_DEMONSTRATED: '#8A9BA8' };
const card: React.CSSProperties = { padding: 16, border: '1px solid #316987', borderRadius: 14, background: '#031a2e' };
const btn: React.CSSProperties = { minHeight: 44, padding: '10px 14px', borderRadius: 10, border: '1px solid #7BAFD4', background: '#031a2e', color: '#C9E0EF', fontWeight: 800, cursor: 'pointer' };
const webSha256 = async (text: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))).map((b) => b.toString(16).padStart(2, '0')).join('');
const evidenceUrl = (id: string) => `/showrooms/refrigeration-consequence-boundary/evidence/${id}.json`;

export function AdversarialDemo({ scenarios, baseline }: { scenarios: DemoScenario[]; baseline: { band: [number, number]; productLimit: number; setpoint: number; defrost: string; sealSha256: string } }) {
  const [id, setId] = useState(scenarios[1].id);
  const [verification, setVerification] = useState<Record<string, VerificationResult | 'RUNNING' | string>>({});
  const [uploaded, setUploaded] = useState<{ name: string; result: VerificationResult | string } | null>(null);
  const s = scenarios.find((x) => x.id === id)!;

  async function verifyPublished() {
    setVerification((v) => ({ ...v, [id]: 'RUNNING' }));
    try {
      const data = await (await fetch(evidenceUrl(id), { cache: 'no-store' })).json();
      const result = await verifyIncidentRecord((data.incidentRecord ?? data) as IncidentRecord, webSha256);
      setVerification((v) => ({ ...v, [id]: result }));
    } catch (e) { setVerification((v) => ({ ...v, [id]: `Could not verify: ${(e as Error).message}` })); }
  }
  async function verifyFile(file: File) {
    try {
      const data = JSON.parse(await file.text());
      setUploaded({ name: file.name, result: await verifyIncidentRecord((data.incidentRecord ?? data) as IncidentRecord, webSha256) });
    } catch (e) { setUploaded({ name: file.name, result: `Not a readable incident record: ${(e as Error).message}` }); }
  }
  const v = verification[id];
  const timeline = [
    ...s.bypass.map((b) => ({ minute: b.minute, kind: 'BYPASS (ground truth)', text: b.label, color: '#E86A5B' })),
    ...s.submissions.map((x) => ({ minute: x.atMinute, kind: 'AEA', text: `${x.label}: ${x.determination}${x.execution ? ` → execution ${x.execution.determination}` : ''}`, color: x.executed ? '#2f6f5e' : '#E8B04B' })),
    ...s.einAlerts.map((a) => ({ minute: a.minute, kind: 'EIN ALERT', text: a.status, color: statusColor(a.status) })),
    ...s.controllerAlarms.map((m) => ({ minute: m, kind: 'CONTROLLER ALARM (self-report)', text: 'controller high-temperature alarm', color: '#8A9BA8' })),
    ...s.response.map((r) => ({ minute: r.minute, kind: r.step, text: r.detail, color: '#7BAFD4' })),
  ].sort((a, b) => a.minute - b.minute);

  return (
    <section id="demonstration" aria-label="Interactive adversarial demonstration" style={{ margin: '0 0 32px' }}>
      <small style={{ color: '#E8B04B', fontWeight: 900, letterSpacing: 1 }}>INTERACTIVE DEMONSTRATION · ALL DATA SIMULATED · NO EQUIPMENT CONNECTED</small>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 32px)', margin: '6px 0 14px' }}>Choose an attack scenario</h2>
      <div role="tablist" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {scenarios.map((x) => <button key={x.id} role="tab" aria-selected={x.id === id} onClick={() => setId(x.id)} style={{ ...btn, background: x.id === id ? '#7BAFD4' : '#031a2e', color: x.id === id ? '#001426' : '#C9E0EF' }}>{x.id}</button>)}
      </div>
      <h3 style={{ color: '#B9D9EB', margin: '0 0 6px' }}>{s.id} · {s.title}</h3>
      <p style={{ color: '#C9E0EF', lineHeight: 1.7, marginTop: 0 }}><b>Attempted:</b> {s.attempted}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        <div style={card}><b style={{ color: '#7BAFD4', fontSize: 12 }}>1 · AUTHORIZED OPERATING STATE</b><p style={{ color: '#C9E0EF', lineHeight: 1.7, marginBottom: 0 }}>Setpoint {baseline.setpoint} °C · air band {baseline.band.join(' to ')} °C · product ≤ {baseline.productLimit} °C · defrost {baseline.defrost}.<br /><span style={{ color: '#89A9BF', fontSize: 12, wordBreak: 'break-all' }}>Sealed baseline {baseline.sealSha256.slice(0, 24)}…</span></p></div>
        <div style={card}><b style={{ color: '#7BAFD4', fontSize: 12 }}>2 · PROPOSED OR BYPASSED COMMAND</b>
          {s.bypass.map((b) => <p key={b.label} style={{ color: '#E86A5B', margin: '8px 0' }}>{hhmm(b.minute)} BYPASS: {b.label}. Never reached AEA.</p>)}
          {s.submissions.filter((x) => !x.commandId.includes('RESTORE') && !x.commandId.includes('ROUTINE')).map((x) => <p key={x.commandId} style={{ color: '#C9E0EF', margin: '8px 0' }}>{hhmm(x.atMinute)} via AEA: {x.label} (actor {x.actorId})</p>)}
        </div>
        <div style={card}><b style={{ color: '#7BAFD4', fontSize: 12 }}>3 · AEA DETERMINATION</b>
          {s.submissions.length === 0 ? <p style={{ color: '#C9E0EF' }}>Not involved: the command bypassed the governed route, so there is no determination, and none is fabricated.</p> :
            s.submissions.map((x) => <p key={x.commandId} style={{ color: '#C9E0EF', margin: '8px 0', fontSize: 14 }}><b>{x.determination}</b>{x.execution ? ` → execution ${x.execution.determination}` : ''} · {x.commandId}<br /><span style={{ color: '#89A9BF', fontSize: 12 }}>{[...x.reasonCodes, ...(x.execution?.reasonCodes ?? [])].join(', ')} · {x.replayId}</span></p>)}
        </div>
      </div>

      <div style={{ ...card, marginTop: 12 }}>
        <b style={{ color: '#7BAFD4', fontSize: 12 }}>4 · INDEPENDENT OBSERVATIONS AND TEMPERATURE DRIFT</b>
        <div style={{ marginTop: 10 }}><DriftChart series={s.series} band={baseline.band} productLimit={baseline.productLimit} title={`${s.id} temperatures`} events={s.bypass.map((b) => ({ minute: b.minute, label: 'bypass' }))} /></div>
        <p style={{ color: '#C9E0EF', fontSize: 14 }}>EIN status changes: {s.transitions.length === 0 ? 'none (NORMAL throughout)' : s.transitions.map((t) => `${hhmm(t.minute)} ${t.to}`).join(' → ')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginTop: 12 }}>
        <div style={card}><b style={{ color: '#7BAFD4', fontSize: 12 }}>5 · ALERT, ESCALATION AND RESPONSE TIMELINE</b>
          {timeline.length === 0 ? <p style={{ color: '#C9E0EF' }}>No alerts.</p> : <ol style={{ color: '#C9E0EF', paddingLeft: 18, fontSize: 14, lineHeight: 1.6 }}>{timeline.map((t, i) => <li key={i}><span style={{ color: t.color, fontWeight: 800 }}>{hhmm(t.minute)} {t.kind}</span>: {t.text}</li>)}</ol>}
        </div>
        <div style={card}><b style={{ color: '#7BAFD4', fontSize: 12 }}>6 · EVIDENCE INTEGRITY</b>
          <p style={{ color: '#C9E0EF', fontSize: 14 }}>{s.eir.entries} hash-chained entries · {s.eir.evidenceGaps} evidence gaps · server verification {s.eir.valid ? 'VALID' : 'INVALID'}<br /><span style={{ color: '#89A9BF', fontSize: 12, wordBreak: 'break-all' }}>chain head {s.eir.chainHead}</span></p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={verifyPublished} style={btn}>VERIFY IN THIS BROWSER</button>
            <a href={evidenceUrl(s.id)} download={`TA-14-RCB-${s.id}-incident-record-SIMULATION.json`} style={{ ...btn, textDecoration: 'none' }}>⬇ DOWNLOAD RECORD</a>
          </div>
          {v && <p role="status" style={{ color: typeof v === 'string' ? '#E8B04B' : v.valid ? '#7fd1a9' : '#E86A5B', fontSize: 14 }}>{v === 'RUNNING' ? 'Verifying…' : typeof v === 'string' ? v : v.valid ? `VALID · ${v.entriesChecked} entries recomputed with WebCrypto` : `INVALID · ${v.failures.slice(0, 5).join(', ')}`}</p>}
          <label style={{ display: 'block', color: '#89A9BF', fontSize: 13, marginTop: 10 }}>Verify a record file (for example, an edited copy):<br /><input type="file" accept="application/json,.json" onChange={(e) => e.target.files?.[0] && verifyFile(e.target.files[0])} style={{ color: '#C9E0EF', marginTop: 6 }} /></label>
          {uploaded && <p role="status" style={{ color: typeof uploaded.result === 'string' ? '#E8B04B' : uploaded.result.valid ? '#7fd1a9' : '#E86A5B', fontSize: 14 }}>{uploaded.name}: {typeof uploaded.result === 'string' ? uploaded.result : uploaded.result.valid ? `VALID (${uploaded.result.entriesChecked} entries)` : `INVALID · ${uploaded.result.failures.slice(0, 5).join(', ')}`}</p>}
          <p style={{ color: '#89A9BF', fontSize: 12 }}>Integrity is not admissibility: a valid chain shows the record was not altered after export. It does not show the sensors were right.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginTop: 12 }}>
        <div style={card}><b style={{ color: '#7BAFD4', fontSize: 12 }}>7 · AUTHORIZED CORRECTIVE ACTION</b>
          {s.response.length === 0 ? <p style={{ color: '#C9E0EF' }}>None required.</p> : <ul style={{ color: '#C9E0EF', paddingLeft: 18, fontSize: 14, lineHeight: 1.6 }}>{s.response.filter((r) => /AUTHORITY|CORRECTIVE|ROUTINE|EMERGENCY/.test(r.step)).map((r, i) => <li key={i}>{hhmm(r.minute)} {r.step}: {r.detail}</li>)}</ul>}
        </div>
        <div style={card}><b style={{ color: '#7BAFD4', fontSize: 12 }}>8 · FINAL OUTCOME</b><p style={{ color: '#C9E0EF', lineHeight: 1.7, fontSize: 14 }}>{s.outcome}</p></div>
      </div>

      <div style={{ ...card, marginTop: 12 }}>
        <b style={{ color: '#7BAFD4', fontSize: 12 }}>CLAIMED CAPABILITIES · COMPUTED FROM THIS RUN</b>
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0' }}>{s.claims.map((c) => <li key={c.capability} style={{ margin: '8px 0', color: '#C9E0EF', fontSize: 14 }}><span style={{ display: 'inline-block', minWidth: 150, padding: '3px 8px', borderRadius: 6, background: CLAIM_COLOR[c.status], color: '#fff', fontWeight: 800, fontSize: 12 }}>{c.status.replace('_', ' ')}</span> <b>{c.capability}</b>: {c.basis}</li>)}</ul>
        <b style={{ color: '#E8B04B', fontSize: 12, display: 'block', marginTop: 12 }}>WHAT REMAINS UNPROVEN</b>
        <ul style={{ color: '#C9E0EF', fontSize: 14, lineHeight: 1.6, paddingLeft: 18 }}>{s.unproven.map((u) => <li key={u}>{u}</li>)}</ul>
      </div>
    </section>
  );
}
