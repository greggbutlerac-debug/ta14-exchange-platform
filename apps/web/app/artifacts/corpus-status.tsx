import Link from "next/link";

const CORPORA = [
  {
    label: "Founding Corpus",
    range: "TA14-EA-000001 → TA14-EA-000012",
    count: 12,
    detail: "The original twelve bounded execution demonstrations. Historical identity and chronology preserved.",
  },
  {
    label: "Second Corpus",
    range: "TA14-EA-000013 → TA14-EA-000024",
    count: 12,
    detail: "Changed-state, authority, continuity, binding, execution, and outcome cases registered as the second execution corpus.",
  },
  {
    label: "Evidence Hardening Corpus",
    range: "TA14-EA-000025 → TA14-EA-000040",
    count: 16,
    detail: "External-state, correspondence, bypass-resistance, outcome-proof, requalification, independent-reproduction, and end-to-end hardening cases.",
  },
] as const;

export default function ArtifactCorpusStatus() {
  return (
    <section aria-label="TA-14 execution artifact corpus" style={{ margin:"0 auto", maxWidth:1240, padding:"26px 0" }}>
      <div style={{ border:"1px solid rgba(101,231,173,.18)", borderRadius:22, padding:22, background:"linear-gradient(145deg,rgba(7,24,28,.92),rgba(5,12,20,.98))" }}>
        <div style={{ color:"#65e7ad", fontSize:11, fontWeight:900, letterSpacing:".14em", textTransform:"uppercase" }}>TA-14 execution artifact corpus · public institutional state</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"end", gap:18, flexWrap:"wrap", marginTop:8 }}>
          <div>
            <h2 style={{ margin:0, fontSize:"clamp(28px,4vw,46px)" }}>40 TA-14 Execution Artifacts</h2>
            <p style={{ margin:"9px 0 0", maxWidth:850, color:"#a9bdc9", lineHeight:1.65, fontSize:13 }}>
              The founding twelve remain a distinct historical corpus. The institutional library now also recognizes the twelve-record Second Corpus and sixteen-record Evidence Hardening Corpus. Corpus membership does not widen any artifact&apos;s individual claims boundary or confer independent standing.
            </p>
          </div>
          <Link href="/artifacts/registry" style={{ color:"#caffdf", textDecoration:"none", fontWeight:850, fontSize:12, border:"1px solid rgba(101,231,173,.22)", borderRadius:11, padding:"11px 14px" }}>Open complete registry →</Link>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:12, marginTop:20 }}>
          {CORPORA.map((corpus) => (
            <article key={corpus.label} style={{ border:"1px solid rgba(255,255,255,.10)", borderRadius:16, padding:16, background:"rgba(0,0,0,.14)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"baseline" }}>
                <strong style={{ fontSize:14 }}>{corpus.label}</strong>
                <strong style={{ color:"#65e7ad", fontSize:24 }}>{corpus.count}</strong>
              </div>
              <div style={{ marginTop:7, color:"#8ee9ff", fontSize:11, fontWeight:800 }}>{corpus.range}</div>
              <p style={{ margin:"9px 0 0", color:"#9fb4c2", lineHeight:1.55, fontSize:12 }}>{corpus.detail}</p>
            </article>
          ))}
        </div>

        <div style={{ marginTop:16, padding:"12px 14px", borderRadius:12, background:"rgba(244,201,93,.06)", border:"1px solid rgba(244,201,93,.14)", color:"#c8d4da", fontSize:12, lineHeight:1.55 }}>
          <strong style={{ color:"#ffd37b" }}>Integrity boundary:</strong> publication claims remain bounded to preserved evidence. A public artifact record is not, by itself, independent certification, regulatory approval, or independently awarded standing. Unresolved integrity correspondence is preserved and governed rather than silently normalized.
        </div>
      </div>
    </section>
  );
}
