import Link from "next/link";

export function ConsequenceExaminationStandard({ mode }: { mode: "founding" | "interoperability" }) {
  const interoperability = mode === "interoperability";
  return (
    <section style={{ maxWidth: 1120, width: "90vw", margin: "36px auto 76px", padding: 28, border: "1px solid rgba(109,224,255,.2)", borderRadius: 20, background: "rgba(7,20,31,.8)" }}>
      <p style={{ margin: 0, color: "#78dfff", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>TA-14 CONSEQUENCE EXAMINATION STANDARD</p>
      <h2 style={{ fontSize: "clamp(1.8rem,4vw,3rem)", margin: "10px 0" }}>Registration freezes the claim. Examination determines what it can carry.</h2>
      <p style={{ color: "#b8cad6", lineHeight: 1.7 }}>
        {interoperability
          ? "Interoperability examinations may now apply the same consequence grammar without forcing either architecture to adopt the other architecture's terminology, authority model, or implementation."
          : "Founding demonstrations may now escalate from documentary or bounded proof into consequence examination when the frozen proposition makes runtime control material."}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, margin: "22px 0" }}>
        {["INVARIANTS", "BOUNDARY PROOF", "BYPASS ATTACK", "INDEPENDENT REPLAY", "CLAIM → PROOF"].map((x, i) => (
          <div key={x} style={{ padding: 15, border: "1px solid rgba(255,255,255,.08)", borderRadius: 12 }}>
            <small style={{ color: "#f4ba54" }}>{String(i + 1).padStart(2, "0")}</small><strong style={{ display: "block", marginTop: 5 }}>{x}</strong>
          </div>
        ))}
      </div>
      <p style={{ color: "#9fb6c6", lineHeight: 1.65 }}>
        A material execution claim should resolve through an attributable implementation object, executable test, boundary receipt, and outcome. HOLD, DENY, or ESCALATE is not treated as control merely because a system displayed the determination. The examination asks whether consequence actually remained behind the declared boundary.
      </p>
      <p style={{ color: "#f4ba54", fontWeight: 800 }}>Same proposition. Native architecture. Evidence decides.</p>
      <Link href="/workspace/ai-governance/examination-engine" style={{ display: "inline-flex", marginTop: 8, padding: "12px 16px", borderRadius: 10, background: "linear-gradient(135deg,#d8aa4e,#9a6a1d)", color: "#06111b", fontWeight: 850 }}>
        Open Consequence Examination Engine →
      </Link>
    </section>
  );
}
