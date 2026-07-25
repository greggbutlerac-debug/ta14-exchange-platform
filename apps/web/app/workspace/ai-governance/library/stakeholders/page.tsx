"use client";

import Link from "next/link";

const categories = [
  {
    title: "Internal Stakeholders",
    items: ["Board", "Executive Leadership", "AI Governance Team", "Legal", "Compliance"]
  },
  {
    title: "Operational Stakeholders",
    items: ["Developers", "Model Owners", "Data Owners", "Risk Owners", "Security Teams"]
  },
  {
    title: "External Stakeholders",
    items: ["Customers", "Partners", "Regulators", "Auditors", "Certification Bodies"]
  },
  {
    title: "Public Interest",
    items: ["Society", "Affected Individuals", "Researchers", "Communities", "Government"]
  }
];

export default function StakeholdersPage() {
  return (
    <main style={{
      padding:"48px",
      background:"#050914",
      color:"#fff",
      fontFamily:"Inter, sans-serif",
      minHeight:"100vh"
    }}>
      <h1>Governance Stakeholders</h1>

      <p style={{maxWidth:900,lineHeight:1.7}}>
        AI governance exists to coordinate responsibilities across people,
        organizations, regulators, partners, and the public. TA-14 preserves
        stakeholder roles, authorities, responsibilities, and decision
        boundaries throughout the governance lifecycle.
      </p>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
        gap:"20px",
        marginTop:"36px"
      }}>
        {categories.map(group => (
          <section key={group.title}
            style={{
              border:"1px solid #2b3d57",
              borderRadius:14,
              padding:20,
              background:"#0b1220"
            }}>
            <h2 style={{fontSize:22}}>{group.title}</h2>
            <ul style={{lineHeight:1.8}}>
              {group.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section style={{marginTop:48}}>
        <h2>TA-14 Perspective</h2>

        <p style={{maxWidth:900,lineHeight:1.7}}>
          Every governance action should preserve who held authority, who made
          the decision, who reviewed it, who was affected, and what evidence
          supported the outcome. Governance becomes reviewable when stakeholder
          responsibilities remain explicit and preserved.
        </p>
      </section>

      <div style={{display:"flex",gap:18,marginTop:40}}>
        <Link href="/workspace/ai-governance/library">
          ← Governance Library
        </Link>

        <Link href="/workspace/routes/new">
          Build Stakeholder Route →
        </Link>
      </div>
    </main>
  );
}
