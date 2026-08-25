import Link from "next/link";
import {
  adversarialBypassChallenges,
  claimCoverageTemplate,
  consequenceBoundaryStages,
  examinationInvariants,
} from "@/lib/governance/examination-engine";

export const metadata = {
  title: "Consequence Examination Engine | TA-14 Exchange",
  description:
    "Machine-readable invariants, consequence-boundary proof, adversarial bypass examination, replay requirements, and claim-to-proof coverage for bounded governance examinations.",
};

const panel: React.CSSProperties = {
  border: "1px solid rgba(148,163,184,.28)",
  borderRadius: 18,
  padding: 24,
  background: "rgba(15,23,42,.58)",
};

export default function ExaminationEnginePage() {
  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "44px 24px 80px", color: "#e5e7eb" }}>
      <header style={{ marginBottom: 34 }}>
        <p style={{ letterSpacing: ".16em", textTransform: "uppercase", color: "#94a3b8", fontSize: 12 }}>
          TA-14 Exchange · Executable Examination Infrastructure
        </p>
        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)", lineHeight: 1.02, margin: "10px 0 18px" }}>
          Consequence Examination Engine
        </h1>
        <p style={{ maxWidth: 900, fontSize: 19, lineHeight: 1.7, color: "#cbd5e1" }}>
          Registration establishes what an architecture claims. This engine defines how a bounded claim can be challenged at the point where governance must actually control consequence.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
          <Link href="/workspace/ai-governance/adversarial-examination" style={{ color: "#fff" }}>Open Adversarial Examination →</Link>
          <Link href="/artifacts/founding-demonstrations" style={{ color: "#fff" }}>Founding Demonstrations →</Link>
          <Link href="/artifacts/interoperability-examinations" style={{ color: "#fff" }}>Interoperability Examinations →</Link>
        </div>
      </header>

      <section style={{ ...panel, marginBottom: 24 }}>
        <p style={{ color: "#94a3b8", marginTop: 0 }}>THE EXAMINATION RULE</p>
        <h2 style={{ fontSize: 30, marginBottom: 10 }}>A claim does not become proof because it is deterministic, documented, registered, or persuasive.</h2>
        <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: 0 }}>
          A material claim earns standing only to the extent that an attributable implementation object, executable test, boundary receipt, and outcome record support it inside the frozen scope. No architecture receives a predetermined winner, including TA-14.
        </p>
      </section>

      <section style={{ margin: "38px 0" }}>
        <h2>01 · Invariant Registry</h2>
        <p style={{ color: "#94a3b8" }}>Machine-readable propositions that must remain true for governed execution to retain standing.</p>
        <div style={{ display: "grid", gap: 16 }}>
          {examinationInvariants.map((item) => (
            <article key={item.id} style={panel}>
              <small style={{ color: "#94a3b8" }}>{item.id}</small>
              <h3 style={{ fontSize: 22 }}>{item.title}</h3>
              <p style={{ lineHeight: 1.65 }}>{item.proposition}</p>
              <p style={{ color: "#fca5a5" }}><strong>Failure means:</strong> {item.failureMeaning}</p>
              <p style={{ color: "#94a3b8", marginBottom: 8 }}>Required evidence</p>
              <ul>{item.requiredEvidence.map((evidence) => <li key={evidence}>{evidence}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...panel, margin: "38px 0" }}>
        <h2>02 · Consequence-Boundary Proof</h2>
        <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
          The examination must identify the last irreversible boundary and preserve proof on both sides of it. A HOLD, DENY, or ESCALATE is not treated as consequence control merely because an application displayed that determination.
        </p>
        <ol style={{ display: "grid", gap: 10, paddingLeft: 22 }}>
          {consequenceBoundaryStages.map((stage) => <li key={stage}>{stage}</li>)}
        </ol>
        <p style={{ marginBottom: 0 }}><strong>Required question:</strong> Did any consequence-bearing message, token, command, transaction, or materially equivalent action cross the declared boundary?</p>
      </section>

      <section style={{ margin: "38px 0" }}>
        <h2>03 · Adversarial Bypass Harness</h2>
        <p style={{ color: "#94a3b8" }}>The happy path is insufficient. The control boundary must be challenged.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 14 }}>
          {adversarialBypassChallenges.map((challenge) => (
            <article key={challenge.id} style={panel}>
              <small style={{ color: "#94a3b8" }}>{challenge.id}</small>
              <h3>{challenge.label}</h3>
              <p>{challenge.question}</p>
              <p style={{ color: "#cbd5e1" }}><strong>Proof target:</strong> {challenge.expectedProof}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...panel, margin: "38px 0" }}>
        <h2>04 · Independent Replay</h2>
        <p style={{ lineHeight: 1.7 }}>
          Replay is a separately attributable verification object. It uses the exact frozen evidence package, route/version identity, evaluator or implementation identity, invariant set, and declared environment. Replay may confirm or challenge reproducibility; it may not retrospectively rewrite the original determination.
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Minimum replay package:</strong> frozen inputs · hashes · version identities · environment declaration · logical or captured time basis · expected determination · replay receipt · variance report.
        </p>
      </section>

      <section style={{ margin: "38px 0" }}>
        <h2>05 · Claim → Code → Test → Receipt → Outcome</h2>
        <p style={{ color: "#94a3b8" }}>Marketing language receives no special standing. Material claims resolve against evidence.</p>
        <div style={{ overflowX: "auto", ...panel }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 850 }}>
            <thead><tr>{["Claim", "State", "Implementation", "Executable test", "Receipt", "Outcome"].map((h) => <th key={h} style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #334155" }}>{h}</th>)}</tr></thead>
            <tbody>
              {claimCoverageTemplate.map((row) => (
                <tr key={row.claim}>
                  <td style={{ padding: 12, borderBottom: "1px solid #1e293b" }}>{row.claim}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #1e293b" }}>{row.state}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #1e293b" }}>{row.implementationObject}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #1e293b" }}>{row.executableTest}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #1e293b" }}>{row.receipt}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #1e293b" }}>{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ ...panel, marginTop: 38 }}>
        <p style={{ color: "#94a3b8", marginTop: 0 }}>INSTITUTIONAL BOUNDARY</p>
        <h2>Same proposition. Native architecture. Evidence decides.</h2>
        <p style={{ lineHeight: 1.7 }}>
          TA-14 does not require an examined architecture to adopt TA-14 terminology, surrender its authority model, or manufacture interoperability. Freeze the participant&apos;s native claims and non-claims, define the common consequential proposition and acceptance criteria, preserve limitations, then examine what each architecture actually governs.
        </p>
        <p style={{ marginBottom: 0 }}><strong>No architecture rewriting. No authority laundering. No retrospective cleanup. No predetermined winner.</strong></p>
      </section>
    </main>
  );
}
