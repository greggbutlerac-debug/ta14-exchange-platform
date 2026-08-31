import Link from "next/link";

const boundaries = [
  { code: "01 · CAN", title: "System Assurance", question: "Can the architecture or system perform as claimed?", body: "A successful evaluation establishes bounded capability or assurance under tested conditions. It does not authorize a particular future execution." },
  { code: "02 · MAY", title: "Execution Admissibility", question: "Does this exact consequence have present standing now?", body: "Evidence, authority, identity, scope, continuity, and current conditions must support this exact execution. Historical authorization does not automatically survive material change." },
  { code: "03 · DID", title: "Outcome Verification", question: "What actually occurred after execution?", body: "The executing system’s record is evidence of its own observation. It is not automatically independent proof that the intended consequence occurred in reality." },
] as const;

export default function GovernanceBoundariesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#020913", color: "#f7fbff", padding: "48px 20px" }}>
      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Link href="/workspace/ai-governance" style={{ color: "#8fdff4", textDecoration: "none", fontWeight: 800 }}>← AI Governance Exchange</Link>
        <p style={{ marginTop: 48, color: "#f4bd61", fontWeight: 900, letterSpacing: ".14em", fontSize: 12 }}>TA-14 INSTITUTIONAL BOUNDARY STANDARD</p>
        <h1 style={{ fontSize: "clamp(40px,7vw,78px)", lineHeight: 1, margin: "12px 0 20px", maxWidth: 1000 }}>CAN does not mean MAY. MAY does not prove DID.</h1>
        <p style={{ maxWidth: 900, color: "#a9bdc8", fontSize: 20, lineHeight: 1.65 }}>Consequential governance fails when system capability, present execution standing, and verified outcome collapse into one claim. The Exchange preserves them as separate questions with separate evidentiary burdens.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, marginTop: 42 }}>
          {boundaries.map((item) => <article key={item.code} style={{ border: "1px solid #173449", borderRadius: 20, padding: 26, background: "#061421" }}><span style={{ color: "#f4bd61", fontWeight: 900 }}>{item.code}</span><h2 style={{ fontSize: 28, margin: "12px 0" }}>{item.title}</h2><strong style={{ display: "block", fontSize: 18, lineHeight: 1.45, marginBottom: 16 }}>{item.question}</strong><p style={{ color: "#9fb4c0", lineHeight: 1.7, margin: 0 }}>{item.body}</p></article>)}
        </div>
        <section style={{ marginTop: 28, border: "1px solid #7b6130", borderRadius: 20, padding: 28, background: "#0b1118" }}><p style={{ color: "#f4bd61", fontWeight: 900 }}>PRESENT-STANDING DOCTRINE</p><h2>Authority is a condition of present execution standing, not merely a stored fact of historical authorization.</h2><p style={{ color: "#b7c6ce", lineHeight: 1.7 }}>An authorization may remain historically valid while losing present standing before execution. Material change in evidence, authority, identity, scope, environment, dependencies, or other governed conditions requires renewed determination rather than inherited permission.</p></section>
        <section style={{ marginTop: 18, border: "1px solid #23465b", borderRadius: 20, padding: 28, background: "#061421" }}><p style={{ color: "#8fdff4", fontWeight: 900 }}>CONTINUITY BOUNDARY</p><h2>Continuity of identity does not guarantee continuity of standing.</h2><p style={{ color: "#b7c6ce", lineHeight: 1.7 }}>A governed object can remain the same object while the evidence or authority supporting its next consequence no longer has present standing. Continuity asks whether identity survives change. Admissibility asks whether present conditions justify what happens next.</p></section>
        <div style={{ marginTop: 34, padding: 26, borderRadius: 18, background: "#f4bd61", color: "#081018" }}><strong>No admissible evidence. No admissible execution.</strong></div>
      </section>
    </main>
  );
}
