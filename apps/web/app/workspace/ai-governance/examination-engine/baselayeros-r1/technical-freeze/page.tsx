import Link from "next/link";
import { baseLayerTechnicalFreezeRecord as freeze } from "@/lib/governance/technical-freeze-record";

export const metadata = { title: "BaseLayerOS R1 Technical Freeze | TA-14 Exchange" };
const panel: React.CSSProperties = { border: "1px solid rgba(148,163,184,.25)", borderRadius: 18, padding: 22, background: "rgba(15,23,42,.58)" };

export default function TechnicalFreezePage() {
  const satisfied = freeze.gates.filter(g => g.state === "SATISFIED").length;
  return <main style={{ maxWidth: 1120, margin: "0 auto", padding: "44px 24px 80px", color: "#e5e7eb" }}>
    <p style={{ color: "#94a3b8", letterSpacing: ".14em", fontSize: 12 }}>TA-14 TECHNICAL FREEZE CONTROL</p>
    <h1 style={{ fontSize: "clamp(2rem,5vw,4rem)", lineHeight: 1.04 }}>BaseLayerOS / TA-14 R1 Technical Freeze</h1>
    <p><strong>{freeze.recordId}</strong></p><p style={{ color: "#fbbf24", fontWeight: 900 }}>{freeze.status}</p>
    <section style={{ ...panel, margin: "28px 0" }}><h2>Freeze rule</h2><p style={{ lineHeight: 1.7 }}>{freeze.rule}</p><p><strong>Current readiness:</strong> {satisfied}/{freeze.gates.length} required gates satisfied.</p><p style={{ color: "#fca5a5", fontWeight: 800 }}>EXAMINATION EXECUTION: LOCKED</p></section>
    <section style={{ margin: "34px 0" }}><h2>Freeze gates</h2><div style={{ display: "grid", gap: 12 }}>{freeze.gates.map(g => <article key={g.id} style={panel}><small style={{ color: "#94a3b8" }}>{g.id}</small><h3>{g.title}</h3><p>{g.requiredObject}</p><p style={{ color: g.state === "SATISFIED" ? "#86efac" : "#fca5a5", fontWeight: 800 }}>{g.state}</p></article>)}</div></section>
    <section style={{ ...panel, margin: "34px 0" }}><h2>Cryptographic issuance requirements</h2><ol>{freeze.issuanceRequirements.map(v => <li key={v} style={{ margin: "10px 0" }}>{v}</li>)}</ol><p><strong>{freeze.executableRule}</strong></p></section>
    <section style={{ ...panel, marginTop: 34 }}><h2>Historical integrity</h2><p>A Technical Freeze is issued as a new immutable evidence object. It does not overwrite intake, participant factual review, or the pre-freeze proposal. Later corrections, replays, successor versions, and findings accumulate against the frozen chronology.</p><p><strong>No hash. No freeze. No freeze. No examination.</strong></p><Link href="/workspace/ai-governance/examination-engine/baselayeros-r1">← Participant Review</Link></section>
  </main>;
}
