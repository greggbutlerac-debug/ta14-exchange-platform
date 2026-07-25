"use client";

import Link from "next/link";

const sections = [
  {
    title: "Governance Roles",
    description: "Define accountable roles, decision authorities, delegated responsibilities, and governance ownership."
  },
  {
    title: "Decision Rights",
    description: "Identify who can approve, reject, escalate, review, or execute governed actions."
  },
  {
    title: "Authority Boundaries",
    description: "Preserve the scope, limitations, and conditions under which authority may be exercised."
  },
  {
    title: "Delegation",
    description: "Document delegated authority while maintaining accountability and traceability."
  },
  {
    title: "Separation of Duties",
    description: "Prevent conflicting responsibilities by distributing governance responsibilities across independent roles."
  },
  {
    title: "Governance Accountability",
    description: "Maintain a preserved chain showing who was responsible before, during, and after execution."
  }
];

export default function RolesAuthorityPage() {
  return (
    <main style={{
      padding:"48px",
      background:"#050914",
      color:"#ffffff",
      fontFamily:"Inter, sans-serif",
      minHeight:"100vh"
    }}>
      <h1>Roles & Authority</h1>

      <p style={{maxWidth:920,lineHeight:1.7}}>
        Governance depends on clearly defined authority. TA-14 preserves who
        possessed authority, how it was delegated, where its boundaries
        existed, and which decisions were made under that authority before
        execution occurred.
      </p>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
        gap:"18px",
        marginTop:"36px"
      }}>
        {sections.map(section => (
          <div key={section.title}
            style={{
              border:"1px solid #2d3d57",
              borderRadius:14,
              padding:20,
              background:"#0b1220"
            }}>
            <h2 style={{fontSize:22}}>{section.title}</h2>
            <p style={{color:"#b8c7da",lineHeight:1.6}}>
              {section.description}
            </p>
          </div>
        ))}
      </div>

      <section style={{marginTop:48}}>
        <h2>TA-14 Perspective</h2>

        <p style={{maxWidth:920,lineHeight:1.7}}>
          Authority is not assumed. It should be preserved as evidence,
          associated with the governing record, and connected to the execution
          decision so independent reviewers can determine who was empowered to
          act and under what conditions.
        </p>
      </section>

      <div style={{display:"flex",gap:18,marginTop:40}}>
        <Link href="/workspace/ai-governance/library">
          ← Governance Library
        </Link>

        <Link href="/workspace/routes/new">
          Build Authority Route →
        </Link>
      </div>
    </main>
  );
}
