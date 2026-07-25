"use client";

import Link from "next/link";

const artifacts = [
  "Policies",
  "Standards",
  "Controls",
  "Procedures",
  "Evidence",
  "Governed Records",
  "Execution Receipts",
  "Outcome Records",
];

export default function DocumentationPage() {
  return (
    <main style={{
      padding:"48px",
      fontFamily:"Inter, sans-serif",
      background:"#050914",
      color:"#ffffff",
      minHeight:"100vh"
    }}>
      <h1>Governance Documentation</h1>

      <p style={{maxWidth:"900px",lineHeight:1.7}}>
        Documentation preserves organizational intent, governance decisions,
        supporting evidence, execution history, and retained outcomes.
        TA-14 distinguishes documentation from evidence while ensuring each
        document has preserved authority, ownership, and interpretation.
      </p>

      <h2 style={{marginTop:36}}>Documentation Types</h2>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
        gap:"16px",
        marginTop:"20px"
      }}>
        {artifacts.map(item => (
          <div key={item}
            style={{
              border:"1px solid #2c3c56",
              borderRadius:14,
              padding:18,
              background:"#0b1220"
            }}>
            <strong>{item}</strong>
          </div>
        ))}
      </div>

      <section style={{marginTop:48}}>
        <h2>TA-14 Perspective</h2>

        <p style={{maxWidth:"900px",lineHeight:1.7}}>
          Documentation supports governance but does not independently establish
          admissibility. Every important document should preserve its author,
          authority, version history, interpretation boundary, applicable
          scope, and relationship to execution records.
        </p>
      </section>

      <div style={{
        display:"flex",
        gap:"18px",
        marginTop:"42px"
      }}>
        <Link href="/workspace/ai-governance/library">
          ← Governance Library
        </Link>

        <Link href="/workspace/routes/new">
          Build Documentation Route →
        </Link>
      </div>
    </main>
  );
}
