import Link from "next/link";
import { baselayerParticipantIntake as intake } from "@/lib/governance/baselayeros-participant-intake";

export const metadata = { title: "BaseLayerOS R1 Participant Intake | TA-14 Exchange" };
const card: React.CSSProperties = { border: "1px solid rgba(148,163,184,.26)", borderRadius: 16, padding: 22, background: "rgba(15,23,42,.58)" };

export default function BaseLayerIntakePage() {
  return <main style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 24px 80px", color: "#e5e7eb" }}>
    <p style={{ color: "#94a3b8", letterSpacing: ".14em", fontSize: 12 }}>TA-14 CONSEQUENCE EXAMINATION · PARTICIPANT INTAKE</p>
    <h1 style={{ fontSize: "clamp(2.2rem,5vw,4.2rem)", lineHeight: 1.03 }}>BaseLayerOS R1 Participant Intake</h1>
    <p><strong>{intake.intakeId}</strong></p><p style={{ color: "#fbbf24", fontWeight: 850 }}>{intake.status}</p>
    <section style={{ ...card, margin: "28px 0" }}><h2>How to respond</h2><p>For every participant-controlled field, provide the factual answer and mark it as one of:</p><p><strong>{intake.participantResponseStates.join(" · ")}</strong></p><p style={{ marginBottom: 0 }}>Corrections are welcome. A disagreement is preserved as a disagreement. Silence is not acceptance.</p></section>
    <div style={{ display: "grid", gap: 18 }}>{intake.sections.map(section => <section key={section.id} style={card}><small style={{ color: "#94a3b8" }}>{section.id}</small><h2>{section.title}</h2><ol>{section.fields.map(field => <li key={field} style={{ margin: "12px 0" }}><strong>{field}</strong><div style={{ marginTop: 7, padding: 12, border: "1px dashed rgba(148,163,184,.3)", borderRadius: 10, color: "#94a3b8" }}>Participant response: ____________________<br/>Response state: ____________________</div></li>)}</ol></section>)}</div>
    <section style={{ ...card, margin: "28px 0" }}><h2>Participant declarations</h2><ul>{intake.declarations.map(d => <li key={d} style={{ margin: "10px 0" }}>{d}</li>)}</ul></section>
    <section style={{ ...card, marginTop: 28 }}><p style={{ color: "#fbbf24", fontWeight: 900 }}>TECHNICAL FREEZE REMAINS CLOSED</p><p>Completing this intake does not itself open Technical Freeze. TA-14 must reconcile the participant response against the proposed R1 object, preserve corrections and unresolved conditions, establish exact artifact identities, and issue a separately identifiable freeze record.</p><p><strong>No architecture rewriting. No authority laundering. No retrospective cleanup. No predetermined winner.</strong></p><Link href="/workspace/ai-governance/examination-engine/baselayeros-r1" style={{ color: "white" }}>← R1 Participant Review</Link></section>
  </main>;
}
