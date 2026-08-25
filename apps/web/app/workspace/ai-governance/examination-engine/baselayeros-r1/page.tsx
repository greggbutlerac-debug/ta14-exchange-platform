import Link from "next/link";
import { baselayerCommonExamination as x } from "@/lib/governance/baselayeros-common-examination";

export const metadata = { title: `${x.title} | TA-14 Exchange` };

const panel: React.CSSProperties = { border: "1px solid rgba(148,163,184,.25)", borderRadius: 18, padding: 24, background: "rgba(15,23,42,.58)" };

export default function BaseLayerR1Page() {
  return <main style={{ maxWidth: 1120, margin: "0 auto", padding: "44px 24px 80px", color: "#e5e7eb" }}>
    <p style={{ color: "#94a3b8", letterSpacing: ".14em", fontSize: 12 }}>COMMON EXAMINATION INSTRUMENT · PRE-FREEZE</p>
    <h1 style={{ fontSize: "clamp(2rem,5vw,4rem)", lineHeight: 1.04 }}>{x.title}</h1>
    <p><strong>{x.instrumentId}</strong> · {x.version}</p>
    <p style={{ color: "#fbbf24", fontWeight: 800 }}>{x.status}</p>
    <section style={{ ...panel, margin: "28px 0" }}><h2>Common proposition</h2><p style={{ lineHeight: 1.75, fontSize: 18 }}>{x.commonProposition}</p></section>
    <section style={{ ...panel, margin: "28px 0" }}><h2>Institutional boundary</h2><p>{x.purpose}</p><ul>{x.nonClaims.map(v => <li key={v} style={{ margin: "8px 0" }}>{v}</li>)}</ul></section>
    <section style={{ margin: "34px 0" }}><h2>Freeze requirements</h2><div style={{ ...panel }}><ol>{x.freezeRequirements.map(v => <li key={v} style={{ margin: "9px 0" }}>{v}</li>)}</ol></div></section>
    <section style={{ margin: "34px 0" }}><h2>Frozen scenario grammar</h2><div style={{ display: "grid", gap: 12 }}>{Object.entries(x.scenario).map(([k,v]) => <article key={k} style={panel}><strong>{k.toUpperCase()}</strong><p>{v}</p></article>)}</div></section>
    <section style={{ margin: "34px 0" }}><h2>Acceptance criteria</h2><div style={{ display: "grid", gap: 12 }}>{x.acceptanceCriteria.map(a => <article key={a.id} style={panel}><small style={{ color: "#94a3b8" }}>{a.id}</small><h3>{a.label}</h3><p>{a.criterion}</p></article>)}</div></section>
    <section style={{ ...panel, margin: "34px 0" }}><h2>Native determinations remain native</h2><p>{x.nativeDeterminationRule}</p><p><strong>Neutral reporting:</strong> {x.neutralReportingGrammar.join(" · ")}</p><p>{x.resultRule}</p></section>
    <section style={{ ...panel, marginTop: 34 }}><h2>Pre-freeze rule</h2><p>This draft is an examination proposal, not a finding. BaseLayerOS claims, version identity, implementation evidence, native determination semantics, boundary declaration, and participant acceptance must be supplied and frozen before execution.</p><p><strong>No architecture rewriting. No authority laundering. No retrospective cleanup. No predetermined winner.</strong></p><Link href="/workspace/ai-governance/examination-engine" style={{ color: "white" }}>← Consequence Examination Engine</Link></section>
  </main>;
}
