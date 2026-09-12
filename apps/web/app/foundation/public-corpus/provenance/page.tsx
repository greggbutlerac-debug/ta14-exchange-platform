import Link from "next/link";
import { PROVENANCE_EVIDENCE_CORPUS_RECORDS } from "../corpus-provenance-evidence";

const evidence = [...PROVENANCE_EVIDENCE_CORPUS_RECORDS].sort((a, b) => (a.date || `${a.year}-01-01`).localeCompare(b.date || `${b.year}-01-01`));

export default function ProvenanceChronologyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(circle at 50% -10%,#123651 0,#06111d 38%,#040b13 100%)", color: "#eef5ff", padding: "32px 24px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <nav style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 42 }}>
          <Link href="/foundation/public-corpus">Complete Public Corpus</Link><Link href="/foundation">TA-14 Foundation</Link><Link href="/registry">Registry</Link><Link href="/workspace">Open Exchange</Link>
        </nav>

        <section style={{ maxWidth: 980, marginBottom: 42 }}>
          <div style={{ letterSpacing: 2, fontSize: 12, fontWeight: 900, color: "#70ddff" }}>TA-14 FOUNDATION • PROVENANCE & ANTECEDENCE</div>
          <h1 style={{ fontSize: "clamp(42px,7vw,82px)", lineHeight: .98, margin: "18px 0" }}>The institutional chronology.</h1>
          <p style={{ fontSize: 19, lineHeight: 1.7, opacity: .82 }}>A public, inspectable route for provenance challenges. This page shows what the preserved TA-14 corpus establishes, when the relevant evidence entered the record, what later exposure pathways are documented, and where the evidence stops.</p>
        </section>

        <section style={{ padding: 28, border: "1px solid #28556f", borderRadius: 24, background: "#091b2a", marginBottom: 44 }}>
          <div style={{ letterSpacing: 2, fontSize: 11, fontWeight: 900, color: "#f5c76b" }}>PROVENANCE BURDEN</div>
          <h2 style={{ fontSize: 32, margin: "10px 0" }}>A similarity claim is not a provenance finding.</h2>
          <p style={{ lineHeight: 1.75, opacity: .82, marginBottom: 8 }}>A directional influence claim should establish the antecedent proposition or artifact, exposure, a successor change, and a documentary causal bridge. Respondent silence cannot supply a missing element.</p>
          <strong>Antecedence ≠ derivation. Exposure ≠ causation. Collaboration ≠ derivation.</strong>
        </section>

        <section style={{ marginBottom: 48 }}>
          <div style={{ letterSpacing: 2, fontSize: 11, fontWeight: 900, color: "#70ddff" }}>INSPECTABLE TIMELINE</div>
          <h2 style={{ fontSize: "clamp(30px,4vw,50px)", margin: "10px 0 28px" }}>Show the artifact. Show the date. Show the causal bridge.</h2>
          <div style={{ position: "relative" }}>
            <div aria-hidden="true" style={{ position: "absolute", left: 20, top: 8, bottom: 8, width: 1, background: "linear-gradient(#5ee1ff,#f5c76b)" }} />
            {evidence.map((record) => (
              <article key={record.id} style={{ position: "relative", padding: "0 0 34px 62px" }}>
                <div aria-hidden="true" style={{ position: "absolute", left: 11, top: 7, width: 19, height: 19, borderRadius: "50%", background: "#65defa", boxShadow: "0 0 22px rgba(101,222,250,.45)" }} />
                <div style={{ color: "#f5c76b", fontWeight: 900 }}>{record.date || record.year}</div>
                <h3 style={{ fontSize: 25, margin: "7px 0" }}>{record.title}</h3>
                <p style={{ lineHeight: 1.65, opacity: .78, margin: "0 0 8px" }}>{record.description}</p>
                {record.relationship && <p style={{ lineHeight: 1.65, opacity: .72, margin: "0 0 12px" }}><strong style={{ color: "#eef5ff" }}>Institutional relationship:</strong> {record.relationship}</p>}
                <Link href={`/foundation/public-corpus/${record.id}`} style={{ color: "#82e7ff", fontWeight: 800 }}>Inspect corpus record →</Link>
              </article>
            ))}
          </div>
        </section>

        <section style={{ padding: 28, border: "1px solid #21435c", borderRadius: 22, background: "linear-gradient(145deg,#0b2435,#071724)", marginBottom: 44 }}>
          <div style={{ letterSpacing: 2, fontSize: 11, fontWeight: 900, color: "#70ddff" }}>HOW TO CHALLENGE THE RECORD</div>
          <h2 style={{ fontSize: 30, margin: "10px 0" }}>If you assert influence, identify the missing link.</h2>
          <p style={{ lineHeight: 1.75, opacity: .8 }}>Identify the exact proposition, your independently dated antecedent artifact, the exposure event, the later TA-14 change you contend followed, and evidence connecting that change to the exposure. Where evidence establishes antecedence, contribution, independent convergence, or influence, the institutional record should preserve it at that bounded level.</p>
          <Link href="/foundation/public-corpus" style={{ color: "#82e7ff", fontWeight: 800 }}>Search the complete corpus →</Link>
        </section>

        <section style={{ paddingTop: 28, borderTop: "1px solid #21435c", opacity: .82 }}>
          <div style={{ letterSpacing: 2, fontSize: 11, fontWeight: 900, color: "#70ddff" }}>EVIDENTIARY CEILING</div>
          <h2>Chronology establishes only what its evidence supports.</h2>
          <p style={{ lineHeight: 1.7 }}>A publication date can establish public availability. An exposure record can establish an exposure pathway. A successor artifact can establish change. None of those facts alone proves copying, infringement, breach, ownership transfer, bad faith, misconduct, or causation.</p>
          <strong>No admissible evidence. No admissible execution.</strong>
        </section>
      </div>
    </main>
  );
}
