import Link from "next/link";
import { baselayerCommonExamination as x } from "@/lib/governance/baselayeros-common-examination";

export const metadata = { title: `${x.title} | TA-14 Exchange` };

const panel: React.CSSProperties = { border: "1px solid rgba(148,163,184,.25)", borderRadius: 18, padding: 24, background: "rgba(15,23,42,.58)" };

export default function BaseLayerR1Page() {
  return <main style={{ maxWidth: 1120, margin: "0 auto", padding: "44px 24px 80px", color: "#e5e7eb" }}>
    <p style={{ color: "#94a3b8", letterSpacing: ".14em", fontSize: 12 }}>COMMON EXAMINATION INSTRUMENT · PARTICIPANT FACTUAL REVIEW</p>
    <h1 style={{ fontSize: "clamp(2rem,5vw,4rem)", lineHeight: 1.04 }}>{x.title}</h1>
    <p><strong>{x.instrumentId}</strong> · {x.version}</p>
    <p style={{ color: "#fbbf24", fontWeight: 800 }}>{x.status}</p>

    <section style={{ ...panel, margin: "28px 0" }}><h2>Common proposition</h2><p style={{ lineHeight: 1.75, fontSize: 18 }}>{x.commonProposition}</p></section>

    <section style={{ ...panel, margin: "28px 0" }}><h2>Institutional boundary</h2><p>{x.purpose}</p><ul>{x.nonClaims.map(v => <li key={v} style={{ margin: "8px 0" }}>{v}</li>)}</ul></section>

    <section style={{ margin: "34px 0" }}>
      <h2>Participant factual-review gate</h2>
      <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>Every participant-controlled fact must be confirmed, corrected, or expressly declined before Technical Freeze. TA-14 does not infer participant acceptance from silence, public marketing language, repository visibility, or prior discussion.</p>
      <div style={{ display: "grid", gap: 12 }}>{x.freezeRequirements.map((v, i) => <article key={v} style={panel}><strong>{String(i + 1).padStart(2, "0")} · {v}</strong><p style={{ color: "#94a3b8", marginBottom: 0 }}>State: NOT YET ESTABLISHED</p></article>)}</div>
    </section>

    <section style={{ ...panel, margin: "34px 0" }}>
      <h2>Required participant response</h2>
      <p style={{ lineHeight: 1.7 }}>For each participant-controlled field, BaseLayerOS may respond <strong>CONFIRMED</strong>, <strong>CORRECTED</strong>, <strong>DECLINED / OUT OF SCOPE</strong>, or <strong>INSUFFICIENT INFORMATION</strong>. Corrections become proposed freeze inputs only after both sides can identify the exact object being preserved.</p>
      <p style={{ marginBottom: 0 }}><strong>Factual review is not endorsement.</strong> Confirming that TA-14 accurately represented a BaseLayerOS claim does not establish that the claim is true.</p>
    </section>

    <section style={{ margin: "34px 0" }}><h2>Proposed scenario grammar S0–S7</h2><div style={{ display: "grid", gap: 12 }}>{Object.entries(x.scenario).map(([k,v]) => <article key={k} style={panel}><strong>{k.toUpperCase()}</strong><p>{v}</p><p style={{ color: "#94a3b8", marginBottom: 0 }}>Participant state: PENDING FACTUAL REVIEW</p></article>)}</div></section>

    <section style={{ margin: "34px 0" }}><h2>Proposed acceptance criteria</h2><div style={{ display: "grid", gap: 12 }}>{x.acceptanceCriteria.map(a => <article key={a.id} style={panel}><small style={{ color: "#94a3b8" }}>{a.id}</small><h3>{a.label}</h3><p>{a.criterion}</p><p style={{ color: "#94a3b8", marginBottom: 0 }}>Evidence state: NOT YET EXAMINED</p></article>)}</div></section>

    <section style={{ ...panel, margin: "34px 0" }}><h2>Native determinations remain native</h2><p>{x.nativeDeterminationRule}</p><p><strong>Neutral reporting:</strong> {x.neutralReportingGrammar.join(" · ")}</p><p>{x.resultRule}</p></section>

    <section style={{ ...panel, margin: "34px 0" }}>
      <p style={{ color: "#fbbf24", fontWeight: 900, letterSpacing: ".08em" }}>TECHNICAL FREEZE GATE · CLOSED</p>
      <h2>No execution until the examination object is attributable.</h2>
      <p style={{ lineHeight: 1.7 }}>The gate opens only after participant identity, exact architecture/version, frozen claims and non-claims, implementation identity, native determination semantics, consequence boundary, evidence package, test environment, acceptance criteria, route declarations, replay terms, and publication/confidentiality terms are resolved and preserved.</p>
      <p><strong>No examination result, PASS/FAIL statement, interoperability finding, or comparative superiority claim may issue from this pre-freeze draft.</strong></p>
    </section>

    <section style={{ ...panel, marginTop: 34 }}><h2>Pre-freeze integrity rule</h2><p>This object is an examination proposal, not a finding, certification, validation, or participant endorsement.</p><p><strong>No architecture rewriting. No authority laundering. No retrospective cleanup. No predetermined winner.</strong></p><Link href="/workspace/ai-governance/examination-engine" style={{ color: "white" }}>← Consequence Examination Engine</Link></section>
  </main>;
}
